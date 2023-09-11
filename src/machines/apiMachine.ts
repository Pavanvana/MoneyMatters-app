import { assign, createMachine } from "xstate";

interface ResponseData{
    id: number;
    transaction_name: string;
    type: string;
    category: string;
    amount: number;
    date: Date|string;
    user_id: string|undefined;
}
  
interface Response {
    transactions: Array<ResponseData>
}

export const apiMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOBLAssgxgC3QDswA6AGwHtkIioBiCC4kogNwoGtS0tcDnK1WgjYUcyAC7omAbQAMAXXkLEoVBVjopTVSAAeiAKwAWABwlDc08YBMAZkM2AbE4DsT0wBoQAT0T25EjljOQBGJztQuWdTYJsAX3jvHmx8IlJBGkJ6MAAnXIpcklQySQAzQoBbEhS+dPIqLKgRQnZxbUJlZV11TQ7dAwRDOycSAE5rO1NQibcbd28-BFc7ElMx4ydQ6ZdTO1dwxOSMVP5SPILcugAlAFEAFWuATW6kEF6taUIBoyDXebGrlMThssRC+0Mi0QAFoxhZQsZbB4ots7IDjEcQLU0sx0BAyGA6AAxB4AYQAEq81BpPjo3oMPGsbKFwqZYu4bLYxlCEKFDK4glZ-qZDGN0XJ-okkiBCBQIHBdNizj0af16TDQsySKERuEHK45GFXMZub4YYCSMzERLHJZNq5MUr6plaCq+l8fggbDZAqEDutrGyxnIxpCzbzvSQzIZRXInCG9pEMdKncxYABXHA4ODwN4fNWgQbMwwkVxAvViqYi4Y80El4HrQ3OKKmA6Ok51ZgXQpu2nfdVen3a-0TMyN0M82HjBHGbbDDauMZOCbt3g40h4gm9gv6GErbW6iL8w1+k08vmjeOtmai0F+0NS+JAA */
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
                data: Response
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

        success: {
            type: 'final'
        },

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