import React from 'react'
import Link from 'next/link'

const ReplyLink = props => {
  if (props.post.resto) {
    return (
      <Link href={`/p/${props.post.resto}#${props.post.tno}`}>
        <a style={{textDecoration: "none", color:"#81A2BE"}}>
          {`· No. ${props.post.tno} `}
        </a>
      </Link>
    )
  } else {
    return (
      <Link href={`/p/${props.post.no}`}>
        <a style={{textDecoration: "none", color:"#81A2BE"}}>
          {`· No. ${props.post.no} `}
        </a>
      </Link>
    )
  }
}

export default ReplyLink