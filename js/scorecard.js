let selectedCourse;
let menu = document.getElementById("menu")
addCoursesToMenu();
menu.addEventListener("change", drawScoreCard)

let userScores = []
function getCourse(){
    selectedCourse = COURSE_LIST[(document.querySelector('select').value) * 1]
    document.getElementById("courseSelection").innerHTML = selectedCourse.name
    document.getElementById("dynamicCourseName").innerText = ": " + selectedCourse.name
    if (document.getElementById("courseNameCard") != null) {
        document.getElementById("courseNameCard").innerHTML = selectedCourse.name;
    }
}

function drawScoreCard(){
    getCourse();
    let colspanLength = Object.keys(selectedCourse.holes).length + 1
    let scorecardTable = `<table><thead><tr><th colspan=${colspanLength}>${selectedCourse.name}</th></tr></thead>`;
    let arrayOfScoreListeners = []
    scorecardTable += "<tbody><tr>"
    for (let i = 0; i < Object.keys(selectedCourse.holes).length; i++){
        scorecardTable += `<td>${i + 1}</td>`; // hole number
    }
    scorecardTable += "<td>Total</td></tr><tr>"
    let totalCoursePar = 0;
    for (let i = 0; i < colspanLength - 1; i++){
        scorecardTable += `<td>${selectedCourse.holes[i+1]}</td>`; // hole par
        totalCoursePar += selectedCourse.holes[i+1];
    }
    scorecardTable += `<td>${totalCoursePar}</td><tr id="userScores">`;
    for (let i = 0; i < colspanLength - 1; i++){
        scorecardTable += `<td><input type="text" id="score-${i + 1}" size="1"></td>`
    }
    scorecardTable += `<td id="totUserScore"></td>`

    scorecardTable += "</tr></tbody></table>";

    // now the DOM is aware of the scorecard
    document.getElementById("table").innerHTML = scorecardTable


    let rowOfScores = document.querySelectorAll("input[id^='score-']"); // a regex like selector

    let scoreToCapture;
    let boxWithScore;
    rowOfScores.forEach( (element) => {
        element.addEventListener('focusin', (event) => {
            event.target.style.background = 'pink';
            boxWithScore = document.activeElement;
        });    
    });

    rowOfScores.forEach( (element) => {
        element.addEventListener('focusout', (event) => {
            event.target.style.background = '';
            scoreToCapture = boxWithScore.value;
            addScore(scoreToCapture);
        });    
    });


}

function addScore(score){
    userScores.push(score);
    console.log(userScores);
    sumScores();
}

function sumScores(){
    let totUserScore = 0;
    userScores.forEach(score => totUserScore += score * 1);
    document.getElementById("totUserScore").innerText = totUserScore;
}

function addCoursesToMenu(){
    let menuList = `<option disabled selected value> -- choose a course -- </option>`
    for (let i = 0; i < COURSE_LIST.length; i++){
        menuList += `<option value=${i}>${COURSE_LIST[i].name}</option>`
    }
    menu.innerHTML = menuList;
}

    

