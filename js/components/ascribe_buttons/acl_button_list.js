'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import AclButton from '../ascribe_buttons/acl_button';


let AclButtonList = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        editions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        availableAcls: React.PropTypes.object,
        buttonsStyle: React.PropTypes.object,
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
        return (
            <div className={this.props.className}>
                <span style={this.props.buttonsStyle}>
                    <AclButton
                        availableAcls={this.props.availableAcls}
                        action="acl_share"
                        pieceOrEditions={this.props.editions}
                        currentUser={this.state.currentUser}
                        handleSuccess={this.props.handleSuccess} />
                    <AclButton
                        availableAcls={this.props.availableAcls}
                        action="acl_transfer"
                        pieceOrEditions={this.props.editions}
                        currentUser={this.state.currentUser}
                        handleSuccess={this.props.handleSuccess}/>
                    <AclButton
                        availableAcls={this.props.availableAcls}
                        action="acl_consign"
                        pieceOrEditions={this.props.editions}
                        currentUser={this.state.currentUser}
                        handleSuccess={this.props.handleSuccess} />
                    <AclButton
                        availableAcls={this.props.availableAcls}
                        action="acl_unconsign"
                        pieceOrEditions={this.props.editions}
                        currentUser={this.state.currentUser}
                        handleSuccess={this.props.handleSuccess} />
                    <AclButton
                        availableAcls={this.props.availableAcls}
                        action="acl_loan"
                        pieceOrEditions={this.props.editions}
                        currentUser={this.state.currentUser}
                        handleSuccess={this.props.handleSuccess} />
                    {this.props.children}
                </span>
            </div>
        );
    }
});

export default AclButtonList;