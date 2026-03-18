# Product Requirements Document (PRD)
## منصة أمل للعلاج (Amal for Treatment Platform)

---

## 1. Executive Summary

### Project Overview
**Amal for Treatment** is a charitable crowdfunding platform connecting patients in need of medical treatment with donors worldwide. The platform facilitates transparent medical case management, verification, and fundraising with a focus on the Yemeni healthcare crisis.

### Problem Statement
- Many Yemeni patients cannot afford necessary medical treatments
- Lack of transparent platforms for medical fundraising
- Difficulty in verifying medical cases and their authenticity
- No centralized system for tracking case status and donations

### Solution
A comprehensive platform that enables:
- Patients to submit medical cases with documentation
- Volunteers to verify and validate cases
- Admins to manage and approve cases
- Donors to browse and contribute to verified cases

---

## 2. User Roles

### 2.1 Patient (Patient)
- Submit medical cases with required documentation
- Track case status through verification pipeline
- View donation progress for their case
- Edit pending cases before verification
- Receive notifications on status changes

### 2.2 Volunteer
- View all submitted cases requiring verification
- Verify medical documents and case information
- Add verification notes and comments
- Escalate cases to admin for approval

### 2.3 Admin
- Full platform management
- Approve/reject verified cases
- Publish cases for public donation
- Manage users (patients, volunteers)
- View analytics and statistics
- Configure platform settings

### 2.4 General User (Donor)
- Browse published/verified cases
- View case details and documentation
- Make donations (future feature)
- User registration/login

---

## 3. Core Features

### 3.1 Authentication & Authorization
- Email/password registration
- Login with JWT tokens
- Role-based access control (RBAC)
- Password reset functionality
- Session persistence

### 3.2 Case Management

#### Case Submission (Patient)
- Patient information (name, age, contact)
- Medical condition/disease description
- Hospital selection
- Estimated treatment cost
- Medical documents upload (reports, prescriptions)
- Case priority selection (normal, urgent, critical)

#### Case Workflow States
```
pending → verifying → verified → approved → published
                    ↓
                  rejected
```

| State | Description | Accessible By |
|-------|-------------|---------------|
| pending | Awaiting initial review | Patient, Admin |
| verifying | Under volunteer review | Volunteer, Admin |
| verified | Documents confirmed | Volunteer, Admin |
| approved | Admin approved for publishing | Admin |
| published | Live for donations | All users |
| rejected | Not approved | Admin |

### 3.3 Case Details
- Patient personal information
- Medical condition details
- Hospital and location information
- Treatment cost estimate
- Document gallery
- Verification history
- Status timeline/progress bar
- Donation progress (future)

### 3.4 Dashboard & Analytics

#### Patient Dashboard
- My submitted cases list
- Case status tracking
- Statistics (total, pending, approved, published)

#### Volunteer Dashboard
- Cases pending verification
- Verification history
- Statistics

#### Admin Dashboard
- All cases overview
- User management
- Case approval workflow
- Platform statistics
- Export capabilities (Excel, PDF)

### 3.5 Public Features
- Home page with platform overview
- Published cases browsing
- Case search and filtering
- About/Contact pages
- Terms and Privacy Policy

---

## 4. Technical Architecture

### 4.1 Frontend
**Stack:** React 18 + TypeScript + Vite

**Key Dependencies:**
- React Router v6 (routing)
- TanStack React Query (data fetching)
- Zustand (state management)
- Tailwind CSS (styling)
- Lucide React (icons)
- Recharts (analytics charts)
- React Grid Layout (dashboard)
- i18next (internationalization)
- jsPDF + xlsx (export functionality)

**Project Structure:**
```
frontend/src/
├── api/           # API service layer
├── auth/          # Authentication store
├── components/    # Reusable components
│   ├── layout/    # Layout components
│   └── ui/        # UI components
├── pages/         # Page components
└── types/         # TypeScript types
```

### 4.2 Backend
**Stack:** Laravel 11 (PHP 8.2+)

**Key Features:**
- RESTful API
- Laravel Sanctum (authentication)
- Eloquent ORM
- File storage
- API resources

**Project Structure:**
```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   ├── Models/
│   ├── Policies/
│   ├── Providers/
│   └── Traits/
├── config/
├── database/
│   └── factories/
├── routes/
└── storage/
```

### 4.3 Database Schema

#### Users Table
| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| name | string | User full name |
| email | string | Unique email |
| password | string | Hashed password |
| role | enum | patient, volunteer, admin |
| country | string | Country code |
| phone | string | Phone number |
| email_verified_at | timestamp | Verification date |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Update date |

