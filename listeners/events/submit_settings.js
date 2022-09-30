const {
  formatBodyState,
  formatMessageState,
  weekdays,
} = require("../../helper");
const { updateUser } = require("../../database/db.js");

const submitSettings = async ({ ack, body, client, say, context }) => {
  try {
    // format state
    const formattedState = formatFormState(body.view.state);

    // save selected channel id and weekday to database
    await updateUser(body.team.id, {
      roundup_channel: formattedState.channel,
      roundup_day: formattedState.weekday,
      roundup_hour: formattedState.time.value,
    });

    // send success message
    client.chat.postMessage({
      channel: body.user.id,
      text: "Settings updated",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*✅ Your settings have been saved.*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `We’ll send the roundup message every ${
              weekdays[formattedState.weekday]
            } at ${formattedState.time.text.text} in <#${
              formattedState.channel
            }>`,
          },
        },
      ],
    });

    await ack();
  } catch (error) {
    console.error(error);
  }
};

const formatFormState = (state) => {
  const formState = {};

  const keys = Object.keys(state.values);

  let index = 1;

  keys.map((key) => {
    const subKey = Object.keys(state.values[key])[0];

    if (state.values[key][subKey].type == "channels_select") {
      formState["channel"] = state.values[key][subKey].selected_channel;
    }

    if (state.values[key][subKey].type == "static_select") {
      if (subKey === "time") {
        formState["time"] = state.values[key][subKey].selected_option;
        return;
      }
      formState["weekday"] = state.values[key][subKey].selected_option.value;
    }
  });

  return formState;
};

module.exports = { submitSettings };
