import React from 'react';

let TableItemSubtableButton = React.createClass({
    
    propTypes: {
        content: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <span>
                <button type="button" className="btn btn-ascribe btn-primary btn-sm">
                    {this.props.content}
                </button>
            </span>
        );
    }
});

export default TableItemSubtableButton;