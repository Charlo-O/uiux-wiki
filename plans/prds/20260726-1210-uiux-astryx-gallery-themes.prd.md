# UIUX Astryx 风格组件图鉴、模板与主题浏览 PRD

> **Status**: Draft
> **Owner**: UIUX 产品 / 设计 / 前端
> **Date**: 2026-07-26
> **Tier**: Standard
> **Decision**: 本 PRD 将用户已确认的改造方向固化为可拆 Sprint、可验收的产品与工程约束；未将状态标记为 Approved。

## Quick Read

| 项目 | 决策 |
| --- | --- |
| Product | 将 UIUX 从高密度条目列表升级为可扫描、可深读、可切换主题的本地组件图鉴 |
| Primary change | UIUX 分类采用 Astryx 风格的分组 Gallery、懒加载预览卡片、独立详情页 |
| Top navigation | 顶部固定为 `全部 / UI/UX / 模板 / 主题 / 特效` 五个一级入口 |
| Sidebar | UIUX 左侧保留二级分类树与展开/折叠；移除侧栏中的“全部条目”展示；“常见对比”归入 UIUX 分类 |
| Detail | 点击卡片进入独立详情路由，不使用 modal 作为主承载；保留现有预览、变体、状态、可访问性和 AI 增强信息 |
| Themes | 第一阶段只作用于 UIUX 页面及主题预览；使用本地 CSS Variables 和 `data-uiux-theme`，不引入 Astryx runtime |
| Templates | 新增本地 Templates 页面，功能对齐 Astryx：分类 Gallery、真实模板预览、预览 Dialog、前后切换、键盘操作、Playground、复制动作和深链 |
| Data | 继续复用当前 `src/data.js` 的 2,612 条 UIUX 数据和已有字段 |
| Constraints | 不改动“全部”、工作台、特效的既有产品语义；不重写 2,612 条数据；不增加后端 |
| First proof | `组件 → Button/Card/Modal → Gallery 卡片 → 独立详情 → 返回原位置 → 主题切换` 全链路可用 |

## Full Refactor Scope

本项目不是只给 UIUX 页面加一层 Gallery 外壳，而是对 UIUX 分类下的每一个组件条目进行全量迁移和展示重构。当前 `uiItems` 中的 2,612 条记录都属于本次目标范围；实现可以按分类分批交付，但最终验收不能只覆盖 Button、Card、Modal 等代表条目。

用户截图中的“标签一 / 标签二 / 标签三”属于本次必须重写的**组件预览内容**。它不能继续以旧的 `generated-standard-mini`、`mini-preview` 或旧列表中的通用小样式作为最终实现。新的预览要在保持 Tabs/标签页语义准确的前提下，按照 Astryx 的预览画布、留白、边界、卡片表面和信息层级重新编写。

这里的“每个组件重构”分为三个层次：

1. **Gallery 展示重构**：每个条目都必须拥有新的 Gallery 卡片，包含统一比例的预览区、名称、短描述、分类归属和进入详情的交互。
2. **组件预览重写**：每个条目的组件预览必须重新编写到新的 `UiuxPreviewThumbnail`/`UiuxDetailPreview` 展示契约。允许复用共享的 preview primitives、token 和交互状态工具，但不允许只把旧 mini preview 原样包进新卡片。Tabs 必须呈现可辨认的 tabs，Pagination 必须呈现分页，Modal 必须呈现弹层层级，状态类条目必须呈现对应状态；组件的名称、结构、状态和操作不能与真实语义不一致。
3. **组件详情重构**：每个条目都必须有独立详情 URL，并按照统一结构展示定义、用途、变体、状态、实现提示、可访问性和关联条目。字段缺失时展示明确的“暂无说明”状态，不得让条目退回旧列表或无法打开。

以下内容仍然不要求手工重写：

- 不要求逐条改写 2,612 条原始数据的语义、名称和分类；
- 不要求每个条目都重新设计一套完全不同的详情页壳；详情页壳可以共享，但组件预览本身必须逐条重写；
- 不要求所有条目第一天同时完成，但必须提供按分类的迁移清单、覆盖率、截图证据和剩余项报告；
- 不允许用“只完成 3 个示例”作为最终交付。

因此，Phase 1–4 是交付顺序，不是范围缩减：代表条目用于验证模式，分批迁移用于控制风险，Definition of Done 以 2,612 条全量条目完成新展示契约为准。

## Component Rewrite Contract

每个 UIUX 条目在新的 UIUX 路由中都必须满足以下契约。该契约约束的是预览实现，不是只约束卡片外框。

### Required spec

每个条目必须能解析为一份稳定的 `UiuxComponentSpec`：

```ts
type UiuxComponentSpec = {
  id: string
  slug: string
  term: string
  english: string
  family: string
  anatomy: Array<{ name: string; role: string }>
  states: Array<{
    id: string
    label: string
    visual: string
    interactive?: boolean
  }>
  interactionModel: {
    trigger?: string
    response?: string
    keyboard?: string[]
    focus?: string
  }
  previewRenderer: string
  detailRenderer: string
  accuracyChecklist: string[]
}
```

`previewRenderer` 和 `detailRenderer` 必须指向新的 renderer/primitive，不得继续指向旧列表的 `mini-preview` renderer。若多个条目属于同一组件族，可以共享 renderer，但必须通过 spec 传入准确的 anatomy、label、state、variant 和 interaction 数据；共享 renderer 不等于使用同一个无语义的占位图。

### Astryx visual contract

每个重写后的预览必须遵循以下共同视觉约束：

- 预览放在独立的 16:10 左右画布中，画布使用低噪声 surface、柔和边界和一致圆角；
- 组件内容居中或按真实布局放置，不让解释文本挤占组件的主要视觉区域；
- 组件旁的间距、尺寸、字重、边框和控件密度由 UIUX theme tokens 控制；
- Gallery 卡片下方显示中文名称、英文名称/slug 和短描述；
- hover、focus、loading、error 只表达状态，不用装饰性动效掩盖组件含义；
- preview 在首次加载、离屏和加载失败时都有骨架/错误状态，但这些是运行时状态，不可作为最终内容替代组件实现；
- 主题变化只能改变 token 和允许的材质表现，不能改变组件的语义、解剖结构和交互规则。

### Semantic accuracy contract

“准确”按以下四层检查：

1. **Term accuracy**：画面中的组件必须与条目中文/英文名称一致，不能出现标题是 Tabs、画面却只是三条矩形色块的情况。
2. **Anatomy accuracy**：必须呈现该组件的关键结构，例如 Tabs 有 tab list、active tab 和可辨认的 tab item，Modal 有遮罩、容器和动作区。
3. **State accuracy**：条目声明的默认、hover、active、disabled、loading、error 等状态必须以可识别的视觉差异呈现；未支持的状态不能在文案中声称已支持。
4. **Interaction accuracy**：有交互的 preview 必须至少支持条目定义的主操作和键盘/焦点反馈；纯概念条目必须在详情中说明其非交互性质。

任何一层不满足，都只能标记为 `blocked`，不能用通用静态卡片冒充完成。

## Preview Rewrite Workflow

每个组件族按以下流程迁移：

