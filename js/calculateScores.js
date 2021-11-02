
function captureAndCalculateStrokes(TOTAL_COURSE_PAR=99) {

    console.log("Checking scope ---");
    console.log("SELECTED_COURSE -- ", SELECTED_COURSE);
    console.log("NUMBER_OF_HOLES -- ", NUMBER_OF_HOLES);
    console.log("NUMBER_OF_HOLES -- ", NUMBER_OF_HOLES);
    console.log("totalCoursePar -- ", totalCoursePar);
    console.log("TOTAL_COURSE_PAR -- ", TOTAL_COURSE_PAR);
    console.log("NUMERIC_REGEX -- ", NUMERIC_REGEX);

    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector
    let scoreToCapture;
    let boxWithScore;
    let indexOfBoxWithScore;
    let userStrokesArr = [];
    let userPuttsArr = [];
    let userShortGameArr = [];
    initializeUserStrokeArray();

    /**
     * get the attribute id of the box we're in
     * remove 'score-' for index nbr to call on userStrokesArr
     * userStrokesArr is 0 indexed
    */
    rowOfScores.forEach( (element) => {
        element.addEventListener('focusin', (event) => {
            event.target.style.background = 'pink';
            boxWithScore = document.activeElement;


            indexOfBoxWithScore = ((boxWithScore.getAttribute("id")).substring(6) * 1) - 1;
            // debug("FOCUS-IN event: ");
        });    
    });



    /**
     * check if the box already has a score
     *  no? try to add score
     *  yes? do nothing
    */
    rowOfScores.forEach( (element) => {
        element.addEventListener('focusout', (event) => {
            scoreToCapture = boxWithScore.value;
            if (!isStrokeRecorded(scoreToCapture)) {
                addStroke(scoreToCapture, event.target);
            }
            event.target.style.background = colorizeStrokeToParRelation(userStrokesArr[indexOfBoxWithScore], SELECTED_COURSE.holes[(indexOfBoxWithScore + 1)]);
            sumScores();    

            // debug("FOCUS-OUT event: ")
        });    
    });

    /**
     * reset scores on click of a button
     */
    document.getElementById("sr").addEventListener("click", function() {
        for (let i = 0; i < userStrokesArr.length; i++){
            userStrokesArr[i] = 0;
            rowOfScores[i].style.background = ''; 
            rowOfScores[i].value = '';
        }
        sumScores();
    });
   
    /**
     * Is the received score different from the already stored score?
     * @param {*} existingScore 
     * @returns boolean
     */
    function isStrokeRecorded(existingScore){
        return (userStrokesArr[indexOfBoxWithScore] == existingScore);
        if (userStrokesArr[indexOfBoxWithScore] != existingScore) { return false; }
        else return true;
    }

    /**
     * Sanitize the input with empty string check
     * (empty strings are stored as '0' in userStrokeArray) 
     * strings are not stored and reset to "" in visible score card
     * @param {*} score 
     */
    function addStroke(score, targetEvent){
        if (score == "") {
            userStrokesArr[indexOfBoxWithScore] = 0;
        } else {
            if (NUMERIC_REGEX.test(score)) {
                userStrokesArr[indexOfBoxWithScore] = score;
                console.log(userStrokesArr);
            } else {
                userStrokesArr[indexOfBoxWithScore] = 0;
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
        let totUserScore = 0;
        userStrokesArr.forEach(score => totUserScore += score * 1);
        document.getElementById("totUserScore").innerText = totUserScore;
        document.getElementById("totUserScore").style.backgroundColor = colorizeStrokeToParRelation(totUserScore, totalCoursePar);
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