const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "end",
    description: '🎉 Завершите уже запущенный розыгрыш призов',

    options: [
        {
            name: 'giveaway',
            description: 'Завершающий розыгрыш (идентификатор сообщения или приз за розыгрыш призов)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Для завершения розыгрышей вам необходимо иметь разрешения на управление сообщениями.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // fetching the giveaway with message Id or prize
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway Id
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found with the corresponding input
        if (!giveaway) {
            return interaction.reply({
                content: 'Не удалось найти розыгрыш для `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Этот розыгрыш уже закончился!',
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.end(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**[Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** Теперь все закончилось!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};