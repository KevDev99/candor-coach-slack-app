const { getTeamInformation } = require("../../database/db.js");
const { weekdays } = require("../../helper");

const editSettings = async ({ ack, say, body, client }) => {
  await ack();

  // get channel and weekday
  const team_channel = await getTeamInformation(
    body.team.id,
    "roundup_channel"
  );
  const weekdayCode = await getTeamInformation(body.team.id, "roundup_day");

  // show edit modal
  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        callback_id: "submit_settings",
        title: {
          type: "plain_text",
          text: "Edit Settings",
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Save",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Exit",
          emoji: true,
        },
        callback_id: "submit_settings",
        blocks: [
          {
            type: "input",
            element: {
              type: "channels_select",
              initial_channel: team_channel,
              placeholder: {
                type: "plain_text",
                text: "Pick an public channel...",
                emoji: true,
              },
            },
            label: {
              type: "plain_text",
              text: "Which channel would you like to post your round up to ?",
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: " ",
              emoji: true,
            },
          },
          {
            type: "input",
            element: {
              type: "static_select",
              initial_option: {
                text: {
                  type: "plain_text",
                  text: weekdays[weekdayCode],
                },
                value: weekdayCode,
              },
              placeholder: {
                type: "plain_text",
                text: "Select a day",
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Monday",
                  },
                  value: "MON",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Tuesday",
                  },
                  value: "TUE",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Wednesday",
                  },
                  value: "WED",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Thursday",
                  },
                  value: "THU",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Friday",
                  },
                  value: "FRI",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Saturday",
                  },
                  value: "SAT",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Sunday",
                  },
                  value: "SUN",
                },
              ],
            },
            label: {
              type: "plain_text",
              text: "Which day would you like to receive your roundup?",
              emoji: true,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  editSettings,
};
