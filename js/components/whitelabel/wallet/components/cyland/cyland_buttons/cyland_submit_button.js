'use strict';

import React from 'react';
import classNames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import { getLangText } from '../../../../../../utils/lang';


let CylandSubmitButton = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired,

        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func
    },

    render() {
        const { className, piece } = this.props;

        return (
            <LinkContainer
                to="/register_piece"
                query={{
                    'slide_num': 0,
                    'start_from': 1,
                    'piece_id': piece.id
                }}>
                <Button
                    className={classNames('btn', 'btn-default', 'btn-xs', className)}>
                    {getLangText('Submit to Cyland')}
                </Button>
            </LinkContainer>
        );
    }
});

export default CylandSubmitButton;
