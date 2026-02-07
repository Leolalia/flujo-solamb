type DiffLine = {
  type: "add" | "remove" | "same";
  text: string;
};

function diffText(a: string, b: string): DiffLine[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");

  const max = Math.max(aLines.length, bLines.length);
  const result: DiffLine[] = [];

  for (let i = 0; i < max; i++) {
    const left = aLines[i];
    const right = bLines[i];

    if (left === right) {
      if (left !== undefined)
        result.push({ type: "same", text: left });
    } else {
      if (left !== undefined)
        result.push({ type: "remove", text: left });
      if (right !== undefined)
        result.push({ type: "add", text: right });
    }
  }

  return result;
}

export function SnapshotDiff({
  a,
  b,
}: {
  a: string;
  b: string;
}) {
  const diff = diffText(a, b);

  return (
    <pre
      style={{
        maxHeight: 500,
        overflow: "auto",
        background: "#000",
        padding: 12,
        whiteSpace: "pre-wrap",
      }}
    >
      {diff.map((l, i) => (
        <div
          key={i}
          style={{
            color:
              l.type === "add"
                ? "#0f0"
                : l.type === "remove"
                ? "#f00"
                : "#aaa",
          }}
        >
          {l.type === "add"
            ? "+ "
            : l.type === "remove"
            ? "- "
            : "  "}
          {l.text}
        </div>
      ))}
    </pre>
  );
}
