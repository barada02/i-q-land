export const QUOTES = [
  "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO",
  "INNOVATION DISTINGUISHES BETWEEN A LEADER AND A FOLLOWER",
  "STAY HUNGRY STAY FOOLISH",
  "TECHNOLOGY IS BEST WHEN IT BRINGS PEOPLE TOGETHER",
  "DESIGN IS NOT JUST WHAT IT LOOKS LIKE AND FEELS LIKE DESIGN IS HOW IT WORKS",
  "SIMPLICITY IS THE ULTIMATE SOPHISTICATION",
  "YOUR TIME IS LIMITED SO DONT WASTE IT LIVING SOMEONE ELSES LIFE",
  "CODE IS POETRY WRITTEN IN MATHEMATICS",
  "ALGORITHMS ARE THE RECIPES OF THE FUTURE",
  "DATA IS THE NEW OIL AND AI IS THE NEW ELECTRICITY"
];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface CipherData {
  original: string;
  encrypted: string;
  cipherMap: Record<string, string>; // Encrypted char -> Original char
}

export const generateCipher = (): Record<string, string> => {
  const shuffled = ALPHABET.split('').sort(() => 0.5 - Math.random());
  const cipher: Record<string, string> = {};
  for (let i = 0; i < ALPHABET.length; i++) {
    cipher[ALPHABET[i]] = shuffled[i];
  }
  return cipher;
};

export const encryptMessage = (message: string): CipherData => {
  const cipherMap = generateCipher();
  // Build reverse map for checking: Encrypted -> Original
  // But wait, to encrypt we need Original -> Encrypted.
  // Let's make cipherMap represent Original -> Encrypted first.
  
  const encryptMap: Record<string, string> = {...cipherMap};
  const decryptMap: Record<string, string> = {};
  
  Object.entries(encryptMap).forEach(([k, v]) => {
    decryptMap[v] = k;
  });

  const encrypted = message
    .toUpperCase()
    .split('')
    .map((char) => {
      if (ALPHABET.includes(char)) {
        return encryptMap[char];
      }
      return char;
    })
    .join('');

  return {
    original: message.toUpperCase(),
    encrypted,
    cipherMap: decryptMap, 
  };
};
