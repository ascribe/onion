'use strict';

const mainUser = {
    email: 'dimi@mailinator.com',
    password: '0000000000'
};
const mainPieceId = '12374';
const mainEditionId = '14gw9x3VA9oJaxp4cHaAuK2bvJzvEj4Xvc';

console.log('==================  Test environment  ==================\n');
console.log('Main user:');
console.log(`    Email: ${mainUser.email}`);
console.log(`    Password: ${mainUser.password}\n`);
console.log(`Main piece: ${mainPieceId}`);
console.log(`Main edition: ${mainEditionId}\n`);
console.log('========================================================\n');

module.exports = {
    mainUser,
    mainPieceId,
    mainEditionId
};
