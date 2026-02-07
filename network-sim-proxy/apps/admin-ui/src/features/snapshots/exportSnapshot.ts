export function exportSnapshot(
  content: string,
  filename: string,
  type: "txt" | "json"
) {
  const blob = new Blob(
    [content],
    { type: type === "json" ? "application/json" : "text/plain" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
