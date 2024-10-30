// app/components/DynamicInput.tsx
"use client";

import React, { useState, FormEvent } from "react";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Spacer,
  Tabs,
  Tab,
} from "@nextui-org/react";

import { title } from "@/components/primitives";

import { Alert } from "./ui/alert";

const DynamicInput: React.FC = () => {
  // State for URL Shortener
  const [urlValue, setUrlValue] = useState("");
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
  const [urlResponseMessage, setUrlResponseMessage] = useState("");
  const [urlResponseError, setUrlResponseError] = useState("");

  // State for Pastebin
  const [pasteValue, setPasteValue] = useState("");
  const [isSubmittingPaste, setIsSubmittingPaste] = useState(false);
  const [pasteResponseMessage, setPasteResponseMessage] = useState("");
  const [pasteResponseError, setPasteResponseError] = useState("");

  // Regular expression to validate URLs
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  );

  // Handler for URL Shortener Submission
  const handleUrlSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingUrl(true);
    setUrlResponseMessage("");
    setUrlResponseError("");

    try {
      // Validate URL format
      if (!urlPattern.test(urlValue.trim())) {
        setUrlResponseError("Invalid URL format");
        setIsSubmittingUrl(false);

        return;
      }

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlValue.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setUrlResponseError(data.error || "Failed to shorten URL");
      } else {
        const shortUrl = `${window.location.origin}/r/${data.shortCode}`;

        setUrlResponseMessage(`Short URL: ${shortUrl}`);
        setUrlValue("");
      }
    } catch (error) {
      setUrlResponseError("An unexpected error occurred");
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  // Handler for Pastebin Submission
  const handlePasteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingPaste(true);
    setPasteResponseMessage("");
    setPasteResponseError("");

    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: pasteValue.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasteResponseError(data.error || "Failed to create paste");
      } else {
        const pasteUrl = `${window.location.origin}/paste/${data.pasteCode}`;

        setPasteResponseMessage(`Paste URL: ${pasteUrl}`);
        setPasteValue("");
      }
    } catch (error) {
      setPasteResponseError("An unexpected error occurred");
    } finally {
      setIsSubmittingPaste(false);
    }
  };

  return (
    <Card className="w-full flex flex-col items-center max-w-lg mx-auto p-6 shadow-lg min-h-[30vh]">
      <span className={title()}>Share your content&nbsp;</span>
      <Tabs aria-label="LinkBin Options" className="mt-6">
        <Tab key="shorten" className="w-full" title="URL Shortener">
          <CardBody className="flex flex-col justify-between h-full">
            <form className="flex flex-col gap-4" onSubmit={handleUrlSubmit}>
              <Input
                fullWidth
                isClearable
                required
                className="w-full"
                color="primary"
                placeholder="Enter the URL to shorten"
                size="lg"
                type="url"
                value={urlValue}
                variant="bordered"
                onChange={(e) => setUrlValue(e.target.value)}
              />
              <Button
                color="primary"
                disabled={isSubmittingUrl}
                size="lg"
                type="submit"
              >
                {isSubmittingUrl ? "Shortening..." : "Shorten URL"}
              </Button>
            </form>
            <Spacer y={1} />
            {urlResponseMessage && (
              <Alert
                className="flex justify-between items-center"
                color="success"
                variant="default"
              >
                <span>{urlResponseMessage}</span>
                <Button
                  color="success"
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    navigator.clipboard.writeText(
                      urlResponseMessage.split(": ")[1],
                    );
                    alert("URL copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </Alert>
            )}
            {urlResponseError && (
              <Alert
                className="flex justify-between items-center"
                color="error"
                variant="default"
              >
                <span>{urlResponseError}</span>
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setUrlResponseError("");
                  }}
                >
                  Close
                </Button>
              </Alert>
            )}
          </CardBody>
        </Tab>
        <Tab key="paste" className="w-full" title="Pastebin">
          <CardBody className="flex flex-col justify-between h-full">
            <form className="flex flex-col gap-4" onSubmit={handlePasteSubmit}>
              <Textarea
                fullWidth
                required
                color="default"
                placeholder="Enter your content here"
                rows={5}
                size="lg"
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
              />
              <Button
                color="primary"
                disabled={isSubmittingPaste}
                size="lg"
                type="submit"
              >
                {isSubmittingPaste ? "Creating..." : "Create Paste"}
              </Button>
            </form>
            <Spacer y={1} />
            {pasteResponseMessage && (
              <Alert
                className="flex justify-between items-center"
                color="success"
                variant="default"
              >
                <span>{pasteResponseMessage}</span>
                <Button
                  color="success"
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    navigator.clipboard.writeText(
                      pasteResponseMessage.split(": ")[1],
                    );
                    alert("Paste URL copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </Alert>
            )}
            {pasteResponseError && (
              <Alert
                className="flex justify-between items-center"
                color="error"
                variant="default"
              >
                <span>{pasteResponseError}</span>
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setPasteResponseError("");
                  }}
                >
                  Close
                </Button>
              </Alert>
            )}
          </CardBody>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default DynamicInput;
