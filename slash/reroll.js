const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "reroll",
    description: '🎉 Повторный розыгрыш призов',

    options: [
        {
            name: 'giveaway',
            description: 'Приз для повторного розыгрыша (идентификатор сообщения или приз)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Для повторного розыгрыша призов у вас должно быть разрешение на управление сообщениями.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // try to find the giveaway with the provided prize OR with the ID
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

        if (!giveaway.ended) {
            return interaction.reply({
                content: `[Этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) еще не закончился`,
                ephemeral: true
            });
        }

        // Reroll the giveaway
        client.giveawaysManager.reroll(giveaway.messageId)
            .then(() => {
                // Success message
                interaction.reply(`Повторно разыграл **[этот розыгрыш](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!**`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
