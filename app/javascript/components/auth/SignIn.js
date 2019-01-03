import React from 'react'

import API from '../../api/RailsAPI'

class SignIn extends React.Component {
  state = {
    signInForm: true,
    user: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { signin } = this.props
    const user = this.state.user
    this.state.signInForm ? 
      API.signin({username: user.username, password: user.password})
        .then(data => {
          if (data.error) {
            console.log(data.log)
          } else {
            signin(data)
          }
        })
      :
      API.signup({user: user})
        .then(data => {
          if (data.error) {
            alert(data.error)
          } else {
            signin(data)
          }
        })
  }

  changeForm = () => {
    this.setState({
      signInForm: !this.state.signInForm
    })
  }

  handleChange = event => {
    this.setState({ 
      user: {
        ...this.state.user,
        [event.target.name]: event.target.value } 
    })
  }

  componentDidMount(){
    this.props.doneLoading()
  }

  render () {
    const { username, password, firstname, lastname, email } = this.state.user
    const { handleChange, handleSubmit, changeForm } = this

    return (
      <React.Fragment>
        {
          this.state.signInForm ? 
          <form onSubmit={handleSubmit} className="sign-in-form">
            <h1><img src="idkwhattoeat_logo.png" alt="IDKWhatToEat"/></h1>
            <div className="input_holder">
              {/* <label htmlFor="username">Username:</label> */}
              <input type="text" id="username" name="username" placeholder="Username*" onChange={handleChange} value={username}/>
            </div>
            <div className="input_holder">
              {/* <label htmlFor="password">Password:</label> */}
              <input type="password" id="password" name="password" placeholder="Password*" onChange={handleChange} value={password}/>
            </div>
            <div className="input_holder">
              <button className="btn--ripple wh" type="submit">Sign In</button>
            </div>
            <p className="message">Not registered? <span className="change-form-button" onClick={changeForm}>Sign up.</span></p>
          </form>
          :
          <form onSubmit={handleSubmit} className="sign-up-form">
            <h1><img src="idkwhattoeat_logo.png" alt="IDKWhatToEat"/></h1>
            <div className="input_holder">
              <input type="text" id="username" name="username" placeholder="Username*" onChange={handleChange} value={username}/>
            </div>
            <div className="input_holder">
              <input type="text" id="firstname" name="firstname" placeholder="First Name*" onChange={handleChange} value={firstname}/>
            </div>
            <div className="input_holder">
              <input type="text" id="lastname" name="lastname" placeholder="Last Name" onChange={handleChange} value={lastname}/>
            </div>
            <div className="input_holder">
              <input type="email" id="email" name="email" placeholder="Email*" onChange={handleChange} value={email}/>
            </div>
            <div className="input_holder">
              <input type="password" id="password" name="password" placeholder="Password*" onChange={handleChange} value={password}/>
            </div>
            <div className="input_holder">
              <button className="btn--ripple wh" type="submit">Sign Up</button>
            </div>
            <p className="message">Already registered? <span className="change-form-button" onClick={changeForm}>Sign in.</span></p>
          </form>
        }
      </React.Fragment>
    )
  }
}

export default SignIn