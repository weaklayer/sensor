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

import { WindowEvent } from "../../common/events/WindowEvent"
import { WindowMetadata } from "./WindowMetadata"

export class WindowTracker {

    private readonly topLevelWindowMap: Map<number, number>

    constructor() {
        this.topLevelWindowMap = new Map<number, number>()
    }

    mutateWindow(event: WindowEvent, windowMetadata: WindowMetadata): void {
        if ('frameId' in windowMetadata && windowMetadata.frameId === 0) {
            this.mutateTopLevelWindow(event, windowMetadata)
        } else {
            // note that the frame id is only used for determining if something is a top level window
            // we can still track if tabId and url are set 
            this.mutateLowerLevelWindow(event, windowMetadata)
        }
    }

    private mutateTopLevelWindow(event: WindowEvent, windowMetadata: WindowMetadata): void {
        event.isTopLevelWindow = true
        event.topLevelWindowReference = event.time
        if (windowMetadata.tabId) {
            // New top-level window/frame creation
            // This means that the tab has now been taken over by this window
            // We can stop tracking the old top-level window
            this.topLevelWindowMap.set(windowMetadata.tabId, event.time)
        } else {
            // tabId is missing so we can't effectively track it or anything else that comes in
            // log a warning and send the event off
            console.warn('New top-level window created but no tabId given')
        }
    }

    private async mutateLowerLevelWindow(event: WindowEvent, windowMetadata: WindowMetadata): Promise<void> {
        event.isTopLevelWindow = false
        event.topLevelWindowReference = 0
        if (windowMetadata.tabId) {
            const topLevelWindow = this.topLevelWindowMap.get(windowMetadata.tabId)
            if (topLevelWindow) { // topLevelWindow won't be 0 if set
                event.topLevelWindowReference = topLevelWindow
            } else {
                console.warn('New window created but no top-level window set for given tab')
            }
        } else {
            // tabId is missing so we can't effectively track match it against a top level window
            console.warn('New window created but no tabId given')
        }
    }
}