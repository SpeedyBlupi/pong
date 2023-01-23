import cache from "./cache";

//------------------------------------------------------------------------

const _map = new Map([
  [
    "SoundType.Click",
    {
      filename: "sound000",
      volume: 0.2,
    },
  ],
  [
    "SoundType.TowerBuilded",
    {
      filename: "sound001",
      volume: 1,
    },
  ],
  [
    "SoundType.Disappearance",
    {
      filename: "sound002",
      volume: 1,
    },
  ],
  [
    "SoundType.TakeTreasure",
    {
      filename: "sound003",
      volume: 1,
    },
  ],
  [
    "SoundType.Explosion",
    {
      filename: "sound004",
      volume: 1,
    },
  ],
  [
    "SoundType.Dead3",
    {
      filename: "sound005",
      volume: 1,
    },
  ],
  [
    "SoundType.LostTreasure",
    {
      filename: "sound006",
      volume: 1,
    },
  ],
  [
    "SoundType.Claxon",
    {
      filename: "sound007",
      volume: 1,
    },
  ],
  [
    "SoundType.Dollar",
    {
      filename: "sound008",
      volume: 1,
    },
  ],
  [
    "SoundType.Splash",
    {
      filename: "sound009",
      volume: 1,
    },
  ],
  [
    "SoundType.Laser",
    {
      filename: "sound010",
      volume: 1,
    },
  ],
  [
    "SoundType.Gun",
    {
      filename: "sound011",
      volume: 0.5,
    },
  ],
  [
    "SoundType.Tic",
    {
      filename: "sound012",
      volume: 1,
    },
  ],
  [
    "SoundType.Tac",
    {
      filename: "sound013",
      volume: 1,
    },
  ],
  [
    "SoundType.Dead4",
    {
      filename: "sound014",
      volume: 1,
    },
  ],
  [
    "SoundType.ShootScorpion",
    {
      filename: "sound015",
      volume: 1,
    },
  ],
  [
    "SoundType.Bee",
    {
      filename: "sound016",
      volume: 1,
    },
  ],
  [
    "SoundType.ToSellTower",
    {
      filename: "sound017",
      volume: 1,
    },
  ],
  [
    "SoundType.GoalScorpion",
    {
      filename: "sound018",
      volume: 1,
    },
  ],
  [
    "SoundType.Dead2",
    {
      filename: "sound019",
      volume: 1,
    },
  ],
  [
    "SoundType.Dead1",
    {
      filename: "sound020",
      volume: 1,
    },
  ],
  [
    "SoundType.Lost",
    {
      filename: "sound021",
      volume: 1,
    },
  ],
  [
    "SoundType.Win",
    {
      filename: "sound022",
      volume: 1,
    },
  ],
  [
    "SoundType.HomeTreasure",
    {
      filename: "sound023",
      volume: 1,
    },
  ],
  [
    "SoundType.EndUpgrade",
    {
      filename: "sound024",
      volume: 1,
    },
  ],
  [
    "SoundType.SelectError",
    {
      filename: "sound025",
      volume: 1,
    },
  ],
  [
    "SoundType.SelectTower",
    {
      filename: "sound026",
      volume: 1,
    },
  ],
  [
    "SoundType.TreasureLost",
    {
      filename: "sound027",
      volume: 1,
    },
  ],
  [
    "SoundType.Electro",
    {
      filename: "sound028",
      volume: 1,
    },
  ],
  [
    "SoundType.Rocket",
    {
      filename: "sound029",
      volume: 1,
    },
  ],
  [
    "SoundType.Freezer",
    {
      filename: "sound030",
      volume: 1,
    },
  ],
  [
    "SoundType.Speak",
    {
      filename: "sound031",
      volume: 1,
    },
  ],
  [
    "SoundType.Fear",
    {
      filename: "sound032",
      volume: 1,
    },
  ],
]);

//------------------------------------------------------------------------

export default class AudioPlayer {
  constructor() {
    this._enable = true;
  }

  //------------------------------------------------------------------------

  static get soundsToLoad() {
    const soundsToLoad = [];
    _map.forEach((def, soundName) => {
      soundsToLoad.push({
        soundName: soundName,
        filename: cache[`./audio/${def.filename}.wav`],
      });
    });
    return soundsToLoad;
  }

  //------------------------------------------------------------------------

  // See audio object properties:
  // https://www.w3schools.com/jsref/dom_obj_audio.asp

  // Enable or desable sound effects.
  setEnable(enable) {
    this._enable = enable;
  }

  // Play a sound.
  playSound(device, soundName) {
    if (!this._enable) {
      return;
    }

    const sound = device.sounds[soundName];

    if (sound.paused) {
      // If the sound is not currently played, play it.
      const def = _map.get(soundName);
      sound.volume = def.volume;

      const promise = sound.play();
      if (promise !== undefined) {
        promise
          .then((_) => {
            // console.log(`AudioPlayed.playSound ${soundName} started`);
          })
          .catch((error) => {
            console.log(
              `AudioPlayed.playSound ${soundName} was prevented: ${error}`
            );
          });
      }
    } else {
      // If the sound is currently played, play it again from the beginning.
      sound.currentTime = 0;
    }
  }

  // Stop a sound.
  stopSound(device, soundName) {
    const sound = device.sounds[soundName];
    if (!sound.paused) {
      // If the sound is currently played, stop it.
      sound.pause();
      sound.currentTime = 0;
    }
  }

  stopAll(device) {
    _map.forEach((_, soundName) => {
      this.stopSound(device, soundName);
    });
  }
}
