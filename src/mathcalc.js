//
// MathCalc: a parser for basic mathematical expressions
// From here: https://paiv.github.io/blog/2016/03/23/js-calc.html
//
//
// Copyright (c) 2016, Pavel Ivashkov, github.com/paiv
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

'use strict';

var MathCalc = (function (module) {
    var MathCalc = function () {
        this.parser = new MathExpression();
    };
    var mathcalc = MathCalc.prototype;


    function sliceArguments(args, start) {
        var res = [];
        for (var i = start, len = args.length; i < len; i++) {
            res.push(args[i]);
        }
        return res;
    }


    var Logger = (function () {
        var Logger = function (prefix, level, out) {
            this.prefix = (prefix || '') + ':';
            this.level = level || Logger.NONE;
            this.out = out || (console && console.log.bind(console));

            this.warn = this.log.bind(this, Logger.WARN);
            this.info = this.log.bind(this, Logger.INFO);
            this.debug = this.log.bind(this, Logger.DEBUG);
        };
        var proto = Logger.prototype;

        Logger.DEBUG = 1;
        Logger.INFO = 2;
        Logger.WARN = 3;
        Logger.NONE = 4;

        proto.log = function (level, text) {
            if (level >= this.level && typeof (this.out) === 'function') {
                var args = sliceArguments(arguments, 2);
                args = [this.prefix + text].concat(args);
                this.out.apply(this, args);
            }
        };

        return Logger;
    })();


    var Scope = (function () {
        var Scope = function (obj) {
            this.obj = obj || {};
        };
        var proto = Scope.prototype;

        proto.get = function (name) {
            var value = this.obj[name];
            if (value === undefined && this.parent)
                value = this.parent.get(name);
            return value;
        }

        proto.set = function (name, value) {
            this.obj[name] = value;
            return this.get(name);
        }

        return Scope;
    })();


    var MathExpression = (function () {
        var logger = new Logger('PARSER', Logger.NONE);
        var emitLogger = new Logger('EMIT', Logger.NONE);

        var MathExpression = function () { };
        var proto = MathExpression.prototype;

        proto.parse = function (content) {
            this.error = undefined;
            var lex = lexer(content);
            var ast = parser(lex.tokens);
            emitLogger.debug('AST: %o', ast);
            var func = tryCatch(emitter(ast.root));

            return (function () {
                var scope = {};
                return {
                    error: lex.error || ast.error,
                    args: getArgsSpec(ast.vars),
                    eval: function () { return func(enterScope(scope, ast.vars, arguments)); },
                    set scope(obj) { scope = obj || {}; },
                    get scope() { return scope; }
                };
            })();
        };

        function getArgsSpec(vars) {
            var spec = {};
            vars.forEach(function (v, i) { spec[v] = i; });
            return spec;
        }

        function enterScope(scope, vars, args) {
            if (args.length === 1 && (typeof args[0] === 'object')) {
                var argobj = args[0];
                vars.forEach(function (v) { scope[v] = argobj[v]; });
            }
            else {
                for (var i = 0, vlen = vars.length, alen = args.length; i < vlen && i < alen; i++)
                    scope[vars[i]] = args[i];
            }

            delete scope.runtimeError;

            var child = new Scope(scope);
            child.parent = StdLib;
            return child;
        }

        function emitter(ast) {
            if (ast !== undefined) {
                switch (ast.id) {
                    case 'Expr':
                    case 'Tuple':
                        return emitter(ast.expr);
                    case 'OpenTuple':
                        return ast.expr ? emit_tuple(ast.expr) : emit_tuple(ast.left, ast.right);
                    case 'Assign':
                        return ast.expr ? emitter(ast.expr) : emit_assign(ast.left, ast.right);
                    case 'Sums':
                    case 'Prod':
                    case 'Power':
                        return ast.expr ? emitter(ast.expr) : emit_binary_op(ast.op, ast.left, ast.right);
                    case 'Unary':
                        return ast.expr ? emitter(ast.expr) : emit_unary_op(ast.op, ast.right);
                    case 'Call':
                        return emit_call(ast.token, ast.args);
                    case 'Parens':
                        return emitter(ast.expr);
                    case 'Value':
                        return emitter(ast.token);
                    case 'Number':
                        return function () { return ast.value; };
                    case 'Var':
                        return function (scope) { return scope.get(ast.value); };
                    default:
                        emitLogger.warn('No emitter for %o', ast);
                }
            }
            return function () { };
        }

        function tryCatch(code) {
            return function (scope) {
                try {
                    return code.apply(null, arguments);
                }
                catch (e) {
                    scope.set('runtimeError', { text: '' + e });
                }
            };
        }

        function emit_call(token, args) {
            var tupleArgs = isTuple(args);
            args = emitter(args);

            return function (scope) {
                var func = scope.get(token.value);

                if (typeof func === 'function') {
                    var vals = args.apply(null, arguments);
                    if (!tupleArgs)
                        vals = [vals];

                    return func.apply(null, vals);
                }

                scope.set('runtimeError', { text: 'Call to undefined "' + token.value + '"' });
            };
        }

        function isTuple(ast) {
            if (ast !== undefined)
                switch (ast.id) {
                    case 'Expr':
                    case 'Tuple':
                        return isTuple(ast.expr);
                    case 'OpenTuple':
                        return true;
                }
            return false;
        }

        function emit_tuple(left, right) {
            if (left === undefined) {
                return function () { return []; };
            }

            var open = left.id === 'OpenTuple';
            left = emitter(left);

            if (right === undefined) {
                return function () {
                    return [left.apply(null, arguments)];
                };
            }

            right = emitter(right);
            return open ?
                function () {
                    var t = left.apply(null, arguments);
                    t.push(right.apply(null, arguments));
                    return t;
                }
                :
                function () {
                    return [left.apply(null, arguments), right.apply(null, arguments)];
                };
        }

        function emit_assign(left, right) {
            right = emitter(right);
            return function (scope) {
                return scope.set(left.value, right.apply(null, arguments));
            };
        }

        function emit_unary_op(op, right) {
            right = emitter(right);
            switch (op.id) {
                case 'Plus': return function () { return right.apply(this, arguments); };
                case 'Minus': return function () { return -right.apply(this, arguments); };
                case 'Not': return function () { return ~right.apply(this, arguments); };
            }
            logger.warn('No emitter for %o', op);
            return function () { };
        }

        function emit_binary_op(op, left, right) {
            left = emitter(left);
            right = emitter(right);
            var self = undefined;

            function bifunc(op) {
                var args = sliceArguments(arguments, 1);
                return op(left.apply(this, args), right.apply(this, args));
            }

            // misc operators
            switch (op.id) {
                case 'And': return bifunc.bind(self, function (x, y) { return x & y; });
                case 'Or': return bifunc.bind(self, function (x, y) { return x | y; });
                case 'Xor': return bifunc.bind(self, function (x, y) { return x ^ y; });
                case 'Lshift': return bifunc.bind(self, function (x, y) { return x << y; });
                case 'Rshift': return bifunc.bind(self, function (x, y) { return x >> y; });
                case 'Zrshift': return bifunc.bind(self, function (x, y) { return x >>> y; });
                case 'Plus': return bifunc.bind(self, function (x, y) { return +x + y; });
                case 'Minus': return bifunc.bind(self, function (x, y) { return x - y; });
                case 'Mul': return bifunc.bind(self, function (x, y) { return x * y; });
                case 'Div': return bifunc.bind(self, function (x, y) { return x / y; });
                case 'Mod': return bifunc.bind(self, function (x, y) { return x % y; });
                case 'Pow': return bifunc.bind(self, function (x, y) { return Math.pow(x, y); });
            }
            logger.warn('No emitter for %o', op);
            return function () { };
        }

        var DONE = 0;
        var SHIFT = 1;
        var REDUCE = 2;

        var ShiftReduce = {};

        // expr: assign
        // tuple: tuple , assign | assign
        // assign: variable = assign | sum
        // sum: sum + product | product
        // product: product * pow | pow
        // pow: unary ^ pow | unary
        // unary: - unary | parens
        // parens: variable ( tuple ) | ( expr ) | value
        // value: number | variable

        add(SHIFT, ['(empty)', 'Not', 'And', 'Or', 'Xor', 'Lshift', 'Rshift', 'Zrshift', 'Plus', 'Minus', 'Mul', 'Div', 'Mod', 'Pow', 'LParen', 'Eq', 'Comma'], ['Not', 'And', 'Or', 'Xor', 'Lshift', 'Rshift', 'Zrshift', 'Plus', 'Minus', 'LParen', 'Number', 'Var']);
        add(SHIFT, ['Var'], ['LParen', 'Eq']);
        add(SHIFT, ['Sums'], ['And', 'Or', 'Xor', 'Lshift', 'Rshift', 'Zrshift', 'Plus', 'Minus']);
        add(SHIFT, ['Prod'], ['Mul', 'Div', 'Mod']);
        add(SHIFT, ['Unary'], ['Pow']);
        add(SHIFT, ['OpenTuple', 'Tuple'], ['Comma']);
        add(SHIFT, ['LParen', 'Expr'], ['RParen']);
        add(REDUCE, ['Number', 'Var', 'Value', 'RParen', 'Parens', 'Call', 'Unary', 'Power', 'Prod', 'Sums', 'Assign'], ['Comma']);
        add(REDUCE, ['Number', 'Var', 'Value', 'RParen', 'Parens', 'Call', 'Unary', 'Power', 'Prod'], ['Not', 'And', 'Or', 'Xor', 'Lshift', 'Rshift', 'Zrshift', 'Plus', 'Minus']);
        add(REDUCE, ['Number', 'Var', 'Value', 'RParen', 'Parens', 'Call', 'Unary', 'Power'], ['Mul', 'Div', 'Mod']);
        add(REDUCE, ['Number', 'Var', 'Value', 'RParen', 'Parens', 'Call'], ['Pow']);
        add(REDUCE, ['Number', 'Var', 'Value', 'RParen', 'Parens', 'Call', 'Unary', 'Power', 'Prod', 'Sums', 'Assign', 'Comma', 'OpenTuple', 'Tuple'], ['RParen', '(eof)']);
        add(DONE, ['(empty)', 'Expr'], ['(eof)']);

        function add(action, fro, to) {
            for (var i = 0, len = fro.length; i < len; i++)
                for (var j = 0, jlen = to.length; j < jlen; j++) {
                    var key = fro[i] + ':' + to[j];
                    ShiftReduce[key] = action;
                }
        }


        function parser(tokens) {
            var state = {
                tokens: tokens,
                pos: 0,
                stack: [],
                scope: {}
            };

            for (var tokenCount = 0, len = tokens.length, done = false; !done && tokenCount <= len;) {
                var token = tokens[tokenCount];
                var top = state.stack[state.stack.length - 1];

                var key = (top ? top.id : '(empty)') + ':' + (token ? token.id : '(eof)');
                var action = ShiftReduce[key];

                switch (action) {
                    case SHIFT:
                        logger.debug('shift %s %o', key, debug_stack(state.stack));
                        state = parser_shift(state, token);
                        tokenCount++;
                        break;
                    case REDUCE:
                        logger.debug('reduce %s %o', key, debug_stack(state.stack));
                        state = parser_reduce(state, token);
                        break;
                    case DONE:
                        logger.debug('done %s %o', key, debug_stack(state.stack));
                        done = true;
                        break;
                    default:
                        if (token !== undefined) {
                            var error = { pos: token.pos, text: 'Unexpected token "' + token.string + '"' };
                            state.error = error;
                            logger.warn('%s at %d (%s)', error.text, error.pos, key);
                        }
                        else {
                            var lerror = { text: 'Unexpected EOF', pos: state.pos + 1 };
                            state.error = lerror;
                            logger.warn('%s (%s)', lerror.text, key);
                        }
                        done = true;
                }
            }

            if (!state.error && state.stack.length > 1) {
                var item = getTop(state, 1);
                var pos = item.pos || 0;
                var paren = item.id === 'LParen';
                var loerror = { pos: pos, text: paren ? 'Open paren' : 'Invalid expression' };
                state.error = loerror;
                logger.warn('%s at %d (eof)', loerror.text, loerror.pos);
            }

            return {
                root: state.stack.pop(),
                vars: Object.keys(state.scope),
                error: state.error
            };
        }

        function debug_stack(stack) {
            if (logger.level >= Logger.DEBUG)
                return stack.map(function (x) { return x.id; });
            return '';
        }

        function parser_shift(state, token) {
            return parser_splice(state, 0, token);
        }

        function parser_splice(state, ntop, item) {
            var stack = state.stack.slice(0, state.stack.length - ntop);
            var pos = state.pos;
            if (item) {
                stack.push(item);
                if (item.pos !== undefined) pos = item.pos;
            }
            return {
                tokens: state.tokens,
                pos: pos,
                stack: stack,
                scope: state.scope,
                error: state.error
            };
        }

        function parser_reduce(state, token) {
            var top = getTop(state, 0);
            switch (top.id) {
                case 'Tuple':
                    return parser_reduce_expr(state);
                case 'OpenTuple':
                case 'Comma':
                    return parser_reduce_tuple(state, token);
                case 'Assign':
                case 'Sums':
                    return parser_reduce_assign(state, token);
                case 'Prod':
                    return parser_reduce_sums(state);
                case 'Power':
                case 'Unary':
                    return parser_reduce_power(state);
                case 'Call':
                case 'Parens':
                    return parser_reduce_unary_op(state);
                case 'Value':
                case 'RParen':
                    return parser_reduce_parens(state);
                case 'Number':
                case 'Var':
                    return parser_reduce_value(state);
            }
            return state;
        }

        function getTop(state, index) {
            if (index === undefined) index = 0;
            return state.stack[state.stack.length - (index + 1)];
        }

        function parser_reduce_expr(state) {
            var top = getTop(state, 0);
            var expr = {
                id: 'Expr',
                expr: top,
            };
            return parser_splice(state, 1, expr);
        }

        function parser_reduce_tuple(state, token) {
            var left = getTop(state, 2);
            var oper = getTop(state, 1);
            var right = getTop(state, 0);
            var expr = { id: 'OpenTuple' };

            if (right.id === 'Comma') {
                return parser_splice(state, 2, oper);
            }

            if (oper !== undefined && oper.id === 'Comma') {
                expr.op = oper;
                expr.left = left;
                expr.right = right;
                return parser_splice(state, 3, expr);
            }

            var open = token !== undefined && token.id === 'Comma';
            if (open) {
                expr.expr = right;
                return parser_splice(state, 1, expr);
            }

            expr = { id: 'Tuple', expr: right };
            return parser_splice(state, 1, expr);
        }

        function parser_reduce_assign(state, token) {
            var oper = getTop(state, 1);
            var right = getTop(state, 0);

            if (right !== undefined && right.id === 'Sums') {
                return parser_reduce_binary_op(state, ['Eq'], 'Assign');
            }
            if (oper !== undefined && oper.id === 'Eq') {
                return parser_reduce_binary_op(state, ['Eq'], 'Assign');
            }

            return parser_reduce_tuple(state, token);
        }

        function parser_reduce_sums(state) {
            return parser_reduce_binary_op(state, ['And', 'Or', 'Xor', 'Lshift', 'Rshift', 'Zrshift', 'Plus', 'Minus'], 'Sums');
        }

        function parser_reduce_product(state) {
            return parser_reduce_binary_op(state, ['Mul', 'Div', 'Mod'], 'Prod');
        }

        function parser_reduce_binary_op(state, ops, id) {
            var left = getTop(state, 2);
            var oper = getTop(state, 1);
            var right = getTop(state, 0);
            var expr = { id: id };

            if (oper !== undefined && ops.indexOf(oper.id) !== -1) {
                expr.op = oper;
                expr.left = left;
                expr.right = right;
                return parser_splice(state, 3, expr);
            }

            expr.expr = right;
            return parser_splice(state, 1, expr);
        }

        function parser_reduce_power(state) {
            var oper = getTop(state, 1);
            var top = getTop(state, 0);

            if (top !== undefined && top.id === 'Unary') {
                var unary = parser_reduce_unary_op(state, false);
                if (unary) return unary;

                var expr = { id: 'Power', expr: top };
                return parser_splice(state, 1, expr);
            }

            if (top !== undefined && top.id === 'Power' && oper !== undefined && oper.id === 'Pow') {
                return parser_reduce_binary_op(state, ['Pow'], 'Power');
            }

            return parser_reduce_product(state);
        }

        var UNARY_LEFT_TERMS = ['Not', 'Pow', 'Mul', 'Div', 'Mod', 'Plus', 'Minus', 'Eq', 'Comma', 'LParen'];

        function parser_reduce_unary_op(state, optional) {
            var left = getTop(state, 2);
            var oper = getTop(state, 1);
            var right = getTop(state, 0);
            var expr = { id: 'Unary' };

            if (oper !== undefined && (oper.id === 'Minus' || oper.id === 'Plus' || oper.id === 'Not') &&
                (left === undefined || UNARY_LEFT_TERMS.indexOf(left.id) !== -1)) {
                expr.op = oper;
                expr.right = right;
                return parser_splice(state, 2, expr);
            }

            if (optional !== false) {
                expr.expr = right;
                return parser_splice(state, 1, expr);
            }
        }

        function parser_reduce_parens(state) {
            var leftleft = getTop(state, 3);
            var left = getTop(state, 2);
            var middle = getTop(state, 1);
            var right = getTop(state, 0);
            var expr = { id: 'Parens' };

            if (right.id === 'RParen') {

                if (middle !== undefined && middle.id === 'LParen') {
                    if (left !== undefined && left.id === 'Var') {
                        expr = { id: 'Call', token: left };
                        return parser_splice(state, 3, expr);
                    }

                    expr = { id: 'OpenTuple' };
                    return parser_splice(state, 2, expr);
                }

                if (left === undefined || left.id !== 'LParen') {
                    var error = { pos: right.pos, text: 'Unmatched paren' };
                    state.error = error;
                    logger.warn('%s at %d', error.text, error.pos);
                    return parser_splice(state, 1);
                }

                if (leftleft !== undefined && leftleft.id === 'Var') {
                    expr = { id: 'Call', token: leftleft, args: middle };
                    return parser_splice(state, 4, expr);
                }

                expr.expr = middle;
                return parser_splice(state, 3, expr);
            }

            expr.expr = right;
            return parser_splice(state, 1, expr);
        }

        function parser_reduce_value(state) {
            var top = getTop(state, 0);
            var expr = {
                id: 'Value',
                token: top,
            };
            state = parser_splice(state, 1, expr);
            if (top.id === 'Var') {
                state.scope[top.value] = top;
            }
            return state;
        }


        function lexer(content) {
            var tokens = [];
            var pos = 0;
            var token, error;
            while ((token = tokenizer(content, pos)) !== undefined) {
                if (token.error) {
                    error = token.error;
                }
                else if (token.id !== 'Space') {
                    tokens.push(token);
                }
                pos = token.end;
            }
            return {
                tokens: tokens,
                error: error
            };
        }

        var Tokens = /^(?:(\s+)|((?:\d+e[-+]?\d+|\d+(?:\.\d*)?|\d*\.\d+))|(\&)|(\|)|(\^\|)|(<<)|(>>)|(>>>)|(\~)|(\+)|(\-)|(\*)|(\/)|(%)|(\^)|(\()|(\))|(=)|(,)|([a-zA-Z]\w*))/i;
        var TokenIds = ['Space', 'Number', 'And', 'Or', 'Xor', 'Lshift', 'Rshift', 'Zrshift', 'Not', 'Plus', 'Minus', 'Mul', 'Div', 'Mod', 'Pow', 'LParen', 'RParen', 'Eq', 'Comma', 'Var'];

        function tokenizer(content, pos) {
            var s = content.slice(pos);
            if (s.length === 0) return;

            var match = Tokens.exec(s);
            if (match === null) {
                var endPos = skipInvalidChars(content, pos);
                var error = { pos: pos, text: 'Unexpected symbol "' + content.slice(pos, endPos) + '"' };
                logger.warn('%s at %d', error.text, error.pos);
                return {
                    error: error,
                    end: endPos
                };
            }

            for (var i = 0, len = TokenIds.length; i < len; i++) {
                var token = match[i + 1];
                if (token !== undefined) {
                    return {
                        id: TokenIds[i],
                        string: token,
                        pos: pos,
                        end: pos + token.length,
                        value: evalToken(TokenIds[i], token)
                    };
                }
            }
        }

        function skipInvalidChars(content, pos) {
            for (var len = content.length; pos < len; pos++) {
                var s = content.slice(pos);
                if (s.length === 0) break;
                var match = Tokens.exec(s);
                if (match !== null) break;
            }
            return pos;
        }

        var parseNumber = Number.parseFloat || parseFloat;

        function evalToken(id, s) {
            if (id === 'Number') {
                return parseNumber(s);
            } else {
                return s;
            }
        }

        return MathExpression;
    })();


    function loadStandardLibrary() {
        var scope = new Scope();
        scope.set('pi', Math.PI);
        scope.set('e', Math.E);
        scope.set('inf', Number.POSITIVE_INFINITY);

        copyFrom(Math, Object.getOwnPropertyNames(Math));

        function copyFrom(obj, names) {
            names.forEach(function (n) { scope.set(n, obj[n]); });
        }

        return scope;
    }

    var StdLib = loadStandardLibrary();

    mathcalc.parse = function (content) {
        return this.parser.parse(content);
    }

    return MathCalc;
})(MathCalc || {});

const _MathCalc = MathCalc;
export { _MathCalc as MathCalc };
