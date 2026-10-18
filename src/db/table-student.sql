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

INSERT INTO account_students (id_student, fullname, class, email, password, nis, no_tlp) VALUES 
('STD-aMClguF', 'Galuh panca wirasa', '3A', 'galuhpncwirs22@gmail.com', 'testPelajar123', '79704', '089782648264')

SELECT * FROM account_students