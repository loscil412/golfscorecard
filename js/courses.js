const COURSE_LIST = [
    { 
        "name": "Edgewood Country Club",
        "holes": { "1": 4, "2": 4, "3": 3, "4": 5, "5": 3, "6": 4, "7": 4, "8": 5, "9": 4, "10": 4, "11": 4, "12": 3, "13": 5, "14": 3, "15": 5, "16": 4, "17": 5, "18": 4 } 
    },
    { 
        "name": "Bob O'Conner Muni",
        "holes": { "1": 4, "2": 4, "3": 4, "4": 4, "5": 3, "6": 4, "7": 3, "8": 4, "9": 4, "10": 4, "11": 4, "12": 3, "13": 4, "14": 3, "15": 3, "16": 4, "17": 4, "18": 4 } 
    },
    { 
        "name": "Augusta National",
        "holes" : { "1": 4, "2": 4, "3": 3, "4": 5, "5": 3, "6": 4, "7": 4, "8": 5, "9": 4, "10": 4, "11": 4, "12": 4, "13": 3, "14": 4, "15": 5, "16": 3, "17": 4, "18": 4 } 
    },
    { 
        "name": "Scally's Par 3",
        "holes" : { "1": 3, "2": 3, "3": 3, "4": 3, "5": 3, "6": 3, "7": 3, "8": 3, "9": 3 } 
    }
]

let menu = document.getElementById("menu")
menu.addEventListener("change", courses)

function courses(){
    let selectedCourse = COURSE_LIST[(document.querySelector('select').value) * 1]
    document.getElementById("courseSelection").innerHTML = selectedCourse.name
    document.getElementById("courseName").innerText = "Golf Score Card: " + selectedCourse.name
    if (document.getElementById("courseNameCard") != null) {
        document.getElementById("courseNameCard").innerHTML = selectedCourse.name;
    }
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

    

