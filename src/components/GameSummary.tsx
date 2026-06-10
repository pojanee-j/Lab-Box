import { useEffect, useState } from 'react';
import { Award, Timer, RefreshCw, BarChart2, BookOpen, AlertCircle, ArrowLeft, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { GameSession } from '../types';
import { formatTime } from '../utils';

interface GameSummaryProps {
  session: GameSession;
  onNavigate: (page: any) => void;
  onReplay: () => void;
}

export default function GameSummary({ session, onNavigate, onReplay }: GameSummaryProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(true);
  const [errorAi, setErrorAi] = useState(false);

  // Trigger Gemini AI Coach analysis instantly on landing
  useEffect(() => {
    let active = true;

    async function fetchCoachingSuggestion() {
      try {
        setLoadingAi(true);
        setErrorAi(false);
        const res = await fetch('/api/gemini/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            displayName: session.displayName,
            difficulty: session.difficulty,
            totalScore: session.totalScore,
            maxScore: session.maxScore,
            percentage: session.percentage,
            topicStats: session.topicStats,
            answers: session.answers.map(ans => ({
              topic: ans.topic,
              isCorrect: ans.isCorrect,
              usedHint: ans.usedHint
            }))
          }),
        });

        if (!res.ok) {
          throw new Error('Server returned error status');
        }

        const data = await res.json();
        if (active) {
          setAiAnalysis(data.text || 'ไม่สามารถวิเคราะห์ได้ในขณะนี้');
        }
      } catch (err) {
        console.error('Failed to communicate with local Gemini API', err);
        if (active) {
          setErrorAi(true);
        }
      } finally {
        if (active) {
          setLoadingAi(false);
        }
      }
    }

    fetchCoachingSuggestion();

    return () => {
      active = false;
    };
  }, [session]);

  const totalTime = session.answers.reduce((acc, ans) => acc + ans.timeSpent, 0);

  // Elegant helper to render rudimentary markdown securely
  const renderMockupMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-4 font-sans text-xs leading-relaxed text-slate-700 font-medium">
        {lines.map((line, idx) => {
          let clean = line.trim();
          
          if (clean.startsWith('###')) {
            return (
              <h5 key={idx} className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4">
                {clean.replace('###', '').trim()}
              </h5>
            );
          }
          if (clean.startsWith('##')) {
            return (
              <h4 key={idx} className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4">
                {clean.replace('##', '').trim()}
              </h4>
            );
          }
          if (clean.startsWith('**') || clean.startsWith('1.') || clean.startsWith('-')) {
            // Check list lines
            if (clean.startsWith('-') || clean.startsWith('*')) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{clean.replace(/^[-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                </div>
              );
            }
            if (clean.match(/^\d+\./)) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  <span className="text-emerald-600 font-mono font-bold">{clean.match(/^\d+\./)?.[0]}</span>
                  <span>{clean.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                </div>
              );
            }
          }

          // Render bold words simply
          const chunks = line.split('**');
          if (chunks.length > 1) {
            return (
              <p key={idx}>
                {chunks.map((chunk, i) => (i % 2 === 1 ? <strong key={i} className="text-indigo-900 font-bold">{chunk}</strong> : chunk))}
              </p>
            );
          }

          if (clean === '') {
            return <div key={idx} className="h-2" />;
          }

          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 animate-fade-in" id="game-summary-viewport">
      
      {/* Finish Banner card */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-md">
          <Award className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          การทดสอบประเมินโค้ดเสร็จสมบูรณ์!
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-semibold">
          คุณทำคะแนนได้ยอดเยี่ยม มาดูผลวิเคราะห์ตรรกะ Python ของคุณกัน
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3" id="scores-analytical-grid">
        
        {/* Core Percentage Card */}
        <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm text-center flex flex-col justify-center items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">อัตราความถูกต้อง</span>
          <div className="relative mt-4 flex items-center justify-center">
            {/* Round Percentage SVG */}
            <svg className="h-28 w-28 transform -rotate-90">
              <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle 
                cx="56" 
                cy="56" 
                r="46" 
                stroke="#10b981" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * session.percentage) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-sans text-2xl font-bold text-slate-800">{Math.round(session.percentage)}%</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">ตอบถูกทั้งหมดในชุดการทดสอบนี้</p>
        </div>

        {/* Total Scores Card */}
        <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">คะแนนสะสมสุทธิ</span>
            <p className="mt-6 font-sans text-4xl font-extrabold text-emerald-600">{session.totalScore}</p>
            <p className="text-xs text-slate-400 mt-1">จากคะแนนดิบเต็มสะสม {session.maxScore} pts</p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 w-full text-xs text-slate-500 font-bold">
            ระดับความยาก: <span className="text-indigo-600 uppercase font-bold">{session.difficulty}</span>
          </div>
        </div>

        {/* Time spent Card */}
        <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">เวลารวมที่ใช้ไป</span>
            <div className="mt-6 flex items-center justify-center gap-1.5 text-slate-800 font-semibold">
              <Timer className="h-6 w-6 text-indigo-500 shrink-0" />
              <span className="font-mono text-3xl font-extrabold">{formatTime(totalTime)}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">เฉลี่ยเวลาต่อข้อ: {Math.round(totalTime / session.answers.length)} วินาที</p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 w-full text-xs text-slate-505 font-bold">
            จำนวนปัญหาที่ตอบตรวจ: <span className="text-slate-805 font-bold">{session.answers.length} ข้อ</span>
          </div>
        </div>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2" id="summary-proficiency-split">
        
        {/* Left: topics breakdown detail logs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-left">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="h-4.5 w-4.5 text-emerald-600" />
            ตารางผลประกอบย่อยตามวิชาข้อสอบ
          </h3>
          <div className="mt-5 space-y-4">
            {Object.entries(session.topicStats).map(([topic, stat]) => {
              const rat = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
              return (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{topic}</span>
                    <span className="font-mono text-slate-450">ถูก {stat.correct} / {stat.total} ข้อ</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        rat >= 80 ? 'bg-emerald-500' : rat >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${rat}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Career Coaching Panel (Gemini powered) */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/10 to-white p-6 shadow-sm text-left flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-650" />
              รายงานวิเคราะห์และให้คำแนะนำโดย พี่โค้ช AI
            </h3>

            <div className="mt-4" id="ai-coaching-output-box">
              {loadingAi ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-650" />
                  <p className="text-xs font-semibold text-slate-500">
                    พี่โค้ช AI กำลังดูผลโค้ดสอบของคุณ และประมวลผลข้อความแนะแนวแบบตัวต่อตัว...
                  </p>
                </div>
              ) : errorAi ? (
                <div className="rounded-xl border border-red-105 bg-rose-50/50 p-4 text-center">
                  <AlertCircle className="mx-auto h-5 w-5 text-rose-600" />
                  <p className="mt-2 text-xs font-semibold text-rose-800">
                    ไม่สามารถติดต่อบริการประมวลคำจาก Google AI Studio ได้ในขณะนี้ ขออภัยในระบบขัดข้อง
                  </p>
                </div>
              ) : (
                <div className="bg-indigo-50/30 border border-indigo-100 p-4 rounded-xl max-h-[260px] overflow-auto">
                  {renderMockupMarkdown(aiAnalysis)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono font-bold">
            <span>MODEL: GEMINI-2.5-FLASH</span>
            <span className="flex items-center gap-1 text-slate-450">
              <MessageSquare className="h-3 w-3" /> THAI COACHING
            </span>
          </div>
        </div>

      </div>

      {/* Button Controls */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded-xl border border-slate-205 px-4 py-2.5 text-xs font-bold text-slate-500 bg-white hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
          id="summary-back-home-btn"
        >
          <ArrowLeft className="h-4 w-4" /> แดชบอร์ด portal
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('history')}
            className="rounded-xl border border-slate-205 px-4 py-2.5 text-xs font-bold text-slate-500 bg-white hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            ดูประวัติการทดสอบ
          </button>
          <button
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-650 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition-colors shadow-md cursor-pointer active:scale-98"
          >
            <RefreshCw className="h-4 w-4" /> ทำโจทย์อีกรอบ (Replay)
          </button>
        </div>
      </div>

    </div>
  );
}
