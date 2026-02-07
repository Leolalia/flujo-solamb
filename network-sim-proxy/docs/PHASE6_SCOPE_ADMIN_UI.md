# PHASE 6 — ADMIN UI LOCAL (MINI-PC) — SCOPE

## Objetivo
Crear la “cara del sistema” para la mini-PC: configuración, diagnóstico, pruebas y control técnico.

## Entrega
- UI Desktop
- Instalador ejecutable para Windows y Linux
- Sin requerir instalación manual de Node/npm/otras dependencias

## Roles
### OPERADOR (local)
Puede:
- Ver estado completo
- Ejecutar pruebas
- Ejecutar simulaciones
- Ver logs resumidos
No puede:
- Cambiar red
- Crear usuarios
- Cambiar seguridad
- Acceder remoto

### TÉCNICO (local + remoto)
Puede TODO:
- Red (Wi-Fi + IP/DNS + diagnóstico)
- Usuarios/roles y políticas de acceso
- Pruebas y simulaciones completas
- Logs completos + exportación + envío
- Actualizaciones asistidas + rollback
- Backup + restore
- Habilitar/deshabilitar dispositivos (registry)

## Acceso remoto
- Solo TÉCNICO
- Siempre habilitado
- Credenciales fuertes (modo producción)
- Múltiples técnicos simultáneos
- Auditoría de accesos y acciones

## Panel principal (máximo)
- Estado OK/WARN/ERROR
- Métricas (tasa de eventos, latencia ingest, errores por tipo)
- Stream de eventos en vivo con filtros y exportación

## Pruebas y simulaciones (máximo)
- Pruebas completas por dispositivo
- Simulaciones: ausente, latencia, intermitente, payload erróneo, todo OK
- Resultados: humano + técnico, copiable

## Logs
- Resumen comprensible para cualquiera
- Detalle técnico para desarrolladores
- Copiar/exportar/enviar (mail/WhatsApp)

## Red
- Config completa: DHCP/IP fija, gateway, DNS
- Diagnóstico: ping, latencia, pérdida
- Cambios auditados

## Actualizaciones
- Detecta updates por manifest controlado y firmado
- Proceso asistido
- Rollback a versión anterior
- Todo auditado

## Backup/Restore
- Backup completo (config + estado operativo)
- Restore asistido desde UI
- Auditoría de backup y restore

## Voz y rostro (FUTURO)
- Definido como futuro (no implementar ahora)
- Vista operativa: hoy muestra branding SmartTrack
- Acceso a admin por hotkey: CTRL + ALT + A
- El sistema SIEMPRE arranca operativo; la UI nunca bloquea operación
