(function() {
    var Editor = {
      components: [],
      hasBeenInitialized: false,
      // the main user-facing function
      add: function(component1, component2, component3) {
        var documentFragment = document.createDocumentFragment()
        var components = arguments
        for (var i = 0; i < components.length; i++) {
          console.log(arguments[i])
          var thisComponent = new Component(components[i])
          Editor.components.push(thisComponent)
          documentFragment.appendChild(thisComponent.element)
        }
        injectUI(documentFragment)
        return Editor
      },
      remove: function(component) {
        for (var i = 0; i < components.length; i++) {
          if (Object.is(components[i], component)) {
            // delete Element
            // remove from components
          }
        }
        return Editor
      },
      set: function(settings) {
        // apply settings
        return Editor
      }
    }

    function initialize() {
      Editor.containerElement = document.createElement('div')
      Editor.containerElement.setAttribute('id', 'tone-editor_container')
      //inject style
      //
      document.body.appendChild(Editor.containerElement)
      Editor.hasBeenInitialized = true
    }

    // constructor for each UI component (one per Tone Component)
    function Component(toneComponent) {
      this.element = document.createElement('div')
      this.element.className = 'tone-editor_component'
      this._component = toneComponent

      //get top level attributes
      this.component = toneComponent.get()

      //create attribute DOM elements
      for (parameterName in this.component) {
        //check for nested parameters
        if (typeof this.component[parameterName] === 'object') {
          var parentObject = this.component[parameterName]
          var group = document.createElement('div')
          group.className = 'tone-editor_parameter-gui attribute-group'

          for (parameterName in this.component[parameterName]) {
            parentObject[parameterName] = new ParameterGUI(parameterName, parentObject[parameterName])
            this.component[parameterName].updateValue()
            console.log(parentObject[parameterName])
            group.append(parentObject[parameterName])
          }
        } else {
          this.component[parameterName] = new ParameterGUI(parameterName, this.component[parameterName])
          this.component[parameterName].updateValue()
        }

      }

    }

    // constructor for each ToneComponent parameter (i.e. one for each Instrument parameter). returns an object with elements that can be appended to a dom fragment and added
    function ParameterGUI(attributeName, attribute) {
      console.log(attribute)
      // this.ToneParam = attribute.component
      this.type = attribute.type || 'slider'
      this.value = attribute.value
      this.element = '<div class="tone-editor_parameter-gui'+this.type+'"><span>'+this.parameterName+'</span><span>'+this.value+'</span></div>'
      this.updateValue = function() {
        // update value in DOM
        // this.element.childNodes[1].append()
      }
      this.element.className = 'tone-editor_parameter-gui ' + this.type
    }

    // main init function. builds dom elements and injects them into page
    function injectUI(documentFragment) {
      if (!this.hasBeenInitialized) {
          initialize()
      }
      Editor.containerElement.appendChild(documentFragment)
    }

    //extra bits
    function isFunction(val) {
      return typeof val === 'function';
    }

    function getToneObjectInfo(objectName, thisToneObject) {
      if (thisToneObject instanceof Tone) {

        // check against many Tone Classes
        var toneClasses = { //copied from docs
          Instrument: {
            baseClass: Tone.Instrument,
            classes: ["AMSynth", "DuoSynth", "FMSynth", "Instrument", "MembraneSynth", "MetalSynth", "MonoSynth", "Monophonic", "NoiseSynth", "PluckSynth", "PolySynth", "Sampler", "Synth"],
          },
          Effect: {
            baseClass: Tone.Effect,
            classes: ["AutoFilter", "AutoPanner", "AutoWah", "BitCrusher", "Chebyshev", "Chorus", "Convolver", "Distortion", "Effect", "FeedbackDelay", "FeedbackEffect", "Freeverb", "JCReverb", "MidSideEffect", "Phaser", "PingPongDelay", "PitchShift", "StereoEffect", "StereoFeedbackEffect", "StereoWidener", "StereoXFeedbackEffect", "Tremolo", "Vibrato"],
          },
          Source: {
            baseClass: Tone.Source,
            classes: ["AMOscillator", "BufferSource", "FMOscillator", "FatOscillator", "GrainPlayer", "MultiPlayer", "Noise", "OmniOscillator", "Oscillator", "PWMOscillator", "Player", "PulseOscillator", "Source", "UserMedia"],
          },
          Core: {
            baseClass: Tone.Core,
            classes: ['AmplitudeEnvelope', 'Analyser', 'Compressor', 'CrossFade', 'EQ3', 'Envelope', 'FeedbackCombFilter', 'Filter', 'Follower', 'FrequencyEnvelope', 'Gate', 'LFO', 'Limiter', 'LowpassCombFilter', 'Merge', 'Meter', 'MidSideCompressor', 'MidSideMerge', 'MidSideSplit', 'Mono', 'MultibandCompressor', 'MultibandSplit', 'PanVol', 'Panner', 'Panner3D', 'ScaledEnvelope', 'Split', 'Volume']
          }
        }

        for (toneCategoryName in toneClasses) {
          var toneCategory = toneClasses[toneCategoryName]
          if (thisToneObject instanceof toneCategory.baseClass) {
            var info = {
              category: toneCategoryName,
              type: toneCategoryName, // signal, function, number
              //  value: thisToneObject.get()
            }
            for (var i = 0; i < toneCategory.classes.length; i++) {
              if (thisToneObject instanceof Tone[toneCategory.classes[i]]) value.type = toneCategory.classes[i]
            }
            var value = thisToneObject.get()
            if (typeof value !== 'number') {
              for (propertyName in thisToneObject) {
                // recursive, hold on to ur hat
                value = getToneObjectInfo(propertyName, thisToneObject[propertyName])
              }
            }
            info.value = value
            console.log(info)
          }
        }
        return info
      } else {
        return false
      }
    }


    // extract value of parameter. return undefined if invalid
    // function extractthisToneObject( parameterName, thisToneObject ) {
    //  var value = {
    //   expose: false,
    //   type: '', // signal, function, number
    //   value: undefined
    //  }
    //  if (parameterName.indexOf('_') !== -1) {
    //   value = {
    //    expose: false,
    //    type: 'internal', // signal, function, number
    //    value: undefined
    //   }
    //  } else if (isFunction(thisToneObject)) {
    //   value = {
    //    expose: false,
    //    type: 'Function', // signal, function, number
    //    value: undefined
    //   }
    //  } else if (typeof thisToneObject === 'number') {
    //   value = {
    //    expose: true,
    //    type: 'number', // signal, function, number
    //    value: thisToneObject
    //   }
    //  } else if (thisToneObject instanceof Tone.Param) {
    //   value = {
    //    expose: true,
    //    type: 'Param', // signal, function, number
    //    value: thisToneObject.value,
    //    units: thisToneObject.units
    //   }
    //  } else if (thisToneObject instanceof Tone.Effect) {
    //   value = {
    //    expose: true,
    //    type: 'Effect', // signal, function, number
    //    value: thisToneObject.value,
    //    units: thisToneObject.units
    //   }
    //  } else if (thisToneObject instanceof Tone.Instrument) {
    //   value = {
    //    expose: true,
    //    type: 'Instrument', // signal, function, number
    //    value: thisToneObject.value,
    //    units: thisToneObject.units
    //   }
    //  } else if (thisToneObject instanceof AudioParam) {
    //   value = {
    //    expose: true,
    //    type: 'AudioParam', // signal, function, number
    //    value: thisToneObject.value
    //   }
    //  // } else if (typeof thisToneObject === 'object'){ //not signal or audioparam but a Tone component
    //   // value = {
    //   //  expose: true,
    //   //  type: 'Object', // signal, function, number
    //   //  value: thisToneObject.value
    //   // }
    //   // // iterate one layer deeper
    //   // for (parameterName2 in thisToneObject) {
    //   //  if (parameter)
    //   //  var nestedValue = extractthisToneObject(parameterName2, thisToneObject[parameterName2])
    //   // }
    //
    //
    //  }
    //  value.name = parameterName
    //  value.originalObject = thisToneObject
    //  if (value.type !== 'Function') console.log(value)
    //  return value
    // }


    Tone.Editor = Editor
})()
