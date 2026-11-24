'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'gaita-architecture.js'), 'utf8');
const window = {};
vm.runInNewContext(source, { window, structuredClone, Date, Math, Object, Number, Array });
const architecture = window.GaitaArchitecture;

test('stores independent calibration for positions sharing the same MIDI note', () => {
  const state = { holeCals: { '2d': 25, '3b': -30 }, cals: {} };

  assert.equal(architecture.calibrationCents(state, { m: 67, h: 2, dir: 'd' }), 25);
  assert.equal(architecture.calibrationCents(state, { m: 67, h: 3, dir: 'b' }), -30);
  assert.equal(architecture.matchesNote(state, { m: 67, h: 2, dir: 'd' }, 67.25), true);
  assert.equal(architecture.matchesNote(state, { m: 67, h: 3, dir: 'b' }, 66.7), true);
});

test('keeps legacy MIDI calibration as fallback', () => {
  assert.equal(architecture.calibrationCents({ cals: { 67: 40 } }, { m: 67, h: 2, dir: 'd' }), 40);
  assert.equal(architecture.calibrationCents({ cals: { 67: 40 }, holeCals: { '2d': 0 } }, { m: 67, h: 2, dir: 'd' }), 0);
});

test('requires the target octave unless the learner explicitly enables octave matching', () => {
  const target = { m: 67, h: 2, dir: 'd' };

  assert.equal(architecture.matchesNote({}, target, 79), false);
  assert.equal(architecture.matchesNote({ oct: true }, target, 79), true);
});

test('preserves existing calibrations while adding the position map during migration', () => {
  const migrated = architecture.migrateState({ cals: { 67: 15 }, holeCals: { '4d': -20 } });

  assert.equal(migrated.cals[67], 15);
  assert.equal(migrated.holeCals['4d'], -20);
});
