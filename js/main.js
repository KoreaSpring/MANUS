/* 《MANUS 异界：智能觉醒》主逻辑：视频播放、限时出招、等级/生命/技能卡、图鉴与存档 */
(function () {
  "use strict";

  const S = window.STORY;
  const SAVE_KEY = "manusworld.save.v1";
  const FALLBACK_SECONDS = 9;
  const XP_PER_LEVEL = 200;

  const $ = (id) => document.getElementById(id);
  const el = {
    title: $("screen-title"), player: $("screen-player"),
    video: $("video"), still: $("still"), chapter: $("chapter-label"),
    lv: $("lv"), hpBar: $("hp-bar"), hpText: $("hp-text"), xpBar: $("xp-bar"), skillCount: $("skill-count"),
    enemy: $("enemy"), enemyName: $("enemy-name"), enemyHp: $("enemy-hp-bar"),
    cast: $("cast"), castTag: $("cast-tag"), castName: $("cast-name"),
    subtitle: $("subtitle"), progress: $("progress-bar"), paused: $("paused"), toasts: $("toasts"), hit: $("hit"),
    choice: $("choice"), choicePrompt: $("choice-prompt"), choiceOptions: $("choice-options"), timerBar: $("timer-bar"), timerHint: $("timer-hint"),
    ending: $("ending"), endingName: $("ending-name"), endingText: $("ending-text"), endingStats: $("ending-stats"),
    btnContinue: $("btn-continue"), codexCount: $("codex-count"), endingCount: $("ending-count"), btnMute: $("btn-mute"),
    pChapters: $("panel-chapters"), pCodex: $("panel-codex"), pEndings: $("panel-endings"), pViewer: $("panel-viewer"),
    chapterList: $("chapter-list"), codex: $("codex"), endings: $("endings"),
    viewerVideo: $("viewer-video"), viewerTag: $("viewer-tag"), viewerName: $("viewer-name"), viewerDesc: $("viewer-desc")
  };

  /* 所有技能卡（每个 Manus 功能一张） */
  const SKILLS = Object.entries(S.nodes).filter(([, n]) => n.skill).map(([id, n]) => Object.assign({ id }, n.skill));
  const skillById = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

  /* ---------------- 存档 ---------------- */
  const blank = () => ({ current: null, run: null, visited: [], codex: [], endings: [], chapterStarts: {}, muted: false });
  let save = load();
  function load() {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) { return blank(); }
  }
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* 忽略 */ } }

  const newRun = () => ({ hp: S.maxHp, xp: 0, skills: [], timeouts: 0 });
  let run = newRun();
  const text = (v) => (typeof v === "function" ? v(run) : v);
  const level = () => 1 + Math.floor(run.xp / XP_PER_LEVEL);

  /* ---------------- HUD ---------------- */
  function renderHud() {
    el.lv.textContent = level();
    el.hpBar.style.width = Math.max(0, run.hp) / S.maxHp * 100 + "%";
    el.hpText.textContent = Math.max(0, run.hp);
    el.hpBar.parentElement.classList.toggle("low", run.hp < 50);
    el.xpBar.style.width = (run.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100 + "%";
    el.skillCount.textContent = run.skills.length;
  }

  function toast(html, cls) {
    const t = document.createElement("div");
    t.className = "toast " + (cls || "");
    t.innerHTML = html;
    el.toasts.appendChild(t);
    setTimeout(() => t.remove(), 3700);
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- 播放时钟 ---------------- */
  const clock = { mode: "video", t: 0, dur: FALLBACK_SECONDS, playing: false, last: 0, done: false };
  let nodeId = null, lines = [], lineIndex = -1;

  function playNode(id) {
    const node = S.nodes[id];
    if (!node) return;
    nodeId = id;
    save.current = id;
    save.run = run;
    if (!save.visited.includes(id)) save.visited.push(id);
    if (!save.chapterStarts[node.chapter]) save.chapterStarts[node.chapter] = { id, run: JSON.parse(JSON.stringify(run)) };
    persist();

    hideChoice();
    el.ending.hidden = true;
    el.paused.hidden = true;
    el.cast.hidden = true;
    el.player.classList.remove("choosing", "danger");
    el.chapter.textContent = S.chapters[node.chapter] || "";
    renderHud();

    // 遭遇战：显示敌人；技能：显示技能发动
    if (node.type === "encounter") {
      el.enemy.hidden = false;
      el.enemyName.textContent = node.enemy.name;
      el.enemyHp.style.width = "100%";
      el.player.classList.add("danger");
    } else if (node.type === "skill") {
      el.enemy.hidden = !lastEnemy;
      if (lastEnemy) el.enemyName.textContent = lastEnemy;
      el.castTag.textContent = "SKILL · " + node.skill.tag;
      el.castName.textContent = node.skill.name;
      el.cast.hidden = false;
      el.cast.style.animation = "none"; void el.cast.offsetWidth; el.cast.style.animation = "";
    } else {
      el.enemy.hidden = true;
    }
    if (node.type === "encounter") lastEnemy = node.enemy.name;
    else if (node.type !== "skill") lastEnemy = null;

    lines = node.lines.map(text);
    lineIndex = -1;
    setSubtitle("");
    Object.assign(clock, { t: 0, done: false, dur: FALLBACK_SECONDS, playing: false });

    const v = el.video;
    v.muted = save.muted;
    v.style.opacity = 1;
    el.still.classList.remove("show");
    clock.mode = "video";
    v.src = "media/" + id + ".mp4";
    v.load();
    const p = v.play();
    if (p && p.catch) p.catch((err) => {
      if (err && err.name === "NotAllowedError") { v.muted = true; v.play().catch(useStill); }
    });
  }
  let lastEnemy = null;

  function useStill() {
    if (clock.mode === "still" || !nodeId) return;
    clock.mode = "still";
    clock.dur = FALLBACK_SECONDS;
    clock.playing = true;
    clock.last = performance.now();
    el.video.style.opacity = 0;
    el.still.style.backgroundImage = "url('media/" + nodeId + ".jpg'), url('media/poster.jpg')";
    el.still.classList.add("show");
  }
  el.video.addEventListener("error", useStill);
  el.video.addEventListener("loadedmetadata", () => { if (isFinite(el.video.duration)) clock.dur = el.video.duration; });
  el.video.addEventListener("ended", finishNode);

  function tick(now) {
    if (nodeId && !clock.done) {
      if (clock.mode === "video") clock.t = el.video.currentTime || 0;
      else if (clock.playing) { clock.t += (now - clock.last) / 1000; if (clock.t >= clock.dur) finishNode(); }
      clock.last = now;
      updateProgress();
    }
    tickChoice(now);
    requestAnimationFrame(tick);
  }

  function updateProgress() {
    const ratio = Math.min(1, clock.t / Math.max(clock.dur, 0.1));
    el.progress.style.width = (ratio * 100).toFixed(2) + "%";
    const node = S.nodes[nodeId];
    if (node.type === "skill") el.enemyHp.style.width = Math.max(0, 100 - ratio * 110) + "%";
    if (!lines.length) return;
    const idx = Math.min(lines.length - 1, Math.floor((ratio / 0.92) * lines.length));
    if (idx !== lineIndex) { lineIndex = idx; setSubtitle(lines[idx]); }
  }

  let subTimer = null;
  function setSubtitle(str) {
    el.subtitle.classList.remove("show");
    clearTimeout(subTimer);
    subTimer = setTimeout(() => { el.subtitle.textContent = str; if (str) el.subtitle.classList.add("show"); }, 240);
  }

  function finishNode() {
    if (clock.done) return;
    clock.done = true;
    el.progress.style.width = "100%";
    const node = S.nodes[nodeId];
    if (node.skill) gainSkill(nodeId, node);
    if (node.type === "encounter") showChoice(node.choice);
    else if (node.type === "ending") showEnding(node.ending);
    else if (node.next) setTimeout(() => playNode(node.next), node.type === "skill" ? 900 : 400);
  }

  function gainSkill(id, node) {
    const before = level();
    if (!run.skills.includes(id)) run.skills.push(id);
    run.xp += node.xp || 100;
    const isNew = !save.codex.includes(id);
    if (isNew) save.codex.push(id);
    persist();
    renderHud();
    toast("获得技能卡 <b>" + esc(node.skill.name) + "</b>" + (isNew ? "（图鉴新增）" : "") + "<small>" + esc(node.skill.desc) + "</small>", "card");
    if (node.xp) toast("经验 +" + node.xp);
    if (level() > before) {
      run.hp = Math.min(S.maxHp, run.hp + 15);
      renderHud();
      toast("升级！<b>Lv." + level() + "</b> 生命恢复 +15", "lvup");
    }
  }

  function togglePause() {
    if (!nodeId || clock.done || el.player.classList.contains("choosing")) return;
    if (clock.mode === "video") {
      if (el.video.paused) { el.video.play().catch(() => {}); el.paused.hidden = true; }
      else { el.video.pause(); el.paused.hidden = false; }
    } else {
      clock.playing = !clock.playing; clock.last = performance.now(); el.paused.hidden = clock.playing;
    }
  }
  function skip() {
    if (!nodeId || clock.done) return;
    if (clock.mode === "video") el.video.pause();
    setSubtitle(lines[lines.length - 1] || "");
    finishNode();
  }

  /* ---------------- 限时出招 ---------------- */
  const cs = { active: false, start: 0, duration: 10, options: [], locked: false, urgent: false };

  function showChoice(choice) {
    el.player.classList.add("choosing");
    setSubtitle("");
    el.choicePrompt.textContent = text(choice.prompt);
    el.choiceOptions.innerHTML = "";
    choice.options.forEach((opt, i) => {
      const b = document.createElement("button");
      const locked = opt.requireHp && run.hp < opt.requireHp;
      const isNew = !save.codex.includes(opt.next) && skillById[opt.next];
      b.className = "option";
      b.disabled = !!locked;
      b.innerHTML = '<span class="key">按 ' + (i + 1) + '</span>' + (isNew ? '<span class="new">NEW</span>' : "") +
        '<span class="label"></span><span class="sub"></span>';
      b.querySelector(".label").textContent = opt.label;
      b.querySelector(".sub").textContent = locked ? "生命值不足 " + opt.requireHp + "，无法选择（当前 " + run.hp + "）" : opt.sub;
      b.addEventListener("click", () => pick(i));
      el.choiceOptions.appendChild(b);
    });
    Object.assign(cs, { active: true, start: performance.now(), duration: choice.timeout || 10, options: choice.options, locked: false, urgent: false });
    el.choice.classList.remove("urgent");
    el.timerHint.textContent = "犹豫太久会被击中，生命值 -" + S.timeoutDamage;
    el.choice.hidden = false;
    const first = el.choiceOptions.querySelector(".option:not(:disabled)");
    if (first) first.focus({ preventScroll: true });
  }

  function tickChoice(now) {
    if (!cs.active || cs.locked) return;
    const left = 1 - (now - cs.start) / 1000 / cs.duration;
    el.timerBar.style.transform = "scaleX(" + Math.max(0, left) + ")";
    if (left < 0.35 && !cs.urgent) { cs.urgent = true; el.choice.classList.add("urgent"); }
    if (left <= 0) timeoutHit();
  }

  function timeoutHit() {
    run.hp = Math.max(0, run.hp - S.timeoutDamage);
    run.timeouts++;
    renderHud();
    el.hit.classList.remove("on"); void el.hit.offsetWidth; el.hit.classList.add("on");
    toast("你犹豫了——被击中！生命 -" + S.timeoutDamage, "dmg");
    if (run.hp <= 0) {
      run.hp = 30; renderHud();
      toast("小 M 用最后的光救了你，生命恢复到 30", "lvup");
    }
    const idx = cs.options.findIndex((o) => !(o.requireHp && run.hp < o.requireHp));
    el.choicePrompt.textContent = "来不及了！小 M 替你出了招——";
    pick(Math.max(0, idx), true);
  }

  function pick(i, auto) {
    if (!cs.active || cs.locked) return;
    const opt = cs.options[i];
    if (!opt) return;
    if (opt.requireHp && run.hp < opt.requireHp) return;
    cs.locked = true;
    [...el.choiceOptions.children].forEach((b, j) => b.classList.add(j === i ? "picked" : "dim"));
    setTimeout(() => { cs.active = false; playNode(opt.next); }, auto ? 1300 : 800);
  }
  function hideChoice() { el.choice.hidden = true; cs.active = false; }

  /* ---------------- 结局 ---------------- */
  function showEnding(ending) {
    if (!save.endings.includes(ending.id)) save.endings.push(ending.id);
    save.current = null; save.run = null;
    persist();
    el.enemy.hidden = true;
    el.player.classList.remove("danger");
    el.endingName.textContent = ending.name;
    el.endingText.textContent = text(ending.text);
    el.endingStats.innerHTML =
      "<div><b>Lv." + level() + "</b>最终等级</div>" +
      "<div><b>" + run.skills.length + "</b>本局技能</div>" +
      "<div><b>" + run.hp + "</b>剩余生命</div>" +
      "<div><b>" + save.codex.length + "/" + SKILLS.length + "</b>图鉴收集</div>";
    el.ending.hidden = false;
    refreshMenu();
  }

  /* ---------------- 屏幕与菜单 ---------------- */
  function showScreen(name) {
    el.title.classList.toggle("active", name === "title");
    el.player.classList.toggle("active", name === "player");
    particles.dim = name === "player";
    if (name === "title") { el.video.pause(); nodeId = null; refreshMenu(); }
  }
  function startNew() { run = newRun(); lastEnemy = null; closePanels(); showScreen("player"); playNode(S.start); }
  function continueRun() {
    if (!save.current || !save.run) return startNew();
    run = Object.assign(newRun(), save.run);
    showScreen("player");
    playNode(save.current);
  }
  function refreshMenu() {
    el.btnContinue.hidden = !save.current || save.current === S.start;
    el.codexCount.textContent = save.codex.length + "/" + SKILLS.length;
    el.endingCount.textContent = save.endings.length + "/" + S.endings.length;
    el.btnMute.textContent = save.muted ? "声音 关" : "声音 开";
  }

  function renderChapters() {
    el.chapterList.innerHTML = "";
    Object.entries(S.chapters).filter(([k]) => k !== "end").forEach(([key, name]) => {
      const entry = save.chapterStarts[key];
      const b = document.createElement("button");
      b.className = "chapter-item";
      b.disabled = !entry;
      b.innerHTML = "<span></span><small></small>";
      b.querySelector("span").textContent = name;
      b.querySelector("small").textContent = entry ? "从本章开头重新挑战" : "尚未到达";
      if (entry) b.addEventListener("click", () => {
        run = Object.assign(newRun(), entry.run); lastEnemy = null;
        closePanels(); showScreen("player"); playNode(entry.id);
      });
      el.chapterList.appendChild(b);
    });
  }

  function renderCodex() {
    el.codex.innerHTML = "";
    const groups = {};
    SKILLS.forEach((s) => { (groups[s.tag] = groups[s.tag] || []).push(s); });
    Object.entries(groups).forEach(([tag, list]) => {
      const g = document.createElement("div");
      g.className = "codex-group";
      g.innerHTML = "<h4>" + esc(tag) + "</h4><div class='codex-grid'></div>";
      const grid = g.querySelector(".codex-grid");
      list.forEach((s) => {
        const on = save.codex.includes(s.id);
        const c = document.createElement("button");
        c.className = "card " + (on ? "on" : "off");
        c.innerHTML = (on ? "<span class='play'>▶ 重看</span>" : "") + "<h5></h5><p></p>";
        c.querySelector("h5").textContent = on ? s.name : "？？？";
        c.querySelector("p").textContent = on ? s.desc : "在冒险中使用这项能力后解锁";
        if (on) c.addEventListener("click", () => openViewer(s));
        grid.appendChild(c);
      });
      el.codex.appendChild(g);
    });
  }

  function openViewer(s) {
    el.viewerTag.textContent = "SKILL · " + s.tag;
    el.viewerName.textContent = s.name;
    el.viewerDesc.textContent = s.desc;
    el.viewerVideo.src = "media/" + s.id + ".mp4";
    el.viewerVideo.muted = save.muted;
    el.pViewer.hidden = false;
    el.viewerVideo.play().catch(() => {});
  }

  function renderEndings() {
    el.endings.innerHTML = "";
    S.endings.forEach((e) => {
      const on = save.endings.includes(e.id);
      const c = document.createElement("div");
      c.className = "ending-card " + (on ? "on" : "off");
      c.innerHTML = "<i class='mark'></i><div><h4></h4><p></p></div>";
      c.querySelector("h4").textContent = on ? e.name : "未解锁结局";
      c.querySelector("p").textContent = on ? "已达成" : "提示：" + e.hint;
      el.endings.appendChild(c);
    });
  }

  function openPanel(p) {
    if (p === el.pChapters) renderChapters();
    if (p === el.pCodex) renderCodex();
    if (p === el.pEndings) renderEndings();
    p.hidden = false;
    if (nodeId && clock.mode === "video" && !el.video.paused) { el.video.pause(); p.dataset.resume = "1"; }
  }
  function closePanels() {
    el.viewerVideo.pause();
    [el.pChapters, el.pCodex, el.pEndings, el.pViewer].forEach((p) => {
      if (p.hidden) return;
      p.hidden = true;
      if (p.dataset.resume) { delete p.dataset.resume; el.video.play().catch(() => {}); }
    });
  }

  /* ---------------- 事件 ---------------- */
  $("btn-start").addEventListener("click", startNew);
  el.btnContinue.addEventListener("click", continueRun);
  $("btn-chapters").addEventListener("click", () => openPanel(el.pChapters));
  $("btn-codex").addEventListener("click", () => openPanel(el.pCodex));
  $("btn-endings").addEventListener("click", () => openPanel(el.pEndings));
  $("btn-ending-codex").addEventListener("click", () => openPanel(el.pCodex));
  $("btn-replay").addEventListener("click", startNew);
  $("btn-menu").addEventListener("click", () => showScreen("title"));
  $("btn-skip").addEventListener("click", skip);
  el.btnMute.addEventListener("click", () => { save.muted = !save.muted; el.video.muted = save.muted; persist(); refreshMenu(); });
  $("btn-reset").addEventListener("click", () => {
    if (!confirm("确定清除所有存档、图鉴和结局记录吗？")) return;
    save = blank(); persist(); refreshMenu(); renderEndings();
  });
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", (e) => {
    const panel = e.target.closest(".panel");
    if (panel === el.pViewer) { el.viewerVideo.pause(); el.pViewer.hidden = true; } else closePanels();
  }));
  [el.pChapters, el.pCodex, el.pEndings].forEach((p) => p.addEventListener("click", (e) => { if (e.target === p) closePanels(); }));
  el.video.addEventListener("click", togglePause);
  el.still.addEventListener("click", togglePause);
  el.paused.addEventListener("click", togglePause);

  document.addEventListener("keydown", (e) => {
    const anyPanel = [el.pChapters, el.pCodex, el.pEndings, el.pViewer].some((p) => !p.hidden);
    if (anyPanel) { if (e.key === "Escape") { if (!el.pViewer.hidden) { el.viewerVideo.pause(); el.pViewer.hidden = true; } else closePanels(); } return; }
    if (!el.player.classList.contains("active")) return;
    if (cs.active && /^[1-4]$/.test(e.key)) { pick(Number(e.key) - 1); return; }
    if (e.code === "Space" && !cs.active) { e.preventDefault(); togglePause(); }
    if (e.key === "ArrowRight") skip();
    if (e.key === "Escape") showScreen("title");
  });

  /* ---------------- 光粒子背景 ---------------- */
  const particles = (function () {
    const c = $("particles"), ctx = c.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = { dim: false };
    let w = 0, h = 0, dots = [];
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
      dots = Array.from({ length: reduce ? 10 : 40 }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.4 + 0.5) * dpr,
        vx: (Math.random() - 0.5) * 0.3 * dpr, vy: -(Math.random() * 0.3 + 0.05) * dpr,
        ph: Math.random() * 6.28, red: i % 7 === 0
      }));
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      const k = api.dim ? 0.2 : 1;
      dots.forEach((d) => {
        if (!reduce) { d.x += d.vx; d.y += d.vy; if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; } }
        const a = (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t / 800 + d.ph))) * k;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 6);
        g.addColorStop(0, d.red ? "rgba(255,60,70," + a + ")" : "rgba(255,255,255," + a + ")");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 6, 0, 6.283); ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    addEventListener("resize", resize);
    resize(); requestAnimationFrame(frame);
    return api;
  })();

  refreshMenu();
  requestAnimationFrame(tick);
})();
