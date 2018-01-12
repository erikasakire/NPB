import React from 'react';

class App extends React.Component {
    render() {
        return (
        <div style={{ textAlign: "center", width: "100%"}}>
            <h2 style= {{color: "#985E6D"}}>Informacinė sistema, susijusi su logistikos procesų valdymu.</h2>
            <hr/>
            <h3>Mūsų grupę sudaro trys nariai: </h3>
            <h4>Erikas Bagdonas IFA-5 (Komandos vadovas), posistemės:</h4>
            <h5> Sistemos prieinamumo posistemė, Užsakymo vykdymo posistemė;</h5>
            <h4>Elona Paulikaitytė IFA-5, posistemės:</h4> 
            <h5> Produkcijos ir pakeitimų sekimo posistemė, padalinių posistemė.</h5>
            <h4>Mindaugas Nauronis IFF-5/1 </h4>
            <h5> Užsakymų sukūrimo posistemė, Transporto priemonių panaudos ir priežiūros posistemė.</h5>         
        </div>
        );
    }
}

export default App;
