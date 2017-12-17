import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';

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
        fetch('http://localhost:8081/api/produkcija/Produktas/11483', {
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
        let e = '';

        for(let i = 0; i < this.state.data.data.length; i++){
            let a = this.state.data.data[i];

            if(a.Tiekiama == '1'){
                e="Tiekiama";
            }
            else{
                e="Netiekiama";
            }
            eilutes.push(
                <div key={i}>
                    <div style={{ backgroundColor: "#192231"}}>
                        <h2 style={{ color: "#494E6B", textHeight: "50px", display: "block", padding: "10px"}}>Pagrindinė informacija apie produktą: </h2>
                    </div>
                    <h4>Barkodas:</h4>
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
                    <h4>Kiekis:</h4>
                    <h3>{a.Kiekis} {a.Matavimo_vnt != null? null: a.Matavimo_vnt}</h3>
                    <hr/>
                    <h4>Gamintojas:</h4>
                    <h3>{a.Gamintojas}</h3>
                    <hr/>
                    <h4>Pagaminimo data:</h4>
                    <h3>{a.Pagaminimo_data.substring(0,10)}</h3>
                    <hr/>
                    <h4>Galioja iki:</h4>
                    <h3>{a.Galioja_iki.substring(0,10)}</h3>
                    <h4>Aprašymas:</h4>
                    <h3>{a.Aprasymas}</h3>
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
                <hr/>
            </div>
            </div>
            );
        }
        return(
            <div id="wraper" >>
                <h2 style={{
                    textAlign: "center",
                    color: "#985E6D",
                    paddingBottom: "50px"
                }}>Produkto informacija</h2>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: "1"}}>
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

export default Preke;