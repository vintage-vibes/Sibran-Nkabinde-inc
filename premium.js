/* premium.js — load AFTER script.js and three.js (r128) */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------- inject new sections (outside pinned wrappers) ---------- */
  var practice = $('#practice'), contact = $('#contact');
  var word = 'PRECISION · DISCRETION · ADVOCACY · ';
  if (practice) practice.insertAdjacentHTML('afterend',
    '<div class="mq" aria-hidden="true"><div class="mq-t">' + word + word + word + word + '</div></div>');
  if (contact) contact.insertAdjacentHTML('beforebegin',
    '<section id="ends" class="ends"><div><h2><span class="strike">Uncertainty</span><br><em>ends here.</em></h2>' +
    '<p>Clarity on your position, your options and your next step, before the stakes get higher.</p></div>' +
    '<div class="ends-stage">' +
    '<figure class="ep"><img src="images/law.1.jpeg" alt="" loading="lazy"></figure>' +
    '<figure class="ep"><img src="images/law.3.jpeg" alt="" loading="lazy"></figure>' +
    '<figure class="ep"><img src="images/law.6.jpeg" alt="" loading="lazy"></figure></div></section>');

  if (!reduce) {
    /* ---------- marquee drifts with scroll and skews with speed ---------- */
    if ($('.mq-t')) {
      gsap.to('.mq-t', { xPercent: -35, ease: 'none',
        scrollTrigger: { trigger: '.mq', start: 'top bottom', end: 'bottom top', scrub: true } });
      var skew = gsap.quickTo('.mq-t', 'skewX', { duration: .4, ease: 'power3' });
      ScrollTrigger.create({ onUpdate: function (s) { skew(gsap.utils.clamp(-8, 8, s.getVelocity() / -300)); } });
      ScrollTrigger.addEventListener('scrollEnd', function () { skew(0); });
    }

    /* ---------- "Uncertainty" is struck out, panels fan in from depth ---------- */
    gsap.fromTo('.strike', { '--s': 0 }, { '--s': 1, ease: 'none',
      scrollTrigger: { trigger: '#ends', start: 'top 60%', end: 'top 20%', scrub: true } });
    gsap.fromTo('.ep', { rotationY: function (i) { return [32, 0, -32][i]; }, z: -220, y: 80, autoAlpha: .2, transformPerspective: 1100 },
      { rotationY: 0, z: 0, y: 0, autoAlpha: 1, stagger: .1, ease: 'none',
        scrollTrigger: { trigger: '.ends-stage', start: 'top 92%', end: 'top 35%', scrub: true } });

    /* ---------- headings tip up out of depth ---------- */
    $$('section h2').forEach(function (h) {
      if (h.closest('#philosophy, #why, #ends')) return;
      gsap.from(h, { rotationX: -55, z: -120, transformOrigin: '50% 100%', transformPerspective: 900, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    });

    /* ---------- cards swing in with perspective ---------- */
    var cards = '.fact-card,.team-card';
    gsap.set(cards, { autoAlpha: 0 });
    ScrollTrigger.batch(cards, { start: 'top 90%', once: true, onEnter: function (b) {
      gsap.fromTo(b, { rotationX: 28, z: -160, y: 50, autoAlpha: 0, transformPerspective: 1000, transformOrigin: '50% 100%' },
        { rotationX: 0, z: 0, y: 0, autoAlpha: 1, duration: 1, stagger: .12, ease: 'power3.out' });
    } });
  }

  if (fine && !reduce) {
    /* ---------- hero image follows the pointer in 3D ---------- */
    var stage = $('.stage'), home = $('#home');
    if (stage && home) {
      gsap.set(stage, { transformPerspective: 1200 });
      var sx = gsap.quickTo(stage, 'rotationX', { duration: .9, ease: 'power3' });
      var sy = gsap.quickTo(stage, 'rotationY', { duration: .9, ease: 'power3' });
      home.addEventListener('mousemove', function (e) {
        sy((e.clientX / innerWidth - .5) * 6);
        sx(-(e.clientY / innerHeight - .5) * 5);
      });
    }

    /* ---------- tilt + glare on cards ---------- */
    $$('.image-container,.team-image,.fact-card,.contact-form-wrap,.about-image-frame').forEach(function (el) {
      var g = document.createElement('i'); g.className = 'glare'; el.appendChild(g);
      gsap.set(el, { transformPerspective: 900 });
      var rx = gsap.quickTo(el, 'rotationX', { duration: .5, ease: 'power3' });
      var ry = gsap.quickTo(el, 'rotationY', { duration: .5, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        ry((x - .5) * 10); rx(-(y - .5) * 10);
        g.style.setProperty('--mx', x * 100 + '%'); g.style.setProperty('--my', y * 100 + '%');
      });
      el.addEventListener('pointerleave', function () { rx(0); ry(0); });
    });
  }

  /* ---------- real 3D: scales of justice that turn as the reasons change ---------- */
  var why = $('#why');
  if (why && window.THREE) {
    try {
      var cv = document.createElement('canvas'); cv.className = 'why-cv'; cv.setAttribute('aria-hidden', 'true');
      why.insertBefore(cv, why.firstChild);
      var R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      R.setPixelRatio(Math.min(devicePixelRatio, 2));
      var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(36, 1, .1, 100);
      C.position.set(0, .8, 15); C.lookAt(0, .2, 0);
      S.add(new THREE.AmbientLight(0xffffff, .65));
      var key = new THREE.DirectionalLight(0xeaf1eb, 1.4); key.position.set(5, 7, 6); S.add(key);
      var rim = new THREE.PointLight(0xa9c9b3, 1.8, 40); rim.position.set(-6, 2, -4); S.add(rim);

      var mat = new THREE.MeshStandardMaterial({ color: 0xc8cdca, metalness: .8, roughness: .28 });
      var G = new THREE.Group(); S.add(G);
      var mesh = function (geo, y, parent) { var m = new THREE.Mesh(geo, mat); m.position.y = y; (parent || G).add(m); return m; };
      mesh(new THREE.CylinderGeometry(1.5, 1.8, .3, 48), -2.85);
      mesh(new THREE.CylinderGeometry(1, 1.2, .25, 48), -2.58);
      mesh(new THREE.CylinderGeometry(.13, .2, 5.2, 24), 0);
      mesh(new THREE.SphereGeometry(.24, 32, 16), 2.85);
      var beam = new THREE.Group(); beam.position.y = 2.6; G.add(beam);
      mesh(new THREE.BoxGeometry(5.2, .12, .12), 0, beam);
      var pans = [], lineMat = new THREE.LineBasicMaterial({ color: 0xa9c9b3 });
      [-2.5, 2.5].forEach(function (x) {
        var p = new THREE.Group(); p.position.x = x; beam.add(p); pans.push(p);
        mesh(new THREE.CylinderGeometry(.9, .55, .12, 48), -1.9, p);
        for (var i = 0; i < 3; i++) {
          var a = i / 3 * Math.PI * 2;
          p.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * .85, -1.9, Math.sin(a) * .85)]), lineMat));
        }
      });

      var fit = function () {
        var w = why.clientWidth, h = why.clientHeight, wide = w > 1000;
        R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix();
        G.position.x = wide ? 4.4 : 0; G.scale.setScalar(wide ? .85 : .6);
      };
      fit(); addEventListener('resize', fit); addEventListener('load', fit);

      var st = { rot: 0, tilt: 0 }, tgt = { rot: 0, tilt: 0 }, vis = false, tilts = [.16, -.12, .1, -.06];
      ScrollTrigger.create({ trigger: why, start: 'top bottom', end: '+=400%', onToggle: function (s) { vis = s.isActive; } });
      ScrollTrigger.create({ trigger: why, start: 'top top', end: '+=300%', onUpdate: function (s) {
        tgt.rot = s.progress * Math.PI * 2;
        tgt.tilt = tilts[Math.min(3, Math.floor(s.progress * 4))];
      } });
      (function tick(t) {
        requestAnimationFrame(tick);
        if (!vis) return;
        st.rot += (tgt.rot - st.rot) * .08; st.tilt += (tgt.tilt - st.tilt) * .06;
        G.rotation.y = st.rot;
        G.position.y = -.4 + (reduce ? 0 : Math.sin(t / 900) * .08);
        beam.rotation.z = st.tilt;
        pans.forEach(function (p) { p.rotation.z = -st.tilt; });
        R.render(S, C);
      })(0);
    } catch (e) { /* no WebGL: the section still works without the model */ }
  }

  addEventListener('load', function () { ScrollTrigger.refresh(); });
  ScrollTrigger.refresh();
})();
