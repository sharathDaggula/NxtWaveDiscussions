import {Component} from 'react'

import './index.css'

import {v4 as uuidv4} from 'uuid'

import MoneyDetails from '../MoneyDetails'

import TransactionItem from '../TransactionItem'

const transactionTypeOptions = [
  {
    optionId: 'INCOME',
    displayText: 'Income',
  },
  {
    optionId: 'EXPENSES',
    displayText: 'Expenses',
  },
]

// Write your code here
class MoneyManager extends Component {
  state = {title: '', amount: '', type: 'INCOME', historyList: []}

  onChangeTitle = event => {
    this.setState({
      title: event.target.value,
    })
  }

  onChangeAmount = event => {
    this.setState({
      amount: event.target.value,
    })
  }

  onChangeType = event => {
    this.setState({
      type: event.target.value,
    })
  }

  onAddHistoryList = event => {
    event.preventDefault()
    const {title, amount, type} = this.state
    const parsedAmount = parseInt(amount)
    if (title !== '' && amount !== '' && type !== '') {
      const newHistoryItem = {
        id: uuidv4(),
        title,
        amount: parsedAmount,
        type,
      }
      this.setState(prevState => ({
        historyList: [...prevState.historyList, newHistoryItem],
        title: '',
        amount: '',
      }))
    }
  }

  onDeleteHistoryItem = id => {
    this.setState(prevState => ({
      historyList: [...prevState.historyList.filter(each => id !== each.id)],
    }))
  }

  render() {
    const {title, amount, type, historyList} = this.state
    return (
      <div className="bg-container">
        <div className="top-container">
          <h1 className="top-name">Hi, Richard</h1>
          <p className="top-description">
            Welcome back to your{' '}
            <span className="top-description-highlight">Money Manager</span>
          </p>
        </div>

        <MoneyDetails historyList={historyList} />

        <div className="form-and-history-container">
          <form className="html-form" onSubmit={this.onAddHistoryList}>
            <h1 className="form-heading">Add Transaction</h1>
            <label htmlFor="title" className="label-styling">
              TITLE
            </label>
            <br />
            <input
              type="text"
              id="title"
              placeholder="TITLE"
              className="input-styling"
              onChange={this.onChangeTitle}
              value={title}
            />
            <br />
            <label htmlFor="amount" className="label-styling">
              AMOUNT
            </label>
            <br />
            <input
              type="text"
              id="amount"
              placeholder="AMOUNT"
              className="input-styling"
              onChange={this.onChangeAmount}
              value={amount}
            />
            <br />
            <label className="label-styling" htmlFor="type">
              TYPE
            </label>
            <br />
            <select
              id="type"
              className="input-styling"
              onChange={this.onChangeType}
              value={type}
            >
              {transactionTypeOptions.map(eachOption => (
                <option key={eachOption.optionId} value={eachOption.optionId}>
                  {eachOption.displayText}
                </option>
              ))}
            </select>
            <br />
            <button className="add-button" type="submit">
              Add
            </button>
          </form>
          <div className="history-container">
            <h1 className="history-heading">History</h1>
            <div className="history-columns-container">
              <p className="column-name-styling">Title</p>
              <p className="column-name-styling">Amount</p>
              <p className="column-name-styling extra-space">Type</p>
            </div>
            <ul className="history-unordered-list">
              {historyList.map(eachItem => (
                <TransactionItem
                  key={eachItem.id}
                  eachItem={eachItem}
                  onDeleteHistoryItem={this.onDeleteHistoryItem}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default MoneyManager
