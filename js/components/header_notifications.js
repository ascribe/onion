'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import NotificationActions from '../actions/notification_actions';
import NotificationStore from '../stores/notification_store';

import withContext from './context/with_context';
import { currentUserShape } from './prop_types';

import { getLangText } from '../utils/lang';


let HeaderNotifications = React.createClass({
    propTypes: {
        // Injected through HOCs
        currentUser: currentUserShape.isRequired, // eslint-disable-line react/sort-prop-types
        isLoggedIn: React.PropTypes.bool.isRequired // eslint-disable-line react/sort-prop-types
    },

    getInitialState() {
        return NotificationStore.getState();
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);

        if (this.props.isLoggedIn) {
            this.refreshNotifications();
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser && nextProps.currentUser.email !== this.props.currentUser.email) {
            this.refreshNotifications();
        }
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    refreshNotifications() {
        NotificationActions.fetchPieceListNotifications();
        NotificationActions.fetchEditionListNotifications();
    },

    renderNotifications({ notifications, isPiece }) {
        if (notifications.length) {
            return (
                <div>
                    <div className="notification-header">
                        {`${(isPiece ? 'Artworks' : 'Editions')} (${notifications.length})`}
                    </div>
                    {notifications.map((notification) => {
                        const pieceOrEdition = isPiece ? notification.piece : notification.edition;
                        const href = isPiece ? `/pieces/${pieceOrEdition.id}`
                                             : `/editions/${pieceOrEdition.bitcoin_id}`;

                        return (
                            <LinkContainer key={href} to={href}>
                                <MenuItem>
                                    <NotificationListItem
                                        notification={notification.notification}
                                        pieceOrEdition={pieceOrEdition} />
                                </MenuItem>
                            </LinkContainer>
                        );
                    })}
                </div>
            );
        } else {
            return null;
        }
    },

    render() {
        const { editionListNotifications, pieceListNotifications } = this.state;
        if (pieceListNotifications.length || editionListNotifications.length) {
            let numNotifications = 0;

            if (pieceListNotifications.length) {
                numNotifications += pieceListNotifications.length;
            }
            if (editionListNotifications.length) {
                numNotifications += editionListNotifications.length;
            }

            return (
                <NavDropdown
                    ref="dropdownButton"
                    className="notification-menu"
                    id="header-notification-dropdown"
                    title={
                        <span>
                            <Glyphicon color="green" glyph="envelope" />
                            <span className="notification-amount">({numNotifications})</span>
                        </span>
                    }>
                    {this.renderNotifications({
                        notifications: pieceListNotifications,
                        isPiece: true
                    })}
                    {this.renderNotifications({
                        notifications: editionListNotifications,
                        isPiece: false
                    })}
                </NavDropdown>
            );
        }
        return null;
    }
});

let NotificationListItem = React.createClass({
    propTypes: {
        notification: React.PropTypes.array,
        pieceOrEdition: React.PropTypes.object,
    },

    getNotificationText() {
        let numNotifications = null;
        if (this.props.notification.length > 1) {
            numNotifications = (
                <div>
                    + {this.props.notification.length - 1} {getLangText('more...')}
                </div>
            );
        }
        return (
            <div className="notification-action">
                {this.props.notification[0].action_str}
                {numNotifications}
            </div>);
    },

    render() {
        const { pieceOrEdition } = this.props;

        if (pieceOrEdition) {
            return (
                <div className="row notification-wrapper">
                    <div className="col-xs-4 clear-paddings">
                        <div className="thumbnail-wrapper">
                            <img role="presentation" src={pieceOrEdition.thumbnail.url_safe} />
                        </div>
                    </div>
                    <div className="col-xs-8 notification-list-item-header">
                        <h1>{pieceOrEdition.title}</h1>
                        <div className="sub-header">by {pieceOrEdition.artist_name}</div>
                        {this.getNotificationText()}
                    </div>
                </div>
            );
        }
        return null;
    }
});

export default withContext(HeaderNotifications, 'currentUser', 'isLoggedIn');
