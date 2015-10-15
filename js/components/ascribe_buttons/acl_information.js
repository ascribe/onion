'use strict';

import React from 'react';
import classnames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import { InformationTexts } from '../../constants/information_text';
import { replaceSubstringAtIndex, sanitize } from '../../utils/general_utils';
import { intersectAcls } from '../../utils/acl_utils';
import { getLangText } from '../../utils/lang_utils';


let AclInformation = React.createClass({
    propTypes: {
        verbs: React.PropTypes.arrayOf(React.PropTypes.string),
        aim: React.PropTypes.string.isRequired,
        aclObject: React.PropTypes.object
    },

    getInitialState() {
        return { isVisible: false };
    },

    componentDidMount() {
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
        if(!this.state.isVisible) {
            this.setState({ isVisible: true });
        }
        else {
            this.setState({ isVisible: false });
        }
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
                return (
                    <p style={paragraphStyle}>
                        <span style={infoStyle}> {replaceSubstringAtIndex(info.slice(2), 's ', ' ')} <br/> </span>
                        <span style={exampleStyle}> {example} </span>
                    </p>
                );
            }
            else if (aim === 'button') {
                return (
                    <p style={paragraphStyle}><span style={titleStyle}> {title} </span>
                        <span style={infoStyle}> {info} <br/> </span>
                        <span style={exampleStyle}> {example} </span>
                    </p>
                );
            }
        }
        else {
            console.log('Aim is required when you want to place information text');
        }
    },

    produceInformationBlock() {
        const { titles, informationSentences, exampleSentences } = InformationTexts;
        const {verbs, aim } = this.props;

        // sorting is not needed, as `this.props.verbs` takes care of sorting already
        // So we assume a user of `AclInformationButton` puts an ordered version of
        // `verbs` into `propTypes`
        let verbsToDisplay = [];
        if(aim === 'form') {
            verbsToDisplay = verbsToDisplay.concat(verbs);
        } else if(aim === 'button' && this.props.aclObject) {
            const { aclObject } = this.props;
            const sanitizedAclObject = sanitize(aclObject, (val) => !val);
            verbsToDisplay = verbsToDisplay.concat(intersectAcls(verbs, Object.keys(sanitizedAclObject)));
        } else {
            console.warn('AclInformation can only be used with aim === "button" or aim === "form".' +
                'For aim === "button", aclObject needs to be defined.');
        }

        return verbsToDisplay.map((verb) => {
            return this.getInfoText(getLangText(titles[verb]), getLangText(informationSentences[verb]), getLangText(exampleSentences[verb]));
        });
    },

    getButton() {
        return this.props.aim === 'button' ?
            <Button style = {this.dropdownButtonStyle} className="glyphicon glyphicon-question-sign" onClick={this.onOff} /> :
            null;
    },

    render() {
        return (
            <span>
                {this.getButton()}
                <div
                    style={this.dropdownListStyle}
                    className={classnames({'hidden': this.props.aim === 'button' && !this.state.isVisible})}>
                    <span>{this.produceInformationBlock()}</span>
                </div>
            </span>
        );
    }
});

export default AclInformation;
