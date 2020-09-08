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

export class DocumentCrawler {

    private readonly nodeProcessors: Array<(n: Node) => void>

    constructor(nodeProcessors: Array<(n: Node) => void>) {
        this.nodeProcessors = nodeProcessors
    }

    crawl(): void {

        // This listens for DOM changes and sets up more node processors as needed
        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                this.addProcessors(mutation.target)
            })
        })

        mutationObserver.observe(document, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
        })

        // This sets up the initial node processors
        // TODO:  it is kind of vulnerable to attack though if a malicious
        //        webpage supplies a DOM to cause a stack overflow
        this.crawlRecurse(document)

    }

    private crawlRecurse(node: Node): void {
        this.addProcessors(node)

        const nodes = node.childNodes

        for (const node of nodes) {
            this.crawlRecurse(node)
        }
    }

    private addProcessors(node: Node): void {
        this.nodeProcessors.forEach(p => {
            p(node)
        })
    }
}