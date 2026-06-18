# Interaction Translator：Skill + 简易网页 Demo 需求文档

## 1. 项目概述

### 1.1 项目名称

**Interaction Translator**

可选命名：

- Web Interaction Design Assistant
- UX Pattern Copilot
- UI Interaction Doctor
- Interaction Spec Generator

本文档中统一称为 **Interaction Translator**。

---

### 1.2 一句话描述

Interaction Translator 是一个面向 Web Coding 场景的交互辅助工具，帮助非专业 UI/UX 用户把“点一下、弹出来、hover、下拉、拉伸、跳转”等模糊描述，转换成专业的交互模式、组件建议、可访问性要求和前端实现规范。

---

### 1.3 产品形态

本项目第一阶段包含两个部分：

1. **Skill / 规则包**  
   作为底层判断能力，用于 ChatGPT、Codex、Cursor、Claude Code、IDE Agent 等 AI coding 场景。

2. **简易网页 Demo**  
   作为可视化入口，让非专业用户输入自然语言交互需求，获得交互拆解、组件推荐和前端规范。

两者共享同一套底层规则：

- 交互术语词典
- 模糊词判断规则
- 组件映射表
- 可访问性检查清单
- 反模式规则
- 输出模板

---

## 2. 背景与问题

### 2.1 背景

越来越多非专业开发者、产品经理、设计新手和 AI coding 用户开始直接参与 Web 页面开发。他们可能知道自己想要什么效果，但无法准确表达交互需求。

常见表达包括：

- “这个地方点一下展开一下”
- “鼠标放上去弹个东西”
- “点了以后跳一下”
- “这个模块要能拉伸”
- “做一个下拉”
- “弹出一个小框”
- “卡片 hover 的时候显示详情”

这些表达对用户来说很自然，但对前端实现来说存在大量歧义。

例如：

用户说“弹窗”，可能指：

- Dialog
- Drawer
- Popover
- Tooltip
- Toast
- Alert

用户说“下拉”，可能指：

- Select
- Combobox
- Dropdown Menu
- Popover
- Disclosure

用户说“拉伸”，可能指：

- responsive layout
- flex grow
- resize handle
- resizable panel
- expand / collapse

如果这些语义没有在 coding 前澄清，AI 或前端很容易生成不专业、不一致、不可访问或难维护的交互。

---

### 2.2 主要痛点

#### 痛点 1：非专业用户说不清楚交互

用户经常使用模糊动词，例如“弹、跳、伸缩、拉开、浮起来”。这些词没有对应唯一的组件。

#### 痛点 2：AI coding 容易照字面实现

用户说“弹窗”，AI 可能默认生成 Modal，但用户真正想要的可能是 Drawer 或 Popover。

#### 痛点 3：设计、产品、前端语言不统一

同一个交互在团队中可能被不同人叫成不同名字，导致实现偏差。

#### 痛点 4：交互可访问性容易被忽略

常见问题包括：

- hover-only 关键信息
- `div onClick` 模拟按钮
- 弹层没有焦点管理
- 关闭浮层后焦点不返回
- Dropdown、Select、Menu 混用
- 删除操作没有确认
- 移动端没有替代交互

#### 痛点 5：用户不知道该参考哪个开源组件

用户可能听过 shadcn/ui、Radix、MUI、Ant Design、Headless UI，但不知道当前需求应该用哪个模式、哪个组件。

---

## 3. 产品目标

### 3.1 核心目标

构建一个轻量工具，让用户可以用自然语言描述交互需求，系统自动输出：

1. 用户真实意图拆解
2. 专业交互术语
3. 推荐组件模式
4. 不推荐的错误模式
5. 前端交互规范
6. 可访问性检查点
7. 推荐开源组件
8. 可复制给 AI coding agent 或前端的实现说明

---

### 3.2 MVP 目标

第一版 MVP 重点验证：

- 用户是否需要“交互意图翻译”
- 规则包是否能稳定判断高频模糊交互
- 网页 Demo 是否能降低非专业用户使用门槛
- 输出结果是否能直接用于前端开发或 AI coding

MVP 不追求完整设计系统，不做复杂组件库，不直接生成完整页面代码。

---

### 3.3 非目标

第一阶段暂不做：

- 完整 UI 设计稿生成
- 自动生成完整前端项目
- Figma 插件
- VS Code 插件
- PR Review Bot
- CLI 静态扫描
- 多团队权限系统
- 复杂设计系统管理
- 组件源码自动替换

这些可作为后续阶段扩展。

---

## 4. 目标用户

### 4.1 主要用户

#### 1. AI Coding 用户

特点：

- 使用 ChatGPT、Codex、Cursor、Claude Code 等工具生成网页
- 会描述页面目标，但不熟悉专业交互术语
- 希望 prompt 更准确，减少返工

典型需求：

> 帮我把这个交互说清楚，让 AI 生成出来不要乱。

---

#### 2. 独立开发者

特点：

- 会写代码，但不是专业设计师
- 需要快速做出可用、合理的 Web 页面
- 对组件库有一定了解，但不知道何时该用哪个组件

典型需求：

> 这里应该用 Popover 还是 Dialog？

---

#### 3. 产品经理 / 创业者

特点：

- 能描述业务需求
- 不一定能写前端 spec
- 需要把需求交给前端或 AI coding 工具

典型需求：

> 帮我把这个页面需求写成前端能懂的交互说明。

---

#### 4. 初级前端

特点：

- 会实现界面
- 但对交互模式、可访问性、组件语义不够熟悉

典型需求：

> 我这样写交互合理吗？有没有更专业的做法？

---

### 4.2 次要用户

#### 1. 设计师

用于补充设计稿缺失的交互说明。

#### 2. 小团队负责人

用于统一团队内部交互语言。

#### 3. 设计系统维护者

用于沉淀常见交互模式和反模式。

---

## 5. 核心使用场景

### 5.1 场景一：模糊交互翻译

用户输入：

> 我想让这个按钮点一下弹出一个可以选东西的小框。

系统输出：

```md
你可能想要的是：Popover + Select

原因：
- “点一下”是 click trigger
- “弹出小框”是 anchored floating layer
- “可以选东西”说明内容可交互
- Tooltip 不适合，因为 Tooltip 不应该包含可交互表单内容

前端描述：
点击按钮打开 Popover，Popover 内包含 Select。Popover 支持 Escape 关闭，点击外部关闭，关闭后焦点回到触发按钮。
```

---

### 5.2 场景二：组件选择判断

用户输入：

> 这个地方应该用弹窗还是抽屉？

系统输出：

```md
判断规则：

如果用户必须完成当前任务才能继续，用 Dialog。
如果只是从当前页面查看或编辑详情，用 Drawer / Sheet。

推荐：Drawer / Sheet

原因：
你描述的是在当前列表页查看详情，不需要阻断整个任务流。
```

---

### 5.3 场景三：生成前端交互规范

用户输入：

> 给我写一个用户列表页的筛选面板交互规范。

系统输出：

```md
筛选面板交互规范：

入口：
- 点击“筛选”按钮打开 Filter Popover
- 移动端改为 Drawer

内容：
- 状态：Select
- 关键词：Input
- 日期：Date Range Picker
- 多选标签：Checkbox Group

操作：
- 应用筛选
- 重置筛选
- 关闭面板

可访问性：
- Escape 关闭
- 关闭后焦点回到筛选按钮
- Tab 顺序符合视觉顺序
```

---

### 5.4 场景四：审查已有交互方案

用户输入：

> 我想让 hover 的时候显示删除按钮，这样可以吗？

系统输出：

```md
不建议。

问题：
- 删除是关键操作，不应该只在 hover 中出现
- 移动端没有稳定 hover
- 键盘用户可能无法发现

推荐：
- 操作按钮常驻显示，或
- 提供“更多操作”按钮，点击打开 Dropdown Menu
- 删除前使用 Confirm Dialog
```

---

### 5.5 场景五：AI Coding Prompt 导出

用户输入自然语言需求后，系统输出一段可复制给 coding agent 的 prompt：

```md
请实现一个商品卡片组件：

- 图片和标题使用 Link，点击进入商品详情页
- 卡片 hover 只做视觉反馈，不显示关键内容
- “购买”使用 Button，点击后进入 loading 状态，完成后显示 Toast
- “更多参数”使用 Button 打开 Drawer
- Drawer 支持 Escape 关闭，关闭后焦点回到触发按钮
- 移动端不依赖 hover
- 使用 shadcn/ui 的 Button、Drawer、Toast 组件
```

---

## 6. 产品整体架构

### 6.1 架构图

```txt
                  ┌──────────────────────┐
                  │     Web Demo UI        │
                  │ 输入 / 选择 / 导出       │
                  └──────────┬───────────┘
                             │
┌──────────────────────┐     │     ┌──────────────────────┐
│ ChatGPT / Codex Skill │─────┼─────│ Future IDE Plugin      │
└──────────────────────┘     │     └──────────────────────┘
                             │
                  ┌──────────▼───────────┐
                  │ Interaction Engine    │
                  │ 规则判断 / 模式推荐     │
                  └──────────┬───────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼────────┐ ┌───────▼─────────┐ ┌──────▼──────────┐
│ Glossary          │ │ Component Map    │ │ Accessibility   │
│ 模糊词 → 专业词     │ │ 模式 → 组件       │ │ 可访问性规则      │
└──────────────────┘ └─────────────────┘ └─────────────────┘
```

---

### 6.2 两个交付物

#### 交付物 A：Skill / 规则包

目录结构：

```txt
web-interaction-design-assistant/
  SKILL.md
  interaction-glossary.md
  component-map.md
  ambiguity-rules.md
  accessibility-checklist.md
  examples.md
  anti-patterns.md
```

#### 交付物 B：简易网页 Demo

功能结构：

```txt
Web Demo
  输入区
  交互意图拆解区
  推荐模式区
  前端规范区
  风险提醒区
  组件参考区
  Prompt 导出区
```

---

## 7. Skill 需求

### 7.1 Skill 定位

Skill 是底层“大脑”，负责判断用户的模糊描述应该对应什么交互模式。

它应该服务于：

- ChatGPT 对话
- Codex / AI coding
- Cursor / IDE agent
- 后续 Web Demo 的提示词与规则

---

### 7.2 Skill 触发条件

当用户输入内容涉及以下任意主题时，应该触发：

- Web UI 交互
- 前端组件行为
- UI/UX 术语澄清
- 页面交互设计
- 组件选择
- 交互审查
- 可访问性问题
- AI coding prompt 优化

关键词包括但不限于：

