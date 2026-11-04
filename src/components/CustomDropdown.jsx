import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih opsi',
  variant = 'input', // 'input' | 'inline'
  direction = 'bottom', // 'bottom' | 'top'
  className = '',
  buttonClassName = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`relative inline-block ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium text-[#173a5e] hover:text-[#102942] bg-transparent border-0 cursor-pointer p-0 select-none ${buttonClassName}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <svg
            className={`w-3 h-3 text-[#173a5e] transition-transform duration-150 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            className={`absolute z-50 right-0 min-w-[170px] bg-white border border-[#dcdfda] rounded-[6px] shadow-lg py-1 text-[#1c2530] font-sans ${
              direction === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            }`}
            role="listbox"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors cursor-pointer border-0 ${
                    isSelected
                      ? 'bg-[#e3eaf1] text-[#173a5e] font-medium'
                      : 'bg-white text-[#3b4654] hover:bg-[#f4f5f3]'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span className="text-[#173a5e] text-[12px] font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Variant: 'input' (Standard form select)
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-white border rounded-[6px] px-3 py-[9px] text-[14px] flex items-center justify-between transition-all cursor-pointer select-none ${
          isOpen ? 'border-[#173a5e] ring-1 ring-[#173a5e]/20' : 'border-[#b9bfb8] hover:border-[#173a5e]'
        } ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${selectedOption ? 'text-[#1c2530]' : 'text-[#5a6472]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#5a6472] transition-transform duration-150 shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 max-h-60 overflow-y-auto bg-white border border-[#dcdfda] rounded-[6px] shadow-xl py-1 text-[#1c2530] font-sans ${
            direction === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3.5 py-2 text-[13px] sm:text-[14px] flex items-center justify-between transition-colors cursor-pointer border-0 ${
                  isSelected
                    ? 'bg-[#e3eaf1] text-[#173a5e] font-medium'
                    : 'bg-white text-[#1c2530] hover:bg-[#f4f5f3]'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="truncate pr-2">
                  <div className="font-medium text-[#1c2530]">{opt.label}</div>
                  {opt.sublabel && (
                    <div className="text-[11px] text-[#5a6472] mt-0.5">{opt.sublabel}</div>
                  )}
                </div>
                {isSelected && (
                  <span className="text-[#173a5e] text-[13px] font-bold shrink-0">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
