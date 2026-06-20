# Bugs Conocidos y Limitaciones

> Documento vivo. Actualizar cuando se descubra o resuelva un bug.

## Estado al cierre de Fase 9 (QA)

### Pendientes (no críticos)

- **No se regeneran tipos TypeScript de Supabase automáticamente.** Los tipos `database.types.ts` fueron creados manualmente. Tras conectar a un proyecto Supabase real, ejecutar `npx supabase gen types typescript --project-id <ID>` para regenerarlos. Esto eliminará los `as any` en queries con joins.

- **Reportes (Fase 8) son placeholders.** Las páginas `/reportes/tecnicos`, `/reportes/vehiculos`, `/reportes/equipos` muestran mensajes "Próximamente". La exportación a CSV/PDF no está implementada.

- **Edición de OS pendiente.** Creación funciona, pero la UI de edición desde `/ordenes-servicio/[id]` aún no está implementada (solo cambio de estado).

- **Calendario sin realtime.** Las suscripciones Supabase Realtime no están activas en CalendarView. El usuario debe refrescar la página para ver cambios hechos por otros.

- **Dashboard no tiene filtro por rango de fechas.** Los gráficos muestran últimos 6 meses sin selector de período.

- **Alertas automáticas (Tarea 7.4) parciales.** Implementadas para calibración y mantenimiento en AlertasList, pero no integradas como widget en el dashboard principal.

- **Finalización automática de bloqueos (Tarea 7.6) no implementada.** Los bloqueos finalizados se detectan en query por comparación con `now()` en bloqueos page, pero no hay cron job que los marque formalmente como inactivos.

- **Sin tests E2E (Playwright).** No se instaló Playwright; los tests cubren unitarios e integración solamente.

### Decisiones de diseño

- **Conflictos parciales solo bloquean en modo estricto.** El motor reporta advertencias (calibración próxima, mantenimiento próximo, sobrecarga) pero no bloquean el guardado; solo errores rojos.

- **Cancelación de OS es inmediata.** No hay flujo de "cancelar con motivo". Se registra vía trigger de auditoría.

- **Mini calendarios por recurso no implementados.** El PLAN.md los pide (Tarea 6.6); se omitieron por scope.

### Warnings no críticos en lint

- 72 warnings restantes, principalmente `no-explicit-any` (esperados por falta de tipos generados de Supabase) y `no-unused-vars` en código de scaffolding.

## Cobertura de tests

```
Test Files  3 passed (3)
     Tests  24 passed (24)
```

- `tests/unit/schemas.test.ts` — 16 tests: validación de todos los schemas Zod
- `tests/unit/motor-validacion.test.ts` — 5 tests: motor con mocks
- `tests/integration/ordenes-servicio.test.ts` — 3 tests: flujo de validación

Cobertura: aproximadamente 60% del código crítico (motor de validación + schemas). Los componentes UI no tienen tests automatizados.