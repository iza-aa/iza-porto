'use client'

import React from 'react'

interface TitleProps {
  children: string
  className?: string
}

interface SubTitleProps {
  children: string
  className?: string
}

interface TitleHeadingProps {
  title: string
  subtitle: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function Title({ children, className = '' }: TitleProps) {
  return (
    <h1 className={`font-anton text-6xl md:text-8xl ${className}`}>
      {children}
    </h1>
  )
}

export function SubTitle({ children, className = '' }: SubTitleProps) {
  // Split text into first character and the rest
  const firstChar = children.charAt(0)
  const restText = children.slice(1)

  return (
    <h2 className={className}>
      <span className="font-pinyon-script text-4xl md:text-6xl md:leading-[0] ">{firstChar}</span>
      <span className="font-inknut-antiqua text-lg md:text-xl lg:text-2xl ">{restText}</span>
    </h2>
  )
}

export function TitleHeading({
  title,
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}: TitleHeadingProps) {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <Title className={titleClassName}>{title}</Title>
      <div className="mt-10">
        <SubTitle className={subtitleClassName}>{subtitle}</SubTitle>
      </div>
    </div>
  )
}
