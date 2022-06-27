import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

export default function Footer() {
  const [inLandingPage, setInLandingPage] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      setInLandingPage(true)
    } else {
      setInLandingPage(false)
    }
  }, [location.pathname])

  return <FooterContainer inLandingPage={inLandingPage}>footer</FooterContainer>
}

const FooterContainer = styled.div<{ inLandingPage: boolean }>`
  background: #2c2c2c;
  width: 100%;
  height: 55px;
  min-width: ${(props) => (props.inLandingPage ? '1425px' : '1440px')};
`
