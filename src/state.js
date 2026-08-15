// App state + business logic (scoring, picks, packs, i18n selection, persistence).
// Ported from the original design prototype's Component logic 1:1 in behavior,
// adapted from a class-based renderer to a React hook.

// Real-app equivalents of what were design-tool prototype knobs.
const SCORING_PRESET = 'Winner plus detail';
const SHOW_GROUP_SPLIT = false; // no real group-consensus data yet — was fake demo flavor

// Scores raw Supabase picks/results (used by the shared leaderboard, which
// works off rows directly rather than the app's internal Pick/Bout shape).
function scoreRow(pick, result) {
  if (!pick || !pick.winner || !result || pick.winner !== result.winner) return 0;
  let pts = 50;
  if (pick.method && pick.method !== 'Skip' && pick.method === result.method) pts += 30;
  if (pick.round && pick.round === result.round) pts += 40;
  if (pick.bonus && pick.bonus !== 'Skip' && pick.bonus === result.bonus) pts += 25;
  return pts;
}

async function computeLeaderboard() {
  const { settledBouts, players, picks } = await window.CageClashSupabase.fetchLeaderboardInputs();
  const resultsById = {};
  settledBouts.forEach(b => { resultsById[b.id] = { winner: b.result_winner, method: b.result_method, round: b.result_round, bonus: b.result_bonus }; });
  const totals = {};
  picks.forEach(p => { totals[p.player_id] = (totals[p.player_id] || 0) + scoreRow(p, resultsById[p.bout_id]); });
  return players.map(pl => ({ id: pl.id, name: pl.name, pts: totals[pl.id] || 0 })).sort((a, b) => b.pts - a.pts);
}

function initialAppState() {
  return {
    route: 'welcome', name: '', draftName: '', picks: {},
    locked: false, settled: false, fightId: null, secs: 0,
    points: 0, copied: false, booted: false, lang: 'en',
    packs: 2, reveal: null, rosterDiv: 'all', ownedOnly: false,
    owned: {}, tz: 'local', recapId: undefined,
    rankOverrides: {}, playerId: null, packsAwardedForEventId: null,
    liveEventId: null, liveEventName: '', liveEventVenue: '', liveEventStartsAtMs: null,
    leaderboard: [], dataVersion: 0
  };
}

