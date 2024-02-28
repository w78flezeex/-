const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Поехали! У Нас Новый Победитель`)
          .setColor("#2F3136")
          .setDescription(`Привет ${member.user}\n Я слышал, что ведущий провел повторный розыгрыш, и вы выиграли **[[Этот розыгрыш призов]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Good Job On Winning **${giveaway.prize}!**\nОтправьте прямое сообщение ведущему, чтобы получить свой приз!!`)
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
