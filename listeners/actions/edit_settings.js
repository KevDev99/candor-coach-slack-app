const { getTeamInformation } = require("../../database/db.js");
const { weekdays, hours } = require("../../helper");

const editSettings = async ({ ack, say, body, client }) => {
  await ack();

  // get channel and weekday
  const team_channel = await getTeamInformation(
    body.team.id,
    "roundup_channel"
  );
  const weekdayCode = await getTeamInformation(body.team.id, "roundup_day");

  const roundupHour = String(
    await getTeamInformation(body.team.id, "roundup_hour")
  );

  console.log(roundupHour);
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
          {
            type: "input",
            element: {
              type: "static_select",
              action_id: "time",
              initial_option: {
                text: {
                  type: "plain_text",
                  text: hours[roundupHour],
                },
                value: roundupHour,
              },
              placeholder: {
                type: "plain_text",
                text: "Select a time",
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "0:00 AM",
                  },
                  value: "0",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "1:00 AM",
                  },
                  value: "1",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "2:00 AM",
                  },
                  value: "2",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "3:00 AM",
                  },
                  value: "3",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "4:00 AM",
                  },
                  value: "4",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "5:00 AM",
                  },
                  value: "5",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "6:00 AM",
                  },
                  value: "6",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "7:00 AM",
                  },
                  value: "7",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "8:00 AM",
                  },
                  value: "8",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "8:00 AM",
                  },
                  value: "8",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "9:00 AM",
                  },
                  value: "9",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "10:00 AM",
                  },
                  value: "10",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "11:00 AM",
                  },
                  value: "11",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "12:00 PM",
                  },
                  value: "12",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "1:00 PM",
                  },
                  value: "13",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "2:00 PM",
                  },
                  value: "14",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "3:00 PM",
                  },
                  value: "15",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "4:00 PM",
                  },
                  value: "16",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "5:00 PM",
                  },
                  value: "17",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "6:00 PM",
                  },
                  value: "18",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "7:00 PM",
                  },
                  value: "19",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "8:00 PM",
                  },
                  value: "20",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "9:00 PM",
                  },
                  value: "21",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "10:00 PM",
                  },
                  value: "22",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "11:00 PM",
                  },
                  value: "23",
                },
              ],
            },
            label: {
              type: "plain_text",
              text: "Which time?",
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
