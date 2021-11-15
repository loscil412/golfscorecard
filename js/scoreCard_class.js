/**
 * Construct the score card object as a class
 * User date defaults to 1999 if the date objects fail from calling functions
 */

class ScoreCard {

    constructor(_date="1999-09-15"){
        this.course = _selectedCourse.name
        this.create_time = Date.now()
        this.course_par = _selectedCourse.coursePar
        this.greens_in_reg = 0
        this.total_strokes_played = 0
        this.total_putts = 0
        this.short_game_hcp = 0
        this.stroke_data = this.initializeStrokeData()
        this.date = _date
    }

    initializeStrokeData(){
        let array = []
        for (let i = 0 ; i < Object.keys(_selectedCourse.holes).length; i++){
            array.push(
                {
                    par: _selectedCourse.holes[i+1],
                    strokes: 0,
                    putts: 0,
                    sgs_strokes: 0,
                    gir: false
                }
            )
        }   
        return array 
    }
}