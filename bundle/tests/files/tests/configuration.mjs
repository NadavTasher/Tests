/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Tests/
 **/

export const Password = "Test";

import { registerInternal, registerExternal } from "./platform.mjs";
import { Second, Minute, Hour, Day, Week, Month, Year } from "./units.mjs";

export function Setup() {
    registerInternal("Nadav.app is up", (pass, fail) => {
        setTimeout(pass, 5000);
    }, 5 * Minute);
};