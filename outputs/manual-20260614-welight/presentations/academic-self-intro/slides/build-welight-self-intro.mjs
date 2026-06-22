import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Presentation, PresentationFile } from "@oai/artifact-tool";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(__dirname, "..");
const root = path.resolve(workspace, "..", "..", "..", "..");
const outDir = path.join(workspace, "output");
const previewDir = path.join(workspace, "preview");
const layoutDir = path.join(workspace, "layout");
const finalPptx = path.join(outDir, "Shenshi-Li-WeLight-Academic-Self-Introduction.pptx");

const W = 1280;
const H = 720;
const C = {
  bg: "#F7FAFC",
  bg2: "#EDF5FA",
  navy: "#0B1F33",
  ink: "#1D2B3A",
  muted: "#5E7184",
  line: "#C8D7E3",
  pale: "#E7F4F8",
  card: "#FFFFFF",
  cyan: "#12A7C8",
  blue: "#1F5F99",
  green: "#18A999",
  orange: "#F28C28",
  red: "#C94B4B",
  violet: "#6A6FB3",
};

const fonts = {
  title: "Aptos Display",
  body: "Aptos",
  mono: "Aptos Mono",
};

const A = {
  portrait: path.join(root, "assets", "profile-personal.jpg"),
  dffPanel: path.join(root, "assets", "projects", "covers", "dff-synthetic-panel-web.jpg"),
  dffSurface: path.join(root, "assets", "projects", "covers", "dff-detail-surface-web.jpg"),
  dffReal: path.join(root, "assets", "projects", "covers", "dff-detail-real-web.jpg"),
  solarGui: path.join(root, "assets", "projects", "covers", "solar-detail-gui-web.jpg"),
  depthCover: path.join(root, "assets", "projects", "covers", "depth-cover-web.jpg"),
  depthGui: path.join(root, "assets", "projects", "covers", "depth-detail-gui-web.jpg"),
  depthBottom: path.join(root, "assets", "projects", "covers", "depth-detail-bottom-web.jpg"),
  zemax2025: path.join(root, "assets", "projects", "covers", "experience-zemax-2025.jpg"),
  zemax2026: path.join(root, "assets", "projects", "covers", "experience-zemax-2026.jpg"),
  zemaxSystem: path.join(root, "assets", "projects", "covers", "experience-zemax-system.jpg"),
  legoModule: path.join(root, "assets", "projects", "covers", "experience-lego-module.jpg"),
  legoLayout: path.join(root, "assets", "projects", "covers", "experience-lego-layout.jpg"),
  glass: path.join(root, "assets", "projects", "covers", "glass-material-explorer-preview.jpg"),
};

function frame(x, y, width, height) {
  return { left: x, top: y, width, height };
}

function normFrame(opts) {
  return frame(opts.x, opts.y, opts.w ?? opts.width, opts.h ?? opts.height);
}

function addShape(slide, opts) {
  return slide.shapes.add({
    geometry: opts.geometry ?? "rect",
    position: normFrame(opts),
    fill: opts.fill ?? "#00000000",
    line: opts.line ?? { style: "solid", fill: "#00000000", width: 0 },
    name: opts.name,
  });
}

function addText(slide, text, opts) {
  const box = addShape(slide, {
    ...opts,
    fill: opts.fill ?? "#00000000",
    line: opts.line ?? { style: "solid", fill: "#00000000", width: 0 },
  });
  box.text = text;
  box.text.fontSize = opts.size ?? 24;
  box.text.color = opts.color ?? C.ink;
  box.text.bold = Boolean(opts.bold);
  box.text.typeface = opts.face ?? fonts.body;
  box.text.alignment = opts.align ?? "left";
  box.text.verticalAlignment = opts.valign ?? "top";
  box.text.insets = opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 };
  return box;
}

async function addImage(slide, imgPath, opts = {}) {
  const image = slide.images.add({
    blob: await fs.readFile(imgPath),
    fit: opts.fit ?? "cover",
    alt: opts.alt ?? path.basename(imgPath),
    name: opts.name,
  });
  image.position = normFrame(opts);
  return image;
}

function addLine(slide, x1, y1, x2, y2, opts = {}) {
  const width = opts.width ?? 2;
  const color = opts.color ?? C.line;
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  if (dx >= dy) {
    return addShape(slide, {
      x: minX,
      y: (y1 + y2) / 2 - width / 2,
      w: Math.max(dx, width),
      h: width,
      fill: color,
    });
  }
  return addShape(slide, {
    x: (x1 + x2) / 2 - width / 2,
    y: minY,
    w: width,
    h: Math.max(dy, width),
    fill: color,
  });
}

function addFooter(slide, n, total = 16) {
  addText(slide, "Shenshi Li | ZJU Optics | June 2026", {
    x: 54, y: 682, w: 360, h: 18, size: 11, color: "#6E8090",
  });
  addText(slide, `${n}/${total}`, {
    x: 1160, y: 682, w: 66, h: 18, size: 11, color: "#6E8090", align: "right",
  });
}

function addTopRule(slide, accent = C.cyan) {
  addShape(slide, { x: 54, y: 48, w: 78, h: 4, fill: accent });
  addShape(slide, { x: 140, y: 48, w: 1086, h: 1.2, fill: C.line });
}

function addTitle(slide, title, subtitle, n, opts = {}) {
  addTopRule(slide, opts.accent ?? C.cyan);
  addText(slide, title, {
    x: 54, y: 70, w: 900, h: opts.h ?? 78, size: opts.size ?? 31, color: C.navy, bold: true, face: fonts.title,
  });
  if (subtitle) {
    addText(slide, subtitle, {
      x: 56, y: opts.subY ?? 146, w: 880, h: 38, size: 15, color: C.muted,
    });
  }
  addFooter(slide, n);
}

