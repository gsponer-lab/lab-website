/* Home-page protein viewer: a lab-designed binder (orange) bound to its target, TAZ1 (blue).
   Drag or use the arrow keys to rotate. There is no zoom or pan, and the mouse wheel scrolls the page.
   Data: js/complex-data.js (made by tools/prep_complex.py). Cartoon geometry: js/cartoon.js. Needs vendor/three. */
(function () {
  'use strict';
  const host = document.getElementById('viewer');
  if (!host) return;
  const T = window.THREE, D = window.COMPLEX;
  if (!T || !D || !window.cartoonMesh) { host.innerHTML = '<div class="nogl">The 3D view could not load.</div>'; return; }

  let renderer, dirty = true, distance = 1;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (_) {
    host.innerHTML = '<div class="nogl">The 3D view needs WebGL, which this browser does not offer.</div>';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  const FOV = 28;
  const camera = new T.PerspectiveCamera(FOV, 1, 1, 2000);
  scene.add(camera);
  // lights ride with the camera, so the lighting stays put while the molecule turns
  camera.add(new T.HemisphereLight(0xffffff, 0x7d848a, 0.55));
  const key = new T.DirectionalLight(0xffffff, 0.6);
  key.position.set(-0.6, 0.8, 1);
  camera.add(key);

  // two cartoons in one frame: the target, and the binder where it sits on it. They are rebuilt on a theme change,
  // coloured from the page's CSS tokens, so the light and dark themes both work.
  const root = new T.Group();
  scene.add(root);
  let built = [];
  function recolour() {
    const css = getComputedStyle(document.documentElement);
    const v = (n) => css.getPropertyValue(n).trim();
    const palette = {
      target: { H: v('--v-target-h'), E: v('--v-target-e'), C: v('--v-target-c') },
      binder: { H: v('--v-binder-h'), E: v('--v-binder-h'), C: v('--v-binder-c') },
    };
    for (const t of built) { root.remove(t.mesh); t.dispose(); }
    built = ['target', 'binder'].map((role) => {
      const t = window.cartoonMesh(D[role], { ss: palette[role] });
      Object.assign(t.mesh.material, { roughness: 0.5, metalness: 0, side: T.DoubleSide });
      root.add(t.mesh);
      return t;
    });
    scene.fog = new T.Fog(new T.Color(v('--v-bg')), distance - R * 0.5, distance + R * 1.4);
    dirty = true;
  }

  // frame the complex
  const R = D.radius;
  function fit() {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const vfov = (FOV * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    distance = (R * 1.0) / Math.sin(Math.min(vfov, hfov) / 2);
    camera.position.set(0, 0, distance);
    camera.near = distance - R * 1.6; camera.far = distance + R * 1.6;
    camera.updateProjectionMatrix();
    if (scene.fog) { scene.fog.near = distance - R * 0.5; scene.fog.far = distance + R * 1.4; }
    dirty = true;
  }

  // rotation only: drag turns the model about the screen's axes; nothing else moves
  const quat = (axis, a) => new T.Quaternion().setFromAxisAngle(axis, a);
  const AX = new T.Vector3(1, 0, 0), AY = new T.Vector3(0, 1, 0);
  const turn = (dx, dy) => { root.quaternion.premultiply(quat(AY, dx)).premultiply(quat(AX, dy)); dirty = true; };
  let dragging = false, last = null, idleSince = performance.now(), hinted = false, visible = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // a pleasing start orientation: binder toward the viewer, tilted a little
  root.quaternion.premultiply(quat(AX, -0.5)).premultiply(quat(AY, -0.6));

  const hint = document.getElementById('viewer-hint');
  const hideHint = () => { if (!hinted) { hinted = true; if (hint) hint.classList.add('gone'); } };
  host.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true; last = [e.clientX, e.clientY];
    host.setPointerCapture(e.pointerId); hideHint();
  });
  host.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const k = 0.0085;
    turn((e.clientX - last[0]) * k, (e.clientY - last[1]) * k);
    last = [e.clientX, e.clientY];
  });
  const release = () => { dragging = false; idleSince = performance.now(); };
  host.addEventListener('pointerup', release);
  host.addEventListener('pointercancel', release);
  host.addEventListener('keydown', (e) => {
    const k = 0.12, m = { ArrowLeft: [-k, 0], ArrowRight: [k, 0], ArrowUp: [0, -k], ArrowDown: [0, k] }[e.key];
    if (!m) return;
    e.preventDefault(); turn(m[0], m[1]); hideHint(); idleSince = performance.now();
  });

  // slow spin until you touch it; it carries on 2.5 s after you let go
  let prev = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prev) / 1000); prev = now;
    if (!visible || document.hidden) return;
    if (!reduced && !dragging && now - idleSince > (hinted ? 2500 : 0)) turn(dt * 0.22, 0);
    if (dirty) { dirty = false; renderer.render(scene, camera); }
  }

  new ResizeObserver(() => { if (host.clientWidth) fit(); }).observe(host);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(host);
  window.addEventListener('themechange', recolour);
  fit(); recolour();
  requestAnimationFrame(frame);
})();