1. **Inventory**：从 `uiItems` 读取条目、分类、变体、状态和已有 preview，生成迁移记录。
2. **Semantic mapping**：为条目填写 `anatomy`、`interactionModel` 和准确的状态清单。
3. **Renderer selection**：选择现有 renderer family 或新建专用 renderer；禁止默认全部落到 generic placeholder。
4. **Astryx styling**：将 renderer 放入统一 preview canvas，使用 UIUX theme tokens 对齐 Astryx 风格。
5. **Interactive proof**：在详情页验证主操作、状态切换、键盘焦点和 reduced-motion。
6. **Visual proof**：生成该条目截图或 contact sheet，检查组件是否与术语一致，记录异常。
7. **Approval**：通过自动 schema/render 检查和人工/视觉复核后，将迁移状态标记为 `complete`。

### Batch strategy

- 按组件族和 UIUX 二级分类分批，例如 `基础元素 → 操作与按钮 → 文本输入 → 选择控件 → 导航组件 → 状态反馈 → 布局 → 动效`。
- 每批先完成 renderer family，再迁移该族全部条目，避免同一族出现多套不一致的 preview。
- 每批产出：条目清单、renderer 清单、截图证据、fallback/blocked 原因和覆盖率。
- 代表条目只用于验证 renderer family；族内剩余条目必须继续迁移，不能以代表条目通过推断整族完成。

## Direction Pass

本轮采用 compact geju-style fallback（本仓库没有可用的 `$geju` skill；Claude Code 评审命令在本次调用中超时，因此由 Codex 根据仓库和本地 Astryx 参考完成方向收敛）。

- **Thesis**：把 UIUX 从密集的列表检索界面变成可扫描、可深读、可切换主题的本地组件图鉴：借鉴 Astryx 的 gallery、detail、theme mechanics，但复用 UIUX 现有 2,612 条数据和预览能力。
- **Direction**：Astryx-like editorial gallery + sticky taxonomy + dedicated detail route + scoped token themes。
- **Bold takes**：
  1. Gallery 是 UIUX 组件页的首屏主叙事，列表仅作为条目承载细节，不再是默认视觉骨架。
  2. 详情页采用独立页面状态，保证可分享、可返回和深链；不以弹窗承载完整解释。
  3. 主题第一阶段只隔离在 UIUX 范围内，验证 token 体系后再决定是否扩展到全站。
- **What not to do**：不嵌入 Astryx 的 Next/StyleX/pnpm runtime，不复制其业务页面，不伪造 npm 安装动作，不为了视觉一致性重写现有数据。
- **First proof**：先完成一个组件分组和 3 个代表条目的全链路，再扩展到所有分类。
- **Falsifier**：如果 2,612 条懒加载预览仍造成明显滚动卡顿，或现有条目详情信息不足以支撑独立页面，则先降低实时预览密度、采用分段渲染并补齐详情信息，再扩大覆盖范围。

## Context

当前产品是一个本地运行的 UI/UX 术语、组件和交互模式图鉴。用户需要快速完成以下动作：

1. 找到正确的 UI/UX 名称；
2. 通过实际预览理解它是什么；
3. 查看变体、状态、适用场景和实现注意事项；
4. 将信息转译为开发 prompt 或产品规格。

当前 UIUX 页面已经具备较完整的数据和解释能力，但默认形态是“左侧分类 + 中间高密度列表 + 右侧详情”。这会带来三个问题：

- 首屏难以形成“可浏览的组件库”感，用户需要逐条阅读才知道有哪些组件；
- 条目之间的视觉层级和类别结构不够明显，浏览 2,612 条数据的认知成本高；
- 详情、路由和主题体验没有形成可独立分享的产品页面。

本 PRD 使用本地 `extra/astryx` 作为相邻模式参考。已核对的参考方向包括：

- `apps/docsite/src/app/(docs)/components/page.tsx`：分组标题、三列卡片网格、预览缩略图和卡片标签；
- `apps/docsite/src/components/ShowcaseThumbnail.tsx`：IntersectionObserver 懒加载、骨架屏、16:10 预览容器和 `content-visibility`；
- `apps/docsite/src/components/component-detail/ComponentDetailClient.tsx`：独立详情页、概览/属性切换、代码和示例区；
- `apps/docsite/src/components/ThemePackagePage.tsx`：左侧 sticky 主题选择器、右侧主题化预览、选中态和模式切换；
- `apps/docsite/src/components/SharedTopNav.tsx`：Docs、Components、Templates、Themes 等一级导航的低噪声布局。

以上参考只用于交互和信息架构借鉴，不作为运行时依赖或版权内容复制目标。

## Problem

### User problem

- 我知道“按钮、弹窗、卡片”等概念，但不知道它们在 UIUX 图鉴中的位置和相邻变体。
- 我想先扫一遍视觉预览，再决定是否进入解释，而不是从密集文字列表开始。
- 我需要把某个条目的解释页分享给同事，当前状态不适合用 URL 直接定位。
- 我想比较不同视觉主题下的组件表现，但当前没有统一的主题入口。

### Product problem

- 当前 UIUX 分类、内容列表和详情面板耦合在单页状态中，浏览与深读互相争夺空间。
- 预览内容已有，但没有统一的 gallery 卡片承载层。
- 主题能力如果直接作用全站，容易影响“全部”、工作台和特效页面，扩大回归范围。

## Goals

### P0 goals

1. 在顶部增加 `模板` 和 `主题` 一级入口，形成 `全部 / UI/UX / 模板 / 主题 / 特效` 五栏导航。
2. UIUX 分类页面改为 Astryx 风格的分组 Gallery：
   - 桌面端默认三列；
   - 卡片使用固定比例、低噪声背景和实际预览；
   - 分类标题、数量和分组结构清晰可扫；
   - 预览采用懒加载，初始渲染不挂载全部实时预览。
3. 点击组件卡片进入独立详情页：
   - 支持浏览器前进/后退和可分享 URL；
   - 保留当前已有的实时预览、变体/状态、用途、Do/Don't、可访问性、关联条目和 AI 增强；
   - 从详情返回后恢复原分类、搜索词、滚动位置和选中卡片。
4. UIUX 左侧导航保留二级分类和根节点展开/折叠：
   - 不显示“全部条目”侧栏入口；
   - “常见对比”归入 UIUX 分类下；
   - 现有全部数据继续可通过 UIUX 分组和搜索访问。
5. 主题页面提供首批 Astryx 参考主题的本地化预览，并保证主题只污染 UIUX 路由。
6. UIUX 分类下的每一个组件条目都完成 Gallery、预览和独立详情的重构迁移，不以示例条目代替全量完成。
7. 模板页面具备与 Astryx Templates 等价的用户可见功能，不以静态截图或单纯链接列表替代真实模板预览。

### P1 goals

- 支持 UIUX Gallery 的分类筛选、关键词搜索、结果数量和空状态。
- 支持组件详情内的 `概览 / 变体与状态 / 实现提示` 三个内容标签。
- 支持主题 URL 深链、刷新恢复和本地持久化。
- 在移动端将三列 Gallery 降级为两列/一列，并把 sticky 侧栏转为顶部选择器。

### P2 goals

- 主题预览可复用同一套 UIUX 组件数据，减少主题展示专用 mock。
- 为收藏、分享和“复制为 prompt”保留现有能力入口，后续再增加跨主题比较。

## Non-Goals

