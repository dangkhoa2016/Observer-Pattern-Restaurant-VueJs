/*jshint esversion: 9 */

export default {
  props: {
    food: {
      type: Object,
      default: () => { return {}; }
    },
  },
  methods: {
    toggle_select() {
      this.food.selected = !this.food.selected;
    },
  },
  data() {
    return {
      inactive_class: 'far fa-square',
      not_select_text: 'Not select',
      selected_text: 'Selected',
      bg_color: '',
      hover_color: '',
    };
  },
  created() {
    let color = this.$helper.random_color();
    let bg_color = this.$helper.color_shade(color.bg, 40);
    let hover_color = this.$helper.color_shade(color.bg, 80);
    while (
      hover_color.toLowerCase() === '#fff' ||
      hover_color.toLowerCase() === '#ffffff' ||
      bg_color.toLowerCase() === '#fff' ||
      bg_color.toLowerCase() === '#ffffff'
    ) {
      color = this.$helper.random_color();
      bg_color = this.$helper.color_shade(color.bg, 40);
      hover_color = this.$helper.color_shade(color.bg, 80);
    }

    this.food.color = color;
    this.bg_color = bg_color;
    this.hover_color = hover_color;
  },
  computed: {
    status_class() { return this.food.selected ? this.active_class : this.inactive_class; },
    food_class_name() { return `food-color-${this._uid}`; },
    button_class() { return [this.class_name, this.food.color.css, { 'focus': this.food.selected }] },
    active_class() { return `fa fa-check-square ${this.class_name}`; },
    status_text() { return this.food.selected ? this.selected_text : this.not_select_text; },
    box_shadow() { return this.$helper.hex_to_rgba(this.food.color.bg, '.25'); },
  },
};
