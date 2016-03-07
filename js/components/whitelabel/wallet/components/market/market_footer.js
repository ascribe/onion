'use strict';

import React from 'react';

import { getLangText } from '../../../../../utils/lang_utils';


const MarketFooter = React.createClass({
    render() {
        return (
            <div className="container hidden-print">
                <div className="row">
                    <div className="whitelabel-footer">
                        <hr/>
                        <span id="powered">{getLangText('Digital wallet powered by')} </span>
                        <a className="ascribe-powered-by" href="https://www.ascribe.io/" target="_blank">
                            <span className="icon-ascribe-logo"></span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
});


export default MarketFooter;
