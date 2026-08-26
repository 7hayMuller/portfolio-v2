

gsap.registerPlugin(ScrollTrigger);

// ── CONTACT: fundo letter glitch ──
if (window.LetterGlitch) {
  new LetterGlitch('.contact__glitch-bg', {
    glitchColors: ['#7b2fff', '#3d1680', '#f5f2ed'],
    glitchSpeed: 60,
    outerVignette: true,
    centerVignette: false,
    smooth: true,
  });
}

// ── CONTACT: copiar email para o clipboard ──
const emailCard = document.querySelector('.ccard--email');
if (emailCard) {
  const email = emailCard.dataset.email;
  const tag = emailCard.querySelector('.ccard__tag');
  const originalTagKey = tag ? tag.getAttribute('data-i18n') : null;
  const originalTagText = tag ? tag.textContent : '';
  let resetTimer;

  emailCard.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    if (tag) {
      clearTimeout(resetTimer);
      const lang = typeof detectLang === 'function' ? detectLang() : 'pt';
      tag.removeAttribute('data-i18n');
      tag.textContent = (translations[lang] && translations[lang]['contact.copied']) || 'Copiado!';
      emailCard.classList.add('is-copied');

      resetTimer = setTimeout(() => {
        if (originalTagKey) tag.setAttribute('data-i18n', originalTagKey);
        tag.textContent = originalTagText;
        emailCard.classList.remove('is-copied');
      }, 1800);
    }
  });
}

gsap.from('.about__arrow', {
  x: 80,
  y: -80,
  opacity: 0,
  duration: 1.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#about',
    start: 'top 80%',
    toggleActions: 'play none none reset',
  }
});

gsap.to('.about__circle', {
  width: '250vmax',
  height: '250vmax',
  scrollTrigger: {
    trigger: '#about',
    start: 'bottom bottom',
    end: '+=800',
    scrub: 1,
    pin: true,
    pinSpacing: false,
  }
});


// ── MELT TRANSITION 3D ──
const meltDrips = gsap.utils.toArray('.melt__drip');
const meltCeiling = document.querySelector('.melt__ceiling');

gsap.set(meltDrips, { scaleY: 0 });

// [scrollProgressStart, scrollProgressEnd] por drip para timing orgânico
const dripTiming = [
  [0.00, 0.65],
  [0.10, 0.85],
  [0.05, 0.60],
  [0.15, 0.90],
  [0.08, 0.70],
  [0.03, 0.62],
  [0.12, 0.78],
  [0.06, 0.68],
  [0.14, 0.82],
  [0.02, 0.58],
];

ScrollTrigger.create({
  trigger: '.melt-transition',
  start: 'top 80%',
  end: 'bottom 15%',
  scrub: 2,
  onUpdate: (self) => {
    const p = self.progress;

    // teto inclina em perspectiva 3D conforme derrete
    gsap.set(meltCeiling, {
      transformPerspective: 700,
      rotateX: p * 20,
    });

    meltDrips.forEach((drip, i) => {
      const [s, e] = dripTiming[i];
      const local = Math.max(0, Math.min(1, (p - s) / (e - s)));
      const eased = 1 - Math.pow(1 - local, 2.2);
      gsap.set(drip, { scaleY: eased });
    });
  },
});


// ── THREE.JS AVATAR (lazy: só inicializa quando #skills entra na tela) ──
(function () {
  const canvas = document.getElementById('avatarCanvas');
  if (!canvas) return;

  let renderer, scene, camera, avatar;
  let mouseInfluenceX = 0;
  let mouseInfluenceY = 0;
  let autoRotation = 0;
  let rafId = null;
  let initialized = false;

  function resizeAvatarRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function initAvatar() {
    if (initialized) return;
    initialized = true;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.5, 2.5);

    resizeAvatarRenderer();
    window.addEventListener('resize', resizeAvatarRenderer);

    // iluminação
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x7B2FFF, 1.2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-2, 2, -2);
    scene.add(dirLight2);

    const loader = new THREE.GLTFLoader();
    loader.load(
      'assets/models/avatar.glb',
      (gltf) => {
        avatar = gltf.scene;

        const box = new THREE.Box3().setFromObject(avatar);
        const center = box.getCenter(new THREE.Vector3());
        avatar.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        avatar.scale.setScalar(1.8 / maxDim);

        avatar.position.y = 0.5;

        scene.add(avatar);
      },
      undefined,
      (error) => console.error('Erro:', error)
    );

    document.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseInfluenceX = nx * 0.4;
      mouseInfluenceY = -ny * 0.2;
    });
  }

  function animateAvatar() {
    rafId = requestAnimationFrame(animateAvatar);
    if (avatar) {
      // rotação automática independente
      autoRotation += 0.04;

      // mouse adiciona por cima, não interfere
      avatar.rotation.y = autoRotation + mouseInfluenceX;
      avatar.rotation.x += (mouseInfluenceY - avatar.rotation.x) * 0.05;
    }
    renderer.render(scene, camera);
  }

  function startLoop() {
    if (rafId == null) animateAvatar();
  }

  function stopLoop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initAvatar();
          if (!document.hidden) startLoop();
        } else {
          stopLoop();
        }
      });
    },
    { rootMargin: '200px 0px' }
  );
  io.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else if (initialized) {
      const rect = canvas.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) startLoop();
    }
  });
})();

