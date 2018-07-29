import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Operator } from '../../models/Operator';
import { OperatorService } from '../../services/operator.service';
import { BranchService } from '../../services/branch.service';
import {Branch} from '../../models/Branch';


@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit, OnDestroy {

  operators: Operator[];
  branches: Branch[]; // Array that holds the branches fetched from the service
  selectedOperators: Operator[];
  operator: Operator = { // Defining an item object hold the values which will be taken from the add item modal
    branchID: '',
    name: '',
    password: '',
    username: '',
  };
  modalRef: BsModalRef; // A reference to the modal
  alertSuccess: boolean; // Holds the value true when the item is added successfully and false otherwise. Used to show the alert in html.
  alertFailure: boolean;
  operatorsSubject: any; // These three subjects are used to unsubscribe from the observable when the component is destroyed
  branchesSubject: any;
  constructor(private modalService: BsModalService, // This a pre-made service to allow controlling the modal
              private operatorService: OperatorService,
              private branchService: BranchService,
              ) { }

  ngOnInit() {
    // Assigning operators to be the branches fetched from the service
    this.operatorsSubject = this.operatorService.getOperators().subscribe(operators => {
      this.operators = operators;
    });
    this.branchesSubject = this.branchService.getBranches().subscribe(branches => {
      this.branches = branches;
    });
    this.selectedOperators = []; // defining the selected operators array
  }
  ngOnDestroy() {
    this.operatorsSubject.unsubscribe();
    this.branchesSubject.unsubscribe();
  }
  selectAllOperatos() {
    this.operators.forEach((element) => {
      element.selected = true;
    });
  }
  deselectAllOperators() {
    this.operators.forEach((element) => {
      element.selected = false;
    });
  }
  selectOperator (event, operator: Operator) {
    this.operators.forEach((element) => {
      if (element.id === operator.id) {
        element.selected = !element.selected;
        console.log(element);
      }
    });
  }
  updateOperator(event, operator: Operator) {
    const tmp = {
      id: operator.id,
      branchID: operator.branchID,
      name: operator.name,
      password: operator.password,
      username: operator.username,
    };
    this.operatorService.updateOperator(tmp);
  }
  updateSelectedOperators() {
    this.operators.forEach((element) => {
      if (element.selected === true) {
        // Making sure that only the desired attribute are being chosen to create the object before updating
        const tmp = {
          id: element.id,
          branchID: element.branchID,
          name: element.name,
          password: element.password,
          username: element.username,
        };
        this.selectedOperators.push(tmp);
      }
    });
    this.operatorService.updateSelectedOperators(this.selectedOperators);
    this.selectedOperators = []; // Emptying the selected elements array
  }
  deleteOperator(event, operator: Operator) {
    this.operatorService.deleteOperator(operator);
  }
  deleteSelectedOperators() {
    this.operators.forEach((element) => {
      if (element.selected === true) {
        this.selectedOperators.push(element);
      }
    });
    this.operatorService.deleteSelectedOperators(this.selectedOperators);
    this.selectedOperators = [];
  }
  // This function is async because it is awaiting on a delay
  // function to show the alert for a period of time
  async onSubmit() {
    // checking that the values are not empty
    if ( this.operator.name !== '' && this.operator.username !== '' && this.operator.password !== '' && this.operator.branchID !== '') {
      this.operatorService.addOperator(this.operator);
      // Emptying the values so they don't remain in the template after closing
      this.operator.name = '';
      this.operator.username = '';
      this.operator.password = '';
      this.operator.branchID = '';
      await this.showSuccessAlert();
    } else {
      this.showFailureAlert();
    }
  }
  // This function takes a template and opens it as a modal.
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  closeModal() {
    this.modalService.hide(1);
    this.operator.name = '';
    this.operator.username = '';
    this.operator.password = '';
    this.operator.branchID = '';
  }
  async showSuccessAlert() {
    this.alertFailure = false; // removing error alert if exist
    this.alertSuccess = true;
    await this.delay(1500); // keeping the success alert for time
    this.alertSuccess = false;
  }
  showFailureAlert() {
    this.alertFailure = true;
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
