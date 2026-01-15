import { browser } from "$app/environment";
import type { ReaderSettings, Word } from "$lib/types";
import { parseText } from "$lib/utils/text-parser";

const STORAGE_KEY = "speed-reader-settings";
const INDEX_STORAGE_KEY = "speed-reader-current-index";
const DB_NAME = "speed-reader-db";
const STORE_NAME = "text-store";
const TEXT_KEY = "current-text";

const DEFAULT_SETTINGS: ReaderSettings = {
  wpm: 400,
  fontSize: 64,
  fontFamily: "adobe-garamond-pro",
  darkMode: true,
  easeUp: true,
  easeUpSeconds: 3,
};

class ReaderState {
  // Settings
  wpm = $state(DEFAULT_SETTINGS.wpm);
  fontSize = $state(DEFAULT_SETTINGS.fontSize);
  fontFamily = $state(DEFAULT_SETTINGS.fontFamily);
  darkMode = $state(DEFAULT_SETTINGS.darkMode);
  easeUp = $state(DEFAULT_SETTINGS.easeUp);
  easeUpSeconds = $state(DEFAULT_SETTINGS.easeUpSeconds);

  // App State
  playbackStartTime = $state<number | null>(null);
  text = $state("");
  words = $state<Word[]>([]);
  currentIndex = $state(0);
  playing = $state(false);
  showUploader = $state(false);

  private db: IDBDatabase | null = null;
  private indexDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private initialized = $state(false);

  constructor() {
    if (browser) {
      this.initDB().then(() => {
        this.load().then(() => {
          this.initialized = true;
        });
      });

      // Auto-save settings on any change
      $effect.root(() => {
        $effect(() => {
          if (!this.initialized) return;
          this.saveSettings();
        });

        // Debounced save for currentIndex
        $effect(() => {
          if (!this.initialized) return;
          const index = this.currentIndex;
          if (this.indexDebounceTimer) clearTimeout(this.indexDebounceTimer);
          this.indexDebounceTimer = setTimeout(() => {
            localStorage.setItem(INDEX_STORAGE_KEY, index.toString());
          }, 1000); // 1 second debounce
        });
      });
    }
  }

  // Database Initialization
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Text Storage (IndexedDB)
  private async saveText(text: string) {
    if (!this.db) return;
    const tx = this.db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(text, TEXT_KEY);
  }

  private async loadText(): Promise<string | null> {
    if (!this.db) return null;
    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(TEXT_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  // Persistence
  private saveSettings() {
    if (typeof localStorage !== "undefined") {
      const data: ReaderSettings = {
        wpm: this.wpm,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        darkMode: this.darkMode,
        easeUp: this.easeUp,
        easeUpSeconds: this.easeUpSeconds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }

  private async load() {
    if (!browser) return;

    // Load Settings
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      try {
        const data = JSON.parse(storedSettings);

        this.wpm = data.wpm ?? DEFAULT_SETTINGS.wpm;
        this.fontSize = data.fontSize ?? DEFAULT_SETTINGS.fontSize;
        this.fontFamily = data.fontFamily ?? DEFAULT_SETTINGS.fontFamily;
        this.darkMode = data.darkMode ?? DEFAULT_SETTINGS.darkMode;
        this.easeUp = data.easeUp ?? DEFAULT_SETTINGS.easeUp;
        this.easeUpSeconds =
          data.easeUpSeconds ?? DEFAULT_SETTINGS.easeUpSeconds;
        document.documentElement.classList.toggle("dark", this.darkMode);
      } catch (e) {
        console.error("Failed to parse stored settings:", e);
      }
    }

    // Load Index
    const storedIndex = localStorage.getItem(INDEX_STORAGE_KEY);
    if (storedIndex) {
      this.currentIndex = parseInt(storedIndex, 10) || 0;
    }

    // Load Text (IndexedDB)
    const storedText = await this.loadText();
    if (storedText) {
      this.text = storedText;
      this.words = parseText(storedText);
    }
  }

  // Actions
  async loadNewText(newText: string) {
    this.text = newText;
    this.words = parseText(newText);
    this.currentIndex = 0;
    this.playing = false;
    this.showUploader = false;
    await this.saveText(newText);
  }

  togglePlay() {
    if (this.words.length === 0) {
      this.showUploader = true;
      return;
    }

    if (this.currentIndex >= this.words.length - 1 && !this.playing) {
      this.currentIndex = 0;
    }
    this.playing = !this.playing;

    if (this.playing) {
      this.playbackStartTime = Date.now();
    } else {
      this.playbackStartTime = null;
    }
  }

  reset() {
    this.currentIndex = 0;
    this.playing = false;
    this.playbackStartTime = null;
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playing = false;
      this.playbackStartTime = null;
    }
  }

  forward() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.playing = false;
      this.playbackStartTime = null;
    }
  }

  seek(index: number) {
    this.currentIndex = index;
    this.playing = false;
    this.playbackStartTime = null;
  }
}

export const reader = new ReaderState();
export const settings = reader;
