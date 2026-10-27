# 静态站点架构

## 路径

- index.html、styles.css、app.js：页面、样式和无框架交互。
- data/source/entries-001-060.js 等六文件：356则原文、繁体和完整现代译释，保留上游原始ID及哈希。
- data/index.js：拼接列表、前后集、24个网站阅读分段及现代关键词索引。
- scripts/validate.mjs：数据完整性与关键DOM契约检查。
- scripts/build.mjs：只复制网站必需的资源至dist/。
- .github/workflows/ci.yml、pages.yml：Node 22验证与Pages发布。

## 阅读状态

浏览器启动后，若location.hash匹配#entry-N，则打开该则所属分段。否则从localStorage读取上次阅读位置。分段切换重新渲染卡片，使每个独立阅读句卡的译文自动恢复hidden；字号调整只更改CSS变量。收藏、字号、简繁、明暗主题和上次阅读存本地，不上传第三方服务。

所有古文、现代译释和搜索项采用textContent渲染；不要用innerHTML拼接数据。

## 深链与部署

静态资源使用相对路径；项目部署于github.io/CaiGenTan/。脚本构建dist，再由GitHub Actions发布；Pages必须实际启用才算上线。

## 数据与学术边界

前集222、后集134，均保留逐则对应白话。仅当简体、繁体和白话的分句数一致、三方逐字回拼成立时细分为句级展示：254则细分，其余102则整则展示，总计698张阅读卡。该结构验证仍不等于人工语义审校。主题是算法辅助索引，不是洪应明所著原始结构。