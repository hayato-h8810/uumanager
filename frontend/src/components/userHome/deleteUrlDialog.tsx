import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from '@mui/material'
import styled from 'styled-components'
import { useDeleteUrlMutation } from '../../api/graphql'

interface propsType {
  deleteUrlDialogOpen: boolean
  setDeleteUrlDialogOpen: (boolean: boolean) => void
  deleteUrlId: string | null | undefined
  setIsDeleted: (boolean: boolean) => void
}

export default function DeleteUrlDialog({ props }: { props: propsType }) {
  const { deleteUrlDialogOpen, setDeleteUrlDialogOpen, deleteUrlId, setIsDeleted } = props
  const [deleteUrlMutation] = useDeleteUrlMutation({
    onCompleted: () => {
      setDeleteUrlDialogOpen(false)
      setIsDeleted(true)
    },
  })

  return (
    <DialogContainer open={deleteUrlDialogOpen}>
      <DialogTitle>urlの削除</DialogTitle>
      <DialogContent>
        <DialogContentText>一度削除したurlを復元することは出来ません。本当に削除しますか?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteUrlDialogOpen(false)}>削除しない</Button>
        <Button
          onClick={() => {
            if (deleteUrlId) deleteUrlMutation({ variables: { urlId: deleteUrlId } })
          }}
          autoFocus
        >
          削除する
        </Button>
      </DialogActions>
    </DialogContainer>
  )
}

const DialogContainer = styled(Dialog)`
  & .MuiPaper-root {
    background: #2f2f2f;
    color: white;
    & .MuiDialogContentText-root {
      color: white;
    }
  }
`
