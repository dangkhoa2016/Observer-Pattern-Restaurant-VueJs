/*jshint esversion: 9 */

(async () => {
  const runtime = window.AppRuntime;
  const { loadModule } = window['vue2-sfc-loader'];

  window.app = {};

  try {
    window.app.html = await runtime.loadHtml('/assets/app.html');
    window.app = await loadModule('/vue/restaurant.vue', runtime.getVueSfcOptions());
  } catch (error) {
    runtime.reportError('Unable to bootstrap the restaurant application.', error, { source: 'bootstrap' });
  }

})();
