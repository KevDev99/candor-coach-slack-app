const { getTeams, getEmojiMetrics } = require("../database/db.js");
const cron = require("node-cron");
const axios = require("axios");

const registerJobs = () => {
  sendRoundUpMessage();
};

const sendRoundUpMessage = async () => {
  const teams = await getTeams({ "core_values.0": { $exists: true } });

  teams.map(async (team) => {
    // get timezone of installation user

    const { data } = await axios.post(
      "https://slack.com/api/users.info",
      new URLSearchParams({ user: team.user.id, token: team.bot.token })
    );

    const timezone = data.user.tz;

    try {
      if (team.roundup_channel) {
        cron.schedule(
          `00 ${team.roundup_hour ?? 10} * * ${team.roundup_day}`,
          async () => {
            // get all
            const metrics = await getEmojiMetrics(team._id);
            if (!metrics) {
              return;
            }

            const roundUpBlock = roundUpMessageBody(metrics);

            try {
              // send roundup message
              const res = await axios.post(
                "https://slack.com/api/chat.postMessage",
                {
                  text: "Weekly Roundup",
                  channel: team.roundup_channel,
                  blocks: roundUpBlock,
                },
                {
                  headers: {
                    Authorization: `Bearer ${team.bot.token}`,
                  },
                }
              );
            } catch (error) {
              console.error(error);
            }
          },
          {
            timezone: timezone,
            scheduled: true,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  });
};

const roundUpMessageBody = ({
  mostLivedEmoji,
  mvp,
  most_spending,
  summary,
  notUsedEmojis,
}) => {
  const messageBody = [];

  const header = {
    type: "header",
    text: {
      type: "plain_text",
      text: "Hey team! Here’s your weekly Candor Coach roundup on living your core values: ",
      emoji: true,
    },
  };

  messageBody.push(header);

  const mostLiveCoreValue = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*The team’s most lived core value was: *\n:${mostLivedEmoji._id}: ${mostLivedEmoji.value}. We lived this ${mostLivedEmoji.count} x`,
    },
  };

  messageBody.push(mostLiveCoreValue);

  const mvpBody = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*The team's core values MVP award goes to: <@${
        mvp._id
      }>* received ${mvp.count} shoutouts this week. ${mvp.emojiList.map(
        (emojiItem) => `${emojiItem.count} x :${emojiItem._id}:`
      )} Congrats! <@${mvp._id}>`,
    },
  };

  messageBody.push(mvpBody);

  const mostSpenderBody = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*The team’s core values guide award goes to <@${
        most_spending._id
      }>* <@${most_spending._id}> gave ${
        most_spending.count
      } x value shoutouts this week. ${most_spending.emojiList.map(
        (emojiItem) => `${emojiItem.count} x :${emojiItem._id}:`
      )}`,
    },
  };

  messageBody.push(mostSpenderBody);

  const summaryBody = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Summary of our team's values:*\n ${summary.map(
        (summaryItem) =>
          `Team members who were celebrated for living :${summaryItem.emoji}: ${
            summaryItem.value
          }:${summaryItem.userList.map(
            (user) => ` <@${user._id}> x ${user.count}`
          )} \n`
      )} `,
    },
  };

  messageBody.push(summaryBody);

  const valueNotCelebratedBody = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Values not celebrated this week:* ${notUsedEmojis.map(
        (emojiItem) => {
          return `\n:${emojiItem.emoji}: ${emojiItem.value}`;
        }
      )}`,
    },
  };

  messageBody.push(valueNotCelebratedBody);

  messageBody.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":wave: That’s all folks, See you next time",
    },
  });

  messageBody.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "   -    Candor Coach",
    },
  });

  return messageBody;
};

module.exports = registerJobs;
