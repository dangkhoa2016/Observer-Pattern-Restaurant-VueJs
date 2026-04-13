/*jshint esversion: 9 */

(async () => {
  const runtime = window.AppRuntime;
  const { loadModule } = window['vue2-sfc-loader'];

  try {
    Vue.component('processing', await loadModule('/vue/processing.vue', runtime.getVueSfcOptions()));

    await runtime.loadScript('/vue/stores/restaurantStore.js');
    await runtime.loadScript('/assets/js/script.js');
  } catch (error) {
    runtime.reportError('Unable to initialize the application runtime.', error, { source: 'loader' });
  }
})();
