const { formatMessageState } = require("../../helper");

const { updateTeam } = require("../../database/db.js");

const submitCompanyValues = async ({ ack, body, client, say, context }) => {
  try {
    // format state
    const state = formatMessageState(body.view.state);

    const { plain_text_input: number_company_values } = state;

    // validate number
    if (!number_company_values || isNaN(number_company_values)) {
      return await ack({
        response_action: "errors",
        errors: {
          company_values_input: "Error: Please insert a valid number.",
        },
      });
    }

    // if number is 0 inform user that he can continue later on.
    if (number_company_values == 0) {
      return await ack({
        response_action: "errors",
        errors: {
          company_values_input:
            "No worries! Come back when you do! p.s if you need help defining your company values check out this handy guide. ",
        },
      });
    }

    await ack();

    // update number on database
    await updateTeam(body.team.id, { number_company_values });

    const metaData = body.view.private_metadata;

    if (!metaData) throw "No metadata in view provided!";

    const [channelId, messageTs] = metaData.split(";");

    // send new message with the hint to seutp now the core values
    await client.chat.update({
      channel: channelId,
      ts: messageTs,
      text: "Perfect! Thanks",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Perfect! Thanks",
          },
        },
      ],
    });

    await client.chat.postMessage({
      channel: channelId,
      text: "Ok! You are now ready to enter your core values:",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Ok! You are now ready to enter your core values:",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Enter core values",
                emoji: true,
              },
              value: "click_me_123",
              action_id: "enter_core_values",
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { submitCompanyValues };
