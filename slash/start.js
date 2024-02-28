const Discord = require("discord.js")
const {  ApplicationCommandOptionType } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 Запустите розыгрыш призов',

  options: [
    {
      name: 'duration',
      description: 'Как долго должен длиться розыгрыш. Примерные значения: 1m, 1h, 1d',
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
    },
    {
      name: 'channel',
      description: 'Канал, на котором начнется розыгрыш призов',
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: 'bonusrole',
      description: 'Роль, которая получит бонусные записи',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
    {
      name: 'bonusamount',
      description: 'Количество бонусных записей, которые получит роль',
      type: ApplicationCommandOptionType.Integer,
      required: false
    },
    {
      name: 'invite',
      description: 'Приглашение сервера, которое вы хотите добавить в качестве требования к участию в розыгрыше призов',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'role',
      description: 'Роль, которую вы хотите добавить в качестве требования к участию в розыгрыше призов',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Чтобы начать раздачу подарков, у вас должны быть разрешения на управление сообщениями.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Пожалуйста, выберите текстовый канал!',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: ':x: Пожалуйста, выберите допустимую продолжительность!',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Пожалуйста, выберите допустимое количество победителей! больше или равно единице.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: You must specify how many bonus entries would ${bonusRole} recieve!`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
          const gaEmbed = {
            author: {
              name: client.user.username,
              iconURL: client.user.displayAvatarURL() 
            },
            title: "Server Check!",
            url: "https://youtube.com/c/ZeroSync",
            description:
              "Ого, ого, ого! Я вижу новый сервер! вы уверены, что я на нем? Вам нужно пригласить меня туда, чтобы установить это как требование! 😳",
            timestamp: new Date(),
            footer: {
              iconURL: client.user.displayAvatarURL(),
              text: "Server Check"
            }
          }  
        return interaction.editReply({ embeds: [gaEmbed]})
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**Реагируйте с помощью 🎉 для участия!**\n>>> -  ${rolereq} К участию в этом розыгрыше допускаются только участники, имеющие!`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**Реагируйте с помощью 🎉 для участия!**\n>>> -  ${rolereq} К участию в этом розыгрыше допускаются только участники, имеющие!\n-  [this server](${invite}) Для участия в этом розыгрыше необходимо зарегистрироваться!`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**Реагируйте с 🎉 помощью для участия!**\n>>> -  [this server](${invite}) Для участия в этом розыгрыше необходимо зарегистрироваться!`
    }


    // start giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      duration: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: parseInt(giveawayWinnerCount),
      // Hosted by
      hostedBy: client.config.hostedBy ? interaction.user : null,
      // BonusEntries If Provided
      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Розыгрыш начался в ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.EmbedBuilder()
        .setAuthor({ name: `Внимание к бонусным записям!` })
        .setDescription(
          `**${bonusRole}** Имеет **${bonusEntries}** Дополнительные заявки на участие в этом розыгрыше призов!`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};
