'use strict';

import React from 'react';
import Router from 'react-router';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';
import CoaActions from '../../actions/coa_actions';
import CoaStore from '../../stores/coa_store';

import MediaContainer from './media_container';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';
import EditionDetailProperty from './detail_property';
import InputTextAreaToggable from './../ascribe_forms/input_textarea_toggable';

import EditionHeader from './header';
import EditionFurtherDetails from './further_details';

//import PieceExtraDataForm from './../ascribe_forms/form_piece_extradata';
import RequestActionForm from './../ascribe_forms/form_request_action';
import EditionActions from '../../actions/edition_actions';
import AclButtonList from './../ascribe_buttons/acl_button_list';

//import ReactS3FineUploader from './../ascribe_uploader/react_s3_fine_uploader';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import apiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';

let Link = Router.Link;
/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        loadEdition: React.PropTypes.func
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
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={this.props.edition}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <EditionHeader content={this.props.edition}/>
                    <EditionSummary
                        currentUser={this.state.currentUser}
                        edition={this.props.edition} />

                    <CollapsibleParagraph
                        title="Notes"
                        show={(this.state.currentUser.username && true || false) ||
                                (this.props.edition.acl.indexOf('edit') > -1 || this.props.edition.public_note)}>
                        <EditionPersonalNote
                            currentUser={this.state.currentUser}
                            handleSuccess={this.props.loadEdition}
                            edition={this.props.edition}/>
                        <EditionPublicEditionNote
                            handleSuccess={this.props.loadEdition}
                            edition={this.props.edition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        show={this.props.edition.acl.indexOf('edit') > -1
                            || Object.keys(this.props.edition.extra_data).length > 0
                            || this.props.edition.other_data !== null}>
                        <EditionFurtherDetails
                            editable={this.props.edition.acl.indexOf('edit') > -1}
                            pieceId={this.props.edition.parent}
                            extraData={this.props.edition.extra_data}
                            otherData={this.props.edition.other_data}
                            handleSuccess={this.props.loadEdition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Certificate of Authenticity')}
                        show={this.props.edition.acl.indexOf('coa') > -1}>
                        <CoaDetails
                            edition={this.props.edition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Provenance/Ownership History')}
                        show={this.props.edition.ownership_history && this.props.edition.ownership_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.ownership_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Consignment History')}
                        show={this.props.edition.consign_history && this.props.edition.consign_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.consign_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={this.props.edition.loan_history && this.props.edition.loan_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.loan_history} />
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
        edition: React.PropTypes.object
    },

    getTransferWithdrawData(){
        return {'bitcoin_id': this.props.edition.bitcoin_id};
    },
    handleSuccess(){
        EditionActions.fetchOne(this.props.edition.id);
    },
    showNotification(response){
        this.handleSuccess();
        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    getStatus(){
        let status = null;
        if (this.props.edition.status.length > 0){
            let statusStr = this.props.edition.status.join().replace(/_/, ' ');
            status = <EditionDetailProperty label="STATUS" value={ statusStr }/>;
            if (this.props.edition.pending_new_owner && this.props.edition.acl.indexOf('withdraw_transfer') > -1){
                status = (
                    <Form
                        url={apiUrls.ownership_transfers_withdraw}
                        getFormData={this.getTransferWithdrawData}
                        handleSuccess={this.showNotification}>
                        <EditionDetailProperty label="STATUS" value={ statusStr }>
                            <button
                                type="submit"
                                className="pull-right btn btn-default btn-sm">
                                WITHDRAW
                            </button>
                        </EditionDetailProperty>
                    </Form>
                );
            }
        }
        return status;
    },
    getActions(){
        let actions = null;
        if (this.props.edition.request_action && this.props.edition.request_action.length > 0){
            actions = (
                <RequestActionForm
                    editions={ [this.props.edition] }
                    handleSuccess={this.showNotification}/>);
        }
        else {
            actions = (
                <Row>
                    <Col md={12}>
                        <AclButtonList
                            className="text-center ascribe-button-list"
                            availableAcls={this.props.edition.acl}
                            editions={[this.props.edition]}
                            handleSuccess={this.handleSuccess} />
                    </Col>
                </Row>);
        }
        return actions;
    },
    render() {
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label={getLangText('EDITION')}
                    value={this.props.edition.edition_number + ' ' + getLangText('of') + ' ' + this.props.edition.num_editions} />
                <EditionDetailProperty label={getLangText('ID')} value={ this.props.edition.bitcoin_id } />
                <EditionDetailProperty label={getLangText('OWNER')} value={ this.props.edition.owner } />
                {this.getStatus()}
                <br/>
                {this.getActions()}
                <hr/>
            </div>
        );

    }
});


let EditionDetailHistoryIterator = React.createClass({
    propTypes: {
        history: React.PropTypes.array
    },

    render() {
        return (
            <Form>
                {this.props.history.map((historicalEvent, i) => {
                    return (
                        <Property
                                name={i}
                                key={i}
                                label={ historicalEvent[0] }
                                editable={false}>
                            <pre className="ascribe-pre">{ historicalEvent[1] }</pre>
                        </Property>
                    );
                })}
                <hr />
            </Form>
        );
    }
});

let EditionPersonalNote = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },
    showNotification(){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel(getLangText('Private note saved'), 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        if (this.props.currentUser.username && true || false) {
            return (
                <Form
                    url={apiUrls.note_notes}
                    handleSuccess={this.showNotification}>
                    <Property
                        name='note'
                        label={getLangText('Personal note (private)')}
                        editable={true}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={true}
                            defaultValue={this.props.edition.note_from_user}
                            placeholder={getLangText('Enter a personal note%s', '...')}
                            required/>
                    </Property>
                    <Property hidden={true} name='bitcoin_id'>
                        <input defaultValue={this.props.edition.bitcoin_id}/>
                    </Property>
                    <hr />
                </Form>
            );
        }
        return null;
    }
});

