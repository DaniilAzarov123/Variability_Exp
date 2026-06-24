// utils.js

// Device check (make sure the participant is using a non-mobile device in fullscreen mode)
let device_check = {
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => !(data.mobile || !data.fullscreen),
    exclusion_message: (data) => {
        return (
            `<div style="max-width: ${text_max_width}px; margin: auto; 
            font-size: ${instructions_font_size}px; line-height: 1.5;">
            <p>
                Please use a desktop or laptop to complete this experiment. 
                Ensure your computer can switch to fullscreen mode.
            </p>
            <p>
                If you believe this is an error, try refreshing the page.
                If the issue persists, please contact the experimenter.
            </p>
            </div>`
            );
        }
    };

// Function to check consent
let check_consent = function(elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study'.");
        return false;
    }
    return false;
};

// Check consent (the trial itself)
let consentTrial = {
    type:jsPsychExternalHtml,
    url: consent_file,
    cont_btn: "start",
    check_fn: check_consent,
    on_start: function() {
        // Hide progress bar
        var progressBar = document.querySelector('#jspsych-progressbar-container');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }
};

// Run Exp in the fullscreen mode
let enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    on_start: function() {
        // Hide progress bar
        var progressBar = document.querySelector('#jspsych-progressbar-container');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }
};

let exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    delay_after: 0,
    on_start: function() {
        // Hide progress bar
        var progressBar = document.querySelector('#jspsych-progressbar-container');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }
};

// Slow response warning
const slow_warning = {
    timeline: [{
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p style="color:red; font-size:${caption_font_size}px;">
            Please try to respond faster
        </p>`,
        choices: "NO_KEYS",
        trial_duration: warn_dur
    }],
    conditional_function: function() {
        const last_trial = jsPsych.data.get().last(1).values()[0];
        return last_trial.rt > warn_slow_resp;
    }
};

// Fast response warning
const fast_warning = {
    timeline: [{
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p style="color:red; font-size:${caption_font_size}px;">
            You responded too quickly!<br><br>
            Please take your time to examine the image
        </p>`,
        choices: "NO_KEYS",
        trial_duration: warn_dur
    }],
    conditional_function: function() {
        const last_trial = jsPsych.data.get().last(1).values()[0];
        return last_trial.rt < warn_fast_resp;
    }
};


// Manually update progress bar in every phase
function updateProgressBar(progress, text) {
  progress = Math.max(0, Math.min(1, progress));

  jsPsych.progressBar.progress = progress;
  var progress_bar = document.querySelector('#jspsych-progressbar-container');
  
  if (progress_bar) {
    var span = progress_bar.querySelector('span');
    if (span) {
      span.textContent = text;
      span.style.fontSize = "16px";
    }

    var outer_bar = progress_bar.querySelector('#jspsych-progressbar-outer');
    if (outer_bar) {
      outer_bar.style.border = "3px solid grey";
      outer_bar.style.borderRadius = "12px";
      outer_bar.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
      outer_bar.style.height = "25px";
      outer_bar.style.overflow = "hidden";
    }

    var inner_bar = progress_bar.querySelector('#jspsych-progressbar-inner');
    if (inner_bar) {
      inner_bar.style.borderRadius = "8px 8px 8px 8px";
      inner_bar.style.backgroundColor = "rgba(76, 175, 80, 0.7)";
    }
  }
}