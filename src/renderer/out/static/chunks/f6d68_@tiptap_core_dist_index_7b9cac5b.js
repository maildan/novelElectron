(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/node_modules/.pnpm/@tiptap+core@2.25.0_@tiptap+pm@2.24.0/node_modules/@tiptap/core/dist/index.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CommandManager": (()=>CommandManager),
    "Editor": (()=>Editor),
    "Extension": (()=>Extension),
    "InputRule": (()=>InputRule),
    "Mark": (()=>Mark),
    "Node": (()=>Node),
    "NodePos": (()=>NodePos),
    "NodeView": (()=>NodeView),
    "PasteRule": (()=>PasteRule),
    "Tracker": (()=>Tracker),
    "callOrReturn": (()=>callOrReturn),
    "canInsertNode": (()=>canInsertNode),
    "combineTransactionSteps": (()=>combineTransactionSteps),
    "createChainableState": (()=>createChainableState),
    "createDocument": (()=>createDocument),
    "createNodeFromContent": (()=>createNodeFromContent),
    "createStyleTag": (()=>createStyleTag),
    "defaultBlockAt": (()=>defaultBlockAt),
    "deleteProps": (()=>deleteProps),
    "elementFromString": (()=>elementFromString),
    "escapeForRegEx": (()=>escapeForRegEx),
    "extensions": (()=>index),
    "findChildren": (()=>findChildren),
    "findChildrenInRange": (()=>findChildrenInRange),
    "findDuplicates": (()=>findDuplicates),
    "findParentNode": (()=>findParentNode),
    "findParentNodeClosestToPos": (()=>findParentNodeClosestToPos),
    "fromString": (()=>fromString),
    "generateHTML": (()=>generateHTML),
    "generateJSON": (()=>generateJSON),
    "generateText": (()=>generateText),
    "getAttributes": (()=>getAttributes),
    "getAttributesFromExtensions": (()=>getAttributesFromExtensions),
    "getChangedRanges": (()=>getChangedRanges),
    "getDebugJSON": (()=>getDebugJSON),
    "getExtensionField": (()=>getExtensionField),
    "getHTMLFromFragment": (()=>getHTMLFromFragment),
    "getMarkAttributes": (()=>getMarkAttributes),
    "getMarkRange": (()=>getMarkRange),
    "getMarkType": (()=>getMarkType),
    "getMarksBetween": (()=>getMarksBetween),
    "getNodeAtPosition": (()=>getNodeAtPosition),
    "getNodeAttributes": (()=>getNodeAttributes),
    "getNodeType": (()=>getNodeType),
    "getRenderedAttributes": (()=>getRenderedAttributes),
    "getSchema": (()=>getSchema),
    "getSchemaByResolvedExtensions": (()=>getSchemaByResolvedExtensions),
    "getSchemaTypeByName": (()=>getSchemaTypeByName),
    "getSchemaTypeNameByName": (()=>getSchemaTypeNameByName),
    "getSplittedAttributes": (()=>getSplittedAttributes),
    "getText": (()=>getText),
    "getTextBetween": (()=>getTextBetween),
    "getTextContentFromNodes": (()=>getTextContentFromNodes),
    "getTextSerializersFromSchema": (()=>getTextSerializersFromSchema),
    "injectExtensionAttributesToParseRule": (()=>injectExtensionAttributesToParseRule),
    "inputRulesPlugin": (()=>inputRulesPlugin),
    "isActive": (()=>isActive),
    "isAtEndOfNode": (()=>isAtEndOfNode),
    "isAtStartOfNode": (()=>isAtStartOfNode),
    "isEmptyObject": (()=>isEmptyObject),
    "isExtensionRulesEnabled": (()=>isExtensionRulesEnabled),
    "isFunction": (()=>isFunction),
    "isList": (()=>isList),
    "isMacOS": (()=>isMacOS),
    "isMarkActive": (()=>isMarkActive),
    "isNodeActive": (()=>isNodeActive),
    "isNodeEmpty": (()=>isNodeEmpty),
    "isNodeSelection": (()=>isNodeSelection),
    "isNumber": (()=>isNumber),
    "isPlainObject": (()=>isPlainObject),
    "isRegExp": (()=>isRegExp),
    "isString": (()=>isString),
    "isTextSelection": (()=>isTextSelection),
    "isiOS": (()=>isiOS),
    "markInputRule": (()=>markInputRule),
    "markPasteRule": (()=>markPasteRule),
    "mergeAttributes": (()=>mergeAttributes),
    "mergeDeep": (()=>mergeDeep),
    "minMax": (()=>minMax),
    "nodeInputRule": (()=>nodeInputRule),
    "nodePasteRule": (()=>nodePasteRule),
    "objectIncludes": (()=>objectIncludes),
    "pasteRulesPlugin": (()=>pasteRulesPlugin),
    "posToDOMRect": (()=>posToDOMRect),
    "removeDuplicates": (()=>removeDuplicates),
    "resolveFocusPosition": (()=>resolveFocusPosition),
    "rewriteUnknownContent": (()=>rewriteUnknownContent),
    "selectionToInsertionEnd": (()=>selectionToInsertionEnd),
    "splitExtensions": (()=>splitExtensions),
    "textInputRule": (()=>textInputRule),
    "textPasteRule": (()=>textPasteRule),
    "textblockTypeInputRule": (()=>textblockTypeInputRule),
    "wrappingInputRule": (()=>wrappingInputRule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/state/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-state@1.4.3/node_modules/prosemirror-state/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/view/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$40$2e$0$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-view@1.40.0/node_modules/prosemirror-view/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$keymap$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/keymap/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$keymap$40$1$2e$2$2e$3$2f$node_modules$2f$prosemirror$2d$keymap$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-keymap@1.2.3/node_modules/prosemirror-keymap/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/model/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-model@1.25.1/node_modules/prosemirror-model/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/transform/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-transform@1.10.4/node_modules/prosemirror-transform/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/commands/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-commands@1.7.1/node_modules/prosemirror-commands/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$pm$2f$schema$2d$list$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+pm@2.24.0/node_modules/@tiptap/pm/schema-list/dist/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$schema$2d$list$40$1$2e$5$2e$1$2f$node_modules$2f$prosemirror$2d$schema$2d$list$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/prosemirror-schema-list@1.5.1/node_modules/prosemirror-schema-list/dist/index.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
/**
 * Takes a Transaction & Editor State and turns it into a chainable state object
 * @param config The transaction and state to create the chainable state from
 * @returns A chainable Editor state object
 */ function createChainableState(config) {
    const { state, transaction } = config;
    let { selection } = transaction;
    let { doc } = transaction;
    let { storedMarks } = transaction;
    return {
        ...state,
        apply: state.apply.bind(state),
        applyTransaction: state.applyTransaction.bind(state),
        plugins: state.plugins,
        schema: state.schema,
        reconfigure: state.reconfigure.bind(state),
        toJSON: state.toJSON.bind(state),
        get storedMarks () {
            return storedMarks;
        },
        get selection () {
            return selection;
        },
        get doc () {
            return doc;
        },
        get tr () {
            selection = transaction.selection;
            doc = transaction.doc;
            storedMarks = transaction.storedMarks;
            return transaction;
        }
    };
}
class CommandManager {
    constructor(props){
        this.editor = props.editor;
        this.rawCommands = this.editor.extensionManager.commands;
        this.customState = props.state;
    }
    get hasCustomState() {
        return !!this.customState;
    }
    get state() {
        return this.customState || this.editor.state;
    }
    get commands() {
        const { rawCommands, editor, state } = this;
        const { view } = editor;
        const { tr } = state;
        const props = this.buildProps(tr);
        return Object.fromEntries(Object.entries(rawCommands).map(([name, command])=>{
            const method = (...args)=>{
                const callback = command(...args)(props);
                if (!tr.getMeta('preventDispatch') && !this.hasCustomState) {
                    view.dispatch(tr);
                }
                return callback;
            };
            return [
                name,
                method
            ];
        }));
    }
    get chain() {
        return ()=>this.createChain();
    }
    get can() {
        return ()=>this.createCan();
    }
    createChain(startTr, shouldDispatch = true) {
        const { rawCommands, editor, state } = this;
        const { view } = editor;
        const callbacks = [];
        const hasStartTransaction = !!startTr;
        const tr = startTr || state.tr;
        const run = ()=>{
            if (!hasStartTransaction && shouldDispatch && !tr.getMeta('preventDispatch') && !this.hasCustomState) {
                view.dispatch(tr);
            }
            return callbacks.every((callback)=>callback === true);
        };
        const chain = {
            ...Object.fromEntries(Object.entries(rawCommands).map(([name, command])=>{
                const chainedCommand = (...args)=>{
                    const props = this.buildProps(tr, shouldDispatch);
                    const callback = command(...args)(props);
                    callbacks.push(callback);
                    return chain;
                };
                return [
                    name,
                    chainedCommand
                ];
            })),
            run
        };
        return chain;
    }
    createCan(startTr) {
        const { rawCommands, state } = this;
        const dispatch = false;
        const tr = startTr || state.tr;
        const props = this.buildProps(tr, dispatch);
        const formattedCommands = Object.fromEntries(Object.entries(rawCommands).map(([name, command])=>{
            return [
                name,
                (...args)=>command(...args)({
                        ...props,
                        dispatch: undefined
                    })
            ];
        }));
        return {
            ...formattedCommands,
            chain: ()=>this.createChain(tr, dispatch)
        };
    }
    buildProps(tr, shouldDispatch = true) {
        const { rawCommands, editor, state } = this;
        const { view } = editor;
        const props = {
            tr,
            editor,
            view,
            state: createChainableState({
                state,
                transaction: tr
            }),
            dispatch: shouldDispatch ? ()=>undefined : undefined,
            chain: ()=>this.createChain(tr, shouldDispatch),
            can: ()=>this.createCan(tr),
            get commands () {
                return Object.fromEntries(Object.entries(rawCommands).map(([name, command])=>{
                    return [
                        name,
                        (...args)=>command(...args)(props)
                    ];
                }));
            }
        };
        return props;
    }
}
class EventEmitter {
    constructor(){
        this.callbacks = {};
    }
    on(event, fn) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(fn);
        return this;
    }
    emit(event, ...args) {
        const callbacks = this.callbacks[event];
        if (callbacks) {
            callbacks.forEach((callback)=>callback.apply(this, args));
        }
        return this;
    }
    off(event, fn) {
        const callbacks = this.callbacks[event];
        if (callbacks) {
            if (fn) {
                this.callbacks[event] = callbacks.filter((callback)=>callback !== fn);
            } else {
                delete this.callbacks[event];
            }
        }
        return this;
    }
    once(event, fn) {
        const onceFn = (...args)=>{
            this.off(event, onceFn);
            fn.apply(this, args);
        };
        return this.on(event, onceFn);
    }
    removeAllListeners() {
        this.callbacks = {};
    }
}
/**
 * Returns a field from an extension
 * @param extension The Tiptap extension
 * @param field The field, for example `renderHTML` or `priority`
 * @param context The context object that should be passed as `this` into the function
 * @returns The field value
 */ function getExtensionField(extension, field, context) {
    if (extension.config[field] === undefined && extension.parent) {
        return getExtensionField(extension.parent, field, context);
    }
    if (typeof extension.config[field] === 'function') {
        const value = extension.config[field].bind({
            ...context,
            parent: extension.parent ? getExtensionField(extension.parent, field, context) : null
        });
        return value;
    }
    return extension.config[field];
}
function splitExtensions(extensions) {
    const baseExtensions = extensions.filter((extension)=>extension.type === 'extension');
    const nodeExtensions = extensions.filter((extension)=>extension.type === 'node');
    const markExtensions = extensions.filter((extension)=>extension.type === 'mark');
    return {
        baseExtensions,
        nodeExtensions,
        markExtensions
    };
}
/**
 * Get a list of all extension attributes defined in `addAttribute` and `addGlobalAttribute`.
 * @param extensions List of extensions
 */ function getAttributesFromExtensions(extensions) {
    const extensionAttributes = [];
    const { nodeExtensions, markExtensions } = splitExtensions(extensions);
    const nodeAndMarkExtensions = [
        ...nodeExtensions,
        ...markExtensions
    ];
    const defaultAttribute = {
        default: null,
        rendered: true,
        renderHTML: null,
        parseHTML: null,
        keepOnSplit: true,
        isRequired: false
    };
    extensions.forEach((extension)=>{
        const context = {
            name: extension.name,
            options: extension.options,
            storage: extension.storage,
            extensions: nodeAndMarkExtensions
        };
        const addGlobalAttributes = getExtensionField(extension, 'addGlobalAttributes', context);
        if (!addGlobalAttributes) {
            return;
        }
        const globalAttributes = addGlobalAttributes();
        globalAttributes.forEach((globalAttribute)=>{
            globalAttribute.types.forEach((type)=>{
                Object.entries(globalAttribute.attributes).forEach(([name, attribute])=>{
                    extensionAttributes.push({
                        type,
                        name,
                        attribute: {
                            ...defaultAttribute,
                            ...attribute
                        }
                    });
                });
            });
        });
    });
    nodeAndMarkExtensions.forEach((extension)=>{
        const context = {
            name: extension.name,
            options: extension.options,
            storage: extension.storage
        };
        const addAttributes = getExtensionField(extension, 'addAttributes', context);
        if (!addAttributes) {
            return;
        }
        // TODO: remove `as Attributes`
        const attributes = addAttributes();
        Object.entries(attributes).forEach(([name, attribute])=>{
            const mergedAttr = {
                ...defaultAttribute,
                ...attribute
            };
            if (typeof (mergedAttr === null || mergedAttr === void 0 ? void 0 : mergedAttr.default) === 'function') {
                mergedAttr.default = mergedAttr.default();
            }
            if ((mergedAttr === null || mergedAttr === void 0 ? void 0 : mergedAttr.isRequired) && (mergedAttr === null || mergedAttr === void 0 ? void 0 : mergedAttr.default) === undefined) {
                delete mergedAttr.default;
            }
            extensionAttributes.push({
                type: extension.name,
                name,
                attribute: mergedAttr
            });
        });
    });
    return extensionAttributes;
}
function getNodeType(nameOrType, schema) {
    if (typeof nameOrType === 'string') {
        if (!schema.nodes[nameOrType]) {
            throw Error(`There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`);
        }
        return schema.nodes[nameOrType];
    }
    return nameOrType;
}
function mergeAttributes(...objects) {
    return objects.filter((item)=>!!item).reduce((items, item)=>{
        const mergedAttributes = {
            ...items
        };
        Object.entries(item).forEach(([key, value])=>{
            const exists = mergedAttributes[key];
            if (!exists) {
                mergedAttributes[key] = value;
                return;
            }
            if (key === 'class') {
                const valueClasses = value ? String(value).split(' ') : [];
                const existingClasses = mergedAttributes[key] ? mergedAttributes[key].split(' ') : [];
                const insertClasses = valueClasses.filter((valueClass)=>!existingClasses.includes(valueClass));
                mergedAttributes[key] = [
                    ...existingClasses,
                    ...insertClasses
                ].join(' ');
            } else if (key === 'style') {
                const newStyles = value ? value.split(';').map((style)=>style.trim()).filter(Boolean) : [];
                const existingStyles = mergedAttributes[key] ? mergedAttributes[key].split(';').map((style)=>style.trim()).filter(Boolean) : [];
                const styleMap = new Map();
                existingStyles.forEach((style)=>{
                    const [property, val] = style.split(':').map((part)=>part.trim());
                    styleMap.set(property, val);
                });
                newStyles.forEach((style)=>{
                    const [property, val] = style.split(':').map((part)=>part.trim());
                    styleMap.set(property, val);
                });
                mergedAttributes[key] = Array.from(styleMap.entries()).map(([property, val])=>`${property}: ${val}`).join('; ');
            } else {
                mergedAttributes[key] = value;
            }
        });
        return mergedAttributes;
    }, {});
}
function getRenderedAttributes(nodeOrMark, extensionAttributes) {
    return extensionAttributes.filter((attribute)=>attribute.type === nodeOrMark.type.name).filter((item)=>item.attribute.rendered).map((item)=>{
        if (!item.attribute.renderHTML) {
            return {
                [item.name]: nodeOrMark.attrs[item.name]
            };
        }
        return item.attribute.renderHTML(nodeOrMark.attrs) || {};
    }).reduce((attributes, attribute)=>mergeAttributes(attributes, attribute), {});
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Optionally calls `value` as a function.
 * Otherwise it is returned directly.
 * @param value Function or any value.
 * @param context Optional context to bind to function.
 * @param props Optional props to pass to function.
 */ function callOrReturn(value, context = undefined, ...props) {
    if (isFunction(value)) {
        if (context) {
            return value.bind(context)(...props);
        }
        return value(...props);
    }
    return value;
}
function isEmptyObject(value = {}) {
    return Object.keys(value).length === 0 && value.constructor === Object;
}
function fromString(value) {
    if (typeof value !== 'string') {
        return value;
    }
    if (value.match(/^[+-]?(?:\d*\.)?\d+$/)) {
        return Number(value);
    }
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return value;
}
/**
 * This function merges extension attributes into parserule attributes (`attrs` or `getAttrs`).
 * Cancels when `getAttrs` returned `false`.
 * @param parseRule ProseMirror ParseRule
 * @param extensionAttributes List of attributes to inject
 */ function injectExtensionAttributesToParseRule(parseRule, extensionAttributes) {
    if ('style' in parseRule) {
        return parseRule;
    }
    return {
        ...parseRule,
        getAttrs: (node)=>{
            const oldAttributes = parseRule.getAttrs ? parseRule.getAttrs(node) : parseRule.attrs;
            if (oldAttributes === false) {
                return false;
            }
            const newAttributes = extensionAttributes.reduce((items, item)=>{
                const value = item.attribute.parseHTML ? item.attribute.parseHTML(node) : fromString(node.getAttribute(item.name));
                if (value === null || value === undefined) {
                    return items;
                }
                return {
                    ...items,
                    [item.name]: value
                };
            }, {});
            return {
                ...oldAttributes,
                ...newAttributes
            };
        }
    };
}
function cleanUpSchemaItem(data) {
    return Object.fromEntries(// @ts-ignore
    Object.entries(data).filter(([key, value])=>{
        if (key === 'attrs' && isEmptyObject(value)) {
            return false;
        }
        return value !== null && value !== undefined;
    }));
}
/**
 * Creates a new Prosemirror schema based on the given extensions.
 * @param extensions An array of Tiptap extensions
 * @param editor The editor instance
 * @returns A Prosemirror schema
 */ function getSchemaByResolvedExtensions(extensions, editor) {
    var _a;
    const allAttributes = getAttributesFromExtensions(extensions);
    const { nodeExtensions, markExtensions } = splitExtensions(extensions);
    const topNode = (_a = nodeExtensions.find((extension)=>getExtensionField(extension, 'topNode'))) === null || _a === void 0 ? void 0 : _a.name;
    const nodes = Object.fromEntries(nodeExtensions.map((extension)=>{
        const extensionAttributes = allAttributes.filter((attribute)=>attribute.type === extension.name);
        const context = {
            name: extension.name,
            options: extension.options,
            storage: extension.storage,
            editor
        };
        const extraNodeFields = extensions.reduce((fields, e)=>{
            const extendNodeSchema = getExtensionField(e, 'extendNodeSchema', context);
            return {
                ...fields,
                ...extendNodeSchema ? extendNodeSchema(extension) : {}
            };
        }, {});
        const schema = cleanUpSchemaItem({
            ...extraNodeFields,
            content: callOrReturn(getExtensionField(extension, 'content', context)),
            marks: callOrReturn(getExtensionField(extension, 'marks', context)),
            group: callOrReturn(getExtensionField(extension, 'group', context)),
            inline: callOrReturn(getExtensionField(extension, 'inline', context)),
            atom: callOrReturn(getExtensionField(extension, 'atom', context)),
            selectable: callOrReturn(getExtensionField(extension, 'selectable', context)),
            draggable: callOrReturn(getExtensionField(extension, 'draggable', context)),
            code: callOrReturn(getExtensionField(extension, 'code', context)),
            whitespace: callOrReturn(getExtensionField(extension, 'whitespace', context)),
            linebreakReplacement: callOrReturn(getExtensionField(extension, 'linebreakReplacement', context)),
            defining: callOrReturn(getExtensionField(extension, 'defining', context)),
            isolating: callOrReturn(getExtensionField(extension, 'isolating', context)),
            attrs: Object.fromEntries(extensionAttributes.map((extensionAttribute)=>{
                var _a;
                return [
                    extensionAttribute.name,
                    {
                        default: (_a = extensionAttribute === null || extensionAttribute === void 0 ? void 0 : extensionAttribute.attribute) === null || _a === void 0 ? void 0 : _a.default
                    }
                ];
            }))
        });
        const parseHTML = callOrReturn(getExtensionField(extension, 'parseHTML', context));
        if (parseHTML) {
            schema.parseDOM = parseHTML.map((parseRule)=>injectExtensionAttributesToParseRule(parseRule, extensionAttributes));
        }
        const renderHTML = getExtensionField(extension, 'renderHTML', context);
        if (renderHTML) {
            schema.toDOM = (node)=>renderHTML({
                    node,
                    HTMLAttributes: getRenderedAttributes(node, extensionAttributes)
                });
        }
        const renderText = getExtensionField(extension, 'renderText', context);
        if (renderText) {
            schema.toText = renderText;
        }
        return [
            extension.name,
            schema
        ];
    }));
    const marks = Object.fromEntries(markExtensions.map((extension)=>{
        const extensionAttributes = allAttributes.filter((attribute)=>attribute.type === extension.name);
        const context = {
            name: extension.name,
            options: extension.options,
            storage: extension.storage,
            editor
        };
        const extraMarkFields = extensions.reduce((fields, e)=>{
            const extendMarkSchema = getExtensionField(e, 'extendMarkSchema', context);
            return {
                ...fields,
                ...extendMarkSchema ? extendMarkSchema(extension) : {}
            };
        }, {});
        const schema = cleanUpSchemaItem({
            ...extraMarkFields,
            inclusive: callOrReturn(getExtensionField(extension, 'inclusive', context)),
            excludes: callOrReturn(getExtensionField(extension, 'excludes', context)),
            group: callOrReturn(getExtensionField(extension, 'group', context)),
            spanning: callOrReturn(getExtensionField(extension, 'spanning', context)),
            code: callOrReturn(getExtensionField(extension, 'code', context)),
            attrs: Object.fromEntries(extensionAttributes.map((extensionAttribute)=>{
                var _a;
                return [
                    extensionAttribute.name,
                    {
                        default: (_a = extensionAttribute === null || extensionAttribute === void 0 ? void 0 : extensionAttribute.attribute) === null || _a === void 0 ? void 0 : _a.default
                    }
                ];
            }))
        });
        const parseHTML = callOrReturn(getExtensionField(extension, 'parseHTML', context));
        if (parseHTML) {
            schema.parseDOM = parseHTML.map((parseRule)=>injectExtensionAttributesToParseRule(parseRule, extensionAttributes));
        }
        const renderHTML = getExtensionField(extension, 'renderHTML', context);
        if (renderHTML) {
            schema.toDOM = (mark)=>renderHTML({
                    mark,
                    HTMLAttributes: getRenderedAttributes(mark, extensionAttributes)
                });
        }
        return [
            extension.name,
            schema
        ];
    }));
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Schema"]({
        topNode,
        nodes,
        marks
    });
}
/**
 * Tries to get a node or mark type by its name.
 * @param name The name of the node or mark type
 * @param schema The Prosemiror schema to search in
 * @returns The node or mark type, or null if it doesn't exist
 */ function getSchemaTypeByName(name, schema) {
    return schema.nodes[name] || schema.marks[name] || null;
}
function isExtensionRulesEnabled(extension, enabled) {
    if (Array.isArray(enabled)) {
        return enabled.some((enabledExtension)=>{
            const name = typeof enabledExtension === 'string' ? enabledExtension : enabledExtension.name;
            return name === extension.name;
        });
    }
    return enabled;
}
function getHTMLFromFragment(fragment, schema) {
    const documentFragment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DOMSerializer"].fromSchema(schema).serializeFragment(fragment);
    const temporaryDocument = document.implementation.createHTMLDocument();
    const container = temporaryDocument.createElement('div');
    container.appendChild(documentFragment);
    return container.innerHTML;
}
/**
 * Returns the text content of a resolved prosemirror position
 * @param $from The resolved position to get the text content from
 * @param maxMatch The maximum number of characters to match
 * @returns The text content
 */ const getTextContentFromNodes = ($from, maxMatch = 500)=>{
    let textBefore = '';
    const sliceEndPos = $from.parentOffset;
    $from.parent.nodesBetween(Math.max(0, sliceEndPos - maxMatch), sliceEndPos, (node, pos, parent, index)=>{
        var _a, _b;
        const chunk = ((_b = (_a = node.type.spec).toText) === null || _b === void 0 ? void 0 : _b.call(_a, {
            node,
            pos,
            parent,
            index
        })) || node.textContent || '%leaf%';
        textBefore += node.isAtom && !node.isText ? chunk : chunk.slice(0, Math.max(0, sliceEndPos - pos));
    });
    return textBefore;
};
function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
}
class InputRule {
    constructor(config){
        this.find = config.find;
        this.handler = config.handler;
    }
}
const inputRuleMatcherHandler = (text, find)=>{
    if (isRegExp(find)) {
        return find.exec(text);
    }
    const inputRuleMatch = find(text);
    if (!inputRuleMatch) {
        return null;
    }
    const result = [
        inputRuleMatch.text
    ];
    result.index = inputRuleMatch.index;
    result.input = text;
    result.data = inputRuleMatch.data;
    if (inputRuleMatch.replaceWith) {
        if (!inputRuleMatch.text.includes(inputRuleMatch.replaceWith)) {
            console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".');
        }
        result.push(inputRuleMatch.replaceWith);
    }
    return result;
};
function run$1(config) {
    var _a;
    const { editor, from, to, text, rules, plugin } = config;
    const { view } = editor;
    if (view.composing) {
        return false;
    }
    const $from = view.state.doc.resolve(from);
    if (// check for code node
    $from.parent.type.spec.code || !!((_a = $from.nodeBefore || $from.nodeAfter) === null || _a === void 0 ? void 0 : _a.marks.find((mark)=>mark.type.spec.code))) {
        return false;
    }
    let matched = false;
    const textBefore = getTextContentFromNodes($from) + text;
    rules.forEach((rule)=>{
        if (matched) {
            return;
        }
        const match = inputRuleMatcherHandler(textBefore, rule.find);
        if (!match) {
            return;
        }
        const tr = view.state.tr;
        const state = createChainableState({
            state: view.state,
            transaction: tr
        });
        const range = {
            from: from - (match[0].length - text.length),
            to
        };
        const { commands, chain, can } = new CommandManager({
            editor,
            state
        });
        const handler = rule.handler({
            state,
            range,
            match,
            commands,
            chain,
            can
        });
        // stop if there are no changes
        if (handler === null || !tr.steps.length) {
            return;
        }
        // store transform as meta data
        // so we can undo input rules within the `undoInputRules` command
        tr.setMeta(plugin, {
            transform: tr,
            from,
            to,
            text
        });
        view.dispatch(tr);
        matched = true;
    });
    return matched;
}
/**
 * Create an input rules plugin. When enabled, it will cause text
 * input that matches any of the given rules to trigger the rule’s
 * action.
 */ function inputRulesPlugin(props) {
    const { editor, rules } = props;
    const plugin = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
        state: {
            init () {
                return null;
            },
            apply (tr, prev, state) {
                const stored = tr.getMeta(plugin);
                if (stored) {
                    return stored;
                }
                // if InputRule is triggered by insertContent()
                const simulatedInputMeta = tr.getMeta('applyInputRules');
                const isSimulatedInput = !!simulatedInputMeta;
                if (isSimulatedInput) {
                    setTimeout(()=>{
                        let { text } = simulatedInputMeta;
                        if (typeof text === 'string') {
                            text = text;
                        } else {
                            text = getHTMLFromFragment(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(text), state.schema);
                        }
                        const { from } = simulatedInputMeta;
                        const to = from + text.length;
                        run$1({
                            editor,
                            from,
                            to,
                            text,
                            rules,
                            plugin
                        });
                    });
                }
                return tr.selectionSet || tr.docChanged ? null : prev;
            }
        },
        props: {
            handleTextInput (view, from, to, text) {
                return run$1({
                    editor,
                    from,
                    to,
                    text,
                    rules,
                    plugin
                });
            },
            handleDOMEvents: {
                compositionend: (view)=>{
                    setTimeout(()=>{
                        const { $cursor } = view.state.selection;
                        if ($cursor) {
                            run$1({
                                editor,
                                from: $cursor.pos,
                                to: $cursor.pos,
                                text: '',
                                rules,
                                plugin
                            });
                        }
                    });
                    return false;
                }
            },
            // add support for input rules to trigger on enter
            // this is useful for example for code blocks
            handleKeyDown (view, event) {
                if (event.key !== 'Enter') {
                    return false;
                }
                const { $cursor } = view.state.selection;
                if ($cursor) {
                    return run$1({
                        editor,
                        from: $cursor.pos,
                        to: $cursor.pos,
                        text: '\n',
                        rules,
                        plugin
                    });
                }
                return false;
            }
        },
        // @ts-ignore
        isInputRules: true
    });
    return plugin;
}
// see: https://github.com/mesqueeb/is-what/blob/88d6e4ca92fb2baab6003c54e02eedf4e729e5ab/src/index.ts
function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}
function isPlainObject(value) {
    if (getType(value) !== 'Object') {
        return false;
    }
    return value.constructor === Object && Object.getPrototypeOf(value) === Object.prototype;
}
function mergeDeep(target, source) {
    const output = {
        ...target
    };
    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach((key)=>{
            if (isPlainObject(source[key]) && isPlainObject(target[key])) {
                output[key] = mergeDeep(target[key], source[key]);
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
}
/**
 * The Mark class is used to create custom mark extensions.
 * @see https://tiptap.dev/api/extensions#create-a-new-extension
 */ class Mark {
    constructor(config = {}){
        this.type = 'mark';
        this.name = 'mark';
        this.parent = null;
        this.child = null;
        this.config = {
            name: this.name,
            defaultOptions: {}
        };
        this.config = {
            ...this.config,
            ...config
        };
        this.name = this.config.name;
        if (config.defaultOptions && Object.keys(config.defaultOptions).length > 0) {
            console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`);
        }
        // TODO: remove `addOptions` fallback
        this.options = this.config.defaultOptions;
        if (this.config.addOptions) {
            this.options = callOrReturn(getExtensionField(this, 'addOptions', {
                name: this.name
            }));
        }
        this.storage = callOrReturn(getExtensionField(this, 'addStorage', {
            name: this.name,
            options: this.options
        })) || {};
    }
    static create(config = {}) {
        return new Mark(config);
    }
    configure(options = {}) {
        // return a new instance so we can use the same extension
        // with different calls of `configure`
        const extension = this.extend({
            ...this.config,
            addOptions: ()=>{
                return mergeDeep(this.options, options);
            }
        });
        // Always preserve the current name
        extension.name = this.name;
        // Set the parent to be our parent
        extension.parent = this.parent;
        return extension;
    }
    extend(extendedConfig = {}) {
        const extension = new Mark(extendedConfig);
        extension.parent = this;
        this.child = extension;
        extension.name = extendedConfig.name ? extendedConfig.name : extension.parent.name;
        if (extendedConfig.defaultOptions && Object.keys(extendedConfig.defaultOptions).length > 0) {
            console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`);
        }
        extension.options = callOrReturn(getExtensionField(extension, 'addOptions', {
            name: extension.name
        }));
        extension.storage = callOrReturn(getExtensionField(extension, 'addStorage', {
            name: extension.name,
            options: extension.options
        }));
        return extension;
    }
    static handleExit({ editor, mark }) {
        const { tr } = editor.state;
        const currentPos = editor.state.selection.$from;
        const isAtEnd = currentPos.pos === currentPos.end();
        if (isAtEnd) {
            const currentMarks = currentPos.marks();
            const isInMark = !!currentMarks.find((m)=>(m === null || m === void 0 ? void 0 : m.type.name) === mark.name);
            if (!isInMark) {
                return false;
            }
            const removeMark = currentMarks.find((m)=>(m === null || m === void 0 ? void 0 : m.type.name) === mark.name);
            if (removeMark) {
                tr.removeStoredMark(removeMark);
            }
            tr.insertText(' ', currentPos.pos);
            editor.view.dispatch(tr);
            return true;
        }
        return false;
    }
}
function isNumber(value) {
    return typeof value === 'number';
}
/**
 * Paste rules are used to react to pasted content.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#paste-rules
 */ class PasteRule {
    constructor(config){
        this.find = config.find;
        this.handler = config.handler;
    }
}
const pasteRuleMatcherHandler = (text, find, event)=>{
    if (isRegExp(find)) {
        return [
            ...text.matchAll(find)
        ];
    }
    const matches = find(text, event);
    if (!matches) {
        return [];
    }
    return matches.map((pasteRuleMatch)=>{
        const result = [
            pasteRuleMatch.text
        ];
        result.index = pasteRuleMatch.index;
        result.input = text;
        result.data = pasteRuleMatch.data;
        if (pasteRuleMatch.replaceWith) {
            if (!pasteRuleMatch.text.includes(pasteRuleMatch.replaceWith)) {
                console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".');
            }
            result.push(pasteRuleMatch.replaceWith);
        }
        return result;
    });
};
function run(config) {
    const { editor, state, from, to, rule, pasteEvent, dropEvent } = config;
    const { commands, chain, can } = new CommandManager({
        editor,
        state
    });
    const handlers = [];
    state.doc.nodesBetween(from, to, (node, pos)=>{
        if (!node.isTextblock || node.type.spec.code) {
            return;
        }
        const resolvedFrom = Math.max(from, pos);
        const resolvedTo = Math.min(to, pos + node.content.size);
        const textToMatch = node.textBetween(resolvedFrom - pos, resolvedTo - pos, undefined, '\ufffc');
        const matches = pasteRuleMatcherHandler(textToMatch, rule.find, pasteEvent);
        matches.forEach((match)=>{
            if (match.index === undefined) {
                return;
            }
            const start = resolvedFrom + match.index + 1;
            const end = start + match[0].length;
            const range = {
                from: state.tr.mapping.map(start),
                to: state.tr.mapping.map(end)
            };
            const handler = rule.handler({
                state,
                range,
                match,
                commands,
                chain,
                can,
                pasteEvent,
                dropEvent
            });
            handlers.push(handler);
        });
    });
    const success = handlers.every((handler)=>handler !== null);
    return success;
}
// When dragging across editors, must get another editor instance to delete selection content.
let tiptapDragFromOtherEditor = null;
const createClipboardPasteEvent = (text)=>{
    var _a;
    const event = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer()
    });
    (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.setData('text/html', text);
    return event;
};
/**
 * Create an paste rules plugin. When enabled, it will cause pasted
 * text that matches any of the given rules to trigger the rule’s
 * action.
 */ function pasteRulesPlugin(props) {
    const { editor, rules } = props;
    let dragSourceElement = null;
    let isPastedFromProseMirror = false;
    let isDroppedFromProseMirror = false;
    let pasteEvent = typeof ClipboardEvent !== 'undefined' ? new ClipboardEvent('paste') : null;
    let dropEvent;
    try {
        dropEvent = typeof DragEvent !== 'undefined' ? new DragEvent('drop') : null;
    } catch  {
        dropEvent = null;
    }
    const processEvent = ({ state, from, to, rule, pasteEvt })=>{
        const tr = state.tr;
        const chainableState = createChainableState({
            state,
            transaction: tr
        });
        const handler = run({
            editor,
            state: chainableState,
            from: Math.max(from - 1, 0),
            to: to.b - 1,
            rule,
            pasteEvent: pasteEvt,
            dropEvent
        });
        if (!handler || !tr.steps.length) {
            return;
        }
        try {
            dropEvent = typeof DragEvent !== 'undefined' ? new DragEvent('drop') : null;
        } catch  {
            dropEvent = null;
        }
        pasteEvent = typeof ClipboardEvent !== 'undefined' ? new ClipboardEvent('paste') : null;
        return tr;
    };
    const plugins = rules.map((rule)=>{
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
            // we register a global drag handler to track the current drag source element
            view (view) {
                const handleDragstart = (event)=>{
                    var _a;
                    dragSourceElement = ((_a = view.dom.parentElement) === null || _a === void 0 ? void 0 : _a.contains(event.target)) ? view.dom.parentElement : null;
                    if (dragSourceElement) {
                        tiptapDragFromOtherEditor = editor;
                    }
                };
                const handleDragend = ()=>{
                    if (tiptapDragFromOtherEditor) {
                        tiptapDragFromOtherEditor = null;
                    }
                };
                window.addEventListener('dragstart', handleDragstart);
                window.addEventListener('dragend', handleDragend);
                return {
                    destroy () {
                        window.removeEventListener('dragstart', handleDragstart);
                        window.removeEventListener('dragend', handleDragend);
                    }
                };
            },
            props: {
                handleDOMEvents: {
                    drop: (view, event)=>{
                        isDroppedFromProseMirror = dragSourceElement === view.dom.parentElement;
                        dropEvent = event;
                        if (!isDroppedFromProseMirror) {
                            const dragFromOtherEditor = tiptapDragFromOtherEditor;
                            if (dragFromOtherEditor === null || dragFromOtherEditor === void 0 ? void 0 : dragFromOtherEditor.isEditable) {
                                // setTimeout to avoid the wrong content after drop, timeout arg can't be empty or 0
                                setTimeout(()=>{
                                    const selection = dragFromOtherEditor.state.selection;
                                    if (selection) {
                                        dragFromOtherEditor.commands.deleteRange({
                                            from: selection.from,
                                            to: selection.to
                                        });
                                    }
                                }, 10);
                            }
                        }
                        return false;
                    },
                    paste: (_view, event)=>{
                        var _a;
                        const html = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text/html');
                        pasteEvent = event;
                        isPastedFromProseMirror = !!(html === null || html === void 0 ? void 0 : html.includes('data-pm-slice'));
                        return false;
                    }
                }
            },
            appendTransaction: (transactions, oldState, state)=>{
                const transaction = transactions[0];
                const isPaste = transaction.getMeta('uiEvent') === 'paste' && !isPastedFromProseMirror;
                const isDrop = transaction.getMeta('uiEvent') === 'drop' && !isDroppedFromProseMirror;
                // if PasteRule is triggered by insertContent()
                const simulatedPasteMeta = transaction.getMeta('applyPasteRules');
                const isSimulatedPaste = !!simulatedPasteMeta;
                if (!isPaste && !isDrop && !isSimulatedPaste) {
                    return;
                }
                // Handle simulated paste
                if (isSimulatedPaste) {
                    let { text } = simulatedPasteMeta;
                    if (typeof text === 'string') {
                        text = text;
                    } else {
                        text = getHTMLFromFragment(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(text), state.schema);
                    }
                    const { from } = simulatedPasteMeta;
                    const to = from + text.length;
                    const pasteEvt = createClipboardPasteEvent(text);
                    return processEvent({
                        rule,
                        state,
                        from,
                        to: {
                            b: to
                        },
                        pasteEvt
                    });
                }
                // handle actual paste/drop
                const from = oldState.doc.content.findDiffStart(state.doc.content);
                const to = oldState.doc.content.findDiffEnd(state.doc.content);
                // stop if there is no changed range
                if (!isNumber(from) || !to || from === to.b) {
                    return;
                }
                return processEvent({
                    rule,
                    state,
                    from,
                    to,
                    pasteEvt: pasteEvent
                });
            }
        });
    });
    return plugins;
}
function findDuplicates(items) {
    const filtered = items.filter((el, index)=>items.indexOf(el) !== index);
    return Array.from(new Set(filtered));
}
class ExtensionManager {
    constructor(extensions, editor){
        this.splittableMarks = [];
        this.editor = editor;
        this.extensions = ExtensionManager.resolve(extensions);
        this.schema = getSchemaByResolvedExtensions(this.extensions, editor);
        this.setupExtensions();
    }
    /**
     * Returns a flattened and sorted extension list while
     * also checking for duplicated extensions and warns the user.
     * @param extensions An array of Tiptap extensions
     * @returns An flattened and sorted array of Tiptap extensions
     */ static resolve(extensions) {
        const resolvedExtensions = ExtensionManager.sort(ExtensionManager.flatten(extensions));
        const duplicatedNames = findDuplicates(resolvedExtensions.map((extension)=>extension.name));
        if (duplicatedNames.length) {
            console.warn(`[tiptap warn]: Duplicate extension names found: [${duplicatedNames.map((item)=>`'${item}'`).join(', ')}]. This can lead to issues.`);
        }
        return resolvedExtensions;
    }
    /**
     * Create a flattened array of extensions by traversing the `addExtensions` field.
     * @param extensions An array of Tiptap extensions
     * @returns A flattened array of Tiptap extensions
     */ static flatten(extensions) {
        return extensions.map((extension)=>{
            const context = {
                name: extension.name,
                options: extension.options,
                storage: extension.storage
            };
            const addExtensions = getExtensionField(extension, 'addExtensions', context);
            if (addExtensions) {
                return [
                    extension,
                    ...this.flatten(addExtensions())
                ];
            }
            return extension;
        })// `Infinity` will break TypeScript so we set a number that is probably high enough
        .flat(10);
    }
    /**
     * Sort extensions by priority.
     * @param extensions An array of Tiptap extensions
     * @returns A sorted array of Tiptap extensions by priority
     */ static sort(extensions) {
        const defaultPriority = 100;
        return extensions.sort((a, b)=>{
            const priorityA = getExtensionField(a, 'priority') || defaultPriority;
            const priorityB = getExtensionField(b, 'priority') || defaultPriority;
            if (priorityA > priorityB) {
                return -1;
            }
            if (priorityA < priorityB) {
                return 1;
            }
            return 0;
        });
    }
    /**
     * Get all commands from the extensions.
     * @returns An object with all commands where the key is the command name and the value is the command function
     */ get commands() {
        return this.extensions.reduce((commands, extension)=>{
            const context = {
                name: extension.name,
                options: extension.options,
                storage: extension.storage,
                editor: this.editor,
                type: getSchemaTypeByName(extension.name, this.schema)
            };
            const addCommands = getExtensionField(extension, 'addCommands', context);
            if (!addCommands) {
                return commands;
            }
            return {
                ...commands,
                ...addCommands()
            };
        }, {});
    }
    /**
     * Get all registered Prosemirror plugins from the extensions.
     * @returns An array of Prosemirror plugins
     */ get plugins() {
        const { editor } = this;
        // With ProseMirror, first plugins within an array are executed first.
        // In Tiptap, we provide the ability to override plugins,
        // so it feels more natural to run plugins at the end of an array first.
        // That’s why we have to reverse the `extensions` array and sort again
        // based on the `priority` option.
        const extensions = ExtensionManager.sort([
            ...this.extensions
        ].reverse());
        const inputRules = [];
        const pasteRules = [];
        const allPlugins = extensions.map((extension)=>{
            const context = {
                name: extension.name,
                options: extension.options,
                storage: extension.storage,
                editor,
                type: getSchemaTypeByName(extension.name, this.schema)
            };
            const plugins = [];
            const addKeyboardShortcuts = getExtensionField(extension, 'addKeyboardShortcuts', context);
            let defaultBindings = {};
            // bind exit handling
            if (extension.type === 'mark' && getExtensionField(extension, 'exitable', context)) {
                defaultBindings.ArrowRight = ()=>Mark.handleExit({
                        editor,
                        mark: extension
                    });
            }
            if (addKeyboardShortcuts) {
                const bindings = Object.fromEntries(Object.entries(addKeyboardShortcuts()).map(([shortcut, method])=>{
                    return [
                        shortcut,
                        ()=>method({
                                editor
                            })
                    ];
                }));
                defaultBindings = {
                    ...defaultBindings,
                    ...bindings
                };
            }
            const keyMapPlugin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$keymap$40$1$2e$2$2e$3$2f$node_modules$2f$prosemirror$2d$keymap$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keymap"])(defaultBindings);
            plugins.push(keyMapPlugin);
            const addInputRules = getExtensionField(extension, 'addInputRules', context);
            if (isExtensionRulesEnabled(extension, editor.options.enableInputRules) && addInputRules) {
                inputRules.push(...addInputRules());
            }
            const addPasteRules = getExtensionField(extension, 'addPasteRules', context);
            if (isExtensionRulesEnabled(extension, editor.options.enablePasteRules) && addPasteRules) {
                pasteRules.push(...addPasteRules());
            }
            const addProseMirrorPlugins = getExtensionField(extension, 'addProseMirrorPlugins', context);
            if (addProseMirrorPlugins) {
                const proseMirrorPlugins = addProseMirrorPlugins();
                plugins.push(...proseMirrorPlugins);
            }
            return plugins;
        }).flat();
        return [
            inputRulesPlugin({
                editor,
                rules: inputRules
            }),
            ...pasteRulesPlugin({
                editor,
                rules: pasteRules
            }),
            ...allPlugins
        ];
    }
    /**
     * Get all attributes from the extensions.
     * @returns An array of attributes
     */ get attributes() {
        return getAttributesFromExtensions(this.extensions);
    }
    /**
     * Get all node views from the extensions.
     * @returns An object with all node views where the key is the node name and the value is the node view function
     */ get nodeViews() {
        const { editor } = this;
        const { nodeExtensions } = splitExtensions(this.extensions);
        return Object.fromEntries(nodeExtensions.filter((extension)=>!!getExtensionField(extension, 'addNodeView')).map((extension)=>{
            const extensionAttributes = this.attributes.filter((attribute)=>attribute.type === extension.name);
            const context = {
                name: extension.name,
                options: extension.options,
                storage: extension.storage,
                editor,
                type: getNodeType(extension.name, this.schema)
            };
            const addNodeView = getExtensionField(extension, 'addNodeView', context);
            if (!addNodeView) {
                return [];
            }
            const nodeview = (node, view, getPos, decorations, innerDecorations)=>{
                const HTMLAttributes = getRenderedAttributes(node, extensionAttributes);
                return addNodeView()({
                    // pass-through
                    node,
                    view,
                    getPos: getPos,
                    decorations,
                    innerDecorations,
                    // tiptap-specific
                    editor,
                    extension,
                    HTMLAttributes
                });
            };
            return [
                extension.name,
                nodeview
            ];
        }));
    }
    /**
     * Go through all extensions, create extension storages & setup marks
     * & bind editor event listener.
     */ setupExtensions() {
        this.extensions.forEach((extension)=>{
            var _a;
            // store extension storage in editor
            this.editor.extensionStorage[extension.name] = extension.storage;
            const context = {
                name: extension.name,
                options: extension.options,
                storage: extension.storage,
                editor: this.editor,
                type: getSchemaTypeByName(extension.name, this.schema)
            };
            if (extension.type === 'mark') {
                const keepOnSplit = (_a = callOrReturn(getExtensionField(extension, 'keepOnSplit', context))) !== null && _a !== void 0 ? _a : true;
                if (keepOnSplit) {
                    this.splittableMarks.push(extension.name);
                }
            }
            const onBeforeCreate = getExtensionField(extension, 'onBeforeCreate', context);
            const onCreate = getExtensionField(extension, 'onCreate', context);
            const onUpdate = getExtensionField(extension, 'onUpdate', context);
            const onSelectionUpdate = getExtensionField(extension, 'onSelectionUpdate', context);
            const onTransaction = getExtensionField(extension, 'onTransaction', context);
            const onFocus = getExtensionField(extension, 'onFocus', context);
            const onBlur = getExtensionField(extension, 'onBlur', context);
            const onDestroy = getExtensionField(extension, 'onDestroy', context);
            if (onBeforeCreate) {
                this.editor.on('beforeCreate', onBeforeCreate);
            }
            if (onCreate) {
                this.editor.on('create', onCreate);
            }
            if (onUpdate) {
                this.editor.on('update', onUpdate);
            }
            if (onSelectionUpdate) {
                this.editor.on('selectionUpdate', onSelectionUpdate);
            }
            if (onTransaction) {
                this.editor.on('transaction', onTransaction);
            }
            if (onFocus) {
                this.editor.on('focus', onFocus);
            }
            if (onBlur) {
                this.editor.on('blur', onBlur);
            }
            if (onDestroy) {
                this.editor.on('destroy', onDestroy);
            }
        });
    }
}
/**
 * The Extension class is the base class for all extensions.
 * @see https://tiptap.dev/api/extensions#create-a-new-extension
 */ class Extension {
    constructor(config = {}){
        this.type = 'extension';
        this.name = 'extension';
        this.parent = null;
        this.child = null;
        this.config = {
            name: this.name,
            defaultOptions: {}
        };
        this.config = {
            ...this.config,
            ...config
        };
        this.name = this.config.name;
        if (config.defaultOptions && Object.keys(config.defaultOptions).length > 0) {
            console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`);
        }
        // TODO: remove `addOptions` fallback
        this.options = this.config.defaultOptions;
        if (this.config.addOptions) {
            this.options = callOrReturn(getExtensionField(this, 'addOptions', {
                name: this.name
            }));
        }
        this.storage = callOrReturn(getExtensionField(this, 'addStorage', {
            name: this.name,
            options: this.options
        })) || {};
    }
    static create(config = {}) {
        return new Extension(config);
    }
    configure(options = {}) {
        // return a new instance so we can use the same extension
        // with different calls of `configure`
        const extension = this.extend({
            ...this.config,
            addOptions: ()=>{
                return mergeDeep(this.options, options);
            }
        });
        // Always preserve the current name
        extension.name = this.name;
        // Set the parent to be our parent
        extension.parent = this.parent;
        return extension;
    }
    extend(extendedConfig = {}) {
        const extension = new Extension({
            ...this.config,
            ...extendedConfig
        });
        extension.parent = this;
        this.child = extension;
        extension.name = extendedConfig.name ? extendedConfig.name : extension.parent.name;
        if (extendedConfig.defaultOptions && Object.keys(extendedConfig.defaultOptions).length > 0) {
            console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`);
        }
        extension.options = callOrReturn(getExtensionField(extension, 'addOptions', {
            name: extension.name
        }));
        extension.storage = callOrReturn(getExtensionField(extension, 'addStorage', {
            name: extension.name,
            options: extension.options
        }));
        return extension;
    }
}
/**
 * Gets the text between two positions in a Prosemirror node
 * and serializes it using the given text serializers and block separator (see getText)
 * @param startNode The Prosemirror node to start from
 * @param range The range of the text to get
 * @param options Options for the text serializer & block separator
 * @returns The text between the two positions
 */ function getTextBetween(startNode, range, options) {
    const { from, to } = range;
    const { blockSeparator = '\n\n', textSerializers = {} } = options || {};
    let text = '';
    startNode.nodesBetween(from, to, (node, pos, parent, index)=>{
        var _a;
        if (node.isBlock && pos > from) {
            text += blockSeparator;
        }
        const textSerializer = textSerializers === null || textSerializers === void 0 ? void 0 : textSerializers[node.type.name];
        if (textSerializer) {
            if (parent) {
                text += textSerializer({
                    node,
                    pos,
                    parent,
                    index,
                    range
                });
            }
            // do not descend into child nodes when there exists a serializer
            return false;
        }
        if (node.isText) {
            text += (_a = node === null || node === void 0 ? void 0 : node.text) === null || _a === void 0 ? void 0 : _a.slice(Math.max(from, pos) - pos, to - pos); // eslint-disable-line
        }
    });
    return text;
}
/**
 * Find text serializers `toText` in a Prosemirror schema
 * @param schema The Prosemirror schema to search in
 * @returns A record of text serializers by node name
 */ function getTextSerializersFromSchema(schema) {
    return Object.fromEntries(Object.entries(schema.nodes).filter(([, node])=>node.spec.toText).map(([name, node])=>[
            name,
            node.spec.toText
        ]));
}
const ClipboardTextSerializer = Extension.create({
    name: 'clipboardTextSerializer',
    addOptions () {
        return {
            blockSeparator: undefined
        };
    },
    addProseMirrorPlugins () {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('clipboardTextSerializer'),
                props: {
                    clipboardTextSerializer: ()=>{
                        const { editor } = this;
                        const { state, schema } = editor;
                        const { doc, selection } = state;
                        const { ranges } = selection;
                        const from = Math.min(...ranges.map((range)=>range.$from.pos));
                        const to = Math.max(...ranges.map((range)=>range.$to.pos));
                        const textSerializers = getTextSerializersFromSchema(schema);
                        const range = {
                            from,
                            to
                        };
                        return getTextBetween(doc, range, {
                            ...this.options.blockSeparator !== undefined ? {
                                blockSeparator: this.options.blockSeparator
                            } : {},
                            textSerializers
                        });
                    }
                }
            })
        ];
    }
});
const blur = ()=>({ editor, view })=>{
        requestAnimationFrame(()=>{
            var _a;
            if (!editor.isDestroyed) {
                view.dom.blur();
                // Browsers should remove the caret on blur but safari does not.
                // See: https://github.com/ueberdosis/tiptap/issues/2405
                (_a = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            }
        });
        return true;
    };
const clearContent = (emitUpdate = false)=>({ commands })=>{
        return commands.setContent('', emitUpdate);
    };
const clearNodes = ()=>({ state, tr, dispatch })=>{
        const { selection } = tr;
        const { ranges } = selection;
        if (!dispatch) {
            return true;
        }
        ranges.forEach(({ $from, $to })=>{
            state.doc.nodesBetween($from.pos, $to.pos, (node, pos)=>{
                if (node.type.isText) {
                    return;
                }
                const { doc, mapping } = tr;
                const $mappedFrom = doc.resolve(mapping.map(pos));
                const $mappedTo = doc.resolve(mapping.map(pos + node.nodeSize));
                const nodeRange = $mappedFrom.blockRange($mappedTo);
                if (!nodeRange) {
                    return;
                }
                const targetLiftDepth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liftTarget"])(nodeRange);
                if (node.type.isTextblock) {
                    const { defaultType } = $mappedFrom.parent.contentMatchAt($mappedFrom.index());
                    tr.setNodeMarkup(nodeRange.start, defaultType);
                }
                if (targetLiftDepth || targetLiftDepth === 0) {
                    tr.lift(nodeRange, targetLiftDepth);
                }
            });
        });
        return true;
    };
const command = (fn)=>(props)=>{
        return fn(props);
    };
const createParagraphNear = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createParagraphNear"])(state, dispatch);
    };
