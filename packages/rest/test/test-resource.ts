import { deepStrictEqual } from "assert";
import { getRoutesFor } from "./test-host.js";

describe("rest: resources", () => {
  it("resources: generates standard operations for resource types and their children", async () => {
    const routes = await getRoutesFor(
      `
      using Cadl.Rest.Resource;

      namespace Things {
        model Thing {
          @key
          @segment("things")
          thingId: string;
        }

        @parentResource(Thing)
        model Subthing {
          @key
          @segment("subthings")
          subthingId: string;
        }

        model Error {}

        interface Things mixes ResourceOperations<Thing, Error> {}
        interface Subthings mixes ResourceOperations<Subthing, Error> {}
      }
      `
    );

    deepStrictEqual(routes, [
      {
        verb: "get",
        path: "/things/{thingId}",
        params: ["thingId"],
      },
      {
        verb: "patch",
        path: "/things/{thingId}",
        params: ["thingId"],
      },
      {
        verb: "delete",
        path: "/things/{thingId}",
        params: ["thingId"],
      },
      {
        verb: "post",
        path: "/things",
        params: [],
      },
      {
        verb: "get",
        path: "/things",
        params: [],
      },
      {
        verb: "get",
        path: "/things/{thingId}/subthings/{subthingId}",
        params: ["thingId", "subthingId"],
      },
      {
        verb: "patch",
        path: "/things/{thingId}/subthings/{subthingId}",
        params: ["thingId", "subthingId"],
      },
      {
        verb: "delete",
        path: "/things/{thingId}/subthings/{subthingId}",
        params: ["thingId", "subthingId"],
      },
      {
        path: "/things/{thingId}/subthings",
        verb: "post",
        params: ["thingId"],
      },
      {
        verb: "get",
        path: "/things/{thingId}/subthings",
        params: ["thingId"],
      },
    ]);
  });

  it("singleton resource: generates standard operations", async () => {
    const routes = await getRoutesFor(
      `
      using Cadl.Rest.Resource;

      namespace Things {
        model Thing {
          @key
          @segment("things")
          thingId: string;
        }

        @segment("singleton")
        model Singleton {
          data: string;
        }

        model Error {}

        interface Things mixes ResourceRead<Thing, Error> {}
        interface ThingsSingleton mixes SingletonResourceOperations<Singleton, Thing, Error> {}
      }
      `
    );

    deepStrictEqual(routes, [
      {
        verb: "get",
        path: "/things/{thingId}",
        params: ["thingId"],
      },
      {
        verb: "get",
        path: "/things/{thingId}/singleton",
        params: ["thingId"],
      },
      {
        verb: "patch",
        path: "/things/{thingId}/singleton",
        params: ["thingId"],
      },
    ]);
  });

  it("extension resources: generates standard operations for extensions on parent and child resources", async () => {
    const routes = await getRoutesFor(
      `
      using Cadl.Rest.Resource;

      namespace Things {
        model Thing {
          @key
          @segment("things")
          thingId: string;
        }

        @parentResource(Thing)
        model Subthing {
          @key
          @segment("subthings")
          subthingId: string;
        }

        model Exthing {
          @key
          @segment("extension")
          exthingId: string;
        }

        model Error {}

        interface ThingsExtension mixes ExtensionResourceOperations<Exthing, Thing, Error> {}
        interface SubthingsExtension mixes ExtensionResourceOperations<Exthing, Subthing, Error> {}
      }
      `
    );

    deepStrictEqual(routes, [
      {
        verb: "get",
        path: "/things/{thingId}/extension/{exthingId}",
        params: ["thingId", "exthingId"],
      },
      {
        verb: "patch",
        path: "/things/{thingId}/extension/{exthingId}",
        params: ["thingId", "exthingId"],
      },
      {
        verb: "delete",
        path: "/things/{thingId}/extension/{exthingId}",
        params: ["thingId", "exthingId"],
      },
      {
        verb: "post",
        path: "/things/{thingId}/extension",
        params: ["thingId"],
      },
      {
        verb: "get",
        path: "/things/{thingId}/extension",
        params: ["thingId"],
      },
      {
        verb: "get",
        path: "/things/{thingId}/subthings/{subthingId}/extension/{exthingId}",
        params: ["thingId", "subthingId", "exthingId"],
      },
      {
        verb: "patch",
        path: "/things/{thingId}/subthings/{subthingId}/extension/{exthingId}",
        params: ["thingId", "subthingId", "exthingId"],
      },
      {
        verb: "delete",
        path: "/things/{thingId}/subthings/{subthingId}/extension/{exthingId}",
        params: ["thingId", "subthingId", "exthingId"],
      },
      {
        verb: "post",
        path: "/things/{thingId}/subthings/{subthingId}/extension",
        params: ["thingId", "subthingId"],
      },
      {
        verb: "get",
        path: "/things/{thingId}/subthings/{subthingId}/extension",
        params: ["thingId", "subthingId"],
      },
    ]);
  });
});