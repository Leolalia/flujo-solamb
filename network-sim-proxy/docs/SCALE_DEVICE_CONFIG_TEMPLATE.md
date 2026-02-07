# SCALE DEVICE CONFIG — TEMPLATE
Estado: OBLIGATORIO
Autoridad: EDGE

---

## 1. IDENTIDAD DEL INDICADOR

- deviceId:
- adapterKind: SCALE
- manufacturer:
- model:
- serialNumber:
- firmwareVersion:

---

## 2. CONECTIVIDAD

- connectionType: (RS232 / RS485 / ETH / API)
- puerto / ip / bus:
- baudrate / params:
- protocolo: (Modbus / ASCII / propietario)
- polling / push:

---

## 3. CAPTURA DE SEÑAL

- formato payload crudo:
- unidad reportada:
- frecuencia máxima:
- latencia esperada (ms):

---

## 4. EVIDENCIA (SI APLICA)

- tipo evidencia: (binary / text)
- origen:
- hash SHA-256 calculado en:
- retención local:

---

## 5. TIMESTAMPS

- timestamp del indicador:
- zona horaria:
- precisión:
- sincronización NTP:

---

## 6. SEGURIDAD

- aislamiento eléctrico:
- aislamiento de red:
- credenciales:
- hardening aplicado:

---

## 7. PRUEBA TÉCNICA

- lectura emitida:
- ingest aceptado:
- payload preservado:
- hash verificado:

---

## 8. APROBACIÓN

- técnico integrador:
- operaciones:
- fecha:

---

## 9. CONDICIÓN LEGAL

El indicador:
- No calcula neto/tara
- No valida estabilidad
- No decide operación

Autoridad final: EDGE CORE
