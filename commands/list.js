const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
  const select = new Discord.SelectMenuBuilder().setCustomId("select").setPlaceholder("Выберите тип раздачи для просмотра!").addOptions([
    {
      label: '🎉 Обычные раздачи',
      description: 'Проверьте обычные раздачи, которые в данный момент запущены на вашем сервере!',
      value: 'normal',
    },
  ])
  const row = new Discord.ActionRowBuilder().addComponents([select])
  let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${message.guild.id}` && !g.ended);
  if (!giveaways.some(e => e.messageId)) {
    return message.reply('💥 Раздачи не будут отображаться')
  }
  const msg = await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription("Выберите опцию в меню выбора, чтобы начать работу!").setColor("#2F3136").setTimestamp()], components: [row] })
  let embed = new Discord.EmbedBuilder()
    .setTitle("Активные в данный момент раздачи")
    .setColor("#2F3136")
    .setFooter({
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp()

  const filter = x => x.customId == "select" && x.user.id == message.author.id
  const collector = await message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
  collector.on("collect", async (i) => {
    i.update({ components: [] });
    const val = i.values[0]
    if (val == "normal") {
      await Promise.all(giveaways.map(async (x) => {
            embed.addFields({ name:
              `Обычная раздача подарков:`, value: `**Приз:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\nНачатый:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Ends:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`
              });
      }));
     msg.edit({ embeds: [embed] })
    }

  })
  collector.on("end",(collected, reason) => {
   if(reason == "time")
   msg.edit({ content: "👀 Коллекционер уничтожен, попробуйте еще раз!", components: [] })
  })
}

