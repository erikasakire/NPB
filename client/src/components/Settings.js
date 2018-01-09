import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Panel, FormGroup, FormControl, ControlLabel, Button, PanelGroup, Accordion} from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import config from '../config.json';
import { login_user as accessControlLogin} from "../store/actions/loginActions";

class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            dateValid: true,
            openedPanel: {
                userData: true,
                userPassword: false,
                userQuestion: false
            },
            userData: {},
            loginData: {},

            userFormData: {},
            passwordFormData: {},
        };

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
        this.fetch = this.fetch.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);

        this.userData = {
            personId: "personId",
            name: "name",
            surname: "surname",
            phone: "phone",
            email: "email",
            birthDate: "birthDate",
            healthInsurance: "healthInsurance",

            livingIn: "livingIn",
            degree: "degree",
        };
        this.passwordData = {
            oldPassword: "oldPassword",
            newPassword: "newPassword",
            newPassword2: "newPassword2",
        };
        this.questionData = {
            answer: "answer",
            newQuestion: "newQuestion",            
        }
    }

    componentDidMount(){
        this.fetch();
    }

    fetch(){
        fetch(config.server + '/sistemosprieinamumas/vartotojas/' + this.props.username, {
            method: "GET"
        })
        .then(response => {
            switch(response.status){
                case 200: {
                    return response.json()
                    .then(response => {
                        this.setState({
                            userData: Object.assign({}, response[0][0][0], {Sveikatos_draudimas: response[0][0][0].Sveikatos_draudimas == "1"}),
                            userFormData: Object.assign({}, response[0][0][0], {Sveikatos_draudimas: response[0][0][0].Sveikatos_draudimas == "1"}),
                            loginData: Object.assign({}, response[0][1][0]),
                        });
                    });
                }
            }
        });
    }

    onSubmitLogin(e){
        e.preventDefault();

        //#region getting values.
            let data = {};
            let values = Object.values(this.userData);
            for(let i = 0; i < values.length; i++){
                let element = document.getElementById(values[i]);
                
                switch (element.type){
                    case "date":
                    case "text":
                        data[values[i]] = element.value;
                        break;
                    case "checkbox":
                        data[values[i]] = element.checked;
                }
            }
        //#endregion
        
        //#region check for changes
            do{
                if (data[this.userData.personId]        != this.state.userData.AsmensKodas          ) { break; }
                if (data[this.userData.name]            != this.state.userData.Vardas               ) { break; }
                if (data[this.userData.surname]         != this.state.userData.Pavarde              ) { break; }
                if (data[this.userData.phone]           != this.state.userData.Telefono_nr          ) { break; }
                if (data[this.userData.email]           != this.state.userData.Epastas              ) { break; }
                if (data[this.userData.birthDate]       != this.state.userData.Gimimo_data          ) { break; }
                if (data[this.userData.healthInsurance] != this.state.userData.Sveikatos_draudimas  ) { break; }
                if (data[this.userData.livingIn]        != this.state.userData.Gyvenamoji_vieta     ) { break; }
                if (data[this.userData.degree]          != this.state.userData.Issilavinimas        ) { break; }

                NotificationManager.info("Duomenys buvo nepakeisti.", "Operacija atmesta");
                return;
            } while(false);
        //#endregion

        fetch(config.server + '/sistemosprieinamumas/vartotojas/' + this.props.username, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.assign({}, data, {method_no: 1}))
        })
        .then(response => {
            switch(response.status){
                case 200: 
                    NotificationManager.success("Vartotojo duomenys sėkmingai pakeisti.", "Operacija sėkmingai atlikta.");
                    this.fetch();
                    this.props.updateAction({
                        username: this.props.username, 
                        accessKey: this.props.accessKey,
                        Vardas: data.name,
                        Pavarde: data.surname,
                        Pareigos: this.props.userStoreData.rangas.id,
                        PareiguKodas: this.props.userStoreData.rangas.rangas
                    });
                    break;
                case 400:
                    response.json().then(response => {
                        console.log(response.message);
                        NotificationManager.error("Vartotojo duomenų pakeisti nepavyko.", "Klaida bandant pakeisti duomenis.");
                    });
                    break;
            }
        });
    }
    onSubmitPassword(e){
        e.preventDefault();

        let data = {};
        let values = Object.values(this.passwordData);
        for(let i = 0; i < values.length; i++){
            let element = document.getElementById(values[i]);
            data[values[i]] = (element == undefined ? undefined : element.value);
        }

        console.log(data);

        if (!document.getElementById(this.passwordData.newPassword2).checkValidity()){
            return;
        }

        fetch(config.server + '/sistemosprieinamumas/vartotojas/' + this.props.username, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.assign({}, data, {method_no: 2}))
        })
        .then(response => {
            switch(response.status){
                case 200:
                    return response.json().then(response => {
                        NotificationManager.success("Slaptažodis sėkmingai pakeistas.", "Operacija įvykdyta sėkmingai.");
                        this.props.updateAction(
                            Object.assign(
                                {}, 
                                {
                                    username: this.props.username, 
                                    accessKey: response.accessKey,
                                },
                                {
                                    Vardas: this.props.userStoreData.vardas,
                                    Pavarde: this.props.userStoreData.pavarde,
                                    Pareigos: this.props.userStoreData.rangas.id,
                                    PareiguKodas: this.props.userStoreData.rangas.rangas
                                }
                            )
                        );
                    });
                case 400:
                    return response.json().then(response => {
                        console.log(response.message);
                        this.setState({passwordFormData: {}});
                        NotificationManager.error("Slaptažodžio pakeisti nepavyko.\n" + response.message, "Klaida keičiant slaptažodį");
                    });
            }
        });
    }
    render() {
        return (
            <div style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <h2 className="Title">Vartotojo nustatymai</h2>
                <form onSubmit={this.onSubmitLogin} onReset={(e) => {this.setState({userFormData: Object.assign({}, this.state.userData)})}}>
                    <Panel collapsible expanded={this.state.openedPanel.userData} header={<p onClick={(e) => this.setState({openedPanel: {userData: true, userPassword: false, userQuestion: false}})}>Vartotojo duomenų nustatymai</p>} footer={[<Button type="reset" key="0" className="margin-right-min">Atšaukti</Button>, <Button type="submit" key="1">Patvirtinti</Button>]}>
                        {/** Person ID field */}
                        <FormGroup controlId={this.userData.personId}>
                            <ControlLabel>Asmens kodas:</ControlLabel>
                            <FormControl 
                                type="text" 
                                required 
                                pattern="[3-6]([0-9]{2})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|(0[469]|11)(0[1-9]|[12][0-9]|30)|(02(0[0-9]|[12][0-9])))([0-9]{4})" 
                                placeholder="49802120925"
                                value={this.state.userFormData.AsmensKodas || ""}
                                onInvalid={(e) => {
                                    /** Mismatches field pattern */
                                    if (e.target.validity.patternMismatch){
                                        return e.target.setCustomValidity("Prašome įvesti asmens kodą tinkamu formatu.")
                                    }
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                    }
                                    /** Everything is ok */
                                    e.preventDefault();
                                    return e.target.setCustomValidity('');
                                }}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value.length != 11){
                                        return this.setState({userFormData: Object.assign({}, this.state.userFormData, {AsmensKodas: value})});
                                    };
                                    let date = "";

                                    /** Getting century */
                                    switch(value.substring(0, 1)){
                                        case "3":
                                        case "4":
                                            date += "19";
                                            break;
                                        case "5":
                                        case "6":
                                            date += "20";
                                            break;
                                    }

                                    /** Getting years */
                                    date += value.substring(1, 3);
                                    date += "-";

                                    /** Getting month */
                                    date += value.substring(3, 5);
                                    date += "-";

                                    /** Getting day */
                                    date += value.substring(5, 7);
                                    
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Gimimo_data: date, AsmensKodas: value})});
                                }}
                            />
                        </FormGroup>

                        {/** Person name field */}
                        <FormGroup controlId={this.userData.name}>
                            <ControlLabel>Vardas:</ControlLabel>
                            <FormControl 
                                type="text" 
                                required  
                                placeholder="Vardenis"
                                value={this.state.userFormData.Vardas || ""}
                                maxLength={45}
                                onInvalid={(e) => {
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                    }
                                    /** Everything is ok */
                                    e.preventDefault();
                                    return e.target.setCustomValidity('');
                                }}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Vardas: e.target.value})});
                                }}
                            />
                        </FormGroup> 

                        {/** Person surname field */}
                        <FormGroup controlId={this.userData.surname}>
                            <ControlLabel>Pavardė:</ControlLabel>
                            <FormControl
                                type="text"
                                required
                                placeholder="Pavardenis"
                                value={this.state.userFormData.Pavarde || ""}
                                maxLength={50}
                                onInvalid={(e) => {
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                    }
                                    /** Everything is ok */
                                    e.preventDefault();
                                    return e.target.setCustomValidity('');
                                }}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Pavarde: e.target.value})});
                                }}
                            />
                        </FormGroup>

                        {/** Person phone field */}
                        <FormGroup controlId={this.userData.phone}>
                            <ControlLabel>Telefonas:</ControlLabel>
                            <FormControl
                                type="text"
                                required
                                placeholder="868388497"
                                pattern="(\+370|8)[0-9]{8}"
                                value={this.state.userFormData.Telefono_nr || ""}
                                maxLength={12}
                                minLength={9}
                                onInvalid={(e) => {
                                    if (e.target.validity.tooShort){
                                        return e.target.setCustomValidity("Numeris per trumpas.")
                                    }
                                    if (e.target.validity.patternMismatch){
                                        return e.target.setCustomValidity("Prašome įvesti telefono numerį teisingu formatu. Telefono numeris turi prasidėti +370... arba 8...")
                                    }
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                    }

                                    e.preventDefault();
                                    return e.target.setCustomValidity("");
                                }}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Telefono_nr: e.target.value})});
                                }}
                            />
                        </FormGroup>

                        {/** Person email field */}
                        <FormGroup controlId={this.userData.email}>
                            <ControlLabel>El paštas:</ControlLabel>
                            <FormControl
                                type="text"
                                required
                                placeholder="vardenis.pavardenis@gmail.com"
                                maxLength={50}
                                value={this.state.userFormData.Epastas || ""}
                                pattern="([\w\d\.]+)@([\w\d]+)\.([\w\d]+)"
                                onInvalid={(e) => {
                                    if (e.target.validity.patternMismatch){
                                        return e.target.setCustomValidity("Prašome įvesti telefono numerį teisingu formatu. Telefono numeris turi prasidėti +370... arba 8...")
                                    }
                                    if (e.target.validity.valueMissing){
                                        return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                    }
                                    
                                    e.preventDefault();
                                    return e.target.setCustomValidity("");
                                }}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Epastas: e.target.value})});
                                }}
                            />
                        </FormGroup>

                        {/** Person birth date field */}
                        <FormGroup controlId={this.userData.birthDate}>
                            <ControlLabel>Gimimo data:</ControlLabel>
                            <FormControl
                                type="date"
                                required
                                maxLength={50}
                                value={this.state.userFormData.Gimimo_data || ""}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Gimimo_data: e.target.value})});
                                    let date = e.target.value;
                                    if (date == undefined){
                                        return;
                                    }

                                    let personID = document.getElementById(this.userData.personId);
                                    if (personID == undefined){
                                        return;
                                    }

                                    personID = personID.value;
                                    if (personID == undefined || personID.length != 11){
                                        return;
                                    }

                                    let dateString = "";
                                    /** Getting century */
                                    switch(personID.substring(0, 1)){
                                        case "3":
                                        case "4":
                                            dateString += "19";
                                            break;
                                        case "5":
                                        case "6":
                                            dateString += "20";
                                            break;
                                    }

                                    /** Getting years */
                                    dateString += personID.substring(1, 3);
                                    dateString += "-";

                                    /** Getting month */
                                    dateString += personID.substring(3, 5);
                                    dateString += "-";

                                    /** Getting day */
                                    dateString += personID.substring(5, 7);

                                    if (dateString != date){
                                        this.setState({dateValid: false});
                                        return e.target.setCustomValidity("Data neatitinka asmens kodo reikšmės");
                                    }

                                    this.setState({dateValid: true});
                                }}
                                
                                onInvalid={(e) => {
                                    let dateString = "";
                                    let personID = document.getElementById(this.userData.personId).value;
                                    /** Getting century */
                                    switch(personID.substring(0, 1)){
                                        case "3":
                                        case "4":
                                            dateString += "19";
                                            break;
                                        case "5":
                                        case "6":
                                            dateString += "20";
                                            break;
                                    }
                    
                                    /** Getting years */
                                    dateString += personID.substring(1, 3);
                                    dateString += "-";
                    
                                    /** Getting month */
                                    dateString += personID.substring(3, 5);
                                    dateString += "-";
                    
                                    /** Getting day */
                                    dateString += personID.substring(5, 7);
                                        
                                    if (dateString != e.target.value){
                                        return e.target.setCustomValidity("Data neatitinka asmens kodo reikšmės");
                                    }

                                    if (this.state.dateValid){
                                        return e.preventDefault();
                                    }
                                }}
                            />
                        </FormGroup>

                        {/** Person health insurance field */}
                        <FormGroup controlId={this.userData.healthInsurance} className="diflex">
                            <ControlLabel className="margin-auto margin-right-min">Sveikatos draudimas:</ControlLabel>
                            <div className="switch">
                                <FormControl 
                                    type="checkbox"
                                    checked={this.state.userFormData.Sveikatos_draudimas || false}
                                    onChange={(e) => {
                                        this.setState({userFormData: Object.assign({}, this.state.userFormData, {Sveikatos_draudimas: e.target.checked})});
                                    }}
                                />
                                <span className="slider round" onClick={(e) => {
                                    let cb = document.getElementById(this.userData.healthInsurance);
                                    cb.checked = !cb.checked;   
                                }}/>
                            </div>
                        </FormGroup>

                        {/** Person living in field */}
                        <FormGroup  controlId={this.userData.livingIn}>
                            <ControlLabel>Gyvenamoji vieta:</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Studentų g. 69, Kaunas"
                                maxLength={100}
                                value={this.state.userFormData.Gyvenamoji_vieta || ""}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Gyvenamoji_vieta: e.target.value})});
                                }}
                            />
                        </FormGroup>

                        {/** Person degree field */}
                        <FormGroup  controlId={this.userData.degree}>
                            <ControlLabel>Išsilavinimas:</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Aukštasis"
                                value={this.state.userFormData.Issilavinimas || ""}
                                onChange={(e) => {
                                    this.setState({userFormData: Object.assign({}, this.state.userFormData, {Issilavinimas: e.target.value})});
                                }}
                                maxLength={200}
                            />
                        </FormGroup>
                    </Panel>
                </form>
                <section className="clearSpace"></section>
                <form onSubmit={this.onSubmitPassword} onReset={() => this.setState({passwordFormData: {}})}>
                    <Panel collapsible expanded={this.state.openedPanel.userPassword} header={<p onClick={(e) => this.setState({openedPanel: {userData: false, userPassword: true, userQuestion: false}})}>Vartotojo slaptažodžio keitimas</p>} footer={[<Button type="reset" key="0" className="margin-right-min">Atšaukti</Button>, <Button type="submit" key="1">Patvirtinti</Button>]}>
                        <FormGroup controlId={this.passwordData.oldPassword}>
                            <ControlLabel>Senas slaptažodis</ControlLabel>
                            <FormControl
                                type="password"
                                autoComplete="off"
                                required
                                value={this.state.passwordFormData.oldPassword || ""}
                                onChange={(e) => {
                                    this.setState({passwordFormData: Object.assign({}, this.state.passwordFormData, {oldPassword: e.target.value})});
                                }}
                                minLength="8"
                                maxLength="30"
                                onInvalid={(e) => {
                                    if (e.target.validity.tooShort){
                                        return e.target.setCustomValidity("Slaptažodis per trumpas. Slaptažodis turi būi sudarytas bent iš 8 simbolių (yra " + e.target.value.length + " simboliai).");
                                    }
                                    else if (e.target.validity.tooLong){
                                        return e.target.setCustomValidity("Slaptažodis per ilgas. Maksimalus simbolių kiekis 30.");
                                    }
                                    else{
                                        return e.preventDefault();
                                    }
                                }}
                            />
                        </FormGroup>
                        <FormGroup controlId={this.passwordData.newPassword}>
                            <ControlLabel>Naujas slaptažodis</ControlLabel>
                            <FormControl
                                type="password"
                                autoComplete="off"
                                required
                                value={this.state.passwordFormData.newPassword || ""}
                                onChange={(e) => {
                                    this.setState({passwordFormData: Object.assign({}, this.state.passwordFormData, {newPassword: e.target.value})});
                                }}
                                minLength="8"
                                maxLength="30"
                                onInvalid={(e) => {
                                    if (e.target.validity.tooShort){
                                        return e.target.setCustomValidity("Slaptažodis per trumpas. Slaptažodis turi būi sudarytas bent iš 8 simbolių (yra " + e.target.value.length + " simboliai).");
                                    }
                                    else if (e.target.validity.tooLong){
                                        return e.target.setCustomValidity("Slaptažodis per ilgas. Maksimalus simbolių kiekis 30.");
                                    }
                                    else{
                                        return e.preventDefault();
                                    }
                                }}
                            />
                        </FormGroup>
                        <FormGroup controlId={this.passwordData.newPassword2}>
                            <ControlLabel>Pakartokite naują slaptažodį</ControlLabel>
                            <FormControl
                                type="password"
                                autoComplete="off"
                                required
                                value={this.state.passwordFormData.newPassword2 || ""}
                                onChange={(e) => {
                                    this.setState({passwordFormData: Object.assign({}, this.state.passwordFormData, {newPassword2: e.target.value})});
                                }}
                                minLength="8"
                                maxLength="30"
                                onInvalid={(e) => {
                                    if (e.target.validity.tooShort){
                                        return e.target.setCustomValidity("Slaptažodis per trumpas. Slaptažodis turi būi sudarytas bent iš 8 simbolių (yra " + e.target.value.length + " simboliai).");
                                    }
                                    else if (e.target.validity.tooLong){
                                        return e.target.setCustomValidity("Slaptažodis per ilgas. Maksimalus simbolių kiekis 30.");
                                    }
                                    else if (e.target.value != document.getElementById(this.passwordData.newPassword).value){
                                        return e.target.setCustomValidity("Neteisingai suvestas slaptažodis. Reikšmė neatitinka.");
                                    }
                                    else{
                                        return e.preventDefault();
                                    }
                                }}
                            />
                        </FormGroup>
                    </Panel>
                </form>
            </div>
        )
    }
}

export default connect(
    state => {
        return {
            username: state.login.name,
            accessKey: state.login.accessKey,
            userStoreData: state.user
        }
    }, 
    dispatch => {
        return {
            updateAction: (data) => {
                return dispatch(accessControlLogin({
                            key: data.accessKey,
                            name: data.username,
                            Vardas: data.Vardas,
                            Pavarde: data.Pavarde,
                            Pareigos: data.Pareigos,
                            PareiguKodas: data.PareiguKodas 
                        }));
            }
        }
    }
)(Settings);