// ── SKILL CONNECTORS ──
function drawSkillConnectors() {
  const layout      = document.querySelector('.skills__layout');
  const avatarEl    = document.querySelector('.skills__avatar');
  const leftTitles  = [...document.querySelectorAll('.skills__col--left  .skills__block-title')];
  const rightTitles = [...document.querySelectorAll('.skills__col--right .skills__block-title')];

  const ns  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:1;margin-right:20px;margin-left:-10px';
  layout.style.position = 'relative';
  layout.insertBefore(svg, layout.firstChild);

  const lRect  = layout.getBoundingClientRect();
  const aRect  = avatarEl.getBoundingClientRect();
  const aLeft  = aRect.left   - lRect.left;
  const aRight = aRect.right  - lRect.left;
  const aTop   = aRect.top    - lRect.top;
  const aBot   = aRect.bottom - lRect.top;

  function mkEl(tag, attrs) {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    svg.appendChild(e);
    return e;
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  function anchorY(index, total) {
    const pad = (aBot - aTop) * 0.15;
    return aTop + pad + (index / (total - 1 || 1)) * (aBot - aTop - pad * 2);
  }

  const connectors = [];

  function buildSide(titles, avatarEdgeX) {
    const fromRight = avatarEdgeX === aLeft;
    const total = titles.length;

    titles.forEach((t, i) => {
      const r      = t.getBoundingClientRect();
      const blockX = (fromRight ? r.right : r.left) - lRect.left;
      const blockY = r.top + r.height / 2 - lRect.top;
      const endY   = anchorY(i, total);
      const elbowX = avatarEdgeX + (fromRight ? -14 : 14);

      const len1 = dist(blockX, blockY, elbowX, blockY);
      const len2 = dist(elbowX, blockY, elbowX, endY);
      const len3 = dist(elbowX, endY, avatarEdgeX, endY);

      // linha 1 — horizontal da skill até o cotovelo
      const line1 = mkEl('line', {
        x1: blockX, y1: blockY, x2: elbowX, y2: blockY,
        stroke: 'white', 'stroke-width': '0.6', opacity: '0.22'
      });
      line1.style.strokeDasharray  = len1;
      line1.style.strokeDashoffset = len1;

      // linha 2 — vertical do cotovelo até o nível do avatar
      const line2 = mkEl('line', {
        x1: elbowX, y1: blockY, x2: elbowX, y2: endY,
        stroke: 'white', 'stroke-width': '0.6', opacity: '0.18'
      });
      line2.style.strokeDasharray  = len2;
      line2.style.strokeDashoffset = len2;

      // linha 3 — horizontal do cotovelo até o avatar
      const line3 = mkEl('line', {
        x1: elbowX, y1: endY, x2: avatarEdgeX, y2: endY,
        stroke: 'white', 'stroke-width': '1', opacity: '0.45'
      });
      line3.style.strokeDasharray  = len3;
      line3.style.strokeDashoffset = len3;

      // pontos e tick — todos invisíveis no início
      const dot1 = mkEl('circle', { cx: blockX, cy: blockY, r: '2',   fill: 'white' });
      const dot2 = mkEl('circle', { cx: elbowX, cy: blockY, r: '1.5', fill: 'white' });
      const tick  = mkEl('line', {
        x1: avatarEdgeX, y1: endY - 6, x2: avatarEdgeX, y2: endY + 6,
        stroke: 'white', 'stroke-width': '1.5'
      });
      const dot3 = mkEl('circle', { cx: avatarEdgeX, cy: endY, r: '3', fill: 'white' });

      gsap.set([dot1, dot2, tick, dot3], { opacity: 0 });

      connectors.push({ line1, line2, line3, dot1, dot2, tick, dot3, len1, len2, len3 });
    });
  }

  buildSide(leftTitles,  aLeft);
  buildSide(rightTitles, aRight);

  let masterTl = null;

  function resetConnectors() {
    if (masterTl) { masterTl.kill(); masterTl = null; }
    connectors.forEach(({ line1, line2, line3, dot1, dot2, tick, dot3, len1, len2, len3 }) => {
      line1.style.animation        = '';
      line1.style.strokeDasharray  = len1;
      line1.style.strokeDashoffset = len1;

      line2.style.strokeDasharray  = len2;
      line2.style.strokeDashoffset = len2;

      line3.style.animation        = '';
      line3.style.strokeDasharray  = len3;
      line3.style.strokeDashoffset = len3;

      gsap.set([dot1, dot2, tick], { opacity: 0 });
      gsap.set(dot3, { opacity: 0, attr: { r: 3 } });
    });
  }

  function playConnectors() {
    resetConnectors();
    masterTl = gsap.timeline();

    connectors.forEach(({ line1, line2, line3, dot1, dot2, tick, dot3 }) => {
      const tl = gsap.timeline();

      // 1. ponto acende na skill
      tl.to(dot1, { opacity: 0.35, duration: 0.12, ease: 'power2.out' });

      // 2. linha horizontal da skill → cotovelo
      tl.to(line1, { strokeDashoffset: 0, duration: 0.35, ease: 'power1.inOut' });

      // 3. ponto acende no cotovelo
      tl.to(dot2, { opacity: 0.2, duration: 0.1, ease: 'power2.out' }, '-=0.08');

      // 4. linha vertical
      tl.to(line2, { strokeDashoffset: 0, duration: 0.25, ease: 'power1.inOut' }, '-=0.05');

      // 5. linha horizontal final até o avatar
      tl.to(line3, { strokeDashoffset: 0, duration: 0.22, ease: 'power1.inOut' });

      // 6. tick + dot pulsam ao tocar o avatar
      tl.to(tick,  { opacity: 0.55, duration: 0.12,  ease: 'power3.out' });
      tl.to(dot3,  { opacity: 0.6,  duration: 0.12,  ease: 'power3.out' }, '<');
      tl.to(dot3,  { attr: { r: 6 }, duration: 0.12, ease: 'power3.out' }, '<');
      tl.to(dot3,  { attr: { r: 3 }, duration: 0.3, ease: 'elastic.out(1, 0.4)' });

      // 7. fluxo contínuo de dashes ao fim desta conexão
      tl.call(() => {
        line1.style.strokeDasharray  = '5 6';
        line1.style.strokeDashoffset = '0';
        line1.style.animation        = 'dashFlow 4s linear infinite';

        line3.style.strokeDasharray  = '4 4';
        line3.style.strokeDashoffset = '0';
        line3.style.animation        = 'dashFlow 2s linear infinite';
      });

      // pausa antes do próximo conector
      tl.to({}, { duration: 0.15 });

      masterTl.add(tl);
    });
  }

  ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 55%',
    end: 'bottom top',
    onEnter:      playConnectors,
    onEnterBack:  playConnectors,
    onLeave:      resetConnectors,
    onLeaveBack:  resetConnectors,
  });
}

