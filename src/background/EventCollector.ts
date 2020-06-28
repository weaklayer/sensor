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

import { Event } from '../common/events/Event'

export class EventCollector {

    private readonly eventsConsumer: (es: Array<Event>) => Promise<void>

    private readonly overallTimeout: number

    private readonly immediateTimeout: number

    private events: Array<Event> = new Array<Event>()

    private overallTimer: number | undefined = undefined

    private immediateTimer: number | undefined = undefined

    constructor(eventsConsumer: (es: Array<Event>) => Promise<void>, overallTimeout: number = 5000, immediateTimeout: number = 500) {
        this.eventsConsumer = eventsConsumer
        this.overallTimeout = overallTimeout
        this.immediateTimeout = immediateTimeout
    }

    comsumeEvent(event: Event, w: WindowOrWorkerGlobalScope = window): void {
        this.events.push(event)

        if (!this.overallTimer) {
            // Hold onto events for 5s max before sending them off
            this.overallTimer = w.setTimeout(() => this.processEvents(w), this.overallTimeout)
        }

        if (this.immediateTimer) {
            w.clearTimeout(this.immediateTimer)
        }
        // Events can come in 500ms apart and they will get buffered
        this.immediateTimer = w.setTimeout(() => this.processEvents(w), this.immediateTimeout)
    }

    private async processEvents(w: WindowOrWorkerGlobalScope): Promise<void> {
        if (this.overallTimer) {
            w.clearTimeout(this.overallTimer)
            this.overallTimer = undefined
        }

        if (this.immediateTimer) {
            w.clearTimeout(this.immediateTimer)
            this.immediateTimer = undefined
        }

        const eventsCapture = this.events
        this.events = new Array<Event>()

        return this.eventsConsumer(eventsCapture)
    }
}
