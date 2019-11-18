import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import * as axios from 'axios'
import * as api from '../../api'
import nookies from 'nookies'
import Blogatar from '../../components/Blogatar'
import dynamic from 'next/dynamic';
import GalleryFooter from '../../components/GalleryFooter'
const ResponsiveGallery=dynamic(import ('react-responsive-gallery'),{ssr:false});

const Gallery = props => {
  return (
    <div style={{textAlign: 'center', marginTop: 35}}>
      <Head>
        <title>{`${props.gallery.name}`}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Blogatar email={props.gallery.owner}/>
      <h1 style={{
        color: "white",
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 32,
        marginTop: 0
      }}>
        {props.gallery.name}
      </h1>

      <ResponsiveGallery images={props.images} useLightBox={true}/>
      <GalleryFooter
        token={props.token}
        uid={props.uid}
        gallery={props.gallery}
      />
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
    </div>
  )
}

Gallery.getInitialProps = async(context) => {
  const galleryBoxId = process.env.GALLERY_BOX_ID
  const authApi = `${api.otpw2}/authenticate`

  const { id } = context.query;
  const galleryResults = await fetch(`https://jsonbox.io/${galleryBoxId}?q=id:=${id}`)
  const galleries = await galleryResults.json()
  if (galleries.length == 0) {
    context.res.statusCode = 404
    return context.res.end('Not found')
  }
  const gallery = await galleries[0]
  const imageKeys = await gallery.posts

  var images = []
  await imageKeys.map(key => images.push({ src: `https://pancdn.now.sh/${key}`}))

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

  return { gallery, images, token, uid }
}

export default Gallery