const { coreValueItemBlock } = require("./enter_core_values.js");

const addNextCoreValue = async ({ ack, say, body, client }) => {
  await ack();

  // get current view and remove last item (add next button)
  const currentViewBlocks = body.view.blocks;
  currentViewBlocks.pop();

  const [index, numberCompanyValues, channelId, messageTs] =
    body.view.private_metadata.split(";");

  const newIndex = parseInt(index) + 1;

  const newCoreValueItemBlock = await coreValueItemBlock(
    newIndex,
    numberCompanyValues,
    client
  );
  
  console.log(newCoreValueItemBlock);

  const newViewBlocks = currentViewBlocks.concat(newCoreValueItemBlock);

  try {
    // Call views.update with the built-in client
    const result = await client.views.update({
      // Pass the view_id
      view_id: body.view.id,
      // Pass the current hash to avoid race conditions
      hash: body.view.hash,
      // View payload with updated blocks
      view: {
        type: body.view.type,
        private_metadata:
          newIndex +
          ";" +
          numberCompanyValues +
          ";" +
          channelId +
          ";" +
          messageTs,
        submit: { type: "plain_text", text: body.view.submit.text },
        close: { type: "plain_text", text: body.view.close.text },
        // View identifier
        callback_id: body.view.callback_id,
        title: {
          type: "plain_text",
          text: body.view.title.text,
        },
        blocks: newViewBlocks,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { addNextCoreValue };
