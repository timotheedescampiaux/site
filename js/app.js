(() => {
  "use strict";

  const COURSE = window.COURSE, ACTU = window.ACTU, CLASSMATES = window.CLASSMATES;
  const $app = document.getElementById("app");
  const KEY = "neo-state-v1";

  // ---------- Utilitaires ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => dateStr(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dateStr(d); };
  const weekKey = () => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return dateStr(d); };

  // ---------- État ----------
  const DEFAULT = {
    onboarded: false, name: "", promo: "", goal: 30,
    xp: 0, streak: 0, lastDay: null,
    day: { date: null, xp: 0 }, week: { key: null, xp: 0 },
    done: {}, actuDone: {}, perfects: 0, bestCombo: 0, badges: [],
  };
  let S = load();
  let tab = "path";

  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw)); } catch (e) { /* stockage indisponible */ }
    return JSON.parse(JSON.stringify(DEFAULT));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  const streakNow = () => (S.lastDay === today() || S.lastDay === yesterday()) ? S.streak : 0;
  const dayXp = () => (S.day.date === today() ? S.day.xp : 0);
  const weekXp = () => (S.week.key === weekKey() ? S.week.xp : 0);

  const allLessons = () => COURSE.units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })));
  const currentLessonId = () => { const l = allLessons().find((l) => !S.done[l.id]); return l ? l.id : null; };
  const isUnlocked = (id) => { const list = allLessons(); const i = list.findIndex((l) => l.id === id); return i === 0 || !!S.done[list[i - 1].id] || !!S.done[id]; };

  // ---------- Badges ----------
  const BADGES = [
    { id: "first", ico: "🐣", name: "Premier pas", test: () => Object.keys(S.done).length >= 1 },
    { id: "perfect", ico: "🎯", name: "Sans faute", test: () => S.perfects >= 1 },
    { id: "combo5", ico: "⚡", name: "Combo x5", test: () => S.bestCombo >= 5 },
    { id: "curious", ico: "📰", name: "Curieux", test: () => Object.keys(S.actuDone).length >= 1 },
    { id: "unit1", ico: "🧠", name: "Initié", test: () => COURSE.units[0].lessons.every((l) => S.done[l.id]) },
    { id: "streak3", ico: "🔥", name: "En feu (3 j)", test: () => streakNow() >= 3 },
    { id: "xp100", ico: "💯", name: "100 XP", test: () => S.xp >= 100 },
    { id: "promptpro", ico: "✍️", name: "Pro du prompt", test: () => COURSE.units[1].lessons.every((l) => S.done[l.id]) },
    { id: "grad", ico: "🎓", name: "Diplômé des bases", test: () => allLessons().every((l) => S.done[l.id]) },
  ];
  function checkBadges() {
    const fresh = BADGES.filter((b) => !S.badges.includes(b.id) && b.test());
    fresh.forEach((b) => S.badges.push(b.id));
    return fresh;
  }

  // ---------- Mascotte ----------
  function mascot(mood = "happy", cls = "") {
    const eyes = mood === "sad"
      ? `<path d="M38 52 q6 -5 12 0" stroke="#1E1A33" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M62 52 q6 -5 12 0" stroke="#1E1A33" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : mood === "wink"
      ? `<circle cx="44" cy="52" r="8" fill="#fff"/><circle cx="46" cy="53" r="4.5" fill="#1E1A33"/><path d="M62 53 q6 -6 12 0" stroke="#1E1A33" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : `<circle cx="44" cy="52" r="9" fill="#fff"/><circle cx="68" cy="52" r="9" fill="#fff"/><circle cx="46" cy="53" r="5" fill="#1E1A33"/><circle cx="70" cy="53" r="5" fill="#1E1A33"/><circle cx="48" cy="51" r="1.6" fill="#fff"/><circle cx="72" cy="51" r="1.6" fill="#fff"/>`;
    const mouth = mood === "sad"
      ? `<path d="M48 76 q8 -7 16 0" stroke="#1E1A33" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : mood === "wow"
      ? `<ellipse cx="56" cy="74" rx="7" ry="8" fill="#1E1A33"/>`
      : `<path d="M44 70 q12 13 24 0" stroke="#1E1A33" stroke-width="4" fill="#FF8FA3" stroke-linecap="round"/>`;
    return `<svg class="${cls}" viewBox="0 0 112 112" aria-hidden="true">
      <line x1="56" y1="22" x2="56" y2="8" stroke="#6C4CF1" stroke-width="4" stroke-linecap="round"/>
      <circle cx="56" cy="7" r="6" fill="#FFB020"/>
      <line x1="34" y1="30" x2="24" y2="18" stroke="#6C4CF1" stroke-width="4" stroke-linecap="round"/>
      <circle cx="22" cy="16" r="4.5" fill="#12B886"/>
      <line x1="78" y1="30" x2="88" y2="18" stroke="#6C4CF1" stroke-width="4" stroke-linecap="round"/>
      <circle cx="90" cy="16" r="4.5" fill="#F25C54"/>
      <ellipse cx="56" cy="64" rx="44" ry="42" fill="#6C4CF1"/>
      <ellipse cx="56" cy="70" rx="34" ry="30" fill="#8C72FF"/>
      <circle cx="30" cy="68" r="5" fill="#FF8FA3" opacity=".6"/><circle cx="82" cy="68" r="5" fill="#FF8FA3" opacity=".6"/>
      ${eyes}${mouth}
    </svg>`;
  }

  // ---------- Rendu principal ----------
  function render() {
    if (!S.onboarded) return renderOnboarding(0);
    $app.innerHTML = `
      <header class="topbar">
        <div class="brand">${mascot("happy")}<span>Néo</span></div>
        <div class="stats">
          <div class="stat streak" title="Série de jours">🔥 ${streakNow()}</div>
          <div class="stat xp" title="XP total">⚡ ${S.xp}</div>
        </div>
      </header>
      <main class="main">${tab === "path" ? viewPath() : tab === "actu" ? viewActu() : tab === "league" ? viewLeague() : viewProfile()}</main>
      <nav class="tabbar">
        ${[["path", "🗺️", "Parcours"], ["actu", "📰", "Actu"], ["league", "🏆", "Ligue"], ["profile", "😎", "Profil"]]
          .map(([id, ico, lab]) => `<button class="tab ${tab === id ? "active" : ""}" data-tab="${id}"><span class="ico">${ico}</span>${lab}</button>`).join("")}
      </nav>`;
    $app.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo(0, 0); });
    $app.querySelectorAll("[data-lesson]").forEach((b) => b.onclick = () => {
      const l = allLessons().find((x) => x.id === b.dataset.lesson);
      if (l && isUnlocked(l.id)) startSession(l.steps, { kind: "lesson", id: l.id, title: l.title });
    });
    $app.querySelectorAll("[data-actu]").forEach((b) => b.onclick = () => {
      const a = ACTU.find((x) => x.id === b.dataset.actu);
      startSession(a.steps, { kind: "actu", id: a.id, title: a.title });
    });
    const reset = $app.querySelector("#reset");
    if (reset) reset.onclick = () => { if (confirm("Effacer ta progression de démo ?")) { S = JSON.parse(JSON.stringify(DEFAULT)); save(); tab = "path"; render(); } };
  }

  function goalCard() {
    const d = dayXp(), pct = Math.min(100, Math.round((d / S.goal) * 100));
    const msg = d >= S.goal ? "Objectif du jour atteint ! 🎉" : `${d} / ${S.goal} XP aujourd'hui`;
    return `<div class="goal">${mascot(d >= S.goal ? "wink" : "happy", "mini-mascot")}
      <div class="goal-text"><div class="goal-title">Salut ${esc(S.name || "toi")} !</div><div class="goal-val">${msg}</div><div class="bar"><span style="width:${pct}%"></span></div></div></div>`;
  }

  function viewPath() {
    const cur = currentLessonId();
    const offsets = [0, 46, 70, 46, 0, -46, -70, -46];
    let n = 0;
    const units = COURSE.units.map((u, ui) => {
      if (u.soon) return `<section class="unit soon"><div class="unit-head"><div class="u-label">Unité ${ui + 1} · bientôt</div><div class="u-title">🔒 ${esc(u.title)}</div><div class="u-sub">${esc(u.subtitle)}</div></div></section>`;
      const nodes = u.lessons.map((l) => {
        const done = !!S.done[l.id], unlocked = isUnlocked(l.id), isCur = l.id === cur;
        const cls = done ? "done" : isCur ? "current" : unlocked ? "current" : "locked";
        const stars = done ? "⭐".repeat(S.done[l.id]) : "";
        const off = offsets[n++ % offsets.length];
        return `<div class="node-wrap" style="transform:translateX(${off}px)">
          ${isCur ? `<div class="bubble">${Object.keys(S.done).length ? "Continuer" : "Commencer"}</div>` : ""}
          <button class="node ${cls}" data-lesson="${l.id}" ${unlocked ? "" : "disabled"} aria-label="${esc(l.title)}">${done ? "✓" : l.icon}</button>
          <div class="node-label">${esc(l.title)}</div>${stars ? `<div class="node-stars">${stars}</div>` : ""}
        </div>`;
      }).join("");
      return `<section class="unit"><div class="unit-head c-${u.color}"><div class="u-label">Unité ${ui + 1}</div><div class="u-title">${esc(u.title)}</div><div class="u-sub">${esc(u.subtitle)}</div></div><div class="path">${nodes}</div></section>`;
    }).join("");
    return goalCard() + units + `<p class="disclaimer">Prototype · Projet indépendant, non affilié aux éditeurs d'IA cités.</p>`;
  }

  function viewActu() {
    const [first, ...rest] = ACTU;
    const card = (a, hero) => `<button class="card actu-card ${hero ? "hero-actu" : ""}" data-actu="${a.id}">
      <div class="emoji">${a.steps[0].emoji}</div>
      <div><span class="tag ${S.actuDone[a.id] ? "done" : ""}">${S.actuDone[a.id] ? "✓ Fait" : esc(a.tag)}</span>
      <div class="a-title">${esc(a.title)}</div><div class="a-sum">${esc(a.week)} · ${esc(a.summary)}</div></div></button>`;
    return `<h1 class="h1">Défi actu 📰</h1><p class="sub">L'IA bouge vite. Chaque semaine, une nouveauté expliquée en 2 minutes. +15 XP bonus !</p>
      ${card(first, true)}<h2 class="h1" style="font-size:18px;margin-top:22px">Semaines précédentes</h2>${rest.map((a) => card(a, false)).join("")}`;
  }

  function viewLeague() {
    const me = { name: S.name || "Toi", avatar: "⭐", xp: weekXp(), me: true };
    const rows = [...CLASSMATES, me].sort((a, b) => b.xp - a.xp);
    const myRank = rows.findIndex((r) => r.me) + 1;
    const list = rows.map((r, i) => `${i === 3 ? `<div class="zone">▲ Zone de promotion ▲</div>` : ""}
      <div class="rank-row ${r.me ? "me" : ""} ${i < 3 ? "top" : ""}"><div class="rank-n">${i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}</div><div class="rank-av">${r.avatar}</div><div class="rank-name">${esc(r.name)}${r.me ? " (toi)" : ""}</div><div class="rank-xp">${r.xp} XP</div></div>`).join("");
    return `<div class="league-head"><div class="trophy">🏆</div><h1 class="h1">Ligue Bronze</h1><p class="sub">${esc(S.promo || "Ma promo")} · Tu es <b class="pill">${myRank}<sup>e</sup></b> cette semaine. Le top 3 monte en ligue Argent !</p></div>
      <div class="card">${list}</div><p class="disclaimer">Démo : les camarades sont fictifs. Dans la vraie version, tu affronteras ta promo… et les autres écoles.</p>`;
  }

  function viewProfile() {
    const badges = BADGES.map((b) => `<div class="badge ${S.badges.includes(b.id) ? "" : "off"}"><div class="b-ico">${b.ico}</div><div class="b-name">${esc(b.name)}</div></div>`).join("");
    return `<div class="profile-head">${mascot("wink")}<div><h1 class="h1">${esc(S.name || "Toi")}</h1><div class="sub" style="margin:0">${esc(S.promo || "Ma promo")}</div></div></div>
      <div class="grid2">
        <div class="kpi"><div class="k-ico">⚡</div><div><div class="k-val">${S.xp}</div><div class="k-lab">XP total</div></div></div>
        <div class="kpi"><div class="k-ico">🔥</div><div><div class="k-val">${streakNow()}</div><div class="k-lab">Jours de série</div></div></div>
        <div class="kpi"><div class="k-ico">📚</div><div><div class="k-val">${Object.keys(S.done).length}/${allLessons().length}</div><div class="k-lab">Leçons</div></div></div>
        <div class="kpi"><div class="k-ico">💥</div><div><div class="k-val">x${S.bestCombo}</div><div class="k-lab">Meilleur combo</div></div></div>
      </div>
      <h2 class="h1" style="font-size:18px">Badges</h2><div class="badges">${badges}</div>
      <button class="btn ghost" id="reset" style="margin-top:24px">Réinitialiser la démo</button>`;
  }

  // ---------- Onboarding ----------
  function renderOnboarding(step) {
    const screens = [
      () => `<div class="onb-center">${mascot("happy")}<h1>Salut, moi c'est Néo !</h1><p>Je vais t'apprendre l'IA en <b class="pill">5 minutes par jour</b>, en jouant. Gratuit, pour toujours.</p></div>
        <button class="btn" data-next>C'est parti</button>`,
      () => `<div class="onb-center">${mascot("wink")}<h1>Comment tu t'appelles ?</h1><input class="field" id="f-name" maxlength="20" placeholder="Ton prénom" value="${esc(S.name)}" autocomplete="given-name"></div>
        <button class="btn" data-next>Continuer</button>`,
      () => `<div class="onb-center">${mascot("wow")}<h1>Ta promo ou ton école ?</h1><p>Pour t'affronter avec tes camarades dans la ligue 🏆</p><input class="field" id="f-promo" maxlength="30" placeholder="Ex. : Promo 2027 – École X" value="${esc(S.promo)}"></div>
        <button class="btn" data-next>Continuer</button>`,
      () => `<div class="onb-center" style="justify-content:flex-start;padding-top:20px">${mascot("happy")}<h1>Ton objectif quotidien ?</h1>
        <div class="options" style="width:100%">${[[20, "😌 Tranquille", "~3 min/jour"], [30, "🙂 Régulier", "~5 min/jour"], [50, "🔥 Intense", "~10 min/jour"]]
          .map(([v, l, d]) => `<button class="opt ${S.goal === v ? "sel" : ""}" data-goal="${v}">${l} <span style="float:right;color:var(--muted)">${d} · ${v} XP</span></button>`).join("")}</div></div>
        <button class="btn" data-next>Je commence !</button>`,
    ];
    $app.innerHTML = `<div class="onb">${screens[step]()}</div>`;
    const name = $app.querySelector("#f-name"), promo = $app.querySelector("#f-promo");
    if (name) name.focus();
    $app.querySelectorAll("[data-goal]").forEach((b) => b.onclick = () => { S.goal = +b.dataset.goal; renderOnboarding(step); });
    $app.querySelector("[data-next]").onclick = () => {
      if (name) S.name = name.value.trim();
      if (promo) S.promo = promo.value.trim();
      if (step < screens.length - 1) return renderOnboarding(step + 1);
      S.onboarded = true; save(); render();
    };
  }

  // ---------- Moteur de leçon ----------
  function startSession(steps, meta) {
    const queue = steps.map((s, i) => ({ ...s, _i: i, _retry: false }));
    const st = { queue, pos: 0, total: steps.length, completed: 0, combo: 0, maxCombo: 0, firstTry: 0, questions: steps.filter((s) => s.type !== "learn").length, mistakes: 0, missed: new Set() };
    const root = document.createElement("div");
    root.className = "lesson";
    document.body.appendChild(root);
    document.body.style.overflow = "hidden";

    const close = () => { root.remove(); document.body.style.overflow = ""; render(); };

    function header() {
      const pct = Math.round((st.completed / st.total) * 100);
      return `<div class="l-top"><button class="l-close" aria-label="Quitter">✕</button><div class="l-bar"><span style="width:${pct}%"></span></div><div class="combo">${st.combo >= 2 ? `⚡x${st.combo}` : ""}</div></div>`;
    }

    function showStep() {
      if (st.pos >= st.queue.length) return finish();
      const s = st.queue[st.pos];
      let body = "", ready = s.type === "learn", answer = null, checkFn = null;

      if (s.type === "learn") {
        body = `<div class="q-kind">Nouvelle notion</div><div class="learn-emoji">${s.emoji}</div><h2 class="q-title" style="text-align:center">${esc(s.title)}</h2><div class="learn-card">${s.text}</div>`;
      } else if (s.type === "qcm" || s.type === "prompt" || s.type === "spot") {
        const opts = shuffle(s.options.map((t, i) => ({ t, ok: i === s.answer })));
        s._opts = opts;
        const kind = { qcm: "Quiz", prompt: "Choisis le meilleur prompt", spot: "Repère l'erreur de l'IA" }[s.type];
        const chat = s.chat ? `<div class="chat">${s.chat.map((m) => `<div class="msg ${m.role}"><span class="who">${m.role === "user" ? "Toi" : "IA"}</span>${esc(m.text)}</div>`).join("")}</div>` : "";
        body = `<div class="q-kind">${kind}</div>${s._retry ? `<div class="speech">${mascot("wink")}<div class="say">On réessaie celle-là !</div></div>` : ""}<h2 class="q-title">${esc(s.q)}</h2>${chat}
          <div class="options">${opts.map((o, i) => `<button class="opt ${s.type === "prompt" ? "prompt" : ""}" data-opt="${i}">${esc(o.t)}</button>`).join("")}</div>`;
        checkFn = () => opts[answer].ok;
      } else if (s.type === "tf") {
        body = `<div class="q-kind">Vrai ou faux ?</div>${s._retry ? `<div class="speech">${mascot("wink")}<div class="say">On réessaie celle-là !</div></div>` : ""}<div class="statement">${esc(s.statement)}</div>
          <div class="tf-row"><button class="opt" data-opt="1">👍 Vrai</button><button class="opt" data-opt="0">👎 Faux</button></div>`;
        checkFn = () => (answer === 1) === s.answer;
      } else if (s.type === "order") {
        s._pool = shuffle(s.items.map((t, i) => ({ t, i })));
        s._picked = [];
        body = `<div class="q-kind">Remets dans l'ordre</div><h2 class="q-title">${esc(s.q)}</h2><div class="order-zone" id="zone"></div><div class="pool" id="pool"></div>`;
        checkFn = () => s._picked.every((p, k) => p === k);
      }

      root.innerHTML = `${header()}<div class="l-body">${body}</div><div class="l-foot"><button class="btn ${ready ? "" : ""}" id="go" ${ready ? "" : "disabled"}>${s.type === "learn" ? "Continuer" : "Vérifier"}</button></div>`;
      root.querySelector(".l-close").onclick = () => { if (confirm("Quitter la leçon ? Ta progression sur cette leçon sera perdue.")) close(); };
      const go = root.querySelector("#go");

      root.querySelectorAll("[data-opt]").forEach((b) => b.onclick = () => {
        root.querySelectorAll("[data-opt]").forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel"); answer = +b.dataset.opt; go.disabled = false;
      });

      if (s.type === "order") {
        const zone = root.querySelector("#zone"), pool = root.querySelector("#pool");
        const draw = () => {
          zone.innerHTML = s._picked.map((idx, k) => `<button class="chip" data-unpick="${k}"><span class="num">${k + 1}</span>${esc(s.items[idx])}</button>`).join("");
          pool.innerHTML = s._pool.map((p) => `<button class="chip ${s._picked.includes(p.i) ? "used" : ""}" data-pick="${p.i}">${esc(p.t)}</button>`).join("");
          zone.querySelectorAll("[data-unpick]").forEach((b) => b.onclick = () => { s._picked.splice(+b.dataset.unpick, 1); draw(); });
          pool.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => { s._picked.push(+b.dataset.pick); draw(); });
          go.disabled = s._picked.length !== s.items.length;
        };
        draw();
      }

      go.onclick = () => {
        if (s.type === "learn") { st.completed++; st.pos++; return showStep(); }
        const ok = checkFn();
        feedback(s, ok, answer);
      };
    }

    function feedback(s, ok, answer) {
      root.querySelectorAll("[data-opt], [data-pick], [data-unpick]").forEach((b) => b.disabled = true);
      if (s._opts) {
        root.querySelectorAll("[data-opt]").forEach((b) => {
          const o = s._opts[+b.dataset.opt];
          if (o.ok) b.classList.add("right"); else if (+b.dataset.opt === answer) b.classList.add("wrong");
        });
      } else if (s.type === "tf") {
        root.querySelectorAll("[data-opt]").forEach((b) => {
          const v = b.dataset.opt === "1";
          if (v === s.answer) b.classList.add("right"); else if (+b.dataset.opt === answer) b.classList.add("wrong");
        });
      }
      if (ok) {
        st.completed++; st.combo++; st.maxCombo = Math.max(st.maxCombo, st.combo);
        if (!s._retry) st.firstTry++;
      } else {
        st.combo = 0; st.mistakes++; st.missed.add(s._i);
        st.queue.push({ ...s, _retry: true });
        root.querySelector(".l-body").classList.add("shake");
      }
      let extra = "";
      if (!ok && s.type === "order") extra = `<br><b>Bon ordre :</b> ${s.items.map((t, i) => `${i + 1}. ${esc(t)}`).join(" → ")}`;
      const foot = root.querySelector(".l-foot");
      foot.className = `l-foot ${ok ? "ok" : "ko"}`;
      foot.innerHTML = `<div class="fb-title">${ok ? "✅ " + pick(["Bravo !", "Parfait !", "Excellent !", "Tu gères !", "Exactement !"]) : "❌ Pas tout à fait…"}</div>
        <div class="fb-text">${esc(s.explain || "")}${extra}${!ok ? "<br><i>Pas de stress, on la revoit à la fin.</i>" : ""}</div>
        <button class="btn ${ok ? "mint" : "coral"}" id="next">Continuer</button>`;
      root.querySelector(".combo").textContent = st.combo >= 2 ? `⚡x${st.combo}` : "";
      root.querySelector(".l-bar span").style.width = Math.round((st.completed / st.total) * 100) + "%";
      root.querySelector("#next").onclick = () => { st.pos++; showStep(); };
    }

    function finish() {
      const perfect = st.mistakes === 0 && st.questions > 0;
      const base = meta.kind === "actu" ? 15 : 10;
      const gained = base + st.firstTry * 2 + (perfect ? 5 : 0);
      const accuracy = st.questions ? Math.round((st.firstTry / st.questions) * 100) : 100;
      const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

      // Série de jours
      const t = today();
      const prevStreak = streakNow();
      if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; }
      const streakUp = S.streak > prevStreak;

      S.xp += gained;
      if (S.day.date !== t) S.day = { date: t, xp: 0 };
      const goalBefore = S.day.xp >= S.goal;
      S.day.xp += gained;
      const goalReached = !goalBefore && S.day.xp >= S.goal;
      if (S.week.key !== weekKey()) S.week = { key: weekKey(), xp: 0 };
      S.week.xp += gained;
      if (perfect) S.perfects++;
      S.bestCombo = Math.max(S.bestCombo, st.maxCombo);
      if (meta.kind === "lesson") S.done[meta.id] = Math.max(S.done[meta.id] || 0, stars);
      else S.actuDone[meta.id] = true;
      const fresh = checkBadges();
      save();

      root.innerHTML = `<div class="end">${mascot(perfect ? "wow" : "happy", "big")}
        <h2>${perfect ? "Sans faute !" : meta.kind === "actu" ? "Te voilà à jour !" : "Leçon terminée !"}</h2>
        <div class="sub" style="margin:0">${esc(meta.title)}</div>
        <div class="end-kpis">
          <div class="end-kpi"><div class="lab">XP gagnés</div><div class="val">⚡ ${gained}</div></div>
          <div class="end-kpi m"><div class="lab">Précision</div><div class="val">🎯 ${accuracy}%</div></div>
          <div class="end-kpi c"><div class="lab">Série</div><div class="val">🔥 ${S.streak}</div></div>
        </div>
        ${streakUp ? `<div class="new-badge">🔥 Série prolongée : <b>${S.streak} jour${S.streak > 1 ? "s" : ""}</b> ! Reviens demain pour la garder.</div>` : ""}
        ${goalReached ? `<div class="new-badge">🎉 Objectif du jour atteint !</div>` : ""}
        ${fresh.map((b) => `<div class="new-badge">${b.ico} Nouveau badge : <b>${esc(b.name)}</b></div>`).join("")}
      </div><div class="l-foot"><button class="btn mint" id="done">Continuer</button></div>`;
      confetti();
      root.querySelector("#done").onclick = close;
    }

    showStep();
  }

  function confetti() {
    const c = document.createElement("div");
    c.className = "confetti";
    const colors = ["#6C4CF1", "#12B886", "#F25C54", "#FFB020", "#8C72FF"];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = pick(colors);
      p.style.animationDelay = Math.random() * 0.5 + "s";
      p.style.animationDuration = 1.4 + Math.random() * 1.2 + "s";
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }

  render();
})();
