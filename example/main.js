var synth = new Tone.MonoSynth({
  oscillator: {
      type: "square"
  },
  filter: {
      Q: 2,
      type: "lowpass",
      rolloff: -12
  },
  envelope: {
      attack: .005,
      decay: 1,
      sustain: 0,
      release: .45
  },
  filterEnvelope: {
      attack: .001,
      decay: .1,
      sustain: .8,
      release: .3,
      baseFrequency: 300,
      octaves: 3.2
  }
})

Tone.Editor.add(synth)

console.log(Tone.Editor)