```txt
点击、点一下、hover、鼠标放上去、跳转、弹窗、弹出、浮层、下拉、展开、收起、伸缩、拉伸、滑出、抽屉、提示、加载、禁用、选中、筛选、菜单、卡片、详情、表单、按钮
```

---

### 7.3 Skill 核心能力

Skill 必须具备以下能力：

#### 能力 1：模糊词识别

识别用户描述中的模糊交互词。

示例：

```txt
用户：点一下弹出来一个能选东西的小框
识别：
- 点一下 → click trigger
- 弹出来 → overlay / floating layer
- 能选东西 → interactive selection
- 小框 → anchored popover candidate
```

---

#### 能力 2：交互模式判断

将模糊词映射到候选模式：

```txt
弹出来 → Dialog / Drawer / Popover / Tooltip / Toast / Alert
下拉 → Select / Combobox / Menu / Popover / Disclosure
展开 → Disclosure / Accordion / Collapsible
拉伸 → Stretch / Resize / Responsive / Expand
```

---

#### 能力 3：歧义澄清

当多个模式都有可能时，最多问 1–3 个选择题。

示例：

```md
你说的“弹出来”更像哪一种？

A. 必须处理的弹窗
B. 右侧滑出的详情面板
C. 按钮旁边的小浮层
D. 操作完成后的临时提示
```

如果用户目标已经足够明确，不需要过度追问，应该直接做合理假设并说明。

---

#### 能力 4：推荐最佳模式

输出最合适的模式，并说明为什么。

示例：

```md
推荐：Popover + Select

原因：
- 内容出现在按钮旁边
- 内容可交互
- 用户不需要被阻塞在当前任务中
- 因此不适合 Tooltip，也不需要 Dialog
```

---

#### 能力 5：生成前端交互规范

规范必须包括：

- Trigger
- Component / Pattern
- States
- Visual feedback
- Keyboard behavior
- Focus behavior
- Mobile behavior
- Animation
- Accessibility
- Edge cases

---

#### 能力 6：可访问性审查

必须检查：

- 是否支持键盘操作
- 是否有 visible focus
- 是否依赖 hover-only
- 是否使用正确语义元素
- 浮层是否支持 Escape 关闭
- 关闭后焦点是否返回
- 移动端是否可用
- 动效是否尊重 reduced motion

---

#### 能力 7：反模式提醒

常见反模式包括：

- `div onClick` 模拟按钮
- hover-only critical content
- Tooltip 中放按钮或表单
- 同一个点击目标既跳转又展开
- 删除操作没有确认
- Dialog、Drawer、Popover 混用
- Select、Menu、Combobox 混用
- 浮层没有焦点管理
- 移动端没有替代交互

---

#### 能力 8：组件库推荐

根据模式推荐组件库：

- Radix UI
- shadcn/ui
- React Aria
- Headless UI
- MUI
- Ant Design
- Chakra UI
- Floating UI
- Motion

---

### 7.4 Skill 输出格式

默认输出格式：

```md
## 我理解你的需求

## 更准确的专业说法

## 推荐交互模式

## 需要确认的点

## 交互规范

## 可参考组件

## 前端实现提示

## 常见错误
```

如果用户要求简洁，则压缩为：

```md
推荐模式：
原因：
前端描述：
注意事项：
```

---

### 7.5 Skill 文件说明

#### SKILL.md

定义 skill 的目的、触发条件、工作流、输出格式、澄清策略、语气。

#### interaction-glossary.md

维护用户常见模糊表达与专业术语映射。

#### component-map.md

维护交互模式与推荐组件库映射。

#### ambiguity-rules.md

维护高频歧义判断规则。

#### accessibility-checklist.md

维护可访问性审查规则。

#### examples.md

维护典型输入输出案例。

#### anti-patterns.md

维护常见错误和纠偏建议。

---

## 8. 简易网页 Demo 需求

### 8.1 Demo 定位

网页 Demo 是面向非专业用户的可视化交互翻译器。

它不需要完整登录系统，也不需要复杂项目管理，MVP 只需要完成：

> 输入一句交互描述 → 输出交互拆解、推荐组件、前端规范和可复制 prompt。

---

### 8.2 核心页面

MVP 只有一个主页面。

页面名称：

```txt
Interaction Translator
```

页面结构：

```txt
顶部导航
主输入区
结果展示区
导出区
示例区
```

---

### 8.3 页面布局建议

#### 桌面端布局

```txt
┌──────────────────────────────────────────────┐
│ Header                                       │
│ Interaction Translator                       │
├──────────────────────────────────────────────┤
│                                              │
│ Left Panel                  Right Panel       │
│ ┌───────────────────┐      ┌───────────────┐ │
│ │ 用户输入           │      │ 推荐结果        │ │
│ │ 示例按钮           │      │ 交互规范        │ │
│ │ 模式选择           │      │ 风险提醒        │ │
│ │ Generate 按钮      │      │ Prompt 导出     │ │
│ └───────────────────┘      └───────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

#### 移动端布局

```txt
Header
Input Card
Generate Button
Result Cards
Export Prompt
Examples
```

---

### 8.4 输入区需求

输入区包含：

1. 自然语言输入框
2. 使用场景选择
3. 技术栈选择
4. 输出详细度选择
5. 生成按钮

#### 字段 1：自然语言输入

类型：textarea

placeholder：

```txt
例如：我想让这个按钮点一下弹出一个可以选东西的小框
```

要求：

- 支持中文输入
- MVP 主要支持中文
- 最小字数不限制
- 空输入时点击生成要提示用户输入需求

---

#### 字段 2：使用场景选择

类型：segmented control 或 select

选项：

```txt
交互翻译
组件选择
生成前端规范
审查交互方案
生成 AI Coding Prompt
```

默认：交互翻译

---

#### 字段 3：技术栈选择

类型：select 或 checkbox group

选项：

```txt
通用
React
Vue
Next.js
Tailwind
shadcn/ui
Radix UI
MUI
Ant Design
```

默认：通用

MVP 可以先只影响输出中的“可参考组件”和“前端实现提示”。

---

#### 字段 4：输出详细度

类型：segmented control

选项：

```txt
简洁
标准
详细
```

默认：标准

---

#### 字段 5：生成按钮

文案：

```txt
生成交互建议
```

状态：

- default
- loading
- disabled
- error

---

### 8.5 示例输入区

提供几个一键示例：

```txt
卡片 hover 显示详情，点击跳转
点按钮弹出可以选择东西的小框
用户列表页筛选面板
表格行点击查看详情，右上角还有更多操作
hover 显示删除按钮
让一个面板可以左右拉伸
```

点击示例后自动填入输入框。

---

### 8.6 结果展示区需求

结果展示区包括以下模块。

#### 模块 1：意图拆解

展示系统识别出的用户意图。

示例：

```md
识别到的交互意图：

- 触发方式：点击
- 展示形式：浮层
- 内容类型：可交互选择
- 可能组件：Popover / Select / Combobox
```

---

#### 模块 2：推荐模式

展示首选模式和备选模式。

示例：

```md
首选：Popover + Select

备选：Dialog / Combobox

不建议：Tooltip
```

每个模式需要包含：

- 名称
- 简短解释
- 推荐理由
- 适用场景
- 不适用场景

---

#### 模块 3：判断理由

解释为什么推荐这个模式。

示例：

```md
推荐 Popover 的原因：

- 它由按钮触发
- 它出现在触发器附近
- 内容是轻量操作
- 不需要阻塞整个页面
```

---

#### 模块 4：需要确认的点

如果存在关键歧义，展示选择题。

示例：

```md
需要确认：

你说的“小框”是否需要用户必须完成后才能继续？

A. 是，需要阻塞页面 → Dialog
B. 否，只是临时选择 → Popover
C. 它从右侧滑出 → Drawer
```

MVP 可以先不做真正交互式追问，只在结果中展示建议问题。

---

#### 模块 5：前端交互规范

必须输出结构化 spec：

```md
交互规范：

Trigger：点击按钮
Pattern：Popover + Select
States：closed / open / selected / disabled / loading
Keyboard：Enter / Space 打开，Escape 关闭，Tab 在浮层内移动
Focus：打开后焦点进入第一个可交互元素，关闭后返回触发按钮
Mobile：不依赖 hover，点击打开；小屏可考虑 Drawer
Animation：150–200ms fade + scale
Accessibility：使用 button 触发，不使用 div onClick
```

---

#### 模块 6：常见错误

根据输入提示可能出现的问题。

示例：

```md
常见错误：

- 不要用 Tooltip 承载可交互内容
- 不要只靠 hover 显示关键信息
- 不要让同一个点击目标既跳转又打开弹层
- 不要用 div onClick 模拟按钮
```

---

#### 模块 7：推荐组件

根据技术栈输出组件建议。

示例：

```md
可参考组件：

- shadcn/ui：Popover、Select、Command
- Radix UI：Popover、Select
- React Aria：Select、ComboBox
- Floating UI：自定义浮层定位
```

---

#### 模块 8：AI Coding Prompt 导出

输出一段可复制给 AI coding 工具的 prompt。

示例：

```md
请实现一个按钮触发的 Popover 选择器：

- 使用 button 作为触发器
- 点击按钮打开 Popover
- Popover 内包含 Select，用于选择一个选项
- 支持 Escape 关闭和点击外部关闭
- 关闭后焦点回到触发按钮
- 移动端不依赖 hover
- 不要用 Tooltip 承载可交互内容
- 技术栈：React + Tailwind + shadcn/ui
```

需要提供复制按钮。

---

### 8.7 空状态

初始页面未生成结果时，右侧展示说明：

```md
输入一个你想做的交互，例如：

“我想让卡片 hover 的时候显示详情，点击可以跳转。”

系统会帮你判断：
- 应该叫什么
- 应该用什么组件
- 哪些交互容易出错
- 前端该怎么实现
```

---

### 8.8 Loading 状态

生成过程中展示：

```txt
正在拆解交互意图...
```

或分步骤提示：

```txt
识别模糊词 → 匹配交互模式 → 生成前端规范
```

---

### 8.9 Error 状态

如果生成失败：

```md
生成失败，请稍后重试。

