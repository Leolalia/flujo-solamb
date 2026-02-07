# SYSTEM CONTEXT — SOLAMB EDGE

## Sistema
SOLAMB EDGE es un sistema industrial 24/7 para flujo de camiones en planta.

## Componentes cubiertos
- Edge industrial (autoridad)
- Cámaras ANPR
- Cámaras OCR (documentos, carta de porte, DNI)
- Balanza
- Impresora
- Barrera
- Operadores humanos
- Central backend (derivado)

## Principios innegociables
- Edge es AUTORITATIVO
- Central es DERIVADO
- Snapshot inmutable
- Hash canónico
- Ledger legal encadenado (prevHash)
- Auditoría append-only
- Outbox idempotente
- Offline-first
- Evidencia legal preservada
- Dispositivos NO deciden
- UI NO decide
- El sistema debe arrancar solo tras corte de energía

## Estado confirmado del core
- Edge Core completo y congelado
- StateMachine cerrada (NO tocar)
- Hashes cerrados (NO tocar)
- Historia NO se reescribe
- Replicación Edge → Central operativa (HTTP + retry + idempotencia)
- Central queries read-only operativas
