/* ========================================
   UPFIGURE — main.js (Updated v2)
   ======================================== */

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
if (cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    }, 80);
  });
  document.querySelectorAll('a,button,.service-card,.why-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px'; cursor.style.height = '20px';
      cursorRing.style.width = '52px'; cursorRing.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px'; cursor.style.height = '12px';
      cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
    });
  });
}

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar && (navbar.classList.toggle('scrolled', window.scrollY > 50));
  const btn = document.getElementById('back-top');
  btn && btn.classList.toggle('show', window.scrollY > 300);
});

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── ACTIVE NAV LINK ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── LIGHT/DARK TOGGLE ── */
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeBtn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
  });
}

/* ── HERO WORD FLIP-IN ── */
function initHeroAnimation() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const words = title.querySelectorAll('.word');
  words.forEach((word, i) => {
    setTimeout(() => word.classList.add('flip-in'), 200 + i * 150);
  });
}
window.addEventListener('load', initHeroAnimation);

/* ── TYPING ANIMATION — Updated Words ── */
function initTyping() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const words = [
    'Growth Strategy',
    'Web Development',
    'AI Automation',
    'Performance Marketing',
    'Brand Identity',
    'Mobile Apps',
    'Lead Generation',
    'UI/UX Design',
    'CRM Automation',
    'Business Strategy',
    'SEO & Content',
    'AI Agents'
  ];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    let delay = deleting ? 55 : 95;
    if (!deleting && ci === word.length + 1) { delay = 1800; deleting = true; }
    if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
    setTimeout(type, delay);
  }
  type();
}
initTyping();

/* ── PARTICLE CANVAS ── */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,170,255,${this.alpha})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 120; i++) particles.push(new Particle());
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,170,255,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}
initParticles();

/* ── THREE.JS SPHERE ── */
function initThreeSphere() {
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('threejs-canvas');
  if (!container) return;
  const getSize = () => ({ w: Math.max(container.clientWidth, 1), h: Math.max(container.clientHeight, 1) });
  let { w: W, h: H } = getSize();
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.prepend(renderer.domElement);
  container.classList.add('three-ready');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.z = 4.2;
  const group = new THREE.Group();
  scene.add(group);
  const shellGeo = new THREE.IcosahedronGeometry(1.35, 4);
  const shell = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), new THREE.LineBasicMaterial({ color: 0x00AAFF, transparent: true, opacity: 0.34 }));
  group.add(shell);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 2), new THREE.MeshBasicMaterial({ color: 0x8B00FF, wireframe: true, transparent: true, opacity: 0.42 }));
  group.add(core);
  const ringMatBlue = new THREE.MeshBasicMaterial({ color: 0x00AAFF, wireframe: true, transparent: true, opacity: 0.36 });
  const ringMatPurple = new THREE.MeshBasicMaterial({ color: 0x8B00FF, wireframe: true, transparent: true, opacity: 0.34 });
  const rings = [
    new THREE.Mesh(new THREE.TorusGeometry(1.74, 0.012, 8, 160), ringMatBlue),
    new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.01, 8, 160), ringMatPurple),
    new THREE.Mesh(new THREE.TorusGeometry(2.12, 0.008, 8, 160), ringMatBlue)
  ];
  rings[0].rotation.x = Math.PI / 2.7;
  rings[1].rotation.y = Math.PI / 2.4;
  rings[2].rotation.x = Math.PI / 3.8; rings[2].rotation.y = Math.PI / 5;
  rings.forEach(r => group.add(r));
  const dotGeo = new THREE.BufferGeometry();
  const dotCount = 360;
  const positions = new Float32Array(dotCount * 3);
  for (let i = 0; i < dotCount; i++) {
    const radius = 1.55 + Math.random() * 0.85;
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0x9D19FF, size: 0.026, transparent: true, opacity: 0.9 }));
  group.add(dots);
  const beamGeo = new THREE.BufferGeometry();
  const beamPositions = [];
  for (let i = 0; i < 44; i++) {
    const a = Math.random() * Math.PI * 2;
    const b = (Math.random() - 0.5) * 1.8;
    const r = 1.85 + Math.random() * 0.55;
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.55 + b * 0.15, z = Math.sin(a) * r;
    beamPositions.push(x, y, z, x * 0.86, y * 0.86, z * 0.86);
  }
  beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(beamPositions, 3));
  const beams = new THREE.LineSegments(beamGeo, new THREE.LineBasicMaterial({ color: 0x00AAFF, transparent: true, opacity: 0.16 }));
  group.add(beams);
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.65;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.45;
  });
  function animate() {
    requestAnimationFrame(animate);
    if (container.clientWidth < 2 || container.clientHeight < 2) return;
    shell.rotation.y += 0.0036; shell.rotation.x += 0.0012;
    core.rotation.x -= 0.005; core.rotation.y += 0.007;
    dots.rotation.y -= 0.0018; beams.rotation.y += 0.0025;
    rings[0].rotation.z += 0.003; rings[1].rotation.x += 0.0022; rings[2].rotation.y -= 0.0026;
    group.rotation.x += (mouseY - group.rotation.x) * 0.025;
    group.rotation.y += (mouseX - group.rotation.y) * 0.025;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    const { w: nW, h: nH } = getSize();
    camera.aspect = nW / nH; camera.updateProjectionMatrix(); renderer.setSize(nW, nH);
  });
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initThreeSphere); }
else { initThreeSphere(); }

