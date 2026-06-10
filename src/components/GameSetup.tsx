import { Shield, Sparkles, Zap, ArrowRight, CornerDownRight, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface GameSetupProps {
  onStartGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
}

export default function GameSetup({ onStartGame, onBack }: GameSetupProps) {
  const [selected, setSelected] = useState<'easy' | 'medium' | 'hard'>('easy');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 flex-1 flex flex-col justify-center text-left animate-fade-in" id="game-setup-panel">
      
      {/* Set Title */}
      <div className="text-center">
        <h3 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          ตั้งค่าชุดการทดสอบตรรกะโค้ด (Python Edition)
        </h3>
        <p className="mt-2 text-sm text-slate-700 max-w-lg mx-auto leading-relaxed font-bold">
          ระดับความยากจะทำการเลือกสุ่มคำถามที่เป็นมาตรฐานของห้องเรียนวิทยาการคอมพิวเตอร์และผู้ศึกษาเบื้องต้น
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3" id="difficulty-grid-setup">
        
        {/* Easy Option */}
        <div 
          onClick={() => setSelected('easy')}
          className={`relative cursor-pointer rounded-2xl border p-5 transition-all text-left flex flex-col justify-between shadow-sm ${
            selected === 'easy' 
              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-500/5' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
          id="difficulty-card-easy"
        >
          <div>
            <div className={`inline-flex rounded-xl p-2.5 ${selected === 'easy' ? 'bg-emerald-500 text-white' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}>
              <Shield className="h-5 w-5" />
            </div>
            <h4 className="mt-4 font-sans text-base font-extrabold text-slate-900">Easy เลเวลพื้นฐาน</h4>
            <p className="mt-2 text-xs text-slate-800 leading-relaxed font-bold">
              เหมาะสำหรับผู้เรียนเริ่มต้น ทบทวนค่าตัวแปร, การสลับค่าสว็อปปิ้ง (Variable Swapping) และโครงสร้างเงื่อนไข If-Else พื้นฐานใน Python
            </p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3.5">
            <span className="font-mono text-xs font-black text-slate-700 uppercase tracking-wider">5 คำถาม • ข้อละ 50 คะแนน</span>
          </div>
        </div>

        {/* Medium Option */}
        <div 
          onClick={() => setSelected('medium')}
          className={`relative cursor-pointer rounded-2xl border p-5 transition-all text-left flex flex-col justify-between shadow-sm ${
            selected === 'medium' 
              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/20 shadow-md shadow-amber-500/5' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
          id="difficulty-card-medium"
        >
          <div>
            <div className={`inline-flex rounded-xl p-2.5 ${selected === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="mt-4 font-sans text-base font-extrabold text-slate-900">Medium ท้าทายฝีมือ</h4>
            <p className="mt-2 text-xs text-slate-800 leading-relaxed font-bold">
              เจาะลึกมอดูโลเลขคณิต (Modulo Arithmetic), ตรรกะแบบ Boolean compound operators และลำดับแอปพลิเคชัน Loop ใน Python
            </p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3.5">
            <span className="font-mono text-xs font-black text-slate-700 uppercase tracking-wider">7 คำถาม • ข้อละ 100 คะแนน</span>
          </div>
        </div>

        {/* Hard Option */}
        <div 
          onClick={() => setSelected('hard')}
          className={`relative cursor-pointer rounded-2xl border p-5 transition-all text-left flex flex-col justify-between shadow-sm ${
            selected === 'hard' 
              ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-400/20 shadow-md shadow-rose-500/5' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
          id="difficulty-card-hard"
        >
          <div>
            <div className={`inline-flex rounded-xl p-2.5 ${selected === 'hard' ? 'bg-rose-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}>
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="mt-4 font-sans text-base font-extrabold text-slate-900">Hard ระเบิดสมอง</h4>
            <p className="mt-2 text-xs text-slate-800 leading-relaxed font-bold">
              สำหรับดาวเด่นสายเขียนโค้ด ท้าทายกับลูปซ้อนลูป (Nested Loops), การแกะสมการย้อนหลัง (Recursion Trace) และรันไทม์ Binary Search
            </p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3.5">
            <span className="font-mono text-xs font-black text-slate-700 uppercase tracking-wider">10 คำถาม • ข้อละ 150 คะแนน</span>
          </div>
        </div>

      </div>

      {/* Show Formula rules instructions */}
      <div className="mt-8 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm" id="scoring-rules-banner">
        <h4 className="flex items-center gap-1.5 font-sans text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200">
          <AlertTriangle className="h-4.5 w-4.5 text-indigo-700" />
          ระบบคำนวณและประมวลผลคะแนนสอบ (Gamified Scoring Analytics)
        </h4>
        <div className="mt-4 grid gap-4 text-xs text-slate-900 sm:grid-cols-2 font-bold">
          <div className="space-y-3">
            <p className="flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>คะแนนคงที่เริ่มต้น:</strong> {selected === 'easy' ? 50 : selected === 'medium' ? 100 : 150} คะแนน (สเกลตามระดับความยาก)</span>
            </p>
            <p className="flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-rose-600 mt-0.5" />
              <span><strong>การเปิดดูคำใบ้ (Toggle Hint):</strong> หักคะแนนประคองตัว <strong className="text-rose-600">-20 คะแนน</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-rose-600 mt-0.5" />
              <span><strong>ขั้นตอนคำนวณบกพร่อง:</strong> ตอบผิดหักคะแนนสะสม <strong className="text-rose-600">-30 คะแนนต่อครั้ง</strong> (สุ่มตอบต่อใหม่ได้เรื่อยๆ!)</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-emerald-605 mt-0.5" />
              <span><strong>โบนัสอัจฉริยะ (Speed Bonus):</strong> บัฟความไวแก้โจทย์เสร็จใน 15 วินาทีแรก รับทันที <strong className="text-emerald-600">+10 คะแนน</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-rose-600 mt-0.5" />
              <span><strong>การตอบล่าช้า (Slow Penalty):</strong> หากใช้สายตาพินิจนานกว่า 60 วินาที จะลดคะแนนลงคอร์ <strong className="text-rose-600">-10 คะแนน</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-indigo-600 mt-0.5" />
              <span><strong>เกราะคำนวณเซฟตี้บัฟ:</strong> แม้จะถูกตัวหักคะแนนรุนแรง คุณจะได้รับสิทธิ <strong className="text-indigo-600">คะแนนคุ้มกันขั้นต่ำ 10% ทุกเป้าหมายเกม</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          onClick={onBack}
          className="rounded-xl border border-slate-250 px-5 py-3 text-sm font-bold text-slate-700 bg-white hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer"
          id="setup-back-btn"
        >
          กลับหน้าหลัก
        </button>
        <button
          onClick={() => onStartGame(selected)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-650 px-6 py-3 text-sm font-black text-white hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-600/20 cursor-pointer active:scale-98"
          id="launch-sandbox-compile-btn"
        >
          สร้างรันไทม์ชุดคำถาม
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
