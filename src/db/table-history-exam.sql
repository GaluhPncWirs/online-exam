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

