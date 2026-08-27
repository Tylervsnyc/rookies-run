import { RevengeLoader } from '@/components/run/RevengeLoader';
import { SPLASH_BG } from '@/components/run/NativeSplash';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: SPLASH_BG }}
    >
      <RevengeLoader size={140} />
    </div>
  );
}
