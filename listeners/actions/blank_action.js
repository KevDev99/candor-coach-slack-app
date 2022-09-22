const blankAction = async ({ ack }) => {
  await ack();
};

module.exports = { blankAction };
