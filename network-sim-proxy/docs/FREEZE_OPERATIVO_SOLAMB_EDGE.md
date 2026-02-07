# FREEZE OPERATIVO — SOLAMB EDGE
Estado: CONGELADO
Fecha: 2026-02-04
Autoridad: EDGE (AUTORITATIVO)

---

## 1. ALCANCE DEL SISTEMA (CUBIERTO)

El sistema SOLAMB EDGE cubre exclusivamente:

- Registro de eventos operativos de camiones en planta
- Captura de evidencias:
  - Imágenes ANPR
  - Imágenes OCR (documentos, cartas de porte, DNI)
  - Pesos de balanza
  - Acciones físicas (barrera, impresión)
- Generación de:
  - Ledger legal encadenado (prevHash)
  - Snapshots inmutables
  - Auditoría append-only
- Operación offline-first 24/7
- Replicación Edge → Central (derivada, idempotente)

EDGE es la única fuente de verdad.

---

## 2. EXCLUSIONES EXPLÍCITAS (NO CUBIERTO)

El sistema NO cubre:

- Corrección de errores humanos
- Reinterpretación de eventos
- Decisiones automáticas de dispositivos
- Optimización de OCR o ANPR
- Validación comercial, fiscal o contractual
- Reglas de negocio externas a la planta
- Edición o borrado de evidencia
- Autoridad operativa del sistema central

Cualquier intento de incluir estos puntos viola el freeze.

---

## 3. DEFINICIÓN DE CORE (INMUTABLE)

Se considera CORE y queda CONGELADO:

- StateMachine de flujo de camiones
- Modelo de eventos
- Esquema de ledger legal
- Algoritmo de hash canónico
- Encadenamiento prevHash
- Snapshotter
- Auditoría append-only
- Outbox idempotente
- Mecanismo de replicación Edge → Central
- Contratos internos del dominio

El CORE:
- NO se modifica
- NO se optimiza
- NO se reinterpreta
- NO se versiona hacia atrás

---

## 4. DEFINICIÓN DE ADAPTADORES (EXTENSIBLE)

Se consideran ADAPTADORES:

- ANPR
- OCR
- Balanza
- Impresora
- Barrera
- UI de operador
- Drivers físicos
- SDKs de fabricantes

Reglas:
- Los adaptadores NO deciden
- Los adaptadores NO mutan estado
- Los adaptadores NO escriben en el ledger
- Los adaptadores SOLO traducen señales → eventos

Cada adaptador es intercambiable sin tocar el CORE.

---

## 5. SEPARACIÓN ESTRUCTURAL OBLIGATORIA

Estructura mínima obligatoria:

/core
  - stateMachine
  - ledger
  - snapshot
  - audit
  - outbox

/adapters
  /anpr
  /ocr
  /scale
  /printer
  /barrier
  /operator-ui

/protocols
  - eventos canónicos
  - contratos de ingreso

/docs
  - freeze
  - auditoría
  - despliegue

Cualquier cruce Core ↔ Implementación está prohibido.

---

## 6. AUTORIDAD Y AUDITORÍA

- EDGE = AUTORIDAD LEGAL Y OPERATIVA
- CENTRAL = DERIVADO DE CONSULTA
- Cada evento es definitivo
- Cada snapshot es evidencia
- Cada hash es verificable
- La historia es inmutable

---

## 7. CONDICIÓN DE CONTINUIDAD

A partir de este documento:
- Solo se permiten nuevos ADAPTADORES
- Solo se permite despliegue, hardening y operación
- No se permiten cambios conceptuales

Este documento congela el sistema para planta real.
