import { useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  CircleHelp,
  CornerDownRight,
  MessageCircle,
  Play,
  RefreshCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  categoryDescriptions,
  findItem,
  quickQuestions,
  sections,
  uiItems,
} from "./data.js";

const initialPlayground = {
  style: "solid",
  state: "default",
  radius: "small",
};

const styleLabels = {
  solid: "实心",
  outline: "描边",
  text: "文字",
};

const stateLabels = {
  default: "默认",
  disabled: "禁用",
  loading: "加载",
};

const radiusLabels = {
  small: "小",
  pill: "胶囊",
};

const sectionIds = sections.map((section) => section.id);
const headerSections = sections;

function normalize(value) {
  return value.toLowerCase().trim();
}

function itemMatchesQuery(entry, query) {
  const needle = normalize(query);
  if (!needle) return true;
  return [
    entry.title,
    entry.english,
    entry.summary,
    entry.plain,
    entry.group,
    ...entry.aliases,
    ...entry.tags,
    ...entry.useCases,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function useStoredList(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function App() {
  const [activeSection, setActiveSection] = useState("components");
  const [selectedId, setSelectedId] = useState("button");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useStoredList("uiux.wiki:favorites", []);
  const [reducedMotion, setReducedMotion] = useStoredList("uiux.wiki:reduced-motion", false);
  const [playground, setPlayground] = useState(initialPlayground);
  const [notice, setNotice] = useState("");

  const selected = findItem(selectedId);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [reducedMotion]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const visibleItems = useMemo(() => {
    const base = query
      ? uiItems
      : uiItems.filter((entry) => entry.category === activeSection);
    return base.filter((entry) => itemMatchesQuery(entry, query));
  }, [activeSection, query]);

  const listLabel = query
    ? `找到 ${visibleItems.length} 个相关 UI`
    : categoryDescriptions[activeSection];

  function chooseSection(sectionId) {
    setActiveSection(sectionId);
    setQuery("");
    const first = uiItems.find((entry) => entry.category === sectionId);
    if (first) setSelectedId(first.id);
  }

  function chooseItem(entry) {
    setSelectedId(entry.id);
    if (sectionIds.includes(entry.category)) setActiveSection(entry.category);
  }

  function submitSearch(event) {
    event.preventDefault();
    const first = uiItems.find((entry) => itemMatchesQuery(entry, query));
    if (first) {
      chooseItem(first);
      setNotice(`已打开「${first.title}」`);
    } else if (query.trim()) {
      setNotice("没有找到完全匹配的条目");
    }
  }

  function clearDialog() {
    setQuery("");
    setActiveSection("components");
    setSelectedId("button");
    setPlayground(initialPlayground);
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      const exists = current.includes(id);
      setNotice(exists ? "已从收藏移除" : "已收藏");
      return exists ? current.filter((itemId) => itemId !== id) : [...current, id];
    });
  }

  function shareCurrent() {
    const url = `${window.location.origin}${window.location.pathname}#${selected.id}`;
    window.navigator?.clipboard?.writeText(url);
    setNotice("已复制当前条目链接");
  }

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id && uiItems.some((entry) => entry.id === id)) chooseItem(findItem(id));
  }, []);

  return (
    <main className="app-shell">
      <Header
        activeSection={activeSection}
        onSection={chooseSection}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      <section className="composer-section" aria-labelledby="site-title">
        <div className="composer-title">
          <h1 id="site-title">uiux.wiki</h1>
          <p>用最简单的图和话，看懂常见界面。</p>
        </div>
        <form className="composer" onSubmit={submitSearch} role="search">
          <span className="composer-orb" aria-hidden="true">
            <MessageCircle size={24} strokeWidth={1.8} />
          </span>
          <label className="sr-only" htmlFor="atlas-search">
            搜索 UI 条目
          </label>
          <input
            id="atlas-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索按钮、弹窗、卡片、加载..."
          />
          {query && (
            <button
              className="ghost-icon"
              type="button"
              aria-label="清空搜索"
              onClick={() => setQuery("")}
            >
              <X size={18} />
            </button>
          )}
          <button className="send-button" type="submit" aria-label="搜索">
            <ArrowUp size={22} strokeWidth={2.4} />
          </button>
        </form>
        <div className="quick-questions" aria-label="快捷问题">
          <span>试试问：</span>
          {quickQuestions.slice(0, 3).map((question) => (
            <button key={question} type="button" onClick={() => setQuery(question)}>
              {question}
            </button>
          ))}
        </div>
      </section>

      <section className="atlas-grid" aria-label="UI 图鉴">
        <AtlasListPanel
          activeSection={activeSection}
          listLabel={listLabel}
          items={visibleItems}
          selectedId={selectedId}
          onChoose={chooseItem}
          onClear={clearDialog}
          query={query}
        />
        <DetailPanel
          selected={selected}
          playground={playground}
          setPlayground={setPlayground}
          isFavorite={favorites.includes(selected.id)}
          onFavorite={() => toggleFavorite(selected.id)}
          onShare={shareCurrent}
        />
      </section>

      <ExploreSection activeSection={activeSection} onSection={chooseSection} onChoose={chooseItem} />

      <footer className="site-footer">
        <span>内容由 uiux.wiki 整理，旨在帮助你快速理解界面语言。</span>
      </footer>

      <div className={`toast ${notice ? "show" : ""}`} role="status" aria-live="polite">
        {notice}
      </div>
    </main>
  );
}

