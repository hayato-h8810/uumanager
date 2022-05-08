import FullCalendar from '@fullcalendar/react'
import { MutableRefObject } from 'react'
import styled from 'styled-components'

interface propType {
  calendarRef: MutableRefObject<FullCalendar | null>
}

export default function MonthsAndYearsList({ props }: { props: propType }) {
  const { calendarRef } = props

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>年</th>
            <th>月</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const monthsAndYearsList = []
            for (let i = 1; i < 13; i += 1) {
              const displayYear = new Date().getFullYear() - 6 + i
              monthsAndYearsList.push(
                <tr key={i}>
                  <td
                    onClick={() => {
                      const month = calendarRef.current?.getApi().getDate().getMonth()
                      if (month) {
                        const currentMonth = `0${month + 1}`.slice(-2)
                        calendarRef.current?.getApi().gotoDate(new Date(`${displayYear}-${currentMonth}`))
                      }
                    }}
                    className={
                      calendarRef.current && calendarRef.current.getApi().getDate().getFullYear() === displayYear
                        ? 'current-cell'
                        : ''
                    }
                    key={`year-${i}`}
                    role="gridcell"
                    tabIndex={0}
                  >
                    {displayYear}
                  </td>
                  <td
                    onClick={() => {
                      const currentYear = calendarRef.current?.getApi().getDate().getFullYear()
                      if (currentYear) {
                        const month = `0${i}`.slice(-2)
                        calendarRef.current?.getApi().gotoDate(new Date(`${currentYear}-0${month}`))
                      }
                    }}
                    className={
                      calendarRef.current && calendarRef.current.getApi().getDate().getMonth() + 1 === i
                        ? 'current-cell'
                        : ''
                    }
                    key={`month-${i}`}
                    role="gridcell"
                    tabIndex={0}
                  >
                    {i}
                  </td>
                </tr>
              )
            }

            return monthsAndYearsList
          })()}
        </tbody>
      </table>
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
  margin-top: 93px;
  margin-left: 60px;
  table {
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 14px;
    th {
      border: 1px solid #ddd;
      width: 50px;
      height: 30px;
    }
    td {
      border: 1px solid #ddd;
      text-align: center;
      height: 31px;
      cursor: pointer;
      &:hover {
        background: #fff8e1;
      }
    }
    .current-cell {
      background: #fff8e1;
    }
  }
`