你也可以尝试把需求描述得更具体，例如：
- 谁触发？
- 出现什么？
- 用户接下来要做什么？
```

---

## 9. Interaction Engine 规则需求

### 9.1 输入

Interaction Engine 接收以下输入：

```json
{
  "userText": "我想让这个按钮点一下弹出一个可以选东西的小框",
  "mode": "interaction_translation",
  "techStack": ["React", "Tailwind", "shadcn/ui"],
  "detailLevel": "standard"
}
```

---

### 9.2 输出

返回结构化 JSON，供网页渲染：

```json
{
  "understanding": "你想做一个点击按钮后出现的小型可交互浮层，用于选择内容。",
  "detectedIntents": [
    {
      "label": "触发方式",
      "value": "点击 / click"
    },
    {
      "label": "展示方式",
      "value": "按钮旁边的小型浮层"
    },
    {
      "label": "内容类型",
      "value": "可交互选择"
    }
  ],
  "recommendedPattern": {
    "name": "Popover + Select",
    "reason": "内容由按钮触发，出现在触发器附近，并包含可交互选择。"
  },
  "alternatives": [
    {
      "name": "Dialog",
      "whenToUse": "当用户必须完成选择后才能继续时使用。"
    },
    {
      "name": "Combobox",
      "whenToUse": "当用户需要输入搜索并选择时使用。"
    }
  ],
  "notRecommended": [
    {
      "name": "Tooltip",
      "reason": "Tooltip 不适合承载可交互内容。"
    }
  ],
  "interactionSpec": {
    "trigger": "点击按钮",
    "states": ["closed", "open", "selected", "disabled"],
    "keyboard": "Enter / Space 打开，Escape 关闭，Tab 移动焦点。",
    "focus": "关闭后焦点回到触发按钮。",
    "mobile": "不依赖 hover，小屏可考虑 Drawer。",
    "animation": "150–200ms fade + scale。",
    "accessibility": [
      "使用 button 作为触发器",
      "不要使用 div onClick 模拟按钮",
      "浮层关闭后恢复焦点"
    ]
  },
  "componentSuggestions": [
    "shadcn/ui Popover + Select",
    "Radix UI Popover + Select",
    "React Aria Select / ComboBox"
  ],
  "antiPatterns": [
    "不要用 Tooltip 放可交互内容",
    "不要只依赖 hover",
    "不要让同一个点击目标同时跳转和打开浮层"
  ],
  "codingPrompt": "请实现一个按钮触发的 Popover 选择器..."
}
```

---

### 9.3 MVP 规则实现方式

MVP 可以不做复杂模型微调，而使用：

1. Prompt-based LLM 判断
2. 静态规则表
3. 关键词匹配
4. 模板化输出

推荐方式：

```txt
用户输入
→ 关键词和意图初筛
→ 构造系统 prompt
→ LLM 生成结构化 JSON
→ 前端渲染
```

---

## 10. 核心规则表

### 10.1 模糊词映射表

| 用户常说 | 候选专业术语 | 判断重点 |
|---|---|---|
| 点一下 | Click / Press / Tap | 是动作还是导航？ |
| hover | Hover state / Tooltip / Hover Card | 是否承载关键信息？ |
| 跳转 | Link / Navigation / Route transition | 是页面跳转还是状态变化？ |
| 弹出来 | Dialog / Popover / Tooltip / Toast / Drawer | 是否阻塞？是否可交互？ |
| 下拉 | Select / Menu / Combobox / Popover | 是选择值还是执行动作？ |
| 展开 | Disclosure / Accordion / Collapsible | 是单个区域还是多个区域？ |
| 收起 | Collapse / Hide / Minimize | 是隐藏内容还是关闭浮层？ |
| 拉伸 | Resize / Stretch / Responsive / Expand | 是布局还是用户拖拽？ |
| 滑出来 | Drawer / Sheet / Slide-over | 从哪边出现？是否遮罩？ |
| 悬浮 | Floating / Sticky / Hover | 是固定位置还是 hover？ |
| 提示 | Tooltip / Toast / Alert / Inline message | 是辅助说明还是反馈？ |
| 禁用 | Disabled / Readonly / Loading | 是不能操作还是提交中？ |

---

### 10.2 弹出类判断规则

```txt
用户说：弹出 / 弹窗 / 弹层 / 小框

Q1：是否必须处理后才能继续？
- 是 → Dialog
- 否 → Q2

Q2：是否从屏幕边缘滑出？
- 是 → Drawer / Sheet
- 否 → Q3

Q3：是否是临时通知？
- 是 → Toast
- 否 → Q4

Q4：是否包含按钮、表单、链接等可交互内容？
- 是 → Popover
- 否 → Q5

Q5：是否只是简短说明？
- 是 → Tooltip
- 否 → Popover / Inline content
```

---

### 10.3 下拉类判断规则

```txt
用户说：下拉 / dropdown

Q1：用户是在选择一个表单值吗？
- 是 → Select

Q2：用户需要输入搜索吗？
- 是 → Combobox / Autocomplete

Q3：用户是在选择一个操作吗？
- 是 → Dropdown Menu / Menu Button

Q4：用户只是展开一块内容吗？
- 是 → Disclosure

Q5：用户要打开自定义内容区吗？
- 是 → Popover
```

---

### 10.4 hover 判断规则

```txt
用户说：hover / 鼠标放上去 / 悬停

Q1：hover 内容是否是关键任务信息？
- 是 → 不建议 hover-only，提供 click / focus / tap 替代

Q2：hover 内容是否包含交互元素？
- 是 → 不用 Tooltip，改用 Popover / Hover Card + click alternative

Q3：hover 是否只是视觉反馈？
- 是 → 可用 hover state

Q4：移动端是否需要访问同样内容？
- 是 → 必须提供点击入口
```

---

### 10.5 点击判断规则

```txt
用户说：点击 / 点一下

Q1：点击后是否进入另一个页面或 URL？
- 是 → Link

Q2：点击后是否改变当前页面状态？
- 是 → Button

Q3：点击后是否提交表单或执行操作？
- 是 → Button

Q4：点击后是否展开内容？
- 是 → Button + Disclosure / Accordion

Q5：点击后是否打开浮层？
- 是 → Button + Dialog / Popover / Drawer
```

---

### 10.6 拉伸判断规则

```txt
用户说：拉伸 / 伸缩

Q1：是元素自动填满容器吗？
- 是 → Stretch / flex: 1 / fill container

Q2：是响应屏幕变化吗？
- 是 → Responsive layout

Q3：是用户拖拽改变大小吗？
- 是 → Resizable panel / Splitter

Q4：是点击后显示更多内容吗？
- 是 → Expand / Collapse / Accordion

Q5：是保持图片或视频比例吗？
- 是 → Aspect ratio
```

---

## 11. 组件映射表

| 模式 | 使用场景 | 推荐组件 |
|---|---|---|
| Dialog | 阻塞任务、确认、复杂表单 | Radix Dialog、shadcn Dialog、MUI Dialog、Ant Modal |
| Alert Dialog | 危险确认、删除确认 | Radix Alert Dialog、shadcn Alert Dialog |
| Drawer / Sheet | 侧边详情、编辑面板 | shadcn Sheet、MUI Drawer、Ant Drawer |
| Popover | 按钮旁轻量可交互内容 | Radix Popover、shadcn Popover、Floating UI |
| Tooltip | 非关键短说明 | Radix Tooltip、shadcn Tooltip、MUI Tooltip |
| Hover Card | hover 预览信息 | Radix Hover Card、shadcn Hover Card |
| Toast | 临时反馈 | Sonner、Radix Toast、MUI Snackbar、Ant Message |
| Select | 选择一个表单值 | Radix Select、shadcn Select、MUI Select、Ant Select |
| Combobox | 搜索并选择 | React Aria ComboBox、MUI Autocomplete、shadcn Command |
| Dropdown Menu | 操作菜单 | Radix Dropdown Menu、shadcn Dropdown Menu |
| Accordion | 多个区域展开收起 | Radix Accordion、shadcn Accordion |
| Disclosure | 单一区域显示隐藏 | Headless UI Disclosure、Collapsible |
| Tabs | 同层级内容切换 | Radix Tabs、shadcn Tabs、MUI Tabs |
| Resizable Panel | 拖拽改变尺寸 | react-resizable-panels |
| Sticky Header | 滚动吸顶 | CSS position: sticky |

---

## 12. 网页 Demo 用户流程

### 12.1 基础流程

```txt
打开页面
→ 输入交互描述
→ 选择使用场景和技术栈
→ 点击生成
→ 查看交互拆解
→ 查看推荐模式
→ 查看前端规范
→ 复制 AI Coding Prompt
```

---

### 12.2 示例流程

用户输入：

```txt
我想让卡片 hover 的时候显示详情，点击可以跳转。
```

系统输出：

```md
识别：
- hover 显示详情
- 点击跳转

问题：
- hover 不应承载关键详情
- 卡片点击跳转应使用 Link

推荐：
- hover 只做视觉反馈
- 卡片主体使用 Link 进入详情页
- 如果需要快速预览，增加“快速查看”按钮打开 Drawer 或 Dialog

前端描述：
卡片 hover 时改变阴影和边框，不展示关键内容。卡片标题和图片作为 Link。右上角提供“快速查看”按钮，点击打开 Drawer。
```

---

## 13. 网页 Demo 功能清单

### 13.1 P0 必须有

- 自然语言输入
- 使用场景选择
- 技术栈选择
- 生成按钮
- 意图拆解展示
- 推荐模式展示
- 前端交互规范展示
- 常见错误提醒
- 推荐组件展示
- AI Coding Prompt 输出
- 复制按钮
- 示例输入
- Loading / Error / Empty 状态

---

### 13.2 P1 可以有

- 交互式追问
- 推荐模式卡片对比
- 用户选择一个模式后重新生成 spec
- 输出 Markdown 文件
- 保存历史记录
- 分享链接
- 中英文术语对照
- 一键导出到 Linear / Jira 格式

---

### 13.3 P2 后续扩展

- 组件代码生成
- Figma 插件
- VS Code / Cursor 插件
- PR Review Bot
- CLI 扫描工具
- 团队自定义组件库映射
- 设计系统集成
- 多语言支持

---

## 14. 页面组件需求

### 14.1 Header

内容：

- 产品名称：Interaction Translator
- 副标题：把模糊交互描述转换成专业前端规范
- 可选链接：Examples / Docs / GitHub

---

### 14.2 Input Card

包含：

- textarea
- use case select
- tech stack selector
- detail level selector
- generate button

---

### 14.3 Example Chips

示例按钮：

- 卡片 hover 显示详情，点击跳转
- 点按钮弹出可选择的小框
- 用户列表筛选面板
- 表格行点击查看详情
- hover 显示删除按钮
- 面板可以左右拉伸

---

### 14.4 Result Summary Card

展示：

- 我理解你的需求
- 推荐模式
- 不推荐模式

---

### 14.5 Intent Breakdown Card

展示识别出的：

- Trigger
- Target
- State
- Overlay
- Navigation
- Layout
- Feedback

---

### 14.6 Pattern Recommendation Card

展示：

- 首选模式
- 备选模式
- 不推荐模式
- 判断理由

---

### 14.7 Interaction Spec Card

展示：

- Trigger
- States
- Keyboard
- Focus
- Mobile
- Animation
- Accessibility
- Edge cases

---

### 14.8 Component Suggestions Card

展示：

- 推荐组件库
- 对应组件
- 适合技术栈

---

### 14.9 Anti-patterns Card

展示：

- 常见错误
- 风险
- 替代方案

---

### 14.10 Prompt Export Card

展示：

- 可复制 AI coding prompt
- 复制按钮
- 可选 Markdown 下载

---

## 15. 推荐技术方案

### 15.1 前端技术栈

建议：

```txt
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

