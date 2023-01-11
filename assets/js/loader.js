/*jshint esversion: 9 */

const { loadModule } = window['vue2-sfc-loader'];

(async () => {

  window.options = {
    moduleCache: {},
    async getFile(url) {
      const res = await fetch(url);
      if (!res.ok)
        throw Object.assign(new Error(url + ' ' + res.statusText), { res });
      return await res.text();
    },
  
    addStyle(textContent) {
      const style = Object.assign(document.createElement('style'), { textContent });
      const ref = document.head.getElementsByTagName('style')[0] || null;
      document.head.insertBefore(style, ref);
    },
  
    log(type, ...args) {
      console[type](...args);
    },
  };
  
  window.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const loadStore = function (file) {
    return loadJs(`/vue/stores/${file}.js`);
  };

  const loadJs = function (file) {
    return new Promise((resolve) => {
      fetch(file)
        .then(res => {
          if (res.status !== 200)
            throw new Error(`File [${file}] does not exists.`);
          return res.text();
        }).then(js => {
          eval(js);
          resolve();
        }).catch(ex => {
          console.log(`Error load js: ${file}`, ex);
          resolve();
        });
    });
  };

  Vue.component('processing', await loadModule(`/vue/processing.vue`, window.options));

  await loadStore('restaurantStore');
  await loadJs('/assets/js/script.js');
})();
