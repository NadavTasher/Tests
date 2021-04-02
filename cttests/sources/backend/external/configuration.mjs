/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/CTTests/
 **/

export const Password = "";

import { registerTest, registerPush } from "./platform.mjs";
import { Second, Minute, Hour, Day, Week, Month, Year } from "./units.mjs";

registerInternal("CTF 1", (passed, failed) => {
    setTimeout(() => {
        passed();
    }, 5000);
}, 5 * Minute);

registerExternal("CTF 2", "pastenino");
