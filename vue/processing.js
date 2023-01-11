
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
      time_to_complete: 0,
      skip_timeout: false,
    };
  },
  methods: {
    mark_completed() {
      setTimeout(() => {
        this.completed = true;
        this.$emit('complete');
      }, this.$wait_for_user_to_see_time);
    },
    complete() {
      this.skip_timeout = true;
    },
  },
  created() {
    this.time_to_complete = Math.floor(Math.random() * 30) + 1;
  },
  computed: {
    tooltip_config() {
      return {
        placement: 'right',
        trigger: 'hover',
        title: 'Test button: click to complete progress',
        customClass: 'custom-tooltip bs-tooltip-end',
      };
    },
    main_class() {
      return ['pg-test mb-2 animate', { 'closed': this.completed }];
    },
  },
};
