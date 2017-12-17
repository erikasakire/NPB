import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';

class Darbuotojas extends React.Component {
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
        fetch('http://localhost:8081/api/padaliniai/Darbuotojas/8904', {
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

            if(a.Etatas === '1'){
                e="Pilnas etatas";
            }
            else if(a.Etatas === '0.5'){
                e="Puse etato"
            }
            else if(a.Etatas === '0.75'){
                e="0.75 etato";
            }
            else{
                e=a.Etatas;
            }
            eilutes.push(
                <div key={i}>
                    <h4>Vardas ir Pavardė:</h4>
                    <h3>{a.Vardas} {a.Pavarde}</h3>
                    <hr/>
                    <h4>Tabelio numeris:</h4>
                    <h3>{a.Tabelio_nr}</h3>
                    <hr/>
                    <h4>Išsilavinimas:</h4>
                    <h3>{a.Issilavinimas}</h3>
                    <hr/>
                    <h4>Etatas:</h4>
                    <h3>{e}</h3>
                    <hr/>
                    <h4>Stažas:</h4>
                    <h3>{a.Stazas} metai.</h3>
                </div>
            )
        }
        console.log(this.state);
        for(let i = 0; i< this.state.data.data.length; i++){
            let b = this.state.data.data[i];
            padaliniai.push(
                <div>
             <ul style={{ listStyle: "none", margin:"0", border: "1px solid #dadadada" }}>
                    <li style={{fontWeight: "600"}}>Padaliniai, kuriuose dirba: </li>
            </ul>
            <div style={{overflow: "auto",  border: "1px solid #dadadada"}}>
                <h4>Padalinio inventorinis numeris:</h4>
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
            <div id="wraper">
                <h2 style={{
                    textAlign: "center",
                    color: "#985E6D",
                    paddingBottom: "50px"
                }}>Darbuotojo informacija</h2>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: "1"}}>
                        {eilutes}
                    </div>
                    <div style={{ flex: "0.7", marginLeft: "50px"}}>
                        {padaliniai}
                    </div>
                </div>
            </div>
        );
    }
}

export default Darbuotojas;