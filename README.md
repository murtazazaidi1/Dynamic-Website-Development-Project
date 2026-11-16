# Online Questionnaire Tool

This project was developed for the Dynamic Website Development course at LAB University of Applied Sciences.

The application uses React, TypeScript, PHP, and MySQL to load and display questionnaires dynamically.

## Requirements

Before running the project, make sure you have installed:

- Node.js and npm
- PHP
- MySQL (XAMPP recommended)

## How to Run the Project

### 1. Install Dependencies

Open the project folder in VS Code and run:

```bash
npm install
```

### 2. Set Up the Database

1. Start MySQL using XAMPP.
2. Open phpMyAdmin at `http://localhost/phpmyadmin`.
3. Create a database.
4. Import the teacher-provided `databasestruct.txt` SQL schema.
5. Import `backend/database/questionnaire.sql` to add the sample questionnaire.
6. Check that the database connection settings in `backend/config/db.php` match your MySQL setup.

### 3. Start the PHP Backend

Open a terminal in the project folder and run:

```bash
php -S localhost:8000 -t backend
```

You can test the API at:

`http://localhost:8000/api/questionnaire.php?id=1001`

### 4. Start the React Frontend

Open another terminal in the project folder and run:

```bash
npm run dev
```

Open the application at:

`http://localhost:5173/`

Both the PHP server and MySQL must be running for the questionnaire to load.

### 5. Build the Project (Optional)

To check that the frontend builds successfully, run:

```bash
npm run build
```

## Sample Questionnaire

The project includes a LAB UAS Student Feedback Questionnaire with ID `1001`.

The questionnaire data is retrieved from MySQL through the PHP API.

---

**Course:** Dynamic Website Development  
**University:** LAB University of Applied Sciences  
**Phase:** 2
