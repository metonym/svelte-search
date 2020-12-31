var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Search.svelte generated by Svelte v3.31.0 */
    const file = "src/Search.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-5m0wg6-style";
    	style.textContent = ".hide-label.svelte-5m0wg6{position:absolute;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px, 1px, 1px, 1px);white-space:nowrap}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VhcmNoLnN2ZWx0ZSIsInNvdXJjZXMiOlsiU2VhcmNoLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICAvKipcbiAgICogQGV2ZW50IHtzdHJpbmd9IHR5cGVcbiAgICogQGV2ZW50IHthbnl9IGNsZWFyXG4gICAqL1xuXG4gIGV4cG9ydCBsZXQgdmFsdWUgPSBcIlwiO1xuICBleHBvcnQgbGV0IGF1dG9mb2N1cyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRlYm91bmNlID0gMDtcbiAgZXhwb3J0IGxldCBsYWJlbCA9IFwiTGFiZWxcIjtcbiAgZXhwb3J0IGxldCBoaWRlTGFiZWwgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpZCA9IFwic2VhcmNoXCIgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KTtcbiAgZXhwb3J0IGxldCByZWYgPSBudWxsO1xuXG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgb25Nb3VudCwgYWZ0ZXJVcGRhdGUgfSBmcm9tIFwic3ZlbHRlXCI7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcblxuICBsZXQgcHJldlZhbHVlID0gdmFsdWU7XG4gIGxldCB0aW1lb3V0ID0gdW5kZWZpbmVkO1xuICBsZXQgY2FsbGluZyA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZChjYikge1xuICAgIGlmIChjYWxsaW5nKSByZXR1cm47XG4gICAgY2FsbGluZyA9IHRydWU7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY2IoKTtcbiAgICAgIGNhbGxpbmcgPSBmYWxzZTtcbiAgICB9LCBkZWJvdW5jZSk7XG4gIH1cblxuICBvbk1vdW50KCgpID0+IHtcbiAgICBpZiAoYXV0b2ZvY3VzKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlZi5mb2N1cygpKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICB9KTtcblxuICBhZnRlclVwZGF0ZSgoKSA9PiB7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA+IDAgJiYgdmFsdWUgIT09IHByZXZWYWx1ZSkge1xuICAgICAgaWYgKGRlYm91bmNlID4gMCkge1xuICAgICAgICBkZWJvdW5jZWQoKCkgPT4gZGlzcGF0Y2goXCJ0eXBlXCIsIHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwYXRjaChcInR5cGVcIiwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDAgJiYgcHJldlZhbHVlLmxlbmd0aCA+IDApIGRpc3BhdGNoKFwiY2xlYXJcIik7XG5cbiAgICBwcmV2VmFsdWUgPSB2YWx1ZTtcbiAgfSk7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAvKipcbiAgKiBWaXN1YWxseSBoaWRlIGNvbnRlbnQgd2l0aG91dCBicmVha2luZyBzY3JlZW4gcmVhZGVyc1xuICAqIGh0dHBzOi8vYTExeXByb2plY3QuY29tL3Bvc3RzL2hvdy10by1oaWRlLWNvbnRlbnQvXG4gICovXG4gIC5oaWRlLWxhYmVsIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaGVpZ2h0OiAxcHg7XG4gICAgd2lkdGg6IDFweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGNsaXA6IHJlY3QoMXB4IDFweCAxcHggMXB4KTtcbiAgICBjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgfVxuPC9zdHlsZT5cblxuPGZvcm0gZGF0YS1zdmVsdGUtc2VhcmNoIHJvbGU9XCJzZWFyY2hcIiBhcmlhLWxhYmVsbGVkYnk9e2lkfSBvbjpzdWJtaXR8cHJldmVudERlZmF1bHQ+XG4gIDxsYWJlbCBpZD1cIntpZH0tbGFiZWxcIiBmb3I9e2lkfSBjbGFzczpoaWRlLWxhYmVsPXtoaWRlTGFiZWx9PlxuICAgIDxzbG90IG5hbWU9XCJsYWJlbFwiPntsYWJlbH08L3Nsb3Q+XG4gIDwvbGFiZWw+XG4gIDxpbnB1dFxuICAgIGJpbmQ6dGhpcz17cmVmfVxuICAgIG5hbWU9XCJzZWFyY2hcIlxuICAgIHR5cGU9XCJzZWFyY2hcIlxuICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCJcbiAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgIHNwZWxsY2hlY2s9XCJmYWxzZVwiXG4gICAgey4uLiQkcmVzdFByb3BzfVxuICAgIHtpZH1cbiAgICBiaW5kOnZhbHVlXG4gICAgb246aW5wdXRcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjpmb2N1c1xuICAgIG9uOmJsdXJcbiAgICBvbjprZXlkb3duIC8+XG48L2Zvcm0+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0RFLFdBQVcsY0FBQyxDQUFDLEFBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxDQUFFLEdBQUcsQ0FDWCxLQUFLLENBQUUsR0FBRyxDQUNWLFFBQVEsQ0FBRSxNQUFNLENBQ2hCLElBQUksQ0FBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUMzQixJQUFJLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDOUIsV0FBVyxDQUFFLE1BQU0sQUFDckIsQ0FBQyJ9 */";
    	append_dev(document.head, style);
    }

    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (70:23) {label}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 4) set_data_dev(t, /*label*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(70:23) {label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let form;
    	let label_1;
    	let label_1_id_value;
    	let t;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const label_slot_template = /*#slots*/ ctx[9].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[8], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block(ctx);

    	let input_levels = [
    		{ name: "search" },
    		{ type: "search" },
    		{ placeholder: "Search..." },
    		{ autocomplete: "off" },
    		{ spellcheck: "false" },
    		/*$$restProps*/ ctx[5],
    		{ id: /*id*/ ctx[4] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			label_1 = element("label");
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    			t = space();
    			input = element("input");
    			attr_dev(label_1, "id", label_1_id_value = "" + (/*id*/ ctx[4] + "-label"));
    			attr_dev(label_1, "for", /*id*/ ctx[4]);
    			attr_dev(label_1, "class", "svelte-5m0wg6");
    			toggle_class(label_1, "hide-label", /*hideLabel*/ ctx[3]);
    			add_location(label_1, file, 68, 2, 1538);
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-5m0wg6", true);
    			add_location(input, file, 71, 2, 1651);
    			attr_dev(form, "data-svelte-search", "");
    			attr_dev(form, "role", "search");
    			attr_dev(form, "aria-labelledby", /*id*/ ctx[4]);
    			add_location(form, file, 67, 0, 1450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, label_1);

    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(label_1, null);
    			}

    			append_dev(form, t);
    			append_dev(form, input);
    			/*input_binding*/ ctx[16](input);
    			set_input_value(input, /*value*/ ctx[0]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[17]),
    					listen_dev(input, "input", /*input_handler*/ ctx[11], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[12], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[13], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[14], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[15], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[10]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (label_slot) {
    				if (label_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(label_slot, label_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_label_slot_changes, get_label_slot_context);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && dirty & /*label*/ 4) {
    					label_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*id*/ 16 && label_1_id_value !== (label_1_id_value = "" + (/*id*/ ctx[4] + "-label"))) {
    				attr_dev(label_1, "id", label_1_id_value);
    			}

    			if (!current || dirty & /*id*/ 16) {
    				attr_dev(label_1, "for", /*id*/ ctx[4]);
    			}

    			if (dirty & /*hideLabel*/ 8) {
    				toggle_class(label_1, "hide-label", /*hideLabel*/ ctx[3]);
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ name: "search" },
    				{ type: "search" },
    				{ placeholder: "Search..." },
    				{ autocomplete: "off" },
    				{ spellcheck: "false" },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*id*/ 16) && { id: /*id*/ ctx[4] }
    			]));

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-5m0wg6", true);

    			if (!current || dirty & /*id*/ 16) {
    				attr_dev(form, "aria-labelledby", /*id*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    			/*input_binding*/ ctx[16](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const omit_props_names = ["value","autofocus","debounce","label","hideLabel","id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, ['label']);
    	let { value = "" } = $$props;
    	let { autofocus = false } = $$props;
    	let { debounce = 0 } = $$props;
    	let { label = "Label" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { id = "search" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let prevValue = value;
    	let timeout = undefined;
    	let calling = false;

    	function debounced(cb) {
    		if (calling) return;
    		calling = true;

    		timeout = setTimeout(
    			() => {
    				cb();
    				calling = false;
    			},
    			debounce
    		);
    	}

    	onMount(() => {
    		if (autofocus) window.requestAnimationFrame(() => ref.focus());
    		return () => clearTimeout(timeout);
    	});

    	afterUpdate(() => {
    		if (value.length > 0 && value !== prevValue) {
    			if (debounce > 0) {
    				debounced(() => dispatch("type", value));
    			} else {
    				dispatch("type", value);
    			}
    		}

    		if (value.length === 0 && prevValue.length > 0) dispatch("clear");
    		prevValue = value;
    	});

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ("autofocus" in $$new_props) $$invalidate(6, autofocus = $$new_props.autofocus);
    		if ("debounce" in $$new_props) $$invalidate(7, debounce = $$new_props.debounce);
    		if ("label" in $$new_props) $$invalidate(2, label = $$new_props.label);
    		if ("hideLabel" in $$new_props) $$invalidate(3, hideLabel = $$new_props.hideLabel);
    		if ("id" in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		autofocus,
    		debounce,
    		label,
    		hideLabel,
    		id,
    		ref,
    		createEventDispatcher,
    		onMount,
    		afterUpdate,
    		dispatch,
    		prevValue,
    		timeout,
    		calling,
    		debounced
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
    		if ("autofocus" in $$props) $$invalidate(6, autofocus = $$new_props.autofocus);
    		if ("debounce" in $$props) $$invalidate(7, debounce = $$new_props.debounce);
    		if ("label" in $$props) $$invalidate(2, label = $$new_props.label);
    		if ("hideLabel" in $$props) $$invalidate(3, hideLabel = $$new_props.hideLabel);
    		if ("id" in $$props) $$invalidate(4, id = $$new_props.id);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("prevValue" in $$props) prevValue = $$new_props.prevValue;
    		if ("timeout" in $$props) timeout = $$new_props.timeout;
    		if ("calling" in $$props) calling = $$new_props.calling;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		ref,
    		label,
    		hideLabel,
    		id,
    		$$restProps,
    		autofocus,
    		debounce,
    		$$scope,
    		slots,
    		submit_handler,
    		input_handler,
    		change_handler,
    		focus_handler,
    		blur_handler,
    		keydown_handler,
    		input_binding,
    		input_input_handler
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-5m0wg6-style")) add_css();

    		init(this, options, instance, create_fragment, not_equal, {
    			value: 0,
    			autofocus: 6,
    			debounce: 7,
    			label: 2,
    			hideLabel: 3,
    			id: 4,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get value() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autofocus() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autofocus(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debounce() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debounce(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* README.md generated by Svelte v3.31.0 */

    const { console: console_1 } = globals;
    const file$1 = "README.md";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (96:0) {#each events as event}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*event*/ ctx[10] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(div, file$1, 96, 2, 7341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*events*/ 4 && t0_value !== (t0_value = /*event*/ ctx[10] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(96:0) {#each events as event}",
    		ctx
    	});

    	return block;
    }

    // (116:2) <span slot="label">
    function create_label_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Custom label";
    			attr_dev(span, "slot", "label");
    			add_location(span, file$1, 115, 2, 10125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_label_slot.name,
    		type: "slot",
    		source: "(116:2) <span slot=\\\"label\\\">",
    		ctx
    	});

    	return block;
    }

    // (115:24) <Search>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(115:24) <Search>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let p0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t2;
    	let blockquote;
    	let p1;
    	let t4;
    	let p2;
    	let strong0;
    	let ul2;
    	let li0;
    	let a1;
    	let t7;
    	let li1;
    	let a2;
    	let t9;
    	let ul0;
    	let li2;
    	let a3;
    	let t11;
    	let li3;
    	let a4;
    	let t13;
    	let li4;
    	let a5;
    	let t15;
    	let li5;
    	let a6;
    	let t17;
    	let li6;
    	let a7;
    	let t19;
    	let li7;
    	let a8;
    	let t21;
    	let li8;
    	let a9;
    	let t23;
    	let li9;
    	let a10;
    	let t25;
    	let ul1;
    	let li10;
    	let a11;
    	let t27;
    	let li11;
    	let a12;
    	let t29;
    	let li12;
    	let a13;
    	let t31;
    	let li13;
    	let a14;
    	let t33;
    	let li14;
    	let a15;
    	let t35;
    	let li15;
    	let a16;
    	let t37;
    	let h20;
    	let t39;
    	let pre0;

    	let raw0_value = `<span class="token function">yarn</span> <span class="token function">add</span> -D svelte-search
<span class="token comment"># OR</span>
<span class="token function">npm</span> i -D svelte-search
` + "";

    	let t40;
    	let h21;
    	let t42;
    	let h30;
    	let t44;
    	let p3;
    	let strong1;
    	let t46;
    	let code0;
    	let t48;
    	let t49;
    	let pre1;

    	let raw1_value = `<span class="token selector">:global([data-svelte-search] input)</span> <span class="token punctuation">{</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 1.5rem<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 1rem<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> 2px solid #e0e0e0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
` + "";

    	let t50;
    	let h31;
    	let t52;
    	let div0;
    	let search0;
    	let updating_value;
    	let t53;
    	let t54;
    	let pre2;

    	let raw2_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> Search <span class="token keyword">from</span> <span class="token string">"svelte-search"</span><span class="token punctuation">;</span>

  <span class="token keyword">let</span> value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name"><span class="token namespace">bind:</span>value</span> <span class="token punctuation">/></span></span>

<span class="token language-javascript"><span class="token punctuation">{</span>value<span class="token punctuation">}</span></span>
` + "";

    	let t55;
    	let h32;
    	let t57;
    	let p4;
    	let code1;
    	let t59;
    	let t60;
    	let div1;
    	let search1;
    	let pre3;

    	let raw3_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>My label<span class="token punctuation">"</span></span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Placeholder text...<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
` + "";

    	let t61;
    	let h33;
    	let t63;
    	let pre4;

    	let raw4_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name">autofocus</span> <span class="token punctuation">/></span></span>
` + "";

    	let t64;
    	let h34;
    	let t66;
    	let div2;
    	let search2;
    	let updating_ref;
    	let t67;
    	let button;
    	let pre5;

    	let raw5_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">let</span> ref <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span> <span class="token attr-name"><span class="token namespace">bind:</span>ref</span> <span class="token punctuation">/></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>button<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">on:</span>click=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> ref<span class="token punctuation">.</span><span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span> Focus <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
` + "";

    	let t69;
    	let h35;
    	let t71;
    	let p5;
    	let t72;
    	let code2;
    	let t74;
    	let t75;
    	let div3;
    	let search3;
    	let updating_value_1;
    	let t76;
    	let pre6;

    	let raw6_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">let</span> events <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span>
  <span class="token attr-name"><span class="token namespace">bind:</span>value</span>
  <span class="token attr-name">debounce=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token number">800</span><span class="token punctuation">}</span></span>
  <span class="token attr-name"><span class="token namespace">on:</span>type=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>events <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>events<span class="token punctuation">,</span> value<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span>
<span class="token punctuation">/></span></span>

<span class="token each"><span class="token punctuation">{</span><span class="token keyword">#each</span> <span class="token language-javascript">events </span><span class="token keyword">as</span> <span class="token language-javascript">event<span class="token punctuation">}</span></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token language-javascript"><span class="token punctuation">{</span>event<span class="token punctuation">}</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token each"><span class="token punctuation">{</span><span class="token keyword">/each</span><span class="token punctuation">}</span></span>
` + "";

    	let t77;
    	let h36;
    	let t79;
    	let div4;
    	let search4;
    	let pre7;

    	let raw7_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">slot</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>label<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Custom label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Search</span><span class="token punctuation">></span></span>
` + "";

    	let t80;
    	let h22;
    	let t82;
    	let p6;
    	let t83;
    	let code3;
    	let t85;
    	let t86;
    	let h37;
    	let t88;
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let t90;
    	let th1;
    	let t92;
    	let tbody;
    	let tr1;
    	let td0;
    	let t94;
    	let td1;
    	let code4;
    	let t96;
    	let tr2;
    	let td2;
    	let t98;
    	let td3;
    	let code5;
    	let t100;
    	let code6;
    	let t102;
    	let t103;
    	let tr3;
    	let td4;
    	let t105;
    	let td5;
    	let code7;
    	let t107;
    	let code8;
    	let t109;
    	let t110;
    	let tr4;
    	let td6;
    	let t112;
    	let td7;
    	let code9;
    	let t114;
    	let code10;
    	let t116;
    	let t117;
    	let tr5;
    	let td8;
    	let t119;
    	let td9;
    	let code11;
    	let t121;
    	let code12;
    	let t123;
    	let t124;
    	let tr6;
    	let td10;
    	let t126;
    	let td11;
    	let code13;
    	let t128;
    	let code14;
    	let t130;
    	let t131;
    	let tr7;
    	let td12;
    	let t133;
    	let td13;
    	let code15;
    	let t135;
    	let code16;
    	let t137;
    	let t138;
    	let h38;
    	let t140;
    	let ul3;
    	let li16;
    	let t142;
    	let li17;
    	let t144;
    	let li18;
    	let t146;
    	let li19;
    	let t148;
    	let li20;
    	let t150;
    	let li21;
    	let t152;
    	let li22;
    	let t154;
    	let h39;
    	let t156;
    	let ul4;
    	let li23;
    	let t158;
    	let li24;
    	let t160;
    	let div5;
    	let search5;
    	let pre8;

    	let raw8_value = `<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Search</span>
  <span class="token attr-name"><span class="token namespace">on:</span>type=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'type'</span><span class="token punctuation">,</span> e<span class="token punctuation">.</span>detail<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// string</span>
  <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
  <span class="token attr-name"><span class="token namespace">on:</span>clear=</span><span class="token language-javascript"><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'clear'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="token punctuation">/></span></span>
` + "";

    	let t161;
    	let h23;
    	let t163;
    	let p7;
    	let t165;
    	let h24;
    	let t167;
    	let p8;
    	let a17;
    	let t169;
    	let h25;
    	let t171;
    	let p9;
    	let a18;
    	let t173;
    	let pre9;
    	let code17;
    	let current;
    	let mounted;
    	let dispose;

    	function search0_value_binding(value) {
    		/*search0_value_binding*/ ctx[3].call(null, value);
    	}

    	let search0_props = {};

    	if (/*value*/ ctx[0] !== void 0) {
    		search0_props.value = /*value*/ ctx[0];
    	}

    	search0 = new Search({ props: search0_props, $$inline: true });
    	binding_callbacks.push(() => bind(search0, "value", search0_value_binding));

    	search1 = new Search({
    			props: {
    				label: "My label",
    				placeholder: "Placeholder text..."
    			},
    			$$inline: true
    		});

    	function search2_ref_binding(value) {
    		/*search2_ref_binding*/ ctx[4].call(null, value);
    	}

    	let search2_props = {};

    	if (/*ref*/ ctx[1] !== void 0) {
    		search2_props.ref = /*ref*/ ctx[1];
    	}

    	search2 = new Search({ props: search2_props, $$inline: true });
    	binding_callbacks.push(() => bind(search2, "ref", search2_ref_binding));

    	function search3_value_binding(value) {
    		/*search3_value_binding*/ ctx[6].call(null, value);
    	}

    	let search3_props = { debounce: 800 };

    	if (/*value*/ ctx[0] !== void 0) {
    		search3_props.value = /*value*/ ctx[0];
    	}

    	search3 = new Search({ props: search3_props, $$inline: true });
    	binding_callbacks.push(() => bind(search3, "value", search3_value_binding));
    	search3.$on("type", /*type_handler*/ ctx[7]);
    	let each_value = /*events*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	search4 = new Search({
    			props: {
    				$$slots: {
    					default: [create_default_slot],
    					label: [create_label_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	search5 = new Search({ $$inline: true });
    	search5.$on("type", /*type_handler_1*/ ctx[8]);
    	search5.$on("clear", /*clear_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "svelte-search";
    			t1 = space();
    			p0 = element("p");
    			a0 = element("a");
    			img = element("img");
    			t2 = space();
    			blockquote = element("blockquote");
    			p1 = element("p");
    			p1.textContent = "Customizable search input component for Svelte.";
    			t4 = space();
    			p2 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Table of Contents";
    			ul2 = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Install";
    			t7 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Usage";
    			t9 = space();
    			ul0 = element("ul");
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Styling";
    			t11 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Basic";
    			t13 = space();
    			li4 = element("li");
    			a5 = element("a");
    			a5.textContent = "Label + placeholder";
    			t15 = space();
    			li5 = element("li");
    			a6 = element("a");
    			a6.textContent = "Autofocus";
    			t17 = space();
    			li6 = element("li");
    			a7 = element("a");
    			a7.textContent = "Focus programmatically";
    			t19 = space();
    			li7 = element("li");
    			a8 = element("a");
    			a8.textContent = "Debounced input";
    			t21 = space();
    			li8 = element("li");
    			a9 = element("a");
    			a9.textContent = "Label slot";
    			t23 = space();
    			li9 = element("li");
    			a10 = element("a");
    			a10.textContent = "API";
    			t25 = space();
    			ul1 = element("ul");
    			li10 = element("li");
    			a11 = element("a");
    			a11.textContent = "Props";
    			t27 = space();
    			li11 = element("li");
    			a12 = element("a");
    			a12.textContent = "Forwarded events";
    			t29 = space();
    			li12 = element("li");
    			a13 = element("a");
    			a13.textContent = "Dispatched events";
    			t31 = space();
    			li13 = element("li");
    			a14 = element("a");
    			a14.textContent = "TypeScript";
    			t33 = space();
    			li14 = element("li");
    			a15 = element("a");
    			a15.textContent = "Changelog";
    			t35 = space();
    			li15 = element("li");
    			a16 = element("a");
    			a16.textContent = "License";
    			t37 = space();
    			h20 = element("h2");
    			h20.textContent = "Install";
    			t39 = space();
    			pre0 = element("pre");
    			t40 = space();
    			h21 = element("h2");
    			h21.textContent = "Usage";
    			t42 = space();
    			h30 = element("h3");
    			h30.textContent = "Styling";
    			t44 = space();
    			p3 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Note:";
    			t46 = text(" this component is unstyled by default. You can target the component using the ");
    			code0 = element("code");
    			code0.textContent = "[data-svelte-search]";
    			t48 = text(" selector.");
    			t49 = space();
    			pre1 = element("pre");
    			t50 = space();
    			h31 = element("h3");
    			h31.textContent = "Basic";
    			t52 = space();
    			div0 = element("div");
    			create_component(search0.$$.fragment);
    			t53 = space();
    			t54 = text(/*value*/ ctx[0]);
    			pre2 = element("pre");
    			t55 = space();
    			h32 = element("h3");
    			h32.textContent = "Label + placeholder";
    			t57 = space();
    			p4 = element("p");
    			code1 = element("code");
    			code1.textContent = "$$restProps";
    			t59 = text(" are forwarded to the input element.");
    			t60 = space();
    			div1 = element("div");
    			create_component(search1.$$.fragment);
    			pre3 = element("pre");
    			t61 = space();
    			h33 = element("h3");
    			h33.textContent = "Autofocus";
    			t63 = space();
    			pre4 = element("pre");
    			t64 = space();
    			h34 = element("h3");
    			h34.textContent = "Focus programmatically";
    			t66 = space();
    			div2 = element("div");
    			create_component(search2.$$.fragment);
    			t67 = space();
    			button = element("button");
    			button.textContent = "Focus\n";
    			pre5 = element("pre");
    			t69 = space();
    			h35 = element("h3");
    			h35.textContent = "Debounced input";
    			t71 = space();
    			p5 = element("p");
    			t72 = text("Use the ");
    			code2 = element("code");
    			code2.textContent = "debounce";
    			t74 = text(" prop to specify the debounce value in milliseconds.");
    			t75 = space();
    			div3 = element("div");
    			create_component(search3.$$.fragment);
    			t76 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			pre6 = element("pre");
    			t77 = space();
    			h36 = element("h3");
    			h36.textContent = "Label slot";
    			t79 = space();
    			div4 = element("div");
    			create_component(search4.$$.fragment);
    			pre7 = element("pre");
    			t80 = space();
    			h22 = element("h2");
    			h22.textContent = "API";
    			t82 = space();
    			p6 = element("p");
    			t83 = text("This component forwards ");
    			code3 = element("code");
    			code3.textContent = "$$restProps";
    			t85 = text(" to the input element.");
    			t86 = space();
    			h37 = element("h3");
    			h37.textContent = "Props";
    			t88 = space();
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Prop name";
    			t90 = space();
    			th1 = element("th");
    			th1.textContent = "Value";
    			t92 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "id";
    			t94 = space();
    			td1 = element("td");
    			code4 = element("code");
    			code4.textContent = "string";
    			t96 = space();
    			tr2 = element("tr");
    			td2 = element("td");
    			td2.textContent = "label";
    			t98 = space();
    			td3 = element("td");
    			code5 = element("code");
    			code5.textContent = "string";
    			t100 = text(" (default: ");
    			code6 = element("code");
    			code6.textContent = "\"Search\"";
    			t102 = text(")");
    			t103 = space();
    			tr3 = element("tr");
    			td4 = element("td");
    			td4.textContent = "hideLabel";
    			t105 = space();
    			td5 = element("td");
    			code7 = element("code");
    			code7.textContent = "boolean";
    			t107 = text(" (default: ");
    			code8 = element("code");
    			code8.textContent = "false";
    			t109 = text(")");
    			t110 = space();
    			tr4 = element("tr");
    			td6 = element("td");
    			td6.textContent = "name";
    			t112 = space();
    			td7 = element("td");
    			code9 = element("code");
    			code9.textContent = "string";
    			t114 = text(" (default: ");
    			code10 = element("code");
    			code10.textContent = "\"search\"";
    			t116 = text(")");
    			t117 = space();
    			tr5 = element("tr");
    			td8 = element("td");
    			td8.textContent = "value";
    			t119 = space();
    			td9 = element("td");
    			code11 = element("code");
    			code11.textContent = "string";
    			t121 = text(" (default: ");
    			code12 = element("code");
    			code12.textContent = "\"value\"";
    			t123 = text(")");
    			t124 = space();
    			tr6 = element("tr");
    			td10 = element("td");
    			td10.textContent = "debounce";
    			t126 = space();
    			td11 = element("td");
    			code13 = element("code");
    			code13.textContent = "boolean";
    			t128 = text(" (default: ");
    			code14 = element("code");
    			code14.textContent = "false";
    			t130 = text(")");
    			t131 = space();
    			tr7 = element("tr");
    			td12 = element("td");
    			td12.textContent = "debounceValue";
    			t133 = space();
    			td13 = element("td");
    			code15 = element("code");
    			code15.textContent = "number";
    			t135 = text(" (default: ");
    			code16 = element("code");
    			code16.textContent = "250";
    			t137 = text(")");
    			t138 = space();
    			h38 = element("h3");
    			h38.textContent = "Forwarded events";
    			t140 = space();
    			ul3 = element("ul");
    			li16 = element("li");
    			li16.textContent = "on:input";
    			t142 = space();
    			li17 = element("li");
    			li17.textContent = "on:type";
    			t144 = space();
    			li18 = element("li");
    			li18.textContent = "on:submit";
    			t146 = space();
    			li19 = element("li");
    			li19.textContent = "on:change";
    			t148 = space();
    			li20 = element("li");
    			li20.textContent = "on:focus";
    			t150 = space();
    			li21 = element("li");
    			li21.textContent = "on:blur";
    			t152 = space();
    			li22 = element("li");
    			li22.textContent = "on:keydown";
    			t154 = space();
    			h39 = element("h3");
    			h39.textContent = "Dispatched events";
    			t156 = space();
    			ul4 = element("ul");
    			li23 = element("li");
    			li23.textContent = "on:type";
    			t158 = space();
    			li24 = element("li");
    			li24.textContent = "on:clear";
    			t160 = space();
    			div5 = element("div");
    			create_component(search5.$$.fragment);
    			pre8 = element("pre");
    			t161 = space();
    			h23 = element("h2");
    			h23.textContent = "TypeScript";
    			t163 = space();
    			p7 = element("p");
    			p7.textContent = "Svelte version 3.31 or greater is required to use this component with TypeScript.";
    			t165 = space();
    			h24 = element("h2");
    			h24.textContent = "Changelog";
    			t167 = space();
    			p8 = element("p");
    			a17 = element("a");
    			a17.textContent = "Changelog";
    			t169 = space();
    			h25 = element("h2");
    			h25.textContent = "License";
    			t171 = space();
    			p9 = element("p");
    			a18 = element("a");
    			a18.textContent = "MIT";
    			t173 = space();
    			pre9 = element("pre");
    			code17 = element("code");
    			attr_dev(h1, "id", "svelte-search");
    			add_location(h1, file$1, 10, 42, 188);
    			if (img.src !== (img_src_value = "https://img.shields.io/npm/v/svelte-search.svg?color=%23161616")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "NPM");
    			add_location(img, file$1, 11, 53, 283);
    			attr_dev(a0, "href", "https://npmjs.com/package/svelte-search");
    			add_location(a0, file$1, 11, 3, 233);
    			add_location(p0, file$1, 11, 0, 230);
    			add_location(p1, file$1, 13, 0, 389);
    			add_location(blockquote, file$1, 12, 0, 376);
    			add_location(strong0, file$1, 15, 3, 461);
    			add_location(p2, file$1, 15, 0, 458);
    			attr_dev(a1, "href", "#install");
    			add_location(a1, file$1, 15, 49, 507);
    			add_location(li0, file$1, 15, 45, 503);
    			attr_dev(a2, "href", "#usage");
    			add_location(a2, file$1, 16, 4, 547);
    			add_location(li1, file$1, 16, 0, 543);
    			attr_dev(a3, "href", "#styling");
    			add_location(a3, file$1, 17, 8, 587);
    			add_location(li2, file$1, 17, 4, 583);
    			attr_dev(a4, "href", "#basic");
    			add_location(a4, file$1, 18, 4, 627);
    			add_location(li3, file$1, 18, 0, 623);
    			attr_dev(a5, "href", "#label-%2B-placeholder");
    			add_location(a5, file$1, 19, 4, 663);
    			add_location(li4, file$1, 19, 0, 659);
    			attr_dev(a6, "href", "#autofocus");
    			add_location(a6, file$1, 20, 4, 729);
    			add_location(li5, file$1, 20, 0, 725);
    			attr_dev(a7, "href", "#focus-programmatically");
    			add_location(a7, file$1, 21, 4, 773);
    			add_location(li6, file$1, 21, 0, 769);
    			attr_dev(a8, "href", "#debounced-input");
    			add_location(a8, file$1, 22, 4, 843);
    			add_location(li7, file$1, 22, 0, 839);
    			attr_dev(a9, "href", "#label-slot");
    			add_location(a9, file$1, 23, 4, 899);
    			add_location(li8, file$1, 23, 0, 895);
    			add_location(ul0, file$1, 17, 0, 579);
    			attr_dev(a10, "href", "#api");
    			add_location(a10, file$1, 24, 9, 950);
    			add_location(li9, file$1, 24, 5, 946);
    			attr_dev(a11, "href", "#props");
    			add_location(a11, file$1, 25, 8, 986);
    			add_location(li10, file$1, 25, 4, 982);
    			attr_dev(a12, "href", "#forwarded-events");
    			add_location(a12, file$1, 26, 4, 1022);
    			add_location(li11, file$1, 26, 0, 1018);
    			attr_dev(a13, "href", "#dispatched-events");
    			add_location(a13, file$1, 27, 4, 1080);
    			add_location(li12, file$1, 27, 0, 1076);
    			add_location(ul1, file$1, 25, 0, 978);
    			attr_dev(a14, "href", "#typescript");
    			add_location(a14, file$1, 28, 9, 1145);
    			add_location(li13, file$1, 28, 5, 1141);
    			attr_dev(a15, "href", "#changelog");
    			add_location(a15, file$1, 29, 4, 1191);
    			add_location(li14, file$1, 29, 0, 1187);
    			attr_dev(a16, "href", "#license");
    			add_location(a16, file$1, 30, 4, 1235);
    			add_location(li15, file$1, 30, 0, 1231);
    			add_location(ul2, file$1, 15, 41, 499);
    			attr_dev(h20, "id", "install");
    			add_location(h20, file$1, 31, 0, 1276);
    			attr_dev(pre0, "class", "language-bash");
    			add_location(pre0, file$1, 32, 0, 1306);
    			attr_dev(h21, "id", "usage");
    			add_location(h21, file$1, 36, 0, 1547);
    			attr_dev(h30, "id", "styling");
    			add_location(h30, file$1, 37, 0, 1573);
    			add_location(strong1, file$1, 38, 3, 1606);
    			add_location(code0, file$1, 38, 104, 1707);
    			add_location(p3, file$1, 38, 0, 1603);
    			attr_dev(pre1, "class", "language-css");
    			add_location(pre1, file$1, 39, 0, 1755);
    			attr_dev(h31, "id", "basic");
    			add_location(h31, file$1, 45, 0, 2361);
    			attr_dev(div0, "class", "code-fence");
    			add_location(div0, file$1, 47, 0, 2418);
    			attr_dev(pre2, "class", "language-svelte");
    			attr_dev(pre2, "data-svelte", "");
    			add_location(pre2, file$1, 49, 13, 2478);
    			attr_dev(h32, "id", "label-%2B-placeholder");
    			add_location(h32, file$1, 60, 0, 3672);
    			add_location(code1, file$1, 61, 3, 3731);
    			add_location(p4, file$1, 61, 0, 3728);
    			attr_dev(div1, "class", "code-fence");
    			add_location(div1, file$1, 63, 0, 3827);
    			attr_dev(pre3, "class", "language-svelte");
    			attr_dev(pre3, "data-svelte", "");
    			add_location(pre3, file$1, 63, 91, 3918);
    			attr_dev(h33, "id", "autofocus");
    			add_location(h33, file$1, 66, 0, 4597);
    			attr_dev(pre4, "class", "language-html");
    			add_location(pre4, file$1, 68, 0, 4662);
    			attr_dev(h34, "id", "focus-programmatically");
    			add_location(h34, file$1, 71, 0, 4936);
    			attr_dev(button, "type", "button");
    			add_location(button, file$1, 75, 0, 5072);
    			attr_dev(div2, "class", "code-fence");
    			add_location(div2, file$1, 73, 0, 5027);
    			attr_dev(pre5, "class", "language-svelte");
    			attr_dev(pre5, "data-svelte", "");
    			add_location(pre5, file$1, 77, 15, 5147);
    			attr_dev(h35, "id", "debounced-input");
    			add_location(h35, file$1, 86, 0, 7037);
    			add_location(code2, file$1, 87, 11, 7094);
    			add_location(p5, file$1, 87, 0, 7083);
    			attr_dev(div3, "class", "code-fence");
    			add_location(div3, file$1, 89, 0, 7203);
    			attr_dev(pre6, "class", "language-svelte");
    			attr_dev(pre6, "data-svelte", "");
    			add_location(pre6, file$1, 97, 13, 7373);
    			attr_dev(h36, "id", "label-slot");
    			add_location(h36, file$1, 112, 0, 10023);
    			attr_dev(div4, "class", "code-fence");
    			add_location(div4, file$1, 114, 0, 10090);
    			attr_dev(pre7, "class", "language-svelte");
    			attr_dev(pre7, "data-svelte", "");
    			add_location(pre7, file$1, 116, 15, 10179);
    			attr_dev(h22, "id", "api");
    			add_location(h22, file$1, 119, 0, 11089);
    			add_location(code3, file$1, 120, 27, 11138);
    			add_location(p6, file$1, 120, 0, 11111);
    			attr_dev(h37, "id", "props");
    			add_location(h37, file$1, 121, 0, 11189);
    			set_style(th0, "text-align", "left");
    			add_location(th0, file$1, 125, 0, 11236);
    			set_style(th1, "text-align", "left");
    			add_location(th1, file$1, 126, 0, 11279);
    			add_location(tr0, file$1, 124, 0, 11231);
    			add_location(thead, file$1, 123, 0, 11223);
    			set_style(td0, "text-align", "left");
    			add_location(td0, file$1, 131, 0, 11346);
    			add_location(code4, file$1, 132, 28, 11410);
    			set_style(td1, "text-align", "left");
    			add_location(td1, file$1, 132, 0, 11382);
    			add_location(tr1, file$1, 130, 0, 11341);
    			set_style(td2, "text-align", "left");
    			add_location(td2, file$1, 135, 0, 11446);
    			add_location(code5, file$1, 136, 28, 11513);
    			add_location(code6, file$1, 136, 58, 11543);
    			set_style(td3, "text-align", "left");
    			add_location(td3, file$1, 136, 0, 11485);
    			add_location(tr2, file$1, 134, 0, 11441);
    			set_style(td4, "text-align", "left");
    			add_location(td4, file$1, 139, 0, 11592);
    			add_location(code7, file$1, 140, 28, 11663);
    			add_location(code8, file$1, 140, 59, 11694);
    			set_style(td5, "text-align", "left");
    			add_location(td5, file$1, 140, 0, 11635);
    			add_location(tr3, file$1, 138, 0, 11587);
    			set_style(td6, "text-align", "left");
    			add_location(td6, file$1, 143, 0, 11730);
    			add_location(code9, file$1, 144, 28, 11796);
    			add_location(code10, file$1, 144, 58, 11826);
    			set_style(td7, "text-align", "left");
    			add_location(td7, file$1, 144, 0, 11768);
    			add_location(tr4, file$1, 142, 0, 11725);
    			set_style(td8, "text-align", "left");
    			add_location(td8, file$1, 147, 0, 11875);
    			add_location(code11, file$1, 148, 28, 11942);
    			add_location(code12, file$1, 148, 58, 11972);
    			set_style(td9, "text-align", "left");
    			add_location(td9, file$1, 148, 0, 11914);
    			add_location(tr5, file$1, 146, 0, 11870);
    			set_style(td10, "text-align", "left");
    			add_location(td10, file$1, 151, 0, 12020);
    			add_location(code13, file$1, 152, 28, 12090);
    			add_location(code14, file$1, 152, 59, 12121);
    			set_style(td11, "text-align", "left");
    			add_location(td11, file$1, 152, 0, 12062);
    			add_location(tr6, file$1, 150, 0, 12015);
    			set_style(td12, "text-align", "left");
    			add_location(td12, file$1, 155, 0, 12157);
    			add_location(code15, file$1, 156, 28, 12232);
    			add_location(code16, file$1, 156, 58, 12262);
    			set_style(td13, "text-align", "left");
    			add_location(td13, file$1, 156, 0, 12204);
    			add_location(tr7, file$1, 154, 0, 12152);
    			add_location(tbody, file$1, 129, 0, 11333);
    			add_location(table, file$1, 122, 0, 11215);
    			attr_dev(h38, "id", "forwarded-events");
    			add_location(h38, file$1, 160, 0, 12309);
    			add_location(li16, file$1, 162, 0, 12362);
    			add_location(li17, file$1, 163, 0, 12380);
    			add_location(li18, file$1, 164, 0, 12397);
    			add_location(li19, file$1, 165, 0, 12416);
    			add_location(li20, file$1, 166, 0, 12435);
    			add_location(li21, file$1, 167, 0, 12453);
    			add_location(li22, file$1, 168, 0, 12470);
    			add_location(ul3, file$1, 161, 0, 12357);
    			attr_dev(h39, "id", "dispatched-events");
    			add_location(h39, file$1, 170, 0, 12496);
    			add_location(li23, file$1, 172, 0, 12551);
    			add_location(li24, file$1, 173, 0, 12568);
    			add_location(ul4, file$1, 171, 0, 12546);
    			attr_dev(div5, "class", "code-fence");
    			add_location(div5, file$1, 176, 0, 12623);
    			attr_dev(pre8, "class", "language-svelte");
    			attr_dev(pre8, "data-svelte", "");
    			add_location(pre8, file$1, 182, 13, 12785);
    			attr_dev(h23, "id", "typescript");
    			add_location(h23, file$1, 192, 0, 14572);
    			add_location(p7, file$1, 193, 0, 14608);
    			attr_dev(h24, "id", "changelog");
    			add_location(h24, file$1, 194, 0, 14697);
    			attr_dev(a17, "href", "https://github.com/metonym/svelte-search/tree/master/CHANGELOG.md");
    			add_location(a17, file$1, 195, 3, 14734);
    			add_location(p8, file$1, 195, 0, 14731);
    			attr_dev(h25, "id", "license");
    			add_location(h25, file$1, 196, 0, 14828);
    			attr_dev(a18, "href", "https://github.com/metonym/svelte-search/tree/master/LICENSE");
    			add_location(a18, file$1, 197, 3, 14861);
    			add_location(p9, file$1, 197, 0, 14858);
    			add_location(code17, file$1, 198, 5, 14949);
    			add_location(pre9, file$1, 198, 0, 14944);
    			attr_dev(main, "class", "markdown-body");
    			add_location(main, file$1, 10, 14, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, p0);
    			append_dev(p0, a0);
    			append_dev(a0, img);
    			append_dev(main, t2);
    			append_dev(main, blockquote);
    			append_dev(blockquote, p1);
    			append_dev(main, t4);
    			append_dev(main, p2);
    			append_dev(p2, strong0);
    			append_dev(main, ul2);
    			append_dev(ul2, li0);
    			append_dev(li0, a1);
    			append_dev(ul2, t7);
    			append_dev(ul2, li1);
    			append_dev(li1, a2);
    			append_dev(ul2, t9);
    			append_dev(ul2, ul0);
    			append_dev(ul0, li2);
    			append_dev(li2, a3);
    			append_dev(ul0, t11);
    			append_dev(ul0, li3);
    			append_dev(li3, a4);
    			append_dev(ul0, t13);
    			append_dev(ul0, li4);
    			append_dev(li4, a5);
    			append_dev(ul0, t15);
    			append_dev(ul0, li5);
    			append_dev(li5, a6);
    			append_dev(ul0, t17);
    			append_dev(ul0, li6);
    			append_dev(li6, a7);
    			append_dev(ul0, t19);
    			append_dev(ul0, li7);
    			append_dev(li7, a8);
    			append_dev(ul0, t21);
    			append_dev(ul0, li8);
    			append_dev(li8, a9);
    			append_dev(ul0, t23);
    			append_dev(ul2, li9);
    			append_dev(li9, a10);
    			append_dev(ul2, t25);
    			append_dev(ul2, ul1);
    			append_dev(ul1, li10);
    			append_dev(li10, a11);
    			append_dev(ul1, t27);
    			append_dev(ul1, li11);
    			append_dev(li11, a12);
    			append_dev(ul1, t29);
    			append_dev(ul1, li12);
    			append_dev(li12, a13);
    			append_dev(ul1, t31);
    			append_dev(ul2, li13);
    			append_dev(li13, a14);
    			append_dev(ul2, t33);
    			append_dev(ul2, li14);
    			append_dev(li14, a15);
    			append_dev(ul2, t35);
    			append_dev(ul2, li15);
    			append_dev(li15, a16);
    			append_dev(main, t37);
    			append_dev(main, h20);
    			append_dev(main, t39);
    			append_dev(main, pre0);
    			pre0.innerHTML = raw0_value;
    			append_dev(main, t40);
    			append_dev(main, h21);
    			append_dev(main, t42);
    			append_dev(main, h30);
    			append_dev(main, t44);
    			append_dev(main, p3);
    			append_dev(p3, strong1);
    			append_dev(p3, t46);
    			append_dev(p3, code0);
    			append_dev(p3, t48);
    			append_dev(main, t49);
    			append_dev(main, pre1);
    			pre1.innerHTML = raw1_value;
    			append_dev(main, t50);
    			append_dev(main, h31);
    			append_dev(main, t52);
    			append_dev(main, div0);
    			mount_component(search0, div0, null);
    			append_dev(div0, t53);
    			append_dev(div0, t54);
    			append_dev(main, pre2);
    			pre2.innerHTML = raw2_value;
    			append_dev(main, t55);
    			append_dev(main, h32);
    			append_dev(main, t57);
    			append_dev(main, p4);
    			append_dev(p4, code1);
    			append_dev(p4, t59);
    			append_dev(main, t60);
    			append_dev(main, div1);
    			mount_component(search1, div1, null);
    			append_dev(main, pre3);
    			pre3.innerHTML = raw3_value;
    			append_dev(main, t61);
    			append_dev(main, h33);
    			append_dev(main, t63);
    			append_dev(main, pre4);
    			pre4.innerHTML = raw4_value;
    			append_dev(main, t64);
    			append_dev(main, h34);
    			append_dev(main, t66);
    			append_dev(main, div2);
    			mount_component(search2, div2, null);
    			append_dev(div2, t67);
    			append_dev(div2, button);
    			append_dev(main, pre5);
    			pre5.innerHTML = raw5_value;
    			append_dev(main, t69);
    			append_dev(main, h35);
    			append_dev(main, t71);
    			append_dev(main, p5);
    			append_dev(p5, t72);
    			append_dev(p5, code2);
    			append_dev(p5, t74);
    			append_dev(main, t75);
    			append_dev(main, div3);
    			mount_component(search3, div3, null);
    			append_dev(div3, t76);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(main, pre6);
    			pre6.innerHTML = raw6_value;
    			append_dev(main, t77);
    			append_dev(main, h36);
    			append_dev(main, t79);
    			append_dev(main, div4);
    			mount_component(search4, div4, null);
    			append_dev(main, pre7);
    			pre7.innerHTML = raw7_value;
    			append_dev(main, t80);
    			append_dev(main, h22);
    			append_dev(main, t82);
    			append_dev(main, p6);
    			append_dev(p6, t83);
    			append_dev(p6, code3);
    			append_dev(p6, t85);
    			append_dev(main, t86);
    			append_dev(main, h37);
    			append_dev(main, t88);
    			append_dev(main, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t90);
    			append_dev(tr0, th1);
    			append_dev(table, t92);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t94);
    			append_dev(tr1, td1);
    			append_dev(td1, code4);
    			append_dev(tbody, t96);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td2);
    			append_dev(tr2, t98);
    			append_dev(tr2, td3);
    			append_dev(td3, code5);
    			append_dev(td3, t100);
    			append_dev(td3, code6);
    			append_dev(td3, t102);
    			append_dev(tbody, t103);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td4);
    			append_dev(tr3, t105);
    			append_dev(tr3, td5);
    			append_dev(td5, code7);
    			append_dev(td5, t107);
    			append_dev(td5, code8);
    			append_dev(td5, t109);
    			append_dev(tbody, t110);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td6);
    			append_dev(tr4, t112);
    			append_dev(tr4, td7);
    			append_dev(td7, code9);
    			append_dev(td7, t114);
    			append_dev(td7, code10);
    			append_dev(td7, t116);
    			append_dev(tbody, t117);
    			append_dev(tbody, tr5);
    			append_dev(tr5, td8);
    			append_dev(tr5, t119);
    			append_dev(tr5, td9);
    			append_dev(td9, code11);
    			append_dev(td9, t121);
    			append_dev(td9, code12);
    			append_dev(td9, t123);
    			append_dev(tbody, t124);
    			append_dev(tbody, tr6);
    			append_dev(tr6, td10);
    			append_dev(tr6, t126);
    			append_dev(tr6, td11);
    			append_dev(td11, code13);
    			append_dev(td11, t128);
    			append_dev(td11, code14);
    			append_dev(td11, t130);
    			append_dev(tbody, t131);
    			append_dev(tbody, tr7);
    			append_dev(tr7, td12);
    			append_dev(tr7, t133);
    			append_dev(tr7, td13);
    			append_dev(td13, code15);
    			append_dev(td13, t135);
    			append_dev(td13, code16);
    			append_dev(td13, t137);
    			append_dev(main, t138);
    			append_dev(main, h38);
    			append_dev(main, t140);
    			append_dev(main, ul3);
    			append_dev(ul3, li16);
    			append_dev(ul3, t142);
    			append_dev(ul3, li17);
    			append_dev(ul3, t144);
    			append_dev(ul3, li18);
    			append_dev(ul3, t146);
    			append_dev(ul3, li19);
    			append_dev(ul3, t148);
    			append_dev(ul3, li20);
    			append_dev(ul3, t150);
    			append_dev(ul3, li21);
    			append_dev(ul3, t152);
    			append_dev(ul3, li22);
    			append_dev(main, t154);
    			append_dev(main, h39);
    			append_dev(main, t156);
    			append_dev(main, ul4);
    			append_dev(ul4, li23);
    			append_dev(ul4, t158);
    			append_dev(ul4, li24);
    			append_dev(main, t160);
    			append_dev(main, div5);
    			mount_component(search5, div5, null);
    			append_dev(main, pre8);
    			pre8.innerHTML = raw8_value;
    			append_dev(main, t161);
    			append_dev(main, h23);
    			append_dev(main, t163);
    			append_dev(main, p7);
    			append_dev(main, t165);
    			append_dev(main, h24);
    			append_dev(main, t167);
    			append_dev(main, p8);
    			append_dev(p8, a17);
    			append_dev(main, t169);
    			append_dev(main, h25);
    			append_dev(main, t171);
    			append_dev(main, p9);
    			append_dev(p9, a18);
    			append_dev(main, t173);
    			append_dev(main, pre9);
    			append_dev(pre9, code17);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const search0_changes = {};

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				search0_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			search0.$set(search0_changes);
    			if (!current || dirty & /*value*/ 1) set_data_dev(t54, /*value*/ ctx[0]);
    			const search2_changes = {};

    			if (!updating_ref && dirty & /*ref*/ 2) {
    				updating_ref = true;
    				search2_changes.ref = /*ref*/ ctx[1];
    				add_flush_callback(() => updating_ref = false);
    			}

    			search2.$set(search2_changes);
    			const search3_changes = {};

    			if (!updating_value_1 && dirty & /*value*/ 1) {
    				updating_value_1 = true;
    				search3_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			search3.$set(search3_changes);

    			if (dirty & /*events*/ 4) {
    				each_value = /*events*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const search4_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				search4_changes.$$scope = { dirty, ctx };
    			}

    			search4.$set(search4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search0.$$.fragment, local);
    			transition_in(search1.$$.fragment, local);
    			transition_in(search2.$$.fragment, local);
    			transition_in(search3.$$.fragment, local);
    			transition_in(search4.$$.fragment, local);
    			transition_in(search5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search0.$$.fragment, local);
    			transition_out(search1.$$.fragment, local);
    			transition_out(search2.$$.fragment, local);
    			transition_out(search3.$$.fragment, local);
    			transition_out(search4.$$.fragment, local);
    			transition_out(search5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(search0);
    			destroy_component(search1);
    			destroy_component(search2);
    			destroy_component(search3);
    			destroy_each(each_blocks, detaching);
    			destroy_component(search4);
    			destroy_component(search5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("README", slots, []);
    	let value = "";
    	let ref = null;
    	let events = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<README> was created with unknown prop '${key}'`);
    	});

    	function search0_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function search2_ref_binding(value) {
    		ref = value;
    		$$invalidate(1, ref);
    	}

    	const click_handler = () => ref.focus();

    	function search3_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	const type_handler = () => $$invalidate(2, events = [...events, value]);

    	const type_handler_1 = e => {
    		console.log("type", e.detail); // string
    	};

    	const clear_handler = e => {
    		console.log("clear");
    	};

    	$$self.$capture_state = () => ({ Search, value, ref, events });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("ref" in $$props) $$invalidate(1, ref = $$props.ref);
    		if ("events" in $$props) $$invalidate(2, events = $$props.events);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		ref,
    		events,
    		search0_value_binding,
    		search2_ref_binding,
    		click_handler,
    		search3_value_binding,
    		type_handler,
    		type_handler_1,
    		clear_handler
    	];
    }

    class README extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "README",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new README({ target: document.body });

    return app;

}());
