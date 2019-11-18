import React from 'react'

import TextareaAutosize from 'react-textarea-autosize'
import fetch from 'isomorphic-unfetch'
import ReplyRow from './ReplyRow'
import Gravatar from './Gravatar'
import UploadButton from './UploadButton'
import * as api from '../api'

const BlogbarView = props => {
  const handleSubmit = async(event) => {
    event.preventDefault()
    
    const target = event.target
    var imgKey
    var extKey

    if (!target.image.value && !target.text.value) return
    if (target.image.value) {
      let formData = new FormData()
      formData.append("image", target.image.files[0])
      formData.append("token", props.token)
      formData.append("uid", props.uid)
      const fileUpload = await fetch(`${api.cdn}/post`, { 
        method: 'POST', 
        body: formData
      })
      let response = await fileUpload.json()
      let fileKey = await response.key
      imgKey = fileKey.split(".")[0]
      extKey = `.${fileKey.split(".")[1]}`
    }

    const post = await fetch(`${api.post}`, { 
      method: 'POST', 
      cache: 'no-cache',
      body: JSON.stringify({
        "token": props.token,
        "uid": props.uid,
        "text": target.text.value,
        "resto": props.resto,
        "img": parseInt(imgKey) || 0,
        "ext": extKey || ""
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    window.location.reload()
  }
  const handleKeydown = event => {
    if (event.keyCode == 13 && event.shiftKey) {
      event.preventDefault()
      let submitEvent = new Event('submit', { bubbles: true })
      document.querySelector("#postForm").dispatchEvent(submitEvent)
    }
  }
  const placeholder = props.placeholder || "Replying..."
  
  if (props.uid) {
    return(
      <div>
        <ReplyRow>
          <Gravatar email={props.uid}/>
          <form
            onSubmit={handleSubmit}
            id="postForm"
            style={{float: "right", marginLeft: 8}}
          >
            <div style={{
              display: "-ms-flex", 
              display: "-webkit-flex", 
              display: "flex"
            }}>
              <UploadButton/>
              <TextareaAutosize
                id="login"
                type="text"
                name="text"
                placeholder={placeholder}
                onKeyDown={handleKeydown}
                style={{
                  backgroundColor: "#1D1F21",
                  color: "white",
                  border: 0,
                  flex: 1,
                  minHeight: 20,
                  minWidth: 428,
                  maxWidth: 428,
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: 16,
                  borderRadius: "0px 4px 4px 0px",
                  outline: "none",
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 5,
                  resize: "none",
                  margin: 0
                }}
              />
            </div>
          </form>
        </ReplyRow>
      </div>
    )
  } else {
    return null
  }
}

export default BlogbarView