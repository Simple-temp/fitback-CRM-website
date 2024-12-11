import { toAbsoluteUrl } from '@/utils';
import avater from "../../../public/img/logo.png"
const ScreenLoader = () => {
  return <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out">
      <img className="h-[30px] max-w-none" src={avater} alt="logo" />
      <div className="text-gray-500 font-medium text-sm">Loading...</div>
    </div>;
};
export { ScreenLoader };