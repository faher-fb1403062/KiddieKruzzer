import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { ItemService} from '../../services/item.service';
import { Item } from '../../models/Item';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ItemType} from '../../models/ItemType';
import { ItemTypeService} from '../../services/item-type.service';
import { Branch } from '../../models/Branch';
import { BranchService } from '../../services/branch.service';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {

  items: Item[]; // Array that holds the items fetched from the service
  itemTypes: ItemType[]; // Array that holds the item types fetched from the service
  branches: Branch[]; // Array that holds the branches fetched from the service
  selectedItems: Item[]; // Array that holds the selected items for deleting and updating multiple items
  item: Item = { // Defining an item object hold the values which will be taken from the add item modal
    branchID: '',
    itemType: ''
  };
  modalRef: BsModalRef; // A reference to the modal
  alertSuccess: boolean; // Holds the value true when the item is added successfully and false otherwise. Used to show the alert in html.
  alertFailure: boolean;
  itemsSubject: any; // These three subjects are used to unsubscribe from the observable when the component is destroyed
  itemTypesSubject: any; // The are important to make sure that there is no data leak when switching between components
  branchesSubject: any;
  constructor(private modalService: BsModalService, // This a pre-made service to allow controlling the modal
              private itemService: ItemService, // These services are used to allow getting, updating and deleting objects
              private itemTypeService: ItemTypeService,
              private branchService: BranchService,          ) {  }
  ngOnInit() {
    // Assigning items to be the items fetched from the service
    this.itemsSubject = this.itemService.getItems().subscribe(items => {
      this.items = items;
      // Clearing the selection attribute of the items
      this.items.forEach((element) => {
        element.selected = false;
      });
    });
    // Assigning item types to be the item types fetched from the service
   this.itemTypesSubject = this.itemTypeService.getItemTypes().subscribe( itemTypes => {
      this.itemTypes = itemTypes;
    });
    // Assigning branches to be the branches fetched from the service
   this.branchesSubject = this.branchService.getBranches().subscribe(branches => {
      this.branches = branches;
    });
    this.selectedItems = []; // defining the selected item array
  }
  // This function is called when the component is destroyed and it unsubscribes the subjects to make sure that there is no data leak
  ngOnDestroy() {
    this.itemsSubject.unsubscribe();
    this.itemTypesSubject.unsubscribe();
    this.branchesSubject.unsubscribe();
  }
  selectAllItems() {
    this.items.forEach((element) => {
      element.selected = true;
    });
  }
  deselectAllItems() {
    this.items.forEach((element) => {
      element.selected = false;
    });
  }
  selectItem (event, item: Item) {
    this.items.forEach((element) => {
      if (element.id === item.id) {
        element.selected = !element.selected;
        console.log(element);
      }
    });
  }
  updateItem(event, item: Item) {
    const tmp = {
      id: item.id,
      branchID: item.branchID,
      itemType: item.itemType
    };
    this.itemService.updateItem(tmp);
  }
  updateSelectedItems() {
    this.items.forEach((element) => {
      if (element.selected === true) {
        // Making sure that only the desired attribute are being chosen to create the object before updating
        const tmp = {
          id: element.id,
          branchID: element.branchID,
          itemType: element.itemType
        };
        this.selectedItems.push(tmp);
      }
    });
    this.itemService.updateSelectedItems(this.selectedItems);
    this.selectedItems = []; // Emptying the selected elements array
  }
  deleteItem(event, item: Item) {
    this.itemService.deleteItem(item);
  }
  deleteSelectedItems() {
    this.items.forEach((element) => {
      if (element.selected === true) {
        this.selectedItems.push(element);
      }
    });
    this.itemService.deleteSelectedItems(this.selectedItems);
    this.selectedItems = [];
  }
  // This function is async because it is awaiting on a delay
  // function to show the alert for a period of time
  async onSubmit() {
    // checking that the values are not empty
    if ( this.item.itemType !== '' && this.item.branchID !== '') {
      this.itemService.addItem(this.item);
      // Emptying the values so they don't remain in the template after closing
      this.item.branchID = '';
      this.item.itemType = '';
      await this.showSuccessAlert();
    } else {
      this.showFailureAlert();
      console.log('error');
    }
  }
  // This function takes a template and opens it as a modal.
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  closeModal() {
    this.modalService.hide(1);
    this.item.branchID = '';
    this.item.itemType = '';
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
