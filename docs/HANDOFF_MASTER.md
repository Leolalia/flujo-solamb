# HANDOFF MASTER — SOLAMB / SmartTrack (Canon de Continuidad)

Este archivo existe para que puedas iniciar un chat nuevo SIN checkpoints repetidos.

## Fuente de verdad
- Repo: https://github.com/Leolalia/flujo-solamb
- Branch: main
- Regla: si docs y código difieren -> MANDA EL CÓDIGO

## Documentos canónicos (leer siempre)
- CANON_SOLAMB_SMARTTRACK.md
- DECISIONES_INMUTABLES.md
- MAPA_REPOS_Y_ROLES.md
- README_OPERATIVO.md
- ROADMAP_PRODUCCION.md
- SYSTEM_CONTEXT_SOLAMB_EDGE.md
- PHASE6_SCOPE_ADMIN_UI.md
- docs/_audit/* (evidencia técnica)
- docs/_handoff/* (estado duro generado por tools/handoff.ps1)

## Estructura real del repo (raíz)
- admin-ui
- solamb-edge
- network-sim-proxy
- central-receiver
- docs
- tools

## Operación real (campo)
- Planta residuos orgánicos (AR)
- 1 PC local, 1 operador (hoy)
- Pruebas modulares por dispositivo: cámaras → barrera → balanza → impresora
- Debe funcionar degradado: si falta dato crítico -> avisar + carga manual + bloquear avance

## Objetivo de fase activa
FASE 6 — Admin UI local para pruebas de campo:
- Operación guiada sin tocar código durante la prueba
- Legibilidad/ergonomía obligatoria (contraste, layout)
- Modo técnico separado de producción (producción no bloquea operación, solo simulación)
- Mitigaciones manuales auditadas

## Cómo continuar sin checkpoints
1) Ejecutar tools/handoff.ps1 (genera docs/_handoff/* con estado real)
2) Iniciar chat nuevo con el PROMPT CORTO (ver final del archivo)

## PROMPT CORTO PARA CHAT NUEVO (copiar/pegar)
PROYECTO SOLAMB/SmartTrack. Fuente de verdad: repo https://github.com/Leolalia/flujo-solamb (main).
Leer primero: docs/HANDOFF_MASTER.md + docs/_handoff/STATE.json + docs/_handoff/ENDPOINTS_EDGE.txt + docs/_handoff/ENDPOINTS_UI.txt.
Respuestas cortas. Sin checkpoints repetidos: asumir que lo verificado en docs/_handoff es válido.
Objetivo: avanzar FASE 6 (admin-ui) para pruebas de campo (operación + mitigaciones + auditoría + legibilidad).
Si necesitás algo, pedí 1 dato mínimo.