- 不修改“全部”页面的既有信息架构和条目语义。
- 不重写工作台、特效页或 `public/lumen` 的实现。
- 不将主题第一阶段扩展到全站 header、工作台或特效 runtime。
- 不手工重写 2,612 条 `uiItems` 数据语义；仅补充缺失的展示字段、预览适配或建立派生映射。
- 不引入 Astryx 的 Next.js、StyleX、pnpm workspace、构建产物或网络运行时。
- 不增加后端、登录、云端同步或新的外部数据库。
- 不伪造 Astryx 的 npm 安装、复制安装命令或品牌按钮；Templates 的复制/使用动作必须使用本项目自己的本地模板协议或 Playground，不得声称安装 Astryx。
- 不把 Templates 简化成只有图片的展示页；每张模板卡必须能打开真实模板实现的预览。
- 不以 modal 替代独立详情页。
- 不在第一阶段实现跨主题 diff、主题发布、主题导出或主题市场。

## Users

### Primary users

- **AI coding 用户**：通过组件名称和预览快速生成前端实现 prompt。
- **前端开发者**：查找变体、状态、键盘交互和可访问性要点。
- **产品/设计人员**：用组件图鉴统一术语、确认交互模式和设计方向。

### Secondary users

- 初级前端：需要简短中文解释和可视化示例；
- 小团队负责人：需要分享稳定 URL，作为评审和规格讨论入口。

### Jobs to be done

> 当我需要设计或实现一个 UI 模式时，我希望先按分类浏览真实预览，再进入一页式说明，以便快速确认名称、变体、状态、用途和实现注意事项，并把该页面分享给团队。

## Scope

### In scope

- UIUX gallery shell、分组、卡片、懒加载预览；
- UIUX 独立详情路由和返回状态；
- UIUX 二级分类树的展开/折叠与“常见对比”归类；
- Themes 一级入口、主题选择器和 UIUX 主题预览；
- 本地主题 token、URL 参数和 localStorage 持久化；
- 键盘、焦点、移动端和 reduced-motion 支持；
- 现有数据字段到新展示结构的适配。

### Out of scope

- 服务端搜索和云端收藏；
- 新增组件内容生产流水线；
- 全站主题迁移；
- 视觉素材或品牌图片的大批量生成；
- 依赖外部图库或 CDN 才能工作的预览。

## Key Decisions

1. **一级导航**：在现有 `全部 / UI/UX / 特效` 中加入 `模板` 和 `主题`，最终顺序为 `全部 / UI/UX / 模板 / 主题 / 特效`。
2. **UIUX 侧栏**：保留 UI/UX 分类根节点和子分类；“全部条目”不作为侧栏按钮显示，数据总量在 Gallery 标题或搜索结果中表达。
3. **“常见对比”归属**：作为 UIUX 分类下的独立二级入口保留，不删除其内容。
4. **组件主视图**：Gallery 为默认视图；现有密集列表作为详情内的相关条目或后续可选视图，不作为首屏主骨架。
5. **详情承载**：独立页面状态优先于弹窗，路由通过现有无 Router 的 SPA 状态和 `history.pushState`/`popstate` 实现。
6. **主题作用域**：第一阶段使用 `data-uiux-theme` 挂在 UIUX 页面容器，仅影响 UIUX Gallery、详情和主题预览；`全部`、工作台、特效保持现状。
7. **主题持久化**：URL 参数优先，其次读取 localStorage；无效主题回退 `neutral`。
8. **运行时边界**：只复用 Astryx 的交互机制和视觉原则，所有组件预览、主题 token 和页面代码仍由本项目维护。
9. **Templates parity**：模板页的用户可见行为按 Astryx Templates 对齐；组件详情仍使用本项目已确定的独立详情页，而模板预览保持 Astryx 的 gallery + modal 交互，不强行共用组件详情模式。

## User Flows

### Flow A — Browse UIUX gallery

1. 用户点击顶部 `UI/UX`。
2. 页面读取 `view=uiux`，默认展开 `组件` 根节点和第一个可用分组。
3. 用户在左侧展开/折叠 `组件 / 交互 / 状态 / 词典 / 布局 / 样式 / 动效 / 移动端 / React / 无障碍` 等根节点。
4. 用户点击某个二级分类，主区域滚动到对应分组并更新 URL 的 `category` 参数。
5. Gallery 卡片在进入视口附近挂载实际预览；未进入视口时显示骨架或静态占位。
6. 用户可使用顶部搜索，结果以 Gallery 卡片展示；无结果时显示清晰的空状态和清除搜索操作。

### Flow B — Open component detail

1. 用户点击 `Button`、`Card` 或其他 Gallery 卡片。
2. 路由更新为 `/?view=uiux&category=<category>&item=<slug>`，页面切换到详情状态。
3. 详情页展示面包屑、中文/英文标题、简短定义、固定预览和内容标签。
4. 用户在 `概览 / 变体与状态 / 实现提示` 间切换，查看现有数据字段。
5. 用户点击关联条目，进入新的详情并更新浏览器历史。
6. 用户点击返回或浏览器后退，恢复 Gallery 的筛选和滚动位置。

### Flow C — Switch theme

1. 用户点击顶部 `主题`。
2. 页面读取 `view=themes&theme=<id>`，默认 `neutral`。
3. 左侧主题选择器显示主题卡片、名称、简短描述和选中态。
4. 用户选择 `Neutral / Stone / Gothic / Matcha / Y2K / Butter` 中任一主题。
5. 右侧 UIUX 组件预览实时切换 token；URL 和 localStorage 同步。
6. 用户可点击“返回 UIUX”继续浏览，主题在当前 UIUX 会话中保持。

### Flow D — Deep link and refresh

1. 用户打开包含 `view`、`category`、`item` 或 `theme` 的 URL。
2. 应用解析并校验参数；无效参数回退到最近的有效父级。
3. 页面在不依赖先点击首页的情况下直接呈现对应内容。
4. 刷新后仍保持详情/主题选择；若 localStorage 不可用，至少保证 URL 状态有效。

## Information Architecture

```text
Top navigation
├── 全部                 现有全部页面，语义和入口保持不变
├── UI/UX
│   ├── 组件
│   │   ├── 基础元素
│   │   ├── 操作与按钮
│   │   ├── 文本输入
│   │   ├── 选择控件
│   │   ├── 表单结构与校验
│   │   └── …（复用 data.js 中现有二级分类）
│   ├── 交互
│   ├── 状态
│   ├── 词典
│   ├── 布局
│   ├── 样式
│   ├── 动效
│   ├── 移动端
│   ├── React
│   ├── 无障碍
│   └── 常见对比
├── 模板
│   ├── All
│   ├── Dashboard
│   ├── Table
│   ├── Form
│   ├── Settings
│   ├── Login
│   ├── Tools / Content / AI Chat / Gallery / Shell
│   └── Other
├── 主题
│   ├── Neutral
│   ├── Stone
│   ├── Gothic
│   ├── Matcha
│   ├── Y2K
│   └── Butter
└── 特效                 现有特效页和 /lumen/index.html 兼容
```

### Sidebar rules

- 根节点是可展开/折叠按钮，使用 `aria-expanded`。
- 展开状态在当前会话内保留；刷新恢复默认展开节点即可，不要求跨设备同步。
- 选中二级分类时，根节点保持展开，侧栏滚动到选中项。
- 不显示“全部条目”按钮；“2,612 条”作为 UIUX Gallery 的数据说明或搜索结果统计，不作为一个需要点击的分类。
- 所有现有分类和计数应从数据派生，不在组件中复制硬编码。

## UI Requirements

### Top navigation

- 顶部保持轻量、低噪声和当前品牌结构。
- 一级入口顺序固定为 `全部 / UI/UX / 模板 / 主题 / 特效`。
- 当前入口必须有明确 active 状态，不能仅依赖颜色；可结合底部指示条、字重或背景。
- `模板` 入口切换到 Templates Gallery；`主题` 入口切换到 Themes 页面；两者不得改变 `全部` 和 `特效` 的既有 route 行为。
- 小屏幕允许折叠为水平滚动或菜单，但五个入口必须可发现。

