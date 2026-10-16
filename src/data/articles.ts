// Vijesti preuzete sa službenog weba maraton-ladja.hr (iste adrese kao na starom webu).
// Kad se spoji Supabase, ovo ostaje kao rezervni sadržaj.
export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ol"; items: string[] }
  | { t: "ul"; items: string[] }
  | { t: "file"; text: string; href: string };
export type Article = { slug: string; title: string; date: string; cover: string; excerpt: string; body: Block[] };

export const ARTICLES: Article[] = [
 {
  "slug": "lada-na-neretvi-ne-plastika-maraton-bez-plastike",
  "title": "Lađa na Neretvi, ne plastika – Maraton bez plastike",
  "date": "2026-09-24",
  "cover": "https://maraton-ladja.hr/images/WhatsApp_Image_2026-09-21_at_14.20.32_1.jpeg",
  "excerpt": "Četrdesetak volontera, ronilaca i članova udruga očistilo obalu i dno Neretve u Metkoviću.",
  "body": [
   {
    "t": "p",
    "text": "Četrdesetak volontera, ronilaca i članova udruga očistilo obalu i dno Neretve u Metkoviću."
   },
   {
    "t": "p",
    "text": "U Metkoviću je 20. rujna 2026. provedena ekološka akcija „Lađa na Neretvi, ne plastika - Maraton bez plastike“, usmjerena na čišćenje priobalja i riječnog dna Neretve te na podizanje svijesti o onečišćenju okoliša plastikom i drugim otpadom. U akciji je sudjelovalo oko 40 volontera, ronilaca, članova udruga, sportskih klubova i građana."
   },
   {
    "t": "p",
    "text": "Akcija je provedena u sklopu projekta TETHYS4ADRION, kao doprinos pilot-mjeri „Plastic-free event“, kojom se potiče smanjenje uporabe jednokratne plastike i održiviji način organizacije događanja."
   },
   {
    "t": "h",
    "text": "Tradicionalna lađa u službi zaštite okoliša"
   },
   {
    "t": "p",
    "text": "Čišćenje se odvijalo istovremeno na više lokacija. Udruga lađara Neretve i Udruga Gusarice Metković koristile su tradicionalnu neretvansku lađu kako bi došle do teško dostupnih dijelova priobalja - plovilo koje je stoljećima dio identiteta ovog kraja tako je poslužilo zaštiti rijeke koja ga je i stvorila."
   },
   {
    "t": "p",
    "text": "Podvodno čišćenje riječnog dna na području Lučkog mosta proveli su ronioci Ekološko-ronilačkog kluba „Malo more“."
   },
   {
    "t": "p",
    "text": "U čišćenju obale, prikupljanju i razvrstavanju otpada sudjelovali su i predstavnici Udruge mladih Kolektiv, Šrek Delte 5, BK Relaks, Udruge Dobra, PD Gledovac i Udruge Impact, uz brojne volontere i građane."
   },
   {
    "t": "h",
    "text": "Otpad koji neće završiti u moru"
   },
   {
    "t": "p",
    "text": "Uklanjanjem otpada smanjena je količina koja bi nizvodno mogla dospjeti prema ušću Neretve i Jadranskom moru."
   },
   {
    "t": "p",
    "text": "Prikupljeni otpad bit će razvrstan i evidentiran prema vrstama materijala, a podaci će se koristiti u bazi ČistiMO! Instituta za oceanografiju i ribarstvo iz Splita. Time akcija dobiva i komponentu građanske znanosti - sudionici ne samo da fizički uklanjaju otpad, nego doprinose i prikupljanju podataka važnih za praćenje onečišćenja."
   },
   {
    "t": "p",
    "text": "Kroz pilot-mjeru „Plastic-free event“ Udruga lađara Neretve nastavlja raditi na smanjenju uporabe jednokratne plastike i promicanju održivijih događanja."
   },
   {
    "t": "p",
    "text": "Lađa na Neretvi, ne plastika – čuvajmo Neretvu zajedno!"
   },
   {
    "t": "p",
    "text": "Projekt je sufinanciran kroz program Interreg IPA ADRION 2021.–2027."
   }
  ]
 },
 {
  "slug": "ul-crni-put-i-ul-gusar-komin-podijelili-tron-29-maratona-lada",
  "title": "UL Crni put i UL Gusar Komin podijelili tron 29. Maratona lađa",
  "date": "2026-08-12",
  "cover": "https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg",
  "excerpt": "Neretva je i ove godine bila poprište velikog spektakla — 29. Maraton lađa, odveslan na 22,5 km duge dionice od Metkovića do Ploča, završio je dramatičnom završnicom i…",
  "body": [
   {
    "t": "p",
    "text": "Neretva je i ove godine bila poprište velikog spektakla — 29. Maraton lađa, odveslan na 22,5 km duge dionice od Metkovića do Ploča, završio je dramatičnom završnicom i neizvjesnom borbom za sam vrh. Nakon više od sat vremena napornog veslanja, dvije posade stigle su na cilj izjednačene, pa su prvo mjesto i pobjednički tron podijelile UL Crni put i UL Gusar Komin."
   },
   {
    "t": "p",
    "text": "Drugo mjesto osvojila je posada UL Baćina, dok je treće pripalo lađarima UL Sveti Ilija Metković. U ovogodišnjem izdanju najmasovnijeg sportskog događaja u Hrvatskoj nastupilo je ukupno 30 posada, a atmosfera na rivi u Pločama, gdje je utrka i završila, još je jednom pokazala zašto je Maraton lađa srce i duša doline Neretve."
   },
   {
    "t": "h",
    "text": "Službeni poredak 29. Maratona lađa"
   },
   {
    "t": "ol",
    "items": [
     "UL Crni put / UL Gusar Komin",
     "UL Baćina",
     "UL Sveti Ilija Metković",
     "UL Zagreb",
     "UL Stablina",
     "UL Crni put – Moreno",
     "UL Zagreb 2",
     "UOTV Rogotin",
     "UL Općine Slivno",
     "UL Sisak",
     "SU Argo Bjelovar",
     "UL Jerkovac",
     "Lađari MUP RH",
     "HŠD Ogranak Bjelovar Šumari",
     "KUU Škrapa Momići",
     "UL Sv. Roko Podrujnica",
     "UL Domagojevi gusari Vid",
     "UL Marsonia Slavonski Brod",
     "SU Argo – Senatori",
     "SVU Đakovo",
     "UL Sveti Ilija Metković 2",
     "KNOBVSLJ Škrapa Momići",
     "Veterani 4. gardijske brigade",
     "Udruga Krapinski lađari",
     "UL Jerkovac 2",
     "UL Vidonje Mlinište",
     "Salašari Somborski HKUD Vladimir Nazor",
     "UL Crni put 2",
     "HPB Sport",
     "UL Torcida Ploče"
    ]
   },
   {
    "t": "p",
    "text": "Čestitamo svim posadama na uloženom trudu, borbenosti i sportskom duhu, a pobjednicima na sjajnom rezultatu. Neretvanska lađa i ove je godine pokazala svu svoju snagu, a tradicija duga gotovo tri desetljeća nastavlja se prenositi s koljena na koljeno."
   },
   {
    "t": "p",
    "text": "Vidimo se sljedeće godine na jubilarnom, 30. Maratonu lađa – pripremite se za spektakl!"
   }
  ]
 },
 {
  "slug": "ladarice-siska-slavile-na-13-maratonu-ladarica",
  "title": "Lađarice Siska slavile na 13. Maratonu lađarica",
  "date": "2026-08-12",
  "cover": "https://maraton-ladja.hr/images/13-Maraton-ladarica-pobjednice-UL-Sisak.jpg",
  "excerpt": "Neretvom je zaplovila ženska snaga i borbenost — održan je 13. Maraton lađarica na dionici Metković – Opuzen, koji je i ove godine okupio ekipe iz cijele Hrvatske i regije.…",
  "body": [
   {
    "t": "p",
    "text": "Neretvom je zaplovila ženska snaga i borbenost — održan je 13. Maraton lađarica na dionici Metković – Opuzen, koji je i ove godine okupio ekipe iz cijele Hrvatske i regije. Najbržima su se pokazale lađarice Udruge lađarica Sisak, koje su još jednom potvrdile status jedne od najjačih ženskih posada, ostvarivši pobjedničko vrijeme od 58.09."
   },
   {
    "t": "p",
    "text": "Drugo mjesto izborile su lađarice ekipe MUP RH – Lađarice u plavom (59.56), dok su treće mjesto osvojile veslačice Udruge lađara Zagreb (1:00.00), u tijesnoj borbi za sam vrh poretka."
   },
   {
    "t": "h",
    "text": "Konačni poredak 13. Maratona lađarica"
   },
   {
    "t": "ol",
    "items": [
     "Udruga lađarica Sisak — 58.09",
     "MUP RH – Lađarice u plavom — 59.56",
     "Udruga lađara Zagreb — 1:00.00",
     "Udruga lađara Marsonia Slavonski Brod — 1:00.45",
     "Udruga Gusarice Metković — 1:01.38",
     "Udruga lađara Stablina — 1:02.01",
     "Udruga lađara Baćina — 1:02.17",
     "Sportsko veslačka udruga Đakovo — 1:02.23",
     "Udruga lađara Gusari Komin — 1:02.46",
     "Udruga lađarica Metkovke Metković — 1:04.48",
     "HPB Sport — 1:05.30",
     "Udruga lađara Jerkovac Metković — 1:06.35",
     "Udruga za očuvanje neretvanske baštine Opuzen — 1:06.56",
     "Lađarice Pivac — 1:08.02",
     "HKUD Vladimir Nazor Salašari Somborski — 1:08.11",
     "Udruga Vinkovačke veslačice Vinkovci — 1:08.18"
    ]
   },
   {
    "t": "p",
    "text": "Ovogodišnji Maraton lađarica okupio je čak 17 prijavljenih ekipa, među kojima i nekoliko debitantskih posada, što potvrđuje sve veći interes za žensko lađarstvo na Neretvi. Apsolutni rekord staze i dalje drže zlatne Donjanke Donje iz 2020. godine, s vremenom od 50 minuta i 33 sekunde."
   }
  ]
 },
 {
  "slug": "ul-crni-put-najbrzi-na-brzinskim-utrkama-u-opuzenu",
  "title": "UL Crni put najbrži na brzinskim utrkama u Opuzenu",
  "date": "2026-08-12",
  "cover": "https://maraton-ladja.hr/images/IMG-20260806-WA0011.jpg",
  "excerpt": "Brzinskim utrkama u Opuzenu - Kupom Slobodne Dalmacije i službeno je otvoreno ovogodišnje, 29. izdanje Maratona lađa. Na kratkim, eksplozivnim dionicama, gdje o pobjedniku…",
  "body": [
   {
    "t": "p",
    "text": "Brzinskim utrkama u Opuzenu - Kupom Slobodne Dalmacije i službeno je otvoreno ovogodišnje, 29. izdanje Maratona lađa. Na kratkim, eksplozivnim dionicama, gdje o pobjedniku odlučuju stotinke sekunde, snaga i savršena usklađenost posade, najbržima su se pokazali lađari UL Crni put Metković."
   },
   {
    "t": "p",
    "text": "Metkovska posada dominirala je od početka do kraja, ostvarivši najbolje vrijeme utrke od 1:23.926. Drugo mjesto izborila je ekipa UL Zagreb s vremenom 1:25.909, dok su treće mjesto osvojili lađari UL Baćina (1:26.304)."
   },
   {
    "t": "p",
    "text": "Rezultatima brzinske utrke ekipe su, prema ostvarenom plasmanu, odabrale svoje startne pozicije za glavnu utrku - Maraton lađa od Metkovića do Ploča."
   },
   {
    "t": "p",
    "text": "Čestitamo svim posadama na sudjelovanju i borbenosti te im želimo puno sreće na Maratonu lađa."
   },
   {
    "t": "h",
    "text": "Konačni poredak – brzinske utrke, Kup Slobodne Dalmacije"
   },
   {
    "t": "ol",
    "items": [
     "UL Crni put Metković — 1:23.926",
     "UL Zagreb — 1:25.909",
     "UL Baćina — 1:26.304",
     "UL Crni put Moreno Metković — 1:26.313",
     "UL Gusari Komin — 1:26.373",
     "UL Stablina — 1:26.503",
     "UL Sv. Ilija Metković — 1:27.774",
     "Lađari MUP RH — 1:27.917",
     "UL Općine Slivno — 1:28.046",
     "UL Zagreb 2 — 1:28.421",
     "UL Jerkovac — 1:29.249",
     "UOTV Rogotin — 1:29.539",
     "UL Sv. Roko Podrujnica — 1:29.789",
     "SU Argo Bjelovar — 1:29.811",
     "UL Sisak — 1:30.224",
     "Hrvatsko šumarsko društvo – ogranak Bjelovar Šumari — 1:30.537",
     "Sportsko veslačka udruga Đakovo — 1:30.986",
     "KUU Škrapa Momići — 1:31.137",
     "UL Domagojevi gusari Vid — 1:31.660",
     "UL Sv. Ilija 2 Metković — 1:31.956",
     "UL Marsonia Slavonski Brod — 1:32.751",
     "SU Argo – Senatori Bjelovar — 1:33.596",
     "UL Crni put 2 — 1:33.944",
     "Udruga Krapinski lađari — 1:34.584",
     "UL Vidonje Mlinište — 1:35.491",
     "UL Jerkovac 2 — 1:35.840",
     "Klub navijača, obožavatelja, bivših veslača, simpatizera i ljubitelja Škrapa Momići — 1:36.290",
     "Veterani 4. gardijske brigade — 1:36.382",
     "HPB Sport — 1:38.435"
    ]
   },
   {
    "t": "p",
    "text": "Nije startala: UL Torcida Ploče."
   }
  ]
 },
 {
  "slug": "brzinske-utrke-u-opuzenu",
  "title": "Brzinske utrke u Opuzenu",
  "date": "2026-08-04",
  "cover": "https://maraton-ladja.hr/images/brzinske_utrke_2025_-_0673_copy_Large.jpeg",
  "excerpt": "U srijedu, 5. kolovoza 2026. godine, u Opuzenu se održavaju tradicionalne brzinske utrke – Kup Slobodna Dalmacija, s početkom u 18:00 sati.",
  "body": [
   {
    "t": "p",
    "text": "U srijedu, 5. kolovoza 2026. godine, u Opuzenu se održavaju tradicionalne brzinske utrke – Kup Slobodna Dalmacija, s početkom u 18:00 sati."
   },
   {
    "t": "p",
    "text": "Natjecateljski dio programa predviđen je do 21 sat, nakon čega će ekipe, prema ostvarenom plasmanu, odabrati svoje startne pozicije za Maraton lađa."
   },
   {
    "t": "p",
    "text": "Nakon utrka slijedi dodjela nagrada za najbolje ekipe, priznanja pojedincima te dodjela prstena. Program će uveličati i spektakularni Dron light show."
   },
   {
    "t": "p",
    "text": "Cjelokupni program započinje svetom misom u 17:00 sati za sve lađare i lađarice u Crkvi sv. Stjepana Prvomučenika u Opuzenu."
   },
   {
    "t": "p",
    "text": "Pozivamo sve ljubitelje lađarstva da dođu u Opuzen i podrže svoje ekipe u prvom nadmetanju ovogodišnjeg Maratona lađa."
   },
   {
    "t": "h",
    "text": "Satnica nastupa"
   },
   {
    "t": "ul",
    "items": [
     "18:00 — Klub navijača, obožavatelja, bivših veslača, simpatizera i ljubitelja Škrapa Momići – debitanti",
     "18:05 — Udruga Krapinski lađari – debitanti",
     "18:10 — Udruga lađara Crni put – Moreno – debitanti",
     "18:15 — Udruga lađara Sv. Ilija 2 – Povratnici",
     "18:20 — Udruga lađara Torcida Ploče",
     "18:25 — Salašari Somborski HKUD Vladimir Nazor",
     "18:30 — HPB Sport",
     "18:35 — Udruga lađara Jerkovac 2",
     "18:40 — Udruga lađara Vidonje Mlinište",
     "18:45 — Veterani 4. gardijske brigade",
     "18:50 — Udruga lađara Domagojevi gusari Vid",
     "18:55 — Udruga lađara Crni put 2",
     "19:00 — Udruga lađara Marsonia Slavonski Brod",
     "19:05 — Sportska udruga Argo – Senatori",
     "19:10 — Udruga lađara Sv. Roko Podrujnica",
     "19:15 — Sportsko veslačka udruga Đakovo",
     "19:20 — Udruga lađara Sisak",
     "19:25 — HŠDO Ogranak Bjelovar Šumari",
     "19:30 — Lađari MUP RH",
     "19:35 — KUU Škrapa Momići",
     "19:40 — Udruga lađara Općine Slivno",
     "19:45 — Udruga lađara Jerkovac",
     "19:50 — Sportska udruga Argo Bjelovar",
     "19:55 — Udruga lađara Sv. Ilija Metković",
     "20:00 — Udruga lađara Crni put Metković",
     "20:05 — Udruga lađara Baćina",
     "20:10 — Udruga lađara Zagreb 2",
     "20:15 — UOTV Rogotin",
     "20:20 — Udruga lađara Stablina",
     "20:25 — Gusari Komin",
     "20:30 — Udruga lađara Zagreb"
    ]
   },
   {
    "t": "p",
    "text": "Vremena su okvirna i podložna manjim izmjenama."
   }
  ]
 },
 {
  "slug": "objavljen-pravilnik-29-maratona-lada",
  "title": "Objavljen Pravilnik 29. Maratona lađa",
  "date": "2026-07-31",
  "cover": "https://maraton-ladja.hr/images/maraton_ladja_clanak_2026.jpg",
  "excerpt": "Obavještavamo sve ekipe da je objavljen službeni Pravilnik 29. Maratona lađa.",
  "body": [
   {
    "t": "p",
    "text": "Obavještavamo sve ekipe da je objavljen službeni Pravilnik 29. Maratona lađa."
   },
   {
    "t": "p",
    "text": "Molimo sve lađare da se prije početka natjecanja upoznaju s njegovim sadržajem kako bi bili upoznati sa svim pravilima i eventualnim izmjenama u odnosu na prethodne godine."
   },
   {
    "t": "p",
    "text": "Pravilnik je dostupan za preuzimanje u nastavku, kao i na stranici Pravilnik i prijave."
   },
   {
    "t": "file",
    "text": "Preuzmi pravilnik 29. Maratona lađa (PDF)",
    "href": "PDF)](/dokumenti/pravilnik-29-maratona-ladja-2026.pdf"
   }
  ]
 }
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
