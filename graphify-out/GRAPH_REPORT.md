# Graph Report - 006_LOGISTICA  (2026-06-21)

## Corpus Check
- 116 files · ~29,155 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 548 nodes · 1126 edges · 41 communities (30 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `905de40d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 118 edges
2. `createClient()` - 39 edges
3. `Button()` - 27 edges
4. `compilerOptions` - 16 edges
5. `Input()` - 14 edges
6. `Card()` - 13 edges
7. `CardHeader()` - 13 edges
8. `CardTitle()` - 13 edges
9. `CardContent()` - 13 edges
10. `Label()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `BloqueosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(app)/bloqueos/page.tsx → src/lib/supabase/client.ts
- `DetalleOrdenPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(app)/ordenes-servicio/[id]/page.tsx → src/lib/supabase/client.ts
- `OrdenesServicioPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(app)/ordenes-servicio/page.tsx → src/lib/supabase/client.ts
- `ResourceStatusPanel()` --calls--> `createClient()`  [EXTRACTED]
  src/components/shared/ResourceStatusPanel.tsx → src/lib/supabase/client.ts
- `AvatarImage()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/avatar.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (41 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (45): EventDetailPanel(), EventDetailPanelProps, PanelEvent, ClienteForm(), EquipoForm(), NormaForm(), TecnicoForm(), ClientesPage() (+37 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (37): CalendarEvent, CalendarView(), CalendarViewProps, colorMap, textColorMap, Actividad, ActividadReciente(), Alerta (+29 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (11): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (17): OcupacionChart, ServiciosChart, DetalleOrdenPage(), OSDetalle, ESTADOS_OS, ESTADOS_RECURSO, ROLES, TIPOS_BLOQUEO (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (25): BloqueoRow, BloqueosPage(), tipoBloqueoLabel, tipoRecursoLabel, Props, Props, Props, Props (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (38): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, @fullcalendar/core, @fullcalendar/daygrid (+30 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, eslint-config-prettier, jsdom, prettier, supabase, tailwindcss (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (25): 1.1 Clonar e instalar, 1.2 Variables de entorno, 1.3 Iniciar servidor, 1. Instalación local (desarrollo), 2.1 Crear proyecto, 2.2 Obtener credenciales, 2.3 Configurar `.env.local`, 2.4 Ejecutar migraciones SQL (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (19): CalendarFilters(), CalendarView, PanelEvent, RescheduleState, ErrorBoundary, Props, State, FormDialogProps (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (20): cn(), CardAction(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (12): Acceso al sistema, Atajos, Bloqueos (`/bloqueos`), Calendario (`/calendario`), Catálogos (`/catalogos/*`), Dashboard (`/dashboard`), Manual del Sistema STPS Logística, Módulos (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.24
Nodes (8): config, ResourceAvailabilityIndicator(), ResourceAvailabilityIndicatorProps, Separator(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (23): useAuth(), Header(), navItems, roleLabels, Sidebar(), ThemeToggle(), UserMenu(), LoginPage() (+15 more)

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (6): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (9): DataTableProps, Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader() (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (6): Bugs Conocidos y Limitaciones, Cobertura de tests, Decisiones de diseño, Estado al cierre de Fase 9 (QA), Pendientes (no críticos), Warnings no críticos en lint

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (4): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle()

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): communication, postgresql, shadcn-ui, Taste (Continuously Learned by [CommandCode][cmd]), workflow

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (5): buildCommand, framework, installCommand, outputDirectory, regions

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 40 - "Community 40"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **207 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 10` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 8`, `Community 40`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 20`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 1` to `Community 0`, `Community 3`, `Community 4`, `Community 8`, `Community 14`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 8` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 10`, `Community 14`, `Community 16`, `Community 17`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07393483709273183 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07676767676767676 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.13949579831932774 - nodes in this community are weakly interconnected._