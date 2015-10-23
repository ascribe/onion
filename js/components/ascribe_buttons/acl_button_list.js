'use strict';

import React from 'react/addons';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import AclButton from '../ascribe_buttons/acl_button';

import { mergeOptions } from '../../utils/general_utils';


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
        return mergeOptions(
            UserStore.getState(),
            {
                buttonListSize: 0
            }
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();

        window.addEventListener('resize', this.handleResize);
        window.dispatchEvent(new Event('resize'));
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
            return React.addons.cloneWithProps(child, { buttonListSize });
        });
    },

    render() {
        const { className,
                buttonsStyle,
                availableAcls,
                editions,
                handleSuccess } = this.props;

        const { currentUser } = this.state;

        return (
            <div className={className}>
                <span ref="buttonList" style={buttonsStyle}>
                    <AclButton
                        availableAcls={availableAcls}
                        action="acl_share"
                        pieceOrEditions={editions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    <AclButton
                        availableAcls={availableAcls}
                        action="acl_transfer"
                        pieceOrEditions={editions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess}/>
                    <AclButton
                        availableAcls={availableAcls}
                        action="acl_consign"
                        pieceOrEditions={editions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    <AclButton
                        availableAcls={availableAcls}
                        action="acl_unconsign"
                        pieceOrEditions={editions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    <AclButton
                        availableAcls={availableAcls}
                        action="acl_loan"
                        pieceOrEditions={editions}
                        currentUser={currentUser}
                        handleSuccess={handleSuccess} />
                    {this.renderChildren()}
                </span>
            </div>
        );
    }
});

export default AclButtonList;