#### Medical Cases Table
| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Patient user ID |
| file_number | string | Unique case number |
| patient_name | string | Patient name |
| age | integer | Patient age |
| disease | string | Medical condition |
| description | text | Case description |
| hospital_name | string | Hospital name |
| hospital_country | string | Hospital country |
| city | string | City name |
| estimated_cost | decimal | Treatment cost |
| currency | string | Cost currency |
| priority | enum | normal, urgent, critical |
| status | enum | Case workflow state |
| is_published | boolean | Publication status |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Update date |

#### Case Documents Table
| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| case_id | bigint | Medical case ID |
| file_name | string | Original file name |
| file_path | string | Storage path |
| file_type | string | MIME type |
| created_at | timestamp | Upload date |

#### Case Status History Table
| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| case_id | bigint | Medical case ID |
| status | enum | New status |
| notes | text | Change notes |
| user_id | bigint | User who changed |
| created_at | timestamp | Change date |

---

## 5. UI/UX Design

### 5.1 Design System
- **Color Palette:**
  - Primary: `#2563EB` (Blue 600)
  - Secondary: `#0EA5E9` (Sky 500)
  - Success: `#10B981` (Emerald 500)
  - Warning: `#F59E0B` (Amber 500)
  - Error: `#EF4444` (Red 500)
  - Background: `#F8FAFC` (Slate 50)
  - Surface: `#FFFFFF` (White)
  - Text Primary: `#0F172A` (Slate 900)
  - Text Secondary: `#64748B` (Slate 500)

- **Typography:** 
  - Primary Font: System Arabic (Tahoma-like)
  - Headings: Bold/Black weight
  - Body: Regular/Medium weight

- **Spacing:** Tailwind CSS default scale
- **Border Radius:** `0.5rem` to `1.5rem` (rounded-xl to rounded-2xl)
- **Shadows:** Soft shadows with primary tint

### 5.2 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 5.3 Component Library
- Buttons (primary, secondary, outline)
- Form inputs with validation
- Cards (case cards, stat cards)
- Modals
- Tables with sorting/filtering
- Charts and graphs
- Timeline components
- Progress indicators
- Badges and tags

---

## 6. API Endpoints

### 6.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/forgot-password | Password reset request |
| POST | /api/auth/reset-password | Password reset |

### 6.2 Cases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cases | List cases (filtered by role) |
| GET | /api/cases/published | List published cases |
| GET | /api/cases/{id} | Get case details |
| POST | /api/cases | Submit new case |
| PUT | /api/cases/{id} | Update case |
| DELETE | /api/cases/{id} | Delete case |
| PUT | /api/cases/{id}/status | Update case status |
| POST | /api/cases/{id}/publish | Publish case |

### 6.3 Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/cases/{id}/documents | Upload document |
| DELETE | /api/documents/{id} | Delete document |

### 6.4 Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | List all users |
| PUT | /api/admin/users/{id} | Update user |
| DELETE | /api/admin/users/{id} | Delete user |

### 6.5 Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/settings | Get platform settings |
| PUT | /api/settings | Update settings |

---

## 7. Security Requirements

### 7.1 Authentication
- JWT-based authentication
- Token expiration: 7 days
- Secure password hashing (bcrypt)
- CSRF protection

### 7.2 Authorization
- Role-based access control
- Policy-based authorization for resources
- API rate limiting

### 7.3 Data Protection
- Input validation and sanitization
- File upload restrictions
- Secure file storage
- HTTPS only

---

## 8. Future Enhancements

### Phase 2 (Donation System)
- Payment gateway integration
- Donation tracking
- Donor management
- Receipt generation

### Phase 3 (Advanced Features)
- Real-time notifications
- Case comments/discussion
- Social sharing
- Multi-language support
- SMS notifications
- Analytics dashboard improvements
- Mobile applications

---

## 9. Success Metrics

### Key Performance Indicators
- Number of published cases
- Case approval rate
- Average verification time
- User registration rate
- Platform engagement (page views, sessions)

### Monitoring
- Admin analytics dashboard
- Case status distribution charts
- User activity tracking
- System performance metrics

---

## 10. Project Timeline

### Current Status: Phase 1 - Core Platform
- [x] User authentication
- [x] Case submission workflow
- [x] Case verification pipeline
- [x] Admin case management
- [x] Public case browsing
- [x] Dashboard and analytics

### Next Steps
- [ ] Donation system implementation
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Mobile responsive improvements
- [ ] Performance optimization

---

## 11. Appendix

### Glossary
- **Case:** A medical treatment request submitted by a patient
- **Verification:** The process of validating case documents and information
- **Published:** Cases visible to the public for donation
- **Volunteer:** Platform user who verifies medical cases

### References
- Frontend Repository: `/frontend`
- Backend Repository: `/backend`
- Design System: Tailwind CSS
- API Documentation: Laravel API Routes

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Author:** Amal Development Team
