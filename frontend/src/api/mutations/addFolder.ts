import { gql } from '@apollo/client'

export default gql`
  mutation addFolder($folderName: String!) {
    addFolder(input: { folderName: $folderName }) {
      id
      name
      urls {
        id
        title
        memo
        notification
        url
        importance
        folderId
        createdAt
      }
    }
  }
`
