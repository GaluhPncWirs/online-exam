USE online_exam

CREATE TABLE history_exams (
    id_history_exam VARCHAR(10) NOT NULL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_student VARCHAR(12) NOT NULL,
    id_subject VARCHAR(10) NOT NULL,
    answer_student JSON,
    result_exam TEXT NOT NULL,
    status_exam BOOLEAN DEFAULT FALSE,
    class VARCHAR(3),

    CONSTRAINT fk_id_subject FOREIGN KEY(id_subject) REFERENCES subject_exam
)ENGINE=innodb

DESCRIBE history_exams

ALTER TABLE history_exams DROP FOREIGN KEY fk_id_subject

ALTER TABLE history_exams
ADD CONSTRAINT fk_id_subject
FOREIGN KEY (id_subject)
REFERENCES subject_exam(id_subject)

SHOW CREATE TABLE history_exams

SELECT 
      history_exams.answer_student, subject_exam.name_exam, subject_exam.type_exam, subject_exam.exam_questions 
    FROM subject_exam
    JOIN history_exams
      ON subject_exam.id_subject = history_exams.id_subject
    WHERE 
      subject_exam.id_subject = "SUB-wPTu3V" AND history_exams.id_student = "STD-aMClguF"

ALTER TABLE history_exams
  ADD CONSTRAINT uq_history_student_subject UNIQUE (id_subject, id_subject)

INSERT INTO history_exams (id_history_exam, id_student, id_subject, answer_student, result_exam, status_exam, class) VALUES 
('HIS-uHnE3o', 'STD-aMClguF', 'SUB-rT6UeV', '{
  "EX-GEO16": "Energi surya",
  "EX-GEO14": "Amazon, Kongo, dan Indonesia",
  "EX-GEO12": "Papua Nugini",
  "EX-GEO3": "Af (hutan hujan tropis)",
  "EX-GEO7": "Garis Khatulistiwa",
  "EX-GEO17": "Rusia",
  "EX-GEO2": "Stratovolcano",
  "EX-GEO4": "Pelapukan mekanis",
  "EX-GEO1": "Stratosfer",
  "EX-GEO15": "Sirkum Pasifik",
  "EX-GEO9": "Hulu sungai",
  "EX-GEO10": "Indonesia",
  "EX-GEO8": "Batuan sedimen",
  "EX-GEO6": "Peningkatan curah hujan",
  "EX-GEO13": "Angin muson",
  "EX-GEO11": "Gempa bumi dan tsunami",
  "EX-GEO5": "Oseania"
}', '53', TRUE, '3A')

INSERT INTO history_exams (id_history_exam, id_student, id_subject, answer_student, result_exam, status_exam, class) VALUES 
('HIS-tY7cRq', 'STD-aMClguF', 'SUB-wPTu3V', '{
  "EX-ENG16": "must",
  "EX-ENG8": "Beautiful",
  "EX-ENG17": "She goes to school.",
  "EX-ENG1": "go",
  "EX-ENG9": "to",
  "EX-ENG2": "Easy",
  "EX-ENG10": "better",
  "EX-ENG15": "since",
  "EX-ENG7": "She doesn`t like apples",
  "EX-ENG13": "isn`t you",
  "EX-ENG3": "Went",
  "EX-ENG18": "Perpustakaan",
  "EX-ENG5": "are",
  "EX-ENG14": "Children",
  "EX-ENG6": "Sad",
  "EX-ENG4": "an",
  "EX-ENG11": "Chair",
  "EX-ENG12": "Bought"
}', '67', TRUE, '3A')

UPDATE history_exams SET id_subject = "SUB-rT6UeV" WHERE id_history_exam = 'HIS-uRnH3o'

SELECT * FROM history_exams
