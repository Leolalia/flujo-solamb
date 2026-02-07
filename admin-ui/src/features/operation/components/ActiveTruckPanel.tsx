export default function ActiveTruckPanel() {
  return (
    <section
      style={{
        padding: 16,
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Camión activo</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr',
          rowGap: 8,
        }}
      >
        <div><strong>Patente</strong></div><div>ABC123 (automática)</div>
        <div><strong>Documento</strong></div><div>OCR fallido</div>
        <div><strong>Peso</strong></div><div>No leído</div>
        <div><strong>Ticket</strong></div><div>Pendiente</div>
      </div>
    </section>
  );
}
