import { useState, useEffect } from 'react';
import { encryptMessage, QUOTES, ALPHABET } from '../utils/cipherUtils';

export const CipherGame = () => {
    const [currentQuote, setCurrentQuote] = useState('');
    const [encryptedQuote, setEncryptedQuote] = useState('');
    const [decryptionMap, setDecryptionMap] = useState<Record<string, string>>({}); // Encrypted char -> User guess
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        startNewLevel();
    }, []);

    const startNewLevel = () => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)] || "DEFAULT QUOTE";
        const { original, encrypted } = encryptMessage(randomQuote);
        setCurrentQuote(original);
        setEncryptedQuote(encrypted);
        setDecryptionMap({});
        setSuccess(false);
    };

    const handleInputChange = (char: string, value: string) => {
        const upperValue = value.toUpperCase();
        if (upperValue && !ALPHABET.includes(upperValue)) return;

        setDecryptionMap(prev => ({
            ...prev,
            [char]: upperValue
        }));
    };

    const checkAnswer = () => {
        const userDecoded = encryptedQuote.split('').map(char => {
            if (!ALPHABET.includes(char)) return char;
            return decryptionMap[char] || '_';
        }).join('');

        if (userDecoded === currentQuote) {
            setSuccess(true);
            setScore(prev => prev + 100);
            setTimeout(() => {
                setLevel(prev => prev + 1);
                startNewLevel();
            }, 2000);
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const getDecodedChar = (char: string) => {
        return decryptionMap[char] || '';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-4xl mx-auto p-4 animate-fade-in">

            {/* HUD */}
            <div className="w-full flex justify-between items-center mb-8 glass-panel p-4 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Level</span>
                    <span className="text-2xl font-bold text-white">{level}</span>
                </div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter shadow-glow">
                    CIPHER BREAKER
                </h1>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-200 uppercase tracking-wider">Score</span>
                    <span className="text-2xl font-bold text-white">{score}</span>
                </div>
            </div>

            {/* Game Area */}
            <div className={`glass-panel p-8 rounded-2xl w-full mb-8 transition-transform duration-300 ${shake ? 'animate-shake border-red-500/50' : success ? 'border-green-500/50 bg-green-500/10' : ''}`}>
                <div className="flex flex-wrap gap-4 justify-center">
                    {encryptedQuote.split(' ').map((word, wordIndex) => (
                        <div key={wordIndex} className="flex gap-1 flex-wrap justify-center mb-4">
                            {word.split('').map((char, charIndex) => (
                                <div key={`${wordIndex}-${charIndex}`} className="flex flex-col items-center gap-1">
                                    {ALPHABET.includes(char) ? (
                                        <>
                                            <input
                                                type="text"
                                                maxLength={1}
                                                value={getDecodedChar(char)}
                                                onChange={(e) => handleInputChange(char, e.target.value)}
                                                className={`w-10 h-12 text-2xl font-bold text-center rounded-lg bg-black/30 border-2 focus:border-blue-400 focus:outline-none transition-all
                          ${success ? 'text-green-400 border-green-500/50' : 'text-white border-white/10'}
                          ${getDecodedChar(char) ? 'bg-blue-500/20 border-blue-500/30' : ''}
                        `}
                                            />
                                            <span className="text-sm font-mono text-blue-300/70">{char}</span>
                                        </>
                                    ) : (
                                        <div className="w-10 h-12 flex items-center justify-center">
                                            <span className="text-3xl text-white/50">{char}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={() => {
                        setDecryptionMap({});
                        setShake(true);
                        setTimeout(() => setShake(false), 200);
                    }}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all active:scale-95 border border-white/10"
                >
                    Reset
                </button>
                <button
                    onClick={checkAnswer}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 hover:scale-105"
                >
                    Check Code
                </button>
            </div>

            {/* Keyboard Hint - Could be expanded to a virtual keyboard on mobile */}
            <div className="mt-8 text-sm text-gray-400 text-center max-w-md">
                <p>Tap a box and type the letter you think it corresponds to.</p>
                <p className="mt-2 text-xs opacity-60">Patterns match across the entire quote.</p>
            </div>

        </div>
    );
};
