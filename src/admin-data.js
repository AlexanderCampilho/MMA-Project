// Admin-only Supabase reads/writes (bouts, results, event lock/settle).
// Loaded only by admin.html — never shipped to the tester-facing app.

const SUPABASE_URL = 'https://djkryrslfmggrcytbvea.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VGs2RfLS7Tpttm5qXC55zg_GuykSOzN';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listEvents() {
  const { data } = await sb.from('events').select('*').order('created_at', { ascending: false });
  return data || [];
}

async function getLiveEvent() {
  const { data: event } = await sb.from('events').select('*').eq('is_live', true).maybeSingle();
  if (!event) return null;
  const { data: bouts } = await sb.from('bouts').select('*').eq('event_id', event.id).order('order_num', { ascending: true });
  return { event, bouts: bouts || [] };
}

async function createEvent(fields) {
  await sb.from('events').update({ is_live: false }).eq('is_live', true);
  const { data, error } = await sb.from('events').insert(Object.assign({ is_live: true, locked: false, settled: false }, fields)).select().single();
  if (error) throw error;
  return data;
}

async function updateEvent(id, fields) {
  const { error } = await sb.from('events').update(fields).eq('id', id);
  if (error) throw error;
}

async function makeLive(id) {
  await sb.from('events').update({ is_live: false }).eq('is_live', true);
  await sb.from('events').update({ is_live: true }).eq('id', id);
}

async function addBout(eventId, fields) {
  const { error } = await sb.from('bouts').insert(Object.assign({ event_id: eventId }, fields));
  if (error) throw error;
}

async function updateBout(id, fields) {
  const { error } = await sb.from('bouts').update(fields).eq('id', id);
  if (error) throw error;
}

async function deleteBout(id) {
  const { error } = await sb.from('bouts').delete().eq('id', id);
  if (error) throw error;
}

async function getPlayerCount() {
  const { count } = await sb.from('players').select('id', { count: 'exact', head: true });
  return count || 0;
}

window.CageClashAdmin = { listEvents, getLiveEvent, createEvent, updateEvent, makeLive, addBout, updateBout, deleteBout, getPlayerCount };
