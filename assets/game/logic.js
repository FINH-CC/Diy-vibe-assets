import * as THREE from 'three';

// ============== STEP GATING ==============
const params = new URLSearchParams(location.search);
const STEP = Math.max(0, Math.min(9, parseInt(params.get('step') || '0', 10)));
const cfg = {
  capy:        STEP >= 1,
  ground:      STEP >= 1,
  platforms:   STEP >= 1,
  flag:        STEP >= 1,
  enemies:     false,
  coins:       STEP >= 2,
  movingPlats: STEP >= 2,
  sound:       STEP >= 5,
  fart:        STEP >= 4,
  friends:     STEP >= 4,
  level2:      STEP >= 5,
  themePicker: STEP >= 6,
  titleScreen: STEP >= 9,
  hatPicker:   STEP >= 9,
  finale:      STEP >= 9,
};

// ============== THEMES ==============
const THEMES = {
  // skyTop / skyBot drive a vertical gradient backdrop
  cozy:   { skyTop:'#ffe9f2', skyBot:'#ffb6cf', fog:0xffd5e3, ground:0xffc0a8, plat:0xb6e8c9, accent:0xe65a8a, sun:0xfff5d6, ambient:0xffffff, ambientI:0.55, sunI:1.4, rimColor:0xff9ad6 },
  jungle: { skyTop:'#bdf3d6', skyBot:'#3aa37a', fog:0x6dc8a4, ground:0x3f7a3a, plat:0xc8e87f, accent:0xff7a3d, sun:0xfffac8, ambient:0xc8ffe0, ambientI:0.5,  sunI:1.4, rimColor:0xfff7a8 },
  space:  { skyTop:'#02010a', skyBot:'#1a0a3a', fog:0x0a0524, ground:0x2a1f4a, plat:0x6affff, accent:0xff6ad5, sun:0xeaf0ff, ambient:0x4a3a8a, ambientI:0.45, sunI:0.9, rimColor:0x6affff },
  sky:    { skyTop:'#dff3ff', skyBot:'#a9d9f9', fog:0xbfe4f7, ground:0xf7e8c9, plat:0xffffff, accent:0x3b82f6, sun:0xfff8e0, ambient:0xeaf6ff, ambientI:0.55, sunI:1.3, rimColor:0x9ad4ff },
};
// Jungle theme step should open with jungle selected by default.
const DEFAULT_THEME = STEP >= 6 ? 'jungle' : 'cozy';
let theme = DEFAULT_THEME;

// ============== SCENE BOOT ==============
const cv = document.getElementById('cv');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 200);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 1.4);
sun.position.set(8, 14, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-30; sun.shadow.camera.right=30;
sun.shadow.camera.top=30; sun.shadow.camera.bottom=-30;
scene.add(sun);
const rim = new THREE.DirectionalLight(0xff9ad6, 0.4);
rim.position.set(-6, 4, -8); scene.add(rim);

// Sky as a big sphere with a generated vertical gradient texture
function makeSkyTexture(top, bot) {
  const c = document.createElement('canvas');
  c.width = 16; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, top);
  grd.addColorStop(1, bot);
  g.fillStyle = grd; g.fillRect(0, 0, 16, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const skyGeo = new THREE.SphereGeometry(80, 24, 16);
const skyMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: makeSkyTexture(THEMES[theme].skyTop, THEMES[theme].skyBot) });
const sky = new THREE.Mesh(skyGeo, skyMat); scene.add(sky);
// second sky sphere used to cross-fade to a new theme
const skyMat2 = new THREE.MeshBasicMaterial({ side: THREE.BackSide, transparent:true, opacity:0, depthWrite:false });
const sky2 = new THREE.Mesh(new THREE.SphereGeometry(79.5, 24, 16), skyMat2); scene.add(sky2);
scene.fog = new THREE.Fog(THEMES[theme].fog, 28, 70);

// Ground (level 1) — added by buildLevel when step >= 1
const ground = new THREE.Group();
scene.add(ground);

// ============== HELPERS ==============
function flatMat(color, opts={}) {
  return new THREE.MeshLambertMaterial({ color, flatShading:true, ...opts });
}
function makeGround() {
  const g = new THREE.Group();
  const baseGeo = new THREE.BoxGeometry(60, 1, 14);
  const base = new THREE.Mesh(baseGeo, flatMat(THEMES[theme].ground));
  base.position.set(0, -0.5, 0); base.receiveShadow = true;
  g.add(base);
  // grass tufts
  for (let i=0;i<22;i++){
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 5), flatMat(0x7fc78a));
    t.position.set((Math.random()-.5)*58, 0.05, (Math.random()-.5)*12);
    t.userData.tuft = true;
    g.add(t);
  }
  return g;
}

// ============== CAPYBARA BUILDER ==============
function buildCapy(color=0xf5d27a) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 1.0), flatMat(color));
  body.position.y = 0.55; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 0.85), flatMat(color));
  head.position.set(0.85, 0.85, 0); head.castShadow = true; g.add(head);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.5), flatMat(0xd6a85f));
  snout.position.set(1.25, 0.7, 0); g.add(snout);
  // ears
  const earGeo = new THREE.BoxGeometry(0.22, 0.2, 0.22);
  const earL = new THREE.Mesh(earGeo, flatMat(color)); earL.position.set(0.7,1.25,0.32); g.add(earL);
  const earR = new THREE.Mesh(earGeo, flatMat(color)); earR.position.set(0.7,1.25,-0.32); g.add(earR);
  // eyes
  const eyeGeo = new THREE.SphereGeometry(0.07, 6, 5);
  const eyeMat = new THREE.MeshBasicMaterial({ color:0x1a1018 });
  const eL = new THREE.Mesh(eyeGeo, eyeMat); eL.position.set(1.05,1.0,0.28); g.add(eL);
  const eR = new THREE.Mesh(eyeGeo, eyeMat); eR.position.set(1.05,1.0,-0.28); g.add(eR);
  // legs
  const legGeo = new THREE.BoxGeometry(0.25, 0.4, 0.25);
  const legPositions = [[0.55,0.2,0.35],[0.55,0.2,-0.35],[-0.55,0.2,0.35],[-0.55,0.2,-0.35]];
  const legs = [];
  for (const [x,y,z] of legPositions){
    const l = new THREE.Mesh(legGeo, flatMat(0xc9a368));
    l.position.set(x,y,z); l.castShadow = true; g.add(l); legs.push(l);
  }
  g.userData = { body, head, legs, hat:null, baseColor:color };
  return g;
}

function setHat(capy, kind) {
  if (capy.userData.hat) { capy.userData.head.remove(capy.userData.hat); capy.userData.hat = null; }
  if (kind==='none' || !kind) return;
  const head = capy.userData.head;
  let h;
  if (kind==='top') {
    h = new THREE.Group();
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.08,12), flatMat(0x1a1018));
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.7,12), flatMat(0x1a1018));
    top.position.y = 0.39; brim.position.y = 0.04;
    h.add(brim); h.add(top);
    h.position.y = 0.42;
  } else if (kind==='cowboy') {
    h = new THREE.Group();
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.7,0.06,16), flatMat(0xa0612a));
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.42,0.45,12), flatMat(0xc97a3a));
    top.position.y = 0.27; h.add(brim); h.add(top);
    h.position.y = 0.42;
  } else if (kind==='orange') {
    h = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), flatMat(0xff8a3d));
    h.position.y = 0.55;
  } else if (kind==='crown') {
    h = new THREE.Group();
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,0.18,8), flatMat(0xffd84a));
    band.position.y = 0.1; h.add(band);
    for (let i=0;i<5;i++){
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.1,0.25,4), flatMat(0xffd84a));
      const a = (i/5)*Math.PI*2;
      sp.position.set(Math.cos(a)*0.42, 0.3, Math.sin(a)*0.42);
      h.add(sp);
    }
    h.position.y = 0.42;
  }
  if (h) { head.add(h); capy.userData.hat = h; }
}

// ============== ENEMY (jump-on-to-squish slime) ==============
function makeEnemy() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0),
    new THREE.MeshLambertMaterial({ color: 0xff3366, flatShading:true, emissive:0xff1a44, emissiveIntensity:0.85 }));
  body.position.y = 0.55; body.castShadow = true; g.add(body);
  // bright glow ring underneath so it pops on dark backgrounds (space theme)
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.85, 18),
    new THREE.MeshBasicMaterial({ color: 0xffea00, transparent:true, opacity:0.55, side:THREE.DoubleSide }));
  halo.rotation.x = -Math.PI/2; halo.position.y = 0.02; g.add(halo);
  g.userData.halo = halo;
  // angry eyes
  const eyeMat = flatMat(0xffffff);
  const pupMat = flatMat(0x000000);
  for (const sx of [-0.18, 0.18]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), eyeMat);
    e.position.set(sx, 0.7, 0.45); g.add(e);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 4), pupMat);
    p.position.set(sx, 0.66, 0.52); g.add(p);
  }
  // angry brow
  for (const sx of [-0.2, 0.2]) {
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.05), flatMat(0x220011));
    br.position.set(sx, 0.86, 0.5);
    br.rotation.z = sx>0 ? -0.4 : 0.4;
    g.add(br);
  }
  // little spikes on top
  for (let i=0;i<3;i++){
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 4),
      new THREE.MeshLambertMaterial({ color:0xffea00, flatShading:true, emissive:0xff8800, emissiveIntensity:0.8 }));
    sp.position.set(-0.18 + i*0.18, 1.05, 0); g.add(sp);
  }
  g.userData.body = body;
  return g;
}

