(() => {
  const CERT_WIDTH = 1600;
  const CERT_HEIGHT = 1131;

  function toRgb(values){
    return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
  }

  function trackCertificateEvent(eventName, params={}){
    if(typeof window.trackEvent === "function"){
      window.trackEvent(eventName, params);
    }
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
      size=28,
      family="'Jost', sans-serif",
      weight="400",
      style="normal",
      color="#000000",
      align="left",
      baseline="alphabetic"
    } = options;
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  }

  function splitLines(ctx, text, maxWidth, options={}){
    const {
      size=28,
      family="'Jost', sans-serif",
      weight="400",
      style="normal"
    } = options;
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    const words = String(text || "").split(/\s+/).filter(Boolean);
    if(!words.length) return [""];
    const lines = [];
    let current = words[0];
    for(let i = 1; i < words.length; i++){
      const candidate = `${current} ${words[i]}`;
      if(ctx.measureText(candidate).width <= maxWidth){
        current = candidate;
      }else{
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
    ctx.font = `${options.style || 'normal'} ${options.weight || '400'} ${options.size || 28}px ${options.family || "'Jost', sans-serif"}`;
    let last = trimmed[maxLines - 1];
    while(last.length > 4 && ctx.measureText(`${last}...`).width > maxWidth){
      last = last.slice(0, -1).trimEnd();
    }
    trimmed[maxLines - 1] = `${last}...`;
    return trimmed;
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, options={}){
    const lines = clampLines(ctx, text, maxWidth, options.maxLines || 99, options);
    const lineHeight = options.lineHeight || Math.round((options.size || 28) * 1.35);
    lines.forEach((line, index) => {
      drawText(ctx, line, x, y + (index * lineHeight), options);
    });
    return {lines, height: lines.length * lineHeight};
  }

  function stableCertificateHash(value){
    let hash = 2166136261;
    for(let i = 0; i < value.length; i++){
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36).toUpperCase().padStart(8, "0");
  }

  function buildCertificateColumns(ctx, items, columnWidth, availableHeight){
    for(let columns = items.length > 10 ? 4 : items.length > 7 ? 3 : items.length > 4 ? 2 : 1; columns <= 4; columns++){
      const rowsPerColumn = Math.ceil(items.length / columns);
      const columnGap = columns === 1 ? 0 : columns === 2 ? 26 : columns === 3 ? 22 : 18;
      const effectiveColumnWidth = (columnWidth - (columnGap * (columns - 1))) / columns;
      const itemFontSize = items.length > 7 ? 16 : items.length > 4 ? 17 : 20;
      const maxItemLines = items.length > 7 ? 1 : 2;
      const prepared = items.map(item => {
        const lines = clampLines(ctx, item, effectiveColumnWidth - 46, maxItemLines, {
          size: itemFontSize,
          family: "'Jost', sans-serif",
          weight: "500"
        });
        const blockHeight = items.length > 7 ? 20 + (lines.length * 20) : 18 + (lines.length * 18);
        return {lines, blockHeight, size:itemFontSize};
      });
      const heights = Array.from({length: columns}, () => 0);
      prepared.forEach((item, index) => {
        const column = Math.floor(index / rowsPerColumn);
        heights[column] += item.blockHeight;
      });
      if(Math.max(...heights) <= availableHeight || columns === 4){
        return {columns, rowsPerColumn, prepared, heights, columnGap, columnWidth: effectiveColumnWidth};
      }
    }
    return null;
  }

  function createCanvas(){
    const canvas = document.createElement("canvas");
    canvas.width = CERT_WIDTH;
    canvas.height = CERT_HEIGHT;
    return canvas;
  }

  async function waitForFonts(){
    try{
      if(document.fonts && document.fonts.ready){
        await document.fonts.ready;
      }
    }catch(e){
      // Ignore font loading failures and keep rendering.
    }
  }

  function clipRoundedRect(ctx, x, y, width, height, radius){
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
    ctx.clip();
  }

  function drawImageCover(ctx, image, x, y, width, height){
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    if(!imageWidth || !imageHeight) return;
    const scale = Math.max(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const drawX = x + ((width - drawWidth) / 2);
    const drawY = y + ((height - drawHeight) / 2);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  function loadImage(src){
    return new Promise(resolve => {
      if(!src) return resolve(null);
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  function drawPaperTexture(ctx){
    const wash = ctx.createLinearGradient(0, 0, CERT_WIDTH, CERT_HEIGHT);
    wash.addColorStop(0, "#fff8ea");
    wash.addColorStop(0.42, "#f5ead7");
    wash.addColorStop(1, "#ead9bd");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

    ctx.save();
    ctx.globalAlpha = 0.11;
    for(let i = 0; i < 760; i++){
      const x = (i * 137) % CERT_WIDTH;
      const y = (i * 193) % CERT_HEIGHT;
      const size = 1 + (i % 4);
      ctx.fillStyle = i % 3 === 0 ? "#ffffff" : "#8d6e63";
      ctx.fillRect(x, y, size, 1);
    }
    ctx.restore();
  }

  function drawCornerFlourish(ctx, x, y, scaleX, scaleY, color){
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 58);
    ctx.bezierCurveTo(28, 48, 48, 28, 58, 0);
    ctx.moveTo(18, 80);
    ctx.bezierCurveTo(46, 62, 72, 40, 88, 10);
    ctx.moveTo(58, 0);
    ctx.lineTo(116, 0);
    ctx.moveTo(0, 58);
    ctx.lineTo(0, 116);
    ctx.stroke();
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.ellipse(79, 24, 12, 5, -0.72, 0, Math.PI * 2);
    ctx.ellipse(30, 77, 12, 5, 0.72, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function getCertificateHeroSource(countryId, certificateSanctuaries){
    const stopIds = new Set(certificateSanctuaries.map(s => s.id));
    const routeMatch = (routes || []).find(route =>
      route?.image && Array.isArray(route.stops) && route.stops.some(id => stopIds.has(id))
    );
    if(routeMatch?.image) return routeMatch.image;

    const countryImages = {
      be:"assets/routes/belgium.png",
      es:"assets/routes/camino.png",
      pt:"assets/routes/fatima.png",
      fr:"assets/routes/fatima.png",
      it:"assets/routes/italy.png",
      pl:"assets/routes/poland.png",
      hl:"assets/routes/holy-land.png",
      ph:"assets/routes/asia.png",
      in:"assets/routes/asia.png",
      kr:"assets/routes/asia.png",
      jp:"assets/routes/asia.png",
      ci:"assets/routes/africa.png",
      dz:"assets/routes/africa.png",
      rw:"assets/routes/africa.png",
      ug:"assets/routes/africa.png",
      ao:"assets/routes/africa.png",
      ke:"assets/routes/africa.png",
      cg:"assets/routes/africa.png",
      au:"assets/routes/oceania.png",
      nz:"assets/routes/oceania.png",
      fj:"assets/routes/oceania.png",
      pg:"assets/routes/oceania.png"
    };
    if(countryImages[countryId]) return countryImages[countryId];

    const region = Object.entries(regionMap || {}).find(([, ids]) => ids.includes(countryId))?.[0];
    const regionImages = {
      americas:"assets/routes/americas.png",
      asia:"assets/routes/asia.png",
      africa:"assets/routes/africa.png",
      oceania:"assets/routes/oceania.png"
    };
    if(regionImages[region]) return regionImages[region];

    const first = certificateSanctuaries[0] || {};
    const descriptor = `${first.icon || ""} ${first.type || ""} ${first.name || ""}`.toLowerCase();
    if(/martyr|blood|sangre|m[áa]rtir|cross/.test(descriptor)) return "assets/sanctuary-hero-martyr.png";
    if(/monastery|abbey|abadi|monast/.test(descriptor)) return "assets/sanctuary-hero-monastery.png";
    if(/mount|mountain|monte|tabor/.test(descriptor)) return "assets/sanctuary-hero-mountain.png";
    if(/marian|mary|lady|virgin|mar[ií]a|madonna|notre-dame|senhora/.test(descriptor)) return "assets/sanctuary-hero-marian.png";
    return "assets/sanctuary-hero.png";
  }

  function getCertificateCopy(lang){
    const copy = {
      en:{
        title:"Certificate of Pilgrimage",
        subtitle:"Personal pilgrim memory issued by Peregrin",
        intro:"This certificate records with gratitude that",
        body:countryName => `has completed in Peregrin the pilgrimage path for ${countryName}, visiting and recording the sacred places listed below as a personal memory of faith, travel and prayer.`,
        completed:"Pilgrimage path completed",
        places:"Sacred places recorded",
        count:n => n === 1 ? "sacred place" : "sacred places",
        issuedBy:"Issued by Peregrin as a personal pilgrim memory",
        certNo:"Certificate No.",
        date:"Issued on",
        seal:"PILGRIM MEMORY",
        footer:"PEREGRIN - THE DIGITAL PASSPORT OF THE CATHOLIC PILGRIM"
      },
      es:{
        title:"Certificado de peregrinación",
        subtitle:"Memoria personal de peregrino emitida por Peregrin",
        intro:"El presente certificado acredita, con gratitud, que",
        body:countryName => `ha completado en Peregrin el camino de peregrinación correspondiente a ${countryName}, visitando y registrando los lugares sagrados indicados a continuación como memoria personal de fe, viaje y oración.`,
        completed:"Camino de peregrinación completado",
        places:"Lugares sagrados registrados",
        count:n => n === 1 ? "lugar sagrado" : "lugares sagrados",
        issuedBy:"Emitido por Peregrin como memoria personal de peregrino",
        certNo:"Certificado n.º",
        date:"Emitido el",
        seal:"MEMORIA PEREGRINA",
        footer:"PEREGRIN - EL PASAPORTE DIGITAL DEL PEREGRINO CATÓLICO"
      },
      fr:{
        title:"Certificat de pèlerinage",
        subtitle:"Mémoire personnelle de pèlerin émise par Peregrin",
        intro:"Le présent certificat atteste avec gratitude que",
        body:countryName => `a accompli dans Peregrin le chemin de pèlerinage pour ${countryName}, en visitant et en enregistrant les lieux sacrés ci-dessous comme mémoire personnelle de foi, de route et de prière.`,
        completed:"Chemin de pèlerinage accompli",
        places:"Lieux sacrés enregistrés",
        count:n => n === 1 ? "lieu sacré" : "lieux sacrés",
        issuedBy:"Émis par Peregrin comme mémoire personnelle de pèlerin",
        certNo:"Certificat n.º",
        date:"Délivré le",
        seal:"MÉMOIRE PÈLERINE",
        footer:"PEREGRIN - LE PASSEPORT NUMÉRIQUE DU PÈLERIN CATHOLIQUE"
      },
      it:{
        title:"Certificato di pellegrinaggio",
        subtitle:"Memoria personale di pellegrino emessa da Peregrin",
        intro:"Il presente certificato attesta con gratitudine che",
        body:countryName => `ha completato in Peregrin il cammino di pellegrinaggio per ${countryName}, visitando e registrando i luoghi sacri indicati di seguito come memoria personale di fede, viaggio e preghiera.`,
        completed:"Cammino di pellegrinaggio completato",
        places:"Luoghi sacri registrati",
        count:n => n === 1 ? "luogo sacro" : "luoghi sacri",
        issuedBy:"Emesso da Peregrin come memoria personale di pellegrino",
        certNo:"Certificato n.",
        date:"Rilasciato il",
        seal:"MEMORIA PELLEGRINA",
        footer:"PEREGRIN - IL PASSAPORTO DIGITALE DEL PELLEGRINO CATTOLICO"
      },
      pt:{
        title:"Certificado de peregrinação",
        subtitle:"Memória pessoal de peregrino emitida pelo Peregrin",
        intro:"O presente certificado atesta, com gratidão, que",
        body:countryName => `concluiu no Peregrin o caminho de peregrinação relativo a ${countryName}, visitando e registando os lugares sagrados indicados abaixo como memória pessoal de fé, viagem e oração.`,
        completed:"Caminho de peregrinação concluído",
        places:"Lugares sagrados registados",
        count:n => n === 1 ? "lugar sagrado" : "lugares sagrados",
        issuedBy:"Emitido pelo Peregrin como memória pessoal de peregrino",
        certNo:"Certificado n.º",
        date:"Emitido em",
        seal:"MEMÓRIA PEREGRINA",
        footer:"PEREGRIN - O PASSAPORTE DIGITAL DO PEREGRINO CATÓLICO"
      }
    };
    return copy[lang] || copy.en;
  }

  function ensureCertificatePreviewStyles(){
    if(document.getElementById("certificate-preview-styles")) return;
    const style = document.createElement("style");
    style.id = "certificate-preview-styles";
    style.textContent = `
      .certificate-preview-overlay{position:fixed;inset:0;z-index:3600;background:rgba(30,18,16,.78);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;pointer-events:none;transition:opacity .25s ease;}
      .certificate-preview-overlay.open{opacity:1;pointer-events:all;}
      .certificate-preview-dialog{width:min(940px,100%);max-height:92vh;background:#fffaf0;border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.38);overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(197,150,58,.35);}
      .certificate-preview-head{padding:18px 18px 12px;text-align:center;background:linear-gradient(135deg,#722f37,#4d2026);color:#fdf5e6;}
      .certificate-preview-title{font-family:'Crimson Pro',serif;font-size:24px;font-weight:700;margin-bottom:4px;}
      .certificate-preview-hint{font-family:'Jost',sans-serif;font-size:13px;line-height:1.45;opacity:.82;}
      .certificate-preview-body{padding:14px;background:#efe2cc;overflow:auto;}
      .certificate-preview-img{display:block;width:100%;height:auto;border-radius:14px;box-shadow:0 10px 28px rgba(62,39,35,.18);background:#fdf5e6;}
      .certificate-preview-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px;background:#fffaf0;}
      .certificate-preview-actions button{border:none;border-radius:12px;padding:13px 12px;font-family:'Jost',sans-serif;font-size:14px;font-weight:800;cursor:pointer;}
      .certificate-preview-actions button:disabled{opacity:.58;cursor:wait;}
      .certificate-preview-share{background:linear-gradient(135deg,#c5963a,#e8c97a);color:#3e2723;}
      .certificate-preview-download,.certificate-preview-close{background:#f2e6d2;color:#722f37;}
      .certificate-preview-close{grid-column:1 / -1;}
      @media(max-width:520px){.certificate-preview-overlay{padding:10px;align-items:flex-end}.certificate-preview-dialog{max-height:94vh;border-radius:18px 18px 0 0}.certificate-preview-title{font-size:21px}.certificate-preview-actions{grid-template-columns:1fr}.certificate-preview-close{grid-column:auto}}
    `;
    document.head.appendChild(style);
  }

  async function saveCertificateImageNative(dataUrl, fileName){
    if(!isNativeAppRuntime()) return {ok:false};
    const Filesystem = getCapacitorPlugin("Filesystem");
    if(!Filesystem || typeof Filesystem.writeFile !== "function" || typeof Filesystem.getUri !== "function") return {ok:false};
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const targetDirectories = ["DOCUMENTS", "CACHE"];
    let savedFile = null;
    let lastError = null;

    for(const directory of targetDirectories){
      try{
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory,
          recursive: true
        });
        const candidate = await Filesystem.getUri({path: fileName, directory});
        if(candidate?.uri){
          savedFile = {uri: candidate.uri, directory};
          break;
        }
      }catch(e){
        lastError = e;
      }
    }

    if(!savedFile?.uri){
      if(lastError) console.error("native certificate image save failed:", lastError);
      return {ok:false};
    }

    return {ok:true, uri:savedFile.uri, directory:savedFile.directory};
  }

  async function shareCertificateImage(dataUrl, fileName, nativeFile){
    if(nativeFile?.uri && isNativeAppRuntime()){
      const Share = getCapacitorPlugin("Share");
      if(Share && typeof Share.share === "function"){
        let canShare = true;
        if(typeof Share.canShare === "function"){
          const shareAvailability = await Share.canShare().catch(() => ({value:true}));
          canShare = shareAvailability?.value !== false;
        }
        if(canShare){
          try{
            await Share.share({
              title: t("certTitle"),
              text: `${t("certTitle")} - ${fileName}`,
              files: [nativeFile.uri],
              dialogTitle: t("certShareBtn")
            });
            showToast(t("certReady"));
            return;
          }catch(shareError){
            console.warn("native certificate image share cancelled or failed:", shareError);
            return;
          }
        }
      }
    }

    if(navigator.share){
      try{
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, {type:"image/png"});
        if(!navigator.canShare || navigator.canShare({files:[file]})){
          await navigator.share({
            title: t("certTitle"),
            text: `${t("certTitle")} - ${fileName}`,
            files: [file]
          });
          showToast(t("certReady"));
          return;
        }
      }catch(e){
        console.warn("web certificate image share cancelled or failed:", e);
        return;
      }
    }

    downloadCertificateImage(dataUrl, fileName);
    showToast(t("certDownloaded"));
  }

  async function downloadCertificateImageForUser(dataUrl, fileName, nativeFile){
    if(nativeFile?.ok){
      showToast(t("certSaved"));
      return nativeFile;
    }
    try{
      const nativeResult = await saveCertificateImageNative(dataUrl, fileName);
      if(nativeResult?.ok){
        showToast(t("certSaved"));
        return nativeResult;
      }
    }catch(e){
      console.warn("native certificate image download failed:", e);
    }
    downloadCertificateImage(dataUrl, fileName);
    showToast(t("certDownloaded"));
    return null;
  }

  function showCertificatePreview(dataUrl, fileName, nativeFile, analyticsData={}){
    ensureCertificatePreviewStyles();
    const previous = document.getElementById("certificate-preview-overlay");
    if(previous) previous.remove();

    const overlay = document.createElement("div");
    overlay.id = "certificate-preview-overlay";
    overlay.className = "certificate-preview-overlay";
    overlay.innerHTML = `
      <div class="certificate-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="certificate-preview-title">
        <div class="certificate-preview-head">
          <div class="certificate-preview-title" id="certificate-preview-title">${t("certPreviewTitle")}</div>
          <div class="certificate-preview-hint">${t("certPreviewHint")}</div>
        </div>
        <div class="certificate-preview-body">
          <img class="certificate-preview-img" alt="${t("certTitle")}" src="${dataUrl}">
        </div>
        <div class="certificate-preview-actions">
          <button type="button" class="certificate-preview-share">${t("certShareBtn")}</button>
          <button type="button" class="certificate-preview-download">${t("certDownloadBtn")}</button>
          <button type="button" class="certificate-preview-close">${t("certCloseBtn")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const onKeydown = (event) => {
      if(event.key === "Escape") close();
    };
    const close = () => {
      document.removeEventListener("keydown", onKeydown);
      overlay.remove();
    };
    let savedNativeFile = nativeFile || null;
    let actionInProgress = false;
    const shareButton = overlay.querySelector(".certificate-preview-share");
    const downloadButton = overlay.querySelector(".certificate-preview-download");
    const shareLabel = shareButton.textContent;
    const downloadLabel = downloadButton.textContent;
    const setButtonsBusy = (busy, action = "") => {
      shareButton.disabled = busy;
      downloadButton.disabled = busy;
      shareButton.textContent = busy && action === "share" ? `${shareLabel}...` : shareLabel;
      downloadButton.textContent = busy && action === "download" ? `${downloadLabel}...` : downloadLabel;
    };
    shareButton.addEventListener("click", async () => {
      if(actionInProgress) return;
      actionInProgress = true;
      setButtonsBusy(true, "share");
      try{
        trackCertificateEvent("certificate_share_tap", analyticsData);
        if(!savedNativeFile?.ok){
          savedNativeFile = await saveCertificateImageNative(dataUrl, fileName);
        }
        await shareCertificateImage(dataUrl, fileName, savedNativeFile);
        trackCertificateEvent("certificate_share_done", analyticsData);
      }finally{
        actionInProgress = false;
        setButtonsBusy(false);
      }
    });
    downloadButton.addEventListener("click", async () => {
      if(actionInProgress) return;
      actionInProgress = true;
      setButtonsBusy(true, "download");
      try{
        trackCertificateEvent("certificate_download_tap", analyticsData);
        savedNativeFile = await downloadCertificateImageForUser(dataUrl, fileName, savedNativeFile);
        trackCertificateEvent("certificate_download_done", analyticsData);
      }finally{
        actionInProgress = false;
        setButtonsBusy(false);
      }
    });
    overlay.querySelector(".certificate-preview-close").addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if(event.target === overlay) close();
    });
    document.addEventListener("keydown", onKeydown);
    requestAnimationFrame(() => overlay.classList.add("open"));
  }

  function downloadCertificateImage(dataUrl, fileName){
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  window.generateCertificate = async function generateCertificate(countryId){
    const country = countries.find(c => c.id === countryId);
    const certificateSanctuaries = getCertificateSanctuaries(countryId);
    if(!country || !certificateSanctuaries.length) return;

    await waitForFonts();

    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");
    if(!ctx){
      showToast(t("certFailed"));
      return;
    }

    const BURG = [114, 47, 55];
    const GOLD = [197, 150, 58];
    const GOLDL = [232, 201, 122];
    const CREAM = [253, 245, 230];
    const BROWN = [62, 39, 35];
    const BROWNL = [109, 76, 65];
    const WHITE = [255, 255, 255];

    const locales = {en:"en-GB", es:"es-ES", fr:"fr-FR", it:"it-IT", pt:"pt-PT"};
    const locale = locales[currentLang] || "en-GB";
    const quotes = {
      en:'"Traveller, there is no path, the path is made by walking"',
      es:'"Caminante, no hay camino, se hace camino al andar"',
      fr:'"Voyageur, il n\'y a pas de chemin, le chemin se fait en marchant"',
      it:'"Viandante, non c\'è sentiero, il sentiero si fa camminando"',
      pt:'"Caminhante, não há caminho, o caminho faz-se ao andar"'
    };
    const subtitles = {
      en:"THE DIGITAL PASSPORT OF THE CATHOLIC PILGRIM",
      es:"EL PASAPORTE DIGITAL DEL PEREGRINO CATÓLICO",
      fr:"LE PASSEPORT NUMÉRIQUE DU PÈLERIN CATHOLIQUE",
      it:"IL PASSAPORTO DIGITALE DEL PELLEGRINO CATTOLICO",
      pt:"O PASSAPORTE DIGITAL DO PEREGRINO CATÓLICO"
    };
    const footers = {
      en:"PEREGRIN - THE DIGITAL PASSPORT OF THE CATHOLIC PILGRIM",
      es:"PEREGRIN - EL PASAPORTE DIGITAL DEL PEREGRINO CATÓLICO",
      fr:"PEREGRIN - LE PASSEPORT NUMÉRIQUE DU PÈLERIN CATHOLIQUE",
      it:"PEREGRIN - IL PASSAPORTO DIGITALE DEL PELLEGRINO CATTOLICO",
      pt:"PEREGRIN - O PASSAPORTE DIGITAL DO PEREGRINO CATÓLICO"
    };
    const meta = {
      en:{completed:"Completed pilgrimage", sanctuaries:"SANCTUARIES", issuedBy:"Issued by Peregrin", certNo:"Certificate No."},
      es:{completed:"Peregrinación completada", sanctuaries:"SANTUARIOS", issuedBy:"Emitido por Peregrin", certNo:"Certificado n.º"},
      fr:{completed:"Pèlerinage accompli", sanctuaries:"SANCTUAIRES", issuedBy:"Émis par Peregrin", certNo:"Certificat n.º"},
      it:{completed:"Pellegrinaggio compiuto", sanctuaries:"SANTUARI", issuedBy:"Emesso da Peregrin", certNo:"Certificato n."},
      pt:{completed:"Peregrinação concluída", sanctuaries:"SANTUÁRIOS", issuedBy:"Emitido por Peregrin", certNo:"Certificado n.º"}
    };
    const metaText = meta[currentLang] || meta.en;

    const user = window._currentUser;
    const rawName = pilgrimName || user?.displayName || user?.email?.split("@")[0] || "Pilgrim";
    const pilgrimDisplayName = rawName.trim() || "Pilgrim";
    const identitySeed = user?.uid || user?.email || pilgrimDisplayName;
    const year = new Date().getFullYear().toString();
    const certNo = `${countryId.toUpperCase()}-${year}-${stableCertificateHash(`${countryId}|${identitySeed}|${certificateSanctuaries.map(s => s.id).join("-")}`).slice(0, 8)}`;
    const summary = getCertificateSummary(country, certificateSanctuaries);

    ctx.fillStyle = toRgb(CREAM);
    ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

    ctx.fillStyle = toRgb(BURG);
    ctx.fillRect(0, 0, CERT_WIDTH, 28);
    ctx.fillRect(0, CERT_HEIGHT - 28, CERT_WIDTH, 28);
    ctx.fillRect(0, 0, 28, CERT_HEIGHT);
    ctx.fillRect(CERT_WIDTH - 28, 0, 28, CERT_HEIGHT);

    ctx.strokeStyle = toRgb(GOLD);
    ctx.lineWidth = 4;
    ctx.strokeRect(42, 42, CERT_WIDTH - 84, CERT_HEIGHT - 84);
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, CERT_WIDTH - 112, CERT_HEIGHT - 112);

    const panelX = 72;
    const panelY = 72;
    const panelWidth = 360;
    const panelHeight = CERT_HEIGHT - 144;
    roundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 28, toRgb(BURG));
    roundedRect(ctx, panelX + panelWidth + 14, panelY, 14, panelHeight, 7, toRgb(GOLD));

    drawText(ctx, "PEREGRIN", panelX + (panelWidth / 2), 258, {
      size: 74,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: toRgb(WHITE),
      align: "center"
    });

    drawWrappedText(ctx, subtitles[currentLang] || subtitles.en, panelX + (panelWidth / 2), 312, panelWidth - 70, {
      size: 20,
      family: "'Jost', sans-serif",
      weight: "500",
      color: toRgb(GOLDL),
      align: "center",
      lineHeight: 28,
      maxLines: 3
    });

    ctx.strokeStyle = toRgb(GOLD);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(panelX + 70, 382);
    ctx.lineTo(panelX + panelWidth - 70, 382);
    ctx.stroke();

    drawWrappedText(ctx, cn(country).toUpperCase(), panelX + (panelWidth / 2), 432, panelWidth - 70, {
      size: 34,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: toRgb(GOLDL),
      align: "center",
      lineHeight: 42,
      maxLines: 2
    });
    drawText(ctx, year, panelX + (panelWidth / 2), 520, {
      size: 28,
      family: "'Jost', sans-serif",
      weight: "600",
      color: toRgb(WHITE),
      align: "center"
    });

    drawWrappedText(ctx, quotes[currentLang] || quotes.en, panelX + (panelWidth / 2), CERT_HEIGHT - 132, panelWidth - 60, {
      size: 18,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: toRgb(GOLDL),
      align: "center",
      lineHeight: 25,
      maxLines: 4
    });

    const rightX = panelX + panelWidth + 70;
    const rightY = 96;
    const rightWidth = CERT_WIDTH - rightX - 76;
    const rightCenter = rightX + (rightWidth / 2);

    roundedRect(ctx, rightX - 16, rightY - 18, rightWidth + 32, CERT_HEIGHT - 192, 28, "rgb(248, 239, 224)", toRgb(GOLDL), 2);

    const badgeWidth = 138;
    const badgeHeight = 92;
    roundedRect(ctx, rightX + rightWidth - badgeWidth, rightY, badgeWidth, badgeHeight, 18, toRgb(BURG));
    drawText(ctx, String(certificateSanctuaries.length).padStart(2, "0"), rightX + rightWidth - (badgeWidth / 2), rightY + 40, {
      size: 44,
      family: "'Jost', sans-serif",
      weight: "700",
      color: toRgb(GOLDL),
      align: "center"
    });
    drawText(ctx, metaText.sanctuaries, rightX + rightWidth - (badgeWidth / 2), rightY + 72, {
      size: 13,
      family: "'Jost', sans-serif",
      weight: "700",
      color: toRgb(CREAM),
      align: "center"
    });

    drawText(ctx, t("certTitle").toUpperCase(), rightCenter, rightY + 34, {
      size: 26,
      family: "'Jost', sans-serif",
      weight: "700",
      color: toRgb(GOLD),
      align: "center"
    });

    drawText(ctx, t("certText1"), rightCenter, rightY + 106, {
      size: 23,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: toRgb(BROWNL),
      align: "center"
    });

    let nameSize = 68;
    while(nameSize > 42){
      ctx.font = `italic 700 ${nameSize}px 'Crimson Pro', serif`;
      if(ctx.measureText(pilgrimDisplayName).width <= rightWidth - 140) break;
      nameSize -= 2;
    }
    drawText(ctx, pilgrimDisplayName, rightCenter, rightY + 188, {
      size: nameSize,
      family: "'Crimson Pro', serif",
      weight: "700",
      style: "italic",
      color: toRgb(BURG),
      align: "center"
    });

    ctx.strokeStyle = toRgb(GOLD);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rightCenter - 250, rightY + 206);
    ctx.lineTo(rightCenter + 250, rightY + 206);
    ctx.stroke();

    drawText(ctx, t("certText2"), rightCenter, rightY + 262, {
      size: 23,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: toRgb(BROWNL),
      align: "center"
    });
    drawText(ctx, metaText.completed.toUpperCase(), rightCenter, rightY + 316, {
      size: 28,
      family: "'Jost', sans-serif",
      weight: "700",
      color: toRgb(BURG),
      align: "center"
    });

    roundedRect(ctx, rightX + 56, rightY + 340, rightWidth - 112, 84, 16, "rgb(250, 244, 233)", toRgb(GOLD), 2);
    const summaryLines = clampLines(ctx, summary, rightWidth - 160, 2, {
      size: 28,
      family: "'Crimson Pro', serif",
      weight: "700"
    });
    summaryLines.forEach((line, index) => {
      drawText(ctx, line, rightCenter, rightY + 389 + (index * 32), {
        size: 28,
        family: "'Crimson Pro', serif",
        weight: "700",
        color: toRgb(BURG),
        align: "center"
      });
    });

    ctx.strokeStyle = toRgb(GOLD);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX + 18, rightY + 450);
    ctx.lineTo(rightX + rightWidth - 18, rightY + 450);
    ctx.stroke();

    const listTop = rightY + 472;
    const listHeight = 370;
    const listItems = certificateSanctuaries.map(s => sd(s).name);
    const columnsLayout = buildCertificateColumns(ctx, listItems, rightWidth - 48, listHeight) || {
      columns: 1,
      rowsPerColumn: listItems.length,
      prepared: listItems.map(item => ({lines:[item], blockHeight:58})),
      heights: [listItems.length * 58]
    };
    const columnGap = columnsLayout.columns === 1 ? 0 : columnsLayout.columns === 2 ? 22 : 18;
    const columnWidth = ((rightWidth - 48) - (columnGap * (columnsLayout.columns - 1))) / columnsLayout.columns;
    roundedRect(ctx, rightX + 8, listTop - 12, rightWidth - 16, Math.max(...columnsLayout.heights) + 24, 18, toRgb(WHITE), toRgb(GOLDL), 2);

    for(let column = 0; column < columnsLayout.columns; column++){
      let y = listTop + 8;
      for(let row = 0; row < columnsLayout.rowsPerColumn; row++){
        const index = (column * columnsLayout.rowsPerColumn) + row;
        if(index >= certificateSanctuaries.length) break;
        const item = columnsLayout.prepared[index];
        const itemX = rightX + 24 + column * (columnWidth + columnGap);
        if((row + column) % 2 === 0){
          roundedRect(ctx, itemX, y - 18, columnWidth, item.blockHeight - 8, 12, "rgb(246, 236, 218)");
        }
        item.lines.forEach((line, lineIndex) => {
          drawText(ctx, line, itemX + 18, y + 6 + (lineIndex * 26), {
            size: 23,
            family: "'Jost', sans-serif",
            weight: "500",
            color: toRgb(BROWN)
          });
        });
        y += item.blockHeight;
      }
    }

    const footerY = CERT_HEIGHT - 154;
    ctx.strokeStyle = toRgb(GOLD);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX + 18, footerY);
    ctx.lineTo(rightX + rightWidth - 18, footerY);
    ctx.stroke();

    const issued = new Date().toLocaleDateString(locale, {day:"numeric", month:"long", year:"numeric"});
    drawText(ctx, `${t("certIssued")} ${issued}`, rightX + 10, footerY + 44, {
      size: 19,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: toRgb(BROWN)
    });
    drawText(ctx, `${metaText.certNo} ${certNo}`, rightX + rightWidth - 10, footerY + 44, {
      size: 19,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: toRgb(BROWN),
      align: "right"
    });
    drawText(ctx, metaText.issuedBy, rightCenter, footerY + 94, {
      size: 24,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: toRgb(BURG),
      align: "center"
    });

    ctx.fillStyle = toRgb(BURG);
    ctx.fillRect(0, CERT_HEIGHT - 28, CERT_WIDTH, 28);
    drawText(ctx, footers[currentLang] || footers.en, CERT_WIDTH / 2, CERT_HEIGHT - 9, {
      size: 12,
      family: "'Jost', sans-serif",
      weight: "600",
      color: toRgb(GOLDL),
      align: "center"
    });

    const safeCountryName = country.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const fileName = `Peregrin_${safeCountryName}_${year}.png`;
    const dataUrl = canvas.toDataURL("image/png");

    try{
      const analyticsData = {countryId, count:certificateSanctuaries.length};
      trackCertificateEvent("certificate_preview_open", analyticsData);
      showCertificatePreview(dataUrl, fileName, null, analyticsData);
      showToast(t("certReady"));
    }catch(e){
      console.error("certificate image preview failed:", e);
      showToast(t("certFailed"));
    }
  };

  window.generateCertificate = async function generateCertificate(countryId){
    const country = countries.find(c => c.id === countryId);
    const certificateSanctuaries = getCertificateSanctuaries(countryId);
    if(!country || !certificateSanctuaries.length) return null;

    const heroSource = getCertificateHeroSource(countryId, certificateSanctuaries);
    await waitForFonts();
    const heroImage = await loadImage(heroSource);

    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");
    if(!ctx){
      showToast(t("certFailed"));
      return null;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const copy = getCertificateCopy(currentLang);
    const locales = {en:"en-GB", es:"es-ES", fr:"fr-FR", it:"it-IT", pt:"pt-PT"};
    const locale = locales[currentLang] || "en-GB";
    const year = new Date().getFullYear().toString();
    const issued = new Date().toLocaleDateString(locale, {day:"numeric", month:"long", year:"numeric"});
    const countryName = cn(country);
    const user = window._currentUser;
    const fallbackName = typeof t === "function" ? t("pilgrimFallback") : "Pilgrim";
    const rawName = pilgrimName || user?.displayName || user?.email?.split("@")[0] || fallbackName || "Pilgrim";
    const pilgrimDisplayName = rawName.trim() || fallbackName || "Pilgrim";
    const identitySeed = user?.uid || user?.email || pilgrimDisplayName;
    const certNo = `${countryId.toUpperCase()}-${year}-${stableCertificateHash(`${countryId}|${identitySeed}|${certificateSanctuaries.map(s => s.id).join("-")}`).slice(0, 8)}`;
    const summary = getCertificateSummary(country, certificateSanctuaries);

    const BURG = "#722f37";
    const BURG_DARK = "#3b171d";
    const GOLD = "#c5963a";
    const GOLD_LIGHT = "#ead181";
    const PAPER = "#fff8ea";
    const PAPER_DEEP = "#efe0c4";
    const BROWN = "#3e2723";
    const MUTED = "#76584f";
    const WHITE = "#fffdf7";

    drawPaperTexture(ctx);

    ctx.fillStyle = BURG_DARK;
    ctx.fillRect(0, 0, CERT_WIDTH, 30);
    ctx.fillRect(0, CERT_HEIGHT - 30, CERT_WIDTH, 30);
    ctx.fillRect(0, 0, 30, CERT_HEIGHT);
    ctx.fillRect(CERT_WIDTH - 30, 0, 30, CERT_HEIGHT);

    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 5;
    ctx.strokeRect(44, 44, CERT_WIDTH - 88, CERT_HEIGHT - 88);
    ctx.strokeStyle = "rgba(197,150,58,.58)";
    ctx.lineWidth = 2;
    ctx.strokeRect(62, 62, CERT_WIDTH - 124, CERT_HEIGHT - 124);
    ctx.strokeStyle = "rgba(114,47,55,.22)";
    ctx.strokeRect(74, 74, CERT_WIDTH - 148, CERT_HEIGHT - 148);

    drawCornerFlourish(ctx, 68, 68, 1, 1, GOLD);
    drawCornerFlourish(ctx, CERT_WIDTH - 68, 68, -1, 1, GOLD);
    drawCornerFlourish(ctx, 68, CERT_HEIGHT - 68, 1, -1, GOLD);
    drawCornerFlourish(ctx, CERT_WIDTH - 68, CERT_HEIGHT - 68, -1, -1, GOLD);

    const photoX = 86;
    const photoY = 82;
    const photoW = CERT_WIDTH - 172;
    const photoH = 284;
    ctx.save();
    clipRoundedRect(ctx, photoX, photoY, photoW, photoH, 26);
    if(heroImage){
      drawImageCover(ctx, heroImage, photoX, photoY, photoW, photoH);
    }else{
      const fallback = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
      fallback.addColorStop(0, "#6f5342");
      fallback.addColorStop(0.45, "#9b7b57");
      fallback.addColorStop(1, "#3f2f2b");
      ctx.fillStyle = fallback;
      ctx.fillRect(photoX, photoY, photoW, photoH);
    }
    const photoShade = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
    photoShade.addColorStop(0, "rgba(28,15,13,.18)");
    photoShade.addColorStop(0.52, "rgba(37,18,16,.34)");
    photoShade.addColorStop(1, "rgba(40,18,18,.76)");
    ctx.fillStyle = photoShade;
    ctx.fillRect(photoX, photoY, photoW, photoH);
    const sideShade = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY);
    sideShade.addColorStop(0, "rgba(25,12,11,.62)");
    sideShade.addColorStop(0.34, "rgba(25,12,11,.08)");
    sideShade.addColorStop(0.66, "rgba(25,12,11,.08)");
    sideShade.addColorStop(1, "rgba(25,12,11,.48)");
    ctx.fillStyle = sideShade;
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.restore();
    roundedRect(ctx, photoX, photoY, photoW, photoH, 26, null, "rgba(234,209,129,.9)", 3);

    drawText(ctx, "PEREGRIN", photoX + 54, photoY + 72, {
      size: 38,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: WHITE
    });
    drawWrappedText(ctx, copy.subtitle.toUpperCase(), photoX + 54, photoY + 104, 430, {
      size: 13,
      family: "'Jost', sans-serif",
      weight: "700",
      color: GOLD_LIGHT,
      lineHeight: 18,
      maxLines: 2
    });
    drawWrappedText(ctx, countryName.toUpperCase(), photoX + photoW - 56, photoY + photoH - 78, 560, {
      size: 36,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: WHITE,
      align: "right",
      lineHeight: 40,
      maxLines: 2
    });

    const cardX = 112;
    const cardY = 360;
    const cardW = CERT_WIDTH - 224;
    const cardH = 736;
    ctx.save();
    ctx.shadowColor = "rgba(56,31,24,.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    roundedRect(ctx, cardX, cardY, cardW, cardH, 24, "rgba(255,250,241,.93)", "rgba(197,150,58,.48)", 2);
    ctx.restore();
    roundedRect(ctx, cardX + 18, cardY + 18, cardW - 36, cardH - 36, 18, null, "rgba(114,47,55,.18)", 2);

    const center = CERT_WIDTH / 2;
    drawText(ctx, copy.title.toUpperCase(), center, cardY + 72, {
      size: 48,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: BURG,
      align: "center"
    });
    drawText(ctx, copy.completed.toUpperCase(), center, cardY + 112, {
      size: 14,
      family: "'Jost', sans-serif",
      weight: "800",
      color: GOLD,
      align: "center"
    });
    ctx.strokeStyle = "rgba(197,150,58,.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center - 270, cardY + 136);
    ctx.lineTo(center + 270, cardY + 136);
    ctx.stroke();

    drawText(ctx, copy.intro, center, cardY + 184, {
      size: 24,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: MUTED,
      align: "center"
    });

    let nameSize = 76;
    while(nameSize > 42){
      ctx.font = `italic 700 ${nameSize}px 'Crimson Pro', serif`;
      if(ctx.measureText(pilgrimDisplayName).width <= cardW - 380) break;
      nameSize -= 2;
    }
    drawText(ctx, pilgrimDisplayName, center, cardY + 270, {
      size: nameSize,
      family: "'Crimson Pro', serif",
      weight: "700",
      style: "italic",
      color: BURG,
      align: "center"
    });
    ctx.strokeStyle = "rgba(197,150,58,.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(center - 310, cardY + 294);
    ctx.lineTo(center + 310, cardY + 294);
    ctx.stroke();

    drawWrappedText(ctx, copy.body(countryName), center, cardY + 324, cardW - 270, {
      size: 24,
      family: "'Crimson Pro', serif",
      color: MUTED,
      align: "center",
      lineHeight: 30,
      maxLines: 3
    });

    const sealX = cardX + 126;
    const sealY = cardY + 450;
    ctx.save();
    ctx.shadowColor = "rgba(62,39,35,.18)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 78, 0, Math.PI * 2);
    ctx.fillStyle = BURG;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 66, 0, Math.PI * 2);
    ctx.strokeStyle = GOLD_LIGHT;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = GOLD_LIGHT;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sealX, sealY - 34);
    ctx.lineTo(sealX, sealY + 28);
    ctx.moveTo(sealX - 24, sealY - 10);
    ctx.lineTo(sealX + 24, sealY - 10);
    ctx.stroke();
    drawText(ctx, "PEREGRIN", sealX, sealY + 54, {
      size: 12,
      family: "'Jost', sans-serif",
      weight: "800",
      color: GOLD_LIGHT,
      align: "center"
    });

    const summaryX = cardX + 244;
    const summaryY = cardY + 410;
    const summaryW = cardW - 488;
    roundedRect(ctx, summaryX, summaryY, summaryW, 92, 18, PAPER, "rgba(197,150,58,.72)", 2);
    drawText(ctx, copy.completed.toUpperCase(), center, summaryY + 30, {
      size: 13,
      family: "'Jost', sans-serif",
      weight: "800",
      color: GOLD,
      align: "center"
    });
    const summaryLines = clampLines(ctx, summary, summaryW - 70, 2, {
      size: 29,
      family: "'Crimson Pro', serif",
      weight: "700"
    });
    summaryLines.forEach((line, index) => {
      drawText(ctx, line, center, summaryY + 66 + (index * 30), {
        size: 29,
        family: "'Crimson Pro', serif",
        weight: "700",
        color: BURG,
        align: "center"
      });
    });

    const countX = cardX + cardW - 126;
    const countY = sealY;
    roundedRect(ctx, countX - 84, countY - 58, 168, 116, 18, BURG, "rgba(234,209,129,.88)", 2);
    drawText(ctx, String(certificateSanctuaries.length).padStart(2, "0"), countX, countY - 4, {
      size: 48,
      family: "'Jost', sans-serif",
      weight: "800",
      color: GOLD_LIGHT,
      align: "center"
    });
    drawWrappedText(ctx, copy.count(certificateSanctuaries.length).toUpperCase(), countX, countY + 28, 132, {
      size: 12,
      family: "'Jost', sans-serif",
      weight: "800",
      color: PAPER,
      align: "center",
      lineHeight: 15,
      maxLines: 2
    });

    const listTitleY = cardY + 516;
    ctx.strokeStyle = "rgba(197,150,58,.68)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center - 330, listTitleY - 26);
    ctx.lineTo(center - 96, listTitleY - 26);
    ctx.moveTo(center + 96, listTitleY - 26);
    ctx.lineTo(center + 330, listTitleY - 26);
    ctx.stroke();
    drawText(ctx, copy.places.toUpperCase(), center, listTitleY, {
      size: 15,
      family: "'Jost', sans-serif",
      weight: "800",
      color: GOLD,
      align: "center"
    });

    const listX = cardX + 58;
    const listY = cardY + 536;
    const listW = cardW - 116;
    const listH = 124;
    const listItems = certificateSanctuaries.map(s => sd(s).name);
    const columnsLayout = buildCertificateColumns(ctx, listItems, listW - 44, listH - 28) || {
      columns: 1,
      rowsPerColumn: listItems.length,
      prepared: listItems.map(item => ({lines:[item], blockHeight:40, size:16})),
      heights: [listItems.length * 40],
      columnGap: 0,
      columnWidth: listW - 44
    };
    roundedRect(ctx, listX, listY, listW, listH, 18, WHITE, "rgba(234,209,129,.68)", 2);

    for(let column = 0; column < columnsLayout.columns; column++){
      let y = listY + 24;
      for(let row = 0; row < columnsLayout.rowsPerColumn; row++){
        const index = (column * columnsLayout.rowsPerColumn) + row;
        if(index >= certificateSanctuaries.length) break;
        const item = columnsLayout.prepared[index];
        const itemX = listX + 22 + column * (columnsLayout.columnWidth + columnsLayout.columnGap);
        if((row + column) % 2 === 0){
          roundedRect(ctx, itemX - 8, y - 19, columnsLayout.columnWidth, item.blockHeight - 4, 10, "rgba(246,236,218,.92)");
        }
        item.lines.forEach((line, lineIndex) => {
          drawText(ctx, line, itemX + 10, y + 2 + (lineIndex * 22), {
            size: item.size || 18,
            family: "'Jost', sans-serif",
            weight: "500",
            color: BROWN
          });
        });
        y += item.blockHeight;
      }
    }

    const footerY = cardY + cardH - 52;
    ctx.strokeStyle = "rgba(197,150,58,.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 72, footerY - 20);
    ctx.lineTo(cardX + cardW - 72, footerY - 20);
    ctx.stroke();
    drawText(ctx, `${copy.date} ${issued}`, cardX + 84, footerY, {
      size: 19,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: BROWN
    });
    drawText(ctx, `${copy.certNo} ${certNo}`, cardX + cardW - 84, footerY, {
      size: 19,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: BROWN,
      align: "right"
    });
    drawText(ctx, copy.issuedBy, center, footerY + 38, {
      size: 21,
      family: "'Crimson Pro', serif",
      style: "italic",
      color: BURG,
      align: "center"
    });

    ctx.fillStyle = BURG_DARK;
    ctx.fillRect(0, CERT_HEIGHT - 30, CERT_WIDTH, 30);
    drawText(ctx, copy.footer, center, CERT_HEIGHT - 10, {
      size: 12,
      family: "'Jost', sans-serif",
      weight: "700",
      color: GOLD_LIGHT,
      align: "center"
    });

    const safeCountryName = country.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const fileName = `Peregrin_${safeCountryName}_${year}.png`;
    const dataUrl = canvas.toDataURL("image/png");
    window.PEREGRIN_LAST_CERTIFICATE = {countryId, fileName, certNo, heroSource, language:currentLang};

    try{
      const analyticsData = {countryId, count:certificateSanctuaries.length};
      trackCertificateEvent("certificate_preview_open", analyticsData);
      showCertificatePreview(dataUrl, fileName, null, analyticsData);
      showToast(t("certReady"));
    }catch(e){
      console.error("certificate image preview failed:", e);
      showToast(t("certFailed"));
    }
    return {dataUrl, fileName, certNo};
  };
})();
