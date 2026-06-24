// config.js

// Source files
const source_folder = 'src/';
const img_folder = 'https://raw.githubusercontent.com/DaniilAzarov123/Rocks_Database/main/Rocks480/'; // rock database
const consent_file = source_folder + 'consent.html';
const stim_table_file = source_folder + 'stimuli_320_I_S.csv'


// Display
const img_size = 300; // image size (px)
const caption_font_size = 35; // for captions under images (question & feedback)
const instructions_font_size = 20; // for instructions
const text_max_width = 760; // max width of the text on the screen

// Experiment structure
const n_study_blocks = 8; // n repetitions of each object
const study_img_per_cat = 10; // how many study images come from each category?
const total_items_per_cat = 16; // how many images are there per category total (in data base)?
const n_cat = 2; // number of categories to be tested
const cat_2_offset = 160; // smallest image_id for the second category 
                            // (if there are 3 categories - need offset for cat 3, too)
const n_unique_study_img = n_cat * study_img_per_cat; // n of unique study images
const total_study_img = n_study_blocks * n_unique_study_img; // total number of study images

const feedback_dur = 1000;

// Timing
const isi = 500; // inter-stimulus interval
const warn_slow_resp = 7000; // warn participants if they make very slow responses
const warn_fast_resp = 250; // warn participants if they make very fast responses
const warn_dur = 4000;