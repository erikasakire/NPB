import React from 'react';
import { 
    Modal, 
    ModalHeader, 
    ModalTitle, 
    ModalFooter,
    ModalBody, 
    
    FormControl,
    FormGroup, 
    ControlLabel,
    
    Button, 
    ButtonGroup,
    Panel,
    PanelGroup,
    Accordion

} from 'react-bootstrap';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import config from '../config.json';

class Ataskaita extends React.Component {
    constructor(props){
        super(props);

        /** Saugoma esama būsena */
        this.state = {
            data: null,
            selectedFiltras: "",
        };

        this.fetchData = this.fetchData.bind(this);
        this.changePage = this.changePage.bind(this);
    }
    
    componentWillMount(){
        this.fetchData();
    }
    fetchData (){
        fetch(config.server + '/produkcija/ataskaita', {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => {
            /** Įdeda puslapio numerį į state objektą */
            for(let i = 0; i < response.data.length; i++){
                response.data[i].currentPage = '1';
            }
            this.setState({data: response.data});
        })
    }

    changePage(e){
        let element = null;
        for(let i = 0; i < this.state.data.length; i++){
            if (this.state.data[i].Inventorinis_numeris == e.target.id){
                element = i;
            }
        }

        let page = e.target.attributes['page'].value;
        let state = this.state.data;
        state[element].currentPage = page;
        this.setState({data: state});
    }

    Ataskaita(e){
        let id = e.target.attributes['atask'].nodeValue;
        fetch(config.server + '/produkcija/ataskaita/' + id, {
            method: "GET",
        })
        .then(response => {
            if (response.status == 200) {
                this.fetchData();
            }
        })
    }
    render(){
        if (["1","2"].indexOf(this.props.rangas) == -1){
            return <Redirect to='/'/>
        }

        if (this.state.data == null){
            return <p>Prašome palaukti</p>
        }

        let judejimas = [];
        let padaliniai = [];
        let filtras = [<option value="" key={-1}>Visi</option>];
        for(let i = 0; i < this.state.data.length; i++){
            let tmp = this.state.data[i]

            filtras.push(
                <option key={i} value={tmp.Inventorinis_numeris}>
                    {tmp.padalinio_pavadinimas}
                </option>
            )   

            /** Patikrina ar tenkina filtrą */
            if(this.state.selectedFiltras != "" && tmp.Inventorinis_numeris != this.state.selectedFiltras){
                continue;
            }

            padaliniai.push(
                <div key={i}>
                    <ButtonGroup justified className="dflex">
                        <Button className="flex no-outline" id={tmp.Inventorinis_numeris} page="1" onClick={this.changePage}>Padalinio infomacija</Button>
                        <Button className="flex no-outline" id={tmp.Inventorinis_numeris} page="2" onClick={this.changePage}>Ataskaita</Button>
                    </ButtonGroup>
                    <Panel>
                        <div style={{display: tmp.currentPage == '1' ? 'block' : 'none'}} className="dflex verticalFlex">
                            <div className="dflex horizontalFlex flex">
                                <label className="flex">Inventorinis numeris:</label>
                                <label className="flex">{tmp.Inventorinis_numeris}</label>
                            </div>
                            <div className="dflex horizontalFlex flex">
                                <label className="flex">Pavadinimas:</label>
                                <label className="flex">{tmp.padalinio_pavadinimas}</label>
                            </div>
                            <div className="dflex horizontalFlex flex">
                                <label className="flex">Adresas:</label>
                                <label className="flex">{tmp.Gatve} {tmp.Pasto_kodas} {tmp.Miestas}, {tmp.Salis}</label>
                            </div>
                            <div className="dflex horizontalFlex flex">
                                <label className="flex">Rajonas:</label>
                                <label className="flex">{tmp.Rajonas}</label>
                            </div>
                            <div className="dflex horizontalFlex flex">
                                <label className="flex">Regionas:</label>
                                <label className="flex">{tmp.Regionas}</label>
                            </div>
                            </div>
                        <div style={{display: tmp.currentPage == '2' ? 'block' : 'none'}} className="dflex verticalFlex">
                            <PanelGroup>
                                <Panel collapsible header="Iš padalinio">
                                    {
                                        Object.values(tmp.IsPadalinio).map((value, key) => {
                                            if (!(value instanceof Object)){
                                                return;
                                            }
                                            return (
                                                <div key={'tasks' + key}>
                                                    <p>#{value.Numeris}. Užsakyta: {value.Uzsakymo_data.substring(0, 10)} - Įvykdyta: {value.Atlikimo_data != null ?  value.Atlikimo_data.substring(0, 10) : 'Neįvykdyta'}</p>
                                                    {
                                                        value.prekes.count <= 0 ? null :
                                                        <div>
                                                            {
                                                                Object.values(value.prekes).map((value, key) =>{
                                                                    if (!(value instanceof Object)){
                                                                        return;
                                                                    }
                                                                    return (
                                                                        <p>
                                                                            ({value.Barkodas}) {value.Pavadinimas} x {value.Kiekis}. Viso: {parseFloat(value.Vieneto_kaina) * parseFloat(value.Kiekis)}€
                                                                        </p>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </Panel>
                                <Panel collapsible header="Į padalinio">
                                    {
                                        Object.values(tmp.IPadalini).map((value, key) => {
                                            if (!(value instanceof Object)){
                                                return;
                                            }
                                            return (
                                                <div key={'tasks' + key}>
                                                    <p>#{value.Numeris}. Užsakyta: {value.Uzsakymo_data.substring(0, 10)} - Įvykdyta: {value.Atlikimo_data != null ?  value.Atlikimo_data.substring(0, 10) : 'Neįvykdyta'}</p>
                                                    {
                                                        value.prekes.count <= 0 ? null :
                                                        <div>
                                                            {
                                                                Object.values(value.prekes).map((value, key) =>{
                                                                    if (!(value instanceof Object)){
                                                                        return;
                                                                    }
                                                                    return (
                                                                        <p>
                                                                            ({value.Barkodas}) {value.Pavadinimas} x {value.Kiekis}. Viso: {parseFloat(value.Vieneto_kaina) * parseFloat(value.Kiekis)}€
                                                                        </p>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </Panel>
                            </PanelGroup>
                        </div>
                    </Panel>
                </div>
            );
        }
        

        return(
            <div id="wraper" >
                    <h2 style={{
                            textAlign: "center",
                            color: "#985E6D",
                            paddingBottom: "50px"
                        }}>Produktų judėjimo ataskaitos padaliniuose</h2>           
                        
                    <FormGroup> <ControlLabel>Padaliniai:</ControlLabel>
                        <FormControl componentClass="select" defaultValue={this.state.selectedFiltras} onChange={(e) => {this.setState({selectedFiltras: e.target.value})}}>
                            {filtras}
                        </FormControl>
                    </FormGroup>
               
                    <div>
                        <h3 style={{color: "#985E6D"}}>Ataskaitos:</h3>
                    </div>
                   {padaliniai} 
                   {judejimas}
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
)(Ataskaita);