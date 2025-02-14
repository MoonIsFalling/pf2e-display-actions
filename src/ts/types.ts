import {ModuleHomebrewData} from 'foundry-pf2e';
import {DisplayActions2e} from './apps/displayActions';

export interface MyModule extends ModuleHomebrewData {
  displayActions2e: DisplayActions2e[];
}

export interface EmitData {
  operation: String;
  user: String;
  state: DisplayActions2eData;
  userList?: String[];
}

export interface DisplayActions2eData {
  numOfActions: number;
  numOfReactions: number;
  classNameListActions: string[];
  classNameListReactions: string[];
  sentFromUserId: string;
  userListPermissions: string[];
  duplicationNr: number;
  tokenId?: string;
  isLinkedToToken?: boolean;
}

export interface ConditionModifierDictionary {
  [key: string]: number;
}
