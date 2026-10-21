/* WonderLab live challenge animations. Built from WonderLab/motion by build.py: the master engine.js, the scene
 * files below, and the pencil tree house on its own engine (window.WLS). Edit the sources there, then rebuild. */
/* ---- engine.js ---- */
/* WonderLab scene engine
 * Tiny deterministic 3D/2D line-and-face renderer for SVG.
 * Every scene is a pure function of loop progress t in [0, 1]; f(0) === f(1),
 * so HyperFrames can seek any frame and the rendered clips loop seamlessly.
 */
window.WL = (function () {
  "use strict";

/* Infinite Facade tile traced from reference IMG_4573 (one 291px tile; the pattern uses its four rotations) */
  var FACADE_INK = "data:image/png;base64,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";
  var FACADE_SKY = "data:image/png;base64,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";


  var TAU = Math.PI * 2, RAD = Math.PI / 180;
  function clamp(v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }
  function eo(x) { return 1 - Math.pow(1 - x, 3); }
  function eio(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function back(x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function lerp(a, b, x) { return a + (b - a) * x; }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  // appear progress for item i of a staggered sequence
  function ap(t, i, start, step, dur) { return eo(seg(t, start + i * step, start + i * step + (dur || 0.12))); }
  function frac(x) { return x - Math.floor(x); }

  var THEMES = {
    light: {
      bg: "#EEF1F0", grid: "rgba(13,27,38,0.07)", line: "#0D1B26", soft: "rgba(13,27,38,0.45)",
      shadow: "rgba(13,27,38,0.10)", tone: "#8196A6",
      mats: { paper: "#FFFFFF", foil: "#DCE3E8", zing: "#DCE85E", sky: "#A8D8F0", brand: "#2E6DB0", water: "#A8D8F0", ink: "#1B2A36", wood: "#EBDDC3" }
    },
    dark: {
      // thin white line work on navy: fills are navy shades, one near-white accent, no yellow
      bg: "#0D1B26", grid: "rgba(237,243,246,0.07)", line: "#EDF3F6", soft: "rgba(237,243,246,0.5)",
      shadow: "rgba(0,0,0,0.35)", tone: "#06121B",
      mats: { paper: "#14293A", foil: "#1A3346", zing: "#E8F0F4", sky: "#1F3D55", brand: "#9FB6C4", water: "#1B3A52", ink: "#0A1620", wood: "#1E3C51" }
    },
    // transparent background, for clips laid over any paper on the site: everything is drawn in greys, then the frost
    // filter (render) turns grey into white whose opacity follows its brightness. Lines stay solid white, faces become
    // 8-16% frosted paper that takes the colour of whatever is behind, hidden lines stay hidden, orange stays orange.
    // Pure black (shadow, ink) comes out clear.
    glass: {
      bg: "transparent", grid: "rgba(255,255,255,0.10)", line: "#FFFFFF", soft: "rgba(255,255,255,0.5)",
      shadow: "rgba(0,0,0,0.25)", tone: "#000000", frost: true,
      mats: { paper: "#333333", foil: "#3D3D3D", zing: "#F0F0F0", sky: "#2E2E2E", brand: "#B8B8B8", water: "#2B2B2B", ink: "#111111", wood: "#3A3A3A" }
    },
    // Explorers: turquoise
    teal: {
      bg: "#083A42", grid: "rgba(237,243,246,0.08)", line: "#EDF3F6", soft: "rgba(237,243,246,0.5)",
      shadow: "rgba(0,0,0,0.32)", tone: "#02222A",
      mats: { paper: "#0F4B55", foil: "#155B67", zing: "#E8F0F4", sky: "#12525E", brand: "#9AC7C9", water: "#0F4F5C", ink: "#04262C", wood: "#155A66" }
    },
    // Creators: dark blue
    blue: {
      bg: "#0E2A4F", grid: "rgba(237,243,246,0.08)", line: "#EDF3F6", soft: "rgba(237,243,246,0.5)",
      shadow: "rgba(0,0,0,0.32)", tone: "#06182F",
      mats: { paper: "#173861", foil: "#1D456F", zing: "#E8F0F4", sky: "#1A4070", brand: "#A3B6D0", water: "#173C68", ink: "#0A1E3A", wood: "#1C4470" }
    }
  };

  function hex2rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mix(a, b, k) {
    var A = hex2rgb(a), B = hex2rgb(b);
    return "rgb(" + Math.round(lerp(A[0], B[0], k)) + "," + Math.round(lerp(A[1], B[1], k)) + "," + Math.round(lerp(A[2], B[2], k)) + ")";
  }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function f1(n) { return Math.round(n * 10) / 10; }

  // rotations about an axis through a pivot
  function rotZ(p, c, a) { var s = Math.sin(a), k = Math.cos(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * k - y * s, c[1] + x * s + y * k, p[2]]; }
  function rotY(p, c, a) { var s = Math.sin(a), k = Math.cos(a), x = p[0] - c[0], z = p[2] - c[2]; return [c[0] + x * k + z * s, p[1], c[2] - x * s + z * k]; }
  function rotX(p, c, a) { var s = Math.sin(a), k = Math.cos(a), y = p[1] - c[1], z = p[2] - c[2]; return [p[0], c[1] + y * k - z * s, c[2] + y * s + z * k]; }

  function Ctx(cam, T) {
    var yaw = cam.yaw * RAD, pit = cam.pitch * RAD;
    var c = Math.cos(yaw), s = Math.sin(yaw), ce = Math.cos(pit), se = Math.sin(pit);
    var S = cam.S, cx = cam.cx, cy = cam.cy;
    var V = [-ce * s, -ce * c, se];
    var Lw = norm([-0.45, -0.6, 0.9]);
    var items = [], overlay = [];
    var EDGE = cam.edge || 1.6;

    function P(p) {
      var xr = p[0] * c - p[1] * s, yr = p[0] * s + p[1] * c;
      return [cx + S * xr, cy - S * (p[2] * ce + yr * se), yr * ce - p[2] * se];
    }
    function col(m) { return (m && T.mats[m]) || m || T.line; }
    function pts2(pp) { return pp.map(function (q) { return f1(q[0]) + "," + f1(q[1]); }).join(" "); }

    var api = {
      T: T, S: S, P: P, V: V,
      poly: function (pts, mat, o) {
        o = o || {};
        if ((o.op !== undefined && o.op <= 0.01) || pts.length < 3) return;
        var n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
        if (o.cull && dot(n, V) <= 0) return;
        var k = o.flat ? 1 : 0.58 + 0.42 * Math.abs(dot(n, Lw));
        var base = col(mat);
        var fill = o.flat || base.indexOf("rgb") === 0 || base.indexOf("#") !== 0 ? base : mix(T.tone, base, k);
        var pp = pts.map(P), d = 0;
        pp.forEach(function (q) { d += q[2]; });
        d = d / pp.length + (o.bias || 0);
        // o.holes: inner rings cut out of the face (even-odd fill)
        var shape = o.holes ? '<path fill-rule="evenodd" d="M' + pts2(pp) + "Z" + o.holes.map(function (h) { return "M" + pts2(h.map(P)) + "Z"; }).join("") + '"' : '<polygon points="' + pts2(pp) + '"';
        items.push({ d: d, s: shape + ' fill="' + fill + '"' +
          (o.fillOp !== undefined ? ' fill-opacity="' + o.fillOp + '"' : "") +
          (o.stroke === false ? "" : ' stroke="' + (o.strokeColor ? col(o.strokeColor) : T.line) + '" stroke-width="' + (o.w || EDGE) + '" stroke-linejoin="round"') +
          (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      line: function (a, b, o) { api.path([a, b], o); },
      path: function (pts, o) {
        o = o || {};
        if (o.op !== undefined && o.op <= 0.01) return;
        var pp = pts.map(P), d = 0;
        pp.forEach(function (q) { d += q[2]; });
        d = d / pp.length + (o.bias || 0);
        var tag = o.closed ? "polygon" : "polyline";
        items.push({ d: d, s: "<" + tag + ' points="' + pts2(pp) + '" fill="' + (o.fill ? col(o.fill) : "none") + '" stroke="' + col(o.color) +
          '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' +
          (o.dash ? ' stroke-dasharray="' + o.dash + '"' + (o.dashOff ? ' stroke-dashoffset="' + f1(o.dashOff) + '"' : "") : "") +
          (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      tube: function (a, b, o) { // rolled paper / straw: dark outline under a light core
        o = o || {};
        api.path([a, b], { color: T.line, w: (o.w || 7) + 3, op: o.op, bias: o.bias });
        api.path([a, b], { color: o.mat || "paper", w: o.w || 7, op: o.op, bias: (o.bias || 0) - 0.001 });
      },
      dot: function (p, r, mat, o) {
        o = o || {};
        if (o.op !== undefined && o.op <= 0.01) return;
        var q = P(p);
        items.push({ d: q[2] + (o.bias || 0), s: '<ellipse cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" rx="' + f1(r * (o.sx || 1)) + '" ry="' + f1(r * (o.sy || 1)) + '" fill="' + col(mat) + '"' +
          (o.stroke === false ? "" : ' stroke="' + T.line + '" stroke-width="' + (o.w || EDGE) + '"') +
          (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      box8: function (C, mat, o) {
        o = o || {};
        var F = [[4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [3, 0, 4, 7], [1, 2, 6, 5], [0, 3, 2, 1]];
        var mats = o.mats || {};
        F.forEach(function (f, i) {
          api.poly(f.map(function (j) { return C[j]; }), i === 0 && o.top ? o.top : (mats[i] || mat), { cull: true, op: o.op, bias: o.bias, w: o.w });
        });
      },
      box: function (x, y, z, w, d, h, mat, o) {
        o = o || {};
        var C = [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z], [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
        if (o.tf) C = C.map(o.tf);
        api.box8(C, mat, o);
      },
      plank: function (a, b, t, y0, y1, mat, o) { // flat board in the x-z plane from a to b (2D points)
        var dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L * t / 2, nz = dx / L * t / 2;
        var q = [[a[0] - nx, a[1] - nz], [b[0] - nx, b[1] - nz], [b[0] + nx, b[1] + nz], [a[0] + nx, a[1] + nz]];
        var C = [[q[0][0], y0, q[0][1]], [q[1][0], y0, q[1][1]], [q[1][0], y1, q[1][1]], [q[0][0], y1, q[0][1]],
                 [q[3][0], y0, q[3][1]], [q[2][0], y0, q[2][1]], [q[2][0], y1, q[2][1]], [q[3][0], y1, q[3][1]]];
        if (o && o.tf) C = C.map(o.tf);
        // winding differs from box(); draw faces without culling but depth sorted
        var F = [[0, 1, 5, 4], [3, 2, 6, 7], [0, 1, 2, 3], [4, 5, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]];
        F.forEach(function (f) { api.poly(f.map(function (j) { return C[j]; }), mat, { op: o && o.op, bias: o && o.bias }); });
      },
      cyl: function (x, y, z, r, h, mat, o) {
        o = o || {};
        var n = o.seg || 16, top = [], i;
        for (i = 0; i < n; i++) {
          var a0 = i / n * TAU, a1 = (i + 1) / n * TAU;
          var p0 = [x + r * Math.cos(a0), y + r * Math.sin(a0)], p1 = [x + r * Math.cos(a1), y + r * Math.sin(a1)];
          api.poly([[p0[0], p0[1], z], [p1[0], p1[1], z], [p1[0], p1[1], z + h], [p0[0], p0[1], z + h]], mat, { cull: true, op: o.op, stroke: false, bias: o.bias });
          top.push([p0[0], p0[1], z + h]);
        }
        api.poly(top, o.top || mat, { cull: true, op: o.op, bias: o.bias, w: o.w });
        // silhouette
        var bot = [], i2;
        for (i2 = 0; i2 <= n; i2++) { var a = i2 / n * TAU; bot.push([x + r * Math.cos(a), y + r * Math.sin(a), z]); }
        api.path(bot, { color: T.line, w: o.w || EDGE, op: o.op, bias: (o.bias || 0) + 0.3 });
      },
      grid: function (ext, step, z) {
        z = z || 0;
        for (var g = -ext; g <= ext + 1e-6; g += step) {
          api.path([[g, -ext, z], [g, ext, z]], { color: T.grid, w: 1, bias: 100 });
          api.path([[-ext, g, z], [ext, g, z]], { color: T.grid, w: 1, bias: 100 });
        }
      },
      shadow: function (pts, op) { api.poly(pts, T.shadow, { flat: true, stroke: false, bias: 60, op: op }); },
      image: function (p0, p1, p2, href, o) { // map a unit image onto the parallelogram p0 -> p1 (u), p0 -> p2 (v)
        o = o || {};
        var a = P(p0), b = P(p1), c = P(p2);
        items.push({ d: (a[2] + b[2] + c[2]) / 3 + (o.bias || 0), s: '<image href="' + href + '" x="0" y="0" width="1" height="1" preserveAspectRatio="none" transform="matrix(' +
          [b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1], a[0], a[1]].map(function (n) { return n.toFixed(2); }).join(" ") + ')"' + (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      screen: function (svg) { overlay.push(svg); },
      out: function () {
        items.sort(function (a, b) { return b.d - a.d; });
        return items.map(function (i) { return i.s; }).join("") + overlay.join("");
      }
    };
    return api;
  }

  function hull(points) { // 2D convex hull (monotone chain)
    var p = points.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [], i;
    for (i = 0; i < p.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
    for (i = p.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
    up.pop(); lo.pop();
    return lo.concat(up);
  }

  function boxShadow(g, x, y, w, d, h, dir, op) {
    var base = [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
    var all = base.concat(base.map(function (q) { return [q[0] + dir[0] * h, q[1] + dir[1] * h]; }));
    g.shadow(hull(all).map(function (q) { return [q[0], q[1], 0.001]; }), op);
  }

  // gable roof on a box
  function gable(g, x, y, z, w, d, rh, mat, o) {
    o = o || {};
    var r0 = [x - 0.08, y - 0.08, z], r1 = [x + w + 0.08, y - 0.08, z], r2 = [x + w + 0.08, y + d + 0.08, z], r3 = [x - 0.08, y + d + 0.08, z];
    var k0 = [x - 0.08, y + d / 2, z + rh], k1 = [x + w + 0.08, y + d / 2, z + rh];
    var tf = o.tf || function (p) { return p; };
    g.poly([r0, r1, k1, k0].map(tf), mat, { op: o.op });
    g.poly([r2, r3, k0, k1].map(tf), mat, { op: o.op });
    g.poly([[x, y, z], [x, y + d, z], [x, y + d / 2, z + rh]].map(tf), "paper", { op: o.op });
    g.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d / 2, z + rh]].map(tf), "paper", { op: o.op });
  }

  function circlePts(cx, cy, z, r, n, a0, a1) {
    var out = [];
    a0 = a0 || 0; a1 = a1 === undefined ? TAU : a1;
    for (var i = 0; i <= n; i++) { var a = lerp(a0, a1, i / n); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); }
    return out;
  }

  /* ------------------------------------------------------------------ scenes */
  var SC = {};

  // ---------- Explorers
  SC.solarcity = { cam: { yaw: 32, pitch: 32, S: 58, amp: 8 }, draw: function (g, t) {
    g.grid(5, 1);
    var B = [[-3.4, -1.6, 1.4, 1.4, 1.6, "paper", 1], [-1.6, -2.2, 1.2, 1.2, 2.6, "sky", 0], [-0.1, -1.4, 1.6, 1.2, 1.2, "paper", 1],
             [-2.2, 0.6, 1.4, 1.6, 2.0, "paper", 1], [0.1, 0.8, 1.2, 1.4, 3.0, "sky", 0], [1.8, -0.8, 1.4, 1.8, 1.8, "paper", 1]];
    var sa = lerp(-55, 55, eio(seg(t, 0.28, 0.9))) * RAD;
    var dir = [-Math.sin(sa) * 0.55, 0.45];
    B.forEach(function (b, i) {
      var a = ap(t, i, 0.04, 0.035, 0.14), h = b[4] * a;
      if (a <= 0) return;
      if (t > 0.24) boxShadow(g, b[0], b[1], b[2], b[3], h, dir, seg(t, 0.24, 0.34));
      g.box(b[0], b[1], 0, b[2], b[3], h, b[5]);
      if (b[6]) g.box(b[0] + 0.1, b[1] + 0.1, h, b[2] - 0.2, b[3] - 0.2, 0.12 * ap(t, i, 0.2, 0.03, 0.1), "zing", { op: ap(t, i, 0.2, 0.03, 0.1) });
    });
    var so = seg(t, 0.24, 0.32);
    var sun = [Math.sin(sa) * 4, -3.2, 5.2];
    g.dot(sun, 22, "zing", { op: so, bias: -50 });
    [[-2.7, -0.9, 1.6], [0.7, -0.8, 1.2], [2.5, 0.1, 1.8]].forEach(function (p, i) {
      g.line(sun, p, { color: "brand", w: 1.6, dash: "5 7", dashOff: -t * 120 * 3, op: so * 0.8, bias: -40 });
    });
    for (var k = 0; k < 3; k++) {
      var pts = [];
      for (var x = -4.6; x <= 4.6; x += 0.4) pts.push([x, -3 + k * 0.5, 0.25 + 0.12 * Math.sin(x * 1.4 + k)]);
      g.path(pts, { color: "brand", w: 1.6, dash: "10 12", dashOff: -t * 22 * 12, op: seg(t, 0.35, 0.45) * 0.7, bias: 40 });
    }
  } };

  SC.stilts = { cam: { yaw: 28, pitch: 26, S: 62, amp: 7 }, draw: function (g, t) {
    // tide basin
    var bw = 3.8, bd = 2.6;
    g.box(-bw, -bd, 0, bw * 2, bd * 2, 0.08, "foil", { op: ap(t, 0, 0.03, 0, 0.1) });
    var lvl = lerp(0.15, 1.05, eio(seg(t, 0.3, 0.62))) - 0.6 * eio(seg(t, 0.72, 0.9));
    var wave = function (x, y) { return lvl + 0.07 * Math.sin(x * 2.2 + t * TAU * 3) + 0.04 * Math.cos(y * 3 - t * TAU * 3); };
    // stilts + house
    var a1 = ap(t, 0, 0.08, 0, 0.14), a2 = ap(t, 0, 0.16, 0, 0.14), a3 = ap(t, 0, 0.22, 0, 0.12);
    var sway = 0.05 * Math.sin(t * TAU * 4) * seg(t, 0.4, 0.5) * (1 - seg(t, 0.8, 0.9));
    var tf = function (p) { return [p[0] + sway * p[2] / 2.4, p[1], p[2]]; };
    [[-1.2, -0.8], [1.2, -0.8], [-1.2, 0.8], [1.2, 0.8], [0, -0.8], [0, 0.8]].forEach(function (s, i) {
      var top = 1.6 * a1;
      g.box(s[0] - 0.08, s[1] - 0.08, 0, 0.16, 0.16, top, "wood", { tf: tf });
    });
    if (a2 > 0) {
      g.box(-1.5, -1.1, 1.6 + (1 - a2) * 1.2, 3, 2.2, 1.3, "paper", { op: a2, tf: tf });
      gable(g, -1.5, -1.1, 2.9 + (1 - a3) * 1.2, 3, 2.2, 1.0, "zing", { op: a3, tf: tf });
    }
    // water surface
    var N = 10, wo = seg(t, 0.12, 0.2);
    for (var i = 0; i < N; i++) {
      var x0 = -bw + i * (2 * bw / N), x1 = x0 + 2 * bw / N;
      g.poly([[x0, -bd, wave(x0, -bd)], [x1, -bd, wave(x1, -bd)], [x1, bd, wave(x1, bd)], [x0, bd, wave(x0, bd)]], "water", { flat: true, stroke: false, fillOp: 0.55, op: wo, bias: -0.5 });
    }
    var edge = [];
    for (var x = -bw; x <= bw + 0.01; x += 0.25) edge.push([x, -bd, wave(x, -bd)]);
    g.path(edge, { color: "brand", w: 2, op: wo, bias: -8 });
    // storm wind
    for (var k = 0; k < 3; k++) {
      var off = frac(t * 2 + k / 3);
      g.line([-5.5 + off * 3, -0.5 + k * 0.6, 3.2 + k * 0.3], [-4.5 + off * 3, -0.5 + k * 0.6, 3.2 + k * 0.3], { color: "brand", w: 2.4, op: seg(t, 0.4, 0.5) * (1 - seg(t, 0.8, 0.88)) * Math.sin(off * Math.PI), bias: -20 });
    }
  } };

  SC.dome = { cam: { yaw: 20, pitch: 24, S: 70, spin: 72 }, draw: function (g, t) {
    g.grid(4, 1);
    var R = 2.5, rings = [[0, 10, 0], [30, 10, 18], [58, 5, 0], [90, 1, 0]];
    var P = rings.map(function (r) {
      var out = [], el = r[0] * RAD;
      for (var j = 0; j < r[1]; j++) { var az = (j / r[1] * 360 + r[2]) * RAD; out.push([R * Math.cos(el) * Math.cos(az), R * Math.cos(el) * Math.sin(az), R * Math.sin(el)]); }
      return out;
    });
    function near(p, arr, k) { return arr.map(function (q, i) { return [Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]), i]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, k).map(function (x) { return arr[x[1]]; }); }
    var edges = [];
    P.forEach(function (ring, ri) {
      if (ring.length > 1) ring.forEach(function (p, j) { edges.push([ri, p, ring[(j + 1) % ring.length]]); });
      if (ri < P.length - 1) ring.forEach(function (p) { near(p, P[ri + 1], P[ri + 1].length > 1 ? 2 : 1).forEach(function (q) { edges.push([ri + 0.5, p, q]); }); });
    });
    // translucent panels on the lowest band
    P[0].forEach(function (p, j) {
      var q = P[0][(j + 1) % 10], u = near([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 1], P[1], 1)[0];
      var a = ap(t, j, 0.5, 0.025, 0.1);
      if (a > 0) g.poly([p, q, u], j % 2 ? "sky" : "paper", { op: a * 0.85, stroke: false });
    });
    edges.forEach(function (e, i) {
      var a = ap(t, e[0], 0.05, 0.1, 0.14);
      if (a <= 0) return;
      var b = [lerp(e[1][0], e[2][0], a), lerp(e[1][1], e[2][1], a), lerp(e[1][2], e[2][2], a)];
      g.line(e[1], b, { w: 2.6, bias: -0.2 });
    });
    P.forEach(function (ring, ri) { ring.forEach(function (p) { var a = ap(t, ri, 0.08, 0.1, 0.1); g.dot(p, 6, "zing", { op: a, bias: -0.4 }); }); });
  } };

  SC.rain = { cam: { yaw: 34, pitch: 24, S: 64, amp: 6, z: 1.2 }, draw: function (g, t) {
    g.grid(4, 1);
    var a0 = ap(t, 0, 0.04, 0, 0.14), a1 = ap(t, 0, 0.12, 0, 0.12), a2 = ap(t, 0, 0.2, 0, 0.12);
    g.box(-1.6, -1, 0, 3.2, 2, 1.6 * a0, "paper");
    if (a1 > 0) gable(g, -1.6, -1, 1.6 + (1 - a1), 3.2, 2, 1.0, "paper", { op: a1 });
    g.box(-1.8, -1.25, 1.45, 3.6 * a2, 0.22, 0.14, "zing", { op: a2 });
    g.box(1.72, -1.2, 0.5, 0.12, 0.12, 1.0 * a2, "zing", { op: a2 });
    var cupA = ap(t, 0, 0.26, 0, 0.1);
    var lvl = 0.5 * eio(seg(t, 0.36, 0.86));
    if (cupA > 0) {
      g.cyl(1.78, -1.14, 0, 0.42, 0.55, "sky", { op: cupA * 0.55 });
      if (lvl > 0.02) g.cyl(1.78, -1.14, 0, 0.36, lvl, "water", { op: cupA * 0.9 });
    }
    var ro = seg(t, 0.3, 0.38) * (1 - seg(t, 0.82, 0.9));
    for (var i = 0; i < 22; i++) {
      var x = -2.2 + hash(i) * 4.4, y = -1.6 + hash(i + 40) * 3.2, ph = frac(t * 3 + hash(i + 90));
      var z = 5.2 - ph * 3.4;
      g.line([x, y, z], [x, y, z + 0.35], { color: "brand", w: 2, op: ro * Math.min(1, (1 - ph) * 4), bias: -30 });
    }
    // water running down the pipe
    g.line([1.78, -1.14, 1.45], [1.78, -1.14, 0.55], { color: "water", w: 3, dash: "6 8", dashOff: t * 14 * 20, op: ro, bias: -6 });
  } };

  SC.corridor = { cam: { yaw: 24, pitch: 22, S: 54, amp: 6, z: 1.15 }, draw: function (g, t) {
    g.grid(5, 1);
    var a0 = ap(t, 0, 0.04, 0, 0.14), a1 = ap(t, 0, 0.1, 0, 0.14), a2 = ap(t, 0, 0.2, 0, 0.16);
    g.box(-4, -1.2, 0, 2, 2.4, 3.2 * a0, "paper");
    g.box(2, -1.2, 0, 2, 2.4, 4.2 * a1, "paper");
    g.box(-2, -0.6, 2.1, 4 * a2, 1.2, 0.3, "zing", { op: a2 });
    var trees = [[-1.5, 0], [-0.5, 0.2], [0.5, -0.1], [1.5, 0.15]];
    trees.forEach(function (p, i) { var a = back(seg(t, 0.32 + i * 0.04, 0.42 + i * 0.04)); if (a > 0) { g.line([p[0], p[1], 2.4], [p[0], p[1], 2.4 + 0.5 * a], { w: 2 }); g.dot([p[0], p[1], 2.4 + 0.75 * a], 16 * a, i % 2 ? "zing" : "sky"); } });
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) {
      var a = ap(t, r * 3 + c, 0.38, 0.018, 0.08);
      g.dot([2, -0.8 + c * 0.8, 0.6 + r * 0.9], 7 * a, "zing", { op: a, bias: -2 });
      g.dot([-2, -0.8 + c * 0.8, 0.5 + r * 0.7], 6 * a, "sky", { op: a, bias: -2 });
    }
    var ba = ap(t, 0, 0.3, 0, 0.1);
    if (ba > 0) { g.box(-3.3, -1.25, 3.2, 0.5, 0.4, 0.5, "paper", { op: ba }); gable(g, -3.3, -1.25, 3.7, 0.5, 0.4, 0.3, "zing", { op: ba }); }
    for (var b = 0; b < 3; b++) {
      var ph = frac(t * 1 + b / 3), x = lerp(-5, 5, ph), z = 4.6 + b * 0.4 + 0.2 * Math.sin(ph * TAU), fl = 0.18 * Math.sin(t * TAU * 10 + b);
      var bo = seg(t, 0.3, 0.4) * (1 - seg(t, 0.84, 0.9)) * Math.sin(ph * Math.PI);
      g.path([[x - 0.3, 0.5, z + fl], [x, 0.5, z], [x + 0.3, 0.5, z + fl]], { w: 2.2, op: bo, bias: -30 });
    }
  } };

  SC.city = { cam: { yaw: 30, pitch: 48, S: 50, amp: 5 }, draw: function (g, t) {
    g.box(-5, -4, -0.12, 10, 8, 0.12, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var river = [];
    for (var x = -5; x <= 5.01; x += 0.5) river.push([x, -3.1 + 0.25 * Math.sin(x * 0.9), 0.01]);
    var riverB = river.slice().reverse().map(function (p) { return [p[0], p[1] + 1.0, 0.01]; });
    g.poly(river.concat(riverB), "water", { flat: true, stroke: false, op: ap(t, 0, 0.06, 0, 0.1), bias: -0.2 });
    var types = ["home", "shop", "park", "home", "park", "shop", "home", "home", "shop"];
    var i = 0;
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++, i++) {
      var bx = -4.2 + c * 3, by = -1.2 + r * 1.8, a = ap(t, i, 0.1, 0.035, 0.12), ty = types[i];
      if (a <= 0) continue;
      if (ty === "park") {
        g.box(bx, by, 0, 2.4, 1.4, 0.06, "zing", { op: a });
        for (var k = 0; k < 3; k++) { var ta = back(seg(t, 0.45 + k * 0.03 + i * 0.01, 0.55 + k * 0.03 + i * 0.01)); if (ta > 0) g.dot([bx + 0.5 + k * 0.7, by + 0.7, 0.35 * ta], 10 * ta, "paper"); }
      } else if (ty === "shop") {
        g.box(bx + 0.1, by + 0.1, 0, 2.2, 1.2, 0.9 * a, "sky");
      } else {
        g.box(bx + 0.1, by + 0.1, 0, 1, 1.2, 0.7 * a, "paper");
        g.box(bx + 1.3, by + 0.1, 0, 1, 1.2, 1.1 * a, "paper");
      }
    }
    var ba = ap(t, 0, 0.36, 0, 0.12);
    g.box(-0.5, -3.3, 0.02, 1.0 * ba, 1.4, 0.12, "paper", { op: ba });
    for (var cI = 0; cI < 3; cI++) {
      var ph = frac(t * 2 + cI / 3);
      g.dot([lerp(-4.8, 4.8, ph), -1.45 + (cI % 2) * 1.8 + 0.9, 0.1], 5, cI === 1 ? "zing" : "brand", { op: seg(t, 0.4, 0.5) * (1 - seg(t, 0.84, 0.9)), stroke: false, bias: -1 });
    }
  } };

  SC.boat = { cam: { yaw: 28, pitch: 28, S: 70, amp: 6 }, draw: function (g, t) {
    var coins = Math.floor(seg(t, 0.3, 0.76) * 9 + 0.0001);
    var sink = 0.04 * coins + 0.5 * eio(seg(t, 0.78, 0.9));
    var bob = 0.05 * Math.sin(t * TAU * 3);
    var za = 0.22 - sink + bob, ha = ap(t, 0, 0.08, 0, 0.16);
    var tilt = 0.04 * Math.sin(t * TAU * 2);
    var tf = function (p) { var q = rotX(p, [0, 0, za], tilt); return [q[0], q[1], q[2] + za]; };
    if (ha > 0) {
      var b = [[-1.2, -0.65, 0], [1.2, -0.65, 0], [1.2, 0.65, 0], [-1.2, 0.65, 0]];
      var tp = [[-1.6, -0.95, 0.5 * ha], [1.6, -0.95, 0.5 * ha], [1.6, 0.95, 0.5 * ha], [-1.6, 0.95, 0.5 * ha]];
      g.poly(b.map(tf), "foil", { op: ha });
      for (var i = 0; i < 4; i++) g.poly([b[i], b[(i + 1) % 4], tp[(i + 1) % 4], tp[i]].map(tf), "foil", { op: ha });
      for (var cI = 0; cI < 9; cI++) {
        var dropT = seg(t, 0.3 + cI * 0.051, 0.36 + cI * 0.051);
        if (dropT <= 0) continue;
        var cx = -0.7 + (cI % 3) * 0.7, cy = -0.3 + Math.floor(cI / 3) * 0.3;
        var cz = 0.06 + (1 - eo(dropT)) * 2.4;
        var p = tf([cx, cy, cz]);
        g.cyl(p[0], p[1], p[2], 0.2, 0.06, "zing", { seg: 12 });
      }
    }
    // water
    var N = 12, W = 4.4;
    for (var k = 0; k < N; k++) {
      var x0 = -W + k * 2 * W / N, x1 = x0 + 2 * W / N;
      var hw = function (x) { return 0.06 * Math.sin(x * 1.8 - t * TAU * 3); };
      g.poly([[x0, -2.6, hw(x0)], [x1, -2.6, hw(x1)], [x1, 2.6, hw(x1)], [x0, 2.6, hw(x0)]], "water", { flat: true, stroke: false, fillOp: 0.5, op: ap(t, 0, 0.02, 0, 0.1), bias: 2 });
    }
    for (var w = 0; w < 3; w++) {
      var pts = [];
      for (var x = -W; x <= W; x += 0.25) pts.push([x, -2 + w * 1.6, 0.02 + 0.06 * Math.sin(x * 1.8 - t * TAU * 3)]);
      g.path(pts, { color: "brand", w: 1.8, op: ap(t, 0, 0.04, 0, 0.1) * 0.8, bias: w === 0 ? -3 : 3 });
    }
  } };

  SC.column = { cam: { yaw: 26, pitch: 22, S: 62, amp: 10 }, draw: function (g, t) {
    g.grid(4, 1);
    var books = Math.floor(seg(t, 0.4, 0.8) * 4 + 0.0001);
    var H = 3.2 * ap(t, 0, 0.06, 0, 0.3) * (1 - 0.018 * books);
    var n = 16, ring = [];
    for (var i = 0; i < n; i++) { var a = i / n * TAU, r = i % 2 ? 0.55 : 0.85; ring.push([r * Math.cos(a), r * Math.sin(a)]); }
    if (H > 0.02) {
      for (var j = 0; j < n; j++) {
        var p = ring[j], q = ring[(j + 1) % n];
        var nrm = [(p[1] + q[1]) / 2, -(p[0] + q[0]) / 2];
        g.poly([[p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], H], [p[0], p[1], H]], "paper", { cull: false, bias: 0 });
      }
      g.poly(ring.map(function (p) { return [p[0], p[1], H]; }), "paper", {});
    }
    var mats = ["paper", "zing", "sky", "paper"];
    for (var b = 0; b < 4; b++) {
      var d = seg(t, 0.4 + b * 0.1, 0.47 + b * 0.1);
      if (d <= 0) continue;
      var z = H + b * 0.34 + (1 - eo(d)) * 3;
      g.box(-1.3 + b * 0.06, -0.9 - b * 0.05, z, 2.6, 1.8, 0.32, mats[b], { tf: function (p) { return rotZ(p, [0, 0, 0], (b - 1.5) * 0.12); } });
    }
  } };

  SC.mobile = { cam: { yaw: 18, pitch: 12, S: 70, amp: 0, z: 1.0 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.05, 0, 0.14), top = [0, 0, 4.4];
    var A1 = 0.5 * Math.sin(t * TAU), A2 = -0.8 * Math.sin(t * TAU + 1.2), A3 = 0.9 * Math.sin(t * TAU * 2 + 0.5);
    g.line([0, 0, 5.2], top, { w: 2, op: a0 });
    var bar1a = rotZ([-2.2, 0, 4.4], top, A1), bar1b = rotZ([1.8, 0, 4.4], top, A1);
    g.line(bar1a, bar1b, { w: 3, op: a0 });
    g.dot(top, 5, "paper", { op: a0 });
    var a1 = ap(t, 0, 0.14, 0, 0.12);
    var p2 = [bar1a[0], bar1a[1], 3.3];
    g.line(bar1a, p2, { w: 1.6, op: a1 });
    var b2a = rotZ([p2[0] - 1.2, p2[1], 3.3], p2, A2), b2b = rotZ([p2[0] + 1.0, p2[1], 3.3], p2, A2);
    g.line(b2a, b2b, { w: 2.6, op: a1 });
    g.dot(p2, 4, "paper", { op: a1 });
    function cup(p, mat, a, spin) {
      var z = p[2] - 1.0;
      g.line(p, [p[0], p[1], z + 0.35], { w: 1.4, op: a });
      g.cyl(p[0], p[1], z - 0.2, 0.28, 0.55, mat, { op: a, seg: 12 });
    }
    cup(b2a, "sky", ap(t, 0, 0.2, 0, 0.1));
    cup(b2b, "paper", ap(t, 0, 0.24, 0, 0.1));
    var a3 = ap(t, 0, 0.28, 0, 0.1), p3 = [bar1b[0], bar1b[1], 3.0];
    g.line(bar1b, p3, { w: 1.4, op: a3 });
    var b3a = rotZ([p3[0] - 0.6, p3[1], 3.0], p3, A3), b3b = rotZ([p3[0] + 0.6, p3[1], 3.0], p3, A3);
    g.line(b3a, b3b, { w: 2.4, op: a3 });
    cup(b3a, "zing", a3); cup(b3b, "sky", a3);
    for (var k = 0; k < 3; k++) {
      var pts = [], off = t * TAU * 2 + k;
      for (var x = -4.4; x <= -2.6; x += 0.15) pts.push([x, 0, 1.2 + k * 0.5 + 0.12 * Math.sin(x * 4 + off)]);
      g.path(pts, { color: "brand", w: 2, op: seg(t, 0.3, 0.4) * (1 - seg(t, 0.85, 0.9)) * 0.8 });
    }
  } };

  SC.rube = { cam: { yaw: 8, pitch: 14, S: 58, amp: 0 }, draw: function (g, t) {
    g.box(-5, -0.8, -0.1, 10, 1.6, 0.1, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var ra = ap(t, 0, 0.05, 0, 0.12);
    g.plank([-4.6, 2.6], [-2.2, 1.2], 0.12, -0.3, 0.3, "wood", { op: ra });
    g.box(-4.8, -0.3, 0, 0.3, 0.6, 2.6 * ra, "paper", { op: ra });
    // ball
    var br = 0.22, bp;
    var r1 = seg(t, 0.14, 0.3), r2 = seg(t, 0.3, 0.38);
    if (t < 0.3) bp = [lerp(-4.4, -2.2, r1 * r1), 0, lerp(2.72, 1.32, r1 * r1) + br * 0.3];
    else bp = [lerp(-2.2, -1.45, r2), 0, lerp(1.32, br, eo(r2)) + (1 - r2) * 0.0];
    g.dot(bp, 14, "zing", { op: seg(t, 0.08, 0.14), bias: -3 });
    // dominoes
    for (var i = 0; i < 6; i++) {
      var x0 = -1.2 + i * 0.55, fall = eio(seg(t, 0.38 + i * 0.035, 0.44 + i * 0.035)) * 1.2;
      var piv = [x0 + 0.16, 0, 0];
      g.box(x0, -0.35, 0, 0.16, 0.7, 1.0 * ap(t, i, 0.1, 0.02, 0.1), i % 2 ? "sky" : "paper", { tf: function (p) { return rotY(p, piv, fall); } });
    }
    // lever + bell
    var hit = seg(t, 0.62, 0.66);
    g.box(2.35, -0.3, 0, 0.2, 0.6, 1.2, "paper", { op: ap(t, 0, 0.16, 0, 0.1) });
    var bellSwing = 0.35 * Math.sin((t - 0.66) * TAU * 5) * seg(t, 0.66, 0.68) * (1 - seg(t, 0.66, 0.86));
    var bt = [3.6, 0, 3.2];
    g.line([3.6, 0, 3.8], bt, { w: 2, op: ap(t, 0, 0.18, 0, 0.1) });
    var bell = [[-0.45, 0, 2.2], [0.45, 0, 2.2], [0.3, 0, 2.7], [0.18, 0, 3.1], [-0.18, 0, 3.1], [-0.3, 0, 2.7]].map(function (p) { return rotY([p[0] + 3.6, p[1], p[2]], bt, bellSwing); });
    g.poly(bell, "zing", { op: ap(t, 0, 0.18, 0, 0.1) });
    g.plank([2.1, 1.0], [3.4, 2.1 + 0.2 * hit], 0.08, -0.2, 0.2, "wood", { op: ap(t, 0, 0.2, 0, 0.1) });
    for (var w = 0; w < 3; w++) {
      var ph = seg(t, 0.66 + w * 0.05, 0.8 + w * 0.05);
      if (ph > 0 && ph < 1) g.screen("");
      var q = g.P([3.6, 0, 2.6]);
      if (ph > 0 && ph < 1) g.screen('<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="' + f1(30 + ph * 90) + '" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="2" opacity="' + (1 - ph).toFixed(3) + '"/>');
    }
  } };

  SC.davinci = { cam: { yaw: 28, pitch: 22, S: 60, amp: 8, z: 1.25 }, draw: function (g, t) {
    g.grid(5, 1);
    var N = 7, R = 3.1, half = 62 * RAD, cz = -1.3;
    var P = [];
    for (var i = 0; i < N; i++) { var an = Math.PI / 2 + half - i * (2 * half / (N - 1)); P.push([R * Math.cos(an), cz + R * Math.sin(an)]); }
    var order = [], i2;
    for (i2 = 0; i2 < N; i2++) order.push(["t", i2]);
    var sticks = [];
    for (i2 = 0; i2 < N - 2; i2++) sticks.push(i2);
    var load = eo(seg(t, 0.66, 0.72)), sag = 0.05 * load * (1 + 0.5 * Math.sin((t - 0.72) * TAU * 5) * seg(t, 0.72, 0.74) * (1 - seg(t, 0.72, 0.86)));
    function Pz(k) { return [P[k][0], P[k][1] - sag * Math.sin(Math.PI * k / (N - 1))]; }
    // longitudinal sticks: each spans two bays, alternating over/under and outer/inner pairs
    sticks.forEach(function (k, n) {
      var a = ap(t, n, 0.08, 0.07, 0.1);
      if (a <= 0) return;
      var A = Pz(k), B = Pz(k + 2), even = k % 2 === 0;
      var ext = 0.25, dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz);
      var A2 = [A[0] - dx / L * ext, A[1] - dz / L * ext + (even ? 0.07 : -0.07)], B2 = [B[0] + dx / L * ext, B[1] + dz / L * ext + (even ? 0.07 : -0.07)];
      var ys = even ? [[-0.75, -0.6], [0.6, 0.75]] : [[-0.4, -0.25], [0.25, 0.4]];
      var drop = (1 - a) * 1.6;
      ys.forEach(function (yy) { g.plank([A2[0], A2[1] + drop], [B2[0], B2[1] + drop], 0.13, yy[0], yy[1], "wood", { op: a }); });
    });
    // transverse cross sticks at every node
    for (var j = 0; j < N; j++) {
      var a2 = ap(t, j, 0.1, 0.06, 0.1);
      if (a2 <= 0) continue;
      var q = Pz(j), lift = (1 - a2) * 1.4, zOff = j % 2 === 0 ? -0.06 : 0.06;
      g.box(q[0] - 0.07, -0.95, q[1] + zOff - 0.07 + lift, 0.14, 1.9, 0.14, j === 3 ? "zing" : "wood", { op: a2 });
    }
    if (load > 0) { var top = Pz(3); g.cyl(top[0], 0, top[1] + 0.1 + (1 - load) * 2.2, 0.28, 0.9, "sky", { top: "brand" }); }
    g.line([P[0][0], -1.4, 0.02], [P[N - 1][0], -1.4, 0.02], { color: "brand", w: 2, op: seg(t, 0.4, 0.5), bias: 30 });
  } };

  // ---------- Creators
  SC.truss = { cam: { yaw: 22, pitch: 22, S: 58, amp: 7 }, draw: function (g, t) {
    g.grid(5, 1);
    var sa = ap(t, 0, 0.03, 0, 0.12);
    g.box(-4.4, -1, 0, 1.2, 2, 1.8 * sa, "paper");
    g.box(3.2, -1, 0, 1.2, 2, 1.8 * sa, "paper");
    var load = eo(seg(t, 0.62, 0.7)), sag = 0.18 * load * (1 + 0.25 * Math.sin((t - 0.7) * TAU * 6) * seg(t, 0.7, 0.72) * (1 - seg(t, 0.7, 0.82)));
    function Z(x, z) { return z - sag * Math.sin(Math.PI * clamp((x + 3.2) / 6.4)); }
    var xs = [-3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2];
    var mem = [];
    [-0.55, 0.55].forEach(function (y) {
      for (var i = 0; i < xs.length - 1; i++) {
        mem.push([[xs[i], y, 1.8], [xs[i + 1], y, 1.8]]);
        var up = i % 2 === 0;
        mem.push([[xs[i], y, up ? 1.8 : 2.8], [xs[i + 1], y, up ? 2.8 : 1.8]]);
        if (i > 0 && i < xs.length - 2 && i % 2 === 1) mem.push([[xs[i], y, 2.8], [xs[i + 2], y, 2.8]]);
      }
    });
    for (var c = 0; c < xs.length; c += 2) mem.push([[xs[c], -0.55, 1.8], [xs[c], 0.55, 1.8]]);
    mem.forEach(function (m, i) {
      var a = ap(t, i, 0.1, 0.012, 0.06);
      if (a <= 0) return;
      var A = [m[0][0], m[0][1], Z(m[0][0], m[0][2])], B0 = [m[1][0], m[1][1], Z(m[1][0], m[1][2])];
      var B = [lerp(A[0], B0[0], a), lerp(A[1], B0[1], a), lerp(A[2], B0[2], a)];
      g.tube(A, B, { w: 4, mat: "sky" });
    });
    xs.forEach(function (x, i) { var a = ap(t, i, 0.14, 0.03, 0.1); [-0.55, 0.55].forEach(function (y) { g.dot([x, y, Z(x, 1.8)], 5, "zing", { op: a, bias: -0.1 }); }); });
    if (load > 0) g.box(-0.45, -0.45, Z(0, 1.8) + 0.02 + (1 - load) * 2.5, 0.9, 0.9, 0.7, "zing");
    g.line([-3.2, -1.3, 0.05], [3.2, -1.3, 0.05], { color: "brand", w: 1.6, op: seg(t, 0.3, 0.4), bias: 20 });
  } };

  SC.tiles = { cam: { yaw: 0, pitch: 90, S: 56, amp: 0 }, draw: function (g, t) {
    var cols = 7, rows = 5, s = 1.1, x0 = -cols * s / 2, y0 = -rows * s / 2;
    var flip = seg(t, 0.55, 0.8);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var i = r * cols + c, a = back(seg(t, 0.05 + i * 0.012, 0.12 + i * 0.012));
      if (a <= 0) continue;
      var ori = (hash(i * 3.1) > 0.5 ? 1 : 0);
      var wave = clamp(flip * 2.2 - (c + r) / (cols + rows) * 1.2);
      var ang = (ori + eio(wave)) * Math.PI / 2;
      var cx = x0 + c * s + s / 2, cy = y0 + r * s + s / 2, h = s / 2 * a;
      var sq = [[-h, -h], [h, -h], [h, h], [-h, h]].map(function (p) { return [cx + p[0], cy + p[1], 0]; });
      g.poly(sq, (c + r) % 5 === 0 ? "zing" : "paper", { flat: true, w: 1.2, strokeColor: "foil", bias: 5 });
      [[-1, -1], [1, 1]].forEach(function (corner) {
        var cc = rotZ([cx + corner[0] * h, cy + corner[1] * h, 0], [cx, cy, 0], ang);
        var start = corner[0] < 0 ? 0 : Math.PI;
        g.path(circlePts(cc[0], cc[1], 0, h, 10, start + ang, start + ang + Math.PI / 2), { w: 5 * a, color: "ink", bias: -1 });
      });
    }
    var cur = Math.min(cols * rows - 1, Math.floor(seg(t, 0.05, 0.47) * cols * rows));
    var sr = Math.floor(cur / cols), sc = cur % cols, so = seg(t, 0.04, 0.08) * (1 - seg(t, 0.47, 0.52));
    var hx = x0 + sc * s, hy = y0 + sr * s;
    g.path([[hx - 0.05, hy - 0.05, 0], [hx + s + 0.05, hy - 0.05, 0], [hx + s + 0.05, hy + s + 0.05, 0], [hx - 0.05, hy + s + 0.05, 0]], { closed: true, color: "brand", w: 4, op: so, bias: -10 });
  } };

  SC.facade = { cam: { yaw: 22, pitch: 10, S: 50, amp: 7, z: 1.25 }, draw: function (g, t) {
    var cols = 4, rows = 3, s = 1.35, x0 = -cols * s / 2, z0 = 0.35, yF = -0.02;
    var a0 = ap(t, 0, 0.03, 0, 0.14);
    var href = g.T === THEMES.dark ? FACADE_SKY : FACADE_INK;
    g.grid(5, 1);
    g.box(x0 - 0.2, 0, 0, cols * s + 0.4, 2.2, (rows * s + 0.7) * a0, "paper", { op: a0 });
    function tile(c, r, a) {
      var k = Math.floor(hash(r * 13 + c * 7 + 3) * 4), ang = k * Math.PI / 2;
      var cx = x0 + c * s + s / 2, cz = z0 + r * s + s / 2;
      function M(u, v) {
        var du = (u - 0.5) * s * a, dv = (v - 0.5) * s * a, cs = Math.cos(ang), sn = Math.sin(ang);
        return [cx + du * cs - dv * sn, yF, cz - (du * sn + dv * cs)];
      }
      g.image(M(0, 0), M(1, 0), M(0, 1), href, { bias: -41 });
    }
    var n = cols * rows, done = Math.floor(seg(t, 0.14, 0.58) * n);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var i = r * cols + c, a = back(seg(t, 0.14 + i / n * 0.44, 0.17 + i / n * 0.44));
      if (a > 0) tile(c, rows - 1 - r, a);
    }
    var so = seg(t, 0.12, 0.16) * (1 - seg(t, 0.58, 0.62));
    if (so > 0 && done < n) {
      var sr = Math.floor(done / cols), sc = done % cols, cx = x0 + sc * s + s / 2, cz = z0 + (rows - 1 - sr) * s + s / 2;
      var hop = 0.5 * Math.abs(Math.sin(seg(t, 0.14, 0.58) * n * Math.PI));
      g.box(cx - s * 0.48, yF - 0.35 - hop, cz - s * 0.48, s * 0.96, 0.3, s * 0.96, "sky", { op: so, bias: -60 });
      g.box(cx - 0.12, yF - 1.05 - hop, cz - 0.12, 0.24, 0.7, 0.24, "zing", { op: so, bias: -61 });
    }
    var sw = seg(t, 0.62, 0.86), lo = Math.sin(sw * Math.PI) * 0.45;
    if (lo > 0.01) {
      var lx = lerp(x0 - 1.2, x0 + cols * s + 0.4, sw);
      g.poly([[lx, yF - 0.05, z0 - 0.1], [lx + 1.0, yF - 0.05, z0 - 0.1], [lx + 1.6, yF - 0.05, z0 + rows * s + 0.1], [lx + 0.6, yF - 0.05, z0 + rows * s + 0.1]], "zing", { flat: true, stroke: false, op: lo, bias: -45 });
    }
  } };

  function windScene(layout, fanColor) {
    return { cam: { yaw: 30, pitch: 26, S: 54, amp: 6 }, draw: function (g, t) {
      g.grid(5, 1);
      layout.forEach(function (b, i) {
        var a = ap(t, i, 0.05, 0.04, 0.14);
        if (a <= 0) return;
        if (b.k === "box") g.box(b.x, b.y, 0, b.w, b.d, b.h * a, b.m);
        else if (b.k === "cyl") g.cyl(b.x, b.y, 0, b.r, b.h * a, b.m);
        else if (b.k === "twist") for (var j = 0; j < 8; j++) { if (j / 8 > a) break; g.box(-b.w / 2, -b.w / 2, j * b.h / 8, b.w, b.w, b.h / 8, b.m, { tf: function (p) { return rotZ([p[0] + b.x, p[1] + b.y, p[2]], [b.x, b.y, 0], j * 0.12); } }); }
      });
      var fa = ap(t, 0, 0.2, 0, 0.1), fc = [-4.4, -0.6, 1.6], phi = -68 * RAD;
      var e1 = [-Math.sin(phi), Math.cos(phi), 0];
      function F(r, a) { return [fc[0] + r * Math.cos(a) * e1[0], fc[1] + r * Math.cos(a) * e1[1], fc[2] + r * Math.sin(a)]; }
      g.line([fc[0], fc[1], 0], [fc[0], fc[1], fc[2] - 1.0], { w: 3, op: fa, bias: 1 });
      g.poly(circlePts(0, 0, 0, 0.5, 12).map(function (p) { return [fc[0] + p[0], fc[1] + p[1], 0.02]; }), "paper", { op: fa, bias: 1 });
      var ring = []; for (var q = 0; q <= 28; q++) ring.push(F(1.05, q / 28 * TAU));
      g.path(ring, { w: 3, op: fa, fill: fanColor, bias: -2 });
      var spin = t * TAU * 5;
      for (var k = 0; k < 3; k++) {
        var b = spin + k * TAU / 3;
        g.poly([F(0.14, b - 0.55), F(0.92, b - 0.28), F(0.96, b + 0.12), F(0.2, b + 0.35)], "paper", { op: fa, flat: true, bias: -2.5 });
      }
      g.dot(F(0, 0), 7, "ink", { op: fa, bias: -3 });
      var wo = seg(t, 0.3, 0.4) * (1 - seg(t, 0.84, 0.9));
      for (var sI = 0; sI < 7; sI++) {
        var y = -2.4 + sI * 0.8, z = 0.6 + (sI % 3) * 0.7, pts = [];
        for (var x = -3.6; x <= 4.8; x += 0.2) {
          var push = 0;
          layout.forEach(function (b) { var bx = b.x + (b.w || 0) / 2, by = b.y + (b.d || b.w || 0) / 2; var dd = Math.hypot(x - bx, y - by); push += 0.9 * Math.exp(-dd * dd * 1.4) * Math.sign(y - by || 1); });
          pts.push([x, y + push, z]);
        }
        g.path(pts, { color: "brand", w: 2, dash: "14 12", dashOff: -t * 26 * 16, op: wo, bias: -1 });
      }
    } };
  }
  SC.wind = windScene([{ k: "box", x: -1.8, y: -1.6, w: 1, d: 1, h: 3.2, m: "paper" }, { k: "cyl", x: 0.4, y: 0.6, r: 0.7, h: 2.4, m: "sky" }, { k: "box", x: 1.6, y: -1.4, w: 1.2, d: 1.2, h: 2.0, m: "paper" }, { k: "box", x: -0.8, y: 1.2, w: 0.9, d: 0.9, h: 1.5, m: "paper" }], "zing");
  SC.windtunnel = windScene([{ k: "twist", x: -1.2, y: -0.8, w: 1.1, h: 4.2, m: "paper" }, { k: "cyl", x: 1.4, y: 0.8, r: 0.6, h: 3.4, m: "sky" }, { k: "box", x: 0.6, y: -2.2, w: 1, d: 1, h: 2.6, m: "paper" }], "sky");

  SC.stool = { cam: { yaw: 30, pitch: 24, S: 72, amp: 10 }, draw: function (g, t) {
    g.grid(3, 1);
    var press = Math.max(0, Math.sin((t - 0.6) * TAU * 3)) * seg(t, 0.6, 0.62) * (1 - seg(t, 0.8, 0.86));
    for (var i = 0; i < 9; i++) {
      var a = ap(t, i, 0.05, 0.03, 0.08);
      if (a <= 0) continue;
      var z = i * 0.18 + (1 - a) * 1.2;
      g.box(-1.1, -0.8, z, 2.2, 1.6, 0.16, i % 2 ? "wood" : "paper", { op: a });
    }
    var ca = ap(t, 0, 0.36, 0, 0.12), ch = 0.34 * (1 - 0.35 * press);
    if (ca > 0) g.box(-1.0, -0.72, 1.62 + (1 - ca) * 1.5, 2.0, 1.44, ch, "sky", { op: ca });
    var ao = seg(t, 0.5, 0.58) * (1 - seg(t, 0.82, 0.88));
    [-0.5, 0.5].forEach(function (x) {
      var zt = 3.1 - 0.3 * press;
      g.line([x, 0, zt + 0.9], [x, 0, zt], { color: "brand", w: 3, op: ao, bias: -9 });
      g.path([[x - 0.18, 0, zt + 0.25], [x, 0, zt], [x + 0.18, 0, zt + 0.25]], { color: "brand", w: 3, op: ao, bias: -9 });
    });
    if (press > 0.05) g.dot([0, -0.72, 1.62 + ch / 2], 10 * press + 4, "zing", { op: ao, bias: -9 });
  } };

  SC.shelter = { cam: { yaw: 36, pitch: 22, S: 64, amp: 7 }, draw: function (g, t) {
    g.grid(4, 1);
    var up = eio(seg(t, 0.12, 0.42)), L = 2.0, ridge = [0, 0, 0];
    var ang = lerp(0, 58, up) * RAD;
    var shake = 0.035 * Math.sin(t * TAU * 9) * seg(t, 0.55, 0.6) * (1 - seg(t, 0.8, 0.86));
    function panel(side) {
      var hx = side * (L * Math.cos(ang)), hz = L * Math.sin(ang);
      var baseX = side * lerp(L * 1.02, L * Math.cos(ang), 1);
      var bottom = side * L * Math.cos(ang), topP = [0 + shake, hz];
      var p0 = [bottom, 0], p1 = [topP[0], topP[1]];
      if (up < 0.01) { p0 = [side * 0.05, 0]; p1 = [side * (L + 0.05), 0]; }
      else { p0 = [side * L * Math.cos(ang) + side * 0.0, 0]; p1 = [shake, L * Math.sin(ang)]; }
      var flatP0 = [side * 0.1, 0.01], flatP1 = [side * (L + 0.1), 0.01];
      var A = [lerp(flatP1[0], p0[0], up), lerp(flatP1[1], p0[1], up)], B = [lerp(flatP0[0], p1[0], up), lerp(flatP0[1], p1[1], up)];
      g.plank(A, B, 0.06, -1.5, 1.5, side < 0 ? "paper" : "foil", { op: ap(t, 0, 0.04, 0, 0.1) });
      for (var k = 1; k < 6; k++) {
        var y = -1.5 + k * 0.5, oo = 0.035 * (side < 0 ? -1 : 1);
        g.line([A[0], y, A[1] + 0.05], [B[0], y, B[1] + 0.05], { w: 1, color: "soft", op: ap(t, 0, 0.04, 0, 0.1), bias: -0.05 });
      }
      return B;
    }
    panel(-1); panel(1);
    var ga = ap(t, 0, 0.42, 0, 0.1), hz = L * Math.sin(ang), hx = L * Math.cos(ang);
    if (ga > 0) g.poly([[-hx, 1.5, 0], [hx, 1.5, 0], [shake, 1.5, hz]], "zing", { op: ga });
    var wo = seg(t, 0.5, 0.58) * (1 - seg(t, 0.82, 0.88));
    for (var k = 0; k < 4; k++) { var off = frac(t * 3 + k / 4); g.line([-5 + off * 2, -1 + k * 0.6, 0.6 + k * 0.4], [-4 + off * 2, -1 + k * 0.6, 0.6 + k * 0.4], { color: "brand", w: 3, op: wo * Math.sin(off * Math.PI), bias: -20 }); }
    // 20-minute timer
    var q = g.P([2.8, -1.8, 3.4]), prog = seg(t, 0.08, 0.5), r = 22 * (g.S / 64);
    var tO = seg(t, 0.06, 0.1) * (1 - seg(t, 0.86, 0.92));
    var ea = -Math.PI / 2 + prog * TAU, lg = prog > 0.5 ? 1 : 0;
    g.screen('<g opacity="' + tO.toFixed(3) + '"><circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="' + f1(r) + '" fill="' + g.T.mats.paper + '" stroke="' + g.T.line + '" stroke-width="2"/>' +
      (prog > 0.001 ? '<path d="M' + f1(q[0]) + ' ' + f1(q[1] - r) + ' A' + f1(r) + ' ' + f1(r) + ' 0 ' + lg + ' 1 ' + f1(q[0] + r * Math.cos(ea)) + ' ' + f1(q[1] + r * Math.sin(ea)) + '" fill="none" stroke="' + g.T.mats.zing + '" stroke-width="6"/>' : "") +
      '<line x1="' + f1(q[0]) + '" y1="' + f1(q[1]) + '" x2="' + f1(q[0] + r * 0.7 * Math.cos(ea)) + '" y2="' + f1(q[1] + r * 0.7 * Math.sin(ea)) + '" stroke="' + g.T.line + '" stroke-width="2.4" stroke-linecap="round"/></g>');
  } };

  SC.tower = { cam: { yaw: 30, pitch: 18, S: 56, amp: 12, z: 1.15 }, draw: function (g, t) {
    g.grid(3, 1);
    var lv = [[0, 1.6], [1.3, 1.25], [2.6, 0.92], [3.8, 0.62], [4.9, 0.36]];
    var load = eo(seg(t, 0.56, 0.64));
    var sw = 0.06 * Math.sin((t - 0.64) * TAU * 3) * seg(t, 0.64, 0.66) * (1 - seg(t, 0.64, 0.86));
    function W(p) { return [p[0] + sw * p[2], p[1], p[2]]; }
    function corners(l) { var z = lv[l][0], h = lv[l][1]; return [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]].map(W); }
    for (var l = 0; l < lv.length; l++) {
      var a = ap(t, l, 0.06, 0.08, 0.12);
      if (a <= 0) continue;
      var C = corners(l);
      for (var i = 0; i < 4; i++) g.tube(C[i], C[(i + 1) % 4], { w: 3, mat: "wood", op: a });
      if (l > 0) {
        var D = corners(l - 1);
        for (var j = 0; j < 4; j++) {
          var topP = [lerp(D[j][0], C[j][0], a), lerp(D[j][1], C[j][1], a), lerp(D[j][2], C[j][2], a)];
          g.tube(D[j], topP, { w: 3, mat: "wood" });
          if (a > 0.6) g.tube(D[j], C[(j + 1) % 4], { w: 2.4, mat: "wood", op: (a - 0.6) / 0.4 });
        }
      }
      C.forEach(function (p) { g.dot(p, 7, "paper", { op: a, bias: -0.2 }); });
    }
    if (load > 0) {
      var z = lv[4][0] + (1 - load) * 2.2;
      var tp = W([0, 0, z]);
      g.box(tp[0] - 0.45, tp[1] - 0.3, z, 0.9, 0.6, 0.4, "zing");
      g.dot(W([-0.25, -0.31, z + 0.02]), 5, "ink", { bias: -1 }); g.dot(W([0.25, -0.31, z + 0.02]), 5, "ink", { bias: -1 });
    }
    // 10-second timer ticks
    var tO = seg(t, 0.64, 0.68) * (1 - seg(t, 0.86, 0.9)), q = g.P([2.4, -1.6, 4.8]);
    for (var k = 0; k < 10; k++) {
      var on = seg(t, 0.66 + k * 0.02, 0.67 + k * 0.02);
      g.screen('<rect x="' + f1(q[0] + k * 9) + '" y="' + f1(q[1]) + '" width="6" height="14" rx="2" fill="' + (on > 0.5 ? g.T.mats.zing : "none") + '" stroke="' + g.T.line + '" stroke-width="1.5" opacity="' + tO.toFixed(3) + '"/>');
    }
  } };

  SC.egg = { cam: { yaw: 24, pitch: 16, S: 62, amp: 0, z: 1.9 }, draw: function (g, t) {
    g.grid(3, 1);
    var f = seg(t, 0.18, 0.44), z;
    if (t < 0.44) z = lerp(5.4, 1.0, f * f);
    else { var b = seg(t, 0.44, 0.62); z = 1.0 + 0.9 * Math.sin(b * Math.PI) * (1 - b * 0.5); if (b >= 1) z = 1.0; }
    var squash = t > 0.43 && t < 0.5 ? Math.sin(seg(t, 0.43, 0.5) * Math.PI) : 0;
    var rot = t * TAU * 0.5 * (1 - seg(t, 0.44, 0.62)) + 0.8;
    var ctr = [0, 0, z], appear = ap(t, 0, 0.04, 0, 0.12);
    var axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.7, 0.7, 0], [-0.7, 0.7, 0], [0, 0.7, 0.7]];
    axes.forEach(function (ax, i) {
      var p = rotZ([ax[0], ax[1], ax[2]], [0, 0, 0], rot), L = 1.05 * (1 - 0.15 * squash);
      var A = [ctr[0] - p[0] * L, ctr[1] - p[1] * L, ctr[2] - p[2] * L * (1 - 0.3 * squash)], B = [ctr[0] + p[0] * L, ctr[1] + p[1] * L, ctr[2] + p[2] * L * (1 - 0.3 * squash)];
      var a = ap(t, i, 0.04, 0.015, 0.08);
      g.tube(A, [lerp(ctr[0], B[0], a), lerp(ctr[1], B[1], a), lerp(ctr[2], B[2], a)], { w: 4, mat: i % 2 ? "sky" : "paper" });
    });
    g.dot(ctr, 24 * (g.S / 62), "wood", { op: appear, sx: 0.82 * (1 + 0.15 * squash), sy: 1.05 * (1 - 0.2 * squash), bias: 0 });
    var sh = g.P([0, 0, 0]), so = appear * clamp(1.2 - (z - 1) / 5);
    g.screen("");
    g.shadow(circlePts(0, 0, 0.001, 0.4 + 0.6 * clamp(1 - (z - 1) / 4.4), 20), so);
    var ok = seg(t, 0.64, 0.68) * (1 - seg(t, 0.86, 0.9)), q = g.P([0, 0, 2.2]);
    if (ok > 0) g.screen('<path d="M' + f1(q[0] + 36) + ' ' + f1(q[1] - 4) + ' l10 10 l20 -22" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="' + ok.toFixed(3) + '"/>');
  } };

  function chair(g, x, y, a, op) {
    var legs = [[0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]];
    legs.forEach(function (l) { g.box(x + l[0] - 0.06, y + l[1] - 0.06, 0, 0.12, 0.12, 1.4 * a, "wood", { op: op }); });
    g.box(x, y, 1.4 * a, 1, 1, 0.12, "paper", { op: op });
  }
  SC.bridge = { cam: { yaw: 22, pitch: 22, S: 60, amp: 7 }, draw: function (g, t) {
    g.grid(4, 1);
    var ca = ap(t, 0, 0.04, 0, 0.14);
    chair(g, -3.6, -0.5, ca); chair(g, 2.6, -0.5, ca);
    g.box(-3.6, 0.35, 1.5, 1, 0.15, 1.4 * ca, "paper", { op: ca });
    g.box(2.6, 0.35, 1.5, 1, 0.15, 1.4 * ca, "paper", { op: ca });
    var load = eo(seg(t, 0.64, 0.7)), sag = 0.12 * load;
    function Z(x, z) { return z - sag * Math.sin(Math.PI * clamp((x + 2.8) / 5.6)); }
    var tubes = [[[-3.2, -0.3, 1.6], [3.2, -0.3, 1.6]], [[-3.2, 0.3, 1.6], [3.2, 0.3, 1.6]], [[-2.6, -0.3, 1.6], [0, -0.3, 2.4]], [[0, -0.3, 2.4], [2.6, -0.3, 1.6]],
                 [[-2.6, 0.3, 1.6], [0, 0.3, 2.4]], [[0, 0.3, 2.4], [2.6, 0.3, 1.6]], [[-1.3, -0.3, 1.6], [-1.3, -0.3, 2.0]], [[1.3, -0.3, 1.6], [1.3, -0.3, 2.0]], [[0, -0.3, 2.4], [0, 0.3, 2.4]]];
    tubes.forEach(function (tb, i) {
      var a = ap(t, i, 0.18, 0.04, 0.08);
      if (a <= 0) return;
      var A = [tb[0][0], tb[0][1], Z(tb[0][0], tb[0][2])], B0 = [tb[1][0], tb[1][1], Z(tb[1][0], tb[1][2])];
      g.tube(A, [lerp(A[0], B0[0], a), lerp(A[1], B0[1], a), lerp(A[2], B0[2], a)], { w: 8, mat: "foil" });
    });
    if (load > 0) g.cyl(0, 0, Z(0, 1.6) + 0.1 + (1 - load) * 2.5, 0.3, 1.1, "sky", { top: "brand" });
    var dO = seg(t, 0.36, 0.44);
    g.line([-2.6, -1.3, 0.05], [2.6, -1.3, 0.05], { color: "brand", w: 2, op: dO, bias: 30 });
  } };

  SC.sound = { cam: { yaw: 30, pitch: 34, S: 64, amp: 6 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.04, 0, 0.14);
    var w = 2.6, d = 1.8, h = 1.3 * a0;
    g.box(-w / 2, -d / 2, 0, w, d, 0.06, "paper", { op: a0 });
    g.box(-w / 2, d / 2 - 0.06, 0, w, 0.06, h, "paper", { op: a0 });
    g.box(-w / 2, -d / 2, 0, 0.06, d, h, "paper", { op: a0 });
    g.box(w / 2 - 0.06, -d / 2, 0, 0.06, d, h, "paper", { op: a0 });
    g.box(-w / 2, -d / 2, 0, w, 0.06, h * 0.55, "paper", { op: a0 });
    var lin = seg(t, 0.4, 0.62);
    for (var i = 0; i < 18; i++) {
      var a = ap(t, i, 0.4, 0.011, 0.06);
      if (a <= 0) continue;
      var side = i % 3, k = Math.floor(i / 3);
      var p = side === 0 ? [-w / 2 + 0.3 + k * 0.42, d / 2 - 0.16, 0.4 + (i % 2) * 0.45] : side === 1 ? [-w / 2 + 0.16, -d / 2 + 0.3 + (k % 3) * 0.5, 0.35 + (k > 2 ? 0.5 : 0)] : [w / 2 - 0.16, -d / 2 + 0.3 + (k % 3) * 0.5, 0.35 + (k > 2 ? 0.5 : 0)];
      g.dot(p, 11 * a, "sky", { op: a });
    }
    var wa = ap(t, 0, 0.14, 0, 0.1);
    g.cyl(0, 0, 0.06, 0.34, 0.12, "zing", { op: wa });
    var hand = t * TAU * 4;
    g.line([0, 0, 0.19], [0.24 * Math.cos(hand), 0.24 * Math.sin(hand), 0.19], { w: 2.4, op: wa, bias: -2 });
    var c = g.P([0, 0, 0.2]), maxR = lerp(260, 90, eio(lin)) * (g.S / 64);
    for (var r = 0; r < 3; r++) {
      var ph = frac(t * 4 + r / 3), rr = 30 + ph * maxR;
      var o = (1 - ph) * seg(t, 0.14, 0.2) * (1 - seg(t, 0.84, 0.9));
      g.screen('<ellipse cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" rx="' + f1(rr) + '" ry="' + f1(rr * 0.62) + '" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="2" opacity="' + o.toFixed(3) + '"/>');
    }
    var la = ap(t, 0, 0.22, 0, 0.1);
    if (la > 0) g.poly([[-w / 2, d / 2, h], [w / 2, d / 2, h], [w / 2 + 0.2, d / 2 + 1.3 * la, h + 0.9 * la], [-w / 2 - 0.2, d / 2 + 1.3 * la, h + 0.9 * la]], "paper", { op: la });
  } };

  SC.tensegrity = { cam: { yaw: 0, pitch: 14, S: 64, spin: 360, z: 1.2 }, draw: function (g, t) {
    g.grid(3, 1);
    var tri = [[-1.5, -0.9], [1.5, -1.0], [-0.1, 1.1]];
    var a0 = ap(t, 0, 0.04, 0, 0.14), aArm = ap(t, 0, 0.14, 0, 0.12), a1 = eo(seg(t, 0.24, 0.42)), aS = ap(t, 0, 0.4, 0, 0.1);
    var bob = 0.06 * Math.sin(t * TAU * 2) * seg(t, 0.42, 0.5);
    var zt = 3.3 + (1 - a1) * 1.6 + bob, rock = 0.04 * Math.sin(t * TAU * 3) * seg(t, 0.42, 0.5);
    function top(p) { return rotX([p[0], p[1], p[2] + (zt - 3.3)], [0, 0, zt], rock); }
    var B = tri.map(function (c) { return [c[0], c[1], 0.06]; }), T = tri.map(function (c) { return top([c[0] * 0.95, c[1] * 0.95, 3.3]); });
    for (var i = 0; i < 3; i++) g.tube(B[i], B[(i + 1) % 3], { w: 11, mat: "wood", op: a0 });
    var bTip = [0.25, -0.2, 2.5];
    var armB = [B[1], [lerp(B[1][0], bTip[0], aArm), lerp(B[1][1], bTip[1], aArm), lerp(B[1][2], bTip[2], aArm)]];
    g.tube(armB[0], armB[1], { w: 11, mat: "wood", op: a0 });
    if (a1 > 0) {
      for (var j = 0; j < 3; j++) g.tube(T[j], T[(j + 1) % 3], { w: 11, mat: "wood", op: a1 });
      var tTip = top([-0.05, -0.25, 1.75]);
      g.tube(T[0], tTip, { w: 11, mat: "wood", op: a1 });
      g.line(bTip, tTip, { color: "brand", w: 2, op: a1, bias: -0.5 });
      g.dot(bTip, 4, "zing", { op: a1, bias: -0.6 }); g.dot(tTip, 4, "zing", { op: a1, bias: -0.6 });
    }
    for (var k = 0; k < 3; k++) g.line(B[k], T[k], { color: "brand", w: 1.6, op: aS * ap(t, k, 0.4, 0.03, 0.08) });
  } };

  // Airport of tomorrow: the same 20 stands, six terminal plans, and the walk from the entrance
  SC.airport = { cam: { yaw: 0, pitch: 90, S: 40, amp: 0, z: 1.06 }, draw: function (g, t) {
    var W = "#EDF3F6", Z = "#DCE85E", SK = "#A8D8F0";
    function gate(x, y, a) { return { p: [x, y], a: a }; }
    function ring(cx, cy, r, n, a0) { var out = []; for (var k = 0; k < n; k++) { var an = a0 + k / n * TAU; out.push(gate(cx + r * Math.cos(an), cy + r * Math.sin(an), an)); } return out; }

    var L = [];
    // 1. standard linear
    (function () {
      var G = [], i;
      for (i = 0; i < 20; i++) G.push(gate(-5.9 + i * 0.62, -0.5, Math.PI / 2));
      L.push({ name: "Standard linear", ent: [0, -2.9], term: [-1.3, -2.9, 2.6, 0.85],
        struct: [[[-6.1, -1.15], [6.1, -1.15]]],
        gates: G, via: function (q) { return [[0, -2.05], [0, -1.15], [q.p[0], -1.15]]; } });
    })();
    // 2. curvilinear
    (function () {
      var G = [], i, R = 2.55, cy = -1.5, a0 = 175 * RAD, a1 = 5 * RAD, arc = [];
      for (i = 0; i < 20; i++) { var an = lerp(a0, a1, i / 19); G.push(gate(Math.cos(an) * (R + 0.62), cy + Math.sin(an) * (R + 0.62), an)); }
      for (i = 0; i <= 28; i++) { var b = lerp(a0, a1, i / 28); arc.push([Math.cos(b) * R, cy + Math.sin(b) * R]); }
      L.push({ name: "Curvilinear", ent: [0, -3.1], term: [-1.1, -2.5, 2.2, 0.8],
        struct: [arc],
        gates: G, via: function (q) {
          var an = Math.atan2(q.p[1] - cy, q.p[0]), out = [[0, -1.7], [0, cy + R]], steps = 8;
          for (var k = 1; k <= steps; k++) { var b = lerp(90 * RAD, an, k / steps); out.push([Math.cos(b) * R, cy + Math.sin(b) * R]); }
          return out;
        } });
    })();
    // 3. pier
    (function () {
      var G = [], px = [-1.9, 1.9], i, k;
      for (i = 0; i < 2; i++) for (k = 0; k < 5; k++) {
        G.push(gate(px[i] - 0.72, -0.7 + k * 0.78, Math.PI));
        G.push(gate(px[i] + 0.72, -0.7 + k * 0.78, 0));
      }
      L.push({ name: "Pier", ent: [0, -3.1], term: [-1.3, -3.0, 2.6, 0.8],
        struct: [[[-3.4, -1.75], [3.4, -1.75]], [[px[0], -1.75], [px[0], 3.0]], [[px[1], -1.75], [px[1], 3.0]]],
        gates: G, via: function (q) { var pier = q.p[0] < 0 ? px[0] : px[1]; return [[0, -2.2], [0, -1.75], [pier, -1.75], [pier, q.p[1]]]; } });
    })();
    // 4. concourse
    (function () {
      var G = [], xs = [-2.9, -1.45, 0, 1.45, 2.9], rows = [-1.4, 0.8], i, k, st = [[[-2.9, -2.1], [2.9, -2.1]]];
      for (i = 0; i < xs.length; i++) {
        st.push([[xs[i], -2.1], [xs[i], 1.7]]);
        for (k = 0; k < rows.length; k++) { G.push(gate(xs[i] - 0.7, rows[k], Math.PI)); G.push(gate(xs[i] + 0.7, rows[k], 0)); }
      }
      st.push([[-2.9, -0.3], [2.9, -0.3]]);
      L.push({ name: "Concourse", ent: [0, -3.4], term: [-1.2, -3.35, 2.4, 0.8],
        struct: st, gates: G,
        via: function (q) { var x = Math.round(q.p[0] / 1.45) * 1.45, cross = q.p[1] > 0 ? -0.3 : -2.1; return [[0, -2.55], [0, -2.1], [x, -2.1], [x, cross], [x, q.p[1]]]; } });
    })();
    // 5. satellite
    (function () {
      var c1 = [-2.1, -0.4], c2 = [2.1, -0.4], R = 1.05;
      var G = ring(c1[0], c1[1], R + 0.66, 10, 20 * RAD).concat(ring(c2[0], c2[1], R + 0.66, 10, 20 * RAD));
      var circ = function (c) { var o = []; for (var k = 0; k <= 24; k++) { var a = k / 24 * TAU; o.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]); } return o; };
      L.push({ name: "Satellite", ent: [0, 3.1], term: [-1.3, 2.7, 2.6, 0.8],
        struct: [circ(c1), circ(c2), [[0, 2.7], [c1[0], c1[1] + R]], [[0, 2.7], [c2[0], c2[1] + R]]],
        link: 2,
        gates: G, via: function (q) {
          var c = q.p[0] < 0 ? c1 : c2, an = Math.atan2(q.p[1] - c[1], q.p[0] - c[0]), out = [[0, 2.7]];
          out.push([c[0], c[1] + R]);
          for (var k = 1; k <= 6; k++) { var b = lerp(90 * RAD, an, k / 6); out.push([c[0] + R * Math.cos(b), c[1] + R * Math.sin(b)]); }
          return out;
        } });
    })();
    // 6. star pier
    (function () {
      var G = [], st = [[[-3.7, 0], [-0.75, 0]]], counts = [4, 3, 3, 4, 3, 3], i, k;
      for (i = 0; i < 6; i++) {
        var an = (30 + i * 60) * RAD, ux = Math.cos(an), uy = Math.sin(an);
        st.push([[ux * 0.7, uy * 0.7], [ux * 3.2, uy * 3.2]]);
        for (k = 0; k < counts[i]; k++) {
          var d = 1.5 + k * 0.62, side = k % 2 ? 1 : -1;
          G.push(gate(ux * d - uy * side * 0.8, uy * d + ux * side * 0.8, an - side * Math.PI / 2));
        }
      }
      L.push({ name: "Star pier", ent: [-3.75, 0], term: [-4.75, -0.42, 1.1, 0.84], hub: true,
        struct: st, gates: G,
        via: function (q) { var an = Math.atan2(q.p[1], q.p[0]); return [[-0.75, 0], [0, 0], [Math.cos(an) * 1.0, Math.sin(an) * 1.0]]; } });
    })();

    function longestWalk(l) {
      var worst = 0;
      for (var n = 0; n < l.gates.length; n++) {
        var legs = [l.ent].concat(l.via(l.gates[n]), [l.gates[n].p]), tot = 0;
        for (var m = 0; m < legs.length - 1; m++) tot += Math.hypot(legs[m + 1][0] - legs[m][0], legs[m + 1][1] - legs[m][1]);
        worst = Math.max(worst, tot);
      }
      return worst;
    }
    var walks = L.map(longestWalk), worstAll = Math.max.apply(null, walks), bestAll = Math.min.apply(null, walks);

    // --- where we are in the cycle
    var slot = clamp(t, 0, 0.99999) * L.length, idx = Math.floor(slot), f = slot - idx;
    var cur = L[idx], nxt = L[(idx + 1) % L.length];
    var tr = eio(clamp((f - 0.76) / 0.24));
    var appear = clamp(f / 0.14) * (idx === 0 ? clamp(t / 0.03) : 1);

    function plan(l, op) {
      if (op <= 0.01) return;
      l.struct.forEach(function (line, li) {
        var pts = line.map(function (q) { return [q[0], q[1], 0]; });
        g.path(pts, { color: W, w: l.link !== undefined && li >= l.link ? 1.6 : 2.6, dash: l.link !== undefined && li >= l.link ? "7 7" : null, op: op });
      });
      var T = l.term;
      g.path([[T[0], T[1], 0], [T[0] + T[2], T[1], 0], [T[0] + T[2], T[1] + T[3], 0], [T[0], T[1] + T[3], 0]], { closed: true, color: W, w: 2.2, fill: "rgba(237,243,246,0.10)", op: op });
      g.dot([l.ent[0], l.ent[1], 0], 8, Z, { stroke: false, op: op });
    }
    plan(cur, (1 - tr) * appear);
    plan(nxt, tr);

    // --- the 20 stands, sliding from one plan to the next
    var walk = seg(f, 0.16, 0.74) * (1 - tr);
    var longest = 0;
    for (var i = 0; i < 20; i++) {
      var a = cur.gates[i], b = nxt.gates[i];
      var da = b.a - a.a; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      var x = lerp(a.p[0], b.p[0], tr), y = lerp(a.p[1], b.p[1], tr), an = a.a + da * tr;
      var dx = Math.cos(an), dy = Math.sin(an), op = appear;
      g.line([x - dx * 0.34, y - dy * 0.34, 0], [x - dx * 0.62, y - dy * 0.62, 0], { color: W, w: 1.4, op: op * 0.8 });
      function P2(fw, sw) { return [x + dx * fw - dy * sw, y + dy * fw + dx * sw, 0]; }
      g.path([P2(-0.34, 0), P2(0.34, 0)], { color: SK, w: 2.4, op: op });
      g.path([P2(-0.12, 0.38), P2(0.05, 0)], { color: SK, w: 2, op: op });
      g.path([P2(-0.12, -0.38), P2(0.05, 0)], { color: SK, w: 2, op: op });
      g.path([P2(-0.34, 0.16), P2(-0.26, 0)], { color: SK, w: 1.6, op: op });
      g.path([P2(-0.34, -0.16), P2(-0.26, 0)], { color: SK, w: 1.6, op: op });

      // the walk from the entrance, drawn stand by stand
      var legs = [cur.ent].concat(cur.via(cur.gates[i]), [cur.gates[i].p]);
      var segs = [], total = 0, m;
      for (m = 0; m < legs.length - 1; m++) { var Ln = Math.hypot(legs[m + 1][0] - legs[m][0], legs[m + 1][1] - legs[m][1]); segs.push(Ln); total += Ln; }
      longest = Math.max(longest, total);
      var reach = clamp(walk * 26 - i * 0.9);
      if (reach > 0.01 && walk > 0) {
        var pts = [[legs[0][0], legs[0][1], 0]], want = total * reach, acc = 0;
        for (m = 0; m < segs.length; m++) {
          if (acc + segs[m] <= want) { pts.push([legs[m + 1][0], legs[m + 1][1], 0]); acc += segs[m]; }
          else { var fr = (want - acc) / segs[m]; pts.push([lerp(legs[m][0], legs[m + 1][0], fr), lerp(legs[m][1], legs[m + 1][1], fr), 0]); break; }
        }
        g.path(pts, { color: Z, w: 2.2, op: 0.85 * appear, bias: -2 });
      }
    }

    // --- longest walk, as a bar under the plan
    var barW = 4.6, y0 = -4.5, scale = barW / worstAll;
    var shown = lerp(walks[idx], walks[(idx + 1) % L.length], tr);
    var bo = seg(f, 0.2, 0.3) * appear;
    g.line([-barW / 2, y0, 0], [barW / 2, y0, 0], { color: W, w: 1.6, op: bo * 0.22 });
    g.line([-barW / 2 + bestAll * scale, y0 - 0.16, 0], [-barW / 2 + bestAll * scale, y0 + 0.16, 0], { color: W, w: 1.6, op: bo * 0.45 });
    g.line([-barW / 2, y0, 0], [-barW / 2 + shown * scale, y0, 0], { color: Z, w: 5, op: bo });
    g.dot([-barW / 2 + shown * scale, y0, 0], 5, Z, { stroke: false, op: bo });
  } };

  // ---------- Changemakers
  SC.slots = { cam: { yaw: 36, pitch: 22, S: 56, amp: 7 }, draw: function (g, t) {
    g.grid(5, 1);
    for (var i = 0; i < 6; i++) {
      var a = ap(t, i, 0.05, 0.05, 0.12), y = -2.5 + i * 1.0 + (1 - a) * 3;
      if (a <= 0) continue;
      var outer = [], inner = [];
      for (var k = 0; k <= 14; k++) { var an = Math.PI * k / 14; outer.push([2.7 * Math.cos(an), y, 2.7 * Math.sin(an)]); inner.push([2.35 * Math.cos(an), y, 2.35 * Math.sin(an)]); }
      g.poly(outer.concat(inner.reverse()), i % 2 ? "paper" : "wood", { op: a });
    }
    for (var s = 0; s < 7; s++) {
      var an = Math.PI * (s + 0.5) / 7, a2 = ap(t, s, 0.38, 0.03, 0.08);
      if (a2 <= 0) continue;
      var r = 2.52, x = r * Math.cos(an), z = r * Math.sin(an);
      g.line([x, -2.6, z], [x, lerp(-2.6, 2.6, a2), z], { w: 4, color: s % 2 ? "brand" : "line", bias: -0.3 });
    }
    var pa = ap(t, 0, 0.62, 0, 0.1);
    if (pa > 0) { g.dot([0.2, 0, 1.25], 11, "zing", { op: pa, bias: -2 }); g.path([[0.2, 0, 1.05], [0.2, 0, 0.5], [0.6, 0, 0.5], [0.6, 0, 0.05]], { w: 3, op: pa, bias: -2 }); }
  } };

  function prismXZ(g, prof, y0, y1, mat, tf, op) {
    var A = prof.map(function (q) { return tf([q[0], y0, q[1]]); }), Bq = prof.map(function (q) { return tf([q[0], y1, q[1]]); });
    g.poly(A, mat, { op: op }); g.poly(Bq, mat, { op: op });
    for (var i = 0; i < prof.length; i++) { var j = (i + 1) % prof.length; g.poly([A[i], A[j], Bq[j], Bq[i]], mat, { op: op, w: 1 }); }
  }
  function pose(c, axis, ang, off, a, lift) {
    return function (p) {
      var k = 1 - a, q = axis === "x" ? rotX(p, c, ang * k) : rotY(p, c, ang * k);
      return [q[0] + off[0] * k, q[1] + off[1] * k, q[2] + off[2] * k + (lift || 0) * Math.sin(Math.PI * a)];
    };
  }
  function rotAxis(v, k, a) { // Rodrigues: rotate v about the unit axis k
    var c = Math.cos(a), s = Math.sin(a), kv = dot(k, v) * (1 - c), kx = cross(k, v);
    return [v[0] * c + kx[0] * s + k[0] * kv, v[1] * c + kx[1] * s + k[1] * kv, v[2] * c + kx[2] * s + k[2] * kv];
  }
  function basisTurn(A, B) { // axis + angle of the rotation carrying basis A = [a1, a2, a3] onto B = [b1, b2, b3]
    var R = [0, 1, 2].map(function (i) { return [0, 1, 2].map(function (j) { return B[0][i] * A[0][j] + B[1][i] * A[1][j] + B[2][i] * A[2][j]; }); });
    var ax = [R[2][1] - R[1][2], R[0][2] - R[2][0], R[1][0] - R[0][1]];
    return { k: Math.hypot(ax[0], ax[1], ax[2]) > 1e-6 ? norm(ax) : [0, 0, 1], a: Math.acos(clamp((R[0][0] + R[1][1] + R[2][2] - 1) / 2, -1, 1)) };
  }
  function partial(pts, f) { // leading fraction f (by length) of a 2D polyline
    var L = 0, i, d = [];
    for (i = 1; i < pts.length; i++) { d.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); L += d[i - 1]; }
    var want = L * f, out = [pts[0]];
    for (i = 1; i < pts.length; i++) {
      if (want >= d[i - 1]) { out.push(pts[i]); want -= d[i - 1]; continue; }
      var k = want / d[i - 1];
      out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]);
      break;
    }
    return out;
  }
  // Every piece is nested on ONE cardboard sheet: the layout is marked, cut, the pieces pop out, the offcut
  // clears and the chair assembles: three identical cross-sections (far side, middle, near side), then the
  // front apron, seat and back resting on their edges.
  SC.chair = { cam: { yaw: 36, pitch: 20, S: 56, amp: 8, z: 1.6,
      at: function (t) { var k = eio(seg(t, 0.27, 0.45)); return { pitch: lerp(50, 20, k), z: lerp(2.1, 1.6, k), cy: lerp(0.47, 0.64, k) }; } },
    draw: function (g, t) {
    g.grid(5, 1);
    var X = -0.8, W = 0.9, TH = 0.05, UP = [0, 0, 1];
    var prof = [[0, 0], [0.35, 0], [0.45, 0.3], [1.05, 0.3], [1.2, 0], [1.55, 0], [1.4, 0.7], [1.75, 2.2], [1.45, 2.2], [1.02, 0.86], [0, 1.02]];
    // a full-width board lying on a profile edge a -> b (x from the chair front, z), sitting just outside it
    function board(a, b) {
      var dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), e2 = [dx / L, 0, dz / L], n = [-e2[2], 0, e2[0]];
      return { pts: [[0, 0], [2 * W, 0], [2 * W, L], [0, L]], e1: [0, -1, 0], e2: e2, n: n, o: [X + a[0] + n[0] * TH / 2, W, a[1] + n[2] * TH / 2], arc: 0.8 };
    }
    var P = [W - TH / 2, 0, -W + TH / 2].map(function (y) { return { pts: prof, e1: [1, 0, 0], e2: [0, 0, 1], n: [0, -1, 0], o: [X, y, 0], arc: 0.4 }; })
      .concat([board([0, 0.05], [0, 1.02]), board([-TH, 1.028], [1.02, 0.86]), board([1.02, 0.86], [1.392, 2.02])]);

    // sheet layout: boards along the near edge, the three cross-sections behind them
    var MG = 0.14, GAP = 0.1, SW = 6 * W + 2 * GAP + 2 * MG, rowV = MG + P[5].pts[2][1] + GAP, SH = rowV + 2.2 + MG;
    var phi = 42 * RAD, U = [Math.cos(phi), -Math.sin(phi), 0], V = [Math.sin(phi), Math.cos(phi), 0];
    var appear = ap(t, 0, 0.02, 0, 0.08), drop = (1 - appear) * 0.8, gone = eio(seg(t, 0.3, 0.4));
    function S2W(u, v, z, dv) { u -= SW / 2; v -= rowV + 1.1 + (dv || 0); return [X + 0.875 + u * U[0] + v * V[0], u * U[1] + v * V[1], z]; }

    var load = eo(seg(t, 0.7, 0.76)), dip = 0.025 * load * (1 + 0.6 * Math.sin((t - 0.76) * TAU * 4) * seg(t, 0.76, 0.78) * (1 - seg(t, 0.76, 0.86)));
    P.forEach(function (pc, i) {
      var ps = pc.pts.map(function (q) { return q[0]; }), qs = pc.pts.map(function (q) { return q[1]; });
      pc.pc = (Math.min.apply(null, ps) + Math.max.apply(null, ps)) / 2; pc.qc = (Math.min.apply(null, qs) + Math.max.apply(null, qs)) / 2;
      pc.u0 = i < 3 ? MG + (6 * W - 5.25) / 2 + i * (1.75 + GAP) : MG + (i - 3) * (2 * W + GAP);
      pc.v0 = i < 3 ? rowV : MG;
      pc.cut = seg(t, 0.09 + i * 0.026, 0.16 + i * 0.026);
      pc.pop = eo(seg(t, 0.16 + i * 0.026, 0.19 + i * 0.026));
      pc.fly = eio(seg(t, 0.3 + i * 0.042, 0.42 + i * 0.042));
      pc.turn = basisTurn([U, V, UP], [pc.e1, pc.e2, pc.n]);
      pc.dip = i === 4 ? dip : 0;
    });

    // piece-local (p, q, h) -> world, blending the flat pose on the sheet into the assembled pose
    function placer(pc) {
      var a = pc.fly, cf = S2W(pc.u0 + pc.pc, pc.v0 + pc.qc, TH / 2 + 0.2 * pc.pop);
      var ca = [0, 1, 2].map(function (j) { return pc.o[j] + pc.pc * pc.e1[j] + pc.qc * pc.e2[j]; });
      var c = [lerp(cf[0], ca[0], a), lerp(cf[1], ca[1], a), lerp(cf[2], ca[2], a) + pc.arc * Math.sin(Math.PI * a) - pc.dip];
      return function (p, q, h) {
        var r = rotAxis([(p - pc.pc) * U[0] + (q - pc.qc) * V[0], (p - pc.pc) * U[1] + (q - pc.qc) * V[1], h], pc.turn.k, pc.turn.a * a);
        return [c[0] + r[0], c[1] + r[1], c[2] + r[2]];
      };
    }

    // the sheet (later the offcut): holes open where pieces have popped out
    if (appear > 0 && gone < 1) {
      var so = appear * (1 - gone), rect = [[0, 0], [SW, 0], [SW, SH], [0, SH]];
      var slide = 2.4 * gone; // the offcut slides away under the lifted pieces
      var top = rect.map(function (q) { return S2W(q[0], q[1], TH + drop, slide); }), bot = rect.map(function (q) { return S2W(q[0], q[1], drop, slide); });
      var holes = P.filter(function (pc) { return pc.pop > 0; }).map(function (pc) { return pc.pts.map(function (q) { return S2W(pc.u0 + q[0], pc.v0 + q[1], TH + drop, slide); }); });
      g.poly(top, "wood", { op: so, bias: 30, holes: holes.length ? holes : undefined });
      for (var e = 0; e < 4; e++) g.poly([bot[e], bot[(e + 1) % 4], top[(e + 1) % 4], top[e]], "wood", { cull: true, w: 1, op: so, bias: 30 });
    }

    // marked layout, then the cutter tracing each outline
    P.forEach(function (pc, i) {
      if (pc.pop >= 1 || appear <= 0) return;
      var fade = 1 - pc.pop, loop = pc.pts.concat([pc.pts[0]]);
      var toW = function (q) { return S2W(pc.u0 + q[0], pc.v0 + q[1], TH + drop + 0.004); };
      g.path(loop.map(toW), { color: g.T.soft, w: 1.4, dash: "5 6", op: ap(t, i, 0.04, 0.01, 0.06) * fade, bias: -30 });
      if (pc.cut <= 0) return;
      var cutPts = partial(loop, pc.cut).map(toW);
      g.path(cutPts, { color: "zing", w: 2.6, op: fade, bias: -31 });
      if (pc.cut < 1) g.dot(cutPts[cutPts.length - 1], 5, "zing", { stroke: false, bias: -32 });
    });

    // cut pieces as solid boards: the visible face, plus the edge strips facing the camera
    P.forEach(function (pc) {
      if (pc.pop <= 0) return;
      var f = placer(pc), n = pc.pts.length;
      var top = pc.pts.map(function (q) { return f(q[0], q[1], TH / 2); }), bot = pc.pts.map(function (q) { return f(q[0], q[1], -TH / 2); });
      g.poly(dot(rotAxis(UP, pc.turn.k, pc.turn.a * pc.fly), g.V) > 0 ? top : bot, "wood", {});
      for (var j = 0; j < n; j++) g.poly([bot[j], bot[(j + 1) % n], top[(j + 1) % n], top[j]], "wood", { cull: true, w: 1 });
    });

    // load test: a sitter lands on the seat, which now has a middle support under it
    if (load > 0) {
      var bz = 0.975 - dip + (1 - load) * 2.4, bc = [X + 0.6, 0, bz], tilt = Math.atan2(0.168, 1.07);
      var sit = function (p) { return rotY(p, bc, tilt); };
      g.box(X + 0.2, -0.45, bz, 0.8, 0.9, 0.6, "zing", { tf: sit });
      g.dot(sit([X + 0.75, 0, bz + 1.0]), 14, "zing");
    }
  } };

  SC.windtunnel = SC.windtunnel;

  SC.solar = { cam: { yaw: 30, pitch: 28, S: 66, amp: 6 }, draw: function (g, t) {
    g.grid(4, 1);
    var a0 = ap(t, 0, 0.04, 0, 0.12);
    g.box(-1.5, -1.1, 0, 3.0, 2.2, 0.45 * a0, "paper", { op: a0 });
    g.box(-1.3, -0.9, 0.45 * a0, 2.6, 1.8, 0.02, "ink", { op: a0 });
    var open = eio(seg(t, 0.12, 0.34)) * 105 * RAD, hinge = [0, 1.1, 0.45];
    var lid = [[-1.5, -1.1, 0.45], [1.5, -1.1, 0.45], [1.5, 1.1, 0.45], [-1.5, 1.1, 0.45]].map(function (p) { return rotX(p, hinge, -open); });
    g.poly(lid, "sky", { op: a0 });
    var wrap = ap(t, 0, 0.3, 0, 0.1);
    g.poly([[-1.3, -0.9, 0.5], [1.3, -0.9, 0.5], [1.3, 0.9, 0.5], [-1.3, 0.9, 0.5]], "sky", { op: wrap * 0.35, stroke: false, bias: -3 });
    var melt = eio(seg(t, 0.55, 0.82));
    [[-0.6, -0.2], [0.1, 0.2], [0.6, -0.3]].forEach(function (m, i) {
      var a = ap(t, i, 0.36, 0.03, 0.08), h = 0.35 * (1 - 0.55 * melt), wd = 0.34 * (1 + 0.4 * melt);
      g.box(m[0] - wd / 2, m[1] - wd / 2, 0.47, wd, wd, h * a, "paper", { op: a, bias: -1 });
    });
    var sa = lerp(-40, 30, seg(t, 0.2, 0.9)) * RAD, sun = [3.2 * Math.sin(sa), -3.4, 4.6];
    var so = seg(t, 0.18, 0.26);
    g.dot(sun, 24, "zing", { op: so, bias: -60 });
    var mid = [0, 1.1 + Math.sin(open) * 0.9, 0.45 + Math.cos(Math.PI - open) * -0.9];
    [[-0.6, -0.2, 0.6], [0.1, 0.2, 0.6], [0.6, -0.3, 0.6]].forEach(function (m, i) {
      g.path([sun, [m[0], 1.0 + 0.6 * Math.sin(open) - 0.1, 0.45 + 1.2 * Math.sin(open)], m], { color: "brand", w: 1.6, dash: "6 8", dashOff: -t * 14 * 30, op: so * seg(t, 0.36, 0.44) * 0.9, bias: -40 });
    });
  } };

  SC.flood = { cam: { yaw: 26, pitch: 44, S: 52, amp: 5 }, draw: function (g, t) {
    g.box(-5, -4, -0.1, 10, 8, 0.1, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var lvl = 0.5 * eio(seg(t, 0.26, 0.44)) * (1 - eio(seg(t, 0.8, 0.9)));
    var houses = [[-3.6, -3.2, 1], [-1.8, -3.0, 1], [0.2, -3.3, 1], [2.2, -3.1, 1], [-3.2, 0.6, 0], [-1.2, 1.2, 0], [1.2, 0.8, 0], [3.0, 1.6, 0]];
    var targets = [[-3.8, 2.6], [-1.6, 2.9], [0.6, 2.8], [2.6, 3.0]];
    var move = eio(seg(t, 0.46, 0.68));
    var ti = 0;
    houses.forEach(function (h, i) {
      var a = ap(t, i, 0.06, 0.025, 0.1);
      if (a <= 0) return;
      var x = h[0], y = h[1], lift = 0;
      if (h[2]) { var tg = targets[ti++]; x = lerp(h[0], tg[0], move); y = lerp(h[1], tg[1], move); lift = 1.2 * Math.sin(move * Math.PI); }
      g.box(x, y, lift, 1.1, 0.9, 0.7 * a, "paper");
      gable(g, x, y, lift + 0.7 * a, 1.1, 0.9, 0.45 * a, h[2] ? "zing" : "paper");
    });
    if (lvl > 0.01) g.box(-5, -4, 0, 10, 3.2, lvl, "water", { op: 0.6 });
    var zo = seg(t, 0.4, 0.48) * (1 - seg(t, 0.84, 0.9));
    g.line([-5, -0.6, 0.02], [5, -0.6, 0.02], { color: "brand", w: 3, dash: "12 10", op: zo, bias: -20 });
  } };

  SC.room = { cam: { yaw: 34, pitch: 34, S: 60, amp: 6 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.04, 0, 0.12);
    g.box(-2.4, -1.8, -0.1, 4.8, 3.6, 0.1, "paper", { op: a0 });
    g.box(-2.4, 1.7, 0, 4.8, 0.1, 2.2 * a0, "paper", { op: a0 });
    g.box(-2.4, -1.8, 0, 0.1, 3.5, 2.2 * a0, "paper", { op: a0 });
    for (var k = -2; k <= 2; k++) g.line([k, -1.8, 0.005], [k, 1.7, 0.005], { color: "soft", w: 1, op: a0 * 0.5, bias: 40 });
    var wa = ap(t, 0, 0.16, 0, 0.1);
    g.poly([[-2.28, -0.6, 0.9], [-2.28, 0.6, 0.9], [-2.28, 0.6, 1.8], [-2.28, -0.6, 1.8]], "sky", { op: wa, bias: -0.1 });
    var sw = lerp(-0.5, 0.6, seg(t, 0.3, 0.9));
    g.poly([[-2.3, -0.6, 0.01], [-2.3, 0.6, 0.01], [-0.4 + sw, 0.9 + sw * 0.5, 0.01], [-0.4 + sw, -0.9 + sw * 0.5, 0.01]], "zing", { flat: true, stroke: false, op: seg(t, 0.3, 0.38) * (1 - seg(t, 0.84, 0.9)) * 0.45, bias: 30 });
    var f = [ap(t, 0, 0.24, 0, 0.1), ap(t, 0, 0.3, 0, 0.1), ap(t, 0, 0.36, 0, 0.1), ap(t, 0, 0.42, 0, 0.1)];
    if (f[0] > 0) { g.box(0.2, 0.2, (1 - f[0]) * 1.5, 1.9, 1.4, 0.5, "paper", { op: f[0] }); g.box(1.6, 0.35, 0.5 + (1 - f[0]) * 1.5, 0.4, 1.1, 0.16, "sky", { op: f[0] }); }
    if (f[1] > 0) g.box(-1.9, 1.0, (1 - f[1]) * 1.5, 1.4, 0.6, 0.8, "wood", { op: f[1] });
    if (f[2] > 0) g.box(-1.4, 0.3, (1 - f[2]) * 1.5, 0.5, 0.5, 0.45, "zing", { op: f[2] });
    if (f[3] > 0) { g.cyl(-0.7, 1.3, 0.8 + (1 - f[3]) * 1.5, 0.08, 0.5, "paper", { op: f[3], seg: 8 }); g.dot([-0.7, 1.3, 1.45 + (1 - f[3]) * 1.5], 12, "zing", { op: f[3] }); }
  } };

  SC.maze = { cam: { yaw: 0, pitch: 62, S: 52, amp: 0 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.03, 0, 0.1);
    g.box(-5, -3.6, -0.1, 10, 7.2, 0.1, "foil", { op: a0 });
    var F = [[-3, -2.4, 1.2, 2.2, 0.8, "paper"], [-0.6, 0.4, 2.4, 1.0, 0.6, "sky"], [-3.4, 1.0, 1.6, 1.6, 0.5, "wood"], [1.8, -2.8, 1.0, 1.8, 0.9, "paper"], [2.4, 1.4, 1.4, 1.2, 0.5, "paper"]];
    F.forEach(function (b, i) { var a = ap(t, i, 0.06, 0.03, 0.1); if (a > 0) g.box(b[0], b[1], 0, b[2], b[3], b[4] * a, b[5]); });
    var path = [[-4.4, -3.0], [-4.3, -0.4], [-1.2, -0.3], [-1.0, -2.6], [1.2, -2.8], [1.3, 0.0], [4.2, 0.2], [4.3, 3.0]];
    var dense = [];
    for (var i = 0; i < path.length - 1; i++) for (var s = 0; s < 8; s++) dense.push([lerp(path[i][0], path[i + 1][0], s / 8), lerp(path[i][1], path[i + 1][1], s / 8), 0.02]);
    dense.push([path[path.length - 1][0], path[path.length - 1][1], 0.02]);
    var prog = eio(seg(t, 0.2, 0.8)), n = Math.max(2, Math.round(prog * (dense.length - 1)) + 1);
    g.path(dense.slice(0, n), { color: "brand", w: 3.5, dash: "8 8", op: seg(t, 0.18, 0.22), bias: -0.3 });
    var p = dense[n - 1];
    g.dot([p[0], p[1], 0.35], 18, "zing", { op: seg(t, 0.14, 0.2), bias: -5 });
    g.path([[p[0] - 0.2, p[1], 0.42], [p[0] + 0.2, p[1], 0.42]], { w: 4, op: seg(t, 0.14, 0.2), bias: -6 });
    var fa = ap(t, 0, 0.1, 0, 0.1);
    g.line([4.3, 3.0, 0], [4.3, 3.0, 1.1], { w: 2.4, op: fa });
    g.poly([[4.3, 3.0, 1.1], [4.9, 3.0, 0.9], [4.3, 3.0, 0.7]], "zing", { op: fa });
    var q = g.P([p[0], p[1], 0.9]);
    for (var k = 0; k < 2; k++) {
      var ph = frac(t * 5 + k / 2), o = (1 - ph) * seg(t, 0.22, 0.26) * (1 - seg(t, 0.8, 0.84));
      g.screen('<path d="M' + f1(q[0] + 14 + ph * 12) + ' ' + f1(q[1] - 18 - ph * 8) + ' a' + f1(10 + ph * 12) + ' ' + f1(10 + ph * 12) + ' 0 0 1 0 ' + f1(16 + ph * 14) + '" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="2.4" stroke-linecap="round" opacity="' + o.toFixed(3) + '"/>');
    }
  } };

  SC.charades = { cam: { yaw: 0, pitch: 4, S: 60, amp: 0 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.03, 0, 0.12);
    g.box(-4.6, 0, 0.4, 9.2, 0.12, 5.2 * a0, "paper", { op: a0 });
    g.line([-3, 0.2, 0.4], [-3.4, 0.4, -0.8], { w: 3, op: a0 }); g.line([3, 0.2, 0.4], [3.4, 0.4, -0.8], { w: 3, op: a0 });
    function stroke(pts, a, b, w, col) {
      var pr = seg(t, a, b);
      if (pr <= 0) return null;
      var n = Math.max(2, Math.round(pr * (pts.length - 1)) + 1);
      g.path(pts.slice(0, n), { w: w || 3.2, color: col, bias: -1 });
      return pts[n - 1];
    }
    var cx = -1.9, cz = 3.0, tips = [];
    tips.push(stroke(circlePts(cx, 0, 0, 1.5, 36).map(function (p) { return [p[0], -0.02, cz + p[1] - 0]; }), 0.12, 0.26));
    tips.push(stroke(circlePts(cx, 0, 0, 0.3, 16).map(function (p) { return [p[0], -0.02, cz + p[1]]; }), 0.26, 0.3));
    for (var k = 0; k < 8; k++) {
      var an = k / 8 * TAU;
      tips.push(stroke([[cx + 0.3 * Math.cos(an), -0.02, cz + 0.3 * Math.sin(an)], [cx + 1.5 * Math.cos(an), -0.02, cz + 1.5 * Math.sin(an)]], 0.3 + k * 0.02, 0.32 + k * 0.02));
    }
    var sp = [];
    for (var s = 0; s <= 40; s++) { var r = 0.45 + s / 40 * 0.9, an2 = s / 40 * TAU * 0.85; sp.push([cx + r * Math.cos(an2), -0.03, cz + r * Math.sin(an2)]); }
    tips.push(stroke(sp, 0.48, 0.56, 3, "brand"));
    tips.push(stroke([[0.8, -0.02, 1.2], [3.8, -0.02, 1.2]], 0.58, 0.62));
    tips.push(stroke([[1.4, -0.02, 1.2], [1.4, -0.02, 3.4]], 0.62, 0.66));
    tips.push(stroke([[1.4, -0.02, 3.4], [4.1, -0.02, 3.4]], 0.66, 0.72));
    tips.push(stroke([[1.4, -0.02, 3.8], [4.1, -0.02, 3.8]], 0.72, 0.74, 2, "brand"));
    var tip = null;
    tips.forEach(function (p) { if (p) tip = p; });
    if (tip && t < 0.8) g.dot([tip[0] + 0.12, -0.2, tip[2] - 0.12], 8, "zing", { bias: -5 });
  } };

  SC.park = { cam: { yaw: 22, pitch: 46, S: 52, amp: 5 }, draw: function (g, t) {
    g.box(-5, -3.6, -0.14, 10, 7.2, 0.14, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var green = seg(t, 0.14, 0.26);
    g.poly([[-5, -3.6, 0.001], [5, -3.6, 0.001], [5, 3.6, 0.001], [-5, 3.6, 0.001]], "zing", { flat: true, stroke: false, op: green * 0.45, bias: -0.2 });
    var pa = ap(t, 0, 0.22, 0, 0.14);
    if (pa > 0) g.poly(circlePts(-2.4, 1.3, 0.01, 1.4, 24).map(function (p) { return [p[0], -2.4 + (p[1] - -2.4) * 0.6 + 1.3 * 0.4 + 0.8, 0.01]; }), "water", { flat: true, op: pa, bias: -0.3 });
    var path = [];
    for (var x = -5; x <= 5.01; x += 0.25) path.push([x, -1.6 + 1.3 * Math.sin(x * 0.55), 0.02]);
    var pr = eio(seg(t, 0.26, 0.44)), n = Math.max(2, Math.round(pr * (path.length - 1)) + 1);
    if (pr > 0) { g.path(path.slice(0, n), { color: "line", w: 19, bias: -0.35 }); g.path(path.slice(0, n), { color: "paper", w: 15, bias: -0.4 }); }
    var trees = [[1.8, 1.6], [3.2, 0.6], [2.4, 2.6], [-3.8, -2.4], [0.2, 2.2], [3.8, 2.4], [-1.2, -2.8]];
    trees.forEach(function (p, i) {
      var a = back(seg(t, 0.36 + i * 0.03, 0.46 + i * 0.03));
      if (a <= 0) return;
      g.line([p[0], p[1], 0], [p[0], p[1], 0.5 * a], { w: 2.4 });
      g.dot([p[0], p[1], 0.7 * a], 18 * a, i % 3 ? "zing" : "sky");
    });
    [[0.6, -0.6], [-0.6, 0.8]].forEach(function (b, i) { var a = ap(t, i, 0.5, 0.03, 0.08); if (a > 0) g.box(b[0], b[1], 0, 0.9, 0.3, 0.25 * a, "wood"); });
    for (var pI = 0; pI < 3; pI++) {
      var ph = frac(t + pI / 3), idx = Math.floor(ph * (path.length - 1));
      var pp = path[idx];
      g.dot([pp[0], pp[1], 0.25], 7, pI === 1 ? "brand" : "paper", { op: seg(t, 0.46, 0.52) * (1 - seg(t, 0.84, 0.9)), bias: -2 });
    }
  } };

  SC.quake = { cam: { yaw: 30, pitch: 24, S: 66, amp: 6 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.03, 0, 0.1);
    var s1 = seg(t, 0.24, 0.26) * (1 - seg(t, 0.44, 0.48)), s2 = seg(t, 0.62, 0.64) * (1 - seg(t, 0.8, 0.84));
    var shake = Math.sin(t * TAU * 22) * (0.22 * s1 + 0.2 * s2);
    var braced = seg(t, 0.5, 0.58);
    var houseShake = shake * (1 - 0.85 * braced);
    var rock = 0.12 * Math.sin(t * TAU * 11) * s1;
    g.box(-2.6 + shake, -1.8, 0, 5.2, 3.6, 0.2, "foil", { op: a0 });
    g.box(-2.6 + shake, -1.8, 0.2, 5.2, 0.1, 0.35, "foil", { op: a0 });
    for (var i = 0; i < 9; i++) for (var j = 0; j < 5; j++) {
      var a = ap(t, i + j, 0.06, 0.008, 0.08);
      g.dot([-2.1 + i * 0.52 + shake * 1.3 + 0.05 * Math.sin(i + t * 80) * s1, -1.3 + j * 0.62, 0.36], 9, (i + j) % 4 ? "sky" : "zing", { op: a });
    }
    var ha = ap(t, 0, 0.12, 0, 0.1);
    var tf = function (p) { return rotY([p[0] + houseShake, p[1], p[2]], [houseShake, 0, 0.55], rock * (1 - braced)); };
    g.box(-1.5, -1.0, 0.55, 3.0, 2.0, 0.18, braced > 0 ? "zing" : "paper", { op: ha, tf: tf });
    g.box(-1.2, -0.8, 0.73, 2.4, 1.6, 1.3 * ha, "paper", { op: ha, tf: tf });
    if (ha > 0) gable(g, -1.2, -0.8, 2.03, 2.4, 1.6, 0.9, "sky", { op: ha, tf: tf });
    if (braced > 0) {
      [[-1.2, -0.8], [1.2, -0.8]].forEach(function (c) {
        g.line(tf([c[0], -0.82, 0.73]), tf([c[0] + (c[0] < 0 ? 1.0 : -1.0), -0.82, 2.0]), { color: "brand", w: 3, op: braced, bias: -1 });
      });
    }
    var so = s1 + s2;
    for (var k = 0; k < 2; k++) {
      var q = g.P([k ? 3.1 : -3.1, 0, 1.0]);
      g.screen('<path d="M' + f1(q[0]) + ' ' + f1(q[1] - 30) + ' l' + (k ? 10 : -10) + ' 10 l' + (k ? -10 : 10) + ' 10 l' + (k ? 10 : -10) + ' 10 l' + (k ? -10 : 10) + ' 10" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="' + clamp(so).toFixed(3) + '"/>');
    }
  } };

  /* ------------------------------------------------------------------ render */
  function render(svg, name, t, theme, frame) {
    var sc = SC[name];
    if (!sc) { svg.innerHTML = ""; return; }
    var T = THEMES[theme] || THEMES.light;
    frame = frame || {};
    var W = frame.w || 960, H = frame.h || 720;
    var k = (frame.scale || 1) * (W / 960);
    var cc = sc.cam;
    if (cc.at) { // optional per-frame camera overrides (pitch, z, cy, ...)
      var over = cc.at(t), key; cc = {};
      for (key in sc.cam) cc[key] = sc.cam[key];
      for (key in over) cc[key] = over[key];
    }
    var cam = {
      yaw: cc.yaw + (cc.spin ? cc.spin * t : (cc.amp || 0) * Math.sin(t * TAU)),
      pitch: cc.pitch,
      S: cc.S * k * (frame.zoom || 1) * (cc.z || 1.3),
      cx: (frame.cx !== undefined ? frame.cx : cc.cx !== undefined ? cc.cx : 0.5) * W, // cc.cx: a scene can pan sideways
      cy: (frame.cy !== undefined ? frame.cy : cc.cy !== undefined ? cc.cy : (cc.pitch > 60 ? 0.52 : 0.64)) * H,
      edge: 1.6 * k
    };
    var g = Ctx(cam, T);
    sc.draw(g, t);
    var env = sc.seamless ? 1 : clamp(t / 0.05) * clamp((1 - t) / 0.07); // seamless scenes loop without a fade
    var out = '<g opacity="' + env.toFixed(3) + '">' + g.out() + "</g>";
    // frost (glass theme): grey -> white, alpha = 1.045 * grey - 0.045 (x the drawn alpha); #FF6000 keeps its colour, opaque
    if (T.frost) out = '<defs><filter id="wl-frost" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '" color-interpolation-filters="sRGB">' +
      '<feColorMatrix type="matrix" values="0 0 0 0 1  -0.624 0 0.624 0 1  -1 0 1 0 1  1.5 0 -0.455 0 -0.045" result="m"/>' +
      '<feComposite in="m" in2="SourceGraphic" operator="in"/></filter></defs><g filter="url(#wl-frost)">' + out + "</g>";
    svg.innerHTML = out;
  }

  return {
    render: render,
    scenes: Object.keys(SC),
    THEMES: THEMES,
    // helpers and a hook so extra scene files (towers, hulls) can plug in
    U: { TAU: TAU, RAD: RAD, clamp: clamp, seg: seg, eo: eo, eio: eio, back: back, lerp: lerp, hash: hash, ap: ap, frac: frac,
         rotZ: rotZ, rotY: rotY, rotX: rotX, circlePts: circlePts, gable: gable, hull: hull, boxShadow: boxShadow, prismXZ: prismXZ, pose: pose },
    define: function (name, scene) { SC[name] = scene; return name; }
  };
})();

/* ---- airport/airport.js ---- */
;/* WonderLab airport challenge: the same 20 aircraft served by five terminal typologies.
 * For each plan the aircraft taxi in and park nose-in at a jet bridge, every walk from the
 * entrance to a gate is traced, and the longest walk is scored on the board along the bottom.
 * Underground train legs (dashed) don't count as walking. Shortest longest-walk wins.
 * Top view; the scene is a pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, clamp = U.clamp;
  var W = "#EDF3F6", Z = "#FF6000", SK = "#A8D8F0"; // Z: the WonderLab orange marks the shortest walk
  var TERM = [-1.3, -3.0, 2.6, 0.8], ENT = [0, -3.0], OUT = [0, -2.2]; // shared landside terminal + entrance
  var PL = 0.7, BRIDGE = 0.7;                                          // plane scale (wingspan 0.56), gate set-back from the building (nose stays ~0.45 clear)

  function gate(x, y, a) { return { p: [x, y], a: a }; } // a: outward direction from the building (plane nose points back along it)
  function W_(p) { return { p: p, train: false }; }
  function T_(p) { return { p: p, train: true }; }

  var L = [];
  // 1. linear: one long frontage
  (function () {
    var G = [];
    for (var i = 0; i < 20; i++) G.push(gate(-6.46 + i * 0.68, -1.15 + BRIDGE, Math.PI / 2)); // 0.68 apart: wingtips clear
    L.push({ struct: [[[-6.8, -1.15], [6.8, -1.15]], [OUT, [0, -1.15]]], gates: G,
      via: function (q) { return [W_(OUT), W_([0, -1.15]), W_([q.p[0], -1.15])]; } });
  })();
  // 2. curvilinear: frontage bent into an arc, reached from its crown
  (function () {
    var G = [], cy = -1.9, R = 3.65, a0 = 176 * RAD, a1 = 4 * RAD, arc = [], i; // stands ~0.69 apart: wingtips clear
    for (i = 0; i < 20; i++) { var an = lerp(a0, a1, i / 19); G.push(gate(Math.cos(an) * (R + BRIDGE), cy + Math.sin(an) * (R + BRIDGE), an)); }
    for (i = 0; i <= 40; i++) { var b = lerp(179.5 * RAD, 0.5 * RAD, i / 40); arc.push([Math.cos(b) * R, cy + Math.sin(b) * R]); }
    L.push({ struct: [arc, [OUT, [0, cy + R]]], gates: G,
      via: function (q) {
        var an = Math.atan2(q.p[1] - cy, q.p[0]), out = [W_(OUT), W_([0, cy + R])];
        for (var k = 1; k <= 10; k++) { var b = lerp(90 * RAD, an, k / 10); out.push(W_([Math.cos(b) * R, cy + Math.sin(b) * R])); }
        return out;
      } });
  })();
  // 3. piers: two fingers off a cross hall, gates both sides
  (function () {
    var G = [], px = [-1.9, 1.9], i, k;
    for (i = 0; i < 2; i++) for (k = 0; k < 5; k++) {
      G.push(gate(px[i] - BRIDGE, -0.9 + k * 0.78, Math.PI));
      G.push(gate(px[i] + BRIDGE, -0.9 + k * 0.78, 0));
    }
    L.push({ struct: [[OUT, [0, -1.75]], [[-1.9, -1.75], [1.9, -1.75]], [[px[0], -1.75], [px[0], 2.5]], [[px[1], -1.75], [px[1], 2.5]]], gates: G,
      via: function (q) { var pr = q.p[0] < 0 ? px[0] : px[1]; return [W_(OUT), W_([0, -1.75]), W_([pr, -1.75]), W_([pr, q.p[1]])]; } });
  })();
  // 4. satellites: two round airside buildings reached by underground train
  (function () {
    var C = [[-2.25, 0.75], [2.25, 0.75]], R = 1.0, G = [];
    C.forEach(function (c) { for (var k = 0; k < 10; k++) { var an = (-72 + k * 36) * RAD; G.push(gate(c[0] + (R + BRIDGE) * Math.cos(an), c[1] + (R + BRIDGE) * Math.sin(an), an)); } });
    var circ = function (c) { var o = []; for (var k = 0; k <= 36; k++) { var a = k / 36 * TAU; o.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]); } return o; };
    L.push({ struct: [circ(C[0]), circ(C[1])], trains: [[OUT, [C[0][0], C[0][1] - R]], [OUT, [C[1][0], C[1][1] - R]]], gates: G,
      via: function (q) {
        var c = q.p[0] < 0 ? C[0] : C[1], an = Math.atan2(q.p[1] - c[1], q.p[0] - c[0]), d = an + 90 * RAD;
        while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
        var out = [W_(OUT), T_([c[0], c[1] - R])];
        for (var k = 1; k <= 8; k++) { var b = -90 * RAD + d * k / 8; out.push(W_([c[0] + R * Math.cos(b), c[1] + R * Math.sin(b)])); }
        return out;
      } });
  })();
  // 5. midfield concourses: two parallel buildings on the apron, linked by underground train
  (function () {
    var ys = [-0.4, 2.05], xs = [-2.4, -1.2, 0, 1.2, 2.4], G = [];
    ys.forEach(function (y) { xs.forEach(function (x) { G.push(gate(x, y - BRIDGE, -Math.PI / 2)); G.push(gate(x, y + BRIDGE, Math.PI / 2)); }); });
    L.push({ struct: [[[-2.9, ys[0]], [2.9, ys[0]]], [[-2.9, ys[1]], [2.9, ys[1]]]], trains: [[OUT, [0, ys[1]]]], gates: G,
      via: function (q) {
        var y = Math.abs(q.p[1] - ys[0]) < 1 ? ys[0] : ys[1];
        return [W_(OUT), T_([0, y]), W_([q.p[0], y])];
      } });
  })();

  // jet bridge: from the building face, angled to the forward left door (behind the nose, which stays clear)
  function bridge(q) {
    var u = [-Math.cos(q.a), -Math.sin(q.a)], sd = [-u[1], u[0]];
    return { u: u,
      root: [q.p[0] + u[0] * BRIDGE + sd[0] * 0.2, q.p[1] + u[1] * BRIDGE + sd[1] * 0.2],
      door: [q.p[0] + u[0] * 0.17 * PL + sd[0] * 0.05, q.p[1] + u[1] * 0.17 * PL + sd[1] * 0.05] };
  }

  // full route for a gate: entrance -> ... -> along the jet bridge to the aircraft door
  L.forEach(function (l) {
    l.routes = l.gates.map(function (q) {
      var br = bridge(q);
      var pts = [W_(ENT)].concat(l.via(q), [W_(br.root), W_(br.door)]);
      var legs = [], total = 0, walk = 0;
      for (var m = 1; m < pts.length; m++) {
        var d = Math.hypot(pts[m].p[0] - pts[m - 1].p[0], pts[m].p[1] - pts[m - 1].p[1]);
        legs.push(d); total += d; if (!pts[m].train) walk += d;
      }
      return { pts: pts, legs: legs, total: total, walk: walk };
    });
    l.worst = 0; l.worstI = 0;
    l.routes.forEach(function (r, i) { if (r.walk > l.worst) { l.worst = r.walk; l.worstI = i; } });
    // bounds for the scoreboard thumbnail
    var xs = [], ys = [];
    l.struct.concat(l.trains || []).forEach(function (ln) { ln.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
    l.gates.forEach(function (q) { xs.push(q.p[0]); ys.push(q.p[1]); });
    xs.push(TERM[0], TERM[0] + TERM[2]); ys.push(TERM[1]);
    l.bb = [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)];
  });
  var WORST = Math.max.apply(null, L.map(function (l) { return l.worst; }));
  var BEST = 0; L.forEach(function (l, i) { if (l.worst < L[BEST].worst) BEST = i; });

  // point at distance `want` along a route; returns the partial polyline split into walk / train runs
  function partial(r, want) {
    var runs = [], cur = { train: r.pts[1].train, pts: [r.pts[0].p] }, acc = 0;
    for (var m = 1; m < r.pts.length; m++) {
      var nx = r.pts[m];
      if (nx.train !== cur.train) { runs.push(cur); cur = { train: nx.train, pts: [r.pts[m - 1].p] }; }
      if (acc + r.legs[m - 1] <= want) { cur.pts.push(nx.p); acc += r.legs[m - 1]; }
      else { var fr = (want - acc) / r.legs[m - 1]; cur.pts.push([lerp(r.pts[m - 1].p[0], nx.p[0], fr), lerp(r.pts[m - 1].p[1], nx.p[1], fr)]); runs.push(cur); return { runs: runs, end: cur.pts[cur.pts.length - 1] }; }
    }
    runs.push(cur);
    return { runs: runs, end: cur.pts[cur.pts.length - 1] };
  }
  function z0(p) { return [p[0], p[1], 0]; }

  function drawPlane(g, x, y, u, op) {
    function P2(fw, sw) { return [x + (u[0] * fw - u[1] * sw) * PL, y + (u[1] * fw + u[0] * sw) * PL, 0]; }
    g.path([P2(-0.34, 0), P2(0.36, 0)], { color: SK, w: 3.2, op: op });
    g.path([P2(-0.1, 0.4), P2(0.08, 0), P2(-0.1, -0.4)], { color: SK, w: 2.2, op: op });
    g.path([P2(-0.34, 0.16), P2(-0.26, 0), P2(-0.34, -0.16)], { color: SK, w: 1.6, op: op });
  }

  function drawPlan(g, l, op, k, cx, cy) { // k = scale, (cx, cy) = placement; used for the main plan and the thumbnails
    if (op <= 0.01) return;
    var tf = function (p) { return [cx + p[0] * k, cy + p[1] * k, 0]; };
    var w = k < 0.5 ? 1.2 : 2.6;
    l.struct.forEach(function (ln) { g.path(ln.map(tf), { color: W, w: w, op: op }); });
    (l.trains || []).forEach(function (ln) { g.path(ln.map(tf), { color: W, w: k < 0.5 ? 1 : 1.6, dash: k < 0.5 ? "3 3" : "7 7", op: op * 0.8 }); });
    var T = TERM;
    g.path([tf([T[0], T[1]]), tf([T[0] + T[2], T[1]]), tf([T[0] + T[2], T[1] + T[3]]), tf([T[0], T[1] + T[3]])], { closed: true, color: W, w: k < 0.5 ? 1 : 2.2, fill: "rgba(237,243,246,0.10)", op: op });
  }

  WL.define("airport", { cam: { yaw: 0, pitch: 90, S: 60, amp: 0, z: 1 }, draw: function (g, t) {
    // one slot per plan, then a results slot where the board moves up and the winner lights up
    var N = L.length, slot = clamp(t, 0, 0.99999) * (N + 1), idx = Math.floor(slot), f = slot - idx, l = L[idx];
    if (idx < N) drawOne(g, l, f);
    var move = idx === N ? eio(seg(f, 0, 0.25)) : 0, final = idx === N ? seg(f, 0.22, 0.36) : 0;

    board(g, idx, f, move, final);
  } });

  function drawOne(g, l, f) {
    var planOp = eo(seg(f, 0, 0.1)) * (1 - seg(f, 0.9, 1));
    // --- plan, entrance
    drawPlan(g, l, planOp, 1, 0, 0);
    g.dot(z0(ENT), 8, Z, { stroke: false, op: planOp });

    // --- aircraft taxi in nose-first and park at their jet bridges
    l.gates.forEach(function (q, i) {
      var u = [-Math.cos(q.a), -Math.sin(q.a)], a = eio(seg(f, 0.06 + i * 0.009, 0.2 + i * 0.009));
      if (a <= 0) return;
      var back = 2.2 * (1 - a);
      drawPlane(g, q.p[0] - u[0] * back, q.p[1] - u[1] * back, u, Math.min(1, a * 2) * planOp);
      var bo = seg(f, 0.2 + i * 0.009, 0.24 + i * 0.009) * planOp, br = bridge(q); // bridge extends once the aircraft has stopped
      if (bo > 0) g.line(z0(br.root), z0([lerp(br.root[0], br.door[0], bo), lerp(br.root[1], br.door[1], bo)]), { color: W, w: 2, op: bo });
    });

    // --- every walk from the entrance, then the longest one
    var walkT = seg(f, 0.4, 0.62), hi = seg(f, 0.64, 0.68);
    l.routes.forEach(function (r, i) {
      var reach = clamp(walkT * 1.6 - i * 0.03);
      if (reach <= 0 || i === l.worstI && hi > 0) return;
      partial(r, r.total * eo(reach)).runs.forEach(function (run) {
        g.path(run.pts.map(z0), { color: Z, w: 1.6, dash: run.train ? "4 6" : null, op: planOp * lerp(0.75, 0.28, hi), bias: -2 });
      });
    });
    if (hi > 0) {
      var r = l.routes[l.worstI], pr = partial(r, r.total * seg(f, 0.64, 0.8));
      partial(r, r.total).runs.forEach(function (run) {
        g.path(run.pts.map(z0), { color: Z, w: run.train ? 2 : 3.6, dash: run.train ? "6 6" : null, op: planOp * hi, bias: -3 });
      });
      g.dot(z0(pr.end), 7, W, { stroke: false, op: planOp * hi, bias: -4 }); // passenger walking the longest route
    }

  }

  // --- scoreboard: one cell per typology, thumbnail + longest-walk bar (same scale for all)
  function board(g, idx, f, move, final) {
    var N = L.length, cellW = 2.3, gap = 0.35, x0 = -((N - 1) * (cellW + gap)) / 2;
    var yT = lerp(-4.35, 0.9, move), yB = lerp(-5.2, -0.75, move), th = lerp(1.05, 2.1, move);
    L.forEach(function (m, k) {
      var cx = x0 + k * (cellW + gap), done = k < idx ? 1 : k === idx ? eio(seg(f, 0.66, 0.82)) : 0;
      var active = k === idx, bw = m.bb[2] - m.bb[0], bh = m.bb[3] - m.bb[1], sc = Math.min(cellW / bw, th / bh);
      var thumbOp = active ? 0.95 : k < idx ? 0.55 : 0.2;
      if (final) thumbOp = lerp(thumbOp, k === BEST ? 0.95 : 0.35, final);
      drawPlan(g, m, thumbOp, sc, cx - (m.bb[0] + bw / 2) * sc, yT - (m.bb[1] + bh / 2) * sc);
      m.gates.forEach(function (q) { g.dot([cx + (q.p[0] - m.bb[0] - bw / 2) * sc, yT + (q.p[1] - m.bb[1] - bh / 2) * sc, 0], 1.3, SK, { stroke: false, op: thumbOp }); });
      g.line([cx - cellW / 2, yB, 0], [cx + cellW / 2, yB, 0], { color: W, w: 1.4, op: 0.18 });
      if (done > 0) {
        var len = cellW * m.worst / WORST * done, win = final * (k === BEST ? 1 : 0);
        var col = active || win ? Z : W, bo = active ? 1 : lerp(0.55, k === BEST ? 1 : 0.3, final);
        g.line([cx - cellW / 2, yB, 0], [cx - cellW / 2 + len, yB, 0], { color: k === BEST && final ? Z : col, w: 5, op: bo });
        g.dot([cx - cellW / 2 + len, yB, 0], 4.5, k === BEST && final ? Z : col, { stroke: false, op: bo });
      }
    });
  }
})();

/* ---- bench/bench.js ---- */
;/* WonderLab "The Bench for Everyone" challenge (no course photo: from the brief). Act it out, 6 s.
 * A plain park bench with a skate-stopper (a curb block under the seat that sticks up above it like an armrest).
 * 1. A toddler walks up and can't climb on (too high).
 * 2. A grandparent with a cane sits, then struggles to get up (no back, nothing to push on).
 * 3. A skateboarder ollies onto the seat edge and grinds it; at 0:04 the board hits the stopper, flips away and the
 *    rider falls forward onto the ground.
 * 4. The bench dims and a lightbulb shines above it: a better design is possible.
 * World units are metres, bench along x, the users on its front (-y) side. Pure function of t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back, rotY = U.rotY;
  var OR = "#FF6000"; // WonderLab orange: the lightbulb

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }

  var DUR = 6, HIT = 4 / DUR;                                   // the board hits the stopper at 0:04
  var TOD = [0.03, 0.26], GRA = [0.26, 0.5], SKA = [0.5, 0.8], BULB = [0.78, 1];
  var FY = -0.55;                                              // where people stand, in front of the bench
  var STOP = [0.45, 0.55];                                     // skate-stopper: x range; it stands 0..0.62, the seat is at 0.46

  // ---- stick figures: joints { hip, kL, kR, fL, fR, sh, hL, hR, head }, height h
  function lerpJ(A, B, k) { var o = {}; for (var n in A) o[n] = l3(A[n], B[n], k); return o; }
  function mapJ(A, f) { var o = {}; for (var n in A) o[n] = f(A[n]); return o; }
  function stand(x, y, h, ph, dir) { // walking / standing, facing along x by dir (+1 / -1)
    var s = 0.12 * h * Math.sin(ph), up = 0.04 * h;
    var fL = [x + dir * s, y - 0.05 * h, up * Math.max(0, Math.sin(ph))], fR = [x - dir * s, y + 0.05 * h, up * Math.max(0, -Math.sin(ph))];
    var hip = [x, y, 0.53 * h - 0.01 * h * Math.abs(Math.sin(ph))];
    return { hip: hip, fL: fL, fR: fR,
      kL: add(l3(hip, fL, 0.5), [dir * 0.03 * h, 0, 0]), kR: add(l3(hip, fR, 0.5), [dir * 0.03 * h, 0, 0]),
      sh: [x + dir * 0.02 * h, y, 0.82 * h], hL: [x - dir * s * 0.7, y - 0.13 * h, 0.5 * h], hR: [x + dir * s * 0.7, y + 0.13 * h, 0.5 * h],
      head: [x + dir * 0.02 * h, y, 0.94 * h] };
  }
  function sit(x, y, z, h) { // sitting on a seat at height z, facing -y
    var hip = [x, y, z + 0.03], sh = [x, y, z + 0.33 * h], kz = z + 0.04, fz = Math.max(0, kz - 0.25 * h);
    return { hip: hip, kL: [x - 0.08 * h, y - 0.25 * h, kz], kR: [x + 0.08 * h, y - 0.25 * h, kz],
      fL: [x - 0.09 * h, y - 0.28 * h, fz], fR: [x + 0.09 * h, y - 0.28 * h, fz], sh: sh,
      hL: [x - 0.14 * h, y - 0.12 * h, z + 0.1 * h], hR: [x + 0.14 * h, y - 0.12 * h, z + 0.1 * h], head: add(sh, [0, 0, 0.13 * h]) };
  }
  function body(g, P, h, op) {
    var o = { w: h > 1.2 ? 4.2 : 3.2, mat: "zing", op: op, bias: -0.3 };
    [["hip", "kL"], ["kL", "fL"], ["hip", "kR"], ["kR", "fR"], ["hip", "sh"], ["sh", "hL"], ["sh", "hR"]].forEach(function (b) { g.tube(P[b[0]], P[b[1]], o); });
    g.dot(P.head, 0.095 * h * g.S, "zing", { op: op, bias: -0.35 });
  }
  function board(g, c, op, tilt, roll) { // skateboard, nose towards -x; tilt pitches the nose up, roll flips it about its length
    var L = 0.42, W = 0.1, pts = [], cr = Math.cos(roll || 0), sr = Math.sin(roll || 0);
    function P(dx, dy, dz) { var y = dy * cr - dz * sr, z = dy * sr + dz * cr; return [c[0] + dx, c[1] + y, c[2] + 0.07 + z - dx * (tilt || 0)]; }
    [[-L, -W], [L, -W], [L, W], [-L, W]].forEach(function (q) { pts.push(P(q[0], q[1], 0)); });
    g.poly(pts, "ink", { w: 1.6, op: op, bias: -0.2 });
    [-0.28, 0.28].forEach(function (dx) { g.dot(P(dx, -W, -0.04), 3.2, "paper", { op: op, bias: -0.25 }); });
  }
  function sparks(g, p, k, op) {
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI + 0.3 + U.hash(Math.floor(k * 40) + i) * 0.6, r = 0.12 + 0.12 * U.hash(i * 3 + Math.floor(k * 40));
      g.line(add(p, [0.05, -0.02, 0.02]), add(p, [0.05 + r * Math.cos(a), -0.06, 0.02 + r * Math.sin(a) * 0.7]), { color: g.T.mats.zing, w: 1.4, op: op, bias: -0.4 });
    }
  }

  // ---- the plain bench: one slab on two legs, no back, no arms, and the skate-stopper sticking up through it
  function bench(g, op) {
    if (op <= 0.01) return;
    g.box(-1.6, -0.25, 0.4, 3.2, 0.5, 0.06, "wood", { op: op, cull: true });
    [-1.35, 1.27].forEach(function (x) { g.box(x, -0.22, 0, 0.08, 0.44, 0.4, "wood", { op: op, cull: true, bias: 0.1 }); });
    g.box(STOP[0], -0.27, 0, STOP[1] - STOP[0], 0.54, 0.62, "paper", { op: op, cull: true, bias: -0.02 });
  }

  // ---- the idea: a lightbulb shining above the bench (screen overlay)
  function bulb(g, t) {
    var a = back(seg(t, BULB[0], BULB[0] + 0.05)), on = seg(t, BULB[0] + 0.04, BULB[0] + 0.08);
    if (a <= 0) return;
    var q = g.P([0, 0, 1.9]), x = q[0], y = q[1], r = 58 * a, T = g.T, svg = "";
    var pulse = 0.85 + 0.15 * Math.sin(t * DUR * TAU * 1.6);
    [2.6, 2.0, 1.5].forEach(function (k, i) { svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * k * pulse).toFixed(1) + '" fill="' + OR + '" opacity="' + (on * 0.08 * (i + 1)).toFixed(3) + '"/>'; });
    for (var i = 0; i < 12; i++) { // rays
      var an = i / 12 * TAU, r0 = r * 1.45, r1 = r * (1.85 + 0.25 * pulse);
      svg += '<path d="M' + (x + r0 * Math.cos(an)).toFixed(1) + " " + (y + r0 * Math.sin(an)).toFixed(1) + "L" + (x + r1 * Math.cos(an)).toFixed(1) + " " + (y + r1 * Math.sin(an)).toFixed(1) +
        '" stroke="' + OR + '" stroke-width="4" stroke-linecap="round" opacity="' + on.toFixed(3) + '"/>';
    }
    svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + OR + '" stroke="' + T.line + '" stroke-width="2.5"/>';
    // filament, neck and screw base
    svg += '<path d="M' + (x - r * 0.3).toFixed(1) + " " + (y + r * 0.2).toFixed(1) + "l" + (r * 0.15).toFixed(1) + " " + (-r * 0.3).toFixed(1) + "l" + (r * 0.15).toFixed(1) + " " + (r * 0.3).toFixed(1) +
      "l" + (r * 0.15).toFixed(1) + " " + (-r * 0.3).toFixed(1) + "l" + (r * 0.15).toFixed(1) + " " + (r * 0.3).toFixed(1) + '" fill="none" stroke="' + T.mats.zing + '" stroke-width="2.4" stroke-linejoin="round"/>';
    svg += '<path d="M' + (x - r * 0.42).toFixed(1) + " " + (y + r * 0.88).toFixed(1) + "L" + (x - r * 0.36).toFixed(1) + " " + (y + r * 1.32).toFixed(1) + "H" + (x + r * 0.36).toFixed(1) + "L" + (x + r * 0.42).toFixed(1) + " " + (y + r * 0.88).toFixed(1) +
      'Z" fill="' + T.mats.paper + '" stroke="' + T.line + '" stroke-width="2.5" stroke-linejoin="round"/>';
    [1.03, 1.17].forEach(function (k) { svg += '<path d="M' + (x - r * 0.38).toFixed(1) + " " + (y + r * k).toFixed(1) + "H" + (x + r * 0.38).toFixed(1) + '" stroke="' + T.line + '" stroke-width="2"/>'; });
    g.screen('<g opacity="' + Math.min(1, a).toFixed(3) + '">' + svg + "</g>");
  }

  WL.define("bench", {
    cam: { yaw: 18, pitch: 16, S: 56, amp: 3, z: 2.85, cy: 0.8 },
    draw: function (g, t) {
      g.grid(5, 1);
      var dim = 1 - 0.55 * seg(t, BULB[0], BULB[0] + 0.06);
      bench(g, eo(seg(t, 0.0, 0.03)) * dim);

      // toddler: walks up, reaches for the seat, bounces twice, can't get on
      var u = seg(t, TOD[0], TOD[1]);
      if (u > 0 && u < 1) {
        var hT = 0.85, op = eo(seg(u, 0, 0.08)) * (1 - seg(u, 0.9, 1)), walk = eio(seg(u, 0, 0.4));
        var P = stand(lerp(-3.0, -0.6, walk), FY, hT, walk * 14, 1);
        if (u > 0.4) {
          var b = seg(u, 0.45, 0.88), hop = 0.12 * Math.abs(Math.sin(b * Math.PI * 2)), x2 = -0.6;
          var R = { hip: [x2, -0.42, 0.45 + hop], kL: [x2 - 0.06, -0.48, 0.25 + hop], kR: [x2 + 0.06, -0.48, 0.25 + hop],
            fL: [x2 - 0.06, -0.46, hop * 0.6], fR: [x2 + 0.06, -0.46, hop * 0.6], sh: [x2, -0.36, 0.7 + hop],
            hL: [x2 - 0.12, -0.27, 0.47], hR: [x2 + 0.12, -0.27, 0.47], head: [x2, -0.36, 0.8 + hop] };
          P = lerpJ(P, R, eio(seg(u, 0.4, 0.48)));
        }
        body(g, P, hT, op);
      }

      // grandparent: shuffles in with a cane, sits, tries to stand twice and sinks back
      u = seg(t, GRA[0], GRA[1]);
      if (u > 0 && u < 1) {
        var hG = 1.62, opG = eo(seg(u, 0, 0.08)) * (1 - seg(u, 0.9, 1)), wk = eio(seg(u, 0, 0.35)), xg = lerp(-3.0, -0.5, wk);
        var PG = stand(xg, FY - 0.05, hG, wk * 10, 1), seated = sit(-0.5, -0.08, 0.46, hG);
        var down = eio(seg(u, 0.35, 0.5));
        if (down > 0) PG = lerpJ(PG, seated, down);
        if (u > 0.5) { // push up, fail, push up, fail
          var tr = Math.max(0, Math.sin(seg(u, 0.55, 0.88) * Math.PI * 2)) * 0.12;
          PG = lerpJ(PG, { hip: add(seated.hip, [0, -0.08, tr]), kL: seated.kL, kR: seated.kR, fL: seated.fL, fR: seated.fR,
            sh: add(seated.sh, [0, -0.28, tr - 0.06]), hL: [seated.hL[0], -0.24, 0.47], hR: [seated.hR[0], -0.24, 0.47], head: add(seated.head, [0, -0.32, tr - 0.08]) }, Math.min(1, tr / 0.12 + 0.2));
        }
        body(g, PG, hG, opG);
        var hand = PG.hR;
        g.line(hand, [hand[0] + 0.05, hand[1] - 0.12, 0], { color: g.T.line, w: 2.2, op: opG, bias: -0.32 }); // cane
      }

      // skateboarder: rolls in, ollies onto the seat edge, grinds towards the stopper, hits it at 0:04 and falls
      u = seg(t, SKA[0], SKA[1]);
      if (u > 0 && u < 1) {
        var hS = 1.7, opS = eo(seg(u, 0, 0.06)) * (1 - seg(u, 0.9, 1)) * dim;
        var uHit = (HIT - SKA[0]) / (SKA[1] - SKA[0]);
        var roll = seg(u, 0, 0.22), oll = seg(u, 0.22, 0.33), grind = seg(u, 0.33, uHit), fall = eio(seg(u, uHit, uHit + 0.25));
        var X_HIT = STOP[1] + 0.42; // board nose meets the stopper
        var bx = lerp(3.6, 1.9, roll), bz = 0, by = FY + 0.2;
        if (oll > 0) { bx = lerp(1.9, 1.5, oll); bz = lerp(0, 0.46, eo(oll)) + 0.25 * Math.sin(Math.PI * oll); by = lerp(by, -0.25, oll); }
        if (grind > 0) { bx = lerp(1.5, X_HIT, grind); bz = 0.46; by = -0.25; }
        var tilt = oll > 0 && oll < 1 ? 0.35 * Math.sin(Math.PI * oll) : 0;
        var crouch = 0.08 * (oll > 0 && oll < 1 ? Math.sin(Math.PI * oll) : 0) + 0.04, base = [bx, by, bz + 0.08];
        var PS = { hip: add(base, [0.03, 0, 0.5 * hS - crouch * hS]), kL: add(base, [-0.18, 0, 0.26 * hS - crouch * hS * 0.5]), kR: add(base, [0.2, 0, 0.26 * hS - crouch * hS * 0.5]),
          fL: add(base, [-0.22, 0, 0]), fR: add(base, [0.22, 0, 0]), sh: add(base, [0.08, 0, 0.8 * hS - crouch * hS]),
          hL: add(base, [-0.42, 0.05, 0.62 * hS]), hR: add(base, [0.5, -0.05, 0.58 * hS]), head: add(base, [0.1, 0, 0.92 * hS - crouch * hS]) };
        if (fall > 0) {
          // the board stops dead and flips away; the rider pitches forward over the stopper and lands flat in front
          var piv = [X_HIT, -0.25, 0.54], ang = -1.5 * fall, land = [lerp(0, -1.15, fall), lerp(0, -0.35, fall), 0];
          PS = mapJ(PS, function (p) { var q = add(rotY(p, piv, ang), land); q[2] = Math.max(0.04, q[2] - 0.5 * fall * fall); return q; });
          board(g, [lerp(X_HIT, X_HIT + 0.6, fall), lerp(-0.25, -0.6, fall), 0.46 * (1 - fall) + 0.35 * Math.sin(Math.PI * fall)], opS, 0, fall * TAU * 0.75);
        } else board(g, [bx, by, bz], opS, tilt, 0);
        body(g, PS, hS, opS);
        if (grind > 0 && grind < 1) sparks(g, [bx - 0.4, -0.27, 0.46], grind, opS);
        var bang = seg(u, uHit, uHit + 0.08); // impact burst at the stopper
        if (bang > 0 && bang < 1) {
          var c = [STOP[1], -0.28, 0.56];
          for (var k = 0; k < 8; k++) { var an = k / 8 * TAU, r0 = 0.08 + 0.1 * bang, r1 = r0 + 0.14; g.line(add(c, [r0 * Math.cos(an), 0, r0 * Math.sin(an)]), add(c, [r1 * Math.cos(an), 0, r1 * Math.sin(an)]), { color: g.T.mats.zing, w: 2, op: 1 - bang, bias: -0.5 }); }
        }
      }

      // ---- ending: the bench dims, a lightbulb shines above it
      bulb(g, t);
    }
  });
})();

/* ---- chair/chair.js ---- */
;/* WonderLab cardboard chair (Courses/7/IMG_4589): "5 easy pieces, one awesome chair".
 * Three scored panels and two profile ribs, all with edge slots, lie flat. The panels fold along their score lines,
 * the ribs stand up, and each folded panel slides onto the ribs until its slots lock into theirs. The slotted
 * joints make the whole thing stiff: a weight lands on the seat and it barely moves.
 * Profile coordinates (px = depth from the front, pz = height); the chair spans y = -W..W. Pure function of t.
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, clamp = U.clamp, back = U.back;

  var OR = "#FF6000"; // WonderLab orange accent
  var X0 = -0.85, W = 0.9, TH = 0.05, RY = 0.45; // chair origin, half width, board thickness, rib planes (inset under the panels)
  var SL = 0.08, SW = 0.04, TAB = 0.08;          // slot half-length / half-width, how far a rib tab stands out of its edge

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }

  // rib profile (clockwise in px/pz): front, seat, backrest, top, rear upper, rear lower, back foot, arch, front foot
  var PROF = [[0, 0], [0, 1.0], [1.05, 0.85], [1.45, 2.15], [1.75, 2.1], [1.5, 0.95], [1.65, 0], [1.1, 0], [0.92, 0.36], [0.3, 0.36], [0.22, 0]];
  // the three panels wrap consecutive runs of the outline (vertex index chains)
  var PANELS = [
    { chain: [0, 1, 2, 3], pad: [-1.0, -2.3] },  // front + seat + backrest (the big one, two score lines)
    { chain: [3, 4, 5], pad: [2.35, -2.3] },     // top + rear upper (the small one, one score line)
    { chain: [5, 6, 7, 8], pad: [2.55, 0.2] }    // rear lower + back foot + arch (two score lines)
  ];
  var RIBS = [{ pad: [-2.9, 0.8], y: -RY }, { pad: [-0.6, 0.8], y: RY }];
  var SEQ = [[0.42, 0.5, 0.56], [0.52, 0.6, 0.66], [0.62, 0.7, 0.76]]; // per panel: fly start, slide start, slide end

  var pcx = 0.875, pcz = 1.075; // profile centre
  function outward(a, b) { var dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); return [-dz / L, dx / L]; } // clockwise outline
  function P3(px, y, pz) { return [X0 + px, y, pz]; }

  // assembled faces + flat layout for each panel
  PANELS.forEach(function (pn) {
    pn.faces = []; var u = 0, C = [0, 0, 0], cnt = 0;
    for (var k = 0; k < pn.chain.length - 1; k++) {
      var a = PROF[pn.chain[k]], b = PROF[pn.chain[k + 1]], n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1]), o = TH / 2;
      var A = [P3(a[0] + n[0] * o, -W, a[1] + n[1] * o), P3(b[0] + n[0] * o, -W, b[1] + n[1] * o), P3(b[0] + n[0] * o, W, b[1] + n[1] * o), P3(a[0] + n[0] * o, W, a[1] + n[1] * o)];
      pn.faces.push({ A: A, u0: u, u1: u + L, n: n, a: a, b: b, L: L, slots: L > 0.6 ? [0.28, 0.72] : [0.5] });
      A.forEach(function (p) { C = add(C, p); cnt++; });
      u += L;
    }
    pn.len = u; pn.C = mul(C, 1 / cnt);
    var nx = 0, nz = 0; pn.faces.forEach(function (f) { nx += f.n[0]; nz += f.n[1]; });
    var nl = Math.hypot(nx, nz); pn.out = [nx / nl, 0, nz / nl];
    pn.faces.forEach(function (f) {
      var x0 = pn.pad[0] - pn.len / 2, y0 = pn.pad[1];
      f.F = [[x0 + f.u0, y0 - W, 0.012], [x0 + f.u1, y0 - W, 0.012], [x0 + f.u1, y0 + W, 0.012], [x0 + f.u0, y0 + W, 0.012]];
      f.P1 = f.A.map(function (p) { return add(p, [pn.pad[0] - pn.C[0], pn.pad[1] - pn.C[1], 0.25]); });   // folded, still over its pad
      f.P2 = f.A.map(function (p) { return add(p, add(mul(pn.out, 0.75), [0, 0, 0.15])); });               // lined up outside the ribs
    });
  });

  function drawBoard(g, pts, op, bias) { g.poly(pts, "wood", { op: op, w: 1.4, bias: bias || 0 }); }
  // the camera looks from the -y side, so parts are layered by y (LAYER per unit) to let the inset ribs tuck in under
  // the panels: each panel face is drawn as three strips split on the rib lines
  var LAYER = 2;
  function drawPanelFace(g, pts, op) {
    var at = function (s, y) { return l3(l3(pts[0], pts[1], s), l3(pts[3], pts[2], s), (y + W) / (2 * W)); };
    [[-W, -RY], [-RY, RY], [RY, W]].forEach(function (yy) {
      var b = LAYER * (yy[0] + yy[1]) / 2, q = [at(0, yy[0]), at(1, yy[0]), at(1, yy[1]), at(0, yy[1])], o = { w: 1.4, op: op, bias: b - 0.002 };
      g.poly(q, "wood", { op: op, stroke: false, bias: b });
      g.path([q[0], q[3]], o); g.path([q[1], q[2]], o);
      if (yy[0] === -W) g.path([q[0], q[1]], o);
      if (yy[1] === W) g.path([q[3], q[2]], o);
    });
  }

  // classic weight: tapered block with a ring handle on top
  function weight(g, c, s) {
    var b = 0.36 * s, tp = 0.24 * s, h = 0.42 * s, lo = [], hi = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { lo.push([c[0] + q[0] * b, c[1] + q[1] * b, c[2]]); hi.push([c[0] + q[0] * tp, c[1] + q[1] * tp, c[2] + h]); });
    for (var i = 0; i < 4; i++) g.poly([lo[i], lo[(i + 1) % 4], hi[(i + 1) % 4], hi[i]], "zing", { cull: true, w: 1.6, bias: -3 });
    g.poly(hi, "zing", { w: 1.6, bias: -3 });
    var ring = [];
    for (var k = 0; k <= 20; k++) { var a = Math.PI * k / 20; ring.push([c[0] + 0.15 * s * Math.cos(a), c[1], c[2] + h + 0.16 * s * Math.sin(a)]); }
    g.path(ring, { color: g.T.line, w: 4.5, bias: -3.2 });
    g.path(ring, { color: g.T.mats.zing, w: 2.2, bias: -3.21 });
  }

  WL.define("chair2", {
    cam: { yaw: 36, pitch: 20, S: 56, amp: 5, z: 1.6,
      at: function (t) { var k = eio(seg(t, 0.28, 0.44)); return { pitch: lerp(56, 20, k), z: lerp(1.5, 1.75, k), cy: lerp(0.52, 0.66, k) }; } },
    draw: function (g, t) {
      var T = g.T, Z = T.mats.zing;
      g.grid(5, 1);
      var appear = eo(seg(t, 0.01, 0.07)), score = seg(t, 0.07, 0.16);

      // ---- panels: flat with score lines + slots -> folded -> lined up -> slid onto the ribs
      PANELS.forEach(function (pn, i) {
        var fold = eio(seg(t, 0.18 + i * 0.03, 0.3 + i * 0.03)), S = SEQ[i], fly = eio(seg(t, S[0], S[1])), sliding = t > S[1], sl = back(seg(t, S[1], S[2])); // back() is ~1e-16, not 0, at the start
        pn.faces.forEach(function (f, k) {
          var pts = [0, 1, 2, 3].map(function (j) {
            var p = l3(f.F[j], f.P1[j], fold);
            if (fly > 0) p = add(l3(f.P1[j], f.P2[j], fly), [0, 0, 0.5 * Math.sin(Math.PI * fly)]);
            if (sliding) p = l3(f.P2[j], f.A[j], sl);
            return p;
          });
          drawPanelFace(g, pts, appear);
          // score line (fold) at the start edge of every face after the first, and slots at the panel's edge corners
          if (fold < 0.95) {
            if (k > 0) g.path([l3(pts[0], pts[3], 0), l3(pts[0], pts[3], 1)], { color: score > 0 ? Z : T.soft, w: score > 0 ? 1.8 : 1.2, dash: "6 6", op: appear * (1 - fold) * lerp(0.6, 1, score), bias: -1.6 });
          }
          // slots: rectangular holes across the board on each rib line; once seated a rib tab shows through each one
          var at = function (s, y) { return l3(l3(pts[0], pts[1], s), l3(pts[3], pts[2], s), (y + W) / (2 * W)); };
          f.slots.forEach(function (s0) {
            var ds = SL / f.L;
            [-RY, RY].forEach(function (y) {
              var sb = y < 0 ? -LAYER * W - 0.1 : -0.06; // on top of the strips either side of its rib line
              g.poly([at(s0 - ds, y - SW), at(s0 + ds, y - SW), at(s0 + ds, y + SW), at(s0 - ds, y + SW)], "ink", { flat: true, op: appear, w: 1.3, bias: sb });
              if (sliding && sl > 0.98) g.poly([at(s0 - ds * 0.85, y - TH / 2), at(s0 + ds * 0.85, y - TH / 2), at(s0 + ds * 0.85, y + TH / 2), at(s0 - ds * 0.85, y + TH / 2)], "brand", { flat: true, w: 1, bias: sb - 0.01 });
            });
          });
        });
        // slots lock: a flash at the four corners as the panel seats
        var lock = seg(t, S[2] - 0.015, S[2] + 0.03);
        if (lock > 0 && lock < 1) {
          pn.faces.forEach(function (f) { f.slots.forEach(function (s0) { [-RY, RY].forEach(function (y) {
            var p = l3(l3(f.A[0], f.A[1], s0), l3(f.A[3], f.A[2], s0), (y + W) / (2 * W));
            g.dot(p, 4 + 12 * eo(lock), OR, { stroke: false, op: 1 - lock, bias: -3 });
          }); }); });
        }
      });

      // ---- ribs: flat -> stand up (rigid turn about their length) -> slide into their plane
      RIBS.forEach(function (rb, i) {
        var up = eio(seg(t, 0.3 + i * 0.03, 0.42 + i * 0.03)), th = up * Math.PI / 2;
        // the centre travels from the pad on the floor to its standing spot while the rib turns up about its length
        var c = l3([rb.pad[0], rb.pad[1], 0.012], [X0 + pcx, rb.y, pcz], up);
        c[2] += 0.4 * Math.sin(Math.PI * up);
        var pts = PROF.map(function (q) { var dx = q[0] - pcx, dz = q[1] - pcz; return [c[0] + dx, c[1] + dz * Math.cos(th), c[2] + dz * Math.sin(th)]; });
        drawBoard(g, pts, appear, LAYER * rb.y);
        // tabs standing out of every panel-covered edge, lined up with the panels' slots
        var map = function (q) { var dx = q[0] - pcx, dz = q[1] - pcz; return [c[0] + dx, c[1] + dz * Math.cos(th), c[2] + dz * Math.sin(th)]; };
        PANELS.forEach(function (pn) { pn.faces.forEach(function (f) {
          var tu = [(f.b[0] - f.a[0]) / f.L, (f.b[1] - f.a[1]) / f.L];
          f.slots.forEach(function (s0) {
            var e = [f.a[0] + (f.b[0] - f.a[0]) * s0, f.a[1] + (f.b[1] - f.a[1]) * s0], h = SL * 0.85;
            var tab = [[e[0] - tu[0] * h, e[1] - tu[1] * h], [e[0] + tu[0] * h, e[1] + tu[1] * h], [e[0] + tu[0] * h + f.n[0] * TAB, e[1] + tu[1] * h + f.n[1] * TAB], [e[0] - tu[0] * h + f.n[0] * TAB, e[1] - tu[1] * h + f.n[1] * TAB]];
            g.poly(tab.map(map), "wood", { op: appear, w: 1.3, bias: LAYER * rb.y - 0.01 });
          });
        }); });
      });

      // ---- stiffness test: a weight lands on the seat; the slotted box barely dips
      var land = seg(t, 0.8, 0.86), hold = seg(t, 0.86, 0.95);
      if (land > 0) {
        var dip = 0.03 * Math.sin(Math.PI * seg(t, 0.855, 0.9)), seatZ = lerp(1.0, 0.85, 0.5) + TH;
        var wc = [X0 + 0.42, 0, seatZ + (1 - land * land) * 2.6 - dip];
        weight(g, wc, 1.3);
        if (hold > 0) {
          var q = g.P([X0 + 0.42, 0, seatZ + 1.1]);
          g.screen('<path d="M' + (q[0] + 70).toFixed(1) + ' ' + (q[1] - 6).toFixed(1) + ' l10 10 l20 -22" fill="none" stroke="' + Z + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="' + seg(t, 0.86, 0.89).toFixed(3) + '"/>');
        }
      }
    }
  });
})();

/* ---- davinci/davinci.js ---- */
;/* WonderLab "Da Vinci Bridge" (Explorers): bridge a 50 cm gap between two blocks with split bamboo chopsticks,
 * no glue, string or tape (refs Courses/5/IMG_4575 arch, IMG_4581 the same weave laid flat).
 * 1. The problem: two blocks, a 50 cm gap measured between them.
 * 2. The material: a pair of disposable chopsticks is split open and snapped apart; a pile of 17 sticks is ready.
 * 3. The build: sticks fly from the pile into a woven arch, left to right, until it lands on the far block.
 *    Lengthwise sticks span two bays: their ends rest on top of a cross stick, their middle passes under the next one,
 *    so every cross stick is clamped. Outer pairs and inner pairs alternate. Because the sticks are straight, that
 *    over-under offset (one stick thickness) fixes the curve: R = d (1 + cos a) / (1 - cos a).
 * 4. The test: a water bottle on the crown; arrows show the feet pushing out against the blocks, and it holds.
 * Units: 1 = 10 cm. Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, back = U.back, lerp = U.lerp, clamp = U.clamp, hash = U.hash;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function f1(n) { return Math.round(n * 10) / 10; }

  /* ------------------------------------------------------------------ the gap and the arch */
  var GAP = 5, BW = 2.6, BD = 3.0, HB = 1.4;                  // 50 cm gap; blocks 26 x 30 x 14 cm
  var TH = 0.07, D = TH, LEN = 2.3, OVER = 0.12;              // chopstick 7 mm thick, 23 cm long (sets the arch)
  var DRAW_TH = 0.095;                                        // drawn a touch thicker so the volume reads on screen
  var ALPHA = 15.3 * RAD, NB = 6;                             // bay angle, number of bays
  var R = D * (1 + Math.cos(ALPHA)) / (1 - Math.cos(ALPHA)), HALF = NB * ALPHA / 2;
  var CZ = HB + TH / 2 - R * Math.cos(HALF);                  // arch centre height (feet sit on the blocks)
  var OUTER = 0.8, INNER = 0.4, CHALF = LEN / 2;
  function node(j) { var a = Math.PI / 2 + HALF - j * ALPHA; return { p: [R * Math.cos(a), 0, CZ + R * Math.sin(a)], n: [Math.cos(a), 0, Math.sin(a)], t: [Math.sin(a), 0, -Math.cos(a)] }; }
  var NODES = []; for (var j0 = 0; j0 <= NB; j0++) NODES.push(node(j0));

  // every stick: {A, B, n (thickness normal), cross: [{s, over}]} with s the position along A->B
  var STICKS = [];
  function crossbar(j) {
    var N = NODES[j], even = j % 2 === 0, cr = [];
    [-OUTER, OUTER].forEach(function (y) { if (even || (j - 1 >= 0 && j + 1 <= NB)) cr.push({ y: y, over: !even }); });
    [-INNER, INNER].forEach(function (y) { if (!even || (j - 1 >= 0 && j + 1 <= NB && j - 1 >= 1 && j + 1 <= NB - 1)) cr.push({ y: y, over: even }); });
    return { kind: "c", j: j, A: add(N.p, [0, -CHALF, 0]), B: add(N.p, [0, CHALF, 0]), n: N.n,
             cross: cr.map(function (c) { return { s: (c.y + CHALF) / LEN, over: c.over }; }) };
  }
  function beam(k, y) {
    var Pa = add(NODES[k].p, mul(NODES[k].n, D)), Pb = add(NODES[k + 2].p, mul(NODES[k + 2].n, D)), u = norm(sub(Pb, Pa));
    var A = add(sub(Pa, mul(u, OVER)), [0, y, 0]), B = add(add(Pb, mul(u, OVER)), [0, y, 0]), L = Math.hypot(B[0] - A[0], B[2] - A[2]);
    var n = [-u[2], 0, u[0]]; if (n[2] < 0) n = mul(n, -1);
    return { kind: "b", k: k, A: A, B: B, n: n, cross: [{ s: OVER / L, over: true }, { s: 0.5, over: false }, { s: 1 - OVER / L, over: true }] };
  }
  // build order: left to right, each cross stick followed by the pair of lengthwise sticks that start on it
  for (var j = 0; j <= NB; j++) {
    STICKS.push(crossbar(j));
    if (j + 2 <= NB) { var y = j % 2 === 0 ? OUTER : INNER; STICKS.push(beam(j, -y)); STICKS.push(beam(j, y)); }
  }
  var NS = STICKS.length;                                     // 7 cross + 10 lengthwise = 17

  /* ------------------------------------------------------------------ timing and the pile */
  var SPLIT = [0.1, 0.165], PILE_T = [0.17, 0.22], BUILD0 = 0.25, STEP = 0.021, FLY = 0.034;
  var DONE = BUILD0 + (NS - 1) * STEP + FLY, BOTTLE = [DONE + 0.04, DONE + 0.1];
  var PILE = [0, -3.4];
  function pileSlot(i) { // two layers of sticks lying along x in front of the gap
    var row = i < 9 ? 0 : 1, k = row ? i - 9 : i;
    return { c: [PILE[0] + (hash(i * 7.1) - 0.5) * 0.3, PILE[1] + (k - (row ? 3.5 : 4)) * 0.095, TH / 2 + row * TH * 0.9], d: [1, 0, 0], n: [0, 0, 1] };
  }
  var SPLIT_C = [0, -3.25, 1.35];                              // the chopstick pair being split, held upright

  /* ------------------------------------------------------------------ camera */
  var KEYS = [[0, 0, -0.4, 1.1, 1.2, 26, 18], [0.085, 0, -0.4, 1.1, 1.2, 26, 18], [0.13, 0, -3.25, 1.35, 2.7, 16, 12],
              [0.18, 0, -3.25, 1.35, 2.7, 16, 12], [0.26, 0, -1.1, 1.3, 1.6, 22, 14], [0.62, 0, -0.2, 1.8, 1.85, 19, 26],
              [0.72, 0, 0, 2.3, 1.7, 17, 22], [1, 0, 0, 2.3, 1.7, 17, 14]];
  function camAt(t) {
    for (var i = 0; i < KEYS.length - 1; i++) { var a = KEYS[i], b = KEYS[i + 1]; if (t <= b[0]) { var k = eio(seg(t, a[0], b[0])); return a.map(function (v, q) { return lerp(v, b[q], k); }); } }
    return KEYS[KEYS.length - 1];
  }
  function wrap(g, off) {
    function sh(p) { return [p[0] - off[0], p[1] - off[1], p[2] - off[2]]; }
    return {
      T: g.T, V: g.V, S: g.S, screen: g.screen, P: function (p) { return g.P(sh(p)); },
      poly: function (pts, m, o) { g.poly(pts.map(sh), m, o); },
      path: function (pts, o) { g.path(pts.map(sh), o); },
      dot: function (p, r, m, o) { g.dot(sh(p), r, m, o); },
      box8: function (C, m, o) { g.box8(C.map(sh), m, o); }
    };
  }

  /* ------------------------------------------------------------------ drawing helpers */
  // a chopstick as a line-art tube cut into short pieces, so each piece depth-sorts on its own; at a crossing the
  // piece of the stick on top gets a small forward bias, so the over/under weave always reads correctly
  // a chopstick as a square-section stick tapering to the tip. It is cut into short pieces so each piece depth-sorts
  // on its own; at a crossing the piece of the stick on top gets a forward bias, so the over/under weave always reads.
  // Faces are filled without outlines and only the long edges are drawn, so the cuts between pieces never show.
  function chop(G, A, B, cross, o) {
    var n = 12, L = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]), dir = norm(sub(B, A)), V = G.V, base = o.bias || 0;
    var up = o.n || [0, 0, 1], nn = sub(up, mul(dir, dot(up, dir)));
    if (Math.hypot(nn[0], nn[1], nn[2]) < 1e-3) { up = [0, -1, 0]; nn = sub(up, mul(dir, dot(up, dir))); }
    nn = norm(nn);
    var ww = cross3(dir, nn), ax = [nn, ww, mul(nn, -1), mul(ww, -1)];
    function ring(sv) { // the four corners of the cross-section at sv
      var c = mix3(A, B, sv), h = DRAW_TH / 2 * lerp(1, 0.7, sv);
      return [0, 1, 2, 3].map(function (q) { return add(c, add(mul(ax[q], h), mul(ax[(q + 1) % 4], h))); });
    }
    var eo2 = { color: G.T.line, w: 1.3, op: o.op };
    for (var i = 0; i < n; i++) {
      var s0 = i / n, s1 = (i + 1) / n, sm = (s0 + s1) / 2, bias = 0;
      (cross || []).forEach(function (c) { if (Math.abs(sm - c.s) * L < 0.14) bias = c.over ? -0.5 : 0.5; });
      var r0 = ring(s0), r1 = ring(s1), pb = base + bias;
      for (var f = 0; f < 4; f++) {
        var f0 = (f + 3) % 4, fnrm = ax[f];                    // face f spans corners f-1..f, facing ax[f]
        if (dot(fnrm, V) <= 0.02) continue;
        G.poly([r0[f0], r0[f], r1[f], r1[f0]], o.col || "brand", { stroke: false, op: o.op, bias: pb });
        G.path([r0[f0], r1[f0]], { color: eo2.color, w: eo2.w, op: o.op, bias: pb - 0.02 });
        G.path([r0[f], r1[f]], { color: eo2.color, w: eo2.w, op: o.op, bias: pb - 0.02 });
      }
      [[0, r0, mul(dir, -1)], [n - 1, r1, dir]].forEach(function (e) { // end caps
        if (i !== e[0] || dot(e[2], V) <= 0.02) return;
        G.poly(e[1], o.col || "brand", { op: o.op, bias: pb - 0.03, w: 1.3 });
      });
    }
  }
  function lathe(G, c, prof, n, col, o) {
    var rings = prof.r.map(function (r, i) { var ring = []; for (var k = 0; k < n; k++) { var a = k / n * TAU; ring.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2] + prof.z[i]]); } return ring; });
    for (var i = 0; i < rings.length - 1; i++) for (var k = 0; k < n; k++) {
      var k2 = (k + 1) % n, q = [rings[i][k], rings[i][k2], rings[i + 1][k2], rings[i + 1][k]];
      if (dot(norm(cross3(sub(q[1], q[0]), sub(q[3], q[0]))), G.V) < -0.02) continue;
      G.poly(q, typeof col === "function" ? col(q) : col, { stroke: false, op: o.op, bias: o.bias });
    }
  }
  function arrow(G, a, b, col, op, bias, head, w) { // flat arrow lying in the plane of a->b and z-up
    var d = norm(sub(b, a)), s = norm(cross3([0, 0, 1], d)), h = head || 0.22;
    G.path([a, sub(b, mul(d, h * 0.8))], { color: col, w: w || 3, op: op, bias: bias });
    G.poly([b, add(sub(b, mul(d, h)), mul(s, h * 0.55)), sub(sub(b, mul(d, h)), mul(s, h * 0.55))], col, { flat: true, stroke: false, op: op, bias: bias - 0.01 });
  }

  WL.define("davinci", {
    cam: { yaw: 18, pitch: 26, S: 60, amp: 0, cy: 0.5, at: function (t) { var c = camAt(t); return { z: c[4], pitch: c[5], yaw: c[6] }; } },
    draw: function (g0, t) {
      var cam = camAt(t), G = wrap(g0, [cam[1], cam[2], cam[3]]), T = g0.T, M = T.mats, V = g0.V, px = g0.S;

      // ---- floor
      for (var gx = -7; gx <= 7.01; gx += 1) G.path([[gx, -5, 0], [gx, 3.5, 0]], { color: T.grid, w: 1, bias: 100 });
      for (var gy = -5; gy <= 3.51; gy += 1) G.path([[-7, gy, 0], [7, gy, 0]], { color: T.grid, w: 1, bias: 100 });

      // ---- 1. two blocks and the 50 cm gap
      var ba = eo(seg(t, 0.01, 0.05));
      [-1, 1].forEach(function (sd) {
        var x0 = sd < 0 ? -GAP / 2 - BW : GAP / 2, hz = HB * ba;
        G.box8([[x0, -BD / 2, 0], [x0 + BW, -BD / 2, 0], [x0 + BW, BD / 2, 0], [x0, BD / 2, 0], [x0, -BD / 2, hz], [x0 + BW, -BD / 2, hz], [x0 + BW, BD / 2, hz], [x0, BD / 2, hz]], "paper", { op: ba, bias: 8 });
      });
      var dm = eio(seg(t, 0.04, 0.08)), bridged = seg(t, DONE - 0.01, DONE + 0.01), dFlash = bridged * (1 - 0.6 * seg(t, DONE + 0.03, DONE + 0.08));
      if (dm > 0) {
        var dy = -BD / 2 - 0.25, dz = HB + 0.02, dcol = bridged > 0.5 ? "zing" : "brand";
        G.path([[-GAP / 2 * dm, dy, dz], [GAP / 2 * dm, dy, dz]], { color: dcol, w: 2 + dFlash, bias: -4 });
        [-1, 1].forEach(function (sd) {
          arrow(G, [sd * GAP / 2 * dm * 0.6, dy, dz], [sd * GAP / 2 * dm, dy, dz], dcol === "zing" ? M.zing : M.brand, 1, -4.1, 0.2);
          G.path([[sd * GAP / 2, dy, HB - 0.35], [sd * GAP / 2, dy, HB + 0.35]], { color: dcol, w: 1.6, op: dm, bias: -4 });
        });
      }

      // ---- 2. split a pair of chopsticks, then the pile
      var sOn = seg(t, SPLIT[0] - 0.015, SPLIT[0]), open = eio(seg(t, SPLIT[0] + 0.01, SPLIT[1] - 0.01)), snap = seg(t, SPLIT[1], SPLIT[1] + 0.02);
      if (sOn > 0 && t < PILE_T[1]) {
        var top = add(SPLIT_C, [0, 0, LEN / 2]);
        [-1, 1].forEach(function (sd) {
          var ang = sd * (4 + 14 * open) * RAD, dir = [Math.sin(ang), 0, -Math.cos(ang)];
          var A = add(top, [sd * TH / 2, 0, 0]), B = add(A, mul(dir, LEN));
          if (snap > 0) { // the halves fall away to the pile
            var sl = pileSlot(sd < 0 ? 16 : 15), k = eio(snap);
            var c0 = mix3(A, B, 0.5), c1 = sl.c, cm = mix3(c0, c1, k); cm[2] += 0.6 * Math.sin(Math.PI * k);
            var d0 = norm(sub(B, A)), dd = norm(mix3(d0, [1, 0, 0], k));
            A = sub(cm, mul(dd, LEN / 2)); B = add(cm, mul(dd, LEN / 2));
          }
          chop(G, A, B, null, { op: sOn, bias: -6 });
        });
        if (snap > 0 && snap < 1) {
          var q = G.P(top), sp = "";
          for (var i = 0; i < 8; i++) { var an = i / 8 * TAU, r0 = 10 + 26 * eo(snap), r1 = r0 + 12 * (1 - snap); sp += "M" + f1(q[0] + r0 * Math.cos(an)) + " " + f1(q[1] + r0 * Math.sin(an)) + "L" + f1(q[0] + r1 * Math.cos(an)) + " " + f1(q[1] + r1 * Math.sin(an)); }
          G.screen('<path d="' + sp + '" stroke="' + M.zing + '" stroke-width="2.6" stroke-linecap="round" opacity="' + (1 - snap).toFixed(3) + '"/>');
        }
      }

      // ---- 3. build: each stick flies from the pile to its place in the arch
      var load = eio(seg(t, BOTTLE[1] - 0.005, BOTTLE[1] + 0.02)), tau = Math.max(0, (t - BOTTLE[1]) * 16);
      var sag = load * 0.05 * (1 - Math.exp(-2 * tau) * Math.cos(10 * tau));
      function sagged(p) { return [p[0], p[1], p[2] - sag * Math.cos(clamp(p[0] / (R * Math.sin(HALF)), -1, 1) * Math.PI / 2)]; }
      STICKS.forEach(function (st, i) {
        var t0 = BUILD0 + i * STEP, k = eio(seg(t, t0, t0 + FLY)), inPile = seg(t, PILE_T[0] + i * 0.002, PILE_T[0] + i * 0.002 + 0.03);
        if (i >= NS - 2 && t < SPLIT[1] + 0.02) inPile = 0;          // the two just split are still in the air
        if (inPile <= 0 && k <= 0) return;
        var A = sagged(st.A), B = sagged(st.B);
        if (k < 1) {
          var sl = pileSlot(i), c1 = mix3(A, B, 0.5), d1 = norm(sub(B, A)), d0 = dot(d1, sl.d) < 0 ? mul(sl.d, -1) : sl.d;
          var cm = mix3(sl.c, c1, k); cm[2] += 1.4 * Math.sin(Math.PI * k);
          var dd = norm(mix3(d0, d1, k));
          A = sub(cm, mul(dd, LEN / 2)); B = add(cm, mul(dd, LEN / 2));
        }
        chop(G, A, B, k >= 1 ? st.cross : null, { op: k > 0 ? 1 : inPile, bias: k > 0 && k < 1 ? -3 : 0, n: norm(mix3([0, 0, 1], st.n, k)) });
      });
      // a spark where the last stick lands on the far block
      var land = seg(t, DONE - 0.005, DONE + 0.03);
      if (land > 0 && land < 1) {
        var lq = G.P(NODES[NB].p), ls = "";
        for (var li = 0; li < 7; li++) { var la = li / 7 * TAU + 0.4, a0 = 10 + 22 * eo(land), a1 = a0 + 10 * (1 - land); ls += "M" + f1(lq[0] + a0 * Math.cos(la)) + " " + f1(lq[1] + a0 * Math.sin(la)) + "L" + f1(lq[0] + a1 * Math.cos(la)) + " " + f1(lq[1] + a1 * Math.sin(la)); }
        G.screen('<path d="' + ls + '" stroke="' + M.zing + '" stroke-width="2.4" stroke-linecap="round" opacity="' + (1 - land).toFixed(3) + '"/>');
      }

      // ---- 4. the test: a water bottle on the crown, the feet push out against the blocks
      var bIn = seg(t, BOTTLE[0], BOTTLE[1]);
      if (bIn > 0) {
        var crown = sagged(add(NODES[NB / 2].p, [0, 0, D + TH / 2]));
        var c = add(crown, [0, 0, 2.4 * (1 - eio(bIn))]), bop = seg(t, BOTTLE[0], BOTTLE[0] + 0.015);
        var BOT = { r: [0.31, 0.33, 0.33, 0.32, 0.24, 0.13, 0.11, 0.11], z: [0, 0.05, 1.35, 1.5, 1.75, 1.96, 2.02, 2.14] };
        var slosh = t < BOTTLE[1] ? 0 : 0.14 * Math.exp(-1.6 * tau) * Math.sin(tau * 7);
        lathe(G, c, BOT, 24, function (q) { var mz = (q[0][2] + q[2][2]) / 2, mx = (q[0][0] + q[2][0]) / 2; return mz < c[2] + 1.45 + slosh * mx ? "sky" : "paper"; }, { op: bop, bias: -8 });
        var cv = cross3([0, 0, 1], V), side = norm([cv[0], cv[1], 0]);
        [-1, 1].forEach(function (s) { G.path(BOT.r.map(function (r, i) { return add(c, [side[0] * r * s, side[1] * r * s, BOT.z[i]]); }), { color: T.line, w: 1.5, op: bop, bias: -8.5 }); });
        var wl = []; for (var w = 0; w <= 30; w++) { var aw = w / 30 * TAU; if (dot([Math.cos(aw), Math.sin(aw), 0], V) >= -0.05) wl.push([c[0] + 0.33 * Math.cos(aw), c[1] + 0.33 * Math.sin(aw), c[2] + 1.45 + slosh * 0.33 * Math.cos(aw)]); }
        G.path(wl, { color: "brand", w: 1.4, op: bop, bias: -8.6 });
        lathe(G, c, { r: [0.13, 0.13, 0.001], z: [2.14, 2.3, 2.3] }, 14, "zing", { op: bop, bias: -8.7 });
        var push = seg(t, BOTTLE[1], BOTTLE[1] + 0.03) * (1 - seg(t, 0.9, 0.93));
        if (push > 0) {
          [-1, 1].forEach(function (sd) {
            var f = NODES[sd < 0 ? 0 : NB].p;
            arrow(G, [f[0] + sd * 0.15, -BD / 2 + 0.35, HB + 0.02], [f[0] + sd * (0.15 + 0.95 * eo(push)), -BD / 2 + 0.35, HB + 0.02], "#FF6000", push, -5, 0.3, 4.2); // WonderLab orange
          });
          var q0 = G.P(add(c, [0, 0, 2.55]));
          G.screen('<path d="M' + f1(q0[0]) + " " + f1(q0[1] - 40) + "V" + f1(q0[1] - 10) + '" stroke="' + M.zing + '" stroke-width="3" stroke-linecap="round" opacity="' + push.toFixed(3) + '"/>' +
            '<path d="M' + f1(q0[0] - 9) + " " + f1(q0[1] - 14) + "L" + f1(q0[0]) + " " + f1(q0[1] - 2) + "L" + f1(q0[0] + 9) + " " + f1(q0[1] - 14) + 'Z" fill="' + M.zing + '" opacity="' + push.toFixed(3) + '"/>');
        }
      }
    }
  });
})();

/* ---- egg/egg.js ---- */
;/* WonderLab egg-drop challenge: four protectors built only from paper straws and rubber bands.
 * All four assemble side by side at drop height and fall together onto the floor. The porcupine's spikes flex and
 * the crumple zone's legs buckle, so those eggs survive; the tetrahedron's top band snaps and the cube's banded joints
 * slip, so those eggs crack.
 * Local coordinates put the egg at the origin; units are roughly 10 cm. Pure function of loop progress t.
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, clamp = U.clamp;

  var EGG = "#FF6000"; // WonderLab orange egg shell
  var DROP = 4.2; // drop height of the egg centre above rest (they assemble up there, then fall)

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }

  var D = [];

  // 1. porcupine (reference): triangle cage hugging the egg, long straws radiating every way, banded where they cross
  (function () {
    var S = [], B = [], n = 11, ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var zc = 1 - (i + 0.5) / n * 2, r = Math.sqrt(1 - zc * zc), d = [r * Math.cos(i * ga), r * Math.sin(i * ga), zc];
      var u = norm(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(d, u), a = i * 2.4;
      var o = add(mul(u, 0.34 * Math.cos(a)), mul(v, 0.34 * Math.sin(a)));
      S.push({ a: add(o, mul(d, -1.25)), b: add(o, mul(d, 1.25)) });
      B.push({ p: o, d: d });
    }
    var tri = [0, 1, 2].map(function (k) { var a = (90 + k * 120) * RAD; return [0.72 * Math.cos(a), 0.72 * Math.sin(a), -0.05]; });
    for (var k = 0; k < 3; k++) {
      var p = tri[k], q = tri[(k + 1) % 3], dd = norm(sub(q, p));
      S.push({ a: add(p, mul(dd, -0.35)), b: add(q, mul(dd, 0.35)) });
      B.push({ p: p, d: [0, 0, 1] });
    }
    D.push({ S: S, B: B, susp: [], kind: "spikes" });
  })();

  // 2. tetrahedron with the egg slung on four rubber bands
  (function () {
    var R = 1.3, V = [[0, 0, R]];
    for (var k = 0; k < 3; k++) { var a = (90 + k * 120) * RAD, rr = R * Math.sqrt(8) / 3; V.push([rr * Math.cos(a), rr * Math.sin(a), -R / 3]); }
    var S = [], B = [];
    for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) { var dd = norm(sub(V[j], V[i])); S.push({ a: add(V[i], mul(dd, -0.14)), b: add(V[j], mul(dd, 0.14)) }); }
    V.forEach(function (v) { B.push({ p: v, d: norm(v) }); });
    D.push({ S: S, B: B, susp: V, kind: "sling" });
  })();

  // 3. cube cradle: eight bands from the corners
  (function () {
    var h = 0.88, C = [], S = [], B = [];
    for (var i = 0; i < 8; i++) C.push([i & 1 ? h : -h, i & 2 ? h : -h, i & 4 ? h : -h]);
    [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) {
      var dd = norm(sub(C[e[1]], C[e[0]])); S.push({ a: add(C[e[0]], mul(dd, -0.12)), b: add(C[e[1]], mul(dd, 0.12)) });
    });
    C.forEach(function (c) { B.push({ p: c, d: norm(c) }); });
    D.push({ S: S, B: B, susp: C, kind: "sling" });
  })();

  // 4. crumple zone: a ring of short straw legs under a straw teepee; the legs buckle and stay crushed
  (function () {
    var S = [], B = [], legs = [], n = 10, top = -0.38, bot = -1.45;
    for (var k = 0; k < n; k++) { var a = k / n * TAU; legs.push({ a: [0.5 * Math.cos(a), 0.5 * Math.sin(a), bot], b: [0.5 * Math.cos(a), 0.5 * Math.sin(a), top], th: a }); }
    for (k = 0; k < 5; k++) { var a2 = k / 5 * TAU; S.push({ a: [0.62 * Math.cos(a2), 0.62 * Math.sin(a2), top], b: [-0.08 * Math.cos(a2), -0.08 * Math.sin(a2), 0.95] }); }
    for (k = 0; k < 5; k++) { var a3 = (k + 0.5) / 5 * TAU, a4 = (k + 1.5) / 5 * TAU; S.push({ a: [0.62 * Math.cos(a3), 0.62 * Math.sin(a3), top], b: [0.62 * Math.cos(a4), 0.62 * Math.sin(a4), top] }); }
    B.push({ p: [0, 0, 0.88], d: [0, 0, 1], r: 0.14 }, { p: [0, 0, -0.9], d: [0, 0, 1], r: 0.56, leg: true }, { p: [0, 0, top], d: [0, 0, 1], r: 0.64 });
    D.push({ S: S, B: B, legs: legs, susp: [], kind: "crumple" });
  })();

  // lowest point, so each protector lands on its lowest straw
  D.forEach(function (d) {
    var m = 0;
    d.S.forEach(function (s) { m = Math.min(m, s.a[2], s.b[2]); });
    (d.legs || []).forEach(function (s) { m = Math.min(m, s.a[2]); });
    d.rest = -m;
  });

  function ring(g, p, dir, r, op) { // rubber band wrapped around a straw / joint
    var u = norm(cross(dir, Math.abs(dir[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(dir, u), pts = [];
    for (var k = 0; k <= 16; k++) { var a = k / 16 * TAU; pts.push(add(p, add(mul(u, r * Math.cos(a)), mul(v, r * Math.sin(a))))); }
    g.path(pts, { color: g.T.mats.zing, w: 2, op: op, bias: -0.15 });
  }

  // side-by-side line-up (left to right): porcupine OK, tetrahedron FAILS, crumple zone OK, cube FAILS
  D[1].fail = "snap"; // top band snaps, egg drops onto the base straws
  D[2].fail = "rack"; // band-tied joints slip, the cube leans over and flattens onto the egg
  var ROW = [{ d: 0, x: -4.2 }, { d: 1, x: -1.4 }, { d: 3, x: 1.4 }, { d: 2, x: 4.2 }];
  var REST = Math.max.apply(null, D.map(function (d) { return d.rest; }));

  // egg-centre height above rest: built at DROP, then free fall (all four together)
  var FALL = [0.37, 0.5], HIT = [0.5, 0.8];
  function height(t) { var fall = seg(t, FALL[0], FALL[1]); return lerp(DROP, 0, fall * fall); } // gravity: z drops with time squared

  // after the first hit (u = 0..1 across HIT): short squash on every floor contact, parabolic hops that shrink
  // each time (hop time ~ sqrt of hop height), then rest. Returns { sq: squash 0..1, hop: height }
  var CW = 0.05, HOPS = [0.5, 0.17, 0.05], AMPS = [1, 0.45, 0.18, 0.07];
  function bounce(u, scale) {
    var tt = u;
    for (var i = 0; i < AMPS.length; i++) {
      if (tt < CW) return { sq: AMPS[i] * Math.sin(Math.PI * tt / CW), hop: 0 };
      tt -= CW;
      if (i < HOPS.length) {
        var h = HOPS[i] * scale, dd = 0.28 * Math.sqrt(HOPS[i]);
        if (tt < dd) { var k = tt / dd; return { sq: -0.12 * AMPS[i] * Math.sin(Math.PI * Math.min(1, k * 3)), hop: 4 * h * k * (1 - k) }; }
        tt -= dd;
      }
    }
    return { sq: 0, hop: 0 };
  }

  // broken egg: two shell halves with a jagged edge, facing the camera, and a splat on the floor
  function brokenEgg(g, c, k, op) {
    var V = g.V, rt = norm(cross([0, 0, 1], V)), up = [0, 0, 1], rx = 0.23, rz = 0.3;
    function E(a, r) { return add(c, add(mul(rt, rx * r * Math.cos(a)), mul(up, rz * r * Math.sin(a)))); }
    var zig = [];
    for (var j = 0; j <= 6; j++) zig.push([(j % 2 ? 0.06 : -0.06), lerp(0.3, -0.3, j / 6)]);
    [-1, 1].forEach(function (sd) {
      var pts = [], shift = add(mul(rt, sd * 0.14 * k), [0, 0, -0.1 * k]);
      for (var i = 0; i <= 10; i++) { var a = (sd < 0 ? 90 : -90) * RAD + i / 10 * Math.PI; pts.push(add(E(a, 1), shift)); }
      zig.slice().reverse().forEach(function (z) { if (sd > 0) pts.push(add(add(c, add(mul(rt, z[0]), mul(up, z[1]))), shift)); });
      zig.forEach(function (z) { if (sd < 0) pts.push(add(add(c, add(mul(rt, z[0]), mul(up, z[1]))), shift)); });
      g.poly(pts, EGG, { flat: true, w: 1.2, op: op, bias: -0.2 });
    });
    var sp = [], ys = [];
    for (var i = 0; i < 18; i++) { var a = i / 18 * TAU, r = (0.35 + 0.18 * U.hash(i * 3.7)) * (0.3 + 0.9 * k); sp.push([c[0] + r * Math.cos(a) * 1.3, c[1] + r * Math.sin(a), 0.006]); ys.push([c[0] + r * 0.45 * Math.cos(a), c[1] + r * 0.4 * Math.sin(a), 0.008]); }
    g.poly(sp, "brand", { flat: true, stroke: false, fillOp: 0.45, op: op * Math.min(1, k * 2), bias: 3 });
    g.poly(ys, "zing", { flat: true, stroke: false, fillOp: 0.7, op: op * Math.min(1, k * 2), bias: 2.9 });
  }

  WL.define("egg", {
    cam: { yaw: 12, pitch: 12, S: 60, amp: 0, z: 1.3, cy: 0.87 }, // fixed: floor always in view
    draw: function (g, t) {
      var T = g.T, Z = T.mats.zing;
      var zc = height(t), fall = seg(t, FALL[0], FALL[1]), u = seg(t, HIT[0], HIT[1]);

      // floor + drop-height ruler
      for (var gx = -7; gx <= 7.01; gx += 1) g.path([[gx, -2, 0], [gx, 2, 0]], { color: T.grid, w: 1, bias: 100 });
      for (var gy = -2; gy <= 2.01; gy += 1) g.path([[-7, gy, 0], [7, gy, 0]], { color: T.grid, w: 1, bias: 100 });
      var ru = seg(t, 0.2, 0.26) * (1 - seg(t, 0.56, 0.62)), rx = [-6.2, 0.6];
      if (ru > 0) {
        g.line([rx[0], rx[1], 0], [rx[0], rx[1], DROP + REST], { color: T.line, w: 1.2, dash: "4 6", op: ru * 0.7 });
        for (var h = 0; h <= DROP + REST + 0.01; h += 1) g.line([rx[0] - 0.12, rx[1], h], [rx[0] + 0.12, rx[1], h], { color: T.line, w: 1.2, op: ru * 0.7 });
      }

      ROW.forEach(function (slotD, col) {
        var d = D[slotD.d], X = slotD.x, fail = d.fail;
        var st = col * 0.025; // designs assemble one after another
        // impact response: survivors compress, rebound, hop; failures don't bounce back
        var bn = bounce(u, d.kind === "crumple" ? 0.35 : 1), sq = u > 0 ? bn.sq : 0, hop = u > 0 ? bn.hop : 0;
        if (fail) { sq = u > 0 ? Math.sin(Math.PI * seg(u, 0, 0.14)) * 0.8 : 0; hop = 0; }
        var crush = d.kind === "crumple" ? eio(seg(u, 0, 0.12)) : 0;
        var rack = fail === "rack" ? 1.2 * eio(seg(u, 0.04, 0.26)) : 0;
        var snap = fail === "snap" ? seg(u, 0.05, 0.06) : 0;
        var base = d.rest + zc + hop - 0.33 * crush;
        var spin = (1 - eio(fall)) * 50 * RAD * (col % 2 ? -1 : 1), cs = Math.cos(spin), sn = Math.sin(spin);
        var tum = 0.3 * Math.sin(Math.PI * fall) * (col % 2 ? 1 : -1), ct = Math.cos(tum), st2 = Math.sin(tum); // tips a little in the air, lands level
        function W(p) { var y = p[1] * ct - p[2] * st2, z = p[1] * st2 + p[2] * ct; return [X + p[0] * cs - y * sn, p[0] * sn + y * cs, z + base]; }
        function frame(p) { // the racked cube leans toward the camera
          if (fail === "rack") { var hh = 0.88 + 0.12; return [p[0], p[1] - (p[2] + hh) * Math.sin(rack), -hh + (p[2] + hh) * Math.cos(rack)]; }
          if (d.kind === "spikes" && p[2] < 0) return [p[0] * (1 + 0.14 * sq), p[1] * (1 + 0.14 * sq), p[2] * (1 - 0.32 * sq)];
          if (d.kind === "sling" && p[2] < 0) return [p[0], p[1], p[2] * (1 - 0.08 * sq)];
          return p;
        }
        // egg: survivors dip and recover; failures end on the floor and crack
        var eggOff = d.kind === "sling" ? -0.42 * sq : d.kind === "spikes" ? -0.12 * sq : -0.05 * sq, eggX = 0;
        if (fail) { var drop = eio(seg(u, 0.06, 0.24)); eggOff = lerp(eggOff, -d.rest + 0.3, drop); eggX = 0.08 * drop; }
        var egg = W([eggX, 0, eggOff]), crack = fail ? eo(seg(u, 0.22, 0.4)) : 0;

        g.shadow(U.circlePts(X, 0, 0.001, 0.5 + 0.7 * clamp(1 - zc / DROP), 24), clamp(0.4 + 0.6 * (1 - zc / DROP)));
        if (crack > 0) brokenEgg(g, egg, crack, 1); else g.dot(egg, 0.29 * g.S, EGG, { sx: 0.8 * (1 + 0.08 * Math.max(0, sq)), sy: 1.02 * (1 - 0.1 * Math.max(0, sq)) });

        d.S.forEach(function (s, i) {
          var a = eo(seg(t, 0.03 + st + i * 0.006, 0.1 + st + i * 0.006));
          if (a <= 0) return;
          var fly = mul(norm(add(s.a, s.b)), (1 - a) * 2.5);
          g.tube(W(add(frame(s.a), fly)), W(add(frame(s.b), fly)), { w: 3.2, mat: "paper", op: a });
        });
        (d.legs || []).forEach(function (s, i) {
          var a = eo(seg(t, 0.03 + st + i * 0.006, 0.1 + st + i * 0.006));
          if (a <= 0) return;
          // base already drops by the crush, so lift the foot back onto the ground; the knee kinks outward
          var out = [Math.cos(s.th), Math.sin(s.th), 0], fly = [0, 0, -(1 - a) * 2.5];
          var foot = add([s.a[0], s.a[1], s.a[2] + 0.33 * crush], fly), head = add(s.b, fly);
          var knee = add(l3(foot, head, 0.5), mul(out, 0.22 * crush + 0.05 * Math.max(0, sq)));
          g.tube(W(foot), W(knee), { w: 2.8, mat: "paper", op: a });
          g.tube(W(knee), W(head), { w: 2.8, mat: "paper", op: a });
        });
        var bo = eo(seg(t, 0.16 + st, 0.22 + st));
        d.B.forEach(function (b) { if (bo > 0) ring(g, W(frame(b.p)), b.d, (b.r || 0.08) * (1 + 0.4 * (1 - bo)), bo); });
        d.susp.forEach(function (v, i) {
          if (bo <= 0) return;
          var vv = W(frame(v)), dir = norm(sub(vv, egg)), side = mul(norm(cross(dir, [0, 0, 1])), 0.035), e0 = add(egg, mul(dir, 0.26));
          if (fail === "snap" && i === 0 && snap > 0) { // the top band breaks and whips back to both anchors
            var rc = eo(seg(u, 0.05, 0.2)), m0 = l3(e0, vv, 0.5 - 0.45 * rc), m1 = l3(e0, vv, 0.5 + 0.45 * rc);
            g.path([e0, add(m0, [0.12 * rc, 0, 0])], { color: Z, w: 1.6, op: 1 - 0.5 * rc, bias: -0.1 });
            g.path([vv, add(m1, [-0.12 * rc, 0, 0])], { color: Z, w: 1.6, op: 1 - 0.5 * rc, bias: -0.1 });
            return;
          }
          g.line(add(e0, side), add(vv, side), { color: Z, w: 1.3, op: bo, bias: -0.1 });
          g.line(sub(e0, side), sub(vv, side), { color: Z, w: 1.3, op: bo, bias: -0.1 });
        });

        // impact ticks, then verdict: check for intact, cross for cracked
        if (u > 0 && u < 0.4) {
          var ip = seg(u, 0, 0.4);
          for (var k = 0; k < 6; k++) { var an = k / 6 * TAU + 0.3; g.line([X + Math.cos(an) * (0.9 + ip), Math.sin(an) * (0.9 + ip) * 0.8, 0.02], [X + Math.cos(an) * (1.1 + 1.4 * ip), Math.sin(an) * (1.1 + 1.4 * ip) * 0.8, 0.02], { color: T.line, w: 1.4, op: 1 - ip, bias: 5 }); }
        }
        var ok = seg(t, 0.8, 0.84);
        if (ok > 0) {
          var q = g.P([X, 0, REST + 1.9]);
          g.screen(fail
            ? '<path d="M' + (q[0] - 12).toFixed(1) + ' ' + (q[1] - 12).toFixed(1) + ' l24 24 m0 -24 l-24 24" fill="none" stroke="' + T.soft + '" stroke-width="5" stroke-linecap="round" opacity="' + ok.toFixed(3) + '"/>'
            : '<path d="M' + (q[0] - 15).toFixed(1) + ' ' + (q[1] - 4).toFixed(1) + ' l10 10 l20 -22" fill="none" stroke="' + Z + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="' + ok.toFixed(3) + '"/>');
        }
      });
    }
  });
})();

/* ---- facade/facade.js ---- */
;/* WonderLab "The Infinite Facade" (Creators): one rubber stamp, turned four ways, skins a whole tower.
 * Step 1, carve: a lino gouge cuts the tile from Courses/10/IMG_4573 into a rubber block (curls of rubber pile up),
 *         then the background is cleared so the bands stand proud.
 * Step 2, ink: a roller loaded with white ink inks the raised bands only.
 * Step 3, rotate and stamp: the stamp flips onto the facade. The arrow drawn on its back shows the turn for
 *         each print: up, left / right, down. Two 2x2 blocks are
 *         stamped by hand, then the pattern climbs the rest of the tower and the camera pulls back.
 * The tile is rebuilt as vectors: every edge carries bands at 0.272, 0.495 and 0.72, so it joins under any rotation.
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, back = U.back, lerp = U.lerp, clamp = U.clamp, hash = U.hash;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function f1(n) { return Math.round(n * 10) / 10; }
  function rotXv(p, a) { var s = Math.sin(a), k = Math.cos(a); return [p[0], p[1] * k - p[2] * s, p[1] * s + p[2] * k]; }

  /* ------------------------------------------------------------------ the tile, in tile coords (u right, v down) */
  var C1 = 0.272, C2 = 0.495, C3 = 0.72, BW = 0.105, DOT = 0.105, RM = (C1 + C2) / 2, RR = (C2 - C1) / 2;
  function arc(cx, cy, r, a0, a1, n) { var o = []; for (var i = 0; i <= n; i++) { var a = lerp(a0, a1, i / n) * RAD; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return o; }
  function catmull(P, n) {
    var o = [];
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (var k = 0; k < n; k++) {
        var s = k / n, s2 = s * s, s3 = s2 * s;
        o.push([0, 1].map(function (j) { return 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * s + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * s2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * s3); }));
      }
    }
    o.push(P[P.length - 1]);
    return o;
  }
  var EPTS = [[C3, 0], [0.712, 0.1], [0.685, 0.2], [0.652, 0.29], [0.636, 0.4], [0.655, 0.5], [0.71, 0.59], [0.79, 0.66], [0.895, 0.71], [1, C3]];
  var WAVE = catmull(EPTS, 7);
  var LINES = [arc(0, 0, C1, 0, 90, 22), arc(0, 0, C2, 0, 90, 30), arc(1, RM, RR, 90, 270, 20), arc(RM, 1, RR, 180, 360, 20),
               WAVE, WAVE.map(function (p) { return [p[1], p[0]]; })];
  function clipHalf(poly, f) { // keep f(p) >= 0 (Sutherland-Hodgman against one half-plane)
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { var k = fa / (fa - fb); out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]); }
    }
    return out;
  }
  function clipSq(p) {
    [function (q) { return q[0]; }, function (q) { return 1 - q[0]; }, function (q) { return q[1]; }, function (q) { return 1 - q[1]; }].forEach(function (f) { p = clipHalf(p, f); });
    return p;
  }
  function ribbon(c) {
    var L = [], R = [];
    c.forEach(function (p, i) {
      var a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      var nx = -dy / l * BW / 2, ny = dx / l * BW / 2;
      L.push([p[0] + nx, p[1] + ny]); R.push([p[0] - nx, p[1] - ny]);
    });
    return { poly: clipSq(L.concat(R.slice().reverse())), L: L.map(cl), R: R.map(cl), c: c };
  }
  function cl(p) { return [clamp(p[0]), clamp(p[1])]; }
  var PARTS = LINES.map(ribbon);
  [[0, 0, 0], [1, 0, 90], [1, 1, 180], [0, 1, 270]].forEach(function (d) { // quarter dots in the corners
    var rim = arc(d[0], d[1], DOT, d[2], d[2] + 90, 10);
    PARTS.push({ poly: [[d[0], d[1]]].concat(rim), L: rim, R: null, c: rim });
  });
  // the carving order and how long each cut takes (in loop time)
  var CUTS = [0.028, 0.032, 0.022, 0.022, 0.036, 0.036, 0.01, 0.01, 0.01, 0.01], HOP = 0.005, CARVE0 = 0.055;
  var CUT_T = (function () { var o = [], t = CARVE0; CUTS.forEach(function (d) { o.push([t, t + d]); t += d + HOP; }); return o; })();
  var CARVE1 = CUT_T[CUT_T.length - 1][1];
  // k clockwise quarter turns: (u, v) -> (1 - v, u)
  function turn(p, k) { for (var i = 0; i < ((k % 4) + 4) % 4; i++) p = [1 - p[1], p[0]]; return p; }

  /* ------------------------------------------------------------------ places and timing */
  var MC = [-6.2, -3.2];                      // cutting mat centre
  var SQ = 1.3, H = SQ / 2, RUB = 0.08, MOUNT = 0.17; // stamp: 1.3 square, rubber on a wooden mount
  var COLS = 4, ROWS = 6, FX0 = -COLS * SQ / 2, TOWER = ROWS * SQ, DEPTH = 2.6;
  var CLEAR = [0.318, 0.345], INK = [0.352, 0.412], FLIP = [0.425, 0.49];
  var KEYGRID = [[0, 3], [1, 2]];            // rotation rule from the reference: up, left / right, down
  var PRINTS = (function () {
    var o = [], t = FLIP[1];
    [[0, 0.04], [2, 0.025]].forEach(function (blk) {
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function (q) {
        var c = blk[0] + q[0], r = ROWS - 2 + q[1];
        o.push({ c: c, r: r, k: KEYGRID[q[1]][q[0]], t0: t, d: blk[1] }); t += blk[1];
      });
    });
    return o;
  })();
  var HAND_END = PRINTS[PRINTS.length - 1].t0 + PRINTS[PRINTS.length - 1].d;
  (function () { // unwrap stamp angles so each turn takes the short way round
    var prev = 0;
    PRINTS.forEach(function (p) { var a = p.k * 90, d = ((a - prev) % 360 + 540) % 360 - 180; p.psi = prev + d; prev = p.psi; });
  })();
  function cellCentre(c, r) { return [FX0 + (c + 0.5) * SQ, 0, TOWER - (r + 0.5) * SQ]; }

  /* ------------------------------------------------------------------ camera */
  // [t, focus x, y, z, zoom, pitch, yaw]
  var KEYS = [[0, MC[0], MC[1], 0.25, 4.3, 52, 12], [0.3, MC[0], MC[1], 0.25, 4.6, 52, 12], [0.35, MC[0] + 0.1, MC[1], 0.25, 3.9, 50, 12],
              [0.42, MC[0] + 0.1, MC[1], 0.25, 3.9, 50, 12], [0.49, FX0 + SQ, 0, SQ, 2.3, 14, 18], [0.64, FX0 + SQ, 0, SQ, 2.4, 14, 18],
              [0.67, 0, 0, 1.45, 1.75, 14, 18], [0.75, 0, 0, 1.45, 1.75, 14, 18], [0.87, 0, 0, TOWER / 2, 1.02, 16, 22], [1, 0, 0, TOWER / 2, 1.02, 16, 22]];
  function camAt(t) {
    for (var i = 0; i < KEYS.length - 1; i++) {
      var a = KEYS[i], b = KEYS[i + 1];
      if (t <= b[0]) { var k = eio(seg(t, a[0], b[0])); return a.map(function (v, j) { return lerp(v, b[j], k); }); }
    }
    return KEYS[KEYS.length - 1];
  }
  function wrap(g, off) {
    function sh(p) { return [p[0] - off[0], p[1] - off[1], p[2] - off[2]]; }
    function shA(a) { return a.map(sh); }
    return {
      T: g.T, V: g.V, S: g.S, screen: g.screen,
      P: function (p) { return g.P(sh(p)); },
      poly: function (pts, m, o) { g.poly(shA(pts), m, o); },
      path: function (pts, o) { g.path(shA(pts), o); },
      dot: function (p, r, m, o) { g.dot(sh(p), r, m, o); },
      box8: function (C, m, o) { g.box8(shA(C), m, o); }
    };
  }

  /* ------------------------------------------------------------------ the stamp's pose */
  // C: centre of the rubber face; alpha tips it from face-up (0) to facing the wall (90 deg); psi spins it
  function basis(alpha, psi) {
    var s = Math.sin(psi * RAD), c = Math.cos(psi * RAD);
    return { A: rotXv([c, s, 0], -alpha * RAD), B: rotXv([-s, c, 0], -alpha * RAD), N: rotXv([0, 0, 1], -alpha * RAD) };
  }
  function stampPose(t) {
    var mat = [MC[0], MC[1], RUB + MOUNT];
    if (t < FLIP[0]) return { C: mat, alpha: 0, psi: 0, op: 1 };
    var first = PRINTS[0], fc = cellCentre(first.c, first.r), hover = add(fc, [0, -0.7, 0]);
    if (t < FLIP[1]) {
      var k = eio(seg(t, FLIP[0], FLIP[1]));
      var p = mix3(mat, hover, k); p[2] += 1.6 * Math.sin(Math.PI * k);
      return { C: p, alpha: 90 * eio(seg(t, FLIP[0] + 0.005, FLIP[1] - 0.01)), psi: 0, op: 1 };
    }
    for (var i = 0; i < PRINTS.length; i++) {
      var P = PRINTS[i], s = seg(t, P.t0, P.t0 + P.d);
      if (t > P.t0 + P.d && i < PRINTS.length - 1) continue;
      var cc = cellCentre(P.c, P.r), prev = i ? PRINTS[i - 1] : null;
      var from = prev ? cellCentre(prev.c, prev.r) : cc, psi0 = prev ? prev.psi : 0;
      var mv = eio(seg(s, 0, 0.45)), gap = 0.7 * (1 - eio(seg(s, 0.45, 0.6))) + 0.7 * eo(seg(s, 0.72, 1));
      var pos = mix3(from, cc, mv); pos[1] = -gap - (prev ? 0.25 * Math.sin(Math.PI * mv) : 0);
      if (t > P.t0 + P.d) { // done: fly off and fade
        var off = seg(t, HAND_END, HAND_END + 0.05);
        return { C: add([cc[0], -0.7, cc[2]], [2.2 * eo(off), -1.4 * eo(off), 0.8 * eo(off)]), alpha: 90, psi: P.psi + 90 * off, op: 1 - off };
      }
      return { C: pos, alpha: 90, psi: lerp(psi0, P.psi, mv), op: 1 };
    }
  }
  function printed(P, t) { return seg(t, P.t0 + P.d * 0.7, P.t0 + P.d * 0.78); }

  /* ------------------------------------------------------------------ drawing helpers */
  function tileDraw(G, map, col, o, clipU) {
    PARTS.forEach(function (pt) {
      var poly = clipU !== undefined ? clipHalf(pt.poly, function (q) { return clipU - q[0]; }) : pt.poly;
      if (poly.length > 2) G.poly(poly.map(map), col, o);
    });
  }
  function tube(G, a, b, w, core, o) {
    G.path([a, b], { color: G.T.line, w: w + 3, op: o.op, bias: o.bias });
    G.path([a, b], { color: core, w: w, op: o.op, bias: o.bias - 0.01 });
  }
  function curl(G, c, tdir, n, size, o) { // a curl of cut rubber
    var pts = [];
    for (var i = 0; i <= 7; i++) { var a = i / 7 * 1.6 * Math.PI, r = size * (1 - i / 10); pts.push(add(c, add(mul(tdir, r * Math.cos(a)), mul(n, size + r * Math.sin(a))))); }
    G.path(pts, o);
  }

  WL.define("facade", {
    cam: { yaw: 12, pitch: 52, S: 60, amp: 0, cy: 0.5, at: function (t) { var c = camAt(t); return { z: c[4], pitch: c[5], yaw: c[6] }; } },
    draw: function (g0, t) {
      var cam = camAt(t), G = wrap(g0, [cam[1], cam[2], cam[3]]), T = g0.T, M = T.mats, px = g0.S, V = g0.V;

      // ---- ground
      for (var gx = -10; gx <= 6.01; gx += 1) G.path([[gx, -6.5, 0], [gx, 4, 0]], { color: T.grid, w: 1, bias: 100 });
      for (var gy = -6.5; gy <= 4.01; gy += 1) G.path([[-10, gy, 0], [6, gy, 0]], { color: T.grid, w: 1, bias: 100 });

      // ---- the tower: facade face at y = 0, faint pencil grid for the tiles
      G.box8([[FX0, 0, 0], [-FX0, 0, 0], [-FX0, DEPTH, 0], [FX0, DEPTH, 0], [FX0, 0, TOWER], [-FX0, 0, TOWER], [-FX0, DEPTH, TOWER], [FX0, DEPTH, TOWER]], "paper", { bias: 20 });
      G.box8([[FX0 - 0.1, -0.1, TOWER], [-FX0 + 0.1, -0.1, TOWER], [-FX0 + 0.1, DEPTH + 0.1, TOWER], [FX0 - 0.1, DEPTH + 0.1, TOWER],
              [FX0 - 0.1, -0.1, TOWER + 0.16], [-FX0 + 0.1, -0.1, TOWER + 0.16], [-FX0 + 0.1, DEPTH + 0.1, TOWER + 0.16], [FX0 - 0.1, DEPTH + 0.1, TOWER + 0.16]], "sky", { bias: 19 });
      for (var c = 1; c < COLS; c++) G.path([[FX0 + c * SQ, -0.004, 0], [FX0 + c * SQ, -0.004, TOWER]], { color: T.soft, w: 1, op: 0.45, bias: 10 });
      for (var r = 1; r < ROWS; r++) G.path([[FX0, -0.004, r * SQ], [-FX0, -0.004, r * SQ]], { color: T.soft, w: 1, op: 0.45, bias: 10 });
      function wallMap(c, r, k, sc) {
        var cc = cellCentre(c, r);
        return function (q) { var p = turn(q, k); return [cc[0] + (p[0] - 0.5) * SQ * sc, -0.006, cc[2] - (p[1] - 0.5) * SQ * sc]; };
      }
      // hand-stamped prints
      PRINTS.forEach(function (P) {
        var a = printed(P, t);
        if (a > 0) tileDraw(G, wallMap(P.c, P.r, P.k, 1.006), "zing", { flat: true, stroke: false, op: a, bias: -20 });
      });
      // the rest of the tower follows the same rule, rising floor by floor
      for (r = 0; r < ROWS - 2; r++) for (c = 0; c < COLS; c++) {
        var ta = HAND_END + 0.02 + (ROWS - 3 - r) * 0.02 + c * 0.006, sa = back(seg(t, ta, ta + 0.03));
        if (sa > 0) tileDraw(G, wallMap(c, r, KEYGRID[r % 2][c % 2], sa * 1.006), "zing", { flat: true, stroke: false, op: clamp(sa), bias: -20 });
      }
      // a slow glint across the finished skin
      var gl = seg(t, 0.87, 0.93);
      if (gl > 0 && gl < 1) {
        var gxp = lerp(FX0 - 2, -FX0 + 0.5, gl);
        G.poly([[gxp, -0.01, 0], [gxp + 0.9, -0.01, 0], [gxp + 2.3, -0.01, TOWER], [gxp + 1.4, -0.01, TOWER]], "zing", { flat: true, stroke: false, op: 0.18 * Math.sin(Math.PI * gl), bias: -25 });
      }

      // ---- cutting mat
      var mat = [[MC[0] - 1.45, MC[1] - 1.1, 0.003], [MC[0] + 1.45, MC[1] - 1.1, 0.003], [MC[0] + 1.45, MC[1] + 1.1, 0.003], [MC[0] - 1.45, MC[1] + 1.1, 0.003]];
      G.poly(mat, "sky", { flat: true, bias: 60 });
      for (var mg = 1; mg < 12; mg++) G.path([[MC[0] - 1.45 + mg * 0.2417, MC[1] - 1.1, 0.004], [MC[0] - 1.45 + mg * 0.2417, MC[1] + 1.1, 0.004]], { color: T.soft, w: 1, op: 0.35, bias: 59 });
      for (mg = 1; mg < 9; mg++) G.path([[MC[0] - 1.45, MC[1] - 1.1 + mg * 0.2444, 0.004], [MC[0] + 1.45, MC[1] - 1.1 + mg * 0.2444, 0.004]], { color: T.soft, w: 1, op: 0.35, bias: 59 });

      // ---- the stamp
      var pose = stampPose(t), Bs = basis(pose.alpha, pose.psi), SC = pose.C, sop = pose.op * seg(t, 0.01, 0.04);
      function lp(a, b, cN) { return add(SC, add(add(mul(Bs.A, a), mul(Bs.B, b)), mul(Bs.N, cN))); }
      function slab(c0, c1, mat, o) { G.box8([lp(-H, -H, c0), lp(H, -H, c0), lp(H, H, c0), lp(-H, H, c0), lp(-H, -H, c1), lp(H, -H, c1), lp(H, H, c1), lp(-H, H, c1)], mat, o); }
      var stBias = pose.alpha > 45 ? -40 : 0;
      if (sop > 0.01) {
        slab(-RUB - MOUNT, -RUB, "wood", { op: sop, bias: stBias });
        slab(-RUB, 0, "brand", { op: sop, bias: stBias });
      }
      var faceMap = function (q) { return lp((q[0] - 0.5) * SQ, -(q[1] - 0.5) * SQ, 0.003); };
      var faceUp = dot(Bs.N, V) > 0.05, fb = stBias - 2;
      if (faceUp && sop > 0.01) {
        // cleared background sinks (wipes across), leaving the bands raised
        var clr = eio(seg(t, CLEAR[0], CLEAR[1]));
        if (clr > 0) {
          var bg = clipHalf([[0, 0], [1, 0], [1, 1], [0, 1]], function (q) { return clr * 1.02 - q[0]; });
          if (bg.length > 2) G.poly(bg.map(faceMap), "sky", { flat: true, stroke: false, op: sop, bias: fb });
          tileDraw(G, faceMap, "brand", { flat: true, stroke: false, op: sop, bias: fb - 0.5 }, clr * 1.02);
        }
        // white ink where the roller has passed
        var rollX = lerp(-0.25, 1.25, seg(t, INK[0], INK[1]));
        if (t > INK[0]) tileDraw(G, faceMap, "zing", { flat: true, stroke: false, op: sop, bias: fb - 1 }, rollX);
        // carved grooves, drawn on behind the gouge
        PARTS.forEach(function (pt, i) {
          var cp = seg(t, CUT_T[i][0], CUT_T[i][1]);
          if (cp <= 0) return;
          [pt.L, pt.R].forEach(function (ln) {
            if (!ln) return;
            var n = Math.max(2, Math.round(cp * (ln.length - 1)) + 1);
            G.path(ln.slice(0, n).map(faceMap), { color: "ink", w: 0.012 * px, op: sop, bias: fb - 1.5 });
          });
        });
      }

      // ---- step 1: the gouge, with curls of rubber flying off it
      var gOn = seg(t, CARVE0 - 0.02, CARVE0) * (1 - seg(t, CARVE1, CARVE1 + 0.02));
      if (gOn > 0.01) {
        var tip, dir, cut = false;
        for (var i = 0; i < CUT_T.length; i++) {
          var ln = PARTS[i].c;
          if (t < CUT_T[i][0]) { // hopping to the start of this cut
            var prevEnd = i ? PARTS[i - 1].c[PARTS[i - 1].c.length - 1] : [1.2, -0.3], hs = seg(t, i ? CUT_T[i - 1][1] : CARVE0 - 0.02, CUT_T[i][0]);
            var q0 = faceMap(prevEnd), q1 = faceMap(ln[0]);
            tip = add(mix3(q0, q1, eio(hs)), mul(Bs.N, 0.22 * Math.sin(Math.PI * hs)));
            dir = norm(sub(faceMap(ln[1]), q1));
            break;
          }
          if (t <= CUT_T[i][1]) {
            var cp = seg(t, CUT_T[i][0], CUT_T[i][1]), fi = cp * (ln.length - 1), j = Math.min(ln.length - 2, Math.floor(fi));
            var qa = ln[j], qb = ln[j + 1], fr = fi - j;
            tip = faceMap([lerp(qa[0], qb[0], fr), lerp(qa[1], qb[1], fr)]); dir = norm(sub(faceMap(qb), faceMap(qa))); cut = true;
            break;
          }
        }
        if (!tip) { var last = PARTS[PARTS.length - 1].c; tip = add(faceMap(last[last.length - 1]), mul(Bs.N, 0.6 * seg(t, CARVE1, CARVE1 + 0.02))); dir = [1, 0, 0]; }
        var hdl = norm(add(mul(dir, -0.75), mul(Bs.N, 0.66)));
        var gb = fb - 6;
        G.path([tip, add(tip, mul(hdl, 0.2))], { color: T.line, w: 0.03 * px, op: gOn, bias: gb });
        tube(G, add(tip, mul(hdl, 0.2)), add(tip, mul(hdl, 0.95)), 0.075 * px, "wood", { op: gOn, bias: gb - 0.1 });
      }
      // curls: pop out beside the cut, land on the block, get brushed off when the background is cleared
      var brush = seg(t, CLEAR[0], CLEAR[0] + 0.02);
      if (faceUp && t > CARVE0 && brush < 1) {
        for (var e = 0; e < 60; e++) {
          var te = CARVE0 + e * 0.0044, ci = -1;
          for (i = 0; i < CUT_T.length; i++) if (te >= CUT_T[i][0] && te <= CUT_T[i][1]) ci = i;
          if (ci < 0 || t < te) continue;
          var cl2 = PARTS[ci].c, cf = seg(te, CUT_T[ci][0], CUT_T[ci][1]) * (cl2.length - 1), cj = Math.min(cl2.length - 2, Math.floor(cf));
          var pa = faceMap(cl2[cj]), pb = faceMap(cl2[cj + 1]), td = norm(sub(pb, pa)), side = cross(Bs.N, td);
          var life = seg(t, te, te + 0.025), sgn = e % 2 ? 1 : -1;
          var pos = add(add(pa, mul(side, sgn * (0.09 + 0.12 * hash(e) * eo(life)))), mul(Bs.N, 0.18 * Math.sin(Math.PI * life)));
          curl(G, pos, td, Bs.N, 0.025 + 0.015 * hash(e * 3.3), { color: "brand", w: 0.012 * px, op: (1 - brush) * sop, bias: fb - 3 });
        }
      }

      // ---- step 2: the ink roller
      var rOn = seg(t, INK[0] - 0.012, INK[0]) * (1 - seg(t, INK[1], INK[1] + 0.012));
      if (rOn > 0.01) {
        var rs = seg(t, INK[0], INK[1]), rr = 0.14, lift = 0.4 * seg(t, INK[1], INK[1] + 0.012) + 0.4 * (1 - seg(t, INK[0] - 0.012, INK[0]));
        var rc = [MC[0] - H + lerp(-0.25, 1.25, rs) * SQ, MC[1], RUB + MOUNT + rr + lift], rb = fb - 6;
        var body = [];
        for (var k = 0; k < 16; k++) {
          var a0 = k / 16 * TAU, a1 = (k + 1) / 16 * TAU;
          var p0 = [rc[0] + rr * Math.cos(a0), rc[2] + rr * Math.sin(a0)], p1 = [rc[0] + rr * Math.cos(a1), rc[2] + rr * Math.sin(a1)];
          G.poly([[p0[0], MC[1] - 0.78, p0[1]], [p1[0], MC[1] - 0.78, p1[1]], [p1[0], MC[1] + 0.78, p1[1]], [p0[0], MC[1] + 0.78, p0[1]]], "zing", { stroke: false, op: rOn, bias: rb });
          body.push([p0[0], MC[1] - 0.78, p0[1]]);
        }
        G.poly(body, "zing", { op: rOn, bias: rb - 0.5 });
        var spin = -(rc[0] - MC[0]) / rr;   // a seam line shows the roll
        var sp = [rc[0] + rr * Math.cos(spin), rc[2] + rr * Math.sin(spin)];
        if (Math.sin(spin) < 0.3) G.path([[sp[0], MC[1] - 0.78, sp[1]], [sp[0], MC[1] + 0.78, sp[1]]], { color: "sky", w: 1.4, op: rOn, bias: rb - 0.6 });
        var yoke = [rc[0] - 0.42, MC[1], rc[2] + 0.34];
        [MC[1] - 0.82, MC[1] + 0.82].forEach(function (y) { G.path([[rc[0], y, rc[2]], [rc[0] - 0.2, y, rc[2] + 0.2], [yoke[0], MC[1] + (y - MC[1]) * 0.15, yoke[2]]], { color: T.line, w: 0.035 * px, op: rOn, bias: rb - 0.7 }); });
        tube(G, yoke, [rc[0] - 1.15, MC[1], rc[2] + 0.78], 0.09 * px, "wood", { op: rOn, bias: rb - 0.8 });
      }

      // ---- step 3: the arrow on the back of the stamp (its up)
      if (sop > 0.01 && dot(Bs.N, V) < -0.05) {
        var AR = [[-0.08, -0.35], [0.08, -0.35], [0.08, 0.04], [0.25, 0.04], [0, 0.4], [-0.25, 0.04], [-0.08, 0.04]];
        G.poly(AR.map(function (q) { return lp(q[0], -q[1], -RUB - MOUNT - 0.004); }), "#FF6000", { flat: true, stroke: false, op: sop, bias: stBias - 3 });
      }
    }
  });
})();

/* ---- fractal/fractal.js ---- */
;/* WonderLab "fractal" challenge, The Fractal Tree (Courses/14/cutout1.jpg; steps from the Fractal Foundation
 * "Fractal Cutout" fractivity): one sheet of paper is folded, cut, creased and pushed inside, again and again,
 * each round with cuts half as long as the last (1, then 2, 4 and 8 cuts).
 * Story: the sheet folds in half like a book; scissors cut from the fold halfway in, at mid-height; the flap folds
 * over to crease, opens and tucks inside; the card stands up, opens, and the first step grows out of the fold.
 * Then 2, 4 and 8 smaller cuts (on the closed card) pop smaller steps out of every valley fold: the spine above each
 * step and the two creases where a step meets the paper, never a step's front corner. That gives the photo's card: a big
 * step from the table to mid-height with half-size Sierpinski triangles above it and in the corners on either side.
 * Payoff: it is glued into an orange card that closes and opens again like a pop-up, orange in every hole.
 * The steps are a real mechanism: each pushed fold sits at C + (dA + dB) * s / 2 of its parent fold C (arms dA, dB,
 * arm length s), so they fold flat and stand up with the card. Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back;
  var OR = "#FF6000"; // the card stock the fractal is glued into (payoff)
  var W = 2.5, H = 3.0, S0 = W, N = 4, TH0 = 2; // page width (fold to open edge), height, fractal width (the full bottom edge: first cut halfway), cut rounds, closed-card angle (deg)

  // timeline (fractions of the loop)
  var FOLD = [0.035, 0.105], CUT1 = [0.115, 0.165], OVER = [0.17, 0.2], BACK = [0.2, 0.22], TUCK = [0.225, 0.25];
  var STAND = [0.255, 0.3], OPEN = [0.295, 0.355];
  // per round: cut start, cut end, pop start, pop end (round 1 is cut flat on the table and tucked in)
  var ROUNDS = [[CUT1[0], CUT1[1], TUCK[0], TUCK[1]], [0.37, 0.405, 0.41, 0.445], [0.455, 0.49, 0.495, 0.53], [0.54, 0.575, 0.58, 0.615]];
  var GLUE = [0.625, 0.675], CLOSE = [0.685, 0.735], REOPEN = [0.745, 0.81];

  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }
  function mix(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; }

  // drop repeated points and merge straight runs (a fold that turns back on itself is kept)
  function simplify(pts) {
    var out = [];
    pts.forEach(function (p) {
      var n = out.length;
      if (n && Math.hypot(p[0] - out[n - 1][0], p[1] - out[n - 1][1]) < 1e-7) return;
      if (n >= 2) {
        var a = out[n - 2], b = out[n - 1], d1 = sub(b, a), d2 = sub(p, b);
        var cr = d1[0] * d2[1] - d1[1] * d2[0], dt = d1[0] * d2[0] + d1[1] * d2[1];
        if (Math.abs(cr) < 1e-7 * Math.hypot(d1[0], d1[1]) * Math.hypot(d2[0], d2[1]) && dt > 0) { out[n - 1] = p; return; }
      }
      out.push(p);
    });
    return out;
  }

  /* The folded card as horizontal strips. Cross-section coordinates (x, z): page A runs along uA = (1, 0), page B
   * along uB = (cos th, sin th), the fold at the origin. F() returns strips whose polyline runs from the end of arm A
   * (C + dA s) through the valley fold C to the end of arm B. Each round cuts a valley fold at mid-height, s/2 deep, and
   * pushes the lower half out into a step (k = 0 flat, 1 popped). The next round's valley folds: the upper half of C, and
   * the step's two feet CA and CB, each with one arm along the paper and one up the step's face to its corner P. */
  function build(th, K, psi) {
    var uA = [1, 0], uB = [Math.cos(th), Math.sin(th)], cuts = [];
    function F(C, dA, dB, s, h0, h1, lvl) {
      var QA = add(C, mul(dA, s)), QB = add(C, mul(dB, s));
      if (lvl > N) return [{ h0: h0, h1: h1, pts: [QA, C, QB] }];
      var hm = (h0 + h1) / 2, hs = s / 2, CA = add(C, mul(dA, hs)), CB = add(C, mul(dB, hs)), P;
      if (lvl === 1 && psi > 0) { // round 1 creasing: the doubled flap swings up about its crease and lies over the card
        var v = sub(C, CA);
        P = add(CA, [v[0] * Math.cos(psi) + v[1] * Math.sin(psi), -v[0] * Math.sin(psi) + v[1] * Math.cos(psi)]);
      } else P = add(C, mul(add(dA, dB), hs * K[lvl - 1]));
      cuts.push({ lvl: lvl, h0: h0, hm: hm, C: C, CA: CA, CB: CB, P: P });
      var la = F(CA, dA, mul(sub(P, CA), 1 / hs), hs, h0, hm, lvl + 1); // QA .. P
      var lb = F(CB, mul(sub(P, CB), 1 / hs), dB, hs, h0, hm, lvl + 1); // P .. QB
      var up = F(C, dA, dB, hs, hm, h1, lvl + 1).map(function (st) { return { h0: st.h0, h1: st.h1, pts: [QA].concat(st.pts, [QB]) }; });
      return la.map(function (st, i) { return { h0: st.h0, h1: st.h1, pts: st.pts.concat(lb[i].pts) }; }).concat(up);
    }
    var EA = mul(uA, W), EB = mul(uB, W); // the paper runs on past the fractal to the open edge
    var strips = F([0, 0], uA, uB, S0, 0, H, 1).map(function (st) { return { h0: st.h0, h1: st.h1, pts: [EA].concat(st.pts, [EB]) }; });
    return { strips: strips, cuts: cuts, uA: uA, uB: uB };
  }

  // merge the strips' segments into flat faces: same line in the cross-section + overlapping in neighbouring strips
  function faces(strips) {
    var groups = [];
    strips.forEach(function (sp) {
      var pts = simplify(sp.pts);
      for (var j = 0; j + 1 < pts.length; j++) {
        var a = pts[j], b = pts[j + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (L < 1e-6) continue;
        var d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
        if (d[0] < -1e-9 || (Math.abs(d[0]) <= 1e-9 && d[1] < 0)) d = [-d[0], -d[1]];
        var c = d[0] * a[1] - d[1] * a[0], u0 = d[0] * a[0] + d[1] * a[1], u1 = d[0] * b[0] + d[1] * b[1], G = null;
        for (var q = 0; q < groups.length && !G; q++) {
          var g = groups[q];
          if (Math.abs(g.d[0] - d[0]) < 1e-6 && Math.abs(g.d[1] - d[1]) < 1e-6 && Math.abs(g.c - c) < 1e-6) G = g;
        }
        if (!G) { G = { d: d, c: c, items: [] }; groups.push(G); }
        G.items.push({ h0: sp.h0, h1: sp.h1, lo: Math.min(u0, u1), hi: Math.max(u0, u1) });
      }
    });
    var out = [];
    groups.forEach(function (G) {
      G.items.sort(function (a, b) { return a.h0 - b.h0 || a.lo - b.lo; });
      var chains = [];
      G.items.forEach(function (it) {
        var host = null;
        chains.forEach(function (ch) {
          var l = ch[ch.length - 1];
          if (!host && Math.abs(l.h1 - it.h0) < 1e-6 && Math.min(l.hi, it.hi) - Math.max(l.lo, it.lo) > 1e-6) host = ch;
        });
        if (host) host.push(it); else chains.push([it]);
      });
      var nrm = [-G.d[1], G.d[0]];
      chains.forEach(function (ch) {
        var ring = [];
        ch.forEach(function (it) { ring.push([it.hi, it.h0], [it.hi, it.h1]); });
        for (var i = ch.length - 1; i >= 0; i--) ring.push([ch[i].lo, ch[i].h1], [ch[i].lo, ch[i].h0]);
        ring = simplify(ring);
        out.push({ d: G.d, c: G.c, pts: ring.map(function (q) { var p = add(mul(G.d, q[0]), mul(nrm, G.c)); return [p[0], q[1], p[1]]; }) });
      });
    });
    return out;
  }

  // scissors icon (screen pixels): blade tips at q, pointing along angle a (radians), blades opening by o px
  function scissors(q, a, o, op) {
    var s = '<g transform="translate(' + q[0].toFixed(1) + " " + q[1].toFixed(1) + ") rotate(" + (a / RAD).toFixed(1) + ') scale(1.4)" opacity="' + op.toFixed(3) +
      '" fill="none" stroke="#EDF3F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
    s += '<path d="M2 ' + (-o).toFixed(1) + ' L-16 0 L-23 6"/><path d="M2 ' + o.toFixed(1) + ' L-16 0 L-23 -6"/>';
    s += '<circle cx="-28" cy="9" r="5.5"/><circle cx="-28" cy="-9" r="5.5"/><circle cx="-16" cy="0" r="1.6" fill="#EDF3F6"/></g>';
    return s;
  }

  WL.define("fractal", {
    cam: { yaw: 16, pitch: 56, S: 56, z: 1.95, cy: 0.52,
      at: function (t) {
        var s = eio(seg(t, 0.245, 0.34)), drift = eio(seg(t, 0.36, 0.9)), up = eio(seg(t, 0.62, 0.84));
        return { yaw: lerp(16, 12, s) - 36 * drift, pitch: lerp(56, 24, s) + 8 * up, z: lerp(1.95, 2.1, s), cy: lerp(0.52, 0.75, s) - 0.05 * up };
      } },
    draw: function (g, t) {
      var T = g.T;
      g.grid(5, 1);

      // ---- state: opening angle, creasing flap, pops, standing up
      var fk = eio(seg(t, FOLD[0], FOLD[1]));
      var thDeg = t < FOLD[1] + 0.01 ? lerp(180, TH0, fk) : lerp(TH0, 90, eio(seg(t, OPEN[0], OPEN[1])));
      thDeg += -74 * eio(seg(t, CLOSE[0], CLOSE[1])) + 74 * eio(seg(t, REOPEN[0], REOPEN[1]));
      var th = thDeg * RAD;
      var psi = Math.PI * (eio(seg(t, OVER[0], OVER[1])) - eio(seg(t, BACK[0], BACK[1])));
      var K = ROUNDS.map(function (r, i) { var x = seg(t, r[2], r[3]); return i === 0 ? eio(x) : back(x); });
      var sk = eio(seg(t, STAND[0], STAND[1])), sg = sk * Math.PI / 2;
      var tau = -thDeg / 2 * sk * RAD; // turn about the spine so the open card faces the camera
      // keep the card centred: flat sheet -> folded card on the table -> standing V
      var a1 = tau, a2 = tau - th;
      var Ot = [-W / 2 * fk, -H / 2], Os = [-W / 4 * (Math.cos(a1) + Math.cos(a2)), -W / 4 * (Math.sin(a1) + Math.sin(a2))];
      var O = mix(Ot, Os, sk);
      O[0] += 0.4 * sk * eio(seg(t, 0.36, 0.9)); // the camera swings to the front left: keep the card in the middle of the frame
      var cs = Math.cos(sg), sn = Math.sin(sg), ct = Math.cos(tau), st = Math.sin(tau);
      function rot(X, h, Z) { var y = h * cs - Z * sn, z = h * sn + Z * cs; return [X * ct - y * st, X * st + y * ct, z]; }
      function tf(X, h, Z) { var p = rot(X, h, Z); return [p[0] + O[0], p[1] + O[1], p[2]]; }
      function at(p2, h) { return tf(p2[0], h, p2[1]); }
      function side(n) { var w = rot(n[0], 0, n[1]); return w[0] * g.V[0] + w[1] * g.V[1] + w[2] * g.V[2] > 0 ? 1 : -1; }
      var sideA = side([0, 1]), sideB = side([Math.sin(th), -Math.cos(th)]); // inner faces of the pages seen (+1) or their backs (-1)
      var table = sk < 0.02;

      var C = build(th, K, psi);
      var canon = function (u) { return u[0] < -1e-9 || (Math.abs(u[0]) <= 1e-9 && u[1] < 0) ? [-u[0], -u[1]] : u; };
      var cA = canon(C.uA), cB = canon(C.uB);
      var same = function (a, b) { return Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6; };

      // ---- orange card stock behind the pages (payoff)
      var gk = eo(seg(t, GLUE[0], GLUE[1]));
      if (gk > 0) {
        var off = 0.03 + 0.3 * (1 - gk), m = 0.1;
        var corner = [-off * (1 + Math.cos(th)) / Math.sin(th), -off]; // where the two offset planes meet at the spine
        [[C.uA, [0, 1], sideA], [C.uB, [Math.sin(th), -Math.cos(th)], sideB]].forEach(function (pg) {
          var e = add(mul(pg[0], W + m), mul(pg[1], -off));
          g.poly([at(corner, 0), at(e, 0), at(e, H + m), at(corner, H + m)], OR, { flat: true, op: Math.min(1, gk * 6), bias: 9 * pg[2], w: 1.4 });
        });
      }

      // ---- the paper: pages first when their inner side faces us (we look into the card), last when we see their backs.
      // Standing, the steps are vertical walls: sort them by depth across the floor (hz cancels the height term).
      var hz = function (h) { return sk * g.V[2] * h; };
      faces(C.strips).forEach(function (f) {
        var bias = psi > 0.001 ? -9 : 0, hs = 0; // the creasing flap lies over the closed card
        f.pts.forEach(function (p) { hs += p[1]; });
        bias += hz(hs / f.pts.length);
        if (Math.abs(f.c) < 1e-6) {
          if (same(f.d, cA)) bias = 8 * sideA;
          else if (same(f.d, cB)) bias = 8 * sideB;
        }
        g.poly(f.pts.map(function (p) { return tf(p[0], p[1], p[2]); }), "paper", { bias: bias, w: 1.5 });
      });

      // dashed fold line down the middle of the flat sheet, just before it folds
      var guide = seg(t, 0.008, 0.022) * (1 - seg(t, FOLD[0] + 0.01, FOLD[0] + 0.025));
      if (guide > 0) g.path([at([0, 0], 0), at([0, 0], H * eo(seg(t, 0.008, 0.03)))], { w: 1.4, dash: "6 6", op: guide, bias: -10 });

      // ---- cuts (from the fold, half as deep as the last round) and dashed creases, gone once the step has popped
      var lineBias = table ? -10 : -0.3;
      C.cuts.forEach(function (c) {
        var r = ROUNDS[c.lvl - 1], p = eio(seg(t, r[0], r[1])), fade = 1 - seg(t, r[2] + (c.lvl === 1 ? 0 : 0.01), r[3]);
        if (p <= 0 || fade <= 0) return;
        var tipA = mix(c.C, c.CA, p), tipB = mix(c.C, c.CB, p);
        var lb = lineBias + hz(c.hm);
        g.path([at(tipA, c.hm), at(c.C, c.hm), at(tipB, c.hm)], { w: 2.2, op: fade, bias: lb });
        var cr = seg(t, r[1] - 0.01, r[1] + 0.012) * fade;
        if (c.lvl === 1) cr = seg(t, CUT1[1], CUT1[1] + 0.012) * (1 - seg(t, TUCK[0], TUCK[0] + 0.01));
        if (cr > 0) [c.CA, c.CB].forEach(function (q) { g.path([at(q, c.h0), at(q, c.hm)], { w: 1.3, dash: "5 5", op: 0.85 * cr, bias: lineBias + hz((c.h0 + c.hm) / 2) }); });
        if (p < 1) {
          if (c.lvl === 1) {
            var q0 = g.P(at(c.C, c.hm)), q1 = g.P(at(tipB, c.hm)), ang = Math.atan2(q1[1] - q0[1], q1[0] - q0[0]);
            var so = seg(t, r[0] - 0.012, r[0]) * (1 - seg(t, r[1], r[1] + 0.012));
            g.screen(scissors([q1[0] + 5 * Math.cos(ang), q1[1] + 5 * Math.sin(ang)], ang, 2 + 4 * Math.abs(Math.sin(t * 260)), so));
          } else {
            g.dot(at(tipA, c.hm), 3.2, "zing", { stroke: false, bias: lb - 0.1 });
            g.dot(at(tipB, c.hm), 3.2, "zing", { stroke: false, bias: lb - 0.1 });
          }
        }
        // a ring where each new step pops out
        var ring = seg(t, r[3] - 0.012, r[3] + 0.02);
        if (c.lvl > 1 && c.lvl < N && ring > 0 && ring < 1) {
          var q = g.P(at(c.P, (c.h0 + c.hm) / 2));
          g.screen('<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (3 + 13 * eo(ring)).toFixed(1) + '" fill="none" stroke="' + T.line + '" stroke-width="1.6" opacity="' + (0.9 * (1 - ring)).toFixed(3) + '"/>');
        }
      });
    }
  });
})();

/* ---- lampshade/lampshade.js ---- */
;/* WonderLab "Shadow-Casting Lampshade" challenge: a quick flip through ten folded / cut paper shades
 * (from the Courses/11 reference board). The bulb stays lit, each shade turns slowly, and every strip,
 * fin or panel throws a true projected shadow on the wall and floor; cut-outs let light back through.
 * One design every 1.4 s, swapped with a card-flip; loops seamlessly.
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eio = U.eio, lerp = U.lerp, clamp = U.clamp;

  var L = [0, 0, 2.35];                 // bulb
  var YW = 2.4, XW = 6, ZW = 4.6;       // back wall plane y = YW
  var YF = -6;                          // floor from y = YF to the wall

  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function cyl(r, th, z) { return [r * Math.cos(th), r * Math.sin(th), z]; }
  function tan(th) { return [-Math.sin(th), Math.cos(th), 0]; }
  // ribbon along a centreline: pts[i] with width direction dirs[i]
  function ribbon(out, pts, dirs, w) {
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1], da = dirs[i], db = dirs[i + 1], h = w / 2;
      out.push([[a[0] - da[0] * h, a[1] - da[1] * h, a[2] - da[2] * h], [b[0] - db[0] * h, b[1] - db[1] * h, b[2] - db[2] * h],
                [b[0] + db[0] * h, b[1] + db[1] * h, b[2] + db[2] * h], [a[0] + da[0] * h, a[1] + da[1] * h, a[2] + da[2] * h]]);
    }
  }
  // strip between two points on a surface of revolution (r, theta, z), sampled n times
  function helixStrip(out, r0, th0, z0, r1, th1, z1, w, n) {
    var P = [], Dd = [];
    for (var k = 0; k <= n; k++) { var s = k / n, th = lerp(th0, th1, s); P.push(cyl(lerp(r0, r1, s), th, lerp(z0, z1, s))); Dd.push(tan(th)); }
    ribbon(out, P, Dd, w);
  }

  var D = [];

  // 1. woven lattice cylinder: diamond slots in a closed tube (open top + bottom)
  (function () {
    var S = [], H = [], R = 0.48, n = 24, z0 = -0.62, z1 = 0.5;
    for (var i = 0; i < n; i++) { var a = i / n * TAU, b = (i + 1) / n * TAU; S.push([cyl(R, a, z0), cyl(R, b, z0), cyl(R, b, z1), cyl(R, a, z1)]); }
    for (var row = 0; row < 8; row++) for (var k = 0; k < 12; k++) {
      var zc = -0.52 + row * 0.13, tc = (k + 0.5 * (row % 2)) * 30 * RAD, dt = 9 * RAD, dz = 0.052, r = R * 1.01;
      H.push([cyl(r, tc - dt, zc), cyl(r, tc, zc - dz), cyl(r, tc + dt, zc), cyl(r, tc, zc + dz)]);
    }
    D.push({ S: S, H: H });
  })();
  // 2. twisted cone of crossing strips
  (function () {
    var S = [];
    for (var f = -1; f <= 1; f += 2) for (var k = 0; k < 14; k++) { var th = k / 14 * TAU; helixStrip(S, 0.26, th, -0.72, 0.56, th + f * 100 * RAD, 0.55, 0.07, 8); }
    D.push({ S: S, H: [] });
  })();
  // 3. paper-fringe globe: fine meridian strips
  (function () {
    var S = [], R = 0.6;
    for (var k = 0; k < 40; k++) {
      var th = k / 40 * TAU, P = [], Dd = [];
      for (var j = 0; j <= 8; j++) { var ph = lerp(14, 166, j / 8) * RAD; P.push(cyl(R * Math.sin(ph), th, R * Math.cos(ph))); Dd.push(tan(th)); }
      ribbon(S, P, Dd, 0.028);
    }
    D.push({ S: S, H: [] });
  })();
  // 4. twisted ribbon loop (nest)
  function band(S, R, amp, lobes, w, twist, rotZ, tiltX) {
    var P = [], Dd = [], n = 56, ct = Math.cos(tiltX), st = Math.sin(tiltX);
    function tf(p) { var y = p[1] * ct - p[2] * st, z = p[1] * st + p[2] * ct, x = p[0]; return [x * Math.cos(rotZ) - y * Math.sin(rotZ), x * Math.sin(rotZ) + y * Math.cos(rotZ), z]; }
    for (var i = 0; i <= n; i++) {
      var th = i / n * TAU, ph = twist * th, c = [R * Math.cos(th), R * Math.sin(th), amp * Math.sin(lobes * th)];
      var d = [Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph)];
      P.push(tf(c)); Dd.push(tf(d));
    }
    ribbon(S, P, Dd, w);
  }
  (function () { var S = []; band(S, 0.62, 0.22, 2, 0.46, 1, 0, 0); D.push({ S: S, H: [] }); })();
  // 5. the rose: overlapping twisted bands
  (function () { var S = []; for (var b = 0; b < 3; b++) band(S, 0.46, 0.1, 3, 0.34, 1, b * 120 * RAD, 22 * RAD); D.push({ S: S, H: [] }); })();
  // 6. the braid: squat drum woven from diagonal strips
  (function () {
    var S = [];
    for (var f = -1; f <= 1; f += 2) for (var k = 0; k < 18; k++) { var th = k / 18 * TAU; helixStrip(S, 0.7, th, -0.2, 0.7, th + f * 42 * RAD, 0.2, 0.09, 4); }
    D.push({ S: S, H: [] });
  })();
  // 7. sliced sphere: radial fins
  (function () {
    var S = [], R = 0.58, off = 0.03;
    for (var k = 0; k < 18; k++) {
      var th = k / 18 * TAU, c = Math.cos(th), s = Math.sin(th), prof = [];
      for (var j = 0; j <= 10; j++) { var zz = lerp(-0.55, 0.55, j / 10); prof.push([Math.sqrt(Math.max(0.01, R * R - zz * zz)), zz]); }
      prof.push([0.1, 0.55], [0.1, -0.55]);
      S.push(prof.map(function (p) { return [p[0] * c - off * s, p[0] * s + off * c, p[1]]; }));
    }
    D.push({ S: S, H: [] });
  })();
  // 8. slatted cylinder with a slight spiral
  (function () { var S = []; for (var k = 0; k < 30; k++) { var th = k / 30 * TAU; helixStrip(S, 0.42, th, -0.62, 0.42, th + 16 * RAD, 0.55, 0.055, 3); } D.push({ S: S, H: [] }); })();
  // 9. hyperboloid of straight twisted slats
  (function () {
    var S = [];
    for (var k = 0; k < 22; k++) {
      var th = k / 22 * TAU, a = cyl(0.22, th, -0.9), b = cyl(0.62, th + 130 * RAD, 0.55), P = [], Dd = [];
      for (var j = 0; j <= 6; j++) { var p = l3(a, b, j / 6); P.push(p); Dd.push(tan(Math.atan2(p[1], p[0]))); }
      ribbon(S, P, Dd, 0.05);
    }
    D.push({ S: S, H: [] });
  })();
  // 10. die-cut hexagonal tiers with triangle cut-outs
  (function () {
    var S = [], H = [], R = 0.56;
    [[-0.5, -0.18, 0], [-0.16, 0.16, 30], [0.18, 0.5, 0]].forEach(function (T) {
      for (var i = 0; i < 6; i++) {
        var a = (i * 60 + T[2]) * RAD, b = ((i + 1) * 60 + T[2]) * RAD, c = [cyl(R, a, T[0]), cyl(R, b, T[0]), cyl(R, b, T[1]), cyl(R, a, T[1])];
        S.push(c);
        var bil = function (s, t) { return l3(l3(c[0], c[1], s), l3(c[3], c[2], s), t).map(function (v, j) { return j < 2 ? v * 1.01 : v; }); };
        H.push([bil(0.22, 0.2), bil(0.5, 0.8), bil(0.78, 0.2)]);
      }
    });
    D.push({ S: S, H: H });
  })();

  // ---- shadow projection from the bulb
  function clipAxis(poly, ax, v, ge) {
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length], ia = ge ? a[ax] >= v : a[ax] <= v, ib = ge ? b[ax] >= v : b[ax] <= v;
      if (ia) out.push(a);
      if (ia !== ib) out.push(l3(a, b, (v - a[ax]) / (b[ax] - a[ax])));
    }
    return out;
  }
  // wall takes rays heading to +y that meet it above the floor; floor takes rays heading down that land before the wall
  function onWall(poly) {
    var q = clipAxis(poly, 1, L[1] + 0.02, true);
    if (q.length < 3) return null;
    q = q.map(function (p) { var s = (YW - L[1]) / (p[1] - L[1]); return [L[0] + (p[0] - L[0]) * s, YW - 0.01, L[2] + (p[2] - L[2]) * s]; });
    q = clipAxis(clipAxis(clipAxis(clipAxis(q, 2, 0, true), 2, ZW, false), 0, -XW, true), 0, XW, false);
    return q.length > 2 ? q : null;
  }
  function onFloor(poly) {
    var q = clipAxis(poly, 2, L[2] - 0.02, false);
    if (q.length < 3) return null;
    q = q.map(function (p) { var s = -L[2] / (p[2] - L[2]); return [L[0] + (p[0] - L[0]) * s, L[1] + (p[1] - L[1]) * s, 0.004]; });
    q = clipAxis(clipAxis(clipAxis(clipAxis(q, 1, YF, true), 1, YW, false), 0, -XW, true), 0, XW, false);
    return q.length > 2 ? q : null;
  }
  function ellipse(cx, cz, rx, rz, onW) {
    var o = [];
    for (var k = 0; k < 40; k++) { var a = k / 40 * TAU; o.push(onW ? [cx + rx * Math.cos(a), YW - 0.005, cz + rz * Math.sin(a)] : [cx + rx * Math.cos(a), cz + rz * Math.sin(a), 0.003]); }
    return onW ? clipAxis(clipAxis(o, 2, 0, true), 2, ZW, false) : clipAxis(o, 1, YW, false);
  }

  var N = D.length, FLIP = 0.16; // fraction of a slot spent flipping (half out, half in)

  WL.define("lampshade", {
    seamless: true,
    cam: { yaw: 14, pitch: 12, S: 60, amp: 0, z: 1.75, cy: 0.72 },
    draw: function (g, t) {
      var T = g.T, Z = T.mats.zing;
      var slot = clamp(t, 0, 0.99999) * N, idx = Math.floor(slot), f = slot - idx, d = D[idx];
      // card flip: squash to a sliver at the end of a slot, open up at the start of the next
      var k = Math.min(eio(seg(f, 0, FLIP / 2)), 1 - eio(seg(f, 1 - FLIP / 2, 1)));
      k = Math.max(k, 0.02);
      var rot = t * TAU + 20 * RAD * Math.sin(t * TAU * N), cs = Math.cos(rot), sn = Math.sin(rot);
      function place(p) { var x = p[0] * cs - p[1] * sn, y = p[0] * sn + p[1] * cs; return [L[0] + x * k, L[1] + y, L[2] + p[2]]; }

      // room + light falloff on wall and floor
      g.poly([[-XW, YW, 0], [XW, YW, 0], [XW, YW, ZW], [-XW, YW, ZW]], "paper", { flat: true, w: 1.2, bias: 8 });
      g.poly([[-XW, YF, 0], [XW, YF, 0], [XW, YW, 0], [-XW, YW, 0]], "wood", { flat: true, w: 1.2, bias: 20 }); // floor first: its overlays sit deeper than its centre
      [7, 6, 5.1, 4.3, 3.6, 3, 2.4, 1.9].forEach(function (r, i) { // stacked soft steps read as falloff
        var w = ellipse(0, L[2], r, r * 0.8, true), fl = ellipse(0, 0.9, r * 0.95, r * 0.75, false);
        if (w.length > 2) g.poly(w, Z, { flat: true, stroke: false, fillOp: 0.055, bias: 7.8 - i * 0.02 });
        if (fl.length > 2) g.poly(fl, Z, { flat: true, stroke: false, fillOp: 0.07, bias: 14 - i * 0.02 });
      });

      // shadows, then light back through the cut-outs
      var S = d.S.map(function (p) { return p.map(place); }), H = d.H.map(function (p) { return p.map(place); });
      S.forEach(function (p) {
        var w = onWall(p), fl = onFloor(p);
        if (w) g.poly(w, "paper", { flat: true, stroke: false, fillOp: 0.88, bias: 6 });
        if (fl) g.poly(fl, "wood", { flat: true, stroke: false, fillOp: 0.88, bias: 13 });
      });
      H.forEach(function (p) {
        var w = onWall(p), fl = onFloor(p);
        if (w) g.poly(w, Z, { flat: true, stroke: false, fillOp: 0.5, bias: 5.5 });
        if (fl) g.poly(fl, Z, { flat: true, stroke: false, fillOp: 0.45, bias: 12.9 });
      });

      // cord, bulb, the shade itself
      g.line([L[0], L[1], ZW], [L[0], L[1], L[2] + 0.1], { color: T.line, w: 1.6, bias: -0.1 });
      [3.2, 2.2, 1.5].forEach(function (r, i) { g.dot(L, 9 * r, Z, { stroke: false, op: 0.07 * (i + 1), bias: -0.04 }); });
      g.dot(L, 7, "#FF6000", { bias: -0.05 }); // WonderLab orange bulb
      S.forEach(function (p) { g.poly(p, "paper", { w: 0.9 }); });
      H.forEach(function (p) { g.poly(p, Z, { flat: true, w: 0.8, bias: -0.02 }); });

      // progress: one dot per design
      for (var i = 0; i < N; i++) {
        var on = i === idx;
        g.screen('<circle cx="' + (480 - (N - 1) * 9 + i * 18) + '" cy="690" r="' + (on ? 4.5 : 3) + '" fill="' + (on ? Z : "none") + '" stroke="' + T.line + '" stroke-width="1.4" opacity="' + (on ? 1 : 0.55) + '"/>');
      }
    }
  });
})();

/* ---- rain/rain.js ---- */
;/* WonderLab "rain" challenge, The Rainwater Harvesting Roof (no course photo: from the brief). Design roof gutters and a
 * catchment from plastic cups and straws, then pour measured water to see how well they drain. 11 s.
 * Story: 1. a card model house folds up on the table. 2. a straw is slit along its length; its lower half flies up under
 * the front eave as the gutter and is taped on; a second straw drops from the gutter's end as the downpipe; a clear
 * measuring cup lands under it. 3. a watering can swoops in and showers the roof: drops splash, rivulets run down the
 * slope, the gutter carries them to the corner, the downpipe pours into the cup and the level climbs. 4. payoff: the can
 * lifts away, the last water runs in and the level settles on the cup's orange target line: a tick.
 * World units, table z = 0, ridge along x, the gutter side faces -y (towards the camera). Pure function of t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back, hash = U.hash, frac = U.frac;
  var OR = "#FF6000"; // WonderLab orange: the target line and the tick
  var DUR = 11;

  // house: walls x +-HX, y +-HY, WH high; ridge along x at RZ; roof overhangs OX at the gables, eaves at y = +-EY
  var HX = 1.1, HY = 0.7, WH = 1.3, RZ = 2.0, OX = 0.12, EY = 0.85, EZ = RZ - EY;
  // gutter: half a straw, axis from GA to GB (falls towards +x), radius GR; downpipe at x = PX; cup under it
  var GA = [-1.24, -0.98, 1.1], GB = [1.36, -0.98, 1.05], GR = 0.12, PX = 1.26;
  var CUP = [PX, -0.98], CH = 0.64, CRB = 0.17, CRT = 0.25, TARGET = 0.48;

  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function gz(x) { return lerp(GA[2], GB[2], (x - GA[0]) / (GB[0] - GA[0])); } // gutter axis height at x

  // timeline
  var HOUSE = [0.0, 0.08], STRAW = [0.075, 0.1], CUT = [0.1, 0.135], FLIP = [0.135, 0.17], FLY = [0.16, 0.235],
      TAPE = [0.235, 0.26], PIPE = [0.25, 0.3], CUPIN = [0.27, 0.33], CAN_IN = [0.33, 0.39], TILT = [0.37, 0.42],
      SHOWER = [0.41, 0.74], TILT_BACK = [0.73, 0.77], CAN_OUT = [0.76, 0.83], FILL = [0.5, 0.86], WIN = [0.86, 0.9];

  // part of a straw around the axis a -> b: the cross-section point at angle q is y = r cos q, z = -r sin q, so
  // q in [0, pi] is the lower half (the trough) and [pi, 2 pi] the upper half; o.tf moves the points
  function trough(g, a, b, r, q0, q1, o) {
    var n = 6, prev = null, f = o.tf || function (p) { return p; };
    for (var k = 0; k <= n; k++) {
      var q = lerp(q0, q1, k / n), off = [0, r * Math.cos(q), -r * Math.sin(q)];
      var pa = f(add(a, off)), pb = f(add(b, off));
      if (prev) g.poly([prev[0], prev[1], pb, pa], "paper", { op: o.op, bias: o.bias || 0, w: 1.3 });
      prev = [pa, pb];
    }
  }

  // clear plastic measuring cup at (c[0], c[1]) on the table with water up to L
  function cup(g, c, L, op, win) {
    var T = g.T, hv = Math.atan2(g.V[1], g.V[0]); // towards the camera
    function P(q, z) { var r = lerp(CRB, CRT, z / CH); return [c[0] + r * Math.cos(q), c[1] + r * Math.sin(q), c[2] + z]; }
    function arc(z, q0, q1, n) { var pts = []; for (var k = 0; k <= n; k++) pts.push(P(lerp(q0, q1, k / n), z)); return pts; }
    var f0 = hv - Math.PI / 2, f1 = hv + Math.PI / 2;
    g.path(arc(0, 0, TAU, 28), { color: T.line, w: 1.2, op: op * 0.7, bias: 0.4 });
    g.poly(arc(0, f0, f1, 14).concat(arc(CH, f1, f0, 14)), T.line, { flat: true, stroke: false, fillOp: 0.06, op: op, bias: 0.05 });
    if (L > 0.005) {
      g.poly(arc(0.004, f0, f1, 14).concat(arc(L, f1, f0, 14)), T.line, { flat: true, stroke: false, fillOp: 0.2, op: op, bias: 0.02 });
      g.poly(arc(L, 0, TAU, 28), T.line, { flat: true, fillOp: 0.24, strokeColor: "line", w: 1.3, op: op, bias: 0.01 });
    }
    [f0, f1].forEach(function (q) { g.path([P(q, 0), P(q, CH)], { color: T.line, w: 1.6, op: op, bias: -0.03 }); });
    g.path(arc(CH, 0, TAU, 28), { color: T.line, w: 1.7, op: op, bias: -0.04 });
    // measuring marks on the front, the top one (the target) orange
    [0.12, 0.24, 0.36].forEach(function (z) { g.path(arc(z, hv - 0.35, hv - 0.05, 4), { color: T.line, w: 1.4, op: op * 0.8, bias: -0.05 }); });
    g.path(arc(TARGET, hv - 0.55, hv + 0.15, 8), { color: OR, w: 2.2 + 2.2 * win, op: op, bias: -0.06 });
  }

  // watering can: body axis z at the origin, spout towards +x; f maps local -> world
  function can(g, f, op) {
    var n = 16, R = 0.24, H = 0.21, top = [], bot = [];
    for (var k = 0; k < n; k++) {
      var a0 = k / n * TAU, a1 = (k + 1) / n * TAU;
      var p = [R * Math.cos(a0), 0.85 * R * Math.sin(a0)], q = [R * Math.cos(a1), 0.85 * R * Math.sin(a1)];
      g.poly([f([p[0], p[1], -H]), f([q[0], q[1], -H]), f([q[0], q[1], H]), f([p[0], p[1], H])], "paper", { cull: true, stroke: false, op: op });
      top.push(f([p[0], p[1], H])); bot.push(f([p[0], p[1], -H]));
    }
    g.poly(top, "paper", { cull: true, op: op, w: 1.4 });
    g.poly(bot.slice().reverse(), "paper", { cull: true, op: op, w: 1.4 });
    // outline of the body: the two rims as lines so it reads without fills
    g.path(top.concat([top[0]]), { color: g.T.line, w: 1.4, op: op, bias: -0.01 });
    g.path(bot.concat([bot[0]]), { color: g.T.line, w: 1.4, op: op * 0.6, bias: 0.01 });
    var hv = Math.atan2(g.V[1], g.V[0]);
    // spout and rose
    g.tube(f([0.18, 0, -0.12]), f([0.62, 0, 0.2]), { w: 6, op: op, bias: -0.02 });
    var d = [0.44, 0, 0.32], dl = Math.hypot(d[0], d[2]); d = [d[0] / dl, 0, d[2] / dl];
    var u = [-d[2], 0, d[0]], rose = [], c = [0.62 + d[0] * 0.06, 0, 0.2 + d[2] * 0.06];
    for (var j = 0; j < 14; j++) { var a = j / 14 * TAU; rose.push(f([c[0] + 0.085 * (Math.cos(a) * u[0]), 0.085 * Math.sin(a), c[2] + 0.085 * Math.cos(a) * u[2]])); }
    g.poly(rose, "paper", { op: op, w: 1.4, bias: -0.03 });
    // handle over the top
    var hp = [];
    for (var m = 0; m <= 12; m++) { var b = Math.PI * m / 12; hp.push(f([-0.02 - 0.17 * Math.cos(b), 0, H + 0.2 * Math.sin(b)])); }
    g.path(hp, { color: g.T.line, w: 5.5, op: op, bias: -0.02 });
    g.path(hp, { color: "paper", w: 3, op: op, bias: -0.021 });
    return f(c);
  }

  WL.define("rain", {
    cam: { yaw: 14, pitch: 26, S: 56, z: 2.3,
      at: function (t) {
        var push = eio(seg(t, 0.77, 0.9));
        var yaw = lerp(12, 34, eio(seg(t, 0, 0.8))) + 8 * push, pitch = lerp(27, 21, eio(seg(t, 0.25, 0.8))) + 3 * push;
        var z = lerp(lerp(2.25, 2.5, eio(seg(t, 0.25, 0.75))), 3.5, push);
        // keep the focus point in the middle of the frame: the house, then the cup
        var F = l3([0.1, -0.3, 1.45], [PX - 0.05, -0.98, 0.42], push);
        var c = Math.cos(yaw * RAD), s = Math.sin(yaw * RAD), S = 56 * z;
        var dx = S * (F[0] * c - F[1] * s), dy = -S * (F[2] * Math.cos(pitch * RAD) + (F[0] * s + F[1] * c) * Math.sin(pitch * RAD));
        return { yaw: yaw, pitch: pitch, z: z, cx: 0.5 - dx / 960, cy: 0.52 - dy / 720 };
      } },
    draw: function (g, t) {
      var T = g.T;
      g.grid(5, 1);

      // ---- 1. the house folds up: walls rise, the roof panels come down onto them
      var wa = eo(seg(t, HOUSE[0], HOUSE[0] + 0.05)), ra = eo(seg(t, HOUSE[0] + 0.03, HOUSE[1])), da = seg(t, 0.05, 0.09);
      if (wa > 0) {
        var wh = WH * wa;
        g.box(-HX, -HY, 0, 2 * HX, 2 * HY, wh, "paper", { op: wa, cull: true, bias: 0.2 });
        if (ra > 0) {
          var dz = 0.7 * (1 - ra), o = { op: ra, w: 1.5 };
          g.poly([[-HX - OX, 0, RZ + dz], [HX + OX, 0, RZ + dz], [HX + OX, -EY, EZ + dz], [-HX - OX, -EY, EZ + dz]], "paper", o);
          g.poly([[-HX - OX, 0, RZ + dz], [HX + OX, 0, RZ + dz], [HX + OX, EY, EZ + dz], [-HX - OX, EY, EZ + dz]], "paper", { op: ra, w: 1.5, bias: 0.3 });
          [-HX, HX].forEach(function (x) { g.poly([[x, -HY, WH], [x, HY, WH], [x, 0, RZ - 0.02 + dz]], "paper", { op: ra, w: 1.4, bias: 0.1 }); });
        }
        if (da > 0) { // door, windows, a round gable window
          var y = -HY - 0.004, lo = { color: T.line, w: 1.3, op: da, bias: -0.15 };
          g.path([[-0.25, y, 0], [-0.25, y, 0.7], [0.15, y, 0.7], [0.15, y, 0]], lo);
          [[-0.85, -0.5], [0.45, 0.8]].forEach(function (wx) {
            g.path([[wx[0], y, 0.55], [wx[1], y, 0.55], [wx[1], y, 0.95], [wx[0], y, 0.95], [wx[0], y, 0.55]], lo);
            g.path([[(wx[0] + wx[1]) / 2, y, 0.55], [(wx[0] + wx[1]) / 2, y, 0.95]], lo);
          });
          var ring = []; for (var k = 0; k <= 16; k++) { var a = k / 16 * TAU; ring.push([HX + 0.004, 0.12 * Math.cos(a), 1.55 + 0.12 * Math.sin(a)]); }
          g.path(ring, lo);
        }
      }

      // ---- 2. the straw: lies in front of the house, is slit along its top, the upper half flips away, the trough flies up
      var sa = eo(seg(t, STRAW[0], STRAW[1])), cut = seg(t, CUT[0], CUT[1]), flip = eio(seg(t, FLIP[0], FLIP[1])), fly = eio(seg(t, FLY[0], FLY[1]));
      var TA = [-1.1, -1.75, 0.1], TB = [1.5, -1.75, 0.06];
      if (sa > 0) {
        var arcUp = 0.9 * Math.sin(Math.PI * fly);
        var A = add(l3(TA, GA, fly), [0, 0, arcUp]), B = add(l3(TB, GB, fly), [0, 0, arcUp]);
        trough(g, A, B, GR, 0, Math.PI, { op: sa, bias: -0.2 });
        // end caps of the trough so it reads as a half pipe
        [A, B].forEach(function (e) {
          var cap = []; for (var k = 0; k <= 8; k++) { var q = Math.PI * k / 8; cap.push(add(e, [0, GR * Math.cos(q), -GR * Math.sin(q)])); }
          g.path(cap, { color: T.line, w: 1.4, op: sa, bias: -0.25 });
        });
        if (flip < 1) { // the upper half, lifted and turned away as it fades
          var lift = [0.15 * flip, -0.5 * flip, 0.45 * flip];
          trough(g, add(TA, lift), add(TB, lift), GR, Math.PI, 2 * Math.PI, { op: sa * (1 - flip), bias: -0.22,
            tf: function (p) { return U.rotX(p, add(l3(TA, TB, 0.5), lift), -1.4 * flip); } });
        }
        if (cut > 0 && flip < 1) { // the slit runs along the top
          var top = add(TA, [0, 0, GR]), topB = add(TB, [0, 0, GR]);
          g.path([top, l3(top, topB, cut)], { color: T.line, w: 1.6, dash: "5 4", op: 1 - flip, bias: -0.4 });
          if (cut < 1) g.dot(l3(top, topB, cut), 3.5, "zing", { stroke: false, bias: -0.45 });
        }
      }
      // tape: three bands from the gutter's outer lip over the eave
      var ta = back(seg(t, TAPE[0], TAPE[1]));
      if (ta > 0.01) [-0.75, 0.1, 0.95].forEach(function (x, i) {
        var k = Math.min(1, Math.max(0, ta * 1.2 - i * 0.1)), z = gz(x);
        if (k <= 0) return;
        var y0 = GA[1] - GR - 0.005;
        g.poly([[x - 0.035, y0, z], [x + 0.035, y0, z], [x + 0.035, lerp(y0, -0.8, k), lerp(z, EZ + 0.06, k)], [x - 0.035, lerp(y0, -0.8, k), lerp(z, EZ + 0.06, k)]], T.line, { flat: true, fillOp: 0.45, w: 1, bias: -0.3 });
      });

      // ---- the downpipe: a straw slides down from the gutter's end
      var pa = eo(seg(t, PIPE[0], PIPE[1])), pTop = [PX, GA[1], gz(PX) - GR * 0.8], pBot = [PX, GA[1], 0.78];
      if (pa > 0) g.tube(pTop, l3(pTop, pBot, pa), { w: 7, op: Math.min(1, pa * 3), bias: -0.5 });

      // ---- the cup lands under it
      var ca = seg(t, CUPIN[0], CUPIN[1]), level = TARGET * eio(seg(t, FILL[0], FILL[1])), win = Math.sin(Math.PI * seg(t, WIN[0], WIN[1]));
      if (ca > 0) {
        cup(g, [CUP[0], CUP[1], 1.1 * (1 - eo(ca)) - 0.06 * Math.sin(Math.PI * seg(ca, 0.75, 1))], level, Math.min(1, ca * 3), win);
      }

      // ---- 3. the watering can swoops in, tips and showers the roof
      var cin = eo(seg(t, CAN_IN[0], CAN_IN[1])), cout = eio(seg(t, CAN_OUT[0], CAN_OUT[1]));
      var tilt = 50 * RAD * (eio(seg(t, TILT[0], TILT[1])) - eio(seg(t, TILT_BACK[0], TILT_BACK[1])));
      var C0 = [-0.95, -0.45, 2.95], C = add(C0, [-1.6 * (1 - cin) + 1.4 * cout, 0, 0.8 * (1 - cin) + 0.9 * cout]);
      C = add(C, [0, 0, 0.04 * Math.sin(t * DUR * 5)]);
      var canOp = cin * (1 - seg(t, CAN_OUT[0] + 0.03, CAN_OUT[1]));
      var rose = null;
      if (canOp > 0.01) rose = can(g, function (p) { return add(C, U.rotY(p, [0, 0, 0], tilt)); }, canOp);

      // shower: drops from the rose to the front slope, a splash where each lands
      var shower = seg(t, SHOWER[0], SHOWER[0] + 0.03) * (1 - seg(t, SHOWER[1] - 0.03, SHOWER[1]));
      if (shower > 0 && rose) {
        for (var i = 0; i < 64; i++) {
          if (hash(i + 7) > shower) continue;
          var ph = t * 28 + hash(i), cyc = Math.floor(ph), s = (ph - cyc) * 1.3;
          var xl = lerp(-0.6, 0.95, hash(i * 13 + cyc * 7)), yl = lerp(-0.78, -0.08, hash(i * 17 + cyc * 3)), zl = RZ + yl + 0.01;
          var st = add(rose, [0.05 * (hash(i * 5 + cyc) - 0.5), 0.07 * (hash(i * 9 + cyc) - 0.5), 0]);
          var at = function (k) { return [lerp(st[0], xl, k), lerp(st[1], yl, k), lerp(st[2], zl, k * k)]; };
          if (s <= 1) g.line(at(Math.max(0, s - 0.1)), at(s), { color: T.line, w: 1.8, op: 0.95, bias: -0.8 });
          else {
            var sp = (s - 1) / 0.3, rr = 0.07 * eo(sp);
            g.line([xl, yl, zl], [xl - rr, yl - rr * 0.3, zl + rr * 0.8], { color: T.line, w: 1.3, op: 1 - sp, bias: -0.7 });
            g.line([xl, yl, zl], [xl + rr, yl - rr * 0.3, zl + rr * 0.8], { color: T.line, w: 1.3, op: 1 - sp, bias: -0.7 });
          }
        }
      }

      // rivulets running down the front slope into the gutter
      var riv = seg(t, 0.44, 0.5) * (1 - seg(t, 0.76, 0.84));
      if (riv > 0) for (var r = 0; r < 8; r++) {
        var x0 = lerp(-0.5, 0.95, (r + 0.5) / 8) + 0.06 * (hash(r + 3) - 0.5), pts = [];
        for (var y = -0.08; y >= -EY - 0.001; y -= 0.05) pts.push([x0 + 0.03 * Math.sin(y * 13 + r * 1.9), y, RZ + y + 0.012]);
        var grow = Math.max(2, Math.round(pts.length * eo(seg(t, 0.44 + r * 0.006, 0.5 + r * 0.006))));
        g.path(pts.slice(0, grow), { color: T.line, w: 1.1, op: riv * 0.45, bias: -0.34 });
        g.path(pts.slice(0, grow), { color: T.line, w: 2.2, dash: "4 18", dashOff: -t * DUR * 60 - r * 9, op: riv, bias: -0.35 });
      }

      // water in the gutter, flowing to the downpipe end
      var gw = seg(t, 0.47, 0.53) * (1 - seg(t, 0.8, 0.87));
      if (gw > 0) {
        var x1 = GB[0] - 0.02, wz = function (x) { return gz(x) - GR * 0.35; }, hw = GR * 0.9 * gw; // from where the first rivulet lands
        var gy = GA[1];
        g.poly([[x1 - 2.0, gy - hw, wz(x1 - 2.0)], [x1, gy - hw, wz(x1)], [x1, gy + hw, wz(x1)], [x1 - 2.0, gy + hw, wz(x1 - 2.0)]], T.line, { flat: true, stroke: false, fillOp: 0.32, op: gw, bias: -0.32 });
        [-0.4, 0.4].forEach(function (k, j) { g.path([[x1 - 2.0, gy + k * hw, wz(x1 - 2.0)], [x1, gy + k * hw, wz(x1)]], { color: T.line, w: 1.8, dash: "6 16", dashOff: -t * DUR * 75 - j * 11, op: gw, bias: -0.33 }); });
      }
      // down the pipe and into the cup: a falling stream, ripples on the water
      var pf = seg(t, 0.5, 0.54) * (1 - seg(t, 0.83, 0.88));
      if (pf > 0) {
        g.path([pTop, pBot], { color: T.line, w: 2, dash: "7 9", dashOff: -t * DUR * 80, op: pf, bias: -0.55 });
        var surf = [PX, GA[1], Math.max(0.02, level)];
        g.path([pBot, surf], { color: T.line, w: 2.4, dash: "8 6", dashOff: -t * DUR * 90, op: pf, bias: -0.2 });
        for (var h = 0; h < 5; h++) { // droplets hopping out where the stream lands
          var hp = frac(t * DUR * 2.2 + hash(h * 3)), an = hash(h * 7) * TAU, hr = 0.05 + 0.1 * hp, hz = 0.16 * Math.sin(Math.PI * hp);
          g.dot([PX + hr * Math.cos(an), GA[1] + hr * Math.sin(an), surf[2] + hz], 2.2, T.line, { stroke: false, op: pf * (1 - hp), bias: -0.25 });
        }
        for (var q = 0; q < 2; q++) {
          var rp = frac(t * DUR * 1.6 + q / 2), rad = 0.03 + 0.16 * rp, ring = [];
          for (var k = 0; k <= 20; k++) { var a = k / 20 * TAU; ring.push([PX + rad * Math.cos(a), CUP[1] + rad * 0.9 * Math.sin(a), surf[2] + 0.003]); }
          g.path(ring, { color: T.line, w: 1.2, op: pf * (1 - rp) * 0.9, bias: -0.08 });
        }
      }

      // ---- 4. payoff: the level settles on the orange line, a ring pulses and a tick appears
      if (win > 0 || t > WIN[0]) {
        var tk = seg(t, WIN[0], WIN[0] + 0.03), q2 = g.P([PX + 0.42, -0.98, CH + 0.18]);
        g.screen('<path d="M' + (q2[0] - 12).toFixed(1) + ' ' + q2[1].toFixed(1) + ' l9 9 l18 -20" fill="none" stroke="' + OR + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="' + tk.toFixed(3) + '"/>');
        var pr = seg(t, WIN[0], WIN[1]);
        if (pr > 0 && pr < 1) {
          var ring2 = [], rr2 = lerp(CRB, CRT, TARGET / CH) * (1 + 0.6 * eo(pr));
          for (var k2 = 0; k2 <= 28; k2++) { var a2 = k2 / 28 * TAU; ring2.push([PX + rr2 * Math.cos(a2), -0.98 + rr2 * Math.sin(a2), TARGET]); }
          g.path(ring2, { color: OR, w: 2, op: 1 - pr, bias: -0.1 });
        }
      }
    }
  });
})();

/* ---- rube/rube.js ---- */
;/* WonderLab "Chain Reaction Machine": one Rube Goldberg machine built across the room, four team stations,
 * each one setting off the next (brief in WonderLab-2.docx).
 * Team 1: a marble rolls down a track propped up on stacks of books.
 * Team 2: it knocks over an S-curve of dominoes.
 * Team 3: the last domino tips a standing book onto a ruler seesaw, which flicks a ping-pong ball into the air.
 * Team 4: the ball lands in a paper cup hanging on a string over a pulley; the string pulls the bell and it rings.
 * Each team's zone is taped out on the floor (1 to 4 dots) and lights up while it is that team's turn.
 * The camera starts wide on the whole machine, follows the action, then pulls back.
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, clamp = U.clamp, ap = U.ap, hash = U.hash;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return Math.hypot(a[0], a[1], a[2]); }
  function norm(a) { var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function f1(n) { return Math.round(n * 10) / 10; }
  // rotate about a y-parallel axis through c (positive = +x goes down)
  function rotYc(p, c, a) { var s = Math.sin(a), k = Math.cos(a), x = p[0] - c[0], z = p[2] - c[2]; return [c[0] + x * k + z * s, p[1], c[2] - x * s + z * k]; }

  /* ------------------------------------------------------------------ timing */
  var MARBLE = [0.18, 0.2, 0.255, 0.28];          // platform, ramp, floor, hits domino 1
  var D0 = 0.28, DSTEP = 0.0115, DFALL = 0.034;    // domino wave
  var BOOK = [0.441, 0.466, 0.49];                 // book tips, hits the seesaw, lies flat
  var SNAP = 0.478, LAND = 0.54;                   // ball leaves the seesaw / lands in the cup
  var ZONES_ON = [[0.17, 0.285], [0.28, 0.445], [0.44, 0.545], [0.54, 0.8]];

  /* ------------------------------------------------------------------ camera */
  // [t, focus x, focus y, zoom]; the world is shifted so the focus sits at the frame centre
  var KEYS = [[0, 0.7, 0.5, 1.1], [0.125, 0.7, 0.5, 1.1], [0.18, -3.5, 0.1, 1.3], [0.27, -3.3, 0.2, 1.3],
              [0.44, 0.3, 1.1, 1.3], [0.5, 2.6, 1.3, 1.3], [0.56, 5.0, 1.5, 1.3], [0.74, 5.0, 1.5, 1.3],
              [0.86, 0.7, 0.5, 1.1], [1, 0.7, 0.5, 1.1]];
  function camAt(t) {
    for (var i = 0; i < KEYS.length - 1; i++) {
      var a = KEYS[i], b = KEYS[i + 1];
      if (t <= b[0]) { var k = eio(seg(t, a[0], b[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; }
    }
    var l = KEYS[KEYS.length - 1]; return [l[1], l[2], l[3]];
  }
  // a drawing context whose every point is shifted by -off (so the camera can pan)
  function wrap(g, off) {
    function sh(p) { return [p[0] - off[0], p[1] - off[1], p[2] - off[2]]; }
    function shA(a) { return a.map(sh); }
    return {
      T: g.T, V: g.V, S: g.S, screen: g.screen,
      P: function (p) { return g.P(sh(p)); },
      poly: function (pts, m, o) { g.poly(shA(pts), m, o); },
      path: function (pts, o) { g.path(shA(pts), o); },
      dot: function (p, r, m, o) { g.dot(sh(p), r, m, o); },
      box8: function (C, m, o) { g.box8(shA(C), m, o); },
      shadow: function (pts, op) { g.shadow(shA(pts), op); }
    };
  }

  /* ------------------------------------------------------------------ layout */
  var RY = -0.3;                                          // station 1 runs along this line
  var MR = 0.11;                                          // marble radius
  var STACK1 = { x: -5.26, y: RY, w: 0.85, d: 0.72, books: [0.3, 0.27, 0.32, 0.27, 0.3] };   // 1.46 high, kept clear of the ramp's top end
  var RTOP = [-4.72, RY, 1.51], RBOT = [-2.72, RY, 0.0];  // ramp top surface, top and bottom ends
  var STACK2 = { x: -3.95, y: RY, w: 0.6, d: 0.6, books: [0.24, 0.22, 0.2] };              // mid support
  (function () { // the ramp rests on the mid stack's far top corner: scale its books so nothing pokes through the ramp
    var hx = STACK2.w * 0.51 + STACK2.d * 0.06, xr = STACK2.x + hx;       // widest book, slightly turned
    var under = RTOP[2] * (RBOT[0] - xr) / (RBOT[0] - RTOP[0]) - 0.07;    // ramp underside at that corner
    var tot = STACK2.books.reduce(function (a, b) { return a + b; }, 0), k = (under - 0.01) / tot;
    STACK2.books = STACK2.books.map(function (b) { return b * k; });
  })();
  // domino path: straight, left bend, right bend, straight
  var DOM = { th: 0.08, wd: 0.34, h: 0.6, sp: 0.3, n: 14 };
  var PATH = (function () {
    var pts = [], x = -2.45, y = RY, hd = 0, ds = 0.01, s = 0;
    var legs = [[0.9, 0], [0.85 * Math.PI / 2, 1 / 0.85], [0.85 * Math.PI / 2, -1 / 0.85], [0.6, 0]];
    pts.push([x, y, hd, 0]);
    legs.forEach(function (lg) {
      for (var d = 0; d < lg[0] - 1e-9; d += ds) { hd += lg[1] * ds / 2; x += Math.cos(hd) * ds; y += Math.sin(hd) * ds; hd += lg[1] * ds / 2; s += ds; pts.push([x, y, hd, s]); }
    });
    return pts;
  })();
  function at(s) { var i = clamp(Math.round(s / 0.01), 0, PATH.length - 1); return PATH[i]; }
  var LINE = 1.4;                                         // stations 3 and 4 run along y = LINE
  var LASTD = at((DOM.n - 1) * DOM.sp);
  var BK = { h: 1.0, th: 0.2, wd: 0.72, px: LASTD[0] + DOM.sp - DOM.th / 2 + 0.2 };          // pivot = front bottom edge
  // each domino a step bigger, geometrically, so the standing book reads as the next (and largest) one; the first
  // and last positions stay put (the book and everything after it are placed from the last one), the gaps grow
  // with the dominoes in between
  var DS = [], dsum = 0;
  for (var di = 0; di < DOM.n; di++) {
    var gk = di / DOM.n;
    DS.push({ th: DOM.th * Math.pow(BK.th / DOM.th, gk), wd: DOM.wd * Math.pow(BK.wd / DOM.wd, gk), h: DOM.h * Math.pow(BK.h / DOM.h, gk) });
  }
  for (di = 0; di < DOM.n - 1; di++) dsum += DS[di].h;
  for (di = 0, dsum = (DOM.n - 1) * DOM.sp / dsum; di < DOM.n; di++) DS[di].s = di ? DS[di - 1].s + DS[di - 1].h * dsum : 0;
  for (di = 0; di < DOM.n - 1; di++) { // leaning angle when its top meets the next domino's back face
    var gap = (DS[di + 1].s - DS[di + 1].th / 2) - (DS[di].s + DS[di].th / 2);
    DS[di].rest = Math.asin(clamp(gap / DS[di].h, 0, 1));
  }
  var SEE = { px: 0, pz: 0.3, L: 1.0, a0: 18 * RAD, t: 0.04, w: 0.3 };
  (function () { // put the seesaw where the falling book's top edge meets its raised end
    var zt = SEE.pz + SEE.t + SEE.L * Math.sin(SEE.a0), th = Math.acos(zt / BK.h);
    BK.hit = th; SEE.px = BK.px + BK.h * Math.sin(th) + SEE.L * Math.cos(SEE.a0);
  })();
  var CUPX = 5.0, PUL = [CUPX, LINE, 2.95], PR = 0.1;      // pulley axle and radius
  var ARMZ = 3.12, POSTX = 6.75, BELL = [6.0, LINE, 2.98];  // bell pivot
  var BPROF = [[0.05, -0.13], [0.15, -0.16], [0.21, -0.24], [0.24, -0.4], [0.3, -0.58], [0.38, -0.7]]; // (r, dz) crown to lip
  var CUP = { r0: 0.16, r1: 0.25, h: 0.22, top: 1.55 };    // shallow paper cup; rest height of the rim
  var BALL = 0.1;

  /* ------------------------------------------------------------------ parts */
  // box from an origin and three edge vectors (u x v must point along n)
  function obox(G, O, u, v, n, mat, o) {
    G.box8([O, add(O, u), add(add(O, u), v), add(O, v), add(O, n), add(add(O, u), n), add(add(add(O, u), v), n), add(add(O, v), n)], mat, o);
  }
  function abox(G, x, y, z, w, d, h, mat, o) { obox(G, [x, y, z], [w, 0, 0], [0, d, 0], [0, 0, h], mat, o); }
  var COVERS = ["wood", "sky", "paper", "foil", "wood", "sky"];
  function stack(G, S, a, k0) {
    var z = 0;
    S.books.forEach(function (bh, i) {
      var ai = clamp(a * S.books.length - i), drop = (1 - eo(ai)) * 0.8;
      if (ai <= 0) return;
      var j = k0 + i, rot = (hash(j * 3.1) - 0.5) * 0.16, w = S.w * (0.9 + 0.12 * hash(j * 1.7)), d = S.d * (0.9 + 0.1 * hash(j * 5.3));
      var c = Math.cos(rot), s = Math.sin(rot);
      var O = [S.x - (w / 2) * c + (d / 2) * s, S.y - (w / 2) * s - (d / 2) * c, z + drop];
      // covers on top and bottom, a lighter page block on the sides
      obox(G, O, [w * c, w * s, 0], [-d * s, d * c, 0], [0, 0, bh * 0.98], COVERS[j % COVERS.length], { op: eo(ai), mats: { 1: "sky", 4: "sky" } });
      z += bh;
    });
    return z;
  }
  function ramp(G, A, B, wd, mat, o) {
    var u = sub(B, A), v = [0, wd, 0], n = mul(norm(cross(u, v)), 0.05);
    var O = sub(sub(A, mul(v, 0.5)), n);
    obox(G, O, u, v, n, mat, o);
    [-0.5, 0.5].forEach(function (k) { // side rails
      var o2 = add(A, mul(v, k - (k > 0 ? 0.12 : 0)));
      obox(G, o2, u, [0, wd * 0.12, 0], mul(norm(n), 0.07), mat, o);
    });
  }
  // lathe: rings of (r, dz) around a local frame {c, e1, e2, w}; cull outward faces, sorted per quad
  function lathe(G, F, prof, mat, o) {
    var N = 18, rings = prof.map(function (pr) {
      var ring = [];
      for (var i = 0; i < N; i++) { var a = i / N * TAU; ring.push(add(F.c, add(add(mul(F.e1, pr[0] * Math.cos(a)), mul(F.e2, pr[0] * Math.sin(a))), mul(F.w, pr[1])))); }
      return ring;
    });
    for (var k = 0; k < rings.length - 1; k++) for (var i = 0; i < N; i++) {
      var i2 = (i + 1) % N;
      G.poly([rings[k][i], rings[k + 1][i], rings[k + 1][i2], rings[k][i2]], mat, { cull: o.cull, stroke: false, op: o.op, bias: o.bias });
    }
    return rings;
  }
  function spark(G, p, t0, t, col, r0) {
    var k = seg(t, t0, t0 + 0.035);
    if (k <= 0 || k >= 1) return;
    var q = G.P(p), d = "";
    for (var i = 0; i < 7; i++) {
      var a = i / 7 * TAU + 0.3, ra = (r0 || 10) + 14 * eo(k), rb = ra + 10 * (1 - k);
      d += "M" + f1(q[0] + ra * Math.cos(a)) + " " + f1(q[1] + ra * Math.sin(a)) + "L" + f1(q[0] + rb * Math.cos(a)) + " " + f1(q[1] + rb * Math.sin(a));
    }
    G.screen('<path d="' + d + '" stroke="' + col + '" stroke-width="2.4" stroke-linecap="round" opacity="' + (1 - k).toFixed(3) + '"/>');
  }

  WL.define("rube", {
    cam: { yaw: 14, pitch: 33, S: 62, amp: 0, cy: 0.56, at: function (t) { return { z: camAt(t)[2] }; } },
    draw: function (g0, t) {
      var cam = camAt(t), G = wrap(g0, [cam[0], cam[1], 0]), T = g0.T, M = T.mats, Z = M.zing, px = g0.S;

      // ---- floor grid
      for (var gx = -7; gx <= 9.01; gx += 1) G.path([[gx, -2.5, 0], [gx, 3.5, 0]], { color: T.grid, w: 1, bias: 100 });
      for (var gy = -2.5; gy <= 3.51; gy += 1) G.path([[-7, gy, 0], [9, gy, 0]], { color: T.grid, w: 1, bias: 100 });

      // ---- team zones: taped rectangles with 1..4 dots, lit while that team's station is running
      var ZN = [[-5.9, -1.05, -2.6, 0.55], [-2.6, -1.05, 0.72, 2.2], [0.72, 0.55, 4.2, 2.2], [4.2, 0.55, 7.3, 2.2]];
      ZN.forEach(function (zr, k) {
        var za = ap(t, k, 0.015, 0.008, 0.05);
        if (za <= 0) return;
        var on = seg(t, ZONES_ON[k][0], ZONES_ON[k][0] + 0.02) * (1 - seg(t, ZONES_ON[k][1], ZONES_ON[k][1] + 0.03));
        var rect = [[zr[0], zr[1], 0.004], [zr[2], zr[1], 0.004], [zr[2], zr[3], 0.004], [zr[0], zr[3], 0.004]];
        G.poly(rect, "paper", { flat: true, stroke: false, fillOp: 0.35 + 0.35 * on, op: za, bias: 90 });
        G.path(rect.concat([rect[0]]), { color: on > 0.01 ? Z : T.soft, w: 1.6 + 0.8 * on, dash: "10 7", op: za * (0.55 + 0.45 * on), bias: 89 });
        for (var d = 0; d <= k; d++) G.dot([zr[0] + 0.22 + d * 0.2, zr[1] + 0.22, 0.01], 0.05 * px, on > 0.01 ? Z : T.soft, { stroke: false, op: za, bias: 88 });
      });

      /* ================================================================ team 1: marble track on books */
      var a1 = seg(t, 0.025, 0.07);
      var h1 = stack(G, STACK1, a1, 0), h2 = stack(G, STACK2, seg(t, 0.03, 0.07), 7);
      var ra = eo(seg(t, 0.055, 0.08));
      if (ra > 0) {
        ramp(G, [STACK1.x - 0.4, RY, h1 + 0.05], [RTOP[0], RY, h1 + 0.05], 0.26, "wood", { op: ra });   // start platform
        ramp(G, RTOP, RBOT, 0.26, "wood", { op: ra });
      }
      // marble: sits on the platform, rolls down the ramp, along the floor, into domino 1, bounces back a touch
      var mp, mT = MARBLE, hitX = PATH[0][0] - DOM.th / 2 - MR;
      if (t < mT[1]) mp = [lerp(STACK1.x - 0.25, RTOP[0], Math.pow(seg(t, mT[0], mT[1]), 2)), RY, h1 + 0.05 + MR];
      else if (t < mT[2]) { var sr = seg(t, mT[1], mT[2]); mp = add(mix3(RTOP, RBOT, 0.15 * sr + 0.85 * sr * sr), [0.06, 0, MR * 1.2]); }
      else if (t < mT[3]) mp = [lerp(RBOT[0] + 0.06, hitX, seg(t, mT[2], mT[3])), RY, MR];
      else mp = [hitX - 0.14 * eo(seg(t, mT[3], mT[3] + 0.03)), RY, MR];
      G.dot(mp, MR * px, "#FF6000", { op: seg(t, 0.07, 0.09), bias: -2 }); // WonderLab orange
      // a little "go" ring when the marble is let go
      var go = seg(t, mT[0] - 0.01, mT[0] + 0.03);
      if (go > 0 && go < 1) { var gq = G.P(mp); G.screen('<circle cx="' + f1(gq[0]) + '" cy="' + f1(gq[1]) + '" r="' + f1(MR * px + 6 + 22 * eo(go)) + '" fill="none" stroke="' + Z + '" stroke-width="2" opacity="' + (1 - go).toFixed(3) + '"/>'); }

      /* ================================================================ team 2: dominoes */
      // the book's tilt so far: the last domino leans on its back face as it tips, never through it
      var bthNow = BK.hit * Math.pow(seg(t, BOOK[0], BOOK[1]), 1.6) + (86 * RAD - BK.hit) * eo(seg(t, BOOK[1], BOOK[2]));
      for (var i = 0; i < DOM.n; i++) {
        var dd = DS[i], p = at(dd.s), up = ap(t, i, 0.04, 0.003, 0.04);
        if (up <= 0) continue;
        var tf = seg(t, D0 + i * DSTEP, D0 + i * DSTEP + DFALL), fall;
        if (i < DOM.n - 1) fall = dd.rest * Math.pow(tf, 1.25);
        else { // last one: tip until its top meets the (tipping) book's back face
          var g0 = (BK.px - BK.th) - (p[0] + dd.th / 2), tb = Math.tan(Math.min(bthNow, 80 * RAD)), ac = 0;
          for (var it = 0; it < 4; it++) ac = Math.asin(clamp((g0 + dd.h * Math.cos(ac) * tb) / dd.h, 0, 1));
          fall = Math.min(1.25 * Math.pow(tf, 1.25), ac);
        }
        var c = Math.cos(p[2]), s = Math.sin(p[2]);
        var tfm = (function (p, c, s, fall, lift, th) {
          return function (q) { // local: x along the path, y across, z up; pivot on the front bottom edge
            var r = rotYc(q, [th / 2, 0, 0], fall);
            return [p[0] + r[0] * c - r[1] * s, p[1] + r[0] * s + r[1] * c, r[2] + lift];
          };
        })(p, c, s, fall, (1 - eo(up)) * 0.5, dd.th);
        var C = [[-dd.th / 2, -dd.wd / 2, 0], [dd.th / 2, -dd.wd / 2, 0], [dd.th / 2, dd.wd / 2, 0], [-dd.th / 2, dd.wd / 2, 0]];
        C = C.concat(C.map(function (q) { return [q[0], q[1], dd.h]; })).map(tfm);
        G.box8(C, i % 2 ? "sky" : "paper", { op: up });
      }
      spark(G, [hitX + MR, RY, MR * 1.5], mT[3], t, Z);

      /* ================================================================ team 3: book + ruler seesaw */
      var a3 = seg(t, 0.07, 0.1);
      // the standing book (the last "domino"): tips over, top edge lands on the seesaw's raised end
      var bf = seg(t, BOOK[0], BOOK[2]), bth = BK.hit * Math.pow(seg(t, BOOK[0], BOOK[1]), 1.6) + (86 * RAD - BK.hit) * eo(seg(t, BOOK[1], BOOK[2]));
      if (a3 > 0) {
        var bpiv = [BK.px, LINE, 0];
        var bC = [[-BK.th, -BK.wd / 2, 0], [0, -BK.wd / 2, 0], [0, BK.wd / 2, 0], [-BK.th, BK.wd / 2, 0]];
        bC = bC.concat(bC.map(function (q) { return [q[0], q[1], BK.h]; })).map(function (q) {
          var r = rotYc(q, [0, 0, 0], bth); return [bpiv[0] + r[0], LINE + r[1], r[2] + (1 - eo(a3)) * 0.6];
        });
        G.box8(bC, "wood", { op: eo(a3), mats: { 1: "sky", 5: "sky", 0: "sky" } });
      }
      // seesaw: triangular fulcrum, ruler flips when the book lands
      var flip = eio(seg(t, BOOK[1], SNAP)), phi = lerp(SEE.a0, -SEE.a0, flip);
      var fu = [Math.cos(phi), 0, -Math.sin(phi)], fn = [Math.sin(phi), 0, Math.cos(phi)];
      var FP = [SEE.px, LINE, SEE.pz];
      var launchEnd = add(add(FP, mul(fu, SEE.L)), mul(fn, SEE.t)), trigEnd = add(add(FP, mul(fu, -SEE.L)), mul(fn, SEE.t));
      if (a3 > 0) {
        var fo = { op: eo(a3) };
        G.poly([[SEE.px - 0.22, LINE - 0.2, 0], [SEE.px + 0.22, LINE - 0.2, 0], [SEE.px, LINE - 0.2, SEE.pz]], "wood", fo);
        G.poly([[SEE.px - 0.22, LINE + 0.2, 0], [SEE.px, LINE + 0.2, SEE.pz], [SEE.px + 0.22, LINE + 0.2, 0]], "wood", fo);
        G.poly([[SEE.px - 0.22, LINE - 0.2, 0], [SEE.px, LINE - 0.2, SEE.pz], [SEE.px, LINE + 0.2, SEE.pz], [SEE.px - 0.22, LINE + 0.2, 0]], "wood", fo);
        G.poly([[SEE.px + 0.22, LINE - 0.2, 0], [SEE.px + 0.22, LINE + 0.2, 0], [SEE.px, LINE + 0.2, SEE.pz], [SEE.px, LINE - 0.2, SEE.pz]], "wood", fo);
        obox(G, sub(add(FP, mul(fu, -SEE.L)), [0, SEE.w / 2, 0]), mul(fu, 2 * SEE.L), [0, SEE.w, 0], mul(fn, SEE.t), "brand", fo);
        for (var tk = 1; tk < 20; tk++) { // ruler ticks
          var tp = add(add(FP, mul(fu, -SEE.L + tk * 0.1)), mul(fn, SEE.t + 0.002));
          G.path([add(tp, [0, -SEE.w / 2, 0]), add(tp, [0, -SEE.w / 2 + (tk % 5 ? 0.06 : 0.11), 0])], { color: "ink", w: 1, op: fo.op, bias: -0.2 });
        }
      }
      spark(G, [BK.px - BK.th, LINE, DS[DOM.n - 1].h * 0.9], BOOK[0], t, Z);
      spark(G, trigEnd, BOOK[1], t, Z);

      // the ping-pong ball: rides the seesaw, flies, drops into the cup
      /* ================================================================ team 4: cup, string, pulley, bell */
      var a4 = seg(t, 0.085, 0.115), fo4 = { op: eo(a4) };
      var tau = Math.max(0, (t - LAND) * 14), PSI = 24 * RAD;
      var psi = t < LAND ? 0 : PSI * (1 - Math.exp(-1.1 * tau) * Math.cos(6.2 * tau));
      function bellPt(dx, dz) { return rotYc([BELL[0] + dx, LINE, BELL[2] + dz], BELL, psi); }
      var lip = bellPt(-BPROF[BPROF.length - 1][0], BPROF[BPROF.length - 1][1]);
      var pulR = [PUL[0] + PR, LINE, PUL[2]], lip0 = [BELL[0] - BPROF[BPROF.length - 1][0], LINE, BELL[2] + BPROF[BPROF.length - 1][1]];
      var drop = len(sub(lip0, pulR)) - len(sub(lip, pulR));   // string length taken from the bell side
      var cupZ = CUP.top - drop, cupC = [CUPX, LINE, cupZ];
      if (a4 > 0) {
        // frame: a heavy book as the base, a post, an arm along the top
        abox(G, POSTX - 0.5, LINE - 0.4, 0, 1.0, 0.8, 0.22, "wood", { op: fo4.op, mats: { 1: "sky", 4: "sky" } });
        abox(G, POSTX - 0.07, LINE - 0.07, 0.22, 0.14, 0.14, ARMZ - 0.22, "paper", fo4);
        abox(G, PUL[0] - 0.12, LINE - 0.07, ARMZ, POSTX + 0.07 - PUL[0] + 0.12, 0.14, 0.12, "paper", fo4);
        // pulley wheel and bracket
        G.path([[PUL[0], LINE, ARMZ], PUL], { w: 2.4, op: fo4.op, bias: -0.5 });
        var wheel = [];
        for (var k = 0; k < 16; k++) { var an = k / 16 * TAU; wheel.push([PUL[0] + PR * Math.cos(an), LINE - 0.05, PUL[2] + PR * Math.sin(an)]); }
        G.poly(wheel, "brand", { op: fo4.op, bias: -0.6 });
        G.dot([PUL[0], LINE - 0.06, PUL[2]], 0.025 * px, "ink", { op: fo4.op, bias: -0.7 });
        // bell on its hanger
        G.path([[BELL[0], LINE, ARMZ], BELL, bellPt(0, BPROF[0][1])], { w: 2.4, op: fo4.op, bias: -0.5 });
        var F = { c: BELL, e1: rotYc([1, 0, 0], [0, 0, 0], psi), e2: [0, 1, 0], w: rotYc([0, 0, 1], [0, 0, 0], psi) };
        lathe(G, F, BPROF, "zing", { cull: true, op: fo4.op, bias: 0 });
        var lipR = [];
        for (k = 0; k <= 24; k++) {
          var ang = k / 24 * TAU, lr = BPROF[BPROF.length - 1][0];
          lipR.push(add(BELL, add(add(mul(F.e1, lr * Math.cos(ang)), mul(F.e2, lr * Math.sin(ang))), mul(F.w, BPROF[BPROF.length - 1][1]))));
        }
        G.path(lipR, { w: 1.6, op: fo4.op, bias: -1 });
        // clapper hangs straight down from the crown; the tilting bell swings its lip into it
        var crown = bellPt(0, -0.2), clap = add(crown, [0, 0, -0.52]);
        G.path([crown, clap], { w: 1.6, op: fo4.op, bias: -0.2 });
        G.dot(clap, 0.06 * px, "ink", { op: fo4.op, bias: -0.25 });
        // string: cup bridle -> over the pulley -> bell lip
        var bridle = add(cupC, [0, 0, CUP.h * 0.5 + 0.3]);
        var over = [];
        for (k = 0; k <= 6; k++) { var aa = Math.PI - k / 6 * Math.PI / 2 - 0.0; over.push([PUL[0] + (PR + 0.012) * Math.cos(aa), LINE, PUL[2] + (PR + 0.012) * Math.sin(aa)]); }
        var sOpt = { color: T.line, w: 1.4, op: fo4.op, bias: -3 };
        G.path([bridle, [PUL[0] - PR - 0.012, LINE, PUL[2]]].concat(over).concat([[PUL[0] + 0.02, LINE, PUL[2] + PR + 0.012], lip]), sOpt);
        var rimL = add(cupC, [-CUP.r1, 0, CUP.h / 2]), rimR = add(cupC, [CUP.r1, 0, CUP.h / 2]);
        G.path([rimL, bridle, rimR], sOpt);
        // paper cup (open cone, drawn both sides so its inside shows through the rim)
        var CF = { c: cupC, e1: [1, 0, 0], e2: [0, 1, 0], w: [0, 0, 1] };
        lathe(G, CF, [[CUP.r0, -CUP.h / 2], [CUP.r1, CUP.h / 2]], "sky", { cull: false, op: fo4.op, bias: 0 });
        var rim = [], base = [];
        for (k = 0; k <= 24; k++) {
          var ca = k / 24 * TAU;
          rim.push(add(cupC, [CUP.r1 * Math.cos(ca), CUP.r1 * Math.sin(ca), CUP.h / 2]));
          if (Math.sin(ca) <= 0.05) base.push(add(cupC, [CUP.r0 * Math.cos(ca), CUP.r0 * Math.sin(ca), -CUP.h / 2]));
        }
        G.path(rim, { w: 1.6, op: fo4.op, bias: -0.1 });
        G.path(base, { w: 1.4, op: fo4.op, bias: -0.1 });
        [-1, 1].forEach(function (sx) { G.path([add(cupC, [sx * CUP.r1, 0, CUP.h / 2]), add(cupC, [sx * CUP.r0, 0, -CUP.h / 2])], { w: 1.4, op: fo4.op, bias: -0.1 }); });
      }

      // ping-pong ball
      var bp;
      var restBall = add(add(launchEnd, mul(fu, -0.14)), mul(fn, BALL + 0.01));
      if (t < SNAP) bp = restBall;
      else if (t < LAND) {
        var u = seg(t, SNAP, LAND), end = add(cupC, [0, 0, -CUP.h / 2 + BALL + 0.02]);
        var st = restBall;
        bp = [lerp(st[0], end[0], u), LINE, lerp(st[2], end[2], u) + 4 * 2.1 * u * (1 - u)];
      } else bp = add(cupC, [0, 0, -CUP.h / 2 + BALL + 0.02]);
      if (a3 > 0) G.dot(bp, BALL * px, "#FF6000", { op: eo(a3), bias: t < LAND ? -2 : 0 }); // WonderLab orange
      spark(G, add(cupC, [0, 0, CUP.h / 2]), LAND, t, Z);

      // ---- the ding: sound rings off the bell at each swing into the clapper, sparkle at the first strike
      var bq = G.P(bellPt(0, -0.45));
      for (var w = 0; w < 4; w++) {
        var ts = LAND + (Math.PI / 6.2) * (w + 0.5) / 14, ph = seg(t, ts, ts + 0.09);
        if (ph <= 0 || ph >= 1) continue;
        var rr = (0.5 + 1.6 * eo(ph)) * px;
        G.screen('<circle cx="' + f1(bq[0]) + '" cy="' + f1(bq[1]) + '" r="' + f1(rr) + '" fill="none" stroke="' + M.brand + '" stroke-width="' + (2.6 - w * 0.4).toFixed(1) + '" opacity="' + ((1 - ph) * (1 - w * 0.2)).toFixed(3) + '"/>');
      }
      spark(G, lip, LAND + (Math.PI / 6.2) * 0.5 / 14, t, Z, 16);
    }
  });
})();

/* ---- solar/solar.js ---- */
;/* WonderLab "Solar Oven Bake-Off": a concave foil dish, after the cardboard-and-foil cooker in Courses/8/IMG_4591.
 * Act 1: foil gores fan out around a centre disc and the fold lines trace the dish's concentric rings;
 *        a skewer rises from the centre and one marshmallow slides onto it, right at the focal point.
 * Act 2: the sun comes up and a bundle of parallel rays lands on the foil. The reflections scatter until the dish
 *        swings round to face the sun, then every ray crosses the focus.
 * Act 3: rings of reflected light run down the cone from the rim into the focus; the marshmallow puffs, slumps,
 *        steams and drips into the dish.
 * The dish is a true paraboloid (z = r^2 / 4f), so the aligned reflections meet at F by construction.
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var OR = "#FF6000"; // WonderLab orange accent: the sun and the heat waves
  var U = WL.U, TAU = U.TAU, seg = U.seg, eo = U.eo, eio = U.eio, back = U.back, lerp = U.lerp, clamp = U.clamp, ap = U.ap, hash = U.hash, frac = U.frac;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mixc(a, b, k) { var A = rgb(a), B = rgb(b); k = clamp(k); return "rgb(" + Math.round(lerp(A[0], B[0], k)) + "," + Math.round(lerp(A[1], B[1], k)) + "," + Math.round(lerp(A[2], B[2], k)) + ")"; }
  function mixh(a, b, k) { var A = rgb(a), B = rgb(b); k = clamp(k); return "#" + [0, 1, 2].map(function (i) { return ("0" + Math.round(lerp(A[i], B[i], k)).toString(16)).slice(-2); }).join(""); }
  function f1(n) { return Math.round(n * 10) / 10; }

  // ---- dish: paraboloid of rim radius R and focal length FL, pivoting on a post at V0
  var R = 2.2, FL = 1.4, BANDS = [0.34, 0.8, 1.28, 1.76, 2.2], NG = 18;
  var POST = 1.3, BOXH = 0.5, V0 = [0, 0, POST];
  var SUN = norm([-0.52, -0.34, 0.78]);        // direction to the sun
  var AX0 = norm([0.2, -0.62, 0.76]);          // where the dish points before it is aimed
  var MR = 0.34, MH = 0.44;                    // marshmallow radius and height
  var DRIPS = [0.66, 0.76, 0.84];              // drip start times (the last one is still hanging at the end)

  function basis(A) { var e1 = norm(cross([0, 0, 1], A)); return { e1: e1, e2: cross(A, e1), w: A }; }
  function radial(B, th) { return add(mul(B.e1, Math.cos(th)), mul(B.e2, Math.sin(th))); }
  function dishPt(B, r, th) { return add(V0, add(mul(radial(B, th), r), mul(B.w, r * r / (4 * FL)))); }
  function dishN(B, r, th) { return norm(add(mul(radial(B, th), -r / (2 * FL)), B.w)); } // inner normal
  function reflect(d, n) { return sub(d, mul(n, 2 * dot(d, n))); }
  // local (radial, along-axis) coords of a world point relative to the dish
  function onDish(B, p) { var q = sub(p, V0), z = dot(q, B.w), pr = sub(q, mul(B.w, z)); return z - dot(pr, pr) / (4 * FL); }

  // marshmallow mesh: rings from bottom (s = 0) to top (s = 1) around the skewer, plus a rounded top cap
  function mallow(B, F, puff, melt) {
    var down = sub([0, 0, -1], mul(B.w, -B.w[2])), dl = Math.hypot(down[0], down[1], down[2]);
    down = dl > 1e-4 ? mul(down, 1 / dl) : B.e1;               // downhill direction across the skewer
    var H = MH * (1 + 0.12 * puff) * (1 - 0.42 * melt), r0 = MR * (1 + 0.1 * puff);
    var S = [0, 0.3, 0.6, 0.85, 1], rings = [], N = 22;
    S.forEach(function (s) {
      var ring = [];
      for (var i = 0; i < N; i++) {
        var th = i / N * TAU, rd = radial(B, th), dn = Math.max(0, dot(rd, down));
        var bulge = 1 + melt * (0.3 * Math.sin(Math.PI * Math.min(1, s * 1.25)) + 0.12 + 0.1 * (1 - s) * dn) + melt * (0.05 * Math.sin(th * 3 + 1.3) + 0.03 * Math.sin(th * 5 + 0.4));
        var r = r0 * bulge * (s === 1 ? 0.8 + 0.08 * melt : 1);
        var p = add(F, add(mul(B.w, (s - 0.5) * H + (s === 1 ? 0.035 : 0)), mul(rd, r)));
        // gravity: the outer, downhill side sags most; the top runs over the edge as it melts
        p = add(p, [0, 0, -melt * (0.04 + 0.34 * Math.pow(dn, 1.5)) * (0.4 + 0.6 * r / (MR * 1.4)) * (0.5 + 0.5 * s)]);
        ring.push(p);
      }
      rings.push(ring);
    });
    // soft dome over the top ring: puffs up with heat, then sinks and slides downhill as it melts
    var apex = add(F, add(mul(B.w, H / 2 + 0.035 + 0.07 * (1 - melt) + 0.05 * puff), [0, 0, -0.12 * melt]));
    return { rings: rings, apex: apex };
  }

  function ringPts(C, B, r, n) { var o = []; for (var i = 0; i <= n; i++) o.push(add(C, mul(radial(B, i / n * TAU), r))); return o; }
  // split a closed 3D ring into the half facing the camera and the half behind the centre
  function halves(pts, C, V) {
    var front = [], backH = [], cur = null, out = [];
    pts.forEach(function (p) {
      var f = dot(sub(p, C), V) >= 0;
      if (cur === null || cur.f !== f) { if (cur) { cur.pts.push(p); } cur = { f: f, pts: cur ? [cur.pts[cur.pts.length - 1], p] : [p] }; out.push(cur); } else cur.pts.push(p);
    });
    out.forEach(function (s) { (s.f ? front : backH).push(s.pts); });
    return { front: front, back: backH };
  }

  WL.define("solar", {
    cam: { yaw: 14, pitch: 30, S: 64, amp: 4, cy: 0.74 },
    draw: function (g, t) {
      var T = g.T, M = T.mats, light = rgb(T.bg)[0] > 128;
      var HI = light ? "#FFFFFF" : M.brand, CREAM = light ? "#FFFFFF" : M.zing;
      var V = g.V;
      g.grid(4, 1);

      // ---- timing
      var aBase = ap(t, 0, 0.02, 0, 0.08), aPost = ap(t, 0, 0.05, 0, 0.08);
      var aim = eio(seg(t, 0.33, 0.5));
      var sunOn = eo(seg(t, 0.24, 0.3));
      var heat = seg(t, 0.5, 0.58);
      var puff = Math.sin(Math.PI * seg(t, 0.52, 0.68)) * (1 - seg(t, 0.62, 0.7)) + 0.5 * seg(t, 0.6, 0.66);
      var melt = eio(seg(t, 0.6, 0.88));

      var A = norm(mix3(AX0, SUN, aim)), B = basis(A), F = add(V0, mul(A, FL));
      var sunP = add(V0, mul(SUN, 7.2));

      // ---- ground: cardboard base, post, and the dish's shadow cast along the sun direction
      if (aBase > 0) {
        U.boxShadow(g, -0.8, -0.8, 1.6, 1.6, BOXH, [-SUN[0] / SUN[2], -SUN[1] / SUN[2]], 0.9 * sunOn);
        g.box(-0.8, -0.8, 0, 1.6, 1.6, BOXH * aBase, "wood", { op: aBase, bias: 45 });
        g.line([-0.8, -0.8, BOXH * aBase * 0.62], [0.8, -0.8, BOXH * aBase * 0.62], { color: T.soft, w: 1, op: aBase * 0.6, bias: 44 });
      }
      if (aPost > 0) g.cyl(0, 0, BOXH, 0.07, (POST - BOXH) * aPost, "paper", { seg: 10, op: aPost, bias: 40 });
      if (sunOn > 0) {
        var sh = [];
        for (var k = 0; k < 24; k++) { var rp = dishPt(B, R, k / 24 * TAU); sh.push([rp[0] - SUN[0] * rp[2] / SUN[2], rp[1] - SUN[1] * rp[2] / SUN[2]]); }
        g.shadow(U.hull(sh).map(function (q) { return [q[0], q[1], 0.002]; }), 0.9 * sunOn * ap(t, 0, 0.1, 0, 0.12));
      }

      // ---- dish: gores fan open one after another, like the foil panels in the reference
      var dth = TAU / NG, Lsun = mul(SUN, -1), gores = [];
      g.poly(circleOnDish(B, BANDS[0], 20), mixc(M.foil, HI, 0.3), { op: ap(t, 0, 0.08, 0, 0.06), stroke: false, bias: 25 });
      for (var i = 0; i < NG; i++) {
        var a = ap(t, i, 0.1, 0.0065, 0.07);
        gores.push(a);
        if (a <= 0) continue;
        var th0 = i * dth + 0.35, th1 = th0 + dth * a;
        for (var j = 0; j < BANDS.length - 1; j++) {
          var r0 = BANDS[j], r1 = BANDS[j + 1], tm = (th0 + th1) / 2, rm = (r0 + r1) / 2;
          var n = dishN(B, rm, tm), rf = reflect(Lsun, n);
          var spec = Math.pow(Math.max(0, dot(norm(rf), V)), 6) * sunOn;
          var facing = clamp((dot(n, V) - 0.45) / 0.55), diff = 0.5 + 0.5 * facing * facing;
          var k2 = 0.04 + 0.14 * hash(i * 7 + j * 31) + 0.6 * spec + (i % 2 ? 0.05 : 0);
          var fill = mixc(T.tone, mixh(M.foil, HI, k2), diff);
          g.poly([dishPt(B, r0, th0), dishPt(B, r1, th0), dishPt(B, r1, th1), dishPt(B, r0, th1)], fill, { op: a, stroke: false, bias: 25 });
        }
      }
      // radial seams between gores
      for (i = 0; i < NG; i++) {
        var sa = gores[i];
        if (sa <= 0) continue;
        var th = i * dth + 0.35, pts = [];
        BANDS.forEach(function (r) { pts.push(dishPt(B, r, th)); });
        g.path(pts, { w: 1, op: sa * 0.35, bias: 14 });
      }
      // concentric fold lines, rim first, drawn on toward the centre
      BANDS.slice().reverse().forEach(function (r, idx) {
        var p = eio(seg(t, 0.15 + idx * 0.03, 0.25 + idx * 0.03));
        if (p <= 0) return;
        var pts = [], n = 64, m = Math.max(1, Math.round(n * p));
        for (var q = 0; q <= m; q++) pts.push(dishPt(B, r, 0.35 - Math.PI / 2 + q / n * TAU * (idx % 2 ? -1 : 1)));
        g.path(pts, { w: idx === 0 ? 2.4 : 1.1, op: idx === 0 ? 1 : 0.4, bias: idx === 0 ? 10 : 12 });
      });

      // ---- optical axis (dashed) and the focus marker, shown while aiming
      var axOn = seg(t, 0.28, 0.33) * (1 - seg(t, 0.52, 0.58));
      g.path([V0, add(V0, mul(A, 6.4))], { color: T.soft, w: 1.2, dash: "3 7", op: axOn * 0.8, bias: 2 });

      // ---- skewer through the centre, marshmallow slides down onto the focus
      var sk = eo(seg(t, 0.2, 0.26)), mDrop = seg(t, 0.25, 0.31);
      if (sk > 0) {
        g.path([V0, add(V0, mul(A, FL * sk))], { color: T.line, w: 4.6, bias: 0 });
        g.path([V0, add(V0, mul(A, FL * sk))], { color: "wood", w: 2.4, bias: -0.1 });
      }

      // ---- sun and the parallel ray bundle
      if (sunOn > 0) {
        g.dot(sunP, 26 * sunOn, OR, { bias: -60 }); // WonderLab orange sun
        var sq = g.P(sunP), spin = t * TAU * 0.5, ray = "";
        for (k = 0; k < 10; k++) {
          var an = spin + k / 10 * TAU, r0s = 34 * sunOn, r1s = (44 + 6 * Math.sin(t * TAU * 6 + k)) * sunOn;
          ray += "M" + f1(sq[0] + r0s * Math.cos(an)) + " " + f1(sq[1] + r0s * Math.sin(an)) + "L" + f1(sq[0] + r1s * Math.cos(an)) + " " + f1(sq[1] + r1s * Math.sin(an));
        }
        g.screen('<path d="' + ray + '" stroke="' + OR + '" stroke-width="2.6" stroke-linecap="round" opacity="' + sunOn.toFixed(3) + '"/>');
      }
      var HITS = [[1.02, 0.2], [1.02, 1.77], [1.02, 3.34], [1.02, 4.91], [1.62, 0.98], [1.62, 2.55], [1.62, 4.12], [1.62, 5.69], [2.06, 0.2], [2.06, 1.77], [2.06, 3.34], [2.06, 4.91]];
      var conv = seg(t, 0.46, 0.52), rayFade = 1 - seg(t, 0.86, 0.92) * 0.5;
      HITS.forEach(function (h, i) {
        var ts = 0.29 + (i % 4) * 0.008 + Math.floor(i / 4) * 0.012;
        var pin = eo(seg(t, ts, ts + 0.045)), pout = eo(seg(t, ts + 0.035, ts + 0.08));
        if (pin <= 0) return;
        var H = dishPt(B, h[0], h[1]);
        var L0 = 5.0 - dot(sub(H, V0), SUN), S0 = add(H, mul(SUN, L0));
        var dashOff = -t * 12 * 30;
        g.path([S0, mix3(S0, H, pin)], { color: "brand", w: 1.5, dash: "7 7", dashOff: dashOff, op: 0.6 * rayFade, bias: -12 });
        if (pout <= 0) return;
        var rd = norm(reflect(Lsun, dishN(B, h[0], h[1])));
        var len = Math.hypot(F[0] - H[0], F[1] - H[1], F[2] - H[2]) - (mDrop > 0.9 ? MR * 0.9 : 0);
        g.path([H, add(H, mul(rd, len * pout))], { color: conv > 0 ? mixc(M.brand, M.zing, conv) : "brand", w: 1.6 + 0.8 * conv, dash: "7 7", dashOff: dashOff, op: (0.7 + 0.3 * conv) * rayFade, bias: -12 });
      });

      // ---- heat: a glow at the focus
      // (the rings running down the cone and the lock-on circle read as radio waves, so they are left out)
      var glow = heat * (1 - seg(t, 0.88, 0.93)) * (0.85 + 0.15 * Math.sin(t * TAU * 18));
      for (k = 0; k < 4; k++) g.dot(F, (28 + k * 16) * (0.9 + 0.1 * glow), "zing", { stroke: false, op: glow * 0.09, bias: -25 });

      // ---- the marshmallow
      if (mDrop > 0) {
        var slide = back(mDrop), Fm = add(F, mul(A, (1 - slide) * 1.6));
        var mm = mallow(B, Fm, puff, melt), rings = mm.rings, N = rings[0].length;
        var mop = clamp(mDrop * 4);
        for (var lv = 0; lv < rings.length - 1; lv++) {
          for (i = 0; i < N; i++) {
            var i2 = (i + 1) % N;
            var quad = [rings[lv][i], rings[lv][i2], rings[lv + 1][i2], rings[lv + 1][i]];
            g.poly(quad, CREAM, { cull: true, stroke: false, op: mop, bias: -30 });
          }
        }
        var top = rings[rings.length - 1];
        var capCol = light ? CREAM : mixh(M.zing, M.brand, 0.2 * melt);
        for (i = 0; i < N; i++) g.poly([top[i], top[(i + 1) % N], mm.apex], capCol, { cull: true, op: mop, bias: -31, stroke: false });
        // sugar shine on the dome
        g.dot(add(mix3(mm.apex, top[Math.round(N * 0.62) % N], 0.45), mul(A, 0.02)), 5 + 3 * melt, "#FFFFFF", { stroke: false, op: mop * (0.5 + 0.4 * melt), bias: -33, sx: 1.5 });
        // silhouette ring at the base
        var bot = rings[0].concat([rings[0][0]]);
        var hb = halves(bot, Fm, V);
        hb.front.forEach(function (p) { g.path(p, { w: 1.3, op: mop * 0.8, bias: -31.5 }); });

        // ---- drips: bead on the lowest point, stretch, let go, splash onto the foil and stay
        var low = rings[0][0];
        rings.forEach(function (rg) { rg.forEach(function (p) { if (p[2] < low[2]) low = p; }); });
        DRIPS.forEach(function (t0, di) {
          var d = seg(t, t0, t0 + 0.09);
          if (d <= 0) return;
          var anchor = add(low, [0.04 * di, -0.03 * di, 0.02]);
          var last = di === DRIPS.length - 1;
          var hang = last ? eo(seg(t, t0, 0.95)) : eo(clamp(d / 0.55)), fall = last ? 0 : clamp((d - 0.55) / 0.45);
          // where the drop meets the dish: march down to the surface
          var lo = 0, hi = 3;
          for (var it = 0; it < 24; it++) { var mid = (lo + hi) / 2; if (onDish(B, sub(anchor, [0, 0, mid])) > 0) lo = mid; else hi = mid; }
          var land = sub(anchor, [0, 0, lo]);
          var tip = sub(anchor, [0, 0, 0.05 + (last ? 0.3 : 0.16) * hang]);
          if (fall <= 0) {
            g.path([anchor, tip], { color: T.line, w: 7.5, bias: -32 });
            g.path([anchor, tip], { color: CREAM, w: 5, bias: -32.1 });
            g.dot(tip, 3.5 + 2 * hang, CREAM, { bias: -32.2, w: 1.2 });
          } else if (fall < 1) {
            var y = lerp(tip[2], land[2], fall * fall);
            g.dot([tip[0], tip[1], y], 5, CREAM, { bias: -13, w: 1.2 });
          }
          if (!last && (fall >= 1 || d >= 1)) {
            var spl = eo(seg(t, t0 + 0.09, t0 + 0.12));
            var n = dishN(B, Math.hypot(dot(sub(land, V0), B.e1), dot(sub(land, V0), B.e2)), Math.atan2(dot(sub(land, V0), B.e2), dot(sub(land, V0), B.e1)));
            var pb = basis(n), puddle = [];
            for (k = 0; k < 14; k++) {
              var aa = k / 14 * TAU, rr = (0.07 + 0.1 * spl) * (1 + 0.18 * Math.sin(aa * 3 + di * 2));
              puddle.push(add(land, add(add(mul(pb.e1, rr * Math.cos(aa)), mul(pb.e2, rr * Math.sin(aa))), mul(n, 0.01))));
            }
            g.poly(puddle, CREAM, { flat: true, bias: -11, w: 1.1 });
          }
        });

        // ---- steam wisps off the top while it melts
        var steamOn = seg(t, 0.58, 0.64) * (1 - seg(t, 0.86, 0.9));
        if (steamOn > 0) {
          var tq = g.P(add(Fm, mul(A, MH * 0.4)));
          for (k = 0; k < 3; k++) {
            var ph2 = frac(t * 5 + k / 3), x0 = tq[0] + (k - 1) * 22, y0 = tq[1] - 20 - ph2 * 56, d2 = "";
            for (var s2 = 0; s2 <= 8; s2++) {
              var yy = y0 - s2 * 6.5, xx = x0 + 7 * Math.sin(s2 * 0.9 + ph2 * 6 + k);
              d2 += (s2 ? "L" : "M") + f1(xx) + " " + f1(yy);
            }
            g.screen('<path d="' + d2 + '" fill="none" stroke="' + OR + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="' + (steamOn * Math.sin(Math.PI * ph2) * 0.75).toFixed(3) + '"/>');
          }
        }
      }
    }
  });

  function circleOnDish(B, r, n) { var o = []; for (var i = 0; i < n; i++) o.push(dishPt(B, r, i / n * TAU)); return o; }
})();

/* ---- stringtower/stringtower.js ---- */
;/* WonderLab "The Tensegrity Tower" challenge (no course photo yet: after Steve Mould's "Tower of String",
 * tiktok.com/@stevemould/video/7213304712660045061). Card strips are bent into arches, each one a bow whose two ends are
 * threaded on a single string, the bows overlapping and alternating sides as they go up.
 * 1. Seven flat strips lie by a small card base; each bends into an arch and is threaded on the string in turn, but the
 *    string is slack, so the pile slumps over like a wilted stem.
 * 2. A pull on the string's orange toggle: the string goes tight, the arches squeeze (they push, the string pulls) and
 *    the pile snaps up into a straight, stiff tower.
 * 3. Test: an orange finger pushes the tower sideways at two-thirds height; let go, it wobbles and springs back straight.
 * World units, z up; the string runs up from the base at the origin. Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back, hash = U.hash;
  var OR = "#FF6000"; // WonderLab orange: the toggle you pull and the finger that tests it

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  // ---- the parts
  var N = 7, LEN = 1.8, WD = 0.24, ZB = 0.06;          // strips, strip length and width, base board thickness
  var CT = 0.9, CS = 1.3, STEP = 0.55;                  // chord when tight / slack; each arch starts 55% of a chord above the last
  var PHI = []; for (var i = 0; i < N; i++) PHI.push((i * 180 + i * 32 + 20) * RAD); // alternate sides, slowly spiralling
  var MATS = ["paper", "foil"];
  var LEAN = 10 * RAD;                                                     // the slack chain topples this way
  var PUSH = [Math.cos(-20 * RAD), Math.sin(-20 * RAD), 0];                // the test push, across the view

  // ---- timing
  var PADS = 0.06, THREAD = [0.08, 0.035, 0.09];       // strips appear; threading: start, stagger, each piece's flight
  var PULL = [0.44, 0.55], PUSHIN = [0.62, 0.67], FREE = 0.67, DONE = 0.86;

  // half-angle of a circular arc of length LEN over chord c: sin(a)/a = c/LEN, a in (0, pi)
  function halfAngle(c) {
    var r = Math.min(0.995, c / LEN), lo = 1e-4, hi = Math.PI - 1e-4;
    for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (Math.sin(m) / m > r) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  // the string's centreline for tightness k (0 slack, 1 tight) and push deflection D: a curve through arc length s
  function chord(k) { return lerp(CS, CT, k); }
  function spineLen(k) { return (N - 1) * STEP * chord(k) + chord(k); }
  function spine(k, D) {
    var L = spineLen(k), n = 80, pts = [[0, 0, ZB]], p = [0, 0, ZB];
    for (var j = 1; j <= n; j++) {
      var s = (j - 0.5) / n * L, u = s / L;
      // slack: topples over just above the base and snakes across the table, the arches lying on their edges;
      // tight: straight up, bent only by the push. In between, the pull lifts it in one sweep
      var th = (1 - k) * Math.min(98 * RAD, 98 * RAD * u / 0.16);
      var ps = LEAN + (1 - k) * 2.4 * u;                // the toppled chain curls round on the table
      var lean = [Math.cos(ps), Math.sin(ps), 0];
      var tp = D * u * 1.9;
      var tng = norm(add(add(mul(lean, Math.sin(th)), mul(PUSH, Math.sin(tp))), [0, 0, Math.cos(th) * Math.cos(tp)]));
      p = add(p, mul(tng, L / n));
      if (p[2] < WD / 2 + 0.03) p[2] = WD / 2 + 0.03;   // resting on the table
      pts.push(p.slice());
    }
    return { pts: pts, L: L };
  }
  function at(sp, s) { // point on the spine at arc length s
    var f = Math.max(0, Math.min(1, s / sp.L)) * (sp.pts.length - 1), j = Math.min(Math.floor(f), sp.pts.length - 2);
    return l3(sp.pts[j], sp.pts[j + 1], f - j);
  }

  // one arch: sample points along the bow (with a short tab past each hole) and its binormal, for strip i
  function arch(sp, i, k) {
    var c = chord(k), s0 = i * STEP * c, A = at(sp, s0), B = at(sp, s0 + c), cv = sub(B, A), cl = Math.hypot(cv[0], cv[1], cv[2]);
    var u = norm(cv), h = [Math.cos(PHI[i]), Math.sin(PHI[i]), 0], d = norm(sub(h, mul(u, dot(h, u))));
    var al = halfAngle(cl), r = cl / (2 * Math.sin(al)), M = l3(A, B, 0.5), O = sub(M, mul(d, r * Math.cos(al))), ext = 0.11 / r;
    var P = [], m = 16;
    for (var j = 0; j <= m; j++) {
      var be = lerp(-al - ext, al + ext, j / m);
      P.push(add(O, add(mul(d, r * Math.cos(be)), mul(u, r * Math.sin(be)))));
    }
    return { P: P, b: cross(u, d), A: A, B: B, d: d };
  }
  function flat(i) { // the strip lying on the table, holes at the same places
    var x = -1.8 + i * 0.6, P = [], m = 16;
    for (var j = 0; j <= m; j++) P.push([x, -2.7 + j / m * (LEN + 0.22), 0.012]);
    return { P: P, b: [1, 0, 0] };
  }

  function strip(g, S, mat, op, bias) {
    var hw = WD / 2, E0 = S.P.map(function (p) { return add(p, mul(S.b, -hw)); }), E1 = S.P.map(function (p) { return add(p, mul(S.b, hw)); });
    for (var j = 0; j < S.P.length - 1; j++) {
      g.poly([E0[j], E0[j + 1], E1[j + 1], E1[j]], mat, { stroke: false, op: op, bias: bias });
      g.line(E0[j], E0[j + 1], { w: 1.4, op: op, bias: bias - 0.01 });
      g.line(E1[j], E1[j + 1], { w: 1.4, op: op, bias: bias - 0.01 });
    }
    var last = S.P.length - 1;
    g.line(E0[0], E1[0], { w: 1.4, op: op, bias: bias - 0.01 });
    g.line(E0[last], E1[last], { w: 1.4, op: op, bias: bias - 0.01 });
    [1, last - 1].forEach(function (j) { g.dot(S.P[j], 2.6, "ink", { w: 1.1, op: op, bias: bias - 0.02 }); }); // the holes
  }

  WL.define("stringtower", {
    cam: { yaw: 22, pitch: 18, S: 56, spin: 40, z: 2.2, cy: 0.9,
      at: function (t) {
        var k = eio(seg(t, 0.06, 0.4)), up = eio(seg(t, 0.4, 0.5)); // over the table, then up with the tower
        return { pitch: lerp(46, 34, k) - 18 * up, z: lerp(2.1, 2.2, k) - 0.15 * up, cy: lerp(0.56, 0.62, k) + 0.28 * up };
      } },
    draw: function (g, t) {
      var T = g.T, Z = T.mats.zing;
      g.grid(5, 1);
      var appear = eo(seg(t, 0.0, PADS));

      // tightness: the pull snaps it up (a little overshoot), then it stays tight
      var k = t < PULL[0] ? 0 : Math.min(1.04, back(seg(t, PULL[0], PULL[1])));
      k = Math.min(1, Math.max(0, k));
      // the test: pushed over, let go, wobbles back
      var D = 0;
      if (t >= PUSHIN[0] && t < FREE) D = 0.42 * eo(seg(t, PUSHIN[0], PUSHIN[1]));
      else if (t >= FREE) { var tau = (t - FREE) * 12; D = 0.42 * Math.exp(-2.6 * tau) * Math.cos(TAU * 1.6 * tau); }
      var sp = spine(k, D);

      // ---- the base: a small card square, the string tied underneath
      var bs = 0.5;
      g.box(-bs, -bs, 0, 2 * bs, 2 * bs, ZB * appear, "wood", { op: appear, bias: 2 });

      // ---- the strips: flat by the base, then each bends into an arch and is threaded on the string
      var placed = 0;
      for (var i = 0; i < N; i++) {
        var t0 = THREAD[0] + i * THREAD[1], f = eio(seg(t, t0, t0 + THREAD[2]));
        if (f >= 1) placed = i + 1;
        var F = flat(i), Aq = arch(sp, i, k), S;
        if (f <= 0) S = F;
        else if (f >= 1) S = Aq;
        else { // lift off the table and bend on the way to its place
          var lift = 0.9 * Math.sin(Math.PI * f);
          S = { P: F.P.map(function (p, j) { return add(l3(p, Aq.P[j], f), [0, 0, lift]); }), b: norm(l3(F.b, Aq.b, f)) };
        }
        strip(g, S, MATS[i % 2], appear, 0);
      }

      // ---- the string: up from the base through every hole placed so far, then a tail to the orange toggle
      var c = chord(k), topS = placed ? (placed - 1) * STEP * c + c : 0, tight = seg(t, PULL[0] + 0.03, PULL[1]);
      if (placed) {
        var seg0 = 0.06, wig = (1 - k) * 0.035;
        for (var s = 0; s < topS - 1e-6; s += seg0) {
          var p = at(sp, s), q = at(sp, Math.min(topS, s + seg0));
          var wp = [wig * Math.sin(s * 23), wig * Math.cos(s * 19), 0], wq = [wig * Math.sin((s + seg0) * 23), wig * Math.cos((s + seg0) * 19), 0];
          g.line(add(p, wp), add(q, wq), { color: tight > 0 ? Z : T.soft, w: lerp(1.3, 1.9, tight), bias: -0.05 });
        }
      }
      if (placed === N) {
        // the tail: from the top hole up to the toggle; the pull draws the toggle up and the tail straight
        var top = at(sp, topS), up = norm(sub(top, at(sp, topS - 0.2))), pull = eio(seg(t, PULL[0], PULL[1]));
        var slackTail = [add(top, [0.25, -0.1, 0.15]), add(top, [0.45, -0.2, 0.05])];
        var tailEnd = l3(slackTail[1], add(top, mul(up, 0.95)), pull);
        var mid = l3(slackTail[0], add(top, mul(up, 0.5)), pull);
        g.line(top, mid, { color: tight > 0 ? Z : T.soft, w: lerp(1.3, 1.9, tight), bias: -0.3 });
        g.line(mid, tailEnd, { color: tight > 0 ? Z : T.soft, w: lerp(1.3, 1.9, tight), bias: -0.3 });
        var tg = eo(seg(t, THREAD[0] + N * THREAD[1] + 0.06, THREAD[0] + N * THREAD[1] + 0.1));
        if (tg > 0) {
          var side = cross(up, [0, 0, 1]), bt = mul(Math.hypot(side[0], side[1]) > 1e-3 ? norm(side) : [1, 0, 0], 0.16); // the toggle lies across the string
          g.line(sub(tailEnd, bt), add(tailEnd, bt), { color: T.line, w: 9 * tg, bias: -0.4 });
          g.line(sub(tailEnd, bt), add(tailEnd, bt), { color: OR, w: 6 * tg, bias: -0.41 });
        }
        // as it goes tight: a pulse runs down the string
        var pulse = seg(t, PULL[0] + 0.02, PULL[1] + 0.03);
        if (pulse > 0 && pulse < 1) g.dot(at(sp, topS * (1 - pulse)), 5, Z, { stroke: false, op: 1 - pulse, bias: -0.6 });
      }

      // ---- the test finger: comes in from the side at two-thirds height, pushes, and lets go
      var fin = seg(t, PUSHIN[0] - 0.04, PUSHIN[0]), fout = seg(t, FREE, FREE + 0.05);
      if (fin > 0 && fout < 1) {
        var sF = sp.L * 0.68, cF = at(sp, sF), reach = 0.72;
        var away = 1.1 * (1 - eo(fin)) + 1.1 * eo(fout);
        var tip = sub(cF, mul(PUSH, reach + away)), base = sub(tip, add(mul(PUSH, 0.95), [0, 0, -0.18]));
        g.line(base, tip, { color: T.line, w: 15, bias: -1.2 });
        g.line(base, tip, { color: OR, w: 11.5, bias: -1.21 });
      }

      // ---- payoff: it stood up on tension alone and sprang back
      var ok = seg(t, DONE, DONE + 0.03);
      if (ok > 0) {
        var qt = g.P(add(at(sp, sp.L), [0, 0, 0.6]));
        g.screen('<path d="M' + (qt[0] + 64).toFixed(1) + ' ' + (qt[1] - 4).toFixed(1) + ' l10 10 l20 -22" fill="none" stroke="' + Z +
          '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="' + ok.toFixed(3) + '"/>');
      }
    }
  });
})();

/* ---- tensegrity/tensegrity.js ---- */
;/* WonderLab "Tensegrity Table": eight popsicle sticks and four wires, after Courses/9/IMG_4580.
 * Build: the base triangle (3 sticks) goes down and its arm stick swings up from corner B. The top (3 sticks plus an
 *        arm hanging from the middle of the side opposite B, so both arms share one vertical plane) is lowered in and
 *        the central wire ties the two arm tips; the top arm's tip sits below the base arm's tip, so the top literally
 *        hangs from that one wire.
 * Held by the centre wire alone the top sways; each of the three perimeter wires steadies it until it stands still.
 * Test: a foamboard table top goes on, then a small water bottle. The table dips a touch and springs back, the wires
 *       light up as they take the pull, the water sloshes, and it holds. The camera makes one full turn per loop.
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, clamp = U.clamp;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function rotAxis(p, c, ax, a) { // Rodrigues rotation of p about the axis ax through c
    var v = sub(p, c), k = Math.cos(a), s = Math.sin(a);
    return add(c, add(add(mul(v, k), mul(cross(ax, v), s)), mul(ax, dot(ax, v) * (1 - k))));
  }

  /* ------------------------------------------------------------------ geometry (one popsicle stick = 2.6 between end centres) */
  var SIDE = 2.6, R = SIDE / Math.sqrt(3), W = 0.28, TH = 0.06;
  // both arms lie in the vertical plane through corner B and the centre: the base arm rises from B, the top arm hangs from
  // the midpoint of the opposite top side (R/2 from the centre); their tips meet on one vertical line, GAP apart
  var AXU = [Math.cos(150 * RAD), Math.sin(150 * RAD), 0], REACH = (R + R / 2) / 2, RISE = Math.sqrt(SIDE * SIDE - REACH * REACH);
  var GAP = 1.25, H = 2 * (2.5 * TH + RISE) - GAP;
  function corner(a, z) { return [R * Math.cos(a * RAD), R * Math.sin(a * RAD), z]; }
  var ANG = [210, 330, 90];                                       // A front-left, B front-right, C back
  // stacked at the corners: each stick sits under one neighbour and over the other
  var LV = [[0, 0], [1, 0], [1, 1]];                              // stick i from corner i to i+1: layer at each end
  function triSticks(z0, dir) {
    return [0, 1, 2].map(function (i) {
      var j = (i + 1) % 3;
      return [corner(ANG[i], z0 + dir * (LV[i][0] + 0.5) * TH), corner(ANG[j], z0 + dir * (LV[i][1] + 0.5) * TH)];
    });
  }
  var BASE = triSticks(0, 1), TOP = triSticks(H, -1);
  var BARM0 = corner(ANG[1], 2.5 * TH), BARM1 = add(BARM0, add(mul(AXU, REACH), [0, 0, RISE]));                      // up from B
  var TARM0 = add(mul(AXU, R / 2), [0, 0, H - 2.5 * TH]), TARM1 = add(TARM0, add(mul(AXU, -REACH), [0, 0, -RISE])); // down from mid-side
  var HOLE = 0.02;
  var BOT = { r: [0.4, 0.42, 0.42, 0.41, 0.3, 0.17, 0.145, 0.145], z: [0, 0.05, 1.12, 1.24, 1.46, 1.63, 1.68, 1.78] };
  var CAP = [0.165, 1.78, 1.94], WATER = 1.25, BR = 0.42;
  var BOARD = { half: 1.55, th: 0.1 }, BOTTLE_Z = H + BOARD.th;   // foamboard table top

  /* ------------------------------------------------------------------ timing */
  var SEC = 10;                                                   // loop length in seconds
  var BASE_T = [0.02, 0.1], ARM_T = [0.09, 0.15], TOP_T = [0.14, 0.25], CWIRE = 0.26, LETGO = 0.29;
  var PWIRE = [0.32, 0.36, 0.4], BOARD_T = [0.47, 0.55], BOT_T = [0.7, 0.78];

  /* ------------------------------------------------------------------ camera */
  var KEYS = [[0, 1.9, 1.8, 24], [0.44, 1.95, 1.75, 24], [0.6, 2.85, 1.45, 22], [1, 2.85, 1.45, 22]]; // [t, focus z, zoom, pitch]
  // one full turn per loop, phased so the arms' shared plane faces the camera at the centre wire (t 0.28) and at the landing
  function yawAt(t) { return 30 - 360 * 0.28 + 360 * t; }
  function camAt(t) {
    for (var i = 0; i < KEYS.length - 1; i++) { var a = KEYS[i], b = KEYS[i + 1]; if (t <= b[0]) { var k = eio(seg(t, a[0], b[0])); return a.map(function (v, j) { return lerp(v, b[j], k); }); } }
    return KEYS[KEYS.length - 1];
  }
  function wrap(g, off) {
    function sh(p) { return [p[0] - off[0], p[1] - off[1], p[2] - off[2]]; }
    return {
      T: g.T, V: g.V, S: g.S, screen: g.screen, P: function (p) { return g.P(sh(p)); },
      poly: function (pts, m, o) { g.poly(pts.map(sh), m, o); },
      path: function (pts, o) { g.path(pts.map(sh), o); },
      dot: function (p, r, m, o) { g.dot(sh(p), r, m, o); }
    };
  }

  /* ------------------------------------------------------------------ parts */
  // a flat popsicle stick between two end centres, broad face normal n (rounded ends, thickness TH)
  function stick(G, E0, E1, n, o) {
    var a = norm(sub(E1, E0)), b = norm(cross(n, a)), r = W / 2, out = [], k;
    for (k = 0; k <= 8; k++) { var f = (90 - k * 22.5) * RAD; out.push(add(E1, add(mul(a, r * Math.cos(f)), mul(b, r * Math.sin(f))))); }
    for (k = 0; k <= 8; k++) { var f2 = (-90 - k * 22.5) * RAD; out.push(add(E0, add(mul(a, r * Math.cos(f2)), mul(b, r * Math.sin(f2))))); }
    var up = out.map(function (p) { return add(p, mul(n, TH / 2)); }), dn = out.map(function (p) { return add(p, mul(n, -TH / 2)); });
    var V = G.V, mid = mix3(E0, E1, 0.5), vis = { op: o.op, bias: o.bias };
    for (k = 0; k < out.length; k++) {
      var k2 = (k + 1) % out.length, q = mix3(out[k], out[k2], 0.5), on = norm(sub(q, add(mid, mul(a, dot(sub(q, mid), a)))));
      if (dot(on, V) > 0) G.poly([up[k], up[k2], dn[k2], dn[k]], "wood", { stroke: false, op: o.op, bias: o.bias });
    }
    var face = dot(n, V) > 0 ? up : dn;
    G.poly(face, "wood", { op: o.op, bias: o.bias - 0.01, w: 1.4 });
    var sgn = dot(n, V) > 0 ? 1 : -1;  // a faint grain line down the middle of the visible face
    G.path([add(add(E0, mul(a, r * 0.6)), mul(n, sgn * (TH / 2 + 0.003))), add(add(E1, mul(a, -r * 0.6)), mul(n, sgn * (TH / 2 + 0.003)))], { color: G.T.soft, w: 1, op: (o.op || 1) * 0.4, bias: o.bias - 0.02 });
    return vis;
  }
  function armNormal(E0, E1) { return norm(cross(norm(sub(E1, E0)), [0, 0, 1])); }
  function wire(G, a, b, o, buzz) {
    var m = mix3(a, b, 0.5);
    if (buzz) m = add(m, buzz);
    G.path([a, m, b], o);
    G.dot(a, 2.2, o.color, { stroke: false, op: o.op, bias: o.bias - 0.05 });
    G.dot(b, 2.2, o.color, { stroke: false, op: o.op, bias: o.bias - 0.05 });
  }
  function lathe(G, c, prof, n, colAt, o) {
    var rings = prof.r.map(function (r, i) { var ring = []; for (var k = 0; k < n; k++) { var a = k / n * TAU; ring.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2] + prof.z[i]]); } return ring; });
    for (var i = 0; i < rings.length - 1; i++) for (var k = 0; k < n; k++) {
      var k2 = (k + 1) % n, q = [rings[i][k], rings[i][k2], rings[i + 1][k2], rings[i + 1][k]];
      var nrm = norm(cross(sub(q[1], q[0]), sub(q[3], q[0])));
      if (dot(nrm, G.V) < -0.02) continue;
      G.poly(q, colAt(i, k, q), { stroke: false, op: o.op, bias: o.bias });
    }
    return rings;
  }

  WL.define("tensegrity", {
    cam: { yaw: 18, pitch: 16, S: 64, amp: 0, cy: 0.5, at: function (t) { var c = camAt(t); return { z: c[2], pitch: c[3], yaw: yawAt(t) }; } },
    draw: function (g0, t) {
      var cam = camAt(t), G = wrap(g0, [0, 0, cam[1]]), T = g0.T, M = T.mats, V = g0.V;

      // ---- table surface (grid)
      for (var gx = -4; gx <= 4.01; gx += 1) { G.path([[gx, -4, 0], [gx, 4, 0]], { color: T.grid, w: 1, bias: 100 }); G.path([[-4, gx, 0], [4, gx, 0]], { color: T.grid, w: 1, bias: 100 }); }

      // ---- how the top moves: lowered in, sways on the centre wire until the perimeter wires steady it, dips under the bottle
      var lower = 1 - eio(seg(t, TOP_T[0] + 0.03, TOP_T[1]));
      var calm = 1 - 0.45 * seg(t, PWIRE[0], PWIRE[0] + 0.02) - 0.35 * seg(t, PWIRE[1], PWIRE[1] + 0.02) - 0.2 * seg(t, PWIRE[2], PWIRE[2] + 0.02);
      var sway = t < LETGO ? 0 : 13 * RAD * calm * Math.sin((t - LETGO) * SEC * 2.6) * seg(t, LETGO, LETGO + 0.02);
      var tau = Math.max(0, (t - BOT_T[1]) * SEC);
      var tb = Math.max(0, (t - BOARD_T[1]) * SEC);
      var dip = (t < BOARD_T[1] ? 0 : 0.015 * (1 - Math.exp(-3 * tb) * Math.cos(10 * tb))) + (t < BOT_T[1] ? 0 : 0.06 * (1 - Math.exp(-2.2 * tau) * Math.cos(9 * tau)));
      var ax = norm([Math.cos(40 * RAD), Math.sin(40 * RAD), 0]);
      function top(p) { return add(rotAxis(p, TARM1, ax, sway), [0, 0, 2.2 * lower - dip]); }

      // ---- base: three sticks drop in, the arm swings up from corner B
      BASE.forEach(function (s, i) {
        var a = eo(seg(t, BASE_T[0] + i * 0.022, BASE_T[0] + i * 0.022 + 0.04));
        if (a > 0) stick(G, add(s[0], [0, 0, 0.7 * (1 - a)]), add(s[1], [0, 0, 0.7 * (1 - a)]), [0, 0, 1], { op: a, bias: 0 });
      });
      var arm = eio(seg(t, ARM_T[0], ARM_T[1])), aOp = seg(t, ARM_T[0] - 0.01, ARM_T[0] + 0.01);
      var hinge = norm(cross([0, 0, 1], norm([-BARM0[0], -BARM0[1], 0])));
      var bTip = rotAxis(BARM1, BARM0, hinge, -(1 - arm) * Math.atan2(RISE, REACH));
      if (aOp > 0) stick(G, BARM0, bTip, armNormal(BARM0, bTip), { op: aOp, bias: 0 });

      // ---- top: three sticks and the hanging arm, as one assembly
      var tOp = seg(t, TOP_T[0], TOP_T[0] + 0.03);
      var tTip = top(TARM1);
      if (tOp > 0) {
        TOP.forEach(function (s) { stick(G, top(s[0]), top(s[1]), norm(sub(top([0, 0, 1]), top([0, 0, 0]))), { op: tOp, bias: 0 }); });
        var t0 = top(TARM0);
        stick(G, t0, tTip, armNormal(t0, tTip), { op: tOp, bias: 0 });
      }
      // holes near the arm tips
      if (aOp > 0) G.dot(add(bTip, mul(armNormal(BARM0, bTip), TH / 2 + HOLE)), 2.4, "ink", { stroke: false, op: aOp, bias: -0.2 });
      if (tOp > 0) G.dot(add(tTip, mul(armNormal(top(TARM0), tTip), TH / 2 + HOLE)), 2.4, "ink", { stroke: false, op: tOp, bias: -0.2 });

      // ---- wires: glow as they are tied, and again when the bottle loads them
      var load = t < BOT_T[1] ? 0 : Math.exp(-0.9 * tau) * 0.6 + 0.4 * seg(t, BOT_T[1], BOT_T[1] + 0.02);
      function wcol(t0) { var f = seg(t, t0, t0 + 0.012) * (1 - seg(t, t0 + 0.02, t0 + 0.06)); return Math.max(f, load); }
      function buzz(t0, a, b) {
        var e = Math.max(0, (t - t0) * SEC), amp = 0.06 * Math.exp(-3 * e) * Math.sin(e * 60), side = norm(cross(sub(b, a), [0, 0, 1]));
        var e2 = Math.max(0, tau), amp2 = t > BOT_T[1] ? 0.04 * Math.exp(-2.5 * e2) * Math.sin(e2 * 55) : 0;
        return mul(side, t > t0 ? amp + amp2 : 0);
      }
      var cw = seg(t, CWIRE, CWIRE + 0.025);
      if (cw > 0) {
        var ca = bTip, cb = mix3(bTip, tTip, cw), hot = wcol(CWIRE);
        wire(G, ca, cb, { color: "#FF6000", w: 1.8 + 1.2 * hot, bias: -0.5 }, cw >= 1 ? buzz(CWIRE, ca, cb) : null); // WonderLab orange: the tension
      }
      PWIRE.forEach(function (t0, i) {
        var p = seg(t, t0, t0 + 0.025);
        if (p <= 0) return;
        var tc = top(corner(ANG[i], H - 1.5 * TH)), bc = corner(ANG[i], 1.5 * TH), hot = wcol(t0);
        wire(G, tc, mix3(tc, bc, p), { color: "#FF6000", w: 1.4 + 1.2 * hot, bias: -0.5 }, p >= 1 ? buzz(t0, tc, bc) : null);
      });

      // ---- foamboard table top: lowered on and settles
      var bd = seg(t, BOARD_T[0], BOARD_T[1]);
      if (bd > 0) {
        var bz = H + 1.4 * (1 - eio(bd)) - dip, hb = BOARD.half, bo = seg(t, BOARD_T[0], BOARD_T[0] + 0.02);
        var sq = [[-hb, -hb], [hb, -hb], [hb, hb], [-hb, hb]];
        var lo = sq.map(function (q) { return [q[0], q[1], bz]; }), hi = sq.map(function (q) { return [q[0], q[1], bz + BOARD.th]; });
        for (var e2 = 0; e2 < 4; e2++) {
          var f2 = (e2 + 1) % 4, en = norm([lo[e2][0] + lo[f2][0], lo[e2][1] + lo[f2][1], 0]);
          if (dot(en, V) <= 0) continue;
          G.poly([lo[e2], lo[f2], hi[f2], hi[e2]], "paper", { op: bo, bias: -2, w: 1.2 });
          G.path([add(lo[e2], [0, 0, BOARD.th / 2]), add(lo[f2], [0, 0, BOARD.th / 2])], { color: T.soft, w: 1, op: bo, bias: -2.05 }); // foam core
        }
        G.poly(hi, "sky", { op: bo, bias: -2.1, w: 1.4 });
      }

      // ---- the water bottle: lowered on, lands, water sloshes
      var bIn = seg(t, BOT_T[0], BOT_T[1]);
      if (bIn > 0) {
        var c = [0, 0, BOTTLE_Z + 1.6 * (1 - eio(bIn)) - dip];
        var slosh = t < BOT_T[1] ? 0 : 0.2 * Math.exp(-1.6 * tau) * Math.sin(tau * 7);
        var sd = [Math.cos(60 * RAD), Math.sin(60 * RAD)];
        function wz(x, y) { return c[2] + WATER + slosh * (x * sd[0] + y * sd[1]); }
        var bop = seg(t, BOT_T[0], BOT_T[0] + 0.02);
        lathe(G, c, BOT, 28, function (i, k, q) {
          var mz = (q[0][2] + q[2][2]) / 2;
          return mz < wz((q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2) ? "sky" : "paper";
        }, { op: bop, bias: -3 });
        // outline, water line, cap and a highlight streak
        var sil = [], wl = [], k;
        for (k = 0; k <= 40; k++) {
          var a = k / 40 * TAU, dx = Math.cos(a), dy = Math.sin(a);
          var rw = BR, p = [c[0] + rw * dx, c[1] + rw * dy, 0];
          p[2] = wz(p[0], p[1]);
          if (dot([dx, dy, 0], V) >= -0.05) wl.push(p);
        }
        G.path(wl, { color: "brand", w: 1.6, op: bop, bias: -3.4 });
        var side = norm(cross([0, 0, 1], V)); side = norm([side[0], side[1], 0]);
        [-1, 1].forEach(function (s) {
          var pts = BOT.r.map(function (r, i) { return add(c, [side[0] * r * s, side[1] * r * s, BOT.z[i]]); });
          G.path(pts, { color: T.line, w: 1.6, op: bop, bias: -3.5 });
        });
        var base = []; for (k = 0; k <= 24; k++) { var a2 = k / 24 * TAU; if (dot([Math.cos(a2), Math.sin(a2), 0], V) >= -0.05) base.push([c[0] + BOT.r[0] * Math.cos(a2), c[1] + BOT.r[0] * Math.sin(a2), c[2]]); }
        G.path(base, { color: T.line, w: 1.6, op: bop, bias: -3.5 });
        var hl = add(c, [-side[0] * 0.28, -side[1] * 0.28, 0]);
        G.path([add(hl, [0, 0, 0.2]), add(hl, [0, 0, 1.02])], { color: "zing", w: 2.4, op: bop * 0.5, bias: -3.6 });
        lathe(G, c, { r: [CAP[0], CAP[0], 0.001], z: [CAP[1], CAP[2], CAP[2]] }, 16, function () { return "zing"; }, { op: bop, bias: -3.7 }); // white cap
        // weight arrow as it settles
        var wa = seg(t, BOT_T[1] - 0.01, BOT_T[1] + 0.01) * (1 - seg(t, BOT_T[1] + 0.07, BOT_T[1] + 0.1));
        if (wa > 0) {
          var q0 = G.P(add(c, [0, 0, CAP[2] + 0.25])), L = 54, OR = "#FF6000"; // the load, in WonderLab orange
          G.screen('<path d="M' + q0[0].toFixed(1) + " " + (q0[1] - L).toFixed(1) + "V" + (q0[1] - 10).toFixed(1) + '" stroke="' + OR + '" stroke-width="4" stroke-linecap="round" opacity="' + wa.toFixed(3) + '"/>' +
            '<path d="M' + (q0[0] - 12).toFixed(1) + " " + (q0[1] - 18).toFixed(1) + "L" + q0[0].toFixed(1) + " " + (q0[1] - 2).toFixed(1) + "L" + (q0[0] + 12).toFixed(1) + " " + (q0[1] - 18).toFixed(1) + 'Z" fill="' + OR + '" opacity="' + wa.toFixed(3) + '"/>');
        }
      }
    }
  });
})();

/* ---- tiles/tiles.js ---- */
;/* WonderLab "The Infinite Facade" for Explorers (the Infinite Piazza card): one rubber stamp, two quarter-circle arcs,
 * turned a quarter turn or not, repeated into a sheet-sized pattern. Same 7 x 5 Truchet pattern as before.
 * Step 1, carve: a lino gouge cuts the two arcs into a rubber square; curls of rubber pile up and are brushed away as
 *         the background is cleared, leaving the arcs raised.
 * Step 2, ink: a roller loaded with white ink inks the raised arcs.
 * Step 3, rotate and stamp: the stamp flips face down over a sheet of paper. The arrow on its back shows each quarter
 *         turn; the first prints are slow, then the whole sheet fills. Only the white lines print.
 * Finale: top view of the drawing, then a diagonal wave turns every tile a quarter turn and a new pattern appears.
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, back = U.back, lerp = U.lerp, clamp = U.clamp, hash = U.hash;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function rotXv(p, a) { var s = Math.sin(a), k = Math.cos(a); return [p[0], p[1] * k - p[2] * s, p[1] * s + p[2] * k]; }

  /* ------------------------------------------------------------------ the tile (u right, v up): two quarter arcs */
  var BW = 0.085;
  function arc(cx, cy, r, a0, a1, n) { var o = []; for (var i = 0; i <= n; i++) { var a = lerp(a0, a1, i / n) * RAD; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return o; }
  function clipHalf(poly, f) {
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { var k = fa / (fa - fb); out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]); }
    }
    return out;
  }
  function ribbon(c) {
    var L = [], R = [];
    c.forEach(function (p, i) {
      var a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      var nx = -dy / l * BW / 2, ny = dx / l * BW / 2;
      L.push([p[0] + nx, p[1] + ny]); R.push([p[0] - nx, p[1] - ny]);
    });
    return { poly: L.concat(R.slice().reverse()), L: L, R: R, c: c };
  }
  var PARTS = [arc(0, 0, 0.5, 0, 90, 28), arc(1, 1, 0.5, 180, 270, 28)].map(ribbon);   // same arcs as the original tiles
  var CUTS = [0.045, 0.045], HOP = 0.012, CARVE0 = 0.06;
  var CUT_T = (function () { var o = [], t = CARVE0; CUTS.forEach(function (d) { o.push([t, t + d]); t += d + HOP; }); return o; })();
  var CARVE1 = CUT_T[CUT_T.length - 1][1];
  function turn(p, k) { for (var i = 0; i < k; i++) p = [1 - p[1], p[0]]; return p; }   // quarter turn, anticlockwise seen from above
  function spin(p, a) { var s = Math.sin(a), c = Math.cos(a), du = p[0] - 0.5, dv = p[1] - 0.5; return [0.5 + du * c - dv * s, 0.5 + du * s + dv * c]; }

  /* ------------------------------------------------------------------ places and timing */
  var COLS = 7, ROWS = 5, S = 1.1, X0 = -COLS * S / 2, Y0 = -ROWS * S / 2;   // the sheet, as in the original
  var MC = [-6.4, -4.6];                                                  // cutting mat
  var SQ = S, H = SQ / 2, RUB = 0.07, MOUNT = 0.15;
  var CLEAR = [0.175, 0.2], INK = [0.21, 0.27], FLIP = [0.285, 0.34], WAVE = [0.82, 0.9];
  function ori(c, r) { return hash((r * COLS + c) * 3.1) > 0.5 ? 1 : 0; }   // the original pattern's orientation map
  var PRINTS = (function () {
    var o = [], t = FLIP[1], n = 0;
    for (var r = ROWS - 1; r >= 0; r--) for (var c = 0; c < COLS; c++) {
      var d = n < 4 ? 0.035 : n < 10 ? 0.018 : 0.0078;
      o.push({ c: c, r: r, k: ori(c, r), t0: t, d: d }); t += d; n++;
    }
    var prev = 0;
    o.forEach(function (p) { p.psi = p.k ? -90 : 0; if (Math.abs(p.psi - prev) > 180) p.psi += 360 * Math.sign(prev - p.psi); prev = p.psi; });
    return o;
  })();
  var HAND_END = PRINTS[PRINTS.length - 1].t0 + PRINTS[PRINTS.length - 1].d;
  function cellCentre(c, r) { return [X0 + (c + 0.5) * S, Y0 + (r + 0.5) * S, 0]; }

  /* ------------------------------------------------------------------ camera: [t, focus x, y, z, zoom, pitch, yaw] */
  var F4 = [X0 + 2 * S, Y0 + (ROWS - 0.5) * S];
  var KEYS = [[0, MC[0], MC[1], 0.22, 4.7, 52, 10], [0.17, MC[0], MC[1], 0.22, 5.0, 52, 10], [0.205, MC[0] + 0.1, MC[1], 0.22, 4.3, 50, 10],
              [0.275, MC[0] + 0.1, MC[1], 0.22, 4.3, 50, 10], [0.34, F4[0] - 0.8, F4[1] - 0.2, 0, 2.7, 58, 6], [0.47, F4[0], F4[1] - 0.3, 0, 2.6, 58, 6],
              [0.58, 0, -0.1, 0, 1.45, 64, 4], [0.78, 0, -0.1, 0, 1.42, 66, 4], [0.84, 0, 0, 0, 1.5, 90, 0], [1, 0, 0, 0, 1.5, 90, 0]];
  function camAt(t) {
    for (var i = 0; i < KEYS.length - 1; i++) { var a = KEYS[i], b = KEYS[i + 1]; if (t <= b[0]) { var k = eio(seg(t, a[0], b[0])); return a.map(function (v, j) { return lerp(v, b[j], k); }); } }
    return KEYS[KEYS.length - 1];
  }
  function wrap(g, off) {
    function sh(p) { return [p[0] - off[0], p[1] - off[1], p[2] - off[2]]; }
    function shA(a) { return a.map(sh); }
    return {
      T: g.T, V: g.V, S: g.S, screen: g.screen, P: function (p) { return g.P(sh(p)); },
      poly: function (pts, m, o) { g.poly(shA(pts), m, o); },
      path: function (pts, o) { g.path(shA(pts), o); },
      box8: function (C, m, o) { g.box8(shA(C), m, o); }
    };
  }

  /* ------------------------------------------------------------------ the stamp's pose */
  // C: centre of the rubber face; alpha flips it from face-up (0) to face-down (180); psi turns it
  function basis(alpha, psi) {
    var s = Math.sin(psi * RAD), c = Math.cos(psi * RAD);
    return { A: rotXv([c, s, 0], -alpha * RAD), B: rotXv([-s, c, 0], -alpha * RAD), N: rotXv([0, 0, 1], -alpha * RAD) };
  }
  function stampPose(t) {
    var mat = [MC[0], MC[1], RUB + MOUNT];
    if (t < FLIP[0]) return { C: mat, alpha: 0, psi: 0, op: 1 };
    var first = PRINTS[0], hover = add(cellCentre(first.c, first.r), [0, 0, 0.7]);
    if (t < FLIP[1]) {
      var k = eio(seg(t, FLIP[0], FLIP[1])), p = mix3(mat, hover, k); p[2] += 1.5 * Math.sin(Math.PI * k);
      return { C: p, alpha: 180 * eio(seg(t, FLIP[0] + 0.005, FLIP[1] - 0.008)), psi: 0, op: 1 };
    }
    for (var i = 0; i < PRINTS.length; i++) {
      var P = PRINTS[i], s = seg(t, P.t0, P.t0 + P.d);
      if (t > P.t0 + P.d && i < PRINTS.length - 1) continue;
      var cc = cellCentre(P.c, P.r), prev = i ? PRINTS[i - 1] : null, from = prev ? cellCentre(prev.c, prev.r) : cc, psi0 = prev ? prev.psi : 0;
      var mv = eio(seg(s, 0, 0.45)), gap = 0.7 * (1 - eio(seg(s, 0.45, 0.6))) + 0.7 * eo(seg(s, 0.72, 1));
      var pos = mix3(from, cc, mv); pos[2] = gap + (prev ? 0.25 * Math.sin(Math.PI * mv) : 0);
      if (t > P.t0 + P.d) { // done: lift away and fade
        var off = seg(t, HAND_END, HAND_END + 0.04);
        return { C: add([cc[0], cc[1], 0.7], [1.2 * eo(off), 0.6 * eo(off), 1.4 * eo(off)]), alpha: 180, psi: P.psi, op: 1 - off };
      }
      return { C: pos, alpha: 180, psi: lerp(psi0, P.psi, mv), op: 1 };
    }
  }
  function printed(P, t) { return seg(t, P.t0 + P.d * 0.7, P.t0 + P.d * 0.78); }

  /* ------------------------------------------------------------------ drawing helpers */
  function tileDraw(G, map, col, o, clipU) {
    PARTS.forEach(function (pt) {
      var poly = clipU !== undefined ? clipHalf(pt.poly, function (q) { return clipU - q[0]; }) : pt.poly;
      if (poly.length > 2) G.poly(poly.map(map), col, o);
    });
  }
  function tube(G, a, b, w, core, o) {
    G.path([a, b], { color: G.T.line, w: w + 3, op: o.op, bias: o.bias });
    G.path([a, b], { color: core, w: w, op: o.op, bias: o.bias - 0.01 });
  }
  function curl(G, c, tdir, n, size, o) {
    var pts = [];
    for (var i = 0; i <= 7; i++) { var a = i / 7 * 1.6 * Math.PI, r = size * (1 - i / 10); pts.push(add(c, add(mul(tdir, r * Math.cos(a)), mul(n, size + r * Math.sin(a))))); }
    G.path(pts, o);
  }

  WL.define("tiles", {
    cam: { yaw: 10, pitch: 52, S: 60, amp: 0, cy: 0.5, at: function (t) { var c = camAt(t); return { z: c[4], pitch: c[5], yaw: c[6] }; } },
    draw: function (g0, t) {
      var cam = camAt(t), G = wrap(g0, [cam[1], cam[2], cam[3]]), T = g0.T, M = T.mats, px = g0.S, V = g0.V;

      // ---- table grid
      for (var gx = -10; gx <= 6.01; gx += 1) G.path([[gx, -7, 0], [gx, 4, 0]], { color: T.grid, w: 1, bias: 100 });
      for (var gy = -7; gy <= 4.01; gy += 1) G.path([[-10, gy, 0], [6, gy, 0]], { color: T.grid, w: 1, bias: 100 });

      // ---- the sheet of paper with a faint pencil grid
      var pm = 0.3;
      G.poly([[X0 - pm, Y0 - pm, 0.002], [-X0 + pm, Y0 - pm, 0.002], [-X0 + pm, -Y0 + pm, 0.002], [X0 - pm, -Y0 + pm, 0.002]], "paper", { flat: true, w: 1.2, bias: 70 });
      for (var c = 0; c <= COLS; c++) G.path([[X0 + c * S, Y0, 0.003], [X0 + c * S, -Y0, 0.003]], { color: T.soft, w: 1, op: 0.3, bias: 69 });
      for (var r = 0; r <= ROWS; r++) G.path([[X0, Y0 + r * S, 0.003], [-X0, Y0 + r * S, 0.003]], { color: T.soft, w: 1, op: 0.3, bias: 69 });
      // prints: white lines only; in the finale a diagonal wave gives every tile one more quarter turn
      var wv = seg(t, WAVE[0], WAVE[1]);
      PRINTS.forEach(function (P) {
        var a = printed(P, t);
        if (a <= 0) return;
        var w = eio(clamp(wv * 2.2 - (P.c + P.r) / (COLS + ROWS) * 1.2)), cc = cellCentre(P.c, P.r);
        tileDraw(G, function (q) { var p = spin(turn(q, P.k), w * Math.PI / 2); return [cc[0] + (p[0] - 0.5) * S * 1.006, cc[1] + (p[1] - 0.5) * S * 1.006, 0.006]; },
          "zing", { flat: true, stroke: false, op: a, bias: -20 });
      });

      // ---- cutting mat
      var mw = 1.3, md = 1.0, mo = 1 - seg(t, 0.5, 0.56);   // put away once the stamping has started
      if (mo > 0) {
        G.poly([[MC[0] - mw, MC[1] - md, 0.003], [MC[0] + mw, MC[1] - md, 0.003], [MC[0] + mw, MC[1] + md, 0.003], [MC[0] - mw, MC[1] + md, 0.003]], "sky", { flat: true, op: mo, bias: 60 });
        for (var mg = 1; mg < 10; mg++) G.path([[MC[0] - mw + mg * 0.26, MC[1] - md, 0.004], [MC[0] - mw + mg * 0.26, MC[1] + md, 0.004]], { color: T.soft, w: 1, op: 0.35 * mo, bias: 59 });
        for (mg = 1; mg < 8; mg++) G.path([[MC[0] - mw, MC[1] - md + mg * 0.25, 0.004], [MC[0] + mw, MC[1] - md + mg * 0.25, 0.004]], { color: T.soft, w: 1, op: 0.35 * mo, bias: 59 });
      }

      // ---- the stamp
      var pose = stampPose(t), Bs = basis(pose.alpha, pose.psi), SC = pose.C, sop = pose.op * seg(t, 0.01, 0.04);
      function lp(a, b, cN) { return add(SC, add(add(mul(Bs.A, a), mul(Bs.B, b)), mul(Bs.N, cN))); }
      function slab(c0, c1, mat, o) { G.box8([lp(-H, -H, c0), lp(H, -H, c0), lp(H, H, c0), lp(-H, H, c0), lp(-H, -H, c1), lp(H, -H, c1), lp(H, H, c1), lp(-H, H, c1)], mat, o); }
      var stBias = pose.alpha > 90 ? -40 : 0;
      if (sop > 0.01) {
        slab(-RUB - MOUNT, -RUB, "wood", { op: sop, bias: stBias });
        slab(-RUB, 0, "brand", { op: sop, bias: stBias });
      }
      var faceMap = function (q) { return lp((q[0] - 0.5) * SQ, (q[1] - 0.5) * SQ, 0.003); };
      var faceUp = dot(Bs.N, V) > 0.05, fb = stBias - 2;
      if (faceUp && sop > 0.01) {
        var clr = eio(seg(t, CLEAR[0], CLEAR[1]));
        if (clr > 0) {
          var bg = clipHalf([[0, 0], [1, 0], [1, 1], [0, 1]], function (q) { return clr * 1.02 - q[0]; });
          if (bg.length > 2) G.poly(bg.map(faceMap), "sky", { flat: true, stroke: false, op: sop, bias: fb });
          tileDraw(G, faceMap, "brand", { flat: true, stroke: false, op: sop, bias: fb - 0.5 }, clr * 1.02);
        }
        var rollX = lerp(-0.25, 1.25, seg(t, INK[0], INK[1]));
        if (t > INK[0]) tileDraw(G, faceMap, "zing", { flat: true, stroke: false, op: sop, bias: fb - 1 }, rollX);
        PARTS.forEach(function (pt, i) {
          var cp = seg(t, CUT_T[i][0], CUT_T[i][1]);
          if (cp <= 0) return;
          [pt.L, pt.R].forEach(function (ln) {
            var n = Math.max(2, Math.round(cp * (ln.length - 1)) + 1);
            G.path(ln.slice(0, n).map(faceMap), { color: "ink", w: 0.012 * px, op: sop, bias: fb - 1.5 });
          });
        });
      }

      // ---- step 1: the gouge, with curls of rubber
      var gOn = seg(t, CARVE0 - 0.02, CARVE0) * (1 - seg(t, CARVE1, CARVE1 + 0.02));
      if (gOn > 0.01) {
        var tip, dir;
        for (var i = 0; i < CUT_T.length; i++) {
          var ln = PARTS[i].c;
          if (t < CUT_T[i][0]) {
            var prevEnd = i ? PARTS[i - 1].c[PARTS[i - 1].c.length - 1] : [1.2, 1.3], hs = seg(t, i ? CUT_T[i - 1][1] : CARVE0 - 0.02, CUT_T[i][0]);
            var q0 = faceMap(prevEnd), q1 = faceMap(ln[0]);
            tip = add(mix3(q0, q1, eio(hs)), mul(Bs.N, 0.22 * Math.sin(Math.PI * hs)));
            dir = norm(sub(faceMap(ln[1]), q1));
            break;
          }
          if (t <= CUT_T[i][1]) {
            var cp = seg(t, CUT_T[i][0], CUT_T[i][1]), fi = cp * (ln.length - 1), j = Math.min(ln.length - 2, Math.floor(fi));
            var qa = ln[j], qb = ln[j + 1], fr = fi - j;
            tip = faceMap([lerp(qa[0], qb[0], fr), lerp(qa[1], qb[1], fr)]); dir = norm(sub(faceMap(qb), faceMap(qa)));
            break;
          }
        }
        if (!tip) { var last = PARTS[PARTS.length - 1].c; tip = add(faceMap(last[last.length - 1]), mul(Bs.N, 0.6 * seg(t, CARVE1, CARVE1 + 0.02))); dir = [1, 0, 0]; }
        var hdl = norm(add(mul(dir, -0.75), mul(Bs.N, 0.66))), gb = fb - 6;
        G.path([tip, add(tip, mul(hdl, 0.2))], { color: T.line, w: 0.03 * px, op: gOn, bias: gb });
        tube(G, add(tip, mul(hdl, 0.2)), add(tip, mul(hdl, 0.95)), 0.075 * px, "wood", { op: gOn, bias: gb - 0.1 });
      }
      var brush = seg(t, CLEAR[0], CLEAR[0] + 0.02);
      if (faceUp && t > CARVE0 && brush < 1) {
        for (var e = 0; e < 36; e++) {
          var te = CARVE0 + e * 0.003, ci = -1;
          for (i = 0; i < CUT_T.length; i++) if (te >= CUT_T[i][0] && te <= CUT_T[i][1]) ci = i;
          if (ci < 0 || t < te) continue;
          var cl2 = PARTS[ci].c, cf = seg(te, CUT_T[ci][0], CUT_T[ci][1]) * (cl2.length - 1), cj = Math.min(cl2.length - 2, Math.floor(cf));
          var pa = faceMap(cl2[cj]), pb = faceMap(cl2[cj + 1]), td = norm(sub(pb, pa)), side = cross(Bs.N, td);
          var life = seg(t, te, te + 0.025), sgn = e % 2 ? 1 : -1;
          var pos = add(add(pa, mul(side, sgn * (0.08 + 0.1 * hash(e) * eo(life)))), mul(Bs.N, 0.16 * Math.sin(Math.PI * life)));
          curl(G, pos, td, Bs.N, 0.022 + 0.013 * hash(e * 3.3), { color: "brand", w: 0.011 * px, op: (1 - brush) * sop, bias: fb - 3 });
        }
      }

      // ---- step 2: the ink roller
      var rOn = seg(t, INK[0] - 0.012, INK[0]) * (1 - seg(t, INK[1], INK[1] + 0.012));
      if (rOn > 0.01) {
        var rs = seg(t, INK[0], INK[1]), rr = 0.13, lift = 0.4 * seg(t, INK[1], INK[1] + 0.012) + 0.4 * (1 - seg(t, INK[0] - 0.012, INK[0]));
        var rc = [MC[0] - H + lerp(-0.25, 1.25, rs) * SQ, MC[1], RUB + MOUNT + rr + lift], rb = fb - 6, RL = 0.68;
        var body = [];
        for (var k = 0; k < 16; k++) {
          var a0 = k / 16 * TAU, a1 = (k + 1) / 16 * TAU;
          var p0 = [rc[0] + rr * Math.cos(a0), rc[2] + rr * Math.sin(a0)], p1 = [rc[0] + rr * Math.cos(a1), rc[2] + rr * Math.sin(a1)];
          G.poly([[p0[0], MC[1] - RL, p0[1]], [p1[0], MC[1] - RL, p1[1]], [p1[0], MC[1] + RL, p1[1]], [p0[0], MC[1] + RL, p0[1]]], "zing", { stroke: false, op: rOn, bias: rb });
          body.push([p0[0], MC[1] - RL, p0[1]]);
        }
        G.poly(body, "zing", { op: rOn, bias: rb - 0.5 });
        var yoke = [rc[0] - 0.4, MC[1], rc[2] + 0.32];
        [MC[1] - RL - 0.04, MC[1] + RL + 0.04].forEach(function (y) { G.path([[rc[0], y, rc[2]], [rc[0] - 0.18, y, rc[2] + 0.18], [yoke[0], MC[1] + (y - MC[1]) * 0.15, yoke[2]]], { color: T.line, w: 0.032 * px, op: rOn, bias: rb - 0.7 }); });
        tube(G, yoke, [rc[0] - 1.05, MC[1], rc[2] + 0.72], 0.085 * px, "wood", { op: rOn, bias: rb - 0.8 });
      }

      // ---- step 3: the arrow on the back of the stamp shows its turn
      if (sop > 0.01 && dot(Bs.N, V) < -0.05) {
        var AR = [[-0.07, -0.3], [0.07, -0.3], [0.07, 0.03], [0.22, 0.03], [0, 0.34], [-0.22, 0.03], [-0.07, 0.03]];
        G.poly(AR.map(function (q) { return lp(q[0], -q[1], -RUB - MOUNT - 0.004); }), "#FF6000", { flat: true, stroke: false, op: sop, bias: stBias - 3 });
      }
    }
  });
})();

/* ---- treehouse/treehouse.js ---- */
;/* WonderLab "Dream Tree House" challenge (Courses/13/IMG_4714: cabins stacked up one tall branch on diagonal branch
 * struts; IMG_4712/4713 for the slide and rope ladder). A branch is planted in a log-slice base, then four
 * contemporary cabins go up it in a spiral, each on its own struts: deck, board-clad walls with big glazing,
 * mono-pitch shingled roof (one planted). A lookout canopy goes on top, pierced by the twigs. Then a rope ladder
 * and a slide, creepers and leaves grow over the model, the lights and the flag come on, and a scale figure climbs
 * the rope ladder, walks round the open front of the lowest deck and comes down the slide (a path kept clear of
 * every part). World units, z up, base top at ZB. Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back, hash = U.hash;
  var OR = "#FF6000";                      // WonderLab orange: the flag and the figure
  var LEAF = "#4F8F6B", LEAF2 = "#86C49A";  // foliage: shade and light

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function up(p, h) { return [p[0], p[1], p[2] + h]; }
  function polar(c, r, deg, z) { return [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD), z]; }
  function bez(P, s) { var m = 1 - s; return [0, 1, 2].map(function (j) { return m * m * m * P[0][j] + 3 * m * m * s * P[1][j] + 3 * m * s * s * P[2][j] + s * s * s * P[3][j]; }); }
  function crom(a, b, c, d, s) {
    return [0, 1, 2].map(function (j) { return 0.5 * (2 * b[j] + (c[j] - a[j]) * s + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * s * s + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * s * s * s); });
  }

  // ---- layout
  var ZB = 0.18, TH = 0.05;
  var L1 = { c: [0.04, 0.03], r: 0.95, z: 1.0 };   // round deck at the bottom: the rope ladder and the slide leave from it
  var LAD = 300, SLA = 160;                         // where the rope ladder hangs and the slide starts (deg round L1)
  // cabins: centre, downhill direction of the mono-pitch roof (deg, towards the camera so the shingles show), half
  // sizes along / across it, floor, wall height, roof rise, deck [u0, u1, v0, v1] in the same frame, railed deck
  // sides, struts (deck points they hold), build start
  var PODS = [
    { c: [0.02, 0.6], phi: 270, hu: 0.24, hv: 0.42, z: L1.z, h: 0.5, rise: 0.22, t0: 0.2 },  // sits on L1
    { c: [1.0, -0.2], phi: 170, hu: 0.4, hv: 0.33, z: 1.95, h: 0.5, rise: 0.3, green: true, t0: 0.29,
      deck: [-0.5, 0.62, -0.42, 0.65], rails: ["u0", "v0", "v1"], struts: [[-0.45, -0.37], [-0.45, 0.6], [0.15, 0.6]] },
    { c: [-0.85, -0.35], phi: 225, hu: 0.4, hv: 0.45, z: 2.85, h: 0.55, rise: 0.35, t0: 0.38,
      deck: [-0.45, 0.75, -0.6, 0.6], rails: ["u1", "v0", "v1"], struts: [[0.7, -0.55], [0.7, 0.55], [0.1, -0.55]] },
    { c: [0.55, 0.75], phi: 210, hu: 0.35, hv: 0.3, z: 3.65, h: 0.45, rise: 0.38, t0: 0.47,
      deck: [-0.5, 0.48, -0.45, 0.5], rails: ["u0", "v0", "v1"], struts: [[-0.45, -0.4], [-0.45, 0.45]] }
  ];
  var TOP = { c: [0.07, 0.13], phi: 250, hu: 0.42, hv: 0.42, z: 4.35, h: 0.5, rise: 0.18, r: 0.45 }; // lookout + canopy

  function W(P, u, v, z) { var cs = Math.cos(P.phi * RAD), sn = Math.sin(P.phi * RAD); return [P.c[0] + u * cs - v * sn, P.c[1] + u * sn + v * cs, z]; }
  function local(P, p) { var cs = Math.cos(P.phi * RAD), sn = Math.sin(P.phi * RAD), dx = p[0] - P.c[0], dy = p[1] - P.c[1]; return [dx * cs + dy * sn, -dx * sn + dy * cs]; }
  function roofZ(P, u) { return P.z + P.h + P.rise * (P.hu - u) / (2 * P.hu); } // underside of the mono-pitch roof

  // painter's-order help: whatever sits under a deck or roof footprint draws before it
  var DECKS = [{ z: L1.z, inside: function (p) { return Math.hypot(p[0] - L1.c[0], p[1] - L1.c[1]) < L1.r; } }];
  PODS.forEach(function (P) {
    if (P.deck) DECKS.push({ z: P.z, inside: function (p) { var q = local(P, p); return q[0] > P.deck[0] && q[0] < P.deck[1] && q[1] > P.deck[2] && q[1] < P.deck[3]; } });
  });
  DECKS.push({ z: TOP.z, inside: function (p) { return Math.hypot(p[0] - TOP.c[0], p[1] - TOP.c[1]) < TOP.r; } });
  DECKS.push({ z: TOP.z + TOP.h + 0.05, inside: function (p) { var q = local(TOP, p); return Math.abs(q[0]) < TOP.hu + 0.07 && Math.abs(q[1]) < TOP.hv + 0.07; } });
  function under(p) { var b = 0; DECKS.forEach(function (d) { if (p[2] < d.z - 0.005 && d.inside(p)) b += 0.9; }); return b; }

  // ---- the branch: smooth centrelines with radii and twist-free frames
  function limb(pts, r0, r1, n, flare) {
    var S = [], i;
    for (i = 0; i <= n; i++) {
      var u = i / n * (pts.length - 1), k = Math.min(Math.floor(u), pts.length - 2), f = u - k;
      S.push({ c: crom(pts[Math.max(k - 1, 0)], pts[k], pts[k + 1], pts[Math.min(k + 2, pts.length - 1)], f), r: lerp(r0, r1, i / n) + (flare || 0) * Math.exp(-i / n * 9) });
    }
    var a = null;
    S.forEach(function (s, j) {
      var T = norm(sub(S[Math.min(j + 1, n)].c, S[Math.max(j - 1, 0)].c));
      a = a ? norm(sub(a, mul(T, dot(a, T)))) : norm(cross(T, Math.abs(T[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]));
      s.T = T; s.a = a; s.b = cross(T, a);
    });
    return S;
  }
  var TRUNK = limb([[0, 0, 0.02], [0.05, 0.03, 1.2], [0.02, 0.08, 2.4], [0.08, 0.1, 3.6], [0.06, 0.13, 4.55]], 0.27, 0.12, 20, 0.18);
  function trunkAt(z) {
    for (var i = 0; i < TRUNK.length - 1; i++) {
      var a = TRUNK[i], b = TRUNK[i + 1];
      if (z <= b.c[2] || i === TRUNK.length - 2) { var f = Math.max(0, Math.min(1, (z - a.c[2]) / (b.c[2] - a.c[2]))); return { c: l3(a.c, b.c, f), r: lerp(a.r, b.r, f) }; }
    }
  }
  var TWIGS = [ // the branch's own top and a live side shoot (grown with the trunk)
    limb([[0.06, 0.13, 4.45], [0.0, 0.2, 5.0], [-0.08, 0.27, 5.4]], 0.07, 0.02, 8),
    limb([[0.07, 0.12, 4.4], [0.38, 0.0, 4.85], [0.62, -0.12, 5.1]], 0.05, 0.015, 7),
    limb([[0.05, 0.15, 4.35], [-0.32, 0.32, 4.8], [-0.58, 0.48, 5.0]], 0.05, 0.015, 7),
    limb([[0.07, 0.1, 3.2], [-0.4, 0.55, 3.55], [-0.85, 0.9, 3.75]], 0.06, 0.02, 7)
  ];
  // diagonal struts from the trunk up to the deck undersides
  function strut(end) { var s = trunkAt(Math.max(0.4, end[2] - 0.85)).c; return limb([s, add(l3(s, end, 0.5), [0, 0, -0.07]), end], 0.06, 0.035, 6); }
  var L1STRUTS = [20, 140, 240].map(function (d) { return strut(polar(L1.c, 0.82, d, L1.z - TH)); });
  PODS.forEach(function (P) { P.S = (P.struts || []).map(function (q) { return strut(W(P, q[0], q[1], P.z - TH)); }); });
  var TOPSTRUTS = [60, 200, 320].map(function (d) { return strut(polar(TOP.c, 0.38, d, TOP.z - TH)); });

  var SIDES = 9;
  function drawLimb(g, S, grow) {
    if (grow <= 0.001) return;
    var m = grow * (S.length - 1), n = Math.floor(m), f = m - n, L = S.slice(0, n + 1);
    if (f > 0.001 && n + 1 < S.length) { var A = S[n], B = S[n + 1]; L.push({ c: l3(A.c, B.c, f), r: lerp(A.r, B.r, f), T: B.T, a: B.a, b: B.b }); }
    var R = L.map(function (s) {
      var o = [];
      for (var k = 0; k < SIDES; k++) { var th = k / SIDES * TAU; o.push(add(s.c, add(mul(s.a, s.r * Math.cos(th)), mul(s.b, s.r * Math.sin(th))))); }
      return o;
    });
    for (var i = 0; i < L.length - 1; i++) {
      var bias = under(l3(L[i].c, L[i + 1].c, 0.5));
      for (var k = 0; k < SIDES; k++) { var k2 = (k + 1) % SIDES; g.poly([R[i][k], R[i][k2], R[i + 1][k2], R[i + 1][k]], "ink", { cull: true, flat: true, strokeColor: "ink", w: 0.8, bias: bias }); }
      [1, -1].forEach(function (sg) { // outline only along the two silhouette sides
        var p = add(L[i].c, mul(norm(cross(L[i].T, g.V)), sg * L[i].r)), q = add(L[i + 1].c, mul(norm(cross(L[i + 1].T, g.V)), sg * L[i + 1].r));
        g.line(p, q, { w: 1.4, bias: bias - 0.25 });
      });
      if (L[i].r > 0.09) [-0.95, -0.3, 0.45, 1.05].forEach(function (al, gi) { // bark grain on the side facing the camera
        var at = function (s, j) {
          var fv = norm(sub(g.V, mul(s.T, dot(g.V, s.T)))), sd = cross(s.T, fv), w = al + 0.12 * Math.sin(j * 1.7 + gi * 2.1);
          return add(s.c, add(mul(fv, s.r * 0.99 * Math.cos(w)), mul(sd, s.r * 0.99 * Math.sin(w))));
        };
        g.line(at(L[i], i), at(L[i + 1], i + 1), { color: g.T.soft, w: 0.8, op: 0.55, bias: bias - 0.24 });
      });
    }
    g.poly(R[R.length - 1], "ink", { cull: true, flat: true, w: 1.1, bias: under(L[L.length - 1].c) - 0.01 });
  }

  // ---- stick-built parts
  function slab(g, pts2, z, th, mat, o) { // pts2 counter-clockwise seen from above; top face at z
    var top = pts2.map(function (q) { return [q[0], q[1], z]; }), bot = pts2.map(function (q) { return [q[0], q[1], z - th]; }), n = pts2.length;
    for (var i = 0; i < n; i++) { var j = (i + 1) % n; g.poly([bot[i], bot[j], top[j], top[i]], mat, { cull: true, op: o.op, w: 1.1, bias: o.bias }); }
    g.poly(top, mat, { op: o.op, w: 1.4, bias: o.bias - 0.001 });
  }
  function plank(g, a, b, op, bias) { g.line(up(a, 0.003), up(b, 0.003), { color: g.T.soft, w: 0.8, op: op, bias: bias - 0.05 }); }
  function railing(g, P, h, a, skip) { // posts at deck-level points grow to height h; rails join neighbours unless skipped
    if (a <= 0) return;
    var hh = h * eo(a), op = Math.min(1, a * 2);
    P.forEach(function (p, i) { if (!(skip && skip.indexOf(i) >= 0 && skip.indexOf(i - 1) >= 0)) g.line(p, up(p, hh), { w: 1.6, op: op, bias: under(p) - 0.1 }); });
    for (var i = 0; i < P.length - 1; i++) {
      if (skip && skip.indexOf(i) >= 0) continue;
      var bias = under(l3(P[i], P[i + 1], 0.5));
      g.line(up(P[i], hh), up(P[i + 1], hh), { w: 1.4, op: a, bias: bias - 0.12 });
      g.line(up(P[i], hh * 0.5), up(P[i + 1], hh * 0.5), { color: g.T.soft, w: 0.9, op: a, bias: bias - 0.11 });
    }
  }
  function shingles(g, R, op, bias) { // R: roof top corners, R[1]-R[2] the eave, R[0]-R[3] the high edge
    var rows = Math.round(Math.hypot(R[0][0] - R[1][0], R[0][1] - R[1][1], R[0][2] - R[1][2]) / 0.07), wide = Math.hypot(R[1][0] - R[2][0], R[1][1] - R[2][1]);
    var cols = Math.round(wide / 0.085), row = function (k) { return [l3(R[1], R[0], k / rows), l3(R[2], R[3], k / rows)]; };
    for (var k = 0; k < rows; k++) {
      var a = row(k), b = row(k + 1);
      if (k > 0) g.line(a[0], a[1], { color: g.T.soft, w: 0.75, op: op, bias: bias });
      for (var j = 1; j < cols; j++) { var s = (j + (k % 2) * 0.5) / cols; if (s >= 1) continue; g.line(l3(a[0], a[1], s), l3(b[0], b[1], s), { color: g.T.soft, w: 0.6, op: op * 0.8, bias: bias }); }
    }
  }
  function leaf(g, p, s, bias) { g.dot(p, 3.1 * s, LEAF, { stroke: false, bias: bias }); g.dot(add(p, [-0.008, -0.008, 0.012]), 1.8 * s, LEAF2, { stroke: false, bias: bias - 0.001 }); }
  function bush(g, c, size, a, seed) { // a clump of leaves
    if (a <= 0) return;
    var bias = under(c) - 0.06;
    for (var i = 0; i < 9; i++) {
      var p = add(c, [(hash(seed * 13 + i) - 0.5) * 0.24 * size, (hash(seed * 7 + i * 3.1) - 0.5) * 0.24 * size, (hash(seed * 3 + i * 5.7) - 0.3) * 0.16 * size]);
      g.dot(p, 6 * size * a, LEAF, { stroke: false, bias: bias });
      g.dot(add(p, [-0.015, -0.015, 0.025]), 3.4 * size * a, LEAF2, { stroke: false, bias: bias - 0.002 });
    }
  }
  function creeper(g, a, len, grow, seed) { // hangs from an edge, leaves alternating down it
    if (grow <= 0) return;
    var n = 12, pts = [], bias = under(a) - 0.04, i;
    for (i = 0; i <= n; i++) { var s = i / n * len * grow; pts.push([a[0] + 0.03 * Math.sin(s * 9 + seed), a[1] + 0.03 * Math.cos(s * 7 + seed * 1.3), a[2] - s]); }
    for (i = 0; i < n; i++) g.line(pts[i], pts[i + 1], { color: LEAF, w: 1.3, bias: bias });
    for (i = 1; i <= n; i++) leaf(g, add(pts[i], [0.025 * (i % 2 ? 1 : -1), 0.012 * (i % 2 ? -1 : 1), 0.01]), 0.9 + 0.3 * hash(seed + i), bias - 0.01);
  }
  function trunkVine(g, z0, z1, turns, ph, grow) { // spirals up the trunk; only the side facing the camera is drawn
    var n = 46, prev = null;
    for (var i = 0; i <= n * grow; i++) {
      var f = i / n, z = lerp(z0, z1, f), s = trunkAt(z), ang = ph + f * turns * TAU, dv = [Math.cos(ang), Math.sin(ang), 0];
      var p = add([s.c[0], s.c[1], z], mul(dv, s.r + 0.015)), vis = dot(dv, g.V) > 0.08;
      if (prev && vis && prev.vis) g.line(prev.p, p, { color: LEAF, w: 1.4, bias: under(p) - 0.3 });
      if (vis && i % 3 === 1) leaf(g, add(p, mul(dv, 0.02)), 1, under(p) - 0.31);
      prev = { p: p, vis: vis };
    }
  }

  // a cabin: board-clad walls with a wide window each, then the mono-pitch roof (shingles or planted)
  function cabin(g, P, wa, ra, lit, ga) {
    var T = g.T, hu = P.hu, hv = P.hv, Hs = function (u) { return (roofZ(P, u) - P.z) * wa; };
    if (wa > 0) {
      var C4 = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]];
      for (var k = 0; k < 4; k++) {
        var a = C4[k], b = C4[(k + 1) % 4], A0 = W(P, a[0], a[1], P.z), B0 = W(P, b[0], b[1], P.z), At = up(A0, Hs(a[0])), Bt = up(B0, Hs(b[0]));
        var bias = under(l3(l3(A0, Bt, 0.5), l3(B0, At, 0.5), 0.5)), nrm = norm(cross(sub(B0, A0), [0, 0, 1]));
        g.poly([A0, B0, Bt, At], "paper", { cull: true, w: 1.2, bias: bias });
        if (dot(nrm, g.V) <= 0) continue;
        var o = mul(nrm, 0.004), nb = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.075);
        for (var j = 1; j < nb; j++) { var fj = j / nb, p = add(l3(A0, B0, fj), o); g.line(up(p, 0.01), up(p, lerp(Hs(a[0]), Hs(b[0]), fj) - 0.01), { color: T.soft, w: 0.55, op: 0.55, bias: bias - 0.005 }); }
        if (wa > 0.95) {
          var hm = Math.min(Hs(a[0]), Hs(b[0])), g0 = add(l3(A0, B0, 0.16), mul(nrm, 0.008)), g1 = add(l3(A0, B0, 0.84), mul(nrm, 0.008));
          var win = [up(g0, 0.1), up(g1, 0.1), up(g1, hm * 0.8), up(g0, hm * 0.8)];
          g.poly(win, "sky", { flat: true, w: 1.1, bias: bias - 0.01 });
          if (lit > 0) g.poly(win, "zing", { flat: true, op: lit * 0.85, w: 1.1, bias: bias - 0.011 });
          g.line(l3(win[0], win[1], 0.5), l3(win[3], win[2], 0.5), { w: 1, bias: bias - 0.012 });
        }
      }
    }
    if (ra > 0) roof(g, P, ra, P.green, ga);
  }
  function roof(g, P, ra, green, ga) {
    var ov = 0.07, RT = 0.05, drop = 0.6 * (1 - ra);
    var R4 = [[-P.hu - ov, -P.hv - ov], [P.hu + ov, -P.hv - ov], [P.hu + ov, P.hv + ov], [-P.hu - ov, P.hv + ov]];
    var top = R4.map(function (q) { return W(P, q[0], q[1], roofZ(P, q[0]) + RT + drop); }), bot = R4.map(function (q) { return W(P, q[0], q[1], roofZ(P, q[0]) + drop); });
    var bias = under(l3(top[0], top[2], 0.5)) - 0.02, nrm = norm(cross(sub(top[1], top[0]), sub(top[2], top[0])));
    for (var k = 0; k < 4; k++) g.poly([bot[k], bot[(k + 1) % 4], top[(k + 1) % 4], top[k]], "foil", { cull: true, op: ra, w: 1.1, bias: bias });
    g.poly(top, green ? "wood" : "foil", { cull: true, op: ra, w: 1.3, bias: bias - 0.001 });
    g.poly(bot.slice().reverse(), "foil", { cull: true, op: ra, w: 1.1, bias: bias });
    if (dot(nrm, g.V) <= 0) return;
    if (!green && ra > 0.9) shingles(g, top, ra, bias - 0.01);
    if (green && ga > 0) for (var i = 0; i < 6; i++) for (var j = 0; j < 7; j++) { // a planted roof fills in
      var a = eo(seg(ga, hash(i * 7 + j) * 0.6, hash(i * 7 + j) * 0.6 + 0.4)), fu = (i + 0.5) / 6 + (hash(i + j * 3) - 0.5) * 0.08, fv = (j + 0.5) / 7 + (hash(i * 5 + j) - 0.5) * 0.08;
      if (a > 0) leaf(g, up(l3(l3(top[0], top[1], fu), l3(top[3], top[2], fu), fv), 0.015), 1.25 * a, bias - 0.02);
    }
  }

  // ---- the figure: one clear route, checked against every part
  var SLIDE = (function () {
    var a = polar(L1.c, 0.93, SLA, L1.z), o = [Math.cos(SLA * RAD), Math.sin(SLA * RAD)];
    return [a, [a[0] + o[0] * 0.5, a[1] + o[1] * 0.5, 0.86], [-1.7, 0.95, 0.32], [-2.1, 1.05, 0.04]];
  })();
  function figure(g, p, s, sit) {
    var b = under(p) - 0.3, h = (sit ? 0.13 : 0.2) * s;
    g.line(up(p, 0.02), up(p, h), { w: 9 * s, bias: b });
    g.line(up(p, 0.02), up(p, h), { color: OR, w: 6.2 * s, bias: b - 0.01 });
    g.dot(up(p, h + 0.09 * s), 5.6 * s, OR, { bias: b - 0.02 });
  }
  function figureAt(t) {
    if (t < 0.65) return null;
    var s = back(seg(t, 0.65, 0.67)), climb = seg(t, 0.67, 0.745), step = eio(seg(t, 0.745, 0.765)), walk = eio(seg(t, 0.765, 0.8));
    var go = eio(seg(t, 0.8, 0.81)), slide = seg(t, 0.81, 0.865), land = seg(t, 0.865, 0.895);
    if (slide >= 1) {
      var T = norm(sub(SLIDE[3], SLIDE[2])), off = 0.3 * eo(land);
      return { p: [SLIDE[3][0] + T[0] * off, SLIDE[3][1] + T[1] * off, 0.04 * (1 - land) + 0.1 * Math.sin(Math.PI * land)], s: 1, sit: land < 0.5 };
    }
    if (slide > 0) return { p: up(bez(SLIDE, Math.pow(slide, 1.6)), 0.04), s: 1, sit: true };
    if (go > 0) return { p: polar(L1.c, lerp(0.66, 0.9, go), lerp(SLA + 8, SLA, go), L1.z), s: 1 };
    if (walk > 0) return { p: polar(L1.c, 0.66, lerp(LAD, SLA + 8, walk), L1.z), s: 1 };     // round the open front, clear of the trunk and cabin
    if (step > 0) return { p: polar(L1.c, lerp(1.12, 0.66, step), LAD, L1.z + 0.06 * Math.sin(Math.PI * step)), s: 1 };
    // up the outside face of the rope ladder, clear of the deck edge above
    var z = lerp(ZB, L1.z, climb) + 0.03 * Math.abs(Math.sin(climb * Math.PI * 7));
    return { p: polar(L1.c, 1.12, LAD, z), s: s };
  }

  WL.define("treehouse", {
    cam: { yaw: 24, pitch: 15, S: 56, spin: 36, z: 1.75, cy: 0.88 },
    draw: function (g, t) {
      var T = g.T;
      g.grid(5, 1);

      // ---- the base: a slice of a log, growth rings on top, grass tufts later
      var ba = eo(seg(t, 0.01, 0.07));
      if (ba > 0) {
        var ring = function (z, sc) { var o = []; for (var k = 0; k < 32; k++) { var th = k / 32 * TAU, r = (1.75 + 0.12 * Math.sin(3 * th + 0.5) + 0.07 * Math.cos(5 * th)) * sc; o.push([0.05 + r * Math.cos(th), 0.05 + r * Math.sin(th), z]); } return o; };
        var bt = ring(ZB, 1), bb = ring(0, 1);
        for (var i = 0; i < 32; i++) { var j = (i + 1) % 32; g.poly([bb[i], bb[j], bt[j], bt[i]], "paper", { cull: true, op: ba, w: 1.1, bias: 6 }); }
        g.poly(bt, "paper", { op: ba, w: 1.4, bias: 5.99 });
        [0.78, 0.55].forEach(function (sc) { g.path(ring(ZB + 0.002, sc).concat([ring(ZB + 0.002, sc)[0]]), { color: T.soft, w: 0.9, op: ba * 0.7, bias: 5.9 }); });
      }

      // ---- the branch grows out of it, then the struts for each level just before its deck
      drawLimb(g, TRUNK, eio(seg(t, 0.05, 0.13)));
      TWIGS.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, 0.11 + i * 0.012, 0.17 + i * 0.012))); });
      L1STRUTS.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, 0.11 + i * 0.01, 0.16 + i * 0.01))); });
      PODS.forEach(function (P) { P.S.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, P.t0 - 0.07 + i * 0.01, P.t0 - 0.02 + i * 0.01))); }); });
      TOPSTRUTS.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, 0.47 + i * 0.01, 0.52 + i * 0.01))); });

      var lit = seg(t, 0.62, 0.65), ga = seg(t, 0.58, 0.68);

      // ---- level 1: a round deck wrapped round the trunk
      var la = eo(seg(t, 0.15, 0.21)), lz = L1.z + 0.4 * (1 - la), lb = under([L1.c[0], L1.c[1], L1.z]) + 0.15;
      if (la > 0) {
        var disc = []; for (var dk = 0; dk < 20; dk++) { var q = polar(L1.c, L1.r, dk * 18, 0); disc.push([q[0], q[1]]); }
        slab(g, disc, lz, TH, "wood", { op: la, bias: lb });
        for (var pd = 0; pd < 360; pd += 15) plank(g, polar(L1.c, 0.3, pd, lz), polar(L1.c, L1.r - 0.03, pd, lz), la, lb);
      }
      var lp = []; for (var pj = 0; pj <= 16; pj++) lp.push(polar(L1.c, L1.r - 0.04, 11.25 + pj * 22.5, L1.z));
      // open behind the cabin and where the slide and the rope ladder leave
      var skip = []; for (var bj = 0; bj < 16; bj++) { var mid = 22.5 + bj * 22.5; if ((mid > 60 && mid < 120) || Math.abs(mid - SLA) < 12 || Math.abs(mid - LAD) < 12) skip.push(bj); }
      railing(g, lp, 0.24, seg(t, 0.2, 0.24), skip);

      // ---- the cabins, one level at a time
      PODS.forEach(function (P) {
        var t0 = P.t0, da = P.deck ? eo(seg(t, t0 - 0.03, t0 + 0.03)) : 0;
        if (P.deck && da > 0) {
          var D = P.deck, dz = P.z + 0.4 * (1 - da), bias = under(W(P, (D[0] + D[1]) / 2, (D[2] + D[3]) / 2, P.z)) + 0.15;
          var pts = [[D[0], D[2]], [D[1], D[2]], [D[1], D[3]], [D[0], D[3]]].map(function (q) { var w = W(P, q[0], q[1], 0); return [w[0], w[1]]; });
          slab(g, pts, dz, TH, "wood", { op: da, bias: bias });
          for (var v = D[2] + 0.1; v < D[3] - 0.04; v += 0.1) plank(g, W(P, D[0] + 0.02, v, dz), W(P, D[1] - 0.02, v, dz), da, bias);
        }
        var rl = seg(t, t0 + 0.05, t0 + 0.09);
        if (P.deck && rl > 0) P.rails.forEach(function (sd) {
          var D = P.deck, e = 0.04, a = sd === "u0" ? [D[0] + e, D[2] + e] : sd === "u1" ? [D[1] - e, D[2] + e] : sd === "v0" ? [D[0] + e, D[2] + e] : [D[0] + e, D[3] - e];
          var b = sd === "u0" ? [D[0] + e, D[3] - e] : sd === "u1" ? [D[1] - e, D[3] - e] : sd === "v0" ? [D[1] - e, D[2] + e] : [D[1] - e, D[3] - e];
          var n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.28)), posts = [];
          for (var k = 0; k <= n; k++) posts.push(W(P, lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n), P.z));
          railing(g, posts, 0.22, rl);
        });
        cabin(g, P, eo(seg(t, t0 + 0.02, t0 + 0.07)), eo(seg(t, t0 + 0.06, t0 + 0.1)), lit, ga);
      });

      // ---- the lookout: round deck and rail, then a canopy on four posts, pierced by the twigs
      var oa = eo(seg(t, 0.51, 0.56)), oz = TOP.z + 0.4 * (1 - oa);
      if (oa > 0) {
        var od = []; for (var ok = 0; ok < 16; ok++) { var oq = polar(TOP.c, TOP.r, ok * 22.5, 0); od.push([oq[0], oq[1]]); }
        slab(g, od, oz, TH, "wood", { op: oa, bias: 0.15 });
        for (var cy = -0.3; cy <= 0.31; cy += 0.12) { var hw = Math.sqrt(Math.max(0, TOP.r * TOP.r - cy * cy)) - 0.03; plank(g, [TOP.c[0] - hw, TOP.c[1] + cy, oz], [TOP.c[0] + hw, TOP.c[1] + cy, oz], oa, 0.15); }
      }
      var nest = []; for (var nk = 0; nk <= 8; nk++) nest.push(polar(TOP.c, TOP.r - 0.04, nk * 45 + 10, TOP.z));
      railing(g, nest, 0.22, seg(t, 0.55, 0.58));
      var cp = seg(t, 0.57, 0.6), ca = eo(seg(t, 0.59, 0.63));
      if (cp > 0) [[-0.33, -0.33], [0.33, -0.33], [0.33, 0.33], [-0.33, 0.33]].forEach(function (q) {
        var b = W(TOP, q[0], q[1], TOP.z); g.line(b, up(b, (roofZ(TOP, q[0]) - TOP.z) * eo(cp)), { w: 1.8, op: Math.min(1, cp * 2), bias: -0.1 });
      });
      if (ca > 0) roof(g, TOP, ca, false, 0);

      // ---- rope ladder and slide off the bottom deck
      var rld = eo(seg(t, 0.56, 0.6));
      if (rld > 0) {
        var tp = polar(L1.c, L1.r - 0.02, LAD, L1.z), tg = [-Math.sin(LAD * RAD) * 0.11, Math.cos(LAD * RAD) * 0.11, 0], len = (L1.z - ZB) * rld;
        [1, -1].forEach(function (sg) { g.line(add(tp, mul(tg, sg)), up(add(tp, mul(tg, sg)), -len), { color: "brand", w: 1.4, bias: -0.1 }); });
        for (var rz = 0.12; rz <= len; rz += 0.12) g.line(up(add(tp, tg), -rz), up(sub(tp, tg), -rz), { w: 2, bias: -0.11 });
      }
      var sa3 = eo(seg(t, 0.57, 0.62));
      if (sa3 > 0) {
        var C = [], n3 = 18;
        for (var si = 0; si <= n3; si++) C.push(bez(SLIDE, sa3 * si / n3));
        var E3 = C.map(function (c, i3) { var Tn = norm(sub(C[Math.min(i3 + 1, n3)], C[Math.max(i3 - 1, 0)])), w3 = mul(norm(cross(Tn, [0, 0, 1])), 0.15); return { L: sub(c, w3), R: add(c, w3) }; });
        for (var i4 = 0; i4 < n3; i4++) {
          var a4 = E3[i4], b4 = E3[i4 + 1], bias4 = under(l3(C[i4], C[i4 + 1], 0.5));
          g.poly([a4.L, a4.R, b4.R, b4.L], "brand", { w: 1, bias: bias4 });
          g.poly([a4.L, b4.L, up(b4.L, 0.07), up(a4.L, 0.07)], "sky", { w: 1, bias: bias4 - 0.02 });
          g.poly([a4.R, b4.R, up(b4.R, 0.07), up(a4.R, 0.07)], "sky", { w: 1, bias: bias4 - 0.02 });
        }
        if (sa3 > 0.6) { var mid2 = bez(SLIDE, 0.5); g.line(mid2, [mid2[0], mid2[1], Math.hypot(mid2[0] - 0.05, mid2[1] - 0.05) < 1.7 ? ZB : 0], { w: 2, bias: 0.05 }); }
      }

      // ---- greenery: creepers climb the trunk and hang off the decks, leaves on twigs, planters, grass
      if (ga > 0) {
        trunkVine(g, ZB + 0.02, L1.z - 0.06, 1.6, 0.4, eo(seg(ga, 0, 0.6)));
        trunkVine(g, L1.z + 0.05, 2.75, 1.1, 2.2, eo(seg(ga, 0.15, 0.8)));
        trunkVine(g, 2.9, 4.25, 0.9, 4.0, eo(seg(ga, 0.3, 0.95)));
        var hang = [
          [polar(L1.c, L1.r + 0.03, 228, L1.z - TH), 0.42], [polar(L1.c, L1.r + 0.03, 258, L1.z - TH), 0.32],
          [W(PODS[1], -0.05, 0.68, PODS[1].z - TH), 0.6], [W(PODS[1], -0.4, 0.68, PODS[1].z - TH), 0.4],
          [W(PODS[2], 0.78, 0.2, PODS[2].z - TH), 0.7], [W(PODS[2], 0.78, -0.35, PODS[2].z - TH), 0.48], [W(PODS[2], 0.3, -0.63, PODS[2].z - TH), 0.4],
          [W(PODS[3], -0.53, 0.1, PODS[3].z - TH), 0.45], [W(TOP, 0.2, -0.49, roofZ(TOP, 0.2)), 0.3]
        ];
        hang.forEach(function (h, i) { creeper(g, h[0], h[1], eo(seg(ga, 0.1 + i * 0.05, 0.6 + i * 0.04)), i * 1.7); });
        var B = [ // [point, size]
          [TWIGS[1][TWIGS[1].length - 1].c, 1.1], [TWIGS[2][TWIGS[2].length - 1].c, 1.1], [TWIGS[3][TWIGS[3].length - 1].c, 1.3], [TWIGS[3][4].c, 0.8],
          [polar(L1.c, 0.8, 20, L1.z + 0.06), 0.8], [polar(L1.c, 0.8, 135, L1.z + 0.06), 0.8],
          [W(PODS[2], 0.68, 0.52, PODS[2].z + 0.06), 0.8], [W(PODS[2], 0.68, -0.52, PODS[2].z + 0.06), 0.8], [W(PODS[3], -0.42, 0.42, PODS[3].z + 0.06), 0.7],
          [polar([0.05, 0.05], 1.3, 60, ZB + 0.03), 0.7], [polar([0.05, 0.05], 1.35, 215, ZB + 0.03), 0.8], [polar([0.05, 0.05], 1.25, 250, ZB + 0.03), 0.6],
          [polar([0.05, 0.05], 0.42, 235, ZB + 0.03), 0.6], [polar([0.05, 0.05], 1.3, 20, ZB + 0.03), 0.6]
        ];
        B.forEach(function (b, i) { bush(g, b[0], b[1], eo(seg(ga, 0.05 + i * 0.045, 0.3 + i * 0.045)), i + 1); });
      }

      // ---- the flag goes up on the tallest twig
      var fa = seg(t, 0.63, 0.66);
      if (fa > 0) {
        var tw = TWIGS[0], fb = tw[tw.length - 3].c, ftop = up(fb, 0.42 * back(fa)), wv = Math.sin(t * TAU * 5);
        g.line(fb, ftop, { w: 1.8, bias: -0.6 });
        var fd = [Math.cos((-40 + 10 * wv) * RAD), Math.sin((-40 + 10 * wv) * RAD), 0];
        if (fa > 0.3) g.poly([ftop, up(ftop, -0.18), add(up(ftop, -0.1 + 0.03 * wv), mul(fd, 0.3))], OR, { flat: true, w: 1.1, bias: -0.61 });
      }

      // ---- a scale figure tries it out
      var fg = figureAt(t);
      if (fg) figure(g, fg.p, fg.s * 1.35, fg.sit);
    }
  });
})();

/* ---- turbine/turbine.js ---- */
;/* WonderLab "Wind Turbine Glow-Off" challenge: a fair test, run side by side. Three model turbines with different
 * blades (an 8-blade paper windmill, three twisted pitched blades, two flat sticks) stand the same measured distance
 * from identical desk fans, each wired to an LED with a brightness bar. The fans switch on together, the rotors spin
 * up to different speeds, the LEDs glow and the bars rise; the twisted 3-blade design wins (orange).
 * Pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back, clamp = U.clamp;
  var OR = "#FF6000"; // WonderLab orange: the winner

  var HZ = 1.55, FY = 2.3, LX = 2.1, ON = 0.27; // hub height, fan distance, lane spacing, the moment all fans switch on
  // per lane: blade count, length, root / tip width, pitch, spin at full speed (rad per unit t), spin-up time, LED level
  var LANES = [
    { x: -LX, n: 8, len: 0.5, w0: 0.2, w1: 0.27, pitch: 0.04, spin: 50, up: 0.24, level: 0.5, ring: true }, // paper windmill: lots of drag
    { x: 0, n: 3, len: 0.74, w0: 0.17, w1: 0.07, pitch: 0.12, spin: 118, up: 0.16, level: 1, win: true },   // twisted, pitched blades
    { x: LX, n: 2, len: 0.7, w0: 0.09, w1: 0.09, pitch: 0, spin: 20, up: 0.3, level: 0.16 }                  // flat sticks: barely turn
  ];
  function ramp(L, t) { return eio(seg(t, ON + 0.03, ON + 0.03 + L.up)); }
  function spun(rate, rampFn, t) { var a = 0, dt = 0.002; for (var s = ON; s < t; s += dt) a += rate * rampFn(s) * dt; return a; } // integrated, so speeding up never jumps
  function circle(c, r, n, y) { var o = []; for (var k = 0; k <= n; k++) { var a = k / n * TAU; o.push([c[0] + r * Math.cos(a), y === undefined ? c[1] : y, c[2] + r * Math.sin(a)]); } return o; }

  function rotor(g, L, H, th, a, speed) {
    var r0 = 0.07;
    if (speed > 0.35) g.poly(circle(H, r0 + L.len * 0.98, 28, H[1] + 0.01).slice(0, 28), "sky", { flat: true, stroke: false, fillOp: 0.45 * clamp((speed - 0.35) / 0.5), bias: -0.03 }); // motion blur disc
    for (var k = 0; k < L.n; k++) {
      var b = th + k * TAU / L.n, d = [Math.cos(b), 0, Math.sin(b)], e = [-Math.sin(b), 0, Math.cos(b)], r1 = r0 + L.len * a;
      var P = function (r, w, p) { return [H[0] + d[0] * r + e[0] * w, H[1] + p, H[2] + d[2] * r + e[2] * w]; };
      // leading edge turned into the wind, twisted flatter towards the tip
      g.poly([P(r0, -L.w0 / 2, -L.pitch), P(r1, -L.w1 / 2, -L.pitch * 0.4), P(r1, L.w1 / 2, L.pitch * 0.4), P(r0, L.w0 / 2, L.pitch)], "brand", { w: 1.2, bias: -0.05 });
    }
    if (L.ring && a > 0.9) g.path(circle(H, r0 + L.len * 0.62, 32, H[1] - 0.01), { w: 1.2, bias: -0.06 });
    g.dot(H, 5, "zing", { bias: -0.08 });
  }

  function fan(g, x, ap, th, on) {
    var c = [x, FY, HZ], op = ap;
    g.box(x - 0.3, FY - 0.15, 0, 0.6, 0.42, 0.06, "paper", { op: op });
    g.cyl(x, FY + 0.12, 0.06, 0.04, HZ - 0.06, "foil", { seg: 10, op: op });
    g.box(x - 0.09, FY + 0.06, HZ - 0.09, 0.18, 0.2, 0.18, "foil", { op: op });
    if (on > 0.2) g.poly(circle(c, 0.5, 28, FY).slice(0, 28), "sky", { flat: true, stroke: false, fillOp: 0.35 * on, op: op, bias: 0.02 });
    for (var k = 0; k < 4; k++) { // fan blades, behind the grille
      var b = th + k * TAU / 4, d = [Math.cos(b), 0, Math.sin(b)], e = [-Math.sin(b), 0, Math.cos(b)];
      var P = function (r, w) { return [x + d[0] * r + e[0] * w, FY, HZ + d[2] * r + e[2] * w]; };
      g.poly([P(0.08, -0.06), P(0.46, -0.16), P(0.48, 0.1), P(0.08, 0.06)], "foil", { op: op, w: 1.1, bias: 0.01 });
    }
    g.path(circle(c, 0.55, 36, FY - 0.06), { w: 1.8, op: op, bias: -0.02 });   // grille rim, front
    g.path(circle(c, 0.55, 36, FY + 0.06), { w: 1.2, op: op * 0.6, bias: 0.03 }); // and back
    g.path(circle(c, 0.32, 28, FY - 0.06), { color: g.T.soft, w: 0.9, op: op, bias: -0.02 });
    for (var s = 0; s < 8; s++) { var a = s / 8 * TAU; g.line([x, FY - 0.06, HZ], [x + 0.55 * Math.cos(a), FY - 0.06, HZ + 0.55 * Math.sin(a)], { color: g.T.soft, w: 0.9, op: op, bias: -0.02 }); }
    g.dot([x, FY - 0.07, HZ], 5, on > 0.5 ? "zing" : "foil", { op: op, bias: -0.03 });
  }

  WL.define("turbine", {
    cam: { yaw: 16, pitch: 26, S: 56, amp: 4, z: 2.4, cy: 0.76 },
    draw: function (g, t) {
      var T = g.T, Z = T.mats.zing;
      g.grid(5, 1);
      var fanOn = eio(seg(t, ON, ON + 0.08)), wind = eo(seg(t, ON + 0.02, ON + 0.1)), reveal = seg(t, 0.8, 0.86);
      var fanTh = spun(170, function (s) { return eio(seg(s, ON, ON + 0.08)); }, t);

      LANES.forEach(function (L, i) {
        var x = L.x, st = 0.02 + i * 0.025;
        var ta = eo(seg(t, st, st + 0.07)), na = eo(seg(t, st + 0.05, st + 0.09)), ba = back(seg(t, st + 0.09, st + 0.15));
        var fa = eo(seg(t, 0.12 + i * 0.02, 0.18 + i * 0.02)), la = back(seg(t, 0.17 + i * 0.02, 0.22 + i * 0.02)), wa = seg(t, 0.18 + i * 0.02, 0.24 + i * 0.02);
        var sp = ramp(L, t), b = L.level * sp, H = [x, -0.2, HZ];
        if (L.level < 0.3) b *= 0.85 + 0.15 * Math.sin(t * TAU * 23 + i); // a weak supply flickers

        // ---- turbine: base, tower, nacelle, then the blades
        if (ta > 0) {
          g.box(x - 0.22, -0.22, 0, 0.44, 0.44, 0.06, "wood", { op: ta });
          g.cyl(x, 0, 0.06, 0.045, (HZ - 0.06) * ta, "foil", { seg: 10, op: ta });
          g.line([x + 0.05, -0.03, 0.08], [x + 0.05, -0.03, 0.08 + (HZ - 0.16) * ta], { color: T.soft, w: 1, op: ta, bias: -0.01 });
        }
        if (na > 0) g.box(x - 0.07, -0.16, HZ - 0.07, 0.14, 0.34, 0.14, "paper", { op: na });
        if (ba > 0) rotor(g, L, H, -spun(L.spin, function (s) { return ramp(L, s); }, t) + i * 0.7, ba, L.spin * sp / 118);

        // ---- the same fan, the same measured distance
        if (fa > 0) fan(g, x, fa, -fanTh + i * 0.4, fanOn);
        var ra = seg(t, 0.2 + i * 0.015, 0.26 + i * 0.015);
        if (ra > 0) {
          var rx = x + 0.5, y0 = -0.05, y1 = lerp(y0, FY - 0.2, eo(ra));
          g.line([rx, y0, 0.01], [rx, y1, 0.01], { color: T.soft, w: 1.3, dash: "4 5", bias: 0.5 });
          [y0, y1].forEach(function (yy) { g.line([rx - 0.07, yy, 0.01], [rx + 0.07, yy, 0.01], { color: T.soft, w: 1.3, bias: 0.5 }); });
        }

        // ---- wind from the fan through the rotor
        if (wind > 0) [[-0.35, 0.25], [0, 0.42], [0.33, 0.18], [-0.28, -0.22], [0.12, -0.38], [0.4, -0.08]].forEach(function (o, k) {
          g.path([[x + o[0], FY - 0.12, HZ + o[1]], [x + o[0] * 1.15, -0.75, HZ + o[1] * 1.1]], { color: T.soft, w: 1.3, dash: "10 16", dashOff: -(t * 700 + k * 37 + i * 11), op: wind * 0.8, bias: 0.04 });
        });

        // ---- wiring to the LED, and the LED itself
        if (wa > 0) [0.03, 0.08].forEach(function (dx, k) {
          var a = [x + dx, -0.22, 0.02], c = [x + dx, -0.78, 0.02];
          g.line(a, [lerp(a[0], c[0], wa), lerp(a[1], c[1], wa), 0.02], { color: k ? "brand" : T.line, w: 1.4, bias: 0.3 });
        });
        if (la > 0) {
          var led = [x, -0.88, 0.2];
          g.box(x - 0.2, -1.04, 0, 0.4, 0.3, 0.06, "paper", { op: Math.min(1, la) });
          g.line([x - 0.03, -0.88, 0.06], [x - 0.03, -0.88, 0.16], { w: 1.2, bias: -0.01 });
          g.line([x + 0.03, -0.88, 0.06], [x + 0.03, -0.88, 0.16], { w: 1.2, bias: -0.01 });
          if (b > 0.01) {
            g.poly(circle([x, -0.88, 0.065], 0.18 + 0.32 * b, 24, -0.88).map(function (p) { return [p[0], -0.88 + (p[2] - 0.065), 0.065]; }).slice(0, 24), Z, { flat: true, stroke: false, fillOp: 0.14 * b, bias: 0.2 }); // light pool
            [4.6, 3.2, 2.2, 1.5].forEach(function (r, k) { g.dot(led, 7 * r * (0.5 + 0.5 * b), Z, { stroke: false, op: 0.07 * (k + 1) * b, bias: -0.1 }); });
          }
          g.dot(led, 7 * Math.min(1, la), b > 0.01 ? Z : "ink", { bias: -0.12 });
          if (b > 0.01) g.dot(led, 7 * Math.min(1, la), "ink", { stroke: false, op: 1 - b, bias: -0.121 });

          // brightness bar beside it
          var hb = 0.04 + 1.0 * b, bx = x + 0.3;
          g.box(bx, -0.98, 0, 0.15, 0.15, 1.04, "sky", { op: 0.18 * Math.min(1, la), bias: 0.05 });
          g.box(bx, -0.98, 0, 0.15, 0.15, hb * Math.min(1, la), "brand", { op: Math.min(1, la) });
          if (L.win && reveal > 0) g.box(bx, -0.98, 0, 0.15, 0.15, hb, OR, { op: eo(reveal), bias: -0.001 });
        }

        // ---- the winner: an orange ring round its LED and a tick over the rotor
        if (L.win && reveal > 0) {
          var q = g.P([x, -0.88, 0.2]), rr = 14 + 40 * eo(reveal);
          g.screen('<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="none" stroke="' + OR + '" stroke-width="3" opacity="' + (1 - reveal).toFixed(3) + '"/>');
          g.screen('<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="16" fill="none" stroke="' + OR + '" stroke-width="3" opacity="' + eo(reveal).toFixed(3) + '"/>');
          var c2 = g.P([x + 0.37, -0.9, 1.3]), ck = seg(t, 0.82, 0.86); // over its bar
          g.screen('<path d="M' + (c2[0] - 14).toFixed(1) + ' ' + c2[1].toFixed(1) + ' l10 10 l20 -22" fill="none" stroke="' + OR + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60" stroke-dashoffset="' + (60 * (1 - eo(ck))).toFixed(1) + '"/>');
        }
      });
    }
  });
})();

/* ---- towers/towers.js ---- */
;/* WonderLab spaghetti-and-marshmallow towers: four typologies build up side by side, each takes
 * the same weight on top. The unbraced square column racks over, the slender unbraced spire
 * buckles at mid-height, and the two braced, tapered towers hold through the ten-second timer.
 * The scene is a pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, ap = U.ap, rotY = U.rotY;

  function easeIn(x) { return x * x * x; }
  // fall with a small settle bounce at the end
  function fall(x) { return x < 0.8 ? easeIn(x / 0.8) : 1 - 0.04 * Math.sin((x - 0.8) / 0.2 * Math.PI); }

  // ---- tower geometry: nodes by level, members between them
  // levels: [z, size]; shape "sq" (4 legs) or "tri" (3 legs); braced adds one diagonal per face per storey
  function build(levels, shape, braced) {
    var n = shape === "sq" ? 4 : 3, nodes = [], mem = [];
    levels.forEach(function (L, l) {
      for (var i = 0; i < n; i++) {
        var p = shape === "sq"
          ? [[-1, -1], [1, -1], [1, 1], [-1, 1]][i].map(function (v) { return v * L[1]; })
          : [L[1] * Math.cos(TAU * i / 3 - Math.PI / 2), L[1] * Math.sin(TAU * i / 3 - Math.PI / 2)];
        nodes.push({ p: [p[0], p[1], L[0]], l: l });
      }
    });
    for (var l = 0; l < levels.length; l++) {
      for (var i = 0; i < n; i++) {
        var a = l * n + i, b = l * n + (i + 1) % n;
        mem.push({ a: a, b: b, kind: "ring", l: l });
        if (l > 0) {
          mem.push({ a: a - n, b: a, kind: "leg", l: l });
          if (braced) mem.push({ a: (l % 2 ? a : b) - n, b: l % 2 ? b : a, kind: "brace", l: l });
        }
      }
    }
    return { nodes: nodes, mem: mem, levels: levels.length, H: levels[levels.length - 1][0] };
  }

  var BUILD0 = 0.03, STEP = 0.048, LOAD0 = 0.45;

  var TOWERS = [
    { // A: tapered square, braced: holds
      g: build([[0, 0.95], [1.1, 0.78], [2.2, 0.62], [3.3, 0.47], [4.3, 0.34]], "sq", true),
      mode: "hold"
    },
    { // B: straight square column, no bracing: racks sideways
      g: build([[0, 0.5], [1.1, 0.5], [2.2, 0.5], [3.3, 0.5], [4.4, 0.5]], "sq", false),
      mode: "rack", pre: [0.5, 0.56], c: [0.56, 0.64]
    },
    { // C: tapered triangle, braced: holds
      g: build([[0, 1.05], [1.1, 0.84], [2.2, 0.65], [3.3, 0.48], [4.3, 0.34]], "tri", true),
      mode: "hold"
    },
    { // D: slender triangular spire, no bracing: buckles at mid-height
      g: build([[0, 0.42], [0.9, 0.38], [1.8, 0.35], [2.7, 0.32], [3.6, 0.29], [4.5, 0.26], [5.3, 0.24]], "tri", false),
      mode: "buckle", pre: [0.56, 0.66], c: [0.66, 0.74], hk: 2.25
    }
  ];
  var XS = [-4.3, -1.45, 1.45, 4.3];

  // deformation of one tower at time t; returns tf for a node (optionally forcing the upper piece)
  function deformer(T, t, i) {
    var load = eo(seg(t, LOAD0 + i * 0.02, LOAD0 + i * 0.02 + 0.05)), H = T.g.H;
    var sway = 0.025 * Math.sin((t - LOAD0) * TAU * 3 + i) * seg(t, LOAD0 + 0.04, LOAD0 + 0.08) * (1 - seg(t, 0.84, 0.92));
    var S = { load: load, c: 0, split: false };
    if (T.mode === "hold") {
      S.tf = function (p) { return [p[0] + sway * p[2], p[1], p[2] * (1 - 0.012 * load)]; };
      return S;
    }
    var pre = seg(t, T.pre[0], T.pre[1]) * (1 - seg(t, T.c[0], T.c[0] + 0.01));
    var c = fall(seg(t, T.c[0], T.c[1]));
    S.c = seg(t, T.c[0], T.c[1]);
    if (T.mode === "rack") {
      // storeys shear into parallelograms, rotating about the base joints (falls toward the camera)
      var th = 0.06 * Math.sin((t - T.pre[0]) * TAU * 14) * pre + 1.2 * c;
      S.tf = function (p) { return [p[0] + sway * p[2], p[1] - p[2] * Math.sin(th), p[2] * Math.cos(th)]; };
      return S;
    }
    // buckle: the spire bows, snaps at hk, the top piece folds over to the ground
    var hk = T.hk, Lu = H - hk, bow = 0.16 * pre + 0.2 * Math.min(1, c * 3);
    var t1 = 0.18 * c, phiF = Math.acos(U.clamp((0.15 - hk) / Lu, -1, 1)), phi = phiF * c;
    function bowed(p) { return [p[0] + bow * Math.sin(Math.PI * p[2] / H), p[1], p[2]]; }
    function low(p) { return rotY(bowed(p), [0, 0, 0], t1); }
    var Kb = bowed([0, 0, hk]), K2 = low([0, 0, hk]);
    // upper piece pivots about the snap point, which rides on the tilted lower piece
    function up(p) { var q = rotY(bowed(p), Kb, t1 + phi); return [q[0] + K2[0] - Kb[0], q[1], q[2] + K2[2] - Kb[2]]; }
    S.split = true; S.hk = hk; S.low = low; S.up = up;
    S.tf = function (p) { return p[2] <= hk ? low(p) : up(p); };
    return S;
  }

  // the load: a classic weight (tapered block, ring handle) in WonderLab orange
  function weight(g, c) {
    var b = 0.3, tp = 0.2, h = 0.36, lo = [], hi = [], OR = "#FF6000";
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { lo.push([c[0] + q[0] * b, c[1] + q[1] * b, c[2]]); hi.push([c[0] + q[0] * tp, c[1] + q[1] * tp, c[2] + h]); });
    for (var j = 0; j < 4; j++) g.poly([lo[j], lo[(j + 1) % 4], hi[(j + 1) % 4], hi[j]], OR, { cull: true, w: 1.4, bias: -0.6 });
    g.poly(hi, OR, { w: 1.4, bias: -0.61 });
    var ring = [];
    for (var k = 0; k <= 20; k++) { var a = Math.PI * k / 20; ring.push([c[0] + 0.12 * Math.cos(a), c[1], c[2] + h + 0.13 * Math.sin(a)]); }
    g.path(ring, { color: g.T.line, w: 4, bias: -0.8 });
    g.path(ring, { color: OR, w: 2, bias: -0.81 });
  }

  function drawTower(g, t, T, i) {
    var ox = XS[i], G = T.g, st = BUILD0 + i * 0.022, S = deformer(T, t, i);
    var W = function (p) { return [p[0] + ox, p[1], p[2]]; };
    var tf = function (p) { return W(S.tf(p)); };
    var A = []; for (var l = 0; l < G.levels; l++) A.push(ap(t, l, st, STEP, 0.1));
    // members
    G.mem.forEach(function (m) {
      var a = A[m.l];
      if (a <= 0) return;
      var pa = G.nodes[m.a].p, pb = G.nodes[m.b].p, o = { w: m.kind === "brace" ? 2.6 : 3.2, mat: "wood" };
      if (m.kind === "ring") { o.op = a; }
      else if (m.kind === "leg") { pb = [lerp(pa[0], pb[0], a), lerp(pa[1], pb[1], a), lerp(pa[2], pb[2], a)]; }
      else { if (a <= 0.6) return; o.op = (a - 0.6) / 0.4; }
      if (S.split && (pa[2] - S.hk) * (pb[2] - S.hk) < 0) { // snapped member: two stubs
        var k = (S.hk - pa[2]) / (pb[2] - pa[2]), mid = [lerp(pa[0], pb[0], k), lerp(pa[1], pb[1], k), S.hk];
        var lo = pa[2] < pb[2] ? pa : pb, hi = pa[2] < pb[2] ? pb : pa, gap = 0.12 * Math.min(1, S.c * 4);
        var mLo = [mid[0], mid[1], mid[2] - gap], mHi = [mid[0], mid[1], mid[2] + gap];
        g.tube(W(S.low(lo)), W(S.low(mLo)), o);
        g.tube(W(S.up(mHi)), W(S.up(hi)), o);
      } else g.tube(tf(pa), tf(pb), o);
    });
    // marshmallow joints
    G.nodes.forEach(function (nd) { var a = A[nd.l]; if (a > 0) g.dot(tf(nd.p), 7.5, "paper", { op: a, bias: -0.2 }); });
    // weight: same load on every tower; slides off and drops once the tower fails
    if (S.load > 0) {
      var top = [0, 0, G.H + 0.03 + (1 - S.load) * 2.4], wp;
      if (S.c > 0.45) {
        var sAt = deformer(T, T.c[0] + 0.45 * (T.c[1] - T.c[0]), i), from = sAt.tf([0, 0, G.H + 0.03]);
        var d = easeIn(seg(S.c, 0.45, 0.85)), bounce = 0.12 * Math.sin(seg(S.c, 0.85, 1) * Math.PI);
        wp = [from[0] + (T.mode === "buckle" ? 0.6 : 0) * d, from[1] - (T.mode === "rack" ? 0.5 : 0) * d, lerp(from[2], 0, d) + bounce];
      } else wp = S.tf(top);
      wp = W(wp);
      weight(g, wp);
      if (T.mode !== "hold") { // dust rings where it lands
        for (var k = 0; k < 2; k++) {
          var p = seg(S.c, 0.85 + k * 0.05, 1) * (1 - seg(t, T.c[1] + 0.12, T.c[1] + 0.2));
          if (p <= 0) continue;
          var pts = [], r = 0.4 + 0.9 * eo(seg(t, T.c[1] - 0.02 + k * 0.02, T.c[1] + 0.12 + k * 0.02));
          for (var j = 0; j <= 32; j++) { var an = j / 32 * TAU; pts.push([wp[0] + r * Math.cos(an), wp[1] + r * 0.8 * Math.sin(an), 0.02]); }
          g.path(pts, { color: g.T.line, w: 1.4, op: 0.6 * (1 - eo(seg(t, T.c[1], T.c[1] + 0.14))), bias: 5 });
        }
      }
    }
  }

  WL.define("towersAll", { cam: { yaw: 34, pitch: 20, S: 56, amp: 4, z: 1.15 }, draw: function (g, t) {
    // floor grid spanning the row
    var go = ap(t, 0, 0.0, 0, 0.1);
    for (var x = -6; x <= 6.001; x += 1) g.path([[x, -2.5, 0], [x, 2.5, 0]], { color: g.T.grid, w: 1, bias: 100, op: go });
    for (var y = -2.5; y <= 2.501; y += 1) g.path([[-6, y, 0], [6, y, 0]], { color: g.T.grid, w: 1, bias: 100, op: go });
    TOWERS.forEach(function (T, i) { drawTower(g, t, T, i); });
    // ten-second timer for the survivors
    var tO = seg(t, 0.74, 0.77) * (1 - seg(t, 0.9, 0.93)), q = g.P([0, 0, 6.6]);
    for (var k = 0; k < 10; k++) {
      var on = seg(t, 0.76 + k * 0.012, 0.765 + k * 0.012);
      g.screen('<rect x="' + (q[0] - 70 + k * 14).toFixed(1) + '" y="' + q[1].toFixed(1) + '" width="9" height="21" rx="3" fill="' + (on > 0.5 ? g.T.mats.zing : "none") + '" stroke="' + g.T.line + '" stroke-width="1.8" opacity="' + tO.toFixed(3) + '"/>');
    }
  } });
})();

/* ---- boat-hulls/hulls.js ---- */
;/* WonderLab foil-boat hulls: four hull typologies, each folded from two sheets of tin foil,
 * floating side by side and loaded with coins at the same pace. Each sinks once it passes its
 * limit, so they go down one after the other: catamaran, punt, barge, then the eight-cell tray.
 * The scene is a pure function of loop progress t in [0, 1].
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, hash = U.hash, rotX = U.rotX, rotY = U.rotY;

  var COIN = 0.055, C0 = 0.1, DT = 0.7 / 32, DROP = 0.045;

  function centroid(poly) { var x = 0, y = 0; poly.forEach(function (p) { x += p[0]; y += p[1]; }); return [x / poly.length, y / poly.length]; }
  function flare(poly, k) { var c = centroid(poly); return poly.map(function (p) { return [c[0] + (p[0] - c[0]) * k[0], c[1] + (p[1] - c[1]) * k[1]]; }); }

  // ---- explicit draw layers. The engine paints by average depth (bigger = further, drawn first), which lets
  // big walls and small coins swap order from frame to frame. Each hull instead paints in fixed layers around
  // its own centre depth dc: floor + back walls (dc + 0.5), contents (dc + 0.2, sorted among themselves),
  // front walls (dc - 0.4), anything above the rim (dc - 0.6).
  function md(g, pts) { var d = 0; pts.forEach(function (p) { d += g.P(p)[2]; }); return d / pts.length; }
  function put(g, pts, mat, o, target) { o.bias = target - md(g, pts); g.poly(pts, mat, o); }
  function putPath(g, pts, o, target) { o.bias = target - md(g, pts); g.path(pts, o); }
  function inner(g, dc, pts) { return dc + 0.2 + 0.05 * (md(g, pts) - dc); } // contents keep their true order, squeezed into the layer
  function sub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  // folded tray: floor polygon at z = 0, rim polygon (same count) at z = H; returns its centre depth
  function tray(g, ph, base, top, H, o) {
    o = o || {};
    var tf = ph.tf, n = base.length, c = centroid(base), C = tf([c[0], c[1], H / 2]), dc = g.P(C)[2];
    put(g, base.map(function (p) { return tf([p[0], p[1], 0]); }), "foil", { op: ph.op }, dc + 0.55);
    for (var i = 0; i < n; i++) {
      var j = (i + 1) % n, b0 = [base[i][0], base[i][1], 0], b1 = [base[j][0], base[j][1], 0];
      var t0 = [top[i][0], top[i][1], H], t1 = [top[j][0], top[j][1], H], w = [b0, b1, t1, t0].map(tf);
      var nrm = cross3(sub3(w[1], w[0]), sub3(w[3], w[0])), mid = [(w[0][0] + w[2][0]) / 2, (w[0][1] + w[2][1]) / 2, (w[0][2] + w[2][2]) / 2];
      if (dot3(nrm, sub3(mid, C)) < 0) nrm = [-nrm[0], -nrm[1], -nrm[2]];
      var front = dot3(nrm, g.V) > 0, layer = front ? dc - 0.4 : dc + 0.5;
      put(g, w, "foil", { op: ph.op }, layer);
      if (o.pleats) { // corrugated foil: crease lines across the wall
        var m = Math.max(2, Math.round(Math.hypot(b1[0] - b0[0], b1[1] - b0[1]) / o.pleats));
        for (var q = 1; q < m; q++) {
          var a = q / m;
          putPath(g, [tf([lerp(b0[0], b1[0], a), lerp(b0[1], b1[1], a), 0]), tf([lerp(t0[0], t1[0], a), lerp(t0[1], t1[1], a), H])], { w: 1, color: g.T.soft, op: ph.op * 0.9 }, layer - 0.005);
        }
      }
    }
    return dc;
  }

  // vertical foil divider (sheet 2): floor edge a-b, top edge a2-b2
  function divider(g, ph, dc, a, b, h, a2, b2) {
    var pts = [[a[0], a[1], 0], [b[0], b[1], 0], [b2[0], b2[1], h], [a2[0], a2[1], h]].map(ph.tf);
    put(g, pts, "foil", { op: ph.op }, inner(g, dc, pts));
  }

  // coin: side band + top face painted as one unit in the hull's contents layer (above the rim while falling);
  // `forced` pins it to a given layer (deck coins)
  function coin(g, ph, p, r, drop, dc, rim, forced) {
    if (drop <= 0) return;
    var zl = p[2] + (1 - eo(drop)) * 3.2, s = ph.s, q = ph.tf([p[0], p[1], zl]), n = 16, top = [], R = r * s, hC = COIN * s;
    for (var i = 0; i < n; i++) { var a = i / n * TAU; top.push([q[0] + R * Math.cos(a), q[1] + R * Math.sin(a), q[2] + hC]); }
    var V = g.V, h = Math.atan2(V[1], V[0]), band = [], k, b;
    for (k = 0; k <= n / 2; k++) { b = h - Math.PI / 2 + k / (n / 2) * Math.PI; band.push([q[0] + R * Math.cos(b), q[1] + R * Math.sin(b), q[2]]); }
    for (k = n / 2; k >= 0; k--) { b = h - Math.PI / 2 + k / (n / 2) * Math.PI; band.push([q[0] + R * Math.cos(b), q[1] + R * Math.sin(b), q[2] + hC]); }
    var own = g.P(q)[2], target = forced !== undefined ? forced - 0.01 * (own - dc) : zl > rim + 0.02 ? dc - 0.6 - 0.02 * zl : dc + 0.2 + 0.05 * (own - dc);
    put(g, band, "#C94C00", { flat: true, w: 1.2, op: ph.op }, target);                // WonderLab orange coins (rim a shade darker)
    put(g, top, "#FF6000", { flat: true, w: 1.2, op: ph.op }, target - 0.0005);
  }

  function hw(x, t) { return 0.06 * Math.sin(x * 1.8 - t * TAU * 3); }

  // water plane and wave lines, wide enough to fill a square frame
  function water(g, t) {
    var W = 12, D = 10, N = 30;
    for (var k = 0; k < N; k++) {
      var x0 = -W + k * 2 * W / N, x1 = x0 + 2 * W / N;
      g.poly([[x0, -D, hw(x0, t)], [x1, -D, hw(x1, t)], [x1, D, hw(x1, t)], [x0, D, hw(x0, t)]], "water", { flat: true, stroke: false, fillOp: 0.5, bias: 3 });
    }
    for (var w = 0; w < 13; w++) {
      var pts = [], y = -9.3 + w * 1.55;
      for (var x = -W; x <= W + 1e-6; x += 0.25) pts.push([x, y, hw(x, t) + 0.02]);
      g.path(pts, { color: "brand", w: 1.8, op: 0.8, bias: y < -3 ? -3 : 3 });
    }
  }

  // per-hull state: floats in, takes one coin per beat, sinks one beat after its last coin
  function phase(t, o) {
    var appear = seg(t, o.appear, o.appear + 0.07), land = eio(appear);
    var landed = U.clamp(Math.floor((t - C0 - DROP) / DT) + 1, 0, o.n);
    var s0 = C0 + o.n * DT + 0.04, sinking = eio(seg(t, s0, s0 + 0.1));
    var bob = 0.04 * Math.sin(t * TAU * 3 + o.off[0]) * land * (1 - sinking);
    var z = lerp(1.0, 0.14 * o.s, land) - o.sinkPer * landed - 0.75 * sinking + bob;
    var tilt = (0.035 * Math.sin(t * TAU * 2 + o.off[1]) * land + 0.2 * sinking) * o.lean;
    return {
      s: o.s, s0: s0,
      op: eo(appear) * (1 - 0.78 * eio(seg(t, s0 + 0.02, s0 + 0.1))), // under water it fades to a ghost
      tf: function (p) {
        var q = rotY(rotX([p[0] * o.s, p[1] * o.s, p[2] * o.s], [0, 0, 0], tilt), [0, 0, 0], tilt * 0.4);
        return [q[0] + o.off[0], q[1] + o.off[1], q[2] + z];
      },
      drop: function (i) { if (i >= o.n) return 0; var st = C0 + i * DT; return seg(t, st, st + DROP); }
    };
  }

  // rings spreading on the surface where a hull went down
  function ripple(g, t, ph, o) {
    for (var k = 0; k < 2; k++) {
      var p = seg(t, ph.s0 + 0.03 + k * 0.03, ph.s0 + 0.16 + k * 0.03);
      if (p <= 0 || p >= 1) continue;
      var rx = (o.rx + 0.9 * eo(p)) * o.s, ry = (o.ry + 0.9 * eo(p)) * o.s, pts = [];
      for (var i = 0; i <= 40; i++) { var a = i / 40 * TAU, x = o.off[0] + rx * Math.cos(a); pts.push([x, o.off[1] + ry * Math.sin(a), hw(x, t) + 0.03]); }
      g.path(pts, { color: g.T.line, w: 1.6, op: 0.7 * (1 - p), bias: -1 });
    }
  }

  // ---------- hull typologies (local coordinates, x = length, y = beam)
  var HULLS = [];

  // A: pointed punt with three cross dividers
  (function () {
    var base = [[-1.4, -0.42], [1.2, -0.42], [1.8, 0], [1.2, 0.42], [-1.4, 0.42], [-1.9, 0]];
    var top = [[-1.6, -0.78], [1.35, -0.78], [2.25, 0], [1.35, 0.78], [-1.6, 0.78], [-2.3, 0]];
    var H = 0.62, C = [];
    [[-1.2, 0], [-0.38, -0.2], [-0.38, 0.2], [0.38, -0.2], [0.38, 0.2], [1.15, 0]].forEach(function (p, i) {
      for (var l = 0; l < 3; l++) C.push([p[0], p[1], 0.01 + l * COIN, i]);
    });
    C.sort(function (a, b) { return a[2] - b[2] || a[3] - b[3]; });
    HULLS.push({ C: C, sinkPer: 0.018, rx: 2.2, ry: 0.9, draw: function (g, ph) {
      var dc = tray(g, ph, base, top, H);
      [-0.75, 0, 0.75].forEach(function (x) { divider(g, ph, dc, [x, -0.42], [x, 0.42], H * 0.85, [x, -0.72], [x, 0.72]); });
      C.forEach(function (c, i) { coin(g, ph, c, 0.19, ph.drop(i), dc, H); });
    } });
  })();

  // B: catamaran, two pontoons bridged by a braced deck
  (function () {
    var pont = function (y) {
      return {
        base: [[-1.7, y - 0.2], [1.3, y - 0.2], [1.8, y], [1.3, y + 0.2], [-1.7, y + 0.2], [-1.85, y]],
        top: [[-1.8, y - 0.3], [1.4, y - 0.3], [2.05, y], [1.4, y + 0.3], [-1.8, y + 0.3], [-2.0, y]]
      };
    };
    var P = [pont(-0.95), pont(0.95)], H = 0.48, DZ = H + 0.02, C = [];
    [-1.25, -0.6, 0.6, 1.25].forEach(function (x) { [-0.95, 0.95].forEach(function (y) { C.push([x, y, 0.01, 0]); }); });
    for (var l = 0; l < 6; l++) C.push([0, 0, DZ + 0.06 + l * COIN, 1]);
    HULLS.push({ C: C, sinkPer: 0.022, rx: 2.1, ry: 1.4, draw: function (g, ph) {
      var tf = ph.tf;
      var dcs = P.map(function (p) { return tray(g, ph, p.base, p.top, H); }), top = Math.min(dcs[0], dcs[1]);
      // braces, then the deck on top of both pontoons, then the coin stack on the deck
      [-1.3, 1.3].forEach(function (x) {
        [[[x, -0.72, H], [x, 0.72, H]], [[x - 0.35, -0.72, H], [x + 0.35, 0.72, H]], [[x + 0.35, -0.72, H], [x - 0.35, 0.72, H]]].forEach(function (L) {
          putPath(g, L.map(tf), { w: 2.2, op: ph.op }, top - 0.5);
        });
      });
      var dk = tf([0, 0, DZ + 0.03]);
      g.box(-0.7, -1.2, DZ, 1.4, 2.4, 0.06, "foil", { tf: tf, op: ph.op, bias: top - 0.55 - g.P(dk)[2] });
      C.forEach(function (c, i) {
        if (c[3]) coin(g, ph, c, 0.24, ph.drop(i), top, DZ, top - 0.6);
        else coin(g, ph, c, 0.16, ph.drop(i), dcs[c[1] < 0 ? 0 : 1], H);
      });
    } });
  })();

  // C: rectangular tray with a spine and cross walls: eight cells
  (function () {
    var base = [[-1.5, -0.72], [1.5, -0.72], [1.5, 0.72], [-1.5, 0.72]];
    var top = flare(base, [1.04, 1.07]), H = 0.5, C = [], cells = [];
    [-1.125, -0.375, 0.375, 1.125].forEach(function (x) { [-0.36, 0.36].forEach(function (y) { cells.push([x, y]); }); });
    for (var l = 0; l < 4; l++) cells.forEach(function (c, i) { C.push([c[0], c[1], 0.01 + l * COIN, i]); });
    HULLS.push({ C: C, sinkPer: 0.012, rx: 1.7, ry: 0.9, draw: function (g, ph) {
      var dc = tray(g, ph, base, top, H);
      divider(g, ph, dc, [-1.5, 0], [1.5, 0], H * 0.9, [-1.56, 0], [1.56, 0]);
      [-0.75, 0, 0.75].forEach(function (x) { divider(g, ph, dc, [x, -0.72], [x, 0.72], H * 0.9, [x, -0.76], [x, 0.76]); });
      C.forEach(function (c, i) { coin(g, ph, c, 0.22, ph.drop(i), dc, H); });
    } });
  })();

  // D: pleated barge with pointed ends, coins heaped loose
  (function () {
    var base = [[-1.3, -0.6], [1.3, -0.6], [1.75, 0], [1.3, 0.6], [-1.3, 0.6], [-1.75, 0]];
    var top = flare(base, [1.06, 1.12]), H = 0.62, C = [];
    for (var i = 0; i < 24; i++) {
      var layer = i < 14 ? 0 : i < 21 ? 1 : 2;
      var x = lerp(-1.15 + layer * 0.25, 1.15 - layer * 0.25, hash(i * 3.1)), y = lerp(-0.34 + layer * 0.1, 0.34 - layer * 0.1, hash(i * 7.7 + 2));
      C.push([x, y, 0.01 + layer * COIN * 1.4 + hash(i + 5) * 0.03, i]);
    }
    HULLS.push({ C: C, sinkPer: 0.013, rx: 1.9, ry: 0.8, draw: function (g, ph) {
      var dc = tray(g, ph, base, top, H, { pleats: 0.16 });
      putPath(g, top.concat([top[0]]).map(function (p) { return ph.tf([p[0], p[1], H]); }), { w: 3, color: g.T.line, op: ph.op }, dc - 0.45);
      C.forEach(function (c, i) { coin(g, ph, c, 0.19, ph.drop(i), dc, H); });
    } });
  })();

  // 2 x 2 layout on one water surface; back row floats in first
  var S = 0.72;
  var LAYOUT = [
    { h: 0, off: [-1.85, -1.75], appear: 0.02, lean: 1 },   // A punt, front left
    { h: 2, off: [1.95, -1.75], appear: 0.035, lean: -1 },  // C tray, front right
    { h: 1, off: [-1.85, 1.7], appear: 0.0, lean: -1 },     // B catamaran, back left
    { h: 3, off: [1.95, 1.7], appear: 0.015, lean: 1 }      // D barge, back right
  ];

  WL.define("hullsAll", { cam: { yaw: 22, pitch: 34, S: 64, amp: 4, z: 1.3 }, draw: function (g, t) {
    water(g, t);
    LAYOUT.forEach(function (L) {
      var H = HULLS[L.h];
      var o = { n: H.C.length, sinkPer: H.sinkPer, s: S, off: L.off, appear: L.appear, lean: L.lean, rx: H.rx, ry: H.ry };
      var ph = phase(t, o);
      H.draw(g, ph);
      ripple(g, t, ph, o);
    });
  } });
})();

/* ---- treehouse-sketch (forked engine, isolated) ---- */
;(function () {
  var window = {};
/* WonderLab scene engine
 * Tiny deterministic 3D/2D line-and-face renderer for SVG.
 * Every scene is a pure function of loop progress t in [0, 1]; f(0) === f(1),
 * so HyperFrames can seek any frame and the rendered clips loop seamlessly.
 */
window.WL = (function () {
  "use strict";

/* Infinite Facade tile traced from reference IMG_4573 (one 291px tile; the pattern uses its four rotations) */
  var FACADE_INK = "data:image/png;base64,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";
  var FACADE_SKY = "data:image/png;base64,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";


  var TAU = Math.PI * 2, RAD = Math.PI / 180;
  function clamp(v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }
  function eo(x) { return 1 - Math.pow(1 - x, 3); }
  function eio(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function back(x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function lerp(a, b, x) { return a + (b - a) * x; }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  // appear progress for item i of a staggered sequence
  function ap(t, i, start, step, dur) { return eo(seg(t, start + i * step, start + i * step + (dur || 0.12))); }
  function frac(x) { return x - Math.floor(x); }

  var THEMES = {
    light: {
      bg: "#EEF1F0", grid: "rgba(13,27,38,0.07)", line: "#0D1B26", soft: "rgba(13,27,38,0.45)",
      shadow: "rgba(13,27,38,0.10)", tone: "#8196A6",
      mats: { paper: "#FFFFFF", foil: "#DCE3E8", zing: "#DCE85E", sky: "#A8D8F0", brand: "#2E6DB0", water: "#A8D8F0", ink: "#1B2A36", wood: "#EBDDC3" }
    },
    dark: {
      // thin white line work on navy: fills are navy shades, one near-white accent, no yellow
      bg: "#0D1B26", grid: "rgba(237,243,246,0.07)", line: "#EDF3F6", soft: "rgba(237,243,246,0.5)",
      shadow: "rgba(0,0,0,0.35)", tone: "#06121B",
      mats: { paper: "#14293A", foil: "#1A3346", zing: "#E8F0F4", sky: "#1F3D55", brand: "#9FB6C4", water: "#1B3A52", ink: "#0A1620", wood: "#1E3C51" }
    },
    // Explorers: turquoise
    teal: {
      bg: "#083A42", grid: "rgba(237,243,246,0.08)", line: "#EDF3F6", soft: "rgba(237,243,246,0.5)",
      shadow: "rgba(0,0,0,0.32)", tone: "#02222A",
      mats: { paper: "#0F4B55", foil: "#155B67", zing: "#E8F0F4", sky: "#12525E", brand: "#9AC7C9", water: "#0F4F5C", ink: "#04262C", wood: "#155A66" }
    },
    // pencil sketch on the blue02 paper (treehouse-sketch): warm white pencil, deep green washes, white hatching for light
    sketch: {
      sketch: true, bg: "#043F38", grid: "rgba(242,240,230,0.0)", line: "#F2F0E6", soft: "rgba(242,240,230,0.5)",
      shadow: "rgba(0,22,18,0.5)", tone: "#011C18", fillOp: 0.86,
      mats: { paper: "#08453E", foil: "#0A4A42", zing: "#F6E9C2", sky: "#022723", brand: "#2A7466", water: "#06433B", ink: "#032A25", wood: "#094740" }
    },
    // the same pencil sketch on green01 (grahic design/green01.jpg, leaf shadows): forest-green washes and leaves
    "sketch-green": {
      sketch: true, bg: "#203A1E", grid: "rgba(242,240,230,0.0)", line: "#F4F2E8", soft: "rgba(244,242,232,0.5)",
      shadow: "rgba(8,22,6,0.5)", tone: "#0C1C0B", fillOp: 0.86,
      mats: { paper: "#1E3A1C", foil: "#22401F", zing: "#F6E9C2", sky: "#0F220E", brand: "#4F7D38", water: "#1E3A1C", ink: "#132912", wood: "#203D1D" },
      leaves: ["#2E5F22", "#6E9F45", "#C9E08E"], vine: "#D3E9AE"
    },
    // Creators: dark blue
    blue: {
      bg: "#0E2A4F", grid: "rgba(237,243,246,0.08)", line: "#EDF3F6", soft: "rgba(237,243,246,0.5)",
      shadow: "rgba(0,0,0,0.32)", tone: "#06182F",
      mats: { paper: "#173861", foil: "#1D456F", zing: "#E8F0F4", sky: "#1A4070", brand: "#A3B6D0", water: "#173C68", ink: "#0A1E3A", wood: "#1C4470" }
    }
  };

  function hex2rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mix(a, b, k) {
    var A = hex2rgb(a), B = hex2rgb(b);
    return "rgb(" + Math.round(lerp(A[0], B[0], k)) + "," + Math.round(lerp(A[1], B[1], k)) + "," + Math.round(lerp(A[2], B[2], k)) + ")";
  }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function f1(n) { return Math.round(n * 10) / 10; }

  // rotations about an axis through a pivot
  function rotZ(p, c, a) { var s = Math.sin(a), k = Math.cos(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * k - y * s, c[1] + x * s + y * k, p[2]]; }
  function rotY(p, c, a) { var s = Math.sin(a), k = Math.cos(a), x = p[0] - c[0], z = p[2] - c[2]; return [c[0] + x * k + z * s, p[1], c[2] - x * s + z * k]; }
  function rotX(p, c, a) { var s = Math.sin(a), k = Math.cos(a), y = p[1] - c[1], z = p[2] - c[2]; return [p[0], c[1] + y * k - z * s, c[2] + y * s + z * k]; }

  function Ctx(cam, T) {
    var yaw = cam.yaw * RAD, pit = cam.pitch * RAD;
    var c = Math.cos(yaw), s = Math.sin(yaw), ce = Math.cos(pit), se = Math.sin(pit);
    var S = cam.S, cx = cam.cx, cy = cam.cy;
    var V = [-ce * s, -ce * c, se];
    var Lw = norm([-0.45, -0.6, 0.9]);
    var items = [], overlay = [];
    var EDGE = cam.edge || 1.6;

    function P(p) {
      var xr = p[0] * c - p[1] * s, yr = p[0] * s + p[1] * c;
      return [cx + S * xr, cy - S * (p[2] * ce + yr * se), yr * ce - p[2] * se];
    }
    function col(m) { return (m && T.mats[m]) || m || T.line; }
    function pts2(pp) { return pp.map(function (q) { return f1(q[0]) + "," + f1(q[1]); }).join(" "); }

    // ---- sketch mode (T.sketch): every stroke is a pencil line that bows a little and overshoots its corners, with a
    // lighter second pass; faces are opaque washes with white hatching where the light falls; api.ink (0..1, set by the
    // scene before a part) draws the strokes on, then lays the wash, then the hatching. Seeds come from world points,
    // so a still part keeps the same wobble while the camera turns.
    var SK = !!T.sketch;
    function wseed(p) { return p[0] * 12.9898 + p[1] * 78.233 + p[2] * 37.719; }
    function nf(n) { return n.toFixed(1); }
    function opa(x) { return x < 0.999 ? ' opacity="' + Math.max(0, x).toFixed(3) + '"' : ""; }
    function dash(f, from) { // draw-on with pathLength 1: the stroke is visible from `from` to f
      from = from || 0;
      if (f >= 0.999 && !from) return "";
      return ' pathLength="1" stroke-dasharray="' + Math.max(0, f - from).toFixed(3) + ' 3"' + (from ? ' stroke-dashoffset="' + (-from).toFixed(3) + '"' : "");
    }
    function skLine(A, B, s, w, color, op, f, d, sk) { // A, B screen points
      var dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
      if (L < 0.4 || f <= 0.001) return;
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      var o0 = L > 9 ? sk * Math.min(L * 0.12, 0.8 + 3.4 * hash(s + 1)) : 0, o1 = L > 9 ? sk * Math.min(L * 0.12, 0.4 + 3.4 * hash(s + 2)) : 0;
      var a = [A[0] - ux * o0, A[1] - uy * o0], b = [B[0] + ux * o1, B[1] + uy * o1];
      var bow = sk * (hash(s + 3) - 0.5) * Math.min(2.8, L * 0.05), c = [(a[0] + b[0]) / 2 + nx * bow, (a[1] + b[1]) / 2 + ny * bow];
      var tail = ' fill="none" stroke="' + color + '" stroke-linecap="round"';
      items.push({ d: d, s: '<path d="M' + nf(a[0]) + "," + nf(a[1]) + "Q" + nf(c[0]) + "," + nf(c[1]) + " " + nf(b[0]) + "," + nf(b[1]) + '"' + tail + ' stroke-width="' + nf(w * 1.1) + '"' + dash(f) + opa(op * 0.95) + "/>" });
      if (L > 16 && sk > 0) { // a lighter second pass, a hair off the first and not quite end to end
        var off = (hash(s + 6) - 0.5) * 2.4, from = 0.03 + 0.12 * hash(s + 4), to = Math.min(f, 0.82 + 0.18 * hash(s + 5));
        if (to > from) items.push({ d: d, s: '<path d="M' + nf(a[0] + nx * off) + "," + nf(a[1] + ny * off) + "Q" + nf(c[0] - nx * off * 0.6) + "," + nf(c[1] - ny * off * 0.6) + " " + nf(b[0] + nx * off * 0.3) + "," + nf(b[1] + ny * off * 0.3) + '"' + tail + ' stroke-width="' + nf(w * 0.6) + '"' + dash(to, from) + opa(op * 0.42) + "/>" });
      }
    }
    function skPath(pp, ws, closed, w, color, op, f, d, sk, seed) { // a run of screen points as one hand line (seed: fixed seeds for points that move with the camera)
      if (f <= 0.001) return;
      var Q = pp.map(function (q, i) { var s = seed !== undefined ? seed + i * 7.13 : wseed(ws[i]); return [q[0] + (hash(s + 11) - 0.5) * 1.1 * sk, q[1] + (hash(s + 12) - 0.5) * 1.1 * sk]; });
      var len = 0, i;
      for (i = 1; i < Q.length; i++) len += Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]);
      if (len < 0.5) return;
      var s0 = seed !== undefined ? seed * 1.7 + 3.1 : wseed(ws[0]) + wseed(ws[ws.length - 1]);
      if (closed) { var k = 0.25 + 0.35 * hash(s0 + 7); Q.push(Q[0].slice(), [lerp(Q[0][0], Q[1][0], k), lerp(Q[0][1], Q[1][1], k)]); } // runs a little past where it started
      else if (len > 20 && sk > 0) {
        var e = function (p, q, x) { var l = Math.hypot(p[0] - q[0], p[1] - q[1]) || 1; return [p[0] + (p[0] - q[0]) / l * x, p[1] + (p[1] - q[1]) / l * x]; };
        Q[0] = e(Q[0], Q[1], sk * (0.5 + 2.5 * hash(s0 + 8))); Q[Q.length - 1] = e(Q[Q.length - 1], Q[Q.length - 2], sk * (0.5 + 2.5 * hash(s0 + 9)));
      }
      var dd = "M" + Q.map(function (q) { return nf(q[0]) + "," + nf(q[1]); }).join("L"), tail = ' fill="none" stroke="' + color + '" stroke-linecap="round" stroke-linejoin="round"';
      items.push({ d: d, s: '<path d="' + dd + '"' + tail + ' stroke-width="' + nf(w * 1.1) + '"' + dash(f) + opa(op * 0.95) + "/>" });
      if (len > 30 && sk > 0) {
        var ox = (hash(s0 + 13) - 0.5) * 1.8, oy = (hash(s0 + 14) - 0.5) * 1.8, from = 0.04 + 0.1 * hash(s0 + 15), to = Math.min(f, 0.86 + 0.14 * hash(s0 + 16));
        if (to > from) items.push({ d: d, s: '<path d="M' + Q.map(function (q) { return nf(q[0] + ox) + "," + nf(q[1] + oy); }).join("L") + '"' + tail + ' stroke-width="' + nf(w * 0.55) + '"' + dash(to, from) + opa(op * 0.38) + "/>" });
      }
    }
    function inkStroke() { return clamp(api.ink * 1.45); }
    function inkWash() { return seg(api.ink, 0.3, 0.8); }
    function inkHatch() { return seg(api.ink, 0.6, 1); }

    var api = {
      T: T, S: S, P: P, V: V, ink: 1,
      poly: function (pts, mat, o) {
        o = o || {};
        if ((o.op !== undefined && o.op <= 0.01) || pts.length < 3) return;
        var n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
        if (o.cull && dot(n, V) <= 0) return;
        var k = o.flat ? 1 : 0.58 + 0.42 * Math.abs(dot(n, Lw));
        var base = col(mat);
        var fill = o.flat || base.indexOf("rgb") === 0 || base.indexOf("#") !== 0 ? base : mix(T.tone, base, k);
        var pp = pts.map(P), d = 0;
        pp.forEach(function (q) { d += q[2]; });
        d = d / pp.length + (o.bias || 0);
        if (SK) {
          var op = o.op === undefined ? 1 : o.op, wa = inkWash() * op, ha = inkHatch() * op, sf = inkStroke();
          if (o.fill !== false && wa > 0.005) items.push({ d: d, s: '<polygon points="' + pts2(pp) + '" fill="' + fill + '"' + (o.fillOp !== undefined ? ' fill-opacity="' + o.fillOp + '"' : T.fillOp && fill.charAt(0) === "#" ? ' fill-opacity="' + T.fillOp + '"' : "") +
            (o.filter ? ' filter="url(#' + o.filter + ')"' : ' stroke="' + (o.strokeColor ? col(o.strokeColor) : fill) + '" stroke-width="' + (o.strokeColor ? (o.w || 0.8) : 0.7) + '" stroke-linejoin="round"') + opa(wa) + "/>" });
          var nv = dot(n, V) < 0 ? [-n[0], -n[1], -n[2]] : n, lit = dot(nv, Lw);
          var lv = o.hatch !== undefined ? o.hatch : o.flat ? 0 : lit > 0.62 ? 2 : lit > 0.3 ? 1 : 0;
          if (lv && ha > 0.005) {
            var ai = o.hatchAngle !== undefined ? o.hatchAngle : Math.abs(nv[2]) > 0.7 ? 1 : nv[0] + nv[1] > 0 ? 0 : 2;
            items.push({ d: d, s: '<polygon points="' + pts2(pp) + '" fill="url(#hatch' + ai + lv + ')"' + opa(ha * (o.hatchOp || 1)) + "/>" });
          }
          if (o.stroke !== false && !o.strokeColor) {
            var w = (o.w || EDGE) * 0.95, sk = o.sk === undefined ? 1 : o.sk;
            if (pts.length > 8) skPath(pp, pts, true, w, T.line, op, sf, d, sk);
            else for (var e = 0; e < pts.length; e++) {
              var e2 = (e + 1) % pts.length, A = pts[e], B = pts[e2], sa = wseed(A), sb = wseed(B);
              if (sa <= sb) skLine(pp[e], pp[e2], sa * 0.731 + sb * 1.379, w, T.line, op, sf, d, sk);
              else skLine(pp[e2], pp[e], sb * 0.731 + sa * 1.379, w, T.line, op, sf, d, sk);
            }
          }
          return;
        }
        // o.holes: inner rings cut out of the face (even-odd fill)
        var shape = o.holes ? '<path fill-rule="evenodd" d="M' + pts2(pp) + "Z" + o.holes.map(function (h) { return "M" + pts2(h.map(P)) + "Z"; }).join("") + '"' : '<polygon points="' + pts2(pp) + '"';
        items.push({ d: d, s: shape + ' fill="' + fill + '"' +
          (o.fillOp !== undefined ? ' fill-opacity="' + o.fillOp + '"' : "") +
          (o.stroke === false ? "" : ' stroke="' + (o.strokeColor ? col(o.strokeColor) : T.line) + '" stroke-width="' + (o.w || EDGE) + '" stroke-linejoin="round"') +
          (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      line: function (a, b, o) { api.path([a, b], o); },
      path: function (pts, o) {
        o = o || {};
        if (o.op !== undefined && o.op <= 0.01) return;
        var pp = pts.map(P), d = 0;
        pp.forEach(function (q) { d += q[2]; });
        d = d / pp.length + (o.bias || 0);
        if (SK && !o.dash && !o.fill) {
          if (o.front) { d = Infinity; pp.forEach(function (q) { d = Math.min(d, q[2]); }); d += o.bias || 0; } // sort by its nearest point (rims)
          var op = o.op === undefined ? 1 : o.op, sk = o.sk === undefined ? 1 : o.sk, w = (o.w || 2) * 0.95, sf = inkStroke() * (o.draw === undefined ? 1 : o.draw);
          if (pts.length === 2) { var sa = wseed(pts[0]), sb = wseed(pts[1]); skLine(pp[0], pp[1], o.seed !== undefined ? o.seed : sa * 0.731 + sb * 1.379, w, col(o.color), op, sf, d, sk); }
          else skPath(pp, pts, !!o.closed, w, col(o.color), op, sf, d, sk, o.seed);
          return;
        }
        var tag = o.closed ? "polygon" : "polyline";
        items.push({ d: d, s: "<" + tag + ' points="' + pts2(pp) + '" fill="' + (o.fill ? col(o.fill) : "none") + '" stroke="' + col(o.color) +
          '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' +
          (o.dash ? ' stroke-dasharray="' + o.dash + '"' + (o.dashOff ? ' stroke-dashoffset="' + f1(o.dashOff) + '"' : "") : "") +
          (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      tube: function (a, b, o) { // rolled paper / straw: dark outline under a light core
        o = o || {};
        api.path([a, b], { color: T.line, w: (o.w || 7) + 3, op: o.op, bias: o.bias });
        api.path([a, b], { color: o.mat || "paper", w: o.w || 7, op: o.op, bias: (o.bias || 0) - 0.001 });
      },
      dot: function (p, r, mat, o) {
        o = o || {};
        if (o.op !== undefined && o.op <= 0.01) return;
        var q = P(p);
        if (SK) { // a wash disc and a pencil loop that goes round a bit more than once
          var dop = (o.op === undefined ? 1 : o.op), rx = r * (o.sx || 1), ry = r * (o.sy || 1), s0 = wseed(p), L = [];
          items.push({ d: q[2] + (o.bias || 0), s: '<ellipse cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="' + col(mat) + '"' + opa(dop * inkWash()) + "/>" });
          if (o.stroke !== false) {
            var a0 = hash(s0 + 1) * TAU, turns = 1.08 + 0.12 * hash(s0 + 2);
            for (var j = 0; j <= 14; j++) { var an = a0 + j / 14 * turns * TAU, rr = 1 + 0.07 * Math.sin(j * 1.7 + s0) + 0.04 * j / 14; L.push([q[0] + rx * rr * Math.cos(an), q[1] + ry * rr * Math.sin(an)]); }
            items.push({ d: q[2] + (o.bias || 0), s: '<path d="M' + L.map(function (z) { return nf(z[0]) + "," + nf(z[1]); }).join("L") + '" fill="none" stroke="' + (o.strokeColor ? col(o.strokeColor) : T.line) + '" stroke-width="' + nf((o.w || EDGE) * 0.9) + '" stroke-linecap="round" stroke-linejoin="round"' + dash(inkStroke()) + opa(dop) + "/>" });
          }
          return;
        }
        items.push({ d: q[2] + (o.bias || 0), s: '<ellipse cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" rx="' + f1(r * (o.sx || 1)) + '" ry="' + f1(r * (o.sy || 1)) + '" fill="' + col(mat) + '"' +
          (o.stroke === false ? "" : ' stroke="' + T.line + '" stroke-width="' + (o.w || EDGE) + '"') +
          (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      box8: function (C, mat, o) {
        o = o || {};
        var F = [[4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [3, 0, 4, 7], [1, 2, 6, 5], [0, 3, 2, 1]];
        var mats = o.mats || {};
        F.forEach(function (f, i) {
          api.poly(f.map(function (j) { return C[j]; }), i === 0 && o.top ? o.top : (mats[i] || mat), { cull: true, op: o.op, bias: o.bias, w: o.w });
        });
      },
      box: function (x, y, z, w, d, h, mat, o) {
        o = o || {};
        var C = [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z], [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
        if (o.tf) C = C.map(o.tf);
        api.box8(C, mat, o);
      },
      plank: function (a, b, t, y0, y1, mat, o) { // flat board in the x-z plane from a to b (2D points)
        var dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L * t / 2, nz = dx / L * t / 2;
        var q = [[a[0] - nx, a[1] - nz], [b[0] - nx, b[1] - nz], [b[0] + nx, b[1] + nz], [a[0] + nx, a[1] + nz]];
        var C = [[q[0][0], y0, q[0][1]], [q[1][0], y0, q[1][1]], [q[1][0], y1, q[1][1]], [q[0][0], y1, q[0][1]],
                 [q[3][0], y0, q[3][1]], [q[2][0], y0, q[2][1]], [q[2][0], y1, q[2][1]], [q[3][0], y1, q[3][1]]];
        if (o && o.tf) C = C.map(o.tf);
        // winding differs from box(); draw faces without culling but depth sorted
        var F = [[0, 1, 5, 4], [3, 2, 6, 7], [0, 1, 2, 3], [4, 5, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]];
        F.forEach(function (f) { api.poly(f.map(function (j) { return C[j]; }), mat, { op: o && o.op, bias: o && o.bias }); });
      },
      cyl: function (x, y, z, r, h, mat, o) {
        o = o || {};
        var n = o.seg || 16, top = [], i;
        for (i = 0; i < n; i++) {
          var a0 = i / n * TAU, a1 = (i + 1) / n * TAU;
          var p0 = [x + r * Math.cos(a0), y + r * Math.sin(a0)], p1 = [x + r * Math.cos(a1), y + r * Math.sin(a1)];
          api.poly([[p0[0], p0[1], z], [p1[0], p1[1], z], [p1[0], p1[1], z + h], [p0[0], p0[1], z + h]], mat, { cull: true, op: o.op, stroke: false, bias: o.bias });
          top.push([p0[0], p0[1], z + h]);
        }
        api.poly(top, o.top || mat, { cull: true, op: o.op, bias: o.bias, w: o.w });
        // silhouette
        var bot = [], i2;
        for (i2 = 0; i2 <= n; i2++) { var a = i2 / n * TAU; bot.push([x + r * Math.cos(a), y + r * Math.sin(a), z]); }
        api.path(bot, { color: T.line, w: o.w || EDGE, op: o.op, bias: (o.bias || 0) + 0.3 });
      },
      grid: function (ext, step, z) {
        z = z || 0;
        for (var g = -ext; g <= ext + 1e-6; g += step) {
          api.path([[g, -ext, z], [g, ext, z]], { color: T.grid, w: 1, bias: 100 });
          api.path([[-ext, g, z], [ext, g, z]], { color: T.grid, w: 1, bias: 100 });
        }
      },
      shadow: function (pts, op) { api.poly(pts, T.shadow, { flat: true, stroke: false, bias: 60, op: op }); },
      image: function (p0, p1, p2, href, o) { // map a unit image onto the parallelogram p0 -> p1 (u), p0 -> p2 (v)
        o = o || {};
        var a = P(p0), b = P(p1), c = P(p2);
        items.push({ d: (a[2] + b[2] + c[2]) / 3 + (o.bias || 0), s: '<image href="' + href + '" x="0" y="0" width="1" height="1" preserveAspectRatio="none" transform="matrix(' +
          [b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1], a[0], a[1]].map(function (n) { return n.toFixed(2); }).join(" ") + ')"' + (o.op !== undefined && o.op < 1 ? ' opacity="' + o.op.toFixed(3) + '"' : "") + "/>" });
      },
      screen: function (svg) { overlay.push(svg); },
      // raw SVG drawn at a world point, depth-sorted with everything else: fn(x, y) returns the markup in pixels
      glyph: function (p, fn, o) { var q = P(p); items.push({ d: q[2] + ((o && o.bias) || 0), s: fn(q[0], q[1], q[2]) }); },
      out: function () {
        items.sort(function (a, b) { return b.d - a.d; });
        return items.map(function (i) { return i.s; }).join("") + overlay.join("");
      }
    };
    return api;
  }

  function hull(points) { // 2D convex hull (monotone chain)
    var p = points.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [], i;
    for (i = 0; i < p.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
    for (i = p.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
    up.pop(); lo.pop();
    return lo.concat(up);
  }

  function boxShadow(g, x, y, w, d, h, dir, op) {
    var base = [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
    var all = base.concat(base.map(function (q) { return [q[0] + dir[0] * h, q[1] + dir[1] * h]; }));
    g.shadow(hull(all).map(function (q) { return [q[0], q[1], 0.001]; }), op);
  }

  // gable roof on a box
  function gable(g, x, y, z, w, d, rh, mat, o) {
    o = o || {};
    var r0 = [x - 0.08, y - 0.08, z], r1 = [x + w + 0.08, y - 0.08, z], r2 = [x + w + 0.08, y + d + 0.08, z], r3 = [x - 0.08, y + d + 0.08, z];
    var k0 = [x - 0.08, y + d / 2, z + rh], k1 = [x + w + 0.08, y + d / 2, z + rh];
    var tf = o.tf || function (p) { return p; };
    g.poly([r0, r1, k1, k0].map(tf), mat, { op: o.op });
    g.poly([r2, r3, k0, k1].map(tf), mat, { op: o.op });
    g.poly([[x, y, z], [x, y + d, z], [x, y + d / 2, z + rh]].map(tf), "paper", { op: o.op });
    g.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d / 2, z + rh]].map(tf), "paper", { op: o.op });
  }

  function circlePts(cx, cy, z, r, n, a0, a1) {
    var out = [];
    a0 = a0 || 0; a1 = a1 === undefined ? TAU : a1;
    for (var i = 0; i <= n; i++) { var a = lerp(a0, a1, i / n); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); }
    return out;
  }

  /* ------------------------------------------------------------------ scenes */
  var SC = {};

  // ---------- Explorers
  SC.solarcity = { cam: { yaw: 32, pitch: 32, S: 58, amp: 8 }, draw: function (g, t) {
    g.grid(5, 1);
    var B = [[-3.4, -1.6, 1.4, 1.4, 1.6, "paper", 1], [-1.6, -2.2, 1.2, 1.2, 2.6, "sky", 0], [-0.1, -1.4, 1.6, 1.2, 1.2, "paper", 1],
             [-2.2, 0.6, 1.4, 1.6, 2.0, "paper", 1], [0.1, 0.8, 1.2, 1.4, 3.0, "sky", 0], [1.8, -0.8, 1.4, 1.8, 1.8, "paper", 1]];
    var sa = lerp(-55, 55, eio(seg(t, 0.28, 0.9))) * RAD;
    var dir = [-Math.sin(sa) * 0.55, 0.45];
    B.forEach(function (b, i) {
      var a = ap(t, i, 0.04, 0.035, 0.14), h = b[4] * a;
      if (a <= 0) return;
      if (t > 0.24) boxShadow(g, b[0], b[1], b[2], b[3], h, dir, seg(t, 0.24, 0.34));
      g.box(b[0], b[1], 0, b[2], b[3], h, b[5]);
      if (b[6]) g.box(b[0] + 0.1, b[1] + 0.1, h, b[2] - 0.2, b[3] - 0.2, 0.12 * ap(t, i, 0.2, 0.03, 0.1), "zing", { op: ap(t, i, 0.2, 0.03, 0.1) });
    });
    var so = seg(t, 0.24, 0.32);
    var sun = [Math.sin(sa) * 4, -3.2, 5.2];
    g.dot(sun, 22, "zing", { op: so, bias: -50 });
    [[-2.7, -0.9, 1.6], [0.7, -0.8, 1.2], [2.5, 0.1, 1.8]].forEach(function (p, i) {
      g.line(sun, p, { color: "brand", w: 1.6, dash: "5 7", dashOff: -t * 120 * 3, op: so * 0.8, bias: -40 });
    });
    for (var k = 0; k < 3; k++) {
      var pts = [];
      for (var x = -4.6; x <= 4.6; x += 0.4) pts.push([x, -3 + k * 0.5, 0.25 + 0.12 * Math.sin(x * 1.4 + k)]);
      g.path(pts, { color: "brand", w: 1.6, dash: "10 12", dashOff: -t * 22 * 12, op: seg(t, 0.35, 0.45) * 0.7, bias: 40 });
    }
  } };

  SC.stilts = { cam: { yaw: 28, pitch: 26, S: 62, amp: 7 }, draw: function (g, t) {
    // tide basin
    var bw = 3.8, bd = 2.6;
    g.box(-bw, -bd, 0, bw * 2, bd * 2, 0.08, "foil", { op: ap(t, 0, 0.03, 0, 0.1) });
    var lvl = lerp(0.15, 1.05, eio(seg(t, 0.3, 0.62))) - 0.6 * eio(seg(t, 0.72, 0.9));
    var wave = function (x, y) { return lvl + 0.07 * Math.sin(x * 2.2 + t * TAU * 3) + 0.04 * Math.cos(y * 3 - t * TAU * 3); };
    // stilts + house
    var a1 = ap(t, 0, 0.08, 0, 0.14), a2 = ap(t, 0, 0.16, 0, 0.14), a3 = ap(t, 0, 0.22, 0, 0.12);
    var sway = 0.05 * Math.sin(t * TAU * 4) * seg(t, 0.4, 0.5) * (1 - seg(t, 0.8, 0.9));
    var tf = function (p) { return [p[0] + sway * p[2] / 2.4, p[1], p[2]]; };
    [[-1.2, -0.8], [1.2, -0.8], [-1.2, 0.8], [1.2, 0.8], [0, -0.8], [0, 0.8]].forEach(function (s, i) {
      var top = 1.6 * a1;
      g.box(s[0] - 0.08, s[1] - 0.08, 0, 0.16, 0.16, top, "wood", { tf: tf });
    });
    if (a2 > 0) {
      g.box(-1.5, -1.1, 1.6 + (1 - a2) * 1.2, 3, 2.2, 1.3, "paper", { op: a2, tf: tf });
      gable(g, -1.5, -1.1, 2.9 + (1 - a3) * 1.2, 3, 2.2, 1.0, "zing", { op: a3, tf: tf });
    }
    // water surface
    var N = 10, wo = seg(t, 0.12, 0.2);
    for (var i = 0; i < N; i++) {
      var x0 = -bw + i * (2 * bw / N), x1 = x0 + 2 * bw / N;
      g.poly([[x0, -bd, wave(x0, -bd)], [x1, -bd, wave(x1, -bd)], [x1, bd, wave(x1, bd)], [x0, bd, wave(x0, bd)]], "water", { flat: true, stroke: false, fillOp: 0.55, op: wo, bias: -0.5 });
    }
    var edge = [];
    for (var x = -bw; x <= bw + 0.01; x += 0.25) edge.push([x, -bd, wave(x, -bd)]);
    g.path(edge, { color: "brand", w: 2, op: wo, bias: -8 });
    // storm wind
    for (var k = 0; k < 3; k++) {
      var off = frac(t * 2 + k / 3);
      g.line([-5.5 + off * 3, -0.5 + k * 0.6, 3.2 + k * 0.3], [-4.5 + off * 3, -0.5 + k * 0.6, 3.2 + k * 0.3], { color: "brand", w: 2.4, op: seg(t, 0.4, 0.5) * (1 - seg(t, 0.8, 0.88)) * Math.sin(off * Math.PI), bias: -20 });
    }
  } };

  SC.dome = { cam: { yaw: 20, pitch: 24, S: 70, spin: 72 }, draw: function (g, t) {
    g.grid(4, 1);
    var R = 2.5, rings = [[0, 10, 0], [30, 10, 18], [58, 5, 0], [90, 1, 0]];
    var P = rings.map(function (r) {
      var out = [], el = r[0] * RAD;
      for (var j = 0; j < r[1]; j++) { var az = (j / r[1] * 360 + r[2]) * RAD; out.push([R * Math.cos(el) * Math.cos(az), R * Math.cos(el) * Math.sin(az), R * Math.sin(el)]); }
      return out;
    });
    function near(p, arr, k) { return arr.map(function (q, i) { return [Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]), i]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, k).map(function (x) { return arr[x[1]]; }); }
    var edges = [];
    P.forEach(function (ring, ri) {
      if (ring.length > 1) ring.forEach(function (p, j) { edges.push([ri, p, ring[(j + 1) % ring.length]]); });
      if (ri < P.length - 1) ring.forEach(function (p) { near(p, P[ri + 1], P[ri + 1].length > 1 ? 2 : 1).forEach(function (q) { edges.push([ri + 0.5, p, q]); }); });
    });
    // translucent panels on the lowest band
    P[0].forEach(function (p, j) {
      var q = P[0][(j + 1) % 10], u = near([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 1], P[1], 1)[0];
      var a = ap(t, j, 0.5, 0.025, 0.1);
      if (a > 0) g.poly([p, q, u], j % 2 ? "sky" : "paper", { op: a * 0.85, stroke: false });
    });
    edges.forEach(function (e, i) {
      var a = ap(t, e[0], 0.05, 0.1, 0.14);
      if (a <= 0) return;
      var b = [lerp(e[1][0], e[2][0], a), lerp(e[1][1], e[2][1], a), lerp(e[1][2], e[2][2], a)];
      g.line(e[1], b, { w: 2.6, bias: -0.2 });
    });
    P.forEach(function (ring, ri) { ring.forEach(function (p) { var a = ap(t, ri, 0.08, 0.1, 0.1); g.dot(p, 6, "zing", { op: a, bias: -0.4 }); }); });
  } };

  SC.rain = { cam: { yaw: 34, pitch: 24, S: 64, amp: 6, z: 1.2 }, draw: function (g, t) {
    g.grid(4, 1);
    var a0 = ap(t, 0, 0.04, 0, 0.14), a1 = ap(t, 0, 0.12, 0, 0.12), a2 = ap(t, 0, 0.2, 0, 0.12);
    g.box(-1.6, -1, 0, 3.2, 2, 1.6 * a0, "paper");
    if (a1 > 0) gable(g, -1.6, -1, 1.6 + (1 - a1), 3.2, 2, 1.0, "paper", { op: a1 });
    g.box(-1.8, -1.25, 1.45, 3.6 * a2, 0.22, 0.14, "zing", { op: a2 });
    g.box(1.72, -1.2, 0.5, 0.12, 0.12, 1.0 * a2, "zing", { op: a2 });
    var cupA = ap(t, 0, 0.26, 0, 0.1);
    var lvl = 0.5 * eio(seg(t, 0.36, 0.86));
    if (cupA > 0) {
      g.cyl(1.78, -1.14, 0, 0.42, 0.55, "sky", { op: cupA * 0.55 });
      if (lvl > 0.02) g.cyl(1.78, -1.14, 0, 0.36, lvl, "water", { op: cupA * 0.9 });
    }
    var ro = seg(t, 0.3, 0.38) * (1 - seg(t, 0.82, 0.9));
    for (var i = 0; i < 22; i++) {
      var x = -2.2 + hash(i) * 4.4, y = -1.6 + hash(i + 40) * 3.2, ph = frac(t * 3 + hash(i + 90));
      var z = 5.2 - ph * 3.4;
      g.line([x, y, z], [x, y, z + 0.35], { color: "brand", w: 2, op: ro * Math.min(1, (1 - ph) * 4), bias: -30 });
    }
    // water running down the pipe
    g.line([1.78, -1.14, 1.45], [1.78, -1.14, 0.55], { color: "water", w: 3, dash: "6 8", dashOff: t * 14 * 20, op: ro, bias: -6 });
  } };

  SC.corridor = { cam: { yaw: 24, pitch: 22, S: 54, amp: 6, z: 1.15 }, draw: function (g, t) {
    g.grid(5, 1);
    var a0 = ap(t, 0, 0.04, 0, 0.14), a1 = ap(t, 0, 0.1, 0, 0.14), a2 = ap(t, 0, 0.2, 0, 0.16);
    g.box(-4, -1.2, 0, 2, 2.4, 3.2 * a0, "paper");
    g.box(2, -1.2, 0, 2, 2.4, 4.2 * a1, "paper");
    g.box(-2, -0.6, 2.1, 4 * a2, 1.2, 0.3, "zing", { op: a2 });
    var trees = [[-1.5, 0], [-0.5, 0.2], [0.5, -0.1], [1.5, 0.15]];
    trees.forEach(function (p, i) { var a = back(seg(t, 0.32 + i * 0.04, 0.42 + i * 0.04)); if (a > 0) { g.line([p[0], p[1], 2.4], [p[0], p[1], 2.4 + 0.5 * a], { w: 2 }); g.dot([p[0], p[1], 2.4 + 0.75 * a], 16 * a, i % 2 ? "zing" : "sky"); } });
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) {
      var a = ap(t, r * 3 + c, 0.38, 0.018, 0.08);
      g.dot([2, -0.8 + c * 0.8, 0.6 + r * 0.9], 7 * a, "zing", { op: a, bias: -2 });
      g.dot([-2, -0.8 + c * 0.8, 0.5 + r * 0.7], 6 * a, "sky", { op: a, bias: -2 });
    }
    var ba = ap(t, 0, 0.3, 0, 0.1);
    if (ba > 0) { g.box(-3.3, -1.25, 3.2, 0.5, 0.4, 0.5, "paper", { op: ba }); gable(g, -3.3, -1.25, 3.7, 0.5, 0.4, 0.3, "zing", { op: ba }); }
    for (var b = 0; b < 3; b++) {
      var ph = frac(t * 1 + b / 3), x = lerp(-5, 5, ph), z = 4.6 + b * 0.4 + 0.2 * Math.sin(ph * TAU), fl = 0.18 * Math.sin(t * TAU * 10 + b);
      var bo = seg(t, 0.3, 0.4) * (1 - seg(t, 0.84, 0.9)) * Math.sin(ph * Math.PI);
      g.path([[x - 0.3, 0.5, z + fl], [x, 0.5, z], [x + 0.3, 0.5, z + fl]], { w: 2.2, op: bo, bias: -30 });
    }
  } };

  SC.city = { cam: { yaw: 30, pitch: 48, S: 50, amp: 5 }, draw: function (g, t) {
    g.box(-5, -4, -0.12, 10, 8, 0.12, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var river = [];
    for (var x = -5; x <= 5.01; x += 0.5) river.push([x, -3.1 + 0.25 * Math.sin(x * 0.9), 0.01]);
    var riverB = river.slice().reverse().map(function (p) { return [p[0], p[1] + 1.0, 0.01]; });
    g.poly(river.concat(riverB), "water", { flat: true, stroke: false, op: ap(t, 0, 0.06, 0, 0.1), bias: -0.2 });
    var types = ["home", "shop", "park", "home", "park", "shop", "home", "home", "shop"];
    var i = 0;
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++, i++) {
      var bx = -4.2 + c * 3, by = -1.2 + r * 1.8, a = ap(t, i, 0.1, 0.035, 0.12), ty = types[i];
      if (a <= 0) continue;
      if (ty === "park") {
        g.box(bx, by, 0, 2.4, 1.4, 0.06, "zing", { op: a });
        for (var k = 0; k < 3; k++) { var ta = back(seg(t, 0.45 + k * 0.03 + i * 0.01, 0.55 + k * 0.03 + i * 0.01)); if (ta > 0) g.dot([bx + 0.5 + k * 0.7, by + 0.7, 0.35 * ta], 10 * ta, "paper"); }
      } else if (ty === "shop") {
        g.box(bx + 0.1, by + 0.1, 0, 2.2, 1.2, 0.9 * a, "sky");
      } else {
        g.box(bx + 0.1, by + 0.1, 0, 1, 1.2, 0.7 * a, "paper");
        g.box(bx + 1.3, by + 0.1, 0, 1, 1.2, 1.1 * a, "paper");
      }
    }
    var ba = ap(t, 0, 0.36, 0, 0.12);
    g.box(-0.5, -3.3, 0.02, 1.0 * ba, 1.4, 0.12, "paper", { op: ba });
    for (var cI = 0; cI < 3; cI++) {
      var ph = frac(t * 2 + cI / 3);
      g.dot([lerp(-4.8, 4.8, ph), -1.45 + (cI % 2) * 1.8 + 0.9, 0.1], 5, cI === 1 ? "zing" : "brand", { op: seg(t, 0.4, 0.5) * (1 - seg(t, 0.84, 0.9)), stroke: false, bias: -1 });
    }
  } };

  SC.boat = { cam: { yaw: 28, pitch: 28, S: 70, amp: 6 }, draw: function (g, t) {
    var coins = Math.floor(seg(t, 0.3, 0.76) * 9 + 0.0001);
    var sink = 0.04 * coins + 0.5 * eio(seg(t, 0.78, 0.9));
    var bob = 0.05 * Math.sin(t * TAU * 3);
    var za = 0.22 - sink + bob, ha = ap(t, 0, 0.08, 0, 0.16);
    var tilt = 0.04 * Math.sin(t * TAU * 2);
    var tf = function (p) { var q = rotX(p, [0, 0, za], tilt); return [q[0], q[1], q[2] + za]; };
    if (ha > 0) {
      var b = [[-1.2, -0.65, 0], [1.2, -0.65, 0], [1.2, 0.65, 0], [-1.2, 0.65, 0]];
      var tp = [[-1.6, -0.95, 0.5 * ha], [1.6, -0.95, 0.5 * ha], [1.6, 0.95, 0.5 * ha], [-1.6, 0.95, 0.5 * ha]];
      g.poly(b.map(tf), "foil", { op: ha });
      for (var i = 0; i < 4; i++) g.poly([b[i], b[(i + 1) % 4], tp[(i + 1) % 4], tp[i]].map(tf), "foil", { op: ha });
      for (var cI = 0; cI < 9; cI++) {
        var dropT = seg(t, 0.3 + cI * 0.051, 0.36 + cI * 0.051);
        if (dropT <= 0) continue;
        var cx = -0.7 + (cI % 3) * 0.7, cy = -0.3 + Math.floor(cI / 3) * 0.3;
        var cz = 0.06 + (1 - eo(dropT)) * 2.4;
        var p = tf([cx, cy, cz]);
        g.cyl(p[0], p[1], p[2], 0.2, 0.06, "zing", { seg: 12 });
      }
    }
    // water
    var N = 12, W = 4.4;
    for (var k = 0; k < N; k++) {
      var x0 = -W + k * 2 * W / N, x1 = x0 + 2 * W / N;
      var hw = function (x) { return 0.06 * Math.sin(x * 1.8 - t * TAU * 3); };
      g.poly([[x0, -2.6, hw(x0)], [x1, -2.6, hw(x1)], [x1, 2.6, hw(x1)], [x0, 2.6, hw(x0)]], "water", { flat: true, stroke: false, fillOp: 0.5, op: ap(t, 0, 0.02, 0, 0.1), bias: 2 });
    }
    for (var w = 0; w < 3; w++) {
      var pts = [];
      for (var x = -W; x <= W; x += 0.25) pts.push([x, -2 + w * 1.6, 0.02 + 0.06 * Math.sin(x * 1.8 - t * TAU * 3)]);
      g.path(pts, { color: "brand", w: 1.8, op: ap(t, 0, 0.04, 0, 0.1) * 0.8, bias: w === 0 ? -3 : 3 });
    }
  } };

  SC.column = { cam: { yaw: 26, pitch: 22, S: 62, amp: 10 }, draw: function (g, t) {
    g.grid(4, 1);
    var books = Math.floor(seg(t, 0.4, 0.8) * 4 + 0.0001);
    var H = 3.2 * ap(t, 0, 0.06, 0, 0.3) * (1 - 0.018 * books);
    var n = 16, ring = [];
    for (var i = 0; i < n; i++) { var a = i / n * TAU, r = i % 2 ? 0.55 : 0.85; ring.push([r * Math.cos(a), r * Math.sin(a)]); }
    if (H > 0.02) {
      for (var j = 0; j < n; j++) {
        var p = ring[j], q = ring[(j + 1) % n];
        var nrm = [(p[1] + q[1]) / 2, -(p[0] + q[0]) / 2];
        g.poly([[p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], H], [p[0], p[1], H]], "paper", { cull: false, bias: 0 });
      }
      g.poly(ring.map(function (p) { return [p[0], p[1], H]; }), "paper", {});
    }
    var mats = ["paper", "zing", "sky", "paper"];
    for (var b = 0; b < 4; b++) {
      var d = seg(t, 0.4 + b * 0.1, 0.47 + b * 0.1);
      if (d <= 0) continue;
      var z = H + b * 0.34 + (1 - eo(d)) * 3;
      g.box(-1.3 + b * 0.06, -0.9 - b * 0.05, z, 2.6, 1.8, 0.32, mats[b], { tf: function (p) { return rotZ(p, [0, 0, 0], (b - 1.5) * 0.12); } });
    }
  } };

  SC.mobile = { cam: { yaw: 18, pitch: 12, S: 70, amp: 0, z: 1.0 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.05, 0, 0.14), top = [0, 0, 4.4];
    var A1 = 0.5 * Math.sin(t * TAU), A2 = -0.8 * Math.sin(t * TAU + 1.2), A3 = 0.9 * Math.sin(t * TAU * 2 + 0.5);
    g.line([0, 0, 5.2], top, { w: 2, op: a0 });
    var bar1a = rotZ([-2.2, 0, 4.4], top, A1), bar1b = rotZ([1.8, 0, 4.4], top, A1);
    g.line(bar1a, bar1b, { w: 3, op: a0 });
    g.dot(top, 5, "paper", { op: a0 });
    var a1 = ap(t, 0, 0.14, 0, 0.12);
    var p2 = [bar1a[0], bar1a[1], 3.3];
    g.line(bar1a, p2, { w: 1.6, op: a1 });
    var b2a = rotZ([p2[0] - 1.2, p2[1], 3.3], p2, A2), b2b = rotZ([p2[0] + 1.0, p2[1], 3.3], p2, A2);
    g.line(b2a, b2b, { w: 2.6, op: a1 });
    g.dot(p2, 4, "paper", { op: a1 });
    function cup(p, mat, a, spin) {
      var z = p[2] - 1.0;
      g.line(p, [p[0], p[1], z + 0.35], { w: 1.4, op: a });
      g.cyl(p[0], p[1], z - 0.2, 0.28, 0.55, mat, { op: a, seg: 12 });
    }
    cup(b2a, "sky", ap(t, 0, 0.2, 0, 0.1));
    cup(b2b, "paper", ap(t, 0, 0.24, 0, 0.1));
    var a3 = ap(t, 0, 0.28, 0, 0.1), p3 = [bar1b[0], bar1b[1], 3.0];
    g.line(bar1b, p3, { w: 1.4, op: a3 });
    var b3a = rotZ([p3[0] - 0.6, p3[1], 3.0], p3, A3), b3b = rotZ([p3[0] + 0.6, p3[1], 3.0], p3, A3);
    g.line(b3a, b3b, { w: 2.4, op: a3 });
    cup(b3a, "zing", a3); cup(b3b, "sky", a3);
    for (var k = 0; k < 3; k++) {
      var pts = [], off = t * TAU * 2 + k;
      for (var x = -4.4; x <= -2.6; x += 0.15) pts.push([x, 0, 1.2 + k * 0.5 + 0.12 * Math.sin(x * 4 + off)]);
      g.path(pts, { color: "brand", w: 2, op: seg(t, 0.3, 0.4) * (1 - seg(t, 0.85, 0.9)) * 0.8 });
    }
  } };

  SC.rube = { cam: { yaw: 8, pitch: 14, S: 58, amp: 0 }, draw: function (g, t) {
    g.box(-5, -0.8, -0.1, 10, 1.6, 0.1, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var ra = ap(t, 0, 0.05, 0, 0.12);
    g.plank([-4.6, 2.6], [-2.2, 1.2], 0.12, -0.3, 0.3, "wood", { op: ra });
    g.box(-4.8, -0.3, 0, 0.3, 0.6, 2.6 * ra, "paper", { op: ra });
    // ball
    var br = 0.22, bp;
    var r1 = seg(t, 0.14, 0.3), r2 = seg(t, 0.3, 0.38);
    if (t < 0.3) bp = [lerp(-4.4, -2.2, r1 * r1), 0, lerp(2.72, 1.32, r1 * r1) + br * 0.3];
    else bp = [lerp(-2.2, -1.45, r2), 0, lerp(1.32, br, eo(r2)) + (1 - r2) * 0.0];
    g.dot(bp, 14, "zing", { op: seg(t, 0.08, 0.14), bias: -3 });
    // dominoes
    for (var i = 0; i < 6; i++) {
      var x0 = -1.2 + i * 0.55, fall = eio(seg(t, 0.38 + i * 0.035, 0.44 + i * 0.035)) * 1.2;
      var piv = [x0 + 0.16, 0, 0];
      g.box(x0, -0.35, 0, 0.16, 0.7, 1.0 * ap(t, i, 0.1, 0.02, 0.1), i % 2 ? "sky" : "paper", { tf: function (p) { return rotY(p, piv, fall); } });
    }
    // lever + bell
    var hit = seg(t, 0.62, 0.66);
    g.box(2.35, -0.3, 0, 0.2, 0.6, 1.2, "paper", { op: ap(t, 0, 0.16, 0, 0.1) });
    var bellSwing = 0.35 * Math.sin((t - 0.66) * TAU * 5) * seg(t, 0.66, 0.68) * (1 - seg(t, 0.66, 0.86));
    var bt = [3.6, 0, 3.2];
    g.line([3.6, 0, 3.8], bt, { w: 2, op: ap(t, 0, 0.18, 0, 0.1) });
    var bell = [[-0.45, 0, 2.2], [0.45, 0, 2.2], [0.3, 0, 2.7], [0.18, 0, 3.1], [-0.18, 0, 3.1], [-0.3, 0, 2.7]].map(function (p) { return rotY([p[0] + 3.6, p[1], p[2]], bt, bellSwing); });
    g.poly(bell, "zing", { op: ap(t, 0, 0.18, 0, 0.1) });
    g.plank([2.1, 1.0], [3.4, 2.1 + 0.2 * hit], 0.08, -0.2, 0.2, "wood", { op: ap(t, 0, 0.2, 0, 0.1) });
    for (var w = 0; w < 3; w++) {
      var ph = seg(t, 0.66 + w * 0.05, 0.8 + w * 0.05);
      if (ph > 0 && ph < 1) g.screen("");
      var q = g.P([3.6, 0, 2.6]);
      if (ph > 0 && ph < 1) g.screen('<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="' + f1(30 + ph * 90) + '" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="2" opacity="' + (1 - ph).toFixed(3) + '"/>');
    }
  } };

  SC.davinci = { cam: { yaw: 28, pitch: 22, S: 60, amp: 8, z: 1.25 }, draw: function (g, t) {
    g.grid(5, 1);
    var N = 7, R = 3.1, half = 62 * RAD, cz = -1.3;
    var P = [];
    for (var i = 0; i < N; i++) { var an = Math.PI / 2 + half - i * (2 * half / (N - 1)); P.push([R * Math.cos(an), cz + R * Math.sin(an)]); }
    var order = [], i2;
    for (i2 = 0; i2 < N; i2++) order.push(["t", i2]);
    var sticks = [];
    for (i2 = 0; i2 < N - 2; i2++) sticks.push(i2);
    var load = eo(seg(t, 0.66, 0.72)), sag = 0.05 * load * (1 + 0.5 * Math.sin((t - 0.72) * TAU * 5) * seg(t, 0.72, 0.74) * (1 - seg(t, 0.72, 0.86)));
    function Pz(k) { return [P[k][0], P[k][1] - sag * Math.sin(Math.PI * k / (N - 1))]; }
    // longitudinal sticks: each spans two bays, alternating over/under and outer/inner pairs
    sticks.forEach(function (k, n) {
      var a = ap(t, n, 0.08, 0.07, 0.1);
      if (a <= 0) return;
      var A = Pz(k), B = Pz(k + 2), even = k % 2 === 0;
      var ext = 0.25, dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz);
      var A2 = [A[0] - dx / L * ext, A[1] - dz / L * ext + (even ? 0.07 : -0.07)], B2 = [B[0] + dx / L * ext, B[1] + dz / L * ext + (even ? 0.07 : -0.07)];
      var ys = even ? [[-0.75, -0.6], [0.6, 0.75]] : [[-0.4, -0.25], [0.25, 0.4]];
      var drop = (1 - a) * 1.6;
      ys.forEach(function (yy) { g.plank([A2[0], A2[1] + drop], [B2[0], B2[1] + drop], 0.13, yy[0], yy[1], "wood", { op: a }); });
    });
    // transverse cross sticks at every node
    for (var j = 0; j < N; j++) {
      var a2 = ap(t, j, 0.1, 0.06, 0.1);
      if (a2 <= 0) continue;
      var q = Pz(j), lift = (1 - a2) * 1.4, zOff = j % 2 === 0 ? -0.06 : 0.06;
      g.box(q[0] - 0.07, -0.95, q[1] + zOff - 0.07 + lift, 0.14, 1.9, 0.14, j === 3 ? "zing" : "wood", { op: a2 });
    }
    if (load > 0) { var top = Pz(3); g.cyl(top[0], 0, top[1] + 0.1 + (1 - load) * 2.2, 0.28, 0.9, "sky", { top: "brand" }); }
    g.line([P[0][0], -1.4, 0.02], [P[N - 1][0], -1.4, 0.02], { color: "brand", w: 2, op: seg(t, 0.4, 0.5), bias: 30 });
  } };

  // ---------- Creators
  SC.truss = { cam: { yaw: 22, pitch: 22, S: 58, amp: 7 }, draw: function (g, t) {
    g.grid(5, 1);
    var sa = ap(t, 0, 0.03, 0, 0.12);
    g.box(-4.4, -1, 0, 1.2, 2, 1.8 * sa, "paper");
    g.box(3.2, -1, 0, 1.2, 2, 1.8 * sa, "paper");
    var load = eo(seg(t, 0.62, 0.7)), sag = 0.18 * load * (1 + 0.25 * Math.sin((t - 0.7) * TAU * 6) * seg(t, 0.7, 0.72) * (1 - seg(t, 0.7, 0.82)));
    function Z(x, z) { return z - sag * Math.sin(Math.PI * clamp((x + 3.2) / 6.4)); }
    var xs = [-3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2];
    var mem = [];
    [-0.55, 0.55].forEach(function (y) {
      for (var i = 0; i < xs.length - 1; i++) {
        mem.push([[xs[i], y, 1.8], [xs[i + 1], y, 1.8]]);
        var up = i % 2 === 0;
        mem.push([[xs[i], y, up ? 1.8 : 2.8], [xs[i + 1], y, up ? 2.8 : 1.8]]);
        if (i > 0 && i < xs.length - 2 && i % 2 === 1) mem.push([[xs[i], y, 2.8], [xs[i + 2], y, 2.8]]);
      }
    });
    for (var c = 0; c < xs.length; c += 2) mem.push([[xs[c], -0.55, 1.8], [xs[c], 0.55, 1.8]]);
    mem.forEach(function (m, i) {
      var a = ap(t, i, 0.1, 0.012, 0.06);
      if (a <= 0) return;
      var A = [m[0][0], m[0][1], Z(m[0][0], m[0][2])], B0 = [m[1][0], m[1][1], Z(m[1][0], m[1][2])];
      var B = [lerp(A[0], B0[0], a), lerp(A[1], B0[1], a), lerp(A[2], B0[2], a)];
      g.tube(A, B, { w: 4, mat: "sky" });
    });
    xs.forEach(function (x, i) { var a = ap(t, i, 0.14, 0.03, 0.1); [-0.55, 0.55].forEach(function (y) { g.dot([x, y, Z(x, 1.8)], 5, "zing", { op: a, bias: -0.1 }); }); });
    if (load > 0) g.box(-0.45, -0.45, Z(0, 1.8) + 0.02 + (1 - load) * 2.5, 0.9, 0.9, 0.7, "zing");
    g.line([-3.2, -1.3, 0.05], [3.2, -1.3, 0.05], { color: "brand", w: 1.6, op: seg(t, 0.3, 0.4), bias: 20 });
  } };

  SC.tiles = { cam: { yaw: 0, pitch: 90, S: 56, amp: 0 }, draw: function (g, t) {
    var cols = 7, rows = 5, s = 1.1, x0 = -cols * s / 2, y0 = -rows * s / 2;
    var flip = seg(t, 0.55, 0.8);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var i = r * cols + c, a = back(seg(t, 0.05 + i * 0.012, 0.12 + i * 0.012));
      if (a <= 0) continue;
      var ori = (hash(i * 3.1) > 0.5 ? 1 : 0);
      var wave = clamp(flip * 2.2 - (c + r) / (cols + rows) * 1.2);
      var ang = (ori + eio(wave)) * Math.PI / 2;
      var cx = x0 + c * s + s / 2, cy = y0 + r * s + s / 2, h = s / 2 * a;
      var sq = [[-h, -h], [h, -h], [h, h], [-h, h]].map(function (p) { return [cx + p[0], cy + p[1], 0]; });
      g.poly(sq, (c + r) % 5 === 0 ? "zing" : "paper", { flat: true, w: 1.2, strokeColor: "foil", bias: 5 });
      [[-1, -1], [1, 1]].forEach(function (corner) {
        var cc = rotZ([cx + corner[0] * h, cy + corner[1] * h, 0], [cx, cy, 0], ang);
        var start = corner[0] < 0 ? 0 : Math.PI;
        g.path(circlePts(cc[0], cc[1], 0, h, 10, start + ang, start + ang + Math.PI / 2), { w: 5 * a, color: "ink", bias: -1 });
      });
    }
    var cur = Math.min(cols * rows - 1, Math.floor(seg(t, 0.05, 0.47) * cols * rows));
    var sr = Math.floor(cur / cols), sc = cur % cols, so = seg(t, 0.04, 0.08) * (1 - seg(t, 0.47, 0.52));
    var hx = x0 + sc * s, hy = y0 + sr * s;
    g.path([[hx - 0.05, hy - 0.05, 0], [hx + s + 0.05, hy - 0.05, 0], [hx + s + 0.05, hy + s + 0.05, 0], [hx - 0.05, hy + s + 0.05, 0]], { closed: true, color: "brand", w: 4, op: so, bias: -10 });
  } };

  SC.facade = { cam: { yaw: 22, pitch: 10, S: 50, amp: 7, z: 1.25 }, draw: function (g, t) {
    var cols = 4, rows = 3, s = 1.35, x0 = -cols * s / 2, z0 = 0.35, yF = -0.02;
    var a0 = ap(t, 0, 0.03, 0, 0.14);
    var href = g.T === THEMES.dark ? FACADE_SKY : FACADE_INK;
    g.grid(5, 1);
    g.box(x0 - 0.2, 0, 0, cols * s + 0.4, 2.2, (rows * s + 0.7) * a0, "paper", { op: a0 });
    function tile(c, r, a) {
      var k = Math.floor(hash(r * 13 + c * 7 + 3) * 4), ang = k * Math.PI / 2;
      var cx = x0 + c * s + s / 2, cz = z0 + r * s + s / 2;
      function M(u, v) {
        var du = (u - 0.5) * s * a, dv = (v - 0.5) * s * a, cs = Math.cos(ang), sn = Math.sin(ang);
        return [cx + du * cs - dv * sn, yF, cz - (du * sn + dv * cs)];
      }
      g.image(M(0, 0), M(1, 0), M(0, 1), href, { bias: -41 });
    }
    var n = cols * rows, done = Math.floor(seg(t, 0.14, 0.58) * n);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var i = r * cols + c, a = back(seg(t, 0.14 + i / n * 0.44, 0.17 + i / n * 0.44));
      if (a > 0) tile(c, rows - 1 - r, a);
    }
    var so = seg(t, 0.12, 0.16) * (1 - seg(t, 0.58, 0.62));
    if (so > 0 && done < n) {
      var sr = Math.floor(done / cols), sc = done % cols, cx = x0 + sc * s + s / 2, cz = z0 + (rows - 1 - sr) * s + s / 2;
      var hop = 0.5 * Math.abs(Math.sin(seg(t, 0.14, 0.58) * n * Math.PI));
      g.box(cx - s * 0.48, yF - 0.35 - hop, cz - s * 0.48, s * 0.96, 0.3, s * 0.96, "sky", { op: so, bias: -60 });
      g.box(cx - 0.12, yF - 1.05 - hop, cz - 0.12, 0.24, 0.7, 0.24, "zing", { op: so, bias: -61 });
    }
    var sw = seg(t, 0.62, 0.86), lo = Math.sin(sw * Math.PI) * 0.45;
    if (lo > 0.01) {
      var lx = lerp(x0 - 1.2, x0 + cols * s + 0.4, sw);
      g.poly([[lx, yF - 0.05, z0 - 0.1], [lx + 1.0, yF - 0.05, z0 - 0.1], [lx + 1.6, yF - 0.05, z0 + rows * s + 0.1], [lx + 0.6, yF - 0.05, z0 + rows * s + 0.1]], "zing", { flat: true, stroke: false, op: lo, bias: -45 });
    }
  } };

  function windScene(layout, fanColor) {
    return { cam: { yaw: 30, pitch: 26, S: 54, amp: 6 }, draw: function (g, t) {
      g.grid(5, 1);
      layout.forEach(function (b, i) {
        var a = ap(t, i, 0.05, 0.04, 0.14);
        if (a <= 0) return;
        if (b.k === "box") g.box(b.x, b.y, 0, b.w, b.d, b.h * a, b.m);
        else if (b.k === "cyl") g.cyl(b.x, b.y, 0, b.r, b.h * a, b.m);
        else if (b.k === "twist") for (var j = 0; j < 8; j++) { if (j / 8 > a) break; g.box(-b.w / 2, -b.w / 2, j * b.h / 8, b.w, b.w, b.h / 8, b.m, { tf: function (p) { return rotZ([p[0] + b.x, p[1] + b.y, p[2]], [b.x, b.y, 0], j * 0.12); } }); }
      });
      var fa = ap(t, 0, 0.2, 0, 0.1), fc = [-4.4, -0.6, 1.6], phi = -68 * RAD;
      var e1 = [-Math.sin(phi), Math.cos(phi), 0];
      function F(r, a) { return [fc[0] + r * Math.cos(a) * e1[0], fc[1] + r * Math.cos(a) * e1[1], fc[2] + r * Math.sin(a)]; }
      g.line([fc[0], fc[1], 0], [fc[0], fc[1], fc[2] - 1.0], { w: 3, op: fa, bias: 1 });
      g.poly(circlePts(0, 0, 0, 0.5, 12).map(function (p) { return [fc[0] + p[0], fc[1] + p[1], 0.02]; }), "paper", { op: fa, bias: 1 });
      var ring = []; for (var q = 0; q <= 28; q++) ring.push(F(1.05, q / 28 * TAU));
      g.path(ring, { w: 3, op: fa, fill: fanColor, bias: -2 });
      var spin = t * TAU * 5;
      for (var k = 0; k < 3; k++) {
        var b = spin + k * TAU / 3;
        g.poly([F(0.14, b - 0.55), F(0.92, b - 0.28), F(0.96, b + 0.12), F(0.2, b + 0.35)], "paper", { op: fa, flat: true, bias: -2.5 });
      }
      g.dot(F(0, 0), 7, "ink", { op: fa, bias: -3 });
      var wo = seg(t, 0.3, 0.4) * (1 - seg(t, 0.84, 0.9));
      for (var sI = 0; sI < 7; sI++) {
        var y = -2.4 + sI * 0.8, z = 0.6 + (sI % 3) * 0.7, pts = [];
        for (var x = -3.6; x <= 4.8; x += 0.2) {
          var push = 0;
          layout.forEach(function (b) { var bx = b.x + (b.w || 0) / 2, by = b.y + (b.d || b.w || 0) / 2; var dd = Math.hypot(x - bx, y - by); push += 0.9 * Math.exp(-dd * dd * 1.4) * Math.sign(y - by || 1); });
          pts.push([x, y + push, z]);
        }
        g.path(pts, { color: "brand", w: 2, dash: "14 12", dashOff: -t * 26 * 16, op: wo, bias: -1 });
      }
    } };
  }
  SC.wind = windScene([{ k: "box", x: -1.8, y: -1.6, w: 1, d: 1, h: 3.2, m: "paper" }, { k: "cyl", x: 0.4, y: 0.6, r: 0.7, h: 2.4, m: "sky" }, { k: "box", x: 1.6, y: -1.4, w: 1.2, d: 1.2, h: 2.0, m: "paper" }, { k: "box", x: -0.8, y: 1.2, w: 0.9, d: 0.9, h: 1.5, m: "paper" }], "zing");
  SC.windtunnel = windScene([{ k: "twist", x: -1.2, y: -0.8, w: 1.1, h: 4.2, m: "paper" }, { k: "cyl", x: 1.4, y: 0.8, r: 0.6, h: 3.4, m: "sky" }, { k: "box", x: 0.6, y: -2.2, w: 1, d: 1, h: 2.6, m: "paper" }], "sky");

  SC.stool = { cam: { yaw: 30, pitch: 24, S: 72, amp: 10 }, draw: function (g, t) {
    g.grid(3, 1);
    var press = Math.max(0, Math.sin((t - 0.6) * TAU * 3)) * seg(t, 0.6, 0.62) * (1 - seg(t, 0.8, 0.86));
    for (var i = 0; i < 9; i++) {
      var a = ap(t, i, 0.05, 0.03, 0.08);
      if (a <= 0) continue;
      var z = i * 0.18 + (1 - a) * 1.2;
      g.box(-1.1, -0.8, z, 2.2, 1.6, 0.16, i % 2 ? "wood" : "paper", { op: a });
    }
    var ca = ap(t, 0, 0.36, 0, 0.12), ch = 0.34 * (1 - 0.35 * press);
    if (ca > 0) g.box(-1.0, -0.72, 1.62 + (1 - ca) * 1.5, 2.0, 1.44, ch, "sky", { op: ca });
    var ao = seg(t, 0.5, 0.58) * (1 - seg(t, 0.82, 0.88));
    [-0.5, 0.5].forEach(function (x) {
      var zt = 3.1 - 0.3 * press;
      g.line([x, 0, zt + 0.9], [x, 0, zt], { color: "brand", w: 3, op: ao, bias: -9 });
      g.path([[x - 0.18, 0, zt + 0.25], [x, 0, zt], [x + 0.18, 0, zt + 0.25]], { color: "brand", w: 3, op: ao, bias: -9 });
    });
    if (press > 0.05) g.dot([0, -0.72, 1.62 + ch / 2], 10 * press + 4, "zing", { op: ao, bias: -9 });
  } };

  SC.shelter = { cam: { yaw: 36, pitch: 22, S: 64, amp: 7 }, draw: function (g, t) {
    g.grid(4, 1);
    var up = eio(seg(t, 0.12, 0.42)), L = 2.0, ridge = [0, 0, 0];
    var ang = lerp(0, 58, up) * RAD;
    var shake = 0.035 * Math.sin(t * TAU * 9) * seg(t, 0.55, 0.6) * (1 - seg(t, 0.8, 0.86));
    function panel(side) {
      var hx = side * (L * Math.cos(ang)), hz = L * Math.sin(ang);
      var baseX = side * lerp(L * 1.02, L * Math.cos(ang), 1);
      var bottom = side * L * Math.cos(ang), topP = [0 + shake, hz];
      var p0 = [bottom, 0], p1 = [topP[0], topP[1]];
      if (up < 0.01) { p0 = [side * 0.05, 0]; p1 = [side * (L + 0.05), 0]; }
      else { p0 = [side * L * Math.cos(ang) + side * 0.0, 0]; p1 = [shake, L * Math.sin(ang)]; }
      var flatP0 = [side * 0.1, 0.01], flatP1 = [side * (L + 0.1), 0.01];
      var A = [lerp(flatP1[0], p0[0], up), lerp(flatP1[1], p0[1], up)], B = [lerp(flatP0[0], p1[0], up), lerp(flatP0[1], p1[1], up)];
      g.plank(A, B, 0.06, -1.5, 1.5, side < 0 ? "paper" : "foil", { op: ap(t, 0, 0.04, 0, 0.1) });
      for (var k = 1; k < 6; k++) {
        var y = -1.5 + k * 0.5, oo = 0.035 * (side < 0 ? -1 : 1);
        g.line([A[0], y, A[1] + 0.05], [B[0], y, B[1] + 0.05], { w: 1, color: "soft", op: ap(t, 0, 0.04, 0, 0.1), bias: -0.05 });
      }
      return B;
    }
    panel(-1); panel(1);
    var ga = ap(t, 0, 0.42, 0, 0.1), hz = L * Math.sin(ang), hx = L * Math.cos(ang);
    if (ga > 0) g.poly([[-hx, 1.5, 0], [hx, 1.5, 0], [shake, 1.5, hz]], "zing", { op: ga });
    var wo = seg(t, 0.5, 0.58) * (1 - seg(t, 0.82, 0.88));
    for (var k = 0; k < 4; k++) { var off = frac(t * 3 + k / 4); g.line([-5 + off * 2, -1 + k * 0.6, 0.6 + k * 0.4], [-4 + off * 2, -1 + k * 0.6, 0.6 + k * 0.4], { color: "brand", w: 3, op: wo * Math.sin(off * Math.PI), bias: -20 }); }
    // 20-minute timer
    var q = g.P([2.8, -1.8, 3.4]), prog = seg(t, 0.08, 0.5), r = 22 * (g.S / 64);
    var tO = seg(t, 0.06, 0.1) * (1 - seg(t, 0.86, 0.92));
    var ea = -Math.PI / 2 + prog * TAU, lg = prog > 0.5 ? 1 : 0;
    g.screen('<g opacity="' + tO.toFixed(3) + '"><circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="' + f1(r) + '" fill="' + g.T.mats.paper + '" stroke="' + g.T.line + '" stroke-width="2"/>' +
      (prog > 0.001 ? '<path d="M' + f1(q[0]) + ' ' + f1(q[1] - r) + ' A' + f1(r) + ' ' + f1(r) + ' 0 ' + lg + ' 1 ' + f1(q[0] + r * Math.cos(ea)) + ' ' + f1(q[1] + r * Math.sin(ea)) + '" fill="none" stroke="' + g.T.mats.zing + '" stroke-width="6"/>' : "") +
      '<line x1="' + f1(q[0]) + '" y1="' + f1(q[1]) + '" x2="' + f1(q[0] + r * 0.7 * Math.cos(ea)) + '" y2="' + f1(q[1] + r * 0.7 * Math.sin(ea)) + '" stroke="' + g.T.line + '" stroke-width="2.4" stroke-linecap="round"/></g>');
  } };

  SC.tower = { cam: { yaw: 30, pitch: 18, S: 56, amp: 12, z: 1.15 }, draw: function (g, t) {
    g.grid(3, 1);
    var lv = [[0, 1.6], [1.3, 1.25], [2.6, 0.92], [3.8, 0.62], [4.9, 0.36]];
    var load = eo(seg(t, 0.56, 0.64));
    var sw = 0.06 * Math.sin((t - 0.64) * TAU * 3) * seg(t, 0.64, 0.66) * (1 - seg(t, 0.64, 0.86));
    function W(p) { return [p[0] + sw * p[2], p[1], p[2]]; }
    function corners(l) { var z = lv[l][0], h = lv[l][1]; return [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]].map(W); }
    for (var l = 0; l < lv.length; l++) {
      var a = ap(t, l, 0.06, 0.08, 0.12);
      if (a <= 0) continue;
      var C = corners(l);
      for (var i = 0; i < 4; i++) g.tube(C[i], C[(i + 1) % 4], { w: 3, mat: "wood", op: a });
      if (l > 0) {
        var D = corners(l - 1);
        for (var j = 0; j < 4; j++) {
          var topP = [lerp(D[j][0], C[j][0], a), lerp(D[j][1], C[j][1], a), lerp(D[j][2], C[j][2], a)];
          g.tube(D[j], topP, { w: 3, mat: "wood" });
          if (a > 0.6) g.tube(D[j], C[(j + 1) % 4], { w: 2.4, mat: "wood", op: (a - 0.6) / 0.4 });
        }
      }
      C.forEach(function (p) { g.dot(p, 7, "paper", { op: a, bias: -0.2 }); });
    }
    if (load > 0) {
      var z = lv[4][0] + (1 - load) * 2.2;
      var tp = W([0, 0, z]);
      g.box(tp[0] - 0.45, tp[1] - 0.3, z, 0.9, 0.6, 0.4, "zing");
      g.dot(W([-0.25, -0.31, z + 0.02]), 5, "ink", { bias: -1 }); g.dot(W([0.25, -0.31, z + 0.02]), 5, "ink", { bias: -1 });
    }
    // 10-second timer ticks
    var tO = seg(t, 0.64, 0.68) * (1 - seg(t, 0.86, 0.9)), q = g.P([2.4, -1.6, 4.8]);
    for (var k = 0; k < 10; k++) {
      var on = seg(t, 0.66 + k * 0.02, 0.67 + k * 0.02);
      g.screen('<rect x="' + f1(q[0] + k * 9) + '" y="' + f1(q[1]) + '" width="6" height="14" rx="2" fill="' + (on > 0.5 ? g.T.mats.zing : "none") + '" stroke="' + g.T.line + '" stroke-width="1.5" opacity="' + tO.toFixed(3) + '"/>');
    }
  } };

  SC.egg = { cam: { yaw: 24, pitch: 16, S: 62, amp: 0, z: 1.9 }, draw: function (g, t) {
    g.grid(3, 1);
    var f = seg(t, 0.18, 0.44), z;
    if (t < 0.44) z = lerp(5.4, 1.0, f * f);
    else { var b = seg(t, 0.44, 0.62); z = 1.0 + 0.9 * Math.sin(b * Math.PI) * (1 - b * 0.5); if (b >= 1) z = 1.0; }
    var squash = t > 0.43 && t < 0.5 ? Math.sin(seg(t, 0.43, 0.5) * Math.PI) : 0;
    var rot = t * TAU * 0.5 * (1 - seg(t, 0.44, 0.62)) + 0.8;
    var ctr = [0, 0, z], appear = ap(t, 0, 0.04, 0, 0.12);
    var axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.7, 0.7, 0], [-0.7, 0.7, 0], [0, 0.7, 0.7]];
    axes.forEach(function (ax, i) {
      var p = rotZ([ax[0], ax[1], ax[2]], [0, 0, 0], rot), L = 1.05 * (1 - 0.15 * squash);
      var A = [ctr[0] - p[0] * L, ctr[1] - p[1] * L, ctr[2] - p[2] * L * (1 - 0.3 * squash)], B = [ctr[0] + p[0] * L, ctr[1] + p[1] * L, ctr[2] + p[2] * L * (1 - 0.3 * squash)];
      var a = ap(t, i, 0.04, 0.015, 0.08);
      g.tube(A, [lerp(ctr[0], B[0], a), lerp(ctr[1], B[1], a), lerp(ctr[2], B[2], a)], { w: 4, mat: i % 2 ? "sky" : "paper" });
    });
    g.dot(ctr, 24 * (g.S / 62), "wood", { op: appear, sx: 0.82 * (1 + 0.15 * squash), sy: 1.05 * (1 - 0.2 * squash), bias: 0 });
    var sh = g.P([0, 0, 0]), so = appear * clamp(1.2 - (z - 1) / 5);
    g.screen("");
    g.shadow(circlePts(0, 0, 0.001, 0.4 + 0.6 * clamp(1 - (z - 1) / 4.4), 20), so);
    var ok = seg(t, 0.64, 0.68) * (1 - seg(t, 0.86, 0.9)), q = g.P([0, 0, 2.2]);
    if (ok > 0) g.screen('<path d="M' + f1(q[0] + 36) + ' ' + f1(q[1] - 4) + ' l10 10 l20 -22" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="' + ok.toFixed(3) + '"/>');
  } };

  function chair(g, x, y, a, op) {
    var legs = [[0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]];
    legs.forEach(function (l) { g.box(x + l[0] - 0.06, y + l[1] - 0.06, 0, 0.12, 0.12, 1.4 * a, "wood", { op: op }); });
    g.box(x, y, 1.4 * a, 1, 1, 0.12, "paper", { op: op });
  }
  SC.bridge = { cam: { yaw: 22, pitch: 22, S: 60, amp: 7 }, draw: function (g, t) {
    g.grid(4, 1);
    var ca = ap(t, 0, 0.04, 0, 0.14);
    chair(g, -3.6, -0.5, ca); chair(g, 2.6, -0.5, ca);
    g.box(-3.6, 0.35, 1.5, 1, 0.15, 1.4 * ca, "paper", { op: ca });
    g.box(2.6, 0.35, 1.5, 1, 0.15, 1.4 * ca, "paper", { op: ca });
    var load = eo(seg(t, 0.64, 0.7)), sag = 0.12 * load;
    function Z(x, z) { return z - sag * Math.sin(Math.PI * clamp((x + 2.8) / 5.6)); }
    var tubes = [[[-3.2, -0.3, 1.6], [3.2, -0.3, 1.6]], [[-3.2, 0.3, 1.6], [3.2, 0.3, 1.6]], [[-2.6, -0.3, 1.6], [0, -0.3, 2.4]], [[0, -0.3, 2.4], [2.6, -0.3, 1.6]],
                 [[-2.6, 0.3, 1.6], [0, 0.3, 2.4]], [[0, 0.3, 2.4], [2.6, 0.3, 1.6]], [[-1.3, -0.3, 1.6], [-1.3, -0.3, 2.0]], [[1.3, -0.3, 1.6], [1.3, -0.3, 2.0]], [[0, -0.3, 2.4], [0, 0.3, 2.4]]];
    tubes.forEach(function (tb, i) {
      var a = ap(t, i, 0.18, 0.04, 0.08);
      if (a <= 0) return;
      var A = [tb[0][0], tb[0][1], Z(tb[0][0], tb[0][2])], B0 = [tb[1][0], tb[1][1], Z(tb[1][0], tb[1][2])];
      g.tube(A, [lerp(A[0], B0[0], a), lerp(A[1], B0[1], a), lerp(A[2], B0[2], a)], { w: 8, mat: "foil" });
    });
    if (load > 0) g.cyl(0, 0, Z(0, 1.6) + 0.1 + (1 - load) * 2.5, 0.3, 1.1, "sky", { top: "brand" });
    var dO = seg(t, 0.36, 0.44);
    g.line([-2.6, -1.3, 0.05], [2.6, -1.3, 0.05], { color: "brand", w: 2, op: dO, bias: 30 });
  } };

  SC.sound = { cam: { yaw: 30, pitch: 34, S: 64, amp: 6 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.04, 0, 0.14);
    var w = 2.6, d = 1.8, h = 1.3 * a0;
    g.box(-w / 2, -d / 2, 0, w, d, 0.06, "paper", { op: a0 });
    g.box(-w / 2, d / 2 - 0.06, 0, w, 0.06, h, "paper", { op: a0 });
    g.box(-w / 2, -d / 2, 0, 0.06, d, h, "paper", { op: a0 });
    g.box(w / 2 - 0.06, -d / 2, 0, 0.06, d, h, "paper", { op: a0 });
    g.box(-w / 2, -d / 2, 0, w, 0.06, h * 0.55, "paper", { op: a0 });
    var lin = seg(t, 0.4, 0.62);
    for (var i = 0; i < 18; i++) {
      var a = ap(t, i, 0.4, 0.011, 0.06);
      if (a <= 0) continue;
      var side = i % 3, k = Math.floor(i / 3);
      var p = side === 0 ? [-w / 2 + 0.3 + k * 0.42, d / 2 - 0.16, 0.4 + (i % 2) * 0.45] : side === 1 ? [-w / 2 + 0.16, -d / 2 + 0.3 + (k % 3) * 0.5, 0.35 + (k > 2 ? 0.5 : 0)] : [w / 2 - 0.16, -d / 2 + 0.3 + (k % 3) * 0.5, 0.35 + (k > 2 ? 0.5 : 0)];
      g.dot(p, 11 * a, "sky", { op: a });
    }
    var wa = ap(t, 0, 0.14, 0, 0.1);
    g.cyl(0, 0, 0.06, 0.34, 0.12, "zing", { op: wa });
    var hand = t * TAU * 4;
    g.line([0, 0, 0.19], [0.24 * Math.cos(hand), 0.24 * Math.sin(hand), 0.19], { w: 2.4, op: wa, bias: -2 });
    var c = g.P([0, 0, 0.2]), maxR = lerp(260, 90, eio(lin)) * (g.S / 64);
    for (var r = 0; r < 3; r++) {
      var ph = frac(t * 4 + r / 3), rr = 30 + ph * maxR;
      var o = (1 - ph) * seg(t, 0.14, 0.2) * (1 - seg(t, 0.84, 0.9));
      g.screen('<ellipse cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" rx="' + f1(rr) + '" ry="' + f1(rr * 0.62) + '" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="2" opacity="' + o.toFixed(3) + '"/>');
    }
    var la = ap(t, 0, 0.22, 0, 0.1);
    if (la > 0) g.poly([[-w / 2, d / 2, h], [w / 2, d / 2, h], [w / 2 + 0.2, d / 2 + 1.3 * la, h + 0.9 * la], [-w / 2 - 0.2, d / 2 + 1.3 * la, h + 0.9 * la]], "paper", { op: la });
  } };

  SC.tensegrity = { cam: { yaw: 0, pitch: 14, S: 64, spin: 360, z: 1.2 }, draw: function (g, t) {
    g.grid(3, 1);
    var tri = [[-1.5, -0.9], [1.5, -1.0], [-0.1, 1.1]];
    var a0 = ap(t, 0, 0.04, 0, 0.14), aArm = ap(t, 0, 0.14, 0, 0.12), a1 = eo(seg(t, 0.24, 0.42)), aS = ap(t, 0, 0.4, 0, 0.1);
    var bob = 0.06 * Math.sin(t * TAU * 2) * seg(t, 0.42, 0.5);
    var zt = 3.3 + (1 - a1) * 1.6 + bob, rock = 0.04 * Math.sin(t * TAU * 3) * seg(t, 0.42, 0.5);
    function top(p) { return rotX([p[0], p[1], p[2] + (zt - 3.3)], [0, 0, zt], rock); }
    var B = tri.map(function (c) { return [c[0], c[1], 0.06]; }), T = tri.map(function (c) { return top([c[0] * 0.95, c[1] * 0.95, 3.3]); });
    for (var i = 0; i < 3; i++) g.tube(B[i], B[(i + 1) % 3], { w: 11, mat: "wood", op: a0 });
    var bTip = [0.25, -0.2, 2.5];
    var armB = [B[1], [lerp(B[1][0], bTip[0], aArm), lerp(B[1][1], bTip[1], aArm), lerp(B[1][2], bTip[2], aArm)]];
    g.tube(armB[0], armB[1], { w: 11, mat: "wood", op: a0 });
    if (a1 > 0) {
      for (var j = 0; j < 3; j++) g.tube(T[j], T[(j + 1) % 3], { w: 11, mat: "wood", op: a1 });
      var tTip = top([-0.05, -0.25, 1.75]);
      g.tube(T[0], tTip, { w: 11, mat: "wood", op: a1 });
      g.line(bTip, tTip, { color: "brand", w: 2, op: a1, bias: -0.5 });
      g.dot(bTip, 4, "zing", { op: a1, bias: -0.6 }); g.dot(tTip, 4, "zing", { op: a1, bias: -0.6 });
    }
    for (var k = 0; k < 3; k++) g.line(B[k], T[k], { color: "brand", w: 1.6, op: aS * ap(t, k, 0.4, 0.03, 0.08) });
  } };

  // Airport of tomorrow: the same 20 stands, six terminal plans, and the walk from the entrance
  SC.airport = { cam: { yaw: 0, pitch: 90, S: 40, amp: 0, z: 1.06 }, draw: function (g, t) {
    var W = "#EDF3F6", Z = "#DCE85E", SK = "#A8D8F0";
    function gate(x, y, a) { return { p: [x, y], a: a }; }
    function ring(cx, cy, r, n, a0) { var out = []; for (var k = 0; k < n; k++) { var an = a0 + k / n * TAU; out.push(gate(cx + r * Math.cos(an), cy + r * Math.sin(an), an)); } return out; }

    var L = [];
    // 1. standard linear
    (function () {
      var G = [], i;
      for (i = 0; i < 20; i++) G.push(gate(-5.9 + i * 0.62, -0.5, Math.PI / 2));
      L.push({ name: "Standard linear", ent: [0, -2.9], term: [-1.3, -2.9, 2.6, 0.85],
        struct: [[[-6.1, -1.15], [6.1, -1.15]]],
        gates: G, via: function (q) { return [[0, -2.05], [0, -1.15], [q.p[0], -1.15]]; } });
    })();
    // 2. curvilinear
    (function () {
      var G = [], i, R = 2.55, cy = -1.5, a0 = 175 * RAD, a1 = 5 * RAD, arc = [];
      for (i = 0; i < 20; i++) { var an = lerp(a0, a1, i / 19); G.push(gate(Math.cos(an) * (R + 0.62), cy + Math.sin(an) * (R + 0.62), an)); }
      for (i = 0; i <= 28; i++) { var b = lerp(a0, a1, i / 28); arc.push([Math.cos(b) * R, cy + Math.sin(b) * R]); }
      L.push({ name: "Curvilinear", ent: [0, -3.1], term: [-1.1, -2.5, 2.2, 0.8],
        struct: [arc],
        gates: G, via: function (q) {
          var an = Math.atan2(q.p[1] - cy, q.p[0]), out = [[0, -1.7], [0, cy + R]], steps = 8;
          for (var k = 1; k <= steps; k++) { var b = lerp(90 * RAD, an, k / steps); out.push([Math.cos(b) * R, cy + Math.sin(b) * R]); }
          return out;
        } });
    })();
    // 3. pier
    (function () {
      var G = [], px = [-1.9, 1.9], i, k;
      for (i = 0; i < 2; i++) for (k = 0; k < 5; k++) {
        G.push(gate(px[i] - 0.72, -0.7 + k * 0.78, Math.PI));
        G.push(gate(px[i] + 0.72, -0.7 + k * 0.78, 0));
      }
      L.push({ name: "Pier", ent: [0, -3.1], term: [-1.3, -3.0, 2.6, 0.8],
        struct: [[[-3.4, -1.75], [3.4, -1.75]], [[px[0], -1.75], [px[0], 3.0]], [[px[1], -1.75], [px[1], 3.0]]],
        gates: G, via: function (q) { var pier = q.p[0] < 0 ? px[0] : px[1]; return [[0, -2.2], [0, -1.75], [pier, -1.75], [pier, q.p[1]]]; } });
    })();
    // 4. concourse
    (function () {
      var G = [], xs = [-2.9, -1.45, 0, 1.45, 2.9], rows = [-1.4, 0.8], i, k, st = [[[-2.9, -2.1], [2.9, -2.1]]];
      for (i = 0; i < xs.length; i++) {
        st.push([[xs[i], -2.1], [xs[i], 1.7]]);
        for (k = 0; k < rows.length; k++) { G.push(gate(xs[i] - 0.7, rows[k], Math.PI)); G.push(gate(xs[i] + 0.7, rows[k], 0)); }
      }
      st.push([[-2.9, -0.3], [2.9, -0.3]]);
      L.push({ name: "Concourse", ent: [0, -3.4], term: [-1.2, -3.35, 2.4, 0.8],
        struct: st, gates: G,
        via: function (q) { var x = Math.round(q.p[0] / 1.45) * 1.45, cross = q.p[1] > 0 ? -0.3 : -2.1; return [[0, -2.55], [0, -2.1], [x, -2.1], [x, cross], [x, q.p[1]]]; } });
    })();
    // 5. satellite
    (function () {
      var c1 = [-2.1, -0.4], c2 = [2.1, -0.4], R = 1.05;
      var G = ring(c1[0], c1[1], R + 0.66, 10, 20 * RAD).concat(ring(c2[0], c2[1], R + 0.66, 10, 20 * RAD));
      var circ = function (c) { var o = []; for (var k = 0; k <= 24; k++) { var a = k / 24 * TAU; o.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]); } return o; };
      L.push({ name: "Satellite", ent: [0, 3.1], term: [-1.3, 2.7, 2.6, 0.8],
        struct: [circ(c1), circ(c2), [[0, 2.7], [c1[0], c1[1] + R]], [[0, 2.7], [c2[0], c2[1] + R]]],
        link: 2,
        gates: G, via: function (q) {
          var c = q.p[0] < 0 ? c1 : c2, an = Math.atan2(q.p[1] - c[1], q.p[0] - c[0]), out = [[0, 2.7]];
          out.push([c[0], c[1] + R]);
          for (var k = 1; k <= 6; k++) { var b = lerp(90 * RAD, an, k / 6); out.push([c[0] + R * Math.cos(b), c[1] + R * Math.sin(b)]); }
          return out;
        } });
    })();
    // 6. star pier
    (function () {
      var G = [], st = [[[-3.7, 0], [-0.75, 0]]], counts = [4, 3, 3, 4, 3, 3], i, k;
      for (i = 0; i < 6; i++) {
        var an = (30 + i * 60) * RAD, ux = Math.cos(an), uy = Math.sin(an);
        st.push([[ux * 0.7, uy * 0.7], [ux * 3.2, uy * 3.2]]);
        for (k = 0; k < counts[i]; k++) {
          var d = 1.5 + k * 0.62, side = k % 2 ? 1 : -1;
          G.push(gate(ux * d - uy * side * 0.8, uy * d + ux * side * 0.8, an - side * Math.PI / 2));
        }
      }
      L.push({ name: "Star pier", ent: [-3.75, 0], term: [-4.75, -0.42, 1.1, 0.84], hub: true,
        struct: st, gates: G,
        via: function (q) { var an = Math.atan2(q.p[1], q.p[0]); return [[-0.75, 0], [0, 0], [Math.cos(an) * 1.0, Math.sin(an) * 1.0]]; } });
    })();

    function longestWalk(l) {
      var worst = 0;
      for (var n = 0; n < l.gates.length; n++) {
        var legs = [l.ent].concat(l.via(l.gates[n]), [l.gates[n].p]), tot = 0;
        for (var m = 0; m < legs.length - 1; m++) tot += Math.hypot(legs[m + 1][0] - legs[m][0], legs[m + 1][1] - legs[m][1]);
        worst = Math.max(worst, tot);
      }
      return worst;
    }
    var walks = L.map(longestWalk), worstAll = Math.max.apply(null, walks), bestAll = Math.min.apply(null, walks);

    // --- where we are in the cycle
    var slot = clamp(t, 0, 0.99999) * L.length, idx = Math.floor(slot), f = slot - idx;
    var cur = L[idx], nxt = L[(idx + 1) % L.length];
    var tr = eio(clamp((f - 0.76) / 0.24));
    var appear = clamp(f / 0.14) * (idx === 0 ? clamp(t / 0.03) : 1);

    function plan(l, op) {
      if (op <= 0.01) return;
      l.struct.forEach(function (line, li) {
        var pts = line.map(function (q) { return [q[0], q[1], 0]; });
        g.path(pts, { color: W, w: l.link !== undefined && li >= l.link ? 1.6 : 2.6, dash: l.link !== undefined && li >= l.link ? "7 7" : null, op: op });
      });
      var T = l.term;
      g.path([[T[0], T[1], 0], [T[0] + T[2], T[1], 0], [T[0] + T[2], T[1] + T[3], 0], [T[0], T[1] + T[3], 0]], { closed: true, color: W, w: 2.2, fill: "rgba(237,243,246,0.10)", op: op });
      g.dot([l.ent[0], l.ent[1], 0], 8, Z, { stroke: false, op: op });
    }
    plan(cur, (1 - tr) * appear);
    plan(nxt, tr);

    // --- the 20 stands, sliding from one plan to the next
    var walk = seg(f, 0.16, 0.74) * (1 - tr);
    var longest = 0;
    for (var i = 0; i < 20; i++) {
      var a = cur.gates[i], b = nxt.gates[i];
      var da = b.a - a.a; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      var x = lerp(a.p[0], b.p[0], tr), y = lerp(a.p[1], b.p[1], tr), an = a.a + da * tr;
      var dx = Math.cos(an), dy = Math.sin(an), op = appear;
      g.line([x - dx * 0.34, y - dy * 0.34, 0], [x - dx * 0.62, y - dy * 0.62, 0], { color: W, w: 1.4, op: op * 0.8 });
      function P2(fw, sw) { return [x + dx * fw - dy * sw, y + dy * fw + dx * sw, 0]; }
      g.path([P2(-0.34, 0), P2(0.34, 0)], { color: SK, w: 2.4, op: op });
      g.path([P2(-0.12, 0.38), P2(0.05, 0)], { color: SK, w: 2, op: op });
      g.path([P2(-0.12, -0.38), P2(0.05, 0)], { color: SK, w: 2, op: op });
      g.path([P2(-0.34, 0.16), P2(-0.26, 0)], { color: SK, w: 1.6, op: op });
      g.path([P2(-0.34, -0.16), P2(-0.26, 0)], { color: SK, w: 1.6, op: op });

      // the walk from the entrance, drawn stand by stand
      var legs = [cur.ent].concat(cur.via(cur.gates[i]), [cur.gates[i].p]);
      var segs = [], total = 0, m;
      for (m = 0; m < legs.length - 1; m++) { var Ln = Math.hypot(legs[m + 1][0] - legs[m][0], legs[m + 1][1] - legs[m][1]); segs.push(Ln); total += Ln; }
      longest = Math.max(longest, total);
      var reach = clamp(walk * 26 - i * 0.9);
      if (reach > 0.01 && walk > 0) {
        var pts = [[legs[0][0], legs[0][1], 0]], want = total * reach, acc = 0;
        for (m = 0; m < segs.length; m++) {
          if (acc + segs[m] <= want) { pts.push([legs[m + 1][0], legs[m + 1][1], 0]); acc += segs[m]; }
          else { var fr = (want - acc) / segs[m]; pts.push([lerp(legs[m][0], legs[m + 1][0], fr), lerp(legs[m][1], legs[m + 1][1], fr), 0]); break; }
        }
        g.path(pts, { color: Z, w: 2.2, op: 0.85 * appear, bias: -2 });
      }
    }

    // --- longest walk, as a bar under the plan
    var barW = 4.6, y0 = -4.5, scale = barW / worstAll;
    var shown = lerp(walks[idx], walks[(idx + 1) % L.length], tr);
    var bo = seg(f, 0.2, 0.3) * appear;
    g.line([-barW / 2, y0, 0], [barW / 2, y0, 0], { color: W, w: 1.6, op: bo * 0.22 });
    g.line([-barW / 2 + bestAll * scale, y0 - 0.16, 0], [-barW / 2 + bestAll * scale, y0 + 0.16, 0], { color: W, w: 1.6, op: bo * 0.45 });
    g.line([-barW / 2, y0, 0], [-barW / 2 + shown * scale, y0, 0], { color: Z, w: 5, op: bo });
    g.dot([-barW / 2 + shown * scale, y0, 0], 5, Z, { stroke: false, op: bo });
  } };

  // ---------- Changemakers
  SC.slots = { cam: { yaw: 36, pitch: 22, S: 56, amp: 7 }, draw: function (g, t) {
    g.grid(5, 1);
    for (var i = 0; i < 6; i++) {
      var a = ap(t, i, 0.05, 0.05, 0.12), y = -2.5 + i * 1.0 + (1 - a) * 3;
      if (a <= 0) continue;
      var outer = [], inner = [];
      for (var k = 0; k <= 14; k++) { var an = Math.PI * k / 14; outer.push([2.7 * Math.cos(an), y, 2.7 * Math.sin(an)]); inner.push([2.35 * Math.cos(an), y, 2.35 * Math.sin(an)]); }
      g.poly(outer.concat(inner.reverse()), i % 2 ? "paper" : "wood", { op: a });
    }
    for (var s = 0; s < 7; s++) {
      var an = Math.PI * (s + 0.5) / 7, a2 = ap(t, s, 0.38, 0.03, 0.08);
      if (a2 <= 0) continue;
      var r = 2.52, x = r * Math.cos(an), z = r * Math.sin(an);
      g.line([x, -2.6, z], [x, lerp(-2.6, 2.6, a2), z], { w: 4, color: s % 2 ? "brand" : "line", bias: -0.3 });
    }
    var pa = ap(t, 0, 0.62, 0, 0.1);
    if (pa > 0) { g.dot([0.2, 0, 1.25], 11, "zing", { op: pa, bias: -2 }); g.path([[0.2, 0, 1.05], [0.2, 0, 0.5], [0.6, 0, 0.5], [0.6, 0, 0.05]], { w: 3, op: pa, bias: -2 }); }
  } };

  function prismXZ(g, prof, y0, y1, mat, tf, op) {
    var A = prof.map(function (q) { return tf([q[0], y0, q[1]]); }), Bq = prof.map(function (q) { return tf([q[0], y1, q[1]]); });
    g.poly(A, mat, { op: op }); g.poly(Bq, mat, { op: op });
    for (var i = 0; i < prof.length; i++) { var j = (i + 1) % prof.length; g.poly([A[i], A[j], Bq[j], Bq[i]], mat, { op: op, w: 1 }); }
  }
  function pose(c, axis, ang, off, a, lift) {
    return function (p) {
      var k = 1 - a, q = axis === "x" ? rotX(p, c, ang * k) : rotY(p, c, ang * k);
      return [q[0] + off[0] * k, q[1] + off[1] * k, q[2] + off[2] * k + (lift || 0) * Math.sin(Math.PI * a)];
    };
  }
  function rotAxis(v, k, a) { // Rodrigues: rotate v about the unit axis k
    var c = Math.cos(a), s = Math.sin(a), kv = dot(k, v) * (1 - c), kx = cross(k, v);
    return [v[0] * c + kx[0] * s + k[0] * kv, v[1] * c + kx[1] * s + k[1] * kv, v[2] * c + kx[2] * s + k[2] * kv];
  }
  function basisTurn(A, B) { // axis + angle of the rotation carrying basis A = [a1, a2, a3] onto B = [b1, b2, b3]
    var R = [0, 1, 2].map(function (i) { return [0, 1, 2].map(function (j) { return B[0][i] * A[0][j] + B[1][i] * A[1][j] + B[2][i] * A[2][j]; }); });
    var ax = [R[2][1] - R[1][2], R[0][2] - R[2][0], R[1][0] - R[0][1]];
    return { k: Math.hypot(ax[0], ax[1], ax[2]) > 1e-6 ? norm(ax) : [0, 0, 1], a: Math.acos(clamp((R[0][0] + R[1][1] + R[2][2] - 1) / 2, -1, 1)) };
  }
  function partial(pts, f) { // leading fraction f (by length) of a 2D polyline
    var L = 0, i, d = [];
    for (i = 1; i < pts.length; i++) { d.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); L += d[i - 1]; }
    var want = L * f, out = [pts[0]];
    for (i = 1; i < pts.length; i++) {
      if (want >= d[i - 1]) { out.push(pts[i]); want -= d[i - 1]; continue; }
      var k = want / d[i - 1];
      out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]);
      break;
    }
    return out;
  }
  // Every piece is nested on ONE cardboard sheet: the layout is marked, cut, the pieces pop out, the offcut
  // clears and the chair assembles: three identical cross-sections (far side, middle, near side), then the
  // front apron, seat and back resting on their edges.
  SC.chair = { cam: { yaw: 36, pitch: 20, S: 56, amp: 8, z: 1.6,
      at: function (t) { var k = eio(seg(t, 0.27, 0.45)); return { pitch: lerp(50, 20, k), z: lerp(2.1, 1.6, k), cy: lerp(0.47, 0.64, k) }; } },
    draw: function (g, t) {
    g.grid(5, 1);
    var X = -0.8, W = 0.9, TH = 0.05, UP = [0, 0, 1];
    var prof = [[0, 0], [0.35, 0], [0.45, 0.3], [1.05, 0.3], [1.2, 0], [1.55, 0], [1.4, 0.7], [1.75, 2.2], [1.45, 2.2], [1.02, 0.86], [0, 1.02]];
    // a full-width board lying on a profile edge a -> b (x from the chair front, z), sitting just outside it
    function board(a, b) {
      var dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), e2 = [dx / L, 0, dz / L], n = [-e2[2], 0, e2[0]];
      return { pts: [[0, 0], [2 * W, 0], [2 * W, L], [0, L]], e1: [0, -1, 0], e2: e2, n: n, o: [X + a[0] + n[0] * TH / 2, W, a[1] + n[2] * TH / 2], arc: 0.8 };
    }
    var P = [W - TH / 2, 0, -W + TH / 2].map(function (y) { return { pts: prof, e1: [1, 0, 0], e2: [0, 0, 1], n: [0, -1, 0], o: [X, y, 0], arc: 0.4 }; })
      .concat([board([0, 0.05], [0, 1.02]), board([-TH, 1.028], [1.02, 0.86]), board([1.02, 0.86], [1.392, 2.02])]);

    // sheet layout: boards along the near edge, the three cross-sections behind them
    var MG = 0.14, GAP = 0.1, SW = 6 * W + 2 * GAP + 2 * MG, rowV = MG + P[5].pts[2][1] + GAP, SH = rowV + 2.2 + MG;
    var phi = 42 * RAD, U = [Math.cos(phi), -Math.sin(phi), 0], V = [Math.sin(phi), Math.cos(phi), 0];
    var appear = ap(t, 0, 0.02, 0, 0.08), drop = (1 - appear) * 0.8, gone = eio(seg(t, 0.3, 0.4));
    function S2W(u, v, z, dv) { u -= SW / 2; v -= rowV + 1.1 + (dv || 0); return [X + 0.875 + u * U[0] + v * V[0], u * U[1] + v * V[1], z]; }

    var load = eo(seg(t, 0.7, 0.76)), dip = 0.025 * load * (1 + 0.6 * Math.sin((t - 0.76) * TAU * 4) * seg(t, 0.76, 0.78) * (1 - seg(t, 0.76, 0.86)));
    P.forEach(function (pc, i) {
      var ps = pc.pts.map(function (q) { return q[0]; }), qs = pc.pts.map(function (q) { return q[1]; });
      pc.pc = (Math.min.apply(null, ps) + Math.max.apply(null, ps)) / 2; pc.qc = (Math.min.apply(null, qs) + Math.max.apply(null, qs)) / 2;
      pc.u0 = i < 3 ? MG + (6 * W - 5.25) / 2 + i * (1.75 + GAP) : MG + (i - 3) * (2 * W + GAP);
      pc.v0 = i < 3 ? rowV : MG;
      pc.cut = seg(t, 0.09 + i * 0.026, 0.16 + i * 0.026);
      pc.pop = eo(seg(t, 0.16 + i * 0.026, 0.19 + i * 0.026));
      pc.fly = eio(seg(t, 0.3 + i * 0.042, 0.42 + i * 0.042));
      pc.turn = basisTurn([U, V, UP], [pc.e1, pc.e2, pc.n]);
      pc.dip = i === 4 ? dip : 0;
    });

    // piece-local (p, q, h) -> world, blending the flat pose on the sheet into the assembled pose
    function placer(pc) {
      var a = pc.fly, cf = S2W(pc.u0 + pc.pc, pc.v0 + pc.qc, TH / 2 + 0.2 * pc.pop);
      var ca = [0, 1, 2].map(function (j) { return pc.o[j] + pc.pc * pc.e1[j] + pc.qc * pc.e2[j]; });
      var c = [lerp(cf[0], ca[0], a), lerp(cf[1], ca[1], a), lerp(cf[2], ca[2], a) + pc.arc * Math.sin(Math.PI * a) - pc.dip];
      return function (p, q, h) {
        var r = rotAxis([(p - pc.pc) * U[0] + (q - pc.qc) * V[0], (p - pc.pc) * U[1] + (q - pc.qc) * V[1], h], pc.turn.k, pc.turn.a * a);
        return [c[0] + r[0], c[1] + r[1], c[2] + r[2]];
      };
    }

    // the sheet (later the offcut): holes open where pieces have popped out
    if (appear > 0 && gone < 1) {
      var so = appear * (1 - gone), rect = [[0, 0], [SW, 0], [SW, SH], [0, SH]];
      var slide = 2.4 * gone; // the offcut slides away under the lifted pieces
      var top = rect.map(function (q) { return S2W(q[0], q[1], TH + drop, slide); }), bot = rect.map(function (q) { return S2W(q[0], q[1], drop, slide); });
      var holes = P.filter(function (pc) { return pc.pop > 0; }).map(function (pc) { return pc.pts.map(function (q) { return S2W(pc.u0 + q[0], pc.v0 + q[1], TH + drop, slide); }); });
      g.poly(top, "wood", { op: so, bias: 30, holes: holes.length ? holes : undefined });
      for (var e = 0; e < 4; e++) g.poly([bot[e], bot[(e + 1) % 4], top[(e + 1) % 4], top[e]], "wood", { cull: true, w: 1, op: so, bias: 30 });
    }

    // marked layout, then the cutter tracing each outline
    P.forEach(function (pc, i) {
      if (pc.pop >= 1 || appear <= 0) return;
      var fade = 1 - pc.pop, loop = pc.pts.concat([pc.pts[0]]);
      var toW = function (q) { return S2W(pc.u0 + q[0], pc.v0 + q[1], TH + drop + 0.004); };
      g.path(loop.map(toW), { color: g.T.soft, w: 1.4, dash: "5 6", op: ap(t, i, 0.04, 0.01, 0.06) * fade, bias: -30 });
      if (pc.cut <= 0) return;
      var cutPts = partial(loop, pc.cut).map(toW);
      g.path(cutPts, { color: "zing", w: 2.6, op: fade, bias: -31 });
      if (pc.cut < 1) g.dot(cutPts[cutPts.length - 1], 5, "zing", { stroke: false, bias: -32 });
    });

    // cut pieces as solid boards: the visible face, plus the edge strips facing the camera
    P.forEach(function (pc) {
      if (pc.pop <= 0) return;
      var f = placer(pc), n = pc.pts.length;
      var top = pc.pts.map(function (q) { return f(q[0], q[1], TH / 2); }), bot = pc.pts.map(function (q) { return f(q[0], q[1], -TH / 2); });
      g.poly(dot(rotAxis(UP, pc.turn.k, pc.turn.a * pc.fly), g.V) > 0 ? top : bot, "wood", {});
      for (var j = 0; j < n; j++) g.poly([bot[j], bot[(j + 1) % n], top[(j + 1) % n], top[j]], "wood", { cull: true, w: 1 });
    });

    // load test: a sitter lands on the seat, which now has a middle support under it
    if (load > 0) {
      var bz = 0.975 - dip + (1 - load) * 2.4, bc = [X + 0.6, 0, bz], tilt = Math.atan2(0.168, 1.07);
      var sit = function (p) { return rotY(p, bc, tilt); };
      g.box(X + 0.2, -0.45, bz, 0.8, 0.9, 0.6, "zing", { tf: sit });
      g.dot(sit([X + 0.75, 0, bz + 1.0]), 14, "zing");
    }
  } };

  SC.windtunnel = SC.windtunnel;

  SC.solar = { cam: { yaw: 30, pitch: 28, S: 66, amp: 6 }, draw: function (g, t) {
    g.grid(4, 1);
    var a0 = ap(t, 0, 0.04, 0, 0.12);
    g.box(-1.5, -1.1, 0, 3.0, 2.2, 0.45 * a0, "paper", { op: a0 });
    g.box(-1.3, -0.9, 0.45 * a0, 2.6, 1.8, 0.02, "ink", { op: a0 });
    var open = eio(seg(t, 0.12, 0.34)) * 105 * RAD, hinge = [0, 1.1, 0.45];
    var lid = [[-1.5, -1.1, 0.45], [1.5, -1.1, 0.45], [1.5, 1.1, 0.45], [-1.5, 1.1, 0.45]].map(function (p) { return rotX(p, hinge, -open); });
    g.poly(lid, "sky", { op: a0 });
    var wrap = ap(t, 0, 0.3, 0, 0.1);
    g.poly([[-1.3, -0.9, 0.5], [1.3, -0.9, 0.5], [1.3, 0.9, 0.5], [-1.3, 0.9, 0.5]], "sky", { op: wrap * 0.35, stroke: false, bias: -3 });
    var melt = eio(seg(t, 0.55, 0.82));
    [[-0.6, -0.2], [0.1, 0.2], [0.6, -0.3]].forEach(function (m, i) {
      var a = ap(t, i, 0.36, 0.03, 0.08), h = 0.35 * (1 - 0.55 * melt), wd = 0.34 * (1 + 0.4 * melt);
      g.box(m[0] - wd / 2, m[1] - wd / 2, 0.47, wd, wd, h * a, "paper", { op: a, bias: -1 });
    });
    var sa = lerp(-40, 30, seg(t, 0.2, 0.9)) * RAD, sun = [3.2 * Math.sin(sa), -3.4, 4.6];
    var so = seg(t, 0.18, 0.26);
    g.dot(sun, 24, "zing", { op: so, bias: -60 });
    var mid = [0, 1.1 + Math.sin(open) * 0.9, 0.45 + Math.cos(Math.PI - open) * -0.9];
    [[-0.6, -0.2, 0.6], [0.1, 0.2, 0.6], [0.6, -0.3, 0.6]].forEach(function (m, i) {
      g.path([sun, [m[0], 1.0 + 0.6 * Math.sin(open) - 0.1, 0.45 + 1.2 * Math.sin(open)], m], { color: "brand", w: 1.6, dash: "6 8", dashOff: -t * 14 * 30, op: so * seg(t, 0.36, 0.44) * 0.9, bias: -40 });
    });
  } };

  SC.flood = { cam: { yaw: 26, pitch: 44, S: 52, amp: 5 }, draw: function (g, t) {
    g.box(-5, -4, -0.1, 10, 8, 0.1, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var lvl = 0.5 * eio(seg(t, 0.26, 0.44)) * (1 - eio(seg(t, 0.8, 0.9)));
    var houses = [[-3.6, -3.2, 1], [-1.8, -3.0, 1], [0.2, -3.3, 1], [2.2, -3.1, 1], [-3.2, 0.6, 0], [-1.2, 1.2, 0], [1.2, 0.8, 0], [3.0, 1.6, 0]];
    var targets = [[-3.8, 2.6], [-1.6, 2.9], [0.6, 2.8], [2.6, 3.0]];
    var move = eio(seg(t, 0.46, 0.68));
    var ti = 0;
    houses.forEach(function (h, i) {
      var a = ap(t, i, 0.06, 0.025, 0.1);
      if (a <= 0) return;
      var x = h[0], y = h[1], lift = 0;
      if (h[2]) { var tg = targets[ti++]; x = lerp(h[0], tg[0], move); y = lerp(h[1], tg[1], move); lift = 1.2 * Math.sin(move * Math.PI); }
      g.box(x, y, lift, 1.1, 0.9, 0.7 * a, "paper");
      gable(g, x, y, lift + 0.7 * a, 1.1, 0.9, 0.45 * a, h[2] ? "zing" : "paper");
    });
    if (lvl > 0.01) g.box(-5, -4, 0, 10, 3.2, lvl, "water", { op: 0.6 });
    var zo = seg(t, 0.4, 0.48) * (1 - seg(t, 0.84, 0.9));
    g.line([-5, -0.6, 0.02], [5, -0.6, 0.02], { color: "brand", w: 3, dash: "12 10", op: zo, bias: -20 });
  } };

  SC.room = { cam: { yaw: 34, pitch: 34, S: 60, amp: 6 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.04, 0, 0.12);
    g.box(-2.4, -1.8, -0.1, 4.8, 3.6, 0.1, "paper", { op: a0 });
    g.box(-2.4, 1.7, 0, 4.8, 0.1, 2.2 * a0, "paper", { op: a0 });
    g.box(-2.4, -1.8, 0, 0.1, 3.5, 2.2 * a0, "paper", { op: a0 });
    for (var k = -2; k <= 2; k++) g.line([k, -1.8, 0.005], [k, 1.7, 0.005], { color: "soft", w: 1, op: a0 * 0.5, bias: 40 });
    var wa = ap(t, 0, 0.16, 0, 0.1);
    g.poly([[-2.28, -0.6, 0.9], [-2.28, 0.6, 0.9], [-2.28, 0.6, 1.8], [-2.28, -0.6, 1.8]], "sky", { op: wa, bias: -0.1 });
    var sw = lerp(-0.5, 0.6, seg(t, 0.3, 0.9));
    g.poly([[-2.3, -0.6, 0.01], [-2.3, 0.6, 0.01], [-0.4 + sw, 0.9 + sw * 0.5, 0.01], [-0.4 + sw, -0.9 + sw * 0.5, 0.01]], "zing", { flat: true, stroke: false, op: seg(t, 0.3, 0.38) * (1 - seg(t, 0.84, 0.9)) * 0.45, bias: 30 });
    var f = [ap(t, 0, 0.24, 0, 0.1), ap(t, 0, 0.3, 0, 0.1), ap(t, 0, 0.36, 0, 0.1), ap(t, 0, 0.42, 0, 0.1)];
    if (f[0] > 0) { g.box(0.2, 0.2, (1 - f[0]) * 1.5, 1.9, 1.4, 0.5, "paper", { op: f[0] }); g.box(1.6, 0.35, 0.5 + (1 - f[0]) * 1.5, 0.4, 1.1, 0.16, "sky", { op: f[0] }); }
    if (f[1] > 0) g.box(-1.9, 1.0, (1 - f[1]) * 1.5, 1.4, 0.6, 0.8, "wood", { op: f[1] });
    if (f[2] > 0) g.box(-1.4, 0.3, (1 - f[2]) * 1.5, 0.5, 0.5, 0.45, "zing", { op: f[2] });
    if (f[3] > 0) { g.cyl(-0.7, 1.3, 0.8 + (1 - f[3]) * 1.5, 0.08, 0.5, "paper", { op: f[3], seg: 8 }); g.dot([-0.7, 1.3, 1.45 + (1 - f[3]) * 1.5], 12, "zing", { op: f[3] }); }
  } };

  SC.maze = { cam: { yaw: 0, pitch: 62, S: 52, amp: 0 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.03, 0, 0.1);
    g.box(-5, -3.6, -0.1, 10, 7.2, 0.1, "foil", { op: a0 });
    var F = [[-3, -2.4, 1.2, 2.2, 0.8, "paper"], [-0.6, 0.4, 2.4, 1.0, 0.6, "sky"], [-3.4, 1.0, 1.6, 1.6, 0.5, "wood"], [1.8, -2.8, 1.0, 1.8, 0.9, "paper"], [2.4, 1.4, 1.4, 1.2, 0.5, "paper"]];
    F.forEach(function (b, i) { var a = ap(t, i, 0.06, 0.03, 0.1); if (a > 0) g.box(b[0], b[1], 0, b[2], b[3], b[4] * a, b[5]); });
    var path = [[-4.4, -3.0], [-4.3, -0.4], [-1.2, -0.3], [-1.0, -2.6], [1.2, -2.8], [1.3, 0.0], [4.2, 0.2], [4.3, 3.0]];
    var dense = [];
    for (var i = 0; i < path.length - 1; i++) for (var s = 0; s < 8; s++) dense.push([lerp(path[i][0], path[i + 1][0], s / 8), lerp(path[i][1], path[i + 1][1], s / 8), 0.02]);
    dense.push([path[path.length - 1][0], path[path.length - 1][1], 0.02]);
    var prog = eio(seg(t, 0.2, 0.8)), n = Math.max(2, Math.round(prog * (dense.length - 1)) + 1);
    g.path(dense.slice(0, n), { color: "brand", w: 3.5, dash: "8 8", op: seg(t, 0.18, 0.22), bias: -0.3 });
    var p = dense[n - 1];
    g.dot([p[0], p[1], 0.35], 18, "zing", { op: seg(t, 0.14, 0.2), bias: -5 });
    g.path([[p[0] - 0.2, p[1], 0.42], [p[0] + 0.2, p[1], 0.42]], { w: 4, op: seg(t, 0.14, 0.2), bias: -6 });
    var fa = ap(t, 0, 0.1, 0, 0.1);
    g.line([4.3, 3.0, 0], [4.3, 3.0, 1.1], { w: 2.4, op: fa });
    g.poly([[4.3, 3.0, 1.1], [4.9, 3.0, 0.9], [4.3, 3.0, 0.7]], "zing", { op: fa });
    var q = g.P([p[0], p[1], 0.9]);
    for (var k = 0; k < 2; k++) {
      var ph = frac(t * 5 + k / 2), o = (1 - ph) * seg(t, 0.22, 0.26) * (1 - seg(t, 0.8, 0.84));
      g.screen('<path d="M' + f1(q[0] + 14 + ph * 12) + ' ' + f1(q[1] - 18 - ph * 8) + ' a' + f1(10 + ph * 12) + ' ' + f1(10 + ph * 12) + ' 0 0 1 0 ' + f1(16 + ph * 14) + '" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="2.4" stroke-linecap="round" opacity="' + o.toFixed(3) + '"/>');
    }
  } };

  SC.charades = { cam: { yaw: 0, pitch: 4, S: 60, amp: 0 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.03, 0, 0.12);
    g.box(-4.6, 0, 0.4, 9.2, 0.12, 5.2 * a0, "paper", { op: a0 });
    g.line([-3, 0.2, 0.4], [-3.4, 0.4, -0.8], { w: 3, op: a0 }); g.line([3, 0.2, 0.4], [3.4, 0.4, -0.8], { w: 3, op: a0 });
    function stroke(pts, a, b, w, col) {
      var pr = seg(t, a, b);
      if (pr <= 0) return null;
      var n = Math.max(2, Math.round(pr * (pts.length - 1)) + 1);
      g.path(pts.slice(0, n), { w: w || 3.2, color: col, bias: -1 });
      return pts[n - 1];
    }
    var cx = -1.9, cz = 3.0, tips = [];
    tips.push(stroke(circlePts(cx, 0, 0, 1.5, 36).map(function (p) { return [p[0], -0.02, cz + p[1] - 0]; }), 0.12, 0.26));
    tips.push(stroke(circlePts(cx, 0, 0, 0.3, 16).map(function (p) { return [p[0], -0.02, cz + p[1]]; }), 0.26, 0.3));
    for (var k = 0; k < 8; k++) {
      var an = k / 8 * TAU;
      tips.push(stroke([[cx + 0.3 * Math.cos(an), -0.02, cz + 0.3 * Math.sin(an)], [cx + 1.5 * Math.cos(an), -0.02, cz + 1.5 * Math.sin(an)]], 0.3 + k * 0.02, 0.32 + k * 0.02));
    }
    var sp = [];
    for (var s = 0; s <= 40; s++) { var r = 0.45 + s / 40 * 0.9, an2 = s / 40 * TAU * 0.85; sp.push([cx + r * Math.cos(an2), -0.03, cz + r * Math.sin(an2)]); }
    tips.push(stroke(sp, 0.48, 0.56, 3, "brand"));
    tips.push(stroke([[0.8, -0.02, 1.2], [3.8, -0.02, 1.2]], 0.58, 0.62));
    tips.push(stroke([[1.4, -0.02, 1.2], [1.4, -0.02, 3.4]], 0.62, 0.66));
    tips.push(stroke([[1.4, -0.02, 3.4], [4.1, -0.02, 3.4]], 0.66, 0.72));
    tips.push(stroke([[1.4, -0.02, 3.8], [4.1, -0.02, 3.8]], 0.72, 0.74, 2, "brand"));
    var tip = null;
    tips.forEach(function (p) { if (p) tip = p; });
    if (tip && t < 0.8) g.dot([tip[0] + 0.12, -0.2, tip[2] - 0.12], 8, "zing", { bias: -5 });
  } };

  SC.park = { cam: { yaw: 22, pitch: 46, S: 52, amp: 5 }, draw: function (g, t) {
    g.box(-5, -3.6, -0.14, 10, 7.2, 0.14, "foil", { op: ap(t, 0, 0.02, 0, 0.1) });
    var green = seg(t, 0.14, 0.26);
    g.poly([[-5, -3.6, 0.001], [5, -3.6, 0.001], [5, 3.6, 0.001], [-5, 3.6, 0.001]], "zing", { flat: true, stroke: false, op: green * 0.45, bias: -0.2 });
    var pa = ap(t, 0, 0.22, 0, 0.14);
    if (pa > 0) g.poly(circlePts(-2.4, 1.3, 0.01, 1.4, 24).map(function (p) { return [p[0], -2.4 + (p[1] - -2.4) * 0.6 + 1.3 * 0.4 + 0.8, 0.01]; }), "water", { flat: true, op: pa, bias: -0.3 });
    var path = [];
    for (var x = -5; x <= 5.01; x += 0.25) path.push([x, -1.6 + 1.3 * Math.sin(x * 0.55), 0.02]);
    var pr = eio(seg(t, 0.26, 0.44)), n = Math.max(2, Math.round(pr * (path.length - 1)) + 1);
    if (pr > 0) { g.path(path.slice(0, n), { color: "line", w: 19, bias: -0.35 }); g.path(path.slice(0, n), { color: "paper", w: 15, bias: -0.4 }); }
    var trees = [[1.8, 1.6], [3.2, 0.6], [2.4, 2.6], [-3.8, -2.4], [0.2, 2.2], [3.8, 2.4], [-1.2, -2.8]];
    trees.forEach(function (p, i) {
      var a = back(seg(t, 0.36 + i * 0.03, 0.46 + i * 0.03));
      if (a <= 0) return;
      g.line([p[0], p[1], 0], [p[0], p[1], 0.5 * a], { w: 2.4 });
      g.dot([p[0], p[1], 0.7 * a], 18 * a, i % 3 ? "zing" : "sky");
    });
    [[0.6, -0.6], [-0.6, 0.8]].forEach(function (b, i) { var a = ap(t, i, 0.5, 0.03, 0.08); if (a > 0) g.box(b[0], b[1], 0, 0.9, 0.3, 0.25 * a, "wood"); });
    for (var pI = 0; pI < 3; pI++) {
      var ph = frac(t + pI / 3), idx = Math.floor(ph * (path.length - 1));
      var pp = path[idx];
      g.dot([pp[0], pp[1], 0.25], 7, pI === 1 ? "brand" : "paper", { op: seg(t, 0.46, 0.52) * (1 - seg(t, 0.84, 0.9)), bias: -2 });
    }
  } };

  SC.quake = { cam: { yaw: 30, pitch: 24, S: 66, amp: 6 }, draw: function (g, t) {
    var a0 = ap(t, 0, 0.03, 0, 0.1);
    var s1 = seg(t, 0.24, 0.26) * (1 - seg(t, 0.44, 0.48)), s2 = seg(t, 0.62, 0.64) * (1 - seg(t, 0.8, 0.84));
    var shake = Math.sin(t * TAU * 22) * (0.22 * s1 + 0.2 * s2);
    var braced = seg(t, 0.5, 0.58);
    var houseShake = shake * (1 - 0.85 * braced);
    var rock = 0.12 * Math.sin(t * TAU * 11) * s1;
    g.box(-2.6 + shake, -1.8, 0, 5.2, 3.6, 0.2, "foil", { op: a0 });
    g.box(-2.6 + shake, -1.8, 0.2, 5.2, 0.1, 0.35, "foil", { op: a0 });
    for (var i = 0; i < 9; i++) for (var j = 0; j < 5; j++) {
      var a = ap(t, i + j, 0.06, 0.008, 0.08);
      g.dot([-2.1 + i * 0.52 + shake * 1.3 + 0.05 * Math.sin(i + t * 80) * s1, -1.3 + j * 0.62, 0.36], 9, (i + j) % 4 ? "sky" : "zing", { op: a });
    }
    var ha = ap(t, 0, 0.12, 0, 0.1);
    var tf = function (p) { return rotY([p[0] + houseShake, p[1], p[2]], [houseShake, 0, 0.55], rock * (1 - braced)); };
    g.box(-1.5, -1.0, 0.55, 3.0, 2.0, 0.18, braced > 0 ? "zing" : "paper", { op: ha, tf: tf });
    g.box(-1.2, -0.8, 0.73, 2.4, 1.6, 1.3 * ha, "paper", { op: ha, tf: tf });
    if (ha > 0) gable(g, -1.2, -0.8, 2.03, 2.4, 1.6, 0.9, "sky", { op: ha, tf: tf });
    if (braced > 0) {
      [[-1.2, -0.8], [1.2, -0.8]].forEach(function (c) {
        g.line(tf([c[0], -0.82, 0.73]), tf([c[0] + (c[0] < 0 ? 1.0 : -1.0), -0.82, 2.0]), { color: "brand", w: 3, op: braced, bias: -1 });
      });
    }
    var so = s1 + s2;
    for (var k = 0; k < 2; k++) {
      var q = g.P([k ? 3.1 : -3.1, 0, 1.0]);
      g.screen('<path d="M' + f1(q[0]) + ' ' + f1(q[1] - 30) + ' l' + (k ? 10 : -10) + ' 10 l' + (k ? -10 : 10) + ' 10 l' + (k ? 10 : -10) + ' 10 l' + (k ? -10 : 10) + ' 10" fill="none" stroke="' + g.T.mats.brand + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="' + clamp(so).toFixed(3) + '"/>');
    }
  } };

  /* ------------------------------------------------------------------ render */
  // sketch mode: hatching patterns (white = light on dark paper), a soft blur and the pencil filter. The pencil filter
  // wobbles the whole drawing a little (the wobble "boils" a few times a second, like hand-drawn frames) and knocks
  // paper-tooth grain out of the bright strokes while leaving the darker washes nearly whole.
  function sketchDefs(T, W, H, boil) {
    var ang = [-52, -18, -74], sp = [0, 6.2, 3.6], p = "";
    ang.forEach(function (a, i) {
      [1, 2].forEach(function (lv) {
        p += '<pattern id="hatch' + i + lv + '" patternUnits="userSpaceOnUse" width="48" height="' + sp[lv] + '" patternTransform="rotate(' + a + ')">' +
          '<path d="M0,' + (sp[lv] / 2) + 'H48" stroke="' + T.line + '" stroke-width="' + (lv === 2 ? 0.75 : 0.65) + '" stroke-opacity="' + (lv === 2 ? 0.55 : 0.42) + '"/></pattern>';
      });
    });
    return "<defs>" + p +
      '<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="softer" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>' +
      '<filter id="pencil" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="' + (boil % 97) + '" result="wob"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="wob" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="5" result="gr"/>' +
      '<feColorMatrix in="gr" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.98" result="hole"/>' +
      '<feColorMatrix in="d" type="luminanceToAlpha" result="lum0"/>' +
      '<feComponentTransfer in="lum0" result="lum"><feFuncA type="linear" slope="2.6" intercept="-1.45"/></feComponentTransfer>' + // only the bright pencil cores, not glows or washes

      '<feComposite in="hole" in2="lum" operator="in" result="mask"/>' +
      '<feComposite in="d" in2="mask" operator="out"/>' +
      "</filter></defs>";
  }

  function render(svg, name, t, theme, frame) {
    var sc = SC[name];
    if (!sc) { svg.innerHTML = ""; return; }
    var T = THEMES[theme] || THEMES.light;
    frame = frame || {};
    var W = frame.w || 960, H = frame.h || 720;
    var k = (frame.scale || 1) * (W / 960);
    var cc = sc.cam;
    if (cc.at) { // optional per-frame camera overrides (pitch, z, cy, ...)
      var over = cc.at(t), key; cc = {};
      for (key in sc.cam) cc[key] = sc.cam[key];
      for (key in over) cc[key] = over[key];
    }
    var cam = {
      yaw: cc.yaw + (cc.spin ? cc.spin * t : (cc.amp || 0) * Math.sin(t * TAU)),
      pitch: cc.pitch,
      S: cc.S * k * (frame.zoom || 1) * (cc.z || 1.3),
      cx: (frame.cx !== undefined ? frame.cx : 0.5) * W,
      cy: (frame.cy !== undefined ? frame.cy : cc.cy !== undefined ? cc.cy : (cc.pitch > 60 ? 0.52 : 0.64)) * H,
      edge: 1.6 * k
    };
    var g = Ctx(cam, T);
    sc.draw(g, t);
    var env = sc.seamless ? 1 : clamp(t / 0.05) * clamp((1 - t) / 0.07); // seamless scenes loop without a fade
    if (T.sketch) { svg.innerHTML = sketchDefs(T, W, H, Math.floor(t * (cc.boil || 75))) + '<g opacity="' + env.toFixed(3) + '" filter="url(#pencil)">' + g.out() + "</g>"; return; }
    svg.innerHTML = '<g opacity="' + env.toFixed(3) + '">' + g.out() + "</g>";
  }

  return {
    render: render,
    scenes: Object.keys(SC),
    THEMES: THEMES,
    // helpers and a hook so extra scene files (towers, hulls) can plug in
    U: { TAU: TAU, RAD: RAD, clamp: clamp, seg: seg, eo: eo, eio: eio, back: back, lerp: lerp, hash: hash, ap: ap, frac: frac,
         rotZ: rotZ, rotY: rotY, rotX: rotX, circlePts: circlePts, gable: gable, hull: hull, boxShadow: boxShadow, prismXZ: prismXZ, pose: pose },
    define: function (name, scene) { SC[name] = scene; return name; }
  };
})();

  var WL = window.WL;
/* WonderLab "Dream Tree House", pencil-sketch version: the treehouse/ story (Courses/13/IMG_4714: cabins stacked up
 * one tall branch on diagonal branch struts; IMG_4712/4713 for the slide and rope ladder) drawn in white pencil on
 * blue02 (grahic design/blue02.jpg) instead of a technical drawing on a grid. A log slice is sketched in and the branch
 * grows out of it, then four cabins go up it in a spiral, each drawn the way an illustrator would: pencil outline
 * first, then a green wash, then white hatching where the light falls. A lookout canopy goes on top, then a rope
 * ladder and a slide; leaves and creepers grow over everything, the windows glow, fireflies come out, the flag goes
 * up, and a little figure climbs the rope ladder, walks round the bottom deck and comes down the slide.
 * The engine's sketch theme (engine.js, T.sketch) does the pencil lines, washes, hatching and the paper-grain filter;
 * g.ink (0..1) is how far a part has been drawn. World units, z up, base top at ZB. Pure function of loop progress t.
 */
(function () {
  "use strict";
  var U = WL.U, TAU = U.TAU, RAD = U.RAD, seg = U.seg, eo = U.eo, eio = U.eio, lerp = U.lerp, back = U.back, hash = U.hash;
  var OR = "#FF6000";                          // WonderLab orange: the flag and the figure
  var PENCIL = "#F2F0E6", SOFT = "rgba(242,240,230,0.5)", FAINT = "rgba(242,240,230,0.3)";
  var LEAVES = ["#2C7458", "#5AAB84", "#A9DDB9"]; // leaf washes: shade, mid, light
  var VINE = "#B5E3C3", GLOW = "#F6E9C2";

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function l3(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function up(p, h) { return [p[0], p[1], p[2] + h]; }
  function polar(c, r, deg, z) { return [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD), z]; }
  function bez(P, s) { var m = 1 - s; return [0, 1, 2].map(function (j) { return m * m * m * P[0][j] + 3 * m * m * s * P[1][j] + 3 * m * s * s * P[2][j] + s * s * s * P[3][j]; }); }
  function crom(a, b, c, d, s) {
    return [0, 1, 2].map(function (j) { return 0.5 * (2 * b[j] + (c[j] - a[j]) * s + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * s * s + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * s * s * s); });
  }
  function inked(g, a, fn) { if (a <= 0.001) return; var was = g.ink; g.ink = Math.min(1, a); fn(); g.ink = was; } // draw a part a-far

  // ---- layout (as treehouse/)
  var ZB = 0.18, TH = 0.05;
  var L1 = { c: [0.04, 0.03], r: 0.95, z: 1.0 };
  var LAD = 300, SLA = 160;
  var PODS = [
    { c: [0.02, 0.6], phi: 270, hu: 0.24, hv: 0.42, z: L1.z, h: 0.5, rise: 0.22, t0: 0.2 },
    { c: [1.0, -0.2], phi: 170, hu: 0.4, hv: 0.33, z: 1.95, h: 0.5, rise: 0.3, green: true, t0: 0.29,
      deck: [-0.5, 0.62, -0.42, 0.65], rails: ["u0", "v0", "v1"], struts: [[-0.45, -0.37], [-0.45, 0.6], [0.15, 0.6]] },
    { c: [-0.85, -0.35], phi: 225, hu: 0.4, hv: 0.45, z: 2.85, h: 0.55, rise: 0.35, t0: 0.38,
      deck: [-0.45, 0.75, -0.6, 0.6], rails: ["u1", "v0", "v1"], struts: [[0.7, -0.55], [0.7, 0.55], [0.1, -0.55]] },
    { c: [0.55, 0.75], phi: 210, hu: 0.35, hv: 0.3, z: 3.65, h: 0.45, rise: 0.38, t0: 0.47,
      deck: [-0.5, 0.48, -0.45, 0.5], rails: ["u0", "v0", "v1"], struts: [[-0.45, -0.4], [-0.45, 0.45]] }
  ];
  var TOP = { c: [0.07, 0.13], phi: 250, hu: 0.42, hv: 0.42, z: 4.35, h: 0.5, rise: 0.18, r: 0.45 };

  function W(P, u, v, z) { var cs = Math.cos(P.phi * RAD), sn = Math.sin(P.phi * RAD); return [P.c[0] + u * cs - v * sn, P.c[1] + u * sn + v * cs, z]; }
  function local(P, p) { var cs = Math.cos(P.phi * RAD), sn = Math.sin(P.phi * RAD), dx = p[0] - P.c[0], dy = p[1] - P.c[1]; return [dx * cs + dy * sn, -dx * sn + dy * cs]; }
  function roofZ(P, u) { return P.z + P.h + P.rise * (P.hu - u) / (2 * P.hu); }

  var DECKS = [{ z: L1.z, inside: function (p) { return Math.hypot(p[0] - L1.c[0], p[1] - L1.c[1]) < L1.r; } }];
  PODS.forEach(function (P) {
    if (P.deck) DECKS.push({ z: P.z, inside: function (p) { var q = local(P, p); return q[0] > P.deck[0] && q[0] < P.deck[1] && q[1] > P.deck[2] && q[1] < P.deck[3]; } });
  });
  DECKS.push({ z: TOP.z, inside: function (p) { return Math.hypot(p[0] - TOP.c[0], p[1] - TOP.c[1]) < TOP.r; } });
  DECKS.push({ z: TOP.z + TOP.h + 0.05, inside: function (p) { var q = local(TOP, p); return Math.abs(q[0]) < TOP.hu + 0.07 && Math.abs(q[1]) < TOP.hv + 0.07; } });
  function under(p) { var b = 0; DECKS.forEach(function (d) { if (p[2] < d.z - 0.005 && d.inside(p)) b += 0.9; }); return b; }

  // ---- the branch
  function limb(pts, r0, r1, n, flare) {
    var S = [], i;
    for (i = 0; i <= n; i++) {
      var u = i / n * (pts.length - 1), k = Math.min(Math.floor(u), pts.length - 2), f = u - k;
      S.push({ c: crom(pts[Math.max(k - 1, 0)], pts[k], pts[k + 1], pts[Math.min(k + 2, pts.length - 1)], f), r: lerp(r0, r1, i / n) + (flare || 0) * Math.exp(-i / n * 9) });
    }
    var a = null;
    S.forEach(function (s, j) {
      var T = norm(sub(S[Math.min(j + 1, n)].c, S[Math.max(j - 1, 0)].c));
      a = a ? norm(sub(a, mul(T, dot(a, T)))) : norm(cross(T, Math.abs(T[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]));
      s.T = T; s.a = a; s.b = cross(T, a);
    });
    S.id = pts[0][0] * 31.7 + pts[0][1] * 17.3 + pts[pts.length - 1][2] * 7.9; // fixed seed for its camera-dependent outline
    return S;
  }
  var TRUNK = limb([[0, 0, 0.02], [0.05, 0.03, 1.2], [0.02, 0.08, 2.4], [0.08, 0.1, 3.6], [0.06, 0.13, 4.55]], 0.27, 0.12, 20, 0.18);
  function trunkAt(z) {
    for (var i = 0; i < TRUNK.length - 1; i++) {
      var a = TRUNK[i], b = TRUNK[i + 1];
      if (z <= b.c[2] || i === TRUNK.length - 2) { var f = Math.max(0, Math.min(1, (z - a.c[2]) / (b.c[2] - a.c[2]))); return { c: l3(a.c, b.c, f), r: lerp(a.r, b.r, f) }; }
    }
  }
  var TWIGS = [
    limb([[0.06, 0.13, 4.45], [0.0, 0.2, 5.0], [-0.08, 0.27, 5.4]], 0.07, 0.02, 8),
    limb([[0.07, 0.12, 4.4], [0.38, 0.0, 4.85], [0.62, -0.12, 5.1]], 0.05, 0.015, 7),
    limb([[0.05, 0.15, 4.35], [-0.32, 0.32, 4.8], [-0.58, 0.48, 5.0]], 0.05, 0.015, 7),
    limb([[0.07, 0.1, 3.2], [-0.4, 0.55, 3.55], [-0.85, 0.9, 3.75]], 0.06, 0.02, 7)
  ];
  function strut(end) { var s = trunkAt(Math.max(0.4, end[2] - 0.85)).c; return limb([s, add(l3(s, end, 0.5), [0, 0, -0.07]), end], 0.06, 0.035, 6); }
  var L1STRUTS = [20, 140, 240].map(function (d) { return strut(polar(L1.c, 0.82, d, L1.z - TH)); });
  PODS.forEach(function (P) { P.S = (P.struts || []).map(function (q) { return strut(W(P, q[0], q[1], P.z - TH)); }); });
  var TOPSTRUTS = [60, 200, 320].map(function (d) { return strut(polar(TOP.c, 0.38, d, TOP.z - TH)); });

  // a limb: dark wash faces (hatched on the lit side), one pencil line down each silhouette, a few bark strokes
  var SIDES = 9, BARK = [0.3, 1.25, 2.0, 2.9, 3.7, 4.6, 5.5];
  function drawLimb(g, S, grow) {
    if (grow <= 0.001) return;
    var m = grow * (S.length - 1), n = Math.floor(m), f = m - n, L = S.slice(0, n + 1), i, k;
    if (f > 0.001 && n + 1 < S.length) { var A = S[n], B = S[n + 1]; L.push({ c: l3(A.c, B.c, f), r: lerp(A.r, B.r, f), T: B.T, a: B.a, b: B.b }); }
    var R = L.map(function (s) {
      var o = [];
      for (var k2 = 0; k2 < SIDES; k2++) { var th = k2 / SIDES * TAU; o.push(add(s.c, add(mul(s.a, s.r * Math.cos(th)), mul(s.b, s.r * Math.sin(th))))); }
      return o;
    });
    var sil = [[], []], silB = [0, 0];
    function flush(j, i0) { if (sil[j].length > 1) g.path(sil[j], { w: 1.45, bias: silB[j], seed: S.id + j * 101 + i0 * 13 }); sil[j] = []; }
    var start = [0, 0];
    for (i = 0; i < L.length - 1; i++) {
      var bias = under(l3(L[i].c, L[i + 1].c, 0.5));
      for (k = 0; k < SIDES; k++) { var k2 = (k + 1) % SIDES; g.poly([R[i][k], R[i][k2], R[i + 1][k2], R[i + 1][k]], "ink", { cull: true, strokeColor: "ink", w: 0.8, bias: bias, hatchAngle: 2 }); }
      for (var j = 0; j < 2; j++) {
        var sg = j ? -1 : 1, p = add(L[i].c, mul(norm(cross(L[i].T, g.V)), sg * L[i].r)), q = add(L[i + 1].c, mul(norm(cross(L[i + 1].T, g.V)), sg * L[i + 1].r));
        if (sil[j].length && silB[j] !== bias - 0.25) { flush(j, start[j]); }
        if (!sil[j].length) { sil[j].push(p); start[j] = i; }
        sil[j].push(q); silB[j] = bias - 0.25;
      }
      if (L[i].r > 0.1 && i % 2 === 0) BARK.forEach(function (th, bi) { // short bark strokes fixed to the wood, shown where they face us
        var th2 = th + 0.35 * Math.sin(i * 1.3 + bi), dv = add(mul(L[i].a, Math.cos(th2)), mul(L[i].b, Math.sin(th2))), face = dot(dv, g.V);
        if (face < 0.15 || hash(i * 7 + bi) < 0.35) return;
        var i2 = Math.min(i + 1, L.length - 1), dv2 = add(mul(L[i2].a, Math.cos(th2 + 0.1)), mul(L[i2].b, Math.sin(th2 + 0.1)));
        g.line(add(L[i].c, mul(dv, L[i].r * 1.01)), add(L[i2].c, mul(dv2, L[i2].r * 1.01)), { color: PENCIL, w: 0.75, op: 0.55 * seg(face, 0.15, 0.5), bias: bias - 0.24, sk: 0.6 });
      });
    }
    flush(0, start[0]); flush(1, start[1]);
    g.poly(R[R.length - 1], "ink", { cull: true, w: 1.1, bias: under(L[L.length - 1].c) - 0.01, hatch: 0 });
  }

  // a round slab with smooth sides: wash sides, a pencil loop round the top, the near half of the bottom rim
  function drum(g, ring, z0, z1, mat, bias, o) {
    o = o || {};
    var n = ring.length, top = ring.map(function (q) { return [q[0], q[1], z1]; }), bot = ring.map(function (q) { return [q[0], q[1], z0]; }), vis = [], i;
    for (i = 0; i < n; i++) {
      var j = (i + 1) % n, nrm = norm(cross(sub(bot[j], bot[i]), [0, 0, 1]));
      vis.push(dot(nrm, g.V) > 0);
      g.poly([bot[i], bot[j], top[j], top[i]], mat, { cull: true, stroke: false, bias: bias, hatchAngle: 2, hatch: o.sideHatch });
    }
    g.poly(top, mat, { w: o.w || 1.4, bias: bias - 0.001, hatch: o.topHatch });
    var s0 = -1;
    for (i = 0; i < n; i++) if (vis[i] && !vis[(i + n - 1) % n]) s0 = i;
    if (s0 < 0) return;
    var run = [bot[s0]];
    for (i = s0; vis[i % n] && run.length <= n; i++) run.push(bot[(i + 1) % n]);
    g.path(run, { w: o.rimW || 1.2, bias: bias - 0.002, front: true });
    if (o.edges !== false) { g.line(bot[s0], top[s0], { w: 1, bias: bias - 0.002 }); var e = i % n; g.line(bot[e], top[e], { w: 1, bias: bias - 0.002 }); }
  }

  // ---- stick-built parts
  function slab(g, pts2, z, th, mat, bias) {
    var top = pts2.map(function (q) { return [q[0], q[1], z]; }), bot = pts2.map(function (q) { return [q[0], q[1], z - th]; }), n = pts2.length;
    for (var i = 0; i < n; i++) { var j = (i + 1) % n; g.poly([bot[i], bot[j], top[j], top[i]], mat, { cull: true, w: 1.05, bias: bias, hatch: 0 }); }
    g.poly(top, mat, { w: 1.35, bias: bias - 0.001, hatch: 1 });
  }
  function plank(g, a, b, bias) { g.line(up(a, 0.003), up(b, 0.003), { color: SOFT, w: 0.8, bias: bias - 0.05, sk: 0.7 }); }
  function railing(g, P, h, a, skip) {
    if (a <= 0) return;
    var hh = h * eo(a);
    P.forEach(function (p, i) { if (!(skip && skip.indexOf(i) >= 0 && skip.indexOf(i - 1) >= 0)) g.line(p, up(p, hh), { w: 1.4, bias: under(p) - 0.1 }); });
    inked(g, seg(a, 0.3, 1), function () {
      for (var i = 0; i < P.length - 1; i++) {
        if (skip && skip.indexOf(i) >= 0) continue;
        var bias = under(l3(P[i], P[i + 1], 0.5));
        g.line(up(P[i], h), up(P[i + 1], h), { w: 1.3, bias: bias - 0.12 });
        g.line(up(P[i], h * 0.5), up(P[i + 1], h * 0.5), { color: SOFT, w: 0.85, bias: bias - 0.11 });
      }
    });
  }
  function shingles(g, R, bias) { // R: roof top corners, R[1]-R[2] the eave, R[0]-R[3] the high edge
    var rows = Math.round(Math.hypot(R[0][0] - R[1][0], R[0][1] - R[1][1], R[0][2] - R[1][2]) / 0.08), wide = Math.hypot(R[1][0] - R[2][0], R[1][1] - R[2][1]);
    var cols = Math.round(wide / 0.11), row = function (k) { return [l3(R[1], R[0], k / rows), l3(R[2], R[3], k / rows)]; };
    for (var k = 0; k < rows; k++) {
      var a = row(k), b = row(k + 1);
      if (k > 0) g.line(l3(a[0], a[1], 0.02 + 0.05 * hash(k)), l3(a[0], a[1], 0.93 + 0.05 * hash(k + 9)), { color: SOFT, w: 0.75, bias: bias });
      for (var j = 1; j < cols; j++) {
        var s = (j + (k % 2) * 0.5 + 0.2 * (hash(k * 9 + j) - 0.5)) / cols;
        if (s >= 0.98 || hash(k * 5 + j * 3) < 0.25) continue;
        g.line(l3(a[0], a[1], s), l3(b[0], b[1], s), { color: FAINT, w: 0.65, bias: bias, sk: 0.5 });
      }
    }
  }

  // ---- foliage: little almond leaves with a pencil edge, always facing us like an illustration
  function leafG(g, p, s, ang, tone, bias, op) {
    if (s < 0.5) return;
    op = op === undefined ? 1 : op;
    g.glyph(p, function (x, y) {
      var c = Math.cos(ang), sn = Math.sin(ang), wd = 0.58 + 0.12 * (tone % 2);
      function pt(u, v) { return (x + u * c - v * sn).toFixed(1) + "," + (y + u * sn + v * c).toFixed(1); }
      return '<path d="M' + pt(-s, 0) + "Q" + pt(-s * 0.1, -s * wd) + " " + pt(s, 0) + "Q" + pt(-s * 0.1, s * wd) + " " + pt(-s, 0) + 'Z" fill="' + LEAVES[tone] + '" fill-opacity="0.88" stroke="' + PENCIL +
        '" stroke-width="' + (s > 3.5 ? 0.85 : 0.65) + '" stroke-linejoin="round"' + (op < 1 ? ' opacity="' + op.toFixed(3) + '"' : "") + "/>" +
        (s > 4.2 ? '<path d="M' + pt(-s * 1.25, 0) + "L" + pt(s * 0.5, 0) + '" fill="none" stroke="' + PENCIL + '" stroke-width="0.55" stroke-opacity="' + (0.65 * op).toFixed(2) + '"/>' : "");
    }, { bias: bias });
  }
  function bush(g, c, size, a, seed) {
    if (a <= 0) return;
    var bias = under(c) - 0.06;
    for (var i = 0; i < 15; i++) {
      var p = add(c, [(hash(seed * 13 + i) - 0.5) * 0.32 * size, (hash(seed * 7 + i * 3.1) - 0.5) * 0.32 * size, (hash(seed * 3 + i * 5.7) - 0.35) * 0.22 * size]);
      var tone = i < 5 ? 0 : i < 11 ? 1 : 2, ai = eo(seg(a, i / 15 * 0.5, i / 15 * 0.5 + 0.5));
      leafG(g, p, (6.2 + 3.4 * hash(seed + i * 9.1)) * size * ai, hash(seed * 5 + i * 2.3) * TAU, tone, bias - tone * 0.002);
    }
  }
  function creeper(g, a, len, grow, seed) {
    if (grow <= 0) return;
    var n = 12, pts = [], bias = under(a) - 0.04, i;
    for (i = 0; i <= n; i++) { var s = i / n * len * grow; pts.push([a[0] + 0.03 * Math.sin(s * 9 + seed), a[1] + 0.03 * Math.cos(s * 7 + seed * 1.3), a[2] - s]); }
    g.path(pts, { color: VINE, w: 1.05, bias: bias, sk: 0.4 });
    for (i = 1; i <= n; i++) leafG(g, add(pts[i], [0.025 * (i % 2 ? 1 : -1), 0.012 * (i % 2 ? -1 : 1), 0.01]), 3.9 + 1.8 * hash(seed + i), (i % 2 ? 0.5 : 2.6) + hash(seed * 3 + i) * 0.7, 1 + (i % 2), bias - 0.01);
  }
  function trunkVine(g, z0, z1, turns, ph, grow) { // spirals up the trunk; only the side facing the camera is drawn
    var n = 46, run = [], runB = 0;
    function flush() { if (run.length > 1) g.path(run, { color: VINE, w: 1.15, bias: runB, sk: 0.4 }); run = []; }
    for (var i = 0; i <= n * grow; i++) {
      var f = i / n, z = lerp(z0, z1, f), s = trunkAt(z), ang = ph + f * turns * TAU, dv = [Math.cos(ang), Math.sin(ang), 0];
      var p = add([s.c[0], s.c[1], z], mul(dv, s.r + 0.015)), b = under(p) - 0.3;
      if (dot(dv, g.V) > 0.08) {
        if (run.length && b !== runB) flush();
        runB = b; run.push(p);
        if (i % 3 === 1) leafG(g, add(p, mul(dv, 0.02)), 4.4, ang + 1.2 + hash(i + ph) * 1.5, 1 + (i % 2), b - 0.01);
      } else flush();
    }
    flush();
  }

  // a cabin: walls (sparse hand-drawn boards, hatched where lit), a window each, then the mono-pitch roof
  function cabin(g, P, wa, ra, lit, ga) {
    var hu = P.hu, hv = P.hv, Hs = function (u) { return roofZ(P, u) - P.z; };
    inked(g, wa, function () {
      var C4 = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]];
      for (var k = 0; k < 4; k++) {
        var a = C4[k], b = C4[(k + 1) % 4], A0 = W(P, a[0], a[1], P.z), B0 = W(P, b[0], b[1], P.z), At = up(A0, Hs(a[0])), Bt = up(B0, Hs(b[0]));
        var bias = under(l3(l3(A0, Bt, 0.5), l3(B0, At, 0.5), 0.5)), nrm = norm(cross(sub(B0, A0), [0, 0, 1]));
        g.poly([A0, B0, Bt, At], "paper", { cull: true, w: 1.15, bias: bias, hatchOp: 0.8 });
        if (dot(nrm, g.V) <= 0) continue;
        var o = mul(nrm, 0.004), nb = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.1);
        for (var j = 1; j < nb; j++) {
          if (hash(P.c[0] * 9 + k * 5 + j) < 0.3) continue;
          var fj = (j + 0.25 * (hash(k * 3 + j) - 0.5)) / nb, p = add(l3(A0, B0, fj), o), hj = lerp(Hs(a[0]), Hs(b[0]), fj);
          g.line(up(p, 0.02 + 0.04 * hash(j + k)), up(p, hj * (0.55 + 0.4 * hash(j * 3 + k))), { color: FAINT, w: 0.6, bias: bias - 0.005, sk: 0.6 });
        }
        var gl = seg(wa, 0.55, 1);
        if (gl > 0) {
          var hm = Math.min(Hs(a[0]), Hs(b[0])), g0 = add(l3(A0, B0, 0.18), mul(nrm, 0.008)), g1 = add(l3(A0, B0, 0.82), mul(nrm, 0.008));
          var win = [up(g0, 0.11), up(g1, 0.11), up(g1, hm * 0.78), up(g0, hm * 0.78)];
          inked(g, gl, function () {
            g.poly(win, "sky", { flat: true, w: 1.05, bias: bias - 0.01, hatch: 0 });
            g.line(l3(win[0], win[1], 0.5), l3(win[3], win[2], 0.5), { w: 0.9, bias: bias - 0.013, sk: 0.4 });
            [[0.12, 0.42, 0.62], [0.2, 0.62, 0.74]].forEach(function (r) { // glass: two quick diagonal glints
              g.line(l3(l3(win[0], win[3], r[1]), l3(win[1], win[2], r[1]), r[0]), l3(l3(win[0], win[3], r[2]), l3(win[1], win[2], r[2]), r[0] + 0.14), { color: SOFT, w: 0.75, bias: bias - 0.014, sk: 0.3 });
            });
          });
          if (lit > 0) {
            g.poly(win, GLOW, { flat: true, stroke: false, filter: "soft", fillOp: 1, op: lit * 0.55, bias: bias - 0.011 });
            g.poly(win, GLOW, { flat: true, stroke: false, fillOp: 1, op: lit * 0.42, bias: bias - 0.012 });
          }
        }
      }
    });
    inked(g, ra, function () { roof(g, P, P.green, ga); });
  }
  function roof(g, P, green, ga) {
    var ov = 0.07, RT = 0.05;
    var R4 = [[-P.hu - ov, -P.hv - ov], [P.hu + ov, -P.hv - ov], [P.hu + ov, P.hv + ov], [-P.hu - ov, P.hv + ov]];
    var top = R4.map(function (q) { return W(P, q[0], q[1], roofZ(P, q[0]) + RT); }), bot = R4.map(function (q) { return W(P, q[0], q[1], roofZ(P, q[0])); });
    var bias = under(l3(top[0], top[2], 0.5)) - 0.02, nrm = norm(cross(sub(top[1], top[0]), sub(top[2], top[0])));
    for (var k = 0; k < 4; k++) g.poly([bot[k], bot[(k + 1) % 4], top[(k + 1) % 4], top[k]], "foil", { cull: true, w: 1.05, bias: bias, hatch: 0 });
    g.poly(top, green ? "wood" : "foil", { cull: true, w: 1.3, bias: bias - 0.001, hatch: green ? 0 : 1, hatchAngle: 0 });
    g.poly(bot.slice().reverse(), "foil", { cull: true, w: 1.05, bias: bias, hatch: 0 });
    if (dot(nrm, g.V) <= 0) return;
    if (!green) inked(g, seg(g.ink, 0.5, 1), function () { shingles(g, top, bias - 0.01); });
    if (green && ga > 0) for (var i = 0; i < 6; i++) for (var j = 0; j < 7; j++) { // a planted roof fills in
      var a = eo(seg(ga, hash(i * 7 + j) * 0.6, hash(i * 7 + j) * 0.6 + 0.4)), fu = (i + 0.5) / 6 + (hash(i + j * 3) - 0.5) * 0.08, fv = (j + 0.5) / 7 + (hash(i * 5 + j) - 0.5) * 0.08;
      if (a > 0) leafG(g, up(l3(l3(top[0], top[1], fu), l3(top[3], top[2], fu), fv), 0.015), 4.6 * a, hash(i * 3 + j * 7) * TAU, (i + j) % 3, bias - 0.02);
    }
  }

  // ---- the figure (route as treehouse/)
  var SLIDE = (function () {
    var a = polar(L1.c, 0.93, SLA, L1.z), o = [Math.cos(SLA * RAD), Math.sin(SLA * RAD)];
    return [a, [a[0] + o[0] * 0.5, a[1] + o[1] * 0.5, 0.86], [-1.7, 0.95, 0.32], [-2.1, 1.05, 0.04]];
  })();
  function figure(g, p, s, sit) {
    var b = under(p) - 0.3, h = (sit ? 0.13 : 0.2) * s;
    g.line(up(p, 0.02), up(p, h), { color: PENCIL, w: 8.6 * s, bias: b, sk: 0 });
    g.line(up(p, 0.02), up(p, h), { color: OR, w: 6 * s, bias: b - 0.01, sk: 0 });
    g.dot(up(p, h + 0.09 * s), 5.4 * s, OR, { bias: b - 0.02, w: 1.3 });
  }
  function figureAt(t) {
    if (t < 0.65) return null;
    var s = back(seg(t, 0.65, 0.67)), climb = seg(t, 0.67, 0.745), step = eio(seg(t, 0.745, 0.765)), walk = eio(seg(t, 0.765, 0.8));
    var go = eio(seg(t, 0.8, 0.81)), slide = seg(t, 0.81, 0.865), land = seg(t, 0.865, 0.895);
    if (slide >= 1) {
      var T = norm(sub(SLIDE[3], SLIDE[2])), off = 0.3 * eo(land);
      return { p: [SLIDE[3][0] + T[0] * off, SLIDE[3][1] + T[1] * off, 0.04 * (1 - land) + 0.1 * Math.sin(Math.PI * land)], s: 1, sit: land < 0.5 };
    }
    if (slide > 0) return { p: up(bez(SLIDE, Math.pow(slide, 1.6)), 0.04), s: 1, sit: true };
    if (go > 0) return { p: polar(L1.c, lerp(0.66, 0.9, go), lerp(SLA + 8, SLA, go), L1.z), s: 1 };
    if (walk > 0) return { p: polar(L1.c, 0.66, lerp(LAD, SLA + 8, walk), L1.z), s: 1 };
    if (step > 0) return { p: polar(L1.c, lerp(1.12, 0.66, step), LAD, L1.z + 0.06 * Math.sin(Math.PI * step)), s: 1 };
    var z = lerp(ZB, L1.z, climb) + 0.03 * Math.abs(Math.sin(climb * Math.PI * 7));
    return { p: polar(L1.c, 1.12, LAD, z), s: s };
  }

  // ---- the ground: a soft shadow, a few loose ground strokes and grass tufts instead of a grid
  function logRing(z, sc) { var o = []; for (var k = 0; k < 32; k++) { var th = k / 32 * TAU, r = (1.75 + 0.12 * Math.sin(3 * th + 0.5) + 0.07 * Math.cos(5 * th)) * sc; o.push([0.05 + r * Math.cos(th), 0.05 + r * Math.sin(th), z]); } return o; }
  function ground(g, a, grass) {
    if (a <= 0) return;
    var sh = []; for (var k = 0; k < 36; k++) { var th = k / 36 * TAU; sh.push([0.25 + 2.35 * Math.cos(th), 0.3 + 2.1 * Math.sin(th), 0]); }
    g.poly(sh, g.T.shadow, { flat: true, stroke: false, filter: "softer", op: a, bias: 60 });
    inked(g, a, function () {
      [[2.25, 206, 246], [2.32, 262, 296], [2.62, 236, 256], [2.12, 312, 334], [2.45, 158, 178], [2.9, 270, 282], [2.05, 40, 66]].forEach(function (r, i) {
        var pts = []; for (var j = 0; j <= 10; j++) pts.push(polar([0.05, 0.05], r[0] + 0.05 * Math.sin(j * 1.3 + i), lerp(r[1], r[2], j / 10), 0));
        g.path(pts, { color: i === 4 ? FAINT : SOFT, w: 0.95, bias: 50 });
      });
    });
    if (grass > 0) for (var tf = 0; tf < 15; tf++) { // tufts round the log
      var th2 = tf * 24 + 9 * hash(tf), base = polar([0.05, 0.05], 1.95 + 0.25 * hash(tf + 3), th2, 0), gr = eo(seg(grass, tf / 15 * 0.5, tf / 15 * 0.5 + 0.5));
      for (var bl = 0; bl < 4; bl++) {
        var lean = (bl - 1.5) * 0.06 + 0.04 * (hash(tf * 4 + bl) - 0.5), h = (0.12 + 0.12 * hash(tf * 7 + bl)) * gr;
        g.line(add(base, [lean * 0.3, -lean * 0.2, 0]), add(base, [lean * 1.4, -lean, h]), { color: bl % 2 ? VINE : PENCIL, w: 0.9, op: 0.8, bias: 0.4, sk: 0.3 });
      }
    }
  }
  function fireflies(g, t, a) {
    if (a <= 0) return;
    for (var i = 0; i < 11; i++) {
      var ph = hash(i * 3.7) * TAU, r = 1.35 + 1.15 * hash(i * 1.3), sp = 0.5 + 0.7 * hash(i * 2.2), ang = ph + (t - 0.6) * TAU * sp * (i % 2 ? 1 : -1);
      var p = [0.1 + r * Math.cos(ang), 0.1 + r * Math.sin(ang), 0.7 + 3.9 * hash(i * 5.1) + 0.22 * Math.sin((t - 0.6) * TAU * 2 * sp + ph)];
      var o = a * seg(a * 11 - i * 0.6, 0, 1) * (0.45 + 0.55 * Math.abs(Math.sin((t - 0.6) * TAU * (2 + i % 3) + ph)));
      if (o <= 0.01) continue;
      g.glyph(p, function (x, y) {
        return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" fill="' + GLOW + '" opacity="' + (o * 0.55).toFixed(3) + '" filter="url(#soft)"/>' +
          '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.6" fill="#FFF9E6" opacity="' + o.toFixed(3) + '"/>';
      }, { bias: -0.05 });
    }
  }

  WL.define("treehouse-sketch", {
    cam: { yaw: 24, pitch: 15, S: 56, spin: 36, z: 1.75, cy: 0.88, boil: 75 },
    draw: function (g, t) {
      LEAVES = g.T.leaves || ["#2C7458", "#5AAB84", "#A9DDB9"]; VINE = g.T.vine || "#B5E3C3"; // per paper
      var ga = seg(t, 0.58, 0.68), lit = seg(t, 0.62, 0.65);

      // ---- the ground and the log slice, sketched in
      var ba = seg(t, 0.005, 0.1);
      ground(g, ba, ga);
      inked(g, ba, function () {
        drum(g, logRing(0, 1).map(function (q) { return [q[0], q[1]]; }), 0, ZB, "paper", 6, { topHatch: 1, rimW: 1.4 });
        [0.8, 0.58, 0.36].forEach(function (sc, i) { var r = logRing(ZB + 0.002, sc); g.path(r, { color: SOFT, w: 0.9, closed: true, bias: 5.9 - i * 0.001 }); });
        [[25, 0.4, 0.95], [140, 0.2, 0.7], [255, 0.5, 0.92]].forEach(function (c) { // drying cracks across the rings
          g.path([polar([0.05, 0.05], c[1] * 1.75, c[0], ZB + 0.003), polar([0.05, 0.05], lerp(c[1], c[2], 0.5) * 1.75, c[0] + 4, ZB + 0.003), polar([0.05, 0.05], c[2] * 1.75, c[0] - 2, ZB + 0.003)], { color: FAINT, w: 0.8, bias: 5.89 });
        });
        var bt = logRing(ZB, 1), bb = logRing(0, 1);
        for (var i = 0; i < 32; i += 2) { // bark on the near side of the log
          var nrm = norm(sub(bb[i], [0.05, 0.05, 0])); nrm[2] = 0;
          if (dot(nrm, g.V) < 0.3) continue;
          var fz = 0.25 + 0.3 * hash(i);
          g.line(l3(bb[i], bt[i], fz - 0.15), l3(bb[i], bt[i], fz + 0.45), { color: SOFT, w: 0.7, bias: 5.95, sk: 0.4 });
        }
      });

      // ---- the branch grows out of it, then the struts for each level just before its deck
      drawLimb(g, TRUNK, eio(seg(t, 0.05, 0.13)));
      TWIGS.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, 0.11 + i * 0.012, 0.17 + i * 0.012))); });
      L1STRUTS.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, 0.11 + i * 0.01, 0.16 + i * 0.01))); });
      PODS.forEach(function (P) { P.S.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, P.t0 - 0.07 + i * 0.01, P.t0 - 0.02 + i * 0.01))); }); });
      TOPSTRUTS.forEach(function (S, i) { drawLimb(g, S, eio(seg(t, 0.47 + i * 0.01, 0.52 + i * 0.01))); });

      // ---- level 1: a round deck wrapped round the trunk
      var la = seg(t, 0.14, 0.22), lb = under([L1.c[0], L1.c[1], L1.z]) + 0.15;
      inked(g, la, function () {
        var disc = []; for (var dk = 0; dk < 20; dk++) { var q = polar(L1.c, L1.r, dk * 18, 0); disc.push([q[0], q[1]]); }
        drum(g, disc, L1.z - TH, L1.z, "wood", lb, { topHatch: 1, sideHatch: 0 });
        inked(g, seg(la, 0.4, 1), function () { for (var pd = 0; pd < 360; pd += 20) plank(g, polar(L1.c, 0.3, pd + 4 * hash(pd), L1.z), polar(L1.c, L1.r - 0.04, pd, L1.z), lb); });
      });
      var lp = []; for (var pj = 0; pj <= 16; pj++) lp.push(polar(L1.c, L1.r - 0.04, 11.25 + pj * 22.5, L1.z));
      var skip = []; for (var bj = 0; bj < 16; bj++) { var mid = 22.5 + bj * 22.5; if ((mid > 60 && mid < 120) || Math.abs(mid - SLA) < 12 || Math.abs(mid - LAD) < 12) skip.push(bj); }
      railing(g, lp, 0.24, seg(t, 0.2, 0.25), skip);

      // ---- the cabins, one level at a time
      PODS.forEach(function (P) {
        var t0 = P.t0;
        if (P.deck) inked(g, seg(t, t0 - 0.04, t0 + 0.03), function () {
          var D = P.deck, bias = under(W(P, (D[0] + D[1]) / 2, (D[2] + D[3]) / 2, P.z)) + 0.15;
          var pts = [[D[0], D[2]], [D[1], D[2]], [D[1], D[3]], [D[0], D[3]]].map(function (q) { var w = W(P, q[0], q[1], 0); return [w[0], w[1]]; });
          slab(g, pts, P.z, TH, "wood", bias);
          inked(g, seg(g.ink, 0.4, 1), function () { for (var v = D[2] + 0.12; v < D[3] - 0.05; v += 0.12) plank(g, W(P, D[0] + 0.03 + 0.04 * hash(v * 9), v, P.z), W(P, D[1] - 0.03 - 0.04 * hash(v * 7), v, P.z), bias); });
        });
        var rl = seg(t, t0 + 0.05, t0 + 0.09);
        if (P.deck && rl > 0) P.rails.forEach(function (sd) {
          var D = P.deck, e = 0.04, a = sd === "u0" ? [D[0] + e, D[2] + e] : sd === "u1" ? [D[1] - e, D[2] + e] : sd === "v0" ? [D[0] + e, D[2] + e] : [D[0] + e, D[3] - e];
          var b = sd === "u0" ? [D[0] + e, D[3] - e] : sd === "u1" ? [D[1] - e, D[3] - e] : sd === "v0" ? [D[1] - e, D[2] + e] : [D[1] - e, D[3] - e];
          var n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.28)), posts = [];
          for (var k = 0; k <= n; k++) posts.push(W(P, lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n), P.z));
          railing(g, posts, 0.22, rl);
        });
        cabin(g, P, seg(t, t0 + 0.02, t0 + 0.08), seg(t, t0 + 0.06, t0 + 0.11), lit, ga);
      });

      // ---- the lookout: round deck and rail, then a canopy on four posts, pierced by the twigs
      inked(g, seg(t, 0.505, 0.565), function () {
        var od = []; for (var ok = 0; ok < 16; ok++) { var oq = polar(TOP.c, TOP.r, ok * 22.5, 0); od.push([oq[0], oq[1]]); }
        drum(g, od, TOP.z - TH, TOP.z, "wood", 0.15, { topHatch: 1, sideHatch: 0 });
        inked(g, seg(g.ink, 0.4, 1), function () { for (var cy = -0.3; cy <= 0.31; cy += 0.15) { var hw = Math.sqrt(Math.max(0, TOP.r * TOP.r - cy * cy)) - 0.04; plank(g, [TOP.c[0] - hw, TOP.c[1] + cy, TOP.z], [TOP.c[0] + hw, TOP.c[1] + cy, TOP.z], 0.15); } });
      });
      var nest = []; for (var nk = 0; nk <= 8; nk++) nest.push(polar(TOP.c, TOP.r - 0.04, nk * 45 + 10, TOP.z));
      railing(g, nest, 0.22, seg(t, 0.55, 0.58));
      var cp = seg(t, 0.57, 0.6);
      if (cp > 0) [[-0.33, -0.33], [0.33, -0.33], [0.33, 0.33], [-0.33, 0.33]].forEach(function (q) {
        var b = W(TOP, q[0], q[1], TOP.z); g.line(b, up(b, (roofZ(TOP, q[0]) - TOP.z) * eo(cp)), { w: 1.6, bias: -0.1 });
      });
      inked(g, seg(t, 0.59, 0.64), function () { roof(g, TOP, false, 0); });

      // ---- rope ladder and slide off the bottom deck
      var rld = eo(seg(t, 0.56, 0.6));
      if (rld > 0) {
        var tp = polar(L1.c, L1.r - 0.02, LAD, L1.z), tg = [-Math.sin(LAD * RAD) * 0.11, Math.cos(LAD * RAD) * 0.11, 0], len = (L1.z - ZB) * rld;
        [1, -1].forEach(function (sg) {
          var r0 = add(tp, mul(tg, sg)), rp = []; for (var j = 0; j <= 6; j++) { var sw = 0.012 * Math.sin(j * 1.9 + sg); rp.push([r0[0] - sw, r0[1] + sw, r0[2] - len * j / 6]); }
          g.path(rp, { color: PENCIL, w: 1.15, bias: -0.1, sk: 0.4 });
        });
        for (var rz = 0.12; rz <= len; rz += 0.12) g.line(up(add(tp, tg), -rz), up(sub(tp, tg), -rz - 0.012), { w: 1.7, bias: -0.11, sk: 0.4 });
      }
      var sa3 = eo(seg(t, 0.57, 0.62));
      if (sa3 > 0) {
        var C = [], n3 = 18;
        for (var si = 0; si <= n3; si++) C.push(bez(SLIDE, sa3 * si / n3));
        var E3 = C.map(function (c, i3) { var Tn = norm(sub(C[Math.min(i3 + 1, n3)], C[Math.max(i3 - 1, 0)])), w3 = mul(norm(cross(Tn, [0, 0, 1])), 0.15); return { L: sub(c, w3), R: add(c, w3) }; });
        for (var i4 = 0; i4 < n3; i4++) {
          var a4 = E3[i4], b4 = E3[i4 + 1], bias4 = under(l3(C[i4], C[i4 + 1], 0.5));
          g.poly([a4.L, a4.R, b4.R, b4.L], "brand", { stroke: false, bias: bias4, hatch: 1, hatchAngle: 1 });
          g.poly([a4.L, b4.L, up(b4.L, 0.07), up(a4.L, 0.07)], "sky", { stroke: false, bias: bias4 - 0.02 });
          g.poly([a4.R, b4.R, up(b4.R, 0.07), up(a4.R, 0.07)], "sky", { stroke: false, bias: bias4 - 0.02 });
          [[a4.L, b4.L, 0.9], [a4.R, b4.R, 0.9], [up(a4.L, 0.07), up(b4.L, 0.07), 1.25], [up(a4.R, 0.07), up(b4.R, 0.07), 1.25]].forEach(function (e) { g.line(e[0], e[1], { w: e[2], bias: bias4 - 0.021, sk: 0.25 }); });
        }
        if (sa3 > 0.6) { var mid2 = bez(SLIDE, 0.5); g.line(mid2, [mid2[0], mid2[1], Math.hypot(mid2[0] - 0.05, mid2[1] - 0.05) < 1.7 ? ZB : 0], { w: 1.6, bias: 0.05 }); }
      }

      // ---- greenery: creepers climb the trunk and hang off the decks, leaves on twigs, planters
      if (ga > 0) {
        trunkVine(g, ZB + 0.02, L1.z - 0.06, 1.6, 0.4, eo(seg(ga, 0, 0.6)));
        trunkVine(g, L1.z + 0.05, 2.75, 1.1, 2.2, eo(seg(ga, 0.15, 0.8)));
        trunkVine(g, 2.9, 4.25, 0.9, 4.0, eo(seg(ga, 0.3, 0.95)));
        var hang = [
          [polar(L1.c, L1.r + 0.03, 228, L1.z - TH), 0.42], [polar(L1.c, L1.r + 0.03, 258, L1.z - TH), 0.32],
          [W(PODS[1], -0.05, 0.68, PODS[1].z - TH), 0.6], [W(PODS[1], -0.4, 0.68, PODS[1].z - TH), 0.4],
          [W(PODS[2], 0.78, 0.2, PODS[2].z - TH), 0.7], [W(PODS[2], 0.78, -0.35, PODS[2].z - TH), 0.48], [W(PODS[2], 0.3, -0.63, PODS[2].z - TH), 0.4],
          [W(PODS[3], -0.53, 0.1, PODS[3].z - TH), 0.45], [W(TOP, 0.2, -0.49, roofZ(TOP, 0.2)), 0.3]
        ];
        hang.forEach(function (h, i) { creeper(g, h[0], h[1], eo(seg(ga, 0.1 + i * 0.05, 0.6 + i * 0.04)), i * 1.7); });
        var B = [
          [TWIGS[1][TWIGS[1].length - 1].c, 1.15], [TWIGS[2][TWIGS[2].length - 1].c, 1.15], [TWIGS[3][TWIGS[3].length - 1].c, 1.35], [TWIGS[3][4].c, 0.85], [TWIGS[0][TWIGS[0].length - 1].c, 0.8],
          [polar(L1.c, 0.8, 20, L1.z + 0.06), 0.8], [polar(L1.c, 0.8, 135, L1.z + 0.06), 0.8],
          [W(PODS[2], 0.68, 0.52, PODS[2].z + 0.06), 0.8], [W(PODS[2], 0.68, -0.52, PODS[2].z + 0.06), 0.8], [W(PODS[3], -0.42, 0.42, PODS[3].z + 0.06), 0.7],
          [polar([0.05, 0.05], 1.3, 60, ZB + 0.03), 0.7], [polar([0.05, 0.05], 1.35, 215, ZB + 0.03), 0.8], [polar([0.05, 0.05], 1.25, 250, ZB + 0.03), 0.6],
          [polar([0.05, 0.05], 0.42, 235, ZB + 0.03), 0.6], [polar([0.05, 0.05], 1.3, 20, ZB + 0.03), 0.6]
        ];
        B.forEach(function (b, i) { bush(g, b[0], b[1], eo(seg(ga, 0.05 + i * 0.04, 0.3 + i * 0.04)), i + 1); });
      }

      // ---- the flag goes up on the tallest twig; fireflies come out with the lights
      var fa = seg(t, 0.63, 0.66);
      if (fa > 0) {
        var tw = TWIGS[0], fb = tw[tw.length - 3].c, ftop = up(fb, 0.42 * back(fa)), wv = Math.sin(t * TAU * 5);
        g.line(fb, ftop, { w: 1.6, bias: -0.6, sk: 0.3 });
        var fd = [Math.cos((-40 + 10 * wv) * RAD), Math.sin((-40 + 10 * wv) * RAD), 0];
        if (fa > 0.3) g.poly([ftop, up(ftop, -0.18), add(up(ftop, -0.1 + 0.03 * wv), mul(fd, 0.3))], OR, { flat: true, w: 1.1, bias: -0.61, sk: 0.4 });
      }
      fireflies(g, t, seg(t, 0.64, 0.72));

      // ---- a scale figure tries it out
      var fg = figureAt(t);
      if (fg) figure(g, fg.p, fg.s * 1.35, fg.sit);
    }
  });
})();

  self.WLS = WL;
})();
