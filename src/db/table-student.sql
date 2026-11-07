USE online_exam 

CREATE TABLE account_students (
    id_student VARCHAR(12) NOT NULL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fullname VARCHAR(100) NOT NULL,
    class VARCHAR(3) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') DEFAULT 'student',
    nis VARCHAR(5),
    no_tlp VARCHAR(15),
    profil_img TEXT,
    type_account ENUM('default', 'google') DEFAULT 'default'
) ENGINE = innodb 

SHOW CREATE TABLE account_students 

DESCRIBE account_students

CREATE INDEX idx_account_student_classes ON account_students (class, id_student)

INSERT INTO account_students (id_student, fullname, class, email, password, nis, no_tlp) VALUES 
('STD-aMClguF', 'Galuh panca wirasa', '3A', 'galuhpncwirs22@gmail.com', 'testPelajar123', '79704', '089782648264')

SELECT * FROM account_students

ALTER TABLE account_students
    ADD COLUMN class_id INT UNSIGNED NULL,
    ADD CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES classes(id)

UPDATE account_students AS s
JOIN classes AS c ON c.name = s.class
SET s.class_id = c.id
WHERE s.role = "student"

SELECT COUNT(*) FROM account_students WHERE role = 'student' AND class_id IS NULL;

ALTER TABLE account_students
  MODIFY class_id INT UNSIGNED NOT NULL;

ALTER TABLE account_students
  DROP COLUMN class;