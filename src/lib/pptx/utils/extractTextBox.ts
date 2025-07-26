export function extractTextBox(sp: any): string | null {
  const txBody = sp?.["p:txBody"]?.[0];
  if (!txBody) return null;

  const paras = txBody["a:p"];
  const texts: string[] = [];

  for (const p of paras) {
    const runs = p["a:r"] || [];
    for (const r of runs) {
      const text = r["a:t"]?.[0];
      if (text) texts.push(text);
    }

    // handle plain <a:t> not inside <a:r>
    const simpleText = p["a:t"]?.[0];
    if (simpleText) texts.push(simpleText);
  }

  return texts.join("\n");
}
