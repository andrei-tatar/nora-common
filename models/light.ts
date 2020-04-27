import { BaseDevice } from './device';
import { BrightnessState } from './states/brightness';
import { ColorState } from './states/color';
import { OnOffState } from './states/onoff';

type BasicLightDevice = BaseDevice & {
    type: 'light';
    brightnessControl: false;
    colorControl?: false;
    state: OnOffState;
};

type LightDeviceWithBrightness = BaseDevice & {
    type: 'light';
    brightnessControl: true;
    turnOnWhenBrightnessChanges?: boolean; // when set: turn on light when brightness or color change
    colorControl?: false;
    state: BrightnessState & OnOffState;
};

type LightDeviceWithColor = BaseDevice & {
    type: 'light';
    brightnessControl: true;
    turnOnWhenBrightnessChanges?: boolean;
    colorControl: true;
    state: ColorState & BrightnessState & OnOffState;
};

export type LightDevice = BasicLightDevice | LightDeviceWithBrightness | LightDeviceWithColor;
