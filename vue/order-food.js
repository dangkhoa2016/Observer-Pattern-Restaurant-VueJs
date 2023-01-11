/*jshint esversion: 9 */

export default {
  props: {
    order: {
      type: Object,
      default: () => { return { color: {} }; }
    },
  },
  methods: {
    eat_complete() {
      this.completed = true;
      setTimeout(() => {
        this.$emit('eat-complete', this.order.id);
      }, this.$animated_time);
    },
  },
  computed: {
    tooltip_config() {
      return {
        placement: 'right', trigger: 'hover',
        customClass: 'custom-tooltip bs-tooltip-end',
      };
    },
    order_class() {
      return ['animate', { 'closed': this.completed }];
    },
    food_is_cooked() {
      return this.order.status === this.$order_status_done;
    },
  },
  data() {
    return {
      completed: false,
      progress_icon: 'fas fa-check-double'
    };
  },
};
