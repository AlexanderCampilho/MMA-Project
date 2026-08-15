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

// navigator.clipboard needs a secure context (HTTPS/localhost) — falls back to
// the old execCommand trick so "copy link" still works over plain HTTP too
// (e.g. while a custom domain's TLS cert is still provisioning).
function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('execCommand copy failed'));
    } catch (e) {
      document.body.removeChild(ta);
      reject(e);
    }
  });
}
