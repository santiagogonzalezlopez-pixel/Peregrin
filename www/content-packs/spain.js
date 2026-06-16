(function(){
  const data = window.PEREGRIN_DATA;
  if(!data || data.__spainPack20260616) return;
  data.__spainPack20260616 = true;

  const spain = data.countries.find(country => country.id === "es");
  if(spain) spain.free = true;

  const hasSanctuary = id => data.sanctuaries.some(s => s.id === id);
  const addSanctuary = sanctuary => {
    if(!hasSanctuary(sanctuary.id)) data.sanctuaries.push(sanctuary);
  };
  const addRoute = route => {
    if(!data.routes.some(r => r.id === route.id)) data.routes.push(route);
  };
  const addAchievement = achievement => {
    if(!data.achievements.some(a => a.id === achievement.id)) data.achievements.push(achievement);
  };
  const text = (name,type,city,province,description,history,prayer,feast) => ({name,type,city,province,description,history,prayer,feast});

  [
    {
      id:109,country:"es",lat:43.3086,lng:-5.0554,icon:"marian",name:"Sanctuary of Covadonga",type:"Marian shrine",city:"Cangas de Onís",province:"Asturias",
      description:"A mountain sanctuary of Asturias, home to Our Lady of Covadonga and a powerful memory of Christian faith at the beginning of the Reconquest.",
      history:"The Holy Cave and basilica are tied to the tradition of Pelayo and the battle of Covadonga in the eighth century. Pilgrims come to pray before La Santina in the cave above the lakes and valleys of Asturias.",
      prayer:"Our Lady of Covadonga, keep faith alive in the mountains and valleys of Spain. Teach us courage, humility and trust in Christ. Amen.",
      feast:"September 8 (Our Lady of Covadonga)",
      es:text("Santuario de Covadonga","Santuario mariano","Cangas de Onís","Asturias","Santuario de montaña asturiano, hogar de Nuestra Señora de Covadonga y memoria viva de la fe cristiana en los comienzos de la Reconquista.","La Santa Cueva y la basílica están unidas a la tradición de Pelayo y la batalla de Covadonga en el siglo VIII. Los peregrinos rezan ante La Santina en la cueva, sobre los lagos y valles asturianos.","Nuestra Señora de Covadonga, conserva viva la fe en las montañas y valles de España. Enséñanos valentía, humildad y confianza en Cristo. Amén.","8 de septiembre (Nuestra Señora de Covadonga)"),
      fr:text("Sanctuaire de Covadonga","Sanctuaire marial","Cangas de Onís","Asturies","Sanctuaire de montagne des Asturies, demeure de Notre-Dame de Covadonga et memoire forte de la foi chretienne aux debuts de la Reconquete.","La Sainte Grotte et la basilique sont liees a la tradition de Pelage et a la bataille de Covadonga au VIIIe siecle. Les pelerins prient La Santina dans la grotte, au-dessus des lacs et vallees asturiens.","Notre-Dame de Covadonga, garde la foi vivante dans les montagnes et les vallees d'Espagne. Apprends-nous courage, humilite et confiance dans le Christ. Amen.","8 septembre (Notre-Dame de Covadonga)"),
      it:text("Santuario di Covadonga","Santuario mariano","Cangas de Onís","Asturie","Santuario di montagna delle Asturie, casa di Nostra Signora di Covadonga e memoria forte della fede cristiana agli inizi della Reconquista.","La Santa Grotta e la basilica sono legate alla tradizione di Pelagio e alla battaglia di Covadonga nell'VIII secolo. I pellegrini pregano La Santina nella grotta, sopra laghi e valli asturiane.","Nostra Signora di Covadonga, custodisci viva la fede nelle montagne e nelle valli di Spagna. Insegnaci coraggio, umilta e fiducia in Cristo. Amen.","8 settembre (Nostra Signora di Covadonga)"),
      pt:text("Santuario de Covadonga","Santuario mariano","Cangas de Onís","Asturias","Santuario de montanha das Asturias, casa de Nossa Senhora de Covadonga e memoria forte da fe crista nos inicios da Reconquista.","A Santa Gruta e a basilica estao ligadas a tradicao de Pelagio e a batalha de Covadonga no seculo VIII. Os peregrinos rezam diante de La Santina na gruta, sobre lagos e vales asturianos.","Nossa Senhora de Covadonga, guarda viva a fe nas montanhas e vales de Espanha. Ensina-nos coragem, humildade e confianca em Cristo. Amen.","8 de setembro (Nossa Senhora de Covadonga)")
    },
    {
      id:110,country:"es",lat:43.1508,lng:-4.6540,icon:"cross",name:"Monastery of Santo Toribio de Liébana",type:"Monastery and jubilee shrine",city:"Camaleño",province:"Cantabria",
      description:"A Cantabrian monastery that preserves the Lignum Crucis, venerated as one of the great relics of the Cross and a historic jubilee destination.",
      history:"The monastery has been a place of pilgrimage since the Middle Ages. Its Holy Year is celebrated when April 16, the feast of Santo Toribio, falls on a Sunday, drawing pilgrims into the Liébana valley.",
      prayer:"Lord Jesus, through the mystery of your Cross, make every burden a path toward mercy, hope and resurrection. Amen.",
      feast:"April 16 (Santo Toribio)",
      es:text("Monasterio de Santo Toribio de Liébana","Monasterio y santuario jubilar","Camaleño","Cantabria","Monasterio cántabro que custodia el Lignum Crucis, venerado como una de las grandes reliquias de la Cruz y destino jubilar histórico.","El monasterio es lugar de peregrinación desde la Edad Media. Su Año Santo se celebra cuando el 16 de abril, fiesta de Santo Toribio, cae en domingo, atrayendo peregrinos al valle de Liébana.","Señor Jesús, por el misterio de tu Cruz, convierte cada carga en camino de misericordia, esperanza y resurrección. Amén.","16 de abril (Santo Toribio)"),
      fr:text("Monastere de Santo Toribio de Liébana","Monastere et sanctuaire jubilaire","Camaleño","Cantabrie","Monastere cantabrique qui conserve le Lignum Crucis, venere comme l'une des grandes reliques de la Croix et destination jubilaire historique.","Le monastere est un lieu de pelerinage depuis le Moyen Age. Son Annee Sainte est celebree lorsque le 16 avril, fete de Santo Toribio, tombe un dimanche, attirant les pelerins dans la vallee de Liébana.","Seigneur Jesus, par le mystere de ta Croix, transforme chaque fardeau en chemin de misericorde, d'esperance et de resurrection. Amen.","16 avril (Santo Toribio)"),
      it:text("Monastero di Santo Toribio de Liébana","Monastero e santuario giubilare","Camaleño","Cantabria","Monastero cantabrico che conserva il Lignum Crucis, venerato come una delle grandi reliquie della Croce e meta giubilare storica.","Il monastero e luogo di pellegrinaggio fin dal Medioevo. Il suo Anno Santo si celebra quando il 16 aprile, festa di Santo Toribio, cade di domenica, attirando pellegrini nella valle di Liébana.","Signore Gesu, per il mistero della tua Croce, trasforma ogni peso in cammino di misericordia, speranza e risurrezione. Amen.","16 aprile (Santo Toribio)"),
      pt:text("Mosteiro de Santo Toribio de Liébana","Mosteiro e santuario jubilar","Camaleño","Cantabria","Mosteiro cantabrico que conserva o Lignum Crucis, venerado como uma das grandes reliquias da Cruz e destino jubilar historico.","O mosteiro e lugar de peregrinacao desde a Idade Media. O seu Ano Santo celebra-se quando 16 de abril, festa de Santo Toribio, calha ao domingo, atraindo peregrinos ao vale de Liébana.","Senhor Jesus, pelo misterio da tua Cruz, transforma cada peso em caminho de misericordia, esperanca e ressurreicao. Amen.","16 de abril (Santo Toribio)")
    },
    {
      id:111,country:"es",lat:38.1056,lng:-1.8633,icon:"cross",name:"Basilica-Sanctuary of the Vera Cruz",type:"Basilica and jubilee shrine",city:"Caravaca de la Cruz",province:"Murcia",
      description:"The hilltop basilica of Caravaca de la Cruz, one of the Catholic Church's permanent jubilee places and home of the revered True Cross.",
      history:"The devotion to the Vera Cruz is rooted in medieval tradition and has shaped Caravaca as a major pilgrim city. Since 1998 it has celebrated a Holy Year every seven years.",
      prayer:"Holy Cross of Caravaca, sign of salvation and mercy, draw every pilgrim closer to the love of Christ. Amen.",
      feast:"May 3 (Vera Cruz)",
      es:text("Basílica-Santuario de la Vera Cruz","Basílica y santuario jubilar","Caravaca de la Cruz","Murcia","Basílica en lo alto de Caravaca de la Cruz, uno de los lugares jubilares permanentes de la Iglesia y hogar de la venerada Vera Cruz.","La devoción a la Vera Cruz hunde sus raíces en la tradición medieval y ha hecho de Caravaca una gran ciudad peregrina. Desde 1998 celebra Año Santo cada siete años.","Vera Cruz de Caravaca, signo de salvación y misericordia, acerca a cada peregrino al amor de Cristo. Amén.","3 de mayo (Vera Cruz)"),
      fr:text("Basilique-sanctuaire de la Vera Cruz","Basilique et sanctuaire jubilaire","Caravaca de la Cruz","Murcie","Basilique au sommet de Caravaca de la Cruz, l'un des lieux jubilaires permanents de l'Eglise et demeure de la Vera Cruz veneree.","La devotion a la Vera Cruz s'enracine dans la tradition medievale et a fait de Caravaca une grande ville de pelerinage. Depuis 1998, elle celebre une Annee Sainte tous les sept ans.","Sainte Croix de Caravaca, signe de salut et de misericorde, rapproche chaque pelerin de l'amour du Christ. Amen.","3 mai (Vera Cruz)"),
      it:text("Basilica-santuario della Vera Cruz","Basilica e santuario giubilare","Caravaca de la Cruz","Murcia","Basilica sulla collina di Caravaca de la Cruz, uno dei luoghi giubilari permanenti della Chiesa e casa della venerata Vera Cruz.","La devozione alla Vera Cruz affonda le radici nella tradizione medievale e ha reso Caravaca una grande citta pellegrina. Dal 1998 celebra l'Anno Santo ogni sette anni.","Santa Croce di Caravaca, segno di salvezza e misericordia, avvicina ogni pellegrino all'amore di Cristo. Amen.","3 maggio (Vera Cruz)"),
      pt:text("Basilica-santuario da Vera Cruz","Basilica e santuario jubilar","Caravaca de la Cruz","Murcia","Basilica no alto de Caravaca de la Cruz, um dos lugares jubilares permanentes da Igreja e casa da venerada Vera Cruz.","A devocao a Vera Cruz tem raizes na tradicao medieval e fez de Caravaca uma grande cidade peregrina. Desde 1998 celebra Ano Santo de sete em sete anos.","Santa Cruz de Caravaca, sinal de salvacao e misericordia, aproxima cada peregrino do amor de Cristo. Amen.","3 de maio (Vera Cruz)")
    },
    {
      id:112,country:"es",lat:37.1296,lng:-6.4844,icon:"marian",name:"Sanctuary of Our Lady of El Rocio",type:"Marian shrine",city:"Almonte",province:"Huelva",
      description:"The whitewashed shrine of El Rocio, center of one of Spain's largest Marian pilgrimages and a living Andalusian devotion.",
      history:"The devotion to the Virgen del Rocio grew from a medieval image venerated near the marshes of Donana. Each Pentecost, brotherhoods travel by road, horse and wagon to the village shrine.",
      prayer:"Our Lady of El Rocio, walk with every pilgrim who crosses dust, marsh and road to meet your Son. Amen.",
      feast:"Pentecost Monday",
      es:text("Santuario de Nuestra Señora del Rocío","Santuario mariano","Almonte","Huelva","Santuario blanco del Rocío, centro de una de las mayores peregrinaciones marianas de España y devoción andaluza viva.","La devoción a la Virgen del Rocío creció en torno a una imagen medieval venerada junto a las marismas de Doñana. Cada Pentecostés, las hermandades llegan por caminos, caballos y carretas hasta la aldea.","Nuestra Señora del Rocío, camina con cada peregrino que cruza polvo, marisma y camino para encontrarse con tu Hijo. Amén.","Lunes de Pentecostés"),
      fr:text("Sanctuaire de Notre-Dame d'El Rocio","Sanctuaire marial","Almonte","Huelva","Sanctuaire blanc d'El Rocio, centre de l'un des plus grands pelerinages marials d'Espagne et devotion andalouse vivante.","La devotion a la Vierge d'El Rocio s'est developpee autour d'une image medievale veneree pres des marais de Donana. A chaque Pentecote, les confreries rejoignent le village par routes, chevaux et chariots.","Notre-Dame d'El Rocio, marche avec chaque pelerin qui traverse poussiere, marais et chemin pour rencontrer ton Fils. Amen.","Lundi de Pentecote"),
      it:text("Santuario di Nostra Signora del Rocio","Santuario mariano","Almonte","Huelva","Santuario bianco del Rocio, centro di uno dei piu grandi pellegrinaggi mariani di Spagna e devozione andalusa viva.","La devozione alla Virgen del Rocio crebbe attorno a un'immagine medievale venerata presso le paludi di Donana. Ogni Pentecoste, le confraternite arrivano al villaggio per strade, cavalli e carri.","Nostra Signora del Rocio, cammina con ogni pellegrino che attraversa polvere, palude e strada per incontrare tuo Figlio. Amen.","Lunedi di Pentecoste"),
      pt:text("Santuario de Nossa Senhora do Rocio","Santuario mariano","Almonte","Huelva","Santuario branco do Rocio, centro de uma das maiores peregrinacoes marianas de Espanha e devocao andaluza viva.","A devocao a Virgem do Rocio cresceu em torno de uma imagem medieval venerada junto aos pantanos de Donana. Em cada Pentecostes, as irmandades chegam por caminhos, cavalos e carros ate a aldeia.","Nossa Senhora do Rocio, caminha com cada peregrino que atravessa po, pantano e estrada para encontrar o teu Filho. Amen.","Segunda-feira de Pentecostes")
    },
    {
      id:113,country:"es",lat:43.1737,lng:-2.2813,icon:"monastery",name:"Sanctuary of Loyola",type:"Basilica and Ignatian shrine",city:"Azpeitia",province:"Gipuzkoa",
      description:"The birthplace shrine of Saint Ignatius of Loyola, centered on his family house and the basilica that welcomes pilgrims beginning the Ignatian way.",
      history:"Ignatius was born in the tower house of Loyola in 1491 and began his conversion after being wounded in Pamplona. The sanctuary grew around the Casa Santa and became a major Jesuit place of memory and prayer.",
      prayer:"Saint Ignatius, teach us to seek and find God in all things, and to choose with freedom, courage and love. Amen.",
      feast:"July 31 (Saint Ignatius of Loyola)",
      es:text("Santuario de Loyola","Basílica y santuario ignaciano","Azpeitia","Gipuzkoa","Santuario natal de San Ignacio de Loyola, centrado en su casa familiar y la basílica que acoge a peregrinos al inicio del camino ignaciano.","Ignacio nació en la casa-torre de Loyola en 1491 y comenzó su conversión tras ser herido en Pamplona. El santuario creció alrededor de la Casa Santa y se convirtió en gran lugar jesuita de memoria y oración.","San Ignacio, enséñanos a buscar y hallar a Dios en todas las cosas, y a elegir con libertad, valentía y amor. Amén.","31 de julio (San Ignacio de Loyola)"),
      fr:text("Sanctuaire de Loyola","Basilique et sanctuaire ignatien","Azpeitia","Gipuzkoa","Sanctuaire natal de saint Ignace de Loyola, centre sur sa maison familiale et la basilique qui accueille les pelerins au debut du chemin ignatien.","Ignace naquit dans la maison-tour de Loyola en 1491 et commenca sa conversion apres sa blessure a Pampelune. Le sanctuaire grandit autour de la Casa Santa et devint un grand lieu jesuite de memoire et de priere.","Saint Ignace, apprends-nous a chercher et trouver Dieu en toute chose, et a choisir avec liberte, courage et amour. Amen.","31 juillet (saint Ignace de Loyola)"),
      it:text("Santuario di Loyola","Basilica e santuario ignaziano","Azpeitia","Gipuzkoa","Santuario natale di sant'Ignazio di Loyola, centrato sulla casa familiare e sulla basilica che accoglie i pellegrini all'inizio del cammino ignaziano.","Ignazio nacque nella casa-torre di Loyola nel 1491 e inizio la conversione dopo essere stato ferito a Pamplona. Il santuario crebbe attorno alla Casa Santa e divenne grande luogo gesuita di memoria e preghiera.","Sant'Ignazio, insegnaci a cercare e trovare Dio in ogni cosa, e a scegliere con liberta, coraggio e amore. Amen.","31 luglio (Sant'Ignazio di Loyola)"),
      pt:text("Santuario de Loyola","Basilica e santuario inaciano","Azpeitia","Gipuzkoa","Santuario natal de Santo Inacio de Loyola, centrado na sua casa familiar e na basilica que acolhe peregrinos no inicio do caminho inaciano.","Inacio nasceu na casa-torre de Loyola em 1491 e iniciou a conversao depois de ser ferido em Pamplona. O santuario cresceu em torno da Casa Santa e tornou-se grande lugar jesuita de memoria e oracao.","Santo Inacio, ensina-nos a procurar e encontrar Deus em todas as coisas, e a escolher com liberdade, coragem e amor. Amen.","31 de julho (Santo Inacio de Loyola)")
    },
    {
      id:114,country:"es",lat:42.5918,lng:-1.2159,icon:"basilica",name:"Castle and Basilica of Javier",type:"Basilica and missionary shrine",city:"Javier",province:"Navarre",
      description:"The castle-basilica where Saint Francis Xavier was born, a Navarrese shrine tied to mission, youth pilgrimages and the Javierada.",
      history:"Francis Xavier was born in the castle in 1506 and became one of the first companions of Ignatius of Loyola. Each year pilgrims walk the Javierada to honor the missionary saint.",
      prayer:"Saint Francis Xavier, kindle in us a missionary heart that carries Christ with joy to every shore and every people. Amen.",
      feast:"December 3 (Saint Francis Xavier)",
      es:text("Castillo y Basílica de Javier","Basílica y santuario misionero","Javier","Navarra","Castillo-basílica donde nació San Francisco Javier, santuario navarro unido a la misión, las peregrinaciones juveniles y la Javierada.","Francisco Javier nació en el castillo en 1506 y fue uno de los primeros compañeros de Ignacio de Loyola. Cada año los peregrinos caminan la Javierada para honrar al santo misionero.","San Francisco Javier, enciende en nosotros un corazón misionero que lleve a Cristo con alegría a toda orilla y a todo pueblo. Amén.","3 de diciembre (San Francisco Javier)"),
      fr:text("Chateau et basilique de Xavier","Basilique et sanctuaire missionnaire","Javier","Navarre","Chateau-basilique ou naquit saint Francois Xavier, sanctuaire navarrais lie a la mission, aux pelerinages de jeunes et a la Javierada.","Francois Xavier naquit au chateau en 1506 et devint l'un des premiers compagnons d'Ignace de Loyola. Chaque annee, les pelerins marchent la Javierada pour honorer le saint missionnaire.","Saint Francois Xavier, allume en nous un coeur missionnaire qui porte le Christ avec joie vers chaque rive et chaque peuple. Amen.","3 decembre (saint Francois Xavier)"),
      it:text("Castello e basilica di Javier","Basilica e santuario missionario","Javier","Navarra","Castello-basilica dove nacque san Francesco Saverio, santuario navarrese legato alla missione, ai pellegrinaggi giovanili e alla Javierada.","Francesco Saverio nacque nel castello nel 1506 e divenne uno dei primi compagni di Ignazio di Loyola. Ogni anno i pellegrini camminano la Javierada per onorare il santo missionario.","San Francesco Saverio, accendi in noi un cuore missionario che porti Cristo con gioia a ogni riva e a ogni popolo. Amen.","3 dicembre (San Francesco Saverio)"),
      pt:text("Castelo e Basilica de Javier","Basilica e santuario missionario","Javier","Navarra","Castelo-basilica onde nasceu Sao Francisco Xavier, santuario navarro ligado a missao, as peregrinacoes juvenis e a Javierada.","Francisco Xavier nasceu no castelo em 1506 e tornou-se um dos primeiros companheiros de Inacio de Loyola. Todos os anos os peregrinos caminham a Javierada para honrar o santo missionario.","Sao Francisco Xavier, acende em nos um coracao missionario que leve Cristo com alegria a cada margem e a cada povo. Amen.","3 de dezembro (Sao Francisco Xavier)")
    },
    {
      id:115,country:"es",lat:40.6567,lng:-4.7000,icon:"monastery",name:"Convent of Saint Teresa",type:"Carmelite shrine",city:"Ávila",province:"Castile and Leon",
      description:"A Carmelite church and convent built over the birthplace of Saint Teresa of Avila, a heart of Spanish mysticism inside the walled city.",
      history:"The convent was founded in the seventeenth century on the site of Teresa's family home. Pilgrims come to remember her reform, writings and witness of prayer.",
      prayer:"Saint Teresa of Jesus, teach us friendship with Christ, courage in reform and joy on the road of prayer. Amen.",
      feast:"October 15 (Saint Teresa of Avila)",
      es:text("Convento de Santa Teresa","Santuario carmelitano","Ávila","Castilla y León","Iglesia y convento carmelitano construido sobre la casa natal de Santa Teresa de Jesús, corazón de la mística española dentro de la ciudad amurallada.","El convento fue fundado en el siglo XVII en el solar de la casa familiar de Teresa. Los peregrinos llegan para recordar su reforma, sus escritos y su testimonio de oración.","Santa Teresa de Jesús, enséñanos la amistad con Cristo, la valentía en la reforma y la alegría en el camino de la oración. Amén.","15 de octubre (Santa Teresa de Jesús)"),
      fr:text("Couvent de sainte Therese","Sanctuaire carmelitain","Avila","Castille-et-Leon","Eglise et couvent carmelitain construit sur le lieu natal de sainte Therese d'Avila, coeur de la mystique espagnole dans la ville fortifiee.","Le couvent fut fonde au XVIIe siecle sur l'emplacement de la maison familiale de Therese. Les pelerins viennent rappeler sa reforme, ses ecrits et son temoignage de priere.","Sainte Therese de Jesus, apprends-nous l'amitie avec le Christ, le courage de la reforme et la joie sur le chemin de la priere. Amen.","15 octobre (sainte Therese d'Avila)"),
      it:text("Convento di Santa Teresa","Santuario carmelitano","Avila","Castiglia e Leon","Chiesa e convento carmelitano costruiti sulla casa natale di santa Teresa d'Avila, cuore della mistica spagnola dentro la citta murata.","Il convento fu fondato nel XVII secolo sul luogo della casa familiare di Teresa. I pellegrini arrivano per ricordare la sua riforma, gli scritti e la testimonianza di preghiera.","Santa Teresa di Gesu, insegnaci l'amicizia con Cristo, il coraggio nella riforma e la gioia nel cammino della preghiera. Amen.","15 ottobre (Santa Teresa d'Avila)"),
      pt:text("Convento de Santa Teresa","Santuario carmelita","Avila","Castela e Leao","Igreja e convento carmelita construido sobre a casa natal de Santa Teresa de Jesus, coracao da mistica espanhola dentro da cidade muralhada.","O convento foi fundado no seculo XVII no local da casa familiar de Teresa. Os peregrinos chegam para recordar a sua reforma, os seus escritos e o testemunho de oracao.","Santa Teresa de Jesus, ensina-nos a amizade com Cristo, a coragem na reforma e a alegria no caminho da oracao. Amen.","15 de outubro (Santa Teresa de Jesus)")
    },
    {
      id:116,country:"es",lat:42.9806,lng:-2.3990,icon:"marian",name:"Sanctuary of Our Lady of Arantzazu",type:"Marian shrine",city:"Oñati",province:"Gipuzkoa",
      description:"A dramatic Basque Marian shrine set in the mountains, beloved by pilgrims and linked to art, silence and the Franciscan tradition.",
      history:"The devotion began after a shepherd found an image of Mary among thorn bushes in the fifteenth century. The modern basilica, rebuilt after fires and war, is one of the most striking sacred works of twentieth-century Spain.",
      prayer:"Our Lady of Arantzazu, found among thorns, help us discover grace in rough places and peace in the mountains of the heart. Amen.",
      feast:"September 9 (Our Lady of Arantzazu)",
      es:text("Santuario de Nuestra Señora de Arantzazu","Santuario mariano","Oñati","Gipuzkoa","Dramático santuario mariano vasco situado en la montaña, querido por peregrinos y unido al arte, el silencio y la tradición franciscana.","La devoción comenzó cuando un pastor encontró una imagen de María entre espinos en el siglo XV. La basílica moderna, reconstruida tras incendios y guerras, es una de las obras sagradas más llamativas de la España del siglo XX.","Nuestra Señora de Arantzazu, encontrada entre espinos, ayúdanos a descubrir la gracia en lugares ásperos y la paz en las montañas del corazón. Amén.","9 de septiembre (Nuestra Señora de Arantzazu)"),
      fr:text("Sanctuaire de Notre-Dame d'Arantzazu","Sanctuaire marial","Onati","Gipuzkoa","Sanctuaire marial basque spectaculaire dans les montagnes, aime des pelerins et lie a l'art, au silence et a la tradition franciscaine.","La devotion commenca lorsqu'un berger trouva une image de Marie parmi les epines au XVe siecle. La basilique moderne, reconstruite apres incendies et guerres, est l'une des oeuvres sacrees les plus frappantes de l'Espagne du XXe siecle.","Notre-Dame d'Arantzazu, trouvee parmi les epines, aide-nous a decouvrir la grace dans les lieux rudes et la paix dans les montagnes du coeur. Amen.","9 septembre (Notre-Dame d'Arantzazu)"),
      it:text("Santuario di Nostra Signora di Arantzazu","Santuario mariano","Onati","Gipuzkoa","Spettacolare santuario mariano basco tra le montagne, amato dai pellegrini e legato all'arte, al silenzio e alla tradizione francescana.","La devozione comincio quando un pastore trovo un'immagine di Maria tra i rovi nel XV secolo. La basilica moderna, ricostruita dopo incendi e guerre, e una delle opere sacre piu impressionanti della Spagna del Novecento.","Nostra Signora di Arantzazu, trovata tra le spine, aiutaci a scoprire la grazia nei luoghi aspri e la pace nelle montagne del cuore. Amen.","9 settembre (Nostra Signora di Arantzazu)"),
      pt:text("Santuario de Nossa Senhora de Arantzazu","Santuario mariano","Onati","Gipuzkoa","Dramatico santuario mariano basco situado nas montanhas, amado pelos peregrinos e ligado a arte, ao silencio e a tradicao franciscana.","A devocao comecou quando um pastor encontrou uma imagem de Maria entre espinhos no seculo XV. A basilica moderna, reconstruida apos incendios e guerras, e uma das obras sagradas mais marcantes da Espanha do seculo XX.","Nossa Senhora de Arantzazu, encontrada entre espinhos, ajuda-nos a descobrir a graca nos lugares asperos e a paz nas montanhas do coracao. Amen.","9 de setembro (Nossa Senhora de Arantzazu)")
    },
    {
      id:117,country:"es",lat:41.7252,lng:1.8270,icon:"cross",name:"Cave of Saint Ignatius",type:"Ignatian shrine",city:"Manresa",province:"Barcelona",
      description:"The cave where Saint Ignatius of Loyola spent months of prayer and discernment, a key place in the birth of the Spiritual Exercises.",
      history:"After leaving Montserrat in 1522, Ignatius stayed in Manresa and prayed in a cave above the Cardener river. The sanctuary preserves the memory of his illumination and deep conversion.",
      prayer:"Saint Ignatius, lead us into silence where God can order our desires and teach us to serve with love. Amen.",
      feast:"July 31 (Saint Ignatius of Loyola)",
      es:text("Cueva de San Ignacio","Santuario ignaciano","Manresa","Barcelona","La cueva donde San Ignacio de Loyola pasó meses de oración y discernimiento, lugar clave en el nacimiento de los Ejercicios Espirituales.","Tras dejar Montserrat en 1522, Ignacio permaneció en Manresa y oró en una cueva sobre el río Cardener. El santuario guarda la memoria de su iluminación y conversión profunda.","San Ignacio, condúcenos al silencio donde Dios puede ordenar nuestros deseos y enseñarnos a servir con amor. Amén.","31 de julio (San Ignacio de Loyola)"),
      fr:text("Grotte de saint Ignace","Sanctuaire ignatien","Manresa","Barcelone","La grotte ou saint Ignace de Loyola passa des mois de priere et de discernement, lieu cle de la naissance des Exercices spirituels.","Apres avoir quitte Montserrat en 1522, Ignace demeura a Manresa et pria dans une grotte au-dessus du Cardener. Le sanctuaire garde la memoire de son illumination et de sa conversion profonde.","Saint Ignace, conduis-nous au silence ou Dieu peut ordonner nos desirs et nous apprendre a servir avec amour. Amen.","31 juillet (saint Ignace de Loyola)"),
      it:text("Grotta di Sant'Ignazio","Santuario ignaziano","Manresa","Barcellona","La grotta dove sant'Ignazio di Loyola trascorse mesi di preghiera e discernimento, luogo chiave nella nascita degli Esercizi spirituali.","Dopo aver lasciato Montserrat nel 1522, Ignazio rimase a Manresa e prego in una grotta sopra il fiume Cardener. Il santuario custodisce la memoria della sua illuminazione e profonda conversione.","Sant'Ignazio, guidaci nel silenzio dove Dio puo ordinare i nostri desideri e insegnarci a servire con amore. Amen.","31 luglio (Sant'Ignazio di Loyola)"),
      pt:text("Gruta de Santo Inacio","Santuario inaciano","Manresa","Barcelona","A gruta onde Santo Inacio de Loyola passou meses de oracao e discernimento, lugar-chave no nascimento dos Exercicios Espirituais.","Depois de deixar Montserrat em 1522, Inacio ficou em Manresa e rezou numa gruta sobre o rio Cardener. O santuario guarda a memoria da sua iluminacao e profunda conversao.","Santo Inacio, conduz-nos ao silencio onde Deus pode ordenar os nossos desejos e ensinar-nos a servir com amor. Amen.","31 de julho (Santo Inacio de Loyola)")
    },
    {
      id:118,country:"es",lat:28.3514,lng:-16.3692,icon:"marian",name:"Basilica of Our Lady of Candelaria",type:"Basilica and Marian shrine",city:"Candelaria",province:"Tenerife",
      description:"The great Marian shrine of the Canary Islands, home to Our Lady of Candelaria, patroness of the archipelago.",
      history:"The devotion is rooted in the pre-Hispanic encounter with the image venerated by the Guanche people and later embraced by the Church. The basilica is a spiritual center for island pilgrims.",
      prayer:"Our Lady of Candelaria, light of the islands, guide every family, sailor and pilgrim toward Christ our true light. Amen.",
      feast:"February 2 and August 15",
      es:text("Basílica de Nuestra Señora de Candelaria","Basílica y santuario mariano","Candelaria","Tenerife","Gran santuario mariano de las Islas Canarias, hogar de Nuestra Señora de Candelaria, patrona del archipiélago.","La devoción nace del encuentro prehispánico con la imagen venerada por el pueblo guanche y asumida después por la Iglesia. La basílica es centro espiritual para los peregrinos de las islas.","Nuestra Señora de Candelaria, luz de las islas, guía a cada familia, marinero y peregrino hacia Cristo, nuestra verdadera luz. Amén.","2 de febrero y 15 de agosto"),
      fr:text("Basilique de Notre-Dame de Candelaria","Basilique et sanctuaire marial","Candelaria","Tenerife","Grand sanctuaire marial des iles Canaries, demeure de Notre-Dame de Candelaria, patronne de l'archipel.","La devotion s'enracine dans la rencontre prehispanique avec l'image veneree par le peuple guanche puis accueillie par l'Eglise. La basilique est un centre spirituel pour les pelerins des iles.","Notre-Dame de Candelaria, lumiere des iles, guide chaque famille, marin et pelerin vers le Christ, notre vraie lumiere. Amen.","2 fevrier et 15 aout"),
      it:text("Basilica di Nostra Signora della Candelaria","Basilica e santuario mariano","Candelaria","Tenerife","Grande santuario mariano delle Isole Canarie, casa di Nostra Signora della Candelaria, patrona dell'arcipelago.","La devozione nasce dall'incontro preispanico con l'immagine venerata dal popolo guanche e poi accolta dalla Chiesa. La basilica e centro spirituale per i pellegrini delle isole.","Nostra Signora della Candelaria, luce delle isole, guida ogni famiglia, marinaio e pellegrino verso Cristo, nostra vera luce. Amen.","2 febbraio e 15 agosto"),
      pt:text("Basilica de Nossa Senhora da Candelaria","Basilica e santuario mariano","Candelaria","Tenerife","Grande santuario mariano das Ilhas Canarias, casa de Nossa Senhora da Candelaria, padroeira do arquipelago.","A devocao nasce do encontro pre-hispanico com a imagem venerada pelo povo guanche e depois acolhida pela Igreja. A basilica e centro espiritual para os peregrinos das ilhas.","Nossa Senhora da Candelaria, luz das ilhas, guia cada familia, marinheiro e peregrino para Cristo, nossa verdadeira luz. Amen.","2 de fevereiro e 15 de agosto")
    },
    {
      id:119,country:"es",lat:39.8220,lng:2.8840,icon:"marian",name:"Sanctuary of Lluc",type:"Marian shrine and monastery",city:"Escorca",province:"Mallorca",
      description:"Mallorca's great mountain shrine, home to the Virgin of Lluc and a deep place of island pilgrimage in the Serra de Tramuntana.",
      history:"The sanctuary grew around the medieval devotion to the Moreneta of Lluc. Generations of Mallorcans have walked up to the monastery to entrust families, harvests and journeys.",
      prayer:"Our Lady of Lluc, mother of Mallorca, receive the prayers carried up the mountain and keep our homes faithful and peaceful. Amen.",
      feast:"September 12 (Our Lady of Lluc)",
      es:text("Santuario de Lluc","Santuario mariano y monasterio","Escorca","Mallorca","Gran santuario de montaña de Mallorca, hogar de la Virgen de Lluc y lugar profundo de peregrinación insular en la Serra de Tramuntana.","El santuario creció alrededor de la devoción medieval a la Moreneta de Lluc. Generaciones de mallorquines han subido al monasterio para confiar familias, cosechas y caminos.","Nuestra Señora de Lluc, madre de Mallorca, recibe las oraciones que suben por la montaña y guarda fieles y en paz nuestros hogares. Amén.","12 de septiembre (Nuestra Señora de Lluc)"),
      fr:text("Sanctuaire de Lluc","Sanctuaire marial et monastere","Escorca","Majorque","Grand sanctuaire de montagne de Majorque, demeure de la Vierge de Lluc et lieu profond de pelerinage insulaire dans la Serra de Tramuntana.","Le sanctuaire grandit autour de la devotion medievale a la Moreneta de Lluc. Des generations de Majorquins sont montees au monastere pour confier familles, recoltes et chemins.","Notre-Dame de Lluc, mere de Majorque, recois les prieres portees vers la montagne et garde nos foyers fideles et en paix. Amen.","12 septembre (Notre-Dame de Lluc)"),
      it:text("Santuario di Lluc","Santuario mariano e monastero","Escorca","Maiorca","Grande santuario di montagna di Maiorca, casa della Vergine di Lluc e luogo profondo di pellegrinaggio isolano nella Serra de Tramuntana.","Il santuario crebbe attorno alla devozione medievale alla Moreneta di Lluc. Generazioni di maiorchini sono salite al monastero per affidare famiglie, raccolti e cammini.","Nostra Signora di Lluc, madre di Maiorca, accogli le preghiere portate sulla montagna e custodisci fedeli e in pace le nostre case. Amen.","12 settembre (Nostra Signora di Lluc)"),
      pt:text("Santuario de Lluc","Santuario mariano e mosteiro","Escorca","Maiorca","Grande santuario de montanha de Maiorca, casa da Virgem de Lluc e lugar profundo de peregrinacao insular na Serra de Tramuntana.","O santuario cresceu em torno da devocao medieval a Moreneta de Lluc. Geracoes de maiorquinos subiram ao mosteiro para confiar familias, colheitas e caminhos.","Nossa Senhora de Lluc, mae de Maiorca, recebe as oracoes levadas pela montanha e guarda fieis e em paz os nossos lares. Amen.","12 de setembro (Nossa Senhora de Lluc)")
    },
    {
      id:120,country:"es",lat:43.2584,lng:-2.9136,icon:"marian",name:"Basilica of Our Lady of Begoña",type:"Basilica and Marian shrine",city:"Bilbao",province:"Biscay",
      description:"Bilbao's beloved Marian basilica, dedicated to Our Lady of Begoña, patroness of Biscay and companion of sailors, workers and families.",
      history:"The shrine has watched over Bilbao from its hill since the sixteenth century. Pilgrims climb the steps to entrust the city, the sea and their homes to the Amatxu of Begoña.",
      prayer:"Our Lady of Begoña, mother and guardian of Biscay, bless those who work, travel and pray beneath your gaze. Amen.",
      feast:"October 11 (Our Lady of Begoña)",
      es:text("Basílica de Nuestra Señora de Begoña","Basílica y santuario mariano","Bilbao","Bizkaia","Querida basílica mariana de Bilbao, dedicada a Nuestra Señora de Begoña, patrona de Bizkaia y compañera de marineros, trabajadores y familias.","El santuario vela sobre Bilbao desde su colina desde el siglo XVI. Los peregrinos suben sus escaleras para confiar la ciudad, el mar y sus hogares a la Amatxu de Begoña.","Nuestra Señora de Begoña, madre y guardiana de Bizkaia, bendice a quienes trabajan, viajan y rezan bajo tu mirada. Amén.","11 de octubre (Nuestra Señora de Begoña)"),
      fr:text("Basilique de Notre-Dame de Begona","Basilique et sanctuaire marial","Bilbao","Biscaye","Basilique mariale bien-aimee de Bilbao, dediee a Notre-Dame de Begona, patronne de Biscaye et compagne des marins, travailleurs et familles.","Le sanctuaire veille sur Bilbao depuis sa colline depuis le XVIe siecle. Les pelerins montent les marches pour confier la ville, la mer et leurs foyers a l'Amatxu de Begona.","Notre-Dame de Begona, mere et gardienne de Biscaye, benis ceux qui travaillent, voyagent et prient sous ton regard. Amen.","11 octobre (Notre-Dame de Begona)"),
      it:text("Basilica di Nostra Signora di Begona","Basilica e santuario mariano","Bilbao","Biscaglia","Amata basilica mariana di Bilbao, dedicata a Nostra Signora di Begona, patrona della Biscaglia e compagna di marinai, lavoratori e famiglie.","Il santuario veglia su Bilbao dalla sua collina dal XVI secolo. I pellegrini salgono i gradini per affidare la citta, il mare e le case all'Amatxu di Begona.","Nostra Signora di Begona, madre e custode della Biscaglia, benedici chi lavora, viaggia e prega sotto il tuo sguardo. Amen.","11 ottobre (Nostra Signora di Begona)"),
      pt:text("Basilica de Nossa Senhora de Begona","Basilica e santuario mariano","Bilbao","Biscaia","Amada basilica mariana de Bilbao, dedicada a Nossa Senhora de Begona, padroeira da Biscaia e companheira de marinheiros, trabalhadores e familias.","O santuario vela por Bilbao desde a sua colina desde o seculo XVI. Os peregrinos sobem as escadas para confiar a cidade, o mar e os lares a Amatxu de Begona.","Nossa Senhora de Begona, mae e guardia da Biscaia, abencoa quem trabalha, viaja e reza sob o teu olhar. Amen.","11 de outubro (Nossa Senhora de Begona)")
    }
  ].forEach(addSanctuary);

  addRoute({
    id:"spain-jubilee-places",
    stops:[101,110,111],
    banner:2,
    image:"assets/routes/camino.png",
    distance:"varies",
    en:{name:"Jubilee Places of Spain",days:"several trips",desc:"A Spanish pilgrimage through three holy doors and great traditions of forgiveness: Santiago, Santo Toribio de Liébana and Caravaca de la Cruz."},
    es:{name:"Lugares jubilares de España",days:"varios viajes",desc:"Una peregrinación española por tres puertas santas y grandes tradiciones de perdón: Santiago, Santo Toribio de Liébana y Caravaca de la Cruz."},
    fr:{name:"Lieux jubilaires d'Espagne",days:"plusieurs voyages",desc:"Un pelerinage espagnol par trois portes saintes et grandes traditions de pardon : Saint-Jacques, Santo Toribio de Liebana et Caravaca de la Cruz."},
    it:{name:"Luoghi giubilari di Spagna",days:"piu viaggi",desc:"Un pellegrinaggio spagnolo attraverso tre porte sante e grandi tradizioni di perdono: Santiago, Santo Toribio de Liebana e Caravaca de la Cruz."},
    pt:{name:"Lugares jubilares de Espanha",days:"varias viagens",desc:"Uma peregrinacao espanhola por tres portas santas e grandes tradicoes de perdao: Santiago, Santo Toribio de Liebana e Caravaca de la Cruz."}
  });

  addRoute({
    id:"ignatian-spain",
    stops:[113,116,117,103],
    banner:4,
    image:"assets/routes/camino.png",
    distance:"650 km",
    en:{name:"Ignatian Spain",days:"by stages",desc:"From Loyola and the Basque mountains to Manresa and Montserrat, following the places where Ignatius learned to listen, choose and serve."},
    es:{name:"España ignaciana",days:"por etapas",desc:"De Loyola y las montañas vascas a Manresa y Montserrat, siguiendo los lugares donde Ignacio aprendió a escuchar, elegir y servir."},
    fr:{name:"Espagne ignatienne",days:"par etapes",desc:"De Loyola et des montagnes basques a Manresa et Montserrat, en suivant les lieux ou Ignace apprit a ecouter, choisir et servir."},
    it:{name:"Spagna ignaziana",days:"a tappe",desc:"Da Loyola e dalle montagne basche a Manresa e Montserrat, seguendo i luoghi in cui Ignazio imparo ad ascoltare, scegliere e servire."},
    pt:{name:"Espanha inaciana",days:"por etapas",desc:"De Loyola e das montanhas bascas a Manresa e Montserrat, seguindo os lugares onde Inacio aprendeu a escutar, escolher e servir."}
  });

  const spainIds = [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120];
  const spainAchievement = data.achievements.find(a => a.id === "spain");
  if(spainAchievement){
    spainAchievement.ids = spainIds;
    spainAchievement.total = spainIds.length;
    spainAchievement.en.desc = "Visit the twenty sacred places of Spain in Peregrin";
    spainAchievement.es.desc = "Visita los veinte lugares sagrados de España en Peregrin";
    spainAchievement.fr.desc = "Visite les vingt lieux sacres d'Espagne dans Peregrin";
    spainAchievement.it.desc = "Visita i venti luoghi sacri della Spagna in Peregrin";
    spainAchievement.pt.desc = "Visita os vinte lugares sagrados de Espanha no Peregrin";
  }

  addAchievement({
    id:"spain-jubilee",
    icon:"cross",
    ids:[101,110,111],
    total:3,
    en:{name:"Jubilee Pilgrim of Spain",desc:"Visit Santiago, Santo Toribio de Liébana and Caravaca de la Cruz"},
    es:{name:"Peregrino jubilar de España",desc:"Visita Santiago, Santo Toribio de Liébana y Caravaca de la Cruz"},
    fr:{name:"Pelerin jubilaire d'Espagne",desc:"Visite Saint-Jacques, Santo Toribio de Liebana et Caravaca de la Cruz"},
    it:{name:"Pellegrino giubilare di Spagna",desc:"Visita Santiago, Santo Toribio de Liebana e Caravaca de la Cruz"},
    pt:{name:"Peregrino jubilar de Espanha",desc:"Visita Santiago, Santo Toribio de Liebana e Caravaca de la Cruz"}
  });

  addAchievement({
    id:"ignatian-spain",
    icon:"cross",
    ids:[113,116,117,103],
    total:4,
    en:{name:"Ignatian Pilgrim",desc:"Visit Loyola, Arantzazu, Manresa and Montserrat"},
    es:{name:"Peregrino ignaciano",desc:"Visita Loyola, Arantzazu, Manresa y Montserrat"},
    fr:{name:"Pelerin ignatien",desc:"Visite Loyola, Arantzazu, Manresa et Montserrat"},
    it:{name:"Pellegrino ignaziano",desc:"Visita Loyola, Arantzazu, Manresa e Montserrat"},
    pt:{name:"Peregrino inaciano",desc:"Visita Loyola, Arantzazu, Manresa e Montserrat"}
  });

  data.certificateRules.es = {
    sanctuaryIds:spainIds,
    summary:{
      en:"20 sacred places of Spain",
      es:"20 lugares sagrados de España",
      fr:"20 lieux sacres d'Espagne",
      it:"20 luoghi sacri della Spagna",
      pt:"20 lugares sagrados de Espanha"
    }
  };

  const routeGuides = window.PEREGRIN_ROUTE_GUIDES = window.PEREGRIN_ROUTE_GUIDES || {};
  Object.assign(routeGuides, {
    "spain-jubilee-places":{
      en:{purpose:"A route through Spain's great jubilee memory: apostolic pilgrimage, the Cross and mercy received as a road.",rhythm:"Live it as three intentional pilgrimages rather than one rushed itinerary. Let each holy place keep one confession, one thanksgiving and one prayer for home.",prayer:"Lord Jesus, open the doors of mercy in my life and teach me to return home reconciled.",practical:"The three shrines are far apart, so this route works best across separate trips or a long Spain pilgrimage plan."},
      es:{purpose:"Una ruta por la gran memoria jubilar de España: peregrinación apostólica, la Cruz y la misericordia recibida como camino.",rhythm:"Vívela como tres peregrinaciones intencionales, no como una carrera. Que cada lugar santo guarde una confesión, una acción de gracias y una oración por casa.",prayer:"Señor Jesús, abre las puertas de la misericordia en mi vida y enséñame a volver a casa reconciliado.",practical:"Los tres santuarios están lejos entre sí; funciona mejor en viajes separados o como gran plan de peregrinación por España."},
      fr:{purpose:"Une route dans la grande memoire jubilaire de l'Espagne : pelerinage apostolique, Croix et misericorde recue comme chemin.",rhythm:"Vivez-la comme trois pelerinages intentionnels plutot qu'un itineraire presse. Que chaque lieu saint garde une confession, une action de grace et une priere pour la maison.",prayer:"Seigneur Jesus, ouvre les portes de la misericorde dans ma vie et apprends-moi a rentrer reconcilie.",practical:"Les trois sanctuaires sont eloignes; la route se vit mieux en voyages separes ou comme grand projet de pelerinage en Espagne."},
      it:{purpose:"Una rotta nella grande memoria giubilare della Spagna: pellegrinaggio apostolico, Croce e misericordia ricevuta come cammino.",rhythm:"Vivila come tre pellegrinaggi intenzionali, non come un itinerario affrettato. Ogni luogo santo custodisca una confessione, un ringraziamento e una preghiera per casa.",prayer:"Signore Gesu, apri le porte della misericordia nella mia vita e insegnami a tornare a casa riconciliato.",practical:"I tre santuari sono lontani tra loro; funziona meglio in viaggi separati o come grande progetto di pellegrinaggio in Spagna."},
      pt:{purpose:"Uma rota pela grande memoria jubilar de Espanha: peregrinacao apostolica, Cruz e misericordia recebida como caminho.",rhythm:"Viva-a como tres peregrinacoes intencionais, nao como um itinerario apressado. Que cada lugar santo guarde uma confissao, uma acao de gracas e uma oracao pela casa.",prayer:"Senhor Jesus, abre as portas da misericordia na minha vida e ensina-me a regressar reconciliado.",practical:"Os tres santuarios ficam longe entre si; funciona melhor em viagens separadas ou como grande plano de peregrinacao por Espanha."}
    },
    "ignatian-spain":{
      en:{purpose:"A route for discernment, following Ignatius from his beginnings to the places where prayer became mission.",rhythm:"Move slowly and keep a journal. This route asks for silence: a wound at Loyola, a Marian pause at Arantzazu, interior light at Manresa and surrender at Montserrat.",prayer:"Saint Ignatius, help me listen deeply and choose what leads to greater love and service.",practical:"The stops can be done in stages. Mark only visits you have truly made and use the private notes for discernment."},
      es:{purpose:"Una ruta de discernimiento, siguiendo a Ignacio desde sus comienzos hasta los lugares donde la oración se volvió misión.",rhythm:"Ve despacio y guarda diario. Esta ruta pide silencio: una herida en Loyola, pausa mariana en Arantzazu, luz interior en Manresa y entrega en Montserrat.",prayer:"San Ignacio, ayúdame a escuchar hondo y a elegir lo que conduce a mayor amor y servicio.",practical:"Las paradas pueden hacerse por etapas. Marca solo visitas reales y usa las notas privadas para el discernimiento."},
      fr:{purpose:"Une route de discernement, suivant Ignace depuis ses commencements jusqu'aux lieux ou la priere devint mission.",rhythm:"Avancez lentement et gardez un journal. Cette route demande le silence : une blessure a Loyola, une pause mariale a Arantzazu, une lumiere interieure a Manresa et l'abandon a Montserrat.",prayer:"Saint Ignace, aide-moi a ecouter en profondeur et a choisir ce qui conduit au plus grand amour et service.",practical:"Les haltes peuvent se faire par etapes. Marquez seulement les visites vraiment faites et utilisez les notes privees pour le discernement."},
      it:{purpose:"Una via di discernimento, seguendo Ignazio dagli inizi ai luoghi in cui la preghiera divenne missione.",rhythm:"Procedi lentamente e tieni un diario. Questa rotta chiede silenzio: una ferita a Loyola, una pausa mariana ad Arantzazu, luce interiore a Manresa e consegna a Montserrat.",prayer:"Sant'Ignazio, aiutami ad ascoltare in profondita e a scegliere cio che conduce a maggiore amore e servizio.",practical:"Le tappe possono essere vissute per fasi. Segna solo visite realmente fatte e usa le note private per il discernimento."},
      pt:{purpose:"Uma rota de discernimento, seguindo Inacio desde os comecos ate aos lugares onde a oracao se tornou missao.",rhythm:"Avance devagar e mantenha um diario. Esta rota pede silencio: uma ferida em Loyola, pausa mariana em Arantzazu, luz interior em Manresa e entrega em Montserrat.",prayer:"Santo Inacio, ajuda-me a escutar profundamente e a escolher o que conduz a maior amor e servico.",practical:"As paragens podem ser feitas por etapas. Marque apenas visitas reais e use as notas privadas para o discernimento."}
    }
  });
})();
