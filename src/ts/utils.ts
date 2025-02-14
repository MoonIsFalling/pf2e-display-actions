import {ActorConditions, ActorPF2e, ScenePF2e, TokenDocumentPF2e} from 'foundry-pf2e';
import {DisplayActions2e} from './apps/displayActions';
import {moduleId} from './constants';
import {EmitData, MyModule} from './types';

export function handleShowToAll(data: EmitData) {
  const dialog = checkAndBuildApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`} as RenderOptions);
}

export function handleShowToSelection(data: EmitData) {
  if (data.userList?.includes(String(game.userId))) {
    const dialog = checkAndBuildApp(data);
    dialog.render(true, {id: `DisplayActions2e${data.user}`} as RenderOptions);
  }
}

export function handleShowWithPermission(data: EmitData) {
  handleShowToSelection(data);
}

export function handleUpdate(data: EmitData) {
  let module = game.modules.get(moduleId) as unknown as MyModule;
  let nameInTitle = game.users?.find((user: User) => {
    return user._id === data.state.sentFromUserId;
  })?.name;

  if (nameInTitle) {
    module.displayActions2e.forEach(app => {
      // check for title OR own application update
      // this is why checkForApp cannot be used
      if (app.title.includes(nameInTitle!) || data.state.sentFromUserId === game.userId) {
        app.setState(data.state);
        app.render(false, {id: `DisplayActions2e${data.user}`} as RenderOptions);
      }
    });
  }
}

export function handleToken(data: EmitData) {
  const dialog = checkAndBuildApp(data);
  dialog.render(true, {id: `DisplayActions2e${data.user}`} as RenderOptions);
}

export function handleDuplication(data: EmitData) {
  let newState = foundry.utils.deepClone(data.state);

  do {
    newState.duplicationNr += 1;
  } while (
    checkForApp({
      operation: data.operation,
      user: data.user,
      state: newState,
      userList: data.userList,
    })
  );

  const dialog = new DisplayActions2e(newState);
  const module = game.modules.get(moduleId) as unknown as MyModule;
  dialog.render(true, {id: `DisplayActions2e${data.user}${newState.duplicationNr}`} as RenderOptions);
  // push into list to wait for updates
  module.displayActions2e.push(dialog);
}

export function handleSendToChat(data: EmitData) {
  let app = checkForApp(data);
  if (app) {
    if (app.rendered) {
      // find the actions html, then wrap it to create "outerHtml"
      let msg = app.element.find('.window-content').find('.flexbox-actions').wrapAll('<div>').parent();
      ChatMessage.create({
        content: msg.html(),
      });
    }
  }
}

/**
 * helper function to check if the wanted app already exists in the module
 * @param data data from emit
 * @returns either found DisplayActions2e or undefined
 */
function checkForApp(data: EmitData): DisplayActions2e | undefined {
  let module = game.modules.get(moduleId) as unknown as MyModule;

  let app = module.displayActions2e.find(app => {
    let appState = app.getState();
    let control: boolean = appState.sentFromUserId === data.state.sentFromUserId;
    control = control && appState.duplicationNr.almostEqual(data.state.duplicationNr);
    control = control && appState.tokenId === data.state.tokenId;
    control = control && appState.isLinkedToToken === data.state.isLinkedToToken;

    return control;
  });

  return app;
}

/**
 * helper function to return the application from the modules or build a new one
 * immediatly pushes a new app into the list of modules
 * @param data data from emit
 * @returns either found DisplayActions2e or new DisplayActions2e with state
 */
function checkAndBuildApp(data: EmitData): DisplayActions2e {
  let module = game.modules.get(moduleId) as unknown as MyModule;
  let newApp: DisplayActions2e = new DisplayActions2e(data.state);
  let app = checkForApp(data);
  if (app) {
    return app;
  }
  // push into list to wait for updates
  module.displayActions2e.push(newApp);
  return newApp;
}

export function actionsFromConditions(
  conditions: ActorConditions<ActorPF2e<TokenDocumentPF2e<ScenePF2e> | null>>,
): [number, number] {
  let numOfActions = 3;
  let numOfReactions = 1;

  let stun = Number(conditions.stunned ? conditions.stunned.value : null);
  let slowed = Number(conditions.slowed ? conditions.slowed.value : null);
  let quicken = conditions.bySlug('quickened').length >= 1 ? 1 : 0;

  // if stunned no reactions
  if (stun > 0) {
    numOfReactions = 0;
  }

  // only the bigger value between stunned and slowed is relevant
  let decrementActions = stun >= slowed ? stun : slowed;

  numOfActions = numOfActions + quicken - decrementActions;

  return [numOfActions, numOfReactions];
}
