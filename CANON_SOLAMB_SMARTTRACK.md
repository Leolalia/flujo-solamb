# CANON — SOLAMB SmartTrack

Este documento describe el sistema REAL, tal como existe en el código.

---

## 1. Flujo real de camión

1. LOOP_DETECT (entrada)
2. ANPR (entrada)
3. OCR documento
4. BARRERA_OPEN
5. BALANZA (entrada)
6. SNAPSHOT ingreso

7. BALANZA (salida)
8. ANPR (salida)
9. OCR salida (si aplica)
10. CÁLCULO
11. TICKET
12. BARRERA_SALIDA
13. SNAPSHOT final

---

## 2. Datos críticos

| Dato | Obligatorio | Alternativa |
|----|----|----|
| Patente | Sí | Corrección manual |
| Peso | Sí | Carga manual |
| Documento | Sí | Carga manual |
| Ticket | Sí | Visualización pantalla |

---

## 3. Modos

- Producción: reglas estrictas
- Simulación: eventos artificiales
- Técnico: desbloqueo auditado

---

## 4. Estado actual del código

- FSM implementada
- Snapshots activos
- UI conectada al EDGE
- Simulación parcial
- Dispositivos abstractos

---

## 5. Alcance inmediato

- Pruebas de campo MODULARES
- Un dispositivo a la vez
- Sin remoto
- Un solo operador

---
