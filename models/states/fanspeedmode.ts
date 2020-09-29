import { State } from './state';

export type availableFanSpeedModes = {
    'speeds': [
    {
        'speed_name': 'S1',
        'speed_values': [{
            'speed_synonym': ['low', 'speed 1'],
            'lang': 'en'
        }]
    },
    {
        'speed_name': 'S2',
        'speed_values': [{
            'speed_synonym': ['medium', 'speed 2'],
            'lang': 'en'
        }]
    },
    {
        'speed_name': 'S3',
        'speed_values': [{
            'speed_synonym': ['high', 'speed 3'],
            'lang': 'en'
        }]
    },
    {
        'speed_name': 'S4',
        'speed_values': [{
            'speed_synonym': ['max', 'speed 4'],
            'lang': 'en'
        }]
    }
    ],
    'ordered': true
}

export type FanSpeedMode = 'S1' | 'S2' | 'S3' | 'S4';

export interface FanSpeedModeState extends State {
     currentFanSpeedSetting: FanSpeedMode;
}
