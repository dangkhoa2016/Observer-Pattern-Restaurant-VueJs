const ORDER_STATUS = Object.freeze({
  PENDING: 1,
  PROCESSING: 2,
  DONE: 3,
});

const CHEF_STATUS = Object.freeze({
  IDLE: 1,
  BUSY: 2,
});

const APP_TIMEOUTS = Object.freeze({
  ASSISTANT_DISPATCH_MS: 3000,
  ASSISTANT_INFO_MS: 8000,
  ASSISTANT_HIGHLIGHT_MS: 4000,
  CHEF_HIGHLIGHT_MS: 2000,
  PROGRESS_COMPLETE_DELAY_MS: 1000,
  TABLE_HIGHLIGHT_MS: 4000,
  UI_ANIMATION_MS: 500,
});

const APP_LABELS = Object.freeze({
  ACTIVITY_LOG: 'Activity log',
  ADD_DISHES: 'Add Dishes',
  ADD_TABLE: 'Add Table',
  ASSISTANT: 'Assistant',
  CLOSE: 'Close',
  CONFIRM_ACTION: 'Confirm Action',
  CONTROLS: 'Controls',
  MOTTO: 'Motto',
  ORDER: 'Order',
  PREPARING: 'Preparing',
  PROGRESS_COMPLETE_TOOLTIP: 'Click to complete this progress bar',
  RECEIVE_UPDATES_TOOLTIP: 'Receive updates from the assistant',
  REMOVE_TABLE_TOOLTIP: 'Remove this table',
  SUBSCRIBE_TOOLTIP: 'Subscribe to assistant updates',
  UNSUBSCRIBE_TOOLTIP: 'Unsubscribe from assistant updates',
  WELCOME_TITLE: 'Welcome!',
  YES: 'Yes',
});

const APP_MESSAGES = Object.freeze({
  FOOD_SELECTION_REQUIRED: 'Please select at least one dish.',
  MENU_LOAD_ERROR: 'Unable to load the menu.',
  TABLE_REMOVE_CONFIRM: 'Are you sure you want to remove this table?',
});

const TABLE_SLOGANS = Object.freeze([
  'Reserved for the president...',
  'Reserved for our finest guests...',
  'Reserved for a very important guest...',
  'Reserved for a distinguished guest...',
]);

const CHEF_SLOGANS = Object.freeze([
  'Bring out the foodie in you.',
  'Find joy in cooking.',
  'Awaken your inner chef.',
  'Let your inner chef shine.',
]);

const ASSISTANT_LOG_MESSAGES = Object.freeze({
  received: 'picked up',
  completed: 'completed',
});

const DEFAULT_COUNTS = Object.freeze({
  CHEFS: 2,
  TABLES: 2,
});

function createOrdersReceivedMessage(tableId, orderCount) {
  return `Received ${orderCount} order(s) from Table [${tableId}]`;
}

function createCompletedDishMessage(chefId) {
  return `Received a completed dish from Chef [${chefId}]`;
}

module.exports = {
  APP_LABELS,
  APP_MESSAGES,
  APP_TIMEOUTS,
  ASSISTANT_LOG_MESSAGES,
  CHEF_SLOGANS,
  CHEF_STATUS,
  DEFAULT_COUNTS,
  ORDER_STATUS,
  TABLE_SLOGANS,
  createCompletedDishMessage,
  createOrdersReceivedMessage,
};