import { BaseDevice } from './device';
import { OnOffState } from './states/onoff';
import { FanSpeedModeState, availableFanSpeedModes } from './states/fanspeedmode';
import { FanSpeedPercentState } from './states/fanspeedpercent';

type FanBase =  BaseDevice & {
    type: 'fan';
    availableFanSpeeds: availableFanSpeedModes;
    reversible: false;
    supportsFanSpeedPercent: false;
    commandOnlyFanSpeed: false;
    state: OnOffState & FanSpeedModeState;
}

type FanDeviceWithFanSpeedPercent = BaseDevice & {
    type: 'fan';
    availableFanSpeeds: availableFanSpeedModes;
    reversible: false;
    supportsFanSpeedPercent: true;
    commandOnlyFanSpeed: false;
    state: OnOffState & FanSpeedModeState & FanSpeedPercentState;
}

export type FanDevice = FanBase | FanDeviceWithFanSpeedPercent;
