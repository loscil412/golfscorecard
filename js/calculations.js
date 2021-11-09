export function determineGir(score){
    if (score.Strokes == 0) return false; // edge case for the sumScore() loop
    if (score.Putts == 0 && (score.Par == score.Strokes || score.Par - score.Strokes == 1)) return false; // saving chip-ins off the green
    if (score.Strokes < score.Par) return true; // birdie with a putt or chip-ins for eagle or hole-in-one
    
    switch (score.Par) {
        case 3:
            if (score.Strokes - score.Putts == 1) return true; // one on and however many putts into hole
            break;            
        case 4:
            if (score.Strokes - score.Putts <= 2) return true; // two on and however may putts into hole   
            break;
        case 5:
            if (score.Strokes - score.Putts <= 3) return true; // three on and however may putts into hole   
            break;
        default:
            return false; // only default if par is < 3 or par > 5....
    }
    // default to false if switches are captured but not matched to logic
    return false;      
}

export function sumScores(scoreCard){
    let totUserStrokes = 0;
    let totUserPutts = 0;
    let totUserSgs = 0;
    let totGirs = 0;
    let nbrOfHolesForSgsHcp = 0;
    let totalSgsStrokes_putts_plus_wedge = 0;
    let sgsHcp = 0;

    // looping through the scoreCard.StrokeData object
    scoreCard.StrokeData.forEach((score, i) => {
        if (i < 9) { 
            i = '0' + (i + 1) 
        } else i = i + 1;

        totUserStrokes += score.Strokes
        totUserPutts += score.Putts
        totUserSgs += score.SgsStrokes
        calculateSgsHcp(score); // calculate here? or when card is fully tallied?
        score.Gir = determineGir(score)
        if (score.Gir) {
            totGirs += 1
            document.getElementById("gir-" + i).defaultValue = 'X';
        } else document.getElementById("gir-" + i).defaultValue = '';

    })
    updateScoreCardObject();

    function determineGir(score){
        if (score.Strokes == 0) return false; // edge case for the sumScore() loop
        if (score.Putts == 0 && (score.Par == score.Strokes || score.Par - score.Strokes == 1)) return false; // saving chip-ins off the green
        if (score.Strokes < score.Par) return true; // birdie with a putt or chip-ins for eagle or hole-in-one
        
        switch (score.Par) {
            case 3:
                if (score.Strokes - score.Putts == 1) return true; // one on and however many putts into hole
                break;            
            case 4:
                if (score.Strokes - score.Putts <= 2) return true; // two on and however may putts into hole   
                break;
            case 5:
                if (score.Strokes - score.Putts <= 3) return true; // three on and however may putts into hole   
                break;
            default:
                return false; // only default if par is < 3 or par > 5....
        }
        // default to false if switches are captured but not matched to logic
        return false;      
    }

    function calculateSgsHcp(score){
        if (score.SgsStrokes != 0) {
            nbrOfHolesForSgsHcp += 1
            totalSgsStrokes_putts_plus_wedge += (score.SgsStrokes + score.Putts) // this is dependent on Putts being entered first?
        }
        if (nbrOfHolesForSgsHcp != 0) {
            // sgsHcp = (totalSgsStrokes_putts_plus_wedge / nbrOfHolesForSgsHcp).toFixed(2); // decimal
            sgsHcp = getGcd(totalSgsStrokes_putts_plus_wedge, nbrOfHolesForSgsHcp); // fraction
        } else sgsHcp = "Not Calculated"

    }

    /*
    A modification to Euclid's theory for finding GCD?
    End goal is to return 19 / 7 = 2.714285.. as 2 5/7 fraction
    1. Extract the big number
    2. find GCD from the decimal value and display as fraction
    Example --- 16 total strokes, over 6 holes
    16/6 decimal == 2.6666667 (other methods I find will return 6666667/10000000 ... not helpful)
    16/6 fraction == 2 2/3
    1. divide and capture the ones spot without rounding (2)
    2. then mod 16 % 6 (4) <-- if this remainder is 0 we have no fraction to return and stop here, returning the simple division (i.e. 12/4 = 3.0)
    3. now we find the GCD for 6 & 4
    4. Once found 'actual_gcd' we get the solutions to 4/actual_gcd and 6/actual_gcd respectively as numerator and denominator for the fraction

    */
    function getGcd(combinedPutts_Sgs, nbr_of_holes_sgs_played){
        let _remainder = combinedPutts_Sgs % nbr_of_holes_sgs_played; // 16 % 6 = 4
        if (_remainder == 0) { return combinedPutts_Sgs/nbr_of_holes_sgs_played } // 4

        let big_nbr = Math.floor(combinedPutts_Sgs/nbr_of_holes_sgs_played); // i.e. 16/6 = 2
        let a = nbr_of_holes_sgs_played // a should be the larger value (i.e. # of strokes) [6]
        let copy_of_a = a
        let b = _remainder // b should be the smaller value (i.e. # of holes) [4]
        let copy_of_b = b
        let _gcd = b + 1        // there is a cleaner way I'm sure, but this works to avoid infinite while loops
        let actual_gcd;         // the gcd for the remaining fractional decimals -- will be 2 for the example values
        while (_gcd != 1) {     // once b = 0, _gcd will be 1
            while (_gcd > b) {  // 5 > 4, 2 !> 4 -- 3 > 2, 2 !> 2 -- 3 > 2 , 0 !> 2
                _gcd = a-b      // 2 = 6-4 -------- 2 = 4-2, ------- 0 = 2-2 ------          
                a = _gcd        // a = 2 ---------- a = 2, --------- a = 0   ------
            }
            a = b               // ..... a = 4 ............ a = 2 ........... a = 2
            b = _gcd            // ..... b = 2 ............ b = 2 ........... b = 0
            _gcd = b+1          // ..... _gcd = 3 .......... _gcd=3 ......... _gcd = 1 <-- breaks the bounding while loop
        }
        actual_gcd = a                           // actual_gcd = 2
        let numerator = copy_of_b / actual_gcd   // 2 = 4 / 2
        let denominator = copy_of_a / actual_gcd // 3 = 6 / 2
        return `${big_nbr} ${numerator}/${denominator}` // 2 2/3
    }

    function updateScoreCardObject(){
        scoreCard.TotalStrokes = totUserStrokes;
        scoreCard.TotalPutts = totUserPutts;
        scoreCard.GreensInRegulation = totGirs;
        scoreCard.ShortGameHcp = sgsHcp;
    }
}
