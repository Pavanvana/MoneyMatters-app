
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.apiMachine.loading:invocation[0]": { type: "done.invoke.apiMachine.loading:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.apiMachine.loading:invocation[0]": { type: "error.platform.apiMachine.loading:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "FETCH_DATA": "done.invoke.apiMachine.loading:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "FETCH_DATA";
        };
        eventsCausingActions: {
          "assignDataToContext": "done.invoke.apiMachine.loading:invocation[0]";
"assignErrorToContext": "error.platform.apiMachine.loading:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "FETCH_DATA": "FETCH" | "RETRY";
        };
        matchesStates: "error" | "idle" | "loading" | "success";
        tags: never;
      }
  