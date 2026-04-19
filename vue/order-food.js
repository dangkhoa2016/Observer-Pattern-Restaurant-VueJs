/*jshint esversion: 9 */

export default {
  props: {
    order: {
      type: Object,
      default: () => { return { color: {} }; }
    },
  },
  methods: {
    handleEatComplete() {
      this.completed = true;
      setTimeout(() => {
        this.$emit('eat-complete', this.order.id);
      }, this.$appTimeouts.UI_ANIMATION_MS);
    },
  },
  computed: {
    tooltipConfig() {
      return {
        placement: 'right', trigger: 'hover',
        customClass: 'custom-tooltip bs-tooltip-end',
      };
    },
    orderClass() {
      return ['animate', { 'closed': this.completed }];
    },
    foodIsCooked() {
      return this.order.status === this.$orderStatus.DONE;
    },
  },
  data() {
    return {
      completed: false,
      progressIcon: 'fas fa-check-double'
    };
  },
};
