import React from 'react';
import ResourceViewer from './ascribe_media/resource_viewer';

/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    //propTypes: {
    //    title: React.PropTypes.string.isRequired
    //},

    render() {
        let thumbnail = this.props.edition.thumbnail;
        let mimetype = this.props.edition.digital_work.mime;

        return (
            <div>
                <div className="col-md-7">
                    <ResourceViewer thumbnail={thumbnail}
                                    mimetype={mimetype}
                                    />
                </div>
                <div className="col-md-5">
                    <EditionHeader edition={this.props.edition}/>
                    <EditionDetails edition={this.props.edition}/>
                </div>
            </div>
        );
    }
});

let EditionHeader = React.createClass({
    //propTypes: {
    //    title: React.PropTypes.string.isRequired
    //},

    render() {
        return (
            <div className="ascribe-detail-header">
                <div className="row">
                    <div className="row-same-height">
                        <div className="col-xs-2 col-xs-height col-bottom">
                            <div>TITLE:</div>
                        </div>
                        <div className="col-xs-10 col-xs-height col-bottom">
                            <div className="ascribe-detail-title">{this.props.edition.title}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-2">
                        <div>BY:</div>
                    </div>
                    <div className="col-xs-10">
                        <div>{this.props.edition.artist_name}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-2">
                        <div>DATE:</div>
                    </div>
                    <div className="col-xs-10">
                        <div>{ this.props.edition.date_created.slice(0,4) }</div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
});

let EditionDetails = React.createClass({
    //propTypes: {
    //    title: React.PropTypes.string.isRequired
    //},

    render() {
        return (
            <div className="ascribe-detail-header">
                <div className="row">
                    <div className="col-xs-2">
                        <div>EDITION:</div>
                    </div>
                    <div className="col-xs-10">
                        <div>{ this.props.edition.edition_number } of {this.props.edition.num_editions}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-2">
                        <div>ID:</div>
                    </div>
                    <div className="col-xs-10">
                        <div>{ this.props.edition.bitcoin_id }</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-2">
                        <div>OWNER:</div>
                    </div>
                    <div className="col-xs-10">
                        <div>{ this.props.edition.owner }</div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
});


export default Edition;
