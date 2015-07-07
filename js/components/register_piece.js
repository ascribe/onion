'use strict';

import React from 'react';

import DatePicker from 'react-datepicker/dist/react-datepicker';

import Router from 'react-router';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import AppConstants from '../constants/application_constants';

import LicenseActions from '../actions/license_actions';
import LicenseStore from '../stores/license_store';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import UserStore from '../stores/user_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';

import LoginContainer from './login_container';
import SlidesContainer from './ascribe_slides_container/slides_container';

import apiUrls from '../constants/api_urls';

import ReactS3FineUploader from './ascribe_uploader/react_s3_fine_uploader';

import { mergeOptions } from '../utils/general_utils';
import { getCookie } from '../utils/fetch_api_utils';

let RegisterPiece = React.createClass( {
    mixins: [Router.Navigation],

    getInitialState(){
        return mergeOptions(
            LicenseStore.getState(),
            UserStore.getState(),
            PieceListStore.getState(),
            {
                digitalWorkKey: null,
                uploadStatus: false,
                selectedLicense: 0,
                isFineUploaderEditable: false
            });
    },

    componentDidMount() {
        LicenseActions.fetchLicense();
        LicenseStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        LicenseStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        // once the currentUser object from UserStore is defined (eventually the user was transitioned
        // to the login form via the slider and successfully logged in), we can direct him back to the
        // register_piece slide
        if(state.currentUser && state.currentUser.email || this.state.currentUser && this.state.currentUser.email) {
            this.refs.slidesContainer.setSlideNum(0);
            // we should also make the fineuploader component editable again
            this.setState({
                isFineUploaderEditable: true
            });
        }
    },

    handleSuccess(response){
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // once the user was able to register a piece successfully, we need to make sure to keep
        // the piece list up to date
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.searchTerm, this.state.orderBy, this.state.orderAsc);

        this.transitionTo('edition', {editionId: response.edition.bitcoin_id});
    },

    getFormData(){
        let data = {};
        for (let ref in this.refs.form.refs){
            data[this.refs.form.refs[ref].props.name] = this.refs.form.refs[ref].state.value;
        }
        data.digital_work_key = this.state.digitalWorkKey;
        return data;
    },

    submitKey(key){
        this.setState({
            digitalWorkKey: key
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    isReadyForFormSubmission(files) {
        files = files.filter((file) => file.status !== 'deleted' && file.status !== 'canceled');
        if (files.length > 0 && files[0].status === 'upload successful') {
            return true;
        } else {
            return false;
        }
    },
    onLicenseChange(event){
        //console.log(this.state.licenses[event.target.selectedIndex].url);
        this.setState({selectedLicense: event.target.selectedIndex});
    },
    getLicenses() {
        if (this.state.licenses && this.state.licenses.length > 1) {
            return (
                <Property
                    name='license'
                    label="Copyright license..."
                    onChange={this.onLicenseChange}
                    footer={
                        <a className="pull-right" href={this.state.licenses[this.state.selectedLicense].url} target="_blank">
                            Learn more
                        </a>}>
                    <select name="license">
                        {this.state.licenses.map((license, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ license.code }>
                                    { license.code.toUpperCase() }: { license.name }
                                </option>
                            );
                        })}
                    </select>
                </Property>);
        }
        return null;
    },

    changeSlide() {
        // only transition to the login store, if user is not logged in
        // ergo the currentUser object is not properly defined
        if(!this.state.currentUser.email) {
            this.refs.slidesContainer.setSlideNum(1);
        }
    },

    render() {
        return (
            <SlidesContainer ref="slidesContainer">
                <div
                    onClick={this.changeSlide}
                    onFocus={this.changeSlide}>
                    <Row className="no-margin">
                        <Col sm={4}>
                            <div style={{'marginTop': 0, 'marginLeft': '1em'}}>
                                <FileUploader
                                    submitKey={this.submitKey}
                                    setIsUploadReady={this.setIsUploadReady}
                                    isReadyForFormSubmission={this.isReadyForFormSubmission}
                                    editable={this.state.isFineUploaderEditable}/>
                            </div>
                            <br />
                            <br />
                        </Col>
                        <Col sm={8}>
                            <h3 style={{'marginTop': 0, 'marginLeft': '1em'}} onClick={this.changePage}>Lock down title</h3>
                            <Form
                                ref='form'
                                url={apiUrls.pieces_list}
                                getFormData={this.getFormData}
                                handleSuccess={this.handleSuccess}
                                buttons={<button
                                            type="submit"
                                            className="btn ascribe-btn ascribe-btn-login"
                                            disabled={!this.state.isUploadReady}>
                                            Register work
                                        </button>}
                                spinner={
                                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                                    </button>
                                    }>

                                <Property
                                    name='artist_name'
                                    label="Artist Name">
                                    <input
                                        type="text"
                                        placeholder="(e.g. Andy Warhol)"
                                        required/>
                                </Property>
                                <Property
                                    name='title'
                                    label="Title">
                                    <input
                                        type="text"
                                        placeholder="(e.g. 32 Campbell's Soup Cans)"
                                        required/>
                                </Property>
                                <Property
                                    name='date_created'
                                    label="Year Created">
                                    <input
                                        type="number"
                                        placeholder="(e.g. 1962)"
                                        min={0}
                                        required/>
                                </Property>
                                {this.getLicenses()}
                                <hr />
                            </Form>
                        </Col>
                    </Row>
                </div>
                <div>
                    <LoginContainer
                        message="Please login before ascribing your work..."
                        redirectOnLoggedIn={false}
                        redirectOnLoginSuccess={false}/>
                </div>
            </SlidesContainer>
        );
    }
});


