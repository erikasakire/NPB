/** Module imports */
import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Modal, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import { NotificationManager} from 'react-notifications';
import moment from "moment";

/** JSON imports */
import config from '../config.json';

class Workers extends React.Component{
    constructor (props){
        super(props);

        this.state = {
            data: {
                empty: true,
                fetched: false,
                data: null,
            },

            modal: {
                show: false,
                currentData: {},



                onHide: () => {
                    this.setState({
                        modal: Object.assign(
                            {}, 
                            this.state.modal, 
                            {
                                show: false
                            }
                        )
                    });
                },
                onShow: (e) => {
                    let element = this.findInArray(this.state.data.data, "Tabelio_nr", e.target.id);

                    if (!element){
                        NotificationManager.warning("Nepavyko rasti vartotojo duomenų.", "Klaida gaunant duomenis");
                        return;
                    }

                    this.setState({
                        modal: Object.assign(
                            {},
                            this.state.modal,
                            {
                                show: true,
                                currentData: Object.assign(
                                    {},
                                    element,
                                    {
                                        Sveikatos_draudimas: element.Sveikatos_draudimas == "1" ? "Taip" : "Ne",
                                        Stazas: Math.round(moment().diff(moment(element.Dirba_nuo, "YYYY-MM-DD"), "years", true) * 10) / 10
                                    }
                                )
                            }
                        )
                    });
                },
                onUpdateRights: (newRights) => {
                    this.setState({
                        modal: Object.assign(
                            {},
                            this.state.modal,
                            {
                                currentData: Object.assign(
                                    {},
                                    this.state.modal.currentData,
                                    {
                                        rangai: newRights
                                    }
                                )
                            }
                        )
                    });
                },
            },

            modal_updateRights: {
                show: false,
                fetched: false,
                currentWorker: undefined,
                currentRights: undefined,
                posibleRights: undefined,

                formIds: {
                    select_rights: "select_rights"
                },

                onShow: (e) => {
                    this.setState({
                        modal_updateRights: Object.assign(
                            {},
                            this.state.modal_updateRights,
                            {
                                show: true,
                                currentWorker: this.state.modal.currentData.Tabelio_nr,
                                currentRights: this.state.modal.currentData.id
                            }
                        )
                    });
                    return this.state.modal_updateRights.get_posibleRights(this.props.rangas);
                },
                onHide: () => {
                    this.setState({
                        modal_updateRights: Object.assign(
                            {},
                            this.state.modal_updateRights,         
                            {
                                show: false,
                                fetched: false,
                                currentWorker: undefined,
                                currentRights: undefined,
                                posibleRights: undefined
                            }
                        )
                    });
                },
                onSubmit: (e) => {
                    e.preventDefault();
                    let selectElement = document.getElementById(this.state.modal_updateRights.formIds.select_rights);
                    let selectedText = selectElement.selectedOptions[0].text;
                    let currentRights = this.state.modal_updateRights.currentWorker;
                    let newRights = selectElement.value;

                    if (currentRights == newRights){
                        NotificationManager.info("Duomenys nepakeisti.", "Operacija atšaukta");
                        return;
                    }

                    fetch(config.server + '/sistemosprieinamumas/atnaujinti/ranga', {
                        method: "POST",
                        headers: {
                            "Accept": "aplication/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user: this.state.modal_updateRights.currentWorker,
                            rights: newRights
                        })
                    })
                    .then(response => {
                        switch(response.status){
                            case 200: /** OK */
                                NotificationManager.success("Vartotojo (" + this.state.modal.currentData.Vardas + " " + this.state.modal.currentData.Pavarde + ") teisės sėkmingai pakeistos į " + selectedText, "Operacija sėkmingai atlikta");
                                break;
                            case 400: /** Bad request */
                                NotificationManager.error("Vartotojo teisės nebuvo pakeistos.", "Operacijos klaida");
                                break;
                        }

                        this.state.modal_updateRights.onHide();
                        this.fetchData();
                        this.state.modal.onUpdateRights(selectedText);
                    });
                },

                get_posibleRights: (rights) => {
                    fetch(config.server + '/sistemosprieinamumas/atnaujinti/ranga/' + this.props.rangas, {
                        method: "GET"
                    })
                    .then(response => {
                        switch(response.status){
                            case 200: /** OK */
                                return response.json().then(response => {
                                    this.setState({
                                        modal_updateRights: Object.assign(
                                            {},
                                            this.state.modal_updateRights,
                                            {
                                                fetched: true,
                                                posibleRights: response.rights
                                            }
                                        )
                                    });
                                });
                            case 204: /** No content */
                                return this.setState({
                                    modal_updateRights: Object.assign(
                                        {},
                                        this.state.modal_updateRights,
                                        {
                                            fetched: true
                                        }
                                    )
                                });
                            case 400: /** Bad request */
                                NotificationManager.error("Klaida siunčiant duomenis.");
                                this.state.modal_updateRights.onHide();
                                break;
                        }
                    });
                },
                get_posibleOptions: (values) => {
                    if (values == undefined){
                        return null;
                    }

                    let options = [];
                    for(let i = 0; i < values.length; i++){
                        options.push(
                            <option value={values[i].id} key={i}>{values[i].rangai}</option>
                        );
                    }

                    return options;
                }
            },

            modal_newWorker: {
                show: false,
                rights: undefined,
                modalPage: 1,
            }
        };


