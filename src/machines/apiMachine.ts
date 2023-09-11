import { assign, createMachine } from "xstate";

export const apiMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOBLAssgxgC3QDswA6AGwHtkIioBiCC4kogNwoGtS0tcDnK1WgjYUcyAC7omAbQAMAXXkLEoVBVjopTVSAAeiAKwAWABwlDc08YBMAZkM2AbE4DsT0wBoQAT0T25EjljOQBGJztQuWdTYJsAX3jvHmx8IlJBGkJ6MAAnXIpcklQySQAzQoBbEhS+dPIqLKgRQnZxbUJlZV11TQ7dAwRDOycSAE5rO1NQibcbd28-BFc7ElMx4ydQ6ZdTO1dwxOSMVP5SPILcugAlAFEAFWuATW6kEF6taUIBoyDXebGrlMThssRC+0Mi0QAFoxhZQsZbB4ots7IDjEcQLU0sx0BAyGA6AAxB4AYQAEq81BpPjo3oMPGsbKFwqZYu4bLYxlCEKFDK4glZ-qZDGN0XJ-okkiBCBQIHBdNizj0af16TDQsySKERuEHK45GFXMZub4YYCSMzEXyxoYnIj7JilfVMrQVX0vj8EDYbIFQgd1tY2WM5LaeZqbCQzIZRXInKG9pEMdLncxYABXHA4ODwN4fNWgQbMwwkVxAvViqYi4Y80El4HrQ3OKKmA5Ok51ZgXQru2nfdXe33agMTMyNsNmhCw8YI4zbYYbVxjJwTdu8HGkPEE3sF-Qwlba3URfmG-0m8N2kjx1szUWg-22qXxIA */
    id: 'apiMachine',
    initial: "idle",
    tsTypes: {} as import("./apiMachine.typegen").Typegen0,

    context: {
        data: null,
        error: null,
    },

    schema: {
        services: {} as {
            FETCH_DATA: {
                data: any
            }
        },
        events: {} as {
            type: "FETCH"
        } | {
            type: "RETRY"
        } | {
            type: "FETCH_DATA"
        }
    },

    states: {
        loading: {
            invoke: {
                src: 'FETCH_DATA',
                onDone: {
                    target: 'success',
                    actions: 'assignDataToContext',
                },
                onError: {
                    target: 'error',
                    actions: 'assignErrorToContext'
                }
            }
        },

        success: {},

        error: {
            on: {
                RETRY: "loading"
            }
        },

        idle: {
            on: {
                FETCH: "loading"
            }
        }
    }
},{
    actions: {
        assignDataToContext: assign((context: any, event: any) => {
            return ({
                data: event.data
            })
        }),
        assignErrorToContext: assign((context: any, event: any) => {
            return({
                error: event.data
            })
        })
    }
})