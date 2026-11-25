/* Gaita Game | fundação pedagógica v1.1
 * Módulo aditivo: mantém compatibilidade com o formato legado de S.
 * Registra tentativas reais do aluno sem exigir serviço externo.
 */
(function (global) {
  'use strict';
  const VERSION = 1;
  const DAY = 86400000;

  function cloneState(value) {
    if (typeof global.structuredClone === 'function') return global.structuredClone(value);
    return JSON.parse(JSON.stringify(value == null ? {} : value));
  }

  function migrateState(input) {
    const s = input && typeof input === 'object' ? cloneState(input) : {};
    s._schemaVersion = Math.max(Number(s._schemaVersion) || 0, VERSION);
    s._meta = Object.assign({ updatedAt: new Date().toISOString(), deviceId: null }, s._meta || {});
    s.learning = Object.assign({
      placement: { status: 'not_started', completedAt: null, recommendedStage: 1, scores: {} },
      competencies: {}, reviews: {}, attempts: [], recommendations: [],
      cloud: { status: 'not_configured', lastSyncAt: null }
    }, s.learning || {});
    if (!Array.isArray(s.learning.attempts)) s.learning.attempts = [];
    if (!Array.isArray(s.learning.recommendations)) s.learning.recommendations = [];
    return s;
  }

  function evaluatePlacement(scores) {
    const vals = Object.values(scores || {}).filter(v => Number.isFinite(Number(v))).map(Number);
    if (!vals.length) return { recommendedStage: 1, confidence: 0, average: 0 };
    const average = vals.reduce((a, b) => a + b, 0) / vals.length;
    const recommendedStage = average >= 0.90 ? 3 : average >= 0.80 ? 2 : 1;
    return { recommendedStage, confidence: Math.min(1, vals.length / 4), average };
  }

  function competencyStatus({ theory = null, practice = null, pitch = null, rhythm = null, selfCheck = null } = {}) {
    const parts = [theory, practice, pitch, rhythm].filter(v => Number.isFinite(v));
    const average = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : null;
    const evidenceCount = parts.length + (selfCheck === true ? 1 : 0);
    return {
      average,
      evidenceCount,
      status: evidenceCount < 2 ? 'in_progress' : average !== null && average >= 0.8 && selfCheck === true ? 'mastered' : 'reinforce'
    };
  }

  function nextReview({ score = 0, repetitions = 0, now = Date.now() } = {}) {
    const days = score < 0.6 ? 0 : score < 0.8 ? 1 : repetitions < 2 ? 3 : repetitions < 4 ? 7 : repetitions < 6 ? 15 : 30;
    return new Date(now + days * DAY).toISOString();
  }

  function canUnlock({ requiredLessons = [], requiredCompetencies = [], completedLessons = {}, competencies = {} } = {}) {
    const lessonsOk = requiredLessons.every(id => !!completedLessons[id]);
    const skillsOk = requiredCompetencies.every(id => competencies[id] && competencies[id].status === 'mastered');
    return lessonsOk && skillsOk;
  }

  function recordAttempt(state, attempt) {
    const s = migrateState(state);
    const cryptoApi = global.crypto;
    const generatedId = cryptoApi && typeof cryptoApi.randomUUID === 'function'
      ? cryptoApi.randomUUID()
      : 'att-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    const item = Object.assign({ id: generatedId, at: new Date().toISOString() }, attempt || {});
    s.learning.attempts.push(item);
    if (s.learning.attempts.length > 500) s.learning.attempts.splice(0, s.learning.attempts.length - 500);
    s._meta.updatedAt = item.at;
    return s;
  }

  global.GaitaArchitecture = Object.freeze({ VERSION, migrateState, evaluatePlacement, competencyStatus, nextReview, canUnlock, recordAttempt });
})(window);
