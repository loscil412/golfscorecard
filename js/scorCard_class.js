/**
 * Construct the score card object as a class
 */

class ScoreCard {

    constructor(){
        this.course = SELECTED_COURSE.name
        this.create_time = Date.now()
        this.course_par = SELECTED_COURSE.coursePar
        this.greens_in_reg = 0
        this.total_strokes_played = 0
        this.total_putts = 0
        this.short_game_hcp = 0
        this.stroke_data = this.initializeStrokeData()
    }

    initializeStrokeData(){
        let array = []
        for (let i = 0 ; i < Object.keys(SELECTED_COURSE.holes).length; i++){
            array.push(
                {
                    par: SELECTED_COURSE.holes[i+1],
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