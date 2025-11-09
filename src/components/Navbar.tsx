"use client";

interface Props {
  email: string;
}

export default function Navbar({ email }: Props) {
  return (
    <nav className="bg-linear-to-r from-gray-950 to-gray-800 text-white shadow-lg sticky top-0 z-10 ml-64">
      <div className="w-full px-8 py-4 flex justify-end">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium">{email}</span>
        </div>
      </div>
    </nav>
  );
}
