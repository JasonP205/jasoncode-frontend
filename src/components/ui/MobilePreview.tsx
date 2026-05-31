import React from 'react';
import { motion } from 'framer-motion';

interface MobilePreviewProps {
  title: string;
  description: string;
  children: React.ReactNode;
  url?: string;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ 
  title, 
  description, 
  children, 
  url 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      {/* Device Frame */}
      <div className="relative w-full max-w-sm">
        {/* Phone Bezel */}
        <div className="bg-black rounded-3xl shadow-2xl overflow-hidden" style={{
          aspectRatio: '9/19.5',
        }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />
          
          {/* Screen Content */}
          <div className="relative w-full h-full bg-white overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full h-full overflow-y-auto"
            >
              {children}
            </motion.div>
          </div>
        </div>

        {/* Device Info */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted mt-1">{description}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Xem trang web đầy đủ
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6 6m0 0l-6 6m6-6H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobilePreview;
