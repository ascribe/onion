'use strict';

import React from 'react';
import Moment from 'moment';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import EditionListActions from '../../actions/edition_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import AccordionListItemPiece from './accordion_list_item_piece';
import AccordionListItemEditionWidget from './accordion_list_item_edition_widget';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';

import AclProxy from '../acl_proxy';
import withContext from '../context/with_context';
import { whitelabelShape } from '../prop_types';

import { safeMerge } from '../../utils/general';
import { getLangText } from '../../utils/lang';


let AccordionListItemWallet = React.createClass({
    propTypes: {
        content: React.PropTypes.object.isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        className: React.PropTypes.string,
        thumbnailPlaceholder: React.PropTypes.func,

        // Injected through HOCs
        whitelabel: whitelabelShape.isRequired // eslint-disable-line react/sort-prop-types
    },

    getInitialState() {
        return safeMerge(
            PieceListStore.getState(),
            {
                showCreateEditionsDialog: false
            }
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getGlyphicon() {
        if (this.props.content.notifications && this.props.content.notifications.length) {
            return (
                <OverlayTrigger
                    delay={500}
                    placement="left"
                    overlay={<Tooltip>{getLangText('You have actions pending')}</Tooltip>}>
                    <Glyphicon glyph='bell' color="green" />
                </OverlayTrigger>
            );
        } else {
            return null;
        }
    },

    toggleCreateEditionsDialog() {
        this.setState({
            showCreateEditionsDialog: !this.state.showCreateEditionsDialog
        });
    },

    handleEditionCreationSuccess() {
        PieceListActions.updatePropertyForPiece({pieceId: this.props.content.id, key: 'num_editions', value: 0});

        this.toggleCreateEditionsDialog();
    },

    onPollingSuccess(pieceId) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
        EditionListActions.toggleEditionList(pieceId);

        const notification = new GlobalNotificationModel(getLangText('Editions successfully created'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getCreateEditionsDialog() {
        if (this.props.content.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div
                    className="ascribe-accordion-list-item-table col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                    <CreateEditionsForm
                        pieceId={this.props.content.id}
                        handleSuccess={this.handleEditionCreationSuccess}/>
                </div>
            );
        }
    },

    getLicences() {
        const { content, whitelabel } = this.props;

        // convert this to acl_view_licences later
        if (whitelabel.name === 'Creative Commons France') {
            return (
                <span>
                    <span>, </span>
                    <a href={content.license_type.url} target="_blank">
                        {getLangText('%s license', content.license_type.code)}
                    </a>
                </span>
            );
        }
    },

    render() {
        const { children, className, content, thumbnailPlaceholder } = this.props;

        return (
            <AccordionListItemPiece
                className={className}
                piece={content}
                subsubheading={
                    <div className="pull-left">
                        <span>{Moment(content.date_created, 'YYYY-MM-DD').year()}</span>
                        {this.getLicences()}
                    </div>
                }
                buttons={
                    <div>
                        <AclProxy
                            aclObject={content.acl}
                            aclName="acl_view_editions">
                            <AccordionListItemEditionWidget
                                className="pull-right"
                                piece={content}
                                toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                onPollingSuccess={this.onPollingSuccess}/>
                        </AclProxy>
                    </div>
                }
                badge={this.getGlyphicon()}
                thumbnailPlaceholder={thumbnailPlaceholder}>
                {this.getCreateEditionsDialog()}
                {/* this.props.children is AccordionListItemTableEditions */}
                {children}
            </AccordionListItemPiece>
        );
    }
});

export default withContext(AccordionListItemWallet, 'whitelabel');
