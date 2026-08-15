const KEY = 'cage-clash-v1';
const AMBER = '#e8a33d', MUTED = '#8a8175', CREAM = '#f6f1e6', GREEN = '#5fa87c', RED = '#c2604a';

// BOUTS/RESULTS are mutable: they start as this fallback card (instant paint,
// works offline) and get overwritten once the live event loads from Supabase.
let BOUTS = [
  {id:'b1', slot:'Early prelims', div:'Welterweight', rounds:3, a:'Jeremiah Wells', b:'Myktybek Orolbai', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:2, quip:'Six of eight on Orolbai. The other two have not opened the app yet.'},
  {id:'b2', slot:'Early prelims', div:'Welterweight', rounds:3, a:'Neil Magny', b:'Ramiz Brahimaj', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'Veteran', bForm:'', aFin:'', bFin:'', splitA:5, quip:'The Magny special: three rounds, no fireworks, everyone argues about the scorecards.'},
  {id:'b3', slot:'Early prelims', div:'Light heavyweight', rounds:3, a:'Rafael Tobias', b:'Lucas Fernando', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:3, quip:'Nobody in this group has watched either man fight. Predictions were made anyway.'},
  {id:'b4', slot:'Prelims', div:'Middleweight', rounds:3, a:'Vicente Luque', b:'Tresean Gore', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:4, quip:'Dead even at four apiece. Someone is going to be very smug about this one.'},
  {id:'b5', slot:'Prelims', div:'Middleweight', rounds:3, a:'Donte Johnson', b:'Eric McConico', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:6, quip:'Bea took the underdog again. Bea has been right about this sort of thing before.'},
  {id:'b6', slot:'Prelims', div:'Lightweight', rounds:3, a:'Jalin Turner', b:'Kauê Fernandes', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:5, quip:'Reach versus pressure, and the group has picked reach five times out of eight.'},
  {id:'b7', slot:'Prelims', div:'Welterweight', rounds:3, a:'Chidi Njokuani', b:'Joel Álvarez', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:3, quip:'Everyone wants the finisher. Nobody can agree which one that is.'},
  {id:'b8', slot:'Main card', div:'Lightweight', rounds:3, a:'Edson Barboza', b:'Esteban Ribovics', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'Veteran', bForm:'', aFin:'', bFin:'', splitA:3, quip:'The heart says Barboza. Five of eight went with their head instead.'},
  {id:'b9', slot:'Main card', div:'Middleweight', rounds:3, a:'Mansur Abdul-Malik', b:'Dustin Stoltzfus', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'', bForm:'', aFin:'', bFin:'', splitA:7, quip:'Seven of eight on Abdul-Malik. Nico has not picked, because Nico is Nico.'},
  {id:'b10', slot:'Main card · co-main', div:"Women's strawweight title", rounds:5, a:'Mackenzie Dern', b:'Gillian Robertson', aRec:'Record pending feed', bRec:'Record pending feed', aForm:'Strawweight champion', bForm:'Challenger · ranked #4', aFin:'', bFin:'', splitA:5, quip:'Two grapplers, so naturally the argument is about whether it ever hits the mat.'},
  {id:'b11', slot:'Main card · main event', div:'Welterweight title', rounds:5, a:'Islam Makhachev', b:'Ian Machado Garry', aRec:'28–1–0', bRec:'17–1–0', aForm:'Welterweight champion', bForm:'Challenger · ranked #2', aFin:'', bFin:'', splitA:6, quip:'Six of eight are on the champion. Marek is calling the upset and has told everyone twice.'}
];

// Fallback only — the live card has no results yet until the admin enters them.
let RESULTS = {};

// Swaps in the live event fetched from Supabase, converting rows to the
// shape the rest of the app already expects. Returns the live event meta.
function applyLiveEvent(event, rows) {
  BOUTS = rows.map(r => ({
    id: r.id, slot: r.slot, div: r.division, rounds: r.rounds,
    a: r.fighter_a, b: r.fighter_b,
    aForm: '', bForm: '', splitA: 4, quip: ''
  }));
  const results = {};
  rows.forEach(r => {
    if (r.result_winner) {
      results[r.id] = { winner: r.result_winner, method: r.result_method, round: r.result_round, bonus: r.result_bonus };
    }
  });
  RESULTS = results;
  return event;
}

const RIVALS = [
  {name:'Bea "The Oracle"', pts:1480, gain:210},
  {name:'Marek', pts:1315, gain:90},
  {name:'Hendo', pts:1190, gain:160},
  {name:'Priya', pts:1005, gain:50},
  {name:'Jonas', pts:940, gain:130},
  {name:'Tam', pts:820, gain:75},
  {name:'Nico', pts:640, gain:0}
];

const LEDGER = [
  {date:'09 AUG', what:'Gamrot vs. Salkilld settled', detail:'3 of 5 correct', pts:'+280', color:GREEN},
  {date:'12 JUL', what:'UFC 329 settled', detail:'5 of 6 correct', pts:'+260', color:GREEN},
  {date:'12 JUL', what:'Round call missed', detail:'Called R2, ended R1', pts:'0', color:MUTED},
  {date:'04 JUL', what:'Welcome balance', detail:'New account', pts:'+800', color:AMBER}
];

const PAST = [
  {id:'fn284', label:'Gamrot', name:'Gamrot vs. Salkilld',
   sub:'UFC Fight Night 284 · settled 09 Aug under rule set v1. Official results entered by the admin.',
   venue:'Meta APEX, Las Vegas · Sat 8 Aug 2026',
   quip:'Salkilld choked out Gamrot in under five minutes and Bea, who called it, has mentioned it eleven times since.',
   score:'3 / 5', pts:'+280', note:'',
   gains:[{name:'You (Alex M)', pts:280, me:true},{name:'Bea "The Oracle"', pts:210},{name:'Hendo', pts:160},{name:'Marek', pts:90},{name:'Priya', pts:50},{name:'Nico', pts:0}],
   rows:[
     {slot:'Main event · Lightweight', fight:'Gamrot / Salkilld', said:'Gamrot · SUB · R2', result:'Salkilld · Submission (RNC) · R1', hit:false, pts:0},
     {slot:'Co-main · Lightweight', fight:'Ferreira / Quarantillo', said:'Ferreira · DEC', result:'Ferreira · Unanimous decision', hit:true, pts:80},
     {slot:'Bout 3 · Featherweight', fight:'del Valle / Elkins', said:'del Valle · KO · R1', result:'del Valle · TKO · R1', hit:true, pts:120},
     {slot:'Bout 4 · Strawweight', fight:'Thainara / Lemos', said:'Lemos · DEC', result:'Thainara · Unanimous decision', hit:false, pts:0},
     {slot:'Bout 5 · Welterweight', fight:'Miller / Goff', said:'Miller · KO · R2', result:'Miller · TKO · R3', hit:true, pts:80}
   ]},
  {id:'e801', label:'Medić', name:'Medić vs. Rodriguez',
   sub:'UFC Fight Night · settled 02 Aug. Six bouts scored by hand; only totals reached the ledger.',
   venue:'Belgrade Arena, Belgrade · Sat 1 Aug 2026',
   quip:'Marek finally had a night. We have heard about the Belgrade card ever since.',
   score:'4 / 6', pts:'+210',
   note:'Bout-level results were never imported for this card — the group settled it by hand and only the totals reached the ledger.',
   gains:[{name:'Marek', pts:240},{name:'You (Alex M)', pts:210, me:true},{name:'Priya', pts:200},{name:'Bea "The Oracle"', pts:180},{name:'Hendo', pts:130},{name:'Nico', pts:90}],
   rows:[]},
  {id:'e725', label:'Ankalaev', name:'Ankalaev vs. Guskov',
   sub:'UFC Fight Night · settled 26 Jul. Hand-scored, totals only.',
   venue:'Etihad Arena, Abu Dhabi · Sat 25 Jul 2026',
   quip:'A midday start meant three people picked from bed and one forgot entirely.',
   score:'3 / 6', pts:'+130',
   note:'Bout-level results were never imported for this card — the group settled it by hand and only the totals reached the ledger.',
   gains:[{name:'Bea "The Oracle"', pts:220},{name:'Hendo', pts:190},{name:'You (Alex M)', pts:130, me:true},{name:'Marek', pts:60},{name:'Priya', pts:40},{name:'Nico', pts:0}],
   rows:[]},
  {id:'e718', label:'Du Plessis', name:'Du Plessis vs. Usman',
   sub:'UFC Fight Night · settled 19 Jul. Hand-scored, totals only.',
   venue:'Paycom Center, Oklahoma City · Sat 18 Jul 2026',
   quip:'Your best night of the season, and nobody has let you forget it was mostly luck.',
   score:'5 / 7', pts:'+300',
   note:'Bout-level results were never imported for this card — the group settled it by hand and only the totals reached the ledger.',
   gains:[{name:'You (Alex M)', pts:300, me:true},{name:'Marek', pts:210},{name:'Bea "The Oracle"', pts:150},{name:'Priya', pts:120},{name:'Hendo', pts:80},{name:'Nico', pts:60}],
   rows:[]},
  {id:'ufc329', label:'UFC 329', name:'UFC 329',
   sub:'McGregor vs. Holloway 2 · the first card the group ever scored, settled 12 Jul.',
   venue:'T-Mobile Arena, Las Vegas · Sat 11 Jul 2026',
   quip:'Eight people, one group chat, no scoring rules written down yet. It showed.',
   score:'5 / 6', pts:'+260',
   note:'Bout-level results were never imported for this card — the group settled it by hand and only the totals reached the ledger.',
   gains:[{name:'You (Alex M)', pts:260, me:true},{name:'Bea "The Oracle"', pts:190},{name:'Marek', pts:170},{name:'Hendo', pts:120},{name:'Priya', pts:90},{name:'Nico', pts:40}],
   rows:[]}
];

