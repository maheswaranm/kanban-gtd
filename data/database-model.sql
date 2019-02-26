BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "audit" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"table"	INTEGER NOT NULL,
	"data_id"	INTEGER NOT NULL,
	"change"	TEXT,
	"time"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "card" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"text"	varchar NOT NULL,
	"position"	integer NOT NULL,
	"laneId"	integer,
	"create_time"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"update_time"	TEXT,
	CONSTRAINT "FK_0e94aa0ee13908c6ccbd6e44326" FOREIGN KEY("laneId") REFERENCES "lane"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "lane" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	varchar NOT NULL,
	"boardId"	integer,
	CONSTRAINT "FK_b577a45ba3422b2d8fb741f5095" FOREIGN KEY("boardId") REFERENCES "board"("id")
);
CREATE TABLE IF NOT EXISTS "user" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"firstName"	varchar NOT NULL,
	"lastName"	varchar NOT NULL,
	"age"	integer NOT NULL
);
CREATE TABLE IF NOT EXISTS "board" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	varchar NOT NULL
);
CREATE TRIGGER audit_card_insert AFTER INSERT 
ON card
BEGIN
	INSERT INTO "audit"("table","data_id","change","time") VALUES ("card",NEW.id,"card added to lane " || new.laneId,CURRENT_TIMESTAMP);
END;
COMMIT;
