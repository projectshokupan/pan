import React from 'react'

const PanTextSub = props => {
  var defaultStyle = {
    color: "#757575",
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 8,
    marginTop: 3,
    marginBottom: 0
  }

  return(
    <h5 style={Object.assign(defaultStyle, props.style)}>
      {props.children}
    </h5>
  )
}

export default PanTextSub