function Header({ activeSection, onSection, reducedMotion, setReducedMotion }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span>uiux.wiki</span>
        <small>用最简单的图和话，看懂常见界面。</small>
      </div>
      <nav className="main-nav" aria-label="主导航">
        {headerSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? "active" : ""}
            onClick={() => onSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
      <div className="top-actions">
        <label className="motion-toggle">
          <span>减少动效</span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />
          <span className="switch-ui" aria-hidden="true" />
        </label>
        <button type="button" className="text-link">
          关于
        </button>
      </div>
    </header>
  );
}

function AtlasListPanel({
  activeSection,
  listLabel,
  items,
  selectedId,
  onChoose,
  onClear,
  query,
}) {
  const activeLabel = sections.find((section) => section.id === activeSection)?.label || "组件";

  return (
    <section className="conversation-panel atlas-list-panel">
      <div className="list-panel-header">
        <div>
          <span className="panel-kicker">{query ? "搜索结果" : "当前栏目"}</span>
          <h2>{query ? "全部匹配 UI" : `${activeLabel}列表`}</h2>
          <p>{listLabel}</p>
        </div>
        <span className="list-count">{items.length}</span>
      </div>
      <div className="entry-list full-entry-list">
        {items.length > 0 ? (
          items.map((entry, index) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              index={index}
              active={entry.id === selectedId}
              onChoose={() => onChoose(entry)}
            />
          ))
        ) : (
          <EmptyList activeSection={activeSection} />
        )}
      </div>
      <button className="clear-button" type="button" onClick={onClear}>
        <RefreshCcw size={16} />
        重置列表
      </button>
    </section>
  );
}

function EntryRow({ entry, index, active, onChoose }) {
  return (
    <button
      className={`entry-row ${active ? "active" : ""}`}
      type="button"
      aria-label={`预览 ${entry.title} ${entry.english}`}
      aria-current={active ? "true" : undefined}
      onClick={onChoose}
    >
      <span className="entry-index">{String(index + 1).padStart(2, "0")}</span>
      <MiniPreview type={entry.preview} />
      <span className="entry-copy">
        <strong>
          {entry.title}
          <em>{entry.english}</em>
        </strong>
        <span>
          <b>{entry.group}</b>
          {entry.summary}
        </span>
      </span>
      <ChevronRight size={22} strokeWidth={1.7} />
    </button>
  );
}

function EmptyList({ activeSection }) {
  return (
    <div className="empty-list">
      <CircleHelp size={28} strokeWidth={1.6} />
      <strong>没有匹配条目</strong>
      <span>
        {`试试切换到「${sections.find((section) => section.id === activeSection)?.label || "组件"}」的其他关键词。`}
      </span>
    </div>
  );
}

