const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'свист',
    description: '🏓Проверьте мой пинг!',
    run: async (client, interaction) => {
      let pembed = new EmbedBuilder()
		  .setColor('#2F3136')	
		  .setTitle('Пинг клиента')
		  .addFields({ name: '**Задержка**', 
                   value: `\`${Date.now() - interaction.createdTimestamp}ms\``
                 })
		  .addFields({ name: '**Задержка API**', 
                   value: `\`${Math.round(client.ws.ping)}ms\``
                 })
		  .setTimestamp()
                  .setFooter({
                     text: `${interaction.user.username}`,
                     iconURL: interaction.user.displayAvatarURL()
                  })
        interaction.reply({
          embeds: [pembed]
        });
    },
};
