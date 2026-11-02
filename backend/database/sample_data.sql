
-- Sample questionnaire data for Phase 2
-- Uses the existing database tables

START TRANSACTION;

-- 1. Questionnaire
INSERT INTO questionnaire
(qid, description, active)
VALUES
(9001, 'Student Learning Experience', 1);

-- 2. Pages
INSERT INTO qpage
(pid, ptitle, pseqnum, qid, pgeneralinline, pgeneralfile)
VALUES
(9101, 'Student Information', 1, 9001, '', ''),
(9102, 'Learning Feedback', 2, 9001, '', '');

-- 3. Groups (categories)
INSERT INTO qgroup
(gid, pid, gseqnum, gtitle)
VALUES
(9201, 9101, 1, 'Personal Information'),
(9202, 9102, 1, 'Course Feedback');

-- 4. Questions
INSERT INTO qfield
(fid, gid, fseqnum, ftitle)
VALUES
(9301, 9201, 1, 'What is your name?'),
(9302, 9202, 1, 'How do you prefer to study?'),
(9303, 9202, 2, 'How satisfied are you with your studies?');

-- 5. Text question
INSERT INTO ftext
(ftid, ftlabel, ftstoreas)
VALUES
(9301, 'Enter your name', 'TEXT');

-- 6. Radio question options
INSERT INTO fchoice
(fcid, fclabel, fcseqnum, fcoutvalid, fcpresentation)
VALUES
(9302, 'Online', 1, 1, 'RADIO'),
(9302, 'On campus', 2, 2, 'RADIO'),
(9302, 'Both', 3, 3, 'RADIO');

-- 7. Slider question
INSERT INTO fslider
(fsid, fsstoreas, fslabel, fsrangeb, fsrangee)
VALUES
(9303, 'INTEGER', 'Satisfaction level', 1, 10);

COMMIT;
