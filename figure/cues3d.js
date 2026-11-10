// 3D "Show me" animations for the Body language tab.
// Key = cue name slug (see BO3D.key). Each entry: base pose, camera, highlighted parts,
// then steps (pose change, ease-in time, hold time). The figure starts at a neutral baseline,
// moves into the cue, holds, then returns, on a loop. Angles are degrees.
// j: joint rotations   ikL/ikR: hand placement {to: bone, p: contact point, fd: finger direction, pn: palm facing, pole: elbow direction}
// f: face and body scalars (see F0 in viewer.js)   fg: fingers {c: curl 0-1, s: spread, t: thumb}
(function () {
  const sym = (n, x, y, z) => ({ [n + 'L']: [x, y, z], [n + 'R']: [x, -y, -z] });
  const mir = (ik) => { const m = a => a && [-a[0], a[1], a[2]]; const sw = s => s && s.replace(/L$/, '§').replace(/R$/, 'L').replace(/§$/, 'R');
    return { ...ik, to: sw(ik.to), fr: sw(ik.fr), p: m(ik.p), fd: m(ik.fd), pn: m(ik.pn), pole: m(ik.pole) }; };
  const both = (ikL) => ({ ikL, ikR: mir(ikL) });
  const J = (...a) => Object.assign({}, ...a);

  const handsOnThighs = both({ to: 'thighL', p: [0.005, -0.27, 0.07], fd: [0.05, -1, 0], pn: [0, 0, -1], pole: [0.9, -0.2, -0.6], fr: 'thighL' });
  const bases = {
    stand: { j: J(sym('arm', 0, 0, 7), sym('fore', -12, 0, 0), sym('wrist', 4, -90, 0), sym('thigh', 0, 0, 2), sym('foot', 0, 6, 0)), fg: { L: { c: 0.25 }, R: { c: 0.25 } } },
    sit: { hp: [0, 0.54, 0], j: J(sym('thigh', -88, 5, 0), sym('shin', 86, 0, 0), sym('foot', 0, 4, 0), { spine: [-3, 0, 0], head: [2, 0, 0] }), ...handsOnThighs, fg: { L: { c: 0.2 }, R: { c: 0.2 } } },
  };
  // stock poses
  const palmsUp = both({ to: 'chest', p: [0.22, 0.06, 0.36], fd: [0.4, 0.1, 1], pn: [0.25, 1, 0], pole: [0.4, -1, -0.5] });
  const C = {};
  const add = (name, spec) => { C[key(name)] = spec; };
  function key(n) { return String(n).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---------------- EYES ---------------- */
  add('Blink rate slows', { cam: { f: 'face', az: 10 }, hl: ['lids'], f0: 1, steps: [{ p: { f: { br: 0.06, gy: 2 } }, in: 0.6, hold: 5, label: 'Blinking slows right down', note: 'Watch the lids: about 20 blinks a minute drops to a handful.' }], p0: { f: { br: 0.45 } } });
  add('Blink rate speeds up', { cam: { f: 'face', az: 10 }, hl: ['lids'], p0: { f: { br: 0.3 } }, steps: [{ p: { f: { br: 1.6, bd: 0.2 } }, in: 0.5, hold: 4, label: 'Blinking speeds up', note: 'Compare with their baseline rate before the topic came up.' }] });
  add("Fast eyelid 'shutter'", { cam: { f: 'face', az: 10 }, hl: ['lids'], steps: [{ p: { f: { flut: 1, br: 0, bi: 0.4, lid: 0.1 } }, in: 0.3, hold: 2.2, label: 'Lids flutter open and shut' }] });
  add('Pupils dilate', { cam: { f: 'eyes', az: 6, el: 2 }, hl: [], steps: [{ p: { f: { pup: 1, br: 0.1 } }, in: 1.4, hold: 2.4, label: 'Pupils widen' }] });
  add('Pupils constrict', { cam: { f: 'eyes', az: 6, el: 2 }, hl: [], p0: { f: { pup: 0.3 } }, steps: [{ p: { f: { pup: -0.6, br: 0.1 } }, in: 1.2, hold: 2.4, label: 'Pupils shrink to pinpoints' }] });
  add('Glance to a third person', { cam: { tg: [-0.4, 1.25, 0.3], az: -8, el: 12, d: 3.6 }, hl: ['head'],
    extras: [{ pos: [-0.85, 0, 0.6], ry: 125 }],
    steps: [{ p: { j: { head: [0, -40, 0], neck: [0, -15, 0] }, f: { gx: -18 } }, in: 0.35, hold: 1.0, label: 'Quick glance at the other person' }], ret: 0.4 });
  add('Eyebrow flash', { cam: { f: 'face', az: 12 }, hl: ['brows'], steps: [{ p: { f: { bu: 1, sm: 0.35, lid: -0.2 }, j: { head: [-4, 0, 0] } }, in: 0.14, hold: 0.32, label: 'Quick eyebrow flash' }], ret: 0.25, lead: 1.4 });
  add('Looks to one side for good memories', { cam: { f: 'face', az: 0, d: 0.8 }, hl: [], steps: [{ p: { f: { gx: 26, gy: 14, sm: 0.45, ch: 0.3 }, j: { head: [-6, 14, 4] } }, in: 0.7, hold: 2.2, label: 'Looks to their "good" side while recalling', note: 'Note which side. Later, put good news on that side.' }] });
  add('Squint', { cam: { f: 'face', az: 12 }, hl: ['lids'], steps: [{ p: { f: { lid: 0.42, low: 0.85, bd: 0.4 } }, in: 0.4, hold: 2, label: 'Narrowed eyes' }] });
  add('Eyelid rub', { base: 'stand', cam: { f: 'head', az: 0, el: 4, d: 1.2 }, hl: ['handR', 'lids'],
    steps: [{ p: { ikR: { to: 'head', p: [-0.055, 0.06, 0.11], fd: [0.3, 0.9, 0.25], pn: [0.3, 0, -1], pole: [-1, -1, -0.2] }, fg: { R: { c: [0.25, 0.3, 0.7, 0.8], t: 0.5 } }, f: { lidR: 1.1, lidL: 0.35 }, j: { head: [8, 0, -4] } }, in: 0.7, hold: 2.2, osc: [['wristR', 'z', 5, 2.2]], label: 'Rubs the closed eye' }] });

  /* ---------------- FACE ---------------- */
  add('Lip compression', { cam: { f: 'face', az: 14 }, hl: [], steps: [{ p: { f: { pr: 1, li: 0.35, bd: 0.2 } }, in: 0.35, hold: 2.4, label: 'Lips press into a thin line' }] });
  add('Lips pulled in / bitten', { cam: { f: 'face', az: 14 }, hl: [], steps: [{ p: { f: { li: 1, pr: 0.4, bi: 0.45, fr: 0.2 }, j: { head: [5, 0, 0] } }, in: 0.4, hold: 2.4, label: 'Lips roll in and disappear' }] });
  add('Object in mouth', { base: 'stand', props: ['pen'], cam: { f: 'head', az: 30, el: 2 }, hl: ['handR'],
    steps: [{ p: { ikR: { to: 'head', p: [-0.075, 0.025, 0.13], fd: [0.55, 0.65, 0.55], pn: [0.6, -0.5, 0.2], pole: [-1, -1, -0.1] }, fg: { R: { c: 0.75, t: 0.6 } }, f: { op: 0.08, bi: 0.3, pen: 1 } }, in: 0.8, hold: 2.4, label: 'Pen to the mouth' }] });
  add('Smile reaching the eyes', { cam: { f: 'face', az: 12 }, hl: ['cheeks', 'lids'], steps: [
    { p: { f: { sm: 0.8 } }, in: 0.5, hold: 1.4, label: 'Social smile: mouth only' },
    { p: { f: { sm: 1, ch: 1, low: 0.55, lid: 0.2 } }, in: 0.5, hold: 2, label: 'Genuine: cheeks lift, eyes crinkle' }] });
  add('Expression stops abruptly', { cam: { f: 'face', az: 12 }, hl: [], steps: [{ p: { f: { sm: 1, wi: 0.2 } }, in: 0.35, hold: 1.4, label: 'Big smile… then gone in an instant', note: 'Real expressions fade out gradually; this one switches off.' }], ret: 0.07, retEase: 'lin', lead: 1.6 });
  add('Lopsided expression', { cam: { f: 'face', az: 0 }, hl: [], steps: [{ p: { f: { sm: 0.25, smL: 0.85, smR: -0.1 } }, in: 0.4, hold: 2.2, label: 'One side of the smile lags' }] });
  add('Contempt (one-sided smirk)', { cam: { f: 'face', az: -14 }, hl: [], steps: [{ p: { f: { smR: 0.95, pr: 0.3, lidR: 0.15 }, j: { head: [-7, 6, 3] } }, in: 0.4, hold: 2.2, label: 'One corner tightens up' }] });
  add('Disgust', { cam: { f: 'face', az: 12 }, hl: ['nose'], steps: [{ p: { f: { up: 1, nw: 1, bd: 0.8, low: 0.5, lid: 0.2, fr: 0.3 }, j: { head: [-3, 0, 4], neck: [-4, 0, 0] } }, in: 0.4, hold: 2.2, label: 'Nose wrinkles, upper lip lifts' }] });
  add('Nostril flare', { cam: { f: 'face', az: 8, el: -4, d: 0.55 }, hl: ['nostrils'], steps: [{ p: { f: { nf: 1, bd: 0.2 } }, in: 0.35, hold: 2.2, osc: [], label: 'Nostrils widen' }] });
  add('Jaw clench', { cam: { f: 'face', az: 40, d: 0.75 }, hl: ['jaw'], steps: [{ p: { f: { jc: 1, pr: 0.6, bd: 0.45 } }, in: 0.4, hold: 2.4, label: 'Jaw muscles bunch up' }] });
  add('Hushing (mouth cover, cough, nose scratch)', { cam: { f: 'head', az: 20 }, hl: ['handR'],
    steps: [{ p: { ikR: { to: 'head', p: [-0.01, 0.04, 0.115], fd: [0.95, 0.15, 0.2], pn: [0, 0, -1], pole: [-1, -1, -0.1] }, fg: { R: { c: 0.35, t: 0.2 } }, j: { head: [6, 0, 0] } }, in: 0.6, hold: 2, label: 'Hand covers the mouth' }] });
  add('Flushing', { cam: { f: 'face', az: 12 }, hl: [], steps: [{ p: { f: { fl: 1, gy: -10, sm: 0.15 }, j: { head: [8, -6, 0] } }, in: 1.5, hold: 2.2, label: 'Face reddens' }] });
  add('Head tilt', { cam: { f: 'head', az: 10, d: 1.3 }, hl: ['head'], steps: [{ p: { j: { head: [0, 0, 16], neck: [0, 0, 4] }, f: { sm: 0.35, bu: 0.15 } }, in: 0.7, hold: 2.2, label: 'Head tilts to one side' }] });
  add('Chin thrust', { cam: { f: 'head', az: 50, d: 1.4 }, hl: ['head'], steps: [{ p: { j: { neck: [-12, 0, 0], head: [-14, 0, 0], chest: [-3, 0, 0] }, f: { bd: 0.5, pr: 0.4 } }, in: 0.5, hold: 2.2, label: 'Chin juts up and out' }] });

  /* ---------------- NECK & SHOULDERS ---------------- */
  add('Throat touch', { cam: { f: 'head', az: 25 }, hl: ['handR', 'throat'],
    steps: [{ p: { ikR: { to: 'neck', p: [-0.01, -0.035, 0.075], fd: [0.3, 1, 0.1], pn: [0, 0, -1], pole: [-1, -1, -0.2] }, fg: { R: { c: [0.3, 0.35, 0.5, 0.6], s: 0.3 } }, f: { bi: 0.4 } }, in: 0.7, hold: 2.2, label: 'Hand goes to the throat' }] });
  const shrugArms = { ...palmsUp };
  add('Both shoulders shrug', { cam: { f: 'upper', az: 12, d: 2.1 }, hl: ['shoulders'], steps: [{ p: { j: J(sym('clav', 0, 0, 15), { head: [0, 0, 6] }), ...shrugArms, fg: { L: { c: 0.1, s: 0.5 }, R: { c: 0.1, s: 0.5 } }, f: { bu: 0.6, fr: 0.5, pr: 0.3 } }, in: 0.45, hold: 1.3, label: 'Both shoulders up, palms up' }] });
  add('Single-shoulder shrug', { cam: { f: 'upper', az: 12, d: 2.1 }, hl: ['shoulderR'], steps: [{ p: { j: { clavR: [0, 0, -17], head: [0, 0, -4] }, f: { fr: 0.3, buR: 0.3 } }, in: 0.35, hold: 1.2, label: 'Just one shoulder lifts' }] });
  add('Shoulders stay raised', { cam: { f: 'upper', az: 15, d: 2.1 }, hl: ['shoulders'], steps: [{ p: { j: J(sym('clav', 0, 6, 13), sym('arm', 0, 0, 3), { neck: [6, 0, 0], head: [-4, 0, 0] }), f: { bi: 0.3, pr: 0.2 } }, in: 0.7, hold: 3.5, label: 'Shoulders hitched up and held' }] });
  add('Shoulders drop', { cam: { f: 'upper', az: 15, d: 2.1 }, hl: ['shoulders'], baseLabel: 'Tense', p0: { j: J(sym('clav', 0, 6, 12), { neck: [5, 0, 0] }), f: { pr: 0.2 } }, steps: [{ p: { j: J(sym('clav', 0, -3, -4), { neck: [0, 0, 0] }), f: { pr: 0, sm: 0.2, cb: 0.2, bb: 1 } }, in: 1.2, hold: 2.5, label: 'Shoulders sink: they relax' }] });
  add('Dominant shoulder pulls back', { cam: { f: 'upper', az: 35, el: 18, d: 2.2 }, hl: ['shoulderR'], steps: [{ p: { j: { clavR: [0, -26, -3], chest: [0, -10, 0], head: [0, 8, 0] }, f: { bd: 0.4, pr: 0.4 } }, in: 0.5, hold: 2, label: 'One shoulder rolls back' }] });
  add('Turtling (shoulders up, head down)', { cam: { f: 'upper', az: 30, d: 2.1 }, hl: ['shoulders', 'head'], steps: [{ p: { j: J(sym('clav', 0, 10, 19), { neck: [16, 0, 0], head: [14, 0, 0], chest: [8, 0, 0] }, sym('arm', 0, 0, 2)), f: { bi: 0.6, gy: 10 } }, in: 0.6, hold: 2.4, label: 'Shoulders up, head sinks' }] });

  /* ---------------- ARMS & HANDS ---------------- */
  const crossed = { ikL: { to: 'chest', p: [-0.17, 0.03, 0.095], fd: [-0.7, -0.2, -0.7], pn: [0.4, 0, -1], pole: [0.5, -1, 0.5] }, ikR: { to: 'chest', p: [0.17, 0.05, 0.115], fd: [0.7, -0.2, -0.7], pn: [-0.4, 0, -1], pole: [-0.5, -1, 0.5] } };
  add('Arms crossed (relaxed fingers)', { cam: { f: 'upper', az: 22, d: 2.2 }, hl: ['arms'], steps: [{ p: { ...crossed, fg: { L: { c: 0.2 }, R: { c: 0.2 } }, f: { sm: 0.15 } }, in: 0.9, hold: 2.4, label: 'Arms folded, fingers loose' }] });
  add('Self-hug (palms on body)', { cam: { f: 'upper', az: 22, d: 2.1 }, hl: ['hands'], steps: [{ p: { ikL: { to: 'chest', p: [-0.195, 0.14, 0.06], fd: [-0.35, -0.1, -0.95], pn: [0.6, 0, -1], pole: [0.4, -1, 0.6] }, ikR: { to: 'chest', p: [0.195, 0.12, 0.08], fd: [0.35, -0.1, -0.95], pn: [-0.6, 0, -1], pole: [-0.4, -1, 0.6] }, j: J(sym('clav', 0, 12, 6), { head: [10, 0, 4] }), fg: { L: { c: 0.55, t: 0.3 }, R: { c: 0.55, t: 0.3 } }, f: { bi: 0.5, gy: -8 } }, in: 0.9, hold: 2.4, label: 'Hugs themself' }] });
  add('Arms crossed with fists', { cam: { f: 'upper', az: 22, d: 2.2 }, hl: ['hands'], steps: [{ p: { ...crossed, fg: { L: { c: 1, t: 0.9 }, R: { c: 1, t: 0.9 } }, j: J(sym('clav', 0, 0, 5)), f: { bd: 0.8, pr: 0.6, jc: 0.6 } }, in: 0.7, hold: 2.4, label: 'Arms locked, fists balled' }] });
  add('Fingers relax / extend', { base: 'sit', cam: { f: 'hands', az: 25, el: 30, d: 1.1 }, hl: ['fingers'], baseLabel: 'Tense: fingers curled', p0: { fg: { L: { c: 0.8, t: 0.6 }, R: { c: 0.8, t: 0.6 } } }, steps: [{ p: { fg: { L: { c: 0, s: 0.5, t: 0 }, R: { c: 0, s: 0.5, t: 0 } }, f: { sm: 0.2 } }, in: 1.1, hold: 2.4, label: 'Fingers loosen and stretch out' }] });
  add('Fingers curl (digital flexion)', { base: 'sit', cam: { f: 'hands', az: 25, el: 30, d: 1.1 }, hl: ['fingers'], p0: { fg: { L: { c: 0.05, s: 0.3, t: 0 }, R: { c: 0.05, s: 0.3, t: 0 } } }, steps: [{ p: { fg: { L: { c: 0.85, s: 0, t: 0.7 }, R: { c: 0.85, s: 0, t: 0.7 } }, f: { pr: 0.3 } }, in: 0.9, hold: 2.4, label: 'Fingers tighten into the palm' }] });
  add('Palms open', { cam: { f: 'upper', az: 15, el: 12, d: 2.3 }, hl: ['hands'], steps: [{ p: { ...palmsUp, fg: { L: { c: 0.05, s: 0.4, t: 0 }, R: { c: 0.05, s: 0.4, t: 0 } }, f: { bi: 0.3, bu: 0.2 }, j: { head: [0, 0, 5] } }, in: 0.7, hold: 2.2, label: 'Palms turn up and open' }] });
  add('Palms turn down', { cam: { f: 'upper', az: 15, el: 18, d: 2.3 }, hl: ['hands'], p0: { ...palmsUp, fg: { L: { c: 0.05, s: 0.4 }, R: { c: 0.05, s: 0.4 } } }, baseLabel: 'Palms up', steps: [{ p: { ...both({ to: 'chest', p: [0.22, 0.06, 0.36], fd: [0.4, -0.1, 1], pn: [0, -1, 0], pole: [0.4, -1, -0.5] }), fg: { L: { c: 0.1 }, R: { c: 0.1 } }, f: { pr: 0.3 } }, in: 0.6, hold: 2.2, label: 'Palms flip face-down' }] });
  add('Steepled fingers', { base: 'sit', cam: { f: 'upper', az: 25, d: 2.0 }, hl: ['hands'], steps: [{ p: { ...both({ to: 'chest', p: [0.03, 0.0, 0.3], fd: [-0.3, 1, 0.25], pn: [-1, 0, 0], pole: [1, -1, -0.2] }), fg: { L: { c: 0.05, s: 0.6, t: 0.0 }, R: { c: 0.05, s: 0.6, t: 0.0 } }, f: { sm: 0.15 }, j: { head: [-3, 0, 0] } }, in: 0.9, hold: 2.4, label: 'Fingertips together, like a church spire' }] });
  add('Hands behind head', { base: 'sit', cam: { f: 'upper', az: 30, el: 8, d: 2.2 }, hl: ['arms'], steps: [{ p: { ...both({ to: 'head', p: [0.03, 0.13, -0.1], fd: [-1, 0.2, 0], pn: [0, 0, 1], pole: [1, 0.3, 0.2] }), j: { spine: [-10, 0, 0], chest: [-4, 0, 0], head: [2, 0, 0] }, fg: { L: { c: 0.35 }, R: { c: 0.35 } }, f: { sm: 0.3 } }, in: 1.0, hold: 2.4, label: 'Leans back, hands behind head' }] });
  add('Hands behind back', { cam: { f: 'body', az: 160, el: 12, d: 3.0 }, hl: ['hands'], steps: [{ p: { ikL: { to: 'hips', p: [0.02, 0.0, -0.13], fd: [-0.3, -1, 0], pn: [0, 0, 1], pole: [1, -1, -1] }, ikR: { to: 'hips', p: [-0.04, 0.03, -0.15], fd: [0.6, -0.8, 0], pn: [0, 0.2, 1], pole: [-1, -1, -1] }, j: { chest: [-4, 0, 0] }, fg: { L: { c: 0.3 }, R: { c: 0.75, t: 0.6 } } }, in: 0.9, hold: 2.4, label: 'Hands clasped behind the back' }] });
  add('Hand to chest', { cam: { f: 'upper', az: 20, d: 2.1 }, hl: ['handR'], steps: [{ p: { ikR: { to: 'chest', p: [0.04, 0.13, 0.1], fd: [0.55, 0.75, 0.1], pn: [0, 0, -1], pole: [-1, -1, -0.1] }, fg: { R: { c: 0.08, s: 0.3 } }, f: { bi: 0.45, sm: 0.1 }, j: { head: [4, 0, 4] } }, in: 0.7, hold: 2.2, label: 'Hand flat over the heart' }] });
  add('Fig leaf / single-arm wrap', { cam: { f: 'body', az: 18, d: 3 }, hl: ['hands', 'arms'], steps: [
    { p: { ikL: { to: 'hips', p: [0.0, -0.1, 0.14], fd: [-0.4, -1, 0], pn: [0, 0, -1], pole: [1, -1, -0.2] }, ikR: { to: 'hips', p: [0.01, -0.12, 0.16], fd: [0.4, -1, 0], pn: [0, 0, -1], pole: [-1, -1, -0.2] }, fg: { L: { c: 0.3 }, R: { c: 0.3 } }, f: { bi: 0.3 } }, in: 0.8, hold: 1.8, label: 'Fig leaf: hands guard the front' },
    { p: { ikL: null, ikR: { to: 'chest', p: [0.2, 0.0, 0.13], fd: [0.2, -0.7, -0.6], pn: [-1, 0, 0.3], pole: [-0.4, -1, 1] }, j: { armL: [0, 0, 3] }, fg: { R: { c: 0.3 }, L: { c: 0.25 } }, f: { bi: 0.4 } }, in: 0.8, hold: 1.8, label: 'Single-arm wrap: one arm across the body' }] });
  add('Elbows pull in', { cam: { f: 'upper', az: 25, d: 2.3 }, hl: ['arms'], p0: { ...both({ to: 'chest', p: [0.26, -0.1, 0.3], fd: [0.3, 0.1, 1], pn: [-0.6, 0.6, 0], pole: [1, -0.5, -0.2] }) }, baseLabel: 'Relaxed, gesturing', steps: [{ p: { ...both({ to: 'chest', p: [0.1, -0.08, 0.27], fd: [-0.1, 0.1, 1], pn: [-0.8, 0.4, 0], pole: [0.1, -1, -0.4] }), j: J(sym('clav', 0, 8, 6)), fg: { L: { c: 0.5 }, R: { c: 0.5 } }, f: { bi: 0.4, pr: 0.3 } }, in: 0.5, hold: 2.2, label: 'Elbows clamp to the ribs' }] });
  add('Fidgeting / tapping', { base: 'sit', cam: { f: 'body', az: 30, el: 20, d: 2.6 }, hl: ['fingersR', 'thighL', 'fingers'], steps: [{ p: { fg: { R: { c: 0.1, s: 0.3 } } }, in: 0.4, hold: 3.5, osc: [['fR0_0', 'x', 22, 4, 0], ['fR1_0', 'x', 22, 4, 0.8], ['fR2_0', 'x', 22, 4, 1.6], ['fR3_0', 'x', 22, 4, 2.4], ['footL', 'x', 12, 3.2]], label: 'Fingers drum, a foot taps' }] });
  add('Jewellery or cuff play', { props: ['watch'], cam: { f: 'hands', az: 25, el: 15, d: 1.4 }, hl: ['handR'], steps: [{ p: { ikL: { to: 'chest', p: [0.0, -0.06, 0.27], fd: [-0.6, -0.2, 0.7], pn: [0, 1, -0.1], pole: [1, -1, 0] }, ikR: { to: 'chest', p: [0.04, -0.04, 0.27], fd: [0.6, -0.2, 0.6], pn: [0.4, -1, 0], pole: [-1, -1, 0] }, fg: { R: { c: 0.55, t: 0.6 } }, f: { gy: -20 }, j: { head: [14, 0, 0] } }, in: 0.8, hold: 3, osc: [['wristR', 'y', 14, 1.4]], label: 'Twists the watch strap' }] });
  add('Grooming (hair, lint, straighten up)', { cam: { f: 'upper', az: 25, d: 2 }, hl: ['handR'], steps: [
    { p: { ikR: { to: 'head', p: [-0.075, 0.18, 0.02], fd: [0.3, 0.5, -0.8], pn: [1, 0, 0], pole: [-1, 0, 0.3] }, fg: { R: { c: 0.3 } }, f: { sm: 0.3 }, j: { head: [0, 0, -6] } }, in: 0.7, hold: 1.6, osc: [['wristR', 'x', 8, 1.6]], label: 'Smooths their hair' },
    { p: { ...both({ to: 'spine', p: [0.11, 0.02, 0.13], fd: [0, -1, 0.2], pn: [0, 0, -1], pole: [1, -1, -0.3] }), fg: { L: { c: 0.6, t: 0.7 }, R: { c: 0.6, t: 0.7 } }, f: { sm: 0.2 }, j: { head: [10, 0, 0] } }, in: 0.7, hold: 1.4, label: 'Straightens their top' }] });
  add('Back of neck rub', { cam: { f: 'upper', az: 60, d: 1.9 }, hl: ['handR'], steps: [{ p: { ikR: { to: 'neck', p: [-0.01, 0.05, -0.055], fd: [0.4, 0.6, 0.1], pn: [0, 0, 1], pole: [-1, 0.2, 0.5] }, fg: { R: { c: 0.3 } }, j: { head: [14, 0, 0], neck: [6, 0, 0] }, f: { bd: 0.3, lid: 0.25 } }, in: 0.8, hold: 2.6, osc: [['wristR', 'z', 9, 1.3]], label: 'Rubs the back of the neck' }] });
  add('Arm or object as a barrier', { props: ['cup'], cam: { f: 'upper', az: 22, d: 2.1 }, hl: ['handR', 'handL'], steps: [{ p: { ikR: { to: 'chest', p: [0.03, 0.05, 0.22], fd: [0.8, 0.1, 0.3], pn: [0.2, 0, 1], pole: [-1, -1, 0] }, ikL: { to: 'chest', p: [0.06, -0.02, 0.23], fd: [-0.2, 0.3, 1], pn: [-0.3, 1, 0], pole: [1, -1, 0] }, fg: { R: { c: 0.55, t: 0.5 }, L: { c: 0.3 } }, f: { pr: 0.2 } }, in: 0.8, hold: 2.4, label: 'Cup held up like a shield' }] });

  /* ---------------- TORSO & BREATHING ---------------- */
  add('Leans toward you', { base: 'sit', cam: { f: 'body', az: 70, el: 6, d: 2.8 }, hl: ['torso'], steps: [{ p: { j: { spine: [24, 0, 0], chest: [10, 0, 0], head: [-12, 0, 0] }, ...both({ to: 'thighL', p: [0, -0.36, 0.07], fd: [0.05, -1, 0], pn: [0, 0, -1], pole: [0.9, -0.2, -0.6] }), f: { sm: 0.3, bu: 0.2 } }, in: 1.0, hold: 2.4, label: 'Leans in' }] });
  add('Leans away', { base: 'sit', cam: { f: 'body', az: 70, el: 6, d: 2.8 }, hl: ['torso'], steps: [{ p: { j: { spine: [-14, 0, 0], chest: [-6, 0, 0], head: [10, 0, 0] }, ...both({ to: 'thighL', p: [0, -0.15, 0.07], fd: [0.05, -1, 0], pn: [0, 0, -1], pole: [0.9, -0.2, -0.6] }), f: { pr: 0.2 } }, in: 1.0, hold: 2.4, label: 'Pulls back, away' }] });
  add('Torso turns away', { cam: { f: 'body', az: 10, el: 25, d: 3 }, hl: ['torso'], steps: [{ p: { j: { hips: [0, -28, 0], spine: [0, -10, 0], chest: [0, -6, 0], head: [0, 26, 0] }, f: { gx: 10 } }, in: 0.9, hold: 2.4, label: 'Body angles away, only the head stays' }] });
  add('Belly → chest breathing', { base: 'sit', cam: { f: 'upper', az: 70, el: 0, d: 1.8 }, hl: ['chest', 'belly'], p0: { f: { bb: 1.4, cb: 0.15, brate: 0.22 } }, steps: [{ p: { f: { bb: 0.1, cb: 1.8, brate: 0.45, pr: 0.2 } }, in: 0.8, hold: 5, label: 'Breath moves up into the chest', note: 'Faster, shallower, shoulders rise with each breath.' }] });
  add('Chest → belly breathing', { base: 'sit', cam: { f: 'upper', az: 70, el: 0, d: 1.8 }, hl: ['chest', 'belly'], p0: { f: { bb: 0.1, cb: 1.8, brate: 0.45 } }, steps: [{ p: { f: { bb: 1.5, cb: 0.15, brate: 0.2, sm: 0.15 } }, in: 1.2, hold: 5, label: 'Breath drops into the belly', note: 'Slower, deeper, the stomach moves.' }] });
  add('Freeze', { cam: { f: 'upper', az: 15, d: 2.2 }, hl: [], p0: { f: { idle: 1.9 } }, baseLabel: 'Normal fidgety baseline', steps: [{ p: { f: { idle: 0, br: 0, gy: -2 }, j: { head: [3, 0, 0] } }, in: 0.25, hold: 3, label: 'Freezes: movement and blinking stop' }] });
  add('Ventilating (collar pull, hair off neck)', { cam: { f: 'head', az: 30, d: 1.2 }, hl: ['handR', 'collar'], steps: [{ p: { ikR: { to: 'chest', p: [0.03, 0.235, 0.075], fd: [0.1, -0.2, -1], pn: [0, -1, -0.2], pole: [-1, -1, 0.1] }, fg: { R: { c: 0.55, t: 0.6 } }, f: { col: 1, bi: 0.3 }, j: { head: [-5, 8, -6] } }, in: 0.7, hold: 2.2, osc: [['wristR', 'x', 6, 2]], label: 'Tugs the collar to let heat out' }] });

  /* ---------------- LEGS & FEET ---------------- */
  add('Feet point at you', { cam: { f: 'body', az: 15, el: 35, d: 3.3 }, hl: ['feet'], p0: { j: { hips: [0, -40, 0], spine: [0, 20, 0], chest: [0, 14, 0], head: [0, 6, 0] } }, baseLabel: 'Feet angled off', steps: [{ p: { j: { hips: [0, 0, 0], spine: [0, 0, 0], chest: [0, 0, 0], head: [0, 0, 0] }, f: { sm: 0.3 } }, in: 1.0, hold: 2.2, label: 'Feet swing round to face you' }] });
  add('Feet turn to the exit', { props: ['door'], cam: { tg: [-0.45, 0.8, 0], az: 30, el: 28, d: 4.4 }, hl: ['feet'], steps: [{ p: { j: { hips: [0, -48, 0], spine: [0, 24, 0], chest: [0, 18, 0], head: [0, 4, 0] }, f: { gx: -10 } }, in: 1.0, hold: 2.4, label: 'Feet point at the door, upper body stays' }] });
  add("Group's feet point to one person", { cam: { tg: [0, 0.6, 0.5], az: 0, el: 42, d: 5.4 }, hl: [], extras: [
    { pos: [-0.95, 0, 0.9], ry: 125, p: { j: { hips: [0, 0, 0], spine: [0, -45, 0], chest: [0, -25, 0] } } },
    { pos: [0.95, 0, 0.9], ry: -125, p: { j: { hips: [0, 0, 0], spine: [0, 45, 0], chest: [0, 25, 0] } } }],
    steps: [{ p: { f: { sm: 0.3 } }, in: 0.4, hold: 3, label: 'Everyone’s feet point at the leader (centre)', note: 'Their faces turn to you; their feet give away who matters.' }] });
  const crossL = J({ thighL: [-108, -18, 0], shinL: [104, 0, -8], footL: [20, 0, 0] });
  add('Legs crossed toward you', { base: 'sit', cam: { f: 'body', az: 0, el: 15, d: 2.8 }, hl: ['legs'], steps: [{ p: { j: J(crossL, { hips: [0, 0, 0], spine: [2, 0, 0] }), ikL: { to: 'thighL', p: [0.0, -0.32, 0.07], fd: [0.05, -1, 0], pn: [0, 0, -1], pole: [0.9, -0.2, -0.6] }, f: { sm: 0.25 } }, in: 1.1, hold: 2.4, label: 'Top knee crosses toward you' }] });
  add('Locked ankles / legs bound tight', { base: 'sit', cam: { f: 'feet', az: 35, el: 4, d: 1.7 }, hl: ['feet', 'legs'], steps: [{ p: { j: { thighL: [-88, -4, 0], thighR: [-88, 4, 0], shinL: [112, 0, -6], shinR: [112, 0, 6], footL: [28, 0, 0], footR: [28, 0, 0] }, f: { pr: 0.4 } }, in: 0.8, hold: 2.4, label: 'Ankles lock under the chair' }] });
  add('Feet wrapped round chair legs', { base: 'sit', cam: { f: 'legs', az: 70, el: 10, d: 2.0 }, hl: ['feet'], steps: [{ p: { j: { thighL: [-88, 12, 0], thighR: [-88, -12, 0], shinL: [128, 0, 6], shinR: [128, 0, -6], footL: [40, -25, 0], footR: [40, 25, 0] } }, in: 0.9, hold: 2.4, label: 'Feet hooked behind the chair legs' }] });
  add('Feet suddenly pulled back', { base: 'sit', cam: { f: 'legs', az: 70, el: 10, d: 2.1 }, hl: ['feet'], p0: { j: J(sym('shin', 62, 0, 0), sym('foot', -10, 4, 0)) }, baseLabel: 'Relaxed, feet out', steps: [{ p: { j: J(sym('shin', 116, 0, 0), sym('foot', 25, 4, 0)), f: { pr: 0.3 } }, in: 0.28, hold: 2.2, label: 'Feet snap back under the chair' }] });
  add('Hands clasp knees', { base: 'sit', cam: { f: 'body', az: 50, el: 8, d: 2.8 }, hl: ['hands'], steps: [{ p: { ...both({ to: 'thighL', p: [0.0, -0.41, 0.075], fd: [0.05, -0.7, -0.7], pn: [0, 0, -1], pole: [1, 0, -0.4] }), j: { spine: [18, 0, 0], chest: [6, 0, 0], head: [-16, 0, 0] }, fg: { L: { c: 0.55 }, R: { c: 0.55 } } }, in: 0.9, hold: 2.4, label: 'Hands grip the knees, ready to stand' }] });
  add('Toes lift up', { cam: { f: 'feet', az: 80, el: 10, d: 1.7 }, hl: ['toes', 'feet'], steps: [{ p: { j: J(sym('foot', -30, 6, 0)), f: { sm: 0.6, ch: 0.4 } }, in: 0.5, hold: 2.4, osc: [['footL', 'x', 6, 2.4], ['footR', 'x', 6, 2.4, 1.5]], label: 'Toes point up ("happy feet")' }] });
  add('Toes point inward', { cam: { f: 'feet', az: 10, el: 45, d: 1.5 }, hl: ['feet'], steps: [{ p: { j: J(sym('thigh', 0, -22, -1), sym('foot', 0, -8, 0), sym('clav', 0, 4, 4), { head: [8, 0, 0] }), f: { bi: 0.3 } }, in: 0.8, hold: 2.4, label: 'Toes turn in, pigeon-toed' }] });

  /* ---------------- OBJECTS ---------------- */
  add('Checks wallet/phone/bag is there', { props: ['wallet'], cam: { f: 'body', az: 150, el: 10, d: 3 }, hl: ['handR'], steps: [{ p: { ikR: { to: 'hips', p: [-0.085, -0.06, -0.115], fd: [0, -1, -0.1], pn: [0, 0, 1], pole: [-1, -0.3, -0.6] }, fg: { R: { c: 0.15 } }, j: { head: [10, -20, 0] }, f: { gy: -10 } }, in: 0.7, hold: 1.8, osc: [['wristR', 'x', 12, 3]], label: 'Pats the back pocket' }] });
  add('Tilts phone screen away', { base: 'sit', props: ['phone'], cam: { f: 'hands', az: 10, el: 30, d: 1.15 }, hl: ['handR'], p0: { ikR: { to: 'chest', p: [-0.02, -0.12, 0.3], fd: [0.3, 0.15, 1], pn: [0, 1, 0.1], pole: [-1, -1, 0] }, fg: { R: { c: 0.5, t: 0.3 } }, j: { head: [18, 0, 0] }, f: { gy: -20 } }, baseLabel: 'Screen visible', steps: [{ p: { ikR: { to: 'chest', p: [-0.03, -0.06, 0.24], fd: [0.3, 0.8, 0.3], pn: [0.1, 0.3, -1], pole: [-1, -1, 0] }, f: { gy: -12 } }, in: 0.4, hold: 2.2, label: 'Screen tilts toward themself' }] });
  add('Watch check', { props: ['watch'], cam: { f: 'upper', az: 30, d: 2.0 }, hl: ['handL'], steps: [{ p: { ikL: { to: 'chest', p: [-0.02, 0.0, 0.3], fd: [-0.7, -0.1, 0.4], pn: [0, -1, 0], pole: [1, -1, 0] }, fg: { L: { c: 0.35 } }, j: { head: [26, 14, 0], neck: [8, 0, 0] }, f: { gy: -25, gx: 6 } }, in: 0.6, hold: 1.4, label: 'Glances at the watch' }] });

  // Not animated with the realistic model (the jacket prop clips through his jumper and the model has no throat shape key):
  // 'Throat rises / hard swallow', 'Buttons jacket mid-chat'.
  window.BO3D = { bases, cues: C, key };
})();
