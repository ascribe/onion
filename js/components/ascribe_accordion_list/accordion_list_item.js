import React from 'react';

import AccordionListItemTable from './accordion_list_item_table';


let AccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object
    },

    render() {
        return (
            <div className="row">
                <div className={this.props.className}>
                    <div className="wrapper">
                        <div className="thumbnail-wrapper">
                            <img src={this.props.content.thumbnail} />
                        </div>
                        <div className="info-wrapper">
                            <h1>{this.props.content.title}</h1>
                            <h3>by {this.props.content.artist_name}</h3>
                        </div>
                        <span style={{'clear': 'both'}}></span>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
});

export default AccordionListItem;
