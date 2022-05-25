import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'

export default function NavTabs() {
  const history = useHistory()
  const location = useLocation()
  const [value, setValue] = useState('')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    history.push(`/userHome/${newValue}`)
  }

  useEffect(() => {
    if (location.pathname.substr(10).toLowerCase().startsWith('profile')) {
      setValue('profile')
    } else if (location.pathname.substr(10).toLowerCase().startsWith('listoffolderandurl')) {
      setValue('listOfFolderAndUrl')
    } else if (location.pathname.substr(10).toLowerCase().startsWith('notificationcalendar')) {
      setValue('notificationCalendar')
    } else if (location.pathname.substr(10).toLowerCase().startsWith('browsinghistorycalendar')) {
      setValue('browsinghistoryCalendar')
    }
  }, [location.pathname])

  return (
    <TabsContainer>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="ユーザープロファイル" value="profile" />
        <Tab label="Url一覧" value="listOfFolderAndUrl" />
        <Tab label="通知カレンダー" value="notificationCalendar" />
        <Tab label="閲覧履歴カレンダー" value="browsinghistoryCalendar" />
      </Tabs>
    </TabsContainer>
  )
}

const TabsContainer = styled.div`
  .MuiTabs-indicator {
    background-color: #ffc633;
    height: 4px;
    border-radius: 3px;
  }
  .MuiTabs-root {
    width: 1440px;
    background: #f6f6f9;
    .Mui-selected {
      color: black;
    }
  }
  .MuiTab-root {
    height: 55px;
    min-width: 200px;
    font-size: 12px;
  }
`
