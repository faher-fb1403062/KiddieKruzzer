import {Subscription} from 'rxjs';

export interface Rental {
  id?: string;
  clientID?: string;
  itemID?: string;
  operatorID: string;
  start?: string;
  selected?: boolean;
  itemType?: string;
}