function card(slide, x, y, w, h, opts = {}) {
  return addShape(slide, {
    x, y, w, h,
    fill: opts.fill ?? C.card,
    line: opts.line ?? { style: "solid", fill: opts.stroke ?? "#D9E5EE", width: opts.width ?? 1.2 },
    geometry: "roundRect",
  });
}

function chip(slide, text, x, y, w, opts = {}) {
  card(slide, x, y, w, opts.h ?? 30, {
    fill: opts.fill ?? C.pale,
    stroke: opts.stroke ?? "#BBDDEA",
    width: 1,
  });
  addText(slide, text, {
    x: x + 12, y: y + 7, w: w - 24, h: 17, size: opts.size ?? 11.5, color: opts.color ?? C.blue, bold: opts.bold ?? true,
    align: opts.align ?? "center",
  });
}

function bullet(slide, text, x, y, w, opts = {}) {
  addShape(slide, { x, y: y + 7, w: 7, h: 7, fill: opts.dot ?? C.cyan, geometry: "ellipse" });
  addText(slide, text, {
    x: x + 16, y, w, h: opts.h ?? 26, size: opts.size ?? 14, color: opts.color ?? C.ink,
  });
}

function miniLabel(slide, label, x, y, w, opts = {}) {
  addText(slide, label, {
    x, y, w, h: opts.h ?? 22, size: opts.size ?? 12, color: opts.color ?? C.muted, bold: opts.bold ?? true,
    align: opts.align ?? "left",
  });
}

function addSectionTag(slide, text, x, y, color = C.blue) {
  addText(slide, text.toUpperCase(), {
    x, y, w: 250, h: 18, size: 10.5, color, bold: true, face: fonts.mono,
  });
}

function arrow(slide, x1, y1, x2, y2, color = C.cyan) {
  addLine(slide, x1, y1, x2, y2, { color, width: 2.4 });
  addShape(slide, { x: x2 - 4, y: y2 - 4, w: 8, h: 8, fill: color, geometry: "ellipse" });
}

function metricCard(slide, value, label, x, y, w, color = C.cyan) {
  card(slide, x, y, w, 82, { fill: "#FFFFFF", stroke: "#D6E5EE" });
  addShape(slide, { x, y, w: 5, h: 82, fill: color });
  addText(slide, value, { x: x + 18, y: y + 14, w: w - 30, h: 30, size: 24, color: C.navy, bold: true, face: fonts.title });
  addText(slide, label, { x: x + 18, y: y + 48, w: w - 30, h: 22, size: 12.5, color: C.muted });
}

function addCitation(slide, text) {
  addText(slide, text, { x: 54, y: 654, w: 910, h: 18, size: 9.5, color: "#8292A0" });
}

function background(slide) {
  slide.background.fill = C.bg;
  addShape(slide, { x: 0, y: 0, w: W, h: H, fill: C.bg });
  addShape(slide, { x: 980, y: -90, w: 360, h: 360, fill: "#E1F4F7", geometry: "ellipse", line: { style: "solid", fill: "#00000000", width: 0 } });
  addShape(slide, { x: -120, y: 515, w: 300, h: 300, fill: "#EAF1F7", geometry: "ellipse", line: { style: "solid", fill: "#00000000", width: 0 } });
}

async function slide01(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addShape(slide, { x: 0, y: 0, w: W, h: H, fill: "#F5FAFC" });
  addShape(slide, { x: 0, y: 0, w: W, h: H, fill: "linear(105deg, #F7FAFC 0%, #F2FAFC 52%, #E9F5FA 100%)" });
  await addImage(slide, A.dffPanel, { x: 758, y: 64, w: 420, h: 240, fit: "cover", alt: "DFF reconstruction panel" });
  await addImage(slide, A.zemax2025, { x: 802, y: 324, w: 350, h: 170, fit: "cover", alt: "Zemax lens design layout" });
  await addImage(slide, A.depthGui, { x: 744, y: 512, w: 220, h: 112, fit: "cover", alt: "Depth ratio detector GUI" });
  addShape(slide, { x: 725, y: 42, w: 486, h: 612, fill: "#FFFFFF33", line: { style: "solid", fill: "#C8D7E399", width: 1.1 }, geometry: "roundRect" });
  addShape(slide, { x: 54, y: 54, w: 90, h: 5, fill: C.cyan });
  addText(slide, "Shenshi Li", { x: 54, y: 96, w: 480, h: 60, size: 47, bold: true, color: C.navy, face: fonts.title });
  addText(slide, "李申适", { x: 55, y: 154, w: 180, h: 30, size: 22, color: C.blue, bold: true });
  addText(slide, "Computational Imaging, Optical Metrology,\nand 3D Reconstruction", {
    x: 54, y: 208, w: 620, h: 102, size: 35, bold: true, color: C.ink, face: fonts.title,
  });
  addText(slide, "B.Eng. Student in Optoelectronic Information Science and Engineering\nCollege of Optical Science and Engineering, Zhejiang University\nExpected graduation: June 2027", {
    x: 58, y: 338, w: 570, h: 78, size: 17, color: C.muted,
  });
  card(slide, 58, 448, 560, 74, { fill: "#FFFFFFDD", stroke: "#D8E8F0" });
  addText(slide, "Meeting with Prof. Evan Peng / WeLight Lab team", { x: 82, y: 466, w: 510, h: 22, size: 16, color: C.navy, bold: true });
  addText(slide, "June 17, 2026 | 8-10 min academic self-introduction", { x: 82, y: 493, w: 510, h: 20, size: 13.5, color: C.muted });
  addText(slide, "3230105050@zju.edu.cn  |  lssnake0105.github.io/profile/", { x: 58, y: 602, w: 620, h: 24, size: 13, color: C.blue });
  addFooter(slide, 1);
}

