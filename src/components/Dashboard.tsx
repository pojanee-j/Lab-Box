import { useEffect, useState } from 'react';
import { Trophy, Calendar, Star, GraduationCap, ArrowRight, Activity, TrendingUp, HelpCircle } from 'lucide-react';
import { GameSession } from '../types';
import { databaseService } from '../lib/firebase';
import { formatDateString } from '../utils';

interface DashboardProps {
  user: { uid: string; displayName: string; email: string };
  onNavigate: (page: any, data?: any) => void;
}

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  const [history, setHistory] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [sessions, leaderboard] = await Promise.all([
          databaseService.fetchMyHistory(user.uid),
          databaseService.fetchLeaderboard(),
        ]);
        setHistory(sessions);
        
        const selfRating = leaderboard.find(item => item.uid === user.uid);
        if (selfRating) {
          setHighestScore(selfRating.highestScore);
        } else if (sessions.length > 0) {
          setHighestScore(Math.max(...sessions.map(s => s.totalScore)));
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user.uid]);

  // Calculations
  const totalGames = history.length;
  const avgPercentage = totalGames > 0 
    ? Math.round(history.reduce((acc, s) => acc + s.percentage, 0) / totalGames) 
    : 0;

  // Aggregate stats per topic
  const topicBreakdown: Record<string, { correct: number; total: number }> = {};
  history.forEach((session) => {
    Object.entries(session.topicStats || {}).forEach(([topic, stat]: [string, any]) => {
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[topic].correct += stat.correct;
      topicBreakdown[topic].total += stat.total;
    });
  });

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:py-10 flex-1 flex flex-col" id="student-dashboard-root">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-650 via-indigo-750 to-indigo-900 px-6 py-10 shadow-xl text-white md:px-12 md:py-12" id="welcome-banner-container">
        <div className="relative z-10 max-w-lg text-left text-white">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 font-mono text-[10px] font-bold text-indigo-100 uppercase tracking-widest">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
            CS & IT Training Portal
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl font-display text-white">
            สวัสดี, <span className="text-white underline decoration-indigo-400 decoration-wavy">{user.displayName}</span>!
          </h2>
          <p className="mt-4 text-sm text-indigo-50 leading-relaxed font-sans font-bold">
            ทดสอบและฝึกฝนทักษะการแก้ปัญหาทางคอมพิวเตอร์ของคุณ ด้วยชุดเกมคิดวิชาตรรกะและอัลกอริทึม โดยอ้างอิงหลักการเขียนโปรแกรมด้วยภาษา Python ค่ายฝึกหัดโปรแกรมเมอร์มือใหม่!
          </p>
          <div className="mt-8">
            <button
              onClick={() => onNavigate('setup')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-900 border border-indigo-205 shadow-xl hover:bg-slate-50 transition-all cursor-pointer active:scale-98"
              id="begin-challenge-action-card"
            >
              เริ่มทำแบบทดสอบใหม่
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Abstract background graphics */}
        <div className="absolute right-6 bottom-6 opacity-20 font-mono text-[9px] text-indigo-300 select-none p-4 hidden lg:block border border-white/10 bg-white/5 rounded-xl leading-relaxed">
          {`def solve_logic(problem):
    if problem.is_easy:
        return True
    while not problem.resolved:
        problem.apply_operators()
        if problem.elapsed_time > 60:
            apply_penalty()`}
        </div>
      </div>

      {loading ? (
        <div className="mt-12 text-center py-20 flex-1 flex flex-col justify-center items-center" id="dashboard-loading-state">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent shadow-sm"></div>
          <p className="mt-4 text-xs font-mono font-bold text-slate-500 uppercase tracking-widest animate-pulse">กำลังประมวลผลข้อมูลการเล่นสะสม...</p>
        </div>
      ) : (
        <>
          {/* Statistical High-Level Cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" id="stats-summary-grid">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left hover:border-indigo-200 transition-colors" id="stat-card-total-games">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-indigo-600">
                  <Activity className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  จำนวนรอบที่เล่น
                </h4>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-slate-900 font-display">
                {totalGames} <span className="text-sm text-slate-705 font-bold uppercase tracking-widest">แมตช์</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left hover:border-indigo-200 transition-colors" id="stat-card-high-score">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-2 text-amber-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  คะแนนสูงสุดส่วนตัว
                </h4>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-amber-650 font-display">
                {highestScore} <span className="text-sm text-slate-705 font-bold uppercase tracking-widest">pts</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left hover:border-indigo-200 transition-colors" id="stat-card-avg-percentage">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  อัตราตอบถูกเฉลี่ย
                </h4>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-emerald-600 font-display">
                {avgPercentage}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left hover:border-indigo-200 transition-colors" id="stat-card-latest-date">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-indigo-650">
                  <Calendar className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  อัพเดตล่าสุด
                </h4>
              </div>
              <p className="mt-5 text-sm font-extrabold text-slate-900 truncate">
                {history.length > 0 ? formatDateString(history[0].completedAt) : 'ยังไม่มีประวัติตอนนี้'}
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3" id="dashboard-details-split">
            
            {/* Left: Learning Topics Performance tracking */}
            <div className="lg:col-span-2 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm text-left" id="learning-proficiency-block">
              <h3 className="text-base font-extrabold tracking-wide text-slate-900 uppercase font-sans">ระดับความเชี่ยวชาญตามหมวดวิชา (Python Focus)</h3>
              <p className="text-sm text-slate-800 font-bold mt-1 pb-4 border-b border-slate-200">สรุปจากจำนวนข้อตรรกะที่ตอบถูกต้องของแต่ละบทสรุป</p>

              {Object.keys(topicBreakdown).length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <HelpCircle className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">ยังไม่มีสถิติข้อสอบ</p>
                  <p className="text-[11px] text-slate-450 mt-1">เล่นและส่งคำตอบอย่างน้อย 1 เกมเพื่อวิเคราะห์ความรู้ทันที</p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {Object.entries(topicBreakdown).map(([topic, stat]) => {
                    const percentage = Math.round((stat.correct / stat.total) * 100);
                    return (
                      <div key={topic} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold pb-1 text-slate-900">
                          <span className="text-slate-900">{topic}</span>
                          <span className="font-mono text-slate-900">ถูก {stat.correct}/{stat.total} ข้อ ({percentage}%)</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              percentage >= 80 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/10' : percentage >= 50 ? 'bg-amber-500 shadow-sm shadow-amber-500/10' : 'bg-rose-500 shadow-sm shadow-rose-500/10'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Quick Recent games feed */}
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between text-left" id="recent-games-feed-block">
              <div>
                <h3 className="text-base font-extrabold tracking-wide text-slate-900 uppercase font-sans">ประวัติการสอบ 3 รอบล่าสุด</h3>
                <p className="text-sm text-slate-850 font-bold mt-1 pb-4 border-b border-slate-200">ตรวจทานคำตอบเพื่อดูวิธีคิดที่สมบูรณ์</p>

                {history.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-xs font-bold uppercase tracking-wider">ไม่มีสถิติการเล่นรอบล่าสุด</p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3.5">
                    {history.slice(0, 3).map((session, i) => (
                      <div 
                        key={session.id || i} 
                        className="flex items-center justify-between rounded-xl border border-slate-150 bg-slate-50/50 p-3.5 hover:bg-indigo-50/20 hover:border-indigo-150 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-905">คะแนน: {session.totalScore}</span>
                            <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider border ${
                              session.difficulty === 'easy' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                : session.difficulty === 'medium' 
                                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                  : 'bg-rose-50 text-rose-900 border-rose-300'
                            }`}>
                              {session.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-bold mt-1 font-mono">{formatDateString(session.completedAt)}</p>
                        </div>
                        <button
                          onClick={() => onNavigate('summary', session)}
                          className="rounded-lg bg-white border border-slate-200 p-2 hover:bg-indigo-600 hover:text-white hover:border-indigo-650 text-slate-500 transition-all cursor-pointer"
                          title="View complete analysis log"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {history.length > 0 && (
                <button
                  onClick={() => onNavigate('history')}
                  className="mt-6 flex w-full items-center justify-center gap-1.5 text-sm font-black text-indigo-700 hover:text-indigo-900 transition-colors py-3 border-t border-slate-200 cursor-pointer"
                >
                  ดูทั้งหมดเชิงลึก
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
