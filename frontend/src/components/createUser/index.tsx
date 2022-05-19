import { useState } from 'react'
import ConfirmationMailSend from './confirmationMailSend'
import Form from './form'

export default function Index() {
  const [isConfirmationMailSent, setIsConfirmationMailSend] = useState(false)

  return isConfirmationMailSent ? <ConfirmationMailSend /> : <Form props={{ setIsConfirmationMailSend }} />
}
