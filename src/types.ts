export type LogLevel = 'OK' | 'READY' | 'INFO' | 'AUDIO' | 'STATUS' | 'COMPLETE' | 'WARN' | 'ERROR';

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export type UidValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export interface UidAnalysisResult {
  uid: string;
  isValid: boolean;
  length: number;
  digitOnly: boolean;
  prefix: string;
  timestamp: string;
  errorMessage?: string;
  syntaxClassification: string;
  formatCompliance: string;
}

export interface ScreenshotData {
  file: File | null;
  previewUrl: string | null;
  fileName: string;
  fileSizeFormatted: string;
  fileType: string;
  uploadTimestamp: string;
  dimensions?: { width: number; height: number };
}

export interface LocalSessionInfo {
  sessionActive: boolean;
  uidStatus: 'WAITING_INPUT' | 'CHECKING' | 'VALIDATED' | 'SYNTAX_ERROR';
  screenshotStatus: 'NO_IMAGE' | 'IMAGE_LOADED' | 'INVALID_FORMAT';
  musicStatus: 'DISABLED' | 'SYNTH_ACTIVE' | 'FILE_PLAYING' | 'PAUSED';
  lastAction: string;
  lastActionTimestamp: string;
  initializationTime: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
