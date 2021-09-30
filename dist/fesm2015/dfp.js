import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import * as i0 from '@angular/core';
import { PLATFORM_ID, Injectable, Inject, Directive, Optional, Input, NgModule } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { buffer, switchMap, takeUntil, filter } from 'rxjs/operators';
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

class SlotRequest {
    constructor(slot) {
        this.slot = slot;
    }
}
class DisplaySlot extends SlotRequest {
}
class RefreshSlot extends SlotRequest {
}

class DfpService {
    constructor(platformId, document) {
        this.platformId = platformId;
        this.document = document;
        this.$singleRequest = new Subject();
        this.$events = new Subject();
        if (isPlatformBrowser(this.platformId)) {
            this.init();
        }
    }
    get events() {
        return this.$events.asObservable();
    }
    init() {
        // GPT
        if (!window.googletag) {
            this.appendScript({ async: true, src: GPT_SOURCE });
            window.googletag = window.googletag || { cmd: [] };
        }
        // Single Request Queue
        this.$singleRequest
            .pipe(buffer(this.$singleRequest.pipe(switchMap(() => timer(DELAY_TIME * 2)))))
            .subscribe((acts) => {
            acts.forEach((act) => {
                if (act instanceof DisplaySlot) {
                    googletag.display(act.slot);
                }
                else if (act instanceof RefreshSlot) {
                    googletag.pubads().refresh([act.slot], { changeCorrelator: false });
                }
            });
        });
        // Event Listeners
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
    define(ad) {
        let slot;
        let id = ad.id || '';
        if (id) {
            const slotExists = this.getSlot(id);
            if ((slotExists === null || slotExists === void 0 ? void 0 : slotExists.getAdUnitPath()) === ad.unitPath) {
                slot = slotExists;
            }
            else if (slotExists) {
                this.destroy(slotExists);
            }
        }
        if (!slot) {
            if (ad.size) {
                slot = googletag.defineSlot(ad.unitPath, ad.size, id);
            }
            else {
                slot = googletag.defineOutOfPageSlot(ad.unitPath, id);
            }
            if (!slot) {
                return;
            }
        }
        if (ad.size && ad.content) {
            slot.addService(googletag.content());
            googletag.enableServices();
            googletag.content().setContent(slot, ad.content);
        }
        else {
            if (ad.sizeMapping) {
                slot.defineSizeMapping(ad.sizeMapping);
            }
            slot.clearCategoryExclusions();
            if (ad.categoryExclusion) {
                if (ad.categoryExclusion instanceof Array) {
                    ad.categoryExclusion.forEach((cat) => slot === null || slot === void 0 ? void 0 : slot.setCategoryExclusion(cat));
                }
                else {
                    slot.setCategoryExclusion(ad.categoryExclusion);
                }
            }
            if (typeof ad.forceSafeFrame === 'boolean') {
                slot.setForceSafeFrame(ad.forceSafeFrame);
            }
            if (ad.safeFrameConfig) {
                slot.setSafeFrameConfig(ad.safeFrameConfig);
            }
            slot.clearTargeting();
            if (ad.targeting) {
                slot.updateTargetingFromMap(ad.targeting);
            }
            if (ad.collapseEmptyDiv instanceof Array) {
                slot.setCollapseEmptyDiv(ad.collapseEmptyDiv[0], ad.collapseEmptyDiv[1]);
            }
            else if (typeof ad.collapseEmptyDiv === 'boolean') {
                slot.setCollapseEmptyDiv(ad.collapseEmptyDiv);
            }
            if (ad.clickUrl) {
                slot.setClickUrl(ad.clickUrl);
            }
            if (ad.adsense) {
                for (const key in ad.adsense) {
                    slot.set(key, ad.adsense[key]);
                }
            }
            slot.addService(googletag.pubads());
            googletag.enableServices();
        }
        return slot;
    }
    display(slot) {
        if (googletag.pubads().isSRA()) {
            this.$singleRequest.next(new DisplaySlot(slot));
        }
        else {
            googletag.display(slot);
        }
    }
    refresh(slot) {
        if (googletag.pubads().isSRA()) {
            this.$singleRequest.next(new RefreshSlot(slot));
        }
        else {
            googletag.pubads().refresh([slot]);
        }
    }
    destroy(slot) {
        googletag.destroySlots([slot]);
    }
    /**
     * Get the slot by element id
     * @param elementId the slot element id
     * @returns
     */
    getSlot(elementId) {
        return this.getSlots().find((slot) => elementId === slot.getSlotElementId());
    }
    /**
     * Get the list of slots associated with this service.
     * @param elementIds the slot element id array.
     * @returns
     */
    getSlots(elementIds) {
        let slots = googletag.pubads().getSlots();
        if (typeof elementIds !== 'undefined') {
            slots = slots.filter((slot) => elementIds.indexOf(slot.getSlotElementId()) != -1);
        }
        return slots;
    }
    /**
     * Use googletag.cmd.push() to execute the callback function.
     * @param callback
     */
    cmd(callback) {
        if (isPlatformBrowser(this.platformId)) {
            googletag.cmd.push(callback);
        }
    }
    appendScript(options, parentNode) {
        parentNode = parentNode || this.document.head;
        const oldScript = options.id
            ? parentNode.querySelector('#' + options.id)
            : null;
        const script = this.document.createElement('script');
        Object.assign(script, options, { type: 'text/javascript' });
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
        this.router = router;
        this.$destroy = new Subject();
        this.$update = new Subject();
        if (isPlatformBrowser(platformId)) {
            this.init();
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
    init() {
        this.$update
            .pipe(switchMap(() => timer(DELAY_TIME)), takeUntil(this.$destroy))
            .subscribe(() => {
            this.dfp.cmd(() => this.display());
        });
        this.router &&
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd), takeUntil(this.$destroy))
                .subscribe(() => {
                this.$update.next();
            });
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
    display() {
        var _a, _b;
        if (!this.element || ((_b = (_a = this.element) === null || _a === void 0 ? void 0 : _a.innerText) === null || _b === void 0 ? void 0 : _b.match(/\S+/))) {
            return;
        }
        if (this.slot && this.id === this.element.id) {
            this.dfp.define(Object.assign({}, this));
            this.dfp.refresh(this.slot);
        }
        else {
            this.destroy();
            const id = this.element.id || this.id;
            if ((this.slot = this.dfp.define(Object.assign({}, this, { id: id })))) {
                this.id = this.element.id = id || this.slot.getSlotElementId();
                this.dfp.display(this.slot);
            }
            else {
                this.clear();
            }
        }
    }
    clear() {
        this.viewContainer.clear();
        this.element = undefined;
        this.destroy();
    }
    destroy() {
        if (this.slot) {
            this.dfp.destroy(this.slot);
            this.slot = undefined;
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
