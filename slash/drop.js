const messages = require("../utils/message");
const {  ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'drop',
    description: 'Создайте розыгрыш призов',
    options: [
        {
            name: 'winners',
            description: 'Сколько победителей должно быть в розыгрыше',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: 'Каким должен быть приз розыгрыша',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'Канал, на котором начнется розыгрыш',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if(!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: ':x: Чтобы начать розыгрыши, вам необходимо иметь разрешение на управление сообщениями.',
                ephemeral: true
            });
        }

        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');
      
    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Пожалуйста, выберите текстовый канал!',
        ephemeral: true
      });
    }   
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Пожалуйста, выберите допустимое количество победителей! больше или равно единице.',
      })
    }

        // Start the giveaway
        client.giveawaysManager.start(giveawayChannel, {
            // The number of winners for this drop
            winnerCount: giveawayWinnerCount,
            // The prize of the giveaway
            prize: giveawayPrize,
            // Who hosts this giveaway
            hostedBy: client.config.hostedBy ? interaction.user : null,
            // specify drop
            isDrop: true,
            // Messages
            messages
        });

        interaction.reply(`Розыгрыш начался в ${giveawayChannel}!`);

    }
};