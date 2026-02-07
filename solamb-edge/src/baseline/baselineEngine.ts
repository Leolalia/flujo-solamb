type Snapshot = {
  type: string;
};

type BaselineResult = {
  status: 'OK' | 'WARN';
  reason?: string;
  version: 'v1';
};

const WINDOW_SIZE = 5;
const WARN_THRESHOLD = 3;

export function evaluateBaseline(
  current: Snapshot,
  recent: Snapshot[]
): BaselineResult {
  const sameTypeCount = recent.filter(function (s) {
    return s.type === current.type;
  }).length;

  if (sameTypeCount >= WARN_THRESHOLD) {
    return {
      status: 'WARN',
      reason: 'High repetition of event ' + current.type,
      version: 'v1',
    };
  }

  return { status: 'OK', version: 'v1' };
}
