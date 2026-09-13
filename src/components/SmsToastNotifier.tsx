import React from 'react';
import { MessageSquare, CheckCircle, Smartphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmsToastNotifierProps {
  toast: {
    id: string;
    phone: string;
    message: string;
  } | null;
  onClose: () => void;
}

export const SmsToastNotifier: React.FC<SmsToastNotifierProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-amber-500/30 flex items-start space-x-3.5 rtl:space-x-reverse"
        >
          <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl text-amber-300 shadow-md flex-shrink-0">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> SMS Notification Sent
              </span>
              <span className="text-[10px] text-slate-400">Just Now</span>
            </div>
            
            <p className="text-xs font-medium text-slate-200 mb-1">
              To: <span className="font-semibold text-emerald-400">{toast.phone}</span>
            </p>
            
            <p className="text-xs text-slate-300 bg-slate-800/80 p-2 rounded-lg border border-slate-700/50 leading-relaxed font-mono">
              "{toast.message}"
            </p>

            <div className="mt-2 flex items-center text-[11px] text-emerald-400 font-medium gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Delivered via Delta Bulk SMS Gateway
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
