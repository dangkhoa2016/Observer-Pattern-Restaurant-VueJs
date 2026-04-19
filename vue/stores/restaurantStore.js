/*jshint esversion: 9 */

(function () {
  let nextTableId = 0;
  let nextChefId = 0;

  const MUTATIONS = Object.freeze({
    SET_CURRENT_TABLE_ID: 'SET_CURRENT_TABLE_ID',
    SET_SELECTED_FOODS: 'SET_SELECTED_FOODS',
    ADD_TABLE: 'ADD_TABLE',
    ADD_CHEF: 'ADD_CHEF',
    SET_PENDING_REMOVE_TABLE_ID: 'SET_PENDING_REMOVE_TABLE_ID',
    REMOVE_PENDING_TABLE: 'REMOVE_PENDING_TABLE',
    ASSIGN_ORDER_TO_CHEF: 'ASSIGN_ORDER_TO_CHEF',
    UPDATE_CHEF_ORDER_STATUS: 'UPDATE_CHEF_ORDER_STATUS',
    STORE_COMPLETED_ORDERS_FOR_TABLE: 'STORE_COMPLETED_ORDERS_FOR_TABLE',
  });

  const state = {
    ui: {
      currentTableId: null,
      selectedFoods: [],
      pendingRemoveTableId: null,
    },
    chefs: {
      items: [],
    },
    tables: {
      items: [],
    },
    orders: {
      assignedByChef: {},
      completedByTable: {},
    },
  };

  const mutations = {
    [MUTATIONS.SET_CURRENT_TABLE_ID](state, payload) {
      state.ui.currentTableId = payload;
    },
    [MUTATIONS.SET_SELECTED_FOODS](state, payload) {
      state.ui.selectedFoods = Array.isArray(payload) ? [...payload] : [];
    },
    [MUTATIONS.ADD_TABLE](state) {
      nextTableId += 1;
      state.tables.items = [...state.tables.items, {
        id: nextTableId,
        created_at: (new Date()).valueOf() + nextTableId,
      }];
    },
    [MUTATIONS.ADD_CHEF](state, status) {
      nextChefId += 1;
      state.chefs.items = [...state.chefs.items, {
        id: nextChefId,
        status,
        created_at: (new Date()).valueOf() + nextChefId,
      }];
    },
    [MUTATIONS.SET_PENDING_REMOVE_TABLE_ID](state, payload) {
      state.ui.pendingRemoveTableId = payload;
    },
    [MUTATIONS.REMOVE_PENDING_TABLE](state) {
      const tableId = state.ui.pendingRemoveTableId;
      const exists = state.tables.items.some(table => table.id === tableId);
      if (!exists)
        return;

      const activeOrders = Object.keys(state.orders.assignedByChef).reduce((accumulator, chefId) => {
        const order = state.orders.assignedByChef[chefId];
        if (!order || order.table_id !== tableId)
          return { ...accumulator, [chefId]: order };

        return accumulator;
      }, {});

      state.tables.items = state.tables.items.filter(table => table.id !== tableId);
      state.orders.completedByTable = Object.keys(state.orders.completedByTable)
        .filter(key => key.toString() !== tableId.toString())
        .reduce((accumulator, key) => ({ ...accumulator, [key]: state.orders.completedByTable[key] }), {});
      state.orders.assignedByChef = activeOrders;

      if (state.ui.currentTableId === tableId)
        state.ui.currentTableId = null;

      state.ui.selectedFoods = [];

      state.ui.pendingRemoveTableId = null;
    },
    [MUTATIONS.ASSIGN_ORDER_TO_CHEF](state, payload) {
      const chefId = payload.chefId !== undefined ? payload.chefId : payload.chef_id;
      const { order } = payload;
      state.orders.assignedByChef = { ...state.orders.assignedByChef, [chefId]: order };
    },
    [MUTATIONS.UPDATE_CHEF_ORDER_STATUS](state, payload) {
      const chefId = payload.chefId !== undefined ? payload.chefId : payload.chef_id;
      const chefStatus = payload.chefStatus !== undefined ? payload.chefStatus : payload.chef_status;
      const orderStatus = payload.orderStatus !== undefined ? payload.orderStatus : payload.order_status;

      state.chefs.items = state.chefs.items.map(chef => {
        if (chef.id !== chefId)
          return chef;

        return { ...chef, status: chefStatus };
      });

      const order = state.orders.assignedByChef[chefId];
      if (!order)
        return;

      state.orders.assignedByChef = {
        ...state.orders.assignedByChef,
        [chefId]: { ...order, status: orderStatus },
      };
    },
    [MUTATIONS.STORE_COMPLETED_ORDERS_FOR_TABLE](state, payload) {
      const nextOrdersByChef = { ...state.orders.assignedByChef };
      const groupedOrders = {};

      payload.forEach(order => {
        Object.keys(nextOrdersByChef).forEach(chefId => {
          const chefOrder = nextOrdersByChef[chefId];
          if (chefOrder && chefOrder.id === order.id)
            nextOrdersByChef[chefId] = null;
        });

        const tableId = order.table_id;
        if (!tableId)
          return;

        if (!groupedOrders[tableId])
          groupedOrders[tableId] = [];

        groupedOrders[tableId].push(order);
      });

      state.orders.assignedByChef = nextOrdersByChef;
      state.orders.completedByTable = {
        ...state.orders.completedByTable,
        ...groupedOrders,
      };
    },
  };

  const actions = {
    setCurrentTableId(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SET_CURRENT_TABLE_ID, payload);
    },
    showModalFoodsForTable(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SET_CURRENT_TABLE_ID, payload);
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
    setPendingRemoveTableId(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SET_PENDING_REMOVE_TABLE_ID, payload);
    },
    setConfirmDeleteTableId(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.SET_PENDING_REMOVE_TABLE_ID, payload);
    },
    removePendingTable(context) {
      const { commit } = context;
      commit(MUTATIONS.REMOVE_PENDING_TABLE);
    },
    setActionDeleteTable(context) {
      const { commit } = context;
      commit(MUTATIONS.REMOVE_PENDING_TABLE);
    },
    assignOrderToChef(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.ASSIGN_ORDER_TO_CHEF, payload);
    },
    sendOrderToChef(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.ASSIGN_ORDER_TO_CHEF, payload);
    },
    updateChefOrderStatus(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.UPDATE_CHEF_ORDER_STATUS, payload);
    },
    setChefCooking(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.UPDATE_CHEF_ORDER_STATUS, payload);
    },
    storeCompletedOrdersForTable(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.STORE_COMPLETED_ORDERS_FOR_TABLE, payload);
    },
    sendCompletedFoodsForTable(context, payload) {
      const { commit } = context;
      commit(MUTATIONS.STORE_COMPLETED_ORDERS_FOR_TABLE, payload);
    },
  };

  const getters = {
    getCurrentTableId: (state) => state.ui.currentTableId,
    getCurrentTable: (state) => state.ui.currentTableId,
    getSelectedFoods: (state) => state.ui.selectedFoods,
    getPendingRemoveTableId: (state) => state.ui.pendingRemoveTableId,
    getConfirmDeleteTableId: (state) => state.ui.pendingRemoveTableId,
    getAssignedOrdersByChef: (state) => state.orders.assignedByChef,
    getOrderCookingStatus: (state) => state.orders.assignedByChef,
    getCompletedOrdersForTable: (state) => (tableId) => {
      if (!tableId)
        return [];

      return state.orders.completedByTable[tableId] || [];
    },
    getCompletedFoodsForTable: (state) => (tableId) => {
      if (!tableId)
        return [];

      return state.orders.completedByTable[tableId] || [];
    },
    getChefs: (state) => state.chefs.items,
    getTables: (state) => state.tables.items,

    getChefById: (state) => (chefId) => {
      if (!Array.isArray(state.chefs.items) || !chefId)
        return;

      chefId = chefId.toString();
      return state.chefs.items.find(c => c.id.toString() === chefId);
    },
    getChefInfo: (state) => (chefId) => {
      if (!Array.isArray(state.chefs.items) || !chefId)
        return;

      chefId = chefId.toString();
      return state.chefs.items.find(c => c.id.toString() === chefId);
    },

    getAssignedOrderForChef: (state) => (chefId) => {
      if (!state.orders.assignedByChef || !chefId)
        return;

      return state.orders.assignedByChef[chefId];
    },
    getOrderForChef: (state) => (chefId) => {
      if (!state.orders.assignedByChef || !chefId)
        return;

      return state.orders.assignedByChef[chefId];
    },

    getOrdersByStatus: (state) => (status) => {
      const orders = [];

      if (!state.orders.assignedByChef)
        return orders;

      for (const chef of state.chefs.items) {
        const order = state.orders.assignedByChef[chef.id];
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
