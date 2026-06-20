# Graph Report - 006_LOGISTICA  (2026-06-20)

## Corpus Check
- 115 files · ~26,661 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 545 nodes · 1092 edges · 43 communities (32 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a61a8ae3`
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
- [[_COMMUNITY_Community 19|Community 19]]
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
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 117 edges
2. `createClient()` - 36 edges
3. `Button()` - 24 edges
4. `compilerOptions` - 16 edges
5. `Input()` - 14 edges
6. `Card()` - 13 edges
7. `CardHeader()` - 13 edges
8. `CardTitle()` - 13 edges
9. `CardContent()` - 13 edges
10. `Label()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AvatarImage()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/avatar.tsx → src/lib/utils.ts
- `AvatarBadge()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/avatar.tsx → src/lib/utils.ts
- `AvatarGroup()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/avatar.tsx → src/lib/utils.ts
- `AvatarGroupCount()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/avatar.tsx → src/lib/utils.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/calendar.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (43 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (41): BloqueoRow, tipoBloqueoLabel, tipoRecursoLabel, EventDetailPanelProps, PanelEvent, ClientesPage(), columns, columns (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (41): BloqueosPage(), CalendarEvent, CalendarView(), CalendarViewProps, colorMap, textColorMap, Actividad, ActividadReciente() (+33 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (11): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (20): OcupacionChart, ServiciosChart, useAuth(), OSDetalle, ESTADOS_OS, ESTADOS_RECURSO, ROLES, TIPOS_BLOQUEO (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (23): ClienteForm(), Props, EquipoForm(), Props, NormaForm(), Props, Props, TecnicoForm() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (28): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, @fullcalendar/core, @fullcalendar/daygrid (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): devDependencies, eslint, eslint-config-next, eslint-config-prettier, jsdom, prettier, supabase, tailwindcss (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (25): 1.1 Clonar e instalar, 1.2 Variables de entorno, 1.3 Iniciar servidor, 1. Instalación local (desarrollo), 2.1 Crear proyecto, 2.2 Obtener credenciales, 2.3 Configurar `.env.local`, 2.4 Ejecutar migraciones SQL (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (16): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (15): cn(), CardAction(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), SelectContent(), SelectGroup() (+7 more)

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
Cohesion: 0.11
Nodes (21): ProtectedRoute(), RoleGate(), RoleGateProps, AuthState, useAuthStore, AsignacionEquipo, AsignacionTecnico, AsignacionVehiculo (+13 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 16 - "Community 16"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (4): CalendarFilters(), EventDetailPanel(), CalendarView, PanelEvent

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (6): Bugs Conocidos y Limitaciones, Cobertura de tests, Decisiones de diseño, Estado al cierre de Fase 9 (QA), Pendientes (no críticos), Warnings no críticos en lint

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 20 - "Community 20"
Cohesion: 0.32
Nodes (4): Header(), Sidebar(), ThemeToggle(), UserMenu()

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

### Community 38 - "Community 38"
Cohesion: 0.24
Nodes (8): navItems, roleLabels, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 40 - "Community 40"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 10` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 38`, `Community 8`, `Community 40`, `Community 13`, `Community 15`, `Community 16`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 1` to `Community 0`, `Community 3`, `Community 14`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 0` to `Community 1`, `Community 3`, `Community 8`, `Community 10`, `Community 15`, `Community 16`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09618874773139746 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1294871794871795 - nodes in this community are weakly interconnected._