-- Up
CREATE TABLE DayType
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
color INTEGER
);

INSERT INTO DayType (name, color) VALUES ("훈련소", "FFD7DA");
INSERT INTO DayType (name, color) VALUES ("당직", "FFA4AB");
INSERT INTO DayType (name, color) VALUES ("평일", "FFEBEA");
INSERT INTO DayType (name, color) VALUES ("외박", "EDF6DF");
INSERT INTO DayType (name, color) VALUES ("휴가", "C9F0E2");
INSERT INTO DayType (name, color) VALUES ("민간인", "E1E5F4");


CREATE TABLE Diary
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
date INTEGER NOT NULL UNIQUE,
dayType INTEGER REFERENCES DayType (id) ON DELETE RESTRICT,
text TEXT
);


CREATE TABLE Settings
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
"key" TEXT NOT NULL UNIQUE,
value TEXT NOT NULL UNIQUE
);

INSERT INTO Settings (key, value) VALUES ("startDate", 17917);
INSERT INTO Settings (key, value) VALUES ("endDate", 18501);


-- Down
DROP TABLE DayType;
DROP TABLE Diary;
DROP TABLE Settings;