async function slide02(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "My training connects optical systems, imaging algorithms, and reproducible research software.", "One-minute profile", 2, { h: 72 });
  card(slide, 54, 170, 215, 250, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addShape(slide, { x: 106, y: 206, w: 110, h: 110, fill: "#E9F8FB", geometry: "ellipse", line: { style: "solid", fill: "#B9E2EA", width: 1.2 } });
  addText(slide, "SL", { x: 106, y: 236, w: 110, h: 44, size: 36, color: C.blue, bold: true, face: fonts.title, align: "center" });
  addText(slide, "Shenshi Li", { x: 72, y: 342, w: 180, h: 28, size: 19, color: C.navy, bold: true, face: fonts.title, align: "center" });
  addText(slide, "ZJU Optics\nB.Eng. 2023-2027\nOptoelectronic Information\nScience and Engineering", { x: 72, y: 374, w: 180, h: 72, size: 12.5, color: C.muted, align: "center" });
  metricCard(slide, "3.94/4.00", "GPA, ranked 18/103", 316, 176, 178, C.cyan);
  metricCard(slide, "2024", "National Scholarship", 516, 176, 178, C.orange);
  metricCard(slide, "108", "TOEFL score", 716, 176, 178, C.green);
  metricCard(slide, "5", "Optics-focused projects", 916, 176, 178, C.violet);
  const cols = [
    ["Optical Systems", "Zemax lens design\nConfocal microscopy concept\nFluorescence microscope prototype", C.blue],
    ["Vision Algorithms", "Depth-from-focus reconstruction\nOpenCV measurement software\nUNet-style segmentation workflow", C.green],
    ["Research Software", "Python pipelines\nReproducible figures and reports\nGUI tools for parameter tuning", C.cyan],
  ];
  cols.forEach(([head, body, color], i) => {
    const x = 316 + i * 270;
    card(slide, x, 318, 242, 178, { fill: "#FFFFFF", stroke: "#DCE8EF" });
    addShape(slide, { x: x + 20, y: 337, w: 34, h: 34, fill: color, geometry: "ellipse" });
    addText(slide, head, { x: x + 68, y: 337, w: 148, h: 28, size: 16, color: C.navy, bold: true });
    addText(slide, body, { x: x + 24, y: 388, w: 198, h: 82, size: 13.6, color: C.ink });
  });
  chip(slide, "Computational imaging", 318, 536, 164);
  chip(slide, "Optical metrology", 494, 536, 145, { fill: "#EEF9F5", stroke: "#BDE4DB", color: "#15826F" });
  chip(slide, "3D reconstruction", 652, 536, 143, { fill: "#F5F2FB", stroke: "#D5D2EF", color: "#575BA0" });
  chip(slide, "Optics-AI co-design", 808, 536, 166, { fill: "#FFF5E8", stroke: "#F6D4AA", color: "#A86016" });
}

async function slide03(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "My projects have moved from optical measurement to computational reconstruction and defect analysis.", "Research trajectory", 3);
  const y = 348;
  addLine(slide, 98, y, 1178, y, { color: "#B7CAD8", width: 2.2 });
  const items = [
    ["2024.05", "Research Initiation\nCamp", "Proposal writing,\nliterature review,\nposter training", C.violet, null],
    ["2024.11", "LEGO-based\nfluorescence microscope", "Mechanical modules,\nZemax optical path,\nworking prototype", C.green, A.legoModule],
    ["2025.05", "Micro-hole\nmetrology", "Confocal scanning idea,\nOpenCV aperture fitting,\naspect-ratio calculator", C.orange, A.depthCover],
    ["2025.04", "DFF defect\nreconstruction", "Focus-stack imaging,\nDFF + learning,\nheterogeneous surfaces", C.cyan, A.dffSurface],
    ["2025.06", "Mirrorless camera\nlens design", "Zemax optimization,\nMTF/tolerance,\nMonte Carlo yield", C.blue, A.zemax2025],
  ];
  for (let i = 0; i < items.length; i += 1) {
    const [date, title, body, color, img] = items[i];
    const x = 78 + i * 225;
    addShape(slide, { x: x + 60, y: y - 12, w: 24, h: 24, fill: color, geometry: "ellipse" });
    addText(slide, date, { x: x + 35, y: y - 46, w: 80, h: 20, size: 12, color, bold: true, align: "center", face: fonts.mono });
    card(slide, x, y + 36, 170, 176, { fill: "#FFFFFF", stroke: "#D6E5EE" });
    addText(slide, title, { x: x + 16, y: y + 54, w: 138, h: 48, size: 15, color: C.navy, bold: true });
    addText(slide, body, { x: x + 16, y: y + 108, w: 138, h: 70, size: 12.2, color: C.muted });
    if (img) {
      await addImage(slide, img, { x: x, y: 190, w: 170, h: 112, fit: "cover", alt: title });
      addShape(slide, { x, y: 190, w: 170, h: 112, fill: "#00000000", line: { style: "solid", fill: "#D7E3EC", width: 1 }, geometry: "roundRect" });
    } else {
      card(slide, x, 190, 170, 112, { fill: "#F1F6FA", stroke: "#D7E3EC" });
      addText(slide, "research\ntraining", { x: x + 22, y: 224, w: 126, h: 44, size: 19, color: C.violet, bold: true, align: "center", face: fonts.title });
    }
  }
  addText(slide, "Trajectory signal", { x: 82, y: 595, w: 150, h: 22, size: 13, color: C.blue, bold: true, face: fonts.mono });
  addText(slide, "I have repeatedly worked at the boundary where optical capture, physical constraints, and software reconstruction meet.", {
    x: 230, y: 592, w: 880, h: 28, size: 16, color: C.ink,
  });
}

