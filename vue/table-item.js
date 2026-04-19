/*jshint esversion: 9 */
import OrderFood from './order-food.vue';
import AppConstants from './app-constants.js';

const { APP_LABELS, APP_TIMEOUTS, TABLE_SLOGANS } = AppConstants;

export default {
  components: { OrderFood, },
  props: {
    table: {
      type: Object,
      default: () => { return {}; }
    },
    index: {
      type: Number,
      default: () => { return 0; }
    },
  },
  watch: {
    selectedFoods(orders) {
      if (this.currentTableId === this.tableId)
        this.orders = [...this.orders, ...orders];
    },
  },
  data() {
    return {
      slogan: '',
      orders: [],
      isHighlighted: false,
      tooltipTitle: APP_LABELS.RECEIVE_UPDATES_TOOLTIP,
      assistantUnsubscribe: null,
      highlightTimeoutId: null,
    };
  },
  methods: {
    ...Vuex.mapActions({
      setCurrentTableId: 'restaurantStore/setCurrentTableId',
      setPendingRemoveTableId: 'restaurantStore/setPendingRemoveTableId',
    }),
    showMenuForTable() {
      this.setCurrentTableId(this.tableId);
    },
    confirmRemoveTable() {
      this.setPendingRemoveTableId(this.tableId);
    },
    hideTooltip() {
      this.isHighlighted = false;
      this.$root.$emit('bv::hide::tooltip', `tb-${this.tableId}`);
    },
    showTooltip() {
      this.isHighlighted = true;
      this.$root.$emit('bv::show::tooltip', `tb-${this.tableId}`);
    },
    highlightTable(resetHighlight = false) {
      if (resetHighlight) {
        this.hideTooltip();
        this.clearHighlightTimeout();
      }

      this.showTooltip();
      this.clearHighlightTimeout();

      this.highlightTimeoutId = setTimeout(() => {
        this.hideTooltip();
      }, APP_TIMEOUTS.TABLE_HIGHLIGHT_MS);
    },
    clearHighlightTimeout() {
      if (!this.highlightTimeoutId)
        return;

      clearTimeout(this.highlightTimeoutId);
      this.highlightTimeoutId = null;
    },
    subscribeToAssistant() {
      if (this.assistantUnsubscribe)
        return;

      this.assistantUnsubscribe = this.$watch(() => this.completedOrdersForTable, completed => {
        if (!Array.isArray(completed) || completed.length === 0)
          return;

        this.highlightTable();

        completed.forEach(order => {
          const found = this.orders.find(item => item.id === order.id);
          if (found)
            found.status = order.status;
        });
      });
    },
    unsubscribeFromAssistant() {
      if (!this.assistantUnsubscribe)
        return;

      this.assistantUnsubscribe();
      this.assistantUnsubscribe = null;
    },
    handleEatComplete(orderId) {
      if (typeof orderId !== 'number')
        return;

      const indx = this.orders.findIndex(o => o.id === orderId);
      if (indx === -1)
        return;

      this.orders.splice(indx, 1);
    },
  },
  computed: {
    ...Vuex.mapGetters({
      currentTableId: 'restaurantStore/getCurrentTableId',
      selectedFoods: 'restaurantStore/getSelectedFoods',
      getCompletedOrdersForTable: 'restaurantStore/getCompletedOrdersForTable',
    }),
    offsetLeft() {
      return this.index * 20;
    },
    tableId() {
      return this.table.id;
    },
    completedOrdersForTable() {
      return this.getCompletedOrdersForTable(this.tableId);
    },
    cardClass() {
      return ['draggable w-20 float-start', { highlight: this.isHighlighted }];
    },
  },
  mounted() {
    new Draggabilly(this.$el, { handle: '.card-header' });
    this.slogan = TABLE_SLOGANS[Math.floor(Math.random() * TABLE_SLOGANS.length)];
  },
  created() {
    this.subscribeToAssistant();
  },
  beforeDestroy() {
    this.unsubscribeFromAssistant();
    this.clearHighlightTimeout();
  },
};
