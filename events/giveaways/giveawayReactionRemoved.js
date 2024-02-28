const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.EmbedBuilder()
        .setTimestamp()
        .setTitle('❓ Подождите, Вы только что удалили реакцию с Розыгрыша?')
        .setColor("#2F3136")
        .setDescription(
          `Ваша запись на [Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) был записан, но вы не отреагировали, так как вам это не нужно **${giveaway.prize}** Мне пришлось бы выбрать кого-то другого 😭`
        )
        .setFooter({ text: "Думаете, это была ошибка? Зайдите и отреагируйте еще раз!" })
      ]
    }).catch(e => {})

  }
}
