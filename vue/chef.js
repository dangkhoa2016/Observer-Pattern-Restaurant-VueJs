
/*jshint esversion: 9 */
import AppConstants from './app-constants.js';

const { APP_TIMEOUTS, CHEF_SLOGANS } = AppConstants;

export default {
  methods: {
    ...Vuex.mapActions({
      updateChefOrderStatus: 'restaurantStore/updateChefOrderStatus',
    }),
    completeOrder() {
      this.highlightChef();

      setTimeout(() => {
        this.updateChefOrderStatus({
          chefId: this.chef.id,
          chefStatus: this.$chefStatus.IDLE,
          orderStatus: this.$orderStatus.DONE,
        });
        this.currentOrder = null;
      }, this.$appTimeouts.UI_ANIMATION_MS);
    },
    processOrder() {
      this.updateChefOrderStatus({
        chefId: this.chef.id,
        chefStatus: this.$chefStatus.BUSY,
        orderStatus: this.$orderStatus.PROCESSING,
      });
    },
    highlightChef(resetHighlight = false) {
      if (resetHighlight) {
        this.isHighlighted = false;
        this.clearHighlightTimeout();
      }

      this.isHighlighted = true;
      this.clearHighlightTimeout();
      this.highlightTimeoutId = setTimeout(() => {
        this.isHighlighted = false;
      }, APP_TIMEOUTS.CHEF_HIGHLIGHT_MS);
    },
    clearHighlightTimeout() {
      if (!this.highlightTimeoutId)
        return;

      clearTimeout(this.highlightTimeoutId);
      this.highlightTimeoutId = null;
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
      currentOrder: null,
      isHighlighted: false,
      highlightTimeoutId: null,
      progressIcon: 'fas fa-clipboard-check'
    };
  },
  computed: {
    ...Vuex.mapGetters({
      getAssignedOrderForChef: 'restaurantStore/getAssignedOrderForChef',
    }),
    order() {
      return this.getAssignedOrderForChef(this.chef.id);
    },
    tooltipConfig() {
      return {
        placement: 'right', trigger: 'hover',
        customClass: 'custom-tooltip bs-tooltip-end',
      };
    },
    isProcessing() {
      return this.chef.status === this.$chefStatus.BUSY;
    },
    isIdle() {
      return this.chef.status === this.$chefStatus.IDLE;
    },
    chefClass() {
      return [
        'card w-25 chef float-start',
        {
          'processing': this.isProcessing,
          highlight: this.isHighlighted
        }
      ];
    },
  },
  mounted() {
    this.slogan = CHEF_SLOGANS[Math.floor(Math.random() * CHEF_SLOGANS.length)];
  },
  watch: {
    order(val) {
      if (!val || val.status !== this.$orderStatus.PENDING || !this.isIdle)
        return false;

      this.currentOrder = val;
      this.processOrder();
    },
  },
  beforeDestroy() {
    this.clearHighlightTimeout();
  },
};
