# College Lesson Hub

A mobile-first, installable Progressive Web App (PWA) for organizing and distributing college learning materials.

## Overview

College Lesson Hub provides a simple learning-content workflow:

**Teacher Dashboard → Google Sheets → Student PWA → Lecture PDFs**

Teachers can manage subjects, units, lectures, publication status, and PDF resources. Students use a lightweight PWA to browse published learning material without repeatedly reinstalling the app when new lessons are published.

## Key Features

- Installable Progressive Web App
- Mobile-friendly student interface
- Subject → Unit → Lecture navigation
- PDF-based lecture material
- Google Sheets as the content/data layer
- Google Apps Script teacher administration
- Google Drive PDF storage
- Publish/unpublish workflow
- Teacher authorization
- GitHub Pages hosting
- New published lessons can appear in the existing student app

## Technology Stack

- HTML
- CSS
- JavaScript
- Progressive Web App (PWA)
- GitHub Pages
- Google Apps Script
- Google Sheets
- Google Drive

## Architecture

```text
                 ┌──────────────────────┐
                 │   Teacher Dashboard  │
                 │   Google Apps Script │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     Google Sheets    │
                 │ Subjects / Units /   │
                 │ Lectures / Status    │
                 └──────────┬───────────┘
                            │
                       Published Data
                            │
                            ▼
                 ┌──────────────────────┐
                 │     Student PWA      │
                 │     GitHub Pages     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Lecture PDF Files  │
                 │     Google Drive     │
                 └──────────────────────┘
```

## Project Structure

```text
college-lesson-hub/
├── README.md
├── LICENSE
├── .gitignore
├── student-app/
│   └── README.md
├── teacher-dashboard/
│   ├── Code.gs
│   └── README.md
└── documentation/
    ├── architecture.md
    └── setup-guide.md
```

## Portfolio Value

This project demonstrates practical skills in:

- Product and UI thinking
- PWA development
- Content-management workflows
- Google Apps Script automation
- Spreadsheet-backed applications
- Cloud file integration
- Access-control concepts
- Static web deployment
- Documentation and system architecture

## Security Note

This public portfolio repository intentionally does **not** contain private deployment URLs, teacher email addresses, spreadsheet edit URLs, credentials, or sensitive IDs.

## Live Demo

The live student application can be added here after publishing the repository.

## Author

Built as a practical education technology project and portfolio piece.
