// Read & Connect: 3D cue viewer.
// A procedural mannequin built from simple shapes (no external model, so no licence issues).
// Poses live in figure/cues3d.js (cue key -> keyframed pose spec). Loaded only when a figure is opened.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const D = Math.PI / 180;
const V = () => new THREE.Vector3();
const COL = { skin: 0xd9a080, shirt: 0x5d6fd6, trousers: 0x2b3146, shoe: 0x171a22, hair: 0x2a1f1a, lip: 0xa8574f,
  iris: 0x4a6f8f, chair: 0x3a3f52, ghost: 0x8fa3c7, hl: 0xffc35a, jacket: 0x2c303d };
const UA = 0.28, FA = 0.25;

// ---------- face / scalar parameter defaults ----------
const F0 = { bu:0, bi:0, bd:0, buL:0, buR:0, lid:0, lidL:0, lidR:0, low:0, pup:0, gx:0, gy:0,
  sm:0, smL:0, smR:0, fr:0, op:0, pr:0, li:0, up:0, wi:0, nw:0, nf:0, jc:0, fl:0, ch:0, sw:0,
  col:0, jk:0, pen:0, br:0.3, flut:0, idle:1, cb:0.5, bb:0.5, brate:0.25 };

// surface of the head ellipsoid (head-local coords), used to place face parts
const HC = [0, 0.11, 0.005], HR = [0.088, 0.112, 0.1];
function zS(x, y) { const q = 1 - (x / HR[0]) ** 2 - ((y - HC[1]) / HR[1]) ** 2; return HC[2] + HR[2] * Math.sqrt(Math.max(0, q)); }

function ell(rx, ry, rz, mat, seg = 24) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75)), mat); m.scale.set(rx, ry, rz); return m; }
function lathe(pts, zs, mat) { const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 32); const m = new THREE.Mesh(g, mat); m.scale.set(1, 1, zs); m.userData.s = m.scale.clone(); return m; }
function cap(r, len, mat) { const g = new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 6, 14); g.translate(0, -len / 2, 0); return new THREE.Mesh(g, mat); }