### UIUX gallery page

- 页面保留左侧二级分类树、中央内容区和可选右侧上下文区域，但 Gallery 主体不再使用密集表格感。
- Gallery 使用 3 列卡片（桌面端），卡片最小宽度约 300px；中等宽度降为 2 列，手机降为 1 列。
- 每个分组包含：
  - 分组标题；
  - 中文/英文辅助标签（如已有）；
  - 条目数量；
  - 分组说明或当前筛选提示；
  - 卡片网格。
- 卡片包含：
  - 16:10 左右的预览容器；
  - 轻灰/主题化表面；
  - 按条目语义重新编写的实际组件预览；加载中的骨架/错误提示只能是运行时状态，不能作为最终条目内容；
  - 中文名称、英文名称或 slug；
  - 一句短描述；
  - hover/focus 状态；
  - 点击后进入详情的箭头或可识别 affordance。
- 卡片不承载完整解释，避免在 Gallery 中重复详情内容。
- Preview 不依赖 hover 才可理解；键盘 focus 时也必须看到同等反馈。
- 加载态显示骨架，不使用空白大面积布局跳动。
- 单一分类数量过大时使用分段渲染或“加载更多”哨兵，不能一次挂载 2,612 个实时预览。

### Component detail page

- 详情页顶部：
  - 面包屑：`UI/UX / 根分类 / 二级分类 / 条目`；
  - 中文标题 + 英文标题；
  - 一句话定义；
  - 关联分类和条目计数信息。
- 内容标签固定为：
  1. `概览`：定义、常见用途、实时预览、常见变体；
  2. `变体与状态`：`variants`、`states`、`preview` 等现有字段；
  3. `实现提示`：Do/Don't、可访问性、键盘/焦点、移动端和 reduced-motion 建议。
- 预览区保持 sticky 或在移动端变为首屏固定顺序；不得遮挡主要正文。
- 关联条目可点击，但必须使用明确链接语义并更新历史。
- 收藏、分享和 AI 增强入口继续复用现有能力；没有数据时显示合理的空状态，不伪造结果。
- 详情页允许通过 URL 直接打开，并在标题或页面元信息中保留条目名称。

### Themes page

- 页面采用 Astryx 参考的两列骨架：
  - 左侧：sticky 主题选择器；
  - 右侧：带标题、说明和组件示例的主题化预览。
- 主题选择器：
  - 主题卡片展示名称、短描述和代表性颜色/材质；
  - 当前主题有高对比选中态；
  - 支持键盘上下/左右导航和 `aria-current`；
  - 移动端转为顶部选择器或横向滚动卡片。
- 右侧预览：
  - 使用 UIUX 现有 Button、Card、Input、Tabs、Toast/Status 等可复用预览；
  - 主题切换应在当前页面即时反映；
  - 不把主题预览误标为可安装的外部 package；
  - 可提供“应用到 UIUX”或“返回 UIUX”动作，但第一阶段不提供 npm 安装动作。
- 主题模式切换（明/暗）若实现，必须明确与主题本身的关系；若无法稳定覆盖现有页面，先只保留主题选择，不伪造完整 dark mode。

## Templates Functional Parity

Templates 不是 UIUX 组件详情的另一个名字，而是一个与 Astryx `/templates` 等价的模板浏览产品面。以下能力必须实现；只有视觉相似、没有真实模板渲染或没有预览控制的实现不算完成。

### Navigation and gallery

- 顶部新增 `模板` 一级入口，active 状态和其他一级入口一致。
- 模板页使用独立路由 `/?view=templates`，并支持 `/?view=templates&preview=<slug>` 深链。
- 页面首屏包含：
  - `Templates` 标题；
  - “可直接使用的页面模板”类短说明；
  - 分类 Toggle/Segmented Control；
  - 模板 Gallery。
- 模板数据从 registry 派生，至少包含：

```ts
type TemplateEntry = {
  slug: string
  name: string
  description: string
  category: string
  source?: string
  isReady: boolean
  isHiddenFromOverview: boolean
  renderer: string
}
```

- 只显示 `isReady=true` 且 `isHiddenFromOverview=false` 的模板。
- 分类分组规则与 Astryx 对齐：取 category 中第一个 ` - ` 前的部分作为分组；默认分组顺序为 `Dashboard / Table / Form / Settings / Login / Tools / Content / AI Chat / Gallery / Shell`，未列出的分组按字母顺序追加，空分类归入 `Other`。
- 当前筛选项默认为 `All`，筛选结果按分组顺序、分组名称和模板名称稳定排序。
- Gallery 使用响应式网格：
  - 桌面端以约 420px 最小卡片宽度布局；
  - 移动端以约 280px 最小宽度或单列布局；
  - 不允许把模板卡缩成无法辨认的静态缩略图。

### Real template rendering

- 每张模板卡必须渲染对应模板的真实页面组件，而不是截图、手工拼接的图片或与模板无关的 mock。
- 模板 renderer 使用按 slug 的 lazy registry；每个模板 slug 映射到唯一可渲染的本地 page renderer。
- 缩略图：
  - 采用 16:10 左右预览容器；
  - 使用 `IntersectionObserver` 在接近视口时挂载；
  - 使用 `ResizeObserver` 计算缩放；
  - 通过 scaler 以固定渲染宽度压缩到卡片；
  - 模板内容默认为 `inert`，卡片缩略图不可操作，操作统一在预览 Dialog 中完成；
  - 预览容器使用 `content-visibility: auto`，避免首屏挂载全部模板。
- 模板组件必须是 content-only 页面，不能重复嵌套全局 AppShell；预览宿主负责背景、边界、圆角和缩放。
- 模板缺失 renderer 时显示明确的不可用状态并标记 `blocked`，不能用 generic card 计入完成。

### Card interaction

- 桌面端 hover 显示 metadata overlay：
  - 模板名称；
  - 最多两行描述；
  - `Preview`；
  - `Open in Playground`（存在 source 时）。
- 移动端不能依赖 hover；整张卡可点击打开预览，操作按钮按可用宽度显示。
- 卡片必须有键盘 focus、`aria-label="Preview <template name>"` 和 Enter/Space 行为。
- overlay 内的按钮点击不能重复触发卡片点击。

### Preview dialog

- 点击卡片打开大尺寸 Dialog，而不是跳转到不可回退的独立静态页面。
- 桌面端：
  - Dialog 宽度约 1,400px；
  - 最大高度约 92vh；
  - 预览主体高度约 86vh；
  - header 展示模板名称和描述；
  - 右侧集中放置复制、Playground、关闭操作；
  - 左右箭头位于 Dialog 外侧的 backdrop gutter；
  - preview surface 有独立边框、圆角和内部滚动容器。
- 移动端：
  - Dialog 使用 fullscreen；
  - 关闭按钮固定可见；
  - header 元信息和操作允许换行；
  - 左右切换仍可用，不能只保留关闭。
- 预览 Dialog 必须支持：
  - `Escape` 关闭；
  - `ArrowLeft`/`ArrowRight` 上一个/下一个；
  - 上一个/下一个循环切换；
  - 关闭后回到原 Gallery 卡片；
  - 切换模板时显示 skeleton overlay，保留 Dialog 的可操作性；
  - 当前筛选结果作为 prev/next 的边界，不穿透到未筛选模板。
