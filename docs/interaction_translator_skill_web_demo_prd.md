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