// ============== LEVELS ==============
const LEVELS = [
  // Level 1: gentle staircase
  {
    ground: { len:60, width:14, color:'ground' },
    platforms: [
      [4, 1.2, 0, 3, 1, 3],
      [9, 2.4, -1.5, 3, 1, 3, 'maybeMove', { axis:'y', range:1.0, speed:1.2 }],
      [14, 3.6, 1.5, 3, 1, 3, 'maybeMove', { axis:'z', range:1.6, speed:1.0 }],
      [19, 4.8, 0, 3, 1, 3, 'maybeMove', { axis:'y', range:1.2, speed:1.4 }],
      [24, 6, 0, 4, 1, 4],
    ],
    coins: [[4,2.2,0],[9,3.4,-1.5],[14,4.6,1.5],[19,5.8,0],[24,7,0],[16,1,4],[8,1,-4]],
    flag: [24, 6.5, 0],
    start: [-8, 0, 0],
  },
  // Level 2: gaps + moving platforms
  {
    ground: { len:8, width:14, color:'ground' },
    groundEnd: { x: 38, len:10, width:10 },
    platforms: [
      [3, 0.8, 0, 3, 1, 3],
      [7, 1.6, 1.5, 2.6, 1, 2.6],
      [11, 2.4, -1.5, 2.6, 1, 2.6, 'move', { axis:'z', range:2, speed:1.2 }],
      [15, 3.2, 1, 2.6, 1, 2.6],
      [19, 3.8, -1, 2.6, 1, 2.6, 'move', { axis:'y', range:1.2, speed:1.1 }],
      [23, 4.4, 1.5, 2.6, 1, 2.6],
      [27, 5, -1, 2.6, 1, 2.6, 'move', { axis:'x', range:1.6, speed:1.0 }],
      [31, 5.6, 1, 2.8, 1, 2.8],
      [34, 6, 0, 3.5, 1, 3.5],
    ],
    coins: [[3,1.8,0],[7,2.6,1.5],[11,3.4,-1.5],[15,4.2,1],[19,4.8,-1],[23,5.4,1.5],[27,6,-1],[31,6.6,1],[34,7,0]],
    flag: [34, 6.5, 0],
    start: [-2, 0, 0],
  },
  // Level 3: the moving bridge — three sliding/bobbing platforms in a
  // row over the void, then a hop down to the finish meadow.
  {
    ground: { len:8, width:14, color:'ground' },
    groundEnd: { x: 30, len:10, width:10 },
    platforms: [
      [3, 1, 0, 3, 1, 3],
      [8, 1.8, 0, 2.8, 1, 2.8, 'move', { axis:'z', range:2.2, speed:1.0 }],
      [13, 2.6, 0, 2.8, 1, 2.8, 'move', { axis:'y', range:1.4, speed:1.2 }],
      [18, 3.4, 0, 2.8, 1, 2.8, 'move', { axis:'z', range:2.2, speed:1.4 }],
      [22.5, 2, 0, 3, 1, 3],
    ],
    coins: [[3,2,0],[8,2.8,0],[13,3.6,0],[18,4.4,0],[22.5,3,0],[27,1,2]],
    flag: [28, 0, 0],
    start: [-2, 0, 0],
  },
  // Level 4: THE BIG JUMP — two big wooden fences on the flat floor with
  // plenty of run-up space between them: hop the first, breathe, hop the
  // second, then leap the gap to the landing pad and the finish meadow.
  // Baby-blue sky sets it apart.
  {
    sky: { top: '#DFF3FF', bot: '#A9D9F9' },
    ground: { len:30, width:14, color:'ground' },
    groundEnd: { x: 37, len:10, width:10 },
    platforms: [
      [28.5, -0.5, 0, 5, 1, 5],
    ],
    barriers: [
      { x: 2,  y: 0, w: 0.9, h: 2.9, d: 14, z: 0 },
      { x: 12, y: 0, w: 0.9, h: 2.9, d: 14, z: 0 },
    ],
    coins: [[-1,1,0],[2,4.2,0],[5,1,0],[8,1,0],[12,4.2,0],[15,1,0],[19,1,0],[23.5,2,0],[25,2,0],[28.5,1,0],[34,1,0],[38,1,2]],
    flag: [37, 0, 0],
    start: [-5, 0, 0],
  },
  // Level 5: level 1's gentle staircase remixed — the steps zigzag left
  // and right instead of running straight, and a giant MEGA star (worth
  // 5) floats above the second-to-last platform, one bounce off the path.
  {
    ground: { len:60, width:14, color:'ground' },
    platforms: [
      [4, 1.2, 2, 3, 1, 3],
      [9, 2.4, -2, 3, 1, 3, 'maybeMove', { axis:'y', range:1.0, speed:1.1 }],
      [14, 3.6, 2, 3, 1, 3],
      [19, 4.8, -2, 3, 1, 3, 'maybeMove', { axis:'z', range:1.4, speed:1.2 }],
      [24, 6, 0, 3, 1, 3],
      [29, 7.2, 0, 4, 1, 4],
    ],
    coins: [[4,2.2,2],[9,3.4,-2],[14,4.6,2],[19,5.8,-2],[27,1,4],[12,1,-5],[34,1,3]],
    megaCoin: [24, 9, 0],
    flag: [29, 7.7, 0],
    start: [-8, 0, 0],
  },
];

let currentLevel = 0;
let levelObjects = [];
const LEVEL_FRIENDS = [
  [
    { color:0xe6b870, pos:[-4, 0, -4], hat:'cowboy' },
    { color:0xfae0a8, pos:[7,  0,  4], hat:'top' },
    { color:0xf5d27a, pos:[18, 0, -5], hat:'orange' },
    { color:0xf2c188, pos:[30, 0,  5], hat:'crown' },
  ],
  [
    { color:0xe6b870, pos:[-6, 0, -4], hat:'cowboy', wanderX:2.5, wanderZ:3 },
    { color:0xfae0a8, pos:[-3, 0,  4], hat:'top', wanderX:2, wanderZ:3 },
    { color:0xf5d27a, pos:[35, 0, -3], hat:'orange', wanderX:2.5, wanderZ:3 },
    { color:0xf2c188, pos:[40, 0,  3], hat:'crown', wanderX:2.5, wanderZ:3 },
  ],
  [
    { color:0xe6b870, pos:[-6, 0, -4], hat:'top', wanderX:2, wanderZ:3 },
    { color:0xfae0a8, pos:[-3, 0,  4], hat:'cowboy', wanderX:2, wanderZ:3 },
    { color:0xf5d27a, pos:[28, 0, -3], hat:'orange', wanderX:2, wanderZ:2.5 },
    { color:0xf2c188, pos:[32, 0,  3], hat:'crown', wanderX:2, wanderZ:2.5 },
  ],
  [
    { color:0xe6b870, pos:[-4, 0, -4], hat:'cowboy', wanderX:1.5, wanderZ:3 },
    { color:0xfae0a8, pos:[6, 0,  4], hat:'top', wanderX:1.5, wanderZ:3 },
    { color:0xf5d27a, pos:[35, 0, -3], hat:'orange', wanderX:2, wanderZ:2.5 },
    { color:0xf2c188, pos:[39, 0,  3], hat:'crown', wanderX:2, wanderZ:2.5 },
  ],
  [
    { color:0xe6b870, pos:[-5, 0,  4], hat:'top', wanderX:2.5, wanderZ:3 },
    { color:0xfae0a8, pos:[8,  0, -4], hat:'cowboy', wanderX:2.5, wanderZ:3 },
    { color:0xf5d27a, pos:[20, 0,  5], hat:'crown', wanderX:2.5, wanderZ:3 },
    { color:0xf2c188, pos:[33, 0, -4], hat:'orange', wanderX:2.5, wanderZ:3 },
  ],
];

function clearLevel() {
  for (const o of levelObjects) scene.remove(o);
  levelObjects = [];
}
function buildLevel(idx) {
  clearLevel();
  if (!cfg.ground) return; // step 0 → empty pastel scene
  const L = LEVELS[idx];
  // ground
  scene.remove(ground);
  ground.clear();
  const baseGeo = new THREE.BoxGeometry(L.ground.len, 1, L.ground.width);
  const base = new THREE.Mesh(baseGeo, flatMat(THEMES[theme].ground));
  base.position.set((L.ground.len/2) - 8, -0.5, 0);
  base.receiveShadow = true;
  ground.add(base);
  if (L.groundEnd) {
    const ge = new THREE.Mesh(new THREE.BoxGeometry(L.groundEnd.len, 1, L.groundEnd.width), flatMat(THEMES[theme].ground));
    ge.position.set(L.groundEnd.x, -0.5, 0); ge.receiveShadow=true; ground.add(ge);
  }
  // grass tufts
  for (let i=0;i<26;i++){
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 5), flatMat(theme==='neon'?0xff6ad5:0x7fc78a));
    t.position.set(-8 + Math.random()*L.ground.len, 0.05, (Math.random()-.5)*(L.ground.width-2));
    ground.add(t);
  }
  scene.add(ground);

  // platforms
  if (cfg.platforms) {
    for (const p of L.platforms) {
      const [x,y,z,w,h,d, type, opts] = p;
      const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), flatMat(THEMES[theme].plat));
      m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true;
      m.userData.platform = true;
      m.userData.base = { x, y, z };
      if (type==='move') m.userData.move = opts;
      if (type==='maybeMove' && cfg.movingPlats) m.userData.move = opts;
      scene.add(m); levelObjects.push(m);
    }
  }

  // barriers — big wooden fences you must jump over
  if (cfg.platforms && L.barriers) {
    for (const b of L.barriers) {
      const g = new THREE.Group();
      const planks = 7;
      const plankD = (b.d / planks) * 0.72;
      for (let s = 0; s < planks; s++) {
        const ph = s % 2 === 0 ? b.h : b.h * 0.9;
        const plank = new THREE.Mesh(
          new THREE.BoxGeometry(b.w, ph, plankD),
          flatMat(s % 2 === 0 ? 0xa9743f : 0xbc8952)
        );
        plank.position.set(0, ph / 2, -b.d / 2 + (b.d / planks) * (s + 0.5));
        plank.castShadow = true; plank.receiveShadow = true;
        g.add(plank);
      }
      for (const railY of [b.h * 0.32, b.h * 0.68]) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(b.w * 1.5, 0.22, b.d),
          flatMat(0x8a5a2e)
        );
        rail.position.set(0, railY, 0);
        rail.castShadow = true;
        g.add(rail);
      }
      g.position.set(b.x, b.y, b.z);
      g.userData.barrier = { w: b.w, h: b.h, d: b.d };
      scene.add(g); levelObjects.push(g);
    }
  }

  // coins
  if (cfg.coins) {
    for (const c of L.coins) {
      const coin = makeCoin();
      coin.position.set(c[0], c[1], c[2]);
      scene.add(coin); levelObjects.push(coin);
    }
    // mega star — giant, worth 5, celebrates on pickup
    if (L.megaCoin) {
      const mega = makeCoin();
      mega.scale.set(2.6, 2.6, 2.6);
      mega.userData.mega = true;
      mega.position.set(L.megaCoin[0], L.megaCoin[1], L.megaCoin[2]);
      scene.add(mega); levelObjects.push(mega);
    }
  }

  // flag
  if (cfg.flag) {
    const flag = makeFlag();
    flag.position.set(L.flag[0], L.flag[1], L.flag[2]);
    scene.add(flag); levelObjects.push(flag);
  }

  // enemies
  if (cfg.enemies && L.enemies) {
    for (const e of L.enemies) {
      const en = makeEnemy();
      en.position.set(e.x, e.y, e.z);
      en.userData.enemy = true;
      en.userData.alive = true;
      en.userData.squish = 1;
      en.userData.path = { base: e.x, range: e.range, speed: e.speed, phase: Math.random()*Math.PI*2 };
      scene.add(en); levelObjects.push(en);
    }
  }

  // friends
  if (cfg.friends) {
    // Y=0 puts the legs on the ground. Level 2 friends stay on the start/end slabs.
    const friends = LEVEL_FRIENDS[idx] ?? LEVEL_FRIENDS[0];
    for (const f of friends) {
      const c = buildCapy(f.color);
      c.position.set(...f.pos);
      c.rotation.y = Math.random()*Math.PI*2;
      setHat(c, f.hat);
      c.userData.bobOffset = Math.random()*Math.PI*2;
      c.userData.friend = true;
      // Idle wander state
      c.userData.wander = {
        homeX: f.pos[0], homeZ: f.pos[2],
        targetX: f.pos[0], targetZ: f.pos[2],
        rangeX: f.wanderX ?? 5,
        rangeZ: f.wanderZ ?? 4,
        timer: Math.random()*120,
        speed: 0.018 + Math.random()*0.012,
        facing: Math.random()*Math.PI*2,
        walkPhase: Math.random()*Math.PI*2,
      };
      scene.add(c); levelObjects.push(c);
    }
  }

  // jungle decor when theme is non-cozy
  decorateForTheme();
}

