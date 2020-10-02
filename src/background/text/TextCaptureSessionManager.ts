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

import { TextCaptureSession } from "./TextCaptureSession"
import { TextCaptureEvent } from "../../common/events/internal/TextCaptureEvent"

export class TextCaptureSessionManager {

    private readonly sessionTimers: Map<number, number> = new Map<number, number>()
    private readonly globalTimers: Map<number, number> = new Map<number, number>()
    private readonly sessions: Map<number, TextCaptureSession> = new Map<number, TextCaptureSession>()

    private readonly sessionTimeoutMillis: number
    private readonly maxSessionLengthMillis: number
    private readonly interestingCaptureConsumer: (interestingCaptures: Array<TextCaptureEvent>) => Promise<void>

    constructor(sessionTimeoutMillis: number, maxSessionLengthMillis: number,
        interestingCaptureConsumer: (interestingCaptures: Array<TextCaptureEvent>) => Promise<void>) {
        this.interestingCaptureConsumer = interestingCaptureConsumer
        this.sessionTimeoutMillis = sessionTimeoutMillis
        this.maxSessionLengthMillis = maxSessionLengthMillis
    }

    trackTextCapture(event: TextCaptureEvent): void {
        const sessionId: number = event.elementReference

        let session: TextCaptureSession | undefined = this.sessions.get(sessionId)
        if (!session) {
            session = new TextCaptureSession()
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

        session.trackTextCapture(event)
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

        let session: TextCaptureSession | undefined = this.sessions.get(sessionId)
        if (session) {
            this.sessions.delete(sessionId)
            const captures = session.getInterestingTextCaptures()
            this.interestingCaptureConsumer(captures)
        }
    }
}