// ---------- the figure ----------
class Figure {
  constructor(opts = {}) {
    this.ghost = !!opts.ghost;
    this.mats = [];
    this.parts = {}; // highlight groups -> meshes
    this.b = {};
    this.root = new THREE.Group();
    this.build();
    this.list = Object.keys(this.b);
    this.rest = {}; this.list.forEach(k => this.rest[k] = this.b[k].position.clone());
  }
  mat(color, extra = {}) {
    const m = this.ghost
      ? new THREE.MeshStandardMaterial({ color: COL.ghost, roughness: 0.7, transparent: true, opacity: 0.5, depthWrite: false })
      : new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.02, ...extra });
    this.mats.push(m); return m;
  }
  tag(part, mesh) { (this.parts[part] = this.parts[part] || []).push(mesh); return mesh; }
  bone(name, parent, x = 0, y = 0, z = 0, order = 'XYZ') { const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); g.rotation.order = order; parent.add(g); this.b[name] = g; return g; }
  add(parent, mesh, part, x = 0, y = 0, z = 0) { mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); if (part) [].concat(part).forEach(p => this.tag(p, mesh)); return mesh; }

  build() {
    const b = this.b, SK = () => this.mat(COL.skin), SH = () => this.mat(COL.shirt), TR = () => this.mat(COL.trousers);
    const hips = this.bone('hips', this.root, 0, 0.965, 0, 'YXZ');
    this.add(hips, lathe([[0, -0.118], [0.07, -0.11], [0.128, -0.08], [0.152, -0.025], [0.152, 0.04], [0.138, 0.1]], 0.7, TR()), ['hips', 'torso']);
    const spine = this.bone('spine', hips, 0, 0.09, 0, 'YXZ');
    this.belly = this.add(spine, lathe([[0.13, -0.04], [0.133, 0.04], [0.137, 0.12], [0.143, 0.2], [0.147, 0.25]], 0.7, SH()), ['belly', 'torso'], 0, 0, 0.004);
    const chest = this.bone('chest', spine, 0, 0.2, 0, 'YXZ');
    this.chestM = this.add(chest, lathe([[0.142, -0.06], [0.155, 0.03], [0.168, 0.11], [0.172, 0.17], [0.162, 0.215], [0.125, 0.245], [0.065, 0.262], [0, 0.266]], 0.63, SH()), ['chest', 'torso'], 0, 0, 0);
    this.add(chest, ell(0.185, 0.048, 0.075, SH()), ['chest', 'torso'], 0, 0.205, -0.008);
    this.collar = this.add(chest, new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.014, 8, 24), SH()), ['collar', 'neck'], 0, 0.245, 0.0);
    this.collar.rotation.x = Math.PI / 2;
    const neck = this.bone('neck', chest, 0, 0.245, 0, 'YXZ');
    this.add(neck, new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.12, 16), SK()), ['neck', 'throat'], 0, 0.04, 0);
    const head = this.bone('head', neck, 0, 0.066, 0, 'YXZ');
    this.headMat = SK();
    this.add(head, ell(HR[0], HR[1], HR[2], this.headMat, 40), 'head', ...HC);
    if (!this.ghost) this.buildFace(head, neck);

    // arms
    for (const s of ['L', 'R']) {
      const sg = s === 'L' ? 1 : -1;
      const clav = this.bone('clav' + s, chest, 0.02 * sg, 0.195, 0);
      this.add(clav, ell(0.05, 0.048, 0.05, SH()), ['shoulders', 'shoulder' + s], 0.163 * sg, -0.004, 0);
      const arm = this.bone('arm' + s, clav, 0.165 * sg, 0, 0);
      this.add(arm, cap(0.044, UA + 0.02, SH()), ['arms', 'arm' + s], 0, 0.01, 0);
      const fore = this.bone('fore' + s, arm, 0, -UA, 0);
      this.add(fore, cap(0.036, FA + 0.01, SK()), ['arms', 'fore' + s, 'forearms'], 0, 0.005, 0);
      const wrist = this.bone('wrist' + s, fore, 0, -FA, 0, 'YXZ');
      this.buildHand(wrist, s, sg);
    }
    // legs
    for (const s of ['L', 'R']) {
      const sg = s === 'L' ? 1 : -1;
      const th = this.bone('thigh' + s, hips, 0.088 * sg, -0.05, 0, 'YXZ');
      this.add(th, cap(0.066, 0.46, TR()), ['legs', 'thigh' + s, 'knees'], 0, 0.015, 0);
      const sh = this.bone('shin' + s, th, 0, -0.43, 0);
      this.add(sh, cap(0.05, 0.44, TR()), ['legs', 'shin' + s], 0, 0.01, 0);
      const ft = this.bone('foot' + s, sh, 0, -0.42, 0, 'YXZ');
      const shoe = this.mat(COL.shoe);
      this.add(ft, ell(0.046, 0.036, 0.09, shoe), ['feet', 'foot' + s], 0, -0.03, 0.035);
      const toe = this.bone('toe' + s, ft, 0, -0.035, 0.105);
      this.add(toe, ell(0.044, 0.03, 0.055, shoe), ['feet', 'toes', 'foot' + s], 0, -0.003, 0.03);
    }
  }

  buildHand(wrist, s, sg) {
    const sk = this.mat(COL.skin);
    const part = ['hands', 'hand' + s];
    this.add(wrist, ell(0.037, 0.05, 0.015, sk), part, 0, -0.045, 0.0);
    const fx = [0.026, 0.009, -0.008, -0.024], L = [[0.038, 0.024, 0.02], [0.042, 0.027, 0.021], [0.039, 0.025, 0.02], [0.03, 0.019, 0.017]];
    for (let i = 0; i < 4; i++) {
      let p = this.bone(`f${s}${i}_0`, wrist, fx[i] * sg, -0.088, 0);
      for (let k = 0; k < 3; k++) {
        const r = i === 3 ? 0.0074 : 0.0086;
        this.add(p, cap(r, L[i][k] + r, sk), [...part, 'fingers'], 0, r * 0.4, 0);
        if (k < 2) p = this.bone(`f${s}${i}_${k + 1}`, p, 0, -L[i][k], 0);
      }
    }
    let t = this.bone(`t${s}_0`, wrist, 0.03 * sg, -0.024, 0.008, 'XYZ');
    this.add(t, cap(0.0105, 0.034, sk), [...part, 'fingers'], 0, 0.004, 0);
    t = this.bone(`t${s}_1`, t, 0, -0.03, 0);
    this.add(t, cap(0.0095, 0.028, sk), [...part, 'fingers'], 0, 0.004, 0);
  }

  buildFace(head, neck) {
    const f = this.face = {};
    const dark = this.mat(0x1b1214), white = this.mat(0xf4f1ec, { roughness: 0.3 }), iris = this.mat(COL.iris, { roughness: 0.3 });
    const lidM = this.mat(0xcf9374), lash = this.mat(0x241a18), hair = this.mat(COL.hair, { roughness: 0.85 });
    // hair cap and ears
    const hg = new THREE.SphereGeometry(1, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.5); hg.rotateX(-0.62); const hc = new THREE.Mesh(hg, hair);
    hc.scale.set(0.0928, 0.1185, 0.1055); this.add(head, hc, 'hair', HC[0], HC[1], HC[2]);
    for (const sg of [1, -1]) this.add(head, ell(0.012, 0.026, 0.018, this.mat(COL.skin)), 'head', 0.087 * sg, 0.11, -0.005);
    f.eyes = []; f.lidU = []; f.lidD = []; f.pupils = []; f.brows = [];
    for (const sg of [1, -1]) {
      const ex = 0.034 * sg, ey = 0.124, ez = zS(ex, ey) - 0.0065, R = 0.0148;
      const eye = new THREE.Group(); eye.position.set(ex, ey, ez); head.add(eye);
      this.add(eye, new THREE.Mesh(new THREE.SphereGeometry(R, 24, 16), white), 'eyes');
      const ir = this.add(eye, new THREE.Mesh(new THREE.CircleGeometry(0.0072, 24), iris), 'eyes', 0, 0, R - 0.0006);
      const pu = this.add(eye, new THREE.Mesh(new THREE.CircleGeometry(0.0034, 20), dark), 'pupils', 0, 0, R - 0.0001);
      ir.castShadow = pu.castShadow = false;
      const lidPivot = new THREE.Group(); lidPivot.position.copy(eye.position); head.add(lidPivot);
      const up = new THREE.Group(), dn = new THREE.Group(); lidPivot.add(up); lidPivot.add(dn);
      this.add(up, new THREE.Mesh(new THREE.SphereGeometry(R * 1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), lidM), ['lids', 'eyes']);
      const ls = new THREE.Mesh(new THREE.TorusGeometry(R * 1.1, 0.0011, 4, 20, Math.PI), lash); ls.rotation.x = Math.PI / 2; up.add(ls);
      this.add(dn, new THREE.Mesh(new THREE.SphereGeometry(R * 1.07, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lidM), ['lids', 'eyes']);
      f.eyes.push(eye); f.lidU.push(up); f.lidD.push(dn); f.pupils.push(pu);
      const bx = 0.037 * sg, by = 0.16, brow = new THREE.Group(); brow.position.set(bx, by, zS(bx, by) + 0.002); head.add(brow);
      const bm = new THREE.Mesh(new THREE.CapsuleGeometry(0.0042, 0.026, 4, 8), lash); bm.rotation.z = Math.PI / 2 + 0.12 * sg; this.add(brow, bm, 'brows');
      brow.userData.base = brow.position.clone(); f.brows.push(brow);
    }
    // nose
    this.add(head, ell(0.0115, 0.021, 0.015, this.mat(COL.skin)), 'nose', 0, 0.092, zS(0, 0.092) + 0.001);
    f.alae = []; f.nostrils = [];
    for (const sg of [1, -1]) {
      const a = this.add(head, ell(0.0068, 0.0062, 0.0075, this.mat(COL.skin)), ['nose', 'nostrils'], 0.0105 * sg, 0.077, zS(0.0105, 0.077) + 0.0045);
      const n = this.add(head, ell(0.0042, 0.0026, 0.003, dark), ['nostrils'], 0.0072 * sg, 0.071, zS(0.0072, 0.071) + 0.012);
      a.userData.base = a.position.clone(); n.userData.base = n.position.clone(); f.alae.push(a); f.nostrils.push(n);
    }
    // cheeks + jaw muscles
    f.cheekMat = this.mat(COL.skin); f.cheeks = []; f.jaw = [];
    for (const sg of [1, -1]) {
      const c = this.add(head, ell(0.024, 0.018, 0.016, f.cheekMat), ['cheeks'], 0.043 * sg, 0.08, zS(0.043, 0.08) - 0.0175);
      c.userData.base = c.position.clone(); f.cheeks.push(c);
      const j = this.add(head, ell(0.014, 0.024, 0.02, this.mat(COL.skin)), ['jaw'], 0.058 * sg, 0.05, 0.028);
      f.jaw.push(j);
    }
    // throat
    f.adam = this.add(neck, ell(0.009, 0.012, 0.008, this.mat(COL.skin)), ['throat'], 0, 0.03, 0.04);
    // mouth
    f.lipMat = this.mat(COL.lip, { roughness: 0.45 }); f.mouthDark = this.mat(0x3a1418, { side: THREE.DoubleSide });
    f.mouthG = new THREE.Group(); head.add(f.mouthG); f.mkey = '';
    this.tag('mouth', { material: f.lipMat }); this.tag('lips', { material: f.lipMat });
  }

  buildMouth(F) {
    const f = this.face;
    const key = ['sm', 'smL', 'smR', 'fr', 'op', 'pr', 'li', 'up', 'wi'].map(k => (F[k] || 0).toFixed(3)).join(',');
    if (key === f.mkey) return; f.mkey = key;
    f.mouthG.children.forEach(c => c.geometry.dispose()); f.mouthG.clear();
    const y0 = 0.047;
    const w = 0.027 * (1 + 0.22 * F.wi + 0.14 * F.sm - 0.22 * F.pr - 0.16 * F.li);
    const sL = F.sm + F.smL - F.fr, sR = F.sm + F.smR - F.fr;
    const cy = s => y0 + 0.011 * s - (s < 0 ? 0.002 : 0);
    const cx = s => w * (1 + 0.12 * Math.max(0, s));
    const thick = Math.max(0.0012, 0.0048 * (1 - 0.6 * F.pr - 0.75 * F.li));
    const upMid = y0 + 0.0035 + 0.007 * F.up + 0.002 * F.op;
    const loMid = y0 - 0.004 - 0.022 * F.op + 0.0015 * F.pr;
    const P = (x, y, dz = 0) => new THREE.Vector3(x, y, zS(x, y) + 0.0025 + dz);
    const Lc = P(cx(sL), cy(sL)), Rc = P(-cx(sR), cy(sR));
    const upPts = [Lc, P(w * 0.5, (upMid + cy(sL)) / 2 + 0.0015 + 0.004 * F.up * (F.smR ? 0.3 : 1)), P(0, upMid), P(-w * 0.5, (upMid + cy(sR)) / 2 + 0.0015 + 0.004 * F.up), Rc];
    const loPts = [Lc, P(w * 0.55, (loMid + cy(sL)) / 2 - 0.001), P(0, loMid, 0.001), P(-w * 0.55, (loMid + cy(sR)) / 2 - 0.001), Rc];
    for (const pts of [upPts, loPts]) {
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, thick, 6, false), f.lipMat);
      f.mouthG.add(m);
    }
    if (F.op > 0.04) {
      const cu = new THREE.CatmullRomCurve3(upPts).getPoints(16), cl = new THREE.CatmullRomCurve3(loPts).getPoints(16).reverse();
      const sh = new THREE.Shape(cu.concat(cl).map(p => new THREE.Vector2(p.x, p.y)));
      const g = new THREE.ShapeGeometry(sh); const pa = g.attributes.position;
      for (let i = 0; i < pa.count; i++) pa.setZ(i, zS(pa.getX(i), pa.getY(i)) + 0.0008);
      f.mouthG.add(new THREE.Mesh(g, f.mouthDark));
    }
  }

  // ---- pose resolution: spec -> snapshot of all bone rotations ----
  resetRest() { for (const k of this.list) { const g = this.b[k]; g.position.copy(this.rest[k]); g.quaternion.identity(); } }
  resolve(spec) {
    this.resetRest();
    for (const [k, e] of Object.entries(spec.j || {})) { const g = this.b[k]; if (g) g.rotation.set(e[0] * D, e[1] * D, e[2] * D); }
    if (spec.hp) this.b.hips.position.set(...spec.hp);
    for (const s of ['L', 'R']) this.fingers(s, (spec.fg || {})[s] || {});
    this.root.updateMatrixWorld(true);
    for (const s of ['L', 'R']) if (spec['ik' + s]) this.solveArm(s, spec['ik' + s]);
    const q = {}; for (const k of this.list) q[k] = this.b[k].quaternion.clone();
    return { q, hp: this.b.hips.position.clone(), f: { ...F0, ...(spec.f || {}) } };
  }
  fingers(s, fg) {
    const sg = s === 'L' ? 1 : -1;
    const c = Array.isArray(fg.c) ? fg.c : [0, 1, 2, 3].map(() => fg.c ?? 0.22);
    const sp = fg.s ?? 0.1;
    const spread = [12, 3, -5, -14];
    for (let i = 0; i < 4; i++) {
      this.b[`f${s}${i}_0`].rotation.set(-c[i] * 85 * D, 0, spread[i] * sp * D * sg);
      this.b[`f${s}${i}_1`].rotation.set(-c[i] * 95 * D, 0, 0);
      this.b[`f${s}${i}_2`].rotation.set(-c[i] * 65 * D, 0, 0);
    }
    const t = fg.t ?? 0.15;
    this.b[`t${s}_0`].rotation.set((-25 - 30 * t) * D, 0, (32 - 52 * t) * sg * D);
    this.b[`t${s}_1`].rotation.set(-t * 50 * D, 0, -t * 20 * sg * D);
  }
  solveArm(s, t) {
    const ua = this.b['arm' + s], fa = this.b['fore' + s], wr = this.b['wrist' + s];
    const ref = this.b[t.to || 'chest'], fr = this.b[t.fr || t.to || 'chest'];
    const frQ = fr.getWorldQuaternion(new THREE.Quaternion());
    const S = ua.getWorldPosition(V());
    let fd = null, pn = null;
    if (t.fd) { fd = V().set(...t.fd).normalize().applyQuaternion(frQ); pn = V().set(...(t.pn || [0, 0, 1])).applyQuaternion(frQ); pn.sub(fd.clone().multiplyScalar(pn.dot(fd))).normalize(); }
    const T = ref.localToWorld(V().set(...t.p));
    if (fd) T.addScaledVector(fd, -0.05).addScaledVector(pn, -0.017); // p is the palm contact point
    const pole = V().set(...(t.pole || [0.3 * (s === 'L' ? 1 : -1), -1, -0.5])).normalize().applyQuaternion(frQ);
    const a = UA, bL = FA, dv = T.clone().sub(S); let d = dv.length(); const u = dv.normalize();
    d = Math.min(Math.max(d, Math.abs(a - bL) + 1e-3), a + bL - 1e-3);
    const cosA = (a * a + d * d - bL * bL) / (2 * a * d), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    let perp = pole.clone().sub(u.clone().multiplyScalar(pole.dot(u)));
    if (perp.lengthSq() < 1e-8) perp.set(0, 0, 1); perp.normalize();
    const E = S.clone().addScaledVector(u, a * cosA).addScaledVector(perp, a * sinA);
    const Tc = S.clone().addScaledVector(u, d);
    const d1 = E.clone().sub(S).normalize(), d2 = Tc.clone().sub(E).normalize();
    const Y = d1.clone().negate();
    let Z = d2.clone().sub(d1.clone().multiplyScalar(d2.dot(d1)));
    if (Z.lengthSq() < 1e-8) Z = perp.clone(); Z.normalize();
    const X = V().crossVectors(Y, Z);
    const Qw = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
    const pq = ua.parent.getWorldQuaternion(new THREE.Quaternion());
    ua.quaternion.copy(pq.invert().multiply(Qw));
    fa.quaternion.setFromAxisAngle(V().set(1, 0, 0), -Math.acos(Math.min(1, Math.max(-1, d1.dot(d2)))));
    ua.updateMatrixWorld(true);
    if (fd) {
      const hy = fd.clone().negate(), hz = pn.clone(), hx = V().crossVectors(hy, hz);
      const Hw = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(hx, hy, hz));
      const fq = fa.getWorldQuaternion(new THREE.Quaternion());
      wr.quaternion.copy(fq.invert().multiply(Hw));
    }
    this.root.updateMatrixWorld(true);
  }
  apply(A, B, e) {
    for (const k of this.list) this.b[k].quaternion.slerpQuaternions(A.q[k], B.q[k], e);
    this.b.hips.position.lerpVectors(A.hp, B.hp, e);
  }
  applyFace(F, time) {
    const f = this.face; if (!f) return;
    for (let i = 0; i < 2; i++) {
      const sg = i ? -1 : 1, side = i ? 'R' : 'L';
      const br = f.brows[i], up = F.bu + F['bu' + side];
      br.position.copy(br.userData.base);
      br.position.y += 0.011 * up - 0.005 * F.bd + 0.003 * F.bi;
      br.position.x -= 0.004 * F.bd * sg;
      br.rotation.z = (-F.bi * 20 + F.bd * 15) * D * sg;
      const c = Math.min(1, Math.max(-0.45, F.lid + F['lid' + side] + F._blink + F.flut * 0.75 * Math.abs(Math.sin(time * 19))));
      f.lidU[i].rotation.x = -0.5 + c * 1.62 - F.gy * 0.012;
      f.lidD[i].rotation.x = 0.62 - 0.5 * Math.min(1, F.low + 0.55 * F.ch) - F.gy * 0.004;
      f.eyes[i].rotation.set(-F.gy * D, F.gx * D, 0);
      const ps = Math.max(0.45, 1 + 0.75 * F.pup); f.pupils[i].scale.set(ps, ps, 1);
      const al = f.alae[i], no = f.nostrils[i];
      al.scale.set(0.0068 * (1 + 0.6 * F.nf), 0.0062 * (1 + 0.2 * F.nf), 0.0075);
      al.position.copy(al.userData.base); al.position.y += 0.004 * F.nw + 0.002 * F.up; al.position.x += 0.003 * F.nf * sg;
      no.scale.set(0.0042 * (1 + 1.3 * F.nf), 0.0026 * (1 + 0.8 * F.nf), 0.003);
      no.position.copy(no.userData.base); no.position.y += 0.004 * F.nw + 0.002 * F.up; no.position.x += 0.002 * F.nf * sg;
      const ch = f.cheeks[i]; ch.position.copy(ch.userData.base);
      const chUp = F.ch + 0.35 * Math.max(0, F.sm + F['sm' + side]) + 0.5 * F.nw;
      ch.position.y += 0.007 * chUp; ch.position.z += 0.006 * Math.min(1.2, chUp); ch.visible = chUp > 0.2;
      const j = f.jaw[i], jc = F.jc * (0.85 + 0.15 * Math.sin(time * 7));
      j.scale.set(0.014 * (1 + 0.45 * jc), 0.024 * (1 + 0.1 * jc), 0.02 * (1 + 0.2 * jc));
    }
    f.cheekMat.color.set(COL.skin).lerp(new THREE.Color(0xff4a4a), 0.55 * F.fl);
    this.headMat.emissive.setRGB(0.2 * F.fl, 0.01 * F.fl, 0.01 * F.fl);
    f.adam.position.set(0, 0.03 + 0.028 * F.sw, 0.04 - 0.004 * F.sw);
    this.collar.position.set(0, 0.245 + 0.01 * F.col, 0.024 * F.col);
    this.collar.rotation.x = Math.PI / 2 - 0.35 * F.col;
    this.buildMouth(F);
  }
  setHighlight(parts, k) {
    const want = new Set(); for (const p of parts || []) for (const m of this.parts[p] || []) want.add(m.material);
    for (const m of this.mats) if (m.emissive && m !== this.headMat) m.emissive.setHex(0);
    for (const m of want) if (m.emissive) m.emissive.setHex(COL.hl).multiplyScalar(k);
  }
}

