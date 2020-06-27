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

import { windowEventType, isWindowEvent, normalizeWindowEvent } from '../common/events/WindowEvent'
import { windowLocationEventType, isWindowLocationEvent, normalizeWindowLocationEvent } from '../common/events/WindowLocationEvent'
import { Event, isEvent } from '../common/events/Event'

export class BackgroundHub {

    private readonly eventHandler: (e: Event) => void

    private readonly verifierMap: Map<string, (e: Event) => boolean>
    private readonly normalizerMap: Map<string, (e: Event) => Event>

    constructor(eventHandler: (e: Event) => void) {
        browser.runtime.onConnect.addListener((p) => this.wirePort(p))

        this.eventHandler = eventHandler

        const vMap = new Map<string, (e: Event) => boolean>()
        vMap.set(windowEventType, (e: any) => isWindowEvent(e))
        vMap.set(windowLocationEventType, (e: any) => isWindowLocationEvent(e))
        this.verifierMap = vMap

        const nMap = new Map<string, (e: Event) => Event>()
        nMap.set
        nMap.set(windowEventType, (e: any) => normalizeWindowEvent(e))
        nMap.set(windowLocationEventType, (e: any) => normalizeWindowLocationEvent(e))
        this.normalizerMap = nMap
    }

    private wirePort(port: browser.runtime.Port): void {
        if (port.name === "EventPort") {
            port.onMessage.addListener((event) => this.verifyAndHandle(event))
        } else {
            console.warn(`Wiring requested for unkown port type`)
        }
    }

    private verifyAndHandle(event: any): void {
        if (isEvent(event)) {
            const verifier = this.verifierMap.get(event.type)
            const normalizer = this.normalizerMap.get(event.type)
            if (verifier && normalizer) {
                if (verifier(event)) {
                    this.eventHandler(normalizer(event))
                } else {
                    console.warn(`Invalid event of type ${event.type} sent from content script`)
                }
            } else {
                console.warn(`Uknown event type ${event.type} sent from content script`)
            }
        }

    }
}