// ── PROJECTS: stage fixo com crossfade (sem empurrar layout) ──
(function () {
  const items = document.querySelectorAll('.project-item[data-preview-src]');
  const stageImg = document.querySelector('.projects__stage-media--img');
  const stageVideo = document.querySelector('.projects__stage-media--video');
  if (!items.length || !stageImg || !stageVideo) return;

  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setActive(item) {
    items.forEach((el) => el.classList.remove('is-active'));
    item.classList.add('is-active');

    const type = item.dataset.previewType || 'image';
    const src = item.dataset.previewSrc;
    const alt = item.dataset.previewAlt || '';

    if (type === 'video') {
      stageImg.classList.remove('is-visible');
      if (stageVideo.getAttribute('src') !== src) {
        stageVideo.setAttribute('src', src);
        stageVideo.load();
      }
      stageVideo.play().catch(() => {});
      stageVideo.classList.add('is-visible');
    } else {
      stageVideo.pause();
      stageVideo.classList.remove('is-visible');
      if (stageImg.getAttribute('src') !== src) {
        stageImg.setAttribute('src', src);
      }
      stageImg.setAttribute('alt', alt);
      stageImg.classList.add('is-visible');
    }
  }

  items.forEach((item) => {
    if (hoverCapable) {
      item.addEventListener('mouseenter', () => setActive(item));
    }
    item.addEventListener('click', () => setActive(item));
    item.addEventListener('focusin', () => setActive(item));
  });

  // sem mouse (mobile/touch): stage acompanha o item mais próximo do centro da tela ao rolar
  if (!hoverCapable) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    items.forEach((item) => io.observe(item));
  }

  setActive(items[0]);
})();

window.addEventListener('load', drawSkillConnectors);