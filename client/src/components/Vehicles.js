import React from 'react'
//import ReactTable from 'react-table'
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel, ModalDialog} from 'react-bootstrap';
import '../styles/index.css';
import '../styles/extra.css';
import { connect } from "react-redux";
import config from '../config.json';


//import 'react-table/react-table.css'

class  Vechiles extends React.Component {
    //props - properties
    constructor(props) {
        super(props);

        this.formInitialState = {
            Valstybinis_nr: "", //+
            Aukstis: "",
            Plotis: "",
            Marke: "", //+
            Modelis: "", //+
            Galia: "", //++
            Variklio_darbinis_turis: "", //+
            Rida: "", //+
            Draudimo_pr: "", //+
            Draudimo_pab: "", //+
            Apziuros_pr: "", //+
            Apziuros_pab: "", //+
            Pagaminimo_metai: "", //+
            Kuro_tipas: "", //+
            Mase: "", //=svoris //+
            Didziausia_leidz_mase: "", //+
            Sed_vt_sk: "", //+
            Spalva: "", //+
            Busenos_id: "", //+
            Busena: "",
            Vairavimo_kate_id: "", //+
            Vair_Kategorija: ""
        }

        /** Saugomos tikrinimo reikšmės reikšmės */
        this.formValidation = {
            Valstybinis_nr: {
                /** Lauko tipas */
                regex: /[a-zA-Z0-9\-]/,
                /** Galima tuščia reikšmė */
                nullable: false,
                /** Privalo nesikartotoi */
                unique: true,
                /** Jeigu privalo nesikartoti, funkcija, kuri patikrins ar kartojasi ar ne */
                uniqueFunction: (value) => {
                    for(let i = 0; i < this.state.data.cars.length; i++){
                        if (this.state.data.cars[i].Valstybinis_nr == value){
                            return false;
                        }
                    }
                    return true;
                }
            },
            Marke: {
                regex: /[a-zA-Z]/,
                nullable: true,
                unique: false
            },
            Aukstis: {
                regex: /^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: false,
                unique: false
            },
            Plotis: {
                regex: /^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: false,
                unique: false
            },
            Modelis: {
                regex:  /[a-zA-Z0-9\-]/,
                nullable: false,
                unique: false
            },
            Galia: {
                regex: /[0-9]/,
                nullable: false,
                unique: false
            },
            Variklio_darbinis_turis: {
                regex: /^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: true,
                unique: false
            },
            Rida: {
                regex: /[0-9]/,
                nullable: false,
                unique: false
            },
            Draudimo_pr: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Draudimo_pab: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Apziuros_pr: {
                regex: /^.+$/,                
                nullable: false,
                unique: false
            },
            Apziuros_pab: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Pagaminimo_metai: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Mase: {
                regex: /[0-9]/,
                nullable: false,
                unique: false
            },
            Didziausia_leidz_mase: {
                regex: /[0-9]/,
                nullable: false,
                unique: false
            },
            Sed_vt_sk: {
                regex: /^[0-9]/,
                nullable: true,
                unique: false
            },
            Spalva: {
                regex: /[a-zA-ZąčęėįšųūĄČĘĖĮŠŲŪ]/,
                nullable: true,
                unique: false
            },
            Vairavimo_kate_id: {
                regex: /[0-9]/,
                nullable: true,
                unique: false
            },
            Busenos_id: {
                regex: /[0-9]/,
                nullable: true,
                unique: false
            },
        }

        this.state = 
        {
            data: {
                cars: [],
                allCars: [],
                allStates: [],
                allCategories: []
            },
            showModal: false,
            update: false,
            error: undefined,
            form: this.formInitialState,
            select_categories: [],
            select_states: []

        };
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.OpenModal = this.OpenModal.bind(this);
        this.updateData_OpenModal = this.updateData_OpenModal.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.validate = this.validate.bind(this);
        this.addError = this.addError.bind(this);
    }

    componentWillMount(){
        this.fetchData();
    }

