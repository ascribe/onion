'use strict';

import React from 'react';
import classNames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import WhitelabelActions from '../../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../../stores/whitelabel_store';

import { getLangText } from '../../../../../../utils/lang_utils';

let CylandSubmitButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired,
        username: React.PropTypes.string
    },

    getInitialState() {
        return WhitelabelStore.getState();
    },

    componentDidMount() {
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { piece, className } = this.props;

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