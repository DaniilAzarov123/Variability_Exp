// utils.js

// Generate a random alphanumeric ID of a given length. Doesn't depend on jsPsych,
// so it can be used before initJsPsych() has run (e.g. for subject/study/session IDs
// that must be known before the DataPipe extension is initialized).
function randomID(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

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

// Adaptive study algorithm helpers

// Compute a recency-weighted sampling weight for every stimulus in `stimuli`,
// based on its history of correct/incorrect responses across all previously
// completed study blocks.
//
// history: array of study-trial data objects (e.g. jsPsych.data.get().filter({task:'study'}).values()),
//          each with at least { image_id, block, correct }.
// stimuli: array of stimulus row objects (e.g. study_table), each with { image_id, ... }.
// completedBlocks: number of blocks fully completed so far (B in the recency-weighting formula).
// lambda: recency weighting base (w_b = lambda^(B-b)).
// epsilon: exploration constant (W_i = epsilon + Difficulty_i).
//
// Returns: { [image_id]: weight } — plain object keyed by stimulus image_id (as a string).
function computeSamplingWeights(history, stimuli, completedBlocks, lambda, epsilon) {
    const weights = {};

    stimuli.forEach(function(stim) {
        const id = String(stim.image_id);

        // All recorded responses for this stimulus, up to and including the last completed block.
        const recs = history.filter(function(rec) {
            return String(rec.image_id) === id && rec.block <= completedBlocks;
        });

        // Group by block, then average correctness within each block (mean-per-block rule):
        // a block where the stimulus was repeated up to max_reps_per_block times still
        // contributes exactly one data point to the recency-weighted accuracy.
        const byBlock = {};
        recs.forEach(function(rec) {
            const b = rec.block;
            if (!byBlock[b]) byBlock[b] = [];
            byBlock[b].push(rec.correct ? 1 : 0);
        });

        let weightedSum = 0;
        let weightTotal = 0;
        Object.keys(byBlock).forEach(function(bKey) {
            const b = parseInt(bKey);
            const meanCorrect = byBlock[b].reduce(function(a, c) { return a + c; }, 0) / byBlock[b].length;
            const w_b = Math.pow(lambda, completedBlocks - b);
            weightedSum += w_b * meanCorrect;
            weightTotal += w_b;
        });

        // If a stimulus somehow has no history yet (shouldn't happen past block 1),
        // default to max difficulty (accuracy = 0) rather than NaN.
        const accuracy = weightTotal > 0 ? (weightedSum / weightTotal) : 0;
        const difficulty = 1 - accuracy;

        weights[id] = epsilon + difficulty;
    });

    return weights;
}

// Draw `nDraws` items from `items` via weighted sampling with replacement, where each
// item's weight comes from `weights[String(item.image_id)]`. Once an item has been drawn
// `maxReps` times, it is removed from the pool for the remainder of this call (its
// underlying weight is unaffected — it simply becomes unavailable for further draws here).
//
// Returns: array of length nDraws, containing references into `items` (duplicates allowed
// up to maxReps).
function weightedSampleWithCap(items, weights, nDraws, maxReps) {
    let pool = items.slice();
    const counts = {};
    const result = [];

    for (let draw = 0; draw < nDraws; draw++) {
        const poolWeights = pool.map(function(item) { return weights[String(item.image_id)]; });
        const totalWeight = poolWeights.reduce(function(a, w) { return a + w; }, 0);

        let chosenIndex = -1;

        if (pool.length === 0 || !(totalWeight > 0)) {
            // Safety fallback: pool exhausted or degenerate weights (should not happen
            // with current constants: 10 items x cap 3 = 30 >= 10 draws per category).
            // Fall back to a uniform pick from the full item list, ignoring the cap.
            const fallbackItem = items[Math.floor(Math.random() * items.length)];
            result.push(fallbackItem);
            const fid = String(fallbackItem.image_id);
            counts[fid] = (counts[fid] || 0) + 1;
            continue;
        }

        let r = Math.random() * totalWeight;
        for (let i = 0; i < pool.length; i++) {
            r -= poolWeights[i];
            if (r <= 0) {
                chosenIndex = i;
                break;
            }
        }
        // Floating-point rounding safety net: if the walk never triggered above,
        // fall back to the last item in the pool.
        if (chosenIndex === -1) chosenIndex = pool.length - 1;

        const chosen = pool[chosenIndex];
        result.push(chosen);

        const cid = String(chosen.image_id);
        counts[cid] = (counts[cid] || 0) + 1;
        if (counts[cid] >= maxReps) {
            pool.splice(chosenIndex, 1);
        }
    }

    return result;
}