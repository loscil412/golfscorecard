
function captureAndCalculateStrokes(TOTAL_COURSE_PAR) {
    let coursePar = TOTAL_COURSE_PAR;
    const regex = /^[\d]+$/;
    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector
    let scoreToCapture;
    let boxWithScore;
    let indexOfBoxWithScore;
    let userStrokesArr = [];
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
            // event.target.style.background = '';
            event.target.style.background = colorizeStrokeToParRelation(userStrokesArr[indexOfBoxWithScore], SELECTED_COURSE.holes[(indexOfBoxWithScore + 1)]);
            scoreToCapture = boxWithScore.value;
            if (!isStrokeRecorded(scoreToCapture)) {
                addStroke(scoreToCapture, event.target);
            }
            // debug("FOCUS-OUT event: ")
        });    
    });
   
    /**
     * Is the received score different from the already stored score?
     * @param {*} existingScore 
     * @returns boolean
     */
    function isStrokeRecorded(existingScore){
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
            if (regex.test(score)) {
                userStrokesArr[indexOfBoxWithScore] = score;
                console.log(userStrokesArr);
            } else {
                userStrokesArr[indexOfBoxWithScore] = 0;
                targetEvent.value = "";            
            }    
        }
        targetEvent.style.background = colorizeStrokeToParRelation(userStrokesArr[indexOfBoxWithScore], SELECTED_COURSE.holes[(indexOfBoxWithScore + 1)])
        sumScores();    
    }

    function colorizeStrokeToParRelation(userStrokes, holePar){
        if (userStrokes == 0) { return ''; }
        if (userStrokes < holePar) { return 'lightgreen'; }
        if (userStrokes == holePar) { return 'cyan'; }
        if (userStrokes > holePar) { return 'red'; }
    }

    function sumScores(){
        let totUserScore = 0;
        userStrokesArr.forEach(score => totUserScore += score * 1);
        document.getElementById("totUserScore").innerText = totUserScore;
        document.getElementById("totUserScore").style.backgroundColor = colorizeStrokeToParRelation(totUserScore, coursePar);
    }

    function initializeUserStrokeArray(){
        for (var i = 0; i < NUMBER_OF_HOLES; i++){
            userStrokesArr.push('0');
        }
        console.log("userStrokesArr --> " + userStrokesArr);
    }

    function debug(eventString){
        console.log(eventString + "userStrokesArr --> " + userStrokesArr);
        console.log(eventString + "indexOfBoxWithScore --> " + indexOfBoxWithScore);
        console.log(eventString + "scoreToCapture --> " + scoreToCapture);

    }

}

