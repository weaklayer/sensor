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

    private events: Array<Event> = new Array<Event>()

    private overallTimeout: number | undefined = undefined

    private immediateTimeout: number | undefined = undefined

    constructor(eventsConsumer: (es: Array<Event>) => Promise<void>) {
        this.eventsConsumer = eventsConsumer
    }

    comsumeEvent(event: Event): void {
        this.events.push(event)

        if (!this.overallTimeout) {
            // Hold onto events for 5s max before sending them off
            this.overallTimeout = window.setTimeout(() => this.processEvents(), 5000)
        }

        if (this.immediateTimeout) {
            window.clearTimeout(this.immediateTimeout)
        }
        // Events can come in 500ms apart and they will get buffered
        this.immediateTimeout = window.setTimeout(() => this.processEvents(), 500)
    }

    private async processEvents(): Promise<void> {
        if (this.overallTimeout) {
            window.clearTimeout(this.overallTimeout)
            this.overallTimeout = undefined
        }

        if (this.immediateTimeout) {
            window.clearTimeout(this.immediateTimeout)
            this.immediateTimeout = undefined
        }

        const eventsCapture = this.events
        this.events = new Array<Event>()

        return this.eventsConsumer(eventsCapture)
    }
}
