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
    
    let sc = new ScoreCard()
    console.log('sc class --> ', sc)

    let scoreCard = {
        course: SELECTED_COURSE.name,
        Date: new Date().getYear(),
        course_par: SELECTED_COURSE.coursePar,
        stroke_data: [],
        greens_in_reg: 0,
        total_strokes_played: 0,
        total_putts: 0,
        short_game_hcp: 0,
        create_time: Date.now()
    }

    for (let i = 0 ; i < lengthOfScoreCardStrokeDataArray; i++){
        scoreCard.stroke_data.push(
            {
                par: SELECTED_COURSE.holes[i+1],
                strokes: 0,
                putts: 0,
                sgs_strokes: 0,
                gir: false
            }
        )
    }

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
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], scoreCard.StrokeData[indexOfBoxWithScore][SCORE_CARD_HOLE_PAR]);
                    break;

                case SCORE_CARD_PUTTS_PER_HOLE:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], PAR_PUTTS_PER_HOLE);
                    break;
                
                case SCORE_CARD_SGS_STROKES_PER_HOLE:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], PAR_SGS_PER_HOLE);
                    break;
                
                default:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], scoreCard.StrokeData[indexOfBoxWithScore][SCORE_CARD_HOLE_PAR]);
            }
            sumScores(scoreCard);  
            displayTotalScores();  
            // console.log(scoreCard)
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

        sumScores();
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
        // console.log('------- ', targetEvent)
        // console.log('--hole_data?  ', hole_data)

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

    function displayTotalScores(){
        document.getElementById("totUserScore").innerText = scoreCard.TotalStrokes;
        document.getElementById("totUserScore").style.background = colorizeStrokeToParRelation(scoreCard.TotalStrokes, totalCoursePar);
        document.getElementById("totnbrOfPutts").innerText = scoreCard.TotalPutts;
        document.getElementById("totnbrOfPutts").style.background = colorizeStrokeToParRelation(scoreCard.TotalPutts, parPuttsPerCourse);    
        document.getElementById("totshortGame").innerText = scoreCard.ShortGameHcp;
        // document.getElementById("totshortGame").style.background = colorizeStrokeToParRelation(totUserSgs, parSgsPerCourse);    
        document.getElementById("totgir").innerText = scoreCard.GreensInRegulation;
        // document.getElementById("totgir").style.background = colorizeStrokeToParRelation(totGirs, nbrOfCourseHoles);    
    }
}