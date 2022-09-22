
const messages = async ({ event, client, say, context }) => {
  try {
    console.log(event);
  } catch (error) {
    console.error(error);
  }
};



module.exports = { messages };