/* ── PARALLAX SHAPES ── */
function initParallaxShapes() {
  const shapes = document.querySelectorAll('.shape-3d');
  if (!shapes.length) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    shapes.forEach((s, i) => {
      const factor = (i + 1) * 8;
      s.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
}
initParallaxShapes();

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}
initScrollReveal();

/* ── 3D TILT ON CARDS ── */
function initTilt() {
  document.querySelectorAll('.service-card, .why-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -12, rotY = ((x - cx) / cx) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)'; });
  });
}
initTilt();

/* ── STATS COUNTER (kept for about.html compatibility) ── */
function initStats() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('flipped');
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  stats.forEach(s => observer.observe(s));
}
initStats();

/* ── REVIEWS CAROUSEL ── */
function initCarousel() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.review-card')];
  const dotsWrap = document.querySelector('.carousel-dots');
  let current = 0, perView = 1, total = 1, dots = [];
  function getPerView() { return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3; }
  function setupDots() {
    perView = getPerView(); total = Math.max(1, Math.ceil(cards.length / perView));
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.addEventListener('click', () => go(i));
      dotsWrap.appendChild(dot);
    }
    dots = [...dotsWrap.querySelectorAll('.dot')];
  }
  function getStep() {
    const carousel = document.querySelector('.reviews-carousel');
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return ((carousel?.clientWidth || track.clientWidth) + gap) / perView;
  }
  function go(idx) {
    current = (idx + total) % total;
    const offset = current * perView * getStep();
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  setupDots();
  document.getElementById('prev-review')?.addEventListener('click', () => go(current - 1));
  document.getElementById('next-review')?.addEventListener('click', () => go(current + 1));
  let auto = setInterval(() => go(current + 1), 3500);
  track.addEventListener('mouseenter', () => clearInterval(auto));
  track.addEventListener('mouseleave', () => { auto = setInterval(() => go(current + 1), 3500); });
  window.addEventListener('resize', () => { const n = getPerView(); if (n !== perView) setupDots(); go(Math.min(current, total - 1)); });
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => { const diff = startX - e.changedTouches[0].clientX; if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1); });
  go(0);
}
initCarousel();

/* ── TICKER DUPLICATE ── */
function initTicker() {
  document.querySelectorAll('.ticker-track').forEach(track => { const clone = track.innerHTML; track.innerHTML = clone + clone; });
}
initTicker();

