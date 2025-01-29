-- Seleccionar la base de datos
USE boletin_guevara1;

-- Tabla 'alumnos'
CREATE TABLE IF NOT EXISTS alumnos (
    dni INT NOT NULL,
    nombre VARCHAR(50) DEFAULT NULL,
    apellido VARCHAR(50) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    curso VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla 'materias'
CREATE TABLE IF NOT EXISTS materias (
    id_materia INT NOT NULL AUTO_INCREMENT,
    nombre_materia VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_materia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla 'usuarios'
CREATE TABLE IF NOT EXISTS usuarios (
    dni VARCHAR(20) NOT NULL,
    nombre VARCHAR(50) DEFAULT NULL,
    apellido VARCHAR(50) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    rol VARCHAR(50) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla 'notas'
CREATE TABLE IF NOT EXISTS notas (
    id_nota INT NOT NULL AUTO_INCREMENT,
    dni_alumno VARCHAR(20) DEFAULT NULL,
    id_materia INT DEFAULT NULL,
    informe_1_cuatrimestre1 INT DEFAULT NULL,
    informe_2_cuatrimestre1 INT DEFAULT NULL,
    nota_cuatrimestre1 INT DEFAULT NULL,
    informe_1_cuatrimestre2 INT DEFAULT NULL,
    informe_2_cuatrimestre2 INT DEFAULT NULL,
    nota_cuatrimestre2 INT DEFAULT NULL,
    nota_anual INT DEFAULT NULL,
    rec_dic INT DEFAULT NULL,
    rec_feb INT DEFAULT NULL,
    nota_final INT DEFAULT NULL,
    PRIMARY KEY (id_nota),
    UNIQUE KEY unique_dni_materia (dni_alumno, id_materia),
    FOREIGN KEY (id_materia) REFERENCES materias (id_materia),
    FOREIGN KEY (dni_alumno) REFERENCES usuarios (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserción de datos iniciales en 'materias'
INSERT IGNORE INTO materias (id_materia, nombre_materia)
VALUES 
    (1, 'matematica'), 
    (2, 'ingles'), 
    (3, 'juridico'),
    (4, 'asistencia'), 
    (5, 'autogestion'),
    (6, 'hardware'),
    (7, 'practicas'),
    (8, 'programacion'),
    (9, 'redes'),
    (10, 'arduino');

-- Inserción de datos iniciales en 'usuarios'
INSERT IGNORE INTO usuarios (dni, nombre, apellido, email, rol, password)
VALUES 
    ('12345678', 'matias', 'no se', 'gio.paule05@gmail.com', 'alumno', 'alumno'),
    ('45888879', 'Giovanni', 'Pauletto', 'gio.paule05@gmail.com', 'administrador', 'admin123'),
    ('45888880', 'Gio', 'Pau', 'fliapauletto@gmail.com', 'alumno', 'alumno'),
    ('45888890', 'pablo', 'xd', 'gio.paule05@gmail.com', 'encargado', 'encargado'),
    ('87654321', 'lucas', 'lucas', 'gio.paule05@gmail.com', 'alumno', 'alumno');
