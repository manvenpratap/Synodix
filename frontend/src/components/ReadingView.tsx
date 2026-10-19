import React from 'react';
import type { ChartResponse } from '../types';

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
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5 space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            06 / Audited Synthesis Reading & Export
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Cross-Cultural Corroboration Document
          </h3>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331] transition-colors cursor-pointer"
          >
            Export Markdown
          </button>
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331] transition-colors cursor-pointer"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331] transition-colors cursor-pointer"
          >
            Print
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 rounded-md bg-[#16120e] border border-amber-900/60 text-xs text-amber-200/90 font-mono">
        <strong className="text-amber-300">Academic Integrity & Safety Standard: </strong>
        This document represents symbolic corroboration and divergence between historical computational models. It strictly omits medical diagnosis, legal advice, financial advice, or future prediction claims.
      </div>

      {/* Formatted Markdown Display */}
      <div className="p-4 rounded-md bg-[#080a0f] border border-[#1b2331] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
        {markdownText}
      </div>
    </div>
  );
};
