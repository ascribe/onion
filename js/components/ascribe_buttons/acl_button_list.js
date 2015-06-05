'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import AclButton from '../ascribe_buttons/acl_button';

let AclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.array,
        editions: React.PropTypes.array,
        currentUser: React.PropTypes.object,
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
            <div className="text-center">
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="transfer"
                    editions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="consign"
                    editions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="loan"
                    editions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                <AclButton
                    availableAcls={this.props.availableAcls}
                    action="share"
                    editions={this.props.editions}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.props.handleSuccess} />
            </div>
        );
    }
});

export default AclButtonList;