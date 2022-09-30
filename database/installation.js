const axios = require("axios");

const User = require("./models/userModel.js");

/** Workspace Installation */
const saveUserWorkspaceInstall = async (installation) => {
  try {
    // if there is a user token the user will be stored seperately in the database (instead the team entry)
    // the token will be also later needed to change the users status and to set the absence (pause notifications) special user scope
    const id = installation.team.id;

    console.log(installation);

    const resp = await User.updateOne(
      { _id: id },
      {
        team: { id: installation.team.id, name: installation.team.name },
        // entperise id is null on workspace install
        enterprise: { id: "null", name: "null" },
        // user scopes + token is null on workspace install
        user: {
          token: installation.user.token,
          scopes: installation.user.scopes,
          id: installation.user.id,
        },
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: {
          scopes: installation.bot.scopes,
          token: installation.bot.token,
          userId: installation.bot.userId,
          id: installation.bot.id,
        },
      },
      { upsert: true }
    );

    // send welcome message
    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: installation.user.id,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*You made it!🎉*",
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Let’s get started!",
              emoji: true,
            },
          },
          {
            type: "input",
            element: {
              type: "channels_select",
              placeholder: {
                type: "plain_text",
                text: "Pick an public channel...",
                emoji: true,
              },
            },
            label: {
              type: "plain_text",
              text: "Which channel would you like to post your round up to ?",
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: " ",
              emoji: true,
            },
          },
          {
            type: "input",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select a day",
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Monday",
                  },
                  value: "MON",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Tuesday",
                  },
                  value: "TUE",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Wednesday",
                  },
                  value: "WED",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Thursday",
                  },
                  value: "THU",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Friday",
                  },
                  value: "FRI",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Saturday",
                  },
                  value: "SAT",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Sunday",
                  },
                  value: "SUN",
                },
              ],
            },
            label: {
              type: "plain_text",
              text: "Which day would you like to receive your roundup?",
              emoji: true,
            },
          },
          {
            type: "input",
            element: {
              type: "static_select",
              action_id: "time",
              initial_option: {
                text: {
                  type: "plain_text",
                  text: "10:00 AM",
                },
                value: "10",
              },
              placeholder: {
                type: "plain_text",
                text: "Select a time",
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "0:00 AM",
                  },
                  value: "0",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "1:00 AM",
                  },
                  value: "1",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "2:00 AM",
                  },
                  value: "2",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "3:00 AM",
                  },
                  value: "3",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "4:00 AM",
                  },
                  value: "4",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "5:00 AM",
                  },
                  value: "5",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "6:00 AM",
                  },
                  value: "6",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "7:00 AM",
                  },
                  value: "7",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "8:00 AM",
                  },
                  value: "8",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "8:00 AM",
                  },
                  value: "8",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "9:00 AM",
                  },
                  value: "9",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "10:00 AM",
                  },
                  value: "10",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "11:00 AM",
                  },
                  value: "11",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "12:00 PM",
                  },
                  value: "12",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "1:00 PM",
                  },
                  value: "13",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "2:00 PM",
                  },
                  value: "14",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "3:00 PM",
                  },
                  value: "15",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "4:00 PM",
                  },
                  value: "16",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "5:00 PM",
                  },
                  value: "17",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "6:00 PM",
                  },
                  value: "18",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "7:00 PM",
                  },
                  value: "19",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "8:00 PM",
                  },
                  value: "20",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "9:00 PM",
                  },
                  value: "21",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "10:00 PM",
                  },
                  value: "22",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "11:00 PM",
                  },
                  value: "23",
                },
              ],
            },
            label: {
              type: "plain_text",
              text: "Which time?",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: " ",
              emoji: true,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "Submit",
                },
                style: "primary",
                value: "approve_button",
                action_id: "submit_roundup_channel",
              },
            ],
          },
        ],
        text: "Let’s get started!",
      },
      {
        headers: {
          Authorization: `Bearer ${installation.bot.token}`,
        },
      }
    );

    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** Enterprise Installation */
const saveUserOrgInstall = async function (installation) {
  try {
    const resp = await User.updateOne(
      { _id: installation.enterprise.id },
      {
        team: "null",
        enterprise: {
          id: installation.enterprise.id,
          name: installation.enterprise.name,
        },
        user: {
          token: installation.user.token,
          scopes: installation.user.scopes,
          id: installation.user.id,
        },
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: "null",
      },
      { upsert: true }
    );
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** GET Workspace Installation */
const getWorkspaceInstallation = async (teamId) => {
  try {
    // fetch user from database
    const user = await User.find({ "team.id": teamId });
    return user[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** GET Enterprise Installation */
const getEnterpriseInstallation = async (enterpriseId) => {
  try {
    // fetch user from database
    const user = await User.find({ "enterprise.id": enterpriseId });
    return user[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** DELETE Enterprise Installation */
const deleteEnterpriseInstallation = async (enterpriseId) => {
  try {
    await User.deleteMany({ "enterprise.id": enterpriseId });
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** DELETE Workspace Installation */
const deleteWorkspaceInstallation = async (teamId) => {
  try {
    await User.deleteMany({ "team.id": teamId });
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  deleteWorkspaceInstallation,
  deleteEnterpriseInstallation,
  getEnterpriseInstallation,
  getWorkspaceInstallation,
  saveUserOrgInstall,
  saveUserWorkspaceInstall,
};
