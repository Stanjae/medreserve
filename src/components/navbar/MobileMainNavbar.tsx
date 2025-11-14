'use client'
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Burger, NavLink } from '@mantine/core';
import { toplinks } from '@/constants/urls';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileMainNavbar() {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <div className=" lg:hidden">
      <Drawer
        opened={opened}
        onClose={close}
        styles={{ content: { backgroundColor: "var(--mantine-color-m-blue-6)" }, header:{backgroundColor:"var(--mantine-color-m-blue-6)"} }}
      >
        <section>
          {toplinks.map((item) => (
                    <NavLink
            styles={{label:{fontSize:20, textTransform:"capitalize"}}}
              component={Link}
              className={`border-b-[0.5px] border-cyan-500/55 py-5 ${item.href == pathname ? "" : "text-white"} hover:bg-transparent hover:text-primary`}
                      variant="subtle"
                      active={item.href == pathname}
                      label={item.label}
                      key={item.href}
                      href={item.href}
                    />
                  ))}
        </section>
      </Drawer>
      <Burger opened={opened} onClick={open} aria-label="Toggle navigation" />;
    </div>
  );
}