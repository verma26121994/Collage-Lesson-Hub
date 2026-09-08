# 🎓 College Lesson Hub

> A mobile-first Progressive Web App (PWA) for colleges to organize and distribute learning materials through a teacher-managed content system.

[![App](https://img.shields.io/badge/App-PWA-blue)](#)
[![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-black)](#)
[![Backend](https://img.shields.io/badge/Backend-Google%20Apps%20Script-green)](#)
[![Database](https://img.shields.io/badge/Data-Google%20Sheets-brightgreen)](#)
[![Storage](https://img.shields.io/badge/Storage-Google%20Drive-yellow)](#)

---

## 🚀 Live Student App

👉 **[Open College Lesson Hub](https://verma26121994.github.io/collage-app/)**

The Student App can be opened on a phone or computer and installed as a PWA where supported.

Students can:

- View available subjects
- Open individual units
- Browse published lectures
- Open lecture PDFs
- Access newly published learning material without reinstalling the app

---

# 💡 Project Overview

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

The project uses a low-cost, low-maintenance architecture built around GitHub Pages, Google Apps Script, Google Sheets and Google Drive.

---

# 🎯 Problem

Traditional college learning material is often distributed through:

- WhatsApp groups
- Email
- Printed notes
- Multiple Google Drive links
- Scattered PDF files

This can make it difficult for students to find the correct material.

Teachers also need a simple way to add or update lessons without modifying application code.

---

# ✅ Solution

College Lesson Hub provides a centralized learning library.

The basic workflow is:

```text
Teacher
   │
   ▼
Teacher Dashboard
   │
   ▼
Google Apps Script
   │
   ▼
Google Sheets
   │
   ├── Subjects
   ├── Units
   └── Lectures
   │
   ▼
Published Content
   │
   ▼
Student PWA
   │
   ▼
Lecture PDF
   │
   ▼
Google Drive
