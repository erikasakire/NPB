import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import config from '../config.json'

class Preke extends React.Component {
    constructor(props){
        super(props);

        /** Saugoma esama būsena */
        this.state = {
            data: {
                data: [],
            },
        };

        this.fetchData = this.fetchData.bind(this);
    }
    
    componentWillMount(){
        this.fetchData();
    }
    fetchData (){
        fetch(config.server + '/produkcija/Produktas/' + this.props.match.params.id, {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
           this.setState({data: response});
            console.log(response);
        })
    }

    render(){
        if (this.state.data.data.length == 0 ){
            return (
                <div class="pre-loader"></div>
            );
        }

        let eilutes = [];
        let padaliniai = [];
        let padalKiekis = [];
        let e = '';

        for(let i = 0; i < this.state.data.data.length; i++){
            let a = this.state.data.data[i];

            if(a.Tiekiama == '1'){
                e="Tiekiama";
            }
            else{
                e="Netiekiama";
            }
            if(i>0){ break;}
            eilutes.push(
                <div key={i}>
                    <div style={{ backgroundColor: "#192231"}}>
                        <h2 style={{ color: "#494E6B", textHeight: "50px", display: "block", padding: "10px", marginBottom:"0px"}}>Pagrindinė informacija apie produktą: </h2>
                    </div>
                    <div style={{backgroundColor:"rgb(196, 201, 228)"}}>
                    <h4 style={{marginTop:"0px"}}>Barkodas:</h4>
                    <h3>{a.Barkodas}</h3>
        
                    <h4>Produkto pavadinimas:</h4>
                    <h3>{a.Pavadinimas}</h3>
          
                    <h4>Kategorija:</h4>
                    <h3>{a.Kategorijos_pavadinimas}</h3>
             
                    <h4>Ar vykdomas tiekimas:</h4>
                    <h3>{e}</h3>
        
                    <h4>Vieneto kaina:</h4>
                    <h3>{a.Vieneto_kaina} &euro;</h3>
        
                    <h4>Gamintojas:</h4>
                    <h3>{a.Gamintojas}</h3>
  
                    <h4>Pagaminimo data:</h4>
                    <h3>{a.Pagaminimo_data.substring(0,10)}</h3>

                    <h4>Galioja iki:</h4>
                    <h3>{a.Galioja_iki.substring(0,10)}</h3>
                    {a.Aprasymas != "" ?
                       <div>
                            <div>
                                <h4>Aprašymas:</h4>
                                <h3>{a.Aprasymas}</h3>
                            </div> 
                        </div>:
                        null
                    }
                    </div>
                </div>
            );
        }
        for(let i = 0; i< this.state.data.data.length; i++){
            let b = this.state.data.data[i];
            console.log(b);
            console.log(this.state.data.data.length);
            padaliniai.push(              
                <tr key={i} className="aprasymas">
                    <td>{b.Inventorinis_numeris}</td>
                    <td>{b.padalinio_pavadinimas}</td>
                    <td>{b.Salis}</td>
                    <td>{b.Miestas}</td>
                    <td>{b.Kiekis} {b.Matavimo_vnt != ""? "Vnt.": b.Matavimo_vnt}</td>
                </tr>
            );
        }
        return(
            <div id="wraper" >
            <h2 style={{
                    textAlign: "center",
                    color: "#985E6D",
                    paddingBottom: "50px"
                }}>Produkto informacija</h2>
           
                <div style={{ minWidth:"160px" }}>
                    {eilutes}
                </div>
                <h2 style={{
                        textAlign: "center",
                        color: "#985E6D",
                        paddingBottom: "50px"
                    }}>Padaliniai, kuriuose yra prekė</h2> 

                <table style={{ width: "100%", marginBottom: "40px"}}>
                    <tbody>
                        <tr>
                            <th>Inventorinis numeris</th>
                            <th>Pavadinimas</th>
                            <th>Šalis</th>
                            <th>Miestas</th>
                            <th>Prekės kiekis šiame padalinyje</th>
                        </tr>
                        {padaliniai}
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
)(Preke);