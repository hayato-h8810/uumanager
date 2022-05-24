import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useHistory } from 'react-router-dom'

interface propsType {
  reset: () => void
}

export default function Icons({ props }: { props: propsType }) {
  const { reset } = props
  const history = useHistory()
  return (
    <>
      <BackIconContainer>
        <IconButton onClick={() => history.push('/')}>
          <ArrowBackIosNewIcon style={{ color: '#adadad', fontSize: '25px' }} />
        </IconButton>
      </BackIconContainer>
      <RefreshIconContainer>
        <IconButton onClick={() => reset()}>
          <RefreshIcon style={{ color: '#adadad', fontSize: '30px' }} />
        </IconButton>
      </RefreshIconContainer>
    </>
  )
}

const BackIconContainer = styled.div`
  position: absolute;
  top: 35px;
  left: 45px;
`
const RefreshIconContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 45px;
`
