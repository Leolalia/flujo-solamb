export const analysisRules = {
  expectedKeys: ["events", "devices", "state"],
  minKeys: 5,
  maxKeys: 80,

  severity: {
    missingExpectedKey: "warning",
    sizeOutOfRange: "warning",
    emptySnapshot: "error"
  }
};
