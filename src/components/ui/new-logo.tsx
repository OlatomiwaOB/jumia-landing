import Image from 'next/image';
import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
import pos from '@/assets/placeholders/pos.png';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL ?? pos;
  return (
    <Link
      href={siteSettings.logo.href}
      className={cn('inline-flex items-center', className)}
      {...props}
    >
      <span
        className="relative overflow-hidden"
        style={{
          width: siteSettings.logo.width,
          height: siteSettings.logo.height,
        }}
      >
        <Image
          src={logoUrl}
          alt={siteSettings.logo.alt}
          layout="fill"
          objectFit="contain"
          loading="eager"
          className=""
          unoptimized
        />
      </span>

      {/* <span className="text-2xl font-bold" style={{ color: '#0071ce' }}>
        MMCP
      </span> */}
    </Link>
  );
};

export default Logo;
