# DEVICE CATALOG — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE
Uso: Planta industrial

---

## 1. PROPÓSITO

Este documento define:
- Qué dispositivos físicos pueden conectarse
- Cómo se identifican
- Qué adaptador los recibe

NO define:
- Drivers
- SDKs
- Configuración eléctrica
- Reglas operativas

---

## 2. IDENTIDAD DE DISPOSITIVO

Todo dispositivo DEBE declarar:

- deviceId (string, único en planta)
- adapterKind (ANPR | OCR | SCALE | PRINTER | BARRIER | OPERATOR_UI)
- manufacturer
- model
- serialNumber
- firmwareVersion
- connectionType (ETH | USB | RS485 | GPIO | API)
- location (texto libre)
- installedAt (ISO-8601)

---

## 3. ANPR

Adaptador: ANPR

Ejemplos admitidos:
- Hikvision ANPR
- Dahua ANPR
- OpenALPR Edge
- Cámaras RTSP + servicio externo

---

## 4. OCR

Adaptador: OCR

Ejemplos admitidos:
- Scanner documental
- Cámara fija OCR
- OCR externo (Tesseract, Google Vision, Azure OCR)

---

## 5. BALANZA

Adaptador: SCALE

Ejemplos admitidos:
- Balanza camionera RS485
- Balanza Ethernet
- Indicador digital homologado

---

## 6. IMPRESORA

Adaptad
