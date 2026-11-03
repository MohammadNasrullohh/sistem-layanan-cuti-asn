import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-[#1c2530]/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* LawetHub Cohesive Card Dialog */}
      <div className="relative w-full max-w-[460px] bg-white border border-[#dcdfda] rounded-[8px] p-6 shadow-xl text-[#1c2530] font-sans z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[17px] font-semibold text-[#1c2530] m-0 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <div className="text-[12px] text-[#5a6472] mt-0.5">
                {subtitle}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#5a6472] hover:text-[#1c2530] p-1 text-[16px] leading-none bg-transparent border-0 cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="text-[14px] text-[#1c2530] leading-relaxed">
          {children}
        </div>

        {/* Footer Actions */}
        {actions && (
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8ebe6]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
