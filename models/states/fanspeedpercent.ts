import { State } from './state';

export interface FanSpeedPercentState extends State {
    /**
     * @minimum 0
     * @maximum 100
     */
    currentFanSpeedPercent: number;
}
