# DEVICE GLOBAL MATRIX — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. PROPÓSITO

Centralizar en un único documento:
- Tipos de dispositivos
- Adaptadores asociados
- Métodos de integración
- Condición de compatibilidad

Documento válido para:
- Operaciones
- Compras
- Integradores
- Auditoría externa

---

## 2. MATRIZ GLOBAL

| Tipo        | Adaptador     | Métodos Admitidos        | Evidencia | Autoridad |
|-------------|---------------|--------------------------|-----------|-----------|
| ANPR        | ANPR          | HTTP Push / API / Pull   | Imagen    | NO        |
| OCR         | OCR           | USB / API / ETH          | Img / PDF | NO        |
| BALANZA     | SCALE         | RS232 / RS485 / ETH      | Binary    | NO        |
| BARRERA     | BARRIER       | PLC / RELÉ / GPIO / API  | Técnica   | NO        |
| IMPRESORA   | PRINTER       | USB / ETH / SERIAL       | Técnica   | NO        |
| UI OPERADOR | OPERATOR_UI   | App / Terminal           | Texto     | NO        |

Autoridad final en todos los casos: **EDGE CORE**

---

## 3. REGLAS COMUNES

Todo dispositivo:
- Se registra previamente
- Pasa onboarding
- Emite AdapterEventIn
- No decide
- No valida
- No muta historia

---

## 4. PROHIBICIONES

No se admite:
- Dispositivo sin timestamp
- Dispositivo que borra evidencia
- Dispositivo que decide lógica
- Integración directa al CORE

---

## 5. AUDITORÍA

Cada dispositivo:
- Tiene registro
- Tiene historial
- Es auditable
- Puede ser deshabilitado

---

## 6. CONDICIÓN LEGAL

Los dispositivos:
- No son fuente de verdad
- No certifican operaciones
- No reemplazan control humano

Fuente de verdad única: **EDGE CORE**
