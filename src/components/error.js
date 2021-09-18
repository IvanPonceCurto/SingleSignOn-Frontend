import React from "react";
import UseAnimations from 'react-useanimations';
import alertCircle from 'react-useanimations/lib/alertCircle'

function Error() {

    return(
        <div>
            <UseAnimations id='err' size={300} strokeColor='#A30000' loop={true} animation={alertCircle} />
          </div>
    )

}

export default Error
