
'use strict';

import React from 'react';
import classnames from 'classnames';

import AclInformation from '../ascribe_information/acl_information';
import Button from 'react-bootstrap/lib/Button';

let AclInformationButton = React.createClass({
    getInitialState() {
        return {isVisible: false};
    },
    componentDidMount() {
        console.log('Information button being launched');
        this.dropdownButtonStyle = {
                background: 'none',
                color: 'black',
                padding: 0,
                border: 'none'
            };

        this.dropdownListStyle = {
                textAlign: 'justify',
                width: '80.8%',
                border: '1px solid #CCC',
                backgroundColor: 'white',
                padding: '0.5em'
            };
    },
    onOff() {
        if (!this.state.isVisible) {
            this.setState({isVisible: true});
        }
        else {
            this.setState({isVisible: false});
        }
    },
    showInformation() {
        if (this.state.isVisible) {
            return (<AclInformation aim={'button'} verbs={this.props.verbs}/>);
        }
    },
    render() {
        return (
            <span>
                <Button style = {this.dropdownButtonStyle} className="glyphicon glyphicon-question-sign" onClick={this.onOff} />
                <div
                    style={this.dropdownListStyle}
                    className={classnames({'hidden': !this.state.isVisible})}>
                    {this.showInformation()}
                </div>
            </span>
        );
    }
});

export default AclInformationButton;
