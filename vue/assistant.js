/*jshint esversion: 9 */
import AssistantLog from './assistant-log.vue';
import AppConstants from './app-constants.js';

const {
  APP_TIMEOUTS,
  ASSISTANT_LOG_MESSAGES,
  createCompletedDishMessage,
  createOrdersReceivedMessage,
} = AppConstants;

export default {
  components: { AssistantLog, },
  methods: {
    ...Vuex.mapActions({
      assignOrderToChef: 'restaurantStore/assignOrderToChef',
      storeCompletedOrdersForTable: 'restaurantStore/storeCompletedOrdersForTable',
    }),
    hideTooltip() {
      this.isHighlighted = false;
      this.$root.$emit('bv::hide::tooltip', `assistant${this._uid}`);
    },
    showTooltip(message) {
      this.tooltipTitle = message;
      this.isHighlighted = true;

      setTimeout(() => { this.$root.$emit('bv::show::tooltip', `assistant${this._uid}`); }, 5);
    },
    highlightAssistant(message, resetHighlight = false) {
      if (resetHighlight) {
        this.hideTooltip();
        this.clearHighlightTimeout();
      }

      this.showTooltip(message);
      this.clearHighlightTimeout();

      this.highlightTimeoutId = setTimeout(() => {
        this.hideTooltip();
      }, APP_TIMEOUTS.ASSISTANT_HIGHLIGHT_MS);
    },
    clearHighlightTimeout() {
      if (!this.highlightTimeoutId)
        return;

      clearTimeout(this.highlightTimeoutId);
      this.highlightTimeoutId = null;
    },
    scheduleDispatch(chefId = null) {
      if (this.orders.length === 0)
        return;

      if (chefId === null && this.dispatchTimeoutId)
        return;

      const dispatch = () => {
        if (chefId === null) {
          this.dispatchTimeoutId = null;
          this.chefs.forEach(chef => this.dispatchToChef(chef.id));
          return;
        }

        this.dispatchToChef(chefId);
      };

      const timeoutId = setTimeout(dispatch, APP_TIMEOUTS.ASSISTANT_DISPATCH_MS);
      if (chefId === null)
        this.dispatchTimeoutId = timeoutId;
    },
    dispatchToChef(chefId) {
      const chef = this.getChefById(chefId);
      if (!chef)
        return;

      if (chef.status !== this.$chefStatus.IDLE)
        return;

      if (this.orders.length === 0)
        return;

      const [order] = this.orders.splice(0, 1);
      this.addInfo(chef.id, order, 'warning bg-opacity-75', 'received');
      this.assignOrderToChef({ chefId, order });
    },
    addInfo(chefId, order, bg, action) {
      const date = new Date();
      const id = date.valueOf() + chefId;
      this.infos.push({
        chef_id: chefId,
        order,
        bg,
        message: ASSISTANT_LOG_MESSAGES[action] || action,
        date,
        id,
        closed: false,
      });
    },
    removeLog(logId) {
      const index = this.infos.findIndex(i => i.id === logId);
      if (index === -1)
        return;

      this.infos.splice(index, 1);
    },
    scheduleDispatchForChef(chefId) {
      if (this.orders.length === 0)
        return;

      this.scheduleDispatch(chefId);
    },
   },
  data() {
    return {
      tooltipTitle: '',
      orders: [],
      isHighlighted: false,
      highlightTimeoutId: null,
      dispatchTimeoutId: null,
      infos: [],
    };
  },
  watch: {
    selectedFoods(orders) {
      if (!Array.isArray(orders) || orders.length === 0)
        return;

      this.highlightAssistant(createOrdersReceivedMessage(this.currentTableId, orders.length));
      this.orders = [...this.orders, ...orders];
      this.scheduleDispatch();
    },
    completedOrders(orders) {
      if (!Array.isArray(orders) || orders.length === 0)
        return;
      
      const completed = orders.map(info => {
        this.addInfo(info.chef_id, info.order, 'info bg-opacity-75', 'completed');

        this.highlightAssistant(createCompletedDishMessage(info.chef_id));
        this.scheduleDispatchForChef(info.chef_id);

        return info.order;
      });

      this.storeCompletedOrdersForTable(completed);
    },
  },
  computed: {
    ...Vuex.mapGetters({
      selectedFoods: 'restaurantStore/getSelectedFoods',
      chefs: 'restaurantStore/getChefs',
      currentTableId: 'restaurantStore/getCurrentTableId',
      getChefById: 'restaurantStore/getChefById',
      getOrdersByStatus: 'restaurantStore/getOrdersByStatus',
    }),
    cardClass() {
      return ['assistant', { highlight: this.isHighlighted }];
    },
    tooltipConfig() {
      return {
        placement: 'left', trigger: 'manual',
        customClass: 'assistant-tooltip bs-tooltip-start',
        title: this.tooltipTitle,
      };
    },
    completedOrders() {
      return this.getOrdersByStatus(this.$orderStatus.DONE);
    },
  },
  beforeDestroy() {
    this.clearHighlightTimeout();

    if (this.dispatchTimeoutId) {
      clearTimeout(this.dispatchTimeoutId);
      this.dispatchTimeoutId = null;
    }
  },
};
