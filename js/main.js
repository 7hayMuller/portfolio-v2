

gsap.registerPlugin(ScrollTrigger);

gsap.to('.about__circle', {
  width: '200vmax',
  height: '200vmax',
  scrollTrigger: {
    trigger: '#about',
    start: 'top top',
    end: '+=600',
    scrub: 1,
    pin: true,
    pinSpacing: false,
  }
});

// ── THUMBNAIL FLUTUANTE ──
const thumb = document.getElementById('projectsThumb');
const thumbImg = document.getElementById('projectsThumbImg');
let thumbX = 0, thumbY = 0, tx = 0, ty = 0;

// segue o mouse com inércia
function animateThumb() {
  thumbX += (tx - thumbX) * 0.08;
  thumbY += (ty - thumbY) * 0.08;
  thumb.style.left = thumbX + 'px';
  thumb.style.top  = thumbY + 'px';
  requestAnimationFrame(animateThumb);
}
animateThumb();

document.addEventListener('mousemove', e => {
  tx = e.clientX + 24;
  ty = e.clientY - 40;
});

// mostra thumbnail ao hover em cada item
document.querySelectorAll('.project-item').forEach(item => {
  const imgSrc = item.dataset.image;

  item.addEventListener('mouseenter', () => {
    thumbImg.src = imgSrc;
    thumb.classList.add('visible');
  });

  item.addEventListener('mouseleave', () => {
    thumb.classList.remove('visible');
  });
});

const inkDrops = document.querySelectorAll('.ink__drop');
const projectsSection = document.querySelector('#projects');

// começa escondido
gsap.set(inkDrops, { top: -300 });

ScrollTrigger.create({
  trigger: '#projects',
  start: 'bottom 85%',
  end: 'bottom top',
  onEnter: () => {
    document.querySelector('.projects__ink').style.position = 'fixed';
    document.querySelector('.projects__ink').style.top = '0';
  },
  onLeave: () => {
    document.querySelector('.projects__ink').style.position = 'absolute';
  },
  onLeaveBack: () => {
    document.querySelector('.projects__ink').style.position = 'absolute';
    gsap.set(inkDrops, { top: -300 });
  }
});

inkDrops.forEach((drop, i) => {
  gsap.to(drop, {
    top: 0,
    scrollTrigger: {
      trigger: '#projects',
      start: 'bottom 85%',
      end: 'bottom top',
      scrub: 1 + (i * 0.4),
    }
  });
});

// ── THREE.JS AVATAR ──
const canvas = document.getElementById('avatarCanvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(400, 500);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 400 / 500, 0.1, 100);
camera.position.set(0, 0.5, 2.5)

// iluminação
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0x7B2FFF, 1.2);
dirLight.position.set(2, 4, 3);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight2.position.set(-2, 2, -2);
scene.add(dirLight2);

// avatar
let avatar;
let mouseInfluenceX = 0;
let mouseInfluenceY = 0;

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
    console.log('avatar adicionado à cena!');
  },
  undefined,
  (error) => console.error('Erro:', error)
);


let autoRotation = 0;

function animateAvatar() {
  requestAnimationFrame(animateAvatar);
  if (avatar) {
    // rotação automática independente
    autoRotation += 0.04;
    
    // mouse adiciona por cima, não interfere
    avatar.rotation.y = autoRotation + mouseInfluenceX;
    avatar.rotation.x += (mouseInfluenceY - avatar.rotation.x) * 0.05;
  }
  renderer.render(scene, camera);
}
animateAvatar();