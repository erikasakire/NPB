import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';

class Padaliniai extends React.Component {
    constructor(props){
        super(props);

        /** Saugoma truščios formos duomenys */
        this.formInitialState = {
            Inventorinis_numeris: "",
            Salis: "",
            Miestas: "",
            Regionas: "",
            Rajonas: "",
            Gatve: "",
            padalinio_pavadinimas: "",
            SalisEN: "",
            Pasto_kodas: "",
            Ilguma: "",
            Platuma: "",
            Redaktorius: ""
        }
        /** Saugomos tikrinimo reikšmės reikšmės */
        this.formValidation = {
            Inventorinis_numeris: {
                /** Lauko tipas */
                regex: /^[0-9]+$/,
                /** Galima tuščia reikšmė */
                nullable: false,
                /** Privalo nesikartotoi */
                unique: true,
                /** Jeigu privalo nesikartoti, funkcija, kuri patikrins ar kartojasi ar ne */
                uniqueFunction: (value) => {
                    for(let i = 0; i < this.state.data.data.length; i++){
                        if (this.state.data.data[i].Inventorinis_numeris == value){
                            return false;
                        }
                    }
                    return true;
                }
            },
            Salis: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: false,
                unique: false
            },
            Miestas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: false,
                unique: false
            },
            Regionas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: true,
                unique: false
            },
            Rajonas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: true,
                unique: false
            },
            Gatve: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: false,
                unique: false
            },
            padalinio_pavadinimas: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ0-9]/,
                nullable: false,
                unique: false
            },
            SalisEN: {
                regex: /[a-zA-Z]/,
                nullable: false,
                unique: false
            },
            Pasto_kodas: {
                regex: /^[0-9]+$/,
                nullable: false,
                unique: false
            },
            Ilguma: {
                regex: /^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: false,
                unique: false
            },
            Platuma: {
                regex:/^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: false,
                unique: false
            }
        }

        /** Saugoma esama būsena */
        this.state = {
            data: {
                data: [],
                filtras: [],
                samdyti: []
            },
            selectedFiltras: "",
            showModal: false,
            showModal2: false,
            update: false,
            form: this.formInitialState,
            form2: null,
            padal: false,
            error: undefined
        };

        this.validate = this.validate.bind(this);
        this.OpenUpdate = this.OpenUpdate.bind(this);
        this.OpenModal = this.OpenModal.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.TrinamLauk = this.TrinamLauk.bind(this);
        this.addError = this.addError.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.OpenEditorModal = this.OpenEditorModal.bind(this);
    }
    
    componentWillMount(){
        this.fetchData();
    }
    fetchData (){
        fetch('http://localhost:8081/api/padaliniai/visi', {
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
            if (element.Inventorinis_numeris == id){
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
    handleFormChange2(e){
        
    }
    OpenEditorModal(e){
        this.setState({padal: true});        
        let id = e.target.attributes['padal'].nodeValue;
        let element = this.state.data.data.find((element) => {
            if (element.Inventorinis_numeris == id){
                return element;
            }
        })
        this.setState({form2: Object.assign({}, element)});
        this.setState({showModal2:true}); 
    }

    handleSubmit(e){
        e.preventDefault();    

        if (this.state.form.Inventorinis_numeris == ""){
            return this.addError('Prašome įvesti inventorinį numerį.');
        }
        if (this.state.form.Salis == ""){
            return this.addError('Prašome įvesti šalį');
        }
        if (this.state.form.Miestas == ""){
            return this.addError('Prašome įvesti miestą');
        }
        if (this.state.form.Gatve == ""){
            return this.addError('Prašome įvesti gatvės pavadinimą');
        }
        if (this.state.form.padalinio_pavadinimas == ""){
            return this.addError('Prašome įvesti padalinio pavadinimą');
        }
        if (this.state.form.Pasto_kodas == ""){
            return this.addError('Prašome įvesti Pasto_kodą');
        }
        if (this.state.form.Ilguma == ""){
            return this.addError('Prašome įvesti ilgumą');
        }
        if (this.state.form.Platuma == ""){
            return this.addError('Prašome įvesti platumą');
        }
        if (this.state.form.Redaktorius == ""){
            return this.addError('Prašome pasirinkti redaktorių');
        }
        if(this.state.update == false){
            fetch('http://localhost:8081/api/padaliniai/prideti', {
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
                    "Redaktorius": this.state.form.Redaktorius,
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

    handleSubmit2(e){
        e.preventDefault();

        if (this.state.form.Redaktorius == ""){
            return this.addError('Prašome pasirinkti redaktorių');
        }
        else{
            fetch('http://localhost:8081/api/padaliniai/samdyti', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Redaktorius": this.state.Redaktorius
                })
            })
        .then(response => {
            if(response.status == 200){
                this.fetchData();
            }
        })
        }
    }
    addError(m){
        this.setState({
            error: m
        })
    }
    TrinamLauk(e){
        let id = e.target.parentNode.attributes['delete'].nodeValue;
        fetch('http://localhost:8081/api/padaliniai/salinti', {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Inventorinis_numeris": id
            })
        })
        .then(response => {
            if (response.status == 200) {
                this.fetchData();
            }
        })
    }
    Atleidimas(e){
        let id= e.target.parentNode.attributes['atleistas'].nodeValue;
        fetch('http://localhost:8081/api/padaliniai/atleisti', {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Redaktorius": id
            })
        })
        .then(response => {
            if (response.status == 200) {
                this.fetchData();
            }
        })
    }
    render(){
        let eilutes = [];
        let filt = [<option value="" key={-1}>Visi</option>];
        let samd =  [<option value="" key={-1}></option>];

        for(let i = 0; i < this.state.data.data.length; i++){
            let a = this.state.data.data[i];
            if(this.state.selectedFiltras == "" || a.Salis == this.state.selectedFiltras){
                eilutes.push(
                    <tr key={i}>
                        <td>{a.Inventorinis_numeris}</td>
                        <td>{a.padalinio_pavadinimas}</td>
                        <td>{a.Salis}</td>
                        <td><a  id="ForButtons" href="http://localhost:8081/api/Darbuotojas/:id">{a.Redaktorius} </a><a id="ForButtons" atleistas={a.Redaktorius} onClick={this.Atleidimas}> Atleisti</a></td>
                        <td>
                            <a id="ForButtons" delete={a.Inventorinis_numeris} onClick={this.TrinamLauk}><span className="glyphicon glyphicon-trash"></span></a> 
                            <div className="vr">
                            </div><a id="ForButtons" update={a.Inventorinis_numeris} onClick={this.OpenUpdate}>Redaguoti</a></td>
                        <td><a id="ForButton" padal={a.Inventorinis_numeris} onClick={this.OpenEditorModal}>Pasirinkite Redaktorių</a></td>
                    </tr>
                )
            }
        }
        for(let i = 0; i < this.state.data.filtras.length; i++){
            let b = this.state.data.filtras[i];
            filt.push(
                <option key={i} value={b.Salis}>
                    {b.Salis}
                </option>
            );
        }

        for(let i = 0; i < this.state.data.samdyti.length; i++){
            let c = this.state.data.samdyti[i];
                samd.push(
                  <option key={i} value={c.Tabelio_nr}>{c.Vardas + " " + c.Pavarde}</option>
                );
        }
        return(
            <div id="wraper">
                <h2 style={{
                    textAlign: "center",
                    color: "#985E6D"
                }}>Padaliniai</h2>
                <FormGroup> <ControlLabel>Šalys:</ControlLabel>
                    <FormControl componentClass="select" defaultValue={this.state.selectedFiltras} onChange={(e) => {this.setState({selectedFiltras: e.target.value})}}>
                        {filt}
                    </FormControl>
                </FormGroup>
                <table style={{ width: "100%"}}>
                    <tbody>
                        <tr>
                            <th>Inventorinis numeris</th>
                            <th>Pavadinimas</th>
                            <th>Šalis</th>
                            <th>Redaktorius <h5>(valdantis padalinio užsakymus)</h5></th>
                            <th id="Insert"><a onClick={this.OpenModal}>+</a></th>
                        </tr>
                        { eilutes }
                    </tbody>
                </table>
                
                <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                   <form onSubmit={this.handleSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle> Įveskite padalinio duomenis: </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            { this.state.error == undefined ? null : <p>{this.state.error}</p>}
                            { this.state.update == true ? 
                            <FormGroup controlId='Inventorinis_numeris' validationState={this.validate('Inventorinis_numeris')}>
                                    <ControlLabel>Inventorinis numeris:</ControlLabel>
                                    <FormControl 
                                        type="text" 
                                        disabled= "true"
                                        placeholder="pvz.: 123" 
                                        value={this.state.form.Inventorinis_numeris} 
                                        fieldname='Inventorinis_numeris' 
                                        onChange={this.handleFormChange}
                                        
                                    />
                                </FormGroup> :
                                <FormGroup controlId='Inventorinis_numeris' validationState={this.validate('Inventorinis_numeris')}>
                                    <ControlLabel>Inventorinis numeris:</ControlLabel>
                                    <FormControl 
                                        type="text" 
                                        placeholder="pvz.: 123" 
                                        value={this.state.form.Inventorinis_numeris} 
                                        fieldname='Inventorinis_numeris' 
                                        onChange={this.handleFormChange}
                                        
                                    />
                                </FormGroup>
                            }
                            <FormGroup controlId='padalinio_pavadinimas' validationState={this.validate('padalinio_pavadinimas')}>
                                <ControlLabel>Pavadinimas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Revilė" 
                                    value={this.state.form.padalinio_pavadinimas} 
                                    fieldname='padalinio_pavadinimas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Salis' validationState={this.validate('Salis')}>
                                <ControlLabel>Šalis:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Lietuva" 
                                    value={this.state.form.Salis} 
                                    fieldname='Salis' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='SalisEN' validationState={this.validate('SalisEN')}>
                                <ControlLabel>Šalis angliškai:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Lithuania" 
                                    value={this.state.form.SalisEN} 
                                    fieldname='SalisEN' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Regionas' validationState={this.validate('Regionas')}>
                                <ControlLabel>Regionas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Aukštaitija"  
                                    value={this.state.form.Regionas} 
                                    fieldname='Regionas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Rajonas' validationState={this.validate('Rajonas')}>
                                <ControlLabel>Rajonas:</ControlLabel>
                                <FormControl 
                                    type="text"  
                                    placeholder="pvz.: Vilnius"  
                                    value={this.state.form.Rajonas} 
                                    fieldname='Rajonas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Miestas' validationState={this.validate('Miestas')}>
                                <ControlLabel>Miestas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Vilnius" 
                                    value={this.state.form.Miestas} 
                                    fieldname='Miestas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Gatve' validationState={this.validate('Gatve')}>
                                <ControlLabel>Gatvė:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Gedimino pr." 
                                    value={this.state.form.Gatve} 
                                    fieldname='Gatve' 
                                    onChange={this.handleFormChange}
                                />
                            </FormGroup>
                            <FormGroup controlId='Pasto_kodas' validationState={this.validate('Pasto_kodas')}>
                                <ControlLabel>Pašto kodas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 4521" 
                                    value={this.state.form.Pasto_kodas} 
                                    fieldname='Pasto_kodas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Ilguma' validationState={this.validate('Ilguma')}>
                                <ControlLabel>Ilguma:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 43.15" 
                                    value={this.state.form.Ilguma} 
                                    fieldname='Ilguma' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Platuma' validationState={this.validate('Platuma')}>
                                <ControlLabel>Platuma:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 45.15" 
                                    value={this.state.form.Platuma} 
                                    fieldname='Platuma' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            { this.state.update == true ? null :
                                <FormGroup>
                                    <ControlLabel>Redaktorius:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Redaktorius" onChange={this.handleFormChange}>
                                        {this.state.form == this.formInitialState ? null :
                                            <option value={this.state.form.Redaktorius}>{this.state.form.Vardas + " " + this.state.form.Pavarde}</option>
                                        }
                                        {samd}
                                    </FormControl>
                                </FormGroup>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit">Patvirtinti</Button>
                        </ModalFooter>
                    </form>
                </Modal>
                <Modal show={this.state.showModal2} onHide={()=>{this.setState({showModal2:false})}} >
                   <form onSubmit={this.handleSubmit2}>
                        <ModalHeader closeButton>
                            <ModalTitle> Pasamdykite naują darbuotoją: </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            { this.state.error == undefined ? null : <p>{this.state.error}</p>}
                                <FormGroup>
                                    <ControlLabel>Pasirinkite redaktorių:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Redaktorius" onChange={this.hadleFormChange2}>
                                            <option value={this.state.form2.Redaktorius}>{this.state.form2.Vardas + " " + this.state.form2.Pavarde}</option>
                                        {samd}
                                    </FormControl>
                                </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit2">Patvirtinti</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default Padaliniai;