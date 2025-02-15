import {moduleId} from './constants';

const settingDuplicateId: SettingRegistration = {
  name: 'DisplayActions2e.Settings.DuplicateSetting',
  hint: 'DisplayActions2e.Settings.DuplicateHint',
  config: true,
  scope: 'client',
  type: Boolean,
  default: false,
};

const settingLinkActorId: SettingRegistration = {
  name: 'DisplayActions2e.Settings.LinkActorSetting',
  hint: 'DisplayActions2e.Settings.LinkActorHint',
  config: true,
  scope: 'client',
  type: Boolean,
  default: false,
};

const settingShowPlayerId: SettingRegistration = {
  name: 'DisplayActions2e.Settings.ShowPlayerSetting',
  hint: 'DisplayActions2e.Settings.ShowPlayerHint',
  config: true,
  scope: 'client',
  type: String,
  choices: {
    Hide: 'DisplayActions2e.Settings.ShowPlayerChoices.Hide',
    Normal: 'DisplayActions2e.Settings.ShowPlayerChoices.Normal',
    Chat: 'DisplayActions2e.Settings.ShowPlayerChoices.Chat',
    // TODO enable GM: 'DisplayActions2e.Settings.ShowPlayerChoices.GM',
  },
  default: 'Normal',
};

const settingUpdateTurnStart: SettingRegistration = {
  name: 'DisplayActions2e.Settings.UpdateTurnStart',
  hint: 'DisplayActions2e.Settings.UpdateTurnStartHint',
  config: true,
  scope: 'client',
  type: Boolean,
  default: false,
};

export function settingSetup(): void {
  game.settings.register(moduleId, 'DisplayActions2e.Settings.DuplicateId', settingDuplicateId);
  game.settings.register(moduleId, 'DisplayActions2e.Settings.LinkActorId', settingLinkActorId);
  game.settings.register(moduleId, 'DisplayActions2e.Settings.UpdateTurnStart', settingUpdateTurnStart);
  game.settings.register(moduleId, 'DisplayActions2e.Settings.ShowPlayerId', settingShowPlayerId);
}
