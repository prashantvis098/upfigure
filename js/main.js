/* ========================================
   UPFIGURE — main.js
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
  // Back to top
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

/* ── TYPING ANIMATION ── */
function initTyping() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const words = ['Design', 'Development', 'Marketing', 'Photography', 'Branding'];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    let delay = deleting ? 60 : 100;
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

  const getSize = () => ({
    w: Math.max(container.clientWidth, 1),
    h: Math.max(container.clientHeight, 1)
  });
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
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(shellGeo),
    new THREE.LineBasicMaterial({ color: 0x00AAFF, transparent: true, opacity: 0.34 })
  );
  group.add(shell);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 2),
    new THREE.MeshBasicMaterial({ color: 0x8B00FF, wireframe: true, transparent: true, opacity: 0.42 })
  );
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
  rings[2].rotation.x = Math.PI / 3.8;
  rings[2].rotation.y = Math.PI / 5;
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
  const dots = new THREE.Points(
    dotGeo,
    new THREE.PointsMaterial({ color: 0x9D19FF, size: 0.026, transparent: true, opacity: 0.9 })
  );
  group.add(dots);

  const beamGeo = new THREE.BufferGeometry();
  const beamPositions = [];
  for (let i = 0; i < 44; i++) {
    const a = Math.random() * Math.PI * 2;
    const b = (Math.random() - 0.5) * 1.8;
    const r = 1.85 + Math.random() * 0.55;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * 0.55 + b * 0.15;
    const z = Math.sin(a) * r;
    beamPositions.push(x, y, z, x * 0.86, y * 0.86, z * 0.86);
  }
  beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(beamPositions, 3));
  const beams = new THREE.LineSegments(
    beamGeo,
    new THREE.LineBasicMaterial({ color: 0x00AAFF, transparent: true, opacity: 0.16 })
  );
  group.add(beams);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.65;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.45;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (container.clientWidth < 2 || container.clientHeight < 2) return;
    shell.rotation.y += 0.0036;
    shell.rotation.x += 0.0012;
    core.rotation.x -= 0.005;
    core.rotation.y += 0.007;
    dots.rotation.y -= 0.0018;
    beams.rotation.y += 0.0025;
    rings[0].rotation.z += 0.003;
    rings[1].rotation.x += 0.0022;
    rings[2].rotation.y -= 0.0026;
    group.rotation.x += (mouseY - group.rotation.x) * 0.025;
    group.rotation.y += (mouseX - group.rotation.y) * 0.025;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const { w: nW, h: nH } = getSize();
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThreeSphere);
} else { initThreeSphere(); }

/* ── FLOATING 3D SHAPES PARALLAX ── */
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

/* ── SCROLL REVEAL (Intersection Observer) ── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}
initScrollReveal();

/* ── 3D TILT ON SERVICE CARDS ── */
function initTilt() {
  document.querySelectorAll('.service-card, .why-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -12;
      const rotY = ((x - cx) / cx) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}
initTilt();

/* ── ANIMATED STATS COUNTER ── */
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
  let current = 0;
  let perView = 1;
  let total = 1;
  let dots = [];

  function getPerView() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function setupDots() {
    perView = getPerView();
    total = Math.max(1, Math.ceil(cards.length / perView));
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
  window.addEventListener('resize', () => {
    const nextPerView = getPerView();
    if (nextPerView !== perView) setupDots();
    go(Math.min(current, total - 1));
  });
  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
  });
  go(0);
}
initCarousel();

/* ── TICKER DUPLICATE ── */
function initTicker() {
  document.querySelectorAll('.ticker-track').forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  });
}
initTicker();

/* ── CLIENTS MARQUEE DUPLICATE ── */
function initClientsMarquee() {
  document.querySelectorAll('.clients-row').forEach(row => {
    row.innerHTML = row.innerHTML + row.innerHTML;
  });
}
initClientsMarquee();

