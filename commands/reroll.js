const ms = require('ms');
module.exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.permissions.has('ManageMessages') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.reply(':x: У вас должны быть разрешения на управление сообщениями для повторного проведения розыгрышей..');
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return message.reply(':x: Вы должны указать действительный идентификатор сообщения!');
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.reply('Не удается найти розыгрыш для `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.reply('Розыгрыш повторен!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.reply('Этот розыгрыш не завершен!');
        } else {
            console.error(e);
            message.reply(e);
        }
    });

};
