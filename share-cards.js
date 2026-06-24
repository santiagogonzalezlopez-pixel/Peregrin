(() => {
  const CARD_WIDTH = 1080;
  const CARD_HEIGHT = 1350;

  function trackShareEvent(eventName, params={}){
    if(typeof window.trackEvent === "function"){
      window.trackEvent(eventName, params);
    }
  }

  function shareKindKey(kind){
    return kind === "visitStamp" ? "stamp" : kind;
  }

  function shareAnalyticsData(entity={}, kind="route"){
    const data = {itemId:shareKindKey(kind)};
    if(kind === "route" && entity.id) data.routeId = entity.id;
    if(kind === "achievement" && entity.achievementId) data.achievementId = entity.achievementId;
    if(kind === "passport" && entity.count) data.count = entity.count;
    if(kind === "visitStamp"){
      if(entity.sanctuaryId) data.sanctuaryId = entity.sanctuaryId;
      if(entity.countryId) data.countryId = entity.countryId;
    }
    return data;
  }

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
      incomplete: "Complete every stop to prepare this route card.",
      achievementPreviewTitle: "Milestone card ready",
      achievementReady: "Milestone card ready to share",
      achievementFailed: "We could not prepare the milestone card.",
      achievementIncomplete: "Reach this milestone first.",
      achievementSaved: "Milestone card saved on your device",
      achievementDownloaded: "Milestone card downloaded",
      achievementDiplomaTitle: "Pilgrim milestone",
      achievementAwardedTo: "Awarded to",
      achievementReason: "for reaching this milestone and keeping the memory of the pilgrimage.",
      achievementUnlocked: "Milestone reached",
      achievementCompletedOn: "Reached on",
      passportPreviewTitle: "Your pilgrim passport is ready",
      passportPreviewHint: "Open it here first, then share or download it whenever you want.",
      passportShareAction: "Share passport",
      passportReady: "Passport ready to share",
      passportFailed: "We could not prepare your passport.",
      passportNoVisits: "Register at least one visit to share your passport.",
      passportSaved: "Passport saved on your device",
      passportDownloaded: "Passport downloaded",
      passportShareLabel: "PEREGRIN PASSPORT",
      passportStamps: "pilgrim stamps",
      passportCountries: "countries",
      passportAchievements: "milestones",
      passportMore: "more stamps in Peregrin",
      passportLatest: "Sacred places visited",
      visitStampPreviewTitle: "Visit stamp ready",
      visitStampPreviewHint: "A single sanctuary memory, ready to share or download.",
      visitStampShareAction: "Share stamp",
      visitStampReady: "Visit stamp ready to share",
      visitStampFailed: "We could not prepare this visit stamp.",
      visitStampMissing: "Register this visit first to share its stamp.",
      visitStampSaved: "Visit stamp saved on your device",
      visitStampDownloaded: "Visit stamp downloaded",
      visitStampLabel: "PILGRIM VISIT STAMP",
      visitStampVisited: "Visited",
      visitStampMemory: "A sacred place kept in Peregrin.",
      completed: "Completed pilgrimage route",
      pilgrim: "Peregrin pilgrim",
      holyStops: "holy stops",
      completedOn: "Completed on",
      madeWith: "Made with Peregrin Passport",
      intention: "Pilgrimage completed. Memory kept.",
      footer: "Discover holy places. Mark your pilgrimages. Keep the memory.",
      scopeEurope: "Europe",
      scopeAmericas: "Americas",
      scopeAfrica: "Africa",
      scopeAsia: "Asia",
      scopeOceania: "Oceânia",
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
      incomplete: "Completa todas las paradas para preparar esta tarjeta.",
      achievementPreviewTitle: "Tarjeta de hito lista",
      achievementReady: "Tarjeta de hito lista para compartir",
      achievementFailed: "No hemos podido preparar la tarjeta de hito.",
      achievementIncomplete: "Alcanza primero este hito.",
      achievementSaved: "Tarjeta de hito guardada en tu dispositivo",
      achievementDownloaded: "Tarjeta de hito descargada",
      achievementDiplomaTitle: "Hito del peregrino",
      achievementAwardedTo: "Otorgado a",
      achievementReason: "por alcanzar este hito y guardar memoria de su camino peregrino.",
      achievementUnlocked: "Hito alcanzado",
      achievementCompletedOn: "Alcanzado el",
      passportPreviewTitle: "Tu pasaporte peregrino está listo",
      passportPreviewHint: "Primero puedes verlo aquí; después, compartirlo o descargarlo cuando quieras.",
      passportShareAction: "Compartir pasaporte",
      passportReady: "Pasaporte listo para compartir",
      passportFailed: "No hemos podido preparar tu pasaporte.",
      passportNoVisits: "Registra al menos una visita para compartir tu pasaporte.",
      passportSaved: "Pasaporte guardado en tu dispositivo",
      passportDownloaded: "Pasaporte descargado",
      passportShareLabel: "PEREGRIN PASSPORT",
      passportStamps: "sellos peregrinos",
      passportCountries: "países",
      passportAchievements: "hitos",
      passportMore: "sellos más en Peregrin",
      passportLatest: "Lugares santos visitados",
      visitStampPreviewTitle: "Sello de visita listo",
      visitStampPreviewHint: "Un recuerdo de este santuario, listo para compartir o descargar.",
      visitStampShareAction: "Compartir sello",
      visitStampReady: "Sello listo para compartir",
      visitStampFailed: "No hemos podido preparar este sello.",
      visitStampMissing: "Registra primero esta visita para compartir su sello.",
      visitStampSaved: "Sello guardado en tu dispositivo",
      visitStampDownloaded: "Sello descargado",
      visitStampLabel: "SELLO DE VISITA PEREGRINA",
      visitStampVisited: "Visitado",
      visitStampMemory: "Un lugar santo guardado en Peregrin.",
      completed: "Ruta de peregrinación completada",
      pilgrim: "Peregrino de Peregrin",
      holyStops: "lugares santos",
      completedOn: "Completada el",
      madeWith: "Creado con Peregrin Passport",
      intention: "Peregrinación completada. Memoria guardada.",
      footer: "Descubre lugares santos. Marca tus peregrinaciones. Guarda la memoria.",
      scopeEurope: "Europa",
      scopeAmericas: "América",
      scopeAfrica: "África",
      scopeAsia: "Asia",
      scopeOceania: "Oceanía",
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
      incomplete: "Complétez toutes les étapes pour préparer cette carte.",
      achievementPreviewTitle: "Carte de jalon prête",
      achievementReady: "Carte de jalon prête à partager",
      achievementFailed: "Impossible de préparer la carte de jalon.",
      achievementIncomplete: "Atteignez d’abord ce jalon.",
      achievementSaved: "Carte de jalon enregistrée sur votre appareil",
      achievementDownloaded: "Carte de jalon téléchargée",
      achievementDiplomaTitle: "Jalon du pèlerin",
      achievementAwardedTo: "Attribué à",
      achievementReason: "pour avoir atteint cette étape et gardé la mémoire du pèlerinage.",
      achievementUnlocked: "Jalon atteint",
      achievementCompletedOn: "Atteint le",
      passportPreviewTitle: "Votre passeport pèlerin est prêt",
      passportPreviewHint: "Vous pouvez d’abord le voir ici, puis le partager ou le télécharger.",
      passportShareAction: "Partager le passeport",
      passportReady: "Passeport prêt à partager",
      passportFailed: "Impossible de préparer votre passeport.",
      passportNoVisits: "Enregistrez au moins une visite pour partager votre passeport.",
      passportSaved: "Passeport enregistré sur votre appareil",
      passportDownloaded: "Passeport téléchargé",
      passportShareLabel: "PEREGRIN PASSPORT",
      passportStamps: "tampons pèlerins",
      passportCountries: "pays",
      passportAchievements: "jalons",
      passportMore: "tampons de plus dans Peregrin",
      passportLatest: "Lieux saints visités",
      visitStampPreviewTitle: "Tampon de visite prêt",
      visitStampPreviewHint: "Un souvenir de ce sanctuaire, prêt à partager ou télécharger.",
      visitStampShareAction: "Partager le tampon",
      visitStampReady: "Tampon prêt à partager",
      visitStampFailed: "Impossible de préparer ce tampon de visite.",
      visitStampMissing: "Enregistrez d'abord cette visite pour partager son tampon.",
      visitStampSaved: "Tampon enregistré sur votre appareil",
      visitStampDownloaded: "Tampon téléchargé",
      visitStampLabel: "TAMPON DE VISITE PÈLERINE",
      visitStampVisited: "Visité",
      visitStampMemory: "Un lieu saint gardé dans Peregrin.",
      completed: "Route de pèlerinage terminée",
      pilgrim: "Pèlerin Peregrin",
      holyStops: "lieux saints",
      completedOn: "Terminée le",
      madeWith: "Créé avec Peregrin Passport",
      intention: "Pèlerinage terminé. Mémoire gardée.",
      footer: "Découvrez des lieux saints. Marquez vos pèlerinages. Gardez la mémoire.",
      scopeEurope: "Europe",
      scopeAmericas: "Amériques",
      scopeAfrica: "Afrique",
      scopeAsia: "Asie",
      scopeOceania: "Océanie",
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
      incomplete: "Completa tutte le tappe per preparare questa scheda.",
      achievementPreviewTitle: "Scheda traguardo pronta",
      achievementReady: "Scheda traguardo pronta da condividere",
      achievementFailed: "Non siamo riusciti a preparare la scheda del traguardo.",
      achievementIncomplete: "Raggiungi prima questo traguardo.",
      achievementSaved: "Scheda traguardo salvata sul dispositivo",
      achievementDownloaded: "Scheda traguardo scaricata",
      achievementDiplomaTitle: "Diploma di traguardo",
      achievementAwardedTo: "Assegnato a",
      achievementReason: "per aver raggiunto questo traguardo e custodito la memoria del pellegrinaggio.",
      achievementUnlocked: "Traguardo raggiunto",
      achievementCompletedOn: "Raggiunto il",
      passportPreviewTitle: "Il tuo passaporto pellegrino è pronto",
      passportPreviewHint: "Puoi prima visualizzarlo qui, poi condividerlo o scaricarlo.",
      passportShareAction: "Condividi passaporto",
      passportReady: "Passaporto pronto da condividere",
      passportFailed: "Non siamo riusciti a preparare il passaporto.",
      passportNoVisits: "Registra almeno una visita per condividere il passaporto.",
      passportSaved: "Passaporto salvato sul dispositivo",
      passportDownloaded: "Passaporto scaricato",
      passportShareLabel: "PEREGRIN PASSPORT",
      passportStamps: "timbri pellegrini",
      passportCountries: "paesi",
      passportAchievements: "traguardi",
      passportMore: "altri timbri in Peregrin",
      passportLatest: "Luoghi santi visitati",
      visitStampPreviewTitle: "Timbro di visita pronto",
      visitStampPreviewHint: "Un ricordo di questo santuario, pronto da condividere o scaricare.",
      visitStampShareAction: "Condividi timbro",
      visitStampReady: "Timbro pronto da condividere",
      visitStampFailed: "Non siamo riusciti a preparare questo timbro.",
      visitStampMissing: "Registra prima questa visita per condividere il timbro.",
      visitStampSaved: "Timbro salvato sul dispositivo",
      visitStampDownloaded: "Timbro scaricato",
      visitStampLabel: "TIMBRO DI VISITA PELLEGRINA",
      visitStampVisited: "Visitato",
      visitStampMemory: "Un luogo santo custodito in Peregrin.",
      completed: "Percorso di pellegrinaggio completato",
      pilgrim: "Pellegrino Peregrin",
      holyStops: "luoghi santi",
      completedOn: "Completato il",
      madeWith: "Creato con Peregrin Passport",
      intention: "Pellegrinaggio completato. Memoria custodita.",
      footer: "Scopri luoghi santi. Segna i pellegrinaggi. Custodisci la memoria.",
      scopeEurope: "Europa",
      scopeAmericas: "Americhe",
      scopeAfrica: "Africa",
      scopeAsia: "Asia",
      scopeOceania: "Oceania",
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
      incomplete: "Complete todas as paragens para preparar este cartão.",
      achievementPreviewTitle: "Cartão de marco pronto",
      achievementReady: "Cartão de marco pronto para partilhar",
      achievementFailed: "Não foi possível preparar o cartão do marco.",
      achievementIncomplete: "Alcance primeiro este marco.",
      achievementSaved: "Cartão de marco guardado no seu dispositivo",
      achievementDownloaded: "Cartão de marco descarregado",
      achievementDiplomaTitle: "Marco do peregrino",
      achievementAwardedTo: "Atribuído a",
      achievementReason: "por alcançar este marco e guardar a memória da peregrinação.",
      achievementUnlocked: "Marco alcançado",
      achievementCompletedOn: "Alcançado em",
      passportPreviewTitle: "O seu passaporte peregrino está pronto",
      passportPreviewHint: "Pode vê-lo primeiro aqui e depois partilhar ou descarregar.",
      passportShareAction: "Partilhar passaporte",
      passportReady: "Passaporte pronto para partilhar",
      passportFailed: "Não foi possível preparar o seu passaporte.",
      passportNoVisits: "Registe pelo menos uma visita para partilhar o seu passaporte.",
      passportSaved: "Passaporte guardado no seu dispositivo",
      passportDownloaded: "Passaporte descarregado",
      passportShareLabel: "PEREGRIN PASSPORT",
      passportStamps: "selos peregrinos",
      passportCountries: "países",
      passportAchievements: "marcos",
      passportMore: "mais selos no Peregrin",
      passportLatest: "Lugares santos visitados",
      visitStampPreviewTitle: "Selo de visita pronto",
      visitStampPreviewHint: "Uma memória deste santuário, pronta para partilhar ou descarregar.",
      visitStampShareAction: "Partilhar selo",
      visitStampReady: "Selo pronto para partilhar",
      visitStampFailed: "Não foi possível preparar este selo.",
      visitStampMissing: "Registe primeiro esta visita para partilhar o respetivo selo.",
      visitStampSaved: "Selo guardado no seu dispositivo",
      visitStampDownloaded: "Selo descarregado",
      visitStampLabel: "SELO DE VISITA PEREGRINA",
      visitStampVisited: "Visitado",
      visitStampMemory: "Um lugar santo guardado no Peregrin.",
      completed: "Rota de peregrinação concluída",
      pilgrim: "Peregrino Peregrin",
      holyStops: "lugares santos",
      completedOn: "Concluída em",
      madeWith: "Criado com Peregrin Passport",
      intention: "Peregrinação concluída. Memória guardada.",
      footer: "Descubra lugares santos. Marque peregrinações. Guarde a memória.",
      scopeEurope: "Europa",
      scopeAmericas: "Américas",
      scopeAfrica: "África",
      scopeAsia: "Ásia",
      scopeOceania: "Oceania",
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

  function achievementLabel(achievement){
    const localized = achievement?.[getLang()] || achievement?.en || achievement || {};
    return localized.name || achievement?.id || "Milestone";
  }

  function achievementDescription(achievement){
    const localized = achievement?.[getLang()] || achievement?.en || achievement || {};
    return localized.desc || "";
  }

  function getAchievement(achievementId){
    try{ return achievements.find(achievement => achievement.id === achievementId); }catch(e){ return null; }
  }

  function sanctuaryLabel(sanctuary){
    const localized = sanctuary?.[getLang()] || sanctuary?.en || sanctuary || {};
    return localized.name || sanctuary?.name || "";
  }

  function countryLabel(country){
    try{
      if(typeof cn === "function") return cn(country);
    }catch(e){}
    const lang = getLang();
    if(lang !== "en"){
      const key = `name${lang.charAt(0).toUpperCase()}${lang.slice(1)}`;
      if(country?.[key]) return country[key];
    }
    return country?.name || "";
  }

  function routeIsComplete(route){
    return !!route && route.stops.every(id => {
      try{ return isVisited(id); }catch(e){ return false; }
    });
  }

  function achievementState(achievement){
    try{
      const vc = getVisitCount();
      const visitedCountries = new Set(sanctuaries.filter(s => isVisited(s.id)).map(s => s.country));
      let progress = 0;
      let unlocked = false;
      if(achievement.special === "countries5"){
        const n = visitedCountries.size;
        progress = Math.min(n / 5, 1);
        unlocked = n >= 5;
      }else if(achievement.special === "americas3"){
        const n = countVisitedCountriesInRegion(visitedCountries, "americas");
        progress = Math.min(n / 3, 1);
        unlocked = n >= 3;
      }else if(achievement.special === "asia2"){
        const n = countVisitedCountriesInRegion(visitedCountries, "asia");
        progress = Math.min(n / 2, 1);
        unlocked = n >= 2;
      }else if(achievement.condition){
        progress = Math.min(vc / achievement.total, 1);
        unlocked = achievement.condition(vc);
      }else if(achievement.ids){
        const done = achievement.ids.filter(id => isVisited(id)).length;
        progress = done / achievement.total;
        unlocked = done >= achievement.total;
      }
      return {progress, unlocked, percent:Math.round(progress * 100)};
    }catch(e){
      return {progress:0, unlocked:false, percent:0};
    }
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
        if(regions[0] === "africa") return copy("scopeAfrica");
        if(regions[0] === "asia") return copy("scopeAsia");
        if(regions[0] === "oceania") return copy("scopeOceania");
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

  function formatAchievementDate(achievement){
    let value = "";
    try{
      if(achievement.ids?.length){
        const dates = achievement.ids.map(id => visits[id]).filter(Boolean).sort();
        value = dates[dates.length - 1] || "";
      }else{
        const dates = Object.values(visits || {}).filter(Boolean).sort();
        value = dates[dates.length - 1] || "";
      }
    }catch(e){}
    const date = value ? new Date(`${value}T12:00:00`) : new Date();
    try{
      return date.toLocaleDateString(getLang(), {year:"numeric", month:"long", day:"numeric"});
    }catch(e){
      return date.toISOString().split("T")[0];
    }
  }

  function formatVisitDate(value){
    const date = value ? new Date(`${value}T12:00:00`) : new Date();
    try{
      return date.toLocaleDateString(getLang(), {day:"numeric", month:"short", year:"numeric"}).replace(/\./g, "");
    }catch(e){
      return value || date.toISOString().split("T")[0];
    }
  }

  function getVisitedStamps(){
    try{
      return Object.entries(visits || {})
        .map(([id, date]) => {
          const sanctuary = sanctuaries.find(item => String(item.id) === String(id));
          if(!sanctuary) return null;
          const country = countries.find(item => item.id === sanctuary.country);
          return {id, date, sanctuary, country};
        })
        .filter(Boolean)
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || Number(b.id) - Number(a.id));
    }catch(e){
      return [];
    }
  }

  function getVisitStamp(sanctuaryId){
    try{
      const sanctuary = sanctuaries.find(item => String(item.id) === String(sanctuaryId));
      if(!sanctuary) return null;
      const date = visits?.[sanctuary.id] || visits?.[String(sanctuary.id)];
      if(!date) return null;
      const country = countries.find(item => item.id === sanctuary.country);
      return {id:sanctuary.id, date, sanctuary, country};
    }catch(e){
      return null;
    }
  }

  function sanctuaryHeroImage(sanctuary){
    try{
      if(typeof getSanctuaryHeroImage === "function") return getSanctuaryHeroImage(sanctuary);
    }catch(e){}
    return "assets/sanctuary-hero.png";
  }

  function getUnlockedAchievementCount(){
    try{
      return achievements.filter(achievement => achievementState(achievement).unlocked).length;
    }catch(e){
      return 0;
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

  function drawFittedText(ctx, text, x, y, maxWidth, options={}){
    const {
      size=32,
      family="'Jost', sans-serif",
      weight="400",
      style="normal",
      minSize=Math.max(10, Math.floor(size * 0.72))
    } = options;
    let fittedSize = size;
    let value = String(text || "");
    while(fittedSize > minSize){
      ctx.font = `${style} ${weight} ${fittedSize}px ${family}`;
      if(ctx.measureText(value).width <= maxWidth) break;
      fittedSize -= 1;
    }
    ctx.font = `${style} ${weight} ${fittedSize}px ${family}`;
    if(ctx.measureText(value).width > maxWidth){
      while(value.length > 4 && ctx.measureText(`${value}...`).width > maxWidth){
        value = value.slice(0, -1).trimEnd();
      }
      value = `${value}...`;
    }
    drawText(ctx, value, x, y, {...options, size:fittedSize});
    return value;
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

    roundedRect(ctx, 370, 684, 340, 88, 24, burgundy, null);
    drawText(ctx, `${stops.length}/${stops.length}`, CARD_WIDTH / 2, 730, {
      size: 42,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: goldLight,
      align: "center"
    });
    drawText(ctx, copy("holyStops").toUpperCase(), CARD_WIDTH / 2, 756, {
      size: 17,
      weight: "800",
      color: "rgba(253,245,230,0.74)",
      align: "center"
    });

    const listTop = 812;
    const listBottom = 1134;
    const rowHeight = Math.max(38, Math.min(64, Math.floor((listBottom - listTop) / Math.max(stops.length, 1))));
    const stopNameSize = stops.length > 6 ? 22 : 25;
    const stopNameLines = rowHeight >= 56 ? 2 : 1;
    stops.forEach((stop, index) => {
      const d = typeof sd === "function" ? sd(stop) : stop;
      const y = listTop + index * rowHeight;
      const stopName = clampLines(ctx, d.name || stop.name, 760, stopNameLines, {
        size: stopNameSize,
        family: "'Crimson Pro', serif",
        weight: "700"
      });
      roundedRect(ctx, 134, y - 26, 42, 42, 21, index % 2 ? "#F5E6CC" : "#E8C97A", null);
      drawText(ctx, String(index + 1), 155, y + 3, {
        size: 22,
        weight: "800",
        color: burgundyDark,
        align: "center",
        baseline: "middle"
      });
      stopName.forEach((line, lineIndex) => {
        drawText(ctx, line, 196, y - 2 + (lineIndex * 26), {
          size: stopNameSize,
          family: "'Crimson Pro', serif",
          weight: "700",
          color: brown
        });
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

  function drawDiamond(ctx, x, y, radius, color){
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.quadraticCurveTo(x + radius * 0.55, y - radius * 0.55, x + radius, y);
    ctx.quadraticCurveTo(x + radius * 0.55, y + radius * 0.55, x, y + radius);
    ctx.quadraticCurveTo(x - radius * 0.55, y + radius * 0.55, x - radius, y);
    ctx.quadraticCurveTo(x - radius * 0.55, y - radius * 0.55, x, y - radius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawAchievementCard(ctx, achievement, image){
    const burgundy = "#722F37";
    const burgundyDark = "#3A1118";
    const gold = "#C5963A";
    const goldLight = "#E8C97A";
    const cream = "#FDF5E6";
    const brown = "#3E2723";
    const muted = "#6D4C41";
    const name = achievementLabel(achievement);
    const pilgrim = getPilgrimName();
    const completedOn = formatAchievementDate(achievement);

    const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
    bg.addColorStop(0, "#1b080d");
    bg.addColorStop(0.42, "#fff8ea");
    bg.addColorStop(1, "#ecd7ae");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    drawCoverImage(ctx, image, 0, 0, CARD_WIDTH, 560);
    const veil = ctx.createLinearGradient(0, 0, 0, 590);
    veil.addColorStop(0, "rgba(28,8,12,0.20)");
    veil.addColorStop(0.58, "rgba(45,13,18,0.35)");
    veil.addColorStop(1, "rgba(45,13,18,0.90)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, CARD_WIDTH, 590);

    drawText(ctx, "PEREGRIN", CARD_WIDTH / 2, 72, {
      size: 34,
      weight: "800",
      color: goldLight,
      align: "center",
      letterSpacing: 0
    });
    drawText(ctx, copy("achievementDiplomaTitle").toUpperCase(), CARD_WIDTH / 2, 116, {
      size: 22,
      weight: "800",
      color: "rgba(253,245,230,0.92)",
      align: "center"
    });

    ctx.shadowColor = "rgba(58,17,24,0.22)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 20;
    roundedRect(ctx, 90, 360, 900, 790, 42, "#fffaf0", "rgba(197,150,58,0.90)", 4);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    roundedRect(ctx, 118, 388, 844, 734, 28, null, "rgba(232,201,122,0.80)", 2);

    ctx.strokeStyle = "rgba(232,201,122,0.48)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(164, 452);
    ctx.bezierCurveTo(270, 405, 360, 430, 450, 455);
    ctx.bezierCurveTo(500, 468, 550, 468, 620, 448);
    ctx.bezierCurveTo(745, 412, 830, 420, 916, 456);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(164, 1058);
    ctx.bezierCurveTo(270, 1105, 360, 1080, 450, 1055);
    ctx.bezierCurveTo(500, 1042, 550, 1042, 620, 1062);
    ctx.bezierCurveTo(745, 1098, 830, 1090, 916, 1054);
    ctx.stroke();

    const sealGradient = ctx.createRadialGradient(CARD_WIDTH / 2 - 62, 455, 10, CARD_WIDTH / 2, 506, 128);
    sealGradient.addColorStop(0, "#fff0aa");
    sealGradient.addColorStop(0.48, goldLight);
    sealGradient.addColorStop(1, gold);
    ctx.fillStyle = sealGradient;
    ctx.beginPath();
    ctx.arc(CARD_WIDTH / 2, 506, 94, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = 9;
    ctx.stroke();
    drawDiamond(ctx, CARD_WIDTH / 2, 506, 36, burgundyDark);

    const titleStartY = 650;
    const titleHeight = drawWrappedText(ctx, name, CARD_WIDTH / 2, titleStartY, 760, {
      size: 68,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: brown,
      align: "center",
      maxLines: 2,
      lineHeight: 70
    });
    const ruleY = titleStartY + titleHeight + 18;
    ctx.strokeStyle = "rgba(197,150,58,0.70)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(260, ruleY);
    ctx.lineTo(820, ruleY);
    ctx.stroke();

    const awardedY = ruleY + 64;
    drawText(ctx, copy("achievementAwardedTo").toUpperCase(), CARD_WIDTH / 2, awardedY, {
      size: 24,
      weight: "800",
      color: burgundy,
      align: "center"
    });

    const pilgrimY = awardedY + 80;
    drawWrappedText(ctx, pilgrim, CARD_WIDTH / 2, pilgrimY, 760, {
      size: 52,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: burgundy,
      align: "center",
      maxLines: 2,
      lineHeight: 54
    });

    const reasonY = pilgrimY + 74;
    const reasonHeight = drawWrappedText(ctx, copy("achievementReason"), CARD_WIDTH / 2, reasonY, 700, {
      size: 26,
      weight: "500",
      color: muted,
      align: "center",
      maxLines: 2,
      lineHeight: 36
    });

    const dateY = reasonY + reasonHeight + 54;
    drawText(ctx, `${copy("achievementCompletedOn")} ${completedOn}`.toUpperCase(), CARD_WIDTH / 2, dateY, {
      size: 22,
      weight: "800",
      color: "rgba(109,76,65,0.90)",
      align: "center"
    });

    ctx.beginPath();
    ctx.arc(CARD_WIDTH / 2, 1115, 30, 0, Math.PI * 2);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 3;
    ctx.stroke();
    drawText(ctx, "P", CARD_WIDTH / 2, 1124, {
      size: 25,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: burgundy,
      align: "center"
    });

    const footer = ctx.createLinearGradient(0, 1215, CARD_WIDTH, CARD_HEIGHT);
    footer.addColorStop(0, burgundy);
    footer.addColorStop(1, burgundyDark);
    ctx.fillStyle = footer;
    ctx.fillRect(0, 1215, CARD_WIDTH, 135);
    drawText(ctx, "PEREGRIN", CARD_WIDTH / 2, 1272, {
      size: 44,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: cream,
      align: "center"
    });
    drawText(ctx, copy("footer"), CARD_WIDTH / 2, 1320, {
      size: 24,
      weight: "600",
      color: "rgba(253,245,230,0.76)",
      align: "center"
    });
  }

  function drawPassportSealMark(ctx, x, y, radius, colors, index=0){
    const {burgundy, burgundyDark, gold, goldLight, cream} = colors;
    const seal = ctx.createRadialGradient(x - radius * 0.38, y - radius * 0.45, 6, x, y, radius);
    seal.addColorStop(0, "#8c404a");
    seal.addColorStop(0.54, burgundy);
    seal.addColorStop(1, burgundyDark);
    ctx.fillStyle = seal;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = gold;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = "rgba(253,245,230,0.22)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, radius - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = cream;
    ctx.fillStyle = cream;
    ctx.lineWidth = 3.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if(index % 3 === 0){
      ctx.beginPath();
      ctx.moveTo(x - 20, y + 17);
      ctx.lineTo(x + 20, y + 17);
      ctx.moveTo(x - 14, y + 17);
      ctx.lineTo(x - 14, y - 9);
      ctx.lineTo(x, y - 24);
      ctx.lineTo(x + 14, y - 9);
      ctx.lineTo(x + 14, y + 17);
      ctx.moveTo(x - 5, y + 17);
      ctx.lineTo(x - 5, y + 2);
      ctx.quadraticCurveTo(x - 5, y - 8, x, y - 8);
      ctx.quadraticCurveTo(x + 5, y - 8, x + 5, y + 2);
      ctx.lineTo(x + 5, y + 17);
      ctx.stroke();
    }else if(index % 3 === 1){
      ctx.beginPath();
      ctx.moveTo(x, y - 28);
      ctx.lineTo(x, y + 23);
      ctx.moveTo(x - 15, y - 12);
      ctx.lineTo(x + 15, y - 12);
      ctx.moveTo(x - 22, y + 23);
      ctx.lineTo(x + 22, y + 23);
      ctx.stroke();
    }else{
      ctx.beginPath();
      ctx.moveTo(x - 24, y + 20);
      ctx.lineTo(x + 24, y + 20);
      ctx.moveTo(x - 18, y + 18);
      ctx.lineTo(x - 2, y - 18);
      ctx.lineTo(x + 8, y + 1);
      ctx.lineTo(x + 14, y - 9);
      ctx.lineTo(x + 25, y + 18);
      ctx.stroke();
    }
    drawDiamond(ctx, x + radius - 10, y - radius + 10, 9, goldLight);
    ctx.restore();
  }

  function drawPassportStat(ctx, x, y, value, label, colors){
    roundedRect(ctx, x, y, 250, 106, 26, "rgba(114,47,55,0.08)", "rgba(197,150,58,0.38)", 1.4);
    drawText(ctx, value, x + 125, y + 50, {
      size: 46,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: colors.burgundy,
      align: "center"
    });
    drawText(ctx, String(label || "").toUpperCase(), x + 125, y + 82, {
      size: 16,
      weight: "800",
      color: "rgba(62,39,35,0.58)",
      align: "center"
    });
  }

  function getPassportLayout(stampCount){
    const cols = stampCount <= 1 ? 1 : 2;
    const gap = 22;
    const totalWidth = cols === 1 ? 520 : 860;
    const stampWidth = cols === 1 ? totalWidth : Math.floor((totalWidth - gap) / 2);
    const stampHeight = 160;
    const startY = 620;
    const rows = Math.max(1, Math.ceil(stampCount / cols));
    const stampsBottom = stampCount
      ? startY + rows * stampHeight + (rows - 1) * gap
      : startY;
    const footerHeight = 135;
    const footerTop = Math.max(CARD_HEIGHT - footerHeight, stampsBottom + 72);
    const canvasHeight = footerTop + footerHeight;
    return {
      cols,
      gap,
      totalWidth,
      stampWidth,
      stampHeight,
      startX: (CARD_WIDTH - totalWidth) / 2,
      startY,
      rows,
      stampsBottom,
      footerTop,
      footerHeight,
      canvasHeight
    };
  }

  function drawStampPerforation(ctx, x, y, width, height){
    ctx.save();
    ctx.fillStyle = "rgba(197,150,58,0.18)";
    const radius = 3.2;
    const step = 18;
    for(let px = x + 22; px < x + width - 18; px += step){
      ctx.beginPath();
      ctx.arc(px, y + 8, radius, 0, Math.PI * 2);
      ctx.arc(px, y + height - 8, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    for(let py = y + 24; py < y + height - 18; py += step){
      ctx.beginPath();
      ctx.arc(x + 8, py, radius, 0, Math.PI * 2);
      ctx.arc(x + width - 8, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawStampPaperTexture(ctx, x, y, width, height, alpha=0.08){
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#8b6a43";
    ctx.lineWidth = 1;
    for(let i = 0; i < 9; i++){
      const py = y + 22 + (i * (height - 44) / 8);
      ctx.beginPath();
      ctx.moveTo(x + 24, py);
      ctx.bezierCurveTo(x + width * 0.34, py - 8, x + width * 0.66, py + 8, x + width - 24, py);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPassportPostmark(ctx, x, y, radius, color="rgba(114,47,55,0.16)"){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, -0.22, Math.PI * 1.72);
    ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, radius - 11, 0.12, Math.PI * 1.86);
    ctx.stroke();
    for(let i = 0; i < 3; i++){
      const ly = y - 12 + (i * 12);
      ctx.beginPath();
      ctx.moveTo(x + radius * 0.28, ly);
      ctx.lineTo(x + radius * 1.34, ly - 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPassportStamp(ctx, stamp, x, y, width, height, colors, index){
    const {burgundy, burgundyDark, gold, goldLight, cream, brown, muted} = colors;
    ctx.save();
    ctx.shadowColor = "rgba(58,17,24,0.10)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;
    roundedRect(ctx, x, y, width, height, 22, "#fffdf6", "rgba(197,150,58,0.46)", 1.5);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    drawStampPaperTexture(ctx, x + 18, y + 18, width - 36, height - 36, 0.055);
    drawStampPerforation(ctx, x, y, width, height);
    ctx.setLineDash([9, 7]);
    roundedRect(ctx, x + 14, y + 14, width - 28, height - 28, 16, null, "rgba(197,150,58,0.42)", 1.2);
    ctx.setLineDash([]);

    if(stamp?.more){
      const centerX = x + width / 2;
      drawPassportSealMark(ctx, centerX, y + 66, 42, colors, index);
      drawText(ctx, `+${stamp.more}`, centerX, y + 78, {
        size: 36,
        family: "'Crimson Pro', serif",
        weight: "700",
        color: goldLight,
        align: "center"
      });
      drawFittedText(ctx, copy("passportMore"), centerX, y + 124, width - 46, {
        size: 20,
        minSize: 12,
        weight: "800",
        color: brown,
        align: "center"
      });
      ctx.restore();
      return;
    }

    const countryName = countryLabel(stamp.country);
    const placeName = sanctuaryLabel(stamp.sanctuary);
    const date = formatVisitDate(stamp.date);

    drawPassportPostmark(ctx, x + width - 82, y + 48, 42, "rgba(114,47,55,0.14)");
    drawPassportSealMark(ctx, x + 80, y + 80, 48, colors, index);
    drawDiamond(ctx, x + 116, y + 38, 9, goldLight);
    drawText(ctx, "P", x + width - 34, y + 42, {
      size: 22,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: "rgba(197,150,58,0.78)",
      align: "center"
    });
    drawFittedText(ctx, (countryName || "Peregrin").toUpperCase(), x + 148, y + 45, width - 196, {
      size: 14,
      minSize: 10,
      weight: "800",
      color: burgundy
    });
    drawWrappedText(ctx, placeName, x + 148, y + 80, width - 178, {
      size: 23,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: brown,
      maxLines: 2,
      lineHeight: 25
    });
    drawText(ctx, date, x + 148, y + height - 24, {
      size: 14,
      weight: "800",
      color: muted
    });
    ctx.restore();
  }

  function drawVisitStampCard(ctx, stamp, image){
    const colors = {
      burgundy: "#722F37",
      burgundyDark: "#3A1118",
      gold: "#C5963A",
      goldLight: "#E8C97A",
      cream: "#FDF5E6",
      brown: "#3E2723",
      muted: "#6D4C41"
    };
    const {burgundy, burgundyDark, gold, goldLight, cream, brown, muted} = colors;
    const sanctuary = stamp.sanctuary;
    const d = typeof sd === "function" ? sd(sanctuary) : sanctuary;
    const placeName = d?.name || sanctuaryLabel(sanctuary);
    const countryName = countryLabel(stamp.country);
    const location = [d?.city || sanctuary?.city, d?.province || sanctuary?.province, countryName].filter(Boolean).join(" · ");
    const visitDate = formatVisitDate(stamp.date);
    const pilgrim = getPilgrimName();

    const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
    bg.addColorStop(0, "#230B11");
    bg.addColorStop(0.48, cream);
    bg.addColorStop(1, "#F2DFC1");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    drawCoverImage(ctx, image, 0, 0, CARD_WIDTH, 560);
    const veil = ctx.createLinearGradient(0, 0, 0, 620);
    veil.addColorStop(0, "rgba(35,11,17,0.10)");
    veil.addColorStop(0.56, "rgba(35,11,17,0.44)");
    veil.addColorStop(1, "rgba(35,11,17,0.94)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, CARD_WIDTH, 620);

    drawText(ctx, "PEREGRIN", CARD_WIDTH / 2, 82, {
      size: 46,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: cream,
      align: "center"
    });
    drawText(ctx, copy("visitStampLabel"), CARD_WIDTH / 2, 124, {
      size: 20,
      weight: "800",
      color: goldLight,
      align: "center"
    });

    drawWrappedText(ctx, placeName, CARD_WIDTH / 2, 282, 860, {
      size: 68,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: cream,
      align: "center",
      maxLines: 2,
      lineHeight: 74
    });

    ctx.shadowColor = "rgba(58,17,24,0.32)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 22;
    roundedRect(ctx, 86, 438, 908, 724, 44, "#FFF9EE", "rgba(197,150,58,0.72)", 4);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    drawStampPerforation(ctx, 118, 470, 844, 660);
    drawStampPaperTexture(ctx, 156, 512, 768, 556, 0.065);
    ctx.setLineDash([14, 10]);
    roundedRect(ctx, 132, 488, 816, 624, 34, null, "rgba(197,150,58,0.52)", 2);
    ctx.setLineDash([]);

    drawText(ctx, copy("visitStampVisited").toUpperCase(), CARD_WIDTH / 2, 548, {
      size: 24,
      weight: "900",
      color: "rgba(114,47,55,0.70)",
      align: "center"
    });

    drawPassportPostmark(ctx, 716, 630, 74, "rgba(114,47,55,0.16)");
    drawPassportSealMark(ctx, CARD_WIDTH / 2, 664, 104, colors, Number(stamp.id) || 0);
    drawDiamond(ctx, 652, 570, 13, goldLight);
    drawDiamond(ctx, 428, 758, 10, gold);

    drawWrappedText(ctx, placeName, CARD_WIDTH / 2, 850, 730, {
      size: 58,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: brown,
      align: "center",
      maxLines: 3,
      lineHeight: 62
    });

    drawFittedText(ctx, location, CARD_WIDTH / 2, 1018, 720, {
      size: 25,
      minSize: 17,
      weight: "700",
      color: muted,
      align: "center"
    });

    roundedRect(ctx, 304, 1056, 472, 64, 22, burgundy, null);
    drawText(ctx, visitDate.toUpperCase(), CARD_WIDTH / 2, 1097, {
      size: 23,
      weight: "900",
      color: goldLight,
      align: "center"
    });

    drawFittedText(ctx, pilgrim, CARD_WIDTH / 2, 1212, 760, {
      size: 36,
      minSize: 24,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: burgundy,
      align: "center"
    });
    drawText(ctx, copy("visitStampMemory"), CARD_WIDTH / 2, 1255, {
      size: 22,
      weight: "600",
      color: "rgba(62,39,35,0.74)",
      align: "center"
    });

    const footer = ctx.createLinearGradient(0, 1288, CARD_WIDTH, CARD_HEIGHT);
    footer.addColorStop(0, burgundy);
    footer.addColorStop(1, burgundyDark);
    ctx.fillStyle = footer;
    ctx.fillRect(0, 1288, CARD_WIDTH, 62);
    drawText(ctx, copy("madeWith"), CARD_WIDTH / 2, 1328, {
      size: 22,
      weight: "800",
      color: "rgba(253,245,230,0.80)",
      align: "center"
    });
  }

  function drawPassportCard(ctx, stamps, image){
    const colors = {
      burgundy: "#722F37",
      burgundyDark: "#3A1118",
      gold: "#C5963A",
      goldLight: "#E8C97A",
      cream: "#FDF5E6",
      brown: "#3E2723",
      muted: "#6D4C41"
    };
    const {burgundy, burgundyDark, gold, goldLight, cream, brown, muted} = colors;
    const pilgrim = getPilgrimName();
    const countriesVisited = new Set(stamps.map(stamp => stamp.sanctuary?.country).filter(Boolean)).size;
    const achievementsUnlocked = getUnlockedAchievementCount();
    const layout = getPassportLayout(stamps.length);
    const passportHeight = ctx.canvas?.height || layout.canvasHeight;
    const footerTop = passportHeight - layout.footerHeight;

    const bg = ctx.createLinearGradient(0, 0, 0, passportHeight);
    bg.addColorStop(0, "#16070b");
    bg.addColorStop(0.16, "#351017");
    bg.addColorStop(0.17, "#f8ebd3");
    bg.addColorStop(1, "#fff8ea");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_WIDTH, passportHeight);

    drawCoverImage(ctx, image, 0, 0, CARD_WIDTH, 420);
    const veil = ctx.createLinearGradient(0, 0, 0, 460);
    veil.addColorStop(0, "rgba(22,7,11,0.16)");
    veil.addColorStop(0.56, "rgba(22,7,11,0.48)");
    veil.addColorStop(1, "rgba(22,7,11,0.94)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, CARD_WIDTH, 460);

    drawText(ctx, copy("passportShareLabel"), CARD_WIDTH / 2, 86, {
      size: 38,
      weight: "800",
      color: goldLight,
      align: "center"
    });
    drawText(ctx, "PILGRIM RECORD", CARD_WIDTH / 2, 128, {
      size: 19,
      weight: "800",
      color: "rgba(253,245,230,0.78)",
      align: "center"
    });

    ctx.shadowColor = "rgba(58,17,24,0.26)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 24;
    roundedRect(ctx, 64, 226, 952, footerTop - 246, 44, "#fffaf0", "rgba(197,150,58,0.86)", 4);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    roundedRect(ctx, 94, 258, 892, footerTop - 310, 30, null, "rgba(232,201,122,0.70)", 2);

    ctx.save();
    const emblemX = CARD_WIDTH / 2;
    const emblemY = 310;
    const emblem = ctx.createRadialGradient(emblemX - 13, emblemY - 16, 4, emblemX, emblemY, 42);
    emblem.addColorStop(0, "#fff0aa");
    emblem.addColorStop(0.46, goldLight);
    emblem.addColorStop(1, gold);
    ctx.fillStyle = emblem;
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,250,240,0.86)";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(114,47,55,0.20)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, 29, 0, Math.PI * 2);
    ctx.stroke();
    roundedRect(ctx, emblemX - 5, emblemY - 24, 10, 48, 5, burgundy, null);
    roundedRect(ctx, emblemX - 24, emblemY - 5, 48, 10, 5, burgundy, null);
    [[-21, -21], [21, -21], [-21, 21], [21, 21]].forEach(([dx, dy]) => {
      roundedRect(ctx, emblemX + dx - 2.5, emblemY + dy - 8, 5, 16, 2.5, burgundy, null);
      roundedRect(ctx, emblemX + dx - 8, emblemY + dy - 2.5, 16, 5, 2.5, burgundy, null);
    });
    ctx.restore();
    drawFittedText(ctx, pilgrim, CARD_WIDTH / 2, 395, 760, {
      size: 58,
      minSize: 36,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: brown,
      align: "center"
    });
    drawText(ctx, copy("passportLatest").toUpperCase(), CARD_WIDTH / 2, 438, {
      size: 20,
      weight: "800",
      color: "rgba(114,47,55,0.70)",
      align: "center"
    });

    drawPassportStat(ctx, 126, 476, String(stamps.length), copy("passportStamps"), colors);
    drawPassportStat(ctx, 415, 476, String(countriesVisited), copy("passportCountries"), colors);
    drawPassportStat(ctx, 704, 476, String(achievementsUnlocked), copy("passportAchievements"), colors);

    const visibleStamps = stamps;
    const count = visibleStamps.length;
    const {cols, gap, stampWidth, stampHeight, startX, startY, rows, stampsBottom} = layout;

    visibleStamps.forEach((stamp, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const itemsInLastRow = count % cols || cols;
      const itemsInRow = row === rows - 1 ? itemsInLastRow : cols;
      const rowWidth = (itemsInRow * stampWidth) + ((itemsInRow - 1) * gap);
      const rowStartX = row === rows - 1 && itemsInRow < cols ? (CARD_WIDTH - rowWidth) / 2 : startX;
      drawPassportStamp(
        ctx,
        stamp,
        rowStartX + col * (stampWidth + gap),
        startY + row * (stampHeight + gap),
        stampWidth,
        stampHeight,
        colors,
        index
      );
    });

    if(stampsBottom < footerTop - 48){
      drawText(ctx, "PEREGRIN", CARD_WIDTH / 2, footerTop - 52, {
        size: 28,
        family: "'Crimson Pro', serif",
        weight: "700",
        color: "rgba(114,47,55,0.78)",
        align: "center"
      });
    }

    const footer = ctx.createLinearGradient(0, footerTop, CARD_WIDTH, passportHeight);
    footer.addColorStop(0, burgundy);
    footer.addColorStop(1, burgundyDark);
    ctx.fillStyle = footer;
    ctx.fillRect(0, footerTop, CARD_WIDTH, layout.footerHeight);
    drawText(ctx, "PEREGRIN", CARD_WIDTH / 2, footerTop + 57, {
      size: 44,
      family: "'Crimson Pro', serif",
      weight: "700",
      color: cream,
      align: "center"
    });
    drawText(ctx, copy("footer"), CARD_WIDTH / 2, footerTop + 105, {
      size: 24,
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

  async function buildAchievementCard(achievement){
    await waitForFonts();
    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    const ctx = canvas.getContext("2d");
    const image = await loadImage("assets/sanctuary-hero.png");
    drawAchievementCard(ctx, achievement, image);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      fileName: `Peregrin_${safeFilePart(achievementLabel(achievement))}_${new Date().getFullYear()}.png`
    };
  }

  async function buildPassportCard(stamps){
    await waitForFonts();
    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = getPassportLayout(stamps.length).canvasHeight;
    const ctx = canvas.getContext("2d");
    const image = await loadImage("assets/sanctuary-hero.png");
    drawPassportCard(ctx, stamps, image);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      fileName: `Peregrin_Passport_${new Date().getFullYear()}.png`
    };
  }

  async function buildVisitStampCard(stamp){
    await waitForFonts();
    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    const ctx = canvas.getContext("2d");
    const image = await loadImage(sanctuaryHeroImage(stamp.sanctuary));
    drawVisitStampCard(ctx, stamp, image);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      fileName: `Peregrin_Stamp_${safeFilePart(sanctuaryLabel(stamp.sanctuary))}_${new Date().getFullYear()}.png`
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

  function entityLabel(entity){
    return entity?.__shareLabel || routeLabel(entity);
  }

  async function shareImage(dataUrl, fileName, nativeFile, entity){
    if(nativeFile?.uri && isNative()){
      const Share = plugin("Share");
      if(Share?.share){
        try{
          await Share.share({
            title: entityLabel(entity),
            text: copy("madeWith"),
            files: [nativeFile.uri],
            dialogTitle: copy("share")
          });
          toast(entity?.__readyToast || copy("ready"));
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
          await navigator.share({title: entityLabel(entity), text: copy("madeWith"), files: [file]});
          toast(entity?.__readyToast || copy("ready"));
          return;
        }
      }catch(e){
        return;
      }
    }

    downloadImage(dataUrl, fileName);
    toast(entity?.__downloadedToast || copy("downloaded"));
  }

  async function downloadForUser(dataUrl, fileName, nativeFile, kind="route"){
    const savedCopy = kind === "achievement"
      ? copy("achievementSaved")
      : kind === "passport"
        ? copy("passportSaved")
        : kind === "visitStamp"
          ? copy("visitStampSaved")
          : copy("saved");
    const downloadedCopy = kind === "achievement"
      ? copy("achievementDownloaded")
      : kind === "passport"
        ? copy("passportDownloaded")
        : kind === "visitStamp"
          ? copy("visitStampDownloaded")
          : copy("downloaded");
    if(nativeFile?.ok){
      toast(savedCopy);
      return nativeFile;
    }
    const saved = await saveNative(dataUrl, fileName);
    if(saved?.ok){
      toast(savedCopy);
      return saved;
    }
    downloadImage(dataUrl, fileName);
    toast(downloadedCopy);
    return null;
  }

  function showPreview(dataUrl, fileName, entity, kind="route"){
    ensureStyles();
    const analyticsData = shareAnalyticsData(entity, kind);
    trackShareEvent(`${shareKindKey(kind)}_share_preview_open`, analyticsData);
    const previous = document.getElementById("route-share-overlay");
    if(previous) previous.remove();
    const previewTitle = kind === "achievement"
      ? copy("achievementPreviewTitle")
      : kind === "passport"
        ? copy("passportPreviewTitle")
        : kind === "visitStamp"
          ? copy("visitStampPreviewTitle")
          : copy("previewTitle");
    const previewHint = kind === "passport"
      ? copy("passportPreviewHint")
      : kind === "visitStamp"
        ? copy("visitStampPreviewHint")
        : copy("previewHint");
    const shareAction = kind === "passport"
      ? copy("passportShareAction")
      : kind === "visitStamp"
        ? copy("visitStampShareAction")
        : copy("share");
    const readyToast = kind === "achievement"
      ? copy("achievementReady")
      : kind === "passport"
        ? copy("passportReady")
        : kind === "visitStamp"
          ? copy("visitStampReady")
          : copy("ready");
    const downloadedToast = kind === "achievement"
      ? copy("achievementDownloaded")
      : kind === "passport"
        ? copy("passportDownloaded")
        : kind === "visitStamp"
          ? copy("visitStampDownloaded")
          : copy("downloaded");

    const overlay = document.createElement("div");
    overlay.id = "route-share-overlay";
    overlay.className = "route-share-overlay";
    overlay.innerHTML = `
      <div class="route-share-dialog" role="dialog" aria-modal="true" aria-labelledby="route-share-title">
        <div class="route-share-head">
          <div class="route-share-title" id="route-share-title">${escapeHtml(previewTitle)}</div>
          <div class="route-share-hint">${escapeHtml(previewHint)}</div>
        </div>
        <div class="route-share-body">
          <img class="route-share-img" alt="${escapeHtml(previewTitle)}" src="${dataUrl}">
        </div>
        <div class="route-share-actions">
          <button type="button" class="route-share-native">${escapeHtml(shareAction)}</button>
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
        trackShareEvent(`${shareKindKey(kind)}_share_tap`, analyticsData);
        if(!savedNativeFile?.ok) savedNativeFile = await saveNative(dataUrl, fileName);
        await shareImage(dataUrl, fileName, savedNativeFile, {...entity, __readyToast: readyToast, __downloadedToast: downloadedToast});
        trackShareEvent(`${shareKindKey(kind)}_share_done`, analyticsData);
      }finally{
        setBusy(false);
      }
    });
    downloadButton.addEventListener("click", async () => {
      if(busy) return;
      setBusy(true);
      try{
        trackShareEvent(`${shareKindKey(kind)}_download_tap`, analyticsData);
        savedNativeFile = await downloadForUser(dataUrl, fileName, savedNativeFile, kind);
        trackShareEvent(`${shareKindKey(kind)}_download_done`, analyticsData);
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

  async function openAchievement(achievementId){
    const achievement = getAchievement(achievementId);
    if(!achievement) return;
    if(!achievementState(achievement).unlocked){
      toast(copy("achievementIncomplete"));
      return;
    }
    ensureStyles();
    try{
      const {dataUrl, fileName} = await buildAchievementCard(achievement);
      showPreview(dataUrl, fileName, {
        achievementId,
        __shareLabel: achievementLabel(achievement),
        __readyToast: copy("achievementReady")
      }, "achievement");
      toast(copy("achievementReady"));
    }catch(e){
      console.error("achievement card failed:", e);
      toast(copy("achievementFailed"), 5000);
    }
  }

  async function openPassport(){
    const stamps = getVisitedStamps();
    if(!stamps.length){
      toast(copy("passportNoVisits"), 5000);
      return;
    }
    ensureStyles();
    try{
      const {dataUrl, fileName} = await buildPassportCard(stamps);
      showPreview(dataUrl, fileName, {
        count: stamps.length,
        __shareLabel: copy("passportShareLabel"),
        __readyToast: copy("passportReady"),
        __downloadedToast: copy("passportDownloaded")
      }, "passport");
      toast(copy("passportReady"));
    }catch(e){
      console.error("passport card failed:", e);
      toast(copy("passportFailed"), 5000);
    }
  }

  async function openVisitStamp(sanctuaryId){
    const stamp = getVisitStamp(sanctuaryId);
    if(!stamp){
      toast(copy("visitStampMissing"), 5000);
      return;
    }
    ensureStyles();
    try{
      const {dataUrl, fileName} = await buildVisitStampCard(stamp);
      showPreview(dataUrl, fileName, {
        sanctuaryId,
        countryId: stamp.sanctuary?.country,
        __shareLabel: sanctuaryLabel(stamp.sanctuary),
        __readyToast: copy("visitStampReady"),
        __downloadedToast: copy("visitStampDownloaded")
      }, "visitStamp");
      toast(copy("visitStampReady"));
    }catch(e){
      console.error("visit stamp card failed:", e);
      toast(copy("visitStampFailed"), 5000);
    }
  }

  window.PeregrinShareCards = {
    routeButton,
    open,
    openAchievement,
    openPassport,
    openVisitStamp
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
