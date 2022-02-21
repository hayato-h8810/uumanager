import styled from 'styled-components'

export default function Footer(){
  return <FooterContainer>footer</FooterContainer>
}

const FooterContainer = styled.div`
  background: #344460;
  width: 100%;
  margin: 0 calc(50% - 50vw);
  position: absolute;
  bottom: 0;
  height: 7.5vh;
`
