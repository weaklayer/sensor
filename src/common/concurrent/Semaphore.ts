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

export class Semaphore {

    private signalResolver: (() => void) | undefined = undefined
    private readonly signal: Promise<void>

    constructor() {
        this.signal = new Promise(resolver => {
            this.signalResolver = resolver
        })
    }

    setSignal(): void {
        if (this.signalResolver) {
            this.signalResolver()
        } else {
            // we shouldn't ever end up in here
            // if we do then we can't ever really set the signal
            // since we didn't capture the resolver

            // the resolver should capture at some point though
            new Promise(resolve => setTimeout(resolve, 5000)).then(() => {
                if (this.signalResolver) {
                    this.signalResolver()
                } else {
                    console.error('Failed to set semaphore signal after 5 second wait.')
                }
            })

            console.error('Failed to resolve semaphore signal as the promise resolver was not captured. Will attempt to resolve again in 5 seconds.')
        }
    }

    getSignal(): Promise<void> {
        return this.signal
    }
}
