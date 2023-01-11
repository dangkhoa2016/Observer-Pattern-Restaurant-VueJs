/*jshint esversion: 9 */

export default {
  data() {
    return {
      isShow: false,
      component_init: true,
    };
  },
  methods: {
    ...Vuex.mapActions({
      addTable: 'restaurantStore/addTable',
    }),
  },
  mounted() {
    setTimeout(() => { this.component_init = false; }, this.$animated_time);
  },
  computed: {
    panel_class() {
      return [{ 'slide-in': this.isShow, 'slide-out': !this.isShow, 'init': this.component_init }];
    },
  },
};
