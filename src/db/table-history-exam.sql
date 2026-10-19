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

ALTER TABLE 

INSERT INTO history_exams (id_history_exam, id_student, id_subject, answer_student, result_exam, status_exam, class) VALUES 
('HIS-uRnH3o', 'STD-aMClguF', 'SUB-wPTu3V', '{
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

SELECT * FROM history_exams