function makeCoin() {
  const g = new THREE.Group();
  const points = 5, outerR = 0.38, innerR = 0.16;
  const star = new THREE.Shape();
  for (let i = 0; i < points*2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / (points*2)) * Math.PI*2 + Math.PI/2;
    const x = Math.cos(a)*r, y = Math.sin(a)*r;
    if (i === 0) star.moveTo(x, y); else star.lineTo(x, y);
  }
  star.closePath();
  const geo = new THREE.ExtrudeGeometry(star, { depth:0.14, bevelEnabled:true, bevelThickness:0.03, bevelSize:0.03, bevelSegments:1 });
  geo.center();
  const m = new THREE.Mesh(geo, flatMat(0xffd84a, { emissive:0x553300, emissiveIntensity:0.3 }));
  m.castShadow=true;
  g.add(m);
  g.userData.coin = true; g.userData.collected = false;
  return g;
}

function makeFlag() {
  const g = new THREE.Group();
  // tall white pole with a gold knob on top
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,4.2,8), flatMat(0xfafafa));
  pole.position.y = 2.1; pole.castShadow = true; g.add(pole);
  const knob = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), flatMat(0xffd84a));
  knob.position.y = 4.3; g.add(knob);
  // big bright triangular pennant
  const pennantShape = new THREE.Shape();
  pennantShape.moveTo(0, 0);
  pennantShape.lineTo(1.6, -0.55);
  pennantShape.lineTo(0, -1.1);
  pennantShape.lineTo(0, 0);
  const cloth = new THREE.Mesh(
    new THREE.ShapeGeometry(pennantShape),
    new THREE.MeshLambertMaterial({ color:0xe65a8a, side:THREE.DoubleSide, flatShading:true, emissive:0x551122, emissiveIntensity:0.25 })
  );
  cloth.position.set(0.05, 4.0, 0); cloth.castShadow = true;
  g.add(cloth);
  // small white star on the pennant
  const star = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), flatMat(0xffffff));
  star.position.set(0.55, 3.6, 0.02); g.add(star);
  // base ring at platform level
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.45,0.18,10), flatMat(0xffd84a));
  ring.position.y = 0.09; g.add(ring);
  g.userData.flag = true; g.userData.cloth = cloth;
  return g;
}

// Decoration: clouds, palms (jungle), neon arches (neon), cacti (sunset)
const decor = [];
function decorateForTheme() {
  for (const d of decor) scene.remove(d);
  decor.length = 0;
  // clouds for cozy + sky
  if (theme==='cozy' || theme==='sky') {
    for (let i=0;i<8;i++){
      const c = new THREE.Group();
      for (let j=0;j<3;j++){
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8+Math.random()*0.6, 0), flatMat(0xffffff));
        m.position.set(j*0.9, Math.random()*0.3, 0); c.add(m);
      }
      c.position.set((Math.random()-.5)*60, 8+Math.random()*5, -10-Math.random()*15);
      c.userData.drift = 0.005 + Math.random()*0.01;
      scene.add(c); decor.push(c);
    }
  } else if (theme==='jungle') {
    // tall coconut palms — varied sizes
    for (let i=0;i<14;i++){
      const palm = new THREE.Group();
      const scale = 0.7 + Math.random()*1.6;
      const th = 3 + Math.random()*2.5;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.28, th, 6), flatMat(0x7a4a2a));
      trunk.position.y = th/2; palm.add(trunk);
      // fronds — multiple cones radiating from top
      for (let f=0; f<6; f++){
        const fr = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.5 + Math.random()*0.6, 4),
          flatMat(0x4f9a4a + Math.random()*0x002000));
        const a = (f/6)*Math.PI*2;
        fr.position.set(Math.cos(a)*0.5, th + 0.3, Math.sin(a)*0.5);
        fr.rotation.z = Math.cos(a)*0.6; fr.rotation.x = Math.sin(a)*0.6;
        palm.add(fr);
      }
      // coconut cluster
      for (let c=0;c<2;c++){
        const co = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15,0), flatMat(0x3a2010));
        co.position.set((Math.random()-.5)*0.4, th, (Math.random()-.5)*0.4); palm.add(co);
      }
      palm.scale.setScalar(scale);
      palm.position.set((Math.random()-.5)*70, 0, (i%2?1:-1)*(6+Math.random()*5));
      scene.add(palm); decor.push(palm);
    }
    // round broadleaf trees in different sizes
    for (let i=0;i<10;i++){
      const tree = new THREE.Group();
      const s = 0.6 + Math.random()*1.4;
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.32, 1.6, 6), flatMat(0x6b4022));
      tr.position.y = 0.8; tree.add(tr);
      // 3 stacked leaf blobs
      for (let b=0;b<3;b++){
        const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9 - b*0.18, 0),
          flatMat([0x3f8a3a,0x4f9a4a,0x66b06b][b]));
        leaf.position.set((Math.random()-.5)*0.3, 1.6 + b*0.7, (Math.random()-.5)*0.3);
        tree.add(leaf);
      }
      tree.scale.setScalar(s);
      tree.position.set((Math.random()-.5)*70, 0, (i%2?1:-1)*(8+Math.random()*4));
      scene.add(tree); decor.push(tree);
    }
    // ferns / bushes
    for (let i=0;i<22;i++){
      const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35 + Math.random()*0.4, 0),
        flatMat(0x4a8a3a + Math.random()*0x002000));
      bush.position.set((Math.random()-.5)*70, 0.25, (Math.random()-.5)*12);
      bush.scale.set(1, 0.6 + Math.random()*0.4, 1);
      scene.add(bush); decor.push(bush);
    }
    // distant misty mountains
    for (let i=0;i<5;i++){
      const m = new THREE.Mesh(new THREE.ConeGeometry(5+Math.random()*3, 6+Math.random()*3, 5),
        new THREE.MeshBasicMaterial({ color: 0x2a6a4a, transparent:true, opacity:0.7 }));
      m.position.set(-25 + i*12, 3, -25); decor.push(m); scene.add(m);
    }
    // butterflies that drift
    for (let i=0;i<6;i++){
      const bf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), flatMat(0xff7a3d));
      bf.position.set((Math.random()-.5)*40, 2+Math.random()*3, (Math.random()-.5)*10);
      bf.userData.drift = 0.01 + Math.random()*0.02;
      scene.add(bf); decor.push(bf);
    }
  } else if (theme==='space') {
    // MASSIVE background planet
    const bigPlanet = new THREE.Group();
    const bp = new THREE.Mesh(new THREE.IcosahedronGeometry(18, 2),
      new THREE.MeshLambertMaterial({ color: 0x4a3a8a, flatShading:true, emissive:0x1a0a44, emissiveIntensity:0.5 }));
    bigPlanet.add(bp);
    // surface continents
    for (let i=0;i<14;i++){
      const cont = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2 + Math.random()*1.6, 0),
        new THREE.MeshLambertMaterial({ color: i%2?0x6a4aff:0xff6ad5, flatShading:true, emissive:0x220a44, emissiveIntensity:0.3 }));
      const a = Math.random()*Math.PI*2; const b = Math.acos(2*Math.random()-1);
      const r = 17.6;
      cont.position.set(Math.sin(b)*Math.cos(a)*r, Math.cos(b)*r, Math.sin(b)*Math.sin(a)*r);
      bigPlanet.add(cont);
    }
    bigPlanet.position.set(-8, 18, -55); bigPlanet.userData.spin = 0.0008;
    decor.push(bigPlanet); scene.add(bigPlanet);
    // smaller ringed planet
    const planet = new THREE.Group();
    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1),
      new THREE.MeshLambertMaterial({ color: 0xff6ad5, flatShading:true, emissive:0x441033, emissiveIntensity:0.4 }));
    planet.add(body);
    const ring = new THREE.Mesh(new THREE.RingGeometry(4, 5.5, 48),
      new THREE.MeshBasicMaterial({ color: 0x6affff, side: THREE.DoubleSide, transparent:true, opacity:0.55 }));
    ring.rotation.x = Math.PI/2.4; ring.rotation.z = 0.2; planet.add(ring);
    planet.position.set(20, 13, -32); planet.userData.spin = 0.003;
    decor.push(planet); scene.add(planet);
    // small moon
    const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 0),
      new THREE.MeshLambertMaterial({ color: 0xeaf0ff, flatShading:true }));
    moon.position.set(2, 9, -22); decor.push(moon); scene.add(moon);
    // moving satellites — orbit around player path
    for (let i=0;i<4;i++){
      const sat = new THREE.Group();
      const core = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.5), flatMat(0xcccccc));
      sat.add(core);
      const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.5,1.2), flatMat(0x2244aa, { emissive:0x112255, emissiveIntensity:0.5 }));
      panelL.position.x = -0.6; sat.add(panelL);
      const panelR = panelL.clone(); panelR.position.x = 0.6; sat.add(panelR);
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.2, 8), flatMat(0xffffff));
      dish.rotation.x = Math.PI; dish.position.y = 0.3; sat.add(dish);
      sat.userData.orbit = { r: 18 + i*3, speed: 0.2 + i*0.1, phase: Math.random()*Math.PI*2, y: 8 + i*1.5 };
      decor.push(sat); scene.add(sat);
    }
    // space junk: tumbling debris
    for (let i=0;i<20;i++){
      const junkType = Math.floor(Math.random()*3);
      let junk;
      if (junkType===0) junk = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.2,0.4), flatMat(0x888899));
      else if (junkType===1) junk = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22,0), flatMat(0x666677));
      else junk = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.15,0.4,5), flatMat(0xaa8866));
      junk.position.set((Math.random()-.5)*60, 6+Math.random()*12, -8 - Math.random()*18);
      junk.userData.junk = {
        spin: { x: (Math.random()-.5)*0.04, y: (Math.random()-.5)*0.04, z: (Math.random()-.5)*0.04 },
        drift: 0.008 + Math.random()*0.012,
      };
      decor.push(junk); scene.add(junk);
    }
    // dense starfield
    for (let i=0;i<160;i++){
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random()*0.08, 4, 3),
        new THREE.MeshBasicMaterial({ color: Math.random()<0.15 ? 0x6affff : (Math.random()<0.1 ? 0xff6ad5 : 0xffffff) }));
      const r = 50 + Math.random()*20;
      const ang = Math.random()*Math.PI*2;
      s.position.set(Math.cos(ang)*r, 4 + Math.random()*22, -10 - Math.random()*30);
      decor.push(s); scene.add(s);
    }
    // floating crystals as level decor
    for (let i=0;i<8;i++){
      const cry = new THREE.Mesh(new THREE.OctahedronGeometry(0.4 + Math.random()*0.3, 0),
        new THREE.MeshLambertMaterial({ color: i%2?0x6affff:0xff6ad5, flatShading:true, emissive: i%2?0x103040:0x301030, emissiveIntensity:0.6 }));
      cry.position.set((Math.random()-.5)*60, 1.5+Math.random()*2, (i%2?1:-1)*(6+Math.random()*3));
      cry.userData.float = Math.random()*Math.PI*2;
      decor.push(cry); scene.add(cry);
    }
    // distant nebula puffs
    for (let i=0;i<5;i++){
      const n = new THREE.Mesh(new THREE.IcosahedronGeometry(3+Math.random()*2, 0),
        new THREE.MeshBasicMaterial({ color: i%2?0x4a1a8a:0x1a4a8a, transparent:true, opacity:0.35 }));
      n.position.set(-20 + i*10, 10+Math.random()*4, -28); decor.push(n); scene.add(n);
    }
  }
}

