// prisma/seed.ts
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const courseMap = new Map(courses.map((course) => [course.name, course.id]));
  console.log(courseMap);

  const file = Bun.file("./prisma/schedule2.csv");
  const text = await file.text();

  const rows = text
    .trim()
    .split("\n")
    .map((line: string) => line.split(",").map((val: string) => val.trim()));

  const [headers, ...values] = rows;
  const data = values.map((row: string[]) =>
    Object.fromEntries(row.map((val, i) => [headers[i], val]))
  );

  const sessions = data.map(
    (row: { Date: string; Class: string; Topic: string }) => {
      const courseId = courseMap.get(row.Class);
      return {
        courseId,
        startAt: new Date(row.Date),
        endAt: new Date(row.Date),
        case: row.Topic,
      };
    }
  );
  console.log(sessions);
  await prisma.participation.deleteMany();
  await prisma.courseSession.deleteMany();
  await prisma.courseSession.createMany({
    data: sessions,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
