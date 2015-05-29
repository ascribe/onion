import React from 'react';

let AccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object
    },

    render() {
        console.log(this.props.content);
        return (
            <div className={this.props.className}>
                <div className="wrapper">
                    <div className="thumbnail-wrapper">
                        <img src={this.props.content.thumbnail} />
                    </div>
                    <div className="info-wrapper">
                        <h1>{this.props.content.title}</h1>
                        <h3>by {this.props.content.artist_name}</h3>
                    </div>
                </div>
            </div> 
        );
    }
});

export default AccordionListItem;
