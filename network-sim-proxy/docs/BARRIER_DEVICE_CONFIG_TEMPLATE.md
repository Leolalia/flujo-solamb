# BARRIER DEVICE CONFIG — TEMPLATE
Estado: OBLIGATORIO
Autoridad: EDGE

---

## 1. IDENTIDAD DEL CONTROLADOR

- deviceId:
- adapterKind: BARRIER
- manufacturer:
- model:
- serialNumber:
- firmwareVersion:

---

## 2. CONECTIVIDAD

- connectionType: (GPIO / RELÉ / PLC / API)
- ip / bus / gpio:
- protocolo:
- latencia esperada (ms):

---

## 3. ACCIONES REGISTRADAS

- acciones soportadas: (OPEN / CLOSE)
- método de señalización:
- payload crudo esperado:

---

## 4. EVIDENCIA (SI APLICA)

- tipo evidencia: (binary / text)
- origen:
- hash SHA-256 calculado en:
- retención local:

---

## 5. TIMESTAMPS

- timestamp del controlador:
- zona horaria:
- precisión:
- sincronización NTP:

---

## 6. SEGURIDAD

- aislamiento eléctrico:
- aislamiento de red:
- hardening aplicado:
- control de acceso físico:

---

## 7. PRUEBA TÉCNICA

- acción ejecutada:
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

El controlador:
- No decide apertura/cierre
- No valida condiciones
- No es autoridad operativa

Autoridad final: EDGE CORE
