const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **НОВЫЙ РОЗЫГРЫШ** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **РОЗЫГРЫШ ЗАКОНЧЕН** 🎉",
  drawing:  `Заканчивается: **{timestamp}**`,
  inviteToParticipate: `Реагируй с 🎉 что-бы участвовать!`,
  winMessage: "Мои поздравления, {winners}! Ты выиграл **{this.prize}**!",
  embedFooter: "{this.winnerCount} победитель(и)",
  noWinner: "Розыгрыш отменен, определёных участников нет.",
  hostedBy: "Создатель розыгрыша: {this.hostedBy}",
  winners: "победитель(и)",
  endedAt: "Закончилось в"
}