// ============== PLAYER ==============
const player = buildCapy(0xf5d27a);
if (cfg.capy) scene.add(player);
const playerState = {
  x: -8, y: 0.5, z: 0,
  vx: 0, vy: 0, vz: 0,
  onGround: true,
  groundPlatform: null,
  facing: 0,
  walkPhase: 0,
  squash: 1,
  dead: false,
  win: false,
  hat: 'none',
};

function resetPlayer() {
  const L = LEVELS[currentLevel];
  playerState.x = L.start[0]; playerState.y = L.start[1]; playerState.z = L.start[2];
  playerState.vx=0; playerState.vy=0; playerState.vz=0;
  playerState.onGround=true; playerState.facing=0; playerState.dead=false; playerState.win=false;
  playerState.groundPlatform = null;
  player.position.set(playerState.x, playerState.y, playerState.z);
  player.rotation.y = playerState.facing;
}

// ============== INPUT ==============
const keys = Object.create(null);
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  if (cfg.fart && e.code === 'KeyF' && !playerState.farting) {
    triggerFart();
  }
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ============== FART ==============
const fartParticles = [];

// ============== SQUISH FX ==============
let screenShake = 0;
const squishParticles = [];
function spawnSquishBurst(x, y, z) {
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.08 + Math.random()*0.08, 0),
      new THREE.MeshLambertMaterial({ color: 0xff3366, flatShading:true, emissive:0xff1a44, emissiveIntensity:0.9, transparent:true, opacity:1 })
    );
    m.position.set(x + (Math.random()-.5)*0.3, y, z + (Math.random()-.5)*0.3);
    const ang = Math.random() * Math.PI * 2;
    const sp = 0.12 + Math.random() * 0.18;
    scene.add(m);
    squishParticles.push({
      mesh: m,
      vx: Math.cos(ang) * sp,
      vy: 0.18 + Math.random() * 0.22,
      vz: Math.sin(ang) * sp,
      vr: (Math.random()-.5) * 0.3,
      life: 28 + Math.random() * 8,
    });
  }
}
function spawnFart(state) {
  const behind = state.facing + Math.PI;
  const ox = Math.cos(behind) * 0.5;
  const oz = -Math.sin(behind) * 0.5;
  for (let i=0;i<3;i++){
    const m = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.18 + Math.random()*0.12, 0),
      new THREE.MeshLambertMaterial({ color: 0xc8e87f, transparent:true, opacity:0.85, flatShading:true, emissive:0x445510, emissiveIntensity:0.4 })
    );
    m.position.set(state.x + ox + (Math.random()-.5)*0.2, state.y + 0.4, state.z + oz + (Math.random()-.5)*0.2);
    scene.add(m);
    fartParticles.push({
      mesh: m,
      vx: Math.cos(behind)*0.05 + (Math.random()-.5)*0.04,
      vy: 0.02 + Math.random()*0.03,
      vz: -Math.sin(behind)*0.05 + (Math.random()-.5)*0.04,
      life: 25 + Math.random()*8,
    });
  }
}
function fartSound() {
  try {
    const ctx = ensureAudio();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    const o2 = ctx.createOscillator();
    o.type = 'sawtooth'; o2.type = 'square';
    o.frequency.setValueAtTime(180, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.55);
    o2.frequency.setValueAtTime(90, ctx.currentTime);
    o2.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.55);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    o.connect(g); o2.connect(g); g.connect(ctx.destination);
    o.start(); o2.start();
    o.stop(ctx.currentTime + 0.6); o2.stop(ctx.currentTime + 0.6);
  } catch(_) {}
}
function triggerFart() {
  playerState.farting = true;
  playerState.fartCooldown = 0;
  fartSound();
  // tiny upward poof boost if grounded
  if (playerState.onGround) playerState.vy = Math.max(playerState.vy, 0.18);
  setTimeout(() => { playerState.farting = false; }, 600);
}

// ============== TOUCH / MOBILE CONTROLS ==============
// touchTarget.nx = right axis (-1..1), .ny = down-axis (-1..1) (so up = -1, down = +1)
let touchTarget = null;
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
const mobileControls = document.getElementById('mobileControls');
const joystickEl = document.getElementById('joystick');
const joyKnob = document.getElementById('joyKnob');
const jumpBtn = document.getElementById('jumpBtn');
const fartBtn = document.getElementById('fartBtn');

if (isTouch) {
  document.body.classList.add('touch');
  // hide the keyboard hint on touch devices — it's misleading
  const hintEl = document.getElementById('hint');
  if (hintEl) hintEl.hidden = true;

  // ----- Virtual joystick -----
  let joyActive = false;
  let joyId = null;
  let joyCx = 0, joyCy = 0;
  const JOY_RADIUS = 50; // max knob travel from center, in px
  function joyStart(e) {
    const t = e.changedTouches ? e.changedTouches[0] : e;
    const rect = joystickEl.getBoundingClientRect();
    joyCx = rect.left + rect.width/2;
    joyCy = rect.top + rect.height/2;
    joyActive = true;
    joyId = t.identifier ?? 'mouse';
    joyMove(e);
    e.preventDefault();
  }
  function joyMove(e) {
    if (!joyActive) return;
    let t = null;
    if (e.changedTouches) {
      for (const tc of e.changedTouches) if (tc.identifier === joyId) { t = tc; break; }
      if (!t) return;
    } else { t = e; }
    let dx = t.clientX - joyCx;
    let dy = t.clientY - joyCy;
    const d = Math.hypot(dx, dy);
    if (d > JOY_RADIUS) { dx = (dx/d) * JOY_RADIUS; dy = (dy/d) * JOY_RADIUS; }
    joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    // dead zone + normalize to unit
    const dead = 0.18;
    const nx = dx / JOY_RADIUS;
    const ny = dy / JOY_RADIUS;
    const mag = Math.hypot(nx, ny);
    if (mag < dead) { touchTarget = null; return; }
    touchTarget = { nx, ny };
    e.preventDefault();
  }
  function joyEnd(e) {
    if (!joyActive) return;
    if (e.changedTouches) {
      let match = false;
      for (const tc of e.changedTouches) if (tc.identifier === joyId) { match = true; break; }
      if (!match) return;
    }
    joyActive = false; joyId = null;
    touchTarget = null;
    joyKnob.style.transform = 'translate(-50%, -50%)';
  }
  joystickEl.addEventListener('touchstart', joyStart, { passive: false });
  joystickEl.addEventListener('touchmove',  joyMove,  { passive: false });
  joystickEl.addEventListener('touchend',   joyEnd);
  joystickEl.addEventListener('touchcancel',joyEnd);
  // mouse fallback (lets us test in desktop dev tools)
  joystickEl.addEventListener('mousedown', joyStart);
  window.addEventListener('mousemove', joyMove);
  window.addEventListener('mouseup', joyEnd);

  // ----- Jump button -----
  const onJump = (e) => { playerState.jumpQueued = true; e.preventDefault(); };
  jumpBtn.addEventListener('touchstart', onJump, { passive: false });
  jumpBtn.addEventListener('mousedown', onJump);

  // ----- Fart button (visibility wired below when cfg.fart) -----
  const onFart = (e) => { if (cfg.fart && !playerState.farting) triggerFart(); e.preventDefault(); };
  fartBtn.addEventListener('touchstart', onFart, { passive: false });
  fartBtn.addEventListener('mousedown', onFart);

  // Stop the camera/canvas from hijacking touches
  cv.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  cv.addEventListener('touchmove',  (e) => e.preventDefault(), { passive: false });
} else {
  // Desktop fallback: keep the old click-and-drag-to-move behavior on the canvas
  cv.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = cv.getBoundingClientRect();
    const nx = ((e.clientX-rect.left)/rect.width)*2 - 1;
    const ny = ((e.clientY-rect.top)/rect.height)*2 - 1;
    touchTarget = { nx, ny };
  });
  cv.addEventListener('pointermove', (e) => {
    if (!touchTarget || e.pointerType !== 'mouse' || e.buttons === 0) return;
    const rect = cv.getBoundingClientRect();
    touchTarget = {
      nx: ((e.clientX-rect.left)/rect.width)*2 - 1,
      ny: ((e.clientY-rect.top)/rect.height)*2 - 1,
    };
  });
  cv.addEventListener('pointerup', () => { touchTarget = null; });
}