function DetailPanel({ selected, playground, setPlayground, isFavorite, onFavorite, onShare }) {
  return (
    <section className="detail-panel" aria-live="polite">
      <div className="answer-heading">
        <span className="answer-icon" aria-hidden="true">
          <Sparkles size={19} fill="currentColor" strokeWidth={1.8} />
        </span>
        <div>
          <h2>
            {selected.title}
            <span>{selected.english}</span>
          </h2>
          <p>{selected.plain}</p>
        </div>
      </div>

      <div className="answer-section preview-section">
        <h3>预览</h3>
        <div className="preview-stage">
          <LivePreview selected={selected} playground={playground} />
        </div>
      </div>

      <div className="answer-section">
        <h3>自定义试玩</h3>
        {selected.id === "button" ? (
          <PlaygroundControls playground={playground} setPlayground={setPlayground} />
        ) : (
          <GenericControls selected={selected} />
        )}
      </div>

      <Comparison selected={selected} />

      <div className="answer-actions">
        <button type="button" onClick={onFavorite}>
          {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {isFavorite ? "已收藏" : "收藏"}
        </button>
        <button type="button" onClick={onShare}>
          <Share2 size={18} />
          分享
        </button>
      </div>

      <InfoGrid selected={selected} />
    </section>
  );
}

function LivePreview({ selected, playground }) {
  if (selected.id === "button") return <PlaygroundButton playground={playground} />;
  if (selected.category === "layouts") return <LayoutLivePreview selected={selected} />;
  if (selected.category === "styles") return <StyleLivePreview selected={selected} />;
  if (selected.category === "motion") return <MotionLivePreview selected={selected} />;
  if (selected.category === "patterns") return <PatternLivePreview selected={selected} />;
  if (selected.category === "dictionary") {
    const related = findItem(selected.related[0] || "button");
    return <ComponentLivePreview selected={related.id === selected.id ? selected : related} term={selected} />;
  }
  return <ComponentLivePreview selected={selected} />;
}

function ComponentLivePreview({ selected, term }) {
  const id = selected.id;

  if (id === "button") {
    return (
      <div className="live-button-card">
        <button type="button">主要操作</button>
        <button type="button">次要操作</button>
        <button type="button" className="danger">危险操作</button>
      </div>
    );
  }

  if (["text-field", "textarea", "search", "password-field", "autocomplete"].includes(id)) {
    return (
      <div className="live-card live-form-card">
        <label>{selected.title}</label>
        {id === "textarea" ? (
          <textarea defaultValue="这是一段可以编辑的长文本。" />
        ) : (
          <div className={`live-input ${id === "search" || id === "autocomplete" ? "info" : ""}`}>
            {id === "search" && <Search size={18} />}
            <input
              type={id === "password-field" ? "password" : "text"}
              defaultValue={id === "password-field" ? "password" : id === "autocomplete" ? "北京" : ""}
              placeholder={id === "password-field" ? "请输入密码" : "请输入内容"}
            />
            {id === "autocomplete" && <span>推荐</span>}
          </div>
        )}
        <small>{id === "password-field" ? "至少 8 位，建议包含数字。" : "输入时应该有清楚的焦点和帮助说明。"}</small>
      </div>
    );
  }

  if (["modal", "confirmation", "term-modal"].includes(id) || id.includes("delete")) {
    return (
      <div className="live-modal-scene">
        <div className="live-page-lines"><i /><i /><i /></div>
        <div className="live-dialog">
          <strong>{selected.title.includes("删除") ? "删除文件？" : selected.title}</strong>
          <span>{selected.plain}</span>
          <div>
            <button type="button">取消</button>
            <button type="button" className="danger">确认</button>
          </div>
        </div>
      </div>
    );
  }

  if (["toast", "term-toast", "notification", "success-state", "error-state", "alert"].includes(id)) {
    const tone = id.includes("error") || id === "alert" ? "danger" : id === "notification" ? "warning" : "success";
    return (
      <div className={`live-alert-demo ${tone}`}>
        <div className="live-alert">
          <Check size={18} />
          <div>
            <strong>{tone === "danger" ? "需要处理" : tone === "warning" ? "有新提醒" : "保存成功"}</strong>
            <span>{selected.summary}</span>
          </div>
          <X size={16} />
        </div>
      </div>
    );
  }

  if (["table", "data-grid"].includes(id)) {
    return (
      <div className="live-table">
        {["名称", "状态", "时间"].map((head) => <b key={head}>{head}</b>)}
        {["订单 A", "完成", "今天", "订单 B", "待处理", "昨天", "订单 C", "失败", "周一"].map((cell, index) => (
          <span key={`${cell}-${index}`} className={cell === "失败" ? "danger-text" : cell === "完成" ? "success-text" : ""}>{cell}</span>
        ))}
      </div>
    );
  }

  if (id === "card") {
    return (
      <div className="live-content-card">
        <i />
        <strong>内容卡片</strong>
        <p>{selected.plain}</p>
        <button type="button">查看详情</button>
      </div>
    );
  }

  if (id === "skeleton") {
    return (
      <div className="live-skeleton-card">
        <i /><b /><b /><b />
      </div>
    );
  }

  if (id === "empty-state") {
    return (
      <div className="live-empty-card">
        <CircleHelp size={34} />
        <strong>这里还没有内容</strong>
        <span>{selected.summary}</span>
        <button type="button">创建一个</button>
      </div>
    );
  }

  if (id === "floating-action-button") {
    return (
      <div className="live-fab-card">
        <i /><i /><i />
        <button type="button" aria-label="新建">+</button>
      </div>
    );
  }

  if (["progress", "spinner", "file-upload"].includes(id)) {
    if (id === "spinner") {
      return (
        <div className="live-spinner-card">
          <i aria-hidden="true" />
          <strong>正在加载</strong>
          <span>{selected.summary}</span>
        </div>
      );
    }

    if (id === "file-upload") {
      return (
        <div className="live-upload-card">
          <strong>拖拽文件到这里</strong>
          <span>支持 PNG、PDF、ZIP，上传后显示进度。</span>
          <div className="live-progress-bar"><i /></div>
        </div>
      );
    }

    return (
      <div className="live-progress-card">
        <strong>{selected.title}</strong>
        <div className="live-progress-bar"><i /></div>
        <span>正在处理 62%</span>
      </div>
    );
  }

  if (id === "slider") {
    return (
      <div className="live-slider-card">
        <strong>音量 62%</strong>
        <input type="range" defaultValue="62" />
        <span>滑杆适合连续数值，而不是少量固定选项。</span>
      </div>
    );
  }

  if (id === "date-picker" || id === "calendar") {
    return (
      <div className="live-calendar-card">
        <header><strong>2026 年 6 月</strong><span>今天</span></header>
        <div>
          {Array.from({ length: 35 }).map((_, index) => (
            <i key={index} className={index === 15 ? "selected" : index === 19 ? "range" : ""}>
              {index + 1 <= 30 ? index + 1 : ""}
            </i>
          ))}
        </div>
      </div>
    );
  }

  if (id === "form") {
    return (
      <div className="live-form-card">
        <label>邮箱</label>
        <input defaultValue="hello@example.com" />
        <label>备注</label>
        <textarea defaultValue="这是一组真实表单字段。" />
        <button type="button">提交</button>
      </div>
    );
  }

  if (["checkbox", "radio", "switch"].includes(id)) {
    return (
      <div className="live-settings-card">
        <label><input type="checkbox" defaultChecked /> 接收通知</label>
        <label><input type="radio" name="demo-radio" defaultChecked /> 默认选项</label>
        <label className="live-toggle"><span>自动保存</span><i /></label>
        <input type="range" defaultValue="62" />
      </div>
    );
  }

  if (["menu", "dropdown", "select", "context-menu"].includes(id)) {
    const isDropdown = id === "dropdown" || id === "select";
    return (
      <div className={`live-menu-card ${isDropdown ? "dropdown" : ""}`}>
        <div className="live-menu-trigger">
          <span>{isDropdown ? "排序方式" : "更多操作"}</span>
          <ChevronRight size={18} />
        </div>
        <div className="live-menu-popover">
          {(isDropdown ? ["最新优先", "价格从低到高", "只看可用"] : ["编辑", "复制链接", "删除"]).map((label, index) => (
            <span key={label} className={index === 2 && !isDropdown ? "danger-text" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (["link", "breadcrumb"].includes(id)) {
    return (
      <div className="live-link-card">
        <span>帮助中心</span>
        <ChevronRight size={18} />
        <strong>{selected.title}</strong>
        <p>{selected.plain}</p>
      </div>
    );
  }

  if (id === "icon-button") {
    return (
      <div className="live-icon-button-card">
        <button type="button" aria-label="搜索"><Search size={20} /></button>
        <button type="button" aria-label="收藏"><Bookmark size={20} /></button>
        <button type="button" aria-label="分享"><Share2 size={20} /></button>
      </div>
    );
  }

  if (["top-navigation", "sidebar", "breadcrumb", "pagination", "stepper", "bottom-navigation", "back-button"].includes(id)) {
    return (
      <div className={`live-nav-card ${id}`}>
        <header><span>首页</span><span>组件</span><span>设置</span></header>
        <aside><b /><b /><b /></aside>
        <main>
          <strong>{selected.title}</strong>
          <p>{selected.plain}</p>
          <div><i /><i /><i /></div>
        </main>
      </div>
    );
  }

  if (id === "accordion") {
    return (
      <div className="live-accordion-card">
        <details open><summary>常见问题</summary><p>{selected.plain}</p></details>
        <details><summary>更多说明</summary></details>
      </div>
    );
  }

  if (id === "drawer") {
    return (
      <div className="live-drawer-card">
        <aside><strong>抽屉标题</strong><span>设置</span><span>通知</span><span>账户</span></aside>
        <main><i /><i /><i /></main>
      </div>
    );
  }

  if (["popover", "tooltip"].includes(id)) {
    return (
      <div className={`live-popover-card ${id}`}>
        <button type="button">悬停/点击目标</button>
        <div><strong>{selected.title}</strong><span>{selected.summary}</span></div>
      </div>
    );
  }

  if (id === "carousel") {
    return (
      <div className="live-carousel-card">
        <div><strong>推荐内容</strong><span>1 / 3</span></div>
        <section><i /><i /><i /></section>
        <footer><b /><b /><b /></footer>
      </div>
    );
  }

  if (["tabs"].includes(id)) {
    return (
      <div className="live-tabs-card">
        <div className="live-tabs"><b>概览</b><span>详情</span><span>设置</span></div>
        <div className="live-content-block">
          <strong>{selected.title}</strong>
          <p>{selected.plain}</p>
        </div>
      </div>
    );
  }

  if (id === "list") {
    return (
      <div className="live-list-card">
        {["订单更新", "设计任务", "用户反馈"].map((label, index) => (
          <div key={label}><b>{index + 1}</b><strong>{label}</strong><span>刚刚更新</span></div>
        ))}
      </div>
    );
  }

  if (id === "timeline") {
    return (
      <div className="live-timeline-card">
        {["提交", "审核", "发布"].map((label, index) => (
          <div key={label} className={index === 1 ? "active" : ""}><i /><strong>{label}</strong><span>第 {index + 1} 步</span></div>
        ))}
      </div>
    );
  }

  if (id === "rating") {
    return (
      <div className="live-rating-card">
        <strong>4.8</strong>
        <div>{"★★★★★"}</div>
        <span>{selected.summary}</span>
      </div>
    );
  }

  if (["chat-bubble", "comment-box"].includes(id)) {
    return (
      <div className={`live-message-card ${id}`}>
        <div><strong>{id === "chat-bubble" ? "小明" : "评论"}</strong><p>{selected.plain}</p></div>
        <input placeholder={id === "comment-box" ? "写下评论..." : "输入消息..."} />
      </div>
    );
  }

  if (["badge", "avatar", "tag"].includes(id)) {
    return (
      <div className="live-social-card">
        <div className="live-avatar">UI</div>
        <div>
          <strong>{selected.title}</strong>
          <p>{selected.summary}</p>
          <span className="live-tag">{id === "rating" ? "4.8 分" : "新内容"}</span>
        </div>
      </div>
    );
  }

  if (id === "filter-panel") {
    return (
      <div className="live-filter-card">
        <strong>筛选</strong>
        <label><input type="checkbox" defaultChecked /> 可用</label>
        <label><input type="checkbox" /> 促销</label>
        <div><span>0</span><i /><span>100</span></div>
      </div>
    );
  }

  if (id === "sort-control") {
    return (
      <div className="live-sort-card">
        <span>排序</span>
        <button type="button">最新优先</button>
        <button type="button">价格升序</button>
        <button type="button">评分最高</button>
      </div>
    );
  }

  if (id === "command-palette") {
    return (
      <div className="live-command-card">
        <div><Search size={18} /><span>输入命令或搜索页面</span></div>
        <b>打开组件图鉴</b>
        <b>切换减少动效</b>
      </div>
    );
  }

  if (id === "media-player") {
    return (
      <div className="live-media-card">
        <section><Play size={28} fill="currentColor" /></section>
        <div><b /><span>01:26 / 03:40</span></div>
      </div>
    );
  }

  if (id === "shopping-cart") {
    return (
      <div className="live-cart-card">
        <strong>购物车</strong>
        <div><span>UI 模板包</span><b>¥129</b></div>
        <div><span>图标资源</span><b>¥39</b></div>
        <button type="button">去结算</button>
      </div>
    );
  }

  if (["toolbar"].includes(id)) {
    return (
      <div className="live-tool-card">
        <div className="live-toolbar"><button>筛选</button><button>排序</button><button>导出</button></div>
        <div className="live-content-block">
          <strong>{selected.title}</strong>
          <p>{selected.plain}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-generic-card">
      <MiniPreview type={selected.preview} large />
      <strong>{term?.title || selected.title}</strong>
      <p>{term?.plain || selected.plain}</p>
    </div>
  );
}

function LayoutLivePreview({ selected }) {
  return (
    <div className={`live-layout-demo ${selected.preview}`}>
      <header />
      <aside />
      <main>
        <i /><i /><i /><i />
      </main>
      <section>
        <i /><i />
      </section>
    </div>
  );
}

function StyleLivePreview({ selected }) {
  return (
    <div className={`live-style-demo ${selected.preview}`}>
      <article>
        <span>{selected.title}</span>
        <strong>{selected.summary}</strong>
        <button type="button">查看效果</button>
      </article>
      <article>
        <span>对比</span>
        <strong>{selected.variants[0] || "标准"}</strong>
        <button type="button">切换</button>
      </article>
    </div>
  );
}

function MotionLivePreview({ selected }) {
  return (
    <div className={`live-motion-demo ${selected.preview}`}>
      <div className="motion-target"><Play size={24} fill="currentColor" /></div>
      <p>{selected.plain}</p>
    </div>
  );
}

function PatternLivePreview({ selected }) {
  const config = {
    "login-pattern": {
      title: "登录账号",
      fields: ["邮箱", "密码"],
      action: "登录",
      meta: "忘记密码?",
    },
    "search-pattern": {
      title: "搜索结果",
      fields: ["搜索 UI 关键词"],
      action: "搜索",
      chips: ["组件", "场景", "词典"],
    },
    "filter-pattern": {
      title: "筛选商品",
      checks: ["可用", "促销", "高评分"],
      action: "应用筛选",
    },
    "upload-pattern": {
      title: "上传文件",
      fields: ["拖拽或选择文件"],
      action: "上传",
      progress: true,
    },
    "checkout-pattern": {
      title: "确认订单",
      rows: ["UI 模板包 ¥129", "图标资源 ¥39"],
      action: "支付",
    },
    "delete-confirmation": {
      title: "删除文件?",
      fields: ["此操作无法撤销"],
      action: "确认删除",
      danger: true,
    },
    "signup-pattern": {
      title: "创建账号",
      fields: ["邮箱", "验证码", "密码"],
      action: "注册",
      steps: ["资料", "验证", "完成"],
    },
    "sort-pattern": {
      title: "排序方式",
      chips: ["最新", "价格", "评分"],
      action: "应用排序",
    },
    "onboarding-pattern": {
      title: "新手引导",
      steps: ["欢迎", "选择目标", "开始使用"],
      action: "下一步",
    },
    "settings-pattern": {
      title: "偏好设置",
      checks: ["通知", "自动保存", "减少动效"],
      action: "保存设置",
    },
    "form-fill-pattern": {
      title: "填写资料",
      fields: ["姓名", "电话", "备注"],
      action: "提交",
    },
    "error-message-pattern": {
      title: "输入有误",
      fields: ["邮箱格式不正确"],
      action: "重新填写",
      danger: true,
    },
  };
  const data = config[selected.id] || { title: selected.title, fields: ["示例输入"], action: "继续" };

  return (
    <div className={`live-pattern-demo ${selected.preview}`}>
      <div className="pattern-panel">
        <header>
          <strong>{data.title}</strong>
          <span>{selected.summary}</span>
        </header>
        {data.steps && (
          <div className="pattern-steps">
            {data.steps.map((step, index) => <b key={step} className={index === 0 ? "active" : ""}>{step}</b>)}
          </div>
        )}
        {data.chips && (
          <div className="pattern-chips">
            {data.chips.map((chip, index) => <b key={chip} className={index === 0 ? "active" : ""}>{chip}</b>)}
          </div>
        )}
        {data.checks && (
          <div className="pattern-checks">
            {data.checks.map((check, index) => <label key={check}><input type="checkbox" defaultChecked={index === 0} /> {check}</label>)}
          </div>
        )}
        {data.rows && (
          <div className="pattern-rows">
            {data.rows.map((row) => <span key={row}>{row}</span>)}
          </div>
        )}
        {data.fields?.map((field, index) => (
          <input key={`${field}-${index}`} placeholder={field} defaultValue={data.danger && index === 0 ? field : ""} />
        ))}
        {data.progress && <div className="live-progress-bar"><i /></div>}
        {data.meta && <small>{data.meta}</small>}
        <button type="button" className={data.danger ? "danger" : ""}>{data.action}</button>
      </div>
    </div>
  );
}

function PlaygroundButton({ playground }) {
  const loading = playground.state === "loading";
  const disabled = playground.state === "disabled" || loading;
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "demo-button",
        `demo-${playground.style}`,
        `demo-radius-${playground.radius}`,
        loading ? "is-loading" : "",
      ].join(" ")}
    >
      {loading && <span className="spinner-dot" aria-hidden="true" />}
      {playground.style === "text" ? "文字按钮" : "主要按钮"}
    </button>
  );
}

function PlaygroundControls({ playground, setPlayground }) {
  return (
    <div className="control-stack">
      <SegmentedControl
        label="样式"
        value={playground.style}
        options={styleLabels}
        onChange={(style) => setPlayground((current) => ({ ...current, style }))}
      />
      <SegmentedControl
        label="状态"
        value={playground.state}
        options={stateLabels}
        onChange={(state) => setPlayground((current) => ({ ...current, state }))}
      />
      <SegmentedControl
        label="圆角"
        value={playground.radius}
        options={radiusLabels}
        onChange={(radius) => setPlayground((current) => ({ ...current, radius }))}
      />
    </div>
  );
}

function GenericControls({ selected }) {
  return (
    <div className="generic-controls">
      {selected.variants.slice(0, 3).map((variant, index) => (
        <button key={variant} type="button" className={index === 0 ? "selected" : ""}>
          {variant}
        </button>
      ))}
      {selected.variants.length === 0 && (
        <button type="button" className="selected">
          默认视图
        </button>
      )}
    </div>
  );
}

function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div className="segmented-row">
      <span>{label}</span>
      <div className="segmented-control">
        {Object.entries(options).map(([key, optionLabel]) => (
          <button
            key={key}
            type="button"
            className={value === key ? "active" : ""}
            onClick={() => onChange(key)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoGrid({ selected }) {
  const blocks = [
    ["常见用途", selected.useCases],
    ["常见变体", selected.variants],
    ["状态", selected.states],
    ["不要这样用", selected.dont],
    ["无障碍提醒", selected.accessibility],
  ].filter(([, values]) => values.length > 0);

  return (
    <div className="info-grid">
      {blocks.slice(0, 5).map(([label, values]) => (
        <div key={label}>
          <h3>{label}</h3>
          <ul>
            {values.slice(0, 4).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Comparison({ selected }) {
  const comparison = selected.comparison || {
    left: selected.title,
    right: findItem(selected.related[0] || "button").title,
    note: "先看它解决的问题，再判断是否需要换成相似 UI。",
  };

  return (
    <div className="comparison-row">
      <div>
        <strong>{comparison.left}</strong>
        <span>{selected.summary}</span>
      </div>
      <span className="versus">vs</span>
      <div>
        <strong>{comparison.right}</strong>
        <span>{comparison.note}</span>
      </div>
      <ChevronRight size={22} strokeWidth={1.7} />
    </div>
  );
}

function ExploreSection({ activeSection, onSection, onChoose }) {
  const grouped = sections.map((section) => ({
    ...section,
    items: uiItems.filter((entry) => entry.category === section.id),
  }));

  return (
    <section className="explore-section" aria-labelledby="explore-title">
      <div className="section-heading">
        <h2 id="explore-title">完整图鉴</h2>
        <p>所有栏目都可以搜索、收藏和打开详情。</p>
      </div>
      <div className="section-board">
        {grouped.map((section) => (
          <article key={section.id} className={activeSection === section.id ? "current" : ""}>
            <button type="button" className="board-title" onClick={() => onSection(section.id)}>
              <span>{section.label}</span>
              <small>{section.items.length}</small>
              <ChevronRight size={18} />
            </button>
            <p>{categoryDescriptions[section.id]}</p>
            <div className="board-links">
              {section.items.map((entry) => (
                <button key={entry.id} type="button" onClick={() => onChoose(entry)}>
                  {entry.title}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="qa-strip">
        {[
          ["Toast / Alert / Modal", "轻提示、警告和弹窗的打断程度不同。"],
          ["按钮 / 链接", "动作和跳转不要混用。"],
          ["卡片 / 列表 / 表格", "看对象、看连续内容、看数据对比。"],
        ].map(([title, text]) => (
          <div key={title}>
            <CornerDownRight size={18} />
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniPreview({ type, large = false }) {
  const className = `mini-preview preview-${type} ${large ? "large" : ""}`;

  if (type.includes("layout")) return <LayoutPreview type={type} large={large} />;
  if (type.includes("style")) return <StylePreview type={type} large={large} />;
  if (type.includes("motion")) return <MotionPreview type={type} large={large} />;
  if (type.includes("pattern")) return <PatternPreview type={type} large={large} />;

  switch (type) {
    case "button":
      return (
        <span className={className}>
          <span className="mini-solid">确定</span>
          <span className="mini-outline">取消</span>
          <span className="mini-text">更多</span>
        </span>
      );
    case "text":
      return (
        <span className={className}>
          <span className="mini-input">请输入内容 <X size={13} /></span>
        </span>
      );
    case "modal":
      return (
        <span className={className}>
          <span className="mini-modal">
            <strong>删除文件?</strong>
            <small>此操作无法撤销。</small>
            <em><b>取消</b><b>删除</b></em>
          </span>
        </span>
      );
    case "toast":
      return (
        <span className={className}>
          <span className="mini-toast"><Check size={14} /> 保存成功 <X size={13} /></span>
        </span>
      );
    case "tabs":
      return (
        <span className={className}>
          <span className="mini-tabs"><b>标签一</b><b>标签二</b><b>标签三</b></span>
        </span>
      );
    case "icon-button":
      return (
        <span className={className}>
          <span className="mini-icon-buttons"><i /><i /><i /></span>
        </span>
      );
    case "link":
      return (
        <span className={className}>
          <span className="mini-link-row">查看详情 <ChevronRight size={14} /></span>
        </span>
      );
    case "menu":
      return (
        <span className={className}>
          <span className="mini-menu">
            <i><b /><b /><b /></i>
            <em><span>编辑</span><span>复制</span><span>删除</span></em>
          </span>
        </span>
      );
    case "dropdown":
    case "select":
      return (
        <span className={className}>
          <span className="mini-dropdown">
            <strong>最新优先 <ChevronRight size={13} /></strong>
            <em><span>价格</span><span>评分</span></em>
          </span>
        </span>
      );
    case "floating-action-button":
      return (
        <span className={className}>
          <span className="mini-fab">+</span>
        </span>
      );
    case "toolbar":
      return (
        <span className={className}>
          <span className="mini-toolbar"><b>B</b><b>I</b><b>↗</b><i /></span>
        </span>
      );
    case "command-palette":
      return (
        <span className={className}>
          <span className="mini-command"><strong>搜索命令</strong><b /><b /></span>
        </span>
      );
    case "textarea":
      return (
        <span className={className}>
          <span className="mini-textarea"><b /><b /><b /></span>
        </span>
      );
    case "search":
      return (
        <span className={className}>
          <span className="mini-search"><Search size={14} /><b>搜索关键词</b></span>
        </span>
      );
    case "password-field":
      return (
        <span className={className}>
          <span className="mini-password"><b>••••••••</b><i /></span>
        </span>
      );
    case "slider":
      return (
        <span className={className}>
          <span className="mini-slider"><i /><b /></span>
        </span>
      );
    case "date-picker":
    case "calendar":
      return (
        <span className={className}>
          <span className="mini-calendar">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "file-upload":
      return (
        <span className={className}>
          <span className="mini-upload"><ArrowUp size={16} /><b>上传文件</b></span>
        </span>
      );
    case "autocomplete":
      return (
        <span className={className}>
          <span className="mini-autocomplete"><strong>北京</strong><em>北京市</em><em>北京南站</em></span>
        </span>
      );
    case "top-navigation":
      return (
        <span className={className}>
          <span className="mini-topnav"><b /><i /><i /><i /></span>
        </span>
      );
    case "sidebar":
      return (
        <span className={className}>
          <span className="mini-sidebar"><b /><i /><i /><i /></span>
        </span>
      );
    case "breadcrumb":
      return (
        <span className={className}>
          <span className="mini-breadcrumb"><b>首页</b><i /> <b>组件</b><i /> <b>菜单</b></span>
        </span>
      );
    case "pagination":
      return (
        <span className={className}>
          <span className="mini-pagination"><i /><b>1</b><i /><i /></span>
        </span>
      );
    case "stepper":
      return (
        <span className={className}>
          <span className="mini-stepper"><b>1</b><i /><b>2</b><i /><b>3</b></span>
        </span>
      );
    case "bottom-navigation":
      return (
        <span className={className}>
          <span className="mini-bottomnav"><b /><i /><i /><i /></span>
        </span>
      );
    case "back-button":
      return (
        <span className={className}>
          <span className="mini-back">← 返回</span>
        </span>
      );
    case "card":
      return (
        <span className={className}>
          <span className="mini-card"><i /><b /><b /><b /></span>
        </span>
      );
    case "skeleton":
      return (
        <span className={className}>
          <span className="mini-skeleton"><i /><b /><b /><b /></span>
        </span>
      );
    case "table":
      return (
        <span className={className}>
          <span className="mini-table">{Array.from({ length: 9 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "badge":
      return (
        <span className={className}>
          <span className="mini-badge">消息 <b>3</b></span>
        </span>
      );
    case "switch":
      return (
        <span className={className}>
          <span className="mini-switch active"><i /></span>
          <span className="mini-switch"><i /></span>
        </span>
      );
    case "checkbox":
      return (
        <span className={className}>
          <span className="mini-check checked"><Check size={12} /></span>
          <span className="mini-check" />
          <span className="mini-line" />
        </span>
      );
    case "radio":
      return (
        <span className={className}>
          <span className="mini-radio active" />
          <span className="mini-radio" />
          <span className="mini-line" />
        </span>
      );
    case "progress":
      return (
        <span className={className}>
          <span className="mini-progress"><i /></span>
        </span>
      );
    case "tooltip":
      return (
        <span className={className}>
          <span className="mini-outline">?</span>
          <span className="mini-tip">说明</span>
        </span>
      );
    case "accordion":
      return (
        <span className={className}>
          <span className="mini-accordion"><b>问题一</b><i /><b>问题二</b></span>
        </span>
      );
    case "drawer":
      return (
        <span className={className}>
          <span className="mini-drawer"><i /><b /><b /><b /></span>
        </span>
      );
    case "list":
      return (
        <span className={className}>
          <span className="mini-list"><b /><b /><b /></span>
        </span>
      );
    case "avatar":
      return (
        <span className={className}>
          <span className="mini-avatar">UI</span>
        </span>
      );
    case "tag":
      return (
        <span className={className}>
          <span className="mini-tags"><b>新</b><b>热门</b><b>推荐</b></span>
        </span>
      );
    case "popover":
      return (
        <span className={className}>
          <span className="mini-popover"><b>目标</b><em>浮层说明</em></span>
        </span>
      );
    case "carousel":
      return (
        <span className={className}>
          <span className="mini-carousel"><i /><i /><i /><b /><b /><b /></span>
        </span>
      );
    case "timeline":
      return (
        <span className={className}>
          <span className="mini-timeline"><i /><b /><i /><b /><i /></span>
        </span>
      );
    case "alert":
    case "confirmation":
    case "success-state":
    case "error-state":
    case "notification":
      return (
        <span className={className}>
          <span className={`mini-status ${type}`}><i /><b /><b /></span>
        </span>
      );
    case "spinner":
      return (
        <span className={className}>
          <span className="mini-spinner" />
        </span>
      );
    case "form":
      return (
        <span className={className}>
          <span className="mini-form"><b /><b /><i /></span>
        </span>
      );
    case "data-grid":
      return (
        <span className={className}>
          <span className="mini-datagrid">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "filter-panel":
      return (
        <span className={className}>
          <span className="mini-filter"><b /><b /><i /></span>
        </span>
      );
    case "sort-control":
      return (
        <span className={className}>
          <span className="mini-sort"><b>排序</b><i /><i /></span>
        </span>
      );
    case "media-player":
      return (
        <span className={className}>
          <span className="mini-media"><Play size={17} fill="currentColor" /><b /></span>
        </span>
      );
    case "chat-bubble":
      return (
        <span className={className}>
          <span className="mini-chat"><b>你好</b><b>收到</b></span>
        </span>
      );
    case "comment-box":
      return (
        <span className={className}>
          <span className="mini-comment"><b /><i>发送</i></span>
        </span>
      );
    case "rating":
      return (
        <span className={className}>
          <span className="mini-rating">★★★★★ <b>4.8</b></span>
        </span>
      );
    case "shopping-cart":
      return (
        <span className={className}>
          <span className="mini-cart"><b>2</b><i /><strong>¥168</strong></span>
        </span>
      );
    case "empty":
      return (
        <span className={className}>
          <span className="mini-empty"><CircleHelp size={20} /><b /></span>
        </span>
      );
    default:
      return (
        <span className={className}>
          <span className="mini-generic"><SlidersHorizontal size={20} /><b /><b /></span>
        </span>
      );
  }
}

function LayoutPreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`layout-preview ${type}`}>
        <i /><i /><i /><i /><i /><i />
      </span>
    </span>
  );
}

function StylePreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`style-preview ${type}`}>
        <i /><b /><b />
      </span>
    </span>
  );
}

function MotionPreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`motion-preview ${type}`}>
        <i />
      </span>
    </span>
  );
}

function PatternPreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`pattern-preview ${type}`}>
        <i /><b /><b /><em />
      </span>
    </span>
  );
}
