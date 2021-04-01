/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/CTTests/
 **/

// Import utilities
import { File } from "../internal/utilities.mjs";
import { Second, Minute, Hour, Day, Week, Month, Year } from "./units.mjs";

// Import configuration
import { Password, Tests } from "./configuration.mjs";

// Setup log server
let logServer = UDP.createSocket("udp4");

// Create statistic files
const testsFile = new File("tests");

// Create updating function
const Update = (file, name) => {
    // Read the file
    let value = file.read({});

    // Make sure the value exists
    if (!value.hasOwnProperty(name))
        value[name] = 0;

    // Increment by one
    value[name] += 1;

    // Write new data
    file.write(value);

    // Return count
    return value[name];
};

export function registerTest(name, test, interval = 30 * Minute) {

};

// Export routes
export const Routes = {
    test: {
        update: {
            handler: (parameters) => {
                if (!Tags.hasOwnProperty(parameters.tag))
                    throw new Error("Invalid tag");

                return Update(tagsFile, Tags[parameters.tag]);
            },
            parameters: {
                tag: "string"
            }
        },
        clear: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error("Invalid password");

                // Clear entry
                return Clear(tagsFile, parameters.name);
            },
            parameters: {
                name: "string",
                password: "string"
            }
        },
        fetch: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error("Invalid password");

                // Read statistics
                return tagsFile.read({});
            },
            parameters: {
                password: "string"
            }
        }
    },
    update: {
        push: {
            handler: (parameters) => {

            },
            parameters: {
                
            }
        }
    },
    password: {
        check: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error("Invalid password");

                return true;
            },
            parameters: {
                password: "string"
            }
        }
    }
};