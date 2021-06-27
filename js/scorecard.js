let SELECTED_COURSE;
let NUMBER_OF_HOLES;
const ADD_COLUMNS = 2;
let menu = document.getElementById("menu")
addCoursesToMenu();
menu.addEventListener("change", drawScoreCard)


function getCourse(){
    SELECTED_COURSE = COURSE_LIST[(document.querySelector('select').value) * 1]
    document.getElementById("courseSelection").innerHTML = SELECTED_COURSE.name
    document.getElementById("dynamicCourseName").innerText = ": " + SELECTED_COURSE.name
    if (document.getElementById("courseNameCard") != null) {
        document.getElementById("courseNameCard").innerHTML = SELECTED_COURSE.name;
    }
}

function drawScoreCard(){
    getCourse();
    NUMBER_OF_HOLES = Object.keys(SELECTED_COURSE.holes).length;
    let colspanLength = NUMBER_OF_HOLES + ADD_COLUMNS;
    // the courseName header
    let scorecardTable = `<table><thead id="courseName"><tr><th colspan=${colspanLength}>${SELECTED_COURSE.name}</th></tr></thead>`;
    
    // the hole numbers
    scorecardTable += `<tbody><tr id="holeNumbers"><td id="legend">Hole</td>`;
    for (let i = 0; i < NUMBER_OF_HOLES; i++){
        scorecardTable += `<td id="scrCrdHlNbr">${i + 1}</td>`; // hole number
    }
    scorecardTable += "<td>Totals</td></tr>"

    // the par score per hole
    let totalCoursePar = 0;
    scorecardTable += `<tr id="coursePar"><td id="legend">Par</td>`;
    for (let i = 0; i < colspanLength - ADD_COLUMNS; i++){
        scorecardTable += `<td>${SELECTED_COURSE.holes[i+1]}</td>`; // hole par
        totalCoursePar += SELECTED_COURSE.holes[i+1];
    }
    scorecardTable += `<td>${totalCoursePar}</td>`;

    // strokes played
    scorecardTable += `<tr id="userScores"><td id="legend">Strokes</td>`;
    for (let i = 0; i < colspanLength - ADD_COLUMNS; i++){
        scorecardTable += `<td><input type="text" id="score-${i + 1}" size="1"></td>`
    }
    scorecardTable += `<td id="totUserScore"></td>`

    scorecardTable += "</tr></tbody></table>";


    // additional rows of data go here
    // puts
    // GIR calculator
    // FIR
    // short Game HCP
    
    // now the DOM is aware of the scorecard and we are ready to capture user input
    document.getElementById("table").innerHTML = scorecardTable;
    drawResetButton();
    captureAndCalculateStrokes(totalCoursePar);
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

    

