import React from 'react'
import Panview from './Panview'
import PanText from './PanText'
import * as axios from 'axios'
import * as api from '../api'

const validator = require("email-validator")

const LoginView = props => {
  const handleSubmit = (event) => {
    event.preventDefault()
  
    document.querySelector("#login").style.backgroundColor = "#6B757D"
    if (!validator.validate(event.target.user.value)) {
      document.querySelector("#login").style.backgroundColor = "#E63747"
      return
    }
    axios
      .post(
        `${api.otpw2}/sendtoken/`, 
        {"user": event.target.user.value}
      )
      .then(() => document.querySelector("#login").style.backgroundColor = "#00A54E")
      .catch(() => document.querySelector("#login").style.backgroundColor = "#E63747")
  }

  if (props.token) {
    return null
  } else {
    return(
      <Panview style={{borderRadius: 4}}>
        <div style={{marginTop: 3, marginBottom: 29}}>
          <PanText style={{float: "left", marginLeft: 40}}>
            Login to create and reply to posts.
          </PanText>
          <form
            onSubmit={handleSubmit}
            style={{float: "right", marginLeft: 40, marginRight: 26}}
          >
            <input
              id="login"
              type="text"
              name="user"
              style={{
                backgroundColor: "#1D1F21",
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
        </div>
      </Panview>
    )
  }
  
}

export default LoginView