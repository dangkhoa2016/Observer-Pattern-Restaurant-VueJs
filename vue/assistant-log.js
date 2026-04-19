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
    }, this.$appTimeouts.ASSISTANT_INFO_MS);
  },
  watch: {
    closed(val) {
      if (val)
        setTimeout(() => {
          this.$emit('remove', this.info.id);
        }, this.$appTimeouts.UI_ANIMATION_MS);
    },
  },
  computed: {
    infoClass() {
      return [`animate info bg-${this.info.bg} mb-3 p-2`, { closed: this.closed }];
    },
  },
};
