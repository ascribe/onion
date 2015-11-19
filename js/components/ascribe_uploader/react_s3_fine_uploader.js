'use strict';

import React from 'react/addons';
import fineUploader from 'fineUploader';
import Q from 'q';

import S3Fetcher from '../../fetchers/s3_fetcher';

import FileDragAndDrop from './ascribe_file_drag_and_drop/file_drag_and_drop';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AppConstants from '../../constants/application_constants';

import { computeHashOfFile } from '../../utils/file_utils';
import { displayValidFilesFilter, transformAllowedExtensionsToInputAcceptProp } from './react_s3_fine_uploader_utils';
import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';
import { startTimer, endTimer } from '../../utils/timer_utils';

let ReactS3FineUploader = React.createClass({
    propTypes: {
        keyRoutine: React.PropTypes.shape({
            url: React.PropTypes.string,
            fileClass: React.PropTypes.string,
            pieceId: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.number
            ])
        }),
        createBlobRoutine: React.PropTypes.shape({
            url: React.PropTypes.string,
            pieceId: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.number
            ])
        }),
        submitFile: React.PropTypes.func,
        autoUpload: React.PropTypes.bool,
        debug: React.PropTypes.bool,
        objectProperties: React.PropTypes.shape({
            acl: React.PropTypes.string
        }),
        request: React.PropTypes.shape({
            endpoint: React.PropTypes.string,
            accessKey: React.PropTypes.string,
            params: React.PropTypes.shape({
                csrfmiddlewaretoken: React.PropTypes.string
            })
        }),
        signature: React.PropTypes.shape({
            endpoint: React.PropTypes.string
        }).isRequired,
        uploadSuccess: React.PropTypes.shape({
            method: React.PropTypes.string,
            endpoint: React.PropTypes.string,
            params: React.PropTypes.shape({
                isBrowserPreviewCapable: React.PropTypes.any, // maybe fix this later
                bitcoin_ID_noPrefix: React.PropTypes.string
            })
        }),
        cors: React.PropTypes.shape({
            expected: React.PropTypes.bool
        }),
        chunking: React.PropTypes.shape({
            enabled: React.PropTypes.bool
        }),
        resume: React.PropTypes.shape({
            enabled: React.PropTypes.bool
        }),
        deleteFile: React.PropTypes.shape({
            enabled: React.PropTypes.bool,
            method: React.PropTypes.string,
            endpoint: React.PropTypes.string,
            customHeaders: React.PropTypes.object
        }).isRequired,
        session: React.PropTypes.shape({
            customHeaders: React.PropTypes.object,
            endpoint: React.PropTypes.string,
            params: React.PropTypes.object,
            refreshOnRequests: React.PropTypes.bool
        }),
        validation: React.PropTypes.shape({
            itemLimit: React.PropTypes.number,
            sizeLimit: React.PropTypes.string,
            allowedExtensions: React.PropTypes.arrayOf(React.PropTypes.string)
        }),
        messages: React.PropTypes.shape({
            unsupportedBrowser: React.PropTypes.string
        }),
        formatFileName: React.PropTypes.func,
        multiple: React.PropTypes.bool,
        retry: React.PropTypes.shape({
            enableAuto: React.PropTypes.bool
        }),
        uploadStarted: React.PropTypes.func,
        setIsUploadReady: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        areAssetsDownloadable: React.PropTypes.bool,
        areAssetsEditable: React.PropTypes.bool,
        defaultErrorMessage: React.PropTypes.string,
        onInactive: React.PropTypes.func,

        // We encountered some cases where people had difficulties to upload their
        // works to ascribe due to a slow internet connection.
        // One solution we found in the process of tackling this problem was to hash
        // the file in the browser using md5 and then uploading the resulting text document instead
        // of the actual file.
        //
        // This boolean and string essentially enable that behavior.
        // Right now, we determine which upload method to use by appending a query parameter,
        // which should be passed into 'uploadMethod':
        //   'hash':   upload using the hash
        //   'upload': upload full file (default if not specified)
        enableLocalHashing: React.PropTypes.bool,
        uploadMethod: React.PropTypes.oneOf(['hash', 'upload']),

        // A class of a file the user has to upload
        // Needs to be defined both in singular as well as in plural
        fileClassToUpload: React.PropTypes.shape({
            singular: React.PropTypes.string,
            plural: React.PropTypes.string
        }),

        // Uploading functionality of react fineuploader is disconnected from its UI
        // layer, which means that literally every (properly adjusted) react element
        // can handle the UI handling.
        fileInputElement: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.element
        ]),




        uploadTests: React.PropTypes.array,
        onTestsStart: React.PropTypes.func,
        onTestComplete: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            autoUpload: true,
            debug: false,
            objectProperties: {
                acl: 'public-read',
                bucket: 'ascribe0'
            },
            request: {
                //endpoint: 'https://www.ascribe.io.global.prod.fastly.net',
                endpoint: 'https://ascribe0.s3.amazonaws.com',
                accessKey: 'AKIAIVCZJ33WSCBQ3QDA'
            },
            uploadSuccess: {
                params: {
                    isBrowserPreviewCapable: fineUploader.supportedFeatures.imagePreviews
                }
            },
            cors: {
                expected: true,
                sendCredentials: true
            },
            chunking: {
                enabled: true,
                concurrent: {
                    enabled: true
                }
            },
            resume: {
                enabled: true
            },
            retry: {
                enableAuto: false
            },
            session: {
                endpoint: null
            },
            messages: {
                unsupportedBrowser: '<h3>' + getLangText('Upload is not functional in IE7 as IE7 has no support for CORS!') + '</h3>'
            },
            formatFileName: function(name){// fix maybe
                if (name !== undefined && name.length > 26) {
                    name = name.slice(0, 15) + '...' + name.slice(-15);
                }
                return name;
            },
            multiple: false,
            defaultErrorMessage: getLangText('Unexpected error. Please contact us if this happens repeatedly.'),
            fileClassToUpload: {
                singular: getLangText('file'),
                plural: getLangText('files')
            },
            fileInputElement: FileDragAndDrop
        };
    },

    getInitialState() {
        const uploadTestDeferreds = [];
        this.props.uploadTests.forEach(() => {
            uploadTestDeferreds.push(Q.defer());
        });

        return {
            filesToUpload: [],
            uploader: new fineUploader.s3.FineUploaderBasic(this.propsToConfig()),
            csrfToken: getCookie(AppConstants.csrftoken),

            // -1: aborted
            // -2: uninitialized
            hashingProgress: -2,

            // this is for logging
            chunks: {},


            curUploadTest: 0,
            uploadTestDeferreds
        };
    },

    componentWillUpdate() {
        // since the csrf header is defined in this component's props,
        // everytime the csrf cookie is changed we'll need to reinitalize
        // fineuploader and update the actual csrf token
        let potentiallyNewCSRFToken = getCookie(AppConstants.csrftoken);
        if(this.state.csrfToken !== potentiallyNewCSRFToken) {
            this.setState({
                uploader: new fineUploader.s3.FineUploaderBasic(this.propsToConfig()),
                csrfToken: potentiallyNewCSRFToken
            });
        }
    },

    componentWillUnmount() {
        // Without this method, fineuploader will continue to try to upload artworks
        // even though this component is not mounted any more.
        // Therefore we cancel all uploads
        this.state.uploader.cancelAll();
    },

    propsToConfig() {
        let objectProperties = this.props.objectProperties;
        objectProperties.key = this.requestKey;

        let request = this.props.request;

        return {
            autoUpload: this.props.autoUpload,
            debug: this.props.debug,
            objectProperties: objectProperties, // do a special key handling here
            request: request,
            signature: this.props.signature,
            uploadSuccess: this.props.uploadSuccess,
            cors: this.props.cors,
            chunking: this.props.chunking,
            resume: this.props.resume,
            deleteFile: this.props.deleteFile,
            session: this.props.session,
            validation: this.props.validation,
            messages: this.props.messages,
            formatFileName: this.props.formatFileName,
            multiple: this.props.multiple,
            retry: this.props.retry,
            callbacks: {
                onComplete: this.onComplete,
                onCancel: this.onCancel,
                onProgress: this.onProgress,
                onDeleteComplete: this.onDeleteComplete,
                onSessionRequestComplete: this.onSessionRequestComplete,
                onError: this.onError,
                onUploadChunk: this.onUploadChunk,
                onUploadChunkSuccess: this.onUploadChunkSuccess
            }
        };
    },

    // Resets the whole react fineuploader component to its initial state
    reset() {
        // Cancel all currently ongoing uploads
        this.cancelUploads();

        // and reset component in general
        this.state.uploader.reset();

        // proclaim that upload is not ready
        this.props.setIsUploadReady(false);

        // reset internal data structures of component
        this.setState(this.getInitialState());
    },

    // Cancel uploads and clear previously selected files on the input element
    cancelUploads(id) {
        !!id ? this.state.uploader.cancel(id) : this.state.uploader.cancelAll();
    },

    clearFileSelection() {
        const { fileInput } = this.refs;
        if (fileInput && typeof fileInput.clearSelection === 'function') {
            fileInput.clearSelection();
        }
    },

    requestKey(fileId) {
        let filename = this.state.uploader.getName(fileId);
        let uuid = this.state.uploader.getUuid(fileId);

        return Q.Promise((resolve, reject) => {
            window.fetch(this.props.keyRoutine.url, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie(AppConstants.csrftoken)
                },
                credentials: 'include',
                body: JSON.stringify({
                    'filename': filename,
                    'category': this.props.keyRoutine.fileClass,
                    'uuid': uuid,
                    'piece_id': this.props.keyRoutine.pieceId
                })
            })
            .then((res) => {
                return res.json();
            })
            .then((res) =>{
                resolve(res.key);
            })
            .catch((err) => {
                this.onErrorPromiseProxy(err);
                reject(err);
            });
        });
    },

    createBlob(file) {
        const { createBlobRoutine } = this.props;

        return Q.Promise((resolve, reject) => {

            // if createBlobRoutine is not defined,
            // we're progressing right away without posting to S3
            // so that this can be done manually by the form
            if(!createBlobRoutine) {
                // still we warn the user of this component
                console.warn('createBlobRoutine was not defined for ReactS3FineUploader. Continuing without creating the blob on the server.');
                resolve();
            }

            window.fetch(createBlobRoutine.url, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie(AppConstants.csrftoken)
                },
                credentials: 'include',
                body: JSON.stringify({
                    'filename': file.name,
                    'key': file.key,
                    'piece_id': createBlobRoutine.pieceId
                })
            })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if(res.otherdata) {
                    file.s3Url = res.otherdata.url_safe;
                    file.s3UrlSafe = res.otherdata.url_safe;
                } else if(res.digitalwork) {
                    file.s3Url = res.digitalwork.url_safe;
                    file.s3UrlSafe = res.digitalwork.url_safe;
                } else if(res.contractblob) {
                    file.s3Url = res.contractblob.url_safe;
                    file.s3UrlSafe = res.contractblob.url_safe;
                } else if(res.thumbnail) {
                    file.s3Url = res.thumbnail.url_safe;
                    file.s3UrlSafe = res.thumbnail.url_safe;
                } else {
                    throw new Error(getLangText('Could not find a url to download.'));
                }
                resolve(res);
            })
            .catch((err) => {
                this.onErrorPromiseProxy(err);
                reject(err);
            });
        });
    },

    /* FineUploader specific callback function handlers */

    onUploadChunk(id, name, chunkData) {
        let chunks = this.state.chunks;

        chunks[id + '-' + chunkData.startByte + '-' + chunkData.endByte] = {
            id,
            name,
            chunkData,
            completed: false
        };

        let startedChunks = React.addons.update(this.state.startedChunks, { $set: chunks });

        this.setState({ startedChunks });
    },

    onUploadChunkSuccess(id, chunkData, responseJson, xhr) {
        let chunks = this.state.chunks;
        let chunkKey = id + '-' + chunkData.startByte + '-' + chunkData.endByte;

        if(chunks[chunkKey]) {
            chunks[chunkKey].completed = true;
            chunks[chunkKey].responseJson = responseJson;
            chunks[chunkKey].xhr = xhr;

            let startedChunks = React.addons.update(this.state.startedChunks, { $set: chunks });

            this.setState({ startedChunks });
        }

    },

    onComplete(id, name, res, xhr) {
        // There has been an issue with the server's connection
        if (xhr && xhr.status === 0 && res.success) {
            console.logGlobal(new Error('Upload succeeded with a status code 0'), false, {
                files: this.state.filesToUpload,
                chunks: this.state.chunks,
                xhr: this.getXhrErrorComment(xhr)
            });
        // onError will catch any errors, so we can ignore them here
        } else if (!res.error || res.success) {
            const completedTime = endTimer() / 1000;
            this.props.onTestComplete({
                'name': this.props.uploadTests[this.state.curUploadTest].name,
                'time': completedTime
            });


            let files = this.state.filesToUpload;

            // Set the state of the completed file to 'upload successful' in order to
            // remove it from the GUI
            files[id].status = 'upload successful';
            files[id].key = this.state.uploader.getKey(id);

            let filesToUpload = React.addons.update(this.state.filesToUpload, { $set: files });
            this.setState({ filesToUpload });

            // Only after the blob has been created server-side, we can make the form submittable.
            this.createBlob(files[id])
                .then(() => {
                    this.handleDeleteFile(id);
                })
                .catch(this.onErrorPromiseProxy);
        }
    },

    /**
     * We want to channel all errors in this component through one single method.
     * As fineuploader's `onError` method cannot handle the callback parameters of
     * a promise we define this proxy method to crunch them into the correct form.
     *
     * @param  {error} err a plain Javascript error
     */
    onErrorPromiseProxy(err) {
        this.onError(null, null, err.message);
    },

    onError(id, name, errorReason, xhr) {
        const errorTime = endTimer() / 1000;
        this.props.onTestComplete({
            'name': this.props.uploadTests[this.state.curUploadTest].name,
            'time': errorTime,
            'progress': this.state.filesToUpload[id] ? this.state.filesToUpload[id].progress : 0,
            'error': errorReason
        });

        console.logGlobal(errorReason, false, {
            files: this.state.filesToUpload,
            chunks: this.state.chunks,
            xhr: this.getXhrErrorComment(xhr)
        });

        this.props.setIsUploadReady(true);
        this.cancelUploads(id);

        let notification = new GlobalNotificationModel(errorReason || this.props.defaultErrorMessage, 'danger', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.state.uploadTestDeferreds[this.state.curUploadTest].resolve();
    },

    getXhrErrorComment(xhr) {
        if (xhr) {
            return {
                response: xhr.response,
                url: xhr.responseURL,
                status: xhr.status,
                statusText: xhr.statusText
            };
        }
    },

    isFileValid(file) {
        if(file.size > this.props.validation.sizeLimit) {

            let fileSizeInMegaBytes = this.props.validation.sizeLimit / 1000000;

            let notification = new GlobalNotificationModel(getLangText('A file you submitted is bigger than ' + fileSizeInMegaBytes + 'MB.'), 'danger', 5000);
            GlobalNotificationActions.appendGlobalNotification(notification);

            return false;
        } else {
            return true;
        }
    },

    onCancel(id) {
        // when a upload is canceled, we need to update this components file array
        this.setStatusOfFile(id, 'canceled');

        let notification = new GlobalNotificationModel(getLangText('File upload canceled'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        return true;
    },

    onProgress(id, name, uploadedBytes, totalBytes) {
        let filesToUpload = React.addons.update(this.state.filesToUpload, {
            [id]: {
                progress: { $set: (uploadedBytes / totalBytes) * 100}
            }
        });
        this.setState({ filesToUpload });
    },

    onSessionRequestComplete(response, success) {
        if(success) {
            // fetch blobs for images
            response = response.map((file) => {
                file.url = file.s3UrlSafe;
                file.status = 'online';
                file.progress = 100;
                return file;
            });

            // add file to filesToUpload
            let updatedFilesToUpload = this.state.filesToUpload.concat(response);

            // refresh all files ids,
            updatedFilesToUpload = updatedFilesToUpload.map((file, i) => {
                file.id = i;
                return file;
            });

            let filesToUpload = React.addons.update(this.state.filesToUpload, {$set: updatedFilesToUpload});

            this.setState({filesToUpload });
        } else {
            // server has to respond with 204
            //let notification = new GlobalNotificationModel('Could not load attached files (Further data)', 'danger', 10000);
            //GlobalNotificationActions.appendGlobalNotification(notification);
            //
            //throw new Error('The session request failed', response);
        }
    },

    onDeleteComplete(id, xhr, isError) {
        if(isError) {
            this.setStatusOfFile(id, 'online');
        }

        this.state.uploadTestDeferreds[this.state.curUploadTest].resolve();
    },

    handleDeleteFile(fileId) {
        // We set the files state to 'deleted' immediately, so that the user is not confused with
        // the unresponsiveness of the UI
        //
        // If there is an error during the deletion, we will just change the status back to 'online'
        // and display an error message
        this.setStatusOfFile(fileId, 'deleted');

        // In some instances (when the file was already uploaded and is just displayed to the user
        // - for example in the contract or additional files dialog)
        // fineuploader does not register an id on the file (we do, don't be confused by this!).
        // Since you can only delete a file by its id, we have to implement this method ourselves
        //
        //  So, if an id is not present, we delete the file manually
        //  To check which files are already uploaded from previous sessions we check their status.
        //  If they are, it is "online"

        if(this.state.filesToUpload[fileId].status !== 'online') {
            // delete file from server
            this.state.uploader.deleteFile(fileId);
            // this is being continued in onDeleteFile, as
            // fineuploaders deleteFile does not return a correct callback or
            // promise
        } else {
            let fileToDelete = this.state.filesToUpload[fileId];
            S3Fetcher
                .deleteFile(fileToDelete.s3Key, fileToDelete.s3Bucket)
                .then(() => this.onDeleteComplete(fileToDelete.id, null, false))
                .catch(() => this.onDeleteComplete(fileToDelete.id, null, true));
        }
    },

    handleCancelFile(fileId) {
        this.cancelUploads(fileId);
    },

    handlePauseFile(fileId) {
        if(this.state.uploader.pauseUpload(fileId)) {
            this.setStatusOfFile(fileId, 'paused');
        } else {
            throw new Error(getLangText('File upload could not be paused.'));
        }
    },

    handleResumeFile(fileId) {
        if(this.state.uploader.continueUpload(fileId)) {
            this.setStatusOfFile(fileId, 'uploading');
        } else {
            throw new Error(getLangText('File upload could not be resumed.'));
        }
    },

    handleUploadFile(files) {
        // While files are being uploaded, the form cannot be ready
        // for submission
        this.props.setIsUploadReady(false);

        // validate each submitted file if it fits the file size
        let validFiles = [];
        for(let i = 0; i < files.length; i++) {
            if(this.isFileValid(files[i])) {
                validFiles.push(files[i]);
            }
        }
        // override standard files list with only valid files
        files = validFiles;

        // Call this method to signal the outside component that an upload is in progress
        if(typeof this.props.uploadStarted === 'function' && files.length > 0) {
            this.props.uploadStarted();
        }

        // if multiple is set to false and user drops multiple files into the dropzone,
        // take the first one and notify user that only one file can be submitted
        if(!this.props.multiple && files.length > 1) {
            let tempFilesList = [];
            tempFilesList.push(files[0]);

            // replace filelist with first-element file list
            files = tempFilesList;
            // TOOD translate?
            let notification = new GlobalNotificationModel(getLangText('Only one file allowed (took first one)'), 'danger', 10000);
            GlobalNotificationActions.appendGlobalNotification(notification);
        }

        if (files.length > 0) {
            this.startTests(files);
        }
    },

    handleCancelHashing() {
        // Every progress tick of the hashing function in handleUploadFile there is a
        // check if this.state.hashingProgress is -1. If so, there is an error thrown that cancels
        // the hashing of all files immediately.
        this.setState({ hashingProgress: -1 });
    },

    // ReactFineUploader is essentially just a react layer around s3 fineuploader.
    // However, since we need to display the status of a file (progress, uploading) as well as
    // be able to execute actions on a currently uploading file we need to exactly sync the file list
    // fineuploader is keeping internally.
    //
    // Unfortunately though fineuploader is not keeping all of a File object's properties after
    // submitting them via .addFiles (it deletes the type, key as well as the ObjectUrl (which we need for
    // displaying a thumbnail)), we need to readd them manually after each file that gets submitted
    // to the dropzone.
    // This method is essentially taking care of all these steps.
    synchronizeFileLists(files) {
        let oldFiles = this.state.filesToUpload;
        let oldAndNewFiles = this.state.uploader.getUploads();

        // Add fineuploader specific information to new files
        for(let i = 0; i < oldAndNewFiles.length; i++) {
            for(let j = 0; j < files.length; j++) {
                if(oldAndNewFiles[i].originalName === files[j].name) {
                    oldAndNewFiles[i].progress = 0;
                    oldAndNewFiles[i].type = files[j].type;
                    oldAndNewFiles[i].url = URL.createObjectURL(files[j]);
                }
            }
        }

        // and re-add fineuploader specific information for old files as well
        for(let i = 0; i < oldAndNewFiles.length; i++) {
            for(let j = 0; j < oldFiles.length; j++) {

                // EXCEPTION:
                //
                // Files do not necessarily come from the user's hard drive but can also be fetched
                // from Amazon S3. This is handled in onSessionRequestComplete.
                //
                // If the user deletes one of those files, then fineuploader will still keep it in his
                // files array but with key, progress undefined and size === -1 but
                // status === 'upload successful'.
                // This poses a problem as we depend on the amount of files that have
                // status === 'upload successful', therefore once the file is synced,
                // we need to tag its status as 'deleted' (which basically happens here)
                if(oldAndNewFiles[i].size === -1 && (!oldAndNewFiles[i].progress || oldAndNewFiles[i].progress === 0)) {
                    oldAndNewFiles[i].status = 'deleted';
                }

                if(oldAndNewFiles[i].originalName === oldFiles[j].name) {
                    oldAndNewFiles[i].progress = oldFiles[j].progress;
                    oldAndNewFiles[i].type = oldFiles[j].type;
                    oldAndNewFiles[i].url = oldFiles[j].url;
                    oldAndNewFiles[i].key = oldFiles[j].key;
                }
            }
        }

        // set the new file array
        let filesToUpload = React.addons.update(this.state.filesToUpload, { $set: oldAndNewFiles });

        this.setState({ filesToUpload });
    },

    setStatusOfFile(fileId, status) {
        let changeSet = {};

        if(status === 'deleted' || status === 'canceled') {
            changeSet.progress = { $set: 0 };
        }

        changeSet.status = { $set: status };

        let filesToUpload = React.addons.update(this.state.filesToUpload, { [fileId]: changeSet });

        this.setState({ filesToUpload });
    },

    isDropzoneInactive() {
        const filesToDisplay = this.state.filesToUpload.filter((file) => file.status !== 'deleted' && file.status !== 'canceled' && file.size !== -1);

        if ((this.props.enableLocalHashing && !this.props.uploadMethod) || !this.props.areAssetsEditable || !this.props.multiple && filesToDisplay.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    getAllowedExtensions() {
        let { validation } = this.props;

        if(validation && validation.allowedExtensions && validation.allowedExtensions.length > 0) {
            return transformAllowedExtensionsToInputAcceptProp(validation.allowedExtensions);
        } else {
            return null;
        }
    },


    startTests(files) {
        this.props.onTestsStart(files);

        this.props.uploadTests.reduce((deferred, test, testIndex) => {
            return deferred.then(() => {
                this.startTest(test, files, testIndex);
                return this.state.uploadTestDeferreds[testIndex].promise;
            });
        }, Q.when());
    },

    startTest(test, files, testIndex) {
        const uploaderConfig = this.propsToConfig();
        uploaderConfig.request = Object.assign({}, uploaderConfig.request);
        uploaderConfig.chunking = Object.assign({}, uploaderConfig.chunking);

        if (!!test.endpoint) {
            uploaderConfig.request.endpoint = test.endpoint;
        }
        if (!!test.chunkSize) {
            uploaderConfig.chunking.partSize = test.chunkSize;
        }

        this.setState({
            uploader: new fineUploader.s3.FineUploaderBasic(uploaderConfig),
            curUploadTest: testIndex
        }, () => {
            startTimer();
            this.state.uploader.addFiles(files);
            this.synchronizeFileLists(files);
        });
    },

    render() {
        const {
             multiple,
             areAssetsDownloadable,
             areAssetsEditable,
             onInactive,
             enableLocalHashing,
             fileClassToUpload,
             fileInputElement: FileInputElement,
             uploadMethod } = this.props;

        const props = {
            multiple,
            areAssetsDownloadable,
            areAssetsEditable,
            onInactive,
            enableLocalHashing,
            uploadMethod,
            fileClassToUpload,
            onDrop: this.handleUploadFile,
            filesToUpload: this.state.filesToUpload,
            handleDeleteFile: this.handleDeleteFile,
            handleCancelFile: this.handleCancelFile,
            handlePauseFile: this.handlePauseFile,
            handleResumeFile: this.handleResumeFile,
            handleCancelHashing: this.handleCancelHashing,
            dropzoneInactive: this.isDropzoneInactive(),
            hashingProgress: this.state.hashingProgress,
            allowedExtensions: this.getAllowedExtensions()
        };

        return (
            <FileInputElement
                ref="fileInput"
                {...props} />
        );
    }
});

export default ReactS3FineUploader;
