import React from 'react'
import '../styles/login.css'

class Login extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            nick: ""
        };
    }
    render() {
        return (
            <div class="container">
                <form id="loginForm">
                    <h2>Prisijungimas</h2>
                    <div class="dflex horizontalFlex">
                        <label class="flex">Name</label>
                        <input type="text" name="nick" class="flex" onChange={(e) => {this.setState({nick: e.target.value})}}/>
                    </div>
                    <div class="dflex horizontalFlex">
                        <label class="flex">Pass</label>
                        <input type="text" name="pass" class="flex"/>
                    </div>
                    <div class="dflex horizontalFlex">
                        <input type="submit" value="Login" class="btn btn-success flex"/>
                        <input type="submit" value="Forgot pass?" class="btn btn-warning flex"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login