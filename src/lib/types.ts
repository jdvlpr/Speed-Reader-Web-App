export interface Word {
  text: string;
  orp: number; // Optimal Recognition Point (index of the highlighted character)
  pauseAfter: number; // Milliseconds to pause after this word
  punctuation: string; // Ending punctuation if any
}

export interface ReaderSettings {
  wpm: number;
  fontSize: number; // in pixels
  fontFamily: string;
  darkMode: boolean;
  easeUp: boolean;
  easeUpSeconds: number;
}

export interface ReaderState {
  words: Word[];
  currentIndex: number;
  playing: boolean;
  text: string;
}

export type FontOption = {
  name: string;
  value: string;
};

export type FontSize = {
  name: string;
  value: number;
};
