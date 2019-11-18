import React from 'react'
import InlineBlock from 'react-inline-block'
import fetch from 'isomorphic-unfetch'
import * as axios from 'axios'
import * as api from '../api'
import PanTextSub from './PanTextSub'

const GalleryFooter = props => {
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

    await axios
      .post(`${api.gallery}/post`, {
        "token": props.token,
        "uid": props.uid,
        "gallery": props.gallery.id,
        "no": parseInt(target.gallery.value)
      })
      .then(() => {
        document.querySelector("#galleryInput").style.backgroundColor = "#00A54E"
        window.location.reload()
      })
      .catch(() => document.querySelector("#galleryInput").style.backgroundColor = "#E63747")
  }
  if (props.gallery.owner == props.uid) {
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
          <PanTextSub>add post</PanTextSub>
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
              placeholder="post no"
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

export default GalleryFooter