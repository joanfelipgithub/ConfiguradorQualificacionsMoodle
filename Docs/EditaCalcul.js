javascript:(function(){
'use strict';
if(document.getElementById('myOverlayTextBox'))return;
const overlay=document.createElement('div');overlay.id='myOverlayTextBox';overlay.style.position='fixed';overlay.style.top='50px';overlay.style.left='50px';overlay.style.width='780px';overlay.style.height='580px';overlay.style.backgroundColor='rgba(0,0,0,0.95)';overlay.style.zIndex=10000;overlay.style.border='2px solid #fff';overlay.style.borderRadius='8px';overlay.style.padding='10px';overlay.style.boxShadow='0 0 15px #000';overlay.style.resize='both';overlay.style.overflow='auto';overlay.style.color='white';overlay.style.fontFamily='monospace';
const textarea=document.createElement('textarea');textarea.style.width='100%';textarea.style.height='35%';textarea.style.background='transparent';textarea.style.color='white';textarea.style.border='1px solid #fff';textarea.style.outline='none';textarea.style.fontSize='14px';textarea.placeholder='Paste your lines here...';
const output=document.createElement('div');output.style.width='100%';output.style.height='40%';output.style.marginTop='10px';output.style.background='rgba(255,255,255,0.05)';output.style.padding='5px';output.style.overflowY='auto';output.style.border='1px solid #fff';output.style.whiteSpace='pre-wrap';
overlay.appendChild(textarea);overlay.appendChild(output);document.body.appendChild(overlay);
let isDragging=false,offsetX,offsetY;
overlay.addEventListener('mousedown',e=>{if(e.target!==textarea){isDragging=true;offsetX=e.clientX-overlay.offsetLeft;offsetY=e.clientY-overlay.offsetTop;}});
document.addEventListener('mousemove',e=>{if(isDragging){overlay.style.left=(e.clientX-offsetX)+'px';overlay.style.top=(e.clientY-offsetY)+'px';}});
document.addEventListener('mouseup',()=>isDragging=false);
document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.remove();});
function rebuildOutput(){
const lines=textarea.value.split('\n');const filteredLines=lines.filter(line=>!line.includes('Total de la categ'));const text=filteredLines.join('\n');
const all_ids=[...text.matchAll(/\[\[.*?\]\]/g)].map(m=>m[0]);
const Act_Fet_NoFet=all_ids.filter(id=>id.includes('_'));
const Activitats_0_10=all_ids.filter(id=>id.includes('-'));
const Act_Fet_NoFet_RAn=Act_Fet_NoFet.map(code=>{const digitsMatch=code.match(/\[\[(.*?)_/);if(!digitsMatch)return null;const digits=digitsMatch[1].split('');return digits.map(d=>`${d}*(${code}-1)`);}).filter(row=>row);
const Activitats_0_10_RAn=Activitats_0_10.map(code=>{const digitsMatch=code.match(/\[\[(.*?)-/);if(!digitsMatch)return null;const digits=digitsMatch[1].split('');return digits.map(d=>`${d}*${code}`);}).filter(row=>row);
window.Act_Fet_NoFet=Act_Fet_NoFet;window.Activitats_0_10=Activitats_0_10;window.Act_Fet_NoFet_RAn=Act_Fet_NoFet_RAn;window.Activitats_0_10_RAn=Activitats_0_10_RAn;
const formulas=[];if(Act_Fet_NoFet_RAn.length>0){const numCols=Act_Fet_NoFet_RAn[0].length;for(let i=0;i<numCols;i++){const colValues=Act_Fet_NoFet_RAn.map(row=>row[i]).filter(v=>v&&!v.startsWith('0*'));if(colValues.length>0){formulas.push(`RA${i+1}: =average(${colValues.join(';')})/2*10`);}}}
window.raFormulasText=formulas.join('\n');
const oldButtons=document.getElementById('raButtonsContainer');if(oldButtons)oldButtons.remove();
const raContainer=document.createElement('div');raContainer.id='raButtonsContainer';raContainer.style.marginTop='8px';overlay.appendChild(raContainer);
formulas.forEach(formulaText=>{const btn=document.createElement('button');btn.textContent=`Copy ${formulaText.split(':')[0]}`;btn.style.marginRight='5px';btn.style.marginTop='3px';btn.style.padding='3px 8px';btn.style.border='1px solid #fff';btn.style.borderRadius='3px';btn.style.background='rgba(255,255,255,0.1)';btn.style.color='white';btn.style.cursor='pointer';btn.title=formulaText;
btn.addEventListener('click',()=>{navigator.clipboard.writeText(formulaText.split(': ')[1]).then(()=>alert(`${formulaText.split(':')[0]} copied!`)).catch(err=>alert('Copy failed: '+err));});
raContainer.appendChild(btn);});
output.textContent='Act_Fet_NoFet_RAn:\n'+JSON.stringify(Act_Fet_NoFet_RAn,null,2)+'\n\nActivitats_0_10_RAn:\n'+JSON.stringify(Activitats_0_10_RAn,null,2)+'\n\nRA Formulas per column:\n'+formulas.join('\n');
if(formulas.length>0){const lines=formulas.map(s=>s.split(': ')[1]);const blob=new Blob([lines.join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='RA_formules.txt';document.body.appendChild(link);link.click();document.body.removeChild(link);URL.revokeObjectURL(url);}}
textarea.addEventListener('input',rebuildOutput);
})();
