import { BaseDevice } from './device';
import { DockState } from './states/dock';
import { StartStopState } from './states/startstop';
// import { DockState } from './states/dock';
// import { LocatorState } from './states/locator';
// import { ModesState } from './states/modes';
// import { TogglesState } from './states/toggles';

interface BaseVacuum {
    type: 'vacuum';
    pausable?: boolean;
    state: StartStopState & DockState;
}

export type VacuumDevice = BaseDevice & BaseVacuum;
