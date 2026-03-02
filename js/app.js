/* ═══════════════════════════════════════════════
   Template Studio — Main App
═══════════════════════════════════════════════ */
const App = (() => {
  let state = { view:'home', niche:null, template:null, savedForms:{} };

  function loadSaved() { try { state.savedForms = JSON.parse(localStorage.getItem('ts_saved')||'{}'); } catch(e){} }
  function persistSaved() { try { localStorage.setItem('ts_saved', JSON.stringify(state.savedForms)); } catch(e){} }

  function navigate(view, opts={}) { Object.assign(state, {view}, opts); render(); window.scrollTo(0,0); }

  function render() {
    const root = document.getElementById('app');
    switch(state.view) {
      case 'home':  root.innerHTML = viewHome(); break;
      case 'niche': root.innerHTML = viewNiche(); break;
      case 'form':  root.innerHTML = viewForm(); bindForm(); break;
    }
    bindNav();
  }

  /* ── HOME ── */
  function viewHome() {
    const niches = Object.entries(window.NICHE_META);
    const total = Object.values(window.TEMPLATES).flat().length;
    return `
    <div class="home">
      <div class="home-hero">
        <div class="hero-badge">✦ ${total} Premium Templates</div>
        <h1 class="hero-title">Template<span class="accent">Studio</span></h1>
        <p class="hero-sub">Professional digital templates. Fill in your details, download as PDF instantly.</p>
      </div>
      <div class="niche-grid">
        ${niches.map(([key, meta]) => {
          const count = window.TEMPLATES[key].length;
          return `
          <button class="niche-card" data-nav="niche" data-niche="${key}"
            style="--card-accent:${meta.color};--card-bg:${meta.bg}">
            <div class="nc-icon">${meta.icon}</div>
            <div class="nc-info">
              <div class="nc-label">${meta.label}</div>
              <div class="nc-count">${count} template${count!==1?'s':''}</div>
            </div>
            <div class="nc-arrow">→</div>
          </button>`;
        }).join('')}
      </div>
      <div class="home-features">
        <div class="feat"><span class="feat-icon">⚡</span><span>Instant PDF</span></div>
        <div class="feat"><span class="feat-icon">📱</span><span>Works offline</span></div>
        <div class="feat"><span class="feat-icon">🔄</span><span>Reuse anytime</span></div>
        <div class="feat"><span class="feat-icon">💾</span><span>Auto-saves data</span></div>
      </div>
    </div>`;
  }

  /* ── NICHE ── */
  function viewNiche() {
    const meta = window.NICHE_META[state.niche];
    const templates = window.TEMPLATES[state.niche];
    return `
    <div class="niche-view">
      <div class="page-header" style="--hdr-accent:${meta.color};--hdr-bg:${meta.bg}">
        <button class="btn-back" data-nav="home">← Back</button>
        <div class="ph-content">
          <div class="ph-icon">${meta.icon}</div>
          <h2 class="ph-title">${meta.label}</h2>
          <p class="ph-sub">${templates.length} templates · Fill &amp; download PDF</p>
        </div>
      </div>
      <div class="template-list">
        ${templates.map(t => {
          const saved = state.savedForms[t.id];
          return `
          <div class="template-card" data-nav="form" data-template="${t.id}" data-niche="${t.niche}">
            <div class="tc-preview" style="background:${t.palette.primary}">${renderMiniPreview(t)}</div>
            <div class="tc-info">
              <div class="tc-header">
                <span class="tc-name">${t.name}</span>
                <span class="tc-tag" style="color:${t.palette.accent}">${t.tag}</span>
              </div>
              <p class="tc-desc">${t.description}</p>
              <div class="tc-footer">
                <span class="tc-fields">${t.fields.length} fields</span>
                ${saved ? '<span class="tc-saved">✓ Saved</span>' : ''}
                <span class="btn-use" style="--btn-color:${t.palette.accent}">Open →</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function renderMiniPreview(t) {
    const p = t.palette, id = t.id;
    if (id.startsWith('resume')) return `<svg viewBox="0 0 100 130"><rect x="0" y="0" width="28" height="130" fill="${p.secondary}"/><circle cx="14" cy="18" r="8" fill="${p.accent}"/><rect x="3" y="30" width="22" height="2" rx="1" fill="${p.muted}"/><rect x="3" y="35" width="18" height="1.5" rx="1" fill="${p.muted}" opacity=".5"/><rect x="3" y="42" width="22" height="1.5" rx="1" fill="${p.accent}"/><rect x="5" y="46" width="16" height="1.2" rx=".6" fill="${p.light}" opacity=".5"/><rect x="5" y="50" width="14" height="1.2" rx=".6" fill="${p.light}" opacity=".5"/><rect x="30" y="0" width="70" height="18" fill="${p.primary}"/><rect x="30" y="18" width="70" height="1.5" fill="${p.accent}"/><rect x="34" y="6" width="28" height="3" rx="1" fill="white"/><rect x="34" y="11" width="18" height="2" rx="1" fill="${p.muted}"/><rect x="34" y="24" width="60" height="1.2" rx=".6" fill="${p.primary}" opacity=".4"/><rect x="34" y="28" width="55" height="1" rx=".5" fill="${p.muted}" opacity=".3"/><rect x="34" y="38" width="58" height="1.2" rx=".6" fill="${p.primary}" opacity=".4"/><rect x="34" y="42" width="50" height="1" rx=".5" fill="${p.muted}" opacity=".3"/></svg>`;
    if (id.startsWith('planner')) return `<svg viewBox="0 0 100 130"><rect width="100" height="130" fill="white"/><rect width="100" height="18" fill="${p.primary}"/><rect y="18" width="100" height="1.5" fill="${p.accent}"/><rect x="6" y="6" width="36" height="4" rx="1" fill="white"/>${[0,1,2,3,4,5,6].map(i=>`<rect x="${2+i*13.7}" y="21" width="12.5" height="4" rx=".5" fill="${i>=5?p.accent:p.secondary}"/><rect x="${2+i*13.7}" y="27" width="12.5" height="95" rx=".5" fill="${i%2===0?p.light+'88':'white'}" stroke="${p.muted}" stroke-width="0.3"/>`).join('')}</svg>`;
    if (id.startsWith('finance')) return `<svg viewBox="0 0 100 130"><rect width="100" height="130" fill="white"/><rect width="100" height="18" fill="${p.primary}"/><rect y="18" width="100" height="1.5" fill="${p.accent}"/><rect x="4" y="22" width="92" height="7" fill="${p.light}"/>${[0,1,2].map(i=>`<rect x="${8+i*30}" y="24" width="20" height="3" rx="1" fill="${p.muted}" opacity=".5"/>`).join('')}<rect x="4" y="31" width="92" height="5" fill="${p.secondary}"/>${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<rect x="4" y="${38+i*6}" width="92" height="5" fill="${i%2===0?p.light:'white'}"/><rect x="6" y="${40+i*6}" width="35" height="1.5" rx=".5" fill="${p.primary}" opacity=".5"/><rect x="47" y="${40+i*6}" width="12" height="1.5" rx=".5" fill="${p.muted}" opacity=".4"/><rect x="63" y="${40+i*6}" width="12" height="1.5" rx=".5" fill="${p.muted}" opacity=".4"/>`).join('')}</svg>`;
    return `<svg viewBox="0 0 100 130"><rect width="100" height="130" fill="white"/><rect width="100" height="18" fill="${p.primary}"/><rect y="18" width="100" height="1.5" fill="${p.accent}"/>${[0,1,2,3,4].map(col=>[0,1,2,3,4].map(row=>`<rect x="${3+col*19}" y="${22+row*21}" width="17" height="19" rx=".8" fill="${(row+col)%2===0?p.light:'white'}" stroke="${p.muted}" stroke-width="0.3"/><rect x="${5+col*19}" y="${24+row*21}" width="6" height="2" rx=".5" fill="${p.accent}"/><rect x="${5+col*19}" y="${28+row*21}" width="13" height="1" rx=".5" fill="${p.muted}" opacity=".4"/>`).join('')).join('')}</svg>`;
  }

  /* ── FORM ── */
  function viewForm() {
    const t = getTemplate(state.template);
    if (!t) return '<div class="error">Template not found</div>';
    const pal = t.palette;
    const saved = state.savedForms[t.id] || {};
    return `
    <div class="form-view">
      <div class="page-header" style="--hdr-accent:${pal.accent};--hdr-bg:${pal.primary}">
        <button class="btn-back" data-nav="niche" data-niche="${t.niche}">← Back</button>
        <div class="ph-content">
          <div class="ph-icon">${window.NICHE_META[t.niche].icon}</div>
          <h2 class="ph-title">${t.name}</h2>
          <p class="ph-sub">${t.description}</p>
        </div>
      </div>
      <div class="form-body">
        <div class="form-tip">💡 Fill in your details. Data is auto-saved locally as you type.</div>
        <div class="form-fields" id="form-fields">
          ${t.fields.map(f => `
          <div class="field-group">
            <label class="field-label" for="field-${f.id}">${f.label}</label>
            ${f.type==='textarea'
              ? `<textarea id="field-${f.id}" data-fid="${f.id}" class="field-input field-ta" placeholder="${f.placeholder}" rows="3">${saved[f.id]||''}</textarea>`
              : `<input type="text" id="field-${f.id}" data-fid="${f.id}" class="field-input" placeholder="${f.placeholder}" value="${(saved[f.id]||'').replace(/"/g,'&quot;')}">`
            }
          </div>`).join('')}
        </div>
        <div class="form-actions">
          <button class="btn-clear" id="btn-clear">Clear</button>
          <button class="btn-generate" id="btn-generate" style="--gen-color:${pal.accent}">
            ⬇ Generate PDF
          </button>
        </div>
        <p class="form-legal">PDFs are generated in your browser. No data leaves your device.</p>
      </div>
    </div>`;
  }

  function bindForm() {
    const t = getTemplate(state.template);
    if (!t) return;
    document.querySelectorAll('.field-input').forEach(el => {
      el.addEventListener('input', () => {
        const fid = el.getAttribute('data-fid');
        if (!state.savedForms[t.id]) state.savedForms[t.id] = {};
        state.savedForms[t.id][fid] = el.value;
        persistSaved();
      });
    });
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      if (confirm('Clear all fields?')) { delete state.savedForms[t.id]; persistSaved(); render(); }
    });
    document.getElementById('btn-generate')?.addEventListener('click', () => {
      const formData = {};
      document.querySelectorAll('.field-input').forEach(el => { formData[el.getAttribute('data-fid')] = el.value; });
      state.savedForms[t.id] = formData; persistSaved();
      const btn = document.getElementById('btn-generate');
      btn.textContent = '⏳ Generating...'; btn.disabled = true;
      setTimeout(() => {
        try {
          window.PDFEngine.generate(t.id, formData);
          showToast('PDF downloaded! ✓');
        } catch(e) {
          console.error(e); showToast('Error: ' + e.message, true);
        }
        btn.textContent = '⬇ Generate PDF'; btn.disabled = false;
      }, 50);
    });
  }

  function bindNav() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        navigate(el.getAttribute('data-nav'), {
          niche: el.getAttribute('data-niche') || state.niche,
          template: el.getAttribute('data-template') || state.template,
        });
      });
    });
  }

  function getTemplate(id) { return Object.values(window.TEMPLATES).flat().find(t => t.id === id); }

  function showToast(msg, isErr=false) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast ' + (isErr ? 'toast-err' : 'toast-ok') + ' show';
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3000);
  }

  function init() {
    loadSaved(); render();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.error);
    document.addEventListener('keydown', e => {
      if (e.key==='Escape') {
        if (state.view==='form') navigate('niche', {niche: state.niche});
        else if (state.view==='niche') navigate('home');
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
