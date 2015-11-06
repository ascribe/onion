'use strict';

import React from 'react';

import LumenusSubmitButton from './lumenus_submit_button';

import DeleteButton from '../../../../../ascribe_buttons/delete_button';
import ShareButton from '../../../../../ascribe_buttons/acls/share_button';
import TransferButton from '../../../../../ascribe_buttons/acls/transfer_button';
import UnconsignButton from '../../../../../ascribe_buttons/acls/unconsign_button';

import UserActions from '../../../../../../actions/user_actions';
import UserStore from '../../../../../../stores/user_store';

let LumenusAclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        pieceOrEditions: React.PropTypes.array,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        let { availableAcls, className, pieceOrEditions, handleSuccess } = this.props;
        return (
            <div className={className}>
                <LumenusSubmitButton
                    availableAcls={availableAcls}
                    currentUser={this.state.currentUser}
                    editions={pieceOrEditions}
                    handleSuccess={handleSuccess} />
                <ShareButton
                    availableAcls={availableAcls}
                    currentUser={this.state.currentUser}
                    pieceOrEditions={pieceOrEditions}
                    handleSuccess={handleSuccess} />
                <TransferButton
                    availableAcls={availableAcls}
                    currentUser={this.state.currentUser}
                    pieceOrEditions={pieceOrEditions}
                    handleSuccess={handleSuccess} />
                <UnconsignButton
                    availableAcls={availableAcls}
                    currentUser={this.state.currentUser}
                    pieceOrEditions={pieceOrEditions}
                    handleSuccess={handleSuccess} />
                {this.props.children}
            </div>
        );
    }
});

export default LumenusAclButtonList;
