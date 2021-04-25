let SELECTED_COURSE;
let NUMBER_OF_HOLES;
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
    let colspanLength = NUMBER_OF_HOLES + 1
    let scorecardTable = `<table><thead><tr><th colspan=${colspanLength}>${SELECTED_COURSE.name}</th></tr></thead>`;
    scorecardTable += "<tbody><tr>"
    for (let i = 0; i < NUMBER_OF_HOLES; i++){
        scorecardTable += `<td>${i + 1}</td>`; // hole number
    }
    scorecardTable += "<td>Total</td></tr><tr>"
    let totalCoursePar = 0;
    for (let i = 0; i < colspanLength - 1; i++){
        scorecardTable += `<td>${SELECTED_COURSE.holes[i+1]}</td>`; // hole par
        totalCoursePar += SELECTED_COURSE.holes[i+1];
    }
    scorecardTable += `<td>${totalCoursePar}</td><tr id="userScores">`;
    for (let i = 0; i < colspanLength - 1; i++){
        scorecardTable += `<td><input type="text" id="score-${i + 1}" size="1"></td>`
    }
    scorecardTable += `<td id="totUserScore"></td>`

    scorecardTable += "</tr></tbody></table>";

    // now the DOM is aware of the scorecard and we are ready to capture user input
    document.getElementById("table").innerHTML = scorecardTable;
    captureAndCalculateStrokes();
}

function addCoursesToMenu(){
    let menuList = `<option disabled selected value> -- choose a course -- </option>`
    for (let i = 0; i < COURSE_LIST.length; i++){
        menuList += `<option value=${i}>${COURSE_LIST[i].name}</option>`
    }
    menu.innerHTML = menuList;
}

    