原因：

- 快速搭建 demo
- shadcn/ui 适合展示组件模式
- Tailwind 方便做简洁界面
- Next.js 方便后续接 API

---

### 15.2 后端 / API

MVP 可以使用：

```txt
Next.js API Route
LLM API
JSON schema validation
```

接口：

```txt
POST /api/analyze-interaction
```

请求：

```json
{
  "userText": "我想让按钮点一下弹出可选择的小框",
  "mode": "interaction_translation",
  "techStack": ["React", "shadcn/ui"],
  "detailLevel": "standard"
}
```

响应：

```json
{
  "understanding": "...",
  "recommendedPattern": "...",
  "interactionSpec": {},
  "codingPrompt": "..."
}
```

---

### 15.3 规则存储

MVP 可以用 Markdown / JSON 文件存储：

```txt
/rules/glossary.json
/rules/component-map.json
/rules/ambiguity-rules.json
/rules/anti-patterns.json
/rules/accessibility-checklist.json
```

后续可升级为数据库或 CMS。

---

## 16. API 需求

### 16.1 Analyze Interaction API

#### Endpoint

```txt
POST /api/analyze-interaction
```

#### Request Body

```ts
type AnalyzeInteractionRequest = {
  userText: string;
  mode: "translate" | "choose_component" | "generate_spec" | "review" | "coding_prompt";
  techStack: string[];
  detailLevel: "brief" | "standard" | "detailed";
};
```

#### Response Body

```ts
type AnalyzeInteractionResponse = {
  understanding: string;
  detectedIntents: Array<{
    label: string;
    value: string;
    confidence?: "low" | "medium" | "high";
  }>;
  recommendedPattern: {
    name: string;
    summary: string;
    reason: string;
  };
  alternatives: Array<{
    name: string;
    whenToUse: string;
  }>;
  notRecommended: Array<{
    name: string;
    reason: string;
  }>;
  clarificationQuestions: Array<{
    question: string;
    options: Array<{
      label: string;
      result: string;
    }>;
  }>;
  interactionSpec: {
    trigger: string;
    pattern: string;
    states: string[];
    visualFeedback: string;
    keyboard: string;
    focus: string;
    mobile: string;
    animation: string;
    accessibility: string[];
    edgeCases: string[];
  };
  componentSuggestions: Array<{
    library: string;
    components: string[];
    note: string;
  }>;
  antiPatterns: Array<{
    issue: string;
    recommendation: string;
  }>;
  codingPrompt: string;
};
```

---

## 17. Prompt 设计需求

### 17.1 System Prompt 核心要求

LLM 应该遵守：

```md
你是 Web Interaction Design Assistant。
你的任务是把用户的模糊 Web 交互描述转换成专业交互模式、组件建议、前端规范和可访问性要求。

不要只解释术语，要判断用户真正想实现什么。
当存在歧义时，最多提出 1–3 个选择题式澄清。
如果能合理判断，直接给出推荐并说明假设。

必须区分：
- Link vs Button
- Tooltip vs Popover
- Dialog vs Drawer vs Toast
- Select vs Menu vs Combobox
- Accordion vs Disclosure vs Collapsible
- Stretch vs Resize vs Expand

输出必须是结构化 JSON。
```

---

### 17.2 输出原则

- 使用中文输出
- 术语可保留英文
- 解释要短，不要学术化
- 推荐要明确
- 一定要给“不推荐”的模式
- 一定要给前端可执行描述
- 一定要检查 hover、keyboard、mobile、focus

---

## 18. 验收标准

### 18.1 Skill 验收标准

Skill 需要通过以下测试：

#### 测试 1：弹出可选择小框

输入：

```txt
我想让按钮点一下弹出一个可以选东西的小框
```

期望：

- 推荐 Popover + Select 或 Combobox
- 不推荐 Tooltip
- 提醒可交互内容不放 Tooltip
- 给出 Escape、focus return、mobile 说明

---

#### 测试 2：卡片 hover 显示详情并跳转

输入：

```txt
卡片 hover 显示详情，点击跳详情页
```

期望：

- 提醒 hover-only 风险
- 点击跳转使用 Link
- 推荐 hover 仅作为视觉反馈
- 详情可使用 Drawer / Dialog / Preview Button

---

#### 测试 3：下拉搜索选择

输入：

```txt
做一个下拉，可以输入搜索并选择用户
```

期望：

- 推荐 Combobox / Autocomplete
- 不推荐普通 Dropdown Menu
- 说明 Select、Menu、Combobox 区别

---

#### 测试 4：hover 显示删除按钮

输入：

```txt
我想让 hover 的时候显示删除按钮
```

期望：

- 不建议 hover-only
- 提醒移动端和键盘问题
- 推荐常驻操作按钮或 Dropdown Menu
- 删除使用 Confirm Dialog

---

#### 测试 5：左右拉伸面板

输入：

```txt
我想让左侧面板可以左右拉伸
```

期望：

- 推荐 Resizable Panel / Splitter
- 区分 Stretch 和 Resize
- 提醒拖拽 handle、键盘替代、最小最大宽度

---

### 18.2 网页 Demo 验收标准

MVP 页面必须满足：

- 用户可以输入自然语言需求
- 用户可以点击示例填入输入框
- 点击生成后可以看到结构化结果
- 结果至少包含：理解、推荐模式、规范、错误提醒、组件建议、prompt
- 可以复制 AI Coding Prompt
- 空输入有提示
- 生成中有 loading
- 生成失败有 error
- 页面在桌面和移动端基本可用

---

## 19. MVP 范围

### 19.1 MVP 必做

#### Skill

- SKILL.md
- interaction-glossary.md
- component-map.md
- ambiguity-rules.md
- accessibility-checklist.md
- examples.md
- anti-patterns.md

#### Web Demo

- 单页应用
- 输入框
- 模式选择
- 技术栈选择
- 生成结果
- 复制 prompt
- 示例输入
- 基础响应式布局

#### Engine

- LLM prompt
- JSON schema
- 基础规则文件
- API route

---

### 19.2 MVP 不做

- 用户登录
- 历史记录
- 付费系统
- 团队空间
- Figma 插件
- IDE 插件
- PR Bot
- 自动代码修改
- 多语言完整支持

---

## 20. 后续路线图

### Phase 1：Skill + 简易网页 Demo

目标：验证价值。

功能：

- 交互翻译
- 组件推荐
- 前端规范
- AI coding prompt 导出

---

### Phase 2：增强网页工作台

新增：

- 交互式追问
- 推荐模式对比
- 导出 Markdown
- 保存历史
- 分享链接
- 用户自定义组件库偏好

---

### Phase 3：IDE / Cursor 插件

新增：

- 选中代码后 review interaction
- 检查 div onClick、hover-only、wrong component
- 给出替代组件建议
- 生成修改 prompt

---

### Phase 4：PR Review Bot / CLI

新增：

- 扫描组件实现
- 自动发现交互反模式
- 在 PR 中评论
- 与设计系统规则集成

---

### Phase 5：设计系统集成

新增：

- 团队自定义组件映射
- 内部组件库推荐
- 设计规范同步
- 多项目规则配置

---

## 21. 成功指标

### 21.1 定性指标

- 用户觉得输出能直接复制给前端或 AI coding 工具
- 用户能更清楚地区分 Dialog、Popover、Drawer、Tooltip
- 用户减少“做出来不是我想要的”情况
- 前端认为生成的 spec 可执行

---

### 21.2 定量指标

MVP 可观察：

- 生成次数
- 示例点击率
- Prompt 复制率
- 用户修改后再次生成率
- 用户停留时间
- 用户反馈中“有用”比例

后续可观察：

- 生成 prompt 后代码返工次数
- PR review 命中问题数量
- 团队组件误用减少比例

---

## 22. 风险与应对

### 风险 1：输出太长，用户不看

应对：

- 提供简洁 / 标准 / 详细三种模式
- 默认标准模式
- 重要结论放在最上方

---

### 风险 2：推荐不够准确

应对：

- 对高频模式使用明确决策树
- 输出假设和需要确认的问题
- 提供备选模式和不推荐模式

---

### 风险 3：用户仍然不懂术语

应对：

- 每个英文术语都用一句话解释
- 使用“你可能想要的是……”而不是直接堆术语
- 用例子说明区别

---

### 风险 4：网页 Demo 变得太复杂

应对：

- 第一版只做单页输入和结果
- 不做账户、不做历史、不做项目管理
- 重点验证核心判断能力

---

### 风险 5：Skill 和网页规则不一致

应对：

- Skill 文档和网页规则文件共享同一套内容
- 规则尽量结构化维护
- 后续用 JSON 作为单一事实来源

---

## 23. 第一版开发任务拆解

### 23.1 Skill 任务

- [ ] 编写 SKILL.md
- [ ] 编写 interaction-glossary.md
- [ ] 编写 component-map.md
- [ ] 编写 ambiguity-rules.md
- [ ] 编写 accessibility-checklist.md
- [ ] 编写 examples.md
- [ ] 编写 anti-patterns.md
- [ ] 准备 10 个测试输入
- [ ] 验证输出是否稳定

---

### 23.2 Web Demo 前端任务

- [ ] 搭建 Next.js 项目
- [ ] 配置 Tailwind CSS
- [ ] 配置 shadcn/ui
- [ ] 创建主页面布局
- [ ] 实现 Input Card
- [ ] 实现 Example Chips
- [ ] 实现 Result Cards
- [ ] 实现 Copy Prompt 按钮
- [ ] 实现 Loading / Empty / Error 状态
- [ ] 做基础响应式适配

---

### 23.3 Engine / API 任务

- [ ] 定义 request / response schema
- [ ] 编写 analyze-interaction API
- [ ] 编写 LLM system prompt
- [ ] 加入规则上下文
- [ ] 解析结构化 JSON
- [ ] 做错误处理
- [ ] 加入基础测试用例

