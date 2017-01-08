

var tiles = {
  vocal: {
    all: [],
    active: []
  },
  loop: {
    all: [],
    active: []
  },
  arpeggio: [],
  all: [],
  notArpeggio: []
}

var tileElements = {
  all: [].slice.call(document.querySelectorAll(".floor-tile")),
  loop: [].slice.call(document.querySelectorAll(".floor-tile.loop")),
  vocal: [].slice.call(document.querySelectorAll(".floor-tile.vocal")),
  special: [].slice.call(document.querySelectorAll(".floor-tile.special")),
  arpeggio: [].slice.call(document.querySelectorAll(".floor-tile.arpeggio")),
  notArpeggiator: [].slice.call(document.querySelectorAll(".floor-tile:not(.arpeggio)"))
}

// MAKE LOOP TILES ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
new BackgroundLoopTile({
  id: 'breath-vinyl'
})
new BackgroundLoopTile({
  id: 'growly-bass'
})
new BackgroundLoopTile({
  id: 'hihat'
})
new BackgroundLoopTile({
  id: 'kick'
})
new BackgroundLoopTile({
  id: 'rhythmic-hi-mid',
  volume: 10
})
new BackgroundLoopTile({
  id: 'rhythmic-low'
})
new BackgroundLoopTile({
  id: 'seagull-fx'
})
new BackgroundLoopTile({
  id: 'snare'
})
new BackgroundLoopTile({
  id: 'tambourine',
  animationInterval: '8n'
})
// MAKE VOCAL TILES ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
new VocalTile({
  id: 'vocals-ab',
  animationInterval: '4n'
})
new VocalTile({
  id: 'vocals-cd',
  glowThreshold: 0.19,
  animationInterval: '4n'
})

// MAKE ARPEGGIO TILES ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
var arpeggio = new Arpeggio({
  volume: -15
})
new ArpeggioTile({
  id:'arp0',
  notes: ["A#2","B#2"]
})
new ArpeggioTile({
  id:'arp1',
  notes: ["C#3"]
})
new ArpeggioTile({
  id:'arp2',
  notes: ["D#3","E#3"]
})
new ArpeggioTile({
  id:'arp3',
  notes: ["F3"]
})
new ArpeggioTile({
  id:'arp4',
  notes: ["A#3", "B#3"]
})

//reposition StandUpShamirs on resize
window.addEventListener('resize', function(e) {
  for (var i = 0; i < tiles.loop.active.length; i++) {
    tiles.loop.active[i].shamir.updatePosition()
  }
})

// pew pew
var groundEl = document.getElementById('ground')
var scanLine = groundEl.querySelectorAll('div.scan-line')[0]
function animateScanLine() {
  TweenLite.fromTo(scanLine, 2, {
    y:'600px',
    opacity: 1,
    ease: Power1.easeInOut
  }, {
    y:'-5000px',
    opacity: 0
  })
}

var backgroundVisible = false
// SPECIAL TILE BEHAVIOR
var discoBall = document.getElementById('disco-ball')
var blueFillLeft = document.getElementById('blue-fill-left')
var blueFillRight = document.getElementById('blue-fill-right')
var blueFill = document.querySelectorAll('div.blue-fill')
var clouds = document.getElementById('clouds')
var confetti = document.querySelectorAll('div.confetti')[0]
var background = document.querySelectorAll('div#background')[0]
var backgroundImages = ['','url(img/clouds.jpg)','','url(img/space2.jpg)']
var backgroundImageIndex = 0
document.body.addEventListener('mousedown', function(e){
  if (e.target.hasClass('special')) {
    if (e.target.hasClass("disco-ball")) {
      if (discoBall.hasClass('visible')) {
        discoBall.removeClass('visible')
        e.target.removeClass('active')
      } else {
        discoBall.addClass('visible')
        e.target.addClass('active')
      }
    } else if(e.target.hasClass('background') ) {
      backgroundImageIndex = (backgroundImageIndex + 1) % backgroundImages.length
      var newBackground = backgroundImages[backgroundImageIndex]
      if (newBackground !== '') {
        var slideInDuration = 0
        backgroundVisible = true
      } else {
        backgroundVisible = false
        var slideInDuration = 0.3
      }
      TweenLite.fromTo(blueFillLeft, slideInDuration, {
        scaleX: 0,
      },{
        scaleX: 1,
        onComplete: function() {
          TweenLite.delayedCall(0.1, function() {
            //switch visible background
            background.style.backgroundImage = newBackground
            //trigger slideOut
            if (newBackground !== '') {
              TweenLite.to(blueFillLeft, 0.3, {
                scaleX: 0
              })
            }
          })
        }
      })

      TweenLite.fromTo(blueFillRight, slideInDuration, {
        scaleX: 0,
      },{
        scaleX: 1,
        onComplete: function() {
          TweenLite.delayedCall(0.1, function() {
            //trigger slideOut
            if (newBackground !== '') {
              TweenLite.to(blueFillRight, 0.3, {
                scaleX: 0
              })
            }
          })
        }
      })

    } else if (e.target.hasClass('confetti')) {
      e.target.addClass('active')

      TweenLite.fromTo(confetti, 2, {
        // scaleX: 0.8,
        scaleY: 0.5,
        y: '-200px',
        opacity: 0,
        ease: Circ.easeOut,
      }, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        y: 0,
        ease: Power4.easeOut,
        onComplete: function() {
          TweenLite.delayedCall(2, function() {
            e.target.removeClass('active')
            TweenLite.to(confetti, 1, {
              y: '100px',
              opacity: 0,
              ease: Power2.easeInOut,
              onComplete: function () {

              }
            })
          })
        }
      })
    }
  }
})

