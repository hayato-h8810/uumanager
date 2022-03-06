import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import RefreshIcon from '@mui/icons-material/Refresh'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

interface propsType {
  reset: () => void
}

export default function Icons({ props }: { props: propsType }) {
  const { reset } = props
  const [openHelpModal, setOpenHelpModal] = useState(false)
  const location = useLocation()

  return (
    <>
      <RefreshIconContainer>
        <IconButton onClick={() => reset()}>
          <RefreshIcon style={{ color: '#adadad', fontSize: '30px' }} />
        </IconButton>
      </RefreshIconContainer>
      <QuestionIconContainer>
        <IconButton size="small" onClick={() => setOpenHelpModal(true)}>
          <QuestionMarkIcon style={{ color: 'white', fontSize: '20px' }} />
        </IconButton>
      </QuestionIconContainer>
      <ModalContainer open={openHelpModal && location.pathname === '/login'}>
        <div className="modalFrame">
          <div>help for login</div>
        </div>
      </ModalContainer>
      <ModalContainer open={openHelpModal && location.pathname === '/createUser'}>
        <div className="modalFrame">
          <div>help for createUser</div>
        </div>
      </ModalContainer>
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

const ModalContainer = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`
