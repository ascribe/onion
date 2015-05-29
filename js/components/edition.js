import React from 'react';

import ImageViewer from './ascribe_media/image_viewer';
import ConsignModalButton from './ascribe_modal/modal_consign';
import UnConsignModalButton from './ascribe_modal/modal_unconsign';
import UnConsignRequestModalButton from './ascribe_modal/modal_unconsign_request';
import TransferModalButton from './ascribe_modal/modal_transfer';
import ShareModalButton from './ascribe_modal/modal_share';

/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    render() {
        return (
            <div>
                <div className="col-md-7">
                    <ImageViewer thumbnail={this.props.edition.thumbnail}/>
                </div>
                <div className="col-md-5">
                    <EditionHeader edition={this.props.edition}/>
                    <EditionDetails edition={this.props.edition} currentUser={ this.props.currentUser }/>
                </div>

            </div>
        );
    }
});

let EditionHeader = React.createClass({
    render() {
        var title_html = <div className="ascribe-detail-title">{this.props.edition.title}</div>;
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="title" value={title_html} />
                <EditionDetailProperty label="by" value={this.props.edition.artist_name} />
                <EditionDetailProperty label="date" value={ this.props.edition.date_created.slice(0,4) } />
                <hr/>
            </div>
        );
    }
});

let EditionDetails = React.createClass({
    render() {
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="edition"
                    value={this.props.edition.edition_number + " of " + this.props.edition.num_editions} />
                <EditionDetailProperty label="id" value={ this.props.edition.bitcoin_id } />
                <EditionDetailProperty label="owner" value={ this.props.edition.owner } />
                <br/>
                <ConsignModalButton edition={ this.props.edition } currentUser={ this.props.currentUser }/>
                <UnConsignModalButton edition={ this.props.edition } currentUser={ this.props.currentUser }/>
                <UnConsignRequestModalButton edition={ this.props.edition } currentUser={ this.props.currentUser }/>
                <TransferModalButton edition={ this.props.edition } currentUser={ this.props.currentUser }/>
                <ShareModalButton edition={ this.props.edition } currentUser={ this.props.currentUser }/>
                <hr/>
            </div>
        );

    }
});

let EditionDetailProperty = React.createClass({
    render() {
        return (
            <div className="row ascribe-detail-property">
                <div className="row-same-height">
                    <div className="col-xs-2 col-xs-height col-bottom">
                        <div>{ this.props.label }:</div>
                    </div>
                    <div className="col-xs-10 col-xs-height col-bottom">
                        <div>{ this.props.value }</div>
                    </div>
                </div>
            </div>
        );
    }
});


export default Edition;

