'use client'
import { ColorChanger } from '@/components/ColorChanger'
import { Box, Button, Group } from '@mantine/core'
import React from 'react'

const page = () => {
  return (
    <div>
       <h2>public page</h2>
       <Group>
        <Button color="ocean-blue">Ocean blue button</Button>
        <Button color="bright-pink" variant="filled">
          Bright pink button
        </Button>
        <Button  color="m-blue" variant="filled">
          Bright pink button
        </Button>
      </Group>
      <ColorChanger />
      <Button  className=' px-20 bg-amber-500 dark:bg-pink-600'>Crazy</Button>
      <button className=' bg-green-500 dark:bg-red-800 mx-10'>Hello from the other side</button>

      <Box  bg="m-orange" c="white" p="md" fw={700}>
        it is pink in dark mode and cyan in light mode
      </Box>

      <Box  p="md" fw={700}>
        Primary color. it is pink in dark mode and cyan in light mode
      </Box>

      <Button className=' dark:border-amber-500 dark:text-amber-600' variant='outline'>Primary color</Button>

      <Group>
        <Button color="lime.4" variant="filled">
          Lime filled button
        </Button>

        <Button color="orange" variant="light">
          Orange light button
        </Button>

        <Button variant="danger">Danger button</Button>
      </Group>
    </div>
  )
}

export default page