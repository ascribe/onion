'use strict';

import React from 'react';

import ConsignButton from './acls/consign_button';
import EmailButton from './acls/email_button';
import LoanButton from './acls/loan_button';
import TransferButton from './acls/transfer_button';
import UnconsignButton from './acls/unconsign_button';

import { selectFromObject } from '../../utils/general';

let AclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        handleSuccess: React.PropTypes.func.isRequired,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,

        buttonsStyle: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        className: React.PropTypes.string
    },

    getInitialState() {
        return {
            buttonListSize: 0
        }
    },

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        window.dispatchEvent(new Event('resize'));
    },

    componentDidUpdate(prevProps) {
        if (prevProps.availableAcls && prevProps.availableAcls !== this.props.availableAcls) {
            window.dispatchEvent(new Event('resize'));
        }
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    handleResize() {
        this.setState({
            buttonListSize: this.refs.buttonList.offsetWidth
        });
    },

    renderChildren() {
        const { children } = this.props;
        const { buttonListSize } = this.state;

        return React.Children.map(children, (child) => {
            return React.cloneElement(child, { buttonListSize });
        });
    },

    render() {
        const { availableAcls,
                buttonsStyle,
                className,
                handleSuccess,
                pieceOrEditions } = this.props;

        const buttonProps = selectFromObject(this.props, [
            'availableAcls',
            'handleSuccess',
            'pieceOrEditions'
        ]);

        return (
            <div className={className}>
                <span ref="buttonList" style={buttonsStyle}>
                    <EmailButton {...buttonProps} />
                    <TransferButton {...buttonProps} />
                    <ConsignButton {...buttonProps} />
                    <UnconsignButton {...buttonProps} />
                    <LoanButton {...buttonProps} />
                    {this.renderChildren()}
                </span>
            </div>
        );
    }
});

export default AclButtonList;
