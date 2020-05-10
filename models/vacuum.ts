import { BaseDevice } from './device';
import { DockState } from './states/dock';
import { StartStopState } from './states/startstop';

interface BaseVacuum {
    type: 'vacuum';
    pausable?: boolean;
    state: StartStopState & DockState;
}

export type VacuumDevice = BaseDevice & BaseVacuum;
