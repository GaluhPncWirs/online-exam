USE online_exam


CREATE TABLE subject_exam (
    id_subject VARCHAR(10) NOT NULL PRIMARY KEY,
    id_teacher VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exam_questions JSON NOT NULL,
    name_exam VARCHAR(100) NOT NULL,
    type_exam ENUM('PG', 'ESSAY') DEFAULT 'PG',
    deleted_at TIMESTAMP,

    CONSTRAINT fk_subject_exam FOREIGN KEY(id_teacher) REFERENCES account_teacher
)ENGINE=innodb

SHOW CREATE TABLE subject_exam

DESCRIBE subject_exam

ALTER TABLE subject_exam MODIFY deleted_at TIMESTAMP

ALTER TABLE subject_exam MODIFY id_teacher VARCHAR(12) NOT NULL

ALTER TABLE subject_exam DROP FOREIGN KEY fk_subject_exam

ALTER TABLE subject_exam
ADD CONSTRAINT fk_subject_exam
FOREIGN KEY (id_teacher)
REFERENCES account_teacher(id_teacher)

ALTER TABLE subject_exam ADD UNIQUE KEY uq_teacher_exam (id_teacher, name_exam)

ALTER TABLE subject_exam ADD CONSTRAINT 

INSERT INTO subject_exam(id_subject, id_teacher, exam_questions, name_exam, type_exam) VALUES 
('SUB-rT6UeV', 'TCR-ar45dgU', '[{"id":"EX-GEO1","questions":"Lapisan atmosfer yang berperan penting dalam memantulkan gelombang radio adalah?","multipleChoice":{"choice_a":"Troposfer","choice_b":"Stratosfer","choice_c":"Mesosfer","choice_d":"Termosfer (ionosfer)","choice_e":"Eksosfer"},"correctAnswer":"Termosfer (ionosfer)"},{"id":"EX-GEO2","questions":"Gunung berapi yang terbentuk dari letusan magma yang bersifat cair dan membentuk lereng landai disebut?","multipleChoice":{"choice_a":"Stratovolcano","choice_b":"Perisai (shield volcano)","choice_c":"Maar","choice_d":"Kaldera","choice_e":"Dome"},"correctAnswer":"Perisai (shield volcano)"},{"id":"EX-GEO3","questions":"Iklim menurut klasifikasi Koppen yang bercirikan curah hujan tinggi sepanjang tahun adalah?","multipleChoice":{"choice_a":"Af (hutan hujan tropis)","choice_b":"Aw (sabana tropis)","choice_c":"Bs (stepa)","choice_d":"Bw (gurun)","choice_e":"Cf (iklim sedang basah)"},"correctAnswer":"Af (hutan hujan tropis)"},{"id":"EX-GEO4","questions":"Proses pelapukan batuan akibat perubahan suhu harian tanpa melibatkan makhluk hidup disebut?","multipleChoice":{"choice_a":"Pelapukan mekanis","choice_b":"Pelapukan kimiawi","choice_c":"Pelapukan biologis","choice_d":"Erosi","choice_e":"Sedimentasi"},"correctAnswer":"Pelapukan mekanis"},{"id":"EX-GEO5","questions":"Benua yang paling sedikit jumlah negara anggotanya adalah?","multipleChoice":{"choice_a":"Asia","choice_b":"Eropa","choice_c":"Oseania","choice_d":"Antartika","choice_e":"Afrika"},"correctAnswer":"Antartika"},{"id":"EX-GEO6","questions":"Fenomena El Nino di Indonesia biasanya menyebabkan?","multipleChoice":{"choice_a":"Musim hujan lebih panjang","choice_b":"Musim kemarau lebih panjang","choice_c":"Suhu udara lebih dingin","choice_d":"Peningkatan curah hujan","choice_e":"Angin barat bertiup lebih kuat"},"correctAnswer":"Musim kemarau lebih panjang"},{"id":"EX-GEO7","questions":"Garis khayal yang membagi bumi menjadi dua belahan, utara dan selatan disebut?","multipleChoice":{"choice_a":"Garis Bujur","choice_b":"Garis Tanggal Internasional","choice_c":"Garis Khatulistiwa","choice_d":"Garis Wallace","choice_e":"Tropis Capricornus"},"correctAnswer":"Garis Khatulistiwa"},{"id":"EX-GEO8","questions":"Jenis batuan yang terbentuk akibat pendinginan magma disebut?","multipleChoice":{"choice_a":"Batuan beku","choice_b":"Batuan sedimen","choice_c":"Batuan metamorf","choice_d":"Batuan organik","choice_e":"Batuan kimia"},"correctAnswer":"Batuan beku"},{"id":"EX-GEO9","questions":"Delta sungai terbentuk di?","multipleChoice":{"choice_a":"Hulu sungai","choice_b":"Lereng gunung","choice_c":"Muara sungai","choice_d":"Dasar laut dalam","choice_e":"Danau"},"correctAnswer":"Muara sungai"},{"id":"EX-GEO10","questions":"Negara kepulauan terbesar di dunia berdasarkan jumlah pulau adalah?","multipleChoice":{"choice_a":"Filipina","choice_b":"Indonesia","choice_c":"Jepang","choice_d":"Maladewa","choice_e":"Fiji"},"correctAnswer":"Indonesia"},{"id":"EX-GEO11","questions":"Fenomena pergerakan lempeng tektonik yang saling bertumbukan dapat menyebabkan?","multipleChoice":{"choice_a":"Gempa bumi dan tsunami","choice_b":"Hujan deras","choice_c":"Angin muson","choice_d":"Ozon menipis","choice_e":"Iklim tropis"},"correctAnswer":"Gempa bumi dan tsunami"},{"id":"EX-GEO12","questions":"Negara yang berbatasan langsung dengan Indonesia di daratan adalah?","multipleChoice":{"choice_a":"Singapura","choice_b":"Timor Leste","choice_c":"Filipina","choice_d":"Malaysia","choice_e":"Papua Nugini"},"correctAnswer":"Timor Leste"},{"id":"EX-GEO13","questions":"Jenis angin yang bertiup secara periodik setiap 6 bulan sekali di Asia Tenggara disebut?","multipleChoice":{"choice_a":"Angin darat","choice_b":"Angin laut","choice_c":"Angin muson","choice_d":"Angin fohn","choice_e":"Angin passat"},"correctAnswer":"Angin muson"},{"id":"EX-GEO14","questions":"Hutan hujan tropis banyak dijumpai di wilayah?","multipleChoice":{"choice_a":"Kutub utara","choice_b":"Gurun Sahara","choice_c":"Amazon, Kongo, dan Indonesia","choice_d":"Eropa Barat","choice_e":"Australia Tengah"},"correctAnswer":"Amazon, Kongo, dan Indonesia"},{"id":"EX-GEO15","questions":"Pulau Jawa termasuk ke dalam jalur pegunungan muda dunia yang disebut?","multipleChoice":{"choice_a":"Sirkum Pasifik","choice_b":"Sirkum Mediterania","choice_c":"Pegunungan Himalaya","choice_d":"Alpina","choice_e":"Rocky Mountains"},"correctAnswer":"Sirkum Pasifik"},{"id":"EX-GEO16","questions":"Sumber energi yang berasal dari panas bumi disebut?","multipleChoice":{"choice_a":"Energi surya","choice_b":"Energi fosil","choice_c":"Energi geotermal","choice_d":"Energi biomassa","choice_e":"Energi pasang surut"},"correctAnswer":"Energi geotermal"},{"id":"EX-GEO17","questions":"Negara dengan luas wilayah terbesar di dunia adalah?","multipleChoice":{"choice_a":"Cina","choice_b":"Kanada","choice_c":"Amerika Serikat","choice_d":"Rusia","choice_e":"Brazil"},"correctAnswer":"Rusia"}]', 'Ujian Mata Pelajaran Geografi', 'PG')

