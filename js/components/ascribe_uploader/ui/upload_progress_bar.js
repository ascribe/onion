import React from 'react';
import classNames from 'classnames';

import ProgressBar from 'react-bootstrap/lib/ProgressBar';


const { arrayOf, number, shape, string } = React.PropTypes;

function calcOverallFileSize(files) {
    // We just sum up all files' sizes
    return files.reduce((overallSize, { size }) => overallSize + size, 0);
}

function calcOverallProgress(files) {
    const overallFileSize = calcOverallFileSize(files);

    // We calculate the overall progress by summing the individuals files' progresses in relation
    // to the total size of all uploads
    return files.reduce((overallProgress, { progress, size }) => (
        (size / overallFileSize) * progress
    ), 0);
}

const propTypes = {
    files: arrayOf(shape({
        progress: number.isRequired,
        size: number.isRequired
    })).isRequired,

    className: string
};

const UploadProgressBar = ({ className, files }) => {
    const overallProgress = Math.ceil(calcOverallProgress(files));

    return (
        <ProgressBar
            className={classNames(className, 'ascribe-progress-bar', { 'hidden': !files.length })}
            label={`${overallProgress}%`}
            now={overallProgress} />
    );
};

UploadProgressBar.propTypes = propTypes;

export default UploadProgressBar;