/* ── BACK TO TOP ── */
document.getElementById('back-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── AI CHATBOT ── */
(function initChatbot() {
  const responses = {
    greet: {
      t: ['hi','hello','hey','namaste','hii','helo','hola','sup'],
      r: '👋 Hello! Welcome to Upfigure!\n\nI\'m your AI assistant. How can I help you today?\n\nYou can ask me about:\n• Our Services\n• Pricing & Packages\n• Portfolio & Work\n• Timeline & Delivery\n• How to get started',
      q: ['See Services','Check Pricing','View Portfolio']
    },
    services: {
      t: ['service','services','what do you do','offer','work','help'],
      r: '🎯 Upfigure offers 12 premium services:\n\n🎨 Graphics Design\n🎬 Video Editing\n🎥 Cinematography\n📸 Photography\n💻 Website Design & Dev\n📱 App Design & Dev\n📣 Social Media\n📊 Performance Marketing\n🚀 Landing Pages\n\nWhich service interests you?',
      q: ['Check Pricing','Get a Quote','Contact Us']
    },
    pricing: {
      t: ['price','pricing','cost','budget','how much','rate','charge','fees','kitna','rupees','rs'],
      r: '💰 Our starting prices:\n\n• Logo Design: ₹2,999+\n• Website: ₹15,000+\n• Social Media/month: ₹8,000+\n• Video Editing: ₹3,000+\n• App Development: ₹50,000+\n• Landing Page: ₹5,000+\n• Performance Ads: ₹10,000+/month\n\nFor exact quote, WhatsApp us! 👇',
      q: ['WhatsApp Now','Get Quote','See Services']
    },
    contact: {
      t: ['contact','reach','call','whatsapp','email','phone','number','address'],
      r: '📞 Contact Upfigure:\n\n• WhatsApp: +91 8081871440\n• Email: hello.prashantseo@gmail.com\n• Location: Gurugram, Haryana\n• Hours: Mon-Sat, 10AM - 7PM\n\nWe reply within 1 hour! 🚀',
      q: ['WhatsApp Now','Email Us','View Location']
    },
    portfolio: {
      t: ['portfolio','work','projects','examples','samples','previous','case'],
      r: '🏆 Our Portfolio Highlights:\n\n• 80+ Projects Completed\n• 30+ Happy Clients\n• Industries: Tech, Fashion, Real Estate, F&B, EdTech, D2C\n\nCheck our Portfolio page for detailed case studies!',
      q: ['View Portfolio','Get a Quote','See Services']
    },
    timeline: {
      t: ['time','timeline','delivery','how long','days','deadline','fast','quick','turnaround'],
      r: '⚡ Delivery Timelines:\n\n• Logo Design: 2-3 days\n• Social Media Posts: Same day\n• Website: 7-14 days\n• Video Editing: 2-4 days\n• App Development: 30-60 days\n• Landing Page: 3-5 days\n\nWe are known for FAST delivery!',
      q: ['Get a Quote','WhatsApp Now','See Services']
    },
    about: {
      t: ['about','who','company','team','agency','founded','upfigure'],
      r: '🏢 About Upfigure:\n\nFull-service creative agency based in Gurugram, helping brands grow through design, tech & marketing.\n\n✅ In-House Team (zero outsourcing)\n✅ 80+ Projects Done\n✅ 30+ Happy Clients\n✅ 4.9 ⭐ Google Rating\n✅ 12 Services, One Roof',
      q: ['Our Services','View Portfolio','Contact Us']
    },
    quality: {
      t: ['quality','good','best','trusted','rating','review','google','stars'],
      r: '⭐⭐⭐⭐⭐ Our Track Record:\n\n• 4.9 Google Rating\n• 50+ Verified Reviews\n• 100% Client Satisfaction\n• Zero outsourcing — in-house team only\n• We\'ve worked with 30+ brands across India',
      q: ['See Reviews','View Portfolio','Get a Quote']
    },
    quote: {
      t: ['quote','proposal','start','begin','hire','project','consultation','free'],
      r: '🚀 Start Your Project:\n\n1. WhatsApp us: +91 8081871440\n2. Share your requirements\n3. Get FREE consultation\n4. Receive detailed proposal within 24 hrs\n5. Project kicks off!\n\nNo commitment required for consultation!',
      q: ['WhatsApp Now','Contact Page','See Services']
    }
  };

  const quickActions = {
    'See Services': () => window.location.href = 'services.html',
    'Check Pricing': () => sendBotMsg('pricing'),
    'View Portfolio': () => window.location.href = 'portfolio.html',
    'Get a Quote': () => window.location.href = 'contact.html',
    'Get a quote': () => window.location.href = 'contact.html',
    'WhatsApp Now': () => window.open('https://wa.me/918081871440','_blank'),
    'Contact Us': () => window.location.href = 'contact.html',
    'Contact Page': () => window.location.href = 'contact.html',
    'Email Us': () => window.open('mailto:hello.prashantseo@gmail.com'),
    'See Reviews': () => document.getElementById('reviews')?.scrollIntoView({behavior:'smooth'}),
    'See services': () => window.location.href = 'services.html',
  };

  const panel = document.getElementById('chatbot-panel');
  const chatBtn = document.getElementById('chatbot-btn');
  const closeBtn = document.getElementById('chat-close');
  const msgArea = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const badge = document.getElementById('chat-badge');
  if (!panel || !chatBtn) return;

  let history = JSON.parse(sessionStorage.getItem('uf_chat') || '[]');

  function getTime() {
    return new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'});
  }

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
    history.push({text, type}); sessionStorage.setItem('uf_chat', JSON.stringify(history.slice(-20)));
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
    }, 800 + Math.random() * 400);
  }

  function matchResponse(text) {
    const lower = text.toLowerCase();
    for (const key in responses) {
      if (responses[key].t && responses[key].t.some(t => lower.includes(t))) {
        return key;
      }
    }
    return null;
  }

  function handleInput(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    if (input) input.value = '';
    const match = matchResponse(text);
    if (match) {
      sendBotMsg(match);
    } else {
      const typing = showTyping();
      setTimeout(() => {
        typing.remove();
        addMsg('🤔 I didn\'t quite get that. You can ask me about:\n\n• Services • Pricing • Portfolio\n• Timeline • Contact • Quote\n\nOr WhatsApp us: +91 8081871440', 'bot', ['See Services', 'Check Pricing', 'WhatsApp Now']);
      }, 700);
    }
  }

  chatBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      badge && (badge.style.opacity = '0');
      if (history.length === 0) sendBotMsg('greet');
      input?.focus();
    }
  });
  closeBtn?.addEventListener('click', () => panel.classList.remove('open'));
  sendBtn?.addEventListener('click', () => handleInput(input?.value || ''));
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(input.value); });

  // Auto-greet badge after 3s
  setTimeout(() => {
    if (!panel.classList.contains('open') && history.length === 0) {
      badge && (badge.style.opacity = '1');
    }
  }, 3000);

  // Restore history
  if (history.length > 0) {
    history.forEach(m => {
      const div = document.createElement('div');
      div.className = `chat-msg ${m.type}`;
      div.innerHTML = `<div class="chat-bubble">${m.text}</div>`;
      msgArea.appendChild(div);
    });
  }
})();

/* ── PORTFOLIO FILTER (portfolio.html) ── */
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
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.pointerEvents = 'all';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            if (btn.classList.contains('active')) card.hidden = true;
          }, 220);
        }
      });
    });
  });
}
initPortfolioFilter();

/* ── CONTACT FORM ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    const fields = form.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(f => {
      f.style.borderColor = '';
      if (!f.value.trim()) { f.style.borderColor = '#ff4444'; valid = false; }
    });
    if (!valid) { e.preventDefault(); return; }
    // Netlify handles submission; show success msg
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = '✅ Sending...'; btn.disabled = true; }
  });
}
initContactForm();

/* ── SMOOTH SECTION TRANSITIONS ── */
function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
  }, {threshold: 0.05});
  sections.forEach(s => { s.style.opacity = '0'; s.style.transition = 'opacity 0.5s ease'; obs.observe(s); });
}
initSectionReveal();
