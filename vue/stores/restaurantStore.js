/*jshint esversion: 9 */

(function () {
  let table_id_increase = 0;
  let chef_id_increase = 0;

  const MUTATIONS = Object.freeze({
    SHOW_MODAL_FOODS_FOR_TABLE: 'SHOW_MODAL_FOODS_FOR_TABLE',
    SET_SELECTED_FOODS: 'SET_SELECTED_FOODS',
    ADD_TABLE: 'ADD_TABLE',
    ADD_CHEF: 'ADD_CHEF',
    CONFIRM_DELETE_TABLE_ID: 'CONFIRM_DELETE_TABLE_ID',
    ACTION_DELETE_TABLE: 'ACTION_DELETE_TABLE',
    SEND_ORDER_TO_CHEF: 'SEND_ORDER_TO_CHEF',
    SET_CHEF_COOKING: 'SET_CHEF_COOKING',
    SEND_COMPLETED_FOODS_FOR_TABLE: 'SEND_COMPLETED_FOODS_FOR_TABLE',
  });

  const state = {
    ui: {
      current_table: null,
      selected_foods: [],
      confirm_delete_table_id: null,
    },
    chefs: {
      items: [],
    },
    tables: {
      items: [],
    },
    orders: {
      by_chef: {},
      completed_by_table: {},
    },
  };

  const mutations = {
    [MUTATIONS.SHOW_MODAL_FOODS_FOR_TABLE](state, payload) {
      state.ui.current_table = payload;
    },
    [MUTATIONS.SET_SELECTED_FOODS](state, payload) {
      state.ui.selected_foods = Array.isArray(payload) ? [...payload] : [];
    },
    [MUTATIONS.ADD_TABLE](state) {
      table_id_increase += 1;
      state.tables.items = [...state.tables.items, {
        id: table_id_increase,
        created_at: (new Date()).valueOf() + table_id_increase,
      }];
    },
    [MUTATIONS.ADD_CHEF](state, status) {
      chef_id_increase += 1;
      state.chefs.items = [...state.chefs.items, {
        id: chef_id_increase,
        status,
        created_at: (new Date()).valueOf() + chef_id_increase,
      }];
    },
    [MUTATIONS.CONFIRM_DELETE_TABLE_ID](state, payload) {
      state.ui.confirm_delete_table_id = payload;
    },
    [MUTATIONS.ACTION_DELETE_TABLE](state) {
      const tableId = state.ui.confirm_delete_table_id;
      const exists = state.tables.items.some(table => table.id === tableId);
      if (!exists)
        return;

      const activeOrders = Object.keys(state.orders.by_chef).reduce((accumulator, chef_id) => {
        const order = state.orders.by_chef[chef_id];
        if (!order || order.table_id !== tableId)
          return { ...accumulator, [chef_id]: order };

        return accumulator;
      }, {});

      state.tables.items = state.tables.items.filter(table => table.id !== tableId);
      state.orders.completed_by_table = Object.keys(state.orders.completed_by_table)
        .filter(key => key.toString() !== tableId.toString())
        .reduce((accumulator, key) => ({ ...accumulator, [key]: state.orders.completed_by_table[key] }), {});
      state.orders.by_chef = activeOrders;

      if (state.ui.current_table === tableId)
        state.ui.current_table = null;

      state.ui.selected_foods = [];

      state.ui.confirm_delete_table_id = null;
    },
    [MUTATIONS.SEND_ORDER_TO_CHEF](state, payload) {
      const { chef_id, order } = payload;
      state.orders.by_chef = { ...state.orders.by_chef, [chef_id]: order };
    },
    [MUTATIONS.SET_CHEF_COOKING](state, payload) {
      const { chef_id, chef_status, order_status } = payload;
      state.chefs.items = state.chefs.items.map(chef => {
        if (chef.id !== chef_id)
          return chef;

        return { ...chef, status: chef_status };
      });

      const order = state.orders.by_chef[chef_id];
      if (!order)
        return;

      state.orders.by_chef = {
        ...state.orders.by_chef,
        [chef_id]: { ...order, status: order_status },
      };
    },
    [MUTATIONS.SEND_COMPLETED_FOODS_FOR_TABLE](state, payload) {
      const nextOrdersByChef = { ...state.orders.by_chef };
      const groupedOrders = {};

      payload.forEach(order => {
        Object.keys(nextOrdersByChef).forEach(chef_id => {
          const chefOrder = nextOrdersByChef[chef_id];
          if (chefOrder && chefOrder.id === order.id)
            nextOrdersByChef[chef_id] = null;
        });

        const tableId = order.table_id;
        if (!tableId)
          return;

        if (!groupedOrders[tableId])
          groupedOrders[tableId] = [];

        groupedOrders[tableId].push(order);
      });

      state.orders.by_chef = nextOrdersByChef;
      state.orders.completed_by_table = {
        ...state.orders.completed_by_table,
        ...groupedOrders,
      };
    },
  };

  const actions = {
    showModalFoodsForTable(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SHOW_MODAL_FOODS_FOR_TABLE, payload);
    },
    setSelectedFoods(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SET_SELECTED_FOODS, payload);
    },
    addTable(context) {
      const { commit } = context;
      commit(MUTATIONS.ADD_TABLE);
    },
    addChef(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.ADD_CHEF, payload);
    },
    setConfirmDeleteTableId(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.CONFIRM_DELETE_TABLE_ID, payload);
    },
    setActionDeleteTable(context) {
      const { commit } = context;
      commit(MUTATIONS.ACTION_DELETE_TABLE);
    },
    sendOrderToChef(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SEND_ORDER_TO_CHEF, payload);
    },
    setChefCooking(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SET_CHEF_COOKING, payload);
    },
    sendCompletedFoodsForTable(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SEND_COMPLETED_FOODS_FOR_TABLE, payload);
    },
  };

  const getters = {
    getCurrentTable: (state) => state.ui.current_table,
    getSelectedFoods: (state) => state.ui.selected_foods,
    getConfirmDeleteTableId: (state) => state.ui.confirm_delete_table_id,
    getOrderCookingStatus: (state) => state.orders.by_chef,
    getCompletedFoodsForTable: (state) => (table_id) => {
      if (!table_id)
        return [];

      return state.orders.completed_by_table[table_id] || [];
    },
    getChefs: (state) => state.chefs.items,
    getTables: (state) => state.tables.items,

    getChefInfo: (state) => (chef_id) => {
      if (!Array.isArray(state.chefs.items) || !chef_id)
        return;

      chef_id = chef_id.toString();
      return state.chefs.items.find(c => c.id.toString() === chef_id);
    },

    getOrderForChef: (state) => (chef_id) => {
      if (!state.orders.by_chef || !chef_id)
        return;

      return state.orders.by_chef[chef_id];
    },

    getOrdersByStatus: (state) => (status) => {
      const orders = [];

      if (!state.orders.by_chef)
        return orders;

      for (const chef of state.chefs.items) {
        const order = state.orders.by_chef[chef.id];
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
