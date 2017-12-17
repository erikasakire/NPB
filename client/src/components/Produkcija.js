import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';

class Produkcija extends React.Component {
    constructor(props){
        super(props);

        /** Saugoma truščios formos duomenys */
        this.formInitialState = {
            Barkodas: "",
            Pavadinimas: "",
            Vieneto_kaina: "",
            Aprasymas: "",
            Matavimo_vnt: "",
            Gamintojas: "",
            PavadinimasEN: "",
            AprasymasEN: "",
            Pagaminimo_data: "",
            Galioja_iki: "",
            Tiekiamas: true,
            Kategorija_Kategorija_id: ""
        }
        /** Saugomos tikrinimo reikšmės reikšmės */
        this.formValidation = {
            Barkodas: {
                /** Lauko tipas */
                regex: /^[0-9]+$/,
                /** Galima tuščia reikšmė */
                nullable: false,
                /** Privalo nesikartotoi */
                unique: true,
                /** Jeigu privalo nesikartoti, funkcija, kuri patikrins ar kartojasi ar ne */
                uniqueFunction: (value) => {
                    for(let i = 0; i < this.state.data.data.length; i++){
                        if (this.state.data.data[i].Barkodas == value){
                            return false;
                        }
                    }
                    return true;
                }
            },
            Pavadinimas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: false,
                unique: false
            },
            Vieneto_kaina: {
                regex:  /^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: false,
                unique: false
            },
            Aprasymas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: true,
                unique: false
            },
            Matavimo_vnt: {
                regex: /[a-zA-Z0-9]/,
                nullable: true,
                unique: false
            },
            Gamintojas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: false,
                unique: false
            },
            PavadinimasEN: {
                regex: /[a-zA-Z]/,
                nullable: true,
                unique: false
            },
            AprasymasEN: {
                regex: /[a-zA-Z]/,
                nullable: true,
                unique: false
            },
            Galioja_iki: {
                regex: /^.+$/,                
                nullable: false,
                unique: false
            },
            Pagaminimo_data: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Tiekiamas: {
                regex:/^[0-1]$/,
                nullable: false,
                unique: false
            },
            Kategorija_Kategorija_id: {
                regex:/^[0-9]+$/,
                nullable: false,
                unique: false
            }
        }

        this.state = {
            data: {
                data: [],
                filtras: [],
                filtras2: []
            },
            showModal: false,
            update: false,
            form: this.formInitialState,
            error: undefined,
            selectedFiltras: "",
            selectedFiltras2: ""
        };
        this.validate = this.validate.bind(this);
        this.OpenUpdate = this.OpenUpdate.bind(this);
        this.OpenModal = this.OpenModal.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.TrinamLauk = this.TrinamLauk.bind(this);
        this.addError = this.addError.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }
    componentWillMount(){
        this.fetchData();
    }
    fetchData (){
        fetch('http://localhost:8081/api/produkcija/visi', {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
            this.setState({data: response});
            console.log(response);
        })
    }

    validate(e){
        let element = document.getElementById(e);
        if (element == undefined){
            return null;
        }

        let value = element.value;
        let configuration = this.formValidation[e];

        if (value == ""){
            return configuration.nullable ? 'success' : 'error' ;
        }

        if(configuration.regex.exec(value) == null){ 
            return 'error'; 
        }

        if (configuration.unique){
            return configuration.uniqueFunction(value) ? 'success' : 'warning';
        }

        return 'success';
    }
    OpenModal(e){
        if (e != undefined){
            this.setState({form: this.formInitialState})
            this.setState({update: false});
        }
        this.setState({showModal:true}); 
    }
    OpenUpdate(e){
        this.setState({update: true});        
        let id = e.target.attributes['update'].nodeValue;
        let element = this.state.data.data.find((element) => {
            if (element.Barkodas == id){
                return element;
            }
        })
        this.setState({form: Object.assign({}, element)});
        this.OpenModal();
    }
    handleFormChange(e){
        let form = Object.assign({}, this.state.form);
        let name = e.target.attributes['fieldname'].nodeValue;
        form[name] = e.target.value;
        this.setState({form: form});
    }

    handleSubmit(e){
        e.preventDefault();
        
        if (this.state.form.Barkodas == ""){
            return this.addError('Prašome įvesti barkodą.');
        }
        if (this.state.form.Pavadinimas == ""){
            return this.addError('Prašome įvesti pavadinimą.');
        }
        if (this.state.form.Vieneto_kaina == ""){
            return this.addError('Prašome įvesti vieneto kainą.');
        }
        if (this.state.form.Gamintojas == ""){
            return this.addError('Prašome įvesti gamintojo pavadinimą.');
        }
        if (this.state.form.Pagaminimo_data == ""){
            return this.addError('Prašome įvesti pagaminimo datą.');
        }
        if (this.state.form.Galioja_iki == ""){
            return this.addError('Prašome įvesti galiojimo datą.');
        }
        if (this.state.form.Tiekiamas == ""){
            return this.addError('Pasirinkite ar tiekiama ar ne.');
        }
        if (this.state.form.Kategorija_Kategorija_id == ""){
            return this.addError('Pasirinkite kategoriją.');
        }
        if(this.state.form.Galioja_iki < this.state.form.Pagaminimo_data){
            return this.addError('Galiojimo data negali būti ankstesnė nei pagaminimo data.')
        }

        if(this.state.update == false){
            console.log(this.state.form);
            fetch('http://localhost:8081/api/produkcija/prideti', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Barkodas":  this.state.form.Barkodas,
                    "Pavadinimas":  this.state.form.Pavadinimas,
                    "Vieneto_kaina":  this.state.form.Vieneto_kaina,
                    "Aprasymas":  this.state.form.Aprasymas,
                    "Matavimo_vnt":  this.state.form.Matavimo_vnt,
                    "Gamintojas":  this.state.form.Gamintojas,
                    "PavadinimasEN":  this.state.form.PavadinimasEN,
                    "AprasymasEN":  this.state.form.AprasymasEN,
                    "Pagaminimo_data":  this.state.form.Pagaminimo_data,
                    "Galioja_iki":  this.state.form.Galioja_iki,
                    "Tiekiamas":  this.state.form.Tiekiamas ? '1' : '0',
                    "Kategorija_Kategorija_id":  this.state.form.Kategorija_Kategorija_id
                })
            })
            .then(response => {
                if (response.status == 200) {
                    this.setState({showModal: false});
                    this.fetchData();
                }
            });
                

        }
        else{
            fetch('http://localhost:8081/api/padaliniai/redaguoti', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Inventorinis_numeris": this.state.form.Inventorinis_numeris,
                    "Salis": this.state.form.Salis,
                    "Miestas": this.state.form.Miestas,
                    "Regionas": this.state.form.Regionas,
                    "Rajonas": this.state.form.Rajonas,
                    "Pasto_kodas": this.state.form.Pasto_kodas,
                    "Ilguma": this.state.form.Ilguma,
                    "Platuma": this.state.form.Platuma,
                    "padalinio_pavadinimas": this.state.form.padalinio_pavadinimas,
                    "Gatve": this.state.form.Gatve
                })
            })
            .then(response => {
                if (response.status == 200) {
                    this.setState({showModal: false});
                    this.fetchData();
                }
            });
        }
    }
    addError(m){
        this.setState({
            error: m
        })
    }
    TrinamLauk(e){
        let id = e.target.parentNode.attributes['delete'].nodeValue;
        fetch('http://localhost:8081/api/produkcija/salinti', {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Barkodas": id
            })
        })
        .then(response => {
            if (response.status == 200) {
                this.fetchData();
            }
            console.log(response.status);
            console.log(response.text());
        })
    }
    render(){
        let eilutes = [];
        let tiekimas = '';
        let filt=[<option value="" key={-1}>Visos kategorijos</option>];
        let filt2=[<option value="" key={-1}>Visi padaliniai</option>];

        for(let i = 0; i < this.state.data.data.length; i++){
            let a = this.state.data.data[i];
            if(this.state.selectedFiltras != "" && a.Kategorija_Kategorija_id != this.state.selectedFiltras ){
                continue;
            }
            if(this.state.selectedFiltras2 != "" && a.Padalinys_Inventorinis_numeris != this.state.selectedFiltras2){
                continue;
            }
                if(a.Tiekiama == '1'){
                    tiekimas = "Tiekiama";
                }
                else{
                    tiekimas = "Netiekiama";
                }
                eilutes.push(
                    <tr key={i} className="aprasymas">
                        <td>{a.Pavadinimas}</td>
                        <td>{a.Vieneto_kaina} &euro;</td>
                        <td>{a.padalinio_pavadinimas}</td>
                        <td>{tiekimas}</td>
                        <td><a id="ForButtons" delete={a.Barkodas} onClick={this.TrinamLauk}><span class="glyphicon glyphicon-trash"> </span></a> <div className="vr">
                            </div> <a id="ForButtons" update={a.Barkodas} onClick={this.OpenUpdate}>Redaguoti</a></td>
                    </tr>
                    );
                if(a.Aprasymas != ""){
                    eilutes.push(     
                        <tr>
                            <td colSpan="5" style={{padding:"0px", border:"none" }}><div style={{ maxHeight: "600px", minHeight: "50px"}}><h5 style={{ textAlign: "left", fontWeight: "600" }}>Aprašymas: </h5>{a.Aprasymas}</div></td>
                        </tr>
                    );
             }
        }
        for(let i = 0; i < this.state.data.filtras.length; i++){
            let b = this.state.data.filtras[i];
            filt.push(
                <option key={i} value={b.Kategorija_id}>
                    {b.Kategorijos_pavadinimas}
                </option>
            );
        }
        for(let i = 0; i< this.state.data.filtras2.length; i++){
            let c = this.state.data.filtras2[i];
            filt2.push(
                <option key={i} value={c.Inventorinis_numeris}>
                {c.padalinio_pavadinimas}
                </option>
            )
        }
        return(
        <div id="wraper">
        <h2 style={{
                    textAlign: "center",
                    color: "#985E6D"
                }}>Produkcija</h2>
        <FormGroup> <ControlLabel>Kategorijos:</ControlLabel> 
        <FormControl componentClass="select" defaultValue={this.state.selectedFiltras} onChange={(e) => {this.setState({selectedFiltras: e.target.value})}}>
            {filt}
            </FormControl>
        </FormGroup>
            <FormGroup> <ControlLabel>Padalinys:</ControlLabel> 
        <FormControl componentClass="select" defaultValue={this.state.selectedFiltras2} onChange={(e) => {this.setState({selectedFiltras2: e.target.value})}}>
            {filt2}
            </FormControl>
            </FormGroup>        
            <table style={{ width: "100%", borderCollapse: "collapse"}}>
                <tbody>
                    <tr>
                        <th>Pavadinimas</th>
                        <th>Kaina</th>   
                        <th>Padalinys</th>
                        <th>Tiekiama</th>
                        <th id="Insert"><a onClick={this.OpenModal}>+</a></th>
                        </tr>
                 {eilutes}
             </tbody>
            </table>

            <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle> Įveskite produkto duomenis: </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        { this.state.error == undefined ? null : <p>{this.state.error}</p>}
                        { this.state.update == true ? 
                            <FormGroup controlId='Barkodas' validationState={this.validate('Barkodas')}>
                                <ControlLabel> Barkodas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    disabled= "true"
                                    placeholder="pvz.: 123456" 
                                    value={this.state.form.Barkodas} 
                                    fieldname='Barkodas' 
                                    onChange={this.handleFormChange}
                                    
                                />
                            </FormGroup> :
                            <FormGroup controlId='Barkodas' validationState={this.validate('Barkodas')}>
                                <ControlLabel> Barkodas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 123456" 
                                    value={this.state.form.Barkodas} 
                                    fieldname='Barkodas' 
                                    onChange={this.handleFormChange}
                                    
                                />
                            </FormGroup>
                        }
                        <FormGroup controlId='Pavadinimas' validationState={this.validate('Pavadinimas')}>
                            <ControlLabel>Pavadinimas:</ControlLabel>
                            <FormControl 
                                type="text" 
                                placeholder="pvz.: Relė" 
                                value={this.state.form.Pavadinimas} 
                                fieldname='Pavadinimas' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup controlId='Vieneto_kaina' validationState={this.validate('Vieneto_kaina')}>
                            <ControlLabel>Vieneto kaina:</ControlLabel>
                            <FormControl 
                                type="text" 
                                placeholder="pvz.: 15.99" 
                                value={this.state.form.Vieneto_kaina} 
                                fieldname='Vieneto_kaina' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup controlId='Aprasymas' validationState={this.validate('Aprasymas')}>
                            <ControlLabel>Aprašymas:</ControlLabel>
                            <FormControl 
                                type="text" 
                                placeholder="" 
                                value={this.state.form.Aprasymas} 
                                fieldname='Aprasymas' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup controlId='Matavimo_vnt' validationState={this.validate('Matavimo_vnt')}>
                            <ControlLabel>Matavimo vienetai:</ControlLabel>
                            <FormControl 
                                type="text" 
                                placeholder="pvz.: cm"  
                                value={this.state.form.Matavimo_vnt} 
                                fieldname='Matavimo_vnt' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup controlId='Gamintojas' validationState={this.validate('Gamintojas')}>
                            <ControlLabel>Gamintojas:</ControlLabel>
                            <FormControl 
                                type="text"  
                                placeholder="pvz.: Maxima"  
                                value={this.state.form.Gamintojas} 
                                fieldname='Gamintojas' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup controlId='PavadinimasEN' validationState={this.validate('PavadinimasEN')}>
                            <ControlLabel>Pavadinimas angliškai:</ControlLabel>
                            <FormControl 
                                type="text" 
                                placeholder="pvz.: cable" 
                                value={this.state.form.PavadinimasEN} 
                                fieldname='PavadinimasEN' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup controlId='Pagaminimo_data' validationState={this.validate('Pagaminimo_data')}>
                            <ControlLabel>Pagaminimo data:</ControlLabel>
                            <FormControl 
                                type="date" 
                                value={this.state.form.Pagaminimo_data.substring(0, 10)} 
                                fieldname='Pagaminimo_data' 
                                onChange={this.handleFormChange}
                            />
                        </FormGroup>
                        <FormGroup controlId='Galioja_iki' validationState={this.validate('Galioja_iki')}>
                            <ControlLabel>Galiojimo data:</ControlLabel>
                            <FormControl 
                                type="date" 
                                value={this.state.form.Galioja_iki.substring(0, 10)} 
                                fieldname='Galioja_iki' 
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        <FormGroup>
                        <ControlLabel>Ar tiekiama:</ControlLabel>
                            <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Tiekiamas" onChange={this.handleFormChange} defaultValue={this.state.form.Kategorija_Kategorija_id}>
                                <option  value={true}>Taip</option>
                                <option value={false}>Ne</option>
                            </FormControl>
                         </FormGroup>
                        { this.state.update == true ? null :
                            <FormGroup>
                                <ControlLabel>Kategorija:</ControlLabel>
                                <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Kategorija_Kategorija_id" onChange={this.handleFormChange}>
                                    {this.state.form == this.formInitialState ? null :
                                        <option value={this.state.form.Kategorija_Kategorija_id}>{this.state.form.Kategorija_Kategorija_id}</option>
                                    }
                                    {filt}
                                </FormControl>
                            </FormGroup>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
        );
    }
}    

export default Produkcija;