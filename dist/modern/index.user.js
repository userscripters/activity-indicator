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
// @version         0.1.0
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
    class ParticipationInfo {
        constructor(questionComments, answerComments, answers, questions) {
            this.questionComments = questionComments;
            this.answerComments = answerComments;
            this.answers = answers;
            this.questions = questions;
        }
        get hasAnswers() {
            const { answers } = this;
            return !!answers.length;
        }
        get hasQuestions() {
            const { questions } = this;
            return !!questions.length;
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
            [info.hasAnswers, "A"],
            [info.hasQuestions, "Q"],
            [info.hasAnswerComments, "AC"],
            [info.hasQuestionComments, "QC"],
        ];
        const participated = activityMap.filter(([cond]) => cond);
        const infoText = participated.map(([, l]) => l).join(" ") || "no";
        const item = d.createElement("div");
        item.classList.add("flex--item", "ws-nowrap", "mb8", "ml16");
        item.title = `${titleText}: ${infoText}`;
        const title = d.createElement("span");
        title.classList.add("fc-light", "mr2");
        title.textContent = titleText;
        item.append(title);
        title.after(` ${infoText} `);
        statsRow.append(item);
    };
    w.addEventListener("load", async () => {
        try {
            const { userId } = StackExchange.options.user;
            const questionId = StackExchange.question.getQuestionId();
            if (!questionId || !userId)
                return;
            const site = getSiteName(l);
            const commonOpts = { site, key: "UKKfmybQ9USA0N80jdnU8w((" };
            const questionComments = await getQuestionComments(questionId, {
                ...commonOpts,
                filter: "!--OzlnfZUU0r",
            });
            const questions = await getQuestions(questionId, {
                ...commonOpts,
                filter: "!4(sMnI809OE6Z2KE)",
            });
            const answers = await getQuestionAnswers(questionId, {
                ...commonOpts,
                filter: "!ao-)ijIL.2UJgN",
            });
            const answerCommentsPromises = answers.map(({ answer_id }) => {
                return getAnswerComments(answer_id, {
                    ...commonOpts,
                    filter: "!--OzlnfZUU0r",
                });
            });
            const answerComments = await Promise.all(answerCommentsPromises);
            const commentFilter = ({ owner, reply_to_user }) => [owner === null || owner === void 0 ? void 0 : owner.user_id, reply_to_user === null || reply_to_user === void 0 ? void 0 : reply_to_user.user_id].includes(userId);
            const myQuestionComments = questionComments.filter(commentFilter);
            const myAnswerComments = answerComments
                .flat()
                .filter(commentFilter);
            const postFilter = ({ last_editor, owner }) => [last_editor === null || last_editor === void 0 ? void 0 : last_editor.user_id, owner === null || owner === void 0 ? void 0 : owner.user_id].includes(userId);
            const myAnswers = answers.filter(postFilter);
            const myQuestions = questions.filter(postFilter);
            const info = new ParticipationInfo(myQuestionComments, myAnswerComments, myAnswers, myQuestions);
            console.debug(info);
            addParticipationInfo(info);
        }
        catch (error) {
            console.debug(`Activity Indicator error:\n${error}`);
        }
    });
})(window, document, localStorage, location);
