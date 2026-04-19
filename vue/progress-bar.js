
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
      timeToCompleteMs: 0,
      parts: [],
      timeoutNextId: null,
      currentPartIndex: -1,
      progressClass: 'progress-bar progress-bar-striped progress-bar-animated'
    };
  },
  created() {
    this.timeToCompleteMs = this.timeToComplete * 1000;
    this.parts = this.$helper.randomProgressParts(100).map((percent, indx) => ({
      id: `pb-${(new Date()).valueOf() + indx}`,
      show: false, value: percent,
      bgColor: this.$helper.randomProgressColor()
    }));
    this.currentPartIndex = 0;
  },
  watch: {
    skipTimeout(val) {
      if (val) {
        this.clearTimeoutStep();
        this.completePart();
      }
    },
    currentPartIndex() {
      this.runStep();
    },
  },
  computed: {
    waitTime() {
      const percent = this.parts[this.currentPartIndex].value;
      return (percent * this.timeToCompleteMs) / 100;
    },
  },
  methods: {
    completePart() {
      this.parts[this.currentPartIndex].show = true;
      this.currentPartIndex += 1;
    },
    runStep() {
      if (typeof this.currentPartIndex !== 'number' ||
        !this.parts || this.parts.length <= this.currentPartIndex) {
        this.emitComplete();
        return;
      }

      if (this.skipTimeout) {
        this.clearTimeoutStep();
        this.completePart();
        return;
      }

      this.timeoutNextId = setTimeout(() => {
        this.completePart();
      }, this.waitTime);
    },
    emitComplete() {
      this.$emit('progress-bar-complete');
    },
    clearTimeoutStep() {
      if (!this.timeoutNextId)
        return;

      clearTimeout(this.timeoutNextId);
      this.timeoutNextId = null;
    },
  },
};
