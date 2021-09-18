import React from "react";
import UseAnimations from 'react-useanimations';
import radioButton from 'react-useanimations/lib/radioButton'

function Success() {

    return (
        <div>
            <UseAnimations id='succ' size={300} strokeColor='#00A300' autoplay={true} animation={radioButton} />
            <div style={{marginLeft:100}}>Redirigiendo...</div>
        </div>
    )

}

export default Success
