import React from 'react'

const PanTextBold = props => {
  var defaultStyle = {
    color: "white",
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 16,
    marginLeft: 8,
    marginTop: -3,
    marginBottom: 0
  }
  return(
    <h4 style={Object.assign(defaultStyle, props.style)}>
      {props.children}
    </h4>
  )
}

export default PanTextBold