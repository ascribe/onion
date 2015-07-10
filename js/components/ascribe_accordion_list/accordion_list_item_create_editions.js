'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import FormPropertyHeader from '../ascribe_forms/form_property_header';
import Property from '../ascribe_forms/property';

import apiUrls from '../../constants/api_urls';
import { getLangText } from '../../utils/lang_utils';

let AccordionListItemCreateEditions = React.createClass({

    handleSuccess() {

    },

    render() {
        return (
            <div className="ascribe-accordion-list-item-table col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                <Form
                    ref='form'
                    url={apiUrls.editions_list}
                    getFormData={this.getFormData}
                    handleSuccess={this.handleSuccess}
                    buttons={<button
                                type="submit"
                                className="btn ascribe-btn ascribe-btn-login"
                                disabled={false}>
                                {getLangText('Create editions')}
                            </button>}
                    spinner={
                        <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                            <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                        </button>
                        }>
                    
                    <Property
                        name='num_editions'
                        label={getLangText('Number of editions')}>
                        <input
                            type="number"
                            placeholder="(e.g. 32)"
                            min={0}/>
                    </Property>
                </Form>
            </div>
        );
    }
});

export default AccordionListItemCreateEditions;