// ============== SCORING ==============
let score = 0;
const scoreEl = document.getElementById('score');
const lvNumEl = document.getElementById('lvNum');
const levelPill = document.getElementById('levelPill');
const hud = document.getElementById('hud');
const themeBar = document.getElementById('themeBar');
const hint = document.getElementById('hint');
const titleEl = document.getElementById('title');
const playBtn = document.getElementById('playBtn');
const winEl = document.getElementById('win');
const winScoreEl = document.getElementById('winScore');
const winTitleEl = document.getElementById('winTitle');
const againBtn = document.getElementById('againBtn');
const nextLvlBtn = document.getElementById('nextLvlBtn');
const fxCanvas = document.getElementById('fx');
const hatPicker = document.getElementById('hatPicker');
let winRevealTimeoutId = null;

// Split the title into per-letter spans so each can bounce on a stagger
function setWinTitle(text) {
  winTitleEl.textContent = '';
  let i = 0;
  for (const ch of text) {
    if (ch === ' ') { winTitleEl.append(' '); continue; }
    const s = document.createElement('span');
    s.className = 'wl';
    s.style.setProperty('--i', i++);
    s.textContent = ch;
    winTitleEl.appendChild(s);
  }
}

// Tick the score up from 0 instead of showing it instantly
let winScoreAnimId = null;
function animateWinScore(target) {
  cancelAnimationFrame(winScoreAnimId);
  const t0 = performance.now();
  const dur = Math.min(1600, 500 + target * 120);
  function step(t) {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    winScoreEl.textContent = String(Math.round(e * target));
    if (k < 1) winScoreAnimId = requestAnimationFrame(step);
  }
  winScoreAnimId = requestAnimationFrame(step);
}

function updateLvlBtns() {
  if (!levelPill) return;
  levelPill.querySelectorAll('.lvl-btn').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.lvl) === currentLevel);
  });
}

function clearWinState() {
  if (winRevealTimeoutId !== null) {
    clearTimeout(winRevealTimeoutId);
    winRevealTimeoutId = null;
  }
  if (winEl) winEl.hidden = true;
  if (nextLvlBtn) nextLvlBtn.hidden = true;
  for (const d of dancingFriends) scene.remove(d);
  dancingFriends = [];
  confetti.length = 0;
  if (fxCanvas) {
    const ctx2 = fxCanvas.getContext('2d');
    ctx2?.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fxCanvas.hidden = true;
  }
  playerState.win = false;
  screenShake = 0;
}

function applySkyColors(top, bot) {
  document.body.style.background = `linear-gradient(180deg, ${top}, ${bot})`;
  if (skyMat.map) skyMat.map.dispose();
  skyMat.map = makeSkyTexture(top, bot);
  skyMat.needsUpdate = true;
}

function loadLevel(idx, opts={}) {
  clearWinState();
  currentLevel = idx;
  if (cfg.level2 && lvNumEl) lvNumEl.textContent = String(idx + 1);
  if (opts.resetScore) {
    score = 0;
    scoreEl.textContent = '0';
  }
  buildLevel(currentLevel);
  // per-level sky override (falls back to the active theme's sky)
  const sky = LEVELS[idx].sky;
  applySkyColors(sky?.top ?? THEMES[theme].skyTop, sky?.bot ?? THEMES[theme].skyBot);
  resetPlayer();
  updateLvlBtns();
}

// Show HUD only when coins exist (coin counter shouldn't appear before coins do)
if (cfg.coins || cfg.level2) hud.hidden = false;
if (!cfg.coins) document.querySelector('.hud-left .pill').hidden = true;
if (cfg.themePicker) {
  themeBar.hidden = false;
  themeBar.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}
if (cfg.level2) levelPill.hidden = false;

// Level switch buttons
if (cfg.level2 && levelPill) {
  levelPill.addEventListener('click', (e) => {
    const btn = e.target.closest('.lvl-btn'); if (!btn) return;
    const idx = Number(btn.dataset.lvl);
    if (idx === currentLevel) return;
    loadLevel(idx);
  });
  // Default to Level 2 the moment level2 unlocks (so the new step shows the new level)
  currentLevel = 1;
  setTimeout(() => { loadLevel(1); }, 0);
}
if (!cfg.capy) hint.hidden = true;
if (cfg.fart) {
  const fh = document.getElementById('fartHint'); if (fh) fh.hidden = false;
  const fb = document.getElementById('fartBtn'); if (fb && isTouch) fb.hidden = false;
}

// ============== MUSIC TOGGLE (added in sound step) ==============
let musicOn = true;
const musicToggle = document.getElementById('musicToggle');
if (cfg.sound && musicToggle) {
  musicToggle.hidden = false;
  hud.hidden = false;
  musicToggle.addEventListener('click', () => {
    musicOn = !musicOn;
    musicToggle.textContent = musicOn ? '🔊' : '🔇';
    musicToggle.classList.toggle('off', !musicOn);
    if (!musicOn) stopMusic(); else startMusic();
  });
}

// Theme picker
themeBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.theme-btn'); if (!btn) return;
  const t = btn.dataset.theme;
  if (!THEMES[t]) return;
  setTheme(t);
  themeBar.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b===btn));
});

// Smooth theme transitions — tween every color/intensity over ~700ms
let themeTween = null;
function setTheme(name, instant=false) {
  const prev = THEMES[theme];
  theme = name;
  const T = THEMES[name];
  document.body.style.background = `linear-gradient(180deg, ${T.skyTop}, ${T.skyBot})`;
  // cross-fade sky: put new texture on sky2 and fade it in, then swap
  if (skyMat2.map) skyMat2.map.dispose();
  skyMat2.map = makeSkyTexture(T.skyTop, T.skyBot);
  skyMat2.color.setHex(0xffffff);
  skyMat2.opacity = 0;
  skyMat2.needsUpdate = true;
  decorateForTheme();
  if (instant) {
    if (skyMat.map) skyMat.map.dispose();
    skyMat.map = makeSkyTexture(T.skyTop, T.skyBot);
    skyMat.needsUpdate = true;
    scene.fog.color.setHex(T.fog);
    ambient.color.setHex(T.ambient); ambient.intensity = T.ambientI;
    sun.color.setHex(T.sun); sun.intensity = T.sunI;
    rim.color.setHex(T.rimColor);
    ground.children.forEach(ch => {
      if (ch.geometry?.type === 'BoxGeometry') ch.material.color.setHex(T.ground);
    });
    for (const o of levelObjects) {
      if (o.userData.platform) o.material.color.setHex(T.plat);
    }
    return;
  }
  // collect tween color targets
  const fogFrom = scene.fog.color.clone();
  const fogTo = new THREE.Color(T.fog);
  const ambFrom = ambient.color.clone(); const ambTo = new THREE.Color(T.ambient);
  const ambIFrom = ambient.intensity; const ambITo = T.ambientI;
  const sunFrom = sun.color.clone(); const sunTo = new THREE.Color(T.sun);
  const sunIFrom = sun.intensity; const sunITo = T.sunI;
  const rimFrom = rim.color.clone(); const rimTo = new THREE.Color(T.rimColor);
  const groundFrom = new THREE.Color(prev.ground); const groundTo = new THREE.Color(T.ground);
  const platFrom = new THREE.Color(prev.plat); const platTo = new THREE.Color(T.plat);
  const start = performance.now();
  const dur = 700;
  themeTween = (now) => {
    const k = Math.min(1, (now - start) / dur);
    const e = k<0.5 ? 2*k*k : 1 - Math.pow(-2*k+2, 2)/2; // easeInOut
    scene.fog.color.copy(fogFrom).lerp(fogTo, e);
    ambient.color.copy(ambFrom).lerp(ambTo, e); ambient.intensity = ambIFrom + (ambITo-ambIFrom)*e;
    sun.color.copy(sunFrom).lerp(sunTo, e); sun.intensity = sunIFrom + (sunITo-sunIFrom)*e;
    rim.color.copy(rimFrom).lerp(rimTo, e);
    const gMix = new THREE.Color().copy(groundFrom).lerp(groundTo, e);
    const pMix = new THREE.Color().copy(platFrom).lerp(platTo, e);
    ground.children.forEach(ch => {
      if (ch.geometry?.type === 'BoxGeometry') ch.material.color.copy(gMix);
    });
    for (const o of levelObjects) {
      if (o.userData.platform) o.material.color.copy(pMix);
    }
    skyMat2.opacity = e;
    if (k >= 1) {
      if (skyMat.map) skyMat.map.dispose();
      skyMat.map = makeSkyTexture(T.skyTop, T.skyBot);
      skyMat.needsUpdate = true;
      skyMat2.opacity = 0;
      themeTween = null;
    }
  };
}

