// Supabase-backed live event, players, and picks.
// The anon/publishable key is meant to be public — Supabase's security boundary
// is Row Level Security, not key secrecy. RLS on this project is intentionally
// open (small trusted-tester build, no per-user auth yet) — see README.

const SUPABASE_URL = 'https://djkryrslfmggrcytbvea.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VGs2RfLS7Tpttm5qXC55zg_GuykSOzN';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PLAYER_ID_KEY = 'cage-clash-player-id';

function getPlayerId() {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('p-' + Math.random().toString(36).slice(2) + Date.now().toString(36));
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

async function ensurePlayer(id, name) {
  const { data, error } = await sb.from('players').upsert({ id, name }, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

async function renamePlayer(id, name) {
  await sb.from('players').update({ name }).eq('id', id);
}

// The single "live" card admin is running tonight, plus its bouts in order.
async function fetchLiveEvent() {
  const { data: event, error } = await sb.from('events').select('*').eq('is_live', true).maybeSingle();
  if (error || !event) return null;
  const { data: bouts } = await sb.from('bouts').select('*').eq('event_id', event.id).order('order_num', { ascending: true });
  return { event, bouts: bouts || [] };
}

async function fetchMyPicks(playerId, boutIds) {
  if (!boutIds.length) return [];
  const { data } = await sb.from('picks').select('*').eq('player_id', playerId).in('bout_id', boutIds);
  return data || [];
}

async function upsertPick(playerId, boutId, patch) {
  const row = Object.assign({ player_id: playerId, bout_id: boutId, updated_at: new Date().toISOString() }, patch);
  const { error } = await sb.from('picks').upsert(row, { onConflict: 'player_id,bout_id' });
  return !error;
}

// All settled bouts (any event) + all picks against them, for the shared leaderboard.
async function fetchLeaderboardInputs() {
  const [{ data: settledBouts }, { data: players }] = await Promise.all([
    sb.from('bouts').select('id,event_id,result_winner,result_method,result_round,result_bonus').not('result_winner', 'is', null),
    sb.from('players').select('id,name')
  ]);
  const boutIds = (settledBouts || []).map(b => b.id);
  let picks = [];
  if (boutIds.length) {
    const { data } = await sb.from('picks').select('player_id,bout_id,winner,method,round,bonus').in('bout_id', boutIds);
    picks = data || [];
  }
  return { settledBouts: settledBouts || [], players: players || [], picks };
}

window.CageClashSupabase = {
  getPlayerId, ensurePlayer, renamePlayer, fetchLiveEvent, fetchMyPicks, upsertPick, fetchLeaderboardInputs, client: sb
};
