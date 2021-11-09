/**
 * Rather than track multiple array objects
 * The hole_data card will be one object
 * ScoreCard : {
 *  Date:
 *  course: 
 *  course_par: 
 *  stroke_data: [
 *     {
 *      HoleNbr : {
 *          par: x,
 *          strokes: x,
 *          putts: x,
 *          sgs_strokes: x,
 *          gir: boolean
 *          }
 *      }, ...
 *      }
 *  ],
 *  greens_in_reg: x,
 *  total_strokes_played: x,
 *  total_putts: x,
 *  short_game_hcp: x.x
 * 
 * }
*/
import { determineGir, sumScores } from "../js/calculations.js"

export function captureAndCalculateStrokes(TOTAL_COURSE_PAR=99) {

    console.log("Checking scope ---");
    console.log("SELECTED_COURSE -- ", SELECTED_COURSE);
    console.log("nbrOfCourseHoles -- ", nbrOfCourseHoles);
    console.log("totalCoursePar -- ", totalCoursePar);
    console.log("TOTAL_COURSE_PAR -- ", TOTAL_COURSE_PAR);

    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector, returns an array
    let rowOfPutts = document.querySelectorAll("input[id^='putt-']"); // a regex like selector, returns an array
    let rowOfSgs = document.querySelectorAll("input[id^='sgs-']"); // a regex like selector, returns an array
    let rowOfGirs = document.querySelectorAll("input[id^='gir-']"); // a regex like selector, returns an array
    
    let scoreToCapture;
    let boxWithInput;
    let indexOfBoxWithScore;
    let lengthOfScoreCardStrokeDataArray = Object.keys(SELECTED_COURSE.holes).length;
    let parPuttsPerCourse = nbrOfCourseHoles * PAR_PUTTS_PER_HOLE;
    let parSgsPerCourse = nbrOfCourseHoles * PAR_SGS_PER_HOLE;
    
    let scoreCard = new ScoreCard()

    console.log(scoreCard)
    rowOfScores.forEach( (element) => {
        makeActive(element);
        makeInactive(element, SCORE_CARD_STROKE_PER_HOLE);

    });

    rowOfPutts.forEach( (element) => {
        makeActive(element);
        makeInactive(element, SCORE_CARD_PUTTS_PER_HOLE);
    });

    rowOfSgs.forEach( (element) => {
        makeActive(element);
        makeInactive(element, SCORE_CARD_SGS_STROKES_PER_HOLE);
    });

    /**
     * When a box is active for user input, 
     * make it pink
     * capture the index of the box to modify the scoreCard.stroke_data array
     * @param {*} element 
     */
    function makeActive(element){
        element.addEventListener('focusin', (event) => {
            event.target.style.background = LIGHT_BLUE;
            boxWithInput = document.activeElement;
            let lastTwoChars = (boxWithInput.getAttribute("id").length) - 2;
            indexOfBoxWithScore = ((boxWithInput.getAttribute("id")).substring(lastTwoChars)) - 1; // I have the INDEX of the value
        })
    }

   /**
    * On exiting a box, check if the box already has a hole_data
    * no? try to add hole_data -- yes? do nothing
    * @param {*} element 
    * @param {String} strokeDataElement attribute for scoreCard.stroke_data array
    */
    function makeInactive(element, strokeDataElement){
        element.addEventListener('focusout', (event) => {
            scoreToCapture = boxWithInput.value;
            if (!isStrokeRecorded(scoreToCapture, strokeDataElement)) {
                addStroke(scoreToCapture, event.target, strokeDataElement);
            }
            switch (strokeDataElement){
                case SCORE_CARD_STROKE_PER_HOLE:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], scoreCard.stroke_data[indexOfBoxWithScore][SCORE_CARD_HOLE_PAR]);
                    break;

                case SCORE_CARD_PUTTS_PER_HOLE:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], PAR_PUTTS_PER_HOLE);
                    break;
                
                case SCORE_CARD_SGS_STROKES_PER_HOLE:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], PAR_SGS_PER_HOLE);
                    break;
                
                default:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], scoreCard.stroke_data[indexOfBoxWithScore][SCORE_CARD_HOLE_PAR]);
            }
            sumScores(scoreCard);  
            displayGir();
            displayTotalScores();  
        });    
    }

    /**
     * reset scores on click of a button
     */
    document.getElementById("sr").addEventListener("click", () => {
        let dataAttributes = [SCORE_CARD_STROKE_PER_HOLE, SCORE_CARD_PUTTS_PER_HOLE, SCORE_CARD_SGS_STROKES_PER_HOLE]
        for (let i = 0; i < lengthOfScoreCardStrokeDataArray; i++){
            for (let j = 0; j < dataAttributes.length; j++){
                scoreCard.stroke_data[i][dataAttributes[j]] = '';
            }
            rowOfScores[i].style.background = ''; 
            rowOfScores[i].value = '';    
            rowOfPutts[i].style.background = '';
            rowOfPutts[i].value = '';    
            rowOfSgs[i].style.background = '';
            rowOfSgs[i].value = '';   
            rowOfGirs[i].style.background = '';
            rowOfGirs[i].value = ''; 
        }
        scoreCard = new ScoreCard()
        displayTotalScores();  
    });
   
    /**
     * Is the received hole_data different from the already stored hole_data?
     * @param {*} existingScore 
     * @returns boolean
     */
    function isStrokeRecorded(existingScore, strokeDataElement){
        return (scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement] == existingScore);
    }

    /**
     * Sanitize the input with empty string check
     * (empty strings are stored as '0' in userStrokeArray) 
     * strings are not stored and reset to "" in visible hole_data card
     * @param {*} hole_data 
     */
    function addStroke(hole_data, targetEvent, strokeDataElement){
        if (hole_data == "") {
            scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement] = 0;
        } else {
            if (NUMERIC_REGEX.test(hole_data)) {
                scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement] = hole_data * 1;
            } else {
                scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement] = 0;
                targetEvent.value = "";            
            }    
        }
    }

    function colorizeStrokeToParRelation(userStrokes, par){
        if (userStrokes == 0) { return ''; }
        if (userStrokes < par) { return LIGHT_GREEN; }
        if (userStrokes == par) { return ''; }
        if (userStrokes > par) { return bogey(userStrokes, par); }
    }

    /**
     * Make a shaded pattern for severity of bogeys.
     * If background is too dark, make the FORE-GROUND FONT WHITE
     * @param {*} strokes 
     * @param {*} par 
     * @returns an rgb color
     */
    function bogey(strokes, par){
        if (strokes - par == 1) return LIGHT_RED; 
        if (strokes - par == 2) return ORANGE; 
        return DARK_RED; 
    }

    function displayGir(){
        scoreCard.stroke_data.forEach ((score, i) => {
            if (i < 9) { 
                i = '0' + (i + 1) 
            } else i = i + 1;
            if (score.gir) {
                let girBox = document.getElementById("gir-" + i)
                document.getElementById("gir-" + i).defaultValue = 'X';
                console.log(document.getElementById("gir-" + i));
    
            } else  {
                document.getElementById("gir-" + i).defaultValue = '';
                console.log(document.getElementById("gir-" + i));
            }
        });
    }

    function displayTotalScores(){
        document.getElementById("totUserScore").innerText = scoreCard[SCORE_CARD_TOTAL_USER_STROKES];
        document.getElementById("totUserScore").style.background = colorizeStrokeToParRelation(scoreCard[SCORE_CARD_TOTAL_USER_STROKES], totalCoursePar);
        document.getElementById("totnbrOfPutts").innerText = scoreCard[SCORE_CARD_TOTAL_USER_PUTTS];
        document.getElementById("totnbrOfPutts").style.background = colorizeStrokeToParRelation(scoreCard[SCORE_CARD_TOTAL_USER_PUTTS], parPuttsPerCourse);    
        document.getElementById("totshortGame").innerText = scoreCard[SCORE_CARD_SHORT_GAME_HCP];
        // document.getElementById("totshortGame").style.background = colorizeStrokeToParRelation(totUserSgs, parSgsPerCourse);    
        document.getElementById("totgir").innerText = scoreCard[SCORE_CARD_TOTAL_GREENS_IN_REG];
        // document.getElementById("totgir").style.background = colorizeStrokeToParRelation(totGirs, nbrOfCourseHoles);    
    }
}