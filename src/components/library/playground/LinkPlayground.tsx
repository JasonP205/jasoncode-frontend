"use client";

import { useState } from "react";
import { JasonCode } from "@hwagfu/link";
import { PlaygroundShell, SelectControl, TextControl } from "./controls";

type LinkType = "button" | "link" | "icon";
type IconSize = "sm" | "md" | "lg" | "xl";

export default function LinkPlayground() {
  const [type, setType] = useState<LinkType>("button");
  const [size, setSize] = useState<IconSize>("md");
  const [label, setLabel] = useState("Jason Code Space");
  const [url, setUrl] = useState("https://hwagfu.dev");

  return (
    <PlaygroundShell
      preview={<JasonCode type={type} size={size} label={label} url={url} />}
      controls={
        <>
          <SelectControl
            label="type"
            value={type}
            options={["button", "link", "icon"] as const}
            onChange={setType}
          />
          {type === "icon" && (
            <SelectControl
              label="size"
              value={size}
              options={["sm", "md", "lg", "xl"] as const}
              onChange={setSize}
            />
          )}
          <TextControl label="label" value={label} onChange={setLabel} />
          <TextControl label="url" value={url} onChange={setUrl} />
        </>
      }
    />
  );
}
