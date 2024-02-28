const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'invite',
    description: '➕ Пригласите бота на свой сервер!',
    run: async (client, interaction) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel(`Приглосить ${client.user.username}`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=499595256270946326=${client.user.id}permissions=1342500081&scope=applications.commands%20bot`),
        new ButtonBuilder()
        .setLabel('Сервер поддержки')
        .setStyle(ButtonStyle.Link)
        .setURL("Сюда ваш дс сервер"),
    )
    let invite = new EmbedBuilder()
      .setAuthor({ 
          name: `Пригласить ${client.user.username}`, 
          iconURL: client.user.displayAvatarURL() 
      })    
    .setTitle("Ссылка на приглашение и поддержку!")
    .setDescription(`Пригласите ${client.user} на свой сервер сегодня и наслаждайтесь беспроигрышными розыгрышами с расширенными функциями!`)
    .setColor('#2F3136')
    .setTimestamp()
    .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
    })
    
    interaction.reply({ embeds: [invite], components: [row]});
}
}
