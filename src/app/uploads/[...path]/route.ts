import { serveMedia } from "@/lib/uploads";

/** Admin uploads — served straight from the database. */
export async function GET(request: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path } = await ctx.params;
  return serveMedia(`/uploads/${path.join("/")}`, request);
}