const cut = (originRange, targetPos)=>({ editor, tr })=>{
        const { state } = editor;
        const contentSlice = state.doc.slice(originRange.from, originRange.to);
        tr.deleteRange(originRange.from, originRange.to);
        const newPos = tr.mapping.map(targetPos);
        tr.insert(newPos, contentSlice.content);
        tr.setSelection(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"](tr.doc.resolve(Math.max(newPos - 1, 0))));
        return true;
    };
const deleteCurrentNode = ()=>({ tr, dispatch })=>{
        const { selection } = tr;
        const currentNode = selection.$anchor.node();
        // if there is content inside the current node, break out of this command
        if (currentNode.content.size > 0) {
            return false;
        }
        const $pos = tr.selection.$anchor;
        for(let depth = $pos.depth; depth > 0; depth -= 1){
            const node = $pos.node(depth);
            if (node.type === currentNode.type) {
                if (dispatch) {
                    const from = $pos.before(depth);
                    const to = $pos.after(depth);
                    tr.delete(from, to).scrollIntoView();
                }
                return true;
            }
        }
        return false;
    };
const deleteNode = (typeOrName)=>({ tr, state, dispatch })=>{
        const type = getNodeType(typeOrName, state.schema);
        const $pos = tr.selection.$anchor;
        for(let depth = $pos.depth; depth > 0; depth -= 1){
            const node = $pos.node(depth);
            if (node.type === type) {
                if (dispatch) {
                    const from = $pos.before(depth);
                    const to = $pos.after(depth);
                    tr.delete(from, to).scrollIntoView();
                }
                return true;
            }
        }
        return false;
    };
const deleteRange = (range)=>({ tr, dispatch })=>{
        const { from, to } = range;
        if (dispatch) {
            tr.delete(from, to);
        }
        return true;
    };
const deleteSelection = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteSelection"])(state, dispatch);
    };
