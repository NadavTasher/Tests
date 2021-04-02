/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Tests/
 **/

// Import utilities
import { File } from "../internal/utilities.mjs";
import { Second, Minute, Hour, Day, Week, Month, Year } from "./units.mjs";

// Import configuration
import { Password } from "./configuration.mjs";

let Tests = {
    internal: {},
    external: {}
};

let Files = {
    internal: new File("internal-status"),
    external: new File("external-status")
};

// Create updating function
const updateStatus = (type, name, status, duration, comment) => {
    // Make sure test exists
    if (!Tests[type].hasOwnProperty(name))
        throw new Error(`No such test "${name}"`);

    // Find the file
    const file = Files[type];

    // Read the file
    let value = file.read({});

    // Make sure the value exists
    if (!value.hasOwnProperty(name))
        value[name] = {};

    // Update status
    value[name].time = new Date().getTime();
    value[name].status = status;
    value[name].comment = comment;
    value[name].duration = duration;

    // Write new data
    file.write(value);

    // Return count
    return value[name];
};

// Export registration functions
export function registerInternal(name, test, interval = 30 * Minute) {
    // Insert a test to the object
    if (Tests.internal.hasOwnProperty(name))
        throw new Error(`Test "${name}" already exists`);

    // Initialize object
    Tests.internal[name] = {};

    // Create the handler
    Tests.internal[name].handler = () => {
        // Store the start time
        const start = new Date().getTime();

        // Create callbacks
        const passed = (comment) => {
            updateStatus("internal", name, true, new Date().getTime() - start, comment || "No comment");
        };

        const failed = (comment) => {
            updateStatus("internal", name, false, new Date().getTime() - start, comment || "No comment");
        };

        // Execute test and wait for result
        try {
            test(passed, failed);
        } catch (exception) {
            updateStatus("internal", name, false, new Date().getTime() - start, exception.toString());
        }
    }

    // Update the interval
    Tests.internal[name].interval = setInterval(Tests.internal[name].handler, interval);

    // Run the initial test
    setTimeout(Tests.internal[name].handler, 1000);
};

export function registerExternal(name, token) {
    // Insert a test to the object
    if (Tests.external.hasOwnProperty(name))
        throw new Error(`Test "${name}" already exists`);

    // Initialize object
    Tests.external[name] = {};

    // Create the token
    Tests.external[name].token = token;
};

// Export routes
export const Routes = {
    internal: {
        trigger: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error(`Invalid password`);

                if (!Tests.internal.hasOwnProperty(parameters.name))
                    throw new Error(`No such test "${parameters.name}"`);

                // Set timeout
                setTimeout(Tests.internal[parameters.name].handler, 1000);

                return "Test scheduled";
            },
            parameters: {
                name: "string",
                password: "string"
            }
        },
        status: {
            handler: (parameters) => {
                if (!Tests.internal.hasOwnProperty(parameters.name))
                    throw new Error(`No such test "${parameters.name}"`);

                // Read status
                let contents = Files.internal.read({});

                // Make sure status exists
                if (!contents.hasOwnProperty(parameters.name))
                    throw new Error(`Test results do not exist for test "${parameters.name}"`);

                // Read statistics
                return contents[parameters.name];
            },
            parameters: {
                name: "string"
            }
        },
        list: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error(`Invalid password`);

                // Read statistics
                return Object.keys(Files.internal.read({}));
            },
            parameters: {
                password: "string"
            }
        }
    },
    external: {
        status: {
            handler: (parameters) => {
                if (!Tests.external.hasOwnProperty(parameters.name))
                    throw new Error(`No such test "${parameters.name}"`);

                // Read status
                let contents = Files.external.read({});

                // Make sure status exists
                if (!contents.hasOwnProperty(parameters.name))
                    throw new Error(`Test results do not exist for test "${parameters.name}"`);

                // Read statistics
                return contents[parameters.name];
            },
            parameters: {
                name: "string"
            }
        },
        list: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error(`Invalid password`);

                // Read statistics
                return Object.keys(Files.external.read({}));
            },
            parameters: {
                password: "string"
            }
        }
    },
    update: {
        passed: {
            handler: (parameters) => {
                // Make sure test exists
                if (!Tests.external.hasOwnProperty(parameters.name))
                    throw new Error(`No such test "${parameters.name}"`);

                // Validate token
                if (!Tests.external[parameters.name].token === parameters.token)
                    throw new Error(`Invalid token`);

                updateStatus("external", parameters.name, true, parameters.duration, parameters.comment);
            },
            parameters: {
                name: "string",
                token: "string",
                // Extras
                comment: "string",
                duration: "number"
            }
        },
        failed: {
            handler: (parameters) => {
                // Make sure test exists
                if (!Tests.external.hasOwnProperty(parameters.name))
                    throw new Error(`No such test "${parameters.name}"`);

                // Validate token
                if (!Tests.external[parameters.name].token === parameters.token)
                    throw new Error(`Invalid token`);

                updateStatus("external", parameters.name, false, parameters.duration, parameters.comment);
            },
            parameters: {
                name: "string",
                token: "string",
                // Extras
                comment: "string",
                duration: "number"
            }
        }
    },
    password: {
        check: {
            handler: (parameters) => {
                // Check password
                if (parameters.password !== Password)
                    throw new Error(`Invalid password`);

                return true;
            },
            parameters: {
                password: "string"
            }
        }
    }
};