const EVENTS = [
  {id:'e627', t:'2026-06-27T16:00:00Z', name:'Fiziev vs. Torres', d:'2026-06-27', venue:'National Gymnastics Arena, Baku'},
  {id:'e704', t:'2026-07-05T00:00:00Z', name:'Kape vs. Horiguchi', d:'2026-07-04', venue:'Meta APEX, Las Vegas'},
  {id:'e711', t:'2026-07-12T01:00:00Z', name:'UFC 329 · McGregor vs. Holloway 2', d:'2026-07-11', venue:'T-Mobile Arena, Las Vegas', arch:'ufc329'},
  {id:'e718', t:'2026-07-19T00:00:00Z', name:'Du Plessis vs. Usman', d:'2026-07-18', venue:'Paycom Center, Oklahoma City', arch:'e718'},
  {id:'e725', t:'2026-07-25T16:00:00Z', name:'Ankalaev vs. Guskov', d:'2026-07-25', venue:'Etihad Arena, Abu Dhabi', arch:'e725'},
  {id:'e801', t:'2026-08-01T17:00:00Z', name:'Medić vs. Rodriguez', d:'2026-08-01', venue:'Belgrade Arena, Belgrade', arch:'e801'},
  {id:'e808', t:'2026-08-09T00:00:00Z', name:'Gamrot vs. Salkilld', d:'2026-08-08', venue:'Meta APEX, Las Vegas', arch:'fn284'},
  // The live card itself is injected dynamically from Supabase — see applyLiveEvent/evAll.
  {id:'e822', t:'2026-08-23T00:00:00Z', name:'Hernandez vs. Rodrigues', d:'2026-08-22', venue:'Golden 1 Center, Sacramento'},
  {id:'e829', t:'2026-08-29T10:00:00Z', name:'Nurmagomedov vs. Song', d:'2026-08-29', venue:'Oriental Sports Center, Shanghai'},
  {id:'e905', t:'2026-09-05T19:00:00Z', name:'Hooker vs. Parnasse', d:'2026-09-05', venue:'Accor Arena, Paris'},
  {id:'e912', t:'2026-09-13T00:00:00Z', name:'Rodriguez vs. Silva', d:'2026-09-12', venue:'Desert Diamond Arena, Glendale'},
  {id:'e919', t:'2026-09-20T01:00:00Z', name:'UFC 331 · Van vs. Pantoja 2', d:'2026-09-19', venue:'Crypto.com Arena, Los Angeles'},
  {id:'e926', t:'2026-09-27T01:00:00Z', name:'Fight Night · card TBA', d:'2026-09-26', venue:'Meta APEX, Las Vegas'},
  {id:'e1003', t:'2026-10-04T01:00:00Z', name:'UFC 332 · card TBA', d:'2026-10-03', venue:'Delta Center, Salt Lake City'}
];

