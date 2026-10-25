# Online Questionnaire Tool

## About the Project

This project was developed for our Dynamic Website Development course at LAB University of Applied Sciences.

We are a team of five students, and our task is to create an online questionnaire application using React and TypeScript.

The idea is to make a questionnaire tool that can work with different JSON files. Instead of writing questions directly into the React code, we load them from JSON. This means we can change the questions, pages, and categories without changing the application's components.

For Phase 1, we focused on building the frontend and making sure the questionnaire works with different configurations.

## Technologies We Used

- React and TypeScript
- Vite
- Material UI
- Redux Toolkit
- Recharts
- JSON
- Git and GitHub

## What Our Application Can Do

### Different Question Types

Our questionnaire supports six types of questions:

- Text input
- Radio buttons
- Multiple selection
- Dropdown menu
- Slider
- Date input

### Pages and Categories

A questionnaire can have multiple pages and categories. We also support categories inside other categories.

All of these are loaded from the JSON file, so the application is not limited to one specific questionnaire.

### Saving Answers

We use Redux to manage the answers while the application is running.

Users can move between pages, change their answers, or clear all answers and start again.

### Results and Radar Charts

Our application calculates average scores for categories based on the numerical answers.

The scores are rounded to the nearest integer and displayed using radar charts. Users can see their results while completing the questionnaire.

### Final Report

At the end, users can view a report containing their results.

We also added a print option so users can print the report or save it as a PDF through their browser.

### Branding

We added a separate `branding.json` file where we can change the application's primary color, background color, text color, logo, and background image.

This allows us to customize the appearance without changing the React code.

## How to Run Our Project

First, clone the repository from GitHub and open the project folder.

Install the required packages:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

Then open the localhost address shown in the terminal, usually:

`http://localhost:5173/`

To check whether the project builds correctly, run:

```bash
npm run build
```

## Testing Different Questionnaires

We included two example questionnaires to test whether our application works with different JSON structures.

The default questionnaire can be opened at:

`http://localhost:5173/`

The second questionnaire can be opened at:

### Switching Questionnaires

The application includes two sample questionnaires: LAB UAS Student Feedback and Workplace Wellbeing.

Users can switch between them using the **Next Questionnaire** and **Previous Questionnaire** buttons.

When switching questionnaires, the application loads the selected JSON file, clears previous answers, and starts from the first page.

Questionnaires are stored in the `public/questionnaires/` folder.

Both files are located in the `public/questionnaires/` folder.

## How the JSON Works

Each questionnaire JSON file contains information about the questionnaire, including its title, introduction, pages, categories, questions, and results.

Questions are connected to categories using `categoryId`, and categories are connected to pages using `pageId`.

We use `parentId` for nested categories and `order` to control the order in which things appear.

We created the application so it reads this structure and generates the questionnaire automatically.

## Project Structure

```text
public/
  questionnaires/
    questionnaire.json
    second-questionnaire.json
    branding.json

src/
  components/
    questionnaire/
    questions/
    results/
  services/
    questionnaireLoader.ts
  store/
    store.ts
    answerSlice.ts
  types/
    questionnaire.ts
  utils/
    calculations.ts
  App.tsx
  main.tsx
```

## How We Tested It

We tested the application by answering different types of questions, moving between pages, checking the radar charts, and opening the final report.

We also tested clearing answers, printing the report, and loading a different questionnaire through the URL.

To test branding, we changed the values in `branding.json` and checked how they affected the application.

## Phase 1 and Phase 2

In Phase 1, we are using React and TypeScript with JSON files. We are not using Laravel or a database.

In Phase 2, we will work on connecting the application to a backend and database.

## Teamwork

Our team has five members. We divided the work into different parts, including the JSON structure, questionnaire components, question inputs, results, and integration.

We used GitHub feature branches and pull requests to work on different features and merge them into the main branch.

**Course:** Dynamic Website Development  
**University:** LAB University of Applied Sciences  
**Project:** Online Questionnaire Tool  
**Phase:** 1
