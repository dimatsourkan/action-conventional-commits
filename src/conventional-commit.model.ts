export class ConventionalCommitModel {
    invalid: boolean = false
    breaking: boolean = false
    full: string = ''
    type: string = ''
    scope: string = ''
    message: string = ''
    body: string = ''
    breaking_change: string = ''
    error_message: string = ''

    getShortMessage(): string {
        let msg = ''

        msg += this.type
        if (this.scope !== '') {
            msg += `(${this.scope})`
        }
        if (this.breaking) {
            msg += '!'
        }
        msg += ': '
        msg += this.message

        return msg
    }
}
