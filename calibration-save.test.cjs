// Testes da cópia de segurança manual da calibração (Node.js, sem dependências).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Função ${name} não encontrada`);
  let brace = html.indexOf('{', start), depth = 0, quote = null, escaped = false;
  for (let i = brace; i < html.length; i++) {
    const ch = html[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  throw new Error(`Bloco da função ${name} não terminou`);
}

const sandbox = {
  isRecord: value => !!value && typeof value === 'object' && !Array.isArray(value),
  KEYS: { C: 0, D: 2, G: 7 },
};
vm.createContext(sandbox);
vm.runInContext(extractFunction('sanitizeCalibrationSnapshot'), sandbox);
vm.runInContext(extractFunction('calibrationSignature'), sandbox);

const valid = {
  app: 'gaita-game-calibration', version: 1, key: 'C', g: 4,
  cals: { '60': 12.7, '64': -155, '67': 0, invalid: 20, '200': 10 },
  savedAt: '2026-11-25T16:00:00.000Z',
};
const clean = sandbox.sanitizeCalibrationSnapshot(valid);
assert.equal(clean.key, 'C');
assert.equal(clean.g, 4);
assert.deepEqual(JSON.parse(JSON.stringify(clean.cals)), { '60': 13, '64': -150, '67': 0 });
assert.equal(clean.savedAt, valid.savedAt);
assert.equal(sandbox.sanitizeCalibrationSnapshot({ ...valid, key: 'unknown' }), null);
assert.equal(sandbox.sanitizeCalibrationSnapshot({ ...valid, app: 'other' }), null);
assert.equal(sandbox.sanitizeCalibrationSnapshot({ ...valid, cals: [] }), null);

const later = { ...clean, savedAt: '2026-11-26T16:00:00.000Z' };
assert.equal(sandbox.calibrationSignature(clean), sandbox.calibrationSignature(later), 'A data do salvamento não deve contar como alteração da calibração');
const changed = { ...clean, cals: { ...clean.cals, 60: 14 } };
assert.notEqual(sandbox.calibrationSignature(clean), sandbox.calibrationSignature(changed));

assert.match(html, /id="tSaveCal"/);
assert.match(html, /id="tRestoreCal"/);
assert.match(html, /localStorage\.setItem\(CALIBRATION_BACKUP_KEY/);
assert.match(html, /localStorage\.removeItem\('gaita'\)/, 'A cópia separada não é removida pelo comando normal de zerar progresso');
console.log('OK: validação da cópia salva, diferenças e controles do afinador.');

// Fluxo de salvamento/restauração usando armazenamento local simulado.
const storage = new Map();
const elements = {
  tSavedCalStatus: { textContent: '' },
  tRestoreCal: { disabled: true },
  tCalv: { textContent: '' },
  key: { value: 'C' },
};
let savedMainState = false, restoredMessage = '';
sandbox.CALIBRATION_BACKUP_KEY = 'gaita.calibration.saved.v1';
sandbox.localStorage = {
  getItem: key => storage.has(key) ? storage.get(key) : null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};
sandbox.$ = id => elements[id] || (elements[id] = { textContent: '', value: '', disabled: false });
sandbox.S = { key: 'G', g: 6, cals: { 67: -11, 71: 24 } };
sandbox.save = () => { savedMainState = true; };
sandbox.resetPitchSmoothing = () => {};
sandbox.renderChart = () => {};
sandbox.updCal = () => {};
sandbox.refresh = () => {};
sandbox.toast = message => { restoredMessage = message; };
sandbox.confirm = () => true;
for (const name of ['currentCalibrationSnapshot', 'readSavedCalibration', 'updateCalibrationSaveUI', 'saveCalibrationSnapshot', 'restoreSavedCalibration']) {
  vm.runInContext(extractFunction(name), sandbox);
}
sandbox.saveCalibrationSnapshot();
const savedCopy = sandbox.readSavedCalibration();
assert.equal(savedCopy.key, 'G');
assert.equal(savedCopy.g, 6);
assert.deepEqual(JSON.parse(JSON.stringify(savedCopy.cals)), { '67': -11, '71': 24 });
assert.equal(elements.tRestoreCal.disabled, false);
assert.match(elements.tSavedCalStatus.textContent, /Cópia salva neste aparelho/);

// Simula zerar o progresso geral: a cópia independente continua disponível.
sandbox.localStorage.removeItem('gaita');
sandbox.S = { key: 'C', g: 0, cals: {} };
sandbox.restoreSavedCalibration();
assert.equal(sandbox.S.key, 'G');
assert.equal(sandbox.S.g, 6);
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.S.cals)), { '67': -11, '71': 24 });
assert.equal(savedMainState, true);
assert.equal(restoredMessage, 'Calibração salva restaurada!');
console.log('OK: salvamento independente, persistência e restauração da calibração completa.');
