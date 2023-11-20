import {ConventionalCommitModel} from "./conventional-commit.model";

const regex_conventionalcommit_breaking_change = new RegExp(
    `(?<body>[\\s\\S]*)?BREAKING CHANGE: (?<breakingchange>[\\s\\S]*)`
)

const messageExample = (scopeRequired?: boolean, scopes = "scope") => {
    const scopeString = `(${scopes})`;
    return `feat${scopeRequired ? scopeString : ''}: message text`;
}

export function checkCommit(
    commit_msg: string,
    types: string,
    requestedScopes: string,
    scopeRequired?: boolean
): ConventionalCommitModel {
    const scopes = requestedScopes === "*" ? ".*" : requestedScopes;
    const regexConventionalCommit = new RegExp(
        `^(?:(?<type>(${types}))(?:\\((?<scope>${scopes})\\))?(?<breaking>!?): (?<message>.*)?)` +
        `\\n?` +
        `(?<body>[\\S\\s]+)?$`
    )

    const c = new ConventionalCommitModel()

    c.full = commit_msg

    const result = regexConventionalCommit.exec(commit_msg)

    if (result == null) {
        c.error_message = requestedScopes === "*"
            ? `Invalid message format. Correct Example: '${messageExample(scopeRequired)}'`
            : `Invalid message format. Correct Example: '${messageExample(true, requestedScopes)}'`
        c.invalid = true
        return c
    }

    if (scopeRequired && result?.groups?.scope === undefined) {
        const type = result?.groups?.type;
        const message = result?.groups?.message;
        c.error_message = `Scope is required. Example: '${messageExample(scopeRequired, requestedScopes)}'`;
        c.invalid = true;
        return c
    }

    if (result?.groups?.scope !== undefined) {
        c.scope = String(result?.groups?.scope).trim()
    }

    if (result?.groups?.type !== undefined) {
        c.type = String(result?.groups?.type).trim()
    }

    if (result?.groups?.breaking !== '') {
        c.breaking = true
    }

    if (result?.groups?.message !== undefined) {
        c.message = String(result?.groups?.message).trim()
    }

    if (result?.groups?.body !== undefined) {
        c.body = String(result?.groups?.body).trim()
    }

    if (c.body.includes('BREAKING CHANGE:')) {
        c.breaking = true

        const result_breaking_change =
            regex_conventionalcommit_breaking_change.exec(c.body)
        c.body = String(result_breaking_change?.groups?.body).trim()
        c.breaking_change = String(
            result_breaking_change?.groups?.breakingchange
        ).trim()
    }

    return c
}
