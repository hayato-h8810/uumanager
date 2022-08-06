import { useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import ServiceDescription from './serviceDescription'
import homepageBackgroundImage from '../../images/homepageBackground.png'

export default function LandingPageContainer() {
  const [isVisible, setIsVisible] = useState(false)
  const headLineRef = useRef(null)
  const history = useHistory()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    })
    if (headLineRef.current) {
      observer.observe(headLineRef.current)
    }
  }, [])

  return (
    <>
      <Title>
        <div className="title-text">
          <span className="title-text-first-line">UUManagerは、気に入ったwebサイトを管理</span>
          <span className="title-text-second-line">するための様々な手段を提供します。</span>
        </div>
      </Title>
      <Contents>
        <HeadLine>
          <div className={`headline-frame ${isVisible ? 'headline-frame-visible' : ''}`} ref={headLineRef}>
            <div className={`headline-title ${isVisible ? 'headline-title-visible' : ''}`}>
              URLを保存してwebサイトを管理
            </div>
            <div className="headline-description">webサイトを様々な方法で管理します。</div>
          </div>
        </HeadLine>
        {(() => {
          const descriptions = []
          for (let i = 0; i < 6; i += 1) {
            descriptions.push(<ServiceDescription props={{ index: i }} key={i} />)
          }
          return descriptions
        })()}
        <SignInAndSingUpButton>
          <div onClick={() => history.push('/login')} className="button" role="button" tabIndex={0}>
            既にアカウントをお持ちの場合
          </div>
          <div onClick={() => history.push('/createUser')} className="button" role="button" tabIndex={0}>
            新しくアカウントを作成する場合
          </div>
        </SignInAndSingUpButton>
      </Contents>
    </>
  )
}

const TitleFirstLineAnimation = keyframes`
  0% {
    width: 0;
  }
  35% {
    width: 700px;
  }
`

const TitleSecondLineAnimation = keyframes`
  0% {
    width: 0;
  }
  35% {
    width: 0;
  }
  70% {
    width: 700px;
  }
`

const TitleFirstUnderLineAnimation = keyframes`
  0% {
    transform-origin: left;
		transform: scaleX(0);
  }
  70% {
    transform-origin: left;
		transform: scaleX(0);
  }
  85% {
    transform-origin: left;
		transform: scaleX(1);
  }
`

const TitleSecondUnderLineAnimation = keyframes`
  0% {
    transform-origin: left;
    transform: scaleX(0);
  }
  85% {
    transform-origin: left;
    transform: scaleX(0);
  }
  100% {
    transform-origin: left;
    transform: scaleX(1);
  }
`

const BackgroundAnimation = keyframes`
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

const HeadLineFrameAnimation = keyframes` 
  from {
    transform: translateX(-50%) scale(0%,100%);
  }
  to {
    transform: translateX(0%) scale(100%,100%);
  }
`

const ButtonAnimation = keyframes`
  to {
    background: #f1c012;
  }
`

const Title = styled.div`
  position: sticky;
  height: 630px;
  background: #2c2c2c;
  width: 100%;
  top: 75px;
  min-width: 1425px;
  .title-text {
    color: white;
    font-size: 30px;
    position: relative;
    letter-spacing: 2px;
    padding-top: 235px;
    padding-left: 205px;
    width: 700px;
    span {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      &::before {
        content: '';
        background: #ff6d64;
        height: 3px;
        position: absolute;
        top: 36px;
        z-index: -1;
      }
    }
    .title-text-first-line {
      animation: ${TitleFirstLineAnimation} 3s linear forwards;
      position: relative;
      &::before {
        width: 690px;
        animation: ${TitleFirstUnderLineAnimation} 3s linear forwards;
      }
    }
    .title-text-second-line {
      animation: ${TitleSecondLineAnimation} 3s linear forwards;
      position: relative;
      &::before {
        width: 525px;
        animation: ${TitleSecondUnderLineAnimation} 3s linear forwards;
      }
    }
    &::before {
      content: url(${homepageBackgroundImage});
      position: absolute;
      transform: scale(1.32, 1.3);
      top: 85px;
      left: 173px;
      z-index: -1;
      animation: ${BackgroundAnimation} 3s linear forwards;
    }
  }
`

const Contents = styled.div`
  position: relative;
  background: white;
  width: 1425px;
  z-index: 100;
`

const HeadLine = styled.div`
  padding-top: 140px;
  padding-bottom: 100px;
  text-align: center;
  .headline-frame {
    position: relative;
    &::before {
      position: absolute;
      left: 490px;
      top: 33px;
      content: '';
      height: 10px;
      width: 445px;
      background: #ff7a7a;
      z-index: -1;
    }
  }
  .headline-frame-visible {
    &::before {
      animation: ${HeadLineFrameAnimation} 1s ease-in-out forwards;
    }
  }
  .headline-title {
    font-size: 30px;
    padding-bottom: 35px;
  }
  .headline-title-visible {
    animation: ${TitleAnimation} 1s ease-in-out forwards;
  }
  .headline-description {
    color: #818181;
  }
`

const SignInAndSingUpButton = styled.div`
  padding-top: 170px;
  padding-bottom: 80px;
  display: flex;
  justify-content: center;
  gap: 75px;
  .button {
    border: 2px solid #000;
    padding: 27px 35px;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      animation: ${ButtonAnimation} 0.5s ease-in-out forwards;
    }
  }
`
