import _ from 'lodash';

const flats =  [['A'], ['Bb'], ['B', 'Cb'], ['C']      , ['Db'], ['D'], ['Eb'], ['E', 'Fb'], ['F']      , ['Gb'], ['G'], ['Ab']];
const sharps = [['A'], ['A#'], ['B']      , ['C', 'B#'], ['C#'], ['D'], ['D#'], ['E']      , ['F', 'E#'], ['F#'], ['G'], ['G#']];

function pitchIndex(pitch) {
  for (var i = 0; i < flats.length; i++) {
    if (_.includes(flats[i], pitch)) return i;
    if (_.includes(sharps[i], pitch)) return i;
  }
  return null;
}

export function toSharp(pitch) {
  return sharps[pitchIndex(pitch)] ? sharps[pitchIndex(pitch)][0] : undefined;
}

export function toFlat(pitch) {
  return flats[pitchIndex(pitch)] ? flats[pitchIndex(pitch)][0] : undefined;
}

export function areEnharmonic(pitch1, pitch2) {
  // return null if an invalid pitch is passed
  const allPitches = [..._.flatten(flats), ..._.flatten(sharps)];
  if (!(_.includes(allPitches, pitch1) && _.includes(allPitches, pitch2))) return undefined;

  const index1 = pitchIndex(pitch1);
  return index1 !== null && pitchIndex(pitch1) === pitchIndex(pitch2);
}
