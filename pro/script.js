function generate(){
const text=document.getElementById('inputText').value;
const preview=document.getElementById('preview');
preview.innerHTML='';

const words=text.split(' ');
let lines=[],line='';

words.forEach(w=>{
 if((line+w).length>65){lines.push(line);line=w+' ';}
 else{line+=w+' ';}
});
lines.push(line);

const linesPerPage=30;
let page,content;

lines.forEach((l,i)=>{
 if(i%linesPerPage===0){
  page=document.createElement('div');
  page.className='page '+document.getElementById('paper').value;

  content=document.createElement('div');
  content.className='content';
  content.style.fontFamily=document.getElementById('font').value;
  content.style.color=document.getElementById('color').value;

  page.appendChild(content);
  preview.appendChild(page);
 }
 content.innerHTML+=l+'\n';
});
}

function downloadPDF(){
const element=document.getElementById('preview');
html2pdf().set({
 margin:0,
 filename:'premium.pdf',
 image:{type:'jpeg',quality:1},
 html2canvas:{scale:3},
 jsPDF:{unit:'px',format:[794,1123]},
 pagebreak:{mode:['css','legacy']}
}).from(element).save();
}
