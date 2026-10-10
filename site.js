(() => {
'use strict';
const content=window.SITE_TEXTOS;
const dictionary={pt:{contact:'CONTATO',sales:'VENDAS',more:'Leia mais',bookMore:'Conheça o livro',editions:'EDIÇÕES',book:'LIVRO',soon:'Em breve.',close:'Fechar',author:'G. Seewald',press:'PRESS',soon2:'SEEWALD — Volume II',soon3:'SEEWALD — Volume III'},de:{contact:'KONTAKT',sales:'VERKAUF',more:'Mehr erfahren',bookMore:'Über das Buch',editions:'AUSGABEN',book:'BUCH',soon:'Demnächst.',close:'Schließen',author:'G. Seewald',press:'PRESS',soon2:'SEEWALD — Band II',soon3:'SEEWALD — Band III'},en:{contact:'CONTACT',sales:'SALES',more:'Read more',bookMore:'About the book',editions:'EDITIONS',book:'BOOK',soon:'Coming soon.',close:'Close',author:'G. Seewald',press:'PRESS',soon2:'SEEWALD — Volume II',soon3:'SEEWALD — Volume III'}};
const taglines={pt:'Entre a memória e a história, o território da ficção.',de:'Zwischen Erinnerung und Geschichte liegt das Reich der Fiktion.',en:'Between memory and history lies the realm of fiction.'};
const images={improvavel:{pt:'IMP_PT.png',de:'IMP_DE.png',en:'IMP_EN.png'},seewald:{pt:'V1_SEE_PT.png',de:'V1_SEE_DE.png',en:'V1_SEE_EN.png'}};
const coverHome={improvavel:{pt:'LIVRO_1.png',de:'LIVRO_7.png',en:'LIVRO_8.png'},seewald:{pt:'LIVRO_2.png',de:'LIVRO_3.png',en:'LIVRO_4.png'}};
const $=s=>document.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const parseUrl=()=>{const q=new URLSearchParams(location.search);const seg=location.pathname.split('/').filter(Boolean);let lang=q.get('lang')||seg.find(x=>['pt','de','en'].includes(x))||'pt';if(!dictionary[lang])lang='pt';const modal=q.get('modal')||seg.find(x=>['author','improvavel','seewald','press','contact','sales','soon2','soon3'].includes(x));return {lang,modal};};
let {lang,modal:initialModal}=parseUrl(),activeModal=null,priorFocus=null;
function render(){const d=dictionary[lang];document.documentElement.lang={pt:'pt-BR',de:'de',en:'en'}[lang];document.title='G. Seewald — '+(lang==='pt'?'Autor':lang==='de'?'Schriftsteller':'Author');$('#contact-link').textContent=d.contact;$('#sales-link').textContent=d.sales;$('#tagline').textContent=taglines[lang];$('#bio-short').innerHTML=content.intro[lang].map(p).join('');$('#read-more').innerHTML=esc(d.more)+' ↗';$('#book1-title').textContent=content.book1[lang].title;$('#book2-title').textContent=content.book2[lang].title;$('#book1-copy').innerHTML=content.book1[lang].paragraphs.map(p).join('');$('#book2-copy').innerHTML=`<p class="book-subtitle">${esc(content.book2[lang].subtitle)}</p>`+content.book2[lang].paragraphs.map(p).join('');$('#book1-image').src='assets/'+coverHome.improvavel[lang];$('#book2-image').src='assets/'+coverHome.seewald[lang];$('#book1-more').textContent=d.bookMore+' ↗';$('#book2-more').textContent=d.bookMore+' ↗';$('#editions-label').textContent=d.editions;$('#modal-close').setAttribute('aria-label',d.close);document.querySelectorAll('[data-lang]').forEach(a=>{a.setAttribute('href','?lang='+a.dataset.lang+(activeModal?'&modal='+activeModal:''));if(a.dataset.lang===lang)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});if(activeModal)renderModal(activeModal);}
function renderModal(id,edition){const d=dictionary[lang];let title='',html='';if(id==='author'){title=d.author;html='<div class="author-text">'+content.author[lang].map(p).join('')+'</div>';}else if(id==='improvavel'||id==='seewald'){const item=content[id][lang];const coverLanguage=edition||lang;title=id==='improvavel'?({pt:'Improvável',de:'Unwahrscheinlich',en:'Improbable'}[lang]):'SEEWALD — '+content.book2[lang].title.replace(/^Seewald\s*[-–—]\s*/i,'');html=`<div class="modal-book"><img class="modal-cover" src="assets/${images[id][coverLanguage]}" alt="${esc(title)}"><div class="modal-body"><div class="questions">${item.questions.map(p).join('')}</div><p class="thesis">${esc(item.thesis)}</p><p class="subtitle">${esc(item.subtitle)}</p><h3>${id==='improvavel'?({pt:'FICHA TÉCNICA',de:'BUCHANGABEN',en:'BOOK CREDITS'}[lang]):({pt:'FICHA TÉCNICA',de:'BUCHANGABEN',en:'BOOK CREDITS'}[lang])}</h3><div class="credits">${item.credits.map(c=>{const i=c.indexOf(':');return i<0?`<div>${esc(c)}</div>`:`<div><strong>${esc(c.slice(0,i+1))}</strong>${esc(c.slice(i+1))}</div>`}).join('')}</div>${item.paragraphs.map(p).join('')}</div></div>`;}else if(id==='soon2'||id==='soon3'){
 const raw=content.futureVolumes[id][lang];
 const blocks=raw.trim().split(/\n\s*\n/);
 const heading=blocks.shift().replace(/^##\s*/, '');
 title=heading;
 const formatInline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
 html=`<div class="modal-book future-volume"><img class="modal-cover" src="assets/${id==='soon2'?'V2_3D_SEE_PT.png':'V3_3D_SEE_PT.png'}" alt="${esc(heading)}"><div class="modal-body future-volume-copy">${blocks.map(b=>`<p>${formatInline(b)}</p>`).join('')}</div></div>`;
 }else if(id==='press'){
 title='PRESS';
 const raw=content.press[lang];
 const formatInline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
 const sections=raw.trim().split(/\n\s*\n/);
 html='<div class="press-copy">'+sections.map(block=>{
  const lines=block.split('\n');
  if(lines.length===1 && /^#{1,3}\s/.test(block)){
   const level=block.match(/^#+/)[0].length;
   return `<h${Math.min(level+1,4)}>${formatInline(block.replace(/^#+\s*/,''))}</h${Math.min(level+1,4)}>`;
  }
  if(lines.length>1)return `<p>${lines.map(formatInline).join('<br>')}</p>`;
  return `<p>${formatInline(block)}</p>`;
 }).join('')+'</div>';
 }else if(id==='contact'){title=d.contact;html='<div class="simple-modal"><a href="mailto:contato@gseewald.com">contato@gseewald.com</a></div>';}else{title=id==='press'?'PRESS':id==='sales'?d.sales:d[id]||'SEEWALD';html=`<div class="simple-modal"><p>${esc(d.soon)}</p></div>`;}$('#modal-title').textContent=title;$('#modal-content').innerHTML=html;$('#modal-content').scrollTop=0;}
function setUrl(modal,replace=false){const u=new URL(location.href);u.searchParams.set('lang',lang);if(modal)u.searchParams.set('modal',modal);else u.searchParams.delete('modal');history[replace?'replaceState':'pushState']({modal,lang},'',u.pathname+u.search+u.hash);}
function openModal(id,edition,updateHistory=true){if(!$('#overlay').hidden&&activeModal===id&&!edition)return;priorFocus=document.activeElement;activeModal=id;renderModal(id,edition);$('#overlay').hidden=false;document.body.classList.add('overlay-open');$('#modal-close').focus();if(updateHistory)setUrl(id);}
function closeModal(updateHistory=true){if(!activeModal)return;activeModal=null;$('#overlay').hidden=true;document.body.classList.remove('overlay-open');if(updateHistory)setUrl(null);priorFocus?.focus?.();}
document.querySelectorAll('[data-modal]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.modal,el.dataset.edition)));
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();lang=el.dataset.lang;setUrl(activeModal);render();}));
$('#modal-close').addEventListener('click',()=>closeModal());$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeModal();});document.addEventListener('keydown',e=>{if(!activeModal)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){const elements=[...$('#overlay').querySelectorAll('button,a[href],input,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled);if(!elements.length)return;const first=elements[0],last=elements[elements.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.addEventListener('popstate',()=>{const state=parseUrl();lang=state.lang;render();if(state.modal)openModal(state.modal,null,false);else closeModal(false);});$('#year').textContent=new Date().getFullYear();render();if(initialModal)openModal(initialModal,null,false);
})();
