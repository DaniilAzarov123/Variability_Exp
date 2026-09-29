// instructions.js

// Main instructions
let instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: (
    `<div style="max-width: ${text_max_width}px; margin: auto; font-size: ${instructions_font_size}px; line-height: 1.5;">
      <h1 style="text-align:center; font-size: ${instructions_font_size*1.5}px;">Instructions</h1>
      <p>
        Welcome to the study on <b>category learning</b>. This experiment consists of two phases: 
        a <b>study phase</b> and a <b>test phase</b>.
      </p>
      <p>
        In the study phase, you will be presented multiple times with a small set of rock images.
        The rocks belong to two different broad categories: Sedimentary and Igneous. 
        On each trial, <b>your task</b> will be to identify the category the rock belongs to 
        by pressing one of the keys on the keyboard:
        <div style="display: flex; justify-content: space-between; 
          font-size: ${instructions_font_size}px; max-width: ${text_max_width/2}px; margin: 0 auto;">
          <span><b>S</b> - Sedimentary</span>
          <span><b>I</b> - Igneous</span>
        </div>
      </p>
      <p>
        You will be then told if your answer was correct or not.
        At first, you will probably be guessing. 
        But by paying attention to the study items and the provided feedback, 
        you should gradually get better at identifying the rock types.
      </p>
      <p>
        After the study phase, you will then be tested on additional rocks that belong to these categories.
        Additional instructions for the test phase will be provided at that time.
      </p>
      <p>
        If your computer has multiple <b>language settings</b> (e.g., English and another language),
        please make sure it is set to English before starting.
      </p>
      <p>
        You can track your progress using the <b>completion bar</b> at the top of the screen. 
        Please note that the bar will refresh when the test phase begins 
        to give you an accurate sense of your progress in both phases.
      </p> 
      <p>
        Press the button below when you are ready to begin.
      </p>
    </div>`
    ),
  choices: ["Begin Study Phase"],
  on_start: function() {
        // Hide progress bar
        var progressBar = document.querySelector('#jspsych-progressbar-container');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    },
  on_finish: function() {
      // Show progress bar again and set it to 0
      var progressBar = document.querySelector('#jspsych-progressbar-container');
      if (progressBar) {
          progressBar.style.display = 'block';
      }
      updateProgressBar(0, '');
  }
};

// Instructions between the study and test phases
let between_phases = {
  type: jsPsychHtmlButtonResponse,
  stimulus: (
    `<div style="max-width: ${text_max_width}px; margin: auto; font-size: ${instructions_font_size}px; line-height: 1.5;">
      <h1 style="text-align:center; font-size: ${instructions_font_size*1.5}px;">Instructions for the Test Phase</h1>
      <p>
        The study phase is now complete.
      </p>
      <p>
        In the test phase, you will again see a series of rock images. 
        Some of the rocks will be old ones that you saw during the study phase.
        But most of the rocks will be new.
        Please continue to <b>try to identify the category that the rock 
        belongs to</b> by pressing one of the keys on the keyboard:
        <div style="display: flex; justify-content: space-between; 
          font-size: ${instructions_font_size}px; max-width: ${text_max_width/2}px; margin: 0 auto;">
          <span><b>S</b> - Sedimentary</span>
          <span><b>I</b> - Igneous</span>
        </div>
      <p>
        In the test phase, <b>feedback will NOT be provided</b>.
        You may find it very challenging to classify many of the new rocks.
        Please try to the best of your ability.
      </p>
      <p>
        <b>Reminder:</b> If your computer has multiple language settings (e.g., English and another language),
        please ensure it is set to English during the test phase.
      </p>
      <p>
        You can track your progress using the <b>completion bar</b> at the top of the screen.  
        Note that it has been refreshed to reflect your progress during this final phase.
      </p>
      <p>
        Press the button below when you are ready to continue.
      </p>
    </div>`
    ),
  choices: ["Begin Test Phase"],
  on_start: function() {
        // Hide progress bar
        var progressBar = document.querySelector('#jspsych-progressbar-container');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    },
  on_finish: function() {
      // Show progress bar again and set it to 0
      var progressBar = document.querySelector('#jspsych-progressbar-container');
      if (progressBar) {
          progressBar.style.display = 'block';
      }
      updateProgressBar(0, '');
  }
};

