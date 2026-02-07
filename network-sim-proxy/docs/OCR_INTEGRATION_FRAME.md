# OCR INTEGRATION FRAME — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. OBJETIVO

Definir cómo se integran fuentes OCR reales
sin violar el CORE ni el FREEZE OPERATIVO.

---

## 2. ALCANCE

Este marco cubre:
- Captura de documentos físicos
- Recepción de imágenes o PDFs
- Asociación de evidencia

NO cubre:
- Interpretación de texto
- Validación de datos
- Decisiones operativas

---

## 3. FLUJO TÉCNICO

Scanner / Cámara →
OCR Engine / Servicio →
Adaptador OCR →
AdapterEventIn →
Ingest Port →
CORE

---

## 4. RESPONSABILIDAD DEL ADAPTADOR

El adaptador OCR:
- No interpreta texto
- No valida campos
- No decide flujo
- Solo encapsula payload crudo

---

## 5. TIPOS DE DOCUMENTO

Soportados (sin semántica):
- Carta de porte
- DNI
- Remitos
- PDFs firmados
- Formularios impresos

---

## 6. DATOS MÍNIMOS REQUERIDOS

Toda señal OCR debe incluir:
- sourceId
- timestamp de captura
- payload crudo OCR
- referencia a evidencia
- hash SHA-256 del artefacto

---

## 7. FUENTES COMPATIBLES

- Scanner documental
- Cámaras fijas OCR
- Tesseract (local)
- Google Vision
- Azure OCR
- AWS Textract

---

## 8. CONDICIÓN DE ACEPTACIÓN

Una integración OCR es válida solo si:
- Emite AdapterEventIn
- Preserva evidencia original
- No muta historia
- Pasa el Ingest Gate

---

## 9. AUDITORÍA

Cada documento OCR:
- Es auditable
- Es inmutable
- Tiene hash verificable
- Puede ser revisado externamente

---

## 10. CONDICIÓN LEGAL

El OCR:
- No valida identidad
- No certifica documento
- No decide acciones

Autoridad final: EDGE CORE