function useAppState() {
  const [state, setState] = React.useState(initialAppState);
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const saveState = React.useCallback(s => {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        route: s.route, name: s.name, picks: s.picks,
        points: s.points, tz: s.tz || 'local', lang: s.lang || 'en',
        packs: s.packs, owned: s.owned, rosterDiv: s.rosterDiv, ownedOnly: s.ownedOnly,
        rankOverrides: s.rankOverrides || {}, packsAwardedForEventId: s.packsAwardedForEventId || null,
        playerId: s.playerId || null
      }));
    } catch (e) {}
  }, []);

  const patch = React.useCallback((partial, opts) => {
    const prev = stateRef.current;
    const p = typeof partial === 'function' ? partial(prev) : partial;
    const next = { ...prev, ...p };
    stateRef.current = next;
    setState(next);
    if (opts && opts.save) saveState(next);
    return next;
  }, [saveState]);

  const go = React.useCallback((route, extra) => {
    patch({ route, ...(extra || {}) }, { save: true });
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [patch]);

  const refreshLiveData = React.useCallback(async () => {
    try {
      const live = await window.CageClashSupabase.fetchLiveEvent();
      if (!live) return;
      applyLiveEvent(live.event, live.bouts);
      const startMs = live.event.starts_at ? Date.parse(live.event.starts_at) : null;
      if (startMs) {
        CARD_TIMES.early = live.event.starts_at;
        CARD_TIMES.prelims = new Date(startMs + 2 * 3600e3).toISOString();
        CARD_TIMES.main = new Date(startMs + 4 * 3600e3).toISOString();
      }
      let picksPatch = {};
      const pid = stateRef.current.playerId;
      if (pid && stateRef.current.name) {
        const rows = await window.CageClashSupabase.fetchMyPicks(pid, BOUTS.map(b => b.id));
        const picks = {};
        rows.forEach(r => { picks[r.bout_id] = { winner: r.winner, method: r.method, round: r.round, bonus: r.bonus }; });
        picksPatch = { picks };
      }
      const leaderboard = await computeLeaderboard();
      patch(s => {
        const justSettled = live.event.settled && s.liveEventId === live.event.id && s.packsAwardedForEventId !== live.event.id;
        const hits = BOUTS.filter(b => scoreBout(b.id, (s.picks || {})[b.id]).hit).length;
        const packsGain = justSettled ? (tierFor(hits, BOUTS.length) ? 2 : 1) : 0;
        return Object.assign({}, picksPatch, {
          liveEventId: live.event.id, liveEventName: live.event.name, liveEventVenue: live.event.venue,
          liveEventStartsAtMs: startMs, locked: live.event.locked, settled: live.event.settled,
          fightId: s.fightId || (BOUTS[0] && BOUTS[0].id),
          packs: (s.packs || 0) + packsGain,
          packsAwardedForEventId: justSettled ? live.event.id : s.packsAwardedForEventId,
          leaderboard, dataVersion: (s.dataVersion || 0) + 1
        });
      }, { save: true });
    } catch (e) { /* offline or Supabase unreachable — keep last known state */ }
  }, [patch]);

  React.useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    let p = { booted: true, lang: (saved && saved.lang) || 'en', playerId: window.CageClashSupabase.getPlayerId() };
    if (saved && saved.name) p = { ...p, ...saved };
    patch(p);

    refreshLiveData();
    const dataTimer = setInterval(refreshLiveData, 12000);
    const timer = setInterval(() => {
      patch(s => ({
        secs: (s.liveEventStartsAtMs && !s.locked) ? Math.max(0, Math.floor((s.liveEventStartsAtMs - Date.now()) / 1000)) : s.secs
      }));
    }, 1000);
    return () => { clearInterval(timer); clearInterval(dataTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function detailedMode() { return SCORING_PRESET !== 'Winner only'; }

  function boutMax(p) {
    if (!p || !p.winner) return 0;
    let n = 50;
    if (!detailedMode()) return n;
    if (p.method && p.method !== 'Skip') n += 30;
    if (p.round) n += 40;
    if (p.bonus && p.bonus !== 'Skip') n += 25;
    return n;
  }

  function scoreBout(id, p) {
    const r = RESULTS[id];
    if (!r || !p || !p.winner) return { pts: 0, hit: false };
    if (p.winner !== r.winner) return { pts: 0, hit: false };
    let n = 50;
    if (detailedMode()) {
      if (p.method && p.method !== 'Skip' && p.method === r.method) n += 30;
      if (p.round && p.round === r.round) n += 40;
      if (p.bonus && p.bonus !== 'Skip' && p.bonus === r.bonus) n += 25;
    }
    return { pts: n, hit: true };
  }

  function pickLabel(id, p) {
    if (!p || !p.winner) return T('no_pick');
    const b = BOUTS.find(x => x.id === id);
    const who = p.winner === 'a' ? b.a : b.b;
    const surname = who.split(' ').slice(-1)[0];
    const bits = [surname];
    if (detailedMode()) {
      if (p.method && p.method !== 'Skip') bits.push(TQ('mshort', p.method, p.method === 'KO / TKO' ? 'KO' : p.method === 'Submission' ? 'SUB' : 'DEC'));
      if (p.round) bits.push(T('r_abbr') + p.round);
    }
    return bits.join(' · ');
  }

  function setPick(id, p) {
    if (stateRef.current.locked) return;
    const merged = Object.assign({ winner: null, method: null, round: null, bonus: null }, stateRef.current.picks[id], p);
    patch(s => {
      const picks = { ...s.picks };
      picks[id] = merged;
      return { picks };
    }, { save: true });
    const pid = stateRef.current.playerId;
    if (pid) {
      window.CageClashSupabase.upsertPick(pid, id, { winner: merged.winner, method: merged.method, round: merged.round, bonus: merged.bonus }).catch(() => {});
    }
  }

  function intel(name) {
    const p = POOL_BY_NAME[name];
    const overrides = stateRef.current.rankOverrides;
    const rarity = p ? effRarity(p.id, overrides) : 'common';
    const d = INTEL_BY_NAME[name] || { l5: 'WWLWL', ko: 33, sub: 33, dec: 34 };
    const form = d.l5.split('').map(k => ({
      k: k === 'W' ? T('form_w') : k === 'L' ? T('form_l') : '–',
      bg: k === 'W' ? 'rgba(95,201,138,.18)' : k === 'L' ? 'rgba(194,96,74,.2)' : '#2c2c2e',
      ink: k === 'W' ? '#5fc98a' : k === 'L' ? '#e08163' : 'rgba(235,235,245,.4)'
    }));
    const wins = d.l5.split('').filter(k => k === 'W').length;
    return {
      short: name.split(' ').slice(-1)[0], mono: monogram(name), art: artFor(name, rarity),
      rec: T('record_word') + ' ' + (CARD_REC[name] || '—'), form: form,
      formNote: F('form_note', { w: wins, l: 5 - wins }),
      koPct: d.ko + '%', subPct: d.sub + '%', decPct: d.dec + '%'
    };
  }

  function computeVals(st) {
    LI = LANGS.indexOf(st.lang) >= 0 ? st.lang : 'en';
    const name = st.name || 'Alex M';
    const detailed = detailedMode();
    const picks = st.picks || {};
    const pickedIds = BOUTS.filter(b => picks[b.id] && picks[b.id].winner).map(b => b.id);
    const openBoutsRaw = BOUTS.filter(b => !(picks[b.id] && picks[b.id].winner));
    const maxHaul = BOUTS.reduce((n, b) => n + boutMax(picks[b.id]), 0);
    const mm = Math.floor(st.secs / 3600), ss = Math.floor((st.secs % 3600) / 60), s3 = st.secs % 60;
    const pad = n => String(n).padStart(2, '0');
    const settledTotal = BOUTS.reduce((n, b) => n + scoreBout(b.id, picks[b.id]).pts, 0);
    const settledHits = BOUTS.filter(b => scoreBout(b.id, picks[b.id]).hit).length;

    const fightIdx = Math.max(0, BOUTS.findIndex(b => b.id === st.fightId));
    const fight = BOUTS[fightIdx];
    const fp = picks[fight.id] || {};

    const rows = (bs, extra) => bs.map(b => Object.assign({
      id: b.id, a: b.a, b: b.b,
      meta: TQ('slot', b.slot, b.slot) + ' · ' + TQ('div', b.div, b.div) + ' · ' + b.rounds + ' ' + T('rds'),
      slot: TQ('slot', b.slot, b.slot), fight: b.a.split(' ').slice(-1)[0] + ' / ' + b.b.split(' ').slice(-1)[0],
      pickLabel: pickLabel(b.id, picks[b.id]),
      state: st.locked ? T('locked_in') : T('your_pick'),
      open: () => go('fight', { fightId: b.id })
    }, extra || {}));

    const liveTier = tierFor(settledHits, BOUTS.length);
    const weeklyBonus = st.settled && liveTier ? TIER_PTS[liveTier] : 0;
    const liveEventShortName = (st.liveEventName || 'Live card').split('·')[0].trim();
    const collectRows = COLLECT.map(c => ({ id: c.id, glyph: c.glyph, name: c.name, when: c.when, hits: c.hits, of: c.of, tier: tierFor(c.hits, c.of) }))
      .concat(st.settled ? [{ id: 'live', glyph: (liveEventShortName.match(/\d+/) || ['—'])[0], name: liveEventShortName, when: '', hits: settledHits, of: BOUTS.length, tier: liveTier }] : []);
    let streak = 0;
    for (let i = collectRows.length - 1; i >= 0; i--) { if (collectRows[i].tier) streak++; else break; }
    const earnedCount = collectRows.filter(c => c.tier).length;
    const packs = st.packs || 0;
    const ownedMap = st.owned || {};
    const ownedKinds = Object.keys(ownedMap).filter(k => ownedMap[k] > 0).length;
    const ownedTotal = Object.keys(ownedMap).reduce((n, k) => n + ownedMap[k], 0);
    const rv = st.reveal || null;
    const rvF = rv ? (FIGHTERS.find(x => x.id === rv.id) || FIGHTERS[0]) : FIGHTERS[0];
    const rvRank = rvF ? effRank(rvF.id, st.rankOverrides) : -1;
    const rvRarity = effRarity(rvF ? rvF.id : 'x', st.rankOverrides);
    // Real shared leaderboard from Supabase (all players' scored picks), refreshed on a poll.
    const board = (st.leaderboard || []).map(r => ({ name: r.name, pts: r.pts, gain: r.id === st.playerId ? settledTotal : r.pts, me: r.id === st.playerId }));
    const myPts = (board.find(r => r.me) || { pts: 0 }).pts;
    const myRankIdx = board.findIndex(r => r.me);

    const standings = board.slice(0, 6).map((r, i) => ({
      rank: i + 1, name: r.name, pts: NUM(r.pts),
      bg: r.me ? '#241d16' : (i % 2 ? '#161311' : '#1a1613'),
      rankColor: i === 0 ? AMBER : (r.me ? CREAM : MUTED),
      ptsColor: i === 0 ? AMBER : (r.me ? CREAM : MUTED)
    }));

    const recapStandings = board.slice(0, 6).map((r, i) => ({
      rank: i + 1, name: r.name, pts: NUM(r.pts),
      delta: r.gain > 0 ? '+' + r.gain : '—',
      deltaColor: r.gain > 0 ? GREEN : MUTED,
      bg: r.me ? '#241d16' : (i % 2 ? '#161311' : '#1a1613'),
      rankColor: i === 0 ? AMBER : (r.me ? CREAM : MUTED),
      ptsColor: r.me ? CREAM : MUTED
    }));

    const slate = BOUTS.map(b => {
      const p = picks[b.id];
      const has = p && p.winner;
      return {
        slot: TQ('slot', b.slot, b.slot) + ' · ' + TQ('div', b.div, b.div),
        fight: b.a.split(' ').slice(-1)[0] + ' / ' + b.b.split(' ').slice(-1)[0],
        pick: has ? pickLabel(b.id, p) : T('nothing_yet'),
        pickColor: has ? '#cfc6b8' : MUTED,
        max: boutMax(p) || '—',
        edge: has ? AMBER : 'rgba(255,255,255,.14)',
        open: () => go('fight', { fightId: b.id })
      };
    });

    const liveRecapRows = BOUTS.map(b => {
      const p = picks[b.id], r = RESULTS[b.id], sc = scoreBout(b.id, p);
      if (!r) {
        return {
          slot: TQ('slot', b.slot, b.slot) + ' · ' + TQ('div', b.div, b.div),
          fight: b.a.split(' ').slice(-1)[0] + ' / ' + b.b.split(' ').slice(-1)[0],
          said: p && p.winner ? pickLabel(b.id, p) : 'No pick',
          result: 'Pending', resultColor: MUTED, pts: '0', ptsColor: MUTED, edge: 'rgba(255,255,255,.14)'
        };
      }
      const winner = r.winner === 'a' ? b.a : b.b;
      const resultTxt = winner.split(' ').slice(-1)[0] + ' · ' + TQ('method', r.method, r.method) + (r.round ? ' · ' + T('r_abbr') + r.round : '');
      return {
        slot: TQ('slot', b.slot, b.slot) + ' · ' + TQ('div', b.div, b.div),
        fight: b.a.split(' ').slice(-1)[0] + ' / ' + b.b.split(' ').slice(-1)[0],
        said: p && p.winner ? pickLabel(b.id, p) : 'No pick',
        result: resultTxt,
        resultColor: sc.hit ? GREEN : RED,
        pts: sc.pts > 0 ? '+' + sc.pts : '0',
        ptsColor: sc.pts > 0 ? AMBER : MUTED,
        edge: sc.hit ? '#1b7a4b' : 'rgba(255,255,255,.14)'
      };
    });

    const todayTs = Date.now();
    const liveIso = st.liveEventStartsAtMs ? new Date(st.liveEventStartsAtMs).toISOString() : null;
    const syntheticLiveEvent = st.liveEventId ? {
      id: 'live-' + st.liveEventId, t: liveIso, name: st.liveEventName,
      d: (liveIso || new Date().toISOString()).slice(0, 10), venue: st.liveEventVenue, ours: true
    } : null;
    const evAll = EVENTS.map(e => ({ ev: e, ts: Date.parse(e.d + 'T12:00:00Z') }))
      .concat(syntheticLiveEvent ? [{ ev: syntheticLiveEvent, ts: Date.parse(syntheticLiveEvent.d + 'T12:00:00Z') }] : []);
    const isLiveEntry = x => syntheticLiveEvent && x.ev.id === syntheticLiveEvent.id;
    // The live card counts as "upcoming" until settled, regardless of its noon-UTC bucket vs. right now.
    const future = evAll.filter(x => isLiveEntry(x) || x.ts >= todayTs).sort((a, b) => a.ts - b.ts);
    const pastEv = evAll.filter(x => !isLiveEntry(x) && x.ts < todayTs).sort((a, b) => b.ts - a.ts).slice(0, 5);
    const liveEv = future[0] || evAll[evAll.length - 1];
    const ourCardIsLive = liveEv.ev.ours === true;
    const daysTo = x => Math.round((x.ts - todayTs) / 864e5);

    const archId = (st.recapId === 'live' && !st.settled) ? 'fn284' : (st.recapId || (st.settled ? 'live' : 'fn284'));
    const liveRecap = archId === 'live';
    const arch = PAST.find(p => p.id === archId) || PAST[0];
    const archHits = arch.rows.filter(r => r.hit).length;
    const archPts = arch.rows.reduce((n, r) => n + r.pts, 0);
    const archStandings = (arch.gains || []).map((r, i) => ({ rank: i + 1, name: r.name, pts: '+' + r.pts, delta: '', deltaColor: (r.delta && r.delta !== '—') ? GREEN : MUTED, bg: r.me ? '#241d16' : (i % 2 ? '#161311' : '#1a1613'), rankColor: i === 0 ? AMBER : (r.me ? CREAM : MUTED), ptsColor: r.me ? CREAM : MUTED }));
    const archTabs = (st.settled ? [{ id: 'live', label: (st.liveEventName || 'Live card').split('·')[0].trim() }] : []).concat(PAST.map(p => ({ id: p.id, label: p.label })));

    const scoreLines = [{ label: 'Winner', value: fp.winner ? '+50' : 'pick one', color: fp.winner ? CREAM : MUTED }];
    if (detailed) {
      scoreLines.push({ label: 'Finish type', value: fp.method && fp.method !== 'Skip' ? '+30' : 'skipped', color: fp.method && fp.method !== 'Skip' ? CREAM : MUTED });
      scoreLines.push({ label: 'Exact round', value: fp.round ? '+40' : 'skipped', color: fp.round ? CREAM : MUTED });
      scoreLines.push({ label: 'Bonus call', value: fp.bonus && fp.bonus !== 'Skip' ? '+25' : 'skipped', color: fp.bonus && fp.bonus !== 'Skip' ? CREAM : MUTED });
    }

    const callWho = fp.winner ? (fp.winner === 'a' ? fight.a : fight.b).split(' ').slice(-1)[0] : null;
    const callSummary = !callWho ? T('nothing_called') :
      callWho + (fp.method && fp.method !== 'Skip' ? ' · ' + TQ('method', fp.method, fp.method) : ' · ' + T('to_win')) + (fp.round ? ' · ' + T('r_abbr') + fp.round : '');

    const roundOpts = [];
    for (let i = 1; i <= fight.rounds; i++) roundOpts.push({ label: String(i), sel: fp.round === i, set: () => setPick(fight.id, { round: fp.round === i ? null : i }) });
    roundOpts.push({ label: '—', sel: !fp.round, set: () => setPick(fight.id, { round: null }) });

    const allIn = pickedIds.length === BOUTS.length;

    const L = {};
    Object.keys(I18N.en).forEach(k => { if (typeof I18N.en[k] === 'string') L['t_' + k] = T(k); });

    return Object.assign(L, {
      route: st.route,
      isWelcome: st.route === 'welcome',
      isApp: st.route !== 'welcome',
      isHome: st.route === 'home', isCards: st.route === 'cards', isFight: st.route === 'fight',
      isConfirm: st.route === 'confirm', isMine: st.route === 'mypicks', isRecap: st.route === 'recap',
      isPacks: st.route === 'packs',
      navHome: st.route === 'home' || st.route === 'fight' || st.route === 'confirm',
      navCards: st.route === 'cards', navMine: st.route === 'mypicks',

      name: st.draftName, nameUpper: name.toUpperCase(),
      nameHint: st.draftName.trim().length < 2 ? T('name_min') : '"' + st.draftName.trim() + '" ' + T('name_free'),
      onName: e => patch({ draftName: e.target.value }),
      createAccount: () => {
        const n = (st.draftName || '').trim();
        if (n.length < 2) return;
        const pid = st.playerId || window.CageClashSupabase.getPlayerId();
        patch({ name: n, playerId: pid, route: 'home' }, { save: true });
        window.CageClashSupabase.ensurePlayer(pid, n).then(() => refreshLiveData()).catch(() => {});
      },

      points: NUM(myPts),
      countdown: st.locked ? T('locked_caps') : pad(mm) + ':' + pad(ss) + ':' + pad(s3),
      clockLabel: st.locked ? T('picks_are_in') : T('picks_lock_in_label'),
      lockLine: st.locked ? T('locked_first_bell') + ' · ' + fmtIn(CARD_TIMES.early, st.tz || 'local', T_OPTS) + ' ' + zoneAbbr(CARD_TIMES.early, st.tz || 'local') : T('picks_lock_in') + ' ' + pad(mm) + ':' + pad(ss) + ':' + pad(s3),
      deeperNote: st.locked ? T('deeper_locked') : T('deeper_open'),
      saveHint: st.locked ? T('hint_locked') : (fp.winner ? T('hint_open') : T('hint_pick_first')),
      heroTag: st.settled ? T('hero_settled') : st.locked ? T('hero_locked') : T('hero_open'),
      heroCta: st.locked ? T('cta_review') : allIn ? T('cta_confirm') : F('cta_finish', { n: openBoutsRaw.length }),
      heroAction: () => go(st.locked ? 'mypicks' : allIn ? 'confirm' : 'fight', st.locked || allIn ? {} : { fightId: openBoutsRaw[0].id }),
      progressPct: Math.round((pickedIds.length / BOUTS.length) * 100) + '%',
      progressLabel: pickedIds.length + ' / ' + BOUTS.length + ' ' + T('bouts_picked') + (st.locked ? ' · ' + T('locked_word') : ''),

      locked: st.locked,
      tzLabel: T('times_in') + ' ' + tzPretty(st.tz || 'local') + ' (' + zoneAbbr(CARD_TIMES.main, st.tz || 'local') + ')',
      cycleTz: () => patch(s => ({ tz: TZS[(TZS.indexOf(s.tz || 'local') + 1) % TZS.length] }), { save: true }),
      tEarlyShort: T('early_prelims') + ' ' + fmtIn(CARD_TIMES.early, st.tz || 'local', T_OPTS),
      tPrelimShort: T('prelims') + ' ' + fmtIn(CARD_TIMES.prelims, st.tz || 'local', T_OPTS),
      tMainShort: T('main_card') + ' ' + fmtIn(CARD_TIMES.main, st.tz || 'local', T_OPTS) + ' ' + zoneAbbr(CARD_TIMES.main, st.tz || 'local'),
      eventName: liveEventShortName,
      eventWhen: T('main_card') + ' ' + fmtIn(CARD_TIMES.main, st.tz || 'local', DT_OPTS) + ' ' + zoneAbbr(CARD_TIMES.main, st.tz || 'local') + (st.liveEventVenue ? ' · ' + st.liveEventVenue : ''),
      todayLabel: T('today') + ' · ' + fmtDate(todayTs) + ' · ' + T('rolls_sat'),
      liveName: liveEv.ev.name,
      liveDate: fmtIn(liveEv.ev.t, st.tz || 'local', D_OPTS) + ' · ' + fmtIn(liveEv.ev.t, st.tz || 'local', T_OPTS),
      liveVenue: liveEv.ev.venue,
      liveStatus: ourCardIsLive ? (st.locked ? F('picks_locked_n', { a: pickedIds.length, b: BOUTS.length }) : F('picks_open_n', { a: pickedIds.length, b: BOUTS.length })) : (daysTo(liveEv) > 7 ? F('imports_in_days', { n: daysTo(liveEv) - 7 }) : T('imported_open')),
      openLiveCard: () => go('home'),
      scheduleBanner: ourCardIsLive ? F('next_after', { x: future[1] ? future[1].ev.name + ' · ' + fmtDate(future[1].ts) : T('schedule_tba') }) : F('done_next', { x: liveEv.ev.name + ' · ' + fmtDate(liveEv.ts), v: liveEv.ev.venue }),
      upcomingEvents: future.slice(1, 4).map(x => ({
        name: x.ev.name, date: fmtIn(x.ev.t, st.tz || 'local', D_OPTS) + ' · ' + fmtIn(x.ev.t, st.tz || 'local', T_OPTS), venue: x.ev.venue,
        note: daysTo(x) > 7 ? F('imports_days_note', { n: daysTo(x) - 7 }) : T('imported_opens')
      })),
      pastEvents: pastEv.map(x => {
        const a = PAST.find(p => p.id === x.ev.arch);
        const isOurs = x.ev.ours === true;
        return {
          name: x.ev.name, date: fmtIn(x.ev.t, st.tz || 'local', D_OPTS), venue: x.ev.venue,
          status: isOurs ? (st.settled ? F('settled_you_went', { a: settledHits, b: BOUTS.length, p: settledTotal }) : T('awaiting_settle')) : (a ? F('you_went', { s: a.score, p: a.pts }) : T('before_scoring')),
          badge: isOurs ? (st.settled ? T('badge_settled') : T('badge_awaiting')) : (a && a.rows.length ? T('badge_official') : a ? T('badge_totals') : T('badge_not_scored')),
          badgeColor: (isOurs && !st.settled) ? '#e8a33d' : ((a || isOurs) ? '#5fc98a' : 'rgba(235,235,245,.45)'),
          open: isOurs ? (st.settled ? () => go('recap', { recapId: 'live' }) : () => go('home')) : (a ? () => go('recap', { recapId: a.id }) : () => {})
        };
      }),
      standingsHeading: liveRecap ? T('standings_after') : T('points_on_card'),
      cardBouts: BOUTS.map((b, i) => {
        const p = picks[b.id], has = !!(p && p.winner);
        return {
          num: String(i + 1).padStart(2, '0'), a: b.a, b: b.b,
          aArt: artByName(b.a, st.rankOverrides), bArt: artByName(b.b, st.rankOverrides), aMono: monogram(b.a), bMono: monogram(b.b),
          meta: TQ('slot', b.slot, b.slot) + ' · ' + TQ('div', b.div, b.div) + ' · ' + b.rounds + ' ' + T('rds'),
          picked: has, needsPick: !has && !st.locked, missed: !has && st.locked,
          pickLabel: pickLabel(b.id, p), state: st.locked ? T('locked_in') : T('your_pick'),
          open: () => go('fight', { fightId: b.id })
        };
      }),
      boutPosition: F('bout_x_of_y', { a: fightIdx + 1, b: BOUTS.length }),
      prevLabel: BOUTS[(fightIdx - 1 + BOUTS.length) % BOUTS.length].a.split(' ').slice(-1)[0],
      nextLabel: BOUTS[(fightIdx + 1) % BOUTS.length].a.split(' ').slice(-1)[0],
      goPrevBout: () => go('fight', { fightId: BOUTS[(fightIdx - 1 + BOUTS.length) % BOUTS.length].id }),
      goNextBout: () => go('fight', { fightId: BOUTS[(fightIdx + 1) % BOUTS.length].id }),
      cardNote: st.locked ? T('card_note_locked') : T('card_note_open'),
      lastSettledEvent: T('last_settled') + ' · ' + (st.settled ? liveEventShortName : 'Gamrot vs. Salkilld'),
      lastSettledScore: st.settled ? F('you_went_short', { a: settledHits, b: BOUTS.length }) : F('you_went_short', { a: 3, b: 5 }),
      lastSettledNote: st.settled ? F('last_note_sim', { p: settledTotal }) : T('last_note_real'),

      unlockTag: (() => { const t = liveRecap ? liveTier : (collectRows.find(c => c.id === arch.id) || {}).tier; return t ? T('r_unlocked') : T('r_missed'); })(),
      unlockTitle: (() => { const r = liveRecap ? { tier: liveTier, name: 'Philly Title Night' } : (collectRows.find(c => c.id === arch.id) || {}); return r.tier ? T('tier_' + r.tier) + ' · ' + r.name : T('locked_token'); })(),
      unlockGlyph: liveRecap ? '330' : ((collectRows.find(c => c.id === arch.id) || {}).glyph || '—'),
      unlockRing: (() => { const t = liveRecap ? liveTier : (collectRows.find(c => c.id === arch.id) || {}).tier; return (t ? TIER_META[t] : LOCKED_META).ring; })(),
      unlockBg: (() => { const t = liveRecap ? liveTier : (collectRows.find(c => c.id === arch.id) || {}).tier; return (t ? TIER_META[t] : LOCKED_META).bg; })(),
      unlockInk: (() => { const t = liveRecap ? liveTier : (collectRows.find(c => c.id === arch.id) || {}).tier; return (t ? TIER_META[t] : LOCKED_META).ink; })(),
      unlockNote: (() => {
        const r = liveRecap ? { tier: liveTier, hits: settledHits, of: BOUTS.length, name: 'Philly Title Night' } : (collectRows.find(c => c.id === arch.id) || { hits: 0, of: 0, name: arch.name });
        if (r.tier) return F('unlock_note_win', { p: TIER_PTS[r.tier], e: r.name, a: r.hits, b: r.of });
        return F('unlock_note_miss', { n: Math.floor((r.of || 0) / 2) + 1, b: r.of || 0 });
      })(),
      unlockBonus: (() => { const t = liveRecap ? liveTier : (collectRows.find(c => c.id === arch.id) || {}).tier; return t ? '+' + TIER_PTS[t] : '0'; })(),
      streakLabel: streak > 0 ? F('streak_label', { n: streak, e: earnedCount }) : T('streak_none'),
      collection: collectRows.slice().reverse().map(c => {
        const m = c.tier ? TIER_META[c.tier] : LOCKED_META;
        return {
          glyph: c.glyph, name: c.name, ring: m.ring, bg: m.bg, ink: m.ink,
          opacity: c.tier ? '1' : '.55',
          sub: c.tier ? T('tier_' + c.tier) + ' · ' + c.hits + '/' + c.of : T('locked_token') + ' · ' + c.hits + '/' + c.of,
          subColor: c.tier ? m.ring : 'rgba(235,235,245,.4)'
        };
      }),
      goPacks: () => go('packs', { reveal: null }),
      packChipLabel: packs > 0 ? (packs === 1 ? T('pack_chip_ready_one') : F('pack_chip_ready', { n: packs })) : F('pack_chip_cards', { n: ownedTotal }),
      packChipBg: packs > 0 ? 'rgba(232,163,61,.16)' : '#2c2c2e',
      packChipInk: packs > 0 ? '#e8a33d' : 'rgba(235,235,245,.6)',
      packCount: F('pack_x_sealed', { n: packs }),
      packStateTag: packs > 0 ? (packs === 1 ? T('pack_chip_ready_one') : F('pack_chip_ready', { n: packs })) : T('pack_none_tag'),
      packStateNote: packs > 0 ? T('pack_ready_note') : T('pack_none_note'),
      packBtnLabel: packs > 0 ? T('pack_open_cta') : T('pack_locked_cta'),
      packBtnBg: packs > 0 ? '#e8a33d' : '#2c2c2e',
      packBtnInk: packs > 0 ? '#111' : 'rgba(235,235,245,.45)',
      openPack: () => {
        if ((stateRef.current.packs || 0) <= 0) return;
        const got = rollFighter(stateRef.current.rankOverrides);
        patch(s => {
          const owned = { ...s.owned };
          const dupe = !!owned[got.id];
          owned[got.id] = (owned[got.id] || 0) + 1;
          return { owned, packs: (s.packs || 0) - 1, reveal: { id: got.id, dupe }, points: dupe ? s.points + 25 : s.points };
        }, { save: true });
      },
      hasReveal: !!rv,
      revealName: rv ? rvF.name : '', revealDiv: rv ? TQ('div', rvF.div, rvF.div) : '',
      revealMonogram: rv ? monogram(rvF.name) : '',
      revealArt: rv ? artFor(rvF.name, rvRarity) : artFor('x', 'common'),
      revealRarity: rv ? T('rarity_' + rvRarity) : '',
      revealRing: rv ? RARITY[rvRarity].ring : 'rgba(235,235,245,.3)',
      revealBg: rv ? RARITY[rvRarity].bg : '#1c1c1e',
      revealTag: rv ? (rv.dupe ? T('reveal_dupe_tag') : T('reveal_new_tag')) : '',
      revealMeta: rv ? (rvRank === 0 ? T('rank_champ') : rvRank > 0 ? '#' + rvRank : T('rank_unranked')) + ' · ' + TQ('div', rvF.div, rvF.div) : '',
      revealNote: rv ? (rv.dupe ? F('reveal_dupe_note', { n: (st.owned || {})[rv.id] || 2 }) : F('reveal_new_note', { r: T('rarity_' + rvRarity) })) : '',
      rosterCount: F('roster_count', { a: ownedKinds, b: FIGHTERS.length }),
      divFilters: [{ id: 'all', label: T('p_filter_all') }].concat(DIV_LIST.map(d => ({ id: d, label: TQ('div_short', d, TQ('div', d, d)) })))
        .map(x => ({ label: x.label, sel: (st.rosterDiv || 'all') === x.id, set: () => patch({ rosterDiv: x.id }, { save: true }) })),
      ownedOnlyLabel: st.ownedOnly ? T('p_owned_on') : T('p_owned_off'),
      ownedOnlyBg: st.ownedOnly ? 'rgba(232,163,61,.16)' : '#2c2c2e',
      ownedOnlyInk: st.ownedOnly ? '#e8a33d' : 'rgba(235,235,245,.6)',
      toggleOwnedOnly: () => patch(s => ({ ownedOnly: !s.ownedOnly }), { save: true }),
      tierRule: T('p_tier_rule'),
      roster: FIGHTERS.filter(x => (st.rosterDiv || 'all') === 'all' || x.div === st.rosterDiv)
        .filter(x => !st.ownedOnly || ((st.owned || {})[x.id] || 0) > 0)
        .map(x => {
          const n = (st.owned || {})[x.id] || 0;
          const m = RARITY[x.r];
          return {
            name: x.name, div: TQ('div', x.div, x.div), monogram: monogram(x.name), art: artFor(x.name, x.r), rarity: T('rarity_' + x.r),
            rank: x.rank === 0 ? T('rank_champ') : (x.rank > 0 ? '#' + x.rank : T('rank_unranked')),
            ring: n ? m.ring : 'rgba(235,235,245,.14)', bg: n ? m.bg : 'rgba(235,235,245,.03)',
            opacity: n ? '1' : '.4', dupes: n > 1 ? '×' + n : (n === 1 ? '' : T('rarity_locked'))
          };
        }),
      standings, slate,
      ledger: LEDGER.map((l, i) => ({ date: l.date, what: TQ('lwhat', i, l.what), detail: TQ('ldetail', i, l.detail), pts: l.pts, color: l.color })),
      recapStandings: liveRecap ? recapStandings : archStandings,
      recapRows: liveRecap ? liveRecapRows : arch.rows.map((r, ri) => ({ slot: TQ('arowslot', r.slot, r.slot), fight: r.fight, said: TQ('arow', arch.id + ri + 's', r.said), result: TQ('arow', arch.id + ri + 'r', r.result), resultColor: r.hit ? GREEN : RED, pts: r.pts > 0 ? '+' + r.pts : '0', ptsColor: r.pts > 0 ? AMBER : MUTED, edge: r.hit ? '#1b7a4b' : 'rgba(255,255,255,.14)' })),
      maxHaul: NUM(maxHaul),

      fMeta: TQ('slot', fight.slot, fight.slot) + ' · ' + TQ('div', fight.div, fight.div) + ' · ' + fight.rounds + ' ' + T('rounds_word'),
      iA: intel(fight.a), iB: intel(fight.b),
      fAArt: artByName(fight.a), fBArt: artByName(fight.b),
      fAMono: monogram(fight.a), fBMono: monogram(fight.b),
      fA: fight.a, fB: fight.b, fARec: T('record_word') + ' ' + (CARD_REC[fight.a] || '—'), fBRec: T('record_word') + ' ' + (CARD_REC[fight.b] || '—'),
      fAForm: TQ('form', fight.aForm, fight.aForm), fBForm: TQ('form', fight.bForm, fight.bForm),
      selA: fp.winner === 'a', selB: fp.winner === 'b',
      labelA: fp.winner === 'a' ? (st.locked ? T('locked_in') : T('your_pick')) : (st.locked ? T('not_picked') : T('tap_to_pick')),
      labelB: fp.winner === 'b' ? (st.locked ? T('locked_in') : T('your_pick')) : (st.locked ? T('not_picked') : T('tap_to_pick')),
      pickA: () => setPick(fight.id, { winner: 'a' }),
      pickB: () => setPick(fight.id, { winner: 'b' }),
      detailed,
      methods: METHODS.map(m => ({ label: TQ('method', m, m), sel: fp.method === m || (m === 'Skip' && !fp.method), set: () => setPick(fight.id, { method: m }) })),
      rounds: roundOpts,
      bonuses: BONUSES.map(x => ({ label: TQ('bonus', x, x), sel: fp.bonus === x || (x === 'Skip' && !fp.bonus), set: () => setPick(fight.id, { bonus: x }) })),
      callSummary, scoreLines, boutMax: boutMax(fp),
      saveLabel: st.locked ? T('save_locked') : allIn ? T('save_review') : T('save_next'),
      savePick: () => {
        if (!fp.winner) return;
        if (st.locked) { go('mypicks'); return; }
        const remaining = BOUTS.filter(b => b.id !== fight.id && !(picks[b.id] && picks[b.id].winner));
        go(remaining.length ? 'fight' : 'confirm', remaining.length ? { fightId: remaining[0].id } : {});
      },
      showSplit: SHOW_GROUP_SPLIT,
      splitAPct: Math.round((fight.splitA / 8) * 100) + '%',
      splitALabel: fight.a.split(' ').slice(-1)[0] + ' ' + fight.splitA,
      splitBLabel: fight.b.split(' ').slice(-1)[0] + ' ' + (8 - fight.splitA),
      splitQuip: TQ('quip', fight.id, fight.quip),

      confirmTag: st.locked ? T('confirm_locked') : allIn ? F('confirm_all_in', { n: BOUTS.length }) : F('confirm_partial', { a: pickedIds.length, b: BOUTS.length }),
      confirmHeadline: st.locked ? T('confirm_head_locked') : allIn ? T('confirm_head_all') : T('confirm_head_partial'),
      confirmBlurb: st.locked ? T('confirm_blurb_locked') : T('confirm_blurb_open'),
      confirmCta: st.locked ? T('confirm_cta_locked') : T('confirm_cta_open'),
      lockNote: st.locked ? T('lock_note_locked') : T('lock_note_open') + ' · ' + fmtIn(CARD_TIMES.early, st.tz || 'local', T_OPTS) + ' ' + zoneAbbr(CARD_TIMES.early, st.tz || 'local'),
      lockAll: () => { go('home'); },

      hitRate: '72%', myRank: '#' + (myRankIdx + 1),
      currentSlateHeading: liveEventShortName + ' · ' + (st.settled ? T('settled_word') : st.locked ? T('locked_word2') : T('in_progress')),

      recapBadge: liveRecap ? T('recap_official') : (arch.rows.length ? T('recap_official') : T('recap_totals')),
      recapEvent: liveRecap ? liveEventShortName : arch.name,
      recapVenue: liveRecap ? (st.liveEventVenue || '') + ' · ' + fmtIn(CARD_TIMES.main, st.tz || 'local', DT_OPTS) + ' ' + zoneAbbr(CARD_TIMES.main, st.tz || 'local') + ' · ' + BOUTS.length + ' ' + T('bouts_word') : arch.venue,
      recapScore: liveRecap ? settledHits + ' / ' + BOUTS.length : (arch.rows.length ? archHits + ' / ' + arch.rows.length : arch.score),
      recapPts: liveRecap ? '+' + (settledTotal + weeklyBonus) : (arch.rows.length ? '+' + archPts : arch.pts),
      recapBlurb: liveRecap ? '' : TQ('psub', arch.id, arch.sub),
      recapQuip: liveRecap ? (settledHits >= 4 ? T('recap_quip_good') : T('recap_quip_bad')) : TQ('pquip', arch.id, arch.quip),
      noRecapRows: !liveRecap && arch.rows.length === 0,
      noRowsNote: TQ('pnote', arch.id, arch.note || ''),
      auditNote: liveRecap ? T('audit_real') : T('audit_real'),
      archiveTabs: archTabs.map(t => ({ label: t.label, sel: t.id === archId, open: () => go('recap', { recapId: t.id }) })),

      langCode: LANG_CODE[LI], langOptions: LANGS.map(l => ({ label: LANG_CODE[l], name: LANG_NAME[l], sel: l === LI, set: () => patch({ lang: l }, { save: true }) })),
      cycleLang: () => patch(s => ({ lang: LANGS[(LANGS.indexOf(s.lang || 'en') + 1) % LANGS.length] }), { save: true }),
      goHome: () => go('home'), goCards: () => go('cards'),
      goMyPicks: () => go('mypicks'), goRecap: () => go('recap', { recapId: st.settled ? 'live' : 'fn284' }),
      copyLabel: st.copied ? T('copied') : T('copy_invite'),
      copyInvite: () => { patch({ copied: true }); setTimeout(() => patch({ copied: false }), 1800); },
      refreshLabel: 'Refresh',
      refreshAction: () => { refreshLiveData(); }
    });
  }

  const vals = React.useMemo(() => computeVals(state), [state]);
  return vals;
}
