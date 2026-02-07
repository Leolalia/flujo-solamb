# SOP OPERATIVO MÍNIMO — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. ARRANQUE DE TURNO

- Verificar energía estable
- Verificar hora del sistema (NTP)
- Iniciar servicios EDGE
- Confirmar logs activos
- Confirmar dispositivos habilitados

---

## 2. OPERACIÓN NORMAL

- Operador NO decide por el sistema
- Dispositivos NO deciden
- Todo evento pasa por Ingest
- Toda evidencia se preserva

---

## 3. INCIDENTES COMUNES

### Dispositivo no responde
- Registrar incidente
- Deshabilitar dispositivo en registry
- Continuar operación manual (si aplica)

### Evento rechazado
- Verificar deviceId
- Verificar estado habilitado
- No reemitir manualmente

---

## 4. FIN DE TURNO

- Verificar integridad de logs
- Verificar espacio de evidencia
- Registrar incidentes del turno
- No borrar información

---

## 5. PROHIBICIONES

- No editar historia
- No borrar evidencia
- No modificar CORE
- No forzar decisiones

---

## 6. RESPONSABILIDADES

- Operador: ejecución
- Técnico: disponibilidad
- EDGE CORE: autoridad

---

Firma responsable de turno: ____________________  
Fecha: ____________________
