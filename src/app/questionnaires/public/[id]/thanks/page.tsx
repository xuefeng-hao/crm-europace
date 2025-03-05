import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            感谢您的回复！
          </h2>
          <p className="mt-2 text-center text-sm text-black">
            您的回答已经成功提交。我们将尽快与您联系。
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
} 