import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // --- EASY QUESTIONS (50 Points) ---
  {
    id: 'e1',
    type: 'multiple_choice',
    difficulty: 'easy',
    topic: 'Variable & Assignment',
    questionText: 'คำนวณหาค่าสุดท้ายของตัวแปร `a` และ `b`หลังจากผ่านลำดับคำสั่งการจัดสลับค่าด้วยตัวแปรชั่วคราวและการดำเนินการด้านล่างนี้ในภาษา Python:',
    codeSnippet: 'a = 5\nb = 10\ntemp = a\na = b\nb = temp\na = a + 2',
    choices: [
      'a = 12, b = 5',
      'a = 7, b = 10',
      'a = 10, b = 5',
      'a = 5, b = 12'
    ],
    correctAnswer: 'a = 12, b = 5',
    hint: 'ไล่เรียงคำสั่งทีละบรรทัด ตัวแปร `temp` เปรียบเสมือนกล่องเก็บข้อมูลชั่วคราวเพื่อสำรองค่าเริ่มต้นเดวิดของ `a` ก่อนที่จะถูกนำค่า `b` มาเขียนทับ',
    explanation: 'ขั้นตอนการรัน:\n1. temp ได้รับค่า 5\n2. a ได้รับค่า 10 (ค่าเดิมของ b)\n3. b ได้รับค่า 5 (ค่าที่ฝากไว้ใน temp)\n4. a บรรทัดสุดท้ายเพิ่มขึ้นอีก 2 (10 + 2 = 12) ส่วน b ยังเป็น 5 เหมือนเดิม',
    points: 50
  },
  {
    id: 'e2',
    type: 'choose_command',
    difficulty: 'easy',
    topic: 'Conditionals & Logic',
    questionText: 'เลือกตัวดำเนินการเปรียบเทียบ (Comparison Operator) ป้อนในช่องว่าง `[?]` เพื่อทำให้โปรแกรมแสดงคำตอบ "Discount Active" เฉพาะเมื่ออายุ (age) อยู่ระหว่าง 18 ถึง 25 ปีแบบพอดี (รวม 25 ปีด้วย):',
    codeSnippet: 'age = 20\nif age > 18 and age [?] 25:\n    print("Discount Active")',
    choices: ['<', '<=', '>', '=='],
    correctAnswer: '<=',
    hint: 'ขอบเขตอายุคือต้องมากกว่า 18 (ไม่รวม 18) และ "น้อยกว่าหรือเท่ากับ" 25 (รวม 25 ด้วย) ภาษา Python ใช้ตัวดำเนินการผสมแบบเรียบง่าย',
    explanation: 'ตัวดำเนินการ `<=` (Less than or equal to) ตรวจสอบเงื่อนไขว่าอายุน้อยกว่าหรือเท่ากับ 25 และใช้คีย์เวิร์ด `and` เพื่อสั่งให้เงื่อนไขทั้งสองบรรจบร่วมกัน',
    points: 50
  },
  {
    id: 'e3',
    type: 'fill_blank',
    difficulty: 'easy',
    topic: 'Loop & Iteration',
    questionText: 'ลูป dynamic While ด้านล่างนี้จะทำการวนซ้ำ (Execute Block) ทั้งหมดกี่รอบ? (ตอบเฉพาะตัวเลขจำนวนเต็มหลักเดียว เช่น 4)',
    codeSnippet: 'count = 0\nwhile count < 8:\n    count = count + 2',
    correctAnswer: '4',
    hint: 'เขียนไล่ค่าของ count ในกระดาษทด: เริ่มต้นคือกิโล 0 รันรอบถัดๆ ไปคือ 2, 4, 6 และ 8 ยุติการวนซ้ำเมื่อเงื่อนไขประเมินค่าเป็น False',
    explanation: 'รอบที่ 1: count=2 (2 < 8 เป็น True)\nรอบที่ 2: count=4 (4 < 8 เป็น True)\nรอบที่ 3: count=6 (6 < 8 เป็น True)\nรอบที่ 4: count=8 (8 < 8 เป็น False จบลูป)\nลูปทำงานสำเร็จไปทั้งหมด 4 รอบ',
    points: 50
  },
  {
    id: 'e4',
    type: 'debug_code',
    difficulty: 'easy',
    topic: 'List & Indexing',
    questionText: 'ฟังก์ชัน Python นี้มีเป้าหมายเพื่อดึงค่า "ตัวแรกสุด" หรือ "ตัวท้ายสุด" ของลิสต์ (arr) แต่ผู้เขียนสับสนทำให้เขียนดรรชนีล้นเกินขอบเขตโครงสร้างจนเกิด IndexError ทางระบบโปรแกรมเมอร์ ควรแก้บรรทัดส่งค่าคืนอย่างไรเพื่อคืนค่า "ตัวสุดท้าย" ของลิสต์อย่างถูกต้องปลอดภัย?',
    codeSnippet: 'def get_last_element(arr):\n    # พบบั๊ก IndexError ที่นี่:\n    return arr[len(arr)]',
    choices: [
      'return arr[len(arr) - 1]',
      'return arr[len(arr) + 1]',
      'return arr[0]',
      'return len(arr)'
    ],
    correctAnswer: 'return arr[len(arr) - 1]',
    hint: 'ดัชนี (Index) ของ List ใน Python เริ่มนับจาก 0 เสมอ ดังนั้นหาก List มีสมาชิก 3 ตัว ตัวสุดท้ายจะอยู่ที่ช่อง 2 เสมอ (ซึ่งก็คือ len - 1 หรือคุณจะใช้ arr[-1] ใน Python ก็ได้)',
    explanation: 'เนื่องจาก Python List เริ่มต้นชี้ด้วยอินเด็กซ์ที่ 0 เสมอ ช่องสมาชิกตัวสุดท้ายจึงต้องลบออกหนึ่งตำแหน่งจากความยาวของอาร์เรย์ทั้งหมด เช่น `arr[len(arr) - 1]`',
    points: 50
  },
  {
    id: 'e5',
    type: 'order_steps',
    difficulty: 'easy',
    topic: 'Conditionals & Logic',
    questionText: 'เรียงลำดับบล็อกคำสั่งโค้ดด้านล่าง เพื่อสร้างเงื่อนไขแบบกิ่งโครงสร้าง (if-elif-else) ใน Python สำหรับจำแนกเช็คค่าตัวแปร `num` ว่าเป็นจำนวนลบ, จำนวนบวก หรือเป็นศูนย์:',
    correctOrder: [
      'if num < 0:',
      '    print("Negative")',
      'elif num > 0:',
      '    print("Positive")',
      'else:',
      '    print("Zero")'
    ],
    hint: 'เริ่มการเปรียบเทียบกิ่งแรกด้วย `if` ตามมาด้วยคู่เปรียบเทียบตัวแปรตัวถัดไปโดยใช้ `elif` (สังเกตเว้นวรรค Indentation ของ Python ให้ดี) และปิดกรณีที่เหลือด้วย `else`',
    explanation: 'นี่คือฟอร์แมตโครงสร้างตัดสินใจ 3 สาขาของ Python โดยแทนที่ else if ของภาษาอื่นด้วย `elif` เสมอ',
    points: 50
  },

  // --- MEDIUM QUESTIONS (100 Points) ---
  {
    id: 'm1',
    type: 'fill_blank',
    difficulty: 'medium',
    topic: 'Modulo Arithmetic',
    questionText: 'ผลลัพธ์ของค่าพิมพ์ `result` จากการกระทำการหารเอาเศษยกกำลังในตรรกะคอมพิวเตอร์ Python ด้านล่างนี้คือเลขจำนวนเต็มใด? (เขียนเฉพาะผลลัพธ์สุดท้ายตัวเลขเปล่าๆ)',
    codeSnippet: 'x = 15\ny = 4\nz = x % y    # ตัวดำเนินการหารเอาเศษ (Modulo)\nresult = (z ** 2) + y\nprint(result)',
    correctAnswer: '13',
    hint: 'ตัวดำเนินการ modulo `%` ของ Python ส่งคืนสัมประสิทธิ์เศษการหาร: 15 / 4 เหลือเศษปัดทศนิยมเท่าใด? ยกกำลังสอง `**` เศษนั้นร่วมกับเก็บค่าบวกด้วย y',
    explanation: '1. 15 % 4 = 3 (เพราะ 4 * 3 = 12 เหลือเศษ 3)\n2. z ได้รับค่า 3\n3. result = (3 ** 2) + 4 = 9 + 4 = 13\n(ขยายความ: ดับเบิ้ลสตาร์ ** คือเครื่องหมายเลขยกกำลังของ Python)',
    points: 100
  },
  {
    id: 'm2',
    type: 'multiple_choice',
    difficulty: 'medium',
    topic: 'Boolean & Logic',
    questionText: 'ศึกษาค่าความจริง Boolean ดั้งเดิมของตัวแปร และผลลัพธ์จากการประเมินตรรกศาสตร์ผสมในภาษา Python ด้านล่างนี้จะคืนค่าออกมาเป็นค่าอะไร?',
    codeSnippet: 'x = True\ny = False\nz = True\nresult = (x and not y) or (y and z)\nprint(result)',
    choices: [
      'True',
      'False',
      'None',
      'NameError'
    ],
    correctAnswer: 'True',
    hint: 'แยกแก้สมการทีละฝั่งรอบเครื่องหมาย `or` นอกสุด: ฝั่งซ้ายคือ `x and not y` สแกนสลับค่าแอนด์แล้วประเมินค่าร่วมกับฝั่งขวา',
    explanation: '`not y` แปลง False สสลับเป็น True ส่งผลให้ประโยคซีกซ้าย `(x and not y)` เท่ากับ `True and True` ซึ่งได้ True. เมื่อหน้าเครื่องหมายกั้นกาง `or` เป็น True ทั้งประโยคผลลัพธ์จึงประเมินเป็น True ด้วยระบบ Short-circuit',
    points: 100
  },
  {
    id: 'm3',
    type: 'debug_code',
    difficulty: 'medium',
    topic: 'Loop & Iteration',
    questionText: 'โปรแกรมโค้ดค้นหาจำนวนติดลบในลิสต์ (nums) ด้านล่างนี้เกิด SyntaxError รันโปรแกรมไม่ผ่านเนื่องจากขาดอักขระสัญลักษณ์กำกับโครงสร้างสำคัญใดของ Python บรรทัดที่ 3?',
    codeSnippet: 'negatives = 0\nfor num in nums:\n    if num < 0\n        negatives += 1',
    choices: [
      'ลืมใส่เครื่องหมายโคลอน (:) ท้ายประโยคเงื่อนไข: "if num < 0:"',
      'เขียนคำสั่งนับผิดพลาด ต้องเปลี่ยนเป็น: "negatives++"',
      'ตัวแปรลูปเขียนไม่ถูกรูป ต้องใช้: "for num in range(nums):"',
      'ไม่พบวงเล็บครอบเงื่อนไข: "if (num < 0):"'
    ],
    correctAnswer: 'ลืมใส่เครื่องหมายโคลอน (:) ท้ายประโยคเงื่อนไข: "if num < 0:"',
    hint: 'ในสถาปัตยกรรม Python บรรทัดโครงสร้างคำสั่งประมวลผลปลายหัว (เช่น def, for, while, if, elif, else) มีสัญลักษณ์บังคับปิดท้ายเสมอก่อนเคาะเยื้องลงมาระบุบล็อกลูก',
    explanation: 'ต่างจากภาษาที่มีตระกูล C อย่าง Java หรือ JavaScript ซี่งใช้วงเล็บปีกกาครอบบล็อก ตัวคัดกรอง Python ยึดโคลอน `:` ร่วมกับการเคาะเยื้องบล็อกเพื่อจำแนกขอบเขตทำงาน',
    points: 100
  },
  {
    id: 'm4',
    type: 'choose_command',
    difficulty: 'medium',
    topic: 'List & Aggregates',
    questionText: 'โจทย์ต้องการหาผลรวมของสินค้าหรือค่าตัวเลขสะสมทั้งหมดในลิสต์ (items) ให้เติมช่องว่างคำสั่ง `[?]` เพื่อทำการบวกสะสมค่าในแต่ละรอบการทำงานของลูปให้สำเร็จ:',
    codeSnippet: 'total = 0\nitems = [1, 5, 2, 8]\nfor item in items:\n    [?]\nprint(total)',
    choices: [
      'total += item',
      'total = item',
      'total += items',
      'total = total + len(items)'
    ],
    correctAnswer: 'total += item',
    hint: 'ลูปในแบบฉบับ `for item in items:` ของ Python ดึงสมาชิกเดี่ยวแต่ละตัวออกมาเป็นตัวแปร `item` ในรอบปัจจุบัน สิ่งที่เราต้องทำคือสะสมมันเข้าไปรวมในผลรวมสะสมดั้งเดิม',
    explanation: '`total += item` แปลความเป็นตรรกะว่า `total = total + item` ดึงตัวเลข (1, 5, 2, 8) ไปสะสม หากเติมด้วย items ระบบจะส่งสัญญาณ TypeError ตัวแปรแบบผสม',
    points: 100
  },
  {
    id: 'm5',
    type: 'order_steps',
    difficulty: 'medium',
    topic: 'Recursion logic',
    questionText: 'เรียงลำดับบล็อกโปรแกรมเพื่อสร้างความรู้เรื่องฟังก์ชันการคำนวณหาสมการแฟกทอเรียลย้อนหลังแบบ Recursion ( factorial ) ใน Python โดยหยุดทำงานเมื่อค่าอินพุต `n <= 1`:',
    correctOrder: [
      'def fact(n):',
      '    if n <= 1:',
      '        return 1',
      '    else:',
      '        return n * fact(n - 1)'
    ],
    hint: 'คิดฟังก์ชันด้วยแนวคิดหาจุดจบก่อน (Base Case) เพื่อสกัดไม่ให้แอปพลิเคชันค้างรอกล่อง Stack แล้วค่อยคำนวณหาค่าในกรณีทั่วไปโดยโทรศัพท์หาฟังก์ชันเดิมด้วยพารามิเตอร์ย่อยที่ลดลงอย่างเป็นลำดับ',
    explanation: 'ลำดับประมวล:\n1. นิยามฟังก์ชันด้วย `def` ปิดท้ายโคลอน\n2. ตรวจค้นและส่งค่าออก static 1 หาก n ต่ำกว่าหรือเท่ากับ 1\n3. จัดเรียก recursion ขยับค่าคูณลดหลั่นกันสะสมลงไปทีละขอบ',
    points: 100
  },

  // --- HARD QUESTIONS (150 Points) ---
  {
    id: 'h1',
    type: 'multiple_choice',
    difficulty: 'hard',
    topic: 'Recursion & Algorithms',
    questionText: 'พิจารณาโค้ดแนะแนวแบบตรรกศาสตร์ความซับซ้อน Recursion ด้านล่างนี้ หากคอมไพล์สแกนเรียกคำสั่งรันทำงาน `mystery(3, 4)` ผลการประเมินค่าสุดท้ายจะเป็นเท่าใด และกำลังใช้ตรรกะใดไขความสามารถ?',
    codeSnippet: 'def mystery(a, b):\n    if b == 0:\n        return 0\n    if b % 2 == 0:\n        return mystery(a + a, b // 2)\n    return mystery(a + a, b // 2) + a',
    choices: [
      '12 (ทำงานเป็นเครื่องรวดเร็วสมสลับสูตรคูณ a * b)',
      '81 (ทำงานคิดสูตรเลขยกกำลังสะสม a^b)',
      '7 (ทำหน้าที่บวกเพิ่มระยะสะสมดนตรี a + b)',
      'เกิดข้อขัดข้อง RecursionError ขีดจำกัดลึกสุดของสแต็ก'
    ],
    correctAnswer: '12 (ทำงานเป็นเครื่องรวดเร็วสมสลับสูตรคูณ a * b)',
    hint: 'ไล่เรียงด้วยตัวเลข: mystery(3, 4) เข้าเงื่อนไข b หาร 2 ลงตัว -> mystery(6, 2) -> mystery(12, 1) สังเกตการย้อนเก็บความสูง b ค่อยๆ ชดเชยบวกร่วมด้วย',
    explanation: 'ขั้นตอนการวน Recursion:\nmystery(3, 4) -> mystery(6, 2) -> mystery(12, 1) -> mystery(12+12, 0) + 12 = 0 + 12 = 12.\nนี่คืออัลกอริทึมคูณแบบอาหรับโบราณ "Russian Peasant Multiplication" เพื่อคำนวณหาค่า `a * b` ในระยะเวลาเชิงลอการิทึม O(log b) นิยมเปรียบเทียบในวิชาวิทยาการคอมพิวเตอร์',
    points: 150
  },
  {
    id: 'h2',
    type: 'fill_blank',
    difficulty: 'hard',
    topic: 'Nested Loops',
    questionText: 'คำนวณหาค่าพิมพ์สะสมตัวเลขสุดท้ายของ `total` จากตรรกะลูปซ้อนลูป (Double Nested Loops Range) ในโครงสร้างแถว Python ด้านล่างนี้ ว่าเป็นจำนวนเท่าใด:',
    codeSnippet: 'total = 0\nfor i in range(4):\n    for j in range(i, 4):\n        total += 1\nprint(total)',
    correctAnswer: '10',
    hint: 'แกะลูปแถวตัวชี้ค่าขอบจดจำ: รอบ i=0 ( range(0, 4) ) ลูปในจะรัน j ตั้งแต่ 0, 1, 2, 3 ทั้งหมด 4 ครั้ง รอบ i=1 ลูปในจะรัน j ตั้งแต่ 1, 2, 3 ทั้งหมด 3 ครั้ง สังเกตยอดลดหลั่นลงมา',
    explanation: 'แจกแจงคู่เงื่อนไขคีย์ลูปร่วมกัน:\n- i = 0 -> j = 0,1,2,3 (เพิ่มขึ้น 4 ยอด)\n- i = 1 -> j = 1,2,3 (เพิ่มขึ้น 3 ยอด)\n- i = 2 -> j = 2,3 (เพิ่มขึ้น 2 ยอด)\n- i = 3 -> j = 3 (เพิ่มขึ้น 1 ยอด)\nรวมผลทั้งหมดเป็น: 4 + 3 + 2 + 1 = 10',
    points: 150
  },
  {
    id: 'h3',
    type: 'choose_command',
    difficulty: 'hard',
    topic: 'List & Boundaries',
    questionText: 'เราต้องการตรวจสอบหาว่าลิสต์ข้อมูลชุดทดสอบมี "สมาชิกมูลค่าติดกันซ้ำกัน" (Adjacent Duplicates) หรือไม่ โดยกำหนดขอบรันตรวจไม่ให้ล้น Index ขอบอัปพุตด้วยความล้มเหลว เลือกตัวเติมช่องว่างตรวจสอบ `[?]`:',
    codeSnippet: 'arr = [1, 2, 2, 4, 5]\nhas_dup = False\nfor i in range(len(arr) - 1):\n    if [?]:\n        has_dup = True',
    choices: [
      'arr[i] == arr[i + 1]',
      'arr[i] == arr[i - 1]',
      'arr[i] == arr[len(arr)]',
      'arr[i] == arr[1]'
    ],
    correctAnswer: 'arr[i] == arr[i + 1]',
    hint: 'ขอบเขตลูป `range(len(arr) - 1)` จะรันถึงตำแหน่งก่อนตัวสุดท้ายดัชนีหนึ่งช่วง เพื่อให้ตัวเปรียบเทียบในวงเล็บดึงตำแหน่ง `i` และ `i + 1` ขึ้นมาตรวจสอบสะกดโดยไม่ล้นสแต็ค',
    explanation: 'อินเด็กซ์ช่อง `i` และ `i + 1` ตรวจข้างเคียงของสมาชิกเคียงข้างกันอย่างถูกต้องปลอดภัยเสมอเพราะระบุจำกัดลูปสูงสุดอยู่ที่ len(arr) - 2 ตัวถัดไปจึงไม่หลุด Index out of range',
    points: 150
  },
  {
    id: 'h4',
    type: 'debug_code',
    difficulty: 'hard',
    topic: 'Business Logic Security',
    questionText: 'ฟังก์ชันคำนวณสวอปราคาตั๋วจำลองโรงภาพยนตร์: เด็ก (อายุต่ำกว่า 12 จ่าย $5), ผู้สูงอายุ (อายุเกิน 60 ค่าผ่านทาง $7), นอกเหนือจากนั้นบุคคลทั่วไปจ่าย $10 โดยมีเงื่อนไขพิเศษคือ "ผู้เป็นนักเรียน (is_student=True) ขูดราคาใดๆ จะได้รับส่วนลดครึ่งหนึ่งจากเกณฑ์ราคาอายุนั้นๆ เสมอ" แต่โค้ด Python มีข้อบกพร่องด้านลำดับเชิงตรรกะระดับร้ายแรง ค้นหาจุดอ่อนที่ถูกต้อง?',
    codeSnippet: 'def get_price(age, is_student):\n    base = 10\n    if is_student:\n         return base * 0.5\n    if age < 12:\n         base = 5\n    elif age > 60:\n         base = 7\n    return base',
    choices: [
      'ฟังก์ชันประเมินตัวแปร is_student คืนค่าส่งออกก่อนทันที ทำให้อัตราพิเศษของนักเรียนที่เป็นเด็ก ถูกบังคับคิดเรตลดจากราคาเต็ม $10 แทนที่จะได้รับส่วนลดครึ่งหนึ่งราคาเด็ก ($2.50)',
      'บล็อกเงื่อนไขการใช้ elif ของกลุ่มอายุจัดระเบียบไม่ถูกต้อง เพราะอายุซ้อนทับกันตั้งแต่ 12 และ 60',
      'ใน Python ตรรกะ Boolean และส่วนลดของเลขทศนิยมไม่ได้รับการรับรองเป็น integer เสมอ',
      'ส่วนคำสั่ง nested scopes ลืมจ่าหน้า colons ย่อย และมี SyntaxError ทำให้อัลกอริทึมคัดตรรกศาสตร์ขัดข้อง'
    ],
    correctAnswer: 'ฟังก์ชันประเมินตัวแปร is_student คืนค่าส่งออกก่อนทันที ทำให้อัตราพิเศษของนักเรียนที่เป็นเด็ก ถูกบังคับคิดเรตลดจากราคาเต็ม $10 แทนที่จะได้รับส่วนลดครึ่งหนึ่งราคาเด็ก ($2.50)',
    hint: 'ลองป้อนสมมุติฐาน: เด็กเรียนเก่งอายุ 10 ขวบ เป็นนักเรียนด้วย! เข้าบรรทัดแรกเห็น `is_student=True` สดใส ส่งคืน `10 * 0.5 = $5` กลับไปทันที แต่ราคาฐานเด็กจริงๆ คือ $5 ถ้าหั่นส่วนลดวิชาควรได้รับรักษาสิทธิ์ที่ $2.50 ต่างหาก!',
    explanation: 'การตรวจสอบสิทธิ `is_student` ตัวแยกเดี่ยวรวบรัดชั้นแรกสุดตัดสิทธิกิ่งเงื่อนไขกรองฐานอายุของเด็กและคนชราทิ้งหมด บล็อกแบบที่สมบูรณ์จะต้องคำนวณฐานราคาอายุให้เรียบร้อยก่อน แล้วค่อยตรวจสอบสิทธิ์นักเรียนเพื่อตัดหั่นส่วนลดรันไทม์เสมอ',
    points: 150
  },
  {
    id: 'h5',
    type: 'order_steps',
    difficulty: 'hard',
    topic: 'Algorithms Search',
    questionText: 'ประกอบเรียงหัวแถวขั้นตอนการทำงานของระบบ ค้นหาทวินามค้นคว้าด่วน (Binary Search Loop Algorithm) ในภาษา Python เพื่อหาค่าดัชนีของข้อมูลเป้าหมาย target ในระเบียบลิสต์เรียวถูกต้อง:',
    correctOrder: [
      'low = 0\nhigh = len(arr) - 1',
      'while low <= high:',
      '    mid = (low + high) // 2',
      '    if arr[mid] == target: return mid',
      '    elif arr[mid] < target: low = mid + 1',
      '    else: high = mid - 1'
    ],
    hint: 'เริ่มด้วยการกำหนดที่เก็บขอบช่วงซ้าย low และขวางาม high, กำหนดลูปตรวจสอบขนาดตราบที่ไม่เหลื่อมกัณฑ์กัน, คิดทศนิยมครึ่งฐานจำนวนเต็มด้วยเครื่องหมาย `//` และสลับจุดต่ำขีดตามลดับเปรียบเทียบใน Python',
    explanation: 'นี่คือขั้นตอนค้นหาความรวดเร็วความซับซ้อนสิบทางวิทยาการ O(log N) ที่ทำงานเป็นหัวใจให้กับการดึงข้อมูลฐานข้อมูลยุคใหม่',
    points: 150
  }
];
