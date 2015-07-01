'use strict';

import React from 'react';
import Router from 'react-router';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';
import CoaActions from '../actions/coa_actions';
import CoaStore from '../stores/coa_store';

import MediaPlayer from './ascribe_media/media_player';

import CollapsibleParagraph from './ascribe_collapsible/collapsible_paragraph';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputTextAreaToggable from './ascribe_forms/input_textarea_toggable';

import PieceExtraDataForm from './ascribe_forms/form_piece_extradata';
import RequestActionForm from './ascribe_forms/form_request_action';

import EditionActions from '../actions/edition_actions';
import AclButtonList from './ascribe_buttons/acl_button_list';

import fineUploader from 'fineUploader';
import ReactS3FineUploader from './ascribe_uploader/react_s3_fine_uploader';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import apiUrls from '../constants/api_urls';
import AppConstants from '../constants/application_constants';

import { getCookie } from '../utils/fetch_api_utils';

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
        let thumbnail = this.props.edition.thumbnail;
        let mimetype = this.props.edition.digital_work.mime;
        let extraData = null;

        if (this.props.edition.digital_work.encoding_urls) {
            extraData = this.props.edition.digital_work.encoding_urls.map(e => { return { url: e.url, type: e.label }; });
        }

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
            <Row>
                <Col md={6}>
                    <MediaPlayer mimetype={mimetype}
                                    preview={thumbnail}
                                    url={this.props.edition.digital_work.url}
                                    extraData={extraData} />
                    <p className="text-center">
                        <Button bsSize="xsmall" href={this.props.edition.digital_work.url} target="_blank">
                            Download <Glyphicon glyph="cloud-download" />
                        </Button>
                    </p>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <EditionHeader edition={this.props.edition}/>
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
                        title="Further Details"
                        show={this.props.edition.acl.indexOf('edit') > -1
                            || Object.keys(this.props.edition.extra_data).length > 0
                            || this.props.edition.other_data !== null}>
                        <EditionFurtherDetails
                            handleSuccess={this.props.loadEdition}
                            edition={this.props.edition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title="Certificate of Authenticity"
                        show={this.props.edition.acl.indexOf('coa') > -1}>
                        <CoaDetails
                            edition={this.props.edition}/>
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title="Provenance/Ownership History"
                        show={this.props.edition.ownership_history && this.props.edition.ownership_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.ownership_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title="Consignment History"
                        show={this.props.edition.consign_history && this.props.edition.consign_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.consign_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title="Loan History"
                        show={this.props.edition.loan_history && this.props.edition.loan_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.loan_history} />
                    </CollapsibleParagraph>

                    <CollapsibleParagraph
                        title="SPOOL Details">
                        <Form >
                            <Property
                                name='artwork_id'
                                label="Artwork ID"
                                editable={false}>
                                <pre className="ascribe-pre">{bitcoinIdValue}</pre>
                            </Property>
                            <Property
                                name='hash_of_artwork'
                                label="Hash of Artwork, title, etc"
                                editable={false}>
                                <pre className="ascribe-pre">{hashOfArtwork}</pre>
                            </Property>
                            <Property
                                name='owner_address'
                                label="Owned by SPOOL address"
                                editable={false}>
                                <pre className="ascribe-pre">{ownerAddress}</pre>
                            </Property>
                            <hr />
                        </Form>
                    </CollapsibleParagraph>
                </Col>
            </Row>
        );
    }
});

let EditionHeader = React.createClass({
    propTypes: {
        edition: React.PropTypes.object
    },

    render() {
        var titleHtml = <div className="ascribe-detail-title">{this.props.edition.title}</div>;
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="TITLE" value={titleHtml} />
                <EditionDetailProperty label="BY" value={this.props.edition.artist_name} />
                <EditionDetailProperty label="DATE" value={ this.props.edition.date_created.slice(0, 4) } />
                <hr/>
            </div>
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
    render() {
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

        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="EDITION"
                    value={this.props.edition.edition_number + ' of ' + this.props.edition.num_editions} />
                <EditionDetailProperty label="ID" value={ this.props.edition.bitcoin_id } />
                <EditionDetailProperty label="OWNER" value={ this.props.edition.owner } />
                {status}
                <br/>
                {actions}
                <hr/>
            </div>
        );

    }
});


