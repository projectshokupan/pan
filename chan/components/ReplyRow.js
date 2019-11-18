import React from 'react'
import { Row } from 'react-grid-system'

const ReplyRow = props => {
  const defaultStyle = {
    marginLeft: 40, 
    marginTop: 8,
    marginBottom: 8,
  }

  return(
    <div>
      <div style={{
        borderTop: "0.5px solid rgba(17, 17, 17, 1)",
        minHeight: 0.5,
        paddingLeft: 0
      }}/>
      <Row style={Object.assign(defaultStyle, props.style)}>
        {props.children}
      </Row>
    </div>
  )
}

export default ReplyRow