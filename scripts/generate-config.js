/**
 * Gera config.js a partir do config.example.js e de variáveis de ambiente.
 * Local: lê .env na raiz. Vercel/build: usa process.env (API_URL ou API_UR, API_TOKEN, PRODUCT_ID).
 *
 * Uso: node scripts/generate-config.js
 * Ou: npm run generate-config / npm run build
 */

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");
const examplePath = path.join(rootDir, "config.example.js");
const outputPath = path.join(rootDir, "config.js");

function parseEnv(content) {
  const env = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"'))
      value = value.slice(1, -1).replace(/\\"/g, '"');
    if (value.startsWith("'") && value.endsWith("'"))
      value = value.slice(1, -1).replace(/\\'/g, "'");
    env[key] = value;
  }
  return env;
}

function getEnv() {
  const fromFile = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    Object.assign(fromFile, parseEnv(content));
  }
  return {
    API_URL:
      fromFile.API_URL ||
      fromFile.API_UR ||
      process.env.API_URL ||
      process.env.API_UR ||
      "",
    API_TOKEN: fromFile.API_TOKEN || process.env.API_TOKEN || "",
    PRODUCT_ID: fromFile.PRODUCT_ID || process.env.PRODUCT_ID || "",
  };
}

function escapeJsString(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function main() {
  const env = getEnv();

  if (!env.API_URL || !env.API_TOKEN) {
    console.error(
      "Defina API_URL (ou API_UR) e API_TOKEN no .env ou nas variáveis de ambiente.",
    );
    process.exit(1);
  }

  if (!fs.existsSync(examplePath)) {
    console.error("config.example.js não encontrado.");
    process.exit(1);
  }

  let configContent = fs.readFileSync(examplePath, "utf8");

  configContent = configContent.replace(
    /url:\s*"[^"]*"/,
    `url: "${escapeJsString(env.API_URL)}"`,
  );
  configContent = configContent.replace(
    /token:\s*"[^"]*"/,
    `token: "${escapeJsString(env.API_TOKEN)}"`,
  );

  if (env.PRODUCT_ID) {
    configContent = configContent.replace(
      /productId:\s*"[^"]*"/,
      `productId: "${escapeJsString(env.PRODUCT_ID)}"`,
    );
  }

  fs.writeFileSync(outputPath, configContent, "utf8");
  console.log("config.js gerado com sucesso.");
}

main();
