import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AccountSafety: React.FC = () => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [showAppealGuide, setShowAppealGuide] = useState(false);

  const appealTemplateText = `Subject: Inquiry & Request for Review of Account Suspension [UID: <INSERT_YOUR_UID>]

Dear Garena Free Fire Customer Support Team,

I am writing to respectfully request a formal review regarding the suspension of my Free Fire account.

Account Details:
- In-game Player Nickname: <YOUR_NICKNAME>
- Numeric UID: <YOUR_UID>
- Account Binding Platform: <Google / Facebook / VK / Apple>
- Region / Server: <YOUR_REGION>
- Date of Suspension: <DATE>

Statement:
I have always strived to abide strictly by Free Fire's Terms of Service and Anti-Hack policies. I have never intentionally installed or used any unauthorized third-party scripts, APK mods, memory injectors, or game file modifications. 

If an anomalous client flag was triggered by background device apps, antivirus scanners, or network anomalies, I kindly request your security team to conduct a manual review of my account logs.

I have attached a screenshot of the in-game notification screen for verification.

Thank you very much for your time, assistance, and dedication to fair play.

Sincerely,
<YOUR_NAME>`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(appealTemplateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <section className="rounded-xl bg-[#040713] border border-cyan-500/30 p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          <h2 className="font-hud font-bold text-base sm:text-lg tracking-wider text-white">
            ACCOUNT SAFETY <span className="text-emerald-400">/ SECURITY PROTOCOLS</span>
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-terminal text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZERO CREDENTIAL RETENTION</span>
        </div>
      </div>

      {/* Safety Manifesto / Anti-Scam Rules */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 font-terminal text-xs">
        <div className="bg-[#02040b] border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Lock className="w-4 h-4" />
            <span>NEVER ENTER PASSWORDS</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[13px]">
            TITAN never asks for your Free Fire account password, Google password, or Facebook login. Any tool asking for credentials is a phishing scam.
          </p>
        </div>

        <div className="bg-[#02040b] border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>NO OTP OR SMS CODES</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[13px]">
            Never share one-time authentication codes (OTP) or 2-factor codes with anyone. Verification codes grant instant account takeover.
          </p>
        </div>

        <div className="bg-[#02040b] border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>NO PRIVATE DB ACCESS</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[13px]">
            No third-party tool has direct access to Garena's production databases. Legitimate ban revocations can only be authorized by Garena Support.
          </p>
        </div>
      </div>

      {/* Official Garena Appeal Instructions Drawer */}
      <div className="mt-4 bg-[#02050c] border border-slate-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowAppealGuide(!showAppealGuide)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors font-terminal text-xs"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">
              OFFICIAL BAN APPEAL STEP-BY-STEP PROCEDURE
            </span>
          </div>
          {showAppealGuide ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAppealGuide && (
          <div className="p-4 border-t border-slate-800 space-y-4 font-sans text-xs text-slate-300 animate-fadeIn">
            <div className="space-y-2">
              <h4 className="font-terminal font-bold text-cyan-400 text-sm">
                How to submit a legitimate appeal to Garena Free Fire:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                <li>
                  Visit the official Garena Free Fire Help Center portal (<code className="text-cyan-300 font-terminal">ffsupport.garena.com</code>).
                </li>
                <li>
                  Sign in using your linked account provider (Google, Facebook, VK, or Apple ID).
                </li>
                <li>
                  Tap <strong>"Submit a Request"</strong> in the top navigation bar.
                </li>
                <li>
                  Select <strong>"Game Concerns"</strong> or <strong>"Ban Appeal / Account Issue"</strong> as your inquiry type.
                </li>
                <li>
                  Provide your accurate Player Numeric UID and server region.
                </li>
                <li>
                  Attach your screenshot of the ban dialogue for the review team.
                </li>
              </ol>
            </div>

            {/* Ready-to-use Formal Appeal Letter Template */}
            <div className="bg-black/80 border border-slate-800 rounded-lg p-3 space-y-2 font-terminal">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-cyan-400 font-bold">
                  RECOMMENDED FORMAL APPEAL TEMPLATE:
                </span>
                <button
                  onClick={handleCopyTemplate}
                  className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY APPEAL TEMPLATE</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 terminal-scrollbar bg-[#020409] p-2.5 rounded border border-slate-900">
                {appealTemplateText}
              </pre>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Official Support Portal:</span>
              <a
                href="https://ffsupport.garena.com"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
              >
                <span>ffsupport.garena.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
