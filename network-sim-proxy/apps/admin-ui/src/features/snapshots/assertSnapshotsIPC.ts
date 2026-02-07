export function assertSnapshotsIPC(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as any).snapshots === "object" &&
    typeof (window as any).snapshots.list === "function" &&
    typeof (window as any).snapshots.get === "function"
  );
}