/* ── BACK TO TOP ── */
document.getElementById('back-top')?.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* ── SMOOTH SECTION TRANSITIONS ── */
function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
  }, { threshold: 0.05 });
  sections.forEach(s => { s.style.opacity = '0'; s.style.transition = 'opacity 0.5s ease'; obs.observe(s); });
}
initSectionReveal();

/* ── PORTFOLIO FILTER ── */
function initPortfolioFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filters.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        if (show) {
          card.hidden = false;
          requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; card.style.pointerEvents = 'all'; });
        } else {
          card.style.opacity = '0'; card.style.transform = 'scale(0.92)'; card.style.pointerEvents = 'none';
          setTimeout(() => { if (btn.classList.contains('active')) card.hidden = true; }, 220);
        }
      });
    });
  });
}
initPortfolioFilter();

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

/* ================================================================
   CONTACT FORM — EmailJS Integration
   ================================================================
   SETUP STEPS (one-time, takes 5 minutes):
   1. Go to https://www.emailjs.com and create a FREE account
   2. Add Email Service: Dashboard → Email Services → Add Service → choose Gmail
      → Connect your Gmail → copy the SERVICE ID
   3. Create Template: Dashboard → Email Templates → Create New
      → Subject: "New Inquiry from {{from_name}} — Upfigure"
      → Body: paste this (or customize):
        Name: {{from_name}}
        Business: {{business_name}}
        Email: {{from_email}}
        Phone: {{phone}}
        Website: {{website}}
        Industry: {{industry}}
        Service: {{service}}
        Budget: {{budget}}
        Challenge: {{challenge}}
        Timeline: {{timeline}}
        Message: {{message}}
      → Save → copy the TEMPLATE ID
   4. Get Public Key: Dashboard → Account → General → Public Key
   5. Replace the 3 placeholders below with your real keys
   ================================================================ */

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Load EmailJS SDK dynamically
  if (!window.emailjs) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    s.onload = () => {
      if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') emailjs.init(EMAILJS_PUBLIC_KEY);
    };
    document.head.appendChild(s);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate required fields
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(f => {
      f.style.borderColor = '';
      if (!f.value.trim()) { f.style.borderColor = '#ff4444'; valid = false; }
    });
    if (!valid) {
      const firstErr = form.querySelector('[required][style*="ff4444"]');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Check if EmailJS keys are configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Demo mode — show success without actually sending
      setTimeout(() => {
        form.style.display = 'none';
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'block';
        // In production, replace the keys above and this block will be skipped
        console.log('⚠️ EmailJS keys not configured yet. See comments in main.js for setup.');
      }, 1200);
      return;
    }

    // Send via EmailJS
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        form.style.display = 'none';
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'block';
        form.reset();
      })
      .catch(err => {
        console.error('EmailJS Error:', err);
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed — Try WhatsApp';
        btn.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 3500);
      });
  });
}
initContactForm();

/* ================================================================
   CHATBOT — Human Support Feel (Updated)
   ================================================================ */
