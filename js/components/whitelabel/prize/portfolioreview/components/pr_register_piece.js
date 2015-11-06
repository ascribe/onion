'use strict';

import React from 'react';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import PRRegisterPieceForm from './pr_forms/pr_register_piece_form';

import { getLangText } from '../../../../../utils/lang_utils';


const PRRegisterPiece = React.createClass({
    render() {
        return (
            <Row>
                <Col xs={4}>
                    <div className="register-piece--hero">
                        <h1>Portfolio Review</h1>
                        <h2>{getLangText('Submission closing on %s', ' 21 Dec 2015')}</h2>
                        <p>{getLangText('Submissions are open to everyone, we accept only PDFs.')}</p>
                        <p>{getLangText('We accept only one PDF with up to 20 images from every participant.')}</p>
                        <p>{getLangText('You need to pay 50€ in order to apply. We only accept PayPal.')}</p>
                    </div>
                </Col>
                <Col xs={8}>
                    <PRRegisterPieceForm />
                </Col>
            </Row>
        );
    }
});

export default PRRegisterPiece;