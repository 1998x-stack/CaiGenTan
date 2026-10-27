import fs from "node:fs";import path from "node:path";
const dir=path.resolve("dist");
fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
for(const f of ["index.html","styles.css","app.js",".nojekyll"])fs.copyFileSync(f,path.join(dir,f));
for(const d of ["assets","data"])fs.cpSync(d,path.join(dir,d),{recursive:true});
for(const f of ["index.html","styles.css","app.js","assets/favicon.svg","assets/og-cover.svg","data/index.js","data/source/entries-001-060.js","data/source/entries-301-356.js"])if(!fs.existsSync(path.join(dir,f)))throw Error("Missing site asset: "+f);
console.log("dist/ ready for GitHub Pages");
