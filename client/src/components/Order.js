import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import config from "../config.json";

export default class Orders extends React.Component {
    constructor (props){
        super(props);

        this.state = {
            data: {
                empty: true,
                fetched: false,
                data: null,
            },
            info: {
                show: false,
                fetched: false,
                data: null,
                order: null,

                onShow: (e) => {
                    let id = e.target.id;
                    this.setState({
                        info: Object.assign({}, this.state.info, {
                            show: true,
                            order: id
                        })
                    });
                    return this.state.info.fetchData(id);
                },
                fetchData: (id) => {
                    fetch(config.server + '/uzsakymuvykdymas/uzsakymai/' + id, {
                        method: "GET"
                    })
                    .then(response => {
                        switch(response.status){
                            case 200: {
                                response.json().then(response => {
                                    this.setState({
                                        info: Object.assign({}, this.state.info, {
                                            fetched: true,
                                            data: response.data,
                                        })
                                    });
                                });
                                break;
                            }
                            case 204: {
                                this.setState(Object.assign({}, this.state.info, {fetched: true}));
                                break;
                            }
                            default: {
                                response.json().then(response => {
                                    console.log(response.error);
                                });
                                break;
                            }

                        }
                    })
                },
                onHide: () => {
                    this.setState({
                        info: Object.assign({}, this.state.info, {
                            show: false,
                            fetched: false,
                            data: null,
                            order: null
                        })
                    });
                }
            },
            update: {
                show: false,
                fetched: false,
                data: null,
                order: null,
                error: null,

                onShow: (e) => {
                    this.setState({
                        update: Object.assign({}, this.state.update, {
                            show: true,
                            order: e.target.id
                        })
                    });
                    return this.state.update.fetchData(e.target.id);
                },
                onHide: () => {
                    this.setState({
                        update: Object.assign({}, this.state.update, {
                            show: false,
                            fetched: false,
                            data: null,
                            order: null,
                            error: null
                        })
                    });
                },
                fetchData: (e) => {
                    fetch(config.server + '/uzsakymuvykdymas/busenos', {
                        method: "GET",
                    })
                    .then(response => {
                        switch(response.status){
                            case 200: {
                                response.json().then(response => {
                                    this.setState({
                                        update: Object.assign({}, this.state.update, { 
                                            fetched: true,
                                            data: response.data
                                         })
                                    });
                                });
                                break;
                            }
                            default: {
                                console.log('error');
                                break;
                            }
                        }
                    })
                },
                onSubmit: (e) => {
                    e.preventDefault();

                    let option = null;
                    let select = document.getElementById('stateSelect');
                    for(let i = 0; i < select.options.length; i++){
                        if (select.options[i].selected){
                            option = select.options[i];
                            break;
                        }
                    }

                    fetch(config.server + '/uzsakymuvykdymas/pakeisti_busena', {
                        method: "POST",
                        headers: {
                            "Accept": "aplication/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            numeris: this.state.update.order,
                            busena: option.value
                        })
                    })
                    .then(response => {
                        switch(response.status){
                            case 200: {
                                this.fetchData();
                                this.state.update.onHide();
                                break;
                            }
                            default: {
                                this.setState({
                                    error: "Įvyko klaida"
                                });
                                break;
                            }
                        }
                    })
                }
            }
        }

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData(){
        fetch(config.server + '/uzsakymuvykdymas/uzsakymai', {
            method: "GET"
        })
        .then(response => {
            switch(response.status){
                case 200: {
                    response.json().then(response => {
                        this.setState({
                            data: {
                                empty: false,
                                fetched: true,
                                data: response.data
                            }
                        });
                    });
                    break;
                }
                case 204: {
                    this.setState({
                        data: Object.assign({}, this.state.data, {
                            fetched: true
                        })
                    });
                    break;
                }
                default: {
                    console.log("Error");
                }
            }
        });
    }
    render(){
        let rows = null;
        if(this.state.data.empty){
            if(this.state.data.fetched){
                rows =
                    <tr>
                        <td colSpan="5" className="statusMessage">Užduočių nėra</td>
                    </tr>;
            } 
            else {
                rows = 
                    <tr>
                        <td colSpan="5" className="statusMessage">Prašome palaukti</td>
                   </tr>;
            }
        } 
        else {
            rows = this.state.data.data.map((value, key) => {
                return (
                    <tr key={key}>
                        <td>{value.Numeris}</td>
                        <td>{value.Uzsakymo_data.substring(0, 10)}</td>
                        <td>{value.Busena}</td>
                        <td>{value.Prioritetas}</td>
                        <td>
                            <a id={value.Numeris} onClick={this.state.info.onShow}>Išsamiau</a> |
                            <a id={value.Numeris} onClick={this.state.update.onShow}>Pakeisti Būseną</a>
                        </td>
                    </tr>
                );
            });
        }

        let modal = null;
        if(this.state.info.show){
            modal = 
            <Modal show={this.state.info.show} onHide={this.state.info.onHide}>
                <ModalHeader closeButton>
                    <ModalTitle>Užsakymo nr. {this.state.info.order} informacija</ModalTitle>
                </ModalHeader>
                {
                    this.state.info.fetched ?
                    <ModalBody>
                        <div className="dflex">
                            <p className="flex">Numeris:</p>
                            <p className="flex">{this.state.info.data.Numeris}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Užsakymo data:</p>
                            <p className="flex">{this.state.info.data.Uzsakymo_data.substring(0, 10)}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Atlikimo data:</p>
                            <p className="flex">{this.state.info.data.Atlikimo_data != null ? this.state.info.data.Atlikimo_data.substring(0, 10) : 'Neatlikta'}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Prioritetas</p>
                            <p className="flex">{this.state.info.data.Prioritetas }</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Būsenos ID</p>
                            <p className="flex">{this.state.info.data.Busena}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Suformavusio darbuotojo tabelio numeris:</p>
                            <p className="flex">{this.state.info.data.Suformavo}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Priskirtas vairuotojas:</p>
                            <p className="flex">{this.state.info.data.Vairuotojas || "Nepriskirtas"}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Priskirta transporto primonė:</p>
                            <p className="flex">{this.state.info.data.TransportoPriemone || "Nepriskirta"}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Iš padalinio</p>
                            <p className="flex">{this.state.info.data.IsPadalinio}</p>
                        </div>
                        <div className="dflex">
                            <p className="flex">Į padalinį</p>
                            <p className="flex">{this.state.info.data.IPadalini}</p>
                        </div> 
                    </ModalBody> :
                    <ModalBody>
                        <p className="statusMessage">Prašome palaukti</p>
                    </ModalBody>
                }
            </Modal>
        }

        let updateState = null;
        if (this.state.update.show){
            modal = 
            <Modal show={this.state.update.show} onHide={this.state.update.onHide}>
                <form onSubmit={this.state.update.onSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle>Užsakymo nr. {this.state.update.order} būsenos keitimas</ModalTitle>
                    </ModalHeader>
                    {
                        this.state.update.fetched ?
                        <ModalBody>
                            <FormGroup controlId="stateSelect">
                                <ControlLabel>Pasirinkite naują būseną</ControlLabel>
                                <FormControl componentClass="select">
                                    {
                                        this.state.update.data.map((value, key) => {
                                            return(
                                                <option value={value.Busenos_id}>{value.Busenos_pavadinimas}</option>
                                            )
                                        })
                                    }
                                </FormControl>
                            </FormGroup>
                        </ModalBody> :
                        <ModalBody>
                            <p className="statusMessage">Prašome palaukti</p>
                        </ModalBody>
                    }
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
        }
             
        return(
            <div>
                <h2 className="title">Užsakymų duomenys</h2>
                <table id="table">
                    <tbody>
                        <tr>
                            <th>Numeris</th>
                            <th>Sukūrimo data</th>
                            <th>Būsena</th>
                            <th>Prioritetas</th>
                            <th></th>
                        </tr>
                        {rows}
                    </tbody>
                </table>
                {modal}
                {updateState}
            </div>
        );
    }
}