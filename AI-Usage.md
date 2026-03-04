# AI Usage

## Tool Used
Claude (Anthropic) — used as a coding assistant.

## Where AI Helped
- Boilerplate setup (Flask app factory, SQLAlchemy model)
- Suggesting separation of concerns (routes → service → model)
- Writing repetitive test cases once I defined the pattern
- Debugging specific errors I encountered

## What I Fixed / AI Got Wrong

- Circular import in `__init__.py` — AI placed blueprint import at module level, fixed by moving inside `create_app()`
- `e.errors()` not JSON serializable — AI used it directly in `jsonify()`, fixed with `str(e)`
- Missing `value={l}` on language select options — caused language not updating when snippet selected
- Removed `updated_at` field in models — I identified it was unnecessary now
- Changed PUT to PATCH — I caught that updates are partial, not full replacements
- Removed `force=True` from `get_json()` — I questioned it, kept only `silent=True`
- Removed `AppInner` wrapper — I identified it as unnecessary indirection
- UI layout, colors, skeleton loader, icons
- Questioned every endpoint, schema, and component before accepting


## Constraints I Applied to AI Output
- Every endpoint needs a Pydantic schema — enforced this throughout
- Business logic stays in service layer — rejected routes with logic in them
- No raw request data touches the DB
- Correct HTTP status code - verified through Postman
- Every DB mutation must have a `logger.info` call
- No `any` types in TypeScript