const TZS = ['local','America/New_York','America/Los_Angeles','Europe/London','Europe/Madrid','Asia/Tokyo','Australia/Sydney'];
// Mutated in place once the live event's real starts_at loads from Supabase.
let CARD_TIMES = { early:'2026-08-15T21:00:00Z', prelims:'2026-08-15T23:00:00Z', main:'2026-08-16T01:00:00Z' };
function tzName(tz) { try { return tz === 'local' ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC') : tz; } catch (e) { return 'UTC'; } }
function tzPretty(tz) { return tzName(tz).split('/').slice(-1)[0].replace(/_/g, ' '); }
function fmtIn(iso, tz, opts) { try { return new Intl.DateTimeFormat(LOC(), Object.assign({ timeZone: tzName(tz) }, opts)).format(new Date(iso)).replace(/,/g, ''); } catch (e) { return ''; } }
function zoneAbbr(iso, tz) { try { const ps = new Intl.DateTimeFormat('en-GB', { timeZone: tzName(tz), timeZoneName: 'short' }).formatToParts(new Date(iso)); const p = ps.find(x => x.type === 'timeZoneName'); return p ? p.value : ''; } catch (e) { return ''; } }
const D_OPTS = { weekday:'short', day:'2-digit', month:'short' };
const T_OPTS = { hour:'2-digit', minute:'2-digit', hour12:false };
const DT_OPTS = { weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', hour12:false };
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const BASE_TODAY = Date.parse('2026-08-10T12:00:00Z');
function fmtDate(ts) { try { return new Intl.DateTimeFormat(LOC(), { weekday:'short', day:'2-digit', month:'short', timeZone:'UTC' }).format(new Date(ts)).replace(/,/g, ''); } catch (e) { const x = new Date(ts); return DAY[x.getUTCDay()] + ' ' + String(x.getUTCDate()).padStart(2, '0') + ' ' + MON[x.getUTCMonth()]; } }


const LANGS = ['en','pt','ru'];
const LANG_CODE = { en:'EN', pt:'PT', ru:'RU' };
const LANG_NAME = { en:'English', pt:'Português', ru:'Русский' };
const LOCALE = { en:'en-GB', pt:'pt-BR', ru:'ru-RU' };
let LI = 'en';
const I18N = { en:{}, pt:{}, ru:{} };
function T(k) { const d = I18N[LI] || {}; return d[k] !== undefined ? d[k] : (I18N.en[k] !== undefined ? I18N.en[k] : k); }
function TQ(group, key, fallback) { const g = (I18N[LI] || {})[group]; const v = g ? g[key] : undefined; return v === undefined ? fallback : v; }
function F(k, vals) { let s = T(k); Object.keys(vals).forEach(x => { s = s.split('{' + x + '}').join(vals[x]); }); return s; }
function LOC() { return LOCALE[LI] || 'en-GB'; }
function NUM(n) { try { return Number(n).toLocaleString(LOC()); } catch (e) { return String(n); } }
I18N.en = {
  div_short:{ "Women's strawweight":'W. straw', "Women's flyweight":'W. fly', "Women's bantamweight":'W. bantam', 'Light heavyweight':'Light heavy' },
  rarity_uncommon:'Uncommon', rank_champ:'Champion', rank_unranked:'Unranked',
  p_filter_all:'All', p_owned_on:'Owned only', p_owned_off:'Show all',
  p_tier_rule:'Champion = Legendary · #1\u20135 Elite · #6\u201310 Rare · #11\u201315 Uncommon · unranked Common',
  t_placeholder_intel:'', f_intel:'Tale of the tape', f_intel_src:'Career record · licensed data',
  f_last5:'Last 5', f_win_methods:'How they win', f_ko:'KO / TKO', f_sub:'Submission', f_dec:'Decision',
  form_w:'W', form_l:'L', form_note:'{w}–{l} in the last five', record_word:'Record',
  p_title:'Fighter cards', p_sub:'Packs come from settled cards. Every ranked fighter on the roster is in the pool.', p_synced:'Official UFC board · 8 Aug 2026',
  p_roster:'Your roster', p_footer:'Card art is abstract graphic artwork generated per fighter — not a photograph and not a likeness of anyone. Fighter cards are cosmetic collectables: they cannot be bought, sold, traded or exchanged for anything, and they have no effect on scoring.',
  pack_word:'PACK', pack_chip_ready:'{n} packs ready', pack_chip_ready_one:'1 pack ready', pack_chip_cards:'{n} fighter cards', pack_x_sealed:'{n} sealed',
  pack_none_tag:'No packs right now', pack_ready_note:'Every settled card earns a pack — two if you clear more than half the bouts.',
  pack_none_note:'Sit through the next card and a pack lands here at settlement.',
  pack_open_cta:'Open a pack', pack_locked_cta:'Nothing to open',
  reveal_new_tag:'New card', reveal_dupe_tag:'Duplicate',
  reveal_new_note:'{r} pull, added to your roster.', reveal_dupe_note:'You already had this one — now ×{n}. Duplicates convert to +25 ranking points.',
  roster_count:'{a} of {b} collected',
  rarity_common:'Common', rarity_rare:'Rare', rarity_elite:'Elite', rarity_legend:'Legend', rarity_locked:'—',
  r_unlocked:'Collectable unlocked', r_missed:'No collectable this week', r_weekly_bonus:'Weekly bonus',
  tier_contender:'Contender', tier_sharp:'Sharp', tier_flawless:'Flawless', locked_token:'Locked',
  unlock_note_win:'You called {a} of {b} right — over half the card. That is +{p} ranking points and the {e} token, added to your collection.',
  unlock_note_miss:'You needed {n} of {b} to clear the week. Points from correct picks still count, but the token stays locked.',
  streak_label:'{n}-week streak · {e} tokens', streak_none:'Streak broken · pick again',
  m_collection:'Collection', sc_weekly:'Over half the card',
  m_collection_note:'One token per card. Clear more than half the bouts and it unlocks: +100 for the majority, +250 from eighty per cent, +500 for the lot. Tokens are cosmetic and cannot be traded or sold.',
  w_hero:'Call the fights. Settle it properly.',
  w_blurb:"One private group, one card at a time. Pick the winner, go deeper if you're brave, and let the leaderboard do the arguing.",
  w_display_name:'Display name', w_name_ph:'Pick a name', w_continue:'Continue',
  w_no_email:'No email, no recovery',
  w_no_email_body:'Your account lives on this device. Lose the phone and the points go with it — that is the whole security model, honestly.',
  w_legal_tail:'By continuing you accept the', w_terms:'terms', w_and:'and', w_privacy:'privacy notice',
  legal_short:'Unofficial friends game, not affiliated with any promotion. Virtual points are not redeemable or transferable and have no monetary value.',
  h_bouts_note:'11 bouts, all scored. Picks lock at the first bell of the early prelims.',
  change:'Change', h_full_card:'Full card · bout order', vs:'vs', h_add_pick:'Add your pick',
  no_pick_pts:'No pick · 0 pts', standings:'Standings', members:'8 members', invite_code:'Invite code',
  c_title:'Fight cards', c_demo_skip:'Demo · skip a week', c_today:'Today', c_open_now:'Open now',
  c_coming:'Coming up · next three', c_7days:'7 days out', c_results:'Results · last five', c_newest:'Newest first',
  c_footer:"When a card finishes it leaves the open slot, moves into results and next Saturday's event takes its place. Bouts import seven days out. Names and schedules come from a permissioned source — no photos, no odds.",
  f_deeper:'Go deeper — optional', f_finish_type:'Finish type', f_round:'Round', f_bonus:'Bonus call',
  f_leaning:'How the group is leaning',
  f_footer:'Predictions are for fun. No odds, no cash-out, no purchases. Virtual points have no cash value.',
  f_your_call:'Your call', f_max:'Max',
  cf_max_haul:'Maximum haul', cf_your_slate:'Your slate', cf_scoring:'Scoring, plainly',
  sc_winner:'Winner', sc_exact_round:'Exact round', sc_wrong_winner:'Wrong winner',
  cf_rules_footer:'Rule set v1. Change it mid-season and past cards keep the version they were scored under. Nothing here costs anything and nothing pays out.',
  back:'Back',
  m_title:'My picks', m_sub:"Every call you've made, and what it cost you.",
  m_balance:'Balance', m_hit_rate:'Hit rate', m_rank:'Rank', m_ledger:'Score ledger',
  m_strong:"Where you're strong", m_winner_only:'Winner only',
  m_strong_quip:'You should probably stop calling rounds. You will not stop calling rounds.',
  m_account:'Account', m_user_id:'User ID', m_joined:'Joined', m_report:'Report a problem',
  m_delete:'Delete account and points', m_delete_note:'Deletion removes your picks, name and score. It cannot be undone and there is no recovery.',
  m_language:'Language',
  r_correct:'Correct', r_points_won:'Points won', r_bout_by_bout:'Bout by bout',
  r_you_said:'You said', r_result:'Result', r_chat:'Group chat, summarised',
  r_flag_q:'Spot a mistake?', r_flag_it:'Flag it', r_flag_tail:'and the card is re-settled under the same rule version.',
  n_this_card:'This card', n_cards:'Cards', n_my_picks:'My picks',
  name_min:'Two characters minimum. Be reasonable.', name_free:'is free in this group',
  locked_caps:'LOCKED', picks_are_in:'Picks are in', picks_lock_in_label:'Picks lock in',
  locked_first_bell:'Locked at first bell', picks_lock_in:'Picks lock in',
  deeper_locked:'Locked — these are the calls that count.',
  deeper_open:'More detail, more points — and more ways to be spectacularly wrong',
  hint_locked:'Locked at first bell. On the record for good.',
  hint_open:'Editable until first bell. After that it stands.',
  hint_pick_first:'Pick a winner first — everything else is optional.',
  hero_settled:'Card settled', hero_locked:'Locked · first bell soon', hero_open:"Tonight's card is open",
  cta_review:'Review your slate', cta_confirm:'Confirm your slate', cta_finish:'Finish your {n} picks',
  bouts_picked:'bouts picked', locked_word:'locked',
  times_in:'Times shown in', early_prelims:'Early prelims', prelims:'Prelims', main_card:'Main card',
  today:'Today', rolls_sat:'the list rolls every Saturday night',
  picks_locked_n:'Picks locked · {a} of {b}', picks_open_n:'Picks open · {a} of {b} picked',
  imports_in_days:'Card imports {n} days from now', imported_open:'Card imported · picks open now',
  imports_days_note:'Card imports in {n} days', imported_opens:'Card imported · opens with the group',
  next_after:'Next after this: {x}. Cards import seven days out.',
  done_next:'UFC 330 is done and has moved into results. Up next: {x} — {v}.',
  schedule_tba:'schedule TBA',
  settled_you_went:'Settled · you went {a} / {b} · +{p} pts',
  awaiting_settle:'Awaiting settlement — the admin enters results',
  you_went:'You went {s} · {p} pts', before_scoring:'Before your group started scoring',
  badge_settled:'Settled', badge_awaiting:'Awaiting results', badge_official:'Official results in', badge_totals:'Totals only', badge_not_scored:'Not scored',
  standings_after:'Standings after settlement', points_on_card:'Points won on this card',
  rds:'rds', rounds_word:'rounds', bouts_word:'bouts', bout_x_of_y:'Bout {a} of {b}',
  card_note_locked:'Locked in bout order — early prelims through the main event.',
  card_note_open:'Pick every bout, early prelims through the main event.',
  nothing_yet:'Nothing yet — 0 pts', no_pick:'No pick',
  locked_in:'Locked in', your_pick:'Your pick', not_picked:'Not picked', tap_to_pick:'Tap to pick',
  nothing_called:'Nothing called yet', to_win:'to win', r_abbr:'R',
  save_locked:'Locked at first bell', save_review:'Save and review slate', save_next:'Save and next bout',
  confirm_locked:'Locked · no changes', confirm_all_in:'All {n} picks in', confirm_partial:'{a} of {b} in',
  confirm_head_locked:"That's your slate. Live with it.", confirm_head_all:"That's your slate. No takebacks after first bell.", confirm_head_partial:'Nearly there.',
  confirm_blurb_locked:'Locked at first bell and scored the moment results are verified.',
  confirm_blurb_open:'You can edit any bout until the first bell. After that the slate is on the record and the group can see every call.',
  confirm_cta_locked:'Back to the card', confirm_cta_open:'Lock in my slate',
  lock_note_locked:'Locked · editable never', lock_note_open:'Editable until first bell',
  settled_word:'settled', locked_word2:'locked', in_progress:'in progress',
  recap_sim:'Demo settlement · simulated results', recap_official:'Settled · official results', recap_totals:'Settled · totals only',
  recap_sim_blurb:'Simulated settlement for this test build: the admin enters results, the system settles every locked pick and the ledger updates immediately.',
  recap_quip_good:'You had a night. Bea has gone quiet, which is the highest compliment available.',
  recap_quip_bad:'Rough one. Nico, who picked nothing, technically finished ahead of your worst bout.',
  audit_sim:'Simulated results for this test build — these outcomes are not real. In production the admin enters or verifies each result and the system settles every locked pick.',
  audit_real:'Official results, entered by the group admin and kept in an audit log.',
  demo_word:'demo', copy_invite:'Copy invite link', copied:'Copied to clipboard',
  demo_reset:'Demo · reset', demo_settle:'Demo · settle results', demo_lock:'Demo · lock picks',
  you:'You', last_settled:'Last settled', you_went_short:'You went {a} / {b}',
  last_note_sim:'+{p} pts from the simulated settlement. Bea took 210 off the same card and still leads overall.',
  last_note_real:'+280 pts. Bea called the Salkilld submission and has mentioned it eleven times since.'
};
I18N.pt = {
  div_short:{ 'Flyweight':'Mosca', 'Bantamweight':'Galo', 'Featherweight':'Pena', 'Lightweight':'Leve', 'Welterweight':'Meio-médio', 'Middleweight':'Médio', 'Light heavyweight':'Meio-pesado', 'Heavyweight':'Pesado', "Women's strawweight":'Palha (F)', "Women's flyweight":'Mosca (F)', "Women's bantamweight":'Galo (F)' },
  rarity_uncommon:'Incomum', rank_champ:'Campeão', rank_unranked:'Sem ranking',
  p_filter_all:'Todos', p_owned_on:'Só os meus', p_owned_off:'Mostrar todos',
  p_tier_rule:'Campeão = Lenda · #1\u20135 Elite · #6\u201310 Raro · #11\u201315 Incomum · sem ranking Comum',
  f_intel:'Comparativo', f_intel_src:'Cartel na carreira · dados licenciados',
  f_last5:'Últimas 5', f_win_methods:'Como ele vence', f_ko:'KO / TKO', f_sub:'Finalização', f_dec:'Decisão',
  form_w:'V', form_l:'D', form_note:'{w}–{l} nas últimas cinco', record_word:'Cartel',
  p_title:'Cards de lutador', p_sub:'Os pacotes vêm dos cards apurados. Todo lutador ranqueado está no pool.', p_synced:'Ranking oficial do UFC · 8 ago 2026',
  p_roster:'Seu plantel', p_footer:'A arte dos cards é gráfica e abstrata, gerada por lutador — não é uma foto nem a imagem de ninguém. Os cards são colecionáveis cosméticos: não podem ser comprados, vendidos, trocados nem convertidos em nada, e não afetam a pontuação.',
  pack_word:'PACOTE', pack_chip_ready:'{n} pacotes prontos', pack_chip_ready_one:'1 pacote pronto', pack_chip_cards:'{n} cards de lutador', pack_x_sealed:'{n} fechado',
  pack_none_tag:'Nenhum pacote agora', pack_ready_note:'Cada card apurado dá um pacote — dois se você acertar mais da metade das lutas.',
  pack_none_note:'Espere o próximo card: o pacote aparece aqui na apuração.',
  pack_open_cta:'Abrir um pacote', pack_locked_cta:'Nada para abrir',
  reveal_new_tag:'Card novo', reveal_dupe_tag:'Repetido',
  reveal_new_note:'Saiu um {r} e ele entrou no seu plantel.', reveal_dupe_note:'Você já tinha esse — agora ×{n}. Repetidos viram +25 pontos de ranking.',
  roster_count:'{a} de {b} colecionados',
  rarity_common:'Comum', rarity_rare:'Raro', rarity_elite:'Elite', rarity_legend:'Lenda', rarity_locked:'—',
  r_unlocked:'Item desbloqueado', r_missed:'Sem item nesta semana', r_weekly_bonus:'Bônus semanal',
  tier_contender:'Aspirante', tier_sharp:'Certeiro', tier_flawless:'Perfeito', locked_token:'Bloqueado',
  unlock_note_win:'Você acertou {a} de {b} — mais da metade do card. São +{p} pontos de ranking e o item {e}, adicionado à sua coleção.',
  unlock_note_miss:'Você precisava de {n} de {b} para fechar a semana. Os pontos dos acertos continuam valendo, mas o item fica bloqueado.',
  streak_label:'sequência de {n} semanas · {e} itens', streak_none:'Sequência quebrada · palpite de novo',
  m_collection:'Coleção', sc_weekly:'Mais da metade do card',
  m_collection_note:'Um item por card. Acerte mais da metade das lutas e ele desbloqueia: +100 pela maioria, +250 a partir de oitenta por cento, +500 se acertar tudo. Os itens são cosméticos e não podem ser trocados nem vendidos.',
  w_hero:'Chute as lutas. Resolva na tabela.',
  w_blurb:'Um grupo privado, um card por vez. Escolha o vencedor, detalhe se tiver coragem, e deixe a classificação discutir por você.',
  w_display_name:'Nome de exibição', w_name_ph:'Escolha um nome', w_continue:'Continuar',
  w_no_email:'Sem e-mail, sem recuperação',
  w_no_email_body:'Sua conta vive neste aparelho. Perdeu o celular, perdeu os pontos — esse é todo o modelo de segurança, sinceramente.',
  w_legal_tail:'Ao continuar, você aceita os', w_terms:'termos', w_and:'e', w_privacy:'aviso de privacidade',
  legal_short:'Jogo informal entre amigos, sem vínculo com nenhuma organização. Os pontos são virtuais, não podem ser resgatados nem transferidos e não têm valor monetário.',
  h_bouts_note:'11 lutas, todas valendo pontos. Os palpites travam no primeiro gongo das preliminares iniciais.',
  change:'Alterar', h_full_card:'Card completo · ordem das lutas', vs:'vs', h_add_pick:'Faça seu palpite',
  no_pick_pts:'Sem palpite · 0 pts', standings:'Classificação', members:'8 membros', invite_code:'Código de convite',
  c_title:'Cards de luta', c_demo_skip:'Demo · avançar 1 semana', c_today:'Hoje', c_open_now:'Aberto agora',
  c_coming:'A seguir · próximos três', c_7days:'7 dias antes', c_results:'Resultados · últimos cinco', c_newest:'Mais recentes primeiro',
  c_footer:'Quando um card termina, ele sai da vaga aberta, vai para os resultados e o evento do sábado seguinte assume o lugar. As lutas são importadas sete dias antes. Nomes e datas vêm de uma fonte licenciada — sem fotos, sem odds.',
  f_deeper:'Detalhe mais — opcional', f_finish_type:'Tipo de vitória', f_round:'Round', f_bonus:'Palpite bônus',
  f_leaning:'Para onde o grupo está indo',
  f_footer:'Palpites são por diversão. Sem odds, sem saque, sem compras. Os pontos virtuais não têm valor em dinheiro.',
  f_your_call:'Seu palpite', f_max:'Máx',
  cf_max_haul:'Máximo possível', cf_your_slate:'Seus palpites', cf_scoring:'Pontuação, sem rodeios',
  sc_winner:'Vencedor', sc_exact_round:'Round exato', sc_wrong_winner:'Vencedor errado',
  cf_rules_footer:'Regras v1. Se mudarem no meio da temporada, os cards antigos ficam na versão em que foram pontuados. Nada aqui custa nada e nada paga nada.',
  back:'Voltar',
  m_title:'Meus palpites', m_sub:'Cada palpite que você fez, e o que ele te custou.',
  m_balance:'Saldo', m_hit_rate:'Acerto', m_rank:'Posição', m_ledger:'Histórico de pontos',
  m_strong:'Onde você é forte', m_winner_only:'Só o vencedor',
  m_strong_quip:'Você deveria parar de chutar rounds. Você não vai parar de chutar rounds.',
  m_account:'Conta', m_user_id:'ID de usuário', m_joined:'Entrou em', m_report:'Relatar um problema',
  m_delete:'Excluir conta e pontos', m_delete_note:'A exclusão remove seus palpites, seu nome e sua pontuação. Não há como desfazer nem recuperar.',
  m_language:'Idioma',
  r_correct:'Acertos', r_points_won:'Pontos ganhos', r_bout_by_bout:'Luta por luta',
  r_you_said:'Você disse', r_result:'Resultado', r_chat:'Resumo do grupo',
  r_flag_q:'Achou um erro?', r_flag_it:'Reporte', r_flag_tail:'e o card é recalculado com a mesma versão das regras.',
  n_this_card:'Este card', n_cards:'Cards', n_my_picks:'Palpites',
  name_min:'Mínimo de dois caracteres. Seja razoável.', name_free:'está livre neste grupo',
  locked_caps:'TRAVADO', picks_are_in:'Palpites enviados', picks_lock_in_label:'Palpites travam em',
  locked_first_bell:'Travado no primeiro gongo', picks_lock_in:'Travam em',
  deeper_locked:'Travado — estes são os palpites que valem.',
  deeper_open:'Mais detalhe, mais pontos — e mais formas de errar feio',
  hint_locked:'Travado no primeiro gongo. Fica registrado para sempre.',
  hint_open:'Editável até o primeiro gongo. Depois disso, vale.',
  hint_pick_first:'Escolha um vencedor primeiro — o resto é opcional.',
  hero_settled:'Card encerrado', hero_locked:'Travado · gongo em instantes', hero_open:'O card de hoje está aberto',
  cta_review:'Revisar seus palpites', cta_confirm:'Confirmar seus palpites', cta_finish:'Complete seus {n} palpites',
  bouts_picked:'lutas palpitadas', locked_word:'travado',
  times_in:'Horários em', early_prelims:'Prelim. iniciais', prelims:'Preliminares', main_card:'Card principal',
  today:'Hoje', rolls_sat:'a lista gira todo sábado à noite',
  picks_locked_n:'Palpites travados · {a} de {b}', picks_open_n:'Palpites abertos · {a} de {b} feitos',
  imports_in_days:'Card é importado em {n} dias', imported_open:'Card importado · palpites abertos',
  imports_days_note:'Card é importado em {n} dias', imported_opens:'Card importado · abre com o grupo',
  next_after:'Depois deste: {x}. Os cards são importados sete dias antes.',
  done_next:'UFC 330 terminou e foi para os resultados. A seguir: {x} — {v}.',
  schedule_tba:'calendário a definir',
  settled_you_went:'Encerrado · você fez {a} de {b} · +{p} pts',
  awaiting_settle:'Aguardando apuração — o admin insere os resultados',
  you_went:'Você fez {s} · {p} pts', before_scoring:'Antes do grupo começar a pontuar',
  badge_settled:'Encerrado', badge_awaiting:'Aguardando resultados', badge_official:'Resultados oficiais', badge_totals:'Só totais', badge_not_scored:'Não pontuado',
  standings_after:'Classificação após a apuração', points_on_card:'Pontos ganhos neste card',
  rds:'rds', rounds_word:'rounds', bouts_word:'lutas', bout_x_of_y:'Luta {a} de {b}',
  card_note_locked:'Travado na ordem das lutas — das preliminares iniciais à luta principal.',
  card_note_open:'Palpite em todas as lutas, das preliminares iniciais à luta principal.',
  nothing_yet:'Nada ainda — 0 pts', no_pick:'Sem palpite',
  locked_in:'Travado', your_pick:'Seu palpite', not_picked:'Sem palpite', tap_to_pick:'Toque para escolher',
  nothing_called:'Nenhum palpite ainda', to_win:'para vencer', r_abbr:'R',
  save_locked:'Travado no primeiro gongo', save_review:'Salvar e revisar', save_next:'Salvar e próxima luta',
  confirm_locked:'Travado · sem alterações', confirm_all_in:'Todos os {n} palpites enviados', confirm_partial:'{a} de {b} enviados',
  confirm_head_locked:'Esses são seus palpites. Conviva com eles.', confirm_head_all:'Esses são seus palpites. Sem volta depois do gongo.', confirm_head_partial:'Quase lá.',
  confirm_blurb_locked:'Travado no primeiro gongo e apurado assim que os resultados forem verificados.',
  confirm_blurb_open:'Você pode editar qualquer luta até o primeiro gongo. Depois disso a lista fica registrada e o grupo vê cada palpite.',
  confirm_cta_locked:'Voltar ao card', confirm_cta_open:'Travar meus palpites',
  lock_note_locked:'Travado · não editável', lock_note_open:'Editável até o primeiro gongo',
  settled_word:'encerrado', locked_word2:'travado', in_progress:'em andamento',
  recap_sim:'Apuração demo · resultados simulados', recap_official:'Encerrado · resultados oficiais', recap_totals:'Encerrado · só totais',
  recap_sim_blurb:'Apuração simulada para este teste: o admin insere os resultados, o sistema apura cada palpite travado e o histórico atualiza na hora.',
  recap_quip_good:'Você teve uma grande noite. A Bea ficou quieta, o que é o maior elogio possível.',
  recap_quip_bad:'Noite difícil. O Nico, que não palpitou nada, tecnicamente ficou na frente da sua pior luta.',
  audit_sim:'Resultados simulados para este teste — não são reais. Em produção o admin insere ou verifica cada resultado e o sistema apura os palpites travados.',
  audit_real:'Resultados oficiais, inseridos pelo admin do grupo e guardados em log de auditoria.',
  demo_word:'demo', copy_invite:'Copiar link de convite', copied:'Copiado',
  demo_reset:'Demo · reiniciar', demo_settle:'Demo · apurar resultados', demo_lock:'Demo · travar palpites',
  you:'Você', last_settled:'Último encerrado', you_went_short:'Você fez {a} de {b}',
  last_note_sim:'+{p} pts da apuração simulada. A Bea tirou 210 do mesmo card e continua na frente.',
  last_note_real:'+280 pts. A Bea cravou a finalização do Salkilld e já mencionou isso onze vezes.',
  slot:{ 'Early prelims':'Preliminares iniciais', 'Prelims':'Preliminares', 'Main card':'Card principal', 'Main card · co-main':'Card principal · co-main', 'Main card · main event':'Card principal · luta principal' },
  div:{ 'Flyweight':'Peso mosca', 'Bantamweight':'Peso galo', 'Featherweight':'Peso pena', 'Heavyweight':'Peso pesado', "Women's strawweight":'Peso palha feminino', "Women's flyweight":'Peso mosca feminino', "Women's bantamweight":'Peso galo feminino', 'Welterweight':'Peso meio-médio', 'Light heavyweight':'Meio-pesado', 'Middleweight':'Peso médio', 'Lightweight':'Peso leve', 'Strawweight':'Peso palha', "Women's strawweight title":'Cinturão peso palha feminino', 'Welterweight title':'Cinturão peso meio-médio', 'Welterweight champion':'Campeão peso meio-médio', 'Strawweight champion':'Campeã peso palha', 'Welterweight · #1':'Peso meio-médio · nº1', 'Strawweight · #5':'Peso palha · nº5' },
  method:{ 'KO / TKO':'KO / TKO', 'Submission':'Finalização', 'Decision':'Decisão', 'Skip':'Pular' },
  mshort:{ 'KO / TKO':'KO', 'Submission':'FIN', 'Decision':'DEC' },
  bonus:{ 'A takedown lands':'Sai uma queda', 'A knockdown lands':'Sai um knockdown', 'Skip':'Pular' },
  form:{ 'Record pending feed':'Cartel pendente da fonte', 'Veteran':'Veterano', 'Welterweight champion':'Campeão meio-médio', 'Challenger · ranked #2':'Desafiante · nº2 do ranking', 'Strawweight champion':'Campeã peso palha', 'Challenger · ranked #4':'Desafiante · nº4 do ranking' },
  quip:{
    b1:'Seis de oito no Orolbai. Os outros dois ainda não abriram o app.',
    b2:'O especial do Magny: três rounds, zero fogos, e todo mundo brigando pelos cartões.',
    b3:'Ninguém neste grupo viu nenhum dos dois lutar. Os palpites foram feitos do mesmo jeito.',
    b4:'Empatado em quatro a quatro. Alguém vai ficar muito insuportável com essa.',
    b5:'A Bea foi na zebra outra vez. A Bea já acertou esse tipo de coisa antes.',
    b6:'Alcance contra pressão, e o grupo escolheu alcance cinco vezes em oito.',
    b7:'Todos querem o finalizador. Ninguém concorda sobre qual dos dois é.',
    b8:'O coração diz Barboza. Cinco de oito foram com a cabeça.',
    b9:'Sete de oito no Abdul-Malik. O Nico não palpitou, porque Nico é Nico.',
    b10:'Duas grapplers, então claro que a discussão é se a luta vai pro chão.',
    b11:'Seis de oito no campeão. O Marek aposta na zebra e já avisou todo mundo duas vezes.'
  },
  psub:{
    fn284:'UFC Fight Night 284 · encerrado em 09 ago sob as regras v1. Resultados oficiais inseridos pelo admin.',
    e801:'UFC Fight Night · encerrado em 02 ago. Seis lutas pontuadas à mão; só os totais entraram no histórico.',
    e725:'UFC Fight Night · encerrado em 26 jul. Pontuado à mão, só totais.',
    e718:'UFC Fight Night · encerrado em 19 jul. Pontuado à mão, só totais.',
    ufc329:'McGregor vs. Holloway 2 · o primeiro card que o grupo pontuou, encerrado em 12 jul.'
  },
  pquip:{
    fn284:'O Salkilld finalizou o Gamrot em menos de cinco minutos e a Bea, que cravou, já mencionou isso onze vezes.',
    e801:'O Marek finalmente teve uma noite. Ouvimos falar do card de Belgrado desde então.',
    e725:'Começar ao meio-dia fez três pessoas palpitarem da cama e uma esquecer completamente.',
    e718:'Sua melhor noite da temporada, e ninguém deixou você esquecer que foi mais sorte que técnica.',
    ufc329:'Oito pessoas, um grupo de mensagens, nenhuma regra escrita ainda. E deu para notar.'
  },
  pnote:{
    e801:'Os resultados luta por luta nunca foram importados para este card — o grupo apurou à mão e só os totais entraram no histórico.',
    e725:'Os resultados luta por luta nunca foram importados para este card — o grupo apurou à mão e só os totais entraram no histórico.',
    e718:'Os resultados luta por luta nunca foram importados para este card — o grupo apurou à mão e só os totais entraram no histórico.',
    ufc329:'Os resultados luta por luta nunca foram importados para este card — o grupo apurou à mão e só os totais entraram no histórico.'
  },
  arow:{
    'fn2840s':'Gamrot · FIN · R2', 'fn2840r':'Salkilld · Finalização (mata-leão) · R1',
    'fn2841s':'Ferreira · DEC', 'fn2841r':'Ferreira · Decisão unânime',
    'fn2842s':'del Valle · KO · R1', 'fn2842r':'del Valle · TKO · R1',
    'fn2843s':'Lemos · DEC', 'fn2843r':'Thainara · Decisão unânime',
    'fn2844s':'Miller · KO · R2', 'fn2844r':'Miller · TKO · R3'
  },
  arowslot:{ 'Main event · Lightweight':'Luta principal · Peso leve', 'Co-main · Lightweight':'Co-main · Peso leve', 'Bout 3 · Featherweight':'Luta 3 · Peso pena', 'Bout 4 · Strawweight':'Luta 4 · Peso palha', 'Bout 5 · Welterweight':'Luta 5 · Peso meio-médio' },
  lwhat:{ 0:'Gamrot vs. Salkilld encerrado', 1:'UFC 329 encerrado', 2:'Palpite de round errado', 3:'Saldo de boas-vindas' },
  ldetail:{ 0:'3 de 5 corretos', 1:'5 de 6 corretos', 2:'Chutou R2, acabou no R1', 3:'Conta nova' }
};
I18N.ru = {
  div_short:{ 'Flyweight':'Мухач', 'Bantamweight':'Лёгчайший', 'Featherweight':'Полулёгкий', 'Lightweight':'Лёгкий', 'Welterweight':'Полусредний', 'Middleweight':'Средний', 'Light heavyweight':'Полутяж', 'Heavyweight':'Тяжёлый', "Women's strawweight":'Мин. (Ж)', "Women's flyweight":'Мухач (Ж)', "Women's bantamweight":'Лёгчайший (Ж)' },
  rarity_uncommon:'Необычный', rank_champ:'Чемпион', rank_unranked:'Без рейтинга',
  p_filter_all:'Все', p_owned_on:'Только мои', p_owned_off:'Показать всех',
  p_tier_rule:'Чемпион = Легенда · №1\u20135 Элита · №6\u201310 Редкий · №11\u201315 Необычный · без рейтинга Обычный',
  f_intel:'Сравнение бойцов', f_intel_src:'Рекорд карьеры · лицензированные данные',
  f_last5:'Последние 5', f_win_methods:'Как побеждает', f_ko:'КО / ТКО', f_sub:'Сабмишн', f_dec:'Решение',
  form_w:'П', form_l:'Пр', form_note:'{w}–{l} в последних пяти', record_word:'Рекорд',
  p_title:'Карточки бойцов', p_sub:'Паки приходят за рассчитанные карды. В пуле весь ранкед-ростер.', p_synced:'Официальный рейтинг UFC · 8 авг 2026',
  p_roster:'Твой ростер', p_footer:'Оформление карточек — абстрактная графика, сгенерированная для каждого бойца: это не фотография и не чей-либо образ. Карточки косметические: их нельзя купить, продать, обменять или на что-то конвертировать, и они не влияют на подсчёт очков.',
  pack_word:'ПАК', pack_chip_ready:'паков готово: {n}', pack_chip_ready_one:'1 пак готов', pack_chip_cards:'карточек: {n}', pack_x_sealed:'{n} закрыт',
  pack_none_tag:'Паков пока нет', pack_ready_note:'За каждый рассчитанный кард — пак, а за больше половины боёв — два.',
  pack_none_note:'Дождись следующего карда: пак придёт при расчёте.',
  pack_open_cta:'Открыть пак', pack_locked_cta:'Открывать нечего',
  reveal_new_tag:'Новая карточка', reveal_dupe_tag:'Дубликат',
  reveal_new_note:'Выпал {r} — карточка в ростере.', reveal_dupe_note:'Такая уже была — теперь ×{n}. Дубликаты превращаются в +25 очков рейтинга.',
  roster_count:'собрано {a} из {b}',
  rarity_common:'Обычный', rarity_rare:'Редкий', rarity_elite:'Элита', rarity_legend:'Легенда', rarity_locked:'—',
  r_unlocked:'Жетон получен', r_missed:'На этой неделе жетона нет', r_weekly_bonus:'Недельный бонус',
  tier_contender:'Претендент', tier_sharp:'Точный', tier_flawless:'Безупречный', locked_token:'Не получен',
  unlock_note_win:'Ты угадал {a} из {b} — больше половины карда. Это +{p} очков рейтинга и жетон «{e}» в коллекцию.',
  unlock_note_miss:'Чтобы закрыть неделю, нужно было {n} из {b}. Очки за верные прогнозы остаются, но жетон не выдаётся.',
  streak_label:'серия {n} нед. · жетонов: {e}', streak_none:'Серия прервана · пробуй снова',
  m_collection:'Коллекция', sc_weekly:'Больше половины карда',
  m_collection_note:'По одному жетону за кард. Угадай больше половины боёв — и он открывается: +100 за большинство, +250 с восьмидесяти процентов, +500 за полный кард. Жетоны косметические, их нельзя обменять или продать.',
  w_hero:'Называй исходы. Спорь по таблице.',
  w_blurb:'Одна закрытая группа, один кард за раз. Выбери победителя, углубись, если смелый, а спорить пусть таблица.',
  w_display_name:'Отображаемое имя', w_name_ph:'Придумай имя', w_continue:'Далее',
  w_no_email:'Без почты — без восстановления',
  w_no_email_body:'Аккаунт живёт на этом устройстве. Потеряешь телефон — потеряешь очки. Вот и вся модель безопасности, честно.',
  w_legal_tail:'Продолжая, ты принимаешь', w_terms:'условия', w_and:'и', w_privacy:'политику конфиденциальности',
  legal_short:'Неофициальная игра для друзей, без связи с какой-либо организацией. Очки виртуальные: их нельзя обменять или передать, у них нет денежной ценности.',
  h_bouts_note:'11 боёв, все в зачёт. Прогнозы закрываются с первым гонгом ранних прелимов.',
  change:'Изменить', h_full_card:'Полный кард · порядок боёв', vs:'против', h_add_pick:'Добавь прогноз',
  no_pick_pts:'Нет прогноза · 0 очк.', standings:'Таблица', members:'8 участников', invite_code:'Код приглашения',
  c_title:'Кард-события', c_demo_skip:'Демо · +1 неделя', c_today:'Сегодня', c_open_now:'Открыто сейчас',
  c_coming:'Далее · следующие три', c_7days:'за 7 дней', c_results:'Результаты · последние пять', c_newest:'Сначала новые',
  c_footer:'Когда кард заканчивается, он уходит из открытого слота в результаты, а его место занимает событие следующей субботы. Бои подгружаются за семь дней. Имена и расписание — из лицензированного источника: без фото и без коэффициентов.',
  f_deeper:'Углубиться — по желанию', f_finish_type:'Способ победы', f_round:'Раунд', f_bonus:'Бонус-прогноз',
  f_leaning:'Куда склоняется группа',
  f_footer:'Прогнозы ради интереса. Без коэффициентов, без выплат, без покупок. Виртуальные очки не имеют денежной ценности.',
  f_your_call:'Твой прогноз', f_max:'Макс',
  cf_max_haul:'Максимум', cf_your_slate:'Твой список', cf_scoring:'Как считаются очки',
  sc_winner:'Победитель', sc_exact_round:'Точный раунд', sc_wrong_winner:'Неверный победитель',
  cf_rules_footer:'Правила v1. Если поменять их посреди сезона, прошедшие карды остаются на своей версии. Здесь ничего не стоит денег и ничего не выплачивается.',
  back:'Назад',
  m_title:'Мои прогнозы', m_sub:'Все твои прогнозы и чего они стоили.',
  m_balance:'Баланс', m_hit_rate:'Точность', m_rank:'Место', m_ledger:'Журнал очков',
  m_strong:'В чём ты силён', m_winner_only:'Только победитель',
  m_strong_quip:'Тебе бы перестать угадывать раунды. Ты не перестанешь.',
  m_account:'Аккаунт', m_user_id:'ID пользователя', m_joined:'Регистрация', m_report:'Сообщить о проблеме',
  m_delete:'Удалить аккаунт и очки', m_delete_note:'Удаление стирает прогнозы, имя и счёт. Отменить нельзя, восстановить тоже.',
  m_language:'Язык',
  r_correct:'Верно', r_points_won:'Очки за кард', r_bout_by_bout:'Бой за боем',
  r_you_said:'Твой прогноз', r_result:'Результат', r_chat:'Чат группы, кратко',
  r_flag_q:'Нашёл ошибку?', r_flag_it:'Сообщи', r_flag_tail:'и кард пересчитают по той же версии правил.',
  n_this_card:'Этот кард', n_cards:'Карды', n_my_picks:'Прогнозы',
  name_min:'Минимум два символа. Будь разумным.', name_free:'— имя свободно в этой группе',
  locked_caps:'ЗАКРЫТО', picks_are_in:'Прогнозы приняты', picks_lock_in_label:'Закрытие через',
  locked_first_bell:'Закрыто с первым гонгом', picks_lock_in:'Закрытие через',
  deeper_locked:'Закрыто — это и есть зачётные прогнозы.',
  deeper_open:'Больше деталей — больше очков и больше шансов ошибиться',
  hint_locked:'Закрыто с первым гонгом. Теперь это в истории навсегда.',
  hint_open:'Можно менять до первого гонга. Дальше — как есть.',
  hint_pick_first:'Сначала выбери победителя — остальное необязательно.',
  hero_settled:'Кард рассчитан', hero_locked:'Закрыто · гонг вот-вот', hero_open:'Сегодняшний кард открыт',
  cta_review:'Посмотреть свой список', cta_confirm:'Подтвердить список', cta_finish:'Закончи {n} прогнозов',
  bouts_picked:'боёв с прогнозом', locked_word:'закрыто',
  times_in:'Время показано в зоне', early_prelims:'Ранние прелимы', prelims:'Прелимы', main_card:'Основной кард',
  today:'Сегодня', rolls_sat:'список обновляется каждую субботу вечером',
  picks_locked_n:'Прогнозы закрыты · {a} из {b}', picks_open_n:'Прогнозы открыты · {a} из {b} сделано',
  imports_in_days:'Кард подгрузится через {n} дн.', imported_open:'Кард подгружен · прогнозы открыты',
  imports_days_note:'Кард подгрузится через {n} дн.', imported_opens:'Кард подгружен · откроется для группы',
  next_after:'Следующий после этого: {x}. Карды подгружаются за семь дней.',
  done_next:'UFC 330 завершён и ушёл в результаты. Далее: {x} — {v}.',
  schedule_tba:'расписание уточняется',
  settled_you_went:'Рассчитано · у тебя {a} из {b} · +{p} очк.',
  awaiting_settle:'Ждёт расчёта — админ вносит результаты',
  you_went:'У тебя {s} · {p} очк.', before_scoring:'До того, как группа начала считать',
  badge_settled:'Рассчитано', badge_awaiting:'Ждёт результатов', badge_official:'Официальные результаты', badge_totals:'Только итоги', badge_not_scored:'Не считался',
  standings_after:'Таблица после расчёта', points_on_card:'Очки за этот кард',
  rds:'рнд', rounds_word:'раунда', bouts_word:'боёв', bout_x_of_y:'Бой {a} из {b}',
  card_note_locked:'Закрыто в порядке боёв — от ранних прелимов до главного боя.',
  card_note_open:'Дай прогноз на каждый бой — от ранних прелимов до главного боя.',
  nothing_yet:'Пока ничего — 0 очк.', no_pick:'Нет прогноза',
  locked_in:'Закрыто', your_pick:'Твой выбор', not_picked:'Не выбран', tap_to_pick:'Нажми, чтобы выбрать',
  nothing_called:'Прогноза пока нет', to_win:'на победу', r_abbr:'Р',
  save_locked:'Закрыто с первым гонгом', save_review:'Сохранить и просмотреть', save_next:'Сохранить и дальше',
  confirm_locked:'Закрыто · без изменений', confirm_all_in:'Все {n} прогнозов приняты', confirm_partial:'{a} из {b} принято',
  confirm_head_locked:'Это твой список. Живи с ним.', confirm_head_all:'Это твой список. После гонга не переиграть.', confirm_head_partial:'Почти готово.',
  confirm_blurb_locked:'Закрыто с первым гонгом и рассчитывается, как только результаты подтверждены.',
  confirm_blurb_open:'Любой бой можно изменить до первого гонга. Потом список фиксируется, и группа видит каждый прогноз.',
  confirm_cta_locked:'Вернуться к карду', confirm_cta_open:'Закрыть мой список',
  lock_note_locked:'Закрыто · изменить нельзя', lock_note_open:'Можно менять до первого гонга',
  settled_word:'рассчитан', locked_word2:'закрыт', in_progress:'в процессе',
  recap_sim:'Демо-расчёт · смоделированные результаты', recap_official:'Рассчитано · официальные результаты', recap_totals:'Рассчитано · только итоги',
  recap_sim_blurb:'Смоделированный расчёт для этой тестовой сборки: админ вносит результаты, система считает каждый закрытый прогноз, журнал обновляется сразу.',
  recap_quip_good:'Твой вечер. Беа замолчала — это высшая похвала из доступных.',
  recap_quip_bad:'Тяжёлый вечер. Нико, который вообще не делал прогнозов, формально обошёл твой худший бой.',
  audit_sim:'Смоделированные результаты для тестовой сборки — они не настоящие. В продакшене админ вносит или проверяет каждый результат, и система считает все закрытые прогнозы.',
  audit_real:'Официальные результаты, внесённые админом группы и сохранённые в журнале аудита.',
  demo_word:'демо', copy_invite:'Скопировать приглашение', copied:'Скопировано',
  demo_reset:'Демо · сброс', demo_settle:'Демо · внести результаты', demo_lock:'Демо · закрыть прогнозы',
  you:'Ты', last_settled:'Последний рассчитанный', you_went_short:'У тебя {a} из {b}',
  last_note_sim:'+{p} очк. по смоделированному расчёту. Беа взяла 210 с того же карда и всё ещё впереди.',
  last_note_real:'+280 очк. Беа предсказала сабмишн Салкилда и напомнила об этом одиннадцать раз.',
  slot:{ 'Early prelims':'Ранние прелимы', 'Prelims':'Прелимы', 'Main card':'Основной кард', 'Main card · co-main':'Основной кард · ко-мейн', 'Main card · main event':'Основной кард · главный бой' },
  div:{ 'Flyweight':'Мужской мухач', 'Bantamweight':'Лёгчайший вес', 'Featherweight':'Полулёгкий вес', 'Heavyweight':'Тяжёлый вес', "Women's strawweight":'Жен. минимальный вес', "Women's flyweight":'Жен. мухач', "Women's bantamweight":'Жен. лёгчайший вес', 'Welterweight':'Полусредний вес', 'Light heavyweight':'Полутяжёлый вес', 'Middleweight':'Средний вес', 'Lightweight':'Лёгкий вес', 'Strawweight':'Минимальный вес', "Women's strawweight title":'Титул, жен. минимальный вес', 'Welterweight title':'Титул в полусреднем весе', 'Welterweight champion':'Чемпион полусреднего веса', 'Strawweight champion':'Чемпионка минимального веса', 'Welterweight · #1':'Полусредний вес · №1', 'Strawweight · #5':'Минимальный вес · №5' },
  method:{ 'KO / TKO':'КО / ТКО', 'Submission':'Сабмишн', 'Decision':'Решение', 'Skip':'Пропустить' },
  mshort:{ 'KO / TKO':'КО', 'Submission':'САБ', 'Decision':'РЕШ' },
  bonus:{ 'A takedown lands':'Будет тейкдаун', 'A knockdown lands':'Будет нокдаун', 'Skip':'Пропустить' },
  form:{ 'Record pending feed':'Рекорд подгружается', 'Veteran':'Ветеран', 'Welterweight champion':'Чемпион полусреднего веса', 'Challenger · ranked #2':'Претендент · №2 рейтинга', 'Strawweight champion':'Чемпионка минимального веса', 'Challenger · ranked #4':'Претендентка · №4 рейтинга' },
  quip:{
    b1:'Шесть из восьми на Оролбая. Двое остальных ещё не открывали приложение.',
    b2:'Классика Мэгни: три раунда, ноль фейерверков, и все спорят о судейских записках.',
    b3:'Никто в группе не видел ни одного их боя. Прогнозы всё равно сделали.',
    b4:'Ровно четыре на четыре. Кто-то будет невыносимо доволен собой.',
    b5:'Беа снова взяла андердога. Беа в таких вещах уже угадывала.',
    b6:'Дистанция против давления, и группа выбрала дистанцию пять раз из восьми.',
    b7:'Все хотят финишера. Никто не согласен, кто из них финишер.',
    b8:'Сердце говорит Барбоза. Пятеро из восьми пошли за головой.',
    b9:'Семь из восьми на Абдул-Малика. Нико не выбрал, потому что Нико — это Нико.',
    b10:'Две борчихи, поэтому спор, разумеется, о том, дойдёт ли дело до партера.',
    b11:'Шесть из восьми на чемпиона. Марек ставит на сенсацию и уже дважды всем об этом сказал.'
  },
  psub:{
    fn284:'UFC Fight Night 284 · рассчитан 09 авг по правилам v1. Официальные результаты внёс админ.',
    e801:'UFC Fight Night · рассчитан 02 авг. Шесть боёв считали вручную; в журнал попали только итоги.',
    e725:'UFC Fight Night · рассчитан 26 июл. Считали вручную, только итоги.',
    e718:'UFC Fight Night · рассчитан 19 июл. Считали вручную, только итоги.',
    ufc329:'McGregor vs. Holloway 2 · первый кард, который группа считала, рассчитан 12 июл.'
  },
  pquip:{
    fn284:'Салкилд задушил Гамрота меньше чем за пять минут, и Беа, которая это предсказала, напомнила об этом одиннадцать раз.',
    e801:'У Марека наконец случился вечер. Мы слышим про кард в Белграде до сих пор.',
    e725:'Старт в полдень: трое делали прогнозы из постели, а один забыл совсем.',
    e718:'Твой лучший вечер сезона, и никто не даёт забыть, что это была в основном удача.',
    ufc329:'Восемь человек, один чат и ни одного записанного правила. Это было заметно.'
  },
  pnote:{
    e801:'Результаты по боям для этого карда так и не подгрузили — группа считала вручную, и в журнал попали только итоги.',
    e725:'Результаты по боям для этого карда так и не подгрузили — группа считала вручную, и в журнал попали только итоги.',
    e718:'Результаты по боям для этого карда так и не подгрузили — группа считала вручную, и в журнал попали только итоги.',
    ufc329:'Результаты по боям для этого карда так и не подгрузили — группа считала вручную, и в журнал попали только итоги.'
  },
  arow:{
    'fn2840s':'Гамрот · САБ · Р2', 'fn2840r':'Салкилд · Сабмишн (удушение) · Р1',
    'fn2841s':'Феррейра · РЕШ', 'fn2841r':'Феррейра · Единогласное решение',
    'fn2842s':'дель Валье · КО · Р1', 'fn2842r':'дель Валье · ТКО · Р1',
    'fn2843s':'Лемос · РЕШ', 'fn2843r':'Тайнара · Единогласное решение',
    'fn2844s':'Миллер · КО · Р2', 'fn2844r':'Миллер · ТКО · Р3'
  },
  arowslot:{ 'Main event · Lightweight':'Главный бой · Лёгкий вес', 'Co-main · Lightweight':'Ко-мейн · Лёгкий вес', 'Bout 3 · Featherweight':'Бой 3 · Полулёгкий вес', 'Bout 4 · Strawweight':'Бой 4 · Минимальный вес', 'Bout 5 · Welterweight':'Бой 5 · Полусредний вес' },
  lwhat:{ 0:'Gamrot vs. Salkilld рассчитан', 1:'UFC 329 рассчитан', 2:'Раунд не угадан', 3:'Стартовый баланс' },
  ldetail:{ 0:'3 из 5 верно', 1:'5 из 6 верно', 2:'Ставил Р2, закончилось в Р1', 3:'Новый аккаунт' }
};

const TIER_PTS = { contender:100, sharp:250, flawless:500 };
const TIER_META = {
  contender:{ ring:'#e8a33d', bg:'rgba(232,163,61,.14)', ink:'#e8a33d' },
  sharp:{ ring:'#5fc98a', bg:'rgba(95,201,138,.14)', ink:'#5fc98a' },
  flawless:{ ring:'#f0e6c8', bg:'rgba(240,230,200,.16)', ink:'#f0e6c8' }
};
const LOCKED_META = { ring:'rgba(235,235,245,.2)', bg:'rgba(235,235,245,.04)', ink:'rgba(235,235,245,.35)' };
function tierFor(hits, total) {
  if (!total) return null;
  if (hits === total) return 'flawless';
  if (hits / total >= 0.8) return 'sharp';
  if (hits > total / 2) return 'contender';
  return null;
}
const COLLECT = [
  { id:'ufc329', glyph:'329', name:'Vegas Opener', when:'11 Jul', hits:5, of:6 },
  { id:'e718', glyph:'DPU', name:'Oklahoma Run', when:'18 Jul', hits:5, of:7 },
  { id:'e725', glyph:'ANK', name:'Abu Dhabi', when:'25 Jul', hits:3, of:6 },
  { id:'e801', glyph:'MED', name:'Belgrade', when:'1 Aug', hits:4, of:6 },
  { id:'fn284', glyph:'GAM', name:'APEX Choke', when:'8 Aug', hits:3, of:5 }
];

const RARITY = {
  common:{ ring:'rgba(235,235,245,.32)', bg:'#1c1c1e', w:52 },
  uncommon:{ ring:'#5fc98a', bg:'rgba(95,201,138,.12)', w:26 },
  rare:{ ring:'#6ea8ff', bg:'rgba(110,168,255,.12)', w:14 },
  elite:{ ring:'#e8a33d', bg:'rgba(232,163,61,.13)', w:7 },
  legend:{ ring:'#f0e6c8', bg:'rgba(240,230,200,.15)', w:1 }
};
const DIVS = [
  ['Flyweight', ['Joshua Van','Alexandre Pantoja','Manel Kape','Brandon Royval','Tatsuro Taira','Asu Almabayev','Lone\u2019er Kavanagh','Ramazan Temirov','Kyoji Horiguchi','Amir Albazi','Brandon Moreno','Kevin Borjas','Mitch Raposo','Sumudaerji','Alessandro Costa','Alex Perez']],
  ['Bantamweight', ['Petr Yan','Merab Dvalishvili','Umar Nurmagomedov','Sean O\u2019Malley','Mario Bautista','Cory Sandhagen','Song Yadong','David Martinez','Raoni Barcelos','Farid Basharat','Marcus McGhee','Deiveson Figueiredo','Aiemann Zahabi','Charles Jourdain','Bryce Mitchell','Montel Jackson']],
  ['Featherweight', ['Alexander Volkanovski','Movsar Evloev','Diego Lopes','Lerone Murphy','Aljamain Sterling','Arnold Allen','Jean Silva','Pat Sabatini','Nathaniel Wood','Youssef Zalal','Kevin Vallejos','Melquizael Costa','Steve Garcia','Aaron Pico','Jose Miguel Delgado','Joanderson Brito']],
  ['Lightweight', ['Justin Gaethje','Ilia Topuria','Arman Tsarukyan','Charles Oliveira','Max Holloway','Paddy Pimblett','Quillan Salkilld','Renato Moicano','Beno\u00eet Saint Denis','Mateusz Gamrot','Mauricio Ruffy','Tom Nolan','Dan Hooker','Rafael Fiziev','Tofiq Musayev','Grant Dawson']],
  ['Welterweight', ['Islam Makhachev','Carlos Prates','Ian Machado Garry','Michael Morales','Jack Della Maddalena','Sean Brady','Gabriel Bonfim','Belal Muhammad','Leon Edwards','Joaquin Buckley','Uro\u0161 Medi\u0107','Kamaru Usman','Mike Malott','Yaroslav Amosov','Kevin Holland','Daniel Rodriguez']],
  ['Middleweight', ['Sean Strickland','Khamzat Chimaev','Dricus Du Plessis','Nassourdine Imavov','Joe Pyfer','Brendan Allen','Caio Borralho','Anthony Hernandez','Michael Page','Israel Adesanya','Gregory Rodrigues','Christian Leroy Duncan','Ikram Aliskerov','Bo Nickal','Abus Magomedov','Nursulton Ruziboev']],
  ['Light heavyweight', ['Carlos Ulberg','Alex Pereira','Magomed Ankalaev','Ji\u0159\u00ed Proch\u00e1zka','Paulo Costa','Jamahal Hill','Khalil Rountree Jr.','Navajo Stirling','Dominick Reyes','Azamat Murzakanov','Bogdan Guskov','Robert Whittaker','Alonzo Menifield','Johnny Walker','Muhammad Saidov','Iwo Baraniewski']],
  ['Heavyweight', ['Tom Aspinall','Ciryl Gane','Alexander Volkov','Sergei Pavlovich','Rizvan Kuniev','Josh Hokit','Waldo Cortes Acosta','Valter Walker','Serghei Spivac','Curtis Blaydes','Vitor Petrino','Brando Peri\u010di\u0107','Mario Pinto','Mick Parkin','Ryan Spann','Derrick Lewis']],
  ["Women's strawweight", ['Mackenzie Dern','Zhang Weili','Virna Jandiroba','Tatiana Suarez','Gillian Robertson','Yan Xiaonan','Fatima Kline','Alexia Thainara','Piera Rodriguez','Denise Gomes','Mizuki','Loopy Godinez','Tabatha Ricci','Jaqueline Amorim','Amanda Lemos','Talita Alencar']],
  ["Women's flyweight", ['Valentina Shevchenko','Natalia Silva','Manon Fiorot','Alexa Grasso','Erin Blanchfield','Wang Cong','Jasmine Jasudavicius','Rose Namajunas','Maycee Barber','Tracy Cortez','Miranda Maverick','JJ Aldrich','Karine Silva','Eduarda Moura','Casey O\u2019Neill','Gabriella Fernandes']],
  ["Women's bantamweight", ['Kayla Harrison','Joselyne Edwards','Norma Dumont','Luana Santos','Ailin Perez','Julianna Pe\u00f1a','Yana Santos','Jacqueline Cavalcanti','Michelle Montague','Melissa Croden','Karol Rosa','Bia Mesquita','Macy Chiasson','Daria Zhelezniakova','Raquel Pennington','Klaudia Sygula']]
];
const UNRANKED = [
  ['Jeremiah Wells','Welterweight'], ['Myktybek Orolbai','Welterweight'], ['Ramiz Brahimaj','Welterweight'],
  ['Rafael Tobias','Light heavyweight'], ['Lucas Fernando','Light heavyweight'],
  ['Tresean Gore','Middleweight'], ['Donte Johnson','Middleweight'], ['Eric McConico','Middleweight'], ['Dustin Stoltzfus','Middleweight'],
  ['Kau\u00ea Fernandes','Lightweight'], ['Esteban Ribovics','Lightweight'], ['Edson Barboza','Lightweight'],
  ['Chidi Njokuani','Welterweight'], ['Joel \u00c1lvarez','Welterweight'], ['Mansur Abdul-Malik','Middleweight']
];
function slug(n) { return n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function tierFromRank(rank) {
  if (rank === 0) return 'legend';
  if (rank >= 1 && rank <= 5) return 'elite';
  if (rank >= 6 && rank <= 10) return 'rare';
  if (rank >= 11 && rank <= 15) return 'uncommon';
  return 'common';
}
const FIGHTERS = [];
DIVS.forEach(d => d[1].forEach((n, i) => FIGHTERS.push({ id: slug(n), name: n, div: d[0], rank: i, r: tierFromRank(i) })));
UNRANKED.forEach(u => { if (!FIGHTERS.some(x => x.name === u[0])) FIGHTERS.push({ id: slug(u[0]), name: u[0], div: u[1], rank: -1, r: 'common' }); });
const DIV_LIST = DIVS.map(d => d[0]);
const CARD_REC = {
  'Islam Makhachev':'28\u20131\u20130', 'Ian Machado Garry':'17\u20131\u20130', 'Mackenzie Dern':'16\u20135\u20130', 'Gillian Robertson':'15\u20138\u20130',
  'Edson Barboza':'24\u201313\u20130', 'Esteban Ribovics':'14\u20132\u20130', 'Neil Magny':'29\u201313\u20130', 'Vicente Luque':'23\u201310\u20131',
  'Jalin Turner':'15\u20138\u20130', 'Joel \u00c1lvarez':'21\u20133\u20130', 'Mansur Abdul-Malik':'9\u20130\u20130', 'Chidi Njokuani':'23\u20139\u20130',
  'Myktybek Orolbai':'14\u20132\u20131', 'Jeremiah Wells':'12\u20134\u20130', 'Ramiz Brahimaj':'11\u20135\u20130', 'Rafael Tobias':'8\u20131\u20130',
  'Lucas Fernando':'7\u20132\u20130', 'Tresean Gore':'6\u20134\u20130', 'Donte Johnson':'8\u20132\u20130', 'Kau\u00ea Fernandes':'11\u20132\u20130',
  'Dustin Stoltzfus':'15\u20136\u20130', 'Eric McConico':'7\u20133\u20130'
};
const INTEL_BY_NAME = {
  'Islam Makhachev':{ l5:'WWWWW', ko:32, sub:39, dec:29 },
  'Mackenzie Dern':{ l5:'WLWWW', ko:6, sub:69, dec:25 },
  'Ian Machado Garry':{ l5:'WWLWW', ko:35, sub:12, dec:53 },
  'Gillian Robertson':{ l5:'WWLWL', ko:7, sub:60, dec:33 },
  'Edson Barboza':{ l5:'LWLWL', ko:63, sub:8, dec:29 },
  'Neil Magny':{ l5:'WLWLW', ko:24, sub:14, dec:62 },
  'Vicente Luque':{ l5:'WWLWL', ko:52, sub:35, dec:13 },
  'Jalin Turner':{ l5:'LWWLW', ko:60, sub:27, dec:13 },
  'Joel \u00c1lvarez':{ l5:'WWWWL', ko:33, sub:57, dec:10 },
  'Esteban Ribovics':{ l5:'WWWLW', ko:50, sub:21, dec:29 },
  'Mansur Abdul-Malik':{ l5:'WWWWW', ko:67, sub:11, dec:22 },
  'Chidi Njokuani':{ l5:'LWLWW', ko:70, sub:4, dec:26 },
  'Myktybek Orolbai':{ l5:'WWWLW', ko:29, sub:43, dec:28 },
  'Jeremiah Wells':{ l5:'WLWWL', ko:42, sub:25, dec:33 },
  'Ramiz Brahimaj':{ l5:'LWLWL', ko:27, sub:55, dec:18 },
  'Rafael Tobias':{ l5:'WWWWL', ko:50, sub:25, dec:25 },
  'Lucas Fernando':{ l5:'WLWWW', ko:57, sub:14, dec:29 },
  'Tresean Gore':{ l5:'LWLLW', ko:33, sub:17, dec:50 },
  'Donte Johnson':{ l5:'WWLWW', ko:38, sub:25, dec:37 },
  'Kau\u00ea Fernandes':{ l5:'WWWWL', ko:45, sub:18, dec:37 },
  'Dustin Stoltzfus':{ l5:'LWLWL', ko:20, sub:47, dec:33 },
  'Eric McConico':{ l5:'WLWLW', ko:29, sub:14, dec:57 }
};
const ART_TONE = { common:'#8a8175', uncommon:'#5fc98a', rare:'#6ea8ff', elite:'#e8a33d', legend:'#f0e6c8' };
function hashN(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function artFor(key, rarity) {
  const tone = ART_TONE[rarity] || ART_TONE.common;
  const h = hashN(key);
  const ang = 15 + (h % 6) * 25;
  const gap = 5 + ((h >> 3) % 5);
  const gx = 18 + ((h >> 6) % 64), gy = 12 + ((h >> 10) % 56);
  const bar = 30 + ((h >> 14) % 34);
  return 'radial-gradient(78% 68% at ' + gx + '% ' + gy + '%, ' + tone + '38 0%, transparent 68%),' +
    'linear-gradient(' + (ang + 90) + 'deg, ' + tone + '22 0 ' + bar + '%, transparent ' + bar + '% 100%),' +
    'repeating-linear-gradient(' + ang + 'deg, ' + tone + '26 0 1px, transparent 1px ' + gap + 'px),' +
    'repeating-linear-gradient(' + (ang + 88) + 'deg, ' + tone + '18 0 1px, transparent 1px ' + gap + 'px),' +
    'linear-gradient(165deg, #262218 0%, #131110 100%)';
}
const POOL_BY_NAME = {};
FIGHTERS.forEach(x => { POOL_BY_NAME[x.name] = x; });
const POOL_BY_ID = {};
FIGHTERS.forEach(x => { POOL_BY_ID[x.id] = x; });

// Current rank, honoring any post-event rank changes (see computeRankUpdates).
function effRank(id, overrides) {
  if (overrides && overrides[id] !== undefined) return overrides[id];
  const f = POOL_BY_ID[id];
  return f ? f.rank : -1;
}
function effRarity(id, overrides) { return tierFromRank(effRank(id, overrides)); }

function artByName(n, overrides) {
  const p = POOL_BY_NAME[n];
  if (!p) return artFor(n, 'common');
  return artFor(n, effRarity(p.id, overrides));
}
function monogram(n) { const p = n.split(' '); return ((p[0][0] || '') + (p[p.length - 1][0] || '')).toUpperCase(); }
function rollFighter(overrides) {
  const total = FIGHTERS.reduce((n, x) => n + RARITY[effRarity(x.id, overrides)].w, 0);
  let t = Math.random() * total;
  for (const x of FIGHTERS) { t -= RARITY[effRarity(x.id, overrides)].w; if (t <= 0) return x; }
  return FIGHTERS[0];
}

// After a card settles, upsets shake up that division's rankings: the winner
// takes the loser's rank; if the loser was champion, the winner is crowned,
// the ex-champion drops to #1, and whoever held #1 slots into the winner's old spot.
function computeRankUpdates(existingOverrides) {
  const updates = {};
  const eff = id => (updates[id] !== undefined ? updates[id] : effRank(id, existingOverrides));
  const norm = r => (r === -1 ? 999 : r);
  BOUTS.forEach(b => {
    const res = RESULTS[b.id];
    if (!res) return;
    const winnerName = res.winner === 'a' ? b.a : b.b;
    const loserName = res.winner === 'a' ? b.b : b.a;
    const winner = POOL_BY_NAME[winnerName];
    const loser = POOL_BY_NAME[loserName];
    if (!winner || !loser) return;
    const winnerRank = eff(winner.id);
    const loserRank = eff(loser.id);
    if (norm(winnerRank) <= norm(loserRank)) return; // no upset, ranks hold
    if (loserRank === 0) {
      const p1 = FIGHTERS.find(f => f.div === winner.div && f.id !== winner.id && f.id !== loser.id && eff(f.id) === 1);
      updates[winner.id] = 0;
      updates[loser.id] = 1;
      if (p1 && winnerRank !== 1) updates[p1.id] = winnerRank;
    } else {
      updates[winner.id] = loserRank;
      updates[loser.id] = winnerRank;
    }
  });
  return updates;
}

const METHODS = ['KO / TKO','Submission','Decision','Skip'];
const BONUSES = ['A takedown lands','A knockdown lands','Skip'];
