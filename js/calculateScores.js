
function captureAndCalculateStrokes() {
    const regex = /^[\d]+$/;
    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector
    let scoreToCapture;
    let boxWithScore;
    let indexOfBoxWithScore;
    let userStrokesArr = [];
    initializeUserStrokeArray();

    rowOfScores.forEach( (element) => {
        element.addEventListener('focusin', (event) => {
            event.target.style.background = 'pink';
            boxWithScore = document.activeElement;
            /**
             * get the attribute id of the box we're in
             * remove 'score-' for index nbr to call on userStrokesArr
             * userStrokesArr is 0 indexed
             */
            indexOfBoxWithScore = ((boxWithScore.getAttribute("id")).substring(6) * 1) - 1;
            // debug("FOCUS-IN event: ");
        });    
    });

    rowOfScores.forEach( (element) => {
        element.addEventListener('focusout', (event) => {
            event.target.style.background = '';
            scoreToCapture = boxWithScore.value;
            /**
             * check if the box already has a score
             *  no? try to add score
             *  yes? do nothing
             */
            if (!isStrokeRecorded(scoreToCapture)) {
                addStroke(scoreToCapture);
            }
            // debug("FOCUS-OUT event: ")
        });    
    });

    // TODO: do not let the scoreCard keep non-numeric strings visible
    
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
     * Sanitize the input with empty string check  -- (empty strings are stored as '0' in userStrokeArray) 
     * @param {*} score 
     */
    function addStroke(score){
        if (score == "") {
            userStrokesArr[indexOfBoxWithScore] = 0;
        } else {
            if (regex.test(score)) {
                userStrokesArr[indexOfBoxWithScore] = score;
                console.log(userStrokesArr);
            }    
        }
        sumScores();    
    }

    function sumScores(){
        let totUserScore = 0;
        userStrokesArr.forEach(score => totUserScore += score * 1);
        document.getElementById("totUserScore").innerText = totUserScore;
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

