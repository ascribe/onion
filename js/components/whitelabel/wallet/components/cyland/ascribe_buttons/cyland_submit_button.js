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
        return (
            <ButtonLink
                to="register_piece"
                query={{'slide_num': 1}}
                className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                {getLangText('Submit to Cyland')}
            </ButtonLink>
        );
    }
});

export default CylandSubmitButton;