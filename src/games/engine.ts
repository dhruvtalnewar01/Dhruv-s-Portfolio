import wordDataRaw from '../../public/games/fo-hacking-data.json';

// Type definition for word dictionary
const wordData: { [key: string]: string[] } = wordDataRaw;

export const GameState = {
  ATTEMPT: 'ATTEMPT',
  MATCH: 'MATCH',
  LOCKOUT: 'LOCKOUT'
} as const;

export type GameState = typeof GameState[keyof typeof GameState];

export interface GameTheme {
  name: string;
  primary: string;
  glow: string;
  bandDark: string;
  bandLight: string;
  highlightBg: string;
  highlightText: string;
}

export const THEMES: { [key: string]: GameTheme } = {
  green: {
    name: 'Vault Green',
    primary: '#36fc9b',
    glow: 'rgba(54, 252, 155, 0.4)',
    bandDark: '#0b1f10',
    bandLight: '#142918',
    highlightBg: '#36fc9b',
    highlightText: '#06170b'
  },
  amber: {
    name: 'Mojave Amber',
    primary: '#ffb642',
    glow: 'rgba(255, 182, 66, 0.4)',
    bandDark: '#211204',
    bandLight: '#2e1906',
    highlightBg: '#ffb642',
    highlightText: '#1c0c00'
  },
  cyan: {
    name: 'Institute Cyan',
    primary: '#38d9ff',
    glow: 'rgba(56, 217, 255, 0.4)',
    bandDark: '#061a24',
    bandLight: '#0d2836',
    highlightBg: '#38d9ff',
    highlightText: '#04121a'
  },
  white: {
    name: 'Mainframe White',
    primary: '#e2e8f0',
    glow: 'rgba(226, 232, 240, 0.3)',
    bandDark: '#0f172a',
    bandLight: '#1e293b',
    highlightBg: '#f8fafc',
    highlightText: '#020617'
  }
};

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public hover() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.016);
    } catch {
      // Audio error ignored
    }
  }

  public click() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio error ignored
    }
  }

  public match() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.09;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {
      // Audio error ignored
    }
  }

  public lockout() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.45);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // Audio error ignored
    }
  }

  public dudRemoved() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio error ignored
    }
  }

  public triesReset() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    } catch {
      // Audio error ignored
    }
  }
}