async function slide04(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Heterogeneous surfaces make defect detection difficult because texture, glare, and height variation interfere with visual cues.", "Main project motivation", 4, { h: 96, subY: 170 });
  const blocks = [
    ["Metal", "specular glare", C.blue],
    ["Ceramic", "grain texture", C.orange],
    ["Polymer", "low-contrast defects", C.green],
  ];
  blocks.forEach(([name, issue, color], i) => {
    const x = 90 + i * 280;
    card(slide, x, 238, 222, 214, { fill: "#FFFFFF", stroke: "#D9E6EF" });
    addShape(slide, { x: x + 25, y: 266, w: 172, h: 80, fill: i === 0 ? "#DCE7EF" : i === 1 ? "#F5E8D6" : "#E1ECEA", geometry: "roundRect" });
    for (let k = 0; k < 9; k += 1) {
      addLine(slide, x + 36 + k * 18, 278, x + 92 + k * 18, 338, { color: i === 0 ? "#A6BBC9" : i === 1 ? "#CFB493" : "#A9C9C2", width: 1.1 });
    }
    addShape(slide, { x: x + 74, y: 294, w: 72, h: 12, fill: color, geometry: "roundRect" });
    addText(slide, name, { x: x + 26, y: 368, w: 170, h: 25, size: 20, color: C.navy, bold: true, align: "center", face: fonts.title });
    addText(slide, issue, { x: x + 26, y: 402, w: 170, h: 22, size: 13.5, color: C.muted, align: "center" });
  });
  card(slide, 942, 238, 216, 214, { fill: "#0B1F33", stroke: "#0B1F33" });
  addText(slide, "Why DFF?", { x: 964, y: 266, w: 170, h: 32, size: 22, color: "#FFFFFF", bold: true, face: fonts.title, align: "center" });
  addText(slide, "Defocus changes across a focus stack can provide a surface-depth cue when single images are ambiguous.", {
    x: 964, y: 320, w: 170, h: 76, size: 14.5, color: "#E2F5F8", align: "center",
  });
  addShape(slide, { x: 1006, y: 405, w: 90, h: 9, fill: C.cyan, geometry: "roundRect" });
  addLine(slide, 880, 348, 942, 348, { color: C.cyan, width: 3 });
  arrow(slide, 878, 348, 936, 348, C.cyan);
  card(slide, 110, 512, 1000, 74, { fill: "#FFFFFF", stroke: "#DCE8EF" });
  addText(slide, "Research framing", { x: 138, y: 532, w: 150, h: 24, size: 14, color: C.blue, bold: true, face: fonts.mono });
  addText(slide, "Build a pipeline that combines focus-stack imaging, DFF reconstruction, glare-aware evaluation, and learning-based correction for defect visualization.", {
    x: 304, y: 532, w: 760, h: 32, size: 15.2, color: C.ink,
  });
}

async function slide05(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Focus-stack imaging turns axial focus variation into a relative 3D surface cue.", "DFF reconstruction pipeline", 5);
  const steps = [
    ["Focus-stack\nacquisition", "multiple z positions", C.blue],
    ["Focus\nmeasure", "local sharpness score", C.green],
    ["Depth map\nestimation", "best-focus index", C.cyan],
    ["Glare-aware\nevaluation", "reflective risk control", C.orange],
    ["Learning-based\ncorrection", "depth/defect refinement", C.violet],
    ["Defect\nvisualization", "surface-level evidence", C.red],
  ];
  for (let i = 0; i < steps.length; i += 1) {
    const [head, body, color] = steps[i];
    const x = 56 + i * 198;
    card(slide, x, 206, 162, 132, { fill: "#FFFFFF", stroke: "#D6E5EE" });
    addShape(slide, { x: x + 18, y: 224, w: 30, h: 30, fill: color, geometry: "ellipse" });
    addText(slide, `${i + 1}`, { x: x + 18, y: 230, w: 30, h: 17, size: 14, color: "#FFFFFF", bold: true, align: "center" });
    addText(slide, head, { x: x + 18, y: 268, w: 128, h: 42, size: 15.2, color: C.navy, bold: true, align: "center" });
    addText(slide, body, { x: x + 18, y: 313, w: 128, h: 20, size: 11.3, color: C.muted, align: "center" });
    if (i < steps.length - 1) arrow(slide, x + 162, 272, x + 192, 272, C.cyan);
  }
  await addImage(slide, A.dffPanel, { x: 74, y: 394, w: 520, h: 190, fit: "cover", alt: "DFF synthetic panel" });
  await addImage(slide, A.dffSurface, { x: 642, y: 394, w: 236, h: 190, fit: "cover", alt: "Synthetic surface comparison" });
  await addImage(slide, A.dffReal, { x: 914, y: 394, w: 240, h: 190, fit: "cover", alt: "Real sample DFF reconstruction" });
  miniLabel(slide, "Synthetic multi-sample comparison", 74, 592, 340);
  miniLabel(slide, "Surface reconstruction", 642, 592, 220);
  miniLabel(slide, "Real-sample relative reconstruction", 914, 592, 250);
}

