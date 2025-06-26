'use client'
import { Menu, MenuProps} from '@mantine/core';

export function CDropdown({trigger, props, children}:{props: Partial<MenuProps> ,trigger:React.ReactNode, children:React.ReactNode}) {
  return (
    <Menu {...props}>
      <Menu.Target>
        {trigger}
      </Menu.Target>
        {children}
    </Menu>
  );
}