<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tone.Editor Example</title>
    <link rel="stylesheet" href="../build/Tone-Editor.css" media="screen" title="main">

  </head>
  <body>
    <div class="tone-editor_container">
      <div class="header"><h3>Tone.js</h3><div class="keyboard-button">🎹</div></div>
      <?php include "../img/keyboard.svg"; ?>
      <div class="component-list">
        <div class="component expanded selected" id="synth" style="background: lightpink;">
          <div class="component-header">
            <h3 class="component-name">synth</h3><a class="component-class">MonoSynth</a><div class="extra-buttons"><div class="keyboard-target-button">🎹</div></div><div class="expand-triangle expanded"></div>
          </div>
          <div class="parameter-group">
            <div class="parameter cslider">
              <div class="cslider-inner"></div>
              <div class="parameter-name" >detune</div><div class="parameter-value"><div class="value" contenteditable="true">-40</div><div class="unit">c</div></div>
              <div class="center-line"></div>
            </div>
            <div class="parameter hslider" id="frequency">
              <!-- <div class="hslider-inner"></div> -->
              <!-- <div class="parameter-name">frequency<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="true">10,240</div><div class="unit">Hz</div></div> -->
            </div>
            <div class="parameter hslider" id="volume">
              <div class="hslider-inner" style="width: 45%"></div>
              <div class="parameter-name">volume<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="true">-10</div><div class="unit">dB</div></div>
            </div>
            <div class="subcomponent expanded" style="background: lightblue;">
              <div class="component-header">
                <h3 class="component-name">envelope</h3><a class="component-class">Envelope</a><div class="expand-triangle expanded"></div>
              </div>

              <div class="parameter-group">
                <div class="parameter hslider">
                  <div class="hslider-inner"></div>
                  <div class="parameter-name">attack<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="true">0.4</div><div class="unit">s</div></div>
                </div>
                <div class="parameter hslider">
                  <div class="hslider-inner" style="width: 30%"></div>
                  <div class="parameter-name">decay<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="true">0.2</div><div class="unit">s</div></div>
                </div>
                <div class="parameter hslider">
                  <div class="hslider-inner" style="width: 90%"></div>
                  <div class="parameter-name">sustain<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="true">0.7</div><div class="unit"></div></div>
                </div>
                <div class="parameter hslider">
                  <div class="hslider-inner" style="width: 70%"></div>
                  <div class="parameter-name">release<span class="signal-icon">~</span></div><div class="parameter-value"><div class="value" contenteditable="true">1.2</div><div class="unit">s</div></div>
                </div>
                <div class="parameter menu" data-menu-items="linear,exponential">
                  <div class="parameter-name">attackCurve</div><div class="parameter-value"><div class="value">linear</div><span class="menu-icon"></span></div>
                </div>
                <div class="parameter menu" data-menu-items="linear,exponential">
                  <div class="parameter-name">releaseCurve</div><div class="parameter-value"><div class="value">exponential</div><span class="menu-icon"></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="copy-all"></div>
      </div>
    </div>

    <script src="Tone.min.js" charset="utf-8"></script>
    <script src="../build/Tone-Editor.min.js" charset="utf-8"></script>
    <script src="main.js" charset="utf-8"></script>
  </body>
</html>
