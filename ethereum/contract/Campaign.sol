pragma solidity 0.4.17;

contract FactoryCampaign{
    address[] campaigns;

    function createCampaign(uint minimumValue) public{
        address newCampaign = new Campaign(minimumValue, msg.sender);
        campaigns.push(newCampaign);
    }

    function getCampaigns() public view returns(address[]){
        return campaigns;
    }
}

contract Campaign{
    address public manager;
    uint minimum;
    mapping(address=>bool) public contributers;
    uint totalContributers;
    struct Request{
        string description;
        uint value;
        address recepient;
        mapping(address=>bool) approvers;
        uint approvals;
        bool completed;
    }
    Request[] public requests;

    modifier isManager{
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimumValue, address managerAddress) public{
        manager=managerAddress;
        minimum=minimumValue;
    }

    function contribute() public payable{
        require(msg.value>=minimum);
        contributers[msg.sender]=true;
        totalContributers++;
    }

    function createRequest(string description, uint value, address recepient) public isManager{
        Request memory request = Request({description: description, value: value, recepient: recepient, completed: false, approvals: 0});
        requests.push(request);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(contributers[msg.sender]);
        require(!request.approvers[msg.sender]);
        request.approvals++;
        request.approvers[msg.sender]=true;
    } 

    function transferAmount(uint index) public isManager{
        Request storage request = requests[index];
        require(!request.completed);
        require(request.approvals>totalContributers/2);
        request.recepient.transfer(request.value);
        request.completed=true;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address){
        return(this.balance, minimum, requests.length,totalContributers,manager);
    }
}