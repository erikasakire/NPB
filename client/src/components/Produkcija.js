import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from '../config.json';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';

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
            Kiekis: {
                regex: /^(-?)[0-9]+(\.[0-9]+)?$/,
                nullable: false,
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
        fetch(config.server + '/produkcija/visi', {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
            this.setState({data: response});
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
        var date1 = new Date(this.state.form.Pagaminimo_data);
        var date2 = new Date(this.state.form.Galioja_iki);

        if(date1.getTime() >= date2.getTime()){
            return this.addError('Pagaminimo data negali būti mažesnė arba lygi galiojimo datai.');
        }
        if (this.state.form.Tiekiamas == ""){
            return this.addError('Pasirinkite ar tiekiama ar ne.');
        }
        if (this.state.form.Kiekis == ""){
            return this.addError('Nurodykite prekės kiekį');
        }
        if (this.state.form.Kategorija_Kategorija_id == ""){
            return this.addError('Pasirinkite kategoriją.');
        }
        if (this.state.form.Padalinys_id == ""){
            return this.addError('Pasirinkite padalinį.');
        }
        if(this.state.form.Galioja_iki < this.state.form.Pagaminimo_data){
            return this.addError('Galiojimo data negali būti ankstesnė nei pagaminimo data.')
        }
        
        console.log(document.getElementById("tiekiama_select"));
        let link = config.server + (this.state.update ? '/produkcija/redaguoti' : '/produkcija/prideti');
        let body = Object.assign({}, this.state.form, {Tiekiamas: document.getElementById("tiekiama_select").value == "true" ? 1 : 0});
        fetch(link, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (response.status == 200) {
                this.setState({showModal: false});
                this.fetchData();
                NotificationManager.success(!this.state.update ?   "Produkto informacija sėkmingai įterpta." : "Produkto informacija sėkmingai atnaujinta." );
            }
        });
    }
    addError(m){
        this.setState({
            error: m
        })
    }
    TrinamLauk(e){
        let id = e.target.parentNode.attributes['delete'].nodeValue;
        fetch(config.server + '/produkcija/salinti', {
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
                NotificationManager.success("Produktas sėkmingai ištrintas.");
            }
        })
    }

    render(){
        if (this.state.data.data.length == 0 ){
            return (
                <div class="pre-loader"></div>
            );
        }
        /** Formuojamas prekių sąrašas */
        let eilutes = [];
        for(let i = 0; i < this.state.data.data.length; i++){
            let a = this.state.data.data[i];
            
            /** Patikrina ar prekė tenkina pirmą filtrą, kategorijos filtrą */
            if(this.state.selectedFiltras != "" && a.Kategorija_Kategorija_id != this.state.selectedFiltras ){ continue; }
            /** Patikrina ar prekė tenkina antrą filtrą, padalinių filtrą */
            if(this.state.selectedFiltras2 != "" && a.Padalinys_Inventorinis_numeris != this.state.selectedFiltras2){ continue; }

            /** Formuojamas prekių sąrašas */
            eilutes.push(
                <tr key={i} className="aprasymas">
                    {/** Prekės barkodas, kuris paspaudus nukreipia į prekės puslapį */}
                    <td><Link id="forButtons" to={'/produkcija/' + a.Barkodas}>{a.Barkodas}</Link></td>

                    {/** Prekės pavadinimas */}
                    <td>{a.Pavadinimas}</td>

                    {/** Prekės vieneto kaina */}
                    <td>{a.Vieneto_kaina} &euro;</td>

                    {/** Prekės kiekis, kuris yra spausdinamas tada, kada padalinio vistras nenustatytas */}
                    {
                        this.state.selectedFiltras2 == "" ? null :
                        <td>{a.Kiekis}</td>
                    }

                    {/** Prekės matavimo vienetas. Numatytoji reikšmė "Vnt." */}
                    {
                        a.Matavimo_vnt != "" ? 
                        <td>{a.Matavimo_vnt}</td> : 
                        <td>Vnt.</td>
                    } 
                    
                    {/** Padalinio pavadinimas */}
                    <td>{a.padalinio_pavadinimas}</td>

                    {/** Prekės aprašymo mygtukas. Paspaudus šį mygtuką atsidaro papildoma eilutė, kuri atvaizduoja aprašymą. Jeigu aprašymo nėra spausdinamas atitinkamas tekstas. */}
                    {
                        a.Aprasymas != "" ?
                        <td>
                            <a id="ForButtons" onClick={()=>{
                                let data=this.state.data;
                                //sukuriam naują kintamąjį.
                                data.data[i].RodytiAprasyma = true;
                                //atnaujinamas data masyvas ir į jį įdedamas kintamasis data.
                                this.setState({data: data});
                            }}>Detaliau...</a>
                        </td> : 
                        <td>Aprašymo nėra </td>
                    }

                    {/** Prekės ištrynimo ir redagavimo mygtukai. Spausdinami tik redaktoriui ir administratoriui. */}
                    {
                        ["1","2"].indexOf(this.props.rangas) != "-1" ? 
                        <td>
                            <a id="ForButtons" delete={a.Barkodas} onClick={this.TrinamLauk}><span class="glyphicon glyphicon-trash"> </span></a> 
                            <br/> 
                            <a id="ForButtons" update={a.Barkodas} onClick={this.OpenUpdate}>Redaguoti</a>
                        </td> : 
                        null 
                    }
                </tr>
            );
            if(a.Aprasymas != "" && a.RodytiAprasyma == true){
                eilutes.push(     
                    <tr>
                        <td colSpan="5" style={{padding:"0px", border:"none"}}><div style={{ maxHeight: "600px", minHeight: "50px"}}><h5 style={{ textAlign: "left", fontWeight: "600" }}>Aprašymas: </h5>{a.Aprasymas}</div></td>
                    </tr>
                );
            }
        }

        /** Formuojamas kategorijų filtras */
        let filt=[];
        for(let i = 0; i < this.state.data.filtras.length; i++){
            let b = this.state.data.filtras[i];
            filt.push(
                <option key={i} value={b.Kategorija_id}>
                    {b.Kategorijos_pavadinimas}
                </option>
            );
        }

        /** Formuojamas padalinių filtras */
        let filt2=[];
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
                {/** Puslapio pavadinimas */}
                <h2 style={{
                            textAlign: "center",
                            color: "#985E6D"
                        }}>
                    Produkcija
                </h2>

                {/** #region: Prekių filtrai */}
                    {/** Kategorijos filtras */}
                    <FormGroup>
                        <ControlLabel>Kategorijos:</ControlLabel> 
                        <FormControl componentClass="select" defaultValue={this.state.selectedFiltras} onChange={(e) => {this.setState({selectedFiltras: e.target.value})}}>
                            <option value="">Visos kategorijos</option>
                            {filt}
                        </FormControl>
                    </FormGroup>
                    {/** Padalinių filtras */}
                    <FormGroup> 
                        <ControlLabel>Padalinys:</ControlLabel> 
                        <FormControl componentClass="select" defaultValue={this.state.selectedFiltras2} onChange={(e) => {this.setState({selectedFiltras2: e.target.value})}}>
                            <option value="">Visos prekės kataloge</option>
                            {filt2}
                        </FormControl>
                    </FormGroup>        
                {/** #endregion: Prekių filtrai */}

                {/** Prekių lentelė */}
                <table style={{ width: "100%", borderCollapse: "collapse"}}>
                    <tbody>
                        <tr>
                            <th>Barkodas</th>
                            <th>Pavadinimas</th>
                            <th>Kaina</th> 
                            {
                                this.state.selectedFiltras2 == "" ? null :
                                <th>Kiekis</th>
                            }
                            <th>Matavimo vienetai</th>
                            <th>Padalinys</th>
                            <th></th>
                            {
                                ["1","2"].indexOf(this.props.rangas) != "-1" ?
                                <th id="Insert"><a onClick={this.OpenModal}>+</a></th> :
                                null
                            }
                        </tr>
                        {/** Suformuotas prekių sąrašas */}
                        {eilutes}
                    </tbody>
                </table>

                {/** Produkto įvedimo bei redagavimo forma */}
                <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                    <form onSubmit={this.handleSubmit}>
                        {/** Antraštė */}
                        <ModalHeader closeButton>
                            <ModalTitle> Įveskite produkto duomenis: </ModalTitle>
                         </ModalHeader>
                        {/** Turinys */}
                        <ModalBody>
                            {/** Klaidų pranešimas */}
                            { this.state.error == undefined ? null : <p>{this.state.error}</p>}

                            {/** Prekės barkodas. Įvedamas automatiškai, jeigu forma radaguojama */}
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

                            {/** Prekės pavadinimas */}
                            <FormGroup controlId='Pavadinimas' validationState={this.validate('Pavadinimas')}>
                                <ControlLabel>Pavadinimas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Relė" 
                                    value={this.state.form.Pavadinimas} 
                                    fieldname='Pavadinimas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės vieneto kaina */}
                            <FormGroup controlId='Vieneto_kaina' validationState={this.validate('Vieneto_kaina')}>
                                <ControlLabel>Vieneto kaina:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 15.99" 
                                    value={this.state.form.Vieneto_kaina} 
                                    fieldname='Vieneto_kaina' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės aprašymas */}
                            <FormGroup controlId='Aprasymas' validationState={this.validate('Aprasymas')}>
                                <ControlLabel>Aprašymas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="" 
                                    componentClass="textarea"
                                    value={this.state.form.Aprasymas} 
                                    fieldname='Aprasymas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės kiekis */}
                            <FormGroup controlId='Kiekis' validationState={this.validate('Kiekis')}>
                                <ControlLabel>Kiekis:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 15"  
                                    value={this.state.form.Kiekis} 
                                    fieldname='Kiekis' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės matavimo vienetas */}
                            <FormGroup controlId='Matavimo_vnt' validationState={this.validate('Matavimo_vnt')}>
                                <ControlLabel>Matavimo vienetai:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: cm"  
                                    value={this.state.form.Matavimo_vnt} 
                                    fieldname='Matavimo_vnt' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės gamintojas */}
                            <FormGroup controlId='Gamintojas' validationState={this.validate('Gamintojas')}>
                                <ControlLabel>Gamintojas:</ControlLabel>
                                <FormControl 
                                    type="text"  
                                    placeholder="pvz.: Maxima"  
                                    value={this.state.form.Gamintojas} 
                                    fieldname='Gamintojas' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės angliškas pavadinimas */}
                            <FormGroup controlId='PavadinimasEN' validationState={this.validate('PavadinimasEN')}>
                                <ControlLabel>Pavadinimas angliškai:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: cable" 
                                    value={this.state.form.PavadinimasEN} 
                                    fieldname='PavadinimasEN' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės pagaminimo data. Tiksliau, partijos data.*/}
                            <FormGroup controlId='Pagaminimo_data' validationState={this.validate('Pagaminimo_data')}>
                                <ControlLabel>Pagaminimo data:</ControlLabel>
                                <FormControl 
                                    type="date" 
                                    value={this.state.form.Pagaminimo_data.substring(0, 10)} 
                                    fieldname='Pagaminimo_data' 
                                    onChange={this.handleFormChange}
                                />
                            </FormGroup>

                            {/** Prekės galiojimo data. Tiksliau, partijos galijimo data. */}
                            <FormGroup controlId='Galioja_iki' validationState={this.validate('Galioja_iki')}>
                                <ControlLabel>Galiojimo data:</ControlLabel>
                                <FormControl 
                                    type="date" 
                                    value={this.state.form.Galioja_iki.substring(0, 10)} 
                                    fieldname='Galioja_iki' 
                                    onChange={this.handleFormChange}/>
                            </FormGroup>

                            {/** Prekės tiekimo parametras */}
                            <FormGroup controlId="tiekiama_select">
                                <ControlLabel>Ar tiekiama:</ControlLabel>
                                <FormControl componentClass="select" placeholder="pasirinkite" fieldname="Tiekiamas" onChange={this.handleFormChange} defaultValue={this.state.form == this.formInitialState || this.state.form.Tiekiama == "1"}>
                                    <option value={true}>Taip</option>
                                    <option value={false}>Ne</option>
                                </FormControl>
                            </FormGroup>

                            {/** Prekės kategorija */}
                            { this.state.update == true ? null :
                                <FormGroup>
                                    <ControlLabel>Kategorija:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Kategorija_Kategorija_id" onChange={this.handleFormChange}>
                                        <option></option>
                                        {filt}
                                    </FormControl>
                                </FormGroup>
                            }

                            {/** Prekė padaliniui */}
                            { this.state.update == true ? null :
                                <FormGroup>
                                    <ControlLabel>Padalinys:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Padalinys_id" onChange={this.handleFormChange}>
                                        <option></option>
                                        {filt2}
                                    </FormControl>
                                </FormGroup>
                            }

                         </ModalBody>
                        {/** Poraštė */}
                        <ModalFooter>
                            <Button type="submit">Patvirtinti</Button>
                         </ModalFooter>
                    </form>
                </Modal>
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
)(Produkcija);