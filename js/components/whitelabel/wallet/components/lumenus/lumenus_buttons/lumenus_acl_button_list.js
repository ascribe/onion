'use strict';

import React from 'react';

import LumenusSubmitButton from './lumenus_submit_button';

import AclButton from '../../../../../ascribe_buttons/acl_button';
import DeleteButton from '../../../../../ascribe_buttons/delete_button';

import UserActions from '../../../../../../actions/user_actions';
import UserStore from '../../../../../../stores/user_store';

let LumenusAclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        editions: React.PropTypes.array,
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
        let { availableAcls, className, editions, handleSuccess } = this.props;
        return (
            <div className={className}>
                <LumenusSubmitButton
                    availableAcls={availableAcls}
                    currentUser={this.state.currentUser}
                    editions={editions}
                    handleSuccess={handleSuccess} />
                <AclButton
                    action="acl_share"
                    availableAcls={availableAcls}
                    currentUser={this.state.currentUser}
                    pieceOrEditions={editions}
                    handleSuccess={handleSuccess} />
                {this.props.children}
            </div>
        );
    }
});

export default LumenusAclButtonList;
