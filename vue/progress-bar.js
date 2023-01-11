
/*jshint esversion: 9 */

export default {
  props: {
    timeToComplete: {
      type: Number,
      default: () => { return 3; }
    },
    skipTimeout: {
      type: Boolean,
      default: () => { return false; }
    },
  },
  data() {
    return {
      time_to_complete: 0,
      parts: [],
      timeout_next: null,
      current_part_index: -1,
      bg_color: '',
      progress_class: 'progress-bar progress-bar-striped progress-bar-animated'
    };
  },
  created() {
    this.time_to_complete = this.timeToComplete * 1000;
    this.parts = this.$helper.random_progress_test(100).map((percent, indx) => ({
      id: `pb-${(new Date()).valueOf() + indx}`,
      show: false, value: percent,
      bg_color: this.$helper.random_progress_color()
    }));
    this.current_part_index = 0;
  },
  watch: {
    skipTimeout(val) {
      if (val) {
        this.clear_timeout();
        this.complete_part();
      }
    },
    current_part_index(val) {
      this.do_step();
    },
  },
  computed: {
    wait_time() {
      const percent = this.parts[this.current_part_index].value;
      return (percent * this.time_to_complete) / 100;
    },
  },
  methods: {
    complete_part() {
      this.parts[this.current_part_index].show = true;
      this.current_part_index += 1;
    },
    do_step() {
      if (typeof this.current_part_index !== 'number' ||
        !this.parts || this.parts.length <= this.current_part_index) {
        this.call_complete();
        return;
      }

      if (this.skipTimeout) {
        this.clear_timeout();
        this.complete_part();
        return;
      }

      this.timeout_next = setTimeout(() => { this.complete_part(); }, this.wait_time);
    },
    call_complete() {
      this.$emit('progress-bar-complete');
    },
    clear_timeout() {
      if (!this.timeout_next)
        return;

      clearTimeout(this.timeout_next);
      this.timeout_next = null;
    },
  },
};
