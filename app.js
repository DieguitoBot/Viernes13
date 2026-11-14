const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let letterTimer;
function petals(count=22){
  if(reducedMotion.matches)return;
  const host=$('petals');
  for(let i=0;i<count;i++){
    const p=document.createElement('span');p.className='petal';
    p.style.setProperty('--x',`${Math.random()*100}%`);p.style.setProperty('--s',`${10+Math.random()*15}px`);
    p.style.setProperty('--c',['#b82548','#db8098','#e5a6b4','#ab647c'][i%4]);
    p.style.setProperty('--d',`${3.5+Math.random()*3}s`);p.style.setProperty('--delay',`${Math.random()*.8}s`);
    p.style.setProperty('--drift',`${Math.random()*200-100}px`);p.style.setProperty('--r',`${Math.random()*500-250}deg`);
    p.textContent=i%3===0?'✿':'♡';p.addEventListener('animationend',()=>p.remove(),{once:true});host.append(p);
  }
}
function openLetter(){
  const envelope=$('open-letter'),area=envelope.parentElement;
  clearTimeout(letterTimer);envelope.classList.add('open');envelope.setAttribute('aria-expanded','true');
  letterTimer=setTimeout(()=>{area.classList.add('is-open');$('letter-content').hidden=false;$('letter-content').focus({preventScroll:true});$('letter-content').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});petals(15);},reducedMotion.matches?0:650);
}
$('open-letter').addEventListener('click',openLetter);
$('close-letter').addEventListener('click',()=>{
  clearTimeout(letterTimer);$('letter-content').hidden=true;const envelope=$('open-letter');
  envelope.parentElement.classList.remove('is-open');envelope.classList.remove('open');envelope.setAttribute('aria-expanded','false');envelope.focus({preventScroll:true});
});
document.querySelectorAll('[data-note]').forEach(note=>{
  note.addEventListener('click',()=>{
    const show=note.getAttribute('aria-expanded')!=='true';note.setAttribute('aria-expanded',String(show));note.classList.toggle('is-read',show);
    note.querySelector('.note-answer').hidden=!show;note.querySelector('.note-prompt').hidden=show;
    const doodle=note.querySelector('.note-doodle,.note-heart');if(doodle)doodle.hidden=show;
    note.querySelector('.note-bottom').firstChild.textContent=show?'GUÁRDAME EL SECRETO ':'TÓCAME ';
    if(show)petals(8);
  });
});
$('keep-heart').addEventListener('click',()=>{
  $('heart-message').textContent='Entonces ya valió la pena haberlo hecho. ♡';
  $('keep-heart').replaceChildren(document.createTextNode('Ahora este viernes también es tuyo ♡'));
  petals(34);
});
$('share').addEventListener('click',async()=>{
  const data={title:'Este viernes 13, pensé en ti.',text:'Te dejé unas flores, una canción y algo que quería decirte. ♡',url:location.href.split('#')[0]};
  try{
    if(navigator.share)await navigator.share(data);
    else if(navigator.clipboard){await navigator.clipboard.writeText(data.url);$('share-status').textContent='Enlace copiado. Ya puedes enviárselo a esa persona. ♡';}
    else $('share-status').textContent='Copia este enlace: '+data.url;
  }catch(e){if(e.name!=='AbortError')$('share-status').textContent='Puedes copiar el enlace desde la barra de tu navegador.';}
});
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.documentElement.classList.add('js-motion');
}
let ticking=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${max>0?scrollY/max*100:0}%`;ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true;}},{passive:true});updateProgress();
if(!reducedMotion.matches)setTimeout(()=>petals(11),1000);
