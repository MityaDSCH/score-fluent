import Howler from 'howler';
import { toFlat } from '../enharmonics';

const PlayNote = (output, note, duration) => {

  if (output !== 'none') {
    note.pitch = toFlat(note.pitch);

    // Play note
    const noteName = note.pitch + note.octave;
    const file = new Howler.Howl({
      src: [
        require(`./clips/${output}/webm/${noteName}.webm`),
        require(`./clips/${output}/mp3/${noteName}.mp3`)
      ]
    });
    const sound = file.play();

    // Fade for the last 100ms
    const fadeDuration = 1000;
    setTimeout(() => {
      file.fade(1, 0, fadeDuration, sound);
    }, duration - fadeDuration);
  }

}

export default PlayNote
