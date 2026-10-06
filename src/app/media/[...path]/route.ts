import { serveMedia } from "@/lib/uploads";

/** Brand package images (logos, campaign, catalogue, textures) — served from the database. */
export async function GET(request: Request, ctx: RouteContext<"/media/[...path]">) {
  const { path } = await ctx.params;
  return serveMedia(`/media/${path.join("/")}`, request);
}
