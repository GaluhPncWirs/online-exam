USE online_exam


CREATE TABLE subject_exam (
    id_subject VARCHAR(10) NOT NULL PRIMARY KEY,
    id_teacher VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exam_questions JSON NOT NULL,
    name_exam VARCHAR(100) NOT NULL,
    type_exam ENUM('PG', 'ESSAY') DEFAULT 'PG',
    deleted_at TIMESTAMP,

    CONSTRAINT fk_subject_exam FOREIGN KEY(id_teacher) REFERENCES account_teacher
)ENGINE=innodb

SHOW CREATE TABLE subject_exam

DESCRIBE subject_exam

ALTER TABLE subject_exam MODIFY deleted_at TIMESTAMP

ALTER TABLE subject_exam MODIFY id_teacher VARCHAR(12) NOT NULL

ALTER TABLE subject_exam DROP FOREIGN KEY fk_subject_exam

ALTER TABLE subject_exam
ADD CONSTRAINT fk_subject_exam
FOREIGN KEY (id_teacher)
REFERENCES account_teacher(id_teacher)

ALTER TABLE subject_exam ADD CONSTRAINT 

INSERT INTO subject_exam(id_subject, id_teacher, exam_questions, name_exam, type_exam) VALUES 
('SUB-rT6UeV', 'TCR-ar45dgU', '[{"id":"EX-GEO1","questions":"Lapisan atmosfer yang berperan penting dalam memantulkan gelombang radio adalah?","multipleChoice":{"choice_a":"Troposfer","choice_b":"Stratosfer","choice_c":"Mesosfer","choice_d":"Termosfer (ionosfer)","choice_e":"Eksosfer"},"correctAnswer":"Termosfer (ionosfer)"},{"id":"EX-GEO2","questions":"Gunung berapi yang terbentuk dari letusan magma yang bersifat cair dan membentuk lereng landai disebut?","multipleChoice":{"choice_a":"Stratovolcano","choice_b":"Perisai (shield volcano)","choice_c":"Maar","choice_d":"Kaldera","choice_e":"Dome"},"correctAnswer":"Perisai (shield volcano)"},{"id":"EX-GEO3","questions":"Iklim menurut klasifikasi Koppen yang bercirikan curah hujan tinggi sepanjang tahun adalah?","multipleChoice":{"choice_a":"Af (hutan hujan tropis)","choice_b":"Aw (sabana tropis)","choice_c":"Bs (stepa)","choice_d":"Bw (gurun)","choice_e":"Cf (iklim sedang basah)"},"correctAnswer":"Af (hutan hujan tropis)"},{"id":"EX-GEO4","questions":"Proses pelapukan batuan akibat perubahan suhu harian tanpa melibatkan makhluk hidup disebut?","multipleChoice":{"choice_a":"Pelapukan mekanis","choice_b":"Pelapukan kimiawi","choice_c":"Pelapukan biologis","choice_d":"Erosi","choice_e":"Sedimentasi"},"correctAnswer":"Pelapukan mekanis"},{"id":"EX-GEO5","questions":"Benua yang paling sedikit jumlah negara anggotanya adalah?","multipleChoice":{"choice_a":"Asia","choice_b":"Eropa","choice_c":"Oseania","choice_d":"Antartika","choice_e":"Afrika"},"correctAnswer":"Antartika"},{"id":"EX-GEO6","questions":"Fenomena El Nino di Indonesia biasanya menyebabkan?","multipleChoice":{"choice_a":"Musim hujan lebih panjang","choice_b":"Musim kemarau lebih panjang","choice_c":"Suhu udara lebih dingin","choice_d":"Peningkatan curah hujan","choice_e":"Angin barat bertiup lebih kuat"},"correctAnswer":"Musim kemarau lebih panjang"},{"id":"EX-GEO7","questions":"Garis khayal yang membagi bumi menjadi dua belahan, utara dan selatan disebut?","multipleChoice":{"choice_a":"Garis Bujur","choice_b":"Garis Tanggal Internasional","choice_c":"Garis Khatulistiwa","choice_d":"Garis Wallace","choice_e":"Tropis Capricornus"},"correctAnswer":"Garis Khatulistiwa"},{"id":"EX-GEO8","questions":"Jenis batuan yang terbentuk akibat pendinginan magma disebut?","multipleChoice":{"choice_a":"Batuan beku","choice_b":"Batuan sedimen","choice_c":"Batuan metamorf","choice_d":"Batuan organik","choice_e":"Batuan kimia"},"correctAnswer":"Batuan beku"},{"id":"EX-GEO9","questions":"Delta sungai terbentuk di?","multipleChoice":{"choice_a":"Hulu sungai","choice_b":"Lereng gunung","choice_c":"Muara sungai","choice_d":"Dasar laut dalam","choice_e":"Danau"},"correctAnswer":"Muara sungai"},{"id":"EX-GEO10","questions":"Negara kepulauan terbesar di dunia berdasarkan jumlah pulau adalah?","multipleChoice":{"choice_a":"Filipina","choice_b":"Indonesia","choice_c":"Jepang","choice_d":"Maladewa","choice_e":"Fiji"},"correctAnswer":"Indonesia"},{"id":"EX-GEO11","questions":"Fenomena pergerakan lempeng tektonik yang saling bertumbukan dapat menyebabkan?","multipleChoice":{"choice_a":"Gempa bumi dan tsunami","choice_b":"Hujan deras","choice_c":"Angin muson","choice_d":"Ozon menipis","choice_e":"Iklim tropis"},"correctAnswer":"Gempa bumi dan tsunami"},{"id":"EX-GEO12","questions":"Negara yang berbatasan langsung dengan Indonesia di daratan adalah?","multipleChoice":{"choice_a":"Singapura","choice_b":"Timor Leste","choice_c":"Filipina","choice_d":"Malaysia","choice_e":"Papua Nugini"},"correctAnswer":"Timor Leste"},{"id":"EX-GEO13","questions":"Jenis angin yang bertiup secara periodik setiap 6 bulan sekali di Asia Tenggara disebut?","multipleChoice":{"choice_a":"Angin darat","choice_b":"Angin laut","choice_c":"Angin muson","choice_d":"Angin fohn","choice_e":"Angin passat"},"correctAnswer":"Angin muson"},{"id":"EX-GEO14","questions":"Hutan hujan tropis banyak dijumpai di wilayah?","multipleChoice":{"choice_a":"Kutub utara","choice_b":"Gurun Sahara","choice_c":"Amazon, Kongo, dan Indonesia","choice_d":"Eropa Barat","choice_e":"Australia Tengah"},"correctAnswer":"Amazon, Kongo, dan Indonesia"},{"id":"EX-GEO15","questions":"Pulau Jawa termasuk ke dalam jalur pegunungan muda dunia yang disebut?","multipleChoice":{"choice_a":"Sirkum Pasifik","choice_b":"Sirkum Mediterania","choice_c":"Pegunungan Himalaya","choice_d":"Alpina","choice_e":"Rocky Mountains"},"correctAnswer":"Sirkum Pasifik"},{"id":"EX-GEO16","questions":"Sumber energi yang berasal dari panas bumi disebut?","multipleChoice":{"choice_a":"Energi surya","choice_b":"Energi fosil","choice_c":"Energi geotermal","choice_d":"Energi biomassa","choice_e":"Energi pasang surut"},"correctAnswer":"Energi geotermal"},{"id":"EX-GEO17","questions":"Negara dengan luas wilayah terbesar di dunia adalah?","multipleChoice":{"choice_a":"Cina","choice_b":"Kanada","choice_c":"Amerika Serikat","choice_d":"Rusia","choice_e":"Brazil"},"correctAnswer":"Rusia"}]', 'Ujian Mata Pelajaran Geografi', 'PG')

SELECT * FROM subject_exam

DELETE FROM subject_exam WHERE id_subject = 'SUB-wPTu3V'