const enter = ()=>({ commands })=>{
        return commands.keyboardShortcut('Enter');
    };
const exitCode = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exitCode"])(state, dispatch);
    };
/**
 * Check if object1 includes object2
 * @param object1 Object
 * @param object2 Object
 */ function objectIncludes(object1, object2, options = {
    strict: true
}) {
    const keys = Object.keys(object2);
    if (!keys.length) {
        return true;
    }
    return keys.every((key)=>{
        if (options.strict) {
            return object2[key] === object1[key];
        }
        if (isRegExp(object2[key])) {
            return object2[key].test(object1[key]);
        }
        return object2[key] === object1[key];
    });
}
function findMarkInSet(marks, type, attributes = {}) {
    return marks.find((item)=>{
        return item.type === type && objectIncludes(// Only check equality for the attributes that are provided
        Object.fromEntries(Object.keys(attributes).map((k)=>[
                k,
                item.attrs[k]
            ])), attributes);
    });
}
function isMarkInSet(marks, type, attributes = {}) {
    return !!findMarkInSet(marks, type, attributes);
}
/**
 * Get the range of a mark at a resolved position.
 */ function getMarkRange(/**
 * The position to get the mark range for.
 */ $pos, /**
 * The mark type to get the range for.
 */ type, /**
 * The attributes to match against.
 * If not provided, only the first mark at the position will be matched.
 */ attributes) {
    var _a;
    if (!$pos || !type) {
        return;
    }
    let start = $pos.parent.childAfter($pos.parentOffset);
    // If the cursor is at the start of a text node that does not have the mark, look backward
    if (!start.node || !start.node.marks.some((mark)=>mark.type === type)) {
        start = $pos.parent.childBefore($pos.parentOffset);
    }
    // If there is no text node with the mark even backward, return undefined
    if (!start.node || !start.node.marks.some((mark)=>mark.type === type)) {
        return;
    }
    // Default to only matching against the first mark's attributes
    attributes = attributes || ((_a = start.node.marks[0]) === null || _a === void 0 ? void 0 : _a.attrs);
    // We now know that the cursor is either at the start, middle or end of a text node with the specified mark
    // so we can look it up on the targeted mark
    const mark = findMarkInSet([
        ...start.node.marks
    ], type, attributes);
    if (!mark) {
        return;
    }
    let startIndex = start.index;
    let startPos = $pos.start() + start.offset;
    let endIndex = startIndex + 1;
    let endPos = startPos + start.node.nodeSize;
    while(startIndex > 0 && isMarkInSet([
        ...$pos.parent.child(startIndex - 1).marks
    ], type, attributes)){
        startIndex -= 1;
        startPos -= $pos.parent.child(startIndex).nodeSize;
    }
    while(endIndex < $pos.parent.childCount && isMarkInSet([
        ...$pos.parent.child(endIndex).marks
    ], type, attributes)){
        endPos += $pos.parent.child(endIndex).nodeSize;
        endIndex += 1;
    }
    return {
        from: startPos,
        to: endPos
    };
}
function getMarkType(nameOrType, schema) {
    if (typeof nameOrType === 'string') {
        if (!schema.marks[nameOrType]) {
            throw Error(`There is no mark type named '${nameOrType}'. Maybe you forgot to add the extension?`);
        }
        return schema.marks[nameOrType];
    }
    return nameOrType;
}
const extendMarkRange = (typeOrName, attributes = {})=>({ tr, state, dispatch })=>{
        const type = getMarkType(typeOrName, state.schema);
        const { doc, selection } = tr;
        const { $from, from, to } = selection;
        if (dispatch) {
            const range = getMarkRange($from, type, attributes);
            if (range && range.from <= from && range.to >= to) {
                const newSelection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(doc, range.from, range.to);
                tr.setSelection(newSelection);
            }
        }
        return true;
    };
const first = (commands)=>(props)=>{
        const items = typeof commands === 'function' ? commands(props) : commands;
        for(let i = 0; i < items.length; i += 1){
            if (items[i](props)) {
                return true;
            }
        }
        return false;
    };
function isTextSelection(value) {
    return value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"];
}
function minMax(value = 0, min = 0, max = 0) {
    return Math.min(Math.max(value, min), max);
}
function resolveFocusPosition(doc, position = null) {
    if (!position) {
        return null;
    }
    const selectionAtStart = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"].atStart(doc);
    const selectionAtEnd = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"].atEnd(doc);
    if (position === 'start' || position === true) {
        return selectionAtStart;
    }
    if (position === 'end') {
        return selectionAtEnd;
    }
    const minPos = selectionAtStart.from;
    const maxPos = selectionAtEnd.to;
    if (position === 'all') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(doc, minMax(0, minPos, maxPos), minMax(doc.content.size, minPos, maxPos));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(doc, minMax(position, minPos, maxPos), minMax(position, minPos, maxPos));
}
function isAndroid() {
    return navigator.platform === 'Android' || /android/i.test(navigator.userAgent);
}
function isiOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform) || navigator.userAgent.includes('Mac') && 'ontouchend' in document;
}
const focus = (position = null, options = {})=>({ editor, view, tr, dispatch })=>{
        options = {
            scrollIntoView: true,
            ...options
        };
        const delayedFocus = ()=>{
            // focus within `requestAnimationFrame` breaks focus on iOS and Android
            // so we have to call this
            if (isiOS() || isAndroid()) {
                view.dom.focus();
            }
            // For React we have to focus asynchronously. Otherwise wild things happen.
            // see: https://github.com/ueberdosis/tiptap/issues/1520
            requestAnimationFrame(()=>{
                if (!editor.isDestroyed) {
                    view.focus();
                    if (options === null || options === void 0 ? void 0 : options.scrollIntoView) {
                        editor.commands.scrollIntoView();
                    }
                }
            });
        };
        if (view.hasFocus() && position === null || position === false) {
            return true;
        }
        // we don’t try to resolve a NodeSelection or CellSelection
        if (dispatch && position === null && !isTextSelection(editor.state.selection)) {
            delayedFocus();
            return true;
        }
        // pass through tr.doc instead of editor.state.doc
        // since transactions could change the editors state before this command has been run
        const selection = resolveFocusPosition(tr.doc, position) || editor.state.selection;
        const isSameSelection = editor.state.selection.eq(selection);
        if (dispatch) {
            if (!isSameSelection) {
                tr.setSelection(selection);
            }
            // `tr.setSelection` resets the stored marks
            // so we’ll restore them if the selection is the same as before
            if (isSameSelection && tr.storedMarks) {
                tr.setStoredMarks(tr.storedMarks);
            }
            delayedFocus();
        }
        return true;
    };
