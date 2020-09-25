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
import { textCaptureEventType, isTextCaptureEvent, normalizeTextCaptureEvent } from '../common/events/internal/TextCaptureEvent'

import { Event, isEvent } from '../common/events/Event'
import { WindowMetadata } from './window/WindowMetadata'

export class BackgroundHub {

    private readonly eventHandler: (e: Event, w: WindowMetadata) => void

    private readonly verifierMap: Map<string, (e: Event) => boolean>
    private readonly normalizerMap: Map<string, (e: Event) => Event>

    constructor(eventHandler: (e: Event, w: WindowMetadata) => void) {
        browser.runtime.onConnect.addListener((p) => this.wirePort(p))

        this.eventHandler = eventHandler

        const vMap = new Map<string, (e: Event) => boolean>()
        vMap.set(windowEventType, (e: any) => isWindowEvent(e))
        vMap.set(windowLocationEventType, (e: any) => isWindowLocationEvent(e))
        vMap.set(textCaptureEventType, (e: any) => isTextCaptureEvent(e))
        this.verifierMap = vMap

        const nMap = new Map<string, (e: Event) => Event>()
        nMap.set
        nMap.set(windowEventType, (e: any) => normalizeWindowEvent(e))
        nMap.set(windowLocationEventType, (e: any) => normalizeWindowLocationEvent(e))
        nMap.set(textCaptureEventType, (e: any) => normalizeTextCaptureEvent(e))

        this.normalizerMap = nMap
    }

    private wirePort(port: browser.runtime.Port): void {
        // onConnect gives us some important metadata about the frame/window the connect came from
        const windowMetadata = new WindowMetadata(port.sender?.tab?.id, port.sender?.frameId)

        if (port.name === "EventPort") {
            port.onMessage.addListener((event) => this.verifyAndHandle(event, windowMetadata))
        } else {
            console.warn(`Wiring requested for unknown port type`)
        }
    }

    private verifyAndHandle(event: any, windowMetadata: WindowMetadata): void {
        if (isEvent(event)) {
            const verifier = this.verifierMap.get(event.type)
            const normalizer = this.normalizerMap.get(event.type)
            if (verifier && normalizer) {
                if (verifier(event)) {
                    this.eventHandler(normalizer(event), windowMetadata)
                } else {
                    console.warn(`Invalid event of type ${event.type} sent from content script`)
                }
            } else {
                console.warn(`Unknown event type ${event.type} sent from content script`)
            }
        }
    }
}
