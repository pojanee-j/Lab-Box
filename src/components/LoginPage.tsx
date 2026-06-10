import React, { useState } from 'react';
import { Terminal, Shield, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { authService, isMock } from '../lib/firebase';

interface LoginPageProps {
  onLoginSuccess: (user: { uid: string; displayName: string; email: string }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorText('กรุณาพิมพ์ชื่อแสดงตนหรือรหัสประจำตัวของคุณเพื่อเข้าห้องเรียน');
      return;
    }
    
    try {
      setLoading(true);
      setErrorText('');
      const profile = await authService.loginWithGoogle(studentName.trim());
      onLoginSuccess(profile);
    } catch (err) {
      setErrorText('เกิดข้อผิดพลาดในการจําลองผู้ใช้');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorText('');
      const profile = await authService.loginWithGoogle();
      onLoginSuccess(profile);
    } catch (err: any) {
      console.error(err);
      setErrorText('การเข้าสู่ระบบผ่าน Google ล้มเหลว โปรดตรวจสอบเงื่อนไขความปลอดภัยหรือยืนยัน credentials ใน Firebase Console ของคุณ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F8FAFC] py-12 px-6 lg:px-8" id="login-screen">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Terminal Header Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/25 animate-pulse">
          <Terminal className="h-7 w-7" />
        </div>
        
        <h2 className="mt-6 text-center font-display text-3xl font-black tracking-tight text-slate-900">
          Logic<span className="text-indigo-600">Lab</span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-800 max-w-md mx-auto leading-relaxed font-bold">
          พอร์ทัลฝึกฝนตรรกะสำหรับนักศึกษาคอมพิวเตอร์และเทคโนโลยีสารสนเทศชั้นปีที่ 1 (Python Edition)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-[2rem] border border-slate-200 bg-white py-8 px-6 shadow-xl shadow-slate-200/40 sm:px-10">
          
          {isMock ? (
            /* SANDBOX LOCAL DRIVE LOGIN */
            <form onSubmit={handleMockLogin} className="space-y-6" id="mock-login-form">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
                <p className="flex items-center gap-1.5 font-sans text-sm font-black text-amber-950">
                  <Shield className="h-4 w-4 text-amber-850" />
                  เลือกล็อกอินโหมดทดสอบรันไทม์
                </p>
                <p className="mt-1.5 text-xs text-amber-950 leading-relaxed font-bold">
                  ความปลอดภัย: เนื่องจากยังไม่ได้เชื่อมต่อ Firebase Applet ใน Settings ระบบจะบันทึกข้อมูลคะแนนและประวัติคุณไว้ใน Local Storage โดยอัตโนมัติ
                </p>
              </div>

              <div className="text-left">
                <label htmlFor="student-name" className="block text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  ชื่อแสดงตนในห้องเรียน (Student Display Name)
                </label>
                <div className="mt-2">
                  <input
                    id="student-name"
                    name="name"
                    type="text"
                    required
                    placeholder="เช่น สมชาย สู้ชีวิต, Natty_Coder, 65050102"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-xl border border-slate-350 bg-slate-50 px-4 py-3.5 font-sans text-sm text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold shadow-sm"
                  />
                </div>
              </div>

              {errorText && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 py-2.5 px-3 rounded-xl border border-rose-200 text-left">
                  ⚠️ {errorText}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-650 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-600 hover:shadow-indigo-600/25 transition-all cursor-pointer active:scale-98 disabled:opacity-40"
              >
                {loading ? 'กำลังเข้าสู่ระบบรันไทม์...' : 'เริ่มเข้าเรียนตรรกะคอมพิวเตอร์'}
                <ArrowRight className="h-4 w-4 animate-bounce" />
              </button>
            </form>
          ) : (
            /* GENUINE FIREBASE GOOGLE SIGNIN */
            <div className="space-y-6" id="firebase-login-block">
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-left">
                <p className="flex items-center gap-1.5 font-sans text-sm font-black text-emerald-950">
                  <Sparkles className="h-4 w-4 text-emerald-850" />
                  สถาปัตยกรรมคิวรี่ Cloud Database
                </p>
                <p className="mt-1.5 text-xs text-slate-900 leading-relaxed font-bold">
                  ระบบเชื่อมโยงกับ Cloud Firestore อย่างสมบูรณ์ ข้อมูลความสถิติของคุณจะถูกซิงก์ขึ้นตารางคะแนนทั่วโลก (Leaderboard) ทันทีหลังสอบเสร็จ!
                </p>
              </div>

              {errorText && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 py-2.5 px-3 rounded-xl border border-rose-200 text-left">
                  ⚠️ {errorText}
                </p>
              )}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950 transition-all cursor-pointer active:scale-98 disabled:opacity-40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                {loading ? 'กำลังซิงก์สมาคมรหัส...' : 'ลงชื่อเข้าใช้ด้วย Google Account'}
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-5 text-left text-sm text-slate-800 space-y-2.5">
            <p className="flex items-center gap-1.5 font-black text-slate-900">
              <BookOpen className="h-4 w-4 text-indigo-700" />
              โครงสร้างคำถามครอบคลุม:
            </p>
            <p className="leading-relaxed text-slate-800 text-xs font-bold">
              สุ่มคำถามตามระดับความยาก ประกอบด้วย: ค่าตัวแปร, การสืบลำดับลูป (Loops Trace), โจทย์การสลับบิต Boolean, และคอร์ส Recursion สำหรับเรียนคอมพิวเตอร์เบื้องต้นโดยอ้างอิงภาษา Python
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
