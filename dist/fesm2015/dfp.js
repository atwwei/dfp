import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import * as i0 from '@angular/core';
import { PLATFORM_ID, Injectable, Inject, Directive, Optional, Input, NgModule } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { filter, map, buffer, switchMap, takeUntil } from 'rxjs/operators';
import * as i2 from '@angular/router';
import { NavigationEnd } from '@angular/router';

class GptEvent {
    constructor(event) {
        Object.assign(this, event);
    }
}
class ImpressionViewableEvent extends GptEvent {
}
class SlotOnloadEvent extends GptEvent {
}
class SlotRenderEndedEvent extends GptEvent {
}
class SlotRequestedEvent extends GptEvent {
}
class SlotResponseReceived extends GptEvent {
}
class SlotVisibilityChangedEvent extends GptEvent {
}

const GPT_SOURCE = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
const DELAY_TIME = 50;

class DfpAction {
    constructor(slot) {
        this.slot = slot;
    }
}
class DfpAdDisplay extends DfpAction {
}
class DfpAdRefresh extends DfpAction {
}

class DfpService {
    constructor(platformId, document) {
        this.platformId = platformId;
        this.document = document;
        this.$queue = new Subject();
        this.$events = new Subject();
        if (isPlatformBrowser(this.platformId)) {
            this.initializeGPT();
            this.startActionQueue();
            this.addEventListeners();
        }
    }
    get events() {
        return this.$events.asObservable();
    }
    initializeGPT() {
        this.appendScript({ async: true, src: GPT_SOURCE });
        window.googletag = window.googletag || { cmd: [] };
    }
    startActionQueue() {
        const displaySlots = [];
        this.$queue
            .pipe(filter((act) => {
            if (act instanceof DfpAdDisplay) {
                displaySlots.push(act.slot);
                return false;
            }
            return (act instanceof DfpAdRefresh && displaySlots.indexOf(act.slot) === -1);
        }), map((act) => act.slot), buffer(this.$queue.pipe(switchMap(() => timer(DELAY_TIME * 2)))))
            .subscribe((refreshSlots) => {
            displaySlots.forEach((slot) => {
                googletag.display(slot);
            });
            displaySlots.splice(0);
            if (refreshSlots.length > 0) {
                googletag.pubads().refresh(refreshSlots);
            }
        });
    }
    addEventListeners() {
        googletag.cmd.push(() => {
            const pubads = googletag.pubads();
            pubads.addEventListener('impressionViewable', (event) => {
                this.$events.next(new ImpressionViewableEvent(event));
            });
            pubads.addEventListener('slotOnload', (event) => {
                this.$events.next(new SlotOnloadEvent(event));
            });
            pubads.addEventListener('slotRenderEnded', (event) => {
                this.$events.next(new SlotRenderEndedEvent(event));
            });
            pubads.addEventListener('slotRequested', (event) => {
                this.$events.next(new SlotRequestedEvent(event));
            });
            pubads.addEventListener('slotResponseReceived', (event) => {
                this.$events.next(new SlotResponseReceived(event));
            });
            pubads.addEventListener('slotVisibilityChanged', (event) => {
                this.$events.next(new SlotVisibilityChangedEvent(event));
            });
        });
    }
    clear(elementIds) {
        this.cmd(() => {
            googletag.pubads().clear(this.getSlots(elementIds));
        });
    }
    cmd(callback) {
        if (isPlatformBrowser(this.platformId)) {
            googletag.cmd.push(callback);
        }
    }
    destroySlots(elementIds) {
        this.cmd(() => {
            googletag.destroySlots(this.getSlots(elementIds));
        });
    }
    getSlots(elementIds) {
        let slots = undefined;
        if (isPlatformBrowser(this.platformId)) {
            if (googletag.apiReady && elementIds) {
                return googletag
                    .pubads()
                    .getSlots()
                    .filter((slot) => {
                    return elementIds.indexOf(slot.getSlotElementId()) !== -1;
                });
            }
        }
        return slots;
    }
    refresh(elementIds, opt_options) {
        this.cmd(() => {
            googletag.pubads().refresh(this.getSlots(elementIds), opt_options);
        });
    }
    queue(event) {
        this.$queue.next(event);
    }
    /**
     * Append Script tag to parentNode
     * @param options
     * @param parentNode The default setting is document.head
     * @returns
     */
    appendScript(options, parentNode) {
        parentNode = parentNode || this.document.head;
        const oldScript = options.id
            ? parentNode.querySelector('#' + options.id)
            : null;
        const script = this.document.createElement('script');
        Object.assign(script, options, {
            type: 'text/javascript',
        });
        if (oldScript) {
            parentNode.replaceChild(script, oldScript);
        }
        else {
            this.appendText('\n', parentNode);
            parentNode.appendChild(script);
            this.appendText('\n', parentNode);
        }
        return script;
    }
    appendText(data, parentNode) {
        parentNode = parentNode || this.document.head;
        const text = this.document.createTextNode(data);
        parentNode.appendChild(text);
        return text;
    }
}
DfpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpService, deps: [{ token: PLATFORM_ID }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
DfpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });

