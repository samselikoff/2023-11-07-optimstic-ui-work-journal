import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

export default function EntryForm({
  entry,
}: {
  entry?: {
    text: string;
    date: string;
    type: string;
  };
}) {
  let submit = useSubmit();
  // let fetcher = useFetcher();
  // fetcher.submit({}, { fetcherKey, n });
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  // let hasSubmitted = fetcher.data !== undefined && fetcher.state === "idle";

  // useEffect(() => {
  //   if (textareaRef.current && hasSubmitted) {
  //     textareaRef.current.value = "";
  //     textareaRef.current.focus();
  //   }
  // }, [hasSubmitted]);

  return (
    <Form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget, {
          method: "POST",
          fetcherKey: window.crypto.randomUUID(),
          navigate: false,
        });

        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.focus();
        }

        // setKey(window.crypto.randomUUID());
        // console.log("foo");
      }}
      className="mt-4"
    >
      <fieldset>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:order-2">
            <input
              type="date"
              name="date"
              required
              style={{ colorScheme: "dark" }}
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="mt-6 flex space-x-4 text-sm lg:mt-0 lg:space-x-6 lg:text-base">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label key={option.value} className="inline-block text-white">
                <input
                  required
                  type="radio"
                  className="mr-2 border-gray-700 bg-gray-800 text-sky-600  focus:ring-sky-600 focus:ring-offset-gray-900"
                  name="type"
                  value={option.value}
                  defaultChecked={option.value === (entry?.type ?? "work")}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <textarea
            ref={textareaRef}
            placeholder="Type your entry..."
            name="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
            required
            rows={3}
            defaultValue={entry?.text}
          />
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900 lg:w-auto lg:py-1.5"
          >
            Save
          </button>
        </div>
      </fieldset>
    </Form>
  );
}