// ---------- props ----------
function makeProps(fig) {
  const P = {}, M = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 });
  const chair = new THREE.Group(), cm = M(COL.chair);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.46), cm); seat.position.set(0, 0.43, 0.13); chair.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.04), cm); back.position.set(0, 0.7, -0.12); back.rotation.x = -0.08; chair.add(back);
  for (const [x, z] of [[0.21, 0.33], [-0.21, 0.33], [0.21, -0.08], [-0.21, -0.08]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.43, 8), cm); l.position.set(x, 0.215, z); chair.add(l); }
  chair.traverse(o => { o.castShadow = o.receiveShadow = true; }); P.chair = chair;
  const door = new THREE.Group();
  const fr = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.05, 0.06), M(0x4a5272)); fr.position.y = 1.025; door.add(fr);
  const pnl = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.95, 0.07), M(0x6d7aa8)); pnl.position.y = 0.98; door.add(pnl);
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 96; const cx = cv.getContext('2d');
  cx.fillStyle = '#1fbf6a'; cx.fillRect(0, 0, 256, 96); cx.fillStyle = '#fff'; cx.font = 'bold 62px sans-serif'; cx.textAlign = 'center'; cx.fillText('EXIT', 128, 72);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }));
  sign.position.set(0, 1.72, 0.045); door.add(sign);
  door.position.set(-1.25, 0, -0.2); door.rotation.y = Math.PI / 2; P.door = door;
  // hand-held props (parented to a wrist)
  const phone = new THREE.Group();
  phone.add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.145, 0.009), M(0x111318)));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.062, 0.132), new THREE.MeshStandardMaterial({ color: 0x9fc4ff, emissive: 0x5b8cff, emissiveIntensity: 1.2 }));
  scr.position.z = 0.0048; phone.add(scr);
  phone.position.set(0, -0.075, 0.018); P.phone = { obj: phone, bone: 'wristR' };
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.15, 10), M(0x2f74d0));
  const penG = new THREE.Group(); penG.add(pen); pen.rotation.x = Math.PI / 2; P.pen = { obj: penG, bone: null, pen };
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.11, 18), M(0xe9e4da));
  cup.position.set(0, -0.06, 0.05); P.cup = { obj: cup, bone: 'wristR' };
  const watch = new THREE.Group();
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.007, 8, 20), M(0x262a33)); band.rotation.x = Math.PI / 2; watch.add(band);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.008, 20), M(0xd8dce6)); face.rotation.x = Math.PI / 2; face.position.z = -0.038; watch.add(face);
  watch.position.set(0, 0.03, 0); P.watch = { obj: watch, bone: 'wristL' };
  const wallet = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.02), M(0x5a3b25)); wallet.position.set(-0.085, -0.055, -0.093); P.wallet = { obj: wallet, bone: 'hips' };
  // jacket: two shells that rotate closed
  const jm = new THREE.MeshStandardMaterial({ color: COL.jacket, roughness: 0.75, side: THREE.DoubleSide });
  const jk = new THREE.Group();
  const mkShell = (start) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16, start, Math.PI, 0.22 * Math.PI, 0.72 * Math.PI), jm); m.scale.set(0.178, 0.31, 0.118); return m; };
  const jl = mkShell(Math.PI / 2), jr = mkShell(-Math.PI / 2); jk.add(jl, jr); jk.position.set(0, 0.0, 0.0);
  const btn = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), M(0xc9b37a)); btn.position.set(0, -0.12, 0.112); jr.add(btn); btn.scale.set(1 / 0.178, 1 / 0.31, 1 / 0.118);
  P.jacket = { obj: jk, bone: 'chest', jl, jr };
  return P;
}

