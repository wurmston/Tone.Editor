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

var ToneEditor = {
  containerElement: document.querySelectorAll('div.tone-editor_container')[0],
  mouseIsDown: false,
  shiftIsDown: false,
  optionIsDown: false
}
document.addEventListener('keydown', function(e) {
  switch (e.which) {
    case 16:
      ToneEditor.shiftIsDown = true
      break
    case 18:
      ToneEditor.optionIsDown = true
      break
  }
})
document.addEventListener('keyup', function(e) {
  switch (e.which) {
    case 16:
      ToneEditor.shiftIsDown = false
      break
    case 18:
      ToneEditor.optionIsDown = false
      break
  }
})

ToneEditor.containerElement.addEventListener('click', function(e){
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
  } else if (e.target.hasClass('value')) {
    if (e.target.getAttribute('contenteditable') === 'false') {
      focusValueElement(e.target)
      document.execCommand('selectAll',false,null)

    }

    // e.target.select()
  }
})
ToneEditor.containerElement.addEventListener('dblclick', function(e) {
  if (e.target.parentNode.hasClass('parameter')) {
    focusValueElement(e.target.parentNode.querySelectorAll('div.value')[0])
  }
})
ToneEditor.containerElement.addEventListener('mousedown', function(e) {
  ToneEditor.containerElement.addClass('mouse-down')
  ToneEditor.mouseIsDown = true
})
ToneEditor.containerElement.addEventListener('mouseup', function(e) {
  ToneEditor.containerElement.removeClass('mouse-down')
  ToneEditor.mouseIsDown = false
})

function focusValueElement(element) {
  element.setAttribute('data-previous-value', element.innerHTML)
  element.setAttribute('contenteditable', true)
  element.focus()
  document.execCommand('selectAll',false,null)
}

ToneEditor.UIElement = function(parent, type, parameterName, parentToneComponent) {
  this.parentToneComponent = parentToneComponent
  this.name = parameterName
  this.toneParameter = parentToneComponent[parameterName]
  this.uiElement = false
  this.overwritten = false
  this.initialized = false
  this.getValue = function() { return _this.parentToneComponent.get(parameterName)[parameterName] }
  this.applyValue = function(value) {
    if (_this.overwritten === false && _this.initialized === true) {
      parent.addClass('overwritten')
      _this.overwritten = true
    }
    _this.parentToneComponent.set(parameterName, value)
    _this.uiElement.set({value: value})
    _this.valueElement.innerHTML = nx.prune(value, 2)
  }

  var _this = this
  var isSignal = false
  var nxOptions = {
    parent: parent,
    w: '100%',
    h: '100%',
  }

  if (type === 'slider') {
    //add value text and unit
    // e.g. 'frequency' -> 'hz'
    _this.unit = ToneEditor._units[_this.toneParameter.units]
    if (_this.unit !== undefined) {
      //parameter is signal
      isSignal = true
    }
    console.log(_this.toneParameter.units)

    if (isSignal) {
      parent.innerHTML = '<div class="parameter-name">'+parameterName+'<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="false">VALUE</div><div class="unit">'+_this.unit.unit+'</div></div>'
    } else {
      parent.innerHTML = '<div class="parameter-name">'+parameterName+'</div><div class="parameter-value"><div class="value" contenteditable="false">VALUE</div><div class="unit">'+_this.unit.unit+'</div></div>'
    }

    //CREATE uiELEMENT
    _this.uiElement = nx.add(type, nxOptions)
    Object.assign(_this.uiElement, {
      hslider: true,
      mode: 'relative',
      labelSize: 0,
      min: _this.unit.min,
      max: _this.unit.max
    })

    //SETUP VALUE ELEMENT
    _this.valueElement = parent.querySelectorAll('div.value')[0]
    _this.valueElement.addEventListener('mouseover', function(e) {
      if (ToneEditor.mouseIsDown) {
        e.preventDefault()
      }
    })

    // WHEN ELEMENT SETS VALUE
    _this.valueElement.addEventListener('keydown', function(e) {
      switch(e.which){
        //ENTER - apply value
        case 13:
          var value = _this.valueElement.innerHTML
          _this.applyValue(parseFloat(value))
          _this.valueElement.setAttribute('contenteditable', false)
          break

        //DELETE
        case 8:
          break

        //UP - increment down
        case 38:
          var incrementAmount = 1
          if (ToneEditor.shiftIsDown) incrementAmount = 10
          if (ToneEditor.optionIsDown) incrementAmount = 0.1
          if (ToneEditor.shiftIsDown && ToneEditor.optionIsDown) incrementAmount = 100
          var value = parseFloat(_this.valueElement.innerHTML)
          _this.applyValue(value + incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        //DOWN - increment down
        case 40:
          var incrementAmount = 1
          if (ToneEditor.shiftIsDown) incrementAmount = 10
          if (ToneEditor.optionIsDown) incrementAmount = 0.1
          if (ToneEditor.shiftIsDown && ToneEditor.optionIsDown) incrementAmount = 100
          var value = parseFloat(_this.valueElement.innerHTML)
          _this.applyValue(value - incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        // ESC - revert to previous value
        case 27:
          var value = parseFloat(_this.valueElement.getAttribute('data-previous-value'))
          _this.applyValue(value)
          _this.valueElement.blur()
          _this.valueElement.setAttribute('contenteditable', false)
          break

        //NUMBERS
        default:
          if (e.which >= 48 && e.which <= 57) {

          } else {
            e.preventDefault()
          }
      }
    })

    // WHEN SLIDER SETS VALUE
    _this.uiElement.on('value', function(value) {
      _this.applyValue(value)
      _this.valueElement.innerHTML = nx.prune(_this.getValue(), 2)
      _this.valueElement.setAttribute('contenteditable', false)
    })

    //ON CREATION, GET TONE, SET VALUE/SLIDER
    var value = _this.getValue()
    _this.applyValue(value)
    _this.initialized = true

  } else if (type === 'menu') {
    parent.innerHTML = '<div class="parameter-name">'+parameterName+'</div><div class="parameter-value"><div class="value">linear</div><span class="menu-icon"></span></div>'
    var uiElement = nx.add(type, nxOptions )
  }
  _this.uiElement.draw()
}

// guess reasonable units and slider ranges for different parameter types
ToneEditor._units = {
  'frequency': {
    unit: 'hz',
    min: 0,
    max: 20000
  },
  'db': {
    unit: 'dB',
    min: -100,
    max: 10
  }
}

function initNexus() {
  nx.colorize('accent','#FFF')
  nx.colorize('fill','rgba(0,0,0,0)')
  nx.colorize('white','rgba(0,0,0,0)')
}
initNexus()



// -----------------------------------------
// mock object structure
ToneEditor.components = [
  {
    name: 'synth',
    class: 'MonoSynth',
    toneComponent: synth,
    components: [
      new ToneEditor.UIElement(document.getElementById('frequency'), 'slider', 'frequency', synth),
      new ToneEditor.UIElement(document.getElementById('volume'), 'slider', 'volume', synth)
    ]
  }
]

console.log(ToneEditor)










//end
