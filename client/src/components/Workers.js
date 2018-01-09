/** Module imports */
import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

/** JSON imports */
import config from '../config.json';

class Workers extends React.Component{
    constructor (props){
        super(props);

        this.state = {
            data: {
                empty: true,
                fetched: false,
                data: null,
            }
        }

        this.fetchData = this.fetchData.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    componentDidMount(){
        this.fetchData();
    }
    

    fetchData(){
        fetch(config.server + '/sistemosprieinamumas/darbuotojai', {
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

    showInfo(e){

    }

    render(){
        if (["1", "2"].indexOf(this.props.rangas) == -1){
            return <Redirect to='/'/>;
        }

        let rows = null;
        if(this.state.data.empty){
            if(this.state.data.fetched){
                rows =
                    <tr>
                        <td colSpan="5" className="statusMessage">Darbuotojų nėra</td>
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
                        <td>
                            <a onClick={this.showInfo}>{value.Tabelio_nr}</a>
                        </td>
                        <td>{value.Vardas}</td>
                        <td>{value.Pavarde}</td>
                        <td>{value.rangai}</td>
                    </tr>
                );
            });
        }

        return(
            <div id="wraper">
                <h2 className="Title">Darbuotojų duomenys</h2>
                <table id="table">
                    <tbody>
                        <tr>
                            <th>Tabelio numeris</th>
                            <th>Vardas</th>
                            <th>Pavarde</th>
                            <th>Pareigos</th>
                            <th></th>
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            rangas: state.user.rangas.id
        }
    }
)(Workers);