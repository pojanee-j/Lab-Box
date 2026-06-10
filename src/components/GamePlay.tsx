import { useState, useEffect } from 'react';
import { Timer, HelpCircle, Play, AlertCircle, RotateCcw, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { Question, PlayerAnswer } from '../types';
import { calculateQuestionScore } from '../utils';

interface GamePlayProps {
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  onComplete: (answers: PlayerAnswer[]) => void;
  onCancel: () => void;
}

export default function GamePlay({ difficulty, questions, onComplete, onCancel }: GamePlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Scoring parameters for active question
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [showHintText, setShowHintText] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Aggregate answers tracking
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);

  // Input states variable depending on type
  const [selectedMCQ, setSelectedMCQ] = useState<string>('');
  const [blankInput, setBlankInput] = useState<string>('');
  
  // Order steps list managers
  const [orderedBlocks, setOrderedBlocks] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);

  // Feedback parameters
  const [feedback, setFeedback] = useState<{
    shown: boolean;
    isCorrect: boolean;
    errorText?: string;
    pointsEarned?: number;
  }>({ shown: false, isCorrect: false });

  const currentQuestion = questions[currentIndex];

  // Incremental core timer
  useEffect(() => {
    if (feedback.shown) return; // Freeze timer on feedback view

    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, feedback.shown]);

  // Sync available sorting blocks on active sorting question
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'order_steps' && currentQuestion.correctOrder) {
      // Shuffle the correct blocks initially
      const shuffled = [...currentQuestion.correctOrder].sort(() => Math.random() - 0.5);
      setAvailableBlocks(shuffled);
      setOrderedBlocks([]);
    }
  }, [currentIndex, currentQuestion]);

  if (!currentQuestion) {
    return (
      <div className="py-20 text-center flex-1 flex flex-col justify-center items-center" id="gameplay-error-state">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <p className="mt-4 text-sm font-semibold text-slate-500">เกิดข้อผิดพลาดในการโหลดคำถามตรรกะ</p>
        <button onClick={onCancel} className="mt-4 rounded-xl bg-slate-850 px-5 py-2.5 text-xs font-bold text-white cursor-pointer hover:bg-slate-700">กลับแดชบอร์ด</button>
      </div>
    );
  }

  const handleSelectBlock = (block: string) => {
    setOrderedBlocks([...orderedBlocks, block]);
    setAvailableBlocks(availableBlocks.filter(b => b !== block));
  };

  const handleRemoveBlock = (block: string) => {
    setAvailableBlocks([...availableBlocks, block]);
    setOrderedBlocks(orderedBlocks.filter(b => b !== block));
  };

  const handleResetBlocks = () => {
    if (currentQuestion.correctOrder) {
      setAvailableBlocks([...currentQuestion.correctOrder].sort(() => Math.random() - 0.5));
      setOrderedBlocks([]);
    }
  };

  const handleVerifyAnswer = () => {
    let isCorrect = false;

    if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'choose_command' || currentQuestion.type === 'debug_code') {
      isCorrect = selectedMCQ === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'fill_blank') {
      isCorrect = blankInput.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase();
    } else if (currentQuestion.type === 'order_steps') {
      // Check length and index similarity
      const correct = currentQuestion.correctOrder || [];
      if (orderedBlocks.length === correct.length) {
        isCorrect = orderedBlocks.every((block, idx) => block === correct[idx]);
      }
    }

    if (isCorrect) {
      const score = calculateQuestionScore(currentQuestion, usedHint, wrongAttempts, timeSpent);
      setFeedback({
        shown: true,
        isCorrect: true,
        pointsEarned: score
      });
    } else {
      setWrongAttempts((prev) => prev + 1);
      setFeedback({
        shown: true,
        isCorrect: false,
        errorText: currentQuestion.type === 'order_steps' 
          ? '🚨 COMPILATION ERROR: ลำดับขั้นตอนการทำงานผิดพลาด ส่งผลให้โค้ดไม่ได้ผลลัพธ์ที่ถูกต้อง'
          : '🚨 LOGIC ASSERTION ERROR: คำตอบผิดพลาด ไม่สอดคล้องกับวิเคราะห์เงื่อนไขตรรกะที่กำหนด'
      });
    }
  };

  const handleNextQuestion = () => {
    // Record answer
    const currentAnswerRecord: PlayerAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.questionText,
      type: currentQuestion.type,
      topic: currentQuestion.topic,
      isCorrect: true, // They must get it right to proceed
      scoreEarned: feedback.pointsEarned || 0,
      timeSpent: timeSpent,
      usedHint: usedHint,
      userAnswer: selectedMCQ || blankInput || orderedBlocks.join(' | ')
    };

    const nextAnswers = [...answers, currentAnswerRecord];
    setAnswers(nextAnswers);

    // Reset current question states
    setWrongAttempts(0);
    setUsedHint(false);
    setShowHintText(false);
    setTimeSpent(0);
    setSelectedMCQ('');
    setBlankInput('');
    setOrderedBlocks([]);
    setAvailableBlocks([]);
    setFeedback({ shown: false, isCorrect: false });

    // Navigate next or finish
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Game session complete
      onComplete(nextAnswers);
    }
  };

  // Prettify code snippets for IDE view
  const renderCodeSnippet = (snippet: string) => {
    const lines = snippet.split('\n');
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white font-mono text-xs text-slate-800 shadow-md select-none" id="simulated-ide-terminal">
        {/* IDE Title Bar */}
        <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-[10px] text-slate-500 border-b border-slate-205">
          <span className="flex items-center gap-1.5 font-bold text-indigo-650 uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            playground.py - Python sandbox
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-450">UTF-8 // Python 3</span>
        </div>
        
        {/* Code Blocks */}
        <div className="p-4 overflow-auto max-h-[300px] text-left bg-slate-50/50">
          <table className="w-full">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="align-top hover:bg-slate-100/50 transition-colors">
                  <td className="text-right pr-4 text-slate-400 select-none border-r border-slate-200 w-10 font-medium">
                    {i + 1}
                  </td>
                  <td className="pl-4 whitespace-pre text-slate-800 font-semibold">
                    {line.includes('#') ? (
                      <span className="text-slate-400 italic">{line}</span>
                    ) : (
                      line.split(' ').map((word, wIdx) => {
                        const keywords = ['def', 'class', 'import', 'while', 'for', 'in', 'if', 'else', 'elif', 'return', 'print', 'and', 'or', 'not', 'True', 'False', 'lambda'];
                        const cleanedWord = word.replace(/[^a-zA-Z]/g, '');
                        if (keywords.includes(cleanedWord)) {
                          return <span key={wIdx} className="text-indigo-600 font-bold">{word} </span>;
                        }
                        if (word.match(/^-?\d+$/)) {
                          return <span key={wIdx} className="text-amber-600 font-bold">{word} </span>;
                        }
                        return word + ' ';
                      })
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 flex-1 flex flex-col animate-fade-in" id="game-engine-viewport">
      
      {/* HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-205 pb-4" id="game-runtime-hud">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 border border-slate-250 px-3.5 py-1.5 font-mono text-xs font-extrabold text-slate-850 uppercase tracking-wide shadow-sm">
            คำถาม {currentIndex + 1} จาก {questions.length}
          </span>
          <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-black uppercase tracking-wider border ${
            difficulty === 'easy' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : difficulty === 'medium' 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}>
            ระดับ: {difficulty}
          </span>
        </div>

        {/* Live scoring analytics preview */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-sm text-slate-800 font-extrabold uppercase tracking-wider">
            <Timer className="h-4 w-4 text-emerald-700 animate-pulse" />
            <span>เวลาข้อนี้: <strong className="text-slate-950 font-black">{timeSpent}s</strong></span>
          </div>
          <div className="text-sm font-extrabold text-slate-800 uppercase tracking-widest leading-none">
            เป้าหมายข้อนี้: <span className="font-mono text-indigo-700 text-sm font-black text-glow">
              {calculateQuestionScore(currentQuestion, usedHint, wrongAttempts, timeSpent)}
            </span> / {currentQuestion.points} pts
          </div>
        </div>
      </div>

      {/* Main Grid: Left Question, Right Code and Inputs */}
      <div className="mt-8 grid gap-8 lg:grid-cols-5 flex-1" id="gameplay-workspace-layout">
        
        {/* Left Col: Description & Hints */}
        <div className="lg:col-span-2 space-y-6 text-left flex flex-col justify-between" id="gameplay-question-description-zone">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-950 font-black border border-emerald-300 bg-emerald-100 rounded-md px-3 py-1 shadow-sm">
              บทเรียน: {currentQuestion.topic}
            </span>
            <h3 className="text-lg font-black leading-relaxed text-slate-950 font-sans">
              {currentQuestion.questionText}
            </h3>

            {/* Prompt Hint triggers */}
            <div className="rounded-2xl border border-slate-205 bg-white p-5 shrink-0 shadow-sm">
              {!usedHint ? (
                <button
                  onClick={() => {
                    setUsedHint(true);
                    setShowHintText(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 border border-indigo-300 py-3 text-sm font-black text-indigo-900 hover:bg-indigo-100 transition-all cursor-pointer"
                  id="btn-reveal-hint"
                >
                  <HelpCircle className="h-4 w-4 text-indigo-650" />
                  เปิดดูคำใบ้โปรแกรมเมอร์ (-20 คะแนน)
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="font-sans text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-indigo-700 rounded-full animate-ping" />
                    💡 คัมภีร์ใบ้คำตอบ:
                  </p>
                  <p className="text-sm leading-relaxed text-indigo-950 font-bold bg-indigo-50 border border-indigo-250 p-3 rounded-xl font-sans">
                    {currentQuestion.hint}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-black text-slate-705 hover:text-rose-800 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl px-3.5 py-2 transition-all inline-flex items-center gap-1.5 self-start cursor-pointer shadow-sm"
          >
            🚫 ออกจากการทดสอบกลางคัน
          </button>
        </div>

        {/* Right Col: IDE Screen & Input board */}
        <div className="lg:col-span-3 space-y-6 text-left flex flex-col justify-start" id="gameplay-ide-answer-zone">
          
          {/* Render Code Segment */}
          {currentQuestion.codeSnippet && renderCodeSnippet(currentQuestion.codeSnippet)}

          {/* Dynamic Interactive Input Modules depending on Question Type */}
          <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm" id="input-container-card">
            
            {/* TYPE: MULTIPLE CHOICE or CHOOSE COMMAND or DEBUG CODE */}
            {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'choose_command' || currentQuestion.type === 'debug_code') && (
              <div className="space-y-3 shrink-0">
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">กรุณาเลือกตัวเลือกที่สมบูรณ์ที่สุด:</p>
                <div className="grid gap-3" id="mcq-choices-panel">
                  {currentQuestion.choices?.map((choice) => {
                    const isSelected = selectedMCQ === choice;
                    return (
                      <button
                        key={choice}
                        disabled={feedback.shown && feedback.isCorrect}
                        onClick={() => setSelectedMCQ(choice)}
                        className={`flex items-center gap-3.5 rounded-xl border p-4 text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-1 ring-indigo-500'
                            : 'border-slate-205 bg-slate-50 text-slate-705 hover:bg-slate-100/70 hover:border-slate-300'
                        }`}
                      >
                        <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white text-[9px]' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TYPE: FILL BLANK */}
            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-4 text-left">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2 block">กรอกค่าของคุณลงในฟิลด์ด้านล่าง:</label>
                <input
                  type="text"
                  placeholder="พิมพ์ทศนิยมหรือตัวเลข..."
                  disabled={feedback.shown && feedback.isCorrect}
                  value={blankInput}
                  onChange={(e) => setBlankInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-sm font-semibold"
                  id="fill-blank-text-field"
                />
              </div>
            )}

            {/* TYPE: ORDER STEPS */}
            {currentQuestion.type === 'order_steps' && (
              <div className="space-y-5 text-left" id="block-sorting-board">
                
                {/* Sorted output */}
                <div>
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-sans">ขั้นตอนทำงานของคุณ (Your Output):</span>
                    {orderedBlocks.length > 0 && !feedback.isCorrect && (
                      <button 
                        onClick={handleResetBlocks} 
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-500 cursor-pointer uppercase tracking-wider"
                        id="reset-blocks-btn"
                      >
                        <RotateCcw className="h-3 w-3" /> ล้างบอร์ด
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-2 min-h-[140px] rounded-xl border border-dashed border-slate-250 bg-slate-50/50 p-3.5 space-y-2">
                    {orderedBlocks.length === 0 ? (
                      <p className="text-center text-[11px] text-slate-400 py-10 font-semibold font-sans">คลิกที่บล็อกโค้ดด้านล่างเพื่อจัดเรียงตามลำดับจากบนลงล่าง</p>
                    ) : (
                      orderedBlocks.map((block, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => !feedback.isCorrect && handleRemoveBlock(block)}
                          className="flex items-center justify-between rounded-lg border border-indigo-150 bg-indigo-50/80 px-3.5 py-2.5 font-mono text-xs text-indigo-950 shadow-sm cursor-pointer hover:border-rose-200 hover:bg-rose-50 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] text-indigo-600 font-bold">{idx + 1}.</span>
                            <span>{block}</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans">tap to remove</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Available lists */}
                {availableBlocks.length > 0 && !feedback.isCorrect && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5 block font-sans">บล็อกคำสั่งที่เลือกได้ (Available Blocks):</span>
                    <div className="mt-2 grid gap-2">
                      {availableBlocks.map((block, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectBlock(block)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-left text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-white transition-all cursor-pointer block w-full text-truncate"
                        >
                          {block}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Verify Controllers */}
            {!feedback.isCorrect && (
              <div className="mt-5 flex justify-end">
                <button
                  disabled={
                    (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'choose_command' || currentQuestion.type === 'debug_code') && !selectedMCQ ||
                    (currentQuestion.type === 'fill_blank' && !blankInput) ||
                    (currentQuestion.type === 'order_steps' && orderedBlocks.length === 0)
                  }
                  onClick={handleVerifyAnswer}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-6 py-3.5 text-sm font-black text-white hover:bg-indigo-600 hover:shadow-indigo-600/20 shadow-md cursor-pointer transition-all active:scale-97 disabled:opacity-40 disabled:pointer-events-none"
                  id="btn-verify-logic-submission"
                >
                  <Play className="h-4 w-4 shrink-0 text-emerald-400 animate-pulse" />
                  ส่งตรวจวิเคราะห์หน่วยประมวลผล (Run Code)
                </button>
              </div>
            )}

          </div>

          {/* Feedback Screen overlay */}
          {feedback.shown && (
            <div 
              className={`rounded-2xl border-2 p-6 text-left shadow-lg transition-transform ${
                feedback.isCorrect
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-rose-300 bg-rose-50'
              }`}
              id="verification-result-log"
            >
              <div className="flex items-start gap-4">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-705 mt-0.5" />
                ) : (
                  <AlertCircle className="h-6 w-6 shrink-0 text-rose-600 mt-0.5" />
                )}
                <div className="space-y-3 w-full">
                  <div>
                    <h4 className={`text-sm font-black tracking-wide uppercase ${feedback.isCorrect ? 'text-emerald-950' : 'text-rose-950'}`}>
                      {feedback.isCorrect ? '✅ COMPILE SUCCESS: ผลลัพธ์สมบูรณ์แบบ!' : '❌ COMPILE FAILED: มีจุดบกพร่องในระบบ'}
                    </h4>
                    <p className="text-sm mt-1.5 text-slate-900 leading-relaxed font-black font-sans">
                      {feedback.isCorrect 
                        ? `คุณแก้โจทก์เสร็จสิ้นสำเร็จ และสามารถเก็บคะแนนสะสมสุทธิไปได้ถึง +${feedback.pointsEarned} คะแนน!` 
                        : feedback.errorText}
                    </p>
                  </div>

                  {feedback.isCorrect && (
                    <div className="rounded-xl bg-white border border-slate-350 p-4 shadow-sm">
                      <p className="flex items-center gap-1.5 text-xs font-sans font-black text-emerald-900 uppercase tracking-wider mb-2">
                        <BookOpen className="h-4 w-4 text-emerald-700" />
                        คำอธิบายวิชาตรรกะแบบโปรแกรมเมอร์:
                      </p>
                      <p className="text-sm leading-relaxed text-slate-900 whitespace-pre-line font-bold font-sans">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    {!feedback.isCorrect ? (
                      <button
                        onClick={() => setFeedback({ shown: false, isCorrect: false })}
                        className="rounded-xl bg-white border border-slate-250 text-rose-850 hover:bg-rose-100 px-5 py-2.5 text-sm font-black transition-all cursor-pointer shadow-sm"
                        id="retry-failed-compilation-btn"
                      >
                        ปิดเพื่อดีบั๊กแก้ไข
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 hover:bg-emerald-805 px-5 py-2.5 text-sm font-black text-white shadow-md hover:shadow-emerald-900/15 transition-all cursor-pointer"
                        id="advance-next-line-btn"
                      >
                        {currentIndex + 1 === questions.length ? 'สิ้นสุดความท้าทาย' : 'คำถามถัดไป'}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