var backgroundEl = document.getElementById('background')
window.addEventListener('mousemove', function(e) {
  if (backgroundVisible) {
    var newX = remap(e.pageX, 0, screen.width, 6, -6 )
    var newY = remap(e.pageY, 0, screen.height, 6, -6 )

    TweenLite.to(background, 3, {
      x: newX,
      y: newY,
      ease: Power3.easeOut
    })
  }

})

//TRANSPORT / SCHEDULED EVENTS
Tone.Transport.bpm.value = 125
Tone.Transport.timeSignature = 4
// Tone.Transport.PPQ = 64
Tone.Transport.swing.value = 0.7


// TILE GLOW
if (fastBrowser) {
  var checkRate = '10i'
} else {
  var checkRate = '100i'
}
Tone.Transport.scheduleRepeat(function() {
  for(var i=0;i<tiles.loop.active.length;i++) {
    tiles.loop.active[i].animateGlow()
  }
  for(var i=0;i<tiles.vocal.active.length;i++) {
    tiles.vocal.active[i].animateGlow()
  }
  if (arpeggio.activeTile !== undefined) {
    arpeggio.activeTile.animateGlow()
  }
},checkRate, 0)
// was 64n, i = pulses

//AUTOPILOT
var autopilotActive = false
var autoSwitch = document.body.querySelectorAll('div#auto-switch_container')[0]
var autoSwitchSlider = autoSwitch.querySelectorAll('circle#slider')[0]
var autoSwitchPlaybar = autoSwitch.querySelectorAll('rect#playbar')[0]
var loopDuration = Tone.TransportTime('8m').toSeconds()

//show switch after a while
Tone.Transport.schedule(function() {
  autoSwitch.addClass('visible')
}, '16m')

autoSwitch.addEventListener('click', function() {
  if (autopilotActive) {
    autoSwitchSlider.removeClass('active')
    autoSwitchPlaybar.removeClass('active')
    autopilotActive = false
  } else {
    autoSwitchSlider.addClass('active')
    autoSwitchPlaybar.addClass('active')
    autopilotActive = true
    autoShuffle()
  }
})

//LOOP START EVENTS
Tone.Transport.scheduleRepeat(function(time) {
  if (fastBrowser) {
    animateScanLine()
  }
  if (autopilotActive) {
    autoShuffle()
  }
  // update auto-switch playbar progress if autopilotActive
  if (autopilotActive) {
    TweenLite.fromTo(autoSwitchPlaybar, loopDuration, {
      x: '-350px',
      ease: Linear.easeNone
    },{
      x: '-10',
      ease: Linear.easeNone
    })
  }
}, "8m")

var stepCounter = 0

arpeggio.loop = new Tone.Loop(function(time){
  if (arpeggio.activeTile !== undefined && stepCounter % 3 !== 0) {
    var notes = arpeggio.activeTile.notes
    var note = notes[stepCounter % notes.length]

    arpeggio.synth.triggerAttackRelease(note, "8n", time)
    arpeggio.shamir.cycleFrames()
    stepCounter++

    Tone.Transport.schedule(function(time) {
      arpeggio.synth.triggerAttackRelease(note, "16n", time)
      // arpeggio.shamir.cycleFrames()
    }, '+16n')

  } else {
    stepCounter++
  }
}, "8n").start(0)

function autoShuffle() {
  //pick random floor-tiles
  //clone tiles
  var tilesToPickFrom = tiles.all
  var amounts = [2,4]
  var amount = amounts[Math.floor(Math.random()*amounts.length)]
  var indexes = []
  //create proxy array of indexes
  for (var h = 0; h < tiles.all.length; h++) {
    indexes.push(h)
  }

  //pick several tiles to toggle
  for (var j=0;j<amount;j++) {
    //pick random index from array
    var index = indexes[Math.floor(Math.random()*indexes.length)]
    // use that to get one tile
    var tileToToggle = tiles.all[index]
    //toggle tile
    tileToToggle.toggleState()
    //remove that index so it can't be triggered again
    indexes.splice(index,1)
  }
}


// SAMPLE LOAD CALLBACK
Tone.Buffer.on("load", function() {
  console.log('all loaded! starting loops now')
  Tone.Transport.start('+1')
  // initArpeggio()
})