// ============== TITLE / START ==============
let started = !cfg.titleScreen;
if (cfg.titleScreen) {
  titleEl.hidden = false;
  if (cfg.hatPicker) hatPicker.hidden = false;
  hint.hidden = true;
}
playBtn?.addEventListener('click', () => {
  titleEl.hidden = true;
  hint.hidden = false;
  started = true;
});
hatPicker?.addEventListener('click', (e) => {
  const btn = e.target.closest('.hat-btn'); if (!btn) return;
  hatPicker.querySelectorAll('.hat-btn').forEach(b => b.classList.toggle('active', b===btn));
  playerState.hat = btn.dataset.hat;
  setHat(player, playerState.hat);
});

// Win actions
againBtn.addEventListener('click', () => {
  loadLevel(0, { resetScore: true });
});
nextLvlBtn.addEventListener('click', () => {
  loadLevel(Math.min(currentLevel + 1, LEVELS.length - 1));
});

// ============== AUDIO ==============
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function blip(freq=600, dur=0.08, type='triangle', vol=0.15) {
  if (!cfg.sound) return;
  try {
    const ctx = ensureAudio();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type=type; o.frequency.value=freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+dur);
    o.start(); o.stop(ctx.currentTime+dur);
  } catch(_) {}
}
let musicNodes = [];
let musicStarted = false;
function stopMusic() {
  musicNodes.forEach(n => { try { n.stop(); } catch(_){} });
  musicNodes = [];
  musicStarted = false;
}
function startMusic() {
  if (!cfg.sound || !musicOn || musicStarted) return;
  try {
    const ctx = ensureAudio();
    if (ctx.state === 'suspended') ctx.resume();
    musicNodes.forEach(n => { try { n.stop(); } catch(_){} });
    musicNodes = [];
    const master = ctx.createGain(); master.gain.value = 0.18; master.connect(ctx.destination);

    // ---- Bass pad: pulsing root + fifth ----
    const padGain = ctx.createGain(); padGain.gain.value = 0.0; padGain.connect(master);
    [130.8, 196.0].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      o.connect(padGain); o.start(); musicNodes.push(o);
      // slow detune wobble
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.18 + i*0.07;
      const lfoG = ctx.createGain(); lfoG.gain.value = 2.5;
      lfo.connect(lfoG); lfoG.connect(o.detune); lfo.start();
      musicNodes.push(lfo);
    });
    // breathing pad volume
    const padLfo = ctx.createOscillator(); padLfo.frequency.value = 0.22;
    const padLfoG = ctx.createGain(); padLfoG.gain.value = 0.09;
    padLfo.connect(padLfoG); padLfoG.connect(padGain.gain);
    padGain.gain.setValueAtTime(0.12, ctx.currentTime);
    padLfo.start(); musicNodes.push(padLfo);

    // ---- Melody: scheduled cheerful capybara theme ----
    // C major pentatonic-ish with a few playful jumps
    const N = (n) => 261.63 * Math.pow(2, n/12);
    // [semitone offset from C4, beats]
    const melody = [
      [0,0.5],[7,0.5],[4,0.5],[7,0.5],   [9,1.0],[7,0.5],[4,0.5],
      [5,0.5],[9,0.5],[12,0.5],[9,0.5],  [7,1.5],[-1,0.5],
      [0,0.5],[4,0.5],[7,0.5],[12,0.5],  [11,0.75],[9,0.25],[7,1.0],
      [9,0.5],[7,0.5],[5,0.5],[4,0.5],   [2,0.5],[4,0.5],[5,0.5],[7,0.5],
      [12,0.5],[14,0.5],[16,1.0],        [12,0.5],[9,0.5],[7,1.0],
    ];
    const bass = [
      [-12,1],[-5,1],[-7,1],[-12,1],
      [-12,1],[-7,1],[-5,1],[-7,1],
      [-12,1],[-5,1],[-7,1],[-12,1],
      [-10,1],[-5,1],[-7,1],[-12,1],
    ];
    const bpm = 116;
    const beat = 60 / bpm;
    let totalBeats = melody.reduce((s,n)=>s+n[1],0);
    const bassBeats = bass.reduce((s,n)=>s+n[1],0);
    const loopLen = Math.max(totalBeats, bassBeats) * beat;

    function playNote(freq, when, dur, type='triangle', vol=0.22) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(vol, when + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, when + dur);
      o.connect(g); g.connect(master);
      o.start(when); o.stop(when + dur + 0.05);
      musicNodes.push(o);
    }
    function playBlip(freq, when, dur) {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = freq*0.5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(0.12, when + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, when + dur);
      o.connect(g); g.connect(master);
      o.start(when); o.stop(when + dur + 0.05);
      musicNodes.push(o);
    }

    function scheduleLoop(startAt) {
      let t = startAt;
      for (const [semi, b] of melody) {
        const dur = b * beat * 0.95;
        playNote(N(semi), t, dur, 'triangle', 0.20);
        // sparkle harmony every other note
        if (b >= 0.5 && Math.random() > 0.55) {
          playNote(N(semi+7), t, dur*0.6, 'sine', 0.07);
        }
        t += b * beat;
      }
      let bt = startAt;
      for (const [semi, b] of bass) {
        playBlip(N(semi), bt, b * beat * 0.9);
        bt += b * beat;
      }
    }

    const start0 = ctx.currentTime + 0.05;
    scheduleLoop(start0);
    // re-schedule next loop a bit before previous ends
    const reSched = () => {
      if (!musicStarted) return;
      scheduleLoop(ctx.currentTime + 0.1);
    };
    const intervalId = setInterval(reSched, loopLen * 1000);
    musicNodes.push({ stop: () => clearInterval(intervalId) });

    musicStarted = true;
  } catch(_) {}
}

// Auto-start music as soon as the sound step is unlocked.
// iframe has allow="autoplay" so AudioContext can start without an in-frame gesture
// in most browsers; if it's still suspended, the first interaction will resume it.
if (cfg.sound) {
  const tryStart = () => { ensureAudio(); startMusic(); };
  tryStart();
  const kick = () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (!musicStarted) startMusic();
    window.removeEventListener('pointerdown', kick);
    window.removeEventListener('keydown', kick);
  };
  window.addEventListener('pointerdown', kick);
  window.addEventListener('keydown', kick);
}

// ============== CONFETTI / DANCE FX ==============
const confetti = [];
function fireConfetti(scale = 1) {
  fxCanvas.hidden = false;
  fxCanvas.width = window.innerWidth; fxCanvas.height = window.innerHeight;
  const count = Math.round(140 * Math.min(scale, 2));
  for (let i=0;i<count;i++) {
    confetti.push({
      x: window.innerWidth/2 + (Math.random()-.5)*120,
      y: window.innerHeight*0.4,
      vx: (Math.random()-.5)*8,
      vy: -8 - Math.random()*6,
      g: 0.25 + Math.random()*0.15,
      r: (4 + Math.random()*4) * scale,
      c: ['#ff6ad5','#ffd84a','#6affff','#7fd1a0','#ffb37a'][Math.floor(Math.random()*5)],
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-.5)*0.3,
      life: 240,
    });
  }
}
function drawConfetti() {
  if (confetti.length===0) { fxCanvas.hidden = true; return; }
  const ctx2 = fxCanvas.getContext('2d');
  ctx2.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  for (let i=confetti.length-1;i>=0;i--) {
    const p = confetti[i];
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    ctx2.save(); ctx2.translate(p.x,p.y); ctx2.rotate(p.rot);
    ctx2.fillStyle = p.c; ctx2.fillRect(-p.r/2,-p.r/2, p.r, p.r*0.6);
    ctx2.restore();
    if (p.life<=0 || p.y > fxCanvas.height+50) confetti.splice(i,1);
  }
}

// ============== GAME LOOP ==============
let dancingFriends = [];
function triggerWin() {
  playerState.win = true;
  const isFinalLevel = !cfg.level2 || currentLevel === LEVELS.length - 1;
  // Always celebrate visually whenever we're past the finale step
  if (cfg.finale) {
    fireConfetti();
    startMusic();
    // clear any prior dancers
    for (const d of dancingFriends) scene.remove(d);
    dancingFriends = [];
    const colors = [0xf5d27a, 0xe6b870, 0xfae0a8, 0xf2c188];
    const dancerBaseY = player.position.y;
    for (let i = 0; i < 4; i++) {
      const c = buildCapy(colors[i]);
      const ang = (i / 4) * Math.PI * 2;
      c.position.set(player.position.x + Math.cos(ang) * 3, dancerBaseY, player.position.z + Math.sin(ang) * 3);
      c.rotation.y = ang + Math.PI;
      c.userData.danceOffset = i * 0.4;
      c.userData.danceBaseY = dancerBaseY;
      scene.add(c); dancingFriends.push(c);
    }
    // delay the win card so the player can see the dance + confetti
    winRevealTimeoutId = setTimeout(() => {
      winRevealTimeoutId = null;
      winEl.hidden = false;
      animateWinScore(score);
      if (!isFinalLevel) {
        setWinTitle(`LEVEL ${currentLevel + 1} CLEAR! 🎉`);
        nextLvlBtn.hidden = false;
      } else {
        setWinTitle('YOU MADE IT! 🏆');
        nextLvlBtn.hidden = true;
      }
    }, 2400);
  } else {
    winEl.hidden = false;
    animateWinScore(score);
    if (!isFinalLevel) {
      setWinTitle(`LEVEL ${currentLevel + 1} CLEAR!`);
      nextLvlBtn.hidden = false;
    } else {
      setWinTitle('YOU MADE IT! 🎉');
      nextLvlBtn.hidden = true;
    }
    if (cfg.sound) fireConfetti();
  }
}

// build initial level
buildLevel(0);
resetPlayer();

const GRAVITY = -0.03;
const JUMP_V = 0.55;
const MOVE_A = 0.05;
const MAX_V = 0.224;
const FRICTION = 0.82;

