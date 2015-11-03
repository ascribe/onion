'use strict';

import React from 'react';
import classNames from 'classnames';

import ConsignButton from '../../../../../ascribe_buttons/acls/consign_button';

import WhitelabelActions from '../../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../../stores/whitelabel_store';

import { getLangText } from '../../../../../../utils/lang_utils';

let LumenusSubmitButton = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object,
        pieceOrEditions: React.PropTypes.array,
        handleSuccess: React.PropTypes.func,
        className: React.PropTypes.string,
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
        const { availableAcls, currentUser, className, pieceOrEditions, handleSuccess } = this.props;

        return (
            <ConsignButton
                availableAcls={availableAcls}
                buttonAcceptName={getLangText('CONSIGN TO LUMENUS')}
                email={this.state.whitelabel.user}
                currentUser={currentUser}
                handleSuccess={handleSuccess}
                pieceOrEditions={pieceOrEditions}
                className={className} />
        );
    }
});

export default LumenusSubmitButton;
