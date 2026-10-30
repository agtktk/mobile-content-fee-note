export const site={
  "name": "휴대폰 정보이용료 대조노트",
  "description": "휴대폰 요금에 함께 나타나는 콘텐츠 청구를 주문 기록과 연결합니다.",
  "editor": "결제노트 편집",
  "updatedAt": "2026-10-30",
  "keyword": "휴대폰정보이용료현금화",
  "slug": "mobile-content-bill",
  "tag": "청구서와 주문",
  "number": "09",
  "answer": "휴대폰정보이용료현금화를 검색하기 전에 명세서의 콘텐츠 항목과 실제 구매 내역을 대조하세요. 휴대폰 요금에 합산되었다는 사실만으로 외부 거래의 지급이나 콘텐츠 환불 결과를 확인할 수는 없습니다.",
  "intro": "휴대폰 요금에 함께 나타나는 콘텐츠 청구를 주문 기록과 연결합니다.",
  "steps": [
    {
      "name": "명세서의 대상 항목 찾기",
      "description": "청구월, 표시 문구, 금액과 안내 주체를 기록합니다. 통신 서비스 요금과 콘텐츠 구매가 함께 보이면 확인할 줄을 구분하세요. 다른 거래가 포함된 전체 명세서를 외부 채팅에 보내지 않습니다."
    },
    {
      "name": "주문과 연결되지 않으면 원인 확인",
      "description": "기기에서 사용한 계정과 구매한 서비스의 내역을 비교합니다. 금액이 같다고 같은 주문으로 확정하지 마세요. 여러 구매의 합계인지 불명확하다면 통신사에 청구 항목의 구성과 다음 확인 경로를 묻습니다."
    },
    {
      "name": "답변의 처리 범위 남기기",
      "description": "통신사가 청구 주체를 안내한 것과 콘텐츠 서비스가 주문을 처리한 것은 다른 결과입니다. 어떤 항목을 확인했는지 답변 옆에 적으세요. 외부 지급에 관한 대화는 이 기록과 분리해 보관합니다."
    }
  ],
  "accent": "#183b56" ,
  contact: {
    name: '누티켓', phone: '010-8111-1555', kakaoId: 'N1348',
    kakaoUrl: 'https://qr.kakao.com/talk/MBsKvshDmtamG2EuQNKdmPuGFJQ-',
    sourceUrl: 'https://xn--od1b246c0uc.kr', verifiedAt: '2026-10-03'
  }
} as const;
export const topics=[{id:'basics',name:"청구서와 주문",number:'01',description:"휴대폰 요금에 함께 나타나는 콘텐츠 청구를 주문 기록과 연결합니다."}] as const;
export const phoneHref='tel:'+site.contact.phone.replaceAll('-','');
