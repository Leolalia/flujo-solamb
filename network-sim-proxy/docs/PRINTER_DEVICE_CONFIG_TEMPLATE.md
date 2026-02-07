# PRINTER DEVICE CONFIG — TEMPLATE
Estado: OBLIGATORIO
Autoridad: EDGE

---

## 1. IDENTIDAD DE LA IMPRESORA

- deviceId:
- adapterKind: PRINTER
- manufacturer:
- model:
- serialNumber:
- firmwareVersion:

---

## 2. CONECTIVIDAD

- connectionType: (USB / ETH / SERIAL / API)
- ip / puerto / bus:
- driver / gateway:
- protocolo:
- latencia esperada (ms):

---

## 3. EJECUCIÓN DE IMPRESIÓN

- método de envío:
- payload crudo:
- confirmación física:
- timeout de impresión:

---

## 4. EVIDENCIA (SI APLICA)

- tipo evidencia: (text / binary)
- origen:
- hash SHA-256 calculado en:
- retención local:

---

## 5. TIMESTAMPS

- timestamp de ejecución:
- zona horaria:
- precisión:
- sincronización NTP:

---

## 6. SEGURIDAD

- aislamiento eléctrico:
- aislamiento de red:
- control de acceso:
- hardening aplicado:

---

## 7. PRUEBA TÉCNICA

- impresión ejecutada:
- evento emitido:
- ingest aceptado:
- payload preservado:

---

## 8. APROBACIÓN

- técnico integrador:
- operaciones:
- fecha:

---

## 9. CONDICIÓN LEGAL

La impresora:
- No decide qué imprimir
- No valida contenido
- No certifica operación

Autoridad final: EDGE CORE