---

### 23.4 内容任务

- [ ] 整理 20 个常见用户模糊表达
- [ ] 整理 10 个高频组件模式
- [ ] 整理 10 个常见反模式
- [ ] 整理 5 个完整示例
- [ ] 整理推荐组件库说明

---

## 24. 推荐第一版示例库

MVP 至少内置以下示例：

1. 卡片 hover 显示详情，点击跳转
2. 点按钮弹出可以选择的小框
3. 用户列表页筛选面板
4. 表格行点击查看详情，右上角还有更多操作
5. hover 显示删除按钮
6. 左侧面板可以左右拉伸
7. 下拉可以搜索用户
8. 点击展开更多内容
9. 删除前需要确认
10. 表单提交后提示成功或失败

---

## 25. 结论

Interaction Translator 的第一阶段不应该直接做成复杂产品，而应该采用：

> **Skill 作为底层规则大脑，简易网页 Demo 作为用户可视化入口。**

Skill 负责专业判断，网页负责降低使用门槛。

第一版的核心成功标准是：

> 用户输入一句模糊交互描述，系统能够输出一份前端可以直接理解和执行的专业交互说明。

如果这个闭环成立，后续可以自然扩展到 IDE 插件、PR Review Bot、CLI、Figma 插件和团队设计系统集成。

---

# 第二阶段：产品化增强版详细需求

## 26. 第二阶段目标

MVP 已经验证基础闭环后，第二阶段的重点不再是“能不能生成一份交互建议”，而是把它升级为一个可以持续辅助真实 Web Coding 的交互工作台。

第二阶段的目标是：

1. 从单次问答升级为多轮交互决策。
2. 从文本输出升级为可编辑、可选择、可导出的交互规范。
3. 从通用组件推荐升级为可配置的项目组件库映射。
4. 从模糊词识别升级为规则引擎 + 置信度 + 冲突检测。
5. 从 demo 页面升级为可以服务真实项目的轻量工作流工具。

第二阶段产品定位：

> **面向 AI Coding 和前端协作的 Web Interaction Spec Workspace。**

也就是说，它不只是回答“这个该用什么组件”，而是帮助用户完成：

- 需求澄清
- 模式选择
- 交互规范生成
- 可访问性检查
- 组件库映射
- Prompt 导出
- 结果版本化
- 团队复用

---

## 27. 第二阶段核心能力升级

### 27.1 从一次性生成升级为交互式澄清

MVP 中，如果用户描述有歧义，系统只展示“需要确认的问题”。第二阶段应该让用户可以直接选择答案，并基于答案重新生成更准确的交互规范。

示例：

用户输入：

```txt
我想点一下弹出一个框，里面能选东西。
```

系统判断存在歧义：

```md
你说的“框”更接近哪一种？

A. 按钮旁边的小浮层
B. 居中弹窗，用户必须处理后才能继续
C. 从右侧滑出的面板
D. 只是临时提示
```

用户选择 A 后，系统自动更新：

```md
推荐模式：Popover + Select
```

用户选择 B 后，系统自动更新：

```md
推荐模式：Dialog + Select
```

用户选择 C 后，系统自动更新：

```md
推荐模式：Drawer / Sheet + Select
```

---

### 27.2 从单一推荐升级为模式对比

第二阶段结果页不应只给一个推荐，而应该提供模式对比，让用户理解为什么选择当前模式。

示例：

| 模式 | 推荐程度 | 适合原因 | 风险 |
|---|---:|---|---|
| Popover + Select | 高 | 轻量、贴近触发按钮、内容可交互 | 小屏可能拥挤 |
| Dialog + Select | 中 | 适合阻塞式选择 | 对简单选择过重 |
| Drawer + Select | 中 | 适合复杂配置或移动端 | 桌面端可能显得重 |
| Tooltip | 低 | 适合短说明 | 不适合可交互内容 |

每个候选模式应包含：

- 推荐指数
- 适用条件
- 不适用条件
- 可访问性注意事项
- 移动端适配建议
- 对应组件库实现

---

### 27.3 从输出文本升级为可编辑 Spec

生成结果不应该只是 Markdown 文本，而应该拆成可编辑字段。

例如前端规范应拆成：

```txt
Pattern: Popover + Select
Trigger: Click button
Open behavior: 点击按钮打开
Close behavior: Escape / 点击外部 / 选择后关闭，可配置
Focus behavior: 打开后聚焦第一个可交互元素；关闭后返回触发按钮
Keyboard: Enter / Space 打开，Arrow keys 操作选项，Escape 关闭
Mobile: 小屏保持点击打开；如果内容超过 50% 屏幕高度，切换为 Drawer
Animation: 150–200ms fade + scale
Accessibility: 使用 button，不使用 div onClick，保证可见 focus
```

用户可以编辑每一项，然后重新导出。

---

### 27.4 从通用建议升级为项目配置

用户可以配置项目使用的技术栈和组件库。

示例配置：

```json
{
  "projectName": "Admin Dashboard",
  "framework": "Next.js",
  "styling": "Tailwind CSS",
  "componentLibrary": "shadcn/ui",
  "routing": "Next.js App Router",
  "formLibrary": "React Hook Form",
  "animationLibrary": "Motion",
  "accessibilityLevel": "WCAG-oriented",
  "mobileStrategy": "responsive-first"
}
```

配置后，同一个交互会输出更贴近项目的实现建议：

```md
推荐使用：
- shadcn/ui Popover
- shadcn/ui Select
- React Hook Form Controller 绑定字段
- Tailwind focus-visible 样式
```

---

### 27.5 从建议升级为质量评分

第二阶段可以给交互方案打分。

评分维度：

| 维度 | 分值 | 说明 |
|---|---:|---|
| 清晰度 | 0–100 | 用户意图是否明确 |
| 组件匹配度 | 0–100 | 推荐模式是否适合目标 |
| 可访问性 | 0–100 | 键盘、焦点、语义、移动端是否完整 |
| 实现复杂度 | 0–100 | 前端实现成本是否合理 |
| 移动端适配 | 0–100 | 是否避免 hover-only 和桌面依赖 |
| AI Coding 友好度 | 0–100 | 输出是否适合作为 prompt |

总分示例：

```md
交互方案评分：82 / 100

扣分项：
- hover 承载了部分重要详情
- 移动端替代入口不明确
- Dialog 和 Drawer 的选择仍需确认
```

---

## 28. 第二阶段信息架构

### 28.1 页面结构

第二阶段建议从单页 demo 升级为 5 个核心页面：

```txt
1. Interaction Workspace
2. Pattern Library
3. Project Settings
4. History / Saved Specs
5. Rule Debugger / Evaluation
```

---

### 28.2 Interaction Workspace

核心工作区，用于输入需求、澄清、生成、编辑、导出。

模块：

```txt
Input Panel
Clarification Panel
Pattern Comparison Panel
Spec Editor
Accessibility Review
Component Mapping
Prompt Export
Version History
```

---

### 28.3 Pattern Library

内置交互模式库。

包含：

- Dialog
- Alert Dialog
- Drawer / Sheet
- Popover
- Tooltip
- Hover Card
- Toast
- Select
- Combobox
- Dropdown Menu
- Accordion
- Disclosure
- Tabs
- Resizable Panel
- Sticky Header
- Inline Validation
- Empty State
- Loading State
- Skeleton
- Pagination
- Infinite Scroll
- Stepper
- Breadcrumb
- Command Palette

每个模式页面包含：

```txt
定义
适用场景
不适用场景
常见用户说法
推荐组件库
键盘行为
移动端策略
反模式
示例 prompt
示例代码方向
```

---

### 28.4 Project Settings

项目配置页。

配置项：

```txt
项目名称
前端框架
路由方式
UI 组件库
样式系统
表单库
动画库
目标平台
默认可访问性等级
移动端策略
团队术语偏好
自定义组件映射
```

---

### 28.5 History / Saved Specs

保存用户生成过的交互规范。

支持：

- 搜索
- 标签
- 项目筛选
- 复制 prompt
- 重新生成
- 比较版本
- 导出 Markdown

---

### 28.6 Rule Debugger / Evaluation

面向高级用户和开发者，用于检查规则命中情况。

展示：

```txt
命中的模糊词
候选模式
推荐分数
冲突规则
可访问性风险
最终输出原因
```

示例：

```json
{
  "matchedTerms": ["点一下", "弹出", "选东西"],
  "candidatePatterns": ["Popover", "Dialog", "Drawer", "Tooltip"],
  "rejectedPatterns": [
    {
      "name": "Tooltip",
      "reason": "包含可交互选择内容"
    }
  ],
  "selectedPattern": "Popover + Select",
  "confidence": 0.86
}
```

---

## 29. Interaction Workspace 详细交互需求

### 29.1 输入区域

输入区域应支持多种输入方式。

#### 29.1.1 自然语言输入

用户可以直接输入：

```txt
我想做一个表格，点击一行可以看详情，右侧还能编辑，删除前要确认。
```

要求：

- 支持长文本
- 支持粘贴需求文档片段
- 支持中文为主，英文术语可混用
- 输入时自动保存草稿
- 输入超过一定长度时自动识别多个交互点

---

#### 29.1.2 场景模板输入

提供模板：

```txt
页面级交互
组件级交互
表单交互
列表 / 表格交互
导航交互
浮层交互
移动端适配
交互审查
AI Coding Prompt 优化
```

用户选择模板后，输入提示随之变化。

---

#### 29.1.3 结构化输入

高级模式中，用户可以填写：

```txt
用户触发什么？
出现什么变化？
用户下一步要做什么？
是否会跳转？
是否包含表单？
是否必须完成？
是否要支持移动端？
目标组件库是什么？
```

结构化输入可以降低歧义。

---

### 29.2 自动意图识别

用户输入后，系统应自动识别：

| 类型 | 示例 |
|---|---|
| Trigger | click、hover、focus、drag、scroll、submit |
| Target | card、button、table row、menu item、input |
| Result | open overlay、navigate、expand、select、resize |
| Pattern | Dialog、Popover、Drawer、Select、Combobox |
| Risk | hover-only、click conflict、wrong semantic |
| Platform | desktop、mobile、responsive |
| Complexity | simple、medium、complex |

输出示例：

```md
识别到 4 个交互点：

1. 表格行点击查看详情
2. 右侧详情编辑
3. 删除前确认
4. 删除成功反馈
```

---

### 29.3 多交互点拆分

当输入包含多个交互时，系统必须拆分。

示例输入：

