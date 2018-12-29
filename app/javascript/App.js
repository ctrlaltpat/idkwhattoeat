import React from 'react'

class App extends React.Component {
  render () {
    fetch('/api/v1/users')
      .then(res => res.json())
      .then(data => console.log('test successful ->', data))
    const anotherTest = process.env.JUST_A_TEST
    console.log(anotherTest)
    return (
      <div>yooooo</div>
    )
  }
}

export default App