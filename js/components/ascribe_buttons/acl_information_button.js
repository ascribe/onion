/**
 * Created by cevo on 23.09.15.
 */
'use strict';

import React from 'react';
import CollapsibleButton from '../ascribe_collapsible/collapsible_button';
import Button from 'react-bootstrap/lib/Button';

let aclInformationButton = React.createClass({

    render: function () {
        let titleStyle = {
            color: '#02B6A3',
            fontSize: '14px'
        };

        let exampleStyle = {
            color: '#B2B2B2',
            fontSize: '14px'
        };

        let infoStyle = {
            color: '#333333',
            fontSize: '14px'
        };

        let divStyle = {
            color: 'white',
            width: 10
        };

        let titleList = ['TRANSFER', 'CONSIGN', 'LOAN', 'SHARE', 'DELETE'];

        let infoSentenceList = [
            '- Changes ownership of an Edition. As with a physical piece of work, ' +
            'transferring ownership of an Edition does not transfer copyright in the Work.',

            '- Lets someone represent you in dealing with the work, under the terms you agree to.',

            '- Lets someone use or put the Work on display for a limited amount of time.',

            '- Lets someone view the Work or Edition, but does not give rights to publish or display it.',

            '- Removes the Work from your Wallet. Note that the previous registration and transfer ' +
            'history will still exist on the blockchain and cannot be deleted.'
        ];

        let exampleSentenceList = [
            '(e.g. a musician Transfers limited edition 1 of 10 of her new album to a very happy fan)',

            '(e.g. an artist Consigns 10 Editions of her new Work to a gallery ' +
            'so the gallery can sell them on her behalf, under the terms the artist and the gallery have agreed to)',

            '(e.g. a collector Loans a Work to a gallery for one month for display in the gallery\'s show)',

            '(e.g. a photographer Shares proofs of a graduation photo with the graduate\'s grandparents)',

            '(e.g. an artist uploaded the wrong file and doesn\'t want it cluttering his Wallet, so he Deletes it)'
        ];
        let createJSXTextSnippet = function (title, info, example) {
            return [<p>, <Text style={titleStyle}> {title} </Text>,
                <Text style={infoStyle}> {info} </Text>,
                <Text style={exampleStyle}> {example} </Text>, </p> ];
                };

        let rows = [];
        for (let i = 0; i < titleList.length; i++){
            rows.push(rows, createJSXTextSnippet(titleList[i], infoSentenceList[i], exampleSentenceList[i]));
        }
        return (
        <CollapsibleButton
            button = {
            <Button bsSize="xsmall" className="ascribe-margin-1px" >
                ?
            </Button>
            }
            panel={
            <div style = {divStyle}>
                {rows}
            </div>
            }
        />
        );
    }
});

export default aclInformationButton;
