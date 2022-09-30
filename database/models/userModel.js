const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    _id: String,
    user_tz: String,
    user_tz_hours: Number,
    start_time: Number,
    end_time: Number,
    interval: Number,
    team: { id: String, name: String },
    enterprise: { id: String, name: String },
    user: { token: String, scopes: [String], id: String },
    tokenType: String,
    isEnterpriseInstall: Boolean,
    appId: String,
    authVersion: String,
    roundup_channel: String,
    roundup_day: String,
    roundup_hour: Number,
    number_company_values: Number,
    core_values: [],
    bot: {
      scopes: [String],
      token: String,
      userId: String,
      id: String,
    },
  },
  { _id: false }
);

module.exports = mongoose.model("User", userSchema);
