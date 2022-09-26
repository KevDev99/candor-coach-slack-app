const { getTeamInformation } = require("../../database/db.js");
const { formatReminderState } = require("../../helper");

const enterCoreValues = async ({ ack, say, body, client }) => {
  await ack();

  // get number of company values
  const numberCompanyValues = await getTeamInformation(
    body.team.id,
    "number_company_values"
  );

  const index = 1;

  const viewBlock = [
    ...(await coreValueItemBlock(index, numberCompanyValues, client)),
  ];

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        private_metadata:
          index +
          ";" +
          numberCompanyValues +
          ";" +
          body.channel.id +
          ";" +
          body.message.ts,
        title: {
          type: "plain_text",
          text: "Core Values",
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

const coreValueItemBlock = async (
  index,
  numberCompanyValues,
  client,
  initialValueObject = undefined
) => {
  const coreItemBlock = [];
  const { emoji: workspaceEmojis } = await client.emoji.list();

  const emojis = Object.keys(workspaceEmojis);

  coreItemBlock.push(
    {
      type: "input",
      block_id: "plain_text_input-action-" + index,
      element: {
        type: "plain_text_input",
        action_id: "plain_text_input-action-" + index,
        placeholder: {
          type: "plain_text",
          text: "Your Core Value ",
          emoji: true,
        },
      },
      label: {
        type: "plain_text",
        text: `Core Value (${index}/${numberCompanyValues})`,
        emoji: true,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Emoji",
            emoji: true,
          },
          options: [],
          action_id: "blank_action",
        },
      ],
    }
  );

  emojis.map((emoji) => {
    coreItemBlock[1].elements[0].options.push({
      text: {
        type: "plain_text",
        text: `:${emoji}: - ${emoji}`,
        emoji: true,
      },
      value: emoji,
    });
  });

  if (initialValueObject) {
   
    coreItemBlock[0].element.initial_value = initialValueObject.value;
    coreItemBlock[1].elements[0].initial_option = {
      text: {
        type: "plain_text",
        text: `:${initialValueObject.emoji}: - ${initialValueObject.emoji}`,
        emoji: true,
      },
      value: initialValueObject.emoji,
    };
  }

  if (!initialValueObject && numberCompanyValues > index) {
    coreItemBlock.push({
      type: "actions",
      block_id: "next-button",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "+ Add Next ",
            emoji: true,
          },
          value: "click_me_123",
          action_id: "add_next_core_value",
        },
      ],
    });
  }

  return coreItemBlock;
};

module.exports = { enterCoreValues, coreValueItemBlock };
