// ── Background drops ──
(function(){
  const c=document.getElementById('bgDrops');
  if(!c) return;
  for(let i=0;i<20;i++){
    const s=document.createElement('span');
    s.style.left=Math.random()*100+'%';
    s.style.animationDuration=(8+Math.random()*12)+'s';
    s.style.animationDelay=(-Math.random()*20)+'s';
    s.style.width=(6+Math.random()*8)+'px';
    s.style.height=(10+Math.random()*10)+'px';
    c.appendChild(s);
  }
})();

// ── Nav scroll ──
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('mainNav');
  if(nav) nav.classList.toggle('scrolled',window.scrollY>60);
});

// ── Scroll reveal ──
const ro=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible')}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>ro.observe(el));

// ── Animated counters (both main and hotel KPIs) ──
function animateCounter(el){
  if(el.dataset.done) return;
  el.dataset.done='1';
  const target=+el.dataset.target;
  const text=el.textContent;
  const suffix=text.includes('%')?'%':text.includes('\u20AC')?' \u20AC':'';
  const duration=2000;
  const start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-p,4);
    const v=Math.round(target*eased);
    el.textContent=v.toLocaleString('es-ES')+suffix;
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) animateCounter(e.target);
  });
},{threshold:0.5});

document.querySelectorAll('.counter-num[data-target],.hotel-kpi-num[data-target]').forEach(c=>counterObserver.observe(c));

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded','false');
    });
    if(!open){
      item.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    }
  });
});

// ── Mobile nav toggle ──
const navToggle=document.getElementById('navToggle');
const navLinks=document.getElementById('navLinks');
if(navToggle&&navLinks){
  navToggle.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded',open);
    navToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  });
  navLinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded','false');
      navToggle.setAttribute('aria-label','Abrir menú');
    });
  });
}

// ── Contact modal ──
const modal=document.getElementById('contactModal');
const openBtn=document.getElementById('openContactModal');
const closeBtn=document.getElementById('closeContactModal');
const copyBtn=document.getElementById('copyEmailBtn');
const emailEl=document.getElementById('contactEmail');

if(openBtn&&modal){
  openBtn.addEventListener('click',()=>{
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    closeBtn.focus();
  });
  closeBtn.addEventListener('click',()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    openBtn.focus();
  });
  modal.addEventListener('click',(e)=>{
    if(e.target===modal){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
    }
  });
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&modal.classList.contains('open')){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      openBtn.focus();
    }
  });
}
if(copyBtn&&emailEl){
  copyBtn.addEventListener('click',()=>{
    navigator.clipboard.writeText(emailEl.textContent).then(()=>{
      copyBtn.classList.add('copied');
      copyBtn.querySelector('.copy-text').textContent='Copiado';
      setTimeout(()=>{
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.copy-text').textContent='Copiar';
      },2000);
    });
  });
}

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});
