const { getTeamInformation } = require("../../database/db.js");
const { formatReminderState, insertAt } = require("../../helper");
const { coreValueItemBlock } = require("./enter_core_values.js");

const editCoreValues = async ({ ack, say, body, client }) => {
  await ack();

  // get current company values
  const coreValues = await getTeamInformation(body.team.id, "core_values");

  let viewBlock = [];

  for (let coreValue of coreValues) {
    const valueItemBlock = await coreValueItemBlock(
      coreValue.index,
      coreValues.length,
      client,
      {
        value: coreValue.value,
        emoji: coreValue.emoji,
      }
    );

    viewBlock = viewBlock.concat(valueItemBlock)
  }

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        private_metadata: coreValues.length + ";" + coreValues.length,

        title: {
          type: "plain_text",
          text: "Edit Core Values",
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
        callback_id: "submit_core_values",
        blocks: viewBlock,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { editCoreValues };
