import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Branch } from '../../models/Branch';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit, OnDestroy {

  branches: Branch[];
  selectedBranches: Branch[];
  branch: Branch = { // Defining an Branch object hold the values which will be taken from the add Branch modal
    name: '',
    location: ''
  };
  modalRef: BsModalRef; // A reference to the modal
  alertSuccess: boolean; // Holds the value true when the Branch is added successfully and false otherwise. Used to show the alert in html.
  alertFailure: boolean;
  branchesSubject: any; // These three subjects are used to unsubscribe from the observable when the component is destroyed
  constructor(private modalService: BsModalService, // This a pre-made service to allow controlling the modal
              private branchService: BranchService,        ) { }

  ngOnInit() {
    // Assigning branches to be the branches fetched from the service
    this.branchesSubject = this.branchService.getBranches().subscribe(branches => {
      this.branches = branches;
    });
    this.selectedBranches = []; // defining the selected Branch array
  }
  ngOnDestroy() {
    this.branchesSubject.unsubscribe();
  }
  selectAllBranches() {
    this.branches.forEach((element) => {
      element.selected = true;
    });
  }
  deselectAllBranches() {
    this.branches.forEach((element) => {
      element.selected = false;
    });
  }
  selectBranch (event, branch: Branch) {
    this.branches.forEach((element) => {
      if (element.id === branch.id) {
        element.selected = !element.selected;
        console.log(element);
      }
    });
  }
  updateBranch(event, branch: Branch) {
    const tmp = {
      id: branch.id,
      name: branch.name,
      location: branch.location
    };
    this.branchService.updateBranch(tmp);
  }
  updateSelectedBranches() {
    this.branches.forEach((element) => {
      if (element.selected === true) {
        // Making sure that only the desired attribute are being chosen to create the object before updating
        const tmp = {
          id: element.id,
          name: element.name,
          location: element.location,
        };
        this.selectedBranches.push(tmp);
      }
    });
    this.branchService.updateSelectedBranches(this.selectedBranches);
    this.selectedBranches = []; // Emptying the selected elements array
  }
  deleteBranch(event, branch: Branch) {
    this.branchService.deleteBranch(branch);
  }
  deleteSelectedBranches() {
    this.branches.forEach((element) => {
      if (element.selected === true) {
        this.selectedBranches.push(element);
      }
    });
    this.branchService.deleteSelectedBranches(this.selectedBranches);
    this.selectedBranches = [];
  }
  // This function is async because it is awaiting on a delay
  // function to show the alert for a period of time
  async onSubmit() {
    // checking that the values are not empty
    if ( this.branch.name !== '' && this.branch.location !== '') {
      this.branchService.addBranch(this.branch);
      // Emptying the values so they don't remain in the template after closing
      this.branch.name = '';
      this.branch.location = '';
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
    this.branch.name = '';
    this.branch.location = '';
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
