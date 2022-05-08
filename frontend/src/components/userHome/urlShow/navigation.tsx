import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

interface RouterParams {
  id: string
}

export default function Navigation() {
  const { id } = useParams<RouterParams>()
  const history = useHistory()

  return (
    <Container>
      <button
        type="button"
        onClick={() => history.push({ pathname: '/userHome/profile', state: { prevPathname: id } })}
      >
        <ArrowBackIosNewIcon />
        ユーザープロファイル
      </button>
      <br />
      <button
        type="button"
        onClick={() => history.push({ pathname: '/userHome/listOfFolderAndUrl', state: { prevPathname: id } })}
      >
        <ArrowBackIosNewIcon />
        url一覧
      </button>
      <br />
      <button
        type="button"
        onClick={() => history.push({ pathname: '/userHome/notificationCalendar', state: { prevPathname: id } })}
      >
        <ArrowBackIosNewIcon />
        通知カレンダー
      </button>
      <br />
      <button
        type="button"
        onClick={() => history.push({ pathname: '/userHome/browsingHistoryCalendar', state: { prevPathname: id } })}
      >
        <ArrowBackIosNewIcon />
        閲覧履歴カレンダー
      </button>
    </Container>
  )
}

const Container = styled.div`
  grid-area: navigation;
  background: #f1f1f1;
  position: relative;
  &::before {
    content: '';
    background: #848484;
    width: 210px;
    height: 1px;
    position: absolute;
    top: 270px;
    left: 20px;
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
    font-size: 12px;
    position: relative;
    margin-left: 70px;
    margin-top: 40px;
    &:hover {
      color: #30a8ff;
    }
    .MuiSvgIcon-root {
      position: absolute;
      top: 3px;
      left: -30px;
      font-size: 12px;
    }
  }
`
