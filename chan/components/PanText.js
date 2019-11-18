import React from 'react'

const PanText = props => {
  var defaultStyle = {
    color: "white",
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 16,
    marginLeft: 8,
    marginTop: 0,
    marginBottom: 0
  }

  return(
    <h4 style={Object.assign(defaultStyle, props.style)}>
      {props.children}
    </h4>
  )
}

export default PanText