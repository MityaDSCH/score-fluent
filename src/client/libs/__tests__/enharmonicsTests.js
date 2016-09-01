jest.unmock('../enharmonics');

import { toSharp, toFlat, areEnharmonic } from '../enharmonics';

describe('Enharmonics lib', () => {

  describe('toSharp()', () => {

    it("returns null if passed an invalid pitch", () => {
      expect(toSharp('a')).toBeUndefined();
      expect(toSharp('H')).toBeUndefined();
    });

    it("doesn't change non-flat notes", () => {
      expect(toSharp('A')).toBe('A');
      expect(toSharp('E')).toBe('E');
      expect(toSharp('G#')).toBe('G#');
      expect(toSharp('C#')).toBe('C#');
    });

    it("converts flats to sharps", () => {
      expect(toSharp('Db')).toBe('C#');
      expect(toSharp('Gb')).toBe('F#');
      expect(toSharp('Bb')).toBe('A#');
      expect(toSharp('Cb')).toBe('B');
      expect(toSharp('Fb')).toBe('E');
    })

  });

  describe('toFlat()', () => {

    it("returns null if passed an invalid pitch", () => {
      expect(toFlat('f')).toBeUndefined();
      expect(toFlat('Z')).toBeUndefined();
    });

    it("doesn't change non-sharp notes", () => {
      expect(toFlat('A')).toBe('A');
      expect(toFlat('E')).toBe('E');
      expect(toFlat('Bb')).toBe('Bb');
      expect(toFlat('Db')).toBe('Db');
    });

    it("converts flats to sharps", () => {
      expect(toFlat('D#')).toBe('Eb');
      expect(toFlat('F#')).toBe('Gb');
      expect(toFlat('A#')).toBe('Bb');
      expect(toFlat('B#')).toBe('C');
      expect(toFlat('E#')).toBe('F');
    })

  });

  describe('areEnharmonic()', () => {

    it('returns undefined if an invalid note is passed', () => {
      expect(areEnharmonic('a#', 'bb')).toBeUndefined();
      expect(areEnharmonic('H', 'G#')).toBeUndefined();
      expect(areEnharmonic('F', 'f')).toBeUndefined();
    })

    it('returns false for non-enharmonic pitches', () => {
      expect(areEnharmonic('B', 'C')).toBe(false);
      expect(areEnharmonic('E', 'F')).toBe(false);
      expect(areEnharmonic('Ab', 'D#')).toBe(false);
      expect(areEnharmonic('C#', 'Gb')).toBe(false);
      expect(areEnharmonic('Cb', 'F#')).toBe(false);
      expect(areEnharmonic('E#', 'Bb')).toBe(false);
    });

    it('returns true for enharmonic pitches', () => {
      expect(areEnharmonic('A', 'A')).toBe(true);
      expect(areEnharmonic('F', 'F')).toBe(true);
      expect(areEnharmonic('A#', 'Bb')).toBe(true);
      expect(areEnharmonic('Gb', 'F#')).toBe(true);
      expect(areEnharmonic('Cb', 'B')).toBe(true);
      expect(areEnharmonic('E#', 'F')).toBe(true);
    });

  })

});
