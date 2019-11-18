import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import nookies from 'nookies'
import Panview from '../../components/Panview'
import ReplyView from '../../components/ReplyView'
import PostView from '../../components/PostView'
import LoginView from '../../components/LoginView'
import BlogbarView from '../../components/BlogbarView'
import * as axios from 'axios'
import * as api from '../../api'
import Footer from '../../components/Footer'

const Post = props => {
  return (
    <div>
      <LoginView token={props.token}/>
      <Panview>
        <Head>
          <title>{`Post ${props.post.no}`}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <PostView 
          token={props.token} 
          uid={props.uid}
          post={props.post}
        />
        
        <BlogbarView 
          token={props.token}
          uid={props.uid}
          resto={props.post.no}
        />

        {props.replies.map(post => (
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
        uid={props.token}
      />
    </div>
  )
}

Post.getInitialProps = async(context) => {
  // needs to be secured in future
  const boxId = process.env.POST_BOX_ID
  const authApi = `${api.otpw2}/authenticate`

  const { id } = context.query;
  const postResults = await fetch(`https://jsonbox.io/${boxId}?q=no:=${id}`)
  const posts = await postResults.json()
  if (posts.length == 0) {
    context.res.statusCode = 404
    return context.res.end('Not found')
  }
  const post = await posts[0]

  const repliesResults = await fetch(`https://jsonbox.io/${boxId}?q=resto:=${id}`)
  const replies = await repliesResults.json()

  // cookie logic
  const c = nookies.get(context)
  const token = c.token
  const uid = c.uid
  if (token) {
    await axios
      .get(`${authApi}?token=${token}&uid=${uid}`)
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

  return { post, replies, token, uid }
}

export default Post