```txt
用户列表里，点一行看详情，右边滑出编辑面板，删除时弹窗确认，成功后提示一下。
```

拆分结果：

| 编号 | 交互点 | 推荐模式 |
|---:|---|---|
| 1 | 点击表格行查看详情 | Row action / Link / Drawer trigger |
| 2 | 右侧滑出编辑面板 | Drawer / Sheet |
| 3 | 删除确认 | Alert Dialog |
| 4 | 成功反馈 | Toast |

每个交互点都可以展开查看详细 spec。

---

### 29.4 冲突检测

系统应检测同一元素上是否存在冲突行为。

常见冲突：

| 冲突 | 示例 | 建议 |
|---|---|---|
| 同一点击既跳转又展开 | 点击卡片既进入详情又展开内容 | 拆成 Link + Expand Button |
| hover 承载关键操作 | hover 才显示删除按钮 | 提供常驻按钮或更多菜单 |
| Tooltip 放交互内容 | Tooltip 里有按钮和表单 | 改用 Popover |
| Dropdown 用于表单值但实现为 Menu | 状态筛选用 Dropdown Menu | 改用 Select |
| Dialog 用于轻量预览 | 只是看一眼信息却打开大弹窗 | 改用 Popover / Drawer |
| Drawer 用于强制确认 | 删除确认从侧边滑出 | 改用 Alert Dialog |

冲突提示格式：

```md
发现交互冲突：

当前方案让“卡片点击”同时承担：
1. 跳转详情页
2. 展开当前卡片内容

这会让用户无法预期点击结果，也会给键盘和屏幕阅读器用户造成混乱。

建议：
- 卡片主体作为 Link
- 另设“展开摘要”按钮
```

---

### 29.5 置信度与假设声明

每个推荐结果必须显示置信度。

示例：

```md
推荐模式：Drawer / Sheet
置信度：78%

我的假设：
- 你说的“右边出来”是侧边详情面板
- 用户可以不完成编辑就关闭
- 当前页面上下文需要保留
```

当置信度低于 70% 时，必须展示澄清问题。

```md
置信度较低，需要确认：

这个面板打开后，用户是否必须处理完才能继续？
A. 是 → Dialog
B. 否 → Drawer
```

---

### 29.6 交互式澄清问题

澄清问题应遵循：

- 不超过 3 个
- 只问会影响组件选择的问题
- 使用选择题
- 每个选项明确对应结果
- 用户选择后局部更新结果

示例：

```md
问题 1：点击后是导航还是当前页面状态变化？
A. 进入另一个页面 → Link
B. 展开当前内容 → Button + Disclosure
C. 打开浮层 → Button + Overlay

问题 2：浮层是否包含按钮、表单或选择器？
A. 是 → Popover / Dialog / Drawer
B. 否，只是短说明 → Tooltip

问题 3：用户是否必须完成后才能继续？
A. 是 → Dialog
B. 否 → Popover / Drawer
```

---

### 29.7 Spec Editor 交互

生成后的 spec 应该可以编辑。

字段包括：

```txt
组件模式
触发方式
打开行为
关闭行为
状态列表
键盘行为
焦点行为
移动端策略
动效
错误状态
加载状态
空状态
边界情况
组件库实现
AI Coding Prompt
```

交互要求：

- 点击字段进入编辑
- 支持恢复 AI 建议
- 支持标记为“已确认”
- 支持复制单个字段
- 支持导出完整 spec
- 编辑后 prompt 自动同步更新

---

### 29.8 版本对比

每次重新生成或用户编辑后保存一个版本。

版本信息：

```txt
版本号
生成时间
用户输入
选择的澄清答案
推荐模式
用户编辑字段
导出次数
```

支持：

- 查看旧版本
- 恢复旧版本
- 比较两个版本差异

差异示例：

```diff
- 推荐模式：Dialog
+ 推荐模式：Drawer / Sheet

- 移动端：保持 Dialog
+ 移动端：全屏 Sheet
```

---

## 30. 高级交互模式需求

第二阶段需要覆盖更复杂的 Web 页面交互，而不仅是基础组件选择。

### 30.1 列表 / 表格交互

系统需要支持分析列表和表格中的复合交互。

常见需求：

```txt
表格行点击
行内操作菜单
批量选择
筛选
排序
分页
展开行详情
固定列
可调整列宽
拖拽排序
空状态
加载状态
```

#### 30.1.1 行点击 vs 行内操作

规则：

- 如果整行点击进入详情，应使用 Link 或 row action。
- 如果行内有按钮、菜单、复选框，必须避免点击冒泡冲突。
- 行内操作按钮必须有明确 label。

输出示例：

```md
表格行交互建议：

- 行主体点击：进入用户详情页
- 右侧更多按钮：打开 Dropdown Menu
- 复选框：用于批量选择，不触发行点击
- 删除：在 Dropdown Menu 中触发 Alert Dialog
- 成功后：Toast 反馈
```

---

#### 30.1.2 批量选择

规范：

```txt
状态：none selected / partial selected / all selected
表头 checkbox：全选当前页或所有结果，需要明确文案
批量操作栏：选中后出现
清除选择：提供 clear selection
危险批量操作：需要二次确认
```

---

#### 30.1.3 筛选与排序

规则：

- 简单筛选可以固定展示。
- 多条件筛选可以使用 Popover 或 Drawer。
- 移动端复杂筛选优先 Drawer。
- 表格排序应使用列头按钮。
- 当前排序状态需要视觉和语义提示。

---

### 30.2 表单交互

需要支持复杂表单规范生成。

常见需求：

```txt
输入校验
错误提示
提交 loading
保存草稿
分步骤表单
动态字段
条件显示
禁用与只读
确认离开
提交成功反馈
```

#### 30.2.1 表单校验

规则：

- 字段级错误靠近字段显示。
- 表单级错误显示在表单顶部或相关区域。
- 提交后错误应聚焦到第一个错误字段。
- 不要只用 Toast 显示字段错误。

输出示例：

```md
表单错误处理：

- 邮箱格式错误：显示在邮箱输入框下方
- 必填项为空：提交后显示 inline error
- 服务端错误：显示在表单顶部 Alert
- 提交失败：可额外使用 Toast，但不能替代 inline error
- 提交成功：Toast + 返回列表或保持当前页，取决于任务流
```

---

#### 30.2.2 提交状态

必须包含：

```txt
idle
validating
submitting
success
error
```

按钮行为：

- submitting 时按钮进入 loading。
- 防止重复提交。
- loading 状态下保留按钮宽度，避免布局跳动。
- 失败后恢复可提交状态。

---

#### 30.2.3 分步骤表单

规则：

- 用 Stepper / Wizard。
- 每一步有明确标题和进度。
- 下一步前验证当前步骤。
- 允许返回上一步。
- 离开前如果有未保存更改，需要确认。

---

### 30.3 导航交互

需要支持导航相关判断。

常见模式：

```txt
顶部导航
侧边导航
面包屑
Tabs
Segmented Control
锚点导航
Command Palette
移动端导航 Drawer
```

#### 30.3.1 Tabs vs Navigation

判断规则：

```txt
如果切换的是同一页面内同层级内容 → Tabs
如果进入不同路由或资源页面 → Navigation Link
如果是互斥筛选状态 → Segmented Control / Radio Group
```

---

#### 30.3.2 Breadcrumb

适用：

- 层级较深的资源页面
- 用户需要回到上级集合

不适用：

- 单页简单流程
- 与主导航重复且无层级意义

---

### 30.4 搜索与命令交互

常见需求：

```txt
全局搜索
站内搜索
命令面板
搜索建议
自动补全
空结果
最近搜索
```

判断：

| 用户目标 | 推荐模式 |
|---|---|
| 搜索内容并进入结果页 | Search Input + Results Page |
| 快速跳转或执行命令 | Command Palette |
| 输入并选择一个实体 | Combobox |
| 从固定选项里选择 | Select |

---

### 30.5 拖拽和调整尺寸

常见需求：

```txt
拖拽排序
拖拽上传
左右面板调整大小
拖动滑块选择值
拖动卡片到列表
```

规则：

- 拖拽必须提供可见 handle 或明确可拖区域。
- 复杂拖拽应考虑键盘替代方案。
- Resizable panel 需要最小/最大宽度。
- 拖拽上传必须支持点击选择文件作为替代。
- 拖拽排序需要明确 drop indicator。

---

### 30.6 移动端适配交互

第二阶段必须强化移动端策略。

规则：

| 桌面模式 | 移动端建议 |
|---|---|
| Popover | Bottom Sheet / Drawer |
| Hover Card | 点击打开详情 / Inline preview |
| Tooltip | 点击信息图标或 inline helper text |
| Dropdown Menu | Action Sheet |
| Side Drawer | Full-screen Sheet |
| Table | Card list / Horizontal scroll / Column priority |
| Complex filter Popover | Filter Drawer |

输出中必须包含：

```md
移动端策略：
- 不依赖 hover
- 触摸目标至少保持舒适尺寸
- 复杂浮层改为 Bottom Sheet
- 关闭入口明确可见
```

---

## 31. 规则引擎详细需求

### 31.1 规则引擎分层

建议分为 5 层：

```txt
1. Term Detection Layer
2. Intent Classification Layer
3. Pattern Candidate Layer
4. Conflict Detection Layer
5. Spec Generation Layer
```

---

### 31.2 Term Detection Layer

识别模糊词和实体。

输入：

```txt
我想让表格行点一下右边滑出详情，还可以编辑，删除时确认。
```

输出：

```json
{
  "terms": [
    { "text": "表格行", "type": "target" },
    { "text": "点一下", "type": "trigger" },
    { "text": "右边滑出", "type": "overlay" },
    { "text": "详情", "type": "content" },
    { "text": "编辑", "type": "action" },
    { "text": "删除", "type": "destructive_action" },
    { "text": "确认", "type": "confirmation" }
  ]
}
```

---

### 31.3 Intent Classification Layer

将 term 转成意图。

示例：

```json
{
  "intents": [
    {
      "id": "view_detail",
      "trigger": "row_click",
      "target": "table_row",
      "result": "open_side_panel"
    },
    {
      "id": "edit_detail",
      "trigger": "inside_panel",
      "result": "edit_form"
    },
    {
      "id": "delete_item",
      "trigger": "delete_button",
      "result": "confirm_then_delete"
    }
  ]
}
```

---

### 31.4 Pattern Candidate Layer

为每个 intent 生成候选模式。

