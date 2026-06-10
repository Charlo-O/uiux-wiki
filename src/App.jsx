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

const allSection = { id: "all", label: "全部" };
const headerSections = [allSection, ...sections];
const sectionLabelById = new Map(sections.map((section) => [section.id, section.label]));

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

function getVariantOptions(selected) {
  return selected.variants.length > 0 ? selected.variants : ["默认视图"];
}

function getActiveVariant(selected, activeVariantById) {
  const options = getVariantOptions(selected);
  const stored = activeVariantById[selected.id];
  return options.includes(stored) ? stored : options[0];
}

function getVariantIndex(selected, variant) {
  const index = getVariantOptions(selected).indexOf(variant);
  return index >= 0 ? index : 0;
}

function variantHas(variant = "", keywords) {
  return keywords.some((keyword) => variant.includes(keyword));
}

function getVariantPreviewClass(variant = "", index = 0) {
  const classes = [`variant-index-${index}`];

  if (variantHas(variant, ["描边", "边框", "线性", "虚线"])) classes.push("variant-outline");
  if (variantHas(variant, ["文字", "正文", "文本"])) classes.push("variant-textual");
  if (variantHas(variant, ["错误", "危险", "删除", "失败"])) classes.push("variant-danger");
  if (variantHas(variant, ["成功", "已选", "开启", "主", "高亮"])) classes.push("variant-success");
  if (variantHas(variant, ["警告", "提示", "通知", "半选"])) classes.push("variant-warning");
  if (variantHas(variant, ["紧凑", "小", "迷你"])) classes.push("variant-compact");
  if (variantHas(variant, ["宽松", "大", "舒展"])) classes.push("variant-spacious");
  if (variantHas(variant, ["深色", "暗色", "暗黑", "高对比"])) classes.push("variant-dark");
  if (variantHas(variant, ["图片", "头像", "图标", "音频", "视频", "媒体"])) classes.push("variant-media");
  if (variantHas(variant, ["底部", "抽屉"])) classes.push("variant-bottom");
  if (variantHas(variant, ["全屏", "页面"])) classes.push("variant-fullscreen");
  if (variantHas(variant, ["加载", "不确定"])) classes.push("variant-loading");
  if (variantHas(variant, ["多选", "分组", "分步", "范围"])) classes.push("variant-grouped");
  if (variantHas(variant, ["只读", "禁用", "关闭"])) classes.push("variant-muted");
  if (variantHas(variant, ["搜索", "建议", "命令"])) classes.push("variant-search");

  return classes.join(" ");
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
  const [activeSection, setActiveSection] = useState("all");
  const [selectedId, setSelectedId] = useState("button");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useStoredList("uiux.wiki:favorites", []);
  const [reducedMotion, setReducedMotion] = useStoredList("uiux.wiki:reduced-motion", false);
  const [playground, setPlayground] = useState(initialPlayground);
  const [previewModalId, setPreviewModalId] = useState("");
  const [activeVariantById, setActiveVariantById] = useState({});
  const [notice, setNotice] = useState("");

  const selected = findItem(selectedId);
  const previewModalItem = previewModalId ? findItem(previewModalId) : null;
  const activeVariant = getActiveVariant(selected, activeVariantById);
  const previewModalVariant = previewModalItem ? getActiveVariant(previewModalItem, activeVariantById) : "";

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
      : activeSection === "all"
        ? uiItems
      : uiItems.filter((entry) => entry.category === activeSection);
    return base.filter((entry) => itemMatchesQuery(entry, query));
  }, [activeSection, query]);

  const listLabel = query
    ? `找到 ${visibleItems.length} 个相关 UI`
    : activeSection === "all"
      ? `全部 ${uiItems.length} 个 UI 条目都在这里。`
    : categoryDescriptions[activeSection];

  function chooseSection(sectionId) {
    setActiveSection(sectionId);
    setQuery("");
    const first =
      sectionId === "all" ? uiItems[0] : uiItems.find((entry) => entry.category === sectionId);
    if (first) setSelectedId(first.id);
  }

  function chooseItem(entry) {
    setSelectedId(entry.id);
  }

  function openHomePreview(entry) {
    setSelectedId(entry.id);
    setPreviewModalId(entry.id);
  }

  function submitSearch(event) {
    event.preventDefault();
    const first = uiItems.find((entry) => itemMatchesQuery(entry, query));
    if (first) {
      chooseItem(first);
      if (activeSection === "all") setPreviewModalId(first.id);
      setNotice(`已打开「${first.title}」`);
    } else if (query.trim()) {
      setNotice("没有找到完全匹配的条目");
    }
  }

  function clearDialog() {
    setQuery("");
    setActiveSection("all");
    setSelectedId("button");
    setPlayground(initialPlayground);
    setActiveVariantById({});
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

  function chooseVariant(entryId, variant) {
    setActiveVariantById((current) => ({
      ...current,
      [entryId]: variant,
    }));
  }

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id && uiItems.some((entry) => entry.id === id)) chooseItem(findItem(id));
  }, []);

  const isAllPage = activeSection === "all";

  return (
    <main className="app-shell">
      <Header
        activeSection={activeSection}
        onSection={chooseSection}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      {isAllPage ? (
        <>
          <SearchComposer
            query={query}
            setQuery={setQuery}
            onSubmit={submitSearch}
            showQuickQuestions={false}
          />
          <AllComponentsPage
            items={visibleItems}
            query={query}
            selectedId={selectedId}
            onChoose={openHomePreview}
          />
        </>
      ) : (
        <>
          <SearchComposer query={query} setQuery={setQuery} onSubmit={submitSearch} />

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
              activeVariant={activeVariant}
              onVariantChange={(variant) => chooseVariant(selected.id, variant)}
              isFavorite={favorites.includes(selected.id)}
              onFavorite={() => toggleFavorite(selected.id)}
              onShare={shareCurrent}
            />
          </section>
        </>
      )}

      <footer className="site-footer">
        <span>内容由 uiux.wiki 整理，旨在帮助你快速理解界面语言。</span>
      </footer>

      {isAllPage && previewModalItem && (
        <PreviewModal
          selected={previewModalItem}
          playground={playground}
          setPlayground={setPlayground}
          activeVariant={previewModalVariant}
          onVariantChange={(variant) => chooseVariant(previewModalItem.id, variant)}
          onClose={() => setPreviewModalId("")}
        />
      )}

      <div className={`toast ${notice ? "show" : ""}`} role="status" aria-live="polite">
        {notice}
      </div>
    </main>
  );
}
function SearchComposer({ query, setQuery, onSubmit, showQuickQuestions = true }) {
  return (
    <section
      className={`composer-section ${showQuickQuestions ? "" : "home-composer-section"}`}
      aria-labelledby="site-title"
    >
      <div className="composer-title">
        <h1 id="site-title">uiux.wiki</h1>
        <p>用最简单的图和话，看懂常见界面。</p>
      </div>
      <form className="composer" onSubmit={onSubmit} role="search">
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
      {showQuickQuestions && (
        <div className="quick-questions" aria-label="快捷问题">
          <span>试试问：</span>
          {quickQuestions.slice(0, 3).map((question) => (
            <button key={question} type="button" onClick={() => setQuery(question)}>
              {question}
            </button>
          ))}
        </div>
      )}
    </section>
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

function AllComponentsPage({ items, query, selectedId, onChoose }) {
  const grouped = sections
    .map((section) => ({
      ...section,
      items: items.filter((entry) => entry.category === section.id),
    }))
    .filter((section) => !query || section.items.length > 0);

  return (
    <section className="all-components-page" aria-labelledby="all-components-title">
      <div className="all-page-heading">
        <span className="panel-kicker">全部展示</span>
        <h1 id="all-components-title">全部组件</h1>
      </div>
      <div className="all-component-groups">
        {grouped.length > 0 ? grouped.map((section) => (
          <section key={section.id} className="all-component-group" aria-labelledby={`${section.id}-showcase-title`}>
            <div className="all-component-group-heading">
              <h2 id={`${section.id}-showcase-title`}>{section.label}</h2>
              <span>{section.items.length}</span>
            </div>
            <div className="component-showcase-grid">
              {section.items.map((entry, index) => (
                <ComponentTile
                  key={entry.id}
                  entry={entry}
                  index={index}
                  active={entry.id === selectedId}
                  onChoose={() => onChoose(entry)}
                />
              ))}
            </div>
          </section>
        )) : (
          <EmptyList activeSection="all" />
        )}
      </div>
    </section>
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
      <div className={`entry-list full-entry-list ${activeSection === "components" ? "scrollable" : ""}`}>
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

function ComponentTile({ entry, index, active, onChoose }) {
  return (
    <button
      className={`component-tile ${active ? "active" : ""}`}
      type="button"
      aria-label={`预览 ${entry.title} ${entry.english}`}
      aria-current={active ? "true" : undefined}
      onClick={onChoose}
    >
      <span className="component-tile-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <small>{sectionLabelById.get(entry.category) || entry.group}</small>
      </span>
      <span className="component-tile-preview">
        <MiniPreview type={entry.preview} />
      </span>
      <span className="component-tile-copy">
        <strong>{entry.title}</strong>
        <em>{entry.english}</em>
        <span>{entry.group}</span>
      </span>
    </button>
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
  const fallbackLabel = activeSection === "all" ? "全部" : sectionLabelById.get(activeSection) || "组件";

  return (
    <div className="empty-list">
      <CircleHelp size={28} strokeWidth={1.6} />
      <strong>没有匹配条目</strong>
      <span>
        {`试试切换到「${fallbackLabel}」的其他关键词。`}
      </span>
    </div>
  );
}

function DetailPanel({
  selected,
  playground,
  setPlayground,
  activeVariant,
  onVariantChange,
  isFavorite,
  onFavorite,
  onShare,
}) {
  const hasCustomPlayground = false;

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
          <LivePreview selected={selected} playground={playground} variant={activeVariant} />
        </div>
        <PreviewContext selected={selected} />
      </div>

      <div className="answer-section">
        <h3>{hasCustomPlayground ? "自定义试玩" : "常见变体"}</h3>
        {hasCustomPlayground ? (
          <PlaygroundControls playground={playground} setPlayground={setPlayground} />
        ) : (
          <VariantOverview selected={selected} value={activeVariant} onChange={onVariantChange} />
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

function PreviewModal({ selected, playground, setPlayground, activeVariant, onVariantChange, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasCustomPlayground = false;

  return (
    <div className="component-detail-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="component-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="component-detail-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="component-detail-dialog-heading">
          <span className="panel-kicker">{sectionLabelById.get(selected.category) || selected.group}</span>
          <button type="button" aria-label="关闭预览弹窗" onClick={onClose}>
            <X size={20} />
          </button>
          <h2 id="component-detail-dialog-title">
            {selected.title}
            <span>{selected.english}</span>
          </h2>
          <p>{selected.plain}</p>
        </div>

        <div className="component-detail-dialog-stage">
          <LivePreview selected={selected} playground={playground} variant={activeVariant} />
        </div>

        <PreviewContext selected={selected} />

        <div className="component-detail-dialog-lower">
          <div>
            <h3>{hasCustomPlayground ? "自定义试玩" : "常见变体"}</h3>
            {hasCustomPlayground ? (
              <PlaygroundControls playground={playground} setPlayground={setPlayground} />
            ) : (
              <VariantOverview selected={selected} value={activeVariant} onChange={onVariantChange} />
            )}
          </div>
          <div>
            <h3>使用提醒</h3>
            <ul>
              {selected.do.slice(0, 3).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function LivePreview({ selected, playground, variant }) {
  const variantIndex = getVariantIndex(selected, variant);
  let preview;

  if (selected.category === "layouts") preview = <LayoutLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "styles") preview = <StyleLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "motion") preview = <MotionLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "patterns") preview = <PatternLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "dictionary") {
    const related = findItem(selected.related[0] || "button");
    preview = (
      <ComponentLivePreview
        selected={related.id === selected.id ? selected : related}
        term={selected}
        variant={variant}
      />
    );
  } else {
    preview = <ComponentLivePreview selected={selected} variant={variant} />;
  }

  if (selected.variants.length === 0) return preview;

  return (
    <VariantPreviewShell selected={selected} variant={variant} index={variantIndex}>
      {preview}
    </VariantPreviewShell>
  );
}

function VariantPreviewShell({ selected, variant, index, children }) {
  return (
    <div
      className={`variant-preview-shell ${getVariantPreviewClass(variant, index)}`}
      data-variant={variant}
    >
      <div className="variant-preview-badge">
        <span>{variant || getVariantOptions(selected)[0]}</span>
      </div>
      {children}
    </div>
  );
}

function ComponentLivePreview({ selected, term, variant = "" }) {
  const id = selected.id;
  const variantIndex = getVariantIndex(selected, variant);
  const variantClass = getVariantPreviewClass(variant, variantIndex);
  const isDangerVariant = variantHas(variant, ["错误", "危险", "删除", "失败"]);
  const isReadonlyVariant = variantHas(variant, ["只读", "禁用"]);
  const hasIconVariant = variantHas(variant, ["图标", "搜索", "建议", "命令"]);
  const hasClearVariant = variantHas(variant, ["清除"]);
  const hasRecommendationVariant = variantHas(variant, ["建议", "推荐"]);

  if (id === "button") {
    return (
      <div className={`live-button-card ${variantClass}`}>
        <button type="button">{variant || "主要操作"}</button>
        <button type="button">次要操作</button>
        <button type="button" className="danger">危险操作</button>
      </div>
    );
  }

  if (["text-field", "textarea", "search", "password-field", "autocomplete"].includes(id)) {
    return (
      <div className={`live-card live-form-card ${variantClass}`}>
        <label>{selected.title}</label>
        {id === "textarea" ? (
          <textarea
            defaultValue={variantHas(variant, ["字数"]) ? "这是一段可以编辑的长文本。 38 / 120" : "这是一段可以编辑的长文本。"}
            readOnly={isReadonlyVariant}
          />
        ) : (
          <div className={`live-input ${id === "search" || id === "autocomplete" || hasIconVariant ? "info" : ""}`}>
            {(id === "search" || hasIconVariant) && <Search size={18} />}
            <input
              type={id === "password-field" ? "password" : "text"}
              defaultValue={
                id === "password-field"
                  ? "password"
                  : id === "autocomplete" || hasRecommendationVariant
                    ? "北京"
                    : isDangerVariant
                      ? "hello@"
                      : ""
              }
              placeholder={id === "password-field" ? "请输入密码" : isDangerVariant ? "输入内容有误" : "请输入内容"}
              readOnly={isReadonlyVariant}
            />
            {hasClearVariant && <X size={16} />}
            {(id === "autocomplete" || hasRecommendationVariant) && <span>推荐</span>}
          </div>
        )}
        <small>
          {isDangerVariant
            ? "请修正当前输入后再继续。"
            : isReadonlyVariant
              ? "当前内容只读，不允许直接编辑。"
              : id === "password-field"
                ? "至少 8 位，建议包含数字。"
                : "输入时应该有清楚的焦点和帮助说明。"}
        </small>
      </div>
    );
  }

  if (["modal", "confirmation", "term-modal"].includes(id) || id.includes("delete")) {
    return (
      <div className={`live-modal-scene ${variantClass}`}>
        <div className="live-page-lines"><i /><i /><i /></div>
        <div className="live-dialog">
          <strong>{variant || (selected.title.includes("删除") ? "删除文件？" : selected.title)}</strong>
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
    const tone = isDangerVariant || id.includes("error") || id === "alert"
      ? "danger"
      : variantHas(variant, ["警告", "通知"])
        ? "warning"
        : "success";
    return (
      <div className={`live-alert-demo ${tone} ${variantClass}`}>
        <div className="live-alert">
          <Check size={18} />
          <div>
            <strong>{variant || (tone === "danger" ? "需要处理" : tone === "warning" ? "有新提醒" : "保存成功")}</strong>
            <span>{selected.summary}</span>
          </div>
          <X size={16} />
        </div>
      </div>
    );
  }

  if (["table", "data-grid"].includes(id)) {
    return (
      <div className={`live-table ${variantClass}`}>
        {["名称", "状态", "时间"].map((head) => <b key={head}>{head}</b>)}
        {["订单 A", "完成", "今天", "订单 B", "待处理", "昨天", "订单 C", "失败", "周一"].map((cell, index) => (
          <span key={`${cell}-${index}`} className={cell === "失败" ? "danger-text" : cell === "完成" ? "success-text" : ""}>{cell}</span>
        ))}
      </div>
    );
  }

  if (id === "card") {
    return (
      <div className={`live-content-card ${variantClass}`}>
        <i />
        <strong>{variant || "内容卡片"}</strong>
        <p>{selected.plain}</p>
        <button type="button">查看详情</button>
      </div>
    );
  }

  if (id === "skeleton") {
    return (
      <div className={`live-skeleton-card ${variantClass}`}>
        <i /><b /><b /><b />
      </div>
    );
  }

  if (id === "empty-state") {
    return (
      <div className={`live-empty-card ${variantClass}`}>
        <CircleHelp size={34} />
        <strong>{variantHas(variant, ["搜索"]) ? "没有找到结果" : variantHas(variant, ["失败"]) ? "加载失败" : "这里还没有内容"}</strong>
        <span>{selected.summary}</span>
        <button type="button">创建一个</button>
      </div>
    );
  }

  if (id === "floating-action-button") {
    return (
      <div className={`live-fab-card ${variantClass}`}>
        <i /><i /><i />
        <button type="button" aria-label="新建">{variantHas(variant, ["扩展"]) ? "新建" : "+"}</button>
      </div>
    );
  }

  if (["progress", "spinner", "file-upload"].includes(id)) {
    if (id === "spinner") {
      return (
        <div className="live-spinner-card">
          <i aria-hidden="true" />
          <strong>{variant || "正在加载"}</strong>
          <span>{selected.summary}</span>
        </div>
      );
    }

    if (id === "file-upload") {
      return (
        <div className={`live-upload-card ${variantClass}`}>
          <strong>{variant || "拖拽文件到这里"}</strong>
          <span>{variantHas(variant, ["图片"]) ? "支持 PNG、JPG，上传后显示缩略图。" : "支持 PNG、PDF、ZIP，上传后显示进度。"}</span>
          <div className="live-progress-bar"><i /></div>
        </div>
      );
    }

    return (
      <div className={`live-progress-card ${variantClass}`}>
        <strong>{variant || selected.title}</strong>
        <div className="live-progress-bar"><i /></div>
        <span>{variantHas(variant, ["不确定"]) ? "正在处理，请稍候" : "正在处理 62%"}</span>
      </div>
    );
  }

  if (id === "slider") {
    return (
      <div className={`live-slider-card ${variantClass}`}>
        <strong>{variantHas(variant, ["范围"]) ? "价格 20 - 80" : "音量 62%"}</strong>
        <input type="range" defaultValue={variantHas(variant, ["刻度"]) ? "80" : "62"} />
        <span>滑杆适合连续数值，而不是少量固定选项。</span>
      </div>
    );
  }

  if (id === "date-picker" || id === "calendar") {
    return (
      <div className={`live-calendar-card ${variantClass}`}>
        <header><strong>{variantHas(variant, ["周"]) ? "本周日程" : variantHas(variant, ["日程"]) ? "今天日程" : "2026 年 6 月"}</strong><span>今天</span></header>
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
      <div className={`live-form-card ${variantClass}`}>
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
      <div className={`live-settings-card ${variantClass}`}>
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
      <div className={`live-menu-card ${isDropdown ? "dropdown" : ""} ${variantClass}`}>
        <div className="live-menu-trigger">
          <span>{variant || (isDropdown ? "排序方式" : "更多操作")}</span>
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
      <div className={`live-link-card ${variantClass}`}>
        <span>帮助中心</span>
        <ChevronRight size={18} />
        <strong>{variant || selected.title}</strong>
        <p>{selected.plain}</p>
      </div>
    );
  }

  if (id === "icon-button") {
    return (
      <div className={`live-icon-button-card ${variantClass}`}>
        <button type="button" aria-label="搜索"><Search size={20} /></button>
        <button type="button" aria-label="收藏"><Bookmark size={20} /></button>
        <button type="button" aria-label="分享"><Share2 size={20} /></button>
      </div>
    );
  }

  if (["top-navigation", "sidebar", "breadcrumb", "pagination", "stepper", "bottom-navigation", "back-button"].includes(id)) {
    return (
      <div className={`live-nav-card ${id} ${variantClass}`}>
        <header><span>首页</span><span>组件</span><span>设置</span></header>
        <aside><b /><b /><b /></aside>
        <main>
          <strong>{variant || selected.title}</strong>
          <p>{selected.plain}</p>
          <div><i /><i /><i /></div>
        </main>
      </div>
    );
  }

  if (id === "accordion") {
    return (
      <div className={`live-accordion-card ${variantClass}`}>
        <details open><summary>常见问题</summary><p>{selected.plain}</p></details>
        <details><summary>更多说明</summary></details>
      </div>
    );
  }

  if (id === "drawer") {
    return (
      <div className={`live-drawer-card ${variantClass}`}>
        <aside><strong>{variant || "抽屉标题"}</strong><span>设置</span><span>通知</span><span>账户</span></aside>
        <main><i /><i /><i /></main>
      </div>
    );
  }

  if (["popover", "tooltip"].includes(id)) {
    return (
      <div className={`live-popover-card ${id} ${variantClass}`}>
        <button type="button">悬停/点击目标</button>
        <div><strong>{variant || selected.title}</strong><span>{selected.summary}</span></div>
      </div>
    );
  }

  if (id === "carousel") {
    return (
      <div className={`live-carousel-card ${variantClass}`}>
        <div><strong>推荐内容</strong><span>1 / 3</span></div>
        <section><i /><i /><i /></section>
        <footer><b /><b /><b /></footer>
      </div>
    );
  }

  if (["tabs"].includes(id)) {
    return (
      <div className={`live-tabs-card ${variantClass}`}>
        <div className="live-tabs"><b>概览</b><span>详情</span><span>设置</span></div>
        <div className="live-content-block">
          <strong>{variant || selected.title}</strong>
          <p>{selected.plain}</p>
        </div>
      </div>
    );
  }

  if (id === "list") {
    return (
      <div className={`live-list-card ${variantClass}`}>
        {["订单更新", "设计任务", "用户反馈"].map((label, index) => (
          <div key={label}><b>{index + 1}</b><strong>{label}</strong><span>刚刚更新</span></div>
        ))}
      </div>
    );
  }

  if (id === "timeline") {
    return (
      <div className={`live-timeline-card ${variantClass}`}>
        {["提交", "审核", "发布"].map((label, index) => (
          <div key={label} className={index === 1 ? "active" : ""}><i /><strong>{label}</strong><span>第 {index + 1} 步</span></div>
        ))}
      </div>
    );
  }

  if (id === "rating") {
    return (
      <div className={`live-rating-card ${variantClass}`}>
        <strong>{variantHas(variant, ["数字"]) ? "9.6" : "4.8"}</strong>
        <div>{variantHas(variant, ["表情"]) ? "😍 😐 😕" : "★★★★★"}</div>
        <span>{selected.summary}</span>
      </div>
    );
  }

  if (["chat-bubble", "comment-box"].includes(id)) {
    return (
      <div className={`live-message-card ${id} ${variantClass}`}>
        <div><strong>{variant || (id === "chat-bubble" ? "小明" : "评论")}</strong><p>{selected.plain}</p></div>
        <input placeholder={id === "comment-box" ? "写下评论..." : "输入消息..."} />
      </div>
    );
  }

  if (["badge", "avatar", "tag"].includes(id)) {
    return (
      <div className={`live-social-card ${variantClass}`}>
        <div className="live-avatar">UI</div>
        <div>
          <strong>{variant || selected.title}</strong>
          <p>{selected.summary}</p>
          <span className="live-tag">{id === "rating" ? "4.8 分" : "新内容"}</span>
        </div>
      </div>
    );
  }

  if (id === "filter-panel") {
    return (
      <div className={`live-filter-card ${variantClass}`}>
        <strong>{variant || "筛选"}</strong>
        <label><input type="checkbox" defaultChecked /> 可用</label>
        <label><input type="checkbox" /> 促销</label>
        <div><span>0</span><i /><span>100</span></div>
      </div>
    );
  }

  if (id === "sort-control") {
    return (
      <div className={`live-sort-card ${variantClass}`}>
        <span>排序</span>
        <button type="button">{variant || "最新优先"}</button>
        <button type="button">价格升序</button>
        <button type="button">评分最高</button>
      </div>
    );
  }

  if (id === "command-palette") {
    return (
      <div className={`live-command-card ${variantClass}`}>
        <div><Search size={18} /><span>输入命令或搜索页面</span></div>
        <b>打开组件图鉴</b>
        <b>切换减少动效</b>
      </div>
    );
  }

  if (id === "media-player") {
    return (
      <div className={`live-media-card ${variantClass}`}>
        <section><Play size={28} fill="currentColor" /></section>
        <div><b /><span>01:26 / 03:40</span></div>
      </div>
    );
  }

  if (id === "shopping-cart") {
    return (
      <div className={`live-cart-card ${variantClass}`}>
        <strong>{variant || "购物车"}</strong>
        <div><span>UI 模板包</span><b>¥129</b></div>
        <div><span>图标资源</span><b>¥39</b></div>
        <button type="button">去结算</button>
      </div>
    );
  }

  if (["toolbar"].includes(id)) {
    return (
      <div className={`live-tool-card ${variantClass}`}>
        <div className="live-toolbar"><button>筛选</button><button>排序</button><button>导出</button></div>
        <div className="live-content-block">
          <strong>{variant || selected.title}</strong>
          <p>{selected.plain}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`live-generic-card ${variantClass}`}>
      <MiniPreview type={selected.preview} large />
      <strong>{variant || term?.title || selected.title}</strong>
      <p>{term?.plain || selected.plain}</p>
    </div>
  );
}

function LayoutLivePreview({ selected, variant }) {
  const template = {
    "single-column": "article",
    "two-column": "split",
    "sidebar-layout": "app",
    dashboard: "dashboard",
    "card-grid": "gallery",
    feed: "feed",
    "master-detail": "master",
    "settings-page": "settings",
    "checkout-page": "checkout",
    "three-column": "three",
    "sticky-header": "article",
    "sticky-sidebar": "app",
    masonry: "masonry",
    "split-pane": "split",
    wizard: "wizard",
    "fullscreen-modal": "modal",
    "landing-page": "landing",
    "profile-page": "profile",
    "search-results-page": "searchResults",
    "detail-page": "detail",
  }[selected.id] || "article";

  return (
    <div className={`live-layout-demo detailed-layout ${selected.preview} layout-template-${template}`}>
      <div className="layout-browser-bar">
        <b />
        <span>{variant || selected.title}</span>
        <i />
      </div>
      <LayoutScene template={template} />
    </div>
  );
}

function LayoutScene({ template }) {
  if (template === "dashboard") {
    return (
      <div className="layout-scene layout-dashboard-scene">
        <nav><b>总览</b><span>订单</span><span>用户</span><span>报表</span></nav>
        <main>
          <div className="layout-dashboard-header">
            <strong>今日概览</strong>
            <span>更新于 12:30</span>
          </div>
          {["收入", "转化", "留存"].map((label, index) => (
            <article key={label}><span>{label}</span><strong>{index === 0 ? "¥86k" : index === 1 ? "12.8%" : "74%"}</strong></article>
          ))}
          <section><b /><b /><b /><b /><span>近 7 日趋势</span></section>
        </main>
      </div>
    );
  }

  if (template === "gallery" || template === "masonry") {
    return (
      <div className={`layout-scene layout-card-scene ${template === "masonry" ? "masonry" : ""}`}>
        {["模板 A", "案例 B", "组件 C", "资源 D", "页面 E", "图标 F"].map((label, index) => (
          <article key={label} className={index % 3 === 1 ? "tall" : ""}>
            <i />
            <strong>{label}</strong>
            <span>查看详情</span>
          </article>
        ))}
      </div>
    );
  }

  if (template === "feed") {
    return (
      <div className="layout-scene layout-feed-scene">
        {["设计系统更新", "移动端体验", "组件规范"].map((title) => (
          <article key={title}><i /><div><strong>{title}</strong><span>作者 · 12 分钟前</span><p /></div></article>
        ))}
      </div>
    );
  }

  if (template === "app" || template === "master") {
    return (
      <div className="layout-scene layout-app-scene">
        <aside><strong>导航</strong><span>首页</span><span>组件</span><span>设置</span></aside>
        <main>
          {["按钮", "输入框", "弹窗"].map((item, index) => <button key={item} className={index === 0 ? "active" : ""}>{item}</button>)}
        </main>
        <section><strong>详情</strong><p>选中项的内容、状态和操作入口。</p><button>打开</button></section>
      </div>
    );
  }

  if (template === "settings") {
    return (
      <div className="layout-scene layout-settings-scene">
        <aside><strong>设置</strong><span>账号</span><span>通知</span><span>安全</span></aside>
        <main>
          {["邮件通知", "自动保存", "减少动效"].map((label, index) => (
            <label key={label}>{label}<i className={index === 1 ? "on" : ""} /></label>
          ))}
        </main>
      </div>
    );
  }

  if (template === "checkout") {
    return (
      <div className="layout-scene layout-checkout-scene">
        <main><strong>收货信息</strong><input placeholder="姓名" /><input placeholder="地址" /><button>继续</button></main>
        <aside><span>订单摘要</span><b>¥168</b><em>2 件商品</em></aside>
      </div>
    );
  }

  if (template === "three" || template === "split") {
    return (
      <div className="layout-scene layout-three-scene">
        <aside><strong>文件</strong><span>页面一</span><span>页面二</span></aside>
        <main><strong>编辑区</strong><p /><p /><button>保存</button></main>
        <section><strong>属性</strong><span>宽度 1200</span><span>颜色 #111</span></section>
      </div>
    );
  }

  if (template === "wizard") {
    return (
      <div className="layout-scene layout-wizard-scene">
        <div className="layout-steps"><b>1 资料</b><b>2 验证</b><b>3 完成</b></div>
        <main><strong>填写资料</strong><input placeholder="邮箱" /><input placeholder="公司" /><button>下一步</button></main>
      </div>
    );
  }

  if (template === "modal") {
    return (
      <div className="layout-scene layout-modal-scene">
        <div className="layout-page-dim"><span /><span /><span /></div>
        <main><strong>编辑资料</strong><input placeholder="标题" /><button>保存</button></main>
      </div>
    );
  }

  if (template === "landing") {
    return (
      <div className="layout-scene layout-landing-scene">
        <main><span>uiux.wiki</span><strong>看懂界面语言</strong><button>开始浏览</button></main>
        <aside><i /><i /><i /></aside>
      </div>
    );
  }

  if (template === "profile") {
    return (
      <div className="layout-scene layout-profile-scene">
        <aside><i /><strong>Alex Chen</strong><span>Product Designer</span></aside>
        <main><b>42 项作品</b><b>12k 关注</b><p /></main>
      </div>
    );
  }

  if (template === "searchResults") {
    return (
      <div className="layout-scene layout-search-scene">
        <header><Search size={16} /><span>搜索组件</span></header>
        <aside><b>筛选</b><label><input type="checkbox" defaultChecked /> 组件</label><label><input type="checkbox" /> 场景</label></aside>
        <main>{["按钮", "搜索框", "筛选面板"].map((item) => <article key={item}><strong>{item}</strong><span>匹配结果</span></article>)}</main>
      </div>
    );
  }

  if (template === "detail") {
    return (
      <div className="layout-scene layout-detail-scene">
        <aside><i /></aside>
        <main><strong>商品详情</strong><p>介绍、参数、评价与操作。</p><button>加入购物车</button></main>
      </div>
    );
  }

  return (
    <div className="layout-scene layout-article-scene">
      <article>
        <span>指南</span>
        <strong>单列阅读页面</strong>
        <p>标题、正文、插图和行动按钮按自然阅读顺序向下排列。</p>
        <button>继续阅读</button>
      </article>
    </div>
  );
}

function StyleLivePreview({ selected, variant = "" }) {
  const variantClass = getVariantPreviewClass(variant, getVariantIndex(selected, variant));

  return (
    <div className={`live-style-demo ${selected.preview} ${variantClass}`}>
      <article>
        <span>{selected.title}</span>
        <strong>{variant || selected.summary}</strong>
        <button type="button">查看效果</button>
      </article>
      <article>
        <span>对比</span>
        <strong>{variant || selected.variants[0] || "标准"}</strong>
        <button type="button">切换</button>
      </article>
    </div>
  );
}

function MotionLivePreview({ selected, variant = "" }) {
  return (
    <div className={`live-motion-demo ${selected.preview} ${getVariantPreviewClass(variant, getVariantIndex(selected, variant))}`}>
      <div className="motion-target"><Play size={24} fill="currentColor" /></div>
      <p>{variant || selected.plain}</p>
    </div>
  );
}

function PatternLivePreview({ selected, variant = "" }) {
  const config = {
    "login-pattern": {
      title: "登录账号",
      scene: "auth",
      fields: ["邮箱", "密码"],
      action: "登录",
      meta: "忘记密码?",
    },
    "search-pattern": {
      title: "搜索结果",
      scene: "search",
      fields: ["搜索 UI 关键词"],
      action: "搜索",
      chips: ["组件", "场景", "词典"],
    },
    "filter-pattern": {
      title: "筛选商品",
      scene: "filter",
      checks: ["可用", "促销", "高评分"],
      action: "应用筛选",
    },
    "upload-pattern": {
      title: "上传文件",
      scene: "upload",
      fields: ["拖拽或选择文件"],
      action: "上传",
      progress: true,
    },
    "checkout-pattern": {
      title: "确认订单",
      scene: "checkout",
      rows: ["UI 模板包 ¥129", "图标资源 ¥39"],
      action: "支付",
    },
    "delete-confirmation": {
      title: "删除文件?",
      scene: "delete",
      fields: ["此操作无法撤销"],
      action: "确认删除",
      danger: true,
    },
    "signup-pattern": {
      title: "创建账号",
      scene: "signup",
      fields: ["邮箱", "验证码", "密码"],
      action: "注册",
      steps: ["资料", "验证", "完成"],
    },
    "sort-pattern": {
      title: "排序方式",
      scene: "sort",
      chips: ["最新", "价格", "评分"],
      action: "应用排序",
    },
    "onboarding-pattern": {
      title: "新手引导",
      scene: "onboarding",
      steps: ["欢迎", "选择目标", "开始使用"],
      action: "下一步",
    },
    "settings-pattern": {
      title: "偏好设置",
      scene: "settings",
      checks: ["通知", "自动保存", "减少动效"],
      action: "保存设置",
    },
    "form-fill-pattern": {
      title: "填写资料",
      scene: "form",
      fields: ["姓名", "电话", "备注"],
      action: "提交",
    },
    "error-message-pattern": {
      title: "输入有误",
      scene: "error",
      fields: ["邮箱格式不正确"],
      action: "重新填写",
      danger: true,
    },
  };
  const data = config[selected.id] || { title: selected.title, fields: ["示例输入"], action: "继续" };

  return (
    <div className={`live-pattern-demo detailed-pattern ${selected.preview} ${getVariantPreviewClass(variant, getVariantIndex(selected, variant))}`}>
      <PatternScene data={data} selected={selected} />
    </div>
  );
}

function PatternScene({ data, selected }) {
  if (data.scene === "search" || data.scene === "sort") {
    return (
      <div className="pattern-panel pattern-search-scene">
        <header className="pattern-search-bar">
          <Search size={18} />
          <input aria-label="搜索关键词" readOnly value={data.scene === "sort" ? "组件资源" : "UI 关键词"} />
          <button type="button">{data.action}</button>
        </header>
        <div className="pattern-chips">{(data.chips || ["最新", "价格", "评分"]).map((chip, index) => <b key={chip} className={`pattern-chip ${index === 0 ? "active" : ""}`}>{chip}</b>)}</div>
        <main>{["按钮 Button", "搜索框 Search", "筛选 Filter"].map((row, index) => <article key={row}><strong>{row}</strong><span>{selected.summary}</span><em>{index === 0 ? "高度匹配" : "相关结果"}</em></article>)}</main>
      </div>
    );
  }

  if (data.scene === "filter") {
    return (
      <div className="pattern-panel pattern-filter-scene">
        <aside>
          <strong>筛选</strong>
          {data.checks.map((check, index) => <label key={check}><input type="checkbox" defaultChecked={index === 0} /> {check}</label>)}
          <button>{data.action}</button>
        </aside>
        <main>{["模板", "图标", "页面"].map((item) => <article key={item}><i /><strong>{item}</strong><span>¥{item === "模板" ? "129" : "39"}</span></article>)}</main>
      </div>
    );
  }

  if (data.scene === "upload") {
    return (
      <div className="pattern-panel pattern-upload-scene">
        <div className="upload-drop"><ArrowUp size={24} /><strong>拖拽文件到这里</strong><span>PNG, PDF, ZIP</span></div>
        <article><span>design-system.zip</span><b>62%</b></article>
        <div className="live-progress-bar"><i /></div>
        <button>{data.action}</button>
      </div>
    );
  }

  if (data.scene === "checkout") {
    return (
      <div className="pattern-panel pattern-checkout-scene">
        <main>{data.rows.map((row) => <span key={row}>{row}</span>)}<strong>合计 ¥168</strong></main>
        <aside><b>支付方式</b><label><input type="radio" defaultChecked /> 微信支付</label><label><input type="radio" /> 银行卡</label><button>{data.action}</button></aside>
      </div>
    );
  }

  if (data.scene === "delete" || data.scene === "error") {
    return (
      <div className={`pattern-panel pattern-danger-scene ${data.scene}`}>
        <div className="pattern-file-list"><span>报告.pdf</span><span>草稿.doc</span><span>截图.png</span></div>
        <section>
          <strong>{data.title}</strong>
          <p>{data.fields[0]}</p>
          <div><button>取消</button><button className="danger">{data.action}</button></div>
        </section>
      </div>
    );
  }

  if (data.scene === "onboarding") {
    return (
      <div className="pattern-panel pattern-onboarding-scene">
        <div className="pattern-steps">{data.steps.map((step, index) => <b key={step} className={index === 0 ? "active" : ""}>{step}</b>)}</div>
        <main><strong>先选择你的目标</strong><p>快速理解组件、布局和场景。</p><button>{data.action}</button></main>
      </div>
    );
  }

  if (data.scene === "settings") {
    return (
      <div className="pattern-panel pattern-settings-scene">
        <strong>{data.title}</strong>
        {data.checks.map((check, index) => <label key={check}>{check}<i className={index === 1 ? "on" : ""} /></label>)}
        <button>{data.action}</button>
      </div>
    );
  }

  const formFields = data.fields || ["邮箱", "密码"];

  return (
    <div className={`pattern-panel pattern-form-scene ${data.scene}`}>
      {data.steps && <div className="pattern-steps">{data.steps.map((step, index) => <b key={step} className={index === 0 ? "active" : ""}>{step}</b>)}</div>}
      <header><strong>{data.title}</strong><span>{selected.summary}</span></header>
      {formFields.map((field) => <input key={field} placeholder={field} type={field.includes("密码") ? "password" : "text"} />)}
      {data.meta && <small>{data.meta}</small>}
      <button>{data.action}</button>
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

function VariantOverview({ selected, value, onChange }) {
  const variants = getVariantOptions(selected);
  const activeValue = variants.includes(value) ? value : variants[0];

  return (
    <div className="generic-controls">
      {variants.map((variant) => (
        <button
          key={variant}
          type="button"
          className={variant === activeValue ? "active" : ""}
          aria-pressed={variant === activeValue}
          onClick={() => onChange(variant)}
        >
          {variant}
        </button>
      ))}
    </div>
  );
}

function PreviewContext({ selected }) {
  const rows = [
    ["常见状态", selected.states],
    ["常见用途", selected.useCases],
    ["相关条目", selected.related.map((id) => findItem(id).title)],
  ].filter(([, values]) => values.length > 0);

  if (rows.length === 0) return null;

  return (
    <div className="preview-context">
      {rows.slice(0, 3).map(([label, values]) => (
        <div key={label}>
          <span>{label}</span>
          <p>{values.slice(0, 4).join(" / ")}</p>
        </div>
      ))}
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
  const scene = type.replace("pattern-", "");
  const isFormScene = ["login", "signup", "form", "error"].includes(scene);
  const isSearchScene = ["search", "sort"].includes(scene);

  function renderScene() {
    if (isFormScene) {
      return (
        <span className={`pattern-mini-card pattern-mini-form ${scene === "error" ? "danger" : ""}`}>
          <span className="pattern-mini-title">{scene === "login" ? "账号登录" : scene === "signup" ? "创建账号" : scene === "error" ? "表单错误" : "资料填写"}</span>
          <span className="pattern-mini-input" />
          <span className="pattern-mini-input short" />
          <span className="pattern-mini-action" />
        </span>
      );
    }

    if (isSearchScene) {
      return (
        <span className="pattern-mini-card pattern-mini-search">
          <span className="pattern-mini-query"><Search size={13} /><span>搜索 UI</span></span>
          <span className="pattern-mini-tabs"><span /><span /><span /></span>
          <span className="pattern-mini-results"><span /><span /><span /></span>
        </span>
      );
    }

    if (scene === "filter") {
      return (
        <span className="pattern-mini-card pattern-mini-filter">
          <span className="pattern-mini-side"><span /><span /><span /></span>
          <span className="pattern-mini-products"><span /><span /><span /><span /></span>
        </span>
      );
    }

    if (scene === "upload") {
      return (
        <span className="pattern-mini-card pattern-mini-upload">
          <span className="pattern-mini-drop"><ArrowUp size={14} /><span>上传</span></span>
          <span className="pattern-mini-progress"><span /></span>
        </span>
      );
    }

    if (scene === "checkout") {
      return (
        <span className="pattern-mini-card pattern-mini-checkout">
          <span className="pattern-mini-order"><span /><span /><strong>¥168</strong></span>
          <span className="pattern-mini-pay"><span /><span className="pattern-mini-button">支付</span></span>
        </span>
      );
    }

    if (scene === "delete") {
      return (
        <span className="pattern-mini-card pattern-mini-danger">
          <span className="pattern-mini-files"><span /><span /><span /></span>
          <span className="pattern-mini-dialog"><strong>删除?</strong><span /><span className="pattern-mini-button">确认</span></span>
        </span>
      );
    }

    if (scene === "onboarding") {
      return (
        <span className="pattern-mini-card pattern-mini-onboarding">
          <span className="pattern-mini-steps"><span /><span /><span /></span>
          <span className="pattern-mini-welcome"><strong>欢迎</strong><span /><span className="pattern-mini-button">下一步</span></span>
        </span>
      );
    }

    if (scene === "settings") {
      return (
        <span className="pattern-mini-card pattern-mini-settings">
          <span className="pattern-mini-setting"><span>通知</span><i /></span>
          <span className="pattern-mini-setting"><span>保存</span><i /></span>
          <span className="pattern-mini-setting"><span>动效</span><i /></span>
        </span>
      );
    }

    return (
      <span className="pattern-mini-card pattern-mini-default">
        <span className="pattern-mini-title">场景</span>
        <span className="pattern-mini-input" />
        <span className="pattern-mini-action" />
      </span>
    );
  }

  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`pattern-preview ${type}`}>
        {renderScene()}
      </span>
    </span>
  );
}
