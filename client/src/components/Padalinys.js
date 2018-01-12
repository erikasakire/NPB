import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';
import { connect } from 'react-redux';
import config from '../config.json';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Padalinys extends React.Component {
    constructor(props){
        super(props);

        /** Saugoma esama būsena */
        this.state = {
            data: {
                data: [],
                produktaiPadal: [],
                dirbantys: [],
                laisvi: []
            },
            showModal: false,
            form: null
        };

        this.fetchData = this.fetchData.bind(this);
        this.AtleidziamDarbutojas = this.AtleidziamDarbutojas.bind(this);
        this.OpenModal = this.OpenModal.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.getSelectedOption = this.getSelectedOption.bind(this);  
        this.TrinamLauk = this.TrinamLauk.bind(this);      
    }
    
    componentWillMount(){
        this.fetchData();
    }
    fetchData (){
        fetch(config.server + '/padaliniai/' + this.props.match.params.id, {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
           this.setState({data: response});
        })
    }
   
    AtleidziamDarbutojas(e){
        let id = e.target.attributes['atleidimas'].nodeValue;
        fetch(config.server + '/padaliniai/atleistiDarb', {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Darbuotojas_Tabelio_nr": id
            })
        })
        .then(response => {
            if (response.status == 200) {
                this.fetchData();
                NotificationManager.success("Darbuotojas sėkmingai ištrintas.");
            }
        })
    }
    OpenModal(e){       
        this.setState({
            showModal: true,
        });
    }
    handleFormChange(e){
        this.setState({form: e.target.value})
    }
    handleSubmit(e){
        e.preventDefault();

        if (this.getSelectedOption("worker_select") == null){
            return this.addError('Prašome pasirinkti darbuotoją');
        }
        else{
            fetch(config.server + '/padaliniai/samdytiEilini', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "darbuotojas": this.getSelectedOption("worker_select"),
                    "padaliniys": this.state.data.data[0].Inventorinis_numeris
                })
            })
        .then(response => {
            if(response.status == 200){
                this.setState({showModal: false});
                this.fetchData();
                NotificationManager.success("Darbuotojas sėkmingai pasamdytas.");
            }
        })
        }
    }
    getSelectedOption(id){
        let selectObject = document.getElementById(id);
        if (selectObject == undefined){
              return null;
        }
        let options = selectObject.options;
        for(let i = 0; i < options.length; i++){
              if (options[i].selected){
                    return options[i].value;
              }
        }

        return null;
  }
    addError(m){
        this.setState({
            error: m
        })
    }
    showNotification(e){
        if (this.state.data.data.length == 0){
            return 0;
        }
       
        NotificationManager.warning("Nėra laisvų darbuotojų.");
    }
    TrinamLauk(e){
        let pa = e.target.parentNode.attributes['pa'].nodeValue;
        let id = e.target.parentNode.attributes['delete'].nodeValue;
        console.log(pa);
        console.log(id);
        fetch(config.server + '/padaliniai/salintiProdukta/' + pa + '/' + id, {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.status == 200) {
                this.fetchData();
                NotificationManager.success("Produktas sėkmingai ištrintas iš padalinio.");
            }
        })
    }
    render(){
        if (this.state.data.data.length == 0 ){
            return (
                <div class="pre-loader"></div>
            );
        }

        let padaliniai = [];
        let produktai = [];
        let tiekimas = '';
        let dirbantys = [];
        let samd= [];
        let padal = '';
        for(let i = 0; i < this.state.data.data.length; i++){
            let b = this.state.data.data[i];
            padal=b.Inventorinis_numeris;
            padaliniai.push(
                <div>
                <div style={{ backgroundColor: "#192231"}}>
                    <h2 style={{ color: "#494E6B", textHeight: "50px", display: "block", padding: "10px", marginBottom:"0px"}}>Pagrindinė informacija apie padalinį: </h2>
                </div>
                <div style={{backgroundColor:"rgb(196, 201, 228)"}}>
                <h4 style={{marginTop:"0px"}}>Inventorinis numeris:</h4>
                    <p>{b.Inventorinis_numeris}</p>
                    <h4>Pavadinimas</h4>
                    <p>{b.padalinio_pavadinimas}</p>
                    <h4>Šalis:</h4>
                    <p>{b.Salis}</p>
                    <h4>Miestas:</h4>
                    <p>{b.Miestas}</p>
                    {b.Regionas != ''? 
                    <div>
                    <h4>Regionas:</h4>
                    <p>{b.Regionas}</p></div> :
                    null
                    }
                    {b.Rajonas != ''? 
                    <div>
                    <h4>Rajonas:</h4>
                    <p>{b.Rajonas}</p></div> :
                    null
                    }
                </div>
            </div>
            );
        }

        for(let i = 0; i < this.state.data.produktaiPadal.length; i++){
            let a = this.state.data.produktaiPadal[i];

            if(a.Tiekiama == '1'){
                tiekimas = "Tiekiama";
            }
            else{
                tiekimas = "Netiekiama";
            }
            produktai.push(
                <tr key={i} className="aprasymas">
                    <td>{a.Barkodas}</td>
                    <td>{a.Pavadinimas}</td>
                    <td>{a.Vieneto_kaina} &euro;</td>
                    <td>{a.padalinio_pavadinimas}</td>
                    <td>{tiekimas}</td>
                      {/** Prekės ištrynimo ir redagavimo mygtukai. Spausdinami tik redaktoriui ir administratoriui. */}
                      {
                        ["1","2"].indexOf(this.props.rangas) != "-1" ? 
                        <td>
                            <a id="ForButtons" delete={a.Barkodas} pa={padal} onClick={this.TrinamLauk}><span class="glyphicon glyphicon-trash"> </span></a> 
                        </td> : 
                        null 
                    }
                </tr>
            );
        }
  
        for(let i = 0; i < this.state.data.dirbantys.length; i++){
            let c = this.state.data.dirbantys[i];
  
            dirbantys.push(
                <tr key={i} className="aprasymas">
                    <td>{c.Darbuotojas_Tabelio_nr}</td>
                    <td>{c.Vardas}</td>
                    <td>{c.Pavarde}</td>
                    <td>{c.Issilavinimas}</td>
                    {["1"].indexOf(this.props.rangas) != "-1" ?
                    <td><a style={{color: "#985E6D", textDecoration: "none", cursor:"pointer"}} atleidimas={c.Darbuotojas_Tabelio_nr} onClick={this.AtleidziamDarbutojas}>Atleisti</a></td> :
                    null}
                </tr>
            );

        }
        for(let i = 0; i < this.state.data.laisvi.length; i++){
            let d = this.state.data.laisvi[i];
                samd.push(
                  <option key={i} value={d.Tabelio_nr}>{d.Vardas + " " + d.Pavarde}</option>
                );
        }
        return(
            <div id="wraper" >
                <h2 style={{
                        textAlign: "center",
                        color: "#985E6D",
                        paddingBottom: "50px"
                    }}>Padalinio informacija</h2>           
                    
                <div style={{ marginLeft: "50px", minWidth: "160px"}}>
                    {padaliniai}
                    <hr/>
                </div>
        
                <div>
                    <h3 style={{color: "#985E6D"}}>Prekės padalinyje:</h3>
                </div>
                
                <table style={{ width: "100%"}}>
                    <tbody>
                        <tr>
                            <th>Barkodas</th>
                            <th>Pavadinimas</th>
                            <th>Kaina</th>   
                            <th>Padalinys</th>
                            <th>Tiekiama</th>
                            <th></th>
                        </tr>
                        {produktai}
                    </tbody>
                </table>     

                <div>
                    <h3 style={{color: "#985E6D"}}>Dirbantys darbuotojai:</h3>
                </div>
                {["1"].indexOf(this.props.rangas) != "-1" ?
                <div style={{textAlign: "right"}}>
                    <a onClick={this.state.data.laisvi.length > 0? this.OpenModal: this.showNotification} style={{textDecoration: "none", color: "#494E68", cursor: "pointer", fontWeight: "bold"}}>Pasamdyti naują darbuotoją + </a>
                </div> :
                null}
                <table style={{ width: "100%", marginBottom: "40px"}}>
                    <tbody>
                        <tr>
                            <th>Tabelio numeris</th> 
                            <th>Vardas</th>
                            <th>Pavardė</th>  
                            <th>Issilavinimas</th>
                            <th></th>
                        </tr>
                        {dirbantys}
                    </tbody>
                </table>  
                {this.state.showModal == false ? null :  
                <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle> Pasamdykite naują darbuotoją: </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            { this.state.error == undefined ? null : <p>{this.state.error}</p>}
                                <FormGroup controlId="worker_select">
                                    <ControlLabel>Pasirinkite darbuotoją:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Darbuotojas_Tabelio_nr">
                                        {samd}
                                    </FormControl>
                                </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit">Patvirtinti</Button>
                        </ModalFooter>
                    </form>
                </Modal>}
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
)(Padalinys);