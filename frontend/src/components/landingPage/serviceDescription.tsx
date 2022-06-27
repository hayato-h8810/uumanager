import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import importanceImage from '../../images/importance.png'
import folderImage from '../../images/folder.png'
import calendarImage from '../../images/calendar.png'
import commentImage from '../../images/comment.png'
import notificationImage from '../../images/notification.png'
import titleImage from '../../images/title.png'

interface propsType {
  index: number
}

export default function ServiceDescription({ props }: { props: propsType }) {
  const { index } = props
  const images = [importanceImage, notificationImage, titleImage, calendarImage, commentImage, folderImage]
  const descriptionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const descriptions = [
    {
      title: '重要度で優先順位を指定',
      detail:
        'webサイトごとに重要度を付けることで、優先順位を明確にします。あなたのお気に入りのサイトに高い重要度を付けて、すぐにアクセス出来る様にしましょう。',
    },
    {
      title: 'URLごとに通知日を指定',
      detail:
        '再度見返したいサイトがあった場合、通知日を指定する事で忘れる事なくサイトにアクセスする事が出来ます。通知日を指定して、忘れずにwebサイトを訪問しましょう。',
    },
    {
      title: '自分好みの名前を付与',
      detail:
        'webサイトに名前を付けることで、保存したサイトの認識を明確にします。自分好みに名前を付けて分かりやすくwebサイトを保存しましょう。',
    },
    {
      title: '通知と訪問履歴をカレンダーで管理',
      detail:
        '全ての通知日と、サイトへの訪問履歴をカレンダーで確認、編集する事が出来ます。カレンダーを使って簡単に、あなたのイベントを管理していきましょう。',
    },
    {
      title: 'コメントでwebサイトの役割を明確に',
      detail:
        '保存したサイトごとにコメントを残す事で、サイトを保存した理由を明確にします。コメントを残して、保存したサイトの役割を忘れないようにしましょう。',
    },
    {
      title: 'フォルダーでグループ化',
      detail:
        'サイトをフォルダーに分けて保存する事で、細分化する事が出来ます。明確なグループ分けをして、保存したサイトを再度探すときに役立てましょう。',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    })
    if (descriptionRef.current) {
      observer.observe(descriptionRef.current)
    }
  }, [])

  return (
    <Container ref={descriptionRef}>
      <div className={`frame ${(index + 1) % 2 === 0 ? 'even-frame' : 'odd-frame'}`}>
        <img
          src={images[index]}
          className={`img ${(index + 1) % 2 === 0 ? 'even-img' : 'odd-img'} ${isVisible ? 'img-visible' : ''}`}
          alt=""
          width={(() => {
            if (index === 0) {
              return 255
            }
            if (index === 5) {
              return 225
            }
            return 242
          })()}
        />
        <div className={`title-container-${index + 1} title-container ${isVisible ? 'title-container-visible' : ''}`}>
          <div className={`number ${(index + 1) % 2 === 0 ? 'even-number' : 'odd-number'}`}>{index + 1}</div>
          <div
            className={`title ${(index + 1) % 2 === 0 ? 'even-title' : 'odd-title'} ${
              isVisible ? 'title-visible' : ''
            }`}
          >
            {descriptions[index].title}
          </div>
        </div>
        <div className={`detail ${(index + 1) % 2 === 0 ? 'even-detail' : 'odd-detail'}`}>
          {descriptions[index].detail}
        </div>
      </div>
    </Container>
  )
}

const ImgAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const TitleAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
`

const TitleContainerAnimation = keyframes`
  from {
    transform: translateX(-50%) scale(0%,100%);
  }
  to {
    transform: translateX(0%) scale(100%,100%);
  }
`

const Container = styled.div`
  position: relative;
  margin-top: 10px;
  padding-bottom: 110px;
  .title-container {
    padding-top: 40px;
    position: relative;
    &::before {
      position: absolute;
      left: 15px;
      top: 115px;
      content: '';
      height: 10px;
      z-index: -1;
    }
  }
  .title-container-1 {
    margin-left: 300px;
    &::before {
      width: 322px;
      background: #ffba7a;
    }
  }
  .title-container-2 {
    margin-left: 780px;
    &::before {
      width: 316px;
      background: #fff27a;
    }
  }
  .title-container-3 {
    margin-left: 300px;
    &::before {
      width: 293px;
      background: #7dff7a;
    }
  }
  .title-container-4 {
    margin-left: 780px;
    &::before {
      width: 443px;
      background: #7affbf;
    }
  }
  .title-container-5 {
    margin-left: 300px;
    &::before {
      width: 466px;
      background: #7affff;
    }
  }
  .title-container-6 {
    margin-left: 780px;
    &::before {
      width: 315px;
      background: #ff7ada;
    }
  }
  .number {
    display: inline-block;
    font-size: 70px;
  }
  .title {
    padding-top: 38px;
    font-size: 25px;
    padding-left: 20px;
    display: inline-block;
    vertical-align: top;
  }
  .detail {
    padding-top: 15px;
    font-size: 14px;
    color: #818181;
    width: 340px;
  }
  .even-frame {
    .even-img {
      position: absolute;
      left: 360px;
    }
    .even-number {
    }
    .even-title {
    }
    .even-detail {
      padding-left: 780px;
    }
  }
  .odd-frame {
    .odd-img {
      position: absolute;
      left: 850px;
    }
    .odd-number {
    }
    .odd-title {
    }
    .odd-detail {
      padding-left: 300px;
    }
  }
  .title-container-visible {
    &::before {
      animation: ${TitleContainerAnimation} 1s ease-in-out forwards;
    }
  }
  .img-visible {
    animation: ${ImgAnimation} 1s ease-in-out forwards;
  }
  .title-visible {
    animation: ${TitleAnimation} 1s ease-in-out forwards;
  }
`
