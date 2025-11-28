import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { GridItem } from './components/GridItem';
import { generatePoseDescriptions, generatePoseSketch } from './services/gemini';
import { PoseItem, PoseStatus } from './types';
import { Download } from 'lucide-react';

const INITIAL_POSES: PoseItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  description: '',
  status: PoseStatus.IDLE
}));

export default function App() {
  const [poses, setPoses] = useState<PoseItem[]>(INITIAL_POSES);
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to update a specific pose item
  const updatePose = useCallback((id: number, updates: Partial<PoseItem>) => {
    setPoses(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const generateSingleImage = useCallback(async (id: number, product: string, description: string) => {
    try {
      updatePose(id, { status: PoseStatus.GENERATING_IMAGE });
      const imageUrl = await generatePoseSketch(product, description);
      updatePose(id, { imageUrl, status: PoseStatus.COMPLETED });
    } catch (err) {
      updatePose(id, { status: PoseStatus.ERROR });
    }
  }, [updatePose]);

  const handleGenerate = async (product: string) => {
    setIsProcessing(true);
    setError(null);
    setCurrentProduct(product);
    
    // Reset Grid
    setPoses(INITIAL_POSES.map(p => ({ ...p, status: PoseStatus.GENERATING_TEXT })));

    try {
      // Step 1: Get Descriptions
      const descriptions = await generatePoseDescriptions(product);
      
      // Update grid with text first
      const updatedPoses = descriptions.map((desc, index) => ({
        id: index,
        description: desc,
        status: PoseStatus.PENDING_IMAGE
      }));

      // Pad if less than 9 (edge case)
      while (updatedPoses.length < 9) {
        updatedPoses.push({
          id: updatedPoses.length,
          description: `Creative angle ${updatedPoses.length + 1}`,
          status: PoseStatus.PENDING_IMAGE
        });
      }

      setPoses(updatedPoses);

      // Step 2: Generate Images Concurrently (batched to be nice to rate limits/browser)
      // We'll just fire them all but with small staggered delays to avoid instant 429s if any
      const promises = updatedPoses.map((pose, index) => {
        return new Promise<void>(resolve => {
          setTimeout(() => {
            generateSingleImage(pose.id, product, pose.description).then(resolve);
          }, index * 800); // Stagger requests by 800ms
        });
      });

      await Promise.all(promises);

    } catch (err) {
      console.error(err);
      setError("無法生成草圖，請稍後再試。 (Failed to generate sketches)");
      setPoses(prev => prev.map(p => ({ ...p, status: PoseStatus.IDLE })));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryItem = (id: number, description: string) => {
    if (currentProduct) {
      generateSingleImage(id, currentProduct, description);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 pb-20">
        <InputSection onGenerate={handleGenerate} isGenerating={isProcessing} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {poses.map((pose) => (
            <GridItem 
              key={pose.id} 
              item={pose} 
              onRetry={handleRetryItem}
            />
          ))}
        </div>

        {poses.some(p => p.status === PoseStatus.COMPLETED) && !isProcessing && (
           <div className="mt-12 text-center text-slate-400 text-sm">
              <p>Tips: You can save these sketches individually by right-clicking.</p>
           </div>
        )}
      </main>
      
      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
        <p>Powered by Google Gemini 2.5 Flash & Imagen</p>
      </footer>
    </div>
  );
}