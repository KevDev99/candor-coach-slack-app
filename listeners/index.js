const events = require('./events');
const actions = require('./actions')

module.exports.registerListeners = (app) => {
  events.register(app);  
  actions.register(app);  
};