- 重型模板切换使用 deferred/transition 等价机制，避免切换时整个页面冻结；如果当前技术栈不提供同名 API，必须实现等价的非阻塞切换。

### Template preview surface

- Dialog 内的 preview surface 直接渲染模板真实组件，并在本地 UIUX theme/mode 环境中运行。
- preview surface 自己是唯一滚动容器，不能出现外层和模板内容双滚动。
- 模板比预览框更高时允许内部滚动；模板宽度需要通过缩放或响应式布局适配。
- lazy import 期间显示 skeleton；renderer 不存在时显示“暂时没有可用预览”的错误状态。
- 模板内部的按钮、输入、导航等可以交互，但不会把 Dialog 关闭或改变 Gallery 筛选，除非模板明确声明该行为。

### Copy and Playground

- Header 必须提供与 Astryx 等价的“复制使用动作”：
  - 若本项目有本地 CLI，复制本地 CLI 的模板 scaffold 命令；
  - 若没有 CLI，复制本项目可执行的模板代码/入口说明；
  - 复制成功后按钮显示短暂成功态，并可再次复制；
  - 不得复制 `npx @astryxdesign/cli` 或声称安装 Astryx。
- `Open in Playground` 必须打开本地 Playground/编辑入口，带上稳定的 template slug/source。
- source 缺失时不显示虚假的 Playground 按钮。
- 复制和 Playground 动作都必须保留模板 slug、分类和来源信息，便于后续统计和调试。

### Direct links and compatibility

- `/?view=templates&preview=<slug>` 直接打开模板 Gallery 并显示对应 Dialog。
- 若采用 `/templates/<slug>` 兼容路径，必须重定向到对应 query preview，而不是渲染一个与 Gallery 不一致的第二套详情页。
- 无效 slug 回到模板 Gallery，并显示可理解的错误提示。
- 浏览器前进/后退必须同步 Dialog 开关和当前模板，不丢失 category filter。
- 刷新带 preview 的 URL 后仍打开同一模板。

### Template acceptance

- [ ] 模板一级入口存在，active、键盘和移动端行为正常。
- [ ] 分类筛选、排序和 `All` 行为与上述规则一致。
- [ ] 每张可见卡都能渲染真实模板组件，而非截图/mock。
- [ ] 桌面 hover overlay 与移动端点击行为均可用。
- [ ] Dialog 支持预览、关闭、左右切换、循环、Escape、键盘箭头和 skeleton transition。
- [ ] 模板 preview surface 只有一个滚动容器，内部缩放和移动端适配正确。
- [ ] Copy 和 Playground 提供本地等价功能，不引用 Astryx runtime/CLI。
- [ ] `?preview=<slug>`、前进/后退和刷新均可恢复状态。
- [ ] registry 中所有 `isReady && !isHiddenFromOverview` 模板均有 renderer；`blocked=0`。

## Visual System

### Shared principles

- 参考 Astryx 的留白、卡片网格、低噪声边界和 editorial 目录感。
- 复用 UIUX 当前品牌色、字体和信息层级，避免把参考站完整复制成营销首页。
- 预览优先于装饰，说明优先于渐变和动效。
- 关键交互不依赖 hover；动效遵循 `prefers-reduced-motion`。

### Token boundary

主题注册表至少包含：

```ts
type UiuxTheme = {
  id: string
  label: string
  description: string
  tokens: {
    background: string
    surface: string
    surfaceMuted: string
    text: string
    mutedText: string
    border: string
    accent: string
    accentSoft: string
    radius: string
    fontFamily: string
  }
  preview: {
    eyebrow: string
    title: string
    description: string
  }
}
```

主题 token 通过 UIUX 页面容器下的 CSS Variables 注入，不能直接改写全局 `:root` 的产品色值。主题 ID、标签和 token 必须来自一个 registry，页面不得各自维护一份主题列表。

## Route Contract

当前应用没有引入 React Router；第一阶段使用轻量 route codec，兼容现有 SPA 状态和 `history.pushState`/`popstate`：

| URL | 作用 |
| --- | --- |
| `/?view=all` | 现有全部页面 |
| `/?view=uiux` | UIUX Gallery 默认入口 |
| `/?view=uiux&category=<categoryId>` | UIUX 指定分类 |
| `/?view=uiux&category=<categoryId>&item=<slug>` | UIUX 独立详情 |
| `/?view=templates` | Templates Gallery 默认入口 |
| `/?view=templates&category=<group>` | Templates 指定分类筛选 |
| `/?view=templates&preview=<slug>` | 打开指定模板的 Preview Dialog |
| `/templates/<slug>` | 兼容路径，重定向到 `/?view=templates&preview=<slug>` |
| `/?view=themes` | Themes 默认入口，主题为 `neutral` |
| `/?view=themes&theme=<themeId>` | Themes 指定主题 |
| `/?view=effects` | 现有特效入口的兼容别名（如当前代码已有） |
| `/lumen/index.html` | 现有特效独立页，保持不变 |

Route rules:

- `view` 是一级页面状态；`category`、`item`、`theme`、`preview` 是作用域参数。
- 参数必须 URL encode；slug 和 categoryId 使用稳定值，不使用展示文本作为唯一键。
- 无效 `item` 回退到分类 Gallery；无效 `theme` 回退到 `neutral`。
- 无效 `preview` 回到 Templates Gallery，并显示可理解的不可用提示。
- 浏览器后退必须恢复页面状态；从详情返回时应恢复来源滚动位置。
- Templates 的 Dialog 开关、当前 preview、category filter 和前后切换必须同步 URL；关闭 Dialog 删除 `preview` 但保留 category。
- 现有外部链接和首页默认行为必须继续可用。

## Data Contract

### Existing source of truth

- `src/data.js` 的 `uiItems` 继续作为组件条目事实来源，当前规模为 2,612 条。
- 复用现有字段：`id`/`slug`、`category`、`name`、`english`、`plain`、`summary`、`variants`、`states`、`useCases`、`do`、`dont`、`accessibility`、`related`、`preview` 等。
- 分类、计数、关联条目和 Gallery 分组从数据派生，禁止在 JSX 中重复维护计数。
- 每个 `uiItems` 条目必须能映射到一个 `UiuxGalleryItem` 和一个 `UiuxDetailModel`；映射失败必须在迁移报告中可见，不能静默丢弃。

### Derived view model

建议添加一个纯函数层，将 `uiItems` 转为：

```ts
type UiuxGalleryItem = {
  id: string
  slug: string
  categoryId: string
  groupId: string
  title: string
  subtitle?: string
  description: string
  preview: UiuxPreviewModel
  detailAvailable: boolean
}
```

缺少 `preview` 时不能用通用静态卡片冒充完成。必须先依据条目的 term、anatomy、states 和 interactionModel 编写准确的 preview renderer；骨架和错误状态只允许作为运行时暂态，不能作为最终条目内容。单条数据缺失可以暂时阻断该条目，但不得导致整个分组崩溃。

### Full coverage manifest

实现阶段必须生成一份按 `slug` 或稳定 `id` 索引的覆盖清单，至少包含：

```ts
type UiuxMigrationRecord = {
  id: string
  slug: string
  categoryId: string
  gallery: 'complete' | 'pending' | 'blocked'
  preview: 'rewritten' | 'pending' | 'blocked'
  detail: 'complete' | 'field-fallback' | 'blocked'
  lastVerifiedAt: string
}
```

验收时需要证明：

