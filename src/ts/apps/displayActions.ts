import {moduleId, socketEvent} from '../constants';
import {actionsFromConditions, handleDuplication, handleToken, startTurnUpdate} from '../utils';
import {DisplayActions2eData, EmitData, MyModule} from '../types';
import {SelectiveShowApp} from './selectiveShow';
import {ActorPF2e} from 'foundry-pf2e';

export class DisplayActions2e extends Application {
  protected clickString = 'symbolClick';
  protected actionImage = 'systems/pf2e/icons/actions/OneAction.webp';
  protected reactionImage = 'systems/pf2e/icons/actions/Reaction.webp';
  protected defaultNumOfActions = 3;
  protected defaultNumOfReactions = 1;
  protected isLinkedToActor = false;

  protected state: DisplayActions2eData = {
    numOfActions: this.defaultNumOfActions,
    numOfReactions: this.defaultNumOfReactions,
    classNameListActions: Array.from({length: this.defaultNumOfActions}, () => 'symbol'),
    classNameListReactions: Array.from({length: this.defaultNumOfReactions}, () => 'symbol'),
    sentFromUserId: game.userId,
    userListPermissions: [game.userId],
    actorUuid: undefined,
    isLinkedToToken: this.isLinkedToActor,
    duplicationNr: 0,
  };

  protected showPlayerHandler: SelectiveShowApp = new SelectiveShowApp([game.user.name], this.state);

  constructor(newState?: DisplayActions2eData) {
    super();

    if (newState) {
      this.state = newState;
    }

    if (game.settings.get(moduleId, 'DisplayActions2e.Settings.UpdateTurnStart') as boolean) {
      Hooks.on('pf2e.startTurn', startTurnUpdate);
    }
  }

  override get title(): string {
    let title = game.i18n.localize('DisplayActions2e.WindowTitle');

    if (this.state.isLinkedToToken) {
      title = title.concat(this.getTitleToken());
    }

    title = title.concat(this.getTitleSentFrom());
    title = title.concat(this.getTitleDuplication());
    return title;
  }

