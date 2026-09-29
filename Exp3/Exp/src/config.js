// config.js

// Source files
const source_folder = 'src/';
const img_folder = 'https://cdn.jsdelivr.net/gh/DaniilAzarov123/Rocks_Database@main/Rocks480/'; // rock database (jsDelivr CDN, not raw.githubusercontent.com — see comment below)
// raw.githubusercontent.com is not meant for serving website assets and rate-limits/throttles
// bursts of many simultaneous requests (like preloading 300+ images at once), which showed up
// as ERR_HTTP2_PROTOCOL_ERROR in testing. jsDelivr proxies the same GitHub repo but is built
// for exactly this kind of asset delivery.
const consent_file = source_folder + 'consent.html';
const debrief_file = source_folder + 'debrief.html'; // shown via the pipe extension's done_message once data is submitted
const stim_table_file = source_folder + 'testScript_stimuli_320_I_S.csv'; //'stimuli_320_I_S.csv';
const DataPipe_Exp_ID = 'liXj1j5gdAap'; // DataPipe experiment ID
const Prolific_completion_url = "https://app.prolific.com/submissions/complete?cc=CIKR98K7"; // Prolific completion URL

// Date
const full_date = new Date().toISOString();  // Full date and time
const date = full_date.split("T")[0]; // Date only 
const time = full_date.split("T")[1].split(".")[0]; // Time (in UTC) only
const saved_at = time.replaceAll(":", "-");  // "16:25:32" --> "16-25-32"


// Display
const img_size = 300; // image size (px)
const caption_font_size = 35; // for captions under images (question & feedback)
const instructions_font_size = 20; // for instructions
const text_max_width = 760; // max width of the text on the screen

// Experiment structure
const n_study_blocks = 8; // n repetitions of each object
const study_img_per_cat = 10; // how many study images come from each category?
const n_cat = 2; // number of categories to be tested
const n_unique_study_img = n_cat * study_img_per_cat; // n of unique study images
const total_study_img = n_study_blocks * n_unique_study_img; // total number of study images

// Adaptive study algorithm parameters
const recency_lambda = 0.7;        // recency weighting base: w_b = recency_lambda^(B-b)
const exploration_epsilon = 0.25;  // exploration constant: W_i = exploration_epsilon + Difficulty_i
const max_reps_per_block = 3;      // cap on same-stimulus repeats within one block

const feedback_dur = 3000;

// Timing
const isi = 500; // inter-stimulus interval
const warn_slow_resp = 10000; // warn participants if they make very slow responses
const warn_fast_resp = 250; // warn participants if they make very fast responses
const warn_dur = 4000;