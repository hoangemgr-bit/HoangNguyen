
import React, { useState, useEffect, useRef } from 'react';
import { MultiplicationTable, DivisionTable } from './components/MultiplicationTable';
import { GoogleGenAI } from "@google/genai";

// Authentic "Ding" sound (Correct) - Short MP3 Base64
const DEFAULT_CORRECT_SOUND = "data:audio/mp3;base64,//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

// Authentic "Buzz" sound (Incorrect) - Short WAV Base64
const DEFAULT_INCORRECT_SOUND = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; 

// Fallback sound URLs (optional, currently unused in favor of Base64 for offline reliability)
const FALLBACK_CORRECT_URL = "https://www.soundjay.com/buttons/sounds/button-09.mp3";
const FALLBACK_INCORRECT_URL = "https://www.soundjay.com/buttons/sounds/button-10.mp3";

// Sound Options
const CORRECT_SOUND_OPTIONS = [
    { name: 'Mặc định (Chuông)', value: DEFAULT_CORRECT_SOUND },
    { name: 'Điện tử (8-bit)', value: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAD/AP8A/wD/AP8A/wD/AP8AAQ==' }, // Short beep simulation
    { name: 'Nhẹ nhàng (Harp)', value: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAP//AAAAAAAA//8AAP//' }, // Soft simulation
];

const INCORRECT_SOUND_OPTIONS = [
    { name: 'Mặc định (Còi)', value: DEFAULT_INCORRECT_SOUND },
    { name: 'Điện tử (Lỗi)', value: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAACAgICAgICAgICAgICAgICAgA==' }, // Low buzz simulation
    { name: 'Trầm thấp (Thud)', value: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAD//////////////////////w==' }, // Thud simulation
];


const googleFonts = [
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Lato', value: "'Lato', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
];

const themes = {
  default: {
    name: 'Mặc định',
    colors: {
      titleColor: '#4f46e5',
      resultColor: '#4338ca',
      cardBgColor: '#ffffff',
      hideAllButtonColor: '#ef4444',
      showAllButtonColor: '#22c55e',
    },
    font: googleFonts[0].value,
  },
  forest: {
    name: 'Rừng Xanh',
    colors: {
      titleColor: '#166534',
      resultColor: '#15803d',
      cardBgColor: '#f0fdf4',
      hideAllButtonColor: '#f97316',
      showAllButtonColor: '#84cc16',
    },
    font: googleFonts[2].value,
  },
  ocean: {
    name: 'Đại Dương',
    colors: {
      titleColor: '#0c4a6e',
      resultColor: '#075985',
      cardBgColor: '#f0f9ff',
      hideAllButtonColor: '#f43f5e',
      showAllButtonColor: '#14b8a6',
    },
    font: googleFonts[1].value,
  },
  solar: {
    name: 'Năng Lượng',
    colors: {
      titleColor: '#b91c1c',
      resultColor: '#dd2424',
      cardBgColor: '#fffbeb',
      hideAllButtonColor: '#0891b2',
      showAllButtonColor: '#f59e0b',
    },
    font: googleFonts[3].value,
  },
};

const achievements = {
    PERFECT_SCORE_10: { name: "Chuyên Gia Tập Sự", description: "Đạt điểm tuyệt đối trong bài kiểm tra 10 câu.", icon: "⭐" },
    PERFECT_SCORE_20: { name: "Bậc Thầy Hoàn Hảo", description: "Đạt điểm tuyệt đối trong bài kiểm tra 20 câu.", icon: "🏆" },
    STREAK_5: { name: "Vào Guồng", description: "Trả lời đúng 5 câu liên tiếp.", icon: "🔥" },
    STREAK_10: { name: "Không Thể Cản Phá", description: "Trả lời đúng 10 câu liên tiếp.", icon: "🚀" },
    TOTAL_CORRECT_25: { name: "Người Bắt Đầu", description: "Trả lời đúng tổng cộng 25 câu hỏi.", icon: "✅" },
    TOTAL_CORRECT_50: { name: "Người Học Chăm Chỉ", description: "Trả lời đúng tổng cộng 50 câu hỏi.", icon: "🎓" },
};

type AchievementId = keyof typeof achievements;

// Helper function to determine text color based on background
const getContrastingTextColor = (hexColor: string): string => {
    if (!hexColor || hexColor.length < 7) return '#374151'; // Default dark
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#374151' : '#f9fafb'; // gray-700 or gray-50
};

// Helper to darken/lighten color for shadow generation
const adjustBrightness = (hex: string, amount: number) => {
    return '#' + hex.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

type ExerciseType = 'CALCULATION' | 'MISSING_NUMBER' | 'COMPARISON' | 'TRUE_FALSE' | 'FIND_OPERANDS' | 'MULTIPLE_CHOICE';

type Question = {
  type: ExerciseType;
  display: string; // The text shown to the user, e.g., "5 x ? = 20"
  answer: number | string | boolean; // The correct answer (or target value for FIND_OPERANDS)
  correctExpression: string; // The full correct expression for the results screen
  options?: (number | string)[]; // Options for multiple choice
};

type Difficulty = 'easy' | 'medium' | 'hard';

const exerciseTypeLabels: Record<keyof typeof exerciseTypesConfig, string> = {
    CALCULATION: 'Tính toán (a × b = ?)',
    MISSING_NUMBER: 'Tìm số còn thiếu (? × b = c)',
    COMPARISON: 'So sánh (<, >, =)',
    TRUE_FALSE: 'Đúng / Sai',
    FIND_OPERANDS: 'Tìm hai số (? × ? = c)',
    MULTIPLE_CHOICE: 'Trắc nghiệm',
};

const exerciseTypesConfig = {
    CALCULATION: true,
    MISSING_NUMBER: true,
    COMPARISON: true,
    TRUE_FALSE: true,
    FIND_OPERANDS: true,
    MULTIPLE_CHOICE: true,
};

type ExerciseTypes = typeof exerciseTypesConfig;

interface SelectedCalculation {
    type: 'mul' | 'div';
    num1: number;
    num2: number;
    result: number;
}

interface VisualizationMask {
    num1: boolean;
    num2: boolean;
    result: boolean;
}

// Interface for Chat Messages
interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const App: React.FC = () => {
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9];

  // App mode
  const [mode, setMode] = useState<'tables' | 'quiz' | 'achievements'>('tables');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Table settings
  const [titleColor, setTitleColor] = useState(themes.default.colors.titleColor); 
  const [resultColor, setResultColor] = useState(themes.default.colors.resultColor); 
  const [cardBgColor, setCardBgColor] = useState(themes.default.colors.cardBgColor); 
  const [font, setFont] = useState(themes.default.font);
  const [rowSpacing, setRowSpacing] = useState(2); // Default to 2 (0.5rem)
  const [hideAllButtonColor, setHideAllButtonColor] = useState(themes.default.colors.hideAllButtonColor); 
  const [showAllButtonColor, setShowAllButtonColor] = useState(themes.default.colors.showAllButtonColor); 
  const [startMultiplier, setStartMultiplier] = useState(2);
  const [endMultiplier, setEndMultiplier] = useState(9);

  // Initialize tableVisibility directly from localStorage to ensure persistence
  const [tableVisibility, setTableVisibility] = useState<{
    mul: Record<number, boolean>;
    div: Record<number, boolean>;
  }>(() => {
    const saved = localStorage.getItem('multiplicationTableVisibility');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object' && parsed.mul && parsed.div) {
                return parsed;
            }
        } catch (e) {
            console.error("Error parsing tableVisibility", e);
        }
    }
    // Default: All hidden
    const initial: { mul: Record<number, boolean>; div: Record<number, boolean> } = { mul: {}, div: {} };
    multipliers.forEach(m => {
      initial.mul[m] = false;
      initial.div[m] = false;
    });
    return initial;
  });

  // Quiz settings & state
  const [quizState, setQuizState] = useState<'setup' | 'active' | 'results'>('setup');
  const [numQuestions, setNumQuestions] = useState(10);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseTypes>(exerciseTypesConfig);
  // New state for selecting operations
  const [quizOperations, setQuizOperations] = useState<{ mul: boolean; div: boolean }>({ mul: true, div: true });
  
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | number | boolean)[]>([]);
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Use FALLBACK constants if we wanted URLs, but here we use the Base64 constants for default state
  // This ensures sounds work offline immediately.
  const [correctSound, setCorrectSound] = useState(DEFAULT_CORRECT_SOUND); 
  const [incorrectSound, setIncorrectSound] = useState(DEFAULT_INCORRECT_SOUND);
  
  // State for storing custom uploaded sounds persistently
  const [savedCustomCorrectSound, setSavedCustomCorrectSound] = useState<string | null>(() => localStorage.getItem('multiplicationTableSavedCustomCorrect'));
  const [savedCustomIncorrectSound, setSavedCustomIncorrectSound] = useState<string | null>(() => localStorage.getItem('multiplicationTableSavedCustomIncorrect'));

  const [correctAnswerColor, setCorrectAnswerColor] = useState('#22c55e'); // Green default
  const [incorrectAnswerColor, setIncorrectAnswerColor] = useState('#ef4444'); // Red default
  const [quizCardBgColor, setQuizCardBgColor] = useState('#ffffff');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const quizInputRef = useRef<HTMLInputElement>(null);
  // Refs for dual inputs (FIND_OPERANDS)
  const operand1Ref = useRef<HTMLInputElement>(null);
  const operand2Ref = useRef<HTMLInputElement>(null);

  // Gamification state
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<AchievementId>>(new Set());
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<AchievementId | null>(null);

  // Visual Formation State & Interaction
  // Initial state set to 2 x 1 so visualization is active by default
  const [selectedCalculation, setSelectedCalculation] = useState<SelectedCalculation | null>({ type: 'mul', num1: 2, num2: 1, result: 2 });
  const [divisionStep, setDivisionStep] = useState(0); // For division animation (how many rounds distributed)
  const [clickedStars, setClickedStars] = useState<Set<string>>(new Set()); // For interactive counting
  
  // Initialize showVisualization directly from localStorage
  const [showVisualization, setShowVisualization] = useState(() => {
      const saved = localStorage.getItem('multiplicationTableShowVisualization');
      return saved ? JSON.parse(saved) : false;
  });

  // Default mask to true (hidden) so calculations start as ??
  const [visualizationMask, setVisualizationMask] = useState<VisualizationMask>({ num1: true, num2: true, result: true });


  // TTS State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechSettings, setSpeechSettings] = useState({ voiceURI: '', rate: 1, pitch: 1 });
  const [speakingIdentifier, setSpeakingIdentifier] = useState<string | null>(null);

  // AI Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { role: 'model', text: 'Xin chào! Mình là Trạng Tí, trợ lý toán học của bạn. Bạn cần mình giúp gì không?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    const saved = {
      titleColor: localStorage.getItem('multiplicationTableTitleColor'),
      resultColor: localStorage.getItem('multiplicationTableResultColor'),
      cardBgColor: localStorage.getItem('multiplicationTableCardBgColor'),
      font: localStorage.getItem('multiplicationTableFont'),
      rowSpacing: localStorage.getItem('multiplicationTableRowSpacing'),
      hideAllColor: localStorage.getItem('multiplicationTableHideAllButtonColor'),
      showAllColor: localStorage.getItem('multiplicationTableShowAllButtonColor'),
      startMultiplier: localStorage.getItem('multiplicationTableStartMultiplier'),
      endMultiplier: localStorage.getItem('multiplicationTableEndMultiplier'),
      correctSound: localStorage.getItem('multiplicationTableCorrectSound'),
      incorrectSound: localStorage.getItem('multiplicationTableIncorrectSound'),
      unlockedAchievements: localStorage.getItem('multiplicationTableUnlockedAchievements'),
      totalCorrectAnswers: localStorage.getItem('multiplicationTableTotalCorrect'),
      difficulty: localStorage.getItem('multiplicationTableDifficulty'),
      numQuestions: localStorage.getItem('multiplicationTableNumQuestions'),
      correctAnswerColor: localStorage.getItem('multiplicationTableCorrectAnswerColor'),
      incorrectAnswerColor: localStorage.getItem('multiplicationTableIncorrectAnswerColor'),
      quizCardBgColor: localStorage.getItem('multiplicationTableQuizCardBgColor'),
      exerciseTypes: localStorage.getItem('multiplicationTableExerciseTypes'),
      quizOperations: localStorage.getItem('multiplicationTableQuizOperations'),
      speechSettings: localStorage.getItem('multiplicationTableSpeechSettings'),
    };

    if (saved.titleColor) setTitleColor(saved.titleColor);
    if (saved.resultColor) setResultColor(saved.resultColor);
    if (saved.cardBgColor) setCardBgColor(saved.cardBgColor);
    if (saved.font) setFont(saved.font);
    if (saved.rowSpacing) setRowSpacing(parseInt(saved.rowSpacing, 10));
    if (saved.hideAllColor) setHideAllButtonColor(saved.hideAllColor);
    if (saved.showAllColor) setShowAllButtonColor(saved.showAllColor);
    if (saved.startMultiplier) setStartMultiplier(parseInt(saved.startMultiplier, 10));
    if (saved.endMultiplier) setEndMultiplier(parseInt(saved.endMultiplier, 10));
    // Use saved sound OR default to URL fallback.
    if (saved.correctSound) setCorrectSound(saved.correctSound);
    if (saved.incorrectSound) setIncorrectSound(saved.incorrectSound);
    if (saved.unlockedAchievements) setUnlockedAchievements(new Set(JSON.parse(saved.unlockedAchievements)));
    if (saved.totalCorrectAnswers) setTotalCorrectAnswers(parseInt(saved.totalCorrectAnswers, 10));
    if (saved.difficulty) setDifficulty(saved.difficulty as Difficulty);
    if (saved.numQuestions) setNumQuestions(parseInt(saved.numQuestions, 10));
    if (saved.correctAnswerColor) setCorrectAnswerColor(saved.correctAnswerColor);
    if (saved.incorrectAnswerColor) setIncorrectAnswerColor(saved.incorrectAnswerColor);
    if (saved.quizCardBgColor) setQuizCardBgColor(saved.quizCardBgColor);
    if (saved.exerciseTypes) setExerciseTypes(JSON.parse(saved.exerciseTypes));
    if (saved.quizOperations) setQuizOperations(JSON.parse(saved.quizOperations));
    if (saved.speechSettings) setSpeechSettings(JSON.parse(saved.speechSettings));
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('multiplicationTableTitleColor', titleColor);
    localStorage.setItem('multiplicationTableResultColor', resultColor);
    localStorage.setItem('multiplicationTableCardBgColor', cardBgColor);
    localStorage.setItem('multiplicationTableFont', font);
    localStorage.setItem('multiplicationTableRowSpacing', rowSpacing.toString());
    localStorage.setItem('multiplicationTableHideAllButtonColor', hideAllButtonColor);
    localStorage.setItem('multiplicationTableShowAllButtonColor', showAllButtonColor);
    localStorage.setItem('multiplicationTableStartMultiplier', startMultiplier.toString());
    localStorage.setItem('multiplicationTableEndMultiplier', endMultiplier.toString());
    localStorage.setItem('multiplicationTableCorrectSound', correctSound);
    localStorage.setItem('multiplicationTableIncorrectSound', incorrectSound);
    localStorage.setItem('multiplicationTableUnlockedAchievements', JSON.stringify(Array.from(unlockedAchievements)));
    localStorage.setItem('multiplicationTableTotalCorrect', totalCorrectAnswers.toString());
    localStorage.setItem('multiplicationTableDifficulty', difficulty);
    localStorage.setItem('multiplicationTableNumQuestions', numQuestions.toString());
    localStorage.setItem('multiplicationTableCorrectAnswerColor', correctAnswerColor);
    localStorage.setItem('multiplicationTableIncorrectAnswerColor', incorrectAnswerColor);
    localStorage.setItem('multiplicationTableQuizCardBgColor', quizCardBgColor);
    localStorage.setItem('multiplicationTableVisibility', JSON.stringify(tableVisibility));
    localStorage.setItem('multiplicationTableExerciseTypes', JSON.stringify(exerciseTypes));
    localStorage.setItem('multiplicationTableQuizOperations', JSON.stringify(quizOperations));
    localStorage.setItem('multiplicationTableSpeechSettings', JSON.stringify(speechSettings));
    localStorage.setItem('multiplicationTableShowVisualization', JSON.stringify(showVisualization));
  }, [titleColor, resultColor, cardBgColor, font, rowSpacing, hideAllButtonColor, showAllButtonColor, startMultiplier, endMultiplier, correctSound, incorrectSound, unlockedAchievements, totalCorrectAnswers, difficulty, numQuestions, correctAnswerColor, incorrectAnswerColor, quizCardBgColor, tableVisibility, exerciseTypes, quizOperations, speechSettings, showVisualization]);
  
  // Reset interactive states when calculation changes
  useEffect(() => {
    setDivisionStep(0);
    setClickedStars(new Set());
  }, [selectedCalculation]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAssistantOpen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Effect 1: Populate and manage the voice list.
  useEffect(() => {
    const populateVoiceList = () => {
        if (!window.speechSynthesis) {
            console.warn("Speech Synthesis not supported by this browser.");
            return;
        }

        const allVoices = window.speechSynthesis.getVoices();
        if (allVoices.length === 0) {
            // Voices might load asynchronously. We wait for the 'voiceschanged' event.
            return;
        }

        const viVoices = allVoices.filter(v => v.lang.startsWith('vi'));

        if (viVoices.length > 0) {
            // Sort to prioritize female voices, then male voices, then alphabetically.
            const sortedViVoices = viVoices.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const aIsFemale = aName.includes('nữ');
                const bIsFemale = bName.includes('nữ');
                const aIsMale = aName.includes('nam');
                const bIsMale = bName.includes('nam');

                if (aIsFemale && !bIsFemale) return -1;
                if (!aIsFemale && bIsFemale) return 1;
                if (aIsMale && !bIsMale) return -1;
                if (!aIsMale && bIsMale) return 1;

                return a.name.localeCompare(b.name);
            });
            
            setVoices(sortedViVoices);
        } else {
            console.warn("No Vietnamese voices found. TTS functionality may be limited.");
            setVoices([]); // Clear voices if none are Vietnamese
        }
    };

    // Initial attempt to populate
    populateVoiceList();

    // The 'voiceschanged' event is crucial as voices are often loaded asynchronously.
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Effect 2: Validate selected voice when the list or selection changes.
  useEffect(() => {
    if (voices.length > 0) {
        const isCurrentVoiceValid = voices.some(v => v.voiceURI === speechSettings.voiceURI);
        // If the stored voice isn't in our new Vietnamese-only list,
        // or if no voice is selected yet, default to the first one.
        if (!isCurrentVoiceValid || !speechSettings.voiceURI) {
            setSpeechSettings(prev => ({ ...prev, voiceURI: voices[0].voiceURI }));
        }
    } else {
        // If no Vietnamese voices are available, clear the setting.
        if(speechSettings.voiceURI !== '') {
            setSpeechSettings(prev => ({ ...prev, voiceURI: '' }));
        }
    }
  }, [voices, speechSettings.voiceURI]);

  // Focus quiz input when question changes
  useEffect(() => {
    if (quizState === 'active') {
        if (questions[currentQuestionIndex]?.type === 'FIND_OPERANDS') {
            operand1Ref.current?.focus();
        } else if (questions[currentQuestionIndex]?.type !== 'MULTIPLE_CHOICE') {
            quizInputRef.current?.focus();
        }
    }
    setShowCorrectAnswer(false); // Reset answer visibility for new question
  }, [currentQuestionIndex, quizState, questions]);

  // Animate score on results screen
  useEffect(() => {
    if (quizState === 'results') {
      setAnimatedScore(0);
      if (score === 0) return;

      const duration = 500; // ms
      const stepTime = 25; // ms per step
      const totalSteps = duration / stepTime;
      const increment = score / totalSteps;
      let currentAnimatedScore = 0;

      const timer = setInterval(() => {
        currentAnimatedScore += increment;
        if (currentAnimatedScore >= score) {
          setAnimatedScore(score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.ceil(currentAnimatedScore));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [quizState, score]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
            console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
        });
        setIsFullScreen(true);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        setIsFullScreen(false);
    }
  };

  const unlockAchievement = (id: AchievementId) => {
    if (!unlockedAchievements.has(id)) {
      setUnlockedAchievements(prev => new Set(prev).add(id));
      setRecentlyUnlocked(id);
      setTimeout(() => setRecentlyUnlocked(null), 4000); // Hide toast after 4s
    }
  };
  
  // Refined playSound to handle overlapping audio
  const playSound = (soundUri: string) => {
    if (!soundUri) return;
    try {
        const audio = new Audio(soundUri);
        // Allow the audio to be played even if another is playing
        audio.currentTime = 0; 
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.warn("Audio play prevented by browser policy:", e);
                // Fallback: If external URL fails, try default base64 if available (logic can be expanded)
            });
        }
    } catch (error) {
        console.warn("Error creating audio object:", error);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu thành tích? Hành động này không thể hoàn tác.")) {
        setUnlockedAchievements(new Set());
        setTotalCorrectAnswers(0);
        setScore(0);
        setCurrentStreak(0);
        localStorage.removeItem('multiplicationTableUnlockedAchievements');
        localStorage.removeItem('multiplicationTableTotalCorrect');
        alert("Dữ liệu đã được đặt lại!");
    }
  };
  
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'correct' | 'incorrect') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 500 * 1024) { // 500KB limit
            alert("Vui lòng chọn file âm thanh nhỏ hơn 500KB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (base64) {
                try {
                    if (type === 'correct') {
                        setSavedCustomCorrectSound(base64); // Update saved state
                        localStorage.setItem('multiplicationTableSavedCustomCorrect', base64); // Persist immediately
                        setCorrectSound(base64); // Set as active
                        playSound(base64); // Preview
                    } else {
                        setSavedCustomIncorrectSound(base64);
                        localStorage.setItem('multiplicationTableSavedCustomIncorrect', base64);
                        setIncorrectSound(base64);
                        playSound(base64); // Preview
                    }
                } catch (error) {
                    console.error("Storage quota exceeded", error);
                    alert("File âm thanh quá lớn để lưu lâu dài, nhưng bạn vẫn có thể dùng trong phiên này.");
                    if (type === 'correct') setCorrectSound(base64);
                    else setIncorrectSound(base64);
                }
            }
        };
        reader.onerror = () => alert("Lỗi khi đọc file.");
        reader.readAsDataURL(file);
    };

  const handleThemeSelect = (themeConfig: typeof themes[keyof typeof themes]) => {
    setTitleColor(themeConfig.colors.titleColor);
    setResultColor(themeConfig.colors.resultColor);
    setCardBgColor(themeConfig.colors.cardBgColor);
    setHideAllButtonColor(themeConfig.colors.hideAllButtonColor);
    setShowAllButtonColor(themeConfig.colors.showAllButtonColor);
    setFont(themeConfig.font);
  };

  const handleTableVisibilityChange = (type: 'mul' | 'div', num: number) => {
    // If we are turning a table ON, update the visualization to show that table's starting calculation
    if (!tableVisibility[type][num] || showVisualization) {
        if (type === 'mul') {
            setSelectedCalculation({ type: 'mul', num1: num, num2: 1, result: num });
        } else {
            // For division, start with {num} : {num} = 1
            setSelectedCalculation({ type: 'div', num1: num, num2: num, result: 1 });
        }
        // Set mask to hidden (true) when switching tables
        setVisualizationMask({ num1: true, num2: true, result: true });
    }

    if (showVisualization) {
        // Enforce Single View: Turn off everything, then turn on the selected one.
        // If the user clicks the currently active table, we keep it active (or toggle off? Let's just switch to it effectively).
        const newMulVisibility: Record<number, boolean> = {};
        multipliers.forEach(m => newMulVisibility[m] = false);
        
        const newDivVisibility: Record<number, boolean> = {};
        multipliers.forEach(m => newDivVisibility[m] = false);

        // Activate ONLY the selected one
        if (type === 'mul') newMulVisibility[num] = true;
        else newDivVisibility[num] = true;

        setTableVisibility({ mul: newMulVisibility, div: newDivVisibility });
    } else {
        // Standard Multi-View Toggle
        setTableVisibility(prev => ({
        ...prev,
        [type]: {
            ...prev[type],
            [num]: !prev[type][num],
        },
        }));
    }
  };

  const showAllTables = (type: 'mul' | 'div') => {
    // "Show All" conflicts with "Single View" (Visualization). 
    // So if we Show All, we must disable Visualization.
    if (showVisualization) setShowVisualization(false);

    const newVisibility: Record<number, boolean> = {};
    multipliers.forEach(num => (newVisibility[num] = true));
    setTableVisibility(prev => ({
      ...prev,
      [type]: newVisibility,
    }));
  };

  const hideAllTables = (type: 'mul' | 'div') => {
    const newVisibility: Record<number, boolean> = {};
    multipliers.forEach(num => (newVisibility[num] = false));
    setTableVisibility(prev => ({
      ...prev,
      [type]: newVisibility,
    }));
  };

  const toggleVisualizationMode = () => {
      const nextState = !showVisualization;
      setShowVisualization(nextState);

      if (nextState) {
          // If enabling visualization, enforce single view immediately.
          // Check if multiple tables are open.
          const activeMul = multipliers.filter(m => tableVisibility.mul[m]);
          const activeDiv = multipliers.filter(m => tableVisibility.div[m]);
          const totalActive = activeMul.length + activeDiv.length;

          if (totalActive > 1) {
              // Reduce to just the first active table found
              const newMulVisibility: Record<number, boolean> = {};
              multipliers.forEach(m => newMulVisibility[m] = false);
              const newDivVisibility: Record<number, boolean> = {};
              multipliers.forEach(m => newDivVisibility[m] = false);

              if (activeMul.length > 0) {
                  const first = activeMul[0];
                  newMulVisibility[first] = true;
                  // Update visualization to match
                   setSelectedCalculation({ type: 'mul', num1: first, num2: 1, result: first });
              } else if (activeDiv.length > 0) {
                   const first = activeDiv[0];
                   newDivVisibility[first] = true;
                   setSelectedCalculation({ type: 'div', num1: first, num2: first, result: 1 });
              }
              
              setTableVisibility({ mul: newMulVisibility, div: newDivVisibility });
          } else if (totalActive === 0) {
              // If nothing is open, open Default (Mul 2)
              const newMulVisibility: Record<number, boolean> = {};
              multipliers.forEach(m => newMulVisibility[m] = false);
              newMulVisibility[2] = true;
              const newDivVisibility: Record<number, boolean> = {};
              multipliers.forEach(m => newDivVisibility[m] = false);
              
              setTableVisibility({ mul: newMulVisibility, div: newDivVisibility });
              setSelectedCalculation({ type: 'mul', num1: 2, num2: 1, result: 2 });
          }
          // If exactly 1 is active, do nothing, it's already perfect.
      }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStart = parseInt(e.target.value, 10);
      setStartMultiplier(newStart);
      if (newStart > endMultiplier) setEndMultiplier(newStart);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newEnd = parseInt(e.target.value, 10);
      setEndMultiplier(newEnd);
      if (newEnd < startMultiplier) setStartMultiplier(newEnd);
  };
  