let EditionDetailProperty = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        separator: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        valueClassName: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            separator: ':',
            labelClassName: 'col-xs-5 col-sm-4 col-md-3 col-lg-3',
            valueClassName: 'col-xs-7 col-sm-8 col-md-9 col-lg-9'
        };
    },

    render() {
        let value = this.props.value;
        if (this.props.children){
            value = (
                <div className="row-same-height">
                    <div className="col-xs-6 col-xs-height col-bottom no-padding">
                        { this.props.value }
                    </div>
                    <div className="col-xs-6 col-xs-height">
                        { this.props.children }
                    </div>
                </div>);
        }
        return (
            <div className="row ascribe-detail-property">
                <div className="row-same-height">
                    <div className={this.props.labelClassName + ' col-xs-height col-bottom'}>
                        <div>{ this.props.label + this.props.separator}</div>
                    </div>
                    <div className={this.props.valueClassName + ' col-xs-height col-bottom'}>
                        {value}
                    </div>
                </div>
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
        let notification = new GlobalNotificationModel('Private note saved', 'success');
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
                        label='Personal note (private)'
                        editable={true}>
                        <InputTextAreaToggable
                            rows={3}
                            editable={true}
                            defaultValue={this.props.edition.note_from_user}
                            placeholder='Enter a personal note...'
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
        let notification = new GlobalNotificationModel('Public note saved', 'success');
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
                        label='Edition note (public)'
                        editable={isEditable}>
                        <InputTextAreaToggable
                            rows={3}
                            editable={isEditable}
                            defaultValue={this.props.edition.public_note}
                            placeholder='Enter a public note for this edition...'
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


let EditionFurtherDetails = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    getInitialState() {
        return {
            loading: false
        };
    },

    showNotification(){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel('Details updated', 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    submitKey(key){
        this.setState({
            otherDataKey: key
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    isReadyForFormSubmission(files) {
        files = files.filter((file) => file.status !== 'deleted' && file.status !== 'canceled');
        if(files.length > 0 && files[0].status === 'upload successful') {
            return true;
        } else {
            return false;
        }
    },

    render() {
        let editable = this.props.edition.acl.indexOf('edit') > -1;
        return (
            <Row>
                <Col md={12} className="ascribe-edition-personal-note">
                    <PieceExtraDataForm
                        name='artist_contact_info'
                        title='Artist Contact Info'
                        handleSuccess={this.showNotification}
                        editable={editable}
                        edition={this.props.edition} />
                    <PieceExtraDataForm
                        name='display_instructions'
                        title='Display Instructions'
                        handleSuccess={this.showNotification}
                        editable={editable}
                        edition={this.props.edition} />
                    <PieceExtraDataForm
                        name='technology_details'
                        title='Technology Details'
                        handleSuccess={this.showNotification}
                        editable={editable}
                        edition={this.props.edition} />
                    <FileUploader
                        submitKey={this.submitKey}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={this.isReadyForFormSubmission}
                        editable={editable}
                        edition={this.props.edition}/>
                </Col>
            </Row>
        );
    }
});

let FileUploader = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        setIsUploadReady: React.PropTypes.func,
        submitKey: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func
    },

    render() {
        if (!this.props.editable && this.props.edition.other_data === null){
            return null;
        }
        return (
            <Form>
                <Property
                    label="Additional files">
                    <ReactS3FineUploader
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'otherdata',
                            bitcoinId: this.props.edition.bitcoin_id
                        }}
                        createBlobRoutine={{
                            url: apiUrls.blob_otherdatas,
                            bitcoinId: this.props.edition.bitcoin_id
                        }}
                        validation={{
                            itemLimit: 100000,
                            sizeLimit: '10000000'
                        }}
                        submitKey={this.props.submitKey}
                        setIsUploadReady={this.props.setIsUploadReady}
                        isReadyForFormSubmission={this.props.isReadyForFormSubmission}
                        session={{
                            endpoint: AppConstants.serverUrl + 'api/blob/otherdatas/fineuploader_session/',
                            customHeaders: {
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            params: {
                                'pk': this.props.edition.other_data ? this.props.edition.other_data.id : null
                            }
                        }}
                        areAssetsDownloadable={true}/>
                </Property>
                <hr />
            </Form>
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
                        <button className="btn btn-default btn-xs" href={this.state.coa.url_safe} target="_blank">
                            Download <Glyphicon glyph="cloud-download"/>
                        </button>
                        <Link to="coa_verify">
                            <button className="btn btn-default btn-xs">
                                Verify <Glyphicon glyph="check"/>
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

export default Edition;
