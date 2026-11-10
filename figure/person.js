// Read & Connect: realistic figure.
// Loads a rigged, textured human (Microsoft Rocketbox "Male_Adult_02", MIT licence, see CREDITS.md)
// and makes it copy the pose of the invisible procedural "driver" rig from viewer.js every frame.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const V = () => new THREE.Vector3(), Q = () => new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0), FWD = new THREE.Vector3(0, 0, 1);
const nm = s => 'Bip01_' + s.replace(/\s/g, '_');

// orthonormal frame from a primary and a secondary direction -> rotation matrix
function frame(p, s) {
  const a = p.clone().normalize(), b = s.clone().sub(a.clone().multiplyScalar(s.dot(a))).normalize(), c = V().crossVectors(a, b);
  return new THREE.Matrix4().makeBasis(a, b, c);
}
function rotBetween(pm, sm, pd, sd) { // rotation taking frame (pm,sm) onto (pd,sd)
  const R = frame(pd, sd).multiply(frame(pm, sm).invert());
  return Q().setFromRotationMatrix(R);
}

export async function loadPerson(url) {
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  const g = await loader.loadAsync(url);
  return g.scene;
}

// a see-through copy of the model for background people
export function ghostCopy(src, color, opacity) {
  const m = SkeletonUtils.clone(src);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, transparent: true, opacity, depthWrite: true });
  m.traverse(o => { if (o.isMesh) o.material = mat; });
  return m;
}