const generateQuestions = () => {
    const potentialQuestions: Question[] = [];
    const enabledTypes = (Object.keys(exerciseTypes) as (keyof ExerciseTypes)[]).filter(k => exerciseTypes[k]);

    // Determine permitted operations based on settings
    const permittedOps: ('mul' | 'div')[] = [];
    if (quizOperations.mul) permittedOps.push('mul');
    if (quizOperations.div) permittedOps.push('div');
    // Fallback: if user somehow unchecks both (UI should prevent this, but safety first), default to Mul
    if (permittedOps.length === 0) permittedOps.push('mul');


    // Range for the first operand (Table number) - STRICTLY follow settings
    let min = startMultiplier;
    let max = endMultiplier;
    
    // Range for the second operand (the multiplier or the quotient) - Controlled by DIFFICULTY
    let maxMultiplicand = 10;
    if (difficulty === 'easy') maxMultiplicand = 5;
    else if (difficulty === 'hard') maxMultiplicand = 12; // Hard includes up to 12

    const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const multiplicands = Array.from({ length: maxMultiplicand }, (_, i) => i + 1);

    const getRandomElement = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    enabledTypes.forEach(type => {
        for (let i = 0; i < numQuestions * 2 / enabledTypes.length; i++) { // Generate a pool of questions
            const num1 = getRandomElement(range); // Table number
            const num2 = getRandomElement(multiplicands); // Multiplier
            const result = num1 * num2;
            
            // Randomly select an operation from the permitted list
            const opType = getRandomElement(permittedOps);

            switch(type) {
                case 'CALCULATION':
                    if (opType === 'mul') {
                        potentialQuestions.push({ type: 'CALCULATION', display: `${num1} × ${num2} = ?`, answer: result, correctExpression: `${num1} × ${num2} = ${result}` });
                    } else {
                        potentialQuestions.push({ type: 'CALCULATION', display: `${result} : ${num1} = ?`, answer: num2, correctExpression: `${result} : ${num1} = ${num2}` });
                    }
                    break;
                case 'MISSING_NUMBER':
                    const missingPart = Math.floor(Math.random() * 3);
                     if (opType === 'mul') {
                        if (missingPart === 0) potentialQuestions.push({ type: 'MISSING_NUMBER', display: `? × ${num2} = ${result}`, answer: num1, correctExpression: `${num1} × ${num2} = ${result}` });
                        else potentialQuestions.push({ type: 'MISSING_NUMBER', display: `${num1} × ? = ${result}`, answer: num2, correctExpression: `${num1} × ${num2} = ${result}` });
                    } else {
                         if (missingPart === 0) potentialQuestions.push({ type: 'MISSING_NUMBER', display: `? : ${num1} = ${num2}`, answer: result, correctExpression: `${result} : ${num1} = ${num2}` });
                        else potentialQuestions.push({ type: 'MISSING_NUMBER', display: `${result} : ? = ${num2}`, answer: num1, correctExpression: `${result} : ${num1} = ${num2}` });
                    }
                    break;
                case 'COMPARISON':
                    const num3 = getRandomElement(range);
                    const num4 = getRandomElement(multiplicands);
                    const result2 = num3 * num4;
                    const comparisonAnswer = result > result2 ? '>' : result < result2 ? '<' : '=';
                    potentialQuestions.push({ type: 'COMPARISON', display: `${num1} × ${num2} ___ ${num3} × ${num4}`, answer: comparisonAnswer, correctExpression: `${num1} × ${num2} ${comparisonAnswer} ${num3} × ${num4}` });
                    break;
                case 'TRUE_FALSE':
                    const isTrue = Math.random() > 0.5;
                    if (isTrue) {
                        potentialQuestions.push({ type: 'TRUE_FALSE', display: `${num1} × ${num2} = ${result}`, answer: true, correctExpression: `${num1} × ${num2} = ${result}` });
                    } else {
                        const wrongResult = result + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random()*3)+1);
                        potentialQuestions.push({ type: 'TRUE_FALSE', display: `${num1} × ${num2} = ${wrongResult}`, answer: false, correctExpression: `${num1} × ${num2} = ${result}` });
                    }
                    break;
                case 'FIND_OPERANDS':
                     if (opType === 'mul') {
                        potentialQuestions.push({ 
                            type: 'FIND_OPERANDS', 
                            display: `? × ? = ${result}`, 
                            answer: result, // The target result
                            correctExpression: `${num1} × ${num2} = ${result}` 
                        });
                    } else {
                         // For division: ? : ? = quotient (num2)
                         potentialQuestions.push({ 
                            type: 'FIND_OPERANDS', 
                            display: `? : ? = ${num2}`, 
                            answer: num2, // The target quotient
                            correctExpression: `${result} : ${num1} = ${num2}` 
                        });
                    }
                    break;
                case 'MULTIPLE_CHOICE':
                    const correctAnswer = opType === 'mul' ? result : num2;
                    const optionsSet = new Set<number>();
                    optionsSet.add(correctAnswer);
                    
                    // Generate unique smart distractors
                    while (optionsSet.size < 4) {
                         let offset = Math.floor(Math.random() * 10) - 5; // Range -5 to 5
                         if (offset === 0) offset = 1;
                         const distractor = Math.abs(correctAnswer + offset);
                         if (distractor > 0) {
                             optionsSet.add(distractor);
                         }
                    }
                    // Convert set to array and shuffle
                    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

                    potentialQuestions.push({
                        type: 'MULTIPLE_CHOICE',
                        display: opType === 'mul' ? `${num1} × ${num2} = ?` : `${result} : ${num1} = ?`,
                        answer: correctAnswer,
                        correctExpression: opType === 'mul' ? `${num1} × ${num2} = ${correctAnswer}` : `${result} : ${num1} = ${correctAnswer}`,
                        options: options
                    });
                    break;
            }
        }
    });

    const shuffled = potentialQuestions.sort(() => 0.5 - Math.random());
    // Correction: slice(0, numQuestions)
    setQuestions(shuffled.slice(0, numQuestions));
};


    const startQuiz = () => {
        const anyTypeSelected = Object.values(exerciseTypes).some(v => v);
        if (!anyTypeSelected) {
            alert("Vui lòng chọn ít nhất một dạng bài để bắt đầu.");
            return;
        }
        
        if (!quizOperations.mul && !quizOperations.div) {
            alert("Vui lòng chọn ít nhất một phép tính (Nhân hoặc Chia).");
            return;
        }

        generateQuestions();
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setScore(0);
        setCurrentStreak(0);
        setQuizState('active');
    };

    const handleAnswerSubmit = (answer: string | number | boolean) => {
        const isCorrect = answer === questions[currentQuestionIndex].answer;
        
        if (isCorrect) {
            playSound(correctSound);
            setScore(prev => prev + 1);
            const newStreak = currentStreak + 1;
            const newTotal = totalCorrectAnswers + 1;
            setCurrentStreak(newStreak);
            setTotalCorrectAnswers(newTotal);

            // Check streak and total achievements
            if(newStreak === 5) unlockAchievement("STREAK_5");
            if(newStreak === 10) unlockAchievement("STREAK_10");
            if(newTotal === 25) unlockAchievement("TOTAL_CORRECT_25");
            if(newTotal === 50) unlockAchievement("TOTAL_CORRECT_50");

        } else {
            playSound(incorrectSound);
            setCurrentStreak(0);
        }
        
        setUserAnswers(prev => [...prev, answer]);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const finalScore = isCorrect ? score + 1 : score;
            if (finalScore === questions.length) {
                if(questions.length >= 20) unlockAchievement("PERFECT_SCORE_20");
                else if(questions.length >= 10) unlockAchievement("PERFECT_SCORE_10");
            }
            setQuizState('results');
        }
        
        if(quizInputRef.current) quizInputRef.current.value = '';
    };

    const handleNumericAnswerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userAnswer = quizInputRef.current?.value || '';
        if (userAnswer === '') {
            handleAnswerSubmit(''); // Handle empty submission
        } else {
            handleAnswerSubmit(parseInt(userAnswer, 10));
        }
    };

    const handleDualInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const val1 = parseInt(operand1Ref.current?.value || '0', 10);
        const val2 = parseInt(operand2Ref.current?.value || '0', 10);
        const question = questions[currentQuestionIndex];
        const target = question.answer as number;
        let isCorrect = false;

        if (question.display.includes('×')) {
            // Multiplication validation
            if (val1 * val2 === target && val1 > 0 && val2 > 0) isCorrect = true;
        } else {
            // Division validation
            if (val2 !== 0 && val1 / val2 === target) isCorrect = true;
        }

        // Manually call handleAnswerSubmit logic with specific override
        if (isCorrect) {
            playSound(correctSound);
            setScore(prev => prev + 1);
            const newStreak = currentStreak + 1;
            const newTotal = totalCorrectAnswers + 1;
            setCurrentStreak(newStreak);
            setTotalCorrectAnswers(newTotal);
             // Check streak and total achievements
            if(newStreak === 5) unlockAchievement("STREAK_5");
            if(newStreak === 10) unlockAchievement("STREAK_10");
            if(newTotal === 25) unlockAchievement("TOTAL_CORRECT_25");
            if(newTotal === 50) unlockAchievement("TOTAL_CORRECT_50");
        } else {
            playSound(incorrectSound);
            setCurrentStreak(0);
        }

        // Store user answer as a string representation
        const op = question.display.includes('×') ? '×' : ':';
        setUserAnswers(prev => [...prev, `${val1} ${op} ${val2}`]);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
             const finalScore = isCorrect ? score + 1 : score;
             if (finalScore === questions.length) {
                if(questions.length >= 20) unlockAchievement("PERFECT_SCORE_20");
                else if(questions.length >= 10) unlockAchievement("PERFECT_SCORE_10");
            }
            setQuizState('results');
        }

        // Clear inputs
        if (operand1Ref.current) operand1Ref.current.value = '';
        if (operand2Ref.current) operand2Ref.current.value = '';
    };


    const resetQuiz = () => {
      setQuizState('setup');
    };

    // --- TTS Functions ---
    const speakText = (text: string, tableId?: string, rowIndex?: number) => {
        if (!window.speechSynthesis) {
            alert("Rất tiếc, trình duyệt của bạn không hỗ trợ đọc văn bản.");
            return;
        }
        stopSpeech(); // Stop any current speech before starting new

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(v => v.voiceURI === speechSettings.voiceURI);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.lang = 'vi-VN';
        utterance.rate = speechSettings.rate;
        utterance.pitch = speechSettings.pitch;
        
        utterance.onstart = () => {
            if (tableId) {
                const identifier = tableId + (rowIndex !== undefined ? `-row-${rowIndex}` : '');
                setSpeakingIdentifier(identifier);
            }
        };

        utterance.onend = () => {
            setSpeakingIdentifier(null);
        };
        
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            // onend listener will handle resetting state
        }
    };

    // --- AI Assistant Integration ---
    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsThinking(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserInput(transcript);
            handleSendMessage(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsThinking(false);
            if (event.error === 'not-allowed') {
                alert("Vui lòng cho phép quyền sử dụng micro để sử dụng tính năng này.");
            }
        };

        recognition.onend = () => {
            setIsThinking(false);
        };

        recognition.start();
    };

    const handleSendMessage = async (text: string = userInput) => {
        if (!text.trim()) return;

        const newUserMsg: ChatMessage = { role: 'user', text };
        setChatMessages(prev => [...prev, newUserMsg]);
        setUserInput('');
        setIsThinking(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Build context string based on app state
            let context = "Thông tin người học: ";
            if (mode === 'tables') {
                if (showVisualization && selectedCalculation) {
                    context += `Đang xem bảng minh họa: ${selectedCalculation.num1} ${selectedCalculation.type === 'mul' ? 'nhân' : 'chia'} ${selectedCalculation.num2} = ${selectedCalculation.result}. `;
                } else {
                    context += `Đang ở chế độ học bảng. `;
                }
            } else if (mode === 'quiz' && quizState === 'active') {
                context += `Đang làm bài kiểm tra. Câu hiện tại: "${questions[currentQuestionIndex]?.display}". `;
            } else if (mode === 'achievements') {
                context += `Đang xem thành tích. Tổng số câu đúng: ${totalCorrectAnswers}. `;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: text }
                        ]
                    }
                ],
                config: {
                    systemInstruction: `Bạn là Trạng Tí, một trợ lý ảo vui tính, thông minh chuyên giúp trẻ em Việt Nam học toán (bảng cửu chương). 
                    Hãy trả lời ngắn gọn (dưới 30 từ), dễ hiểu, giọng điệu khích lệ và dùng emoji. 
                    Nếu bé đang làm bài kiểm tra, hãy gợi ý cách tính (ví dụ: mẹo ngón tay, cộng dồn) chứ ĐỪNG cho đáp án ngay trừ khi bé hỏi 2 lần.
                    Ngữ cảnh hiện tại: ${context}`,
                }
            });

            const aiResponseText = response.text || "Xin lỗi, mình chưa hiểu ý bạn.";
            setChatMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
            
            // Speak the response using TTS
            speakText(aiResponseText);

        } catch (error) {
            console.error("Gemini API Error:", error);
            setChatMessages(prev => [...prev, { role: 'model', text: "Ôi, mạng có vấn đề rồi. Bạn thử lại nhé!" }]);
        } finally {
            setIsThinking(false);
        }
    };

    
    const renderQuizQuestion = () => {
        if (!questions[currentQuestionIndex]) return null;
        const currentQuestionText = questions[currentQuestionIndex].display;
        const questionDisplay = currentQuestionText
            .replace(/\?/g, '<span class="text-indigo-500">?</span>')
            .replace('___', '<span class="text-indigo-500">___</span>');
        return (
            <div 
                className="block text-5xl font-bold mb-6"
                dangerouslySetInnerHTML={{ __html: questionDisplay }}
            />
        );
    };

    const renderQuizInput = () => {
      const question = questions[currentQuestionIndex];
      if (!question) return null;

      let inputComponent;

      // Robust 3D Button style class helper
      const btn3DClass = (bgColorClass: string, shadowColor: string) => 
        `w-24 h-20 text-4xl font-bold ${bgColorClass} text-white rounded-xl shadow-[0_8px_0_${shadowColor}] active:shadow-none active:translate-y-[8px] transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_0_${shadowColor}] transform`;

      switch (question.type) {
        case 'COMPARISON':
          inputComponent = (
            <div className="flex justify-center gap-6 mt-8">
              <button onClick={() => handleAnswerSubmit('<')} className={btn3DClass('bg-indigo-500', '#3730a3')}>&lt;</button>
              <button onClick={() => handleAnswerSubmit('=')} className={btn3DClass('bg-indigo-500', '#3730a3')}>=</button>
              <button onClick={() => handleAnswerSubmit('>')} className={btn3DClass('bg-indigo-500', '#3730a3')}>&gt;</button>
            </div>
          );
          break;
        case 'TRUE_FALSE':
          inputComponent = (
            <div className="flex justify-center gap-6 mt-8">
              <button 
                onClick={() => handleAnswerSubmit(true)} 
                className={`px-10 py-4 text-2xl font-bold text-white rounded-xl active:shadow-none active:translate-y-[8px] transition-all hover:translate-y-[-2px] transform`}
                style={{
                    backgroundColor: correctAnswerColor,
                    boxShadow: `0 8px 0 ${adjustBrightness(correctAnswerColor, -40)}`
                }}
              >
                  Đúng
              </button>
              <button 
                onClick={() => handleAnswerSubmit(false)} 
                className={`px-10 py-4 text-2xl font-bold text-white rounded-xl active:shadow-none active:translate-y-[8px] transition-all hover:translate-y-[-2px] transform`}
                style={{
                    backgroundColor: incorrectAnswerColor,
                    boxShadow: `0 8px 0 ${adjustBrightness(incorrectAnswerColor, -40)}`
                }}
              >
                  Sai
              </button>
            </div>
          );
          break;
        case 'MULTIPLE_CHOICE':
            inputComponent = (
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
                    {question.options?.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswerSubmit(opt)}
                            className="h-20 text-3xl font-bold bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl shadow-[0_8px_0_#c7d2fe] hover:shadow-[0_10px_0_#c7d2fe] hover:translate-y-[-2px] active:shadow-none active:translate-y-[8px] transition-all transform"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            );
            break;
        case 'FIND_OPERANDS':
           const opSymbol = question.display.includes('×') ? '×' : ':';
           inputComponent = (
             <form onSubmit={handleDualInputSubmit} className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-slate-700 mb-6">
                    <input ref={operand1Ref} type="number" className="w-24 text-center p-3 border-4 border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition shadow-inner" autoComplete="off" placeholder="?"/>
                    <span>{opSymbol}</span>
                    <input ref={operand2Ref} type="number" className="w-24 text-center p-3 border-4 border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition shadow-inner" autoComplete="off" placeholder="?"/>
                    <span>=</span>
                    <span className="text-indigo-600">{question.answer}</span>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-[0_8px_0_#15803d] hover:shadow-[0_10px_0_#15803d] hover:translate-y-[-2px] active:shadow-none active:translate-y-[8px] transition-all transform text-2xl">Trả lời</button>
             </form>
           );
           break;
        case 'CALCULATION':
        case 'MISSING_NUMBER':
        default:
          inputComponent = (
            <form onSubmit={handleNumericAnswerSubmit}>
              <input ref={quizInputRef} id="quiz-answer" type="number" className="w-full text-center text-4xl p-3 border-4 border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition shadow-inner" autoComplete="off" />
              <button type="submit" className="mt-8 w-full px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-[0_8px_0_#15803d] hover:shadow-[0_10px_0_#15803d] hover:translate-y-[-2px] active:shadow-none active:translate-y-[8px] transition-all transform text-2xl">Trả lời</button>
            </form>
          );
          break;
      }

      return (
        <>
            {inputComponent}
            <div className="mt-8 text-center h-12"> {/* Fixed height to prevent layout shift */}
                {!showCorrectAnswer && (
                    <button
                        onClick={() => setShowCorrectAnswer(true)}
                        className="text-sm text-slate-500 hover:text-indigo-600 transition-colors underline decoration-2 underline-offset-2"
                    >
                        Xem đáp án
                    </button>
                )}
            
                {showCorrectAnswer && (
                    <div 
                        className="mt-2 p-2 border-l-4 font-bold rounded animate-fade-in shadow-sm"
                        style={{
                            backgroundColor: `${correctAnswerColor}20`, // 20 is hex for ~12% opacity
                            borderColor: correctAnswerColor,
                            color: correctAnswerColor
                        }}
                    >
                        Đáp án đúng là: {
                            typeof question.answer === 'boolean' 
                            ? (question.answer ? 'Đúng' : 'Sai') 
                            : (question.type === 'FIND_OPERANDS' ? question.correctExpression : String(question.answer))
                        }
                    </div>
                )}
            </div>
        </>
      )
    };

    const toggleStar = (id: string) => {
        setClickedStars(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else {
                next.add(id);
                // Optional: Play a tiny pop sound
            }
            return next;
        });
    };

    // New Division Logic: "Chia nhóm" (Quotitive)
    const handleDistribute = () => {
        if (selectedCalculation && selectedCalculation.type === 'div') {
            // Step goes from 0 to result (number of groups)
            if (divisionStep < selectedCalculation.result) {
                setDivisionStep(prev => prev + 1);
            }
        }
    };

    const handleFastDistribute = () => {
        if (selectedCalculation && selectedCalculation.type === 'div') {
            setDivisionStep(selectedCalculation.result);
        }
    };

    const handleResetDistribution = () => {
        setDivisionStep(0);
    };

    const handleSwapCalculation = () => {
        if (selectedCalculation && selectedCalculation.type === 'mul') {
             // Swap num1 and num2
             setSelectedCalculation({
                 ...selectedCalculation,
                 num1: selectedCalculation.num2,
                 num2: selectedCalculation.num1
             });
             setClickedStars(new Set()); // Reset counted stars
        }
    };

    // Function to handle manual input changes in the visualization panel
    const updateVisualizationManual = (field: 'num1' | 'num2', value: number) => {
        if (!selectedCalculation) return;
        
        let newNum1 = selectedCalculation.num1;
        let newNum2 = selectedCalculation.num2;

        // Set mask to hidden (true) when numbers change manually so user has to guess result
        setVisualizationMask({ num1: true, num2: true, result: true });

        if (selectedCalculation.type === 'mul') {
            if (field === 'num1') newNum1 = value; // Table number
            else newNum2 = value; // Multiplier
            
            setSelectedCalculation({
                type: 'mul',
                num1: newNum1,
                num2: newNum2,
                result: newNum1 * newNum2
            });
        } else {
            // Div Logic
            let divisor = selectedCalculation.num2;
            let quotient = selectedCalculation.result;

            if (field === 'num1') divisor = value;
            else quotient = value;

            setSelectedCalculation({
                type: 'div',
                num1: divisor * quotient, // Calculate new dividend
                num2: divisor,
                result: quotient
            });
        }
    };

    const toggleMask = (part: keyof VisualizationMask) => {
        setVisualizationMask(prev => ({ ...prev, [part]: !prev[part] }));
    };

    const renderVisualization = () => {
        if (!selectedCalculation) return null;

        const { type, num1, num2, result } = selectedCalculation;
        let explanation: React.ReactNode = null;
        let visuals: React.ReactNode = null;
        const opSymbol = type === 'mul' ? '×' : ':';

        // Determine values for inputs based on operation type
        // Mul: Input A (num1), Input B (num2)
        // Div: Input Divisor (num2), Input Quotient (result) -> shows Dividend (num1)
        // const inputVal1 = type === 'mul' ? num1 : num2; // Table / Divisor (REMOVED control for this)
        const inputVal2 = type === 'mul' ? num2 : result; // Multiplier / Quotient

        if (type === 'mul') {
            // Multiplication: 2 x 3 -> "2 được lấy 3 lần" (2 taken 3 times) -> 3 groups of 2
            // num1: value per group, num2: number of groups
            explanation = (
                <div className="flex flex-col items-center gap-3">
                    <div className="text-2xl font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border-2 border-indigo-100 shadow-sm">
                        {num1} được lấy {num2} lần
                    </div>
                    <div className="text-lg font-mono text-slate-600">
                        {Array(num2).fill(num1).join(' + ')} = {result}
                    </div>
                    <button 
                        onClick={handleSwapCalculation}
                        className="px-4 py-2 text-sm font-bold bg-white rounded-xl text-indigo-600 shadow-[0_5px_0_#cbd5e1] hover:bg-slate-50 active:shadow-none active:translate-y-[5px] transition-all flex items-center gap-1 transform hover:-translate-y-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        Hoán đổi
                    </button>
                </div>
            );

            visuals = (
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {Array(num2).fill(0).map((_, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col items-center gap-1 group">
                            <span className="text-xs font-bold text-slate-400 uppercase">Lần {groupIndex + 1}</span>
                            <div className="flex flex-wrap justify-center gap-1 p-3 bg-amber-50 rounded-xl border-b-4 border-r-4 border-amber-200 cursor-pointer hover:bg-amber-100 hover:-translate-y-1 transition-all">
                                {Array(num1).fill(0).map((_, itemIndex) => {
                                    const starId = `${groupIndex}-${itemIndex}`;
                                    const isClicked = clickedStars.has(starId);
                                    return (
                                        <span 
                                            key={itemIndex} 
                                            onClick={() => toggleStar(starId)}
                                            className={`text-3xl select-none transition-transform active:scale-90 ${isClicked ? 'opacity-100 filter drop-shadow-md scale-110' : 'opacity-80'}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            ⭐
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            );

        } else {
            // Division: "Chia nhóm" (Quotitive)
            // 6 : 2 = 3
            // Total (num1) items. Make groups of (num2). Find how many groups (result).
            const totalItems = num1;
            const groupSize = num2;
            const totalGroups = result;
            
            const createdGroups = divisionStep;
            const remainingInPile = totalItems - (createdGroups * groupSize);
            const isFinished = remainingInPile === 0;

            let instructionText = "";
            if (createdGroups === 0) instructionText = `Có ${totalItems} ngôi sao. Cần chia thành các nhóm ${groupSize} sao.`;
            else if (!isFinished) instructionText = `Đã lấy ${createdGroups * groupSize} sao. Tiếp tục lấy ${groupSize} sao để tạo nhóm mới.`;
            else instructionText = `Đã chia hết! Ta được ${totalGroups} nhóm.`;

            explanation = (
                <div className="flex flex-col items-center gap-2 text-lg w-full">
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border-2 border-indigo-100 text-center shadow-sm">
                        <p className="text-indigo-800 font-medium">{instructionText}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                         <button 
                            onClick={handleDistribute}
                            disabled={isFinished}
                            className={`px-6 py-2 rounded-xl font-bold text-white active:shadow-none active:translate-y-[5px] transition-all flex items-center gap-2 transform
                                ${isFinished 
                                    ? 'bg-slate-300 shadow-none cursor-not-allowed text-slate-500 translate-y-[5px]' 
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_5px_0_#047857] hover:-translate-y-1'
                                }
                            `}
                        >
                            {isFinished ? 'Hoàn thành' : 'Chia nhóm'}
                            {!isFinished && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Step</span>}
                        </button>
                        
                        {!isFinished && (
                            <button 
                                onClick={handleFastDistribute}
                                className="px-5 py-2 rounded-xl font-bold text-indigo-600 bg-white shadow-[0_5px_0_#c7d2fe] hover:bg-indigo-50 active:shadow-none active:translate-y-[5px] transition-all transform hover:-translate-y-1"
                            >
                                Chia nhanh
                            </button>
                        )}

                        <button 
                            onClick={handleResetDistribution}
                            className="w-12 h-11 flex items-center justify-center rounded-xl bg-white shadow-[0_5px_0_#e2e8f0] text-slate-500 hover:text-red-500 hover:bg-red-50 active:shadow-none active:translate-y-[5px] transition-all transform hover:-translate-y-1"
                            title="Làm lại"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.05-2.066A7.001 7.001 0 0118 9c0 .35-.02.7-.058 1.042A6.002 6.002 0 0014 6a6.002 6.002 0 00-6-6c-.356 0-.706.03-1.048.087A1 1 0 014 2zm-1 9a1 1 0 011-1h2.101a7.002 7.002 0 01-2.066 11.05A7.001 7.001 0 012 11c0-.35.02-.7.058-1.042A6.002 6.002 0 006 14a6.002 6.002 0 006-6c-.356 0-.706.03-1.048-.087A1 1 0 019 7z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            );

            visuals = (
                <div className="flex flex-col w-full gap-6 mt-2">
                    {/* Area for groups being formed */}
                    <div className="flex flex-wrap justify-center gap-4 min-h-[110px] p-4 rounded-2xl bg-slate-50 border-b-4 border-r-4 border-slate-200 relative transition-all duration-500">
                        <span className="absolute top-2 left-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Khu vực nhóm ({createdGroups})</span>
                        
                        {createdGroups === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium pointer-events-none">
                                Các nhóm sẽ xuất hiện ở đây
                            </div>
                        )}

                        {Array(createdGroups).fill(0).map((_, idx) => (
                            <div key={`group-${idx}`} className="animate-fade-in flex flex-col items-center">
                                <div className="bg-white p-2 rounded-xl border-b-4 border-r-4 border-indigo-100 shadow-sm flex gap-1">
                                    {Array(groupSize).fill(0).map((__, sIdx) => (
                                        <span key={sIdx} className="text-2xl">⭐</span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 mt-1">Nhóm {idx + 1}</span>
                            </div>
                        ))}
                    </div>

                    {/* The Pile */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-[2px] w-12 bg-slate-200"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Kho tổng ({remainingInPile})</span>
                            <div className="h-[2px] w-12 bg-slate-200"></div>
                        </div>
                        <div className={`flex flex-wrap justify-center gap-1 content-start p-4 bg-slate-100 rounded-xl w-full max-w-md min-h-[80px] shadow-inner transition-all duration-500 ${remainingInPile === 0 ? 'opacity-50 grayscale' : ''}`}>
                            {Array(remainingInPile).fill(0).map((_, idx) => (
                                <span key={`pile-${idx}`} className="text-2xl animate-fade-in">⭐</span>
                            ))}
                            {remainingInPile === 0 && (
                                <span className="text-sm text-slate-400 w-full text-center py-2">Kho đã hết</span>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        const renderMaskableNumber = (value: number, maskKey: keyof VisualizationMask) => {
            const isHidden = visualizationMask[maskKey];
            return (
                <span 
                    onClick={() => toggleMask(maskKey)}
                    className="inline-block relative min-w-[1ch] text-center cursor-pointer transition-all hover:scale-105 hover:text-indigo-400 select-none"
                    title="Nhấp để ẩn/hiện"
                >
                    <span className={`transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>{value}</span>
                    <span className={`absolute inset-0 flex items-center justify-center text-indigo-300 transition-opacity duration-300 ${isHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>??</span>
                </span>
            );
        };

        return (
            <div className="w-full bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-t border-l border-white/80 border-b border-r border-white/40 p-6 animate-fade-in relative overflow-hidden h-full">
                {/* Close Button */}
                <button 
                    onClick={() => setShowVisualization(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-full transition-all z-20 shadow-[0_4px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] hover:-translate-y-1"
                    title="Ẩn bảng minh họa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-80"></div>
                <div className="flex flex-col items-center justify-center gap-6 w-full pt-2">
                    
                    {/* Interaction Toolbar: Select Numbers */}
                    <div className="w-full flex flex-wrap items-center justify-center gap-3 bg-white/40 p-3 rounded-2xl border border-white/50 shadow-inner">
                        
                        {/* Left Side: Shows Current Table (Static) */}
                        <div className="flex items-center gap-2 mr-4 opacity-80">
                             <label className="text-xs font-bold uppercase text-slate-400">{type === 'mul' ? 'Bảng' : 'Số chia'}</label>
                             <div className="flex items-center">
                                 <span className="w-12 h-10 flex items-center justify-center bg-white/80 rounded-xl border border-white shadow-sm font-bold text-slate-600 text-xl backdrop-blur-sm">{type === 'mul' ? num1 : num2}</span>
                             </div>
                        </div>

                        {/* Right Side: Multiplier Control (Dynamic) */}
                        <div className="flex items-center gap-2">
                             <label className="text-xs font-bold uppercase text-indigo-400">{type === 'mul' ? 'Lần' : 'Kết quả'}</label>
                             <div className="flex items-center gap-1">
                                 <button onClick={() => updateVisualizationManual('num2', Math.max(1, inputVal2 - 1))} className="w-10 h-10 rounded-lg bg-white text-slate-600 text-2xl font-bold shadow-[0_5px_0_#cbd5e1] active:shadow-none active:translate-y-[5px] transition-all flex items-center justify-center pb-1 hover:-translate-y-1">-</button>
                                 <span className="w-16 h-10 flex items-center justify-center bg-white/60 rounded-lg font-bold text-indigo-600 text-2xl mx-1">{inputVal2}</span>
                                 <button onClick={() => updateVisualizationManual('num2', Math.min(10, inputVal2 + 1))} className="w-10 h-10 rounded-lg bg-white text-slate-600 text-2xl font-bold shadow-[0_5px_0_#cbd5e1] active:shadow-none active:translate-y-[5px] transition-all flex items-center justify-center pb-1 hover:-translate-y-1">+</button>
                             </div>
                        </div>
                    </div>


                    {/* Top: Calculation Big Text */}
                    <div className="text-center py-2">
                        <div className="text-6xl font-black text-slate-800 whitespace-nowrap filter drop-shadow-md select-none tracking-tight" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.1)' }}>
                            {renderMaskableNumber(num1, 'num1')} <span className="text-indigo-500">{opSymbol}</span> {renderMaskableNumber(num2, 'num2')}
                             = <span className="text-indigo-600">{renderMaskableNumber(result, 'result')}</span>
                        </div>
                    </div>
                    
                    {/* Middle: Explanation & Controls */}
                    <div className="w-full max-w-4xl border-t border-b border-white/60 bg-white/20 py-4 rounded-xl">
                        {explanation}
                    </div>

                    {/* Bottom: Visuals */}
                    <div className="w-full flex justify-center">
                        {visuals}
                    </div>
                </div>
            </div>
        );
    };

    // Calculate how many tables are currently active
    const activeTableCount = multipliers.reduce((acc, num) => {
        return acc + (tableVisibility.mul[num] ? 1 : 0) + (tableVisibility.div[num] ? 1 : 0);
    }, 0);
    const isSingleView = activeTableCount === 1;
    
    // Create JSX for tables outside of return to use in different layouts
    const activeMulTablesJSX = multipliers.filter(m => tableVisibility.mul[m] && m >= startMultiplier && m <= endMultiplier).map((num) => (
        <MultiplicationTable 
        key={`mul-${num}`} 
        multiplier={num} 
        titleColor={titleColor}
        resultColor={resultColor}
        rowSpacing={rowSpacing}
        cardBgColor={cardBgColor}
        hideAllButtonColor={hideAllButtonColor}
        showAllButtonColor={showAllButtonColor}
        speakText={speakText}
        stopSpeech={stopSpeech}
        speakingIdentifier={speakingIdentifier}
        />
    ));

    const activeDivTablesJSX = multipliers.filter(m => tableVisibility.div[m] && m >= startMultiplier && m <= endMultiplier).map((num) => (
        <DivisionTable 
        key={`div-${num}`} 
        divisor={num} 
        titleColor="#db2777" // Hardcoded to Pink-600 to match selection buttons
        resultColor={resultColor}
        rowSpacing={rowSpacing}
        cardBgColor={cardBgColor}
        hideAllButtonColor={hideAllButtonColor}
        showAllButtonColor={showAllButtonColor}
        speakText={speakText}
        stopSpeech={stopSpeech}
        speakingIdentifier={speakingIdentifier}
        />
    ));
    
    const allActiveTables = [...activeMulTablesJSX, ...activeDivTablesJSX];
    const showSingleViewLayout = isSingleView && showVisualization && allActiveTables.length === 1;

  return (
    <div 
        className={`min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 transition-colors duration-500 ${isFullScreen ? 'p-2' : 'p-2 sm:p-4'}`}
        style={{ fontFamily: font }}
    >
      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_10px_20px_rgba(79,70,229,0.4)] z-50 flex items-center justify-center text-white text-3xl hover:scale-110 transition-transform border-4 border-white animate-bounce"
        title="Trợ lý Trạng Tí"
      >
        🤖
      </button>

      {/* AI Assistant Chat Window */}
      {isAssistantOpen && (
          <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 z-50 flex flex-col overflow-hidden animate-scale-in">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center">
                  <h3 className="text-white font-bold flex items-center gap-2">
                      🤖 Trợ Lý Trạng Tí
                  </h3>
                  <button onClick={() => setIsAssistantOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white shadow-sm text-slate-700 rounded-tl-none border border-slate-100'}`}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
                  {isThinking && (
                      <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                              <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                              </div>
                          </div>
                      </div>
                  )}
                  <div ref={chatEndRef} />
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                  <button 
                    onClick={startListening}
                    className={`p-2 rounded-full transition-colors ${isThinking ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'}`}
                    title="Nói để hỏi"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </button>
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Hỏi Trạng Tí..."
                    className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-[0_4px_0_#3730a3] active:shadow-none active:translate-y-[4px]"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </button>
              </div>
          </div>
      )}

      {/* Achievement Unlocked Toast */}
      {recentlyUnlocked && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] z-50 animate-fade-in-out border-b-4 border-green-700">
          <p className="font-bold text-lg">✨ Thành Tích Mới! ✨</p>
          <p>{achievements[recentlyUnlocked].name}</p>
        </div>
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" onClick={(e) => { if(e.target === e.currentTarget) setIsHelpOpen(false) }}>
          <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-2xl w-full border border-white relative max-h-[90vh] overflow-y-auto">
             <button 
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-full transition-all shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_6px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] hover:-translate-y-1"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>

             <h3 className="font-black text-indigo-700 mb-6 flex items-center gap-3 text-2xl md:text-3xl border-b border-slate-200 pb-4">
                <span className="text-4xl">📖</span> 
                Hướng Dẫn Sử Dụng
             </h3>

             <div className="space-y-8 text-slate-700">
                
                {/* Section 1: Introduction */}
                <div>
                    <p className="mb-4 font-medium">Chào mừng bạn đến với ứng dụng <strong className="text-indigo-600">Bảng Nhân Chia</strong>! Đây là ứng dụng dùng cho thầy cô giảng dạy và cho các em học sinh luyện tập một cách vui vẻ, trực quan và hiệu quả.</p>
                </div>

                {/* Section 2: Learning Tables */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-800 text-lg mb-2 flex items-center gap-2">📚 Chế độ Học Bảng</h4>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong className="text-slate-900">Chọn bảng:</strong> Sử dụng thanh menu bên phải để chọn bảng nhân hoặc chia muốn học.</li>
                        <li><strong className="text-slate-900">Đọc phép tính:</strong> Nhấp chuột vào bất kỳ dòng phép tính nào để nghe máy đọc to.</li>
                        <li><strong className="text-slate-900">Học thuộc lòng:</strong> Nhấp vào các con số (thừa số hoặc kết quả) để ẩn chúng đi (hiện dấu ??) và tự đoán, sau đó nhấp lại để xem đáp án.</li>
                        <li><strong className="text-slate-900">Minh họa trực quan:</strong> Bấm nút <span className="font-bold text-indigo-600 px-2 py-0.5 bg-white rounded border border-indigo-200 text-xs">💡 Hiện Minh Họa</span> để xem hình ảnh ngôi sao tương ứng với phép tính.</li>
                    </ul>
                </div>

                {/* Section 3: Visualization */}
                <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                    <h4 className="font-bold text-pink-800 text-lg mb-2 flex items-center gap-2">🎨 Cửa sổ Minh Họa</h4>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong className="text-slate-900">Phép nhân:</strong> Hiển thị các nhóm sao để hiểu khái niệm "được lấy n lần". Bạn có thể bấm nút "Đổi chỗ" để thấy tính chất giao hoán.</li>
                        <li><strong className="text-slate-900">Phép chia:</strong> Sử dụng tính năng "Chia nhóm" để xem quá trình chia các ngôi sao từ kho tổng vào các nhóm nhỏ.</li>
                        <li><strong className="text-slate-900">Tương tác:</strong> Bấm nút <span className="font-bold bg-white px-1 rounded border shadow-sm text-xs">+</span> hoặc <span className="font-bold bg-white px-1 rounded border shadow-sm text-xs">-</span> để thay đổi phép tính.</li>
                    </ul>
                </div>

                {/* Section 4: Quiz Mode */}
                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                    <h4 className="font-bold text-green-800 text-lg mb-2 flex items-center gap-2">📝 Chế độ Luyện Tập</h4>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong className="text-slate-900">Cài đặt bài thi:</strong> Trước khi bắt đầu, hãy chọn phép tính (Nhân/Chia), dạng bài (Trắc nghiệm, Điền số, So sánh...) và độ khó phù hợp.</li>
                        <li><strong className="text-slate-900">Phạm vi kiến thức:</strong> Bạn có thể giới hạn câu hỏi trong phạm vi các bảng đã học (Ví dụ: chỉ bảng 2 đến bảng 5) trong phần Cài đặt ⚙️.</li>
                        <li><strong className="text-slate-900">Âm thanh vui nhộn:</strong> Bạn có thể tải lên âm thanh giọng nói của chính mình (hoặc tiếng vỗ tay) để phát khi trả lời Đúng/Sai.</li>
                    </ul>
                </div>

                <div className="text-sm text-slate-500 italic text-center pt-4 border-t border-slate-100">
                    Chúc các bé học tập thật tốt và đạt nhiều thành tích cao! 🚀
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-lg w-full border border-white relative max-h-[90vh] overflow-y-auto">
             <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-full transition-all shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_6px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] hover:-translate-y-1"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
             
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-2xl border-b border-slate-200 pb-4">
                <span className="text-3xl">⚙️</span> 
                {mode === 'tables' && "Cài Đặt Học Bảng"}
                {mode === 'quiz' && "Cài Đặt Luyện Tập"}
                {mode === 'achievements' && "Cài Đặt Thành Tích"}
             </h3>

             <div className="space-y-6">
                {/* Common Settings (Voice & Theme) */}
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Giao diện</label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.values(themes).map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => handleThemeSelect(theme)}
                                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border transform ${
                                    font === theme.font 
                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-[0_4px_0_#818cf8] active:shadow-none active:translate-y-[4px] translate-y-0' 
                                    : 'border-slate-200 bg-white text-slate-500 shadow-[0_4px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] translate-y-0 hover:-translate-y-1'
                                }`}
                            >
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>

                 {mode === 'tables' && (
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Giọng đọc</label>
                    <select 
                        value={speechSettings.voiceURI} 
                        onChange={(e) => setSpeechSettings(prev => ({...prev, voiceURI: e.target.value}))}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                    >
                        {voices.length > 0 ? (
                            voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)
                        ) : (
                            <option value="">Mặc định</option>
                        )}
                    </select>
                </div>
                 )}

                <div className="h-px bg-slate-200 my-2"></div>

                {/* TABLES Specific Settings */}
                {mode === 'tables' && (
                    <>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <label className="font-bold text-slate-700">Minh họa phép tính</label>
                            <div 
                                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors shadow-inner ${showVisualization ? 'bg-green-500' : 'bg-slate-300'}`}
                                onClick={toggleVisualizationMode}
                            >
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${showVisualization ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Màu nền bảng</label>
                             <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                 <div className="relative overflow-hidden w-12 h-12 rounded-full border-2 border-slate-200 shadow-sm">
                                    <input 
                                        type="color" 
                                        value={cardBgColor} 
                                        onChange={(e) => setCardBgColor(e.target.value)}
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 border-0 cursor-pointer"
                                    />
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-sm font-bold text-slate-700">Tùy chỉnh màu</span>
                                     <span className="text-xs text-slate-500 font-mono uppercase">{cardBgColor}</span>
                                 </div>
                                 <button 
                                    onClick={() => setCardBgColor('#ffffff')}
                                    className="ml-auto px-3 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                 >
                                    Mặc định
                                 </button>
                             </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Khoảng cách dòng</label>
                             <input 
                                type="range" 
                                min="1" 
                                max="6" 
                                value={rowSpacing} 
                                onChange={(e) => setRowSpacing(parseInt(e.target.value))}
                                className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                             />
                        </div>
                    </>
                )}

                {/* QUIZ Specific Settings */}
                {mode === 'quiz' && (
                     <>
                         <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Phạm vi kiến thức (Bảng)</label>
                            <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <div className="flex-1">
                                    <span className="block text-xs font-bold text-slate-500 mb-1">Từ bảng</span>
                                    <select 
                                        value={startMultiplier} 
                                        onChange={handleStartChange} 
                                        className="w-full p-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                    >
                                        {multipliers.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center text-slate-300 font-bold text-xl pt-4">➜</div>
                                <div className="flex-1">
                                    <span className="block text-xs font-bold text-slate-500 mb-1">Đến bảng</span>
                                    <select 
                                        value={endMultiplier} 
                                        onChange={handleEndChange} 
                                        className="w-full p-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                    >
                                        {multipliers.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Âm thanh phản hồi</label>
                             <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <span className="block text-xs font-bold text-green-600 mb-1">Khi Trả Lời Đúng</span>
                                        <div className="flex gap-2">
                                            <select 
                                                value={correctSound} 
                                                onChange={(e) => {
                                                    setCorrectSound(e.target.value);
                                                    playSound(e.target.value);
                                                }} 
                                                className="w-full p-2 rounded-xl border border-slate-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                                            >
                                                {CORRECT_SOUND_OPTIONS.map(opt => (
                                                    <option key={opt.name} value={opt.value}>{opt.name}</option>
                                                ))}
                                                {savedCustomCorrectSound && (
                                                    <option value={savedCustomCorrectSound}>♫ File của tôi (Đã lưu)</option>
                                                )}
                                                {(!CORRECT_SOUND_OPTIONS.some(opt => opt.value === correctSound) && correctSound !== savedCustomCorrectSound) && (
                                                    <option value={correctSound}>♫ Audio Tùy Chỉnh (Phiên này)</option>
                                                )}
                                            </select>
                                            <button onClick={() => playSound(correctSound)} className="p-2 bg-white border rounded-xl hover:bg-green-50 text-green-600">🔊</button>
                                        </div>
                                        <label className="block mt-2 text-xs text-slate-400 cursor-pointer hover:text-indigo-500">
                                            <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, 'correct')} />
                                            [Tải file lên]
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <span className="block text-xs font-bold text-red-600 mb-1">Khi Trả Lời Sai</span>
                                         <div className="flex gap-2">
                                            <select 
                                                value={incorrectSound} 
                                                onChange={(e) => {
                                                    setIncorrectSound(e.target.value);
                                                    playSound(e.target.value);
                                                }} 
                                                className="w-full p-2 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                                            >
                                                {INCORRECT_SOUND_OPTIONS.map(opt => (
                                                    <option key={opt.name} value={opt.value}>{opt.name}</option>
                                                ))}
                                                {savedCustomIncorrectSound && (
                                                    <option value={savedCustomIncorrectSound}>♫ File của tôi (Đã lưu)</option>
                                                )}
                                                {(!INCORRECT_SOUND_OPTIONS.some(opt => opt.value === incorrectSound) && incorrectSound !== savedCustomIncorrectSound) && (
                                                    <option value={incorrectSound}>♫ Audio Tùy Chỉnh (Phiên này)</option>
                                                )}
                                            </select>
                                            <button onClick={() => playSound(incorrectSound)} className="p-2 bg-white border rounded-xl hover:bg-red-50 text-red-600">🔊</button>
                                        </div>
                                         <label className="block mt-2 text-xs text-slate-400 cursor-pointer hover:text-indigo-500">
                                            <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, 'incorrect')} />
                                            [Tải file lên]
                                        </label>
                                    </div>
                                </div>
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Màu nền thẻ câu hỏi</label>
                             <div className="flex gap-2 flex-wrap">
                                 {['#ffffff', '#f0fdf4', '#f0f9ff', '#fffbeb', '#fef2f2'].map(c => (
                                     <button
                                        key={c}
                                        onClick={() => setQuizCardBgColor(c)}
                                        className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 active:scale-90 ${quizCardBgColor === c ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}
                                        style={{ backgroundColor: c }}
                                     />
                                 ))}
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Màu trạng thái Đúng</label>
                                 <div className="flex gap-2 flex-wrap">
                                     {['#22c55e', '#10b981', '#0ea5e9', '#84cc16'].map(c => (
                                         <button
                                            key={c}
                                            onClick={() => setCorrectAnswerColor(c)}
                                            className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 active:scale-90 ${correctAnswerColor === c ? 'border-slate-500 ring-2 ring-slate-200' : 'border-slate-200'}`}
                                            style={{ backgroundColor: c }}
                                         />
                                     ))}
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Màu trạng thái Sai</label>
                                 <div className="flex gap-2 flex-wrap">
                                     {['#ef4444', '#f97316', '#e11d48', '#7c2d12'].map(c => (
                                         <button
                                            key={c}
                                            onClick={() => setIncorrectAnswerColor(c)}
                                            className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 active:scale-90 ${incorrectAnswerColor === c ? 'border-slate-500 ring-2 ring-slate-200' : 'border-slate-200'}`}
                                            style={{ backgroundColor: c }}
                                         />
                                     ))}
                                 </div>
                             </div>
                         </div>
                     </>
                )}

                {/* ACHIEVEMENTS Specific Settings */}
                {mode === 'achievements' && (
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <h4 className="text-red-800 font-bold mb-2">Vùng nguy hiểm</h4>
                        <p className="text-xs text-red-600 mb-4">Xóa toàn bộ tiến trình học tập, điểm số và huy hiệu.</p>
                        <button 
                            onClick={handleResetData}
                            className="w-full py-3 bg-red-500 text-white font-bold rounded-xl shadow-[0_6px_0_#991b1b] active:shadow-none active:translate-y-[6px] transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_0_#991b1b]"
                        >
                            Đặt lại dữ liệu
                        </button>
                    </div>
                )}

             </div>
          </div>
        </div>
      )}

      <div className={`w-full mx-auto grid grid-cols-1 gap-4 ${isFullScreen ? 'max-w-[99.5%] lg:grid-cols-4' : 'max-w-[98%] lg:grid-cols-4'}`}>
        <div className={`bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-t border-l border-white/80 border-b border-r border-white/40 p-6 flex flex-col min-h-[90vh] ${mode === 'tables' ? 'lg:col-span-3' : 'lg:col-span-4'} transition-all duration-500`}>
          
          <header className="text-center mb-6 relative py-6">
             <div className="absolute top-0 right-0 flex gap-2">
                <button 
                    onClick={() => setIsHelpOpen(true)}
                    className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-full transition-all shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_6px_0_#cbd5e1] hover:-translate-y-1 active:shadow-none active:translate-y-[4px]"
                    title="Hướng dẫn sử dụng"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-full transition-all shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_6px_0_#cbd5e1] hover:-translate-y-1 active:shadow-none active:translate-y-[4px]"
                    title="Cài đặt"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <button 
                    onClick={toggleFullScreen}
                    className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-full transition-all shadow-[0_4px_0_#cbd5e1] hover:shadow-[0_6px_0_#cbd5e1] hover:-translate-y-1 active:shadow-none active:translate-y-[4px]"
                    title={isFullScreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                >
                    {isFullScreen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l5 5m0 0v-4m0 4h-4 M20 4l-5 5m0 0v-4m0 4h4 M4 20l5-5m0 0v4m0-4h-4 M20 20l-5-5m0 0v4m0-4h4" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    )}
                </button>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 mb-4 tracking-tight leading-tight pb-2 filter drop-shadow-sm"
                style={{ filter: 'drop-shadow(0 4px 0px rgba(0,0,0,0.15))' }}
            >
              Bảng Nhân Chia
            </h1>
            <p className="text-slate-500 font-bold text-lg md:text-xl bg-white/40 inline-block px-4 py-1 rounded-full border border-white/50 shadow-sm">
              Tác giả: Nguyễn Hoàng Em - SĐT: 0933474843
            </p>
          </header>

          <div className="flex justify-center space-x-2 md:space-x-4 mb-8 p-2 bg-white/50 rounded-2xl backdrop-blur-md inline-flex mx-auto shadow-inner border border-white/40">
            <button
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 transform border-b-0 ${
                mode === 'tables'
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_6px_0_#312e81] hover:shadow-[0_8px_0_#312e81] hover:-translate-y-1 active:shadow-none active:translate-y-[6px]'
                  : 'text-slate-600 bg-white hover:bg-slate-50 shadow-[0_6px_0_#cbd5e1] hover:shadow-[0_8px_0_#cbd5e1] hover:-translate-y-1 active:shadow-none active:translate-y-[6px]'
              }`}
              onClick={() => setMode('tables')}
            >
              <span>📚</span> Học Bảng
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 transform border-b-0 ${
                mode === 'quiz'
                  ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-[0_6px_0_#be185d] hover:shadow-[0_8px_0_#be185d] hover:-translate-y-1 active:shadow-none active:translate-y-[6px]'
                  : 'text-slate-600 bg-white hover:bg-slate-50 shadow-[0_6px_0_#cbd5e1] hover:shadow-[0_8px_0_#cbd5e1] hover:-translate-y-1 active:shadow-none active:translate-y-[6px]'
              }`}
              onClick={() => setMode('quiz')}
            >
              <span>📝</span> Luyện Tập
            </button>
             <button
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 transform border-b-0 ${
                mode === 'achievements'
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-[0_6px_0_#b45309] hover:shadow-[0_8px_0_#b45309] hover:-translate-y-1 active:shadow-none active:translate-y-[6px]'
                  : 'text-slate-600 bg-white hover:bg-slate-50 shadow-[0_6px_0_#cbd5e1] hover:shadow-[0_8px_0_#cbd5e1] hover:-translate-y-1 active:shadow-none active:translate-y-[6px]'
              }`}
              onClick={() => setMode('achievements')}
            >
              <span>🏆</span> Thành Tích
            </button>
          </div>

          {/* --- TABLES MODE --- */}
          {mode === 'tables' && (
            <div className="w-full">

              {!showVisualization && (
                  <div className="flex justify-end mb-6 animate-fade-in">
                    <button 
                        onClick={toggleVisualizationMode}
                        className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm text-indigo-600 font-bold rounded-2xl border border-white shadow-[0_6px_0_#cbd5e1] active:shadow-none active:translate-y-[6px] transition-all transform hover:-translate-y-1"
                    >
                        <span className="text-xl">💡</span> Hiện Minh Họa
                    </button>
                  </div>
              )}
              
              {showSingleViewLayout ? (
                   // Layout when only one table is visible and visualization is active:
                   // Display side-by-side on larger screens (Table Left, Visualization Right)
                   <div className="flex flex-col xl:flex-row gap-6 items-start h-full">
                        <div className="w-full xl:w-1/3 order-2 xl:order-1">
                            {allActiveTables[0]}
                        </div>
                        <div className="w-full xl:w-2/3 order-1 xl:order-2 sticky top-4">
                            {renderVisualization()}
                        </div>
                   </div>
              ) : (
                  // Standard layout for multiple tables or when visualization is hidden
                  <>
                    {/* Visualization Panel (Top) */}
                    {showVisualization && (
                        <div className="mb-8 w-full">
                        {renderVisualization()}
                        </div>
                    )}

                    {isSingleView ? (
                         <div className="flex justify-center w-full animate-fade-in">
                             <div className="w-full max-w-2xl transition-all duration-500 transform">
                                {allActiveTables}
                             </div>
                         </div>
                    ) : (
                        <div className={`grid gap-6 ${isFullScreen ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
                            {allActiveTables}
                        </div>
                    )}
                  </>
              )}
              
              {activeTableCount === 0 && (
                  <div className="text-center py-20 text-slate-400 italic">
                      Chọn bảng nhân hoặc chia từ menu bên phải để bắt đầu học nhé!
                  </div>
              )}
            </div>
          )}

          {/* --- QUIZ MODE --- */}
          {mode === 'quiz' && (
             <div className={`mx-auto w-full flex-grow flex flex-col justify-center ${isFullScreen ? 'max-w-5xl' : 'max-w-3xl'}`}>
              {quizState === 'setup' && (
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-t border-l border-white/80 border-b border-r border-white/40 animate-fade-in">
                  <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Cài Đặt Bài Luyện Tập</h2>
                  
                  <div className="space-y-6">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 text-lg">Chọn phép tính:</label>
                        <div className="flex gap-4 mb-4">
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all ${quizOperations.mul ? 'border-indigo-400 bg-indigo-50/50 shadow-inner' : 'border-slate-200 bg-white/50 hover:bg-white'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={quizOperations.mul} 
                                    onChange={() => setQuizOperations(prev => ({...prev, mul: !prev.mul}))}
                                    className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-indigo-500 border-slate-300"
                                />
                                <span className="font-medium text-slate-700">Phép Nhân (×)</span>
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all ${quizOperations.div ? 'border-pink-400 bg-pink-50/50 shadow-inner' : 'border-slate-200 bg-white/50 hover:bg-white'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={quizOperations.div} 
                                    onChange={() => setQuizOperations(prev => ({...prev, div: !prev.div}))}
                                    className="w-5 h-5 text-pink-600 rounded-lg focus:ring-pink-500 border-slate-300"
                                />
                                <span className="font-medium text-slate-700">Phép Chia (:)</span>
                            </label>
                        </div>

                        <label className="block text-slate-700 font-bold mb-2 text-lg">Chọn dạng bài tập:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(Object.keys(exerciseTypesConfig) as Array<keyof ExerciseTypes>).map(type => (
                                <label key={type} className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all ${exerciseTypes[type] ? 'border-indigo-400 bg-indigo-50/50 shadow-inner' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={exerciseTypes[type]} 
                                        onChange={() => setExerciseTypes(prev => ({...prev, [type]: !prev[type]}))}
                                        className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-indigo-500 mr-3 border-slate-300"
                                    />
                                    <span className="font-medium text-slate-700">{exerciseTypeLabels[type]}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-slate-700 font-bold mb-2">Số lượng câu hỏi:</label>
                          <select 
                            value={numQuestions} 
                            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                            className="w-full p-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition bg-white/80 text-lg shadow-sm"
                          >
                            <option value="5">5 câu</option>
                            <option value="10">10 câu</option>
                            <option value="20">20 câu</option>
                            <option value="50">50 câu</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-2">Độ khó:</label>
                          <select 
                            value={difficulty} 
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                            className="w-full p-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition bg-white/80 text-lg shadow-sm"
                          >
                            <option value="easy">Dễ (nhân đến 5)</option>
                            <option value="medium">Trung bình (nhân đến 10)</option>
                            <option value="hard">Khó (nhân đến 12)</option>
                          </select>
                        </div>
                    </div>

                    <button 
                      onClick={startQuiz}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-[0_8px_0_#4338ca] active:shadow-none active:translate-y-[8px] transition-all mt-4 hover:translate-y-[-2px] hover:shadow-[0_10px_0_#4338ca] transform"
                    >
                      Bắt Đầu Làm Bài
                    </button>
                  </div>
                </div>
              )}

              {quizState === 'active' && (
                <div 
                    className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] text-center relative border-t border-l border-white/80 border-b border-r border-white/40"
                    style={{ backgroundColor: quizCardBgColor ? `${quizCardBgColor}CC` : undefined }}
                >
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-full mb-8 overflow-hidden shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mb-8 text-slate-500 font-bold text-lg">
                    <span>Câu {currentQuestionIndex + 1} / {questions.length}</span>
                    <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl shadow-sm border border-indigo-100">Điểm: {score}</span>
                  </div>

                  {renderQuizQuestion()}
                  {renderQuizInput()}

                  <button onClick={resetQuiz} className="mt-12 text-slate-400 hover:text-red-500 font-semibold underline decoration-2 underline-offset-2 hover:decoration-red-300 transition-all">
                    Thoát bài kiểm tra
                  </button>
                </div>
              )}

              {quizState === 'results' && (
                <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] text-center animate-scale-in border-t border-l border-white/80 border-b border-r border-white/40">
                  <div className="mb-6 text-7xl animate-bounce drop-shadow-xl">
                    {score === questions.length ? '🏆' : score > questions.length / 2 ? '🎉' : '💪'}
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 mb-4">Kết Quả</h2>
                  <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-purple-600 mb-2 drop-shadow-sm">{animatedScore} <span className="text-3xl text-slate-400 font-bold">/ {questions.length}</span></div>
                  <p className="text-slate-500 text-xl mb-8 font-medium">
                    {score === questions.length 
                        ? "Tuyệt vời! Bạn là thiên tài toán học!" 
                        : score > questions.length / 2 
                        ? "Làm tốt lắm! Cố gắng thêm chút nữa nhé." 
                        : "Đừng nản lòng, hãy luyện tập thêm!"}
                  </p>
                  
                  <div className="space-y-3">
                     <button 
                        onClick={startQuiz}
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-[0_8px_0_#4338ca] active:shadow-none active:translate-y-[8px] transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_0_#4338ca] transform"
                      >
                        Làm Bài Khác
                      </button>
                      <button 
                        onClick={() => setQuizState('setup')}
                        className="w-full py-4 bg-white text-indigo-600 border-2 border-indigo-100 text-xl font-bold rounded-2xl shadow-[0_6px_0_#e0e7ff] active:shadow-none active:translate-y-[6px] transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_0_#e0e7ff] transform"
                      >
                        Cài Đặt Lại
                      </button>
                  </div>
                </div>
              )}
            </div>
          )}

           {/* --- ACHIEVEMENTS MODE --- */}
           {mode === 'achievements' && (
               <div className="w-full">
                    <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-t border-l border-white/80 border-b border-r border-white/40">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Bảng Thành Tích</h2>
                        <p className="text-slate-500 mb-8">Thu thập huy hiệu bằng cách chăm chỉ luyện tập!</p>
                        
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isFullScreen ? 'xl:grid-cols-4' : ''} gap-6`}>
                            {(Object.entries(achievements) as [AchievementId, typeof achievements[AchievementId]][]).map(([id, achievement]) => {
                                const isUnlocked = unlockedAchievements.has(id);
                                return (
                                    <div key={id} className={`relative p-6 rounded-3xl border transition-all duration-300 ${isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' : 'bg-slate-50 border-slate-100 grayscale opacity-60'}`}>
                                        <div className="text-5xl mb-4 filter drop-shadow-md">{achievement.icon}</div>
                                        <h3 className={`font-bold text-xl mb-2 ${isUnlocked ? 'text-yellow-800' : 'text-slate-500'}`}>{achievement.name}</h3>
                                        <p className="text-sm text-slate-600 font-medium">{achievement.description}</p>
                                        {isUnlocked && <div className="absolute top-4 right-4 text-yellow-500 text-xl bg-white rounded-full p-1 shadow-sm">✓</div>}
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div className="mt-10 p-6 bg-indigo-50/80 rounded-3xl border border-indigo-100 flex items-center justify-between shadow-inner">
                            <div>
                                <p className="text-indigo-900 font-bold text-lg">Tổng số câu trả lời đúng</p>
                                <p className="text-indigo-600 text-sm">Tiếp tục cố gắng nhé!</p>
                            </div>
                            <div className="text-5xl font-black text-indigo-600 drop-shadow-sm">{totalCorrectAnswers}</div>
                        </div>
                    </div>
               </div>
           )}

        </div>

        {/* --- SIDEBAR (Table Selection Only) --- */}
        {mode === 'tables' && (
            <div className="space-y-6 lg:col-span-1">
                <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.15)] border-t border-l border-white/80 border-b border-r border-white/40">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                        <span className="text-xl">🔢</span> Chọn Bảng
                    </h3>
                    
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider pl-1">Bảng Nhân</p>
                        <div className="grid grid-cols-4 gap-2">
                            {multipliers.map(num => (
                                <button
                                    key={`sel-mul-${num}`}
                                    onClick={() => handleTableVisibilityChange('mul', num)}
                                    className={`h-12 rounded-2xl font-bold text-lg transition-all transform border-2 ${
                                        tableVisibility.mul[num] 
                                        ? 'bg-indigo-500 border-indigo-600 text-white shadow-[0_5px_0_#312e81] active:shadow-none active:translate-y-[5px] translate-y-0' 
                                        : 'bg-white border-slate-200 text-slate-400 shadow-[0_5px_0_#cbd5e1] hover:-translate-y-1 hover:shadow-[0_7px_0_#cbd5e1] active:shadow-none active:translate-y-[5px] translate-y-0'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => showAllTables('mul')} className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl shadow-[0_4px_0_#c7d2fe] active:shadow-none active:translate-y-[4px] transition-all transform hover:-translate-y-0.5">Hiện hết</button>
                            <button onClick={() => hideAllTables('mul')} className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl shadow-[0_4px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all transform hover:-translate-y-0.5">Ẩn hết</button>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider pl-1">Bảng Chia</p>
                        <div className="grid grid-cols-4 gap-2">
                            {multipliers.map(num => (
                                <button
                                    key={`sel-div-${num}`}
                                    onClick={() => handleTableVisibilityChange('div', num)}
                                    className={`h-12 rounded-2xl font-bold text-lg transition-all transform border-2 ${
                                        tableVisibility.div[num] 
                                        ? 'bg-pink-500 border-pink-600 text-white shadow-[0_5px_0_#9d174d] active:shadow-none active:translate-y-[5px] translate-y-0' 
                                        : 'bg-white border-slate-200 text-slate-400 shadow-[0_5px_0_#cbd5e1] hover:-translate-y-1 hover:shadow-[0_7px_0_#cbd5e1] active:shadow-none active:translate-y-[5px] translate-y-0'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                         <div className="flex gap-2 mt-3">
                            <button onClick={() => showAllTables('div')} className="flex-1 py-2 text-xs font-bold text-pink-600 bg-pink-50 rounded-xl shadow-[0_4px_0_#fbcfe8] active:shadow-none active:translate-y-[4px] transition-all transform hover:-translate-y-0.5">Hiện hết</button>
                            <button onClick={() => hideAllTables('div')} className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl shadow-[0_4px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all transform hover:-translate-y-0.5">Ẩn hết</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
