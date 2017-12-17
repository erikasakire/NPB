import React from 'react'

class  Vechiles extends React.Component {

    //props - properties
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    

    render() {
        return (
            <div>
                <div>{this.handleSubmit}</div>
            </div>
        );
    }
}

export default Vechiles