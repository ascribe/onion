import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import NotificationActions from '../actions/notification_actions';
import NotificationStore from '../stores/notification_store';

import withContext from './context/with_context';
import { currentUserShape } from './prop_types';

import { getLangText } from '../utils/lang';


const { array, bool, object } = React.PropTypes;

const NotificationList = ({ isPiece, notifications, ...props }) => {
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

                    if (pieceOrEdition && notification.notification) {
                        return (
                            <LinkContainer {...props} key={href} to={href}>
                                <MenuItem>
                                    <NotificationListItem
                                        notifications={notification.notification}
                                        pieceOrEdition={pieceOrEdition} />
                                </MenuItem>
                            </LinkContainer>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        );
    } else {
        return null;
    }
};

NotificationList.propTypes = {
    notifications: array.isRequired,
    isPiece: bool
};

const NotificationListItem = ({ notifications, pieceOrEdition }) => (
    <div className="row notification-wrapper">
        <div className="col-xs-4 clear-paddings thumbnail-wrapper">
            <img role="presentation" src={pieceOrEdition.thumbnail.url_safe} />
        </div>
        <div className="col-xs-8 notification-list-item-header">
            <h1>{pieceOrEdition.title}</h1>
            <div className="sub-header">by {pieceOrEdition.artist_name}</div>
            <NotificationAction notifications={notifications} />
        </div>
    </div>
);

NotificationListItem.propTypes = {
    notifications: array.isRequired,
    pieceOrEdition: object.isRequired
};

const NotificationAction = ({ notifications }) => {
    const additionalNotifications = notifications.length > 1 ? (
        <div>
            + {notifications.length - 1} {getLangText('more...')}
        </div>
    ) : null;

    return (
        <div className="notification-action">
            {notifications[0].action_str}
            {additionalNotifications}
        </div>
    );
};

NotificationAction.propTypes = {
    notifications: array.isRequired,
};


const HeaderNotifications = React.createClass({
    propTypes: {
        // Injected through HOCs
        currentUser: currentUserShape.isRequired,
        isLoggedIn: bool.isRequired
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
                    <NotificationList isPiece notifications={pieceListNotifications} />
                    <NotificationList notifications={editionListNotifications} />
                </NavDropdown>
            );
        }
        return null;
    }
});

export default withContext(HeaderNotifications, 'currentUser', 'isLoggedIn');
