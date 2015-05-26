import React from 'react';
import ImageViewer from './ascribe_media/image_viewer';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import OverlayMixin from 'react-bootstrap/lib/OverlayMixin';
import Modal from 'react-bootstrap/lib/Modal';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';

/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    render() {
        var modal = <ShareModal edition={this.props.edition} />;
        return (
            <div>
                {modal}
                <div className="col-md-7">
                    <ImageViewer thumbnail={this.props.edition.thumbnail}/>
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

let ShareModal = React.createClass({
    mixins: [OverlayMixin],

    getInitialState: function() {
        return {
            isOpen: true
        };
    },
    hide: function(){
      this.setState({isOpen: false})
    },
    renderOverlay: function() {
        if (!this.state.isOpen) {
            return <span/>;
        }
    },
    render: function() {
        return (
            <Modal title="Share artwork" onRequestHide={this.hide}>
            </Modal>
        );
    }
});
//let ShareModal = React.createClass({
//    mixins: [OverlayMixin],
//
//    getInitialState: function() {
//        return {
//            isModalOpen: true
//        };
//    },
//    renderOverlay: function() {
//        if (!this.state.isModalOpen) {
//            return <span/>;
//        }
//    },
//    hide: function(){
//        this.setState({isModalOpen: false});
//    },
//    render: function() {
//        var content = "Hi,\n\nI am sharing \"" + this.props.edition.title +
//                    "\" with you.\n\nTruly yours,\n";
//        return (
//            <Modal title="Share artwork" onRequestHide={this.hide}>
//                <div className="modal-body">
//                    <form id="share_modal_content" role="form">
//                        <div className="form-group">
//                            <input className="form-control input-text-ascribe" name="share_emails"
//                                placeholder="Comma separated emails" required="required" type="text" />
//                        </div>
//                        <div className="form-group">
//                            <textarea className="form-control input-text-ascribe" name="share_message"
//                                defaultValue={content}></textarea>
//                        </div>
//                        <div className="modal-footer">
//                            <button type="submit" className="btn btn-ascribe-inv">SHARE</button>
//                            <button className="btn btn-ascribe" onClick={this.hide}>CLOSE</button>
//                        </div>
//                    </form>
//                </div>
//            </Modal>
//        );
//    }
//});

export default Edition;