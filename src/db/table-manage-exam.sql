USE online_exam

CREATE TABLE manage_exams (
    id_manage_exam VARCHAR(10) NOT NULL PRIMARY KEY,
    id_teacher VARCHAR(12) NOT NULL,
    id_subject VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    class VARCHAR(3) NOT NULL,
    deadline_exam TIMESTAMP default CURRENT_TIMESTAMP,
    duration_exam INT NOT NULL,
    is_manage_exam BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_id_teacher FOREIGN KEY(id_teacher) REFERENCES account_teacher,
    CONSTRAINT fk_id_manage_subject_exam FOREIGN KEY(id_subject) REFERENCES subject_exam
)ENGINE=innodb

DESCRIBE manage_exams

ALTER TABLE manage_exams ADD COLUMN id_history_exam VARCHAR(10) NOT NULL

ALTER TABLE manage_exams MODIFY COLUMN id_history_exam VARCHAR(10) NOT NULL AFTER id_subject

ALTER TABLE manage_exams ADD CONSTRAINT fk_id_history_exam FOREIGN KEY(id_history_exam) REFERENCES history_exams (id_history_exam)

INSERT INTO manage_exams (id_manage_exam, id_teacher, id_subject, id_history_exam, class, deadline_exam, duration_exam, is_manage_exam) VALUES 
('MNG-oxTG3r', 'TCR-ar45dgU', 'SUB-wPTu3V', 'HIS-uRnH3o', '3A', '2026-09-10 10:30:00', 1800, TRUE)

DELETE FROM manage_exams WHERE id_manage_exam = 'MNG-oxTG3r'

SELECT * FROM manage_exams