async function slide06(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "I built the reproducible pipeline and separated simulated quantitative validation from real-sample relative reconstruction.", "DFF results and contribution", 6, { h: 94, subY: 166 });
  await addImage(slide, A.dffSurface, { x: 66, y: 214, w: 374, h: 252, fit: "cover", alt: "Simulated surface reconstruction" });
  await addImage(slide, A.dffReal, { x: 468, y: 214, w: 374, h: 252, fit: "cover", alt: "Real sample reconstruction" });
  card(slide, 878, 214, 300, 252, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addSectionTag(slide, "My role", 906, 240, C.blue);
  bullet(slide, "Built Python pipeline for synthetic surface generation and focus-stack simulation.", 906, 274, 240, { h: 42 });
  bullet(slide, "Implemented the project-wide focus-stack height convention.", 906, 326, 240, { h: 38, dot: C.green });
  bullet(slide, "Ran traditional and learning-based algorithm comparisons.", 906, 374, 240, { h: 38, dot: C.orange });
  bullet(slide, "Prepared figures with explicit real/simulated evidence boundaries.", 906, 422, 240, { h: 38, dot: C.violet });
  card(slide, 66, 510, 528, 80, { fill: "#EFF7FA", stroke: "#CBE3EC" });
  addText(slide, "Simulated validation", { x: 92, y: 530, w: 180, h: 22, size: 15, color: C.blue, bold: true });
  addText(slide, "Used for controlled comparison because ground-truth-like surface information can be specified.", {
    x: 270, y: 529, w: 290, h: 34, size: 13.8, color: C.ink,
  });
  card(slide, 650, 510, 528, 80, { fill: "#FFF7ED", stroke: "#EED5B6" });
  addText(slide, "Real-sample results", { x: 676, y: 530, w: 180, h: 22, size: 15, color: "#A86016", bold: true });
  addText(slide, "Presented as relative reconstruction and visual evidence under real imaging constraints.", {
    x: 850, y: 529, w: 290, h: 34, size: 13.8, color: C.ink,
  });
}

