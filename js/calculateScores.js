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
    *  GreensInRegulation: x,
    *  TotalStrokes: x,
    *  TotalPutts: x,
    *  SgsHcp: x.x
    * 
    * }
    */

function captureAndCalculateStrokes(TOTAL_COURSE_PAR=99) {

    console.log("Checking scope ---");
    console.log("SELECTED_COURSE -- ", SELECTED_COURSE);
    console.log("nbrOfCourseHoles -- ", nbrOfCourseHoles);
    console.log("totalCoursePar -- ", totalCoursePar);
    console.log("TOTAL_COURSE_PAR -- ", TOTAL_COURSE_PAR);

    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector, returns an array
    let rowOfPutts = document.querySelectorAll("input[id^='putt-']"); // a regex like selector, returns an array
    let rowOfSgs = document.querySelectorAll("input[id^='sgs-']"); // a regex like selector, returns an array
    
    let scoreToCapture;
    let boxWithInput;
    let indexOfBoxWithScore;
    let lengthOfScoreCardStrokeDataArray = Object.keys(SELECTED_COURSE.holes).length;
    let parPuttsPerCourse = nbrOfCourseHoles * PAR_PUTTS_PER_HOLE;
    let parSgsPerCourse = nbrOfCourseHoles * PAR_SGS_PER_HOLE;
    
    let scoreCard = {
        Course: SELECTED_COURSE.name,
        Date: new Date().getYear(),
        CoursePar: 0,
        StrokeData: [],
        GreensInRegulation: 0,
        TotalStrokes: 0,
        TotalPutts: 0,
        ShortGameHcp: 0,
        Create_Time: Date.now()
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

    console.log(scoreCard)
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
            event.target.style.background = 'rgb(128, 191, 255)';
            // event.target.style.background = 'pink';
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
            switch (strokeDataElement){
                case 'Strokes':
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], scoreCard.StrokeData[indexOfBoxWithScore]['Par']);
                    break;

                case 'Putts':
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], PAR_PUTTS_PER_HOLE);
                    break;
                
                case 'SgsStrokes':
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], PAR_SGS_PER_HOLE);
                    break;
                
                default:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement], scoreCard.StrokeData[indexOfBoxWithScore]['Par']);
            }
            sumScores();    
            // console.log(scoreCard)
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
    }

    /**
     * Sanitize the input with empty string check
     * (empty strings are stored as '0' in userStrokeArray) 
     * strings are not stored and reset to "" in visible score card
     * @param {*} score 
     */
    function addStroke(score, targetEvent, strokeDataElement){
        // console.log('------- ', targetEvent)
        // console.log('--score?  ', score)

        if (score == "") {
            scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] = 0;
        } else {
            if (NUMERIC_REGEX.test(score)) {
                scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] = score * 1;
            } else {
                scoreCard.StrokeData[indexOfBoxWithScore][strokeDataElement] = 0;
                targetEvent.value = "";            
            }    
        }
    }

    function colorizeStrokeToParRelation(userStrokes, par){
        if (userStrokes == 0) { return ''; }
        if (userStrokes < par) { return LIGHT_GREEN; }
        if (userStrokes == par) { return ''; }
        // if (userStrokes > par) { return 'red'; }
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


    function sumScores(){
        let totUserStrokes = 0;
        let totUserPutts = 0;
        let totUserSgs = 0;
        let totGirs = 0;
        let nbrOfHolesForSgsHcp = 0;
        let totalSgsStrokes_putts_plus_wedge = 0;
        let sgsHcp = 0;

        // looping through the scoreCard.StrokeData object
        scoreCard.StrokeData.forEach((score, i) => {
            if (i < 9) { 
                i = '0' + (i + 1) 
            } else i = i + 1;

            totUserStrokes += score.Strokes
            totUserPutts += score.Putts
            totUserSgs += score.SgsStrokes
            calculateSgsHcp(score); // calculate here? or when card is fully tallied?
            score.Gir = determineGir(score)
            if (score.Gir) {
                totGirs += 1
                document.getElementById("gir-" + i).defaultValue = 'X';
            } else document.getElementById("gir-" + i).defaultValue = '';

        })
        updateScoreCardObject();
        displayTotalScores();

        function determineGir(score){
            if (score.Strokes == 0) return false; // edge case for the sumScore() loop
            if (score.Putts == 0 && (score.Par == score.Strokes || score.Par - score.Strokes == 1)) return false; // saving chip-ins off the green
            if (score.Strokes < score.Par) return true; // birdie with a putt or chip-ins for eagle or hole-in-one
            
            switch (score.Par) {
                case 3:
                    if (score.Strokes - score.Putts == 1) return true; // one on and however many putts into hole
                    break;            
                case 4:
                    if (score.Strokes - score.Putts <= 2) return true; // two on and however may putts into hole   
                    break;
                case 5:
                    if (score.Strokes - score.Putts <= 3) return true; // three on and however may putts into hole   
                    break;
                default:
                    return false; // only default if par is < 3 or par > 5....
            }
            // default to false if switches are captured but not matched to logic
            return false;      
        }
    
        function calculateSgsHcp(score){
            if (score.SgsStrokes != 0) {
                nbrOfHolesForSgsHcp += 1
                totalSgsStrokes_putts_plus_wedge += (score.SgsStrokes + score.Putts) // this is dependent on Putts being entered first?
            }
            if (nbrOfHolesForSgsHcp != 0) {
                sgsHcp = (totalSgsStrokes_putts_plus_wedge / nbrOfHolesForSgsHcp).toFixed(2);
            } else sgsHcp = "Not Calculated"

        }

        function updateScoreCardObject(){
            scoreCard.TotalStrokes = totUserStrokes;
            scoreCard.TotalPutts = totUserPutts;
            scoreCard.GreensInRegulation = totGirs;
            scoreCard.ShortGameHcp = sgsHcp;
        }

        function displayTotalScores(){
            document.getElementById("totUserScore").innerText = totUserStrokes;
            document.getElementById("totUserScore").style.background = colorizeStrokeToParRelation(totUserStrokes, totalCoursePar);
            document.getElementById("totnbrOfPutts").innerText = totUserPutts;
            document.getElementById("totnbrOfPutts").style.background = colorizeStrokeToParRelation(totUserPutts, parPuttsPerCourse);    
            document.getElementById("totshortGame").innerText = sgsHcp;
            // document.getElementById("totshortGame").style.background = colorizeStrokeToParRelation(totUserSgs, parSgsPerCourse);    
            document.getElementById("totgir").innerText = totGirs;
            // document.getElementById("totgir").style.background = colorizeStrokeToParRelation(totGirs, nbrOfCourseHoles);    
        }

    }



}