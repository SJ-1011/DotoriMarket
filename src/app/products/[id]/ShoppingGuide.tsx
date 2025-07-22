export default function ShoppingGuide() {
  return (
    <section className="prose max-w-none">
      <h2 className="text-xl font-semibold mb-4">쇼핑 가이드</h2>
      <p>도토리섬에서는 안전한 결제와 빠른 배송을 약속합니다. 결제 방법은 신용카드, 무통장입금, 간편결제 등 다양하게 지원합니다.</p>
      <h3>배송 안내</h3>
      <ul className="list-disc list-inside">
        <li>평일 오후 3시 이전 주문 시 당일 출고됩니다.</li>
        <li>주말 및 공휴일 주문은 다음 영업일에 출고됩니다.</li>
        <li>배송 기간은 지역에 따라 1~3일 정도 소요됩니다.</li>
      </ul>
      <h3>교환 및 반품 안내</h3>
      <p>상품 수령 후 7일 이내에 고객센터로 연락 주시면 교환 및 반품이 가능합니다. 단, 상품 훼손 시에는 교환 및 반품이 제한될 수 있습니다.</p>
    </section>
  );
}