async function slide07(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "For high-aspect-ratio micro-holes, I combined optical measurement thinking with robust image-analysis software.", "Optical metrology project", 7, { h: 92, subY: 164 });
  card(slide, 66, 220, 345, 330, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addText(slide, "Confocal scanning concept", { x: 94, y: 244, w: 290, h: 26, size: 18, color: C.navy, bold: true, face: fonts.title });
  addShape(slide, { x: 156, y: 296, w: 150, h: 44, fill: "#DDEBF3", geometry: "roundRect" });
  addText(slide, "objective", { x: 182, y: 309, w: 98, h: 18, size: 13, color: C.blue, bold: true, align: "center" });
  addLine(slide, 232, 340, 232, 438, { color: C.cyan, width: 3 });
  addShape(slide, { x: 188, y: 438, w: 88, h: 24, fill: "#1F5F99", geometry: "roundRect" });
  addShape(slide, { x: 170, y: 462, w: 124, h: 20, fill: "#DDE5EA", geometry: "roundRect" });
  addText(slide, "tomographic z-scan", { x: 128, y: 500, w: 210, h: 22, size: 13.5, color: C.muted, align: "center" });
  await addImage(slide, A.depthGui, { x: 452, y: 220, w: 330, h: 214, fit: "cover", alt: "Depth ratio detector GUI" });
  await addImage(slide, A.depthBottom, { x: 452, y: 452, w: 330, h: 104, fit: "cover", alt: "Detected circular aperture" });
  card(slide, 826, 220, 332, 336, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addSectionTag(slide, "Software workflow", 854, 250, C.blue);
  const flow = [
    ["Top / bottom\nimage pair", C.blue],
    ["Hough circle\ndetection", C.green],
    ["Manual least-\nsquares fitting", C.orange],
    ["Aspect-ratio\ncalculation", C.cyan],
  ];
  flow.forEach(([txt, color], i) => {
    const y = 290 + i * 56;
    addShape(slide, { x: 862, y, w: 44, h: 34, fill: color, geometry: "roundRect" });
    addText(slide, `${i + 1}`, { x: 862, y: y + 8, w: 44, h: 17, size: 14, color: "#FFFFFF", bold: true, align: "center" });
    addText(slide, txt, { x: 922, y: y - 2, w: 190, h: 38, size: 14, color: C.ink, bold: true });
    if (i < flow.length - 1) addLine(slide, 884, y + 36, 884, y + 53, { color: "#B7CBD8", width: 2 });
  });
  addText(slide, "Takeaway: optical metrology needs both a physically meaningful acquisition model and resilient user-facing measurement tools.", {
    x: 78, y: 608, w: 1050, h: 30, size: 16, color: C.ink, bold: true,
  });
}

async function slide08(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Zemax and prototype projects gave me system-level optical design experience beyond image processing.", "Optical engineering practice", 8);
  card(slide, 72, 194, 514, 392, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  await addImage(slide, A.zemax2025, { x: 96, y: 224, w: 466, h: 212, fit: "cover", alt: "Mirrorless camera Zemax layout" });
  addText(slide, "Mirrorless camera lens design", { x: 98, y: 462, w: 420, h: 28, size: 20, color: C.navy, bold: true, face: fonts.title });
  chip(slide, "Zemax", 98, 506, 76, { h: 28 });
  chip(slide, "MTF", 184, 506, 62, { h: 28, fill: "#EEF9F5", stroke: "#BDE4DB", color: "#15826F" });
  chip(slide, "Athermal", 256, 506, 92, { h: 28, fill: "#FFF5E8", stroke: "#F6D4AA", color: "#A86016" });
  chip(slide, "Tolerance", 358, 506, 96, { h: 28, fill: "#F5F2FB", stroke: "#D5D2EF", color: "#575BA0" });
  addText(slide, "Structure optimization, ghost-image review, cost and tolerance analysis, lens-barrel planning, Monte Carlo validation.", {
    x: 98, y: 546, w: 430, h: 32, size: 12.8, color: C.muted,
  });
  card(slide, 666, 194, 514, 392, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  await addImage(slide, A.legoModule, { x: 690, y: 224, w: 226, h: 212, fit: "cover", alt: "LEGO microscope module" });
  await addImage(slide, A.legoLayout, { x: 932, y: 224, w: 224, h: 212, fit: "cover", alt: "LEGO microscope layout" });
  addText(slide, "LEGO-based fluorescence microscope", { x: 692, y: 462, w: 420, h: 28, size: 20, color: C.navy, bold: true, face: fonts.title });
  chip(slide, "Prototype", 692, 506, 96, { h: 28 });
  chip(slide, "Optical path", 798, 506, 110, { h: 28, fill: "#EEF9F5", stroke: "#BDE4DB", color: "#15826F" });
  chip(slide, "Mechanical modules", 918, 506, 148, { h: 28, fill: "#FFF5E8", stroke: "#F6D4AA", color: "#A86016" });
  addText(slide, "Mechanical LEGO Studio design plus collaboration on Zemax optical-path design for a working fluorescence microscope prototype.", {
    x: 692, y: 546, w: 430, h: 32, size: 12.8, color: C.muted,
  });
}

async function slide09(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "My strongest implementation stack is Python/OpenCV/PyTorch for imaging pipelines, with Zemax/SolidWorks for optical-system work.", "Technical toolkit", 9, { h: 92, subY: 165 });
  const rows = [
    ["Imaging reconstruction", "Python, OpenCV, PyTorch", "DFF reconstruction, focus-stack simulation, defect visualization", C.cyan],
    ["Measurement software", "OpenCV, Tkinter, least-squares fitting", "Micro-hole radius detection, manual/automatic modes, exported overlays", C.green],
    ["Optical design", "Zemax, SolidWorks, AutoCAD", "Lens optimization, MTF/tolerance review, microscope module planning", C.blue],
    ["Scientific communication", "LaTeX, Markdown, Office, Photoshop", "Reports, project documentation, presentation figures, reproducible notes", C.orange],
    ["Programming base", "C/C++, Python, MATLAB", "Coursework and project implementation across optics and vision tasks", C.violet],
  ];
  addText(slide, "Capability", { x: 88, y: 210, w: 220, h: 20, size: 12, color: C.muted, bold: true, face: fonts.mono });
  addText(slide, "Tools", { x: 374, y: 210, w: 260, h: 20, size: 12, color: C.muted, bold: true, face: fonts.mono });
  addText(slide, "Output evidence", { x: 690, y: 210, w: 330, h: 20, size: 12, color: C.muted, bold: true, face: fonts.mono });
  rows.forEach(([cap, tools, output, color], i) => {
    const y = 244 + i * 70;
    card(slide, 72, y, 1084, 54, { fill: "#FFFFFF", stroke: "#D7E6EE" });
    addShape(slide, { x: 72, y, w: 6, h: 54, fill: color });
    addText(slide, cap, { x: 92, y: y + 15, w: 240, h: 22, size: 15, color: C.navy, bold: true });
    addText(slide, tools, { x: 374, y: y + 15, w: 270, h: 22, size: 14.5, color });
    addText(slide, output, { x: 690, y: y + 14, w: 420, h: 24, size: 13.6, color: C.ink });
  });
  card(slide, 72, 612, 1084, 44, { fill: "#EFF7FA", stroke: "#CBE3EC" });
  addText(slide, "Preparation signal for WeLight Lab: comfortable crossing optical-system constraints, reconstruction algorithms, and implementation details.", {
    x: 100, y: 625, w: 1010, h: 22, size: 15, color: C.navy, bold: true,
  });
}

async function slide10(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "I hope to grow toward optics-vision-AI co-design for computational imaging, 3D vision, holography, and display systems.", "Fit with WeLight Lab", 10, { h: 92, subY: 165 });
  card(slide, 72, 228, 350, 276, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  card(slide, 808, 228, 350, 276, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addShape(slide, { x: 443, y: 242, w: 344, h: 250, fill: "#E9F8FB", geometry: "roundRect", line: { style: "solid", fill: "#B9E2EA", width: 1.2 } });
  addText(slide, "My preparation", { x: 110, y: 258, w: 245, h: 28, size: 21, color: C.blue, bold: true, face: fonts.title, align: "center" });
  bullet(slide, "Optical imaging intuition", 116, 312, 230, { dot: C.blue, size: 12.5 });
  bullet(slide, "DFF and 3D/depth reconstruction practice", 116, 356, 238, { h: 38, dot: C.cyan, size: 12.5 });
  bullet(slide, "OpenCV/PyTorch/Zemax implementation", 116, 414, 238, { h: 38, dot: C.green, size: 12.5 });
  addText(slide, "Overlap", { x: 520, y: 265, w: 190, h: 34, size: 26, color: C.navy, bold: true, face: fonts.title, align: "center" });
  const overlap = [
    ["Computational imaging", 472, 326, 160],
    ["Coded / learned optics", 642, 326, 156],
    ["3D reconstruction", 492, 382, 138],
    ["Low-level vision", 646, 382, 122],
    ["Experimental constraints", 514, 438, 190],
  ];
  overlap.forEach(([t, x, y, w], i) => chip(slide, t, x, y, w, { fill: i % 2 ? "#F5F2FB" : "#FFFFFF", stroke: "#B8DCE7", color: i % 2 ? C.violet : C.blue }));
  addText(slide, "WeLight directions", { x: 844, y: 258, w: 270, h: 28, size: 21, color: C.blue, bold: true, face: fonts.title, align: "center" });
  bullet(slide, "Computational optics / imaging / display", 850, 312, 250, { h: 38, dot: C.blue, size: 12.5 });
  bullet(slide, "Holography, VR/AR/MR, 3D vision", 850, 366, 250, { h: 38, dot: C.violet, size: 12.5 });
  bullet(slide, "Optics + graphics + vision + AI", 850, 420, 250, { h: 38, dot: C.cyan, size: 12.5 });
  arrow(slide, 422, 366, 442, 366, C.cyan);
  arrow(slide, 787, 366, 807, 366, C.cyan);
  addCitation(slide, "Public alignment source: WeLight Lab website and Prof. Peng opening/research pages.");
}

async function slide11(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "The next step I want to learn is how to co-design optics, capture, and reconstruction under real experimental constraints.", "Near-term research questions", 11, { h: 92, subY: 165 });
  const questions = [
    ["Focus / defocus cues", "How can focus and defocus cues be integrated with learned optics for more robust 3D perception?", C.cyan],
    ["Physical priors", "How can physical priors improve reconstruction on reflective or heterogeneous surfaces?", C.orange],
    ["Calibration and data", "What experimental calibration and data-acquisition habits are essential for optics-AI systems?", C.green],
  ];
  questions.forEach(([head, body, color], i) => {
    const x = 92 + i * 370;
    card(slide, x, 250, 310, 250, { fill: "#FFFFFF", stroke: "#D7E6EE" });
    addShape(slide, { x: x + 26, y: 276, w: 52, h: 52, fill: color, geometry: "ellipse" });
    addText(slide, `Q${i + 1}`, { x: x + 26, y: 291, w: 52, h: 20, size: 17, color: "#FFFFFF", bold: true, align: "center" });
    addText(slide, head, { x: x + 96, y: 282, w: 176, h: 28, size: 19, color: C.navy, bold: true, face: fonts.title });
    addText(slide, body, { x: x + 34, y: 358, w: 242, h: 84, size: 18, color: C.ink, align: "center" });
  });
  card(slide, 176, 560, 850, 58, { fill: "#EFF7FA", stroke: "#CBE3EC" });
  addText(slide, "Discussion goal", { x: 206, y: 578, w: 140, h: 22, size: 14, color: C.blue, bold: true, face: fonts.mono });
  addText(slide, "Use the meeting to learn what preparation would be most valuable for PhD / RA / visiting research opportunities.", {
    x: 356, y: 577, w: 610, h: 24, size: 15, color: C.ink,
  });
}

async function slide12(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "I would appreciate feedback on whether my preparation fits current PhD, RA, or visiting research directions.", "Closing", 12, { h: 92, subY: 165 });
  card(slide, 96, 224, 430, 294, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addText(slide, "Thank you.", { x: 124, y: 260, w: 340, h: 58, size: 44, color: C.navy, bold: true, face: fonts.title });
  addText(slide, "I am happy to share transcripts, project reports, source code, or additional result figures after the meeting.", {
    x: 128, y: 350, w: 328, h: 72, size: 18, color: C.ink,
  });
  addText(slide, "Shenshi Li | Zhejiang University", { x: 128, y: 456, w: 320, h: 22, size: 15, color: C.blue, bold: true });
  card(slide, 594, 224, 520, 294, { fill: "#0B1F33", stroke: "#0B1F33" });
  addText(slide, "Contact and materials", { x: 634, y: 260, w: 430, h: 32, size: 25, color: "#FFFFFF", bold: true, face: fonts.title });
  addText(slide, "Email: 3230105050@zju.edu.cn\nPersonal website: https://lssnake0105.github.io/profile/\nGitHub: https://github.com/lssnake0105\nCV: available from the personal website", {
    x: 636, y: 322, w: 410, h: 116, size: 17, color: "#DDEEF4",
  });
  addShape(slide, { x: 634, y: 458, w: 408, h: 3, fill: C.cyan });
  addText(slide, "Focus areas: computational imaging, optical metrology, 3D reconstruction, optics-AI co-design.", {
    x: 636, y: 478, w: 408, h: 30, size: 13.5, color: "#B9D7E1",
  });
}

async function slide13(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Backup: DFF comparison keeps real-sample evidence separate from simulated algorithm validation.", "Backup 1", 13);
  await addImage(slide, A.dffPanel, { x: 80, y: 190, w: 690, h: 350, fit: "contain", alt: "DFF multi-sample comparison" });
  card(slide, 812, 206, 330, 318, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addSectionTag(slide, "Reading guide", 844, 236, C.blue);
  bullet(slide, "Use simulated surfaces for controlled comparison and method iteration.", 844, 280, 250, { h: 44 });
  bullet(slide, "Use real samples for relative reconstruction and visual plausibility.", 844, 342, 250, { h: 44, dot: C.green });
  bullet(slide, "Avoid claiming absolute quantitative performance where ground truth is unavailable.", 844, 404, 250, { h: 58, dot: C.orange });
}

async function slide14(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Backup: Micro-hole measurement software supports both automatic detection and manual fitting for difficult images.", "Backup 2", 14);
  await addImage(slide, A.depthGui, { x: 78, y: 194, w: 510, h: 330, fit: "contain", alt: "Depth ratio detector GUI" });
  await addImage(slide, A.depthBottom, { x: 642, y: 204, w: 230, h: 150, fit: "cover", alt: "Bottom aperture detection" });
  await addImage(slide, A.depthCover, { x: 910, y: 204, w: 230, h: 150, fit: "cover", alt: "Depth ratio detector result" });
  card(slide, 642, 402, 498, 112, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addText(slide, "Implementation details", { x: 670, y: 424, w: 230, h: 24, size: 18, color: C.navy, bold: true, face: fonts.title });
  addText(slide, "Hough circle transform, least-squares fitting, annotated exports, parameter presets, and automatic aspect-ratio computation.", {
    x: 670, y: 462, w: 410, h: 34, size: 14.5, color: C.ink,
  });
}

async function slide15(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Backup: Lens-design work trained me to evaluate optical systems with performance, tolerance, and manufacturability in mind.", "Backup 3", 15, { h: 92, subY: 165 });
  await addImage(slide, A.zemaxSystem, { x: 72, y: 206, w: 355, h: 230, fit: "cover", alt: "Zemax system" });
  await addImage(slide, A.zemax2026, { x: 462, y: 206, w: 355, h: 230, fit: "cover", alt: "Zemax analysis" });
  await addImage(slide, A.zemax2025, { x: 852, y: 206, w: 300, h: 230, fit: "cover", alt: "Zemax lens layout" });
  const chips = ["MTF evaluation", "Athermal analysis", "Ghost-image review", "Cost analysis", "Tolerance analysis", "Monte Carlo yield"];
  chips.forEach((t, i) => chip(slide, t, 128 + (i % 3) * 310, 500 + Math.floor(i / 3) * 44, 210, {
    fill: i % 2 ? "#EEF9F5" : "#EFF7FA",
    stroke: i % 2 ? "#BDE4DB" : "#CBE3EC",
    color: i % 2 ? "#15826F" : C.blue,
  }));
}

async function slide16(presentation) {
  const slide = presentation.slides.add();
  background(slide);
  addTitle(slide, "Backup: Selected coursework, outputs, and links support the academic preparation claim.", "Backup 4", 16);
  card(slide, 78, 200, 506, 330, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addText(slide, "Coursework highlights", { x: 108, y: 230, w: 380, h: 28, size: 22, color: C.navy, bold: true, face: fonts.title });
  const courses = [
    ["Silicon Photonics", "96/100"],
    ["Electromagnetic Fields and Waves", "94/100"],
    ["Physical Optics", "92/100"],
    ["Computer-Aided Optical System Design", "93/100"],
    ["Machine Vision and Image Processing", "92/100"],
  ];
  courses.forEach(([name, score], i) => {
    const y = 280 + i * 42;
    addText(slide, name, { x: 110, y, w: 330, h: 22, size: 14.5, color: C.ink });
    addText(slide, score, { x: 472, y, w: 70, h: 22, size: 14.5, color: C.blue, bold: true, align: "right" });
  });
  card(slide, 650, 200, 506, 330, { fill: "#FFFFFF", stroke: "#D7E6EE" });
  addText(slide, "Selected links", { x: 680, y: 230, w: 380, h: 28, size: 22, color: C.navy, bold: true, face: fonts.title });
  addText(slide, "Personal website\nhttps://lssnake0105.github.io/profile/\n\nGitHub\nhttps://github.com/lssnake0105\n\nRepresentative repositories\nDFF reconstruction, solar-cell crack detection,\ndepth-ratio detector, glass material explorer", {
    x: 682, y: 278, w: 420, h: 210, size: 15.5, color: C.ink,
  });
  await addImage(slide, A.glass, { x: 860, y: 386, w: 230, h: 118, fit: "cover", alt: "Glass material explorer preview" });
}

const builders = [
  slide01, slide02, slide03, slide04, slide05, slide06, slide07, slide08,
  slide09, slide10, slide11, slide12, slide13, slide14, slide15, slide16,
];

async function saveBlob(blob, out) {
  await fs.mkdir(path.dirname(out), { recursive: true });
  const buf = Buffer.from(await blob.arrayBuffer());
  await fs.writeFile(out, buf);
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir(layoutDir, { recursive: true });
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  for (const builder of builders) {
    await builder(presentation);
  }
  const previewPaths = [];
  for (let i = 0; i < presentation.slides.count; i += 1) {
    const slide = presentation.slides.getItem(i);
    const n = String(i + 1).padStart(2, "0");
    const preview = await presentation.export({ slide, format: "png", scale: 1 });
    const previewPath = path.join(previewDir, `slide-${n}.png`);
    await saveBlob(preview, previewPath);
    previewPaths.push(previewPath);
    try {
      const layout = await presentation.export({ slide, format: "layout" });
      await fs.writeFile(path.join(layoutDir, `slide-${n}.layout.json`), await layout.text(), "utf8");
    } catch {
      // Layout export is diagnostic only.
    }
  }
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(finalPptx);
  const stat = await fs.stat(finalPptx);
  await fs.writeFile(
    path.join(outDir, "build-manifest.json"),
    JSON.stringify({ finalPptx, slideCount: presentation.slides.count, bytes: stat.size, previewPaths }, null, 2) + "\n",
    "utf8",
  );
  console.log(JSON.stringify({ finalPptx, slideCount: presentation.slides.count, bytes: stat.size }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
