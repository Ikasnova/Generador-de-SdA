import { Language } from "./types";

export const TRANSLATIONS = {
  es: {
    appTitle: "Generador de Situaciones de Aprendizaje",
    footerText: "Herramienta de apoyo docente ajustada a la normativa vigente de la Comunidad Foral de Navarra. Los contenidos generados deben ser revisados por el profesorado.",
    navHome: "Inicio",
    navDownload: "Descargar PDF",
    navGenerating: "Generando PDF...",
    
    // Stage Selector
    selectStageTitle: "Selección de Etapa Educativa",
    selectStageSubtitle: "Seleccione la etapa para ajustar la Situación de Aprendizaje al Currículo Oficial de Navarra (LOMLOE)",
    officialDecree: "Decreto Foral Navarra",
    accessBtn: "Acceder",
    stageLabels: {
      "Infantil": "Educación Infantil",
      "Primaria": "Educación Primaria",
      "ESO": "E.S.O.",
      "Bachillerato": "Bachillerato",
      "Formación Profesional": "Formación Profesional"
    },

    // Input Form
    configTitle: "Configuración de la SdA",
    selectedStage: "Etapa seleccionada:",
    changeBtn: "Cambiar",
    gradeLabel: "Curso / Nivel",
    gradePlaceholder: "Ej: 3º Primaria",
    subjectLabel: "Área / Materia",
    subjectPlaceholder: "Ej: Matemáticas",
    topicLabel: "Temática / Contexto / Interés",
    topicPlaceholder: "Describe la temática central...",
    generateBtn: "Generar Documento Oficial",
    loadingBtn: "Consultando Currículo Navarra...",

    // Document Preview
    previewTitle: "Vista Previa del Documento",
    regenerateBtn: "Regenerar Versión",
    docHeaderTitle: "Comunidad Foral de Navarra",
    progUnit: "Unidad de Programación Nº",
    saNumber: "SdA Nº",
    
    // Sections
    sec1: "Datos identificativos",
    sec2: "Conexión con los elementos curriculares",
    sec3: "Metodología",
    sec4: "Secuenciación competencial de actividades",
    sec5: "Evaluación de la práctica docente",
    sec6: "Bibliografía y webgrafía",

    // Fields
    fieldTitle: "Título de la Situación de Aprendizaje",
    fieldArea: "Etapa, área, materia o ámbito",
    fieldTiming: "Temporalización",
    fieldGoal: "Descripción y finalidad de los aprendizajes (Justificación)",
    fieldLinks: "Vinculación con otras áreas (Interdisciplinariedad)",
    fieldOds: "Conexión con ODS y retos s. XXI",
    
    fieldObj: "Objetivos de etapa",
    fieldCompKey: "Descriptores operativos de las competencias clave",
    fieldCompSpec: "Competencias específicas",
    fieldCritEval: "Criterios de evaluación",
    fieldBasicKnow: "Saberes básicos",

    fieldMethod: "Método",
    fieldModels: "Modelos pedagógicos",
    fieldTech: "Técnicas",
    fieldDua: "Estrategias didácticas (DUA)",

    // Activity
    actLabel: "Actividad",
    actDesc: "Descripción",
    actGrouping: "Agrupamiento",
    actRes: "Recursos",
    actProd: "Productos",
    actTools: "Instrumentos Eval.",

    fieldDesignEval: "Evaluación del diseño",
    fieldImplEval: "Evaluación de la implementación",
    fieldImprove: "Propuesta de mejora",
    
    watermark: "Ajustado al Currículo Oficial de Navarra (LOMLOE)"
  },
  eu: {
    appTitle: "Ikaskuntza Egoeren Sortzailea",
    footerText: "Nafarroako Foru Komunitateko indarreko araudira egokitutako irakasleentzako laguntza-tresna. Sortutako edukiak irakasleek berrikusi behar dituzte.",
    navHome: "Hasiera",
    navDownload: "PDF Deskargatu",
    navGenerating: "PDF sortzen...",

    // Stage Selector
    selectStageTitle: "Hezkuntza Etaparen Hautaketa",
    selectStageSubtitle: "Hautatu etapa Ikaskuntza Egoera Nafarroako Curriculum Ofizialera (LOMLOE) egokitzeko",
    officialDecree: "Nafarroako Foru Dekretua",
    accessBtn: "Sartu",
    stageLabels: {
      "Infantil": "Haur Hezkuntza",
      "Primaria": "Lehen Hezkuntza",
      "ESO": "D.B.H.",
      "Bachillerato": "Batxilergoa",
      "Formación Profesional": "Lanbide Heziketa"
    },

    // Input Form
    configTitle: "I.E.ren Konfigurazioa",
    selectedStage: "Hautatutako etapa:",
    changeBtn: "Aldatu",
    gradeLabel: "Maila / Ikasturtea",
    gradePlaceholder: "Adib: LH 3. maila",
    subjectLabel: "Arloa / Ikasgaia",
    subjectPlaceholder: "Adib: Matematika",
    topicLabel: "Gaia / Testuingurua / Interesa",
    topicPlaceholder: "Deskribatu gai nagusia...",
    generateBtn: "Dokumentu Ofiziala Sortu",
    loadingBtn: "Nafarroako Curriculuma kontsultatzen...",

    // Document Preview
    previewTitle: "Dokumentuaren Aurrebista",
    regenerateBtn: "Bertsioa Birsortu",
    docHeaderTitle: "Nafarroako Foru Komunitatea",
    progUnit: "Programazio Unitatea Zk.",
    saNumber: "I.E. Zk.",

    // Sections
    sec1: "Identifikazio datuak",
    sec2: "Curriculum-elementuekiko lotura",
    sec3: "Metodologia",
    sec4: "Jardueren sekuentziazio konpetentziala",
    sec5: "Irakas-jardunaren ebaluazioa",
    sec6: "Bibliografia eta webgrafia",

    // Fields
    fieldTitle: "Ikaskuntza Egoeraren Izenburua",
    fieldArea: "Etapa, arloa, irakasgaia edo eremua",
    fieldTiming: "Tenporalizazioa",
    fieldGoal: "Ikaskuntzen deskribapena eta helburua (Justifikazioa)",
    fieldLinks: "Beste arlo batzuekiko lotura (Interdisziplinaritatea)",
    fieldOds: "GJHekiko eta XXI. mendeko erronkekiko lotura",
    
    fieldObj: "Etapako helburuak",
    fieldCompKey: "Funtsezko konpetentzien deskriptore operatiboak",
    fieldCompSpec: "Konpetentzia espezifikoak",
    fieldCritEval: "Ebaluazio-irizpideak",
    fieldBasicKnow: "Oinarrizko jakintzak",

    fieldMethod: "Metodoa",
    fieldModels: "Eredu pedagogikoak",
    fieldTech: "Teknikak",
    fieldDua: "Estrategia didaktikoak (IDU)",

    // Activity
    actLabel: "Jarduera",
    actDesc: "Deskribapena",
    actGrouping: "Taldekatzea",
    actRes: "Baliabideak",
    actProd: "Produktuak",
    actTools: "Ebal. Tresnak",

    fieldDesignEval: "Diseinuaren ebaluazioa",
    fieldImplEval: "Inplementazioaren ebaluazioa",
    fieldImprove: "Hobekuntza-proposamena",

    watermark: "Nafarroako Curriculum Ofizialera egokitua (LOMLOE)"
  }
};