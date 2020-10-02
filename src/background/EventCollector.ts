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

    private readonly maxBufferSize: number

    private events: Array<Event> = new Array<Event>()

    private overallTimer: number | undefined = undefined

    private immediateTimer: number | undefined = undefined

    constructor(eventsConsumer: (es: Array<Event>) => Promise<void>, overallTimeout: number = 10000, immediateTimeout: number = 1000, maxBufferSize: number = 10000) {
        this.eventsConsumer = eventsConsumer
        this.overallTimeout = overallTimeout
        this.immediateTimeout = immediateTimeout
        this.maxBufferSize = maxBufferSize
    }

    consumeEvents(events: Array<Event>, w: WindowOrWorkerGlobalScope = window): void {

        this.events.push(...events)

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

        let eventsCapture = this.events
        this.events = new Array<Event>()
        try {
            await this.eventsConsumer(eventsCapture)
        } catch (e) {
            console.warn('Failed submitting events to gateway. Will retry soon.', e)
            if (eventsCapture.length > this.maxBufferSize) {
                // Throw out oldest events to get us down to the max buffer size
                eventsCapture = eventsCapture.slice(eventsCapture.length - this.maxBufferSize)
            }
            // 1) append to this.events (instead on assigning) as it could have been added to already during the above await
            // 2) append instead of calling consumeEvents so we dont queue up another immediate submission attempt
            this.events.push(...eventsCapture)
        }
    }
}
