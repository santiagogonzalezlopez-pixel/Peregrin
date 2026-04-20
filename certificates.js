(() => {
  const CERT_WIDTH = 1600;
  const CERT_HEIGHT = 1131;

  function toRgb(values){
    return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
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
    for(let columns = items.length > 10 ? 3 : items.length > 5 ? 2 : 1; columns <= 3; columns++){
      const rowsPerColumn = Math.ceil(items.length / columns);
      const prepared = items.map(item => {
        const lines = clampLines(ctx, item, columnWidth - 58, 2, {
          size: 23,
          family: "'Jost', sans-serif",
          weight: "500"
        });
        const blockHeight = 28 + (lines.length * 30);
        return {lines, blockHeight};
      });
      const heights = Array.from({length: columns}, () => 0);
      prepared.forEach((item, index) => {
        const column = Math.floor(index / rowsPerColumn);
        heights[column] += item.blockHeight;
      });
      if(Math.max(...heights) <= availableHeight || columns === 3){
        return {columns, rowsPerColumn, prepared, heights};
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

  async function saveCertificateImageNative(dataUrl, fileName){
    if(!isNativeAppRuntime()) return {ok:false};
    const Filesystem = getCapacitorPlugin("Filesystem");
    const Share = getCapacitorPlugin("Share");
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

    let shared = false;
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
            text: `${t("certTitle")} · ${fileName}`,
            files: [savedFile.uri],
            dialogTitle: t("certBtn")
          });
          shared = true;
        }catch(primaryShareError){
          try{
            await Share.share({
              title: t("certTitle"),
              text: `${t("certTitle")} · ${fileName}`,
              url: savedFile.uri,
              dialogTitle: t("certBtn")
            });
            shared = true;
          }catch(fallbackShareError){
            console.warn("native certificate image share failed:", fallbackShareError || primaryShareError);
          }
        }
      }
    }

    return {ok:true, shared, uri:savedFile.uri, directory:savedFile.directory};
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
      it:'"Viandante, non c\'e sentiero, il sentiero si fa camminando"',
      pt:'"Caminhante, nao ha caminho, o caminho faz-se ao andar"'
    };
    const subtitles = {
      en:"THE DIGITAL PASSPORT OF THE CATHOLIC PILGRIM",
      es:"EL PASAPORTE DIGITAL DEL PEREGRINO CATOLICO",
      fr:"LE PASSEPORT NUMERIQUE DU PELERIN CATHOLIQUE",
      it:"IL PASSAPORTO DIGITALE DEL PELLEGRINO CATTOLICO",
      pt:"O PASSAPORTE DIGITAL DO PEREGRINO CATOLICO"
    };
    const footers = {
      en:"PEREGRIN - THE DIGITAL PASSPORT OF THE CATHOLIC PILGRIM",
      es:"PEREGRIN - EL PASAPORTE DIGITAL DEL PEREGRINO CATOLICO",
      fr:"PEREGRIN - LE PASSEPORT NUMERIQUE DU PELERIN CATHOLIQUE",
      it:"PEREGRIN - IL PASSAPORTO DIGITALE DEL PELLEGRINO CATTOLICO",
      pt:"PEREGRIN - O PASSAPORTE DIGITAL DO PEREGRINO CATOLICO"
    };
    const meta = {
      en:{completed:"Completed pilgrimage", sanctuaries:"SANCTUARIES", issuedBy:"Issued by Peregrin", certNo:"Certificate No."},
      es:{completed:"Peregrinacion completada", sanctuaries:"SANTUARIOS", issuedBy:"Emitido por Peregrin", certNo:"Certificado n.o"},
      fr:{completed:"Pelerinage accompli", sanctuaries:"SANCTUAIRES", issuedBy:"Emis par Peregrin", certNo:"Certificat n.o"},
      it:{completed:"Pellegrinaggio compiuto", sanctuaries:"SANTUARI", issuedBy:"Emesso da Peregrin", certNo:"Certificato n."},
      pt:{completed:"Peregrinacao concluida", sanctuaries:"SANTUARIOS", issuedBy:"Emitido por Peregrin", certNo:"Certificado n.o"}
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
        ctx.fillStyle = toRgb(GOLD);
        ctx.beginPath();
        ctx.arc(itemX + 18, y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        item.lines.forEach((line, lineIndex) => {
          drawText(ctx, line, itemX + 38, y + 6 + (lineIndex * 26), {
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
      const nativeResult = await saveCertificateImageNative(dataUrl, fileName);
      if(nativeResult.ok){
        showToast(t(nativeResult.shared ? "certReady" : "certSaved"));
        return;
      }
      downloadCertificateImage(dataUrl, fileName);
      showToast(t("certDownloaded"));
    }catch(e){
      console.error("certificate image delivery failed:", e);
      try{
        downloadCertificateImage(dataUrl, fileName);
        showToast(t("certDownloaded"));
      }catch(downloadError){
        console.error("certificate image download fallback failed:", downloadError);
        showToast(t("certFailed"));
      }
    }
  };
})();