const forEach = (items, fn)=>(props)=>{
        return items.every((item, index)=>fn(item, {
                ...props,
                index
            }));
    };
const insertContent = (value, options)=>({ tr, commands })=>{
        return commands.insertContentAt({
            from: tr.selection.from,
            to: tr.selection.to
        }, value, options);
    };
const removeWhitespaces = (node)=>{
    const children = node.childNodes;
    for(let i = children.length - 1; i >= 0; i -= 1){
        const child = children[i];
        if (child.nodeType === 3 && child.nodeValue && /^(\n\s\s|\n)$/.test(child.nodeValue)) {
            node.removeChild(child);
        } else if (child.nodeType === 1) {
            removeWhitespaces(child);
        }
    }
    return node;
};
function elementFromString(value) {
    // add a wrapper to preserve leading and trailing whitespace
    const wrappedValue = `<body>${value}</body>`;
    const html = new window.DOMParser().parseFromString(wrappedValue, 'text/html').body;
    return removeWhitespaces(html);
}
/**
 * Takes a JSON or HTML content and creates a Prosemirror node or fragment from it.
 * @param content The JSON or HTML content to create the node from
 * @param schema The Prosemirror schema to use for the node
 * @param options Options for the parser
 * @returns The created Prosemirror node or fragment
 */ function createNodeFromContent(content, schema, options) {
    if (content instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"] || content instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) {
        return content;
    }
    options = {
        slice: true,
        parseOptions: {},
        ...options
    };
    const isJSONContent = typeof content === 'object' && content !== null;
    const isTextContent = typeof content === 'string';
    if (isJSONContent) {
        try {
            const isArrayContent = Array.isArray(content) && content.length > 0;
            // if the JSON Content is an array of nodes, create a fragment for each node
            if (isArrayContent) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].fromArray(content.map((item)=>schema.nodeFromJSON(item)));
            }
            const node = schema.nodeFromJSON(content);
            if (options.errorOnInvalidContent) {
                node.check();
            }
            return node;
        } catch (error) {
            if (options.errorOnInvalidContent) {
                throw new Error('[tiptap error]: Invalid JSON content', {
                    cause: error
                });
            }
            console.warn('[tiptap warn]: Invalid content.', 'Passed value:', content, 'Error:', error);
            return createNodeFromContent('', schema, options);
        }
    }
    if (isTextContent) {
        // Check for invalid content
        if (options.errorOnInvalidContent) {
            let hasInvalidContent = false;
            let invalidContent = '';
            // A copy of the current schema with a catch-all node at the end
            const contentCheckSchema = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Schema"]({
                topNode: schema.spec.topNode,
                marks: schema.spec.marks,
                // Prosemirror's schemas are executed such that: the last to execute, matches last
                // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
                nodes: schema.spec.nodes.append({
                    __tiptap__private__unknown__catch__all__node: {
                        content: 'inline*',
                        group: 'block',
                        parseDOM: [
                            {
                                tag: '*',
                                getAttrs: (e)=>{
                                    // If this is ever called, we know that the content has something that we don't know how to handle in the schema
                                    hasInvalidContent = true;
                                    // Try to stringify the element for a more helpful error message
                                    invalidContent = typeof e === 'string' ? e : e.outerHTML;
                                    return null;
                                }
                            }
                        ]
                    }
                })
            });
            if (options.slice) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DOMParser"].fromSchema(contentCheckSchema).parseSlice(elementFromString(content), options.parseOptions);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DOMParser"].fromSchema(contentCheckSchema).parse(elementFromString(content), options.parseOptions);
            }
            if (options.errorOnInvalidContent && hasInvalidContent) {
                throw new Error('[tiptap error]: Invalid HTML content', {
                    cause: new Error(`Invalid element found: ${invalidContent}`)
                });
            }
        }
        const parser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DOMParser"].fromSchema(schema);
        if (options.slice) {
            return parser.parseSlice(elementFromString(content), options.parseOptions).content;
        }
        return parser.parse(elementFromString(content), options.parseOptions);
    }
    return createNodeFromContent('', schema, options);
}
// source: https://github.com/ProseMirror/prosemirror-state/blob/master/src/selection.js#L466
function selectionToInsertionEnd(tr, startLen, bias) {
    const last = tr.steps.length - 1;
    if (last < startLen) {
        return;
    }
    const step = tr.steps[last];
    if (!(step instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplaceStep"] || step instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplaceAroundStep"])) {
        return;
    }
    const map = tr.mapping.maps[last];
    let end = 0;
    map.forEach((_from, _to, _newFrom, newTo)=>{
        if (end === 0) {
            end = newTo;
        }
    });
    tr.setSelection(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"].near(tr.doc.resolve(end), bias));
}
const isFragment = (nodeOrFragment)=>{
    return !('type' in nodeOrFragment);
};
const insertContentAt = (position, value, options)=>({ tr, dispatch, editor })=>{
        var _a;
        if (dispatch) {
            options = {
                parseOptions: editor.options.parseOptions,
                updateSelection: true,
                applyInputRules: false,
                applyPasteRules: false,
                ...options
            };
            let content;
            const emitContentError = (error)=>{
                editor.emit('contentError', {
                    editor,
                    error,
                    disableCollaboration: ()=>{
                        if (editor.storage.collaboration) {
                            editor.storage.collaboration.isDisabled = true;
                        }
                    }
                });
            };
            const parseOptions = {
                preserveWhitespace: 'full',
                ...options.parseOptions
            };
            // If `emitContentError` is enabled, we want to check the content for errors
            // but ignore them (do not remove the invalid content from the document)
            if (!options.errorOnInvalidContent && !editor.options.enableContentCheck && editor.options.emitContentError) {
                try {
                    createNodeFromContent(value, editor.schema, {
                        parseOptions,
                        errorOnInvalidContent: true
                    });
                } catch (e) {
                    emitContentError(e);
                }
            }
            try {
                content = createNodeFromContent(value, editor.schema, {
                    parseOptions,
                    errorOnInvalidContent: (_a = options.errorOnInvalidContent) !== null && _a !== void 0 ? _a : editor.options.enableContentCheck
                });
            } catch (e) {
                emitContentError(e);
                return false;
            }
            let { from, to } = typeof position === 'number' ? {
                from: position,
                to: position
            } : {
                from: position.from,
                to: position.to
            };
            let isOnlyTextContent = true;
            let isOnlyBlockContent = true;
            const nodes = isFragment(content) ? content : [
                content
            ];
            nodes.forEach((node)=>{
                // check if added node is valid
                node.check();
                isOnlyTextContent = isOnlyTextContent ? node.isText && node.marks.length === 0 : false;
                isOnlyBlockContent = isOnlyBlockContent ? node.isBlock : false;
            });
            // check if we can replace the wrapping node by
            // the newly inserted content
            // example:
            // replace an empty paragraph by an inserted image
            // instead of inserting the image below the paragraph
            if (from === to && isOnlyBlockContent) {
                const { parent } = tr.doc.resolve(from);
                const isEmptyTextBlock = parent.isTextblock && !parent.type.spec.code && !parent.childCount;
                if (isEmptyTextBlock) {
                    from -= 1;
                    to += 1;
                }
            }
            let newContent;
            // if there is only plain text we have to use `insertText`
            // because this will keep the current marks
            if (isOnlyTextContent) {
                // if value is string, we can use it directly
                // otherwise if it is an array, we have to join it
                if (Array.isArray(value)) {
                    newContent = value.map((v)=>v.text || '').join('');
                } else if (value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) {
                    let text = '';
                    value.forEach((node)=>{
                        if (node.text) {
                            text += node.text;
                        }
                    });
                    newContent = text;
                } else if (typeof value === 'object' && !!value && !!value.text) {
                    newContent = value.text;
                } else {
                    newContent = value;
                }
                tr.insertText(newContent, from, to);
            } else {
                newContent = content;
                tr.replaceWith(from, to, newContent);
            }
            // set cursor at end of inserted content
            if (options.updateSelection) {
                selectionToInsertionEnd(tr, tr.steps.length - 1, -1);
            }
            if (options.applyInputRules) {
                tr.setMeta('applyInputRules', {
                    from,
                    text: newContent
                });
            }
            if (options.applyPasteRules) {
                tr.setMeta('applyPasteRules', {
                    from,
                    text: newContent
                });
            }
        }
        return true;
    };
const joinUp = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinUp"])(state, dispatch);
    };
const joinDown = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinDown"])(state, dispatch);
    };
const joinBackward = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinBackward"])(state, dispatch);
    };
const joinForward = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinForward"])(state, dispatch);
    };
const joinItemBackward = ()=>({ state, dispatch, tr })=>{
        try {
            const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinPoint"])(state.doc, state.selection.$from.pos, -1);
            if (point === null || point === undefined) {
                return false;
            }
            tr.join(point, 2);
            if (dispatch) {
                dispatch(tr);
            }
            return true;
        } catch  {
            return false;
        }
    };
const joinItemForward = ()=>({ state, dispatch, tr })=>{
        try {
            const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinPoint"])(state.doc, state.selection.$from.pos, +1);
            if (point === null || point === undefined) {
                return false;
            }
            tr.join(point, 2);
            if (dispatch) {
                dispatch(tr);
            }
            return true;
        } catch  {
            return false;
        }
    };
const joinTextblockBackward = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinTextblockBackward"])(state, dispatch);
    };
const joinTextblockForward = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinTextblockForward"])(state, dispatch);
    };
function isMacOS() {
    return typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
}
function normalizeKeyName(name) {
    const parts = name.split(/-(?!$)/);
    let result = parts[parts.length - 1];
    if (result === 'Space') {
        result = ' ';
    }
    let alt;
    let ctrl;
    let shift;
    let meta;
    for(let i = 0; i < parts.length - 1; i += 1){
        const mod = parts[i];
        if (/^(cmd|meta|m)$/i.test(mod)) {
            meta = true;
        } else if (/^a(lt)?$/i.test(mod)) {
            alt = true;
        } else if (/^(c|ctrl|control)$/i.test(mod)) {
            ctrl = true;
        } else if (/^s(hift)?$/i.test(mod)) {
            shift = true;
        } else if (/^mod$/i.test(mod)) {
            if (isiOS() || isMacOS()) {
                meta = true;
            } else {
                ctrl = true;
            }
        } else {
            throw new Error(`Unrecognized modifier name: ${mod}`);
        }
    }
    if (alt) {
        result = `Alt-${result}`;
    }
    if (ctrl) {
        result = `Ctrl-${result}`;
    }
    if (meta) {
        result = `Meta-${result}`;
    }
    if (shift) {
        result = `Shift-${result}`;
    }
    return result;
}
const keyboardShortcut = (name)=>({ editor, view, tr, dispatch })=>{
        const keys = normalizeKeyName(name).split(/-(?!$)/);
        const key = keys.find((item)=>![
                'Alt',
                'Ctrl',
                'Meta',
                'Shift'
            ].includes(item));
        const event = new KeyboardEvent('keydown', {
            key: key === 'Space' ? ' ' : key,
            altKey: keys.includes('Alt'),
            ctrlKey: keys.includes('Ctrl'),
            metaKey: keys.includes('Meta'),
            shiftKey: keys.includes('Shift'),
            bubbles: true,
            cancelable: true
        });
        const capturedTransaction = editor.captureTransaction(()=>{
            view.someProp('handleKeyDown', (f)=>f(view, event));
        });
        capturedTransaction === null || capturedTransaction === void 0 ? void 0 : capturedTransaction.steps.forEach((step)=>{
            const newStep = step.map(tr.mapping);
            if (newStep && dispatch) {
                tr.maybeStep(newStep);
            }
        });
        return true;
    };
function isNodeActive(state, typeOrName, attributes = {}) {
    const { from, to, empty } = state.selection;
    const type = typeOrName ? getNodeType(typeOrName, state.schema) : null;
    const nodeRanges = [];
    state.doc.nodesBetween(from, to, (node, pos)=>{
        if (node.isText) {
            return;
        }
        const relativeFrom = Math.max(from, pos);
        const relativeTo = Math.min(to, pos + node.nodeSize);
        nodeRanges.push({
            node,
            from: relativeFrom,
            to: relativeTo
        });
    });
    const selectionRange = to - from;
    const matchedNodeRanges = nodeRanges.filter((nodeRange)=>{
        if (!type) {
            return true;
        }
        return type.name === nodeRange.node.type.name;
    }).filter((nodeRange)=>objectIncludes(nodeRange.node.attrs, attributes, {
            strict: false
        }));
    if (empty) {
        return !!matchedNodeRanges.length;
    }
    const range = matchedNodeRanges.reduce((sum, nodeRange)=>sum + nodeRange.to - nodeRange.from, 0);
    return range >= selectionRange;
}
const lift = (typeOrName, attributes = {})=>({ state, dispatch })=>{
        const type = getNodeType(typeOrName, state.schema);
        const isActive = isNodeActive(state, type, attributes);
        if (!isActive) {
            return false;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lift"])(state, dispatch);
    };
const liftEmptyBlock = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liftEmptyBlock"])(state, dispatch);
    };
const liftListItem = (typeOrName)=>({ state, dispatch })=>{
        const type = getNodeType(typeOrName, state.schema);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$schema$2d$list$40$1$2e$5$2e$1$2f$node_modules$2f$prosemirror$2d$schema$2d$list$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liftListItem"])(type)(state, dispatch);
    };
const newlineInCode = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newlineInCode"])(state, dispatch);
    };
/**
 * Get the type of a schema item by its name.
 * @param name The name of the schema item
 * @param schema The Prosemiror schema to search in
 * @returns The type of the schema item (`node` or `mark`), or null if it doesn't exist
 */ function getSchemaTypeNameByName(name, schema) {
    if (schema.nodes[name]) {
        return 'node';
    }
    if (schema.marks[name]) {
        return 'mark';
    }
    return null;
}
/**
 * Remove a property or an array of properties from an object
 * @param obj Object
 * @param key Key to remove
 */ function deleteProps(obj, propOrProps) {
    const props = typeof propOrProps === 'string' ? [
        propOrProps
    ] : propOrProps;
    return Object.keys(obj).reduce((newObj, prop)=>{
        if (!props.includes(prop)) {
            newObj[prop] = obj[prop];
        }
        return newObj;
    }, {});
}
const resetAttributes = (typeOrName, attributes)=>({ tr, state, dispatch })=>{
        let nodeType = null;
        let markType = null;
        const schemaType = getSchemaTypeNameByName(typeof typeOrName === 'string' ? typeOrName : typeOrName.name, state.schema);
        if (!schemaType) {
            return false;
        }
        if (schemaType === 'node') {
            nodeType = getNodeType(typeOrName, state.schema);
        }
        if (schemaType === 'mark') {
            markType = getMarkType(typeOrName, state.schema);
        }
        if (dispatch) {
            tr.selection.ranges.forEach((range)=>{
                state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node, pos)=>{
                    if (nodeType && nodeType === node.type) {
                        tr.setNodeMarkup(pos, undefined, deleteProps(node.attrs, attributes));
                    }
                    if (markType && node.marks.length) {
                        node.marks.forEach((mark)=>{
                            if (markType === mark.type) {
                                tr.addMark(pos, pos + node.nodeSize, markType.create(deleteProps(mark.attrs, attributes)));
                            }
                        });
                    }
                });
            });
        }
        return true;
    };
const scrollIntoView = ()=>({ tr, dispatch })=>{
        if (dispatch) {
            tr.scrollIntoView();
        }
        return true;
    };
const selectAll = ()=>({ tr, dispatch })=>{
        if (dispatch) {
            const selection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AllSelection"](tr.doc);
            tr.setSelection(selection);
        }
        return true;
    };
const selectNodeBackward = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectNodeBackward"])(state, dispatch);
    };
const selectNodeForward = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectNodeForward"])(state, dispatch);
    };
const selectParentNode = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectParentNode"])(state, dispatch);
    };
// @ts-ignore
// TODO: add types to @types/prosemirror-commands
const selectTextblockEnd = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTextblockEnd"])(state, dispatch);
    };
// @ts-ignore
// TODO: add types to @types/prosemirror-commands
const selectTextblockStart = ()=>({ state, dispatch })=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTextblockStart"])(state, dispatch);
    };
/**
 * Create a new Prosemirror document node from content.
 * @param content The JSON or HTML content to create the document from
 * @param schema The Prosemirror schema to use for the document
 * @param parseOptions Options for the parser
 * @returns The created Prosemirror document node
 */ function createDocument(content, schema, parseOptions = {}, options = {}) {
    return createNodeFromContent(content, schema, {
        slice: false,
        parseOptions,
        errorOnInvalidContent: options.errorOnInvalidContent
    });
}
const setContent = (content, emitUpdate = false, parseOptions = {}, options = {})=>({ editor, tr, dispatch, commands })=>{
        var _a, _b;
        const { doc } = tr;
        // This is to keep backward compatibility with the previous behavior
        // TODO remove this in the next major version
        if (parseOptions.preserveWhitespace !== 'full') {
            const document1 = createDocument(content, editor.schema, parseOptions, {
                errorOnInvalidContent: (_a = options.errorOnInvalidContent) !== null && _a !== void 0 ? _a : editor.options.enableContentCheck
            });
            if (dispatch) {
                tr.replaceWith(0, doc.content.size, document1).setMeta('preventUpdate', !emitUpdate);
            }
            return true;
        }
        if (dispatch) {
            tr.setMeta('preventUpdate', !emitUpdate);
        }
        return commands.insertContentAt({
            from: 0,
            to: doc.content.size
        }, content, {
            parseOptions,
            errorOnInvalidContent: (_b = options.errorOnInvalidContent) !== null && _b !== void 0 ? _b : editor.options.enableContentCheck
        });
    };
