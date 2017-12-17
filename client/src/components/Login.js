/** Module imports */
import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

/** Redux components */
import { connect } from 'react-redux';
import { login_user as accessControlLogin } from '../store/actions/loginActions';
import { login_user as userDataLogin } from '../store/actions/userDataActions';

/** Configuration imports */
import config from '../config.json';


class Login extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: "",
            password: "",
            loading: false,
            error: undefined
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.addError = this.addError.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();

        if (this.state.username == ""){
            return this.addError('Prašome įvesti vartotojo vardą');
        }
        if (this.state.password == ""){
            return this.addError('Prašome įvesti slaptažodį');
        }

        fetch(config.server + '/sistemosprieinamumas/prisijungti', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password
            })
        })
        .then(response => {
            if (response.status == 400){
                this.addError('Blogi prisijungimo duomenys');
                return null;
            }

            if (response.status == 200){
                return response.json();
            }
        })
        .then(response => {
            if(response == null){
                return null;
            }
            this.props.loginAction(response);
            this.props.userDateAction(response);
            this.props.history.push('/');
        })

    }

    addError(message){
        this.setState({
            error: message,
            loading: false,
            password: ""
        });
    }

    render() {
        let loading = this.state.loading;
        return (
            <div>
                <Modal show={true}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>
                            <ModalTitle>Prisijungimas</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            { this.state.error == undefined ? null : <p>{this.state.error}</p> }
                            <FormGroup controlId="username">
                                <ControlLabel>Prisijungimo vardas:</ControlLabel>
                                <FormControl type="text" value={this.state.username} placeholder="Įveskite prisijungimo vardą" onChange={(e) => this.setState({username: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="password">
                                <ControlLabel>Slaptažodis:</ControlLabel>
                                <FormControl type="password" value={this.state.password} placeholder="Įveskite slaptažodį" onChange={(e) => this.setState({password: e.target.value})}/>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" disabled={loading} onClick={() => this.setState({loading: true})}>
                                { loading ? 'Prisijungiama...' : 'Prisijungti'}
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default withRouter(connect(
    state => {
        return {
            logged: state.login
        }
    },
    dispatch => {
        return {
            loginAction: (data) => {
                return dispatch(accessControlLogin({
                            key: data.accessKey
                        }));
            },
            userDateAction: (data) => {
                return dispatch(userDataLogin({
                    Vardas: data.Vardas,
                    Pavarde: data.Pavarde,
                    Pareigos: data.Pareigos,
                    PareiguKodas: data.PareiguKodas                
                }));
            }
        }
    }
)(Login))