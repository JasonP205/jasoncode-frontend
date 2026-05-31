import { NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { delay } from "@/lib/utils";

export async function GET() {
  await delay(1000); // Giả lập độ trễ khi lấy dữ liệu
  return NextResponse.json(projects);
}
