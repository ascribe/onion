'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import { replaceSubstringAtIndex } from '../../utils/general_utils';


let HistoryIterator = React.createClass({
    propTypes: {
        history: React.PropTypes.array
    },

    composeHistoryDescription(historicalEvent) {
        if(historicalEvent.length === 3) {
            // We want to get the capturing group without the quotes,
            // which is why we access the match list at index 1 and not 0
            const contractName = historicalEvent[1].match(/\"(.*)\"/)[1];
            const historicalEventDescription = replaceSubstringAtIndex(historicalEvent[1], `"${contractName}"`, '');
            return (
                <span>
                    {historicalEventDescription}
                    <a  className="anchor-no-expand-print"
                        target="_blank"
                        href={historicalEvent[2]}>
                        {contractName}
                    </a>
                </span>
            );
        } else if(historicalEvent.length === 2) {
            return historicalEvent[1];
        } else {
            throw new Error('Expected an historical event list with either 3 or 2 items. Got less or more.');
        }
    },

    render() {
        return (
            <Form>
                {this.props.history.map((historicalEvent, i) => {
                    return (
                        <Property
                                name={i}
                                key={i}
                                label={ historicalEvent[0] }
                                editable={false}>
                            <pre className="ascribe-pre">{this.composeHistoryDescription(historicalEvent)}</pre>
                        </Property>
                    );
                })}
                <hr />
            </Form>
        );
    }
});

export default HistoryIterator;
