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

import { HTMLInputEventManager } from "./HTMLInputEventManager"
import { TextCaptureEvent, createTextCaptureEvent } from "../../common/events/internal/TextCaptureEvent"
import { ElementRegistry } from "../ElementRegistry"
import { TextChunkEventManager } from "./TextChunkEventManager"
import { VirtualElementManager } from "./composition/VirtualElementManager"

export class TextInputEventManager {

    private readonly htmlInputEventManager: HTMLInputEventManager

    private readonly virtualElementManager: VirtualElementManager

    private readonly textChunkEventManager: TextChunkEventManager

    constructor(windowReference: number, windowLocationReferenceProducer: () => number, textCaptureEventConsumer: (e: TextCaptureEvent) => void, elementRegistry: ElementRegistry) {

        const consumeCapture = (text: string, type: string, elementReference: number) => {
            const e = createTextCaptureEvent(text, type, windowReference, windowLocationReferenceProducer(), elementReference)
            textCaptureEventConsumer(e)
        }

        this.htmlInputEventManager = new HTMLInputEventManager((text, type, reference) => consumeCapture(text, type, reference), elementRegistry)
        this.textChunkEventManager = new TextChunkEventManager((text, type, reference) => consumeCapture(text, type, reference))
        this.virtualElementManager = new VirtualElementManager(elementRegistry, (text, type, reference) => consumeCapture(text, type, reference))

        // Set up listeners for all events that could indicate text being inputted into the page

        // Input events. These indicate when the text content of HTML elements is worth a snapshot.
        window.addEventListener("input", (e) => {
            if (e instanceof InputEvent) {
                this.htmlInputEventManager.handleInputEvent(e)
            }
        }, { capture: true, once: false, passive: true })

        // Keyboard events. Should only need keydown.
        window.addEventListener("keydown", (e) => {
            if (e instanceof KeyboardEvent) {
                this.virtualElementManager.keyboardEvent(e)
            }
        }, { capture: true, once: false, passive: true })

        // clipboard events
        window.addEventListener("paste", (e) => {
            if (e instanceof ClipboardEvent) {
                this.virtualElementManager.clipboardEvent(e)
                this.textChunkEventManager.handlePasteEvent(e)
            }
        }, { capture: true, once: false, passive: true })

        // drag events
        window.addEventListener("drag", (e) => this.textChunkEventManager.handleDragEvent(e), { capture: true, once: false, passive: true })
        window.addEventListener("dragend", (e) => this.textChunkEventManager.handleDragEvent(e), { capture: true, once: false, passive: true })
        window.addEventListener("dragenter", (e) => this.textChunkEventManager.handleDragEvent(e), { capture: true, once: false, passive: true })
        window.addEventListener("dragstart", (e) => this.textChunkEventManager.handleDragEvent(e), { capture: true, once: false, passive: true })
        window.addEventListener("dragleave", (e) => this.textChunkEventManager.handleDragEvent(e), { capture: true, once: false, passive: true })
        window.addEventListener("dragover", (e) => this.textChunkEventManager.handleDragEvent(e), { capture: true, once: false, passive: true })

        // drop actually shows intention that the text is part of a larger composition
        // therefore handle it in the composition manager
        window.addEventListener("drop", (e) => {
            this.textChunkEventManager.handleDragEvent(e)
            this.virtualElementManager.dragEvent(e)
        }, { capture: true, once: false, passive: true })


    }

}
