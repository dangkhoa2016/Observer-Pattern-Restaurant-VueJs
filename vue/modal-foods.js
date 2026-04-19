/*jshint esversion: 9 */
import FoodItem from './food-item.vue';
import Order from './order.js';

export default {
  components: { FoodItem, },
  computed: {
    ...Vuex.mapGetters({
      currentTableId: 'restaurantStore/getCurrentTableId',
    }),
    selectedFoods() {
      return this.foods.filter(food => food.selected).map(food => (new Order(this.currentTableId, food)));
    },
  },
  watch: {
    currentTableId(tableId) {
      if (tableId) {
        this.resetFoodStates();
        this.$bvModal.show('modal-foods');
      }
    },
  },
  mounted() {
    this.fetchFoods();
  },
  data() {
    return {
      foods: [],
      message: ''
    };
  },
  methods: {
    ...Vuex.mapActions({
      setSelectedFoods: 'restaurantStore/setSelectedFoods',
      setCurrentTableId: 'restaurantStore/setCurrentTableId',
    }),
    resetFoodStates() {
      this.foods.forEach(food => {
        food.selected = false;
      });
    },
    async fetchFoods() {
      try {
        const foods = await window.AppRuntime.loadJson('/assets/data.json');
        this.foods = foods.map(f => {
          f.selected = false;
          return f;
        });
      } catch(ex) {
        window.AppRuntime.reportError(this.$appMessages.MENU_LOAD_ERROR, ex, { source: 'foods' });
      };
    },
    handleOk(ev) {
      this.message = '';
      if (this.selectedFoods.length === 0) {
        ev.preventDefault();
        this.message = this.$appMessages.FOOD_SELECTION_REQUIRED;
      } else
        this.setSelectedFoods(this.selectedFoods);
    },
    handleHidden() {
      this.setCurrentTableId(null);
    },
  },
};
