const { App } = require("@slack/bolt");

const { connect, getUser, addUser, fetchUsers } = require("./database/db.js");

const registerJobs = require("./jobs");

const {
  saveUserWorkspaceInstall,
  saveUserOrgInstall,
  getWorkspaceInstallation,
  getEnterpriseInstallation,
  deleteEnterpriseInstallation,
  deleteWorkspaceInstallation,
} = require("./database/installation.js");
const { registerListeners } = require("./listeners");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ["chat:write", "users:read", "emoji:read", "im:history"],
  installationStore: {
    storeInstallation: async (installation) => {
      if (
        installation.isEnterpriseInstall &&
        installation.enterprise !== undefined
      ) {
        // handle storing org-wide app installation
        return await saveUserOrgInstall(installation);
      }
      if (installation.team !== undefined) {
        // single team app installation
        return await saveUserWorkspaceInstall(installation);
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      // Bolt will pass your handler an installQuery object
      // Change the lines below so they fetch from your database
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        // handle org wide app installation lookup
        return await getEnterpriseInstallation(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        return await getWorkspaceInstallation(installQuery.teamId);
      }
      throw new Error("Failed fetching installation");
    },
    deleteInstallation: async (installQuery) => {
      // Bolt will pass your handler  an installQuery object
      // Change the lines below so they delete from your database
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        // org wide app installation deletion
        return await deleteEnterpriseInstallation(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        return await deleteWorkspaceInstallation(installQuery.teamId);
      }
      throw new Error("Failed to delete installation");
    },
  },
  installerOptions: {
    directInstall: true,
    userScopes: [
      "channels:history",
      "groups:history",
      "im:history",
      "channels:write",
    ],
  },
  customRoutes: [
    {
      path: "/",
      method: ["GET"],
      handler: (req, res) => {
        res.writeHead(200);
        res.end("Endpoint working OK");
      },
    },
  ],
});

// connect to db
connect();

/** Register Listeners (actions, commands, events, ... -> all slack related api endpoints) */
registerListeners(app);

registerJobs();

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
