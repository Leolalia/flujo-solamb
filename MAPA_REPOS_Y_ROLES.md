# MAPA DE REPOSITORIOS Y ROLES — SOLAMB

---

## 1. solamb-edge

**Rol:** Core operativo local (EDGE)

Responsabilidades:
- FSM de camiones
- Ingesta de eventos
- Persistencia legal (SQLite WAL)
- Snapshots
- API HTTP local
- Operación offline total

Estado: ACTIVO / PRODUCTIVO

---

## 2. admin-ui

**Rol:** Interfaz de operador y auditoría local

Responsabilidades:
- Visualización de estado
- Acciones manuales auditadas
- Reglas de análisis
- Monitoreo de dispositivos

Estado: ACTIVO

---

## 3. network-sim-proxy

**Rol:** Capa de dispositivos (laboratorio y campo)

Responsabilidades:
- Adaptadores ANPR
- OCR
- Balanza
- Barrera
- Impresora
- Simulación / integración real

Estado: TOOLING + FUTURA INTEGRACIÓN CAMPO

---

## 4. central-receiver

**Rol:** Receptor central (futuro)

Responsabilidades:
- Replicación
- Consolidación
- Reportes
- Backups remotos

Estado: PREPARADO / NO OBLIGATORIO HOY

---
