import React from 'react'

function Box(props) {
    const size = 50;
    const x = props.x;
    const y = props.y;

    const getBacgroundColor = (type) => {
        if(type === 'black') return 'black';
        if(type === 'white') return 'white';
        return 'inherit';
    }

    return (
        <div style={{
            position: 'absolute',
            width: size,
            height: size,
            backgroundColor: getBacgroundColor(props.type),
            left: x,
            top: y
        }} />
    )
}

export default Box
