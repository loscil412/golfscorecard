let SELECTED_COURSE, NUMBER_OF_HOLES, scorecardTable, nbrOfColumns;
const ADD_COLUMNS = 2; // legends on left, totals on right
let menu = document.getElementById("menu")
addCoursesToMenu();

// on change (or select of course) to menu, we draw the correct score card
menu.addEventListener("change", setCourse)

function setCourse(){
    SELECTED_COURSE = COURSE_LIST[(document.querySelector('select').value)]
    document.getElementById("courseSelection").innerHTML = SELECTED_COURSE.name
    document.getElementById("dynamicCourseName").innerText = ": " + SELECTED_COURSE.name
    drawScoreCard();
}

function drawScoreCard(){
    NUMBER_OF_HOLES = Object.keys(SELECTED_COURSE.holes).length;
    nbrOfColumns = NUMBER_OF_HOLES + ADD_COLUMNS;
    // the courseName header
    scorecardTable = `<table><thead id="courseName"><tr><th colspan=${nbrOfColumns}>${SELECTED_COURSE.name}</th></tr></thead>`;
    
    // the hole numbers
    scorecardTable += `<tbody><tr id="holeNumbers"><td id="legend">Hole</td>`;
    for (let i = 0; i < NUMBER_OF_HOLES; i++){
        scorecardTable += `<td id="scrCrdHlNbr">${i + 1}</td>`; // hole number
    }
    scorecardTable += `<td id="legend">Totals</td></tr>`

    // the par score per hole
    let totalCoursePar = 0;
    scorecardTable += `<tr id="coursePar"><td id="legend">Par</td>`;
    for (let i = 0; i < nbrOfColumns - ADD_COLUMNS; i++){
        scorecardTable += `<td>${SELECTED_COURSE.holes[i+1]}</td>`; // hole par
        totalCoursePar += SELECTED_COURSE.holes[i+1];
    }
    scorecardTable += `<td id="legend">${totalCoursePar}</td></tr>`;

    // add data rows with reuseable function
    addRowToScoreCardTable("UserScore", "Strokes", "score")
    addRowToScoreCardTable("nbrOfPutts", "Putts", "putt")
    addRowToScoreCardTable("shortGame", "SGS", "sgs")
    addRowToScoreCardTable("gir", "GIR", "gir")
   
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
    captureAndCalculateStrokes(totalCoursePar);
}

/**
 * 
 * @param {String} idName "ShortGame"
 * @param {String} legend "SGS"
 * @param {String} idPrepend "sgs"
 */
function addRowToScoreCardTable(idName, legend, idPrepend){
    scorecardTable += `<tr id="${idName}"><td id="legend">${legend}</td>`
    for (let i = 0; i < nbrOfColumns - ADD_COLUMNS; i++){
        scorecardTable += `<td><input type="text" id="${idPrepend}-${i + 1}" size="1"></td>`
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
