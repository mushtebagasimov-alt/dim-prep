import aiosqlite
import json
from app.database import DATABASE_PATH


async def seed_database():
    db = await aiosqlite.connect(DATABASE_PATH)
    
    # Check if already seeded
    cursor = await db.execute("SELECT COUNT(*) as cnt FROM subjects")
    count = (await cursor.fetchone())[0]
    if count > 0:
        await db.close()
        return

    # Seed subjects
    subjects = [
        ("math", "Riyaziyyat", "📐", "#4F46E5"),
        ("physics", "Fizika", "⚡", "#7C3AED"),
        ("chemistry", "Kimya", "🧪", "#EC4899"),
        ("biology", "Biologiya", "🧬", "#10B981"),
        ("history", "Tarix", "📜", "#F59E0B"),
        ("geography", "Coğrafiya", "🌍", "#06B6D4"),
        ("literature", "Ədəbiyyat", "📚", "#8B5CF6"),
        ("azerbaijani", "Azərbaycan dili", "🇦🇿", "#EF4444"),
        ("english", "Xarici dil", "🌐", "#3B82F6"),
    ]
    await db.executemany(
        "INSERT INTO subjects (id, name, icon, color) VALUES (?, ?, ?, ?)",
        subjects,
    )

    # Seed topics
    topics = [
        # Math topics
        ("math-algebra", "math", "Cəbr əsasları"),
        ("math-geometry", "math", "Həndəsə"),
        ("math-trig", "math", "Triqonometriya"),
        ("math-functions", "math", "Funksiyalar"),
        ("math-equations", "math", "Tənliklər sistemi"),
        ("math-probability", "math", "Ehtimal nəzəriyyəsi"),
        # Physics topics
        ("physics-mechanics", "physics", "Mexanika"),
        ("physics-thermo", "physics", "Termodinamika"),
        ("physics-electric", "physics", "Elektrik"),
        ("physics-optics", "physics", "Optika"),
        ("physics-waves", "physics", "Dalğalar"),
        # Chemistry topics
        ("chem-general", "chemistry", "Ümumi kimya"),
        ("chem-organic", "chemistry", "Üzvi kimya"),
        ("chem-inorganic", "chemistry", "Qeyri-üzvi kimya"),
        ("chem-solutions", "chemistry", "Məhlullar"),
        # Biology topics
        ("bio-cell", "biology", "Hüceyrə biologiyası"),
        ("bio-genetics", "biology", "Genetika"),
        ("bio-ecology", "biology", "Ekologiya"),
        ("bio-human", "biology", "İnsan anatomiyası"),
        # History topics
        ("hist-ancient", "history", "Qədim tarix"),
        ("hist-medieval", "history", "Orta əsrlər"),
        ("hist-modern", "history", "Yeni dövr"),
        ("hist-azerbaijan", "history", "Azərbaycan tarixi"),
        # Geography topics
        ("geo-physical", "geography", "Fiziki coğrafiya"),
        ("geo-economic", "geography", "İqtisadi coğrafiya"),
        ("geo-azerbaijan", "geography", "Azərbaycan coğrafiyası"),
        # Literature topics
        ("lit-classical", "literature", "Klassik ədəbiyyat"),
        ("lit-modern", "literature", "Müasir ədəbiyyat"),
        ("lit-poetry", "literature", "Poeziya"),
        # Azerbaijani language topics
        ("az-grammar", "azerbaijani", "Qrammatika"),
        ("az-syntax", "azerbaijani", "Sintaksis"),
        ("az-morphology", "azerbaijani", "Morfologiya"),
        # English topics
        ("eng-grammar", "english", "Grammar"),
        ("eng-vocabulary", "english", "Vocabulary"),
        ("eng-reading", "english", "Reading"),
    ]
    await db.executemany(
        "INSERT INTO topics (id, subject_id, name) VALUES (?, ?, ?)",
        topics,
    )

    # Seed questions - comprehensive set
    questions = [
        # MATH - Algebra
        ("m1", "math", "math-algebra", "closed", "2x + 5 = 15 tənliyini həll edin.",
         json.dumps(["x = 3", "x = 5", "x = 7", "x = 10", "x = 4"]), 1,
         "2x + 5 = 15 → 2x = 10 → x = 5", 1, 8),
        ("m2", "math", "math-algebra", "closed", "3x² - 12 = 0 tənliyinin kökləri hansılardır?",
         json.dumps(["x = ±2", "x = ±4", "x = ±3", "x = 2", "x = -2"]), 0,
         "3x² = 12 → x² = 4 → x = ±2", 2, 8),
        ("m3", "math", "math-algebra", "closed", "(a + b)² düsturu hansıdır?",
         json.dumps(["a² + 2ab + b²", "a² + b²", "a² - 2ab + b²", "2a² + 2b²", "a² + ab + b²"]), 0,
         "(a + b)² = a² + 2ab + b²", 1, 8),
        ("m4", "math", "math-algebra", "closed", "log₂(8) neçədir?",
         json.dumps(["2", "3", "4", "8", "1"]), 1,
         "log₂(8) = log₂(2³) = 3", 2, 8),
        ("m5", "math", "math-algebra", "closed", "√(144) + √(25) = ?",
         json.dumps(["15", "17", "13", "19", "16"]), 1,
         "√144 = 12, √25 = 5, 12 + 5 = 17", 1, 8),
        ("m6", "math", "math-algebra", "closed", "5! (5 faktorial) neçədir?",
         json.dumps(["60", "120", "24", "720", "100"]), 1,
         "5! = 5 × 4 × 3 × 2 × 1 = 120", 2, 8),

        # MATH - Geometry
        ("m7", "math", "math-geometry", "closed", "Dairənin sahəsi hansı düsturla hesablanır?",
         json.dumps(["S = πr²", "S = 2πr", "S = πd", "S = r²", "S = 2πr²"]), 0,
         "Dairənin sahəsi S = πr² düsturu ilə hesablanır", 1, 8),
        ("m8", "math", "math-geometry", "closed", "Üçbucağın daxili bucaqlarının cəmi neçə dərəcədir?",
         json.dumps(["90°", "180°", "270°", "360°", "120°"]), 1,
         "Üçbucağın daxili bucaqlarının cəmi 180° dərəcədir", 1, 8),
        ("m9", "math", "math-geometry", "closed", "Pifaqor teoremi hansıdır?",
         json.dumps(["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c²", "2a + 2b = c"]), 0,
         "Pifaqor teoreminə görə düzbucaqlı üçbucaqda a² + b² = c²", 1, 8),

        # MATH - Trigonometry
        ("m10", "math", "math-trig", "closed", "sin(30°) neçədir?",
         json.dumps(["1/2", "√3/2", "√2/2", "1", "0"]), 0,
         "sin(30°) = 1/2", 2, 8),
        ("m11", "math", "math-trig", "closed", "cos(60°) neçədir?",
         json.dumps(["1/2", "√3/2", "√2/2", "0", "1"]), 0,
         "cos(60°) = 1/2", 2, 8),
        ("m12", "math", "math-trig", "closed", "tan(45°) neçədir?",
         json.dumps(["0", "1", "√2", "∞", "1/2"]), 1,
         "tan(45°) = sin(45°)/cos(45°) = 1", 2, 8),

        # MATH - Functions
        ("m13", "math", "math-functions", "closed", "f(x) = 2x + 3 funksiyasında f(4) neçədir?",
         json.dumps(["8", "11", "7", "10", "9"]), 1,
         "f(4) = 2(4) + 3 = 8 + 3 = 11", 1, 8),
        ("m14", "math", "math-functions", "closed", "y = x² parabolasının təpə nöqtəsi hansıdır?",
         json.dumps(["(0, 0)", "(1, 1)", "(0, 1)", "(1, 0)", "(-1, 1)"]), 0,
         "y = x² parabolasının təpə nöqtəsi koordinat başlanğıcında (0, 0) nöqtəsindədir", 1, 8),

        # PHYSICS - Mechanics
        ("p1", "physics", "physics-mechanics", "closed", "Nyutonun II qanunu hansıdır?",
         json.dumps(["F = ma", "F = mv", "F = m/a", "F = mg", "F = mv²"]), 0,
         "Nyutonun II qanunu: F = ma (qüvvə = kütlə × təcil)", 1, 8),
        ("p2", "physics", "physics-mechanics", "closed", "Sərbəst düşmə təcili (g) təxminən neçədir?",
         json.dumps(["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "9.0 m/s²", "11.0 m/s²"]), 1,
         "Sərbəst düşmə təcili g ≈ 9.8 m/s²", 1, 8),
        ("p3", "physics", "physics-mechanics", "closed", "Cismin kinetik enerjisi hansı düsturla hesablanır?",
         json.dumps(["Ek = mv²/2", "Ek = mgh", "Ek = mv", "Ek = Fs", "Ek = m²v"]), 0,
         "Kinetik enerji Ek = mv²/2", 2, 8),
        ("p4", "physics", "physics-mechanics", "closed", "5 kq kütləli cismə 20 N qüvvə təsir edirsə, təcili neçədir?",
         json.dumps(["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²", "100 m/s²"]), 1,
         "F = ma → a = F/m = 20/5 = 4 m/s²", 2, 8),

        # PHYSICS - Thermodynamics
        ("p5", "physics", "physics-thermo", "closed", "Suyun qaynama temperaturu standart şəraitdə neçə °C-dir?",
         json.dumps(["90°C", "100°C", "110°C", "80°C", "120°C"]), 1,
         "Suyun qaynama temperaturu standart atmosfer təzyiqində 100°C-dir", 1, 8),
        ("p6", "physics", "physics-thermo", "closed", "Mütləq sıfır neçə °C-dir?",
         json.dumps(["-273.15°C", "-100°C", "0°C", "-460°C", "-373°C"]), 0,
         "Mütləq sıfır = -273.15°C = 0 K", 2, 8),

        # PHYSICS - Electric
        ("p7", "physics", "physics-electric", "closed", "Ohm qanunu hansıdır?",
         json.dumps(["U = IR", "U = I/R", "U = I²R", "U = R/I", "U = I+R"]), 0,
         "Ohm qanunu: U = IR (gərginlik = cərəyan × müqavimət)", 1, 8),
        ("p8", "physics", "physics-electric", "closed", "Elektrik gücü hansı düsturla hesablanır?",
         json.dumps(["P = UI", "P = U/I", "P = RI", "P = U²/R²", "P = mgh"]), 0,
         "Elektrik gücü P = UI (güc = gərginlik × cərəyan)", 2, 8),

        # CHEMISTRY - General
        ("c1", "chemistry", "chem-general", "closed", "Suyun kimyəvi formulu hansıdır?",
         json.dumps(["H₂O", "CO₂", "NaCl", "H₂O₂", "HCl"]), 0,
         "Suyun kimyəvi formulu H₂O-dur (2 hidrogen + 1 oksigen)", 1, 8),
        ("c2", "chemistry", "chem-general", "closed", "Dövri cədvəldə neçə element var (təxminən)?",
         json.dumps(["100", "118", "92", "150", "108"]), 1,
         "Hazırda dövri cədvəldə 118 kimyəvi element var", 1, 8),
        ("c3", "chemistry", "chem-general", "closed", "pH = 7 olan məhlul nədir?",
         json.dumps(["Turşu", "Neytral", "Qələvi", "Duz", "Oksid"]), 1,
         "pH = 7 neytral mühiti göstərir (su kimi)", 1, 8),
        ("c4", "chemistry", "chem-general", "closed", "Ən yüngül kimyəvi element hansıdır?",
         json.dumps(["Helium", "Hidrogen", "Litium", "Karbon", "Oksigen"]), 1,
         "Hidrogen (H) ən yüngül kimyəvi elementdir, atom kütləsi ≈ 1", 1, 8),

        # CHEMISTRY - Organic
        ("c5", "chemistry", "chem-organic", "closed", "Metanın (CH₄) kimyəvi formulu nəyi göstərir?",
         json.dumps(["1 karbon + 4 hidrogen", "1 karbon + 2 hidrogen", "4 karbon + 1 hidrogen", "2 karbon + 4 hidrogen", "1 karbon + 3 hidrogen"]), 0,
         "CH₄ - 1 karbon atomu və 4 hidrogen atomu", 1, 8),
        ("c6", "chemistry", "chem-organic", "closed", "Etanol (C₂H₅OH) hansı sinfə aiddir?",
         json.dumps(["Karbohidratlar", "Spirtlər", "Turşular", "Aldehidlər", "Efir"]), 1,
         "Etanol (C₂H₅OH) spirtlər sinfinə aiddir", 2, 8),

        # CHEMISTRY - Inorganic
        ("c7", "chemistry", "chem-inorganic", "closed", "NaCl (natrium xlorid) hansı tip birləşmədir?",
         json.dumps(["Turşu", "Əsas", "Duz", "Oksid", "Həlledici"]), 2,
         "NaCl ion birləşməsidir və duz tiplidir", 1, 8),

        # BIOLOGY - Cell
        ("b1", "biology", "bio-cell", "closed", "Hüceyrənin enerji mərkəzi hansıdır?",
         json.dumps(["Nüvə", "Mitoxondri", "Ribosom", "Xloroplast", "Lizozom"]), 1,
         "Mitoxondri hüceyrənin enerji stansiyasıdır (ATF istehsal edir)", 1, 8),
        ("b2", "biology", "bio-cell", "closed", "DNT-nin tam adı nədir?",
         json.dumps(["Dezoksiribonuklein turşusu", "Diribonuklein turşusu", "Dezoksiamin turşusu", "Ribonuklein turşusu", "Difosfat turşusu"]), 0,
         "DNT = Dezoksiribonuklein turşusu", 1, 8),
        ("b3", "biology", "bio-cell", "closed", "Fotosintez prosesi hansı orqanoidda baş verir?",
         json.dumps(["Mitoxondri", "Xloroplast", "Ribosom", "Nüvə", "Endoplazmatik şəbəkə"]), 1,
         "Fotosintez xloroplastlarda baş verir", 1, 8),

        # BIOLOGY - Genetics
        ("b4", "biology", "bio-genetics", "closed", "İnsan bədənində neçə cüt xromosom var?",
         json.dumps(["22", "23", "24", "46", "48"]), 1,
         "İnsanda 23 cüt (46 ədəd) xromosom var", 1, 8),
        ("b5", "biology", "bio-genetics", "closed", "Mendelin I qanunu nədir?",
         json.dumps(["Dominantlıq qanunu", "Parçalanma qanunu", "Müstəqil paylanma", "Əlaqəli irsiyyət", "Mutasiya qanunu"]), 0,
         "Mendelin I qanunu - dominantlıq (üstünlük) qanunudur", 2, 8),

        # BIOLOGY - Ecology
        ("b6", "biology", "bio-ecology", "closed", "Ekosistemdə enerji axını hansı istiqamətdədir?",
         json.dumps(["İstehlakçılardan istehsalçılara", "İstehsalçılardan istehlakçılara", "Hər istiqamətdə", "Yalnız heyvanlar arasında", "Yalnız bitkilər arasında"]), 1,
         "Enerji axını: İstehsalçılar → I dərəcəli istehlakçılar → II dərəcəli istehlakçılar", 2, 8),

        # HISTORY - Azerbaijan
        ("h1", "history", "hist-azerbaijan", "closed", "Azərbaycan Xalq Cümhuriyyəti neçənci ildə yaradılıb?",
         json.dumps(["1918", "1920", "1991", "1945", "1917"]), 0,
         "AXC 28 may 1918-ci ildə yaradılıb - Şərqdə ilk demokratik respublika", 1, 8),
        ("h2", "history", "hist-azerbaijan", "closed", "Azərbaycanın müstəqilliyi neçənci ildə bərpa olunub?",
         json.dumps(["1988", "1990", "1991", "1993", "1989"]), 2,
         "Azərbaycan 18 oktyabr 1991-ci ildə müstəqilliyini bərpa etdi", 1, 8),
        ("h3", "history", "hist-azerbaijan", "closed", "Bakı neft sənayesinin inkişafı hansı əsrdə başlayıb?",
         json.dumps(["XVIII əsr", "XIX əsr", "XX əsr", "XVII əsr", "XVI əsr"]), 1,
         "Bakıda sənaye miqyasında neft hasilatı XIX əsrin ikinci yarısında başlayıb", 2, 8),

        # HISTORY - Ancient
        ("h4", "history", "hist-ancient", "closed", "Misir piramidaları hansı minillikdə tikilmişdir?",
         json.dumps(["e.ə. 5-ci minillik", "e.ə. 3-cü minillik", "e.ə. 1-ci minillik", "e.ə. 2-ci minillik", "e.ə. 4-cü minillik"]), 1,
         "Misir piramidaları əsasən e.ə. 3-cü minillikdə tikilmişdir", 2, 8),
        ("h5", "history", "hist-ancient", "closed", "Roma İmperiyasının süqutu neçənci ildədir?",
         json.dumps(["395", "476", "527", "410", "455"]), 1,
         "Qərbi Roma İmperiyası 476-cı ildə süqut etmişdir", 2, 8),

        # GEOGRAPHY - Physical
        ("g1", "geography", "geo-physical", "closed", "Dünyanın ən böyük okeanı hansıdır?",
         json.dumps(["Atlantik", "Sakit", "Hind", "Şimal Buzlu", "Cənub"]), 1,
         "Sakit okean dünyanın ən böyük okeanıdır (165.25 mln km²)", 1, 8),
        ("g2", "geography", "geo-physical", "closed", "Everest dağının hündürlüyü təxminən neçə metrdir?",
         json.dumps(["7848 m", "8848 m", "9848 m", "6848 m", "8048 m"]), 1,
         "Everest (Comolunqma) dünyanın ən hündür nöqtəsidir - 8848.86 m", 1, 8),

        # GEOGRAPHY - Azerbaijan
        ("g3", "geography", "geo-azerbaijan", "closed", "Azərbaycanın ən böyük gölü hansıdır?",
         json.dumps(["Göygöl", "Sarısu", "Hacıqabul", "Mingəçevir su anbarı", "Tufandağ"]), 2,
         "Hacıqabul gölü Azərbaycanın ən böyük təbii gölüdür", 2, 8),
        ("g4", "geography", "geo-azerbaijan", "closed", "Azərbaycanın sahəsi təxminən neçə km²-dir?",
         json.dumps(["56.600", "86.600", "106.600", "66.600", "76.600"]), 1,
         "Azərbaycanın sahəsi 86.600 km²-dir", 1, 8),

        # AZERBAIJANI LANGUAGE - Grammar
        ("az1", "azerbaijani", "az-grammar", "closed", "Azərbaycan dilində neçə sait səs var?",
         json.dumps(["7", "9", "6", "8", "10"]), 1,
         "Azərbaycan dilində 9 sait səs var: a, e, ə, ı, i, o, ö, u, ü", 1, 8),
        ("az2", "azerbaijani", "az-grammar", "closed", "'Kitab' sözünün cəm forması hansıdır?",
         json.dumps(["Kitablar", "Kitablər", "Kitabeler", "Kitablarım", "Kitabçalar"]), 0,
         "Kitab → Kitablar (qalin saitli sözlərə -lar şəkilçisi artırılır)", 1, 8),
        ("az3", "azerbaijani", "az-syntax", "closed", "Cümlənin baş üzvləri hansılardır?",
         json.dumps(["Mübtəda və xəbər", "Tamamlıq və təyin", "Zərflik və mübtəda", "Təyin və xəbər", "Tamamlıq və zərflik"]), 0,
         "Cümlənin baş üzvləri mübtəda və xəbərdir", 1, 8),

        # ENGLISH - Grammar
        ("en1", "english", "eng-grammar", "closed", "Choose the correct form: She ___ to school every day.",
         json.dumps(["go", "goes", "going", "gone", "went"]), 1,
         "Third person singular (she) in Present Simple takes -es/-s: She goes", 1, 8),
        ("en2", "english", "eng-grammar", "closed", "Which is the past tense of 'write'?",
         json.dumps(["writed", "wrote", "written", "writing", "writes"]), 1,
         "'Write' is an irregular verb: write → wrote → written", 1, 8),
        ("en3", "english", "eng-vocabulary", "closed", "What does 'ubiquitous' mean?",
         json.dumps(["Rare", "Present everywhere", "Unknown", "Beautiful", "Dangerous"]), 1,
         "Ubiquitous means 'present, appearing, or found everywhere'", 3, 8),
        ("en4", "english", "eng-reading", "closed", "Choose the correct sentence:",
         json.dumps(["He don't like coffee", "He doesn't likes coffee", "He doesn't like coffee", "He not like coffee", "He no like coffee"]), 2,
         "Correct negative form: He doesn't like coffee (doesn't + base form)", 1, 8),
    ]

    await db.executemany(
        """INSERT INTO questions (id, subject_id, topic_id, type, text, options, correct_answer, explanation, difficulty, points)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        questions,
    )

    await db.commit()
    await db.close()
    print(f"Database seeded with {len(subjects)} subjects, {len(topics)} topics, {len(questions)} questions")