SELECT * FROM subject_exam

DELETE FROM subject_exam WHERE id_subject = 'SUB-wPTu3V'

UPDATE subject_exam SET exam_questions = '[
  {
    "id": "EX-ENG1",
    "questions": "Choose the correct form: She ____ to school every day.",
    "multipleChoice": {
      "choice_a": "go",
      "choice_b": "goes",
      "choice_c": "going",
      "choice_d": "gone",
      "choice_e": "is go"
    },
    "correctAnswer": "goes"
  },
  {
    "id": "EX-ENG2",
    "questions": "The opposite of \'difficult\' is?",
    "multipleChoice": {
      "choice_a": "Hard",
      "choice_b": "Easy",
      "choice_c": "Tough",
      "choice_d": "Strong",
      "choice_e": "Weak"
    },
    "correctAnswer": "Easy"
  },
  {
    "id": "EX-ENG3",
    "questions": "Which one is a past tense verb?",
    "multipleChoice": {
      "choice_a": "Run",
      "choice_b": "Eat",
      "choice_c": "Went",
      "choice_d": "Go",
      "choice_e": "See"
    },
    "correctAnswer": "Went"
  },
  {
    "id": "EX-ENG4",
    "questions": "Choose the correct article: I saw ___ elephant in the zoo.",
    "multipleChoice": {
      "choice_a": "a",
      "choice_b": "an",
      "choice_c": "the",
      "choice_d": "no article",
      "choice_e": "some"
    },
    "correctAnswer": "an"
  },
  {
    "id": "EX-ENG5",
    "questions": "Complete the sentence: They ____ watching TV when I arrived.",
    "multipleChoice": {
      "choice_a": "was",
      "choice_b": "were",
      "choice_c": "is",
      "choice_d": "are",
      "choice_e": "been"
    },
    "correctAnswer": "were"
  },
  {
    "id": "EX-ENG6",
    "questions": "What is the synonym of \'happy\'?",
    "multipleChoice": {
      "choice_a": "Sad",
      "choice_b": "Glad",
      "choice_c": "Angry",
      "choice_d": "Weak",
      "choice_e": "Afraid"
    },
    "correctAnswer": "Glad"
  },
  {
    "id": "EX-ENG7",
    "questions": "Change into negative: She likes apples.",
    "multipleChoice": {
      "choice_a": "She not like apples",
      "choice_b": "She doesn`t like apples",
      "choice_c": "She don`t like apples",
      "choice_d": "She isn`t like apples",
      "choice_e": "She no like apples"
    },
    "correctAnswer": "She doesn`t like apples"
  },
  {
    "id": "EX-ENG8",
    "questions": "Which word is an adjective?",
    "multipleChoice": {
      "choice_a": "Quickly",
      "choice_b": "Happiness",
      "choice_c": "Beautiful",
      "choice_d": "Sing",
      "choice_e": "Dance"
    },
    "correctAnswer": "Beautiful"
  },
  {
    "id": "EX-ENG9",
    "questions": "Choose the correct preposition: He is interested ___ music.",
    "multipleChoice": {
      "choice_a": "at",
      "choice_b": "in",
      "choice_c": "on",
      "choice_d": "to",
      "choice_e": "with"
    },
    "correctAnswer": "in"
  },
  {
    "id": "EX-ENG10",
    "questions": "Identify the correct comparative form: This book is ____ than that one.",
    "multipleChoice": {
      "choice_a": "good",
      "choice_b": "better",
      "choice_c": "best",
      "choice_d": "more good",
      "choice_e": "most good"
    },
    "correctAnswer": "better"
  },
  {
    "id": "EX-ENG11",
    "questions": "Which one is a countable noun?",
    "multipleChoice": {
      "choice_a": "Water",
      "choice_b": "Sugar",
      "choice_c": "Chair",
      "choice_d": "Rice",
      "choice_e": "Milk"
    },
    "correctAnswer": "Chair"
  },
  {
    "id": "EX-ENG12",
    "questions": "What is the past form of \'buy\'?",
    "multipleChoice": {
      "choice_a": "Buyed",
      "choice_b": "Bought",
      "choice_c": "Buys",
      "choice_d": "Buying",
      "choice_e": "Been"
    },
    "correctAnswer": "Bought"
  },
  {
    "id": "EX-ENG13",
    "questions": "Choose the correct question tag: You are a student, ____?",
    "multipleChoice": {
      "choice_a": "aren`t you",
      "choice_b": "isn`t you",
      "choice_c": "don`t you",
      "choice_d": "won`t you",
      "choice_e": "doesn`t you"
    },
    "correctAnswer": "aren`t you"
  },
  {
    "id": "EX-ENG14",
    "questions": "What is the plural form of \'child\'?",
    "multipleChoice": {
      "choice_a": "Childs",
      "choice_b": "Children",
      "choice_c": "Childes",
      "choice_d": "Childrens",
      "choice_e": "Childer"
    },
    "correctAnswer": "Children"
  },
  {
    "id": "EX-ENG15",
    "questions": "Fill in the blank: He has lived in Jakarta ____ 2010.",
    "multipleChoice": {
      "choice_a": "since",
      "choice_b": "for",
      "choice_c": "by",
      "choice_d": "at",
      "choice_e": "from"
    },
    "correctAnswer": "since"
  },
  {
    "id": "EX-ENG16",
    "questions": "Choose the correct modal: You ____ wear a helmet when riding a motorcycle.",
    "multipleChoice": {
      "choice_a": "must",
      "choice_b": "can",
      "choice_c": "may",
      "choice_d": "could",
      "choice_e": "might"
    },
    "correctAnswer": "must"
  },
  {
    "id": "EX-ENG17",
    "questions": "Which sentence is in Present Perfect Tense?",
    "multipleChoice": {
      "choice_a": "She goes to school.",
      "choice_b": "She went to school.",
      "choice_c": "She has gone to school.",
      "choice_d": "She is going to school.",
      "choice_e": "She will go to school."
    },
    "correctAnswer": "She has gone to school."
  },
  {
    "id": "EX-ENG18",
    "questions": "What is the meaning of \'library\'?",
    "multipleChoice": {
      "choice_a": "Rumah sakit",
      "choice_b": "Sekolah",
      "choice_c": "Perpustakaan",
      "choice_d": "Pasar",
      "choice_e": "Bioskop"
    },
    "correctAnswer": "Perpustakaan"
  }
]', name_exam = "Ujian Bahasa Inggris" WHERE id_subject = 'SUB-wPTu3V'


