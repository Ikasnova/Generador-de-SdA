import React, { useState } from 'react';
import StageSelector from './components/StageSelector';
import InputForm from './components/InputForm';
import DocumentPreview from './components/DocumentPreview';
import { EducationalStage, LearningSituationData, Language } from './types';
import { generateLearningSituation } from './services/geminiService';
import { Download, ArrowLeft, RefreshCw, FileText, Globe, FileDown, Pencil, Save } from 'lucide-react';
import { TRANSLATIONS } from './constants';

// Declare html2pdf globally
declare const html2pdf: any;

const App: React.FC = () => {
  const [stage, setStage] = useState<EducationalStage | null>(null);
  const [generatedData, setGeneratedData] = useState<LearningSituationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for Edit Mode
  const [language, setLanguage] = useState<Language>('es');

  // Temporary storage for input to allow regeneration
  const [lastInput, setLastInput] = useState<{grade: string, subject: string, topic: string} | null>(null);

  const t = TRANSLATIONS[language];

  const handleGenerate = async (grade: string, subject: string, topic: string) => {
    if (!stage) return;
    setLoading(true);
    setError(null);
    setIsEditing(false); // Ensure we start in view mode
    setLastInput({ grade, subject, topic });
    
    try {
      const result = await generateLearningSituation(stage, grade, subject, topic, language);
      if (result) {
        setGeneratedData(result);
      } else {
        setError("No se pudo generar el contenido. Por favor intenta de nuevo.");
      }
    } catch (err) {
      setError("Error de conexión o clave API inválida.");
    } finally {
      setLoading(false);
    }
  };

  // Handle updates from DocumentPreview when in Edit Mode
  const handleUpdateData = (newData: LearningSituationData) => {
    setGeneratedData(newData);
  };

  const handleDownloadPDF = async () => {
    // Ensure we are not in edit mode before printing to avoid ugly textareas
    if (isEditing) setIsEditing(false);

    // Small delay to allow React to re-render the view mode
    setTimeout(async () => {
        const element = document.getElementById('document-preview');
        if (!element) return;
        
        setIsDownloading(true);
        
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `Ikasnova_SdA_${generatedData?.situationNumber || '00'}_${language}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            scrollY: 0, 
            windowWidth: document.documentElement.offsetWidth 
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }
        };
    
        try {
            // @ts-ignore
            await html2pdf().set(opt).from(element).save();
        } catch (e) {
            console.error(e);
            alert("Error al generar PDF. Puede intentar usar la opción de impresión del navegador.");
        } finally {
            setIsDownloading(false);
        }
    }, 100);
  };

  const handleDownloadMarkdown = () => {
    if (!generatedData) return;

    const d = generatedData;
    const mdContent = `
# ${d.title}

**${t.progUnit}:** ${d.progUnitNumber} | **${t.saNumber}:** ${d.situationNumber}

---

## 1. ${t.sec1}
* **${t.fieldArea}:** ${d.stageArea}
* **${t.fieldTiming}:** ${d.timingRelation}
* **${t.fieldGoal}:** 
${d.descriptionGoal}

* **${t.fieldLinks}:** 
${d.linksOtherAreas}

* **${t.fieldOds}:** 
${d.odsChallenges}

## 2. ${t.sec2}

### ${t.fieldObj}
${d.stageObjectives.map(o => `- ${o}`).join('\n')}

### ${t.fieldCompKey}
${d.keyCompetenciesDescriptors.join(', ')}

### ${t.fieldCompSpec}
${d.specificCompetencies.map(c => `- ${c}`).join('\n')}

### ${t.fieldCritEval}
${d.evaluationCriteria.map(c => `- ${c}`).join('\n')}

### ${t.fieldBasicKnow}
${d.basicKnowledge.map(k => `- ${k}`).join('\n')}

## 3. ${t.sec3}
* **${t.fieldMethod}:** ${d.method}
* **${t.fieldModels}:** ${d.pedagogicalModels}
* **${t.fieldTech}:** ${d.techniques}
* **${t.fieldDua}:** ${d.didacticStrategies}

## 4. ${t.sec4}
${d.activities.map((act, i) => `
### ${t.actLabel} ${i + 1} (${act.sessions})
* **${t.actDesc}:** ${act.description}
* **${t.actRes}:** ${act.resources}
* **${t.actProd}:** ${act.evaluableProducts}
* **${t.actTools}:** ${act.evalTools}
`).join('\n')}

## 5. ${t.sec5}
* **${t.fieldDesignEval}:** ${d.designEval}
* **${t.fieldImplEval}:** ${d.implementationEval}
* **${t.fieldImprove}:** ${d.improvementProposal}

## 6. ${t.sec6}
${d.bibliography}

---
*${t.watermark}*
`;

    const blob = new Blob([mdContent.trim()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ikasnova_SdA_${d.situationNumber}_${language}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setGeneratedData(null);
    setStage(null);
    setLastInput(null);
    setError(null);
    setIsEditing(false);
  };

  const handleRetry = () => {
    if (lastInput) {
      handleGenerate(lastInput.grade, lastInput.subject, lastInput.topic);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'eu' : 'es');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light text-brand-dark font-sans">
      {/* Navbar - Hide on print */}
      <nav className="bg-brand-dark py-6 px-8 shadow-xl no-print sticky top-0 z-50 border-b-4 border-brand-main">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4 text-white">
            <div className="bg-white/10 p-2 rounded-sm border border-white/20">
                <FileText size={24} className="text-brand-teal" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-widest leading-none">IKASNOVA</span>
                <span className="text-[10px] text-brand-border font-light tracking-[0.2em] uppercase mt-1">{t.appTitle}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap justify-center">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-3 bg-brand-black/30 hover:bg-brand-black/50 text-white px-3 py-2 rounded-sm border border-white/10 transition-all cursor-pointer group"
              title="Aldatu hizkuntza / Cambiar idioma"
            >
              <Globe size={18} className="text-brand-teal group-hover:rotate-12 transition-transform" />
              <div className="flex text-xs font-bold uppercase tracking-wider">
                <span className={`transition-opacity ${language === 'es' ? 'opacity-100 text-white font-black' : 'opacity-50 text-gray-400'}`}>ES</span>
                <span className="mx-2 text-gray-600">|</span>
                <span className={`transition-opacity ${language === 'eu' ? 'opacity-100 text-white font-black' : 'opacity-50 text-gray-400'}`}>EU</span>
              </div>
            </button>

            {generatedData && (
              <>
                <div className="h-6 w-px bg-white/20 mx-2 hidden sm:block"></div>
                
                {/* Edit Mode Toggle */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-sm text-xs font-bold flex items-center transition-all uppercase tracking-widest border ${
                    isEditing 
                      ? 'bg-brand-main text-white border-brand-main shadow-inner' 
                      : 'bg-transparent text-gray-300 border-gray-500 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isEditing ? <Save size={14} className="mr-2" /> : <Pencil size={14} className="mr-2" />}
                  {isEditing ? 'Guardar' : 'Editar'}
                </button>

                {/* Markdown Download */}
                <button
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-2 rounded-sm text-gray-300 hover:text-white hover:bg-white/10 text-xs font-bold flex items-center transition-colors uppercase tracking-widest border border-transparent hover:border-white/20"
                  title="Descargar Markdown Editable"
                >
                  <FileDown size={16} />
                </button>

                {/* PDF Download */}
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={`px-6 py-2 rounded-sm bg-brand-teal text-white text-xs font-bold flex items-center shadow-md transition-all uppercase tracking-widest hover:shadow-lg ${isDownloading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                >
                  {isDownloading ? (
                      <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t.navGenerating}
                      </>
                  ) : (
                      <>
                          <Download size={14} className="mr-2" /> {t.navDownload}
                      </>
                  )}
                </button>
                
                {/* Back Home */}
                <button 
                  onClick={handleReset}
                  className="px-2 py-2 text-gray-400 hover:text-white transition-colors"
                  title={t.navHome}
                >
                  <ArrowLeft size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-4 py-10 print:p-0 print:bg-white">
        
        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 text-red-800 p-6 rounded-sm shadow-md relative no-print" role="alert">
            <div className="flex items-center">
                <span className="font-bold mr-2 uppercase tracking-wide text-sm">Error:</span>
                <span className="block sm:inline text-sm">{error}</span>
            </div>
            <button className="absolute top-0 bottom-0 right-0 px-4" onClick={() => setError(null)}>
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        )}

        {/* View Logic */}
        <div className="animate-fade-in">
            {!stage ? (
            <StageSelector onSelect={setStage} language={language} />
            ) : !generatedData ? (
            <InputForm 
                stage={stage} 
                onSubmit={handleGenerate} 
                onBack={() => setStage(null)}
                isLoading={loading}
                language={language}
            />
            ) : (
            <div>
                <div className="no-print max-w-[210mm] mx-auto mb-6 flex justify-between items-end px-2">
                <h2 className="text-brand-dark font-bold text-xl uppercase tracking-tight border-l-4 border-brand-teal pl-3">
                    {isEditing ? "Modo Edición" : t.previewTitle}
                </h2>
                {!isEditing && (
                    <button 
                        onClick={handleRetry}
                        className="text-xs text-brand-main flex items-center hover:text-brand-blue uppercase font-bold tracking-widest transition-colors"
                    >
                        <RefreshCw size={14} className="mr-2" /> {t.regenerateBtn}
                    </button>
                )}
                </div>
                <DocumentPreview 
                    data={generatedData} 
                    language={language} 
                    isEditing={isEditing}
                    onUpdate={handleUpdateData}
                />
            </div>
            )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-brand-black py-10 no-print mt-auto text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-brand-teal text-sm font-bold uppercase tracking-widest mb-2">
            Ikasnova GenAI
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            {t.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;