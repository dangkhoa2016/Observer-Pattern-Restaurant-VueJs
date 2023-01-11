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
      this.is_hight_light = false;
      this.$root.$emit('bv::hide::tooltip', `assistant${this._uid}`);
    },
    show_tooltip(message) {
      this.tooltip_title = message;
      this.is_hight_light = true;

      setTimeout(() => { this.$root.$emit('bv::show::tooltip', `assistant${this._uid}`); }, 5);
    },
    hight_light_test(message, unhighlight = false) {
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
    send_to_chefs() {
      if (this.orders.length === 0)
        return;

      const time_wait = this.timeout_to_send * 1000;
      console.log(`Wait for ${time_wait} to send orders to chefs.`);

      setTimeout(() => {
        for (let i = 0; i < this.chefs.length; i++)
          this.send_to_chef(this.chefs[i].id);
      }, time_wait);
    },
    send_to_chef(chef_id) {
      const chef = this.getChefInfo(chef_id);
      if (!chef)
        return;

      if (chef.status !== this.$chef_status_free) {
        console.log(`Chef [${chef.id}] is busy.`);
        return;
      }

      if (this.orders.length === 0) {
        console.log('No orders.');
        return;
      }

      const [order] = this.orders.splice(0, 1);
      console.log(`Send Order [${order.id}] to Chef [${chef.id}]`);
      this.add_info(chef.id, order, 'warning bg-opacity-75', 'received');
      this.sendOrderToChef({ chef_id, order });
    },
    add_info(chef_id, order, bg, action) {
      const date =  new Date();
      const id = date.valueOf() + chef_id;
      if (action === 'completed')
        console.log(`Chef [${chef_id}] completed Order [${order.id}:${order.food.name}]`);

      this.infos.push({ chef_id, order, bg, action, date, id, closed: false });
    },
    remove_log(log_id) {
      const index = this.infos.findIndex(i => i.id === log_id);
      if (index === -1)
        return;

      this.infos.splice(index, 1);
    },
    assign_job(chef_id) {
      if (this.orders.length === 0) {
        console.log('No orders.');
        return;
      }

      const time_wait = this.timeout_to_send * 1000;

      setTimeout(() => {
        for (const chef of this.chefs) {
          if (chef.id === chef_id) {
            this.send_to_chef(chef.id);
            break;
          }
        };
      }, time_wait);
    },
   },
  data() {
    return {
      tooltip_title: '',
      orders: [],
      is_hight_light: false,
      timeout_to_send: 3,
      timeout_unhighlight: null,
      infos: [],
    };
  },
  watch: {
    selectedFoods(orders) {
      this.hight_light_test(`Receive ${orders.length} order(s) from Table [${this.currentTable}]`);
      this.orders = [...this.orders, ...orders];
      console.log(`Receive ${orders.length} order(s)`, orders, 'from table', this.currentTable, 'total', this.orders.length);
      this.send_to_chefs();
    },
    completed_orders(orders) {
      if (!Array.isArray(orders) || orders.length === 0)
        return;
      
      const completed = orders.map(info => {
        this.add_info(info.chef_id, info.order, 'info bg-opacity-75', 'completed');

        this.hight_light_test(`Receive completed food from Chef [${info.chef_id}]`);

        console.log('Remain: ', this.orders);
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
      return ['assistant', { 'hight-light': this.is_hight_light }];
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
};
