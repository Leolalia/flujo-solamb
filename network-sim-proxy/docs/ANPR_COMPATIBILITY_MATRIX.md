# ANPR COMPATIBILITY MATRIX — SOLAMB EDGE
Estado: ACTIVO
Autoridad: EDGE

---

## 1. PROPÓSITO

Definir compatibilidad técnica de cámaras ANPR
con el sistema SOLAMB EDGE sin violar el FREEZE.

---

## 2. CRITERIOS DE COMPATIBILIDAD

Una cámara es compatible si:
- Emite eventos (push o pull)
- Provee timestamp propio
- Entrega imagen como evidencia
- Permite hash SHA-256
- No decide lógica

---

## 3. MATRIZ

| Marca       | Modelo / Línea     | Método     | Evidencia | Estado |
|------------|--------------------|------------|-----------|--------|
| Hikvision  | ANPR Series        | HTTP Push  | JPG       | OK     |
| Dahua      | ITC ANPR           | HTTP Push  | JPG       | OK     |
| Uniview    | ANPR Cameras       | RTSP+API   | JPG       | OK     |
| OpenALPR   | Edge               | API        | JPG       | OK     |
| Genérico   | RTSP + Middleware  | Pull       | JPG       | OK     |

---

## 4. MÉTODOS DE ENTREGA

- HTTP Push → preferido
- API Pull → aceptado
- RTSP puro → requiere middleware

---

## 5. LIMITACIONES

No soportado:
- Cámaras sin timestamp
- Cámaras sin acceso a imagen
- Cámaras que deciden eventos
- Cámaras que sobrescriben evidencia

---

## 6. VALIDACIÓN

Cada integración debe:
- Completar DEVICE_ONBOARDING
- Pasar test de ingest
- Quedar registrada en auditoría

---

## 7. CONDICIÓN LEGAL

Compatibilidad técnica ≠ autoridad legal.  
La cámara nunca es fuente de verdad.
