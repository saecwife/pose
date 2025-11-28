import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (product: string) => void;
  isGenerating: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onGenerate(input.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入產品名稱 (例如: 香水, 運動鞋, 咖啡)..."
          className="w-full h-14 pl-6 pr-32 rounded-full border-2 border-slate-200 shadow-sm text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 rounded-full font-medium transition-colors flex items-center gap-2"
        >
          {isGenerating ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Sparkles size={18} />
          )}
          <span className="hidden sm:inline">生成</span>
        </button>
      </form>
    </div>
  );
};