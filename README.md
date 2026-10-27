# 菜根谭 · Cai Gen Tan

> **径路窄处，留一步与人行；滋味浓的，减三分让人嗜。** ——《菜根谭·前集第13则》

以东方宣纸、山峦与赭色日轮为设计语言的《菜根谭》数字阅读馆，并提供可供 **Codex / OpenCode** 使用的 caigen-tan-wisdom Skill：借古典修身、处世与知止思想分析现实问题，以温润克制的语气引用原文，解释其历史含义并提出可执行的建议。

[**阅读网站（GitHub Pages）**](https://1998x-stack.github.io/CaiGenTan/) · [**AI Skill**](./SKILL.md) · [**专业文档**](./docs/README.md) · [**发布工作流**](https://github.com/1998x-stack/CaiGenTan/actions)

## 主要功能

| 模块 | 功能与实现 |
| --- | --- |
| 经典阅读 | **明刻本标签下356则全文**：前集222、后集134；254则可无损细分为较短原译单元，总共698张阅读卡；原文在上、白话在下，独立点击揭晓 |
| 全文探索 | 原文、繁体、白话全文检索；前后集切换、主题辅助标签、收藏条目 |
| 阅读体验 | 宣纸与深墨两套主题、简繁体切换、字号调整、分卷浏览、随机一则、深链接 |
| 现实智慧 | [SKILL.md](./SKILL.md)：修身、职场进退、得失、人际分寸与闲适；真引文、条次、白话与具体建议 |
| 工程质量 | 原生ES Modules、无后端和第三方运行时依赖；数据数量校验、GitHub Actions CI、静态Pages构建 |

**对应精度：** 全书356则中254则的简体、繁体与白话具备相同标点分句数量和逐字回拼条件，安全细分后形成698张阅读卡；剩余102则保留整则。标点对应尚未经人工逐句语义校订，不能称作权威句对句译本。

**版本原则：** 356则基于维基文库修订号2561729对应的前后集电子底本，**不混入**其他常见360则本、清刻五卷本或其他分条。现代白话来自 Sunhow 国学精读的AI辅助学习稿，按 CC BY-SA 4.0 授权；不是本项目原创或经学术审核的权威逐字训诂。具体署名、授权和改动见 [ATTRIBUTION.md](./ATTRIBUTION.md)。

## 一、让 Codex / OpenCode 直接使用本 Skill

### 方式A：复制提示词（在仓库目录使用）

将下面的文本直接粘贴到已打开此仓库的 Codex 或 OpenCode：

~~~text
请读取当前仓库根目录 SKILL.md，按需查看 references/practical-framework.md、references/verified-quotes.md 和 data/source/ 中的真实《菜根谭》原文。
本次及后续现实问题请按 caigen-tan-wisdom Skill 回答：
1. 先认清我的目标、实际限制、重要权益和风险，不机械套用格言。
2. 借《菜根谭》的修身、谦和、知止、进退与得失思想进行审慎分析，采用清朗、温润、有古意但容易理解的中文语气。
3. 必须选恰切真实的原文短句，注明《菜根谭·前集第N则》或《菜根谭·后集第N则》，紧跟现代释义。
4. 解释经义与我处境的关系、现代适用边界和可能反例。谦让不等于放弃正当权益，知足不等于容忍伤害。
5. 给出1至3个可执行、能验证的现实行动，不把古籍当法律、医学或科学事实依据。
6. 不得捏造原文或条号，不得混用其他版本；不把现代释读冒称洪应明原句。
我的问题：________
~~~

### 方式B：启用项目级 Skill

项目包含 [Skill自动发现入口](./.agents/skills/caigen-tan-wisdom/SKILL.md) 与 [AGENTS.md](./AGENTS.md)。

~~~bash
git clone https://github.com/1998x-stack/CaiGenTan.git
cd CaiGenTan
codex
# 或
opencode
~~~

**Codex 对话中直接粘贴：**

~~~text
$caigen-tan-wisdom 请引用《菜根谭》真实的前后集原文，以清朗温润的语气分析我的职场/人际/学习问题，解释现实边界并给出具体行动：________
~~~

**OpenCode 对话中直接粘贴：**

~~~text
请加载当前项目 caigen-tan-wisdom Skill；若没有自动发现，请读取 .agents/skills/caigen-tan-wisdom/SKILL.md 和仓库 SKILL.md。结合《菜根谭》真实原文与条号回答我的问题：________
~~~

### 方式C：全局安装

~~~bash
git clone https://github.com/1998x-stack/CaiGenTan.git "$HOME/caigen-tan-skill"
mkdir -p "$HOME/.agents/skills"
ln -s "$HOME/caigen-tan-skill/.agents/skills/caigen-tan-wisdom"   "$HOME/.agents/skills/caigen-tan-wisdom"
~~~

若同名技能目录已存在，请先检查，不要覆盖；客户端未发现时可重启。详细例子见 [prompts/codex-opencode.md](./prompts/codex-opencode.md)。

## 二、本地开发与验收

~~~bash
git clone https://github.com/1998x-stack/CaiGenTan.git
cd CaiGenTan
npm test
npm run build
npm run serve
# 浏览器访问 http://localhost:4173
~~~

要求 Node.js 20+ 与 Python 3（仅本地HTTP服务）。原生ES Modules不应直接通过 file:// 打开。

| 路径 | 职责 |
| --- | --- |
| data/source/ | 356则原文、繁体和原译对照，保留上游ID与源摘要 |
| data/index.js | 分卷、条目索引、24个阅读分段及编辑性检索主题 |
| index.html / styles.css / app.js | 网站页面、动画、搜索、原译揭晓与阅读状态 |
| SKILL.md / .agents/skills/ / references/ | AI现实思考框架、精准引经、客户端发现入口 |
| docs/ / scripts/ / .github/workflows/ | 内容模型、古籍校勘、测试、构建与发布 |

## 三、版权、学术与伦理边界

明代原著属于公有领域，但本站采用的现代电子转录与白话解释有明确来源。**第三方现代译释仍按 CC BY-SA 4.0 署名和同方式共享**；代码与本站原创工程文字以 [MIT](./LICENSE) 许可提供。参见 [ATTRIBUTION.md](./ATTRIBUTION.md)。

自动测试验证356条都可读、有成对译意且篇次无错；**不证明古籍文字或译法完全经学术校勘**。现代现实问题应以可信事实、用户权益和合法的行动为先。

[产品说明](./docs/PRODUCT.md) · [内容模型](./docs/CONTENT-MODEL.md) · [底本与来源](./docs/TEXTUAL-SOURCES.md) · [阅读交互](./docs/READING-INTERACTION.md) · [设计系统](./docs/DESIGN-SYSTEM.md) · [质量验收](./docs/QA.md) · [部署](./docs/DEPLOYMENT.md) · [路线图](./docs/ROADMAP.md)

---

**宁受一时之寂寞，毋取万古之凄凉。** ——《菜根谭·前集第1则》