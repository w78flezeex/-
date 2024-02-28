const messages = require("../utils/message");
module.exports.run = async (client, message, args) => {
  // If the member doesn't have enough permissions
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: У вас должны быть права на управление сообщениями, чтобы начать розыгрыши призов."
    );
  }

  // Giveaway channel
  let giveawayChannel = message.mentions.channels.first();
  // If no channel is mentionned
  if (!giveawayChannel) {
    return message.reply(":x: Вы должны указать действующий канал!");
  }

  // Number of winners
  let giveawayNumberWinners = parseInt(args[1]);
  // If the specified number of winners is not a number
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      ":x: Вы должны указать действительное количество победителей!"
    );
  }

  // Giveaway prize
  let giveawayPrize = args.slice(2).join(" ");
  // If no prize is specified
  if (!giveawayPrize) {
    return message.reply(":x: Вы должны указать действительный приз!");
  }
  // Start the giveaway
  await client.giveawaysManager.start(giveawayChannel, {
    // The giveaway prize
    prize: giveawayPrize,
    // The giveaway winner count
    winnerCount: parseInt(giveawayNumberWinners),
    // Who hosts this giveaway
    hostedBy: client.config.hostedBy ? message.author : null,
    // specify drop
    isDrop: true,
    // Messages
    messages
  });
  message.reply(`Giveaway started in ${giveawayChannel}!`);
}