(function initChatbot() {

  const responses = {
    greet: {
      t: ['hi','hello','hey','namaste','hii','helo','hola','sup','start'],
      r: '👋 Hi there! Welcome to Upfigure.\n\nWe help businesses grow through the right combination of technology, branding, marketing and AI.\n\nWhat can I help you with today?',
      q: ['Our Services','Book a Call','View Pricing']
    },
    services: {
      t: ['service','services','what do you do','offer','work','help','capabilities'],
      r: 'We work across 5 core areas:\n\n💻 Development — Websites, apps, SaaS, e-commerce\n🎨 Design — Brand, UI/UX, video, creatives\n📊 Marketing — SEO, Google Ads, Meta Ads, social\n🚀 Growth — Lead gen, CRM, funnels, automation\n🤖 AI — Chatbots, agents, workflow automation\n\nWhich area is most relevant to your business?',
      q: ['Book a Call','View Pricing','View Portfolio']
    },
    pricing: {
      t: ['price','pricing','cost','budget','how much','rate','charge','fees','kitna','rupees','rs','invest','investment'],
      r: '💰 Starting investment:\n\n• Brand Identity: ₹3,000+\n• Business Website: ₹15,000+\n• Landing Page: ₹6,000+\n• Social Media/month: ₹8,000+\n• Performance Ads: ₹10,000+/month\n• Mobile App: ₹50,000+\n• AI Chatbot / Agent: ₹15,000+\n• CRM Setup: ₹12,000+\n\nEvery project gets a custom quote. Let\'s talk?',
      q: ['Book a Call','WhatsApp Now','Our Services']
    },
    contact: {
      t: ['contact','reach','call','whatsapp','email','phone','number','connect','talk','speak'],
      r: '📞 Reach us directly:\n\n• WhatsApp: +91 8081871440\n• Email: hello.prashantseo@gmail.com\n• Hours: Mon–Sat, 10AM – 7PM IST\n\nWe typically respond within 1 hour on WhatsApp.',
      q: ['WhatsApp Now','Book a Call','Email Us']
    },
    portfolio: {
      t: ['portfolio','work','projects','examples','samples','previous','case','built','made'],
      r: '🏆 Our work spans:\n\n• Business & corporate websites\n• E-commerce platforms\n• Brand identity systems\n• Mobile apps\n• Performance ad campaigns\n• AI automation systems\n\nCheck our Portfolio page for detailed case studies and project previews.',
      q: ['View Portfolio','Book a Call','Our Services']
    },
    timeline: {
      t: ['time','timeline','delivery','how long','days','deadline','fast','quick','turnaround','when'],
      r: '⚡ Typical delivery times:\n\n• Logo / Brand Identity: 3–5 days\n• Landing Page: 3–5 days\n• Business Website: 10–18 days\n• Mobile App: 30–60 days\n• AI Chatbot: 7–14 days\n• Ad Campaign setup: 3–5 days\n\nTimelines are confirmed after the discovery call.',
      q: ['Book a Call','Our Services','View Pricing']
    },
    about: {
      t: ['about','who','company','team','agency','founded','upfigure','background'],
      r: '🏢 About Upfigure:\n\nWe\'re a business growth partner — not just an agency.\n\nBefore we recommend anything, we understand your business, your market and your goals. Then we build the right solution.\n\n✅ Strategy-first approach\n✅ In-house team only (no outsourcing)\n✅ Technology + Branding + AI + Marketing\n✅ Long-term partnership focus',
      q: ['Our Services','Book a Call','View Portfolio']
    },
    ai: {
      t: ['ai','artificial intelligence','chatbot','agent','automation','automate','bot','workflow'],
      r: '🤖 Our AI services:\n\n• AI Chatbots for your website\n• AI Sales & Support Agents\n• AI Voice Agents\n• Workflow Automation\n• CRM Automation\n• Business Process Automation\n• AI Integration into your tools\n• WhatsApp Automation\n\nAI can save your team hours every week. Want to explore?',
      q: ['Book a Call','View Pricing','Our Services']
    },
    marketing: {
      t: ['marketing','seo','ads','google','meta','facebook','social','content','leads','lead'],
      r: '📊 Our marketing services:\n\n• SEO & Local SEO\n• Google Ads & PPC\n• Meta Ads (FB/Instagram)\n• Performance Marketing\n• Social Media Marketing\n• Content Marketing\n• Lead Generation\n• B2B Lead Generation\n• Email Marketing\n• CRO\n\nEvery campaign starts with understanding your customer, not just running ads.',
      q: ['Book a Call','View Pricing','View Portfolio']
    },
    quote: {
      t: ['quote','proposal','start','begin','project','consultation','free','discuss','discovery'],
      r: '🚀 Starting is simple:\n\n1. Book a free discovery call\n2. Tell us about your business\n3. Get a tailored strategy & proposal within 24 hrs\n4. We begin when you\'re ready\n\nNo commitment. No pressure. Just a real conversation about your growth.',
      q: ['WhatsApp Now','Book a Call','Contact Page']
    },
    quality: {
      t: ['quality','trust','reliable','safe','good','best','professional','experience'],
      r: '✅ What you can count on:\n\n• 100% in-house team — no outsourcing\n• We tell you what will work and what won\'t\n• Clear communication throughout\n• We sign NDAs before any project\n• No hidden costs — transparent pricing\n• We work until you\'re satisfied\n\nWant to see our work before deciding?',
      q: ['View Portfolio','Book a Call','Our Services']
    }
  };

  const quickActions = {
    'Our Services':  () => window.location.href = 'services.html',
    'Book a Call':   () => window.location.href = 'contact.html',
    'View Pricing':  () => { panel.classList.remove('open'); document.getElementById('chat-messages') && handleInput('pricing'); },
    'View Portfolio':() => window.location.href = 'portfolio.html',
    'WhatsApp Now':  () => window.open('https://wa.me/918081871440','_blank'),
    'Contact Page':  () => window.location.href = 'contact.html',
    'Email Us':      () => window.open('mailto:hello.prashantseo@gmail.com'),
  };

  const panel   = document.getElementById('chatbot-panel');
  const chatBtn = document.getElementById('chatbot-btn');
  const closeBtn= document.getElementById('chat-close');
  const msgArea = document.getElementById('chat-messages');
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const badge   = document.getElementById('chat-badge');
  if (!panel || !chatBtn) return;

  let history = JSON.parse(sessionStorage.getItem('uf_chat2') || '[]');

  function getTime() { return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }

  function addMsg(text, type, quickReplies) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div><div class="chat-time">${getTime()}</div>`;
    if (quickReplies && type === 'bot') {
      const qr = document.createElement('div');
      qr.className = 'chat-quick-replies';
      quickReplies.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          if (quickActions[label]) { quickActions[label](); return; }
          handleInput(label);
        });
        qr.appendChild(btn);
      });
      div.appendChild(qr);
    }
    msgArea.appendChild(div);
    msgArea.scrollTop = msgArea.scrollHeight;
    history.push({text, type});
    sessionStorage.setItem('uf_chat2', JSON.stringify(history.slice(-20)));
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'typing-indicator'; t.id = 'typing';
    t.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    msgArea.appendChild(t); msgArea.scrollTop = msgArea.scrollHeight;
    return t;
  }

  function sendBotMsg(key) {
    const data = responses[key];
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addMsg(data.r, 'bot', data.q);
    }, 700 + Math.random() * 500);
  }

  function matchResponse(text) {
    const lower = text.toLowerCase();
    for (const key in responses) {
      if (responses[key].t && responses[key].t.some(t => lower.includes(t))) return key;
    }
    return null;
  }

  function handleInput(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    if (input) input.value = '';
    const match = matchResponse(text);
    if (match) { sendBotMsg(match); }
    else {
      const typing = showTyping();
      setTimeout(() => {
        typing.remove();
        addMsg('Happy to help! You can ask me about:\n\n• Our services & capabilities\n• Pricing & investment\n• Project timelines\n• AI automation\n• How to get started\n\nOr reach us directly on WhatsApp for a faster response.', 'bot', ['Our Services','View Pricing','WhatsApp Now']);
      }, 700);
    }
  }

  chatBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      if (badge) badge.style.opacity = '0';
      if (history.length === 0) sendBotMsg('greet');
      input?.focus();
    }
  });
  closeBtn?.addEventListener('click', () => panel.classList.remove('open'));
  sendBtn?.addEventListener('click', () => handleInput(input?.value || ''));
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(input.value); });

  // Show badge after 4 seconds
  setTimeout(() => {
    if (!panel.classList.contains('open') && history.length === 0) {
      if (badge) badge.style.opacity = '1';
    }
  }, 4000);

  // Restore session history
  if (history.length > 0) {
    history.forEach(m => {
      const div = document.createElement('div');
      div.className = `chat-msg ${m.type}`;
      div.innerHTML = `<div class="chat-bubble">${m.text}</div>`;
      msgArea.appendChild(div);
    });
  }

})();