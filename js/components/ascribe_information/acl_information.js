'use strict';

import React from 'react';
import informationTexts from '../../constants/information_text';
import { getLangText } from '../../utils/lang_utils';
import { replaceSubstringAtIndex } from '../../utils/general_utils';

let AclInformation = React.createClass({
    propTypes: {
        verbs: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(React.PropTypes.string)
        ]),
        aim: React.PropTypes.string
    },
    getInfoText(title, info, example){
        let titleStyle = {
            color: '#02B6A3',
            fontSize: '11px',
            lineHeight: '3px'
        };

        let infoStyle = {
            color: '#333333',
            fontSize: '11px',
            lineHeight: '3px'
        };

        let exampleStyle = {
            color: '#B2B2B2',
            fontSize: '11px',
            lineHeight: '3px'
        };

        let paragraphStyle = {
            margin: '0.1em',
            lineHeight: '15px',
            align: 'justify'
        };

        let aim = this.props.aim;

        if (aim) {
            if (aim === 'form') {
                return (<p style={paragraphStyle}>
                    <span style={infoStyle}> {replaceSubstringAtIndex(info.slice(2), 's ', ' ')} <br/> </span>
                    <span style={exampleStyle}> {example} </span></p>);
            }
            else if (aim === 'button') {
                return (<p style={paragraphStyle}><span style={titleStyle}> {title} </span>
                    <span style={infoStyle}> {info} <br/> </span>
                    <span style={exampleStyle}> {example} </span></p>);
            }
        }
        else {
            console.log('Aim is required when you want to place information text');
        }
    },
    produceInformationBlock(){
        let enabledIndices = this.props.verbs;
        let titleList = informationTexts.title;
        let infoSentenceList = informationTexts.informationSentence;
        let exampleSentenceList = informationTexts.exampleSentence;
        let sortedIndices = ['share', 'transfer', 'consign', 'loan', 'delete'];
        let tempIndices = [];
        for (let i = 0; i < sortedIndices.length; i++){
            if (enabledIndices.indexOf(sortedIndices[i]) === -1){
                continue;
            }
            else{
                tempIndices.push(sortedIndices[i]);
            }
        }
        enabledIndices = tempIndices;
        if(Array.isArray(enabledIndices)) {
            return enabledIndices.map((i)=> {
                return (this.getInfoText(getLangText(titleList[i]), getLangText(infoSentenceList[i]),
                    getLangText(exampleSentenceList[i])));
            });
        }
        else if (typeof enabledIndices === 'string'){
            return (this.getInfoText(getLangText(titleList[enabledIndices]), getLangText(infoSentenceList[enabledIndices])));
        }
        else if (typeof enabledIndices === 'undefined'){
            console.log('Verbs come undefined maybe you wrote verb instead of verbs?');
        }
        else {
            console.log('You need to supply an array of strings or string as verbs to AclInformation');
        }
    },
    render() {
        console.log('Creation of information block');
        return (<span>{this.produceInformationBlock()}</span>);
    }
});

export default AclInformation;
