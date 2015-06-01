import fetch from 'isomorphic-fetch';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputHidden from './input_hidden';
import InputCheckbox from './input_checkbox';
import InputDate from './input_date';
import InputTextArea from './input_textarea';
import OwnershipFetcher from '../../fetchers/ownership_fetcher'
import ButtonSubmitOrClose from './button_submit_close';

let LoanForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_loans
    },
    componentDidMount(){
        this.setState({contract_key: null,
                       contract_url: null,
                       loaneeHasContract: false});
    },
    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            loanee: this.refs.loanee.state.value,
            gallery_name: this.refs.gallery_name.state.value,
            startdate: this.refs.startdate.state.value,
            enddate: this.refs.enddate.state.value,
            loan_message: this.refs.loan_message.state.value,
            password: this.refs.password.state.value,
            terms: this.refs.terms.state.value
        }
    },
    handleLoanEmailBlur(e){
        OwnershipFetcher.fetchLoanContract(this.refs.loanee.state.value)
            .then((res) => {
                if (res && res.length > 0) {
                    this.setState({contract_key: res[0].s3Key,
                                   contract_url: res[0].s3Url,
                                   loaneeHasContract: true});
                }
                else{
                    this.resetLoanContract();
                }
            })
            .catch((err) => {
                console.log(err);
                this.resetLoanContract();
            });
    },
    resetLoanContract(){
        this.setState({contract_key: null,
                        contract_url: null,
                        loaneeHasContract: false
                       });
    },
    renderForm() {
        let title = this.props.edition.title;
        let username = this.props.currentUser.username;
        let message =
`Hi,

I loan \" ${title} \" to you.

Truly yours,
${username}`;
        let contract = <InputHidden ref="terms" value="True"/>;
        if (this.state.loaneeHasContract){
            let label = <div>
                            I agree to the&nbsp;
                            <a href={this.state.contract_url} target="_blank">
                                terms of {this.refs.loanee.state.value}
                            </a>
                        </div>;
            contract = <InputCheckbox
                            ref="terms"
                            required="required"
                            label={label}
                        />
        }
        //<InputText
        //                    ref="startdate"
        //                    name="startdate"
        //                    placeHolder="Loan start date"
        //                    required="required"
        //                    type="text"
        //                    submitted={this.state.submitted}/>
        return (
            <form id="loan_modal_content" role="form" onSubmit={this.submit}>
                <input className="invisible" type="email" name="fake_loanee"/>
                <input className="invisible" type="password" name="fake_password"/>
                <InputText
                    ref="loanee"
                    placeHolder="Loanee email"
                    required="required"
                    type="email"
                    submitted={this.state.submitted}
                    onBlur={this.handleLoanEmailBlur}/>
                <InputText
                    ref="gallery_name"
                    placeHolder="Gallery/exhibition (optional)"
                    required=""
                    type="text"
                    submitted={this.state.submitted}/>
                <div className="row">
                    <div className="col-md-6">
                        <InputDate
                            ref="startdate"
                            placeholderText="Loan start date" />
                    </div>
                    <div className="col-md-6 form-group">
                        <InputText
                            ref="enddate"
                            name="enddate"
                            placeholderText="Loan end date"
                            required="required"
                            type="text"
                            submitted={this.state.submitted}/>
                    </div>
                </div>
                <InputTextArea
                    ref="loan_message"
                    defaultValue={message}
                    required=""
                    />
                <InputText
                    ref="password"
                    placeHolder="Password"
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                {contract}
                <ButtonSubmitOrClose
                    text="LOAN"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default LoanForm;
