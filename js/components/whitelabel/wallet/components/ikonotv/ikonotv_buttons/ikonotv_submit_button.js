'use strict';

import React from 'react';
import classNames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import { getLangText } from '../../../../../../utils/lang';

let IkonotvSubmitButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        piece: React.PropTypes.object.isRequired
    },

    getDefaultProps() {
        return {
            className: 'btn-xs'
        };
    },

    render() {
        let piece = this.props.piece;
        let startFrom = 1;

        // In the Ikonotv loan page a user has to complete two steps.
        // Since every one of those steps is atomic a user should always be able to continue
        // where he left of.
        // This is why we start the process form slide 1/2 if the user has already finished
        // it in another session.
        if(piece && piece.extra_data && Object.keys(piece.extra_data).length > 0) {
            startFrom = 1;
        }

        return (
            <LinkContainer
                to="/register_piece"
                query={{
                    'slide_num': 0,
                    'start_from': startFrom,
                    'piece_id': piece.id
                }}>
                <Button
                    className={classNames('ascribe-margin-1px', this.props.className)}>
                    {getLangText('Loan to IkonoTV')}
                </Button>
            </LinkContainer>
        );
    }
});

export default IkonotvSubmitButton;
