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
 *          SGSShots: x,
 *          GIR: boolean
 *          }
 *      }, ...
*      }
    *  ],
    *  greens_in_reg: x,
    *  total_strokes_played: x,
    *  total_putts: x,
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
        makeInactive(element, 'strokes');

    });

    rowOfPutts.forEach( (element) => {
        makeActive(element);
        makeInactive(element, 'putts');
    });

    rowOfSgs.forEach( (element) => {
        makeActive(element);
        makeInactive(element, 'sgs_strokes');
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
                case 'strokes':
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], scoreCard.stroke_data[indexOfBoxWithScore]['par']);
                    break;

                case 'putts':
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], PAR_PUTTS_PER_HOLE);
                    break;
                
                case 'sgs_strokes':
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], PAR_SGS_PER_HOLE);
                    break;
                
                default:
                    event.target.style.background = colorizeStrokeToParRelation(scoreCard.stroke_data[indexOfBoxWithScore][strokeDataElement], scoreCard.stroke_data[indexOfBoxWithScore]['par']);
            }
            sumScores();    
            // console.log(scoreCard)
        });    
    }

    /**
     * reset scores on click of a button
     */
    document.getElementById("sr").addEventListener("click", () => {
        let dataAttributes = ['strokes', 'putts', 'sgs_strokes']
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
        }
        sumScores();
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


    function sumScores(){
        let totUserStrokes = 0;
        let totUserPutts = 0;
        let totUserSgs = 0;
        let totGirs = 0;
        let nbrOfHolesForSgsHcp = 0;
        let totalSgsStrokes_putts_plus_wedge = 0;
        let sgsHcp = 0;

        // looping through the scoreCard.stroke_data object
        scoreCard.stroke_data.forEach((hole_data, i) => {
            if (i < 9) { 
                i = '0' + (i + 1) 
            } else i = i + 1;

            totUserStrokes += hole_data.strokes
            totUserPutts += hole_data.putts
            totUserSgs += hole_data.sgs_strokes
            calculateSgsHcp(hole_data); // calculate here? or when card is fully tallied?
            hole_data.gir = determineGir(hole_data)
            if (hole_data.gir) {
                totGirs += 1
                document.getElementById("gir-" + i).defaultValue = 'X';
            } else document.getElementById("gir-" + i).defaultValue = '';

        })
        updateScoreCardObject();
        displayTotalScores();

        function determineGir(hole_data){
            if (hole_data.strokes == 0) return false; // edge case for the sumScore() loop
            if (hole_data.putts == 0 && (hole_data.par == hole_data.strokes || hole_data.par - hole_data.strokes == 1)) return false; // saving chip-ins off the green
            if (hole_data.strokes < hole_data.par) return true; // birdie with a putt or chip-ins for eagle or hole-in-one
            
            switch (hole_data.par) {
                case 3:
                    if (hole_data.strokes - hole_data.putts == 1) return true; // one on and however many putts into hole
                    break;            
                case 4:
                    if (hole_data.strokes - hole_data.putts <= 2) return true; // two on and however may putts into hole   
                    break;
                case 5:
                    if (hole_data.strokes - hole_data.putts <= 3) return true; // three on and however may putts into hole   
                    break;
                default:
                    return false; // only default if par is < 3 or par > 5....
            }
            // default to false if switches are captured but not matched to logic
            return false;      
        }
    
        function calculateSgsHcp(hole_data){
            if (hole_data.sgs_strokes != 0) {
                nbrOfHolesForSgsHcp += 1
                totalSgsStrokes_putts_plus_wedge += (hole_data.sgs_strokes + hole_data.putts) // this is dependent on putts being entered first?
            }
            if (nbrOfHolesForSgsHcp != 0) {
                // sgsHcp = (totalSgsStrokes_putts_plus_wedge / nbrOfHolesForSgsHcp).toFixed(2); // decimal
                sgsHcp = getGcd(totalSgsStrokes_putts_plus_wedge, nbrOfHolesForSgsHcp); // fraction
            } else sgsHcp = "Not Calculated"

        }

        /*
        A modification to Euclid's theory for finding GCD?
        End goal is to return 19 / 7 = 2.714285.. as 2 5/7 fraction
        1. Extract the big number
        2. find GCD from the decimal value and display as fraction
        Example --- 16 total strokes, over 6 holes
        16/6 decimal == 2.6666667 (other methods I find will return 6666667/10000000 ... not helpful)
        16/6 fraction == 2 2/3
        1. divide and capture the ones spot without rounding (2)
        2. then mod 16 % 6 (4) <-- if this remainder is 0 we have no fraction to return and stop here, returning the simple division (i.e. 12/4 = 3.0)
        3. now we find the GCD for 6 & 4
        4. Once found 'actual_gcd' we get the solutions to 4/actual_gcd and 6/actual_gcd respectively as numerator and denominator for the fraction

        */
        function getGcd(combinedPutts_Sgs, nbr_of_holes_sgs_played){
            let _remainder = combinedPutts_Sgs % nbr_of_holes_sgs_played; // 16 % 6 = 4
            if (_remainder == 0) { return combinedPutts_Sgs/nbr_of_holes_sgs_played } // 4

            let big_nbr = Math.floor(combinedPutts_Sgs/nbr_of_holes_sgs_played); // i.e. 16/6 = 2
            let a = nbr_of_holes_sgs_played // a should be the larger value (i.e. # of strokes) [6]
            let copy_of_a = a
            let b = _remainder // b should be the smaller value (i.e. # of holes) [4]
            let copy_of_b = b
            let _gcd = b + 1        // there is a cleaner way I'm sure, but this works to avoid infinite while loops
            let actual_gcd;         // the gcd for the remaining fractional decimals -- will be 2 for the example values
            while (_gcd != 1) {     // once b = 0, _gcd will be 1
                while (_gcd > b) {  // 5 > 4, 2 !> 4 -- 3 > 2, 2 !> 2 -- 3 > 2 , 0 !> 2
                    _gcd = a-b      // 2 = 6-4 -------- 2 = 4-2, ------- 0 = 2-2 ------          
                    a = _gcd        // a = 2 ---------- a = 2, --------- a = 0   ------
                }
                a = b               // ..... a = 4 ............ a = 2 ........... a = 2
                b = _gcd            // ..... b = 2 ............ b = 2 ........... b = 0
                _gcd = b+1          // ..... _gcd = 3 .......... _gcd=3 ......... _gcd = 1 <-- breaks the bounding while loop
            }
            actual_gcd = a                           // actual_gcd = 2
            let numerator = copy_of_b / actual_gcd   // 2 = 4 / 2
            let denominator = copy_of_a / actual_gcd // 3 = 6 / 2
            return `${big_nbr} ${numerator}/${denominator}` // 2 2/3
        }

        function updateScoreCardObject(){
            scoreCard.total_strokes_played = totUserStrokes;
            scoreCard.total_putts = totUserPutts;
            scoreCard.greens_in_reg = totGirs;
            scoreCard.short_game_hcp = sgsHcp;
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