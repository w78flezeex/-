module.exports.run = async (client, message) => {
    const Discord = require("discord.js");
    const ms = require("ms");

      // If the member doesn't have enough permissions
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Чтобы начать раздачу подарков, у вас должны быть разрешения на управление сообщениями."
    );
  }
  
    let time = "";
    let winnersCount;
    let prize = "";
    let giveawayx = "";
    let embed = new Discord.EmbedBuilder()
      .setTitle("Edit A Giveaway!")
      .setColor('#2F3136')
      .setFooter({ 
        text: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();
    const msg = await message.reply({
      embeds:
        [embed.setDescription(
          "Какой Розыгрыш Вы Хотели Бы Отредактировать?\укажите идентификатор Сообщения о Розыгрыше \n ** Необходимо ответить в течение 30 секунд!**"
        )]
    }
    );
    let xembed = new Discord.EmbedBuilder()
      .setTitle("Упс! Похоже, У нас был Тайм-аут! 🕖")
      .setColor("#FF0000")
      .setDescription('💥 Попытай счастья!\nТебе потребовалось слишком много времени, чтобы принять решение!\nИспользуйте ``edit`` еще раз, чтобы отредактировать раздачу!\nПостарайтесь ответить в течение **На этот раз 30 секунд!**')
      .setFooter({ 
        text: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();
  
    const filter = m => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
  
    collector.on("collect", async collect => {
  
      const response = collect.content;
      let gid = response;
      // check if the ID is valid

      
      await collect.delete()
        if (!client.giveawaysManager.giveaways.find((g) => g.messageID === gid)) {
           return msg.edit({
                embeds: [
                  embed.setDescription(
                    "О-о-о! Похоже, вы указали неверный идентификатор сообщения!\n**Попробуйте еще раз?**\n Пример: ``677813783523098627``"
                  )]
              }
              );
        }
      else {
        collector.stop(
          msg.edit({
            embeds: [
              embed.setDescription(
                `Хорошо! Далее, каково будет наше новое время окончания розыгрыша призов \n** Необходимо ответить в течение 30 секунд!**`
              )]
          }
          )
        );
      }
      const collector2 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000
      });
      collector2.on("collect", async collect2 => {
  
        let mss = ms(collect2.content);
        await collect2.delete()
        if (!mss) {
          return msg.edit({
            embeds: [
              embed.setDescription(
                "О, Щелчок! Похоже, Вы Указали Мне Недопустимую Продолжительность\n**Попробуйте Еще Раз?**\n Пример: ``-10 минут``,``-10m``,``-10``\n **Примечание: - (минус) Указывает, что вы хотите сократить время!**"
              )]
          }
          );
        } else {
          time = mss;
          collector2.stop(
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Хорошо! Далее, какие победители могут быть объявлены, если я должен принять участие в розыгрыше прямо сейчас?\n**Должен ответить в течение 30 секунд.**`
                )]
            }
            )
          );
        }
        const collector3 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
        collector3.on("collect", async collect3 => {
  
          const response3 = collect3.content.toLowerCase();
          await collect3.delete()
          if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
            return msg.edit({
              embeds: [
                embed.setDescription(
                  "Бой! Победителей должно быть несколько или больше единицы!\n**Попробуйте еще раз?**\n Пример ``1``,``10``, и так далее."
                )]
            }
            );
          } else {
            winnersCount = parseInt(response3);
            collector3.stop(
              msg.edit({
                embeds: [
                  embed.setDescription(
                    `Хорошо, Щедрый человек! Далее, каким должен быть новый приз для розыгрыша подарков?\n**Необходимо ответить в течение 30 секунд!**`
                  )]
              })
            )
          }
          const collector4 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
          collector4.on("collect", async collect4 => {
  
            const response4 = collect4.content.toLowerCase();
            prize = response4;
            await collect4.delete()
            collector4.stop(
              console.log(giveawayx),
              msg.edit({
                embeds: [
                  embed.setDescription(
                    `Edited`
                  )]
              }
              )
            );
            client.giveawaysManager.edit(gid, {
              newWinnerCount: winnersCount,
              newPrize: prize,
              addTime: time
            })
          });
        });
      });
    });
    collector.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });
      }
    })
    try {
      collector2.on('end', (collected, reason) => {
        if (reason == 'time') {
  
          message.reply({ embeds: [xembed] });
        }
      });
      collector3.on('end', (collected, reason) => {
        if (reason == 'time') {
          message.reply({ embeds: [xembed] });
  
        }
      })
      collector4.on('end', (collected, reason) => {
        if (reason == 'time') {
  
          message.reply({ embeds: [xembed] });
        }
      })
    } catch (e) { }
  }
