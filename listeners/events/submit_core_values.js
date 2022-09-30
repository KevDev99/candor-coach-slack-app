const {
  formatBodyState,
  formatMessageState,
  weekdays,
  hours,
} = require("../../helper");
const { updateTeam, getTeamInformation } = require("../../database/db.js");

const submitCoreValues = async ({ ack, body, client, say, context }) => {
  try {
    const [index, numberCompanyValues, channelId, messageTs] =
      body.view.private_metadata.split(";");

    // team informations for message needed
    const teamChannelId = await getTeamInformation(
      body.team.id,
      "roundup_channel"
    );
    const teamWeekday = await getTeamInformation(body.team.id, "roundup_day");
    const teamHour = await getTeamInformation(body.team.id, "roundup_hour");

    // format state
    const formatted_state = formatFormState(body.view.state);

    // check if index is smaller than the number of company values -> show error
    if (index < numberCompanyValues) {
      return await ack({
        response_action: "errors",
        errors: {
          "next-button": "Error: Please add all core values!",
        },
      });
    }

    await ack();

    let responseText = "";

    // save core values to database
    const core_values = [];
    Object.keys(formatted_state).map((coreValueKey) => {
      const coreValue = formatted_state[coreValueKey];
      core_values.push(coreValue);
      responseText += `:${coreValue.emoji}:` + " " + coreValue.value + "\n";
    });

    updateTeam(body.team.id, { core_values });

    // if message ts and channel id provided -> update a message
    if (messageTs && channelId) {
      // update message
      await client.chat.update({
        channel: channelId,
        ts: messageTs,
        text: "Congratulations you’ve taken the first step in culture-building!!",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Congratulations you’ve taken the first step in culture-building!!*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Here is a quick recap:\n\nWe’ve defined our core values as below and given each a correlating emoji: ",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: responseText,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Feel free to edit your settings and core values whenever you want:",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Edit Core Values",
                  emoji: true,
                },
                value: "edit_core_values_btn",
                action_id: "edit_core_values",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Edit Settings",
                  emoji: true,
                },
                value: "edit_settings_btn",
                action_id: "edit_settings",
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Every time someone receives a value emoji or gives one, we will record the results",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Every week on ${weekdays[teamWeekday]} at ${hours[teamHour]} I'll send a roundup to <#${teamChannelId}> with the following stats:`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "1. The team’s most lived value\n2. The person who was MVP (received the most core values shoutouts)\n3. Summary of core values celebrated across all team members",
            },
          },
        ],
      });
    } else {
      // else send new message to user
      await client.chat.postMessage({
        channel: body.user.id,
        text: "Core Values Updated",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Your core values have been successfully updated*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Here is an overview of the updated core values:\n\n ",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: responseText,
            },
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const formatFormState = (state) => {
  const formState = [];

  const keys = Object.keys(state.values);

  let index = 1;

  keys.map((key) => {
    const subKey = Object.keys(state.values[key])[0];

    if (!formState["plain_text_input-action-" + index]) {
      formState["plain_text_input-action-" + index] = {
        value: "",
        emoji: "",
        index: 0,
      };
    }

    if (subKey.startsWith("plain_text_input")) {
      formState["plain_text_input-action-" + index].value =
        state.values[key][subKey].value;
      if (formState["plain_text_input-action-" + index].emoji !== "") ++index;
    }

    if (state.values[key][subKey].type === "static_select") {
      formState["plain_text_input-action-" + index].emoji =
        state.values[key][subKey].selected_option.value;
      formState["plain_text_input-action-" + index].index = index;
      if (formState["plain_text_input-action-" + index].value !== "") ++index;
    }
  });

  return formState;
};

module.exports = { submitCoreValues };
