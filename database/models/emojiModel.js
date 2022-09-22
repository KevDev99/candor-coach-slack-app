const mongoose = require("mongoose");
const emojiSchema = mongoose.Schema(
  {
    team_id: String,
    user_id: String,
    emoji: String,
    mention_to_id: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Emoji", emojiSchema);
