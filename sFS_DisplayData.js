import { LightningElement, wire } from 'lwc';
import GetResponse from '@salesforce/apex/SFS_JsonParse.GetResponse';
import deleteMultipleRecord from '@salesforce/apex/SFS_JsonParse.GetResponse';
const columns = [
    { label: 'Creditor', fieldName: 'creditorName' },
    { label: 'First Name', fieldName: 'firstName', type: 'text' },
    { label: 'Last Name', fieldName: 'lastName', type: 'text' },
    { label: 'Min Pay %', fieldName: 'minPaymentPercentage', type: 'Text' },
    { label: 'Balance', fieldName: 'balance', type: 'Text' },
    
];
export default class SFS_DisplayData extends LightningElement {
    //Call apex class using wire service
    sfsdata=[];
    TotalRows ;
    SelectedRows;
    SelectedRowCount;
    selectedRecords = [];
    columns = columns;
    showModal = false;
    idsToExclude = [];
    CreditorName;
    FirstName;
    LastName;
    MinPay;
    Balance;
    connectedCallback(){
        GetResponse()
            .then(result => {
                this.sfsdata = JSON.parse(result);
                for(var obj of this.sfsdata){
                    this.idsToExclude.push(obj.id);
                }
                this.TotalRows = this.sfsdata.length;
                
                console.log(this.sfsdata);
            });
    }
    
    selectrow(event){
        let totalBalance = 0;
        this.SelectedRows = event.detail.selectedRows;
        console.log(event.detail.selectedRows);
        this.SelectedRowCount = this.SelectedRows.length;
        for(var objBalance of event.detail.selectedRows){
            totalBalance += objBalance.balance;
        }
        this.addBalance =totalBalance;

    }

    openModalWindow(event) {
        this.showModal = true;
    }

    handleAddDebt(event) {
        let tempArray = [];
        let newObj = {id:this.idGenerator(1,1000),
            creditorName:this.CreditorName,
            firstName:this.FirstName,
            lastName:this.LastName,
            minPaymentPercentage:this.MinPay,
            balance:this.Balance,
        }
        this.idsToExclude.push(newObj.id);
        console.log(this.idGenerator(1,1000));
        tempArray.push(...this.sfsdata,newObj);
        this.sfsdata = tempArray;
        this.showModal = false;
    }

    saveCreditor(event){
        this.CreditorName = event.target.value;
    }

    saveFirstName(event){
        this.FirstName = event.target.value;
    }

    saveLastName(event){
        this.LastName = event.target.value;
    }

    saveMinPay(event){
        this.MinPay = event.target.value;
    }

    saveBalance(event){
        this.Balance = event.target.value;
    }

    handleRemoveDebt(event) {
        let tempArray = this.sfsdata;
        console.log("temparray -" +tempArray);
        console.log("selectedrows -" + this.SelectedRows);

       for(var obj of this.SelectedRows){
            tempArray = tempArray.filter(function(obj1) {return obj1.id !== obj.id});
       }
       console.log("temparray" + tempArray);
        this.sfsdata = tempArray;
    }
    closeModal(event){
        console.log('onsubmit: '+ event.detail.fields);
        this.showModal = false;
    }

    idGenerator(minID,maxID){
        let num = Math.floor(Math.random() * (maxID - minID + 1)) + minID;
        if(this.idsToExclude.includes(num)){
           return this.idGenerator(minID,maxID);
        }
        else return num;

    }

    showRowDetails(row) {
        this.record = row;
    }
}