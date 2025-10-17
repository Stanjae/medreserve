'use client'
import useHandleCopyToClipBoard from "@/hooks/useHandleCopyToClipBoard";
import { ActionIcon } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export const CopyButton = ({ text }: { text: string }) => {
  const {copied, handleCopyToClipboard} = useHandleCopyToClipBoard()

  return (
    <ActionIcon
          onClick={async () => await handleCopyToClipboard(text)}
          size="xs"
          radius="xs"
          variant="subtle"
    >
      {copied ? (
        <IconCheck size={16} className="text-green-600" />
      ) : (
        <IconCopy size={16} className="text-gray-500" />
      )}
    </ActionIcon>
  );
};
