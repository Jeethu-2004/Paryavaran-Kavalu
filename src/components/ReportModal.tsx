import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Send } from 'lucide-react';
import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string }) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl border-4 border-emerald-100"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>

          <h2 className="text-3xl font-black text-emerald-950 mb-6 italic">REPORT DUMPING</h2>

          <div className="space-y-6">
            <div className="w-full aspect-video bg-emerald-50 rounded-3xl border-4 border-dashed border-emerald-200 flex flex-col items-center justify-center text-emerald-600 cursor-pointer hover:bg-emerald-100 transition-colors group">
              <Camera size={48} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs tracking-widest uppercase">TAKE A PHOTO</span>
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2 px-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you find? (e.g. Plastic waste near the park)"
                className="w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-emerald-500 transition-colors font-medium text-emerald-950"
              />
            </div>

            <button
              onClick={() => {
                onSubmit({ description });
                setDescription('');
                onClose();
              }}
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
              <Send size={20} />
              SUBMIT REPORT
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
