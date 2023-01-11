
/*jshint esversion: 9 */
const slogans = ['Bring Out The Foodie In You.', 'Find Happiness In Cooking.',
  'Awaken Your Inner Chef.', 'Bring Out The Chef In You.'];

export default {
  methods: {
    ...Vuex.mapActions({
      setChefCooking: 'restaurantStore/setChefCooking',
    }),
    complete_order() {
      this.hight_light_test();

      setTimeout(() => {
        this.setChefCooking({ chef_id: this.chef.id, chef_status: this.$chef_status_free, order_status: 3 });
        this.current_order = null;
      }, this.$animated_time);
    },
    process_order() {
      //this.hight_light_test(true);

      // processing
      this.setChefCooking({ chef_id: this.chef.id, chef_status: this.$chef_status_processing, order_status: 2 });
    },
    hight_light_test(unhighlight = false) {
      if (unhighlight) {
        this.is_hight_light = false;
        this.clear_timeout();
      }

      this.is_hight_light = true;
      this.clear_timeout();
      this.timeout_unhighlight = setTimeout(() => { this.is_hight_light = false; }, this.$tooltip_chef_time);
    },
    clear_timeout() {
      if (!this.timeout_unhighlight)
        return;

      clearTimeout(this.timeout_unhighlight);
      this.timeout_unhighlight = null;
    },
  },
  props: {
    chef: {
      type: Object,
      default: () => { return {}; }
    },
  },
  data() {
    return {
      slogan: '',
      current_order: null,
      is_hight_light: false,
      timeout_unhighlight: null,
      progress_icon: 'fas fa-clipboard-check'
    };
  },
  computed: {
    ...Vuex.mapGetters({
      getOrderForChef: 'restaurantStore/getOrderForChef',
      getChefInfo: 'restaurantStore/getChefInfo',
    }),
    order() {
      return this.getOrderForChef(this.chef.id);
    },
    tooltip_config() {
      return {
        placement: 'right', trigger: 'hover',
        customClass: 'custom-tooltip bs-tooltip-end',
      };
    },
    is_processing() {
      return this.chef.status === this.$chef_status_processing;
    },
    is_free() {
      return this.chef.status === this.$chef_status_free;
    },
    chef_class() {
      return [
        'card w-25 chef float-start',
        {
          'processing': this.is_processing,
          'hight-light': this.is_hight_light
        }
      ];
    },
  },
  mounted() {
    this.slogan = slogans[Math.floor(Math.random() * slogans.length)];
  },
  watch: {
    order(val) {
      if (!val || val.status !== this.$order_status_created || !this.is_free)
        return false;

      this.current_order = val;
      this.process_order();
    },
  },
};
