/// <reference types="googletag" />
import { Observable } from 'rxjs';
import { Event } from './events';
import { ScriptOptions, DfpAd } from './types';
import * as i0 from "@angular/core";
export declare class DfpService {
    private platformId;
    private document;
    private $singleRequest;
    private $events;
    get events(): Observable<Event>;
    constructor(platformId: Record<string, unknown>, document: Document);
    private init;
    define(ad: DfpAd): googletag.Slot | undefined;
    display(slot: googletag.Slot): void;
    refresh(slot: googletag.Slot): void;
    destroy(slot: googletag.Slot): void;
    /**
     * Get the slot by element id
     * @param elementId the slot element id
     * @returns
     */
    getSlot(elementId: string): googletag.Slot | undefined;
    /**
     * Get the list of slots associated with this service.
     * @param elementIds the slot element id array.
     * @returns
     */
    getSlots(elementIds?: string[]): googletag.Slot[];
    /**
     * Use googletag.cmd.push() to execute the callback function.
     * @param callback
     */
    cmd(callback: () => void): void;
    appendScript(options: ScriptOptions, parentNode?: Element): HTMLScriptElement;
    appendText(data: string, parentNode?: Element): Text;
    static ɵfac: i0.ɵɵFactoryDeclaration<DfpService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DfpService>;
}
