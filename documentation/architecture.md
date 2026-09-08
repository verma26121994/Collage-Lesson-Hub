# Architecture

College Lesson Hub uses a lightweight cloud-backed architecture.

## Components

### Student PWA
Hosted as a static web application and designed for mobile installation.

### Google Sheets
Acts as the content metadata layer for subjects, units, lectures, descriptions, PDF links, and publication status.

### Google Apps Script
Provides the private teacher administration workflow and server-side operations.

### Google Drive
Stores lecture PDF files.

## Data Flow

Teacher creates or updates content → content is stored in Google Sheets → published records become available to the Student PWA → students open the associated PDF from Google Drive.
