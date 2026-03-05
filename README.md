# CodeCache

A code snippet manager. Save, tag, search, and copy code snippets instantly.

## Flow

<img width="1517" height="683" alt="image" src="https://github.com/user-attachments/assets/3d3d475b-ee0e-4c06-ae72-f90cce5c0b7a" />
<img width="1582" height="687" alt="Response-Flow" src="https://github.com/user-attachments/assets/f8894029-2c05-48bc-9321-fa1e749ac827" />



## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python index.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Tests
```bash
cd backend
pytest -v
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`

## Stack

| Layer | Choice |
|-------|--------|
| Backend | Python + Flask |
| ORM | Flask-SQLAlchemy |
| Validation | Pydantic v2 |
| Database | SQLite |
| Frontend | React + TypeScript |
| Server State | TanStack Query v5 |
| Styling | Tailwind CSS |
| Editor | CodeMirror 6 |
| Build | Vite |
| Testing | pytest (backend) |

## Project Structure
```
codecache/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # App factory
│   │   ├── config.py          # Config (dev/test)
│   │   ├── models.py          # SQLAlchemy model
│   │   ├── schemas.py         # Pydantic validation
│   │   ├── errors.py          # Centralized error handlers
│   │   ├── routes/
│   │   │   └── snippets.py    # 5 endpoints
│   │   └── services/
│   │       └── snippet_service.py  # Business logic
│   ├── tests/
│   │   ├── conftest.py        # Fixtures, in-memory DB
│   │   └── test_snippets.py   # 20 tests
│   ├── requirements.txt
│   └── index.py
└── frontend/
    ├── src/
    │   ├── api/               # All API calls
    │   ├── components/        # UI components
    │   ├── hooks/             # TanStack Query hooks
    │   ├── types/             # TypeScript interfaces
    │   └── utils/             # Language extensions
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/snippets` | Create snippet |
| GET | `/api/snippets` | List all snippets |
| GET | `/api/search?q=&lang=` | Search snippets |
| PATCH | `/api/snippets/:id` | Update snippet |
| DELETE | `/api/snippets/:id` | Delete snippet |

## Key Technical Decisions

**Pydantic for validation:** All input validated at the Flask boundary before touching the DB. Language is constrained to an explicit allowlist. Tags normalized to lowercase, capped at 10.

**Service layer:** Business logic lives in `snippet_service.py`, not in routes. Routes are thin — validate, call service, return JSON. Makes logic testable independently of HTTP.

**App factory pattern:** `create_app(config)` lets tests use in-memory SQLite. Required for correct, isolated testing.

**Tags as JSON column:** A separate tags table adds a join on every query for what are essentially labels. Tradeoff: tag search uses `LIKE` on a JSON string — unindexed. Acceptable at this scale.

**TanStack Query:** Handles all server state, caching, and invalidation. No manual `useEffect` fetching. `invalidateQueries` after every mutation keeps the list in sync automatically.

**PATCH over PUT:** Update endpoint uses PATCH — only supplied fields are updated (`model_dump(exclude_unset=True)`). Sending `{"starred": true}` doesn't overwrite title or code.

**Logging:** Every DB mutation logged with `logger.info`. Server errors use `logger.exception` for full stack traces.

## Known Weaknesses

1. **Tag search is unindexed** — uses `LIKE '%query%'` on a JSON string column. Slow beyond ~50k rows. Fix: normalize tags into a separate table.
2. **Language list is duplicated** — exists in both `schemas.py` and `frontend/src/types/snippet.ts`. Must be kept in sync manually. Fix: expose a `GET /languages` endpoint.
3. **No authentication** — any user can edit or delete any snippet. Out of scope for this assessment.
4. **No pagination** — all snippets load at once. Fix: add `?page=&per_page=` to `GET /snippets`.

## Extension Approach

### Better Search
- Dedicated tags table with indexing — fix the current LIKE on JSON string approach
- Filter by multiple tags at once — `?tags=flask,auth`
- Full-text search using SQLite FTS5 extension

### Left Panel Organization
- **Recent** — snippets sorted by `created_at`, last 5 shown
- **By Language** — grouped list, click Python to filter all Python snippets
- **By Tags** — tag cloud, click a tag to filter
- **Starred** — separate section for favourited snippets

### Other
- Pagination — `?page=&per_page=` on `GET /snippets`
- Auth — `users` table, `user_id` FK on snippets
- Share snippets — `public` boolean field, shareable read-only link
- Export — download snippet as a file with correct extension (`.py`, `.js` etc.)
