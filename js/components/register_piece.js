'use strict';

import React from 'react';
import { History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import UserStore from '../stores/user_store';

import RegisterPieceForm from './ascribe_forms/form_register_piece';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let RegisterPiece = React.createClass( {

    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]),
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            {
                selectedLicense: 0,
                isFineUploaderActive: false,
                uploadInfos: [],
                testFileSize: 0,
                testStarted: false,
                testComplete: false
            });
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        if(this.state.currentUser && this.state.currentUser.email) {
            // we should also make the fineuploader component editable again
            this.setState({
                isFineUploaderActive: true
            });
        }
    },

    onSingleTestComplete(uploadInfo) {
        this.setState({
            uploadInfos: this.state.uploadInfos.concat([uploadInfo])
        });
    },

    onTestsStart(files) {
        this.setState({
            testStarted: true,
            testFileSize: files[0].size
        });
    },

    onTestsComplete() {
        this.setState({
            testComplete: true
        }, () => {
            alert('Tests are complete. Please send the results to brett@ascribe.io');
        });
    },

    getUploadedInfo() {
        if (this.state.uploadInfos.length > 0 && this.state.testStarted) {
            return (
                <div style={{'backgroundColor': '#FFF'}}>
                    <h4>{this.state.testComplete? 'Results:' : 'Test in progress...'}</h4>
                    For file of size: {this.state.testFileSize}
                    <ul>
                        {this.state.uploadInfos.map((uploadInfo) => {
                            if (!uploadInfo.error) {
                                return (<li key={uploadInfo.name}><strong>{uploadInfo.name}</strong>: {uploadInfo.time}s</li>);
                            } else {
                                return (<li key={uploadInfo.name}><strong style={{'color': 'red'}}>Error</strong>: {uploadInfo.error} after {uploadInfo.time}s on completing {uploadInfo.progress}%</li>);
                            }
                        })}
                    </ul>
                    <p>Please send these results by screenshot or by copying the values to <a href="mailto:brett@ascribe.io">brett@ascribe.io</a></p>
                </div>
            );
        }
    },

    render() {
        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <Row className="no-margin">
                <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                    <RegisterPieceForm
                        {...this.props}
                        isFineUploaderActive={this.state.isFineUploaderActive}
                        isFineUploaderEditable={!this.state.testComplete}
                        location={this.props.location}

                        onSingleTestComplete={this.onSingleTestComplete}
                        onTestsStart={this.onTestsStart}
                        onTestsComplete={this.onTestsComplete} />
                    {this.getUploadedInfo()}
                </Col>
            </Row>
        );
    }
});


export default RegisterPiece;
