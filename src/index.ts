type ShallowUser = {
    user_id: number;
};

type UserComment = {
    post_id: number;
    comment_id: number;
    owner?: ShallowUser;
    reply_to_user?: ShallowUser;
};

type Answer = {
    owner?: ShallowUser;
    last_editor?: ShallowUser;
    answer_id: number;
};

type Question = {
    owner?: ShallowUser;
    last_editor?: ShallowUser;
    question_id: number;
};

type CommonOptions = {
    site?: string;
    page?: number;
    filter: string;
    key: string;
};

type GetQuestionCommentsOptons = CommonOptions;
type GetAnswerCommentsOptions = CommonOptions;

type GetQuestionAnswersOptions = CommonOptions;
type GetQuestionsOptions = CommonOptions;

interface Window {
    StackExchange: typeof StackExchange;
}

((w, d, _s, l) => {
    const API_BASE = "https://api.stackexchange.com";
    const API_VER = 2.3;

    /**
     * @summary delays script execution
     * @param {number} [ms] milliseconds to delay for
     * @returns {Promise<void>}
     */
    const delay = (ms = 100) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

    /**
     * @summary gets a site name to use with the API from Location object
     */
    const getSiteName = ({ hostname }: Location): string =>
        hostname.slice(0, hostname.lastIndexOf("."));

    /**
     * @see https://api.stackexchange.com/docs/comments-on-questions
     *
     * @summary gets question comments from the API
     * @param {number} id question id
     * @param {GetQuestionCommentsOptons} [options] request configuration
     * @returns {Promise<UserComment[]>}
     */
    const getQuestionComments = async (
        id: number,
        { site = "stackoverflow", page = 1, ...rest }: GetQuestionCommentsOptons
    ): Promise<UserComment[]> => {
        const url = new URL(`${API_BASE}/${API_VER}/questions/${id}/comments`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();

        const res = await fetch(url.toString());
        if (!res.ok) return [];

        const { items = [], has_more = false, backoff } = await res.json();

        if (backoff) {
            await delay(backoff * 1e3);
            return getQuestionComments(id, { site, page, ...rest });
        }

        if (has_more) {
            items.push(
                ...(await getQuestionComments(id, {
                    site,
                    page: page + 1,
                    ...rest,
                }))
            );
        }

        return items;
    };

    /**
     * @see https://api.stackexchange.com/docs/comments-on-answers
     *
     * @summary gets answer comments from the API
     * @param {number} id answer id
     * @param {GetAnswerCommentsOptions} [options] request configuration
     * @returns {Promise<UserComment[]>}
     */
    const getAnswerComments = async (
        id: number,
        { site = "stackoverflow", page = 1, ...rest }: GetAnswerCommentsOptions
    ): Promise<UserComment[]> => {
        const url = new URL(`${API_BASE}/${API_VER}/answers/${id}/comments`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();

        const res = await fetch(url.toString());
        if (!res.ok) return [];

        const { items = [], has_more = false, backoff } = await res.json();

        if (backoff) {
            await delay(backoff * 1e3);
            return getAnswerComments(id, { site, page, ...rest });
        }

        if (has_more) {
            items.push(
                ...(await getAnswerComments(id, {
                    site,
                    page: page + 1,
                    ...rest,
                }))
            );
        }

        return items;
    };

    /**
     * @see https://api.stackexchange.com/docs/questions-by-ids
     *
     * @summary gets question info given its id
     * @param {number} id question id
     * @param {GetQuestionAnswersOptions} [options] request configuration
     * @returns {Promise<Question[]>}
     */
    const getQuestions = async (
        id: number,
        { site = "stackoverflow", page = 1, ...rest }: GetQuestionsOptions
    ): Promise<Question[]> => {
        const url = new URL(`${API_BASE}/${API_VER}/questions/${id}`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();

        const res = await fetch(url.toString());
        if (!res.ok) return [];

        const { items = [], has_more = false, backoff } = await res.json();

        if (backoff) {
            await delay(backoff * 1e3);
            return getQuestions(id, { site, page, ...rest });
        }

        if (has_more) {
            items.push(
                ...(await getQuestions(id, {
                    site,
                    page: page + 1,
                    ...rest,
                }))
            );
        }

        return items;
    };

    /**
     * @see https://api.stackexchange.com/docs/answers-on-questions
     *
     * @summary gets answers for a given question
     * @param {number} id question id
     * @param {GetQuestionAnswersOptions} [options] request configuration
     * @returns {Promise<Answer[]>}
     */
    const getQuestionAnswers = async (
        id: number,
        { site = "stackoverflow", page = 1, ...rest }: GetQuestionAnswersOptions
    ): Promise<Answer[]> => {
        const url = new URL(`${API_BASE}/${API_VER}/questions/${id}/answers`);
        url.search = new URLSearchParams({
            site,
            page: page.toString(),
            ...rest,
        }).toString();

        const res = await fetch(url.toString());
        if (!res.ok) return [];

        const { items = [], has_more = false, backoff } = await res.json();

        if (backoff) {
            await delay(backoff * 1e3);
            return getQuestionAnswers(id, { site, page, ...rest });
        }

        if (has_more) {
            items.push(
                ...(await getQuestionAnswers(id, {
                    site,
                    page: page + 1,
                    ...rest,
                }))
            );
        }

        return items;
    };

    class ParticipationInfo {
        constructor(
            public userId: number,
            public questionComments: UserComment[],
            public answerComments: UserComment[],
            public answers: Answer[],
            public questions: Question[]
        ) {}

        get myAnswers() {
            const { answers, userId } = this;
            return answers.filter(({ owner }) => owner?.user_id === userId);
        }

        get myQuestions() {
            const { questions, userId } = this;
            return questions.filter(({ owner }) => owner?.user_id === userId);
        }

        get editedAnswers() {
            const { answers, userId } = this;
            return answers.filter(
                ({ last_editor }) => last_editor?.user_id === userId
            );
        }

        get editedQuestions() {
            const { questions, userId } = this;
            return questions.filter(
                ({ last_editor }) => last_editor?.user_id === userId
            );
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

    /**
     * @summary appends participation info to the question
     * @param {ParticipationInfo} info participation information instance
     * @returns {void}
     */
    const addParticipationInfo = (info: ParticipationInfo): void => {
        const statsRow = d.querySelector("#question-header + div");
        if (!statsRow) return;

        const titleText = "Participated";

        const activityMap: [participated: boolean, label: string][] = [
            [info.hasAnswers, "A"],
            [info.hasQuestions, "Q"],
            [info.hasEditedAnswers, "EA"],
            [info.hasEditedQuestions, "EQ"],
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
            const { StackExchange } =
                typeof unsafeWindow !== "undefined" ? unsafeWindow : w;

            const { userId } = StackExchange.options.user;
            const questionId = StackExchange.question.getQuestionId();
            if (!questionId || !userId) return;

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

            const commentFilter = ({ owner, reply_to_user }: UserComment) =>
                [owner?.user_id, reply_to_user?.user_id].includes(userId);

            const myQuestionComments = questionComments.filter(commentFilter);

            const myAnswerComments = answerComments
                .flat()
                .filter(commentFilter);

            const info = new ParticipationInfo(
                userId,
                myQuestionComments,
                myAnswerComments,
                answers,
                questions
            );

            console.debug(info);

            addParticipationInfo(info);
        } catch (error) {
            console.debug(`Activity Indicator error:\n${error}`);
        }
    });
})(window, document, localStorage, location);