    fetchData (){
        fetch(config.server + '/Transporto_priemones/sarasas', {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
            this.setState({data: response},
                function () {
                console.log(this.state.data);
            });
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

    updateData_OpenModal(e){
        this.setState({update: true});       
        let id = e.target.parentNode.attributes['update'].nodeValue;
        let element = this.state.data.cars.find((element) => {
            if (element.Valstybinis_nr == id){
                return element;
            }
        })
        this.setState({form: Object.assign({}, element)});

        this.OpenModal();
    }

    deleteData(e){
        console.log(e); 
        let id = e.target.parentNode.attributes['delete'].nodeValue;
        fetch(config.server + '/Transporto_priemones/salinti', {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Valstybinis_nr": id
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

    handleFormChange(e){
        let form = Object.assign({}, this.state.form);
        let name = e.target.attributes['fieldname'].nodeValue;
        form[name] = e.target.value;
        this.setState({form: form});
    }

    handleSubmit(e){
        e.preventDefault();

        if (this.state.form.Valstybinis_nr == ""){
            return this.addError('Prašome įvesti transporto priemonės valstybinį numerį.');
        }
        if (this.state.form.Aukstis == ""){
            return this.addError('Prašome įvesti transporto priemonės aukštį.');
        }
        if (this.state.form.Plotis == ""){
            return this.addError('Prašome įvesti transporto priemonės plotį.');
        }
        if (this.state.form.Modelis == ""){
            return this.addError('Prašome įvesti transporto priemonės modelį.');
        }
        if (this.state.form.Galia == ""){
            return this.addError('Prašome įvesti transporto priemonės variklio galią.');
        }
        if (this.state.form.Draudimo_pr == ""){
            return this.addError('Prašome įvesti transporto priemonės civilinio draudimo datos pradžią.');
        }
        if (this.state.form.Draudimo_pab == ""){
            return this.addError('Prašome įvesti transporto priemonės civilinio draudimo datos pabaigą.');
        }
        if (this.state.form.Draudimo_pab < this.state.form.Draudimo_pr){
            return this.addError('Prašome įvesti transporto priemonės civilinio draudimo datos pabaigą. Nurodyta pabaigos data ansktesnė negu pradžios');
        }
        if (this.state.form.Apziuros_pr == ""){
            return this.addError('Prašome įvesti transporto priemonės techninės apžiūros datos pradžią.');
        }
        if (this.state.form.Apziuros_pab == ""){
            return this.addError('Prašome įvesti transporto priemonės techinės apžiūros datos pabaigą.');
        }
        if (this.state.form.Apziuros_pab <  this.state.form.Apziuros_pr){
            return this.addError('Prašome įvesti transporto priemonės techinės apžiūros datos pabaigą. Nurodyta pabaigos data ankstyvesnė negu pradžios');
        }
        if (this.state.form.Pagaminimo_metai == ""){
            return this.addError('Prašome įvesti transporto priemonės pagaminimo metus.');
        }
        if (this.state.form.Kuro_tipas == ""){
            this.state.form.Kuro_tipas="Dyzelinis";
            /*return this.addError('Prašome įvesti transporto priemonės energijos šaltinį.');*/
        }
        if(this.state.form.Mase == ""){
            return this.addError('Prašome įvesti transporto priemonės masę be krovinio.')
        }
        if (this.state.form.Didziausia_leidz_mase == ""){
            return this.addError('Prašome įvesti transporto priemonės didžiausią leidžiamą masę');
        }
        if (Number.parseInt(this.state.form.Didziausia_leidz_mase, [10]) < Number.parseInt(this.state.form.Mase, [10])){
            return this.addError('Didžiausia leidžiamoji masė mažesnė už transporto priemonės masę ');
        }
        if (this.state.form.Transporto_busena_Busenos_id == ""){
            return this.addError('Prašome pasirinkti transporto priemonės būsena');
        }
        if (this.state.form.Vairavimo_kate_id == ""){
            return this.addError('Prašome pasirinkti transporto priemonės vairavimo kategoriją.');
        }
 
        console.log(this.state.update);
        if(this.state.update == false){
            console.log(this.state.form);
            fetch(config.server + '/Transporto_priemones/prideti', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Valstybinis_nr": this.state.form.Valstybinis_nr,
                    "Plotis": this.state.form.Plotis,
                    "Aukstis": this.state.form.Aukstis,
                    "Modelis": this.state.form.Modelis,
                    "Marke": this.state.form.Marke,
                    "Galia": this.state.form.Galia,
                    "Rida": this.state.form.Rida,
                    "Draudimas_galioja_nuo": this.state.form.Draudimo_pr,
                    "Draudimas_galioja_iki": this.state.form.Draudimo_pab,
                    "Apziura_galioja_nuo": this.state.form.Apziuros_pr,
                    "Apziura_galioja_iki": this.state.form.Apziuros_pab,
                    "Pagaminimo_metai": this.state.form.Pagaminimo_metai,
                    "Kuro_tipas": this.state.form.Kuro_tipas,
                    "Svoris": this.state.form.Mase,
                    "Sedimu_vt_sk": this.state.form.Sed_vt_sk,
                    "Variklio_darbinis_turis": this.state.form.Variklio_darbinis_turis,
                    "Didziausias_leidz_svoris": this.state.form.Didziausia_leidz_mase,
                    "Spalva": this.state.form.Spalva,
                    "Transporto_busena_Busenos_id": 2, //būsena - laisva
                    "Vairavimo_kategorija_Kategorijos_id": this.state.form.Vairavimo_kate_id,
                })
            })
            .then(response => {
                if (response.status == 200) {
                    this.setState({showModal: false});
                    this.fetchData();
                }
                console.log(response.status);
                console.log(response.text());
            });
               
 
        }
        else{
            fetch(config.server + '/Transporto_priemones/redaguoti', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Valstybinis_nr": this.state.form.Valstybinis_nr,
                    "Plotis": this.state.form.Plotis,
                    "Aukstis": this.state.form.Aukstis,
                    "Modelis": this.state.form.Modelis,
                    "Marke": this.state.form.Marke,
                    "Galia": this.state.form.Galia,
                    "Rida": this.state.form.Rida,
                    "Draudimas_galioja_nuo": this.state.form.Draudimo_pr,
                    "Draudimas_galioja_iki": this.state.form.Draudimo_pab,
                    "Apziura_galioja_nuo": this.state.form.Apziuros_pr,
                    "Apziura_galioja_iki": this.state.form.Apziuros_pab,
                    "Pagaminimo_metai": this.state.form.Pagaminimo_metai,
                    "Kuro_tipas": this.state.form.Kuro_tipas,
                    "Svoris": this.state.form.Mase,
                    "Sedimu_vt_sk": this.state.form.Sed_vt_sk,
                    "Variklio_darbinis_turis": this.state.form.Variklio_darbinis_turis,
                    "Didziausias_leidz_svoris": this.state.form.Didziausia_leidz_mase,
                    "Spalva": this.state.form.Spalva,
                    "Transporto_busena_Busenos_id": this.state.form.Busenos_id,
                    "Vairavimo_kategorija_Kategorijos_id": this.state.form.Vairavimo_kate_id,
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
        
    Modal(){
        if (this.props.rangas <= 2)
        {
            return (
                <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle> Įveskite transporto priemonės duomenis: </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                        { this.state.error == undefined ? null : <p>{this.state.error}</p>}
                            { this.state.update == true ?
                                <FormGroup controlId='Valstybinis_nr' validationState={this.validate('Valstybinis_nr')}>
                                    <ControlLabel> Valstybinis numeris:</ControlLabel>
                                    <FormControl
                                        type="text"
                                        disabled= "true"
                                        placeholder="pvz.: AAA-000"
                                        value={this.state.form.Valstybinis_nr}
                                        fieldname='Valstybinis_nr'
                                        onChange={this.handleFormChange}
                                    
                                    />
                                </FormGroup> :
                                <FormGroup controlId='Valstybinis_nr' validationState={this.validate('Valstybinis_nr')}>
                                    <ControlLabel> Valstybinis_nr:</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="pvz.: AAA-000"
                                        value={this.state.form.Valstybinis_nr}
                                        fieldname='Valstybinis_nr'
                                        onChange={this.handleFormChange}
                                    
                                    />
                                </FormGroup>
                            }
                            <FormGroup controlId='Marke' validationState={this.validate('Marke')}>
                                <ControlLabel>Markė:</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="pvz.: Volvo (užpildymas neprivalomas)"
                                    value={this.state.form.Marke}
                                    fieldname='Marke'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Modelis' validationState={this.validate('Modelis')}>
                                <ControlLabel>Modelis:</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="pvz.: FH16"
                                    value={this.state.form.Modelis}
                                    fieldname='Modelis'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Galia' validationState={this.validate('Galia')}>
                                <ControlLabel>Galia:</ControlLabel>
                                <FormControl
                                    type="number"
                                    placeholder="pvz.: 510 (kW)"
                                    value={this.state.form.Galia}
                                    fieldname='Galia'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Variklio_darbinis_turis' validationState={this.validate('Variklio_darbinis_turis')}>
                                <ControlLabel>Variklio darbinis tūris:</ControlLabel>
                                <FormControl
                                    type="number"
                                    step="0.1"
                                    placeholder="pvz.: 16.5 (litrų) (užpildymas neprivalomas)"
                                    value={this.state.form.Variklio_darbinis_turis}
                                    fieldname='Variklio_darbinis_turis'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Rida' validationState={this.validate('Rida')}>
                                <ControlLabel>Rida:</ControlLabel>
                                <FormControl
                                    type="number"
                                    placeholder="pvz.: 25454 (km)"  
                                    value={this.state.form.Rida}
                                    fieldname='Rida'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Draudimo_pr' validationState={this.validate('Draudimo_pr')}>
                                <ControlLabel>Draudimo pradžia:</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.form.Draudimo_pr.substring(0, 10)}
                                    fieldname='Draudimo_pr'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Draudimo_pab' validationState={this.validate('Draudimo_pab')}>
                                <ControlLabel>Draudimo pabaiga:</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.form.Draudimo_pab.substring(0, 10)}
                                    fieldname='Draudimo_pab'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Apziuros_pr' validationState={this.validate('Apziuros_pr')}>
                                <ControlLabel>Apžiūros pradžia:</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.form.Apziuros_pr.substring(0, 10)}
                                    fieldname='Apziuros_pr'
                                    onChange={this.handleFormChange}
                                />
                            </FormGroup>
                            <FormGroup controlId='Apziuros_pab' validationState={this.validate('Apziuros_pab')}>
                                <ControlLabel>Apžiūros pabaiga:</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.form.Apziuros_pab.substring(0, 10)}
                                    fieldname='Apziuros_pab'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Pagaminimo_metai' validationState={this.validate('Pagaminimo_metai')}>
                                <ControlLabel>Pagaminimo metai:</ControlLabel>
                                <FormControl
                                    type="number"
                                    placeholder="pvz.: 2010"  
                                    value={this.state.form.Pagaminimo_metai}
                                    fieldname='Pagaminimo_metai'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup>
                            <ControlLabel>Kuro tipas:</ControlLabel>
                                <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Kuro_tipas" onChange={this.handleFormChange} defaultValue={this.state.form.Kuro_tipas}>
                                    <option value={'Dyzelinis'}>Dyzelinis</option>
                                    <option value={'Benzininis'}>Benzininis</option>
                                    <option value={'Elektrinis'}>Elektrinis</option>
                                    <option value={'Dyzelinis-Elektrinis'}>Dyzelinis-Elektrinis</option>
                                    <option value={'Benzininis-Elektrinis'}>Benzininis-Elektrinis</option>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId='Mase' validationState={this.validate('Mase')}>
                                <ControlLabel>Masė be krovinio:</ControlLabel>
                                <FormControl
                                    type="number"
                                    step="0.1"
                                    placeholder="pvz.: 77 (t)"  
                                    value={this.state.form.Mase}
                                    fieldname='Mase'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Aukstis' validationState={this.validate('Aukstis')}>
                                <ControlLabel>Aukštis:</ControlLabel>
                                <FormControl
                                    type="number"
                                    step="0.01"
                                    placeholder="pvz.: 2.54 (m)"  
                                    value={this.state.form.Aukstis}
                                    fieldname='Aukstis'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Plotis' validationState={this.validate('Plotis')}>
                                <ControlLabel>Plotis:</ControlLabel>
                                <FormControl
                                    type="number"
                                    step="0.01"
                                    placeholder="pvz.: 2.1 (m)"  
                                    value={this.state.form.Plotis}
                                    fieldname='Plotis'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Didziausia_leidz_mase' validationState={this.validate('Didziausia_leidz_mase')}>
                                <ControlLabel>Didžiausia leidžiama masė:</ControlLabel>
                                <FormControl
                                    type="number"
                                    step="0.1"
                                    placeholder="pvz.: 130 (t)"  
                                    value={this.state.form.Didziausia_leidz_mase}
                                    fieldname='Didziausia_leidz_mase'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Sed_vt_sk' validationState={this.validate('Sed_vt_sk')}>
                                <ControlLabel>Sėdimų vietų skaičius:</ControlLabel>
                                <FormControl
                                    type="number"
                                    placeholder="pvz.: 5 (užpildymas neprivalomas)"  
                                    value={this.state.form.Sed_vt_sk}
                                    fieldname='Sed_vt_sk'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup controlId='Spalva' validationState={this.validate('Spalva')}>
                                <ControlLabel>Spalva:</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="pvz.: raudona (užpildymas neprivalomas)"
                                    value={this.state.form.Spalva}
                                    fieldname='Spalva'
                                    onChange={this.handleFormChange}/>
                            </FormGroup>
                            <FormGroup>
                            <ControlLabel>Transporto priemonės kategorija:</ControlLabel>
                                <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Vairavimo_kate_id" onChange={this.handleFormChange} defaultValue={this.state.form.Vairavimo_kate_id}>
                                    {this.state.form == this.formInitialState ? null : //noretursi ne id o pavadinimo
                                        <option value={this.state.form.Vairavimo_kate_id}>{this.state.form.Vair_Kategorija}</option>
                                    }
                                    {this.state.select_categories}
                                </FormControl>
                            </FormGroup>
                            { this.state.update == true ?
                                <FormGroup>
                                    <ControlLabel>Transporto priemonės būsena:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Busenos_id" onChange={this.handleFormChange}>
                                        {this.state.form == this.formInitialState ? null :
                                            <option value={this.state.form.Busenos_id}>{this.state.form.Busena}</option>
                                        }
                                        {this.state.select_states}
                                    </FormControl>
                                </FormGroup> :
                                null
                            }

                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit">Patvirtinti</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            );
        }
        
        return(
            <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
            <form onSubmit={this.handleSubmit}>
                <ModalHeader closeButton>
                    <ModalTitle> Įveskite transporto priemonės duomenis: </ModalTitle>
                </ModalHeader>
                <ModalBody>
                { this.state.error == undefined ? null : <p>{this.state.error}</p>}
                    { this.state.update == true ?
                        <FormGroup>
                            <ControlLabel>Transporto priemonės būsena:</ControlLabel>
                            <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Busenos_id" onChange={this.handleFormChange}>
                                {this.state.form == this.formInitialState ? null :
                                    <option value={this.state.form.Busenos_id}>{this.state.form.Busena}</option>
                                }
                                {this.state.select_states}
                            </FormControl>
                        </FormGroup> :
                        null
                    }

                </ModalBody>
                <ModalFooter>
                    <Button type="submit">Patvirtinti</Button>
                </ModalFooter>
            </form>
        </Modal>
        )
    }

    addError(m){
        this.setState({
            error: m
        })
    }

    render() {
        this.state.select_categories=[<option value="" key={-1}>Visos vairavimo kategorijos</option>];
        this.state.select_states=[<option value="" key={-1}>Visos būsenos</option>];

        for (let i = 0; i <this.state.data.allCategories.length; i++)
        {
            let v = this.state.data.allCategories[i];
            this.state.select_categories.push(
                <option key={i} value={v.Kategorijos_id}>
                    {v.kategorija}
                </option>
                );
        }

        for (let i = 0; i <this.state.data.allStates.length; i++)
        {
            let v = this.state.data.allStates[i];
            this.state.select_states.push(
                <option key={v.Tabelio_nr} value={v.Busenos_id}>
                    {v.Busena}
                </option>
                );
        }

        let carsRows = [];
        for (let i = 0; i < this.state.data.cars.length; i++){
            let car = this.state.data.cars[i];

            let letEdit = "";
            if((this.props.rangas) == 1 || (this.props.rangas) == 2 || (this.props.rangas) == 4)
            {
                letEdit =
                (<a id="Button" update={car.Valstybinis_nr} onClick={this.updateData_OpenModal}>
                    <span class="glyphicon glyphicon-info-sign"> </span>
                </a>);
            }

            let letErase = "";
            if((this.props.rangas) == 1 || (this.props.rangas) == 2)
            {
                letErase =
                (<a id="Button" delete={car.Valstybinis_nr} onClick={this.deleteData}>
                    <span class="glyphicon glyphicon-trash"> </span>
                </a>);
            }

            carsRows.push(
                <tr>
                    <td>
                        {car.Marke}
                    </td>
                    <td>
                        {car.Modelis}
                    </td>
                    <td>
                        {car.Galia}
                    </td>
                    <td>
                        {car.Variklio_darbinis_turis}
                    </td>
                    <td>
                        {car.Aukstis}
                    </td>
                    <td>
                        {car.Plotis}
                    </td>
                    <td>
                        {car.Busena}
                    </td>
                    <td>
                        <span>
                            {letEdit}
                            {letErase}
                        </span>
                    </td>                    
                </tr>
            );
        }

        return (
            <div id="main" class="flex container">
                <h1>Transporto priemonės</h1>
                <table id="lentele">
                    <thead>
                        <tr>
                            <th>
                                Marke
                            </th>
                            <th>
                                Modelis
                            </th>
                            <th>
                                Galia
                            </th>
                            <th>
                                Variklio tūris
                            </th>
                            <th>
                                Aukštis
                            </th>
                            <th>
                                Plotis
                            </th>
                            <th>
                                Būsena
                            </th>
                            <th id="AddButton">
                            {this.props.rangas <= 2 ? 
                                <a onClick={this.OpenModal}>
                                    <span class="glyphicon glyphicon-plus-sign"/>
                                </a>
                                : null 
                            }    
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {carsRows}
                    </tbody>
                </table>
            {this.Modal()}
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
)(Vechiles);