/**
 * @type {import('@commitlint/cli').Config}
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [2, "always", "upper-case"],
    "scope-empty": [2, "never", Infinity],
    "subject-empty": [2, "never", Infinity],
    "subject-max-length": [2, "always", 100],
    "subject-min-length": [2, "always", 5],
  },
};
