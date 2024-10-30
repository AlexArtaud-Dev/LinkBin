// components/DynamicInput/PastebinForm.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { CardBody, Textarea, Button, Spacer } from "@nextui-org/react";
import { FaClipboard } from "react-icons/fa";

import { Alert } from "@/components/ui/alert";
import { copyTextToClipboard } from "@/lib/utils";

const PastebinForm: React.FC = () => {
  // State variables with proper typing
  const [pasteValue, setPasteValue] = useState<string>("");
  const [isSubmittingPaste, setIsSubmittingPaste] = useState<boolean>(false);
  const [pasteResponseMessage, setPasteResponseMessage] = useState<string>("");
  const [pasteResponseError, setPasteResponseError] = useState<string>("");

  // Handler for Pastebin Submission
  const handlePasteSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        setPasteResponseMessage(data.pasteCode);
        setPasteValue("");
      }
    } catch (error) {
      setPasteResponseError("An unexpected error occurred");
    } finally {
      setIsSubmittingPaste(false);
    }
  };

  return (
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
      <Spacer y={3} />
      {pasteResponseMessage && (
        <>
          <Alert className="flex justify-between items-center" color="success">
            <span>
              <strong>Paste URL: </strong>
              {`${window.location.origin}/p/${pasteResponseMessage}`}
            </span>
            <Button
              color="primary"
              size="sm"
              startContent={<FaClipboard />}
              onPress={() => {
                copyTextToClipboard(
                  `${window.location.origin}/p/${pasteResponseMessage}`,
                );
              }}
            >
              Copy
            </Button>
          </Alert>
          <Spacer y={3} />
          <Alert className="flex justify-between items-center" color="success">
            <span>
              <strong>Info URL: </strong>
              {`${window.location.origin}/i/${pasteResponseMessage}`}
            </span>
            <Button
              color="primary"
              size="sm"
              startContent={<FaClipboard />}
              onPress={() => {
                copyTextToClipboard(
                  `${window.location.origin}/i/${pasteResponseMessage}`,
                );
              }}
            >
              Copy
            </Button>
          </Alert>
        </>
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
  );
};

export default PastebinForm;
