export class StyleObserver {
  #callback;
  #props;
  #lastValues = new Map();
  #isPolling = false;
  #rafId = null;
  #target = null;
  #observers = [];

  constructor(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('The callback must be a function.');
    }
    this.#callback = callback;
  }

  /**
   * @param {HTMLElement} target
   * @param {Object} options { properties: string[] }
   */
  observe(target, options = {}) {
    this.disconnect(); // Clean up previous session if any
    this.#target = target;
    this.#props = options.properties || [];

    // 1. Internal Observers (Direct & Root changes)
    const mutationObs = new MutationObserver(() => this.#startPulse());
    mutationObs.observe(target, { attributes: true });
    mutationObs.observe(document.documentElement, { attributes: true });

    const resizeObs = new ResizeObserver(() => this.#startPulse());
    resizeObs.observe(target);

    this.#observers.push(targetObs, rootObs, resizeObs);

    // 2. Interaction Events
    const events = [
      'pointerenter',
      'pointerleave',
      'pointerdown',
      'input',
      'focusin',
      'focusout',
      'keydown',
    ];
    events.forEach((type) => {
      target.addEventListener(type, () => this.#startPulse(), {
        passive: true,
      });
    });
    window.addEventListener('pointerup', () => this.#startPulse(), {
      passive: true,
    });

    // 3. Media Queries (Environment)
    const queries = [
      '(prefers-color-scheme: dark)',
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: more)',
      '(orientation: portrait)',
    ];
    queries.forEach((q) => {
      window.matchMedia(q).addEventListener('change', () => this.#startPulse());
    });

    // Baseline check
    this.#check();
  }

  #startPulse() {
    if (this.#isPolling) return;
    this.#isPolling = true;

    const pulse = () => {
      const records = this.#check();
      // If records exist, styles are still in flux (like a transition)
      if (records.length > 0) {
        this.#rafId = requestAnimationFrame(pulse);
      } else {
        this.#isPolling = false;
      }
    };
    this.#rafId = requestAnimationFrame(pulse);
  }

  #check() {
    if (!this.#target) return [];
    const styleMap = this.#target.computedStyleMap();
    const records = [];

    for (const prop of this.#props) {
      const currentVal = styleMap.get(prop)?.toString() || '';
      if (currentVal !== this.#lastValues.get(prop)) {
        records.push({
          target: this.#target,
          propertyName: prop,
          newValue: currentVal,
          oldValue: this.#lastValues.get(prop),
        });
        this.#lastValues.set(prop, currentVal);
      }
    }

    if (records.length > 0) {
      this.#callback(records, this);
    }
    return records;
  }

  disconnect() {
    this.#observers.forEach((obs) => obs.disconnect());
    this.#observers = [];
    cancelAnimationFrame(this.#rafId);
    this.#isPolling = false;
    this.#target = null;
  }
}
