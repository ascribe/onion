'use strict';

import React from 'react';
import { Link, History } from 'react-router';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';
import CoaActions from '../../actions/coa_actions';
import CoaStore from '../../stores/coa_store';
import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';
import EditionListActions from '../../actions/edition_list_actions';

import HistoryIterator from './history_iterator';

import MediaContainer from './media_container';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';
import EditionDetailProperty from './detail_property';
import LicenseDetail from './license_detail';
import EditionFurtherDetails from './further_details';

import ListRequestActions from './../ascribe_forms/list_form_request_actions';
import AclButtonList from './../ascribe_buttons/acl_button_list';
import UnConsignRequestButton from './../ascribe_buttons/unconsign_request_button';
import DeleteButton from '../ascribe_buttons/delete_button';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Note from './note';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';


/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        loadEdition: React.PropTypes.func
    },

    mixins: [History],

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        // Flushing the coa state is essential to not displaying the same
        // data to the user while he's on another edition
        //
        // BUGFIX: Previously we had this line in the componentWillUnmount of
        // CoaDetails, but since we're reloading the edition after performing an ACL action
        // on it, this resulted in multiple events occupying the dispatcher, which eventually
        // resulted in crashing the app.
        CoaActions.flushCoa();

        UserStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleDeleteSuccess(response) {
        this.refreshCollection();

        EditionListActions.closeAllEditionLists();
        EditionListActions.clearAllEditionSelections();

        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.history.pushState(null, '/pieces');
    },

    refreshCollection() {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);
        EditionListActions.refreshEditionList({pieceId: this.props.edition.parent});
    },

    render() {
        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={this.props.edition}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <div className="ascribe-detail-header">
                        <hr/>
                        <h1 className="ascribe-detail-title">{this.props.edition.title}</h1>
                        <EditionDetailProperty label="BY" value={this.props.edition.artist_name} />
                        <EditionDetailProperty label="DATE" value={ this.props.edition.date_created.slice(0, 4) } />
                        <hr/>
                    </div>
                    <EditionSummary
                        handleSuccess={this.props.loadEdition}
                        refreshCollection={this.refreshCollection}
                        currentUser={this.state.currentUser}
                        edition={this.props.edition}
                        handleDeleteSuccess={this.handleDeleteSuccess}/>

                    <CollapsibleParagraph
                        title={getLangText('Certificate of Authenticity')}
                        show={this.props.edition.acl.acl_coa === true}>
                        <CoaDetails
                            edition={this.props.edition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Provenance/Ownership History')}
                        show={this.props.edition.ownership_history && this.props.edition.ownership_history.length > 0}>
                        <HistoryIterator
                            history={this.props.edition.ownership_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Consignment History')}
                        show={this.props.edition.consign_history && this.props.edition.consign_history.length > 0}>
                        <HistoryIterator
                            history={this.props.edition.consign_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={this.props.edition.loan_history && this.props.edition.loan_history.length > 0}>
                        <HistoryIterator
                            history={this.props.edition.loan_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title="Notes"
                        show={!!(this.state.currentUser.username
                                || this.props.edition.acl.acl_edit
                                || this.props.edition.public_note)}>
                        <Note
                            id={() => {return {'bitcoin_id': this.props.edition.bitcoin_id}; }}
                            label={getLangText('Personal note (private)')}
                            defaultValue={this.props.edition.private_note ? this.props.edition.private_note : null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={true}
                            successMessage={getLangText('Private note saved')}
                            url={ApiUrls.note_private_edition}
                            currentUser={this.state.currentUser}/>
                        <Note
                            id={() => {return {'bitcoin_id': this.props.edition.bitcoin_id}; }}
                            label={getLangText('Edition note (public)')}
                            defaultValue={this.props.edition.public_note ? this.props.edition.public_note : null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={!!this.props.edition.acl.acl_edit}
                            show={!!this.props.edition.public_note || !!this.props.edition.acl.acl_edit}
                            successMessage={getLangText('Public edition note saved')}
                            url={ApiUrls.note_public_edition}
                            currentUser={this.state.currentUser}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        show={this.props.edition.acl.acl_edit
                            || Object.keys(this.props.edition.extra_data).length > 0
                            || this.props.edition.other_data.length > 0}>
                        <EditionFurtherDetails
                            editable={this.props.edition.acl.acl_edit}
                            pieceId={this.props.edition.parent}
                            extraData={this.props.edition.extra_data}
                            otherData={this.props.edition.other_data}
                            handleSuccess={this.props.loadEdition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('SPOOL Details')}>
                        <SpoolDetails
                            edition={this.props.edition} />
                    </CollapsibleParagraph>
                </Col>
            </Row>
        );
    }
});


let EditionSummary = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        currentUser: React.PropTypes.object,
        handleDeleteSuccess: React.PropTypes.func,
        refreshCollection: React.PropTypes.func
    },

    getTransferWithdrawData(){
        return {'bitcoin_id': this.props.edition.bitcoin_id};
    },

    handleSuccess() {
        this.props.refreshCollection();
        this.props.handleSuccess();
    },

    showNotification(response){
        this.props.handleSuccess();

        if (response){
            let notification = new GlobalNotificationModel(response.notification, 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },
    getStatus(){
        let status = null;
        if (this.props.edition.status.length > 0){
            let statusStr = this.props.edition.status.join().replace(/_/, ' ');
            status = <EditionDetailProperty label="STATUS" value={ statusStr }/>;
            if (this.props.edition.pending_new_owner && this.props.edition.acl.acl_withdraw_transfer){
                status = (
                    <EditionDetailProperty label="STATUS" value={ statusStr } />
                );
            }
        }
        return status;
    },

    getActions(){
        let actions = null;
        if (this.props.edition &&
            this.props.edition.notifications &&
            this.props.edition.notifications.length > 0){
            actions = (
                <ListRequestActions
                    pieceOrEditions={[this.props.edition]}
                    currentUser={this.props.currentUser}
                    handleSuccess={this.showNotification}
                    notifications={this.props.edition.notifications}/>);
        }

        else {
            let withdrawButton = null;
            if (this.props.edition.status.length > 0 && this.props.edition.pending_new_owner && this.props.edition.acl.acl_withdraw_transfer) {
                withdrawButton = (
                    <Form
                        url={ApiUrls.ownership_transfers_withdraw}
                        getFormData={this.getTransferWithdrawData}
                        handleSuccess={this.showNotification}
                        className='inline'
                        isInline={true}>
                        <Button bsStyle="danger" className="btn-delete pull-center" bsSize="small" type="submit">
                            WITHDRAW TRANSFER
                        </Button>
                    </Form>
                );
            }
            let unconsignRequestButton = null;
            if (this.props.edition.acl.acl_request_unconsign) {
                unconsignRequestButton = (
                    <UnConsignRequestButton
                        currentUser={this.props.currentUser}
                        edition={this.props.edition}
                        handleSuccess={this.props.handleSuccess} />
                    );
            }
            actions = (
                <Row>
                    <Col md={12}>
                        <AclButtonList
                            className="text-center ascribe-button-list"
                            availableAcls={this.props.edition.acl}
                            editions={[this.props.edition]}
                            handleSuccess={this.handleSuccess}>
                            {withdrawButton}
                            <DeleteButton
                                handleSuccess={this.props.handleDeleteSuccess}
                                editions={[this.props.edition]}/>
                            {unconsignRequestButton}
                        </AclButtonList>
                    </Col>
                </Row>);
        }
        return actions;
    },
    render() {
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty
                    label={getLangText('EDITION')}
                    value={this.props.edition.edition_number + ' ' + getLangText('of') + ' ' + this.props.edition.num_editions} />
                <EditionDetailProperty
                    label={getLangText('ID')}
                    value={ this.props.edition.bitcoin_id }
                    ellipsis={true} />
                <EditionDetailProperty
                    label={getLangText('OWNER')}
                    value={ this.props.edition.owner } />
                <LicenseDetail license={this.props.edition.license_type}/>
                {this.getStatus()}
                {this.getActions()}
                <hr/>
            </div>
        );
    }
});


let CoaDetails = React.createClass({
    propTypes: {
        edition: React.PropTypes.object
    },

    getInitialState() {
        return CoaStore.getState();
    },

    componentDidMount() {
        let { edition } = this.props;
        CoaStore.listen(this.onChange);
        if(edition.coa) {
            CoaActions.fetchOrCreate(edition.coa, edition.bitcoin_id);
        }
        else {
            CoaActions.create(edition.bitcoin_id);
        }
    },

    componentWillUnmount() {
        CoaStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        if(this.state.coa && this.state.coa.url_safe) {
            return (
                <div>
                    <p className="text-center ascribe-button-list">
                        <a href={this.state.coa.url_safe} target="_blank">
                            <button className="btn btn-default btn-xs">
                                {getLangText('Download')} <Glyphicon glyph="cloud-download"/>
                            </button>
                        </a>
                        <Link to="/coa_verify">
                            <button className="btn btn-default btn-xs">
                                {getLangText('Verify')} <Glyphicon glyph="check"/>
                            </button>
                        </Link>

                    </p>
                </div>
            );
        } else if(typeof this.state.coa === 'string'){
            return (
                <div className="text-center">
                    {this.state.coa}
                </div>
            );
        }
        return (
            <div className="text-center">
                <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
            </div>
        );
    }
});

let SpoolDetails = React.createClass({
    propTypes: {
        edition: React.PropTypes.object
    },

    render() {
        let bitcoinIdValue = (
            <a target="_blank" href={'https://www.blocktrail.com/BTC/address/' + this.props.edition.bitcoin_id}>{this.props.edition.bitcoin_id}</a>
        );

        let hashOfArtwork = (
            <a target="_blank" href={'https://www.blocktrail.com/BTC/address/' + this.props.edition.hash_as_address}>{this.props.edition.hash_as_address}</a>
        );

        let ownerAddress = (
            <a target="_blank" href={'https://www.blocktrail.com/BTC/address/' + this.props.edition.btc_owner_address_noprefix}>{this.props.edition.btc_owner_address_noprefix}</a>
        );

        return (
            <Form >
                <Property
                    name='artwork_id'
                    label={getLangText('Artwork ID')}
                    editable={false}>
                    <pre className="ascribe-pre">{bitcoinIdValue}</pre>
                </Property>
                <Property
                    name='hash_of_artwork'
                    label={getLangText('Hash of Artwork, title, etc')}
                    editable={false}>
                    <pre className="ascribe-pre">{hashOfArtwork}</pre>
                </Property>
                <Property
                    name='owner_address'
                    label={getLangText('Owned by SPOOL address')}
                    editable={false}>
                    <pre className="ascribe-pre">{ownerAddress}</pre>
                </Property>
                <hr />
            </Form>);

    }
});
export default Edition;
