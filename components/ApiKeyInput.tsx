import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  showCamera: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, showCamera }) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 p-4 shadow-lg z-50 transition-all duration-300 ${showCamera ? 'sm:hidden' : ''}`}>
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-stone-600 whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          <label className="font-medium text-sm">Gemini API Key</label>
        </div>
        
        <div className="relative flex-1 w-full">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="APIキーを入力してください (例: AIzaSy...)"
            className="w-full pl-4 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3">
          {!apiKey && (
            <span className="text-amber-500 text-xs font-bold animate-pulse whitespace-nowrap">
              ⚠️ 入力が必要です
            </span>
          )}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline whitespace-nowrap bg-teal-50 px-3 py-1.5 rounded-full"
          >
            キーを取得
          </a>
        </div>
      </div>
    </div>
  );
};