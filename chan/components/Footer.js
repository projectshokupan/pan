import React from 'react'
import InlineBlock from 'react-inline-block'
import fetch from 'isomorphic-unfetch'
import PanTextSub from './PanTextSub'
import * as api from '../api'

const Footer = props => {
  const handleClick = (event) => {
    event.preventDefault()
    if (document.querySelector('#galleryForm').style.display == 'none') {
      document.querySelector('#galleryForm').style.display = 'inline'
    } else {
      document.querySelector('#galleryForm').style.display = 'none'
    }
  }
  const handleSubmit = async(event) => { 
    event.preventDefault()

    var target = event.target
    document.querySelector("#galleryInput").style.backgroundColor = "#6B757D"
    if (!target.gallery.value) return document.querySelector("#galleryInput").style.backgroundColor = "#E63747"
    if (target.gallery.value.length > 30) {
      document.querySelector("#galleryInput").style.backgroundColor = "#E63747"
      return
    }

    const gallery = await fetch(`${api.gallery}/new`, { 
      method: 'POST', 
      body: JSON.stringify({
        "token": props.token,
        "uid": props.uid,
        "name": target.gallery.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!gallery.ok) {
      document.querySelector("#galleryInput").style.backgroundColor = "#E63747"
      return
    }
    const galleryJson = await gallery.json()
    document.querySelector("#galleryInput").style.backgroundColor = "#00A54E"
    window.location.href = `/g/${galleryJson.id}`
  }
  if (props.token) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: 8, 
        marginBottom: 8 
      }}>
        <a 
          onClick={handleClick} 
          href="" 
          style={{textDecoration: "none"}}
        >
          <PanTextSub>new gallery</PanTextSub>
        </a>
        <InlineBlock>
          <form
            id="galleryForm"
            onSubmit={handleSubmit}
            style={{float: "right", marginLeft: 10, display: "none"}}
          >
            <input
              id="galleryInput"
              type="text"
              name="gallery"
              style={{
                backgroundColor: "rgba(40, 42, 46, 1)",
                color: "white",
                border: 0,
                minHeight: 18,
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 16,
                borderRadius: 4
              }}
            />
          </form>
        </InlineBlock>
      </div>
    )
  } else {
    return null
  }
}

export default Footer