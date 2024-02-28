const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved =  new Discord.EmbedBuilder()
    .setTimestamp()
    .setColor("#2F3136")
    .setTitle("Заявка одобрена! | У вас есть шанс выиграть!!")
    .setDescription(
      `Ваша заявка на участие в [Розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) одобрен!`
    )
    .setFooter({ text: "Удачи в след. розыгрыше !" })
    .setTimestamp()
   let denied =  new Discord.EmbedBuilder()
    .setTimestamp()
    .setColor("#2F3136")
    .setTitle(":x: Вход запрещен | Запись в базе данных не найдена и не возвращ")
    .setDescription(
      `Ваша заявка на участие в [В розыгрыше](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) было отказано, пожалуйста, внимательно ознакомьтесь с требованиями к розыгрышу.`
    )
    .setFooter({ text: "Удачи в след. розыгрыше !" })

    let client = messageReaction.message.client
    if (reactor.user.bot) return;
    if(giveaway.extraData) {
      if (giveaway.extraData.server !== "null") {
        try { 
        await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
        return reactor.send({
          embeds: [approved]
        });
        } catch(e) {
          messageReaction.users.remove(reactor.user);
          return reactor.send({
            embeds: [denied]
          }).catch(e => {})
        }
      }
      if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)){ 
        messageReaction.users.remove(reactor.user);
        return reactor.send({
          embeds: [denied]
        }).catch(e => {})
      }

      return reactor.send({
        embeds: [approved]
      }).catch(e => {})
    } else {
        return reactor.send({
          embeds: [approved]
        }).catch(e => {})
    }
    }
  }
