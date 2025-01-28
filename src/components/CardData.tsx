"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type CardDataProps = {
  title: string
  data: string
} & React.HTMLAttributes<HTMLDivElement>

export default function CardData({ title, data, ...props }: CardDataProps) {
  return (
    <Card className='w-[400px] shadow-sm' {...props}>
      <CardContent className='flex flex-col px-4 py-6 space-y-3'>
        <span className='text-xl'>{title}</span>
        <span className='text-4xl'>1,000</span>
        <span className='text-sm'>Today&apos;s Converted</span>
      </CardContent>
    </Card>
  )
}
