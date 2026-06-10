import { useEffect, useState } from 'react';
import { Calendar, Timer, ChevronDown, ChevronUp, AlertCircle, Loader2, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { GameSession } from '../types';
import { databaseService } from '../lib/firebase';
import { formatDateString, formatTime } from '../utils';

interface HistoryPageProps {
  user: { uid: string; displayName: string };
  onNavigate: (page: any) => void;
}

export default function HistoryPage({ user, onNavigate }: HistoryPageProps) {
  const [history, setHistory] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await databaseService.fetchMyHistory(user.uid);
        setHistory(data);
      } catch (err) {
        console.error('Failed to load user session history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user.uid]);

  const toggleExpand = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 flex-1 flex flex-col justify-center text-left" id="history-view-panel">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            ประวัติการทดสอบตรรกะแบบละเอียด
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-semibold">
            ตรวจดูรันไทม์บันทึกคะแนนคำตอบที่คุณเคยทดสอบเพื่อทบทวนความรู้เก่า (Python Focus)
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 bg-white hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
          id="history-back-btn"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-650" />
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mt-2 animate-pulse">กำลังดึงข้อมูลสาระประวัติผู้เรียน...</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4 flex-1 flex flex-col">
          {history.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-555 flex-1 flex flex-col justify-center items-center shadow-sm" id="empty-history-state">
              <AlertCircle className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">คุณยังไม่มีประวัติสะสมในระบบ</p>
              <button 
                onClick={() => onNavigate('setup')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-650 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-650 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                เริ่มสอบข้อแรกทันทีเลย!
              </button>
            </div>
          ) : (
            history.map((session, sIdx) => {
              const sessionKey = session.id || `session_idx_${sIdx}`;
              const isExpanded = expandedSession === sessionKey;
              const sessionTotalTime = session.answers.reduce((acc, a) => acc + a.timeSpent, 0);

              return (
                <div 
                  key={sessionKey} 
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all"
                  id={`history-row-${sessionKey}`}
                >
                  {/* Summary Block row */}
                  <div 
                    onClick={() => toggleExpand(sessionKey)}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50/50 transition-colors select-none text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-bold text-slate-800">
                          คะแนน {session.totalScore} / {session.maxScore} pts
                        </span>
                        <span className={`inline-flex rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                          session.difficulty === 'easy' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                            : session.difficulty === 'medium' 
                              ? 'bg-amber-50 text-amber-700 border-amber-150' 
                              : 'bg-rose-50 text-rose-700 border-rose-150'
                        }`}>
                          ระดับ: {session.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono font-medium">
                          <Calendar className="h-3 w-3" />
                          {formatDateString(session.completedAt)}
                        </span>
                        <span className="flex items-center gap-1 font-mono font-medium">
                          <Timer className="h-3 w-3" />
                          {formatTime(sessionTotalTime)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4" id="row-chevron-group">
                      <div className="text-right leading-tight">
                        <p className="text-xs font-bold text-emerald-600">{Math.round(session.percentage)}% ครบถ้วน</p>
                        <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wide mt-1">ถูก {session.answers.filter(a => a.isCorrect).length} ข้อ</p>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="h-4.5 w-4.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Drilling Dropdown Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-[#FAFBFD] p-5 space-y-4 text-left" id="expanded-row-block">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">วิเคราะห์บันทึกรายข้อคำถาม:</h4>
                      
                      <div className="grid gap-4.5" id="drilled-questions-grid">
                        {session.answers.map((answer, aIdx) => (
                          <div 
                            key={aIdx} 
                            className="rounded-xl border border-slate-205 bg-white p-4.5 space-y-3.5 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 text-left">
                                <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-700 font-bold border border-indigo-150 bg-indigo-50 rounded-md px-1.5 py-0.5">
                                  หมวดวิชา: {answer.topic}
                                </span>
                                <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans pt-1">
                                  ข้อ {aIdx + 1}: {answer.questionText}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-right shrink-0">
                                {answer.isCorrect ? (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-150 px-2.5 py-1 text-[9px] font-bold text-emerald-605 uppercase tracking-widest">
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> ถูกต้อง
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-150 px-2.5 py-1 text-[9px] font-bold text-rose-600 uppercase tracking-widest">
                                    <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" /> ผิดพลาด
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Question statistics metadata */}
                            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-2 text-[10px] text-slate-505 font-mono uppercase tracking-wider font-bold">
                              <span>คะแนนที่ได้รับ: <strong className="text-emerald-600 font-bold">{answer.scoreEarned} pts</strong></span>
                              <span>เวลาทำข้อนี้: <strong className="text-slate-700 font-bold">{answer.timeSpent} วินาที</strong></span>
                              <span>คำใบ้: <strong className="text-indigo-650 font-bold">{answer.usedHint ? 'ใช้งาน' : 'ไม่ใช้งาน'}</strong></span>
                            </div>

                            {/* Saved student input values */}
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                              <span className="text-[9px] font-bold text-slate-400 block font-mono uppercase tracking-widest border-b border-slate-100 pb-1 mb-1.5">คำตอบของคุณสะสม:</span>
                              <pre className="font-mono text-xs text-indigo-700 whitespace-pre-wrap max-w-full leading-relaxed overflow-x-auto font-semibold">
                                {answer.userAnswer || 'ไม่ได้ป้อนคำตอบ'}
                              </pre>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
