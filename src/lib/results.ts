import { TaskResult, TaskSettings } from './types/task';

export const calculateScoreSingle = (result: TaskResult, taskSettings: TaskSettings) => {
  const { scoringSystem } = taskSettings;
  const bestValue = result.attempts.length ? result.attempts.map((v) => v.value ?? 0).sort((a, b) => b - a)[0] : 0;
  const bestRange = result.attempts.length
    ? result.attempts.map((v) => v.zone ?? { name: '0', shortName: '0', score: 0 }).sort((a, b) => b.score - a.score)[0]
    : { name: '0', shortName: '0', score: 0 };
  const timeValues = result.attempts.length ? result.attempts.map((v) => v.value ?? 999.999) : [];
  if (scoringSystem === 'normal') return bestValue;
  if (scoringSystem === 'zones') return bestRange.score;
  if (scoringSystem === 'linear') return taskSettings.linear.a * bestValue + taskSettings.linear.b;
  if (scoringSystem === 'ranges') {
    const sortedRanges = taskSettings.ranges.data.toSorted((a, b) => a.min - b.min);
    for (let i = 0; i < sortedRanges.length; i++) {
      const curr = sortedRanges[i];
      if (i === 0 && (curr.minInclusive ? bestValue < curr.min : bestValue <= curr.min)) {
        return taskSettings.ranges.outOfMin;
      }
      if (i === sortedRanges.length - 1 && (curr.maxInclusive ? bestValue > curr.max : bestValue >= curr.max)) {
        return taskSettings.ranges.outOfMax;
      }
      if (
        (curr.minInclusive ? bestValue >= curr.min : bestValue > curr.min)
        && (curr.maxInclusive ? bestValue <= curr.max : bestValue < curr.max)
      ) {
        return curr.score;
      }
    }
    return 0;
  }
  if (scoringSystem === 'multilinear') {
    const sortedRanges = taskSettings.multilinear.data.toSorted((a, b) => a.min - b.min);
    for (let i = 0; i < sortedRanges.length; i++) {
      const curr = sortedRanges[i];
      if (i === 0 && (curr.minInclusive ? bestValue < curr.min : bestValue <= curr.min)) {
        return taskSettings.multilinear.outOfMin;
      }
      if (i === sortedRanges.length - 1 && (curr.maxInclusive ? bestValue > curr.max : bestValue >= curr.max)) {
        return taskSettings.multilinear.outOfMax;
      }
      if (
        (curr.minInclusive ? bestValue >= curr.min : bestValue > curr.min)
        && (curr.maxInclusive ? bestValue <= curr.max : bestValue < curr.max)
      ) {
        return curr.a * bestValue + curr.b;
      }
    }
    return 0;
  }
  let aggTime = 999.999;
  if (timeValues.length) {
    if (taskSettings.time.method === 'avg') {
      aggTime = timeValues.reduce((acc, cv) => acc + cv, 0) / timeValues.length;
    } else if (taskSettings.time.method === 'sum') {
      aggTime = timeValues.reduce((acc, cv) => acc + cv, 0);
    } else {
      [aggTime] = timeValues.toSorted((a, b) => a - b);
    }
  }
  if (taskSettings.time.transform === 'hyperbolic') {
    return taskSettings.time.coeffs.a / aggTime + taskSettings.time.coeffs.b;
  }
  if (taskSettings.time.transform === 'linear') {
    return taskSettings.time.coeffs.a * aggTime + taskSettings.time.coeffs.b;
  }
  if (taskSettings.time.transform === 'multilinear') {
    const sortedRanges = taskSettings.time.multilinear.data.toSorted((a, b) => a.min - b.min);
    for (let i = 0; i < sortedRanges.length; i++) {
      const curr = sortedRanges[i];
      if (i === 0 && (curr.minInclusive ? aggTime < curr.min : aggTime <= curr.min)) {
        return taskSettings.time.multilinear.outOfMin;
      }
      if (i === sortedRanges.length - 1 && (curr.maxInclusive ? aggTime > curr.max : aggTime >= curr.max)) {
        return taskSettings.time.multilinear.outOfMax;
      }
      if (
        (curr.minInclusive ? aggTime >= curr.min : aggTime > curr.min)
        && (curr.maxInclusive ? aggTime <= curr.max : aggTime < curr.max)
      ) {
        return curr.a * aggTime + curr.b;
      }
    }
    return 0;
  }
  const sortedRanges = taskSettings.time.ranges.data.toSorted((a, b) => a.min - b.min);
  for (let i = 0; i < sortedRanges.length; i++) {
    const curr = sortedRanges[i];
    if (i === 0 && (curr.minInclusive ? aggTime < curr.min : aggTime <= curr.min)) {
      return taskSettings.time.ranges.outOfMin;
    }
    if (i === sortedRanges.length - 1 && (curr.maxInclusive ? aggTime > curr.max : aggTime >= curr.max)) {
      return taskSettings.time.ranges.outOfMax;
    }
    if ((curr.minInclusive ? aggTime >= curr.min : aggTime > curr.min) && (curr.maxInclusive ? aggTime <= curr.max : aggTime < curr.max)) {
      return curr.score;
    }
  }
  return 0;
};

export const updateResultOnTaskChange = (result: TaskResult, taskSettings: TaskSettings) => {
  if (taskSettings.scoringSystem === 'zones' && result.attempts && result.attempts.length > 0) {
    return JSON.stringify({
      ...result,
      attempts: result.attempts.map((att) => {
        if (!att.zone) return att;
        const f = taskSettings.zones.find((z) => z.shortName === att.zone?.shortName);
        if (!f) return { ...att, zone: undefined };
        return { ...att, zone: { ...f } };
      }),
    });
  }
  return undefined;
};
