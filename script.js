/* script.js — interactivity */
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const printBtn = $('#printBtn');
  const toTop = $('.to-top');
  const bars = $$('.bar[data-level]');
  const form = $('#contactForm');
  const status = $('#status');
  const year = $('#year');
  const themeToggle = $('#themeToggle');

  if(year) year.textContent = new Date().getFullYear();

  if (printBtn) printBtn.addEventListener('click', () => window.print());

  const applyTheme = (mode, anim=true) => {
    const html = document.documentElement;
    if (anim) html.classList.add('theme-anim');
    html.setAttribute('data-theme', mode);
    if (themeToggle) themeToggle.textContent = mode === 'dark' ? '🌙' : '☀️';
    if (anim) setTimeout(()=> html.classList.remove('theme-anim'), 500);
  };
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved, false);
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    localStorage.setItem('theme', next);
  });

  // Skill bars
  const inView = (el) => el.getBoundingClientRect().top < window.innerHeight - 80;
  const pump = () => { bars.forEach(b => {
    if (!b.dataset.started && inView(b)) {
      b.dataset.started = '1';
      const overlay = document.createElement('span');
      overlay.className = 'bar-fill';
      overlay.style.display = 'block';
      overlay.style.height = '100%';
      overlay.style.borderRadius = '999px';
      overlay.style.background = 'linear-gradient(90deg, #7aa2ff, #60a5fa)';
      overlay.style.boxShadow = '0 0 18px rgba(122,162,255,.55)';
      overlay.style.transformOrigin = 'left center';
      overlay.style.transform = 'scaleX(0)';
      overlay.style.transition = 'transform .9s ease-out';
      b.appendChild(overlay);
      requestAnimationFrame(() => {
        const level = Math.max(0, Math.min(100, parseInt(b.getAttribute('data-level')||'0',10)));
        overlay.style.transform = 'scaleX(' + (level/100) + ')';
      });
    }
  })};
  document.addEventListener('scroll', pump, {passive:true});
  window.addEventListener('load', pump);

  const showTop = () => (window.scrollY > 300 ? toTop.classList.add('show') : toTop.classList.remove('show'));
  document.addEventListener('scroll', showTop, {passive:true});
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Contact actions
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = ($('#name').value || '').trim();
    const email = ($('#email').value || '').trim();
    const message = ($('#message').value || '').trim();

    // Clear errors
    ['name','email','message'].forEach(id => {
      const el = form.querySelector('[data-for="'+id+'"]'); if (el) el.textContent = '';
    });
    let ok = true;
    if (!name){ const el = form.querySelector('[data-for="name"]'); if (el) el.textContent='Please enter your name'; ok=false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ const el=form.querySelector('[data-for="email"]'); if (el) el.textContent='Enter a valid email'; ok=false; }
    if (!message){ const el=form.querySelector('[data-for="message"]'); if (el) el.textContent='Please write a message'; ok=false; }
    if (!ok){ if (status) status.textContent='Please fix the highlighted fields.'; return; }

    const recipientEmail = "saadsherazi98@gmail.com";
    const subject = encodeURIComponent("New Contact via Portfolio");
    const body = encodeURIComponent(
`Hello Saad,

You have a new message from your portfolio.

Name: ${name}
Email: ${email}

Message:
${message}

— Sent from your Portfolio CV`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener');

    const phoneNumber = "923488799027";
    const waText = encodeURIComponent(`Hello Saad, I am ${name} (${email}).

${message}

— Sent from your Portfolio CV`);
    const waUrl = `https://wa.me/${phoneNumber}?text=${waText}`;
    window.open(waUrl, '_blank', 'noopener');

    if (status) status.textContent = "Opening Gmail and WhatsApp with your message...";
    form.reset();
    setTimeout(() => { if (status) status.textContent = ""; }, 4000);
  });
})();