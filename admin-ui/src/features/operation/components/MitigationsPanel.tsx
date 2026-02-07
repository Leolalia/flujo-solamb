export default function MitigationsPanel() {
  return (
    <section
      style={{
        padding: 16,
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <h2 style={{ marginBottom: 8 }}>Acciones operativas</h2>

      <p style={{ opacity: 0.6, marginBottom: 16 }}>
        Acciones disponibles para mitigar fallas durante la operación.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button disabled>Corregir patente</button>
        <button disabled>Cargar documento manual</button>
        <button disabled>Cargar peso manual</button>
        <button disabled>Reintentar impresión</button>
        <button disabled>Abrir barrera manual</button>
      </div>
    </section>
  );
}