UPDATE subject_exam SET exam_questions = JSON_REMOVE(exam_questions, REPLACE(JSON_UNQUOTE(JSON_SEARCH(exam_questions 'one', ?, NULL, '$[*].id')), '.id', '')) WHERE id_subject = 'SUB-wPTu3V' AND id_teacher = 'TCR-ar45dgU' AND JSON_SEARCH(exam_questions, 'one', ?, NULL, '$[*].id') IS NOT NULL

UPDATE subject_exam
  SET exam_questions = JSON_REMOVE(
    exam_questions,
    REPLACE(
      JSON_UNQUOTE(JSON_SEARCH(exam_questions, 'one', 'Choose the correct word to complete the sentence: I have lived here \\_\\_\\_ 2020.', NULL, '$[*].questions')),
      '.questions',
      ''
    )
  )
  WHERE id_subject = 'SUB-wPTu3V'
    AND id_teacher = 'TCR-ar45dgU'
    AND JSON_SEARCH(exam_questions, 'one', 'Choose the correct word to complete the sentence: I have lived here \\_\\_\\_ 2020.', NULL, '$[*].questions') IS NOT NULL


SELECT JSON_SEARCH(exam_questions, 'one', 'Choose the correct word to complete the sentence: I have lived here \\_\\_\\_ 2020.', NULL, '$[*].questions') AS path
FROM subject_exam
WHERE id_subject = 'SUB-wPTu3V';

