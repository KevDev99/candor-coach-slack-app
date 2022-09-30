const { updateUser, getTeamInformation } = require("../../database/db.js");
const { formatMessageState, weekdays } = require("../../helper");

const submitRoundupChannel = async ({ ack, say, body, client }) => {
  await ack();

  const formattedState = formatMessageState(body.state);

  if (
    !formattedState.channels_select ||
    !formattedState.static_select ||
    !formattedState.time
  )
    return;

  // save selected channel id to database
  await updateUser(body.team.id, {
    roundup_channel: formattedState.channels_select,
    roundup_day: formattedState.static_select,
    roundup_hour: formattedState.time.value,
  });

  // get bot and user details from installation
  const installationUserToken = await getTeamInformation(
    body.team.id,
    "user.token"
  );
  const botUserId = await getTeamInformation(body.team.id, "bot.userId");

  // invite bot to channel
  try {
    client.conversations.invite({
      channel: formattedState.channels_select,
      users: botUserId,
      token: installationUserToken,
    });
  } catch (err) {}

  // update message
  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: "awesome thanks!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "awesome thanks!",
        },
      },
      {
        type: "image",
        image_url:
          "https://media0.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif",
        alt_text: "celebration",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*We’ll send the roundup message every ${
            weekdays[formattedState.static_select]
          } at ${formattedState.time.text.text} in <#${
            formattedState.channels_select
          }> *`,
        },
      },
    ],
  });

  // send new message with "codify your values"
  await client.chat.postMessage({
    channel: body.channel.id,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Now, time to codify your values\n *Are you ready?*",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Let's go",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "open_company_values",
          },
        ],
      },
    ],
  });
};

module.exports = { submitRoundupChannel };
