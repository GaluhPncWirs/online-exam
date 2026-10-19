USE online_exam


CREATE TABLE subject_exam (
    id_subject VARCHAR(10) NOT NULL PRIMARY KEY,
    id_teacher VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exam_questions JSON NOT NULL,
    name_exam VARCHAR(100) NOT NULL,
    type_exam ENUM('PG', 'ESSAY') DEFAULT 'PG',
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_subject_exam FOREIGN KEY(id_teacher) REFERENCES account_teacher
)ENGINE=innodb

SHOW CREATE TABLE subject_exam

DESCRIBE subject_exam