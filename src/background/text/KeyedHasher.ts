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

export class KeyedHasher {

    private readonly textEncoder: TextEncoder = new TextEncoder()
    private readonly hashKeySupplier: () => Promise<Uint8Array>

    constructor(hashKeySupplier: () => Promise<Uint8Array>) {
        this.hashKeySupplier = hashKeySupplier
    }

    async computeStringHash(text: string): Promise<Uint8Array> {
        return this.computeBytesHash(this.textEncoder.encode(text))
    }

    async computeBytesHash(bytes: Uint8Array): Promise<Uint8Array> {
        const hmacKey = crypto.subtle.importKey('raw', await this.hashKeySupplier(), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
        const hash = await crypto.subtle.sign('HMAC', await hmacKey, bytes)
        return new Uint8Array(hash)
    }
}
