// Write your code here
import './index.css'

const MoneyDetails = props => {
  const {historyList} = props
  let yourBanalce = 0
  let yourIncome = 0
  let yourExpenses = 0
  historyList.forEach(eachItem => {
    const {amount, type} = eachItem
    const parsedAmount = parseInt(amount) || 0
    if (type === 'INCOME') {
      yourBanalce += parsedAmount
      yourIncome += parsedAmount
    } else {
      yourBanalce -= parsedAmount
      yourExpenses += parsedAmount
    }
  })

  return (
    <div className="unordered-list">
      <li className="list-item li-1">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/balance-image.png"
          alt="balance"
          className="balance-image"
        />
        <div>
          <p className="list-item-description">Your Balance</p>
          <p className="list-item-heading" data-testid="balanceAmount">
            Rs {yourBanalce}
          </p>
        </div>
      </li>

      <li className="list-item li-2">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/income-image.png"
          alt="income"
          className="balance-image"
        />
        <div>
          <p className="list-item-description">Your Income</p>
          <p className="list-item-heading" data-testid="incomeAmount">
            Rs {yourIncome}
          </p>
        </div>
      </li>

      <li className="list-item li-3">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/expenses-image.png"
          alt="expenses"
          className="balance-image"
        />
        <div>
          <p className="list-item-description">Your Expenses</p>
          <p className="list-item-heading" data-testid="expensesAmount">
            Rs {yourExpenses}
          </p>
        </div>
      </li>
    </div>
  )
}
export default MoneyDetails

