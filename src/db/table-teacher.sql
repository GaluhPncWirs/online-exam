USE online_exam

CREATE TABLE account_teacher (
    id_teacher VARCHAR(12) NOT NULL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') DEFAULT 'teacher',
    teach_role TEXT,
    no_tlp VARCHAR(15),
    nisn VARCHAR(10),
    profil_img TEXT
)ENGINE=innodb

DROP TABLE account_teacher

DESCRIBE account_teacher

INSERT INTO account_teacher (id_teacher, fullname, email, password, teach_role, no_tlp, nisn) VALUES 
('TCR-ar45dgU', 'Nur rohman', 'nurRohman54@gmail.com', 'myTeacher456', 'MTK-B.indonesia-PKN', '089301874537', '1645326739')

SELECT * FROM account_teacher