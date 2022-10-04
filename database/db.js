const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const Emoji = require("./models/emojiModel.js");

const uri = process.env.MONGODB_DB_URI;

const connect = async function () {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📕 DB sucessfully connected");
  } catch (e) {
    console.error("Error when connectiong to the database", e);
  }
};

const getUser = async function (userId) {
  try {
    // fetch user from database
    const user = await User.find({ _id: userId });

    if (user[0] != undefined) {
      return user[0];
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error when fetching user", e);
  }
};

const addUser = async function (_id, team_id) {
  try {
    const user = new User({
      _id,
      team: {
        id: team_id,
        name: "",
      },
    });

    await user.save();
  } catch (e) {
    console.error("Error when adding user", e);
  }
};

const getTeamBotToken = async (teamId) => {
  try {
    // fetch user from database
    const team = await User.find({ _id: teamId });
    if (team.length > 0) {
      return team[0].bot.token;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

const updateUser = async function (_id, updateObj) {
  try {
    await User.updateOne({ _id }, updateObj);
  } catch (e) {
    console.error("Failed to update user", e);
  }
};

const updateTeam = async function (_id, updateObj) {
  try {
    await User.updateOne({ _id }, updateObj);
  } catch (e) {
    console.error("Failed to update user", e);
  }
};

const getTeamInformation = async function (_id, fieldname) {
  try {
    const team = await User.find({ _id });
    if (team[0] != undefined) {
      if (fieldname.includes(".")) {
        const [field1, field2] = fieldname.split(".");
        return team[0][field1][field2];
      }
      return team[0][fieldname];
    } else {
      return null;
    }
  } catch (e) {
    console.error("Failed to update user", e);
  }
};

const getTeams = async function (filter = {}) {
  try {
    const teams = await User.find(filter);
    return teams;
  } catch (err) {
    console.error(err);
  }
};

const countEmoji = async function (
  teamId,
  userId,
  emoji,
  mention_to_id = null
) {
  try {
    const newEmoji = new Emoji({
      team_id: teamId,
      user_id: userId,
      emoji: emoji,
      mention_to_id,
    });

    newEmoji.save();
  } catch (err) {
    console.error(err);
  }
};

const getEmojiMetrics = async function (teamId) {
  try {
    let mostLivedEmoji;
    let mvp;
    let most_spending;
    const summary = [];
    const notUsedEmojis = [];

    const counted_emojis = await Emoji.aggregate([
      { $match: { team_id: teamId } },
      {
        $group: {
          _id: "$emoji",
          count: { $sum: 1 }, // this means that the count will increment by 1
        },
      },
    ]);

    if (counted_emojis.length === 0) return null;

    // get all core value emojis which are not used for now
    const coreValues = await getTeamInformation(teamId, "core_values");

    // get most lived value
    let most_lived_value = 0;

    counted_emojis.map((countedEmoji) => {
      if (countedEmoji.count > most_lived_value)
        most_lived_value = countedEmoji.count;
    });

    // get most lived emojis
    const mostLivedEmojis = counted_emojis.filter(
      (countedEmoji) => countedEmoji.count == most_lived_value
    );

    mostLivedEmoji = mostLivedEmojis[0];
    const emojiIndex = await coreValues.findIndex(
      (coreValue) => coreValue.emoji == mostLivedEmoji._id
    );
    mostLivedEmoji.value = coreValues[emojiIndex].value;

    // mvp award
    const userList = await Emoji.aggregate([
      { $match: { team_id: teamId } },
      {
        $group: {
          _id: "$mention_to_id",
          count: { $sum: 1 }, // this means that the count will increment by 1
        },
      },
    ]);

    let mvpCounts = 0;
    userList.map((mvp) => {
      if (mvp._id) {
        if (mvp.count > mvpCounts) {
          mvpCounts = mvp.count;
        }
      }
    });

    mvp = userList.filter((user) => user.count == mvpCounts)[0];
    mvp.emojiList = await Emoji.aggregate([
      { $match: { team_id: teamId, mention_to_id: mvp._id } },
      {
        $group: {
          _id: "$emoji",
          count: { $sum: 1 }, // this means that the count will increment by 1
        },
      },
    ]);

    //  team core values guide award
    const spendings = await Emoji.aggregate([
      { $match: { team_id: teamId, mention_to_id: { $exists: true } } },
      {
        $group: {
          _id: "$user_id",
          count: { $sum: 1 }, // this means that the count will increment by 1
        },
      },
    ]);

    let most_spending_value = 0;
    spendings.map((spending) => {
      if (spending.count > most_spending_value) {
        most_spending_value = spending.count;
      }
    });

    most_spending = spendings.filter(
      (spending) => spending.count == most_spending_value
    )[0];
    most_spending.emojiList = await Emoji.aggregate([
      {
        $match: {
          team_id: teamId,
          user_id: most_spending._id,
          mention_to_id: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$emoji",
          count: { $sum: 1 },
        },
      },
    ]);

    let allEmojisGrouped = await Emoji.aggregate([
      {
        $match: {
          team_id: teamId,
        },
      },
      {
        $group: {
          _id: "$emoji",
        },
      },
    ]);

    await Promise.all(
      allEmojisGrouped.map(async (emojiItem) => {
        const summaryItem = { emoji: emojiItem._id };

        // get value
        const coreValueIndex = await coreValues.findIndex(
          (coreValue) => coreValue.emoji == emojiItem._id
        );
        summaryItem.value = coreValues[coreValueIndex].value;

        // get list of users using that emoji
        const emojiUserList = await Emoji.aggregate([
          {
            $match: {
              team_id: teamId,
              emoji: emojiItem._id,
            },
          },
          {
            $group: {
              _id: "$user_id",
              count: { $sum: 1 },
            },
          },
        ]);

        summaryItem.userList = emojiUserList;
        summary.push(summaryItem);
      })
    );

    await Promise.all(
      coreValues.map(async (coreValue) => {
        const findEmojis = await Emoji.find({
          team_id: teamId,
          emoji: coreValue.emoji,
        });
        if (findEmojis.length === 0) {
          notUsedEmojis.push({
            emoji: coreValue.emoji,
            value: coreValue.value,
          });
        }
      })
    );

    return { mostLivedEmoji, mvp, most_spending, summary, notUsedEmojis };
  } catch (error) {
    console.error(error);
  }
};

const removeEmojisNotInList = async (teamId, emojisList) => {
  const emojis = await Emoji.deleteMany({
    emoji: { $not: { $in: emojisList } },
    team_id: teamId,
  });

  return emojis;
};

module.exports = {
  connect,
  getUser,
  addUser,
  getTeamBotToken,
  updateUser,
  updateTeam,
  getTeamInformation,
  getTeams,
  countEmoji,
  getEmojiMetrics,
  removeEmojisNotInList,
};
