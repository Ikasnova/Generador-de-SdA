import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EducationalStage, LearningSituationData, Language } from "../types";

// Helper to generate the schema with descriptions in the target language
// This biases the model to output in that language.
const getLocalizedSchema = (lang: Language): Schema => {
  const isEu = lang === 'eu';

  const activitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      description: { type: Type.STRING, description: isEu ? "Jardueraren deskribapena EUSKARAZ" : "Descripción detallada de la actividad" },
      sessions: { type: Type.STRING, description: isEu ? "Saio kopurua" : "Número de sesiones" },
      grouping: { type: Type.STRING, description: isEu ? "Taldekatze mota (bakarka, binaka, talde txikia...)" : "Tipo de agrupamiento (individual, parejas, pequeño grupo...)" },
      resources: { type: Type.STRING, description: isEu ? "Beharrezko baliabideak EUSKARAZ" : "Recursos necesarios" },
      evaluableProducts: { type: Type.STRING, description: isEu ? "Produktu ebaluagarriak EUSKARAZ" : "Productos entregables" },
      evalTools: { type: Type.STRING, description: isEu ? "Ebaluazio tresnak EUSKARAZ" : "Instrumentos de evaluación" },
    },
    required: ["description", "sessions", "grouping", "resources", "evaluableProducts", "evalTools"],
  };

  return {
    type: Type.OBJECT,
    properties: {
      progUnitNumber: { type: Type.STRING, description: isEu ? "Unitate zenbakia" : "Número de unidad" },
      situationNumber: { type: Type.STRING, description: isEu ? "I.E. zenbakia" : "Número de situación" },
      title: { type: Type.STRING, description: isEu ? "Izenburua EUSKARAZ" : "Título de la SdA" },
      stageArea: { type: Type.STRING, description: isEu ? "Etapa, maila eta arloa EUSKARAZ" : "Etapa, curso y área" },
      linksOtherAreas: { type: Type.STRING, description: isEu ? "Beste arloekiko lotura EUSKARAZ" : "Vinculación con otras áreas" },
      descriptionGoal: { type: Type.STRING, description: isEu ? "Justifikazioa eta helburua EUSKARAZ" : "Descripción y finalidad" },
      odsChallenges: { type: Type.STRING, description: isEu ? "GJH eta erronkak EUSKARAZ" : "ODS y Retos s.XXI" },
      timingRelation: { type: Type.STRING, description: isEu ? "Tenporalizazioa" : "Temporalización" },
      
      stageObjectives: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: isEu ? "Nafarroako curriculumeko etapako helburuak EUSKARAZ" : "Objetivos de etapa del currículo de Navarra" 
      },
      keyCompetenciesDescriptors: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Funtsezko konpetentzien deskriptoreak (adib: CCL1)" : "Descriptores operativos (ej: CCL1)" 
      },
      specificCompetencies: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Konpetentzia espezifikoak (Nafarroako dekretua) EUSKARAZ" : "Competencias específicas (Decreto Foral)" 
      },
      evaluationCriteria: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Ebaluazio-irizpide ofizialak EUSKARAZ" : "Criterios de evaluación oficiales" 
      },
      basicKnowledge: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Oinarrizko jakintzak (edukiak) EUSKARAZ" : "Saberes básicos (contenidos)" 
      },
      
      method: { type: Type.STRING, description: isEu ? "Metodologia EUSKARAZ" : "Metodología" },
      pedagogicalModels: { type: Type.STRING, description: isEu ? "Eredu pedagogikoak EUSKARAZ" : "Modelos pedagógicos" },
      techniques: { type: Type.STRING, description: isEu ? "Teknika didaktikoak EUSKARAZ" : "Técnicas didácticas" },
      didacticStrategies: { type: Type.STRING, description: isEu ? "Arreta aniztasunari (IDU) EUSKARAZ" : "Estrategias DUA" },
      
      activities: {
        type: Type.ARRAY,
        items: activitySchema,
        description: isEu ? "3-5 jarduerako sekuentzia EUSKARAZ" : "Secuencia de 3 a 5 actividades",
      },
      
      designEval: { type: Type.STRING, description: isEu ? "Diseinuaren ebaluazioa EUSKARAZ" : "Evaluación del diseño" },
      implementationEval: { type: Type.STRING, description: isEu ? "Inplementazioaren ebaluazioa EUSKARAZ" : "Evaluación de la implementación" },
      improvementProposal: { type: Type.STRING, description: isEu ? "Hobekuntza proposamena EUSKARAZ" : "Propuesta de mejora" },
      
      bibliography: { type: Type.STRING, description: isEu ? "Bibliografia" : "Bibliografía" },
    },
    required: [
      "progUnitNumber", "situationNumber", "title", "stageArea", "linksOtherAreas",
      "descriptionGoal", "odsChallenges", "timingRelation", "stageObjectives",
      "keyCompetenciesDescriptors", "specificCompetencies", "evaluationCriteria",
      "basicKnowledge", "method", "pedagogicalModels", "techniques", "didacticStrategies",
      "activities", "designEval", "implementationEval", "improvementProposal", "bibliography"
    ],
  };
};

export const generateLearningSituation = async (
  stage: EducationalStage,
  grade: string,
  subject: string,
  topic: string,
  language: Language
): Promise<LearningSituationData | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const isEu = language === 'eu';
    
    // STRICT System Instructions based on language
    const systemInstruction = isEu 
      ? `Zure egitekoa Nafarroako (Espainia) Curriculuma (LOMLOE) betetzen duen Ikaskuntza Egoera bat sortzea da ${stage} etaparako.
         
         ARA UZTZAILEAK (STRICT RULES):
         1. HIZKUNTZA: Irteera JSONeko balio GUZTIAK EUSKARAZ idatzi behar dira. Ez idatzi ezer gaztelaniaz.
         2. ITZULPENA: Erabiltzailearen sarrera (maila, gaia...) gaztelaniaz bada, ZUK ITZULI eta EUSKARAZ garatu edukia.
         3. TERMINOLOGIA: Erabili Nafarroako terminologia ofiziala euskaraz (adib. 'Oinarrizko jakintzak', 'Ebaluazio-irizpideak').
         4. ESTILOA: Erabili hizkuntza tekniko eta pedagogiko egokia euskaraz.`
      : `Actúa como un experto docente y consultor educativo especializado en el currículo oficial de la Comunidad Foral de Navarra (España), etapa ${stage}.
         
         REGLAS ESTRICTAS:
         1. IDIOMA: Todo el contenido del JSON debe estar en CASTELLANO.
         2. TRADUCCIÓN: Si la entrada está en euskera, tradúcela y genera el contenido en CASTELLANO.
         3. TERMINOLOGÍA: Usa la terminología oficial LOMLOE de Navarra.`;

    // User prompt localized to the target language to guide the model better
    const userPrompt = isEu
      ? `
      Sortu Ikaskuntza Egoera oso bat.
      Sarrera datuak:
      - Maila: ${grade}
      - Ikasgaia: ${subject}
      - Gaia: ${topic}
      
      Ziurtatu JSON eskema eremu guztiak EUSKARAZ betetzen dituzula.
      Ez erabili gaztelania.
    `
      : `
      Genera una Situación de Aprendizaje completa.
      Datos de entrada:
      - Curso: ${grade}
      - Asignatura: ${subject}
      - Tema: ${topic}
      
      Asegúrate de rellenar todos los campos del esquema JSON en CASTELLANO.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getLocalizedSchema(language),
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as LearningSituationData;

  } catch (error) {
    console.error("Error generating learning situation:", error);
    throw error;
  }
};