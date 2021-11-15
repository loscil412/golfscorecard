import { captureAndCalculateStrokes } from './calculateScores.js'
let menu = document.getElementById("menu")
addCoursesToMenu();

// on change (or select of course) to menu, we draw the correct score card
menu.addEventListener("change", setCourse)

function setCourse(){
    _selectedCourse = COURSE_LIST[(document.querySelector('select').value)]
    document.getElementById("courseSelection").innerHTML = _selectedCourse.name
    document.getElementById("dynamicCourseName").innerText = ": " + _selectedCourse.name
    totalCoursePar = 0
    scoreCard = new ScoreCard();
    drawScoreCard();
    captureAndCalculateStrokes();
}

function getCurrentDate(){
    let msecDate = Date.now();
    let tsDate = new Date(msecDate);
    console.log('tsDate.toISOString -->', tsDate.toISOString().slice(0, 10))
    let currentDate = tsDate.toISOString().slice(0, 10)
    console.log('currentDate --> ', currentDate)
    return currentDate
}

function drawScoreCard(){
    scorecardTable = `<input class="date" type="date" value=${getCurrentDate()}>`

    nbrOfCourseHoles = Object.keys(_selectedCourse.holes).length;
    nbrOfColumns = nbrOfCourseHoles + ADD_COLUMNS;
    // the courseName header
    scorecardTable += `<table><thead id="courseName"><tr><th colspan=${nbrOfColumns}>${_selectedCourse.name}</th></tr></thead>`;
    
    // the hole numbers
    scorecardTable += `<tbody><tr id="holeNumbers"><td id="display-legend">Hole</td>`;
    for (let i = 0; i < nbrOfCourseHoles; i++){
        scorecardTable += `<td id="scrCrdHlNbr">${i + 1}</td>`; // hole number
    }
    scorecardTable += `<td id="display-legend">Totals</td></tr>`

    // the par score per hole
    // let totalCoursePar = 0;
    scorecardTable += `<tr id="coursePar"><td id="display-legend">Par</td>`;
    for (let i = 0; i < nbrOfColumns - ADD_COLUMNS; i++){
        scorecardTable += `<td>${_selectedCourse.holes[i+1]}</td>`; // hole par
        totalCoursePar += _selectedCourse.holes[i+1];
    }
    scorecardTable += `<td id="display-legend">${totalCoursePar}</td></tr>`;

    // add data rows with reuseable function
    addRowToScoreCardTable("UserScore", "Strokes", "score")
    addRowToScoreCardTable("nbrOfPutts", "Putts", "putt")
    addRowToScoreCardTable("shortGame", "SGS", "sgs")
    addRowToScoreCardTable("gir", "GIR", "gir")
    // addGirTracker();

    // GIR DOES NOT NEED USER ENTERED DATA -- NO INPUT BOXES
    function addGirTracker(){
        let idPrepend_Nbr = '';
        scorecardTable += `<tr id="gir"><td id="display-legend">GIR</td>`;
        for (let i = 0; i < nbrOfColumns - ADD_COLUMNS; i++){
            if (i < 9) { 
                idPrepend_Nbr = '0' + (i + 1);
            } else idPrepend_Nbr = i + 1;
    
            scorecardTable += `<td id="gir-${idPrepend_Nbr}>""</td>`; // gir will be either not hit ''or hit X
        }
        scorecardTable += `<td id="totgir"</td></tr>`;
    
    }
/*
 * additional rows of data go here
 * GIR calculator
 * FIR
 * short game HCP
 */
    scorecardTable += "</tbody></table>";
    
    // now the DOM is aware of the scorecard and we are ready to capture user input
    document.getElementById("table").innerHTML = scorecardTable;
    drawResetButton();
    console.log('window? --> ', window)
    console.log('readystate? --> ', document.readyState)
}

/**
 * 
 * @param {String} idName "ShortGame"
 * @param {String} display_legend "SGS"
 * @param {String} idPrepend "sgs"
 */
function addRowToScoreCardTable(idName, display_legend, idPrepend){
    let idPrepend_Nbr = '';
    scorecardTable += `<tr id="${idName}"><td id="display-legend">${display_legend}</td>`
    for (let i = 0; i < nbrOfColumns - ADD_COLUMNS; i++){
        if (i < 9) { 
            idPrepend_Nbr = '0' + (i + 1);
        } else idPrepend_Nbr = i + 1;
        scorecardTable += `<td id="${idName}-${idPrepend_Nbr}"><input class="input-box" type="text" id="${idPrepend}-${idPrepend_Nbr}" size="1"></td>`
    }
    scorecardTable += `<td id="tot${idName}"></td></tr>`
}

function addCoursesToMenu(){
    let menuList = `<option disabled selected value> -- choose a course -- </option>`
    for (let i = 0; i < COURSE_LIST.length; i++){
        menuList += `<option value=${i}>${COURSE_LIST[i].name}</option>`
    }
    menu.innerHTML = menuList;
}

function drawResetButton(){
    document.getElementById("inputRow").innerHTML = `<button name="scoreReset" id="sr" class="button">Reset Strokes</button>`;
}
