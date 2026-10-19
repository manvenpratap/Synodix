import React from 'react';
import { ChartResponse } from '../types';
import { Download, FileText, Printer, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  data: ChartResponse;
}

export const ReadingView: React.FC<Props> = ({ data }) => {
  const markdownText = data.synthesis.final_reading_markdown;

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    downloadFile(markdownText, `FINAL_READING_${data.birth_input_audit.normalized.civil_date}.md`, 'text/markdown');
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    downloadFile(jsonStr, `MASTER_DATASET_${data.birth_input_audit.normalized.civil_date}.json`, 'application/json');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <span className="px-2 py-0.5 text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800 rounded-full uppercase">
            Step 8 • Synthesized Reading & Export
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Audited Cross-Cultural Synthesis Document
          </h3>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Export Markdown
          </button>
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export JSON
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" /> Print
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200/90 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Academic Integrity & Safety Standard: </strong>
          This document represents symbolic corroboration and divergence between historical computational models. It does not constitute medical diagnosis, legal advice, financial advice, or future prediction.
        </div>
      </div>

      {/* Formatted Markdown Display */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
        {markdownText}
      </div>
    </div>
  );
};
