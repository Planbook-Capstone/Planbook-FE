// SVG path mapping for supported shapes
const SVG_PATH_MAP: Record<string, (w: number, h: number) => string> = {
  rect: (w, h) => `M 0 0 H ${w} V ${h} H 0 Z`,

  ellipse: (w, h) =>
    `M ${w / 2},0 A ${w / 2},${h / 2} 0 1,0 ${w / 2},${h} A ${w / 2},${
      h / 2
    } 0 1,0 ${w / 2},0 Z`,

  roundRect: (w, h) => {
    const r = Math.min(w, h) * 0.1;
    return `M ${r},0 H ${w - r} Q ${w},0 ${w},${r} V ${h - r} Q ${w},${h} ${
      w - r
    },${h} H ${r} Q 0,${h} 0,${h - r} V ${r} Q 0,0 ${r},0 Z`;
  },

  triangle: (w, h) => `M ${w / 2},0 L ${w},${h} L 0,${h} Z`,

  diamond: (w, h) =>
    `M ${w / 2},0 L ${w},${h / 2} L ${w / 2},${h} L 0,${h / 2} Z`,

  rightArrow: (w, h) =>
    `M 0,${h * 0.3} H ${w * 0.7} V 0 L ${w},${h / 2} L ${w * 0.7},${h} V ${
      h * 0.7
    } H 0 Z`,

  leftArrow: (w, h) =>
    `M 0,${h / 2} L ${w * 0.3},0 V ${h * 0.3} H ${w} V ${h * 0.7} H ${
      w * 0.3
    } V ${h} L 0,${h / 2} Z`,

  star5: (w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const rOut = Math.min(w, h) / 2;
    const rIn = rOut * 0.4;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? rOut : rIn;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  },

  plus: (w, h) => {
    const s = 0.2;
    return `M ${w * 0.4} 0 H ${w * 0.6} V ${h * 0.4} H ${w} V ${h * 0.6} H ${
      w * 0.6
    } V ${h} H ${w * 0.4} V ${h * 0.6} H 0 V ${h * 0.4} H ${w * 0.4} Z`;
  },

  heart: (w, h) => {
    const cx = w / 2;
    return `M ${cx} ${h * 0.8} C ${cx} ${h * 0.8}, 0 ${h * 0.4}, 0 ${
      h * 0.25
    } C 0 ${h * 0.1}, ${w * 0.25} 0, ${cx} ${h * 0.3} C ${w * 0.75} 0, ${w} ${
      h * 0.1
    }, ${w} ${h * 0.25} C ${w} ${h * 0.4}, ${cx} ${h * 0.8}, ${cx} ${
      h * 0.8
    } Z`;
  },

  hexagon: (w, h) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = w / 2 + (w / 2) * Math.cos(angle);
      const y = h / 2 + (h / 2) * Math.sin(angle);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  },

  flowChartProcess: (w, h) => `M 0 0 H ${w} V ${h} H 0 Z`,

  flowChartDecision: (w, h) =>
    `M ${w / 2},0 L ${w},${h / 2} L ${w / 2},${h} L 0,${h / 2} Z`,

  pentagon: (w, h) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x = w / 2 + (w / 2) * Math.cos(angle);
      const y = h / 2 + (h / 2) * Math.sin(angle);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  },

  octagon: (w, h) => {
    const pts: string[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const x = w / 2 + (w / 2) * Math.cos(angle);
      const y = h / 2 + (h / 2) * Math.sin(angle);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  },

  parallelogram: (w, h) => {
    const dx = w * 0.2;
    return `M ${dx} 0 H ${w} L ${w - dx} ${h} H 0 Z`;
  },

  trapezoid: (w, h) => {
    const dx = w * 0.2;
    return `M ${dx} 0 H ${w - dx} L ${w} ${h} H 0 Z`;
  },

  cloud: (w, h) =>
    `M ${w * 0.2} ${h * 0.6} C ${w * 0.1} ${h * 0.4}, ${w * 0.1} ${h * 0.2}, ${
      w * 0.3
    } ${h * 0.2} C ${w * 0.3} ${h * 0.1}, ${w * 0.5} ${h * 0.1}, ${w * 0.6} ${
      h * 0.2
    } C ${w * 0.8} ${h * 0.1}, ${w * 0.9} ${h * 0.3}, ${w * 0.8} ${h * 0.4} C ${
      w * 0.9
    } ${h * 0.6}, ${w * 0.8} ${h * 0.8}, ${w * 0.6} ${h * 0.7} C ${w * 0.4} ${
      h * 0.8
    }, ${w * 0.2} ${h * 0.8}, ${w * 0.2} ${h * 0.6} Z`,
};

type ParsedPath = {
  d: string;
  fill: string;
  stroke: string;
};

