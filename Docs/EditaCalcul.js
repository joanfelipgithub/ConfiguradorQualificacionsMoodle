javascript:(function(){
if (document.getElementById('myOverlayTextBox')) return;

const e = document.createElement('div');
e.id = 'myOverlayTextBox';
e.style.position = 'fixed';
e.style.top = '50px';
e.style.left = '50px';
e.style.width = '780px';
e.style.height = '580px';
e.style.backgroundColor = 'rgba(0,0,0,0.95)';
e.style.zIndex = 10000;
e.style.border = '2px solid #fff';
e.style.borderRadius = '8px';
e.style.padding = '10px';
e.style.boxShadow = '0 0 15px #000';
e.style.resize = 'both';
e.style.overflow = 'auto';
e.style.color = 'white';
e.style.fontFamily = 'monospace';
e.style.boxSizing = 'border-box';

/* --- Minimize Button --- */
const minBtn = document.createElement('button');
minBtn.textContent = '–';
minBtn.style.position = 'absolute';
minBtn.style.top = '5px';
minBtn.style.right = '5px';
minBtn.style.width = '22px';
minBtn.style.height = '22px';
minBtn.style.border = '1px solid #fff';
minBtn.style.background = 'rgba(255,255,255,0.15)';
minBtn.style.color = 'white';
minBtn.style.borderRadius = '3px';
minBtn.style.cursor = 'pointer';

let minimized = false;
minBtn.onclick = () => {
    minimized = !minimized;
    if (minimized) {
        t.style.display = 'none';
        o.style.display = 'none';
        const c = document.getElementById('raButtonsContainer');
        if (c) c.style.display = 'none';
        e.style.height = '40px';
        minBtn.textContent = '+';
    } else {
        t.style.display = '';
        o.style.display = '';
        const c = document.getElementById('raButtonsContainer');
        if (c) c.style.display = '';
        e.style.height = '580px';
        minBtn.textContent = '–';
    }
};
e.appendChild(minBtn);

/* --- Input textarea --- */
const t = document.createElement('textarea');
t.style.width = '100%';
t.style.height = '35%';
t.style.background = 'transparent';
t.style.color = 'white';
t.style.border = '1px solid #fff';
t.style.outline = 'none';
t.style.fontSize = '14px';
t.style.padding = '4px';
t.placeholder = 'Paste your lines here...';

/* --- Output box --- */
const o = document.createElement('div');
o.style.width = '100%';
o.style.height = '40%';
o.style.marginTop = '10px';
o.style.background = 'rgba(255,255,255,0.05)';
o.style.padding = '5px';
o.style.overflowY = 'auto';
o.style.border = '1px solid #fff';
o.style.whiteSpace = 'pre-wrap';

e.appendChild(t);
e.appendChild(o);
document.body.appendChild(e);

/* --- FIXED DRAGGING (correct offset) --- */
let dragging = false, startX = 0, startY = 0;

e.addEventListener('mousedown', ev => {
    if (ev.target === t || ev.target === minBtn) return;
    dragging = true;
    startX = ev.clientX - e.offsetLeft;
    startY = ev.clientY - e.offsetTop;
    ev.preventDefault();
});

document.addEventListener('mousemove', ev => {
    if (!dragging) return;
    e.style.left = (ev.clientX - startX) + 'px';
    e.style.top = (ev.clientY - startY) + 'px';
});

document.addEventListener('mouseup', () => dragging = false);

/* --- ESC closes overlay --- */
document.addEventListener('keydown', a => {
    if (a.key === 'Escape') e.remove();
});

/* --- Your RA processing function (unchanged except container cleanup) --- */
function r(){try{
    const a=t.value.split('\n').filter(s=>!s.includes('Total de la categ')).join('\n'),
    d=[...a.matchAll(/\[\[.*?\]\]/g)].map(s=>s[0]),
    c=d.filter(s=>s.includes('_')),
    p=d.filter(s=>s.includes('-')),
    m=c.map(s=>{const h=s.match(/\[\[(.*?)_/);if(!h)return null;return h[1].split('').map(g=>`${g}*(${s}-1)`) }).filter(s=>s),
    u=p.map(s=>{const h=s.match(/\[\[(.*?)-/);if(!h)return null;return h[1].split('').map(g=>`${g}*(${s})`) }).filter(s=>s);

    window.Act_Fet_NoFet=c;
    window.Activitats_0_10=p;
    window.Act_Fet_NoFet_RAn=m;
    window.Activitats_0_10_RAn=u;

    const f=[];
    if(m.length>0){
        for(let g=0;g<m[0].length;g++){
            const w=m.map(v=>v[g]).filter(v=>v);
            if (w.length>0) f.push(`RA${g+1}: =average(${w.join(';')})/2*10`);
        }
    }
    window.raFormulasText=f.join('\n');

    const old = document.getElementById('raButtonsContainer');
    if (old) old.remove();

    /* --- Regenerate buttons --- */
    const R=document.createElement('div');
    R.id='raButtonsContainer';
    R.style.marginTop='8px';
    e.appendChild(R);

    f.forEach(s=>{
        const h=document.createElement('button');
        h.textContent=`Copy ${s.split(':')[0]}`;
        h.style.margin='3px 5px 0 0';
        h.style.padding='3px 8px';
        h.style.border='1px solid #fff';
        h.style.borderRadius='3px';
        h.style.background='rgba(255,255,255,0.1)';
        h.style.color='white';
        h.style.cursor='pointer';
        h.title=s;
        h.onclick=()=>navigator.clipboard.writeText(s.split(': ')[1])
            .then(()=>alert(`${s.split(':')[0]} copied!`));
        R.appendChild(h);
    });

    o.textContent='Act_Fet_NoFet_RAn:\n'+JSON.stringify(m,null,2)
        +'\n\nActivitats_0_10_RAn:\n'+JSON.stringify(u,null,2)
        +'\n\nRA Formulas per column:\n'+f.join('\n');
}catch(err){o.textContent='Error: '+err;}
}

t.addEventListener('input', r);
})();
