import React from 'react';
import { PoseItem, PoseStatus } from '../types';
import { Image as ImageIcon, RefreshCcw, AlertCircle } from 'lucide-react';

interface GridItemProps {
  item: PoseItem;
  onRetry: (id: number, description: string) => void;
}

export const GridItem: React.FC<GridItemProps> = ({ item, onRetry }) => {
  return (
    <div className="aspect-square relative group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
      
      {/* Content Layer */}
      <div className="w-full h-full flex flex-col">
        {item.status === PoseStatus.COMPLETED && item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.description}
            className="w-full h-full object-cover mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            {item.status === PoseStatus.GENERATING_IMAGE && (
              <div className="flex flex-col items-center text-indigo-400 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-current border-t-transparent animate-spin mb-2"/>
                <span className="text-xs font-medium">Drawing...</span>
              </div>
            )}
            
            {(item.status === PoseStatus.PENDING_IMAGE || item.status === PoseStatus.GENERATING_TEXT) && (
               <ImageIcon className="text-slate-200" size={48} />
            )}

            {item.status === PoseStatus.ERROR && (
              <div className="text-center p-4">
                <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
                <button 
                  onClick={() => onRetry(item.id, item.description)}
                  className="text-xs bg-white border border-slate-300 px-3 py-1 rounded-full hover:bg-slate-50 transition-colors flex items-center gap-1 mx-auto"
                >
                  <RefreshCcw size={12} /> Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description Overlay (Always visible if we have a description) */}
      <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-3 border-t border-slate-100 transition-transform transform translate-y-0">
        <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold text-slate-400 font-mono">#{item.id + 1}</span>
            <p className="text-xs md:text-sm text-slate-700 font-medium leading-tight line-clamp-2 text-right">
                {item.description || "Waiting for concept..."}
            </p>
        </div>
      </div>
      
      {/* Loading Skeleton for Text Phase */}
      {item.status === PoseStatus.GENERATING_TEXT && (
        <div className="absolute inset-0 bg-white/50 animate-pulse z-20" />
      )}
    </div>
  );
};