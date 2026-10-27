# 工程与质量原则

静态技术栈：index.html、styles.css、app.js、data/index.js以及data/source/六个原译数据ES模块。浏览器使用原生JavaScript，无后端、无用户数据上传。

原文与白话始终纵向堆叠。每条白话在首次显示前具有hidden属性，使用aria-expanded与aria-controls管理独立点击；切换阅读小节恢复隐藏，字号变化不丢状态。

数据保持明刻本356则，前222后134；关键词主题是现代网站辅助标签，不是作者原书分类。改动必须保留Sunhow国学精读CC BY-SA署名和ATTRIBUTION.md。

每次提交后执行 npm test 和 npm run build，检查GitHub Actions真实结果。资源均使用相对路径适应 /CaiGenTan/ 子路径，支持移动端、键盘和减少动效。