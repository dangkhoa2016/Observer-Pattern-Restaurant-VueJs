/*jshint esversion: 9 */
import AssistantLog from './assistant-log.vue';

export default {
  components: { AssistantLog, },
  methods: {
    ...Vuex.mapActions({
      sendOrderToChef: 'restaurantStore/sendOrderToChef',
      sendCompletedFoodsForTable: 'restaurantStore/sendCompletedFoodsForTable',
    }),
    hide_tooltip() {
      this.is_highlight = false;
      this.$root.$emit('bv::hide::tooltip', `assistant${this._uid}`);
    },
    show_tooltip(message) {
      this.tooltip_title = message;
      this.is_highlight = true;

      setTimeout(() => { this.$root.$emit('bv::show::tooltip', `assistant${this._uid}`); }, 5);
    },
    highlight_test(message, unhighlight = false) {
      if (unhighlight) {
        this.hide_tooltip();
        this.clear_timeout();
      }

      this.show_tooltip(message);
      this.clear_timeout();

      this.timeout_unhighlight = setTimeout(() => { this.hide_tooltip(); }, this.$tooltip_manual_time);
    },
    clear_timeout() {
      if (!this.timeout_unhighlight)
        return;

      clearTimeout(this.timeout_unhighlight);
      this.timeout_unhighlight = null;
    },
    schedule_send_to_chefs(chef_id = null) {
      if (this.orders.length === 0)
        return;

      if (chef_id === null && this.dispatch_timeout_id)
        return;

      const wait_time = this.timeout_to_send * 1000;
      const dispatch = () => {
        if (chef_id === null) {
          this.dispatch_timeout_id = null;
          this.chefs.forEach(chef => this.send_to_chef(chef.id));
          return;
        }

        this.send_to_chef(chef_id);
      };

      const timeout_id = setTimeout(dispatch, wait_time);
      if (chef_id === null)
        this.dispatch_timeout_id = timeout_id;
    },
    send_to_chef(chef_id) {
      const chef = this.getChefInfo(chef_id);
      if (!chef)
        return;

      if (chef.status !== this.$chef_status_free)
        return;

      if (this.orders.length === 0)
        return;

      const [order] = this.orders.splice(0, 1);
      this.add_info(chef.id, order, 'warning bg-opacity-75', 'received');
      this.sendOrderToChef({ chef_id, order });
    },
    add_info(chef_id, order, bg, action) {
      const date =  new Date();
      const id = date.valueOf() + chef_id;
      this.infos.push({ chef_id, order, bg, action, date, id, closed: false });
    },
    remove_log(log_id) {
      const index = this.infos.findIndex(i => i.id === log_id);
      if (index === -1)
        return;

      this.infos.splice(index, 1);
    },
    assign_job(chef_id) {
      if (this.orders.length === 0)
        return;

      this.schedule_send_to_chefs(chef_id);
    },
   },
  data() {
    return {
      tooltip_title: '',
      orders: [],
      is_highlight: false,
      timeout_to_send: 3,
      timeout_unhighlight: null,
      dispatch_timeout_id: null,
      infos: [],
    };
  },
  watch: {
    selectedFoods(orders) {
      if (!Array.isArray(orders) || orders.length === 0)
        return;

      this.highlight_test(`Receive ${orders.length} order(s) from Table [${this.currentTable}]`);
      this.orders = [...this.orders, ...orders];
      this.schedule_send_to_chefs();
    },
    completed_orders(orders) {
      if (!Array.isArray(orders) || orders.length === 0)
        return;
      
      const completed = orders.map(info => {
        this.add_info(info.chef_id, info.order, 'info bg-opacity-75', 'completed');

        this.highlight_test(`Receive completed food from Chef [${info.chef_id}]`);
        this.assign_job(info.chef_id);

        return info.order;
      });

      this.sendCompletedFoodsForTable(completed);
    },
  },
  computed: {
    ...Vuex.mapGetters({
      selectedFoods: 'restaurantStore/getSelectedFoods',
      chefs: 'restaurantStore/getChefs',
      currentTable: 'restaurantStore/getCurrentTable',
      getChefInfo: 'restaurantStore/getChefInfo',
      getOrdersByStatus: 'restaurantStore/getOrdersByStatus',
    }),
    card_class() {
      return ['assistant', { highlight: this.is_highlight }];
    },
    tooltip_config() {
      return {
        placement: 'left', trigger: 'manual',
        customClass: 'assistant-tooltip bs-tooltip-start',
        title: this.tooltip_title,
      };
    },
    completed_orders() {
      return this.getOrdersByStatus(this.$order_status_done);
    },
  },
  beforeDestroy() {
    this.clear_timeout();

    if (this.dispatch_timeout_id) {
      clearTimeout(this.dispatch_timeout_id);
      this.dispatch_timeout_id = null;
    }
  },
};
