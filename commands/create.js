const Discord = require('discord.js'),
  { EmbedBuilder } = Discord,
  parsec = require('parsec'),
  messages = require('../utils/message');

module.exports.run = async (client, message) => {
    // If the member doesn't have enough permissions
    if (
      !message.member.permissions.has("ManageMessages") &&
      !message.member.roles.cache.some(r => r.name === "Giveaways")
    ) {
      return message.reply(
        ":x: Чтобы начать раздачу подарков, у вас должны быть разрешения на управление сообщениями."
      );
    }
    
  const collector = message.channel.createMessageCollector({
    filter: (m) => m.author.id === message.author.id,
    time: 60000,
  });

  let xembed = new EmbedBuilder()
  .setTitle("Упс! Похоже, У Нас Был Тайм-Аут! 🕖")
  .setColor("#FF0000")
  .setDescription('💥 Попытайте счастья!\вам потребовалось слишком много времени, чтобы принять решение!\Нажмите `создать` еще раз, чтобы начать новый розыгрыш!\запись для ответа в течение **30 секунд** на этот раз!')
  .setFooter({
     text: `${client.user.username}`,
     iconURL: client.user.displayAvatarURL()
  })  
  .setTimestamp()


  function waitingEmbed(title, desc) {
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${message.author.tag} + ' | Настройка раздачи'`,
            iconURL: message.member.displayAvatarURL()
          })
          .setTitle('Giveaway ' + title)
          .setDescription(desc + ' в течение следующих 60 секунд.')
          .setFooter({
            text: "Введите 'cancel' , чтобы завершить этот процесс.",
            iconURL: client.user.displayAvatarURL()
           })
          .setTimestamp()
          .setColor('#2F3136'),
      ],

    });
  }

  let winnerCount, channel, duration, prize, cancelled;

  await waitingEmbed('Приз', 'Пожалуйста, пришлите розыгрыш приза');

  collector.on('collect', async (m) => {
    if (cancelled) return;

    async function failed(options, ...cancel) {
      if (typeof cancel[0] === 'boolean')
        (cancelled = true) && (await m.reply(options));
      else {
        await m.reply(
          options instanceof EmbedBuilder ? { embeds: [options] } : options
        );
        return await waitingEmbed(...cancel);
      }
    }

    if (m.content === 'cancel'){ 
  collector.stop()
 return await failed('Отменено создание розыгрыша призов.', true) 
}

    switch (true) {
      case !prize: {
        if (m.content.length > 256)
          return await failed(
            'Длина приза не может превышать 256 символов.',
            'Приз',
            'Пожалуйста, пришлите розыгрыш приза'
          );
        else {
          prize = m.content;
          await waitingEmbed('Канал', 'Пожалуйста, пришлите канал для розыгрыша призов');
        }

        break;
      }

      case !channel: {
        if (!(_channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content)))
          return await failed(
            'Пожалуйста, пришлите действительный канал / идентификатор канала.',
            'Канал',
            'Пожалуйста, пришлите канал с раздачей подарков'
          );
        else if (!_channel.isTextBased())
          return await failed(
            'Канал должен быть текстовым.',
            'Канал',
            'Пожалуйста, пришлите канал с раздачей подарков'
          );
        else {
          channel = _channel;
          await waitingEmbed(
            'Количество победителей',
            'Пожалуйста, отправьте количество победителей розыгрыша.'
          );
        }

        break;
      }

      case !winnerCount: {
        if (!(_w = parseInt(m.content)))
          return await failed(
            'Количество победителей должно быть целым числом.',

            'Количество победителей',
            'Пожалуйста, отправьте количество победителей розыгрыша.'
          );
        if (_w < 1)
          return await failed(
            'Количество победителей должно быть больше 1.',
            'Количество победителей',
            'Пожалуйста, отправьте количество победителей розыгрыша.'
          );
        else if (_w > 15)
          return await failed(
            'Количество победителей должно быть меньше 15.',
            'Количество победителей',
            'Пожалуйста, пришлите количество победителей розыгрыша.'
          );
        else {
          winnerCount = _w;
          await waitingEmbed('Продолжительность', 'Пожалуйста, пришлите продолжительность розыгрыша');
        }

        break;
      }

      case !duration: {
        if (!(_d = parsec(m.content).duration))
          return await failed(
            'Пожалуйста, укажите действительную продолжительность.',
            'Продолжительность',
            'Пожалуйста, пришлите продолжительность розыгрыша'
          );
        if (_d > parsec('21d').duration)
          return await failed(
            'Продолжительность должна составлять менее 21 дня!',
            'Продолжительность',
            'Пожалуйста, пришлите продолжительность розыгрыша'
          );
        else {
          duration = _d;
        }

        return client.giveawaysManager.start(channel, {
          prize,
          duration,
          winnerCount,
          hostedBy: client.config.hostedBy ? message.author : null,
          messages,
        });
      }
    }
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
       message.reply({ embeds: [xembed]})
    }
  })
};
