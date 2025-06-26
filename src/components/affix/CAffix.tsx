'use client'
import { IconArrowUp } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';
import { ActionIcon, Affix,  Transition } from '@mantine/core';

export function CAffix() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <ActionIcon className=" bg-secondary hover:bg-primary" radius={'xl'} style={transitionStyles} onClick={() => scrollTo({ y: 0 })} 
            size={50} variant="filled" >
                <IconArrowUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </>
  );
}