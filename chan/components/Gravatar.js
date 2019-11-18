import React from 'react'
const gravatar = require('gravatar')

const Gravatar = props => {
  return(
    <img
      src={gravatar.url(props.email, {s: '70', d: 'retro'}, true)}
      style={{
        borderRadius: 50, 
        height: 35, 
        width: 35
      }}
    />
  )
}

export default Gravatar