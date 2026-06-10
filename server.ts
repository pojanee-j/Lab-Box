import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Initialize Google GenAI client safely with strict fallback if key is missing
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && !apiKey.includes('MY_GEMINI_API_KEY')) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Google GenAI SDK successfully initialized on the server.');
  } catch (err) {
    console.error('Failed to initialize Google GenAI SDK:', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined or is placeholder. AI suggestions will use static analysis fallback.');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API ROUTE: AI-powered Programmer Coach explanation ---
  app.post('/api/gemini/explain', async (req, res) => {
    try {
      const { displayName, difficulty, totalScore, maxScore, percentage, topicStats, answers } = req.body;

      if (!ai) {
        // High-fidelity static analysis fallback if Gemini Key is not configured yet
        const worstTopic = getMockWorstTopic(topicStats);
        const bestTopic = getMockBestTopic(topicStats);

        return res.json({
          text: `### 🚀 วิเคราะห์ผลการเล่น (โหมดทดลอง - แนะนำเชื่อมต่อนักพัฒนาคีย์ในระบบ Secrets!)

สวัสดีคุณ **${displayName || 'ผู้เล่น'}**! ยินดีต้อนรับสู่หนทางแห่งยอดนักพัฒนาโปรแกรมคอมพิวเตอร์ นี่คือการวิเคราะห์ประเมินผลในระดับความยาก **${difficulty}**:

- **เลเวลความสามารถโดยรวม:** คุณทำคะแนนได้ **${totalScore} / ${maxScore}** คิดเป็น **${Math.round(percentage)}%**
- **จุดเด่นที่สุดของคุณ 🌟:** หัวข้อ **"${bestTopic}"** แสดงให้เห็นว่าคุณมีความเข้าใจในตรรกะพื้นฐานขั้นตอนนั้นได้ดีมาก! ควรรักษาความแข็งแกร่งนี้ไว้เพื่อเรียนรู้หัวข้อถัดไป
- **จุดที่ปรับปรุงได้อีกนิด 🛠️:** หัวข้อ **"${worstTopic}"** เป็นจุดที่คุณตอบผิดหรือใช้คำใบ้บ่อยที่สุดในรอบนี้
- **คำแนะนำตรรกะ:** 
  1. หากเป็นหัวข้อ *Loops*, ตรวจสอบจุดสิ้นสุดเสมอเพื่อป้องกัน Infinite Loops! 
  2. หากเป็นเรื่อง *Arrays*, ระวังเรื่อง Off-By-One (จำไว้ว่าโปรแกรมเมอร์เริ่มนับจากดัชนี 0 เสมอ!)
  3. หมั่นฝึกฝนตรรกะ Boolean (AND, OR, NOT) เป็นประจำจะช่วยยกระดับความเร็วในการเขียนโปรแกรมได้อย่างมาก`
        });
      }

      // Format current stats for Gemini prompt context
      const topicsText = Object.entries(topicStats || {})
        .map(([name, stat]: any) => `- ${name}: ถูก ${stat.correct}/${stat.total}`)
        .join('\n');

      const prompt = `
คุณเป็น "AI Senior Developer Coach" ผู้ใจดี มีอารมณ์ขัน และเชี่ยวชาญการสอนนักศึกษาปี 1 
หน้าที่ของคุณคือวิเคราะห์ผลการแก้โจทย์ตรรกะคอมพิวเตอร์ (Programming Logic Game) และเขียนรายงานแนะนำตัวผู้เล่นด้วยสไตล์ Gamified/Programmer (ใช้คำศัพท์ไทย-อังกฤษวัยรุ่นและนักเขียนโค้ด เช่น Debug, Code, Compiler, Stack, Level Up, Infinite Loop, Array Index).

ข้อมูลสรุปการเล่นของผู้เรียน:
- ชื่อนักศึกษา: ${displayName || 'User'}
- ระดับความยาก: ${difficulty}
- คะแนนที่ได้: ${totalScore} คะแนน จากคะแนนเต็ม ${maxScore} คะแนน (คิดเป็น ${Math.round(percentage)}%)
- สถิติตามหัวข้อหลักของคำถาม:
${topicsText}

กรุณาวิเคราะห์และจัดโครงสร้างรายละเอียดออกเป็น 3 หัวข้ออย่างอบอุ่นและสร้างแรงบันดาลใจ:
1. **หัวข้อเด่นที่สุดยอดยอดเยี่ยม (Strongest Skill 🌟)**: วิเคราะห์หัวข้อที่ตอบถูกที่สุด อธิบายว่าทำไมสิ่งนี้ถึงสำคัญในโลกทำงานจริงของนักเขียนโปรแกรม
2. **หัวข้อที่ต้องนำไป Debug ด่วน (Weakest Area to Debug 🛠️)**: วิเคราะห์หัวข้อที่ทำได้น้อยที่สุด อธิบายข้อควรระวังสำคัญแบบเข้าใจง่ายๆ เช่น ปัญหา Off-by-one ใน Array, สับสน operator logic, หรือ loop ที่ไม่มีวันสิ้นสุด
3. **คำแนะนำแบบ Level Up สำหรับนักศึกษาค่ายฝึกสอนปี 1 Step-by-Step**: สั้นกระชับ เพื่อพิชิตคะแนนเวอร์ชันถัดไป

เขียนในภาษาไทยที่อ่านสนุก สรรพนามเรียกตัวเองว่า "พี่โค้ช AI" หรือ "Senior Dev Coach" และเรียกนักศึกษาว่า "น้อง Dev" หรือคุณโปรแกรมเมอร์ฝึกหัด ใช้การจัดฟอร์แมตแบบ Markdown ที่น่าอ่าน สวยงาม ไม่ยาวเกินไป
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
        }
      });

      const generatedText = response.text || 'ไม่สามารถสร้างบทวิเคราะห์ได้ในขณะนี้';
      res.json({ text: generatedText });

    } catch (err: any) {
      console.error('Failed to query Gemini API:', err);
      res.status(500).json({ error: 'Failed to generate summary text via Gemini', details: err.message });
    }
  });

  // Helper static extractors for mock AI
  function getMockWorstTopic(stats: any): string {
    if (!stats || Object.keys(stats).length === 0) return 'Loop & Iteration';
    let worst = '';
    let minRate = 1.1;
    for (const [name, stat] of Object.entries(stats) as any) {
      const rate = stat.total > 0 ? stat.correct / stat.total : 0;
      if (rate < minRate) {
        minRate = rate;
        worst = name;
      }
    }
    return worst;
  }

  function getMockBestTopic(stats: any): string {
    if (!stats || Object.keys(stats).length === 0) return 'Variable & Assignment';
    let best = '';
    let maxRate = -0.1;
    for (const [name, stat] of Object.entries(stats) as any) {
      const rate = stat.total > 0 ? stat.correct / stat.total : 0;
      if (rate > maxRate) {
        maxRate = rate;
        best = name;
      }
    }
    return best;
  }

  // --- VITE MIDDLEWARE INTERPOLATION ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted on Express.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[START] Full-stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
