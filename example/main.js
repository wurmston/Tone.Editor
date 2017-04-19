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

var ToneEditor = {
  components: [],
  _editedParameters: [],
  _updateEditCount: function() {
    if (this._editedParameters.length === 1) {
      this._copyAllButton.classList.add('visible')
      this._copyAllButton.innerHTML = 'copy '+this._editedParameters.length+' change'
    } else {
      this._copyAllButton.innerHTML = 'copy '+this._editedParameters.length+' changes'
    }
  },
  _mouseIsDown: false,
  _shiftIsDown: false,
  _optionIsDown: false,
  _keyboardIsVisible: false,
  _copyAllButton: document.querySelectorAll('div.copy-all')[0],
  _keyboardTarget: false,
  keyboardElement: document.querySelectorAll('svg.keyboard')[0],
  containerElement: document.querySelectorAll('div.tone-editor_container')[0],
  toggleKeyboard: function() {
    this.keyboardElement.classList.toggle('collapsed')
    this._keyboardIsVisible = !this._keyboardIsVisible
    this._saveState('keyboardVisible', this._keyboardIsVisible)
    console.log(this._keyboardIsVisible)
  },
  showKeyboard: function() {
    this.keyboardElement.classList.remove('collapsed')
    this._keyboardIsVisible = true
    this._saveState('keyboardVisible', this._keyboardIsVisible)
  }
}

document.addEventListener('keydown', function(e) {
  console.log(e.which)
  switch (e.which) {
    case 16:
      ToneEditor._shiftIsDown = true
      break
    case 18:
      ToneEditor._optionIsDown = true
      break
    default:
      console.log(ToneEditor._keyboardIsVisible)
      // play keyboard if active and has target instrument
      if (ToneEditor._keyboardIsVisible) {
        //TODO match note

        var freq = Tone.Frequency().midiToFrequency(e.which)
        ToneEditor._keyboardTarget.triggerAttackRelease(freq, 1)
      }
  }
})
document.addEventListener('keyup', function(e) {
  switch (e.which) {
    case 16:
      ToneEditor._shiftIsDown = false
      break
    case 18:
      ToneEditor._optionIsDown = false
      break
    default:
      // play keyboard if active and has target instrument
      // if (ToneEditor._keyboardIsVisible) {
      //   console.log('playNote')
      //
      //   //match note
      //   ToneEditor._keyboardTarget.triggerAttackRelease(e.which, 1)
      //   console.log(ToneEditor._keyboardTarget)
      // }
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
  } else if (e.target.hasClass('keyboard-button')) {
    ToneEditor.toggleKeyboard()
  }
})
ToneEditor.containerElement.addEventListener('dblclick', function(e) {
  if (e.target.parentNode.hasClass('parameter')) {
    focusValueElement(e.target.parentNode.querySelectorAll('div.value')[0])
  }
})
ToneEditor.containerElement.addEventListener('mousedown', function(e) {
  ToneEditor.containerElement.addClass('mouse-down')
  ToneEditor._mouseIsDown = true
})
ToneEditor.containerElement.addEventListener('mouseup', function(e) {
  ToneEditor.containerElement.removeClass('mouse-down')
  ToneEditor._mouseIsDown = false
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

  var _this = this

  this.getValue = function() { return _this.parentToneComponent.get(parameterName)[parameterName] }
  this.applyValue = function(value) {
    if (_this.initialized === true && _this.overwritten === false) {
      parent.addClass('overwritten')
      ToneEditor._editedParameters.push(_this)
      ToneEditor._updateEditCount()
      _this.overwritten = true
    }
    _this.parentToneComponent.set(parameterName, value)
    _this.uiElement.set({value: value})
    _this.valueElement.innerHTML = nx.prune(value, 2)
  }

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
          if (ToneEditor._shiftIsDown) incrementAmount = 10
          if (ToneEditor._optionIsDown) incrementAmount = 0.1
          if (ToneEditor._shiftIsDown && ToneEditor._optionIsDown) incrementAmount = 100
          var value = parseFloat(_this.valueElement.innerHTML)
          _this.applyValue(value + incrementAmount)
          document.execCommand('selectAll',false,null)
          break

        //DOWN - increment down
        case 40:
          var incrementAmount = 1
          if (ToneEditor._shiftIsDown) incrementAmount = 10
          if (ToneEditor._optionIsDown) incrementAmount = 0.1
          if (ToneEditor._shiftIsDown && ToneEditor._optionIsDown) incrementAmount = 100
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
          if (e.which >= 48 && e.which <= 57 || e.which === 189 /* negative symbol */ ) {

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

//STATE SAVING
ToneEditor._saveState = function(key, value) {
  // console.log('save: '+key, value)
}

function initNexus() {
  nx.colorize('accent','#FFF')
  nx.colorize('fill','rgba(0,0,0,0)')
  nx.colorize('white','rgba(0,0,0,0)')
}
initNexus()


ToneEditor.Component = function(toneComponent, options) {
  this.name = options.name
  // this.id = 'tone-component-'+Date.now()
  this.id = this.name
  this.class = "MonoSynth"
  this.components = options.components || [] //fill
  this.toneComponent = toneComponent
  this.element = document.querySelectorAll('div.component#'+this.id)[0]
  var _this = this

  // var keyboardTargetButton = this.element.querySelector('.keyboard-target-button')

  this.element.addEventListener('click', function(e) {
    var classes = e.target.classList
    if (classes.contains('keyboard-target-button')) {
      console.log('booya')
      ToneEditor.showKeyboard()

      ToneEditor._keyboardTarget = _this.toneComponent
    }
  })
}

// -----------------------------------------
// mock object structure
ToneEditor.components = [
  new ToneEditor.Component( synth, {
    name: 'synth',
    class: 'MonoSynth',
    toneComponent: synth,
    components: [
      new ToneEditor.UIElement(document.getElementById('frequency'), 'slider', 'frequency', synth),
      new ToneEditor.UIElement(document.getElementById('volume'), 'slider', 'volume', synth)
    ]
  })
]

console.log(ToneEditor)










//end
