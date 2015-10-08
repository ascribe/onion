/**
 * Created by cevo on 23.09.15.
 */
'use strict';

import React from 'react';
import classnames from 'classnames';

import DropdownButton from 'react-bootstrap/lib/Button';



let AclInformationButton = React.createClass({
    getDefaultProps: function() {
        let rows = [];
        let titleStyle = {
            color: '#02B6A3',
            fontSize: '11px',
            lineHeight: '5px'
        };

        let infoStyle = {
            color: '#333333',
            fontSize: '11px',
            lineHeight: '5px'
        };

        let exampleStyle = {
            color: '#B2B2B2',
            fontSize: '11px',
            lineHeight: '5px'
        };

        let paragraphStyle = {
             margin: '0.1em'
        };


        let titleList = ['TRANSFER', 'CONSIGN', 'LOAN', 'SHARE', 'DELETE'];

        let infoSentenceList = [
            ' - Changes ownership of an Edition. As with a physical piece of work, ' +
            'transferring ownership of an Edition does not transfer copyright in the Work.',

            ' - Lets someone represent you in dealing with the work, under the terms you agree to.',

            ' - Lets someone use or put the Work on display for a limited amount of time.',

            ' - Lets someone view the Work or Edition, but does not give rights to publish or display it.',

            ' - Removes the Work from your Wallet. Note that the previous registration and transfer ' +
            'history will still exist on the blockchain and cannot be deleted.'];

        let exampleSentenceList = [
            '(e.g. a musician Transfers limited edition 1 of 10 of her new album to a very happy fan)',

            '(e.g. an artist Consigns 10 Editions of her new Work to a gallery ' +
            'so the gallery can sell them on her behalf, under the terms the artist and the gallery have agreed to)',

            '(e.g. a collector Loans a Work to a gallery for one month for display in the gallery\'s show)',

            '(e.g. a photographer Shares proofs of a graduation photo with the graduate\'s grandparents)',

            '(e.g. an artist uploaded the wrong file and doesn\'t want it cluttering his Wallet, so he Deletes it)'];

        console.log('Now will initialize the rows prop inside default props');

        let createJSXTextSnippet = function(title, info, example){
            console.log('creating text snippets');
            return (<p style={paragraphStyle}> <span style={titleStyle}> {title} </span>
                <span style={infoStyle}> {info} <br/> </span>
                <span style={exampleStyle}> {example} </span> </p>);
        };

        for (let i = 0; i < titleList.length; i++){
            rows.push(createJSXTextSnippet(titleList[i], infoSentenceList[i], exampleSentenceList[i],
                        titleStyle, infoStyle, exampleStyle));
        }
        return {
            rows: rows,
            dropdownButtonStyle: {
                background: 'none',
                color: 'black',
                padding: 0,
                border: 'none'
            },
            dropdownListStyle: {
                textAlign: 'justify',
                width: '80.8%',
                border: '1px solid #CCC',
                backgroundColor: 'white',
                padding: '0.5em'
            }
        };
    },
    getInitialState: function(){
        return {isVisible: false};
    },
    show: function(){
        console.log('now inside the show function');
        this.setState({isVisible: true});
        document.addEventListener('click', this.hide);
    },
    hide: function(){
        this.setState({isVisible: false});
        document.removeEventListener('click', this.hide);
    },
    showInformation: function(){
        if (this.state.isVisible) {
            return this.props.rows;
        }
    },
    render: function () {
        return (
            <span>
                <DropdownButton
                    style={this.props.dropdownButtonStyle}
                    className="glyphicon glyphicon-question-sign" onClick={this.show} />
                <div
                    style={this.props.dropdownListStyle}
                    className={classnames({'hidden': !this.state.isVisible})}>
                    {this.showInformation()}
                </div>
            </span>
        );
    }
});

export default AclInformationButton;
