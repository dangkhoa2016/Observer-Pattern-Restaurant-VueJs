/*jshint esversion: 9 */

export default {
  props: {
    food: {
      type: Object,
      default: () => { return {}; }
    },
  },
  methods: {
    toggleSelect() {
      this.food.selected = !this.food.selected;
    },
  },
  data() {
    return {
      inactiveClass: 'far fa-square',
      unselectedText: 'Not selected',
      selectedText: 'Selected',
      bgColor: '',
      hoverColor: '',
    };
  },
  created() {
    let color = this.$helper.randomColor();
    let bgColor = this.$helper.colorShade(color.bg, 40);
    let hoverColor = this.$helper.colorShade(color.bg, 80);
    while (
      hoverColor.toLowerCase() === '#fff' ||
      hoverColor.toLowerCase() === '#ffffff' ||
      bgColor.toLowerCase() === '#fff' ||
      bgColor.toLowerCase() === '#ffffff'
    ) {
      color = this.$helper.randomColor();
      bgColor = this.$helper.colorShade(color.bg, 40);
      hoverColor = this.$helper.colorShade(color.bg, 80);
    }

    this.food.color = color;
    this.bgColor = bgColor;
    this.hoverColor = hoverColor;
  },
  computed: {
    statusClass() { return this.food.selected ? this.activeClass : this.inactiveClass; },
    foodClassName() { return `food-color-${this._uid}`; },
    buttonClass() { return [this.foodClassName, this.food.color.css, { 'focus': this.food.selected }]; },
    activeClass() { return `fa fa-check-square ${this.foodClassName}`; },
    statusText() { return this.food.selected ? this.selectedText : this.unselectedText; },
    boxShadow() { return this.$helper.hexToRgba(this.food.color.bg, '.25'); },
  },
};
