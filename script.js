// script.js — All interactions

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initPricing();
  initTestimonials();
});

/* ── Menu ─────────────────────────────────────── */
function initMenu() {
  const overlay   = document.getElementById('nav-overlay');
  const openBtn   = document.getElementById('menu-open');
  const closeBtn  = document.getElementById('menu-close');
  const closeLink = document.getElementById('nav-close-link');
  if (!overlay) return;

  const open  = () => { overlay.classList.add('open');  document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };

  openBtn  && openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  closeLink && closeLink.addEventListener('click', e => { e.preventDefault(); close(); });
  overlay.querySelectorAll('.nav-links a:not(.nav-close)').forEach(a => a.addEventListener('click', close));
}

/* ── Pricing ──────────────────────────────────── */
function initPricing() {
  const plans = {
    basic: {
      name: 'Basic', sub: 'For startups',
      monthly:   { price: '$1000', period: 'Billed monthly' },
      quarterly: { price: '$850',  period: 'Billed quarterly' },
      features: ['Custom website design','Mobile responsive','SEO setup']
    },
    pro: {
      name: 'Pro', sub: 'For proffesional sites',
      monthly:   { price: '$1500', period: 'Billed monthly' },
      quarterly: { price: '$1275', period: 'Billed quarterly' },
      features: ['Everything form basic:','Framer Development','5 - 10 pages','3 weekly syncs']
    },
    max: {
      name: 'Max', sub: 'For Enterprise sites',
      monthly:   { price: '$4000', period: 'Billed monthly' },
      quarterly: { price: '$3400', period: 'Billed quarterly' },
      features: ['Everything form basic:','Framer Development','5 - 100 pages','5 weekly syncs']
    }
  };

  let activePlan   = 'pro';
  let activePeriod = 'monthly';

  const nameEl     = document.getElementById('p-name');
  const subEl      = document.getElementById('p-sub');
  const priceEl    = document.getElementById('p-price');
  const periodEl   = document.getElementById('p-period');
  const featEl     = document.getElementById('p-features');
  const toggle     = document.getElementById('p-toggle');
  const monthlyBtn = document.getElementById('p-monthly');
  const quarterlyBtn = document.getElementById('p-quarterly');
  const ghostBasic = document.getElementById('ghost-basic');
  const ghostMax   = document.getElementById('ghost-max');

  function render() {
    const p = plans[activePlan];
    const b = p[activePeriod];
    if (nameEl)   nameEl.textContent   = p.name;
    if (subEl)    subEl.textContent    = p.sub;
    if (priceEl)  priceEl.textContent  = b.price;
    if (periodEl) periodEl.textContent = b.period;
    if (featEl)   featEl.innerHTML     = p.features.map(f => `<li>${f}</li>`).join('');

    // Ghost label states
    if (ghostBasic) ghostBasic.classList.toggle('active', activePlan === 'basic');
    if (ghostMax)   ghostMax.classList.toggle('active',   activePlan === 'max');

    // Billing toggle
    if (toggle) toggle.classList.toggle('quarterly', activePeriod === 'quarterly');
    if (monthlyBtn)   monthlyBtn.classList.toggle('active',   activePeriod === 'monthly');
    if (quarterlyBtn) quarterlyBtn.classList.toggle('active', activePeriod === 'quarterly');
  }

  ghostBasic   && ghostBasic.addEventListener('click',   () => { activePlan = 'basic'; render(); });
  ghostMax     && ghostMax.addEventListener('click',     () => { activePlan = 'max';   render(); });
  monthlyBtn   && monthlyBtn.addEventListener('click',   () => { activePeriod = 'monthly';   render(); });
  quarterlyBtn && quarterlyBtn.addEventListener('click', () => { activePeriod = 'quarterly'; render(); });

  render();
}

/* ── Testimonials ─────────────────────────────── */
function initTestimonials() {
  const slides   = document.querySelectorAll('.testi-slide');
  const prevBtn  = document.getElementById('t-prev');
  const nextBtn  = document.getElementById('t-next');
  const curLabel = document.getElementById('t-cur');
  if (!slides.length) return;
  let idx = 0;

  function show(i) {
    slides[idx].classList.remove('active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    if (curLabel) curLabel.textContent = String(idx + 1).padStart(3, '0');
  }

  prevBtn && prevBtn.addEventListener('click', () => show(idx - 1));
  nextBtn && nextBtn.addEventListener('click', () => show(idx + 1));
}

/* ── Contact form (contact.html) ──────────────── */
function initContactForm() {
  const steps = document.querySelectorAll('.form-step');
  const fill  = document.querySelector('.form-fill');
  if (!steps.length) return;
  let cur = 0;

  function goto(i) {
    steps[cur].classList.remove('active');
    cur = Math.max(0, Math.min(i, steps.length - 1));
    steps[cur].classList.add('active');
    if (fill) fill.style.width = ((cur + 1) / steps.length * 100) + '%';
  }

  document.querySelectorAll('.btn-next').forEach(b => b.addEventListener('click', () => goto(cur + 1)));
  document.querySelectorAll('.btn-prev').forEach(b => b.addEventListener('click', () => goto(cur - 1)));
  document.querySelectorAll('.form-opt').forEach(o => {
    o.addEventListener('click', () => o.classList.toggle('sel'));
  });

  const form = document.getElementById('contact-wizard');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      document.querySelector('.form-progress') && (document.querySelector('.form-progress').style.display = 'none');
      const s = document.getElementById('success-msg');
      if (s) s.style.display = 'block';
    });
  }
}

document.addEventListener('DOMContentLoaded', initContactForm);
