'use strict';

import React from 'react';
import MediaPlayer from './ascribe_media/media_player';

import CollapsibleMixin from 'react-bootstrap/lib/CollapsibleMixin';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import PersonalNoteForm from './ascribe_forms/form_note_personal';
import PieceExtraDataForm from './ascribe_forms/form_piece_extradata';

import EditionActions from '../actions/edition_actions';
import AclButtonList from './ascribe_buttons/acl_button_list';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import classNames from 'classnames';

/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        deleteEdition: React.PropTypes.func,
        loadEdition: React.PropTypes.func
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
                        edition={this.props.edition}
                        currentUser={ this.props.currentUser }/>
                    <CollapsibleEditionDetails
                        title="Personal Note"
                        iconName="pencil">
                        <EditionPersonalNote
                            handleSuccess={this.props.loadEdition}
                            edition={this.props.edition}/>
                    </CollapsibleEditionDetails>
                    <CollapsibleEditionDetails
                        title="Further Details">
                        <EditionFurtherDetails
                            handleSuccess={this.props.loadEdition}
                            edition={this.props.edition}/>
                    </CollapsibleEditionDetails>

                    <CollapsibleEditionDetails
                        title="Provenance/Ownership History"
                        show={this.props.edition.ownership_history && this.props.edition.ownership_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.ownership_history} />
                    </CollapsibleEditionDetails>

                    <CollapsibleEditionDetails
                        title="Loan History"
                        show={this.props.edition.loan_history && this.props.edition.loan_history.length > 0}>
                        <EditionDetailHistoryIterator
                            history={this.props.edition.loan_history} />
                    </CollapsibleEditionDetails>

                    <CollapsibleEditionDetails
                        title="SPOOL Details">
                        <EditionDetailProperty
                            label="Artwork ID"
                            value={bitcoinIdValue} />
                        <EditionDetailProperty
                            label="Hash of Artwork, title, etc"
                            value={hashOfArtwork} />
                        <EditionDetailProperty
                            label="Owned by SPOOL address"
                            value={ownerAddress} />
                    </CollapsibleEditionDetails>

                    <CollapsibleEditionDetails
                        title="Delete Actions">
                        <Button
                            bsStyle="danger"
                            onClick={this.props.deleteEdition}>
                                Remove this artwork from your list
                        </Button>
                    </CollapsibleEditionDetails>
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
        edition: React.PropTypes.object,
        currentUser: React.PropTypes.object
    },

    handleSuccess(){
        EditionActions.fetchOne(this.props.edition.id);
    },

    render() {
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="EDITION"
                    value={this.props.edition.edition_number + ' of ' + this.props.edition.num_editions} />
                <EditionDetailProperty label="ID" value={ this.props.edition.bitcoin_id } />
                <EditionDetailProperty label="OWNER" value={ this.props.edition.owner } />
                <br/>
                <Row>
                    <Col md={12}>
                        <AclButtonList
                            className="pull-left"
                            availableAcls={this.props.edition.acl}
                            editions={[this.props.edition]}
                            handleSuccess={this.handleSuccess} />
                    </Col>
                </Row>
                <hr/>
            </div>
        );

    }
});

let CollapsibleEditionDetails = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        show: React.PropTypes.bool,
        iconName: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            show: true
        };
    },

    render() {
        if(this.props.show) {
            return (
                <div className="ascribe-detail-header">
                    <CollapsibleParagraph
                        title={this.props.title}
                        iconName={this.props.iconName}>
                        {this.props.children}
                    </CollapsibleParagraph>
                </div>
            );
        } else {
            return null;
        }
    }
});

const CollapsibleParagraph = React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        iconName: React.PropTypes.string
    },

    mixins: [CollapsibleMixin],

    getCollapsibleDOMNode(){
        return React.findDOMNode(this.refs.panel);
    },

    getCollapsibleDimensionValue(){
        return React.findDOMNode(this.refs.panel).scrollHeight;
    },

    onHandleToggle(e){
        e.preventDefault();
        this.setState({expanded: !this.state.expanded});
    },

    render() {
        let styles = this.getCollapsibleClassSet();
        let text = this.isExpanded() ? '-' : '+';

        let icon = this.props.iconName ? (<Glyphicon style={{fontSize: '.75em'}} glyph={this.props.iconName} />) : null;

        return (
            <div className="ascribe-edition-collapsible-wrapper">
                <div onClick={this.onHandleToggle}>
                    <span>{text} {icon} {this.props.title} </span>
                </div>
                <div ref='panel' className={classNames(styles) + ' ascribe-edition-collapible-content'}>
                    {this.props.children}
                </div>
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
            labelClassName: 'col-xs-5 col-sm-5 col-md-5 col-lg-5',
            valueClassName: 'col-xs-7 col-sm-7 col-md-7 col-lg-7'
        };
    },

    render() {
        return (
            <div className="row ascribe-detail-property">
                <div className="row-same-height">
                    <div className={this.props.labelClassName + ' col-xs-height col-bottom'}>
                        <div>{ this.props.label + this.props.separator}</div>
                    </div>
                    <div className={this.props.valueClassName + ' col-xs-height col-bottom'}>
                        <div>{ this.props.value }</div>
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
            <div>
                {this.props.history.map((historicalEvent, i) => {
                    return (
                        <EditionDetailProperty
                            key={i}
                            label={historicalEvent[0]}
                            value={historicalEvent[1]}
                            labelClassName="col-xs-4 col-sm-4 col-md-4 col-lg-4"
                            valueClassName="col-xs-8 col-sm-8 col-md-8 col-lg-8"
                            separator="" />
                    );
                })}
            </div>
        );
    }
});

let EditionPersonalNote = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },
    showNotification(){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel('Note saved', 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        return (
            <Row>
                <Col md={12} className="ascribe-edition-personal-note">
                    <PersonalNoteForm
                        handleSuccess={this.showNotification}
                        editions={[this.props.edition]} />
                </Col>
            </Row>
        );
    }
});



let EditionFurtherDetails = React.createClass({
    propTypes: {
        edition: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    render() {
        return (
            <Row>
                <Col md={12} className="ascribe-edition-personal-note">
                    <PieceExtraDataForm
                        name='artist_contact_info'
                        title='Artist Contact Info'
                        handleSuccess={this.props.handleSuccess}
                        editions={[this.props.edition]} />
                    <PieceExtraDataForm
                        name='display_instructions'
                        title='Display Instructions'
                        handleSuccess={this.props.handleSuccess}
                        editions={[this.props.edition]} />
                    <PieceExtraDataForm
                        name='technology_details'
                        title='Technology Details'
                        handleSuccess={this.props.handleSuccess}
                        editions={[this.props.edition]} />
                </Col>
            </Row>
        );
    }
});


export default Edition;
