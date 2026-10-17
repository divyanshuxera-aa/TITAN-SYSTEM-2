import React, { useState, useEffect } from 'react';
import { User, Smartphone, Monitor, Hash, Clock, Globe } from 'lucide-react';

interface PlayerIdentityCardProps {
  activeUid: string;
  onNicknameChange?: (name: string) => void;
}

export const PlayerIdentityCard: React.FC<PlayerIdentityCardProps> = ({ activeUid, onNicknameChange }) => {
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('titan_player_nickname') || 'TITAN_OPERATOR_01';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    platform: 'Android / Web Client',
    resolution: '1080 x 2400',
    touchSupported: true,
    timezone: 'UTC',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const platformText = isAndroid 
        ? 'Android Native Shell / Chrome' 
        : isMobile 
          ? 'Mobile Touch Workstation' 
          : 'Desktop Cyber Workstation';

      setDeviceInfo({
        platform: platformText,
        resolution: `${window.innerWidth} x ${window.innerHeight}`,
        touchSupported: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      });
    }
  }, []);

  const handleSaveNickname = (val: string) => {
    setNickname(val);
    localStorage.setItem('titan_player_nickname', val);
    if (onNicknameChange) onNicknameChange(val);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl bg-[#050914] border border-cyan-500/30 p-4 sm:p-5 relative overflow-hidden shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          <h2 className="font-hud font-bold text-sm sm:text-base tracking-wider text-white">
            PLAYER IDENTITY <span className="text-cyan-400">/ LOCAL DISPLAY</span>
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-terminal text-cyan-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>LOCAL NODE</span>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-terminal text-xs">
        {/* Nickname / Alias */}
        <div className="bg-[#02050c] border border-slate-800 rounded p-2.5">
          <span className="text-slate-400 text-[10px] block">OPERATOR ALIAS</span>
          {isEditing ? (
            <div className="mt-1 flex items-center gap-1.5">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                className="bg-black/80 border border-cyan-500 text-cyan-300 px-2 py-0.5 text-xs rounded outline-none w-full"
                autoFocus
              />
              <button
                onClick={() => handleSaveNickname(nickname)}
                className="px-2 py-0.5 bg-cyan-600 text-white rounded text-[10px] hover:bg-cyan-500 font-bold"
              >
                SAVE
              </button>
            </div>
          ) : (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-cyan-300 font-bold text-sm tracking-wide truncate">
                {nickname}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-cyan-400/70 hover:text-cyan-300 underline"
              >
                EDIT
              </button>
            </div>
          )}
        </div>

        {/* Bound UID */}
        <div className="bg-[#02050c] border border-slate-800 rounded p-2.5">
          <span className="text-slate-400 text-[10px] block">BOUND FREE FIRE UID</span>
          <div className="mt-1 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-emerald-400 font-bold text-sm tracking-widest truncate">
              {activeUid || 'NOT CONFIGURED'}
            </span>
          </div>
        </div>

        {/* Device Environment */}
        <div className="bg-[#02050c] border border-slate-800 rounded p-2.5">
          <span className="text-slate-400 text-[10px] block">ENVIRONMENT / SCREEN</span>
          <div className="mt-1 flex items-center gap-1.5 text-slate-200 truncate">
            {deviceInfo.touchSupported ? (
              <Smartphone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            ) : (
              <Monitor className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            )}
            <span className="truncate">{deviceInfo.platform}</span>
          </div>
        </div>

        {/* Local Timezone */}
        <div className="bg-[#02050c] border border-slate-800 rounded p-2.5">
          <span className="text-slate-400 text-[10px] block">LOCAL TIME ZONE</span>
          <div className="mt-1 flex items-center gap-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{deviceInfo.timezone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
