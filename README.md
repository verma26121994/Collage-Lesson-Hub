# 🎓 College Lesson Hub

> A mobile-first Progressive Web App (PWA) for colleges to organize and distribute learning materials through a teacher-managed content system.

[![App](https://img.shields.io/badge/App-PWA-blue)](#)
[![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-black)](#)
[![Backend](https://img.shields.io/badge/Backend-Google%20Apps%20Script-green)](#)
[![Data](https://img.shields.io/badge/Data-Google%20Sheets-brightgreen)](#)
[![Storage](https://img.shields.io/badge/Storage-Google%20Drive-yellow)](#)

---

## 🚀 Live Student App

👉 **[Open College Lesson Hub](https://verma26121994.github.io/collage-app/)**

The Student App can be opened on a phone or computer and installed as a PWA where supported.

Students can:

- View available subjects
- Open individual units
- Browse published lectures
- Access lecture PDFs
- Receive newly published learning material without reinstalling the application

---

## 💡 Project Overview

College Lesson Hub is a lightweight digital learning platform designed to make college study material easier to organize and distribute.

The system separates the **student experience** from the **teacher management system**.

### Student Side

Students use a simple mobile-friendly PWA to access published learning material.

### Teacher Side

Teachers use a private dashboard to manage:

- Subjects
- Units
- Lectures
- Lecture descriptions
- PDF learning materials
- Publication status

The project uses a low-cost architecture built around GitHub Pages, Google Apps Script, Google Sheets and Google Drive.

---

## 🎯 Problem

College learning material is often distributed through:

- WhatsApp groups
- Email
- Printed notes
- Multiple Google Drive links
- Scattered PDF files

This can make it difficult for students to find the correct material.

Teachers also need a simple way to add or update lessons without modifying application code.

---

## ✅ Solution

College Lesson Hub provides a centralized learning library.

The basic workflow is:

```text
Teacher
   ↓
Teacher Dashboard
   ↓
Google Apps Script
   ↓
Google Sheets
   ├── Subjects
   ├── Units
   └── Lectures
   ↓
Published Content
   ↓
Student PWA
   ↓
Lecture PDF
   ↓
Google Drive
```

The system separates content management from the student-facing application.

---

# ✨ Key Features

## 👨‍🎓 Student App

- Mobile-first interface
- Progressive Web App (PWA)
- Installable on supported devices
- Subject-based navigation
- Unit-based organization
- Lecture listing
- PDF learning material
- Simple and distraction-free interface
- No student login required
- No quizzes or unnecessary activities
- New published content becomes available through the content system

---

## 👩‍🏫 Teacher Dashboard

The private Teacher Dashboard allows authorized teachers to manage the learning library.

### Dashboard

Provides an overview of:

- Total subjects
- Active subjects
- Total units
- Total lectures
- Published lectures

### Subject Management

Teachers can:

- Add subjects
- Edit subjects
- Activate or deactivate subjects
- Delete subjects

### Unit Management

Teachers can:

- Add units
- Edit units
- Manage unit status
- Organize units under subjects

### Lecture Management

Teachers can:

- Add lectures
- Edit lectures
- Add descriptions
- Upload lecture PDFs
- Publish or unpublish lectures
- Search and filter lectures

---

# 🏗️ Technology Stack

| Component | Technology |
|---|---|
| Student Frontend | HTML, CSS, JavaScript |
| PWA | Web App Manifest + Service Worker |
| Hosting | GitHub Pages |
| Teacher Backend | Google Apps Script |
| Content Data | Google Sheets |
| PDF Storage | Google Drive |
| Access Control | Google Account + Apps Script |
| Version Control | GitHub |

---

# 🔄 Content Management Workflow

The system is designed so that teachers do not need to edit the student application whenever a new lesson is added.

### Step 1 — Teacher creates content

The teacher opens the private Teacher Dashboard.

### Step 2 — Add subject, unit or lecture

The teacher creates or updates the relevant content.

### Step 3 — Upload PDF

The lecture PDF is stored in Google Drive.

### Step 4 — Publish lecture

The teacher changes the lecture status to published.

### Step 5 — Student App reads published content

The Student App retrieves the published content from the content source.

### Step 6 — Students access the lesson

Students open the relevant subject and unit and access the lecture PDF.

```text
Add Lesson
    ↓
Upload PDF
    ↓
Publish
    ↓
Google Sheets
    ↓
Student PWA
    ↓
Student opens lesson
```

---

# 📱 Student User Flow

```text
Student opens app
        ↓
    My Subjects
        ↓
   Select Subject
        ↓
     Select Unit
        ↓
   Select Lecture
        ↓
  Open Lesson PDF
```

The interface intentionally keeps the student journey simple.

---

# 🔐 Security Design

The project separates public student access from private teacher management.

### Student App

The Student App is publicly accessible because students need to access the learning library.

### Teacher Dashboard

The Teacher Dashboard is restricted to authorized teacher access.

### Google Sheet

The working Google Sheet is used as the content management source.

### Google Drive

Lecture PDFs are stored separately from the application.

### Important

Sensitive information should never be committed to the public GitHub repository.

Do not publish:

- Google account passwords
- Private API keys
- OAuth credentials
- Private spreadsheet edit URLs
- Sensitive teacher information
- Private configuration values

Public portfolio code should use placeholders where necessary.

---

# 📂 Repository Structure

```text
College-Lesson-Hub/
│
├── README.md
├── LICENSE
│
├── student-app/
│   ├── index.html
│   ├── styles.css
│   ├── manifest.json
│   ├── sw.js
│   └── content-config.json
│
├── teacher-dashboard/
│   ├── Code.gs
│   └── README.md
│
└── documentation/
    ├── README.md
    │
    └── screenshots/
        ├── student-home.png
        ├── subject-page.png
        ├── lecture-page.png
        ├── teacher-dashboard.png
        └── subject-management.png
```

---

# 🖥️ Screenshots

## 📱 Student App

### Home — Subject Library

![Student App Home](documentation/screenshots/student-home.png)

### Subject View

![Subject View](documentation/screenshots/subject-page.png)

### Lecture List

![Lecture List](documentation/screenshots/lecture-page.png)

---

## 👩‍🏫 Teacher Dashboard

### Dashboard

![Teacher Dashboard](documentation/screenshots/teacher-dashboard.png)

### Subject Management

![Subject Management](documentation/screenshots/subject-management.png)

---

# 🎓 Demonstration Subject

The current demonstration content includes:

**Environmental Laws of India**

The system can be extended to additional subjects without changing the basic student navigation structure.

Example:

```text
Environmental Laws of India
        ↓
      Units
        ↓
    Lectures
        ↓
       PDFs
```

Additional subjects can follow the same structure.

---

# 🌐 Deployment

The Student App is hosted using GitHub Pages.

Live application:

**https://verma26121994.github.io/collage-app/**

The application can be accessed from a browser and installed as a PWA on supported devices.

---

# 🧩 Design Philosophy

The project follows a few simple principles.

### 1. Simple for Students

Students should reach their learning material in a few taps.

### 2. Easy for Teachers

Teachers should be able to manage content without programming.

### 3. Low Cost

The system uses widely available platforms instead of requiring expensive server infrastructure.

### 4. Maintainable

Content is separated from the frontend application.

### 5. Mobile First

The student experience is designed primarily for smartphones.

---

# 🚀 Future Improvements

Potential future improvements include:

- Teacher analytics
- Student progress tracking
- Search across lectures
- Subject-wise announcements
- Offline PDF access
- Improved PWA caching
- Multiple teacher accounts
- Role-based access control
- Automated backups
- Notification system
- Attendance integration
- College-specific deployments
- Custom college branding
- Cloud database migration
- Admin analytics dashboard

---

# 🧠 What This Project Demonstrates

This project demonstrates practical experience in:

- Product design
- No-code / low-code application development
- Progressive Web Apps
- Responsive UI design
- Content management systems
- Google Apps Script
- Google Sheets integration
- Google Drive integration
- GitHub and GitHub Pages
- Access control
- CRUD operations
- File upload workflows
- Data-driven application architecture
- Documentation
- Deployment

---

# 💼 Portfolio Description

## Short Version

**College Lesson Hub** is a mobile-first PWA that provides colleges with a centralized platform for distributing learning material. It uses GitHub Pages for hosting, Google Apps Script for backend operations, Google Sheets for content management and Google Drive for PDF storage.

## Resume Version

> Designed and deployed a mobile-first Progressive Web App for centralized college learning content using GitHub Pages, Google Apps Script, Google Sheets and Google Drive. Built a private teacher administration workflow for managing subjects, units, lectures, publication status and PDF resources, enabling students to access newly published learning material without reinstalling the application.

---

# 📈 Project Impact

The architecture is designed to reduce the effort required to distribute academic material.

Instead of repeatedly sending individual PDFs through messaging applications, teachers can organize material centrally:

```text
One Platform
     ↓
Subjects
     ↓
Units
     ↓
Lectures
     ↓
Learning Materials
```

This creates a more structured and scalable learning experience.

---

# 🛠️ Getting Started

## Student App

The Student App can be deployed using GitHub Pages.

Basic deployment process:

```text
1. Upload Student App files
2. Enable GitHub Pages
3. Configure the content source
4. Open the published GitHub Pages URL
5. Install as PWA on supported devices
```

## Teacher Dashboard

The Teacher Dashboard is implemented using Google Apps Script.

Basic setup:

```text
1. Create Google Sheet
2. Create required content sheets
3. Add Apps Script backend
4. Configure authorized teacher access
5. Deploy Apps Script Web App
6. Connect content management workflow
```

---

# ⚠️ Portfolio Security Note

This repository is intended to demonstrate the architecture and implementation of the project.

Private production credentials and private management resources should remain outside the public repository.

If deploying your own version, replace example configuration values with your own credentials and resource IDs.

---

# 📄 License

This project is provided for educational and portfolio purposes.

See the `LICENSE` file for details.

---

# 👤 Author

**Shubham Verma**

College Lesson Hub  
GitHub Portfolio Project

---

# ⭐ Project Highlights

```text
📱 Mobile-first PWA
🎓 College Learning Platform
👩‍🏫 Teacher Management Dashboard
📚 Subject → Unit → Lecture structure
📄 PDF Learning Materials
☁️ Google Drive Storage
📊 Google Sheets Content Management
⚙️ Google Apps Script Backend
🌐 GitHub Pages Deployment
🔐 Teacher Access Control
📖 Portfolio-ready Architecture
```

---

# 🔗 Live Project

👉 **[Open College Lesson Hub](https://verma26121994.github.io/collage-app/)**

---

> Built as a practical demonstration of how modern low-code technologies can be combined to create a lightweight, maintainable educational platform.
