import { useState, useEffect, useRef } from 'react';
import { generatePuzzle, getDailySeed, getTodayString, Puzzle } from '../utils/cipherUtils';

interface DailyStatusResponse {
    isSolved: boolean;
    username: string | null;
    avatarUrl: string | null;
}

interface PuzzleData {
    puzzleType: 'shift' | 'number' | 'reverse';
    exampleInput: string;
    exampleOutput: string;
    question: string;
    answer: string;
    explanation: string;
    author: string;
}

export const CipherGame = () => {
    // Game State
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // Mode State
    const [view, setView] = useState<'daily' | 'practice' | 'build' | 'custom'>('daily');
    const [dailyCompleted, setDailyCompleted] = useState(false);
    const [userInfo, setUserInfo] = useState<{ username: string | null, avatarUrl: string | null }>({ username: null, avatarUrl: null });
    const [loading, setLoading] = useState(true);
    const [customPuzzleAuthor, setCustomPuzzleAuthor] = useState<string | null>(null);

    // Timer State
    const [timeMs, setTimeMs] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Builder State
    const [buildForm, setBuildForm] = useState({
        exampleInput: 'APPLE',
        exampleOutput: '1-16-16-12-5',
        question: 'BANANA',
        answer: '2-1-14-1-14-1',
        explanation: 'A=1, B=2...',
        puzzleType: 'number' as 'shift' | 'number' | 'reverse'
    });
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        initGame();
        return () => stopTimer();
    }, []);

    useEffect(() => {
        if (timerActive) {
            timerRef.current = setInterval(() => {
                setTimeMs(prev => prev + 100);
            }, 100);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [timerActive]);

    const initGame = async () => {
        // 0. Check Start Mode from Splash
        const startMode = localStorage.getItem('start_mode');
        if (startMode === 'build') {
            setView('build');
            localStorage.removeItem('start_mode');
            setLoading(false);
            return;
        }

        // 1. Fetch User Info
        try {
            const statusRes = await fetch('/api/daily-status');
            if (statusRes.ok) {
                const data: DailyStatusResponse = await statusRes.json();
                setUserInfo({ username: data.username, avatarUrl: data.avatarUrl });
                if (data.isSolved) setDailyCompleted(true);
            }
        } catch (e) { console.error(e); }

        // 2. Check if we are in a Custom Post (Context check)
        try {
            const customRes = await fetch('/api/puzzle-data');
            const customData = await customRes.json();

            if (customData.found && customData.puzzle) {
                // Load Custom Puzzle
                loadCustomPuzzle(customData.puzzle);
                setLoading(false);
                return;
            }
        } catch (e) { console.error(e); }

        // 3. Fallback to Daily
        startDailyLevel(dailyCompleted);
        setLoading(false);
    };



    const stopTimer = () => setTimerActive(false);
    const resetTimer = () => { setTimeMs(0); setTimerActive(true); };

    const loadCustomPuzzle = (data: PuzzleData) => {
        setPuzzle({
            type: data.puzzleType,
            example: { input: data.exampleInput, output: data.exampleOutput },
            question: data.question,
            answer: data.answer,
            explanation: data.explanation
        });
        setCustomPuzzleAuthor(data.author);
        setView('custom');
        resetTimer();
        setSuccess(false);
        setUserAnswer('');
    };

    const startDailyLevel = (isSolved = false) => {
        if (isSolved) {
            setView('practice');
            startPracticeLevel();
        } else {
            const seed = getDailySeed();
            setPuzzle(generatePuzzle(seed));
            setView('daily');
            resetTimer(); // Timer for daily too? Why not.
            setSuccess(false);
            setUserAnswer('');
        }
    };

    const startPracticeLevel = () => {
        setPuzzle(generatePuzzle());
        setUserAnswer('');
        setSuccess(false);
        setTimerActive(false); // No timer for practice mode loop, or maybe yes?
        setView('practice');
    };

    const handlePostPuzzle = async () => {
        setIsPosting(true);
        try {
            const res = await fetch('/api/create-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildForm)
            });
            const data = await res.json();
            if (data.success) {
                alert(`Puzzle Posted! Checking it out: ${data.url}`);
                // Maybe redirect? For now just alert.
            } else {
                alert('Failed to post: ' + data.message);
            }
        } catch (e) {
            alert('Error posting puzzle');
        } finally {
            setIsPosting(false);
        }
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
            stopTimer(); // Stop timer on win
            setScore(prev => prev + 100);

            if (view === 'daily') {
                setDailyCompleted(true);
                fetch('/api/complete-daily', { method: 'POST' });
            } else if (view === 'practice') {
                setTimeout(() => startPracticeLevel(), 1500);
            }
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const deciseconds = Math.floor((ms % 1000) / 100);
        return `${seconds}.${deciseconds}s`;
    };

    if (loading) return <div className="text-white flex h-screen items-center justify-center">Loading Logic Engine...</div>;

    // --- BUILDER VIEW ---
    if (view === 'build') {
        return (
            <div className="flex flex-col items-center min-h-screen w-full max-w-2xl mx-auto p-4 animate-fade-in text-white">
                <div className="w-full flex justify-between items-center mb-6">
                    <button onClick={() => setView('daily')} className="text-blue-300 hover:text-white">← Back</button>
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">BUILDER MODE</h1>
                    <div className="w-8"></div>
                </div>

                <div className="glass-panel p-6 rounded-xl w-full flex flex-col gap-4">
                    <h2 className="text-lg font-bold border-b border-white/10 pb-2">Define Rules</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Example Input</label>
                            <input className="bg-black/30 border border-white/20 rounded p-2" value={buildForm.exampleInput} onChange={e => setBuildForm({ ...buildForm, exampleInput: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Example Output</label>
                            <input className="bg-black/30 border border-white/20 rounded p-2" value={buildForm.exampleOutput} onChange={e => setBuildForm({ ...buildForm, exampleOutput: e.target.value })} />
                        </div>
                    </div>

                    <h2 className="text-lg font-bold border-b border-white/10 pb-2 mt-2">Create Challenge</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Question Word</label>
                            <input className="bg-black/30 border border-white/20 rounded p-2" value={buildForm.question} onChange={e => setBuildForm({ ...buildForm, question: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Expected Answer</label>
                            <input className="bg-black/30 border border-white/20 rounded p-2" value={buildForm.answer} onChange={e => setBuildForm({ ...buildForm, answer: e.target.value })} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-xs text-gray-400">Logic Explanation</label>
                        <input className="bg-black/30 border border-white/20 rounded p-2" value={buildForm.explanation} onChange={e => setBuildForm({ ...buildForm, explanation: e.target.value })} />
                    </div>

                    <button
                        onClick={handlePostPuzzle}
                        disabled={isPosting}
                        className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        {isPosting ? 'Posting...' : 'Post to Community'}
                    </button>
                    <p className="text-xs text-center text-gray-500">This will create a new Reddit post with your puzzle.</p>
                </div>
            </div>
        );
    }

    // --- GAME VIEW (Daily / Custom / Practice) ---
    if (!puzzle) return <div>Error loading puzzle</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-4xl mx-auto p-4 animate-fade-in text-center relative">

            {/* User Info */}
            <div className="absolute top-4 right-4 flex items-center gap-4">
                {userInfo.username && (
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                        {userInfo.avatarUrl && <img src={userInfo.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full" />}
                        <span className="text-xs text-blue-200 font-medium">u/{userInfo.username}</span>
                    </div>
                )}
                <button onClick={() => setView('build')} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-xs text-white border border-white/10" title="Builder Mode">
                    🛠️ Build
                </button>
            </div>

            {/* HUD */}
            <div className="w-full flex justify-between items-center mb-8 glass-panel p-4 rounded-xl mt-16 md:mt-0">
                <div className="flex flex-col items-start min-w-[100px]">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Mode</span>
                    {view === 'daily' && <span className="text-xl font-bold text-yellow-400 drop-shadow-md">DAILY</span>}
                    {view === 'practice' && <span className="text-xl font-bold text-blue-400">PRACTICE</span>}
                    {view === 'custom' && (
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-purple-400">CUSTOM</span>
                            <span className="text-xs text-gray-400">by u/{customPuzzleAuthor}</span>
                        </div>
                    )}
                </div>

                {/* Timer Display */}
                <div className="flex flex-col items-center">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Time</span>
                    <span className={`text-3xl font-mono font-bold ${timerActive ? 'text-white' : success ? 'text-green-400' : 'text-gray-400'}`}>
                        {formatTime(timeMs)}
                    </span>
                </div>

                <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Score</span>
                    <span className="text-2xl font-bold text-white">{score}</span>
                </div>
            </div>

            {/* Puzzle Area */}
            <div className={`glass-panel p-8 rounded-2xl w-full max-w-2xl mb-8 transition-transform duration-300 ${shake ? 'animate-shake border-red-500/50' : success ? 'border-green-500/50 bg-green-500/10' : ''}`}>

                {/* Success Overlay */}
                {success && (
                    <div className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center rounded-2xl animate-fade-in backdrop-blur-sm p-6">
                        <h2 className="text-4xl font-bold text-green-400 mb-2">SOLVED!</h2>
                        <div className="text-6xl font-mono font-bold text-white mb-4">{formatTime(timeMs)}</div>

                        {view === 'daily' && (
                            <button onClick={() => { setView('practice'); startPracticeLevel(); }} className="px-6 py-2 bg-blue-600 rounded-lg text-white font-bold">
                                Play Practice Mode
                            </button>
                        )}
                        {view === 'custom' && (
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-400 text-sm">Great time! Challenge your friends.</p>
                                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 rounded-lg text-white">Replay</button>
                            </div>
                        )}
                        {view === 'practice' && (
                            <p className="text-blue-300 animate-pulse">Next level starting...</p>
                        )}
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
                        placeholder="Type answer..."
                        className="w-full max-w-md bg-black/30 border-2 border-white/20 rounded-xl px-6 py-4 text-center text-2xl md:text-3xl text-white font-mono focus:border-blue-400 focus:outline-none transition-all placeholder:text-white/10"
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        disabled={success}
                    />
                </div>
            </div>

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
