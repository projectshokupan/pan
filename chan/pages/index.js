import React from 'react'
import * as axios from 'axios'
import * as api from '../api'
import nookies from 'nookies'
import fetch from 'isomorphic-unfetch'
import Panview from '../components/Panview'
import LoginView from '../components/LoginView'
import ReplyView from '../components/ReplyView'
import BlogbarView from '../components/BlogbarView'
import Footer from '../components/Footer'

const Home = props => (
  <div>
    <LoginView token={props.token}/>
    <Panview>
      <BlogbarView 
        token={props.token}
        uid={props.uid}
        resto={0}
        placeholder="Posting..."
      />
      {props.posts.map(post => (
        <ReplyView 
          token={props.token} 
          uid={props.uid}
          post={post} 
        />
      ))}
      <style jsx>
        {`
          @import url('https://rsms.me/inter/inter.css');
          html { font-family: 'Inter', sans-serif; }
          @supports (font-variation-settings: normal) {
            html { font-family: 'Inter var', sans-serif; }
          }

          :global(body) {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
            background: #1D1F21;
          }
        `}
      </style>
    </Panview>
    <Footer
      token={props.token} 
      uid={props.uid}
    />
  </div>
)

Home.getInitialProps = async(context) => {
  const authApi = api.otpw2
  
  const tokenQuery = context.query.token
  const uidQuery = context.query.uid
  const c = nookies.get(context)
  const token = c.token
  const uid = c.uid
  var posts = []

  if (c.token) {
    await axios
      .get(`${authApi}/authenticate?token=${c.token}&uid=${c.uid}`)
      .then(async() => {
        const boxId = process.env.POST_BOX_ID
        const postResults = await fetch(`https://jsonbox.io/${boxId}?q=owner:${c.uid}`)
        posts = await postResults.json()
      })
      .catch(err => {
        nookies.destroy(context, 'token', {
          maxAge: 8760 * 60 * 60,
          path: '/'
        })
        nookies.destroy(context, 'uid', {
          maxAge: 8760 * 60 * 60,
          path: '/'
        })
      })
  }

  if (tokenQuery) {
    await axios.get(`${authApi}/authenticate?token=${tokenQuery}&uid=${uidQuery}`)
      .then(r => {
        nookies.set(context, 'token', tokenQuery, { 
          maxAge: 8760 * 60 * 60
        })
        nookies.set(context, 'uid', uidQuery, {
          maxAge: 8760 * 60 * 60
        })
      })
      .catch(err => console.log(err))
  }

  return { posts, token, uid }
}

export default Home