ALTER TABLE subject_exam ADD COLUMN BOOLEAN DEFAULT FALSE

-- {
--   "id_subject": "SUB-rT6UeV",
--   "id_teacher": "TCR-ar45dgU",
--   "created_at": "2026-11-06 09:00:00",
--   "exam_questions": [
--     {
--       "id": "EX-MTK1",
--       "questions": "Hasil dari 25 × 12 adalah?",
--       "correctAnswer": "300",
--       "multipleChoice": {
--         "choice_a": "250",
--         "choice_b": "275",
--         "choice_c": "300",
--         "choice_d": "325",
--         "choice_e": "350"
--       }
--     },
--     {
--       "id": "EX-MTK2",
--       "questions": "Hasil dari 144 ÷ 12 adalah?",
--       "correctAnswer": "12",
--       "multipleChoice": {
--         "choice_a": "10",
--         "choice_b": "11",
--         "choice_c": "12",
--         "choice_d": "13",
--         "choice_e": "14"
--       }
--     },
--     {
--       "id": "EX-MTK3",
--       "questions": "Jika x + 15 = 30, berapakah nilai x?",
--       "correctAnswer": "15",
--       "multipleChoice": {
--         "choice_a": "10",
--         "choice_b": "12",
--         "choice_c": "15",
--         "choice_d": "20",
--         "choice_e": "25"
--       }
--     },
--     {
--       "id": "EX-MTK4",
--       "questions": "Berapakah hasil dari 3² + 4²?",
--       "correctAnswer": "25",
--       "multipleChoice": {
--         "choice_a": "7",
--         "choice_b": "12",
--         "choice_c": "16",
--         "choice_d": "20",
--         "choice_e": "25"
--       }
--     },
--     {
--       "id": "EX-MTK5",
--       "questions": "Sebuah persegi memiliki panjang sisi 8 cm. Berapakah luas persegi tersebut?",
--       "correctAnswer": "64 cm²",
--       "multipleChoice": {
--         "choice_a": "16 cm²",
--         "choice_b": "32 cm²",
--         "choice_c": "48 cm²",
--         "choice_d": "64 cm²",
--         "choice_e": "80 cm²"
--       }
--     },
--     {
--       "id": "EX-MTK6",
--       "questions": "Hasil dari 3/4 + 1/2 adalah?",
--       "correctAnswer": "5/4",
--       "multipleChoice": {
--         "choice_a": "1/4",
--         "choice_b": "3/4",
--         "choice_c": "4/4",
--         "choice_d": "5/4",
--         "choice_e": "6/4"
--       }
--     },
--     {
--       "id": "EX-MTK7",
--       "questions": "Sebuah segitiga memiliki alas 12 cm dan tinggi 10 cm. Berapakah luas segitiga tersebut?",
--       "correctAnswer": "60 cm²",
--       "multipleChoice": {
--         "choice_a": "40 cm²",
--         "choice_b": "50 cm²",
--         "choice_c": "60 cm²",
--         "choice_d": "100 cm²",
--         "choice_e": "120 cm²"
--       }
--     },
--     {
--       "id": "EX-MTK8",
--       "questions": "Jika 2x - 6 = 14, berapakah nilai x?",
--       "correctAnswer": "10",
--       "multipleChoice": {
--         "choice_a": "4",
--         "choice_b": "6",
--         "choice_c": "8",
--         "choice_d": "10",
--         "choice_e": "12"
--       }
--     },
--     {
--       "id": "EX-MTK9",
--       "questions": "Rata-rata dari bilangan 6, 8, 10, 12, dan 14 adalah?",
--       "correctAnswer": "10",
--       "multipleChoice": {
--         "choice_a": "8",
--         "choice_b": "9",
--         "choice_c": "10",
--         "choice_d": "11",
--         "choice_e": "12"
--       }
--     },
--     {
--       "id": "EX-MTK10",
--       "questions": "Sebuah lingkaran memiliki jari-jari 7 cm. Jika π = 22/7, berapakah keliling lingkaran tersebut?",
--       "correctAnswer": "44 cm",
--       "multipleChoice": {
--         "choice_a": "22 cm",
--         "choice_b": "33 cm",
--         "choice_c": "44 cm",
--         "choice_d": "77 cm",
--         "choice_e": "154 cm"
--       }
--     }
--   ],
--   "name_exam": "Ujian Mata Pelajaran Matematika",
--   "type_exam": "PG",
--   "deleted_at": null
-- }