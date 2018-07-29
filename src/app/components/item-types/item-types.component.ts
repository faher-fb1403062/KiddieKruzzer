import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ItemType} from '../../models/ItemType';
import { ItemTypeService} from '../../services/item-type.service';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.css']
})
export class ItemTypesComponent implements OnInit, OnDestroy {

  itemTypes: ItemType[];
  selectedItemTypes: ItemType[];
  itemType: ItemType = { // Defining an item object hold the values which will be taken from the add item modal
    interval: 0,
    name: '',
    ppi: 0
  };
  modalRef: BsModalRef; // A reference to the modal
  alertSuccess: boolean; // Holds the value true when the item type is added successfully and false otherwise.
  alertFailure: boolean;
  itemTypesSubject: any; // These three subjects are used to unsubscribe from the observable when the component is destroyed
  constructor(private modalService: BsModalService, // This a pre-made service to allow controlling the modal
              private itemTypesService: ItemTypeService, ) { }

  ngOnInit() {
    // Assigning item types to be the item types fetched from the service
    this.itemTypesSubject = this.itemTypesService.getItemTypes().subscribe(itemTypes => {
      this.itemTypes = itemTypes;
    });
    this.selectedItemTypes = []; // defining the selected item types array
  }
  ngOnDestroy() {
    this.itemTypesSubject.unsubscribe();
  }
  selectAllItemTypes() {
    this.itemTypes.forEach((element) => {
      element.selected = true;
    });
  }
  deselectAllItemTypes() {
    this.itemTypes.forEach((element) => {
      element.selected = false;
    });
  }
  selectItemTypes (event, itemType: ItemType) {
    this.itemTypes.forEach((element) => {
      if (element.id === itemType.id) {
        element.selected = !element.selected;
        console.log(element);
      }
    });
  }
  updateItemType(event, itemType: ItemType) {
    const tmp = {
      id: itemType.id,
      interval: itemType.interval,
      name: itemType.name,
      ppi: itemType.ppi
    };
    this.itemTypesService.updateItemType(tmp);
  }
  updateSelectedItemTypes() {
    this.itemTypes.forEach((element) => {
      if (element.selected === true) {
        // Making sure that only the desired attribute are being chosen to create the object before updating
        const tmp = {
          id: element.id,
          interval: element.interval,
          name: element.name,
          ppi: element.ppi
        };
        this.selectedItemTypes.push(tmp);
      }
    });
    this.itemTypesService.updateSelectedItemTypes(this.selectedItemTypes);
    this.selectedItemTypes = []; // Emptying the selected elements array
  }
  deleteItemType(event, itemType: ItemType) {
    this.itemTypesService.deleteItemType(itemType);
  }
  deleteSelectedItemTypes() {
    this.itemTypes.forEach((element) => {
      if (element.selected === true) {
        this.selectedItemTypes.push(element);
      }
    });
    this.itemTypesService.deleteSelectedItemTypes(this.selectedItemTypes);
    this.selectedItemTypes = [];
  }
  // This function is async because it is awaiting on a delay
  // function to show the alert for a period of time
  async onSubmit() {
    // checking that the values are not empty
    if ( this.itemType.name !== '' && this.itemType.interval !== 0 && this.itemType.ppi !== 0) {
      this.itemTypesService.addItemType(this.itemType);
      // Emptying the values so they don't remain in the template after closing
      this.itemType.name = '';
      this.itemType.ppi = 0;
      this.itemType.interval = 0;
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
    this.itemType.name = '';
    this.itemType.interval = 0;
    this.itemType.ppi = 0;
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
