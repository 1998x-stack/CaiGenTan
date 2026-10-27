# 贡献指南

修订文字时，先确认使用的**明刻本电子标签下356则版本**，不要把清刻本五卷或其他360则版混入本项目。每个文字修订须记录前后集条号、原字与拟改字、确切来源URL/修订号、理由与人工校核结果。

电子正文及现代释义来自Sunhow国学精读，现代整理/译文许可为CC BY-SA 4.0，必须保留ATTRIBUTION.md，不可作为本项目原创重新授权。

工程修改先读docs/ARCHITECTURE.md、docs/READING-INTERACTION.md；保持原文在上、白话在下，初始hidden，独立点击揭晓。必须npm test、npm run build，然后核验真实CI、Pages与浏览器交互。动态内容用textContent、尊重键盘与减少动画。

使用古籍分析现实时，不以“忍让”纵容不公，不把历史格言取代现代安全或专业证据。