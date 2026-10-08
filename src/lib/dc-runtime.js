// @ts-nocheck
/**
 * Tiny client-side renderer for the interactive demos.
 * Templates use {{ path }} holes, <sc-if value="{{ x }}"> and <sc-for list="{{ xs }}" as="x">,
 * with logic classes that expose renderVals() (same shape as the approved design files).
 */
export const React = {
  createRef: () => ({ current: null }),
  createElement(tag, props, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === 'key' || v == null) continue;
      if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'className') el.className = v;
      else el.setAttribute(k, String(v));
    }
    for (const c of children.flat()) if (c != null) el.append(c instanceof Node ? c : String(c));
    return el;
  },
};

export class DCLogic {
  constructor(props = {}) { this.props = props; this.state = {}; this._render = () => {}; }
  setState(update, cb) {
    const next = typeof update === 'function' ? update(this.state, this.props) : update;
    if (!next) return;
    this.state = { ...this.state, ...next };
    this._render();
    if (this.componentDidUpdate) this.componentDidUpdate();
    if (cb) cb();
  }
  forceUpdate() { this._render(); }
  renderVals() { return {}; }
}

const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
const ONLY = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
const EVENTS = { onclick: 'click', onchange: 'input', oninput: 'input', onkeydown: 'keydown', onkeyup: 'keyup', onsubmit: 'submit', onfocus: 'focus', onblur: 'blur', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave' };
const BOOL = new Set(['disabled', 'checked', 'hidden', 'open', 'required', 'selected', 'readonly', 'multiple']);
let cssId = 0;
const cssDone = new Set();

function lookup(path, scope) {
  if (path === 'true') return true;
  if (path === 'false') return false;
  if (path === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
  if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
  let v = scope;
  for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; }
  return v;
}
const interp = (str, scope) => str.replace(HOLE, (m, p) => { const v = lookup(p, scope); return v == null || v === false ? '' : String(v); });

function hoverCss(el, tplId) {
  let rules = '';
  for (const [attr, pseudo] of [['style-hover', ':hover'], ['style-focus', ':focus-visible'], ['style-active', ':active']]) {
    const decl = el.getAttribute(attr);
    if (decl == null) continue;
    el.removeAttribute(attr);
    let cls = el.getAttribute('data-hv');
    if (!cls) { cls = 'dch' + ++cssId; el.setAttribute('data-hv', cls); }
    rules += `.${cls}${pseudo}{${decl.split(';').filter((d) => d.trim()).map((d) => d.trim() + ' !important').join(';')}}`;
  }
  return rules;
}

function prepare(tplHtml) {
  const t = document.createElement('template');
  t.innerHTML = tplHtml;
  let css = '';
  t.content.querySelectorAll('*').forEach((el) => { css += hoverCss(el); });
  if (css && !cssDone.has(tplHtml)) {
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); cssDone.add(tplHtml);
  }
  return t.content;
}

function renderNodes(nodes, scope, out) {
  for (const n of nodes) {
    if (n.nodeType === 3) {
      const one = ONLY.exec(n.nodeValue);
      if (one) { const v = lookup(one[1], scope); if (v instanceof Node) { out.appendChild(v.cloneNode(true)); continue; } }
      out.appendChild(document.createTextNode(n.nodeValue.includes('{{') ? interp(n.nodeValue, scope) : n.nodeValue));
      continue;
    }
    if (n.nodeType !== 1) continue;
    const tag = n.localName.toLowerCase();
    if (tag === 'sc-if') {
      const m = ONLY.exec(n.getAttribute('value') || '');
      if (m && lookup(m[1], scope)) renderNodes(n.childNodes, scope, out);
      continue;
    }
    if (tag === 'sc-for') {
      const m = ONLY.exec(n.getAttribute('list') || '');
      const list = (m && lookup(m[1], scope)) || [];
      const as = n.getAttribute('as') || 'item';
      list.forEach((item, i) => renderNodes(n.childNodes, { ...scope, [as]: item, $index: i }, out));
      continue;
    }
    const el = document.createElementNS(n.namespaceURI, n.localName);
    for (const { name, value } of Array.from(n.attributes)) {
      if (name.startsWith('hint-')) continue;
      if (name === 'data-hv') { el.classList.add(value); continue; }
      const m = ONLY.exec(value);
      const lname = name.toLowerCase();
      if (m) {
        const v = lookup(m[1], scope);
        if (EVENTS[lname]) {
          if (typeof v === 'function') {
            let ev = EVENTS[lname];
            if (lname === 'onchange' && (tag === 'select' || (tag === 'input' && /checkbox|radio/.test(n.getAttribute('type') || '')))) ev = 'change';
            el.addEventListener(ev, v);
          }
          continue;
        }
        if (lname === 'ref') { if (v && typeof v === 'object') v.current = el; else if (typeof v === 'function') v(el); continue; }
        if (lname === 'value' && /input|textarea|select/.test(tag)) { el._dcValue = v == null ? '' : String(v); continue; }
        if (BOOL.has(lname)) { if (v) el.setAttribute(name, ''); continue; }
        if (v == null || v === false && !lname.startsWith('aria-')) continue;
        el.setAttribute(name, String(v));
      } else {
        el.setAttribute(name, value.includes('{{') ? interp(value, scope) : value);
      }
    }
    renderNodes(n.childNodes, scope, tag === 'template' ? el.content : el);
    out.appendChild(el);
    if (el._dcValue !== undefined) el.value = el._dcValue;
  }
}

function pathTo(el, root) {
  const p = [];
  while (el && el !== root) { const parent = el.parentNode; if (!parent) return null; p.unshift(Array.prototype.indexOf.call(parent.childNodes, el)); el = parent; }
  return el === root ? p : null;
}

export function mount(key, tplHtml, Logic, props = {}) {
  document.querySelectorAll(`[data-dc="${key}"]`).forEach((root) => {
    const tpl = prepare(tplHtml);
    const inst = new Logic(props);
    inst.props = props;
    inst._render = () => {
      const active = document.activeElement;
      const path = root.contains(active) ? pathTo(active, root) : null;
      const sel = active && 'selectionStart' in active ? [active.selectionStart, active.selectionEnd] : null;
      const frag = document.createDocumentFragment();
      renderNodes(tpl.childNodes, inst.renderVals(), frag);
      while (root.firstChild) root.removeChild(root.firstChild);
      root.appendChild(frag);
      if (path) {
        let n = root; for (const i of path) { n = n && n.childNodes[i]; }
        if (n && n.focus) { n.focus({ preventScroll: true }); if (sel && 'setSelectionRange' in n) { try { n.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
      }
    };
    inst._render();
    if (inst.componentDidMount) inst.componentDidMount();
  });
}
