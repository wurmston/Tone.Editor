var reverb = new Tone.Freeverb({
    "roomSize": 0.7,
    "dampening": 4300
}).toMaster()

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
}).connect(reverb)

// Tone.Editor.add(synth)
//
// console.log(Tone.Editor)

var containerElement = document.querySelectorAll('div.tone-editor_container')[0]
console.log(containerElement)

containerElement.addEventListener('click', function(e){
  if (e.target.hasClass('expand-triangle')) {
    if (e.target.hasClass('expanded')) {
      e.target.removeClass('expanded')
      e.target.parentElement.parentElement.removeClass('expanded')
    } else {
      e.target.addClass('expanded')
      e.target.parentElement.parentElement.addClass('expanded')
    }
  } else if (e.target.hasClass('component-class')) {
    // OPEN PAGE IN DOCS
    window.open('https://tonejs.github.io/docs/#'+e.target.innerHTML, '_blank')
  } else if (e.target.hasClass('copy-all')) {
    e.target.style.animation = 'tone-editor_copied 1s'
  }
})
