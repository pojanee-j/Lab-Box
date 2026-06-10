import { Terminal, LogOut, Info, ShieldCheck } from 'lucide-react';
import { isMock } from '../lib/firebase';

interface HeaderProps {
  user: { uid: string; displayName: string; email: string } | null;
  onLogout: () => void;
  onNavigate: (page: any) => void;
  currentPage: string;
}

export default function Header({ user, onLogout, onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Branding & Logo */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-95"
          id="branding-logo-group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-650 shadow-lg shadow-indigo-600/20 text-white">
            <Terminal className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-slate-900">
              Logic<span className="text-indigo-600">Lab</span>
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 font-bold block leading-none">
              Student Sandbox v1.0
            </span>
          </div>
        </div>

        {/* Dynamic Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-2" id="desktop-nav-menu">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                currentPage === 'dashboard' || currentPage === 'setup'
                  ? 'bg-indigo-50 text-indigo-650 border border-indigo-150'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
              id="nav-btn-dashboard"
            >
              แดชบอร์ด
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                currentPage === 'leaderboard'
                  ? 'bg-indigo-50 text-indigo-650 border border-indigo-150'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
              id="nav-btn-leaderboard"
            >
              ตารางคะแนนทั่วโลก
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                currentPage === 'history'
                  ? 'bg-indigo-50 text-indigo-650 border border-indigo-150'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
              id="nav-btn-history"
            >
              ประวัติสอบย้อนหลัง
            </button>
          </nav>
        )}

        {/* User profile controls & Logout */}
        <div className="flex items-center gap-3" id="user-controls-cluster">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 pl-2.5 pr-4 py-1.5 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-620 font-sans text-xs font-bold text-white uppercase shadow-sm">
                  {user.displayName.substring(0, 2)}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{user.displayName}</p>
                  <p className="font-mono text-[9px] text-slate-450 max-w-[120px] truncate">{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-all rounded-xl py-2 px-3 hover:bg-rose-50 text-xs font-semibold border border-transparent"
                title="Log Out Student Profile"
                id="header-logout-btn"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline font-bold">ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-1.5 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              ⚡ Guest Mode
            </div>
          )}
        </div>
      </div>

      {/* Persistent Sandbox Indicator Banner */}
      {isMock && (
        <div className="w-full bg-amber-50 border-b border-amber-200/80 py-2.5 px-4 text-center" id="sandbox-warning-banner">
          <p className="inline-flex items-center justify-center gap-1.5 font-sans text-xs text-amber-700 font-semibold">
            <Info className="h-4 w-4 shrink-0 text-amber-550" />
            <span>
              <strong>โหมดทดลองเรียน (Local Sandbox) :</strong> เนื่องจากโปรเจกต์รันอยู่ในสภาพแวดล้อมจำลอง ข้อมูลคะแนนสอบของคุณจะเซฟเก็บในเบราว์เซอร์อย่างปลอดภัย
            </span>
          </p>
        </div>
      )}
    </header>
  );
}
