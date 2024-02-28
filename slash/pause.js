const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "pause",
    description: '⏸ Приостановить розыгрыш призов',

    options: [
        {
            name: 'giveaway',
            description: 'Способ приостановки розыгрыша (идентификатор сообщения или приз для розыгрыша призов)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Для приостановки розыгрышей призов у вас должны быть разрешения на управление сообщениями.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // try to find the giveaway with prize alternatively with ID
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.reply({
                content: 'Не удалось найти розыгрыш для `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**[Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  уже приостановлен.`,
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.pause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**[Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** теперь приостановлен!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
