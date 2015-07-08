'use strict';

import React from 'react';

import CollapsibleMixin from 'react-bootstrap/lib/CollapsibleMixin';

import classNames from 'classnames';

import { getLangText } from '../../utils/lang_utils.js'


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
            show: true
        };
    },

    mixins: [CollapsibleMixin],

    getCollapsibleDOMNode(){
        return React.findDOMNode(this.refs.panel);
    },

    getCollapsibleDimensionValue(){
        return React.findDOMNode(this.refs.panel).scrollHeight;
    },

    handleToggle(e){
        e.preventDefault();
        this.setState({expanded: !this.state.expanded});
    },

    render() {
        let styles = this.getCollapsibleClassSet();
        let text = this.isExpanded() ? '[' + getLangText('hide') + ']' : '[' + getLangText('show') + ']';
        if(this.props.show) {
            return (
                <div className="ascribe-detail-header">
                    <div className="ascribe-edition-collapsible-wrapper">
                        <div onClick={this.handleToggle}>
                            <span>{this.props.title}</span><span className="pull-right">{text}</span>
                        </div>
                        <div ref='panel' className={classNames(styles) + ' ascribe-edition-collapible-content'}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
});

export default CollapsibleParagraph;