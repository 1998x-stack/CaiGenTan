import A from "./source/entries-001-060.js";
import B from "./source/entries-061-120.js";
import C from "./source/entries-121-180.js";
import D from "./source/entries-181-240.js";
import E from "./source/entries-241-300.js";
import F from "./source/entries-301-356.js";
export const ENTRIES=Object.freeze([...A,...B,...C,...D,...E,...F]);
export const TOTAL=ENTRIES.length;
export const PARTS=Object.freeze([
 {id:"former",name:"前集",first:1,last:222,description:"阅人情世事，修持心性与行止的分寸"},
 {id:"latter",name:"后集",first:223,last:356,description:"观林泉日月，得闲适之趣与内心安顿"}
]);
const THEMES=Object.freeze([
 {name:"修身",search:["德","善","心","省","性","念","君子","志","节"]},
 {name:"处世",search:["人","世","交","友","让","宽","忍","谦","待"]},
 {name:"进退",search:["进","退","得","失","功","名","利","富","荣"]},
 {name:"清心",search:["静","清","淡","闲","寂","欲","真","虚","澄"]},
 {name:"自然",search:["山","水","花","月","云","风","鸟","林","竹"]},
 {name:"识见",search:["知","学","悟","智","见","理","言","是","非"]}
]);
/** 主题为本站关键词辅助索引，不是原书分类编制。 */
export function themesFor(entry){
 const text=entry.original;
 return THEMES.map(t=>({name:t.name,n:t.search.filter(w=>text.includes(w)).length}))
  .filter(t=>t.n>0).sort((a,b)=>b.n-a.n).slice(0,2).map(t=>t.name);
}
export const THEMATIC_LABELS=Object.freeze(THEMES.map(t=>t.name));
export const byNumber=n=>ENTRIES[Number(n)-1]??null;
export const byPart=id=>ENTRIES.filter(e=>id==="former"?e.part==="前集":id==="latter"?e.part==="后集":true);
export const sourceRef="https://zh.wikisource.org/wiki/菜根譚";
/** 仅整则对应，不将无法保证语义对齐的白话按标点机械拆开。 */
export const paired=entry=>({original:entry.original,translation:entry.translation});
export const COLLECTIONS=Object.freeze(PARTS.flatMap(part=>{
 const list=[];
 for(let start=part.first;start<=part.last;start+=15){
  const end=Math.min(start+14,part.last);
  list.push({id:list.length+1+(part.id==="latter"?15:0),start,end,part:part.name,title:part.name+" · "+(start-part.first+1)+"—"+(end-part.first+1)+"则"});
 }
 return list;
}));

/** 仅当简体、繁体与白话均可无损回拼，且标点分句数严格一致时细分展示。
 * 标点数一致只能说明结构性对齐，语义仍须人工审核。
 */
export function editorialSentences(text){
 if(typeof text!=="string")throw new TypeError("Expected a string");
 return text.match(/[^。！？；]+[。！？；][”’]?|[^。！？；]+$/gu)||[];
}
export function alignedSegments(entry){
 const sources=editorialSentences(entry.original);
 const traditional=editorialSentences(entry.traditional);
 const interpretations=editorialSentences(entry.translation);
 const safe=sources.length>1&&sources.length===traditional.length&&sources.length===interpretations.length&&
   sources.join("")===entry.original&&traditional.join("")===entry.traditional&&interpretations.join("")===entry.translation;
 if(!safe)return [{index:1,count:1,original:entry.original,traditional:entry.traditional,translation:entry.translation,method:"source-pair"}];
 return sources.map((original,i)=>({index:i+1,count:sources.length,original,traditional:traditional[i],translation:interpretations[i],method:"punctuation"}));
}
export const SENTENCE_CARDS=Object.freeze(ENTRIES.map(alignedSegments));
export const SENTENCE_CARD_COUNT=SENTENCE_CARDS.reduce((n,a)=>n+a.length,0);
