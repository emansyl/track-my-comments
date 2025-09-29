// // prisma/seed.ts
// import { PrismaClient, Prisma } from "../generated/prisma";
// const prisma = new PrismaClient();

// async function main() {
//   //   await prisma.course.createMany({
//   //     data: [
//   //       { name: "MKT" },
//   //       { name: "LEAD" },
//   //       { name: "FIN 1" },
//   //       { name: "FRC" },
//   //       { name: "STRAT" },
//   //       { name: "TOM" },
//   //     ],
//   //   });
//   const courses = await prisma.course.findMany({
//     select: {
//       id: true,
//       name: true,
//     },
//   });
//   console.log(courses);

//   const courseMap = new Map(courses.map((course) => [course.name, course.id]));
//   console.log(courseMap);
//   const file = Bun.file("./prisma/schedule2.csv");
//   const text = await file.text();

//   const rows = text
//     .trim()
//     .split("\n")
//     .map((line: string) => line.split(",").map((val: string) => val.trim()));

//   const [headers, ...values] = rows;
//   const data = values.map((row: string[]) =>
//     Object.fromEntries(row.map((val, i) => [headers[i], val]))
//   );

//   const missing: Set<string> = new Set();

//   const sessions = data.map((row) => {
//     const courseId = courseMap.get(row["Class"]);
//     if (!courseId) {
//       missing.add(row["Class"]);
//       return null;
//     }
//     const start = new Date(row["Date"]);
//     const end = new Date(row["Date"]); // adjust if you have separate end values

//     return {
//       courseId,
//       startAt: start,
//       endAt: end,
//       case: row["Topic"] || null, // field is optional in schema
//     } satisfies Prisma.CourseSessionCreateManyInput;
//   });

//   if (missing.size > 0) {
//     console.warn(
//       "These classes were not found in Course table and were skipped:",
//       [...missing]
//     );
//   }
//   //   console.log(sessions);
//   await prisma.participation.deleteMany();
//   await prisma.courseSession.deleteMany();
//   await prisma.courseSession.createMany({
//     data: sessions,
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
