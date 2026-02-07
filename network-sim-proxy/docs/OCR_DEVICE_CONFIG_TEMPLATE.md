# OCR DEVICE CONFIG — TEMPLATE
Estado: OBLIGATORIO
Autoridad: EDGE

---

## 1. IDENTIDAD DE LA FUENTE

- deviceId:
- adapterKind: OCR
- manufacturer / provider:
- model / serviceName:
- version:

---

## 2. CONECTIVIDAD

- connectionType: (USB / ETH / API)
- endpoint / ip / port:
- protocolo: (HTTP / HTTPS)
- autenticación: (API key / token / user-pass)

---

## 3. CAPTURA

- tipo de input: (imagen / pdf)
- resolución:
- color / grayscale:
- compresión:
- tamaño máximo:

---

## 4. EMISIÓN DE EVENTOS

- método: (push / pull)
- formato payload:
- frecuencia máxima:
- política de reintentos:

---

## 5. EVIDENCIA

- formato evidencia: (JPG / PNG / PDF)
- naming convention:
- hash SHA-256 calculado en:
- retención local:

---

## 6. TIMESTAMPS

- timestamp de captura:
- zona horaria:
- precisión:
- sincronización NTP:

---

## 7. SEGURIDAD

- aislamiento de red:
- cifrado en tránsito:
- gestión de credenciales:
- rotación:

---

## 8. PRUEBA TÉCNICA

- evento emitido:
- ingest aceptado:
- evidencia almacenada:
- hash verificado:

---

## 9. APROBACIÓN

- técnico integrador:
- operaciones:
- fecha:

---

## 10. CONDICIÓN LEGAL

La fuente OCR:
- No valida contenido
- No certifica documentos
- No decide acciones

Autoridad final: EDGE CORE
