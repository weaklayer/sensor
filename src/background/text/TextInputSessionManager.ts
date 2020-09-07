// SPDX-License-Identifier: AGPL-3.0-or-later

// Copyright (C) 2020 Mitchell Wasson

// This file is part of Weaklayer Sensor.

// Weaklayer Sensor is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { TextInputSession } from "./TextInputSession"
import { TextInputEvent } from '../../common/events/TextInputEvent'

export class TextInputSessionManager {

    private readonly sessionTimers: Map<number, number> = new Map<number, number>()
    private readonly globalTimers: Map<number, number> = new Map<number, number>()
    private readonly sessions: Map<number, TextInputSession> = new Map<number, TextInputSession>()

    private readonly sessionTimeoutMillis: number
    private readonly maxSessionLengthMillis: number
    private readonly interestingInputConsumer: (interestingInputs: Array<TextInputEvent>) => Promise<void>

    constructor(sessionTimeoutMillis: number, maxSessionLengthMillis: number,
        interestingInputConsumer: (interestingInputs: Array<TextInputEvent>) => Promise<void>) {
        this.interestingInputConsumer = interestingInputConsumer
        this.sessionTimeoutMillis = sessionTimeoutMillis
        this.maxSessionLengthMillis = maxSessionLengthMillis
    }

    trackTextInput(event: TextInputEvent): void {
        if (!(event.inputElementReference)) {
            console.warn("Received TextInput event from content script without inputElementReference field")
            return
        }
        const sessionId: number = event.inputElementReference

        let session: TextInputSession | undefined = this.sessions.get(sessionId)
        if (!session) {
            session = new TextInputSession()
            this.sessions.set(sessionId, session)
        }

        let sessionTimer: number | undefined = this.sessionTimers.get(sessionId)
        if (sessionTimer) {
            window.clearTimeout(sessionTimer)
        }
        this.sessionTimers.set(sessionId, window.setTimeout(() => this.processSession(sessionId), this.sessionTimeoutMillis))

        let globalTimer: number | undefined = this.globalTimers.get(sessionId)
        if (!globalTimer) {
            this.globalTimers.set(sessionId, window.setTimeout(() => this.processSession(sessionId), this.maxSessionLengthMillis))
        }

        session.trackTextInput(event)
    }

    private processSession(sessionId: number): void {
        let sessionTimer: number | undefined = this.sessionTimers.get(sessionId)
        if (sessionTimer) {
            window.clearTimeout(sessionTimer)
            this.sessionTimers.delete(sessionId)
        }

        let globalTimer: number | undefined = this.globalTimers.get(sessionId)
        if (globalTimer) {
            window.clearTimeout(globalTimer)
            this.globalTimers.delete(sessionId)
        }

        let session: TextInputSession | undefined = this.sessions.get(sessionId)
        if (session) {
            this.interestingInputConsumer(session.getInterestingTextInputs())
            this.sessions.delete(sessionId)
        }
    }
}
