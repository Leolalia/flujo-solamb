type Listener = () => void;

const listeners: Listener[] = [];

export function onSnapshotsChanged(fn: Listener) {
  listeners.push(fn);
}

export function notifySnapshotsChanged() {
  for (const fn of listeners) fn();
}
