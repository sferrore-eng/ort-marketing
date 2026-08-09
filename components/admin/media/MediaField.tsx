"use client";

import MediaPicker from "./MediaPicker";

type Props = {
  label: string;
  name: string;
  value?: string;
};

export default function MediaField({
  label,
  name,
  value = "",
}: Props) {
  return (
    <div className="cms-field">
      <label>{label}</label>

      <MediaPicker
        value={value}
        onChange={(url) => {
          const input = document.querySelector(
            `input[name="${name}"]`
          ) as HTMLInputElement | null;

          if (input) {
            input.value = url;
            input.dispatchEvent(
              new Event("input", { bubbles: true })
            );
            input.dispatchEvent(
              new Event("change", { bubbles: true })
            );
          }
        }}
      />

      <input
        type="hidden"
        name={name}
        defaultValue={value}
      />
    </div>
  );
}
