'use strict';

import React from 'react';
import { Link, History } from 'react-router';
import Moment from 'moment';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import HistoryIterator from './history_iterator';

import MediaContainer from './media_container';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';
import EditionDetailProperty from './detail_property';
import LicenseDetail from './license_detail';
import FurtherDetails from './further_details';

import EditionActionPanel from './edition_action_panel';
import AclProxy from '../acl_proxy';

import Note from './note';

import ApiUrls from '../../constants/api_urls';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';


/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    propTypes: {
        actionPanelButtonListType: React.PropTypes.func,
        furtherDetailsType: React.PropTypes.func,
        edition: React.PropTypes.object,
        coaError: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        loadEdition: React.PropTypes.func
    },

    mixins: [History],

    getDefaultProps() {
        return {
            furtherDetailsType: FurtherDetails
        };
    },

    render() {
        let FurtherDetailsType = this.props.furtherDetailsType;

        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={this.props.edition}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <div className="ascribe-detail-header">
                        <hr style={{marginTop: 0}}/>
                        <h1 className="ascribe-detail-title">{this.props.edition.title}</h1>
                        <EditionDetailProperty label="BY" value={this.props.edition.artist_name} />
                        <EditionDetailProperty label="DATE" value={Moment(this.props.edition.date_created, 'YYYY-MM-DD').year()} />
                        <hr/>
                    </div>
                    <EditionSummary
                        actionPanelButtonListType={this.props.actionPanelButtonListType}
                        edition={this.props.edition}
                        currentUser={this.props.currentUser}
                        handleSuccess={this.props.loadEdition}/>
                    <CollapsibleParagraph
                        title={getLangText('Certificate of Authenticity')}
                        show={this.props.edition.acl.acl_coa === true}>
                        <CoaDetails
                            coa={this.props.edition.coa}
                            coaError={this.props.coaError}
                            editionId={this.props.edition.bitcoin_id}/>
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
                        show={!!(this.props.currentUser.username
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
                            currentUser={this.props.currentUser}/>
                        <Note
                            id={() => {return {'bitcoin_id': this.props.edition.bitcoin_id}; }}
                            label={getLangText('Personal note (public)')}
                            defaultValue={this.props.edition.public_note ? this.props.edition.public_note : null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={!!this.props.edition.acl.acl_edit}
                            show={!!this.props.edition.public_note || !!this.props.edition.acl.acl_edit}
                            successMessage={getLangText('Public edition note saved')}
                            url={ApiUrls.note_public_edition}
                            currentUser={this.props.currentUser}/>
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        show={this.props.edition.acl.acl_edit
                            || Object.keys(this.props.edition.extra_data).length > 0
                            || this.props.edition.other_data.length > 0}>
                        <FurtherDetailsType
                            editable={this.props.edition.acl.acl_edit}
                            pieceId={this.props.edition.parent}
                            extraData={this.props.edition.extra_data}
                            otherData={this.props.edition.other_data}
                            handleSuccess={this.props.loadEdition} />
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
        actionPanelButtonListType: React.PropTypes.func,
        edition: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    handleSuccess() {
        this.props.handleSuccess();
    },

    getStatus(){
        let status = null;
        if (this.props.edition.status.length > 0){
            let statusStr = this.props.edition.status.join(', ').replace(/_/g, ' ');
            status = <EditionDetailProperty label="STATUS" value={ statusStr }/>;
            if (this.props.edition.pending_new_owner && this.props.edition.acl.acl_withdraw_transfer){
                status = (
                    <EditionDetailProperty label="STATUS" value={ statusStr } />
                );
            }
        }
        return status;
    },

    render() {
        let { actionPanelButtonListType, edition, currentUser } = this.props;
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty
                    label={getLangText('EDITION')}
                    value={ edition.edition_number + ' ' + getLangText('of') + ' ' + edition.num_editions} />
                <EditionDetailProperty
                    label={getLangText('ID')}
                    value={ edition.bitcoin_id }
                    ellipsis={true} />
                <EditionDetailProperty
                    label={getLangText('OWNER')}
                    value={ edition.owner } />
                <LicenseDetail license={edition.license_type}/>
                {this.getStatus()}
                {/*
                    `acl_view` is always available in `edition.acl`, therefore if it has
                    no more than 1 key, we're hiding the `DetailProperty` actions as otherwise
                    `AclInformation` would show up
                */}
                <AclProxy show={currentUser && currentUser.email && Object.keys(edition.acl).length > 1}>
                    <EditionDetailProperty
                        label={getLangText('ACTIONS')}>
                        <EditionActionPanel
                            actionPanelButtonListType={actionPanelButtonListType}
                            edition={edition}
                            currentUser={currentUser}
                            handleSuccess={this.handleSuccess} />
                    </EditionDetailProperty>
                </AclProxy>
                <hr/>
            </div>
        );
    }
});


let CoaDetails = React.createClass({
    propTypes: {
        editionId: React.PropTypes.string,
        coa: React.PropTypes.object,
        coaError: React.PropTypes.object
    },

    contactOnIntercom() {
        window.Intercom('showNewMessage', `Hi, I'm having problems generating a Certificate of Authenticity for Edition: ${this.props.editionId}`);
        console.logGlobal(new Error(`Coa couldn't be created for edition: ${this.props.editionId}`));
    },

    render() {
        if(this.props.coaError) {
            return (
                <div className="text-center">
                    <p>{getLangText('There was an error generating your Certificate of Authenticity.')}</p>
                    <p>
                        {getLangText('Try to refresh the page. If this happens repeatedly, please ')}
                        <a style={{ cursor: 'pointer' }} onClick={this.contactOnIntercom}>{getLangText('contact us')}</a>.
                    </p>
                </div>
            );
        }
        if(this.props.coa && this.props.coa.url_safe) {
            return (
                <div>
                    <p className="text-center ascribe-button-list">
                        <a href={this.props.coa.url_safe} target="_blank">
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
        } else if(typeof this.props.coa === 'string'){
            return (
                <div className="text-center">
                    {this.props.coa}
                </div>
            );
        }
        return (
            <div className="text-center">
                <AscribeSpinner color='dark-blue' size='lg'/>
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
