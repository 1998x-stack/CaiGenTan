import {ENTRIES,TOTAL,PARTS,COLLECTIONS,THEMATIC_LABELS,SENTENCE_CARD_COUNT,alignedSegments,themesFor,byNumber} from "./data/index.js";
const $=id=>document.getElementById(id);
const make=(tag,cls,text)=>{
 const el=document.createElement(tag);if(cls)el.className=cls;
 if(text!==undefined)el.textContent=text;return el;
};
const storage={
 get(key,fallback){try{return JSON.parse(localStorage.getItem("caigentan:"+key))??fallback}catch{return fallback}},
 set(key,value){try{localStorage.setItem("caigentan:"+key,JSON.stringify(value))}catch{/* Browsing works without local storage */}}
};
const hashEntry=()=>{const match=location.hash.match(/^#entry-(\d+)$/);return match?Number(match[1]):null};
const validEntry=n=>Number.isInteger(n)&&n>=1&&n<=TOTAL;
const firstEntry=validEntry(hashEntry())?hashEntry():validEntry(storage.get("last",1))?storage.get("last",1):1;
const sectionFor=n=>COLLECTIONS.findIndex(c=>n>=c.start&&n<=c.end);
const state={
 section:sectionFor(firstEntry),query:"",part:"all",pageSize:24,
 saved:Array.isArray(storage.get("saved",[]))?storage.get("saved",[]):[],
 font:Math.max(16,Math.min(30,Number(storage.get("font",20))||20)),
 script:storage.get("script","simple")==="traditional"?"traditional":"simple"
};
let toastTimer;
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("active");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("active"),2000)}
function theme(name){
 document.documentElement.dataset.theme=name;storage.set("theme",name);
 $("theme-toggle").setAttribute("aria-label",name==="paper"?"切换夜读深墨":"切换宣纸日间");
 document.querySelector('meta[name="theme-color"]').content=name==="paper"?"#f1ede2":"#16271f";
}
theme(storage.get("theme","paper")==="ink"?"ink":"paper");
$("theme-toggle").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="paper"?"ink":"paper"));
function displayText(entry){return state.script==="traditional"?entry.traditional:entry.original}
function renderLibrary(){
 const q=state.query.trim().toLocaleLowerCase("zh-CN");
 const source=ENTRIES.filter(e=>{
  if(state.part==="former"&&e.part!=="前集")return false;
  if(state.part==="latter"&&e.part!=="后集")return false;
  if(state.part==="saved"&&!state.saved.includes(e.number))return false;
  if(!q)return true;
  const haystack=[e.original,e.traditional,e.translation,e.part,e.sourceLabel,...themesFor(e)].join(" ").toLocaleLowerCase("zh-CN");
  return haystack.includes(q);
 });
 $("search-count").textContent=source.length+" / "+TOTAL+" 则";
 $("no-results").hidden=source.length>0;
 const list=source.slice(0,state.pageSize);
 const frag=document.createDocumentFragment();
 for(const entry of list){
  const button=make("button","entry-preview");button.type="button";
  button.setAttribute("aria-label","阅读"+entry.sourceLabel);
  const top=make("div","preview-top");
  top.append(make("span",null,entry.part+" · "+String(entry.numberInPart).padStart(3,"0")),make("span",null,state.saved.includes(entry.number)?"★":"↗"));
  const original=make("div","preview-text",displayText(entry));
  const bottom=make("div","preview-bottom");
  bottom.append(make("span",null,themesFor(entry).join(" / ")||"处世"),make("span",null,"读此则 →"));
  button.append(top,original,bottom);
  button.addEventListener("click",()=>goToEntry(entry.number,true));
  frag.append(button);
 }
 $("library-grid").replaceChildren(frag);
 $("show-more").hidden=source.length<=state.pageSize;
}
function renderSections(){
 const frag=document.createDocumentFragment();
 for(const [index,section] of COLLECTIONS.entries()){
  const button=make("button","section-link"+(index===state.section?" active":""));button.type="button";
  if(index===state.section)button.setAttribute("aria-current","location");
  button.append(make("span",null,String(index+1).padStart(2,"0")),make("span",null,section.title));
  button.addEventListener("click",()=>navigateToSection(index,true));
  frag.append(button);
 }
 $("sections").replaceChildren(frag);
 $("section-pos").textContent=String(state.section+1).padStart(2,"0")+" / "+COLLECTIONS.length;
}
function countRevealed(){
 const total=$("reading-lines").querySelectorAll(".reveal-button").length;
 const open=$("reading-lines").querySelectorAll('.reveal-button[aria-expanded="true"]').length;
 $("reveal-count").textContent="已释读 "+open+" / "+total+" 则";
}
function toggleReveal(button,meaning){
 const opening=button.getAttribute("aria-expanded")==="false";
 button.setAttribute("aria-expanded",String(opening));
 button.setAttribute("aria-label",(opening?"收起":"揭晓")+"本则白话释义");
 button.querySelector(".reveal-label").textContent=opening?"收起此则译文":"轻触见义";
 button.querySelector(".reveal-seal").textContent=opening?"收":"译";
 meaning.hidden=!opening;
 button.closest(".sentence-unit").classList.toggle("open",opening);
 countRevealed();
}
function renderProverbs(section){
 const frag=document.createDocumentFragment();
 for(const entry of ENTRIES.slice(section.start-1,section.end)){
  const card=make("article","proverb-card");
  card.id="proverb-"+entry.number;card.setAttribute("role","listitem");
  const meta=make("div","proverb-meta");
  meta.append(make("span",null,entry.sourceLabel),make("span",null,"明刻本 · "+String(entry.number).padStart(3,"0")+" / 356"));
  card.append(meta);
  for(const segment of alignedSegments(entry)){
   const unit=make("div","sentence-unit");
   const heading=make("div","sentence-index",segment.count>1?"句 "+segment.index+" / "+segment.count:"原译对照");
   const source=make("p","original",state.script==="traditional"?segment.traditional:segment.original);
   const button=make("button","reveal-button");button.type="button";
   const meaningId="meaning-"+entry.number+"-"+segment.index;
   button.setAttribute("aria-expanded","false");
   button.setAttribute("aria-controls",meaningId);
   button.setAttribute("aria-label","揭晓"+entry.sourceLabel+"第"+segment.index+"段白话");
   button.append(make("span","reveal-label","轻触见义"),make("span","reveal-seal","译"));
   const meaning=make("div","meaning");meaning.id=meaningId;meaning.hidden=true;
   meaning.append(make("span","meaning-caption","白话释义 / MODERN CHINESE"),make("p",null,segment.translation));
   button.addEventListener("click",()=>toggleReveal(button,meaning));
   unit.append(heading,source,button,meaning);
   card.append(unit);
  }
  const bottom=make("div","card-bottom");
  const tags=make("div","tags");for(const tag of themesFor(entry))tags.append(make("span",null,tag));
  const buttons=make("div","card-buttons");
  const isSaved=state.saved.includes(entry.number);
  const bookmark=make("button",null,isSaved?"★ 已收藏":"☆ 收藏");
  bookmark.type="button";bookmark.setAttribute("aria-pressed",String(isSaved));
  bookmark.setAttribute("aria-label",(isSaved?"取消收藏":"收藏")+entry.sourceLabel);
  bookmark.addEventListener("click",()=>{
   state.saved=state.saved.includes(entry.number)?state.saved.filter(n=>n!==entry.number):[...state.saved,entry.number];
   storage.set("saved",state.saved);
   const active=state.saved.includes(entry.number);
   bookmark.textContent=active?"★ 已收藏":"☆ 收藏";bookmark.setAttribute("aria-pressed",String(active));
   renderLibrary();toast(active?"已收藏此则":"已取消收藏");
  });
  const share=make("button",null,"↗ 链接");share.type="button";
  share.setAttribute("aria-label","复制"+entry.sourceLabel+"直达链接");
  share.addEventListener("click",async()=>{
   const url=new URL("#entry-"+entry.number,location.href).href;
   try{await navigator.clipboard.writeText(url);toast("链接已复制")}
   catch{toast("请复制浏览器地址栏的地址")}
  });
  buttons.append(bookmark,share);bottom.append(tags,buttons);
  card.append(bottom);frag.append(card);
 }
 $("reading-lines").replaceChildren(frag);countRevealed();
}
function renderGroup(){
 const section=COLLECTIONS[state.section];if(!section)return;
 const part=section.part==="前集"?PARTS[0]:PARTS[1];
 $("section-label").textContent=section.title;
 $("group-kicker").textContent=section.part+" · "+(section.start-part.first+1)+"—"+(section.end-part.first+1)+"则";
 $("group-heading").textContent=section.part==="前集"?"处世有度":"闲中见真";
 $("group-summary").textContent=part.description;
 $("group-watermark").textContent=String(state.section+1).padStart(2,"0");
 $("prev").disabled=state.section===0;$("next").disabled=state.section===COLLECTIONS.length-1;
 $("prev-label").textContent=state.section>0?COLLECTIONS[state.section-1].title:"已至卷首";
 $("next-label").textContent=state.section<COLLECTIONS.length-1?COLLECTIONS[state.section+1].title:"已至卷末";
 document.documentElement.style.setProperty("--reading-size",state.font+"px");
 renderProverbs(section);renderSections();
 storage.set("last",section.start);
}
const motion=()=>matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth";
function navigateToSection(index,scroll){
 if(index<0||index>=COLLECTIONS.length)return;
 state.section=index;renderGroup();
 history.replaceState(null,"","#entry-"+COLLECTIONS[index].start);
 if(scroll)$("reader").scrollIntoView({behavior:motion(),block:"start"});
 else $("group-kicker").scrollIntoView({behavior:motion(),block:"start"});
}
function goToEntry(number,scroll){
 if(!validEntry(number))return;
 state.section=sectionFor(number);renderGroup();storage.set("last",number);
 history.replaceState(null,"","#entry-"+number);
 const card=$("proverb-"+number);
 if(scroll && card)card.scrollIntoView({behavior:motion(),block:"center"});
}
$("search").addEventListener("input",e=>{state.query=e.target.value;state.pageSize=24;renderLibrary()});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 state.part=btn.dataset.part;state.pageSize=24;
 document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));
 renderLibrary();
}));
$("show-more").addEventListener("click",()=>{state.pageSize+=24;renderLibrary()});
$("collapse-all").addEventListener("click",()=>{
 for(const button of $("reading-lines").querySelectorAll('.reveal-button[aria-expanded="true"]')){
  toggleReveal(button,document.getElementById(button.getAttribute("aria-controls")));
 }
});
$("font-plus").addEventListener("click",()=>{state.font=Math.min(30,state.font+2);storage.set("font",state.font);document.documentElement.style.setProperty("--reading-size",state.font+"px")});
$("font-minus").addEventListener("click",()=>{state.font=Math.max(16,state.font-2);storage.set("font",state.font);document.documentElement.style.setProperty("--reading-size",state.font+"px")});
$("script-toggle").addEventListener("click",()=>{
 state.script=state.script==="simple"?"traditional":"simple";storage.set("script",state.script);
 renderGroup();renderLibrary();toast(state.script==="traditional"?"已切换繁体":"已切换简体");
});
$("prev").addEventListener("click",()=>navigateToSection(state.section-1,false));
$("next").addEventListener("click",()=>navigateToSection(state.section+1,false));
$("random").addEventListener("click",()=>goToEntry(1+Math.floor(Math.random()*TOTAL),true));
window.addEventListener("hashchange",()=>{if(validEntry(hashEntry()))goToEntry(hashEntry(),true)});
window.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)){e.preventDefault();$("search").focus()}});
let ticking=false;
function progress(){const length=document.documentElement.scrollHeight-innerHeight;$("progress").style.width=(length?Math.min(100,100*scrollY/length):0)+"%";ticking=false}
window.addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(progress)}},{passive:true});
if("IntersectionObserver"in window){
 const observer=new IntersectionObserver(entries=>{for(const x of entries)if(x.isIntersecting){x.target.classList.add("visible");observer.unobserve(x.target)}},{threshold:.08});
 document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
renderLibrary();renderGroup();progress();
if(validEntry(hashEntry()))requestAnimationFrame(()=>goToEntry(hashEntry(),true));
