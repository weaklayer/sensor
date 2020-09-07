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

import { LocalStorage } from '../storage/LocalStorage'
import { Lock } from '../../common/concurrent/Lock'

export class HashKeyManager {

    private readonly lock: Lock = new Lock()
    private cachedValue?: Uint8Array = undefined

    getHashKey(): Promise<Uint8Array> {

        if (this.cachedValue) {
            return Promise.resolve(this.cachedValue)
        }

        return this.lock.syncExecute(() => this.internalGetHashKeyUnsafe())
    }

    private async internalGetHashKeyUnsafe(): Promise<Uint8Array> {
        // check the cache again.
        // another execution might have set it while we 
        // were waiting for the lock
        if (this.cachedValue) {
            return this.cachedValue
        }

        try {
            const storedKey: Uint8Array = await LocalStorage.getTextHashKey()
            return storedKey
        } catch (e) {
            console.info('Could not retrieve hash key from local storage. Generating new hash key.', e)
        }

        const newKey: Uint8Array = this.generateNewHashKey()

        // important that we are able to persist the hash key
        // before we keep it in this class or return it
        await LocalStorage.setTextHashKey(newKey)

        this.cachedValue = newKey

        return newKey
    }

    clearHashKey(): Promise<void> {
        return this.lock.syncExecute(async () => {
            await LocalStorage.clearTextHashKey()
            this.cachedValue = undefined
        })
    }

    // generates random 512 bit hash key
    private generateNewHashKey(): Uint8Array {
        return crypto.getRandomValues(new Uint8Array(64))
    }
}
