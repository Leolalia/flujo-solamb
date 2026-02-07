# DECISIONES INMUTABLES — SOLAMB / SmartTrack

Este documento define decisiones cerradas, técnicas y operativas.
No se revisan en chats futuros salvo apertura explícita de nueva fase.

---

## 1. Arquitectura

- El sistema es **event-driven**
- El sistema es **offline-first**
- El EDGE es la fuente primaria de verdad operativa
- No existen deletes físicos (solo eventos compensatorios)
- Toda acción relevante genera:
  - Evento
  - Snapshot
  - Hash legal

---

## 2. Componentes núcleo

- `solamb-edge` es obligatorio y central
- `admin-ui` es interfaz, nunca decide lógica
- `network-sim-proxy` existe como:
  - tooling de laboratorio
  - capa de abstracción de dispositivos
  - puente de integración real en campo

---

## 3. Operación

- El sistema debe funcionar con:
  - 0 dispositivos conectados
  - 1 dispositivo conectado
  - N dispositivos conectados
- Si un dato crítico falta:
  - el camión NO avanza
  - se ofrece carga manual auditada

---

## 4. Auditoría

- Todo bypass operativo queda registrado
- Correcciones manuales requieren:
  - acción explícita
  - snapshot
  - hash

---

## 5. Producción

- Producción ≠ simulación
- Simulación jamás altera reglas de producción
- UI nunca fuerza estados ilegales

---
# DECISIONES INMUTABLES — SOLAMB / SmartTrack

Este documento define decisiones cerradas, técnicas y operativas.
No se revisan en chats futuros salvo apertura explícita de nueva fase.

---

## 1. Arquitectura

- El sistema es **event-driven**
- El sistema es **offline-first**
- El EDGE es la fuente primaria de verdad operativa
- No existen deletes físicos (solo eventos compensatorios)
- Toda acción relevante genera:
  - Evento
  - Snapshot
  - Hash legal

---

## 2. Componentes núcleo

- `solamb-edge` es obligatorio y central
- `admin-ui` es interfaz, nunca decide lógica
- `network-sim-proxy` existe como:
  - tooling de laboratorio
  - capa de abstracción de dispositivos
  - puente de integración real en campo

---

## 3. Operación

- El sistema debe funcionar con:
  - 0 dispositivos conectados
  - 1 dispositivo conectado
  - N dispositivos conectados
- Si un dato crítico falta:
  - el camión NO avanza
  - se ofrece carga manual auditada

---

## 4. Auditoría

- Todo bypass operativo queda registrado
- Correcciones manuales requieren:
  - acción explícita
  - snapshot
  - hash

---

## 5. Producción

- Producción ≠ simulación
- Simulación jamás altera reglas de producción
- UI nunca fuerza estados ilegales

---
