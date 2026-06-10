import { useEffect, useState } from 'react';
import { Trophy, Star, Award, Search, Loader2, ArrowLeft, HelpCircle } from 'lucide-react';
import { LeaderboardUser } from '../types';
import { databaseService } from '../lib/firebase';
import { formatDateString } from '../utils';

interface LeaderboardPageProps {
  user: { uid: string; displayName: string };
  onNavigate: (page: any) => void;
}

export default function LeaderboardPage({ user, onNavigate }: LeaderboardPageProps) {
  const [board, setBoard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        const data = await databaseService.fetchLeaderboard();
        setBoard(data);
      } catch (err) {
        console.error('Failed to load global leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBoard();
  }, []);

  const filteredBoard = board.filter(item => 
    item.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 flex-1 flex flex-col justify-center text-left" id="leaderboard-view">
      
      {/* Title block */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-250 pb-6">
        <div>
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            ตารางอันดับเกียรติยศ (Leaderboard)
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-semibold">
            แสดงรายชื่อผู้เรียนที่มีผลคะแนนในการทำโจทย์ตรรกะคอมพิวเตอร์สูงสุดประจำสัปดาห์
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 bg-white hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
          id="leaderboard-back-btn"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3" id="leaderboard-loading">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 shadow-sm" />
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mt-2 animate-pulse">กำลังโหลดกระดานอันดับเกียรติยศ...</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6 flex-1 flex flex-col">
          
          {/* Rank search bar */}
          <div className="relative rounded-xl max-w-md w-full" id="search-container">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหารหัสหรือชื่อชื่อน้อง Dev..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-450 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-550 focus:outline-none shadow-sm"
              id="leaderboard-search-input"
            />
          </div>

          {/* Leaderboard table wrapper */}
          <div className="overflow-hidden rounded-2xl border border-slate-205 bg-white shadow-lg" id="leaderboard-list">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-[#FAFBFD] text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4 w-20 text-center">อันดับ (Rank)</th>
                  <th scope="col" className="px-6 py-4">ผู้เล่นโปรแกรมเมอร์ (Student)</th>
                  <th scope="col" className="px-6 py-4 text-center">คะแนนสูงสุด (High Score)</th>
                  <th scope="col" className="px-6 py-4 text-center">ประชากรแมตช์ (Sessions)</th>
                  <th scope="col" className="px-6 py-4 text-right">เวลาอัพเดตอันดับ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
                {filteredBoard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <HelpCircle className="mx-auto h-8 w-8 text-slate-350 mb-2" />
                      <p className="text-xs font-bold uppercase tracking-wider">ไม่พบรายชื่อในระบบกระดาน ค้นหาใหม่อีกครั้ง</p>
                    </td>
                  </tr>
                ) : (
                  filteredBoard.map((item, index) => {
                    const isSelf = item.uid === user.uid;
                    const rank = index + 1;
                    
                    return (
                      <tr 
                        key={item.uid} 
                        className={`transition-all ${
                          isSelf 
                            ? 'bg-indigo-50/50 text-indigo-900 font-semibold border-l-2 border-l-indigo-650' 
                            : 'hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Rank index with glowing shapes */}
                        <td className="px-6 py-4.5 text-center">
                          <div className="flex items-center justify-center">
                            {rank === 1 ? (
                              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-amber-50 border border-amber-205 text-amber-600 shadow" title="Gold Champion">
                                <Trophy className="h-3.5 w-3.5 text-amber-550" />
                              </div>
                            ) : rank === 2 ? (
                              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-505 shadow" title="Silver Runner">
                                <Award className="h-3.5 w-3.5 text-slate-500" />
                              </div>
                            ) : rank === 3 ? (
                              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-[#b45309]/10 border border-[#b45309]/20 text-orange-600 shadow" title="Bronze Ranker">
                                <Award className="h-3.5 w-3.5 text-orange-550" />
                              </div>
                            ) : (
                              <span className="font-mono text-slate-400 font-bold">{rank}</span>
                            )}
                          </div>
                        </td>

                        {/* Student profile row */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3.5">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold uppercase shrink-0 border ${
                              isSelf 
                                ? 'bg-indigo-650 text-white border-indigo-500 shadow-md' 
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {item.displayName.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{item.displayName}</p>
                              {isSelf && (
                                <span className="inline-flex rounded-md bg-indigo-100 px-2 py-0.5 text-[8.5px] font-bold text-indigo-700 uppercase tracking-widest border border-indigo-150 mt-1">
                                  บัญชีของคุณ (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* High score */}
                        <td className="px-6 py-4.5 text-center font-mono font-bold text-indigo-600 text-sm">
                          {item.highestScore} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                        </td>

                        {/* Total matches */}
                        <td className="px-6 py-4.5 text-center font-mono text-slate-500 text-[11px]">
                          {item.totalGames} แมตช์
                        </td>

                        {/* Last played date */}
                        <td className="px-6 py-4.5 text-right font-mono text-slate-400 text-[11px]">
                          {formatDateString(item.lastPlayedAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
