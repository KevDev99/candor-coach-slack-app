const { updateUser } = require("../../database/db.js");
const { formatReminderState } = require("../../helper");

const openCompanyValues = async ({ ack, say, body, client }) => {
  await ack();

  const metadata = body.channel.id + ";" + body.message.ts;

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        private_metadata: metadata,
        type: "modal",
        title: {
          type: "plain_text",
          text: "Your Company Values",
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        callback_id: "submit_company_values",
        blocks: [
          {
            type: "input",
            block_id: "company_values_input",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action",
              placeholder: {
                type: "plain_text",
                text: "Enter a number",
              },
            },
            label: {
              type: "plain_text",
              text: "How many company values do you have?",
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

module.exports = { openCompanyValues };
