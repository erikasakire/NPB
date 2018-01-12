import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import config from '../config.json';

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

            modalData: {
                show: false,
                update: false,
                values: this.formInitialState,
                error: null,
                hide: () => {
                    this.setState({
                        modalData: Object.assign({}, this.state.modalData, {
                            show: false,
                            update: false,
                            error: null,
                            values: this.formInitialState
                        })
                    });
                },
                openAsInsertion: () => {
                    this.setState({
                        modalData: Object.assign({}, this.state.modalData, {
                            show: true
                        })
                    });
                },
                openAsUpdation: (e) => {
                    let element = this.state.data.data.find((value) => {
                        if ( value.Inventorinis_numeris == e.target.id ){
                            return value;
                        }
                    });
                    this.setState({
                        modalData: Object.assign({}, this.state.modalData, {
                            show: true,
                            update: true,
                            values: element
                        })
                    })
                },
                onSubmit: this.handleSubmit.bind(this),
            },

            selectedFiltras: "",
            showModal2: false,
            showModal3: false,
            formCurrentRedaktorius: null,
            current: undefined,
            current2: undefined,
            form2: null,
            padal: false,
            delete: false,
            error: undefined
        };

        this.validate = this.validate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
        this.handleSubmit3 = this.handleSubmit3.bind(this);
        this.TrinamLauk = this.TrinamLauk.bind(this);
        this.addError = this.addError.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.OpenEditorModal = this.OpenEditorModal.bind(this);
        this.OpenEditorModal2 = this.OpenEditorModal2.bind(this);
        this.handleFormChange2 = this.handleFormChange2.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.selectedOptions = this.selectedOptions.bind(this);
        this.successs = false;
    }
    
    componentWillMount(){
        this.fetchData();
    }
    fetchData (){
        fetch(config.server + '/padaliniai/visi', {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
            this.setState({data: response});
            
        })
    }

    showNotification(){
        if (this.state.data.data.length == 0){
            return 0;
        }
       
        NotificationManager.warning("Kuriant naują padalinį, privalo būti laisvų darbuotojų, kurių šiuo metu nėra.");
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
    handleFormChange2(e){
        this.setState({form2: e.target.value})
    }
    OpenEditorModal(e){
        this.setState({padal: true});        
        let id = e.target.attributes['padal'].value;
        let element = this.state.data.data.find((element) => {
            if (element.Inventorinis_numeris == id){
                return element;
            }
        })
        this.setState({
            current: Object.assign({}, element),
            showModal2: true,
            form2: element.Redaktorius
        });
    }

    OpenEditorModal2(e){
        console.log(e.target);
        this.setState({delete: true});        
        let id = e.target.attributes['delete'].value;
        let element = this.state.data.data.find((element) => {
            if (element.Inventorinis_numeris == id){
                return element;
            }
        })
        this.setState({
            current2: Object.assign({}, element),
            showModal3: true
        });
    }

    selectedOptions(id){
        let redaktorius = document.getElementById(id);

        if (redaktorius == undefined){
            return null;
        }

        let selected = [];
        if(redaktorius.options.length != 0){
            for(let i = 0; i < redaktorius.options.length; i++){
                if (redaktorius.options[i].selected){
                    selected.push(redaktorius.options[i].value);
                }
            }
        }
        return selected;
    }

    handleSubmit(e){
        e.preventDefault();  

        if (this.state.modalData.values.Inventorinis_numeris == ""){
            return this.addError('Prašome įvesti inventorinį numerį.');
        }
        if (this.state.modalData.values.Salis == ""){
            return this.addError('Prašome įvesti šalį');
        }
        if (this.state.modalData.values.Miestas == ""){
            return this.addError('Prašome įvesti miestą');
        }
        if (this.state.modalData.values.Gatve == ""){
            return this.addError('Prašome įvesti gatvės pavadinimą');
        }
        if (this.state.modalData.values.padalinio_pavadinimas == ""){
            return this.addError('Prašome įvesti padalinio pavadinimą');
        }
        if (this.state.modalData.values.Pasto_kodas == ""){
            return this.addError('Prašome įvesti Pasto_kodą');
        }
        if (this.state.modalData.values.Ilguma == ""){
            return this.addError('Prašome įvesti ilgumą');
        }
        if (this.state.modalData.values.Platuma == ""){
            return this.addError('Prašome įvesti platumą');
        }

        let redaktorius = this.selectedOptions('redselect');
        if (redaktorius == null){
            redaktorius = [""];
        }
        else if (redaktorius.length == 0){
            return this.addError('Prašome pasirinkti redaktorių');
        }
        let link = config.server + (this.state.modalData.update ? '/padaliniai/redaguoti' : '/padaliniai/prideti');
        let body = Object.assign({}, this.state.modalData.values, { Redaktorius: redaktorius[0]} )
        fetch(link, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            switch (response.status){
                case 200: {
                    NotificationManager.success(!this.state.modalData.update ?   "Padalinio informacija sėkmingai įterpta." : "Padalinio informacija sėkmingai atnaujinta." );
                    this.state.modalData.hide();
                    this.fetchData();
                    break;
                }
                case 400: {
                    this.setState({modalData: Object.assign({}, this.state.modalData, { error: "Ivyko klaida vykdant užklausą" })});
                    response.json().then(response => {
                        console.log(response.error);
                    });

                    break;
                }
            }
        });
    }

    handleSubmit2(e){
        e.preventDefault();

        if (this.state.form2.Redaktorius == ""){
            return this.addError('Prašome pasirinkti redaktorių');
        }
        else{
            fetch(config.server + '/padaliniai/samdyti', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Redaktorius": this.state.form2,
                    "Inventorinis_numeris": this.state.current.Inventorinis_numeris
                })
            })
        .then(response => {
            if(response.status == 200){                
                this.setState({showModal2: false});
                this.fetchData();
            }
        })
        }
    }
    handleSubmit3(e){
        e.preventDefault();
        this.TrinamLauk(e);
        this.setState({showModal3: false});
    }
    addError(m){
        this.setState({
            error: m
        })
    }
    TrinamLauk(e){
        let id = this.state.current2.Inventorinis_numeris;
        this.successs = true;
        fetch(config.server + '/padaliniai/salinti', {
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
                NotificationManager.success("Padalinys sėkmingai ištrintas.");
            }
            else if (response.status == 400){
                NotificationManager.warning("Padadalinyje yra prekių. Tynimas negalimas!", null, 5000, ()=>{this.props.history.push("/padaliniai/" + id)});
            }
        })
    }

    render(){
        if (this.state.data.data.length == 0 ){
            return (
                <div class="pre-loader"></div>
            );
        }

        let eilutes = [];
        for(let i = 0; i < this.state.data.data.length; i++){
            let a = this.state.data.data[i];
            if(this.state.selectedFiltras == "" || a.Salis == this.state.selectedFiltras){
                eilutes.push(
                    <tr key={i}>
                        <td><Link style={{color: "#985E6D", textDecoration: "none",  cursor: "pointer"}} to={'/padaliniai/' + a.Inventorinis_numeris} >{a.Inventorinis_numeris}</Link></td>
                        <td>{a.padalinio_pavadinimas}</td>
                        <td>{a.Salis}</td>

                        {["1"].indexOf(this.props.rangas) != "-1" ? 
                            <td><Link id="ForButtons" to={'/darbuotojas/' + a.Redaktorius}>{a.Redaktorius} </Link></td> :
                            <td>{a.Redaktorius} </td>
                        }
                        {["1"].indexOf(this.props.rangas) != "-1" ? 
                        <td>
                            <a id="ForButtons"  ><span className="glyphicon glyphicon-trash" onClick={this.OpenEditorModal2} delete={a.Inventorinis_numeris}></span></a> 
                            <br/>
                           
                            <a className="ForButtons" id={a.Inventorinis_numeris} onClick={this.state.modalData.openAsUpdation}>Redaguoti</a>
                            </td> 
                         : null}
                        {["1"].indexOf(this.props.rangas) != "-1" && this.state.data.samdyti.length > 0 ? 
                            <td><a style={{color: "#985E6D", textDecoration: "none",  cursor: "pointer"}} padal={a.Inventorinis_numeris} onClick={this.OpenEditorModal}>Pakeiskite padalinio Redaktorių</a></td> 
                            : null
                            }
                    </tr>
                )
            }
        }
        
        
        let filt = [<option value="" key={-1}>Visi</option>];
        for(let i = 0; i < this.state.data.filtras.length; i++){
            let b = this.state.data.filtras[i];
            filt.push(
                <option key={i} value={b.Salis}>
                    {b.Salis}
                </option>
            );
        }

        let samd =  [];
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

                { /** Išvedimo lentelė */ }
                <table style={{ width: "100%"}}>
                    <tbody>
                        <tr>
                            <th>Inventorinis numeris</th>
                            <th>Pavadinimas</th>
                            <th>Šalis</th>
                            <th 
                                class="popup" 
                                onMouseOver={(e) => {document.getElementById("myPopup").classList.add("popuptext_visible")}}
                                onMouseLeave={(e) => {document.getElementById("myPopup").classList.remove("popuptext_visible")}}    
                            >Redaktorius <span class="popuptext" id="myPopup">Valdantis padalinį darbuotojas.</span> </th>
                            {["1"].indexOf(this.props.rangas) != "-1" ?
                                <th id="Insert"><a onClick={this.state.data.samdyti.length > 0 ? this.state.modalData.openAsInsertion : this.showNotification}>+</a></th> : null}
                            {["1"].indexOf(this.props.rangas) != "-1" && this.state.data.samdyti.length > 0 ? <th></th> : null}
                         </tr>
                        { eilutes }
                    </tbody>
                </table>
                
                <Modal show={this.state.modalData.show} onHide={this.state.modalData.hide}>
                   <form onSubmit={this.state.modalData.onSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle> 
                                { 
                                    this.state.modalData.update ? 
                                    'Pakeistkite padalinio duomenis:' :
                                    'Įveskite padalinio duomenis:'
                                }
                            </ModalTitle>
                         </ModalHeader>
                        <ModalBody>
                            { this.state.modalData.error == null ? null :
                                <FormGroup>
                                    <ControlLabel>{this.state.error}</ControlLabel>
                                </FormGroup>
                             }
                            <FormGroup controlId='Inventorinis_numeris' validationState={this.validate('Inventorinis_numeris')}>
                                <ControlLabel>Inventorinis numeris:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 123" 
                                    value={this.state.modalData.values.Inventorinis_numeris} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Inventorinis_numeris: e.target.value })})})}
                                    disabled={this.state.modalData.update}    
                                />
                             </FormGroup>
                            <FormGroup controlId='padalinio_pavadinimas' validationState={this.validate('padalinio_pavadinimas')}>
                                <ControlLabel>Pavadinimas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Revilė" 
                                    value={this.state.modalData.values.padalinio_pavadinimas} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { padalinio_pavadinimas: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Salis' validationState={this.validate('Salis')}>
                                <ControlLabel>Šalis:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Lietuva" 
                                    value={this.state.modalData.values.Salis} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Salis: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='SalisEN' validationState={this.validate('SalisEN')}>
                                <ControlLabel>Šalis angliškai:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Lithuania" 
                                    value={this.state.modalData.values.SalisEN} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { SalisEN: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Regionas' validationState={this.validate('Regionas')}>
                                <ControlLabel>Regionas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Aukštaitija"  
                                    value={this.state.modalData.values.Regionas} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Regionas: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Rajonas' validationState={this.validate('Rajonas')}>
                                <ControlLabel>Rajonas:</ControlLabel>
                                <FormControl 
                                    type="text"  
                                    placeholder="pvz.: Vilnius"  
                                    value={this.state.modalData.values.Rajonas} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Rajonas: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Miestas' validationState={this.validate('Miestas')}>
                                <ControlLabel>Miestas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Vilnius" 
                                    value={this.state.modalData.values.Miestas} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Miestas: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Gatve' validationState={this.validate('Gatve')}>
                                <ControlLabel>Gatvė:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: Gedimino pr." 
                                    value={this.state.modalData.values.Gatve} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Gatve: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Pasto_kodas' validationState={this.validate('Pasto_kodas')}>
                                <ControlLabel>Pašto kodas:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 4521" 
                                    value={this.state.modalData.values.Pasto_kodas} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Pasto_kodas: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Ilguma' validationState={this.validate('Ilguma')}>
                                <ControlLabel>Ilguma:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 43.15" 
                                    value={this.state.modalData.values.Ilguma} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Ilguma: e.target.value })})})}
                                    />
                             </FormGroup>
                            <FormGroup controlId='Platuma' validationState={this.validate('Platuma')}>
                                <ControlLabel>Platuma:</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    placeholder="pvz.: 45.15" 
                                    value={this.state.modalData.values.Platuma} 
                                    onChange={(e) => this.setState({ modalData: Object.assign({}, this.state.modalData, { values: Object.assign({}, this.state.modalData.values, { Platuma: e.target.value })})})}
                                    />
                             </FormGroup>
                            { this.state.modalData.update == true ? null :
                                <FormGroup controlId="redselect">
                                    <ControlLabel>Redaktorius:</ControlLabel>
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname="Redaktorius">
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
                                    <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Redaktorius" onChange={this.handleFormChange2}>
                                        {this.state.current == undefined ? null : <option value={this.state.current.Redaktorius}>{this.state.current.Vardas + " " + this.state.current.Pavarde}</option>}
                                        {samd}
                                    </FormControl>
                                </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit">Patvirtinti</Button>
                        </ModalFooter>
                    </form>
                </Modal>  
                <Modal show={this.state.showModal3} onHide={()=>{this.setState({showModal3:false})}} >
                   <form onSubmit={this.handleSubmit3}>
                        <ModalHeader closeButton>
                            <ModalTitle> Ar tikrai norite ištrinti šį padalinį? </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                                <FormGroup>
                                    <label> Ar tikrai norite ištrinti padalinį { this.state.current2 == undefined ? null : this.state.current2.padalinio_pavadinimas  + "? "}
                                        šalis:{ this.state.current2 == undefined ? null : " " + this.state.current2.Salis}.</label>
                                </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit">Taip</Button>
                        </ModalFooter>
                    </form>
                </Modal>  
            </div>
        );
    }
}

export default withRouter(connect(
    state => {
        return {
            rangas: state.user.rangas.id
        }
    }
)(Padaliniai));