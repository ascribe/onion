'use strict';

import React from 'react';
import { getLangText } from '../../utils/lang_utils';


let AccordionList = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
        loadingElement: React.PropTypes.element,
        count: React.PropTypes.number
    },
    
    render() {
        if(this.props.itemList && this.props.itemList.length > 0) {
            return (
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            );
        } else if(this.props.count === 0) {
            return (
                <div className="ascribe-accordion-list-placeholder">
                    <p className="text-center">{getLangText('We could not find any works related to you...')}</p>
                    <p className="text-center">{getLangText('To register one, click')} <a href="register_piece">{getLangText('here')}</a>!</p>
                </div>
            );
        } else {
            return (
                <div className={this.props.className + ' ascribe-loading-position'}>
                    {this.props.loadingElement}
                </div>
            );
        }
    }
});

export default AccordionList;