export class FalloutHackingGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 640;
  private height: number = 480;

  private sound = new SoundFX();
  public currentTheme: GameTheme = THEMES.green;

  private wordLength: number = 5;
  private attemptsLeft: number = 4;
  private maxAttempts: number = 4;
  private gameState: GameState = GameState.ATTEMPT;

  private lines: string[] = [];
  private statusLines: string[] = [];
  private passwords: { [index: number]: string } = {};
  private correctPassword: string = '';

  private charMouseX: number = -1;
  private charMouseY: number = -1;
  private highlightedWord: string | null = null;
  private highlightedBlockStart: number | null = null;
  private highlightedBlockEnd: number | null = null;
  private lastHoverKey: string = '';

  private displayHighlightImage: HTMLImageElement;
  private displayGaussImage: HTMLImageElement;
  private gaussY: number = -1;

  private addresses: string[] = [
    '0xF964', '0xF970', '0xF97C', '0xF988', '0xF994', '0xF9A0', '0xF9AC', '0xF9B8',
    '0xF9C4', '0xF9D0', '0xF9DC', '0xF9E8', '0xF9F4', '0xFA00', '0xFA0C', '0xFA18', '0xFA24',
    '0xFA30', '0xFA3C', '0xFA48', '0xFA54', '0xFA60', '0xFA6C', '0xFA78', '0xFA84',
    '0xFA90', '0xFA9C', '0xFAA8', '0xFAB4', '0xFAC0', '0xFACC', '0xFAD8', '0xFAE4', '0xFAF0'
  ];

  private punctuation: string[] = [
    '<', '>', '{', '}', '(', ')', '=', '$', ',',
    '\'', ';', ':', '_', '"', '!', '[', ']', '^',
    '#', '|', '+', '-', '*', '@', '\\', '/', '%'
  ];

  private punctuationNonBlocky: string[] = [
    '=', '$', ',', '\'', ';', ':', '_', '"', '!', '^',
    '#', '|', '+', '-', '*', '@', '\\', '/', '%'
  ];

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d')!;

    this.displayHighlightImage = new Image();
    this.displayHighlightImage.src = 'assets/images/display-highlight.png';

    this.displayGaussImage = new Image();
    this.displayGaussImage.src = 'assets/images/display-gauss.png';

    this.setupEvents();
    this.reset();
    this.loop();
  }

  public setTheme(themeKey: string) {
    if (THEMES[themeKey]) {
      this.currentTheme = THEMES[themeKey];
      document.documentElement.style.setProperty('--terminal-primary', this.currentTheme.primary);
      document.documentElement.style.setProperty('--terminal-glow', this.currentTheme.glow);
    }
  }

  public toggleSound(): boolean {
    this.sound.enabled = !this.sound.enabled;
    if (this.sound.enabled) {
      this.sound.hover();
    }
    return this.sound.enabled;
  }

  public isSoundEnabled(): boolean {
    return this.sound.enabled;
  }

  public setWordLength(len: number) {
    this.wordLength = Math.max(4, Math.min(9, len));
    this.reset();
  }

  public getWordLength(): number {
    return this.wordLength;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public reset() {
    this.passwords = {};
    this.gameState = GameState.ATTEMPT;
    this.statusLines = [];
    this.attemptsLeft = this.maxAttempts;
    this.highlightedWord = null;
    this.highlightedBlockStart = null;
    this.highlightedBlockEnd = null;

    let attemptBlocks = '';
    for (let i = 0; i < this.attemptsLeft; i++) {
      attemptBlocks += ' ∎';
    }

    this.lines = [];
    this.lines.push('ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL');
    this.lines.push('ENTER PASSWORD NOW');
    this.lines.push('');
    this.lines.push(`${this.attemptsLeft} ATTEMPT(S) LEFT: ${attemptBlocks}`);
    this.lines.push('');

    // Select candidate words
    const wordKey = this.wordLength.toString();
    const wordPool = (wordData[wordKey] || wordData['5'] || []).map(w => w.toUpperCase());
    const targetWordCount = 10;
    const chosenWords: string[] = [];

    while (chosenWords.length < targetWordCount && wordPool.length > chosenWords.length) {
      const pick = wordPool[Math.floor(Math.random() * wordPool.length)];
      if (!chosenWords.includes(pick)) {
        chosenWords.push(pick);
      }
    }

    // Pick correct password
    this.correctPassword = chosenWords[Math.floor(Math.random() * chosenWords.length)] || 'ROBOT';

    // Construct 374-character memory block (187 for left, 187 for right)
    // Guarantee spacing so words don't collide or straddle column boundary (index 187)
    let wordSoup = '';
    let wordIndex = 0;
    let wordSpacing = 0;

    for (let i = 0; i < 374; i++) {
      const remainingLengthInCol = (i < 187) ? (187 - i) : (374 - i);
      const canPlaceWord = wordIndex < chosenWords.length &&
        wordSpacing >= 4 &&
        remainingLengthInCol >= this.wordLength &&
        (Math.floor(Math.random() * 8) === 0 || (374 - i < (chosenWords.length - wordIndex) * (this.wordLength + 4)));

      if (canPlaceWord) {
        const word = chosenWords[wordIndex];
        wordSoup += word;
        this.passwords[i] = word;
        wordIndex++;
        wordSpacing = 0;
        i += word.length - 1;
      } else {
        wordSoup += this.punctuation[Math.floor(Math.random() * this.punctuation.length)];
        wordSpacing++;
      }
    }

    // Populate lines with hex memory addresses and characters
    let addressPointer = 0;
    let leftPtr = 0;
    let rightPtr = 187;

    for (let r = 0; r < 17; r++) {
      const leftAddr = this.addresses[addressPointer] || '0xF964';
      const rightAddr = this.addresses[addressPointer + 1] || '0xFA30';
      const leftSlice = wordSoup.slice(leftPtr, leftPtr + 11);
      const rightSlice = wordSoup.slice(rightPtr, rightPtr + 11);

      this.lines.push(`${leftAddr} ${leftSlice} ${rightAddr} ${rightSlice}`);

      addressPointer += 2;
      leftPtr += 11;
      rightPtr += 11;
    }

    this.sound.click();
  }

  private setupEvents() {
    const handleMove = (clientX: number, clientY: number) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;

      const canvasX = (clientX - rect.left) * scaleX;
      const canvasY = (clientY - rect.top) * scaleY;

      // In original layout: text start at x=15, char width ≈ 12.3px, row height = 21px
      this.charMouseX = Math.floor((canvasX - 15) / 12.3);
      this.charMouseY = Math.floor(canvasY / 21);

      this.computeHighlight();
    };

    this.canvas.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.charMouseX = -1;
      this.charMouseY = -1;
      this.highlightedWord = null;
      this.highlightedBlockStart = null;
      this.highlightedBlockEnd = null;
      this.lastHoverKey = '';
    });

    this.canvas.addEventListener('click', (e) => {
      handleMove(e.clientX, e.clientY);
      this.handleClick();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (this.gameState !== GameState.ATTEMPT) {
          this.reset();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        this.reset();
      }
    });
  }

  private computeHighlight() {
    const x = this.charMouseX;
    const y = this.charMouseY;

    this.highlightedWord = null;
    this.highlightedBlockStart = null;
    this.highlightedBlockEnd = null;

    if (y < 5 || y > 21) {
      this.lastHoverKey = '';
      return;
    }

    const isLeftCol = x >= 7 && x <= 17;
    const isRightCol = x >= 26 && x <= 36;
    if (!isLeftCol && !isRightCol) {
      this.lastHoverKey = '';
      return;
    }

    const cursorPos = this.charAbsToWordSoupPos(x, y);
    if (cursorPos === null) return;

    // Check Password match
    const passwordStarts = Object.keys(this.passwords).map(Number);
    for (const startPos of passwordStarts) {
      const password = this.passwords[startPos];
      const endPos = startPos + password.length;
      if (cursorPos >= startPos && cursorPos < endPos) {
        this.highlightedWord = password;
        if (this.gameState === GameState.ATTEMPT) {
          this.statusLines[0] = '>' + password;
        }
        const hoverKey = 'pwd:' + password;
        if (hoverKey !== this.lastHoverKey) {
          this.sound.hover();
          this.lastHoverKey = hoverKey;
        }
        return;
      }
    }

    // Check Bracket match
    const lineStr = this.lines[y];
    if (!lineStr) return;

    let startBlock: number | null = null;
    let endBlock: number | null = null;

    // Check forward from current position on this line
    for (let lx = x; lx < 37; lx++) {
      const ch = lineStr.charAt(lx);
      if (ch === ' ' || /[A-Z]/.test(ch)) break;

      const curChar = lineStr.charAt(x);
      if (
        (curChar === '(' && ch === ')') ||
        (curChar === '[' && ch === ']') ||
        (curChar === '{' && ch === '}') ||
        (curChar === '<' && ch === '>')
      ) {
        const p1 = this.charAbsToWordSoupPos(x, y);
        const p2 = this.charAbsToWordSoupPos(lx, y);
        if (p1 !== null && p2 !== null) {
          startBlock = p1;
          endBlock = p2 + 1;
        }
        break;
      }
    }

    // Check backward if not found
    if (startBlock === null) {
      for (let lx = x; lx >= 0; lx--) {
        const ch = lineStr.charAt(lx);
        if (ch === ' ' || /[A-Z]/.test(ch)) break;

        const curChar = lineStr.charAt(x);
        if (
          (curChar === ')' && ch === '(') ||
          (curChar === ']' && ch === '[') ||
          (curChar === '}' && ch === '{') ||
          (curChar === '>' && ch === '<')
        ) {
          const p1 = this.charAbsToWordSoupPos(lx, y);
          const p2 = this.charAbsToWordSoupPos(x, y);
          if (p1 !== null && p2 !== null) {
            startBlock = p1;
            endBlock = p2 + 1;
          }
          break;
        }
      }
    }

    if (startBlock !== null && endBlock !== null) {
      this.highlightedBlockStart = startBlock;
      this.highlightedBlockEnd = endBlock;
      const hoverKey = `block:${startBlock}-${endBlock}`;
      if (hoverKey !== this.lastHoverKey) {
        this.sound.hover();
        this.lastHoverKey = hoverKey;
      }
      return;
    }

    // Single character hover
    const char = lineStr.charAt(x);
    if (char && char !== ' ') {
      if (this.gameState === GameState.ATTEMPT) {
        this.statusLines[0] = '>' + char;
      }
      const hoverKey = `char:${x}-${y}`;
      if (hoverKey !== this.lastHoverKey) {
        this.sound.hover();
        this.lastHoverKey = hoverKey;
      }
    }
  }

  private handleClick() {
    this.sound.click();

    if (this.gameState !== GameState.ATTEMPT) {
      this.reset();
      return;
    }

    // 1. Password Clicked
    if (this.highlightedWord !== null) {
      const clickedWord = this.highlightedWord;

      if (clickedWord === this.correctPassword) {
        // Won!
        this.sound.match();
        this.appendStatusLines(['', 'is accessed.', 'while system', 'Please wait', 'Exact match!', '']);
        this.lines[1] = '';
        this.lines[3] = 'ACCESS GRANTED';
        this.gameState = GameState.MATCH;
      } else {
        // Incorrect
        let numCorrect = 0;
        for (let i = 0; i < this.correctPassword.length; i++) {
          if (this.correctPassword.charAt(i) === clickedWord.charAt(i)) {
            numCorrect++;
          }
        }
        this.appendStatusLines([
          '',
          `>${numCorrect}/${this.wordLength} correct.`,
          '>Entry denied',
          '>' + clickedWord
        ]);
        this.deductAttempt();
      }
      return;
    }

    // 2. Bracket Block Clicked
    if (this.highlightedBlockStart !== null && this.highlightedBlockEnd !== null) {
      const start = this.highlightedBlockStart;
      const end = this.highlightedBlockEnd;
      const len = end - start;

      // Replace bracket content with random harmless punctuation
      const startAbs = this.wordSoupPosToCharAbs(start);
      let replacement = '';
      for (let i = 0; i < len; i++) {
        replacement += this.punctuationNonBlocky[Math.floor(Math.random() * this.punctuationNonBlocky.length)];
      }

      this.lines[startAbs.y] =
        this.lines[startAbs.y].substring(0, startAbs.x) +
        replacement +
        this.lines[startAbs.y].substring(startAbs.x + len);

      this.highlightedBlockStart = null;
      this.highlightedBlockEnd = null;

      // 1/3 chance: Reset tries; 2/3 chance: Remove dud
      if (Math.random() < 0.33) {
        this.resetTries();
      } else {
        this.removeDud();
      }
    }
  }

  private deductAttempt() {
    this.attemptsLeft--;

    let attemptBlocks = '';
    for (let i = 0; i < this.attemptsLeft; i++) {
      attemptBlocks += ' ∎';
    }

    if (this.attemptsLeft > 0) {
      this.lines[3] = `${this.attemptsLeft} ATTEMPT(S) LEFT: ${attemptBlocks}`;
      if (this.attemptsLeft === 1) {
        this.lines[1] = '!!! WARNING: LOCKOUT IMMINENT !!!';
        this.sound.lockout();
      }
    } else {
      this.sound.lockout();
      this.gameState = GameState.LOCKOUT;
      this.lines[1] = '';
      this.lines[3] = 'PERMISSION DENIED. Lockout initiated.';
      this.appendStatusLines(['', '>DENIED', '>PERMISSION']);
    }
  }

  private resetTries() {
    this.sound.triesReset();
    this.attemptsLeft = this.maxAttempts;
    this.appendStatusLines(['', '>Tries reset.']);

    let attemptBlocks = '';
    for (let i = 0; i < this.attemptsLeft; i++) {
      attemptBlocks += ' ∎';
    }
    this.lines[1] = 'ENTER PASSWORD NOW';
    this.lines[3] = `${this.attemptsLeft} ATTEMPT(S) LEFT: ${attemptBlocks}`;
  }

  private removeDud() {
    const wrongKeys = Object.keys(this.passwords).map(Number).filter(
      k => this.passwords[k] !== this.correctPassword
    );

    if (wrongKeys.length === 0) {
      this.resetTries();
      return;
    }

    this.sound.dudRemoved();
    const dudPos = wrongKeys[Math.floor(Math.random() * wrongKeys.length)];
    const dudWord = this.passwords[dudPos];

    // Erase dud word in memory lines
    for (let i = dudPos; i < dudPos + dudWord.length; i++) {
      const posAbs = this.wordSoupPosToCharAbs(i);
      const dotChar = this.punctuationNonBlocky[Math.floor(Math.random() * this.punctuationNonBlocky.length)];
      this.lines[posAbs.y] =
        this.lines[posAbs.y].substring(0, posAbs.x) +
        dotChar +
        this.lines[posAbs.y].substring(posAbs.x + 1);
    }

    delete this.passwords[dudPos];
    this.appendStatusLines(['', '>Dud removed.']);
  }

  private appendStatusLines(newLines: string[]) {
    this.statusLines = newLines.concat(this.statusLines.slice(1, this.statusLines.length));
  }

  private charAbsToWordSoupPos(x: number, y: number): number | null {
    if (y < 5 || y > 21) return null;

    if (x >= 7 && x <= 17) {
      // Left column
      return (x - 7) + ((y - 5) * 11);
    } else if (x >= 26 && x <= 36) {
      // Right column
      return 187 + (x - 26) + ((y - 5) * 11);
    }
    return null;
  }

  private wordSoupPosToCharAbs(pos: number): { x: number; y: number } {
    if (pos < 187) {
      return {
        x: 7 + (pos % 11),
        y: 5 + Math.floor(pos / 11)
      };
    } else {
      return {
        x: 26 + ((pos - 187) % 11),
        y: 5 + Math.floor((pos - 187) / 11)
      };
    }
  }

  private loop = () => {
    this.render();
    requestAnimationFrame(this.loop);
  };

  private render() {
    const ctx = this.ctx;
    const theme = this.currentTheme;

    // 1. Clear background scanlines
    for (let by = 0; by < 240; by++) {
      ctx.fillStyle = by % 2 === 0 ? theme.bandDark : theme.bandLight;
      ctx.fillRect(0, by * 2, 640, 2);
    }

    // 2. Draw Highlights
    const highlightRanges: { x: number; y: number }[] = [];

    if (this.highlightedWord !== null) {
      const passwordStarts = Object.keys(this.passwords).map(Number);
      for (const startPos of passwordStarts) {
        if (this.passwords[startPos] === this.highlightedWord) {
          for (let i = startPos; i < startPos + this.highlightedWord.length; i++) {
            highlightRanges.push(this.wordSoupPosToCharAbs(i));
          }
          break;
        }
      }
    } else if (this.highlightedBlockStart !== null && this.highlightedBlockEnd !== null) {
      for (let i = this.highlightedBlockStart; i < this.highlightedBlockEnd; i++) {
        highlightRanges.push(this.wordSoupPosToCharAbs(i));
      }
    } else if (
      this.charMouseY >= 5 && this.charMouseY <= 21 &&
      ((this.charMouseX >= 7 && this.charMouseX <= 17) || (this.charMouseX >= 26 && this.charMouseX <= 36))
    ) {
      highlightRanges.push({ x: this.charMouseX, y: this.charMouseY });
    }

    // Draw highlight blocks
    for (const h of highlightRanges) {
      ctx.fillStyle = theme.highlightBg;
      ctx.fillRect(Math.ceil(h.x * 12.3) + 15, h.y * 21, 13, 21);
    }

    // 3. Draw Text
    ctx.font = "21px 'VCR_OSD_MONO_1.001', monospace";

    for (let y = 0; y < 22; y++) {
      const line = this.lines[y] || '';
      const textY = 21 + 21 * y;

      // Draw normal line characters
      if (line.length > 0) {
        ctx.fillStyle = theme.primary;
        ctx.fillText(line, 15, textY);
      }

      // Draw highlighted characters with inverted text color for contrast
      const lineHighlights = highlightRanges.filter(h => h.y === y);
      for (const h of lineHighlights) {
        const char = line.charAt(h.x);
        if (char) {
          ctx.fillStyle = theme.highlightText;
          ctx.fillText(char, Math.ceil(h.x * 12.3) + 15, textY);
        }
      }

      // 4. Status lines on the right (x = 480)
      if (y >= 5 && this.statusLines.length >= (22 - y)) {
        const statusIdx = 22 - y - 1;
        const statusText = this.statusLines[statusIdx];
        if (statusText) {
          ctx.fillStyle = theme.primary;
          ctx.fillText(statusText, 480, textY);
        }
      }
    }

    // 5. CRT Gauss sweep animation
    if (this.gaussY === -1 && Math.floor(Math.random() * 90) === 0) {
      this.gaussY = 0;
    }
    if (this.gaussY > -1 && this.displayGaussImage.complete) {
      try {
        ctx.drawImage(this.displayGaussImage, 0, Math.floor(this.gaussY), 640, 120);
      } catch {
        // ignore draw errors during init
      }
      this.gaussY += 4;
      if (this.gaussY >= 480) {
        this.gaussY = -1;
      }
    }

    // 6. CRT Display curvature highlight
    if (this.displayHighlightImage.complete) {
      try {
        ctx.drawImage(this.displayHighlightImage, 0, 0);
      } catch {
        // ignore
      }
    }
  }
}
