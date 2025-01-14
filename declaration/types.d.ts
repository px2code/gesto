import { IObject } from "@daybrush/utils";
import { EmitterParam } from "@scena/event-emitter";
import Gesto from "./Gesto";
export interface Client {
    clientX: number;
    clientY: number;
    originalClientX?: number;
    originalClientY?: number;
}
export interface Dist {
    distX: number;
    distY: number;
}
export interface Delta {
    deltaX: number;
    deltaY: number;
}
export interface Position extends Client, Dist, Delta {
}
export interface OnDragStart<T = Gesto> extends Position, EmitterParam<T> {
    datas: IObject<any>;
    inputEvent: any;
    isTrusted: any;
    isDouble: boolean;
}
export interface OnDrag<T = Gesto> extends Position, EmitterParam<T> {
    isDrag: boolean;
    isPinch: boolean;
    movement: number;
    datas: IObject<any>;
    isScroll: boolean;
    inputEvent: any;
}
export interface OnDragEnd<T = Gesto> extends Position, EmitterParam<T> {
    isDrag: boolean;
    isDouble: boolean;
    datas: IObject<any>;
    inputEvent: any;
}
export interface OnPinchStart<T = Gesto> extends Position, EmitterParam<T> {
    datas: IObject<any>;
    touches: Position[];
    angle: number;
    inputEvent: any;
}
export interface OnPinch<T = Gesto> extends Position, EmitterParam<T> {
    datas: IObject<any>;
    touches: Position[];
    rotation: number;
    angle: number;
    scale: number;
    distance: number;
    movement: number;
    inputEvent: any;
}
export interface OnPinchEnd<T = Gesto> extends Position, EmitterParam<T> {
    isPinch: boolean;
    datas: IObject<any>;
    touches: Position[];
    inputEvent: any;
}
export interface GestoOptions {
    container?: Window | Node | Element;
    events?: Array<"mouse" | "touch">;
    preventRightClick?: boolean;
    preventDefault?: boolean;
    pinchThreshold?: number;
    pinchOutside?: boolean;
    checkInput?: boolean;
    checkWindowBlur?: boolean;
    iframeSelector: string;
}
export declare type GestoEvents = {
    "dragStart": OnDragStart;
    "drag": OnDrag;
    "dragEnd": OnDragEnd;
    "pinchStart": OnPinchStart;
    "pinch": OnPinch;
    "pinchEnd": OnPinchEnd;
};
