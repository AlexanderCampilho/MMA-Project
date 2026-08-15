// Turns a CSS-text string (as used throughout the original design prototype)
// into a React inline-style object, so markup can be ported near-verbatim.
function css(str) {
  if (!str) return undefined;
  const out = {};
  str.split(';').forEach(decl => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) return;
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = val;
  });
  return out;
}
