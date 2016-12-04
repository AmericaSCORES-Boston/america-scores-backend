DROP DATABASE IF EXISTS america_scores;
CREATE DATABASE america_scores;

USE america_scores;

CREATE TABLE Site
(
    site_id int NOT NULL AUTO_INCREMENT,
    site_name varchar(255) NOT NULL,
    site_address varchar(255),
    PRIMARY KEY (site_id)
);

CREATE TABLE Program
(
    program_id int NOT NULL AUTO_INCREMENT,
    site_id int,
    program_name varchar(255) NOT NULL,
    PRIMARY KEY (program_id),
    FOREIGN KEY (site_id) REFERENCES Site(site_id)
);

CREATE TABLE Student
(
    student_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    dob date,
    PRIMARY KEY (student_id)
);

CREATE TABLE StudentToProgram
(
    id int NOT NULL AUTO_INCREMENT,
    student_id int NOT NULL,
    program_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (program_id) REFERENCES Program(program_id)
);

CREATE TABLE Acct
(
    acct_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    acct_type ENUM('Coach', 'Volunteer', 'Staff', 'Admin'),
    PRIMARY KEY (acct_id)
);

CREATE TABLE AcctToProgram
(
    id int NOT NULL AUTO_INCREMENT,
    acct_id int NOT NULL,
    program_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (acct_id) REFERENCES Acct(acct_id),
    FOREIGN KEY (program_id) REFERENCES Program(program_id)
);

CREATE TABLE Event
(
    event_id int NOT NULL AUTO_INCREMENT,
    program_id int,
    acct_id int,
    event_date date,
    PRIMARY KEY (event_id),
    FOREIGN KEY (program_id) REFERENCES Program(program_id),
    FOREIGN KEY (acct_id) REFERENCES Acct(acct_id)
);

CREATE TABLE Measurement
(
    measurement_id int NOT NULL AUTO_INCREMENT,
    student_id int NOT NULL,
    event_id int NOT NULL,
    height int NULL,
    weight int NULL,
    pacer int NULL,
    PRIMARY KEY (measurement_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);
