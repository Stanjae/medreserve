'use client'
import { Group, Text } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, } from '@mantine/dropzone';
import { useState } from 'react';
import { toast } from 'sonner';

export function DropzoneWrapper({props, handleDrop, maxSize, maxFiles, acceptFiles, title, subtitle, file}:
  {props?: Partial<DropzoneProps>; subtitle?:string; acceptFiles?: string[]; maxSize?: number; maxFiles?: number; 
  title?:string; file?:File | null; handleDrop:React.Dispatch<React.SetStateAction<File | null>>}) {
    const [loading, setLoading] = useState(false);
  return (
    <Dropzone loading={loading} bd={'0.2px solid var(--mantine-color-dimmed)'} className=' rounded-lg' h={200}
      onDrop={(files) =>{
        setLoading(true); 
        handleDrop(files[0]); 
        setLoading(false);
      }}
      onReject={(files) => toast.error(`Rejected ${files.length} file(s)`)}
      maxSize={maxSize}
      maxFiles={maxFiles}
      accept={acceptFiles}
      {...props}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {title}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {subtitle}
          </Text>
           <Text size="xl" c="dimmed" inline mt={7}>
            {file?.name}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}