const parseCustomPathToSvg = (
  pathXml: any,
  width: number,
  height: number,
  rawShapeXml?: any
): ParsedPath | null => {
  try {
    const pathNode = pathXml?.["a:pathLst"]?.[0]?.["a:path"]?.[0];
    if (!pathNode) return null;

    const w = parseInt(pathNode.$?.w || "21600");
    const h = parseInt(pathNode.$?.h || "21600");
    const scaleX = width / w;
    const scaleY = height / h;

    let prevX = 0;
    let prevY = 0;
    const commands: string[] = [];

    const getXY = (pt: any) => {
      const x = parseInt(pt?.$.x || "0") * scaleX;
      const y = parseInt(pt?.$.y || "0") * scaleY;
      return { x, y };
    };

    const ptStr = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;

    for (const key in pathNode) {
      if (!pathNode[key] || key === "$") continue;

      const items = Array.isArray(pathNode[key])
        ? pathNode[key]
        : [pathNode[key]];

      items.forEach((item: any) => {
        switch (key) {
          case "a:moveTo": {
            const pt = getXY(item["a:pt"]?.[0]);
            commands.push(`M ${ptStr(pt.x, pt.y)}`);
            prevX = pt.x;
            prevY = pt.y;
            break;
          }

          case "a:lnTo": {
            const pt = getXY(item["a:pt"]?.[0]);
            commands.push(`L ${ptStr(pt.x, pt.y)}`);
            prevX = pt.x;
            prevY = pt.y;
            break;
          }

          case "a:cubicBezTo": {
            const [p1, p2, p3] = item["a:pt"] || [];
            if (p1 && p2 && p3) {
              const cp1 = getXY(p1);
              const cp2 = getXY(p2);
              const ep = getXY(p3);
              commands.push(
                `C ${ptStr(cp1.x, cp1.y)} ${ptStr(cp2.x, cp2.y)} ${ptStr(
                  ep.x,
                  ep.y
                )}`
              );
              prevX = ep.x;
              prevY = ep.y;
            }
            break;
          }

          case "a:quadBezTo": {
            const [cp, ep] = item["a:pt"] || [];
            if (cp && ep) {
              const cpXY = getXY(cp);
              const epXY = getXY(ep);
              commands.push(
                `Q ${ptStr(cpXY.x, cpXY.y)} ${ptStr(epXY.x, epXY.y)}`
              );
              prevX = epXY.x;
              prevY = epXY.y;
            }
            break;
          }

          case "a:arcTo": {
            const arc = item.$;
            const rx = parseFloat(arc.wR || "0") * scaleX;
            const ry = parseFloat(arc.hR || "0") * scaleY;
            const stAng = parseFloat(arc.stAng || "0");
            const swAng = parseFloat(arc.swAng || "0");

            const endX = prevX + rx * Math.cos(stAng + swAng);
            const endY = prevY + ry * Math.sin(stAng + swAng);
            const largeArcFlag = Math.abs(swAng) > 180 ? 1 : 0;
            const sweepFlag = swAng >= 0 ? 1 : 0;

            commands.push(
              `A ${rx.toFixed(2)},${ry.toFixed(
                2
              )} 0 ${largeArcFlag},${sweepFlag} ${endX.toFixed(
                2
              )},${endY.toFixed(2)}`
            );
            prevX = endX;
            prevY = endY;
            break;
          }

          case "a:close":
            commands.push("Z");
            break;
        }
      });
    }

    const fill =
      rawShapeXml?.["a:solidFill"]?.[0]?.["a:srgbClr"]?.[0]?.$?.val || "cccccc";
    const stroke =
      rawShapeXml?.["a:ln"]?.[0]?.["a:solidFill"]?.[0]?.["a:srgbClr"]?.[0]?.$
        ?.val || "000000";

    return {
      d: commands.join(" "),
      fill: `#${fill}`,
      stroke: `#${stroke}`,
    };
  } catch (err) {
    console.error("❌ Error parsing path:", err);
    return null;
  }
};

// Generate SVG path for shape type
export const generateSvgPath = (
  shapeType: string,
  width: number,
  height: number,
  childrenSvg?: string,
  rawShapeXml?: any,
  textContent?: string // 👈 truyền text nếu có
): string => {
  const w = width;
  const h = height;

  // Nếu là text box và có nội dung text thì render <text>
  if (textContent) {
    const fontSize = Math.min(w, h) * 0.15;
    return `
      <text x="${w / 2}" y="${h / 2}" font-size="${fontSize}" fill="#000"
        text-anchor="middle" dominant-baseline="middle">
        ${textContent}
      </text>
    `;
  }

  // Ưu tiên custom path
  const custGeom = rawShapeXml?.["a:custGeom"]?.[0];
  const prstGeom = rawShapeXml?.["a:prstGeom"]?.[0];
  const pathXml = custGeom || prstGeom;
  const hasPath = pathXml?.["a:pathLst"];

  if (hasPath) {
    const parsed = parseCustomPathToSvg(pathXml, w, h, rawShapeXml);
    if (parsed?.d) {
      return `<path d="${parsed.d}" fill="${parsed.fill}" stroke="${parsed.stroke}" />`;
    }
  }

  // Group shape
  if (shapeType === "group") {
    return childrenSvg || "<g></g>";
  }

  if (shapeType === "custom" && childrenSvg) {
    return `<g>${childrenSvg}</g>`;
  }

  // Known shape types
  const shapeFn = SVG_PATH_MAP[shapeType];
  if (shapeFn) {
    const d = shapeFn(w, h);
    return `<path d="${d}" fill="#cccccc" stroke="#000000" />`;
  }

  // fallback unknown
  return `
    <rect width="${w}" height="${h}" stroke="#999" />
    <text x="${w / 2}" y="${h / 2}" font-size="${
    Math.min(w, h) * 0.1
  }" fill="#666"
      text-anchor="middle" dominant-baseline="middle">
      ${shapeType}
    </text>
  `;
};
