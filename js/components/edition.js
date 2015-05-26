import React from 'react';
import ImageViewer from './ascribe_media/image_viewer';

/**
 * This is the component that implements display-specific functionality
 */
let Piece = React.createClass({
    //propTypes: {
    //    title: React.PropTypes.string.isRequired
    //},

    render() {
        return (
            <div>
                <div className="col-md-7">
                    <ImageViewer thumbnail={this.props.piece.thumbnail}/>
                </div>
                <div className="col-md-5">
                    <PieceHeader piece={this.props.piece}/>
                    <PieceEdition piece={this.props.piece}/>
                </div>
            </div>
        );
    }
});

let PieceHeader = React.createClass({
    //propTypes: {
    //    title: React.PropTypes.string.isRequired
    //},

    render() {
        return (
            <div className="ascribe-detail-header">
                <div className="row">
                    <div className="row-same-height">
                        <div className="col-md-2 col-xs-height col-bottom">
                            <div>TITLE:</div>
                        </div>
                        <div className="col-md-10 col-xs-height col-bottom">
                            <div className="ascribe-detail-title">{this.props.piece.title}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <div>BY:</div>
                    </div>
                    <div className="col-md-10">
                        <div>{this.props.piece.artist_name}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <div>DATE:</div>
                    </div>
                    <div className="col-md-10">
                        <div>{ this.props.piece.date_created.slice(0,4) }</div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
});

let PieceEdition = React.createClass({
    //propTypes: {
    //    title: React.PropTypes.string.isRequired
    //},

    render() {
        return (
            <div className="ascribe-detail-header">
                <div className="row">
                    <div className="col-md-2">
                        <div>EDITION:</div>
                    </div>
                    <div className="col-md-10">
                        <div>{ this.props.piece.edition_number } of {this.props.piece.num_editions}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <div>ID:</div>
                    </div>
                    <div className="col-md-10">
                        <div>{ this.props.piece.bitcoin_id }</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <div>OWNER:</div>
                    </div>
                    <div className="col-md-10">
                        <div>{ this.props.piece.owner }</div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
});


export default Piece;