```json
{
  "intentId": "view_detail",
  "candidates": [
    {
      "pattern": "Drawer",
      "score": 0.86,
      "reason": "右侧滑出详情面板"
    },
    {
      "pattern": "Dialog",
      "score": 0.42,
      "reason": "可展示详情，但不符合右侧滑出"
    },
    {
      "pattern": "Popover",
      "score": 0.31,
      "reason": "详情内容较重，不适合小浮层"
    }
  ]
}
```

---

### 31.5 Conflict Detection Layer

检测冲突。

```json
{
  "conflicts": [
    {
      "type": "row_click_with_nested_actions",
      "severity": "medium",
      "message": "表格行点击和行内操作按钮可能产生点击冲突。",
      "recommendation": "行内按钮需要阻止触发行点击，并有清晰 focus 顺序。"
    }
  ]
}
```

---

### 31.6 Spec Generation Layer

生成最终 spec。

```json
{
  "specs": [
    {
      "intentId": "view_detail",
      "pattern": "Drawer",
      "trigger": "点击表格行或查看按钮",
      "states": ["closed", "open", "loading", "error"],
      "keyboard": "Tab 进入行内操作；Enter 打开详情；Escape 关闭 Drawer。",
      "focus": "Drawer 打开后聚焦标题或第一个操作按钮；关闭后回到触发元素。",
      "mobile": "移动端使用全屏 Sheet。"
    }
  ]
}
```

---

## 32. 数据模型需求

### 32.1 Project

```ts
type Project = {
  id: string;
  name: string;
  framework: "React" | "Vue" | "Next.js" | "Nuxt" | "Other";
  styling: "Tailwind" | "CSS Modules" | "Emotion" | "Other";
  componentLibrary: string[];
  routing: string;
  formLibrary?: string;
  animationLibrary?: string;
  accessibilityLevel: "basic" | "standard" | "strict";
  mobileStrategy: "responsive" | "desktop_first" | "mobile_first";
  customTerms: CustomTerm[];
  customComponents: CustomComponentMapping[];
  createdAt: string;
  updatedAt: string;
};
```

---

### 32.2 InteractionRequest

```ts
type InteractionRequest = {
  id: string;
  projectId?: string;
  userText: string;
  mode: "translate" | "choose_component" | "generate_spec" | "review" | "coding_prompt";
  techStack: string[];
  detailLevel: "brief" | "standard" | "detailed";
  context?: {
    pageType?: "dashboard" | "form" | "table" | "marketing" | "commerce" | "unknown";
    targetDevice?: "desktop" | "mobile" | "responsive";
    userRole?: string;
  };
  createdAt: string;
};
```

---

### 32.3 InteractionAnalysis

```ts
type InteractionAnalysis = {
  id: string;
  requestId: string;
  understanding: string;
  matchedTerms: MatchedTerm[];
  intents: InteractionIntent[];
  recommendedPatterns: PatternRecommendation[];
  conflicts: InteractionConflict[];
  clarificationQuestions: ClarificationQuestion[];
  specs: InteractionSpec[];
  qualityScore: QualityScore;
  codingPrompt: string;
  markdownSpec: string;
  createdAt: string;
};
```

---

### 32.4 InteractionIntent

```ts
type InteractionIntent = {
  id: string;
  name: string;
  trigger: string;
  target: string;
  result: string;
  contentType?: "text" | "form" | "selection" | "navigation" | "feedback" | "data";
  confidence: number;
};
```

---

### 32.5 PatternRecommendation

```ts
type PatternRecommendation = {
  intentId: string;
  pattern: string;
  score: number;
  recommendation: "primary" | "alternative" | "not_recommended";
  reason: string;
  whenToUse: string;
  whenNotToUse: string;
  accessibilityNotes: string[];
  mobileNotes: string[];
  componentSuggestions: ComponentSuggestion[];
};
```

---

### 32.6 InteractionSpec

```ts
type InteractionSpec = {
  id: string;
  intentId: string;
  pattern: string;
  trigger: string;
  openBehavior?: string;
  closeBehavior?: string;
  states: string[];
  visualFeedback: string;
  keyboard: string;
  focus: string;
  mobile: string;
  animation: string;
  accessibility: string[];
  loadingState?: string;
  errorState?: string;
  emptyState?: string;
  edgeCases: string[];
  implementationHints: string[];
};
```

---

### 32.7 QualityScore

```ts
type QualityScore = {
  total: number;
  clarity: number;
  patternFit: number;
  accessibility: number;
  mobileReadiness: number;
  implementationComplexity: number;
  aiCodingReadiness: number;
  deductions: Array<{
    category: string;
    points: number;
    reason: string;
  }>;
};
```

---

## 33. API 详细需求

### 33.1 Analyze API

```txt
POST /api/interactions/analyze
```

用途：分析用户输入，生成初始结果。

请求：

```ts
type AnalyzeRequest = {
  userText: string;
  projectId?: string;
  mode: InteractionRequest["mode"];
  techStack: string[];
  detailLevel: "brief" | "standard" | "detailed";
  context?: InteractionRequest["context"];
};
```

响应：

```ts
type AnalyzeResponse = InteractionAnalysis;
```

---

### 33.2 Clarify API

```txt
POST /api/interactions/clarify
```

用途：用户回答澄清问题后，重新生成推荐。

请求：

```ts
type ClarifyRequest = {
  analysisId: string;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
};
```

响应：

```ts
type ClarifyResponse = InteractionAnalysis;
```

---

### 33.3 Update Spec API

```txt
PATCH /api/interactions/specs/:specId
```

用途：用户编辑 spec 字段。

请求：

```ts
type UpdateSpecRequest = Partial<InteractionSpec>;
```

响应：

```ts
type UpdateSpecResponse = InteractionSpec;
```

---

### 33.4 Export API

```txt
POST /api/interactions/export
```

用途：导出 Markdown、Prompt、JSON。

请求：

```ts
type ExportRequest = {
  analysisId: string;
  format: "markdown" | "coding_prompt" | "json" | "jira" | "linear";
};
```

响应：

```ts
type ExportResponse = {
  format: string;
  content: string;
};
```

---

### 33.5 Project Settings API

```txt
GET /api/projects/:projectId
POST /api/projects
PATCH /api/projects/:projectId
DELETE /api/projects/:projectId
```

用于项目级配置。

---

## 34. 结果展示详细交互

### 34.1 结果页顶部摘要

顶部应展示最关键结论。

格式：

```md
推荐：Drawer + Alert Dialog + Toast

你描述的是一个用户列表详情操作流：
- 点击行查看详情
- 从右侧滑出详情面板
- 删除前需要确认
- 成功后给临时反馈

整体置信度：87%
```

---

### 34.2 多交互点导航

如果识别到多个交互点，左侧显示列表：

```txt
1. 行点击查看详情
2. 详情面板编辑
3. 删除确认
4. 成功反馈
5. 移动端适配
```

点击后右侧展示对应 spec。

---

### 34.3 Pattern Cards

每个 Pattern Card 包含：

```txt
模式名称
推荐标签：推荐 / 备选 / 不推荐
推荐分数
一句话解释
适合原因
风险
推荐组件库
```

状态：

- selected
- alternative
- rejected
- hover
- expanded

---

### 34.4 Spec Field Card

每个 spec 字段以卡片形式展示。

字段状态：

- AI generated
- User edited
- Confirmed
- Needs review
- Missing

示例：

```txt
Focus Behavior          Needs review
打开 Drawer 后聚焦标题；关闭后焦点回到触发行。
```

用户可以点击编辑。

---

### 34.5 Risk Alerts

风险分级：

```txt
Critical：会导致用户无法完成任务或严重可访问性问题
Warning：可能造成困惑或移动端问题
Info：优化建议
```

示例：

```md
Critical：删除操作缺少确认
建议使用 Alert Dialog，并明确操作不可逆。
```

---

### 34.6 Export Panel

支持导出：

```txt
Copy AI Coding Prompt
Copy Markdown Spec
Download JSON
Export Jira Ticket
Export Linear Issue
```

MVP+ 阶段可以先实现前两个。

---

## 35. 导出格式详细需求

### 35.1 AI Coding Prompt

用于 Cursor、Codex、Claude Code。

格式：

```md
请根据以下交互规范实现功能。

技术栈：Next.js + React + Tailwind + shadcn/ui

页面场景：用户管理列表

交互 1：点击表格行查看详情
- Pattern：Drawer / Sheet
- Trigger：点击表格行或“查看详情”按钮
- Behavior：从右侧打开详情面板
- Keyboard：Enter 打开，Escape 关闭
- Focus：关闭后回到触发行
- Mobile：小屏使用全屏 Sheet

交互 2：删除用户
- Pattern：Alert Dialog
- Trigger：点击删除按钮
- Behavior：弹出确认框，确认后执行删除
- Feedback：删除成功后显示 Toast

不要：
- 不要用 Tooltip 承载可交互内容
- 不要让行点击和行内按钮冲突
- 不要用 div onClick 模拟按钮
```

---

### 35.2 Markdown Spec

用于 PRD、任务文档。

格式：

```md
# 用户列表交互规范

## 目标

帮助用户在列表中查看、编辑和删除用户。

## 交互流程

1. 用户点击表格行
2. 系统打开右侧 Drawer
3. 用户查看或编辑详情
4. 用户点击删除
5. 系统显示确认弹窗
6. 用户确认后执行删除
7. 系统显示成功 Toast

## 组件模式

| 场景 | 模式 |
|---|---|
| 查看详情 | Drawer |
| 删除确认 | Alert Dialog |
| 成功反馈 | Toast |

## 可访问性

...
```

---

### 35.3 Jira / Linear Ticket

用于任务管理。

格式：

```md
Title: Implement user detail drawer and delete confirmation interaction

Description:
Implement the user list interaction flow with Drawer, Alert Dialog, and Toast feedback.

Acceptance Criteria:
- Clicking a user row opens the detail drawer
- Escape closes the drawer
- Focus returns to the trigger after close
- Delete action opens a confirmation dialog
- Confirming delete shows success toast
- Hover is not required for core actions
```

---

### 35.4 JSON Export

用于工具链集成。

导出完整 `InteractionAnalysis`。

---

## 36. 项目配置详细需求

### 36.1 技术栈配置

用户可以设置：

```txt
Framework：React / Vue / Next.js / Nuxt / Svelte
UI Library：shadcn/ui / Radix / MUI / Ant Design / Chakra / Custom
Styling：Tailwind / CSS Modules / CSS-in-JS
Routing：Next App Router / React Router / Vue Router
Form：React Hook Form / Formik / Native
Animation：Motion / CSS transition / None
```

---

### 36.2 自定义组件映射

团队可以配置内部组件。

