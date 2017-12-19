<<<<<<< HEAD
import React from 'react'
//import ReactTable from 'react-table'
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel, ModalDialog} from 'react-bootstrap';
import '../styles/index.css';
import '../styles/extra.css';

//import 'react-table/react-table.css'

class  Orders extends React.Component {
    //props - properties
    constructor(props) {
        super(props);

        this.formInitialState = {
            Numeris: "", //+
            Uzsakymo_data: "",
            Atlikimo_data: "",
            Prioritetas: "", //+
            busena: "", //+
            Busenos_id: "",
            //truksta formuotojo
            //truksta vairuotojo
            transporto_nr: "", //++
            is_pad_id: "",
            is_pad_pavad: "",
            at_pad_id: "",
            at_pad_pavad: ""
        }

         /** Saugomos tikrinimo reikšmės reikšmės */
         this.formValidation = {
            Uzsakymo_data: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Atlikimo_data: {
                regex: /^.+$/,
                nullable: true,
                unique: false
            },
            Prioritetas: {
                regex: /[0-9]/,
                nullable: false,
                unique: false
            },
            Busena: {
                regex:  /[a-zA-Z0-9\-]/,
                nullable: false,
                unique: false
            },
            Suformavo: {
                regex: /^.+$/,
                nullable: false,
                unique: false
            },
            Vairuotojas: {
                regex: /^.+$/,
                nullable: true,
                unique: false
            },
            Transportas: {
                regex: /[a-zA-Z0-9\-]/,
                nullable: false,
                unique: false
            }
        }

        this.state = 
        {
            data: {
                data: [],
                allStates: [],
                allWorkers: [],
                allSubdivisions: []
            },
            showModal: false,
            showModal_P: false, 
            update: false,
            error: undefined,
            form: this.formInitialState,
            select_subdivisions: [],
            select_states: []

        };
        this.fetchData = this.fetchData.bind(this);
        this.OpenModal = this.OpenModal.bind(this);
        this.OpenModal_Prioritetas = this.OpenModal_Prioritetas.bind(this);
        this.updateData_OpenModal = this.updateData_OpenModal.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit_Prioritetas = this.handleSubmit_Prioritetas.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.validate = this.validate.bind(this);
        this.addError = this.addError.bind(this);
        this.printName = this.printName.bind(this);
    }

    componentWillMount(){
        this.fetchData();
    }

