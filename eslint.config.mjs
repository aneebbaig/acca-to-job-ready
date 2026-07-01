import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // This React-Compiler rule is experimental and over-fires on two
      // legitimate patterns we rely on: hydration-safe restore of a draft from
      // localStorage after mount (a lazy initializer would cause a hydration
      // mismatch), and the useActionState + toast/close-dialog pattern. Keep it
      // as a warning so it still surfaces genuine cascading-render mistakes.
      "react-hooks/set-state-in-effect": "warn",
      // Allow plain straight quotes/apostrophes in JSX copy.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
