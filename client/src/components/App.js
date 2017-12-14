import React from 'react';
import logo from './logo.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e){
    e.preventDefault();
    
    let params = {};
    for(let i = 0; i < e.target.elements.length; i++){
      params[e.target.elements[i].name] = e.target.elements[i].value;
    }

    fetch('http://localhost:8081/api/padaliniai/login/' + params['username'] + '/' + params['password'], {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"jis" : "jonas", "ji": "ona"})
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <form action="" onSubmit={this.handleSubmit} method="GET" name="login">
              <label htmlFor="username">Vartotojo vardas: </label> 
              <input type="text" name="username" id="username"/>

              <label htmlFor="password">Slaptažodis: </label>
              <input type="password" name="password" id="password"/>

              <button type="submit" name="isSubmited">Prisijugti</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
