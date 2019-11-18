import React from 'react'
import * as api from '../api'

const DeleteButton = props => {
  const handleClick = async(event) => {
    event.preventDefault()
    
    await fetch(`${api.post}/delete`, { 
      method: 'DELETE', 
      body: JSON.stringify({
        "token": props.token,
        "uid": props.uid,
        "no": props.post.no
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    window.location.reload()
  }

  if (props.uid == props.post.owner) {
    return (
      <a
        onClick={handleClick}
        href=""
        style={{textDecoration: "none", color:"#CE4D4D"}}
      >
        {`· Delete`}
      </a>
    ) 
  } else {
    return null
  }
}

export default DeleteButton