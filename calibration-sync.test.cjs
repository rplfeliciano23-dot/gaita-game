// Testes de regressão da sincronização Afinador -> Atividades (Node.js, sem dependências).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

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
  S: { oct: true, cals: { 72: 35 }, g: 0 },
  selectedTunerMidi: null,
  running: true,
  notes: [{ m: 72, t: 0, d: 1 }, { m: 74, t: 1, d: 1 }],
  cur: 0,
  mode: 'wait',
  t0: 1000,
  $: id => id === 'tunerPlay' ? { style: { display: 'none' } } : { value: '60' }
};
vm.createContext(sandbox);
vm.runInContext(extractFunction('calibrationKeyFor'), sandbox);
vm.runInContext(extractFunction('activityExpectedMidi'), sandbox);

// A atividade aponta explicitamente para o MIDI esperado no modo Aprender.
assert.equal(vm.runInContext('activityExpectedMidi(1500)', sandbox), 72);
// A calibração individual é selecionada pela nota-alvo, e aplicada em cents.
assert.equal(vm.runInContext('calibrationKeyFor(72.35, 72)', sandbox), 72);
assert.equal(vm.runInContext('(72.35 - (S.g || 0)/100 - S.cals[calibrationKeyFor(72.35,72)]/100)', sandbox), 72);
// A calibração de Dó não pode ser aplicada a outra nota distante.
assert.equal(vm.runInContext('calibrationKeyFor(74.2, 72)', sandbox), 74);
// Com equivalência de oitava habilitada, usa a calibração da nota-alvo.
assert.equal(vm.runInContext('calibrationKeyFor(84.35, 72)', sandbox), 72);
// Com equivalência de oitava desabilitada, não transfere a calibração entre oitavas.
sandbox.S.oct = false;
assert.equal(vm.runInContext('calibrationKeyFor(84.35, 72)', sandbox), 84);
// No modo Ritmo, o alvo é a nota que está ativa no tempo musical atual.
sandbox.S.oct = true;
sandbox.mode = 'time';
assert.equal(vm.runInContext('activityExpectedMidi(4500)', sandbox), 74);
// O afinador mantém prioridade à posição selecionada no próprio mapa.
sandbox.$ = id => id === 'tunerPlay' ? { style: { display: 'block' } } : { value: '60' };
sandbox.selectedTunerMidi = 76;
assert.equal(vm.runInContext('calibrationKeyFor(72.1, 72)', sandbox), 76);

console.log('OK: sincronização de calibração entre afinador e atividades.');
