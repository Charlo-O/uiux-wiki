/* Modal system: export dialog with preview and settings, and the set
   generator that produces N consistent variations of the current design. */

var Modals = (function () {

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  var root = null;

  function open(title, subtitle) {
    close();
    root = el("div", "modal-backdrop", document.body);
    var card = el("div", "modal-card", root);
    var head = el("div", "modal-head", card);
    var tWrap = el("div", null, head);
    var t = el("div", "modal-title", tWrap);
    t.textContent = title;
    if (subtitle) {
      var s = el("div", "modal-sub mono", tWrap);
      s.textContent = subtitle;
    }
    var x = el("button", "modal-close", head);
    x.innerHTML = '<svg viewBox="0 0 12 12"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>';
    x.addEventListener("click", close);
    root.addEventListener("click", function (e) { if (e.target === root) close(); });
    var body = el("div", "modal-body", card);
    return body;
  }

  function close() {
    if (root) { root.remove(); root = null; }
  }

  function snapshotInto(canvas2d, aspect) {
    var src = Engine.canvas();
    var ctx = canvas2d.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
    ctx.drawImage(src, 0, 0, canvas2d.width, canvas2d.height);
  }

  /* ---------- export dialog ---------- */

  function selectField(parent, label, options, value, onChange) {
    var row = el("div", "field-row", parent);
    var lab = el("span", "ctl-label", row);
    lab.textContent = label;
    var sel = el("select", null, row);
    options.forEach(function (o) {
      var op = el("option", null, sel);
      op.value = o[0]; op.textContent = o[1];
    });
    sel.value = value;
    sel.addEventListener("change", function () { onChange(sel.value); });
    return sel;
  }

  function toggleField(parent, label, value, onChange) {
    var row = el("div", "toggle-row", parent);
    var lab = el("span", "ctl-label", row);
    lab.textContent = label;
    var tg = el("button", "toggle" + (value ? " on" : ""), row);
    tg.addEventListener("click", function () {
      var on = !tg.classList.contains("on");
      tg.classList.toggle("on", on);
      onChange(on);
    });
  }

  function openExport(kind) {
    var titles = { png: "导出图片", video: "导出视频", gif: "导出 GIF" };
    var body = open(titles[kind], MODES[P.mode].full + " \u00b7 种子 " + Math.round(P.seed));

    /* live preview */
    var prevWrap = el("div", "modal-preview", body);
    var pv = el("canvas", null, prevWrap);
    var ar = ASPECTS[P.aspect];
    pv.width = 480; pv.height = Math.round(480 / ar);
    snapshotInto(pv, ar);
    var pvTimer = setInterval(function () {
      if (!document.body.contains(pv)) { clearInterval(pvTimer); return; }
      snapshotInto(pv, ar);
    }, 120);
    var pvMeta = el("div", "modal-preview-meta mono", prevWrap);

    var form = el("div", "modal-form", body);

    function metaText() {
      if (kind === "png") {
        var h = parseInt(P.imgRes, 10);
        return Math.round(h * ar) + " \u00d7 " + h + " px";
      }
      if (kind === "video") {
        var vh = parseInt(P.vidRes, 10);
        var fps = parseInt(P.vidFps, 10);
        var sec = (String(P.vidLen).charAt(0) === "s")
          ? parseInt(String(P.vidLen).slice(1), 10)
          : P.loop * parseInt(String(P.vidLen).slice(1), 10);
        return Math.round(vh * ar) + " \u00d7 " + vh + " \u00b7 " + fps + " fps \u00b7 " +
          sec.toFixed(1) + " 秒 \u00b7 " + Math.round(sec * fps) + " 帧";
      }
      var gw = parseInt(P.gifW, 10);
      return gw + " \u00d7 " + Math.round(gw / ar) + " \u00b7 " + P.gifFps + " fps \u00b7 " +
        Math.round(P.loop * P.gifFps) + " 帧 \u00b7 " + P.loop.toFixed(1) + " 秒循环";
    }
    function refreshMeta() { pvMeta.textContent = metaText(); }
    refreshMeta();

    if (kind === "png") {
      selectField(form, "分辨率", [["1080", "1920 \u00d7 1080"], ["1440", "2560 \u00d7 1440"], ["2160", "3840 \u00d7 2160"]],
        P.imgRes, function (v) { P.imgRes = v; refreshMeta(); });
    } else if (kind === "video") {
      selectField(form, "分辨率", [["720", "720p"], ["1080", "1080p"], ["1440", "1440p"]],
        P.vidRes, function (v) { P.vidRes = v; refreshMeta(); });
      selectField(form, "帧率", [["24", "24 fps"], ["30", "30 fps"], ["60", "60 fps"]],
        P.vidFps, function (v) { P.vidFps = v; refreshMeta(); });
      selectField(form, "时长", [
        ["l1", "1 次循环"], ["l2", "2 次循环"], ["l3", "3 次循环"], ["l4", "4 次循环"], ["l6", "6 次循环"], ["l8", "8 次循环"],
        ["s5", "5 秒"], ["s10", "10 秒"], ["s15", "15 秒"], ["s30", "30 秒"], ["s60", "60 秒"]
      ], P.vidLen, function (v) { P.vidLen = v; refreshMeta(); });
    } else {
      selectField(form, "宽度", [["360", "360 px"], ["480", "480 px"], ["640", "640 px"], ["800", "800 px"]],
        P.gifW, function (v) { P.gifW = v; refreshMeta(); });
      selectField(form, "帧率", [["15", "15 fps"], ["20", "20 fps"], ["25", "25 fps"], ["30", "30 fps"]],
        String(P.gifFps), function (v) { P.gifFps = parseInt(v, 10); refreshMeta(); });
      toggleField(form, "抖动", P.gifDither, function (v) { P.gifDither = v; });
      toggleField(form, "永久循环", P.gifLoop, function (v) { P.gifLoop = v; });
    }

    var actions = el("div", "modal-actions", body);
    var dl = el("button", "btn btn-primary modal-dl", actions);
    dl.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 13.5 H13" stroke="currentColor" stroke-width="1.6"/></svg>下载 ' +
      (kind === "png" ? "PNG" : kind === "video" ? "WebM" : "GIF");
    dl.addEventListener("click", function () {
      close();
      var a = ASPECTS[P.aspect];
      if (kind === "png") Exporter.exportPNG(P, a);
      else if (kind === "video") Exporter.exportVideo(P, a);
      else Exporter.exportGIF(P, a);
    });
  }

  /* ---------- set generator ---------- */

  function setSeeds(base, n) {
    var seeds = [];
    for (var i = 0; i < n; i++) seeds.push((base + 73 + i * 911) % 10000);
    return seeds;
  }

  async function openSetGenerator() {
    var body = open("渐变套图", "基于当前设计的一组一致变体");
    var info = el("div", "modal-note", body);
    info.textContent = "保持相同样式、配色和参数，只更换种子。适合生成一组同源视觉，用在首屏、卡片或分区背景里。";

    var form = el("div", "modal-form", body);
    var state = { count: 6, res: "1080" };
    selectField(form, "变体数量", [["4", "4"], ["6", "6"], ["8", "8"], ["12", "12"]],
      "6", function (v) { state.count = parseInt(v, 10); build(); });
    selectField(form, "PNG 尺寸", [["720", "1280 \u00d7 720"], ["1080", "1920 \u00d7 1080"], ["2160", "3840 \u00d7 2160"]],
      "1080", function (v) { state.res = v; });

    var grid = el("div", "set-grid", body);
    var actions = el("div", "modal-actions", body);
    var dl = el("button", "btn btn-primary modal-dl", actions);
    dl.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 2 V10 M4.5 7 L8 10.5 L11.5 7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 13.5 H13" stroke="currentColor" stroke-width="1.6"/></svg>下载 ZIP 套图';

    var seeds = [];

    async function build() {
      grid.innerHTML = "";
      seeds = setSeeds(Math.round(P.seed), state.count);
      var ar = ASPECTS[P.aspect];

      var origSeed = P.seed;
      var prev = Engine.size();
      var wasPlaying = Engine.isPlaying();
      Engine.suspend();
      Engine.setPlaying(false);
      Engine.setSize(320, 2 * Math.round(320 / ar / 2));

      for (var i = 0; i < seeds.length; i++) {
        P.seed = seeds[i];
        Engine.renderAt(0.3);
        var tile = el("button", "set-tile", grid);
        var c = el("canvas", null, tile);
        c.width = 320; c.height = Math.round(320 / ar);
        c.getContext("2d").drawImage(Engine.canvas(), 0, 0, c.width, c.height);
        var lab = el("span", "set-tile-label mono", tile);
        lab.textContent = "#" + String(seeds[i]).padStart(4, "0");
        (function (sd) {
          tile.addEventListener("click", function () {
            P.seed = sd;
            refreshAll();
            UI.toast("已应用种子 " + sd);
            close();
          });
        })(seeds[i]);
        await new Promise(function (r) { setTimeout(r, 0); });
      }

      P.seed = origSeed;
      Engine.setSize(prev[0], prev[1]);
      Engine.setPlaying(wasPlaying);
      Engine.resume();
    }

    dl.addEventListener("click", async function () {
      dl.disabled = true;
      dl.textContent = "渲染中…";
      var ar = ASPECTS[P.aspect];
      var h = parseInt(state.res, 10);
      var w = 2 * Math.round(h * ar / 2);

      var origSeed = P.seed;
      var prev = Engine.size();
      var wasPlaying = Engine.isPlaying();
      Engine.suspend();
      Engine.setPlaying(false);
      Engine.setSize(w, h);

      var entries = [];
      for (var i = 0; i < seeds.length; i++) {
        P.seed = seeds[i];
        Engine.renderAt(0.3);
        var blob = await new Promise(function (res) { Engine.canvas().toBlob(res, "image/png"); });
        if (blob) {
          entries.push({
            name: "lumen-set-" + String(i + 1).padStart(2, "0") + "-seed" + String(seeds[i]).padStart(4, "0") + ".png",
            data: new Uint8Array(await blob.arrayBuffer())
          });
        }
        dl.textContent = "渲染 " + (i + 1) + "/" + seeds.length + "…";
        await new Promise(function (r) { setTimeout(r, 0); });
      }

      P.seed = origSeed;
      Engine.setSize(prev[0], prev[1]);
      Engine.setPlaying(wasPlaying);
      Engine.resume();

      var zip = ZipWriter.build(entries);
      var a = document.createElement("a");
      a.href = URL.createObjectURL(zip);
      a.download = "lumen-set-" + MODES[P.mode].key + ".zip";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      close();
      FX.celebrate("套图已保存：" + entries.length + " 张 PNG (" + w + "\u00d7" + h + ")");
    });

    await build();
  }

  return { openExport: openExport, openSetGenerator: openSetGenerator, close: close };
})();
