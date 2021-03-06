const assert = require ('assert');
const ganache = require ('ganache-cli');
const Web3 = require ('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require ('../compile');

let accounts;
let inbox;
beforeEach(async () => {
//Get a list of all accounts
    accounts = await web3.eth.getAccounts();

//Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments:['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' });

    console.log(inbox.options.address)
});

describe('Inbox', () => {
    //test deployment assume if we get address back, then we are good.
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    //test if iniital message is correct
    it('has a default mesage', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!')
    });

    //test if set message works correctly
    it('can set message', async () => {
        await inbox.methods.setMessage('new message').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'new message'); 
    });



});