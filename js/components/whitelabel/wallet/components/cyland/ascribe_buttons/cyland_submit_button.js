'use strict';

import React from 'react';
import classNames from 'classnames';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';

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
        let piece = this.props.piece;
        let startFrom = 1;

        if(piece && piece.extra_data && Object.keys(piece.extra_data).length > 0) {
            startFrom = 2;
        }

        return (
            <ButtonLink
                to="register_piece"
                query={{
                    'slide_num': 0,
                    'start_from': startFrom,
                    'piece_id': this.props.piece.id
                }}
                className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                {getLangText('Submit to Cyland')}
            </ButtonLink>
        );
    }
});

export default CylandSubmitButton;