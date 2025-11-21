
import React, { useState } from 'react';

interface SharedTableProps {
  titleColor: string;
  resultColor: string;
  rowSpacing: number;
  cardBgColor: string;
  hideAllButtonColor: string;
  showAllButtonColor: string;
  speakText: (text: string, tableId: string, rowIndex?: number) => void;
  stopSpeech: () => void;
  speakingIdentifier: string | null;
}

interface MultiplicationTableProps extends SharedTableProps {
  multiplier: number;
}

// Helper function to determine if text should be light or dark based on background
const getContrastingTextColor = (hexColor: string): string => {
    if (!hexColor || hexColor.length < 7) return '#374151'; // Default to dark text
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    // Formula for luminance
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#374151' : '#f9fafb'; // Tailwind's gray-700 or gray-50
};

interface MultiplicationVisibilityState {
  multiplier: boolean;
  multiplicand: boolean;
  result: boolean;
}

export const MultiplicationTable: React.FC<MultiplicationTableProps> = ({ 
  multiplier, 
  titleColor, 
  resultColor, 
  rowSpacing, 
  cardBgColor, 
  hideAllButtonColor,
  showAllButtonColor,
  speakText,
  stopSpeech,
  speakingIdentifier,
}) => {
  const calculations = Array.from({ length: 10 }, (_, i) => i + 1);
  const textColor = getContrastingTextColor(cardBgColor);
  const [visibility, setVisibility] = useState<Record<number, MultiplicationVisibilityState>>({});
  const tableId = `mul-${multiplier}`;

  const togglePartVisibility = (index: number, part: keyof MultiplicationVisibilityState) => {
    setVisibility(prev => {
      const currentVisibility = prev[index] || { multiplier: false, multiplicand: false, result: false };
      return {
        ...prev,
        [index]: {
          ...currentVisibility,
          [part]: !currentVisibility[part]
        }
      };
    });
  };

  const handleReadAloud = () => {
    const textToSpeak = `Bảng nhân ${multiplier}. ` + calculations.map(i => `${multiplier} nhân ${i} bằng ${multiplier * i}`).join('. ');
    speakText(textToSpeak, tableId);
  }

  const hideAll = () => {
    const newVisibility: Record<number, MultiplicationVisibilityState> = {};
    calculations.forEach(i => {
      newVisibility[i] = { multiplier: true, multiplicand: true, result: true };
    });
    setVisibility(newVisibility);
  };

  const showAll = () => {
    setVisibility({});
  };

  // Increased width w-14 to accommodate larger text
  const partButtonClasses = "relative font-bold focus:outline-none rounded px-1 py-0.5 inline-block w-14 text-center transition-colors duration-200 hover:bg-black/10 active:scale-95";
  // Define consistent colors for parts
  // Multiplier (First factor) -> Matches Divisor
  const multiplierColor = '#3b82f6'; // Blue-500
  // Multiplicand (Second factor) -> Matches Quotient
  const multiplicandColor = '#8b5cf6'; // Purple-500
  // Result (Product) -> Matches Dividend
  const productColor = '#ef4444'; // Red-500

  const buttonStyle = (color: string): React.CSSProperties => ({
      color: color,
  } as React.CSSProperties);
  
  const isThisTableSpeaking = speakingIdentifier?.startsWith(tableId);

  return (
    <div 
      // Reduced padding from p-6 to p-4 to save space for larger text
      className="rounded-3xl bg-gradient-to-br from-white to-white/40 border-t border-l border-white/80 border-b border-r border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.1)] backdrop-blur-sm p-4 flex flex-col transform transition-all hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 relative overflow-hidden"
      style={{ 
        // Used as a tint instead of solid background
        backgroundColor: cardBgColor !== '#ffffff' ? `${cardBgColor}40` : undefined,
      }}
    >
      {/* Glossy Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-transparent to-transparent pointer-events-none"></div>

      <h2 
        // Increased from text-3xl to text-4xl, reduced mb-6 to mb-4
        className="text-4xl font-extrabold text-center mb-4 relative z-10 drop-shadow-sm"
        style={{ color: titleColor }}
      >
        Bảng nhân {multiplier}
      </h2>
      <div 
        className="flex flex-col items-center flex-grow relative z-10"
        style={{ gap: `${rowSpacing * 0.25}rem` }}
      >
        {calculations.map((i) => {
          const result = multiplier * i;
          const isMultiplierHidden = visibility[i]?.multiplier;
          const isMultiplicandHidden = visibility[i]?.multiplicand;
          const isResultHidden = visibility[i]?.result;
          
          const rowIdentifier = `${tableId}-row-${i}`;
          const isThisRowSpeaking = speakingIdentifier === rowIdentifier;

          return (
            <div
              key={i}
              // Increased from text-2xl to text-3xl, reduced p-1 to p-0.5
              className={`flex items-center justify-center text-3xl w-full p-0.5 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/60 hover:shadow-sm hover:scale-[1.02] active:scale-95 ${isThisRowSpeaking ? 'bg-indigo-100/80 font-semibold ring-2 ring-indigo-200' : ''}`}
              style={{ color: textColor }}
              onClick={() => {
                if (isThisRowSpeaking) {
                  stopSpeech();
                } else {
                  speakText(`${multiplier} nhân ${i} bằng ${result}`, tableId, i);
                }
              }}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isThisRowSpeaking) {
                          stopSpeech();
                      } else {
                          speakText(`${multiplier} nhân ${i} bằng ${result}`, tableId, i);
                      }
                  }
              }}
              role="button"
              tabIndex={0}
              aria-label={isThisRowSpeaking ? 'Dừng đọc' : `Đọc phép tính ${multiplier} nhân ${i}`}
            >
              <span className="drop-shadow-sm">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePartVisibility(i, 'multiplier'); }}
                  className={partButtonClasses}
                  style={buttonStyle(multiplierColor)}
                  aria-label={`Ẩn/hiện thừa số ${multiplier}`}
                >
                  <span className={`transition-opacity duration-300 ease-in-out ${isMultiplierHidden ? 'opacity-0' : 'opacity-100'}`}>{multiplier}</span>
                  <span className={`transition-opacity duration-300 ease-in-out absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center ${isMultiplierHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </button>
                {' '}&times;{' '}
                 <button
                  onClick={(e) => { e.stopPropagation(); togglePartVisibility(i, 'multiplicand'); }}
                  className={partButtonClasses}
                  style={buttonStyle(multiplicandColor)}
                  aria-label={`Ẩn/hiện thừa số ${i}`}
                >
                  <span className={`transition-opacity duration-300 ease-in-out ${isMultiplicandHidden ? 'opacity-0' : 'opacity-100'}`}>{i}</span>
                  <span className={`transition-opacity duration-300 ease-in-out absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center ${isMultiplicandHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </button>
                {' '}= {' '}
                <button
                  onClick={(e) => { e.stopPropagation(); togglePartVisibility(i, 'result'); }}
                  className={partButtonClasses}
                  style={buttonStyle(productColor)}
                  aria-label={`Hiển thị hoặc ẩn kết quả của ${multiplier} nhân ${i}`}
                >
                  <span className={`transition-opacity duration-300 ease-in-out ${isResultHidden ? 'opacity-0' : 'opacity-100'}`}>{result}</span>
                  <span className={`transition-opacity duration-300 ease-in-out absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center ${isResultHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </button>
              </span>
            </div>
          );
        })}
      </div>
       <div className="flex flex-wrap justify-center items-center gap-3 mt-6 pt-4 border-t border-black/5 relative z-10">
        <button 
          onClick={isThisTableSpeaking ? stopSpeech : handleReadAloud} 
          className="px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-none transform"
          style={{ 
            backgroundColor: isThisTableSpeaking ? '#f59e0b' : '#3b82f6', // amber-500 or blue-500
            color: 'white',
            boxShadow: isThisTableSpeaking ? '0 5px 0 #b45309' : '0 5px 0 #1e40af' // Darker shade for shadow
          }}
        >
          {isThisTableSpeaking ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Dừng
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              Đọc
            </>
          )}
        </button>
        <button 
          onClick={hideAll} 
          className="px-4 py-2 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_5px_0_#cbd5e1] active:shadow-none active:translate-y-[5px] transform"
        >
          Ẩn hết
        </button>
        <button 
          onClick={showAll}
          className="px-4 py-2 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 bg-green-100 text-green-700 hover:bg-green-200 shadow-[0_5px_0_#86efac] active:shadow-none active:translate-y-[5px] transform"
        >
          Hiện hết
        </button>
      </div>
    </div>
  );
};

// --- Bảng Chia ---

interface DivisionTableProps extends SharedTableProps {
  divisor: number;
}

interface DivisionVisibilityState {
  dividend: boolean;
  divisor: boolean;
  quotient: boolean;
}

export const DivisionTable: React.FC<DivisionTableProps> = ({
  divisor,
  titleColor,
  resultColor,
  rowSpacing,
  cardBgColor,
  hideAllButtonColor,
  showAllButtonColor,
  speakText,
  stopSpeech,
  speakingIdentifier,
}) => {
  const calculations = Array.from({ length: 10 }, (_, i) => i + 1);
  const textColor = getContrastingTextColor(cardBgColor);
  const [visibility, setVisibility] = useState<Record<number, DivisionVisibilityState>>({});
  const tableId = `div-${divisor}`;

  const togglePartVisibility = (index: number, part: keyof DivisionVisibilityState) => {
    setVisibility(prev => {
      const currentVisibility = prev[index] || { dividend: false, divisor: false, quotient: false };
      return {
        ...prev,
        [index]: { ...currentVisibility, [part]: !currentVisibility[part] },
      };
    });
  };

  const handleReadAloud = () => {
    const textToSpeak = `Bảng chia ${divisor}. ` + calculations.map(i => `${divisor * i} chia ${divisor} bằng ${i}`).join('. ');
    speakText(textToSpeak, tableId);
  }

  const hideAll = () => {
    const newVisibility: Record<number, DivisionVisibilityState> = {};
    calculations.forEach(i => {
      newVisibility[i] = { dividend: true, divisor: true, quotient: true };
    });
    setVisibility(newVisibility);
  };

  const showAll = () => {
    setVisibility({});
  };

  // Increased width w-14 to accommodate larger text
  const partButtonClasses = "relative font-bold focus:outline-none rounded px-1 py-0.5 inline-block w-14 text-center transition-colors duration-200 hover:bg-black/10 active:scale-95";
  
  // Define consistent colors for parts (Matching Multiplication Logic)
  // Dividend (Total) -> Matches Product
  const dividendColor = '#ef4444'; // Red-500
  // Divisor (Group size) -> Matches Multiplier
  const divisorColor = '#3b82f6'; // Blue-500
  // Quotient (Number of groups) -> Matches Multiplicand
  const quotientColor = '#8b5cf6'; // Purple-500

  const buttonStyle = (color: string): React.CSSProperties => ({
      color: color,
  } as React.CSSProperties);

  const isThisTableSpeaking = speakingIdentifier?.startsWith(tableId);

  return (
    <div
      // Reduced padding from p-6 to p-4
      className="rounded-3xl bg-gradient-to-br from-white to-white/40 border-t border-l border-white/80 border-b border-r border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.1)] backdrop-blur-sm p-4 flex flex-col transform transition-all hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 relative overflow-hidden"
      style={{ 
        backgroundColor: cardBgColor !== '#ffffff' ? `${cardBgColor}40` : undefined,
      }}
    >
      {/* Glossy Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-transparent to-transparent pointer-events-none"></div>

      <h2
        // Increased from text-3xl to text-4xl, reduced mb-6 to mb-4
        className="text-4xl font-extrabold text-center mb-4 relative z-10 drop-shadow-sm"
        style={{ color: titleColor }}
      >
        Bảng chia {divisor}
      </h2>
      <div
        className="flex flex-col items-center flex-grow relative z-10"
        style={{ gap: `${rowSpacing * 0.25}rem` }}
      >
        {calculations.map((i) => {
          const dividend = divisor * i;
          const quotient = i;
          const isDividendHidden = visibility[i]?.dividend;
          const isDivisorHidden = visibility[i]?.divisor;
          const isQuotientHidden = visibility[i]?.quotient;
          
          const rowIdentifier = `${tableId}-row-${i}`;
          const isThisRowSpeaking = speakingIdentifier === rowIdentifier;

          return (
            <div
              key={i}
              // Increased from text-2xl to text-3xl, reduced p-1 to p-0.5
              className={`flex items-center justify-center text-3xl w-full p-0.5 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/60 hover:shadow-sm hover:scale-[1.02] active:scale-95 ${isThisRowSpeaking ? 'bg-indigo-100/80 font-semibold ring-2 ring-indigo-200' : ''}`}
              style={{ color: textColor }}
              onClick={() => {
                  if (isThisRowSpeaking) {
                      stopSpeech();
                  } else {
                      speakText(`${dividend} chia ${divisor} bằng ${quotient}`, tableId, i);
                  }
              }}
               onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isThisRowSpeaking) {
                          stopSpeech();
                      } else {
                          speakText(`${dividend} chia ${divisor} bằng ${quotient}`, tableId, i);
                      }
                  }
              }}
              role="button"
              tabIndex={0}
              aria-label={isThisRowSpeaking ? 'Dừng đọc' : `Đọc phép tính ${dividend} chia ${divisor}`}
            >
              <span className="drop-shadow-sm">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePartVisibility(i, 'dividend'); }}
                  className={partButtonClasses}
                  style={buttonStyle(dividendColor)}
                  aria-label={`Ẩn/hiện số bị chia ${dividend}`}
                >
                  <span className={`transition-opacity duration-300 ease-in-out ${isDividendHidden ? 'opacity-0' : 'opacity-100'}`}>{dividend}</span>
                  <span className={`transition-opacity duration-300 ease-in-out absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center ${isDividendHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </button>
                {' '}:{' '}
                <button
                  onClick={(e) => { e.stopPropagation(); togglePartVisibility(i, 'divisor'); }}
                  className={partButtonClasses}
                  style={buttonStyle(divisorColor)}
                  aria-label={`Ẩn/hiện số chia ${divisor}`}
                >
                  <span className={`transition-opacity duration-300 ease-in-out ${isDivisorHidden ? 'opacity-0' : 'opacity-100'}`}>{divisor}</span>
                  <span className={`transition-opacity duration-300 ease-in-out absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center ${isDivisorHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </button>
                {' '}= {' '}
                <button
                  onClick={(e) => { e.stopPropagation(); togglePartVisibility(i, 'quotient'); }}
                  className={partButtonClasses}
                  style={buttonStyle(quotientColor)}
                  aria-label={`Hiển thị hoặc ẩn kết quả của ${dividend} chia ${divisor}`}
                >
                  <span className={`transition-opacity duration-300 ease-in-out ${isQuotientHidden ? 'opacity-0' : 'opacity-100'}`}>{quotient}</span>
                  <span className={`transition-opacity duration-300 ease-in-out absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center ${isQuotientHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </button>
              </span>
            </div>
          );
        })}
      </div>
       <div className="flex flex-wrap justify-center items-center gap-3 mt-6 pt-4 border-t border-black/5 relative z-10">
        <button 
          onClick={isThisTableSpeaking ? stopSpeech : handleReadAloud} 
          className="px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-none transform"
          style={{ 
            backgroundColor: isThisTableSpeaking ? '#f59e0b' : '#3b82f6', // amber-500 or blue-500
            color: 'white',
            boxShadow: isThisTableSpeaking ? '0 5px 0 #b45309' : '0 5px 0 #1e40af'
          }}
        >
          {isThisTableSpeaking ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Dừng
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              Đọc
            </>
          )}
        </button>
        <button 
          onClick={hideAll} 
          className="px-4 py-2 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_5px_0_#cbd5e1] active:shadow-none active:translate-y-[5px] transform"
        >
          Ẩn hết
        </button>
        <button 
          onClick={showAll}
          className="px-4 py-2 text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 bg-green-100 text-green-700 hover:bg-green-200 shadow-[0_5px_0_#86efac] active:shadow-none active:translate-y-[5px] transform"
        >
          Hiện hết
        </button>
      </div>
    </div>
  );
};
