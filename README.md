# New App

## Overview

The New App is an attendance management system designed for students and teachers. Students can mark their attendance using their mobile phones, and teachers can view the attendance list in real-time.

## User Journeys

### For Students

1. **Sign In:**
   - Students open the app and sign in using the "Sign in with ZAPT" option.
   - They can choose to sign in using email (magic link) or social providers like Google, Facebook, or Apple.

2. **Select Role:**
   - Upon first login, students are prompted to select their role.
   - They tap on "I'm a Student" to proceed.

3. **Mark Attendance:**
   - After selecting their role, they are taken to the student dashboard.
   - They see a welcome message displaying their email address.
   - They tap on the "Mark Attendance" button to mark their attendance for the day.
   - A confirmation message appears stating that attendance has been marked successfully.

4. **Sign Out:**
   - Students can sign out by clicking the "Sign Out" button at the top right corner.

### For Teachers

1. **Sign In:**
   - Teachers open the app and sign in using the "Sign in with ZAPT" option.
   - They can choose to sign in using email (magic link) or social providers like Google, Facebook, or Apple.

2. **Select Role:**
   - Upon first login, teachers are prompted to select their role.
   - They tap on "I'm a Teacher" to proceed.

3. **View Attendance List:**
   - After selecting their role, they are taken to the teacher dashboard.
   - They see a list of students who have marked their attendance.
   - The list displays the student emails and the timestamp of when they marked attendance.
   - Teachers can refresh the list by clicking the "Refresh" button.

4. **Sign Out:**
   - Teachers can sign out by clicking the "Sign Out" button at the top right corner.

## Features

- **User Authentication:**
  - Secure authentication using Supabase with options for email magic link or social providers.

- **Role Selection:**
  - Users can select their role as either a student or a teacher upon first login.

- **Attendance Marking:**
  - Students can mark their attendance with a single tap.

- **Real-Time Attendance List:**
  - Teachers can view the attendance list of students in real-time.

- **Responsive Design:**
  - The app is optimized for both mobile and desktop devices.

## External Services

- **Supabase Authentication:**
  - Used for user authentication and session management.

- **Neon Database with Drizzle ORM:**
  - Used for storing user roles and attendance records.

## Environment Variables

The app requires the following environment variables:

- `VITE_PUBLIC_APP_ID` - The public app ID for ZAPT.
- `NEON_DB_URL` - The connection URL for the Neon PostgreSQL database.