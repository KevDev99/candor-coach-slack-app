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
      if(unformatted_state[parentkey][key].type === "plain_text_input-action-1") {
        formatted_state[key] = unformatted_state[parentkey][key].value
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

module.exports = {
  formatBodyState,
  formatMessageState,
  insertAt,
};
