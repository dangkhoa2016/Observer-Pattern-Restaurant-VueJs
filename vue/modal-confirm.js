/*jshint esversion: 9 */

export default {
  computed: {
    ...Vuex.mapGetters({
      confirmDeleteTableId: 'restaurantStore/getConfirmDeleteTableId',
    }),
  },
  watch: {
    confirmDeleteTableId(table_id) {
      if (table_id)
        this.$bvModal.show('modal-delete-table');
      else
        this.$bvModal.hide('modal-delete-table');
    },
  },
  methods: {
    ...Vuex.mapActions({
      setActionDeleteTable: 'restaurantStore/setActionDeleteTable',
      setConfirmDeleteTableId: 'restaurantStore/setConfirmDeleteTableId',
    }),
    handle_ok(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.setActionDeleteTable();
    },
    handle_hidden() {
      this.setConfirmDeleteTableId(null);
    },
  },
};
