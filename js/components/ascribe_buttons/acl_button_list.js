'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import ConsignButton from './acls/consign_button';
import EmailButton from './acls/email_button';
import LoanButton from './acls/loan_button';
import LoanRequestButton from './acls/loan_request_button';
import TransferButton from './acls/transfer_button';
import UnconsignButton from './acls/unconsign_button';

import { mergeOptions } from '../../utils/general_utils';

let AclButtonList = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        availableAcls: React.PropTypes.object.isRequired,
        buttonsStyle: React.PropTypes.object,
        handleSuccess: React.PropTypes.func.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            {
                buttonListSize: 0
            }
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser.defer();

        window.addEventListener('resize', this.handleResize);
        window.dispatchEvent(new Event('resize'));
    },

    componentDidUpdate(prevProps) {
        if(prevProps.availableAcls && prevProps.availableAcls !== this.props.availableAcls) {
            window.dispatchEvent(new Event('resize'));
        }
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);

        window.removeEventListener('resize', this.handleResize);
    },

    handleResize() {
        this.setState({
            buttonListSize: this.refs.buttonList.getDOMNode().offsetWidth
        });
    },

    onChange(state) {
        this.setState(state);
    },

    renderChildren() {
        const { children } = this.props;
        const { buttonListSize } = this.state;

        return React.Children.map(children, (child) => {
            return React.cloneElement(child, { buttonListSize });
        });
    },

    render() {
        const { className,
                buttonsStyle,
                availableAcls,
                pieceOrEditions,
                handleSuccess } = this.props;

        const { currentUser } = this.state;

        return (
            <div className={className}>
                <span ref="buttonList" style={buttonsStyle}>
                    <EmailButton
                        availableAcls={availableAcls}
                        pieceOrEditions={pieceOrEditions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    <TransferButton
                        availableAcls={availableAcls}
                        pieceOrEditions={pieceOrEditions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess}/>
                    <ConsignButton
                        availableAcls={availableAcls}
                        pieceOrEditions={pieceOrEditions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    <UnconsignButton
                        availableAcls={availableAcls}
                        pieceOrEditions={pieceOrEditions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    <LoanButton
                        availableAcls={availableAcls}
                        pieceOrEditions={pieceOrEditions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    {this.renderChildren()}
                </span>
            </div>
        );
    }
});

export default AclButtonList;
