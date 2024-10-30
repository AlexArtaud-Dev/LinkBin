// components/DynamicInput/UrlShortenerForm.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { CardBody, Input, Button, Spacer } from "@nextui-org/react";
import { FaXmark } from "react-icons/fa6";

import { Alert } from "@/components/ui/alert";
import CopyButton from "@/components/DynamicInput/CopyButton";

const UrlShortenerForm: React.FC = () => {
  // State variables with proper typing
  const [urlValue, setUrlValue] = useState<string>("");
  const [isSubmittingUrl, setIsSubmittingUrl] = useState<boolean>(false);
  const [urlResponseMessage, setUrlResponseMessage] = useState<string>("");
  const [urlResponseError, setUrlResponseError] = useState<string>("");

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
  const handleUrlSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        setUrlResponseMessage(data.shortCode);
        setUrlValue("");
      }
    } catch (error) {
      setUrlResponseError("An unexpected error occurred");
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  return (
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
      <Spacer y={3} />
      {urlResponseMessage && (
        <>
          <Alert className="flex justify-between items-center" color="success">
            <span>
              <strong>Short URL: </strong>
              {`${window.location.origin}/r/${urlResponseMessage}`}
            </span>
            <CopyButton
              content={`${window.location.origin}/r/${urlResponseMessage}`}
            />
          </Alert>
          <Spacer y={3} />
          <Alert className="flex justify-between items-center" color="success">
            <span>
              <strong>Info URL: </strong>
              {`${window.location.origin}/i/${urlResponseMessage}`}
            </span>
            <CopyButton
              content={`${window.location.origin}/i/${urlResponseMessage}`}
            />
          </Alert>
        </>
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
            startContent={<FaXmark />}
            onPress={() => {
              setUrlResponseError("");
            }}
          >
            Close
          </Button>
        </Alert>
      )}
    </CardBody>
  );
};

export default UrlShortenerForm;
