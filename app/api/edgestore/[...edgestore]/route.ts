import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

// ✅ Create EdgeStore instance
const es = initEdgeStore.create();

// ✅ Define your file bucket (simple public file bucket)
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket().beforeDelete(({ ctx, fileInfo }) => {
    console.log("beforeDelete", ctx, fileInfo);
    return true;
  }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
