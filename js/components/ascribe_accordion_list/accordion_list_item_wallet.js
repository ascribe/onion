'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import AccordionListItemPiece from './accordion_list_item_piece';
import AccordionListItemEditionWidget from './accordion_list_item_edition_widget';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';

import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import WhitelabelStore from '../../stores/whitelabel_store';

import EditionListActions from '../../actions/edition_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AclProxy from '../acl_proxy';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';


let AccordionListItemWallet = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getInitialState() {
        return mergeOptions(
            {
                showCreateEditionsDialog: false
            },
            PieceListStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getGlyphicon(){
        if ((this.props.content.notifications && this.props.content.notifications.length > 0)){
            return (
                <OverlayTrigger
                    delay={500}
                    placement="left"
                    overlay={<Tooltip>{getLangText('You have actions pending')}</Tooltip>}>
                    <Glyphicon glyph='bell' color="green"/>
                </OverlayTrigger>);
        }
        return null;
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
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);
        EditionListActions.toggleEditionList(pieceId);

        let notification = new GlobalNotificationModel('Editions successfully created', 'success', 10000);
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
        // convert this to acl_view_licences later
        if (this.state.whitelabel && this.state.whitelabel.name === 'Creative Commons France') {
            return (
                <span>
                    <span>, </span>
                    <a href={this.props.content.license_type.url} target="_blank">
                        {getLangText('%s license', this.props.content.license_type.code)}
                    </a>
                </span>
            );
        }
    },

    render() {

        return (
            <AccordionListItemPiece
                className={this.props.className}
                piece={this.props.content}
                subsubheading={
                    <div className="pull-left">
                        <span>{this.props.content.date_created.split('-')[0]}</span>
                        {this.getLicences()}
                    </div>}
                buttons={
                    <div>
                        <AclProxy
                            aclObject={this.props.content.acl}
                            aclName="acl_view_editions">
                            <AccordionListItemEditionWidget
                                className="pull-right"
                                piece={this.props.content}
                                toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                onPollingSuccess={this.onPollingSuccess}/>
                        </AclProxy>
                    </div>}
                {this.getCreateEditionsDialog()}
                {/* this.props.children is AccordionListItemTableEditions */}
                {this.props.children}
            />
        );
    }
});

export default AccordionListItemWallet;
