import React from 'react'
import { Container } from 'react-grid-system'

const Panview = props => {
  var defaultStyle = {
    width:590,
    minWidth:590,
    marginTop:0,
    marginBottom:0,
    minHeight:0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor:"rgba(40, 42, 46, 1)",
    border:"0.5px solid rgba(17, 17, 17, 1)"
  }

  return(
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Container style={Object.assign(defaultStyle, props.style)}>
        {props.children}
      </Container>
    </div>
  )
}

export default Panview