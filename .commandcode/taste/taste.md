# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
- Before suggesting model routing (e.g., /model X), verify the model is listed as available in PLAN.md. Confidence: 0.75
- Use MiniMax M3 as the primary model and DeepSeek V4 Pro for corrections. Confidence: 0.90

# postgresql
- CREATE TYPE and CREATE TRIGGER do not support IF NOT EXISTS in PostgreSQL. Use DO blocks with EXCEPTION WHEN duplicate_object THEN NULL for types, or IF NOT EXISTS (SELECT 1 FROM pg_trigger) checks for triggers. Confidence: 0.75
- In PL/pgSQL functions, CASE expressions returning string literals (e.g., 'DELETE', 'UPDATE', 'INSERT') assigned to an ENUM column must be explicitly cast (e.g., 'DELETE'::accion_auditoria). Confidence: 0.70

# communication
- User communicates in Spanish. Respond in Spanish. Confidence: 0.70

# shadcn-ui
- shadcn/ui v4 uses base-ui primitives instead of Radix. Components do not support the `asChild` prop; avoid using it. Confidence: 0.65
- Do not nest a base-ui trigger (which renders as `<button>`) inside a shadcn `<Button>` (also `<button>`) — causes hydration errors (button inside button). Use trigger directly without Button wrapper. Confidence: 0.65

