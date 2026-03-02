/* ═══════════════════════════════════════════════
   Template Studio — PDF Engine (jsPDF)
   Renders all 12 templates to downloadable PDFs
═══════════════════════════════════════════════ */

window.PDFEngine = {

  /* ─── UTILITIES ──────────────────────────── */

  hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return [r,g,b];
  },

  setFill(doc, hex) {
    const [r,g,b] = this.hexToRgb(hex);
    doc.setFillColor(r,g,b);
  },

  setDraw(doc, hex) {
    const [r,g,b] = this.hexToRgb(hex);
    doc.setDrawColor(r,g,b);
  },

  setTextColor(doc, hex) {
    const [r,g,b] = this.hexToRgb(hex);
    doc.setTextColor(r,g,b);
  },

  rect(doc, x, y, w, h, hex, style='F') {
    this.setFill(doc, hex);
    doc.rect(x, y, w, h, style);
  },

  line(doc, x1, y1, x2, y2, hex, lw=0.3) {
    this.setDraw(doc, hex);
    doc.setLineWidth(lw);
    doc.line(x1, y1, x2, y2);
  },

  text(doc, str, x, y, hex='#000000', size=10, style='normal', align='left') {
    this.setTextColor(doc, hex);
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.text(String(str||''), x, y, { align });
  },

  wrapText(doc, str, x, y, maxW, lineH, hex='#333333', size=9) {
    doc.setFontSize(size);
    doc.setFont('helvetica','normal');
    this.setTextColor(doc, hex);
    const lines = doc.splitTextToSize(String(str||''), maxW);
    doc.text(lines, x, y);
    return y + lines.length * lineH;
  },

  headerBand(doc, pal, title, subtitle='', pageW=210, bandH=28) {
    this.rect(doc, 0, 0, pageW, bandH, pal.primary);
    this.rect(doc, 0, bandH, pageW, 1.5, pal.accent);
    this.text(doc, title, 12, 12, '#FFFFFF', 18, 'bold');
    if (subtitle) this.text(doc, subtitle, 12, 22, pal.muted, 8, 'normal');
  },

  footer(doc, pal, label='', pageW=210, pageH=297) {
    this.rect(doc, 0, pageH-8, pageW, 8, pal.primary);
    this.text(doc, 'Template Studio', 8, pageH-2.5, '#FFFFFF', 6, 'normal');
    if (label) this.text(doc, label, pageW-8, pageH-2.5, pal.muted, 6, 'normal', 'right');
  },

  sectionTitle(doc, x, y, title, pal, lineW=80) {
    this.text(doc, title.toUpperCase(), x, y, pal.accent, 8, 'bold');
    this.line(doc, x, y+1.5, x+lineW, y+1.5, pal.accent, 0.5);
  },

  checkbox(doc, x, y, size=3.5, hex='#CCCCCC') {
    this.setDraw(doc, hex);
    doc.setLineWidth(0.3);
    doc.rect(x, y-size+1, size, size, 'S');
  },

  progressBar(doc, x, y, totalW, h, pct, bgHex, fillHex) {
    this.rect(doc, x, y, totalW, h, bgHex);
    if (pct > 0) this.rect(doc, x, y, totalW * Math.min(pct/100, 1), h, fillHex);
  },

  /* ─── RESUME: CLASSIC PROFESSIONAL ─────── */
  renderResumeClassic(doc, data, pal) {
    const PW = 210, PH = 297;
    const sideW = 58;

    // sidebar bg
    this.rect(doc, 0, 0, sideW, PH, pal.primary);

    // profile circle
    this.setFill(doc, pal.accent);
    doc.circle(sideW/2, 22, 10, 'F');
    this.text(doc, 'PHOTO', sideW/2, 23.5, '#FFFFFF', 6, 'bold', 'center');

    // Name + title in sidebar
    this.text(doc, (data.name||'Your Name').toUpperCase(), sideW/2, 40, '#FFFFFF', 9, 'bold', 'center');
    this.text(doc, data.title||'Job Title', sideW/2, 46, pal.muted, 7, 'normal', 'center');

    // Sidebar sections
    const sideItems = [
      { title: 'CONTACT', items: [data.email||'email@domain.com', data.phone||'(555) 000-0000', data.location||'City, State', data.linkedin||'linkedin.com/in/you'] },
      { title: 'SKILLS', items: (data.skills||'Skill 1, Skill 2, Skill 3').split(',').map(s=>s.trim()) },
      { title: 'EDUCATION', items: [data.education||'Degree — University — Year'] },
      { title: 'CERTIFICATIONS', items: [data.certs||'Cert Name — Issuer'] },
    ];

    let sy = 58;
    sideItems.forEach(sec => {
      if (sy > PH - 15) return;
      this.text(doc, sec.title, 5, sy, pal.accent, 7, 'bold');
      this.rect(doc, 5, sy+1.5, sideW-10, 0.5, pal.accent);
      sy += 7;
      sec.items.forEach(item => {
        if (sy > PH - 15) return;
        doc.setFontSize(6.5); doc.setFont('helvetica','normal');
        this.setTextColor(doc, pal.light);
        const wrapped = doc.splitTextToSize(item, sideW - 10);
        wrapped.forEach(l => { doc.text(l, 5, sy); sy += 4; });
      });
      sy += 4;
    });

    // Main area header
    this.rect(doc, sideW, 0, PW-sideW, 20, pal.primary);
    this.rect(doc, sideW, 20, PW-sideW, 1.5, pal.accent);
    this.text(doc, data.name||'Your Name', sideW+8, 9, '#FFFFFF', 16, 'bold');
    this.text(doc, data.title||'Professional Title', sideW+8, 16, pal.muted, 8);

    // Main sections
    const mx = sideW + 8, mw = PW - sideW - 16;
    let my = 30;

    // Summary
    this.sectionTitle(doc, mx, my, 'Professional Summary', pal, mw);
    my += 5;
    my = this.wrapText(doc, data.summary||'Write your professional summary here.', mx, my, mw, 4.5, '#333333', 8.5);
    my += 5;

    // Experience
    this.sectionTitle(doc, mx, my, 'Work Experience', pal, mw);
    my += 5;

    [[data.exp1title, data.exp1co, data.exp1dates, data.exp1desc],
     [data.exp2title, data.exp2co, data.exp2dates, data.exp2desc]].forEach(([et, ec, ed, edesc]) => {
      if (my > PH - 20) return;
      if (et || ec) {
        this.text(doc, `${et||'Job Title'} — ${ec||'Company'}`, mx, my, pal.primary, 9, 'bold');
        this.text(doc, ed||'Year – Year', mx+mw, my, pal.muted, 8, 'normal', 'right');
        my += 5;
      }
      if (edesc) {
        my = this.wrapText(doc, edesc, mx+3, my, mw-3, 4.5, '#444444', 8);
        my += 4;
      }
    });

    this.footer(doc, pal, 'Classic Professional Resume');
  },

  /* ─── RESUME: MODERN MINIMAL ───────────── */
  renderResumeModern(doc, data, pal) {
    const PW = 210, PH = 297;

    // Top header
    this.rect(doc, 0, 0, PW, 32, pal.primary);
    this.rect(doc, 0, 32, PW, 1.5, pal.accent);
    this.text(doc, data.name||'Your Name', 12, 12, '#FFFFFF', 20, 'bold');
    this.text(doc, data.title||'Job Title', 12, 20, pal.muted, 9);
    // contact row
    const contacts = [data.email, data.phone, data.location, data.github].filter(Boolean);
    this.text(doc, contacts.join('  ·  '), 12, 28, pal.muted, 7);

    let y = 42;
    const col1x = 12, col2x = 105, colW = 88;

    // LEFT COLUMN
    this.sectionTitle(doc, col1x, y, 'Professional Summary', pal, colW);
    y += 5;
    y = this.wrapText(doc, data.summary||'Your professional summary here.', col1x, y, colW, 4.5, '#333333', 8.5);
    y += 6;

    this.sectionTitle(doc, col1x, y, 'Work Experience', pal, colW);
    y += 5;
    [[data.exp1title, data.exp1co, data.exp1dates, data.exp1desc],
     [data.exp2title, data.exp2co, data.exp2dates, data.exp2desc]].forEach(([et, ec, ed, edesc]) => {
      if (y > PH - 20) return;
      this.rect(doc, col1x, y-3, 2.5, 10, pal.accent);
      this.text(doc, `${et||'Job Title'}`, col1x+5, y, pal.primary, 9, 'bold');
      this.text(doc, `${ec||'Company'}  ${ed||''}`, col1x+5, y+5, pal.muted, 7.5);
      y += 10;
      if (edesc) { y = this.wrapText(doc, edesc, col1x+5, y, colW-5, 4.5, '#444444', 8); y += 4; }
    });

    // RIGHT COLUMN
    let ry = 42;
    this.sectionTitle(doc, col2x, ry, 'Skills', pal, colW);
    ry += 5;
    (data.skills||'Skill 1, Skill 2, Skill 3').split(',').forEach(skill => {
      if (ry > 160) return;
      this.setFill(doc, pal.light);
      doc.roundedRect(col2x, ry-3, colW, 6, 1, 1, 'F');
      this.text(doc, skill.trim(), col2x+3, ry+1, pal.primary, 8);
      ry += 8;
    });

    ry += 4;
    this.sectionTitle(doc, col2x, ry, 'Education', pal, colW);
    ry += 5;
    ry = this.wrapText(doc, data.education||'Degree — University — Year', col2x, ry, colW, 4.5, '#333333', 8.5);
    ry += 6;

    if (data.projects) {
      this.sectionTitle(doc, col2x, ry, 'Key Projects', pal, colW);
      ry += 5;
      this.wrapText(doc, data.projects, col2x, ry, colW, 4.5, '#333333', 8.5);
    }

    this.footer(doc, pal, 'Modern Minimal Resume');
  },

  /* ─── RESUME: CREATIVE BOLD ────────────── */
  renderResumeCreative(doc, data, pal) {
    const PW = 210, PH = 297;

    // Full-width header with diagonal accent
    this.rect(doc, 0, 0, PW, 38, pal.primary);
    this.rect(doc, 0, 38, PW, 2, pal.accent);
    // Accent square
    this.rect(doc, 0, 0, 8, 38, pal.accent);

    this.text(doc, data.name||'Your Name', 14, 14, '#FFFFFF', 22, 'bold');
    this.text(doc, data.title||'Creative Professional', 14, 22, pal.accent, 9, 'bold');
    this.text(doc, [data.email, data.phone, data.portfolio].filter(Boolean).join('  ·  '), 14, 30, pal.muted, 7.5);
    this.text(doc, data.location||'', PW-12, 30, pal.muted, 7.5, 'normal', 'right');

    let y = 48;
    const mx = 12, mw = PW - 24;

    this.sectionTitle(doc, mx, y, 'Creative Statement', pal, mw);
    y += 5;
    y = this.wrapText(doc, data.summary||'Your creative statement here.', mx, y, mw, 4.5, '#333333', 8.5);
    y += 6;

    this.sectionTitle(doc, mx, y, 'Experience', pal, mw);
    y += 5;

    [[data.exp1title, data.exp1co, data.exp1dates, data.exp1desc],
     [data.exp2title, data.exp2co, data.exp2dates, data.exp2desc]].forEach(([et, ec, ed, edesc]) => {
      if (y > PH - 30) return;
      // Accent dot
      this.setFill(doc, pal.accent);
      doc.circle(mx+2, y-1.5, 2, 'F');
      this.text(doc, `${et||'Role'}  ·  ${ec||'Studio'}`, mx+7, y, pal.primary, 9, 'bold');
      this.text(doc, ed||'Year – Year', PW-12, y, pal.muted, 7.5, 'normal', 'right');
      y += 5;
      if (edesc) { y = this.wrapText(doc, edesc, mx+7, y, mw-7, 4.5, '#444444', 8); y += 4; }
    });

    y += 2;
    // Two-column bottom
    const c1x = mx, c2x = PW/2 + 4, cw = PW/2 - 16;

    this.sectionTitle(doc, c1x, y, 'Tools & Software', pal, cw);
    let ly = y + 5;
    (data.tools||data.skills||'').split(',').forEach(t => {
      if (ly > PH - 20) return;
      this.text(doc, '▸  ' + t.trim(), c1x, ly, '#444444', 8);
      ly += 5;
    });

    this.sectionTitle(doc, c2x, y, 'Education & Awards', pal, cw);
    let ry = y + 5;
    ry = this.wrapText(doc, data.education||'', c2x, ry, cw, 4.5, '#333333', 8);
    ry += 3;
    if (data.awards) this.wrapText(doc, data.awards, c2x, ry, cw, 4.5, '#333333', 8);

    this.footer(doc, pal, 'Creative Bold Resume');
  },

  /* ─── PLANNER: WEEKLY ───────────────────── */
  renderPlannerWeekly(doc, data, pal) {
    const PW = 210, PH = 297;
    this.headerBand(doc, pal, 'WEEKLY PLANNER', `Week of: ${data.week||'_____________'}   ${data.year||''}`, PW, 26);

    const days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    const colW = (PW - 16) / 7;
    const topY = 32, colH = PH - 32 - 42;

    days.forEach((d, i) => {
      const x = 8 + i * colW;
      const isWknd = i >= 5;
      this.rect(doc, x, topY, colW-1, 7, isWknd ? pal.accent : pal.secondary);
      this.text(doc, d, x + (colW-1)/2, topY+5, '#FFFFFF', 6.5, 'bold', 'center');
      this.setFill(doc, isWknd ? '#FFF8E8' : (i%2===0 ? pal.light : '#FFFFFF'));
      doc.rect(x, topY+7, colW-1, colH, 'F');
      this.setDraw(doc, pal.muted);
      doc.setLineWidth(0.2);
      doc.rect(x, topY+7, colW-1, colH, 'S');
      // hour lines
      for (let h = 0; h < 13; h++) {
        const ly = topY + 7 + (h / 13) * colH;
        this.line(doc, x+1, ly, x+colW-2, ly, pal.muted, 0.2);
        if (i === 0) {
          this.text(doc, `${7+h}:00`, x+1, ly+3, pal.muted, 5);
        }
      }
    });

    // Goals + Notes strip
    const notesY = PH - 38;
    this.rect(doc, 8, notesY, PW-16, 7, pal.primary);
    this.text(doc, 'WEEKLY GOALS & NOTES', PW/2, notesY+5, '#FFFFFF', 7, 'bold', 'center');
    this.rect(doc, 8, notesY+7, PW-16, 22, pal.light);
    const goals = [data.goal1, data.goal2, data.goal3].filter(Boolean);
    if (goals.length) {
      goals.forEach((g, i) => {
        this.checkbox(doc, 12, notesY + 14 + i*6, 3, pal.accent);
        this.text(doc, g, 18, notesY + 14 + i*6, pal.primary, 7.5);
      });
    }
    if (data.notes) this.wrapText(doc, data.notes, PW/2+4, notesY+12, (PW-20)/2, 4.5, '#444444', 7.5);
    if (data.affirmation) {
      this.text(doc, `"${data.affirmation}"`, PW/2, notesY+28, pal.muted, 7, 'italic', 'center');
    }

    this.footer(doc, pal, 'Weekly Planner');
  },

  /* ─── PLANNER: MONTHLY CALENDAR ────────── */
  renderPlannerMonthly(doc, data, pal) {
    const PW = 210, PH = 297;
    const now = new Date();
    const month = parseInt(data.month) || (now.getMonth() + 1);
    const year  = parseInt(data.year)  || now.getFullYear();
    const monthNames = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
    this.headerBand(doc, pal, `${monthNames[month].toUpperCase()} ${year}`, data.theme ? `Theme: ${data.theme}` : 'Monthly Overview', PW, 26);

    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const cellW = (PW - 16) / 7;
    const topY = 32, cellH = 30;

    // Day headers
    days.forEach((d, i) => {
      const x = 8 + i * cellW;
      this.rect(doc, x, topY, cellW-1, 6, i===0||i===6 ? pal.accent : pal.secondary);
      this.text(doc, d, x+(cellW-1)/2, topY+4.5, '#FFFFFF', 6.5, 'bold', 'center');
    });

    // Build calendar
    const firstDay = new Date(year, month-1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    let dayNum = 1, row = 0;
    const today = now.getDate();

    // 6 rows max
    for (row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cellIdx = row * 7 + col;
        const x = 8 + col * cellW;
        const y = topY + 7 + row * cellH;
        if (cellIdx < firstDay || dayNum > daysInMonth) {
          this.rect(doc, x, y, cellW-1, cellH-1, '#F0F0F0');
        } else {
          const isToday = dayNum === today && month === now.getMonth()+1 && year === now.getFullYear();
          const isWknd = col === 0 || col === 6;
          this.setFill(doc, isToday ? pal.accent : (isWknd ? '#EEF6FF' : '#FFFFFF'));
          doc.rect(x, y, cellW-1, cellH-1, 'F');
          this.setDraw(doc, pal.muted);
          doc.setLineWidth(0.2);
          doc.rect(x, y, cellW-1, cellH-1, 'S');
          this.text(doc, String(dayNum), x+2, y+5, isToday ? '#FFFFFF' : pal.primary, 8, 'bold');
          // Lines for writing
          for (let l=0;l<3;l++) this.line(doc, x+2, y+10+l*7, x+cellW-3, y+10+l*7, pal.muted, 0.2);
          dayNum++;
        }
      }
      if (dayNum > daysInMonth) break;
    }

    // Goals strip
    const gy = topY + 8 + (row+1) * cellH + 2;
    if (gy < PH - 15) {
      this.rect(doc, 8, gy, PW-16, 6, pal.primary);
      this.text(doc, 'MONTHLY GOALS & INTENTIONS', PW/2, gy+4.5, '#FFFFFF', 7, 'bold', 'center');
      let gx = 12;
      [data.goal1, data.goal2, data.goal3].filter(Boolean).forEach((g, i) => {
        this.checkbox(doc, gx, gy+14, 3, pal.accent);
        this.text(doc, g, gx+5, gy+14, pal.primary, 7.5);
        gx += (PW-20)/3;
      });
      if (data.intention) this.text(doc, `"${data.intention}"`, PW/2, gy+22, pal.muted, 7, 'italic', 'center');
    }

    this.footer(doc, pal, 'Monthly Calendar');
  },

  /* ─── PLANNER: DAILY PRODUCTIVITY ──────── */
  renderPlannerDaily(doc, data, pal) {
    const PW = 210, PH = 297;
    const moodDots = parseInt(data.mood)||0;
    this.headerBand(doc, pal, 'DAILY PRODUCTIVITY PLANNER',
      `${data.date||'Date: ____________'}   Mood: ${'●'.repeat(moodDots) + '○'.repeat(5-moodDots)}`, PW, 26);

    const col1x = 8, col2x = 110, colW1 = 95, colW2 = 92;
    let ly = 34, ry = 34;

    // LEFT: time schedule
    this.sectionTitle(doc, col1x, ly, 'Today\'s Schedule', pal, colW1-4);
    ly += 5;
    for (let h = 6; h <= 21; h++) {
      const label = h < 12 ? `${h}:00 AM` : (h===12 ? '12:00 PM' : `${h-12}:00 PM`);
      const even = (h-6) % 2 === 0;
      this.setFill(doc, even ? pal.light : '#FFFFFF');
      doc.rect(col1x, ly-3, colW1, 7, 'F');
      this.text(doc, label, col1x+2, ly+1.5, pal.accent, 7, 'bold');
      this.line(doc, col1x+20, ly+1.5, col1x+colW1-2, ly+1.5, pal.muted, 0.3);
      ly += 7;
    }

    // RIGHT: priorities, habits, gratitude
    this.sectionTitle(doc, col2x, ry, 'Top 3 Priorities', pal, colW2);
    ry += 5;
    for (let i=1;i<=3;i++) {
      const val = data[`priority${i}`]||'';
      this.setFill(doc, pal.accent);
      doc.circle(col2x+2.5, ry-1, 2.5, 'F');
      this.text(doc, String(i), col2x+2.5, ry+0.5, '#FFFFFF', 6, 'bold', 'center');
      this.text(doc, val||'Priority '+i, col2x+8, ry+0.5, val ? pal.primary : pal.muted, 8, val?'normal':'italic');
      this.line(doc, col2x+8, ry+2.5, col2x+colW2, ry+2.5, pal.muted, 0.3);
      ry += 9;
    }

    ry += 3;
    this.sectionTitle(doc, col2x, ry, 'Habit Tracker', pal, colW2);
    ry += 5;
    for (let i=1;i<=3;i++) {
      const val = data[`habit${i}`]||'Habit '+i;
      this.checkbox(doc, col2x, ry-3, 4, pal.accent);
      this.text(doc, val, col2x+6, ry, pal.primary, 8);
      ry += 8;
    }

    ry += 3;
    this.sectionTitle(doc, col2x, ry, 'Gratitude', pal, colW2);
    ry += 5;
    for (let i=1;i<=3;i++) {
      this.text(doc, '✦', col2x, ry, pal.accent, 8);
      const val = data[`grateful${i}`]||'';
      this.text(doc, val||'Grateful for...', col2x+6, ry, val ? pal.primary : pal.muted, 8, val?'normal':'italic');
      this.line(doc, col2x+6, ry+2, col2x+colW2, ry+2, pal.muted, 0.3);
      ry += 8;
    }

    ry += 3;
    this.sectionTitle(doc, col2x, ry, 'Brain Dump', pal, colW2);
    ry += 5;
    for (let l=0;l<6;l++) { this.line(doc, col2x, ry+l*5.5, col2x+colW2, ry+l*5.5, pal.muted, 0.3); }
    if (data.brain) this.wrapText(doc, data.brain, col2x, ry+3, colW2, 5.5, '#444444', 7.5);

    this.footer(doc, pal, 'Daily Productivity Planner');
  },

  /* ─── FINANCE: MONTHLY BUDGET ───────────── */
  renderFinanceBudget(doc, data, pal) {
    const PW = 210, PH = 297;
    this.headerBand(doc, pal, 'MONTHLY BUDGET TRACKER', data.month||'Month / Year', PW, 26);

    // Summary bar
    const inc = (parseFloat(data.income1)||0) + (parseFloat(data.income2)||0) + (parseFloat(data.income3)||0);
    const expenses = ['housing','utilities','groceries','transport','insurance','subscriptions','entertainment','dining','healthcare','savings','debt','misc'];
    const exp = expenses.reduce((s,k) => s + (parseFloat(data[k])||0), 0);
    const net = inc - exp;
    const netColor = net >= 0 ? '#27AE60' : '#E74C3C';

    this.rect(doc, 8, 28, PW-16, 10, pal.light);
    [['TOTAL INCOME', `$${inc.toFixed(2)}`, 20], ['TOTAL EXPENSES', `$${exp.toFixed(2)}`, 75], ['NET BALANCE', `$${net.toFixed(2)}`, 130]].forEach(([l,v,x]) => {
      this.text(doc, l, x, 33, pal.muted, 6, 'bold');
      this.text(doc, v, x, 37.5, l==='NET BALANCE' ? netColor : pal.primary, 8, 'bold');
    });
    this.text(doc, data.month||'Month', 175, 33, pal.muted, 6, 'bold');

    // Table
    const colW = [(PW-16)*0.38, (PW-16)*0.16, (PW-16)*0.16, (PW-16)*0.16, (PW-16)*0.14];
    const headers = ['CATEGORY', 'BUDGETED', 'ACTUAL', 'DIFFERENCE', 'NOTES'];
    let y = 42;

    const drawTableHeader = (y) => {
      this.rect(doc, 8, y, PW-16, 6.5, pal.primary);
      let x = 8;
      headers.forEach((h,i) => {
        this.text(doc, h, x + colW[i]/2, y+4.5, '#FFFFFF', 6.5, 'bold', 'center');
        x += colW[i];
      });
    };

    const drawRow = (y, label, shade, isHeader=false) => {
      this.setFill(doc, isHeader ? pal.secondary : (shade ? pal.light : '#FFFFFF'));
      doc.rect(8, y, PW-16, 6.5, 'F');
      this.setDraw(doc, pal.muted);
      doc.setLineWidth(0.15);
      doc.rect(8, y, PW-16, 6.5, 'S');
      this.text(doc, label, 11, y+4.5, isHeader ? pal.accent : pal.primary, isHeader?7:8, isHeader?'bold':'normal');
      if (!isHeader) {
        let x = 8 + colW[0];
        for (let i=1;i<4;i++) {
          this.text(doc, '$', x + colW[i]/2 - 3, y+4.5, pal.muted, 7);
          this.line(doc, x+5, y+4.5, x+colW[i]-3, y+4.5, pal.muted, 0.3);
          x += colW[i];
        }
      }
    };

    drawTableHeader(y); y += 7;
    drawRow(y, '▸ INCOME', false, true); y += 7;
    [['Salary / Wages', data.income1], ['Side / Freelance', data.income2], ['Other Income', data.income3]].forEach(([l,v],i) => {
      drawRow(y, l + (v ? `   $${v}` : ''), i%2===0); y += 7;
    });

    y += 2;
    drawRow(y, '▸ EXPENSES', false, true); y += 7;
    const expRows = [['Housing', data.housing], ['Utilities', data.utilities], ['Groceries', data.groceries],
      ['Transportation', data.transport], ['Insurance', data.insurance], ['Subscriptions', data.subscriptions],
      ['Entertainment', data.entertainment], ['Dining Out', data.dining], ['Healthcare', data.healthcare],
      ['Savings', data.savings], ['Debt Payments', data.debt], ['Miscellaneous', data.misc]];
    expRows.forEach(([l,v],i) => {
      if (y < PH - 20) { drawRow(y, l + (v ? `   $${v}` : ''), i%2===0); y += 7; }
    });

    if (data.notes && y < PH - 20) {
      y += 3;
      this.sectionTitle(doc, 8, y, 'Notes', pal, PW-16);
      y += 5;
      this.wrapText(doc, data.notes, 10, y, PW-20, 4.5, '#444444', 8);
    }

    this.footer(doc, pal, 'Monthly Budget Tracker');
  },

  /* ─── FINANCE: SAVINGS GOALS ────────────── */
  renderFinanceSavings(doc, data, pal) {
    const PW = 210, PH = 297;
    const monthly = parseFloat(data.monthly)||0;
    this.headerBand(doc, pal, 'SAVINGS GOAL PLANNER',
      monthly ? `Monthly Savings Budget: $${monthly.toFixed(2)}` : 'Track your financial goals', PW, 26);

    const goals = [
      { name: data.g1name, target: data.g1target, saved: data.g1saved, date: data.g1date },
      { name: data.g2name, target: data.g2target, saved: data.g2saved, date: data.g2date },
      { name: data.g3name, target: data.g3target, saved: data.g3saved, date: data.g3date },
      { name: data.g4name, target: data.g4target, saved: data.g4saved, date: data.g4date },
    ];

    let y = 32;
    goals.forEach((g, i) => {
      if (y > PH - 30) return;
      const name = g.name || `Goal ${i+1}`;
      const target = parseFloat(g.target)||0;
      const saved  = parseFloat(g.saved)||0;
      const pct    = target > 0 ? Math.round((saved/target)*100) : 0;

      const cardH = 28;
      this.setFill(doc, i%2===0 ? pal.light : '#FFFFFF');
      doc.rect(8, y, PW-16, cardH, 'F');
      this.setDraw(doc, pal.muted);
      doc.setLineWidth(0.2);
      doc.rect(8, y, PW-16, cardH, 'S');

      // Accent left strip
      this.rect(doc, 8, y, 3, cardH, pal.accent);

      // Name + date
      this.text(doc, name, 15, y+6, pal.primary, 10, 'bold');
      if (g.date) this.text(doc, `Target: ${g.date}`, PW-12, y+6, pal.muted, 7.5, 'normal', 'right');

      // Amount row
      this.text(doc, `Saved: $${saved.toFixed(2)}`, 15, y+13, pal.muted, 8);
      if (target) this.text(doc, `/ $${target.toFixed(2)} goal`, 60, y+13, pal.muted, 8);
      this.text(doc, `${pct}%`, PW-12, y+13, pct>=100 ? '#27AE60' : pal.accent, 9, 'bold', 'right');

      // Progress bar
      this.progressBar(doc, 15, y+17, PW-30, 4, pct, pal.muted+'55', pct>=100?'#27AE60':pal.accent);
      // Month estimate
      if (monthly > 0 && saved < target) {
        const remaining = target - saved;
        const months = Math.ceil(remaining / monthly);
        this.text(doc, `~${months} month${months!==1?'s':''} remaining at current rate`, 15, y+25, pal.muted, 6.5);
      }

      y += cardH + 3;
    });

    // Notes
    if (data.notes && y < PH - 20) {
      y += 2;
      this.sectionTitle(doc, 8, y, 'Strategy Notes', pal, PW-16);
      y += 5;
      this.wrapText(doc, data.notes, 10, y, PW-20, 4.5, '#444444', 8);
    }

    this.footer(doc, pal, 'Savings Goal Planner');
  },

  /* ─── FINANCE: DEBT PAYOFF ──────────────── */
  renderFinanceDebt(doc, data, pal) {
    const PW = 210, PH = 297;
    this.headerBand(doc, pal, 'DEBT PAYOFF TRACKER',
      `Strategy: ${data.strategy||'Avalanche (Highest Interest First)'}`, PW, 26);

    const debts = [
      { name: data.d1name, balance: data.d1balance, rate: data.d1rate, min: data.d1min },
      { name: data.d2name, balance: data.d2balance, rate: data.d2rate, min: data.d2min },
      { name: data.d3name, balance: data.d3balance, rate: data.d3rate, min: data.d3min },
      { name: data.d4name, balance: data.d4balance, rate: data.d4rate, min: data.d4min },
    ].filter(d => d.name);

    const extra = parseFloat(data.extra)||0;
    let totalBalance = 0, totalMin = 0;

    // Headers
    const cols = ['DEBT NAME','BALANCE','INTEREST %','MIN PAYMENT','STATUS'];
    const colWs = [65,35,30,35,25];
    let y = 32;

    this.rect(doc, 8, y, PW-16, 7, pal.primary);
    let hx = 8;
    cols.forEach((h,i) => {
      this.text(doc, h, hx+colWs[i]/2, y+5, '#FFFFFF', 6.5, 'bold', 'center');
      hx += colWs[i];
    });
    y += 8;

    debts.forEach((d, i) => {
      const bal = parseFloat(d.balance)||0;
      const min = parseFloat(d.min)||0;
      totalBalance += bal;
      totalMin += min;

      this.setFill(doc, i%2===0 ? pal.light : '#FFFFFF');
      doc.rect(8, y, PW-16, 10, 'F');
      this.setDraw(doc, pal.muted);
      doc.setLineWidth(0.15);
      doc.rect(8, y, PW-16, 10, 'S');

      let dx = 8;
      this.text(doc, d.name||'', dx+3, y+7, pal.primary, 8.5, 'bold');
      dx += colWs[0];
      this.text(doc, bal ? `$${bal.toFixed(2)}` : '$___', dx+colWs[1]/2, y+7, pal.primary, 8, 'normal', 'center');
      dx += colWs[1];
      const rateColor = (parseFloat(d.rate)||0) > 15 ? '#E74C3C' : (parseFloat(d.rate)||0) > 5 ? '#E67E22' : '#27AE60';
      this.text(doc, d.rate ? `${d.rate}%` : '_%', dx+colWs[2]/2, y+7, rateColor, 8, 'bold', 'center');
      dx += colWs[2];
      this.text(doc, min ? `$${min.toFixed(2)}` : '$___', dx+colWs[3]/2, y+7, pal.primary, 8, 'normal', 'center');
      dx += colWs[3];
      this.checkbox(doc, dx+colWs[4]/2-3, y+5, 5, pal.muted);

      y += 11;
    });

    // Totals row
    this.rect(doc, 8, y, PW-16, 9, pal.secondary);
    this.text(doc, 'TOTALS', 12, y+6, pal.accent, 8, 'bold');
    this.text(doc, `$${totalBalance.toFixed(2)}`, 8+colWs[0]+colWs[1]/2, y+6, '#FFFFFF', 8, 'bold', 'center');
    this.text(doc, `$${totalMin.toFixed(2)}/mo`, 8+colWs[0]+colWs[1]+colWs[2]+colWs[3]/2, y+6, '#FFFFFF', 8, 'bold', 'center');
    y += 12;

    // Summary stats
    if (extra || totalBalance) {
      this.rect(doc, 8, y, PW-16, 16, pal.light);
      this.text(doc, `Extra Monthly Payment: $${extra.toFixed(2)}`, 12, y+6, pal.primary, 8, 'bold');
      this.text(doc, `Total Monthly: $${(totalMin+extra).toFixed(2)}`, 12, y+12, pal.muted, 7.5);
      if (totalBalance > 0 && (totalMin+extra) > 0) {
        const months = Math.ceil(totalBalance / (totalMin + extra));
        const yrs = Math.floor(months/12), mos = months%12;
        this.text(doc, `Est. payoff: ${yrs>0?yrs+'y ':''}${mos}m`, PW/2, y+6, pal.accent, 9, 'bold', 'center');
        this.text(doc, `Interest saved with extra payments!`, PW/2, y+12, pal.muted, 7, 'italic', 'center');
      }
      y += 20;
    }

    if (data.notes) {
      this.sectionTitle(doc, 8, y, 'My Why / Motivation', pal, PW-16);
      y += 5;
      this.wrapText(doc, data.notes, 10, y, PW-20, 4.5, '#444444', 8.5);
    }

    this.footer(doc, pal, 'Debt Payoff Tracker');
  },

  /* ─── SOCIAL: CONTENT CALENDAR ─────────── */
  renderSocialCalendar(doc, data, pal) {
    const PW = 210, PH = 297;
    this.headerBand(doc, pal, '30-DAY CONTENT CALENDAR', data.month||'Month', PW, 26);

    // Platform legend
    const platforms = [
      { k:'IG', c:'#E1306C' }, { k:'TT', c:'#000000' }, { k:'YT', c:'#FF0000' },
      { k:'FB', c:'#1877F2' }, { k:'LI', c:'#0A66C2' }
    ];
    let lx = 8;
    this.text(doc, 'PLATFORMS:', lx, 31.5, pal.muted, 6.5, 'bold');
    lx += 22;
    platforms.forEach(p => {
      const [r,g,b] = this.hexToRgb(p.c);
      doc.setFillColor(r,g,b);
      doc.roundedRect(lx, 28, 7, 5, 1, 1, 'F');
      this.text(doc, p.k, lx+3.5, 31.5, '#FFFFFF', 5.5, 'bold', 'center');
      lx += 9;
    });
    if (data.niche) this.text(doc, `Niche: ${data.niche}`, PW-12, 31.5, pal.muted, 6.5, 'italic', 'right');

    // Calendar grid
    const cols = ['MON','TUE','WED','THU','FRI','SAT/SUN'];
    const colW = (PW-16)/6;
    const topY = 36, cellH = (PH - 36 - 30) / 5;

    cols.forEach((d, i) => {
      const x = 8 + i*colW;
      this.rect(doc, x, topY, colW-0.5, 5.5, i===5 ? pal.accent : pal.secondary);
      this.text(doc, d, x+colW/2, topY+4, '#FFFFFF', 6, 'bold', 'center');
    });

    let dayN = 1;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 6; col++) {
        if (dayN > 30) break;
        const x = 8 + col*colW, cy = topY+5.5 + row*cellH;
        const isWknd = col===5;
        this.setFill(doc, isWknd ? '#FFF0F6' : '#FFFFFF');
        doc.rect(x, cy, colW-0.5, cellH-0.5, 'F');
        this.setDraw(doc, pal.muted);
        doc.setLineWidth(0.2);
        doc.rect(x, cy, colW-0.5, cellH-0.5, 'S');
        this.text(doc, String(dayN), x+2, cy+5, pal.accent, 8, 'bold');
        // Platform dots
        let px = x+2;
        platforms.forEach(p => {
          const [r,g,b] = this.hexToRgb(p.c);
          doc.setDrawColor(r,g,b);
          doc.setLineWidth(0.5);
          doc.circle(px+3, cy+10, 2, 'S');
          px += 6;
        });
        for (let l=0;l<2;l++) this.line(doc, x+2, cy+16+l*6, x+colW-3, cy+16+l*6, pal.muted, 0.25);
        dayN += isWknd ? 2 : 1;
      }
    }

    // Bottom strip
    const by = PH - 27;
    this.rect(doc, 8, by, PW-16, 6, pal.primary);
    this.text(doc, 'CONTENT PILLARS', PW/2, by+4.5, '#FFFFFF', 7, 'bold', 'center');
    this.rect(doc, 8, by+6, PW-16, 14, pal.light);
    [data.pillar1, data.pillar2, data.pillar3].filter(Boolean).forEach((p,i) => {
      this.rect(doc, 12 + i*62, by+8.5, 58, 9, pal.accent+'33');
      this.text(doc, p, 12 + i*62 + 29, by+14, pal.primary, 7.5, 'bold', 'center');
    });
    if (data.cta) this.text(doc, `CTA Goal: ${data.cta}`, PW/2, by+22, pal.muted, 6.5, 'italic', 'center');

    this.footer(doc, pal, '30-Day Content Calendar');
  },

  /* ─── SOCIAL: PLATFORM STRATEGY ─────────── */
  renderSocialStrategy(doc, data, pal) {
    const PW = 210, PH = 297;
    this.headerBand(doc, pal, 'PLATFORM STRATEGY PLANNER', 'Plan · Create · Grow', PW, 26);

    const platforms = [
      { name:'INSTAGRAM', hex:'#E1306C', fields:[
        ['Niche / Theme', data.ig_niche], ['Post Frequency', data.ig_freq],
        ['Content Pillars', data.ig_pillars], ['CTA / Bio Link', data.ig_cta]
      ]},
      { name:'TIKTOK', hex:'#111111', fields:[
        ['Niche / Theme', data.tt_niche], ['Post Frequency', data.tt_freq],
        ['Hook Formula', data.tt_hook], ['Content Goal', data.tt_goal||'']
      ]},
      { name:'YOUTUBE', hex:'#FF0000', fields:[
        ['Channel Niche', data.yt_niche], ['Upload Schedule', data.yt_freq],
        ['Video Series', data.yt_series], ['Monetization', data.yt_mono||'']
      ]},
      { name:'LINKEDIN', hex:'#0A66C2', fields:[
        ['Professional Niche', data.li_niche], ['Post Frequency', data.li_freq],
        ['Lead Magnet', data.li_lead], ['Networking Goal', data.li_net||'']
      ]},
    ];

    const cardW = (PW-18)/2, cardH = (PH-32)/2 - 3;

    platforms.forEach((p, i) => {
      const col = i%2, row = Math.floor(i/2);
      const x = 8 + col*(cardW+2), y = 31 + row*(cardH+3);
      const [r,g,b] = this.hexToRgb(p.hex);

      // Card bg
      this.setFill(doc, '#FFFFFF');
      doc.rect(x, y, cardW, cardH, 'F');
      doc.setDrawColor(r,g,b);
      doc.setLineWidth(0.7);
      doc.rect(x, y, cardW, cardH, 'S');

      // Header
      doc.setFillColor(r,g,b);
      doc.rect(x, y, cardW, 8, 'F');
      this.text(doc, p.name, x+cardW/2, y+5.5, '#FFFFFF', 9, 'bold', 'center');

      let fy = y + 13;
      p.fields.forEach(([label, val]) => {
        this.text(doc, label + ':', x+4, fy, p.hex, 6.5, 'bold');
        fy += 4;
        const display = val || '______________________________';
        doc.setFontSize(8); doc.setFont('helvetica', val?'normal':'italic');
        this.setTextColor(doc, val ? pal.primary : pal.muted);
        const lines = doc.splitTextToSize(display, cardW-8);
        lines.slice(0,2).forEach(l => { doc.text(l, x+4, fy); fy += 4.5; });
        this.line(doc, x+4, fy, x+cardW-4, fy, pal.muted, 0.3);
        fy += 4;
      });
    });

    if (data.notes) {
      const ny = 31 + cardH*2 + 8;
      if (ny < PH - 18) {
        this.sectionTitle(doc, 8, ny, 'Cross-Platform Notes', pal, PW-16);
        this.wrapText(doc, data.notes, 10, ny+5, PW-20, 4.5, '#444444', 8);
      }
    }

    this.footer(doc, pal, 'Platform Strategy Planner');
  },

  /* ─── SOCIAL: ANALYTICS TRACKER ─────────── */
  renderSocialAnalytics(doc, data, pal) {
    const PW = 210, PH = 297;
    this.headerBand(doc, pal, 'SOCIAL MEDIA ANALYTICS', `Period: ${data.period||'Month / Year'}`, PW, 26);

    const platCols = [
      { name:'Instagram', hex:'#E1306C', follow: data.ig_follow, reach: data.ig_reach,    eng: data.ig_eng },
      { name:'TikTok',    hex:'#111111', follow: data.tt_follow, reach: data.tt_views,    eng: data.tt_eng },
      { name:'YouTube',   hex:'#FF0000', follow: data.yt_subs,   reach: data.yt_views,    eng: data.yt_watch },
      { name:'LinkedIn',  hex:'#0A66C2', follow: data.li_follow, reach: data.li_impress,  eng: '' },
    ];

    let y = 31;

    // Platform summary cards
    const cardW = (PW-16)/4 - 1;
    platCols.forEach((p,i) => {
      const x = 8 + i*(cardW+1.3);
      const [r,g,b] = this.hexToRgb(p.hex);
      doc.setFillColor(r,g,b);
      doc.rect(x, y, cardW, 7, 'F');
      this.text(doc, p.name, x+cardW/2, y+5, '#FFFFFF', 7, 'bold', 'center');
      this.rect(doc, x, y+7, cardW, 20, i%2===0?pal.light:'#FFFFFF');
      this.setDraw(doc, p.hex);
      doc.setLineWidth(0.4);
      doc.rect(x, y, cardW, 27, 'S');

      this.text(doc, p.follow||'—', x+cardW/2, y+15, p.hex, 10, 'bold', 'center');
      this.text(doc, 'Followers/Subs', x+cardW/2, y+20, pal.muted, 5.5, 'normal', 'center');
      this.text(doc, (p.reach||'—') + ' reach', x+cardW/2, y+25, pal.primary, 6.5, 'normal', 'center');
      if (p.eng) this.text(doc, p.eng + '% eng.', x+cardW/2, y+29.5, '#27AE60', 6, 'bold', 'center');
    });

    y += 33;

    // Detailed metrics table
    const metrics = [
      ['Followers / Subscribers', data.ig_follow, data.tt_follow, data.yt_subs, data.li_follow],
      ['Impressions / Views', data.ig_reach, data.tt_views, data.yt_views, data.li_impress],
      ['Engagement Rate %', data.ig_eng, data.tt_eng, data.yt_watch+' hrs watch', '—'],
    ];
    const mColW = [(PW-16)*0.32, (PW-16)*0.17, (PW-16)*0.17, (PW-16)*0.17, (PW-16)*0.17];
    const mHeaders = ['METRIC','INSTAGRAM','TIKTOK','YOUTUBE','LINKEDIN'];

    this.rect(doc, 8, y, PW-16, 6.5, pal.primary);
    let hx = 8;
    mHeaders.forEach((h,i) => {
      this.text(doc, h, hx+mColW[i]/2, y+4.5, '#FFFFFF', 6, 'bold', 'center');
      hx += mColW[i];
    });
    y += 7;

    metrics.forEach((row, ri) => {
      this.setFill(doc, ri%2===0 ? pal.light : '#FFFFFF');
      doc.rect(8, y, PW-16, 7, 'F');
      this.setDraw(doc, pal.muted);
      doc.setLineWidth(0.15);
      doc.rect(8, y, PW-16, 7, 'S');
      let cx = 8;
      row.forEach((v, ci) => {
        this.text(doc, String(v||'—'), cx+mColW[ci]/2, y+5, ci===0?pal.primary:pal.accent, ci===0?7.5:8, ci===0?'bold':'normal', 'center');
        cx += mColW[ci];
      });
      y += 7.5;
    });

    y += 6;
    // Top/bottom posts
    if (data.best || data.worst) {
      const hh = 18;
      this.rect(doc, 8, y, (PW-18)/2, hh, pal.light);
      this.rect(doc, (PW+2)/2, y, (PW-18)/2, hh, '#FFF5F5');
      this.text(doc, '🏆 BEST PERFORMING', 12, y+5, '#27AE60', 7, 'bold');
      this.wrapText(doc, data.best||'—', 12, y+11, (PW-20)/2, 4.5, '#333333', 7.5);
      this.text(doc, '📉 LOWEST PERFORMING', (PW+6)/2, y+5, '#E74C3C', 7, 'bold');
      this.wrapText(doc, data.worst||'—', (PW+6)/2, y+11, (PW-20)/2, 4.5, '#333333', 7.5);
      y += hh + 5;
    }

    if (data.insights) {
      this.sectionTitle(doc, 8, y, 'Key Insights & Action Items', pal, PW-16);
      y += 5;
      this.wrapText(doc, data.insights, 10, y, PW-20, 4.5, '#333333', 8.5);
    }

    this.footer(doc, pal, 'Analytics Tracker');
  },

  /* ─── MAIN RENDERER ─────────────────────── */
  generate(templateId, formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });

    const allTemplates = [
      ...window.TEMPLATES.resumes,
      ...window.TEMPLATES.planners,
      ...window.TEMPLATES.finance,
      ...window.TEMPLATES.social,
    ];
    const tpl = allTemplates.find(t => t.id === templateId);
    if (!tpl) throw new Error('Template not found: ' + templateId);

    const pal = tpl.palette;
    const d = formData;

    const renderMap = {
      'resume-classic':    () => this.renderResumeClassic(doc, d, pal),
      'resume-modern':     () => this.renderResumeModern(doc, d, pal),
      'resume-creative':   () => this.renderResumeCreative(doc, d, pal),
      'planner-weekly':    () => this.renderPlannerWeekly(doc, d, pal),
      'planner-monthly':   () => this.renderPlannerMonthly(doc, d, pal),
      'planner-daily':     () => this.renderPlannerDaily(doc, d, pal),
      'finance-budget':    () => this.renderFinanceBudget(doc, d, pal),
      'finance-savings':   () => this.renderFinanceSavings(doc, d, pal),
      'finance-debt':      () => this.renderFinanceDebt(doc, d, pal),
      'social-calendar':   () => this.renderSocialCalendar(doc, d, pal),
      'social-strategy':   () => this.renderSocialStrategy(doc, d, pal),
      'social-analytics':  () => this.renderSocialAnalytics(doc, d, pal),
    };

    if (!renderMap[templateId]) throw new Error('No renderer for: ' + templateId);
    renderMap[templateId]();

    const safeName = (tpl.name || templateId).replace(/\s+/g,'_');
    doc.save(`${safeName}.pdf`);
  }
};
