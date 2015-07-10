'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import AclButton from '../ascribe_buttons/acl_button';
import DeleteButton from '../ascribe_buttons/delete_button';

let AclButtonList = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        editions: React.PropTypes.array,
        availableAcls: React.PropTypes.array,
        handleSuccess: React.PropTypes.func
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
        return (
            <div className={this.props.className}>
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="transfer"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess}/>
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="consign"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="unconsign"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="loan"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="share"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <DeleteButton editions={this.props.editions}/>
            </div>
        );
    }
});

export default AclButtonList;