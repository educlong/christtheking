import { useState, useRef, useEffect } from 'react';

export default function usePostCardLogic({ content, images }) {
  // useRef tạo ra biến có thể thay đổi mà không làm component re-render.
  // touchStartX lưu vị trí X khi người dùng bắt đầu chạm (touch start).
  // touchEndX lưu vị trí X khi người dùng di chuyển ngón tay (touch move).
  // Dùng cho thao tác vuốt (swipe) để chuyển ảnh (trái/phải).
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  // Dùng để lấy reference đến DOM element của fullscreen viewer.
  // Mục đích: gọi .focus() để viewer nhận các sự kiện bàn phím (ESC, ←, →).
  const viewerRef = useRef(null);
  // expanded = trạng thái đã nhấn “See more” hay chưa.
  // Nếu false: chỉ hiển thị 180 ký tự đầu.
  // Nếu true: hiện toàn bộ nội dung.
  const [expanded, setExpanded] = useState(false);
  // Trạng thái mở/đóng fullscreen viewer.
  // false = viewer không hiển thị.
  // true = viewer đang hiển thị.
  const [viewerOpen, setViewerOpen] = useState(false);
  // Index của ảnh hiện tại đang được xem trong fullscreen viewer.
  // Ví dụ: 0 = ảnh đầu tiên, 1 = ảnh thứ hai
  const [currentIndex, setCurrentIndex] = useState(0);
  // Số ký tự tối đa hiển thị trước khi bị rút gọn.
  const maxLength = 180;
  // Kiểm tra xem nội dung có dài hơn 180 ký tự không.
  // Nếu dài → hiển thị "See more".
  const isLong = content.length > maxLength;
  // Nếu đã nhấn "See more" (expanded = true) → hiện toàn nội dung.
  // Ngược lại → chỉ hiện 180 ký tự đầu.
  const displayText = expanded ? content : content.slice(0, maxLength);
  // Chỉ lấy 4 ảnh đầu tiên để hiển thị trong card.
  // Nếu nhiều hơn → hiển thị "+x" ở ảnh thứ 4.
  const displayedImages = images.slice(0, 4);
  // Số ảnh còn lại sau 4 ảnh đầu.
  // Nếu = 0 → không hiển thị "+x".
  const extraCount = images.length - 4;
  // Mở fullscreen viewer.
  // Đặt currentIndex thành ảnh được click.
  // Ví dụ click ảnh thứ 3 → mở viewer và chuyển đến ảnh số 2.
  const openViewer = (index) => {
    setCurrentIndex(index);
    setViewerOpen(true);
  };
  // Khi viewerOpen trở thành true, chạy code trong useEffect.
  // Dòng viewerRef.current.focus() giúp viewer nhận sự kiện bàn phím:
  // ESC → thoát
  // ← → chuyển ảnh
  // Nếu không focus → bạn sẽ không thể dùng phím.
  useEffect(() => {
    if (viewerOpen && viewerRef.current) viewerRef.current.focus();
  }, [viewerOpen]);
  // Hàm đóng fullscreen viewer.
  const closeViewer = () => setViewerOpen(false);
  // Touch handlers (swipe)
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length)
      touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length) touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 60;
    if (distance > swipeThreshold && currentIndex < images.length - 1)
      setCurrentIndex((i) => i + 1);
    if (distance < -swipeThreshold && currentIndex > 0)
      setCurrentIndex((i) => i - 1);
  };
  return {
    viewerRef,
    expanded,
    setExpanded,
    viewerOpen,
    currentIndex,
    setCurrentIndex,
    isLong,
    displayText,
    displayedImages,
    extraCount,
    openViewer,
    closeViewer,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
