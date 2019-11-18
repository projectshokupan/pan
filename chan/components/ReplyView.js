import React from 'react'

import InlineBlock from 'react-inline-block'
import nl2br from 'react-newline-to-break'
import ReplyRow from './ReplyRow'
import PanImage from './PanImage'
import PanText from './PanText'
import PanTextBold from './PanTextBold'
import PanTextSub from './PanTextSub'
import Gravatar from './Gravatar'
import DeleteButton from './DeleteButton'
import ReplyLink from './ReplyLink'
import * as moment from 'moment'

const ReplyView = props => {
  return(
    <div id={props.post.tno}>
      <ReplyRow>
        <Gravatar email={props.post.owner}/>
        <InlineBlock>
          <PanTextBold>{props.post.owner}</PanTextBold>
          <PanText>{nl2br(props.post.text)}</PanText>
          <PanImage 
            src={props.post.img}
            ext={props.post.ext}
            style={{
              marginLeft: 8,
              marginTop: 6
            }}
          />
          <PanTextSub>
            {`${moment(props.post._createdOn).fromNow()} `}
            <ReplyLink post={props.post}/>
            <DeleteButton
              post={props.post}
              token={props.token}
              uid={props.uid}
            />
          </PanTextSub>
        </InlineBlock>
      </ReplyRow>
    </div>
    
  )
}

export default ReplyView