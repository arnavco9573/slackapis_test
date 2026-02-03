import { cn } from '@/lib/utils';
import Image from 'next/image';
import WLlogo from '../../../public/master-logo.png';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      unoptimized
      src={WLlogo}
      alt="WL Partner Logo"
      width={40}
      height={48}
      className={cn('object-cover', className)}
    />
  );
}
