import React from 'react';

import CollapsibleMixin from 'react-bootstrap/lib/CollapsibleMixin';
import Button from 'react-bootstrap/lib/Button';

import ResourceViewer from './ascribe_media/resource_viewer';

import EditionActions from '../actions/edition_actions'
import AclButtonList from './ascribe_buttons/acl_button_list'

/**
 * This is the component that implements display-specific functionality
 */
let Edition = React.createClass({
    render() {
        let thumbnail = this.props.edition.thumbnail;
        let mimetype = this.props.edition.digital_work.mime;

        return (
            <div>
                <div className="col-sm-6">
                    <ResourceViewer thumbnail={thumbnail}
                                    mimetype={mimetype}
                                    />
                </div>
                <div className="col-sm-6">
                    <EditionHeader edition={this.props.edition}/>
                    <EditionSummary edition={this.props.edition} currentUser={ this.props.currentUser }/>
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

let EditionSummary = React.createClass({
    handleSuccess(){
        EditionActions.fetchOne(this.props.edition.id);
    },
    render() {
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="edition"
                    value={this.props.edition.edition_number + " of " + this.props.edition.num_editions} />
                <EditionDetailProperty label="id" value={ this.props.edition.bitcoin_id } />
                <EditionDetailProperty label="owner" value={ this.props.edition.owner } />
                <br/>
                <AclButtonList
                    availableAcls={this.props.edition.acl}
                    editions={[this.props.edition]}
                    handleSuccess={this.handleSuccess} />
                <hr/>
            </div>
        );

    }
});

let EditionDetails = React.createClass({
    handleSuccess(){
        EditionActions.fetchOne(this.props.edition.id);
    },
    render() {
        return (
            <div className="ascribe-detail-header">
                <CollapsibleParagraph>
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </CollapsibleParagraph>
                <hr/>
            </div>
        );

    }
});

let CollapsibleParagraph = React.createClass({
  mixins: [CollapsibleMixin],

  getCollapsibleDOMNode(){
    return React.findDOMNode(this.refs.panel);
  },

  getCollapsibleDimensionValue(){
    return React.findDOMNode(this.refs.panel).scrollHeight;
  },

  onHandleToggle(e){
    e.preventDefault();
    this.setState({expanded:!this.state.expanded});
  },

  render(){
    let text = this.isExpanded() ? 'Hide' : 'Show';
    return (
      <div>
        <Button onClick={this.onHandleToggle}>{text} Content</Button>
        <div ref='panel'>
          {this.props.children}
        </div>
      </div>
    );
  }
});


let EditionDetailProperty = React.createClass({
    render() {
        return (
            <div className="row ascribe-detail-property">
                <div className="row-same-height">
                    <div className="col-xs-4 col-sm-3 col-xs-height col-bottom">
                        <div>{ this.props.label }:</div>
                    </div>
                    <div className="col-xs-8 col-sm-9 col-xs-height col-bottom">
                        <div>{ this.props.value }</div>
                    </div>
                </div>
            </div>
        );
    }
});


export default Edition;
