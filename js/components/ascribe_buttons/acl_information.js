'use strict';

import React from 'react';
import classnames from 'classnames';

import { AclInformationText } from '../../constants/acl_information_text';
import { replaceSubstringAtIndex, sanitize, intersectLists } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';


let AclInformation = React.createClass({
    propTypes: {
        verbs: React.PropTypes.arrayOf(React.PropTypes.string),
        aim: React.PropTypes.string.isRequired,
        aclObject: React.PropTypes.object,

        // Must be inserted from the outside
        buttonListSize: React.PropTypes.number.isRequired
    },

    getDefaultProps() {
        return {
            buttonListSize: 400
        };
    },

    getInitialState() {
        return { isVisible: false };
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
        const aim = this.props.aim;

        if(aim) {
            if(aim === 'form') {
                return (
                    <p>
                        <span className="info">
                            {replaceSubstringAtIndex(info.slice(2), 's ', ' ')}
                        </span>
                        <span className="example">
                            {' ' + example}
                        </span>
                    </p>
                );
            }
            else if(aim === 'button') {
                return (
                    <p>
                        <span className="title">
                            {title}
                        </span>
                        <span className="info">
                            {info + ' '}
                        </span>
                        <span className="example">
                            {example}
                        </span>
                    </p>
                );
            }
        }
        else {
            console.log('Aim is required when you want to place information text');
        }
    },

    produceInformationBlock() {
        const { titles, informationSentences, exampleSentences } = AclInformationText;
        const { verbs, aim } = this.props;

        const availableInformations = intersectLists(verbs, Object.keys(titles));

        // sorting is not needed, as `this.props.verbs` takes care of sorting already
        // So we assume a user of `AclInformationButton` puts an ordered version of
        // `verbs` into `propTypes`
        let verbsToDisplay = [];


        if(aim === 'form' && availableInformations.length > 0) {
            verbsToDisplay = verbsToDisplay.concat(verbs);
        } else if(aim === 'button' && this.props.aclObject) {
            const { aclObject } = this.props;
            const sanitizedAclObject = sanitize(aclObject, (val) => !val);
            verbsToDisplay = verbsToDisplay.concat(intersectLists(verbs, Object.keys(sanitizedAclObject)));
        }

        return verbsToDisplay.map((verb) => {
            const title = titles[verb];
            const informationSentence = informationSentences[verb];
            const exampleSentence = exampleSentences[verb];

            if (title && informationSentence && exampleSentence) {
                return this.getInfoText(getLangText(title), getLangText(informationSentence), getLangText(exampleSentence));
            }
        });
    },

    getButton() {
        return this.props.aim === 'button' ?
            <button
                style={{ marginTop: 0 }}
                className="btn btn-transparent glyphicon glyphicon-question-sign" onClick={this.onOff} /> :
            null;
    },

    render() {
        const { aim, buttonListSize, verbs } = this.props;
        const { isVisible } = this.state;

        /* Lets just fucking get this widget out... */
        const aclInformationSize = buttonListSize - 30;

        return (
            <span >
                {this.getButton()}
                <div
                    style={{
                        width: verbs.length > 1 && aclInformationSize > 300 ? aclInformationSize : verbs.length === 1 ? null : '100%',
                        marginLeft: verbs.length === 1 ? '.25em' : null
                    }}
                    className={classnames({'acl-information-dropdown-list': true, 'hidden': aim === 'button' && !isVisible})}>
                    <span>{this.produceInformationBlock()}</span>
                </div>
            </span>
        );
    }
});

export default AclInformation;
