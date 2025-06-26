'use client'
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Burger } from '@mantine/core';

export function MobileMainNavbar() {
  const [opened, { open, close }] = useDisclosure(false);

 // const [opened, { toggle }] = useDisclosure();
  

  return (
    <div className=' lg:hidden'>
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>

      <Burger opened={opened} onClick={open} aria-label="Toggle navigation" />;
    </div>
  );
}