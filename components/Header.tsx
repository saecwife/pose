import React from 'react';
import { Camera, Grid3X3, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-indigo-600">
          <Grid3X3 size={28} />
          <User size={28} />
          <Camera size={28} />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 tracking-tight">
          PoseGrid AI
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          只要輸入產品名稱，立即生成模特兒搭配產品的九宮格擺拍姿勢草圖。
          <br/>
          <span className="text-xs text-slate-400">Generate 9-grid model posing sketches for your product.</span>
        </p>
      </div>
    </header>
  );
};