        this.findInArray = (array, field, value) => {
            if (value == undefined || value == null){
                return false;
            }
            if (field == undefined || field == null){
                return false;
            }
            if (array == undefined || array == null || !Array.isArray(array) || array.length == 0){
                return false;
            }

            for(let i = 0; i < array.length; i++){
                if (array[i][field] == value){
                    return array[i];
                }
            }
        }
        this.showForm = (form, state) => {
            return state.show ? form : null;
        },
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

        this.fetchData = this.fetchData.bind(this);

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
                dirbaNuo: "dirbaNuo",
                etatas: "etatas",
                rangas: "rangas",
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
                    data[keys[i]] = 
                        element.type == "checkbox" ?
                        element.checked :
                        element.value;
                }
                keys = Object.keys(this.newWorkerPackage.formworkerFields);
                for(let i = 0; i < keys.length; i++){
                    let element =  document.getElementById(this.newWorkerPackage.formworkerFields[keys[i]]); 
                    data[keys[i]] = 
                        element.type == "checkbox" ?
                        element.checked :
                        element.value;
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

                fetch(config.server + '/sistemosprieinamumas/registruoti/darbuotojas', {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Object.assign(
                        data,
                        {
                            workingFrom: moment().format("YYYY-MM-DD"), 
                        }
                    ))
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
                fetch(config.server + '/sistemosprieinamumas/registruoti/' + this.props.rangas, {
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
                                            rights: response.rights
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
                                        rights: false
                                    }
                                )
                            });
                    }
                });
            },
            
            parameter_visible: this.state.modal_newWorker.show,
        }
    }

    componentDidMount(){
        this.fetchData();
    }
    

    fetchData(){
        return new Promise((resolve, reject) => {
            fetch(config.server + '/sistemosprieinamumas/darbuotojai', {
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
                        resolve(true);
                        break;
                    }
                    case 204: {
                        this.setState({
                            data: Object.assign({}, this.state.data, {
                                fetched: true
                            })
                        });
                        resolve(true);
                        break;
                    }
                    default: {
                        console.log("Error");
                        reject("ERROR");
                    }
                }
            });
        });
    }
    render(){
        if (["1", "2"].indexOf(this.props.rangas) == -1){
            return <Redirect to='/'/>;
        }

        let rows = null;
        if(this.state.data.empty){
            if(this.state.data.fetched){
                rows =
                    <tr>
                        <td colSpan="5" className="statusMessage">Darbuotojų nėra</td>
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
                        <td>
                            <a id={value.Tabelio_nr} onClick={this.state.modal.onShow}>{value.Tabelio_nr}</a>
                        </td>
                        <td>{value.Vardas}</td>
                        <td>{value.Pavarde}</td>
                        <td>{value.rangai}</td>
                        <th/>
                    </tr>
                );
            });
        }

        let form = (
            <Modal show={this.state.modal.show} onHide={this.state.modal.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.state.modal.currentData.Vardas} {this.state.modal.currentData.Pavarde} ({this.state.modal.currentData.AsmensKodas}) informacija
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="labelValue">
                        <label>Tabelio numeris:</label>
                        <p>{this.state.modal.currentData.Tabelio_nr}</p>
                    </div>
                    <div className="labelValue">
                        <label>Dirba įmonėje nuo:</label>
                        <p>{this.state.modal.currentData.Dirba_nuo}</p>
                    </div>
                    <div className="labelValue">
                        <label>Etatas:</label>
                        <p>{this.state.modal.currentData.Etatas < 1 ? (this.state.modal.currentData.Etatas + "etato") : "pilnas etatas"}</p>
                    </div>
                    <div className="labelValue">
                        <label>Darbo stažas:</label>
                        <p>{this.state.modal.currentData.Stazas} metų</p>
                    </div>
                    <div className="labelValue">
                        <label>Telefono numeris:</label>
                        <p>{this.state.modal.currentData.Telefono_nr}</p>
                    </div>
                    <div className="labelValue">
                        <label>Elektroninis paštas:</label>
                        <p>{this.state.modal.currentData.Epastas}</p>
                    </div>
                    <div className="labelValue">
                        <label>Gyvenamoji vieta:</label>
                        <p>{this.state.modal.currentData.Gyvenamoji_vieta}</p>
                    </div>
                    <div className="labelValue">
                        <label>Gimimo data:</label>
                        <p>{this.state.modal.currentData.Gimimo_data}</p>
                    </div>
                    <div className="labelValue">
                        <label>Išsilavinimas:</label>
                        <p>{this.state.modal.currentData.Issilavinimas}</p>
                    </div>
                    <div className="labelValue">
                        <label>Turi sveikatos draudimas:</label>
                        <p>{this.state.modal.currentData.Sveikatos_draudimas}</p>
                    </div>
                    <div className="labelValue">
                        <label>Pareigos:</label>
                        <p>{this.state.modal.currentData.rangai}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <a onClick={this.state.modal_updateRights.onShow}>Redaguoti pareigas</a>
                </Modal.Footer>
            </Modal>
        );

        let form_updateRights = (
            <Modal show={this.state.modal_updateRights.show} onHide={this.state.modal_updateRights.onHide}>
                <form onSubmit={this.state.modal_updateRights.onSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Pasirinkite naujas darbuotojo pareigas
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup controlId={this.state.modal_updateRights.formIds.select_rights}>
                            <ControlLabel>Pasirinkite pareigas</ControlLabel>
                            <FormControl componentClass="select" defaultValue={this.state.modal_updateRights.currentRights}>
                                {this.state.modal_updateRights.get_posibleOptions(this.state.modal_updateRights.posibleRights)}
                            </FormControl>
                        </FormGroup> 
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Patvirtinti</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );

        let form_createWorker = (
            <Modal show={this.state.modal_newWorker.show} onHide={this.newWorkerPackage.handler_onHide}>
                <form onSubmit={this.newWorkerPackage.handler_onSubmit_person} id={this.newWorkerPackage.formPerson} style={{display: this.state.modal_newWorker.modalPage == 1 ? "block" : "none"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Naujo darbuotojo sukūrimas
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
                            Naujo darbuotojo sukūrimas
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup controlId={this.newWorkerPackage.formworkerFields.dirbaNuo}>
                            <ControlLabel>Dirba įmonėje nuo:</ControlLabel>
                            <FormControl
                                type="date"
                                required
                                max={moment().format("YYYY-MM-DD")}
                            />
                        </FormGroup>
                        <FormGroup controlId={this.newWorkerPackage.formworkerFields.etatas}>
                            <ControlLabel>Darbo etatas:</ControlLabel>
                            <FormControl
                                type="number"
                                min="0.25"
                                max="1"
                                step="0.25"
                                required
                            />
                        </FormGroup>
                        <FormGroup controlId={this.newWorkerPackage.formworkerFields.rangas}>
                            <ControlLabel>Darbuotojo rangas:</ControlLabel>
                            <FormControl
                                componentClass="select"
                            >
                                {this.state.modal_updateRights.get_posibleOptions(this.state.modal_newWorker.rights)}
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


        return(
            <div>
                <h2 className="Title">Darbuotojų duomenys</h2>
                <table id="table">
                    <tbody>
                        <tr>
                            <th>Tabelio numeris</th>
                            <th>Vardas</th>
                            <th>Pavarde</th>
                            <th>Pareigos</th>
                            <th id="Insert">
                                <a onClick={this.newWorkerPackage.handler_onShow}>+</a>
                            </th>
                        </tr>
                        {rows}
                    </tbody>
                </table>

                {this.showForm(form, this.state.modal)}
                {this.showForm(form_updateRights, this.state.modal_updateRights)}
                {this.showForm(form_createWorker, this.state.modal_newWorker)}
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            rangas: state.user.rangas.id
        }
    },
    null
)(Workers);