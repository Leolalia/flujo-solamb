# ANPR INTEGRATION FRAME — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. OBJETIVO

Definir cómo una cámara ANPR real se conecta al sistema
sin violar el CORE ni el FREEZE.

---

## 2. ALCANCE

Este marco cubre:
- Recepción de señales ANPR
- Extracción de payload crudo
- Asociación de evidencia (imagen)

NO cubre:
- OCR de patente
- Validación de formato
- Decisión de ingreso/egreso

---

## 3. FLUJO TÉCNICO

Cámara ANPR →
Middleware / SDK / API →
Adaptador ANPR →
AdapterEventIn →
Ingest Port →
CORE

---

## 4. RESPONSABILIDAD DEL ADAPTADOR

El adaptador ANPR:
- No interpreta patente
- No valida caracteres
- No decide eventos
- Solo encapsula señal cruda

---

## 5. DATOS MÍNIMOS REQUERIDOS

La señal ANPR debe proveer:

- cameraId
- timestamp de captura
- payload crudo (JSON / binario)
- referencia a imagen
- hash SHA-256 de evidencia

---

## 6. MARCAS COMPATIBLES (NO EXCLUSIVO)

- Hikvision
- Dahua
- Uniview
- OpenALPR Edge
- Servicios ANPR externos vía API

---

## 7. CONDICIÓN DE ACEPTACIÓN

Una integración ANPR es válida solo si:
- Emite AdapterEventIn
- Pasa el Ingest Gate
- Preserva evidencia
- No toca el CORE

---

## 8. AUDITORÍA

Cada evento ANPR:
- Es auditable
- Es inmutable
- Tiene evidencia verificable

---

## 9. CONDICIÓN LEGAL

La cámara ANPR:
- No es autoritativa
- No decide
- No valida identidad legal

Autoridad final: EDGE CORE
