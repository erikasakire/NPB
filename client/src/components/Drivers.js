import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader, ModalTitle, FormGroup, FormControl, ControlLabel , ModalFooter, Button, PageHeader} from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import config from '../config.json';
import moment from 'moment';
import { NotificationManager } from "react-notifications";

class Drivers extends React.Component{
    constructor(props){
        super(props);

        this.formInitialState = {
            Tabelio_nr: "",
            Vairavimo_stazas: "",
            Prasizengimu_sk: "",
            Profesine_kvalifikacija: "",
            Technografo_kortele: false,
            AsmensKodas: "",
            Vardas: "",
            Pavarde: "",
            Telefono_nr: "",
            Epastas: "",
            Gyvenamoji_vieta: "",
            Gimimo_data: "",
            Issilavinimas: "",
            Sveikatos_draudimas: false,
        }

        this.state = {
            /** element used to store data returned from database */
            data: {
                empty: true,
                fetched: false,
                data: []
            },
            /** Modal used for user info */
            modal: {
                show: false,
                data: null
            },
            /** Free tasks */
            tasks: {
                show: false,
                fetched: false,
                data: null,
                for: null,
            },
            /** Driver tasks */
            driverTasks: {
                show: false,
                fetched: false,
                data: null,
                driver: null
            },
            /** Free TP */
            ftp: {
                show: false,
                fetched: false,
                data: null,
                driver: null
            },
            update: {
                show: false,
                data: this.formInitialState,
                driver: null,

                openInsertion: (e) => {
                    this.setState({
                        update: Object.assign({}, this.state.update, {
                            show: true,
                        })
                    });
                },
                openUpdation: (e) => {
                    let element = this.state.data.data.find((value) => { 
                        if (value.Tabelio_nr == e.target.id){
                            return value;
                        }
                    })

                    this.setState({
                        update: Object.assign({}, this.state.update, {
                            data: Object.assign({}, this.state.update.data, element),
                        })
                    });
                },
                onHide: () => {
                    this.setState({
                        update: Object.assign({}, this.state.update, {
                            show: false,
                            data: this.formInitialState,
                        })
                    })
                },
                onSubmit: (e) => {
                    e.preventDefault();

                    fetch(config.server + '/sistemosprieinamumas/registruoti/vairuotojas', {
                        method: "POST",
                        headers: {
                            "Accept": "appication/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(this.state.update.data)
                    })
                    .then(response => {
                        switch(response.status){
                            case 200: {
                                this.fetchData();
                                this.state.update.onHide();
                                break;
                            }
                            default: {
                                console.log("BAD");
                                this.state.update.onHide();
                                break;
                            }

                        }
                    })
                }
            },

            modal_newWorker: {
                show: false,
                modalPage: 1,
                drivingCategories: []
            }
        };

        this.fetchData = this.fetchData.bind(this);

        this.showInfo = this.showInfo.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.addOrder = this.addOrder.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
        this.closeOrders = this.closeOrders.bind(this);
        this.handleOrdersSubmit = this.handleOrdersSubmit.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);

        this.closeDriverOrders = this.closeDriverOrders.bind(this);
        this.openDriverOrders = this.openDriverOrders.bind(this);

        this.assingTP = this.assingTP.bind(this);
        this.fetchFreeTP = this.fetchFreeTP.bind(this);
        this.closeTP = this.closeTP.bind(this);
        this.handleTPSubmit = this.handleTPSubmit.bind(this);
        this.getDateFromPersonID = (id) => {
            if (id.length != 11){
                return null;
            }

            let date = "";

            switch(id.substring(0, 1)){
                case "3":
                case "4":
                    date += "19";
                    break;
                case "5":
                case "6":
                    date += "20";
                    break;
            }
            date += id.substring(1, 3);
            date += '-';
            date += id.substring(3, 5);
            date += "-";
            date += id.substring(5, 7);

            return date;
        }
        /** New worker package */
        this.newWorkerPackage = {
            /** Form fields */
            formPerson: "formPerson",
            formFields: {
                personId: "personId",
                name: "name",                            
                surname: "surname",
                phone: "phone",
                email: "email",
                birthDate: "birthDate",
                healthInsurance: "healthInsurance",
                livingIn: "livingIn",
                degree: "degree",
                
            },

            formWorker: "formWorker",
            formworkerFields: {
                licenceValiFrom: "lvfrom",
                licenceValidTo: "lvto",
                drivingCategories: "dctgr",
            },

            function_formFields: (FieldGroup, FieldLabel, FieldControl) => {
                if (FieldGroup == undefined){
                    return false;
                }
                if (FieldLabel == undefined){
                    return false;
                }
                if (FieldControl == undefined){
                    return false;
                }

                let fields = [];
                let values = Object.values(this.newWorkerPackage.formFields);
                for(let i = 0; i < values.length; i++){
                    let label = values[i].label;

                    if (values[i].render == undefined){
                        let child = values[i].child;                
                        let props = Object.assign({}, values[i]);
                        delete props.label;
                        delete props.labelClass;
                        delete props.containerClass;

                        fields.push(
                            <FieldGroup className={values[i].containerClass} key={i}>
                                <FieldLabel className={values[i].labelClass}>{label}</FieldLabel>
                                <FieldControl {...props}/>
                            </FieldGroup>
                        );
                    }
                    else {
                        fields.push(
                            <FieldGroup className={values[i].containerClass} key={i}>
                                <FieldLabel className={values[i].labelClass}>{label}</FieldLabel>
                                {values[i].render()}
                            </FieldGroup>
                        );
                    }
                }

                return fields;
            },
            function_collectData: () => {
                let data = {};
                let keys = Object.keys(this.newWorkerPackage.formFields);
                for(let i = 0; i < keys.length; i++){
                    let element =  document.getElementById(this.newWorkerPackage.formFields[keys[i]]); 
                    switch(element.type){
                        case "checkbox":
                            data[keys[i]] = element.checked;
                            break;
                        case "select-multiple":
                            data[keys[i]] = [];
                            for(let j = 0; j < element.options.length; j++){
                                if (element.options[j].selected){
                                    data[keys[i]].push(element.options[j].value);
                                }
                            }
                            break;
                        default:
                            data[keys[i]] = element.value;
                    }
                }
                keys = Object.keys(this.newWorkerPackage.formworkerFields);
                for(let i = 0; i < keys.length; i++){
                    let element =  document.getElementById(this.newWorkerPackage.formworkerFields[keys[i]]); 
                    switch(element.type){
                        case "checkbox":
                            data[keys[i]] = element.checked;
                            break;
                        case "select-multiple":
                            data[keys[i]] = [];
                            for(let j = 0; j < element.options.length; j++){
                                if (element.options[j].selected){
                                    data[keys[i]].push(element.options[j].value);
                                }
                            }
                            break;
                        default:
                            data[keys[i]] = element.value;
                    }
                }

                return data;
            },

            handler_onShow: (e) => {
                this.setState({
                    modal_newWorker: Object.assign(
                        {},
                        this.state.modal_newWorker,
                        {
                            show: true
                        }
                    )
                });
                this.newWorkerPackage.fetch_posibleRights();
            },
            handler_onHide: (e) => {
                this.setState({
                    modal_newWorker: Object.assign(
                        {},
                        this.state.modal_newWorker,
                        {
                            show: false,
                            rights: undefined
                        }
                    )
                });
            },
            handler_onSubmit_person: (e) => {
                e.preventDefault();

                this.newWorkerPackage.handler_nextPage();
            },
            handler_nextPage: (e) => {
                this.setState({
                    modal_newWorker: Object.assign(
                        {},
                        this.state.modal_newWorker,
                        {
                            modalPage: 2
                        }
                    )
                });
            },
            handler_previousPage: (e) => {
                this.setState({
                    modal_newWorker: Object.assign(
                        {},
                        this.state.modal_newWorker,
                        {
                            modalPage: 1
                        }
                    )
                });
            },
            handler_onSubmit_worker: (e) => {
                e.preventDefault();
                let data = this.newWorkerPackage.function_collectData();
                console.log(data);

                fetch(config.server + '/sistemosprieinamumas/registruoti/vairuotojas', {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    switch(response.status){
                        case 200:
                            NotificationManager.success("Darbuotojas sėkmigai pridėtas.", "Operacija sėkmingai atlikta");
                            this.newWorkerPackage.handler_onHide();
                            this.fetchData();
                            break;
                        case 400:
                            response.json().then(response => {
                                NotificationManager.error("Darbuotojo pridėti nepavyko. " + response.message, "Operacijos klaida");
                            });
                            break;
                    }
                })

            },

            fetch_posibleRights: (e) => {
                fetch(config.server + '/sistemosprieinamumas/registruoti/kategorijos', {
                    method: "GET"
                }).
                then(response => {
                    switch(response.status){
                        case 200:
                            response.json().then(response => {
                                this.setState({
                                    modal_newWorker: Object.assign(
                                        {},
                                        this.state.modal_newWorker,
                                        {
                                            drivingCategories: response.categories
                                        }
                                    )
                                });
                            });
                            break;
                        case 204:
                        case 400:
                            this.setState({
                                modal_newWorker: Object.assign(
                                    {},
                                    this.state.modal_newWorker,
                                    {
                                        drivingCategories: false
                                    }
                                )
                            });
                    }
                });
            },
            
        }
    }

