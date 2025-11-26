"use client";

import Image from 'next/image';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray';
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const variantStyles = {
  blue: 'from-blue-400 to-blue-600',
  green: 'from-green-400 to-green-600',
  purple: 'from-purple-400 to-purple-600',
  red: 'from-red-400 to-red-600',
  yellow: 'from-yellow-400 to-yellow-600',
  gray: 'from-gray-400 to-gray-600',
};

export default function Avatar({ name, src, size = 'md', variant = 'blue' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <div className={`${sizeStyles[size]} relative rounded-full overflow-hidden`}>
        <Image
          src={src}
          alt={name}
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full bg-gradient-to-br ${variantStyles[variant]}
        flex items-center justify-center text-white font-semibold
      `}
    >
      {initials}
    </div>
  );
}

// Avatar con info (nombre y subtítulo)
interface AvatarWithInfoProps extends AvatarProps {
  subtitle?: string;
}

export function AvatarWithInfo({ name, subtitle, ...avatarProps }: AvatarWithInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} {...avatarProps} />
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
