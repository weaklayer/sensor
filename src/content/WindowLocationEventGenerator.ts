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

import { createWindowLocationEvent, WindowLocationEvent } from '../common/events/WindowLocationEvent'

export class WindowLocationEventGenerator {

    private readonly windowReference: number

    private readonly locationSupplier: () => Location

    private readonly eventConsumer: (e: WindowLocationEvent) => void

    private readonly pollingInterval: number

    private lastLocation: string = ''
    private lastLocationReference: number = 0

    private continue = true

    constructor(windowReference: number, locationSupplier: () => Location, eventConsumer: (e: WindowLocationEvent) => void, pollingInterval: number = 100) {
        this.windowReference = windowReference
        this.locationSupplier = locationSupplier
        this.eventConsumer = eventConsumer
        this.pollingInterval = pollingInterval

        this.onTimer()
        setTimeout(() => this.onTimer(), this.pollingInterval)
    }

    private onTimer(): void {
        const currentLocation = this.locationSupplier().href

        if (currentLocation !== this.lastLocation) {
            this.lastLocation = currentLocation
            const event = createWindowLocationEvent(this.windowReference, () => this.locationSupplier())
            this.lastLocationReference = event.time
            this.eventConsumer(event)
        }

        if (this.continue) {
            setTimeout(() => this.onTimer(), this.pollingInterval)
        }
    }

    getCurrentWindowLocationReference(): number {
        return this.lastLocationReference
    }

    stop(): void {
        this.continue = false
    }

}
