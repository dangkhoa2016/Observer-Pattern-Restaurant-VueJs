<script>

  import TableHolder from './table-holder.vue';
  import ChefHolder from './chef-holder.vue';
  import PanelAction from './panel-action.vue';
  import ModalFoods from './modal-foods.vue';
  import ModalConfirm from './modal-confirm.vue';
  import WelcomeModal from './welcome-modal.vue';
  import Assistant from './assistant.vue';

  import Helper from './helper.js';
  Vue.prototype.$helper = Helper;

  //const variable
  Vue.prototype.$tooltip_manual_time = 4000;
  Vue.prototype.$tooltip_chef_time = 2000;
  Vue.prototype.$animated_time = 500;
  Vue.prototype.$wait_for_user_to_see_time = 1000;
  Vue.prototype.$chef_status_free = 1;
  Vue.prototype.$chef_status_processing = 2;
  Vue.prototype.$order_status_done = 3;
  Vue.prototype.$order_status_created = 1;

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
        show_go_to_top: false,
        table_count: 2,
        chef_count: 2,
      };
    },
    methods: {
      ...Vuex.mapActions({
        addTable: 'restaurantStore/addTable',
        addChef: 'restaurantStore/addChef',
      }),
      setCompleted() {
        delete window.store;
        delete window.options;
        delete window.sleep;
      },
      handleScroll(ev) {
        this.show_go_to_top = window.scrollY > 300;
      },
      go_to_top() {
        window.scrollTo(0, 0);
      },
      createTable() {
        for (let index = 0; index < this.table_count; index++)
          this.addTable();
      },
      createChef() {
        for (let index = 0; index < this.chef_count; index++)
          this.addChef(this.$chef_status_free);
      },
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);

      // mod to work with boostrap 5
      this.$root.$on('bv::tooltip::shown', bvEvent => {
        const arrow = document.querySelector(`#${bvEvent.componentId} .arrow`);
        arrow.classList.replace('arrow', 'tooltip-arrow');
      });

      this.createTable();
      this.createChef();
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    mounted() {
      this.$root.$bvModal.show('welcome-modal');
    },
  });

  export default app;

</script>
