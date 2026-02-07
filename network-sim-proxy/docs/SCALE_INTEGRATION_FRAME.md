# SCALE INTEGRATION FRAME — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. OBJETIVO

Definir cómo se integran balanzas camioneras reales
sin violar el CORE ni el FREEZE OPERATIVO.

---

## 2. ALCANCE

Este marco cubre:
- Recepción de lecturas de peso
- Captura de payload crudo del indicador
- Asociación de evidencia técnica

NO cubre:
- Cálculo de neto / tara
- Validación metrológica
- Decisiones operativas

---

## 3. FLUJO TÉCNICO

Balanza / Indicador →
Gateway / Driver →
Adaptador SCALE →
AdapterEventIn →
Ingest Port →
CORE

---

## 4. RESPONSABILIDAD DEL ADAPTADOR

El adaptador SCALE:
- No calcula pesos
- No valida estabilidad
- No decide lecturas válidas
- Solo encapsula señal cruda

---

## 5. DATOS MÍNIMOS REQUERIDOS

Toda lectura debe incluir:
- scaleId
- timestamp de medición
- payload crudo del indicador
- referencia a evidencia (si aplica)
- hash SHA-256 del artefacto

---

## 6. PROTOCOLOS COMPATIBLES

- RS232 / RS485
- Ethernet TCP/IP
- Modbus
- APIs propietarias

---

## 7. INDICADORES ADMITIDOS (NO EXCLUSIVO)

- Toledo
- Mettler
- Avery Weigh-Tronix
- Indicadores genéricos industriales

---

## 8. CONDICIÓN DE ACEPTACIÓN

Una integración de balanza es válida solo si:
- Emite AdapterEventIn
- Preserva payload original
- Pasa el Ingest Gate
- No muta historia

---

## 9. AUDITORÍA

Cada lectura de peso:
- Es auditable
- Es inmutable
- Tiene timestamp verificable

---

## 10. CONDICIÓN LEGAL

La balanza:
- No decide peso válido
- No certifica operación
- No es autoridad final

Autoridad final: EDGE CORE
