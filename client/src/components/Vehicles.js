import React from 'react'

class  Vechiles extends React.Component {
    //props - properties
    constructor(props) {
        super(props);
        this.state = {date: new Date()
        };
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        let rows = [];
        for (var i = 0; i < 10; i++){
            rows.push(<tr><td>{i}</td></tr>)
        }
        return (
            <div className="">
                <div className="">
                    <div className="">
                        <table id="">
                        <tbody>
                            {rows}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

fetch('http://localhost:8081/api/Transporto_priemones/sarasas', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ })
  })
  .then(response => response.json())
  .then(response => {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  }); 

export default Vechiles