import Howler from 'howler';

const PlayNote = (note, duration) => {
  // Map # -> b
  const flats = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
  const sharps = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const sharpIndex = sharps.indexOf(note.pitch);
  if (sharpIndex != -1) note.pitch = flats[sharpIndex];

  // Play note
  const noteName = note.pitch + note.octave;
  const file = new Howler.Howl({
    src: [require(`./clips/webm/${noteName}.webm`), require(`./clips/mp3/${noteName}.mp3`)]
  });
  const sound = file.play();

  // Fade for the last 100ms
  const fadeDuration = 1000;
  setTimeout(() => {
    file.fade(1, 0, fadeDuration, sound);
  }, duration - fadeDuration);
}

export default PlayNote
