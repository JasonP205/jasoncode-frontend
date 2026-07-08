"use client";

import { AlertDialog, Button } from "@heroui/react";
import type { ReactNode } from "react";

export type ConfirmDialogType =
  | "success"
  | "warning"
  | "info"
  | "danger";

interface ConfirmDialogProps {
  children: ReactNode;

  title: string;
  message: string;

  type?: ConfirmDialogType;

  acceptText?: string;
  discardText?: string;

  onAccept?: () => void;
  onDiscard?: () => void;
}

const statusMap = {
  success: "success",
  warning: "warning",
  info: "accent",
  danger: "danger",
} as const;

const buttonVariantMap = {
  success: "primary",
  warning: "primary",
  info: "primary",
  danger: "danger",
} as const;

export default function ConfirmDialog({
  children,
  title,
  message,
  type = "info",
  acceptText,
  discardText,
  onAccept,
  onDiscard,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        {children}
      </AlertDialog.Trigger>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[420px]">
            {(dialog) => (
              <>
                <AlertDialog.CloseTrigger />

                <AlertDialog.Header>
                  <AlertDialog.Icon status={statusMap[type]} />
                  <AlertDialog.Heading>{title}</AlertDialog.Heading>
                </AlertDialog.Header>

                <AlertDialog.Body>
                  <p>{message}</p>
                </AlertDialog.Body>

                {(discardText || acceptText) && (
                  <AlertDialog.Footer>
                    {discardText && (
                      <Button
                        variant="tertiary"
                        onPress={() => {
                          onDiscard?.();
                          dialog.close();
                        }}
                      >
                        {discardText}
                      </Button>
                    )}

                    {acceptText && (
                      <Button
                        variant={buttonVariantMap[type]}
                        onPress={() => {
                          onAccept?.();
                          dialog.close();
                        }}
                      >
                        {acceptText}
                      </Button>
                    )}
                  </AlertDialog.Footer>
                )}
              </>
            )}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}