/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import { Directive, Inject, Input, Optional, PLATFORM_ID, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { DELAY_TIME } from './consts';
import { DfpAdDisplay, DfpAdRefresh } from './actions';
import * as i0 from "@angular/core";
import * as i1 from "./dfp.service";
import * as i2 from "@angular/router";
export class DfpAdDirective {
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
DfpAdDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpAdDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i1.DfpService }, { token: i2.Router, optional: true }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
DfpAdDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.1.1", type: DfpAdDirective, selector: "[dfpAd]", inputs: { dfpAd: "dfpAd", id: ["dfpAdId", "id"], size: ["dfpAdSize", "size"], sizeMapping: ["dfpAdSizeMapping", "sizeMapping"], categoryExclusion: ["dfpAdCategoryExclusion", "categoryExclusion"], clickUrl: ["dfpAdClickUrl", "clickUrl"], collapseEmptyDiv: ["dfpAdCollapseEmptyDiv", "collapseEmptyDiv"], forceSafeFrame: ["dfpAdForceSafeFrame", "forceSafeFrame"], safeFrameConfig: ["dfpAdSafeFrameConfig", "safeFrameConfig"], targeting: ["dfpAdTargeting", "targeting"], adsense: ["dfpAdAdsense", "adsense"], content: ["dfpAdContent", "content"] }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0, type: DfpAdDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dfpAd]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i1.DfpService }, { type: i2.Router, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGZwLWFkLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGZwLWFkLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2REFBNkQ7QUFDN0QsT0FBTyxFQUNMLFNBQVMsRUFFVCxNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFDUixXQUFXLEdBSVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGFBQWEsRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxXQUFXLENBQUM7Ozs7QUFNdkQsTUFBTSxPQUFPLGNBQWM7SUE0QnpCLFlBQ1UsYUFBK0IsRUFDL0IsV0FBaUMsRUFDakMsR0FBZSxFQUNYLE1BQWMsRUFDTCxVQUFrQjtRQUovQixrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDL0IsZ0JBQVcsR0FBWCxXQUFXLENBQXNCO1FBQ2pDLFFBQUcsR0FBSCxHQUFHLENBQVk7UUE5QmpCLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ3pCLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBaUM5QixJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxPQUFPO2lCQUNULElBQUksQ0FDSCxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQ2xDLFNBQVMsQ0FB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UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7OzJHQW5NVSxjQUFjLDZJQWlDZixXQUFXOytGQWpDVixjQUFjOzJGQUFkLGNBQWM7a0JBSDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFNBQVM7aUJBQ3BCOzswQkFpQ0ksUUFBUTs4QkFDd0IsTUFBTTswQkFBdEMsTUFBTTsyQkFBQyxXQUFXOzRDQTNCUixLQUFLO3NCQUFqQixLQUFLO2dCQVFZLEVBQUU7c0JBQW5CLEtBQUs7dUJBQUMsU0FBUztnQkFDSSxJQUFJO3NCQUF2QixLQUFLO3VCQUFDLFdBQVc7Z0JBQ1MsV0FBVztzQkFBckMsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBQ1EsaUJBQWlCO3NCQUFqRCxLQUFLO3VCQUFDLHdCQUF3QjtnQkFDUCxRQUFRO3NCQUEvQixLQUFLO3VCQUFDLGVBQWU7Z0JBQ1UsZ0JBQWdCO3NCQUEvQyxLQUFLO3VCQUFDLHVCQUF1QjtnQkFHQSxjQUFjO3NCQUEzQyxLQUFLO3VCQUFDLHFCQUFxQjtnQkFDRyxlQUFlO3NCQUE3QyxLQUFLO3VCQUFDLHNCQUFzQjtnQkFDSixTQUFTO3NCQUFqQyxLQUFLO3VCQUFDLGdCQUFnQjtnQkFDQSxPQUFPO3NCQUE3QixLQUFLO3VCQUFDLGNBQWM7Z0JBQ0UsT0FBTztzQkFBN0IsS0FBSzt1QkFBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQGFuZ3VsYXItZXNsaW50L25vLWNvbmZsaWN0aW5nLWxpZmVjeWNsZSAqL1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFBMQVRGT1JNX0lELFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3ViamVjdCwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgc3dpdGNoTWFwLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IERFTEFZX1RJTUUgfSBmcm9tICcuL2NvbnN0cyc7XG5pbXBvcnQgeyBEZnBTZXJ2aWNlIH0gZnJvbSAnLi9kZnAuc2VydmljZSc7XG5pbXBvcnQgeyBEZnBBZERpc3BsYXksIERmcEFkUmVmcmVzaCB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBEZnBBZCB9IGZyb20gJy4vdHlwZXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZGZwQWRdJyxcbn0pXG5leHBvcnQgY2xhc3MgRGZwQWREaXJlY3RpdmUgaW1wbGVtZW50cyBEb0NoZWNrLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgJGRlc3Ryb3kgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlICR1cGRhdGUgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIGVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzbG90PzogZ29vZ2xldGFnLlNsb3Q7XG5cbiAgQElucHV0KCkgc2V0IGRmcEFkKGRmcEFkOiBzdHJpbmcgfCBEZnBBZCkge1xuICAgIGlmICh0eXBlb2YgZGZwQWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnVuaXRQYXRoID0gZGZwQWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGZwQWQpO1xuICAgIH1cbiAgfVxuICB1bml0UGF0aCE6IHN0cmluZztcbiAgQElucHV0KCdkZnBBZElkJykgaWQ/OiBzdHJpbmc7XG4gIEBJbnB1dCgnZGZwQWRTaXplJykgc2l6ZT86IGdvb2dsZXRhZy5HZW5lcmFsU2l6ZTtcbiAgQElucHV0KCdkZnBBZFNpemVNYXBwaW5nJykgc2l6ZU1hcHBpbmc/OiBnb29nbGV0YWcuU2l6ZU1hcHBpbmdBcnJheTtcbiAgQElucHV0KCdkZnBBZENhdGVnb3J5RXhjbHVzaW9uJykgY2F0ZWdvcnlFeGNsdXNpb24/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbiAgQElucHV0KCdkZnBBZENsaWNrVXJsJykgY2xpY2tVcmw/OiBzdHJpbmc7XG4gIEBJbnB1dCgnZGZwQWRDb2xsYXBzZUVtcHR5RGl2JykgY29sbGFwc2VFbXB0eURpdj86XG4gICAgfCBib29sZWFuXG4gICAgfCBbYm9vbGVhbiwgYm9vbGVhbl07XG4gIEBJbnB1dCgnZGZwQWRGb3JjZVNhZmVGcmFtZScpIGZvcmNlU2FmZUZyYW1lPzogYm9vbGVhbjtcbiAgQElucHV0KCdkZnBBZFNhZmVGcmFtZUNvbmZpZycpIHNhZmVGcmFtZUNvbmZpZz86IGdvb2dsZXRhZy5TYWZlRnJhbWVDb25maWc7XG4gIEBJbnB1dCgnZGZwQWRUYXJnZXRpbmcnKSB0YXJnZXRpbmc/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBzdHJpbmdbXT47XG4gIEBJbnB1dCgnZGZwQWRBZHNlbnNlJykgYWRzZW5zZT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIEBJbnB1dCgnZGZwQWRDb250ZW50JykgY29udGVudD86IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8dW5rbm93bj4sXG4gICAgcHJpdmF0ZSBkZnA6IERmcFNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcm91dGVyOiBSb3V0ZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0LFxuICApIHtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuJHVwZGF0ZVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gdGltZXIoREVMQVlfVElNRSkpLFxuICAgICAgICAgIHRha2VVbnRpbCh0aGlzLiRkZXN0cm95KSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRmcC5jbWQoKCkgPT4gdGhpcy5kaXNwbGF5KCkpO1xuICAgICAgICB9KTtcblxuICAgICAgcm91dGVyICYmXG4gICAgICAgIHJvdXRlci5ldmVudHNcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcigoZXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCksXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy4kZGVzdHJveSksXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuJHVwZGF0ZS5uZXh0KCk7XG4gICAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Py5pbm5lclRleHQ/Lm1hdGNoKC9cXFMrLykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zbG90ICYmIHRoaXMuaWQgPT09IHRoaXMuZWxlbWVudD8uaWQpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3ModGhpcy5zbG90KTtcbiAgICAgIHRoaXMuZGZwLnF1ZXVlKG5ldyBEZnBBZFJlZnJlc2godGhpcy5zbG90KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgaWYgKCh0aGlzLnNsb3QgPSB0aGlzLmRlZmluZSgpKSkge1xuICAgICAgICBnb29nbGV0YWcuZW5hYmxlU2VydmljZXMoKTtcbiAgICAgICAgaWYgKHRoaXMuc2l6ZSAmJiB0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICBnb29nbGV0YWcuY29udGVudCgpLnNldENvbnRlbnQodGhpcy5zbG90LCB0aGlzLmNvbnRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGZwLnF1ZXVlKG5ldyBEZnBBZERpc3BsYXkodGhpcy5zbG90KSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZWxlbWVudD8uaWQgJiYgdGhpcy5pZCAhPT0gdGhpcy5lbGVtZW50LmlkKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5lbGVtZW50LmlkO1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNyZWF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzWydkZnBBZCddIHx8IGNoYW5nZXNbJ2lkJ10gfHwgY2hhbmdlc1snc2l6ZSddO1xuICAgIGlmIChjaGFuZ2UgJiYgIWNoYW5nZS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuJGRlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnVuaXRQYXRoKSB7XG4gICAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy52aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gdmlldy5yb290Tm9kZXNbMF07XG4gICAgICB9XG4gICAgICB0aGlzLiR1cGRhdGUubmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdDb250YWluZXIuY2xlYXIoKTtcbiAgICB0aGlzLmVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBwcml2YXRlIGRlZmluZSgpOiBnb29nbGV0YWcuU2xvdCB8IHVuZGVmaW5lZCB7XG4gICAgbGV0IHNsb3Q6IGdvb2dsZXRhZy5TbG90IHwgbnVsbDtcbiAgICBjb25zdCBpZCA9IHRoaXMuZWxlbWVudD8uaWQgfHwgdGhpcy5pZCB8fCAnJztcbiAgICBpZiAodGhpcy5zaXplKSB7XG4gICAgICBzbG90ID0gZ29vZ2xldGFnLmRlZmluZVNsb3QodGhpcy51bml0UGF0aCwgdGhpcy5zaXplLCBpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsb3QgPSBnb29nbGV0YWcuZGVmaW5lT3V0T2ZQYWdlU2xvdCh0aGlzLnVuaXRQYXRoLCBpZCk7XG4gICAgfVxuICAgIGlmIChzbG90ICYmIHRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMuZWxlbWVudC5pZCA9IGlkIHx8IHNsb3QuZ2V0U2xvdEVsZW1lbnRJZCgpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3Moc2xvdCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbG90KSB7XG4gICAgICBnb29nbGV0YWcuZGVzdHJveVNsb3RzKFt0aGlzLnNsb3RdKTtcbiAgICAgIHRoaXMuc2xvdCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldHRpbmdzKHNsb3Q6IGdvb2dsZXRhZy5TbG90KTogZ29vZ2xldGFnLlNsb3Qge1xuICAgIGlmICh0aGlzLnNpemUgJiYgdGhpcy5jb250ZW50KSB7XG4gICAgICBzbG90LmFkZFNlcnZpY2UoZ29vZ2xldGFnLmNvbnRlbnQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnNpemVNYXBwaW5nKSB7XG4gICAgICAgIHNsb3QuZGVmaW5lU2l6ZU1hcHBpbmcodGhpcy5zaXplTWFwcGluZyk7XG4gICAgICB9XG5cbiAgICAgIHNsb3QuY2xlYXJDYXRlZ29yeUV4Y2x1c2lvbnMoKTtcbiAgICAgIGlmICh0aGlzLmNhdGVnb3J5RXhjbHVzaW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmNhdGVnb3J5RXhjbHVzaW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICB0aGlzLmNhdGVnb3J5RXhjbHVzaW9uLmZvckVhY2goKGNhdCkgPT5cbiAgICAgICAgICAgIHNsb3Quc2V0Q2F0ZWdvcnlFeGNsdXNpb24oY2F0KSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNsb3Quc2V0Q2F0ZWdvcnlFeGNsdXNpb24odGhpcy5jYXRlZ29yeUV4Y2x1c2lvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmZvcmNlU2FmZUZyYW1lID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgc2xvdC5zZXRGb3JjZVNhZmVGcmFtZSh0aGlzLmZvcmNlU2FmZUZyYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2FmZUZyYW1lQ29uZmlnKSB7XG4gICAgICAgIHNsb3Quc2V0U2FmZUZyYW1lQ29uZmlnKHRoaXMuc2FmZUZyYW1lQ29uZmlnKTtcbiAgICAgIH1cblxuICAgICAgc2xvdC5jbGVhclRhcmdldGluZygpO1xuICAgICAgaWYgKHRoaXMudGFyZ2V0aW5nKSB7XG4gICAgICAgIHNsb3QudXBkYXRlVGFyZ2V0aW5nRnJvbU1hcCh0aGlzLnRhcmdldGluZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNvbGxhcHNlRW1wdHlEaXYgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBzbG90LnNldENvbGxhcHNlRW1wdHlEaXYoXG4gICAgICAgICAgdGhpcy5jb2xsYXBzZUVtcHR5RGl2WzBdLFxuICAgICAgICAgIHRoaXMuY29sbGFwc2VFbXB0eURpdlsxXSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29sbGFwc2VFbXB0eURpdiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHNsb3Quc2V0Q29sbGFwc2VFbXB0eURpdih0aGlzLmNvbGxhcHNlRW1wdHlEaXYpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbGlja1VybCkge1xuICAgICAgICBzbG90LnNldENsaWNrVXJsKHRoaXMuY2xpY2tVcmwpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hZHNlbnNlKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuYWRzZW5zZSkge1xuICAgICAgICAgIHNsb3Quc2V0KGtleSwgdGhpcy5hZHNlbnNlW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNsb3QuYWRkU2VydmljZShnb29nbGV0YWcucHViYWRzKCkpO1xuICAgIH1cbiAgICByZXR1cm4gc2xvdDtcbiAgfVxufVxuIl19