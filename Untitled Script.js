// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
const TOKEN = "4f0d73582162261b6542a826f8f973eec47793c214dcf234b0aad4e39bf35bbe";
const APP = "https://apexvips.com/";
const API = APP + "api/widget/sales";
const LINK = APP + "app/bot/dashboard/all";
const C = { bg:new Color("#000000"), white:new Color("#ffffff"), label:new Color("#888888"), sub:new Color("#aaaaaa"), foot:new Color("#777777") };
async function fetchData(){ const r = new Request(API); r.method = "POST"; r.headers = { "Authorization": `Bearer ${TOKEN}` }; r.timeoutInterval = 12; return await r.loadJSON(); }
function lockLayout(w, fam, d, L){
  w.addAccessoryWidgetBackground = true;
  if(fam === "accessoryInline"){ const t = w.addText(`${d.faturamento_fmt || "—"} · ${d.vendas != null ? d.vendas : 0} ${L.vendas || "vendas"}`); t.font = Font.mediumSystemFont(13); t.lineLimit = 1; }
  else if(fam === "accessoryCircular"){
    const v = (d.faturamento || 0)/100, s = v >= 1000000 ? (v/1000000).toFixed(1).replace(".",",")+"M" : v >= 1000 ? (v/1000).toFixed(1).replace(".",",")+"k" : String(Math.round(v));
    w.addSpacer(); const r = w.addText("R$"); r.font = Font.semiboldSystemFont(9); r.centerAlignText();
    const t = w.addText(s); t.font = Font.boldSystemFont(16); t.minimumScaleFactor = 0.5; t.lineLimit = 1; t.centerAlignText(); w.addSpacer();
  } else {
    const h = w.addText("APEXVIPS · " + (L.titulo || "Faturamento hoje").toUpperCase()); h.font = Font.semiboldSystemFont(10); h.lineLimit = 1; h.minimumScaleFactor = 0.7;
    const rev = w.addText(d.faturamento_fmt || "—"); rev.font = Font.boldSystemFont(20); rev.minimumScaleFactor = 0.6; rev.lineLimit = 1;
    const sv = w.addText(`${d.vendas != null ? d.vendas : 0} ${L.vendas || "vendas"} · ↻ ${d.atualizado || ""}`); sv.font = Font.systemFont(10);
  }
  w.refreshAfterDate = new Date(Date.now() + 5*60*1000); return w;
}
async function build(){
  const fam = config.widgetFamily || "medium", lock = fam.indexOf("accessory") === 0;
  const w = new ListWidget(); w.url = LINK;
  if(!lock){ w.backgroundColor = C.bg; w.setPadding(16,18,16,18); }
  let d; try{ d = await fetchData(); }catch(e){ return erro(w,"Sem conexao"); }
  if(d.erro) return erro(w,d.erro);
  const L = d.labels || {};
  if(lock) return lockLayout(w, fam, d, L);
  const h = w.addStack(); h.centerAlignContent();
  const sym = SFSymbol.named("chart.line.uptrend.xyaxis"); sym.applyFont(Font.boldSystemFont(13));
  const ic = h.addImage(sym.image); ic.imageSize = new Size(15,15); ic.tintColor = C.white; h.addSpacer(8);
  const nm = h.addText("APEXVIPS"); nm.font = Font.boldSystemFont(13); nm.textColor = C.white;
  w.addSpacer(12);
  const lbl = w.addText((L.titulo || "Faturamento hoje").toUpperCase()); lbl.font = Font.semiboldSystemFont(9); lbl.textColor = C.label; w.addSpacer(3);
  const rev = w.addText(d.faturamento_fmt || "—"); rev.font = Font.boldSystemFont(30); rev.textColor = C.white; rev.minimumScaleFactor = 0.5; rev.lineLimit = 1;
  w.addSpacer(4);
  const sv = w.addText(`${d.vendas != null ? d.vendas : 0} ${L.vendas || "vendas"}`); sv.font = Font.systemFont(12); sv.textColor = C.sub;
  w.addSpacer();
  const f = w.addStack(); f.centerAlignContent(); f.addSpacer();
  const rsym = SFSymbol.named("arrow.clockwise"); rsym.applyFont(Font.systemFont(10));
  const ri = f.addImage(rsym.image); ri.imageSize = new Size(10,10); ri.tintColor = C.foot; f.addSpacer(5);
  const at = f.addText(`${L.atualizado || "Última atualização"} ${d.atualizado || ""}`); at.font = Font.systemFont(10); at.textColor = C.foot;
  w.refreshAfterDate = new Date(Date.now() + 5*60*1000); return w;
}
function erro(w,m){ w.url = LINK; w.refreshAfterDate = new Date(Date.now() + 5*60*1000);
  if((config.widgetFamily || "").indexOf("accessory") === 0){ w.addAccessoryWidgetBackground = true; const t = w.addText("ApexVips · " + m); t.font = Font.mediumSystemFont(12); t.minimumScaleFactor = 0.6; t.lineLimit = 2; return w; }
  const t = w.addText("ApexVips"); t.font = Font.boldSystemFont(14); t.textColor = C.white; w.addSpacer(6); const x = w.addText(m); x.font = Font.systemFont(12); x.textColor = C.label; return w; }
const widget = await build();
if(config.runsInWidget) Script.setWidget(widget); else await widget.presentMedium();
Script.complete();