export class Person {
  constructor(model, drv) {
    this.root = model; this.drv = drv;
    const bone = n => model.getObjectByName(nm(n));
    this.bone = bone;
    model.updateMatrixWorld(true);
    const wp = n => bone(n).getWorldPosition(V());
    // face +Z with the character's left on +X (same as the driver rig)
    if (wp('L UpperArm').x < wp('R UpperArm').x) { model.rotation.y = Math.PI; model.updateMatrixWorld(true); }
    this.meshes = []; this.mats = [];
    model.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
        if (o.morphTargetDictionary) this.meshes.push(o);
        for (const m of [].concat(o.material)) if (!this.mats.includes(m)) this.mats.push(m);
      }
    });
    this.morph = {}; // short name -> index
    if (this.meshes[0]) for (const [k, i] of Object.entries(this.meshes[0].morphTargetDictionary)) this.morph[k.replace(/^.*\./, '').replace(/^[A-Z]{2}_\d+_/, '')] = i;
    this.headMat = this.mats.find(m => /head/i.test(m.name)) || null;
    this.fitDriver(wp);
    this.calibrate(bone, wp);
    this.setupHighlight();
  }

  // give the driver rig this model's proportions
  fitDriver(wp) {
    const d = this.drv, b = d.b;
    const set = (k, v) => { b[k].position.copy(v); d.rest[k] = v.clone(); };
    const pel = wp('Pelvis'), sp = wp('Spine'), ch = wp('Spine2'), nk = wp('Neck'), hd = wp('Head');
    set('hips', V().set(0, pel.y, pel.z));
    set('spine', sp.clone().sub(pel).setX(0)); set('chest', ch.clone().sub(sp).setX(0));
    set('neck', nk.clone().sub(ch).setX(0)); set('head', hd.clone().sub(nk).setX(0));
    for (const s of ['L', 'R']) {
      const S = s + ' ';
      const cl = wp(S + 'Clavicle'), ua = wp(S + 'UpperArm'), fa = wp(S + 'Forearm'), ha = wp(S + 'Hand');
      set('clav' + s, cl.clone().sub(ch)); set('arm' + s, ua.clone().sub(cl));
      d.UA = ua.distanceTo(fa); d.FA = fa.distanceTo(ha);
      d.palmD = 0.57 * ha.distanceTo(wp(S + 'Finger2'));
      set('fore' + s, V().set(0, -d.UA, 0)); set('wrist' + s, V().set(0, -d.FA, 0));
      const th = wp(S + 'Thigh'), ca = wp(S + 'Calf'), ft = wp(S + 'Foot'), to = wp(S + 'Toe0');
      set('thigh' + s, th.clone().sub(pel).setY(th.y - pel.y));
      set('shin' + s, V().set(0, -th.distanceTo(ca), 0)); set('foot' + s, V().set(0, -ca.distanceTo(ft), 0));
      const tv = to.clone().sub(ft); set('toe' + s, V().set(0, tv.y, Math.hypot(tv.x, tv.z)));
    }
    // contact points in cues3d.js were written for the old mannequin; shift them so they land on the same body spot
    const OLD = { hips: 0.965, spine: 1.055, chest: 1.255, neck: 1.5, head: 1.566 };
    d.adj = {}; d.root.updateMatrixWorld(true);
    const DZ = { hips: 0.03, spine: 0.045, chest: 0.04, neck: 0.025, head: 0.03 }; // body surface is deeper (jumper, real proportions)
    for (const [k, y] of Object.entries(OLD)) d.adj[k] = { y: y - b[k].getWorldPosition(V()).y, z: DZ[k] };
    this.ankleH = wp('L Foot').y;
    this.thighY = b.thighL.position.y; this.shinL = -b.shinL.position.y;
  }

  calibrate(bone, wp) {
    const d = this.drv; d.resetRest(); d.root.updateMatrixWorld(true);
    const L = [];
    const add = (mn, dn, pm, sm, pd, sd, extra = {}) => {
      const mb = bone(mn); if (!mb) return;
      const qb = mb.getWorldQuaternion(Q());
      const R = pm ? rotBetween(pm, sm, pd, sd) : Q();
      L.push({ mb, dn, cal: R.multiply(qb), ...extra });
    };
    const dir = (a, b) => wp(b).sub(wp(a));
    add('Pelvis', 'hips');
    add('Spine', 'spine');
    add('Spine1', null, null, null, null, null, { mid: ['spine', 'chest'] });
    add('Spine2', 'chest'); add('Neck', 'neck'); add('Head', 'head');
    for (const s of ['L', 'R']) {
      const S = s + ' ', sg = s === 'L' ? 1 : -1, DOWN = V().set(0, -1, 0), LAT = V().set(sg, 0, 0);
      add(S + 'Clavicle', 'clav' + s, dir(S + 'Clavicle', S + 'UpperArm'), FWD, LAT, FWD);
      add(S + 'UpperArm', 'arm' + s, dir(S + 'UpperArm', S + 'Forearm'), FWD, DOWN, FWD);
      add(S + 'Forearm', 'fore' + s, dir(S + 'Forearm', S + 'Hand'), FWD, DOWN, FWD);
      const fm = dir(S + 'Hand', S + 'Finger2'), lm = dir(S + 'Finger4', S + 'Finger1');
      const palm = V().crossVectors(fm.clone().normalize(), lm.clone().normalize()).multiplyScalar(sg);
      add(S + 'Hand', 'wrist' + s, fm, lm, DOWN, LAT);
      for (let i = 1; i <= 4; i++) {
        const n0 = `${S}Finger${i}`, n1 = n0 + '1', n2 = n0 + '2', k = `f${s}${i - 1}_`;
        add(n0, k + 0, dir(n0, n1), lm, DOWN, LAT);
        add(n1, k + 1, dir(n1, n2), lm, DOWN, LAT);
        add(n2, k + 2, dir(n1, n2), lm, DOWN, LAT);
      }
      add(S + 'Finger0', `t${s}_0`, dir(S + 'Finger0', S + 'Finger01'), palm, DOWN, FWD);
      add(S + 'Finger01', `t${s}_1`, dir(S + 'Finger01', S + 'Finger02'), palm, DOWN, FWD);
      add(S + 'Finger02', `t${s}_1`, dir(S + 'Finger01', S + 'Finger02'), palm, DOWN, FWD);
      add(S + 'Thigh', 'thigh' + s, dir(S + 'Thigh', S + 'Calf'), FWD, DOWN, FWD);
      add(S + 'Calf', 'shin' + s, dir(S + 'Calf', S + 'Foot'), FWD, DOWN, FWD);
      const tdir = dir(S + 'Foot', S + 'Toe0'), tdD = d.b['toe' + s].position.clone();
      add(S + 'Foot', 'foot' + s, tdir, UP, tdD, UP);
      add(S + 'Toe0', 'toe' + s, tdir.clone().setY(0), UP, FWD, UP);
    }
    // eyes follow the head plus gaze
    this.eyes = ['L', 'R'].map(s => { const mb = bone(s + 'Eye'); return mb && { mb, cal: mb.getWorldQuaternion(Q()) }; }).filter(Boolean);
    this.headCal = L.find(x => x.dn === 'head').cal;
    this.makePupils();
    this.list = L;
    this.top = this.root.getObjectByName('Bip01');
    this.sp = ['Spine', 'Spine1', 'Spine2', 'Neck'].map(bone);
    this.pelvis = bone('Pelvis');
    this.masseter = ['L', 'R'].map(s => bone(s + 'Masseter')).filter(Boolean);
  }

  // pupil discs: only shown while a cue changes pupil size (the texture has a normal-size pupil)
  makePupils() {
    const skin = this.meshes.find(m => m.isSkinnedMesh); if (!skin) return;
    const bones = skin.skeleton.bones;
    this.pupils = [];
    const dark = new THREE.MeshBasicMaterial({ color: 0x0b0706 }), iris = new THREE.MeshStandardMaterial({ color: 0x4f2b18, roughness: 0.5 });
    for (const e of this.eyes) {
      const bi = bones.indexOf(e.mb); let best = -1, c = e.mb.getWorldPosition(V());
      for (const m of this.meshes) {
        const a = m.geometry.attributes; if (!a.skinIndex) continue;
        for (let i = 0; i < a.position.count; i++) for (let k = 0; k < 4; k++)
          if (a.skinIndex.getComponent(i, k) === bi && a.skinWeight.getComponent(i, k) > 0.9) {
            const p = V().fromBufferAttribute(a.position, i); if (m.isSkinnedMesh) m.applyBoneTransform(i, p); p.applyMatrix4(m.matrixWorld); best = Math.max(best, p.sub(c).dot(FWD));
          }
      }
      if (best < 0.004) best = 0.0125;
      const grp = new THREE.Group(), inv = e.mb.getWorldQuaternion(Q()).invert();
      grp.quaternion.copy(Q().setFromUnitVectors(FWD, FWD.clone().applyQuaternion(inv)));
      grp.position.copy(FWD.clone().multiplyScalar(best + 0.0001).applyQuaternion(inv));
      const ir = new THREE.Mesh(new THREE.CircleGeometry(0.0015, 24), iris), pu = new THREE.Mesh(new THREE.CircleGeometry(0.0012, 24), dark);
      pu.position.z = 0.0002; grp.add(ir, pu); grp.visible = false; e.mb.add(grp);
      this.pupils.push({ grp, ir, pu });
    }
  }

  setupHighlight() {
    const skin = this.meshes.find(m => m.isSkinnedMesh) || this.root.getObjectByProperty('isSkinnedMesh', true);
    this.skel = skin.skeleton; const n = this.skel.bones.length;
    this.hlU = { uHl: { value: new Float32Array(n) }, uHlK: { value: 0 }, uHlC: { value: new THREE.Color(0xffb020) } };
    this.boneIx = {}; this.skel.bones.forEach((b, i) => this.boneIx[b.name] = i);
    const U = this.hlU;
    for (const m of this.mats) {
      m.onBeforeCompile = sh => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>\nuniform float uHl[${n}];\nvarying float vHl;`)
          .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n vHl = skinWeight.x*uHl[int(skinIndex.x)]+skinWeight.y*uHl[int(skinIndex.y)]+skinWeight.z*uHl[int(skinIndex.z)]+skinWeight.w*uHl[int(skinIndex.w)];`);
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nuniform float uHlK; uniform vec3 uHlC; varying float vHl;`)
          .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n totalEmissiveRadiance += uHlC * uHlK * clamp(vHl,0.,1.);`);
      };
      m.needsUpdate = true;
    }
    const sides = (f) => ['L', 'R'].flatMap(f);
    const fing = s => ['Finger0', 'Finger01', 'Finger02', ...[1, 2, 3, 4].flatMap(i => [`Finger${i}`, `Finger${i}1`, `Finger${i}2`])].map(x => `${s} ${x}`);
    const hand = s => [`${s} Hand`, ...fing(s)];
    const face = ['MJaw', 'MBottomLip', 'LMouthBottom', 'RMouthBottom', 'MUpperLip', 'RUpperlip', 'LUpperlip', 'RMouthCorner', 'LMouthCorner', 'RCheek', 'LCheek', 'RCaninus', 'LCaninus'];
    this.parts = {
      hands: sides(hand), handL: hand('L'), handR: hand('R'), fingers: sides(fing), fingersR: fing('R'), fingersL: fing('L'),
      arms: sides(s => [`${s} UpperArm`, `${s} Forearm`]), forearms: sides(s => [`${s} Forearm`]),
      shoulders: sides(s => [`${s} Clavicle`, `${s} UpperArm*0.5`]), shoulderL: ['L Clavicle', 'L UpperArm*0.5'], shoulderR: ['R Clavicle', 'R UpperArm*0.5'],
      torso: ['Pelvis', 'Spine', 'Spine1', 'Spine2'], chest: ['Spine2'], belly: ['Spine', 'Spine1'], hips: ['Pelvis'],
      neck: ['Neck'], throat: ['Neck'], collar: ['Neck', 'Spine2*0.4'], head: ['Head', ...face, 'MNose', 'REyeBlinkTop', 'LEyeBlinkTop', 'REyeBlinkBottom', 'LEyeBlinkBottom', 'RInnerEyebrow', 'LInnerEyebrow', 'MMiddleEyebrow', 'ROuterEyebrow', 'LOuterEyebrow'],
      lids: ['REyeBlinkTop', 'LEyeBlinkTop', 'REyeBlinkBottom', 'LEyeBlinkBottom'], brows: ['RInnerEyebrow', 'LInnerEyebrow', 'MMiddleEyebrow', 'ROuterEyebrow', 'LOuterEyebrow'],
      nose: ['MNose'], nostrils: ['MNose'], jaw: ['MJaw', 'LMasseter', 'RMasseter'], mouth: face, lips: face, cheeks: ['RCheek', 'LCheek'],
      legs: sides(s => [`${s} Thigh`, `${s} Calf`]), thighL: ['L Thigh'], thighR: ['R Thigh'], knees: sides(s => [`${s} Calf*0.6`, `${s} Thigh*0.4`]),
      feet: sides(s => [`${s} Foot`, `${s} Toe0`]), footL: ['L Foot', 'L Toe0'], footR: ['R Foot', 'R Toe0'], toes: sides(s => [`${s} Toe0`]),
    };
    this.hlKey = '';
  }
  setHighlight(parts, k) {
    const key = (parts || []).join(',');
    if (key !== this.hlKey) {
      this.hlKey = key; const a = this.hlU.uHl.value; a.fill(0);
      for (const p of parts || []) for (const e of this.parts[p] || []) {
        const [n, w] = e.split('*'); const i = this.boneIx[nm(n)]; if (i != null) a[i] = Math.max(a[i], w ? +w : 1);
      }
    }
    this.hlU.uHlK.value = k * 2.2;
  }

  // copy the driver pose
  sync() {
    const d = this.drv, q = Q(), pq = Q(), tmp = {};
    const W = n => { if (!tmp[n]) tmp[n] = d.b[n].getWorldQuaternion(Q()); return tmp[n]; };
    // root position: put the pelvis where the driver's hips are
    const target = d.b.hips.getWorldPosition(V());
    this.top.updateWorldMatrix(true, false); this.pelvis.updateWorldMatrix(false, false);
    const cur = this.pelvis.getWorldPosition(V()), tw = this.top.getWorldPosition(V()).add(target.sub(cur));
    this.top.position.copy(this.top.parent.worldToLocal(tw)); this.top.updateWorldMatrix(false, false);
    let s1 = null;
    for (const e of this.list) {
      let w;
      if (e.mid) { const a = W(e.mid[0]).clone().multiply(this.list.find(x => x.dn === e.mid[0]).cal), b = W(e.mid[1]).clone().multiply(this.list.find(x => x.dn === e.mid[1]).cal); w = a.slerp(b, 0.5); }
      else w = q.copy(W(e.dn)).multiply(e.cal);
      e.mb.parent.getWorldQuaternion(pq);
      e.mb.quaternion.copy(pq.invert().multiply(w));
      e.mb.updateWorldMatrix(false, false);
    }
    // eyes
    for (const e of this.eyes) {
      e.mb.parent.getWorldQuaternion(pq);
      const g = Q().setFromEuler(new THREE.Euler(-this.gy * Math.PI / 180, this.gx * Math.PI / 180, 0, 'YXZ'));
      // world = driverHead * gaze * (eye bind relative to head bind)
      const w = W('head').clone().multiply(g).multiply(e.cal);
      e.mb.quaternion.copy(pq.invert().multiply(w));
    }
    this.root.updateMatrixWorld(true);
  }

  breathe(cb, bb) { // cb/bb: chest and belly breathing amount * phase
    const [s0, s1, s2, nk] = this.sp, a = 1 + 0.03 * bb, c = 1 + 0.022 * cb;
    s0.scale.setScalar(a); s1.scale.setScalar(1 / a); s2.scale.setScalar(c); nk.scale.setScalar(1 / c);
  }
  face(F) {
    const w = {}, c01 = x => Math.min(1, Math.max(0, x));
    const set = (k, v) => { w[k] = c01((w[k] || 0) + v); };
    this.gx = F.gx || 0; this.gy = F.gy || 0; this.time = this.time || 0;
    for (const [s, side] of [['Left', 'L'], ['Right', 'R']]) {
      const up = F.bu + F['bu' + side];
      set('BrowOuterUp' + s, up * 0.9); set('BrowInnerUp', (F.bu * 0.5 + F.bi) / 2 + F.bi * 0.4);
      set('BrowDown' + s, F.bd);
      const lid = Math.min(1, F.lid + F['lid' + side] + F._blink + F.flut * 0.75 * Math.abs(Math.sin(this.time * 19)));
      if (lid >= 0) set('EyeBlink' + s, lid); else set('EyeWide' + s, -lid * 1.8);
      set('EyeSquint' + s, F.low * 1.0 + 0.2 * F.ch); set('CheekSquint' + s, F.ch * 0.6);
      const sm = F.sm + F['sm' + side] - F.fr;
      if (sm >= 0) set('MouthSmile' + s, sm * 0.85); else set('MouthFrown' + s, -sm);
      set('MouthFrown' + s, F.fr * 0.2);
      set('MouthPress' + s, F.pr * 1.0 + F.jc * 0.3); set('MouthStretch' + s, F.wi * 0.7);
      set('MouthUpperUp' + s, F.up * 0.8); set('NoseSneer' + s, F.nw * 0.9 + F.up * 0.25);
      set('MouthDimple' + s, Math.max(0, sm) * 0.2);
    }
    set('CheekRaiser', F.ch * 0.35 + Math.max(0, F.sm) * 0.15);
    set('JawOpen', F.op * 0.9);
    set('MouthRollLower', F.li * 0.9 + F.pr * 0.35); set('MouthRollUpper', F.li * 0.9 + F.pr * 0.35);
    set('LipSuck', F.li * 0.3);
    set('NoseWrinkler', F.nw * 0.5); set('NosetrilInflated', F.nf);
    set('JawForward', F.jc * 0.15);
    for (const p of this.pupils || []) {
      p.grp.visible = Math.abs(F.pup) > 0.03;
      const k = Math.max(0.35, 1 + 1.1 * F.pup); p.pu.scale.setScalar(k); p.ir.visible = F.pup < 0;
    }
    for (const m of this.meshes) { const inf = m.morphTargetInfluences; inf.fill(0); for (const [k, v] of Object.entries(w)) { const i = this.morph[k]; if (i != null) inf[i] = v; } }
    // jaw clench: bulge the masseters a little
    const jc = F.jc * (0.85 + 0.15 * Math.sin(this.time * 7));
    for (const b of this.masseter) b.scale.setScalar(1 + 0.25 * jc);
    if (this.headMat) { this.headMat.color.setRGB(1, 1 - 0.28 * F.fl, 1 - 0.3 * F.fl); }
  }
}
