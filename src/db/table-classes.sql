USE online_exam

CREATE TABLE classes (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB;

INSERT INTO classes (name)
SELECT DISTINCT class FROM account_students WHERE role = "student"

SELECT * FROM classes