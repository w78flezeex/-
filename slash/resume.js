const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "resume",
    description: '▶ Возобновить приостановленный розыгрыш призов',

    options: [
        {
            name: 'giveaway',
            description: 'Способ возобновления розыгрыша (идентификатор сообщения или приз для розыгрыша призов)',
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
                content: 'Не удалось найти раздачу для `' + query + '`.',
                ephemeral: true
            });
        }

        if (!giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**[Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  не приостановлено!`,
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.unpause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**[Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** успешно возобновлено!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
