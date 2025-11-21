import React from 'react';
import { LearningSituationData, Language, Activity } from '../types';
import { TRANSLATIONS } from '../constants';
import { Users } from 'lucide-react';

interface DocumentPreviewProps {
  data: LearningSituationData;
  language: Language;
  isEditing?: boolean;
  onUpdate?: (newData: LearningSituationData) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, language, isEditing = false, onUpdate }) => {
  const t = TRANSLATIONS[language];

  // --- Update Handlers ---

  const handleChange = (field: keyof LearningSituationData, value: string) => {
    if (!onUpdate) return;
    onUpdate({ ...data, [field]: value });
  };

  // Handles converting a textarea's newlines into an array of strings
  const handleListChange = (field: keyof LearningSituationData, value: string) => {
    if (!onUpdate) return;
    const list = value.split('\n'); // Keep empty lines if user wants them, or filter? filtering usually better.
    onUpdate({ ...data, [field]: list });
  };

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    if (!onUpdate) return;
    const newActivities = [...data.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    onUpdate({ ...data, activities: newActivities });
  };

  // --- Sub-components for Editable/Static View ---

  const SectionTitle = ({ number, title }: { number: string; title: string }) => (
    <div className="bg-brand-dark text-white font-bold p-2 text-sm mt-6 first:mt-0 print:bg-brand-dark print:text-white print:border-gray-400 uppercase tracking-wider flex items-center break-inside-avoid break-after-avoid">
      <div className="bg-brand-teal text-white w-6 h-6 flex items-center justify-center rounded-sm mr-3 text-xs font-black">{number}</div>
      {title}
    </div>
  );

  const FieldLabel = ({ text, className = "" }: { text: string; className?: string }) => (
    <div className={`font-bold text-brand-dark text-xs uppercase tracking-wide mb-2 border-b-2 border-brand-teal/20 pb-1 w-full ${className}`}>{text}</div>
  );

  // Render either text or a textarea
  const EditableText = ({ 
    text, 
    field, 
    className = "",
    isHeader = false
  }: { 
    text: string; 
    field?: keyof LearningSituationData; 
    className?: string;
    isHeader?: boolean;
  }) => {
    if (isEditing && field && onUpdate) {
      return (
        <textarea
          value={text}
          onChange={(e) => handleChange(field, e.target.value)}
          className={`w-full bg-brand-bg/50 border-b border-brand-blue/50 focus:border-brand-blue focus:bg-white focus:ring-0 outline-none transition-colors resize-y min-h-[1.5em] overflow-hidden ${className}`}
          rows={text.length > 100 ? 4 : 1}
        />
      );
    }
    return <div className={`text-brand-black whitespace-pre-wrap leading-relaxed text-justify ${isHeader ? '' : 'text-sm font-light'} ${className}`}>{text}</div>;
  };

  // Specific renderer for arrays (Objectives, etc)
  // In Edit Mode: Shows a textarea where each line is an item
  // In View Mode: Shows the nice bullet list
  const EditableList = ({ 
    items, 
    field, 
    type = "bullet" 
  }: { 
    items: string[]; 
    field: keyof LearningSituationData; 
    type?: "bullet" | "striped" 
  }) => {
    if (isEditing && onUpdate) {
        const joinedText = items.join('\n');
        return (
            <textarea 
                value={joinedText}
                onChange={(e) => handleListChange(field, e.target.value)}
                className="w-full bg-brand-bg/50 border-b border-brand-blue/50 focus:border-brand-blue focus:bg-white focus:ring-0 outline-none transition-colors resize-y text-sm font-light min-h-[6em]"
                placeholder="Escribe cada elemento en una nueva línea"
            />
        );
    }

    if (!items || items.length === 0) return <span className="text-gray-400 italic text-xs">Sin contenido</span>;
    
    if (type === "striped") {
      return (
        <div className="flex flex-col w-full border border-brand-border rounded-sm overflow-hidden">
          {items.map((item, idx) => (
            <div key={idx} className="p-2 text-xs text-brand-black bg-white border-b border-brand-border last:border-0 even:bg-brand-light/50">
              {item}
            </div>
          ))}
        </div>
      );
    }

    return (
      <ul className="list-none w-full space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="relative pl-4 text-sm text-brand-black leading-snug">
             <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-brand-teal rounded-full"></span>
             {item}
          </li>
        ))}
      </ul>
    );
  };


  return (
    <div id="document-preview" className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none p-10 print:p-0 text-brand-black font-sans mb-12">
      {/* Main Table Border Container */}
      <div className={`border-4 ${isEditing ? 'border-brand-blue border-dashed' : 'border-brand-dark'} print:border-black transition-all duration-300`}>
        
        {/* Header: Unit & Situation Numbers */}
        <div className="bg-brand-dark text-white font-bold p-4 flex justify-between items-center print:bg-brand-dark print-color-adjust-exact uppercase tracking-widest border-b border-white break-inside-avoid">
          <div className="flex flex-col w-1/2">
            <span className="text-brand-teal text-xs">{t.docHeaderTitle}</span>
            <div className="flex items-center">
                <span className="text-lg mr-2">{t.progUnit}</span>
                {isEditing ? (
                    <input 
                        value={data.progUnitNumber} 
                        onChange={(e) => handleChange('progUnitNumber', e.target.value)}
                        className="bg-white/10 text-white border-none w-16 p-1 text-center text-lg font-bold focus:bg-white/20 outline-none"
                    />
                ) : (
                    <span className="text-lg">{data.progUnitNumber}</span>
                )}
            </div>
          </div>
          <div className="bg-brand-teal px-4 py-2 text-white text-sm font-bold rounded-sm shadow-sm flex items-center">
            <span className="mr-2">{t.saNumber}</span>
            {isEditing ? (
                 <input 
                    value={data.situationNumber} 
                    onChange={(e) => handleChange('situationNumber', e.target.value)}
                    className="bg-white/20 text-white border-none w-16 p-0 text-center font-bold focus:bg-white/30 outline-none"
                />
            ) : (
                <span>{data.situationNumber}</span>
            )}
          </div>
        </div>

        {/* 1. DATOS IDENTIFICATIVOS */}
        <SectionTitle number="1" title={t.sec1} />
        
        <div className="grid grid-cols-1 border-b border-brand-border">
          <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
            <FieldLabel text={t.fieldTitle} />
            <EditableText 
                text={data.title} 
                field="title" 
                className="text-2xl font-bold text-brand-main uppercase tracking-tight" 
                isHeader
            />
          </div>
          <div className="grid grid-cols-3 border-b border-brand-border break-inside-avoid">
            <div className="col-span-2 p-3 border-r border-brand-border">
                <FieldLabel text={t.fieldArea} />
                <EditableText text={data.stageArea} field="stageArea" />
            </div>
            <div className="p-3">
                <FieldLabel text={t.fieldTiming} />
                <EditableText text={data.timingRelation} field="timingRelation" />
            </div>
          </div>
          
          <div className="p-4 border-b border-brand-border break-inside-avoid">
            <FieldLabel text={t.fieldGoal} />
            <EditableText text={data.descriptionGoal} field="descriptionGoal" />
          </div>
          
          <div className="grid grid-cols-2 break-inside-avoid">
             <div className="p-4 border-r border-brand-border">
                <FieldLabel text={t.fieldLinks} />
                <EditableText text={data.linksOtherAreas} field="linksOtherAreas" />
             </div>
             <div className="p-4">
                <FieldLabel text={t.fieldOds} />
                <EditableText text={data.odsChallenges} field="odsChallenges" />
             </div>
          </div>
        </div>

        {/* 2. CONEXIÓN CON ELEMENTOS CURRICULARES */}
        <SectionTitle number="2" title={t.sec2} />

        <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
          <FieldLabel text={t.fieldObj} />
          <EditableList items={data.stageObjectives} field="stageObjectives" type="bullet" />
        </div>
        <div className="p-4 border-b border-brand-border break-inside-avoid">
          <FieldLabel text={t.fieldCompKey} />
          {/* Keep Key Competencies simple edit? Or array? Array edit for consistency */}
          {isEditing ? (
              <EditableList items={data.keyCompetenciesDescriptors} field="keyCompetenciesDescriptors" type="bullet" />
          ) : (
            <div className="flex flex-wrap gap-2">
                {data.keyCompetenciesDescriptors.map((k, i) => (
                    <span key={i} className="bg-brand-border text-brand-dark px-2 py-1 rounded text-xs font-bold">{k}</span>
                ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 border-b border-brand-border break-inside-avoid">
          <div className="border-r border-brand-border p-4">
             <FieldLabel text={t.fieldCompSpec} className="text-center bg-brand-main text-white py-1 mb-3 border-none rounded-sm" />
             <EditableList items={data.specificCompetencies} field="specificCompetencies" type="striped" />
          </div>
          <div className="p-4">
            <FieldLabel text={t.fieldCritEval} className="text-center bg-brand-main text-white py-1 mb-3 border-none rounded-sm" />
            <EditableList items={data.evaluationCriteria} field="evaluationCriteria" type="striped" />
          </div>
        </div>
        
        <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
          <FieldLabel text={t.fieldBasicKnow} />
          <EditableList items={data.basicKnowledge} field="basicKnowledge" type="bullet" />
        </div>

        {/* 3. METODOLOGÍA */}
        <SectionTitle number="3" title={t.sec3} />
        
        <div className="grid grid-cols-2 border-b border-brand-border break-inside-avoid">
          <div className="p-3 border-r border-b border-brand-border">
            <FieldLabel text={t.fieldMethod} />
            <EditableText text={data.method} field="method" />
          </div>
          <div className="p-3 border-b border-brand-border">
            <FieldLabel text={t.fieldModels} />
            <EditableText text={data.pedagogicalModels} field="pedagogicalModels" />
          </div>
          <div className="p-3 border-r border-brand-border">
            <FieldLabel text={t.fieldTech} />
            <EditableText text={data.techniques} field="techniques" />
          </div>
          <div className="p-3">
            <FieldLabel text={t.fieldDua} />
            <EditableText text={data.didacticStrategies} field="didacticStrategies" />
          </div>
        </div>

        {/* 4. SECUENCIACIÓN */}
        <SectionTitle number="4" title={t.sec4} />
        
        {data.activities.map((activity, index) => (
          <div key={index} className="border-b border-brand-border break-inside-avoid group">
            <div className="bg-brand-dark text-white p-2 px-4 font-bold text-xs flex justify-between items-center">
              <span className="uppercase tracking-wider">{t.actLabel} {index + 1}</span>
              <div className="flex items-center gap-2">
                {/* Sessions */}
                {isEditing ? (
                    <input 
                    value={activity.sessions} 
                    onChange={(e) => handleActivityChange(index, 'sessions', e.target.value)}
                    className="bg-white text-brand-dark px-2 py-0.5 rounded-sm text-[10px] font-bold w-24 text-right"
                />
                ) : (
                    <span className="bg-white text-brand-dark px-2 py-0.5 rounded-sm text-[10px] font-bold">{activity.sessions}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3">
              {/* Main Description Column */}
              <div className="col-span-2 p-4 border-r border-brand-border flex flex-col justify-between">
                <div>
                    <FieldLabel text={t.actDesc} />
                    {isEditing ? (
                        <textarea
                        value={activity.description}
                        onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        className="w-full bg-brand-bg/50 border-b border-brand-blue/50 focus:border-brand-blue focus:bg-white focus:ring-0 outline-none transition-colors resize-y text-sm font-light min-h-[6em]"
                    />
                    ) : (
                        <EditableText text={activity.description} />
                    )}
                </div>

                {/* Grouping Type - Moved Here */}
                <div className="mt-4 pt-3 border-t border-brand-border/50 flex items-center">
                    <span className="text-xs font-bold uppercase text-brand-main mr-3">{t.actGrouping}:</span>
                    {isEditing ? (
                        <input 
                        value={activity.grouping || ''} 
                        onChange={(e) => handleActivityChange(index, 'grouping', e.target.value)}
                        className="bg-white border border-brand-blue/50 text-brand-blue px-2 py-1 rounded-sm text-xs font-bold w-full"
                        placeholder="Agrupamiento"
                    />
                    ) : (
                    activity.grouping && (
                        <span className="bg-brand-blue text-white px-3 py-1 rounded-sm text-xs font-bold flex items-center shadow-sm">
                        <Users size={12} className="mr-2" />
                        {activity.grouping}
                        </span>
                    )
                    )}
                </div>

              </div>
              {/* Details Column */}
              <div className="col-span-1 p-3 space-y-3 bg-brand-bg">
                <div className="border-b border-gray-200 pb-2">
                  <FieldLabel text={t.actRes} />
                  {isEditing ? (
                       <textarea
                       value={activity.resources}
                       onChange={(e) => handleActivityChange(index, 'resources', e.target.value)}
                       className="w-full bg-white border-b border-brand-blue/50 focus:border-brand-blue outline-none text-xs font-light resize-y"
                       rows={2}
                     />
                  ) : (
                    <div className="text-brand-black text-sm whitespace-pre-wrap leading-relaxed font-light text-justify">{activity.resources}</div>
                  )}
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <FieldLabel text={t.actProd} />
                  {isEditing ? (
                       <textarea
                       value={activity.evaluableProducts}
                       onChange={(e) => handleActivityChange(index, 'evaluableProducts', e.target.value)}
                       className="w-full bg-white border-b border-brand-blue/50 focus:border-brand-blue outline-none text-xs font-light resize-y"
                       rows={2}
                     />
                  ) : (
                    <div className="text-brand-black text-sm whitespace-pre-wrap leading-relaxed font-light text-justify">{activity.evaluableProducts}</div>
                  )}
                </div>
                <div>
                  <FieldLabel text={t.actTools} />
                  {isEditing ? (
                       <textarea
                       value={activity.evalTools}
                       onChange={(e) => handleActivityChange(index, 'evalTools', e.target.value)}
                       className="w-full bg-white border-b border-brand-blue/50 focus:border-brand-blue outline-none text-xs font-light resize-y"
                       rows={2}
                     />
                  ) : (
                    <div className="text-brand-black text-sm whitespace-pre-wrap leading-relaxed font-light text-justify">{activity.evalTools}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 5. EVALUACIÓN DOCENTE */}
        <SectionTitle number="5" title={t.sec5} />
        <div className="grid grid-cols-2 border-b border-brand-border break-inside-avoid">
             <div className="p-4 border-r border-brand-border">
                <FieldLabel text={t.fieldDesignEval} />
                <EditableText text={data.designEval} field="designEval" />
             </div>
             <div className="p-4">
                <FieldLabel text={t.fieldImplEval} />
                <EditableText text={data.implementationEval} field="implementationEval" />
             </div>
        </div>
        <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
          <FieldLabel text={t.fieldImprove} />
          <EditableText text={data.improvementProposal} field="improvementProposal" />
        </div>

        {/* 6. BIBLIOGRAFÍA */}
        <SectionTitle number="6" title={t.sec6} />
        <div className="p-4 break-inside-avoid">
          <EditableText text={data.bibliography} field="bibliography" />
        </div>
        
        <div className="p-4 bg-brand-dark text-white flex justify-between items-center text-xs print:bg-brand-dark print-color-adjust-exact break-inside-avoid">
            <span className="font-bold uppercase tracking-widest">Ikasnova Generator</span>
            <span className="opacity-80 font-light">{t.watermark}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;