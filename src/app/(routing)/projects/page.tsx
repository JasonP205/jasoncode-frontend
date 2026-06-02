import ProjectList from "@/components/ProjectList";
export const metadata = {
  title: "Tất cả dự án",
  description: "Khám phá tất cả dự án mà tôi đã thực hiện, từ các trang web cá nhân đến các ứng dụng phức tạp. Mỗi dự án đều được thiết kế và lập trình với sự chú ý đến chi tiết, hiệu suất và trải nghiệm người dùng. Dù bạn đang tìm kiếm cảm hứng cho dự án của mình hay muốn xem những gì tôi có thể làm, hãy duyệt qua danh sách dự án của tôi để khám phá sự sáng tạo và kỹ năng của tôi trong lĩnh vực phát triển web."
}
const page = () => {
  return (
    <ProjectList />
  )
}

export default page