- `uiItems.length === migrationManifest.length`；
- 没有条目在 Gallery、详情或搜索结果中静默消失；
- `blocked` 项为 0；
- `preview === 'rewritten'` 的条目数量必须等于 `uiItems.length`；不允许以 `static-fallback` 作为最终完成状态；
- 每个分类都能导出完成数、pending 数和阻塞数，并保留每条组件的截图/复核证据。

### Template source of truth

当前 `kandong-ui` 的模板 registry 数量尚未建立，数量记为 `[UNKNOWN]`，不得从 Astryx 代码仓库或构建产物中猜测。实现时由本项目建立 `src/features/templates/templateRegistry.js`，所有可见模板都必须在 registry 中有稳定 slug、分类、source 和 renderer。

- Astryx 的 `templateRegistry`、`templateComponents` 和 page templates 只作为行为参考；
- 本项目模板源代码必须位于本项目可维护的目录中，并由本地 lazy registry 加载；
- registry 的 `isReady`、`isHiddenFromOverview`、category 排序和 renderer 完整性必须可测试；
- 最终可见模板数、renderer 覆盖率和 blocked 数从本地 registry 自动导出，不在 PRD 中硬编码。

### Theme registry

第一阶段主题：

- `neutral`
- `stone`
- `gothic`
- `matcha`
- `y2k`
- `butter`

`chocolate` 可作为后续扩展，不作为本阶段验收前提。主题内容仅使用本项目已有或可生成的预览数据，不复制外部站点图片和业务文案。

## Interaction Requirements

- 侧栏根节点：
  - `button` 语义；
  - `aria-expanded`；
  - `aria-controls` 指向子树；
  - 键盘 Enter/Space 展开或折叠。
- Gallery 卡片：
  - 整卡可聚焦；
  - `Enter`/`Space` 进入详情；
  - 有可见 focus ring；
  - 卡片内不嵌套冲突的可点击按钮。
- 详情返回：
  - 浏览器后退和显式返回按钮均可用；
  - 显式返回应将焦点放回来源卡片（卡片已不存在时回到 Gallery 标题）。
- 主题选择器：
  - 选中项使用 `aria-current="true"` 或等价语义；
  - 主题切换不应导致焦点丢失；
  - localStorage 写入失败时静默降级为 URL 状态。
- reduced motion：
  - 关闭非必要入场/hover 动画；
  - 不影响预览内容本身的可理解性。
- 响应式：
  - 390px 宽度下无横向滚动；
  - sticky 区域不能盖住内容和焦点；
  - 触摸目标满足现有产品可用性标准。

## Implementation Plan

### Phase 0 — Route and view-model foundation

**Output**

- `src/features/uiux/uiuxRoute.js`：解析/生成 `view`、`category`、`item`、`preview`、`theme`；
- `src/features/uiux/uiuxViewModel.js`：从 `uiItems` 派生分组、计数和卡片数据；
- App 层对 `popstate` 和现有状态兼容；
- 不改变现有 `全部`、特效、工作台行为。

**Checks**

- 现有首页和特效入口可打开；
- 直接打开 UIUX 及详情 URL 可正确回退；
- `git diff` 中无数据大规模重写。

### Phase 1 — UIUX Gallery

**Expected files**

- `src/features/uiux/UiuxGalleryPage.jsx`
- `src/features/uiux/UiuxGallerySection.jsx`
- `src/features/uiux/UiuxGalleryCard.jsx`
- `src/features/uiux/UiuxPreviewThumbnail.jsx`
- `src/styles.css`（新增局部样式）
- `src/App.jsx`、`src/data.js`（接入和必要派生字段）

**Work**

- 搭建左侧分类树 + 主 Gallery；
- 实现 3/2/1 列响应式布局；
- 使用 IntersectionObserver、`content-visibility: auto` 和运行时骨架/错误状态；
- 对大分组增加分段渲染/加载更多；
- 将“常见对比”迁移到 UIUX 分类结构；
- 移除“全部条目”侧栏展示但保留数据访问能力。
- 为全部 UIUX 条目生成 Gallery 映射和迁移清单；不只接入 3 个代表组件。

### Phase 1B — Component preview rewrite batches

**Expected files**

- `src/features/uiux/preview-primitives/*`
- `src/features/uiux/preview-renderers/*`
- `src/features/uiux/uiuxComponentSpecs.js`
- `src/features/uiux/uiuxMigrationManifest.js`
- `scripts/verify-uiux-previews.*`（或等价验证入口）

**Work**

- 按组件族建立可复用的 preview primitives，例如 Button、Input、Tabs、Select、Modal、Toast、Navigation、Table、Layout、Motion 等；
- 将 2,612 条条目逐条映射到 `UiuxComponentSpec`，补齐 anatomy、states、interactionModel 和 renderer；
- 逐条重写预览，不允许将旧 `mini-preview` 作为最终实现；
- 每个条目生成截图/contact sheet 证据，并通过 term/anatomy/state/interaction 四层准确性检查；
- 生成按分类统计的迁移清单，`preview='rewritten'` 才能计入完成；
- 对真实缺失或语义冲突的条目标记 `blocked`，修复后才能进入下一批；不使用 generic placeholder 清零。

**Batch exit criteria**

- 本批所有条目均有新的 renderer；
- 代表条目和族内非代表条目都完成验证；
- 视觉证据、交互证据和迁移清单一致；
- 无旧 `generated-standard-mini`/`mini-preview` renderer 被新 UIUX 路由引用。

### Phase 2 — Independent detail

**Expected files**

- `src/features/uiux/UiuxDetailPage.jsx`
- `src/features/uiux/UiuxDetailPreview.jsx`
- `src/features/uiux/UiuxDetailSections.jsx`
- `src/App.jsx`、`src/styles.css`

**Work**

- 将当前 `DetailPanel` 能力重排到独立页面；
- 实现标签、关联条目、收藏/分享/AI 增强入口；
- 实现来源状态保存和返回焦点；
- 为稀疏数据提供空状态和“暂无说明”占位，不伪造内容。
- 确保每一个可搜索、可分类的 UIUX 条目都能通过稳定 `item` 参数打开详情；没有详情字段的条目也必须进入统一 fallback 模板。

### Phase 3 — Templates parity

**Expected files**

- `src/features/templates/templateRegistry.js`
- `src/features/templates/templateComponents.js`
- `src/features/templates/TemplateGalleryPage.jsx`
- `src/features/templates/TemplateThumbnail.jsx`
- `src/features/templates/TemplatePreviewSurface.jsx`
- `src/features/templates/TemplatePreviewDialog.jsx`
- `src/features/templates/templatePlayground.js`
- `src/App.jsx`、`src/styles.css`

**Work**

- 新增 `模板` 一级入口和 `/?view=templates` route；
- 建立按 slug lazy-loaded 的真实模板 renderer registry；
- 实现 category group、All、稳定排序、ready/hidden 过滤；
- 实现 16:10 thumbnail、IntersectionObserver、ResizeObserver、缩放和 inert；
- 实现桌面 hover overlay、移动端整卡点击和键盘 focus；
- 实现与 Astryx 等价的 Preview Dialog：metadata、copy/use action、Playground、关闭、prev/next、循环、Escape、左右箭头、fullscreen mobile、skeleton transition；
- 实现 `?preview=<slug>` 深链和 `/templates/<slug>` 兼容重定向；
- 复制动作只生成本项目本地模板协议或 Playground 入口，不引入 Astryx CLI/runtime；
- 为 registry 中所有 ready 且未隐藏的模板生成 renderer 和可复核证据。

