'use strict';

import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';


const CollapsibleParagraph = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        iconName: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            show: false
        };
    },

    getInitialState() {
        return {
            expanded: this.props.defaultExpanded
        };
    },

    handleToggle(e){
        e.preventDefault();
        this.setState({expanded: !this.state.expanded});
    },

    render() {
        let text = this.state.expanded ? '-' : '+';

        if(this.props.show) {
            return (
                <div className="ascribe-detail-header">
                    <div className="ascribe-edition-collapsible-wrapper">
                        <div onClick={this.handleToggle}>
                            <span>{text} {this.props.title}</span>
                        </div>
                        <Panel
                            collapsible
                            expanded={this.state.expanded}
                            className="ascribe-edition-collapsible-content">
                            {this.props.children}
                        </Panel>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
});

export default CollapsibleParagraph;