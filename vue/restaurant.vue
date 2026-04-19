<script>

  import TableHolder from './table-holder.vue';
  import ChefHolder from './chef-holder.vue';
  import PanelAction from './panel-action.vue';
  import ModalFoods from './modal-foods.vue';
  import ModalConfirm from './modal-confirm.vue';
  import WelcomeModal from './welcome-modal.vue';
  import Assistant from './assistant.vue';

  import Helper from './helper.js';
  import AppConstants from './app-constants.js';

  const {
    APP_LABELS,
    APP_MESSAGES,
    APP_TIMEOUTS,
    CHEF_STATUS,
    DEFAULT_COUNTS,
    ORDER_STATUS,
  } = AppConstants;

  Vue.prototype.$helper = Helper;
  Vue.prototype.$appLabels = APP_LABELS;
  Vue.prototype.$appMessages = APP_MESSAGES;
  Vue.prototype.$appTimeouts = APP_TIMEOUTS;
  Vue.prototype.$chefStatus = CHEF_STATUS;
  Vue.prototype.$orderStatus = ORDER_STATUS;

  const store = new Vuex.Store({
    modules: {
      restaurantStore: window.store.restaurantStore,
    },
  });
  
  app = new Vue({
    components: {
      TableHolder, ChefHolder,
      PanelAction, ModalConfirm,
      ModalFoods, WelcomeModal,
      Assistant,
    },
    el: '#app',
    template: app.html,
    store,
    data() {
      return {
        showGoToTop: false,
        tableCount: DEFAULT_COUNTS.TABLES,
        chefCount: DEFAULT_COUNTS.CHEFS,
      };
    },
    methods: {
      ...Vuex.mapActions({
        addTable: 'restaurantStore/addTable',
        addChef: 'restaurantStore/addChef',
      }),
      handleScroll() {
        this.showGoToTop = window.scrollY > 300;
      },
      handleRuntimeError(event) {
        const detail = event.detail || {};
        if (!detail.message || !this.$bvToast)
          return;

        this.$bvToast.toast(detail.message, {
          title: `${detail.source || 'application'} error`,
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
      },
      goToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      createTables() {
        for (let index = 0; index < this.tableCount; index++)
          this.addTable();
      },
      createChefs() {
        for (let index = 0; index < this.chefCount; index++)
          this.addChef(this.$chefStatus.IDLE);
      },
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('restaurant:error', this.handleRuntimeError);

      // mod to work with boostrap 5
      this.$root.$on('bv::tooltip::shown', bvEvent => {
        const arrow = document.querySelector(`#${bvEvent.componentId} .arrow`);
        if (arrow)
          arrow.classList.replace('arrow', 'tooltip-arrow');
      });

      this.createTables();
      this.createChefs();
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('restaurant:error', this.handleRuntimeError);
    },
    mounted() {
      this.$root.$bvModal.show('welcome-modal');
    },
  });

  export default app;

</script>
