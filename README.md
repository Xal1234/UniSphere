# CampusOne (CampusPulse)

> Unified University Academic, Student Services, and Administrative Operations Portal.

CampusOne (also known as CampusPulse) is a modern, responsive web application engineered to streamline daily campus life for both university students and administrators. Inspired by high-polish academic institutions, the portal provides a unified interface for coursework, attendance management, leave requisitions, fee reconciliation, official notices, and staff workflows.

---

## Key Features

### 1. Student Experience
* **Dashboard Overview**: Current semester timetable, quick-access attendance summaries, upcoming deadlines, recent circulars, and university announcements.
* **Attendance Tracking**: Real-time percentage calculators, weekly trends, subject-wise breakdowns, and defaulter threshold warnings (<75%).
* **Class Leave (CL) Workflow**: Digital leave application form with reason categories, automatic document identifier generation, and live review status tracking.
* **Hostel Leave & Outpass**: Requisition gate passes with warden authorization tracking and digital gate pass IDs.
* **Academics & Semester Results**: SGPA/CGPA progression, credit distribution, grade cards, and historical semester breakdowns.
* **Fee Clearance & Invoicing**: Semester fee breakdowns, payment transactions history, and downloadable PDF-style fee clearance receipts.
* **Assignments Desk**: Course assignment directory, deadlines, file submission form, and instructor review/grade display.
* **Campus Events & RSVPs**: University symposiums, hackathons, and cultural fests with one-click RSVP management.
* **Campus Notices & Circulars**: Searchable official circulars with category filters and emergency pin tags.
* **Central Library**: Book catalog search, shelf locator, due date tracking, and book renewal/reservation actions.
* **Helpdesk & Grievance Redressal**: Issue ticket submission across departments (Hostel, Wi-Fi, Exam Cell, ERP) with priority levels.
* **Profile & Document Dossier**: Student dossier with verified credential status badges and scrutiny remarks.

### 2. Administrator & Staff Experience
* **Admin Overview**: Signed-in staff profile (name, role, department, employee ID), daily teaching schedule, and pending approval queues.
* **Courses & Timetable**: Faculty assigned courses, syllabus progress, class timings, and lecture halls.
* **Class Attendance Marking**: Interactive lecture attendance ledger with present/absent toggling and instant threshold alerts.
* **Assignment Creation & Digital Grading**: Create course assignments, review student submissions, assign marks, and submit constructive feedback.
* **Student Directory**: University-wide student directory with multi-filter search (by branch, semester, standing, attendance defaulters).
* **Approvals Desk**: Review, approve, or reject student Class Leaves and Hostel Outpasses with administrative remarks.
* **Event Management**: Create, edit, publish, and cancel university events.
* **Circular Publisher**: Draft and broadcast campus-wide official circulars.
* **Institutional Fees Ledger**: Bursar fee collection summaries, departmental payment clearance, and fee reconciliation tables.
* **Staff Self-Service**: Personal staff dossier, teaching timetable, and staff casual/duty leave request submission and tracking.
* **Operations Visibility**: Admin view of open and aging helpdesk requests, repeated issue categories, average resolution time, and student alert reads/actions.
* **Targeted Notices**: Publish notices to all students, CSE students, hostel residents, or staff; notification lists are scoped by role and student account.
* **Assisted Service Counter**: Staff can register a walk-in student's helpdesk request and give them its tracking number.

### 3. Visual & Device Preferences
* **Theme Preference**: 1-click toggle between Light Academic Mode and refined Dark Mode with high-contrast slate surfaces.
* **Device Viewport Simulator**: Preview the portal in **Auto Responsive** (fluid 100%), **Desktop Workstation Frame** (1360px), **Tablet Frame** (820px), or **Mobile Smartphone Frame** (420px).
* **Low-Bandwidth Support**: Screens load on demand and the previously loaded app shell can be reopened offline after a successful visit.

---

## Tech Stack

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS v4 + Plus Jakarta Sans & JetBrains Mono typography
* **Icons**: Lucide React
* **State Management**: React Hooks + browser-local demo storage (no backend or external database required for demo)

## Prototype Data and Rollout

This is a working front-end prototype with sample university records. Workflow actions persist in the current browser so a demo can be continued after a refresh. Offline changes remain on that device and do not sync to another device. Login, attendance, fees, results, notices, and service workflows are not connected to an official university system; payments are simulated. Do not use the demo credentials or browser storage for real student records.

The PS-07 pilot and adoption plan is in [`docs/PS-07-rollout-plan.md`](docs/PS-07-rollout-plan.md). It covers a staged department/hostel pilot, moving from existing paper and chat habits, and a staffed service-counter path for students without smartphones.

---

## Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* `npm` (comes with Node.js) or `bun`

### Installation
1. Clone or download the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd campuspulse
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
Start the local development server on port 3000:
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000) to view the portal.

### Linting
To check TypeScript types and ensure zero compiler errors:
```bash
npm run lint
```

### Production Build
To generate optimized production assets in the `dist` directory:
```bash
npm run build
```

### Previewing the Production Build
To test the production build locally before deployment:
```bash
npm run start
# or
npm run preview
```
This runs the production preview server bound to `http://0.0.0.0:3000`.

---

## Environment Variables

Copy `.env.example` to create a local `.env` if needed:
```bash
cp .env.example .env
```

| Variable | Description | Default / Required |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional API key for Google Gemini AI features | Optional for current demo |
| `APP_URL` | The public base URL for the deployed service | Auto-injected in Cloud Run |

> **Note**: The current demo runs entirely on self-contained mock data and client-side state. No paid services, cloud databases, or private API keys are required to run, build, or deploy this application.

---

## Deployment to Google Cloud Run

This project is configured for direct container deployment to Google Cloud Run via Google AI Studio or standard Cloud Build:

1. **Build Step**: `npm run build` compiles static assets to `/dist`.
2. **Start Step**: `npm run start` launches the Vite preview server bound to host `0.0.0.0` and port `3000`.
3. **Port Configuration**: Cloud Run services routing to port `3000` will connect directly to the portal.
4. **Environment Check**: Ensure all secrets remain in your Cloud Run Environment configuration and never commit sensitive `.env` files.

---

## License

This project is prepared for educational and campus demonstration purposes.
