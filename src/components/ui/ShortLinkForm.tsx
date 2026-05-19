"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Input,
  toast,
} from "@heroui/react";

export default function CreateLinkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");

  const createLink = async () => {
    if (!url.trim()) {
      toast.warning("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.danger("Invalid URL");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/utils/short-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalUrl: url,
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: { link: string } =
        await response.json();

      setShortLink(
        `http://localhost:3001/${data.link}`,
      );

      toast.success("Short link created");
    } catch (error) {
      console.error(error);

      toast.danger(
        "Unable to create short link",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        shortLink,
      );

      toast.success("Copied");
    } catch {
      toast.danger("Copy failed");
    }
  };

  const resetForm = () => {
    setUrl("");
    setShortLink("");
  };

  return (
    <div className="space-y-2">
      <Card className="flex flex-row items-center gap-2 p-3">
        {shortLink ? (
          <>
            <Input
              readOnly
              fullWidth
              value={shortLink}
            />

            <Button
              variant="secondary"
              onPress={copyLink}
            >
              Copy
            </Button>

            <Button
              variant="tertiary"
              onPress={resetForm}
            >
              New
            </Button>
          </>
        ) : (
          <>
            <Input
              fullWidth
              type="url"
              value={url}
              placeholder="Paste your URL here..."
              onChange={(e) =>
                setUrl(e.target.value)
              }
            />

            {/* <Button
              isPending={loading}
              onPress={createLink}
            >
              {({ isPending }) =>
                isPending
                  ? "Creating..."
                  : "Get Link"
              }
            </Button> */}
          </>
        )}
      </Card>

      <p className="text-sm text-muted">
        * By using this service you agree to
        the terms.
      </p>
    </div>
  );
}