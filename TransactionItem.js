// Write your code here
import './index.css'

const TransactionItem = props => {
  const {eachItem, onDeleteHistoryItem} = props
  const {title, amount, type, id} = eachItem
  const onClickDeleteHistory = () => {
    onDeleteHistoryItem(id)
  }
  return (
    <li className="history-item">
      <p className="history-text">{title}</p>
      <p className="history-text">Rs {amount}</p>
      <p className="history-text extra-space">{type}</p>
      <button type="button" onClick={onClickDeleteHistory} data-testid="delete">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
          alt="delete"
          className="delete-icon"
        />
      </button>
    </li>
  )
}
export default TransactionItem
