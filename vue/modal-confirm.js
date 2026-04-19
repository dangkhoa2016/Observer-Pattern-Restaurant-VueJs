/*jshint esversion: 9 */

export default {
  computed: {
    ...Vuex.mapGetters({
      pendingRemoveTableId: 'restaurantStore/getPendingRemoveTableId',
    }),
  },
  watch: {
    pendingRemoveTableId(tableId) {
      if (tableId)
        this.$bvModal.show('modal-delete-table');
      else
        this.$bvModal.hide('modal-delete-table');
    },
  },
  methods: {
    ...Vuex.mapActions({
      removePendingTable: 'restaurantStore/removePendingTable',
      setPendingRemoveTableId: 'restaurantStore/setPendingRemoveTableId',
    }),
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();

      this.removePendingTable();
    },
    handleHidden() {
      this.setPendingRemoveTableId(null);
    },
  },
};
