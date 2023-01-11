/*jshint esversion: 9 */

(function () {
  let table_id_increase = 0;
  let chef_id_increase = 0;

  const state = {
    current_table: null,
    selected_foods: [],
    confirm_delete_table_id: null,
    chefs: [],
    tables: [],
    chef_orders: {},
    completed_foods: [],
  };

  const mutations = {
    SHOW_MODAL_FOODS_FOR_TABLE(state, payload) {
      state.current_table = payload;
    },
    SET_SELECTED_FOODS(state, payload) {
      state.selected_foods = payload;
    },
    ADD_TABLE(state) {
      table_id_increase += 1;
      state.tables.push({ id: table_id_increase, created_at: (new Date).valueOf() + table_id_increase });
    },
    ADD_CHEF(state, status) {
      chef_id_increase += 1;
      state.chefs.push({ id: chef_id_increase, status, created_at: (new Date).valueOf() + chef_id_increase });
    },
    CONFIRM_DELETE_TABLE_ID(state, payload) {
      state.confirm_delete_table_id = payload;
    },
    ACTION_DELETE_TABLE(state) {
      const indx = state.tables.findIndex(t => t.id === state.confirm_delete_table_id);
      if (indx === -1)
        return;

      state.tables.splice(indx, 1);
      state.confirm_delete_table_id = null;
    },
    SEND_ORDER_TO_CHEF(state, payload) {
      const { chef_id, order } = payload;
      state.chef_orders = { ...state.chef_orders, ...{ [chef_id]: order } };
    },
    SET_CHEF_COOKING(state, payload) {
      const { chef_id, chef_status, order_status } = payload;
      const chef = state.chefs.find(c => c.id === chef_id);
      if (chef)
        chef.status = chef_status;

      const order = state.chef_orders[chef_id];
      order.status = order_status;
      state.chef_orders[chef_id] = { ...state.chef_orders[chef_id], ...order };
    },
    SEND_COMPLETED_FOODS_FOR_TABLE(state, payload) {
      payload.map(order => {
        for(let chef_id in state.chef_orders) {
          if (state.chef_orders[chef_id] && state.chef_orders[chef_id].id === order.id) {
            state.chef_orders[chef_id] = null;
            break;
          }
        }
      });
      state.completed_foods = payload;
    },
  };

  const actions = {
    showModalFoodsForTable(context, payload) {
      const { commit } = context;
      commit('SHOW_MODAL_FOODS_FOR_TABLE', payload);
    },
    setSelectedFoods(context, payload) {
      const { commit } = context;
      commit('SET_SELECTED_FOODS', payload);
    },
    addTable(context) {
      const { commit } = context;
      commit('ADD_TABLE');
    },
    addChef(context, payload) {
      const { commit } = context;
      commit('ADD_CHEF', payload);
    },
    setConfirmDeleteTableId(context, payload) {
      const { commit } = context;
      commit('CONFIRM_DELETE_TABLE_ID', payload);
    },
    setActionDeleteTable(context) {
      const { commit } = context;
      commit('ACTION_DELETE_TABLE');
    },
    sendOrderToChef(context, payload) {
      const { commit } = context;
      commit('SEND_ORDER_TO_CHEF', payload);
    },
    setChefCooking(context, payload) {
      const { commit } = context;
      commit('SET_CHEF_COOKING', payload);
    },
    sendCompletedFoodsForTable(context, payload) {
      const { commit } = context;
      commit('SEND_COMPLETED_FOODS_FOR_TABLE', payload);
    },
  };

  const getters = {
    getCurrentTable: (state) => state.current_table,
    getSelectedFoods: (state) => state.selected_foods,
    getConfirmDeleteTableId: (state) => state.confirm_delete_table_id,
    getOrderCookingStatus: (state) => state.chef_orders,
    getCompletedFoodsForTable: (state) => state.completed_foods,
    getChefs: (state) => state.chefs,
    getTables: (state) => state.tables,

    getChefInfo: (state) => (chef_id) => {
      if (!Array.isArray(state.chefs) || !chef_id)
        return;

      chef_id = chef_id.toString();
      return state.chefs.find(c => c.id.toString() === chef_id);
    },

    getOrderForChef: (state) => (chef_id) => {
      if (!state.chef_orders || !chef_id)
        return;

      return state.chef_orders[chef_id];
    },

    getOrdersByStatus: (state) => (status) => {
      const orders = [];

      if (!state.chef_orders)
        return orders;

      for (const chef of state.chefs) {
        const order = state.chef_orders[chef.id];
        if (order && order.status === status)
          orders.push({ chef_id: chef.id, order });
      }

      return orders;
    },
  };

  if (!window.store)
    window.store = {};
  window.store.restaurantStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
