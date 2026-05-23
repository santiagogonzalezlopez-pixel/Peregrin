(() => {
  const CARD_WIDTH = 1080;
  const CARD_HEIGHT = 1350;

  const COPY = {
    en: {
      button: "Share route card",
      previewTitle: "Route card ready",
      previewHint: "Open it here first, then share or download it whenever you want.",
      share: "Share card",
      download: "Download image",
      close: "Close",
      ready: "Route card ready to share",
      saved: "Route card saved on your device",
      downloaded: "Route card downloaded",
      failed: "We could not prepare the route card.",
      incomplete: "Complete every stop to unlock this route card.",
      completed: "Completed pilgrimage route",
      pilgrim: "Peregrin pilgrim",
      holyStops: "holy stops",
      completedOn: "Completed on",
      madeWith: "Made with Peregrin Passport",
      intention: "Pilgrimage completed. Memory kept.",
      footer: "Discover holy places. Mark your pilgrimages. Keep the memory.",
      scopeEurope: "Europe",
      scopeAmericas: "Americas",
      scopeAsia: "Asia",
      scopeMixed: "Pilgrim route"
    },
    es: {
      button: "Compartir tarjeta de ruta",
      previewTitle: "Tarjeta de ruta lista",
      previewHint: "Primero puedes verla aquí; después, compartirla o descargarla cuando quieras.",
      share: "Compartir tarjeta",
      download: "Descargar imagen",
      close: "Cerrar",
      ready: "Tarjeta lista para compartir",
      saved: "Tarjeta guardada en tu dispositivo",
      downloaded: "Tarjeta descargada",
      failed: "No hemos podido preparar la tarjeta.",
      incomplete: "Completa todas las paradas para desbloquear esta tarjeta.",
      completed: "Ruta de peregrinación completada",
      pilgrim: "Peregrino de Peregrin",
      holyStops: "lugares santos",
      completedOn: "Completada el",
      madeWith: "Creado con Peregrin Passport",
      intention: "Peregrinación completada. Memoria guardada.",
      footer: "Descubre lugares santos. Marca tus peregrinaciones. Guarda la memoria.",
      scopeEurope: "Europa",
      scopeAmericas: "América",
      scopeAsia: "Asia",
      scopeMixed: "Ruta peregrina"
    },
    fr: {
      button: "Partager la carte de route",
      previewTitle: "Carte de route prête",
      previewHint: "Vous pouvez d’abord la voir ici, puis la partager ou la télécharger.",
      share: "Partager la carte",
      download: "Télécharger l’image",
      close: "Fermer",
      ready: "Carte prête à partager",
      saved: "Carte enregistrée sur votre appareil",
      downloaded: "Carte téléchargée",
      failed: "Impossible de préparer la carte.",
      incomplete: "Complétez toutes les étapes pour débloquer cette carte.",
      completed: "Route de pèlerinage terminée",
      pilgrim: "Pèlerin Peregrin",
      holyStops: "lieux saints",
      completedOn: "Terminée le",
      madeWith: "Créé avec Peregrin Passport",
      intention: "Pèlerinage terminé. Mémoire gardée.",
      footer: "Découvrez des lieux saints. Marquez vos pèlerinages. Gardez la mémoire.",
      scopeEurope: "Europe",
      scopeAmericas: "Amériques",
      scopeAsia: "Asie",
      scopeMixed: "Route pèlerine"
    },
    it: {
      button: "Condividi scheda percorso",
      previewTitle: "Scheda percorso pronta",
      previewHint: "Puoi prima visualizzarla qui, poi condividerla o scaricarla.",
      share: "Condividi scheda",
      download: "Scarica immagine",
      close: "Chiudi",
      ready: "Scheda pronta da condividere",
      saved: "Scheda salvata sul dispositivo",
      downloaded: "Scheda scaricata",
      failed: "Non siamo riusciti a preparare la scheda.",
      incomplete: "Completa tutte le tappe per sbloccare questa scheda.",
      completed: "Percorso di pellegrinaggio completato",
      pilgrim: "Pellegrino Peregrin",
      holyStops: "luoghi santi",
      completedOn: "Completato il",
      madeWith: "Creato con Peregrin Passport",
      intention: "Pellegrinaggio completato. Memoria custodita.",
      footer: "Scopri luoghi santi. Segna i pellegrinaggi. Custodisci la memoria.",
      scopeEurope: "Europa",
      scopeAmericas: "Americhe",
      scopeAsia: "Asia",
      scopeMixed: "Percorso pellegrino"
    },
    pt: {
      button: "Partilhar cartão da rota",
      previewTitle: "Cartão da rota pronto",
      previewHint: "Pode vê-lo primeiro aqui e depois partilhar ou descarregar.",
      share: "Partilhar cartão",
      download: "Descarregar imagem",
      close: "Fechar",
      ready: "Cartão pronto para partilhar",
      saved: "Cartão guardado no seu dispositivo",
      downloaded: "Cartão descarregado",
      failed: "Não foi possível preparar o cartão.",
      incomplete: "Complete todas as paragens para desbloquear este cartão.",
      completed: "Rota de peregrinação concluída",
      pilgrim: "Peregrino Peregrin",
      holyStops: "lugares santos",
      completedOn: "Concluída em",
      madeWith: "Criado com Peregrin Passport",
      intention: "Peregrinação concluída. Memória guardada.",
      footer: "Descubra lugares santos. Marque peregrinações. Guarde a memória.",
      scopeEurope: "Europa",
      scopeAmericas: "Américas",
      scopeAsia: "Ásia",
      scopeMixed: "Rota peregrina"
    }
  };

  function getLang(){
    try{ return currentLang || "en"; }catch(e){ return "en"; }
  }

  function copy(key){
    const lang = getLang();
    return (COPY[lang] && COPY[lang][key]) || COPY.en[key] || key;
  }

  function toast(message, duration){
    try{
      if(typeof showToast === "function") showToast(message, duration);
    }catch(e){}
  }

  function escapeHtml(value){
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function routeLabel(route){
    const localized = route?.[getLang()] || route?.en || route || {};
    return localized.name || route?.id || "Route";
  }

  function routeIsComplete(route){
    return !!route && route.stops.every(id => {
      try{ return isVisited(id); }catch(e){ return false; }
    });
  }

  function routeButton(route, visitedCount){
    if(!route) return "";
    if(visitedCount < route.stops.length) return "";
    return `<button type="button" class="route-share-btn" onclick="event.stopPropagation();window.PeregrinShareCards.open('${escapeHtml(route.id)}')">${escapeHtml(copy("button"))}</button>`;
  }

  function getRoute(routeId){
    try{ return routes.find(route => route.id === routeId); }catch(e){ return null; }
  }

  function getStops(route){
    try{
      return route.stops.map(id => sanctuaries.find(s => s.id === id)).filter(Boolean);
    }catch(e){
      return [];
    }
  }

  function routeScopeLabel(stops){
    try{
      const countryIds = [...new Set(stops.map(stop => stop.country).filter(Boolean))];
      if(countryIds.length === 1){
        const country = countries.find(item => item.id === countryIds[0]);
        return country ? cn(country) : copy("scopeMixed");
      }
      const regions = [...new Set(countryIds.map(id => getRegion(id)).filter(Boolean))];
      if(regions.length === 1){
        if(regions[0] === "europe") return copy("scopeEurope");
        if(regions[0] === "americas") return copy("scopeAmericas");
        if(regions[0] === "asia") return copy("scopeAsia");
      }
    }catch(e){}
    return copy("scopeMixed");
  }

  function getPilgrimName(){
    try{
      const raw = (pilgrimName || window._currentUser?.displayName || "").trim();
      return raw || copy("pilgrim");
    }catch(e){
      return copy("pilgrim");
    }
  }

  function formatCompletionDate(route){
    let value = "";
    try{
      const dates = route.stops.map(id => visits[id]).filter(Boolean).sort();
      value = dates[dates.length - 1] || "";
    }catch(e){}
    const date = value ? new Date(`${value}T12:00:00`) : new Date();
    try{
      return date.toLocaleDateString(getLang(), {year:"numeric", month:"long", day:"numeric"});
    }catch(e){
      return date.toISOString().split("T")[0];
    }
  }

  function safeFilePart(value){
    return String(value || "Route")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 56) || "Route";
  }

  function roundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth=1){
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if(fillStyle){
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if(strokeStyle){
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function drawText(ctx, text, x, y, options={}){
    const {
      size=32,
      family="'Jost', sans-serif",
      weight="400",
      style="normal",
      color="#3E2723",
      align="left",
      baseline="alphabetic"
    } = options;
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(String(text || ""), x, y);
  }

  function splitLines(ctx, text, maxWidth, options={}){
    const size = options.size || 32;
    const family = options.family || "'Jost', sans-serif";
    const weight = options.weight || "400";
    const style = options.style || "normal";
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    const words = String(text || "").split(/\s+/).filter(Boolean);
    if(!words.length) return [""];
    const lines = [];
    let current = words[0];
    for(let i = 1; i < words.length; i++){
      const candidate = `${current} ${words[i]}`;
      if(ctx.measureText(candidate).width <= maxWidth) current = candidate;
      else{
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
    return lines;
  }

  function clampLines(ctx, text, maxWidth, maxLines, options={}){
    const lines = splitLines(ctx, text, maxWidth, options);
    if(lines.length <= maxLines) return lines;
    const trimmed = lines.slice(0, maxLines);
    const size = options.size || 32;
    const family = options.family || "'Jost', sans-serif";
    const weight = options.weight || "400";
    const style = options.style || "normal";
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    let last = trimmed[maxLines - 1];
    while(last.length > 4 && ctx.measureText(`${last}...`).width > maxWidth){
      last = last.slice(0, -1).trimEnd();
    }
    trimmed[maxLines - 1] = `${last}...`;
    return trimmed;
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, options={}){
    const lines = clampLines(ctx, text, maxWidth, options.maxLines || 99, options);
    const lineHeight = options.lineHeight || Math.round((options.size || 32) * 1.28);
    lines.forEach((line, index) => drawText(ctx, line, x, y + (index * lineHeight), options));
    return lines.length * lineHeight;
  }

  async function waitForFonts(){
    try{
      if(document.fonts?.ready) await document.fonts.ready;
    }catch(e){}
  }

  function loadImage(src){
    return new Promise(resolve => {
      if(!src){ resolve(null); return; }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      try{ img.crossOrigin = "anonymous"; }catch(e){}
      try{
        img.src = typeof resolveAssetUrl === "function" ? resolveAssetUrl(src) : src;
      }catch(e){
        img.src = src;
      }
    });
  }

  function drawCoverImage(ctx, img, x, y, width, height){
    if(!img){
      const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
      gradient.addColorStop(0, "#5A1A22");
      gradient.addColorStop(1, "#C5963A");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, height);
      return;
    }
    const scale = Math.max(width / img.width, height / img.height);
    const sw = width / scale;
    const sh = height / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
  }

  function drawCompletionCard(ctx, route, stops, image){
    const burgundy = "#722F37";
    const burgundyDark = "#3A1118";
    const gold = "#C5963A";
    const goldLight = "#E8C97A";
    const cream = "#FDF5E6";
    const brown = "#3E2723";
    const muted = "#6D4C41";
    const routeName = routeLabel(route);
    const scopeLabel = routeScopeLabel(stops);
    const completionDate = formatCompletionDate(route);
    const pilgrim = getPilgrimName();

    const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
    bg.addColorStop(0, "#250C12");
    bg.addColorStop(0.44, cream);
    bg.addColorStop(1, "#F5E6CC");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    drawCoverImage(ctx, image, 0, 0, CARD_WIDTH, 520);
    const veil = ctx.createLinearGradient(0, 0, 0, 580);
    veil.addColorStop(0, "rgba(32,10,15,0.22)");
    veil.addColorStop(0.58, "rgba(58,17,24,0.48)");
    veil.addColorStop(1, "rgba(58,17,24,0.92)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, CARD_WIDTH, 580);

    drawText(ctx, "PEREGRIN PASSPORT", CARD_WIDTH / 2, 86, {
      size: 26,
      weight: "800",
      color: goldLight,
      align: "center"
    });
    drawText(ctx, clampLines(ctx, scopeLabel.toUpperCase(), 780, 1, {
      size: 20,
      weight: "800"
    })[0], CARD_WIDTH / 2, 128, {
      size: 20,
      weight: "800",
      color: "rgba(253,245,230,0.72)",
      align: "center"
    });

    drawWrappedText(ctx, routeName, CARD_WIDTH / 2, 280, 840, {
      size: 78,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: cream,
      align: "center",
      maxLines: 2,
      lineHeight: 82
    });
    drawText(ctx, copy("completed").toUpperCase(), CARD_WIDTH / 2, 452, {
      size: 25,
      weight: "800",
      color: goldLight,
      align: "center"
    });

    roundedRect(ctx, 70, 480, 940, 704, 38, "#FFF9EE", "rgba(197,150,58,0.44)", 3);
    roundedRect(ctx, 110, 524, 860, 118, 28, "#F5E6CC", null);

    drawText(ctx, pilgrim, CARD_WIDTH / 2, 575, {
      size: 44,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: burgundy,
      align: "center"
    });
    drawText(ctx, `${copy("completedOn")} ${completionDate}`, CARD_WIDTH / 2, 620, {
      size: 24,
      weight: "600",
      color: muted,
      align: "center"
    });

    roundedRect(ctx, 150, 684, 340, 88, 24, burgundy, null);
    roundedRect(ctx, 590, 684, 340, 88, 24, "#EFE2CC", "rgba(197,150,58,0.4)", 2);
    drawText(ctx, `${stops.length}/${stops.length}`, 320, 730, {
      size: 42,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: goldLight,
      align: "center"
    });
    drawText(ctx, copy("holyStops").toUpperCase(), 320, 756, {
      size: 17,
      weight: "800",
      color: "rgba(253,245,230,0.74)",
      align: "center"
    });
    drawText(ctx, copy("intention"), 760, 738, {
      size: 24,
      family: "'Crimson Pro', serif",
      style: "italic",
      weight: "600",
      color: brown,
      align: "center"
    });

    const listTop = 812;
    stops.forEach((stop, index) => {
      const d = typeof sd === "function" ? sd(stop) : stop;
      const y = listTop + index * 46;
      const stopName = clampLines(ctx, d.name || stop.name, 710, 1, {
        size: 25,
        family: "'Crimson Pro', serif",
        weight: "700"
      })[0];
      const stopCity = clampLines(ctx, d.city || stop.city || "", 710, 1, {
        size: 18,
        weight: "600"
      })[0];
      roundedRect(ctx, 134, y - 26, 42, 42, 21, index % 2 ? "#F5E6CC" : "#E8C97A", null);
      drawText(ctx, String(index + 1), 155, y + 3, {
        size: 22,
        weight: "800",
        color: burgundyDark,
        align: "center",
        baseline: "middle"
      });
      drawText(ctx, stopName, 196, y - 2, {
        size: 25,
        family: "'Crimson Pro', serif",
        weight: "700",
        color: brown
      });
      drawText(ctx, stopCity, 196, y + 25, {
        size: 18,
        weight: "600",
        color: muted
      });
    });

    drawText(ctx, copy("madeWith"), CARD_WIDTH / 2, 1166, {
      size: 22,
      weight: "800",
      color: gold,
      align: "center"
    });

    const footer = ctx.createLinearGradient(0, 1210, CARD_WIDTH, CARD_HEIGHT);
    footer.addColorStop(0, burgundy);
    footer.addColorStop(1, burgundyDark);
    ctx.fillStyle = footer;
    ctx.fillRect(0, 1210, CARD_WIDTH, 140);
    drawText(ctx, "PEREGRIN", CARD_WIDTH / 2, 1264, {
      size: 42,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: cream,
      align: "center"
    });
    drawText(ctx, copy("footer"), CARD_WIDTH / 2, 1306, {
      size: 22,
      weight: "600",
      color: "rgba(253,245,230,0.76)",
      align: "center"
    });
  }

  async function buildCard(route){
    await waitForFonts();
    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    const ctx = canvas.getContext("2d");
    const stops = getStops(route);
    const image = await loadImage(route.image);
    drawCompletionCard(ctx, route, stops, image);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      fileName: `Peregrin_${safeFilePart(routeLabel(route))}_${new Date().getFullYear()}.png`
    };
  }

  function ensureStyles(){
    if(document.getElementById("route-share-card-styles")) return;
    const style = document.createElement("style");
    style.id = "route-share-card-styles";
    style.textContent = `
      .route-share-btn{width:100%;margin-top:12px;padding:12px 14px;border:none;border-radius:11px;background:linear-gradient(135deg,var(--gold),#b8842e);color:var(--brown);font-family:'Jost',sans-serif;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 8px 18px rgba(197,150,58,0.25);}
      .route-share-btn:active{transform:scale(0.98);}
      .route-share-overlay{position:fixed;inset:0;z-index:3700;background:rgba(30,18,16,.78);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;pointer-events:none;transition:opacity .25s ease;}
      .route-share-overlay.open{opacity:1;pointer-events:all;}
      .route-share-dialog{width:min(560px,100%);max-height:92vh;background:#fffaf0;border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.38);overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(197,150,58,.35);}
      .route-share-head{padding:18px 18px 12px;text-align:center;background:linear-gradient(135deg,#722f37,#4d2026);color:#fdf5e6;}
      .route-share-title{font-family:'Crimson Pro',serif;font-size:24px;font-weight:700;margin-bottom:4px;}
      .route-share-hint{font-family:'Jost',sans-serif;font-size:13px;line-height:1.45;opacity:.82;}
      .route-share-body{padding:14px;background:#efe2cc;overflow:auto;}
      .route-share-img{display:block;width:100%;height:auto;border-radius:14px;box-shadow:0 10px 28px rgba(62,39,35,.18);background:#fdf5e6;}
      .route-share-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px;background:#fffaf0;}
      .route-share-actions button{border:none;border-radius:12px;padding:13px 12px;font-family:'Jost',sans-serif;font-size:14px;font-weight:800;cursor:pointer;}
      .route-share-actions button:disabled{opacity:.58;cursor:wait;}
      .route-share-native{background:linear-gradient(135deg,#c5963a,#e8c97a);color:#3e2723;}
      .route-share-download,.route-share-close{background:#f2e6d2;color:#722f37;}
      .route-share-close{grid-column:1 / -1;}
      @media(max-width:520px){.route-share-overlay{padding:10px;align-items:flex-end}.route-share-dialog{max-height:94vh;border-radius:18px 18px 0 0}.route-share-title{font-size:21px}.route-share-actions{grid-template-columns:1fr}.route-share-close{grid-column:auto}}
    `;
    document.head.appendChild(style);
  }

  function isNative(){
    try{ return typeof isNativeAppRuntime === "function" && isNativeAppRuntime(); }catch(e){ return false; }
  }

  function plugin(name){
    try{
      if(typeof getCapacitorPlugin === "function") return getCapacitorPlugin(name);
    }catch(e){}
    return null;
  }

  async function saveNative(dataUrl, fileName){
    if(!isNative()) return {ok:false};
    const Filesystem = plugin("Filesystem");
    if(!Filesystem?.writeFile || !Filesystem?.getUri) return {ok:false};
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    for(const directory of ["DOCUMENTS", "CACHE"]){
      try{
        await Filesystem.writeFile({path:fileName, data:base64Data, directory, recursive:true});
        const result = await Filesystem.getUri({path:fileName, directory});
        if(result?.uri) return {ok:true, uri:result.uri, directory};
      }catch(e){}
    }
    return {ok:false};
  }

  function downloadImage(dataUrl, fileName){
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function shareImage(dataUrl, fileName, nativeFile, route){
    if(nativeFile?.uri && isNative()){
      const Share = plugin("Share");
      if(Share?.share){
        try{
          await Share.share({
            title: routeLabel(route),
            text: copy("madeWith"),
            files: [nativeFile.uri],
            dialogTitle: copy("share")
          });
          toast(copy("ready"));
          return;
        }catch(e){
          return;
        }
      }
    }

    if(navigator.share){
      try{
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, {type:"image/png"});
        if(!navigator.canShare || navigator.canShare({files:[file]})){
          await navigator.share({title: routeLabel(route), text: copy("madeWith"), files: [file]});
          toast(copy("ready"));
          return;
        }
      }catch(e){
        return;
      }
    }

    downloadImage(dataUrl, fileName);
    toast(copy("downloaded"));
  }

  async function downloadForUser(dataUrl, fileName, nativeFile){
    if(nativeFile?.ok){
      toast(copy("saved"));
      return nativeFile;
    }
    const saved = await saveNative(dataUrl, fileName);
    if(saved?.ok){
      toast(copy("saved"));
      return saved;
    }
    downloadImage(dataUrl, fileName);
    toast(copy("downloaded"));
    return null;
  }

  function showPreview(dataUrl, fileName, route){
    ensureStyles();
    const previous = document.getElementById("route-share-overlay");
    if(previous) previous.remove();

    const overlay = document.createElement("div");
    overlay.id = "route-share-overlay";
    overlay.className = "route-share-overlay";
    overlay.innerHTML = `
      <div class="route-share-dialog" role="dialog" aria-modal="true" aria-labelledby="route-share-title">
        <div class="route-share-head">
          <div class="route-share-title" id="route-share-title">${escapeHtml(copy("previewTitle"))}</div>
          <div class="route-share-hint">${escapeHtml(copy("previewHint"))}</div>
        </div>
        <div class="route-share-body">
          <img class="route-share-img" alt="${escapeHtml(copy("previewTitle"))}" src="${dataUrl}">
        </div>
        <div class="route-share-actions">
          <button type="button" class="route-share-native">${escapeHtml(copy("share"))}</button>
          <button type="button" class="route-share-download">${escapeHtml(copy("download"))}</button>
          <button type="button" class="route-share-close">${escapeHtml(copy("close"))}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const onKeydown = event => {
      if(event.key === "Escape") close();
    };
    const close = () => {
      document.removeEventListener("keydown", onKeydown);
      overlay.remove();
    };
    const shareButton = overlay.querySelector(".route-share-native");
    const downloadButton = overlay.querySelector(".route-share-download");
    let savedNativeFile = null;
    let busy = false;
    const setBusy = value => {
      busy = value;
      shareButton.disabled = value;
      downloadButton.disabled = value;
    };
    shareButton.addEventListener("click", async () => {
      if(busy) return;
      setBusy(true);
      try{
        if(!savedNativeFile?.ok) savedNativeFile = await saveNative(dataUrl, fileName);
        await shareImage(dataUrl, fileName, savedNativeFile, route);
      }finally{
        setBusy(false);
      }
    });
    downloadButton.addEventListener("click", async () => {
      if(busy) return;
      setBusy(true);
      try{
        savedNativeFile = await downloadForUser(dataUrl, fileName, savedNativeFile);
      }finally{
        setBusy(false);
      }
    });
    overlay.querySelector(".route-share-close").addEventListener("click", close);
    overlay.addEventListener("click", event => {
      if(event.target === overlay) close();
    });
    document.addEventListener("keydown", onKeydown);
    requestAnimationFrame(() => overlay.classList.add("open"));
  }

  async function open(routeId){
    const route = getRoute(routeId);
    if(!route) return;
    if(!routeIsComplete(route)){
      toast(copy("incomplete"));
      return;
    }
    ensureStyles();
    try{
      const {dataUrl, fileName} = await buildCard(route);
      showPreview(dataUrl, fileName, route);
      toast(copy("ready"));
    }catch(e){
      console.error("route completion card failed:", e);
      toast(copy("failed"), 5000);
    }
  }

  window.PeregrinShareCards = {
    routeButton,
    open
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", ensureStyles, {once:true});
  }else{
    ensureStyles();
  }
  try{
    if(typeof renderRoutes === "function") renderRoutes();
  }catch(e){}
})();
