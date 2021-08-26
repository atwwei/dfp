/// <reference types="googletag" />
import { Observable } from 'rxjs';
import { Event } from './events';
import { Action } from './actions';
import { ScriptOptions } from './types';
import * as i0 from "@angular/core";
export declare class DfpService {
    private platformId;
    private document;
    private $queue;
    private $events;
    get events(): Observable<Event>;
    constructor(platformId: Record<string, unknown>, document: Document);
    private initializeGPT;
    private startActionQueue;
    private addEventListeners;
    clear(elementIds?: string[]): void;
    cmd(callback: () => void): void;
    destroySlots(elementIds?: string[]): void;
    getSlots(elementIds?: string[]): googletag.Slot[] | undefined;
    refresh(elementIds?: string[], opt_options?: {
        changeCorrelator: boolean;
    }): void;
    queue(event: Action): void;
    /**
     * Append Script tag to parentNode
     * @param options
     * @param parentNode The default setting is document.head
     * @returns
     */
    appendScript(options: ScriptOptions, parentNode?: Element): HTMLScriptElement;
    appendText(data: string, parentNode?: Element): Text;
    static ɵfac: i0.ɵɵFactoryDeclaration<DfpService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DfpService>;
}
