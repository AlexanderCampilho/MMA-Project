const { Fragment } = React;

function WelcomeScreen(v) {
  return (
    <div style={css(`flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:0 20px calc(30px + env(safe-area-inset-bottom))`)}>
      <div style={css(`padding:calc(8px + env(safe-area-inset-top)) 0 22px;display:flex;align-items:center;gap:10px`)}>
        <div style={css(`width:30px;height:30px;border-radius:9px;background:#e8a33d`)}></div>
        <div style={css(`font:600 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.01em`)}>Cage Clash</div>
      </div>
      <div style={css(`font:400 44px/.98 'Anton',sans-serif;text-transform:uppercase`)}>{v.t_w_hero}</div>
      <div style={css(`margin-top:16px;font:400 16px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.6)`)}>{v.t_w_blurb}</div>

      <div style={css(`margin-top:26px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(235,235,245,.45);padding-left:4px`)}>{v.t_w_display_name}</div>
      <div style={css(`margin-top:8px;display:flex;align-items:center;gap:10px;background:#1c1c1e;border-radius:12px;padding:4px 4px 4px 14px`)}>
        <input value={v.name} onChange={v.onName} placeholder={v.t_w_name_ph} maxLength={20}
          style={css(`flex:1;min-width:0;background:transparent;border:0;outline:none;color:#fff;font:400 17px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;padding:14px 0`)} />
        <div onClick={v.createAccount} style={css(`cursor:pointer;flex:none;background:#e8a33d;color:#111;border-radius:9px;padding:12px 16px;font:600 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{v.t_w_continue}</div>
      </div>
      <div style={css(`margin-top:8px;padding-left:4px;font:400 13px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.45)`)}>{v.nameHint}</div>

      <div style={css(`margin-top:22px;background:#1c1c1e;border-radius:14px;padding:16px 16px 18px`)}>
        <div style={css(`font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.02em;color:#e8a33d;margin-bottom:8px`)}>{v.t_w_no_email}</div>
        <div style={css(`font:400 15px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.65)`)}>{v.t_w_no_email_body}</div>
      </div>
      <div style={css(`margin-top:auto;padding-top:24px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.35)`)}>
        {v.t_legal_short} {v.t_w_legal_tail} <a href="#terms">{v.t_w_terms}</a> {v.t_w_and} <a href="#privacy">{v.t_w_privacy}</a>.
      </div>
    </div>
  );
}

function AppHeader(v) {
  return (
    <div style={css(`flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:calc(4px + env(safe-area-inset-top)) 16px 10px;background:rgba(10,10,11,.86);backdrop-filter:blur(14px);border-bottom:.5px solid rgba(84,84,88,.5)`)}>
      <div style={css(`display:flex;flex-direction:column;gap:7px;min-width:0`)}>
        <div onClick={v.goHome} style={css(`cursor:pointer;display:flex;align-items:center;gap:8px;min-width:0`)}>
          <div style={css(`width:22px;height:22px;border-radius:7px;background:#e8a33d;flex:none`)}></div>
          <span style={css(`font:600 16px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>Cage Clash</span>
        </div>
        <div onClick={v.goPacks} style={css(`cursor:pointer;display:inline-flex;align-items:center;gap:7px;align-self:flex-start;border-radius:8px;padding:5px 8px;background:${v.packChipBg}`)}>
          <span style={css(`display:flex;align-items:flex-end;gap:2px;flex:none`)}>
            <span style={css(`width:5px;height:11px;border-radius:1px;opacity:.5;background:${v.packChipInk}`)}></span>
            <span style={css(`width:5px;height:14px;border-radius:1px;opacity:.75;background:${v.packChipInk}`)}></span>
            <span style={css(`width:5px;height:17px;border-radius:1px;background:${v.packChipInk}`)}></span>
          </span>
          <span style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.03em;white-space:nowrap;color:${v.packChipInk}`)}>{v.packChipLabel}</span>
        </div>
      </div>
      <div style={css(`display:flex;align-items:center;gap:8px;flex:none`)}>
        <div onClick={v.cycleLang} style={css(`cursor:pointer;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.75);background:#2c2c2e;border-radius:20px;padding:8px 10px`)}>{v.langCode}</div>
        <div onClick={v.refreshAction} style={css(`cursor:pointer;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d;background:rgba(232,163,61,.14);border-radius:20px;padding:8px 11px;white-space:nowrap`)}>{v.refreshLabel}</div>
        <div style={css(`font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.6);white-space:nowrap`)}>{v.points}</div>
      </div>
    </div>
  );
}

function BottomNav(v) {
  const item = (active, onClick, shape, label) => (
    <div onClick={onClick} style={css(`cursor:pointer;flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;padding:2px 0`)}>
      {shape(active)}
      <span style={css(`font:600 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:${active ? '#e8a33d' : 'rgba(235,235,245,.45)'}`)}>{label}</span>
    </div>
  );
  return (
    <div style={css(`flex:none;background:rgba(10,10,11,.94);backdrop-filter:blur(14px);border-top:.5px solid rgba(84,84,88,.5);padding:8px 0 calc(10px + env(safe-area-inset-bottom));display:flex`)}>
      {item(v.navHome, v.goHome, on => <span style={css(`display:block;width:19px;height:15px;border-radius:3px;${on ? 'background:#e8a33d' : 'box-shadow:inset 0 0 0 1.8px rgba(235,235,245,.45)'}`)}></span>, v.t_n_this_card)}
      {item(v.navCards, v.goCards, on => <span style={css(`display:block;width:15px;height:15px;transform:rotate(45deg);${on ? 'background:#e8a33d' : 'box-shadow:inset 0 0 0 1.8px rgba(235,235,245,.45)'}`)}></span>, v.t_n_cards)}
      {item(v.navMine, v.goMyPicks, on => <span style={css(`display:block;width:16px;height:16px;border-radius:50%;${on ? 'background:#e8a33d' : 'box-shadow:inset 0 0 0 1.8px rgba(235,235,245,.45)'}`)}></span>, v.t_n_my_picks)}
    </div>
  );
}

function SectionHeading({ label, right }) {
  return (
    <div style={css(`display:flex;align-items:baseline;justify-content:space-between;padding:0 4px 9px`)}>
      <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#e8a33d`)}>{label}</span>
      {right != null && <span style={css(`font:400 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{right}</span>}
    </div>
  );
}

function StandingsList({ rows, extra }) {
  return (
    <div style={css(`background:#1c1c1e;border-radius:14px;overflow:hidden`)}>
      {rows.map((s, i) => (
        <div key={i} style={css(`display:grid;grid-template-columns:26px minmax(0,1fr) auto${extra ? ' auto' : ''};align-items:center;gap:10px;padding:13px 16px;border-top:.5px solid rgba(84,84,88,.4);background:${s.bg}`)}>
          <span style={css(`font:400 17px/1 'Anton',sans-serif;color:${s.rankColor}`)}>{s.rank}</span>
          <span style={css(`font:500 15px/1.2 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{s.name}</span>
          {extra && <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap;color:${s.deltaColor}`)}>{s.delta}</span>}
          <span style={css(`font:600 14px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:${s.ptsColor}`)}>{s.pts}</span>
        </div>
      ))}
    </div>
  );
}

function SlateList({ slate }) {
  return (
    <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
      {slate.map((s, i) => (
        <div key={i} onClick={s.open} style={css(`cursor:pointer;background:#1c1c1e;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px`)}>
          <div style={css(`width:4px;align-self:stretch;border-radius:2px;flex:none;background:${s.edge}`)}></div>
          <div style={css(`flex:1;min-width:0`)}>
            <div style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:6px`)}>{s.slot}</div>
            <div style={css(`font:400 19px/1.05 'Anton',sans-serif;text-transform:uppercase`)}>{s.fight}</div>
            <div style={css(`margin-top:7px;font:400 13px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:${s.pickColor}`)}>{s.pick}</div>
          </div>
          <div style={css(`flex:none;font:400 17px/1 'Anton',sans-serif;color:#e8a33d`)}>{s.max}</div>
        </div>
      ))}
    </div>
  );
}

function HomeScreen(v) {
  return (
    <div style={css(`padding:14px 16px 28px`)}>
      <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#e8a33d`)}>{v.heroTag}</div>
      <div style={css(`margin-top:9px;font:400 40px/.94 'Anton',sans-serif;text-transform:uppercase`)}>{v.eventName}</div>
      <div style={css(`margin-top:8px;font:400 15px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.eventWhen}</div>

      <div style={css(`margin-top:16px;background:#1c1c1e;border-radius:16px;padding:18px 16px`)}>
        <div style={css(`display:flex;align-items:flex-end;justify-content:space-between;gap:12px`)}>
          <div>
            <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:8px`)}>{v.clockLabel}</div>
            <div style={css(`font:400 34px/1 'Anton',sans-serif;color:#e8a33d`)}>{v.countdown}</div>
          </div>
          <div onClick={v.heroAction} style={css(`cursor:pointer;flex:none;background:#e8a33d;color:#111;border-radius:11px;padding:13px 15px;font:600 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{v.heroCta}</div>
        </div>
        <div style={css(`margin-top:16px;height:6px;border-radius:3px;background:#2c2c2e;overflow:hidden`)}>
          <div style={css(`height:6px;background:#e8a33d;width:${v.progressPct}`)}></div>
        </div>
        <div style={css(`margin-top:9px;font:400 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{v.progressLabel}</div>
        <div style={css(`margin-top:15px;padding-top:14px;border-top:.5px solid rgba(84,84,88,.5);display:flex;gap:7px;flex-wrap:wrap;font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.03em`)}>
          <span style={css(`padding:7px 10px;border-radius:20px;background:#2c2c2e;color:rgba(235,235,245,.6)`)}>{v.tEarlyShort}</span>
          <span style={css(`padding:7px 10px;border-radius:20px;background:#2c2c2e;color:rgba(235,235,245,.6)`)}>{v.tPrelimShort}</span>
          <span style={css(`padding:7px 10px;border-radius:20px;background:rgba(232,163,61,.16);color:#e8a33d`)}>{v.tMainShort}</span>
        </div>
        <div style={css(`margin-top:10px;font:400 12px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.35)`)}>{v.t_h_bouts_note}</div>
        <div style={css(`margin-top:12px;background:rgba(232,163,61,.12);border-radius:11px;padding:12px 14px;font:400 13px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8c68d`)}>{v.scheduleBanner}</div>
        <div style={css(`margin-top:12px;display:flex;align-items:center;gap:10px`)}>
          <span style={css(`flex:1;font:400 12px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{v.tzLabel}</span>
          <span onClick={v.cycleTz} style={css(`cursor:pointer;flex:none;background:#2c2c2e;border-radius:20px;padding:8px 12px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d`)}>{v.t_change}</span>
        </div>
      </div>

      <div style={css(`margin-top:26px`)}>
        <SectionHeading label={v.t_h_full_card} right={v.progressLabel} />
        <div style={css(`padding:0 4px 12px;font:400 13px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{v.cardNote}</div>
        <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
          {v.cardBouts.map((b, i) => (
            <div key={i} onClick={b.open} style={css(`cursor:pointer;display:flex;align-items:center;gap:12px;background:#1c1c1e;border-radius:14px;padding:14px 14px 14px 16px`)}>
              <div style={css(`flex:none;display:flex;align-items:center`)}>
                <div style={css(`width:38px;height:38px;border-radius:19px;box-shadow:0 0 0 2px #1c1c1e;display:grid;place-items:center;overflow:hidden;background:${b.aArt}`)}><span style={css(`font:400 12px/1 'Anton',sans-serif;color:rgba(255,255,255,.85)`)}>{b.aMono}</span></div>
                <div style={css(`width:38px;height:38px;border-radius:19px;margin-left:-11px;box-shadow:0 0 0 2px #1c1c1e;display:grid;place-items:center;overflow:hidden;background:${b.bArt}`)}><span style={css(`font:400 12px/1 'Anton',sans-serif;color:rgba(255,255,255,.85)`)}>{b.bMono}</span></div>
              </div>
              <div style={css(`flex:1;min-width:0`)}>
                <div style={css(`font:600 11px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:7px`)}><span style={css(`color:rgba(235,235,245,.28)`)}>{b.num}</span> {b.meta}</div>
                <div style={css(`font:400 20px/1.1 'Anton',sans-serif;text-transform:uppercase`)}>{b.a} <span style={css(`color:rgba(235,235,245,.4);font-size:13px`)}>{v.t_vs}</span> {b.b}</div>
                {b.picked && <div style={css(`margin-top:8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d`)}>{b.pickLabel}</div>}
                {b.needsPick && <div style={css(`margin-top:8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d`)}>{v.t_h_add_pick}</div>}
                {b.missed && <div style={css(`margin-top:8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{v.t_no_pick_pts}</div>}
              </div>
              <span style={css(`flex:none;font:400 22px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.3)`)}>›</span>
            </div>
          ))}
        </div>
      </div>

      <div style={css(`margin-top:26px`)}><SectionHeading label={v.t_standings} right={v.memberCount} /></div>
      <StandingsList rows={v.standings} />

      {v.hasLastSettled && (
        <div onClick={v.goRecap} style={css(`cursor:pointer;margin-top:14px;background:#1c1c1e;border-radius:14px;padding:16px;display:flex;align-items:center;gap:10px`)}>
          <div style={css(`flex:1;min-width:0`)}>
            <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:8px`)}>{v.lastSettledEvent}</div>
            <div style={css(`font:400 22px/1 'Anton',sans-serif;text-transform:uppercase`)}>{v.lastSettledScore}</div>
            <div style={css(`margin-top:8px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.lastSettledNote}</div>
          </div>
          <span style={css(`flex:none;font:400 22px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.3)`)}>›</span>
        </div>
      )}

      <div style={css(`margin-top:14px;background:#1c1c1e;border-radius:14px;padding:16px;display:flex;align-items:center;justify-content:space-between;gap:12px`)}>
        <div>
          <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:8px`)}>{v.t_invite_code}</div>
          <div style={css(`font:400 20px/1 'Anton',sans-serif;letter-spacing:.05em;color:#e8a33d`)}>CLASH-8821</div>
        </div>
        <div onClick={v.copyInvite} style={css(`cursor:pointer;flex:none;background:#2c2c2e;border-radius:20px;padding:11px 14px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#fff;text-align:center`)}>{v.copyLabel}</div>
      </div>

      <div style={css(`margin-top:18px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>{v.t_legal_short}</div>
    </div>
  );
}

function CardsScreen(v) {
  return (
    <div style={css(`padding:14px 16px 28px`)}>
      <div style={css(`font:400 34px/1 'Anton',sans-serif;text-transform:uppercase`)}>{v.t_c_title}</div>
      <div style={css(`margin-top:8px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{v.todayLabel}</div>

      <div style={css(`margin-top:22px`)}><SectionHeading label={v.t_c_open_now} /></div>
      <div onClick={v.openLiveCard} style={css(`cursor:pointer;background:#1c1c1e;border-radius:14px;padding:16px;display:flex;align-items:center;gap:12px`)}>
        <div style={css(`flex:1;min-width:0`)}>
          <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px`)}>
            <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.04em;color:#e8a33d`)}>{v.liveStatus}</span>
            <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4);white-space:nowrap`)}>{v.liveDate}</span>
          </div>
          <div style={css(`margin-top:10px;font:400 24px/1.1 'Anton',sans-serif;text-transform:uppercase`)}>{v.liveName}</div>
          <div style={css(`margin-top:8px;font:400 14px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{v.liveVenue}</div>
        </div>
        <span style={css(`flex:none;font:400 22px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.3)`)}>›</span>
      </div>

      <div style={css(`margin-top:24px`)}><SectionHeading label={v.t_c_coming} right={v.t_c_7days} /></div>
      <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
        {v.upcomingEvents.map((e, i) => (
          <div key={i} style={css(`background:#1c1c1e;border-radius:14px;padding:16px`)}>
            <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px`)}>
              <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.04em;color:rgba(235,235,245,.45)`)}>{e.note}</span>
              <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4);white-space:nowrap`)}>{e.date}</span>
            </div>
            <div style={css(`margin-top:10px;font:400 22px/1.1 'Anton',sans-serif;text-transform:uppercase;color:rgba(235,235,245,.8)`)}>{e.name}</div>
            <div style={css(`margin-top:8px;font:400 14px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{e.venue}</div>
          </div>
        ))}
      </div>

      <div style={css(`margin-top:24px`)}><SectionHeading label={v.t_c_results} right={v.t_c_newest} /></div>
      <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
        {v.pastEvents.map((e, i) => (
          <div key={i} onClick={e.open} style={css(`cursor:pointer;background:#1c1c1e;border-radius:14px;padding:16px;display:flex;align-items:center;gap:12px`)}>
            <div style={css(`flex:1;min-width:0`)}>
              <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px`)}>
                <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.04em;color:${e.badgeColor}`)}>{e.badge}</span>
                <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4);white-space:nowrap`)}>{e.date}</span>
              </div>
              <div style={css(`margin-top:10px;font:400 22px/1.1 'Anton',sans-serif;text-transform:uppercase;color:rgba(235,235,245,.85)`)}>{e.name}</div>
              <div style={css(`margin-top:8px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{e.status}</div>
            </div>
            <span style={css(`flex:none;font:400 22px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.3)`)}>›</span>
          </div>
        ))}
      </div>

      <div style={css(`margin-top:18px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>{v.t_c_footer}</div>
    </div>
  );
}

function PacksScreen(v) {
  return (
    <div style={css(`padding:14px 16px 28px`)}>
      <div style={css(`font:400 34px/1 'Anton',sans-serif;text-transform:uppercase`)}>{v.t_p_title}</div>
      <div style={css(`margin-top:8px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{v.t_p_sub}</div>

      <div style={css(`margin-top:18px;background:#1c1c1e;border-radius:16px;padding:18px 16px`)}>
        <div style={css(`display:flex;align-items:center;gap:16px`)}>
          <div style={css(`flex:none;width:74px;height:98px;border-radius:12px;background:linear-gradient(160deg,#2f2a22 0%,#1a1613 100%);box-shadow:inset 0 0 0 1.5px rgba(232,163,61,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px`)}>
            <span style={css(`font:400 15px/1 'Anton',sans-serif;color:#e8a33d;letter-spacing:.06em`)}>{v.t_pack_word}</span>
            <span style={css(`width:26px;height:1px;background:rgba(232,163,61,.5)`)}></span>
            <span style={css(`font:600 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.45)`)}>{v.packCount}</span>
          </div>
          <div style={css(`flex:1;min-width:0`)}>
            <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e8a33d;margin-bottom:8px`)}>{v.packStateTag}</div>
            <div style={css(`font:400 15px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.65)`)}>{v.packStateNote}</div>
            <div onClick={v.openPack} style={css(`cursor:pointer;margin-top:13px;border-radius:12px;padding:14px;text-align:center;font:600 16px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;background:${v.packBtnBg};color:${v.packBtnInk}`)}>{v.packBtnLabel}</div>
          </div>
        </div>
      </div>

      {v.hasReveal && (
        <div style={css(`margin-top:16px;background:#1c1c1e;border-radius:16px;padding:18px 16px`)}>
          <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;color:${v.revealRing}`)}>{v.revealTag}</div>
          <div style={css(`display:flex;gap:16px;align-items:center`)}>
            <div style={css(`flex:none;width:112px;height:154px;border-radius:14px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;background:${v.revealBg};box-shadow:inset 0 0 0 2px ${v.revealRing}`)}>
              <div style={css(`font:600 9px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${v.revealRing}`)}>{v.revealRarity}</div>
              <div style={css(`display:flex;justify-content:center`)}><div style={css(`width:88px;height:88px;border-radius:10px;display:grid;place-items:center;overflow:hidden;background:${v.revealArt}`)}><span style={css(`font:400 30px/1 'Anton',sans-serif;color:rgba(255,255,255,.88)`)}>{v.revealMonogram}</span></div></div>
              <div>
                <div style={css(`font:400 15px/1.05 'Anton',sans-serif;text-transform:uppercase;color:#fff`)}>{v.revealName}</div>
                <div style={css(`margin-top:5px;font:400 9px/1.3 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.revealDiv}</div>
              </div>
            </div>
            <div style={css(`flex:1;min-width:0`)}>
              <div style={css(`font:400 24px/1.05 'Anton',sans-serif;text-transform:uppercase`)}>{v.revealName}</div>
              <div style={css(`margin-top:9px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.revealMeta}</div>
              <div style={css(`margin-top:13px;font:400 14px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.65)`)}>{v.revealNote}</div>
            </div>
          </div>
        </div>
      )}

      <div style={css(`margin-top:24px`)}><SectionHeading label={v.t_p_roster} right={v.rosterCount} /></div>
      <div style={css(`display:flex;gap:6px;overflow-x:auto;padding:0 0 12px`)}>
        {v.divFilters.map((d, i) => (
          <div key={i} onClick={d.set} style={css(`cursor:pointer;position:relative;flex:none;border-radius:20px;padding:9px 13px;background:#1c1c1e`)}>
            {d.sel && <span style={css(`position:absolute;inset:0;border-radius:20px;background:rgba(232,163,61,.18);box-shadow:inset 0 0 0 1.5px #e8a33d`)}></span>}
            <span style={css(`position:relative;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap;color:#fff`)}>{d.label}</span>
          </div>
        ))}
      </div>
      <div style={css(`display:flex;align-items:center;gap:10px;margin-bottom:12px`)}>
        <div onClick={v.toggleOwnedOnly} style={css(`cursor:pointer;flex:none;border-radius:20px;padding:9px 13px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap;background:${v.ownedOnlyBg};color:${v.ownedOnlyInk}`)}>{v.ownedOnlyLabel}</div>
        <span style={css(`flex:1;min-width:0;font:400 11px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{v.tierRule} · {v.t_p_synced}</span>
      </div>
      <div style={css(`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px`)}>
        {v.roster.map((c, i) => (
          <div key={i} style={css(`border-radius:12px;padding:10px;height:132px;display:flex;flex-direction:column;justify-content:space-between;background:${c.bg};box-shadow:inset 0 0 0 1.5px ${c.ring};opacity:${c.opacity}`)}>
            <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:6px`)}>
              <span style={css(`font:600 8px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${c.ring}`)}>{c.rarity}</span>
              <span style={css(`font:600 9px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.45)`)}>{c.dupes}</span>
            </div>
            <div style={css(`font:600 9px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.5);margin-top:-2px`)}>{c.rank}</div>
            <div style={css(`display:flex;justify-content:center`)}><div style={css(`width:54px;height:58px;border-radius:8px;display:grid;place-items:center;overflow:hidden;background:${c.art}`)}><span style={css(`font:400 20px/1 'Anton',sans-serif;color:rgba(255,255,255,.85)`)}>{c.monogram}</span></div></div>
            <div>
              <div style={css(`font:400 12px/1.05 'Anton',sans-serif;text-transform:uppercase;color:#fff`)}>{c.name}</div>
              <div style={css(`margin-top:4px;font:400 8px/1.25 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{c.div}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={css(`margin-top:16px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>{v.t_p_footer}</div>
    </div>
  );
}

function FighterCorner({ art, mono, name, rec, form, sel, onClick, label }) {
  return (
    <div onClick={onClick} style={css(`cursor:pointer;position:relative;background:#1c1c1e;border-radius:16px;padding:16px`)}>
      {sel && <span style={css(`position:absolute;inset:0;border-radius:16px;background:rgba(232,163,61,.14);box-shadow:inset 0 0 0 2px #e8a33d`)}></span>}
      <div style={css(`position:relative;display:flex;align-items:center;gap:12px`)}>
        <div style={css(`flex:none;width:62px;height:76px;border-radius:10px;display:grid;place-items:center;overflow:hidden;background:${art}`)}><span style={css(`font:400 20px/1 'Anton',sans-serif;color:rgba(255,255,255,.85)`)}>{mono}</span></div>
        <div style={css(`flex:1;min-width:0`)}>
          <div style={css(`font:400 26px/1.05 'Anton',sans-serif;text-transform:uppercase`)}>{name}</div>
          <div style={css(`margin-top:8px;font:400 13px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{rec}</div>
          {form && <div style={css(`font:400 13px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{form}</div>}
        </div>
        <div style={css(`flex:none;width:26px;height:26px;border-radius:13px;box-shadow:inset 0 0 0 1.5px rgba(235,235,245,.3);display:grid;place-items:center`)}>
          {sel && <span style={css(`width:26px;height:26px;border-radius:13px;background:#e8a33d;color:#111;font:700 15px/26px -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;text-align:center`)}>✓</span>}
        </div>
      </div>
      <div style={css(`position:relative;margin-top:10px;font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e8a33d`)}>{label}</div>
    </div>
  );
}

function IntelColumn({ v, i, t }) {
  return (
    <div>
      <div style={css(`display:flex;align-items:center;gap:8px`)}>
        <div style={css(`flex:none;width:26px;height:26px;border-radius:7px;display:grid;place-items:center;overflow:hidden;background:${i.art}`)}><span style={css(`font:400 10px/1 'Anton',sans-serif;color:rgba(255,255,255,.85)`)}>{i.mono}</span></div>
        <div style={css(`min-width:0`)}><div style={css(`font:400 15px/1 'Anton',sans-serif;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{i.short}</div></div>
      </div>
      <div style={css(`margin-top:9px;font:400 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{i.rec}</div>
      <div style={css(`margin-top:14px;font:600 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.4)`)}>{t.t_f_last5}</div>
      <div style={css(`margin-top:8px;display:flex;gap:4px`)}>
        {i.form.map((r, ri) => <span key={ri} style={css(`width:20px;height:20px;border-radius:6px;display:grid;place-items:center;font:700 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;background:${r.bg};color:${r.ink}`)}>{r.k}</span>)}
      </div>
      <div style={css(`margin-top:8px;font:400 11px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{i.formNote}</div>
      <div style={css(`margin-top:14px;font:600 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.4)`)}>{t.t_f_win_methods}</div>
      <div style={css(`margin-top:9px;display:flex;flex-direction:column;gap:9px`)}>
        {[['t_f_ko', i.koPct, '#e8a33d'], ['t_f_sub', i.subPct, '#5fc98a'], ['t_f_dec', i.decPct, '#a99f92']].map(([lk, pct, color]) => (
          <div key={lk}>
            <div style={css(`display:flex;justify-content:space-between;gap:6px;font:400 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55);margin-bottom:5px`)}><span>{t[lk]}</span><span style={css(`color:#fff`)}>{pct}</span></div>
            <div style={css(`height:5px;border-radius:3px;background:#2c2c2e;overflow:hidden`)}><div style={css(`height:5px;border-radius:3px;width:${pct};background:${color}`)}></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FightScreen(v) {
  return (
    <div style={css(`padding:6px 16px 24px`)}>
      <div onClick={v.goHome} style={css(`cursor:pointer;display:flex;align-items:center;gap:4px;padding:8px 0 14px;font:400 17px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d`)}><span style={css(`font-size:24px;line-height:.8`)}>‹</span>{v.eventName}</div>
      <div style={css(`display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px`)}>
        <div onClick={v.goPrevBout} style={css(`cursor:pointer;background:#1c1c1e;border-radius:20px;padding:9px 13px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.7);white-space:nowrap`)}>‹ {v.prevLabel}</div>
        <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:#e8a33d;white-space:nowrap`)}>{v.boutPosition}</div>
        <div onClick={v.goNextBout} style={css(`cursor:pointer;background:#1c1c1e;border-radius:20px;padding:9px 13px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.7);white-space:nowrap`)}>{v.nextLabel} ›</div>
      </div>
      <div style={css(`font:600 12px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.fMeta}</div>
      <div style={css(`margin-top:5px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.03em;color:#e8a33d`)}>{v.lockLine}</div>

      <div style={css(`margin-top:14px;display:flex;flex-direction:column;gap:9px`)}>
        <FighterCorner art={v.fAArt} mono={v.fAMono} name={v.fA} rec={v.fARec} form={v.fAForm} sel={v.selA} onClick={v.pickA} label={v.labelA} />
        <FighterCorner art={v.fBArt} mono={v.fBMono} name={v.fB} rec={v.fBRec} form={v.fBForm} sel={v.selB} onClick={v.pickB} label={v.labelB} />
      </div>

      <div style={css(`margin-top:22px;background:#1c1c1e;border-radius:16px;padding:16px`)}>
        <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:15px`)}>
          <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_f_intel}</span>
          <span style={css(`font:400 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.35)`)}>{v.t_f_intel_src}</span>
        </div>
        <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:16px`)}>
          <IntelColumn v={v} i={v.iA} t={v} />
          <IntelColumn v={v} i={v.iB} t={v} />
        </div>
      </div>

      {v.detailed && (
        <div style={css(`margin-top:22px`)}>
          <div style={css(`padding:0 4px 8px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_f_deeper}</div>
          <div style={css(`padding:0 4px 14px;font:400 13px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.4)`)}>{v.deeperNote}</div>

          <div style={css(`padding:0 4px 8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.75)`)}>{v.t_f_finish_type}</div>
          <div style={css(`display:flex;gap:3px;background:#1c1c1e;border-radius:11px;padding:3px;margin-bottom:18px`)}>
            {v.methods.map((m, i) => (
              <div key={i} onClick={m.set} style={css(`cursor:pointer;position:relative;flex:1;min-width:0;border-radius:8px;padding:11px 4px;text-align:center`)}>
                {m.sel && <span style={css(`position:absolute;inset:0;border-radius:8px;background:rgba(232,163,61,.2);box-shadow:inset 0 0 0 1.5px #e8a33d`)}></span>}
                <span style={css(`position:relative;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap`)}>{m.label}</span>
              </div>
            ))}
          </div>

          <div style={css(`padding:0 4px 8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.75)`)}>{v.t_f_round}</div>
          <div style={css(`display:flex;gap:3px;background:#1c1c1e;border-radius:11px;padding:3px;margin-bottom:18px`)}>
            {v.rounds.map((r, i) => (
              <div key={i} onClick={r.set} style={css(`cursor:pointer;position:relative;flex:1;border-radius:8px;padding:11px 4px;text-align:center`)}>
                {r.sel && <span style={css(`position:absolute;inset:0;border-radius:8px;background:rgba(232,163,61,.2);box-shadow:inset 0 0 0 1.5px #e8a33d`)}></span>}
                <span style={css(`position:relative;font:600 14px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{r.label}</span>
              </div>
            ))}
          </div>

          <div style={css(`padding:0 4px 8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.75)`)}>{v.t_f_bonus}</div>
          <div style={css(`background:#1c1c1e;border-radius:14px;overflow:hidden`)}>
            {v.bonuses.map((x, i) => (
              <div key={i} onClick={x.set} style={css(`cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 16px;border-top:.5px solid rgba(84,84,88,.4)`)}>
                <span style={css(`font:400 16px/1.2 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{x.label}</span>
                {x.sel && <span style={css(`font:700 17px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d`)}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {v.showSplit && (
        <div style={css(`margin-top:22px;background:#1c1c1e;border-radius:14px;padding:16px`)}>
          <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:11px`)}>{v.t_f_leaning}</div>
          <div style={css(`display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap`)}>
            <span style={css(`color:#e8a33d`)}>{v.splitALabel}</span><span style={css(`color:rgba(235,235,245,.5)`)}>{v.splitBLabel}</span>
          </div>
          <div style={css(`display:flex;height:8px;border-radius:4px;overflow:hidden;background:#2c2c2e`)}><div style={css(`width:${v.splitAPct};background:#e8a33d`)}></div></div>
          <div style={css(`margin-top:11px;font:400 14px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.splitQuip}</div>
        </div>
      )}

      <div style={css(`margin-top:18px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>{v.t_f_footer}</div>

      <div style={css(`position:sticky;bottom:0;margin:12px -16px -24px;padding:12px 16px calc(16px + env(safe-area-inset-bottom));background:rgba(10,10,11,.92);backdrop-filter:blur(14px);border-top:.5px solid rgba(84,84,88,.5)`)}>
        <div style={css(`display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px`)}>
          <div style={css(`min-width:0`)}>
            <div style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:6px`)}>{v.t_f_your_call}</div>
            <div style={css(`font:400 17px/1 'Anton',sans-serif;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{v.callSummary}</div>
          </div>
          <div style={css(`flex:none;text-align:right`)}>
            <div style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:6px`)}>{v.t_f_max}</div>
            <div style={css(`font:400 17px/1 'Anton',sans-serif;color:#e8a33d`)}>{v.boutMax}</div>
          </div>
        </div>
        <div onClick={v.savePick} style={css(`cursor:pointer;background:#e8a33d;color:#111;border-radius:13px;padding:15px;text-align:center;font:600 17px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{v.saveLabel}</div>
        <div style={css(`margin-top:8px;text-align:center;font:400 12px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.35)`)}>{v.saveHint}</div>
      </div>
    </div>
  );
}

function ConfirmScreen(v) {
  const scoreRow = (label, val, color) => (
    <div style={css(`display:flex;justify-content:space-between;padding:13px 16px;border-top:.5px solid rgba(84,84,88,.4);font:400 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:${color || 'rgba(235,235,245,.6)'}`)}>
      <span>{label}</span><span style={css(`color:${color || '#fff'}`)}>{val}</span>
    </div>
  );
  return (
    <div>
      <div style={css(`padding:14px 16px 24px`)}>
        <div style={css(`display:inline-block;padding:7px 12px;border-radius:20px;background:rgba(95,201,138,.16);font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.04em;color:#5fc98a`)}>{v.confirmTag}</div>
        <div style={css(`margin-top:14px;font:400 32px/.98 'Anton',sans-serif;text-transform:uppercase`)}>{v.confirmHeadline}</div>
        <div style={css(`margin-top:12px;font:400 15px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.6)`)}>{v.confirmBlurb}</div>

        <div style={css(`margin-top:18px;background:#1c1c1e;border-radius:14px;padding:16px;display:flex;align-items:flex-end;justify-content:space-between`)}>
          <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_cf_max_haul}</div>
          <div style={css(`font:400 32px/1 'Anton',sans-serif;color:#e8a33d`)}>{v.maxHaul}</div>
        </div>

        <div style={css(`margin-top:22px`)}><SectionHeading label={v.t_cf_your_slate} right={v.lockNote} /></div>
        <SlateList slate={v.slate} />

        <div style={css(`margin-top:18px;background:#1c1c1e;border-radius:14px;overflow:hidden`)}>
          <div style={css(`padding:14px 16px;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.75)`)}>{v.t_cf_scoring}</div>
          {scoreRow(v.t_sc_winner, '+50')}
          {scoreRow(v.t_f_finish_type, '+30')}
          {scoreRow(v.t_sc_exact_round, '+40')}
          {scoreRow(v.t_f_bonus, '+25')}
          {scoreRow(v.t_sc_wrong_winner, '0')}
          {scoreRow(v.t_sc_weekly, '+100 · +250 · +500', '#e8a33d')}
        </div>
        <div style={css(`margin-top:12px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>{v.t_cf_rules_footer}</div>
      </div>
      <div style={css(`position:sticky;bottom:0;padding:12px 16px calc(16px + env(safe-area-inset-bottom));background:rgba(10,10,11,.92);backdrop-filter:blur(14px);border-top:.5px solid rgba(84,84,88,.5);display:flex;gap:9px`)}>
        <div onClick={v.goHome} style={css(`cursor:pointer;flex:none;background:#2c2c2e;border-radius:13px;padding:15px 18px;font:600 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{v.t_back}</div>
        <div onClick={v.lockAll} style={css(`cursor:pointer;flex:1;background:#e8a33d;color:#111;border-radius:13px;padding:15px;text-align:center;font:600 17px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}>{v.confirmCta}</div>
      </div>
    </div>
  );
}

function StatTile({ label, value, color }) {
  return (
    <div style={css(`background:#1c1c1e;border-radius:14px;padding:14px 12px`)}>
      <div style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:9px`)}>{label}</div>
      <div style={css(`font:400 22px/1 'Anton',sans-serif;color:${color || '#fff'}`)}>{value}</div>
    </div>
  );
}

function ProgressStat({ label, pct }) {
  return (
    <div>
      <div style={css(`display:flex;justify-content:space-between;font:400 14px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.6);margin-bottom:8px`)}><span>{label}</span><span style={css(`color:#fff`)}>{pct}%</span></div>
      <div style={css(`height:6px;border-radius:3px;background:#2c2c2e`)}><div style={css(`height:6px;border-radius:3px;width:${pct}%;background:#e8a33d`)}></div></div>
    </div>
  );
}

function MyPicksScreen(v) {
  return (
    <div style={css(`padding:14px 16px 28px`)}>
      <div style={css(`font:400 34px/1 'Anton',sans-serif;text-transform:uppercase`)}>{v.t_m_title}</div>
      <div style={css(`margin-top:8px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{v.t_m_sub}</div>

      <div style={css(`margin-top:16px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px`)}>
        <StatTile label={v.t_m_balance} value={v.points} color="#e8a33d" />
        <StatTile label={v.t_m_hit_rate} value={v.hitRate} />
        <StatTile label={v.t_m_rank} value={v.myRank} />
      </div>

      <div style={css(`margin-top:24px`)}><SectionHeading label={v.t_m_collection} right={v.streakLabel} /></div>
      <div style={css(`background:#1c1c1e;border-radius:14px;padding:16px`)}>
        <div style={css(`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 10px`)}>
          {v.collection.map((c, i) => (
            <div key={i} style={css(`display:flex;flex-direction:column;align-items:center;gap:8px;opacity:${c.opacity}`)}>
              <div style={css(`width:60px;height:60px;border-radius:30px;display:grid;place-items:center;background:${c.bg};box-shadow:inset 0 0 0 2px ${c.ring}`)}><span style={css(`font:400 17px/1 'Anton',sans-serif;color:${c.ink}`)}>{c.glyph}</span></div>
              <span style={css(`font:600 11px/1.3 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;text-align:center;color:rgba(235,235,245,.75)`)}>{c.name}</span>
              <span style={css(`font:400 10px/1.2 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;text-align:center;color:${c.subColor}`)}>{c.sub}</span>
            </div>
          ))}
        </div>
        <div style={css(`margin-top:16px;padding-top:14px;border-top:.5px solid rgba(84,84,88,.5);font:400 13px/1.5 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.45)`)}>{v.t_m_collection_note}</div>
      </div>

      <div style={css(`margin-top:22px`)}><SectionHeading label={v.currentSlateHeading} /></div>
      <SlateList slate={v.slate} />

      <div style={css(`margin-top:22px;padding:0 4px 9px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_m_ledger}</div>
      <div style={css(`background:#1c1c1e;border-radius:14px;overflow:hidden`)}>
        {v.ledger.map((l, i) => (
          <div key={i} style={css(`display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:14px 16px;border-top:.5px solid rgba(84,84,88,.4)`)}>
            <div style={css(`min-width:0`)}>
              <div style={css(`font:500 15px/1.2 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{l.what}</div>
              <div style={css(`margin-top:5px;font:400 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.45)`)}>{l.date} · {l.detail}</div>
            </div>
            <div style={css(`font:400 17px/1 'Anton',sans-serif;color:${l.color}`)}>{l.pts}</div>
          </div>
        ))}
      </div>

      <div style={css(`margin-top:22px;padding:0 4px 9px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_m_strong}</div>
      <div style={css(`background:#1c1c1e;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:14px`)}>
        <ProgressStat label={v.t_m_winner_only} pct={78} />
        <ProgressStat label={v.t_f_finish_type} pct={52} />
        <ProgressStat label={v.t_sc_exact_round} pct={21} />
        <div style={css(`font:400 14px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.45)`)}>{v.t_m_strong_quip}</div>
      </div>

      <div style={css(`margin-top:22px;padding:0 4px 9px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_m_account}</div>
      <div style={css(`background:#1c1c1e;border-radius:14px;overflow:hidden`)}>
        <div style={css(`display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 12px 11px 16px`)}>
          <span style={css(`font:400 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.6)`)}>{v.t_m_language}</span>
          <div style={css(`display:flex;gap:3px;background:#2c2c2e;border-radius:9px;padding:3px`)}>
            {v.langOptions.map((l, i) => (
              <div key={i} onClick={l.set} style={css(`cursor:pointer;position:relative;border-radius:7px;padding:9px 12px`)}>
                {l.sel && <span style={css(`position:absolute;inset:0;border-radius:7px;background:rgba(232,163,61,.22);box-shadow:inset 0 0 0 1.5px #e8a33d`)}></span>}
                <span style={css(`position:relative;font:600 13px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap`)}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={css(`display:flex;justify-content:space-between;gap:12px;padding:14px 16px;border-top:.5px solid rgba(84,84,88,.4);font:400 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}><span style={css(`color:rgba(235,235,245,.6)`)}>{v.t_w_display_name}</span><span>{v.nameUpper}</span></div>
        <div style={css(`display:flex;justify-content:space-between;gap:12px;padding:14px 16px;border-top:.5px solid rgba(84,84,88,.4);font:400 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}><span style={css(`color:rgba(235,235,245,.6)`)}>{v.t_m_user_id}</span><span>u_8f31c2</span></div>
        <div style={css(`display:flex;justify-content:space-between;gap:12px;padding:14px 16px;border-top:.5px solid rgba(84,84,88,.4);font:400 15px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif`)}><span style={css(`color:rgba(235,235,245,.6)`)}>{v.t_m_joined}</span><span>12 Jul 2026</span></div>
        <div style={css(`display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 16px;border-top:.5px solid rgba(84,84,88,.4);font:400 16px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#e8a33d;cursor:pointer`)}>{v.t_m_report}<span style={css(`font-size:20px;color:rgba(235,235,245,.3)`)}>›</span></div>
        <div style={css(`display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 16px;border-top:.5px solid rgba(84,84,88,.4);font:400 16px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:#ff6b5e;cursor:pointer`)}>{v.t_m_delete}<span style={css(`font-size:20px;color:rgba(235,235,245,.3)`)}>›</span></div>
      </div>
      <div style={css(`margin-top:12px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>{v.t_m_delete_note}</div>
    </div>
  );
}

function RecapScreen(v) {
  return (
    <div style={css(`padding:14px 16px 28px`)}>
      <div style={css(`display:inline-block;padding:7px 12px;border-radius:20px;background:rgba(95,201,138,.16);font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.04em;color:#5fc98a`)}>{v.recapBadge}</div>
      <div style={css(`margin-top:14px;font:400 34px/1 'Anton',sans-serif;text-transform:uppercase`)}>{v.recapEvent}</div>
      <div style={css(`margin-top:9px;font:400 14px/1.4 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.5)`)}>{v.recapVenue}</div>

      <div style={css(`margin-top:16px;display:flex;gap:8px`)}>
        <div style={css(`flex:1;background:#1c1c1e;border-radius:14px;padding:14px 16px`)}><div style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:9px`)}>{v.t_r_correct}</div><div style={css(`font:400 28px/1 'Anton',sans-serif`)}>{v.recapScore}</div></div>
        <div style={css(`flex:1;background:#1c1c1e;border-radius:14px;padding:14px 16px`)}><div style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45);margin-bottom:9px`)}>{v.t_r_points_won}</div><div style={css(`font:400 28px/1 'Anton',sans-serif;color:#e8a33d`)}>{v.recapPts}</div></div>
      </div>
      <div style={css(`margin-top:12px;font:400 14px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.recapBlurb}</div>

      <div style={css(`margin-top:16px;background:#1c1c1e;border-radius:16px;padding:16px`)}>
        <div style={css(`display:flex;gap:14px;align-items:center`)}>
          <div style={css(`flex:none;width:64px;height:64px;border-radius:32px;display:grid;place-items:center;background:${v.unlockBg};box-shadow:inset 0 0 0 2px ${v.unlockRing}`)}><span style={css(`font:400 19px/1 'Anton',sans-serif;color:${v.unlockInk}`)}>{v.unlockGlyph}</span></div>
          <div style={css(`flex:1;min-width:0`)}>
            <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;margin-bottom:7px;color:${v.unlockRing}`)}>{v.unlockTag}</div>
            <div style={css(`font:400 20px/1.1 'Anton',sans-serif;text-transform:uppercase`)}>{v.unlockTitle}</div>
          </div>
        </div>
        <div style={css(`margin-top:13px;font:400 14px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.6)`)}>{v.unlockNote}</div>
        <div style={css(`margin-top:13px;padding-top:13px;border-top:.5px solid rgba(84,84,88,.5);display:flex;align-items:center;justify-content:space-between;gap:12px`)}>
          <span style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_r_weekly_bonus}</span>
          <span style={css(`font:400 20px/1 'Anton',sans-serif;color:${v.unlockRing}`)}>{v.unlockBonus}</span>
        </div>
      </div>

      <div style={css(`margin-top:18px;display:flex;gap:3px;background:#1c1c1e;border-radius:11px;padding:3px;overflow-x:auto`)}>
        {v.archiveTabs.map((t, i) => (
          <div key={i} onClick={t.open} style={css(`cursor:pointer;position:relative;flex:none;border-radius:8px;padding:11px 12px;text-align:center`)}>
            {t.sel && <span style={css(`position:absolute;inset:0;border-radius:8px;background:rgba(232,163,61,.2);box-shadow:inset 0 0 0 1.5px #e8a33d`)}></span>}
            <span style={css(`position:relative;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;white-space:nowrap`)}>{t.label}</span>
          </div>
        ))}
      </div>

      <div style={css(`margin-top:20px;padding:0 4px 9px;font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{v.t_r_bout_by_bout}</div>
      {v.noRecapRows && <div style={css(`background:#1c1c1e;border-radius:14px;padding:16px;font:400 14px/1.5 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.55)`)}>{v.noRowsNote}</div>}
      <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
        {v.recapRows.map((r, i) => (
          <div key={i} style={css(`background:#1c1c1e;border-radius:14px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start`)}>
            <div style={css(`width:4px;align-self:stretch;border-radius:2px;flex:none;background:${r.edge}`)}></div>
            <div style={css(`flex:1;min-width:0`)}>
              <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px`)}>
                <span style={css(`font:600 11px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:rgba(235,235,245,.45)`)}>{r.slot}</span>
                <span style={css(`font:400 17px/1 'Anton',sans-serif;white-space:nowrap;color:${r.ptsColor}`)}>{r.pts}</span>
              </div>
              <div style={css(`font:400 19px/1.05 'Anton',sans-serif;text-transform:uppercase`)}>{r.fight}</div>
              <div style={css(`margin-top:9px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px`)}>
                <div><div style={css(`font:600 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.4);margin-bottom:5px`)}>{v.t_r_you_said}</div><div style={css(`font:400 13px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.75)`)}>{r.said}</div></div>
                <div><div style={css(`font:600 10px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(235,235,245,.4);margin-bottom:5px`)}>{v.t_r_result}</div><div style={css(`font:400 13px/1.35 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:${r.resultColor}`)}>{r.result}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={css(`margin-top:22px`)}><SectionHeading label={v.standingsHeading} /></div>
      <StandingsList rows={v.recapStandings} extra />

      <div style={css(`margin-top:14px;background:#1c1c1e;border-radius:14px;padding:16px`)}>
        <div style={css(`font:600 12px/1 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:#e8a33d;margin-bottom:9px`)}>{v.t_r_chat}</div>
        <div style={css(`font:400 15px/1.45 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.7)`)}>{v.recapQuip}</div>
      </div>
      <div style={css(`margin-top:14px;padding:0 4px;font:400 12px/1.55 -apple-system,'SF Pro Text','Helvetica Neue',Helvetica,sans-serif;color:rgba(235,235,245,.32)`)}>
        {v.auditNote} {v.t_r_flag_q} <a href="#report">{v.t_r_flag_it}</a> {v.t_r_flag_tail}
      </div>
    </div>
  );
}

function App() {
  const v = useAppState();
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [v.route, v.boutPosition]);

  if (v.isWelcome) {
    return (
      <div style={css(`height:100vh;height:100dvh;background:#000;color:#fff;display:flex;flex-direction:column;overflow:hidden`)}>
        <WelcomeScreen {...v} />
      </div>
    );
  }
  return (
    <div style={css(`height:100vh;height:100dvh;background:#000;color:#fff;display:flex;flex-direction:column;overflow:hidden`)}>
      <AppHeader {...v} />
      <div ref={scrollRef} style={css(`flex:1;overflow-y:auto;min-height:0;background:#000`)}>
        {v.isHome && <HomeScreen {...v} />}
        {v.isCards && <CardsScreen {...v} />}
        {v.isPacks && <PacksScreen {...v} />}
        {v.isFight && <FightScreen {...v} />}
        {v.isConfirm && <ConfirmScreen {...v} />}
        {v.isMine && <MyPicksScreen {...v} />}
        {v.isRecap && <RecapScreen {...v} />}
      </div>
      <BottomNav {...v} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
