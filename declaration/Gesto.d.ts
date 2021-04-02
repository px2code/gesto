import { Client, OnDrag, GestoOptions, GestoEvents } from "./types";
import EventEmitter, { TargetParam } from "@scena/event-emitter";
import { IObject } from "@daybrush/utils";
declare class Gesto extends EventEmitter<GestoEvents> {
    options: GestoOptions;
    private flag;
    private pinchFlag;
    private datas;
    private isDrag;
    private isPinch;
    private isMouse;
    private isTouch;
    private clientStores;
    private targets;
    private prevTime;
    private doubleFlag;
    constructor(targets: Array<Element | Window> | Element | Window, options?: GestoOptions);
    getMovement(clients?: Client[]): number;
    isDragging(): boolean;
    isFlag(): boolean;
    isPinchFlag(): boolean;
    isDoubleFlag(): boolean;
    isPinching(): boolean;
    scrollBy(deltaX: number, deltaY: number, e: any, isCallDrag?: boolean): void;
    move([deltaX, deltaY]: number[], inputEvent: any): TargetParam<OnDrag>;
    triggerDragStart(e: any): void;
    setEventDatas(datas: IObject<any>): this;
    getEventDatas(): IObject<any>;
    unset(): void;
    onDragStart: (e: any, isTrusted?: boolean) => false | undefined;
    onDrag: (e: any, isScroll?: boolean | undefined) => void;
    onDragEnd: (e?: any) => void;
    onPinchStart(e: TouchEvent): void;
    onPinch(e: TouchEvent, clients: Client[]): void;
    onPinchEnd(e: TouchEvent): void;
    private initDrag;
    private getCurrentStore;
    private moveClients;
    private onBlur;
}
export default Gesto;
