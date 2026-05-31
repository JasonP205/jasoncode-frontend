import React from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section data-anchor="cta" className="h-screen w-full flex flex-col items-center justify-center text-center bg-black px-4">
      <h2 className="text-4xl sm:text-6xl font-serif text-white mb-6">
        Cùng nhau kiến tạo <br />
        <span className="italic text-gray-400">tương lai số.</span>
      </h2>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
        Bạn có một ý tưởng tuyệt vời hay một dự án cần thực hiện? Hãy bắt đầu ngay hôm nay.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/contact" passHref>
          <Button size="lg" variant="primary" className="w-full sm:w-auto">
            Liên hệ
          </Button>
        </Link>
        <Link href="/pricing" passHref>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            Xem thêm
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