**Checks**

- 不允许只挂静态截图或 fake template card；
- Dialog 内只有一个模板内容滚动容器；
- `preview`、category filter、前进/后退和刷新状态一致；
- registry 中可见模板 `blocked=0`。

### Phase 4 — Themes

**Expected files**

- `src/features/themes/themeRegistry.js`
- `src/features/themes/ThemeGalleryPage.jsx`
- `src/features/themes/ThemePicker.jsx`
- `src/features/themes/ThemePreviewSurface.jsx`
- `src/App.jsx`、`src/styles.css`

**Work**

- 注册六个首批主题；
- 实现左侧 sticky picker + 右侧实时预览；
- 将 token 注入 `data-uiux-theme` 容器；
- 接入 URL/localStorage；
- 保证主题不泄漏到 `全部`、工作台和特效。

### Phase 5 — Hardening

**Work**

- 视觉间距、边界、字号、focus ring 和 mobile layout 调整；
- 对 2,612 条数据进行长列表、搜索、错误预览和空状态测试；
- 验证生产构建、静态产物 smoke 和浏览器路径；
- 更新 README 或项目文档中的入口说明（仅在实现完成后）。

## Acceptance Criteria

### Navigation and IA

- [ ] 顶部显示且可操作 `全部 / UI/UX / 模板 / 主题 / 特效` 五个一级入口。
- [ ] `全部` 页面行为和现有入口不回归。
- [ ] UIUX 侧栏不显示“全部条目”按钮。
- [ ] “常见对比”存在于 UIUX 分类结构中，点击后有对应内容。
- [ ] UIUX 根节点和二级目录支持展开/折叠，刷新和切换后不出现死状态。

### Gallery

- [ ] 桌面端 UIUX Gallery 默认三列，卡片宽度在窄桌面仍可读。
- [ ] 中等宽度为两列，移动端为一列或等价可读布局。
- [ ] 卡片包含按条目语义重写后的实际预览、名称、短描述和可识别进入详情的 affordance；静态占位不能作为完成结果。
- [ ] 首次渲染不挂载全部 2,612 个实时预览。
- [ ] 滚动进入视口后预览可加载；加载失败只影响单卡，不影响整页。
- [ ] 搜索、分类筛选、数量和空状态与现有数据一致。
- [ ] 2,612 条 UIUX 数据全部存在 Gallery 映射；无静默丢失、无只在旧列表出现的条目。
- [ ] 2,612 条条目全部完成新的 preview renderer；每条都有截图/contact sheet 证据。
- [ ] 新 UIUX 路由不再渲染旧的 `generated-standard-mini`/`mini-preview` 作为最终条目预览。

### Detail

- [ ] 点击卡片更新为可分享详情 URL，刷新后仍能直接打开。
- [ ] 详情包含面包屑、标题、定义、实时预览和 `概览 / 变体与状态 / 实现提示`。
- [ ] 现有 `variants`、`states`、`useCases`、Do/Don't、accessibility、related 等字段按数据存在性展示。
- [ ] 浏览器后退、显式返回和关联条目跳转符合预期。
- [ ] 从详情返回后恢复分类、搜索和来源滚动位置。
- [ ] 2,612 条条目全部具备独立详情路径；字段不足的条目使用统一字段缺省说明，而不是回退到旧的列表详情面板。
- [ ] 每个详情预览与条目的 term、anatomy、states、interactionModel 一致，不能出现“名称与画面不符”。
- [ ] 迁移清单中 `blocked=0`，并能按分类查看 rewritten、pending 和阻塞状态。

### Themes

- [ ] 顶部 `主题` 进入独立 Themes 页面。
- [ ] 首批六个主题可选择、可见选中态并实时更新预览。
- [ ] 主题选择器桌面端 sticky，移动端不遮挡内容。
- [ ] `/?view=themes&theme=<id>` 直接打开对应主题。
- [ ] URL 刷新和 localStorage 均能恢复主题；无效主题回退 `neutral`。
- [ ] 切换主题不会改变 `全部`、工作台和特效页面的颜色或结构。
- [ ] 不出现虚假的“安装 Astryx”或外部依赖动作。

### Templates

- [ ] 顶部 `模板` 进入 Templates Gallery，active 状态和 URL 正确。
- [ ] `All` 和分类 Toggle 按 registry 分组规则筛选，并保持稳定排序。
- [ ] 每张可见模板卡渲染真实本地模板组件，不能使用截图或 generic mock。
- [ ] 模板卡桌面端 hover overlay、移动端整卡点击、Preview 和 Playground action 均可用。
- [ ] Preview Dialog 支持 metadata、关闭、Escape、ArrowLeft/ArrowRight、左右按钮、循环切换和 mobile fullscreen。
- [ ] Dialog 中的模板内容可独立滚动，缩放、lazy import、skeleton 和错误状态正确。
- [ ] Copy/use action 生成本项目本地可执行入口；不复制 Astryx CLI，不引入 Astryx runtime。
- [ ] `/?view=templates&preview=<slug>` 和 `/templates/<slug>` 兼容入口可打开同一模板预览。
- [ ] registry 中全部 `isReady && !isHiddenFromOverview` 模板都有 renderer，且 `blocked=0`。

### Accessibility and quality

- [ ] 侧栏、组件卡片、模板卡片、主题选择器、模板 Dialog 和详情 tabs 可全键盘操作。
- [ ] focus ring、`aria-expanded`、`aria-current` 和必要的 label 正确。
- [ ] `prefers-reduced-motion` 下无关键内容丢失或不可理解。
- [ ] 390px 移动视口下不出现非预期横向滚动。
- [ ] 单个预览异常、无详情字段或无 localStorage 时页面仍可继续使用。

### Verification

- [ ] `npm run build` 通过。
- [ ] `npm run smoke:dist` 通过。
- [ ] 至少完成一次 Playwright/浏览器验证：导航、侧栏展开、组件 Gallery 卡片、组件详情返回、模板筛选、模板 Dialog 前后切换、主题切换、直接 URL。
- [ ] `git diff --check` 通过。
- [ ] 验证结果中记录当前性能基线；若尚未测量，标记为 `[UNKNOWN]`，不得假报具体数值。

## QA Plan

### Manual matrix

| Surface | Desktop | Mobile | Keyboard | Direct URL |
| --- | --- | --- | --- | --- |
| Top nav | ✓ | ✓ | ✓ | `view` |
| Sidebar tree | ✓ | selector/scroll | ✓ | `category` |
| Gallery | 3/2 columns | 1 column | ✓ | category |
| Detail | sticky preview | stacked preview | ✓ | `item` |
| Templates | category grid + hover overlay | card click | ✓ | `preview` |
| Template Dialog | framed preview + prev/next | fullscreen | ✓ | `preview` |
| Themes | sticky picker | picker/carousel | ✓ | `theme` |
| Existing all/effects | regression | regression | smoke | legacy |

### Data cases