function getMarkAttributes(state, typeOrName) {
    const type = getMarkType(typeOrName, state.schema);
    const { from, to, empty } = state.selection;
    const marks = [];
    if (empty) {
        if (state.storedMarks) {
            marks.push(...state.storedMarks);
        }
        marks.push(...state.selection.$head.marks());
    } else {
        state.doc.nodesBetween(from, to, (node)=>{
            marks.push(...node.marks);
        });
    }
    const mark = marks.find((markItem)=>markItem.type.name === type.name);
    if (!mark) {
        return {};
    }
    return {
        ...mark.attrs
    };
}
/**
 * Returns a new `Transform` based on all steps of the passed transactions.
 * @param oldDoc The Prosemirror node to start from
 * @param transactions The transactions to combine
 * @returns A new `Transform` with all steps of the passed transactions
 */ function combineTransactionSteps(oldDoc, transactions) {
    const transform = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](oldDoc);
    transactions.forEach((transaction)=>{
        transaction.steps.forEach((step)=>{
            transform.step(step);
        });
    });
    return transform;
}
/**
 * Gets the default block type at a given match
 * @param match The content match to get the default block type from
 * @returns The default block type or null
 */ function defaultBlockAt(match) {
    for(let i = 0; i < match.edgeCount; i += 1){
        const { type } = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs()) {
            return type;
        }
    }
    return null;
}
/**
 * Find children inside a Prosemirror node that match a predicate.
 * @param node The Prosemirror node to search in
 * @param predicate The predicate to match
 * @returns An array of nodes with their positions
 */ function findChildren(node, predicate) {
    const nodesWithPos = [];
    node.descendants((child, pos)=>{
        if (predicate(child)) {
            nodesWithPos.push({
                node: child,
                pos
            });
        }
    });
    return nodesWithPos;
}
/**
 * Same as `findChildren` but searches only within a `range`.
 * @param node The Prosemirror node to search in
 * @param range The range to search in
 * @param predicate The predicate to match
 * @returns An array of nodes with their positions
 */ function findChildrenInRange(node, range, predicate) {
    const nodesWithPos = [];
    // if (range.from === range.to) {
    //   const nodeAt = node.nodeAt(range.from)
    //   if (nodeAt) {
    //     nodesWithPos.push({
    //       node: nodeAt,
    //       pos: range.from,
    //     })
    //   }
    // }
    node.nodesBetween(range.from, range.to, (child, pos)=>{
        if (predicate(child)) {
            nodesWithPos.push({
                node: child,
                pos
            });
        }
    });
    return nodesWithPos;
}
/**
 * Finds the closest parent node to a resolved position that matches a predicate.
 * @param $pos The resolved position to search from
 * @param predicate The predicate to match
 * @returns The closest parent node to the resolved position that matches the predicate
 * @example ```js
 * findParentNodeClosestToPos($from, node => node.type.name === 'paragraph')
 * ```
 */ function findParentNodeClosestToPos($pos, predicate) {
    for(let i = $pos.depth; i > 0; i -= 1){
        const node = $pos.node(i);
        if (predicate(node)) {
            return {
                pos: i > 0 ? $pos.before(i) : 0,
                start: $pos.start(i),
                depth: i,
                node
            };
        }
    }
}
/**
 * Finds the closest parent node to the current selection that matches a predicate.
 * @param predicate The predicate to match
 * @returns A command that finds the closest parent node to the current selection that matches the predicate
 * @example ```js
 * findParentNode(node => node.type.name === 'paragraph')
 * ```
 */ function findParentNode(predicate) {
    return (selection)=>findParentNodeClosestToPos(selection.$from, predicate);
}
function getSchema(extensions, editor) {
    const resolvedExtensions = ExtensionManager.resolve(extensions);
    return getSchemaByResolvedExtensions(resolvedExtensions, editor);
}
/**
 * Generate HTML from a JSONContent
 * @param doc The JSONContent to generate HTML from
 * @param extensions The extensions to use for the schema
 * @returns The generated HTML
 */ function generateHTML(doc, extensions) {
    const schema = getSchema(extensions);
    const contentNode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].fromJSON(schema, doc);
    return getHTMLFromFragment(contentNode.content, schema);
}
/**
 * Generate JSONContent from HTML
 * @param html The HTML to generate JSONContent from
 * @param extensions The extensions to use for the schema
 * @returns The generated JSONContent
 */ function generateJSON(html, extensions) {
    const schema = getSchema(extensions);
    const dom = elementFromString(html);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DOMParser"].fromSchema(schema).parse(dom).toJSON();
}
/**
 * Gets the text of a Prosemirror node
 * @param node The Prosemirror node
 * @param options Options for the text serializer & block separator
 * @returns The text of the node
 * @example ```js
 * const text = getText(node, { blockSeparator: '\n' })
 * ```
 */ function getText(node, options) {
    const range = {
        from: 0,
        to: node.content.size
    };
    return getTextBetween(node, range, options);
}
/**
 * Generate raw text from a JSONContent
 * @param doc The JSONContent to generate text from
 * @param extensions The extensions to use for the schema
 * @param options Options for the text generation f.e. blockSeparator or textSerializers
 * @returns The generated text
 */ function generateText(doc, extensions, options) {
    const { blockSeparator = '\n\n', textSerializers = {} } = options || {};
    const schema = getSchema(extensions);
    const contentNode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].fromJSON(schema, doc);
    return getText(contentNode, {
        blockSeparator,
        textSerializers: {
            ...getTextSerializersFromSchema(schema),
            ...textSerializers
        }
    });
}
function getNodeAttributes(state, typeOrName) {
    const type = getNodeType(typeOrName, state.schema);
    const { from, to } = state.selection;
    const nodes = [];
    state.doc.nodesBetween(from, to, (node)=>{
        nodes.push(node);
    });
    const node = nodes.reverse().find((nodeItem)=>nodeItem.type.name === type.name);
    if (!node) {
        return {};
    }
    return {
        ...node.attrs
    };
}
/**
 * Get node or mark attributes by type or name on the current editor state
 * @param state The current editor state
 * @param typeOrName The node or mark type or name
 * @returns The attributes of the node or mark or an empty object
 */ function getAttributes(state, typeOrName) {
    const schemaType = getSchemaTypeNameByName(typeof typeOrName === 'string' ? typeOrName : typeOrName.name, state.schema);
    if (schemaType === 'node') {
        return getNodeAttributes(state, typeOrName);
    }
    if (schemaType === 'mark') {
        return getMarkAttributes(state, typeOrName);
    }
    return {};
}
/**
 * Removes duplicated values within an array.
 * Supports numbers, strings and objects.
 */ function removeDuplicates(array, by = JSON.stringify) {
    const seen = {};
    return array.filter((item)=>{
        const key = by(item);
        return Object.prototype.hasOwnProperty.call(seen, key) ? false : seen[key] = true;
    });
}
/**
 * Removes duplicated ranges and ranges that are
 * fully captured by other ranges.
 */ function simplifyChangedRanges(changes) {
    const uniqueChanges = removeDuplicates(changes);
    return uniqueChanges.length === 1 ? uniqueChanges : uniqueChanges.filter((change, index)=>{
        const rest = uniqueChanges.filter((_, i)=>i !== index);
        return !rest.some((otherChange)=>{
            return change.oldRange.from >= otherChange.oldRange.from && change.oldRange.to <= otherChange.oldRange.to && change.newRange.from >= otherChange.newRange.from && change.newRange.to <= otherChange.newRange.to;
        });
    });
}
/**
 * Returns a list of changed ranges
 * based on the first and last state of all steps.
 */ function getChangedRanges(transform) {
    const { mapping, steps } = transform;
    const changes = [];
    mapping.maps.forEach((stepMap, index)=>{
        const ranges = [];
        // This accounts for step changes where no range was actually altered
        // e.g. when setting a mark, node attribute, etc.
        // @ts-ignore
        if (!stepMap.ranges.length) {
            const { from, to } = steps[index];
            if (from === undefined || to === undefined) {
                return;
            }
            ranges.push({
                from,
                to
            });
        } else {
            stepMap.forEach((from, to)=>{
                ranges.push({
                    from,
                    to
                });
            });
        }
        ranges.forEach(({ from, to })=>{
            const newStart = mapping.slice(index).map(from, -1);
            const newEnd = mapping.slice(index).map(to);
            const oldStart = mapping.invert().map(newStart, -1);
            const oldEnd = mapping.invert().map(newEnd);
            changes.push({
                oldRange: {
                    from: oldStart,
                    to: oldEnd
                },
                newRange: {
                    from: newStart,
                    to: newEnd
                }
            });
        });
    });
    return simplifyChangedRanges(changes);
}
function getDebugJSON(node, startOffset = 0) {
    const isTopNode = node.type === node.type.schema.topNodeType;
    const increment = isTopNode ? 0 : 1;
    const from = startOffset;
    const to = from + node.nodeSize;
    const marks = node.marks.map((mark)=>{
        const output = {
            type: mark.type.name
        };
        if (Object.keys(mark.attrs).length) {
            output.attrs = {
                ...mark.attrs
            };
        }
        return output;
    });
    const attrs = {
        ...node.attrs
    };
    const output = {
        type: node.type.name,
        from,
        to
    };
    if (Object.keys(attrs).length) {
        output.attrs = attrs;
    }
    if (marks.length) {
        output.marks = marks;
    }
    if (node.content.childCount) {
        output.content = [];
        node.forEach((child, offset)=>{
            var _a;
            (_a = output.content) === null || _a === void 0 ? void 0 : _a.push(getDebugJSON(child, startOffset + offset + increment));
        });
    }
    if (node.text) {
        output.text = node.text;
    }
    return output;
}
function getMarksBetween(from, to, doc) {
    const marks = [];
    // get all inclusive marks on empty selection
    if (from === to) {
        doc.resolve(from).marks().forEach((mark)=>{
            const $pos = doc.resolve(from);
            const range = getMarkRange($pos, mark.type);
            if (!range) {
                return;
            }
            marks.push({
                mark,
                ...range
            });
        });
    } else {
        doc.nodesBetween(from, to, (node, pos)=>{
            if (!node || (node === null || node === void 0 ? void 0 : node.nodeSize) === undefined) {
                return;
            }
            marks.push(...node.marks.map((mark)=>({
                    from: pos,
                    to: pos + node.nodeSize,
                    mark
                })));
        });
    }
    return marks;
}
/**
 * Finds the first node of a given type or name in the current selection.
 * @param state The editor state.
 * @param typeOrName The node type or name.
 * @param pos The position to start searching from.
 * @param maxDepth The maximum depth to search.
 * @returns The node and the depth as an array.
 */ const getNodeAtPosition = (state, typeOrName, pos, maxDepth = 20)=>{
    const $pos = state.doc.resolve(pos);
    let currentDepth = maxDepth;
    let node = null;
    while(currentDepth > 0 && node === null){
        const currentNode = $pos.node(currentDepth);
        if ((currentNode === null || currentNode === void 0 ? void 0 : currentNode.type.name) === typeOrName) {
            node = currentNode;
        } else {
            currentDepth -= 1;
        }
    }
    return [
        node,
        currentDepth
    ];
};
/**
 * Return attributes of an extension that should be splitted by keepOnSplit flag
 * @param extensionAttributes Array of extension attributes
 * @param typeName The type of the extension
 * @param attributes The attributes of the extension
 * @returns The splitted attributes
 */ function getSplittedAttributes(extensionAttributes, typeName, attributes) {
    return Object.fromEntries(Object.entries(attributes).filter(([name])=>{
        const extensionAttribute = extensionAttributes.find((item)=>{
            return item.type === typeName && item.name === name;
        });
        if (!extensionAttribute) {
            return false;
        }
        return extensionAttribute.attribute.keepOnSplit;
    }));
}
function isMarkActive(state, typeOrName, attributes = {}) {
    const { empty, ranges } = state.selection;
    const type = typeOrName ? getMarkType(typeOrName, state.schema) : null;
    if (empty) {
        return !!(state.storedMarks || state.selection.$from.marks()).filter((mark)=>{
            if (!type) {
                return true;
            }
            return type.name === mark.type.name;
        }).find((mark)=>objectIncludes(mark.attrs, attributes, {
                strict: false
            }));
    }
    let selectionRange = 0;
    const markRanges = [];
    ranges.forEach(({ $from, $to })=>{
        const from = $from.pos;
        const to = $to.pos;
        state.doc.nodesBetween(from, to, (node, pos)=>{
            if (!node.isText && !node.marks.length) {
                return;
            }
            const relativeFrom = Math.max(from, pos);
            const relativeTo = Math.min(to, pos + node.nodeSize);
            const range = relativeTo - relativeFrom;
            selectionRange += range;
            markRanges.push(...node.marks.map((mark)=>({
                    mark,
                    from: relativeFrom,
                    to: relativeTo
                })));
        });
    });
    if (selectionRange === 0) {
        return false;
    }
    // calculate range of matched mark
    const matchedRange = markRanges.filter((markRange)=>{
        if (!type) {
            return true;
        }
        return type.name === markRange.mark.type.name;
    }).filter((markRange)=>objectIncludes(markRange.mark.attrs, attributes, {
            strict: false
        })).reduce((sum, markRange)=>sum + markRange.to - markRange.from, 0);
    // calculate range of marks that excludes the searched mark
    // for example `code` doesn’t allow any other marks
    const excludedRange = markRanges.filter((markRange)=>{
        if (!type) {
            return true;
        }
        return markRange.mark.type !== type && markRange.mark.type.excludes(type);
    }).reduce((sum, markRange)=>sum + markRange.to - markRange.from, 0);
    // we only include the result of `excludedRange`
    // if there is a match at all
    const range = matchedRange > 0 ? matchedRange + excludedRange : matchedRange;
    return range >= selectionRange;
}
function isActive(state, name, attributes = {}) {
    if (!name) {
        return isNodeActive(state, null, attributes) || isMarkActive(state, null, attributes);
    }
    const schemaType = getSchemaTypeNameByName(name, state.schema);
    if (schemaType === 'node') {
        return isNodeActive(state, name, attributes);
    }
    if (schemaType === 'mark') {
        return isMarkActive(state, name, attributes);
    }
    return false;
}
const isAtEndOfNode = (state, nodeType)=>{
    const { $from, $to, $anchor } = state.selection;
    if (nodeType) {
        const parentNode = findParentNode((node)=>node.type.name === nodeType)(state.selection);
        if (!parentNode) {
            return false;
        }
        const $parentPos = state.doc.resolve(parentNode.pos + 1);
        if ($anchor.pos + 1 === $parentPos.end()) {
            return true;
        }
        return false;
    }
    if ($to.parentOffset < $to.parent.nodeSize - 2 || $from.pos !== $to.pos) {
        return false;
    }
    return true;
};
const isAtStartOfNode = (state)=>{
    const { $from, $to } = state.selection;
    if ($from.parentOffset > 0 || $from.pos !== $to.pos) {
        return false;
    }
    return true;
};
function isList(name, extensions) {
    const { nodeExtensions } = splitExtensions(extensions);
    const extension = nodeExtensions.find((item)=>item.name === name);
    if (!extension) {
        return false;
    }
    const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
    };
    const group = callOrReturn(getExtensionField(extension, 'group', context));
    if (typeof group !== 'string') {
        return false;
    }
    return group.split(' ').includes('list');
}
/**
 * Returns true if the given prosemirror node is empty.
 */ function isNodeEmpty(node, { checkChildren = true, ignoreWhitespace = false } = {}) {
    var _a;
    if (ignoreWhitespace) {
        if (node.type.name === 'hardBreak') {
            // Hard breaks are considered empty
            return true;
        }
        if (node.isText) {
            return /^\s*$/m.test((_a = node.text) !== null && _a !== void 0 ? _a : '');
        }
    }
    if (node.isText) {
        return !node.text;
    }
    if (node.isAtom || node.isLeaf) {
        return false;
    }
    if (node.content.childCount === 0) {
        return true;
    }
    if (checkChildren) {
        let isContentEmpty = true;
        node.content.forEach((childNode)=>{
            if (isContentEmpty === false) {
                // Exit early for perf
                return;
            }
            if (!isNodeEmpty(childNode, {
                ignoreWhitespace,
                checkChildren
            })) {
                isContentEmpty = false;
            }
        });
        return isContentEmpty;
    }
    return false;
}
function isNodeSelection(value) {
    return value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"];
}
function posToDOMRect(view, from, to) {
    const minPos = 0;
    const maxPos = view.state.doc.content.size;
    const resolvedFrom = minMax(from, minPos, maxPos);
    const resolvedEnd = minMax(to, minPos, maxPos);
    const start = view.coordsAtPos(resolvedFrom);
    const end = view.coordsAtPos(resolvedEnd, -1);
    const top = Math.min(start.top, end.top);
    const bottom = Math.max(start.bottom, end.bottom);
    const left = Math.min(start.left, end.left);
    const right = Math.max(start.right, end.right);
    const width = right - left;
    const height = bottom - top;
    const x = left;
    const y = top;
    const data = {
        top,
        bottom,
        left,
        right,
        width,
        height,
        x,
        y
    };
    return {
        ...data,
        toJSON: ()=>data
    };
}
/**
 * The actual implementation of the rewriteUnknownContent function
 */ function rewriteUnknownContentInner({ json, validMarks, validNodes, options, rewrittenContent = [] }) {
    if (json.marks && Array.isArray(json.marks)) {
        json.marks = json.marks.filter((mark)=>{
            const name = typeof mark === 'string' ? mark : mark.type;
            if (validMarks.has(name)) {
                return true;
            }
            rewrittenContent.push({
                original: JSON.parse(JSON.stringify(mark)),
                unsupported: name
            });
            // Just ignore any unknown marks
            return false;
        });
    }
    if (json.content && Array.isArray(json.content)) {
        json.content = json.content.map((value)=>rewriteUnknownContentInner({
                json: value,
                validMarks,
                validNodes,
                options,
                rewrittenContent
            }).json).filter((a)=>a !== null && a !== undefined);
    }
    if (json.type && !validNodes.has(json.type)) {
        rewrittenContent.push({
            original: JSON.parse(JSON.stringify(json)),
            unsupported: json.type
        });
        if (json.content && Array.isArray(json.content) && (options === null || options === void 0 ? void 0 : options.fallbackToParagraph) !== false) {
            // Just treat it like a paragraph and hope for the best
            json.type = 'paragraph';
            return {
                json,
                rewrittenContent
            };
        }
        // or just omit it entirely
        return {
            json: null,
            rewrittenContent
        };
    }
    return {
        json,
        rewrittenContent
    };
}
/**
 * Rewrite unknown nodes and marks within JSON content
 * Allowing for user within the editor
 */ function rewriteUnknownContent(/**
 * The JSON content to clean of unknown nodes and marks
 */ json, /**
 * The schema to use for validation
 */ schema, /**
 * Options for the cleaning process
 */ options) {
    return rewriteUnknownContentInner({
        json,
        validNodes: new Set(Object.keys(schema.nodes)),
        validMarks: new Set(Object.keys(schema.marks)),
        options
    });
}
function canSetMark(state, tr, newMarkType) {
    var _a;
    const { selection } = tr;
    let cursor = null;
    if (isTextSelection(selection)) {
        cursor = selection.$cursor;
    }
    if (cursor) {
        const currentMarks = (_a = state.storedMarks) !== null && _a !== void 0 ? _a : cursor.marks();
        // There can be no current marks that exclude the new mark
        return !!newMarkType.isInSet(currentMarks) || !currentMarks.some((mark)=>mark.type.excludes(newMarkType));
    }
    const { ranges } = selection;
    return ranges.some(({ $from, $to })=>{
        let someNodeSupportsMark = $from.depth === 0 ? state.doc.inlineContent && state.doc.type.allowsMarkType(newMarkType) : false;
        state.doc.nodesBetween($from.pos, $to.pos, (node, _pos, parent)=>{
            // If we already found a mark that we can enable, return false to bypass the remaining search
            if (someNodeSupportsMark) {
                return false;
            }
            if (node.isInline) {
                const parentAllowsMarkType = !parent || parent.type.allowsMarkType(newMarkType);
                const currentMarksAllowMarkType = !!newMarkType.isInSet(node.marks) || !node.marks.some((otherMark)=>otherMark.type.excludes(newMarkType));
                someNodeSupportsMark = parentAllowsMarkType && currentMarksAllowMarkType;
            }
            return !someNodeSupportsMark;
        });
        return someNodeSupportsMark;
    });
}
const setMark = (typeOrName, attributes = {})=>({ tr, state, dispatch })=>{
        const { selection } = tr;
        const { empty, ranges } = selection;
        const type = getMarkType(typeOrName, state.schema);
        if (dispatch) {
            if (empty) {
                const oldAttributes = getMarkAttributes(state, type);
                tr.addStoredMark(type.create({
                    ...oldAttributes,
                    ...attributes
                }));
            } else {
                ranges.forEach((range)=>{
                    const from = range.$from.pos;
                    const to = range.$to.pos;
                    state.doc.nodesBetween(from, to, (node, pos)=>{
                        const trimmedFrom = Math.max(pos, from);
                        const trimmedTo = Math.min(pos + node.nodeSize, to);
                        const someHasMark = node.marks.find((mark)=>mark.type === type);
                        // if there is already a mark of this type
                        // we know that we have to merge its attributes
                        // otherwise we add a fresh new mark
                        if (someHasMark) {
                            node.marks.forEach((mark)=>{
                                if (type === mark.type) {
                                    tr.addMark(trimmedFrom, trimmedTo, type.create({
                                        ...mark.attrs,
                                        ...attributes
                                    }));
                                }
                            });
                        } else {
                            tr.addMark(trimmedFrom, trimmedTo, type.create(attributes));
                        }
                    });
                });
            }
        }
        return canSetMark(state, tr, type);
    };
const setMeta = (key, value)=>({ tr })=>{
        tr.setMeta(key, value);
        return true;
    };
const setNode = (typeOrName, attributes = {})=>({ state, dispatch, chain })=>{
        const type = getNodeType(typeOrName, state.schema);
        let attributesToCopy;
        if (state.selection.$anchor.sameParent(state.selection.$head)) {
            // only copy attributes if the selection is pointing to a node of the same type
            attributesToCopy = state.selection.$anchor.parent.attrs;
        }
        // TODO: use a fallback like insertContent?
        if (!type.isTextblock) {
            console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.');
            return false;
        }
        return chain()// try to convert node to default node if needed
        .command(({ commands })=>{
            const canSetBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setBlockType"])(type, {
                ...attributesToCopy,
                ...attributes
            })(state);
            if (canSetBlock) {
                return true;
            }
            return commands.clearNodes();
        }).command(({ state: updatedState })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setBlockType"])(type, {
                ...attributesToCopy,
                ...attributes
            })(updatedState, dispatch);
        }).run();
    };
const setNodeSelection = (position)=>({ tr, dispatch })=>{
        if (dispatch) {
            const { doc } = tr;
            const from = minMax(position, 0, doc.content.size);
            const selection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"].create(doc, from);
            tr.setSelection(selection);
        }
        return true;
    };
const setTextSelection = (position)=>({ tr, dispatch })=>{
        if (dispatch) {
            const { doc } = tr;
            const { from, to } = typeof position === 'number' ? {
                from: position,
                to: position
            } : position;
            const minPos = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].atStart(doc).from;
            const maxPos = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].atEnd(doc).to;
            const resolvedFrom = minMax(from, minPos, maxPos);
            const resolvedEnd = minMax(to, minPos, maxPos);
            const selection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(doc, resolvedFrom, resolvedEnd);
            tr.setSelection(selection);
        }
        return true;
    };
const sinkListItem = (typeOrName)=>({ state, dispatch })=>{
        const type = getNodeType(typeOrName, state.schema);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$schema$2d$list$40$1$2e$5$2e$1$2f$node_modules$2f$prosemirror$2d$schema$2d$list$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sinkListItem"])(type)(state, dispatch);
    };
