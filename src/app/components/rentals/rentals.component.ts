import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Rental } from '../../models/Rental';
import { RentalService } from '../../services/rental.service';
import { ItemService } from '../../services/item.service';
import { ItemTypeService } from '../../services/item-type.service';
import { Item } from '../../models/Item';
import { ItemType } from '../../models/ItemType';
import { Operator } from '../../models/Operator';
import {OperatorService} from '../../services/operator.service';
import {Branch} from '../../models/Branch';
import {BranchService} from '../../services/branch.service';


@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css']
})
export class RentalsComponent implements OnInit, OnDestroy {

  rentals: Rental[];
  itemTypes: ItemType[];
  branches: Branch[];
  itemTypeNames: string[];
  operatorNames: string[];
  branchNames: string[];
  items: Item[];
  operators: Operator[];
  selectedRentals: Rental[];
  rental: Rental = { // Defining an Rental object hold the values which will be taken from the add Branch modal
    clientID: '',
    itemID: '',
    operatorID: '',
    start: '',
  };
  modalRef: BsModalRef; // A reference to the modal
  alertSuccess: boolean; // Holds the value true when the Rental is added successfully and false otherwise. Used to show the alert in html.
  alertFailure: boolean;
  rentalsSubject: any; // These three subjects are used to unsubscribe from the observable when the component is destroyed
  itemsSubject: any;
  operatorsSubject: any;
  itemTypesSubject: any;
  branchesSubject: any;
  constructor(private modalService: BsModalService, // This a pre-made service to allow controlling the modal
              private rentalService: RentalService,
              private itemService: ItemService,
              private itemTypeService: ItemTypeService,
              private operatorService: OperatorService,
              private branchService: BranchService
  ) { }

  async ngOnInit() {
    this.itemTypesSubject = this.itemTypeService.getItemTypes().subscribe( itemTypes => {
      this.itemTypes = itemTypes;
    });
    this.itemsSubject = this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
    this.operatorsSubject = this.operatorService.getOperators().subscribe(operators => {
      this.operators = operators;
    });
    this.branchesSubject = this.branchService.getBranches().subscribe(branches => {
      this.branches = branches;
    });
    const mapFunc = await ( async (rental: Promise<any>) => {
      return {
        ...rental
      }.then(r => r.json());
    })
    // Assigning rentals to be the branches fetched from the service
    this.rentalsSubject = this.rentalService.getRentals().subscribe(await (async rentals => {
      this.rentals = rentals.map(
        mapFunc
      );
    }));
    this.selectedRentals = [];
    this.itemTypeNames = [];
    this.operatorNames = [];
    this.branchNames = [];
    console.log(this.getItemTypes('kDw5hGIQ8tVk2yVmh9FD'));
  }
  /*this.rentals.forEach((element) => {
     this.items.forEach((element2) => {
       if (element.itemID === element2.id) {
         this.itemTypes.forEach((element1) => {
           if (element2.itemType === element1.id) {
             this.itemTypeNames.push(element1.name);
           }
         });
       }
     });
     this.operators.forEach((operator) => {
       if ( operator.id === element.operatorID ) {
         this.operatorNames.push(operator.name);
       }
     });
   });*/
  ngOnDestroy() {
    this.rentalsSubject.unsubscribe();
    this.itemsSubject.unsubscribe();
    this.itemTypesSubject.unsubscribe();
    this.operatorsSubject.unsubscribe();
  }
  selectAllRentals() {
    this.rentals.forEach((element) => {
      element.selected = true;
    });
  }
  deselectAllRentals() {
    this.rentals.forEach((element) => {
      element.selected = false;
    });
  }
  selectRental (event, rental: Rental) {
    this.rentals.forEach((element) => {
      if (element.id === rental.id) {
        element.selected = !element.selected;
        console.log(element);
      }
    });
  }
  updateRental(event, rental: Rental) {
    const tmp = {
      id: rental.id,
      clientID: rental.clientID,
      itemID: rental.itemID,
      operatorID: rental.operatorID,
      start: rental.start
    };
    this.rentalService.updateRental(tmp);
  }
  updateSelectedBranches() {
    this.rentals.forEach((element) => {
      if (element.selected === true) {
        // Making sure that only the desired attribute are being chosen to create the object before updating
        const tmp = {
          id: element.id,
          clientID: element.clientID,
          itemID: element.itemID,
          operatorID: element.operatorID,
          start: element.start
        };
        this.selectedRentals.push(tmp);
      }
    });
  }
  getItemTypes(id: string): string {
    return this.itemTypeNames[id];
  }
  getOperatorName(id: string): string {
    return this.operatorNames[id];
  }
  /*  getTime(timestamp: string): string {
      let time = new Date()
      return '';
    }*/

}
