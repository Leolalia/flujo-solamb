# CANON SOLAMB / SMARTTRACK
## Documento Maestro Canónico del Sistema

ESTADO: BASELINE AUDITADO
FECHA: 2026-02-07
REPOSITORIO: flujo-solamb
BRANCH: main
COMMIT BASE: 8bf6f450fce199588b1148ae7985ae256e829868

---

## 1. OBJETIVO DEL DOCUMENTO

Este archivo define **la verdad única (single source of truth)** del sistema
SOLAMB / SmartTrack.

Su propósito es:
- Permitir auditoría técnica completa
- Evitar pérdida de información entre chats
- Habilitar continuidad del proyecto sin ambigüedades
- Servir como base para pruebas de campo y producción

Este documento **refleja exactamente el código existente en GitHub**.
Nada aquí es teórico.

---

## 2. COMPONENTES DEL SISTEMA (REAL)

### 2.1 solamb-edge
Rol: Core operativo local (EDGE)

Funciones:
- Máquina de estados de camión
- Ledger legal inmutable
- Snapshots operativos
- Persistencia SQLite (offline-first)
- Verificación legal (hashes)
- API HTTP local
- Simulación integrada

Estado: IMPLEMENTADO Y AUDITADO

Ruta:
solamb-edge/

---

### 2.2 admin-ui
Rol: Interfaz administrativa y operativa local

Funciones:
- Visualización de camión activo
- Auditoría de snapshots
- Mitigaciones manuales
- Modo simulación / producción
- Reglas de análisis
- UI NO decisoria

Estado: IMPLEMENTADO (fase 6)

Ruta:
admin-ui/

---

### 2.3 network-sim-proxy
Rol: Capa de abstracción de dispositivos físicos

Funciones:
- Adaptadores ANPR
- Adaptadores OCR
- Adaptadores balanza
- Adaptadores barrera
- Adaptadores impresora
- Wiring de eventos
- Simulación y reemplazo de hardware real

Estado: PARTE DEL PRODUCTO (NO solo laboratorio)

Ruta:
network-sim-proxy/

---

### 2.4 central-receiver
Rol: Backend central (futuro)

Funciones:
- Ingesta remota
- Replicación
- Auditoría central
- No requerido para pruebas iniciales

Estado: PREPARADO – NO ACTIVO

Ruta:
central-receiver/

---

## 3. FLUJO OPERATIVO REAL

Entrada:
1. Loop detecta camión
2. ANPR entrada
3. OCR documento
4. Balanza entrada
5. Snapshot legal
6. Barrera entrada

Salida:
1. Loop salida
2. ANPR salida
3. Balanza salida
4. Ticket
5. Snapshot legal
6. Barrera salida

Fallas:
- Cualquier falla bloquea avance
- UI habilita carga manual auditada
- Sin dato válido → no avanza

---

## 4. HARDWARE (CONCEPTO)

- 2 cámaras ANPR (entrada / salida)
- 2 cámaras OCR (entrada / salida)
- Loops inductivos (entrada / salida)
- 1 balanza (hoy)
- Barreras independientes
- PC industrial operador (Windows/Linux)
- Iluminación auxiliar nocturna

---

## 5. PRINCIPIOS INMUTABLES

- Event-driven
- Offline-first
- Auditoría legal obligatoria
- Nada se borra
- Todo queda trazado
- La UI nunca decide

---

## 6. USO DEL DOCUMENTO

Este archivo:
- Debe leerse antes de cualquier nuevo chat
- Se adjunta como contexto obligatorio
- No se edita sin auditoría

FIN DEL DOCUMENTO