/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
class DfpAdDirective {
    constructor(viewContainer, templateRef, dfp, router, platformId) {
        this.viewContainer = viewContainer;
        this.templateRef = templateRef;
        this.dfp = dfp;
        this.$destroy = new Subject();
        this.$update = new Subject();
        if (isPlatformBrowser(platformId)) {
            this.$update
                .pipe(switchMap(() => timer(DELAY_TIME)), takeUntil(this.$destroy))
                .subscribe(() => {
                this.dfp.cmd(() => this.display());
            });
            router &&
                router.events
                    .pipe(filter((event) => event instanceof NavigationEnd), takeUntil(this.$destroy))
                    .subscribe((e) => {
                    this.$update.next();
                });
        }
    }
    set dfpAd(dfpAd) {
        if (typeof dfpAd === 'string') {
            this.unitPath = dfpAd;
        }
        else {
            Object.assign(this, dfpAd);
        }
    }
    display() {
        var _a, _b, _c;
        if ((_b = (_a = this.element) === null || _a === void 0 ? void 0 : _a.innerText) === null || _b === void 0 ? void 0 : _b.match(/\S+/)) {
            return;
        }
        if (this.slot && this.id === ((_c = this.element) === null || _c === void 0 ? void 0 : _c.id)) {
            this.settings(this.slot);
            this.dfp.queue(new DfpAdRefresh(this.slot));
        }
        else {
            this.destroy();
            if ((this.slot = this.define())) {
                googletag.enableServices();
                if (this.size && this.content) {
                    googletag.content().setContent(this.slot, this.content);
                }
                else {
                    this.dfp.queue(new DfpAdDisplay(this.slot));
                }
            }
            else {
                this.clear();
            }
        }
    }
    ngDoCheck() {
        var _a;
        if (((_a = this.element) === null || _a === void 0 ? void 0 : _a.id) && this.id !== this.element.id) {
            this.id = this.element.id;
            this.destroy();
            this.create();
        }
    }
    ngOnChanges(changes) {
        const change = changes['dfpAd'] || changes['id'] || changes['size'];
        if (change && !change.isFirstChange()) {
            this.clear();
        }
        this.create();
    }
    ngOnDestroy() {
        this.$destroy.next();
        this.clear();
    }
    create() {
        if (this.unitPath) {
            if (!this.element) {
                const view = this.viewContainer.createEmbeddedView(this.templateRef);
                this.element = view.rootNodes[0];
            }
            this.$update.next();
        }
        else {
            this.clear();
        }
    }
    clear() {
        this.viewContainer.clear();
        this.element = undefined;
        this.destroy();
    }
    define() {
        var _a;
        let slot;
        const id = ((_a = this.element) === null || _a === void 0 ? void 0 : _a.id) || this.id || '';
        if (this.size) {
            slot = googletag.defineSlot(this.unitPath, this.size, id);
        }
        else {
            slot = googletag.defineOutOfPageSlot(this.unitPath, id);
        }
        if (slot && this.element) {
            this.id = this.element.id = id || slot.getSlotElementId();
            return this.settings(slot);
        }
        return;
    }
    destroy() {
        if (this.slot) {
            googletag.destroySlots([this.slot]);
            this.slot = undefined;
        }
    }
    settings(slot) {
        if (this.size && this.content) {
            slot.addService(googletag.content());
        }
        else {
            if (this.sizeMapping) {
                slot.defineSizeMapping(this.sizeMapping);
            }
            slot.clearCategoryExclusions();
            if (this.categoryExclusion) {
                if (this.categoryExclusion instanceof Array) {
                    this.categoryExclusion.forEach((cat) => slot.setCategoryExclusion(cat));
                }
                else {
                    slot.setCategoryExclusion(this.categoryExclusion);
                }
            }
            if (typeof this.forceSafeFrame === 'boolean') {
                slot.setForceSafeFrame(this.forceSafeFrame);
            }
            if (this.safeFrameConfig) {
                slot.setSafeFrameConfig(this.safeFrameConfig);
            }
            slot.clearTargeting();
            if (this.targeting) {
                slot.updateTargetingFromMap(this.targeting);
            }
            if (this.collapseEmptyDiv instanceof Array) {
                slot.setCollapseEmptyDiv(this.collapseEmptyDiv[0], this.collapseEmptyDiv[1]);
            }
            else if (typeof this.collapseEmptyDiv === 'boolean') {
                slot.setCollapseEmptyDiv(this.collapseEmptyDiv);
            }
            if (this.clickUrl) {
                slot.setClickUrl(this.clickUrl);
            }
            if (this.adsense) {
                for (const key in this.adsense) {
                    slot.set(key, this.adsense[key]);
                }
            }
            slot.addService(googletag.pubads());
        }
        return slot;
    }
}
DfpAdDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpAdDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: DfpService }, { token: i2.Router, optional: true }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
DfpAdDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.1.1", type: DfpAdDirective, selector: "[dfpAd]", inputs: { dfpAd: "dfpAd", id: ["dfpAdId", "id"], size: ["dfpAdSize", "size"], sizeMapping: ["dfpAdSizeMapping", "sizeMapping"], categoryExclusion: ["dfpAdCategoryExclusion", "categoryExclusion"], clickUrl: ["dfpAdClickUrl", "clickUrl"], collapseEmptyDiv: ["dfpAdCollapseEmptyDiv", "collapseEmptyDiv"], forceSafeFrame: ["dfpAdForceSafeFrame", "forceSafeFrame"], safeFrameConfig: ["dfpAdSafeFrameConfig", "safeFrameConfig"], targeting: ["dfpAdTargeting", "targeting"], adsense: ["dfpAdAdsense", "adsense"], content: ["dfpAdContent", "content"] }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpAdDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dfpAd]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: DfpService }, { type: i2.Router, decorators: [{
                    type: Optional
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { dfpAd: [{
                type: Input
            }], id: [{
                type: Input,
                args: ['dfpAdId']
            }], size: [{
                type: Input,
                args: ['dfpAdSize']
            }], sizeMapping: [{
                type: Input,
                args: ['dfpAdSizeMapping']
            }], categoryExclusion: [{
                type: Input,
                args: ['dfpAdCategoryExclusion']
            }], clickUrl: [{
                type: Input,
                args: ['dfpAdClickUrl']
            }], collapseEmptyDiv: [{
                type: Input,
                args: ['dfpAdCollapseEmptyDiv']
            }], forceSafeFrame: [{
                type: Input,
                args: ['dfpAdForceSafeFrame']
            }], safeFrameConfig: [{
                type: Input,
                args: ['dfpAdSafeFrameConfig']
            }], targeting: [{
                type: Input,
                args: ['dfpAdTargeting']
            }], adsense: [{
                type: Input,
                args: ['dfpAdAdsense']
            }], content: [{
                type: Input,
                args: ['dfpAdContent']
            }] } });

const DFP_DIRECTIVES = [DfpAdDirective];
class DfpModule {
}
DfpModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DfpModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpModule, declarations: [DfpAdDirective], exports: [DfpAdDirective] });
DfpModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: DFP_DIRECTIVES,
                    exports: DFP_DIRECTIVES,
                }]
        }] });

/*
 * Public API Surface of dfp
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DfpAdDirective, DfpModule, DfpService, ImpressionViewableEvent, SlotOnloadEvent, SlotRenderEndedEvent, SlotRequestedEvent, SlotResponseReceived, SlotVisibilityChangedEvent };
//# sourceMappingURL=dfp.js.map
