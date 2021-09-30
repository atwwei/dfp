/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import { Directive, Inject, Input, Optional, PLATFORM_ID, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { DELAY_TIME } from './consts';
import * as i0 from "@angular/core";
import * as i1 from "./dfp.service";
import * as i2 from "@angular/router";
export class DfpAdDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGZwLWFkLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGZwLWFkLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2REFBNkQ7QUFDN0QsT0FBTyxFQUNMLFNBQVMsRUFFVCxNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFDUixXQUFXLEdBSVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGFBQWEsRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBRXhELE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7Ozs7QUFPdEMsTUFBTSxPQUFPLGNBQWM7SUE0QnpCLFlBQ1UsYUFBK0IsRUFDL0IsV0FBaUMsRUFDakMsR0FBZSxFQUNILE1BQWMsRUFDYixVQUFrQjtRQUovQixrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDL0IsZ0JBQVcsR0FBWCxXQUFXLENBQXNCO1FBQ2pDLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFDSCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBL0I1QixhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN6QixZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQWlDOUIsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtJQUNILENBQUM7SUFoQ0QsSUFBYSxLQUFLLENBQUMsS0FBcUI7UUFDdEMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFB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QkFIMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsU0FBUztpQkFDcEI7OzBCQWlDSSxRQUFROzhCQUN3QixNQUFNOzBCQUF0QyxNQUFNOzJCQUFDLFdBQVc7NENBM0JSLEtBQUs7c0JBQWpCLEtBQUs7Z0JBUVksRUFBRTtzQkFBbkIsS0FBSzt1QkFBQyxTQUFTO2dCQUNJLElBQUk7c0JBQXZCLEtBQUs7dUJBQUMsV0FBVztnQkFDUyxXQUFXO3NCQUFyQyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFDUSxpQkFBaUI7c0JBQWpELEtBQUs7dUJBQUMsd0JBQXdCO2dCQUNQLFFBQVE7c0JBQS9CLEtBQUs7dUJBQUMsZUFBZTtnQkFDVSxnQkFBZ0I7c0JBQS9DLEtBQUs7dUJBQUMsdUJBQXVCO2dCQUdBLGNBQWM7c0JBQTNDLEtBQUs7dUJBQUMscUJBQXFCO2dCQUNHLGVBQWU7c0JBQTdDLEtBQUs7dUJBQUMsc0JBQXNCO2dCQUNKLFNBQVM7c0JBQWpDLEtBQUs7dUJBQUMsZ0JBQWdCO2dCQUNBLE9BQU87c0JBQTdCLEtBQUs7dUJBQUMsY0FBYztnQkFDRSxPQUFPO3NCQUE3QixLQUFLO3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAYW5ndWxhci1lc2xpbnQvbm8tY29uZmxpY3RpbmctbGlmZWN5Y2xlICovXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUExBVEZPUk1fSUQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5hdmlnYXRpb25FbmQsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IFN1YmplY3QsIHRpbWVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHN3aXRjaE1hcCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBERUxBWV9USU1FIH0gZnJvbSAnLi9jb25zdHMnO1xuaW1wb3J0IHsgRGZwU2VydmljZSB9IGZyb20gJy4vZGZwLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGZwQWQgfSBmcm9tICcuL3R5cGVzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2RmcEFkXScsXG59KVxuZXhwb3J0IGNsYXNzIERmcEFkRGlyZWN0aXZlIGltcGxlbWVudHMgRG9DaGVjaywgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlICRkZXN0cm95ID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSAkdXBkYXRlID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBlbGVtZW50PzogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgc2xvdD86IGdvb2dsZXRhZy5TbG90O1xuXG4gIEBJbnB1dCgpIHNldCBkZnBBZChkZnBBZDogc3RyaW5nIHwgRGZwQWQpIHtcbiAgICBpZiAodHlwZW9mIGRmcEFkID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy51bml0UGF0aCA9IGRmcEFkO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRmcEFkKTtcbiAgICB9XG4gIH1cbiAgdW5pdFBhdGghOiBzdHJpbmc7XG4gIEBJbnB1dCgnZGZwQWRJZCcpIGlkPzogc3RyaW5nO1xuICBASW5wdXQoJ2RmcEFkU2l6ZScpIHNpemU/OiBnb29nbGV0YWcuR2VuZXJhbFNpemU7XG4gIEBJbnB1dCgnZGZwQWRTaXplTWFwcGluZycpIHNpemVNYXBwaW5nPzogZ29vZ2xldGFnLlNpemVNYXBwaW5nQXJyYXk7XG4gIEBJbnB1dCgnZGZwQWRDYXRlZ29yeUV4Y2x1c2lvbicpIGNhdGVnb3J5RXhjbHVzaW9uPzogc3RyaW5nIHwgc3RyaW5nW107XG4gIEBJbnB1dCgnZGZwQWRDbGlja1VybCcpIGNsaWNrVXJsPzogc3RyaW5nO1xuICBASW5wdXQoJ2RmcEFkQ29sbGFwc2VFbXB0eURpdicpIGNvbGxhcHNlRW1wdHlEaXY/OlxuICAgIHwgYm9vbGVhblxuICAgIHwgW2Jvb2xlYW4sIGJvb2xlYW5dO1xuICBASW5wdXQoJ2RmcEFkRm9yY2VTYWZlRnJhbWUnKSBmb3JjZVNhZmVGcmFtZT86IGJvb2xlYW47XG4gIEBJbnB1dCgnZGZwQWRTYWZlRnJhbWVDb25maWcnKSBzYWZlRnJhbWVDb25maWc/OiBnb29nbGV0YWcuU2FmZUZyYW1lQ29uZmlnO1xuICBASW5wdXQoJ2RmcEFkVGFyZ2V0aW5nJykgdGFyZ2V0aW5nPzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgc3RyaW5nW10+O1xuICBASW5wdXQoJ2RmcEFkQWRzZW5zZScpIGFkc2Vuc2U/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBASW5wdXQoJ2RmcEFkQ29udGVudCcpIGNvbnRlbnQ/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPHVua25vd24+LFxuICAgIHByaXZhdGUgZGZwOiBEZnBTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0LFxuICApIHtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLiR1cGRhdGVcbiAgICAgIC5waXBlKFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gdGltZXIoREVMQVlfVElNRSkpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy4kZGVzdHJveSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZnAuY21kKCgpID0+IHRoaXMuZGlzcGxheSgpKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5yb3V0ZXIgJiZcbiAgICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgICAucGlwZShcbiAgICAgICAgICBmaWx0ZXIoKGV2ZW50KSA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpLFxuICAgICAgICAgIHRha2VVbnRpbCh0aGlzLiRkZXN0cm95KSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLiR1cGRhdGUubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy51bml0UGF0aCkge1xuICAgICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMudmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHZpZXcucm9vdE5vZGVzWzBdO1xuICAgICAgfVxuICAgICAgdGhpcy4kdXBkYXRlLm5leHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQgfHwgdGhpcy5lbGVtZW50Py5pbm5lclRleHQ/Lm1hdGNoKC9cXFMrLykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zbG90ICYmIHRoaXMuaWQgPT09IHRoaXMuZWxlbWVudC5pZCkge1xuICAgICAgdGhpcy5kZnAuZGVmaW5lKE9iamVjdC5hc3NpZ24oe30sIHRoaXMpKTtcbiAgICAgIHRoaXMuZGZwLnJlZnJlc2godGhpcy5zbG90KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuZWxlbWVudC5pZCB8fCB0aGlzLmlkO1xuICAgICAgaWYgKCh0aGlzLnNsb3QgPSB0aGlzLmRmcC5kZWZpbmUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcywgeyBpZDogaWQgfSkpKSkge1xuICAgICAgICB0aGlzLmlkID0gdGhpcy5lbGVtZW50LmlkID0gaWQgfHwgdGhpcy5zbG90LmdldFNsb3RFbGVtZW50SWQoKTtcbiAgICAgICAgdGhpcy5kZnAuZGlzcGxheSh0aGlzLnNsb3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMudmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgIHRoaXMuZWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2xvdCkge1xuICAgICAgdGhpcy5kZnAuZGVzdHJveSh0aGlzLnNsb3QpO1xuICAgICAgdGhpcy5zbG90ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Py5pZCAmJiB0aGlzLmlkICE9PSB0aGlzLmVsZW1lbnQuaWQpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLmVsZW1lbnQuaWQ7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZSA9IGNoYW5nZXNbJ2RmcEFkJ10gfHwgY2hhbmdlc1snaWQnXSB8fCBjaGFuZ2VzWydzaXplJ107XG4gICAgaWYgKGNoYW5nZSAmJiAhY2hhbmdlLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy4kZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5jbGVhcigpO1xuICB9XG59XG4iXX0=