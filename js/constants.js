const ADD_COLUMNS = 2; // display-legends on left, totals on right
const NUMERIC_REGEX = /^[\d]+$/;
const PAR_PUTTS_PER_HOLE = 2
const PAR_SGS_PER_HOLE = 1
const BOGEY_COLOR = `rgb(255, 136, 17)` // bogey
const DOUBLE_BOGEY_COLOR =  `rgb(244, 86, 42)`// double bogey
const TRIPLE_BOGEY_AND_WORSE = `rgb(238, 27, 38)` // triple_bogey+
const EAGLE_AND_BETTER_COLOR = 'rgb(59, 152, 38)' // slimy green
const BIRDIE_COLOR = 'rgb(134, 191, 49)' // birdie
const PEWTER_BLUE = 'rgb(119, 156, 171)' // pewter_blue
const GHOST_WHITE = 'rgb(247, 247, 255)' // ghost_white
const SCORE_CARD_STROKE_PER_HOLE = 'strokes'
const SCORE_CARD_PUTTS_PER_HOLE = 'putts'
const SCORE_CARD_SGS_STROKES_PER_HOLE = 'sgs_strokes'
const SCORE_CARD_HOLE_PAR = 'par'
const SCORE_CARD_TOTAL_USER_STROKES = 'total_strokes_played'
const SCORE_CARD_TOTAL_USER_PUTTS = 'total_putts'
const SCORE_CARD_SHORT_GAME_HCP = 'short_game_hcp'
const SCORE_CARD_TOTAL_GREENS_IN_REG = 'greens_in_reg'

let isFontColorWhite = false; // boolean flag for fonts on dark backgrounds



let SELECTED_COURSE; 
let nbrOfCourseHoles;
let scorecardTable;
let nbrOfColumns;
let totalCoursePar = 0;
let indexOfBoxWithScore;
let scoreCard;
