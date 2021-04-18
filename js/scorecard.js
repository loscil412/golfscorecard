let selectedCourse;
let menu = document.getElementById("menu")
addCoursesToMenu();
menu.addEventListener("change", drawScoreCard)

function getCourse(){
    selectedCourse = COURSE_LIST[(document.querySelector('select').value) * 1]
    document.getElementById("courseSelection").innerHTML = selectedCourse.name
    document.getElementById("courseName").innerText = "Golf Score Card: " + selectedCourse.name
    if (document.getElementById("courseNameCard") != null) {
        document.getElementById("courseNameCard").innerHTML = selectedCourse.name;
    }
}

function drawScoreCard(){
    getCourse();
    let colspanLength = Object.keys(selectedCourse.holes).length + 1
    let scorecardTable = `<table><thead><tr><th colspan=${colspanLength}>${selectedCourse.name}</th></tr></thead>`;

    scorecardTable += "<tbody><tr>"
    for (let i = 0; i < Object.keys(selectedCourse.holes).length; i++){
        scorecardTable += `<td>${i + 1}</td>`; // hole number
    }
    scorecardTable += "<td>Total Par</td></tr><tr>"
    let totalCoursePar = 0;
    for (let i = 0; i < colspanLength - 1; i++){
        scorecardTable += `<td>${selectedCourse.holes[i+1]}</td>`; // hole par
        totalCoursePar += selectedCourse.holes[i+1];
    }
    scorecardTable += `<td>${totalCoursePar}</td>`;
    scorecardTable += "</tr></tbody></table>";


    document.getElementById("table").innerHTML = scorecardTable

}

function addCoursesToMenu(){
    let menuList = `<option disabled selected value> -- choose a course -- </option>`
    for (let i = 0; i < COURSE_LIST.length; i++){
        menuList += `<option value=${i}>${COURSE_LIST[i].name}</option>`
    }
    menu.innerHTML = menuList;
}

    

