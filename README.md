# uiux.wiki

> **Name it. Compare it. Build it.**
>
> 看见组件，叫对名字；比较边界，把交互变成可执行规范。

[在线体验](https://www.uiux.wiki/) · [GitHub](https://github.com/Charlo-O/uiux-wiki)

uiux.wiki 是一个面向 AI Coding、产品设计与前端协作的**视觉 UI/UX 图鉴和交互语义助手**。当你只知道“点一下弹个小框”“从右边滑出详情”“下拉后还能搜索”时，它帮助你找到准确的专业名称，看见真实预览，比较相似模式的使用边界，并把结论整理成可交付的交互规范。

它解决的不是“再提供一套组件”，而是界面工作中更靠前的问题：**我们说的究竟是不是同一个交互？**

## 核心能力

- **自然语言检索**：支持按中文俗称、英文术语、别名、标签和使用场景搜索 UI 条目。
- **视觉化图鉴**：先看预览，再读解释；覆盖桌面端、移动端、常见变体、状态和使用场景。
- **模式边界对比**：集中比较 Button / Link、Tooltip / Popover、Modal / Drawer、Select / Combobox、Skeleton / Spinner 等常见混淆项。
- **完整使用说明**：每个条目不仅解释“是什么”，也整理适用场景、Do / Don't、相关模式和 Accessibility 提醒。
- **AI 交互规范工作台**：把模糊需求转成推荐、备选与不推荐模式，并补充状态、键盘、焦点、移动端、动效、边界情况和 AI Coding Prompt。
- **项目化沉淀**：可配置框架、组件库、样式方案、平台、Accessibility 目标、团队术语和自定义组件映射。
- **规范编辑与交付**：支持多交互点拆分、澄清问题、Spec Editor、规则调试、历史记录、版本快照与双版本对比；可导出 Prompt、Markdown、JSON 和 Jira / Linear 风格任务文本。
- **LUMEN 特效工具**：附带独立的 WebGL2 生成式着色器工作室，可生成循环抽象视觉并导出 PNG、WebM 或 GIF。

## 知识覆盖

当前索引包含 **2,612 个 UI 条目**，由 138 个精编条目与 2,474 个扩展索引条目组成，分布在 10 个一级分类、95 个二级分类中。

| 分类 | 条目数 | 主要内容 |
| --- | ---: | --- |
| 组件 | 1,225 | 输入、导航、反馈、数据展示、AI 交互等 |
| 状态 | 336 | 加载、网络、表单、媒体、交易、AI 状态等 |
| 场景 | 227 | 搜索、筛选、提交、支付、删除、协作等流程 |
| 样式 | 162 | Color、Typography、Spacing、Elevation 等 |
| React | 153 | 页面、Provider、预览、Playground 与工具组件 |
| 布局 | 146 | 页面结构、Grid、Split、Dashboard、移动布局等 |
| 词典 | 118 | 常见 UI 中英文术语与口语化解释 |
| 移动端 | 100 | 移动导航、Picker、Sheet、手势与设备能力 |
| 动效 | 99 | 反馈、转场、Overlay、加载与 Reduced Motion |
| 无障碍 | 46 | 焦点、键盘、读屏、对比度、i18n 与 RTL |

数据入口位于 [`src/data.js`](src/data.js)，扩展索引位于 [`docs/ui-item-name-index-expanded.md`](docs/ui-item-name-index-expanded.md)。

## 从一句模糊描述到可执行 Spec

以“用户列表里点一行打开右侧详情，删除前要确认”为例：

1. 图鉴搜索帮助确认“右侧详情”更接近 Drawer，而不是阻断当前任务的 Dialog。
2. 工作台把“查看详情”和“危险操作确认”拆成不同交互点。
3. AI 给出推荐、备选与不推荐模式，并说明选择理由与风险。
4. Spec 补齐 Trigger、States、Keyboard、Focus、Mobile、Animation、Accessibility 和 Edge cases。
5. 编辑确认后，复制成 AI Coding Prompt、Markdown Spec、JSON 或开发任务文本。

这条链路的目标不是替代设计判断，而是让判断有共同语言、有可核对的边界，也更容易交给人或 AI 实现。

## 快速开始

### 环境要求

- Node.js 22（与 GitHub Actions 构建环境一致）
- npm
- 现代浏览器；使用 LUMEN 时需要 WebGL2

### 本地开发

```bash
git clone https://github.com/Charlo-O/uiux-wiki.git
cd uiux-wiki
npm ci
npm run dev
```

开发服务器默认监听 `http://127.0.0.1:5173`；如果端口被占用，Vite 会选择其他可用端口。

### 构建与预览

```bash
npm run build
npm run smoke:dist
npm run preview
```

构建产物输出到 `dist/`。

## AI 功能配置

点击页面右上角的“AI 增强”，填写：

1. OpenAI-compatible API 地址；
2. API Key；
3. 模型名称；
4. 默认技术栈。

配置完成后，可以使用条目 AI 增强和“AI 交互规范工作台”。客户端会优先请求 JSON 输出；对于不支持 `response_format` 的兼容接口，会自动尝试普通文本模式并做容错解析。

> [!WARNING]
> 当前为浏览器前端直连模式，API Key 会保存在当前浏览器的 `localStorage` 中。不要在不受信任或多人共用的浏览器中保存密钥；正式公开部署需要通过后端代理转发 API 请求并在服务端保管密钥。目标接口还必须允许浏览器跨域访问。

## 本地数据与账户说明

当前版本不依赖业务后端。账户、收藏、AI 配置、工作台项目、历史和版本数据均保存在浏览器 `localStorage` 中：

- “注册 / 登录”是本地工作区隔离能力，不是云账户或生产级身份认证；
- 清理浏览器数据会删除未备份的记录；
- 页面提供本地数据 JSON 的复制导出与导入；
- 当前没有云同步、多人协作、服务端权限控制或跨设备恢复。

## 项目结构

```text
.
├─ .github/workflows/deploy.yml     # GitHub Pages 构建与部署
├─ docs/                            # PRD、扩展 UI 索引与宣传文档
├─ public/
│  ├─ CNAME                         # www.uiux.wiki
│  └─ lumen/                        # 独立 WebGL2 生成式着色器工具
├─ scripts/
│  ├─ audit-generated-previews.mjs  # 扩展条目预览映射审计
│  └─ smoke-dist.mjs                # 构建产物冒烟检查
└─ src/
   ├─ main.jsx                      # React 入口
   ├─ App.jsx                       # 页面、图鉴、预览与工作台 UI
   ├─ data.js                       # 知识模型、精编数据与索引解析
   ├─ styles.css                    # 全站样式与响应式规则
   └─ features/
      ├─ ai/                        # API、Prompt、解析、规范与导出
      └─ glossary/                  # 搜索和相关条目召回
```

应用采用纯前端架构：`src/main.jsx` 挂载 React，`src/App.jsx` 负责页面状态与交互，`src/data.js` 在构建时把精编数据和 Markdown 扩展索引合并为统一条目，再由搜索、预览和 AI 模块消费。

## 可用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地 Vite 开发服务器 |
| `npm run build` | 生成生产构建到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run audit:generated-previews` | 检查扩展条目的预览映射、唯一性和高风险分类 |
| `npm run smoke:dist` | 检查 Pages 构建产物、CNAME 与关键产品文案 |

## 部署

生产站点部署在 GitHub Pages。推送到 `codex/expand-ui-item-index` 分支后，[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 会依次执行：

```text
npm ci → npm run build → npm run smoke:dist → 上传 dist → 部署 Pages
```

也可以在 GitHub Actions 中手动触发 `workflow_dispatch`。

## 相关文档

- [`PRODUCT.md`](PRODUCT.md)：产品定位、用户、设计原则与 Accessibility 原则
- [`docs/interaction_translator_skill_web_demo_prd.md`](docs/interaction_translator_skill_web_demo_prd.md)：Interaction Translator PRD
- [`docs/ui-item-name-index-expanded.md`](docs/ui-item-name-index-expanded.md)：完整 UI 条目名称索引
- [`docs/PROMOTION_ARTICLE.md`](docs/PROMOTION_ARTICLE.md)：项目宣传介绍文章
- [`public/lumen/README.md`](public/lumen/README.md)：LUMEN 使用和导出说明

## 当前边界

- AI 输出是基于模型、提示词和本地知识召回的辅助建议，需要结合真实业务上下文复核。
- 工作台的质量评分用于提示规范字段覆盖度，不是客观质量认证或自动验收结果。
- 项目目前不生成完整产品页面，也不替代设计系统、用户研究或专业 Accessibility 审计。
- 仓库根目录目前没有单独的开源许可证；在许可证明确前，请勿默认获得复制、修改或再发布授权。LUMEN 子目录遵循其自带许可证。

---

**uiux.wiki — 把交互，说准确。**
