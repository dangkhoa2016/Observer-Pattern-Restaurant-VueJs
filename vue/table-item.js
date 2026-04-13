/*jshint esversion: 9 */
const slogans = ['Fit for a president...', 'Only the best...',
  'Reserved for VIPs...', 'For our most valued guests...'];
import OrderFood from './order-food.vue';

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
    selectedFoods(val) {
      if (this.menuOpenForTable === this.table_id)
        this.orders = [...this.orders, ...val];
    },
  },
  data() {
    return {
      closed: false,
      slogan: '',
      orders: [],
      is_highlight: false,
      tooltip_title: 'Receive updates from the assistant',
      base_unsubscribe: null,
      timeout_unhighlight: null,
    };
  },
  methods: {
    ...Vuex.mapActions({
      showModalFoodsForTable: 'restaurantStore/showModalFoodsForTable',
      setConfirmDeleteTableId: 'restaurantStore/setConfirmDeleteTableId',
    }),
    showModalFoods() {
      this.showModalFoodsForTable(this.table_id);
    },
    showConfirmRemove() {
      this.setConfirmDeleteTableId(this.table_id);
    },
    hide_tooltip() {
      this.is_highlight = false;
      this.$root.$emit('bv::hide::tooltip', `tb-${this.table_id}`);
    },
    show_tooltip() {
      this.is_highlight = true;
      this.$root.$emit('bv::show::tooltip', `tb-${this.table_id}`);
    },
    highlight_test(unhighlight = false) {
      if (unhighlight) {
        this.hide_tooltip();
        this.clear_timeout();
      }

      this.show_tooltip();
      this.clear_timeout();

      this.timeout_unhighlight = setTimeout(() => { this.hide_tooltip(); }, this.$tooltip_manual_time);
    },
    clear_timeout() {
      if (!this.timeout_unhighlight)
        return;

      clearTimeout(this.timeout_unhighlight);
      this.timeout_unhighlight = null;
    },
    subscribe() {
      if (this.base_unsubscribe)
        return;

      this.base_unsubscribe = this.$watch(() => this.completedFoodsForTable, completed => {
        if (!Array.isArray(completed) || completed.length === 0)
          return;

        this.highlight_test();

        completed.forEach(order => {
          const found = this.orders.find(item => item.id === order.id);
          if (found)
            found.status = order.status;
        });
      });
    },
    unsubscribe() {
      if (!this.base_unsubscribe)
        return;

      this.base_unsubscribe();
      this.base_unsubscribe = null;
    },
    eat_complete(order_id) {
      if (typeof order_id !== 'number')
        return;

      const indx = this.orders.findIndex(o => o.id === order_id);
      if (indx === -1)
        return;

      this.orders.splice(indx, 1);
    },
  },
  computed: {
    ...Vuex.mapGetters({
      menuOpenForTable: 'restaurantStore/getCurrentTable',
      selectedFoods: 'restaurantStore/getSelectedFoods',
      getCompletedFoodsForTable: 'restaurantStore/getCompletedFoodsForTable',
    }),
    offset_left() {
      return this.index * 20;
    },
    table_id() {
      return this.table.id;
    },
    completedFoodsForTable() {
      return this.getCompletedFoodsForTable(this.table_id);
    },
    card_class() {
      return ['draggable w-20 float-start', { highlight: this.is_highlight }];
    },
  },
  mounted() {
    new Draggabilly(this.$el, { handle: '.card-header' });
    this.slogan = slogans[Math.floor(Math.random() * slogans.length)];
  },
  created() {
    this.subscribe();
  },
  beforeDestroy() {
    this.unsubscribe();
    this.clear_timeout();
  },
};