function ensureMarks(state, splittableMarks) {
    const marks = state.storedMarks || state.selection.$to.parentOffset && state.selection.$from.marks();
    if (marks) {
        const filteredMarks = marks.filter((mark)=>splittableMarks === null || splittableMarks === void 0 ? void 0 : splittableMarks.includes(mark.type.name));
        state.tr.ensureMarks(filteredMarks);
    }
}
const splitBlock = ({ keepMarks = true } = {})=>({ tr, state, dispatch, editor })=>{
        const { selection, doc } = tr;
        const { $from, $to } = selection;
        const extensionAttributes = editor.extensionManager.attributes;
        const newAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
        if (selection instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"] && selection.node.isBlock) {
            if (!$from.parentOffset || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSplit"])(doc, $from.pos)) {
                return false;
            }
            if (dispatch) {
                if (keepMarks) {
                    ensureMarks(state, editor.extensionManager.splittableMarks);
                }
                tr.split($from.pos).scrollIntoView();
            }
            return true;
        }
        if (!$from.parent.isBlock) {
            return false;
        }
        const atEnd = $to.parentOffset === $to.parent.content.size;
        const deflt = $from.depth === 0 ? undefined : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
        let types = atEnd && deflt ? [
            {
                type: deflt,
                attrs: newAttributes
            }
        ] : undefined;
        let can = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSplit"])(tr.doc, tr.mapping.map($from.pos), 1, types);
        if (!types && !can && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSplit"])(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [
            {
                type: deflt
            }
        ] : undefined)) {
            can = true;
            types = deflt ? [
                {
                    type: deflt,
                    attrs: newAttributes
                }
            ] : undefined;
        }
        if (dispatch) {
            if (can) {
                if (selection instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"]) {
                    tr.deleteSelection();
                }
                tr.split(tr.mapping.map($from.pos), 1, types);
                if (deflt && !atEnd && !$from.parentOffset && $from.parent.type !== deflt) {
                    const first = tr.mapping.map($from.before());
                    const $first = tr.doc.resolve(first);
                    if ($from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) {
                        tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
                    }
                }
            }
            if (keepMarks) {
                ensureMarks(state, editor.extensionManager.splittableMarks);
            }
            tr.scrollIntoView();
        }
        return can;
    };
const splitListItem = (typeOrName, overrideAttrs = {})=>({ tr, state, dispatch, editor })=>{
        var _a;
        const type = getNodeType(typeOrName, state.schema);
        const { $from, $to } = state.selection;
        // @ts-ignore
        // eslint-disable-next-line
        const node = state.selection.node;
        if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
            return false;
        }
        const grandParent = $from.node(-1);
        if (grandParent.type !== type) {
            return false;
        }
        const extensionAttributes = editor.extensionManager.attributes;
        if ($from.parent.content.size === 0 && $from.node(-1).childCount === $from.indexAfter(-1)) {
            // In an empty block. If this is a nested list, the wrapping
            // list item should be split. Otherwise, bail out and let next
            // command handle lifting.
            if ($from.depth === 2 || $from.node(-3).type !== type || $from.index(-2) !== $from.node(-2).childCount - 1) {
                return false;
            }
            if (dispatch) {
                let wrap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].empty;
                // eslint-disable-next-line
                const depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3;
                // Build a fragment containing empty versions of the structure
                // from the outer list item to the parent node of the cursor
                for(let d = $from.depth - depthBefore; d >= $from.depth - 3; d -= 1){
                    wrap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from($from.node(d).copy(wrap));
                }
                // eslint-disable-next-line
                const depthAfter = $from.indexAfter(-1) < $from.node(-2).childCount ? 1 : $from.indexAfter(-2) < $from.node(-3).childCount ? 2 : 3;
                // Add a second list item with an empty default start node
                const newNextTypeAttributes = {
                    ...getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs),
                    ...overrideAttrs
                };
                const nextType = ((_a = type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.createAndFill(newNextTypeAttributes)) || undefined;
                wrap = wrap.append(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(type.createAndFill(null, nextType) || undefined));
                const start = $from.before($from.depth - (depthBefore - 1));
                tr.replace(start, $from.after(-depthAfter), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$1$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slice"](wrap, 4 - depthBefore, 0));
                let sel = -1;
                tr.doc.nodesBetween(start, tr.doc.content.size, (n, pos)=>{
                    if (sel > -1) {
                        return false;
                    }
                    if (n.isTextblock && n.content.size === 0) {
                        sel = pos + 1;
                    }
                });
                if (sel > -1) {
                    tr.setSelection(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].near(tr.doc.resolve(sel)));
                }
                tr.scrollIntoView();
            }
            return true;
        }
        const nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
        const newTypeAttributes = {
            ...getSplittedAttributes(extensionAttributes, grandParent.type.name, grandParent.attrs),
            ...overrideAttrs
        };
        const newNextTypeAttributes = {
            ...getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs),
            ...overrideAttrs
        };
        tr.delete($from.pos, $to.pos);
        const types = nextType ? [
            {
                type,
                attrs: newTypeAttributes
            },
            {
                type: nextType,
                attrs: newNextTypeAttributes
            }
        ] : [
            {
                type,
                attrs: newTypeAttributes
            }
        ];
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSplit"])(tr.doc, $from.pos, 2)) {
            return false;
        }
        if (dispatch) {
            const { selection, storedMarks } = state;
            const { splittableMarks } = editor.extensionManager;
            const marks = storedMarks || selection.$to.parentOffset && selection.$from.marks();
            tr.split($from.pos, 2, types).scrollIntoView();
            if (!marks || !dispatch) {
                return true;
            }
            const filteredMarks = marks.filter((mark)=>splittableMarks.includes(mark.type.name));
            tr.ensureMarks(filteredMarks);
        }
        return true;
    };
const joinListBackwards = (tr, listType)=>{
    const list = findParentNode((node)=>node.type === listType)(tr.selection);
    if (!list) {
        return true;
    }
    const before = tr.doc.resolve(Math.max(0, list.pos - 1)).before(list.depth);
    if (before === undefined) {
        return true;
    }
    const nodeBefore = tr.doc.nodeAt(before);
    const canJoinBackwards = list.node.type === (nodeBefore === null || nodeBefore === void 0 ? void 0 : nodeBefore.type) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canJoin"])(tr.doc, list.pos);
    if (!canJoinBackwards) {
        return true;
    }
    tr.join(list.pos);
    return true;
};
const joinListForwards = (tr, listType)=>{
    const list = findParentNode((node)=>node.type === listType)(tr.selection);
    if (!list) {
        return true;
    }
    const after = tr.doc.resolve(list.start).after(list.depth);
    if (after === undefined) {
        return true;
    }
    const nodeAfter = tr.doc.nodeAt(after);
    const canJoinForwards = list.node.type === (nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.type) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canJoin"])(tr.doc, after);
    if (!canJoinForwards) {
        return true;
    }
    tr.join(after);
    return true;
};
const toggleList = (listTypeOrName, itemTypeOrName, keepMarks, attributes = {})=>({ editor, tr, state, dispatch, chain, commands, can })=>{
        const { extensions, splittableMarks } = editor.extensionManager;
        const listType = getNodeType(listTypeOrName, state.schema);
        const itemType = getNodeType(itemTypeOrName, state.schema);
        const { selection, storedMarks } = state;
        const { $from, $to } = selection;
        const range = $from.blockRange($to);
        const marks = storedMarks || selection.$to.parentOffset && selection.$from.marks();
        if (!range) {
            return false;
        }
        const parentList = findParentNode((node)=>isList(node.type.name, extensions))(selection);
        if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
            // remove list
            if (parentList.node.type === listType) {
                return commands.liftListItem(itemType);
            }
            // change list type
            if (isList(parentList.node.type.name, extensions) && listType.validContent(parentList.node.content) && dispatch) {
                return chain().command(()=>{
                    tr.setNodeMarkup(parentList.pos, listType);
                    return true;
                }).command(()=>joinListBackwards(tr, listType)).command(()=>joinListForwards(tr, listType)).run();
            }
        }
        if (!keepMarks || !marks || !dispatch) {
            return chain()// try to convert node to default node if needed
            .command(()=>{
                const canWrapInList = can().wrapInList(listType, attributes);
                if (canWrapInList) {
                    return true;
                }
                return commands.clearNodes();
            }).wrapInList(listType, attributes).command(()=>joinListBackwards(tr, listType)).command(()=>joinListForwards(tr, listType)).run();
        }
        return chain()// try to convert node to default node if needed
        .command(()=>{
            const canWrapInList = can().wrapInList(listType, attributes);
            const filteredMarks = marks.filter((mark)=>splittableMarks.includes(mark.type.name));
            tr.ensureMarks(filteredMarks);
            if (canWrapInList) {
                return true;
            }
            return commands.clearNodes();
        }).wrapInList(listType, attributes).command(()=>joinListBackwards(tr, listType)).command(()=>joinListForwards(tr, listType)).run();
    };
const toggleMark = (typeOrName, attributes = {}, options = {})=>({ state, commands })=>{
        const { extendEmptyMarkRange = false } = options;
        const type = getMarkType(typeOrName, state.schema);
        const isActive = isMarkActive(state, type, attributes);
        if (isActive) {
            return commands.unsetMark(type, {
                extendEmptyMarkRange
            });
        }
        return commands.setMark(type, attributes);
    };
const toggleNode = (typeOrName, toggleTypeOrName, attributes = {})=>({ state, commands })=>{
        const type = getNodeType(typeOrName, state.schema);
        const toggleType = getNodeType(toggleTypeOrName, state.schema);
        const isActive = isNodeActive(state, type, attributes);
        let attributesToCopy;
        if (state.selection.$anchor.sameParent(state.selection.$head)) {
            // only copy attributes if the selection is pointing to a node of the same type
            attributesToCopy = state.selection.$anchor.parent.attrs;
        }
        if (isActive) {
            return commands.setNode(toggleType, attributesToCopy);
        }
        // If the node is not active, we want to set the new node type with the given attributes
        // Copying over the attributes from the current node if the selection is pointing to a node of the same type
        return commands.setNode(type, {
            ...attributesToCopy,
            ...attributes
        });
    };
const toggleWrap = (typeOrName, attributes = {})=>({ state, commands })=>{
        const type = getNodeType(typeOrName, state.schema);
        const isActive = isNodeActive(state, type, attributes);
        if (isActive) {
            return commands.lift(type);
        }
        return commands.wrapIn(type, attributes);
    };
const undoInputRule = ()=>({ state, dispatch })=>{
        const plugins = state.plugins;
        for(let i = 0; i < plugins.length; i += 1){
            const plugin = plugins[i];
            let undoable;
            // @ts-ignore
            // eslint-disable-next-line
            if (plugin.spec.isInputRules && (undoable = plugin.getState(state))) {
                if (dispatch) {
                    const tr = state.tr;
                    const toUndo = undoable.transform;
                    for(let j = toUndo.steps.length - 1; j >= 0; j -= 1){
                        tr.step(toUndo.steps[j].invert(toUndo.docs[j]));
                    }
                    if (undoable.text) {
                        const marks = tr.doc.resolve(undoable.from).marks();
                        tr.replaceWith(undoable.from, undoable.to, state.schema.text(undoable.text, marks));
                    } else {
                        tr.delete(undoable.from, undoable.to);
                    }
                }
                return true;
            }
        }
        return false;
    };
const unsetAllMarks = ()=>({ tr, dispatch })=>{
        const { selection } = tr;
        const { empty, ranges } = selection;
        if (empty) {
            return true;
        }
        if (dispatch) {
            ranges.forEach((range)=>{
                tr.removeMark(range.$from.pos, range.$to.pos);
            });
        }
        return true;
    };
const unsetMark = (typeOrName, options = {})=>({ tr, state, dispatch })=>{
        var _a;
        const { extendEmptyMarkRange = false } = options;
        const { selection } = tr;
        const type = getMarkType(typeOrName, state.schema);
        const { $from, empty, ranges } = selection;
        if (!dispatch) {
            return true;
        }
        if (empty && extendEmptyMarkRange) {
            let { from, to } = selection;
            const attrs = (_a = $from.marks().find((mark)=>mark.type === type)) === null || _a === void 0 ? void 0 : _a.attrs;
            const range = getMarkRange($from, type, attrs);
            if (range) {
                from = range.from;
                to = range.to;
            }
            tr.removeMark(from, to, type);
        } else {
            ranges.forEach((range)=>{
                tr.removeMark(range.$from.pos, range.$to.pos, type);
            });
        }
        tr.removeStoredMark(type);
        return true;
    };
const updateAttributes = (typeOrName, attributes = {})=>({ tr, state, dispatch })=>{
        let nodeType = null;
        let markType = null;
        const schemaType = getSchemaTypeNameByName(typeof typeOrName === 'string' ? typeOrName : typeOrName.name, state.schema);
        if (!schemaType) {
            return false;
        }
        if (schemaType === 'node') {
            nodeType = getNodeType(typeOrName, state.schema);
        }
        if (schemaType === 'mark') {
            markType = getMarkType(typeOrName, state.schema);
        }
        if (dispatch) {
            tr.selection.ranges.forEach((range)=>{
                const from = range.$from.pos;
                const to = range.$to.pos;
                let lastPos;
                let lastNode;
                let trimmedFrom;
                let trimmedTo;
                if (tr.selection.empty) {
                    state.doc.nodesBetween(from, to, (node, pos)=>{
                        if (nodeType && nodeType === node.type) {
                            trimmedFrom = Math.max(pos, from);
                            trimmedTo = Math.min(pos + node.nodeSize, to);
                            lastPos = pos;
                            lastNode = node;
                        }
                    });
                } else {
                    state.doc.nodesBetween(from, to, (node, pos)=>{
                        if (pos < from && nodeType && nodeType === node.type) {
                            trimmedFrom = Math.max(pos, from);
                            trimmedTo = Math.min(pos + node.nodeSize, to);
                            lastPos = pos;
                            lastNode = node;
                        }
                        if (pos >= from && pos <= to) {
                            if (nodeType && nodeType === node.type) {
                                tr.setNodeMarkup(pos, undefined, {
                                    ...node.attrs,
                                    ...attributes
                                });
                            }
                            if (markType && node.marks.length) {
                                node.marks.forEach((mark)=>{
                                    if (markType === mark.type) {
                                        const trimmedFrom2 = Math.max(pos, from);
                                        const trimmedTo2 = Math.min(pos + node.nodeSize, to);
                                        tr.addMark(trimmedFrom2, trimmedTo2, markType.create({
                                            ...mark.attrs,
                                            ...attributes
                                        }));
                                    }
                                });
                            }
                        }
                    });
                }
                if (lastNode) {
                    if (lastPos !== undefined) {
                        tr.setNodeMarkup(lastPos, undefined, {
                            ...lastNode.attrs,
                            ...attributes
                        });
                    }
                    if (markType && lastNode.marks.length) {
                        lastNode.marks.forEach((mark)=>{
                            if (markType === mark.type) {
                                tr.addMark(trimmedFrom, trimmedTo, markType.create({
                                    ...mark.attrs,
                                    ...attributes
                                }));
                            }
                        });
                    }
                }
            });
        }
        return true;
    };
const wrapIn = (typeOrName, attributes = {})=>({ state, dispatch })=>{
        const type = getNodeType(typeOrName, state.schema);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$commands$40$1$2e$7$2e$1$2f$node_modules$2f$prosemirror$2d$commands$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapIn"])(type, attributes)(state, dispatch);
    };
const wrapInList = (typeOrName, attributes = {})=>({ state, dispatch })=>{
        const type = getNodeType(typeOrName, state.schema);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$schema$2d$list$40$1$2e$5$2e$1$2f$node_modules$2f$prosemirror$2d$schema$2d$list$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapInList"])(type, attributes)(state, dispatch);
    };
