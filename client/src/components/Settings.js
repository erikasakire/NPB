import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Panel, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import config from '../config.json';

class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            dateValid: true
        };

        this.onSubmit = this.onSubmit.bind(this);

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
    }

    fetch(){
        fetch(config.server + '/sistemosprieinamumas/')
    }

    onSubmit(e){
        e.preventDefault();

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

        fetch(config.server + '/sistemosprieinamumas/')
    }

    render() {
        return (
        <div style={{paddingLeft: "5px", paddingRight: "5px"}}>
            <h2 className="Title">Vartotojo nustatymai</h2>
            <form onSubmit={this.onSubmit}>
                <Panel header="Vartotojo duomenų nustatymai" footer={[<Button type="reset" key="0" className="margin-right-min">Atšaukti</Button>, <Button type="submit" key="1">Patvirtinti</Button>]}>
                    {/** Person ID field */}
                    <FormGroup controlId={this.userData.personId}>
                        <ControlLabel>Asmens kodas:</ControlLabel>
                        <FormControl 
                            type="text" 
                            required 
                            pattern="[3-6](0[1-9]|[1-9][0-9])(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|(0[469]|11)(0[1-9]|[12][0-9]|30)|(02(0[0-9]|[12][0-9])))([0-9]{4})" 
                            placeholder="49802120925"
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
                                    return;
                                }

                                let dateElement = document.getElementById(this.userData.birthDate);
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
                                
                                dateElement.value = date;
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
                            maxLength={45}
                            onInvalid={(e) => {
                                if (e.target.validity.valueMissing){
                                    return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                }
                                /** Everything is ok */
                                e.preventDefault();
                                return e.target.setCustomValidity('');
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
                            maxLength={50}
                            onInvalid={(e) => {
                                if (e.target.validity.valueMissing){
                                    return e.target.setCustomValidity("Prašome užpildyti šį lauką");
                                }
                                /** Everything is ok */
                                e.preventDefault();
                                return e.target.setCustomValidity('');
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
                         />
                    </FormGroup>

                    {/** Person birth date field */}
                    <FormGroup controlId={this.userData.birthDate}>
                        <ControlLabel>Gimimo data:</ControlLabel>
                        <FormControl
                            type="date"
                            required
                            maxLength={50}
                            onChange={(e) => {
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
                         />
                    </FormGroup>

                    {/** Person degree field */}
                    <FormGroup  controlId={this.userData.degree}>
                        <ControlLabel>Išsilavinimas:</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Aukštasis"
                            maxLength={200}
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
            username: state.login.name
        }
    }, 
    null    
)(Settings);
