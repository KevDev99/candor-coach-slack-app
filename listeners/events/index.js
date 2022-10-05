const { messages } = require("./messages.js");
const { submitCompanyValues } = require("./submit_company_values.js");
const { submitCoreValues } = require("./submit_core_values.js");
const { submitSettings } = require("./submit_settings.js");

const { getTeams, countEmoji } = require("../../database/db.js");

const userMentionedRegex = /\<@(.*?)\>/;

module.exports.register = (app) => {
  app.event("messages", messages);
  app.view("submit_company_values", submitCompanyValues);
  app.view("submit_core_values", submitCoreValues);
  app.view("submit_settings", submitSettings);

  registerListenerForTeamEmojis(app);
};

const registerListenerForTeamEmojis = async (app) => {
  // loop through all teams with core values
  const teams = await getTeams({ "core_values.0": { $exists: true } });
  teams.map((team) => {
    team.core_values.map((coreValue) => {
      app.message(coreValue.emoji, async ({ message, say }) => {
        if (message.team === team._id) {
          // check if there is a mention to in the message
          const matched = userMentionedRegex.exec(message.text);
          let mention_to_id = undefined;
          if (matched && matched.length > 0) {
            const user_id = matched[1];
            if (user_id !== message.user) {
              mention_to_id = user_id;
            }
          }

          // check if there is a mention to in the message
          const matched = userMentionedRegex.exec(message.text);
          let mention_to_id = undefined;
          if (matched && matched.length > 0) {
            const user_id = matched[1];
            if (user_id !== message.user) {
              mention_to_id = user_id;
            }
          }

          // check if user is bot user
          const {
            data: { user },
          } = await axios.post(
            "https://slack.com/api/users.info",
            new URLSearchParams({ user: message.user }),
            { headers: { Authorization: `Bearer ${team.bot.token}` } }
          );

          // if user is a bot cancel
          if (user.is_bot) return;

          countEmoji(
            message.team,
            message.user,
            coreValue.emoji,
            mention_to_id
          );
        }
      });
    });
  });
};
