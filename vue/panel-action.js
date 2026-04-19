/*jshint esversion: 9 */

export default {
  data() {
    return {
      isShow: false,
      componentInit: true,
    };
  },
  methods: {
    ...Vuex.mapActions({
      addTable: 'restaurantStore/addTable',
    }),
  },
  mounted() {
    setTimeout(() => {
      this.componentInit = false;
    }, this.$appTimeouts.UI_ANIMATION_MS);
  },
  computed: {
    panelClass() {
      return [{ 'slide-in': this.isShow, 'slide-out': !this.isShow, 'init': this.componentInit }];
    },
  },
};
