import React, { useState, useRef } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { AnnotatedImage } from './components/AnnotatedImage';
import { ObjectCard } from './components/ObjectCard';
import { analyzeImage } from './services/geminiService';
import { AppState } from './types';
import CameraCapture from './components/CameraCapture';

// Icons
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const LoaderIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    apiKey: '',
    model: 'gemini-2.5-flash',
    target: 'すべて',
    selectedImage: null,
    isAnalyzing: false,
    result: null,
    error: null,
  });
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          selectedImage: reader.result as string,
          result: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow re-selection of same file
    event.target.value = '';
  };

  const handleCapture = (imageSrc: string) => {
    setState(prev => ({
      ...prev,
      selectedImage: imageSrc,
      result: null,
      error: null
    }));
    setShowCamera(false);
  };

  const handleResetImage = () => {
    setState(prev => ({
      ...prev,
      selectedImage: null,
      result: null,
      error: null,
      isAnalyzing: false
    }));
  };

  const handleAnalyze = async () => {
    if (!state.apiKey) {
      setState(prev => ({ ...prev, error: "APIキーを入力してください。" }));
      return;
    }
    if (!state.selectedImage) return;

    setState(prev => ({ ...prev, isAnalyzing: true, error: null, result: null }));

    try {
      const result = await analyzeImage(
        state.apiKey,
        state.model,
        state.selectedImage,
        state.target
      );
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isAnalyzing: false }));
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-stone-50 font-sans text-stone-800">
      {showCamera && (
        <CameraCapture 
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700">
            <div className="p-2 bg-teal-100 rounded-lg">
              <BookIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-800">AI フォト図鑑</h1>
          </div>
          <div className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Message for Mobile */}
        {!state.selectedImage && !state.result && (
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">身の回りのものを調べよう</h2>
            <p className="text-stone-500">写真を撮るだけで、AIがあなただけの図鑑を作ります。</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls & Image Display */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Control Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-8">
              
              {/* Image Upload / Display Area */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs">1</span>
                    写真を用意する
                  </label>
                  {state.selectedImage && (
                    <button 
                      onClick={handleResetImage}
                      className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <TrashIcon />
                      <span>撮り直す</span>
                    </button>
                  )}
                </div>

                {!state.selectedImage ? (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Camera Button */}
                    <div 
                      onClick={() => !state.apiKey ? alert("先にAPIキーを入力してください") : setShowCamera(true)}
                      className={`group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer h-40
                        ${!state.apiKey ? 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed' : 'border-stone-300 bg-stone-50 hover:bg-teal-50 hover:border-teal-400'}`}
                    >
                      <div className={`p-3 rounded-full mb-3 transition-colors ${!state.apiKey ? 'bg-stone-200 text-stone-400' : 'bg-white text-teal-600 shadow-sm group-hover:scale-110'}`}>
                        <CameraIcon />
                      </div>
                      <span className="text-sm font-bold text-stone-600 group-hover:text-teal-700">カメラで撮影</span>
                    </div>

                    {/* Upload Button */}
                    <div 
                      onClick={() => !state.apiKey ? alert("先にAPIキーを入力してください") : fileInputRef.current?.click()}
                      className={`group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer h-40
                        ${!state.apiKey ? 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed' : 'border-stone-300 bg-stone-50 hover:bg-blue-50 hover:border-blue-400'}`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                        disabled={!state.apiKey}
                      />
                      <div className={`p-3 rounded-full mb-3 transition-colors ${!state.apiKey ? 'bg-stone-200 text-stone-400' : 'bg-white text-blue-600 shadow-sm group-hover:scale-110'}`}>
                        <UploadIcon />
                      </div>
                      <span className="text-sm font-bold text-stone-600 group-hover:text-blue-700">アルバムから</span>
                    </div>
                  </div>
                ) : (
                  /* Image Preview with Annotations (if available) */
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200 bg-stone-900">
                     <AnnotatedImage 
                       imageSrc={state.selectedImage} 
                       objects={state.result?.objects || []} 
                     />
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="space-y-6 pt-4 border-t border-stone-100">
                
                {/* Target Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs">2</span>
                    何を探しますか？
                  </label>
                  <input 
                    type="text" 
                    value={state.target}
                    onChange={(e) => setState(prev => ({ ...prev, target: e.target.value }))}
                    placeholder="例: 家具, 植物, すべて"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-700 shadow-sm transition-all"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['すべて', '植物', '食べ物', '動物', '文房具', '看板'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setState(prev => ({ ...prev, target: tag }))}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors
                          ${state.target === tag 
                            ? 'bg-teal-600 text-white shadow-md' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Selection */}
                <div>
                   <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs">3</span>
                    AIモデル
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all
                      ${state.model === 'gemini-2.5-flash' ? 'bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                      <input 
                        type="radio" 
                        name="model" 
                        checked={state.model === 'gemini-2.5-flash'} 
                        onChange={() => setState(prev => ({ ...prev, model: 'gemini-2.5-flash' }))}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">⚡ Flash (高速)</span>
                    </label>
                    <label className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all
                      ${state.model === 'gemini-3-pro-preview' ? 'bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                      <input 
                        type="radio" 
                        name="model" 
                        checked={state.model === 'gemini-3-pro-preview'} 
                        onChange={() => setState(prev => ({ ...prev, model: 'gemini-3-pro-preview' }))}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">🧠 Pro (高精度)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAnalyze}
                disabled={!state.apiKey || !state.selectedImage || state.isAnalyzing}
                className={`w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-base font-bold text-white transform transition-all duration-200
                  ${(!state.apiKey || !state.selectedImage) 
                    ? 'bg-stone-300 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                {state.isAnalyzing ? (
                  <>
                    <LoaderIcon />
                    AIが解析中...
                  </>
                ) : (
                  <>
                    <SparkleIcon />
                    <span className="ml-2">図鑑を作成する</span>
                  </>
                )}
              </button>

              {state.error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {state.error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Encyclopedia Cards */}
          <div className="lg:col-span-7">
            {state.result ? (
               state.result.objects.length > 0 ? (
                <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                      <span>📖</span>
                      図鑑コレクション
                    </h2>
                    <span className="px-4 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-bold">
                      {state.result.objects.length} 個発見
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {state.result.objects.map((obj, idx) => (
                      <ObjectCard 
                        key={idx} 
                        objectData={obj} 
                        sourceImageSrc={state.selectedImage!} 
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl bg-white">
                   <div className="text-4xl mb-2">🤔</div>
                   <p className="font-medium">該当する物体が見つかりませんでした。</p>
                   <p className="text-sm mt-2">ターゲット設定を変更して再試行してください。</p>
                </div>
              )
            ) : (
              /* Empty State Placeholder */
              <div className="hidden lg:flex h-full flex-col items-center justify-center text-stone-300 min-h-[500px] bg-white/50 rounded-3xl border-2 border-dashed border-stone-200">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                   <BookIcon />
                </div>
                <p className="text-lg font-medium">左側のパネルから写真をアップロードして</p>
                <p className="text-lg font-medium">解析を開始してください</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ApiKeyInput apiKey={state.apiKey} setApiKey={(key) => setState(prev => ({ ...prev, apiKey: key }))} />
    </div>
  );
};

export default App;