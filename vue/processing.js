
/*jshint esversion: 9 */
import ProgressBar from './progress-bar.vue';

export default {
  components: { ProgressBar, },
  props: {
    progressIcon: String,
  },
  data() {
    return {
      completed: false,
      timeToComplete: 0,
      skipTimeout: false,
    };
  },
  methods: {
    markCompleted() {
      setTimeout(() => {
        this.completed = true;
        this.$emit('complete');
      }, this.$appTimeouts.PROGRESS_COMPLETE_DELAY_MS);
    },
    complete() {
      this.skipTimeout = true;
    },
  },
  created() {
    this.timeToComplete = Math.floor(Math.random() * 30) + 1;
  },
  computed: {
    tooltipConfig() {
      return {
        placement: 'right',
        trigger: 'hover',
        title: this.$appLabels.PROGRESS_COMPLETE_TOOLTIP,
        customClass: 'custom-tooltip bs-tooltip-end',
      };
    },
    mainClass() {
      return ['pg-test mb-2 animate', { 'closed': this.completed }];
    },
  },
};
