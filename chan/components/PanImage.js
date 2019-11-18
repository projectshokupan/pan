import React from 'react'

const PanImage = props => {
  var defaultStyle = {
    borderRadius: 4,
    maxWidth: 479
  }

  if (props.src) {
    return (
      <a 
        href={`https://pancdn.now.sh/${props.src}${props.ext}`}
        target="_blank"
      >
        <img 
          src={`https://pancdn.now.sh/${props.src}${props.ext}`}
          style={Object.assign(defaultStyle, props.style)}
        />
      </a>
    )
  } else {
    return null
  }
}

export default PanImage