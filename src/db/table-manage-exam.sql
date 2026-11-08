USE online_exam

CREATE TABLE manage_exams (
    id_manage_exam VARCHAR(10) NOT NULL PRIMARY KEY,
    id_teacher VARCHAR(12) NOT NULL,
    id_subject VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    class VARCHAR(3) NOT NULL,
    deadline_exam TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_exam INT NOT NULL,
    is_manage_exam BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_id_teacher FOREIGN KEY(id_teacher) REFERENCES account_teacher,
    CONSTRAINT fk_id_manage_subject_exam FOREIGN KEY(id_subject) REFERENCES subject_exam
)ENGINE=innodb

DESCRIBE manage_exams

SHOW CREATE TABLE manage_exams

ALTER TABLE manage_exams DROP FOREIGN KEY fk_id_manage_subject_exam

ALTER TABLE manage_exams
ADD CONSTRAINT fk_id_manage_subject_exam
FOREIGN KEY (id_subject)
REFERENCES subject_exam(id_subject)

ALTER TABLE manage_exams ADD COLUMN id_history_exam VARCHAR(10) NOT NULL

ALTER TABLE manage_exams ADD COLUMN exam_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

CREATE INDEX idx_manage_exams_teacher_created ON manage_exams (id_teacher, created_at)

ALTER TABLE manage_exams MODIFY COLUMN id_history_exam VARCHAR(10) NOT NULL AFTER id_subject

ALTER TABLE manage_exams MODIFY COLUMN deadline_exam JSON NOT NULL

ALTER TABLE manage_exams ADD CONSTRAINT fk_id_history_exam FOREIGN KEY(id_history_exam) REFERENCES history_exams (id_history_exam)

INSERT INTO manage_exams (id_manage_exam, id_teacher, id_subject, id_history_exam, class, deadline_exam, duration_exam, is_manage_exam) VALUES 
('MNG-oxTG3r', 'TCR-ar45dgU', 'SUB-wPTu3V', 'HIS-uRnH3o', '3A', '2026-09-10 10:30:00', 1800, TRUE)

UPDATE manage_exams SET id_history_exam = 'HIS-tY7cRq' WHERE id_manage_exam = 'MNG-oxTG3r'

INSERT INTO manage_exams (id_manage_exam, id_teacher, id_subject, id_history_exam, class, deadline_exam, duration_exam, is_manage_exam) VALUES 
('MNG-Igr3nY', 'TCR-ar45dgU', 'SUB-rT6UeV', 'HIS-uRnH3o', '3A', '2026-10-15 07:44:32', 3000, TRUE)

DELETE FROM manage_exams WHERE id_manage_exam = 'MNG-oxTG3r'

SELECT * FROM manage_exams


UPDATE manage_exams SET exam_start_at = '08:00' WHERE id_manage_exam = 'MNG-Igr3nY'

UPDATE manage_exams SET exam_end_at = '10:30' WHERE id_manage_exam = 'MNG-Igr3nY'

UPDATE manage_exams SET exam_start_at = '10:30' WHERE id_manage_exam = 'MNG-oxTG3r'

UPDATE manage_exams SET exam_end_at = '12:00' WHERE id_manage_exam = 'MNG-oxTG3r'

ALTER TABLE manage_exams DROP FOREIGN KEY fk_id_teacher;
ALTER TABLE manage_exams DROP FOREIGN KEY fk_id_manage_subject_exam;
ALTER TABLE manage_exams DROP FOREIGN KEY fk_id_history_exam;

ALTER TABLE manage_exams
CHANGE COLUMN deadline_exam exam_start_at TIME NOT NULL;

ALTER TABLE manage_exams
ADD COLUMN exam_end_at TIME NOT NULL AFTER exam_start_at;

-- UPDATE manage_exams
-- SET exam_end_at = DATE_ADD(exam_start_at, INTERVAL 90 MINUTE);

ALTER TABLE manage_exams
ADD CONSTRAINT fk_id_teacher
FOREIGN KEY (id_teacher) REFERENCES account_teacher(id_teacher);

ALTER TABLE manage_exams
ADD CONSTRAINT fk_id_manage_subject_exam
FOREIGN KEY (id_subject) REFERENCES subject_exam(id_subject);

ALTER TABLE manage_exams
ADD CONSTRAINT fk_id_history_exam
FOREIGN KEY (id_history_exam) REFERENCES history_exams(id_history_exam);

ALTER TABLE manage_exams
ADD UNIQUE KEY uq_exam_schedule (exam_date, exam_start_at, class);

UPDATE manage_exams AS m
JOIN classes AS c
  ON c.name = m.class
SET m.class_id = c.id;


ALTER TABLE manage_exams
  ADD COLUMN class_id INT UNSIGNED NOT NULL
  ADD CONSTRAINT fk_exam_class FOREIGN KEY (class_id) REFERENCES classes(id)
  ADD CONSTRAINT chk_exam_time CHECK (exam_end_at > exam_start_at),
  ADD INDEX idx_exam_class_time (class_id, exam_start_at, exam_end_at);

ALTER TABLE manage_exams DROP FOREIGN KEY fk_exam_class;

-- 3. manage_exams
ALTER TABLE manage_exams
  ADD COLUMN class_id INT UNSIGNED NULL;

UPDATE manage_exams AS m
JOIN classes AS c ON c.name = m.class
SET m.class_id = c.id;

SELECT COUNT(*) AS belum_terhubung
FROM manage_exams
WHERE class_id IS NULL;

ALTER TABLE manage_exams
  MODIFY class_id INT UNSIGNED NOT NULL;

ALTER TABLE manage_exams
  ADD CONSTRAINT fk_manage_exam_class
  FOREIGN KEY (class_id) REFERENCES classes(id);

ALTER TABLE manage_exams
  DROP COLUMN class;

SELECT id_manage_exam FROM manage_exams
WHERE TIMESTAMPDIFF(MINUTE, exam_start_at, exam_end_at) < duration_exam;

UPDATE manage_exams SET duration_exam = 150 WHERE id_manage_exam = 'MNG-Igr3nY'

UPDATE manage_exams SET duration_exam = 30 WHERE id_manage_exam = 'MNG-oxTG3r'

ALTER TABLE manage_exams
  ADD CONSTRAINT chk_exam_duration_fits
  CHECK (TIMESTAMPDIFF(MINUTE, exam_start_at, exam_end_at) >= duration_exam)