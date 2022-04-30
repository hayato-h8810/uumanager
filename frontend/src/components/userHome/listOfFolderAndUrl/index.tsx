import { useState } from 'react'
import styled from 'styled-components'
import { Url } from '../../../api/graphql'
import FolderList from './folderList'
import UrlList from './urlList'

export default function Index() {
  const [displayUrlArray, setDisplayUrlArray] = useState<Url[] | null>()

  return (
    <Container>
      <FolderList props={{ displayUrlArray, setDisplayUrlArray }} />
      <UrlList props={{ displayUrlArray }} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 604px;
  grid-template-columns: 400px 1040px;
  grid-template-areas: 'folderList urlList';
`