// ---------- viewer ----------
export function mount(stage, hooks = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: !!hooks.capture });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0f1220); scene.fog = new THREE.Fog(0x0f1220, 6, 14);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.02, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 0.25; controls.maxDistance = 7; controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.62;
  scene.add(new THREE.HemisphereLight(0xd7defa, 0x1c1f2c, 1.15));
  const key = new THREE.DirectionalLight(0xfff4e8, 2.3); key.position.set(1.8, 3.6, 3.0); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2.6, bottom: -0.5, near: 0.5, far: 9 }); key.shadow.bias = -0.0004; scene.add(key);
  const rim = new THREE.DirectionalLight(0xa58cff, 1.4); rim.position.set(-2.4, 2.4, -2.8); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x9fb8ff, 0.45); fill.position.set(-2.5, 1.2, 2); scene.add(fill);
  // floor with soft radial fade
  const fc = document.createElement('canvas'); fc.width = fc.height = 256; const g2 = fc.getContext('2d');
  const gr = g2.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, '#232946'); gr.addColorStop(0.55, '#151a2b'); gr.addColorStop(1, '#0f1220');
  g2.fillStyle = gr; g2.fillRect(0, 0, 256, 256);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 48), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(fc), roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.565, 64), new THREE.MeshBasicMaterial({ color: 0x3a4470, transparent: true, opacity: 0.6 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.002; scene.add(ring);

  const fig = new Figure(); scene.add(fig.root);
  const props = makeProps(fig);
  scene.add(props.chair, props.door);
  for (const k of ['phone', 'pen', 'cup', 'watch', 'wallet', 'jacket']) (props[k].bone ? fig.b[props[k].bone] : scene).add(props[k].obj);
  let extras = [];

  let A = null, timeline = [], T = 0, total = 1, playing = true, speed = 1, hlOn = true, cueSpec = null, last = performance.now(), raf = 0, F = { ...F0 };
  const blinkState = { phase: 0, t: -1 };
  const BASES = (window.BO3D && window.BO3D.bases) || {};

  function merge(a, b) {
    const o = { ...a, ...b, j: { ...(a.j || {}), ...(b.j || {}) }, f: { ...(a.f || {}), ...(b.f || {}) }, fg: { ...(a.fg || {}), ...(b.fg || {}) } };
    for (const s of ['L', 'R']) if (b['ik' + s] === null) delete o['ik' + s];
    return o;
  }
  function focusPoint(spec, snap) {
    fig.apply(snap, snap, 1); fig.root.updateMatrixWorld(true);
    const w = n => fig.b[n].getWorldPosition(V());
    const f = spec.cam?.f || 'body';
    if (spec.cam?.tg) return V().set(...spec.cam.tg);
    if (f === 'eyes' || f === 'face') return w('head').add(V().set(0, 0.11, 0.03).applyQuaternion(fig.b.head.getWorldQuaternion(new THREE.Quaternion())));
    if (f === 'head') return w('neck').add(V().set(0, 0.1, 0));
    if (f === 'upper') return w('chest').add(V().set(0, 0.2, 0));
    if (f === 'hands') return w('wristL').add(w('wristR')).multiplyScalar(0.5);
    if (f === 'legs') return w('shinL').add(w('shinR')).multiplyScalar(0.5).add(V().set(0, -0.1, 0));
    if (f === 'feet') return w('footL').add(w('footR')).multiplyScalar(0.5).add(V().set(0, 0.05, 0));
    if (f === 'wide') return V().set(-0.3, 0.9, 0.3);
    return w('hips').add(V().set(0, 0.12, 0));
  }
  const DIST = { eyes: 0.42, face: 0.68, head: 1.0, upper: 1.7, hands: 1.25, legs: 1.9, feet: 1.5, body: 3.3, wide: 4.6 };
  let camGoal = null;
  function resetView(spec = cueSpec, snap = timeline[1]?.B) {
    if (!spec || !snap) return;
    const c = spec.cam || {}, tgt = focusPoint(spec, snap);
    const d = (c.d || DIST[c.f || 'body']) * Math.pow(Math.max(1, 0.9 / camera.aspect), 0.85); // pull back on tall, narrow phone screens
    const az = (c.az ?? 18) * D, el = (c.el ?? 8) * D;
    const pos = tgt.clone().add(V().set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(d));
    controls.target.copy(tgt); camera.position.copy(pos); controls.update();
  }

  function load(spec) {
    cueSpec = spec;
    const base = merge(BASES[spec.base || 'stand'] || {}, spec.p0 || {});
    const S0 = fig.resolve(base);
    timeline = []; let prev = base, prevSnap = S0, idx = 0;
    const lead = spec.lead ?? 1.1;
    timeline.push({ A: S0, B: S0, d: lead, label: spec.baseLabel || 'Baseline', a: -1, b: -1 });
    spec.steps.forEach((st, i) => {
      const s = merge(prev, st.p || {}); const snap = fig.resolve(s);
      timeline.push({ A: prevSnap, B: snap, d: st.in ?? 0.8, label: st.label || spec.label || 'The cue', note: st.note, a: i - 1, b: i, ease: st.ease });
      timeline.push({ A: snap, B: snap, d: st.hold ?? 2.2, label: st.label || spec.label || 'The cue', note: st.note, a: i, b: i });
      prev = s; prevSnap = snap; idx = i;
    });
    if (!spec.noReturn) timeline.push({ A: prevSnap, B: S0, d: spec.ret ?? 0.9, label: 'Back to baseline', a: idx, b: -1, ease: spec.retEase });
    timeline.push({ A: S0, B: S0, d: 0.7, label: spec.baseLabel || 'Baseline', a: -1, b: -1 });
    total = timeline.reduce((s, x) => s + x.d, 0);
    // props + scene
    const want = new Set(spec.props || []);
    props.chair.visible = (spec.base || '').startsWith('sit') || want.has('chair');
    props.door.visible = want.has('door');
    for (const k of ['phone', 'pen', 'cup', 'watch', 'wallet', 'jacket']) props[k].obj.visible = want.has(k);
    extras.forEach(e => scene.remove(e.root)); extras = [];
    for (const x of spec.extras || []) {
      const e = new Figure({ ghost: true });
      const snap = e.resolve(merge(BASES[x.base || 'stand'] || {}, x.p || {}));
      e.apply(snap, snap, 1); e.root.position.set(...(x.pos || [1, 0, 0])); e.root.rotation.y = (x.ry || 0) * D;
      scene.add(e.root); extras.push(e);
    }
    T = 0; resetView(spec, timeline[2]?.A || timeline[1].B);
  }

  const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const qT = new THREE.Quaternion(), ax = { x: V().set(1, 0, 0), y: V().set(0, 1, 0), z: V().set(0, 0, 1) };
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (playing) T = (T + dt * speed) % total;
    step(T, dt * (playing ? speed : 0));
    controls.update(); renderer.render(scene, camera);
  }
  function step(t, dt) {
    if (!timeline.length) return;
    let acc = 0, seg = timeline[0], p = 0;
    for (const s of timeline) { if (t < acc + s.d) { seg = s; p = (t - acc) / s.d; break; } acc += s.d; seg = s; p = 1; }
    const e = seg.ease === 'snap' ? (p > 0.02 ? 1 : 0) : seg.ease === 'lin' ? p : ease(p);
    fig.apply(seg.A, seg.B, e);
    for (const k in F0) F[k] = seg.A.f[k] + (seg.B.f[k] - seg.A.f[k]) * e;
    // oscillations belonging to steps
    const now = t;
    for (let i = 0; i < cueSpec.steps.length; i++) {
      const w = (seg.a === i ? 1 - e : 0) + (seg.b === i ? e : 0); if (!w) continue;
      for (const o of cueSpec.steps[i].osc || []) {
        const [bn, axn, amp, hz, ph = 0] = o;
        const names = bn.endsWith('*') ? fig.list.filter(n => n.startsWith(bn.slice(0, -1))) : [bn];
        names.forEach((n, j) => { const g = fig.b[n]; if (!g) return; qT.setFromAxisAngle(ax[axn], amp * D * w * Math.sin(2 * Math.PI * hz * now + ph + j * 0.9)); g.quaternion.multiply(qT); });
      }
    }
    // idle life: sway, breathing, blinking
    const idle = F.idle;
    qT.setFromAxisAngle(ax.z, 0.7 * D * idle * Math.sin(now * 1.1)); fig.b.spine.quaternion.multiply(qT);
    qT.setFromAxisAngle(ax.y, 1.6 * D * idle * Math.sin(now * 0.7 + 1)); fig.b.head.quaternion.multiply(qT);
    if (idle > 1.05) { qT.setFromAxisAngle(ax.x, 6 * D * (idle - 1) * Math.sin(now * 2.3)); fig.b.wristR.quaternion.multiply(qT); qT.setFromAxisAngle(ax.y, 5 * D * (idle - 1) * Math.sin(now * 1.7)); fig.b.head.quaternion.multiply(qT); }
    const bph = Math.sin(now * 2 * Math.PI * F.brate) * Math.min(1, idle + 0.15);
    const cs = fig.chestM.userData.s, bs = fig.belly.userData.s;
    fig.chestM.scale.set(cs.x * (1 + 0.025 * F.cb * bph), cs.y * (1 + 0.03 * F.cb * bph), cs.z * (1 + 0.08 * F.cb * bph));
    fig.belly.scale.set(bs.x * (1 + 0.03 * F.bb * bph), bs.y, bs.z * (1 + 0.17 * F.bb * bph));
    qT.setFromAxisAngle(ax.z, 2.2 * D * F.cb * bph); fig.b.clavL.quaternion.multiply(qT); qT.setFromAxisAngle(ax.z, -2.2 * D * F.cb * bph); fig.b.clavR.quaternion.multiply(qT);
    // blink
    const rate = F.br * Math.min(1, idle);
    blinkState.phase += dt * rate;
    if (blinkState.phase >= 1) { blinkState.phase -= 1; blinkState.t = 0; }
    let bl = 0; if (blinkState.t >= 0) { blinkState.t += dt; const x = blinkState.t / 0.16; bl = x < 1 ? Math.sin(Math.PI * x) : 0; if (x >= 1) blinkState.t = -1; }
    F._blink = bl * (1 - Math.max(0, F.lid));
    fig.root.updateMatrixWorld(true);
    fig.applyFace(F, now);
    // props
    const jk = props.jacket; jk.jl.rotation.y = 0.55 * (1 - F.jk); jk.jr.rotation.y = -0.55 * (1 - F.jk) - 0.06 * F.jk;
    jk.obj.position.set(0, 0.03, 0.003);
    if (props.pen.obj.visible) { // pen sits in the fist and swings to point at the mouth corner as F.pen rises
      const pg = props.pen.obj, H = fig.b.wristR.localToWorld(V().set(0, -0.06, 0.03)), M = fig.b.head.localToWorld(V().set(-0.016, 0.046, 0.1));
      const dHand = V().set(1, 0, 0).applyQuaternion(fig.b.wristR.getWorldQuaternion(new THREE.Quaternion()));
      const dir = dHand.lerp(M.clone().sub(H).normalize(), Math.min(1, F.pen)).normalize();
      pg.position.copy(H).addScaledVector(dir, 0.05); pg.lookAt(pg.position.clone().add(dir)); }
    // highlight
    const hk = hlOn ? (0.12 + 0.09 * Math.sin(now * 5)) * (seg.b >= 0 || seg.a >= 0 ? 1 : 0.25) : 0;
    fig.setHighlight(cueSpec.hl, hk);
    if (hooks.onTick) hooks.onTick({ label: seg.label, note: seg.note, t, total, cue: seg.b >= 0 || seg.a >= 0 });
  }
  function resize() { const w = stage.clientWidth || 300, h = stage.clientHeight || 300; renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%'; camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();
  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  return {
    play(spec) { load(spec); playing = true; start(); },
    replay() { T = 0; playing = true; blinkState.phase = 0; },
    toggle() { playing = !playing; return playing; },
    setSpeed(s) { speed = s; },
    setHighlight(on) { hlOn = on; },
    resetView: () => resetView(),
    seek(t) { T = t; step(T, 0.016); controls.update(); renderer.render(scene, camera); },
    holdTime() { // middle of the last hold (for screenshots)
      let acc = 0, best = 0; for (const s of timeline) { if (s.a >= 0 && s.a === s.b) best = acc + s.d * 0.6; acc += s.d; } return best;
    },
    stop, start,
    canvas: renderer.domElement, _fig: fig,
    dispose() { stop(); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); }
  };
}