function updateMovingPlatforms(now) {
  for (const o of levelObjects) {
    if (!o.userData.platform || !o.userData.move) continue;
    const previous = {
      x: o.position.x,
      y: o.position.y,
      z: o.position.z,
    };
    const mv = o.userData.move; const b = o.userData.base;
    const t = now*0.001 * mv.speed;
    if (mv.axis==='x') o.position.x = b.x + Math.sin(t)*mv.range;
    if (mv.axis==='y') o.position.y = b.y + Math.sin(t)*mv.range;
    if (mv.axis==='z') o.position.z = b.z + Math.sin(t)*mv.range;
    o.userData.delta = {
      x: o.position.x - previous.x,
      y: o.position.y - previous.y,
      z: o.position.z - previous.z,
    };
  }
}

function getGroundPlatformDelta() {
  const platform = playerState.groundPlatform;
  if (!platform || !platform.userData.move || !levelObjects.includes(platform)) {
    return { x: 0, y: 0, z: 0 };
  }
  return platform.userData.delta || { x: 0, y: 0, z: 0 };
}

let lastT = performance.now();
function tick(now) {
  const dt = Math.min(50, now-lastT)/16.67; lastT = now;

  if (cfg.capy && started && !playerState.win) {
    updateMovingPlatforms(now);

    // --- input ---
    // input in screen space: fwd=+1 for up/forward, rt=+1 for right
    let fwd = 0, rt = 0;
    if (keys.ArrowUp || keys.KeyW)    fwd += 1;
    if (keys.ArrowDown || keys.KeyS)  fwd -= 1;
    if (keys.ArrowLeft || keys.KeyA)  rt  -= 1;
    if (keys.ArrowRight || keys.KeyD) rt  += 1;
    if (touchTarget) {
      rt  += touchTarget.nx * 1.0;
      fwd -= touchTarget.ny * 1.0;
    }
    const m = Math.hypot(fwd, rt);
    if (m > 0) { fwd/=m; rt/=m;
      // camera looks along +x. forward=+x world, screen-right=-z world.
      const wx = fwd, wz = rt;
      playerState.vx += wx * MOVE_A * dt;
      playerState.vz += wz * MOVE_A * dt;
      // capy snout points local +x; rotation.y rotates +x toward -z, so facing = atan2(-wz, wx)
      playerState.facing = Math.atan2(-wz, wx);
    }

    // jump
    if ((keys.Space || playerState.jumpQueued) && playerState.onGround) {
      playerState.vy = JUMP_V;
      playerState.onGround = false;
      playerState.squash = 1.3;
      blip(700, 0.1, 'square', 0.1);
    }
    playerState.jumpQueued = false;

    // friction & clamp
    playerState.vx *= FRICTION; playerState.vz *= FRICTION;
    playerState.vx = Math.max(-MAX_V, Math.min(MAX_V, playerState.vx));
    playerState.vz = Math.max(-MAX_V, Math.min(MAX_V, playerState.vz));
    playerState.vy += GRAVITY * dt;

    const platformDelta = playerState.onGround
      ? getGroundPlatformDelta()
      : { x: 0, y: 0, z: 0 };

    // proposed position
    const carriedY = playerState.y + platformDelta.y;
    const nx = playerState.x + platformDelta.x + playerState.vx * dt;
    const nz = playerState.z + platformDelta.z + playerState.vz * dt;
    let ny = carriedY + playerState.vy * dt;

    // platform & ground collision (top-of-box only, simple)
    let groundLevel = -100;
    let groundPlatform = null;
    // ground
    const onGroundSlab = Math.abs(nz) <= LEVELS[currentLevel].ground.width/2 - 0.4 &&
      nx >= -8 - 0.4 && nx <= -8 + LEVELS[currentLevel].ground.len + 0.4;
    let onEndSlab = false;
    if (LEVELS[currentLevel].groundEnd) {
      const ge = LEVELS[currentLevel].groundEnd;
      onEndSlab = Math.abs(nz) <= ge.width/2 - 0.4 && nx >= ge.x - ge.len/2 - 0.4 && nx <= ge.x + ge.len/2 + 0.4;
    }
    if (onGroundSlab || onEndSlab) groundLevel = Math.max(groundLevel, 0);

    // platforms
    for (const o of levelObjects) {
      if (!o.userData.platform) continue;
      const w=o.geometry.parameters.width, h=o.geometry.parameters.height, d=o.geometry.parameters.depth;
      const px=o.position.x, py=o.position.y, pz=o.position.z;
      const within = nx > px-w/2-0.4 && nx < px+w/2+0.4 && nz > pz-d/2-0.4 && nz < pz+d/2+0.4;
      if (within) {
        const top = py + h/2;
        if (carriedY >= top - 0.05 && ny <= top + 0.01 && top > groundLevel) {
          groundLevel = top;
          groundPlatform = o;
        }
      }
    }

    // barriers — solid walls: land on top like a platform, or get pushed
    // back to the side you came from (the only walls with side collision)
    for (const o of levelObjects) {
      if (!o.userData.barrier) continue;
      const { w, h, d } = o.userData.barrier;
      const bx = o.position.x, bz = o.position.z;
      const top = o.position.y + h;
      const within = nx > bx - w/2 - 0.4 && nx < bx + w/2 + 0.4 && nz > bz - d/2 - 0.4 && nz < bz + d/2 + 0.4;
      if (!within) continue;
      if (carriedY >= top - 0.05 && ny <= top + 0.01) {
        if (top > groundLevel) { groundLevel = top; groundPlatform = null; }
      } else if (carriedY < top - 0.05 && carriedY > o.position.y - 1.2) {
        nx = playerState.x <= bx ? bx - w/2 - 0.45 : bx + w/2 + 0.45;
        playerState.vx = 0;
      }
    }

    if (ny <= groundLevel) {
      ny = groundLevel;
      if (!playerState.onGround && playerState.vy < -0.05) {
        playerState.squash = 0.7;
        blip(220, 0.05, 'sine', 0.06);
      }
      playerState.vy = 0;
      playerState.onGround = true;
      playerState.groundPlatform = groundPlatform;
    } else {
      playerState.onGround = false;
      playerState.groundPlatform = null;
    }

    // out of world?
    if (ny < -10) {
      resetPlayer();
      return requestAnimationFrame(tick);
    }

    playerState.x = nx; playerState.y = ny; playerState.z = nz;

    // walk anim
    if (m > 0 && playerState.onGround) playerState.walkPhase += 0.3 * dt;
    playerState.squash += (1 - playerState.squash) * 0.18;

    // update player mesh
    player.position.set(playerState.x, playerState.y, playerState.z);
    player.rotation.y = playerState.facing;
    player.scale.set(1, playerState.squash, 1);
    // leg swing
    const swing = Math.sin(playerState.walkPhase) * 0.35;
    if (player.userData.legs) {
      player.userData.legs[0].rotation.x = swing;
      player.userData.legs[1].rotation.x = -swing;
      player.userData.legs[2].rotation.x = -swing;
      player.userData.legs[3].rotation.x = swing;
    }
    // bob head while walking
    if (player.userData.head) player.userData.head.position.y = 0.85 + Math.sin(playerState.walkPhase*2)*0.02;

    // coin pickup
    for (const o of levelObjects) {
      if (!o.userData.coin || o.userData.collected) continue;
      const dx=o.position.x-playerState.x, dy=o.position.y-playerState.y, dz=o.position.z-playerState.z;
      const reach = o.userData.mega ? 4.5 : 1.2;
      if (dx*dx+dy*dy+dz*dz < reach) {
        o.userData.collected = true;
        o.visible = false;
        score += o.userData.mega ? 5 : 1;
        scoreEl.textContent = String(score);
        if (o.userData.mega) {
          blip(520, 0.25, 'triangle', 0.2);
          blip(1040, 0.35, 'triangle', 0.15);
          fireConfetti(2.4);
        } else {
          blip(880 + score*40, 0.12, 'triangle', 0.12);
        }
      }
    }

    // flag check
    for (const o of levelObjects) {
      if (!o.userData.flag) continue;
      const dx=o.position.x-playerState.x, dz=o.position.z-playerState.z;
      const dy=o.position.y-playerState.y;
      if (dx*dx+dz*dz < 1.5 && Math.abs(dy) < 3) {
        triggerWin();
      }
    }

    // enemies — patrol + jump-on-to-squish
    for (const o of levelObjects) {
      if (!o.userData.enemy || !o.userData.alive) continue;
      const p = o.userData.path;
      const t = now*0.001 * p.speed * 60;
      o.position.x = p.base + Math.sin(t + p.phase) * p.range;
      o.rotation.y = Math.sin(t*1.4 + p.phase) * 0.3;
      // wobble bob
      o.userData.body.position.y = 0.55 + Math.abs(Math.sin(t*2))*0.08;
      // collision with player
      const dx = o.position.x - playerState.x;
      const dy = (o.position.y + 0.55) - playerState.y;
      const dz = o.position.z - playerState.z;
      const dist2 = dx*dx + dz*dz;
      if (dist2 < 0.9) {
        const playerBottom = playerState.y;
        const enemyTop = o.position.y + 1.0;
        // jumping ON the enemy from above (falling)
        if (playerState.vy < -0.05 && playerBottom >= enemyTop - 0.4) {
          o.userData.alive = false;
          o.userData.squishAnim = 0;
          // SNAP the capy onto the enemy so it visibly contacts before bouncing
          playerState.y = enemyTop;
          playerState.vy = JUMP_V * 0.95; // chunky bounce
          playerState.squash = 0.55;       // capy compresses on the impact
          // screen shake
          screenShake = 0.55;
          // burst of squish particles
          spawnSquishBurst(o.position.x, o.position.y + 0.5, o.position.z);
          score += 2; if (cfg.coins) scoreEl.textContent = String(score);
          // fatter squish sound: thump + splat
          blip(110, 0.18, 'sawtooth', 0.18);
          blip(520, 0.06, 'square',  0.14);
          setTimeout(() => blip(180, 0.14, 'sawtooth', 0.12), 60);
        } else if (Math.abs(dy) < 0.9) {
          // got hit — knockback + reset
          blip(120, 0.25, 'sawtooth', 0.15);
          screenShake = 0.7;
          resetPlayer();
        }
      }
    }
    // squish animation — fast flatten with overshoot, fade out
    for (const o of levelObjects) {
      if (!o.userData.enemy || o.userData.alive) continue;
      o.userData.squishAnim = (o.userData.squishAnim||0) + 0.18 * dt;
      const k = Math.min(1, o.userData.squishAnim);
      // ease: snap-flatten in first 30%, slight rebound, then settle
      const eFlat = Math.min(1, k / 0.3);
      const flatten = eFlat * eFlat * (3 - 2*eFlat); // smoothstep
      const wobble = k > 0.3 ? Math.sin((k-0.3) * 10) * 0.12 * (1 - k) : 0;
      const sx = 1 + flatten * 0.9 + wobble;
      const sy = Math.max(0.06, 1 - flatten * 0.95);
      const sz = 1 + flatten * 0.9 + wobble;
      o.scale.set(sx, sy, sz);
      // pin to ground while squishing
      o.userData.body.position.y = 0.55 * sy;
      // flash the body bright on impact
      if (o.userData.body && o.userData.body.material) {
        o.userData.body.material.emissiveIntensity = 0.85 + (1 - k) * 1.5;
      }
      // fade out the halo as it dies
      if (o.userData.halo) o.userData.halo.material.opacity = 0.55 * (1 - k);
      if (k >= 1 && o.visible) { o.visible = false; }
    }

    // fart trail emission
    if (cfg.fart && playerState.farting) {
      playerState.fartCooldown = (playerState.fartCooldown||0) - dt;
      if (playerState.fartCooldown <= 0) {
        spawnFart(playerState);
        playerState.fartCooldown = 2;
      }
    }
    // fart particle update
    for (let i = fartParticles.length - 1; i >= 0; i--) {
      const f = fartParticles[i];
      f.life -= dt;
      f.mesh.position.x += f.vx;
      f.mesh.position.y += f.vy;
      f.mesh.position.z += f.vz;
      f.vy += 0.004;
      f.mesh.scale.multiplyScalar(1.04);
      f.mesh.material.opacity = Math.max(0, f.life/30);
      if (f.life <= 0) { scene.remove(f.mesh); fartParticles.splice(i,1); }
    }
    // squish particle update
    for (let i = squishParticles.length - 1; i >= 0; i--) {
      const p = squishParticles[i];
      p.life -= dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.vy -= 0.022 * dt; // gravity
      p.mesh.rotation.x += p.vr; p.mesh.rotation.y += p.vr;
      p.mesh.material.opacity = Math.max(0, p.life / 30);
      if (p.life <= 0 || p.mesh.position.y < -2) {
        scene.remove(p.mesh); squishParticles.splice(i,1);
      }
    }
  }

  // friend wandering + bob
  for (const o of levelObjects) {
    if (!o.userData.friend) continue;
    const w = o.userData.wander;
    if (w) {
      w.timer -= dt;
      if (w.timer <= 0) {
        // pick a new wander target near home
        w.targetX = w.homeX + (Math.random()-0.5)*w.rangeX;
        w.targetZ = w.homeZ + (Math.random()-0.5)*w.rangeZ;
        // clamp to ground (z within ground width-ish)
        w.targetZ = Math.max(-5, Math.min(5, w.targetZ));
        w.timer = 80 + Math.random()*160;
      }
      const dx = w.targetX - o.position.x;
      const dz = w.targetZ - o.position.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.15) {
        const step = Math.min(d, w.speed * dt);
        o.position.x += (dx/d) * step;
        o.position.z += (dz/d) * step;
        // face direction (capy snout points local +x; rotation.y rotates +x toward -z)
        const targetFacing = Math.atan2(-dz/d, dx/d);
        // smooth rotation
        let df = targetFacing - w.facing;
        while (df > Math.PI) df -= Math.PI*2;
        while (df < -Math.PI) df += Math.PI*2;
        w.facing += df * Math.min(1, 0.15 * dt);
        o.rotation.y = w.facing;
        // walking leg swing
        w.walkPhase += 0.25 * dt;
        if (o.userData.legs) {
          const sw = Math.sin(w.walkPhase) * 0.4;
          o.userData.legs[0].rotation.x = sw;
          o.userData.legs[1].rotation.x = -sw;
          o.userData.legs[2].rotation.x = -sw;
          o.userData.legs[3].rotation.x = sw;
        }
      } else if (o.userData.legs) {
        // ease legs back to rest
        for (const l of o.userData.legs) l.rotation.x *= 0.85;
      }
      // ground bob
      o.position.y = Math.sin(now*0.002 + o.userData.bobOffset)*0.05;
      if (o.userData.head) o.userData.head.position.y = 0.85 + Math.sin(now*0.003 + o.userData.bobOffset)*0.04;
    } else {
      o.position.y = Math.sin(now*0.002 + o.userData.bobOffset)*0.05;
      if (o.userData.head) o.userData.head.position.y = 0.85 + Math.sin(now*0.003 + o.userData.bobOffset)*0.04;
    }
  }
  // dancing
  for (const c of dancingFriends) {
    const t = now*0.005 + c.userData.danceOffset;
    const baseY = c.userData.danceBaseY ?? 0.5;
    c.position.y = baseY + Math.abs(Math.sin(t))*0.7;
    c.rotation.y += 0.05;
    // squash/stretch on landing
    const sq = 1 + Math.cos(t*2) * 0.12;
    c.scale.set(1/Math.sqrt(sq), sq, 1/Math.sqrt(sq));
    // fling arms/legs if present
    if (c.userData.legs) {
      const sw = Math.sin(t*3) * 0.6;
      c.userData.legs[0].rotation.x = sw;
      c.userData.legs[1].rotation.x = -sw;
      c.userData.legs[2].rotation.x = -sw;
      c.userData.legs[3].rotation.x = sw;
    }
  }
  // coin spin
  for (const o of levelObjects) {
    if (o.userData.coin && !o.userData.collected) {
      o.rotation.y += 0.08;
      o.position.y += Math.sin(now*0.004 + o.position.x)*0.002;
    }
  }
  // flag wave (simple)
  for (const o of levelObjects) {
    if (o.userData.flag) {
      // gentle ripple — tilt cloth around the pole
      o.userData.cloth.rotation.y = Math.sin(now*0.004)*0.25;
      o.userData.cloth.scale.x = 1 + Math.sin(now*0.006)*0.04;
    }
  }
  // cloud drift
  for (const d of decor) {
    if (d.userData.drift) {
      d.position.x += d.userData.drift;
      if (d.position.x > 35) d.position.x = -35;
    }
    if (d.userData.float !== undefined) {
      d.userData.float += 0.02;
      d.position.y += Math.sin(d.userData.float) * 0.005;
      d.rotation.y += 0.01; d.rotation.x += 0.006;
    }
    if (d.userData.spin) {
      d.rotation.y += d.userData.spin;
    }
    if (d.userData.orbit) {
      const o = d.userData.orbit;
      const t = now * 0.001 * o.speed + o.phase;
      d.position.x = Math.cos(t) * o.r;
      d.position.z = -10 + Math.sin(t) * o.r * 0.4;
      d.position.y = o.y + Math.sin(t*1.4)*0.6;
      d.rotation.y = -t + Math.PI/2;
    }
    if (d.userData.junk) {
      const j = d.userData.junk;
      d.rotation.x += j.spin.x; d.rotation.y += j.spin.y; d.rotation.z += j.spin.z;
      d.position.x += j.drift;
      if (d.position.x > 35) d.position.x = -35;
    }
  }

  // camera follow
  if (cfg.capy) {
    const camTargetX = player.position.x - 10;
  const camTargetY = player.position.y + 4.5;
  const camTargetZ = player.position.z;
  camera.position.x += (camTargetX - camera.position.x) * 0.08;
  camera.position.y += (camTargetY - camera.position.y) * 0.08;
  camera.position.z += (camTargetZ - camera.position.z) * 0.08;
  // screen shake (decays each frame)
  let sx = 0, sy = 0;
  if (screenShake > 0.001) {
    sx = (Math.random() - 0.5) * screenShake;
    sy = (Math.random() - 0.5) * screenShake;
    camera.position.x += sx;
    camera.position.y += sy;
    screenShake *= Math.pow(0.86, dt);
    if (screenShake < 0.01) screenShake = 0;
  }
  camera.lookAt(player.position.x + 2, player.position.y + 0.8, player.position.z);
  } else {
    // step 0: gentle orbit of empty pastel sky
    camera.position.set(Math.cos(now*0.0003)*8, 4, Math.sin(now*0.0003)*8);
    camera.lookAt(0, 2, 0);
  }

  // title pedestal: rotate player when not started, on title
  if (!started && cfg.titleScreen) {
    player.position.set(-2, 0, 0);
    player.rotation.y = now * 0.0015;
    camera.position.set(2, 1.5, 4);
    camera.lookAt(-2, 0.8, 0);
  }

  drawConfetti();
  if (themeTween) themeTween(now);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ============== RESIZE ==============
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  fxCanvas.width = window.innerWidth; fxCanvas.height = window.innerHeight;
});