  static override get defaultOptions(): ApplicationOptions {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'DisplayActions2e',
      template: `modules/${moduleId}/templates/result.hbs`,
      width: 270,
      height: 140,
      resizable: true,
      title: 'DisplayActions2e.WindowTitle',
    }) as ApplicationOptions;
  }

  override getData() {
    this.updateState();

    return {
      numOfActions: this.state.numOfActions,
      numOfReactions: this.state.numOfReactions,
      actionImagePayload: this.buildHandlebarPayload(
        this.state.numOfActions,
        {actionImage: this.actionImage},
        this.state.classNameListActions,
      ),
      reactionImagePayload: this.buildHandlebarPayload(
        this.state.numOfReactions,
        {reactionImage: this.reactionImage},
        this.state.classNameListReactions,
      ),
      isLinkedToActor: this.state.isLinkedToToken,
      isLinkActorButtonHidden: !(game.settings.get(moduleId, 'DisplayActions2e.Settings.LinkActorId') as boolean),
    };
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    // register events for all users with permission
    if (this.state.userListPermissions.includes(game.userId)) {
      html.find('img.symbol').on('click', this._onClickSymbolImage.bind(this));
      html.find('input.input-counter').on('change', this._onChangeCountNumber.bind(this));
      html.find('button.actorLink').on('click', this._onButtonClickSelectedActors.bind(this));
      html.find('button.actorUpdate').on('click', this._onButtonClickUpdateActors.bind(this));
    }
  }

  override async close(options?: {force?: boolean}): Promise<void> {
    await super.close(options);

    let module = game.modules.get(moduleId) as unknown as MyModule;
    const index = module.displayActions2e.indexOf(this, 0);
    if (index > -1) {
      module.displayActions2e.splice(index, 1);
    }
  }

  protected _onClickSymbolImage(event: Event) {
    event.preventDefault();
    // switch css classes of the images
    const image = event.currentTarget as HTMLImageElement;
    if (image === undefined || image === null) {
      return;
    }
    image.classList.toggle(this.clickString);
    // save the state
    // all id begin with either a or r for action or reaction respectively
    const pos = parseInt(image.id.slice(1));
    switch (image.id.charAt(0)) {
      case 'a':
        this.state.classNameListActions[pos] = image.className;
        break;
      case 'r':
        this.state.classNameListReactions[pos] = image.className;
        break;
      default:
        console.error(`${moduleId} handled Image onClicks wrong.`);
    }

    this.emitUpdate();
  }

  /**
   * Helper function to make Payload for Handlebars each loop to pass data
   * @param iterator array size
   */
  protected buildHandlebarPayload(iterator: number, imageObj: any, state: string[]) {
    let payload = [];
    for (let index = 0; index < iterator; index++) {
      payload.push(foundry.utils.mergeObject({number: index, cssClass: state[index]}, imageObj));
    }
    return payload;
  }

  protected _onChangeCountNumber(event: Event) {
    event.preventDefault();
    const input = event.currentTarget as HTMLInputElement;
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      if (value >= 0) {
        switch (input.id) {
          case 'count-action':
            this.state.numOfActions = value;
            break;
          case 'count-reaction':
            this.state.numOfReactions = value;
            break;
          default:
            console.error(`${moduleId} incorrectly handled number of actions!`);
        }
        this.render(false, {focus: false});
        this.emitUpdate();
      }
    }
  }

  protected override _getHeaderButtons(): ApplicationHeaderButton[] {
    const buttons = super._getHeaderButtons();

    const headerButton: ApplicationHeaderButton = {
      label: 'JOURNAL.ActionShow',
      class: 'share-image',
      icon: 'fas fa-eye',
      onclick: () => this.showPlayerHandler._handleShowPlayers(this.state),
    };

    const headerButtonDuplication: ApplicationHeaderButton = {
      label: 'DisplayActions2e.Duplication',
      class: 'duplicate-app',
      icon: 'fa fa-clone',
      onclick: () => this._onHeaderDuplication(),
    };

    if (game.settings.get(moduleId, 'DisplayActions2e.Settings.ShowPlayerId') !== 'Hide') {
      buttons.unshift(headerButton);
    }
    if (game.settings.get(moduleId, 'DisplayActions2e.Settings.DuplicateId') as boolean) {
      buttons.unshift(headerButtonDuplication);
    }

    return buttons;
  }

  /**
   * Update internal state based on the size of the arrays
   */
  protected updateState() {
    // case to few state elements
    if (this.state.classNameListActions.length < this.state.numOfActions) {
      const tmp = Array.from(
        {length: this.state.numOfActions - this.state.classNameListActions.length},
        () => 'symbol',
      );
      this.state.classNameListActions = this.state.classNameListActions.concat(tmp);
    }
    // too many elements, we remove the last elements
    else if (this.state.classNameListActions.length > this.state.numOfActions) {
      const cut_value = this.state.classNameListActions.length - this.state.numOfActions;
      this.state.classNameListActions = this.state.classNameListActions.slice(0, cut_value);
    }

    // other state same cases

    // case to few state elements
    if (this.state.classNameListReactions.length < this.state.numOfReactions) {
      const tmp = Array.from(
        {length: this.state.numOfReactions - this.state.classNameListReactions.length},
        () => 'symbol',
      );
      this.state.classNameListReactions = this.state.classNameListReactions.concat(tmp);
    }
    // too many elements, we remove the last elements
    else if (this.state.classNameListReactions.length > this.state.numOfReactions) {
      const cut_value = this.state.classNameListReactions.length - this.state.numOfReactions;
      this.state.classNameListReactions = this.state.classNameListReactions.slice(0, cut_value);
    }
  }

  public emitUpdate() {
    game.socket?.emit(socketEvent, {
      operation: 'update',
      state: this.state,
      user: game.userId,
    } as EmitData);
  }

  public setState(newState: DisplayActions2eData) {
    this.state = foundry.utils.deepClone(newState);
  }

  /**
   * returns a clone of the state not a reference
   */
  public getState() {
    return foundry.utils.deepClone(this.state);
  }

  /**
   * The following functions are only done because transpilation is bullying me and thus i cannot do an child of this class
   */
  private getTitleToken(): string {
    let title = '';

    let actor = fromUuidSync(this.state.actorUuid as string);
    title = title.concat(' for ', String(actor?.name));
    return title;
  }

  private getTitleSentFrom(): string {
    if (this.state.sentFromUserId === game.userId) {
      return '';
    }
    let title = ' sent from ';
    let user = game.users.get(this.state.sentFromUserId);

    return title.concat(user ? user.name : 'unknown User');
  }

  private getTitleDuplication(): string {
    let title = '';
    if (this.state.duplicationNr > 0) {
      title = title.concat(' (', String(this.state.duplicationNr), ')');
    }
    return title;
  }

  private _onButtonClickSelectedActors() {
    canvas.tokens.controlled.forEach(token => {
      let newState = foundry.utils.deepClone(this.state);
      newState.isLinkedToToken = true;
      newState.actorUuid = token.actor ? token.actor.uuid : token.document.id;
      newState = this.generateActionsFromConditions(newState);

      handleToken({
        operation: 'token',
        state: newState,
        user: game.userId,
      } as EmitData);
    });
  }

  private _onButtonClickUpdateActors() {
    this.state = this.generateActionsFromConditions(this.state);
    this.render(false, {focus: false});
  }

  private _onHeaderDuplication() {
    let newState = foundry.utils.deepClone(this.state);

    handleDuplication({
      operation: 'duplication',
      state: newState,
      user: game.userId,
    } as EmitData);
  }

  private generateActionsFromConditions(oldState: DisplayActions2eData): DisplayActions2eData {
    let newState = foundry.utils.deepClone(oldState);
    // can only generate action if linked to a token
    if (oldState.actorUuid) {
      let actor = fromUuidSync(oldState.actorUuid) as ActorPF2e;
      // let actor = game.actors.tokens[oldState.tokenId!] as ActorPF2e;

      if (actor) {
        const [numOfActions, numOfReactions] = actionsFromConditions(actor.conditions);
        newState.numOfActions = numOfActions;
        newState.numOfReactions = numOfReactions;
        return newState;
      }
    }

    newState.numOfActions = 3;
    newState.numOfReactions = 1;
    return newState;
  }
}
