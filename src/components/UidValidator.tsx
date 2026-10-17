import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Sliders, Send, RotateCcw, AlertCircle, Globe, FileText, Check } from 'lucide-react';
import { UidAnalysisResult } from '../types';

interface UidValidatorProps {
  onFormSubmitted: (data: { uid: string; region: string; appealReason: string }) => void;
  onClear: () => void;
  onAddLog: (level: 'OK' | 'READY' | 'INFO' | 'WARN' | 'ERROR' | 'STATUS' | 'COMPLETE', msg: string) => void;
  isSubmitted: boolean;
  submittedUid: string;
}

export const UidValidator: React.FC<UidValidatorProps> = ({
  onFormSubmitted,
  onClear,
  onAddLog,
  isSubmitted,
  submittedUid,
}) => {
  const [uidInput, setUidInput] = useState(submittedUid || '');
  const [region, setRegion] = useState('India (IND)');
  const [appealReason, setAppealReason] = useState('False Positive Anti-Cheat Detection');
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(12);
  const [showConfig, setShowConfig] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setUidInput(rawVal);
    setErrorMessage(null);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check empty UID
    const trimmedUid = uidInput.trim();
    if (!trimmedUid) {
      setErrorMessage('UID field cannot be empty. Please enter your Free Fire UID.');
      setValidationSuccess(false);
      onAddLog('WARN', 'Submission failed: Empty UID entered.');
      return;
    }

    // 2. Validate digits only
    const digitsOnly = /^\d+$/.test(trimmedUid);
    if (!digitsOnly) {
      setErrorMessage('Invalid characters detected. Free Fire UID must contain numeric digits (0-9) only.');
      setValidationSuccess(false);
      onAddLog('ERROR', 'Submission rejected: Non-numeric UID entered.');
      return;
    }

    // 3. Length verification
    if (trimmedUid.length < minLength || trimmedUid.length > maxLength) {
      setErrorMessage(
        `UID length error: Entered ${trimmedUid.length} digits. Acceptable range is ${minLength} to ${maxLength} digits.`
      );
      setValidationSuccess(false);
      onAddLog('WARN', `Submission rejected: UID length ${trimmedUid.length} outside range ${minLength}-${maxLength}.`);
      return;
    }

    // 4. Region check
    if (!region) {
      setErrorMessage('Please select a valid game server region.');
      setValidationSuccess(false);
      return;
    }

    // Valid submission:
    setErrorMessage(null);
    setValidationSuccess(true);
    onAddLog('OK', `Form validated successfully for UID [${trimmedUid}] · Region: [${region}].`);
    onAddLog('STATUS', 'Submitting request to unban sequence handler...');

    onFormSubmitted({
      uid: trimmedUid,
      region,
      appealReason,
    });
  };

  const handleReset = () => {
    setUidInput('');
    setErrorMessage(null);
    setValidationSuccess(false);
    onClear();
    onAddLog('INFO', 'Form inputs and active buffer cleared.');
  };

  return (
    <div className="rounded-xl bg-[#040814] border border-cyan-500/40 p-4 sm:p-6 shadow-xl relative overflow-hidden neon-border-cyan">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <h2 className="font-hud font-bold text-base sm:text-lg tracking-wider text-white">
            UNBAN REQUEST FORM <span className="text-cyan-400">/ UID VALIDATOR</span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Submit your Free Fire account details to initiate the visual unban sequence and start 30-day cooldown.
          </p>
        </div>

        {/* Config Length Button */}
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className="self-start sm:self-auto px-2.5 py-1 bg-black/50 hover:bg-slate-800/60 border border-slate-700/80 rounded text-xs font-terminal text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>CONFIG LENGTH ({minLength}–{maxLength})</span>
        </button>
      </div>

      {/* Length Config Drawer */}
      {showConfig && (
        <div className="mt-3 p-3 bg-[#02040a] border border-cyan-500/30 rounded-lg text-xs font-terminal space-y-2 text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">CONFIGURABLE UID LENGTH PARAMETERS:</span>
            <button
              type="button"
              onClick={() => {
                setMinLength(8);
                setMaxLength(12);
              }}
              className="text-[10px] text-cyan-400/80 hover:text-cyan-300 underline"
            >
              RESET DEFAULTS
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">MINIMUM DIGITS ({minLength})</label>
              <input
                type="range"
                min="6"
                max="10"
                value={minLength}
                onChange={(e) => setMinLength(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">MAXIMUM DIGITS ({maxLength})</label>
              <input
                type="range"
                min="10"
                max="16"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmitForm} className="mt-4 space-y-4">
        {/* UID Field */}
        <div>
          <label className="block text-xs font-terminal font-semibold tracking-wider text-slate-300 mb-1">
            PLAYER NUMERIC UID: <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={uidInput}
              onChange={handleInputChange}
              placeholder="e.g. 1928472910"
              className="w-full bg-[#02050c] border border-cyan-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-cyan-200 font-terminal text-lg tracking-widest px-3.5 py-2.5 rounded-lg outline-none placeholder:text-slate-600 transition-all min-h-[48px]"
            />
            {uidInput && (
              <span className="absolute right-3 top-3 text-[11px] font-terminal text-slate-400 select-none">
                {uidInput.length} DIGITS
              </span>
            )}
          </div>
        </div>

        {/* Region & Reason Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-terminal font-semibold tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>SERVER REGION:</span>
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[#02050c] border border-slate-700 focus:border-cyan-400 text-slate-200 font-terminal text-xs px-3 py-2.5 rounded-lg outline-none cursor-pointer min-h-[44px]"
            >
              <option value="India (IND)">India (IND)</option>
              <option value="North America (NA)">North America (NA)</option>
              <option value="Europe (EU)">Europe (EU)</option>
              <option value="Southeast Asia / Singapore (SG)">Southeast Asia / Singapore (SG)</option>
              <option value="South America / Brazil (BR)">South America / Brazil (BR)</option>
              <option value="Middle East & North Africa (MENA)">Middle East &amp; North Africa (MENA)</option>
              <option value="Indonesia (ID)">Indonesia (ID)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-terminal font-semibold tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>APPEAL REASON CLASSIFICATION:</span>
            </label>
            <select
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              className="w-full bg-[#02050c] border border-slate-700 focus:border-cyan-400 text-slate-200 font-terminal text-xs px-3 py-2.5 rounded-lg outline-none cursor-pointer min-h-[44px]"
            >
              <option value="False Positive Anti-Cheat Detection">False Positive Anti-Cheat Detection</option>
              <option value="Account Compromise / Unauthorized Third-Party">Account Compromise / Unauthorized Third-Party</option>
              <option value="Network Glitch / Anomalous Disconnect">Network Glitch / Anomalous Disconnect</option>
              <option value="Normal Gameplay Review Request">Normal Gameplay Review Request</option>
            </select>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-lg p-3 text-xs font-terminal text-rose-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Submit & Reset Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-terminal font-bold text-sm tracking-wider rounded-lg shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all min-h-[48px] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>SUBMIT UNBAN REQUEST</span>
          </button>

          {uidInput && (
            <button
              type="button"
              onClick={handleReset}
              title="Clear form"
              className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-terminal text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </form>

      {/* Prominent Status Message after submission */}
      {isSubmitted && (
        <div className="mt-5 bg-gradient-to-r from-emerald-950/70 via-[#041517] to-cyan-950/70 border border-emerald-400/60 rounded-xl p-4 sm:p-5 shadow-2xl neon-border-green animate-fadeIn space-y-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
            <h3 className="font-hud font-bold text-base sm:text-lg text-emerald-300 tracking-wide">
              Your account unban process is start
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 font-terminal text-xs">
            <div className="bg-black/60 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SUBMITTED UID</span>
              <span className="text-cyan-300 font-bold text-sm">{submittedUid}</span>
            </div>
            <div className="bg-black/60 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SERVER REGION</span>
              <span className="text-slate-200 font-bold">{region}</span>
            </div>
            <div className="bg-black/60 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SEQUENCE STATUS</span>
              <span className="text-emerald-400 font-bold">ANIMATING LIVE STREAM</span>
            </div>
          </div>

          {/* Required small notice */}
          <div className="pt-2 text-[11px] font-sans text-slate-400 border-t border-slate-800/80 flex items-start gap-1.5">
            <span className="text-cyan-400 font-semibold shrink-0">Interface Notice:</span>
            <span>
              This is a simulated interface and does not confirm an actual account unban. Real account unban decisions are made exclusively by Garena Support via official ticketing channels.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
