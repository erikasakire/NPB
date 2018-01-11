import React from 'react'
//import ReactTable from 'react-table'
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, FormControl,FormGroup, ControlLabel, ModalDialog} from 'react-bootstrap';
import { connect } from "react-redux";
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
            Busenos_id: "",
            //truksta formuotojo
            //truksta vairuotojo
            Driver_id: "",
            TransportoPriemone: "", //++
            pI_ID: "", // į padalinį
            pIs_ID: "",//iš padalinio
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
            Busenos_id: {
                regex:  /[0-9]/,
                nullable: false,
                unique: false
            },
            Driver_id: {
                regex:  /[0-9]/,
                nullable: true,
                unique: false
            },
            TransportoPriemone: {
                regex: /[a-zA-Z0-9\-]/,
                nullable: true,
                unique: false
            },
            pI_ID: {
                regex: /[0-9]/,
                nullable: false,
                unique: false
            },
            pIs_ID: {
                regex: /[0-9]/,
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
                allDrivers: [],
                allVehicles: [],
                allSubdivisions: []
            },
            showModal: false,
            showModal_P: false, 
            update: false,
            error: undefined,
            form: this.formInitialState,
            select_states: []

        };
        this.fetchData = this.fetchData.bind(this);
        this.OpenModal = this.OpenModal.bind(this);
        this.OpenModal_Prioritetas = this.OpenModal_Prioritetas.bind(this);
        this.updateData_OpenModal = this.updateData_OpenModal.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        if (this.state.form.Prioritetas == ""){
            return this.addError('Prašome įvesti prioritetą.');
        }
        if (this.state.form.pI_ID == ""){
            return this.addError('Pasirinkite atvykimo padalinį.');
        }
        if (this.state.form.pIs_ID == ""){
            return this.addError('Pasirinkite išvykimo padalinį.');
        }
        if (this.state.form.Atlikimo_data != "" && this.state.form.Uzsakymo_data >  this.state.form.Atlikimo_data){
            return this.addError('Klaidinga užsakymo arba užsakymo įvykdymo data');
        }
        //tas pats atvykymo isvykymo padalinys
 
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
                    "uz_data": this.state.form.Uzsakymo_data,
                    "prior": this.state.form.Prioritetas,
                    "busenos_id": this.state.form.Busenos_id,
                    "formuotojo_id": 4133,  //sutvarkyti
                    "vair_id": this.state.form.Driver_id,
                    "tp_id": this.state.form.TransportoPriemone,
                    "is_pad_id": this.state.form.pIs_ID,
                    "i_pad_id": this.state.form.pI_ID
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
                    "id": this.state.form.Numeris,
                    "at_data": this.state.form.Atlikimo_data,
                    "prior": this.state.form.Prioritetas,
                    "busenos_id": this.state.form.Busenos_id,
                    "formuotojo_id": 4133,  //sutvarkyti
                    "vair_id": this.state.form.Driver_id,
                    "tp_id": this.state.form.TransportoPriemone,
                    "is_pad_id": this.state.form.pIs_ID,
                    "i_pad_id": this.state.form.pI_ID
                })
            })
            .then(response => {
                console.log(response);
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
            }
        });
    }

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
        var date = new Date();
        var driversOptions =[<option value="" key={-1}>-- Vairuotojas nepasirinktas --</option>];
        var vehiclesOptions = [<option value="" key={-1}>-- Transp. priemonė nepasirinkta --</option>];
        var out_subDivisions = [<option value="" key={-1}>-- Pasirinkite padalinį --</option>];
        var in_subDivisions = [<option value="" key={-1}>-- Pasirinkite padalinį --</option>];
        this.state.select_states = [];

        //vairuotojai
        for (let i = 0; i <this.state.data.allDrivers.length; i++)
        {
            let v = this.state.data.allDrivers[i];
            let optionLine = "";
            if (v.Tabelio_nr == this.state.form.Driver_id) {
                optionLine = <option selected key={i} value={v.Tabelio_nr}>
                    {v.vardas}
                </option>
            } else {
                optionLine = <option key={i} value={v.Tabelio_nr}>
                    {v.vardas}
                </option>
            }
            driversOptions.push(
                    optionLine
                );
        }

        //Užsakymo būsenos
        for (let i = 0; i <this.state.data.allStates.length; i++)
        {
            let v = this.state.data.allStates[i];

            if ( i == 0 && this.state.form.Busenos_id == "" ) {
                this.state.form.Busenos_id = v.Busenos_id;
            }
            
            let optionLine = "";
            //pridesime selected prie esamos būsenos
            if (v.Busenos_id == this.state.form.Busenos_id) {
                optionLine = <option selected key={i} value={v.Busenos_id}>
                    {v.Busenos_pavadinimas}
                </option>
            } else {
                optionLine = <option key={i} value={v.Busenos_id}>
                    {v.Busenos_pavadinimas}
                </option>
            }
            this.state.select_states.push(
                    optionLine
                );
        }

        //transportas
        for (let i = 0; i <this.state.data.allVehicles.length; i++)
        {
            let v = this.state.data.allVehicles[i];
            let optionLine = "";
            if (v.TransportoPriemone == this.state.form.TransportoPriemone) {
                optionLine = <option selected key={i} value={v.TransportoPriemone}>
                    {v.aprasas}
                </option>
            } else {
                optionLine = <option key={i} value={v.TransportoPriemone}>
                    {v.aprasas}
                </option>
            }
            vehiclesOptions.push(
                    optionLine
                );
        }
        
        //padaliniai
        for (let i = 0; i <this.state.data.allSubdivisions.length; i++)
        {
            let v = this.state.data.allSubdivisions[i];
            let optionLine = "";
            //išvykimo
            if (v.id == this.state.form.pI_ID) {
                optionLine = <option selected key={i} value={v.id}>
                    {v.pavad}
                </option>
            } else {
                optionLine = <option key={i} value={v.id}>
                    {v.pavad}
                </option>
            }
            out_subDivisions.push(
                    optionLine
                );

            //atvykimo
            optionLine = "";
            if (v.id == this.state.form.pIs_ID) {
                optionLine = <option selected key={i} value={v.id}>
                    {v.pavad}
                </option>
            } else {
                optionLine = <option key={i} value={v.id}>
                    {v.pavad}
                </option>
            }
            in_subDivisions.push(
                    optionLine
                );
        }
        
        return (
            <Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} >
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle> Užsakymas: </ModalTitle>
                    </ModalHeader>
                    <ModalBody>

                    { this.state.error == undefined ? null : <p>{this.state.error}</p>}

                        { this.state.update == true ?
                            <FormGroup controlId='Numeris' /*validationState={this.validate('Numeris')}*/>
                                <ControlLabel> Užsakymo Numeris:</ControlLabel>
                                <FormControl
                                    type="text"
                                    disabled= "true"
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
                                    value={this.state.form.Uzsakymo_data}
                                    fieldname='Uzsakymo_data'
                                    onChange={this.handleFormChange}
                                   
                                />
                            </FormGroup> : null
                            /*<FormGroup controlId='Uzsakymo_data' validationState={this.validate('Uzsakymo_data')}>
                                <ControlLabel> Užsakymo data:</ControlLabel>
                                <FormControl
                                    type="datetime"
                                    value={date}
                                    fieldname='Uzsakymo_data'
                                    onChange={this.handleFormChange}
                                    
                                />
                            </FormGroup>*/
                        }

                        { this.state.update == true ?
                        <FormGroup controlId='Atlikimo_data' validationState={this.validate('Atlikimo_data')}>
                            <ControlLabel>Atlikimo data:</ControlLabel>
                            <FormControl
                                type="datetime"
                                placeholder="pvz.: 2017-12-12 15:16"
                                value={this.state.form.Atlikimo_data}
                                fieldname='Atlikimo_data'
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        : null 
                        }

                        <FormGroup controlId='Prioritetas' validationState={this.validate('Prioritetas')}>
                            <ControlLabel>Prioritetas:</ControlLabel>
                            <FormControl
                                type="number"
                                placeholder="pvz.: 0"
                                value={this.state.form.Prioritetas}
                                fieldname='Prioritetas'
                                onChange={this.handleFormChange}/>
                        </FormGroup>
                        
                        <FormGroup controlId='Busena' validationState={this.validate('Busenos_id')}>
                            <ControlLabel>Būsena:</ControlLabel>
                            <FormControl componentClass="select" placeholder="pasirinkite" fieldname="Busenos_id" onChange={this.handleFormChange}>
                                {this.state.select_states}
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='Vairuotojas' validationState={this.validate('Driver_id')}>
                            <ControlLabel>Vairuotojas:</ControlLabel>
                            <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "Driver_id" onChange={this.handleFormChange}>
                                {driversOptions}
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='Transportas' validationState={this.validate('TransportoPriemone')}>
                            <ControlLabel>Transporto priemonė:</ControlLabel>
                            <FormControl componentClass="select" placeholder="pasirinkite" fieldname= "TransportoPriemone" onChange={this.handleFormChange}>
                                {vehiclesOptions}
                            </FormControl>
                        </FormGroup>

                        { this.state.update == false ?
                            <FormGroup controlId='pIs_ID' validationState={this.validate('pIs_ID')}>
                                <ControlLabel>Išvykimo padalinys:</ControlLabel>
                                <FormControl 
                                    componentClass="select"
                                    placeholder="pasirinkite"
                                    fieldname= "pIs_ID"
                                    onChange={this.handleFormChange}
                                >
                                    {out_subDivisions}
                                </FormControl>
                            </FormGroup> :
                            <FormGroup controlId='pIs_ID' validationState={this.validate('pIs_ID')}>
                                <ControlLabel>Išvykimo padalinys:</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    disabled= "true"
                                    fieldname= "pIs_ID"
                                    onChange={this.handleFormChange}
                                >
                                    {out_subDivisions}
                                </FormControl>
                            </FormGroup>
                        }

                        { this.state.update == false ?
                            <FormGroup controlId='pI_ID' validationState={this.validate('pI_ID')}>
                                <ControlLabel>Atvykimo padalinys:</ControlLabel>
                                <FormControl 
                                    componentClass="select"
                                    placeholder="pasirinkite"
                                    fieldname= "pI_ID"
                                    onChange={this.handleFormChange}
                                >
                                    {in_subDivisions}
                                </FormControl>
                            </FormGroup> :
                            <FormGroup controlId='pI_ID' validationState={this.validate('pI_ID')}>
                                <ControlLabel>Atvykimo padalinys:</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    disabled= "true"
                                    fieldname= "pI_ID"
                                    onChange={this.handleFormChange}
                                >
                                    {in_subDivisions}
                                </FormControl>
                            </FormGroup>
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>    
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
        let ordersRows = [];
        for (let i = 0; i < this.state.data.data.length; i++){
            let order = this.state.data.data[i];
            this.formInitialState.driver = order.vair_vardas + " " + order.vair_pavarde;
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
                        {order.Driver == null ? "Nepriskirta" : order.Driver }
                    </td>
                    <td>
                        <span>
                            <a id="Button" chamgeP={order.Numeris} onClick={this.OpenModal_Prioritetas}>
                                <span class="glyphicon glyphicon-exclamation-sign"> </span>
                            </a>
                            <a id="Button" update={order.Numeris} onClick={this.updateData_OpenModal}>
                                <span class="glyphicon glyphicon-info-sign"> </span>
                            </a>
                            <a id="Button" cancel={order.Numeris} onClick={this.cancelOrder}>
                                <span class="glyphicon glyphicon-trash"> </span>
                            </a>
                        </span>
                    </td>                    
                </tr>
            );
        }

        return (
            <div id="main" class="flex container">
                <h1>Užsakymai</h1>
                <table id="lentele">
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
                            <th id="AddButton">
                                <a onClick={this.OpenModal}>
                                    <span class="glyphicon glyphicon-plus-sign"/>
                                </a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersRows}
                    </tbody>
                </table>

                {this.Modal()}

                {this.Modal_Prioritetas()}

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
)(Orders);
