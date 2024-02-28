const Discord = require('discord.js');
module.exports = {
  async execute(giveaway, member, reaction) {
    reaction.users.remove(member.user);
    member.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Розыгрыш уже закончился!`)
            .setColor('#b50505')
            .setDescription(
              `Hey ${member.user} **[[Розыгрыш]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** , на который вы отреагировали, уже закончился :sob:\nВ следующий раз поторопитесь!`
            )
            .setTimestamp(),
        ],
      })
      .catch((e) => {});
  },
};
