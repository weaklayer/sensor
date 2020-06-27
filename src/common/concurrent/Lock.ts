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

import { Semaphore } from './Semaphore'

type AsyncFunction<I, O> = (...args: I[]) => Promise<O>

// N.B. This lock is not re-entrant
export class Lock {

    private lastInLineSignal: Promise<void> = Promise.resolve()

    async lock(): Promise<() => void> {

        // capture the promise of:
        //   1) who last had the lock in the case of no contention
        //   2) who currently has the lock if there is no lineup
        //   3) who is last in line for lock in case of a lineup

        const beforeMeSignal = this.lastInLineSignal

        const me = new Semaphore()

        // we are now last in line
        this.lastInLineSignal = me.getSignal()

        // wait for the signal that the lock hold before us is released
        await beforeMeSignal

        // we now have the lock
        // the unlock function we return
        // is the function that sets the signal
        // i.e. resolves the semaphore promise
        return () => me.setSignal()
    }

    async syncExecute<I, O>(unsafeFun: AsyncFunction<I, O>, ...args: Parameters<AsyncFunction<I, O>>): ReturnType<AsyncFunction<I, O>> {
        const unlock = await this.lock()

        try {
            return await unsafeFun(...args)
        } finally {
            unlock()
        }
    }
}
