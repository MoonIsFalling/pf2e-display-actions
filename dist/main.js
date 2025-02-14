const id = "pf2e-display-actions";
const moduleId = id;
const socketEvent = `module.${moduleId}`;
class SelectiveShowApp extends FormApplication {
  constructor(users, state) {
    super(users);
    this.userNameList = users;
    this.displayActionState = state;
  }
  static get defaultOptions() {
    var _a;
    const options = super.defaultOptions;
    options.id = "DisplayActions2e-selective-show";
    options.template = `modules/${moduleId}/templates/selectiveshow.html`;
    (_a = options.classes) == null ? void 0 : _a.push("selective-show");
    options.height = 265;
    options.width = 200;
    options.minimizable = true;
    options.resizable = true;
    options.title = game.i18n.localize("selectiveshow.SelectiveShow");
    return options;
  }
  async getData() {
    let data = await super.getData();
    data.users = game.users.filter((u) => u.active && u.data.id != game.user.id);
    return data;
  }
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".show").click((ev) => {
      var _a;
      ev.preventDefault();
      this._updateObject();
      (_a = game.socket) == null ? void 0 : _a.emit(socketEvent, {
        operation: "showToSelection",
        state: this.displayActionState,
        user: game.userId,
        userList: this.userNameList
      });
      this.close();
    });
    html.find(".show-all").click((ev) => {
      var _a;
      ev.preventDefault();
      this._updateObject();
      (_a = game.socket) == null ? void 0 : _a.emit(socketEvent, {
        operation: "showToAll",
        state: this.displayActionState,
        user: game.userId
      });
      this.close();
    });
    html.find(".show-permissions").click((ev) => {
      var _a;
      ev.preventDefault();
      this._updateObject();
      this.displayActionState.userListPermissions = this.userNameList;
      (_a = game.socket) == null ? void 0 : _a.emit(socketEvent, {
        operation: "showWithPermission",
        state: this.displayActionState,
        user: game.userId,
        userList: this.userNameList
      });
      this.close();
    });
    html.find(".send-to-chat").click((ev) => {
      ev.preventDefault();
      this._updateObject();
      handleSendToChat({
        state: this.displayActionState,
        user: game.userId
      });
      this.close();
    });
  }
  _updateObject() {
    let selector = Array.from(
      document.getElementsByClassName("selective-show-form")[0].children[0].children[0].children[0].children
    );
    this.userNameList = selector.map((element) => {
      if (element.selected) {
        return element.value;
      }
      return "";
    });
    let activeUserId = game.userId;
    if (activeUserId) {
      if (!this.userNameList.includes(activeUserId)) {
        this.userNameList.push(activeUserId);
      }
    }
    return new Promise(() => {
    });
  }
  _handleShowPlayers(state) {
    switch (game.settings.get(moduleId, "DisplayActions2e.Settings.ShowPlayerId")) {
      case "Normal":
        this.render(true);
        break;
      case "Chat":
        handleSendToChat({
          state: this.displayActionState,
          user: game.userId
        });
        break;
    }
    this.displayActionState = state;
  }
}
class DisplayActions2e extends Application {
  constructor(newState) {
    var _a;
    super();
    this.clickString = "symbolClick";
    this.actionImage = "systems/pf2e/icons/actions/OneAction.webp";
    this.reactionImage = "systems/pf2e/icons/actions/Reaction.webp";
    this.defaultNumOfActions = 3;
    this.defaultNumOfReactions = 1;
    this.isLinkedToActor = false;
    this.state = {
      numOfActions: this.defaultNumOfActions,
      numOfReactions: this.defaultNumOfReactions,
      classNameListActions: Array.from({ length: this.defaultNumOfActions }, () => "symbol"),
      classNameListReactions: Array.from({ length: this.defaultNumOfReactions }, () => "symbol"),
      sentFromUserId: String(game.userId),
      userListPermissions: [String(game.userId)],
      tokenId: void 0,
      isLinkedToToken: this.isLinkedToActor,
      duplicationNr: 0
    };
    this.showPlayerHandler = new SelectiveShowApp([String((_a = game.user) == null ? void 0 : _a.name)], this.state);
    if (newState) {
      this.state = newState;
    }
  }
  get title() {
    let title = game.i18n.localize("DisplayActions2e.WindowTitle");
    if (this.state.isLinkedToToken) {
      title = title.concat(this.getTitleToken());
    }
    title = title.concat(this.getTitleSentFrom());
    title = title.concat(this.getTitleDuplication());
    return title;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "DisplayActions2e",
      template: `modules/${moduleId}/templates/result.hbs`,
      width: 270,
      height: 140,
      resizable: true,
      title: "DisplayActions2e.WindowTitle"
    });
  }
  getData() {
    this.updateState();
    return {
      numOfActions: this.state.numOfActions,
      numOfReactions: this.state.numOfReactions,
      actionImagePayload: this.buildHandlebarPayload(
        this.state.numOfActions,
        { actionImage: this.actionImage },
        this.state.classNameListActions
      ),
      reactionImagePayload: this.buildHandlebarPayload(
        this.state.numOfReactions,
        { reactionImage: this.reactionImage },
        this.state.classNameListReactions
      ),
      isLinkedToActor: this.state.isLinkedToToken,
      isLinkActorButtonHidden: !game.settings.get(moduleId, "DisplayActions2e.Settings.LinkActorId")
    };
  }
  activateListeners(html) {
    super.activateListeners(html);
    if (this.state.userListPermissions.includes(String(game.userId))) {
      html.find("img.symbol").on("click", this._onClickSymbolImage.bind(this));
      html.find("input.input-counter").on("change", this._onChangeCountNumber.bind(this));
      html.find("button.actorLink").on("click", this._onButtonClickSelectedActors.bind(this));
      html.find("button.actorUpdate").on("click", this._onButtonClickUpdateActors.bind(this));
    }
  }
  _onClickSymbolImage(event) {
    event.preventDefault();
    const image = event.currentTarget;
    if (image === void 0 || image === null) {
      return;
    }
    image.classList.toggle(this.clickString);
    const pos = parseInt(image.id.slice(1));
    switch (image.id.charAt(0)) {
      case "a":
        this.state.classNameListActions[pos] = image.className;
        break;
      case "r":
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
  buildHandlebarPayload(iterator, imageObj, state) {
    let payload = [];
    for (let index = 0; index < iterator; index++) {
      payload.push(foundry.utils.mergeObject({ number: index, cssClass: state[index] }, imageObj));
    }
    return payload;
  }
  _onChangeCountNumber(event) {
    event.preventDefault();
    const input = event.currentTarget;
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      if (value >= 0) {
        switch (input.id) {
          case "count-action":
            this.state.numOfActions = value;
            break;
          case "count-reaction":
            this.state.numOfReactions = value;
            break;
          default:
            console.error(`${moduleId} incorrectly handled number of actions!`);
        }
        this.render();
        this.emitUpdate();
      }
    }
  }
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    const headerButton = {
      label: "JOURNAL.ActionShow",
      class: "share-image",
      icon: "fas fa-eye",
      onclick: () => this.showPlayerHandler._handleShowPlayers(this.state)
    };
    const headerButtonDuplication = {
      label: "DisplayActions2e.Duplication",
      class: "duplicate-app",
      icon: "fa fa-clone",
      onclick: () => this._onHeaderDuplication()
    };
    if (game.settings.get(moduleId, "DisplayActions2e.Settings.ShowPlayerId") !== "Hide") {
      buttons.unshift(headerButton);
    }
    if (game.settings.get(moduleId, "DisplayActions2e.Settings.DuplicateId")) {
      buttons.unshift(headerButtonDuplication);
    }
    return buttons;
  }
  /**
   * Update internal state based on the size of the arrays
   */
  updateState() {
    if (this.state.classNameListActions.length < this.state.numOfActions) {
      const tmp = Array.from(
        { length: this.state.numOfActions - this.state.classNameListActions.length },
        () => "symbol"
      );
      this.state.classNameListActions = this.state.classNameListActions.concat(tmp);
    } else if (this.state.classNameListActions.length > this.state.numOfActions) {
      const cut_value = this.state.classNameListActions.length - this.state.numOfActions;
      this.state.classNameListActions = this.state.classNameListActions.slice(0, cut_value);
    }
    if (this.state.classNameListReactions.length < this.state.numOfReactions) {
      const tmp = Array.from(
        { length: this.state.numOfReactions - this.state.classNameListReactions.length },
        () => "symbol"
      );
      this.state.classNameListReactions = this.state.classNameListReactions.concat(tmp);
    } else if (this.state.classNameListReactions.length > this.state.numOfReactions) {
      const cut_value = this.state.classNameListReactions.length - this.state.numOfReactions;
      this.state.classNameListReactions = this.state.classNameListReactions.slice(0, cut_value);
    }
  }
  emitUpdate() {
    var _a;
    (_a = game.socket) == null ? void 0 : _a.emit(socketEvent, {
      operation: "update",
      state: this.state,
      user: game.userId
    });
  }
  setState(newState) {
    this.state = foundry.utils.deepClone(newState);
  }
  /**
   * returns a clone of the state not a reference
   */
  getState() {
    return foundry.utils.deepClone(this.state);
  }
  /**
   * The following functions are only done because transpilation is bullying me and thus i cannot do an child of this class
   */
  getTitleToken() {
    let title = "";
    let name = canvas.tokens.get(this.state.tokenId);
    title = title.concat(" for ", String(name == null ? void 0 : name.name));
    return title;
  }
  getTitleSentFrom() {
    var _a;
    if (this.state.sentFromUserId === game.userId) {
      return "";
    }
    let title = " sent from ";
    let user = (_a = game.users) == null ? void 0 : _a.find((user2) => {
      return user2._id === this.state.sentFromUserId;
    });
    return title.concat(user ? user.name : "unknown User");
  }
  getTitleDuplication() {
    let title = "";
    if (this.state.duplicationNr > 0) {
      title = title.concat(" (", String(this.state.duplicationNr), ")");
    }
    return title;
  }
  _onButtonClickSelectedActors() {
    canvas.tokens.controlled.forEach((token) => {
      let tokenDocument = token.document;
      let newState = foundry.utils.deepClone(this.state);
      newState.isLinkedToToken = true;
      newState.tokenId = tokenDocument.id;
      newState = this.generateActionsFromConditions(newState);
      handleToken({
        state: newState,
        user: game.userId
      });
    });
  }
  _onButtonClickUpdateActors() {
    this.state = this.generateActionsFromConditions(this.state);
    this.render();
  }
  _onHeaderDuplication() {
    let newState = foundry.utils.deepClone(this.state);
    handleDuplication({
      state: newState,
      user: game.userId
    });
  }
  generateActionsFromConditions(oldState) {
    var _a;
    let newState = foundry.utils.deepClone(oldState);
    let actor = (_a = canvas.tokens.get(oldState.tokenId)) == null ? void 0 : _a.document.actor;
    if (actor) {
      let conditions = actor.conditions;
      let [numOfActions, numOfReactions] = actionsFromConditions(conditions);
      newState.numOfActions = numOfActions;
      newState.numOfReactions = numOfReactions;
      return newState;
    }
    newState.numOfActions = 3;
    newState.numOfReactions = 1;
    return newState;
  }
}
function handleShowToAll(data) {
  const dialog = checkAndBuildApp(data);
  dialog.render(true, { id: `DisplayActions2e${data.user}` });
}
function handleShowToSelection(data) {
  var _a;
  if ((_a = data.userList) == null ? void 0 : _a.includes(String(game.userId))) {
    const dialog = checkAndBuildApp(data);
    dialog.render(true, { id: `DisplayActions2e${data.user}` });
  }
}
function handleShowWithPermission(data) {
  handleShowToSelection(data);
}
function handleUpdate(data) {
  var _a, _b;
  let module2 = game.modules.get(moduleId);
  let nameInTitle = (_b = (_a = game.users) == null ? void 0 : _a.find((user) => {
    return user._id === data.state.sentFromUserId;
  })) == null ? void 0 : _b.name;
  if (nameInTitle) {
    module2.displayActions2e.forEach((app) => {
      if (app.title.includes(nameInTitle) || data.state.sentFromUserId === game.userId) {
        app.setState(data.state);
        app.render(false, { id: `DisplayActions2e${data.user}` });
      }
    });
  }
}
function handleToken(data) {
  const dialog = checkAndBuildApp(data);
  dialog.render(true, { id: `DisplayActions2e${data.user}` });
}
function handleDuplication(data) {
  let newState = foundry.utils.deepClone(data.state);
  do {
    newState.duplicationNr += 1;
  } while (checkForApp({
    state: newState
  }));
  const dialog = new DisplayActions2e(newState);
  const module2 = game.modules.get(moduleId);
  dialog.render(true, { id: `DisplayActions2e${data.user}${newState.duplicationNr}` });
  module2.displayActions2e.push(dialog);
}
function handleSendToChat(data) {
  let app = checkForApp(data);
  if (app) {
    if (app.rendered) {
      let msg = app.element.find(".window-content").find(".flexbox-actions").wrapAll("<div>").parent();
      ChatMessage.create({
        content: msg.html()
      });
    }
  }
}
function checkForApp(data) {
  let module2 = game.modules.get(moduleId);
  let app = module2.displayActions2e.find((app2) => {
    let appState = app2.getState();
    let control = appState.sentFromUserId === data.state.sentFromUserId;
    control = control && appState.duplicationNr.almostEqual(data.state.duplicationNr);
    control = control && appState.tokenId === data.state.tokenId;
    control = control && appState.isLinkedToToken === data.state.isLinkedToToken;
    return control;
  });
  return app;
}
function checkAndBuildApp(data) {
  let module2 = game.modules.get(moduleId);
  let newApp = new DisplayActions2e(data.state);
  let app = checkForApp(data);
  if (app) {
    return app;
  }
  module2.displayActions2e.push(newApp);
  return newApp;
}
function actionsFromConditions(conditions) {
  let numOfActions = 3;
  let numOfReactions = 1;
  let stun = Number(conditions.stunned ? conditions.stunned.value : null);
  let slowed = Number(conditions.slowed ? conditions.slowed.value : null);
  let quicken = Number(conditions.bySlug("quickened")[0].value);
  if (stun > 0) {
    numOfReactions = 0;
  }
  let decrementActions = stun >= slowed ? stun : slowed;
  numOfActions = numOfActions + quicken - decrementActions;
  return [numOfActions, numOfReactions];
}
const settingDuplicateId = {
  name: "DisplayActions2e.Settings.DuplicateSetting",
  hint: "DisplayActions2e.Settings.DuplicateHint",
  config: true,
  scope: "client",
  type: Boolean,
  default: false
};
const settingLinkActorId = {
  name: "DisplayActions2e.Settings.LinkActorSetting",
  hint: "DisplayActions2e.Settings.LinkActorHint",
  config: true,
  scope: "client",
  type: Boolean,
  default: false
};
const settingShowPlayerId = {
  name: "DisplayActions2e.Settings.ShowPlayerSetting",
  hint: "DisplayActions2e.Settings.ShowPlayerHint",
  config: true,
  scope: "client",
  type: String,
  choices: {
    Hide: "DisplayActions2e.Settings.ShowPlayerChoices.Hide",
    Normal: "DisplayActions2e.Settings.ShowPlayerChoices.Normal",
    Chat: "DisplayActions2e.Settings.ShowPlayerChoices.Chat"
    // TODO enable GM: 'DisplayActions2e.Settings.ShowPlayerChoices.GM',
  },
  default: "Normal"
};
function settingSetup() {
  game.settings.register(moduleId, "DisplayActions2e.Settings.DuplicateId", settingDuplicateId);
  game.settings.register(moduleId, "DisplayActions2e.Settings.LinkActorId", settingLinkActorId);
  game.settings.register(moduleId, "DisplayActions2e.Settings.ShowPlayerId", settingShowPlayerId);
}
let module;
let homeDisplayActions;
Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);
});
Hooks.on("getSceneControlButtons", (hudButtons) => {
  var _a;
  let hud = hudButtons.find((value) => {
    return value.name === "token";
  });
  let tool = {
    name: "DisplayActions2e.ButtonName",
    title: "DisplayActions2e.ButtonHint",
    icon: "pf2-icon icon-action",
    button: true,
    visible: true,
    onClick: async () => {
      var _a2;
      homeDisplayActions.render(true);
      (_a2 = game.socket) == null ? void 0 : _a2.emit("module.DisplayActions2e", { event: "DisplayActions2e" });
    }
  };
  (_a = hud == null ? void 0 : hud.tools) == null ? void 0 : _a.push(tool);
});
Hooks.on("ready", () => {
  var _a;
  module = game.modules.get(moduleId);
  settingSetup();
  homeDisplayActions = new DisplayActions2e();
  module.displayActions2e = [homeDisplayActions];
  (_a = game.socket) == null ? void 0 : _a.on(socketEvent, (data) => {
    switch (data.operation) {
      case "showToAll":
        handleShowToAll(data);
        break;
      case "showToSelection":
        handleShowToSelection(data);
        break;
      case "showWithPermission":
        handleShowWithPermission(data);
        break;
      case "update":
        handleUpdate(data);
        break;
      default:
        console.log(data);
        break;
    }
  });
});
//# sourceMappingURL=main.js.map
