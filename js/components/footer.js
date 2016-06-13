'use strict';

import React from 'react';

import { getLangText } from '../utils/lang';


const Footer = React.createClass({
    render() {
        return (
            <div className="ascribe-footer hidden-print">
                <p className="ascribe-sub-sub-statement">
                  <br />
                  <a href="http://docs.ascribe.apiary.io/" target="_blank">api</a> |
                  <a href="https://www.ascribe.io/faq/" target="_blank"> {getLangText('faq')}</a> |
                  <a href="https://www.ascribe.io/imprint/" target="_blank"> {getLangText('imprint')}</a> |
                  <a href="https://www.ascribe.io/terms/" target="_blank"> {getLangText('terms of service')}</a> |
                  <a href="https://www.ascribe.io/privacy/" target="_blank"> {getLangText('privacy')}</a>
                </p>
                <p className="social-icons-wrapper">
                    <a href="https://twitter.com/ascribeIO" className="social social-twitter" target="_blank"></a>
                    <a href="https://www.facebook.com/ascribeio" className="social social-facebook" target="_blank"></a>
                    <a href="https://github.com/ascribe" className="social social-github" target="_blank"></a>
                    <a href="http://ascribe-io.tumblr.com/" className="social social-tumblr" target="_blank"></a>
                    <a href="https://www.linkedin.com/company/4816284?trk=vsrp_companies_res_name&trkInfo=VSRPsearchId%3A122827941425632318075%2CVSRPtargetId%3A4816284%2CVSRPcmpt%3Aprimary" className="social social-linked-in" target="_blank"></a>
                </p>
            </div>
        );
    }
});

export default Footer;
