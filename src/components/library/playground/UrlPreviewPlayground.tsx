"use client";

import { useState } from "react";
import LinkPreviewCard from "@hwagfu/url-preview";
import {
  PlaygroundShell,
  SelectControl,
  TextControl,
  ToggleControl,
} from "./controls";

type Layout = "large" | "wide" | "small";
type ImagePosition = "top" | "left" | "right";

export default function UrlPreviewPlayground() {
  const [url, setUrl] = useState("https://react.dev");
  const [layout, setLayout] = useState<Layout>("large");
  const [imagePosition, setImagePosition] = useState<ImagePosition>("top");
  const [showDescription, setShowDescription] = useState(true);
  const [showFavicon, setShowFavicon] = useState(true);
  const [showSiteName, setShowSiteName] = useState(true);
  const [showAuthor, setShowAuthor] = useState(false);
  const [showDate, setShowDate] = useState(false);

  return (
    <PlaygroundShell
      preview={
        <div className="w-full max-w-sm">
          <LinkPreviewCard
            key={`${url}-${layout}-${imagePosition}`}
            url={url}
            layout={layout}
            imagePosition={imagePosition}
            width="100%"
            showDescription={showDescription}
            showFavicon={showFavicon}
            showSiteName={showSiteName}
            showAuthor={showAuthor}
            showDate={showDate}
          />
        </div>
      }
      controls={
        <>
          <TextControl
            label="url"
            value={url}
            placeholder="https://..."
            onChange={setUrl}
          />
          <SelectControl
            label="layout"
            value={layout}
            options={["large", "wide", "small"] as const}
            onChange={setLayout}
          />
          <SelectControl
            label="imagePosition"
            value={imagePosition}
            options={["top", "left", "right"] as const}
            onChange={setImagePosition}
          />
          <ToggleControl
            label="showDescription"
            value={showDescription}
            onChange={setShowDescription}
          />
          <ToggleControl
            label="showFavicon"
            value={showFavicon}
            onChange={setShowFavicon}
          />
          <ToggleControl
            label="showSiteName"
            value={showSiteName}
            onChange={setShowSiteName}
          />
          <ToggleControl
            label="showAuthor"
            value={showAuthor}
            onChange={setShowAuthor}
          />
          <ToggleControl
            label="showDate"
            value={showDate}
            onChange={setShowDate}
          />
        </>
      }
    />
  );
}
