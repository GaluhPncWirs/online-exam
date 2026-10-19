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