import { NextResponse } from "next/server";
import { getMovieDetail, mapTMDBDetailToMovie } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const detail = await getMovieDetail(parseInt(id));
    if (!detail) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const movie = mapTMDBDetailToMovie(detail);
    return NextResponse.json({ movie });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
