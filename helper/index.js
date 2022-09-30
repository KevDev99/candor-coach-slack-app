// formats the incoming state object from slack to a useful object
const formatBodyState = (unformatted_state) => {
  const formatted_state = {};
  for (const [parentkey, _] of Object.entries(unformatted_state)) {
    for (const [key, value] of Object.entries(unformatted_state[parentkey])) {
      console.log(unformatted_state[parentkey][key]);
      if (unformatted_state[parentkey][key].type === "plain_text_input") {
        formatted_state[key] = unformatted_state[parentkey][key].value;
      }
      if (unformatted_state[parentkey][key].type === "users_select") {
        formatted_state[key] = unformatted_state[parentkey][key].selected_user;
      }
      if (unformatted_state[parentkey][key].type === "conversations_select") {
        formatted_state[key] =
          unformatted_state[parentkey][key].selected_conversation;
      }
      if (
        unformatted_state[parentkey][key].type === "plain_text_input-action-1"
      ) {
        formatted_state[key] = unformatted_state[parentkey][key].value;
      }
    }
  }

  return formatted_state;
};

const formatMessageState = (state) => {
  const formattedObj = {};
  const keys = Object.keys(state.values);
  keys.map((key) => {
    const subKey = Object.keys(state.values[key])[0];

    if (state.values[key][subKey].type === "channels_select") {
      formattedObj.channels_select = state.values[key][subKey].selected_channel;
    }

    if (state.values[key][subKey].type === "static_select") {
      if (subKey === "time") {
        formattedObj.time = state.values[key][subKey].selected_option;
        return;
      }
      formattedObj.static_select =
        state.values[key][subKey].selected_option.value;
    }

    if (state.values[key][subKey].type === "plain_text_input") {
      formattedObj.plain_text_input = state.values[key][subKey].value;
    }
  });

  return formattedObj;
};

const insertAt = (array, index, ...elementsArray) => {
  array.splice(index, 0, ...elementsArray);
};

const weekdays = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

const hours = {
  "0": "0:00 AM",
  "1": "1:00 AM",
  "2": "2:00 AM",
  "3": "3:00 AM",
  "4": "4:00 AM",
  "5": "5:00 AM",
  "6": "6:00 AM",
  "7": "7:00 AM",
  "8": "8:00 AM",
  "9": "9:00 AM",
  "10": "10:00 AM",
  "11": "11:00 AM",
  "12": "12:00 PM",
  "13": "1:00 PM",
  "14": "2:00 PM",
  "15": "3:00 PM",
  "16": "4:00 PM",
  "17": "5:00 PM",
  "18": "6:00 PM",
  "19": "7:00 PM",
  "20": "8:00 PM",
  "21": "9:00 PM",
  "22": "10:00 PM",
  "23": "11:00 PM",  
}

module.exports = {
  formatBodyState,
  formatMessageState,
  insertAt,
  weekdays,
  hours
};
