import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "src/scripts/**/*", // 크롤링 스크립트들은 프론트엔드 빌드에 불필요
      ".next/**/*",
      "out/**/*",
      "dist/**/*",
      "node_modules/**/*"
    ]
  }
];

export default eslintConfig;
