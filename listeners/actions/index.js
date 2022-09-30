const { blankAction } = require("./blank_action.js");
const { submitRoundupChannel } = require("./submit_roundup_channel.js");
const { openCompanyValues } = require("./open_company_values.js");
const { enterCoreValues } = require("./enter_core_values.js");
const { addNextCoreValue } = require("./add_next_core_value.js");
const { editCoreValues } = require("./edit_core_values.js");
const { editSettings } = require("./edit_settings.js");

module.exports.register = (app) => {
  app.action("blank_action", blankAction);
  app.action("submit_roundup_channel", submitRoundupChannel);
  app.action("open_company_values", openCompanyValues);
  app.action("enter_core_values", enterCoreValues);
  app.action("add_next_core_value", addNextCoreValue);
  app.action("edit_core_values", editCoreValues);
  app.action("edit_settings", editSettings);

};
