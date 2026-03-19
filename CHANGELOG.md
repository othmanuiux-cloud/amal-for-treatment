# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-19

### Added
- CORS configuration for cross-origin requests (Vercel + Render)
- DATABASE_URL support for Supabase PostgreSQL
- iPad Mini/Tablet responsive optimizations
- Touch targets improvements (48px minimum)
- iPad-optimized Register page with single-column layout
- vercel.json configuration for frontend deployment

### Changed
- Build command updated from `tsc -b && vite build` to `vite build` for Vercel compatibility
- TypeScript type checking moved to separate `typecheck` script
- Frontend structure improved for tablet viewports

### Fixed
- CORS headers to allow Vercel frontend access to Render backend
- DATABASE_URL connection string format

## [1.0.0] - 2026-03-19

### Added
- Initial release of Amal for Treatment platform
- User authentication (login, register, forgot password)
- Role-based access control (Admin, Volunteer, Patient)
- Case management system (submit, view, track cases)
- Admin dashboard with statistics and analytics
- Volunteer dashboard for case verification workflow
- Patient dashboard for case tracking
- Public cases browsing page
- Multi-language support (Arabic/English)
- Responsive design for all devices (mobile, tablet, desktop)
- Medical case documents upload
- Case status workflow (pending → verifying → verified → approved → published)
- Export functionality (Excel, PDF)
- Contact form
- About, Privacy Policy, Terms of Service pages

### Security
- User authentication with Laravel Sanctum
- Password hashing with bcrypt
- CSRF protection
- Input validation and sanitization
- CORS configuration
- File upload restrictions
