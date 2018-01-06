import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

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
        fetch('http://localhost:8081/api/produkcija/Produktas/' + this.props.computedMatch.params.id, {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
           this.setState({data: response});
            console.log(response);
        })
    }

    render(){let eilutes = [];
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
                    <hr/>
                    <h4>Produkto pavadinimas:</h4>
                    <h3>{a.Pavadinimas}</h3>
                    <hr/>
                    <h4>Kategorija:</h4>
                    <h3>{a.Kategorijos_pavadinimas}</h3>
                    <hr/>
                    <h4>Ar vykdomas tiekimas:</h4>
                    <h3>{e}</h3>
                    <hr/>
                    <h4>Vieneto kaina:</h4>
                    <h3>{a.Vieneto_kaina} &euro;</h3>
                    <hr/>
                    <h4>Gamintojas:</h4>
                    <h3>{a.Gamintojas}</h3>
                    <hr/>
                    <h4>Pagaminimo data:</h4>
                    <h3>{a.Pagaminimo_data.substring(0,10)}</h3>
                    <hr/>
                    <h4>Galioja iki:</h4>
                    <h3>{a.Galioja_iki.substring(0,10)}</h3>
                    {a.Aprasymas != "" ?
                       <div>
                            <hr/>
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
            padaliniai.push(
                <div>
             <ul style={{ listStyle: "none", margin:"0", border: "1px solid #dadadada" }}>
                <li style={{fontWeight: "600"}}>Padaliniai, kuriuose prekė yra: </li>
            </ul>
            <div style={{overflow: "auto",  border: "1px solid #dadadada"}}>
                <h4>Inventorinis numeris:</h4>
                <p>{b.Inventorinis_numeris}</p>
                <h4>Pavadinimas</h4>
                <p>{b.padalinio_pavadinimas}</p>
                <h4>Šalis:</h4>
                <p>{b.Salis}</p>
                <h4>Miestas:</h4>
                <p>{b.Miestas}</p>
                <h4 style={{fontWeight: "bold"}}>Prekės kiekis šiame padalinyje:</h4>
                    <h3>{b.Kiekis} {b.Matavimo_vnt != null? null: b.Matavimo_vnt}</h3>
                <hr/>
            </div>
            </div>
            );
        }
        return(
            <div id="wraper" >
            <h2 style={{
                    textAlign: "center",
                    color: "#985E6D",
                    paddingBottom: "50px"
                }}>Produkto informacija</h2>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: "1", marginLeft:"-80px" }}>
                        {eilutes}
                    </div>
                    <div style={{ flex: "0.7", marginLeft: "50px"}}>
                        {padaliniai}
                        <hr/>
                    </div>   
                </div>
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