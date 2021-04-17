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
    }
]

let menu = document.getElementById("menu")
menu.addEventListener("change", courses)

function courses(){
    let selectedCourse = COURSE_LIST[(document.querySelector('select').value) * 1]
    document.getElementById("courseSelection").innerHTML = selectedCourse.name
    document.getElementById("courseName").innerHTML = "Golf Score Card: " + selectedCourse.name
    if (document.getElementById("courseNameCard") != null) {
        document.getElementById("courseNameCard").innerHTML = selectedCourse.name;
    }

    let scorecardTable = `<table><thead><tr><th colspan=\"19\">${selectedCourse.name}</th></tr></thead>`

    scorecardTable += "<tbody><tr>"
    for (let i = 0; i < 19; i++){
        scorecardTable += `<td>${i}</td>`
    }
    scorecardTable += "</tr></tbody></table>"

    document.getElementById("table").innerHTML = scorecardTable
}

    