let FileUploader = React.createClass({
    propTypes: {
        setIsUploadReady: React.PropTypes.func,
        submitKey: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        onClick: React.PropTypes.func,
        // editable is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        editable: React.PropTypes.bool
    },

    render() {
        return (
            <ReactS3FineUploader
                onClick={this.props.onClick}
                keyRoutine={{
                    url: AppConstants.serverUrl + 's3/key/',
                    fileClass: 'digitalwork'
                }}
                createBlobRoutine={{
                    url: apiUrls.blob_digitalworks
                }}
                submitKey={this.props.submitKey}
                validation={{
                    itemLimit: 100000,
                    sizeLimit: '25000000000'
                }}
                setIsUploadReady={this.props.setIsUploadReady}
                isReadyForFormSubmission={this.props.isReadyForFormSubmission}
                areAssetsDownloadable={false}
                areAssetsEditable={this.props.editable}
                signature={{
                    endpoint: AppConstants.serverUrl + 's3/signature/',
                    customHeaders: {
                       'X-CSRFToken': getCookie('csrftoken')
                    }
                }}
                deleteFile={{
                    enabled: true,
                    method: 'DELETE',
                    endpoint: AppConstants.serverUrl + 's3/delete',
                    customHeaders: {
                       'X-CSRFToken': getCookie('csrftoken')
                    }
                }}/>
        );
    }
});


let InputDate = React.createClass({
    propTypes: {
        placeholderText: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    getInitialState() {
        return {
            value: null,
            value_formatted: null
        };
    },

    handleChange(date) {
        this.setState({
            value: date,
            value_formatted: date.format('YYYY')});
        let event = document.createEvent('HTMLEvents');
        event.initEvent('click', false, true);
        document.dispatchEvent(event);
        event.target.value = date;
        this.props.onChange(event);
    },

    render: function () {
        return (
            <DatePicker
                key="example2"
                dateFormat="YYYY"
                selected={this.state.value}
                onChange={this.handleChange}
                onBlur={this.props.onBlur}
                placeholderText={this.props.placeholderText}/>
        );
    }
});

export default RegisterPiece;
