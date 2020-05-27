import { State } from './state';

export interface StartStopState extends State {
    isRunning?: boolean;
    isPaused?: boolean;
}
