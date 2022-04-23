import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'
import { useCurrentUserQuery, useFetchFolderAndUrlQuery, useAddLoginHistoryMutation, Url } from '../../../api/graphql'
import FolderListContainer from './folderListContainer'
import UrlListContainer from './urlListContainer'
import Notification from './notification'

export default function ListOfFolderAndUrl() {
  const [urls, setUrls] = useState<Url[] | null>()
  const history = useHistory()

  const { data: { currentUser = null } = {}, loading } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (!currentUser) {
        history.push('/login')
      } else {
        addLoginHistoryMutation({ variables: { date: format(new Date(), 'yyyy-MM-dd') } })
      }
    },
  })
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    skip: !currentUser,
  })
  const [addLoginHistoryMutation] = useAddLoginHistoryMutation()

  if (loading) return <h1>ロード中</h1>

  return (
    <Container>
      <h1>user home</h1>
      <Notification props={{ fetchFolderAndUrl }} />
      <FolderListContainer props={{ fetchFolderAndUrl, setUrls }} />
      <UrlListContainer props={{ fetchFolderAndUrl, urls, setUrls }} />
    </Container>
  )
}

const Container = styled.div``