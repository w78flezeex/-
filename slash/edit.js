const { ApplicationCommandOptionType } = require('discord.js');
const ms = require("ms");

module.exports = {
  name: 'edit',
  description: '🎉 Редактировать раздачу',

  options: [
    {
      name: 'giveaway',
      description: 'Раздача до конца (идентификатор сообщения)',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'duration',
      description: 'Назначение времени проведения упомянутого розыгрыша. Например. 1h означает, что текущая раздача завершится через час!',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'winners',
      description: 'Сколько победителей должно быть в розыгрыше призов',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'prize',
      description: 'Каким должен быть приз в розыгрыше призов',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Чтобы начать раздачу подарков, у вас должны быть разрешения на управление сообщениями.',
        ephemeral: true
      });
    }
    const gid = interaction.options.getString('giveaway');
    const time = interaction.options.getString('duration');
    const winnersCount = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    let duration;
    if (time.startsWith("-")) {
      duration = -ms(time.substring(1));
    } else {
      duration = ms(time);
    }

    if (isNaN(duration)) {
      return interaction.reply({
        content: ":x: Пожалуйста, выберите действительный срок действия!",
        ephemeral: true,
      });
    }
    await interaction.deferReply({
      ephemeral: true
    })
    // Edit the giveaway
    try {
      await client.giveawaysManager.edit(gid, {
        newWinnerCount: winnersCount,
        newPrize: prize,
        addTime: time
      })
    } catch (e) {
      return interaction.editReply({
        content:
          `Не найдено поддавки с указанным идентификатором сообщения: \`${gid}\``,
        ephemeral: true
      });
    }
    interaction.editReply({
      content:
        `Этот розыгрыш теперь отредактирован!`,
      ephemeral: true
    });
  }

};
