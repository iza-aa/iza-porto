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
    <h1 className={`mb-0 max-w-full font-inter font-bold capitalize leading-[0.88] tracking-tighter [text-wrap:balance] lg:mb-20 ${className}`}>
      {children}
    </h1>
  )
}

export function SubTitle({ children, className = '' }: SubTitleProps) {
  // Split text into first character and the rest
  const firstChar = children.charAt(0)
  const restText = children.slice(1)

  return (
    <h2 className={`mt-0 lg:mt-20 ${className}`}>
      <span className="font-pinyon-script text-[clamp(3rem,9vw,6rem)] lg:leading-[0] ">{firstChar}</span>
      <span
        className="font-inknut-antiqua text-[clamp(1.125rem,3vw,2.25rem)] leading-tight"
        dangerouslySetInnerHTML={{ __html: restText }}
      />
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
      <div className="mt-0 lg:mt-6">
        <SubTitle className={subtitleClassName}>{subtitle}</SubTitle>
      </div>
    </div>
  )
}
