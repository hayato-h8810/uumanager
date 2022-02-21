import styled from 'styled-components'

export default function Header() {
  return <HeaderContainer>header</HeaderContainer>
}

const HeaderContainer = styled.div`
  background: #344460;
  width: 100%;
  margin: 0 calc(50% - 50vw);
  position: absolute;
  top: 0;
  height: 9vh;
`