- 有完整预览和详情字段的条目：`Button`、`Card`、`Modal`。
- 有多个变体/状态的条目：验证 tab 内容和长文本换行。
- 缺少原始 preview 的条目：验证是否依据语义 spec 重写出准确 renderer；在完成前必须保持 `pending/blocked`，不能以 generic fallback 通过。
- 代表条目之外的同族条目：验证没有复制错误的 anatomy、状态或交互。
- 每个分类至少抽样首项、中间项、末项和一个字段稀疏项；全量通过迁移清单校验。
- 超大分类：验证分段渲染、加载更多和返回滚动。
- Templates：验证 All、每个 category group、ready/hidden 过滤、稳定排序和每个可见模板的真实 renderer。
- Template Dialog：验证桌面/移动、关闭、Escape、ArrowLeft/ArrowRight、循环、skeleton、内部滚动、copy 和 Playground。
- 搜索无结果、无效 category、无效 item、无效 theme、无效 template preview：验证回退。

### Performance checks

- 记录首次可交互、首批可见卡片出现和滚动 500 张卡片后的主线程表现；当前基线为 `[UNKNOWN]`，首次实现必须建立基线。
- 验证首屏 DOM 不包含所有实时预览实例。
- 验证离屏卡片不会持续执行高成本动画或监听。
- 验证主题切换只更新 token，不触发全站重载。

## Metrics

第一阶段采用可观测的行为指标，不设虚假的绝对成功线：

- **Gallery discovery**：进入 UIUX 后，用户是否点击至少一张卡片。
- **Detail completion**：详情页是否完成一次 tab 切换或滚动到实现提示。
- **Template preview**：模板卡打开 Preview Dialog 的成功率、prev/next 切换成功率和真实 renderer 加载错误率。
- **Template action**：Playground 打开率、复制本地模板入口成功率和关闭后返回原卡片成功率。
- **Theme adoption**：Themes 页面是否完成一次主题选择。
- **Deep-link success**：从带 `item`、`preview` 或 `theme` 参数的 URL 打开后，是否出现有效内容而非首页回退。
- **Quality signals**：预览错误率、路由异常率、返回后滚动恢复失败率。

首个实现版本需补充上述指标的采集方式和基线，数据缺失时不以“无错误”替代真实观测。

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| 2,612 条预览造成 DOM、内存或滚动压力 | 高 | IntersectionObserver + 分段渲染 + `content-visibility`; 大分类设置加载边界 |
| 独立详情与现有单页状态冲突 | 高 | 先实现 route codec；保留旧状态兼容；以代表条目完成往返验证 |
| 主题 token 泄漏到其他页面 | 高 | 主题变量只挂在 UIUX 容器；增加跨一级入口回归检查 |
| 模板 Gallery 只做成图片，失去 Astryx 的真实预览能力 | 高 | 每个可见模板必须绑定 lazy renderer；截图/contact sheet 和 Dialog 实际渲染检查作为硬门槛 |
| 模板 Dialog 的 URL、前后切换和筛选状态互相冲突 | 高 | `preview`、`category` 单独编码；所有切换通过同一个 route codec；覆盖刷新/后退/移动端验证 |
| 本项目没有 Astryx CLI，复制动作被误实现为外部安装 | 高 | 使用本地模板协议或 Playground 入口；禁止输出 Astryx CLI 命令或外部依赖 |
| 条目详情字段稀疏 | 中 | 详情按字段存在性渐进展示；增加统一 fallback；不生成未验证事实 |
| Gallery 卡片视觉漂亮但不可检索 | 中 | 保留侧栏、搜索、数量和稳定 URL；Gallery 不是唯一入口 |
| 参考风格变成全站营销化 | 中 | 保持 UIUX 的“清晰、实用、专业”品牌；禁止新增 hero/安装 CTA |
| 移动端双栏/粘性区域遮挡内容 | 中 | 390px 手工矩阵；移动端转顶部选择器或堆叠布局 |
| 当前工作区已有用户修改 | 高 | 实现前审阅 `git diff`，只在相关文件最小改动；不覆盖无关改动 |

## Rollback

- 每个 Phase 使用独立、可回退的提交或小批量提交。
- 若 Gallery 影响性能，可通过 feature flag/默认视图开关回退到现有列表，不删除旧组件。
- 若主题作用域出现泄漏，移除 `data-uiux-theme` 注入和 Themes 顶层渲染，保留 registry 文件供后续修复。
- 若 Templates renderer 或 Dialog 导致性能/路由回归，可只关闭 `templates` view 的入口和 registry 挂载，保留现有一级导航与其他页面；不得删除已迁移的本地模板源文件。
- 若 route codec 造成历史链接回归，保留旧 `activeSection` 解析路径，并将新参数降级到现有入口。
- 不删除 `uiItems`、现有 `DetailPanel` 或 `public/lumen`，确保回退有实际承载。

## Evidence

### Repository evidence

- `PRODUCT.md`：产品用户、定位、反参考、信息架构和无障碍原则。
- `README.md`：本地运行方式、React/Vite 技术栈和可用脚本。
- `src/App.jsx`：当前单页状态、顶部导航、UIUX 侧栏、列表和详情拼装方式。
- `src/data.js`：2,612 条 `uiItems` 及详情/预览字段；本 PRD 要求这些条目全部进入新展示契约。
- `src/styles.css`：现有全局布局、侧栏、列表和详情样式。

### Local reference evidence

- `extra/astryx/apps/docsite/src/app/(docs)/components/page.tsx`
- `extra/astryx/apps/docsite/src/components/ShowcaseThumbnail.tsx`
- `extra/astryx/apps/docsite/src/components/component-detail/ComponentDetailClient.tsx`
- `extra/astryx/apps/docsite/src/components/ThemePackagePage.tsx`
- `extra/astryx/apps/docsite/src/components/SharedTopNav.tsx`
- `extra/astryx/apps/docsite/src/app/(site)/templates/page.tsx`
- `extra/astryx/apps/docsite/src/app/(site)/templates/[slug]/page.tsx`
- `extra/astryx/apps/docsite/src/components/TemplateThumbnail.tsx`
- `extra/astryx/apps/docsite/src/components/TemplatePreviewSurface.tsx`
- `extra/astryx/apps/docsite/src/components/TemplatePreviewDialog.tsx`
- `extra/astryx/apps/docsite/src/components/templateComponents.ts`
- `extra/astryx/packages/themes/*`

### Tooling note

当前仓库未发现 `docs/spec.md`、`.ai/harness/policy.json`、PRD 模板或 `check-task-workflow.sh` 严格校验脚本；本 PRD 依据 `PRODUCT.md`、`README.md`、当前源代码和本地 Astryx 参考编写，使用 Draft 状态等待产品确认。

## Open Questions

以下问题不阻塞本阶段按默认决策实施，但应在 Sprint 规划时登记：

1. 是否在 UIUX 详情页提供“列表/网格”个人偏好切换？默认不做，避免增加主视图分叉。
2. 是否将主题扩展到 `全部`、工作台和特效？默认不做，待 UIUX token 稳定且有跨页面需求后单独立项。
3. 是否需要真正的服务端搜索？默认不做，当前本地数据规模先通过派生索引和分段渲染解决。

## Definition of Done

本 PRD 对应的实现只有在以下条件全部满足时才算完成：

1. P0 acceptance criteria 全部通过；
2. 现有入口、数据和特效页完成回归；
3. Gallery、详情、主题三条核心路径均有浏览器验证证据；
4. 性能基线、运行时异常状态和键盘可达性已记录；
5. 2,612 条 UIUX 条目全部完成 Gallery/预览/详情迁移，且每条 `preview='rewritten'`、迁移清单中 `blocked=0`；
6. 每条组件都有 term/anatomy/state/interaction 的准确性证据，不能以 generic placeholder 或旧 mini preview 计入完成；
7. 未引入 Astryx runtime，且 `git diff` 能明确区分本需求改动与工作区既有改动。
