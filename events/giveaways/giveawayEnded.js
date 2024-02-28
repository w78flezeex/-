const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Let's goo!`)
          .setColor("#2F3136")
          .setDescription(`Привет ${member.user}\n Я слышал, что вы выиграли **[[Этот розыгрыш призов]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Отличная работа над Победой **${giveaway.prize}!**\nОтправьте прямое сообщение ведущему, чтобы получить свой приз!!`)
          .setTimestamp()
          .setFooter({
            text: `${member.user.username}`, 
            iconURL: member.user.displayAvatarURL()
           })
        ]
      }).catch(e => {})
    });

  }
}
