import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const linkedInUrl = "https://www.linkedin.com/in/emmanuelsylvester/";
  const githubUrl = "https://github.com/emansyl/track-my-comments";

  return (
    <div className="min-h-screen bg-linear-to-b from-crimson-50 via-white to-crimson-100 dark:from-gray-950 dark:via-gray-900 dark:to-crimson-950">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Class Comment Tracker
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Hello, I made a tiny tool to make it easier to track my class
            participation. I find it more fun than updating a spreadsheet. Maybe
            you&apos;ll find it useful too.
          </p>

          <div className="mx-auto mt-8 max-w-sm space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/signin">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              What it does
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
              <li>Shows you the classes for the day</li>
              <li>Allows you to log your participation</li>
              <li>Mobile friendly so you can tap and move on</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            <p className="text-sm">
              Heads up, I made this in a few hours so it likely has a few bugs.
              If you find a bug or have any suggestions feel free to reach out.
            </p>
          </div>
        </div>

        <footer className="mx-auto mt-12 max-w-3xl text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Made by{" "}
            <a
              className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:opacity-90 dark:text-blue-400"
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
            >
              Emmanuel Sylvester
            </a>
            , Section E
          </p>
          <p className="mt-1">
            Not promising great code, but you can peek at it on{" "}
            <a
              className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:opacity-90 dark:text-blue-400"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </footer>
      </section>
    </div>
  );
}
