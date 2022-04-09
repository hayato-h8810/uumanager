import { Line } from 'react-chartjs-2'
import { Chart, registerables, TooltipItem } from 'chart.js'
import { useHistory } from 'react-router-dom'
import { useCurrentUserQuery, useFetchLoginHistoryQuery } from '../../api/graphql'

Chart.register(...registerables)

export default function LoginHistory() {
  const history = useHistory()

  const { data: { currentUser = null } = {} } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (!currentUser) history.push('/login')
    },
  })
  const { data: { fetchLoginHistory = null } = {} } = useFetchLoginHistoryQuery({
    skip: !currentUser,
  })

  const historyData = () => {
    const numberOfHistoriesArray = []
    for (let i = 0; i < 18; i += 1) {
      const currentDate = new Date()
      const dateOfThisLoop = new Date()
      dateOfThisLoop.setMonth(currentDate.getMonth() - Math.abs(i - 17))
      const histories = fetchLoginHistory?.filter(
        (data) => !data.date.indexOf(`${dateOfThisLoop.getFullYear()}-${`0${dateOfThisLoop.getMonth() + 1}`.slice(-2)}`)
      )
      numberOfHistoriesArray.push(histories?.length)
    }
    return numberOfHistoriesArray
  }

  const labels = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const labelsArray = []
    for (let i = 0; i < 18; i += 1) {
      if (i === 0) {
        const firstDate = new Date()
        firstDate.setMonth(currentMonth - 17)
        const displayMonth = `0${firstDate.getMonth() + 1}`.slice(-2)
        labelsArray.push(`${firstDate.getFullYear()}-${displayMonth}`)
      } else if (i === 17) {
        if (currentMonth === 0) {
          labelsArray.push(`${currentYear}-01`)
        } else {
          const displayMonth = `0${currentMonth + 1}`.slice(-2)
          labelsArray.push(displayMonth)
        }
      } else {
        const dateOfThisLoop = new Date()
        dateOfThisLoop.setMonth(currentMonth - Math.abs(i - 17))
        if (dateOfThisLoop.getMonth() === 0) {
          labelsArray.push(`${dateOfThisLoop.getFullYear()}-01`)
        } else {
          labelsArray.push('')
        }
      }
    }
    return labelsArray
  }

  const data = {
    labels: labels(),
    datasets: [
      {
        data: historyData(),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        xAxisID: 'x',
      },
    ],
  }
  const options = {
    scales: {
      x: {
        position: 'top' as const,
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]): string | string[] => {
            const currentDate = new Date()
            const specifiedDate = new Date()
            specifiedDate.setMonth(currentDate.getMonth() - Math.abs(tooltipItems[0].dataIndex - 17))
            return `${specifiedDate.getFullYear()}年 ${specifiedDate.getMonth() + 1}月`
          },
        },
      },
    },
  }
  return <Line data={data} options={options} />
}