let EditionPublicEditionNote = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },
    showNotification(){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel(getLangText('Public note saved'), 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        let isEditable = this.props.edition.acl.indexOf('edit') > -1;
        if (this.props.edition.acl.indexOf('edit') > -1 || this.props.edition.public_note){
            return (
                <Form
                    url={apiUrls.note_edition}
                    handleSuccess={this.showNotification}>
                    <Property
                        name='note'
                        label={getLangText('Edition note (public)')}
                        editable={isEditable}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={isEditable}
                            defaultValue={this.props.edition.public_note}
                            placeholder={getLangText('Enter a public note for this edition%', '...')}
                            required/>
                    </Property>
                    <Property hidden={true} name='bitcoin_id'>
                        <input defaultValue={this.props.edition.bitcoin_id}/>
                    </Property>
                    <hr />
                </Form>
            );
        }
        return null;
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
        CoaStore.listen(this.onChange);
        if (this.props.edition.coa) {
            CoaActions.fetchOne(this.props.edition.coa);
        }
        else{
            console.log('create coa');
            CoaActions.create(this.props.edition);
        }
    },

    componentWillUnmount() {
        CoaStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        if (this.state.coa.url_safe) {
            return (
                <div>
                    <p className="text-center ascribe-button-list">
                        <a href={this.state.coa.url_safe} target="_blank">
                            <button className="btn btn-default btn-xs">
                                {getLangText('Download')} <Glyphicon glyph="cloud-download"/>
                            </button>
                        </a>
                        <Link to="coa_verify">
                            <button className="btn btn-default btn-xs">
                                {getLangText('Verify')} <Glyphicon glyph="check"/>
                            </button>
                        </Link>

                    </p>
                </div>
            );
        }
        return (
            <div className="text-center">
                <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
            </div>);

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
