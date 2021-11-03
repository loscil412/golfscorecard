
function captureAndCalculateStrokes(TOTAL_COURSE_PAR=99) {

    console.log("Checking scope ---");
    console.log("SELECTED_COURSE -- ", SELECTED_COURSE);
    console.log("NUMBER_OF_HOLES -- ", NUMBER_OF_HOLES);
    console.log("NUMBER_OF_HOLES -- ", NUMBER_OF_HOLES);
    console.log("totalCoursePar -- ", totalCoursePar);
    console.log("TOTAL_COURSE_PAR -- ", TOTAL_COURSE_PAR);
    console.log("NUMERIC_REGEX -- ", NUMERIC_REGEX);

    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector
    let rowOfPutts = document.querySelectorAll("input[id^='putt-']"); // a regex like selector
    let rowOfSgs = document.querySelectorAll("input[id^='sgs-']"); // a regex like selector
    
    let scoreToCapture;
    let boxWithInput;
    let indexOfBoxWithScore;
    let lengthOfScoreCardStrokeDataArray = Object.keys(SELECTED_COURSE.holes).length;

    /**
     * Rather than track multiple array objects
     * The score card will be one object
     * ScoreCard : {
     *  Date:
     *  Course: 
     *  CoursePar: 
     *  StrokeData: [
     *     {
     *      HoleNbr : {
     *          Par: x,
     *          Strokes: x,
     *          Putts: x,
     *          SGSShots: x,
     *          GIR: function(){
     *              if (Par == 4 && ((Strokes < 4 && Putts != 0) || (Strokes - Putts < 2.5))) true
     *              else if (Par == 5 && ((Strokes < 5 && Putts != 0) || (Strokes - Putts < 3.5))) true
     *              else if ( Par == 3 && ((Strokes < 3 && Putts != 0) || (Strokes == 3 && Putts == 2))) true
     *              else false
     *          }
     *      }, ...
    *      }
     *  ],
     *  GIRs: x,
     *  TotalStrokes: x,
     * 
     * }
     */

    let scoreCard = {
        Course: SELECTED_COURSE.name,
        Date: new Date().getYear(),
        CoursePar: 0,
        StrokeData: [],
        Greens: 0,
        TotalStrokes: 0,
        TotalPuts: 0,
        ShortGameHcp: 0
    }

    for (let i = 0 ; i < lengthOfScoreCardStrokeDataArray; i++){
        scoreCard.StrokeData.push(
            {
                Par: SELECTED_COURSE.holes[i+1],
                Strokes: 0,
                Putts: 0,
                SgsStrokes: 0,
                Gir: false
            }
        )
    }

    console.log(scoreCard);
    let userStrokesArr = [];
    let userPuttsArr = [];
    let userShortGameArr = [];
    initializeUserStrokeArray();

    rowOfScores.forEach( (element) => {
        makeActive(element);
        makeInactive(element, 'Strokes');

    });

    rowOfPutts.forEach( (element) => {
        makeActive(element);
        makeInactive(element, 'Putts');
    });

    rowOfSgs.forEach( (element) => {
        makeActive(element);
        makeInactive(element, 'SgsStrokes');
    });

    /**
     * When a box is active for user input, 
     * make it pink
     * capture the index of the box to modify the scoreCard.StrokeData array
     * @param {*} element 
     */
    function makeActive(element){
        element.addEventListener('focusin', (event) => {
            event.target.style.background = 'pink';
            boxWithInput = document.activeElement;
            let lastTwoChars = (boxWithInput.getAttribute("id").length) - 2;
            indexOfBoxWithScore = ((boxWithInput.getAttribute("id")).substring(lastTwoChars)) - 1; // I have the INDEX of the value
        })
    }

   /**
    * On exiting a box, check if the box already has a score
    * no? try to add score -- yes? do nothing
    * @param {*} element 
    * @param {String} strokeDataElement attribute for scoreCard.StrokeData array
    */
    function makeInactive(element, strokeDataElement){
        element.addEventListener('focusout', (event) => {
            scoreToCapture = boxWithInput.value;
            if (!isStrokeRecorded(scoreToCapture, strokeDataElement)) {
                addStroke(scoreToCapture, event.target, strokeDataElement);
            }
            event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], scoreCard.StrokeData[indexOfBoxWithScore]['Par']);
            sumScores();    

            // debug("FOCUS-OUT event: ")
            console.log(scoreCard)
        });    
    }

    /**
     * reset scores on click of a button
     */
    document.getElementById("sr").addEventListener("click", () => {
        let dataAttributes = ['Strokes', 'Putts', 'SgsStrokes']
        for (let i = 0; i < lengthOfScoreCardStrokeDataArray; i++){
            for (let j = 0; j < dataAttributes.length; j++){
                scoreCard.StrokeData[i][dataAttributes[j]] = '';
            }
            rowOfScores[i].style.background = ''; 
            rowOfScores[i].value = '';    
            rowOfPutts[i].style.background = '';
            rowOfPutts[i].value = '';    
            rowOfSgs[i].style.background = '';
            rowOfSgs[i].value = '';    
        }
        sumScores();
    });
   
    /**
     * Is the received score different from the already stored score?
     * @param {*} existingScore 
     * @returns boolean
     */
    function isStrokeRecorded(existingScore, strokeDataElement){
        return (scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] == existingScore);
        return (userStrokesArr[indexOfBoxWithScore] == existingScore);
    }

    /**
     * Sanitize the input with empty string check
     * (empty strings are stored as '0' in userStrokeArray) 
     * strings are not stored and reset to "" in visible score card
     * @param {*} score 
     */
    function addStroke(score, targetEvent, strokeDataElement){
        console.log('------- ', targetEvent)
        console.log('--score?  ', score)

        if (score == "") {
            scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] = 0;
        } else {
            if (NUMERIC_REGEX.test(score)) {
                scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] = score * 1;
                console.log();
            } else {
                scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] = 0;
                targetEvent.value = "";            
            }    
        }
    }

    function colorizeStrokeToParRelation(userStrokes, holePar){
        if (userStrokes == 0) { return ''; }
        if (userStrokes < holePar) { return 'lightgreen'; }
        if (userStrokes == holePar) { return 'cyan'; }
        // if (userStrokes > holePar) { return 'red'; }
        if (userStrokes > holePar) { return bogey(userStrokes, holePar); }
    }

    /**
     * Make a shaded pattern for severity of bogeys.
     * If background is too dark, make the FORE-GROUND FONT WHITE
     * @param {*} strokes 
     * @param {*} par 
     * @returns 
     */
    function bogey(strokes, par){
        if (strokes - par == 1) { return `rgb(26,163,255)`;} 
        if (strokes - par == 2) { return `rgb(0,122,204)`;}
        return `rgb(0,107,179)`;
    }


    function sumScores(){
        let totUserStrokes = 0;
        let totUserPutts = 0;
        scoreCard.StrokeData.forEach(score => {
            totUserStrokes += score.Strokes
            totUserPutts += score.Putts
        })
        displayTotalScores();
        
        function displayTotalScores(){
            document.getElementById("totUserScore").innerText = totUserStrokes;
            document.getElementById("totUserScore").style.backgroundColor = colorizeStrokeToParRelation(totUserScore, totalCoursePar);
            document.getElementById("totnbrOfPutts").innerText = totUserPutts;
            document.getElementById("totnbrOfPutts").style.backgroundColor = colorizeStrokeToParRelation(totUserScore, totalCoursePar);    
        }
    }

    function initializeUserStrokeArray(){
        for (var i = 0; i < NUMBER_OF_HOLES; i++){
            userStrokesArr.push('0');
            userPuttsArr.push('0');
            userShortGameArr.push('0');
        }
        console.log("userStrokesArr --> " + userStrokesArr);
    }

    function debug(eventString){
        console.log(eventString + "userStrokesArr --> " + userStrokesArr);
        console.log(eventString + "indexOfBoxWithScore --> " + indexOfBoxWithScore);
        console.log(eventString + "scoreToCapture --> " + scoreToCapture);

    }

}