'use strict';

import request from '../utils/request';


let OwnershipFetcher = {
    /**
     * Fetch the default, public contract of a user from the API.
     */
    fetchContract(loanee) {
        return request('blob_contracts', {
            query: { loanee }
        });
    },

    /**
     * Fetch the contracts of the logged-in user from the API.
     */
    fetchContractList(isActive, isPublic, issuer) {
        const query = { isActive, isPublic, issuer };

        return request('ownership_contract_list', { query });
    },


    /**
     * Create a contractagreement between the logged-in user and the email from the API with contract.
     */
    createContractAgreement(signee, contractObj) {
        return request('ownership_contract_agreements', {
            method: 'POST',
            jsonBody: {
                signee,
                contract: contractObj.id
            }
        });
    },

    /**
     * Fetch the contractagreement between the logged-in user and the email from the API.
     */
    fetchContractAgreementList(issuer, accepted, pending) {
        const query = { issuer, accepted, pending };

        return request('ownership_contract_agreements', { query });
    },

    confirmContractAgreement(contractAgreement) {
        return request('ownership_contract_agreements_confirm', {
            method: 'PUT',
            urlTemplateSpec: {
                contractAgreementId: contractAgreement.id
            }
        });
    },

    denyContractAgreement(contractAgreement) {
        return request('ownership_contract_agreements_deny', {
            method: 'PUT',
            urlTemplateSpec: {
                contractAgreementId: contractAgreement.id
            }
        });
    },

    fetchLoanPieceRequestList() {
        return request('ownership_loans_pieces_request');
    },

    changeContract(contractObj) {
        return request('ownership_contract', {
            method: 'PUT',
            jsonBody: contractObj,
            urlTemplateSpec: {
                contractId: contractObj.id
            }
        });
    },

    deleteContract(contractId) {
        return request('ownership_contract', {
            method: 'DELETE',
            urlTemplateSpec: { contractId }
        });
    }
};

export default OwnershipFetcher;
