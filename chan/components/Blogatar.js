import React from 'react'
const gravatar = require('gravatar')

const Gravatar = props => {
  return(
    <img 
      src={gravatar.url(props.email, {s: '200', d: 'retro'}, true)}
      style={{
        borderRadius: 8, 
        height: 100, 
        width: 100
      }}
    />
  )
}

export default Gravatar