    fetchData (){
        fetch('http://localhost:8081/api/Uzsakymai/sarasas', {
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

    OpenModal_Prioritetas(e){    
        let id = e.target.parentNode.attributes['chamgeP'].nodeValue;
        let element = this.state.data.data.find((element) => {
            if (element.Numeris == id){
                console.log(element);
                return element;
            }
        })
        this.setState({form: Object.assign({}, element)});

        this.setState({showModal_P:true});
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
        let element = this.state.data.data.find((element) => {
            if (element.Numeris == id){
                console.log(element);
                return element;
            }
        })
        this.setState({form: Object.assign({}, element)});

        this.OpenModal();
    }

    cancelOrder(e){
        console.log(e); 
        let id = e.target.parentNode.attributes['cancel'].nodeValue;
        fetch('http://localhost:8081/api/Uzsakymai/atsaukti', {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Numeris": id
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
            return this.addError('Prašome įvesti transporto priemonės energijos šaltinį.');
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
            fetch('http://localhost:8081/api/Uzsakymai/prideti', {
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
            fetch('http://localhost:8081/api/Uzsakymai/redaguoti', {
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

    handleSubmit_Prioritetas(e){
        e.preventDefault();

        /*if (this.state.form.Aukstis == ""){
            return this.addError('Prašome įvesti transporto priemonės aukštį.');
        }*/

        fetch('http://localhost:8081/api/Uzsakymai/keisti_pr', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "numeris": this.state.form.Numeris,
                "prioritetas": this.state.form.Prioritetas
            })
        })
        .then(response => {
            if (response.status == 200) {
                this.setState({showModal_P: false});
                this.fetchData();
=======
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
>>>>>>> refs/remotes/origin/master
            }
        });
    }

<<<<<<< HEAD
    Modal_Prioritetas(){



        return (
            <Modal show={this.state.showModal_P} onHide={()=>{this.setState({showModal_P:false})}} >
                <form onSubmit={this.handleSubmit_Prioritetas}>
                    <ModalHeader closeButton>
                        <ModalTitle> Redaguoti užsakymą: </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup controlId='Prioritetas' validationState={this.validate('Prioritetas')}>
                            <ControlLabel>Prioritetas:</ControlLabel>
                            <FormControl
                                type="number"
                                placeholder="pvz.: 0"
                                value={this.state.form.Prioritetas}
                                fieldname='Prioritetas'
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
        );
    }

    Modal(){
        return (
            <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle> Redaguoti užsakymą: </ModalTitle>
                    </ModalHeader>
                    <ModalBody>

                    { this.state.error == undefined ? null : <p>{this.state.error}</p>}

                        { this.state.update == true ?
                            <FormGroup controlId='Numeris' /*validationState={this.validate('Numeris')}*/>
                                <ControlLabel> Užsakymo Numeris:</ControlLabel>
                                <FormControl
                                    type="text"
                                    disabled= "true"
                                    /*placeholder="pvz.: AAA-000"*/
                                    value={this.state.form.Numeris}
                                    fieldname='Numeris'
                                    onChange={this.handleFormChange}
                                   
                                />
                            </FormGroup> :
                            null
                        }

                        { this.state.update == true ?
                            <FormGroup controlId='Uzsakymo_data' validationState={this.validate('Uzsakymo_data')}>
                                <ControlLabel> Užsakymo data:</ControlLabel>
                                <FormControl
                                    type="datetime"
                                    disabled= "true"
                                    /*placeholder="pvz.: AAA-000"*/
                                    value={this.state.form.Uzsakymo_data}
                                    fieldname='Uzsakymo_data'
                                    onChange={this.handleFormChange}
                                   
                                />
                            </FormGroup> :
                            <FormGroup controlId='Uzsakymo_data' validationState={this.validate('Uzsakymo_data')}>
                                <ControlLabel> Užsakymo data:</ControlLabel>
                                <FormControl
                                    type="datetime"
                                    /*placeholder="pvz.: AAA-000"*/
                                    value={this.state.form.Uzsakymo_data}
                                    fieldname='Uzsakymo_data'
                                    onChange={this.handleFormChange}
                                    
                                />
                            </FormGroup>
                        }

                        <FormGroup controlId='Atlikimo_data' validationState={this.validate('Atlikimo_data')}>
                            <ControlLabel>Atlikimo data:</ControlLabel>
                            <FormControl
                                type="datetime"
                                placeholder="pvz.: 2017-12-12 15:16"
                                value={this.state.form.Atlikimo_data}
                                fieldname='Atlikimo_data'
                                onChange={this.handleFormChange}/>
                        </FormGroup>

                        <FormGroup controlId='Prioritetas' validationState={this.validate('Prioritetas')}>
                            <ControlLabel>Prioritetas:</ControlLabel>
                            <FormControl
                                type="number"
                                placeholder="pvz.: 0"
                                value={this.state.form.Prioritetas}
                                fieldname='Prioritetas'
                                onChange={this.handleFormChange}/>
                        </FormGroup>

                        <FormGroup controlId='Busena' validationState={this.validate('Busena')}>
                            <ControlLabel>Būsena:</ControlLabel>
                            <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "busena" onChange={this.handleFormChange} defaultValue={this.state.form.busena}>
                                {this.state.form == this.formInitialState ? null : //noretursi ne id o pavadinimo
                                    <option value={this.state.form.Busenos_id}>{this.state.form.busena}</option>
                                }
                                {this.state.select_states}
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='Suformavo' validationState={this.validate('Suformavo')}>
                            <ControlLabel>Užsakymo formuotojas:</ControlLabel>
                            <FormControl
                                //turetu buti vardas pavarde
                                type="text"
                                placeholder="vardas"
                                /*value={this.state.form.Variklio_darbinis_turis}
                                fieldname='Variklio_darbinis_turis'*/
                                onChange={this.handleFormChange}/>
                        </FormGroup>

                        <FormGroup controlId='Vairuotojas' validationState={this.validate('Vairuotojas')}>
                            <ControlLabel>Vairuotojas:</ControlLabel>
                            <FormControl
                                //turetu buti vardas pavarde
                                type="text"
                                placeholder="vardas"
                                /*value={this.state.form.Variklio_darbinis_turis}
                                fieldname='Variklio_darbinis_turis'*/
                                onChange={this.handleFormChange}/>
                        </FormGroup>

                        <FormGroup controlId='Transportas' validationState={this.validate('Transportas')}>
                            <ControlLabel>Transporto priemonė:</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.form.transporto_nr}
                                fieldname='transporto_nr'
                                onChange={this.handleFormChange}/>
                        </FormGroup>

                        { this.state.update == false ?
                            <FormGroup>
                                <ControlLabel>Išvykimo padalinys:</ControlLabel>
                                <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "is_pad_id" onChange={this.handleFormChange}>
                                    {this.state.form == this.formInitialState ? null :
                                        <option value={this.state.form.is_pad_id}>{this.state.form.is_pad_pavad}</option>
                                    }
                                    {this.state.select_subdivisions}
                                </FormControl>
                            </FormGroup> :
                            <FormGroup>
                                <ControlLabel>Išvykimo padalinys:</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    disabled= "true"
                                    value= {this.state.is_pad_id}
                                    fieldname= "Busenos_id"
                                    onChange={this.handleFormChange}
                                >
                                </FormControl>
                            </FormGroup>
                        }

                        { this.state.update == false ?
                            <FormGroup>
                                <ControlLabel>Atvykimo padalinys:</ControlLabel>
                                <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "at_pad_id" onChange={this.handleFormChange}>
                                    {this.state.form == this.formInitialState ? null :
                                        <option value={this.state.form.at_pad_id}>{this.state.form.at_pad_pavad}</option>
                                    }
                                    {this.state.select_subdivisions}
                                </FormControl>
                            </FormGroup> :
                            <FormGroup>
                                <ControlLabel>Atvykimo padalinys:</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    disabled= "true"
                                    value= {this.state.at_pad_id}
                                    fieldname= "at_pad_id"
                                    onChange={this.handleFormChange}
                                >
                                </FormControl>
                            </FormGroup>
                        }

                    </ModalBody>
=======
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
>>>>>>> refs/remotes/origin/master
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
<<<<<<< HEAD
        );
    }

    
    printName(name, surname){
        if(name == null || surname == null) {
            return "Nepriskirta";
        }
        return (name + " " + surname);
    }

    addError(m){
        this.setState({
            error: m
        })
    }

    render() {
        /*this.state.select_categories=[<option value="" key={-1}>Visos vairavimo kategorijos</option>];
        this.state.select_states=[<option value="" key={-1}>Visos būsenos</option>];*/
/*
        for (let i = 0; i <this.state.data.data.length; i++)
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
                <option key={i} value={v.Busenos_id}>
                    {v.Busena}
                </option>
                );
        }
*/
        let ordersRows = [];
        for (let i = 0; i < this.state.data.data.length; i++){
            let order = this.state.data.data[i];
            ordersRows.push(
                <tr>
                    <td>
                        {order.Prioritetas}
                    </td>
                    <td>
                        {order.Uzsakymo_data}
                    </td>
                    <td>
                        {order.Atlikimo_data}
                    </td>
                    <td>
                        {order.busena}
                    </td>
                    <td>
                        {order.pIs_pavadinimas}
                    </td>
                    <td>
                        {order.pI_pavadinimas}
                    </td>
                    <td>
                        {this.printName(order.sudare_vardas, order.sudare_pavarde)}
                    </td>
                    <td>
                        {this.printName(order.vair_vardas, order.vair_pavarde)}
                    </td>
                    <td>
                        <span>
                            <a id="RowButton" chamgeP={order.Numeris} onClick={this.OpenModal_Prioritetas}>
                                <span class="glyphicon glyphicon-exclamation-sign"> </span>
                            </a>
                            <a id="RowButton" update={order.Numeris} onClick={this.updateData_OpenModal}>
                                <span class="glyphicon glyphicon-info-sign"> </span>
                            </a>
                            <a id="RowButton" cancel={order.Numeris} onClick={this.cancelOrder}>
                                <span class="glyphicon glyphicon-remove-sign"> </span>
                            </a>
                        </span>
                    </td>                    
                </tr>
            );
        }

        return (
            <div className="">
                <div className="">
                    <div className="">
                        <table id="">
                            <thead>
                                <tr>
                                    <th>
                                        Prioritetas
                                    </th>
                                    <th>
                                        Užsakymo data
                                    </th>
                                    <th>
                                        Atlikimo data
                                    </th>
                                    <th>
                                        Būsena
                                    </th>
                                    <th>
                                        Išvykimo padalinys
                                    </th>
                                    <th>
                                        Atvykimo padalinys
                                    </th>
                                    <th>
                                        Sudarė
                                    </th>
                                    <th>
                                        Vairuotojas
                                    </th>
                                    <th id="Insert">
                                        <a onClick={this.OpenModal}>+</a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersRows}
                            </tbody>
                        </table>

                    </div>
                </div>

                {this.Modal()}

                {this.Modal_Prioritetas()}

=======
        }

        return(
            <div>
                <h2 className="title">Darbuotojų duomenys</h2>
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
>>>>>>> refs/remotes/origin/master
            </div>
        );
    }
}
<<<<<<< HEAD

export default Orders
=======
>>>>>>> refs/remotes/origin/master
