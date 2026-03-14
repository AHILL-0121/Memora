# Memora – MVP & Software Requirements Specification

> **Bringing Memories to Life through WebAR**
> *Every photo has a story. Memora tells it.*
> Version 1.0 | March 2026 | Prepared by: Ahill Selvaraj

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [MVP Definition](#2-mvp-definition)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Roles & Personas](#6-user-roles--personas)
7. [User Stories](#7-user-stories)
8. [Feature Breakdown](#8-feature-breakdown)
9. [Database Design](#9-database-design)
10. [API Specification](#10-api-specification)
11. [Tech Stack](#11-tech-stack)
12. [UI/UX Guidelines](#12-uiux-guidelines)
13. [Deployment Plan](#13-deployment-plan)
14. [Risk Analysis](#14-risk-analysis)
15. [Future Roadmap](#15-future-roadmap)
16. [Glossary](#16-glossary)

---

## 1. Project Overview

### 1.1 Problem Statement

Traditional printed photos capture a frozen moment but cannot convey the emotions, sounds, or stories embedded within them. Meanwhile, digital memories remain scattered across cloud services, social platforms, and local devices with no physical anchor. There exists a gap between the warmth of physical prints and the richness of digital media.

### 1.2 Solution

**Memora** is a WebAR (Web-based Augmented Reality) platform that attaches interactive digital content — videos, GIFs, voice messages, animations — to printed photo cards. Scanning a QR code or pointing a smartphone camera at a card triggers an immersive overlay of media, no app installation required.

### 1.3 Vision Statement

> *Memora exists to bridge the gap between physical and digital memories — turning every photo into a living, interactive experience that can be shared, revisited, and relived anytime.*

### 1.4 Scope

| In Scope | Out of Scope |
|---|---|
| Web-based upload & media attachment portal | Native iOS / Android app (Phase 2) |
| QR code generation per card | 3D object rendering (Phase 2) |
| WebAR viewer via smartphone browser | Physical card printing service |
| Photo image-target recognition | AI-generated media creation |
| User authentication & card management | Blockchain-based ownership (Phase 3) |
| Shareable public viewer links | Live streaming AR |

---

## 2. MVP Definition

### 2.1 MVP Philosophy

The MVP focuses on the **core value loop**: Upload → Attach Media → Generate Card → Scan → Experience. Everything else is post-MVP.

### 2.2 MVP Feature Set

```
MVP CORE LOOP
─────────────────────────────────────────────────────
  [User] → Registers / Logs In
     ↓
  [Upload] → Uploads photo + attaches video/GIF/audio
     ↓
  [System] → Generates Memora Card (QR code + image marker)
     ↓
  [Share] → Card is printed / shared digitally
     ↓
  [Scan] → Recipient scans QR → Browser AR viewer opens
     ↓
  [Experience] → Media plays overlaid on photo in real-time
─────────────────────────────────────────────────────
```

### 2.3 MVP Feature Checklist

| # | Feature | Priority | Included in MVP |
|---|---|---|---|
| 1 | User registration & login (email + Google OAuth) | P0 | ✅ Yes |
| 2 | Photo upload (JPEG/PNG, ≤ 10MB) | P0 | ✅ Yes |
| 3 | Media attachment (video MP4, GIF, audio MP3) | P0 | ✅ Yes |
| 4 | QR code generation per card | P0 | ✅ Yes |
| 5 | WebAR viewer (browser-based, no install) | P0 | ✅ Yes |
| 6 | Image target recognition (marker-based AR) | P0 | ✅ Yes |
| 7 | Card dashboard (list, edit, delete) | P1 | ✅ Yes |
| 8 | Public shareable viewer link | P1 | ✅ Yes |
| 9 | Analytics (scan count per card) | P1 | ✅ Yes |
| 10 | 3D model overlays | P2 | ❌ Post-MVP |
| 11 | Face-filter style AR effects | P2 | ❌ Post-MVP |
| 12 | Physical card print-on-demand | P3 | ❌ Post-MVP |
| 13 | Subscription / payment tiers | P2 | ❌ Post-MVP |

### 2.4 MVP Success Criteria

- A user can create and share a Memora Card within **under 3 minutes**.
- The WebAR viewer loads and tracks the image target within **under 4 seconds** on a mid-range Android device.
- QR scan → AR experience launch takes **under 2 seconds**.
- System handles **100 concurrent AR viewer sessions** without degradation.
- Card creation success rate ≥ **95%** on valid inputs.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                   │
│  ┌────────────────────┐        ┌──────────────────────────────┐  │
│  │  Creator Portal    │        │  WebAR Viewer (Public)       │  │
│  │  (Next.js 14)      │        │  (Next.js 14 + MindAR.js)   │  │
│  │  - Auth            │        │  - QR Redirect Entry         │  │
│  │  - Upload UI       │        │  - Camera Access             │  │
│  │  - Card Dashboard  │        │  - Image Target Tracking     │  │
│  │  - Analytics View  │        │  - Media Overlay             │  │
│  └────────────────────┘        └──────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼────────────────────────────────────┐
│                        API LAYER (FastAPI)                        │
│                                                                   │
│   /auth  /cards  /media  /qr  /viewer  /analytics               │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │ Auth Service │  │ Card Service │  │ Media Service        │    │
│  │ (Clerk JWT)  │  │              │  │ (Upload + Process)   │    │
│  └──────────────┘  └──────────────┘  └─────────────────────┘    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │  QR Service  │  │ AR Target    │  │ Analytics Service    │    │
│  │  (qrcode.js) │  │ Generator    │  │ (Scan Tracking)      │    │
│  └──────────────┘  └──────────────┘  └─────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     DATA & STORAGE LAYER                          │
│                                                                   │
│  ┌──────────────────┐   ┌───────────────┐   ┌────────────────┐  │
│  │  PostgreSQL/Neon │   │ Cloudinary /  │   │ Upstash Redis  │  │
│  │  - Users         │   │ Supabase Stor │   │ - Session Cache│  │
│  │  - Cards         │   │ - Photos      │   │ - Rate Limits  │  │
│  │  - Media         │   │ - Videos      │   │ - Scan Counts  │  │
│  │  - Scan Logs     │   │ - AR Targets  │   │                │  │
│  └──────────────────┘   └───────────────┘   └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 AR Pipeline Architecture

```
┌──────────────────────────────────────────────────────┐
│                  WebAR Pipeline                        │
│                                                        │
│  Smartphone Browser                                    │
│  ┌────────────────────────────────────────────────┐   │
│  │  getUserMedia() → Camera Stream                │   │
│  │         ↓                                      │   │
│  │  MindAR.js Image Target Compiler               │   │
│  │  (pre-compiled .mind file from photo)          │   │
│  │         ↓                                      │   │
│  │  Feature Point Detection & Matching            │   │
│  │         ↓                                      │   │
│  │  Homography Matrix Estimation                  │   │
│  │         ↓                                      │   │
│  │  Three.js / A-Frame Scene Overlay              │   │
│  │  (Video / GIF / Audio rendered on anchor)      │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### 3.3 Data Flow Diagram

```
CREATE CARD FLOW
────────────────
User → Upload Photo + Media
  → FastAPI validates (type, size)
  → Store photo to Cloudinary → get photo_url
  → Store media to Cloudinary → get media_url
  → MindAR compiler generates .mind target file → store to Cloudinary
  → Generate QR code (encodes /view/:card_id)
  → Save Card record to PostgreSQL
  → Return Card object + QR PNG to frontend

SCAN / VIEW FLOW
────────────────
Recipient → Scans QR code
  → Browser opens /view/:card_id
  → FastAPI returns Card data (photo_url, media_url, target_url)
  → MindAR.js loads .mind target in-browser
  → Camera opens, photo recognized
  → Media plays as AR overlay
  → Scan event logged to DB + Redis counter incremented
```

---

## 4. Functional Requirements

### 4.1 Authentication Module

| Req ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | System shall support email + password registration | P0 |
| AUTH-02 | System shall support Google OAuth login via Clerk | P0 |
| AUTH-03 | System shall issue JWT tokens with 7-day expiry | P0 |
| AUTH-04 | System shall protect all creator API routes with auth middleware | P0 |
| AUTH-05 | System shall allow password reset via email link | P1 |
| AUTH-06 | System shall support account deletion with data cleanup | P2 |

### 4.2 Card Creation Module

| Req ID | Requirement | Priority |
|---|---|---|
| CARD-01 | User shall be able to upload a photo (JPEG/PNG, max 10MB) | P0 |
| CARD-02 | User shall be able to attach a video (MP4, max 100MB) | P0 |
| CARD-03 | User shall be able to attach a GIF (max 20MB) | P0 |
| CARD-04 | User shall be able to attach an audio message (MP3/WAV, max 20MB) | P0 |
| CARD-05 | System shall generate a unique image target (.mind file) for each photo | P0 |
| CARD-06 | System shall generate a QR code linking to the card's viewer URL | P0 |
| CARD-07 | User shall be able to name/label a card | P1 |
| CARD-08 | User shall be able to set a card as public or private | P1 |
| CARD-09 | User shall be able to edit the attached media after creation | P1 |
| CARD-10 | User shall be able to delete a card (removes all associated assets) | P1 |

### 4.3 Dashboard Module

| Req ID | Requirement | Priority |
|---|---|---|
| DASH-01 | User shall see a list of all their created cards | P0 |
| DASH-02 | Each card item shall show: thumbnail, name, scan count, created date | P1 |
| DASH-03 | User shall be able to download the QR code as PNG | P1 |
| DASH-04 | User shall be able to copy the shareable viewer link | P1 |
| DASH-05 | User shall be able to preview the AR experience in-browser | P2 |

### 4.4 WebAR Viewer Module

| Req ID | Requirement | Priority |
|---|---|---|
| AR-01 | Viewer shall be accessible via URL (no app install required) | P0 |
| AR-02 | Viewer shall request camera permission on load | P0 |
| AR-03 | Viewer shall load the .mind target file for the specific card | P0 |
| AR-04 | Viewer shall overlay media on the photo once recognized | P0 |
| AR-05 | Video overlays shall autoplay muted and loop | P0 |
| AR-06 | Audio overlays shall play when the photo is recognized | P0 |
| AR-07 | Viewer shall display a fallback message if camera is denied | P1 |
| AR-08 | Viewer shall display a loading indicator during target load | P1 |
| AR-09 | Viewer shall work on Chrome (Android/iOS) and Safari (iOS) | P0 |
| AR-10 | Viewer shall log each scan event (timestamp, card_id, UA string) | P1 |

### 4.5 Analytics Module

| Req ID | Requirement | Priority |
|---|---|---|
| ANALYTICS-01 | System shall track total scan count per card | P1 |
| ANALYTICS-02 | System shall show scan trend over last 7 / 30 days | P2 |
| ANALYTICS-03 | System shall show geographic distribution of scans (country level) | P2 |
| ANALYTICS-04 | System shall show device type breakdown (mobile/desktop) | P2 |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|---|---|---|
| PERF-01 | QR scan → AR viewer load time | ≤ 3 seconds (4G connection) |
| PERF-02 | Image target recognition latency | ≤ 2 seconds on mid-range device |
| PERF-03 | Card creation end-to-end (upload → QR ready) | ≤ 15 seconds |
| PERF-04 | API p95 response time | ≤ 500ms |
| PERF-05 | Concurrent AR viewer sessions | ≥ 100 without degradation |

### 5.2 Scalability

| ID | Requirement |
|---|---|
| SCALE-01 | File storage shall use CDN-backed object storage (Cloudinary) |
| SCALE-02 | Database connection pooling shall be enabled (PgBouncer via Neon) |
| SCALE-03 | .mind file compilation shall be offloaded to a background worker |
| SCALE-04 | Redis shall cache frequently accessed card data for ≤ 5 min TTL |

### 5.3 Security

| ID | Requirement |
|---|---|
| SEC-01 | All API endpoints shall use HTTPS |
| SEC-02 | Media files shall have signed URLs (30-min expiry on private cards) |
| SEC-03 | File uploads shall be validated (MIME type, magic bytes, size) |
| SEC-04 | QR links shall be rate-limited (60 scans/min per IP) |
| SEC-05 | User data shall be isolated per account (no cross-user access) |
| SEC-06 | GDPR-compliant data deletion on account removal |

### 5.4 Availability

| ID | Requirement |
|---|---|
| AVAIL-01 | Platform uptime target: 99.5% monthly |
| AVAIL-02 | WebAR viewer shall be stateless and deployable via CDN edge |
| AVAIL-03 | Database shall have automated daily backups with 7-day retention |

### 5.5 Usability

| ID | Requirement |
|---|---|
| UX-01 | Card creation flow shall complete in ≤ 3 minutes for a new user |
| UX-02 | Viewer shall be usable without any instructions/onboarding |
| UX-03 | Platform shall be fully responsive (mobile-first) |
| UX-04 | All error messages shall be human-readable with recovery actions |

---

## 6. User Roles & Personas

### 6.1 Role Matrix

| Role | Access Level | Key Capabilities |
|---|---|---|
| **Creator** | Authenticated | Create, edit, delete cards; view analytics; download QR |
| **Viewer** | Public (unauthenticated) | Scan QR; experience AR overlay |
| **Admin** | Internal | User management; platform analytics; content moderation |

### 6.2 Persona Profiles

**Persona 1 — Priya (Wedding Couple)**
> Age 27, planning her wedding. Wants to add a video of their love story to printed invitation cards. Shares 200 Memora Cards with guests. Non-technical — needs a zero-friction upload experience.

**Persona 2 — Rajan (Event Photographer)**
> Age 34, shoots corporate events. Sells Memoras as add-on products. Needs bulk card creation and branded QR codes. Moderate technical proficiency.

**Persona 3 — Kavya (Marketing Executive)**
> Age 30, creates product campaigns. Uses Memora Cards as interactive ad inserts in packaging. Needs analytics on scan rates and geographic reach.

**Persona 4 — Arjun (Scan Recipient)**
> Age 22, received a Memora Card at a wedding. Scans QR with his Android phone. Expects instant, no-install experience with zero friction.

---

## 7. User Stories

### 7.1 Creator Stories

```
US-001 | As a creator,
        I want to upload a photo and attach a video to it,
        So that I can create a Memora Card.
        Acceptance: Upload form accepts JPEG/PNG + MP4. Progress shown. Card created on submit.

US-002 | As a creator,
        I want a QR code generated automatically for my card,
        So that I can print it alongside my photo.
        Acceptance: QR PNG downloadable at 300dpi. Encodes correct viewer URL.

US-003 | As a creator,
        I want to see how many times my card has been scanned,
        So that I can measure engagement.
        Acceptance: Dashboard shows total scan count per card, updated in real-time.

US-004 | As a creator,
        I want to edit the attached media on an existing card,
        So that I can update the experience without reprinting.
        Acceptance: Replace media button on card detail. Old media deleted from storage.

US-005 | As a creator,
        I want to delete a card and all its assets,
        So that I can manage my storage and privacy.
        Acceptance: Soft delete → hard delete after 24h. Storage assets cleaned up.
```

### 7.2 Viewer Stories

```
US-006 | As a viewer,
        I want to scan a QR code on a photo card,
        So that I can access the AR experience instantly.
        Acceptance: QR opens /view/:id in browser. No app prompt. Camera request shown.

US-007 | As a viewer,
        I want to point my phone camera at the photo,
        So that I can see the embedded video play on top of it.
        Acceptance: Video plays within 2 seconds of recognition. Tracks card movement.

US-008 | As a viewer,
        I want the experience to work without installing anything,
        So that there is zero friction to accessing it.
        Acceptance: Works on Chrome Android 80+ and Safari iOS 14+. No PWA prompt.
```

---

## 8. Feature Breakdown

### 8.1 Feature: Card Creation Flow

**Flow Diagram:**

```
Step 1: Upload Photo
  ├─ Drag & drop or file picker
  ├─ Client-side: validate type (JPEG/PNG), size (< 10MB)
  ├─ Preview shown immediately
  └─ Uploaded to Cloudinary → photo_url stored

Step 2: Attach Media
  ├─ Media type selector: Video / GIF / Audio
  ├─ File upload with progress bar
  ├─ Client-side validation (type, size)
  └─ Uploaded to Cloudinary → media_url stored

Step 3: Name Your Card
  ├─ Optional text field (default: "My Memora Card")
  └─ Privacy toggle: Public / Private

Step 4: Generate Memora Card
  ├─ Backend: MindAR compiler generates .mind target from photo
  ├─ Backend: QR code generated (encodes /view/:card_id)
  ├─ Card record saved to DB
  └─ Frontend: Shows QR + download button + shareable link

Step 5: Done
  └─ Redirect to Card Dashboard
```

### 8.2 Feature: AR Viewer

**State Machine:**

```
[INITIAL]
  → Load card data from API
  → Download .mind target file

[READY]
  → Request camera permission
    ├─ Denied → [ERROR: Show instructions]
    └─ Granted → [SCANNING]

[SCANNING]
  → MindAR.js processing camera frames
  → Searching for image target
    ├─ Not found → Show "Point camera at photo" hint
    └─ Found → [TRACKING]

[TRACKING]
  → Media overlay rendered on image anchor
  → Video/GIF plays in loop
  → Audio starts
  → Scan event logged

[LOST]
  ← Target leaves frame
  → Media pauses
  → Returns to [SCANNING]
```

### 8.3 Feature: QR Code Generation

- Library: `qrcode` (Python) / `qrcode.react` (frontend preview)
- QR encodes: `https://memora.app/view/{card_id}`
- Output: PNG at 1024×1024px (print-ready), 400×400px (digital share)
- Center logo: Memora icon (optional brand overlay)
- Error correction level: **H** (30% recovery — suitable for logo embedding)

### 8.4 Feature: .mind File Compilation

The `.mind` file is a pre-compiled image tracking descriptor required by MindAR.js.

```
Compilation Steps (Backend Worker):
─────────────────────────────────────────────────────
1. Download uploaded photo from Cloudinary
2. Run MindAR Image Targets Compiler (Node.js CLI)
   mind-ar-js compile --image photo.jpg --output target.mind
3. Upload target.mind to Cloudinary under /targets/{card_id}.mind
4. Store target_url in Card DB record
5. Delete local temp files
─────────────────────────────────────────────────────

Constraints:
- Compilation takes 5–30 seconds depending on image complexity
- High-contrast, non-repetitive images track best
- Compilation runs async; card UI shows "Processing..." until complete
- Failed compilations retry up to 3 times with notification on final failure
```

---

## 9. Database Design

### 9.1 Schema

```sql
-- Users (managed by Clerk, mirrored locally)
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    VARCHAR(255) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255),
  avatar_url  TEXT,
  plan        VARCHAR(50) DEFAULT 'free',     -- free | pro | business
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Cards
CREATE TABLE cards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL DEFAULT 'My Memora Card',
  photo_url     TEXT NOT NULL,            -- Cloudinary URL
  media_url     TEXT NOT NULL,            -- Cloudinary URL (video/gif/audio)
  media_type    VARCHAR(50) NOT NULL,     -- video | gif | audio
  target_url    TEXT,                     -- .mind file URL (null until compiled)
  qr_url        TEXT,                     -- QR code PNG URL
  status        VARCHAR(50) DEFAULT 'processing',  -- processing | ready | failed
  is_public     BOOLEAN DEFAULT TRUE,
  scan_count    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Scan Logs
CREATE TABLE scan_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     UUID REFERENCES cards(id) ON DELETE CASCADE,
  scanned_at  TIMESTAMPTZ DEFAULT NOW(),
  ip_address  INET,
  user_agent  TEXT,
  country     VARCHAR(10),               -- ISO 3166-1 alpha-2 from IP lookup
  device_type VARCHAR(50)                -- mobile | tablet | desktop
);

-- Indexes
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_scan_logs_card_id ON scan_logs(card_id);
CREATE INDEX idx_scan_logs_scanned_at ON scan_logs(scanned_at);
```

### 9.2 Entity Relationship Diagram

```
┌──────────┐         ┌──────────┐         ┌───────────┐
│  users   │ 1────N  │  cards   │ 1────N  │ scan_logs │
│──────────│         │──────────│         │───────────│
│ id       │         │ id       │         │ id        │
│ clerk_id │         │ user_id  │         │ card_id   │
│ email    │         │ name     │         │ scanned_at│
│ name     │         │ photo_url│         │ ip_address│
│ plan     │         │ media_url│         │ country   │
└──────────┘         │ target_  │         │ device    │
                     │  url     │         └───────────┘
                     │ qr_url   │
                     │ status   │
                     │ is_public│
                     │ scan_coun│
                     └──────────┘
```

---

## 10. API Specification

### Base URL: `https://api.memora.app/v1`

### 10.1 Authentication

All creator endpoints require:
```
Authorization: Bearer <clerk_jwt_token>
```

---

### 10.2 Card Endpoints

#### `POST /cards`
Create a new card.

**Request:**
```json
{
  "name": "Our Wedding Day",
  "photo_url": "https://res.cloudinary.com/.../photo.jpg",
  "media_url": "https://res.cloudinary.com/.../video.mp4",
  "media_type": "video",
  "is_public": true
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "name": "Our Wedding Day",
  "status": "processing",
  "qr_url": null,
  "target_url": null,
  "viewer_url": "https://memora.app/view/uuid",
  "created_at": "2026-03-14T10:00:00Z"
}
```

---

#### `GET /cards`
List all cards for authenticated user.

**Response `200`:**
```json
{
  "cards": [
    {
      "id": "uuid",
      "name": "Our Wedding Day",
      "photo_url": "...",
      "status": "ready",
      "scan_count": 42,
      "qr_url": "...",
      "created_at": "..."
    }
  ],
  "total": 1
}
```

---

#### `GET /cards/:id`
Get a single card (creator only if private).

**Response `200`:**
```json
{
  "id": "uuid",
  "name": "Our Wedding Day",
  "photo_url": "...",
  "media_url": "...",
  "media_type": "video",
  "target_url": "...",
  "qr_url": "...",
  "status": "ready",
  "is_public": true,
  "scan_count": 42,
  "viewer_url": "https://memora.app/view/uuid"
}
```

---

#### `PATCH /cards/:id`
Update card name, media, or visibility.

**Request:**
```json
{
  "name": "Anniversary Card",
  "media_url": "new_media_url",
  "media_type": "gif",
  "is_public": false
}
```

---

#### `DELETE /cards/:id`
Soft delete a card.

**Response `200`:**
```json
{ "message": "Card scheduled for deletion in 24 hours." }
```

---

### 10.3 Viewer Endpoint (Public)

#### `GET /viewer/:card_id`
Load card data for the AR viewer (public cards only, or authenticated user's private cards).

**Response `200`:**
```json
{
  "id": "uuid",
  "photo_url": "...",
  "media_url": "...",
  "media_type": "video",
  "target_url": "...",
  "status": "ready"
}
```

---

### 10.4 Upload Endpoint

#### `POST /upload/sign`
Generate a signed Cloudinary upload URL (client-side direct upload).

**Request:**
```json
{ "folder": "photos", "resource_type": "image" }
```

**Response `200`:**
```json
{
  "signature": "...",
  "timestamp": 1741958400,
  "api_key": "...",
  "cloud_name": "...",
  "upload_url": "https://api.cloudinary.com/v1_1/.../upload"
}
```

---

### 10.5 Analytics Endpoint

#### `GET /cards/:id/analytics`
Get scan analytics for a card.

**Response `200`:**
```json
{
  "card_id": "uuid",
  "total_scans": 42,
  "scans_last_7_days": 18,
  "scans_last_30_days": 40,
  "by_country": [
    { "country": "IN", "count": 30 },
    { "country": "US", "count": 12 }
  ],
  "by_device": [
    { "device_type": "mobile", "count": 40 },
    { "device_type": "desktop", "count": 2 }
  ]
}
```

---

### 10.6 Webhook: Compilation Callback

Internal webhook called by the background worker when .mind compilation completes.

#### `POST /internal/cards/:id/compiled`
```json
{
  "target_url": "https://res.cloudinary.com/.../target.mind",
  "qr_url": "https://res.cloudinary.com/.../qr.png",
  "status": "ready"
}
```

---

## 11. Tech Stack

### 11.1 Full Stack Overview

| Layer | Technology | Reason |
|---|---|---|
| **Frontend Framework** | Next.js 14 (App Router) | SSR, routing, API routes, Vercel-native |
| **Styling** | Tailwind CSS | Utility-first, rapid development |
| **Authentication** | Clerk | Managed auth, Google OAuth, webhooks |
| **WebAR Engine** | MindAR.js | Browser-native, no-install AR; excellent image tracking |
| **3D Rendering** | Three.js / A-Frame | Media overlay rendering in AR context |
| **Backend API** | FastAPI (Python) | Async, typed, fast; familiar stack |
| **Database** | PostgreSQL via Neon | Serverless Postgres, pgBouncer pooling |
| **File Storage** | Cloudinary | CDN, image transformations, signed URLs |
| **Cache / KV** | Upstash Redis | Scan counters, rate limiting, session cache |
| **QR Code** | `qrcode` (Python) | Simple, high-quality QR generation |
| **Background Jobs** | Celery + Redis Broker | Async .mind compilation worker |
| **Deployment: FE** | Vercel | Edge network, CI/CD from GitHub |
| **Deployment: BE** | Railway / Render | FastAPI + Celery worker containers |
| **Monitoring** | Sentry | Error tracking, performance monitoring |

### 11.2 AR Library: MindAR.js

```
Why MindAR.js?
─────────────────────────────────────────────────────
✅ Fully browser-based (WebAssembly + WebGL)
✅ No server-side AR processing required
✅ Excellent image target tracking
✅ Works on Chrome (Android) and Safari (iOS 14.3+)
✅ Open source, actively maintained
✅ Pre-compiled .mind files → fast load at viewer time
❌ No real-time cloud anchors (not needed for MVP)
❌ 3D SLAM not supported (post-MVP feature)
─────────────────────────────────────────────────────
```

---

## 12. UI/UX Guidelines

### 12.1 Design Theme

**Name:** `Memora Lumina`
**Concept:** Warm, photo-memory aesthetic. Like sunlight through a printed photo album. Inviting, nostalgic, yet modern — anchored by the Memora brand identity.

| Token | Value |
|---|---|
| Primary | `#E8734A` (warm terracotta) |
| Secondary | `#F5C878` (golden hour) |
| Background | `#FDFAF5` (warm white) |
| Surface | `#FFF8EE` (cream) |
| Text Primary | `#1A1208` (near-black warm) |
| Text Muted | `#8C7355` (warm brown) |
| Accent | `#D44A2A` (deep ember) |
| Success | `#4CAF72` |
| Error | `#E84A4A` |

**Font Pairing:**
- Display: `Playfair Display` (headings, card names)
- Body: `DM Sans` (UI, labels, descriptions)

### 12.2 Page Structure

```
Pages:
─────────────────────────────────────────────────────
/                     → Landing Page (hero, how it works, CTA)
/sign-in              → Clerk-managed auth
/sign-up              → Clerk-managed auth
/dashboard            → Card list, scan counts, quick actions
/cards/new            → Multi-step card creation wizard
/cards/:id            → Card detail (QR, share link, analytics)
/view/:card_id        → Public WebAR Viewer (no auth)
─────────────────────────────────────────────────────
```

### 12.3 Creator UX Principles

- **Progressive disclosure:** Card creation is a 4-step wizard; no form overwhelm.
- **Immediate feedback:** Live preview of photo after upload; progress bar for media.
- **Status clarity:** Card tiles show pill badges: `Processing` / `Ready` / `Failed`.
- **One-click share:** Copy link and download QR are primary CTAs on every card.

### 12.4 Viewer UX Principles

- **Zero friction entry:** No account, no install, no prompt other than camera permission.
- **Guided scan:** Simple animation: "Point your camera at the photo card."
- **Graceful degradation:** If device has no camera/AR support, show fallback media player.

---

## 13. Deployment Plan

### 13.1 Environments

| Environment | Purpose | URL Pattern |
|---|---|---|
| **Development** | Local dev + feature branches | `localhost:3000` / `localhost:8000` |
| **Staging** | PR previews + QA | `staging.memora.app` |
| **Production** | Live users | `memora.app` |

### 13.2 CI/CD Pipeline

```
GitHub Push → GitHub Actions
  ├─ Lint + Type Check (ESLint, Pyright)
  ├─ Unit Tests (Jest, Pytest)
  ├─ Build Check
  └─ On main merge:
       ├─ Deploy Frontend → Vercel (automatic)
       └─ Deploy Backend → Railway (via Docker image)
```

### 13.3 Infrastructure

```
Frontend (Vercel)
  ├─ Edge functions for /view/:id (fast global load)
  ├─ Static .mind files served from Cloudinary CDN
  └─ Environment vars: NEXT_PUBLIC_API_URL, CLERK keys

Backend (Railway)
  ├─ Service 1: FastAPI app (2 replicas)
  ├─ Service 2: Celery worker (1 replica, scales on queue depth)
  └─ Environment vars: DATABASE_URL, CLOUDINARY_*, REDIS_URL

Database (Neon)
  ├─ Serverless PostgreSQL, auto-suspend on idle
  └─ Connection pooling via PgBouncer (max 100 connections)

Cache (Upstash Redis)
  └─ Global Redis, REST API for edge compatibility
```

---

## 14. Risk Analysis

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R1 | MindAR.js fails on older iOS Safari versions | Medium | High | Detect capability; show fallback video player for unsupported devices |
| R2 | .mind compilation takes too long (>60s) | Low | Medium | Set compilation timeout; notify user; allow manual retry |
| R3 | Low-contrast photos fail AR tracking | High | Medium | Show photo quality score during upload with improvement tips |
| R4 | Storage costs exceed budget at scale | Low | Medium | Enforce per-user storage quotas (free: 500MB, pro: 5GB) |
| R5 | QR code not scannable due to print quality | Medium | Low | Include manual URL fallback text below QR |
| R6 | Camera permission denied on scan | High | High | Graceful fallback: detect denial → show media in non-AR mode |
| R7 | Duplicate media uploads consuming storage | Low | Low | MD5 hash deduplication on upload; serve same asset for identical files |

---

## 15. Future Roadmap

### Phase 2 (Months 2–4)

- **3D model overlays** via GLB/GLTF files on image targets
- **Face-filter AR** — selfie-mode overlays triggered by the photo person's face
- **Native mobile app** (React Native + ViroReact) for richer AR experiences
- **Bulk card creation** for event photographers and enterprises

### Phase 3 (Months 5–8)

- **Subscription tiers** — Free (5 cards), Pro (100 cards), Business (unlimited)
- **White-label platform** — agencies resell Memora Cards under their own brand
- **Print-on-demand integration** — Vistaprint / Zazzle API to order printed cards in-app
- **Analytics dashboard v2** — Heatmaps, A/B testing different media, conversion tracking

### Phase 4 (Months 9–12)

- **Museum & exhibit mode** — Multi-image gallery with AR narration
- **AI media generation** — Auto-generate animations from a still photo
- **NFT / Digital collectibles** — Blockchain-backed ownership of Memora Cards
- **API for third-party integration** — Let greeting card brands embed Memora Cards

---

## 16. Glossary

| Term | Definition |
|---|---|
| **WebAR** | Augmented Reality delivered via the web browser without requiring a native app installation |
| **Image Target** | A reference image used by an AR system to detect and track a physical printed photo |
| **.mind file** | A pre-compiled binary descriptor of an image target used by MindAR.js for efficient in-browser tracking |
| **Memora Card** | A printed or digital photo card with an embedded QR code that triggers an AR experience |
| **QR Code** | Quick Response code; a 2D barcode that encodes the viewer URL for a specific Memora Card |
| **Marker-based AR** | AR that requires a specific visual marker (the photo itself) to anchor digital content |
| **Overlay** | Digital media (video, GIF, audio) rendered on top of the physical photo in the AR view |
| **Creator** | A registered user who creates and manages Memora Cards |
| **Viewer** | An unauthenticated recipient who scans and experiences a Memora Card |
| **Compilation** | The process of generating a .mind file from an uploaded photo image |
| **CDN** | Content Delivery Network; distributes static files globally for low-latency access |
| **Scan Log** | A recorded event each time a Memora Card's QR code is scanned |

---

*Document prepared for: SNS College of Technology, Final Year B.Tech IT — Project of the Day*
*Author: Ahill Selvaraj | GitHub: AHILL-0121 | Portfolio: sa-portfolio-psi.vercel.app*
*Last Updated: March 14, 2026*