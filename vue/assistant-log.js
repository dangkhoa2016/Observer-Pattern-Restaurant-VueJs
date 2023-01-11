/*jshint esversion: 9 */

export default {
  props: {
    info: {
      type: Object,
      default: () => { return {}; },
    },
  },
  data() {
    return {
      closed: false,
    };
  },
  created() {
    setTimeout(() => {
      this.closed = true;
    }, 8000);
  },
  watch: {
    closed(val) {
      if (val)
        setTimeout(() => { this.$emit('remove', this.info.id); }, this.$animated_time);
    },
  },
  computed: {
    info_class() {
      return [`animate info bg-${this.info.bg} mb-3 p-2`, { closed: this.closed }];
    },
  },
};
