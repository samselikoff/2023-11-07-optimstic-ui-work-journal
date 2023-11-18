import { Form, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry?: {
    text: string;
    date: string;
    type: string;
  };
}) {
  let textareaRef = useRef<HTMLTextAreaElement>(null);
  let submit = useSubmit();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        let data = validate(Object.fromEntries(formData));

        submit(
          { ...data, id: window.crypto.randomUUID() },
          { navigate: false, method: "post" }
        );

        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.focus();
        }
      }}
      method="post"
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.form?.dispatchEvent(
                  new Event("submit", { bubbles: true, cancelable: true })
                );
              }
            }}
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

function validate(data: Record<string, any>) {
  let { date, type, text } = data;

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad data");
  }

  return { date, type, text };
}