示例：

```json
{
  "pattern": "Dialog",
  "componentName": "AppModal",
  "importPath": "@/components/ui/AppModal",
  "notes": "用于普通确认和表单弹窗，不用于危险操作。危险操作使用 ConfirmDialog。"
}
```

生成结果时输出：

```md
推荐使用内部组件：AppModal
import: @/components/ui/AppModal
```

---

### 36.3 自定义术语

团队可以设置术语映射：

```json
{
  "teamTerm": "侧滑面板",
  "standardPattern": "Drawer / Sheet",
  "description": "团队内部称为侧滑面板，通常从右侧打开详情或编辑内容。"
}
```

---

### 36.4 可访问性等级

配置：

```txt
Basic：基础键盘与语义提醒
Standard：包含焦点管理、移动端、ARIA 建议
Strict：更严格的完整检查清单和验收标准
```

---

## 37. 复杂示例需求

第二阶段至少内置 10 个复杂示例。

### 37.1 用户管理表格

输入：

```txt
用户管理表格里，点击行打开右侧详情，可以编辑，删除前需要确认，成功后提示。
```

期望输出：

- Row action / Drawer
- Edit form
- Alert Dialog
- Toast
- 行内操作冲突提醒
- 移动端 Sheet 策略

---

### 37.2 商品卡片

输入：

```txt
商品卡片 hover 显示参数，点击图片进详情，点购买按钮加入购物车。
```

期望输出：

- 图片标题 Link
- hover 只做非关键预览
- Buy Button
- Toast / Cart feedback
- 移动端替代 hover

---

### 37.3 高级筛选

输入：

```txt
列表页有很多筛选条件，点击筛选按钮展开，移动端要好用。
```

期望输出：

- 桌面端 Filter Popover 或 side panel
- 移动端 Drawer / Bottom Sheet
- Apply / Reset
- 已筛选数量
- 未应用修改处理

---

### 37.4 多步骤创建流程

输入：

```txt
创建项目要分三步，填写信息、邀请成员、确认设置，中途可以返回。
```

期望输出：

- Stepper / Wizard
- 每步校验
- Back / Next
- Draft 保存
- 离开确认

---

### 37.5 命令面板

输入：

```txt
我想做一个类似快捷键打开的搜索框，可以搜索页面，也可以执行操作。
```

期望输出：

- Command Palette
- Keyboard shortcut
- Search + action results
- Empty state
- Recent commands
- Escape close

---

### 37.6 可调整宽度的编辑器

输入：

```txt
页面左边是列表，右边是编辑器，中间可以拖动调整宽度。
```

期望输出：

- Resizable Panel / Splitter
- Drag handle
- Min / max width
- Persist layout
- Keyboard alternative

---

### 37.7 表单错误处理

输入：

```txt
表单提交失败的时候提示用户哪里错了，成功后跳回列表。
```

期望输出：

- Inline field errors
- Form-level alert
- Submit loading
- Success redirect
- Toast optional
- Focus first invalid field

---

### 37.8 批量操作

输入：

```txt
表格可以多选用户，然后批量删除，删除前确认。
```

期望输出：

- Row selection
- Header checkbox indeterminate
- Bulk action bar
- Alert Dialog
- Success Toast
- Selection reset

---

### 37.9 通知中心

输入：

```txt
点击右上角铃铛出现通知列表，可以标记已读，也可以进入详情。
```

期望输出：

- Popover / Drawer depending content length
- Notification list
- Mark as read button
- Link to detail
- Empty state
- Mobile Sheet

---

### 37.10 文件上传

输入：

```txt
用户可以拖拽上传文件，也可以点击选择文件，上传时显示进度。
```

期望输出：

- Dropzone + File input
- Progress state
- Error state
- Remove file
- Keyboard accessible file picker

---

## 38. 交互质量评分规则

### 38.1 总分计算

```txt
Total = Clarity * 0.2
      + Pattern Fit * 0.25
      + Accessibility * 0.25
      + Mobile Readiness * 0.15
      + Implementation Practicality * 0.1
      + AI Coding Readiness * 0.05
```

---

### 38.2 扣分规则

| 问题 | 扣分 |
|---|---:|
| hover-only 承载关键操作 | -20 |
| 同一点击目标有两个主行为 | -15 |
| Tooltip 中包含可交互内容 | -15 |
| 删除操作无确认 | -15 |
| 浮层无关闭方式 | -10 |
| 未说明移动端策略 | -10 |
| 未说明焦点返回 | -10 |
| Link / Button 混用 | -10 |
| Select / Menu / Combobox 混用 | -8 |
| 没有 loading / error 状态 | -5 |

---

### 38.3 评分展示

```md
交互质量：78 / 100

主要问题：
- hover 中包含关键详情：-20
- 移动端替代入口未说明：-10

建议优化：
- hover 只保留视觉反馈
- 增加“快速查看”按钮打开 Drawer
```

---

## 39. 可访问性详细检查清单

### 39.1 通用检查

- 所有可点击元素是否使用 button 或 link？
- 是否支持键盘 Tab 访问？
- focus 是否可见？
- 操作是否可用 Enter / Space 触发？
- 是否避免 hover-only？
- 状态变化是否对辅助技术可感知？
- 触摸目标是否足够易点？

---

### 39.2 Overlay 检查

- Dialog 是否有标题？
- 是否支持 Escape 关闭？
- 是否有明确关闭按钮？
- 是否需要 focus trap？
- 关闭后焦点是否返回触发器？
- 点击外部是否关闭？是否合理？
- 移动端是否需要改为 Sheet？

---

### 39.3 表单检查

- label 是否明确关联字段？
- 错误提示是否靠近字段？
- 错误是否只靠颜色表达？
- 提交 loading 是否防止重复提交？
- server error 是否有合适位置？
- first invalid field 是否获得焦点？

---

### 39.4 列表 / 表格检查

- 行点击是否与行内按钮冲突？
- checkbox 是否有 indeterminate 状态？
- 批量操作是否说明作用范围？
- 排序状态是否清晰？
- 空状态是否提供下一步操作？

---

## 40. 详细验收标准：第二阶段

### 40.1 功能验收

- 支持多交互点拆分。
- 支持澄清问题选择并重新生成。
- 支持模式对比。
- 支持 spec 字段编辑。
- 支持质量评分。
- 支持项目配置。
- 支持导出 AI Coding Prompt 和 Markdown Spec。
- 支持至少 10 个复杂示例。
- 支持保存和查看历史。

---

### 40.2 规则验收

以下输入必须得到合理结果：

```txt
1. 点按钮弹出可以选择东西的小框
2. 卡片 hover 显示详情，点击跳转
3. 表格行点击详情，右侧更多操作
4. 下拉可以搜索用户
5. hover 显示删除按钮
6. 左右拖动调整面板宽度
7. 删除前确认，成功后提示
8. 表单提交失败显示错误
9. 点击铃铛打开通知列表
10. 拖拽上传文件并显示进度
```

---

### 40.3 体验验收

- 用户在 30 秒内能得到第一个推荐结果。
- 用户不需要理解专业术语也能完成选择。
- 推荐结论必须在结果顶部可见。
- 详细 spec 可以折叠，不压迫用户。
- Prompt 复制按钮明显可见。
- 错误提示能指导用户如何重新输入。

---

### 40.4 输出质量验收

每次输出必须包含：

- 推荐模式
- 推荐原因
- 不推荐模式
- 交互规范
- 可访问性注意事项
- 移动端策略
- 常见错误
- 组件库建议
- AI Coding Prompt

---

## 41. 第二阶段开发任务拆解

### 41.1 前端任务

- [ ] 重构单页 demo 为 Workspace 布局
- [ ] 增加多交互点列表
- [ ] 增加澄清问题交互
- [ ] 增加 Pattern Comparison Cards
- [ ] 增加 Spec Editor
- [ ] 增加 Quality Score 展示
- [ ] 增加 Risk Alerts
- [ ] 增加 Export Panel
- [ ] 增加 History 页面
- [ ] 增加 Project Settings 页面
- [ ] 增加 Pattern Library 页面
- [ ] 增加响应式移动端布局

---

### 41.2 后端 / Engine 任务

- [ ] 定义新的 InteractionAnalysis schema
- [ ] 增加多交互点拆分能力
- [ ] 增加澄清问题生成与回答 API
- [ ] 增加候选模式评分
- [ ] 增加冲突检测
- [ ] 增加质量评分
- [ ] 增加项目配置读取
- [ ] 增加自定义组件映射
- [ ] 增加导出 API
- [ ] 增加历史保存

---

### 41.3 内容 / 规则任务

- [ ] 扩展模糊词词典到 100+ 条
- [ ] 扩展组件模式到 30+ 个
- [ ] 编写 10 个复杂示例
- [ ] 编写 30 个反模式规则
- [ ] 编写移动端适配规则
- [ ] 编写表格 / 表单 / 导航 / 拖拽专项规则
- [ ] 编写评分扣分规则
- [ ] 编写项目配置示例

---

### 41.4 测试任务

- [ ] 单条交互测试
- [ ] 多交互点测试
- [ ] 低置信度澄清测试
- [ ] 反模式检测测试
- [ ] 移动端策略测试
- [ ] Prompt 导出测试
- [ ] 项目配置映射测试
- [ ] 历史版本测试

---

## 42. 第二阶段优先级建议

### P0：必须做

- 多交互点拆分
- 澄清问题选择
- 模式对比
- Spec Editor
- AI Coding Prompt 导出增强
- 质量评分
- 复杂示例库

### P1：强烈建议

- 历史记录
- 项目配置
- 自定义组件映射
- Pattern Library
- Markdown 导出

### P2：后续做

- 团队协作
- 分享链接
- Jira / Linear 导出
- Rule Debugger
- PR Bot
- IDE 插件

---

## 43. 第二阶段总结

MVP 的价值是证明：

> 模糊交互描述可以被翻译成专业交互建议。

第二阶段的价值是证明：

> 这个工具可以成为 AI Coding 前的交互决策层，以及前端实现前的轻量交互规范工作台。

第二阶段最关键的升级不是“生成更多文字”，而是：

1. **让用户参与澄清**：选择答案后结果变准确。
2. **让结果可编辑**：spec 不只是文本，而是结构化字段。
3. **让方案可比较**：知道为什么不用 Tooltip、为什么不用 Dialog。
4. **让输出可落地**：直接导出给 Cursor / Codex / 前端。
5. **让规则可配置**：适配不同团队和组件库。

最终，它应该从一个“交互建议 demo”升级为：

> **Web Interaction Decision & Spec Platform**