var commands = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    blur: blur,
    clearContent: clearContent,
    clearNodes: clearNodes,
    command: command,
    createParagraphNear: createParagraphNear,
    cut: cut,
    deleteCurrentNode: deleteCurrentNode,
    deleteNode: deleteNode,
    deleteRange: deleteRange,
    deleteSelection: deleteSelection,
    enter: enter,
    exitCode: exitCode,
    extendMarkRange: extendMarkRange,
    first: first,
    focus: focus,
    forEach: forEach,
    insertContent: insertContent,
    insertContentAt: insertContentAt,
    joinBackward: joinBackward,
    joinDown: joinDown,
    joinForward: joinForward,
    joinItemBackward: joinItemBackward,
    joinItemForward: joinItemForward,
    joinTextblockBackward: joinTextblockBackward,
    joinTextblockForward: joinTextblockForward,
    joinUp: joinUp,
    keyboardShortcut: keyboardShortcut,
    lift: lift,
    liftEmptyBlock: liftEmptyBlock,
    liftListItem: liftListItem,
    newlineInCode: newlineInCode,
    resetAttributes: resetAttributes,
    scrollIntoView: scrollIntoView,
    selectAll: selectAll,
    selectNodeBackward: selectNodeBackward,
    selectNodeForward: selectNodeForward,
    selectParentNode: selectParentNode,
    selectTextblockEnd: selectTextblockEnd,
    selectTextblockStart: selectTextblockStart,
    setContent: setContent,
    setMark: setMark,
    setMeta: setMeta,
    setNode: setNode,
    setNodeSelection: setNodeSelection,
    setTextSelection: setTextSelection,
    sinkListItem: sinkListItem,
    splitBlock: splitBlock,
    splitListItem: splitListItem,
    toggleList: toggleList,
    toggleMark: toggleMark,
    toggleNode: toggleNode,
    toggleWrap: toggleWrap,
    undoInputRule: undoInputRule,
    unsetAllMarks: unsetAllMarks,
    unsetMark: unsetMark,
    updateAttributes: updateAttributes,
    wrapIn: wrapIn,
    wrapInList: wrapInList
});
const Commands = Extension.create({
    name: 'commands',
    addCommands () {
        return {
            ...commands
        };
    }
});
const Drop = Extension.create({
    name: 'drop',
    addProseMirrorPlugins () {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('tiptapDrop'),
                props: {
                    handleDrop: (_, e, slice, moved)=>{
                        this.editor.emit('drop', {
                            editor: this.editor,
                            event: e,
                            slice,
                            moved
                        });
                    }
                }
            })
        ];
    }
});
const Editable = Extension.create({
    name: 'editable',
    addProseMirrorPlugins () {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('editable'),
                props: {
                    editable: ()=>this.editor.options.editable
                }
            })
        ];
    }
});
const focusEventsPluginKey = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('focusEvents');
const FocusEvents = Extension.create({
    name: 'focusEvents',
    addProseMirrorPlugins () {
        const { editor } = this;
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: focusEventsPluginKey,
                props: {
                    handleDOMEvents: {
                        focus: (view, event)=>{
                            editor.isFocused = true;
                            const transaction = editor.state.tr.setMeta('focus', {
                                event
                            }).setMeta('addToHistory', false);
                            view.dispatch(transaction);
                            return false;
                        },
                        blur: (view, event)=>{
                            editor.isFocused = false;
                            const transaction = editor.state.tr.setMeta('blur', {
                                event
                            }).setMeta('addToHistory', false);
                            view.dispatch(transaction);
                            return false;
                        }
                    }
                }
            })
        ];
    }
});
const Keymap = Extension.create({
    name: 'keymap',
    addKeyboardShortcuts () {
        const handleBackspace = ()=>this.editor.commands.first(({ commands })=>[
                    ()=>commands.undoInputRule(),
                    // maybe convert first text block node to default node
                    ()=>commands.command(({ tr })=>{
                            const { selection, doc } = tr;
                            const { empty, $anchor } = selection;
                            const { pos, parent } = $anchor;
                            const $parentPos = $anchor.parent.isTextblock && pos > 0 ? tr.doc.resolve(pos - 1) : $anchor;
                            const parentIsIsolating = $parentPos.parent.type.spec.isolating;
                            const parentPos = $anchor.pos - $anchor.parentOffset;
                            const isAtStart = parentIsIsolating && $parentPos.parent.childCount === 1 ? parentPos === $anchor.pos : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"].atStart(doc).from === pos;
                            if (!empty || !parent.type.isTextblock || parent.textContent.length || !isAtStart || isAtStart && $anchor.parent.type.name === 'paragraph' // prevent clearNodes when no nodes to clear, otherwise history stack is appended
                            ) {
                                return false;
                            }
                            return commands.clearNodes();
                        }),
                    ()=>commands.deleteSelection(),
                    ()=>commands.joinBackward(),
                    ()=>commands.selectNodeBackward()
                ]);
        const handleDelete = ()=>this.editor.commands.first(({ commands })=>[
                    ()=>commands.deleteSelection(),
                    ()=>commands.deleteCurrentNode(),
                    ()=>commands.joinForward(),
                    ()=>commands.selectNodeForward()
                ]);
        const handleEnter = ()=>this.editor.commands.first(({ commands })=>[
                    ()=>commands.newlineInCode(),
                    ()=>commands.createParagraphNear(),
                    ()=>commands.liftEmptyBlock(),
                    ()=>commands.splitBlock()
                ]);
        const baseKeymap = {
            Enter: handleEnter,
            'Mod-Enter': ()=>this.editor.commands.exitCode(),
            Backspace: handleBackspace,
            'Mod-Backspace': handleBackspace,
            'Shift-Backspace': handleBackspace,
            Delete: handleDelete,
            'Mod-Delete': handleDelete,
            'Mod-a': ()=>this.editor.commands.selectAll()
        };
        const pcKeymap = {
            ...baseKeymap
        };
        const macKeymap = {
            ...baseKeymap,
            'Ctrl-h': handleBackspace,
            'Alt-Backspace': handleBackspace,
            'Ctrl-d': handleDelete,
            'Ctrl-Alt-Backspace': handleDelete,
            'Alt-Delete': handleDelete,
            'Alt-d': handleDelete,
            'Ctrl-a': ()=>this.editor.commands.selectTextblockStart(),
            'Ctrl-e': ()=>this.editor.commands.selectTextblockEnd()
        };
        if (isiOS() || isMacOS()) {
            return macKeymap;
        }
        return pcKeymap;
    },
    addProseMirrorPlugins () {
        return [
            // With this plugin we check if the whole document was selected and deleted.
            // In this case we will additionally call `clearNodes()` to convert e.g. a heading
            // to a paragraph if necessary.
            // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
            // with many other commands.
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('clearDocument'),
                appendTransaction: (transactions, oldState, newState)=>{
                    if (transactions.some((tr)=>tr.getMeta('composition'))) {
                        return;
                    }
                    const docChanges = transactions.some((transaction)=>transaction.docChanged) && !oldState.doc.eq(newState.doc);
                    const ignoreTr = transactions.some((transaction)=>transaction.getMeta('preventClearDocument'));
                    if (!docChanges || ignoreTr) {
                        return;
                    }
                    const { empty, from, to } = oldState.selection;
                    const allFrom = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"].atStart(oldState.doc).from;
                    const allEnd = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"].atEnd(oldState.doc).to;
                    const allWasSelected = from === allFrom && to === allEnd;
                    if (empty || !allWasSelected) {
                        return;
                    }
                    const isEmpty = isNodeEmpty(newState.doc);
                    if (!isEmpty) {
                        return;
                    }
                    const tr = newState.tr;
                    const state = createChainableState({
                        state: newState,
                        transaction: tr
                    });
                    const { commands } = new CommandManager({
                        editor: this.editor,
                        state
                    });
                    commands.clearNodes();
                    if (!tr.steps.length) {
                        return;
                    }
                    return tr;
                }
            })
        ];
    }
});
const Paste = Extension.create({
    name: 'paste',
    addProseMirrorPlugins () {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('tiptapPaste'),
                props: {
                    handlePaste: (_view, e, slice)=>{
                        this.editor.emit('paste', {
                            editor: this.editor,
                            event: e,
                            slice
                        });
                    }
                }
            })
        ];
    }
});
const Tabindex = Extension.create({
    name: 'tabindex',
    addProseMirrorPlugins () {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                key: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('tabindex'),
                props: {
                    attributes: ()=>this.editor.isEditable ? {
                            tabindex: '0'
                        } : {}
                }
            })
        ];
    }
});
var index = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ClipboardTextSerializer: ClipboardTextSerializer,
    Commands: Commands,
    Drop: Drop,
    Editable: Editable,
    FocusEvents: FocusEvents,
    Keymap: Keymap,
    Paste: Paste,
    Tabindex: Tabindex,
    focusEventsPluginKey: focusEventsPluginKey
});
class NodePos {
    get name() {
        return this.node.type.name;
    }
    constructor(pos, editor, isBlock = false, node = null){
        this.currentNode = null;
        this.actualDepth = null;
        this.isBlock = isBlock;
        this.resolvedPos = pos;
        this.editor = editor;
        this.currentNode = node;
    }
    get node() {
        return this.currentNode || this.resolvedPos.node();
    }
    get element() {
        return this.editor.view.domAtPos(this.pos).node;
    }
    get depth() {
        var _a;
        return (_a = this.actualDepth) !== null && _a !== void 0 ? _a : this.resolvedPos.depth;
    }
    get pos() {
        return this.resolvedPos.pos;
    }
    get content() {
        return this.node.content;
    }
    set content(content) {
        let from = this.from;
        let to = this.to;
        if (this.isBlock) {
            if (this.content.size === 0) {
                console.error(`You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
                return;
            }
            from = this.from + 1;
            to = this.to - 1;
        }
        this.editor.commands.insertContentAt({
            from,
            to
        }, content);
    }
    get attributes() {
        return this.node.attrs;
    }
    get textContent() {
        return this.node.textContent;
    }
    get size() {
        return this.node.nodeSize;
    }
    get from() {
        if (this.isBlock) {
            return this.pos;
        }
        return this.resolvedPos.start(this.resolvedPos.depth);
    }
    get range() {
        return {
            from: this.from,
            to: this.to
        };
    }
    get to() {
        if (this.isBlock) {
            return this.pos + this.size;
        }
        return this.resolvedPos.end(this.resolvedPos.depth) + (this.node.isText ? 0 : 1);
    }
    get parent() {
        if (this.depth === 0) {
            return null;
        }
        const parentPos = this.resolvedPos.start(this.resolvedPos.depth - 1);
        const $pos = this.resolvedPos.doc.resolve(parentPos);
        return new NodePos($pos, this.editor);
    }
    get before() {
        let $pos = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
        if ($pos.depth !== this.depth) {
            $pos = this.resolvedPos.doc.resolve(this.from - 3);
        }
        return new NodePos($pos, this.editor);
    }
    get after() {
        let $pos = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
        if ($pos.depth !== this.depth) {
            $pos = this.resolvedPos.doc.resolve(this.to + 3);
        }
        return new NodePos($pos, this.editor);
    }
    get children() {
        const children = [];
        this.node.content.forEach((node, offset)=>{
            const isBlock = node.isBlock && !node.isTextblock;
            const isNonTextAtom = node.isAtom && !node.isText;
            const targetPos = this.pos + offset + (isNonTextAtom ? 0 : 1);
            // Check if targetPos is within valid document range
            if (targetPos < 0 || targetPos > this.resolvedPos.doc.nodeSize - 2) {
                return;
            }
            const $pos = this.resolvedPos.doc.resolve(targetPos);
            if (!isBlock && $pos.depth <= this.depth) {
                return;
            }
            const childNodePos = new NodePos($pos, this.editor, isBlock, isBlock ? node : null);
            if (isBlock) {
                childNodePos.actualDepth = this.depth + 1;
            }
            children.push(new NodePos($pos, this.editor, isBlock, isBlock ? node : null));
        });
        return children;
    }
    get firstChild() {
        return this.children[0] || null;
    }
    get lastChild() {
        const children = this.children;
        return children[children.length - 1] || null;
    }
    closest(selector, attributes = {}) {
        let node = null;
        let currentNode = this.parent;
        while(currentNode && !node){
            if (currentNode.node.type.name === selector) {
                if (Object.keys(attributes).length > 0) {
                    const nodeAttributes = currentNode.node.attrs;
                    const attrKeys = Object.keys(attributes);
                    for(let index = 0; index < attrKeys.length; index += 1){
                        const key = attrKeys[index];
                        if (nodeAttributes[key] !== attributes[key]) {
                            break;
                        }
                    }
                } else {
                    node = currentNode;
                }
            }
            currentNode = currentNode.parent;
        }
        return node;
    }
    querySelector(selector, attributes = {}) {
        return this.querySelectorAll(selector, attributes, true)[0] || null;
    }
    querySelectorAll(selector, attributes = {}, firstItemOnly = false) {
        let nodes = [];
        if (!this.children || this.children.length === 0) {
            return nodes;
        }
        const attrKeys = Object.keys(attributes);
        /**
         * Finds all children recursively that match the selector and attributes
         * If firstItemOnly is true, it will return the first item found
         */ this.children.forEach((childPos)=>{
            // If we already found a node and we only want the first item, we dont need to keep going
            if (firstItemOnly && nodes.length > 0) {
                return;
            }
            if (childPos.node.type.name === selector) {
                const doesAllAttributesMatch = attrKeys.every((key)=>attributes[key] === childPos.node.attrs[key]);
                if (doesAllAttributesMatch) {
                    nodes.push(childPos);
                }
            }
            // If we already found a node and we only want the first item, we can stop here and skip the recursion
            if (firstItemOnly && nodes.length > 0) {
                return;
            }
            nodes = nodes.concat(childPos.querySelectorAll(selector, attributes, firstItemOnly));
        });
        return nodes;
    }
    setAttribute(attributes) {
        const { tr } = this.editor.state;
        tr.setNodeMarkup(this.from, undefined, {
            ...this.node.attrs,
            ...attributes
        });
        this.editor.view.dispatch(tr);
    }
}
const style = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
function createStyleTag(style, nonce, suffix) {
    const tiptapStyleTag = document.querySelector(`style[data-tiptap-style${suffix ? `-${suffix}` : ''}]`);
    if (tiptapStyleTag !== null) {
        return tiptapStyleTag;
    }
    const styleNode = document.createElement('style');
    if (nonce) {
        styleNode.setAttribute('nonce', nonce);
    }
    styleNode.setAttribute(`data-tiptap-style${suffix ? `-${suffix}` : ''}`, '');
    styleNode.innerHTML = style;
    document.getElementsByTagName('head')[0].appendChild(styleNode);
    return styleNode;
}
class Editor extends EventEmitter {
    constructor(options = {}){
        super();
        this.isFocused = false;
        /**
         * The editor is considered initialized after the `create` event has been emitted.
         */ this.isInitialized = false;
        this.extensionStorage = {};
        this.options = {
            element: document.createElement('div'),
            content: '',
            injectCSS: true,
            injectNonce: undefined,
            extensions: [],
            autofocus: false,
            editable: true,
            editorProps: {},
            parseOptions: {},
            coreExtensionOptions: {},
            enableInputRules: true,
            enablePasteRules: true,
            enableCoreExtensions: true,
            enableContentCheck: false,
            emitContentError: false,
            onBeforeCreate: ()=>null,
            onCreate: ()=>null,
            onUpdate: ()=>null,
            onSelectionUpdate: ()=>null,
            onTransaction: ()=>null,
            onFocus: ()=>null,
            onBlur: ()=>null,
            onDestroy: ()=>null,
            onContentError: ({ error })=>{
                throw error;
            },
            onPaste: ()=>null,
            onDrop: ()=>null
        };
        this.isCapturingTransaction = false;
        this.capturedTransaction = null;
        this.setOptions(options);
        this.createExtensionManager();
        this.createCommandManager();
        this.createSchema();
        this.on('beforeCreate', this.options.onBeforeCreate);
        this.emit('beforeCreate', {
            editor: this
        });
        this.on('contentError', this.options.onContentError);
        this.createView();
        this.injectCSS();
        this.on('create', this.options.onCreate);
        this.on('update', this.options.onUpdate);
        this.on('selectionUpdate', this.options.onSelectionUpdate);
        this.on('transaction', this.options.onTransaction);
        this.on('focus', this.options.onFocus);
        this.on('blur', this.options.onBlur);
        this.on('destroy', this.options.onDestroy);
        this.on('drop', ({ event, slice, moved })=>this.options.onDrop(event, slice, moved));
        this.on('paste', ({ event, slice })=>this.options.onPaste(event, slice));
        window.setTimeout(()=>{
            if (this.isDestroyed) {
                return;
            }
            this.commands.focus(this.options.autofocus);
            this.emit('create', {
                editor: this
            });
            this.isInitialized = true;
        }, 0);
    }
    /**
     * Returns the editor storage.
     */ get storage() {
        return this.extensionStorage;
    }
    /**
     * An object of all registered commands.
     */ get commands() {
        return this.commandManager.commands;
    }
    /**
     * Create a command chain to call multiple commands at once.
     */ chain() {
        return this.commandManager.chain();
    }
    /**
     * Check if a command or a command chain can be executed. Without executing it.
     */ can() {
        return this.commandManager.can();
    }
    /**
     * Inject CSS styles.
     */ injectCSS() {
        if (this.options.injectCSS && document) {
            this.css = createStyleTag(style, this.options.injectNonce);
        }
    }
    /**
     * Update editor options.
     *
     * @param options A list of options
     */ setOptions(options = {}) {
        this.options = {
            ...this.options,
            ...options
        };
        if (!this.view || !this.state || this.isDestroyed) {
            return;
        }
        if (this.options.editorProps) {
            this.view.setProps(this.options.editorProps);
        }
        this.view.updateState(this.state);
    }
    /**
     * Update editable state of the editor.
     */ setEditable(editable, emitUpdate = true) {
        this.setOptions({
            editable
        });
        if (emitUpdate) {
            this.emit('update', {
                editor: this,
                transaction: this.state.tr
            });
        }
    }
    /**
     * Returns whether the editor is editable.
     */ get isEditable() {
        // since plugins are applied after creating the view
        // `editable` is always `true` for one tick.
        // that’s why we also have to check for `options.editable`
        return this.options.editable && this.view && this.view.editable;
    }
    /**
     * Returns the editor state.
     */ get state() {
        return this.view.state;
    }
    /**
     * Register a ProseMirror plugin.
     *
     * @param plugin A ProseMirror plugin
     * @param handlePlugins Control how to merge the plugin into the existing plugins.
     * @returns The new editor state
     */ registerPlugin(plugin, handlePlugins) {
        const plugins = isFunction(handlePlugins) ? handlePlugins(plugin, [
            ...this.state.plugins
        ]) : [
            ...this.state.plugins,
            plugin
        ];
        const state = this.state.reconfigure({
            plugins
        });
        this.view.updateState(state);
        return state;
    }
    /**
     * Unregister a ProseMirror plugin.
     *
     * @param nameOrPluginKeyToRemove The plugins name
     * @returns The new editor state or undefined if the editor is destroyed
     */ unregisterPlugin(nameOrPluginKeyToRemove) {
        if (this.isDestroyed) {
            return undefined;
        }
        const prevPlugins = this.state.plugins;
        let plugins = prevPlugins;
        [].concat(nameOrPluginKeyToRemove).forEach((nameOrPluginKey)=>{
            // @ts-ignore
            const name = typeof nameOrPluginKey === 'string' ? `${nameOrPluginKey}$` : nameOrPluginKey.key;
            // @ts-ignore
            plugins = plugins.filter((plugin)=>!plugin.key.startsWith(name));
        });
        if (prevPlugins.length === plugins.length) {
            // No plugin was removed, so we don’t need to update the state
            return undefined;
        }
        const state = this.state.reconfigure({
            plugins
        });
        this.view.updateState(state);
        return state;
    }
    /**
     * Creates an extension manager.
     */ createExtensionManager() {
        var _a, _b;
        const coreExtensions = this.options.enableCoreExtensions ? [
            Editable,
            ClipboardTextSerializer.configure({
                blockSeparator: (_b = (_a = this.options.coreExtensionOptions) === null || _a === void 0 ? void 0 : _a.clipboardTextSerializer) === null || _b === void 0 ? void 0 : _b.blockSeparator
            }),
            Commands,
            FocusEvents,
            Keymap,
            Tabindex,
            Drop,
            Paste
        ].filter((ext)=>{
            if (typeof this.options.enableCoreExtensions === 'object') {
                return this.options.enableCoreExtensions[ext.name] !== false;
            }
            return true;
        }) : [];
        const allExtensions = [
            ...coreExtensions,
            ...this.options.extensions
        ].filter((extension)=>{
            return [
                'extension',
                'node',
                'mark'
            ].includes(extension === null || extension === void 0 ? void 0 : extension.type);
        });
        this.extensionManager = new ExtensionManager(allExtensions, this);
    }
    /**
     * Creates an command manager.
     */ createCommandManager() {
        this.commandManager = new CommandManager({
            editor: this
        });
    }
    /**
     * Creates a ProseMirror schema.
     */ createSchema() {
        this.schema = this.extensionManager.schema;
    }
    /**
     * Creates a ProseMirror view.
     */ createView() {
        var _a;
        let doc;
        try {
            doc = createDocument(this.options.content, this.schema, this.options.parseOptions, {
                errorOnInvalidContent: this.options.enableContentCheck
            });
        } catch (e) {
            if (!(e instanceof Error) || ![
                '[tiptap error]: Invalid JSON content',
                '[tiptap error]: Invalid HTML content'
            ].includes(e.message)) {
                // Not the content error we were expecting
                throw e;
            }
            this.emit('contentError', {
                editor: this,
                error: e,
                disableCollaboration: ()=>{
                    if (this.storage.collaboration) {
                        this.storage.collaboration.isDisabled = true;
                    }
                    // To avoid syncing back invalid content, reinitialize the extensions without the collaboration extension
                    this.options.extensions = this.options.extensions.filter((extension)=>extension.name !== 'collaboration');
                    // Restart the initialization process by recreating the extension manager with the new set of extensions
                    this.createExtensionManager();
                }
            });
            // Content is invalid, but attempt to create it anyway, stripping out the invalid parts
            doc = createDocument(this.options.content, this.schema, this.options.parseOptions, {
                errorOnInvalidContent: false
            });
        }
        const selection = resolveFocusPosition(doc, this.options.autofocus);
        this.view = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$40$2e$0$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorView"](this.options.element, {
            ...this.options.editorProps,
            attributes: {
                // add `role="textbox"` to the editor element
                role: 'textbox',
                ...(_a = this.options.editorProps) === null || _a === void 0 ? void 0 : _a.attributes
            },
            dispatchTransaction: this.dispatchTransaction.bind(this),
            state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorState"].create({
                doc,
                selection: selection || undefined
            })
        });
        // `editor.view` is not yet available at this time.
        // Therefore we will add all plugins and node views directly afterwards.
        const newState = this.state.reconfigure({
            plugins: this.extensionManager.plugins
        });
        this.view.updateState(newState);
        this.createNodeViews();
        this.prependClass();
        // Let’s store the editor instance in the DOM element.
        // So we’ll have access to it for tests.
        // @ts-ignore
        const dom = this.view.dom;
        dom.editor = this;
    }
    /**
     * Creates all node views.
     */ createNodeViews() {
        if (this.view.isDestroyed) {
            return;
        }
        this.view.setProps({
            nodeViews: this.extensionManager.nodeViews
        });
    }
    /**
     * Prepend class name to element.
     */ prependClass() {
        this.view.dom.className = `tiptap ${this.view.dom.className}`;
    }
    captureTransaction(fn) {
        this.isCapturingTransaction = true;
        fn();
        this.isCapturingTransaction = false;
        const tr = this.capturedTransaction;
        this.capturedTransaction = null;
        return tr;
    }
    /**
     * The callback over which to send transactions (state updates) produced by the view.
     *
     * @param transaction An editor state transaction
     */ dispatchTransaction(transaction) {
        // if the editor / the view of the editor was destroyed
        // the transaction should not be dispatched as there is no view anymore.
        if (this.view.isDestroyed) {
            return;
        }
        if (this.isCapturingTransaction) {
            if (!this.capturedTransaction) {
                this.capturedTransaction = transaction;
                return;
            }
            transaction.steps.forEach((step)=>{
                var _a;
                return (_a = this.capturedTransaction) === null || _a === void 0 ? void 0 : _a.step(step);
            });
            return;
        }
        const state = this.state.apply(transaction);
        const selectionHasChanged = !this.state.selection.eq(state.selection);
        this.emit('beforeTransaction', {
            editor: this,
            transaction,
            nextState: state
        });
        this.view.updateState(state);
        this.emit('transaction', {
            editor: this,
            transaction
        });
        if (selectionHasChanged) {
            this.emit('selectionUpdate', {
                editor: this,
                transaction
            });
        }
        const focus = transaction.getMeta('focus');
        const blur = transaction.getMeta('blur');
        if (focus) {
            this.emit('focus', {
                editor: this,
                event: focus.event,
                transaction
            });
        }
        if (blur) {
            this.emit('blur', {
                editor: this,
                event: blur.event,
                transaction
            });
        }
        if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
            return;
        }
        this.emit('update', {
            editor: this,
            transaction
        });
    }
    /**
     * Get attributes of the currently selected node or mark.
     */ getAttributes(nameOrType) {
        return getAttributes(this.state, nameOrType);
    }
    isActive(nameOrAttributes, attributesOrUndefined) {
        const name = typeof nameOrAttributes === 'string' ? nameOrAttributes : null;
        const attributes = typeof nameOrAttributes === 'string' ? attributesOrUndefined : nameOrAttributes;
        return isActive(this.state, name, attributes);
    }
    /**
     * Get the document as JSON.
     */ getJSON() {
        return this.state.doc.toJSON();
    }
    /**
     * Get the document as HTML.
     */ getHTML() {
        return getHTMLFromFragment(this.state.doc.content, this.schema);
    }
    /**
     * Get the document as text.
     */ getText(options) {
        const { blockSeparator = '\n\n', textSerializers = {} } = options || {};
        return getText(this.state.doc, {
            blockSeparator,
            textSerializers: {
                ...getTextSerializersFromSchema(this.schema),
                ...textSerializers
            }
        });
    }
    /**
     * Check if there is no content.
     */ get isEmpty() {
        return isNodeEmpty(this.state.doc);
    }
    /**
     * Get the number of characters for the current document.
     *
     * @deprecated
     */ getCharacterCount() {
        console.warn('[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.');
        return this.state.doc.content.size - 2;
    }
    /**
     * Destroy the editor.
     */ destroy() {
        this.emit('destroy');
        if (this.view) {
            // Cleanup our reference to prevent circular references which caused memory leaks
            // @ts-ignore
            const dom = this.view.dom;
            if (dom && dom.editor) {
                delete dom.editor;
            }
            this.view.destroy();
        }
        this.removeAllListeners();
    }
    /**
     * Check if the editor is already destroyed.
     */ get isDestroyed() {
        var _a;
        // @ts-ignore
        return !((_a = this.view) === null || _a === void 0 ? void 0 : _a.docView);
    }
    $node(selector, attributes) {
        var _a;
        return ((_a = this.$doc) === null || _a === void 0 ? void 0 : _a.querySelector(selector, attributes)) || null;
    }
    $nodes(selector, attributes) {
        var _a;
        return ((_a = this.$doc) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector, attributes)) || null;
    }
    $pos(pos) {
        const $pos = this.state.doc.resolve(pos);
        return new NodePos($pos, this);
    }
    get $doc() {
        return this.$pos(0);
    }
}
/**
 * Build an input rule that adds a mark when the
 * matched text is typed into it.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#input-rules
 */ function markInputRule(config) {
    return new InputRule({
        find: config.find,
        handler: ({ state, range, match })=>{
            const attributes = callOrReturn(config.getAttributes, undefined, match);
            if (attributes === false || attributes === null) {
                return null;
            }
            const { tr } = state;
            const captureGroup = match[match.length - 1];
            const fullMatch = match[0];
            if (captureGroup) {
                const startSpaces = fullMatch.search(/\S/);
                const textStart = range.from + fullMatch.indexOf(captureGroup);
                const textEnd = textStart + captureGroup.length;
                const excludedMarks = getMarksBetween(range.from, range.to, state.doc).filter((item)=>{
                    // @ts-ignore
                    const excluded = item.mark.type.excluded;
                    return excluded.find((type)=>type === config.type && type !== item.mark.type);
                }).filter((item)=>item.to > textStart);
                if (excludedMarks.length) {
                    return null;
                }
                if (textEnd < range.to) {
                    tr.delete(textEnd, range.to);
                }
                if (textStart > range.from) {
                    tr.delete(range.from + startSpaces, textStart);
                }
                const markEnd = range.from + startSpaces + captureGroup.length;
                tr.addMark(range.from + startSpaces, markEnd, config.type.create(attributes || {}));
                tr.removeStoredMark(config.type);
            }
        }
    });
}
/**
 * Build an input rule that adds a node when the
 * matched text is typed into it.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#input-rules
 */ function nodeInputRule(config) {
    return new InputRule({
        find: config.find,
        handler: ({ state, range, match })=>{
            const attributes = callOrReturn(config.getAttributes, undefined, match) || {};
            const { tr } = state;
            const start = range.from;
            let end = range.to;
            const newNode = config.type.create(attributes);
            if (match[1]) {
                const offset = match[0].lastIndexOf(match[1]);
                let matchStart = start + offset;
                if (matchStart > end) {
                    matchStart = end;
                } else {
                    end = matchStart + match[1].length;
                }
                // insert last typed character
                const lastChar = match[0][match[0].length - 1];
                tr.insertText(lastChar, start + match[0].length - 1);
                // insert node from input rule
                tr.replaceWith(matchStart, end, newNode);
            } else if (match[0]) {
                const insertionStart = config.type.isInline ? start : start - 1;
                tr.insert(insertionStart, config.type.create(attributes)).delete(tr.mapping.map(start), tr.mapping.map(end));
            }
            tr.scrollIntoView();
        }
    });
}
/**
 * Build an input rule that changes the type of a textblock when the
 * matched text is typed into it. When using a regular expresion you’ll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#input-rules
 */ function textblockTypeInputRule(config) {
    return new InputRule({
        find: config.find,
        handler: ({ state, range, match })=>{
            const $start = state.doc.resolve(range.from);
            const attributes = callOrReturn(config.getAttributes, undefined, match) || {};
            if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), config.type)) {
                return null;
            }
            state.tr.delete(range.from, range.to).setBlockType(range.from, range.from, config.type, attributes);
        }
    });
}
/**
 * Build an input rule that replaces text when the
 * matched text is typed into it.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#input-rules
 */ function textInputRule(config) {
    return new InputRule({
        find: config.find,
        handler: ({ state, range, match })=>{
            let insert = config.replace;
            let start = range.from;
            const end = range.to;
            if (match[1]) {
                const offset = match[0].lastIndexOf(match[1]);
                insert += match[0].slice(offset + match[1].length);
                start += offset;
                const cutOff = start - end;
                if (cutOff > 0) {
                    insert = match[0].slice(offset - cutOff, offset) + insert;
                    start = end;
                }
            }
            state.tr.insertText(insert, start, end);
        }
    });
}
/**
 * Build an input rule for automatically wrapping a textblock when a
 * given string is typed. When using a regular expresion you’ll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 *
 * `type` is the type of node to wrap in.
 *
 * By default, if there’s a node with the same type above the newly
 * wrapped node, the rule will try to join those
 * two nodes. You can pass a join predicate, which takes a regular
 * expression match and the node before the wrapped node, and can
 * return a boolean to indicate whether a join should happen.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#input-rules
 */ function wrappingInputRule(config) {
    return new InputRule({
        find: config.find,
        handler: ({ state, range, match, chain })=>{
            const attributes = callOrReturn(config.getAttributes, undefined, match) || {};
            const tr = state.tr.delete(range.from, range.to);
            const $start = tr.doc.resolve(range.from);
            const blockRange = $start.blockRange();
            const wrapping = blockRange && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findWrapping"])(blockRange, config.type, attributes);
            if (!wrapping) {
                return null;
            }
            tr.wrap(blockRange, wrapping);
            if (config.keepMarks && config.editor) {
                const { selection, storedMarks } = state;
                const { splittableMarks } = config.editor.extensionManager;
                const marks = storedMarks || selection.$to.parentOffset && selection.$from.marks();
                if (marks) {
                    const filteredMarks = marks.filter((mark)=>splittableMarks.includes(mark.type.name));
                    tr.ensureMarks(filteredMarks);
                }
            }
            if (config.keepAttributes) {
                /** If the nodeType is `bulletList` or `orderedList` set the `nodeType` as `listItem` */ const nodeType = config.type.name === 'bulletList' || config.type.name === 'orderedList' ? 'listItem' : 'taskList';
                chain().updateAttributes(nodeType, attributes).run();
            }
            const before = tr.doc.resolve(range.from - 1).nodeBefore;
            if (before && before.type === config.type && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$transform$40$1$2e$10$2e$4$2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canJoin"])(tr.doc, range.from - 1) && (!config.joinPredicate || config.joinPredicate(match, before))) {
                tr.join(range.from - 1);
            }
        }
    });
}
/**
 * The Node class is used to create custom node extensions.
 * @see https://tiptap.dev/api/extensions#create-a-new-extension
 */ class Node {
    constructor(config = {}){
        this.type = 'node';
        this.name = 'node';
        this.parent = null;
        this.child = null;
        this.config = {
            name: this.name,
            defaultOptions: {}
        };
        this.config = {
            ...this.config,
            ...config
        };
        this.name = this.config.name;
        if (config.defaultOptions && Object.keys(config.defaultOptions).length > 0) {
            console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`);
        }
        // TODO: remove `addOptions` fallback
        this.options = this.config.defaultOptions;
        if (this.config.addOptions) {
            this.options = callOrReturn(getExtensionField(this, 'addOptions', {
                name: this.name
            }));
        }
        this.storage = callOrReturn(getExtensionField(this, 'addStorage', {
            name: this.name,
            options: this.options
        })) || {};
    }
    static create(config = {}) {
        return new Node(config);
    }
    configure(options = {}) {
        // return a new instance so we can use the same extension
        // with different calls of `configure`
        const extension = this.extend({
            ...this.config,
            addOptions: ()=>{
                return mergeDeep(this.options, options);
            }
        });
        // Always preserve the current name
        extension.name = this.name;
        // Set the parent to be our parent
        extension.parent = this.parent;
        return extension;
    }
    extend(extendedConfig = {}) {
        const extension = new Node(extendedConfig);
        extension.parent = this;
        this.child = extension;
        extension.name = extendedConfig.name ? extendedConfig.name : extension.parent.name;
        if (extendedConfig.defaultOptions && Object.keys(extendedConfig.defaultOptions).length > 0) {
            console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`);
        }
        extension.options = callOrReturn(getExtensionField(extension, 'addOptions', {
            name: extension.name
        }));
        extension.storage = callOrReturn(getExtensionField(extension, 'addStorage', {
            name: extension.name,
            options: extension.options
        }));
        return extension;
    }
}
/**
 * Node views are used to customize the rendered DOM structure of a node.
 * @see https://tiptap.dev/guide/node-views
 */ class NodeView {
    constructor(component, props, options){
        this.isDragging = false;
        this.component = component;
        this.editor = props.editor;
        this.options = {
            stopEvent: null,
            ignoreMutation: null,
            ...options
        };
        this.extension = props.extension;
        this.node = props.node;
        this.decorations = props.decorations;
        this.innerDecorations = props.innerDecorations;
        this.view = props.view;
        this.HTMLAttributes = props.HTMLAttributes;
        this.getPos = props.getPos;
        this.mount();
    }
    mount() {
        // eslint-disable-next-line
        return;
    }
    get dom() {
        return this.editor.view.dom;
    }
    get contentDOM() {
        return null;
    }
    onDragStart(event) {
        var _a, _b, _c, _d, _e, _f, _g;
        const { view } = this.editor;
        const target = event.target;
        // get the drag handle element
        // `closest` is not available for text nodes so we may have to use its parent
        const dragHandle = target.nodeType === 3 ? (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.closest('[data-drag-handle]') : target.closest('[data-drag-handle]');
        if (!this.dom || ((_b = this.contentDOM) === null || _b === void 0 ? void 0 : _b.contains(target)) || !dragHandle) {
            return;
        }
        let x = 0;
        let y = 0;
        // calculate offset for drag element if we use a different drag handle element
        if (this.dom !== dragHandle) {
            const domBox = this.dom.getBoundingClientRect();
            const handleBox = dragHandle.getBoundingClientRect();
            // In React, we have to go through nativeEvent to reach offsetX/offsetY.
            const offsetX = (_c = event.offsetX) !== null && _c !== void 0 ? _c : (_d = event.nativeEvent) === null || _d === void 0 ? void 0 : _d.offsetX;
            const offsetY = (_e = event.offsetY) !== null && _e !== void 0 ? _e : (_f = event.nativeEvent) === null || _f === void 0 ? void 0 : _f.offsetY;
            x = handleBox.x - domBox.x + offsetX;
            y = handleBox.y - domBox.y + offsetY;
        }
        const clonedNode = this.dom.cloneNode(true);
        (_g = event.dataTransfer) === null || _g === void 0 ? void 0 : _g.setDragImage(clonedNode, x, y);
        const pos = this.getPos();
        if (typeof pos !== 'number') {
            return;
        }
        // we need to tell ProseMirror that we want to move the whole node
        // so we create a NodeSelection
        const selection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"].create(view.state.doc, pos);
        const transaction = view.state.tr.setSelection(selection);
        view.dispatch(transaction);
    }
    stopEvent(event) {
        var _a;
        if (!this.dom) {
            return false;
        }
        if (typeof this.options.stopEvent === 'function') {
            return this.options.stopEvent({
                event
            });
        }
        const target = event.target;
        const isInElement = this.dom.contains(target) && !((_a = this.contentDOM) === null || _a === void 0 ? void 0 : _a.contains(target));
        // any event from child nodes should be handled by ProseMirror
        if (!isInElement) {
            return false;
        }
        const isDragEvent = event.type.startsWith('drag');
        const isDropEvent = event.type === 'drop';
        const isInput = [
            'INPUT',
            'BUTTON',
            'SELECT',
            'TEXTAREA'
        ].includes(target.tagName) || target.isContentEditable;
        // any input event within node views should be ignored by ProseMirror
        if (isInput && !isDropEvent && !isDragEvent) {
            return true;
        }
        const { isEditable } = this.editor;
        const { isDragging } = this;
        const isDraggable = !!this.node.type.spec.draggable;
        const isSelectable = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"].isSelectable(this.node);
        const isCopyEvent = event.type === 'copy';
        const isPasteEvent = event.type === 'paste';
        const isCutEvent = event.type === 'cut';
        const isClickEvent = event.type === 'mousedown';
        // ProseMirror tries to drag selectable nodes
        // even if `draggable` is set to `false`
        // this fix prevents that
        if (!isDraggable && isSelectable && isDragEvent && event.target === this.dom) {
            event.preventDefault();
        }
        if (isDraggable && isDragEvent && !isDragging && event.target === this.dom) {
            event.preventDefault();
            return false;
        }
        // we have to store that dragging started
        if (isDraggable && isEditable && !isDragging && isClickEvent) {
            const dragHandle = target.closest('[data-drag-handle]');
            const isValidDragHandle = dragHandle && (this.dom === dragHandle || this.dom.contains(dragHandle));
            if (isValidDragHandle) {
                this.isDragging = true;
                document.addEventListener('dragend', ()=>{
                    this.isDragging = false;
                }, {
                    once: true
                });
                document.addEventListener('drop', ()=>{
                    this.isDragging = false;
                }, {
                    once: true
                });
                document.addEventListener('mouseup', ()=>{
                    this.isDragging = false;
                }, {
                    once: true
                });
            }
        }
        // these events are handled by prosemirror
        if (isDragging || isDropEvent || isCopyEvent || isPasteEvent || isCutEvent || isClickEvent && isSelectable) {
            return false;
        }
        return true;
    }
    /**
     * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
     * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
     * @return `true` if it can safely be ignored.
     */ ignoreMutation(mutation) {
        if (!this.dom || !this.contentDOM) {
            return true;
        }
        if (typeof this.options.ignoreMutation === 'function') {
            return this.options.ignoreMutation({
                mutation
            });
        }
        // a leaf/atom node is like a black box for ProseMirror
        // and should be fully handled by the node view
        if (this.node.isLeaf || this.node.isAtom) {
            return true;
        }
        // ProseMirror should handle any selections
        if (mutation.type === 'selection') {
            return false;
        }
        // try to prevent a bug on iOS and Android that will break node views on enter
        // this is because ProseMirror can’t preventDispatch on enter
        // this will lead to a re-render of the node view on enter
        // see: https://github.com/ueberdosis/tiptap/issues/1214
        // see: https://github.com/ueberdosis/tiptap/issues/2534
        if (this.dom.contains(mutation.target) && mutation.type === 'childList' && (isiOS() || isAndroid()) && this.editor.isFocused) {
            const changedNodes = [
                ...Array.from(mutation.addedNodes),
                ...Array.from(mutation.removedNodes)
            ];
            // we’ll check if every changed node is contentEditable
            // to make sure it’s probably mutated by ProseMirror
            if (changedNodes.every((node)=>node.isContentEditable)) {
                return false;
            }
        }
        // we will allow mutation contentDOM with attributes
        // so we can for example adding classes within our node view
        if (this.contentDOM === mutation.target && mutation.type === 'attributes') {
            return true;
        }
        // ProseMirror should handle any changes within contentDOM
        if (this.contentDOM.contains(mutation.target)) {
            return false;
        }
        return true;
    }
    /**
     * Update the attributes of the prosemirror node.
     */ updateAttributes(attributes) {
        this.editor.commands.command(({ tr })=>{
            const pos = this.getPos();
            if (typeof pos !== 'number') {
                return false;
            }
            tr.setNodeMarkup(pos, undefined, {
                ...this.node.attrs,
                ...attributes
            });
            return true;
        });
    }
    /**
     * Delete the node.
     */ deleteNode() {
        const from = this.getPos();
        if (typeof from !== 'number') {
            return;
        }
        const to = from + this.node.nodeSize;
        this.editor.commands.deleteRange({
            from,
            to
        });
    }
}
/**
 * Build an paste rule that adds a mark when the
 * matched text is pasted into it.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#paste-rules
 */ function markPasteRule(config) {
    return new PasteRule({
        find: config.find,
        handler: ({ state, range, match, pasteEvent })=>{
            const attributes = callOrReturn(config.getAttributes, undefined, match, pasteEvent);
            if (attributes === false || attributes === null) {
                return null;
            }
            const { tr } = state;
            const captureGroup = match[match.length - 1];
            const fullMatch = match[0];
            let markEnd = range.to;
            if (captureGroup) {
                const startSpaces = fullMatch.search(/\S/);
                const textStart = range.from + fullMatch.indexOf(captureGroup);
                const textEnd = textStart + captureGroup.length;
                const excludedMarks = getMarksBetween(range.from, range.to, state.doc).filter((item)=>{
                    // @ts-ignore
                    const excluded = item.mark.type.excluded;
                    return excluded.find((type)=>type === config.type && type !== item.mark.type);
                }).filter((item)=>item.to > textStart);
                if (excludedMarks.length) {
                    return null;
                }
                if (textEnd < range.to) {
                    tr.delete(textEnd, range.to);
                }
                if (textStart > range.from) {
                    tr.delete(range.from + startSpaces, textStart);
                }
                markEnd = range.from + startSpaces + captureGroup.length;
                tr.addMark(range.from + startSpaces, markEnd, config.type.create(attributes || {}));
                tr.removeStoredMark(config.type);
            }
        }
    });
}
function canInsertNode(state, nodeType) {
    const { selection } = state;
    const { $from } = selection;
    // Special handling for NodeSelection
    if (selection instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$3$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"]) {
        const index = $from.index();
        const parent = $from.parent;
        // Can we replace the selected node with the horizontal rule?
        return parent.canReplaceWith(index, index + 1, nodeType);
    }
    // Default: check if we can insert at the current position
    let depth = $from.depth;
    while(depth >= 0){
        const index = $from.index(depth);
        const parent = $from.node(depth);
        const match = parent.contentMatchAt(index);
        if (match.matchType(nodeType)) {
            return true;
        }
        depth -= 1;
    }
    return false;
}
// source: https://stackoverflow.com/a/6969486
function escapeForRegEx(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function isString(value) {
    return typeof value === 'string';
}
/**
 * Build an paste rule that adds a node when the
 * matched text is pasted into it.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#paste-rules
 */ function nodePasteRule(config) {
    return new PasteRule({
        find: config.find,
        handler ({ match, chain, range, pasteEvent }) {
            const attributes = callOrReturn(config.getAttributes, undefined, match, pasteEvent);
            const content = callOrReturn(config.getContent, undefined, attributes);
            if (attributes === false || attributes === null) {
                return null;
            }
            const node = {
                type: config.type.name,
                attrs: attributes
            };
            if (content) {
                node.content = content;
            }
            if (match.input) {
                chain().deleteRange(range).insertContentAt(range.from, node);
            }
        }
    });
}
/**
 * Build an paste rule that replaces text when the
 * matched text is pasted into it.
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#paste-rules
 */ function textPasteRule(config) {
    return new PasteRule({
        find: config.find,
        handler: ({ state, range, match })=>{
            let insert = config.replace;
            let start = range.from;
            const end = range.to;
            if (match[1]) {
                const offset = match[0].lastIndexOf(match[1]);
                insert += match[0].slice(offset + match[1].length);
                start += offset;
                const cutOff = start - end;
                if (cutOff > 0) {
                    insert = match[0].slice(offset - cutOff, offset) + insert;
                    start = end;
                }
            }
            state.tr.insertText(insert, start, end);
        }
    });
}
class Tracker {
    constructor(transaction){
        this.transaction = transaction;
        this.currentStep = this.transaction.steps.length;
    }
    map(position) {
        let deleted = false;
        const mappedPosition = this.transaction.steps.slice(this.currentStep).reduce((newPosition, step)=>{
            const mapResult = step.getMap().mapResult(newPosition);
            if (mapResult.deleted) {
                deleted = true;
            }
            return mapResult.pos;
        }, position);
        return {
            position: mappedPosition,
            deleted
        };
    }
}
;
 //# sourceMappingURL=index.js.map
}}),
}]);

//# sourceMappingURL=f6d68_%40tiptap_core_dist_index_7b9cac5b.js.map