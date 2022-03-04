import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import RefreshIcon from '@mui/icons-material/Refresh'

export default function Icons() {
  return (
    <>
      <RefreshIconContainer>
        <IconButton>
          <RefreshIcon style={{ color: '#adadad', fontSize: '30px' }} />
        </IconButton>
      </RefreshIconContainer>
      <QuestionIconContainer>
        <IconButton size="small">
          <QuestionMarkIcon style={{ color: 'white', fontSize: '20px' }} />
        </IconButton>
      </QuestionIconContainer>
    </>
  )
}

const RefreshIconContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
`

const QuestionIconContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 45px;
  .MuiIconButton-root {
    background: #ffc120;
    :hover {
      background: #ffc120;
    }
  }
`
