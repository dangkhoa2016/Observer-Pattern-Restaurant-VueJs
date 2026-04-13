/*jshint esversion: 9 */

(function () {
  const DEFAULT_TIMEOUT = 12000;
  const DEFAULT_RETRIES = 2;
  const RETRY_DELAY = 350;

  const textCache = new Map();
  const jsonCache = new Map();
  const scriptCache = new Map();

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function fetchWithTimeout(url, options = {}) {
    const { timeout = DEFAULT_TIMEOUT, fetchOptions = {} } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(url, { ...fetchOptions, signal: controller.signal });
    } catch (error) {
      if (error.name === 'AbortError')
        throw new Error(`Request timeout for ${url}`);

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function requestWithRetry(url, options = {}) {
    const {
      timeout = DEFAULT_TIMEOUT,
      retries = DEFAULT_RETRIES,
      parser = 'text',
      fetchOptions = {},
    } = options;

    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetchWithTimeout(url, { timeout, fetchOptions });
        if (!response.ok)
          throw Object.assign(new Error(`${url} ${response.status} ${response.statusText}`), { response });

        return parser === 'json' ? response.json() : response.text();
      } catch (error) {
        lastError = error;
        if (attempt === retries)
          break;

        await sleep(RETRY_DELAY * (attempt + 1));
      }
    }

    throw lastError;
  }

  async function requestText(url, options = {}) {
    const { cache = false } = options;
    if (cache && textCache.has(url))
      return textCache.get(url);

    const task = requestWithRetry(url, { ...options, parser: 'text' });
    if (cache)
      textCache.set(url, task);

    try {
      return await task;
    } catch (error) {
      if (cache)
        textCache.delete(url);

      throw error;
    }
  }

  async function requestJson(url, options = {}) {
    const { cache = false } = options;
    if (cache && jsonCache.has(url))
      return jsonCache.get(url);

    const task = requestWithRetry(url, { ...options, parser: 'json' });
    if (cache)
      jsonCache.set(url, task);

    try {
      return await task;
    } catch (error) {
      if (cache)
        jsonCache.delete(url);

      throw error;
    }
  }

  function injectScript(url, timeout) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let settled = false;
      const timer = setTimeout(() => finish(new Error(`Timeout while loading script ${url}`)), timeout);

      function finish(error) {
        if (settled)
          return;

        settled = true;
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;

        if (error) {
          script.remove();
          reject(error);
          return;
        }

        resolve();
      }

      script.src = url;
      script.async = false;
      script.defer = true;
      script.onload = () => finish();
      script.onerror = () => finish(new Error(`Failed to load script ${url}`));
      document.head.appendChild(script);
    });
  }

  async function loadScript(url, options = {}) {
    if (scriptCache.has(url))
      return scriptCache.get(url);

    const task = (async () => {
      const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES } = options;

      let lastError = null;
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          await injectScript(url, timeout);
          return;
        } catch (error) {
          lastError = error;
          if (attempt === retries)
            break;

          await sleep(RETRY_DELAY * (attempt + 1));
        }
      }

      throw lastError;
    })();

    scriptCache.set(url, task);

    try {
      return await task;
    } catch (error) {
      scriptCache.delete(url);
      throw error;
    }
  }

  function reportError(message, error, meta = {}) {
    console.error(message, error || '', meta);

    window.dispatchEvent(new CustomEvent('restaurant:error', {
      detail: {
        source: meta.source || 'runtime',
        message,
        error,
        meta,
      },
    }));
  }

  let vueSfcOptions = null;
  function getVueSfcOptions() {
    if (vueSfcOptions)
      return vueSfcOptions;

    vueSfcOptions = {
      moduleCache: { vue: Vue },
      async getFile(url) {
        return requestText(url, { cache: true });
      },
      addStyle(textContent) {
        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
      },
      log(type, ...args) {
        const logger = typeof console[type] === 'function' ? console[type] : console.log;
        logger.apply(console, args);
      },
    };

    return vueSfcOptions;
  }

  window.AppRuntime = {
    sleep,
    loadScript,
    loadHtml(url, options = {}) {
      return requestText(url, { cache: true, ...options });
    },
    loadJson(url, options = {}) {
      return requestJson(url, { cache: true, ...options });
    },
    getVueSfcOptions,
    reportError,
  };
})();