    componentDidMount(){
        this.fetchData();
    }
    fetchData(){
        fetch(config.server + '/sistemosprieinamumas/vairuotojai', {
            method: "GET",
        })
        .then(response => {
            switch(response.status){
                case 200: {   
                    response.json().then(response => {
                        this.setState({data: {
                            empty: false,
                            fetched: true,
                            data: response.data
                        }});
                    });
                    break;
                }
                case 204: {                    
                    this.setState({data: {
                        empty: true,
                        fetched: true,
                        data: []
                    }});
                    break;
                }
                default: {
                    response.json()
                    .then(response => {
                        console.log(response.error);
                    });
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
    }



    showInfo(e){
        let element = this.state.data.data.find((value) => {
            if (value.Tabelio_nr == e.target.textContent){
                return value;
            }
        });

        this.setState({
            modal: {
                show: true,
                data: element
            }
        });
    }
    closeModal(){
        this.setState({
            modal: {
                show: false,
                data: null
            }
        });
    }



    addOrder(e){
        let element = this.state.data.data.find((value) => {
            if (value.Tabelio_nr == e.target.id){
                return value;
            }
        });
        this.setState({
            tasks: Object.assign({}, this.state.tasks, {show: true, for: element})
        });
        
        return this.fetchOrders();
    }
    fetchOrders(){
        return fetch(config.server + '/uzsakymuvykdymas/priskirti_vairuotoja/nepriskirtos_busenos', {
            method: "GET"
        })
        .then(response => {
            switch(response.status){
                case 200: {
                    response.json().then(response => {
                        this.setState({tasks: Object.assign({}, this.state.tasks, {fetched: true, data: response.data})});
                    });
                    break;
                }
                case 204: {
                    this.setState({tasks: Object.assign({}, this.state.tasks, {fetched: true})});
                    break;
                }
                default: {
                    response.json().then(response => {
                        console.log(response);
                    });
                    break;
                }
            }
        });
    }
    closeOrders(){
        this.setState({
            tasks: {
                show: false,
                fetched: false,
                data: null,
                for: null,
                select: null
            }
        });
    }
    handleOrdersSubmit(e){
        e.preventDefault();

        fetch(config.server + '/uzsakymuvykdymas/priskirti_vairuotoja', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uzsakymai: this.getSelectOptions(document.getElementById('tasks')),
                vairuotojas: this.state.tasks.for.Tabelio_nr
            })
        })
        .then(response => {
            switch(response.status){
                case 200: {
                    this.fetchDriverOrders(this.state.tasks.for.Tabelio_nr);
                    this.closeOrders();
                    break;
                }
                default: {
                    response.json().then(response => {
                        console.log(response.error);
                        console.log(response.log);
                    });
                    break;
                }
            }
        });
    }
    getSelectOptions(e){
        let options = e.options;
        let selected = [];
        
        for(let i = 0; i < options.length; i++){
            if (options[i].selected){
                selected.push(options[i].value);
            }
        }

        return selected;
    }



    closeDriverOrders(){
        this.setState({
            driverTasks: {
                show: false,
                fetched: false,
                data: null,
                driver: null
            }
        });
    }
    openDriverOrders(e){
        let element = this.state.data.data.find((value) => {
            if (value.Tabelio_nr == e.target.id){
                return value;
            }
        });
        this.setState({
            driverTasks: Object.assign({}, this.state.driverTasks, {show: true, driver: element})
        });
        return this.fetchDriverOrders(element.Tabelio_nr);
    }
    fetchDriverOrders(id){
        if (id == undefined){
            return null;
        }

        return fetch(config.server + '/uzsakymuvykdymas/vairuotojo_uzduotys/' + id, {
            method: "GET"
        })
        .then(response => {
            switch(response.status){
                case 200: {
                    response.json().then(response =>{
                        this.setState({
                            driverTasks: Object.assign({}, this.state.driverTasks, {
                                fetched: true,
                                data: response.data
                            })
                        });
                    });
                    break;
                }
                case 204: {
                    this.setState({
                        driverTasks: Object.assign({}, this.state.driverTasks, {fetched: true})
                    });
                    break;
                }
                default:{
                    response.json().then(response => {
                        console.log(response.error);
                        console.log(response.log);
                    });
                    break;
                }
            }
        });
    }



    assingTP(e){
        let element = this.state.data.data.find((value) => {
            if (value.Tabelio_nr == e.target.id){
                return value;
            }
        });
        this.setState({
            ftp: Object.assign({}, this.state.ftp, {
                show: true,
                driver: element
            })
        });
        return this.fetchFreeTP(e.target.id);
    }
    fetchFreeTP(id){
        return fetch(config.server + '/Transporto_priemones/neuzimtostp/' + id, {
            method: "GET",
        })
        .then(response => {
            switch(response.status){
                case 200: {
                    response.json().then(response =>{
                        this.setState({
                            ftp: Object.assign({}, this.state.ftp, {
                                fetched: true,
                                data: response.data
                            })
                        });
                    });
                    break;
                }
                case 204: {
                    this.setState({
                        ftp: Object.assign({}, this.state.ftp, {fetched: true})
                    });
                    break;
                }
                default:{
                    response.json().then(response => {
                        console.log(response.error);
                        console.log(response.log);
                    });
                    break;
                }
            }
        });
    }
    closeTP(){
        this.setState({
            ftp: {
                show: false,
                fetched: false,
                data: null,
                driver: null
            }
        })
    }
    handleTPSubmit(e){
        e.preventDefault();
        let select = this.getSelectOptions(document.getElementById('ftp'));
        if (select.length > 0){
            fetch(config.server + '/uzsakymuvykdymas/priskirti_transporta', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    transportoPriemone: select[0],
                    nr: this.state.ftp.driver.Tabelio_nr
                })
            })
            .then(response => {
                switch(response.status){
                    case 200: {
                            this.fetchFreeTP(this.state.ftp.driver.Tabelio_nr);
                            this.closeTP();
                        break;
                    }
                    default: {
                        response.json().then(response => {
                            console.log(response.error);
                            console.log(response.log);
                        });
                        break;
                    }
                }
            })
        }
    }


    render(){
        if (this.state.data.empty){
            return (
                <div class="pre-loader"></div>
            );
        }
        /** Drivers table */
        let rows = null;
        if(this.state.data.empty){
            if(this.state.data.fetched){
                rows =
                    <tr>
                        <td colSpan="4" className="statusMessage">Vairuotojų nėra</td>
                    </tr>;
            } 
            else {
                rows = 
                    <tr>
                        <td colSpan="4" className="statusMessage">Prašome palaukti</td>
                   </tr>;
            }
        } 
        else {
            rows = this.state.data.data.map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <a onClick={this.showInfo}>{value.Tabelio_nr}</a>
                        </td>
                        <td>{value.Vardas}</td>
                        <td>{value.Pavarde}</td>
                        <td>
                            <a onClick={this.openDriverOrders} id={value.Tabelio_nr}>Užduotys</a>
                        </td>
                    </tr>
                );
            });
        }
        
        /** Driver info modal */
        let modal = null;
        if (this.state.modal.show){
            modal = <Modal show={this.state.modal.show} onHide={this.closeModal}>
                <ModalHeader closeButton>
                    <ModalTitle>{this.state.modal.data.Vardas} {this.state.modal.data.Pavarde} ({this.state.modal.data.AsmensKodas})</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className="labelValue">
                        <label>Tabelio numeris:</label>
                        <p>{this.state.modal.data.Tabelio_nr}</p>
                    </div>
                    <div className="labelValue">
                        <label>Vairavimo stažas:</label>
                        <p>{this.state.modal.data.Vairavimo_stazas || '-'}</p>
                    </div>
                    <div className="labelValue">
                        <label>Prasižengimų skaičius:</label>
                        <p>{this.state.modal.data.Prasizengimu_sk || '-'}</p>
                    </div>
                    <div className="labelValue">
                        <label>Kvalifikacija:</label>
                        <p>{this.state.modal.data.Profesine_kvalifikacija || '-'}</p>
                    </div>
                    <div className="labelValue">
                        <label>Turi technografo kortelę:</label>
                        <p>{this.state.modal.data.Technografo_kortele == '1' ? 'Taip' : 'Ne' }</p>
                    </div>
                    <div className="labelValue">
                        <label>Telefono numeris:</label>
                        <p>{this.state.modal.data.Telefono_nr}</p>
                    </div>
                    <div className="labelValue">
                        <label>Elektroninis paštas:</label>
                        <p>{this.state.modal.data.Epastas}</p>
                    </div>
                    <div className="labelValue">
                        <label>Gyvenamoji vieta:</label>
                        <p>{this.state.modal.data.Gyvenamoji_vieta || "-"}</p>
                    </div>
                    <div className="labelValue">
                        <label>Gimimo data:</label>
                        <p>{this.state.modal.data.Gimimo_data}</p>
                    </div>
                    <div className="labelValue">
                        <label>Išsilavinimas:</label>
                        <p>{this.state.modal.data.Issilavinimas || '-'}</p>
                    </div>
                    <div className="labelValue">
                        <label>Turi sveikatos draudimą:</label>
                        <p>{this.state.modal.data.Sveikatos_draudimas == '1' ? 'Taip' : 'Ne' }</p>
                    </div>
                </ModalBody>
            </Modal>
        }

        /** Assing task modal */
        let tasks = null;
        if (this.state.tasks.show){
            let control = null;
            if (this.state.tasks.fetched){
                if (this.state.tasks.data == null){
                    control = <p className="statusMessage">Įrašų nerasta</p>;
                }
                else {
                    control = <FormControl componentClass="select" multiple>
                        {
                            this.state.tasks.data.map((value, key) => {
                                return ( 
                                    <option key={key} value={value.Numeris}>
                                        #{value.Numeris} Iš: {value.is_Inventorinis_numeris} {value.is_padalinio_pavadinimas} ({value.is_Miestas}) Į: {value.i_Inventorinis_numeris} {value.i_padalinio_pavadinimas} ({value.i_Miestas})
                                    </option>
                            )})
                        }
                    </FormControl>
                }
            }
            else {
                control = <p className="statusMessage">Prašome palaukti</p> 
            }

            tasks = 
            <Modal show={this.state.tasks.show} onHide={this.closeOrders}>
                <form onSubmit={this.handleOrdersSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle>Priskirti užduotis {this.state.tasks.for.Vardas} {this.state.tasks.for.Pavarde}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup controlId="tasks">
                            <ControlLabel>Pasirinkite užduotis:</ControlLabel>
                            {control}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
        }

        let ftp = null;
        if(this.state.ftp.show){
            let control = null;
            if (this.state.ftp.fetched){
                if (this.state.ftp.data == null){
                    control = <p className="statusMessage">Laisvų transporto priemonių nėra</p>;
                }
                else {
                    control = <FormControl componentClass="select">
                        {
                            this.state.ftp.data.map((value, key) => {
                                return ( 
                                    <option key={key} value={value.Valstybinis_nr}>
                                        {value.Valstybinis_nr} - {value.Marke} {value.Modelis}
                                    </option>
                            )})
                        }
                    </FormControl>
                }
            }
            else {
                control = <p className="statusMessage">Prašome palaukti</p> 
            }

            ftp = 
            <Modal show={this.state.ftp.show} onHide={this.closeTP}>
                <form onSubmit={this.handleTPSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle>Priskirti transporto priemonę {this.state.ftp.driver.Vardas} {this.state.ftp.driver.Pavarde}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup controlId="ftp">
                            <ControlLabel>Pasirinkite transporto priemonę:</ControlLabel>
                            {control}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
        }

        /** Driver tasks */
        let driverTasks = null;
        if (this.state.driverTasks.show){
            let control = null;
            if (this.state.driverTasks.fetched){
                if (this.state.driverTasks.data == null){
                    control = <p className="statusMessage">Vairuotojas užsakymų neturi.</p>
                }
                else {
                    control = <FormGroup>
                        <ControlLabel>Vairuotojo užsakymai:</ControlLabel>
                        {
                            this.state.driverTasks.data.map((value, key) => {
                                return (
                                    <FormGroup key={key}>
                                        <hr/>
                                        <FormControl.Static>
                                            #{value.Numeris} Iš: {value.is_Inventorinis_numeris} {value.is_padalinio_pavadinimas} ({value.is_Miestas}) Į: {value.i_Inventorinis_numeris} {value.i_padalinio_pavadinimas} ({value.i_Miestas})  
                                            <span className="box" style={{ backgroundColor: value.TransportoPriemone == "1" ? "red" : "green" }}></span>
                                        </FormControl.Static>
                                    </FormGroup>
                                )
                            })
                        }
                    </FormGroup>
                }
            }
            else {
                control = <p className="statusMessage">Prašome palaukti</p> 
            }

            driverTasks = 
            <Modal show={this.state.driverTasks.show} onHide={this.closeDriverOrders}>
                <ModalHeader closeButton>
                    {this.state.driverTasks.driver.Vardas} {this.state.driverTasks.driver.Pavarde}
                </ModalHeader>
                <ModalBody>
                    {control}
                </ModalBody>
                <ModalFooter>
                    <FormControl.Static>
                        <a onClick={this.addOrder} className="pointer" id={this.state.driverTasks.driver.Tabelio_nr}>Priskirti užduotis</a>
                    </FormControl.Static>
                    <FormControl.Static>
                        <a onClick={this.assingTP} className="pointer" id={this.state.driverTasks.driver.Tabelio_nr}>Priskirti transportą</a>
                    </FormControl.Static>
                </ModalFooter>
            </Modal>
        }

        let Form = null;
        if (this.state.update.show){
            Form =
            <Modal show={this.state.update.show} onHide={this.state.update.onHide}>
                <form onSubmit={this.state.update.onSubmit}>
                    <ModalHeader closeButton>
                        <ModalTitle>Redaguoti vartotojo duomenis</ModalTitle>
                    </ModalHeader>

                    <ModalBody>
                    <FormGroup>
                        <ControlLabel>Tabelio numeris</ControlLabel>
                        <FormControl placeholder="0132456" required value={this.state.update.data.Tabelio_nr} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Tabelio_nr: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Vairavimo stažas</ControlLabel>
                        <FormControl placeholder="5.5" value={this.state.update.data.Vairavimo_stazas} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Vairavimo_stazas: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Prasižengimų skaičius</ControlLabel>
                        <FormControl placeholder="4" value={this.state.update.data.Prasizengimu_sk} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Prasizengimu_sk: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Profesinė kvalifikacija</ControlLabel>
                        <FormControl placeholder="Pradinė" value={this.state.update.data.Profesine_kvalifikacija} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Profesine_kvalifikacija: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Technografo_kortele</ControlLabel>
                        <FormControl type="checkbox" checked={this.state.update.data.Technografo_kortele} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Technografo_kortele: e.target.checked})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Asmens Kodas</ControlLabel>
                        <FormControl placeholder="34902141578" required value={this.state.update.data.AsmensKodas} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {AsmensKodas: e.target.value})})})}}/>
                    </FormGroup>
                <FormGroup>
                    <ControlLabel>Vardas</ControlLabel>
                    <FormControl placeholder="Jonas" required value={this.state.update.data.Vardas} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Vardas: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Pavardė</ControlLabel>
                        <FormControl placeholder="Jonaitis" required value={this.state.update.data.Pavarde} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Pavarde: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Telefono numeris</ControlLabel>
                        <FormControl placeholder="864511236" required value={this.state.update.data.Telefono_nr} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Telefono_nr: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Elektroninis paštas</ControlLabel>
                        <FormControl type="email" required placeholder="jonas@jonaitis.lt" value={this.state.update.data.Epastas} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Epastas: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Gyvenamoji vieta</ControlLabel>
                        <FormControl required value={this.state.update.data.Gyvenamoji_vieta} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Gyvenamoji_vieta: e.target.value})})})}}/>
                    </FormGroup>
                <FormGroup>
                    <ControlLabel>Gimimo data</ControlLabel>
                    <FormControl required type="date" value={this.state.update.data. Gimimo_data} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, { Gimimo_data: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Išsilavinimas</ControlLabel>
                        <FormControl placeholder="Informatika" pvalue={this.state.update.data.Issilavinimas} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Issilavinimas: e.target.value})})})}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Sveikatos draudimas</ControlLabel>
                        <FormControl type="checkbox" checked={this.state.update.data.Sveikatos_draudimas} onChange={(e) => {this.setState({update: Object.assign({}, this.state.update, {data: Object.assign({}, this.state.update.data, {Sveikatos_draudimas: e.target.checked})})})}}/>
                    </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Patvirtinti</Button>
                    </ModalFooter>
                </form>
            </Modal>
        }

        let form_createWorker = (
            <Modal show={this.state.modal_newWorker.show} onHide={this.newWorkerPackage.handler_onHide}>
                <form onSubmit={this.newWorkerPackage.handler_onSubmit_person} id={this.newWorkerPackage.formPerson} style={{display: this.state.modal_newWorker.modalPage == 1 ? "block" : "none"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Naujo vairuotojo sukūrimas
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup controlId="personId">
                            <ControlLabel>Asmens kodas:</ControlLabel>
                            <FormControl
                                type="text"
                                required
                                maxLength="11"
                                minLength="11"
                                pattern="[3-6]([0-9]{2})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|(0[469]|11)(0[1-9]|[12][0-9]|30)|(02(0[0-9]|[12][0-9])))([0-9]{4})"

                                onChange={(e) => {
                                    /** Auto date generator */
                                    let date = this.getDateFromPersonID(e.target.value);
                                    console.log(date);
                                    if (date != null){
                                        let dob = document.getElementById(this.newWorkerPackage.formFields.birthDate);
                                        dob.value = moment(date, "YYYY-MM-DD").format("MM / DD / YYYY");
                                    }
                                }}
                                onInvalid={(e) => {
                                    if (e.target.validity.patternMismatch) {
                                        return e.target.setCustomValidity("Prašome įvesti asmens kodą tinkamu formatu.");
                                    }
                                    else if (e.target.validity.tooShort) {
                                        return e.target.setCustomValidity("Asmens kodas turi susidaryti iš 11 simbolių (įvesta " + e.target.value.length + " simboliai).");
                                    }
                                    else if (e.target.validity.valueMissing) {
                                        return e.target.setCustomValidity("Prašome įveti reišmę");
                                    }
                                    
                                    return e.preventDefault();
                                }}
                            />
                        </FormGroup>

                        <FormGroup controlId="name">
                            <ControlLabel>Vardas:</ControlLabel>
                            <FormControl
                                type="text"
                                maxLength="45"
                                required

                                onInvalid={(e) => {
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome įvesti vardą");
                                    }

                                    return e.preventDefault();
                                }}
                            />
                        </FormGroup>
                        
                        <FormGroup controlId="surname">
                            <ControlLabel>Pavardė:</ControlLabel>
                            <FormControl
                                type="text"
                                maxLength="50"
                                required

                                onInvalid={(e) => {
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome įvesti pavardę");
                                    }

                                    return e.preventDefault();
                                }}
                            />
                        </FormGroup>

                        <FormGroup controlId="phone">
                            <ControlLabel>Telefono numeris:</ControlLabel>
                            <FormControl
                                type="text"
                                maxLength="12"
                                required
                                pattern="(\+370|8)([0-9]){8}"
    
                                onInvalid={(e) => {
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome įveti telefono numerį.");
                                    }
                                    else if (e.target.validity.patternMismatch){
                                        return e.target.setCustomValidity("Prašome įveti telefono numerį tinkamu formatu.");
                                    }
                                    return e.preventDefault();
                                }}
                            />
                        </FormGroup>
                        
                        <FormGroup controlId="email">
                            <ControlLabel>Elektroninis paštas:</ControlLabel>
                            <FormControl
                                type="email"
                                required
                                maxLength="50"
                                pattern="([a-zA-Z0-9_\.]+)@([[a-zA-Z0-9]+)\.([[a-zA-Z0-9]+)"
    
                                onInvalid={(e) => {
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome įveti elektroninio pašto adresą");
                                    }
                                    else if (e.target.validity.patternMismatch){
                                        return e.target.setCustomValidity("Prašome įvesti elektroninio  pašto adresą tinkamu formatu");
                                    }
                                    
                                    return e.preventDefault();
                                }}
                            />
                        </FormGroup>

                        <FormGroup controlId="birthDate">
                            <ControlLabel>Gimimo data:</ControlLabel>
                            <FormControl
                                type="text"
                                disabled={true}
                                required
                            />
                        </FormGroup>

                        <FormGroup controlId="healthInsurance" className="diflex">
                            <ControlLabel className="margin-auto margin-right-min">Sveikatos draudimas:</ControlLabel>
                            <div className="switch">
                                        <FormControl 
                                            type="checkbox"
                                        />
                                        <span className="slider round" onClick={(e) => {
                                            let cb = document.getElementById(this.newWorkerPackage.formFields.healthInsurance);
                                            cb.checked = !cb.checked;   
                                        }}/>
                                    </div>
                        </FormGroup>

                        <FormGroup controlId="livingIn">
                            <ControlLabel>Gyvenamoji vieta:</ControlLabel>
                            <FormControl
                                type="text"
                                maxLength="100"
                            />
                        </FormGroup>

                        <FormGroup controlId="degree">
                            <ControlLabel>Išsilavinimas:</ControlLabel>
                            <FormControl
                                type="text"
                                maxLength="200"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="reset" onClick={this.newWorkerPackage.handler_onHide}>Atšauti</Button>
                        <Button type="submit">Kitas</Button>
                    </Modal.Footer>
                </form>
                <form onSubmit={this.newWorkerPackage.handler_onSubmit_worker} id={this.newWorkerPackage.formWorker} style={{display: this.state.modal_newWorker.modalPage == 1 ? "none" : "block"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Naujo vairuotojo sukūrimas
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup controlId={this.newWorkerPackage.formworkerFields.licenceValiFrom}>
                            <ControlLabel>Vairuotojo teisės galija nuo:</ControlLabel>
                            <FormControl 
                                type="date"
                            />
                        </FormGroup>
                        <FormGroup controlId={this.newWorkerPackage.formworkerFields.licenceValidTo}>
                            <ControlLabel>Vairuotojo teisės galioja iki:</ControlLabel>
                            <FormControl 
                                type="date"
                            />
                        </FormGroup>
                        <FormGroup controlId={this.newWorkerPackage.formworkerFields.drivingCategories}>
                            <ControlLabel>Vairuotojo galimos vairuoti kategorijos</ControlLabel>
                            <FormControl 
                                componentClass="select"
                                multiple={true}
                            >
                                {
                                    this.state.modal_newWorker.drivingCategories.map((value, key) => {
                                        return <option key={key} value={value.Kategorijos_id}>{value.kategorija}</option>
                                    })
                                }
                            </FormControl>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.newWorkerPackage.handler_previousPage}>Atgal</Button>
                        <Button type="reset" onClick={this.newWorkerPackage.handler_onHide}>Atšauti</Button>
                        <Button type="submit">Patvirtinti</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );

        console.log(this.state.modal_newWorker);
        return(
            <div id="wraper">
                <h2 className="Title">Vairuotojų duomenys</h2>
                <table id="table">
                    <tbody>
                        <tr>
                            <th>Tabelio numeris</th>
                            <th>Vardas</th>
                            <th>Pavarde</th>
                            <th id="Insert">
                                <a onClick={this.newWorkerPackage.handler_onShow}>+</a>
                            </th>
                        </tr>
                        {rows}
                    </tbody>
                </table>

                {modal}
                {tasks}
                {driverTasks}
                {ftp}
                {Form}
                {this.state.modal_newWorker.show ? form_createWorker : null}
            </div>
        );
    }
}

export default connect(
    state => {
         return {
            username: state.login.name,
            accessKey: state.login.accessKey,
            rangas: state.user.rangas.id
         };
    },
    null
)(Drivers);