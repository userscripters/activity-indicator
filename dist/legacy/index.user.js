// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     Adds a user activity indicator to posts
// @grant           none
// @homepage        https://github.com/userscripters/activity-indicator#readme
// @match           https://*.askubuntu.com/*
// @match           https://*.mathoverflow.net/*
// @match           https://*.serverfault.com/*
// @match           https://*.stackapps.com/*
// @match           https://*.stackexchange.com/*
// @match           https://*.stackoverflow.com/*
// @name            Activity Indicator
// @namespace       userscripters
// @run-at          document-start
// @source          git+https://github.com/userscripters/activity-indicator.git
// @supportURL      https://github.com/userscripters/activity-indicator/issues
// @version         1.1.1
// ==/UserScript==

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function (w, d, _s, l) {
    var API_BASE = "https://api.stackexchange.com";
    var API_VER = 2.3;
    var delay = function (ms) {
        if (ms === void 0) { ms = 100; }
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    var getSiteName = function (_a) {
        var hostname = _a.hostname;
        return hostname.slice(0, hostname.lastIndexOf("."));
    };
    var getQuestionComments = function (id, _a) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res, _b, _c, items, _d, has_more, backoff, _e, _f, _g, _h;
        var _j = _a.site, site = _j === void 0 ? "stackoverflow" : _j, _k = _a.page, page = _k === void 0 ? 1 : _k, rest = __rest(_a, ["site", "page"]);
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    url = new URL(API_BASE + "/" + API_VER + "/questions/" + id + "/comments");
                    url.search = new URLSearchParams(__assign({ site: site, page: page.toString() }, rest)).toString();
                    return [4, fetch(url.toString())];
                case 1:
                    res = _l.sent();
                    if (!res.ok)
                        return [2, []];
                    return [4, res.json()];
                case 2:
                    _b = _l.sent(), _c = _b.items, items = _c === void 0 ? [] : _c, _d = _b.has_more, has_more = _d === void 0 ? false : _d, backoff = _b.backoff;
                    if (!backoff) return [3, 4];
                    return [4, delay(backoff * 1e3)];
                case 3:
                    _l.sent();
                    return [2, getQuestionComments(id, __assign({ site: site, page: page }, rest))];
                case 4:
                    if (!has_more) return [3, 6];
                    _f = (_e = items.push).apply;
                    _g = [items];
                    _h = [[]];
                    return [4, getQuestionComments(id, __assign({ site: site, page: page + 1 }, rest))];
                case 5:
                    _f.apply(_e, _g.concat([__spreadArray.apply(void 0, _h.concat([__read.apply(void 0, [(_l.sent())]), false]))]));
                    _l.label = 6;
                case 6: return [2, items];
            }
        });
    }); };
    var getAnswerComments = function (id, _a) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res, _b, _c, items, _d, has_more, backoff, _e, _f, _g, _h;
        var _j = _a.site, site = _j === void 0 ? "stackoverflow" : _j, _k = _a.page, page = _k === void 0 ? 1 : _k, rest = __rest(_a, ["site", "page"]);
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    url = new URL(API_BASE + "/" + API_VER + "/answers/" + id + "/comments");
                    url.search = new URLSearchParams(__assign({ site: site, page: page.toString() }, rest)).toString();
                    return [4, fetch(url.toString())];
                case 1:
                    res = _l.sent();
                    if (!res.ok)
                        return [2, []];
                    return [4, res.json()];
                case 2:
                    _b = _l.sent(), _c = _b.items, items = _c === void 0 ? [] : _c, _d = _b.has_more, has_more = _d === void 0 ? false : _d, backoff = _b.backoff;
                    if (!backoff) return [3, 4];
                    return [4, delay(backoff * 1e3)];
                case 3:
                    _l.sent();
                    return [2, getAnswerComments(id, __assign({ site: site, page: page }, rest))];
                case 4:
                    if (!has_more) return [3, 6];
                    _f = (_e = items.push).apply;
                    _g = [items];
                    _h = [[]];
                    return [4, getAnswerComments(id, __assign({ site: site, page: page + 1 }, rest))];
                case 5:
                    _f.apply(_e, _g.concat([__spreadArray.apply(void 0, _h.concat([__read.apply(void 0, [(_l.sent())]), false]))]));
                    _l.label = 6;
                case 6: return [2, items];
            }
        });
    }); };
    var getQuestions = function (id, _a) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res, _b, _c, items, _d, has_more, backoff, _e, _f, _g, _h;
        var _j = _a.site, site = _j === void 0 ? "stackoverflow" : _j, _k = _a.page, page = _k === void 0 ? 1 : _k, rest = __rest(_a, ["site", "page"]);
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    url = new URL(API_BASE + "/" + API_VER + "/questions/" + id);
                    url.search = new URLSearchParams(__assign({ site: site, page: page.toString() }, rest)).toString();
                    return [4, fetch(url.toString())];
                case 1:
                    res = _l.sent();
                    if (!res.ok)
                        return [2, []];
                    return [4, res.json()];
                case 2:
                    _b = _l.sent(), _c = _b.items, items = _c === void 0 ? [] : _c, _d = _b.has_more, has_more = _d === void 0 ? false : _d, backoff = _b.backoff;
                    if (!backoff) return [3, 4];
                    return [4, delay(backoff * 1e3)];
                case 3:
                    _l.sent();
                    return [2, getQuestions(id, __assign({ site: site, page: page }, rest))];
                case 4:
                    if (!has_more) return [3, 6];
                    _f = (_e = items.push).apply;
                    _g = [items];
                    _h = [[]];
                    return [4, getQuestions(id, __assign({ site: site, page: page + 1 }, rest))];
                case 5:
                    _f.apply(_e, _g.concat([__spreadArray.apply(void 0, _h.concat([__read.apply(void 0, [(_l.sent())]), false]))]));
                    _l.label = 6;
                case 6: return [2, items];
            }
        });
    }); };
    var getQuestionAnswers = function (id, _a) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res, _b, _c, items, _d, has_more, backoff, _e, _f, _g, _h;
        var _j = _a.site, site = _j === void 0 ? "stackoverflow" : _j, _k = _a.page, page = _k === void 0 ? 1 : _k, rest = __rest(_a, ["site", "page"]);
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    url = new URL(API_BASE + "/" + API_VER + "/questions/" + id + "/answers");
                    url.search = new URLSearchParams(__assign({ site: site, page: page.toString() }, rest)).toString();
                    return [4, fetch(url.toString())];
                case 1:
                    res = _l.sent();
                    if (!res.ok)
                        return [2, []];
                    return [4, res.json()];
                case 2:
                    _b = _l.sent(), _c = _b.items, items = _c === void 0 ? [] : _c, _d = _b.has_more, has_more = _d === void 0 ? false : _d, backoff = _b.backoff;
                    if (!backoff) return [3, 4];
                    return [4, delay(backoff * 1e3)];
                case 3:
                    _l.sent();
                    return [2, getQuestionAnswers(id, __assign({ site: site, page: page }, rest))];
                case 4:
                    if (!has_more) return [3, 6];
                    _f = (_e = items.push).apply;
                    _g = [items];
                    _h = [[]];
                    return [4, getQuestionAnswers(id, __assign({ site: site, page: page + 1 }, rest))];
                case 5:
                    _f.apply(_e, _g.concat([__spreadArray.apply(void 0, _h.concat([__read.apply(void 0, [(_l.sent())]), false]))]));
                    _l.label = 6;
                case 6: return [2, items];
            }
        });
    }); };
    var getLastLink = function (activities, key) {
        var l;
        activities.forEach(function (a) { return ((l === null || l === void 0 ? void 0 : l[key]) || 0) < a[key] && (l = a); });
        return (l === null || l === void 0 ? void 0 : l.link) || "";
    };
    var ParticipationInfo = (function () {
        function ParticipationInfo(userId, questionComments, answerComments, answers, questions) {
            this.userId = userId;
            this.questionComments = questionComments;
            this.answerComments = answerComments;
            this.answers = answers;
            this.questions = questions;
        }
        Object.defineProperty(ParticipationInfo.prototype, "lastEditedAnswerLink", {
            get: function () {
                var editedAnswers = this.editedAnswers;
                return getLastLink(editedAnswers, "last_activity_date");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "lastEditedQuestionLink", {
            get: function () {
                var editedQuestions = this.editedQuestions;
                return getLastLink(editedQuestions, "last_activity_date");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "lastAnswerLink", {
            get: function () {
                var myAnswers = this.myAnswers;
                return getLastLink(myAnswers, "creation_date");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "lastQuestionLink", {
            get: function () {
                var myQuestions = this.myQuestions;
                return getLastLink(myQuestions, "creation_date");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "lastAnswerComment", {
            get: function () {
                var answerComments = this.answerComments;
                return getLastLink(answerComments, "creation_date");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "lastQuestionComment", {
            get: function () {
                var questionComments = this.questionComments;
                return getLastLink(questionComments, "creation_date");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "myAnswers", {
            get: function () {
                var _a = this, answers = _a.answers, userId = _a.userId;
                return answers.filter(function (_a) {
                    var owner = _a.owner;
                    return (owner === null || owner === void 0 ? void 0 : owner.user_id) === userId;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "myQuestions", {
            get: function () {
                var _a = this, questions = _a.questions, userId = _a.userId;
                return questions.filter(function (_a) {
                    var owner = _a.owner;
                    return (owner === null || owner === void 0 ? void 0 : owner.user_id) === userId;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "editedAnswers", {
            get: function () {
                var _a = this, answers = _a.answers, userId = _a.userId;
                return answers.filter(function (_a) {
                    var last_editor = _a.last_editor;
                    return (last_editor === null || last_editor === void 0 ? void 0 : last_editor.user_id) === userId;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "editedQuestions", {
            get: function () {
                var _a = this, questions = _a.questions, userId = _a.userId;
                return questions.filter(function (_a) {
                    var last_editor = _a.last_editor;
                    return (last_editor === null || last_editor === void 0 ? void 0 : last_editor.user_id) === userId;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "hasAnswers", {
            get: function () {
                var myAnswers = this.myAnswers;
                return !!myAnswers.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "hasQuestions", {
            get: function () {
                var myQuestions = this.myQuestions;
                return !!myQuestions.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "hasEditedAnswers", {
            get: function () {
                var editedAnswers = this.editedAnswers;
                return !!editedAnswers.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "hasEditedQuestions", {
            get: function () {
                var editedQuestions = this.editedQuestions;
                return !!editedQuestions.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "hasQuestionComments", {
            get: function () {
                var questionComments = this.questionComments;
                return !!questionComments.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ParticipationInfo.prototype, "hasAnswerComments", {
            get: function () {
                var answerComments = this.answerComments;
                return !!answerComments.length;
            },
            enumerable: false,
            configurable: true
        });
        return ParticipationInfo;
    }());
    var addParticipationInfo = function (info) {
        var statsRow = d.querySelector("#question-header + div");
        if (!statsRow)
            return;
        var titleText = "Participated";
        var activityMap = [
            [info.hasAnswers, "A", "Answered", info.lastAnswerLink],
            [info.hasQuestions, "Q", "Asked", info.lastQuestionLink],
            [
                info.hasEditedAnswers,
                "EA",
                "Edited an Answer",
                info.lastEditedAnswerLink,
            ],
            [
                info.hasEditedQuestions,
                "EQ",
                "Edited the Question",
                info.lastEditedQuestionLink,
            ],
            [
                info.hasAnswerComments,
                "AC",
                "Commented on an Answer",
                info.lastAnswerComment,
            ],
            [
                info.hasQuestionComments,
                "QC",
                "Commented on the Question",
                info.lastQuestionComment,
            ],
        ];
        var participated = activityMap.filter(function (_a) {
            var _b = __read(_a, 1), cond = _b[0];
            return cond;
        });
        var infoNodes = participated.map(function (_a) {
            var _b = __read(_a, 4), short = _b[1], long = _b[2], url = _b[3];
            var link = d.createElement("a");
            link.title = long;
            link.textContent = short;
            link.classList.add("mr4");
            link.href = url || "#!";
            return link;
        });
        var infoText = participated.map(function (_a) {
            var _b = __read(_a, 2), s = _b[1];
            return s;
        }).join(" ") || "no";
        if (!infoNodes.length)
            infoNodes.push(d.createTextNode("no"));
        var item = d.createElement("div");
        item.classList.add("flex--item", "ws-nowrap", "mb8", "ml16");
        item.title = titleText + ": " + infoText;
        var title = d.createElement("span");
        title.classList.add("fc-light", "mr4");
        title.textContent = titleText;
        item.append(title);
        title.after.apply(title, __spreadArray([], __read(infoNodes), false));
        statsRow.append(item);
    };
    w.addEventListener("load", function () { return __awaiter(void 0, void 0, void 0, function () {
        var StackExchange_1, userId_1, questionId, site, commonOpts_1, questionComments, questions, answers, answerCommentsPromises, answerComments, commentFilter, myQuestionComments, myAnswerComments, info, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    StackExchange_1 = (typeof unsafeWindow !== "undefined" ? unsafeWindow : w).StackExchange;
                    userId_1 = StackExchange_1.options.user.userId;
                    questionId = StackExchange_1.question.getQuestionId();
                    if (!questionId || !userId_1)
                        return [2];
                    site = getSiteName(l);
                    commonOpts_1 = { site: site, key: "UKKfmybQ9USA0N80jdnU8w((" };
                    return [4, getQuestionComments(questionId, __assign(__assign({}, commonOpts_1), { filter: "!4(lY7*xuE9Z8LL)8k" }))];
                case 1:
                    questionComments = _a.sent();
                    return [4, getQuestions(questionId, __assign(__assign({}, commonOpts_1), { filter: "!)riR70zjunod1jgz8OB8" }))];
                case 2:
                    questions = _a.sent();
                    return [4, getQuestionAnswers(questionId, __assign(__assign({}, commonOpts_1), { filter: "!)qTDdy3rflMDTMhEvVdZ" }))];
                case 3:
                    answers = _a.sent();
                    answerCommentsPromises = answers.map(function (_a) {
                        var answer_id = _a.answer_id;
                        return getAnswerComments(answer_id, __assign(__assign({}, commonOpts_1), { filter: "!4(lY7*xuE9Z8LL)8k" }));
                    });
                    return [4, Promise.all(answerCommentsPromises)];
                case 4:
                    answerComments = _a.sent();
                    commentFilter = function (_a) {
                        var owner = _a.owner, reply_to_user = _a.reply_to_user;
                        return [owner === null || owner === void 0 ? void 0 : owner.user_id, reply_to_user === null || reply_to_user === void 0 ? void 0 : reply_to_user.user_id].includes(userId_1);
                    };
                    myQuestionComments = questionComments.filter(commentFilter);
                    myAnswerComments = answerComments
                        .flat()
                        .filter(commentFilter);
                    info = new ParticipationInfo(userId_1, myQuestionComments, myAnswerComments, answers, questions);
                    console.debug(info);
                    addParticipationInfo(info);
                    return [3, 6];
                case 5:
                    error_1 = _a.sent();
                    console.debug("Activity Indicator error:\n" + error_1);
                    return [3, 6];
                case 6: return [2];
            }
        });
    }); });
})(window, document, localStorage, location);
