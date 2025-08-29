import { Link, useSearchParams } from "react-router-dom";
import { data } from "../assets/data/data";
import { getRegExp } from "korean-regexp";
import { useEffect, useState } from "react";

// 기존 방식
// function Search() {
//   const [searchParams] = useSearchParams();
//   const param = searchParams.get("animal");
//   const reg = getRegExp(param);

//   const filteredData = data.filter((el) => el.name.match(reg));

//   return (
//     <ul>
//       {filteredData.map((el) => (
//         <li key={el.id}>
//           <Link to={`/detail/${el.id}`}>
//             <img src={el.img} alt={el.name} />
//             <div>{el.name}</div>
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// }

// debounce 적용 Search 컴포넌트
function Search() {
  const [searchParams] = useSearchParams();
  // 화면에 표시할 데이터 상태 (초기값: 전체 data를 보여줌)
  const [filteredData, setFilteredData] = useState(data);
  // URL 쿼리스트링에서 animal 파라미터 추출
  const param = searchParams.get("animal");

  useEffect(() => {
    // 검색어가 없으면 전체 데이터 표시
    if (!param) {
      setFilteredData(data);
      return;
    }

    // 한글 초성/중성 검색을 위한 정규식 생성
    const reg = getRegExp(param);

    // debounce: 1초 대기 후 필터링 실행
    // 사용자가 타이핑을 멈춘 후 1초 뒤에 검색이 실행된다.
    const debounceTimer = setTimeout(() => {
      // 정규식과 매칭되는 데이터만 필터링
      const newFilteredData = data.filter((el) => el.name.match(reg));
      setFilteredData(newFilteredData);
    }, 1000);

    // cleanup 함수: 컴포넌트 언마운트 또는 param 변경 시 실행
    // 이전 타이머를 취소하여 불필요한 검색 방지
    // 예: "강아" 입력 중 "강아지"로 바뀌면 "강아"의 타이머는 취소된다.
    return () => clearTimeout(debounceTimer);
  }, [param]);
  // param이 변경될 때마다 effect 재실행

  return (
    <ul>
      {filteredData.map((el) => (
        <li key={el.id}>
          <Link to={`/detail/${el.id}`}>
            <img src={el.img} alt={el.name} />
            <div>{el.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Search;
