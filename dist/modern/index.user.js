// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     Adds a user activity indicator to posts
// @grant           none
// @homepage        https://github.com/userscripters/activity-indicator#readme
// @match           https://*.stackexchange.com/questions/*
// @match           https://askubuntu.com/questions/*
// @match           https://es.stackoverflow.com/questions/*
// @match           https://ja.stackoverflow.com/questions/*
// @match           https://mathoverflow.net/questions/*
// @match           https://pt.stackoverflow.com/questions/*
// @match           https://ru.stackoverflow.com/questions/*
// @match           https://serverfault.com/questions/*
// @match           https://stackapps.com/questions/*
// @match           https://stackoverflow.com/questions/*
// @match           https://superuser.com/questions/*
// @name            Activity Indicator
// @namespace       userscripters
// @run-at          document-start
// @source          git+https://github.com/userscripters/activity-indicator.git
// @supportURL      https://github.com/userscripters/activity-indicator/issues
// @version         1.2.1
// ==/UserScript==

"use strict";
((w, d, _s, l) => {
    const API_BASE = "https://api.stackexchange.com";
    const API_VER = 2.3;
    const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));
    const getSiteName = ({ hostname }) => hostname.slice(0, hostname.lastIndexOf("."));
    const getQuestionComments = async (id, { site = "stackoverflow", page = 1, ...rest }) => {
        const url = new URL(`${API_BASE}/${API_VER}/questions/${id}/comments`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();
        const res = await fetch(url.toString());
        if (!res.ok)
            return [];
        const { items = [], has_more = false, backoff } = await res.json();
        if (backoff) {
            await delay(backoff * 1e3);
            return getQuestionComments(id, { site, page, ...rest });
        }
        if (has_more) {
            items.push(...(await getQuestionComments(id, {
                site,
                page: page + 1,
                ...rest,
            })));
        }
        return items;
    };
    const getAnswerComments = async (id, { site = "stackoverflow", page = 1, ...rest }) => {
        const url = new URL(`${API_BASE}/${API_VER}/answers/${id}/comments`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();
        const res = await fetch(url.toString());
        if (!res.ok)
            return [];
        const { items = [], has_more = false, backoff } = await res.json();
        if (backoff) {
            await delay(backoff * 1e3);
            return getAnswerComments(id, { site, page, ...rest });
        }
        if (has_more) {
            items.push(...(await getAnswerComments(id, {
                site,
                page: page + 1,
                ...rest,
            })));
        }
        return items;
    };
    const getQuestions = async (id, { site = "stackoverflow", page = 1, ...rest }) => {
        const url = new URL(`${API_BASE}/${API_VER}/questions/${id}`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();
        const res = await fetch(url.toString());
        if (!res.ok)
            return [];
        const { items = [], has_more = false, backoff } = await res.json();
        if (backoff) {
            await delay(backoff * 1e3);
            return getQuestions(id, { site, page, ...rest });
        }
        if (has_more) {
            items.push(...(await getQuestions(id, {
                site,
                page: page + 1,
                ...rest,
            })));
        }
        return items;
    };
    const getQuestionAnswers = async (id, { site = "stackoverflow", page = 1, ...rest }) => {
        const url = new URL(`${API_BASE}/${API_VER}/questions/${id}/answers`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();
        const res = await fetch(url.toString());
        if (!res.ok)
            return [];
        const { items = [], has_more = false, backoff } = await res.json();
        if (backoff) {
            await delay(backoff * 1e3);
            return getQuestionAnswers(id, { site, page, ...rest });
        }
        if (has_more) {
            items.push(...(await getQuestionAnswers(id, {
                site,
                page: page + 1,
                ...rest,
            })));
        }
        return items;
    };
    const getLastLink = (activities, key) => {
        let l;
        activities.forEach((a) => ((l === null || l === void 0 ? void 0 : l[key]) || 0) < a[key] && (l = a));
        return (l === null || l === void 0 ? void 0 : l.link) || "";
    };
    class ParticipationInfo {
        constructor(userId, questionComments, answerComments, answers, questions) {
            this.userId = userId;
            this.questionComments = questionComments;
            this.answerComments = answerComments;
            this.answers = answers;
            this.questions = questions;
        }
        get lastEditedAnswerLink() {
            const { editedAnswers } = this;
            return getLastLink(editedAnswers, "last_activity_date");
        }
        get lastEditedQuestionLink() {
            const { editedQuestions } = this;
            return getLastLink(editedQuestions, "last_activity_date");
        }
        get lastAnswerLink() {
            const { myAnswers } = this;
            return getLastLink(myAnswers, "creation_date");
        }
        get lastQuestionLink() {
            const { myQuestions } = this;
            return getLastLink(myQuestions, "creation_date");
        }
        get lastAnswerComment() {
            const { answerComments } = this;
            return getLastLink(answerComments, "creation_date");
        }
        get lastQuestionComment() {
            const { questionComments } = this;
            return getLastLink(questionComments, "creation_date");
        }
        get myAnswers() {
            const { answers, userId } = this;
            return answers.filter(({ owner }) => (owner === null || owner === void 0 ? void 0 : owner.user_id) === userId);
        }
        get myQuestions() {
            const { questions, userId } = this;
            return questions.filter(({ owner }) => (owner === null || owner === void 0 ? void 0 : owner.user_id) === userId);
        }
        get editedAnswers() {
            const { answers, userId } = this;
            return answers.filter(({ last_editor }) => (last_editor === null || last_editor === void 0 ? void 0 : last_editor.user_id) === userId);
        }
        get editedQuestions() {
            const { questions, userId } = this;
            return questions.filter(({ last_editor }) => (last_editor === null || last_editor === void 0 ? void 0 : last_editor.user_id) === userId);
        }
        get hasAnswers() {
            const { myAnswers } = this;
            return !!myAnswers.length;
        }
        get hasQuestions() {
            const { myQuestions } = this;
            return !!myQuestions.length;
        }
        get hasEditedAnswers() {
            const { editedAnswers } = this;
            return !!editedAnswers.length;
        }
        get hasEditedQuestions() {
            const { editedQuestions } = this;
            return !!editedQuestions.length;
        }
        get hasQuestionComments() {
            const { questionComments } = this;
            return !!questionComments.length;
        }
        get hasAnswerComments() {
            const { answerComments } = this;
            return !!answerComments.length;
        }
    }
    const addParticipationInfo = (info) => {
        const statsRow = d.querySelector("#question-header + div");
        if (!statsRow)
            return;
        const titleText = "Participated";
        const activityMap = [
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
        const participated = activityMap.filter(([cond]) => cond);
        const infoNodes = participated.map(([, short, long, url]) => {
            const link = d.createElement("a");
            link.title = long;
            link.textContent = short;
            link.classList.add("mr4");
            link.href = url || "#!";
            return link;
        });
        const infoText = participated.map(([, s]) => s).join(" ") || "no";
        if (!infoNodes.length)
            infoNodes.push(d.createTextNode("no"));
        const item = d.createElement("div");
        item.classList.add("flex--item", "ws-nowrap", "mb8", "ml16");
        item.title = `${titleText}: ${infoText}`;
        const title = d.createElement("span");
        title.classList.add("fc-light", "mr4");
        title.textContent = titleText;
        item.append(title);
        title.after(...infoNodes);
        statsRow.append(item);
    };
    w.addEventListener("load", async () => {
        try {
            const { StackExchange } = typeof unsafeWindow !== "undefined" ? unsafeWindow : w;
            const { userId } = StackExchange.options.user;
            const questionId = StackExchange.question.getQuestionId();
            if (!questionId || !userId)
                return;
            const site = getSiteName(l);
            const commonOpts = { site, key: "UKKfmybQ9USA0N80jdnU8w((" };
            const questionComments = await getQuestionComments(questionId, {
                ...commonOpts,
                filter: "!4(lY7*xuE9Z8LL)8k",
            });
            const questions = await getQuestions(questionId, {
                ...commonOpts,
                filter: "!LaSREm6B5Ji4nnR50YM1t4",
            });
            const answers = await getQuestionAnswers(questionId, {
                ...commonOpts,
                filter: "!)qTDdy3rflMDTMhEvVdZ",
            });
            const answerCommentsPromises = answers.map(({ answer_id }) => {
                return getAnswerComments(answer_id, {
                    ...commonOpts,
                    filter: "!4(lY7*xuE9Z8LL)8k",
                });
            });
            const answerComments = await Promise.all(answerCommentsPromises);
            const commentFilter = ({ owner, reply_to_user, }) => [owner === null || owner === void 0 ? void 0 : owner.user_id, reply_to_user === null || reply_to_user === void 0 ? void 0 : reply_to_user.user_id].includes(userId);
            const myQuestionComments = questionComments.filter(commentFilter);
            const myAnswerComments = answerComments
                .flat()
                .filter(commentFilter);
            const info = new ParticipationInfo(userId, myQuestionComments, myAnswerComments, answers, questions);
            console.debug(ParticipationInfo.name, info);
            addParticipationInfo(info);
        }
        catch (error) {
            console.debug(`Activity Indicator error:\n${error}`);
        }
    });
})(window, document, localStorage, location);
