import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, "chrome-extension");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "downloads");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "sourcewave-chrome-extension.zip");
const SITE_URL_PLACEHOLDER = "__SOURCEWAVE_SITE_URL__";
const DEFAULT_SITE_URL = "http://127.0.0.1:3000";
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".md", ".txt"]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const match = trimmedLine.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key] !== undefined) {
      continue;
    }

    let value = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function resolveSiteUrl() {
  loadEnvFile(path.join(ROOT_DIR, ".env"));
  loadEnvFile(path.join(ROOT_DIR, ".env.local"));

  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;

  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

const RESOLVED_SITE_URL = resolveSiteUrl();

function walkFiles(directory, rootDirectory = directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath, rootDirectory));
      continue;
    }

    const relativePath = path.relative(rootDirectory, absolutePath).replace(/\\/g, "/");
    files.push({
      absolutePath,
      relativePath,
      stats: fs.statSync(absolutePath),
    });
  }

  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function loadFileBuffer(absolutePath) {
  const extension = path.extname(absolutePath).toLowerCase();

  if (!TEXT_EXTENSIONS.has(extension)) {
    return fs.readFileSync(absolutePath);
  }

  const contents = fs
    .readFileSync(absolutePath, "utf8")
    .replaceAll(SITE_URL_PLACEHOLDER, RESOLVED_SITE_URL);

  return Buffer.from(contents, "utf8");
}

const crcTable = (() => {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) === 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    table[index] = value >>> 0;
  }

  return table;
})();

function crc32(buffer) {
  let value = 0xffffffff;

  for (const byte of buffer) {
    value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  }

  return (value ^ 0xffffffff) >>> 0;
}

function toDosDateTime(date) {
  const safeYear = Math.max(date.getFullYear(), 1980);

  return {
    date:
      ((safeYear - 1980) << 9) |
      ((date.getMonth() + 1) << 5) |
      date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  };
}

function createStoredZip(records) {
  const outputParts = [];
  const centralDirectoryParts = [];
  let offset = 0;

  for (const record of records) {
    const fileNameBuffer = Buffer.from(record.relativePath, "utf8");
    const fileData = record.data;
    const checksum = crc32(fileData);
    const { date, time } = toDosDateTime(record.modifiedAt);

    const localHeader = Buffer.alloc(30 + fileNameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(date, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(fileData.length, 18);
    localHeader.writeUInt32LE(fileData.length, 22);
    localHeader.writeUInt16LE(fileNameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    fileNameBuffer.copy(localHeader, 30);

    outputParts.push(localHeader, fileData);

    const centralHeader = Buffer.alloc(46 + fileNameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(fileData.length, 20);
    centralHeader.writeUInt32LE(fileData.length, 24);
    centralHeader.writeUInt16LE(fileNameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    fileNameBuffer.copy(centralHeader, 46);

    centralDirectoryParts.push(centralHeader);
    offset += localHeader.length + fileData.length;
  }

  const centralDirectoryStart = offset;
  const centralDirectorySize = centralDirectoryParts.reduce((total, part) => total + part.length, 0);

  outputParts.push(...centralDirectoryParts);

  const endOfCentralDirectory = Buffer.alloc(22);
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(records.length, 8);
  endOfCentralDirectory.writeUInt16LE(records.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectorySize, 12);
  endOfCentralDirectory.writeUInt32LE(centralDirectoryStart, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  outputParts.push(endOfCentralDirectory);

  return Buffer.concat(outputParts);
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Chrome extension source folder not found: ${SOURCE_DIR}`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = walkFiles(SOURCE_DIR).map((file) => ({
    relativePath: file.relativePath,
    modifiedAt: file.stats.mtime,
    data: loadFileBuffer(file.absolutePath),
  }));

  const zipBuffer = createStoredZip(files);
  fs.writeFileSync(OUTPUT_FILE, zipBuffer);

  console.log(
    `Packaged Sourcewave Chrome extension for ${RESOLVED_SITE_URL} at ${path.relative(ROOT_DIR, OUTPUT_FILE)}`,
  );
}

main();
