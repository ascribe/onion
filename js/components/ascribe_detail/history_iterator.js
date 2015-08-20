'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

let HistoryIterator = React.createClass({
    propTypes: {
        history: React.PropTypes.array
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
                            <pre className="ascribe-pre">{ historicalEvent[1] }</pre>
                        </Property>
                    );
                })}
                <hr />
            </Form>
        );
    }
});

export default HistoryIterator;