// initialize body bg + theme (instant — no tween on first paint)
setTheme(theme, true);

// ============== LEVEL SELECT (?level=N, 1-based) ==============
// Skips the title screen and starts directly on the requested level.
// Timeout ordering matters: this must run after the level2 auto-load.
const levelParam = parseInt(params.get('level') || '', 10);
if (levelParam >= 1 && levelParam <= LEVELS.length && params.get('win') !== '1') {
  titleEl.hidden = true;
  started = true;
  hud.hidden = false;
  setTimeout(() => { loadLevel(levelParam - 1, { resetScore: true }); }, 0);
}

// ============== WIN SCREEN DEMO (?win=1) ==============
// Spawns the capy on the last platform before the flag, so the win
// screen is one jump away instead of a full run through the level.
// Runs in a timeout scheduled AFTER the level2 auto-load timeout, so
// its loadLevel/resetPlayer can't clobber this spawn position.
if (params.get('win') === '1') {
  titleEl.hidden = true;
  started = true;
  hud.hidden = false;
  setTimeout(() => {
    loadLevel(0);
    // Drop in above the final approach platform ([19, 4.8, 0], oscillating
    // y ±1.2 → top peaks at 6.5) so the capy lands on it at any phase.
    playerState.x = 19; playerState.y = 6.6; playerState.z = 0;
    playerState.vx = 0; playerState.vy = 0; playerState.vz = 0;
    playerState.onGround = false;
    player.position.set(playerState.x, playerState.y, playerState.z);
  }, 0);
}
