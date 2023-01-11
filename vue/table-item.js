/*jshint esversion: 9 */
const slogans = ['For the President...', 'The best of the best...',
  'Only very important person...', 'Greatest person...'];
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
      is_hight_light: false,
      tooltip_title: 'Receive info from Assistant',
      base_unsubscribe: null,
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
      this.is_hight_light = false;
      this.$root.$emit('bv::hide::tooltip', `tb-${this.table_id}`);
    },
    show_tooltip() {
      this.is_hight_light = true;
      this.$root.$emit('bv::show::tooltip', `tb-${this.table_id}`);
    },
    hight_light_test(unhighlight = false) {
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
      this.base_unsubscribe = this.$watch('completedFoodsForTable', (completed) => {
        if (!Array.isArray(completed) || completed.length === 0)
          return;

        this.hight_light_test();

        completed.map(order => {
          let found = this.orders.find(o => o.id === order.id);
          if (found) {
            found.status = order.status;
            console.log(`Table [${this.table_id}] is eating Food [${order.food.name}]`);
          }
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
      completedFoodsForTable: 'restaurantStore/getCompletedFoodsForTable',
    }),
    offset_left() {
      return this.index * 20;
    },
    table_id() {
      return this.table.id;
    },
    card_class() {
      return ['draggable w-20 float-start', { 'hight-light': this.is_hight_light }];
    },
  },
  mounted() {
    new Draggabilly(this.$el, { handle: '.card-header' });
    this.slogan = slogans[Math.floor(Math.random() * slogans.length)];
  },
  created() {
    this.subscribe();
  },
};
