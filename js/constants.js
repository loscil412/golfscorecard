const ADD_COLUMNS = 2; // display-legends on left, totals on right
const NUMERIC_REGEX = /^[\d]+$/;
const PAR_PUTTS_PER_HOLE = 2
const PAR_SGS_PER_HOLE = 1
const LIGHT_RED = `rgb(255, 153, 153)`
const DARK_RED = `rgb(255, 51, 51)`
const ORANGE = `rgb(255, 153, 51)`
const LIGHT_GREEN = 'lightgreen'
const LIGHT_BLUE = 'rgb(128, 191, 255)'
let SELECTED_COURSE; 
let nbrOfCourseHoles;
let scorecardTable;
let nbrOfColumns;
let totalCoursePar = 0;
let indexOfBoxWithScore;
let scoreCard;
