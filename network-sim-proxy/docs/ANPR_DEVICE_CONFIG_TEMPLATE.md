# ANPR DEVICE CONFIG — TEMPLATE
Estado: OBLIGATORIO
Autoridad: EDGE

---

## 1. IDENTIDAD DEL DISPOSITIVO

- deviceId:
- manufacturer:
- model:
- serialNumber:
- firmwareVersion:

---

## 2. CONECTIVIDAD

- connectionType: (ETH / API)
- ip / hostname:
- puerto:
- protocolo: (HTTP / HTTPS / RTSP / API)
- autenticación: (user/pass / token)

---

## 3. EMISIÓN DE EVENTOS

- método de entrega: (push / pull)
- endpoint destino (EDGE):
- formato de payload:
- frecuencia máxima:
- política de reintentos:

---

## 4. EVIDENCIA

- tipo: imagen
- formato: JPG / PNG
- resolución:
- naming convention:
- hash SHA-256 calculado en:

---

## 5. TIMESTAMPS

- timestamp provisto por cámara:
- zona horaria:
- precisión:
- sincronización NTP:

---

## 6. SEGURIDAD

- aislamiento de red:
- firewall:
- certificados:
- credenciales rotación:

---

## 7. PRUEBA TÉCNICA

- evento emitido:
- ingest aceptado:
- evidencia almacenada:
- hash verificado:

---

## 8. APROBACIÓN

- técnico integrador:
- operaciones:
- fecha:

---

## 9. CONDICIÓN LEGAL

La cámara:
- No decide
- No valida
- No es autoritativa

EDGE CORE es la única autoridad.
