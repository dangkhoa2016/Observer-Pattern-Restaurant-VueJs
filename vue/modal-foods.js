/*jshint esversion: 9 */
import FoodItem from './food-item.vue';
import Order from './order.js';

export default {
  components: { FoodItem, },
  computed: {
    ...Vuex.mapGetters({
      menuOpenForTable: 'restaurantStore/getCurrentTable',
    }),
    selectedFoods() {
      return this.foods.filter(food => food.selected).map(f => (new Order(this.menuOpenForTable, f)));
    },
  },
  watch: {
    menuOpenForTable(table) {
      if (table) {
        this.reset_food_states();
        this.$bvModal.show('modal-foods');
      }
    },
  },
  mounted() {
    this.fetch_foods();
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
      showModalFoodsForTable: 'restaurantStore/showModalFoodsForTable',
    }),
    reset_food_states() {
      this.foods.forEach(food => {
        food.selected = false;
      });
    },
    async fetch_foods() {
      try {
        const response = await fetch('/assets/data.json');
        this.foods = (await response.json()).map(f => {
          f.selected = false;
          return f;
        });
      } catch(ex) {
        console.log('Error fetch foods', ex);
      };
    },
    handle_ok(ev) {
      this.message = '';
      if (this.selectedFoods.length === 0) {
        ev.preventDefault();
        this.message = 'Please select at least one food !';
      } else
        this.setSelectedFoods(this.selectedFoods);
    },
    handle_hidden() {
      this.showModalFoodsForTable(null);
    },
  },
};
