# BARRIER INTEGRATION FRAME — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. OBJETIVO

Definir cómo se integran barreras físicas reales
sin violar el CORE ni el FREEZE OPERATIVO.

---

## 2. ALCANCE

Este marco cubre:
- Registro de acciones físicas (OPEN / CLOSE)
- Captura de señal cruda del actuador
- Asociación de evidencia técnica

NO cubre:
- Decisión de apertura/cierre
- Lógica de seguridad
- Interlocks operativos

---

## 3. FLUJO TÉCNICO

PLC / Relé / GPIO →
Gateway / Driver →
Adaptador BARRIER →
AdapterEventIn →
Ingest Port →
CORE

---

## 4. RESPONSABILIDAD DEL ADAPTADOR

El adaptador BARRIER:
- No decide cuándo accionar
- No valida condiciones
- No bloquea ni habilita
- Solo registra acción ejecutada

---

## 5. DATOS MÍNIMOS REQUERIDOS

Toda acción debe incluir:
- barrierId
- acción ejecutada (OPEN / CLOSE)
- timestamp de ejecución
- payload crudo del controlador
- evidencia técnica (si aplica)

---

## 6. TECNOLOGÍAS COMPATIBLES

- PLC industriales
- Relés secos
- GPIO (industrial)
- APIs propietarias de control

---

## 7. CONDICIÓN DE ACEPTACIÓN

Una integración de barrera es válida solo si:
- Emite AdapterEventIn
- Registra acción ejecutada
- Pasa el Ingest Gate
- No decide flujo

---

## 8. AUDITORÍA

Cada acción de barrera:
- Es auditable
- Es inmutable
- Tiene timestamp verificable

---

## 9. CONDICIÓN LEGAL

La barrera:
- No decide ingreso/egreso
- No valida operación
- No es autoridad

Autoridad final: EDGE CORE
