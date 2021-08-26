(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/router')) :
    typeof define === 'function' && define.amd ? define('@wwei/dfp', ['exports', '@angular/common', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/router'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.wwei = global.wwei || {}, global.wwei.dfp = {}), global.ng.common, global.ng.core, global.rxjs, global.rxjs.operators, global.ng.router));
}(this, (function (exports, common, i0, rxjs, operators, i2) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i2__namespace = /*#__PURE__*/_interopNamespace(i2);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || from);
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var GptEvent = /** @class */ (function () {
        function GptEvent(event) {
            Object.assign(this, event);
        }
        return GptEvent;
    }());
    var ImpressionViewableEvent = /** @class */ (function (_super) {
        __extends(ImpressionViewableEvent, _super);
        function ImpressionViewableEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ImpressionViewableEvent;
    }(GptEvent));
    var SlotOnloadEvent = /** @class */ (function (_super) {
        __extends(SlotOnloadEvent, _super);
        function SlotOnloadEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SlotOnloadEvent;
    }(GptEvent));
    var SlotRenderEndedEvent = /** @class */ (function (_super) {
        __extends(SlotRenderEndedEvent, _super);
        function SlotRenderEndedEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SlotRenderEndedEvent;
    }(GptEvent));
    var SlotRequestedEvent = /** @class */ (function (_super) {
        __extends(SlotRequestedEvent, _super);
        function SlotRequestedEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SlotRequestedEvent;
    }(GptEvent));
    var SlotResponseReceived = /** @class */ (function (_super) {
        __extends(SlotResponseReceived, _super);
        function SlotResponseReceived() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SlotResponseReceived;
    }(GptEvent));
    var SlotVisibilityChangedEvent = /** @class */ (function (_super) {
        __extends(SlotVisibilityChangedEvent, _super);
        function SlotVisibilityChangedEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SlotVisibilityChangedEvent;
    }(GptEvent));

    var GPT_SOURCE = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    var DELAY_TIME = 50;

    var DfpAction = /** @class */ (function () {
        function DfpAction(slot) {
            this.slot = slot;
        }
        return DfpAction;
    }());
    var DfpAdDisplay = /** @class */ (function (_super) {
        __extends(DfpAdDisplay, _super);
        function DfpAdDisplay() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DfpAdDisplay;
    }(DfpAction));
    var DfpAdRefresh = /** @class */ (function (_super) {
        __extends(DfpAdRefresh, _super);
        function DfpAdRefresh() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DfpAdRefresh;
    }(DfpAction));

    var DfpService = /** @class */ (function () {
        function DfpService(platformId, document) {
            this.platformId = platformId;
            this.document = document;
            this.$queue = new rxjs.Subject();
            this.$events = new rxjs.Subject();
            if (common.isPlatformBrowser(this.platformId)) {
                this.initializeGPT();
                this.startActionQueue();
                this.addEventListeners();
            }
        }
        Object.defineProperty(DfpService.prototype, "events", {
            get: function () {
                return this.$events.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        DfpService.prototype.initializeGPT = function () {
            this.appendScript({ async: true, src: GPT_SOURCE });
            window.googletag = window.googletag || { cmd: [] };
        };
        DfpService.prototype.startActionQueue = function () {
            var displaySlots = [];
            this.$queue
                .pipe(operators.filter(function (act) {
                if (act instanceof DfpAdDisplay) {
                    displaySlots.push(act.slot);
                    return false;
                }
                return (act instanceof DfpAdRefresh && displaySlots.indexOf(act.slot) === -1);
            }), operators.map(function (act) { return act.slot; }), operators.buffer(this.$queue.pipe(operators.switchMap(function () { return rxjs.timer(DELAY_TIME * 2); }))))
                .subscribe(function (refreshSlots) {
                displaySlots.forEach(function (slot) {
                    googletag.display(slot);
                });
                displaySlots.splice(0);
                if (refreshSlots.length > 0) {
                    googletag.pubads().refresh(refreshSlots);
                }
            });
        };
        DfpService.prototype.addEventListeners = function () {
            var _this = this;
            googletag.cmd.push(function () {
                var pubads = googletag.pubads();
                pubads.addEventListener('impressionViewable', function (event) {
                    _this.$events.next(new ImpressionViewableEvent(event));
                });
                pubads.addEventListener('slotOnload', function (event) {
                    _this.$events.next(new SlotOnloadEvent(event));
                });
                pubads.addEventListener('slotRenderEnded', function (event) {
                    _this.$events.next(new SlotRenderEndedEvent(event));
                });
                pubads.addEventListener('slotRequested', function (event) {
                    _this.$events.next(new SlotRequestedEvent(event));
                });
                pubads.addEventListener('slotResponseReceived', function (event) {
                    _this.$events.next(new SlotResponseReceived(event));
                });
                pubads.addEventListener('slotVisibilityChanged', function (event) {
                    _this.$events.next(new SlotVisibilityChangedEvent(event));
                });
            });
        };
        DfpService.prototype.clear = function (elementIds) {
            var _this = this;
            this.cmd(function () {
                googletag.pubads().clear(_this.getSlots(elementIds));
            });
        };
        DfpService.prototype.cmd = function (callback) {
            if (common.isPlatformBrowser(this.platformId)) {
                googletag.cmd.push(callback);
            }
        };
        DfpService.prototype.destroySlots = function (elementIds) {
            var _this = this;
            this.cmd(function () {
                googletag.destroySlots(_this.getSlots(elementIds));
            });
        };
        DfpService.prototype.getSlots = function (elementIds) {
            var slots = undefined;
            if (common.isPlatformBrowser(this.platformId)) {
                if (googletag.apiReady && elementIds) {
                    return googletag
                        .pubads()
                        .getSlots()
                        .filter(function (slot) {
                        return elementIds.indexOf(slot.getSlotElementId()) !== -1;
                    });
                }
            }
            return slots;
        };
        DfpService.prototype.refresh = function (elementIds, opt_options) {
            var _this = this;
            this.cmd(function () {
                googletag.pubads().refresh(_this.getSlots(elementIds), opt_options);
            });
        };
        DfpService.prototype.queue = function (event) {
            this.$queue.next(event);
        };
        /**
         * Append Script tag to parentNode
         * @param options
         * @param parentNode The default setting is document.head
         * @returns
         */
        DfpService.prototype.appendScript = function (options, parentNode) {
            parentNode = parentNode || this.document.head;
            var oldScript = options.id
                ? parentNode.querySelector('#' + options.id)
                : null;
            var script = this.document.createElement('script');
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
        };
        DfpService.prototype.appendText = function (data, parentNode) {
            parentNode = parentNode || this.document.head;
            var text = this.document.createTextNode(data);
            parentNode.appendChild(text);
            return text;
        };
        return DfpService;
    }());
    DfpService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpService, deps: [{ token: i0.PLATFORM_ID }, { token: common.DOCUMENT }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    DfpService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpService, providedIn: 'root' });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpService, decorators: [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root',
                    }]
            }], ctorParameters: function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [i0.PLATFORM_ID]
                        }] }, { type: Document, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }];
        } });

    /* eslint-disable @angular-eslint/no-conflicting-lifecycle */
    var DfpAdDirective = /** @class */ (function () {
        function DfpAdDirective(viewContainer, templateRef, dfp, router, platformId) {
            var _this = this;
            this.viewContainer = viewContainer;
            this.templateRef = templateRef;
            this.dfp = dfp;
            this.$destroy = new rxjs.Subject();
            this.$update = new rxjs.Subject();
            if (common.isPlatformBrowser(platformId)) {
                this.$update
                    .pipe(operators.switchMap(function () { return rxjs.timer(DELAY_TIME); }), operators.takeUntil(this.$destroy))
                    .subscribe(function () {
                    _this.dfp.cmd(function () { return _this.display(); });
                });
                router &&
                    router.events
                        .pipe(operators.filter(function (event) { return event instanceof i2.NavigationEnd; }), operators.takeUntil(this.$destroy))
                        .subscribe(function (e) {
                        _this.$update.next();
                    });
            }
        }
        Object.defineProperty(DfpAdDirective.prototype, "dfpAd", {
            set: function (dfpAd) {
                if (typeof dfpAd === 'string') {
                    this.unitPath = dfpAd;
                }
                else {
                    Object.assign(this, dfpAd);
                }
            },
            enumerable: false,
            configurable: true
        });
        DfpAdDirective.prototype.display = function () {
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
        };
        DfpAdDirective.prototype.ngDoCheck = function () {
            var _a;
            if (((_a = this.element) === null || _a === void 0 ? void 0 : _a.id) && this.id !== this.element.id) {
                this.id = this.element.id;
                this.destroy();
                this.create();
            }
        };
        DfpAdDirective.prototype.ngOnChanges = function (changes) {
            var change = changes['dfpAd'] || changes['id'] || changes['size'];
            if (change && !change.isFirstChange()) {
                this.clear();
            }
            this.create();
        };
        DfpAdDirective.prototype.ngOnDestroy = function () {
            this.$destroy.next();
            this.clear();
        };
        DfpAdDirective.prototype.create = function () {
            if (this.unitPath) {
                if (!this.element) {
                    var view = this.viewContainer.createEmbeddedView(this.templateRef);
                    this.element = view.rootNodes[0];
                }
                this.$update.next();
            }
            else {
                this.clear();
            }
        };
        DfpAdDirective.prototype.clear = function () {
            this.viewContainer.clear();
            this.element = undefined;
            this.destroy();
        };
        DfpAdDirective.prototype.define = function () {
            var _a;
            var slot;
            var id = ((_a = this.element) === null || _a === void 0 ? void 0 : _a.id) || this.id || '';
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
        };
        DfpAdDirective.prototype.destroy = function () {
            if (this.slot) {
                googletag.destroySlots([this.slot]);
                this.slot = undefined;
            }
        };
        DfpAdDirective.prototype.settings = function (slot) {
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
                        this.categoryExclusion.forEach(function (cat) { return slot.setCategoryExclusion(cat); });
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
                    for (var key in this.adsense) {
                        slot.set(key, this.adsense[key]);
                    }
                }
                slot.addService(googletag.pubads());
            }
            return slot;
        };
        return DfpAdDirective;
    }());
    DfpAdDirective.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpAdDirective, deps: [{ token: i0__namespace.ViewContainerRef }, { token: i0__namespace.TemplateRef }, { token: DfpService }, { token: i2__namespace.Router, optional: true }, { token: i0.PLATFORM_ID }], target: i0__namespace.ɵɵFactoryTarget.Directive });
    DfpAdDirective.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.1.1", type: DfpAdDirective, selector: "[dfpAd]", inputs: { dfpAd: "dfpAd", id: ["dfpAdId", "id"], size: ["dfpAdSize", "size"], sizeMapping: ["dfpAdSizeMapping", "sizeMapping"], categoryExclusion: ["dfpAdCategoryExclusion", "categoryExclusion"], clickUrl: ["dfpAdClickUrl", "clickUrl"], collapseEmptyDiv: ["dfpAdCollapseEmptyDiv", "collapseEmptyDiv"], forceSafeFrame: ["dfpAdForceSafeFrame", "forceSafeFrame"], safeFrameConfig: ["dfpAdSafeFrameConfig", "safeFrameConfig"], targeting: ["dfpAdTargeting", "targeting"], adsense: ["dfpAdAdsense", "adsense"], content: ["dfpAdContent", "content"] }, usesOnChanges: true, ngImport: i0__namespace });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpAdDirective, decorators: [{
                type: i0.Directive,
                args: [{
                        selector: '[dfpAd]',
                    }]
            }], ctorParameters: function () {
            return [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.TemplateRef }, { type: DfpService }, { type: i2__namespace.Router, decorators: [{
                            type: i0.Optional
                        }] }, { type: Object, decorators: [{
                            type: i0.Inject,
                            args: [i0.PLATFORM_ID]
                        }] }];
        }, propDecorators: { dfpAd: [{
                    type: i0.Input
                }], id: [{
                    type: i0.Input,
                    args: ['dfpAdId']
                }], size: [{
                    type: i0.Input,
                    args: ['dfpAdSize']
                }], sizeMapping: [{
                    type: i0.Input,
                    args: ['dfpAdSizeMapping']
                }], categoryExclusion: [{
                    type: i0.Input,
                    args: ['dfpAdCategoryExclusion']
                }], clickUrl: [{
                    type: i0.Input,
                    args: ['dfpAdClickUrl']
                }], collapseEmptyDiv: [{
                    type: i0.Input,
                    args: ['dfpAdCollapseEmptyDiv']
                }], forceSafeFrame: [{
                    type: i0.Input,
                    args: ['dfpAdForceSafeFrame']
                }], safeFrameConfig: [{
                    type: i0.Input,
                    args: ['dfpAdSafeFrameConfig']
                }], targeting: [{
                    type: i0.Input,
                    args: ['dfpAdTargeting']
                }], adsense: [{
                    type: i0.Input,
                    args: ['dfpAdAdsense']
                }], content: [{
                    type: i0.Input,
                    args: ['dfpAdContent']
                }] } });

    var DFP_DIRECTIVES = [DfpAdDirective];
    var DfpModule = /** @class */ (function () {
        function DfpModule() {
        }
        return DfpModule;
    }());
    DfpModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    DfpModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpModule, declarations: [DfpAdDirective], exports: [DfpAdDirective] });
    DfpModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpModule });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.1", ngImport: i0__namespace, type: DfpModule, decorators: [{
                type: i0.NgModule,
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

    exports.DfpAdDirective = DfpAdDirective;
    exports.DfpModule = DfpModule;
    exports.DfpService = DfpService;
    exports.ImpressionViewableEvent = ImpressionViewableEvent;
    exports.SlotOnloadEvent = SlotOnloadEvent;
    exports.SlotRenderEndedEvent = SlotRenderEndedEvent;
    exports.SlotRequestedEvent = SlotRequestedEvent;
    exports.SlotResponseReceived = SlotResponseReceived;
    exports.SlotVisibilityChangedEvent = SlotVisibilityChangedEvent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dfp.umd.js.map
