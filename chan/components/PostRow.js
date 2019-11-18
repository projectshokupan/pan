import React from 'react'
import { Row } from 'react-grid-system'

const PostRow = props => {
  return(
    <Row style={{
      marginLeft: 40, 
      marginTop: 35, 
      marginBottom: 8
    }}>
      {props.children}
    </Row>
  )
}

export default PostRow