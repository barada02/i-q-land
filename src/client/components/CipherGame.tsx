import { useState, useEffect } from 'react';
import { generatePuzzle, getDailySeed, getTodayString, Puzzle } from '../utils/cipherUtils';

export const CipherGame = () => {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // New State for Modes
    const [gameMode, setGameMode] = useState<'daily' | 'practice'>('daily');
    const [dailyCompleted, setDailyCompleted] = useState(false);

    useEffect(() => {
        checkDailyStatus();
    }, []);

    const checkDailyStatus = () => {
        const today = getTodayString();
        const lastSolved = localStorage.getItem('daily_solved_date');

        if (lastSolved === today) {
            setDailyCompleted(true);
            setGameMode('practice'); // Auto-switch to practice if daily is done
            startPracticeLevel();
        } else {
            setDailyCompleted(false);
            setGameMode('daily');
            startDailyLevel();
        }
    };

    const startDailyLevel = () => {
        const seed = getDailySeed();
        setPuzzle(generatePuzzle(seed));
        setUserAnswer('');
        setSuccess(false);
        setShowExplanation(false);
        setLevel(1); // Daily is just 1 level for now
    };

    const startPracticeLevel = () => {
        setPuzzle(generatePuzzle()); // No seed = random
        setUserAnswer('');
        setSuccess(false);
        setShowExplanation(false);
    };

    const handleDailyComplete = () => {
        const today = getTodayString();
        localStorage.setItem('daily_solved_date', today);
        setDailyCompleted(true);
        // Maybe show a "Daily Complete!" modal here?
        // For now, let's switch to practice after a delay
        setTimeout(() => {
            setGameMode('practice');
            startPracticeLevel();
        }, 3000);
    };

    const checkAnswer = () => {
        if (!puzzle) return;

        let normalizedUser = userAnswer.toUpperCase().trim();
        let normalizedAnswer = puzzle.answer;

        if (puzzle.type === 'number') {
            normalizedUser = normalizedUser.replace(/,/g, '-').replace(/\s+/g, '-');
        }

        if (normalizedUser === normalizedAnswer) {
            setSuccess(true);
            setScore(prev => prev + 100);

            if (gameMode === 'daily') {
                handleDailyComplete();
            } else {
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    startPracticeLevel();
                }, 2000);
            }

        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    if (!puzzle) return <div className="text-white">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-4xl mx-auto p-4 animate-fade-in text-center">

            {/* HUD */}
            <div className="w-full flex justify-between items-center mb-8 glass-panel p-4 rounded-xl">
                <div className="flex flex-col items-start">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Mode</span>
                    {gameMode === 'daily' ? (
                        <span className="text-xl font-bold text-yellow-400 drop-shadow-md">DAILY CHALLENGE</span>
                    ) : (
                        <span className="text-xl font-bold text-blue-400">PRACTICE RUN</span>
                    )}
                </div>

                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter shadow-glow hidden md:block">
                    I-Q LAND
                </h1>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Score</span>
                    <span className="text-2xl font-bold text-white">{score}</span>
                </div>
            </div>

            {/* Puzzle Area */}
            <div className={`glass-panel p-8 rounded-2xl w-full max-w-2xl mb-8 transition-transform duration-300 ${shake ? 'animate-shake border-red-500/50' : success ? 'border-green-500/50 bg-green-500/10' : ''}`}>

                {/* Daily Success Message Overlay */}
                {success && gameMode === 'daily' && (
                    <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center rounded-2xl animate-fade-in backdrop-blur-sm">
                        <h2 className="text-4xl font-bold text-yellow-400 mb-2">DAILY COMPLETED!</h2>
                        <p className="text-white mb-6">You cracked today's code.</p>
                        <p className="text-blue-300 text-sm">Switching to Practice Mode...</p>
                    </div>
                )}

                {/* Rule / Example */}
                <div className="mb-8">
                    <h2 className="text-blue-200 text-sm uppercase tracking-widest mb-2">The Pattern</h2>
                    <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-mono font-bold text-white">
                        <span className="opacity-70">{puzzle.example.input}</span>
                        <span className="text-blue-400">→</span>
                        <span className="text-yellow-400">{puzzle.example.output}</span>
                    </div>
                </div>

                <div className="h-px bg-white/10 w-full mb-8"></div>

                {/* Question */}
                <div className="mb-8">
                    <h2 className="text-blue-200 text-sm uppercase tracking-widest mb-2">Solve This</h2>
                    <div className="text-4xl md:text-6xl font-mono font-bold text-white mb-6">
                        {puzzle.question} <span className="text-blue-400">→</span> <span className="text-white/30">?</span>
                    </div>

                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full max-w-md bg-black/30 border-2 border-white/20 rounded-xl px-6 py-4 text-center text-2xl md:text-3xl text-white font-mono focus:border-blue-400 focus:outline-none transition-all placeholder:text-white/10"
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        disabled={success}
                    />
                </div>
            </div>

            {/* Feedback/Explanation */}
            {success && gameMode === 'practice' && (
                <div className="mb-6 p-4 bg-green-500/20 text-green-200 rounded-xl animate-fade-in">
                    <p className="font-bold">Correct!</p>
                    <p className="text-sm opacity-80">{puzzle.explanation}</p>
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={() => setShowExplanation(prev => !prev)}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all active:scale-95 border border-white/10"
                >
                    {showExplanation ? 'Hide Logic' : 'Show Logic'}
                </button>
                <button
                    onClick={checkAnswer}
                    disabled={success}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit
                </button>
            </div>

            {showExplanation && (
                <div className="mt-6 text-sm text-blue-200/80 max-w-md bg-blue-900/20 p-4 rounded-lg">
                    Logic: {puzzle.explanation}
                </div>
            )}

        </div>
    );
};
