(function () {
  'use strict';

  const FONT_SIZE = 16;
  const CHAR_WIDTH = 10;
  const CHAR_HEIGHT = 20;
  const MAX_DPR = 1.5;

  function hexToRgb(hex) {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function interpolateColor(start, end, factor) {
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  class LetterGlitch {
    constructor(mount, options = {}) {
      this.mount = typeof mount === 'string' ? document.querySelector(mount) : mount;
      if (!this.mount) return;

      this.glitchColors = options.glitchColors || ['#2b4539', '#61dca3', '#61b3dc'];
      this.glitchSpeed = options.glitchSpeed || 50;
      this.centerVignette = !!options.centerVignette;
      this.outerVignette = options.outerVignette !== false;
      this.smooth = options.smooth !== false;
      this.characters =
        options.characters ||
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
      this.chars = Array.from(this.characters);

      this.letters = [];
      this.grid = { columns: 0, rows: 0 };
      this.lastGlitchTime = Date.now();
      this.animationFrame = null;
      this.resizeTimeout = null;
      this.isRunning = false;
      this.isVisible = true;

      this._build();
      this._bindResize();
      this._bindVisibility();
      this.resizeCanvas();
      this.start();
    }

    _build() {
      this.mount.classList.add('letter-glitch');

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'letter-glitch__canvas';
      this.mount.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d', { alpha: true });

      if (this.outerVignette) {
        const outer = document.createElement('div');
        outer.className = 'letter-glitch__vignette letter-glitch__vignette--outer';
        this.mount.appendChild(outer);
      }
      if (this.centerVignette) {
        const center = document.createElement('div');
        center.className = 'letter-glitch__vignette letter-glitch__vignette--center';
        this.mount.appendChild(center);
      }
    }

    _bindResize() {
      this._onResize = () => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.resizeCanvas();
        }, 150);
      };
      window.addEventListener('resize', this._onResize);
    }

    // pausa o loop quando a seção não está visível — evita gastar CPU/GPU à toa
    _bindVisibility() {
      if (typeof IntersectionObserver === 'undefined') return;
      this._observer = new IntersectionObserver(
        (entries) => {
          this.isVisible = entries[0].isIntersecting;
          if (this.isVisible) {
            this.start();
          } else {
            this.stop();
          }
        },
        { threshold: 0 }
      );
      this._observer.observe(this.mount);
    }

    getRandomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    getRandomColor() {
      return this.glitchColors[Math.floor(Math.random() * this.glitchColors.length)];
    }

    calculateGrid(width, height) {
      return {
        columns: Math.ceil(width / CHAR_WIDTH),
        rows: Math.ceil(height / CHAR_HEIGHT),
      };
    }

    initializeLetters(columns, rows) {
      this.grid = { columns, rows };
      const total = columns * rows;
      this.letters = Array.from({ length: total }, () => ({
        char: this.getRandomChar(),
        color: this.getRandomColor(),
        targetColor: this.getRandomColor(),
        colorProgress: 1,
      }));
    }

    resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = this.mount.getBoundingClientRect();
      this.dpr = dpr;

      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;

      if (this.ctx) {
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.ctx.font = `${FONT_SIZE}px monospace`;
        this.ctx.textBaseline = 'top';
      }

      const { columns, rows } = this.calculateGrid(rect.width, rect.height);
      this.initializeLetters(columns, rows);
      this.drawAll();
    }

    // desenha só a célula de um índice — muito mais barato que redesenhar tudo
    drawLetter(index) {
      const ctx = this.ctx;
      const letter = this.letters[index];
      if (!ctx || !letter) return;
      const x = (index % this.grid.columns) * CHAR_WIDTH;
      const y = Math.floor(index / this.grid.columns) * CHAR_HEIGHT;
      ctx.clearRect(x, y, CHAR_WIDTH, CHAR_HEIGHT);
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    }

    // redesenho completo — só usado na inicialização e no resize
    drawAll() {
      if (!this.ctx || this.letters.length === 0) return;
      const rect = this.canvas.getBoundingClientRect();
      this.ctx.clearRect(0, 0, rect.width, rect.height);
      for (let i = 0; i < this.letters.length; i++) {
        this.drawLetter(i);
      }
    }

    updateLetters() {
      if (this.letters.length === 0) return;
      const updateCount = Math.max(1, Math.floor(this.letters.length * 0.05));

      for (let i = 0; i < updateCount; i++) {
        const index = Math.floor(Math.random() * this.letters.length);
        const letter = this.letters[index];
        if (!letter) continue;

        letter.char = this.getRandomChar();
        letter.targetColor = this.getRandomColor();

        if (!this.smooth) {
          letter.color = letter.targetColor;
          letter.colorProgress = 1;
        } else {
          letter.colorProgress = 0;
        }

        this.drawLetter(index);
      }
    }

    handleSmoothTransitions() {
      for (let index = 0; index < this.letters.length; index++) {
        const letter = this.letters[index];
        if (letter.colorProgress < 1) {
          letter.colorProgress = Math.min(1, letter.colorProgress + 0.05);

          const startRgb = hexToRgb(letter.color);
          const endRgb = hexToRgb(letter.targetColor);
          if (startRgb && endRgb) {
            letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
            this.drawLetter(index);
          }
        }
      }
    }

    animate() {
      if (!this.isRunning) return;

      const now = Date.now();
      if (now - this.lastGlitchTime >= this.glitchSpeed) {
        this.updateLetters();
        this.lastGlitchTime = now;
      }

      if (this.smooth) {
        this.handleSmoothTransitions();
      }

      this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastGlitchTime = Date.now();
      this.animate();
    }

    stop() {
      this.isRunning = false;
      cancelAnimationFrame(this.animationFrame);
    }

    destroy() {
      this.stop();
      window.removeEventListener('resize', this._onResize);
      if (this._observer) this._observer.disconnect();
      this.mount.innerHTML = '';
      this.mount.classList.remove('letter-glitch');
    }
  }

  window.LetterGlitch = LetterGlitch;
})();
